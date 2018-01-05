(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('create-edit-push/create-edit-push.html',
    '<style>\n' +
    '  span {\n' +
    '    cursor: pointer;\n' +
    '  }\n' +
    '\n' +
    '  .selected-class-name {\n' +
    '    color: #000000;\n' +
    '    cursor: pointer;\n' +
    '    border: 2px solid #19aa8d;\n' +
    '    border-right: 8px solid #19aa8d !important;\n' +
    '  }\n' +
    '\n' +
    '  div.chat-activity-list:hover {\n' +
    '    border-right: 8px solid #19aa8d !important;\n' +
    '    color: #000000;\n' +
    '    cursor: pointer;\n' +
    '  }\n' +
    '  #case {\n' +
    '    height: 650px;\n' +
    '    width: 350px;\n' +
    '    border-radius: 40px 40px;\n' +
    '    border: 1px solid #000;\n' +
    '    margin: auto;\n' +
    '    background:white;\n' +
    '  }\n' +
    '  #earsection {\n' +
    '    margin-top: 36px;\n' +
    '    margin-left: 72px;\n' +
    '    height: 16px;\n' +
    '  }\n' +
    '  #camera {\n' +
    '    float: left;\n' +
    '    width: 16px;\n' +
    '    height: 16px;\n' +
    '    border: 1px solid #000;\n' +
    '    border-radius: 9px 9px;\n' +
    '  }\n' +
    '  #speaker {\n' +
    '    float: left;\n' +
    '    width: 54px;\n' +
    '    height: 5px;\n' +
    '    margin-left: 45px;\n' +
    '    border: 1px solid #000;\n' +
    '    border-radius: 7px 7px;\n' +
    '  }\n' +
    '  #screen {\n' +
    '    clear: both;\n' +
    '    width: 316px;\n' +
    '    height: 484px;\n' +
    '    margin: auto;\n' +
    '    margin-top: 35px;\n' +
    '    border: 2px solid #525358;\n' +
    '  }\n' +
    '  #button {\n' +
    '    height: 56px;\n' +
    '    width: 56px;\n' +
    '    border: 1px solid #000;\n' +
    '    border-radius: 28px 28px;\n' +
    '    margin: auto;\n' +
    '    margin-top: -68px;\n' +
    '  }\n' +
    '  #buttonsquare {\n' +
    '    height: 17px;\n' +
    '    width: 17px;\n' +
    '    border: 1px solid #000;\n' +
    '    border-radius: 5px;\n' +
    '    margin: auto;\n' +
    '    margin-top: 18px;\n' +
    '  }  \n' +
    '</style><div id="create-edit-container-pane" ng-class=""><div ui-view=""><div class="large-left-pane"><div class="left-pane"><div class="left-pane-content"><div class="left-pane-container" slimscroll="{height: \'auto\', alwaysVisible: true}" slimscroll-listen-to="windowResize"><form class="form-horizontal"><form class="form-horizontal ng-pristine ng-valid" style="width:100%"><section class="well" id="sizePositionWell"><section ng-hide="hidePositionSizeWell"><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label">Select Type<a ng-click="openGuide(\'\')"><i class="fa fa-question fa-border"></i></a></label><div class="col-xs-7"><select class="form-control" ng-model="pushNotification.type" name="type" id="push type"><option value="" disabled="disabled">Select...</option><option value="1" ng-click="updateType(1)">Plain Text</option><option value="2" ng-click="updateType(2)">Image</option><option value="5" ng-click="updateType(2)">BroadCast</option></select></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Name of Notification</label><div class="col-xs-7"><textarea type="text" rows="2" class="form-control" ng-model="pushNotification.title" validation-field-required="true"></textarea></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">App-Name/Heading</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" ng-model="pushNotification.heading" validation-field-required="true"></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Text</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" ng-model="pushNotification.text" validation-field-required="true"></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Expanded Text</label><div class="col-xs-7"><textarea type="text" rows="2" class="form-control" ng-model="pushNotification.bigText" validation-field-required="true" placeholder="Leave blank if not needed"></textarea></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">App Package Name</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" placeholder="io.connecto.sdk.sample" ng-model="pushNotification.packageName" validation-field-required="true"></div></div></div></div></div><div class="row"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Activity Name</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" placeholder="io.connecto.sdk.sample.Activity" ng-model="pushNotification.redirectActivity" validation-field-required="true"></div></div></div></div></div><div class="row" ng-show="pushNotification.type == 2"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Image Url</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" ng-model="pushNotification.imageUrl" validation-field-required="true"></div></div></div></div></div><div class="row" ng-show="pushNotification.type == 5"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Broadcast Action</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" ng-model="pushNotification.broadcastAction" validation-field-required="true"></div></div></div></div></div><div class="row" ng-show="pushNotification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Second Activity Name</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" placeholder="io.connecto.sdk.sample.Activity2" ng-model="pushNotification.redirectActivity2" validation-field-required="true"></div></div></div></div></div><div class="row" ng-show="pushNotification.type == 3 || pushNotification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Action Button Text</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" ng-model="pushNotification.actionButtonText1" validation-field-required="true"></div></div></div></div></div><div class="row" ng-show="pushNotification.type == 4"><div class="col-xs-12"><div class="form-group"><div><label class="col-xs-5 control-label" style="text-align:right;font-size:15px;">Second Action Button Text</label><div class="col-xs-7"><input type="text" rows="2" class="form-control" ng-model="pushNotification.actionButtonText2" validation-field-required="true"></div></div></div></div></div></section></section><section class="well" id="form-field-section"><div class="well-label clickable" ng-click="hideFormFields = !hideFormFields" ng-class="{\'highlight\' : hideFormFields}"><i class="fa fa-caret-down" ng-hide="hideFormFields"></i> <i class="fa fa-caret-right" ng-show="hideFormFields"></i> Payload Data</div><section ng-hide="hideFormFields"><div class="row"><div class="col-xs-12"><table class="table table-bordered"><thead><tr><th></th><th>Key</th><th>Value</th></tr></thead><tbody><tr ng-repeat="i in pushNotification.payload"><td><button class="btn btn-danger btn-circle btn-outline" type="button" ng-click="removeField($index)"><i class="fa fa-minus"></i></button></td><td><input type="text" class="form-control" ng-model="i.key" placeholder="New Key"></td><td><input type="text" class="form-control" ng-model="i.value" placeholder="New Value"></td></tr><tr><td colspan="4"><button type="button" class="btn btn-primary" ng-click="addPayloadPair()"><i class="fa fa-plus"></i> Add New (Key, Value) Pair</button></td></tr></tbody></table></div></div></section></section><section class="well" ng-hide="hidePositionSizeWell"><div class="row"><div class="col-xs-12"><div class="form-group"><div class="col-xs-offset-1 col-xs-10"><label class="control-label" style="text-align:left;font-size:15px;"><input type="radio" name="segment" ng-model="pushNotification.eventRuleIds" ng-value="null" ng-checked="pushNotification.eventRuleIds==null"> All subscribed users<br><input type="radio" name="segment" ng-click="pushNotification.eventRuleIds = []" ng-checked="pushNotification.eventRuleIds.length>0"> To Segment</label><div ng-show="pushNotification.eventRuleIds"><div class="ibox-title" style="border:none"><h5>Choose a Segment of users satisfying Rule.</h5><div class="ibox-tools"></div></div><div class="ibox-content" style="border:none"><select class="form-control" name="eventRule" ng-model="pushNotification.eventRuleIds[0]" placeholder="Select..."><option value="" disabled="disabled">Select...</option><option ng-repeat="rule in rules" value="{{rule._id}}" ng-selected="rule._id==pushNotification.eventRuleIds[0]">{{rule.title}}</option></select></div></div></div></div></div></div></section></form></form></div></div><div class="left-pane-footer" id="create-edit-footer"><nav class="navbar" role="navigation" style="margin-bottom: 0"><section ng-hide="isSavingInProgress"><button class="back-button navbar-header pull-left"><i class="fa fa-chevron-left fa-4"></i></button> <button class="next-button navbar-header pull-right save-button" ng-click="submitPushNotification()">SAVE <i class="fa fa-arrow-right fa-4"></i></button></section><section ng-show="isSavingInProgress"><button class="next-button navbar-header" style="width:100%;text-align:center;">Saving ... <i class="fa fa-spinner fa-spin fa-4"></i></button></section></nav></div></div><div class="right-pane" style="overflow:auto"><div id="preview-iframe-container"><div class="wrapper wrapper-content"><div class="row"><div id="case"><div id="earsection"><div id="camera"></div><div id="speaker"></div></div><div id="screen" style="background-color:black;"><div class="ibox float-e-margins"><div class="ibox-title" style="background-image: url(https://cdn.mxpnl.com/cache/f95dd381504ef6edbb286b92345052c4/images/engage/widgets/android-head.png); background-color:black; padding:0px; border:none;"><div style="font-weight: 200; display: inline-block; font-size: 30px;padding: 2px;">12:09</div><div class="date" style="display: inline-block; text-transform: uppercase; font-size: 11px; font-weight: 500; line-height: 1.4;">Tuesday<br>May 12, 2015</div></div><div class="ibox-content" style="background-color:black; height:350px; background-size: 100%; padding:0px;"><div class="android_push_wrapper" style="padding: 3px 70px 15px 80px; position: relative; display: block; font-weight: 500;"><div style="position: absolute; left: 0; top: 0; content: \'\'; background: skyblue; height: 70px; width: 70px;"></div><div style="content: \'\'; display: inline-block; float: right; padding-top: 4px; padding-right: 10px; position: absolute; top: 0; right: 0; font-family:\'droid-sans\', sans-serif;font-weight:lighter;">9.07 PM</div><input class="app_name" style="font-size: 14px; color: #c7c7c7; width: 200px; background: 0; border: 0; resize: none; display: inline-block; color: inherit; padding-top: 4px; font-weight: 400 box-shadow: none;" ng-model="pushNotification.heading" placeholder="App-Name/Heading"><br><textarea class="push_message" placeholder="Type your push notification message..." style="overflow-y: hidden; color: #c7c7c7; width: 200px; background: 0; border: 0; resize: none; display: inline-block; color: inherit; padding-top: 4px; font-weight: 200; font-size: 12px; box-shadow: none;" ng-show="!pushNotification.bigText" ng-model="pushNotification.text" ng-change="calulateBytes()"></textarea> <textarea class="push_message" placeholder="Type your push notification message..." style="overflow-y: hidden; color: #c7c7c7; width: 200px; background: 0; border: 0; resize: none; display: inline-block; color: inherit; padding-top: 4px; font-weight: 200; font-size: 12px; box-shadow: none;" ng-show="pushNotification.bigText" ng-model="pushNotification.bigText" ng-change="calulateBytes()"></textarea></div><div ng-show="pushNotification.type==2" class=""><image style="height:250px; width:313px;" src="{{pushNotification.imageUrl}}" <="" div=""><div class="bytes_left" style="border-top: solid 2px rgba(255,255,255,0.2); color: rgba(255,255,255,0.75); text-align: right; padding: 20px 20px; font-weight: 400; font-size: 14px;">You have {{bytesleft}} bytes left</div></image></div></div></div></div></div><div id="button"><div id="buttonsquare"></div></div></div></div></div></div></div></div></div>');
}]);
})();
