'use strict';

angular.module('pushNotificationsApp')
  .factory('pushNotificationsService', function ($http, $q, coContextService) {
    var pushNotificationsService = {};

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

    var _postUrl = function(url, data, onSuccess, onFailure) {
      $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: onSuccess,
        error: onFailure,
      });
    };

    var _httpPromiseBuilder = function(method, url, cacheResults, dataObj) {
      var data = JSON.stringify(angular.fromJson(angular.toJson(dataObj)));

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

    pushNotificationsService.getNewPushNotification = function( project_Id,callback) {
      var PushNotification = {
        projectId : project_Id,
        isActive: true,
        status: 1,
        title: '',
        text:'',
        type:'1',
        toXMPP: '',
        notificationKey: '',
        payload: {},
        delayWhileIdle: false,
        ttl: Number,
        deliveryReceiptRequested: false,
        restrictedPackageName: '',
        dryRun: false,
        messageId: Number,
      }
      callback(PushNotification);
    };

    pushNotificationsService.getPushNotification = function (projectId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/pushnotifications?conditions[projectId]='+ projectId;
        _sendUrl(url, callback);
      });
    };

    pushNotificationsService.getPushNotificationById = function (notId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/pushnotifications/'+ notId;
        _sendUrl(url, callback);
      });
    };

    pushNotificationsService.savePushNotification = function(obj, success , failure) {
      coContextService.getContext().then(function(context) {
         var method = (obj._id) ? 'PUT' : 'POST';
        var dbUrl = context.dburl;
        var data = JSON.stringify(angular.fromJson(angular.toJson(obj)));
        var url = 'http://' + dbUrl + 'api/v1/pushnotifications/';
        if (obj._id) {
          url += obj._id;
        }
        $.ajax({
        url: url,
        type: method,
        contentType: "application/json",
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function( response_data ) {
          success(response_data);
        },
        error: function(data, status) {
          failure(status);
        }
        });
      });
    };

    pushNotificationsService.activateOrDeactivate = function (notificationObj, activate, successCallback, errorCallback) {
      coContextService.getContext().then(function(context) {
        var url = 'http://' + context.dburl + 'api/v1/pushnotifications/' + notificationObj._id;
        $.ajax({
          url: url,
          type: "PUT",
          dataType: "json",
          data: {'isActive': activate, 'website': notificationObj.website},
          xhrFields: {
            withCredentials: true
          },
          success: successCallback,
          error: errorCallback,
        });
      });
    };

    pushNotificationsService.requestCacheUpdate = function(coAppContext) {
      var projectId = coContextService.getSelectedProjectId();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'cacheUpdate?type=pushNotifications&projectId=' + projectId;
      _sendUrl(url);
    };

    pushNotificationsService.deleteObject = function(notificationId, successCallback, errorCallback) {
      coContextService.getContext().then(function(context) {
        var url = 'http://' + context.dburl + 'api/v1/pushnotifications/' + notificationId;
        $.ajax({
          url: url,
          type: 'DELETE',
          xhrFields: {
            withCredentials: true
          },
          success: successCallback,
          error: errorCallback,
        });
      });
    };

    pushNotificationsService.sendPushToUserList = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/android-push-notification-ui?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    pushNotificationsService.sendPushViaMongo = function(coAppContext,
                                                         payload,
                                                         onSuccess,
                                                         onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/android-push-notification-via-mongodb?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      // _httpPromiseBuilder('POST', url, false, payload)
      // .then(onSuccess, onFailure);
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

   pushNotificationsService.sendToTags = function(coAppContext,
                                                  payload,
                                                  onSuccess,
                                                  onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/android-push-notification-tag?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    pushNotificationsService.sendPushNotificationviaApi = function(coAppContext,
                                                                   payload,
                                                                   onSuccess,
                                                                   onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl + 'send/android-push-notification';
      var data = JSON.stringify(angular.fromJson(angular.toJson(payload)));
      _postUrl(url, data, onSuccess, onFailure);
    };

    pushNotificationsService.sendSmsApi = function(coAppContext,
                                                   payload,
                                                   onSuccess,
                                                   onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl + 'send/sms';
      var data = JSON.stringify(angular.fromJson(angular.toJson(payload)));
      _postUrl(url, data, onSuccess, onFailure);
    };

    pushNotificationsService.getAnalyticsSummary = function(coAppContext) {
      var jobHostUrl = coAppContext.jobHostUrl;
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      // var dateRange = coContextService.getSelectedDateRange();

      // var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      // var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + jobHostUrl + 'get-android-push-notification-count' + 
        '?conditions[writeKey]=' + writeKey;
        // '&conditions[startHour]=' + startHour +
        // '&conditions[endHour]=' + endHour;

      return _httpPromiseBuilder('GET', url, false);
    };

    pushNotificationsService.getProject = function (projectId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/projects/'+ projectId;
        _sendUrl(url, callback);
      });
    };

    return pushNotificationsService;
  });
