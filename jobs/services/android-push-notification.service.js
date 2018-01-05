'use strict';
/*jslint node: true */

var Q = require('q');
var C = require('../constants');
var gcm = require('node-gcm');
var async = require('async');
var util = require('./util')
var MongoClient = require('mongodb').MongoClient;
var route_util = require('../routes/route_utils')
var ObjectId = require('../../lib/node_modules/mongoose').Types.ObjectId; 

exports.isValidPayload = function(payload, error) {
  // GENERIC validations (common for all notifications types)
  if (!payload ||
      // if api key/writekey is not defined
      !payload.gcmAPIKey ||
      !payload.writeKey) {
    error = "No GCMApiKey/WriteKey in Payload";
    console.log(error);
    return false;
  }
  
  if (!payload.requestId) {    error = "No Request Id in Payload";
    console.log(error);
    return false;
  }

  // Validations for registration IDs
  if (payload.type === C.NOTIFICATION_TYPES.PUSH_NOIFICATION) {
    if (payload.registrationIds.length <= 0) {
      error = "No Registrarion IDs in Payload";
      console.log(error);
      return false;
    }
  }

  // Validations for notification object.
  if (!payload.notification) {
    error = "No Notification Object in Payload";
    console.log(error);
    return false;
  }

  return true;
};

exports.getAndroidPushNotificationKueObject = function(payload) {
  var object = {
    notification    : payload.data.notification,
    id              : payload.id,
    send_type       : payload.data.send_type,
    writeKey        : payload.data.writeKey,
    requestId       : payload.data.requestId
  };

  if(payload.data.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_API){
    object.registrationIds = payload.data.registrationIds;
    object.gcmAPIKey       = payload.data.gcmAPIKey;
  }

  if(payload.data.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_LIST){
    object.profileIds = payload.data.profileIds;
    object.gcmAPIKey  = payload.data.gcmAPIKey;
    object.projectId  = payload.data.projectId;
  }

  if(payload.data.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_VIA_MONGO){
    object.projectId = payload.data.projectId;
    object.gcmAPIKey = payload.data.gcmAPIKey;
    object.mongoAuth = payload.data.auth;
  }

  if(payload.data.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_TAG){
    object.projectId = payload.data.projectId;
    object.gcmAPIKey = payload.data.gcmAPIKey;
    object.tags      = payload.data.tags;
  }

  return object;
};

exports.sendAndroidPushNotfication = function(payload, sendViaMongo) {
  // console.log(payload);
  var deferred = Q.defer();
  var sender = new gcm.Sender(payload.gcmAPIKey);
  console.log(sender);
  var message = new gcm.Message(payload.notification);
  // console.log(message);

  sender.send(message, payload.registrationIds, function(error, result){
    if (error) { 
      console.log(error);
      deferred.reject(error);
    } else {
      console.log("succesfully sent to given registrationIds *sendAndroidPushNotfication*")
      if (sendViaMongo){
        var object = {
          result: result,
          profileId: payload.profileId || null,
          registrationIds : payload.registrationIds || null
        };
        deferred.resolve(object);
      } else {
        deferred.resolve(result);
      }
    }
  });
  return deferred.promise;
};

exports.saveAndroidPushNotificationJobtoDB = function(payload, JobQueue) {
  var deferred = Q.defer();

  var job = new JobQueue(job);
  job.status = C.JOB_STATUS.RECIEVED;
  job.request_id = payload.requestId;
  job.send_type = payload.send_type;
  job.writeKey = payload.writeKey;
  job.data = payload;
  job.recieved_at = payload.recieved_at || new Date();
  job.type = payload.type;

  job.save(function(error,object) {
    if(error){
      console.log(error);
      deferred.reject(error);
    } else{
      console.log("sucess in saving job *saveAndroidPushNotificationJobtoDB*");
      deferred.resolve(object);
    }
  })

  return deferred.promise;
};

