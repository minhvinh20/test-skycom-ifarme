const bareURL = "https://backendsyncdata.skycom.vn/api/spam_check/form-spam-check";
const urlThankReal = "https://hoaianbeauty.com/pages/cam-on-quy-khach";
const urlThankFake = "https://hoaianbeauty.com/pages/camon-quy-khach";
const urlSyncGoogleSheetSpam ="https://script.google.com/macros/s/AKfycbzGbJQ83uGDjEGC5x8yqbIjKr0ATrzk6gNYcIxAI958cHpSfc-r6KHnylZNK7fxCpFgaQ/exec";

// =================================================================== 

let encodeName  = "", 
    encodePhone = "", 
    encodeAddress = "",
    timeAdress = '',
    timeNaIn = 0, 
    timeNaOut = 0, 
    timePoIn = 0, 
    timePoOut = 0, 
    timePhoneKeydown = 0,
    timePhoneKeyup = 0,
    action_na_to_po_time = 0,
    tracking_el_phone_time = '';
    inputNameCount = 0,
    inputPhoneCount = 0,
    fe_check = false, 
    isShowKeyboard = false
    note = '',
    adsClickId = '',
    third_id = 0,
    count_third_id = 1,
    change_3rd_id = false,
    touchEvent_supported = false,
    maxTouchPoints = navigator.maxTouchPoints,
    orientation_support = false;

const timeFirstRenderPage = new Date();
const regexPhone = /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;
const iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);

let parentUrl = window.location.href.indexOf("split=") > -1 ? window.location.href.split("split=")[1] : window.top.location.href;

const elInputs = document.querySelectorAll(".input-cache input"); 
const form = document.querySelector(".form-submit--skycom form");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const number = getRandomInt(100);
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
        if (index == 2) {
            encodeAddress = randomString;
        }
        let placeholder = element.getAttribute("placeholder");
        placeholder += textEnpty(100) + randomString + "-" + randomString + textEnpty(getRandomInt(20)) + randomString + "-" + randomString;
        element.setAttribute("id", randomString);
        element.setAttribute("name", randomString);
        element.setAttribute("placeholder", placeholder);
    });
}
encryptionIDFileds();


// ===================================================================

