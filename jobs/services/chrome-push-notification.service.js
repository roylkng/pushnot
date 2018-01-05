/*jslint node: true */

var Q = require('q');
var webpush = require('web-push-encryption');
var C = require('../constants');
var async = require('async');
var util = require('./util')
var MongoClient = require('mongodb').MongoClient;
var route_utils = require('../routes/route_utils')
var tag_utils = require('./tag_utils')
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
  
  if (!payload.requestId) {
    error = "No Request Id in Payload";
    console.log(error);
    return false;
  }

  // Validations for registration IDs
  if (payload.type === C.NOTIFICATION_TYPES.CHROME_PUSH) {
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

exports.getChromePushNotificationKueObject = function(payload) {
  var object = {
    notification    : payload.data.notification,
    id              : payload.id,
    send_type       : payload.data.send_type,
    type            : C.NOTIFICATION_TYPES.CHROME_PUSH,
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

  if(payload.data.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_ALL){
    object.projectId = payload.data.projectId;
    object.gcmAPIKey = payload.data.gcmAPIKey;
    object.propertyId= payload.data.propertyId || null;
  }

  return object;
};

exports.sendChromePushNotificationUi = function(req,
                                                res,
                                                context,
                                                models) {
  // Sample payload 
  // req.body.projectData = {
  //  requestId : "123455",
  //  writeKey : "0S9W28sSYUOgL8zS",
  //  gcmAPIKey : "AIzaSyDP18DJHojJMOyVdjjtcZDVfxVDCHfXpj4",
  //  profileIds : ['ABCD'],
  //  projectId : '56cc6a2bcae42dab131834c6',
  // };
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var payload = {};
  payload = req.body.projectData;
  console.log(payload);
  var queue = context.kueJobQueue;
  payload.registrationIds = payload.profileIds;
  if (!payload.notification || !payload.writeKey) {
    res.status(500).send('Bad Request');
  }

  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.CHROME_PUSH;
  }
  var profileIds = payload.profileIds;

  if (profileIds.length > 1) {
    if(profileIds.length > C.PUSH_CHUNK_SIZE) {
      var profileIdChunkArray =
        route_util.chunkifyArray(
          profileIds,
          Math.ceil(profileIds.length/C.PUSH_CHUNK_SIZE));
      console.log(profileIdChunkArray);
      console.log(profileIdChunkArray.length);
      var i = 0;
      var repeator =function(i) {
        if(i == profileIdChunkArray.length){
            res.status(200).send("Task Successfully Queued");
        } else {
          payload.registrationIds = profileIdChunkArray[i];
          payload.profileIds = profileIdChunkArray[i];
          payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_LIST;
          JobService.saveJobtoDB(payload, models.JobQueue)
          .then(function (dbPayload) {
            console.log(dbPayload);
            var kueObject = ChromePushNotificationService
                            .getChromePushNotificationKueObject(dbPayload);
            console.log(kueObject);
            Producer.produceJob(kueObject, queue,
                                ChromePushNotificationService.JOB_TITLE)
            .then(function (response) {
              console.log("Queued job " + i + "/" + profileIdChunkArray.length);
              i++;
              repeator(i);      
            },
            function (error) {
              console.log(error);
              res.status(500).send("Task not queued: " + error);
            });
          },
          function (error) {
            console.log(error);
            // res.status(500).send("Task not saved: " + error);
          });
        }
      }
      repeator(0);
    } else {
      payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_LIST;
      JobService.saveJobtoDB(payload, models.JobQueue)
      .then(function (dbPayload) {
        console.log(dbPayload);
        var kueObject = ChromePushNotificationService
                        .getChromePushNotificationKueObject(dbPayload);
        console.log(kueObject);
        Producer.produceJob(kueObject, queue,
                                ChromePushNotificationService.JOB_TITLE)
        .then(function (response) {
          res.status(200).send("Task Successfully Queued");
        },
        function (error) {
          res.status(500).send("Task not queued: " + error);
        });
      },
      function (error) {
        res.status(500).send("Task not saved: " + error);
      });   
    }
  } else if (profileIds.length == 1){
    console.log("type test send")
    payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.TEST_SEND;
    route_util.getChromeRegistrationIdForProfiles([{projectId:payload.projectId,
                                             profileId:profileIds[0]}], context)
      .then(function (profileData) {
        console.log('profiledata'+ profileData);
        console.log(profileData);
        if(!(__.isEmpty(profileData))){
          ChromePushNotificationService.getMessageFromNotification(payload.notification)
          .then(function(message) {
            var registrationIdsObject = [];
            for (var i = 0; i < profileData[profileIds[0]].length; i++) {
              registrationIdsObject.push(JSON.parse(profileData[profileIds[0]][i]));
            }
            var data = {
              notification : message,
              registrationIds : registrationIdsObject,
              gcmAPIKey: payload.gcmAPIKey
            };
            console.log(data);
            console.log("sending for test send");
            ChromePushNotificationService.sendChromePushNotfication(data)
            .then(function(result) {
              console.log('result' + result);
              res.status(200).send(result);
            },
            function (error) {
              res.status(400).send(error);
            })
          },function(error) {
              res.status(400).send(error);
          })
        } else {
          res.status(400).send("No Chrome proflie data found for " + profileIds[0]);
        }
      },
      function (error) {
        res.status(500).send("Task not queued: " + error);
      }); 
  } else {
    res.status(500).send('Bad Request');
  }
};


exports.sendChromePushNotificationToTag = function(req,
                                                   res,
                                                   context,
                                                   models) {
  console.log("ASDASDSADSAERDSTRRGFESDFEWRTRYHYTHGFET");
  // Sample payload 
  // req.body.projectData = {
  //  requestId : "123455",
  //  writeKey : "0S9W28sSYUOgL8zS",
  //  gcmAPIKey : "AIzaSyDP18DJHojJMOyVdjjtcZDVfxVDCHfXpj4",
  //  tags : ['ABC'],
  //  projectId : '56cc6a2bcae42dab131834c6',
  // };
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var payload = {};
  payload = req.body.projectData;
  console.log(payload);
  var queue = context.kueJobQueue;
  payload.tags = payload.tags;
  if (!payload.notification || !payload.writeKey) {
    res.status(400).send('Bad Request');
  }

  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.CHROME_PUSH;
  }
  var tags = payload.tags;
  if (tags) {
    payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_TAG;
    JobService.saveJobtoDB(payload, models.JobQueue)
    .then(function (dbPayload) {
      console.log(dbPayload);
      var kueObject = ChromePushNotificationService
                      .getChromePushNotificationKueObject(dbPayload);
      console.log(kueObject);
      Producer.produceJob(kueObject, queue,
                          ChromePushNotificationService.JOB_TITLE)
      .then(function (response) {
        res.status(200).send("Task Successfully Queued");
      },
      function (error) {
        console.log(error);
        res.status(500).send("Task not queued: " + error);
      });
    },
    function (error) {
      console.log(error);
      res.status(500).send("Task not saved: " + error);
    });
  } else {
    res.status(400).send('No tags provided');
  }
};

