angular.module('newApp')
// super simple service
// each function returns a promise object 
.factory('lessonItems', ['$http',function($http) {
  return {
    get : function() {
      return $http.get('/api/lessonItems');
    },
    create : function(lessonItemData) {
      return $http.post('/api/lessonItems', lessonItemData);
    },
    delete : function(id) {
      return $http.delete('/api/lessonItems/' + id);
    }
  }
}]);
