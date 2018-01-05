'use strict';

angular.module('pushNotificationsApp')
.controller('SendToTagsModalCtrl', function ($scope, $modalInstance, data,
  coHtml5NotificationService,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.html5Notification = data.html5Notification;
  $scope.appContext = data.coAppContext;
  $scope.payload = data.payload;
  $scope.tags = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

  var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.tags = '';
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
  };

  var _processTags = function(ids) {
    var idList = ids.trim().split(',');
    for (var i = 0; i < idList.length; i++) {
      idList[i] = idList[i].trim();
    }
    return idList;
  }

  $scope.sendHtml5 = function() {
    if (!$scope.tags) {
      $scope.failureMessage = 'tags can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.html5Notification;
    $scope.payload.tags = _processTags($scope.tags);
    $scope.payload.requestId = $scope.html5Notification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    coHtml5NotificationService.sendChromeToTags($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.sendPush = function() {
    if (!$scope.tags) {
      $scope.failureMessage = 'tags can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.tags = _processTags($scope.tags);
    $scope.payload.requestId = $scope.pushNotification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    pushNotificationsService.sendToTags($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
