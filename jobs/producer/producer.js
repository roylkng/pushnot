'use strict';
// jslint node: true;

var Q = require('q');

exports.produceJob = function(payload, queue, title) {
  var deferred = Q.defer();
  queue.create(title, { 
					     title: payload.requestId,
					     dbId : payload.id,
					     dbData: payload 
					    })
  			.priority('high')
  			.save(function (err) {
							   if ( err ) { 
                    deferred.reject(err)
                 } else {
                    deferred.resolve(payload);
                 }
                });
  return deferred.promise;
};
