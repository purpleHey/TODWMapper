angular.module('newApp')
.directive('learningObjective', function (cspFramework) {
    return {
        restrict: 'E',
        template: '<a ng-href="#/csp-framework?id={{id}}" class="btn btn-info btn-sm" tooltip="{{description}}">{{id}}</a>',
        scope: {
            id: '@'
        },
        link: function (scope) {
            cspFramework.lookup(scope.id).then(function (description) {
                scope.description = description;
            });
        }
    };
});
