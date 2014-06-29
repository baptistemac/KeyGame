window.onload = init;
var context;
var bufferLoader;

function init() {
  console.log("sound init");
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'assets/sounds/bubbles.mp3',
      'assets/sounds/clay.mp3',
      'assets/sounds/confetti.mp3',
      'assets/sounds/corona.mp3',
      'assets/sounds/dotted-spiral.mp3'
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  console.log("sound finishedLoading");
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);
  source1.start(0);
  source2.start(0);
}