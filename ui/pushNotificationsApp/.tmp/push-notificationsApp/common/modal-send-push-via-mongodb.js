(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-send-push-via-mongodb.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Send to user list - {{pushNotification.title}}</strong></h3><hr><div class="row"><div class="col-md-4 text-right"><small>User Name</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.user"></div></div><div class="row"><div class="col-md-4 text-right"><small>Password</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.pass"></div></div><div class="row"><div class="col-md-4 text-right"><small>Host</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.host"></div></div><div class="row"><div class="col-md-4 text-right"><small>Port</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.port"></div></div><div class="row"><div class="col-md-4 text-right"><small>DB Name</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.dbname"></div></div><div class="row"><div class="col-md-4 text-right"><small>Collection Name</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.collection"></div></div><div class="alert alert-success" ng-show="successMessage">{{successMessage}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendPushViaMongo()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();
