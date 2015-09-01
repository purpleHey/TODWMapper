angular.module('newApp', ['ngRoute', 'ui.bootstrap'])
.config(function($routeProvider){
    $routeProvider
    .when('/csp-framework', {
        templateUrl: '/cspFramework/cspFrameworkHome.html'
    })
    .when('/courses', {
        controller: 'courses',
        templateUrl: '/courses/courses.html'
    })
    .when('/courses/lesson', {
        controller: 'lessonBuilder',
        templateUrl: '/lessonBuilder/lessonBuilder.html'
    })
    .when('/courses/:id', {
        controller: 'modules',
        templateUrl: '/modules/modules.html'
    })
    .when('/courses/:id/module/:id2', {
        controller: 'lessonItems',
        templateUrl: '/lessonBuilder/lessonItems.html'
    })
    .otherwise('/courses');
});
