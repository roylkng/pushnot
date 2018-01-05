'use strict';

angular.module('pushNotificationsApp')
  .factory('tagsService', function ($http, $q) {
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
});