'use strict';
/*jslint node: true */

var mongoose = require('../../lib/node_modules/mongoose');
var BaseModel = require('../../lib/models/BaseModel');
var models = require('../models');
var cache = require('../../lib/cache/BaseCache');

function MessageIdCache() {
  cache.BaseCache.call(this, models.MessageIdentifier);
  this.idCache = {};
  this.keyCache = {};
}

MessageIdCache.prototype = Object.create(cache.BaseCache.prototype);
MessageIdCache.prototype.constructor = MessageIdCache;

MessageIdCache.prototype.load = function() {
  var idCache = this.idCache = {};
  var keyCache = this.keyCache = {};
  var that = this;
  var query = this.object.find({});
  query.exec(function(err, objects) {
    if (err) {
      console.log('Error while getting project objects.');
      console.log(err);
    } else {
      for (var i=0; i<objects.length; i++) {
        keyCache[objects[i].key] = objects[i].message_id;
        idCache[objects[i].message_id] = objects[i].key;
      }
    }
  });
};

MessageIdCache.prototype.findByKey = function(key) {
  return this.keyCache[key];
};

MessageIdCache.prototype.findById = function(id) {
  return this.idCache[id];
};

MessageIdCache.prototype.save = function(id, key, callback) {
  this.idCache[id] = key;
  this.keyCache[key] = id;
  var messageId = new (this.object)();
  messageId.message_id = id;
  messageId.key = key;
  console.log(JSON.stringify(messageId));
  messageId.save(function(err, object) {
    if (err) {
      console.log(err);
    }
    if (callback) {
      callback(object);
    }
  });
};

module.exports = new MessageIdCache();
