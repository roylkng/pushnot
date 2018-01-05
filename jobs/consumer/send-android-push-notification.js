'use strict';
// jslint node: true;

var C = require('../constants');
var kue = require('kue');
var AndroidPushNotificationService = require('../services/android-push-notification.service');
var JobService = require('../services/job.service');

exports.consumeAndroidPushNotificationJob = function (context, callback) {
  // kue.createQueue() is singleton so multiple invocations should not be a
  // problem.
  var queue = kue.createQueue();
  queue.process(AndroidPushNotificationService.JOB_TITLE, 1,
                function(job, done) {
    console.log("started job ");

  	if (job.data.dbData.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_API) {
  	  var gcmData = _getGCMData(job);
	    if (gcmData) {
        _sendPushViaApi(job, gcmData, context, done, callback);
	    } else {
	      console.log("Invalid job data: " + JSON.stringify(job));
        done("Invalid job data.");
	      if (callback) { callback (false);}
	    }  		
  	} else if (job.data.dbData.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_VIA_MONGO) {
      _sendPushViaMongo(job, context, done, callback);
  	} else if (job.data.dbData.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_LIST) {
      _sendPushViaUI(job, context, done, callback);
  	} else if (job.data.dbData.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_TAG) {
      _sendPushToTag(job, context, done, callback);
  	}

	});
};

var _sendPushViaApi = function(job, gcmData, context, done, callback) {
  AndroidPushNotificationService.sendAndroidPushNotfication(gcmData)
  .then(function function_name(result) {
    _success(job, result, context.models, done, callback);
  }, function function_name(error) {
    _failure(job, error, context.models, done, callback);
  });
};

var _sendPushViaMongo = function(job, context, done, callback) {
  AndroidPushNotificationService.sendAndroidPushNotficationViaMongo(job.data.dbData, context)
  .then(function function_name(result) {
    _success(job, result, context.models, done, callback);
  }, function function_name(error) {
    _failure(job, error, context.models, done, callback);
  });
};

var _sendPushViaUI = function(job, context, done, callback) {
  AndroidPushNotificationService.sendAndroidPushNotficationforUi(job.data.dbData, context)
  .then(function function_name(result) {
    _success(job, result, context.models, done, callback);
  }, function function_name(error) {
    _failure(job, error, context.models, done, callback);
  });
};

var _sendPushToTag = function(job, context, done, callback) {
  AndroidPushNotificationService.sendAndroidPushNotficationforTags(job.data.dbData, context)
  .then(function function_name(result) {
    _success(job, result, context.models, done, callback);
  }, function function_name(error) {
    _failure(job, error, context.models, done, callback);
  });
};

var _success = function(job, result, models, done, callback) {
  console.log("Success" + result);
  if (!(job.data.dbData.send_type == C.PUSH_NOTIFICATION_SEND_TYPES.SEND_VIA_MONGO)) {
  	JobService.updateJobStatus(job.data, result, C.JOB_STATUS.COMPLETE, models,
    AndroidPushNotificationService.saveAndroidGCMResponseCount);
  }
  done();
  if (callback) { callback (true);}
}

var _failure = function(job, error, models, done, callback) {
  console.log("Failure" + error);
  JobService.updateJobStatus(job.data, error, C.JOB_STATUS.FAILED, models,
  AndroidPushNotificationService.saveAndroidGCMResponseCount);
  job.failed().error(error);
  done(error);
  if (callback) { callback (false);}
}

var _getGCMData = function (job) {
  if (!job || !job.data || !job.data.dbData) {
    return null;
  }
	return {
  		notification: job.data.dbData.notification,
  		gcmAPIKey : job.data.dbData.gcmAPIKey,
  		registrationIds : job.data.dbData.registrationIds
  	}
}
