angular.module("newApp", ["ngRoute"])
.config(function($routeProvider){
	$routeProvider.when("/courses", {
		controller : "courses",
		templateUrl : "/templates/courses.html"
	})
	.when("/course/unit", {
		controller: "unitMap",
		templateUrl: "/templates/unitMap.html"
	})
	.when("/course/new", {
		controller: "newCourse",
		templateUrl: "/templates/newCourse.html"
	})
	.when("/courses/:id", {
		controller: "modules",
		templateUrl : "/templates/modules.html"
	})
	.when("/courses/:id/module/:id2", {
		controller: "lessonItems",
		templateUrl : "/templates/lessonItems.html"
	})
	.otherwise("/courses");
})

.controller("courses", function($scope, courses){
	courses.get()
	.success(function (courses) {
		$scope.courses = courses;
	})
})

.controller("unitMap", function($scope){
	$scope.unitLOs = [
	{
		"loID": "1.1.1",
		"description": "Apply a creative development process when creating computational artifacts. [P2]"
	},
	{
		"loID": "1.2.3",
		"description": "Create a new computational artifact by combining or modifying existing artifacts. [P2]"
	}
	];
	$scope.eus = [
		{
			"euID": "1.1",
			"description": "Creative development can be an essential process for creating computational artifacts.",
			"isCollapsed": true,
			"learningObjectives": [
				{
					"loID": "1.1.1",
					"description": "Apply a creative development process when creating computational artifacts. [P2]",
					"units": [1];
				},
			]
	  },
		{
			"euID": "1.2",
			"description": "Computing enables people to use creative development processes to create computational artifacts for creative expression or to solve a problem.",
			"isCollapsed": true,
			"learningObjectives": [
				{
					"loID": "1.2.1",
					"description": "Create a computational artifact for creative expression. [P2]"					
				},
				{
					"loID": "1.2.2",
					"description": "Create a computational artifact using computing tools and techniques to solve a problem. [P2]"
				},
				{
					"loID": "1.2.3",
					"description": "Create a new computational artifact by combining or modifying existing artifacts. [P2]"
				},
				{
					"loID": "1.2.4",
					"description": "Collaborate in the creation of computational artifacts. [P6]"
				},
				{
					"loID": "1.2.5",
					"description": "Analyze the correctness, usability, functionality, and suitability of computational artifacts. [P4]"
				}
			]
		}
	];
})

.controller("newCourse", function($scope, courses){
	$scope.course = {};
	$scope.addCourse = function () {
		courses.create($scope.course);
	};

})

.controller("modules", function(modules, $scope, $routeParams){
	modules.get($routeParams.id)
	.success(function (modules, status, headers) {
		$scope.modules = modules;
		$scope.course = $routeParams.id;
	})
})

.controller("lessonItems", function(moduleItems, $scope, $routeParams){
	console.log($routeParams.id);
	$scope.loadPage = function(pageNum) {

		moduleItems.get($routeParams.id, $routeParams.id2, pageNum)
		.success(function (lessonItems, status, headers) {
			var pgs = makePageMap(headers('link'));

			console.log(pgs);
			$scope.pages = pgs;
			$scope.pageNumbers = createArray(pgs.last);
			$scope.lessonItems = lessonItems;
		})
	}
	$scope.loadPage(1);
})

.factory("unitMap", function() {
	
})
.factory("courses", function($http) {
	return {
		url: '/api/canvas/courses',
		get: function() {
			return $http.get(this.url)	
		},
		create: function(course) {
			return $http.post(url, course);
		}
	};
})

.factory("modules", function($http, courses) {
	return {
		url: function(courseID) {
			return courses.url + '/' + courseID + '/modules'
		},
		get: function(courseID) {
			return $http.get(this.url(courseID));	
		}
	};
})

.factory("moduleItems", function($http, modules) {
	return {
		url: function(courseID, moduleID) {
			return modules.url(courseID) + '/' + moduleID + "/items";
		},
		get: function(courseID, moduleID, page) {
			return $http.get(this.url(courseID, moduleID) + '?page=' + page);	
		}
	};
})

function createArray(count) {
	var array = [];
	for (var i = 0; i < count; i++) {
		array[i] = i+1;
	};
	return array;
}


function makePageMap(headers) {
	var pageObjs = {};
	var pageArr = headers.split(',').map(function(str) {
		return str.match(/page=(\d+).*rel="(\w+)/);
	});
	pageArr.forEach(function(pageMatchs) {
		pageObjs[pageMatchs[2]] = pageMatchs[1];
	});

	return pageObjs;
}
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