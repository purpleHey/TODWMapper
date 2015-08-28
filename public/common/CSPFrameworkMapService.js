angular.module('newApp')
.factory('CSPFrameworkMap', function($http) {
    return {
        url: '/api/csp-framework',
        get: function() {
            return $http.get(this.url);
        }
    }
});
