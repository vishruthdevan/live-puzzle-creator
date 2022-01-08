let CANVAS = null;
let CONTEXT = null;
let SCALER = 0.8;
let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 3, cols: 3 };

const main = () => {
  CANVAS = document.getElementById("cnv");
  CONTEXT = CANVAS.getContext("2d");

  let promise = navigator.mediaDevices.getUserMedia({ video: true });
  promise
    .then(function (signal) {
      VIDEO = document.createElement("video");
      VIDEO.srcObject = signal;
      VIDEO.play();

      VIDEO.onloadeddata = function () {
        handleResize();
        window.addEventListener("resize", handleResize);
        updateCanvas();
      };
    })
    .catch(function (err) {
      alert("Error accessing camera: " + err);
    });
};

function updateCanvas() {
  CONTEXT.drawImage(VIDEO, 0, 0);
  window.requestAnimationFrame(updateCanvas);
}

function handleResize() {
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  let resizer =
    SCALER *
    Math.min(
      window.innerWidth / VIDEO.innerWidth,
      window.innerHeight / VIDEO.videoHeight
    );
  SIZE.width = resizer * VIDEO.videoWidth;
  SIZE.height = resizer * VIDEO.videoHeight;
  SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
  SIZE.y = window.innerHeight / 2 - SIZE.height / 2;
}

class Piece {
  constructor(rowIn, colIn) {
    this.rowIn = rowIn;
    this.colIn = colIn;
    this.x = SIZE.x + (SIZE.width * this.colIn) / SIZE.cols;
    this.y = SIZE.y + (SIZE.height * this.rowIn) / SIZE.rows;
    this.width = SIZE.width / SIZE.cols;
    this.height = SIZE.height / SIZE.rows;
  }
}
