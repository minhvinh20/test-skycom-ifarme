//config
let diff = 0,
  Is_device_motion_change = null,
  Count_device_motion = 0,
  device_motion_compare = 0,
  Skl_vistorID = null,
  Detect_bot = false,
  bodyVisitorID = {},
  frames = [];
const bareURL = "https://testform.skycom.vn";
//
const appenIframe = (className, endpoin) => {
  const wrapperForm = document.querySelectorAll(className);
  if (wrapperForm.length > 0) {
    wrapperForm.forEach(function (wrapper) {
      if (!wrapper) {
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = bareURL + endpoin;
      iframe.classList.add("skycom-iframe");
      wrapper.insertBefore(iframe, wrapper.children[0]);
    });
  }
};
//

// device motion
function checkDeviceEmotion() {
  // Kiểm tra xem trình duyệt hỗ trợ API DeviceMotion và API DeviceOrientation hay không
  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", function (event) {
      diff = event.acceleration.x || event.accelerationIncludingGravity.x;
      handleDeviceMotionStatus();
    });

    setInterval(() => {
      if (diff != device_motion_compare) {
        Count_device_motion++;
        device_motion_compare = diff;
      }
    }, 1000);
  }
}
function handleDeviceMotionStatus() {
  if (Count_device_motion > 5) {
    Is_device_motion_change = true;
  } else {
    Is_device_motion_change = false;
  }
}

//gui data vao iframe
function listenFirame() {
  const frameEles = document.querySelectorAll(".skycom-iframe");
  frameEles.forEach(function (frame) {
    frames.push(frame);
    frame.addEventListener("load", function () {
      sendMessage(frame);
    });
  });
}
function sendMessage(frame) {
  const message = JSON.stringify({
    message: "send data",
    src: window.location.href,
    Is_device_motion_change: Is_device_motion_change,
    Count_device_motion: Count_device_motion,
  });
  frame.contentWindow.postMessage(
    {
      call: "skylink_event",
      value: message,
    },
    "https://testform.skycom.vn/"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  appenIframe(".skycom-wrapper", "/v5");
  appenIframe(".skycom-v6", "/habt/v6");
  appenIframe(".skycom-ryusui-v1", "/ryusui/v1");
  checkDeviceEmotion();
  listenFirame();
});
