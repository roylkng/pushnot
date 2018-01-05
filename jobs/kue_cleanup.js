var kue = require('kue');
var jobs = kue.createQueue();
var util = require('util');
var noop = function() {};

jobs.CLEANUP_MAX_FAILED_TIME = 15 * 24 * 60 * 60 * 1000;  // 15 days
jobs.CLEANUP_MAX_ACTIVE_TIME = 10 * 24 * 60 * 60 * 1000;  // 10 day
jobs.CLEANUP_MAX_COMPLETE_TIME = 5 * 24 * 60 * 60 * 1000; // 15 days
jobs.CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes


// this is a simple log action
function QueueActionLog(message) {
  this.message = message || 'QueueActionLog :: got an action for job id(%s)';

  this.apply = function(job) {
    console.log(util.format(this.message, job.id));
    return true;
  };
}

// remove item action
function QueueActionRemove(age) {
  this.age = age;

  this.apply = function(job) {
    job.remove(noop);
    return true;
  };
}

// filter by age
function QueueFilterAge(age) {
    this.now = new Date().getTime();
    this.age = age;

    this.test = function(job) {
        var created = parseInt(job.created_at);
        var age = this.now - created;
        return age > this.age;
    };
 }

// the queue iterator
var queueIterator = function(ids, queueFilterChain, queueActionChain) {
  ids.forEach(function(id, index) {
    // get the kue job
    kue.Job.get(id, function(err, job) {
    	if (err || !job) return;
      var filterIterator = function(filter) { return filter.test(job) };
      var actionIterator = function(filter) { return filter.apply(job) };

      // apply filter chain
      if(queueFilterChain.every(filterIterator)) {

        // apply action chain
        queueActionChain.every(actionIterator);
      }
    });
  });
};

function performCleanup() {
  var ki = new kue;

  ki.failed(function(err, ids) {
    if (!ids) return;
    queueIterator(
      ids,
      [new QueueFilterAge(jobs.CLEANUP_MAX_FAILED_TIME)],
      [new QueueActionLog('Going to remove job id(%s) for being failed too long'),
        new QueueActionRemove()]
    );
  });

  ki.active(function(err, ids) {
    if (!ids) return;
    queueIterator(
      ids,
      [new QueueFilterAge(jobs.CLEANUP_MAX_ACTIVE_TIME)],
      [new QueueActionLog('Going to remove job id(%s) for being active too long'),
        new QueueActionRemove()]
    );
  });

  ki.complete(function(err, ids) {
    if (!ids) return;
    queueIterator(
      ids,
      [new QueueFilterAge(jobs.CLEANUP_MAX_COMPLETE_TIME)],
      [new QueueActionLog('Going to remove job id(%s) for being complete too long'),
        new QueueActionRemove()]
    );
  });
}

setInterval(performCleanup, jobs.CLEANUP_INTERVAL);