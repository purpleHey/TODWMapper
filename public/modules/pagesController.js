angular.module('newApp')
.controller('pages', function(pages, page_url, $sce, $modal, $scope, $routeParams, $http){

  pages.get($routeParams.id, page_url)
  .then(function (response) {
    $scope.page = $sce.trustAsHtml(response.data.body);
  })
})
