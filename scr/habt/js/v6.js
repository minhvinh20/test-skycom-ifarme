import { apis } from "../../config/apis.js";
import DOMAINS from "../../config/domains.js";

const timeFirstRenderPage = new Date();
const regexPhone = /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;

let parentUrl =
  window.location.href.indexOf("split=") > -1 ? window.location.href.split("split=")[1] : window.location.href;

let phoneEle = document.querySelector(".input-cache input");
let form = document.querySelector(".form-submit--skycom form");
let overlay = document.getElementById("overlay");
let buttonSubmit = document.getElementById("btn-submit");

let encodePhone = "",
  isKeyboardOpen = 0,
  Count_na_keyboard = 0,
  Count_na_delete_keyboard = [],
  Is_open_na_keyboard = null,
  Action_na_time = 0,
  Count_po_keyboard = 0,
  Action_po_time = 0,
  Action_po_to_submit = 0,
  Is_open_po_keyboard = null,
  Count_po_delete_keyboard = [],
  Action_time = 0,
  Action_form_time = 0,
  Skl_vistorID = null,
  Detect_bot = false,
  adsClickId = "",
  third_id = 0,
  Count_3rd_id = 1,
  Change_3rd_id = false,
  Fe_check = false,
  Fe_note = "",
  Sceensize = "",
  Touch_pixel = [],
  Is_device_motion_change = null,
  Count_device_motion = 0,
  Skin_type = "";

let paramsVisitorID = {
  url: window.location.href,
  components: {},
  organization_id: "651bc916e99ffcef40ae6436",
  browser_vid: null,
  is_bot: false,
};
// ===================================================================

function detectDevice() {
  let isIOS = false;
  let isMobile = false;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      isIOS = true;
    }
  }
  return { isIOS, isMobile };
}
function listenerKeyboardOpen() {
  let MIN_KEYBOARD_HEIGHT = 280;
  let isMobile = window.innerWidth < 768;
  if (isMobile && window.screen.height - MIN_KEYBOARD_HEIGHT > window.visualViewport.height) {
    isKeyboardOpen = true;
  }
  return isKeyboardOpen;
}
// ======================================================================

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function textEnpty(e) {
  let _str = " ";
  return _str.repeat(e);
}
function encryptionIDFileds() {
  const randomString = (Math.random() + 1).toString(36).slice(2, 7);
  let placeholder = phoneEle.getAttribute("placeholder");
  placeholder +=
    textEnpty(100) +
    randomString +
    "-" +
    randomString +
    textEnpty(getRandomInt(20)) +
    randomString +
    "-" +
    randomString;
  encodePhone = randomString;
  phoneEle.setAttribute("id", randomString);
  phoneEle.setAttribute("name", randomString);
  phoneEle.setAttribute("placeholder", placeholder);
}
encryptionIDFileds();

// ===================================================================

function disableEnterSubmit() {
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 || e.keyCode == 9) {
      e.preventDefault();
      return;
    }
  });
}
disableEnterSubmit();

// ===================================================================

function disableCopy() {
  phoneEle.onpaste = function (e) {
    e.preventDefault();
  };
}
disableCopy();

// ===============================CHECK TOUCH EVENT================================

function checkTouchSupport() {
  window.addEventListener("touchstart", function (e) {
    for (let i = 0; i < e.touches.length; i++) {
      const positionX = e.touches[i].screenX.toFixed(2);
      const positionY = e.touches[i].screenY.toFixed(2);
      Touch_pixel.push(`${positionX}_${positionY}`);
    }
  });
}
checkTouchSupport();

// ===============================COUNT 3RD VIEW================================

