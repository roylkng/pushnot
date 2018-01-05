'use strict';
/*jslint node: true */

var C = require('../constants');

var dbqueue = module.exports;

dbqueue.DbQueue = function(object, type, maxOps, maxTime) {
  this.object = object;
  this.type = type;
  this.maxOps = maxOps || 1;
  this.maxTime = maxTime || 1000;
  this.lastFlushTime = (new Date()).getTime();
  this.opCache = [];
};

dbqueue.DbQueue.prototype = {
  constructor: dbqueue.DbQueue,

  shouldFlush : function() {
    var time = (new Date()).getTime();
    var bulk = this.object.collection.initializeUnorderedBulkOp();
    if ((this.opCache.length > this.maxOps ||
        time - this.lastFlushTime > this.maxTime) && bulk) {
      return true;
    }
    return false;
  },

  flush : function(callback) {
    var bulk = this.object.collection.initializeUnorderedBulkOp();
    var N = this.opCache.length;
    //console.log(N);
    if (N > 0) {
      for (var i=0; i < N; i++) {
        var op = this.opCache[i];
        if (this.type == C.OP_QUEUE_TYPE.INSERT) {
          bulk.insert(op.query);
        } else {
          bulk.find(op.query).upsert().update(op.update);
        }
        //console.log(op);
      }
      this.opCache.splice(0, N);
      this.lastFlushTime = (new Date()).getTime();
      //console.log(this.opCache.length);
      //console.log("Flushing ...");
      bulk.execute(function(err) {
        if (err) {
          console.log(err);
        }
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  },
  
  scheduleFlush: function(callback) {
    if (this.shouldFlush()) {
      this.flush(callback);
    } else {
      var queue = this;
      setTimeout(function() {
        if (queue.shouldFlush()) {
          queue.flush();
        }
      }, this.maxTime);
      if (callback) callback();
    }
  },

  add : function(op, callback) {
    this.opCache.push(op);
    this.scheduleFlush(callback);
  }
};
