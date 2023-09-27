var bareURL = "https://devsyncdata.skycom.vn/api/spam_check/form-spam-check";
var urlThankReal = "https://hoaianbeauty.com/pages/cam-on-quy-khach";
var urlThankFake = "https://hoaianbeauty.com/pages/camon-quy-khach";
var urlSyncGoogleSheetSpam =
  "https://script.google.com/macros/s/AKfycbzGbJQ83uGDjEGC5x8yqbIjKr0ATrzk6gNYcIxAI958cHpSfc-r6KHnylZNK7fxCpFgaQ/exec";
var URLFingerID = "https://fpjscdn.net/v3/7aRN8UmVm1n7Qsda0mOm";

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
  Action_po_time = 0,
  Action_po_to_submit = 0,
  Is_open_po_keyboard = null,
  Count_po_delete_keyboard = [],
  Action_time = 0,
  Action_form_time = 0,
  Skl_Visitor = 0,
  visitorId = 0,
  adsClickId = "",
  third_id = 0,
  Count_3rd_id = 1,
  change_3rd_id = false,
  Typing_count_keyboard = 0;

(Sceensize = ""), (Touch_pixel = []), (Is_device_motion_change = null);

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
  var isMobile = window.innerWidth < 768;
  var isKeyboardOpen =
    isMobile &&
    window.screen.height - MIN_KEYBOARD_HEIGHT > window.visualViewport.height;
  return isKeyboardOpen;
}
// // ======================================================================

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

// ===============================CHECK TOUCH EVENT================================

function checkTouchSupport() {
  forms.forEach(function (form) {
    var fieldName = form.querySelector(".human");
    var fieldPhone = form.querySelector(".numeric");
    var buttonSubmit = form.querySelector(".form-submit button");
    window.addEventListener("touchstart", function (e) {
      if (
        fieldName.parentElement.contains(e.target) ||
        fieldPhone.parentElement.contains(e.target) ||
        buttonSubmit.contains(e.target)
      )
        for (let i = 0; i < e.touches.length; i++) {
          const positionX = e.touches[i].screenX.toFixed(2);
          const positionY = e.touches[i].screenY.toFixed(2);
          Touch_pixel.push(`${positionX}_${positionY}`);
        }
    });
  });
}
checkTouchSupport();

// ===============================CREATE VISITOR ID================================

// function createVisitorIdByFinger () {
//     const fpPromise = import(URLFingerID).then((FingerprintJS) => FingerprintJS.load());
//     fpPromise
//       .then(async (fp) => await fp.get())
//       .then((result) => {
//           visitorId = result.visitorId;
//       });
// };
// createVisitorIdByFinger();

// // ===============================CREATE SKL VISITORID================================

// function getHash(str, algo = "SHA-256") {
//   var strBuf = new TextEncoder().encode(str);
//   return crypto.subtle.digest(algo, strBuf).then(function(hash){
//     window.hash = hash;
//     var stringHash = "";
//     var view = new DataView(hash);
//     for (var i = 0; i < hash.byteLength; i += 4) {
//       stringHash += view.getUint16(i).toString(16).slice(-8);
//     }
//     return stringHash;
//   });
// }
// function createSklVisitorIdByFinger() {
//   var fpPromise = FingerprintJS.load();
//   fpPromise
//     .then(async function(fp) {await fp.get({ extendedResult: true })}.bin)
//     .then(function(result){
//       console.log('first', result)
//       const components = result.components;
//       const stringHash =
//           components.deviceMemory.value +
//           components.audio.value +
//           components.webGlExtensions.value.contextAttributes.toString() +
//           components.webGlExtensions.value.extensionParameters.toString() +
//           components.webGlExtensions.value.extensions.toString() +
//           components.webGlExtensions.value.parameters.toString() +
//           components.webGlExtensions.value.shaderPrecisions.toString() +
//           components.canvas.value.geometry;
//       getHash(stringHash).then(function(hash){
//           Skl_Visitor = hash;
//       });
//     });
// };
// createSklVisitorIdByFinger();

