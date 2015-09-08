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

    function unique (array) {
        return array.filter(function (element, i) {
            return array.indexOf(element) === i;
        });
    }

    var courseId = parseInt($routeParams.id, 10);
    var originalContents = unique(pluck(module.tags, 'content'));
    $scope.contents = clone(originalContents);
    $scope.moduleName = module.name;

    cspFramework.all().then(function(framework) {
        $scope.bigIdeas = framework;
    });

    $scope.toggleLOinUnit = function(loID){
        // see if the lo is already in the list...
        var index = $scope.contents.indexOf(loID);
        if(index === -1) {
            // THis LO is not in the unit, so add it.
            $scope.contents.push(loID);
        } else {
            $scope.contents.splice(index, 1);
        }
    };

    $scope.ok = function () {
        var existingContents = $scope.contents;
        var unsavedTags = $scope.contents.filter(function (content) {
            return originalContents.indexOf(content) === -1;
        }).map(function (content) {
            return {
                courseId: courseId,
                unitId: module.id,
                content: content
            }
        });
        var removedTags = module.tags.filter(function (tag) {
            return existingContents.indexOf(tag.content) === -1;
        });
        var savedTags = module.tags.filter(function (tag) {
            return existingContents.indexOf(tag.content) !== -1;
        });
        // TODO: track creations and deletions in the modal to provide updates
        removedTags.map(tags.delete);
        $q.all(unsavedTags.map(tags.create)).then(function (newTags) {
            $modalInstance.close(pluck(newTags, 'data').concat(savedTags));
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

