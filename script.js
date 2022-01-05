let CANVAS = null;
let CONTEXT = null;

const main = () => {
  CANVAS = document.getElementById("cnv");
  CONTEXT = CANVAS.getContext("2d");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  let promise = navigator.mediaDevices.getUserMedia({ video: true });
  promise
    .then(function (signal) {
      VIDEO = document.createElement("video");
      VIDEO.srcObject = signal;
      VIDEO.play();

      VIDEO.onloadeddata = function () {
        updateCanvas();
      };
    })
    .catch(function (err) {
      alert("Error accessing camera: " + err);
    });
};
