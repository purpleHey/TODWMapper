angular.module('newApp')
.factory('modules', function($http, courses) {
    return {
        url: function(courseID) {
            return courses.url + '/' + courseID + '/modules'
        },
        get: function(courseID) {
            return $http.get(this.url(courseID));   
        }
    };
});
