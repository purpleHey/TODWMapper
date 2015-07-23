angular.module("newApp", ["ngRoute"])
.config(function($routeProvider){
	$routeProvider.when("/courses", {
		controller : "courses",
		templateUrl : "/templates/courses.html"
	})
	.when("/courses/:id", {
		controller: "modules",
		templateUrl : "/templates/modules.html"
	})
	.otherwise("/courses");
})

.controller("courses", function($http, $scope){
	$http.get('/api/canvas/courses')	
	.success(function (courses) {
		$scope.courses = courses;
	})
})

.controller("modules", function($http, $scope, $routeParams){
	console.log($routeParams.id);
	$http.get('/api/canvas/courses/'+ $routeParams.id + "/modules")
	.success(function (modules, status, headers) {
		$scope.modules = modules;
	})
})





// $(function () {
// 	console.log('started');

// 	var accessToken = "7~blah, blah, blah";
// 	var endpoint = 'https://canvas.instructure.com/api/v1/courses';

// 	window.jsonCallback = function (res) {
// 		console.log('JSONP:', arguments);
// 	};

// 	function updateDom (res) {
// 		$('#content > p').html(res);
// 	}

// 	function displayMessage (message) {
// 		$('#messages').append('<p>' + message + '</p>');
// 	}

// 	$(function () {

// 		displayMessage('Fetching courses');

// 		$.ajax({
// 	    url: '/api/courses',
// 	    type: 'GET',
// 			success: function (res) {
// 				updateDom(res);
// 				displayMessage('Success!');
// 			},
// 			error: function (xhr, status, error) {
// 				updateDom('');
// 				displayMessage(status + '; ' + error)
// 			}
// 		});

// 	});


// });