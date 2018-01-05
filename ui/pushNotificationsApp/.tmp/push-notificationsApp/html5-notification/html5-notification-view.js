(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html5-notification/html5-notification-view.html',
    '<div class="row"><div class="col-md-12"><h2>Not yet ready!!!</h2></div></div>');
}]);
})();
