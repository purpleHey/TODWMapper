angular.module('newApp')
.filter('unique', function () {
  return function (array, property) {
    if (!Array.isArray(array)) return array;
    return utils.unique(array, property);
  }
});
