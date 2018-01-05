var E = require('../lib/constants');
var C = require('./constants');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('../lib/node_modules/mongoose');
var dbqueue = require('../api/utils/db-queue');

var app = express();
var debug = require('debug')('job:server');
// var api_routes = require('./routes/api.js');

app.set('views', path.join(__dirname, 'views'));
var exphbs = require('express-handlebars');
// Configure express to use handlebars templates
app.engine('.handlebars', exphbs({extname: '.handlebars'}));
app.set('view engine', 'handlebars');

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

var mongoose = require('../lib/node_modules/mongoose');
// use createConnection instead of calling mongoose.connect so we can use
// multiple connections
mongoose.connection.on('open', function (ref) {
  winston.log('info', 'Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
  winston.log('error', 'Could not connect to mongo server!', err);
});
var BaseModel = require('../lib/models/BaseModel');
var connectoConnection = mongoose.createConnection(process.env.MONGO_URL || E.config.uiMongoUrl,
                                                   {auto_reconnect: true, server: { socketOptions: { keepAlive: 1 } }});
BaseModel.setConnectoConnection(connectoConnection);

if (process.env.NODE_ENV!=='production') {
  mongoose.set('debug', true);
}
  mongoose.set('debug', true);
var libModels = require('../lib/models');
var push_router = require('./routes/index');
var router = express.Router();
var caches = {};
caches.ProjectCache = require('../lib/cache/ProjectCache');
caches.ProjectCache.load();

var PushActionStatsQueue = new dbqueue.DbQueue(libModels.PushActionStats, C.OP_QUEUE_TYPE.UPSERT, 2000, 60000);

var context = {
  'PushActionStatsQueue': PushActionStatsQueue,
};
router.post('/chromePush/track', function(req, res, next) {
  push_router.trackChromePushStatus(req,res, libModels, caches, context);
  console.log("chromepush track calls");
});

router.get('/chromePush/track', function(req, res, next) {
  push_router.trackChromePushStatus(req,res, libModels, caches, context);
  console.log("chromepush track calls");
});

router.get('/getChromePushStats', function(req, res, next) {
  push_router.getChromePushStats(req,res, libModels, caches, context);
});

app.get(/html5PushNonSsl(.)*/, function (req, res) {
  push_router.pushNotificationPopupForNonSslSites(req, res);
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

var port = normalizePort(process.env.PORT || '3009');
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
