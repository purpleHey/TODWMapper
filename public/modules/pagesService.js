angular.module('newApp')
.factory('pages', function($http, courses) {
  return {
    url: function(courseID, page_url) {
      return courses.url + '/' + courseID + '/pages/' + page_url;
    },
    get: function (courseID, page_url) {
      return $http.get(this.url(courseID, page_url));
    },
  };
});
