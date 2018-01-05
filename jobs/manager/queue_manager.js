var kue = require('kue');
var E = require('../../lib/constants');
// Connect to redis
var redis = require('redis');
require('node-redis-streamify')(redis);
var rediscl = redis.createClient();
// Connect to Mongo
var mongoose = require('../../lib/node_modules/mongoose');
var BaseModel = require('../../lib/models/BaseModel');
var JobConnection = mongoose.createConnection(E.config.jobsMongoUrl,
                                              {auto_reconnect: true, server: { socketOptions: { keepAlive: 1 } }});
BaseModel.setJobConnection(JobConnection);
mongoose.set('debug', true);
// Connect to Cassandra
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: E.config.cassandraContactPoints, keyspace: 'events'});

var models = require('../models');
var modelsClass = require('../../api/node_modules/express-cassandra');
var modelStore = require('../../api/modelStore');
var sendAndroidPushNotification = require('../consumer/send-android-push-notification');
var sendChromePushNotification = require('../consumer/send-chrome-push-notification');
var sendSms = require('../consumer/send-sms');

var context = {
  models: models,
  redis: rediscl,
  client: client,
  kueJobQueue : kue.createQueue(),
};

function postDBConnection(modelsClass) {
  modelStore.setModels(modelsClass.instance);
  context.cassandraModels = modelStore.getModels();
  // kue.redis.createClient = function(){
  // var client = redis.createClient('6379','127.0.0.1',{no_ready_check: true});
  // return client;
  // }
  // var job = kue.Job;
  // job.rangeByState('inactive', 0, 100, 1, function(err, jobs) {
  //   jobs.forEach(function(job) {
  //     // if (job.created_at ) return;
  //     	// console.log("completeeeeeeeeeeeeeeeeeeeeed jobbsssssssss");
  //     console.log(job.id);
  //     console.log(job.type);
  //     // job.remove();  
  //   });
  // });
  
  // kue.Job.rangeByType ('job', 'failed', 0, 10, 'asc', function (err, selectedJobs) {
  //     selectedJobs.forEach(function (job) {
  //     	console.log("completeeeeeeeeeeeeeeeeeeeeed jobbsssssssss");
  //     console.log(job);
  //         // job.state('inactive').save();
  //     });
  // });
  console.log("Starting Consumer");
  sendAndroidPushNotification.consumeAndroidPushNotificationJob(context);
  sendChromePushNotification.consumeChromePushNotificationJob(context);
  sendSms.consumeSmsJob(context);
  // kue.Job.active( function( err, ids ) {
  //   ids.forEach( function( id ) {
  //     kue.Job.get( id, function( err, job ) {
  //     	console.log("alll jobbssssssssss");
  //     	console.log(job);
  //     	console.log("alll jobbssssssssss");
  //       // Your application should check if job is a stuck one
  //       // job.inactive();
  //     });
  //   });
  // });
}; 

modelsClass.setDirectory( __dirname + '/../../api/models').bind(
    {
        clientOptions: {
            contactPoints: E.config.cassandraContactPoints,
            protocolOptions: { port: 9042 },
            keyspace: 'events',
            queryOptions: {consistency: modelsClass.consistencies.one}
        },
        dropTableOnSchemaChange: false,
        dontCreateKeyspace: false
    },
    function(err) {
      if(err) {
        throw err;
      }
      else {
        console.log('Connected to DB');
        postDBConnection(modelsClass);
      }
    }
);
