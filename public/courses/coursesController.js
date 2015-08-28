angular.module('newApp')
.controller('courses', function($scope, courses){
    courses.getAll()
    .success(function (courses) {
        $scope.courses = courses;
    });
});

