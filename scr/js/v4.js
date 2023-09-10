const bareURL = "https://backendsyncdata.skycom.vn/api/spam_check/form-spam-check";
const urlThankReal = "https://hoaianbeauty.com/pages/cam-on-quy-khach";
const urlThankFake = "https://hoaianbeauty.com/pages/camon-quy-khach";
const urlSyncGoogleSheetSpam ="https://script.google.com/macros/s/AKfycbzGbJQ83uGDjEGC5x8yqbIjKr0ATrzk6gNYcIxAI958cHpSfc-r6KHnylZNK7fxCpFgaQ/exec";

// =================================================================== 

let encodeName = "",   encodePhone= "", encodeAddress = "", timeAdress = '', fe_check = false, note = '';
const timeFirstRenderPage = new Date();
const regexPhone = /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;
const iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
let parentUrl = window.location.href.indexOf("split=") > -1 ? window.location.href.split("split=")[1] : window.top.location.href;

const inputCache = document.querySelectorAll(".input-cache input");
const elPhone = inputCache[1];
const form = document.getElementById("form1");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const number = getRandomInt(100);

function textEnpty(e) {
  let _str = " ";
  return _str.repeat(e);
}

// ===================================================================
function encryptionIDFileds() {
    inputCache.forEach((element, index) => {
        const randomString = (Math.random() + 1).toString(36).slice(2, 7);
        if (index === 0) {
          encodeName = randomString;
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
    const randomIdPhone = (Math.random() + 1).toString(36).slice(2, 7);
    encodePhone = randomIdPhone;
    elPhone.setAttribute("id", randomIdPhone);
}
encryptionIDFileds();
// ===================================================================

function validateForm() {
    const valuePhone = document.getElementById(`${encodePhone}`).innerText;
    const valueAddress = document.getElementById(`${encodeAddress}`).value;
    let validate = true;

    if (!regexPhone.test(valuePhone)) {
        document.getElementById("errorMessage").innerText = "Vui lòng nhập đúng định dạng số điện thoại";
        validate = false;
    }
    if (valueAddress.trim() == '') {
        document.getElementById("errorMessage").innerText = "Vui lòng nhập địa chỉ";
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
const handlePostData = async ({ Ten1, Ten2, address, name, phone, fe_check, note, action_ad_time, time }) => {
    const params = { Ten1, Ten2, address, name, phone, fe_check, note, link: parentUrl, action_ad_time, actionTime: time };
    const response = await fetch(bareURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        syncToSheetDataSubmit({
          name: Ten1,
          phone: Ten2,
          address: address,
          link: parentUrl,
          spam: data.spam,
          reasons: data.reasons,
          ad_channel: data.ad_channel,
          ad_account: data.ad_account,
        });
        if (data.spam) {
          window.parent.location.replace(urlThankFake);
        } else {
          window.parent.location.replace(`${urlThankReal}?name=${Ten1}&phone=${Ten2}&address=${address}}`);
        }
    })
    .catch((error) => {
        syncToSheetServerFail({
          name: Ten1,
          phone: Ten2,
          address: address,
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
      fe_check = true;
      note = 'Detect disable cookie'
  }
}
function handleSubmit() {
  document.getElementById(encodeAddress).addEventListener('focus', () =>{ 
    if (timeAdress == '') {timeAdress = new Date();}
  });
  form.addEventListener('submit', (e) =>{
    e.preventDefault();
    checkCookieDisable();
    const action_ad_time = Math.round(Math.abs(new Date() - timeAdress) / 1000);
    const invalid = validateForm();
    if (invalid) {
        const timeClickBuy = Math.round(Math.abs(new Date() - timeFirstRenderPage) / 1000);
        const Ten1 = document.getElementById(`${encodeName}`).value;
        const Ten2 = document.getElementById(`${encodePhone}`).innerText;
        const name = document.getElementById("ten2").value;
        const phone = document.getElementById("sdt2").value;
        const address = document.getElementById(`${encodeAddress}`).value;
        const buttonSubmit = document.getElementById("btn-submit");
        buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
        buttonSubmit.parentElement.classList.add("disable");
        handlePostData({ Ten1, Ten2, address: address.trim(), name, phone,  fe_check, note, action_ad_time, time: timeClickBuy });
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
randomPositionFields();

// ===================================================================
function disableCopy() {
  document.getElementById(encodeName).onpaste = (e) => e.preventDefault();
  document.getElementById(encodeAddress).onpaste = (e) => e.preventDefault();
}
disableCopy();

// ===================================================================
function disableEnterSubmit() {
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
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
        checkProxy = true,
        note = 'Detect disable Proxy'
    }
}
checkProxyEnable();


const vitualKeyboard = () =>{
  const fieldPhone = document.getElementById(encodePhone);
  const simpleKeyboardWraper = document.querySelector("#skycomkeyboard");
  let Keyboard = window.SimpleKeyboard.default;
  let keyboard = new Keyboard({
    onChange: input => onChange(input),
    layout: {
      default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp}"],
    },
    display: {
      '{bksp}': 'xóa',
    },
    theme: "hg-theme-default hg-layout-numeric numeric-theme",
    useMouseEvents: true,
    autoUseTouchEvents: true

  });
  function onChange(input) {
    fieldPhone.value = input;
  }
  fieldPhone.addEventListener('keydown', function(event) {
    event.preventDefault(); // Prevent the default keyboard input behavior
  });
  fieldPhone.addEventListener('cut', function(event) {
    event.preventDefault(); // Prevent cutting text from the input field
  });
  function isMobile() {
    var match = window.matchMedia || window.msMatchMedia;
    if(match) {
        var mq = match("(pointer:coarse)");
        return mq.matches;
    }
    return false;
  }
  const checkMobile = isMobile();
  if(!checkMobile) {
    fieldPhone.setAttribute("readonly");
  }
  window.addEventListener('click', function(e){   
    if (fieldPhone.contains(e.target) || simpleKeyboardWraper.contains(e.target)){
      simpleKeyboardWraper.classList.remove("hidden");
    } else{
      simpleKeyboardWraper.classList.add("hidden");
    }
  });

}
vitualKeyboard();