angular.module('newApp')
.directive('learningObjective', function (cspFramework) {
    return {
        restrict: 'E',
        templateUrl: 'cspFramework/learningObjective.html',
        scope: {
            id: '@'
        },
        link: function (scope, element, attrs) {
            cspFramework.lookup(scope.id).then(function (description) {
                scope.description = description;
            });
            scope.expanded = attrs.hasOwnProperty('expanded');
        }
    };
});
