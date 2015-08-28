angular.module('newApp')
.controller('modalModuleMap', function($scope, CSPFrameworkMap){
    $scope.unit = 1;
    $scope.unitLOs = [];
    // {
    //  'id': '1.1.1',
    //  'description': 'Apply a creative development process when creating computational artifacts. [P2]'
    // },
    // {
    //  'id': '1.2.3',
    //  'description': 'Create a new computational artifact by combining or modifying existing artifacts. [P2]'
    // }
    // ];
    CSPFrameworkMap.get()
    .success(function(unitMap) {
        $scope.bigIdeas = unitMap;
    })

    $scope.toggleLOinUnit = function(lo){
        var index = $scope.unitLOs.indexOf(lo);
        if(index === -1) {
            // THis LO is not in the unit, so add it.
            $scope.unitLOs.push(lo);
        } else {
            $scope.unitLOs.splice(index, 1);
        }
        console.log(lo);
    };
});
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

// angular.module('newApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

//   $scope.ok = function () {
//     $modalInstance.close($scope.unitLOs);
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
// });

