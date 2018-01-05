(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html5-notification/html5-notification-manage.html',
    '<style>\n' +
    'span {\n' +
    '  cursor: pointer;\n' +
    '}\n' +
    '\n' +
    '.selected-class-name {\n' +
    '  color: #000000;\n' +
    '  cursor: pointer;\n' +
    '  border: 2px solid #19aa8d;\n' +
    '  border-right: 8px solid #19aa8d !important;\n' +
    '}\n' +
    '\n' +
    'div.chat-activity-list:hover {\n' +
    '  border-right: 8px solid #19aa8d !important;\n' +
    '  color: #000000;\n' +
    '  cursor: pointer;\n' +
    '}\n' +
    '</style><div id="create-edit-container-pane" ng-class=""><div ui-view=""><div class="large-left-pane"><div class="left-pane"><div class="left-pane-content"><div class="left-pane-container" slimscroll="{height: \'auto\', alwaysVisible: true}" slimscroll-listen-to="windowResize"><form class="form-horizontal ng-pristine ng-valid" style="width:100%"><section class="well"><section><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Name of Notification (For reference only)</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.name" validation-field-required="true"></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label">Select Type<a ng-click="openGuide(\'\')"><i class="fa fa-question fa-border"></i></a></label><div class="col-xs-7"><select class="form-control" ng-model="html5Notification.type" name="type" id="push type"><option value="" disabled="disabled">Select...</option><option value="1" ng-click="updateType(1)">Plain Text</option><option value="3" ng-click="updateType(3)">Text with One Action Button</option><option value="4" ng-click="updateType(4)">Text with Two Action Button</option></select></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Title</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.title" validation-field-required="true"></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Message Body</label><div class="col-xs-7"><textarea type="text" rows="3" class="form-control" ng-model="html5Notification.message" validation-field-required="true"></textarea></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Target Url</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.targetUrl" validation-field-required="true"></div></div></div></div></div><div class="row" ng-if="html5Notification.type == 3 || html5Notification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Text For 1st CTA</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.actionButtonText1" validation-field-required="true"></div></div></div></div></div><div class="row" ng-if="html5Notification.type == 3 || html5Notification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Target Url For 1st CTA</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.targetUrl1" validation-field-required="true"></div></div></div></div></div><div class="row" ng-if="html5Notification.type == 3 || html5Notification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Image Url For 1st CTA</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.imageUrl1" validation-field-required="true"></div></div></div></div></div><div class="row" ng-if="html5Notification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Text For 2nd CTA</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.actionButtonText2" validation-field-required="true"></div></div></div></div></div><div class="row" ng-if="html5Notification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Target Url For 2nd CTA</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.targetUrl2" validation-field-required="true"></div></div></div></div></div><div class="row" ng-if="html5Notification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Image Url For 2nd CTA</label><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.imageUrl2" validation-field-required="true"></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><div class="col-xs-5 text-right"><label class="control-label" style="font-size:15px;">Icon Url</label> <small>For Chrome only, ideal size: 80x80</small></div><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.icon" validation-field-required="true"></div></div></div></div></div></section></section><section class="well" ng-show="false"><div class="well-label clickable" ng-click="showTargetingOptions = !showTargetingOptions" ng-class="{\'highlight\' : !showTargetingOptions}"><i class="fa fa-caret-down" ng-hide="showTargetingOptions"></i> <i class="fa fa-caret-right" ng-show="showTargetingOptions"></i> TARGETING OPTIONS</div><section ng-hide="showTargetingOptions"><section class="well"><div class="well-label clickable" ng-click="showUserTargeting = !showUserTargeting" ng-class="{\'highlight\' : showUserTargeting}"><i class="fa fa-caret-down" ng-show="!showUserTargeting"></i> <i class="fa fa-caret-right" ng-hide="!showUserTargeting"></i> USER TARGETING</div><section ng-hide="false"><div class="row"><div class="col-xs-12"><div class="form-group"><div class="col-xs-offset-1 col-xs-10"><label class="control-label" style="text-align:left;font-size:16px;font-weight: normal !important;"><input type="radio" name="segment" ng-click="toggleVar=true" ng-checked="toggleVar === true"> <span>All subscribed users</span></label><br><label class="control-label" style="text-align:left;font-size:16px;font-weight: normal !important;"><input type="radio" name="segment" ng-click="toggleVar = false" ng-checked="toggleVar === false"> <span>To Segment</span></label><div ng-hide="toggleVar"><div class="ibox-title" style="border:none"><h5 style="font-weight: normal !important;font-size:12px;">Choose a Segment of users satisfying Rule.</h5></div><div class="ibox-content" style="border:none"><select class="form-control" name="eventRule" ng-model="html5Notification.eventRuleIds[0]" placeholder="Select..."><option value="" disabled="disabled">Select...</option><option ng-repeat="rule in rules" value="{{rule._id}}" ng-selected="rule._id==html5Notification.eventRuleIds[0]">{{rule.title}}</option></select></div></div></div></div></div></div></section></section><section class="well" ng-show="false"><div class="well-label clickable" ng-click="showDeviceTargeting = !showDeviceTargeting" ng-class="{\'highlight\' : !showDeviceTargeting}"><i class="fa fa-caret-down" ng-show="showDeviceTargeting"></i> <i class="fa fa-caret-right" ng-hide="showDeviceTargeting"></i> DEVICE TARGETING</div><section ng-show="showDeviceTargeting"><div class="row"><div class="col-xs-12"><div class="form-group"><div class="col-xs-offset-1 col-xs-10"><div class="ibox-title" style="border:none;padding-top:0;padding-right:0;padding-bottom:0;min-height:20px"><h5>Choose Devices</h5></div><div class="ibox-content" style="border:none;padding-top:5px;padding-bottom:10px"><label class="checkbox-inline" for="mobileCheckbox"><input icheck="" class="icheck-checkbox" id="mobileCheckbox" type="checkbox" ng-model="html5Notification.targeting.devices.mobile" ng-disabled="!html5Notification.targeting.devices.desktop && !html5Notification.targeting.devices.tablet"> Mobiles</label> <label class="checkbox-inline" for="desktopCheckbox"><input icheck="" class="icheck-checkbox" id="desktopCheckbox" type="checkbox" ng-model="html5Notification.targeting.devices.desktop" ng-disabled="!html5Notification.targeting.devices.mobile && !html5Notification.targeting.devices.tablet"> Desktops</label> <label class="checkbox-inline" for="tabletCheckbox"><input icheck="" class="icheck-checkbox" id="tabletCheckbox" type="checkbox" ng-model="html5Notification.targeting.devices.tablet" ng-disabled="!html5Notification.targeting.devices.mobile && !html5Notification.targeting.devices.desktop"> Tablets</label></div></div></div></div></div></section></section></section></section><section class="well" id="advancedWell"><div class="well-label clickable" ng-click="hideAdvancedWell = !hideAdvancedWell" ng-class="{\'highlight\' : !hideAdvancedWell}"><i class="fa fa-caret-down" ng-show="hideAdvancedWell"></i> <i class="fa fa-caret-right" ng-hide="hideAdvancedWell"></i> ADVANCED</div><section class="well" ng-show="hideAdvancedWell"><div class="row"><div class="col-xs-12"><div class="form-group"><label class="col-xs-4 control-label">Require Interaction</label><div class="col-xs-8"><div class="col-xs-2"><div class="col-xs-4"><label class="radio"><input type="radio" name="radio-inline" value="true" ng-model="html5Notification.require_interaction"> <i></i>Yes</label></div><div class="col-xs-4"><label class="radio"><input type="radio" name="radio-inline" ng-checked="!html5Notification.require_interaction"> <i></i>No</label></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div class="col-xs-5"><label class="control-label text-right">Collapse Key</label> <small>Replace previous notification if unseen.</small></div><div class="col-xs-7"><input type="text" class="form-control" ng-model="html5Notification.collapse_key" validation-field-required="true"></div></div></div></div></div></section></section></form></div></div><div class="left-pane-footer" id="create-edit-footer"><nav class="navbar" role="navigation" style="margin-bottom: 0"><section ng-hide="isSavingInProgress"><button class="back-button navbar-header pull-left"><i class="fa fa-chevron-left fa-4"></i></button> <button class="next-button navbar-header pull-right save-button" ng-click="saveHtml5Notification()">SAVE <i class="fa fa-arrow-right fa-4"></i></button></section><section ng-show="isSavingInProgress"><button class="next-button navbar-header" style="width:100%;text-align:center;">Saving ... <i class="fa fa-spinner fa-spin fa-4"></i></button></section></nav></div></div><div class="right-pane" style="overflow:auto"><div id="preview-iframe-container" style="width:375px"><div class="wrapper wrapper-content"><div class="row"><div class="col-xs-12"><div class="ibox float-e-margins"><div class="ibox-content" style="background-size: 100%; padding:0px;"><div class="android_chrome_wrapper" style="padding: 5px 30px 15px 90px; position: relative; display: block; font-weight: 400; min-height:80px"><div style="position: absolute; left: 0; top: 0; content: \'\'; background: #eeeeee; height: 80px; width: 80px;"><img src="{{html5Notification.icon}}" style="max-width: 80px; max-height: 80px"></div><div class="app_name" style="font-size: 18px; color:black; font-weight: 400; display: inline-block;">{{html5Notification.title}}</div><br><div class="app_name" style="font-size: 14px; font-weight: 400; color:black; display: inline-block;">{{html5Notification.message}}</div></div><hr style="margin: 0px;" ng-if="html5Notification.type == 3 || html5Notification.type == 4"><div class="android_chrome_wrapper" ng-if="html5Notification.type == 3 || html5Notification.type == 4" style="padding: 5px 30px 5px 15px; position: relative; display: block; font-weight: 400; min-height:30px"><div style="position: absolute; left: 5; top: 5; content: \'\'; background: #eeeeee; height: 15px; width: 15px;"><img src="{{html5Notification.imageUrl1}}" style="max-width: 15px; max-height: 15px"></div><div class="app_name" style="font-size: 14px; overflow: hidden; padding-left: 50px; font-weight: 400; color:black; display: inline-block;">{{html5Notification.actionButtonText1}}</div></div><hr style="margin: 0px;" ng-if="html5Notification.type == 4"><div class="android_chrome_wrapper" ng-if="html5Notification.type == 4" style="padding: 5px 30px 5px 15px; position: relative; display: block; font-weight: 400; min-height:30px"><div style="position: absolute; left: 5; top: 5; content: \'\'; background: #eeeeee; height: 15px; width: 15px;"><img src="{{html5Notification.imageUrl2}}" style="max-width: 15px; max-height: 15px"></div><div class="app_name" style="font-size: 14px; overflow: hidden; padding-left: 50px; font-weight: 400; color:black; display: inline-block;">{{html5Notification.actionButtonText2}}</div></div></div></div></div></div></div></div></div></div></div></div>');
}]);
})();
