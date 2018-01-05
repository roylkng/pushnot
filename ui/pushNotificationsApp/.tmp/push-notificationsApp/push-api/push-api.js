(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('push-api/push-api.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Send Push Notification</strong></h3><hr><div class="row"><div class="col-md-4 text-right">Request Identifier<br><small class="text-muted">Any identifier to name the job</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="payload.requestId"></div></div><br><div class="row"><div class="col-md-4 text-right">GCM Api Key<br><small class="text-muted">Refer to <a href="http://www.connecto.io/kb/knwbase/getting-gcm-sender-id-and-gcm-api-key/">this</a> page to find GCM API Key</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="payload.gcmAPIKey"></div></div><br><div class="row"><div class="col-md-4 text-right">Notification Data<br><small class="text-muted">Leave blank if no fields are needed</small></div><div class="col-md-8"><div class="alert alert-success" ng-show="jsonError">{{jsonError}}</div><textarea rows="4" class="form-control" ng-model="data">\n' +
    '      </textarea></div></div><br><div class="row"><div class="col-md-4 text-right">Registration Ids<br><small class="text-muted">Comma separated GCM registration IDs</small></div><div class="col-md-8"><textarea rows="4" class="form-control" ng-model="ids">\n' +
    '      </textarea></div></div><br><div class="alert alert-success" ng-show="successMessage">{{successMessage}}<br>Sent Data:<br>{{sentData}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendPushNotificationviaApi()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();
