angular.module('newApp')
.factory('remoteCourses', function(createRemote) {
  return createRemote('canvas').child('courses');
});
