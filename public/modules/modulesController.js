angular.module('newApp')
.controller('modules', function(modules, moduleMetadata, $scope, $routeParams){
    function find(modules, courseID) {
        for(i = 0; i < modules.length; i++) {
            if(modules[i].id === courseID)
                return modules[i];
        }
    }

    modules.get($routeParams.id)
    .success(function (modules, status, headers) {
        $scope.modules = modules;
        $scope.course = $routeParams.id;
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
