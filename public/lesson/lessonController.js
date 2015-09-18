angular.module('newApp')
.controller('lesson', function(remoteCourses, remoteTags, $scope, $routeParams){

  var remotePage = remoteCourses.id($routeParams.id).child('pages').id($routeParams.pageUrl);

  remotePage.get()
  .then(function(response) {
    $scope.page = response.data;
  })

  $scope.$on('$locationChangeStart', function( event ) {
  var answer = confirm("Are you sure you want to leave this page?");
    if (!answer) {
        event.preventDefault();
    }
  });

  $scope.save = function(body){
    // remotePage.put({ body: body });
  };
});