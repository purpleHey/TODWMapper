angular.module('newApp')
.factory('modules', function($http, courses) {
    return {
        url: function(courseID, moduleID) {
            return courses.url + '/' + courseID + '/modules' + (moduleID ? '/' + moduleID : '');
        },
        getAll: function(courseID) {
            return $http.get(this.url(courseID));   
        },
        get: function (courseID, moduleID) {
            return $http.get(this.url(courseID, moduleID));
        },
    };
});
