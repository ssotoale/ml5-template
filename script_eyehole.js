let video;
let latestPrediction = null;

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
    // console.log(results[0]);
    latestPrediction = results[0];
  });

  video.hide();
}

// p5 function
function draw() {
  // draw webcam video
  image(video, 0, 0, width, height);

  if (!latestPrediction) return; // don't draw anything else
  //-----------------------------------

  drawFullFaceCovering(); // cover the face with white shape

  let eyeholeMask = createEyeholeMask();

  let webcamCopy = video.get(); // get a new copy of the webcam image
  webcamCopy.mask(eyeholeMask); // apply the eyehole mask
  image(webcamCopy, 0, 0, width, height); // draw eye on top of the full face covering
}

function drawFullFaceCovering() {
  beginShape();
  // "silhouette" is the outline of the whole face mesh
  latestPrediction.annotations.silhouette.forEach((point) => {
    curveVertex(point[0 /* x */], point[1 /* y */]);
  });
  endShape(CLOSE);
}

function createEyeholeMask() {
  let eyeholeMask = createGraphics(width, height); // draw into a "graphics" object instead of the canvas directly
  eyeholeMask.background("rgba(255,255,255,0)"); // transparent background (zero alpha)
  eyeholeMask.noStroke();

  // get the eyehole points from the facemesh
  let rightEyeUpper = latestPrediction.annotations.rightEyeUpper1;
  let rightEyeLower = [
    ...latestPrediction.annotations.rightEyeLower1,
  ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */

  // draw the actual shape
  eyeholeMask.beginShape();
  // draw from left to right along the top of the eye
  rightEyeUpper.forEach((point) => {
    eyeholeMask.curveVertex(point[0 /* x */], point[1 /* y */]); // using curveVertex for smooth lines
  });
  // draw back from right to left along the bottom of the eye
  rightEyeLower.forEach((point) => {
    eyeholeMask.curveVertex(point[0 /* x */], point[1 /* y */]);
  });
  eyeholeMask.endShape(CLOSE); // CLOSE makes sure we join back to the beginning

  return eyeholeMask;
}
