angular.module('newApp')
.controller('modalModuleMap', function($scope, $modalInstance, CSPFrameworkMap, unitLOs, moduleName){
    $scope.unit = 1;
    $scope.moduleName = moduleName;
    // create a copy...
    $scope.unitLOs = [];

    if(unitLOs)
      $scope.unitLOs = unitLOs.slice();

    CSPFrameworkMap.get()
    .success(function(unitMap) {
        $scope.bigIdeas = unitMap;
    })

    $scope.toggleLOinUnit = function(loID){
        // see if the lo is already in the list...
        var index = $scope.unitLOs.indexOf(loID);
        if(index === -1) {
            // THis LO is not in the unit, so add it.
            $scope.unitLOs.push(loID);
        } else {
            $scope.unitLOs.splice(index, 1);
        }
    };

  $scope.ok = function () {
    // var loIDs = [];
    // for(i = 0; i < $scope.unitLOs.length; i++) {
    //     loIDs[i] = $scope.unitLOs[i].id;
    // }
    $modalInstance.close($scope.unitLOs);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

