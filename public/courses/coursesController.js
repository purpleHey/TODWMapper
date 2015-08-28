angular.module('newApp')
.controller('courses', function($scope, courses){
    courses.get()
    .success(function (courses) {
        $scope.courses = courses;
    });
});

