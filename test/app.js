var app=angular.module('app', ['ui.bootstrap', 'jsonFormatter']);

app.controller("MainCtrl", function($rootScope, $scope, $http, $q, $uibModal){

	$scope.input = {
		code : ""
	}

	$scope.output = {}

	$scope.run = function(){
		$scope.output = window.holang.run($scope.input.code)
	}

	$scope.tokenize = function(){
		$scope.output = window.holang.tokenize($scope.input.code)
	}

	$scope.makeTree = function(){
		$scope.output = window.holang.makeTree($scope.input.code)
	}

})