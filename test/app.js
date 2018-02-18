var app=angular.module('app', ['ui.bootstrap']);

app.controller("MainCtrl", function($rootScope, $scope, $http, $q, $uibModal){

	$scope.input = {
		code : ""
	}

	$scope.output = ""

	$scope.run = function(){
		console.log(window.holang.parse($scope.input.code))
	}

})