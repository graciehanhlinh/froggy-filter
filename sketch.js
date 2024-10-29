/*
based on FACE DETECTION: SIMPLE
Jeff Thompson | 2021 | jeffreythompson.org
*/

let video;  // webcam input
let model;  // BlazeFace machine-learning model
let face;   // detected face
let frogs = [];
let selectedFrog;
let stopped;
let timer;

function setup() {
  createCanvas(640, 480);
  
  for(i = 0; i < 11; i++){
    frogs[i] = loadImage('FroggieImages/frog' + i + '.jpg');
  }
  
  impact = loadFont('Font/Impacted.ttf');
  
  video = createCapture(VIDEO);
  video.hide();

  // load the BlazeFace model
  loadFaceModel();
  rectMode(CORNERS);
  fill(255,0,200,120);
}

async function loadFaceModel() {
  model = await blazeface.load();
}

function draw() {
  background(0);
  
  // Mirror the video by translating and scaling the canvas
  translate(width, 0);  // move the canvas to the right
  scale(-1, 1);         // flip the canvas horizontally

  // Draw the video feed
  image(video, 0, 0, width, height);
  
  // Reset translation and scale for other elements
  translate(width, 0);  
  scale(-1, 1);         

  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }

  // if we have face data, display it
  if (face !== undefined) {
    let x1 = face.topLeft[0]; 
    let y1 = face.topLeft[1];
    let x2 = face.bottomRight[0];
    let y2 = face.bottomRight[1];

    // frog images start running
    image(random(frogs), x1, y1-200, 180, 180);  
  
    // randomly selecting an image from the running images
    if (!stopped) {
      selectedFrog = random(frogs);
      if (selectedFrog) {
        image(selectedFrog, x1, y1-200, 180, 180);
      } 
      
      // the image stops for a few seconds
      if (millis() - timer > 3000) {
        selectedFrog = null;
        timer = millis();
      }
    }

    // stop and display the selected image
    if (stopped && selectedFrog) {
      image(selectedFrog, x1, y1-200, 180, 180);
    }
    
    // text
    textSize(48);
    textFont(impact);
    text('what frog are you?', 150, 70);
    fill(225); 
    stroke(0);
  }
}

// The Coding Train Reference: https://www.youtube.com/watch?v=nGfTjA8qNDA for using function setTimeout()
function mouseClicked() {
  stopped = true;
  timer = millis();
  setTimeout(restart, 3000);
}

// reset the filter after the click
function restart() {
  stopped = false;
  selectedFrog = null;
}

async function getFace() {
  // get predictions using the video as
  // an input source (can also be an image
  // or canvas!)
  const predictions = await model.estimateFaces(
    document.querySelector('video'),
    false
  );

  // if there were no predictions, set face to undefined
  if (predictions.length === 0) {
    face = undefined;
  }
  // otherwise, grab the first face
  else {
    face = predictions[0];
  }
}
