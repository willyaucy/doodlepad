function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4()+s4()+s4()+s4()+s4()+s4()+s4()+s4();
}
Parse.Cloud.define('get_session', function(request, response) {
  response.success(guid());
});
/*
Parse.Cloud.define('send_strokes', function(request, response) {
    var sessionId = request.object.get('sessionId');
    var uploadX = request.object.get('uploadX');
    var uploadY = request.object.get('uploadY');
    var uploadDrag = request.object.get('uploadDrag');
});
*/