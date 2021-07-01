let video;
let latestPrediction = null;

const LIPSTICK_COLOR = "#B80159";

// p5 function
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // ml5 function
  let facemesh = ml5.facemesh(video, () => {
    console.log("Model is ready!");
  });

  // ml5 function
  facemesh.on("predict", (results) => {
    // results is an Array
    // we care about the first object only
    // results[0]
    latestPrediction = results[0];
    console.log(latestPrediction);
  });

  video.hide();
}

// p5 function
function draw() {
  // draw webcam video
  image(video, 0, 0, width, height);

  if (!latestPrediction) return; // don't draw anything else
  //-----------------------------------

  // set the lipstick color
  noStroke();
  fill(color(LIPSTICK_COLOR));

  drawUpperLip();
  drawLowerLip();
}

function drawUpperLip() {
  // get the points on the facemesh
  let lipsUpperOuter = latestPrediction.annotations.lipsUpperOuter;
  let lipsUpperInner = [
    ...latestPrediction.annotations.lipsUpperInner,
  ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */

  // draw the actual shape
  beginShape();
  // draw from left to right along the top of the upper lip
  lipsUpperOuter.forEach((point) => {
    curveVertex(point[0 /* x */], point[1 /* y */]); // using curveVertex for smooth lines
  });
  // draw back from right to left along the bottom of the upper lip
  lipsUpperInner.forEach((point) => {
    curveVertex(point[0 /* x */], point[1 /* y */]);
  });
  endShape(CLOSE); // CLOSE makes sure we join back to the beginning
}

function drawLowerLip() {
  // get the points on the facemesh
  let lipsLowerOuter = latestPrediction.annotations.lipsLowerOuter;
  let lipsLowerInner = [
    ...latestPrediction.annotations.lipsLowerInner,
  ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */

  // draw the actual shape
  beginShape();
  // draw from left to right along the bottom of the lower lip
  lipsLowerOuter.forEach((point) => {
    curveVertex(point[0 /* x */], point[1 /* y */]); // using curveVertex for smooth lines
  });
  // draw back from right to left along the top of the lower lip
  lipsLowerInner.forEach((point) => {
    curveVertex(point[0 /* x */], point[1 /* y */]);
  });
  endShape(CLOSE); // CLOSE makes sure we join back to the beginning
}

// BONUS! how could you decompose this file better to avoid repeated code?
