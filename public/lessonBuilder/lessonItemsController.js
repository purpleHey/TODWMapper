angular.module('newApp')
.controller('lessonItems', function(modules, moduleItems, tags, lessonPlanItems, $modal, $q, $scope, $routeParams){

    $scope.radioModel = 'Lesson';

    $scope.matchType = function(query) {
        return function(contentItem) {
            if($scope.radioModel === 'All') 
                return true;
            else if($scope.radioModel === 'Lesson')
                return contentItem.type.match('SubHeader');
            else if($scope.radioModel === 'Quiz')
                return contentItem.type.match('Quiz');
            else if($scope.radioModel === 'Assignment')
                return contentItem.type.match('Assignment');
            else if($scope.radioModel === 'Discussion')
                return contentItem.type.match('Discussion');
        }
    };

    function makePageMap(headers) {
        var pageObjs = {};
        var pageArr = headers.split(',').map(function(str) {
            return str.match(/page=(\d+).*rel="(\w+)/);
        });
        pageArr.forEach(function(pageMatchs) {
            pageObjs[pageMatchs[2]] = pageMatchs[1];
        });

        return pageObjs;
    }

    function createIntArray(count) {
        var array = [];
        for (var i = 0; i < count; i++) {
            array[i] = i+1;
        };
        return array;
    }

    function countItemTypes(lessonItems) {
        $scope.numLessons = 0;
        $scope.numContentItems = 0;
        $scope.numQuizes = 0;
        $scope.numAssignments = 0;
        $scope.numDiscussions = 0;

        for(var i = 0; i < lessonItems.length; i++) {
            var type = lessonItems[i].type;
            if(type === 'SubHeader')
                $scope.numLessons++;
            else if(type === 'Page' || 
                    type === 'File' ||
                    type === 'External')
                $scope.numContentItems++;
            else if(type === 'Assignment')
                $scope.numAssignments++;
            else if(type === 'Quiz')
                $scope.numQuizes++;
            else if(type === 'Discussion')
                $scope.numDiscussions++;
        }
    }

    $scope.toggleDropZones = function (isShown) {
        $scope.showDropZones = isShown;
    };

    $scope.onDrop = function (tag, activity) {
        var newTag = utils.pick(tag, ['courseId', 'unitId', 'content']);
        newTag.activityId = activity.id;
        newTag.activityType = activity.type;
        if (!utils.find($scope.tags, newTag)) {
            tags.create(newTag).then(function (response) {
                $scope.tags.push(response.data);
            });
        }
    };

    $scope.deleteTag = function (tag) {
        tags.delete(tag).then(function () {
            $scope.tags.splice($scope.tags.indexOf(tag), 1);
        });
    };

    $scope.deleteTagsByContent = function (content) {
        var tagsToDelete = $scope.tags.filter(function (tag) {
            return tag.content === content;
        });

        $modal.open({
            templateUrl: 'lessonBuilder/confirmTagDeletion.html',
            controller: function ($scope) {
                $scope.content = content;
                $scope.numTags = tagsToDelete.length - 1;
            },
            size: 'sm'
        }).result.then(function () {
            return tagsToDelete.map($scope.deleteTag);
        });
    };

   $scope.open = function (page_url) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modules/page.html',
            controller: 'pages',
            size: 'lg',
            resolve: {
                page_url: function () { return page_url; }
            }
        });
    }

    // console.log($routeParams.id);
    $scope.loadPage = function(pageNum) {

        $q.all([
            modules.get($routeParams.id, $routeParams.id2),
            moduleItems.get($routeParams.id, $routeParams.id2, 1),
            tags.search({ unitId: $routeParams.id2 })
        ])
        .then(function(responses) {
            $scope.module = responses[0].data;
            $scope.lessonItems = responses[1].data;
            countItemTypes($scope.lessonItems);
            $scope.tags = responses[2].data;

            lessonPlanItems.match($routeParams.id, $routeParams.id2, $scope.module, $scope.lessonItems);
        });
    }

    $scope.loadPage(1);
});
