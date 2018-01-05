var E = require('../lib/constants');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('../lib/node_modules/mongoose');

var app = express();
var kue = require('kue');
var queue = kue.createQueue();
var ui = require('kue-ui');
var debug = require('debug')('job:server');
var dbqueue = require('./utils/db-queue');
var api_routes = require('./routes/api.js');
var stats_routes = require('./routes/stats.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
ui.setup({
    apiURL: '/api', // IMPORTANT: specify the api url
    baseURL: '/kue', // IMPORTANT: specify the base url
    updateInterval: 5000 // Optional: Fetches new data every 5000 ms
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ type: 'text/plain', limit: '50mb' }));
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var allowCrossDomain = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.headers && req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'accept, content-type, Origin, X-Requested-With, Content-Type, access_token,Accept, access_token, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method == 'OPTIONS' || req.method == 'HEAD') {
    res.sendStatus(200);
    return;
  }
  next();
};
app.use(allowCrossDomain);

// var dbJobQueue = new dbqueue.DbQueue(models.JobQueue,
//                                             C.OP_QUEUE_TYPE.UPSERT,
//                                             200);
// Mount kue JSON api
app.use('/api', kue.app);
// Mount UI
app.use('/kue', ui.app);

var router = express.Router();

// use createConnection instead of calling mongoose.connect so we can use
// multiple connections
mongoose.connection.on('open', function (ref) {
  winston.log('info', 'Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
  winston.log('error', 'Could not connect to mongo server!', err);
});
var BaseModel = require('../lib/models/BaseModel');
var JobConnection = mongoose.createConnection(E.config.jobsMongoUrl,
                                              {auto_reconnect: true, server: { socketOptions: { keepAlive: 1 } }});
BaseModel.setJobConnection(JobConnection);

if (process.env.NODE_ENV!=='production') {
  mongoose.set('debug', true);
}
var models = require('./models');
var caches = {};
caches.MessageIdCache = require('./cache/MessageIdCache');
caches.MessageIdCache.load();
var context = {
  // dbJobQueue : dbJobQueue,
  kueJobQueue : queue,
  messageIdCache: caches.MessageIdCache
}

var modelsClass = require('../api/node_modules/express-cassandra');
var modelStore = require('../api/modelStore');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: E.config.cassandraContactPoints, keyspace: 'events'});

function postDBConnection(modelsClass) {
  modelStore.setModels(modelsClass.instance);
  context.cassandraModels = modelStore.getModels();
  context.client = client;
}; 

modelsClass.setDirectory( __dirname + '/../api/models').bind(
    {
        clientOptions: {
            contactPoints: E.config.cassandraContactPoints,
            protocolOptions: { port: 9042 },
            keyspace: 'events',
            queryOptions: {consistency: modelsClass.consistencies.one}
        },
        dropTableOnSchemaChange: false,
        dontCreateKeyspace: false
    },
    function(err) {
      if(err) {
        throw err;
      }
      else {
        console.log('Connected to DB');
        postDBConnection(modelsClass);
      }
    }
);


router.post('/send-android-push-notification', function(req, res, next) {
  api_routes.sendAndroidPushNotification(req, res, context, models);
});

router.post('/send/android-push-notification', function(req, res, next) {
  api_routes.sendAndroidPushNotification(req, res, context, models);
});

router.post('/send/android-push-notification-via-mongodb', function(req, res, next) {
  api_routes.sendAndroidPushNotificationviaMongoDB(req, res, context, models);
});

router.post('/send/android-push-notification-ui', function(req, res, next) {
  api_routes.sendAndroidPushNotificationUi(req, res, context, models);
});

router.post('/send/android-push-notification-tag', function(req, res, next) {
  api_routes.sendAndroidPushNotificationToTag(req, res, context, models);
});

router.post('/send/chrome-push-notification-ui', function(req, res, next) {
  api_routes.sendChromePushNotificationUi(req, res, context, models);
});

router.post('/send/chrome-push-notification-tag', function(req, res, next) {
  api_routes.sendChromePushNotificationToTag(req, res, context, models);
});

router.post('/send/chrome-push-notification-all', function(req, res, next) {
  api_routes.sendChromePushNotificationToAll(req, res, context, models);
});

router.post('/send/sms', function(req, res, next) {
  api_routes.sendSms(req, res, context, models);
});

router.post('/send/sms-ui', function(req, res, next) {
  api_routes.sendSmsUi(req, res, context, models);
});

router.get('/get-android-push-notification-count', function(req, res, next) {
  api_routes.getAndroidPushNotificationCount(req, res, context, models);
});

router.get('/getJobStatsProject', function (req, res, next) {
  api_routes.getJobStats(req, res, models);
});

router.get('/getRegistrationIdStats', function (req, res, next) {
  api_routes.getRegistrationIdStats(req, res, models);
});

router.get('/response/sms_gupshup', function(req, res, next) {
  stats_routes.collectGupshupSmsResponseStat(req, res, context, models);
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3007');
app.set('port', port);

/**
 * Create HTTP server.
 */

var http = require('http');
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function(){
  console.log('info', 'Express server listening on port ' + app.get('port'));
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
