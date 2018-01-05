'use strict';

angular.module('pushNotificationsApp')
.controller('SendPushToUserListModalCtrl', function ($scope, $modalInstance, data,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.appContext = data.coAppContext;
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

  $scope.sendPush = function() {
    if (!$scope.profileIds) {
      $scope.failureMessage = 'user ids can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.profileIds = _processIds($scope.profileIds);
    $scope.payload.requestId = $scope.pushNotification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    pushNotificationsService.sendPushToUserList($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
