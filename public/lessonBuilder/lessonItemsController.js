angular.module('newApp')
.controller('lessonItems', function(modules, moduleItems, $scope, $routeParams){
    $scope.showContentType = {
        All: true,
        SubHeader: false,
        Assignment: false,
        External: false,
        File: false,
        Quiz: false
    };

    $scope.$watchCollection('showContentType', function () {
        if($scope.showContentType.All) {
            $scope.showContentType.SubHeader = true;
            $scope.showContentType.Assignment = true;
            $scope.showContentType.External = true;
            $scope.showContentType.File = true;
            $scope.showContentType.Quiz = true;
        }
    });

    $scope.matchType = function(query) {
      return function(contentItem) {
        var showItem = false;
        if($scope.showContentType.All) 
            return true;
        else if($scope.showContentType.SubHeader &&
                    (contentItem.type.match("SubHeader") ||
                     contentItem.type.match("Page")  ||
                     contentItem.type.match("External") ||
                     contentItem.type.match("File")))
            showItem = true;
        else if($scope.showContentType.Assignment && contentItem.type.match("Assignment"))
            showItem = true;
        else if($scope.showContentType.Quiz && contentItem.type.match("Quiz"))
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
        $scope.numAssessments = 0;
        $scope.numAssignments = 0;

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
                $scope.numAssessments++;
        }
    }

    // console.log($routeParams.id);
    $scope.loadPage = function(pageNum) {

        modules.get($routeParams.id, $routeParams.id2)
        .success(function(module){
            $scope.moduleName = module.name;
            moduleItems.get($routeParams.id, $routeParams.id2, pageNum)
            .success(function (lessonItems, status, headers) {
                var pgs = makePageMap(headers('link'));

                countItemTypes(lessonItems);
                $scope.pages = pgs;
                $scope.pageNumbers = createArray(pgs.last);
                $scope.lessonItems = lessonItems;
            });
        });
    }
    $scope.loadPage(1);
});
