//
// Buffer loader
//


function BufferLoader(context, urlList, callback) {
  console.log("BufferLoader");
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}





//
// Play sound
//


var context;
var bufferLoader;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();


function play( sound ) {

  console.log("sound play", sound);
  bufferLoader = new BufferLoader(
    context,
    [ 'assets/sounds/'+sound ],
    finishedLoading
  );
  bufferLoader.load();

}


function finishedLoading(bufferList) {

  console.log("sound finishedLoading");
  var source1 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source1.connect(context.destination);
  source1.start(0);

}
