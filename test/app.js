
var app = angular.module('app', ['ui.bootstrap', 'jsonFormatter']);
app.controller("MainCtrl", function($rootScope, $scope, $http, $q, $uibModal){

	$scope.input = {
		code : "사과=딸기+1",
		context: {
			"사과":1,
			"딸기":4
		}
	}

	$scope.output = {}

	$scope.run = function(){
		$scope.output = holang.run($scope.input.context, $scope.input.code)
	}

	$scope.tokenize = function(){
		$scope.output = holang.tokenize($scope.input.code)
	}

	$scope.makeTree = function(){
		$scope.output = holang.makeTree($scope.input.code, -1)
	}

})