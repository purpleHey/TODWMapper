angular.module('newApp')
.controller('course', function($modal, $log, $scope, $routeParams, remoteTags, remoteCourse){

  $scope.numLOs = 42;

  remoteCourse.get()
  .then(function (course) {
    $scope.course = course.data;

    return remoteCourse.child('modules').get();

  }).then(function (response) {

    $scope.units = response.data.filter(function(unit) {
      // -1 => string not found.
      return (unit.name.indexOf("Teacher Resources") === -1);
    });

    // $scope.numUnits = units.length;

    // Now that units has been attached to the $scope, get the unit
    // metadata and attach the learning objectives to the appropriate 
    // unit based on the unitID.
    // NOTE: that since joining the metadata to the unit depends on all
    //       the units being available to loop through, the server data request
    //       either need to be done serially (which is what we're done here inside the
    //       .success block of the previous request), or you have to use promise's to 
    //       syncronize the requests.  If you don't there would be a race condition.

    return remoteTags.get();
  }).then(function(response) {
    var tags = response.data;

    var lessonTags = tags.filter(function (tag) {
      return tag.activityType === 'SubHeader';
    });
    $scope.numLOsTaught = utils.unique(utils.pluck(lessonTags, 'content')).length;

    var quizTags = tags.filter(function (tag) {
      return tag.activityType === 'Quiz';
    });
    $scope.numLOsAssessed = utils.unique(utils.pluck(quizTags, 'content')).length;

    tags.forEach(function(tag) {
      var unit = utils.find($scope.units, { id: tag.unitId });

      if(unit)
        unit.tags = (unit.tags || []).concat(tag);
    });
  }, function(xhr, status, error) {
    // do something with errors
  });

  $scope.open = function (size, unit) {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'courses/unitMap.html',
      controller: 'modalUnitMap',
      size: size,
      resolve: {
        unit: function () { return unit; }
      }
    });

    modalInstance.result.then(function (tags) {
      unit.tags = tags;
    }, function () {
      $log.info('Modal canceled at: ' + new Date());
    });
  };
});