exports.sendChromePushNotficationforAll = function(req,
                                                   res,
                                                   context,
                                                   models) {
  // Sample payload 
  // req.body.projectData = {
  //  requestId : "123455",
  //  writeKey : "0S9W28sSYUOgL8zS",
  //  gcmAPIKey : "AIzaSyDP18DJHojJMOyVdjjtcZDVfxVDCHfXpj4",
  //  tags : ['ABC'],
  //  projectId : '56cc6a2bcae42dab131834c6',
  // };
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var payload = {};
  payload = req.body.projectData;
  console.log(payload);
  var queue = context.kueJobQueue;
  if (!payload.notification || !payload.writeKey) {
    res.status(400).send('Bad Request');
  }

  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.CHROME_PUSH;
  }
  payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_ALL;
  JobService.saveJobtoDB(payload, models.JobQueue)
  .then(function (dbPayload) {
    console.log(dbPayload);
    var kueObject = ChromePushNotificationService
                    .getChromePushNotificationKueObject(dbPayload);
    console.log(kueObject);
    Producer.produceJob(kueObject, queue,
                        ChromePushNotificationService.JOB_TITLE)
    .then(function (response) {
      res.status(200).send("Task Successfully Queued");
    },
    function (error) {
      console.log(error);
      res.status(500).send("Task not queued: " + error);
    });
  },
  function (error) {
    console.log(error);
    res.status(500).send("Task not saved: " + error);
  });
};

exports.getJobStats = function (req, res, models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var writeKey = req.query.writeKey;
  if(!writeKey) {
    res.json({});
    return;
  }
  var JobQueue = models.JobQueue;
  var groupQuery = {
    $group: {
      _id: {
        "request_id": "$request_id",
        "type": "$type",
        "status": "$status",
        "send_type": "$send_type"
      },
      success: {$sum: "$send_logs.success"},
      failure: {$sum: "$send_logs.failure"}
    }
  };

  JobQueue.aggregate([{$match: {writeKey: writeKey}},{$unwind: "$send_logs"},
   groupQuery, {$sort: {_id: 1}}], function (err, jobs) {
    if (err) {
      console.log('Error fetching jobs of writeKey '+writeKey+', Error: '+err);
      res.json({});
    } else {
      res.json(jobs);
    }
  });

/*  JobQueue.find({writeKey: writeKey}, function (err, jobs) {
    if (err) {
      console.log('Error fetching jobs of writeKey '+writeKey+', Error: '+err);
      res.json({});
    } else {
      res.json(jobs);
    }
  });*/
};

