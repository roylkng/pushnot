(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/profile-page-events.html',
    '<div class="row"><div class="wrapper wrapper-content"><div class="col-lg-12" id="real_events"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Latest Page Events of {{profileId}}</h5></div><div class="ibox-content inspinia-timeline"><div class="timeline-item" ng-repeat="event in events"><div class="row"><div class="col-xs-4 date" style="width:33%;"><i style="width:70px;"><span class="label label-warning">{{event.eventType | uppercase}}</span></i><br>At {{event.timestamp}}<br><small class="text-navy">{{event.timeago}} ago</small></div><div class="col-xs-8 content"><div class="media-body fadeInUpBig" ng-class="{\'animated\' : $first}"><strong class="text-info" ui-sref="event_profiles({eventText: event.text})">{{event.text}}</strong> by user <strong><span ui-sref="profile_page_events({profileId: event.profileId})" style="cursor:pointer; text-decoration:underline;">{{event.profileId}}</span></strong>.<br>on <strong>{{event.channel}}</strong> from <strong>{{event.osName}}</strong><br>Number of Page Views: <strong>{{event.urls.length}}</strong><br>Domains of Page Views: <span ng-repeat="domain in event.domains"><strong>&nbsp;&nbsp;{{domain}}&nbsp;&nbsp;</strong></span><br><strong>Page views sequence:</strong><p ng-repeat="url in event.urlSequences">{{url.url}},&nbsp;&nbsp; <span ng-show="$index===0">started at {{url.timestamp}}</span> <span ng-hide="$index===0">visited after {{url.timestamp}} seconds</span></p><div ng-repeat="attribute in event.attributes"><a class="btn btn-xs btn-white">&nbsp;{{attribute.key}}&nbsp;:&nbsp;{{attribute.value}}&nbsp;</a></div></div></div></div></div></div></div></div></div></div>');
}]);
})();
