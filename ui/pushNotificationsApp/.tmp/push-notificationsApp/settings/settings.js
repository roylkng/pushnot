(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings/settings.html',
    '<style>\n' +
    '\n' +
    '.loader,\n' +
    '.loader:before,\n' +
    '.loader:after {\n' +
    '  border-radius: 50%;\n' +
    '}\n' +
    '.loader:before,\n' +
    '.loader:after {\n' +
    '  position: absolute;\n' +
    '  content: \'\';\n' +
    '}\n' +
    '.loader:before {\n' +
    '  width: 5.2em;\n' +
    '  height: 10.2em;\n' +
    '  background: #c2c2c2;\n' +
    '  border-radius: 10.2em 0 0 10.2em;\n' +
    '  top: -0.1em;\n' +
    '  left: -0.1em;\n' +
    '  -webkit-transform-origin: 5.2em 5.1em;\n' +
    '  transform-origin: 5.2em 5.1em;\n' +
    '  -webkit-animation: load2 2s infinite ease 1.5s;\n' +
    '  animation: load2 2s infinite ease 1.5s;\n' +
    '}\n' +
    '.loader {\n' +
    '  font-size: 11px;\n' +
    '  text-indent: -99999em;\n' +
    '  margin: 0px;\n' +
    '  position: relative;\n' +
    '  width: 10em;\n' +
    '  height: 10em;\n' +
    '  box-shadow: inset 0 0 0 1em #ffffff;\n' +
    '  -webkit-transform: translateZ(0);\n' +
    '  -ms-transform: translateZ(0);\n' +
    '  transform: translateZ(0);\n' +
    '}\n' +
    '.loader:after {\n' +
    '  width: 5.2em;\n' +
    '  height: 10.2em;\n' +
    '  background: #c2c2c2;\n' +
    '  border-radius: 0 10.2em 10.2em 0;\n' +
    '  top: -0.1em;\n' +
    '  left: 5.1em;\n' +
    '  -webkit-transform-origin: 0px 5.1em;\n' +
    '  transform-origin: 0px 5.1em;\n' +
    '  -webkit-animation: load2 2s infinite ease;\n' +
    '  animation: load2 2s infinite ease;\n' +
    '}\n' +
    '@-webkit-keyframes load2 {\n' +
    '  0% {\n' +
    '    -webkit-transform: rotate(0deg);\n' +
    '    transform: rotate(0deg);\n' +
    '  }\n' +
    '  100% {\n' +
    '    -webkit-transform: rotate(360deg);\n' +
    '    transform: rotate(360deg);\n' +
    '  }\n' +
    '}\n' +
    '@keyframes load2 {\n' +
    '  0% {\n' +
    '    -webkit-transform: rotate(0deg);\n' +
    '    transform: rotate(0deg);\n' +
    '  }\n' +
    '  100% {\n' +
    '    -webkit-transform: rotate(360deg);\n' +
    '    transform: rotate(360deg);\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '</style><div class="row"><div class="col-sm-12"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Your Projects</h5></div><div class="ibox-content"><div class="row"><div class="col-sm-6 b-r"><h3 class="m-t-none m-b">Project <small>{{project._id}}</small></h3><br><br><p>Project License Key/Write Key: <span class="label">{{project.writeKey}}</span></p><br><p ng-show="user.isAdmin">Assigned Billing Plan Name: <span class="label">{{billingPlanNameForNormalUsers}}</span></p><br><div class="form-group" ng-show="user.isAdmin"><label class="col-sm-3 control-label" for="">Billing Plans List</label><div class="col-sm-9"><div class="input-group-btn open" dropdown=""><button class="btn btn-white dropdown-toggle" type="button" style="width: 100%;padding:5px 0px;" aria-haspopup="true" aria-expanded="true"><div class="col-sm-10" value="" style="text-align:left; line-height:32px">{{billingPlanName}}</div><div class="col-sm-2" style="line-height:32px"><span class="caret"></span></div></button><ul class="dropdown-menu pull-right" style="width: 100%;"><li ng-repeat="plan in billingPlans" style="line-height: 40px;" ng-click="saveBillingPlan(plan)"><div style="display:inline-block; width: 100%; text-align:middle;"><span style="font-size:14px">{{plan.name}}</span><hr style="margin:2px 10px;" ng-hide="$last"></div></li></ul></div></div></div><div class="form-group"><br><br></div><div class="form-group" ng-show="user.isAdmin"><label class="col-sm-3 control-label" for="">Is Active?</label><div class="col-sm-2"><span class="onoffswitch"><input type="checkbox" class="onoffswitch-checkbox ng-pristine ng-untouched ng-valid" id="is-active" ng-model="project.isEventsEnabled"> <label class="onoffswitch-label" for="is-active"><div class="onoffswitch-inner" data-swchon-text="YES" data-swchoff-text="NO"></div><div class="onoffswitch-switch"></div></label></span></div></div><br><p ng-show="project.readAuthKey">Read Authorization Key: <span class="label">{{project.readAuthKey}}</span></p><p class="text-center"><a href=""><i class="fa fa-sign-in big-icon"></i></a></p><div class="hr-line-dashed"></div><h3 class="m-t-none m-b">Properties</h3><p>List of Domains</p><div class="form-group m-b"><input type="text" class="form-control" ng-model="property.domainName" ng-repeat="property in project.properties" ng-disabled="true"></div><div class="form-group"><button class="btn btn-primary" type="button" ng-click="addNewProperty=true" ng-hide="addNewProperty"><i class="fa fa-plus"></i>&nbsp;Add a Domain</button><div class="row" ng-show="addNewProperty"><div class="col-sm-12"><div class="alert alert-block alert-danger">DO NOT ADD SUBDOMAINS</div></div><div class="col-sm-10"><input type="text" class="form-control" placeholder="Enter Domain Url" ng-model="newDomain"></div><button class="btn btn-primary btn-circle" type="button" ng-click="saveNewProperty()"><i class="fa fa-save"></i></button> <button class="btn btn-danger btn-circle" type="button" ng-click="addNewProperty=false"><i class="fa fa-times"></i></button></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">Set Property</label><div class="col-sm-1"></div><div class="col-sm-8"><select class="form-control" ng-model="activePropertyId"><option value="" disabled="disabled">Select...</option><option ng-repeat="key in properties" value="{{key._id}}" ng-selected="activePropertyId==key._id">{{key.domainName}}</option></select></div></div></div><div class="col-sm-6"><button class="btn btn-primary pull-right" ng-click="saveProject()">Save</button><h4>Web Notifications</h4><br><div class="form-group"><div class="row" ng-show="project.websites.length==0"><label class="col-sm-3 control-label">Websites</label> <button class="col-sm-1 btn btn-info btn-circle" type="button" ng-click="addWebsite()" ng-show="project.websites.length==0"><i class="fa fa-plus"></i></button></div><div class="row" ng-repeat="website in project.websites track by $index"><label class="col-sm-3 control-label" ng-hide="$first">&nbsp;</label> <label class="col-sm-3 control-label" ng-show="$first">Websites</label><div class="col-sm-8"><input type="text" class="form-control" ng-model="project.websites[$index]"> <span ng-show="$last" class="help-block m-b-none">These are the websites where you can launch web notifications.</span></div><button class="col-sm-1 btn btn-info btn-circle" type="button" ng-click="addWebsite()" ng-show="$last"><i class="fa fa-plus"></i></button> <button class="col-sm-1 btn btn-failure btn-circle" type="button" ng-click="removeWebsite($index)" ng-hide="$last"><i class="fa fa-minus"></i></button></div></div><div class="hr-line-dashed"></div><div class="form-group row"><label class="col-sm-3 control-label">Follower Emails</label><div class="col-sm-8"><input type="text" class="form-control" ng-model="project.follower_emails"> <span class="help-block m-b-none">Please give the emails of those who will be following this project separated by comma.</span></div></div><div class="hr-line-dashed"></div><h4>Android Notifications</h4><br><div class="form-group"><div class="row" ng-show="project.androidApps.length==0"><label class="col-sm-3 control-label">Android Apps</label> <button class="col-sm-1 btn btn-info btn-circle" type="button" ng-click="addAndroid()" ng-show="project.androidApps.length==0"><i class="fa fa-plus"></i></button></div></div><div class="form-group row"><label class="col-sm-3 control-label">GCM Api Key</label><div class="col-sm-8"><input type="text" class="form-control" ng-model="project.gcmAPIKey"> <span class="help-block m-b-none">The API Key provided from your google developer\'s console.</span></div></div><div class="hr-line-dashed"></div><h4>Android/Chrome Notifications</h4><br><div class="form-group row"><label class="col-sm-8 control-label" for="html5-notification-ask-permission"><input type="checkbox" ng-model="project.html5NotificationSettings.askForPermission" id="html5-notification-ask-permission"> Automatically Ask users for HTML5 Notification Permission?</label></div><div class="form-group row"><label class="col-sm-4 control-label">Chrome Push Package</label><div class="col-sm-8"><a class="btn btn-danger" ng-href="{{chromePushPackageUrl}}">Download Package</a></div></div><div class="form-group row"><label class="col-sm-8 control-label" for="html5-notification-ask-permission"><a href="http://www.connecto.io/kb/knwbase/connecto-getting-started-with-html5-chrome-push-notifications/">Check out Blog for more Info.</a></label></div><div class="hr-line-dashed"></div><h4>SMS Notifications</h4><br><div class="form-group row"><label class="col-sm-3 control-label">GUPSHUP credentials</label><div class="col-sm-4"><input type="text" class="form-control" ng-model="project.smsGateway[0].username"></div><div class="col-sm-4"><input type="text" class="form-control" ng-model="project.smsGateway[0].password"></div><div class="col-sm-8"><span class="help-block m-b-none">Username and password of GUPSHUP account.</span></div></div></div><button class="btn btn-primary pull-right" ng-click="submitProject()">Save</button></div></div></div></div></div>');
}]);
})();
