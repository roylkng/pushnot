(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('left-nav/left-nav.html',
    '<nav class="navbar-default navbar-static-side" role="navigation"><div class="sidebar-collapse"><ul side-navigation="" class="nav" id="side-menu"><li id="logo-element-row"><a href="#"><img src="https://cdnconnecto.blob.core.windows.net/images/bar-logo.png" alt="Push Notifications"> <span class="nav-label" style="color:#a7b1c2;font-size:10px;">PUSH NOTIFICATIONS</span></a></li><li ui-sref-active="active"><a ui-sref="pushNotificationsList"><i class="fa fa-list-ul fa-2"></i><span class="nav-label">ANDROID</span></a></li><li ui-sref-active="active"><a ui-sref="html5NotificationList"><i class="fa fa-list-ul fa-2"></i><span class="nav-label">CHROME</span></a></li><li ui-sref-active="active"><a ui-sref="events({\'currentTab\': \'0\'})"><i class="fa fa-plus fa-2"></i> <span class="nav-label">EVENTS</span></a></li><li ui-sref-active="active"><a ui-sref="job-stats"><i class="fa fa-plus fa-2"></i> <span class="nav-label">JOB STATS</span></a></li><li ui-sref-active="active"><a ui-sref="push-api"><i class="fa fa-plus fa-2"></i> <span class="nav-label">SEND API</span></a></li><li ui-sref-active="active"><a ui-sref="settings"><i class="fa fa-plus fa-2"></i> <span class="nav-label">SETTINGS</span></a></li><li ui-sref-active="active"><a ui-sref="tags"><i class="fa fa-plus fa-2"></i> <span class="nav-label">TAGS</span></a></li></ul><div id="toggle-sidebar-switch" onclick="$(\'body\').toggleClass(\'mini-navbar\')"><i class="fa fa-arrow-left"></i> <i class="fa fa-arrow-right"></i></div></div></nav>');
}]);
})();
