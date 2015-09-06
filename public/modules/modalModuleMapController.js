angular.module('newApp')
.controller('modalModuleMap', function($scope, $modalInstance, $routeParams, $q,
                                       cspFramework, module, tags) {
    function clone (data, isDeep) {
        if (Array.isArray(data)) {
            var clonedArray = data.slice();
            return isDeep ? clonedArray.map(clone) : clonedArray;
        } else {
            return Object.keys(data).reduce(function (object, key) {
                var value = data[key];
                object[key] = typeof value === 'object' ? clone(value, isDeep) : value;
                return object;
            }, {});
        }
    }

    function pluck (array, key) {
        return array.map(function (object) {
            return object[key];
        });
    }

    var courseId = parseInt($routeParams.id, 10);

    module.tags || (module.tags = []);
    var originalTags = clone(module.tags, true);
    $scope.module = module;

    cspFramework.all().then(function(framework) {
        $scope.bigIdeas = framework;
    });

    $scope.toggleLOinUnit = function(loID){
        // see if the lo is already in the list...
        var index = pluck($scope.module.tags, 'content').indexOf(loID);
        if(index === -1) {
            // THis LO is not in the unit, so add it.
            $scope.module.tags.push({
                courseId: courseId,
                unitId: module.id,
                content: loID
            });
        } else {
            $scope.module.tags.splice(index, 1);
        }
    };

    $scope.ok = function () {
        var currentTags = $scope.module.tags;
        var existingTags = currentTags.filter(function (tag) {
            return tag.hasOwnProperty('_id');
        });
        var unsavedTags = currentTags.filter(function (tag) {
            return !tag.hasOwnProperty('_id');
        });
        var removedTags = originalTags.filter(function (tag) {
            return currentTags.indexOf(tag) === -1;
        });
        // TODO: track creations and deletions in the modal to provide updates
        removedTags.map(tags.delete);
        $q.all(unsavedTags.map(tags.create)).then(function (savedTags) {
            $modalInstance.close(pluck(savedTags, 'data').concat(existingTags));
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

