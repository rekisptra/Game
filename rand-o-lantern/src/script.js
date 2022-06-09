// The Canvas
var canvas = document.getElementById('appcanvas');
context = canvas.getContext('2d');

// The 500x500 background image shown on "save".
var backgroundurl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/203277/pumpkin.png';

var FPS = 60;               // Using this to calculate FPS in the "game loop" (setInterval function)
var MAXV = 3;               // constant for max velocity (rate of change of speed | delta speed)
var EASINGSCALAR = 0.05;    // How fast the "easing occurs" (must be divisible into 10 without remainder)
var RESULTDELAY = 2500;     // time in ms before showing result page after reels stop
var REELOFFSET = 25;
var FADETIME = 750;

// Setting up elements as variables
var $playbtn = $('#play');
var $replaybtn = $('#replay');
var $savebtn = $('#save');
var $topreel = $('#topreel');
var $bottomreel = $('#bottomreel');
var $state0 = $('.state-0');
var $state1 = $('.state-1');
var $state2 = $('.state-2');
var $backgroundimage = $('#backgroundimage');
var $hint   = $('#hint');
var $controls = $('#controls');

// These are state variables that store data about the game and physics
var topreelx;           // position of the top "reel"
var bottomreelx;        // position of the bottom "reel"
var topreelv = 0;       // velocity of top reel  (used for easing)
var bottomreelv = 0;    // velocity of bottom reel

// Global state variables
var interval;               // Define the game loop interval
var topreelImageCount;      // These two are set by prepareImages() function to calculate how many..
var bottomreelImageCount;   // ..images are inside each reel.  Declared here so can be used globally.
var cycleState = 0;         // 0 = spin up both, 1 = spin down top, 2 = spin down bottom
var topSpinning = 0;        // 1 = top reel is spinning, 0 = it's not
var bottomSpinning = 0;     // 1 = bottom reel is spinning, 0 = it's not
var topDestination;         // stores top position final resting position
var bottomDestination;      // stores bottom reel final resting position
var flashMessageCount = 0;


$(document).ready(function(){
  prepareImages();
  setupButtonEvents();
});

function prepareImages(){
  // Count up all the images in each reel
  topreelImageCount = $topreel.children().length;
  bottomreelImageCount = $bottomreel.children().length;

  // Set width of each reel based on above count + 2 we are about to add for the "loop effect".
  // Units are in %, so each "eyes/mouth" image is 50% width, thus we multiply by 50
  $topreel.css({
    'width': ((topreelImageCount + 2) * 50) + '%'
  });
  $bottomreel.css({
    'width': ((bottomreelImageCount + 2) * 50) + '%'
  });

  // Clone the first 2 images for each reel and append them to the end of the
  // reel to accommodate for when the reel has passed all the way through the
  // container, keeps the animation seamless
  $topreel.find('img:nth-child(1)').clone().appendTo($topreel);
  $topreel.find('img:nth-child(2)').clone().appendTo($topreel);
  $bottomreel.find('img:nth-child(1)').clone().appendTo($bottomreel);
  $bottomreel.find('img:nth-child(2)').clone().appendTo($bottomreel);
}

function setupButtonEvents(){
  $playbtn.on('click', function(e){
    // Shift to the second state/page
    stateChange(1);
    $backgroundimage.addClass('show').fadeTo(FADETIME, 1);
    $hint.fadeTo(FADETIME, 0.65).show();
    startGameLoop();
  });

  $replaybtn.on('click', function(e){
    // Shift back to the first state/page
    stateChange(0);
    $controls.fadeTo(FADETIME, 0).hide();
  });
  $savebtn.on('click', function(e){
    saveCanvas();
  });

  window.addEventListener("touchend", touchStopReel, false);
  function touchStopReel(event) {
    if ($state1.hasClass('show')) {
      cycleState++;
    }
  }

  $(window).keypress(function (e) {
    e.preventDefault()

    if ($state0.hasClass('show')) {
      // Shift to the second state/page
      stateChange(1);
      $backgroundimage.addClass('show').fadeTo(FADETIME, 1);
      $hint.fadeTo(FADETIME, 0.65).show();
      startGameLoop();
    }
    else if ($state2.hasClass('show')) {
      // Shift back to the first state/page
      stateChange(0);
      $controls.fadeTo(FADETIME, 0).hide();
    }
    else {
      cycleState++;
    }
  });
}

function stateChange(s) {
  $('.state').removeClass('show').fadeTo(FADETIME, 0);
  $('.state-' + s).addClass('show').fadeTo(FADETIME, 1);
}

// Here is the magic part, this interval will loop, running the inside code once
// every interval
function startGameLoop() {
  // topSpinning/bottomSpinning, essentially boolean values, marking that the
  // reels are spinning.
  topSpinning = 1;
  bottomSpinning = 1;
  // Set initial reel x position, and account for offset with REELOFFSET, since
  // we're absolute positioning image: width - 50%.
  topreelx = -REELOFFSET;
  bottomreelx = -REELOFFSET;
  // setInterval function to set FPS, runs our gameUpdate and gameDraw function
  // 60 times a second.
  // For slow machines we're still updating at the same FPS, might just lose
  // frames.
  interval = setInterval(function(){
    // Inside the loop we update the logic of the game
    gameUpdate();
    // Then we draw the reels position based on the logic
    gameDraw();
  }, 1000/FPS);
}

