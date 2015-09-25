angular.module('newApp')
.controller('modalUnitMap', function($scope, $modalInstance, $routeParams, $q,
                                       cspFramework, unit, remoteTags) {
  unit.tags || (unit.tags = []);
  var courseId = parseInt($routeParams.id, 10);
  var originalContents = utils.unique(utils.pluck(unit.tags, 'content'));
  $scope.contents = utils.clone(originalContents);
  $scope.unitName = unit.name;
 
  cspFramework.all().then(function(framework) {
    $scope.bigIdeas = framework;
  });
 
  $scope.isLOinUnit = function(loID) {
    // !== -1 => found so return true
    return $scope.contents.indexOf(loID) !== -1;
  };
 
  $scope.toggleLOinUnit = function(loID){
    // see if the lo is already in the list...
    var index = $scope.contents.indexOf(loID);
    if(index === -1) {
      // THis LO is not in the unit, so add it.
      $scope.contents.push(loID);
    } else {
      $scope.contents.splice(index, 1);
    }
    window.event.stopPropagation();
  };
 
  $scope.ok = function () {
    var existingContents = $scope.contents;
    var unsavedTags = $scope.contents.filter(function (content) {
      return originalContents.indexOf(content) === -1;
    }).map(function (content) {
      return {
        courseId: courseId,
        unitId: unit.id,
        content: content
      }
    });
    var removedTags = unit.tags.filter(function (tag) {
      return existingContents.indexOf(tag.content) === -1;
    });
    var savedTags = unit.tags.filter(function (tag) {
      return existingContents.indexOf(tag.content) !== -1;
    });
    // TODO: track creations and deletions in the modal to provide updates
    removedTags.forEach(function (tag) {
      remoteTags.id(tag._id).delete()
    });
    $q.all(unsavedTags.map(remoteTags.create, remoteTags)).then(function (newTags) {
      $modalInstance.close(utils.pluck(newTags, 'data').concat(savedTags));
    });
  };
 
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

