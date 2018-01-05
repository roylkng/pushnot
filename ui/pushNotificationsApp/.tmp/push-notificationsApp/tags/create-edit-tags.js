(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tags/create-edit-tags.html',
    '<style type="text/css">\n' +
    '  .onoffswitch-inner:before, .onoffswitch-inner:after {\n' +
    '    height: 25px;\n' +
    '    line-height: 25px;\n' +
    '    font-size: 15px;\n' +
    '  }\n' +
    '  .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {\n' +
    '    margin-left: -12px;\n' +
    '  }\n' +
    '  .timeline-item .date {\n' +
    '    width: 150px;\n' +
    '  }\n' +
    '</style><div class="row"><div class="col-lg-12"><div class="alert alert-warning" ng-show="propertyNotSelectedFlag"><strong>Attention!</strong> Please specify a property for the tag.</div><div class="wrapper animated fadeInUp"><div class="ibox float-e-margins"><div class="ibox-title"><h2><span ng-hide="tagId">Create New</span><span ng-show="tagId">Edit</span> Tag<div class="ibox-tools"></div></h2></div><div class="ibox-content"><div class="row" ng-show="tagId"><button class="btn btn-danger dim btn-small-dim pull-right" type="button" ng-click="deleteTag(tagId)"><i class="fa fa-trash"></i> DELETE TAG</button></div><form method="get" class="form-horizontal"><div class="row"><div class="form-group"><label class="col-sm-2 control-label">Tag Title</label><div class="col-sm-1"></div><div class="col-sm-8"><input ng-model="tag.title" type="text" class="form-control"></div></div></div><div class="row"><div class="form-group"><label class="col-sm-2 control-label">Tag Expiry (in days)</label><div class="col-sm-1"></div><div class="col-sm-8"><input ng-model="tag.expiry" type="text" class="form-control"></div></div></div><div class="row"><div class="form-group"><label class="col-sm-2 control-label">Property</label><div class="col-sm-1"></div><div class="col-sm-8"><select class="form-control" ng-model="tag.propertyId"><option value="" disabled="disabled">Select...</option><option ng-repeat="key in properties" value="{{key._id}}" ng-selected="tag.propertyId==key._id">{{key.domain}}</option></select></div></div></div><div class="hr-line-dashed col-sm-11" style="color:#F7F7F7;"></div><div class="row"><div class="form-group"><label class="col-sm-3 control-label">Tags (comma seperated values)</label><div class="col-sm-8"><div><textarea rows="3" class="form-control" ng-model="tag.tags">\n' +
    '                  </textarea></div></div></div></div><div class="hr-line-dashed col-sm-11" style="color:#F7F7F7;"></div><div class="row"><div class="form-group col-sm-5"><label class="col-sm-4 control-label">Tag Type</label><div class="col-sm-8"><select class="form-control" ng-model="tag.match.element"><option value="" disabled="disabled">Select...</option><option ng-repeat="key in tagElements" value="{{key.value}}" ng-selected="tag.match.element==key.value">{{key.name}}</option></select></div></div><div class="form-group col-sm-5"><label class="col-sm-4 control-label">Match Types</label><div class="col-sm-8"><select class="form-control" ng-model="tag.match.operator"><option value="" disabled="disabled">Select...</option><option ng-repeat="key in tagMatchTypes" value="{{key.value}}" ng-selected="tag.match.operator==key.value">{{key.name}}</option></select></div></div></div><div class="hr-line-dashed col-sm-11" style="color:#FFFFFF;"></div><div class="row"><div class="form-group col-sm-7"><label class="col-sm-4 control-label">Tag Match Text/ REGEX(pattern)</label><div class="col-sm-8"><textarea rows="3" class="form-control" ng-model="tag.match.matchText">\n' +
    '                </textarea></div></div><div class="form-group col-sm-5" ng-show="tag.match.operator == 3"><label class="col-sm-6 control-label">REGEX(modifiers)</label><div class="col-sm-6"><input ng-model="tag.match.regexProperties" type="text" class="form-control"></div></div></div><div class="hr-line-dashed"></div><div class="row"><div class="col-sm-1"></div><button type="submit" class="btn btn-primary" ng-click="submitCreateTagRequest()">{{submitButtonText}}</button> <a ui-sref="tags" style="margin-bottom:10px"><button class="btn btn-danger" type="button">Cancel</button></a></div></form></div></div></div></div></div>');
}]);
})();
