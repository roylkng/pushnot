// 'use strict';
// jslint node: true 

var C = require('../constants'); 
var __ = require('lodash');
var route_util = require('./route_utils')
var Q = require('q');
var AndroidPushNotificationService = require('../services/android-push-notification.service');
var ChromePushNotificationService = require('../services/chrome-push-notification.service');
var SmsService = require('../services/sms.service');
var JobService = require('../services/job.service');
var Producer = require('../producer/producer');
var json2csv = require('json2csv');

exports.sendAndroidPushNotification = function(req,
                                               res,
                                               context,
                                               models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var payload = req.body;

  // Sample payload 
  // payload = {
  //  requestId : "123455",
  //  writeKey : "0S9W28sSYUOgL8zS",
  //  notification :{name : "sddf", title : "weds"},
  //  gcmAPIKey : "AIzaSyDP18DJHojJMOyVdjjtcZDVfxVDCHfXpj4",
  //  registrationIds : ["sssssssssssss","APA91bGavd_rbqjT0dVr45wRII_MK7LVOdbdboVebUZGzTuJNPt35uJyjBvyuK9fRUIDitiLTEEK1Cx_OKdvILFs2WJ_Bngw-UGQjM18Vb1-bPKxIv_Ejdj5zthk1lz2Eq_ez-8N-60t"]
  // };

  var queue = context.kueJobQueue;
  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.ANDROID_PUSH;
  }

  if (!payload.send_type){
    payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_API;
  }

  var err = null;
  if (!AndroidPushNotificationService.isValidPayload(payload, err)) {
    console.log(err);
    res.status(400).send(err);
    return;
  }

  JobService.saveJobtoDB(payload, models.JobQueue)
  .then(function (dbPayload) {
    console.log(JSON.stringify(dbPayload));
    var kueObject = AndroidPushNotificationService
                    .getAndroidPushNotificationKueObject(dbPayload);
    Producer.produceJob(kueObject, queue,
                        AndroidPushNotificationService.JOB_TITLE)
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
};

exports.sendAndroidPushNotificationviaMongoDB = function(req,
                                                         res,
                                                         context,
                                                         models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var payload = {};
  payload = req.body.projectData;
  var queue = context.kueJobQueue;
  var queue = context.kueJobQueue;
  var dbData ;
  console.log(payload);

  if (!payload.notification || !payload.auth) {
    res.status(500).send('Notification missing');
  }

  if (!payload.projectId || !payload.writeKey) {
    res.status(500).send('Project or Write Key missing');
  }

  if (!payload.gcmAPIKey) {
    res.status(500).send('Please set your GCM Api Key in settings.');
  }

  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.ANDROID_PUSH;
  }

  if (!payload.send_type){
    payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_VIA_MONGO;
  }

  JobService.saveJobtoDB(payload, models.JobQueue)
  .then(function (dbPayload) {
    var kueObject = AndroidPushNotificationService
                    .getAndroidPushNotificationKueObject(dbPayload);
    Producer.produceJob(kueObject, queue,
                        AndroidPushNotificationService.JOB_TITLE)
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
};

exports.sendAndroidPushNotificationUi = function(req,
                                                 res,
                                                 context,
                                                 models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var payload = {};
  payload = req.body.projectData;
  var queue = context.kueJobQueue;
  payload.registrationIds = payload.profileIds;
  if (!payload.notification || !payload.writeKey) {
    res.status(500).send('Bad Request');
  }

  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.ANDROID_PUSH;
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
            var kueObject = AndroidPushNotificationService
                            .getAndroidPushNotificationKueObject(dbPayload);
            console.log(kueObject);
            Producer.produceJob(kueObject, queue,
                                AndroidPushNotificationService.JOB_TITLE)
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
        var kueObject = AndroidPushNotificationService
                        .getAndroidPushNotificationKueObject(dbPayload);
        console.log(kueObject);
        Producer.produceJob(kueObject, queue,
                                AndroidPushNotificationService.JOB_TITLE)
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
    route_util.getRegistrationIdForProfiles([{projectId:payload.projectId,
                                             profileId:profileIds[0]}], context)
      .then(function (profileData) {
        console.log('profiledata'+ profileData);
        console.log(profileData);
        if(!(__.isEmpty(profileData))){
          AndroidPushNotificationService.getMessageFromNotification(payload.notification)
          .then(function(message) {
            var data = {
              notification : message,
              registrationIds : profileData[profileIds[0]],
              gcmAPIKey: payload.gcmAPIKey
            };
            console.log("sending for test send");
            AndroidPushNotificationService.sendAndroidPushNotfication(data)
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
          res.status(400).send("No android proflie data found for " + profileIds[0]);
        }
      },
      function (error) {
        res.status(500).send("Task not queued: " + error);
      }); 
  } else {
    res.status(500).send('Bad Request');
  }
};

exports.sendAndroidPushNotificationToTag = function(req,
                                                    res,
                                                    context,
                                                    models) {
  // Sample payload 
  // req.body.projectData = {
  //  requestId : "123455",
  //  writeKey : "0S9W28sSYUOgL8zS",
  //  notification: '53cc6u2blaek2dab13a834l3',
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
  var err = null;
  if (!AndroidPushNotificationService.isValidPayload(payload, err)) {
    console.log(err);
    res.status(400).send(err);
    return;
  }

  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.ANDROID_PUSH;
  }
  var tags = payload.tags;
  if (tags) {
    payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_TAG;
    JobService.saveJobtoDB(payload, models.JobQueue)
    .then(function (dbPayload) {
      console.log(dbPayload);
      var kueObject = AndroidPushNotificationService
                      .getAndroidPushNotificationKueObject(dbPayload);
      console.log(kueObject);
      Producer.produceJob(kueObject, queue,
                          AndroidPushNotificationService.JOB_TITLE)
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
  var err = null;
  if (!ChromePushNotificationService.isValidPayload(payload, err)) {
    console.log(err);
    res.status(400).send(err);
    return;
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

exports.sendChromePushNotificationToAll = function(req,
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
  var err = null;
  if (!ChromePushNotificationService.isValidPayload(payload, err)) {
    console.log(err);
    res.status(400).send(err);
    return;
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

exports.sendSms = function(req, res, context, models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var payload = req.body;

  // Sample payload
  // payload = {
  //  requestId : "123455",
  //  apiCredentials: {type: 1, username: abc, password: def},
  //  writeKey : "0S9W28sSYUOgL8zS",
  //  message : "Welcome to Girnar!",
  //  mask : "GIRNAR",
  //  phoneNumbers : ["918826026333","9876543210"]
  // };

  var queue = context.kueJobQueue;
  if (!payload.type){
    payload.type = C.NOTIFICATION_TYPES.SMS;
  }

  if (!payload.send_type){
    payload.send_type = C.SMS_SEND_TYPES.SEND_API;
  }

  var err = null;
  if (!SmsService.isValidPayload(payload, err)) {
    console.log(err);
    res.status(400).send(err);
    return;
  }

  if (payload.requestId && payload.requestId.length) {
    // Tracking report requested.
    JobService.saveJobtoDB(payload, models.JobQueue)
    .then(function (dbPayload) {
      console.log(JSON.stringify(dbPayload));
      SmsService.getReversibleMessageId(payload.writeKey,
                                        dbPayload.id,
                                        context)
      .then(function (messageId) {
        var kueObject = SmsService.getSmsKueObject(dbPayload, messageId);
        Producer.produceJob(kueObject, queue, SmsService.JOB_TITLE)
        .then(function (response) {
          res.status(200).send("Task Successfully Queued");
        },
        function (error) {
          res.status(500).send("Task not queued: " + error);
        });
      });
    },
    function (error) {
      res.status(500).send("Task not saved: " + error);
    });
  } else {
    // Tracking report not requested. Directly send.
    SmsService.getReversibleMessageId(payload.writeKey,
                                      null,
                                      context)
    .then(function(messageId) {
      console.log(messageId);
      payload.message_id = messageId;
      SmsService.sendSmsMultiple(payload)
      .then(function function_name(result) {
        res.status(200).send(result);
      }, function (error) {
        res.status(500).send("Failure: " + error);
      });
    }, function (error) {
      res.status(500).send("Failure: " + error);
    });
  }
};

exports.getAndroidPushNotificationCount = function(req,
                                                   res,
                                                   context,
                                                   models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  if (req.query && req.query.conditions && req.query.conditions.writeKey) {
    var writeKey = req.query.conditions.writeKey;
    var match = {$match: {'writeKey' : writeKey}};
    var group = {$group: {_id : {writeKey: "$writeKey"},
                  totalIds: {$sum: "$totalStats.totalIds"},
                        success: {$sum: "$totalStats.success"},
                        failure: {$sum: "$totalStats.failure"},
                        canonicalIds: {$sum: "$totalStats.canonicalIds"},
                        }}; 

    var query = models.AndroidGCMResponseCount.aggregate([match, group]); 
    query.exec(function(error, object) {
      if(!error){
        res.json(object);
        return ;
      }
      console.log(error);
      res.status(400).send(error);
    })
  } else {
    res.status(400).send("WriteKey is undefined");
  }
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

exports.getRegistrationIdStats = function (req, res, models) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  var writeKey = req.query.writeKey;
  console.log(writeKey);
  if(!writeKey) {
    res.json({});
    return;
  }
  var RegistrationIdStats = models.RegistrationIdStats;
  var query = RegistrationIdStats.find({ writeKey : writeKey})
                                 .select({registrationId:1,failure:1,canonicalId:1});

 query.exec(function (err, stats) {
    if (err) {
      console.log('Error fetching jobs of writeKey '+writeKey+', Error: '+err);
      res.json({});
    } else {
      var data = [];
      // var feilds = ["RegistrationId", "Failure", "CanonicalId"]
      for (var i = 0; i < stats.length; i++) {
        data.push({ RegistrationId:stats[i].registrationId,
                    Failure : stats[i].failure,
                    CanonicalId: stats[i].canonicalId});
      }
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="' +"RegistrationIdData" + '.csv"');

      json2csv({data:data}, function(err, csv) {
        if (err) console.log(err);
        res.send(csv).end();
      });
    }
  });
};