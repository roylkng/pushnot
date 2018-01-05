angular.module('pushNotificationsApp')
  .controller('CreateEditTagCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams,
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
});