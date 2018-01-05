angular.module('pushNotificationsApp')
  .controller('TagsCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams,
                                               coAppContext, tagsService) {

  	$scope.processTags = function (response) {
  		$scope.tags = response;
  		$scope.$apply();
  	};

  	function init () {
  		tagsService.getTagsOfProject(coAppContext, $scope.processTags);
  	};
  	init();
});