var _prefillIdentifiers = function(AndroidGCMResponseCount,job) {
  AndroidGCMResponseCount.writeKey        = job.writeKey || "";
  AndroidGCMResponseCount.request_id      = job.request_id || "";
  AndroidGCMResponseCount.jobType         = job.type || "";
  AndroidGCMResponseCount.follower_emails = job.follower_emails || "";
  return AndroidGCMResponseCount;
}

var _getTotalStats = function (object) {
  var gcmResponse = object.send_logs[0];
  var totalStats = {
    totalIds : object.data.registrationIds.length || null,
    success : gcmResponse["success"] || null,
    failure : gcmResponse["failure"] || null, // jQuery selector
    canonicalIds : gcmResponse["canonical_ids"] || null,
    multicastId : gcmResponse["multicast_id"] || null
  }
  return totalStats;
}

var _getUserStats = function(data, gcmResponse, models){
  var registrationIds = data.registrationIds;
  var userStats = [];
  if (((gcmResponse["canonical_ids"] != 0) || (gcmResponse["failure"] != 0)) && gcmResponse.results) {
   for (var i = 0; i < registrationIds.length; i++) {
    var stats = {
      registrationId : registrationIds[i],
      response : gcmResponse.results[i],
    };
     userStats.push(stats);
     exports.updateRegistrationIdStats(data.writeKey, registrationIds[i], gcmResponse.results[i], models);
   }
  }
  return userStats;
}

exports.updateRegistrationIdStats = function(writeKey, registrationId, response, models){
  var RegistrationIdStats = models.RegistrationIdStats;
  var query = {writeKey : writeKey, registrationId : registrationId};
  if( response && response.error){
  console.log("Recahinf update registration statas");
    RegistrationIdStats.findOneAndUpdate(query, { $inc: { failure: 1 } }, { upsert: true },  function(result){
      console.log("Upadated failure");
    });     
  } else if(response && response.registration_id){
    RegistrationIdStats.findOneAndUpdate(query, { $set: { canonicalId: response.registration_id } }, { upsert: true }, function(result){
      console.log("Updated canonicalId");
    });    
  }
}

exports.saveAndroidGCMResponseCount = function (job, models) {
  var AndroidGCMResponseCount = new  models.AndroidGCMResponseCount();
  AndroidGCMResponseCount = _prefillIdentifiers(AndroidGCMResponseCount,job);
  AndroidGCMResponseCount.totalStats = _getTotalStats(job);
  AndroidGCMResponseCount.userStats = _getUserStats(job.data, job.send_logs[0], models);
  AndroidGCMResponseCount.save(function(error,object) {
    if(error){
      console.log(error);
    } else{
      console.log("Android GCM Response Saved");
    }
  })
}

exports.getDataFromRemoteMongoDB = function (auth) {
  var deferred = Q.defer();
  var url = "";
  // deferred.resolve([{ "_id" : ObjectId("56bc3500f721f57e22a59b97"), payload:[{key: "screen", value: "fragment_my_fb_enumeration"}, {key: "resource_uri", value:"http://www.collegedekho.com/api/1/personalize/forums/"}], "bigText" : "Missed the Conversation about Your Shortlisted College? It's Never Too Late, Catch Up Now with Your Future Buddies!", "text" : "People are Talking about Your Shortlisted College!", "customerId" : "RandomKaran", "heading" : "You Have 171 New Unread Comments!" },
  //   { "_id" : ObjectId("56bc3500f721f57e22a59b97"), payload:[{key: "screen", value: "fragment_my_fb_enumeration"}, {key: "resource_uri", value:"http://www.collegedekho.com/api/1/personalize/forums/"}], "bigText" : "Missed the Conversation about Your Shortlisted College? It's Never Too Late, Catch Up Now with Your Future Buddies!", "text" : "People are Talking about Your Shortlisted College!", "customerId" : "Random", "heading" : "You Have 171 New Unread Comments!" }]);
  
  // return deferred.promise;
  if(auth.user && auth.pass){
    url = 'mongodb://'+ auth.user + ':' + auth.pass+ '@' + 
                      auth.host+ ':' + auth.port + '/' + auth.dbname;
  } else {
    url = 'mongodb://'+ auth.host+ ':' + auth.port + '/' + auth.dbname
  }
  console.log(url);
  console.log('mongo url');
  MongoClient.connect(url, function (err, db) {
      if (err) {
          throw err;
      } else {
        db.collection(auth.collection, function(err, collection) {
          collection.find().toArray(function(err, items) {
            if(err) {
              console.log(err);
              deferred.resolve(err);
            } else {
              console.log("successfully connected to the database");
              deferred.resolve(items);
              db.close();
            }
          });
        });
      }
  });
  return deferred.promise;
};

