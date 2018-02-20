
var app = angular.module('app', ['ui.bootstrap', 'jsonFormatter']);
app.controller("MainCtrl", function($rootScope, $scope, $http, $q, $uibModal){

	$scope.input = {
		code : ""
	}

	$scope.output = {}

	$scope.run = function(){
		$scope.output = holang.run($scope.input.code)
	}

	$scope.tokenize = function(){
		$scope.output = holang.tokenize($scope.input.code)
	}

	$scope.makeTree = function(){
		$scope.output = holang.makeTree($scope.input.code)
	}

})