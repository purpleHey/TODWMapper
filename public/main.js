angular.module('newApp', ['ngRoute', 'ui.bootstrap', 'ngDraggable', 'textAngular'])
.config(function($routeProvider){

  function withDefaultRemote (name, route) {
    route.resolve || (route.resolve = {});
    route.resolve[name] = function ($route, createRemote) {
      var segments = $route.current.$$route.originalPath.split('/').slice(1);
      return segments.reduce(function (parent, segment) {
        return parent.child(segment[0] === ':' ? $route.current.params[segment.slice(1)] : segment);
      }, createRemote('canvas'));
    };
    return route;
  }

  $routeProvider
  .when('/', {
    templateUrl: '/home.html'
  })
  .when('/csp-framework', {
    templateUrl: '/cspFramework/cspFrameworkHome.html'
  })
  .when('/courses', withDefaultRemote('remoteCourses', {
    controller: 'courses',
    templateUrl: '/courses/courses.html'
  }))
  .when('/courses/:id', withDefaultRemote('remoteCourse', {
    controller: 'course',
    templateUrl: '/courses/course.html'
  }))
  .when('/courses/:id/modules/:id2', withDefaultRemote('remoteUnit', {
    controller: 'unit',
    templateUrl: '/unit/unit.html'
  }))
  .when('/courses/:id/modules/:id2/activity/:activityID', {
    controller: 'lesson',
    templateUrl: '/lesson/lesson.html'
  })
  .otherwise('/');
});
