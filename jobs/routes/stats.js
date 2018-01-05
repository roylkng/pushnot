'use strict';
// jslint node: true 

var C = require('../constants'); 
var __ = require('lodash');
var route_util = require('./route_utils')

exports.collectGupshupSmsResponseStat = function(req, res, context, models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var id = req.query.externalId;
  console.log("ID received: " + id);
  var key = context.messageIdCache.findById(id);
  var status = req.query.status;
  var cause = req.query.cause;
  console.log(status);
  console.log(cause);
  if (!key) {
    console.log('Unidentifiable key in SMS response.');
    res.sendStatus(200);
    return;
  }
  if (!status) {
    console.log('Unidentifiable status in SMS response.');
    res.sendStatus(200);
    return;
  }
  var phoneNumber = req.query.phoneNo;
  var tokens = key.split('_');

  var receivedAt = new Date();
  var currentDay = Math.floor( receivedAt.getTime() / (1000*60*60*24) );
  var writeKey = tokens[0];
  var hour = currentDay;
  var channelType = C.NOTIFICATION_TYPES.SMS; 
  var responseType = _getResponseType(status, cause); 
  console.log(responseType);
  var query = { writeKey: writeKey,
                hour : currentDay,
                channelType : channelType,
                responseType : responseType };
  if (tokens.length == 2) {
    // Response to job notification.
    query.jobId = tokens[1];
  }
  var updateCommand = {"$inc" : {'count' : 1}};
  models.ResponseCount.update(query, updateCommand, {upsert: true},
                              function(err) {
                                if (err) {
                                  console.log(err);
                                }
                                res.sendStatus(200);
                              });
};

var _getResponseType = function(status, cause) {
  if (status == 'SUCCESS') {
    return C.SMS_RESPONSE_TYPES.SUCCESS;
  } else if (status == 'SUBMITTED') {
    return C.SMS_RESPONSE_TYPES.SUBMITTED;
  }
  switch (cause) {
    case "ABSENT_SUBSCRIBER"    :
      return C.SMS_RESPONSE_TYPES.FAIL_ABSENT_SUBSCRIBER;
    case "UNKNOWN_SUBSCRIBER"   :
      return C.SMS_RESPONSE_TYPES.FAIL_UNKNOWN_SUBSCRIBER;
    case "BLOCKED_MASK"         :
      return C.SMS_RESPONSE_TYPES.FAIL_BLOCKED_MASK;
    case "SYSTEM_FAILURE"       :
      return C.SMS_RESPONSE_TYPES.FAIL_SYSTEM_FAILURE;
    case "CALL_BARRED"          :
      return C.SMS_RESPONSE_TYPES.FAIL_CALL_BARRED;
    case "SERVICE_DOWN"         :
      return C.SMS_RESPONSE_TYPES.FAIL_SERVICE_DOWN;
    case "OTHER"                :
      return C.SMS_RESPONSE_TYPES.FAIL_OTHER;
    case "DND_FAIL"             :
      return C.SMS_RESPONSE_TYPES.FAIL_DND_FAIL; 
    case "DND_TIMEOUT"          :
      return C.SMS_RESPONSE_TYPES.FAIL_DND_TIMEOUT; 
    case "OUTSIDE_WORKING_HOUR" :
      return C.SMS_RESPONSE_TYPES.FAIL_OUTSIDE_WORKING_HOUR;
    default :
      return C.SMS_RESPONSE_TYPES.FAIL_OTHER;
  }
};

exports.getResponseStatsForChannel = function(req, res, context, models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
};

exports.getResponseStatsByJob = function(req, res, context, models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
};
