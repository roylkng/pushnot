'use strict';
// jslint node: true;

var sinon = require('sinon');
var kue = require('kue');

var C = require('../../constants');
var AndroidPushNotificationService = require('../../services/android-push-notification.service');
var consumer = require('../../consumer/send-android-push-notification');

var models = {};

describe("consumeAndroidPushNotificationJob", function() {
  it("if sending fails", function() {
    var done = sinon.spy();
    var job = {data: {dbData: {}}};
    var queue = {process: sinon.stub().callsArgWith(2, job, done)};

    var kueStub = sinon.stub(kue, 'createQueue').returns(queue);

    var sendPushNotificationStub = sinon.stub(AndroidPushNotificationService,
                                              'sendAndroidPushNotfication')
                                        .returns({then: sinon.stub().callsArg(1)})

    consumer.consumeAndroidPushNotificationJob(models); 
    
    expect(kueStub.called).toEqual(true);
    expect(queue.process.called).toEqual(true);
    expect(sendPushNotificationStub.called).toEqual(true);
    expect(done.called).toEqual(false);

    kueStub.restore();
    sendPushNotificationStub.restore();
  });

  it("if sending succeeds", function() {
    var done = sinon.spy();
    var job = {data: {dbData: {}}};
    var queue = {process: sinon.stub().callsArgWith(2, job, done)};

    var kueStub = sinon.stub(kue, 'createQueue').returns(queue);

    var sendPushNotificationStub = sinon.stub(AndroidPushNotificationService,
                                              'sendAndroidPushNotfication')
                                        .returns({then: sinon.stub().callsArg(0)})

    var updateJobStatusStub = sinon.stub(AndroidPushNotificationService,
                                         "updateJobStatus");

    consumer.consumeAndroidPushNotificationJob(models); 
    
    expect(kueStub.called).toEqual(true);
    expect(queue.process.called).toEqual(true);
    expect(sendPushNotificationStub.called).toEqual(true);
    expect(updateJobStatusStub.calledWith(sinon.match.any,
                                          sinon.match.any,
                                          C.JOB_STATUS.COMPLETE)).toEqual(true);
    expect(done.called).toEqual(true);

    kueStub.restore();
    sendPushNotificationStub.restore();
  });
});
