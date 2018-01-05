(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-send-push-to-userlist.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Send to user list - {{pushNotification.title}}</strong></h3><hr><div class="row"><h4>Comma separated list of users to send push to:</h4></div><div class="row"><div class="col-md-4 text-right"><small>Any whitespace is ignored (userIds can\'t have whitespace)</small></div><div class="col-md-8"><textarea class="form-control" ng-model="profileIds">\n' +
    '      </textarea></div></div><div class="alert alert-success" ng-show="successMessage">{{successMessage}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendPush()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();
