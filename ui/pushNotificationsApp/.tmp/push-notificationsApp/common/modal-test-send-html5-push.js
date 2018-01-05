(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-test-send-html5-push.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Test Sending {{html5Notification.title}}</strong></h3><hr><div class="row"><h4>Choose user to test send the notification to:</h4></div><div class="row"><div class="col-md-4 text-right"><strong>User Profile Id:</strong></div><div class="col-md-8"><input type="text" class="form-control" ng-model="profileIds"></div></div><div class="alert alert-success" ng-show="successMessage">{{successMessage}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendTest()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();
