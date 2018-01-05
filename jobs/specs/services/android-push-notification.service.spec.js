var sinon = require('sinon');
var Q = require('q');
var AndroidPushNotificationService = require('../../services/android-push-notification.service');

describe("isValidPayload", function() {

  it("should return true for valid payload", function() {
    // invalid or no object
    var error = null;
    payload = {
      notification    : {name : "sddf", title : "weds"},
      registrationIds : ["1234567"],
      gcmAPIKey       : "123",
      requestId       : "1"
    };

    expect(AndroidPushNotificationService.isValidPayload(payload,error)).toEqual(true);
  });

  it("should return false if notification is not present in payload", function() {
    // invalid or no object
    var error = null;
    payload = {
      registrationIds : ["1234567"],
      gcmAPIKey       : "123",
      requestId       : "1"
    };
    expect(AndroidPushNotificationService.isValidPayload(payload,error)).toEqual(false);
  });

  it("should return false if gcmAPIKey/writekey is not present in payload", function() {
    // invalid or no object
    var error = null;
    payload = {
      notification    : {name : "sddf", title : "weds"},
      registrationIds : ["1234567"],
      requestId       : "1"
    };
    expect(AndroidPushNotificationService.isValidPayload(payload,error)).toEqual(false);
  });

  it("should return true if gcmAPIKey or writekey is not present in payload", function() {
    // invalid or no object
    var error = null;
    payload = {
      notification    : {name : "sddf", title : "weds"},
      registrationIds : ["1234567"],
      writeKey       : "123",
      requestId       : "1"
    };
    expect(AndroidPushNotificationService.isValidPayload(payload,error)).toEqual(true);
  });

  it("should return false if registration ids is not present in payload", function() {
    // invalid or no object
    var error = null;
    payload = {
      notification    : {name : "sddf", title : "weds"},
      registrationIds : [],
      writeKey       : "123",
      requestId       : "1"
    };
    expect(AndroidPushNotificationService.isValidPayload(payload,error)).toEqual(false);
  });

  it("should return false if requestid is not present in payload", function() {
    // invalid or no object
    var error = null;
    payload = {
      notification    : {name : "sddf", title : "weds"},
      registrationIds : [],
      writeKey       : "123",
    };
    expect(AndroidPushNotificationService.isValidPayload(payload,error)).toEqual(false);
  });

});

describe("getAndroidPushNotificationKueObject", function() {

  it("should kue object from payload", function() {

    data = { send_logs: [],
      follower_emails: [],
      recieved_at: "Tue Mar 15 2016 17:01:25 GMT+0530 (IST)",
      id: "56e7f28dcf8f70ce14abd75e",
      status: 1,
      data: { type: 1,
       notification: {name : "sddf", title : "weds"}, 
       registrationIds: ["1234567"],
       gcmAPIKey: "123",
       requestId: "1" },
    };
    payload = {
      notification    : {name : "sddf", title : "weds"},
      id              : "56e7f28dcf8f70ce14abd75e",
      registrationIds : ["1234567"],
      gcmAPIKey       : "123",
      requestId       : "1"
    };

    expect(AndroidPushNotificationService.getAndroidPushNotificationKueObject(data)).toEqual(payload);
  });
});

// WIP
describe("sendAndroidPushNotfication", function() {

  it("should return promise after pushing the job in Kue Queue", function() {

    var data = {
      notification: {},
      gcmAPIKey : "123",
      registrationIds : ["job.data.dbData.registrationIds"]
    }
    var deferred = Q.defer();
    // deferred.resolve(401);
    var promise = deferred.promise;
    var response = null;
    AndroidPushNotificationService.sendAndroidPushNotfication({}).then(function(object) {
      response = object;
    expect(response).toEqual(401);
    }, function(error) {
      response = error;
    expect(response).toEqual(401);
    })

  });
  // it("equals 5", function(done) {
  //     AndroidPushNotificationService.sendAndroidPushNotfication({}).then(function(value) {
  //         expect(value).toBe(401);
  //         done();
  //     });
  //     return;
  // });
});
