var bareURL = "https://devsyncdata.skycom.vn/api/spam_check/form-spam-check";
var urlThankReal = "https://hoaianbeauty.com/pages/cam-on-quy-khach";
var urlThankFake = "https://hoaianbeauty.com/pages/camon-quy-khach";
var urlSyncGoogleSheetSpam =
  "https://script.google.com/macros/s/AKfycbzGbJQ83uGDjEGC5x8yqbIjKr0ATrzk6gNYcIxAI958cHpSfc-r6KHnylZNK7fxCpFgaQ/exec";

var timeFirstRenderPage = new Date();
var regexPhone = /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;

var parentUrl =
  window.location.href.indexOf("split=") > -1
    ? window.location.href.split("split=")[1]
    : window.location.href;

var forms = document.querySelectorAll(".form-submit--skycom form");
var overlay = document.getElementById("overlay");

var encodeName = "",
  encodePhone = "",
  Count_na_keyboard = 0,
  Count_na_delete_keyboard = [],
  Is_open_na_keyboard = null,
  Action_na_time = 0,
  Count_po_keyboard = 0,
  Action_po_time = null,
  Action_po_to_submit = 0,
  Is_open_po_keyboard = null,
  Count_po_delete_keyboard = [],
  Action_time = 0,
  Action_form_time = 0,
  Skl_Visitor = null,
  adsClickId = "",
  third_id = 0,
  Count_3rd_id = 1,
  change_3rd_id = false,
  Typing_count_keyboard = 0,
  Sceensize = "",
  Touch_pixel = [],
  Is_keyboard_virtual = null,
  Is_device_motion_change = null,
  Count_device_motion = 0;

// ===================================================================

