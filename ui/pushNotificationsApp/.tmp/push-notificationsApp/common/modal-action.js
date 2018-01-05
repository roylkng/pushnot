(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-action.html',
    '<div class="modal-body"><div class="ibox-content"><h4><strong>{{data.title}}</strong></h4></div></div><div class="modal-footer"><button type="button" class="btn btn-primary {{data.button_class_class_class_class_class_class_class_class}}" ng-click="data.action();cancel()">{{data.button_text}}</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();
