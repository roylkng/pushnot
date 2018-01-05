(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/breadcrumbs.html',
    '<div class="row white-bg" id="breadcrumb-row" ng-show="$root.showBreadcrumbsRow"><div class="col-xs-6"><ol class="breadcrumb"><li ng-repeat="breadcrumb in $root.breadcrumbs" ng-class="{active: $last}"><a ui-sref="{{breadcrumb.state}}" ng-if="breadcrumb.state">{{breadcrumb.text}}</a> <span ng-if="!breadcrumb.state">{{breadcrumb.text}}</span></li></ol></div><div class="col-xs-6"><div class="pull-right text-success" id="top-bar-daterange-picker" opens="right"><i class="fa fa-calendar"></i> <input type="daterange" ng-model="dateRange" ng-change="changeDateRange(dateRange)" ranges="ranges"> <span class="caret"></span></div></div></div>');
}]);
})();