function detectAdsId() {
  const params = parentUrl.split("&");
  const utmSource = params?.find((param) => param.indexOf("utm_source") > -1);
  if (!utmSource) {
    return;
  }
  if (utmSource.indexOf("facebook") > -1) {
    adsClickId = params.find((param) => param.indexOf("fbclid") > -1);
  }
  if (utmSource.indexOf("youtube") > -1 || utmSource.indexOf("google") > -1) {
    adsClickId = params.find((param) => param.indexOf("gclid") > -1);
  }
  if (utmSource.indexOf("tiktok") > -1) {
    adsClickId = params.find((param) => param.indexOf("ttclid") > -1);
  }
  third_id = adsClickId?.split("=")[1];
}
function countViewPage() {
  const nameLocalStorage3rdID = "3rd_id";
  const nameLocalStorageCount3rdID = "Count_3rd_id";

  if (third_id && !localStorage.getItem(nameLocalStorage3rdID)) {
    localStorage.setItem(nameLocalStorage3rdID, third_id);
  }
  if (third_id) {
    if (localStorage.getItem(nameLocalStorage3rdID) != third_id) {
      Change_3rd_id = true;
    } else {
      if (localStorage.getItem(nameLocalStorageCount3rdID)) {
        localStorage.setItem(nameLocalStorageCount3rdID, Number(localStorage.getItem(nameLocalStorageCount3rdID)) + 1);
      } else {
        localStorage.setItem(nameLocalStorageCount3rdID, Count_3rd_id);
      }
    }
  }
}
countViewPage();

// ===================================================================
function listenPhoneValidate() {
  phoneEle.addEventListener("input", (e) => {
    console.log("test");
    if (regexPhone.test(e.target.value)) {
      syncToSheetValidate({ phone: e.target.value, link: parentUrl });
    }
  });
}

// ==============================HANDLE INPUT PHONE=====================================

function handleCountPhoneTyping() {
  var countDeletePhone = 0;
  var countSelectionPhone = 0;

  phoneEle.addEventListener("input", function (e) {
    Count_po_keyboard += 1;
  });
  phoneEle.addEventListener("keydown", function (e) {
    if (e.keyCode === 8) {
      countDeletePhone++;
      Count_po_delete_keyboard.push(`${countDeletePhone}-${countSelectionPhone}`);
      countSelectionPhone = 1;
    }
  });
  phoneEle.addEventListener("mouseup", function (e) {
    countSelectionPhone = e.target.selectionEnd - e.target.selectionStart;
    if (countSelectionPhone == 0) countSelectionPhone = 1;
  });
}
handleCountPhoneTyping();

// ==============================TIMER TIMING=====================================

var timePoIn = 0,
  timePoOut = 0;
function setTimer() {
  phoneEle?.addEventListener("click", function (e) {
    if (!timePoIn) timePoIn = new Date();
    //check keyboard open
    window.visualViewport.addEventListener("resize", listenerKeyboardOpen);
  });
  phoneEle?.addEventListener("focusout", function (e) {
    timePoOut = new Date();
  });
}
setTimer();

function inputTiming() {
  Action_po_time = Math.abs(timePoOut - timePoIn) / 1000;
  Action_po_to_submit = Math.abs((+new Date() - +timePoOut) / 1000);
  Action_time = Math.abs(new Date() - timeFirstRenderPage) / 1000;
  Action_form_time = Math.abs(new Date() - timePoIn) / 1000;

  return {
    Action_po_time,
    Action_po_to_submit,
    Action_time,
    Action_form_time,
  };
}

// ==============================SYNC DATA GG SHEET=====================================

