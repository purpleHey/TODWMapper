angular.module('newApp')
.factory('moduleMetadata', function($http) {
    return {
        get : function(moduleID) {
            return $http.get('/api/units' + '/' + moduleID);
        },
        getAll: function() {
            return $http.get('/api/units');
        },
        create : function(lessonItemData) {
            return $http.post('/api/units', lessonItemData);
        },
        delete : function(id) {
            return $http.delete('/api/units/' + id);
        }
    }
});
