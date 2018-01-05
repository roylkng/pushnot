'use strict';

angular.module('pushNotificationsApp')
  .factory('jobStatsService', function ($http, $q) {
    var jobStatsService = {};

    var _sendUrl = function(url, callback) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function(responseData ) {
          callback(responseData);
        },
      });
    };

    jobStatsService.getAllJobsForProject = function(writeKey, coAppContext, callback) {
      var url = 'http://' + coAppContext.jobHostUrl + 'getJobStatsProject?writeKey='+writeKey;
      _sendUrl(url, callback);
    };

    return jobStatsService;
});