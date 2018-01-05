(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('push-api/api.html',
    '<div class="wrapper wrapper-content"><div class="row"><div class="col-sm-12"><div class="panel"><div class="panel-heading"><div class="panel-options"><ul class="nav nav-tabs"><li ng-repeat="tab in tabs" ng-class="{\'active\': activeTab==$index}"><a data-toggle="tab" ng-click="selectTab($index)">{{tab.title}}</a></li></ul></div></div><div class="panel-body"><div class="tab-content"><div ng-repeat="tab in tabs" id="tab-{{$index}}" class="tab-pane" ng-class="{\'active\': activeTab==$index}"><div ng-include="tab.template"></div></div></div></div></div></div></div></div>');
}]);
})();
