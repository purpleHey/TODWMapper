angular.module('newApp')
.controller('modules', function(courses, modules, moduleMetadata, $scope, $routeParams){
    function find(modules, courseID) {
        for(i = 0; i < modules.length; i++) {
            if(modules[i].id === courseID)
                return modules[i];
        }
    }

    courses.get($routeParams.id)
    .success(function (course) {
        $scope.course = course;
    });
    modules.get($routeParams.id)
    .success(function (modules, status, headers) {
        $scope.modules = modules;
        moduleMetadata.get()
        .success(function(data) {
            data.forEach(function(meta) {
                var module = find($scope.modules, meta.canvasID);

                if(module)
                    module.learningObjectives = meta.learningObjectives;
            });
        });
    });
});
