'use strict';

angular.module('pushNotificationsApp')
  .controller('PageEventsByProfileCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, coContextService, eventsService) {
  	$scope.profileId = $stateParams.profileId;

    function _getTimeDifference(time) {
	    var date = new Date(time);
	    var msInMinutes = 1000 * 60;
	    var minutes = ((new Date()).getTime() - date.getTime()) / msInMinutes;
	    var remainingMinutes = minutes - 60*Math.floor(minutes/60);
	    var hours = minutes / 60;
	    var remainingHours = hours - 24*Math.floor(hours/24);
	    var days = hours / 24; 
	    var snippet = ((days > 1) ? (Math.floor(days) + "d "): "") +
	                  ((days > 1 || hours > 1) ? (Math.floor(remainingHours) + "h "): "") +
	                  Math.floor(remainingMinutes) + "m";
	    return snippet;
    };

    function _getTimeStamp(time) {
      var date = new Date(time);
      var t = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        ('0' + date.getHours()).slice(-2),
        ('0' + date.getMinutes()).slice(-2),
        date.getSeconds(),
      ];
      return t[3] + ":" + t[4] + " - " + t[2] + "." + t[1] + "." + t[0]; 
    };

  	$scope.processEvent = function(et) {
    	if (!et.receivedAt) {
      		et.time = (new Date()).toString();
    	}
	    et.timestamp = _getTimeStamp(et.receivedAt);
    	et.timeago = _getTimeDifference(et.receivedAt);
      	if(et.attributes) {
      		var attributes = [];
			for (var k in et.attributes) {
				var attribute = {key: k, value: et.attributes[k]};
				attributes.push(attribute);
			}
			et.attributes = attributes;
		}
    };

  	$scope.processEvents = function (events) {
  		for (var i = 0; i < events.length; i++) {
      		$scope.processEvent(events[i]);
    	}
  		$scope.events = events;
  		$scope.$apply();
  	};

  	function init () {
      eventsService.getPageEventsOfProfile(coAppContext, $scope.profileId, $scope.processEvents);
  	};

  	init();
  });
