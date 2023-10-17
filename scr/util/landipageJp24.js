
//config
let diff = 0, 
    Is_device_motion_change = null, 
    Count_device_motion = 0, 
    device_motion_compare = 0, 
    Skl_Visitor = null,
    Detect_bot = false,
    frames = [];

let paramsVisitorID = {
    url: window.location.href,
    components: {},
    organization_id: "651bc916e99ffcef40ae6436",
    browser_vid: `${localStorage.getItem("browser_vid")}` || null,
    is_bot: false,
};

function appendIframeVertical() {
  const wrapperFormVerticals = document.querySelectorAll(".skycom-wrapper");
  if (wrapperFormVerticals.length > 0) {
    wrapperFormVerticals.forEach(function (wrapper) {
      if (!wrapper) {
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = "https://testform.skycom.vn/jp24/v5";
      iframe.classList.add("skycom-iframe");

      wrapper.insertBefore(iframe, wrapper.children[0]);
    });
  }
}
function appendIframeHorizontal() {
  const wrapperFormHorizontals = document.querySelectorAll(
    ".skycom-wrapper--horizontal"
  );
  if (wrapperFormHorizontals.length > 0) {
    wrapperFormHorizontals.forEach(function (wrapper) {
      if (!wrapper) {
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = "https://testform.skycom.vn/jp24/v5";
      iframe.classList.add("skycom-iframe");
      wrapper.insertBefore(iframe, wrapper.children[0]);
    });
  }
}

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
    Skl_Visitor: paramsVisitorID.browser_vid,
    Detect_bot: paramsVisitorID.is_bot,
  });
  frame.contentWindow.postMessage(
    {
      call: "skylink_event",
      value: message,
    },
    "https://testform.skycom.vn/"
  );
}

const getComponentsFingerVisitorId = ()  => {
  let fingerPromise = FingerprintJS.load();
  fingerPromise.then( (fp) =>  fp.get())
  .then(function (result) {
    paramsVisitorID.components = result.components;
  })
  .then((response) => {
      detectBot();
  })
  .then((response) => {
    handlePostDataVistor();
  })
  .catch((value) => {
    console.log("error visitorID");
  })
}
const detectBot = () => {
  let botDetectPromise = import( "https://testform.skycom.vn/util/fingerdetectbot.min.js").then( (Botd) =>  Botd.load());
  botDetectPromise.then((botd) =>  botd.detect()) 
  .then((result)  => {
    paramsVisitorID.is_bot = result.bot;
  })
  .catch((value) => {
    console.log("error detect bot");
  });
}

const handlePostDataVistor = () =>{
  let result = fetch('https://fingerprint.skycom.vn/api/v1/visits/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paramsVisitorID),
  })
  .then(function (response) {
      return response.json();
  })
  .then(function (response){
      console.log('response', response)
      let data = response.data;
      document.cookie = `browser_vid=${data.visitor_id}`;
      localStorage.setItem("browser_vid", data.visitor_id);
      paramsVisitorID.browser_vid = data.visitor_id;
      return data;
  })
  .catch((value) => {
      console.log("Error Call API visitor");
  });
}

const browserVisitorid = () =>  {
  localforage.getItem('browser_vid').then((value) => {
      if (value) {
          //neu co trong indexDB 
          paramsVisitorID.browser_vid = value;
      }
      else if(localStorage.getItem("browser_vid")){
          //neu co trong localstorage
          paramsVisitorID.browser_vid = localStorage.getItem("browser_vid")
      }
      else{
          //neu co trong cookie
          const regex = new RegExp(`(^| )browser_vid=([^;]+)`)
          const match = document.cookie.match(regex)
          if (match) {
            paramsVisitorID.browser_vid =  match[2]
          }
      }
  })
}


document.addEventListener("DOMContentLoaded", function () {
    appendIframeVertical();
    appendIframeHorizontal();
    checkDeviceEmotion();
    browserVisitorid();
    getComponentsFingerVisitorId();
    listenFirame();
})

