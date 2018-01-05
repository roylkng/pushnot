(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tags/tags.html',
    '<style>\n' +
    '\n' +
    '.project-list table tr td {\n' +
    '    border-top: none;\n' +
    '    border-bottom: 0;\n' +
    '    padding: 7px;\n' +
    '}\n' +
    '\n' +
    '.fa-info {\n' +
    '    margin-left: 4px ! important;\n' +
    '    margin-right: -7px;\n' +
    '    margin-top: 2px;\n' +
    '    border: 1px solid #D6D6D6;\n' +
    '    padding: 2px 4px 2px 4px;\n' +
    '    color: #D6D6D6;\n' +
    '    border-radius: 21px;\n' +
    '    font-size: 8px;\n' +
    '}\n' +
    '</style><a href="http://www.connecto.io/kb/?p=788" target="_blank">Visit for detailed information about Tags and how they work</a><div class="row"><div class="col-lg-12"><div class="wrapper animated fadeInUp"><div class="ibox"><div class="ibox-title" style="border:none;margin-top: 10px;padding-top:10px;margin-bottom: 10px;height:62px;"><div class="col-md-9"><h3 style="font-size:24px">{{(tags).length}}<ng-pluralize count="(tags).length" when="{\'0\' : \' Tags\', \'1\' : \' Tag\', \'other\': \' Tags\'}"></ng-pluralize></h3></div><div class="col-md-3 pull-right"><a ui-sref="createTag" style="margin-bottom:10px"><button class="btn btn-danger dim btn-small-dim" type="button" style="margin-right: 0;float: right;padding-right: 10px;"><i class="fa fa-plus"></i> Create New Tag</button></a></div></div><div class="ibox-content"><div class="row m-b-sm m-t-sm"><div class="col-md-offset-3 col-md-6"><div class="input-group" style="padding-right:10px;"><input type="text" placeholder="Search" class="input-sm form-control" ng-model="searchText"> <span class="input-group-btn"><button type="button" class="btn btn-sm btn-primary">Search</button></span></div></div></div><div class="project-list" ng-show="tags.length" style="padding: 0;"><table class="table"><tbody><tr ng-repeat="tag in tags | filter:searchText"><td><div class="row" style="padding-bottom: 5px;border: solid;border-color: #e8e8e8;border-width: 1px;border-bottom-width:0px; margin: 0px;border-radius: 5px;border-bottom-left-radius: 0px;border-bottom-right-radius: 0px;"><div class="col-md-3" style="padding-top: 5px;"><span style="font-size: large">{{tag.title}}</span><br><small>Expiry {{tag.expiry}} days</small></div><div class="col-md-4" style="padding-top: 15px"><span>Contains {{tag.tags.length}} <span ng-show="tag.tags.length===1">tag.</span> <span ng-hide="tag.tags.length===1">tags.</span></span></div><div class="col-md-3" style="padding-top: 15px;" ng-show="tag.domain"><span style="font-size: large">{{tag.domain}}</span></div><div class="col-md-3" ng-hide="tag.domain"></div><div class="col-md-1" style="padding-top: 8px"><div class="input-group-btn" dropdown="" style="width:100%; float:right;"><a ui-sref="editTag({tagId: tag._id})">Edit</a></div></div></div></td></tr></tbody></table></div></div></div></div></div></div>');
}]);
})();
