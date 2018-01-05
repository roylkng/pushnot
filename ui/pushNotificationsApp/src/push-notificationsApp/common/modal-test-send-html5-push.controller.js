'use strict';

angular.module('pushNotificationsApp')
.controller('TestSendModalCtrl', function ($scope, $modalInstance, data,
  coHtml5NotificationService) {

  $scope.html5Notification = data.html5Notification;
  $scope.appContext = data.coAppContext;
  $scope.userId = '';
  $scope.payload = data.payload;
  $scope.profileIds = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

  var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.profileIds = '';
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
  };

  var _processIds = function(ids) {
    var idList = ids.trim().split(',');
    for (var i = 0; i < idList.length; i++) {
      idList[i] = idList[i].trim();
    }
    return idList;
  }

  $scope.sendTest = function() {
    if (!$scope.profileIds) {
      $scope.failureMessage = 'user ids can\'t be blank';
      return;
    }
    console.log(data);
    $scope.payload.notification = $scope.html5Notification;
    $scope.payload.profileIds = _processIds($scope.profileIds);
    $scope.payload.requestId = $scope.html5Notification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    coHtml5NotificationService.sendChromeToUserList($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