exports.getRegistrationIdsForDBData = function(data){
  var profileIdList = [];
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      profileIdList.push(dbData[i].customerId);
    }
  }
};

exports.getCustomMessageForPush = function(notification,list) {
  var options = {
    collapseKey: notification._id,
    delayWhileIdle: false,
    data: {
      notificationId : notification._id,
      type: notification.type,
      text: list.text || notification.text,
      bigText: list.bigText || notification.bigText,
      heading: list.heading || notification.heading,
      imageUrl: notification.imageUrl  || null,
      broadcastAction: list.broadcastAction || notification.broadcastAction  || null,
      packageName: notification.packageName || null,
      actionButtonText1:  notification.actionButtonText1 || "",
      actionButtonText2: notification.actionButtonText2 || "",
      redirectActivity:  notification.redirectActivity || "",
      redirectActivity1:  notification.redirectActivity1 || "",
      redirectActivity2: notification.redirectActivity2 || ""
    }
  }
  if (notification.delayWhileIdle) {
    options.delayWhileIdle = true;
  }
  if (notification.inappNotification) {
    options.data.message = notification.inappNotification.message;
    options.data.backgroundColor = notification.inappNotification.backgroundColor;
    options.data.sliderChevronColor = notification.inappNotification.sliderChevronColor;
    options.data.messageTextColor = notification.inappNotification.textColor;
    options.data.nextActivity = notification.redirectActivity1;
  }
  if(list.payload && list.payload.length){
    for (var i = list.payload.length - 1; i >= 0; i--) {
      var pair = list.payload[i];
      options.data[pair.key] = pair.value;
    };
  }
  return options;
};

var updateRegistrationId = function(object, profileId){
  var gcmResponse = object.result;
  if ((gcmResponse["canonical_ids"] != 0) && gcmResponse.results) {
   // route_util.updateProfileRegistrationId(object.profileId, object.projectId, object.registrationId, gcmResponse.results);
  } else if((gcmResponse["failure"] != 0) && gcmResponse.results){
   // route_util.updateProfileRegistrationId(object.profileId, object.projectId, object.registrationId, null);
  }
}

