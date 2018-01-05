'use strict';

angular.module('pushNotificationsApp')
  .factory('coContextService', function ($http, $q) {
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
  });
