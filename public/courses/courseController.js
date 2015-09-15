angular.module('newApp')
.controller('modules', function($modal, $log, $scope, $routeParams, remoteTags, remoteCourse){

  $scope.numLOs = 42;

  remoteCourse.get()
  .then(function (course) {
    $scope.course = course.data;

    return remoteCourse.child('modules').get();

  }).then(function (response) {

    $scope.modules = response.data.filter(function(module) {
      // -1 => string not found.
      return (module.name.indexOf("Teacher Resources") === -1);
    });

    // $scope.numUnits = modules.length;

    // Now that modules has been attached to the $scope, get the module
    // metadata and attach the learning objectives to the appropriate 
    // module based on the moduleID.
    // NOTE: that since joining the metadata to the module depends on all
    //       the modules being available to loop through, the server data request
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
      var module = utils.find($scope.modules, { id: tag.unitId });

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

