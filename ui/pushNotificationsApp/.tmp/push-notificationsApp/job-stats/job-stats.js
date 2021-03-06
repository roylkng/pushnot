(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('job-stats/job-stats.html',
    '<div class="row"><div class="col-lg-12"><div class="wrapper animated fadeInUp"><div class="ibox"><div class="ibox-title" style="border:none;margin-top: 10px;padding-top: 10px;margin-bottom: 10px;height:62px;"><div class="col-md-9"><h3 style="font-size:24px">{{jobs.length}}<ng-pluralize count="(jobs).length" when="{\'0\' : \' job\', \'1\' : \' job\', \'other\' : \' jobs\'}"></ng-pluralize></h3></div><div class="col-md-3 pull-right"><button class="btn btn-danger pull-right" type="button" ng-click="getRegistrationIdStats()"><i class="fa fa-plus"></i> Export Faulty Ids</button></div></div><div class="ibox-content"><div class="row m-b-sm m-t-sm"><div class="col-md-offset-3 col-md-6"><div class="input-group" style="padding-right:10px;"><input type="text" placeholder="Search" class="input-sm form-control" ng-model="searchText"> <span class="input-group-btn"><button type="button" class="btn btn-sm btn-primary">Search</button></span></div></div></div><div class="project-list"><table class="table table-hover"><tbody><tr><td class="project-title"><span>Job Type</span></td><td class="project-title"><span>Request Id</span></td><td class="project-title"><span>Job Status</span></td><td class="project-title"><span>Sent Status</span></td><td class="project-title"><span>Success Count</span></td><td class="project-title"><span>Failure Count</span></td></tr><tr ng-repeat="job in jobs | filter:searchText| orderBy: \'-_id\'"><td class="project-title"><span class="label label-primary">{{job.typeText}}</span></td><td class="project-title"><span>{{job._id.request_id}}</span></td><td class="project-title"><span>{{job.statusText}}</span></td><td class="project-title"><span>{{job.sendTypeText}}</span></td><td class="project-title"><span>{{job.success}}</span></td><td class="project-title"><span>{{job.failure}}</span></td></tr></tbody></table></div></div></div></div></div></div>');
}]);
})();
