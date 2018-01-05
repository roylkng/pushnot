'use strict';

angular.module('connectoApp')
  .factory('coUtilService', function ($http) {
    var coUtilService = {};

    coUtilService.sendUrl = function(url, callback) {
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

    return coUtilService;
  });