function validateForm() {
    const valuePhone = document.getElementById(`${encodePhone}`).value;
    let validate = true;

    if (!regexPhone.test(valuePhone)) {
        document.getElementById("errorMessage").innerText = "Vui lòng nhập đúng định dạng số điện thoại";
        validate = false;
    }
    return validate;
}
const syncToSheetServerFail = async ({ name, phone, address, ad_channel, ad_account, link, reasons }) => {
    link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
    await fetch(
        `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&address=${address}&utmSource=${ad_channel || ''}&utmMedium=${ad_account || ''}&link=${link}&reasons=${reasons}&SHEET_NAME=ErrorServer`,
        {
          method: "GET",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
        }
    );
};
const syncToSheetDataSubmit = async ({ name, phone, address, ad_channel, ad_account, link, spam, reasons }) => {
    link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
    await fetch(
        `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&address=${address}&utmSource=${ad_channel || ''}&utmMedium=${ad_account || ''}&link=${link}&spam=${spam}&reasons=${reasons}&SHEET_NAME=TotalSDT`,
        {
          method: "GET",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
        }
    );
};
const handlePostData = async ({ 
    Ten1,
    Ten2,
    name,
    phone,
    address,
    fe_check,
    note,
    action_po_time,
    action_na_time,
    action_ad_time,
    action_na_to_po_time,
    action_po_to_submit,
    tracking_el_phone_time,
    input_name_count,
    input_phone_count,
    count_third_id,
    change_3rd_id,
    time,
    maxTouchPoints,
    orientation_support,
    touchEvent_supported,
    screen_size }) => {
    const params = { Ten1,
       Ten2,
       name,
       phone,
       address,
       fe_check,
       note,
       link: parentUrl,
       action_po_time,
       action_na_time,
       action_ad_time,
       action_na_to_po_time,
       action_po_to_submit,
       tracking_el_phone_time,
       input_name_count,
       input_phone_count,
       count_third_id,
       change_3rd_id,
       actionTime: time,
       maxTouchPoints,
       orientation_support,
       touchEvent_supported,
       screen_size };
    const response = await fetch(bareURL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
    .then((response) => {
      return response.json();
    })
    .then(async(data) => {
        await syncToSheetDataSubmit({
          name: Ten1,
          phone: Ten2,
          link: parentUrl,
          address : address,
          spam: data.spam,
          reasons: data.reasons,
          ad_channel: data.ad_channel,
          ad_account: data.ad_account,
        });
        if (data.spam) {
          window.parent.location.replace(urlThankFake);
        } else {
          window.parent.location.replace(`${urlThankReal}?name=${Ten1}&phone=${Ten2}&address=${address}`);
        }
    })
    .catch(async (error) => {
        await syncToSheetServerFail({
          name: Ten1,
          phone: Ten2,
          address : address,
          link: parentUrl,
          reason: error.message,
          ad_channel: data.ad_channel,
          ad_account: data.ad_account,
        });
    });
};
const checkCookieDisable = () =>{
  if(iOSDevice){
    return;
  }
  let cookieEnabled = navigator.cookieEnabled;
  if (!cookieEnabled){ 
      document.cookie = "skycomForm=skycom";
      cookieEnabled = document.cookie.indexOf("skycomForm")!= -1 ;
  }
  if(!cookieEnabled) {
      if (!fe_check) {
        fe_check = true;
        note = 'Detect disable cookie'
      }
  }
}
function handleSubmit() {
  form.addEventListener('submit', (e) =>{
    e.preventDefault();

    handleCheckShowKeyboard();
    handleCheckPhoneInputTyping();
    checkCookieDisable();
    
    const invalid = validateForm();
    if (invalid) {

      const { action_po_time, action_na_time, action_ad_time, timeClickBuy, action_po_to_submit, action_na_to_po_time } = inputTiming();
      const Ten1 = document.getElementById(`${encodeName}`).value;
      const Ten2 = document.getElementById(`${encodePhone}`).value;
      const name = document.getElementById("ten2").value;
      const phone = document.getElementById("sdt2").value;
      const address = document.getElementById(encodeAddress).value;
      const input_phone_count = inputPhoneCount;
      const input_name_count = inputNameCount;
      const screen_size = `${window.screen.width} x ${window.screen.height}`;
      count_third_id = localStorage.getItem("count_third_id");
      
      const overlay = document.getElementById("overlay");
      const buttonSubmit = document.getElementById("btn-submit");
      buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
      buttonSubmit.parentElement.classList.add("disable");
      overlay.classList.add("active")
      
      console.log('touchEvent_supported', touchEvent_supported)
      handlePostData({ 
        Ten1, 
        Ten2,
        name,
        phone,
        address,
        fe_check,
        note,
        action_po_time,
        action_na_time,
        action_ad_time,
        action_na_to_po_time,
        action_po_to_submit,
        tracking_el_phone_time,
        input_name_count,
        input_phone_count,
        count_third_id,
        change_3rd_id,
        time: timeClickBuy,
        maxTouchPoints,
        orientation_support,
        touchEvent_supported,
        screen_size
      });
      resetState();
    }
  });
}
handleSubmit();

// ===================================================================
function randomPositionFields() {
  const wrapper = document.querySelectorAll(".form-control");
  const fieldName  = document.getElementById(encodeName).parentElement.innerHTML;
  const fieldPhone = document.getElementById(encodePhone).parentElement.innerHTML;
  if (number % 2 === 0) {
      wrapper[0].innerHTML = fieldName;
      wrapper[1].innerHTML = fieldPhone;

  } else {
      wrapper[0].innerHTML = fieldPhone;
      wrapper[1].innerHTML = fieldName;
  }
  document.getElementById(encodeName).classList.remove("hidden"); 
  document.getElementById(encodePhone).classList.remove("hidden"); 
}
//randomPositionFields();
// ===================================================================
function disableCopy() {
  document.getElementById(encodeName).onpaste = (e) => e.preventDefault();
  document.getElementById(encodePhone).onpaste = (e) => e.preventDefault();
  document.getElementById(encodeAddress).onpaste = (e) => e.preventDefault();
}
disableCopy();

// ===================================================================
function disableEnterSubmit() {
  document.addEventListener("keydown",(e) => {
    if (e.keyCode === 13 || e.keyCode == 9 ) {
      e.preventDefault();
      return;
    }
  });
}
disableEnterSubmit();

// ===================================================================

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
function listenEventChangeFielsValidate() {
  const fieldPhone = document.getElementById(encodePhone);
  fieldPhone.addEventListener("input", (e) => {
    if (regexPhone.test(e.target.value)) {
      syncToSheetValidate({ phone: e.target.value, link: parentUrl });
    }
  });
}
listenEventChangeFielsValidate();

// ===================================================================
const checkProxyEnable = () =>{
    const proxyHeader = 'via';
    let req = new XMLHttpRequest();
    req.open('GET', window.location, false);
    req.send();
    let header = req.getResponseHeader(proxyHeader);
    if (header) {
        fe_check = true,
        note = 'Detect disable Proxy'
    }
}
checkProxyEnable();

// ==================================RESET=============================
const resetState = () => {
  isShowKeyboard = false;
  inputPhoneCount = 0;
}

const detectDevice = () => {
  let isIOS = false;
  let isMobile = false;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true;
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        isIOS = true
      }
  }
  return { isIOS, isMobile }
}
// =================================CHECK SHOW KEYBOARD===============================
const handleCheckShowKeyboard = () => {
  if (!fe_check) {
      const isMobile = detectDevice().isMobile;
      if (isMobile) {
         if (isShowKeyboard) {
             fe_check = false;
         } else {
             fe_check = true;
             note = "Bot không sử dụng bàn phím"
         }
      }
  }
}
// =================================CHECK PHONE INPUT TYPING===============================
// nếu người dụng va chạm phone input dưới 9 lần thì là bot
const handleCheckPhoneInputTyping = () => {
  if (!fe_check) {
      const isMobile = detectDevice().isMobile;
      if (isMobile) {
          if (inputPhoneCount > 9) {
              fe_check = false;
          } else {
              fe_check = true;
              note = "Bot nhập ký tự sđt dưới 9 lần"
          }
      }

  }
}

