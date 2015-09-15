angular.module('newApp')
.factory('createRemote', function ($http) {
  var remote;

  function createRemote (remote, segment) {
    var child = Object.create(remote);
    child.path += '/' + segment;
    child.parent = remote;
    return child;
  }

  function toQueryString (object) {
    return Object.keys(object).reduce(function (queryString, key, i) {
      return (i === 0 ? '?' : '&' ) + queryString + key + '=' + object[key];
    }, '');
  }

  remote = {
    path: '/api',
    child: function (name) {
      return createRemote(this, name);
    },
    search: function (params) {
      return $http.get(this.path + (params ? toQueryString(params) : ''));
    }
  };

  remote.id = remote.child;

  ['get', 'post', 'put', 'delete'].forEach(function (method) {
    remote[method] = function () {
      return $http[method].apply($http, [this.path].concat(arguments));
    };
  });

  remote.create = remote.post;
  remote.update = remote.put;

  return function (name) {
    return createRemote(remote, name);
  }
});
