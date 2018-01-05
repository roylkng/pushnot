'use strict';

angular.module('pushNotificationsApp',
               [ 'ngAnimate',
                 'ui.router',
                 'ui.bootstrap',
                 'ngBootstrap',                 
                 'ui.slimscroll',
                 'ngCookies',
                 'ngSanitize',
                 'ui.slider',
                 'angles',
                 'angular-flot',
                 'common'
               ])
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    var _setDefaultRootScopeVariables = function($rootScope) {
      $rootScope.title = '';
      $rootScope.breadcrumbs = undefined;
      $rootScope.showBreadcrumbsRow = true;
      $rootScope.isInsideCreateFlow = false;
      $rootScope.hideDateRangePicker = false;
      $rootScope.showCreateButton = true;
    };
    _setDefaultRootScopeVariables.$inject = ["$rootScope"];
    $stateProvider
      .state('base', {
        url: '',
        templateUrl: 'push-notificationsApp/main/main.html',
        abstract : true,
        resolve : {
          coContextService : 'coContextService',
          pushNotificationsService : 'pushNotificationsService',
          coHtml5NotificationService : 'coHtml5NotificationService',
          coAppContext : ["coContextService", function(coContextService) { return coContextService.getContext(); }]
        },
        controller : 'MainCtrl',
        onEnter : ["$rootScope", function($rootScope) {
          _setDefaultRootScopeVariables($rootScope);
        }],
      })
      /* Start Create related states */
      .state('pushNotificationsList', {
        parent : 'base',
        url: '/list',
        templateUrl: 'push-notificationsApp/push-notifications-list/push-notifications-list.html',
        controller: 'pushNotificationsListCtrl',
        resolve : {
          pushNotificationsService : 'pushNotificationsService',
        },
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Push Notifications List';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'List',
                state : 'pushNotificationsList'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
     .state('events', {
        parent : 'base',
        url: '/events-project/:currentTab',
        templateUrl: 'push-notificationsApp/events/events-project.html',
        controller: 'EventsByProjectCtrl',
        resolve : {
          eventsService : 'eventsService',
        },
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Events For Project';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Events (please specify a date range within the last 3 months)',
                state : 'events'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
     .state('profile_events', {
        parent : 'base',
        url: '/profile-events/:profileId',
        templateUrl: 'push-notificationsApp/events/profile-events.html',
        controller: 'EventsByProfileCtrl',
        resolve : {
          eventsService : 'eventsService',
        },
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Profile Events';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Events',
                state : 'profile_events'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
     .state('profile_page_events', {
        parent : 'base',
        url: '/profile-page-events/:profileId',
        templateUrl: 'push-notificationsApp/events/profile-page-events.html',
        controller: 'PageEventsByProfileCtrl',
        resolve : {
          eventsService : 'eventsService',
        },
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Profile Events';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Page Events',
                state : 'profile_page_events'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
     .state('job-stats', {
        parent : 'base',
        url: '/job-stats',
        templateUrl: 'push-notificationsApp/job-stats/job-stats.html',
        controller: 'JobStatsCtrl',
        resolve : {
          jobstatsService : 'jobStatsService',
        },
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Job Stats for Project';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Jobs',
                state : 'job-stats'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
      .state('create-push', {
        parent : 'base',
        url: '/createPush',
        data: {
          currentStep : 1,
          mode: 'create-push'
        },
        resolve : {
          coContextService : 'coContextService',
          coAppContext : ["coContextService", function(coContextService) { return coContextService.getContext(); }]
        },
        templateUrl: 'push-notificationsApp/create-edit-push/create-edit-push.html',
        controller: 'createEditPushCtrl',
         onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Create New Push Notification';
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
          $rootScope.breadcrumbs = [
              {
                text : 'Home',
                state : 'create-push'
              },
              {
                text : 'Create New Push Notification',
                state : undefined
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
        .state('edit-push', {
        parent : 'base',
        url: '/editPush/:pushNotificationId',
        data: {
          currentStep : 1,
          mode: 'edit-push'
        },
        resolve : {
          coContextService : 'coContextService',
          coAppContext : ["coContextService", function(coContextService) { return coContextService.getContext(); }]
        },
        templateUrl: 'push-notificationsApp/create-edit-push/create-edit-push.html',
        controller: 'createEditPushCtrl',
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Edit Push Notification';
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
          $rootScope.breadcrumbs = [
              {
                text : 'Home',
                state : 'edit-push'
              },
              {
                text : 'Edit Push Notification',
                state : undefined
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
        .state('settings', {
        parent : 'base',
        url: '/settings',
        templateUrl: 'push-notificationsApp/settings/settings.html',
        controller: 'settingsCtrl',
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Settings';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Settings',
                state : 'settings'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
      .state('tags', {
        parent : 'base',
        url: '/tags',
        templateUrl: 'push-notificationsApp/tags/tags.html',
        controller: 'TagsCtrl',
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Tags';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Tags',
                state : 'tags'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
      .state('createTag', {
         parent : 'base',
         url: '/createTag',
         templateUrl: 'push-notificationsApp/tags/create-edit-tags.html',
         controller: 'CreateEditTagCtrl',
         onEnter : ["$rootScope", function($rootScope) {
           $rootScope.title = 'Create Tag';
           $rootScope.showBreadcrumbsRow = true;
           $rootScope.showCreateButton = false;
           $rootScope.breadcrumbs = [
               {
                 text : 'Home',
                 state : 'createTag'
               },
               {
                 text : 'Create Tag',
                 state : undefined
               },
             ];
         }],
         onExit : _setDefaultRootScopeVariables,
      })
      .state('editTag', {
         parent : 'base',
         url: '/editTag/:tagId',
         templateUrl: 'push-notificationsApp/tags/create-edit-tags.html',
         controller: 'CreateEditTagCtrl',
         onEnter : ["$rootScope", function($rootScope) {
           $rootScope.title = 'Edit Tag';
           $rootScope.showBreadcrumbsRow = true;
           $rootScope.showCreateButton = false;
           $rootScope.breadcrumbs = [
               {
                 text : 'Home',
                 state : 'editTag'
               },
               {
                 text : 'Edit Tag',
                 state : undefined
               },
             ];
         }],
         onExit : _setDefaultRootScopeVariables,
      })
      .state('push-api', {
        parent : 'base',
        url: '/push-api',
        templateUrl: 'push-notificationsApp/push-api/api.html',
        controller: 'pushApiCtrl',
        resolve : {
          pushNotificationsService : 'pushNotificationsService',
          settingsService : 'settingsService',
        },
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Push-Api';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Push-Api',
                state : 'push-api'
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      })
      .state('html5NotificationList', {
        parent : 'base',
        url: '/html5notifications',
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-list.html',
        controller: 'html5NotificationListCtrl',
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'HTML5 Notifications List';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'HTML5 Notification List',
                state : ''
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,

      })
      .state('createHtml5Notification', {
        parent : 'base',
        url: '/html5notifications/create',
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-manage.html',
        resolve: {
          coContextService : 'coContextService',
          coHtml5NotificationObj: ["coHtml5NotificationService", "coAppContext", function(coHtml5NotificationService, coAppContext) {
            return coHtml5NotificationService.getNewNotification();
          }],
        },
        controller: 'ManageHtml5NotificationCtrl',
        data: {
          mode: 'create',
        },
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
        }],
        onExit : _setDefaultRootScopeVariables,
      })
      .state('viewHtml5Notification', {
        parent : 'base',
        url: '/html5notifications/:html5NotificationId',
        resolve : {
          coContextService : 'coContextService',
          coHtml5NotificationService : 'coHtml5NotificationService',
          coHtml5NotificationObj: ["coHtml5NotificationService", "coAppContext", "$stateParams", function(coHtml5NotificationService,
            coAppContext, $stateParams) {
            return coHtml5NotificationService.getNotification(coAppContext,
              $stateParams.html5NotificationId);
          }],
        },
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-view.html',
        controller: 'ViewHtml5NotificationCtrl',
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'View HTML5 Notification';
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
        }],
        onExit : _setDefaultRootScopeVariables,
      })
      .state('editHtml5Notification', {
        parent : 'base',
        url: '/html5notifications/:html5NotificationId/edit',
        data: {
          mode: 'edit'
        },
        resolve : {
          coContextService : 'coContextService',
          coHtml5NotificationService : 'coHtml5NotificationService',
          coHtml5NotificationObj: ["coHtml5NotificationService", "coAppContext", "$stateParams", function(coHtml5NotificationService,
            coAppContext, $stateParams) {
            return coHtml5NotificationService.getNotification(coAppContext,
              $stateParams.html5NotificationId);
          }],
        },
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-manage.html',
        controller: 'ManageHtml5NotificationCtrl',
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'Edit HTML5 Notification';
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
        }],
        onExit : _setDefaultRootScopeVariables,
      })
      .state('html5NotificationAnalytics', {
        parent : 'base',
        controller: 'html5NotificationAnalyticsCtrl',
        url: '/html5notifications/:html5NotificationId/analytics',
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-analytics.html',
        onEnter : ["$rootScope", function($rootScope) {
          $rootScope.title = 'HTML5 Notifications Analytics';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'HTML5 Notification Analytics',
                state : ''
              },
            ];
        }],
        onExit : _setDefaultRootScopeVariables,
      });
    $urlRouterProvider.otherwise('/list');

  }]);

'use strict';

angular.module('pushNotificationsApp')
  .factory('coContextService', ["$http", "$q", function ($http, $q) {
    var contextService = {};

    var cachedContext;
    var selectedWebsite;
    var selectedDateRange = {
                              startDate : moment().startOf('day'),
                              endDate: moment().endOf('day')
                            };
    var placementIdMap = {};

    // Process context data so that data structures are built
    var _processContextDataOnChange = function() {
      // for (var i=0; i<cachedContext.placements.length; i++) {
      //   placementIdMap[cachedContext.placements[i].value] = cachedContext.placements[i];
      // }
    };


    // TODO: Change method to actually return selected project (when project
    // selection is enabled)
    contextService.getSelectedProject = function() {
      if (cachedContext && cachedContext.projects && cachedContext.projects[0]) {
        return cachedContext.projects[0];
      }
      return undefined;
    };

    // TODO: Change method to actually return selected project (when project
    // selection is enabled)
    contextService.getSelectedProjectId = function() {
      var selectedProject = contextService.getSelectedProject();
      if (selectedProject) {
        return selectedProject._id;
      }
      return undefined;
    };

    // TODO: Change method to actually return selected project's writeKey
    // (when project selection is enabled)
    contextService.getSelectedProjectWriteKey = function() {
      var selectedProject = contextService.getSelectedProject();
      if (selectedProject) {
        return selectedProject.writeKey;
      }
      return undefined;
    };

    contextService.getSelectedWebsite = function() {
      return selectedWebsite;
    };

    contextService.setSelectedWebsite = function(website) {
      selectedWebsite = website;
    };

    contextService.getSelectedDateRange = function() {
      return selectedDateRange;
    };

    contextService.setSelectedDateRange = function(dateRange) {
      selectedDateRange = dateRange;
    };

    contextService.getActivePropertyId = function () {
        console.log(cachedContext);
      if (cachedContext && cachedContext.projects &&
       cachedContext.projects[0] && cachedContext.projects[0].activePropertyId) {
        console.log("cached context");
        return cachedContext.projects[0].activePropertyId;
      }
    };

    contextService.getContext = function() {
      var deferred = $q.defer();

      var url = '/notifications/notification_context';

      if (cachedContext) {
        deferred.resolve(cachedContext);
      } else {
        $http.get(url)
        .success(function(data) {
          cachedContext = data;
          contextService.setSelectedWebsite();
          _processContextDataOnChange();
          deferred.resolve(cachedContext);
        })
        .error(function(data, status) {
          deferred.reject(status);
        });
      }

      return deferred.promise;
    };

    contextService.getPlacementNameFromId = function(placementId) {
      var placement = placementIdMap[parseInt(placementId)];
      if (placement) {
        return placement.name;
      }
    }

    return contextService;
  }]);

var DateUtil = {
  hoursInDay: 24,
  msInHour: 60*60*1000,
  minutesInHour: 60,

  // Gets start of the day hour from date object
  getStartOfDayHourFromDate : function(date) {
    var startOfDayMoment = moment(date).startOf('day');
    var startOfDayTime  = startOfDayMoment.toDate().getTime();
    return Math.floor( startOfDayTime / (1000*60*60) );
  },

  // Gets start of the day hour from date object
  getEndOfDayHourFromDate : function(date) {
    var endOfDayMoment = moment(date).endOf('day');
    var endOfDayTime  = endOfDayMoment.toDate().getTime();
    return Math.floor( endOfDayTime / (1000*60*60) );
  },

  // Returns start of day hour from timestamp
  getStartOfDayHour : function(timeStamp) {
    var m = moment(timeStamp);
    return this.getStartOfDayHourFromDate(m.toDate());
  },

  getEndOfDayHour : function(timeStamp) {
    var m = moment(timeStamp);
    return this.getEndOfDayHourFromDate(m.toDate());
  },

  convertToUTCHour : function(hour) {
    var date = new Date();
    var utcHour = hour + date.getTimezoneOffset();
    return utcHour;
  },

  convertToTimeZoneHour : function(hour) {
    var date = new Date();
    var timeZoneHour = hour - date.getTimezoneOffset();
    return timeZoneHour;
  },

  convertToTimeZoneTimeStamp : function(timeStamp) {
    var date = new Date();
    var timeZoneTimeStamp = timeStamp - date.getTimezoneOffset() * this.msInHour;
    return timeZoneTimeStamp;
  },
}

'use strict';

var NavbarCtrl = function ($scope) {
  $scope.date = new Date();
};
NavbarCtrl.$inject = ["$scope"];

'use strict';

var ModalInstanceCtrl = function ($scope, $modalInstance, data) {
  $scope.data = data;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
ModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "data"];

angular.module('pushNotificationsApp')
  .controller('ModalInstanceCtrl', ModalInstanceCtrl);

'use strict';

angular.module('pushNotificationsApp')
.controller('TestSendModalCtrl', ["$scope", "$modalInstance", "data", "pushNotificationsService", function ($scope, $modalInstance, data,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.appContext = data.coAppContext;
  $scope.payload = data.payload;
  $scope.userId = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

  var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.userId = '';
    $scope.$apply();
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
    $scope.$apply();
  };

  var _processIds = function(ids) {
    var idList = ids.trim().split(',');
    for (var i = 0; i < idList.length; i++) {
      idList[i] = idList[i].trim();
    }
    return idList;
  }

  $scope.sendTest = function() {
    if (!$scope.userId) {
      $scope.failureMessage = 'userId can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.profileIds = _processIds($scope.userId);
    $scope.payload.requestId = $scope.pushNotification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    pushNotificationsService.sendPushToUserList($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('pushNotificationsApp')
.controller('SendPushToUserListModalCtrl', ["$scope", "$modalInstance", "data", "pushNotificationsService", function ($scope, $modalInstance, data,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.appContext = data.coAppContext;
  $scope.payload = data.payload;
  $scope.profileIds = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

  var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.profileIds = '';
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
  };

  var _processIds = function(ids) {
    var idList = ids.trim().split(',');
    for (var i = 0; i < idList.length; i++) {
      idList[i] = idList[i].trim();
    }
    return idList;
  }

  $scope.sendPush = function() {
    if (!$scope.profileIds) {
      $scope.failureMessage = 'user ids can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.profileIds = _processIds($scope.profileIds);
    $scope.payload.requestId = $scope.pushNotification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    pushNotificationsService.sendPushToUserList($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('pushNotificationsApp')
.controller('SendPushViaMongodbModalCtrl', ["$scope", "$modalInstance", "data", "pushNotificationsService", function ($scope, $modalInstance, data,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.appContext = data.coAppContext;
  $scope.payload = data.payload;
  $scope.profileIds = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.$apply();
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
    $scope.$apply();
  };

  $scope.sendPushViaMongo = function() {
    if (!$scope.auth.host || !$scope.auth.port || !$scope.auth.dbname || !$scope.auth.collection) {
      $scope.failureMessage = 'Please fill necessary fields';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.auth = $scope.auth;
    $scope.payload.requestId = $scope.pushNotification._id;
    $scope.successMessage = '';
    $scope.failureMessage = '';
    pushNotificationsService.sendPushViaMongo($scope.appContext, $scope.payload, _onSendTestSuccess,
      _onSendTestFailure);
  };

  $scope.cancel = function () {
    $scope.auth = { user: "",
                    pass: "",
                    host: "",
                    port: "",
                    dbname: "",
                    collection: ""
                  };
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('pushNotificationsApp')
.controller('TestSendModalCtrl', ["$scope", "$modalInstance", "data", "coHtml5NotificationService", function ($scope, $modalInstance, data,
  coHtml5NotificationService) {

  $scope.html5Notification = data.html5Notification;
  $scope.appContext = data.coAppContext;
  $scope.userId = '';
  $scope.payload = data.payload;
  $scope.profileIds = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

  var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.profileIds = '';
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
  };

  var _processIds = function(ids) {
    var idList = ids.trim().split(',');
    for (var i = 0; i < idList.length; i++) {
      idList[i] = idList[i].trim();
    }
    return idList;
  }

  $scope.sendTest = function() {
    if (!$scope.profileIds) {
      $scope.failureMessage = 'user ids can\'t be blank';
      return;
    }
    console.log(data);
    $scope.payload.notification = $scope.html5Notification;
    $scope.payload.profileIds = _processIds($scope.profileIds);
    $scope.payload.requestId = $scope.html5Notification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    coHtml5NotificationService.sendChromeToUserList($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('pushNotificationsApp')
.controller('SendToTagsModalCtrl', ["$scope", "$modalInstance", "data", "coHtml5NotificationService", "pushNotificationsService", function ($scope, $modalInstance, data,
  coHtml5NotificationService,
  pushNotificationsService) {

  $scope.pushNotification = data.pushNotification;
  $scope.html5Notification = data.html5Notification;
  $scope.appContext = data.coAppContext;
  $scope.payload = data.payload;
  $scope.tags = '';
  $scope.successMessage = '';
  $scope.failureMessage = '';

  var _onSendTestSuccess = function(message) {
    $scope.successMessage = message.data;
    $scope.tags = '';
  };

  var _onSendTestFailure = function(message) {
    $scope.successMessage = message.data;
  };

  var _processTags = function(ids) {
    var idList = ids.trim().split(',');
    for (var i = 0; i < idList.length; i++) {
      idList[i] = idList[i].trim();
    }
    return idList;
  }

  $scope.sendHtml5 = function() {
    if (!$scope.tags) {
      $scope.failureMessage = 'tags can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.html5Notification;
    $scope.payload.tags = _processTags($scope.tags);
    $scope.payload.requestId = $scope.html5Notification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    coHtml5NotificationService.sendChromeToTags($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.sendPush = function() {
    if (!$scope.tags) {
      $scope.failureMessage = 'tags can\'t be blank';
      return;
    }
    $scope.payload.notification = $scope.pushNotification;
    $scope.payload.tags = _processTags($scope.tags);
    $scope.payload.requestId = $scope.pushNotification._id;

    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.payload);
    pushNotificationsService.sendToTags($scope.appContext,
      $scope.payload, _onSendTestSuccess, _onSendTestFailure);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

angular.module('pushNotificationsApp')
  .controller('NavbarCtrl', NavbarCtrl);

'use strict';

angular.module('pushNotificationsApp')
  .controller('MainCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "coAppContext", "coContextService", function ($scope, $rootScope, $state, $stateParams,
                                    coAppContext, coContextService) {
    $scope.selectedWebsite = coContextService.getSelectedWebsite();
    $scope.appContext      = coAppContext;
    $scope.dateRange = coContextService.getSelectedDateRange();
    $scope.ranges = {
              'Today': [moment(), moment()],
              'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
              'Last 7 days': [moment().subtract('days', 7), moment()],
              'Last 30 days': [moment().subtract('days', 30), moment()],
              'Last 90 days': [moment().subtract('days', 90), moment()],
              'This month': [moment().startOf('month'), moment().endOf('day')]
    };

    if(coAppContext.user.isStaff){
      $scope.isAdminUser = coAppContext.user.isStaff;
    } else $scope.isAdminUser = false;

    $scope.applicationName = 'pushNotificationsApp';
    $scope.createStateUrl = 'create-push';
    // $('#side-menu').metisMenu();

    var _reloadCurrentState = function() {
      $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: true,
          notify: true
      });
    };

    $scope.changeSelectedWebsite = function(website) {
      if (website !==  $scope.selectedWebsite) {
        $scope.selectedWebsite = website;
        coContextService.setSelectedWebsite(website);
        _reloadCurrentState();
      }
    };
    //fix this date range reload staTE bug
    $scope.changeDateRange = function(dateRange) {
      if (dateRange !== $scope.dateRange) {
        coContextService.setSelectedDateRange(dateRange);
        _reloadCurrentState();
      }
    };

    $scope.opts = {
      eventHandlers: {'apply.daterangepicker': function (ev, picker) {
          /*for (var k in ev) {
            console.log(k+'--->'+ev[k]);
          }
          for (var we in picker) {
            console.log(we+'--->'+picker[we]);
          }*/
          $scope.changeDateRange($scope.dateRange);
        }        
      }
    };
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('createEditPushCtrl',["$scope", "$rootScope", "$state", "coAppContext", "pushNotificationsService", "coContextService", "$stateParams", "$http", "$timeout", function($scope, $rootScope, $state, coAppContext,
                                         pushNotificationsService, coContextService, $stateParams, $http, $timeout) {
    $scope.bytesleft = 218;
    $scope.pushNotificationId = $stateParams.pushNotificationId;
    $scope.user_id = coAppContext.runningAsUser.id;
    $scope.projectId = coAppContext.projects[0]._id;
    if (coAppContext.user.isActive != undefined) {
      $scope.isInactive = !coAppContext.user.isActive;
    }

    $scope.calulateBytes = function  () {
      $scope.bytesleft = 236-$scope.pushNotification.text.length;
    };

    $scope.addPayloadPair = function () {
      if ($scope.pushNotification.payload && $scope.pushNotification.payload.length > 0) {
        $scope.pushNotification.payload.push({"key" : " ", "value":" "});
      } else {
        $scope.pushNotification.payload = [{"key" : " ", "value":" "}];
      }
    };

    $scope.selectRule = function(id) {
      $scope.pushNotification.eventRuleIds.push([id]);
    };

    $scope.deselectRule = function(id) {
      var index = $scope.pushNotification.eventRuleIds.indexOf(id); 
      if (index !== -1) {
          $scope.pushNotification.eventRuleIds.splice(index, 1);
      }
    };

    $scope.updateType = function (index) {
      $scope.pushNotification.type = index;
    };

    $scope.removeField = function (index) {
      $scope.pushNotification.payload.splice(index,1);
    };

    $scope.deactivateNotification = function(notification) {
      pushNotificationsService.activateOrDeactivate(notification, false,
          $scope.onSuccessAction, $scope.onFailure);
    };

    $scope.activateNotification = function(notification) {
      pushNotificationsService.activateOrDeactivate(notification, true,
          $scope.onSuccessAction, $scope.onFailure);
    };

    $scope.onSuccessAction = function() {
      init();
    };

    $scope.onFailure = function(data, status, headers, config) {
    };

    $scope.deleteNotification = function(pushNotification) {
      // var deleteContext = {
      //   title: "When a notification is deleted, its analytics data is lost with it and cannot be recovered. Are you sure you want to delete ?",
      //   button_class: "btn-danger",
      //   button_text: "Delete",
      //   action: function() { 
          pushNotificationsService.deleteObject(pushNotification._id, $scope.onSuccessAction, $scope.onFailure);
      //      },
      // };
      // var modalInstance = $modal.open({
      //   templateUrl: 'push-notificationsApp/common/modal-action.html',
      //   controller: 'ModalInstanceCtrl',
      //   resolve : {
      //     data : function() { return deleteContext; }
      //   },
      // });
    };

    var _onSaveSuccess = function(callback) {
      pushNotificationsService.requestCacheUpdate(coAppContext);
      $timeout(function() {$state.go('pushNotificationsList')} , [300]);
    };

    var _onSaveFailure = function() {
      alert("There was a problem connecting to the server. Please check your internet connection and try again later.");
    };

    $scope.submitPushNotification = function(){
      pushNotificationsService.savePushNotification($scope.pushNotification, _onSaveSuccess, _onSaveFailure)
    };

    $scope.processPushNotification = function(notification){
      $scope.pushNotification = notification;
      $scope.calulateBytes();
    };

    function init() {
      // pushNotificationsService.getAllRulesForWebsite(coAppContext)
      // .then(function(rules) {
      //   $scope.rules = rules;
      // });
      if($scope.pushNotificationId){
        pushNotificationsService.getPushNotificationById($scope.pushNotificationId,$scope.processPushNotification);
      } else {
        pushNotificationsService.getNewPushNotification($scope.projectId, $scope.processPushNotification);
      }
    }

    init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('pushNotificationsListCtrl',["$scope", "$rootScope", "$modal", "$timeout", "$state", "coAppContext", "pushNotificationsService", "coContextService", "$http", function($scope, $rootScope, $modal, $timeout, 
                                      $state, coAppContext, pushNotificationsService, 
                                      coContextService, $http) {
    $scope.user_id = coAppContext.runningAsUser.id;
    if (coAppContext.user.isActive != undefined) {
      $scope.isInactive = !coAppContext.user.isActive;
    }

    $scope.submitPushNotification = function(){
      console.log("submitPushNotification");
      pushNotificationsService.savePushNotification($scope.pushNotification);
    };

    $scope.processPushNotifications = function(callback){
       $scope.pushNotifications = callback;
       $scope.$apply();
    };

    $scope.getTimeStampFromId = function(ObjectId){
      var d = new Date(parseInt(ObjectId.toString().slice(0,8), 16)*1000);
      return d.toDateString();
    };

    $scope.getPlacementNameForId = function(placementId) {
      if (placementId == 1) {
        return "Text";
      } else if (placementId == 2){
        return "Image";
      }
    };

    $scope.deactivateNotification = function(notification) {
      pushNotificationsService.activateOrDeactivate(notification, false,
          $scope.onSuccessAction, $scope.onFailure);
    };

    $scope.activateNotification = function(notification) {
      pushNotificationsService.activateOrDeactivate(notification, true,
          $scope.onSuccessAction, $scope.onFailure);
    };

    $scope.onSuccessAction = function() {
      alert("Completed task Successfully");
      // init();
    };

    $scope.onFailure = function(data, status, headers, config) {
      alert("There was problem reaching server, Please try again later.");
    };
    $scope.deleteNotification = function(pushNotification) {
      // var deleteContext = {
      //   title: "When a notification is deleted, its analytics data is lost with it and cannot be recovered. Are you sure you want to delete ?",
      //   button_class: "btn-danger",
      //   button_text: "Delete",
      //   action: function() {
         pushNotificationsService.deleteObject(pushNotification._id, $scope.onSuccessAction, $scope.onFailure);
      //     },
      // }
      // var modalInstance = $modal.open({
      //   templateUrl: 'app/create-edit/targeting-screen/targeting-cluster/' +
      //   'targeting-templates/modal-action.html',
      //   controller: 'ModalInstanceCtrl',
      //   resolve : {
      //     data : function() { return deleteContext; }
      //   },
      // });
    };

    var _onSendSuccess = function() {
      alert('Notification send request sent successfully!');
    };

    var _onSendFailure = function() {
      alert('Error while pushing notification, please try again later.');
      // init();
    };

    $scope.startSending = function(pushNotification) {
      var context = {
        title: 'Once started, you can\'t revert it back. Are you sure you want to start now?',
        button_class: 'btn-primary',
        button_text: 'SEND NOW',
        action: function() {
          pushNotification.status = 2;
          $scope.checkSendToSegmentOrAll(pushNotification);
        },
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-action.html',
        controller: 'ModalInstanceCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.checkSendToSegmentOrAll = function(pushNotification){
      if (pushNotification.eventRuleIds && pushNotification.eventRuleIds.length >0) {
        pushNotificationsService.startSendingToSegment(
              coAppContext, pushNotification._id, 
              pushNotification.eventRuleIds[0],
              function() {
              pushNotification.status = 3;
              _onSendSuccess();
              },
              _onSendFailure);
      } else {
        pushNotificationsService.sendPushNotificationToAll(
              coAppContext,
              pushNotification._id,
              function() {
                pushNotification.status = 3;
                _onSendSuccess();
              },
              _onSendFailure);
      }
    }

    $scope.testSend = function(pushNotification) {
      var context = {
        pushNotification: pushNotification,
        payload : $scope.payload,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-test-send-push.html',
        controller: 'TestSendModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.sentToUserList = function(pushNotification) {
      var context = {
        pushNotification: pushNotification,
        payload : $scope.payload,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-send-push-to-userlist.html',
        controller: 'SendPushToUserListModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.sendToTags = function(pushNotification) {
      var context = {
        pushNotification: pushNotification,
        payload : $scope.payload,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-send-to-tags.html',
        controller: 'SendToTagsModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.sendViaMongoUrl = function(pushNotification) {
      var context = {
        payload : $scope.payload,
        pushNotification: pushNotification,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-send-push-via-mongodb.html',
        controller: 'SendPushViaMongodbModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.processProjectInfo = function(project) {
      $scope.project = project;
      $scope.payload.projectId = project._id;
      $scope.payload.writeKey = project.writeKey;
      $scope.payload.gcmAPIKey = project.gcmAPIKey;
      $scope.payload.follower_emails = project.follower_emails;
    }

    $scope.processProject = function(){
      pushNotificationsService.getPushNotification($scope.projectId, $scope.processPushNotifications);
    };

    $scope.dbUrl = coAppContext.dburl;
    $scope.projectId = coContextService.getSelectedProjectId();
    $scope.website = coContextService.getSelectedWebsite();
    $scope.user = coAppContext.user;
    function init() {
      $scope.searchText = '';
      $scope.payload = { requestId: "",
                    writeKey: "",
                    notification: {},
                    gcmAPIKey: "",
                    profileIds: [],
                    send_type: Number,
                    projectId: '',
                    follower_emails: []
                  };
      $scope.processProject();
      pushNotificationsService.getProject($scope.projectId, $scope.processProjectInfo);
      pushNotificationsService.getAnalyticsSummary(coAppContext)
      .then(function(response) {
        $scope.analyticsSummary = response.data[0];
      });
    }

    init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .factory('pushNotificationsService', ["$http", "$q", "coContextService", function ($http, $q, coContextService) {
    var pushNotificationsService = {};

    var _sendUrl = function(url, callback) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function( responseData ) {
                  callback(responseData);
               },
      });
    };

    var _postUrl = function(url, data, onSuccess, onFailure) {
      $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: onSuccess,
        error: onFailure,
      });
    };

    var _httpPromiseBuilder = function(method, url, cacheResults, dataObj) {
      var data = JSON.stringify(angular.fromJson(angular.toJson(dataObj)));

      method = method || 'GET';
      if (cacheResults !== true) {
        cacheResults = false;
      }
      return $http({
        dataType: 'json',
        cache: cacheResults,
        method: method,
        withCredentials: true,
        url: url,
        data: data,
      });
    };

    pushNotificationsService.getNewPushNotification = function( project_Id,callback) {
      var PushNotification = {
        projectId : project_Id,
        isActive: true,
        status: 1,
        title: '',
        text:'',
        type:'1',
        toXMPP: '',
        notificationKey: '',
        payload: {},
        delayWhileIdle: false,
        ttl: Number,
        deliveryReceiptRequested: false,
        restrictedPackageName: '',
        dryRun: false,
        messageId: Number,
      }
      callback(PushNotification);
    };

    pushNotificationsService.getPushNotification = function (projectId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/pushnotifications?conditions[projectId]='+ projectId;
        _sendUrl(url, callback);
      });
    };

    pushNotificationsService.getPushNotificationById = function (notId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/pushnotifications/'+ notId;
        _sendUrl(url, callback);
      });
    };

    pushNotificationsService.savePushNotification = function(obj, success , failure) {
      coContextService.getContext().then(function(context) {
         var method = (obj._id) ? 'PUT' : 'POST';
        var dbUrl = context.dburl;
        var data = JSON.stringify(angular.fromJson(angular.toJson(obj)));
        var url = 'http://' + dbUrl + 'api/v1/pushnotifications/';
        if (obj._id) {
          url += obj._id;
        }
        $.ajax({
        url: url,
        type: method,
        contentType: "application/json",
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function( response_data ) {
          success(response_data);
        },
        error: function(data, status) {
          failure(status);
        }
        });
      });
    };

    pushNotificationsService.activateOrDeactivate = function (notificationObj, activate, successCallback, errorCallback) {
      coContextService.getContext().then(function(context) {
        var url = 'http://' + context.dburl + 'api/v1/pushnotifications/' + notificationObj._id;
        $.ajax({
          url: url,
          type: "PUT",
          dataType: "json",
          data: {'isActive': activate, 'website': notificationObj.website},
          xhrFields: {
            withCredentials: true
          },
          success: successCallback,
          error: errorCallback,
        });
      });
    };

    pushNotificationsService.requestCacheUpdate = function(coAppContext) {
      var projectId = coContextService.getSelectedProjectId();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'cacheUpdate?type=pushNotifications&projectId=' + projectId;
      _sendUrl(url);
    };

    pushNotificationsService.deleteObject = function(notificationId, successCallback, errorCallback) {
      coContextService.getContext().then(function(context) {
        var url = 'http://' + context.dburl + 'api/v1/pushnotifications/' + notificationId;
        $.ajax({
          url: url,
          type: 'DELETE',
          xhrFields: {
            withCredentials: true
          },
          success: successCallback,
          error: errorCallback,
        });
      });
    };

    pushNotificationsService.sendPushToUserList = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/android-push-notification-ui?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    pushNotificationsService.sendPushViaMongo = function(coAppContext,
                                                         payload,
                                                         onSuccess,
                                                         onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/android-push-notification-via-mongodb?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      // _httpPromiseBuilder('POST', url, false, payload)
      // .then(onSuccess, onFailure);
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

   pushNotificationsService.sendToTags = function(coAppContext,
                                                  payload,
                                                  onSuccess,
                                                  onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/android-push-notification-tag?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    pushNotificationsService.sendPushNotificationviaApi = function(coAppContext,
                                                                   payload,
                                                                   onSuccess,
                                                                   onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl + 'send/android-push-notification';
      var data = JSON.stringify(angular.fromJson(angular.toJson(payload)));
      _postUrl(url, data, onSuccess, onFailure);
    };

    pushNotificationsService.sendSmsApi = function(coAppContext,
                                                   payload,
                                                   onSuccess,
                                                   onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl + 'send/sms';
      var data = JSON.stringify(angular.fromJson(angular.toJson(payload)));
      _postUrl(url, data, onSuccess, onFailure);
    };

    pushNotificationsService.getAnalyticsSummary = function(coAppContext) {
      var jobHostUrl = coAppContext.jobHostUrl;
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      // var dateRange = coContextService.getSelectedDateRange();

      // var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      // var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + jobHostUrl + 'get-android-push-notification-count' + 
        '?conditions[writeKey]=' + writeKey;
        // '&conditions[startHour]=' + startHour +
        // '&conditions[endHour]=' + endHour;

      return _httpPromiseBuilder('GET', url, false);
    };

    pushNotificationsService.getProject = function (projectId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/projects/'+ projectId;
        _sendUrl(url, callback);
      });
    };

    return pushNotificationsService;
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('settingsCtrl',["$scope", "$rootScope", "$state", "coAppContext", "settingsService", "coContextService", "$http", function($scope, $rootScope, 
                                      $state, coAppContext, settingsService, 
                                      coContextService, $http) {
    $scope.user_id = coAppContext.runningAsUser.id;
    if (coAppContext.user.isActive != undefined) {
      $scope.isInactive = !coAppContext.user.isActive;
    }

    $scope.submitProject = function(){
      $scope.project.activePropertyId = $scope.activePropertyId;
      settingsService.saveProject($scope.project);
    };



    var _onSendSuccess = function() {
      alert('Notification send request sent successfully!');
    };

    var _onSendFailure = function() {
      alert('Error while pushing notification, please try again later.');
      // init();
    };

    $scope.dbUrl = coAppContext.dburl;
    $scope.projectId = coContextService.getSelectedProjectId();
    $scope.project = coAppContext.projects[0];
    $scope.website = coContextService.getSelectedWebsite();
    $scope.user = coAppContext.user;
    $scope.chromePushPackageUrl =
      settingsService.getChromePushPackageUrl(coAppContext);

    $scope.saveNewProperty = function() {
      if (!$scope.project.properties || $scope.project.properties===null) {
        $scope.project.properties = [];
      }
      $scope.project.properties.push({domainName: $scope.newDomain});
      $scope.submitProject();
      $scope.addNewProperty = false;
      $scope.newDomain = null;
    }

    function init() {
      $scope.activePropertyId = coContextService.getActivePropertyId();
      $scope.properties = coAppContext.projects[0].properties;

      if (!$scope.project.smsGateway) {
        $scope.project.smsGateway = [];
      }
      if ($scope.project.smsGateway.length == 0) {
        $scope.project.smsGateway.push({gatewayType:1});
      }
    }

    init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .factory('settingsService', ["$http", "$q", "coContextService", function ($http, $q, coContextService) {
    var settingsService = {};


    var _sendUrl = function(url, success) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function( responseData ) {
                  if(success){success(responseData)};
        }
      });
    };

    settingsService.saveProject = function(obj, success , failure) {
      coContextService.getContext().then(function(context) {
        delete obj.__v;
        var method = (obj._id) ? 'PUT' : 'POST';
        var dbUrl = context.dburl;
        var data = JSON.stringify(angular.fromJson(angular.toJson(obj)));
        var url = 'http://' + dbUrl + 'api/v1/projects/';
        if (obj._id) {
          url += obj._id;
        }
        $.ajax({
        url: url,
        type: method,
        contentType: "application/json",
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function( response_data ) {
          if (success) {success(response_data)};
          settingsService.updateCache();
          settingsService.updateCacheApi();
        },
        error: function(data, status) {
          if (failure) { failure(status) };
        }
        });
      });
    };

    settingsService.updateCache = function() {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'update';
        _sendUrl(url);
      });
    };

    settingsService.updateCacheApi = function() {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.apiConnectoUrl;
        var url = 'http://' + dbUrl + 'updateProjectCache?projectId=' + coContextService.getSelectedProjectId();
        _sendUrl(url);
      });
    };

    settingsService.getChromePushPackageUrl = function(coAppContext) {
      return 'http://' + coAppContext.dburl + 'api/getChromePushPackage?projectId='
       + coContextService.getSelectedProjectId() + '&writeKey='
        + coAppContext.projects[0].writeKey;
    };

    settingsService.getProject = function (projectId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/projects/'+ projectId;
        _sendUrl(url, callback);
      });
    };


    return settingsService;
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('EventsByProjectCtrl', ["$scope", "$rootScope", "$state", "$timeout", "$stateParams", "coAppContext", "coContextService", "eventsService", function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, coContextService, eventsService) {
  	$scope.profileId = $stateParams.profileId;
    $scope.activeTab = $stateParams.currentTab;
    $scope.var1 = false;
    $scope.var2 = false;
    $scope.var3 = false;
    $scope.var4 = false;                
    $scope.var5 = false;
    $scope.var6 = false;
    $scope.var7 = false;
    $scope.var8 = false;
    $scope.var9 = false;
    $scope.var10 = false;
    $scope.var11 = false;
    $scope.var12 = false;
    $scope.dateRange = coContextService.getSelectedDateRange();
    $scope.dateRangeFlag = false;

    $scope.tabs = [
      {'title': "Events", 'template': "push-notificationsApp/events/tabs/events.html"},
      {'title': "Page Events", 'template': "push-notificationsApp/events/tabs/page-events.html"},
    ];

    $scope.selectTab = function(i) {
      $state.go('events', {'profileId': $scope.profileId, 'currentTab': i});
      $scope.activeTab = i;
    }

    $scope.polarOptions = {
      scaleShowLabelBackdrop : true,
      scaleBackdropColor : "rgba(255,255,255,0.75)",
      scaleBeginAtZero : true,
      scaleBackdropPaddingY : 1,
      scaleBackdropPaddingX : 1,
      scaleShowLine : true,
      segmentShowStroke : true,
      segmentStrokeColor : "#fff",
      segmentStrokeWidth : 2,
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false,
    };
    function _getTimeDifference(time) {
	    var date = new Date(time);
	    var msInMinutes = 1000 * 60;
	    var minutes = ((new Date()).getTime() - date.getTime()) / msInMinutes;
	    var remainingMinutes = minutes - 60*Math.floor(minutes/60);
	    var hours = minutes / 60;
	    var remainingHours = hours - 24*Math.floor(hours/24);
	    var days = hours / 24; 
	    var snippet = ((days > 1) ? (Math.floor(days) + "d "): "") +
	                  ((days > 1 || hours > 1) ? (Math.floor(remainingHours) + "h "): "") +
	                  Math.floor(remainingMinutes) + "m";
	    return snippet;
    };

    function _getTimeStamp(time) {
      var date = new Date(time);
      var t = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        ('0' + date.getHours()).slice(-2),
        ('0' + date.getMinutes()).slice(-2),
        date.getSeconds(),
      ];
      return t[3] + ":" + t[4] + " - " + t[2] + "." + t[1] + "." + t[0]; 
    };

  	$scope.processEvent = function(et) {
      var x = parseInt(et.sessionId);
	    et.timestamp = _getTimeStamp(x);
    	et.timeago = _getTimeDifference(x);
      	if(et.attributes) {
      		var attributes = [];
			for (var k in et.attributes) {
				var attribute = {key: k, value: et.attributes[k]};
				attributes.push(attribute);
			}
			et.attributes = attributes;
		}
    };

  	$scope.processEvents = function (events) {
  		for (var i = 0; i < events.length; i++) {
      		$scope.processEvent(events[i]);
    	}
  		$scope.events = events;
  		$scope.$apply();
  	};

    $scope.initGraphsOs = function (countStats) {
      var highlight = "#1ab394";
      $scope.polarDataOs = [];
      var colors = randomColor({hue: 'random', luminosity: 'light', count: countStats.length});

      for (var i=0;i<countStats.length;i++) {
        var data = {};
        data.value = countStats[i].total;
        data.color = colors[i];
        data.highlight = highlight;
        data.label = countStats[i]._id.osName;
        $scope.polarDataOs.push(data);
      }
      $scope.$apply();
    };

    $scope.initGraphsDevice = function (countStats) {
      var highlight = "#1ab394";
      $scope.polarDataDevice = [];
      var colors = randomColor({hue: 'random', luminosity: 'light', count: countStats.length});

      for (var i=0;i<countStats.length;i++) {
        var data = {};
        data.value = countStats[i].total;
        data.color = colors[i];
        data.highlight = highlight;
        data.label = countStats[i]._id.channel;
        $scope.polarDataDevice.push(data);
      }
      $scope.$apply();
    };

    $scope.initCrossDomainCounts = function (countStats) {
      var highlight = "#1ab394";
      $scope.polarDataCrossDomain = [];
      $scope.polarDataByDomain = [];
      var colors = randomColor({hue: 'random', luminosity: 'light', count: countStats.length});

      for (var i=0;i<countStats.length;i++) {
        var data = {};
        data.value = countStats[i].total;
        data.color = colors[i];
        data.highlight = highlight;
        data.label = countStats[i]._id.domains;
        if (data.label.indexOf(',')===-1) {
          $scope.polarDataByDomain.push(data);
        } else {
          $scope.polarDataCrossDomain.push(data);
        }
      }
      $scope.$apply();
    };

    $scope.initGraphsIdentified = function (countStats) {
      if (countStats.length>0) {
        $scope.identifiedEventCount = countStats[0].identifiedCount;
        $scope.anonymousEventCount = countStats[0].anonymousCount;
        $scope.$apply();
      }
    };

    $scope.initGraphsIdentifiedSessions = function (countStats) {
      if (countStats.length > 0) {
        $scope.identifiedSessionCount = countStats[0].identifiedCount;
        $scope.anonymousSessionCount = countStats[0].unidentifiedCount;
        $scope.$apply();
      }
    };

    $scope.initSessionsByDomain = function (countStats) {
      $scope.sessionCountByDomain = [];
      if (countStats.length > 0) {
        for (var i=0; i< countStats.length;i++) {
          var obj = {
            domain: countStats[i]._id.domain,
            total: countStats[i].total
          };
          $scope.sessionCountByDomain.push(obj);
        }
        $scope.$apply();
      }
    };

  	function init () {
      var selectedDateRange = {
        startDate : moment().startOf('day'),
        endDate: moment().endOf('day')
      };
      if(moment($scope.dateRange.endDate).diff(moment().endOf('day'))>0) {
        $scope.dateRangeFlag = true;
      }
      if(moment($scope.dateRange.startDate).diff(moment().subtract('months', 3).startOf('day'))<0) {
        $scope.dateRangeFlag = true; 
      }
      if ($scope.dateRangeFlag === true) {
        coContextService.setSelectedDateRange(selectedDateRange);
        $scope.dateRange = coContextService.getSelectedDateRange();
      }

      var dateObj = {
        start: Math.floor($scope.dateRange.startDate.valueOf()/(1000*60*60*24)),
        end: Math.floor($scope.dateRange.endDate.valueOf()/(1000*60*60*24))
      };

      if ($scope.activeTab == '0'|| $scope.activeTab == 0) {
        eventsService.getEventsForProject(coAppContext, $scope.dateRange, $scope.processEvents);
        eventsService.getEventStatsByDevice(coAppContext, dateObj, $scope.initGraphsDevice);
        eventsService.getEventStatsByOs(coAppContext, dateObj, $scope.initGraphsOs);
        eventsService.getIdentifiedEventsCount(coAppContext, dateObj, $scope.initGraphsIdentified);
        eventsService.getCrossDomainEventsCount(coAppContext, dateObj, $scope.initCrossDomainCounts);
      }
      else {
        eventsService.getPageEventsForProject(coAppContext, $scope.dateRange, $scope.processEvents);
        eventsService.getPageEventStatsByDevice(coAppContext, dateObj, $scope.initGraphsDevice);
        eventsService.getPageEventStatsByOs(coAppContext, dateObj, $scope.initGraphsOs);
        eventsService.getIdentifiedPageEventsCount(coAppContext, dateObj, $scope.initGraphsIdentified);
        eventsService.getIdentifiedSessionsCount(coAppContext, dateObj, $scope.initGraphsIdentifiedSessions);
        eventsService.getSessionsCountByDomain(coAppContext, dateObj, $scope.initSessionsByDomain);
        eventsService.getCrossDomainPageEventsCount(coAppContext, dateObj, $scope.initCrossDomainCounts);
      }
  	};

  	init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .factory('eventsService', ["$http", "$q", "coContextService", function ($http, $q, coContextService) {
    var eventsService = {};

    var _sendUrl = function(url, callback) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function(responseData ) {
          callback(responseData);
        },
      });
    };

    eventsService.getEventsForProject = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'eventsByProject?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getEventsOfProfile = function(coAppContext, profileId, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'eventsByProfile?id='+profileId+'&projectId='+projectId;
      _sendUrl(url, callback);
    };

    eventsService.getPageEventsOfProfile = function(coAppContext, profileId, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'pageEventsByProfile?id='+profileId+'&projectId='+projectId;
      _sendUrl(url, callback);
    };

    eventsService.getPageEventsForProject = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'pageEventsByProject?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getEventStatsByDevice = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'eventsCountByDevice?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getEventStatsByOs = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'eventsCountByOs?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getIdentifiedEventsCount = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'identifiedEventsCount?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getCrossDomainEventsCount = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'eventsCountCrossDomain?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getPageEventStatsByDevice = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'pageEventsCountByDevice?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getPageEventStatsByOs = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'pageEventsCountByOs?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getIdentifiedPageEventsCount = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'identifiedPageEventsCount?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getCrossDomainPageEventsCount = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'pageEventsCountCrossDomain?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getIdentifiedSessionsCount = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'identifiedSessionsCount?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };

    eventsService.getSessionsCountByDomain = function(coAppContext, dateRange, callback) {
      var projectId = coAppContext.runningAsUser.projectId;
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'sessionsCountByDomain?projectId='+projectId+'&dateRange='+JSON.stringify(dateRange);
      _sendUrl(url, callback);
    };
    return eventsService;
}]);
'use strict';

angular.module('pushNotificationsApp')
  .controller('EventsByProfileCtrl', ["$scope", "$rootScope", "$state", "$timeout", "$stateParams", "coAppContext", "coContextService", "eventsService", function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, coContextService, eventsService) {
  	$scope.profileId = $stateParams.profileId;

    function _getTimeDifference(time) {
	    var date = new Date(time);
	    var msInMinutes = 1000 * 60;
	    var minutes = ((new Date()).getTime() - date.getTime()) / msInMinutes;
	    var remainingMinutes = minutes - 60*Math.floor(minutes/60);
	    var hours = minutes / 60;
	    var remainingHours = hours - 24*Math.floor(hours/24);
	    var days = hours / 24; 
	    var snippet = ((days > 1) ? (Math.floor(days) + "d "): "") +
	                  ((days > 1 || hours > 1) ? (Math.floor(remainingHours) + "h "): "") +
	                  Math.floor(remainingMinutes) + "m";
	    return snippet;
    };

    function _getTimeStamp(time) {
      var date = new Date(time);
      var t = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        ('0' + date.getHours()).slice(-2),
        ('0' + date.getMinutes()).slice(-2),
        date.getSeconds(),
      ];
      return t[3] + ":" + t[4] + " - " + t[2] + "." + t[1] + "." + t[0]; 
    };

  	$scope.processEvent = function(et) {
    	if (!et.receivedAt) {
      		et.time = (new Date()).toString();
    	}
	    et.timestamp = _getTimeStamp(et.receivedAt);
    	et.timeago = _getTimeDifference(et.receivedAt);
      	if(et.attributes) {
      		var attributes = [];
			for (var k in et.attributes) {
				var attribute = {key: k, value: et.attributes[k]};
				attributes.push(attribute);
			}
			et.attributes = attributes;
		}
    };

  	$scope.processEvents = function (events) {
  		for (var i = 0; i < events.length; i++) {
      		$scope.processEvent(events[i]);
    	}
  		$scope.events = events;
  		$scope.$apply();
  	};

  	function init () {
      eventsService.getEventsOfProfile(coAppContext, $scope.profileId, $scope.processEvents);
  	};

  	init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('PageEventsByProfileCtrl', ["$scope", "$rootScope", "$state", "$timeout", "$stateParams", "coAppContext", "coContextService", "eventsService", function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, coContextService, eventsService) {
  	$scope.profileId = $stateParams.profileId;

    function _getTimeDifference(time) {
	    var date = new Date(time);
	    var msInMinutes = 1000 * 60;
	    var minutes = ((new Date()).getTime() - date.getTime()) / msInMinutes;
	    var remainingMinutes = minutes - 60*Math.floor(minutes/60);
	    var hours = minutes / 60;
	    var remainingHours = hours - 24*Math.floor(hours/24);
	    var days = hours / 24; 
	    var snippet = ((days > 1) ? (Math.floor(days) + "d "): "") +
	                  ((days > 1 || hours > 1) ? (Math.floor(remainingHours) + "h "): "") +
	                  Math.floor(remainingMinutes) + "m";
	    return snippet;
    };

    function _getTimeStamp(time) {
      var date = new Date(time);
      var t = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        ('0' + date.getHours()).slice(-2),
        ('0' + date.getMinutes()).slice(-2),
        date.getSeconds(),
      ];
      return t[3] + ":" + t[4] + " - " + t[2] + "." + t[1] + "." + t[0]; 
    };

  	$scope.processEvent = function(et) {
    	if (!et.receivedAt) {
      		et.time = (new Date()).toString();
    	}
	    et.timestamp = _getTimeStamp(et.receivedAt);
    	et.timeago = _getTimeDifference(et.receivedAt);
      	if(et.attributes) {
      		var attributes = [];
			for (var k in et.attributes) {
				var attribute = {key: k, value: et.attributes[k]};
				attributes.push(attribute);
			}
			et.attributes = attributes;
		}
    };

  	$scope.processEvents = function (events) {
  		for (var i = 0; i < events.length; i++) {
      		$scope.processEvent(events[i]);
    	}
  		$scope.events = events;
  		$scope.$apply();
  	};

  	function init () {
      eventsService.getPageEventsOfProfile(coAppContext, $scope.profileId, $scope.processEvents);
  	};

  	init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('pushApiCtrl',["$scope", "$rootScope", "$modal", "$timeout", "$state", "coAppContext", "pushNotificationsService", "settingsService", "coContextService", "$http", function($scope, $rootScope, $modal, $timeout, 
                                     $state, coAppContext, pushNotificationsService,
                                     settingsService, coContextService, $http) {

    $scope.user_id = coAppContext.runningAsUser.id;
    if (coAppContext.user.isActive != undefined) {
      $scope.isInactive = !coAppContext.user.isActive;
    }

    $scope.tabs = [
      {'title': "Push Notification", 'template': "push-notificationsApp/push-api/tabs/push.html"},
      {'title': "SMS", 'template': "push-notificationsApp/push-api/tabs/sms.html"},
    ];
    $scope.activeTab = 0;

    $scope.selectTab = function(i) {
      $scope.activeTab = i;
    }

    var _processIds = function(ids) {
      var idList = ids.trim().split(',');
      for (var i = 0; i < idList.length; i++) {
        idList[i] = idList[i].trim();
      }
      return idList;
    }

    $scope.processPushNotification = function() {
      $scope.jsonError = null;
      $scope.push_payload.notification = {"delayWhileIdle":false, "data":{}};
      try {
        $scope.push_payload.notification.data = JSON.parse($scope.data.data); 
      } catch (err) {
        $scope.jsonError = JSON.stringify(err);
      }
    }

    $scope.sendPushNotificationviaApi = function(){
      console.log("submitPushNotification");
      $scope.processPushNotification();
      if (!$scope.jsonError) {
        $scope.push_payload.registrationIds = _processIds($scope.data.ids);
        pushNotificationsService.sendPushNotificationviaApi(coAppContext,
                                                            $scope.push_payload,
                                                            _onSendPushSuccess,
                                                            _onSendPushFailure);
      }
    };

    var _onSendPushSuccess = function() {
      $scope.failureMessage = null;
      $scope.successMessage = 'Data List queued for sending';
      $scope.sentData = JSON.stringify($scope.push_payload);
      $scope.$apply();
    };

    var _onSendPushFailure = function() {
      $scope.successMessage = null;
      $scope.failureMessage = 'Error while retrieving data';
      $scope.$apply();
    };

    $scope.sendSmsViaApi = function() {
      console.log($scope.data.numbers);
      $scope.sms_payload.phoneNumbers = _processIds($scope.data.numbers);
      pushNotificationsService.sendSmsApi(coAppContext,
                                          $scope.sms_payload,
                                          _onSendSmsSuccess,
                                          _onSendSmsFailure);
    };

    var _onSendSmsSuccess = function(response) {
      $scope.failureMessage = null;
      $scope.successMessage = 'Success: ' + response;
      $scope.sentData = JSON.stringify($scope.sms_payload);
      $scope.$apply();
    };

    var _onSendSmsFailure = function() {
      $scope.successMessage = null;
      $scope.failureMessage = 'Error while retrieving data';
      $scope.$apply();
    };

    $scope.dbUrl = coAppContext.dburl;
    $scope.projectId = coContextService.getSelectedProjectId();
    $scope.project = coAppContext.projects[0];
    $scope.website = coContextService.getSelectedWebsite();
    $scope.user = coAppContext.user;

    function init() {
      $scope.data = {};
      $scope.data.data = "{}";
      $scope.push_payload = { requestId: "",
                              writeKey: "",
                              notification: "",
                              gcmAPIKey: "",
                              dbname: "",
                              registrationIds: []
                            };

      $scope.sms_payload = { requestId: "",
                             writeKey: "",
                             message: "",
                             apiCredentials: { type: 1 },
                             mask: "",
                             phoneNumbers: []
                           };

      if ($scope.project) {
        $scope.push_payload.writeKey = $scope.project.writeKey;
        $scope.sms_payload.writeKey = $scope.project.writeKey;
      }

      if($scope.project && $scope.project.gcmAPIKey){
        $scope.push_payload.gcmAPIKey = $scope.project.writeKey;
      }

      if($scope.project && ($scope.project.smsGateway.length >0)){
        $scope.sms_payload.apiCredentials.username = $scope.project.smsGateway[0].username;
        $scope.sms_payload.apiCredentials.password = $scope.project.smsGateway[0].password;
      }
    }

    init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('JobStatsCtrl', ["$scope", "$rootScope", "$state", "$modal", "coAppContext", "coContextService", "jobStatsService", function ($scope, $rootScope, $state, $modal, coAppContext,
                                                 coContextService, jobStatsService) {
  	$scope.jobs = [];
  	$scope.writeKey = coContextService.getSelectedProjectWriteKey();

  	$scope.processCount = 0;

  	$scope.populateFields = function (jobObj) {
      var job = jobObj._id;
  		if (job.type) {
  			var types = coAppContext.jobTypes;
	  		for (var i=0;i<types.length;i++) {
	  			if(job.type === types[i].value) {
	  				jobObj.typeText = types[i].name;
	  				break;
	  			}
	  		}
  		}

  		if (job.status) {
	  		var status = coAppContext.jobStatus;
	  		for (var i=0; i<status.length; i++) {
	  			if(job.status === status[i].value) {
	  				jobObj.statusText = status[i].name;
	  				break;
	  			}
	  		}  			
  		}

  		if (job.send_type) {
	  		var sendTypes = coAppContext.sendTypes;
	  		for (var i=0; i<sendTypes.length; i++) {
	  			if(job.send_type === sendTypes[i].value) {
	  				jobObj.sendTypeText = sendTypes[i].name;
	  				break;
	  			}
	  		}
  		}  		
  	};

    $scope.getRegistrationIdStats = function(){
      window.open('http://' + coAppContext.jobHostUrl + 'getRegistrationIdStats?writeKey='+$scope.writeKey);
    }


  	$scope.processJobs = function (jobs) {
  		for (var i=0; i<jobs.length; i++) {
  			$scope.populateFields(jobs[i]);
  			/*if (jobs[i].send_logs && jobs[i].send_logs.length>0 && typeof(jobs[i].send_logs[0])==='object' 
          && !jobs[i].send_logs[0].success) {
  				jobs[i].send_logs[0].success = 0;
  			}
  			if (jobs[i].send_logs && jobs[i].send_logs.length>0 && typeof(jobs[i].send_logs[0])==='object'
          && !jobs[i].send_logs[0].failure) {
  				jobs[i].send_logs[0].failure = 0;
  			}*/  			
  		}
  		$scope.jobs =jobs;
  		$scope.$apply();
  	};

  	function init () {
  		jobStatsService.getAllJobsForProject($scope.writeKey, coAppContext, $scope.processJobs);
  	};
  	init();
  }]);
'use strict';

angular.module('pushNotificationsApp')
  .factory('jobStatsService', ["$http", "$q", function ($http, $q) {
    var jobStatsService = {};

    var _sendUrl = function(url, callback) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function(responseData ) {
          callback(responseData);
        },
      });
    };

    jobStatsService.getAllJobsForProject = function(writeKey, coAppContext, callback) {
      var url = 'http://' + coAppContext.jobHostUrl + 'getJobStatsProject?writeKey='+writeKey;
      _sendUrl(url, callback);
    };

    return jobStatsService;
}]);
'use strict';

angular.module('pushNotificationsApp')
  .controller('html5NotificationListCtrl',["$scope", "$modal", "$timeout", "coAppContext", "coHtml5NotificationService", "coContextService", function($scope, $modal, $timeout,
    coAppContext, coHtml5NotificationService, coContextService) {

    $scope.html5Notifications = [];

    var _onDeleteSuccess = function() {
      alert('Notification deleted successfully.');
      init();
    };

    var _onDeleteFailure = function() {
      alert('Error while deleting notification, please try again later.');
    };

    var _onSendSuccess = function() {
      alert('Notification send request sent successfully!');
    };

    var _onSendFailure = function() {
      alert('Error while pushing notification, please try again later.');
      init();
    };

    $scope.startSending = function(html5Notification) {
      $scope.payload.notification = html5Notification;
      $scope.payload.profileIds = "";
      $scope.payload.propertyId = coContextService.getActivePropertyId();
      $scope.payload.requestId = html5Notification._id;
      console.log($scope.payload);
      console.log("start sending");
      coHtml5NotificationService.sendChromeToAll($scope.appContext,
      $scope.payload, _onSendSuccess, _onSendFailure);
    };

    $scope.checkSendToSegmentOrAll = function(html5Notification){
      if (html5Notification.eventRuleIds && html5Notification.eventRuleIds.length >0) {
        coHtml5NotificationService.startSendingToSegment(coAppContext, html5Notification._id, html5Notification.eventRuleIds[0])
          .then(function() {
                  html5Notification.status = 3;
                  _onSendSuccess();
                },
                _onSendFailure);
      } else {
        coHtml5NotificationService.startSending(coAppContext, html5Notification._id)
          .then(function() {
                  html5Notification.status = 3;
                  _onSendSuccess();
                },
                _onSendFailure);
      }
    }

    $scope.testSend = function(html5Notification) {
      var context = {
        payload : $scope.payload,
        html5Notification: html5Notification,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-test-send-html5-push.html',
        controller: 'TestSendModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.sendToTag = function(html5Notification) {
      var context = {
        payload : $scope.payload,
        html5Notification: html5Notification,
        coAppContext: coAppContext,
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-send-to-tags.html',
        controller: 'SendToTagsModalCtrl',
        resolve : {
          data : function() { return context; }
        },
      });
    };

    $scope.deleteHtml5Notification = function(html5Notification) {
      var deleteContext = {
        title: 'Are you sure you want to delete? All data will be lost and ' +
          'deleting does not stop notifications being sent.',
        button_class: 'btn-danger',
        button_text: 'DELETE',
        action: function() {
          coHtml5NotificationService.deleteEventFunction(coAppContext, html5Notification._id)
          .then(_onDeleteSuccess, _onDeleteFailure);
        },
      };

      $modal.open({
        templateUrl: 'push-notificationsApp/common/modal-action.html',
        controller: 'ModalInstanceCtrl',
        resolve : {
          data : function() { return deleteContext; }
        },
      });

    };

    $scope.processAnalytics = function (analytics){
      $scope.analytics = analytics;
      $scope.askedPermission = 0;
      $scope.grantedPermission = 0;
      $scope.deniedPermission = 0;
      $scope.displayed = 0;
      $scope.clicks = 0;
      for (var i = 0; i < $scope.analytics.length; i++) {
        if ($scope.analytics[i]._id.actionType == 1) {
          $scope.askedPermission = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 2) {
          $scope.grantedPermission = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 3) {
          $scope.deniedPermission = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 6) {
          $scope.views = $scope.analytics[i].count;
        } else if ($scope.analytics[i]._id.actionType == 7 ||
                   $scope.analytics[i]._id.actionType == 8 ||
                   $scope.analytics[i]._id.actionType == 9) {
          $scope.clicks = $scope.analytics[i].count;
        }
        
      }
      // $scope.osPlotdata = {};
      // $scope.browserPlotdata = {};
      // var color = ['#1ab394', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854']
      // for (var key in $scope.analytics) {
      //   var o = 0;
      //   $scope.osPlotdata[key] = {};
      //   if($scope.analytics[key] && $scope.analytics[key].os ){
      //     for (var i = 0; i < $scope.analytics[key].os.length; i++) {
      //       var data = $scope.analytics[key].os[i];
      //       if (!$scope.osPlotdata[key][data.stats.name]) {
      //         $scope.osPlotdata[key][data.stats.name] = { label: data.stats.name, data: data.count, color: color[o]};
      //         o++;
      //       } else {
      //         $scope.osPlotdata[key][data.stats.name].data =  $scope.osPlotdata[key][data.stats.name].data +  data.count;
      //       }
      //     };
      //   }
      //   if($scope.analytics[key] && $scope.analytics[key].browser ){
      //     var b = 0;
      //     $scope.browserPlotdata[key] = {};
      //     for (var i = 0; i < $scope.analytics[key].browser.length; i++) {
      //       var data = $scope.analytics[key].browser[i];
      //       if (!$scope.browserPlotdata[key][data.stats.name]) {
      //         $scope.browserPlotdata[key][data.stats.name] = { label: data.stats.name, data:data.count ,color: color[b]};
      //         b++;
      //       } else {
      //         $scope.browserPlotdata[key][data.stats.name].data = $scope.browserPlotdata[key][data.stats.name].data + data.count;
      //       }
      //     };
      //   }
      // };
      // $scope.plotGraph( $scope.osPlotdata , $scope.browserPlotdata);
    };

    $scope.plotGraph = function (osData, browserData){
      $scope.osPieChartData = {1:[{}],2:[{}],6:[{}]};
      for(var key in osData){
        var tempData = osData[key];
        for (var tea in tempData) {
          $scope.osPieChartData[key].push(tempData[tea]);
        }
      };
      $scope.browserPieChartData = {1:[{}],2:[{}],6:[{}]};
      for(var key in browserData){
        var tempData = browserData[key];
        for (var tea in tempData) {
          $scope.browserPieChartData[key].push(tempData[tea]);
        }
      };
      $scope.pieOptions = {
          series: {
              pie: {
                  show: true
              }
          },
          grid: {
              hoverable: true
          },
          tooltip: true,
          tooltipOpts: {
              cssClass: "flotTip",
              content: "%x", // show percentages, rounding to 2 decimal places"%s | X: %x | Y: %y"
              shifts: {
                  x: 20,
                  y: 0
              },
              defaultTheme: true
          },
          legend : {
            show: true,
            labelFormatter: function(label, series) {
                    var percent= Math.round(series.percent);
                    var number= series.data[0][1]; //kinda weird, but this is what it takes
                    return('&nbsp;<b>'+label+'</b>:&nbsp;'+ percent + '%');
                }
          },
          grid: {
              hoverable: true,
              clickable: true
          }
      };
       // $scope.$apply();
    }

    $scope.processProjectInfo = function(project) {
      $scope.project = project;
      $scope.payload.projectId = project._id;
      $scope.payload.writeKey = project.writeKey;
      $scope.payload.gcmAPIKey = project.gcmAPIKey;
      $scope.payload.follower_emails = project.follower_emails;
    }

    $scope.dbUrl = coAppContext.dburl;
    $scope.projectId = coContextService.getSelectedProjectId();
    $scope.website = coContextService.getSelectedWebsite();
    $scope.user = coAppContext.user;
    $scope.analyticsSummary = {};
    function init() {
      console.log(coContextService.getActivePropertyId());
      $scope.payload = { requestId: "",
                    writeKey: "",
                    notification: {},
                    gcmAPIKey: "",
                    profileIds: [],
                    send_type: Number,
                    propertyId: coContextService.getActivePropertyId(),
                    projectId: '',
                    follower_emails: []
                  };


      coHtml5NotificationService.getHtml5Notifications(coAppContext)
      .then(function(response) {
        $scope.html5Notifications = response.data;
      });
      coHtml5NotificationService.getProject($scope.projectId, $scope.processProjectInfo);

      // coHtml5NotificationService.getAnalyticsSummary(coAppContext)
      // .then(function(response) {
      //   $scope.analyticsSummary = response.data;
      // });

      coHtml5NotificationService.getPermissionAnalytics(coAppContext)
      .then(function(response) {
        $scope.processAnalytics(response.data);
      });
    }


    init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
.controller('ViewHtml5NotificationCtrl', ["$scope", "$state", "$stateParams", "$modal", "$timeout", "coAppContext", "coHtml5NotificationObj", function ($scope, $state,
  $stateParams, $modal, $timeout, coAppContext, coHtml5NotificationObj) {

  // TODO: Need to flesh out the controller as per details required on the
  // screen.

  $scope.html5Notification = {};

  function init() {
    $scope.html5Notification = coHtml5NotificationObj;
  }

  init();
}]);

'use strict';

angular.module('pushNotificationsApp')
.controller('ManageHtml5NotificationCtrl', ["$scope", "$state", "$timeout", "coAppContext", "coHtml5NotificationObj", "coHtml5NotificationService", function ($scope, $state,
  $timeout, coAppContext, coHtml5NotificationObj, coHtml5NotificationService) {

  $scope.html5Notification = {};

  var _onActionSuccess = function() {
    // coHtml5NotificationService.requestCacheUpdate(coAppContext);
    $timeout(function() { $state.go('html5NotificationList'); } , [300]);
  };

  var _onSaveFailure = function() {
    $scope.isSavingInProgress = false;
    alert('Error while saving notification, please try again later.');
  };

  $scope.saveHtml5Notification = function() {
    $scope.isSavingInProgress = true;

    if ($scope.mode === 'create') {
      coHtml5NotificationService.createHtml5Notification(coAppContext,
        $scope.html5Notification)
      .then(_onActionSuccess, _onSaveFailure);
    } else if ($scope.mode === 'edit') {
      coHtml5NotificationService.updateHtml5Notification(coAppContext,
        $scope.html5Notification)
      .then(_onActionSuccess, _onSaveFailure);
    }
  };

  function init() {
    $scope.isSavingInProgress = false;
    $scope.mode = $state.current.data.mode;

    $scope.html5Notification = coHtml5NotificationObj;
    $scope.toggleVar = true;
    $scope.html5Notification.targeting = {};
    $scope.html5Notification.targeting.devices = {};
    $scope.html5Notification.targeting.devices.mobile = true;
    $scope.html5Notification.targeting.devices.desktop = true;
    $scope.html5Notification.targeting.devices.tablet = true;
    coHtml5NotificationService.getAllRulesForWebsite(coAppContext)
      .then(function(rules) {
        $scope.rules = rules;
      });
  }

  init();
}]);

'use strict';

angular.module('pushNotificationsApp')
  .controller('html5NotificationAnalyticsCtrl',["$scope", "$modal", "$timeout", "coAppContext", "$stateParams", "coHtml5NotificationService", function($scope, $modal, $timeout,
    coAppContext, $stateParams, coHtml5NotificationService) {


    $scope.processAnalytics = function (analytics){
      $scope.analytics = analytics;
      $scope.osPlotdata = {};
      $scope.browserPlotdata = {};
      var color = ['#1ab394', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854']
      for (var key in $scope.analytics) {
        var o = 0;
        var b = 0;
        $scope.osPlotdata[key] = {};
        for (var i = 0; i < $scope.analytics[key].os.length; i++) {
          var data = $scope.analytics[key].os[i];
          if (!$scope.osPlotdata[key][data.stats.name]) {
            $scope.osPlotdata[key][data.stats.name] = { label: data.stats.name, data: data.count, color: color[o]};
            o++;
          } else {
            $scope.osPlotdata[key][data.stats.name].data =  $scope.osPlotdata[key][data.stats.name].data +  data.count;
          }
        };
        $scope.browserPlotdata[key] = {};
        for (var i = 0; i < $scope.analytics[key].browser.length; i++) {
          var data = $scope.analytics[key].browser[i];
          if (!$scope.browserPlotdata[key][data.stats.name]) {
            $scope.browserPlotdata[key][data.stats.name] = { label: data.stats.name, data:data.count ,color: color[b]};
            b++;
          } else {
            $scope.browserPlotdata[key][data.stats.name].data = $scope.browserPlotdata[key][data.stats.name].data + data.count;
          }
        };
      };
      $scope.plotGraph( $scope.osPlotdata , $scope.browserPlotdata);
    };

    $scope.plotGraph = function (osData, browserData){
      $scope.osPieChartData = {3:[{}],4:[{}],5:[{}]};
      for(var key in osData){
        var tempData = osData[key];
        for (var tea in tempData) {
          $scope.osPieChartData[key].push(tempData[tea]);
        }
      };
      $scope.browserPieChartData = {3:[{}],4:[{}],5:[{}]};
      for(var key in browserData){
        var tempData = browserData[key];
        for (var tea in tempData) {
          $scope.browserPieChartData[key].push(tempData[tea]);
        }
      };
      $scope.pieOptions = {
          series: {
              pie: {
                  show: true
              }
          },
          grid: {
              hoverable: true
          },
          tooltip: true,
          tooltipOpts: {
              cssClass: "flotTip",
              content: "%x", // show percentages, rounding to 2 decimal places"%s | X: %x | Y: %y"
              shifts: {
                  x: 20,
                  y: 0
              },
              defaultTheme: true
          },
          legend : {
            show: true,
            labelFormatter: function(label, series) {
                    var percent= Math.round(series.percent);
                    var number= series.data[0][1]; //kinda weird, but this is what it takes
                    return('&nbsp;<b>'+label+'</b>:&nbsp;'+ percent + '%');
                }
          },
          grid: {
              hoverable: true,
              clickable: true
          }
      };
       // $scope.$apply();
    }

    function init() {
      $scope.notification_id = $stateParams.html5NotificationId;
      coHtml5NotificationService.getNotificationAnalytics(coAppContext, $scope.notification_id)
      .then(function(response) {
        $scope.processAnalytics(response.data);
      });
    };

    init();
  }]);

'use strict';

angular.module('pushNotificationsApp')
  .factory('coHtml5NotificationService', ["$http", "$q", "coContextService", function ($http, $q, coContextService) {
    var coHtml5NotificationService = {};

    var _httpPromiseBuilder = function(method, url, cacheResults, dataObj) {
      console.log(dataObj);
      var data = JSON.stringify(angular.fromJson(angular.toJson(dataObj)));
      console.log(data);

      method = method || 'GET';
      if (cacheResults !== true) {
        cacheResults = false;
      }
      return $http({
        dataType: 'json',
        cache: cacheResults,
        method: method,
        withCredentials: true,
        url: url,
        data: data,
      });
    };

    var _sendUrl = function(url, callback) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function( responseData ) {
                  callback(responseData);
               },
      });
    };

    coHtml5NotificationService.requestCacheUpdate = function(coAppContext) {
      var projectId = coContextService.getSelectedProjectId();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'cacheUpdate?type=chromeNotifications&projectId=' + projectId;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.startSending = function(coAppContext,
      html5NotificationId) {
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'sendHtml5Push?projectId=' + projectId + '&notificationId=' +
        html5NotificationId + '&writeKey=' + writeKey;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.startSendingToSegment = function(coAppContext,
      html5NotificationId, ruleId) {
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'sendPushChromeNotificationToSegment?projectId=' + projectId + '&notificationId=' +
        html5NotificationId + '&writeKey=' + writeKey + '&ruleId=' + ruleId + '&notificationType=' + 1 ;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.sendTestNotification = function(coAppContext,
      html5NotificationId, userId) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.apiConnectoUrl +
        'sendHtml5Push?projectId=' + projectId + '&profileId=' + userId +
        '&notificationId=' + html5NotificationId + '&writeKey=' + writeKey;
      return _httpPromiseBuilder('GET', url, false);

   };

    coHtml5NotificationService.sendChromeToUserList = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/chrome-push-notification-ui?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    coHtml5NotificationService.sendChromeToTags = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/chrome-push-notification-tag?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    coHtml5NotificationService.sendChromeToAll = function(coAppContext,
                                                           payload,
                                                           onSuccess,
                                                           onFailure) {

      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();
      var url = 'http://' + coAppContext.jobHostUrl +
        'send/chrome-push-notification-all?projectId=' + projectId +
        '&writeKey=' + writeKey;
      var payload = { projectData: payload };
      _httpPromiseBuilder('POST', url, false, payload)
      .then(onSuccess, onFailure);
    };

    coHtml5NotificationService.getNotification = function(coAppContext,
      html5NotificationId) {
      var deferred = $q.defer();

      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/' + html5NotificationId;
      _httpPromiseBuilder('GET', url, false)
      .then(
        function(response) {deferred.resolve(response.data); },
        function(reason) { deferred.reject(reason); }
      );

      return deferred.promise;
    };

    coHtml5NotificationService.createHtml5Notification = function(coAppContext,
      html5Notification) {
      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/';
      return _httpPromiseBuilder('POST', url, false, html5Notification);
    };

    coHtml5NotificationService.updateHtml5Notification = function(coAppContext,
      html5Notification) {
      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/' + html5Notification._id;
      return _httpPromiseBuilder('PUT', url, false, html5Notification);
    };

    coHtml5NotificationService.deleteEventFunction = function(coAppContext,
      html5NotificationId) {
      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/' + html5NotificationId;
      return _httpPromiseBuilder('DELETE', url, false);
    };

    coHtml5NotificationService.getNewNotification = function() {
      var projectId = coContextService.getSelectedProjectId();

      return {
        title: 'New Notification Created on ' + new Date(),
        projectId : projectId,
        details: {
          title: 'Sample Title',
          body: 'Sample message',
          ttl: 1,
        },
        targetUrl: '',
        eventRuleIds :[],
        status: 1,
      };

    };

    coHtml5NotificationService.getHtml5Notifications = function(coAppContext) {
      var dbUrl = coAppContext.dburl;
      var projectId = coContextService.getSelectedProjectId();
      var url = 'http://' + dbUrl + 'api/v1/chromenotifications/?conditions[projectId]=' + projectId;
      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getAnalyticsSummary = function(coAppContext) {
      var eventsUiUrl = coAppContext.eventsUiUrl;
      var projectId = coContextService.getSelectedProjectId();
      var dateRange = coContextService.getSelectedDateRange();

      var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + eventsUiUrl + 'api/html5ActionSummary' + 
        '?conditions[projectId]=' + projectId +
        '&conditions[startHour]=' + startHour +
        '&conditions[endHour]=' + endHour;

      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getNotificationAnalytics = function(coAppContext, notificationId) {
      var eventsUiUrl = coAppContext.eventsUiUrl;
      var projectId = coContextService.getSelectedProjectId();
      var dateRange = coContextService.getSelectedDateRange();

      var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + eventsUiUrl + 'api/html5NotificationActionSummary' + 
        '?conditions[projectId]=' + projectId +
        '&conditions[startHour]=' + startHour +
        '&conditions[endHour]=' + endHour +
        '&conditions[notificationId]=' + notificationId;

      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getPermissionAnalytics = function(coAppContext) {
      var pushUrl = coAppContext.pushHostUrl;
      var projectId = coContextService.getSelectedProjectId();
      var writeKey = coContextService.getSelectedProjectWriteKey();

      // var startHour = DateUtil.getStartOfDayHourFromDate(dateRange.startDate.toDate());
      // var endHour = DateUtil.getEndOfDayHourFromDate(dateRange.endDate.toDate());

      var url = 'http://' + pushUrl + 'getChromePushStats' + 
        '?writeKey=' + writeKey;

      return _httpPromiseBuilder('GET', url, false);
    };

    coHtml5NotificationService.getAllRulesForWebsite = function(coAppContext) {
      var deferred = $q.defer();

      var url = 'http://' + coAppContext.dburl + 'api/v1/rules/?conditions[projectId]=' +  coContextService.getSelectedProjectId();

      $http.get(url, {withCredentials: true})
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(data, status) {
        deferred.reject(status);
      });

      return deferred.promise;
    };

    coHtml5NotificationService.getProject = function (projectId, callback) {
      coContextService.getContext().then(function(context) {
        var dbUrl = context.dburl;
        var url = 'http://' + dbUrl + 'api/v1/projects/'+ projectId;
        _sendUrl(url, callback);
      });
    };

    return coHtml5NotificationService;
  }]);

angular.module('pushNotificationsApp')
  .controller('TagsCtrl', ["$scope", "$rootScope", "$state", "$timeout", "$stateParams", "coAppContext", "tagsService", function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, tagsService) {

  	$scope.processTags = function (response) {
  		$scope.tags = response;
  		$scope.$apply();
  	};

  	function init () {
  		tagsService.getTagsOfProject(coAppContext, $scope.processTags);
  	};
  	init();
}]);
'use strict';

angular.module('pushNotificationsApp')
  .factory('tagsService', ["$http", "$q", function ($http, $q) {
    var tagsService = {};

    var _httpPromiseBuilder = function(method, url, cacheResults, dataObj) {
      var data = JSON.stringify(angular.fromJson(angular.toJson(dataObj)));

      method = method || 'GET';
      if (cacheResults !== true) {
        cacheResults = false;
      }
      return $http({
        dataType: 'json',
        cache: cacheResults,
        method: method,
        withCredentials: true,
        url: url,
        data: data,
      });
    };

    var _sendUrl = function(url, callback) {
      $.ajax({
        dataType: 'json',
        url: url,
        xhrFields: {
          withCredentials: true
        },
        success: function(responseData ) {
          if (callback) {
            callback(responseData);
          }
        },
      });
    };

    tagsService.getTagsOfProject = function (coAppContext, callback) {
      var writeKey = coAppContext.projects[0].writeKey;
      var url = 'http://' + coAppContext.dburl +
       'api/v1/tags/?conditions[writeKey]='+writeKey;
      _sendUrl(url, callback);
    };

    tagsService.getTag = function (id, coAppContext, callback) {
      var url = 'http://' + coAppContext.dburl +'api/v1/tags/'+id;
      _sendUrl(url, callback);
    };

    tagsService.createTag = function(tag, context) {
      var method = 'POST';
      var url = 'http://' + context.apiConnectoUrl + 'createTag';
      return $http({
        url: url,
        method: method,
        contentType: "application/json",
        data: tag,
        withCredentials: true,
      });
    };

    tagsService.saveTag = function(tag, context) {
      var method = (tag._id) ? 'PUT' : 'POST';
      var url = 'http://' + context.dburl + 'api/v1/tags/';
      if (tag._id) {
        url += tag._id;
      }
      return _httpPromiseBuilder(method, url, false, tag);
    };

    tagsService.deleteTag = function(id, coAppContext) {
      var dbUrl = coAppContext.dburl;
      var url = 'http://' + dbUrl + 'api/v1/tags/'+id;
      return _httpPromiseBuilder('DELETE', url, false);
    };

    tagsService.updateTagCache = function(id, updateType, coAppContext) {
      var url = 'http://' + coAppContext.apiConnectoUrl +
       'updateTagCache?id='+id+'&type='+updateType;
      _sendUrl(url); 
    };

    return tagsService;
}]);
angular.module('pushNotificationsApp')
  .controller('CreateEditTagCtrl', ["$scope", "$rootScope", "$state", "$timeout", "$stateParams", "coAppContext", "tagsService", function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, tagsService) {
    $scope.tag = {};
    $scope.submitButtonText = "Create";
    $scope.tagElements = coAppContext.tagElements;
    $scope.tagMatchTypes = coAppContext.tagMatchTypes;
    $scope.tagId = $stateParams.tagId;
    $scope.flag = 0; // used while updating cache based on (PUT/POST) or DELETE
    $scope.propertyNotSelectedFlag = false;

    $scope.createTagSuccess = function (response) {     
      if ($scope.tagId) {
        tagsService.updateTagCache($scope.tagId, $scope.flag, coAppContext);
      } 
      $timeout(function() {$state.go('tags')} , [500]);
    };

    $scope.createTagFailure = function () {
      $scope.submitButtonText = 'Failed, Try Again'
    };

    $scope.submitCreateTagRequest = function () {
      $scope.tag.writeKey = coAppContext.projects[0].writeKey;
      $scope.tag.site = coAppContext.websites[0];

      if (!$scope.tag.propertyId) {
        $scope.propertyNotSelectedFlag = true;
      } else {
        $scope.propertyNotSelectedFlag = false;
      }
      var props = $scope.properties;
      if (props.length>0) {
        for (var i=0;i<props.length;i++) {
          if ($scope.tag.propertyId==props[i]._id) {
            $scope.tag.domain = props[i].domain;
          }
        }
      }
      if ($scope.tag.tags) {
        var tags = $scope.tag.tags.split(',');
        $scope.tag.tags = tags;
      }

      if ($scope.propertyNotSelectedFlag == true) {
        $scope.createTagFailure();
      } else {
        if ($scope.tagId) {
          tagsService.saveTag($scope.tag, coAppContext)
          .then($scope.createTagSuccess, $scope.createTagFailure);
        } else {
          tagsService.createTag($scope.tag, coAppContext)
          .then($scope.createTagSuccess, $scope.createTagFailure);
        }
      }
    };

    $scope.processTag = function (response) {
      $scope.tag = response;
      var stringifiedTags = '';
      if (response.tags && response.tags.length>0) {
        for (var i=0;i<response.tags.length;i++) {
          stringifiedTags+=response.tags[i];
          if (i!==response.tags.length-1) {
            stringifiedTags+=',';
          }
        }
      }
      $scope.tag.tags = stringifiedTags;
      $scope.$apply();
    };

    $scope.deleteTag = function (id) {
      $scope.flag = 1;
      tagsService.deleteTag(id, coAppContext)
        .then($scope.createTagSuccess);
    };

  	function init () {
      if ($scope.tagId) {
        $scope.submitButtonText = 'Submit';
        tagsService.getTag($scope.tagId, coAppContext, $scope.processTag);
      }
      $scope.properties = coAppContext.projects[0].properties;
  	};
  	init();
}]);
(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('chrome-notifications-list/chrome-notifications-list.html',
    '<div class="row" style="margin-top:10px"><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Sent</span><h5>Notification Sent</h5></div><div class="ibox-content"><h1 class="no-margins">{{analyticsSummary.totalIds | number:0}}</h1></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Success</span><h5>Notification Sent Success</h5></div><div class="ibox-content"><h1 class="no-margins">{{analyticsSummary.success | number:0}}</h1></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Sent</span><h5>Notification Sent Failure</h5></div><div class="ibox-content"><h1 class="no-margins">{{analyticsSummary.failure | number:0}}</h1></div></div></div></div><div class="row"><div class="col-lg-12"><div class="animated fadeInUp"><div class="ibox"><div class="ibox-title" style="border:none;margin-top: 10px;padding-top: 10px;margin-bottom: 10px;height:62px;"><div class="col-md-3 pull-right"><a ui-sref="create-push" style="margin-bottom:10px"><button class="btn btn-danger dim btn-small-dim" type="button" style="margin-right: 0;float: right;padding-right: 10px;"><i class="fa fa-plus"></i> Create New Push Notification</button></a></div></div><div class="ibox-content"><div class="row m-b-sm m-t-sm"><div class="col-md-3"><button type="button" id="loading-example-btn" class="btn btn-white btn-sm" ng-click="showActiveOrAll()"><i class="fa fa-heart"></i> {{activeOrAll}}</button></div><div class="col-md-offset-3 col-md-6"><div class="input-group" style="padding-right:10px;"><input type="text" placeholder="Search" class="input-sm form-control" ng-model="searchText"> <span class="input-group-btn"><button type="button" class="btn btn-sm btn-primary">Search</button></span></div></div></div><div class="project-list"><table class="table table-hover"><thead><tr><th>Status</th><th>Notification Title</th><th>Sent</th><th>Displayed</th><th></th><th>Options</th><th class="project-actions">Action</th></tr></thead><tbody><tr ng-repeat="notification in pushNotifications | filter:searchText | filter:activeOnlyOrAll | orderBy: \'-_id\'"><td class="project-title"><button class="btn btn-success btn-sm" ng-click="startSending(notification)">Send Now</button> <span ng-show="notification.status===2" class="label label-warn">Sending...</span> <span ng-show="notification.status===3" class="label label-primary">Sent</span></td><td class="project-title"><a class="title-class" ui-sref="notificationDetail({notificationId : notification._id})">{{notification.title}}</a><br><small>Created {{getTimeStampFromId(notification._id)}}</small> <span ng-show="notification.productType == 2" class="label label-info">Has Form</span></td><td class="project-title">{{analyticsSummary[notification._id].sent}}</td><td class="project-title">{{analyticsSummary[notification._id].displayed}}</td><td class="project-actions"><button class="btn btn-link" ng-click="testSend(notification)">Test Send</button> <button class="btn btn-link" ng-click="sentToUserList(notification)">Send to User List</button> <button class="btn btn-link" ng-click="sendViaMongoUrl(notification)">Send via MongoDB</button></td><td class="project-actions"><div class="input-group-btn" dropdown="" style="width:100%; float:right;"><a tabindex="-1" class="btn btn-success btn-sm" type="button" ui-sref="edit-push({pushNotificationId: notification._id})"><i class="fa fa-pencil">&nbsp;Edit</i></a> <button class="btn btn-success btn-sm dropdown-toggle" type="button"><span class="caret"></span></button><ul class="dropdown-menu" style="width:100%; min-width:10px;"><li><a ng-click="switchToClone(notification)" class="btn btn-sm"><i class="fa fa-fw fa-copy fa-sm">&nbsp;Clone</i></a></li><li><a ng-click="deleteNotification(notification)" class="btn btn-sm"><i class="fa fa-fw fa-trash fa-sm">&nbsp;Delete</i></a></li><li ng-hide="notification.isActive"><a ng-click="activateNotification(notification)" class="btn btn-sm"><i class="fa fa-fw fa-power-off fa-sm">&nbsp;Activate</i></a></li><li ng-show="notification.isActive"><a ng-click="deactivateNotification(notification)" class="btn btn-sm"><i class="fa fa-fw fa-power-off fa-sm">&nbsp;Deactivate</i></a></li></ul><a ui-sref="notificationDetail({notificationId : notification._id})" style="margin-left: 5px;"><button type="button" class="btn btn-link btn-sm">View Report</button></a></div></td></tr></tbody></table></div></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/breadcrumbs.html',
    '<div class="row white-bg" id="breadcrumb-row" ng-show="$root.showBreadcrumbsRow"><div class="col-xs-6"><ol class="breadcrumb"><li ng-repeat="breadcrumb in $root.breadcrumbs" ng-class="{active: $last}"><a ui-sref="{{breadcrumb.state}}" ng-if="breadcrumb.state">{{breadcrumb.text}}</a> <span ng-if="!breadcrumb.state">{{breadcrumb.text}}</span></li></ol></div><div class="col-xs-6"><div class="pull-right text-success" id="top-bar-daterange-picker" opens="right"><i class="fa fa-calendar"></i> <input type="daterange" ng-model="dateRange" ng-change="changeDateRange(dateRange)" ranges="ranges"> <span class="caret"></span></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/ibox_tools.html',
    '<div class="ibox-tools dropdown"><a ng-click="showhide()"><i class="fa fa-chevron-up"></i></a></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-action.html',
    '<div class="modal-body"><div class="ibox-content"><h4><strong>{{data.title}}</strong></h4></div></div><div class="modal-footer"><button type="button" class="btn btn-primary {{data.button_class_class_class_class_class_class_class_class}}" ng-click="data.action();cancel()">{{data.button_text}}</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-send-push-via-mongodb.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Send to user list - {{pushNotification.title}}</strong></h3><hr><div class="row"><div class="col-md-4 text-right"><small>User Name</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.user"></div></div><div class="row"><div class="col-md-4 text-right"><small>Password</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.pass"></div></div><div class="row"><div class="col-md-4 text-right"><small>Host</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.host"></div></div><div class="row"><div class="col-md-4 text-right"><small>Port</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.port"></div></div><div class="row"><div class="col-md-4 text-right"><small>DB Name</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.dbname"></div></div><div class="row"><div class="col-md-4 text-right"><small>Collection Name</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="auth.collection"></div></div><div class="alert alert-success" ng-show="successMessage">{{successMessage}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendPushViaMongo()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-send-to-tags.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Send to Tags - {{pushNotification.title}}</strong></h3><hr><div class="row"><h4>Comma separated list of tags to send notification to:</h4></div><div class="row"><div class="col-md-4 text-right"><small>Case sensitive</small></div><div class="col-md-8"><textarea class="form-control" ng-model="tags">\n' +
    '      </textarea></div></div><div class="alert alert-success" ng-show="successMessage">{{successMessage}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" ng-hide="pushNotification" class="btn btn-primary" ng-click="sendHtml5()">Send</button> <button type="button" ng-show="pushNotification" class="btn btn-primary" ng-click="sendPush()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-test-send-html5-push.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Test Sending {{html5Notification.title}}</strong></h3><hr><div class="row"><h4>Choose user to test send the notification to:</h4></div><div class="row"><div class="col-md-4 text-right"><strong>User Profile Id:</strong></div><div class="col-md-8"><input type="text" class="form-control" ng-model="profileIds"></div></div><div class="alert alert-success" ng-show="successMessage">{{successMessage}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendTest()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/modal-test-send-push.html',
    '<div class="modal-body"><div class="ibox-content"><h3><strong>Test Sending {{pushNotification.title}}</strong></h3><hr><div class="row"><h4>Choose user to test send the notification to:</h4></div><div class="row"><div class="col-md-4 text-right"><strong>User Profile Id:</strong></div><div class="col-md-8"><input type="text" class="form-control" ng-model="userId"></div></div><div class="alert alert-success" ng-show="successMessage">{{successMessage}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendTest()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/events-profile.html',
    '<div class="wrapper wrapper-content"><div class="row"><div class="col-sm-12"><div class="panel"><div class="panel-heading"><div class="panel-options"><ul class="nav nav-tabs"><li ng-repeat="tab in tabs" ng-class="{\'active\': activeTab==$index}"><a data-toggle="tab" ng-click="selectTab($index)">{{tab.title}}</a></li></ul></div></div><div class="panel-body"><div class="tab-content"><div ng-repeat="tab in tabs" id="tab-{{$index}}" class="tab-pane" ng-class="{\'active\': activeTab==$index}"><div ng-include="tab.template"></div></div></div></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/events-project.html',
    '<div class="wrapper wrapper-content"><div class="row"><div class="col-sm-12"><div class="panel"><div class="panel-heading"><div class="panel-options"><ul class="nav nav-tabs"><li ng-repeat="tab in tabs" ng-class="{\'active\': activeTab==$index}"><a data-toggle="tab" ng-click="selectTab($index)">{{tab.title}}</a></li></ul></div></div><div class="panel-body"><div class="tab-content"><div ng-repeat="tab in tabs" id="tab-{{$index}}" class="tab-pane" ng-class="{\'active\': activeTab==$index}"><div ng-include="tab.template"></div></div></div></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/profile-events.html',
    '<div class="row"><div class="wrapper wrapper-content"><div class="col-lg-8" id="real_events"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Latest Events of profile {{profileId}}</h5></div><div class="ibox-content inspinia-timeline"><div class="timeline-item" ng-repeat="event in events"><div class="row"><div class="col-xs-4 date" style="width:33%;"><i style="width:70px;"><span class="label label-warning">{{event.eventType | uppercase}}</span></i><br>At {{event.timestamp}}<br><small class="text-navy">{{event.timeago}} ago</small></div><div class="col-xs-8 content"><div class="media-body fadeInUpBig" ng-class="{\'animated\' : $first}"><strong class="text-info" ui-sref="event_profiles({eventText: event.text})">{{event.text}}</strong> by user <strong><span>{{event.profileId}}</span></strong>.<br>on <strong>{{event.channel}}</strong> from <strong>{{event.osName}}</strong><br><br><div ng-repeat="attribute in event.attributes"><a class="btn btn-xs btn-white">&nbsp;{{attribute.key}}&nbsp;:&nbsp;{{attribute.value}}&nbsp;</a></div></div></div></div></div></div></div></div></div></div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html5-notification/html5-notification-analytics.html',
    '<div class="row"><div class="col-lg-12"><div class="ibox float-e-margins"><div class="ibox-title"><h3>Notification Display</h3></div></div></div><div class="col-lg-6" ng-show="osPieChartData[3]"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Os Distribution</h5><div ibox-tools=""></div></div><div class="ibox-content"><div class="flot-chart"><div flot="" class="flot-chart-content" dataset="osPieChartData[3]" options="pieOptions"></div></div></div></div></div><div class="col-lg-6" ng-show="browserPieChartData[3]"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Browser Distribution</h5><div ibox-tools=""></div></div><div class="ibox-content"><div class="flot-chart"><div flot="" class="flot-chart-content" dataset="browserPieChartData[3]" options="pieOptions"></div></div></div></div></div><div class="col-lg-12"><div class="ibox float-e-margins"><div class="ibox-title"><h3>Notification Clicked</h3></div></div></div><div class="col-lg-6" ng-show="osPieChartData[4]"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Os Distribution</h5><div ibox-tools=""></div></div><div class="ibox-content"><div class="flot-chart"><div flot="" class="flot-chart-content" dataset="osPieChartData[4]" options="pieOptions"></div></div></div></div></div><div class="col-lg-6" ng-show="browserPieChartData[4]"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Browser Distribution</h5><div ibox-tools=""></div></div><div class="ibox-content"><div class="flot-chart"><div flot="" class="flot-chart-content" dataset="browserPieChartData[4]" options="pieOptions"></div></div></div></div></div><div class="col-lg-12"><div class="ibox float-e-margins"><div class="ibox-title"><h3>Notification Clicked</h3></div></div></div><div class="col-lg-6" ng-show="osPieChartData[5]"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Os Distribution</h5><div ibox-tools=""></div></div><div class="ibox-content"><div class="flot-chart"><div flot="" class="flot-chart-content" dataset="osPieChartData[5]" options="pieOptions"></div></div></div></div></div><div class="col-lg-6" ng-show="browserPieChartData[5]"><div class="ibox float-e-margins"><div class="ibox-title"><h5>Browser Distribution</h5><div ibox-tools=""></div></div><div class="ibox-content"><div class="flot-chart"><div flot="" class="flot-chart-content" dataset="browserPieChartData[5]" options="pieOptions"></div></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html5-notification/html5-notification-list.html',
    '<div class="row" style="margin-top:10px"><div class="col-sm-6 col-lg-3"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Granted</span><h5>New Subscribers</h5></div><div class="ibox-content"><h1 class="no-margins">{{grantedPermission | number:0}}</h1><div class="stat-percent font-bold text-navy">{{grantedPermission * 100 / askedPermission | number:2}}%</div></div></div></div><div class="col-sm-6 col-lg-3"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-danger pull-right">Denied</span><h5>Permission Denied</h5></div><div class="ibox-content"><h1 class="no-margins">{{deniedPermission | number:0}}</h1><div class="stat-percent font-bold text-navy">{{deniedPermission * 100 / askedPermission | number:2}}%</div></div></div></div><div class="col-sm-6 col-lg-3"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Views</span><h5>Notification Views</h5></div><div class="ibox-content"><h1 class="no-margins">{{views | number:0}}</h1></div></div></div><div class="col-sm-6 col-lg-3"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-primary pull-right">Clicks</span><h5>Notification Clicks</h5></div><div class="ibox-content"><h1 class="no-margins">{{clicks | number:0}}</h1></div></div></div></div><div class="row"><div class="col-lg-12"><div class="wrapper animated fadeInUp"><div class="ibox"><div class="ibox-title"><h5>HTML5 Notifications</h5><a class="pull-right" href="http://www.connecto.io/kb/knwbase/connecto-getting-started-with-html5-chrome-push-notifications/" target="_blank">Getting Started Instructions</a></div><div class="ibox-content"><button class="btn m-b btn-md btn-primary" ui-sref="createHtml5Notification">+ Add New HTML5 Notification</button><div class="project-list"><table class="table table-hover"><thead><tr><th>Status</th><th>Notification Title</th><th>Views</th><th>Clicks</th><th></th><th class="project-actions">Action</th></tr></thead><tbody><tr ng-repeat="notification in html5Notifications | orderBy: \'-_id\'"><td class="project-title"><button class="btn btn-success btn-sm" ng-click="startSending(notification)">Send Now</button></td><td class="project-title">{{notification.name}}</td><td class="project-title">{{analyticsSummary[notification._id].views}}</td><td class="project-title">{{analyticsSummary[notification._id].clicks}}</td><td class="project-actions"><button class="btn btn-link" ng-click="testSend(notification)">Test Send</button><br><button class="btn btn-link" ng-click="sendToTag(notification)">Send to Tags</button></td><td class="project-actions"><div class="input-group-btn" dropdown="" style="width:100%; float:right;"><a tabindex="-1" class="btn btn-success btn-sm" type="button" ui-sref="editHtml5Notification({html5NotificationId: notification._id})"><i class="fa fa-pencil">&nbsp;Edit</i></a> <button class="btn btn-success btn-sm dropdown-toggle" type="button"><span class="caret"></span></button><ul class="dropdown-menu" style="width:100%; min-width:10px;"><li><a ng-click="deleteHtml5Notification(notification)" class="btn btn-sm"><i class="fa fa-fw fa-trash fa-sm">&nbsp;Delete</i></a></li></ul></div></td></tr></tbody></table></div></div></div></div></div></div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('html5-notification/html5-notification-view.html',
    '<div class="row"><div class="col-md-12"><h2>Not yet ready!!!</h2></div></div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('main/main.html',
    '<div id="wrapper"><div ng-include="\'push-notificationsApp/left-nav/left-nav.html\'"></div><div id="page-wrapper" class="gray-bg"><div ng-include="\'push-notificationsApp/common/navbar/navbar.html\'"></div><div ng-include="\'push-notificationsApp/common/breadcrumbs.html\'"></div><div ui-view="" class="page-heading"></div></div><div id="common-create-button"><button class="btn btn-danger btn-lg btn-circle" type="button" ui-sref="{{createStateUrl}}" ng-show="$root.showCreateButton && createStateUrl"><i class="fa fa-plus"></i></button></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('push-api/api.html',
    '<div class="wrapper wrapper-content"><div class="row"><div class="col-sm-12"><div class="panel"><div class="panel-heading"><div class="panel-options"><ul class="nav nav-tabs"><li ng-repeat="tab in tabs" ng-class="{\'active\': activeTab==$index}"><a data-toggle="tab" ng-click="selectTab($index)">{{tab.title}}</a></li></ul></div></div><div class="panel-body"><div class="tab-content"><div ng-repeat="tab in tabs" id="tab-{{$index}}" class="tab-pane" ng-class="{\'active\': activeTab==$index}"><div ng-include="tab.template"></div></div></div></div></div></div></div></div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('push-notifications-list/push-notifications-list.html',
    '<div class="row" style="margin-top:10px"><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Sent</span><h5>Notification Sent</h5></div><div class="ibox-content"><h1 class="no-margins">{{analyticsSummary.totalIds | number:0}}</h1></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Success</span><h5>Notification Sent Success</h5></div><div class="ibox-content"><h1 class="no-margins">{{analyticsSummary.success | number:0}}</h1></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><span class="label label-success pull-right">Sent</span><h5>Notification Sent Failure</h5></div><div class="ibox-content"><h1 class="no-margins">{{analyticsSummary.failure | number:0}}</h1></div></div></div></div><div class="row"><div class="col-lg-12"><div class="animated fadeInUp"><div class="ibox"><div class="ibox-title" style="border:none;margin-top: 10px;padding-top: 10px;margin-bottom: 10px;height:62px;"><div class="col-md-3 pull-right"><a ui-sref="create-push" style="margin-bottom:10px"><button class="btn btn-danger dim btn-small-dim" type="button" style="margin-right: 0;float: right;padding-right: 10px;"><i class="fa fa-plus"></i> Create New Push Notification</button></a></div></div><div class="ibox-content"><div class="row m-b-sm m-t-sm"><div class="col-md-3"><button type="button" id="loading-example-btn" class="btn btn-white btn-sm" ng-click="showActiveOrAll()"><i class="fa fa-heart"></i> {{activeOrAll}}</button></div><div class="col-md-offset-3 col-md-6"><div class="input-group" style="padding-right:10px;"><input type="text" placeholder="Search" class="input-sm form-control" ng-model="searchText"> <span class="input-group-btn"><button type="button" class="btn btn-sm btn-primary">Search</button></span></div></div></div><div class="project-list"><table class="table table-hover"><thead><tr><th>Status</th><th>Notification Title</th><th>Sent</th><th>Displayed</th><th>Send to</th><th>Options</th><th class="project-actions">Action</th></tr></thead><tbody><tr ng-repeat="notification in pushNotifications | filter:searchText | filter:activeOnlyOrAll | orderBy: \'-_id\'"><td class="project-title"><button class="btn btn-success btn-sm" ng-click="startSending(notification)">Send Now</button> <span ng-show="notification.status===2" class="label label-warn">Sending...</span> <span ng-show="notification.status===3" class="label label-primary">Sent</span></td><td class="project-title"><a class="title-class" ui-sref="notificationDetail({notificationId : notification._id})">{{notification.title}}</a><br><small>Created {{getTimeStampFromId(notification._id)}}</small> <span ng-show="notification.productType == 2" class="label label-info">Has Form</span></td><td class="project-title">{{analyticsSummary[notification._id].sent}}</td><td class="project-title">{{analyticsSummary[notification._id].displayed}}</td><td class="project-actions"><button class="btn btn-link" ng-click="testSend(notification)">Test Send</button><br><button class="btn btn-link" ng-click="sentToUserList(notification)">User List</button><br><button class="btn btn-link" ng-click="sendViaMongoUrl(notification)">MongoDB</button><br><button class="btn btn-link" ng-click="sendToTags(notification)">Tags</button></td><td class="project-actions"><div class="input-group-btn" dropdown="" style="width:100%; float:right;"><a tabindex="-1" class="btn btn-success btn-sm" type="button" ui-sref="edit-push({pushNotificationId: notification._id})"><i class="fa fa-pencil">&nbsp;Edit</i></a> <button class="btn btn-success btn-sm dropdown-toggle" type="button"><span class="caret"></span></button><ul class="dropdown-menu" style="width:100%; min-width:10px;"><li><a ng-click="switchToClone(notification)" class="btn btn-sm"><i class="fa fa-fw fa-copy fa-sm">&nbsp;Clone</i></a></li><li><a ng-click="deleteNotification(notification)" class="btn btn-sm"><i class="fa fa-fw fa-trash fa-sm">&nbsp;Delete</i></a></li><li ng-hide="notification.isActive"><a ng-click="activateNotification(notification)" class="btn btn-sm"><i class="fa fa-fw fa-power-off fa-sm">&nbsp;Activate</i></a></li><li ng-show="notification.isActive"><a ng-click="deactivateNotification(notification)" class="btn btn-sm"><i class="fa fa-fw fa-power-off fa-sm">&nbsp;Deactivate</i></a></li></ul></div></td><td><a ui-sref="notificationDetail({notificationId : notification._id})" style="margin-left: 5px;"><button type="button" class="btn btn-link btn-sm">View Report</button></a></td></tr></tbody></table></div></div></div></div></div></div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/navbar/navbar.html',
    '<nav class="navbar navbar-fixed-top" role="navigation" style="margin-bottom: 0"><ul class="nav navbar-top-links pull-left" style="line-height: 60px;height: 60px;margin-left: 10px" id="connecto-product-icons" ng-show="isAdminUser || isEventsUser"><li><a id="web_widgets_dashboard" href="/n/app"><button class="btn btn-circle" type="button" tooltip="Web Widgets" ng-class="(applicationName == \'connectoApp\') ? \'btn-primary\' : \'btn-default btn-outline\'" href="/n/app"><i class="fa fa-globe"></i> <span class="product-name">Web Widgets</span></button></a></li><li><a id="events_dashboard" href="/n/events"><button class="btn btn-circle" type="button" tooltip="Events" ng-class="(applicationName == \'eventsApp\') ? \'btn-primary\' : \'btn-default btn-outline\'" href="/n/events"><i class="fa fa-bar-chart"></i> <span class="product-name">Events</span></button></a></li><li><a id="email_dashboard" href="/n/emails"><button class="btn btn-circle" type="button" tooltip="Emails" ng-class="(applicationName == \'emailsApp\') ? \'btn-primary\' : \'btn-default btn-outline\'" href="/n/emails"><i class="fa fa-envelope"></i> <span class="product-name">Emails</span></button></a></li><li><a id="mobile_dashboard" href="/n/push_notifications"><button class="btn btn-circle" type="button" tooltip="Mobile Push Notifications" ng-class="(applicationName == \'pushNotificationsApp\') ? \'btn-primary\' : \'btn-default btn-outline\'" href="/n/push_notifications"><i class="fa fa-mobile"></i> <span class="product-name">Mobile Push</span></button></a></li><li><a id="chrome_dashboard" href="/n/html5_notifications"><button class="btn btn-circle" type="button" tooltip="HTML5 Notifications" ng-class="(applicationName == \'html5NotificationsApp\') ? \'btn-primary\' : \'btn-default btn-outline\'" ng-href="/n/html5_notifications"><i class="fa fa-html5"></i> <span class="product-name">HTML5 Notifications</span></button></a></li></ul><ul class="nav navbar-top-links pull-left" style="line-height: 60px;height: 60px;margin-left: 10px" id="connecto-product-icons" ng-show="!isAdminUser && applicationName == \'connectoApp\' && surveysEnabled"><li><a id="surveys_dashboard" href="/s"><button class="btn btn-circle btn-primary" type="button" tooltip="Connecto Surveys" ng-href="/s"><i class="fa fa-check-square-o"></i> <span class="product-name">Surveys</span></button></a></li></ul><ul class="nav navbar-top-links pull-right" style="margin-right: -11px;"><li class="btn-group dropdown"><a class="dropdown-toggle" id="runningAsUserDropdown" data-toggle="dropdown" aria-expanded="true"><span class="text-success">{{appContext.runningAsUser.name}} <i class="fa fa-user" style="margin-left:5px;"></i> <span class="caret"></span></span></a><ul class="dropdown-menu" style="overflow: hidden;max-height: 400px;right: 0;left: auto;min-width:180px" aria-labelledby="runningAsUserDropdown"><li ng-hide="appContext.allUsers.length == 1" style="max-height:320px; overflow-x:hidden;overflow-y:auto;padding-bottom:10px;"><ul style="padding:0; margin:0"><li ng-click="$event.stopPropagation();" style="margin:0 0 5px 0; padding:0;"><input type="text" ng-model="runningAsListFilterText" placeholder="Type to filter user list" style="border-top:0; border-left:0; border-right:0; border-bottom: 1px solid #d3d3d3;padding: 5px 10px;margin: 0;width: 100%;height: 32px;line-height:24px"></li><li ng-repeat="profile in appContext.allUsers | filter:runningAsListFilterText | orderBy: \'name\'"><a href="/n/user/{{profile.id}}" class="name">{{profile.name}}</a></li></ul></li><li class="divider" ng-hide="appContext.allUsers.length == 1"></li><li><a href="{{dbUrl}}/accounts/logout/?next=/n/"><i class="fa fa-sign-out"></i> Log out</a></li></ul></li></ul><ul class="nav navbar-top-links pull-right" ng-show="applicationName == \'connectoApp\'"><li class="btn-group dropdown"><a class="dropdown-toggle" id="websiteDropdown" data-toggle="dropdown" aria-expanded="true"><span class="text-success">{{selectedWebsite}} <i class="fa fa-globe" style="margin-left:5px;"></i> <span class="caret"></span></span></a><ul class="dropdown-menu" style="overflow: hidden;max-height: 400px;right: 0;left: auto;min-width:180px" aria-labelledby="websiteDropdown"><li ng-hide="appContext.websites.length == 1" style="max-height:320px; overflow-x:hidden;overflow-y:auto;padding-bottom:10px;"><ul style="padding:0; margin:0"><li ng-click="$event.stopPropagation();" style="margin:0 0 5px 0; padding:0;"><input type="text" ng-model="websiteListFilterText" placeholder="Type to filter website list" style="border-top:0; border-left:0; border-right:0; border-bottom: 1px solid #d3d3d3;padding: 5px 10px;margin: 0;width: 100%;height: 32px;line-height:24px"></li><li ng-repeat="website in appContext.websites | filter:websiteListFilterText | orderBy: \'name\'"><a ng-click="changeSelectedWebsite(website)" href="javascript:void(0)">{{website}}</a></li></ul></li></ul></li></ul></nav>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/tabs/events.html',
    '<style type="text/css">\n' +
    '    .explain {\n' +
    '    border: 1px solid #536571;\n' +
    '    width: 300px;\n' +
    '    background-color: rgba(27, 20, 20, 0);\n' +
    '    border-radius: 4px;\n' +
    '    height: auto;\n' +
    '    color: #ffffff;\n' +
    '    position: absolute;\n' +
    '    padding: 6px 6px 6px 6px;\n' +
    '    margin-top: 22px;\n' +
    '    margin-left: 20px;\n' +
    '    background-color: #536571;\n' +
    '    z-index: 199999999;\n' +
    '  }\n' +
    '</style><div class="row"><div class="wrapper wrapper-content"><div class="alert alert-warning" ng-show="dateRangeFlag"><strong>Attention!</strong> Please specify a date range within the last 3 months.</div><div class="col-lg-12"><div class="row"><div class="col-sm-6 col-lg-6"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var1=true" ng-mouseleave="var1=false">Identified Events</span></h5><span class="explain" ng-show="var1">Number of events from identified users in the specified timeframe</span></div><div class="ibox-content"><h1 class="no-margins">{{identifiedEventCount | number:0}}</h1></div></div></div><div class="col-sm-6 col-lg-6"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var2=true" ng-mouseleave="var2=false">Anonymous Events</span></h5><span class="explain" ng-show="var2">Number of events from anonymous users in the specified timeframe</span></div><div class="ibox-content"><h1 class="no-margins">{{anonymousEventCount | number:0}}</h1></div></div></div><div class="col-sm-6 col-lg-6"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var4=true" ng-mouseleave="var4=false">Events By Device</span></h5><span class="explain" ng-show="var4">Number of events from different devices</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>Device</th><th>Count</th></tr></thead><tbody><tr ng-repeat="data in polarDataDevice"><td>{{data.label}}</td><td class="text-navy">{{data.value}}</td></tr></tbody></table></div></div></div><div class="col-sm-6 col-lg-6"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var5=true" ng-mouseleave="var5=false">Events By OS</span></h5><span class="explain" ng-show="var5">Number of events from different operating systems (displaying only top 5 counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>OS</th><th>Count</th></tr></thead><tbody><tr ng-repeat="data in polarDataOs"><td>{{data.label}}</td><td class="text-navy">{{data.value}}</td></tr></tbody></table></div></div></div><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var6=true" ng-mouseleave="var6=false">Events across domains</span></h5><span class="explain" ng-show="var6">Common visitors across domains (displaying only top 20 counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>Domain</th><th>Count</th></tr></thead><tbody><tr ng-repeat="data in polarDataCrossDomain"><td>{{data.label}}</td><td class="text-navy">{{data.value}}</td></tr></tbody></table></div></div><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var7=true" ng-mouseleave="var7=false">Events By Device</span></h5><span class="explain" ng-show="var7">Graphical representation of events from different devices</span><div ibox-tools=""></div></div><div class="ibox-content"><div><canvas polarchart="" options="polarOptions" data="polarDataDevice" height="140" legend="true" responsive="true"></canvas></div></div></div><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var8=true" ng-mouseleave="var8=false">Events By OS</span></h5><span class="explain" ng-show="var8">Graphical representation of events from different operating systems(displaying only top 5 counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><div><canvas polarchart="" options="polarOptions" data="polarDataOs" height="140" legend="true" responsive="true"></canvas></div></div></div><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var9=true" ng-mouseleave="var9=false">Events across domains</span></h5><span class="explain" ng-show="var9">Graphical representation of common visitors across domains (displaying only top 20 counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><div><canvas polarchart="" options="polarOptions" data="polarDataCrossDomain" height="140" legend="true" responsive="true"></canvas></div></div></div></div></div><div class="col-lg-8" id="real_events"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var10=true" ng-mouseleave="var10=false">Sample Events</span></h5><span class="explain" ng-show="var10">sample events in the last 24 hrs</span></div><div class="ibox-content inspinia-timeline"><div class="timeline-item" ng-repeat="event in events"><div class="row"><div class="col-xs-4 date" style="width:33%;"><i style="width:70px;"><span class="label label-warning">{{event.eventType | uppercase}}</span></i><br>At {{event.timestamp}}<br><small class="text-navy">{{event.timeago}} ago</small></div><div class="col-xs-8 content"><div class="media-body fadeInUpBig" ng-class="{\'animated\' : $first}"><strong class="text-info" ui-sref="event_profiles({eventText: event.text})">{{event.text}}</strong> by user <strong><span ui-sref="profile_events({profileId: event.profileId})" style="cursor:pointer; text-decoration:underline;">{{event.profileId}}</span></strong>.<br>on <strong>{{event.channel}}</strong> from <strong>{{event.osName}}</strong><br><br><div ng-repeat="attribute in event.attributes"><a class="btn btn-xs btn-white">&nbsp;{{attribute.key}}&nbsp;:&nbsp;{{attribute.value}}&nbsp;</a></div></div></div></div></div></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('events/tabs/page-events.html',
    '<style type="text/css">\n' +
    '    .explain {\n' +
    '    border: 1px solid #536571;\n' +
    '    width: 300px;\n' +
    '    background-color: rgba(27, 20, 20, 0);\n' +
    '    border-radius: 4px;\n' +
    '    height: auto;\n' +
    '    color: #ffffff;\n' +
    '    position: absolute;\n' +
    '    padding: 6px 6px 6px 6px;\n' +
    '    margin-top: 22px;\n' +
    '    margin-left: -120px;\n' +
    '    background-color: #536571;\n' +
    '    z-index: 199999999;\n' +
    '  }\n' +
    '  .explain1 {\n' +
    '    border: 1px solid #536571;\n' +
    '    width: 550px;\n' +
    '    background-color: rgba(27, 20, 20, 0);\n' +
    '    border-radius: 4px;\n' +
    '    height: auto;\n' +
    '    color: #ffffff;\n' +
    '    position: absolute;\n' +
    '    padding: 6px 6px 6px 6px;\n' +
    '    margin-top: 22px;\n' +
    '    margin-left: -120px;\n' +
    '    background-color: #536571;\n' +
    '    z-index: 199999999;\n' +
    '  }\n' +
    '</style><a href="http://www.connecto.io/kb/knwbase/page-events-dashboard-guide/" target="_blank">Visit for detailed information about the stats show below</a><div class="row"><div class="wrapper wrapper-content"><div class="alert alert-warning" ng-show="dateRangeFlag"><strong>Attention!</strong> Please specify a date range within the last 3 months.</div><div class="row"><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var1=true" ng-mouseleave="var1=false">Session Count</span></h5><span class="explain" ng-show="var1">Number of unique sessions in the specified timeframe</span></div><div class="ibox-content"><h1 class="no-margins">{{anonymousSessionCount | number:0}}</h1></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var2=true" ng-mouseleave="var2=false">Identified Page Events</span></h5><span class="explain" ng-show="var2">Number of page events from identified users in the specified timeframe</span></div><div class="ibox-content"><h1 class="no-margins">{{identifiedEventCount | number:0}}</h1></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var3=true" ng-mouseleave="var3=false">Anonymous Page Events</span></h5><span class="explain" ng-show="var3">Number of page events from anonymous users in the specified timeframe</span></div><div class="ibox-content"><h1 class="no-margins">{{anonymousEventCount | number:0}}</h1></div></div></div></div><div class="row"><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var11=true" ng-mouseleave="var11=false">Sessions By Domain</span></h5><span class="explain" ng-show="var11">Number of new sessions generated across domains (displaying top 10 counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>Domain</th><th>Sessions</th></tr></thead><tbody><tr ng-repeat="data in sessionCountByDomain"><td>{{data.domain}}</td><td class="text-navy">{{data.total}}</td></tr></tbody></table></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var4=true" ng-mouseleave="var4=false">Page Events By Device</span></h5><span class="explain" ng-show="var4">Number of page events from different devices</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>Device</th><th>Count</th></tr></thead><tbody><tr ng-repeat="data in polarDataDevice"><td>{{data.label}}</td><td class="text-navy">{{data.value}}</td></tr></tbody></table></div></div></div><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var5=true" ng-mouseleave="var5=false">Page Events By OS</span></h5><span class="explain" ng-show="var5">Number of page events from different operating systems (displaying only top 5 counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>OS</th><th>Count</th></tr></thead><tbody><tr ng-repeat="data in polarDataOs"><td>{{data.label}}</td><td class="text-navy">{{data.value}}</td></tr></tbody></table></div></div></div></div><div class="row"><div class="col-sm-4 col-lg-4"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var12=true" ng-mouseleave="var12=false">Page Views by Domain</span></h5><span class="explain" ng-show="var12">Number of page views of each domain in the specified timeframe (displaying only top counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>Domain</th><th>Count</th></tr></thead><tbody><tr ng-repeat="data in polarDataByDomain"><td>{{data.label}}</td><td class="text-navy">{{data.value}}</td></tr></tbody></table></div></div></div><div class="col-sm-8 col-lg-8"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var6=true" ng-mouseleave="var6=false">Intersection Across Domains</span></h5><span class="explain1" ng-show="var6">Intersection across domain is the number of page views which occur when the cookie for all the participating domains in the intersection is set (Displaying only top counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><table class="table table-hover"><thead><tr><th>Domain</th><th>Count</th></tr></thead><tbody><tr ng-repeat="data in polarDataCrossDomain"><td>{{data.label}}</td><td class="text-navy">{{data.value}}</td></tr></tbody></table></div></div></div></div><div class="row"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var7=true" ng-mouseleave="var7=false">Page Events By Device</span></h5><span class="explain" ng-show="var7">Graphical representation of page events from different devices</span><div ibox-tools=""></div></div><div class="ibox-content"><div><canvas polarchart="" options="polarOptions" data="polarDataDevice" height="140" legend="true" responsive="true"></canvas></div></div></div><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var8=true" ng-mouseleave="var8=false">Page Events By OS</span></h5><span class="explain1" ng-show="var8">Graphical representation of page events from different operating systems(displaying only top 5 counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><div><canvas polarchart="" options="polarOptions" data="polarDataOs" height="140" legend="true" responsive="true"></canvas></div></div></div><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var9=true" ng-mouseleave="var9=false">Page Views by Domain</span></h5><span class="explain1" ng-show="var9">Graphical representation of number of page views of each domain (displaying only top counts)</span><div ibox-tools=""></div></div><div class="ibox-content"><div><canvas polarchart="" options="polarOptions" data="polarDataByDomain" height="140" legend="true" responsive="true"></canvas></div></div></div></div><div class="col-lg-8" id="real_events"><div class="ibox float-e-margins"><div class="ibox-title"><h5><span ng-mouseover="var10=true" ng-mouseleave="var10=false">Sample Page Events</span></h5><span class="explain1" ng-show="var10">sample page events in the last 24 hrs, click on the userId to see detailed page events of that user</span></div><div class="ibox-content inspinia-timeline"><div class="timeline-item" ng-repeat="event in events"><div class="row"><div class="col-xs-4 date" style="width:33%;"><i style="width:70px;"><span class="label label-warning">{{event.eventType | uppercase}}</span></i><br>At {{event.timestamp}}<br><small class="text-navy">{{event.timeago}} ago</small></div><div class="col-xs-8 content"><div class="media-body fadeInUpBig" ng-class="{\'animated\' : $first}"><strong class="text-info" ui-sref="event_profiles({eventText: event.text})">{{event.text}}</strong> by user <strong><span ui-sref="profile_page_events({profileId: event.profileId})" style="cursor:pointer; text-decoration:underline;">{{event.profileId}}</span></strong>.<br>on <strong>{{event.channel}}</strong> from <strong>{{event.osName}}</strong><br>Number of Page Views: <strong>{{event.urls.length}}</strong><br>Domains of Page Views: <span ng-repeat="domain in event.domains"><strong>&nbsp;&nbsp;{{domain}}&nbsp;&nbsp;</strong></span><div ng-repeat="attribute in event.attributes"><a class="btn btn-xs btn-white">&nbsp;{{attribute.key}}&nbsp;:&nbsp;{{attribute.value}}&nbsp;</a></div></div></div></div></div></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('push-api/tabs/push.html',
    '<div><div class="row"><div class="col-md-4 text-right">Request Identifier<br><small class="text-muted">Any identifier to name the job</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="push_payload.requestId"></div></div><br><div class="row"><div class="col-md-4 text-right">GCM Api Key<br><small class="text-muted">Refer to <a href="http://www.connecto.io/kb/knwbase/getting-gcm-sender-id-and-gcm-api-key/">this</a> page to find GCM API Key</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="push_payload.gcmAPIKey"></div></div><br><div class="row"><div class="col-md-4 text-right">Notification Data<br><small class="text-muted">Leave blank if no fields are needed</small></div><div class="col-md-8"><div class="alert alert-success" ng-show="jsonError">{{jsonError}}</div><textarea rows="4" class="form-control" ng-model="data.data">\n' +
    '    </textarea></div></div><br><div class="row"><div class="col-md-4 text-right">Registration Ids<br><small class="text-muted">Comma separated GCM registration IDs</small></div><div class="col-md-8"><textarea rows="4" class="form-control" ng-model="data.ids">\n' +
    '    </textarea></div></div><br><div class="alert alert-success" ng-show="successMessage">{{successMessage}}<br>Sent Data:<br>{{sentData}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendPushNotificationviaApi()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pushNotificationsApp');
} catch (e) {
  module = angular.module('pushNotificationsApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('push-api/tabs/sms.html',
    '<div><hr><div class="row"><div class="col-md-4 text-right">Request Identifier<br><small class="text-muted">Any identifier to name the job</small></div><div class="col-md-8"><input type="text" class="form-control" ng-model="sms_payload.requestId"></div></div><br><div class="row"><div class="col-md-4 text-right">API Type<br><small class="text-muted">Refer to <a href="http://www.connecto.io/kb/knwbase/getting-gcm-sender-id-and-gcm-api-key/">this</a> page to find GCM API Key</small></div><div class="col-md-8"><div type="text" class="form-control">GUPSHUP</div></div></div><div class="row"><div class="col-md-4 text-right">Username & Password<br><small class="text-muted">Refer to <a href="http://www.connecto.io/kb/knwbase/getting-gcm-sender-id-and-gcm-api-key/">this</a> page to learn more about Gupshup integration</small></div><div class="col-md-4"><input type="text" class="form-control" ng-model="sms_payload.apiCredentials.username"></div><div class="col-md-4"><input type="text" class="form-control" ng-model="sms_payload.apiCredentials.password"></div></div><br><div class="row"><div class="col-md-4 text-right">Message<br><small class="text-muted">SMS Text</small></div><div class="col-md-8"><div class="alert alert-success" ng-show="jsonError">{{jsonError}}</div><textarea rows="4" class="form-control" ng-model="sms_payload.message">\n' +
    '    </textarea></div></div><br><div class="row"><div class="col-md-4 text-right">Phone Numbers<br><small class="text-muted">Comma separated Phone Numbers e.g. 919876543210</small></div><div class="col-md-8"><textarea rows="4" class="form-control" ng-model="data.numbers">\n' +
    '    </textarea></div></div><br><div class="row"><div class="col-md-4 text-right">Override DND<br><small class="text-muted">Ignore DND restrictions</small></div><div class="col-md-8"><label class="checkbox-inline" style="padding-top:0"><input type="checkbox" ng-model="sms_payload.override_dnd"></label></div></div><br><div class="alert alert-success" ng-show="successMessage">{{successMessage}}<br>Sent Data:<br>{{sentData}}</div><div class="alert alert-danger" ng-show="failureMessage">{{failureMessage}}</div></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="sendSmsViaApi()">Send</button> <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button></div>');
}]);
})();
