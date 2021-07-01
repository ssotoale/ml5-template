let video;
let latestPrediction = null;
let modelIsLoading = true;
let akali;
let poseNet;
let poses = [];

// Storing the keypoint positions
let keypoints = [];
let interpolatedKeypoints = [];

const FOREHEAD_POINT = 152;
const LEFT_FORHEAD = 137;
const RIGHT_FOREHEAD = 333;

// p5 function
function preload() {
  akali = loadImage("assets/akaliH.png");
}

// p5 function
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // ml5 function
  let facemesh = ml5.facemesh(video, () => {
    console.log("Model is ready!");
    modelIsLoading = false;
  });

  // ml5 function
  facemesh.on("predict", (results) => {
    // results is an Array
    // we care about the first object only
    // results[0]
    // console.log(results[0]);
    latestPrediction = results[0];
  });
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, { flipHorizontal: true });
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
    console.log(poses);
    console.log("poses")
  });
  // Hide the video element, and just show the canvas
  video.hide();

  // setup original keypoints
  createInitialKeypoints();
  console.log("created intital keypoints")
}

function updateKeypoints() {
  // If there are no poses, ignore it.
  if (poses.length <= 0) {
    console.log("ignore");
    return;//errorrrr , infinetly touches ignore
  }

  // Otherwise, let's update the points;
  let pose = poses[0].pose;
  keypoints = pose.keypoints;

  for (let kp = 0; kp < keypoints.length; kp++) {
    let oldKeypoint = interpolatedKeypoints[kp];
    let newKeypoint = keypoints[kp].position;
    console.log("updating");

    let interpX = lerp(oldKeypoint.x, newKeypoint.x, 0.3);
    let interpY = lerp(oldKeypoint.y, newKeypoint.y, 0.3);

    let interpolatedKeypoint = { x: interpX, y: interpY };

    interpolatedKeypoints[kp] = interpolatedKeypoint;
  }
}

// p5 function
function draw() {
  // if (modelIsLoading)
  // show a loading screen

  // draw webcam video
  imageMode(CORNER);
  image(video, 0, 0, width, height);

  if (!latestPrediction) return; // don't draw anything else
  //-----------------------------------

  // get forhead locations
  let foreheadLocation = latestPrediction.scaledMesh[FOREHEAD_POINT];
  let leftForeheadLocation = latestPrediction.scaledMesh[LEFT_FORHEAD];
  let rightForeheadLocation = latestPrediction.scaledMesh[RIGHT_FOREHEAD];

  let foreheadWidth = dist(
    leftForeheadLocation[0 /* x */],
    leftForeheadLocation[1 /* y */],
    rightForeheadLocation[0 /* x */],
    rightForeheadLocation[1 /* y */]
  );

  // console.log(foreheadWidth);

  let crownWidth = foreheadWidth * 3;

  let crownHeight = (akali.height / akali.width) * crownWidth;

  imageMode(CENTER);
  image(
    akali,
    foreheadLocation[0 /* x */],
    foreheadLocation[1 /* y */] - crownHeight / 3,
    crownWidth /* width */,
    crownHeight /* height */
  );

  tint(255, 201, 224);
  // background('rgba(100%,0%,100%,0.5)');
  lightness('yellow');

  // updateKeypoints();

  // drawKeypoints();
  let leftWristPosition = interpolatedKeypoints[9];
  if (leftWristPosition.y < height/2) {
    tint(0, 153, 204);
    console.log("riase hand");
  } 

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < interpolatedKeypoints.length; i++) {
    keypoint = interpolatedKeypoints[i];
    fill(255, 0, 0);
    text(i, keypoint.x, keypoint.y); // draw keypoint number on video
    //ellipse(keypoint.x, keypoint.y, 10, 10); // just draw red dots
  }
}

// Create default keypoints for interpolation easing
function createInitialKeypoints() {
  let numKeypoints = 17;
  for (let i = 0; i < numKeypoints; i++) {
    newKeypoint = { x: width / 2, y: height / 2 };
    // console.log("keypoint made");
    interpolatedKeypoints.push(newKeypoint);
  }
}
