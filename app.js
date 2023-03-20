var app = angular.module('dogApp', []);

app.controller('dogController', function($scope, $http) {
  $scope.breedName = '';
  $scope.breedDetails = {};
  $scope.showDetails = false;
  $scope.showHistory = false;

  $scope.getDogDetails = function() {
    $http.get('http://localhost:3000/breed/details/' + $scope.breedName)
      .then(function(response) {
        $scope.breedDetails = response.data;
        $scope.showDetails = true;
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  $scope.getDogHistory = function() {
    $http.get('http://localhost:3000/breed/history')
    .then(function(response) {
      $scope.dogHistory = response.data;
      $scope.showHistory = true;
    })
    .catch(function(error) {
      console.log(error);
    });
  };

});
