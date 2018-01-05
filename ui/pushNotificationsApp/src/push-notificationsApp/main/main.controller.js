'use strict';

angular.module('pushNotificationsApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state, $stateParams,
                                    coAppContext, coContextService) {
    $scope.selectedWebsite = coContextService.getSelectedWebsite();
    $scope.appContext      = coAppContext;
    $scope.dateRange = coContextService.getSelectedDateRange();
    $scope.ranges = {
              'Today': [moment(), moment()],
              'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
              'Last 7 days': [moment().subtract('days', 7), moment()],
              'Last 30 days': [moment().subtract('days', 30), moment()],
              'Last 90 days': [moment().subtract('days', 90), moment()],
              'This month': [moment().startOf('month'), moment().endOf('day')]
    };

    if(coAppContext.user.isStaff){
      $scope.isAdminUser = coAppContext.user.isStaff;
    } else $scope.isAdminUser = false;

    $scope.applicationName = 'pushNotificationsApp';
    $scope.createStateUrl = 'create-push';
    // $('#side-menu').metisMenu();

    var _reloadCurrentState = function() {
      $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: true,
          notify: true
      });
    };

    $scope.changeSelectedWebsite = function(website) {
      if (website !==  $scope.selectedWebsite) {
        $scope.selectedWebsite = website;
        coContextService.setSelectedWebsite(website);
        _reloadCurrentState();
      }
    };
    //fix this date range reload staTE bug
    $scope.changeDateRange = function(dateRange) {
      if (dateRange !== $scope.dateRange) {
        coContextService.setSelectedDateRange(dateRange);
        _reloadCurrentState();
      }
    };

    $scope.opts = {
      eventHandlers: {'apply.daterangepicker': function (ev, picker) {
          /*for (var k in ev) {
            console.log(k+'--->'+ev[k]);
          }
          for (var we in picker) {
            console.log(we+'--->'+picker[we]);
          }*/
          $scope.changeDateRange($scope.dateRange);
        }        
      }
    };
  });