// // ===============================COUNT 3RD VIEW================================

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
      //check keyboard open
      window.visualViewport.addEventListener("resize", function () {
        Is_open_na_keyboard = listenerKeyboardOpen();
      });
    });
    fieldName.addEventListener("focusout", function (e) {
      timeNaOut = new Date();
    });
    fieldPhone.addEventListener("click", function (e) {
      if (!timePoIn) timePoIn = new Date();
      window.visualViewport.addEventListener("resize", function () {
        Is_open_po_keyboard = listenerKeyboardOpen();
      });
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

// // ==============================HANDLE SUBMIT=====================================
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

        // alert('Ten1', Ten1)
        // alert('Ten2', Ten2)
        // alert('Count_na_keyboard', Count_na_keyboard)
        // alert('Action_na_time', Action_na_time)
        // alert('Is_open_na_keyboard', Is_open_na_keyboard)
        // alert('Count_na_delete_keyboard', Count_na_delete_keyboard)
        // alert('Count_po_keyboard', Count_po_keyboard)
        // alert('Action_po_time', Action_po_time)
        // alert('Action_po_to_submit', Action_po_to_submit)
        // alert('Is_open_po_keyboard', Is_open_po_keyboard)
        // alert('Count_po_delete_keyboard', Count_po_delete_keyboard)
        // alert('Action_time', Action_time)
        // alert('Action_form_time', Action_form_time)
        // alert('Sceensize', Sceensize)
        // alert('Touch_pixel', Touch_pixel)
        // alert('Count_3rd_id', Count_3rd_id)

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
        });
      }
    });
  });
}
handleSubmit();

// ===============================KEYBOARDß VITUAL================================
function vitualKeyboard() {
  var selectedInput;
  var selecteInputElement;
  var simpleKeyboardWraper = document.querySelector("#skycomkeyboard");
  var { isMobile, isAndroid } = detectDevice();

  if (!isMobile) {
    return;
  }
  if (isAndroid) {
    simpleKeyboardWraper.classList.add("keyboard-android");
  }
  var Keyboard = window.SimpleKeyboard.default;
  var keyboard = new Keyboard({
    onChange: (input) => onChange(input),
    onKeyPress: (button) => onKeyPress(button),
    layout: {
      default: ["1 2 3", "4 5 6", "7 8 9", " 0 {bksp}"],
    },
    display: {
      "": "+&#8727;#",
      "{bksp}": "⌫",
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
  var buttonDone = document.querySelector(".keyboard-bar #button-done");
  forms.forEach(function (form) {
    var phone = form.querySelector(".numeric");
    phone.addEventListener("focus", onInputFocus);
    phone.addEventListener("input", onInputChange);
    phone.setAttribute("readonly", "readonly");
    phone.blur();
  });
  function onInputFocus(event) {
    selectedInput = `#${event.target.id}`;
    selecteInputElement = document.querySelector(selectedInput);
    keyboard.setOptions({
      inputName: event.target.id,
    });
  }
  function onInputChange(event) {
    keyboard.setInput(event.target.value, event.target.id);
  }

  function onChange(input) {
    selecteInputElement.value = input;
    if (input.length > 12) {
      selecteInputElement
        .closest("form")
        .querySelector(".errorMessage").innerText = "Số điện thoại quá dài";
    } else {
      selecteInputElement
        .closest("form")
        .querySelector(".errorMessage").innerText = "";
    }
  }

  function onKeyPress(button) {
    Typing_count_keyboard++;
  }
  window.addEventListener("click", function (e) {
    if (selecteInputElement) {
      if (buttonDone.contains(e.target)) {
        simpleKeyboardWraper.classList.remove("active");
        document.querySelectorAll(".human").forEach(function (input) {
          input.style.opacity = "1";
        });
      } else if (
        selecteInputElement.contains(e.target) ||
        simpleKeyboardWraper.contains(e.target)
      ) {
        simpleKeyboardWraper.classList.add("active");
        document.querySelectorAll(".human").forEach(function (input) {
          input.style.opacity = "1";
        });
        selecteInputElement
          .closest("form")
          .querySelector(".human").style.opacity = "0.3";
        if (document.querySelector("body .ladi-wraper")) {
          simpleKeyboardWraper.style.width = `${
            document.querySelector("body .ladi-wraper").offsetWidth
          }px`;
        }
      } else {
        simpleKeyboardWraper.classList.remove("active");
        document.querySelectorAll(".human").forEach(function (input) {
          input.style.opacity = "1";
        });
      }
    }
  });
}
vitualKeyboard();
