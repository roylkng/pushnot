'use strict';

angular.module('pushNotificationsApp')
.controller('ViewHtml5NotificationCtrl', function ($scope, $state,
  $stateParams, $modal, $timeout, coAppContext, coHtml5NotificationObj) {

  // TODO: Need to flesh out the controller as per details required on the
  // screen.

  $scope.html5Notification = {};

  function init() {
    $scope.html5Notification = coHtml5NotificationObj;
  }

  init();
});
