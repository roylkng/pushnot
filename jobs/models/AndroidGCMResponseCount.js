'use strict';
/*jslint node: true */

var mongoose = require('../../lib/node_modules/mongoose');
var BaseModel = require('../../lib/models/BaseModel');
var dbConnection = BaseModel.getJobConnection();

// TODO: Move all relevant fields from UserProfile to Project
var TotalStatsModel = {
	totalIds : Number,
  success : Number,
  failure : Number, // jQuery selector
  canonicalIds : Number,
  multicastId : Number
};

var userStatsModel = {
  registrationId : String,
  userId : String, // jQuery selector
  response : mongoose.Schema.Types.Mixed,
  type : Number
};

var UserStatsSchema = new mongoose.Schema(userStatsModel);


var AndroidGCMResponseCountSchema = new mongoose.Schema({
  writeKey: String,
  request_id : String,
  jobType : Number,
  data: mongoose.Schema.Types.Mixed,
  follower_emails : [String],
  totalStats : {type :TotalStatsModel},
  userStats : [UserStatsSchema],
}, {collection: 'jobs_androidgcmresponsecount'});

var androidGCMResponseCountModel = dbConnection.model('AndroidGCMResponseCount', AndroidGCMResponseCountSchema);
var model = module.exports = androidGCMResponseCountModel;