exports.sendAndroidPushNotficationViaMongo = function(payload, context) {
  var deferred = Q.defer();
  console.log("payload for push send via mongo *sendAndroidPushNotficationViaMongo*");
  var projectId = payload.projectId;
  var auth = payload.mongoAuth;
  var profilesObject = [];

  // Read all remote mongodb data.
  exports.getDataFromRemoteMongoDB(auth)
  .then(function (dbData) {
    console.log("Read database with rows: " + dbData.length);
    //console.log(dbData);
    // Process one by one, maintaining maximum concurrency of 200.
    async.eachLimit(dbData, 200,
    function(row, callback) {
      // Row Complete callback
      var profileId = (row.customerId).toString();

      // Get registration ID.
      route_util.getRegistrationIdForProfile(profileId, projectId, context)
      .then(function (profileData) {
        if (!profileData || !profileData[profileId] || !profileData[profileId][0]) {
          // No data to send.
          callback();
        } else {
          var registrationIds = profileData[profileId];
          for (var i = 0; i < registrationIds.length; i++) {
            row.registrationId = [registrationIds[i]];
            var message = exports.getCustomMessageForPush(payload.notification,
                                                          row);
            var data = {
              notification : message,
              registrationIds : row.registrationId,
              gcmAPIKey: payload.gcmAPIKey,
              profileId: profileId
            };
            // Send notification
            exports.sendAndroidPushNotfication(data, true)
            .then(function(result) {
              updateRegistrationId(result, projectId);
              console.log('Got success from send call in pushvia mongo');
              callback();
            },
            function (error) {
              console.log(error);
              callback();
            });
          }
        }
      }, function(errorGetRegistrationIdForProfiles) {
        console.log(errorGetRegistrationIdForProfiles);
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
  }, function(errorGetDataFromRemoteMongoDB) {
    // If mongodb read failed, reject.
    deferred.reject(errorGetDataFromRemoteMongoDB);
  });
  return deferred.promise;
};

exports.sendAndroidPushNotficationforTags = function(payload, context) {
  var deferred = Q.defer();
  var tags = payload.tags;

  tag_utils.fetchProfilesForTags(payload.id, tags, payload, context,
                                function() {
     tag_utils.queueProfilesForSending(payload.id, context,
                                       exports.JOB_TITLE,
                                       function(error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve();
        }
     }); 
  });

  return deferred.promise;
};


exports.sendAndroidPushNotficationforUi = function(payload, context) {
  var deferred = Q.defer();
  var profileIds = payload.profileIds;
  var projectId = payload.projectId;
  var profilesObject = [];
  var registrationIdsObject = [];

  for (var i = 0; i < profileIds.length; i++) {
    profilesObject.push({projectId:payload.projectId, profileId:profileIds[i]});
  }
  route_util.getRegistrationIdForProfiles(profilesObject, context)
  .then(function (profileData) {
    console.log("Got the registration ids from casendra");
    for(var key in profileData){
      if(profileData[key] && profileData[key][0]){
        registrationIdsObject.push(profileData[key][0]);
      }
    }
    console.log("Inserted registration ids in a Array");
    exports.getMessageFromNotification(payload.notification)
    .then(function(message) {
    console.log("Got the message for the notification");
      var data = {
            notification : message,
            registrationIds : registrationIdsObject,
            gcmAPIKey: payload.gcmAPIKey
          }
    console.log("Got the package ready to ship");
      exports.sendAndroidPushNotfication(data)
      .then(function(result) {
        console.log('result' + result);
        deferred.resolve(result);
      },
      function (error) {
        deferred.reject(error);
      })
      // body...
    },function(error) {
        deferred.reject(error);
    })
  },
  function (error) {
    deferred.reject(error);
  }); 
  return deferred.promise;
};

exports.getMessageFromNotification = function(notification) {
  console.log("notification");
  var deferred = Q.defer();
  var options = {
    delayWhileIdle: false,
    collapseKey: notification._id,
    data: {
      notificationId : notification._id,
      type: notification.type,
      text: notification.text,
      bigText: notification.bigText,
      heading: notification.heading,
      imageUrl: notification.imageUrl  || null,
      broadcastAction: notification.broadcastAction  || null,
      packageName: notification.packageName || null,
      actionButtonText1:  notification.actionButtonText1 || "",
      actionButtonText2: notification.actionButtonText2 || "",
      redirectActivity:  notification.redirectActivity || "",
      redirectActivity1:  notification.redirectActivity1 || "",
      redirectActivity2: notification.redirectActivity2 || ""
    }
  }

  if (notification.delayWhileIdle) {
    options.delayWhileIdle = true;
  }

  if (notification.inappNotification) {
    options.data.message = notification.inappNotification.message;
    options.data.backgroundColor = notification.inappNotification.backgroundColor;
    options.data.sliderChevronColor = notification.inappNotification.sliderChevronColor;
    options.data.messageTextColor = notification.inappNotification.textColor;
    options.data.nextActivity = notification.redirectActivity1;
  }
  if(notification.payload && notification.payload.length){
    for (var i = notification.payload.length - 1; i >= 0; i--) {
      var pair = notification.payload[i];
      options.data[pair.key] = pair.value;
    };
  }
  console.log("options");
  deferred.resolve(options);
  return deferred.promise;
};

exports.JOB_TITLE = 'Android Push Notification';
