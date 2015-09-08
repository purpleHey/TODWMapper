angular.module('newApp')
.controller('modules', function(courses, modules, tags, $modal, $log, $scope, $routeParams, $http){
    function find(modules, courseID) {
        for(i = 0; i < modules.length; i++) {
            if(modules[i].id === courseID)
                return modules[i];
        }
    }

    courses.get($routeParams.id)
    .then(function (course) {
        $scope.course = course.data;

        return modules.getAll($routeParams.id);

    }).then(function (modules) {
    
        modules = modules.data;

        modules = modules.filter(function(module) {
                // -1 => string not found.
            return (module.name.indexOf("Teacher Resources") === -1);
        });

        $scope.modules = modules;
        $scope.numLOs = 42;
        $scope.numLOsTaught = 25;
        $scope.percentTaught = Math.round($scope.numLOsTaught/$scope.numLOs*100);
        $scope.numLOsAssessed = 4;
        $scope.percentAssessed = Math.round($scope.numLOsAssessed/$scope.numLOs*100);
        // $scope.numUnits = modules.length;

        // Now that modules has been attached to the $scope, get the module
        // metadata and attach the learning objectives to the appropriate 
        // module based on the moduleID.
        // NOTE: that since joining the metadata to the module depends on all
        //       the modules being available to loop through, the server data request
        //       either need to be done serially (which is what we're done here inside the
        //       .success block of the previous request), or you have to use promise's to 
        //       syncronize the requests.  If you don't there would be a race condition.

        return tags.search();
    }).then(function(response) {
        response.data.forEach(function(tag) {
            var module = find($scope.modules, tag.unitId);

            if(module)
                module.tags = (module.tags || []).concat(tag);
        });
    }, function(xhr, status, error) {
        // do something with errors
    });

    $scope.open = function (size, module) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modules/moduleMap.html',
            controller: 'modalModuleMap',
            size: size,
            resolve: {
                module: function () { return module; }
            }
        });

        modalInstance.result.then(function (tags) {
            module.tags = tags;
        }, function () {
            $log.info('Modal canceled at: ' + new Date());
        });
    };
});

