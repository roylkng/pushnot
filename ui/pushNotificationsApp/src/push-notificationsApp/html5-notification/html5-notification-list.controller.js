'use strict';

angular.module('pushNotificationsApp')
  .controller('html5NotificationListCtrl',function($scope, $modal, $timeout,
    coAppContext, coHtml5NotificationService, coContextService) {

    $scope.html5Notifications = [];

    var _onDeleteSuccess = function() {
      alert('Notification deleted successfully.');
      init();
    };

    var _onDeleteFailure = function() {
      alert('Error while deleting notification, please try again later.');
    };

    var _onSendSuccess = function() {
      alert('Notification send request sent successfully!');
    };

    var _onSendFailure = function() {
      alert('Error while pushing notification, please try again later.');
      init();
    };

    $scope.startSending = function(html5Notification) {
      $scope.payload.notification = html5Notification;
      $scope.payload.profileIds = "";
      $scope.payload.propertyId = coContextService.getActivePropertyId();
      $scope.payload.requestId = html5Notification._id;
      console.log($scope.payload);
      console.log("start sending");
      coHtml5NotificationService.sendChromeToAll($scope.appContext,
      $scope.payload, _onSendSuccess, _onSendFailure);
    };

    $scope.checkSendToSegmentOrAll = function(html5Notification){
      if (html5Notification.eventRuleIds && html5Notification.eventRuleIds.length >0) {
        coHtml5NotificationService.startSendingToSegment(coAppContext, html5Notification._id, html5Notification.eventRuleIds[0])
          .then(function() {
                  html5Notification.status = 3;
                  _onSendSuccess();
                },
                _onSendFailure);
      } else {
        coHtml5NotificationService.startSending(coAppContext, html5Notification._id)
          .then(function() {
                  html5Notification.status = 3;
                  _onSendSuccess();
                },
                _onSendFailure);
      }
    }

    $scope.testSend = function(html5Notification) {
      var context = {
        payload : $scope.payload,
        html5Notification: html5Notification,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-test-send-html5-push.html',
        controller: 'TestSendModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.sendToTag = function(html5Notification) {
      var context = {
        payload : $scope.payload,
        html5Notification: html5Notification,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-send-to-tags.html',
        controller: 'SendToTagsModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.deleteHtml5Notification = function(html5Notification) {
      var deleteContext = {
        title: 'Are you sure you want to delete? All data will be lost and ' +
          'deleting does not stop notifications being sent.',
        button_class: 'btn-danger',
        button_text: 'DELETE',
        action: function() {
          coHtml5NotificationService.deleteEventFunction(coAppContext, html5Notification._id)
          .then(_onDeleteSuccess, _onDeleteFailure);
        },
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-action.html',
        controller: 'ModalInstanceCtrl',
        resolve : {
          data : function() { return deleteContext; }
        },
      });

    };

    $scope.processAnalytics = function (analytics){
      $scope.analytics = analytics;
      $scope.askedPermission = 0;
      $scope.grantedPermission = 0;
      $scope.deniedPermission = 0;
      $scope.displayed = 0;
      $scope.clicks = 0;
      for (var i = 0; i < $scope.analytics.length; i++) {
        if ($scope.analytics[i]._id.actionType == 1) {
          $scope.askedPermission = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 2) {
          $scope.grantedPermission = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 3) {
          $scope.deniedPermission = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 6) {
          $scope.views = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 7 ||
                   $scope.analytics[i]._id.actionType == 8 ||
                   $scope.analytics[i]._id.actionType == 9) {
          $scope.clicks = $scope.analytics[i].count;
        }
        
      }
      // $scope.osPlotdata = {};
      // $scope.browserPlotdata = {};
      // var color = ['#1ab394', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854']
      // for (var key in $scope.analytics) {
      //   var o = 0;
      //   $scope.osPlotdata[key] = {};
      //   if($scope.analytics[key] && $scope.analytics[key].os ){
      //     for (var i = 0; i < $scope.analytics[key].os.length; i++) {
      //       var data = $scope.analytics[key].os[i];
      //       if (!$scope.osPlotdata[key][data.stats.name]) {
      //         $scope.osPlotdata[key][data.stats.name] = { label: data.stats.name, data: data.count, color: color[o]};
      //         o++;
      //       } else {
      //         $scope.osPlotdata[key][data.stats.name].data =  $scope.osPlotdata[key][data.stats.name].data +  data.count;
      //       }
      //     };
      //   }
      //   if($scope.analytics[key] && $scope.analytics[key].browser ){
      //     var b = 0;
      //     $scope.browserPlotdata[key] = {};
      //     for (var i = 0; i < $scope.analytics[key].browser.length; i++) {
      //       var data = $scope.analytics[key].browser[i];
      //       if (!$scope.browserPlotdata[key][data.stats.name]) {
      //         $scope.browserPlotdata[key][data.stats.name] = { label: data.stats.name, data:data.count ,color: color[b]};
      //         b++;
      //       } else {
      //         $scope.browserPlotdata[key][data.stats.name].data = $scope.browserPlotdata[key][data.stats.name].data + data.count;
      //       }
      //     };
      //   }
      // };
      // $scope.plotGraph( $scope.osPlotdata , $scope.browserPlotdata);
    };

    $scope.plotGraph = function (osData, browserData){
      $scope.osPieChartData = {1:[{}],2:[{}],6:[{}]};
      for(var key in osData){
        var tempData = osData[key];
        for (var tea in tempData) {
          $scope.osPieChartData[key].push(tempData[tea]);
        }
      };
      $scope.browserPieChartData = {1:[{}],2:[{}],6:[{}]};
      for(var key in browserData){
        var tempData = browserData[key];
        for (var tea in tempData) {
          $scope.browserPieChartData[key].push(tempData[tea]);
        }
      };
      $scope.pieOptions = {
          series: {
              pie: {
                  show: true
              }
          },
          grid: {
              hoverable: true
          },
          tooltip: true,
          tooltipOpts: {
              cssClass: "flotTip",
              content: "%x", // show percentages, rounding to 2 decimal places"%s | X: %x | Y: %y"
              shifts: {
                  x: 20,
                  y: 0
              },
              defaultTheme: true
          },
          legend : {
            show: true,
            labelFormatter: function(label, series) {
                    var percent= Math.round(series.percent);
                    var number= series.data[0][1]; //kinda weird, but this is what it takes
                    return('&nbsp;<b>'+label+'</b>:&nbsp;'+ percent + '%');
                }
          },
          grid: {
              hoverable: true,
              clickable: true
          }
      };
       // $scope.$apply();
    }

    $scope.processProjectInfo = function(project) {
      $scope.project = project;
      $scope.payload.projectId = project._id;
      $scope.payload.writeKey = project.writeKey;
      $scope.payload.gcmAPIKey = project.gcmAPIKey;
      $scope.payload.follower_emails = project.follower_emails;
    }

    $scope.dbUrl = coAppContext.dburl;
    $scope.projectId = coContextService.getSelectedProjectId();
    $scope.website = coContextService.getSelectedWebsite();
    $scope.user = coAppContext.user;
    $scope.analyticsSummary = {};
    function init() {
      console.log(coContextService.getActivePropertyId());
      $scope.payload = { requestId: "",
                    writeKey: "",
                    notification: {},
                    gcmAPIKey: "",
                    profileIds: [],
                    send_type: Number,
                    propertyId: coContextService.getActivePropertyId(),
                    projectId: '',
                    follower_emails: []
                  };


      coHtml5NotificationService.getHtml5Notifications(coAppContext)
      .then(function(response) {
        $scope.html5Notifications = response.data;
      });
      coHtml5NotificationService.getProject($scope.projectId, $scope.processProjectInfo);

      // coHtml5NotificationService.getAnalyticsSummary(coAppContext)
      // .then(function(response) {
      //   $scope.analyticsSummary = response.data;
      // });

      coHtml5NotificationService.getPermissionAnalytics(coAppContext)
      .then(function(response) {
        $scope.processAnalytics(response.data);
      });
    }


    init();
  });
