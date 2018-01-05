'use strict';

angular.module('pushNotificationsApp')
  .controller('settingsCtrl',function($scope, $rootScope, 
                                      $state, coAppContext, settingsService, 
                                      coContextService, $http) {
    $scope.user_id = coAppContext.runningAsUser.id;
    if (coAppContext.user.isActive != undefined) {
      $scope.isInactive = !coAppContext.user.isActive;
    }

    $scope.submitProject = function(){
      $scope.project.activePropertyId = $scope.activePropertyId;
      settingsService.saveProject($scope.project);
    };



    var _onSendSuccess = function() {
      alert('Notification send request sent successfully!');
    };

    var _onSendFailure = function() {
      alert('Error while pushing notification, please try again later.');
      // init();
    };

    $scope.dbUrl = coAppContext.dburl;
    $scope.projectId = coContextService.getSelectedProjectId();
    $scope.project = coAppContext.projects[0];
    $scope.website = coContextService.getSelectedWebsite();
    $scope.user = coAppContext.user;
    $scope.chromePushPackageUrl =
      settingsService.getChromePushPackageUrl(coAppContext);

    $scope.saveNewProperty = function() {
      if (!$scope.project.properties || $scope.project.properties===null) {
        $scope.project.properties = [];
      }
      $scope.project.properties.push({domainName: $scope.newDomain});
      $scope.submitProject();
      $scope.addNewProperty = false;
      $scope.newDomain = null;
    }

    function init() {
      $scope.activePropertyId = coContextService.getActivePropertyId();
      $scope.properties = coAppContext.projects[0].properties;

      if (!$scope.project.smsGateway) {
        $scope.project.smsGateway = [];
      }
      if ($scope.project.smsGateway.length == 0) {
        $scope.project.smsGateway.push({gatewayType:1});
      }
    }

    init();
  });
