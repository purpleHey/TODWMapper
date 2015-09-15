angular.module('newApp')
.controller('pages', function($sce, $scope, remotePage){

  remotePage.get()
  .then(function (response) {
    $scope.page = $sce.trustAsHtml(response.data.body);
  })
})
