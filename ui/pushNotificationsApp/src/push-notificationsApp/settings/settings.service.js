'use strict';

angular.module('pushNotificationsApp')
  .factory('settingsService', function ($http, $q, coContextService) {
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
  });
