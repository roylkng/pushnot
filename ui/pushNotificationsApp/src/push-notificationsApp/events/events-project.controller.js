'use strict';

angular.module('pushNotificationsApp')
  .controller('EventsByProjectCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, coContextService, eventsService) {
  	$scope.profileId = $stateParams.profileId;
    $scope.activeTab = $stateParams.currentTab;
    $scope.var1 = false;
    $scope.var2 = false;
    $scope.var3 = false;
    $scope.var4 = false;                
    $scope.var5 = false;
    $scope.var6 = false;
    $scope.var7 = false;
    $scope.var8 = false;
    $scope.var9 = false;
    $scope.var10 = false;
    $scope.var11 = false;
    $scope.var12 = false;
    $scope.dateRange = coContextService.getSelectedDateRange();
    $scope.dateRangeFlag = false;

    $scope.tabs = [
      {'title': "Events", 'template': "push-notificationsApp/events/tabs/events.html"},
      {'title': "Page Events", 'template': "push-notificationsApp/events/tabs/page-events.html"},
    ];

    $scope.selectTab = function(i) {
      $state.go('events', {'profileId': $scope.profileId, 'currentTab': i});
      $scope.activeTab = i;
    }

    $scope.polarOptions = {
      scaleShowLabelBackdrop : true,
      scaleBackdropColor : "rgba(255,255,255,0.75)",
      scaleBeginAtZero : true,
      scaleBackdropPaddingY : 1,
      scaleBackdropPaddingX : 1,
      scaleShowLine : true,
      segmentShowStroke : true,
      segmentStrokeColor : "#fff",
      segmentStrokeWidth : 2,
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false,
    };
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
      var x = parseInt(et.sessionId);
	    et.timestamp = _getTimeStamp(x);
    	et.timeago = _getTimeDifference(x);
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

    $scope.initGraphsOs = function (countStats) {
      var highlight = "#1ab394";
      $scope.polarDataOs = [];
      var colors = randomColor({hue: 'random', luminosity: 'light', count: countStats.length});

      for (var i=0;i<countStats.length;i++) {
        var data = {};
        data.value = countStats[i].total;
        data.color = colors[i];
        data.highlight = highlight;
        data.label = countStats[i]._id.osName;
        $scope.polarDataOs.push(data);
      }
      $scope.$apply();
    };

    $scope.initGraphsDevice = function (countStats) {
      var highlight = "#1ab394";
      $scope.polarDataDevice = [];
      var colors = randomColor({hue: 'random', luminosity: 'light', count: countStats.length});

      for (var i=0;i<countStats.length;i++) {
        var data = {};
        data.value = countStats[i].total;
        data.color = colors[i];
        data.highlight = highlight;
        data.label = countStats[i]._id.channel;
        $scope.polarDataDevice.push(data);
      }
      $scope.$apply();
    };

    $scope.initCrossDomainCounts = function (countStats) {
      var highlight = "#1ab394";
      $scope.polarDataCrossDomain = [];
      $scope.polarDataByDomain = [];
      var colors = randomColor({hue: 'random', luminosity: 'light', count: countStats.length});

      for (var i=0;i<countStats.length;i++) {
        var data = {};
        data.value = countStats[i].total;
        data.color = colors[i];
        data.highlight = highlight;
        data.label = countStats[i]._id.domains;
        if (data.label.indexOf(',')===-1) {
          $scope.polarDataByDomain.push(data);
        } else {
          $scope.polarDataCrossDomain.push(data);
        }
      }
      $scope.$apply();
    };

    $scope.initGraphsIdentified = function (countStats) {
      if (countStats.length>0) {
        $scope.identifiedEventCount = countStats[0].identifiedCount;
        $scope.anonymousEventCount = countStats[0].anonymousCount;
        $scope.$apply();
      }
    };

    $scope.initGraphsIdentifiedSessions = function (countStats) {
      if (countStats.length > 0) {
        $scope.identifiedSessionCount = countStats[0].identifiedCount;
        $scope.anonymousSessionCount = countStats[0].unidentifiedCount;
        $scope.$apply();
      }
    };

    $scope.initSessionsByDomain = function (countStats) {
      $scope.sessionCountByDomain = [];
      if (countStats.length > 0) {
        for (var i=0; i< countStats.length;i++) {
          var obj = {
            domain: countStats[i]._id.domain,
            total: countStats[i].total
          };
          $scope.sessionCountByDomain.push(obj);
        }
        $scope.$apply();
      }
    };

  	function init () {
      var selectedDateRange = {
        startDate : moment().startOf('day'),
        endDate: moment().endOf('day')
      };
      if(moment($scope.dateRange.endDate).diff(moment().endOf('day'))>0) {
        $scope.dateRangeFlag = true;
      }
      if(moment($scope.dateRange.startDate).diff(moment().subtract('months', 3).startOf('day'))<0) {
        $scope.dateRangeFlag = true; 
      }
      if ($scope.dateRangeFlag === true) {
        coContextService.setSelectedDateRange(selectedDateRange);
        $scope.dateRange = coContextService.getSelectedDateRange();
      }

      var dateObj = {
        start: Math.floor($scope.dateRange.startDate.valueOf()/(1000*60*60*24)),
        end: Math.floor($scope.dateRange.endDate.valueOf()/(1000*60*60*24))
      };

      if ($scope.activeTab == '0'|| $scope.activeTab == 0) {
        eventsService.getEventsForProject(coAppContext, $scope.dateRange, $scope.processEvents);
        eventsService.getEventStatsByDevice(coAppContext, dateObj, $scope.initGraphsDevice);
        eventsService.getEventStatsByOs(coAppContext, dateObj, $scope.initGraphsOs);
        eventsService.getIdentifiedEventsCount(coAppContext, dateObj, $scope.initGraphsIdentified);
        eventsService.getCrossDomainEventsCount(coAppContext, dateObj, $scope.initCrossDomainCounts);
      }
      else {
        eventsService.getPageEventsForProject(coAppContext, $scope.dateRange, $scope.processEvents);
        eventsService.getPageEventStatsByDevice(coAppContext, dateObj, $scope.initGraphsDevice);
        eventsService.getPageEventStatsByOs(coAppContext, dateObj, $scope.initGraphsOs);
        eventsService.getIdentifiedPageEventsCount(coAppContext, dateObj, $scope.initGraphsIdentified);
        eventsService.getIdentifiedSessionsCount(coAppContext, dateObj, $scope.initGraphsIdentifiedSessions);
        eventsService.getSessionsCountByDomain(coAppContext, dateObj, $scope.initSessionsByDomain);
        eventsService.getCrossDomainPageEventsCount(coAppContext, dateObj, $scope.initCrossDomainCounts);
      }
  	};

  	init();
  });
