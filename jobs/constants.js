exports.PUSH_CHUNK_SIZE = 900;

exports.NOTIFICATION_TYPES = {
  ANDROID_PUSH: 1,
  SMS: 2,
  CHROME_PUSH: 3,
};

exports.JOB_TYPES = {
  ANDROID_PUSH: 1,
  SMS: 2,
  CHROME_PUSH: 3,
};
exports.CONSUMER_TYPES = {
  ANDROID_PUSH: "send-android-push-notification",
	CHROME_PUSH: "send-chrome-push-notification"
}
exports.JOB_CONSUMER_FUNCTION = {
  ANDROID_PUSH : "ConsumeAndroidPushNotificationJob",
	CHROME_PUSH : "ConsumeChromePushNotificationJob"
}

exports.JOB_STATUS = {
	RECIEVED  : 1,
	ENQUEUED  : 2,
	ACTIVE    : 3,
	INACTIVE  : 4,
	COMPLETE  : 5,
	DELAYED   : 6,
	FAILED    : 7,
	REMOVED   : 8,
}

// Mongo operation queue type
exports.OP_QUEUE_TYPE = {
  UPSERT: 1,
  INSERT: 2,
};

exports.PUSH_NOTIFICATION_SEND_TYPES = {
  TEST_SEND       : 1,
  SEND_TO_ALL     : 2,
  SEND_TO_SEGMENT : 3,
  SEND_TO_LIST    : 4,
  SEND_VIA_MONGO  : 5,
  SEND_API        : 6,
  SEND_TO_TAG     : 7,
};

exports.SMS_SEND_TYPES = {
  TEST_SEND       : 1,
  SEND_API        : 6,
};

exports.SMS_GATEWAY_TYPES = {
  GUPSHUP : 1,
};

exports.SMS_RESPONSE_TYPES = {
  SUCCESS                   : 1,
  SUBMITTED                 : 2,
  FAIL_ABSENT_SUBSCRIBER    : 3,
  FAIL_UNKNOWN_SUBSCRIBER   : 4, 
  FAIL_BLOCKED_MASK         : 5, 
  FAIL_SYSTEM_FAILURE       : 6, 
  FAIL_CALL_BARRED          : 7, 
  FAIL_SERVICE_DOWN         : 8, 
  FAIL_OTHER                : 9, 
  FAIL_DND_FAIL             : 10, 
  FAIL_DND_TIMEOUT          : 11, 
  FAIL_OUTSIDE_WORKING_HOUR : 12, 
};
