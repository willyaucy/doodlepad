/* global $ */
/* global angular */
angular.module('MainModule')
  .directive('drawingBoard', function() {
    console.log("lol");
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/templates/drawing-board.ejs',
      controller: ['$http', '$log', '$scope', '$element', function($http, $log, $scope, $element) {
        var $canvas = $element.find('#canvas');
        var canvas = $canvas[0];
        var context = canvas.getContext("2d");

        $scope.$element = $element;

        $scope.hh = function() {
          return $element.height();
        };

        $canvas.mousedown(function(e){
          var x = e.pageX - findPos(this).x;
          var y = e.pageY - findPos(this).y;

          paint = true;
          addClick(x, y, false);
          redrawAll();
        });
        $canvas.mousemove(function(e){
          if(paint){
            var x = e.pageX - findPos(this).x;
            var y = e.pageY - findPos(this).y;
            addClick(x, y, true);
            redrawAll();
          }
        });
        $canvas.mouseup(function(e){
          paint = false;
        });
        $canvas.mouseleave(function(e){
          paint = false;
        });
        $element.find('button#clearAll').click(function() {
          var query = new Parse.Query(Stroke);
          query.find({
            success: function(results) {
              results.forEach(function (result) {
                result.destroy();
                result.save();
              });
            }
          });
          others = {}; // stores the drawings by others (should never upload anything from here)
          checkedX = []; checkedY = []; checkedDrag = [];
          uploadX = []; uploadY = []; uploadDrag = [];
        });
        var others = {}; // stores the drawings by others (should never upload anything from here)
        var checkedX = []; var checkedY = []; var checkedDrag = [];
        var uploadX = []; var uploadY = []; var uploadDrag = [];
        var paint;
        function addClick(x, y, dragging) {
          uploadX.push(x);
          uploadY.push(y);
          uploadDrag.push(dragging);
        }
        function draw(x, y, drag){
          for(var i=0; i < x.length; i++) {
            context.beginPath();
            if(drag[i] && i){
              context.moveTo(x[i-1], y[i-1]);
            }else{
              context.moveTo(x[i], y[i]);
            }
            context.lineTo(x[i], y[i]);
            context.closePath();
            context.stroke();
          }
        }
        function redrawAll() {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
          context.strokeStyle = "#df4b26";
          context.lineJoin = "round";
          context.lineWidth = 5;
          draw(checkedX, checkedY, checkedDrag);
          draw(uploadX, uploadY, uploadDrag);
          for (var sid in others) {
            var drawing = others[sid];
            var x=drawing.x; var y=drawing.y; var drag=drawing.drag;
            draw(x, y, drag);
          }
        }
        function findPos(obj) {
          var curleft = 0, curtop = 0;
          if (obj.offsetParent) {
            do {
              curleft += obj.offsetLeft;
              curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
          }
          return undefined;
        }
        console.log('initializing');
        canvas.width = $element.find('.canvas-wrapper').width();
        canvas.height = $element.find('.canvas-wrapper').height();
        canvas.style.width = $element.find('.canvas-wrapper').width() + 'px';
        canvas.style.height = $element.find('.canvas-wrapper').height() + 'px';
        redrawAll();

        $element.find('.canvas-wrapper').resizable({
          resize: function(event, ui) {
            canvas.width = $element.find('.canvas-wrapper').width();
            canvas.height = $element.find('.canvas-wrapper').height();
            canvas.style.width = $element.find('.canvas-wrapper').width() + 'px';
            canvas.style.height = $element.find('.canvas-wrapper').height() + 'px';
            redrawAll();
            //$scope.$digest();
          }
        });
      }]
    };
  });