exports.sendChromePushNotfication = function(payload, sendViaMongo) {
  console.log(payload.registrationIds.length);
  var deferred = Q.defer();
  var success = 0;
  var failure = 0;
  webpush.setGCMAPIKey(payload.gcmAPIKey);

  var message = JSON.stringify(payload.notification);
  var logs = [];

  async.eachLimit(payload.registrationIds, 200,
    function(row, callback) {
      // Row Complete callback
      console.log(row);
      webpush.sendWebPush(message, row)
      .then(function(result){
          success++;
          console.log("result")
          console.log(result)
          if (sendViaMongo){
            var object = {
              result: result,
              profileId: payload.profileId || null,
              registrationIds : payload.registrationIds || null
            };
            // deferred.resolve(object);
          } else {
            logs.push(result);
          }
          callback();   
          console.log("sucess callback called");
      }, function(error){
          failure++;
          console.log(error);
          logs.push(error);
          console.log("error");
          try{
          callback();   
          } catch(e){
            console.log(e);
          }
          console.log("error callback called");
      });
    },
    function(err) {
      // All Complete callback
      if (err) {
        console.log(err);
      }
      // Regardless of individual errors, resolve to success.
      var result = {success:success, failure:failure, logs:logs};
      deferred.resolve(result);
      callback();
          console.log("outer error callback called");
    });
  console.log("last step of send")
  return deferred.promise;
};

exports.saveChromePushNotificationJobtoDB = function(payload, JobQueue) {
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
      // console.log(object);
      deferred.resolve(object);
    }
  })

  return deferred.promise;
};


exports.updateJobStatus = function(payload, response, status, models) {
  var JobQueue = models.JobQueue;
  console.log("Updating Job Status")
  JobQueue.findById(payload.dbId, function(err, job) {
      if (!err) {
        job.status = status;
        job.send_logs = response;
        // save the bear
        job.save(function(error,object) {
          if(!error){
          exports.saveChromeGCMResponseCount(object, models);
          } else {
            console.log(error);
          }
        })
      } else {
        console.log(err);
      }
  });
};

var _prefillIdentifiers = function(ChromeGCMResponseCount,job) {
  ChromeGCMResponseCount.writeKey        = job.writeKey || "";
  ChromeGCMResponseCount.request_id      = job.request_id || "";
  ChromeGCMResponseCount.jobType         = job.type || "";
  ChromeGCMResponseCount.follower_emails = job.follower_emails || "";
  return ChromeGCMResponseCount;
}

var _getTotalStats = function (object) {
  var gcmResponse = object.send_logs[0];
  var totalStats = {
    totalIds : ((object.data && object.data.registrationIds) ?  object.data.registrationIds.length : null)|| null,
    success : gcmResponse["success"] || null,
    failure : gcmResponse["failure"] || null, // jQuery selector
    canonicalIds : gcmResponse["canonical_ids"] || null,
    multicastId : gcmResponse["multicast_id"] || null
  }
  return totalStats;
}

var _getUserStats = function(registrationIds, gcmResponse){
  var userStats = [];
  if (((gcmResponse["canonical_ids"] != 0) || (gcmResponse["failure"] != 0)) && gcmResponse.results) {
   for (var i = 0; i < registrationIds.length; i++) {
    var stats = {
      registrationId : registrationIds[i],
      response : gcmResponse.results[i],
    };
     userStats.push(stats);
   }
  }
  return userStats;
}

