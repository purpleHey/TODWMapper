angular.module('newApp')
.controller('lessonItems', function(moduleItems, $scope, $routeParams){
    $scope.contentType = {
        All: false,
        SubHeader: true,
        Assignment: false,
        External: false,
        Quiz: false
    };

    $scope.$watchCollection('contentType', function () {
      $scope.checkResults = [];
      angular.forEach($scope.contentType, function (value, key) {
       if (value) {
         $scope.checkResults.push(key);
       }
      })
    });

    $scope.matchType = function(query) {
      return function(contentItem) {
        if($scope.contentType.All) 
            return true;
        else if($scope.contentType.SubHeader)
            return contentItem.type.match("SubHeader");
        else if($scope.contentType.Assignment)
            return contentItem.type.match("Assignment");
        else if($scope.contentType.External)
            return contentItem.type.match("External");
        else if($scope.contentType.Quiz)
            return contentItem.type.match("Quiz");
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

    function findSubHeaders(lessonItems) {
        var subHeaders = [];

        for(var i = 0; i < lessonItems.length; i++) {
            if(lessonItems[i].type === 'SubHeader')
                subHeaders.push(lessonItems[i]);
        }
        return subHeaders;
    }

    // console.log($routeParams.id);
    $scope.loadPage = function(pageNum) {

        moduleItems.get($routeParams.id, $routeParams.id2, pageNum)
        .success(function (lessonItems, status, headers) {
            var pgs = makePageMap(headers('link'));

            // var subHeaders = findSubHeaders(lessonItems);
            // console.log(subHeaders);
            $scope.pages = pgs;
            $scope.pageNumbers = createArray(pgs.last);
            $scope.lessonItems = lessonItems;
        })
    }
    $scope.loadPage(1);
});