async function syncToSheetValidate({ phone, link }) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  let requestBody = { phone, link };
  await fetch(`${apis.habt.urlV6}?SHEET_NAME=PhoneValidate`, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    redirect: "follow",
    muteHttpExceptions: true,
  });
}
async function syncToSheetServerFail({ phone, ad_channel, ad_account, link, reasons }) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  let requestBody = { phone, ad_channel, ad_account, link, reasons };

  await fetch(`${apis.habt.urlV6}?SHEET_NAME=ServerFail`, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    redirect: "follow",
    muteHttpExceptions: true,
  });
}
async function syncToSheetDataSubmit({ phone, ad_channel, ad_account, isSuspect, link, spam, reasons }) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  let requestBody = { phone, ad_channel, ad_account, isSuspect, link, spam, reasons };
  await fetch(`${apis.habt.urlV6}?SHEET_NAME=Total`, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    redirect: "follow",
    muteHttpExceptions: true,
  });
}
// ==============================HANDLE SUBMIT=====================================
async function handlePostData({
  Ten2,
  name,
  phone,
  Count_na_keyboard,
  Action_na_time,
  Is_open_na_keyboard,
  Count_na_delete_keyboard,
  Count_po_keyboard,
  Action_po_time,
  Action_po_to_submit,
  Is_open_po_keyboard,
  Count_po_delete_keyboard,
  Action_time,
  Action_form_time,
  Sceensize,
  Touch_pixel,
  Is_device_motion_change,
  Count_3rd_id,
  Change_3rd_id,
  Skl_vistorID,
  Detect_bot,
  Fe_check,
  Fe_note,
  Count_device_motion,
  Skin_type,
}) {
  const params = {
    Ten2,
    name,
    phone,
    link: parentUrl,
    Count_na_keyboard,
    Action_na_time,
    Is_open_na_keyboard,
    Count_na_delete_keyboard,
    Count_po_keyboard,
    Action_po_time,
    Action_po_to_submit,
    Is_open_po_keyboard,
    Count_po_delete_keyboard,
    Action_time,
    Action_form_time,
    Sceensize,
    Touch_pixel,
    Is_device_motion_change,
    Count_3rd_id,
    Change_3rd_id,
    Skl_vistorID,
    Detect_bot,
    Fe_check,
    Fe_note,
    Count_device_motion,
    Skin_type,
  };
  const response = await fetch(apis.habt.bareURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then(function (response) {
      return response.json();
    })
    .then(async function (data) {
      await syncToSheetDataSubmit({
        phone: Ten2,
        link: parentUrl,
        spam: data.spam,
        isSuspect: data.suspect,
        reasons: data.reasons,
        ad_channel: data.ad_channel,
        ad_account: data.ad_account,
      });
      if (data.spam) {
        window.parent.location.replace(`${apis.habt.urlThankFake}?phone=${Ten2}`);
      } else if (data.suspect) {
        window.parent.location.replace(`${apis.habt.urlConfirm}?lead_id=${data.lead_id}`);
      } else {
        window.parent.location.replace(`${apis.habt.urlThankReal}?phone=${Ten2}`);
      }
    })
    .catch(async function (error) {
      await syncToSheetServerFail({
        phone: Ten2,
        link: parentUrl,
        reason: error.message,
      });
    });
}
function validateForm() {
  const valuePhone = phoneEle.value;
  let validate = true;
  if (!regexPhone.test(valuePhone)) {
    document.getElementById("errorMessage").innerText = "Vui lòng nhập đúng số điện thoại";
    validate = false;
  }
  return validate;
}

async function handleSubmit() {
  const invalid = validateForm();
  if (invalid) {
    const { Action_na_time, Action_po_time, Action_po_to_submit, Action_time, Action_form_time } = inputTiming();
    const Ten2 = phoneEle.value;
    const name = document.getElementById("ten2").value;
    const phone = document.getElementById("sdt2").value;

    Sceensize = `${window.screen.width} x ${window.screen.height}`;
    Count_3rd_id = localStorage.getItem("Count_3rd_id");

    buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
    buttonSubmit.parentElement.classList.add("disable");
    overlay.classList.add("active");

    handleSkintype();
    handlePostData({
      Ten2,
      name,
      phone,
      Count_na_keyboard,
      Action_na_time,
      Is_open_na_keyboard,
      Count_na_delete_keyboard,
      Count_po_keyboard,
      Action_po_time,
      Action_po_to_submit,
      Is_open_po_keyboard,
      Count_po_delete_keyboard,
      Action_time,
      Action_form_time,
      Sceensize,
      Touch_pixel,
      Is_device_motion_change,
      Count_3rd_id,
      Change_3rd_id,
      Skl_vistorID,
      Detect_bot,
      Fe_check,
      Fe_note,
      Count_device_motion,
      Skin_type,
    });
  }
}
// ==============================VisitorID=====================================
const getComponentsFingerVisitorId = () => {
  if (FingerprintJS) {
    let fingerPromise = FingerprintJS.load();
    fingerPromise
      .then((fp) => fp.get())
      .then(function (result) {
        console.log("result", result);
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
      });
  } else {
    handlePostDataVistor();
  }
};
const detectBot = () => {
  let botDetectPromise = import("https://testform.skycom.vn/util/fingerdetectbot.min.js").then((Botd) => Botd.load());
  botDetectPromise
    .then((botd) => botd.detect())
    .then((result) => {
      paramsVisitorID.is_bot = result.bot;
    })
    .catch((value) => {
      console.log("error detect bot");
    });
};

const handlePostDataVistor = () => {
  let result = fetch("https://fingerprint.skycom.vn/api/v1/visits/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paramsVisitorID),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let data = response.data;
      document.cookie = `browser_vid=${data.visitor_id}`;
      localStorage.setItem("browser_vid", data.visitor_id);
      paramsVisitorID.browser_vid = data.visitor_id;
      Skl_vistorID = data.visitor_id;
      Detect_bot = data.is_bot;
      return data;
    })
    .catch((value) => {
      console.log("Error Call API visitor", value);
    });
};

