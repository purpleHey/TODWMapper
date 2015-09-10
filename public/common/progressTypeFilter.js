angular.module('newApp')
.filter('progressType', function () {
  var numLOs = 42;
  return function (completed) {
    if (completed < numLOs / 4) {
      return 'danger';
    } else if (completed < numLOs / 2) {
      return 'warning';
    } else if (completed === numLOs) {
      return 'success';
    } else {
      return 'info';
    }
  }
});
