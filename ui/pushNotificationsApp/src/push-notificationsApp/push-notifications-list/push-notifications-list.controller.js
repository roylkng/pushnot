'use strict';

angular.module('pushNotificationsApp')
  .controller('pushNotificationsListCtrl',function($scope, $rootScope, $modal, $timeout, 
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
  });
