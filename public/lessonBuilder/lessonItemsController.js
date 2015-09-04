angular.module('newApp')
.controller('lessonItems', function(modules, moduleItems, moduleMetadata, $scope, $routeParams){
    $scope.showContentType = {
        All: false,
        Lesson: true,
        Discussion: false,
        Assignment: false,
        ContentItem: false,
        Quiz: false
    };

    $scope.$watchCollection('showContentType', function () {

        // if($scope.showContentType.All) {
        //     $scope.showContentType.Lesson = false;
        //     $scope.showContentType.Assignment = false;
        //     $scope.showContentType.ContentItem = false;
        //     $scope.showContentType.Quiz = false;
        // } else if($scope.showContentType.Lesson) {
        //     $scope.showContentType.All = false;
        //     $scope.showContentType.Lesson = true;
        //     $scope.showContentType.Assignment = false;
        //     $scope.showContentType.ContentItem = false;
        //     $scope.showContentType.Quiz = false;
        // } else if($scope.showContentType.Assignment) {
        //     $scope.showContentType.All = false;
        //     $scope.showContentType.Lesson = false;
        //     $scope.showContentType.Assignment = true;
        //     $scope.showContentType.ContentItem = false;
        //     $scope.showContentType.Quiz = false;
        // }
    });

    $scope.matchType = function(query) {
      return function(contentItem) {
        var showItem = false;
        if($scope.showContentType.All) 
            return true;
        else if($scope.showContentType.Lesson && contentItem.type.match("SubHeader"))
            showItem = true;
        else if($scope.showContentType.ContentItem &&
                    (contentItem.type.match("Page")  ||
                     contentItem.type.match("External") ||
                     contentItem.type.match("File")))
            showItem = true;
        else if($scope.showContentType.Assignment && contentItem.type.match("Assignment"))
            showItem = true;
        else if($scope.showContentType.Quiz && contentItem.type.match("Quiz"))
            showItem = true;
        else if($scope.showContentType.Discussion && contentItem.type.match("Discussion"))
            showItem = true;
        return showItem;
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

    function createArray(count) {
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

    // console.log($routeParams.id);
    $scope.loadPage = function(pageNum) {

        modules.get($routeParams.id, $routeParams.id2)
        .success(function(module){
            $scope.module = module;
            moduleItems.get($routeParams.id, $routeParams.id2, pageNum)
            .success(function (lessonItems, status, headers) {
               var pgs = makePageMap(headers('link'));

               countItemTypes(lessonItems);
               $scope.pages = pgs;
               $scope.pageNumbers = createArray(pgs.last);
               $scope.lessonItems = lessonItems;

               moduleMetadata.get($routeParams.id2)
               .success(function(meta) {
                 $scope.module.learningObjectives = meta;
               });

            });
        });
    }
    $scope.loadPage(1);
});
