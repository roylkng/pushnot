var C = require('../../jobs/constants');
var E = require('../constants');

var tagElements = [{
	name: 'Urls',
	value: E.TAG_ELEMENTS.PAGE_URL
}];

var tagMatchTypes = [{
	name: 'Contains',
	value: E.TAG_MATCH_TYPES.CONTAINS
},
{
	name: 'Equals',
	value: E.TAG_MATCH_TYPES.EQUALS
},
{
	name: 'Regex',
	value: E.TAG_MATCH_TYPES.REGEX
}];

var supportedLanguages = [{
  name: 'English',
  value: 'en'
}, {
  name: 'Slovak',
  value: 'sk'
}, {
  name: 'Czech',
  value: 'cz'
}, {
  name: 'Hungarian',
  value: 'hu'
}];

var jobStatus = [
	{name: 'Recieved', value: C.JOB_STATUS.RECIEVED},
	{name: 'Enqueued', value: C.JOB_STATUS.ENQUEUED},
	{name: 'Active', value: C.JOB_STATUS.ACTIVE},
	{name: 'Inactive', value: C.JOB_STATUS.INACTIVE},
	{name: 'Complete', value: C.JOB_STATUS.COMPLETE},
	{name: 'Delayed', value: C.JOB_STATUS.DELAYED},
	{name: 'Failed', value: C.JOB_STATUS.FAILED},
	{name: 'Removed', value: C.JOB_STATUS.REMOVED}
];

var jobTypes = [
	{name: 'Android Push', value: C.JOB_TYPES.ANDROID_PUSH}
];

var sendTypes = [
	{name: 'Test Send', value: C.PUSH_NOTIFICATION_SEND_TYPES.TEST_SEND},
	{name: 'Send To All', value: C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_ALL},
	{name: 'Send To Segment', value: C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_SEGMENT},
	{name: 'Send To List', value: C.PUSH_NOTIFICATION_SEND_TYPES.SEND_TO_LIST},
	{name: 'Send Via Mongo', value: C.PUSH_NOTIFICATION_SEND_TYPES.SEND_VIA_MONGO},
	{name: 'Send Api', value: C.PUSH_NOTIFICATION_SEND_TYPES.SEND_API}
];

exports.jobTypes = jobTypes;
exports.jobStatus = jobStatus;
exports.sendTypes = sendTypes;
exports.supportedLanguages = supportedLanguages;
exports.tagElements = tagElements;
exports.tagMatchTypes = tagMatchTypes;