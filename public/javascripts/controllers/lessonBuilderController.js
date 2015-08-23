angular.module('lessonBuilderController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','lessonItems', function($scope, $http, lessonItems) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		lessonItems.get()
			.success(function(data) {
				$scope.lessonItems = data;
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
	}]);