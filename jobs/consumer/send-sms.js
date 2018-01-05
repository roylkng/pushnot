'use strict';
// jslint node: true;

var C = require('../constants');
var kue = require('kue');
var SmsService = require('../services/sms.service');
var JobService = require('../services/job.service');

exports.consumeSmsJob = function (context, callback) {
  // kue.createQueue() is singleton so multiple invocations should not be a
  // problem.
  var queue = kue.createQueue();
  queue.process(SmsService.JOB_TITLE, 1, function(job, done) {
    console.log("Started SMS job ");

  	if (job.data.dbData.send_type == C.SMS_SEND_TYPES.SEND_API) {
  	  var smsData = _getSmsData(job);
	    if (smsData) {
        _sendSmsMultipleViaApi(job, smsData, context, done, callback);
	    } else {
	      console.log("Invalid job data: " + JSON.stringify(job));
        done("Invalid job data.");
	      if (callback) { callback (false);}
	    }  		
  	}
	});
};

var _getSmsData = function (job) {
  if (!job || !job.data || !job.data.dbData) {
    return null;
  }

  return job.data.dbData;
}

var _sendSmsMultipleViaApi = function(job, smsData, context, done, callback) {
  SmsService.sendSmsMultiple(smsData)
  .then(function function_name(result) {
    _success(job, result, context.models, done, callback);
  }, function function_name(error) {
    _failure(job, error, context.models, done, callback);
  });
};

var _success = function(job, result, models, done, callback) {
  console.log("Success" + result);
  JobService.updateJobStatus(job.data, result, C.JOB_STATUS.COMPLETE, models);
  done();
  if (callback) { callback (true);}
}

var _failure = function(job, error, models, done, callback) {
  console.log("Failure" + error);
  JobService.updateJobStatus(job.data, error, C.JOB_STATUS.FAILED, models);
  job.failed().error(error);
  done(error);
  if (callback) { callback (false);}
}
