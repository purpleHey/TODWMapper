angular.module('newApp')
.factory('cspFramework', function ($http) {
  var cache;

  function getCSPFramework () {
    return cache || (cache = $http.get('/api/csp-framework')
                     .then(function (response) { return response.data; }));
  }

  function find (array, id) {
    var item, i = 0;
    while (item = array[i] && array[i].id !== id) i++;
    return array[i];
  }

  function nestedFind (source, ids) {
    return ids.reduce(function (entity, id) {
      return find(entity.children, id);
    }, { children: source });
  }

  // '1.2.3A.Ex' -> ['1', '2', '3', 'A', 'Ex']
  function parseId (id) {
    var isEx = id.slice(-2) === 'Ex';
    var parts = (isEx ? id.slice(0, -3) : id).replace(/\./g, '').split('');
    return isEx ? parts.concat('Ex') : parts;
  }

  // ['1', '2', '3', 'A', 'Ex'] -> ['1', '1.2', '1.2.3', '1.2.3A', '1.2.3A.Ex']
  function buildIds (parts, runningId) {
    if (parts.length === 0) return [];
    var next = parts.shift();
    runningId = (runningId || '') +
      ((/[A-Za-z]/.test(next) && next !== 'Ex') || !runningId ? '' : '.') +
      next;
    return [runningId].concat(buildIds(parts, runningId));
  }

  return {
    all: function () {
      return getCSPFramework();
    },
    lookup: function (id) {
      return getCSPFramework().then(function (framework) {
        return nestedFind(framework, buildIds(parseId(id))).description;
      });
    }
  }
});
