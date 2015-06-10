angular.module('MainModule')
  .directive('drawingBoard', function() {
    console.log("lol");
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/templates/drawing-board.ejs',
      controller: ['$http','$log','$scope', function($http,$log,$scope) {

      }]
    };
  });
