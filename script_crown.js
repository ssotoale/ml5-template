let video;
let latestPrediction = null;
let modelIsLoading = true;
let crownImage;

const FOREHEAD_POINT = 151;
const LEFT_FORHEAD = 104;
const RIGHT_FOREHEAD = 333;

// p5 function
function preload() {
  crownImage = loadImage("assets/crown.png");
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

  video.hide();
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

  console.log(foreheadWidth);

  let crownWidth = foreheadWidth * 3;

  let crownHeight = (crownImage.height / crownImage.width) * crownWidth;

  imageMode(CENTER);
  image(
    crownImage,
    foreheadLocation[0 /* x */],
    foreheadLocation[1 /* y */] - crownHeight / 2,
    crownWidth /* width */,
    crownHeight /* height */
  );
}
