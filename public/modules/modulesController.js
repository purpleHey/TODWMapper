angular.module('newApp')
.controller('modules', function(courses, modules, moduleMetadata, $modal, $log, $scope, $routeParams){
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
        // Now that modules has been attached to the $scope, get the module
        // metadata and attach the learning objectives to the appropriate 
        // module based on the moduleID.
        // NOTE: that since joining the metadata to the module depends on all
        //       the modules being available to loop through, the server data request
        //       either need to be done serially (which is what we're done here inside the
        //       .success block of the previous request), or you have to use promise's to 
        //       syncronize the requests.  If you don't there would be a race condition.
        moduleMetadata.get()
        .success(function(data) {
            data.forEach(function(meta) {
                var module = find($scope.modules, meta.canvasID);

                if(module)
                    module.learningObjectives = meta.learningObjectives;
            });
        });
    });

    $scope.open = function (size, module) {

      $scope.module = module;
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'modules/moduleMap.html',
        controller: 'modalModuleMap',
        scope: $scope,
        size: size
        // resolve: {
        //   unitLOs: function () {
        //     return $scope.unitLOs;
        //   }
        // }
      });

      modalInstance.result.then(function (unitLOs) {
        module.learningObjectives = unitLOs;
      }, function () {
        $log.info('Modal canceled at: ' + new Date());
      });
    };
});

