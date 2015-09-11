angular.module('newApp')
.factory('lessonPlanItems', function($http, modules, moduleItems) {

  function findTeacherRes(modules, moduleName) {
    for(i = 0; i < modules.length; i++) {
      // find the module tha has moduleName AND "Teacher" in it.
      if((modules[i].name.indexOf(moduleName) !== -1) &&
         (modules[i].name.indexOf("Teacher") !== -1))
        return modules[i];
    }
  }

  return {
    match: function(courseID, moduleID, module, activities) {
      var teacherResModule;
      // Find the teacher Resource unit for the Unit i.e. the unit with the same
      // name as the current unit, with "Teacher Resources" in the name.

      modules.getAll(courseID)
      .then(function(response) {
        var units = response.data;
        for(i = 0; i < units.length; i++) {
          if(units[i].id == moduleID) {
            teacherResModule = findTeacherRes(units, module.name);
          }
        }
        return moduleItems.get(courseID, teacherResModule.id, 1)
      }).then(function(retData) {
        var teacherUnitItems = retData.data;
        for(i = 0; i < teacherUnitItems.length; i++) {
          if(teacherUnitItems[i].type === "Page") {
            // find the Unit lesson name, which is the first few characters
            // up to the ":" in the title of the item i.e. "DM 1: BLah",
            // "DM 1" is the lesson name.
            var regEx = /(.*):/;
            var lessonGrp = regEx.exec(teacherUnitItems[i].title);
            if(lessonGrp){
              var lessonName = lessonGrp[1].toLowerCase();
              for(j = 0; j < activities.length; j++) {
                // using toLowerCasse to make the matching case insensitive.
                var contentItemTitleStr = activities[j].title.toLowerCase();
                if(activities[j].type === "SubHeader" &&
                   (contentItemTitleStr.indexOf(lessonName) !== -1)) {
                  activities[j].lessonPlanID = teacherUnitItems[i].id;
                activities[j].lessonPlanUrl = teacherUnitItems[i].page_url;
                }
              }
            }
          }
        }
      }, function(xhr, state, error) {
        console.log(arguments);
      });
    }
  }
})