// This just sets the absolute positon left/right of the "reel"
function gameDraw() {
  setPosition($topreel, topreelx, 'left');
  setPosition($bottomreel, bottomreelx, 'right');
}

 // Used in gameDraw to set the css left property of a given reel
function setPosition(ele, x, dir) {
  if(dir == 'left'){
    ele.css({'left': x + '%'});
  }
  else if(dir == 'right'){
    ele.css({'right': x + '%'});
  }
  else{
    console.log('ERROR - unexpected dir passed to setPosition()');
  }
}

// This is where the calculations for position go.  It runs each "frame"
function gameUpdate() {
  // Modding the reelx position by the total reel distance, allows the reel to loop

  // If you can divide the total width of the reel by the position of the reel,
  // do it, zeros out and restarts our loop

  // As reelx represents the x position of the reel, in modding it by the total
  // reel distance, we're able to find out when to restart the loop.

  // When reelx is equal to or greater than the total distance of the reel, we
  // can mod, so do it, and zero out the x position of the reel to restart our
  // loop.
  topreelx = topreelx % (topreelImageCount * 50);
  bottomreelx = bottomreelx % (bottomreelImageCount * 50);

  // Next, we set how far each reel is going to move on each frame as a function
  // of velocity.

  // Some context for values here, 100 is just 100% width, so if MAXV is set to
  // 1, then each frame the images can move at max the distance of 100% of an
  // image.

  // We adjust the velocity each frame to allow non-linear speed (easing) -
  // in spinUpBothReels. 100 is just 100% width, so if MAXV is 1, then each
  // frame the images can move at max the distance of 100% of an image

  // if topreelv or bottomreelv is 0, then that reel won't move.
  topreelx = topreelx - topreelv;
  bottomreelx = bottomreelx - bottomreelv;

  if (cycleState == 0) {
    spinUpBothReels();
  }
  else if(cycleState == 1) {
    stopTopReel();
  }

  // This is >= incase someone keeps pressing STOP button
  else if(cycleState >= 2) {
    stopTopReel();
    stopBottomReel();
  }
}

// Math for spinng up or down the reels // Revving up the reels
// Each time the function runs (each frame), increment the reel velocity by
// EASINGSCALAR (0.5) until we've reached max velocity.
// This allows for non linear easing as we're constantly adding to velocity (until we hit that maxv).
function spinUpBothReels() {
  // MAXV - fastest speed we want the reel to move
  // EASINGSCALAR - rate of change of velocity for each frame
  if(topreelv < MAXV){
    topreelv += EASINGSCALAR;
  }
  if(bottomreelv < MAXV) {
    bottomreelv += EASINGSCALAR;
  }
}

function stopTopReel() {
  if(topSpinning == 1) {
    // Calculate distance from center to align images
    // Take the reelx position, divide by 50 (the width of one image) to return
    // the number of images "up" reel.
    // Example being, if the x position is 125, dividing by 50 (actual width in
    // percentage of each image) and taking the ceiling will return 3 - we know
    // there are 3 images "up" reel and we want the next one as our final,
    // multiplying that integer by 50 to get the reelx position of that image,
    // and then account for the REELOFFSET
    topDestination = Math.ceil( topreelx / 50 ) * 50 - REELOFFSET;
    topreelx = topDestination;
    topSpinning = 0;
    topreelv = 0;
  }
}

function stopBottomReel() {
  bottomDestination = Math.ceil( bottomreelx / 50 ) * 50 - REELOFFSET;
  bottomreelx = bottomDestination;
  bottomSpinning = 0;
  bottomreelv = 0;
  processResults();
}

function processResults() {
  // Stops the Game Loop
  clearInterval(interval);

  setTimeout(function() {
    $backgroundimage.fadeTo((FADETIME * 2) + RESULTDELAY, 0).removeClass('show');
    $hint.fadeTo(FADETIME, 0).hide();

    // Shift to the third state/page
    stateChange(2);

    // Reset cyclestate
    cycleState = 0;
    buildCanvas();
    $controls.fadeTo(FADETIME, 1).show();
  }, RESULTDELAY);
}


function buildCanvas() {
  // Get the number of current eye/mouth and pull the src from the correct image
  var eyespos = -Math.floor(topreelx / 50) + 1;
  var eyesurl = $topreel.find('img:nth-child('+ eyespos +')').attr('src');
  var mouthpos = -Math.floor(bottomreelx / 50) + 1;
  var mouthurl = $bottomreel.find('img:nth-child('+ mouthpos +')').attr('src');

  // Load up all the images
  function loadMultiImages(sources, callback) {
    var images = {};
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        callback(images);
      };
      images[src].src = sources[src];
    }
  }

  function myLoadCallback(images) {
    context.drawImage(images.backing, 0, 0, 500, 500);
    context.drawImage(images.eyes, 0, 0, 500, 250);
    context.drawImage(images.mouth, 0, 250, 500, 250);
  }
  var sources = {
    backing: backgroundurl,
    eyes: eyesurl,
    mouth: mouthurl
  };
  loadMultiImages(sources, myLoadCallback);
}

function saveCanvas() {
  var finalImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  window.location.href= finalImage;
}