function detectDevice() {
  var isIOS = false;
  var isMobile = false;
  var isAndroid = false;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true;
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      isIOS = true;
    } else {
      isAndroid = true;
    }
  }
  return { isIOS, isMobile, isAndroid };
}
function listenerKeyboardOpen() {
  var MIN_KEYBOARD_HEIGHT = 280;
  var isMobile = detectDevice().isMobile;
  var isKeyboardOpen = isMobile && window.screen.height - MIN_KEYBOARD_HEIGHT > window.visualViewport.height;
  return isKeyboardOpen;
}
// ======================================================================

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function textEnpty(e) {
  var _str = " ";
  return _str.repeat(e);
}
function encryptionIDFileds() {
  forms.forEach(function (element, index) {
    var elInputs = element.querySelectorAll(".input-cache input");
    elInputs.forEach((element, index) => {
      const randomString = `i${(Math.random() + 1).toString(36).slice(2, 7)}`;
      if (index === 0) {
        encodeName = randomString;
      }
      if (index === 1) {
        encodePhone = randomString;
      }
      var placeholder = element.getAttribute("placeholder");
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
  });
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
  forms.forEach(function (form) {
    var fieldName = form.querySelector(".human");
    var fieldPhone = form.querySelector(".numeric");
    fieldName.onpaste = function (e) {
      e.preventDefault();
    };
    fieldPhone.onpaste = function (e) {
      e.preventDefault();
    };
  });
}
disableCopy();

// ===============================CHECK DEVICE MOTION================================

var diff = 0;
var device_motion_compare = '';

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
};
function handleDeviceMotionStatus() {
  if (Count_device_motion > 5) {
    Is_device_motion_change = true;
  } else {
    Is_device_motion_change = false;
  }
}
checkDeviceEmotion();


// ===============================CHECK TOUCH EVENT================================

function checkTouchPixel() {
  forms.forEach(function(form){
    form.addEventListener("touchstart", function (e) {
      for (let i = 0; i < e.touches.length; i++) {
        var X = e.touches[i].screenX;
        var Y = e.touches[i].screenY;
        Touch_pixel.push(`${X.toFixed(2)}_${Y.toFixed(2)}`)
      }
    });

  })
}
checkTouchPixel();

// ===============================CREATE SKL VISITORID================================

function createSklVisitorIdByFinger() {
  var fpPromise = FingerprintJS.load();
  fpPromise
    .then((fp) => fp.get({ extendedResult: true }))
    .then((result) => {
      var components = result.components;
      var contextAttributes =components.webGlExtensions.value.contextAttributes.toString() || "";
      var extensionParameters = components.webGlExtensions.value.extensionParameters.toString() || "";
      var extensions = components.webGlExtensions.value.extensions.toString() || "";
      var parameters = components.webGlExtensions.value.parameters.toString() || "";
      var shaderPrecisions =components.webGlExtensions.value.shaderPrecisions.toString() || "";
      var renderer = components.webGlBasics.value.renderer || "";
      var rendererUnmasked = components.webGlBasics.value.rendererUnmasked || "";
      var shadingLanguageVersion = components.webGlBasics.value.shadingLanguageVersion || "";
      var vendor = components.webGlBasics.value.vendor || "";
      var vendorUnmasked = components.webGlBasics.value.vendorUnmasked || "";
      var version = components.webGlBasics.value.version || "";
      var fonts = components.fonts.value.toString() || "";
      var fontPreferences = components.fontPreferences.value.toString() || "";
      var hardwareConcurrency = components.hardwareConcurrency.value || "";
      var deviceMemory = components.deviceMemory.value || "";
      var audio = components.audio.value || "";
      var colorDepth = components.colorDepth.value || "";
      var canvasGeometry = components.canvas.value.geometry || "";
      var screen = components.screenResolution.value.toString() || "";

      var stringHash =
        contextAttributes +
        extensionParameters +
        extensions +
        parameters +
        shaderPrecisions +
        renderer +
        rendererUnmasked +
        shadingLanguageVersion +
        vendor +
        vendorUnmasked +
        version +
        fonts +
        fontPreferences +
        hardwareConcurrency +
        deviceMemory +
        audio +
        colorDepth +
        canvasGeometry;

      function getHash(str, algo = "SHA-256") {
        let strBuf = new TextEncoder().encode(str);
        return crypto.subtle.digest(algo, strBuf).then((hash) => {
          window.hash = hash;
          let stringHash = "";
          const view = new DataView(hash);
          for (let i = 0; i < hash.byteLength; i += 4) {
            stringHash += view.getUint16(i).toString(16).slice(-8);
          }
          return stringHash;
        });
      }
      getHash(stringHash).then((hash) => {
        Skl_Visitor = hash;
      });
    });
}
createSklVisitorIdByFinger();

// ===============================COUNT 3RD VIEW================================

function detectAdsId() {
  var params = parentUrl.split("&");
  if (!params) {
    return;
  }
  var utmSource = params.find(function (param) {
    param.indexOf("utm_source") > -1;
  });
  if (!utmSource) {
    return;
  }
  if (utmSource.indexOf("facebook") > -1) {
    adsClickId = params.find(function (param) {
      param.indexOf("fbclid") > -1;
    });
  }
  if (utmSource.indexOf("youtube") > -1 || utmSource.indexOf("google") > -1) {
    adsClickId = params.find(function (param) {
      param.indexOf("gclid") > -1;
    });
  }
  if (utmSource.indexOf("tiktok") > -1) {
    adsClickId = params.find(function (param) {
      param.indexOf("ttclid") > -1;
    });
  }
  third_id = adsClickId.split("=")[1];
}
function countViewPage() {
  var nameLocalStorage3rdID = "3rd_id";
  var nameLocalStorageCount3rdID = "Count_3rd_id";

  if (third_id && !localStorage.getItem(nameLocalStorage3rdID)) {
    localStorage.setItem(nameLocalStorage3rdID, third_id);
  }
  if (third_id) {
    if (localStorage.getItem(nameLocalStorage3rdID) != third_id) {
      change_3rd_id = true;
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
detectAdsId();
countViewPage();

// ===================================================================
function listenPhoneValidate() {
  forms.forEach(function (form) {
    var fieldPhone = form.querySelector(".numeric");
    fieldPhone.addEventListener("input", function (e) {
      if (regexPhone.test(e.target.value)) {
        syncToSheetValidate({ phone: e.target.value, link: parentUrl });
      }
    });
  });
}
listenPhoneValidate();
// ==============================HANDLE INPUT NAME=====================================

function handleCountNameTyping() {
  forms.forEach(function (form) {
    var countDeleteName = 0;
    var countSelectionName = 0;
    var fieldName = form.querySelector(".human");
    fieldName.addEventListener("input", function (e) {
      Count_na_keyboard++;
    });
    fieldName.addEventListener("keydown", function (e) {
      if (e.keyCode === 8) {
        countDeleteName++;
        Count_na_delete_keyboard.push(
          `${countDeleteName}-${countSelectionName}`
        );
        countSelectionName = 1;
      }
    });
    fieldName.addEventListener("mouseup", function (e) {
      countSelectionName = e.target.selectionEnd - e.target.selectionStart;
      if (countSelectionName == 0) countSelectionName = 1;
    });
  });
}
handleCountNameTyping();

// ==============================HANDLE INPUT PHONE=====================================

function handleCountPhoneTyping() {
  forms.forEach(function (form) {
    var countDeletePhone = 0;
    var countSelectionPhone = 0;
    var fieldPhone = form.querySelector(".numeric");
    fieldPhone.addEventListener("input", function (e) {
      Count_po_keyboard += 1;
    });
    fieldPhone.addEventListener("keydown", function (e) {
      if (e.keyCode === 8) {
        countDeletePhone++;
        Count_po_delete_keyboard.push(
          `${countDeletePhone}-${countSelectionPhone}`
        );
        countSelectionPhone = 1;
      }
    });
    fieldPhone.addEventListener("mouseup", function (e) {
      countSelectionPhone = e.target.selectionEnd - e.target.selectionStart;
      if (countSelectionPhone == 0) countSelectionPhone = 1;
    });
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
  forms.forEach(function (form) {
    var fieldName = form.querySelector(".human");
    var fieldPhone = form.querySelector(".numeric");
    fieldName.addEventListener("click", function (e) {
      if (!timeNaIn) timeNaIn = new Date();
    });
    fieldName.addEventListener("focusout", function (e) {
      timeNaOut = new Date();
    });
    fieldPhone.addEventListener("click", function (e) {
      if (!timePoIn) timePoIn = new Date();
    });
    
    fieldPhone.addEventListener("focusout", function (e) {
        timePoOut = new Date();
    });
  });
}
setTimer();

function inputTiming() {
  var Action_na_time = Math.abs(timeNaOut - timeNaIn) / 1000;
  var Action_po_time = Math.abs(timePoOut - timePoIn) / 1000;
  var Action_po_to_submit = Math.abs((+new Date() - +timePoOut) / 1000);
  var Action_time = Math.abs(new Date() - timeFirstRenderPage) / 1000;
  var Action_form_time =
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
  await fetch(
    `${urlSyncGoogleSheetSpam}?phone=${phone}&link=${link}&SHEET_NAME=SDTValidate`,
    {
      method: "GET",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    }
  );
}
async function syncToSheetServerFail({
  name,
  phone,
  ad_channel,
  ad_account,
  link,
  reasons,
}) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  await fetch(
    `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&utmSource=${
      ad_channel || ""
    }&utmMedium=${
      ad_account || ""
    }&link=${link}&reasons=${reasons}&SHEET_NAME=ErrorServer`,
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
  link,
  spam,
  reasons,
}) {
  link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
  await fetch(
    `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&utmSource=${
      ad_channel || ""
    }&utmMedium=${
      ad_account || ""
    }&link=${link}&spam=${spam}&reasons=${reasons}&SHEET_NAME=TotalSDT`,
    {
      method: "GET",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    }
  );
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
  Skl_Visitor,
  visitorId,
  Typing_count_keyboard,
  Is_mobile,
  Is_keyboard_virtual,
  Count_device_motion
}) {
  var params = {
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
    Skl_Visitor,
    visitorId,
    Typing_count_keyboard,
    Is_mobile,
    Is_keyboard_virtual,
    Count_device_motion
  };
  var response = await fetch(bareURL, {
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
        reasons: data.reasons,
        ad_channel: data.ad_channel,
        ad_account: data.ad_account,
      });
      if (data.spam) {
        window.parent.location.replace(urlThankFake);
      } else {
        window.parent.location.replace(
          `${urlThankReal}?name=${Ten1}&phone=${Ten2}`
        );
      }
    })
    .catch(async function (error) {
      await syncToSheetServerFail({
        name: Ten1,
        phone: Ten2,
        link: parentUrl,
        reason: error.message,
        ad_channel: data.ad_channel,
        ad_account: data.ad_account,
      });
    });
}
function validateForm(form, fieldPhone) {
  var valuePhone = fieldPhone.value;
  var validate = true;
  if (!regexPhone.test(valuePhone)) {
    form.querySelector(".errorMessage").innerText =
      "Vui lòng nhập đúng định dạng số điện thoại";
    validate = false;
  }
  return validate;
}

function handleSubmit() {
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fieldName = form.querySelector(".human");
      var fieldPhone = form.querySelector(".numeric");
      var invalid = validateForm(form, fieldPhone);

      if (invalid) {
        var {
          Action_na_time,
          Action_po_time,
          Action_po_to_submit,
          Action_time,
          Action_form_time,
        } = inputTiming();
        var Ten1 = fieldName.value;
        var Ten2 = fieldPhone.value;
        var name = document.getElementById("ten2").value;
        var phone = document.getElementById("sdt2").value;
        var Is_mobile = detectDevice().isMobile;
        Sceensize = `${window.screen.width} x ${window.screen.height}`;
        Count_3rd_id = localStorage.getItem("Count_3rd_id");

        var buttonSubmit = form.querySelector(".form-submit button");
        buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
        buttonSubmit.parentElement.classList.add("disable");
        overlay.classList.add("active");


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
          Skl_Visitor,
          visitorId,
          Typing_count_keyboard,
          Is_mobile,
          Is_keyboard_virtual,
          Count_device_motion
        });
      }
    });
  });
}
handleSubmit();

