var socketApp = angular.module('socketApp',[]);

socketApp.controller('ChatController',['$http','$log','$scope',function($http,$log,$scope){
  io.socket.get('/chat/addconv');

  $http.get($scope.baseUrl+'/chat')
    .success(function(success_data){

      $scope.chatList = success_data;
      $log.info(success_data);
    });
}]);
