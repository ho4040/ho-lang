var app = angular.module('app', ['ui.bootstrap', 'jsonFormatter']);


app.controller("MainCtrl", function($rootScope, $scope, $http, $q, $uibModal){

	$scope.error = "";

	$scope.input = {
		code : ""
	}

	$scope.output = null

	$scope.reset = function(){
		$scope.output = {}
	}

	$scope.run = function(){
		try {
			$scope.output = holang.parse($scope.input.code)
			//console.log(holang.getContext())
			$scope.output = holang.getContext();
			$scope.error = "";
		}
		catch( e ){
			$scope.error = e.toString();
			//console.log(e)
		}
	}

})