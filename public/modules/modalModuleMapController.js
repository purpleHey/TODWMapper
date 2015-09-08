angular.module('newApp')
.controller('modalModuleMap', function($scope, $modalInstance, $routeParams, $q,
                                       cspFramework, module, tags) {
    var courseId = parseInt($routeParams.id, 10);
    var originalContents = utils.unique(utils.pluck(module.tags, 'content'));
    $scope.contents = utils.clone(originalContents);
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
            $modalInstance.close(utils.pluck(newTags, 'data').concat(savedTags));
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

