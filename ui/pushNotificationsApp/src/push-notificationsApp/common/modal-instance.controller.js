'use strict';

var ModalInstanceCtrl = function ($scope, $modalInstance, data) {
  $scope.data = data;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

angular.module('pushNotificationsApp')
  .controller('ModalInstanceCtrl', ModalInstanceCtrl);
