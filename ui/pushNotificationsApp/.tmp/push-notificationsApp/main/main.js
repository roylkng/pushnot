(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('main/main.html',
    '<div id="wrapper"><div ng-include="\'push-notificationsApp/left-nav/left-nav.html\'"></div><div id="page-wrapper" class="gray-bg"><div ng-include="\'push-notificationsApp/common/navbar/navbar.html\'"></div><div ng-include="\'push-notificationsApp/common/breadcrumbs.html\'"></div><div ui-view="" class="page-heading"></div></div><div id="common-create-button"><button class="btn btn-danger btn-lg btn-circle" type="button" ui-sref="{{createStateUrl}}" ng-show="$root.showCreateButton && createStateUrl"><i class="fa fa-plus"></i></button></div></div>');
}]);
})();
