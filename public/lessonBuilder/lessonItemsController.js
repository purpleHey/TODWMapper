angular.module('newApp')
.controller('lessonItems', function(moduleItems, $scope, $routeParams){
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

    console.log($routeParams.id);
    $scope.loadPage = function(pageNum) {

        moduleItems.get($routeParams.id, $routeParams.id2, pageNum)
        .success(function (lessonItems, status, headers) {
            var pgs = makePageMap(headers('link'));

            console.log(pgs);
            $scope.pages = pgs;
            $scope.pageNumbers = createArray(pgs.last);
            $scope.lessonItems = lessonItems;
        })
    }
    $scope.loadPage(1);
});
