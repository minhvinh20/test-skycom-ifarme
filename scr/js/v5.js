import { apis } from "../config/apis.js";
import DOMAINS from "../config/domains.js";

const timeFirstRenderPage = new Date();
const regexPhone = /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;

let parentUrl =
  window.location.href.indexOf("split=") > -1
    ? window.location.href.split("split=")[1]
    : window.location.href;

let elInputs = document.querySelectorAll(".input-cache input");
let form = document.querySelector(".form-submit--skycom form");
let overlay = document.getElementById("overlay");
let buttonSubmit = document.getElementById("btn-submit");

let encodeName = "",
  encodePhone = "",
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
  Count_device_motion = 0;

let bodyVisitorID = {};
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
  elInputs.forEach((element, index) => {
    const randomString = (Math.random() + 1).toString(36).slice(2, 7);
    if (index === 0) {
      encodeName = randomString;
    }
    if (index === 1) {
      encodePhone = randomString;
    }
    let placeholder = element.getAttribute("placeholder");
    placeholder +=
      textEnpty(100) +
      randomString +
      "-" +
      randomString +
      textEnpty(getRandomInt(20)) +
      randomString +
      "-" +
      randomString;
    element.setAttribute("id", randomString);
    element.setAttribute("name", randomString);
    element.setAttribute("placeholder", placeholder);
  });
}
encryptionIDFileds();

// ===========================QUERY INPUT FIELDS ========================================

const fieldName = document.getElementById(encodeName);
const fieldPhone = document.getElementById(encodePhone);

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
  fieldName.onpaste = function (e) {
    e.preventDefault();
  };
  fieldPhone.onpaste = function (e) {
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
        localStorage.setItem(
          nameLocalStorageCount3rdID,
          Number(localStorage.getItem(nameLocalStorageCount3rdID)) + 1
        );
      } else {
        localStorage.setItem(nameLocalStorageCount3rdID, Count_3rd_id);
      }
    }
  }
}
countViewPage();

// ===================================================================
function listenPhoneValidate() {
  fieldPhone.addEventListener("input", (e) => {
    if (regexPhone.test(e.target.value)) {
      syncToSheetValidate({ phone: e.target.value, link: parentUrl });
    }
  });
}
// ==============================HANDLE INPUT NAME=====================================

function handleCountNameTyping() {
  var countDeleteName = 0;
  var countSelectionName = 0;
  fieldName.addEventListener("input", function (e) {
    Count_na_keyboard++;
  });
  fieldName.addEventListener("keydown", function (e) {
    if (e.keyCode === 8) {
      countDeleteName++;
      Count_na_delete_keyboard.push(`${countDeleteName}-${countSelectionName}`);
      countSelectionName = 1;
    }
  });
  fieldName.addEventListener("mouseup", function (e) {
    countSelectionName = e.target.selectionEnd - e.target.selectionStart;
    if (countSelectionName == 0) countSelectionName = 1;
  });
}
handleCountNameTyping();

// ==============================HANDLE INPUT PHONE=====================================

function handleCountPhoneTyping() {
  var countDeletePhone = 0;
  var countSelectionPhone = 0;

  fieldPhone.addEventListener("input", function (e) {
    Count_po_keyboard += 1;
  });
  fieldPhone.addEventListener("keydown", function (e) {
    if (e.keyCode === 8) {
      countDeletePhone++;
      Count_po_delete_keyboard.push(`${countDeletePhone}-${countSelectionPhone}`);
      countSelectionPhone = 1;
    }
  });
  fieldPhone.addEventListener("mouseup", function (e) {
    countSelectionPhone = e.target.selectionEnd - e.target.selectionStart;
    if (countSelectionPhone == 0) countSelectionPhone = 1;
  });
}
handleCountPhoneTyping();

// ==============================TIMER TIMING=====================================

var timeNaIn = 0,
  timePoIn = 0,
  timeNaOut = 0,
  timePoOut = 0,
  timeAdIn = 0,
  timeAdOut = 0;
function setTimer() {
  fieldName?.addEventListener("click", function (e) {
    if (!timeNaIn) timeNaIn = new Date();
    //check keyboard open
    window.visualViewport.addEventListener("resize", listenerKeyboardOpen);
  });
  fieldName?.addEventListener("focusout", function (e) {
    timeNaOut = new Date();
  });
  fieldPhone?.addEventListener("click", function (e) {
    if (!timePoIn) timePoIn = new Date();
    //check keyboard open
    window.visualViewport.addEventListener("resize", listenerKeyboardOpen);
  });
  fieldPhone?.addEventListener("focusout", function (e) {
    timePoOut = new Date();
  });
}
setTimer();