const browserVisitorid = () => {
  localforage.getItem("browser_vid").then((value) => {
    if (value) {
      //neu co trong indexDB
      paramsVisitorID.browser_vid = value;
    } else if (localStorage.getItem("browser_vid")) {
      //neu co trong localstorage
      paramsVisitorID.browser_vid = localStorage.getItem("browser_vid");
    } else {
      //neu co trong cookie
      const regex = new RegExp(`(^| )browser_vid=([^;]+)`);
      const match = document.cookie.match(regex);
      if (match) {
        paramsVisitorID.browser_vid = match[2];
      }
    }
  });
};
browserVisitorid();
getComponentsFingerVisitorId();

const handleSkintype = () => {
  for (var i = 1; i < 9; i++) {
    let value = document.querySelector(`input[name="skin_${i}"]:checked`)
      ? document.querySelector(`input[name="skin_${i}"]:checked`).value
      : "";
    if (value) {
      Skin_type += `${value}, `;
    }
  }
};

// ===============================lắng nghe sự kiện từ landipage truyền vào iframe ================================

function handleEventMessage(event) {
  var origin = event.origin || event.originalEvent.origin;
  let isDomain = false;
  DOMAINS.forEach((domain) => {
    if (origin.indexOf(domain) > -1) isDomain = true;
  });
  if (!isDomain) return;

  if (typeof event.data == "object" && event.data.call == "skylink_event") {
    // Do something with event.data.value;
    const data = JSON.parse(event.data.value);
    parentUrl = data.src;
    Is_device_motion_change = data.Is_device_motion_change;
    Count_device_motion = data.Count_device_motion;
    detectAdsId();
    listenPhoneValidate();
  }
}
window.addEventListener("message", handleEventMessage);

// ===============================Xử lý khi nhấn submit form================================

buttonSubmit.addEventListener("click", function (e) {
  const action_time = Math.abs(new Date() - timeFirstRenderPage) / 1000;
  if (action_time > 10) {
    return;
  }
  if (phoneEle.value.trim() == "") {
    Fe_check = true;
    Fe_note = "nhấn submit quá nhiều lần (Action_time < 10s)";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  handleSubmit();
});
