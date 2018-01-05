/**
 * Module dependencies.
 */
var C = require('./constants');
var E = require('../lib/constants');
//process.on('uncaughtException', function (exception) {
//  console.log('########## SERVER CRASHED WITH UNCAUGHT EXCEPTION ##########');
//  console.log(exception);
//});
var winston = require('winston');
console.log(C.config)

var mongoose = require('../lib/node_modules/mongoose');
// use createConnection instead of calling mongoose.connect so we can use
// multiple connections
mongoose.connection.on('open', function (ref) {
  winston.log('info', 'Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
  winston.log('error', 'Could not connect to mongo server!', err);
});
mongoose.connection.on('close', function() {
  console.log("DB connection closed");
});
var BaseModel = require('../lib/models/BaseModel');
var connectoConnection = mongoose.createConnection(process.env.MONGO_URL || E.config.uiMongoUrl,
		{auto_reconnect: true, server: { socketOptions: { keepAlive: 1 } }});
BaseModel.setConnectoConnection(connectoConnection);
mongoose.set('debug', true);

var models = require('../lib/models');
var caches = {};
caches.ProjectCache = require('../lib/cache/ProjectCache');
caches.PushNotificationCache = require('../lib/cache/PushNotificationCache');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var expressSession = require('express-session');
var flash = require('connect-flash');
var http = require('http');
var baucis = require('../lib/node_modules/baucis');
var path = require('path');
var mailUtils = require('./utils/mail');
var log4js = require('log4js');
var logger = require('./logger').express_logger;
var passport = require('passport');
var app = express();

app.set('port', process.env.PORT || E.config.uiPort);

app.set('views', path.join(__dirname, 'views'));
var exphbs = require('express-handlebars');
// Configure express to use handlebars templates
app.engine('.handlebars', exphbs({extname: '.handlebars'}));
app.set('view engine', 'handlebars');
  
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO, format: ':method :url' }));
app.use(cookieParser('tekiru'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ type: 'text/plain', limit: '50mb' }));
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));

app.use(methodOverride());
app.use(cookieSession({
    // keys: ['tekiru', 'connecto'],
    secret: 'tekiru',
}));
app.use(expressSession({ secret: 'tekiru', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});
app.use(flash());

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

// If in dev mode, don't cache static resources
var staticContentMaxAge = 0;
if (process.env.NODE_ENV === 'production') {
  staticContentMaxAge = 1000 * 60 * 60 * 24;
}

// development only
if (E.config.environment == E.ENVIRONMENTS.DEVELOPMENT) {
  function logErrors(err, req, res, next) {
    winston.log('error', 'app.js->logErrors():', err.stack);
    next(err);
  }
  app.use(logErrors);
}
var mail = sesMail = mailUtils.getSesMailer();
var Project = models.Project;
// Log uncaught exception as well

var ProjectCache = caches.ProjectCache;
ProjectCache.load();
// var PushNotificationCache = caches.PushNotificationCache;
//   PushNotificationCache.load();

var api_routes_connect = require('./routes/index');
var chromePushRoutes = require('./routes/chrome_push');
var api_router_connect = express.Router();
app.use(api_router_connect);
var server = http.createServer(app);

if (E.config.environment == E.ENVIRONMENTS.DEVELOPMENT ||
    E.config.environment == E.ENVIRONMENTS.PROD) {
  app.use(express.static(path.join(__dirname, 'public'), {maxAge: staticContentMaxAge }));
}

// This is because baucis does not take connection object.
mongoose.connect(process.env.MONGO_URL || E.config.uiMongoUrl);  

var User = models.User;
var Tags = models.Tags;
var context = {'mail': mail };

var ensureAuthenticated = function(redirectUrl) {
    if (!redirectUrl) redirectUrl = '/login';
    return function (req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect(redirectUrl);
    }
};
require('./middleware/passportAuth')(passport);
var baucisAuth = require ('./middleware/baucisAuth');

api_router_connect.get(/^\/$/, ensureAuthenticated(), function(req, res) {
  res.redirect(api_routes_connect.getDefaultAppUrl(req));
});

  //displays our signup page
api_router_connect.get('/signin', function(req, res){
  api_routes_connect.getRegistrationPage(req, res);
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
api_router_connect.post('/signin', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin',
  failureFlash : true
  })
);

api_router_connect.get('/login', function(req, res) {
  api_routes_connect.getLoginPage(req, res);
});

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
api_router_connect.post('/login', passport.authenticate('local-login', { 
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
api_router_connect.get('/accounts/logout', function(req, res){
  api_routes_connect.logoutUser(req, res);
});

api_router_connect.get(/\/n\/user\/(.*)/, ensureAuthenticated(), function (req, res) {
  api_routes_connect.switchUser(req, res, ProjectCache);
});

api_router_connect.get('/forgot-password', function (req, res) {
  api_routes_connect.getForgotPage(req, res);
});

api_router_connect.post('/forgot-password', function (req, res, next) {
  api_routes_connect.postForgotPage(req, res, next, context);
});

api_router_connect.get('/reset/:token', function(req, res) {
  api_routes_connect.getResetPassword(req, res);
});

api_router_connect.post('/reset/:token', function(req, res) {
  api_routes_connect.postResetPassword(req, res, context);
});

// api_router_connect.get('/app', function (req, res){
//   api_routes_connect.getPushNotificationSuffixes(req,res);
// });

api_router_connect.get(/\/n\/push-notificationsApp\/(.+)/, ensureAuthenticated(), function (req, res){
  api_routes_connect.getPushNotificationsAppSuffixes(req,res);
});

api_router_connect.get('/n/push_notifications', ensureAuthenticated(), function (req, res){
  api_routes_connect.getPushNotifications(req,res);
});

api_router_connect.get('/n/push_notifications_debug', ensureAuthenticated(), function (req, res){
  api_routes_connect.getPushNotificationsDebug(req,res);
});

api_router_connect.get(/(\/n$)|(\/n\/$)/, ensureAuthenticated(), function(req, res) {
  res.redirect(api_routes_connect.getDefaultAppUrl(req));
});

api_router_connect.get(/(\/notifications|)\/notification_context/, ensureAuthenticated(), function(req, res) {
  api_routes_connect.getNotificationContext(req, res, ProjectCache);
});

api_router_connect.get('/update', function(req, res) {
  api_routes_connect.update(req, res, models, caches);
});

api_router_connect.get('/api/getChromePushPackage', function(req, res) {
  chromePushRoutes.getChromePackage(req, res);
});

baucis.rest('PushNotification');//.request(baucisAuth());
baucis.rest('ChromeNotification');//.request(baucisAuth());
baucis.rest('Project');//.request(baucisAuth());
baucis.rest('User');//.request(baucisAuth());
baucis.rest('Tags');
app.use('/api/v1', baucis());

server.listen(app.get('port'), function(){
  winston.log('info', 'Express server listening on port ' + app.get('port'));
});
