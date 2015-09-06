angular.module('newApp')
.factory('tags', function ($http) {
    var baseUrl = '/api/tags';

    function toQueryString (object) {
        return Object.keys(object).reduce(function (queryString, key, i) {
            return (i === 0 ? '?' : '&' ) + queryString + key + '=' + object[key];
        }, '');
    }

    return {
        search: function (params) {
            return $http.get(baseUrl + (params ? toQueryString(params) : ''));
        },
        create: function (tag) {
            return $http.post(baseUrl, tag);
        },
        update: function (tag) {
            return $http.put(baseUrl + '/' + tag._id, tag);
        },
        delete: function (tag) {
            return $http.delete(baseUrl + '/' + tag._id);
        }
    }
});
