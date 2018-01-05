'use strict';

angular.module('pushNotificationsApp')
.controller('TestSendModalCtrl', function ($scope, $modalInstance, data,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.appContext = data.coAppContext;
  $scope.payload = data.payload;
  $scope.userId = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

  var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.userId = '';
    $scope.$apply();
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
    $scope.$apply();
  };

  var _processIds = function(ids) {
    var idList = ids.trim().split(',');
    for (var i = 0; i < idList.length; i++) {
      idList[i] = idList[i].trim();
    }
    return idList;
  }

  $scope.sendTest = function() {
    if (!$scope.userId) {
      $scope.failureMessage = 'userId can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.profileIds = _processIds($scope.userId);
    $scope.payload.requestId = $scope.pushNotification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    pushNotificationsService.sendPushToUserList($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
