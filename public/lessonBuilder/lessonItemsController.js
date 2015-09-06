angular.module('newApp')
.controller('lessonItems', function(modules, moduleItems, tags, $scope, $routeParams){

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

    function findTeacherRes(modules, moduleName) {
        for(i = 0; i < modules.length; i++) {
            // find the module tha has moduleName AND "Teacher" in it.
            if((modules[i].name.indexOf(moduleName) !== -1) &&
               (modules[i].name.indexOf("Teacher") !== -1))
                return modules[i];
        }
    }

    // console.log($routeParams.id);
    $scope.loadPage = function(pageNum) {

        modules.get($routeParams.id, $routeParams.id2)
        .then(function(retData) {
            module = retData.data;    
            return modules.getAll($routeParams.id);
        }).then(function(retData) {
            modules = retData.data;
            // Find the teacher Resource unit for the Unit i.e. the unit with the same
            // name as the current unit, with "Teacher Resources" in the name.
            for(i = 0; i < modules.length; i++) {
                if(modules[i].id == $routeParams.id2) {
                    $scope.module = modules[i];
                    teacherRes = findTeacherRes(modules, module.name);
                }
            }
            return moduleItems.get($routeParams.id, teacherRes.id, 1);
        }).then(function(retData) {
            teacherUnitItems = retData.data;
            return moduleItems.get($routeParams.id, $routeParams.id2, 1);
        }).then(function(retData) {
            unitItems = retData.data;
            $scope.lessonItems = unitItems;
            countItemTypes(unitItems);
            for(i = 0; i < teacherUnitItems.length; i++) {
                if(teacherUnitItems[i].type === "Page") {
                    // find the Unit lesson name, which is the first few characters
                    // up to the ":" in the title of the item i.e. "DM 1: BLah",
                    // "DM 1" is the lesson name.
                    var regEx = /(.*):/;
                    var lessonGrp = regEx.exec(teacherUnitItems[i].title);
                    lessonName = lessonGrp[1].toLowerCase();
                    for(j = 0; j < unitItems.length; j++) {
                        // using toLowerCasse to make the matching case insensitive.
                        var contentItemTitleStr = unitItems[j].title.toLowerCase();
                        if(unitItems[j].type === "SubHeader" &&
                           (contentItemTitleStr.indexOf(lessonName) !== -1)) {
                            unitItems[j].lessonPlanID = teacherUnitItems[i].id;
                        unitItems[j].lessonPlanUrl = teacherUnitItems[i].html_url;
                        }
                    }
                }
            }
            return tags.search({ unitId: $routeParams.id2 });
        }).then(function(retData) {
            $scope.module.tags = retData.data;

        }, function(xhr, state, error) {
            console.log(arguments);
        });
    }
    $scope.loadPage(1);
});