function inputTiming() {
  Action_na_time = Math.abs(timeNaOut - timeNaIn) / 1000;
  Action_po_time = Math.abs(timePoOut - timePoIn) / 1000;
  Action_po_to_submit = Math.abs((+new Date() - +timePoOut) / 1000);
  Action_time = Math.abs(new Date() - timeFirstRenderPage) / 1000;
  Action_form_time =
    timeNaIn < timePoIn
      ? Math.abs(new Date() - timeNaIn) / 1000
      : Math.abs(new Date() - timePoIn) / 1000;

  return {
    Action_po_time,
    Action_na_time,
    Action_po_to_submit,
    Action_time,
    Action_form_time,
  };
}

// ==============================SYNC DATA GG SHEET=====================================

async function syncToSheetValidate({ phone, link }) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  const api = `${apis.habt.urlSyncGoogleSheetSpam}?phone=${phone}&link=${link}&SHEET_NAME=SDTValidate`;
  await fetch(
    `${apis.habt.urlSyncGoogleSheetSpam}?phone=${phone}&link=${link}&SHEET_NAME=SDTValidate`,
    {
      method: "GET",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    }
  );
}
async function syncToSheetServerFail({ name, phone, ad_channel, ad_account, link, reasons }) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  await fetch(
    `${
      apis.habt.urlSyncGoogleSheetSpam
    }?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&utmSource=${
      ad_channel || ""
    }&utmMedium=${ad_account || ""}&link=${link}&reasons=${reasons}&SHEET_NAME=ErrorServer`,
    {
      method: "GET",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    }
  );
}
async function syncToSheetDataSubmit({
  name,
  phone,
  ad_channel,
  ad_account,
  isSuspect,
  link,
  spam,
  reasons,
}) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  await fetch(
    `${
      apis.habt.urlSyncGoogleSheetSpam
    }?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&utmSource=${
      ad_channel || ""
    }&utmMedium=${
      ad_account || ""
    }&isSuspect=${isSuspect}&link=${link}&spam=${spam}&reasons=${reasons}&SHEET_NAME=TotalSDT`,
    {
      method: "GET",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    }
  );
}
async function syncToSheetDataVisitorID({ name, phone, link, body }) {
  
  const requestBody = {name, phone,link,body: JSON.stringify(body)}
  await fetch(`${apis.urlSyncGoogleSheetVisitorID}?SHEET_NAME=VisitorID(dev)`,{ method: 'POST', body: requestBody});
}
// ==============================HANDLE SUBMIT=====================================
async function handlePostData({
  Ten1,
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
}) {
  const params = {
    Ten1,
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
        name: Ten1,
        phone: Ten2,
        link: parentUrl,
        spam: data.spam,
        isSuspect: data.suspect,
        reasons: data.reasons,
        ad_channel: data.ad_channel,
        ad_account: data.ad_account,
      });
      if (data.spam) {
        window.parent.location.replace(`${apis.habt.urlThankFake}?name=${Ten1}&phone=${Ten2}`);
      } else if (data.suspect) {
        window.parent.location.replace(`${apis.habt.urlConfirm}?lead_id=${data.lead_id}`);
      } else {
        window.parent.location.replace(`${apis.habt.urlThankReal}?name=${Ten1}&phone=${Ten2}`);
      }
    })
    .catch(async function (error) {
      await syncToSheetServerFail({
        name: Ten1,
        phone: Ten2,
        link: parentUrl,
        reason: error.message,
      });
    });
}
function validateForm() {
  const valuePhone = fieldPhone.value;
  let validate = true;
  if (!regexPhone.test(valuePhone)) {
    document.getElementById("errorMessage").innerText = "Vui lòng nhập đúng số điện thoại";
    validate = false;
  }
  return validate;
}

function handleSubmit() {
  const invalid = validateForm();
  if (invalid) {
    const { Action_na_time, Action_po_time, Action_po_to_submit, Action_time, Action_form_time } =
      inputTiming();
    const Ten1 = fieldName.value;
    const Ten2 = fieldPhone.value;
    const name = document.getElementById("ten2").value;
    const phone = document.getElementById("sdt2").value;

    Sceensize = `${window.screen.width} x ${window.screen.height}`;
    Count_3rd_id = localStorage.getItem("Count_3rd_id");

    buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
    buttonSubmit.parentElement.classList.add("disable");
    overlay.classList.add("active");

    
    console.log('bodyVisitorID', bodyVisitorID)
  
    syncToSheetDataVisitorID({ name: Ten1, phone: Ten2, link: parentUrl, body: bodyVisitorID });

    handlePostData({
      Ten1,
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
    });
  }
}

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
    bodyVisitorID = data.bodyVisitorID;
    Skl_vistorID = data.Skl_vistorID;
    Detect_bot = data.Detect_bot;
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
  if (fieldName.value.trim() == "" && fieldPhone.value.trim() == "") {
    Fe_check = true;
    Fe_note = "nhấn submit quá nhiều lần (Action_time < 10s)";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  handleSubmit();
});
