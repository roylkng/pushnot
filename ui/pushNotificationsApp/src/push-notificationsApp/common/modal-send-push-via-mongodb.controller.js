'use strict';

angular.module('pushNotificationsApp')
.controller('SendPushViaMongodbModalCtrl', function ($scope, $modalInstance, data,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.appContext = data.coAppContext;
  $scope.payload = data.payload;
  $scope.profileIds = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.$apply();
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
    $scope.$apply();
  };

  $scope.sendPushViaMongo = function() {
    if (!$scope.auth.host || !$scope.auth.port || !$scope.auth.dbname || !$scope.auth.collection) {
      $scope.failureMessage = 'Please fill necessary fields';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.auth = $scope.auth;
    $scope.payload.requestId = $scope.pushNotification._id;
    $scope.successMessage = '';
    $scope.failureMessage = '';
    pushNotificationsService.sendPushViaMongo($scope.appContext, $scope.payload, _onSendTestSuccess,
      _onSendTestFailure);
  };

  $scope.cancel = function () {
    $scope.auth = { user: "",
                    pass: "",
                    host: "",
                    port: "",
                    dbname: "",
                    collection: ""
                  };
    $modalInstance.dismiss('cancel');
  };
});
