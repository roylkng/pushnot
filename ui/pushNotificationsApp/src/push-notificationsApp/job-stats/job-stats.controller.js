'use strict';

angular.module('pushNotificationsApp')
  .controller('JobStatsCtrl', function ($scope, $rootScope, $state, $modal, coAppContext,
                                                 coContextService, jobStatsService) {
  	$scope.jobs = [];
  	$scope.writeKey = coContextService.getSelectedProjectWriteKey();

  	$scope.processCount = 0;

  	$scope.populateFields = function (jobObj) {
      var job = jobObj._id;
  		if (job.type) {
  			var types = coAppContext.jobTypes;
	  		for (var i=0;i<types.length;i++) {
	  			if(job.type === types[i].value) {
	  				jobObj.typeText = types[i].name;
	  				break;
	  			}
	  		}
  		}

  		if (job.status) {
	  		var status = coAppContext.jobStatus;
	  		for (var i=0; i<status.length; i++) {
	  			if(job.status === status[i].value) {
	  				jobObj.statusText = status[i].name;
	  				break;
	  			}
	  		}  			
  		}

  		if (job.send_type) {
	  		var sendTypes = coAppContext.sendTypes;
	  		for (var i=0; i<sendTypes.length; i++) {
	  			if(job.send_type === sendTypes[i].value) {
	  				jobObj.sendTypeText = sendTypes[i].name;
	  				break;
	  			}
	  		}
  		}  		
  	};

    $scope.getRegistrationIdStats = function(){
      window.open('http://' + coAppContext.jobHostUrl + 'getRegistrationIdStats?writeKey='+$scope.writeKey);
    }


  	$scope.processJobs = function (jobs) {
  		for (var i=0; i<jobs.length; i++) {
  			$scope.populateFields(jobs[i]);
  			/*if (jobs[i].send_logs && jobs[i].send_logs.length>0 && typeof(jobs[i].send_logs[0])==='object' 
          && !jobs[i].send_logs[0].success) {
  				jobs[i].send_logs[0].success = 0;
  			}
  			if (jobs[i].send_logs && jobs[i].send_logs.length>0 && typeof(jobs[i].send_logs[0])==='object'
          && !jobs[i].send_logs[0].failure) {
  				jobs[i].send_logs[0].failure = 0;
  			}*/  			
  		}
  		$scope.jobs =jobs;
  		$scope.$apply();
  	};

  	function init () {
  		jobStatsService.getAllJobsForProject($scope.writeKey, coAppContext, $scope.processJobs);
  	};
  	init();
  });