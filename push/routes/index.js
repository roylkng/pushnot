'use strict';

var AnalyticsService = require('../services/analytics.service.js');

exports.trackChromePushStatus = function(req, res, models, cache, context) {
  var writeKey = req.query.writeKey;
  var actionType = req.query.actionType;
  var notificationId = req.query.notificationId || "_CPN_";
  var profileId = req.query.profileId || null;
  var currentHour = Math.floor( new Date().getTime() / (1000*60*60) );
  var projectId = cache.ProjectCache.findByWriteKey(writeKey)._id;
  console.log(req.query);
  console.log(projectId);

  if (projectId && actionType && notificationId) {
    AnalyticsService.updateChromePushNotificationActionCount(notificationId,
      actionType, projectId, currentHour, models, context);
    res.status(200).end();
  } else {
    res.status(400).end('Invalid input(s)');
  }
};

exports.getChromePushStats = function(req, res, models, cache, context) {
  var writeKey = req.query.writeKey;
  var projectId = cache.ProjectCache.findByWriteKey(writeKey)._id;

  if (projectId) {
    AnalyticsService.getChromeStatsCount(projectId, models, context, res);
  } else {
    res.status(400).end('Invalid input(s)');
  }
};

exports.pushNotificationPopupForNonSslSites = function (req, res) {
  // var routePath = req.originalUrl.split("\/");
  var writeKey = req.query.writeKey;
  var domainName = req.query.parentDomainName;
  var deviceType = 'desktop'; // currently hardcoded, but needs to be populated from the project.
  var displayIcon =
  'http://findicons.com/files/icons/1764/windows_icons_v1/80/access.png'; // currently hardcoded, but needs to be populated from the project.
  var fileRequested = 'chrome_connecto.js';
  if(req.protocol === 'https') {
    fileRequested = 'connecto.min.js';
  }
  res.render('test_push_non_ssl',{'projectWriteKey': writeKey,
    'websiteDomainName': domainName, 'deviceType': deviceType,
    'displayIcon': displayIcon, 'requestProtocol' : req.protocol,
    'requestHost' : req.get('host'), 'requestFileName': fileRequested});
};