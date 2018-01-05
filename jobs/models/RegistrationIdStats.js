'use strict';
/*jslint node: true */

var mongoose = require('../../lib/node_modules/mongoose');
var BaseModel = require('../../lib/models/BaseModel');
var dbConnection = BaseModel.getJobConnection();

// TODO: Move all relevant fields from UserProfile to Project

var RegistrationIdStatsSchema = new mongoose.Schema({
  writeKey: String,
  registrationId : String,
  canonicalId : String,
  failure : Number,
}, {collection: 'jobs_registrationidstats'});

RegistrationIdStatsSchema.index({"time": -1}, {expireAfterSeconds: 7776000})
RegistrationIdStatsSchema.index({ writeKey: 1});

var registrationIdStatsModel = dbConnection.model('RegistrationIdStats', RegistrationIdStatsSchema);
var model = module.exports = registrationIdStatsModel;