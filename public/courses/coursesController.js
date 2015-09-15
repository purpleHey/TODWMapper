angular.module('newApp')
.controller('courses', function($scope, remoteCourses){
  remoteCourses.get()
  .success(function (courses) {
    $scope.courses = courses;
  });
});

