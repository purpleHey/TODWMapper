angular.module('newApp')
.factory('remoteTags', function (createRemote) {
  return createRemote('tags');
});
