angular.module('newApp')
.factory('courses', function($http) {
  return {
    url: '/api/canvas/courses',
    getAll: function() {
      return $http.get(this.url)  
    },
    get: function (id) {
      return $http.get(this.url + '/' + id);
    },
    create: function(course) {
      return $http.post(url, course);
    }
  };
});
