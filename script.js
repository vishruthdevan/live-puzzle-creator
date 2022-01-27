let CANVAS = null;
let CONTEXT = null;
let SCALER = 0.6;
let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 3, cols: 3 };
let PIECES = [];
let SELECTED_PIECE = null;
let START_TIME = null;
let END_TIME = null;

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

function setDifficulty() {
  let diff = document.getElementById("difficulty").ariaValueMax;
  switch (diff) {
    case "easy":
      initializePieces(3, 3);
      break;
    case "medium":
      initializePieces(5, 5);
      break;
    case "hard":
      initializePieces(10, 10);
      break;
    case "insane":
      initializePieces(40, 25);
      break;
  }
}

function getPressedPiece(loc) {
  for (let i = PIECES.length - 1; i >= 0; i--) {
    if (
      loc.x > PIECES[i].x &&
      loc.x < PIECES[i].x + PIECES[i].width &&
      loc.y > PIECES[i].y &&
      loc.y < PIECES[i].y + PIECES[i].height
    ) {
      return PIECES[i];
    }
  }
  return null;
}

function onMouseDown(evt) {
  SELECTED_PIECE = getPressedPiece(evt);
  if (SELECTED_PIECE != null) {
    const index = PIECES.indexOf(SELECTED_PIECE);
    if (index >= 0) {
      PIECES.splice(index, 1);
      PIECES.push(SELECTED_PIECE);
    }
    SELECTED_PIECE.offset = {
      x: evt.x - SELECTED_PIECE.x,
      y: evt.y - SELECTED_PIECE.y,
    };
  }
}

function onMouseMove(evt) {
  if (SELECTED_PIECE != null) {
    SELECTED_PIECE.x = evt.x - SELECTED_PIECE.offset.x;
    SELECTED_PIECE.y = evt.y - SELECTED_PIECE.offset.y;
  }
}

function onMouseUp() {
  if (SELECTED_PIECE != null && SELECTED_PIECE.isClose()) {
    SELECTED_PIECE.snap();
  }
  SELECTED_PIECE = null;
}

function onTouchStart(evt) {
  let loc = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
  onMouseDown(loc);
}

function onTouchEnd() {
  onMouseUp();
}

function onTouchMove(evt) {
  let loc = { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
  onMouseMove(loc);
}

function addEventListeners() {
  CANVAS.addEventListener("mousedown", onMouseDown);
  CANVAS.addEventListener("mouseup", onMouseUp);
  CANVAS.addEventListener("mousemove", onMouseMove);
  CANVAS.addEventListener("touchstart", onTouchStart);
  CANVAS.addEventListener("touchend", onTouchEnd);
  CANVAS.addEventListener("touchmove", onTouchMove);
}

function updateCanvas() {
  // CONTEXT.drawImage(VIDEO, 0, 0);
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  CONTEXT.globalAlpha = 0.1;
  CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);

  CONTEXT.globalAlpha = 1;
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
      window.innerWidth / VIDEO.videoWidth,
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
    this.xCorrect = this.x;
    this.yCorrect = this.y;
  }

  draw(context) {
    context.beginPath();

    context.drawImage(
      VIDEO,
      (this.colIn * VIDEO.videoWidth) / SIZE.cols,
      (this.rowIn * VIDEO.videoHeight) / SIZE.rows,
      VIDEO.videoWidth / SIZE.cols,
      VIDEO.videoHeight / SIZE.rows,
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.rect(this.x, this.y, this.width, this.height);
    context.stroke();
  }

  isClose() {
    if (
      distance(
        { x: this.x, y: this.y },
        { x: this.xCorrect, y: this.yCorrect }
      ) <
      this.width / 3
    ) {
      return true;
    }
    return false;
  }

  snap() {
    this.x = this.xCorrect;
    this.y = this.yCorrect;
  }
}

function distance(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
  );
}
