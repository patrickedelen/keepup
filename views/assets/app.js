var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$http', function($scope, $http) {
 $http.get("http://kuapi.pedelen.com/all")
    .then(function(res){
      $scope.videos = res.data;
    });
}]);

