angular.module('MainModule', [])
  .config(['$interpolateProvider', function($interpolateProvider){
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
  }]);
