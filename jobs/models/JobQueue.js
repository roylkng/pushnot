'use strict';
/*jslint node: true */

var mongoose = require('../../lib/node_modules/mongoose');
var BaseModel = require('../../lib/models/BaseModel');
var dbConnection = BaseModel.getJobConnection();

// TODO: Move all relevant fields from UserProfile to Project
var JobQueueSchema = new mongoose.Schema({
  writeKey: String,
  status: Number,
  send_type : Number,
  request_id : String,
  data: mongoose.Schema.Types.Mixed,
  send_logs: [mongoose.Schema.Types.Mixed],
  type: Number,
  follower_emails : [String],
  recieved_at : { type: Date, default: Date.now },
  processed_at: { type: Date},
}, {collection: 'jobs_jobqueue'});

var jobQueueModel = dbConnection.model('JobQueue', JobQueueSchema);
var model = module.exports = jobQueueModel;
