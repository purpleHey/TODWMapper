angular.module('newApp')
.factory('courses', function($http) {
    return {
        url: '/api/canvas/courses',
        get: function() {
            return $http.get(this.url)  
        },
        create: function(course) {
            return $http.post(url, course);
        }
    };
});
