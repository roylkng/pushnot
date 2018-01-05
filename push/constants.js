/*
Constants for server side.
*/
exports.CLIENT_SIDE_COOKIE_AGE = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years
exports.SESSION_COOKIE_AGE = 1000 * 60 * 60 * 4; // 4 hours
exports.DOMAIN_VISIT_AGE = 1000 * 60 * 60 * 24 * 90; // 90 days

exports.EVENT_TYPES = {
  TRACK: 'track',
  IDENTIFY: 'identify',
  PAGE: 'page',
};

exports.CHROME_PUSH_ACTIONS = {
  PERMISSION_ASKED: 1,
  PERMISSION_ACCEPTED: 2,
  PERMISSION_DENIED: 3,
  SW_INSTALLED: 4,
  SW_ACTIVATED: 5,
  PUSH_EVENT: 6,
  NOTIFICATION_DISPLAYED: 7,
  CLICK_ACTION_DEFAULT: 8,
  CLICK_ACTION_FIRST: 9,
  CLICK_ACTION_SECOND: 10,
  IDENTIFY: 'identify',
  PAGE: 'page',
};

// Mongo operation queue type
exports.OP_QUEUE_TYPE = {
  UPSERT: 1,
  INSERT: 2,
};

exports.CHANNELS = {
  WEB: 'web',
  MOBILE: 'mobile',
  SERVER: 'server',
  HTTP: 'http',
};

// Mongo operation queue type
exports.OP_QUEUE_TYPE = {
  UPSERT: 1,
  INSERT: 2,
};