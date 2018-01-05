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
  .config(function ($stateProvider, $urlRouterProvider) {
    var _setDefaultRootScopeVariables = function($rootScope) {
      $rootScope.title = '';
      $rootScope.breadcrumbs = undefined;
      $rootScope.showBreadcrumbsRow = true;
      $rootScope.isInsideCreateFlow = false;
      $rootScope.hideDateRangePicker = false;
      $rootScope.showCreateButton = true;
    };
    $stateProvider
      .state('base', {
        url: '',
        templateUrl: 'push-notificationsApp/main/main.html',
        abstract : true,
        resolve : {
          coContextService : 'coContextService',
          pushNotificationsService : 'pushNotificationsService',
          coHtml5NotificationService : 'coHtml5NotificationService',
          coAppContext : function(coContextService) { return coContextService.getContext(); }
        },
        controller : 'MainCtrl',
        onEnter : function($rootScope) {
          _setDefaultRootScopeVariables($rootScope);
        },
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
        onEnter : function($rootScope) {
          $rootScope.title = 'Push Notifications List';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'List',
                state : 'pushNotificationsList'
              },
            ];
        },
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
        onEnter : function($rootScope) {
          $rootScope.title = 'Events For Project';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Events (please specify a date range within the last 3 months)',
                state : 'events'
              },
            ];
        },
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
        onEnter : function($rootScope) {
          $rootScope.title = 'Profile Events';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Events',
                state : 'profile_events'
              },
            ];
        },
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
        onEnter : function($rootScope) {
          $rootScope.title = 'Profile Events';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Page Events',
                state : 'profile_page_events'
              },
            ];
        },
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
        onEnter : function($rootScope) {
          $rootScope.title = 'Job Stats for Project';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Jobs',
                state : 'job-stats'
              },
            ];
        },
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
          coAppContext : function(coContextService) { return coContextService.getContext(); }
        },
        templateUrl: 'push-notificationsApp/create-edit-push/create-edit-push.html',
        controller: 'createEditPushCtrl',
         onEnter : function($rootScope) {
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
        },
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
          coAppContext : function(coContextService) { return coContextService.getContext(); }
        },
        templateUrl: 'push-notificationsApp/create-edit-push/create-edit-push.html',
        controller: 'createEditPushCtrl',
        onEnter : function($rootScope) {
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
        },
        onExit : _setDefaultRootScopeVariables,
      })
        .state('settings', {
        parent : 'base',
        url: '/settings',
        templateUrl: 'push-notificationsApp/settings/settings.html',
        controller: 'settingsCtrl',
        onEnter : function($rootScope) {
          $rootScope.title = 'Settings';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Settings',
                state : 'settings'
              },
            ];
        },
        onExit : _setDefaultRootScopeVariables,
      })
      .state('tags', {
        parent : 'base',
        url: '/tags',
        templateUrl: 'push-notificationsApp/tags/tags.html',
        controller: 'TagsCtrl',
        onEnter : function($rootScope) {
          $rootScope.title = 'Tags';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Tags',
                state : 'tags'
              },
            ];
        },
        onExit : _setDefaultRootScopeVariables,
      })
      .state('createTag', {
         parent : 'base',
         url: '/createTag',
         templateUrl: 'push-notificationsApp/tags/create-edit-tags.html',
         controller: 'CreateEditTagCtrl',
         onEnter : function($rootScope) {
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
         },
         onExit : _setDefaultRootScopeVariables,
      })
      .state('editTag', {
         parent : 'base',
         url: '/editTag/:tagId',
         templateUrl: 'push-notificationsApp/tags/create-edit-tags.html',
         controller: 'CreateEditTagCtrl',
         onEnter : function($rootScope) {
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
         },
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
        onEnter : function($rootScope) {
          $rootScope.title = 'Push-Api';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'Push-Api',
                state : 'push-api'
              },
            ];
        },
        onExit : _setDefaultRootScopeVariables,
      })
      .state('html5NotificationList', {
        parent : 'base',
        url: '/html5notifications',
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-list.html',
        controller: 'html5NotificationListCtrl',
        onEnter : function($rootScope) {
          $rootScope.title = 'HTML5 Notifications List';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'HTML5 Notification List',
                state : ''
              },
            ];
        },
        onExit : _setDefaultRootScopeVariables,

      })
      .state('createHtml5Notification', {
        parent : 'base',
        url: '/html5notifications/create',
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-manage.html',
        resolve: {
          coContextService : 'coContextService',
          coHtml5NotificationObj: function(coHtml5NotificationService, coAppContext) {
            return coHtml5NotificationService.getNewNotification();
          },
        },
        controller: 'ManageHtml5NotificationCtrl',
        data: {
          mode: 'create',
        },
        onEnter : function($rootScope) {
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
        },
        onExit : _setDefaultRootScopeVariables,
      })
      .state('viewHtml5Notification', {
        parent : 'base',
        url: '/html5notifications/:html5NotificationId',
        resolve : {
          coContextService : 'coContextService',
          coHtml5NotificationService : 'coHtml5NotificationService',
          coHtml5NotificationObj: function(coHtml5NotificationService,
            coAppContext, $stateParams) {
            return coHtml5NotificationService.getNotification(coAppContext,
              $stateParams.html5NotificationId);
          },
        },
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-view.html',
        controller: 'ViewHtml5NotificationCtrl',
        onEnter : function($rootScope) {
          $rootScope.title = 'View HTML5 Notification';
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
        },
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
          coHtml5NotificationObj: function(coHtml5NotificationService,
            coAppContext, $stateParams) {
            return coHtml5NotificationService.getNotification(coAppContext,
              $stateParams.html5NotificationId);
          },
        },
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-manage.html',
        controller: 'ManageHtml5NotificationCtrl',
        onEnter : function($rootScope) {
          $rootScope.title = 'Edit HTML5 Notification';
          $rootScope.showBreadcrumbsRow = false;
          $rootScope.showCreateButton = false;
        },
        onExit : _setDefaultRootScopeVariables,
      })
      .state('html5NotificationAnalytics', {
        parent : 'base',
        controller: 'html5NotificationAnalyticsCtrl',
        url: '/html5notifications/:html5NotificationId/analytics',
        templateUrl: 'push-notificationsApp/html5-notification/html5-notification-analytics.html',
        onEnter : function($rootScope) {
          $rootScope.title = 'HTML5 Notifications Analytics';
          $rootScope.showBreadcrumbsRow = true;
          $rootScope.showCreateButton = true;
          $rootScope.breadcrumbs = [
              {
                text : 'HTML5 Notification Analytics',
                state : ''
              },
            ];
        },
        onExit : _setDefaultRootScopeVariables,
      });
    $urlRouterProvider.otherwise('/list');

  });
