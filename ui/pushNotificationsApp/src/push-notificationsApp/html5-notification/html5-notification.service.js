'use strict';

angular.module('pushNotificationsApp')
  .factory('coHtml5NotificationService', function ($http, $q, coContextService) {
    var coHtml5NotificationService = {};

    var _httpPromiseBuilder = function(method, url, cacheResults, dataObj) {
      console.log(dataObj);
      var data = JSON.stringify(angular.fromJson(angular.toJson(dataObj)));
      console.log(data);

      method = method || 'GET';
      if (cacheResults !== true) {
        cacheResults = false;
      }
      return $http({
        dataType: 'json',
        cache: cacheResults,
        method: method,
        withCredentials: true,
        url: url,
        data: data,
      });
    };

    var _sendUrl = function(url, callback) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function( responseData ) {
                  callback(responseData);
               },
      });
    };

    coHtml5NotificationService.requestCacheUpdate = function(coAppContext) {
      var projectId = coContextService.getSelectedProjectId();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'cacheUpdate?type=chromeNotifications&projectId=' + projectId;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.startSending = function(coAppContext,
      html5NotificationId) {
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'sendHtml5Push?projectId=' + projectId + '&notificationId=' +
        html5NotificationId + '&writeKey=' + writeKey;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.startSendingToSegment = function(coAppContext,
      html5NotificationId, ruleId) {
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'sendPushChromeNotificationToSegment?projectId=' + projectId + '&notificationId=' +
        html5NotificationId + '&writeKey=' + writeKey + '&ruleId=' + ruleId + '&notificationType=' + 1 ;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.sendTestNotification = function(coAppContext,
      html5NotificationId, userId) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'sendHtml5Push?projectId=' + projectId + '&profileId=' + userId +
        '&notificationId=' + html5NotificationId + '&writeKey=' + writeKey;
      return _httpPromiseBuilder('GET', url, false);

   };

    coHtml5NotificationService.sendChromeToUserList = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/chrome-push-notification-ui?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    coHtml5NotificationService.sendChromeToTags = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/chrome-push-notification-tag?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    coHtml5NotificationService.sendChromeToAll = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/chrome-push-notification-all?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    coHtml5NotificationService.getNotification = function(coAppContext,
      html5NotificationId) {
      var deferred = $q.defer();

      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/' + html5NotificationId;
      _httpPromiseBuilder('GET', url, false)
      .then(
        function(response) {deferred.resolve(response.data); },
        function(reason) { deferred.reject(reason); }
      );

      return deferred.promise;
    };

    coHtml5NotificationService.createHtml5Notification = function(coAppContext,
      html5Notification) {
      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/';
      return _httpPromiseBuilder('POST', url, false, html5Notification);
    };

    coHtml5NotificationService.updateHtml5Notification = function(coAppContext,
      html5Notification) {
      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/' + html5Notification._id;
      return _httpPromiseBuilder('PUT', url, false, html5Notification);
    };

    coHtml5NotificationService.deleteEventFunction = function(coAppContext,
      html5NotificationId) {
      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/' + html5NotificationId;
      return _httpPromiseBuilder('DELETE', url, false);
    };

    coHtml5NotificationService.getNewNotification = function() {
      var projectId = coContextService.getSelectedProjectId();

      return {
        title: 'New Notification Created on ' + new Date(),
        projectId : projectId,
        details: {
          title: 'Sample Title',
          body: 'Sample message',
          ttl: 1,
        },
        targetUrl: '',
        eventRuleIds :[],
        status: 1,
      };

    };

    coHtml5NotificationService.getHtml5Notifications = function(coAppContext) {
      var dbUrl = coAppContext.dburl;
      var projectId = coContextService.getSelectedProjectId();
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/?conditions[projectId]=' + projectId;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getAnalyticsSummary = function(coAppContext) {
      var eventsUiUrl = coAppContext.eventsUiUrl;
      var projectId = coContextService.getSelectedProjectId();
      var dateRange = coContextService.getSelectedDateRange();

      var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + eventsUiUrl + 'api/html5ActionSummary' + 
        '?conditions[projectId]=' + projectId +
        '&conditions[startHour]=' + startHour +
        '&conditions[endHour]=' + endHour;

      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getNotificationAnalytics = function(coAppContext, notificationId) {
      var eventsUiUrl = coAppContext.eventsUiUrl;
      var projectId = coContextService.getSelectedProjectId();
      var dateRange = coContextService.getSelectedDateRange();

      var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + eventsUiUrl + 'api/html5NotificationActionSummary' + 
        '?conditions[projectId]=' + projectId +
        '&conditions[startHour]=' + startHour +
        '&conditions[endHour]=' + endHour +
        '&conditions[notificationId]=' + notificationId;

      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getPermissionAnalytics = function(coAppContext) {
      var pushUrl = coAppContext.pushHostUrl;
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();

      // var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      // var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + pushUrl + 'getChromePushStats' + 
        '?writeKey=' + writeKey;

      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getAllRulesForWebsite = function(coAppContext) {
      var deferred = $q.defer();

      var url = 'http://' + coAppContext.dburl + 'api/v1/rules/?conditions[projectId]=' +  coContextService.getSelectedProjectId();

      $http.get(url, {withCredentials: true})
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(data, status) {
        deferred.reject(status);
      });

      return deferred.promise;
    };

    coHtml5NotificationService.getProject = function (projectId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/projects/'+ projectId;
        _sendUrl(url, callback);
      });
    };

    return coHtml5NotificationService;
  });
