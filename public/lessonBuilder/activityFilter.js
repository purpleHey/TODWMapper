angular.module('newApp')
.filter('activity', function () {
  return function (activities, type) {
    if (!activities || type === 'All') return activities;

    var key = activities[0].type ? 'type' : 'activityType'
    return activities.filter(function (activity) {
      return activity[key] === type;
    });
  }
});