// ===============================KEYBOARD VITUAL================================
function vitualKeyboard() {
  var selectedInput;
  var selecteInputElement;
  var simpleKeyboardWraper = document.querySelector("#skycomkeyboard");
  var buttonDone = document.querySelector(".keyboard-bar #button-done");
  var buttonFocusText = document.querySelector(".keyboard-bar #button-focusText");
  var { isMobile, isAndroid } = detectDevice();

  if (!isMobile) {
    return;
  }
  var Keyboard = window.SimpleKeyboard.default;
  if (isAndroid) {
    simpleKeyboardWraper.classList.add("keyboard-android");
    var keyboard = new Keyboard({
      onChange: (input) => onChange(input),
      onKeyPress: (value) => onKeyPress(value),
      layout: {
        default: ["1 2 3 {bksp}", "4 5 6 ", "7 8 9 {shift}", "0 * # ,"],
      },
      display: {
        '': "Đi",
        '{bksp}': '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 113.22 64.43"><defs><style>.cls-1{fill:#fff;stroke-width:2.71px;}.cls-1,.cls-2{stroke:#000;stroke-miterlimit:10;}.cls-2{fill:none;stroke-width:4.24px;}</style></defs><line class="cls-1" x1="62.3" y1="14.93" x2="91.26" y2="49.76"/><line class="cls-1" x1="91.26" y1="14.93" x2="62.3" y2="49.76"/><polygon class="cls-2" points="92.56 2.21 70.42 2.21 41.17 2.21 3.65 32.35 41.17 62.48 70.42 62.48 92.56 62.48 111.13 62.48 111.13 2.21 92.56 2.21"/></svg>',
        '{shift}' : '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 118.43 31.25"><defs><style>.cls-1{fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:1.68px;}</style></defs><line class="cls-1" x1="64.98" y1="1.81" x2="50.78" y2="29.15"/><line class="cls-1" x1="50.78" y1="1.81" x2="64.98" y2="29.15"/><line class="cls-1" x1="68.92" y1="15.48" x2="46.84" y2="15.48"/><line class="cls-1" x1="20.74" x2="20.89" y2="30.81"/><line class="cls-1" x1="5.41" y1="15.48" x2="36.22" y2="15.33"/><line class="cls-1" x1="96.52" y1="1.81" x2="82.32" y2="29.15"/><line class="cls-1" x1="105.79" y1="1.81" x2="91.59" y2="29.15"/><line class="cls-1" x1="107.56" y1="10.83" x2="85.48" y2="10.83"/><line class="cls-1" x1="104.41" y1="18.59" x2="82.32" y2="18.59"/></svg>',
        '*': '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 65.74 84.91"><defs><style>.cls-1{fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:5px;}</style></defs><line class="cls-1" x1="54" y1="2.08" x2="11.74" y2="83.48"/><line class="cls-1" x1="11.74" y1="2.08" x2="54" y2="83.48"/><line class="cls-1" x1="65.74" y1="42.78" y2="42.78"/></svg>',
        '#': '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 78 84.91"><defs><style>.cls-1{fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:5px;}</style></defs><line class="cls-1" x1="45.13" y1="2.08" x2="2.87" y2="83.48"/><line class="cls-1" x1="72.73" y1="2.08" x2="30.46" y2="83.48"/><line class="cls-1" x1="78" y1="28.96" x2="12.26" y2="28.96"/><line class="cls-1" x1="68.61" y1="52.04" x2="2.87" y2="52.04"/></svg>',
        0: "0<figure>+</figure>",
        2: "2<figure>A B C</figure>",
        3: "3<figure>D E F</figure>",
        4: "4<figure>G H I</figure>",
        5: "5<figure>J K L</figure>",
        6: "6<figure>M N O</figure>",
        7: "7<figure>P Q R S</figure>",
        8: "8<figure>T U V</figure>",
        9: "9<figure>W X Y Z</figure>",

      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      disableButtonHold: false,
      maxLength: 13,
    });
  }else{
    var keyboard = new Keyboard({
      onChange: (input) => onChange(input),
      onKeyPress: (value) => onKeyPress(value),
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "{shift} 0 {bksp}"],
      },
      display: {
        '{bksp}': '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 113.22 64.43"><defs><style>.cls-1{fill:#fff;stroke-width:2.71px;}.cls-1,.cls-2{stroke:#000;stroke-miterlimit:10;}.cls-2{fill:none;stroke-width:4.24px;}</style></defs><line class="cls-1" x1="62.3" y1="14.93" x2="91.26" y2="49.76"/><line class="cls-1" x1="91.26" y1="14.93" x2="62.3" y2="49.76"/><polygon class="cls-2" points="92.56 2.21 70.42 2.21 41.17 2.21 3.65 32.35 41.17 62.48 70.42 62.48 92.56 62.48 111.13 62.48 111.13 2.21 92.56 2.21"/></svg>',
        '{shift}' : '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 118.43 31.25"><defs><style>.cls-1{fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:1.68px;}</style></defs><line class="cls-1" x1="64.98" y1="1.81" x2="50.78" y2="29.15"/><line class="cls-1" x1="50.78" y1="1.81" x2="64.98" y2="29.15"/><line class="cls-1" x1="68.92" y1="15.48" x2="46.84" y2="15.48"/><line class="cls-1" x1="20.74" x2="20.89" y2="30.81"/><line class="cls-1" x1="5.41" y1="15.48" x2="36.22" y2="15.33"/><line class="cls-1" x1="96.52" y1="1.81" x2="82.32" y2="29.15"/><line class="cls-1" x1="105.79" y1="1.81" x2="91.59" y2="29.15"/><line class="cls-1" x1="107.56" y1="10.83" x2="85.48" y2="10.83"/><line class="cls-1" x1="104.41" y1="18.59" x2="82.32" y2="18.59"/></svg>',
        2: "2<figure>A B C</figure>",
        3: "3<figure>D E F</figure>",
        4: "4<figure>G H I</figure>",
        5: "5<figure>J K L</figure>",
        6: "6<figure>M N O</figure>",
        7: "7<figure>P Q R S</figure>",
        8: "8<figure>T U V</figure>",
        9: "9<figure>W X Y Z</figure>",
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      disableButtonHold: false,
      maxLength: 13,
    });
  }
  Is_keyboard_virtual = true;

  forms.forEach(function (form) {
    var phone = form.querySelector(".numeric");
    phone.addEventListener("focus", onInputFocus);
    phone.addEventListener("input", onInputChange);
    phone.setAttribute("readonly", "readonly");
   
  });
  function onInputFocus(event) {
    selectedInput = `#${event.target.id}`;
    selecteInputElement = document.querySelector(selectedInput);
    keyboard.setOptions({
      inputName: event.target.id,
    });
    updateCaret(selecteInputElement, initValue = 10);
  }
  function onInputChange(event) {
    keyboard.setInput(event.target.value, event.target.id);
  }

  function onChange(input) {
    selecteInputElement.value = input;
    if (input.length > 12) {
      selecteInputElement.closest("form").querySelector(".errorMessage").innerText = "Số điện thoại quá dài";
    } else {
      selecteInputElement .closest("form").querySelector(".errorMessage").innerText = "";
    }
    updateCaret(selecteInputElement);
  }

  function onKeyPress(value) {
    //var buttonElement = keyboard.getButtonElement(value) 
    Typing_count_keyboard++;
  }
  window.addEventListener("click", function (e) {
    if (selecteInputElement) {
      //event click arrow button
      if(buttonFocusText.contains(e.target)){
        selecteInputElement.closest("form").querySelector(".human").click();
        selecteInputElement.closest("form").querySelector(".human").focus();
      }
      //event click done button
      else if (buttonDone.contains(e.target)) {
        simpleKeyboardWraper.classList.remove("active");
        selecteInputElement.closest("form").querySelector(".custom-caret").classList.remove("active")
      }
      //event click input phone or keyboard Vitual 
      else if (selecteInputElement.contains(e.target) || simpleKeyboardWraper.contains(e.target)) {
        document.querySelectorAll(".custom-caret").forEach(function (caret) {
          caret.classList.remove("active")
        }); 
        simpleKeyboardWraper.classList.add("active");
        selecteInputElement.closest("form").querySelector(".custom-caret").classList.add("active")
      }
      //click outside input phone or keyboard Vitual 
      else {
        simpleKeyboardWraper.classList.remove("active");
        document.querySelectorAll(".custom-caret").forEach(function (caret) {
          caret.classList.remove("active")
        });
      }
    }
  });
}
vitualKeyboard(); 

function updateCaret(selecteInputElement, initValue) {
  var caretElement =  selecteInputElement.closest("form").querySelector(".custom-caret");
  var position = selecteInputElement.selectionStart ;
  if (!caretElement) {
    return;
  } 
  if (!initValue ) {
    caretElement.style.left = `${ 10 + (position * 8)}px`; // 10px là khoảng cách giữa các ký tự
    initValue = 0;
  } 
  caretElement.classList.add("active");
}

