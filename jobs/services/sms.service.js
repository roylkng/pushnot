'use strict';
/*jslint node: true */

var Q = require('q');
var __ = require('lodash');
var C = require('../constants');
var gcm = require('node-gcm');
var async = require('async');
var qs = require('qs');
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var route_utils = require('../routes/route_utils')
var ObjectId = require('../../lib/node_modules/mongoose').Types.ObjectId; 

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.isValidPayload = function(payload, error) {
  // GENERIC validations (common for all notifications types)
  console.log(payload);
  // if api key/writeKey is not defined
  if (!payload ||
      !payload.writeKey ||
      !payload.apiCredentials) {
    error = "No API Credentials/WriteKey in Payload";
    console.log(error);
    return false;
  }

  if (!payload.apiCredentials.username ||
      !payload.apiCredentials.password) {
    try {
      payload.apiCredentials = JSON.parse(payload.apiCredentials);
      if (!payload.apiCredentials.username ||
          !payload.apiCredentials.password) {
        error = 'Incorrect credentials (username or passsword) in request';
        console.log(error);
      }
    } catch(err) {
      error = err;
      console.log(err);
      return false;
    }
  }
  
  if (!payload.phoneNumbers) {
    error = "No Phone number(s)";
    console.log(error);
    return false;
  }

  payload.phoneNumbers = _normalizeNumbers(payload.phoneNumbers);
  if (!payload.phoneNumbers || !payload.phoneNumbers.length) {
    error = "Invalid number(s)";
    console.log(error);
    return false;
  }

  // Validations for registration IDs
  if (payload.type === C.NOTIFICATION_TYPES.SMS) {
    if (payload.phoneNumbers.length <= 0) {
      error = "No phone numbers in Payload";
      console.log(error);
      return false;
    }
  }

  return true;
};

var _normalizeNumbers = function(numbers) {
  var data = [];
  __(numbers).forEach(function(value) {
     var n = _normalizeNumber(value);
     if (n) { data.push(n); } 
  });
  return data;
}

var _normalizeNumber = function(number) {
  // remove spaces and +
  var n = number.replace(/\+|\ /g,'');
  // remove preceding 0
  if (n[0] == '0') {
    n = n.substr(1);
  }
  if (n.length != 12 && n.length != 10) {
    return null;
  }
  if (!__.toNumber(n)) {
    return null;
  }
  return n;
}

exports.getSmsKueObject = function(payload, messageId) {
  var object = {
    id              : payload.id,
    send_type       : payload.data.send_type,
    writeKey        : payload.data.writeKey,
    requestId       : payload.data.requestId,
    message         : payload.data.message,
    message_id      : messageId,
  };

  if (payload.data.send_type == C.SMS_SEND_TYPES.SEND_API) {
    object.phoneNumbers   = payload.data.phoneNumbers;
    object.apiCredentials = payload.data.apiCredentials;
  }

  if (payload.data.send_type == C.SMS_SEND_TYPES.SEND_TO_LIST) {
    object.profileIds = payload.data.profileIds;
    object.apiCredentials  = payload.data.apiCredentials;
    object.projectId  = payload.data.projectId;
  }

  if (payload.data.override_dnd) {
    object.override_dnd = payload.data.override_dnd;
  }
  return object;
};

exports.sendSmsMultiple = function(payload) {
  console.log(payload);
  var deferred = Q.defer();
  async.eachLimit(payload.phoneNumbers, 100,
  function(number, callback) {
    // Per item callback
    var perPayload = __.clone(payload);
    perPayload.number = number; 
    var options = {
      url : _getApiUrl(perPayload),
    };
    request.get(options, function(error, response, body) {
      if (error) { 
        console.log(error);
      } else {
        console.log(body)
        deferred.resolve("URL: " + options.url + "\n Response: " + body);
      }
      callback();
    });
  },
  function(err) {
    // All Complete callback
    if (err) {
      console.log(err);
    }
    // Regardless of individual errors, resolve to success.
    deferred.resolve();
  });
  return deferred.promise;
};

var _getApiUrl = function(payload) {
  return _getGupshupApiUrl(payload);
}

var _getGupshupApiUrl = function(payload) {

  var dataDict = {
    method: 'SendMessage',
    msg_type: 'TEXT',
    auth_scheme: 'plain',
    v: '1.1',
    format: 'text',
    userid: payload.apiCredentials.username,
    password: payload.apiCredentials.password,
    send_to: payload.number,
    msg: payload.message,
    msg_id: payload.message_id,
  };

  if (payload.override_dnd) {
    dataDict.override_dnd = payload.override_dnd;
  }
  var url = "http://enterprise.smsgupshup.com/GatewayAPI/rest?" +
            qs.stringify(dataDict);
  console.log(url);

  return url;
};

exports.getReversibleMessageId = function(writeKey, jobId, context) {
  var deferred = Q.defer();

  var messageIdCache = context.messageIdCache;
  var key = writeKey;
  if (jobId) {
    key += "_" + jobId;
  } 
  console.log("Key: " + key);
  var id = messageIdCache.findByKey(key);
  console.log("ID: " + id);
  if (id) {
    deferred.resolve(id);
  } else {
    id = route_utils.random8DigitId();
    messageIdCache.save(id, key, function() {
      console.log("ID: " + id);
      deferred.resolve(id);
    });
  }

  return deferred.promise;
}

exports.JOB_TITLE = 'SMS Notification';
