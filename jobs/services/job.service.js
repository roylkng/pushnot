'use strict';
/*jslint node: true */

var Q = require('q');
var C = require('../constants');

exports.saveJobtoDB = function(payload, JobQueue) {
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

exports.updateJobStatus = function(payload, response, status, models, callback) {
  var JobQueue = models.JobQueue;
  console.log("Updating Job Status")
  JobQueue.findById(payload.dbId, function(err, job) {
    if (!err) {
      job.status = status;
      job.send_logs = response;
      // save the bear
      job.save(function(error,object) {
        if (!error){
          if (callback) {
            callback(object, models);
          }
        } else {
          console.log(error);
        }
      })
    } else {
      console.log(err);
    }
  });
};
