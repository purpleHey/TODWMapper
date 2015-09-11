angular.module('newApp')
.factory('moduleItems', function($http, modules) {
  return {
    url: function(courseID, moduleID) {
      return modules.url(courseID) + '/' + moduleID + '/items';
    },
    get: function(courseID, moduleID, page) {
      return $http.get(this.url(courseID, moduleID) + '?page=' + page);   
    }
  };
});
