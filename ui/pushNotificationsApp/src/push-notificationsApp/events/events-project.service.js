'use strict';

angular.module('pushNotificationsApp')
  .factory('eventsService', function ($http, $q, coContextService) {
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
});