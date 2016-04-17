var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$http', function($scope, $http) {
 $http.get("http://localhost:9999/all")
    .then(function(res){
      $scope.videos = res.data;
    });
}]);

