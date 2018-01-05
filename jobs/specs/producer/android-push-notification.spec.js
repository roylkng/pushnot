queue = require('kue').createQueue();
var chai = require('chai');

var expect = chai.expect;
var AndroidPushNotificationProducer = require('../../producer/android-push-notification');

before(function() {
  queue.testMode.enter();
});

afterEach(function() {
  queue.testMode.clear();
});

after(function() {
  queue.testMode.exit()
});

it('check if job is produced', function() {
	AndroidPushNotificationProducer.ProduceAndroidPushNotificationJob({ foo: 'bar' }, queue);
  expect(queue.testMode.jobs.length).to.equal(1);
  expect(queue.testMode.jobs[0].type).to.equal('Android Push Notification');
  expect(queue.testMode.jobs[0].data).to.not.equal({ foo: 'bar' });
});



it('check if job is produced with correct data', function() {
	var kueObject = {
		id: "asd",
		requestId: "asdsdf",
	}
	var savedObject = {
        "dbData": {
          "id": "asd",
          "requestId": "asdsdf",
        },
        "dbId": "asd",
        "title": "asdsdf"
       }
	AndroidPushNotificationProducer.ProduceAndroidPushNotificationJob(kueObject,queue);
  // queue.createJob('myJob', { foo: 'bar' }).save();
  expect(queue.testMode.jobs.length).to.equal(1);
  expect(queue.testMode.jobs[0].type).to.equal('Android Push Notification');
  expect(queue.testMode.jobs[0].data).to.eql(savedObject);
});