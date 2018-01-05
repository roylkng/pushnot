// This file contains constants required only on the client side.
// Any constant/config that is sensitive and should not be sent to client side should not be part of it
exports.USER_ACTIONS = {
  CLOSED          : '0', // notification closed by user
  CLICKED         : '1', // notification clicked by user
  SAMPLE_SELECTED : '2', // notification selected for this sample
  SAMPLE_REJECTED : '3', // notification rejected for this sample
  DISPLAYED       : '4', // notification opened/displayed to the user
  AUTOCLOSED      : '5', // notification auto closed
  MINIMIZED       : '6', // notification minimized
  UNMINIMIZED     : '7', // notification unminimized
};

exports.EMAIL_ACTIONS = {
  SENT     : 0,   //Email sent to a specific profile
  DELIVERED: 1,   //Email SNS notification status is delivered
  COMPLAINT: 2,   //Email SNS notification status is complaint
  BOUNCED  : 3,   //Email SNS notification status is bounced
  OPENED   : 4,   //Email opened by profile
};

// User actions for HTML5 Notifications (Chrome Notifications)
// As of now, we are using the same constants for offline/online notifications

exports.NOTIFICATION_SEND_STATUS = {
  PENDING : 1,
  SENDING: 2,
  SENT: 3,
  FAILED: 4,
  QUEUEING: 5,
  QUEUED: 6,
};

// User actions for push Notifications
exports.PUSH_ACTIONS = {
  SENT                : 1,
  DISPLAYED           : 2,
  CLICKED             : 3,
  OPENED              : 4,
};

exports.PUSH_NOTIFICATION_SEND_TYPES = {
  TEST_SEND       : 1,
  SEND_TO_ALL     : 2,
  SEND_TO_SEGMENT : 3,
  SEND_TO_LIST    : 4,
  SRND_VIA_MONGO  : 5,
};

exports.PUSH_NOTIFICATION_TYPES = {
  PLAIN_TEXT    : 1,
  IMAGE         : 2,
  SINGLE_ACTION : 3,
  DOUBLE_ACTION : 4,
  CUSTOM_BROADCAST : 5,
  INTERNAL_TEST : 6
};

exports.CHROME_NOTIFICATION_TYPES = {
  BASIC       : 1,
  IMAGE       : 2,
  LIST        : 3,
  PROGRESS    : 4,
};

exports.PRODUCT_TYPES = {
  MESSAGING : 1,
  LEADS     : 2,
  DEMO_ASSISTANT : 3
};

exports.AGGREGATE_TYPES = {
  NOTIFICATION : 1,
  HOURLY       : 2
};

exports.GA_EVENTS = {
  VIEW       : "View",
  CLICK      : "Click",
  CLOSE      : "Close",
  SUBMIT     : "Submit",
  MINIMIZE   : "Minimized",
  UNMINIMIZE : "Unminimized"
};


exports.DEFAULT_NEG_Z_INDEX = -100;
exports.DEFAULT_Z_INDEX = 199999990;
exports.DEFAULT_Z_INDEX_2 = 199999991;
exports.DEFAULT_Z_INDEX_3 = 199999989;

exports.REQUEST_TYPE = {
  GET : 1,
  POST : 2,
};

exports.TOP_BAR_POSITION = {
  fixed : 'Sticky',
  absolute : 'Non Sticky'
};

exports.BROWSER = {
  IE_ONLY: 1,
  CHROME_ONLY: 2,
  SAFARI_ONLY: 3,
  FIREFOX_ONLY: 4,
  EXCLUDE_SAFARI: 5,
};

exports.OS = {
  ALL : 0,
  ANDROID : 1,
  BLACKBERRY : 2,
  iOS : 3,
  MAC : 4,
  WINDOWS : 5,
  WINDOWS_PHONE : 6,
  OTHER : 7,
};


exports.VALIDATION_TYPES = {
  TEN_DIGITS : 1,
  DIFFERENT_DIGITS : 2,
};

/*
Constants for EVENTS
*/
exports.EVENT_TYPES = {
  TRACK: 'track',
  IDENTIFY: 'identify',
  PAGE: 'page',
};

exports.CHANNELS = {
  WEB: 'web',
  MOBILE: 'mobile',
  SERVER: 'server',
  HTTP: 'http',
};

exports.MATCH_TYPES = {
  EQUALS : 0,
  NOT_EQUALS : 1,
  GREATER_THAN : 2,
  SMALLER_THAN : 3,
  GREATER_THAN_EQUALS : 4,
  SMALLER_THAN_EQUALS : 5,
  SINCE_HAPPENED_GREATER_THAN : 6,
  SINCE_HAPPENED_LESS_THAN : 7,
};

exports.ATTRIBUTE_TYPE = {
  STRING: 0,
  NUMBER: 1,
  BOOLEAN: 2,
  DATE: 3
};

exports.MESSAGE_TYPES = {
  WEB: 0,
  EMAIL: 1,
  ANDROID_PUSH: 2,
  IOS_PUSH: 3,
  HTML5: 4, // Browser notifications.
};

// used in the profile object for push notifications
exports.DEVICE_TYPES = {
  ANDROID : 1,
  CHROME : 2,
  SAFARI : 3,
};

exports.CLIENT_SIDE_MATCH_TYPES = {
  CONTAINS: 1,
  DOES_NOT_CONTAIN: 2,
};

// Mailer types
exports.MAILER_TYPES = {
  SES: 1,
  SENDGRID: 2,
  MANDRILL: 3,
};

// Mongo operation queue type
exports.OP_QUEUE_TYPE = {
  UPSERT: 1,
  INSERT: 2,
};

exports.DEVICES = {
  MOBILE: 1,
  DESKTOP: 2,
  TABLET: 3,
};

exports.TAG_ELEMENTS = {
  PAGE_URL: 1
}

exports.TAG_MATCH_TYPES = {
  CONTAINS: 1,
  EQUALS: 2,
  REGEX: 3
};