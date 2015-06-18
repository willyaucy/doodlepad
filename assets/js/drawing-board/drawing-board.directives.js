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

        var others = {}; // stores the drawings by others (should never upload anything from here)
        var checkedX = []; var checkedY = []; var checkedDrag = [];
        var uploadX = []; var uploadY = []; var uploadDrag = [];
        var paint;

        /*
         * drawing example:
         * [
         *   [ {x:123, y:456} ],
         *   [ {x:23, y:35} ],
         *   [ {x:34, y:684} ],
         *   [ {x:159, y:314} ],
         * ]
         */
        var postedDrawings = [];
        var pendingDrawings = [];
        var currentStroke = null;

        $canvas.mousedown(function(e){
          var x = e.pageX - findPos(this).x;
          var y = e.pageY - findPos(this).y;
          currentStroke = [];

          addClick(x, y);
          redrawAll();
        });
        $canvas.mousemove(function(e){
          if(_.isArray(currentStroke)){
            var x = e.pageX - findPos(this).x;
            var y = e.pageY - findPos(this).y;
            addClick(x, y);
            redrawAll();
          }
        });
        $canvas.mouseup(finalizeStroke);
        $canvas.mouseleave(finalizeStroke);
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

        function finalizeStroke() {
          if (!_.isArray(currentStroke)) {
            return;
          }
          pendingDrawings.push(currentStroke);
          currentStroke = null;
          //redrawAll();
        }

        function addClick(x, y) {
          if (!_.isArray(currentStroke)) {
            throw("currentStroke is not an array");
          }

          currentStroke.push({x:x, y:y});
        }

        function draw(drawing) {
          context.beginPath();
          var startPoint = _.first(drawing);

          context.moveTo(startPoint.x, startPoint.y);

          drawing.slice(1).forEach(function(point) {
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(point.x, point.y);
            startPoint = point;
          });
          context.closePath();
          context.stroke();
        }


        function redrawAll() {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
          context.strokeStyle = "#df4b26";
          context.lineJoin = "round";
          context.lineWidth = 5;

          postedDrawings.forEach(draw);
          pendingDrawings.forEach(draw);
          currentStroke && draw(currentStroke);
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

        function synchronizeCanvasSizeWithWrapper() {
          canvas.width = $element.find('.canvas-wrapper').width();
          canvas.height = $element.find('.canvas-wrapper').height();
          canvas.style.width = $element.find('.canvas-wrapper').width() + 'px';
          canvas.style.height = $element.find('.canvas-wrapper').height() + 'px';
        }

        console.log('initializing');
        synchronizeCanvasSizeWithWrapper();
        redrawAll();

        $element.find('.canvas-wrapper').resizable({
          resize: function(event, ui) {
            synchronizeCanvasSizeWithWrapper();
            redrawAll();
            //$scope.$digest();
          }
        });
      }]
    };
  });