exports.saveChromeGCMResponseCount = function (job, models) {
  var ChromeGCMResponseCount = new  models.ChromeGCMResponseCount();
  ChromeGCMResponseCount = _prefillIdentifiers(ChromeGCMResponseCount,job);
  ChromeGCMResponseCount.totalStats = _getTotalStats(job);
  ChromeGCMResponseCount.userStats = _getUserStats(job.data.registrationIds, job.send_logs[0]);
  ChromeGCMResponseCount.save(function(error,object) {
    if(error){
      console.log(error);
    } else{
      console.log("Chrome GCM Response Saved");
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

exports.getChromeMessageForPush = function(notification,list) {
  // return {"notificationId":"23232" ,"title": "Hi", "icon": "images/logo.png", "imageUrl": "images/sample.jpg",
  //  "imageUrl1": "images/sample.jpg", "imageUrl2": "images/sample.jpg", "actionButtonText1": "like", 
  //  "actionButtonText2": "reply", "message":"There", "type":4, "targetUrl":"test_page.html",
  // "targetUrl2":"test_page.html","targetUrl1":"test_page.html", "profileId":"tasdfdthet"}
  var options = {
    delayWhileIdle: false,
    collapse_key: notification.collapse_key,
    notificationId : notification._id,
    profileId : notification.profileId,
    type: notification.type,
    title: notification.title,
    message: notification.bigText,
    icon: notification.icon,
    targetUrl: notification.targetUrl || null,
    imageUrl1: notification.imageUrl1  || null,
    actionButtonText1:  notification.actionButtonText1 || "",
    targetUrl1: notification.targetUrl1 || null,
    imageUrl2: notification.imageUrl2  || null,
    actionButtonText2: notification.actionButtonText2 || "",
    targetUrl2: notification.targetUrl2 || null,
  }
  return options;
};

var updateRegistrationId = function(object, profileId){
  var gcmResponse = object.result;
  if ((gcmResponse["canonical_ids"] != 0) && gcmResponse.results) {
   // route_utils.updateProfileRegistrationId(object.profileId, object.projectId, object.registrationId, gcmResponse.results);
  } else if((gcmResponse["failure"] != 0) && gcmResponse.results){
   // route_utils.updateProfileRegistrationId(object.profileId, object.projectId, object.registrationId, null);
  }
}

exports.sendChromePushNotficationViaMongo = function(payload, context) {
  var deferred = Q.defer();
  console.log(payload);
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
      route_utils.getRegistrationIdForProfile(profileId, projectId, context)
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
            exports.sendChromePushNotfication(data, true)
            .then(function(result) {
              updateRegistrationId(result, projectId);
              console.log('Result' + result);
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

exports.sendChromePushNotficationforUi = function(payload, context) {
  var deferred = Q.defer();
  var profileIds = payload.profileIds;
  var projectId = payload.projectId;
  var profilesObject = [];
  var registrationIdsObject = [];
  for (var i = 0; i < profileIds.length; i++) {
    profilesObject.push({projectId:payload.projectId, profileId:profileIds[i]});
  }
  route_utils.getChromeRegistrationIdForProfiles(profilesObject, context)
  .then(function (profileData) {
    console.log("Got the registration ids from casendra");
    for(var key in profileData){
      if(profileData[key] && profileData[key][0]){
        registrationIdsObject.push(JSON.parse(profileData[key][0]));
      }
    }
    if(registrationIdsObject.length== 0){
      deferred.reject("No registration ids for the given profileIds");
      return deferred.promise;   
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
      exports.sendChromePushNotfication(data)
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

exports.sendChromePushNotficationforTags = function(payload, context) {
  var deferred = Q.defer();
  var tags = payload.tags;

  tag_utils.fetchProfilesForTags(payload.id, tags, payload, context,
                                function() {
     tag_utils.queueProfilesForSending(payload.id, context,
                                       exports.JOB_TITLE,
                                       function(error) {
        if (error) {
          deferred.reject(error);
          console.log("error in queue profiles for sending callback in chrome service");
        } else {
          console.log("Sucess in queue profiles for sending callback in chrome service");
          deferred.resolve();
        }
     }); 
  });

  return deferred.promise;
};

exports.sendChromePushNotficationforAll = function(payload, context) {
  var deferred = Q.defer();
  var propertyId = payload.propertyId;
  var registrationIdsObject = [];

  route_utils.getChromeRegistrationIdForProject(payload.projectId, propertyId, context)
  .then(function (profileData) {
    console.log("returnd from fetching from route");

    for (var i = 0; i < profileData.length; i++) {
      if(profileData[i] && profileData[i].key){
        var tempId = JSON.parse(profileData[i]["key"]);
        delete tempId.domain;
        registrationIdsObject.push(tempId);
      }
    }
    if(registrationIdsObject.length== 0){
      deferred.reject("No registration ids for the given profileIds");
      return deferred.promise;   
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
      exports.sendChromePushNotfication(data)
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
  return deferred.promise;
};

exports.getMessageFromNotification = function(notification) {
  console.log("notification");
  var deferred = Q.defer();
  var options = {
    delayWhileIdle: false,
    collapse_key: notification.collapse_key,
    notificationKey: notification.notificationKey,
    require_interaction : notification.require_interaction,
    notificationId : notification._id,
    profileId : notification.profileId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    icon: notification.icon,
    targetUrl: notification.targetUrl || null,
    imageUrl1: notification.imageUrl1  || null,
    actionButtonText1:  notification.actionButtonText1 || "",
    targetUrl1: notification.targetUrl1 || null,
    imageUrl2: notification.imageUrl2  || null,
    actionButtonText2: notification.actionButtonText2 || "",
    targetUrl2: notification.targetUrl2 || null,
  }
  console.log("options");
  deferred.resolve(options);
  return deferred.promise;
};

exports.JOB_TITLE = 'Chrome Push Notification';
