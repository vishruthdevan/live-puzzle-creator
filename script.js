let CANVAS = null;
let CONTEXT = null;
let SCALER = 0.8;
let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 3, cols: 3 };
let PIECES = [];
let SELECTED_PIECE = null;

const main = () => {
  CANVAS = document.getElementById("cnv");
  CONTEXT = CANVAS.getContext("2d");
  addEventListeners();
  let promise = navigator.mediaDevices.getUserMedia({ video: true });
  promise
    .then(function (signal) {
      VIDEO = document.createElement("video");
      VIDEO.srcObject = signal;
      VIDEO.play();

      VIDEO.onloadeddata = function () {
        handleResize();
        window.addEventListener("resize", handleResize);
        initializePieces(SIZE.rows, SIZE.cols);
        updateCanvas();
      };
    })
    .catch(function (err) {
      alert("Error accessing camera: " + err);
    });
};

function onMouseDown(evt) {
  SELECTED_PIECE = getPressedPiece(evt);
  if (SELECTED_PIECE != null) {
    SELECTED_PIECE.offset = {
      x: evt.x - SELECTED_PIECE.x,
      y: evt.y - SELECTED_PIECE.y,
    };
  }
}

function addEventListeners() {
  CANVAS.addEventListener("mousedown", onMouseDown);
  CANVAS.addEventListener("mouseup", onMouseUp);
  CANVAS.addEventListener("mousemove", onMouseMove);
}

function updateCanvas() {
  // CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  for (let i = 0; i < PIECES.length; i++) {
    PIECES[i].draw(CONTEXT);
  }
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

function initializePieces(rows, cols) {
  SIZE.rows = rows;
  SIZE.cols = cols;
  for (let i = 0; i < SIZE.rows; i++) {
    for (let j = 0; j < SIZE.cols; j++) {
      PIECES.push(new Piece(i, j));
    }
  }
}

function randomizePieces() {
  for (let i = 0; i < PIECES.length; i++) {
    let loc = {
      x: Math.random() * (CANVAS.width - PIECES[i].width),
      y: Math.random() * (CANVAS.height - PIECES[i].height),
    };
    PIECES[i].x = loc.x;
    PIECES[i].y = loc.y;
  }
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

  draw(context) {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
  }
}
