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
	.when("/course/lesson", {
		controller: "lessonBuilderController",
		templateUrl: "/templates/lessonOutline.html"
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

.controller("unitMap", function($scope, unitMap){
	$scope.unit = 1;
	$scope.unitLOs = [];
	// {
	// 	"id": "1.1.1",
	// 	"description": "Apply a creative development process when creating computational artifacts. [P2]"
	// },
	// {
	// 	"id": "1.2.3",
	// 	"description": "Create a new computational artifact by combining or modifying existing artifacts. [P2]"
	// }
	// ];
	unitMap.get()
	.success(function(unitMap) {
		$scope.bigIdeas = unitMap;
	})

	$scope.toggleLOinUnit = function(){
		if(this.lo.units === undefined) {
			this.lo.units = [];
			this.lo.units.push(this.unit);
			this.unitLOs.push(this.lo);
		}
		if(this.lo.units.indexOf(this.unit) === -1) {
			// THis LO is not in the unit, so add it.
			this.lo.units.push(this.unit);
			this.unitLOs.push(this.lo);
		} else {
			this.lo.units.pop(this.unit);
			this.unitLOs.pop(this.lo);
		}
		console.log(this.lo);
	};
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

.controller('lessonBuilderController', function($scope, $http, unit) {
	$scope.formData = {};
	$scope.loading = true;

	// GET =====================================================================
	// when landing on the page, get all todos and show them
	// use the service to get all the todos
	unit.get()
		.success(function(data) {
			$scope.unit = data;
			$scope.loading = false;
		});

	// CREATE ==================================================================
	// when submitting the add form, send the text to the node API
	$scope.createLessonItem = function() {

		// validate the formData to make sure that something is there
		// if form is empty, nothing will happen
		if ($scope.formData.text != undefined) {
			$scope.loading = true;

			// call the create function from our service (returns a promise object)
			lessonItems.create($scope.formData)

				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.lessonItems = data; // assign our new list of todos
				});
		}
	};

	// DELETE ==================================================================
	// delete a todo after checking it
	$scope.deleteLessonItem = function(id) {
		$scope.loading = true;

		lessonItems.delete(id)
			// if successful deletion, call our get function to get the updated lessonItems
			.success(function(data) {
				$scope.loading = false;
				$scope.lessonItems = data; // assign our new list of todos
			});
	};
})

.factory('unit', function($http) {
	return {
		get : function() {
			return $http.get('/api/unit');
		},
		create : function(lessonItemData) {
			return $http.post('/api/unit', lessonItemData);
		},
		delete : function(id) {
			return $http.delete('/api/unit/' + id);
		}
	}
})

.factory("unitMap", function($http) {
	return {
		url: '/api/csp-framework',
		get: function() {
			return $http.get(this.url);
		}
	}
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