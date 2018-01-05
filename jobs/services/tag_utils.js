var Q     = require('q');
var C = require('../constants'); 
var async = require('async');
var Producer = require('../producer/producer');

exports.addProfileForSending = function(jobId,
                                        profileId,
                                        payload,
                                        context,
                                        callback) {
  // For each profile add jobId_profileId -> registrationId to cache queue.
    console.log("KEY");
    console.log(key);
    console.log("KEY");
  try {
    var redis = context.redis;
    var key = jobId + "_" + profileId;
    redis.set(key, JSON.stringify(payload), callback);
  } catch (err) {
          console.log(err);
        }
};

exports.queueProfilesForSending = function(jobId,
                                           context,
                                           title,
                                           callback) {
  // Scan all profileIds with prefix jobId and get batches of 1000.
  var redis = context.redis;
  var queue = context.kueJobQueue;
  var scan = redis.streamified('SCAN'); // case insensitive
  console.log(jobId);
  console.log("queueProfilesForSending");
  
  var key = jobId + "_*"
  scan(key)
    .on('data', function (data) {
      // For each profile add a job to kue.
      console.log(data);
      redis.get(data, function(err, payload_str) {
        if (err) {
          console.log(err);
        }
        console.log(payload_str);
        console.log("Updating tag job to send list ");
        try {
          var payload = JSON.parse(payload_str);
          payload.send_type = C.PUSH_NOTIFICATION_SEND_TYPES.SEND_API;
          Producer.produceJob(payload, queue, title)
          .then(function (response) {
            redis.del(data);
          },
          function (error) {
            console.log(error);
          });
        } catch (err) {
          console.log(err);
        }
      });
    })
    .on('error', function (error) {
      console.log(error);
      callback(error);
    })
    .on('end', function () {
      // Once all jobs are queued, call callback.
      if (callback) {
        callback();
      }
    });
};

var _tagsToQuery = function(tags) {
  var str = "";
  for (var i=0; i < tags.length; i++) {
    str = str + "'" + tags[i] + ((i < tags.length -1) ? "',": "'"); 
  }
  str += "";
  return str;
};

exports.fetchProfilesForTags = function(jobId,
                                        tagList,
                                        payload,
                                        context,
                                        callback) {
  // Scan cassandra 
  var client = context.client;
  var query = "SELECT \"profileId\" FROM send_to_tags WHERE \"tag\" IN (" + _tagsToQuery(tagList) + ") AND \"projectId\"=?";
  var projectId = payload.projectId;
  var params = [projectId];
  console.log(query);
  console.log(params);
  console.log(payload);
  console.log("payload");

  var rows = [];
  var type = payload.type;
  var processRow = function(row, done) {
    exports.fetchProfileByProfileId(row.profileId, 
                                    projectId,
                                    context,
                                    function(err, profile) {
      if (err) {
        console.log(err);
      }
      console.log(JSON.stringify(profile));
      if (type == C.NOTIFICATION_TYPES.CHROME_PUSH &&
          profile &&
          profile.chrome_devices &&
          profile.chrome_devices.length > 0) {
        payload.registrationIds = [JSON.parse(profile.chrome_devices[0])];
        payload.profileId = row.profileId;
        console.log("calling add profiles");
        exports.addProfileForSending(jobId,
                                     row.profileId,
                                     payload,
                                     context,
                                     done);
      } else if (type == C.NOTIFICATION_TYPES.ANDROID_PUSH &&
                 profile.android_devices &&
                 profile.android_devices.length > 0) {
        payload.registrationIds = [JSON.parse(profile.android_devices[0])];
        payload.profileId = row.profileId;
        exports.addProfileForSending(jobId,
                                     row.profileId,
                                     payload,
                                     context,
                                     done);
      } else {
        done();
      }
    });
  };

  var errorCb = function (err) {
    if (err) {
      console.log('Error fetching profiles of projectId: '+projectId+', Error: '+err);
    }
    async.forEach(rows, processRow, function doneAll() {
      if (callback) {
        callback();
      }
    });
  };

  client.eachRow(query, params, {autoPage: true}, function (n, row) {
    rows.push(row);    
  }, errorCb);
  console.log("done fetching profiels for tags");
};

exports.fetchProfileByProfileId = function(profileId,
                                           projectId,
                                           context,
                                           callback) {
  var models = context.cassandraModels;
  var Profile = models.Profile;

  Profile.findOne({profileId: profileId, projectId: projectId}, callback);
}
