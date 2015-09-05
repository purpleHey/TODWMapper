angular.module('newApp')
.controller('lessonItems', function(modules, moduleItems, moduleMetadata, unitItems, $scope, $routeParams){

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
            if(modules[i].name.search(moduleName) != -1) {
                if(modules[i].name.search("Teacher") != -1)
                    return modules[i];
            }
        }
    }

    // console.log($routeParams.id);
    $scope.loadPage = function(pageNum) {

        // unitItems.get($routeParams.id, $routeParams.id2, 1)
        // .success(function(unitItems) {
        //   countItemTypes(unitItems);
        //   moduleMetadata.get($routeParams.id2)
        //   .success(function(meta) {
        //     $scope.module.learningObjectives = meta;
        //   });
        // });

        // var mods = modules.getAll($routeParams.id);
        
        modules.get($routeParams.id, $routeParams.id2)
        .success(function(module, status, headers) {

            modules.getAll($routeParams.id)
            .success(function(modules, status, headers) {
                // 
                for(i = 0; i < modules.length; i++) {
                    if(modules[i].id == $routeParams.id2) {
                        $scope.module = modules[i];
                        teacherRes = findTeacherRes(modules, module.name);
                    }
                }
                moduleItems.get($routeParams.id, teacherRes.id, 1)
                .success(function(teacherUnitItems, status, headers) {
                    moduleItems.get($routeParams.id, $routeParams.id2, 1)
                    .success(function(unitItems, status, headers) {
                        $scope.lessonItems = unitItems;
                        countItemTypes(unitItems);
                        for(i = 0; i < teacherUnitItems.length; i++) {
                            if(teacherUnitItems[i].type === "Page") {
                                var regEx = /(.*):/;
                                var lessonName = regEx.exec(teacherUnitItems[i].title);
                                for(j = 0; j < unitItems.length; j++) {
                                    // console.log(unitItems[j]);
                                    if(unitItems[j].type === "SubHeader" &&
                                           (unitItems[j].title.search(lessonName[1]) != -1)) {
                                        unitItems[j].lessonPlanID = teacherUnitItems[i].id;
                                        unitItems[j].lessonPlanUrl = teacherUnitItems[i].html_url;
                                        console.log("Lesson Plan ID", unitItems[j].lessonPlanID,
                                            "URL: ", unitItems[j].lessonPlanUrl);
                                    }
                                }
                            }
                        }
                        moduleMetadata.get($routeParams.id2)
                        .success(function(meta, status, headers) {
                            $scope.module.learningObjectives = meta;
                        })
                    })
                })
            })

        }, function(xhr, state, error) {
            console.log(arguments);
        });

        // modules.get($routeParams.id, $routeParams.id2)
        // .success(function(module){
        //     $scope.module = module;
        //     moduleItems.get($routeParams.id, $routeParams.id2, pageNum)
        //     .success(function (lessonItems, status, headers) {
        //         // get the 
        //        var pgs = makePageMap(headers('link'));

        //        countItemTypes(lessonItems);
        //        $scope.pages = pgs;
        //        $scope.pageNumbers = createIntArray(pgs.last);
        //        $scope.lessonItems = lessonItems;

        //        moduleMetadata.get($routeParams.id2)
        //        .success(function(meta) {
        //          $scope.module.learningObjectives = meta;
        //        });
        //     });
        // });
    }
    $scope.loadPage(1);
});
