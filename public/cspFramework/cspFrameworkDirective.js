angular.module('newApp')
/*
 * Angular directives do not support recursion,
 * and attempts to do so natively will cause the
 * compilation phase to last indefinitely.
 * This helper removes the directive's content
 * and re-inserts it in the linking phase.
 *
 * See http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
 */
.factory('recursionHelper', function ($compile) {
    return {
        compile: function (element, link) {
            if (angular.isFunction(link)) {
                link = { post: link }
            }

            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                post: function (scope, element) {
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
})
.directive('cspEntity', function (recursionHelper) {
    return {
        restrict: 'E',
        templateUrl: '/cspFramework/cspEntity.html',
        scope: {
            entity: '='
        },
        compile: function (element) {
            return recursionHelper.compile(element);
        }
    };
})
.directive('cspFramework', function (cspFramework) {
    return {
        restrict: 'E',
        templateUrl: '/cspFramework/cspFramework.html',
        link: function (scope) {
            cspFramework.all().then(function (framework) {
                scope.framework = framework;
            });
        }
    };
});
