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

const main = () => {
  console.log("main");
};
