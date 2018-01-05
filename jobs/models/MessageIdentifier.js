'use strict';
/*jslint node: true */

var mongoose = require('../../lib/node_modules/mongoose');
var BaseModel = require('../../lib/models/BaseModel');
var dbConnection = BaseModel.getJobConnection();

var MessageIdentifierSchema = new mongoose.Schema({
  message_id  : String,
  key : String,
  createdAt: { type: Date, default: Date.now },
}, {collection: 'jobs_messageid'});

// Expire after 10 days.
MessageIdentifierSchema.index({"createdAt": -1},
                              {expireAfterSeconds: 864000});

var MessageIdentifierModel = dbConnection.model('MessageIdentifier',
                                                MessageIdentifierSchema);
var model = module.exports = MessageIdentifierModel;
