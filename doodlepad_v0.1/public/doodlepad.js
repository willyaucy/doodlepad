$(document).ready(function () {
  Parse.initialize("Jtr3L83IPPWnhiRR6dnzD31sI16DXFYggd9WwYJX", "aXqKaRL8oYCrLenBr0ERdb4fEEOsTTDgGAg1MfUw");
  var Stroke = Parse.Object.extend("Stroke");

  // get a new session id
  var sessionId;
  Parse.Cloud.run('get_session', {}, {
    success: function(result) {
      sessionId = result;
      $('div#loading_overlay').fadeOut();
    },
    error: function(error) {
    }
  });
  //var noop = function () {};
  /*
  (function worker() {
    $.get('ajax/test.html', function(data) {
      // Now that we've completed the request schedule the next one.
      $('.result').html(data);
      setTimeout(worker, 5000);
    });
  })();


  window.query = new Parse.Query(TestObject);
  query.equalTo("objectId", "jcWKoybBKS");
  query.find({  
    success: function(results) {
      window.result = results;
    }
  });
  */
  //$('#canvasInAPerfectWorld')
  var context = document.getElementById('canvas').getContext("2d");

  $('#canvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
          
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
    redrawAll();
  });
  $('#canvas').mousemove(function(e){
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redrawAll();
    }
  });
  $('#canvas').mouseup(function(e){
    paint = false;
  });
  $('#canvas').mouseleave(function(e){
    paint = false;
  });
  $('button#clearAll').click(function() {
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
    checkedX = new Array(); checkedY = new Array(); checkedDrag = new Array();
    uploadX = new Array(); uploadY = new Array(); uploadDrag = new Array();
  });
  var others = {}; // stores the drawings by others (should never upload anything from here)
  var checkedX = new Array(); var checkedY = new Array(); var checkedDrag = new Array();
  var uploadX = new Array(); var uploadY = new Array(); var uploadDrag = new Array();
  var uploadingStrokes = false;
  var downloadingStrokes = false;
  var strokesTransmitted = 0; // discontinuous stroke is a sign of new client
  var paint;
  function downloadLatestStrokes() { // For now, download can wait. Upload can't wait. Fuck logic :/
    if (downloadingStrokes || uploadX.length != 0) { return false; }
    downloadingStrokes = true;
    var query = new Parse.Query(Stroke);
    //query.equalTo("objectId", "jcWKoybBKS");
    query.notEqualTo("sessionId", sessionId);
    query.ascending('clickIndex');
    query.select('sessionId', 'clickX', 'clickY', 'clickDrag');
    query.find({  
      success: function(results) {
        console.log("Successfully retrieved data");
        others = {};
        for (var i=0; i<results.length; i++) {
          var s = results[i];
          var sessionId = s.get('sessionId');
          if (!(sessionId in others)) { others[sessionId] = {'x':[], 'y':[], 'drag':[]}; }
          others[sessionId].x = others[sessionId].x.concat(JSON.parse(s.get('clickX')));
          others[sessionId].y = others[sessionId].y.concat(JSON.parse(s.get('clickY')));
          others[sessionId].drag = others[sessionId].drag.concat(JSON.parse(s.get('clickDrag')));
        }
        redrawAll();
      }
    });
    downloadingStrokes = false;
  };
  function uploadStrokes() {
    if (uploadingStrokes) { return false; }
    if (uploadX.length != 0) {
      uploadingStrokes = true;
      var stroke = new Stroke();
      var strokes_to_upload = uploadX.length;
      var x = JSON.stringify(uploadX.slice(0, strokes_to_upload));
      var y = JSON.stringify(uploadY.slice(0, strokes_to_upload));
      var drag = JSON.stringify(uploadDrag.slice(0, strokes_to_upload));
      stroke.save(
        {'sessionId': sessionId, 'clickIndex':strokesTransmitted, 'clickX':x, 'clickY':y, 'clickDrag':drag}, 
        {
          success: function(stroke) {
            console.log("Success");
            strokesTransmitted++;
            checkedX = checkedX.concat(uploadX.slice(0, strokes_to_upload));
            checkedY = checkedY.concat(uploadY.slice(0, strokes_to_upload));
            checkedDrag = checkedDrag.concat(uploadDrag.slice(0, strokes_to_upload));
            uploadX = uploadX.slice(strokes_to_upload);
            uploadY = uploadY.slice(strokes_to_upload);
            uploadDrag = uploadDrag.slice(strokes_to_upload);
            uploadingStrokes = false;
            return uploadStrokes();
          },
          error: function(stroke, error) {
            // use a queue for failed transmission. Make sure everything is transmitted in order.
            console.log("Failed");
            uploadingStrokes = false;
            return false;
            // The save failed.
            // error is a Parse.Error with an error code and description.
          }
        }
      );
    }
  }
  var downloadTask = setInterval(downloadLatestStrokes, 1000);
  function addClick(x, y, dragging) {
    uploadX.push(x);
    uploadY.push(y);
    uploadDrag.push(dragging);
    uploadStrokes();
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
});