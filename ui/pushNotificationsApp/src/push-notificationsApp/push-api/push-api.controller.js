'use strict';

angular.module('pushNotificationsApp')
  .controller('pushApiCtrl',function($scope, $rootScope, $modal, $timeout, 
                                     $state, coAppContext, pushNotificationsService,
                                     settingsService, coContextService, $http) {

    $scope.user_id = coAppContext.runningAsUser.id;
    if (coAppContext.user.isActive != undefined) {
      $scope.isInactive = !coAppContext.user.isActive;
    }

    $scope.tabs = [
      {'title': "Push Notification", 'template': "push-notificationsApp/push-api/tabs/push.html"},
      {'title': "SMS", 'template': "push-notificationsApp/push-api/tabs/sms.html"},
    ];
    $scope.activeTab = 0;

    $scope.selectTab = function(i) {
      $scope.activeTab = i;
    }

    var _processIds = function(ids) {
      var idList = ids.trim().split(',');
      for (var i = 0; i < idList.length; i++) {
        idList[i] = idList[i].trim();
      }
      return idList;
    }

    $scope.processPushNotification = function() {
      $scope.jsonError = null;
      $scope.push_payload.notification = {"delayWhileIdle":false, "data":{}};
      try {
        $scope.push_payload.notification.data = JSON.parse($scope.data.data); 
      } catch (err) {
        $scope.jsonError = JSON.stringify(err);
      }
    }

    $scope.sendPushNotificationviaApi = function(){
      console.log("submitPushNotification");
      $scope.processPushNotification();
      if (!$scope.jsonError) {
        $scope.push_payload.registrationIds = _processIds($scope.data.ids);
        pushNotificationsService.sendPushNotificationviaApi(coAppContext,
                                                            $scope.push_payload,
                                                            _onSendPushSuccess,
                                                            _onSendPushFailure);
      }
    };

    var _onSendPushSuccess = function() {
      $scope.failureMessage = null;
      $scope.successMessage = 'Data List queued for sending';
      $scope.sentData = JSON.stringify($scope.push_payload);
      $scope.$apply();
    };

    var _onSendPushFailure = function() {
      $scope.successMessage = null;
      $scope.failureMessage = 'Error while retrieving data';
      $scope.$apply();
    };

    $scope.sendSmsViaApi = function() {
      console.log($scope.data.numbers);
      $scope.sms_payload.phoneNumbers = _processIds($scope.data.numbers);
      pushNotificationsService.sendSmsApi(coAppContext,
                                          $scope.sms_payload,
                                          _onSendSmsSuccess,
                                          _onSendSmsFailure);
    };

    var _onSendSmsSuccess = function(response) {
      $scope.failureMessage = null;
      $scope.successMessage = 'Success: ' + response;
      $scope.sentData = JSON.stringify($scope.sms_payload);
      $scope.$apply();
    };

    var _onSendSmsFailure = function() {
      $scope.successMessage = null;
      $scope.failureMessage = 'Error while retrieving data';
      $scope.$apply();
    };

    $scope.dbUrl = coAppContext.dburl;
    $scope.projectId = coContextService.getSelectedProjectId();
    $scope.project = coAppContext.projects[0];
    $scope.website = coContextService.getSelectedWebsite();
    $scope.user = coAppContext.user;

    function init() {
      $scope.data = {};
      $scope.data.data = "{}";
      $scope.push_payload = { requestId: "",
                              writeKey: "",
                              notification: "",
                              gcmAPIKey: "",
                              dbname: "",
                              registrationIds: []
                            };

      $scope.sms_payload = { requestId: "",
                             writeKey: "",
                             message: "",
                             apiCredentials: { type: 1 },
                             mask: "",
                             phoneNumbers: []
                           };

      if ($scope.project) {
        $scope.push_payload.writeKey = $scope.project.writeKey;
        $scope.sms_payload.writeKey = $scope.project.writeKey;
      }

      if($scope.project && $scope.project.gcmAPIKey){
        $scope.push_payload.gcmAPIKey = $scope.project.writeKey;
      }

      if($scope.project && ($scope.project.smsGateway.length >0)){
        $scope.sms_payload.apiCredentials.username = $scope.project.smsGateway[0].username;
        $scope.sms_payload.apiCredentials.password = $scope.project.smsGateway[0].password;
      }
    }

    init();
  });
