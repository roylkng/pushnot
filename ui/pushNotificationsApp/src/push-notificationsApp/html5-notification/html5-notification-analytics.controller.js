'use strict';

angular.module('pushNotificationsApp')
  .controller('html5NotificationAnalyticsCtrl',function($scope, $modal, $timeout,
    coAppContext, $stateParams, coHtml5NotificationService) {


    $scope.processAnalytics = function (analytics){
      $scope.analytics = analytics;
      $scope.osPlotdata = {};
      $scope.browserPlotdata = {};
      var color = ['#1ab394', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854']
      for (var key in $scope.analytics) {
        var o = 0;
        var b = 0;
        $scope.osPlotdata[key] = {};
        for (var i = 0; i < $scope.analytics[key].os.length; i++) {
          var data = $scope.analytics[key].os[i];
          if (!$scope.osPlotdata[key][data.stats.name]) {
            $scope.osPlotdata[key][data.stats.name] = { label: data.stats.name, data: data.count, color: color[o]};
            o++;
          } else {
            $scope.osPlotdata[key][data.stats.name].data =  $scope.osPlotdata[key][data.stats.name].data +  data.count;
          }
        };
        $scope.browserPlotdata[key] = {};
        for (var i = 0; i < $scope.analytics[key].browser.length; i++) {
          var data = $scope.analytics[key].browser[i];
          if (!$scope.browserPlotdata[key][data.stats.name]) {
            $scope.browserPlotdata[key][data.stats.name] = { label: data.stats.name, data:data.count ,color: color[b]};
            b++;
          } else {
            $scope.browserPlotdata[key][data.stats.name].data = $scope.browserPlotdata[key][data.stats.name].data + data.count;
          }
        };
      };
      $scope.plotGraph( $scope.osPlotdata , $scope.browserPlotdata);
    };

    $scope.plotGraph = function (osData, browserData){
      $scope.osPieChartData = {3:[{}],4:[{}],5:[{}]};
      for(var key in osData){
        var tempData = osData[key];
        for (var tea in tempData) {
          $scope.osPieChartData[key].push(tempData[tea]);
        }
      };
      $scope.browserPieChartData = {3:[{}],4:[{}],5:[{}]};
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

    function init() {
      $scope.notification_id = $stateParams.html5NotificationId;
      coHtml5NotificationService.getNotificationAnalytics(coAppContext, $scope.notification_id)
      .then(function(response) {
        $scope.processAnalytics(response.data);
      });
    };

    init();
  });
