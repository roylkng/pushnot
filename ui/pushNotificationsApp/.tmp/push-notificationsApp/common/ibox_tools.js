(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/ibox_tools.html',
    '<div class="ibox-tools dropdown"><a ng-click="showhide()"><i class="fa fa-chevron-up"></i></a></div>');
}]);
})();
