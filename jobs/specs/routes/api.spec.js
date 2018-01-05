'use strict';
/*jslint node: true */

var sinon = require('sinon');
var Q = require('q');

var api_routes = require('../../routes/api');
var kue = require('kue');
var queue = kue.createQueue();
var AndroidPushNotificationService = require('../../services/android-push-notification.service');
var AndroidPushNotificationProducer = require('../../producer/android-push-notification');
var models = {};
var caches = {};
var context = {};
var req = {};
req.body = {};
var res = {};

describe("sendAndroidPushNotification", function() {
  it("should return error if payload is invalid", function() {
    context.kueJobQueue = sinon.spy();    

    var resEnd = sinon.spy();
    res.status = sinon.stub().returns({send: resEnd});

    var isValidPayloadStub = sinon.stub(AndroidPushNotificationService,
                                        "isValidPayload")
                                  .returns(false);

    api_routes.sendAndroidPushNotification(req, res, context, models);

    expect(isValidPayloadStub.called).toEqual(true);
    expect(res.status.calledWith(400)).toEqual(true);  
    expect(resEnd.calledWith(null)).toEqual(true);  

    isValidPayloadStub.restore();
  });

  it("should return error if job not saved", function() {
    var resEnd = sinon.spy();
    res.status = sinon.stub().returns({send: resEnd});

    var isValidPayloadStub = sinon.stub(AndroidPushNotificationService,
                                        "isValidPayload")
                                  .returns(true);

    var saveJobStub = sinon.stub(AndroidPushNotificationService,
                                 "saveAndroidPushNotificationJobtoDB")
                           .returns({then: sinon.stub().callsArg(1)})

    api_routes.sendAndroidPushNotification(req, res, context, models);

    expect(isValidPayloadStub.called).toEqual(true);
    expect(saveJobStub.calledWith(req.body, undefined)).toEqual(true);
    expect(res.status.calledWith(500)).toEqual(true);  
    expect(resEnd.called).toEqual(true);  

    isValidPayloadStub.restore();
    saveJobStub.restore();
  });

  it("should return error if push notification job is not created", function() {
    var resEnd = sinon.spy();
    res.status = sinon.stub().returns({send: resEnd});

    var isValidPayloadStub = sinon.stub(AndroidPushNotificationService,
                                        "isValidPayload")
                                  .returns(true);

    var saveJobStub = sinon.stub(AndroidPushNotificationService,
                                 "saveAndroidPushNotificationJobtoDB")
                           .returns({then: sinon.stub().callsArg(0)})

    var kueObj = {}
    var getKueObjectStub = sinon.stub(AndroidPushNotificationService,
                                 "getAndroidPushNotificationKueObject")
                           .returns(kueObj)

    var productJobStub = sinon.stub(AndroidPushNotificationProducer,
                                 "produceAndroidPushNotificationJob")
                           .returns({then: sinon.stub().callsArg(1)})

    api_routes.sendAndroidPushNotification(req, res, context, models);

    expect(isValidPayloadStub.called).toEqual(true);
    expect(saveJobStub.calledWith(req.body, undefined)).toEqual(true);
    expect(getKueObjectStub.called).toEqual(true);
    expect(productJobStub.calledWith(kueObj)).toEqual(true);
    expect(res.status.calledWith(500)).toEqual(true);  
    expect(resEnd.called).toEqual(true);  

    isValidPayloadStub.restore();
    saveJobStub.restore();
    getKueObjectStub.restore();
    productJobStub.restore();
  });

  it("should return success if job is created", function() {
    var resEnd = sinon.spy();
    res.status = sinon.stub().returns({send: resEnd});

    var isValidPayloadStub = sinon.stub(AndroidPushNotificationService,
                                        "isValidPayload")
                                  .returns(true);

    var saveJobStub = sinon.stub(AndroidPushNotificationService,
                                 "saveAndroidPushNotificationJobtoDB")
                           .returns({then: sinon.stub().callsArg(0)})

    var kueObj = {}
    var getKueObjectStub = sinon.stub(AndroidPushNotificationService,
                                 "getAndroidPushNotificationKueObject")
                           .returns(kueObj)

    var productJobStub = sinon.stub(AndroidPushNotificationProducer,
                                 "produceAndroidPushNotificationJob")
                           .returns({then: sinon.stub().callsArg(0)})

    api_routes.sendAndroidPushNotification(req, res, context, models);

    expect(isValidPayloadStub.called).toEqual(true);
    expect(saveJobStub.calledWith(req.body, undefined)).toEqual(true);
    expect(getKueObjectStub.called).toEqual(true);
    expect(productJobStub.calledWith(kueObj)).toEqual(true);
    expect(res.status.calledWith(200)).toEqual(true);  
    expect(resEnd.calledWith("Task Successfully Queued")).toEqual(true);  

    isValidPayloadStub.restore();
    saveJobStub.restore();
    getKueObjectStub.restore();
    productJobStub.restore();
  });
});
