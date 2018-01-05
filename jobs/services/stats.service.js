'use strict';
// jslint node: true 

exports.aggregateResponseStatsForChannel = function(req, res, context, models) {
  var findCondition = {
  };
  getCount(findCondition, ResponseCount, callback);
};

exports.aggregateResponseStatsByJob = function(req, res, context, models) {
  var findCondition = {
  };
  getCount(findCondition, ResponseCount, callback);
};

var getCount = function (findCondition, ResponseCount, callback) {
  var query = ResponseCount.find(findCondition).lean();
  query.exec(function(err, objects) {
    if (callback) callback(err, objects);
  });
};
