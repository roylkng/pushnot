'use strict';

angular.module('pushNotificationsApp')
  .controller('createEditPushCtrl',function($scope, $rootScope, $state, coAppContext,
                                         pushNotificationsService, coContextService, $stateParams, $http, $timeout) {
    $scope.bytesleft = 218;
    $scope.pushNotificationId = $stateParams.pushNotificationId;
    $scope.user_id = coAppContext.runningAsUser.id;
    $scope.projectId = coAppContext.projects[0]._id;
    if (coAppContext.user.isActive != undefined) {
      $scope.isInactive = !coAppContext.user.isActive;
    }

    $scope.calulateBytes = function  () {
      $scope.bytesleft = 236-$scope.pushNotification.text.length;
    };

    $scope.addPayloadPair = function () {
      if ($scope.pushNotification.payload && $scope.pushNotification.payload.length > 0) {
        $scope.pushNotification.payload.push({"key" : " ", "value":" "});
      } else {
        $scope.pushNotification.payload = [{"key" : " ", "value":" "}];
      }
    };

    $scope.selectRule = function(id) {
      $scope.pushNotification.eventRuleIds.push([id]);
    };

    $scope.deselectRule = function(id) {
      var index = $scope.pushNotification.eventRuleIds.indexOf(id); 
      if (index !== -1) {
          $scope.pushNotification.eventRuleIds.splice(index, 1);
      }
    };

    $scope.updateType = function (index) {
      $scope.pushNotification.type = index;
    };

    $scope.removeField = function (index) {
      $scope.pushNotification.payload.splice(index,1);
    };

    $scope.deactivateNotification = function(notification) {
      pushNotificationsService.activateOrDeactivate(notification, false,
          $scope.onSuccessAction, $scope.onFailure);
    };

    $scope.activateNotification = function(notification) {
      pushNotificationsService.activateOrDeactivate(notification, true,
          $scope.onSuccessAction, $scope.onFailure);
    };

    $scope.onSuccessAction = function() {
      init();
    };

    $scope.onFailure = function(data, status, headers, config) {
    };

    $scope.deleteNotification = function(pushNotification) {
      // var deleteContext = {
      //   title: "When a notification is deleted, its analytics data is lost with it and cannot be recovered. Are you sure you want to delete ?",
      //   button_class: "btn-danger",
      //   button_text: "Delete",
      //   action: function() { 
          pushNotificationsService.deleteObject(pushNotification._id, $scope.onSuccessAction, $scope.onFailure);
      //      },
      // };
      // var modalInstance = $modal.open({
      //   templateUrl: 'push-notificationsApp/common/modal-action.html',
      //   controller: 'ModalInstanceCtrl',
      //   resolve : {
      //     data : function() { return deleteContext; }
      //   },
      // });
    };

    var _onSaveSuccess = function(callback) {
      pushNotificationsService.requestCacheUpdate(coAppContext);
      $timeout(function() {$state.go('pushNotificationsList')} , [300]);
    };

    var _onSaveFailure = function() {
      alert("There was a problem connecting to the server. Please check your internet connection and try again later.");
    };

    $scope.submitPushNotification = function(){
      pushNotificationsService.savePushNotification($scope.pushNotification, _onSaveSuccess, _onSaveFailure)
    };

    $scope.processPushNotification = function(notification){
      $scope.pushNotification = notification;
      $scope.calulateBytes();
    };

    function init() {
      // pushNotificationsService.getAllRulesForWebsite(coAppContext)
      // .then(function(rules) {
      //   $scope.rules = rules;
      // });
      if($scope.pushNotificationId){
        pushNotificationsService.getPushNotificationById($scope.pushNotificationId,$scope.processPushNotification);
      } else {
        pushNotificationsService.getNewPushNotification($scope.projectId, $scope.processPushNotification);
      }
    }

    init();
  });
