'use strict';

angular.module('pushNotificationsApp')
.controller('ManageHtml5NotificationCtrl', function ($scope, $state,
  $timeout, coAppContext, coHtml5NotificationObj, coHtml5NotificationService) {

  $scope.html5Notification = {};

  var _onActionSuccess = function() {
    // coHtml5NotificationService.requestCacheUpdate(coAppContext);
    $timeout(function() { $state.go('html5NotificationList'); } , [300]);
  };

  var _onSaveFailure = function() {
    $scope.isSavingInProgress = false;
    alert('Error while saving notification, please try again later.');
  };

  $scope.saveHtml5Notification = function() {
    $scope.isSavingInProgress = true;

    if ($scope.mode === 'create') {
      coHtml5NotificationService.createHtml5Notification(coAppContext,
        $scope.html5Notification)
      .then(_onActionSuccess, _onSaveFailure);
    } else if ($scope.mode === 'edit') {
      coHtml5NotificationService.updateHtml5Notification(coAppContext,
        $scope.html5Notification)
      .then(_onActionSuccess, _onSaveFailure);
    }
  };

  function init() {
    $scope.isSavingInProgress = false;
    $scope.mode = $state.current.data.mode;

    $scope.html5Notification = coHtml5NotificationObj;
    $scope.toggleVar = true;
    $scope.html5Notification.targeting = {};
    $scope.html5Notification.targeting.devices = {};
    $scope.html5Notification.targeting.devices.mobile = true;
    $scope.html5Notification.targeting.devices.desktop = true;
    $scope.html5Notification.targeting.devices.tablet = true;
    coHtml5NotificationService.getAllRulesForWebsite(coAppContext)
      .then(function(rules) {
        $scope.rules = rules;
      });
  }

  init();
});
