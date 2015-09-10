angular.module('newApp')
.filter('unassigned', function () {
  return function (tags) {
    if (!tags) return tags;
    return tags.filter(function (tag) {
      return !tag.activityId;
    });
  }
});
