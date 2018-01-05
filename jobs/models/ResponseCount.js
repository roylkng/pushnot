'use strict';
/*jslint node: true */

var mongoose = require('../../lib/node_modules/mongoose');
var BaseModel = require('../../lib/models/BaseModel');
var dbConnection = BaseModel.getJobConnection();

// This model can store the responses received after sending
// notification from different channels.
// There can be two kinds of objects
// {project, job, channel -> responseType, count}
// which represents responses for a particular job setup by a user
// This job could be via a notification object or API and
// will go through the jobs queue.
// or
// {project, hour, channel -> responseType, count}
// which could be for transactional notifications sent.
var ResponseCountSchema = new mongoose.Schema({
  writeKey    : String,
  jobId       : String,
  hour        : Number,
  channelType : Number,
  responseType: Number,
  count       : Number,
}, {collection: 'jobs_responsecount'});

var ResponseCountModel = dbConnection.model('ResponseCount', ResponseCountSchema);
var model = module.exports = ResponseCountModel;