// detect show keyboard
if ('visualViewport' in window) {
  window.visualViewport.addEventListener('resize', function (event) {
    isShowKeyboard = true;
  });
}

// listening forcus input
let timePoInLast = 0; 
const listenEventFocus = ()=>{
  const human = document.querySelector('.human');
  const phone = document.querySelector('.numeric');
  human?.addEventListener('focus', e => {
    if (!timeNaIn) {
        timeNaIn = new Date();
    }
  })
  human?.addEventListener('focusout', e => {
    timeNaOut = new Date();
  })
  phone?.addEventListener('focus', e => {
    if (!timePoIn) {
      timePoIn = new Date();
    }
    timePoInLast = new Date();
  })
  phone?.addEventListener('focusout', e => {
    timePoOut = new Date();
  })
  document.getElementById(encodeAddress).addEventListener('focus', () =>{ 
    if (timeAdress == '') {timeAdress = new Date();}
  });
}
listenEventFocus();

// ===============================INPUT TIMING=================================

const inputTiming = () => {
  const action_po_time = Math.round(Math.abs(timePoOut - timePoIn) / 1000);
  const action_na_time = Math.round(Math.abs(timeNaOut - timeNaIn) / 1000);
  const timeClickBuy  = Math.round(Math.abs((new Date() - timeFirstRenderPage))/ 1000);
  const action_po_to_submit = Math.abs(((+ new Date()) - (+timePoOut))/1000);
  const action_ad_time = Math.round(Math.abs((new Date() - timeAdress)) / 1000);
  const action_na_to_po_time =`${Math.abs(((+ timePoInLast) - (+timeNaOut))/1000)}`;

  return { action_po_time, action_na_time, action_ad_time, timeClickBuy, action_po_to_submit, action_na_to_po_time }
}

// ===============================COUNT KEYBOARD WHEN INPUT=================================
const handleCountPhoneTyping = () => {
  inputPhoneCount += 1;
}
const handleCountNameTyping = () => {
  inputNameCount += 1;
}
// ===============================TRACHKING ELEMENT PHONE KEYUP AND KEYDOWN=================================

const resetTime = () =>{
  timePhoneKeydown =0;
  timePhoneKeyup = 0;
}
const trackingElPhoneTime = () => {
  const fieldPhone = document.getElementById(encodePhone);
  fieldPhone.addEventListener("keydown", () =>{
    if (!timePhoneKeydown) {
      timePhoneKeydown = new Date();
    }
  })
  fieldPhone.addEventListener("keyup", () =>{
    if (!timePhoneKeyup) {
      timePhoneKeyup = new Date();
    }
    tracking_el_phone_time +=`${Math.abs(((+ timePhoneKeyup) - (+timePhoneKeydown))/1000)}, `;
    resetTime();
  })
}
trackingElPhoneTime();

// ===============================Count View Page================================
const detectAdsId = () =>{
  const params = parentUrl.split("&");
  const utmSource   = params?.find( param => param.indexOf("utm_source") > -1);
  if (!utmSource) {
    return
  }
  if (utmSource.indexOf("facebook") > -1) {
    adsClickId = params.find( param => param.indexOf("fbclid") > -1);
  }
  if (utmSource.indexOf("youtube") > -1 || utmSource.indexOf("google") > -1 ) {
    adsClickId = params.find( param => param.indexOf("gclid") > -1);
  }
  if (utmSource.indexOf("tiktok") > -1  ) {
    adsClickId = params.find( param => param.indexOf("ttclid") > -1);
  }
  third_id = adsClickId?.split("=")[1];
}
detectAdsId();
const countViewPage = () => {
  const nameLocalStorage3rdID = "3rd_id";
  const nameLocalStorageCount3rdID = "count_third_id";

  if (third_id && !localStorage.getItem(nameLocalStorage3rdID)) {
    localStorage.setItem(nameLocalStorage3rdID, third_id);
  }
  if(third_id){
    if (localStorage.getItem(nameLocalStorage3rdID) != third_id) {
      change_3rd_id = true;
    }
    else{
      if (localStorage.getItem(nameLocalStorageCount3rdID)) {
        localStorage.setItem(nameLocalStorageCount3rdID, Number(localStorage.getItem(nameLocalStorageCount3rdID)) + 1);
      }else{
        localStorage.setItem(nameLocalStorageCount3rdID, count_third_id);
      }
    }
  }
}
countViewPage();

// ===============================CHECK TOUCH EVENT================================

const checkTouchSupport = () => {
  window.addEventListener("touchstart", (event) => {
    touchEvent_supported = true;
  });
}
checkTouchSupport();

// ===============================CHECK Device Orientation EVENT================================

const checkDeiceOrientation = () => {
  if (window.DeviceOrientationEvent || window.DeviceMotionEvent) {
    orientation_support = true;
  }
}
checkDeiceOrientation();
