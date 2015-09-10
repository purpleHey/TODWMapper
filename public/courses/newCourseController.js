angular.module('newApp')
.controller('newCourse', function($scope, courses){
  $scope.course = {};
  $scope.addCourse = function () {
    courses.create($scope.course);
  };

});
