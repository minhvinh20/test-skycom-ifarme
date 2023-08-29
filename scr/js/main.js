const bareURL = "https://backendsyncdata.skycom.vn/api/spam_check/form-spam-check";
const urlThankReal = "https://hoaianbeauty.com/pages/cam-on-quy-khach";
const urlThankFake = "https://hoaianbeauty.com/pages/camon-quy-khach";
const urlSyncGoogleSheetSpam = "https://script.google.com/macros/s/AKfycbwY41riivxpKhDxprsXxp3zdO05F1LWn3OTDhyW-TXt0ytauHlUM6-9EFGjuyWT09Oecg/exec";

// =================================================================== 

let encodeName = "", encodePhone = "", encodeAddress = "";
const timeFirstRenderPage = new Date();
const regexPhone = /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;

let parentUrl = window.location.href.indexOf("split=") > -1 ? window.location.href.split("split=")[1] : document.location.href;

const inputCache = document.querySelectorAll(".input-cache input");
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
const syncToSheetServerFail = async ({ name, phone, address, link, reasons }) => {
    link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
    await fetch(
        `${urlSyncGoogleSheetSpam}?name=${name}&phone=${phone}&address=${address}&link=${link}&reasons=${reasons}&SHEET_NAME=ErrorServer`,
        {
            method: "GET",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            redirect: "follow",
        }
    );
};
const syncToSheetDataSubmit = async ({ name, phone, address, link, spam, reasons }) => {
    link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
    await fetch(
        `${urlSyncGoogleSheetSpam}?name=${name}&phone=${phone}&address=${address}&link=${link}&spam=${spam}&reasons=${reasons}&SHEET_NAME=TotalSDT`,
        {
            method: "GET",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            redirect: "follow",
        }
    );
};
const handlePostData = async ({ Ten1, Ten2, Address, name, phone, time }) => {
    const params = { Ten1, Ten2, Address, name, phone, link: parentUrl, actionTime: time };
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
            address: Address,
            link: parentUrl,
            spam: data.spam,
            reasons: data.reasons,
        });
        if (data.spam) {
            window.parent.location.replace(urlThankFake);
        } else {
            window.parent.location.replace(urlThankReal);
        }
        console.log(data)
    })
    .catch((error) => {
        syncToSheetServerFail({
            name: Ten1,
            phone: Ten2,
            address: Address,
            link: parentUrl,
            reason: error.message,
        });
    });
};


function handleSubmit() {
  form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const invalid = validateForm();
    if (invalid) {
        const timeClickBuy = Math.round(Math.abs(new Date() - timeFirstRenderPage) / 1000);
        const Ten1 = document.getElementById(`${encodeName}`).value;
        const Ten2 = document.getElementById(`${encodePhone}`).value;
        const name = document.getElementById("ten2").value;
        const phone = document.getElementById("sdt2").value;
        const address = document.getElementById(`${encodeAddress}`).value;
        const buttonSubmit = document.getElementById("btn-submit");
        buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
        buttonSubmit.parentElement.classList.add("disable");
        grecaptcha.ready(function() {
            grecaptcha.execute(buttonSubmit.getAttribute('data-sitekey'), {
                action: 'submit'
            }).then(function(token) {
                // Add your logic to submit to your backend server here.
                handlePostData({ Ten1, Ten2, Address: address, name, phone, time: timeClickBuy });
            });
        });
    }
  });
}
handleSubmit();
// ===================================================================
function randomPositionFields() {
    const wrapper = document.querySelectorAll(".form-control");
    const fieldName  = document.getElementById(encodeName).parentElement.innerHTML;
    const fieldPhone = document.getElementById(encodePhone).parentElement.innerHTML;
    const fieldAddress = document.getElementById(encodeAddress).parentElement.innerHTML;
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
  document.getElementById(encodePhone).onpaste = (e) => e.preventDefault();
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
function addGclid() {
    var gclidParam = getParam('gclid');
    var gclidFormFields = ['gclid_field', 'foobar'];
    var gclidRecord = null;
    var currGclidFormField;
    var gclsrcParam = getParam('gclsrc');
    var isGclsrcValid = !gclsrcParam || gclsrcParam.indexOf('aw') !== -1;

    gclidFormFields.forEach(function(field) {
        if (document.getElementById(field)) {
            currGclidFormField = document.getElementById(field);
        }
    });

    if (gclidParam && isGclsrcValid) {
        gclidRecord = getExpiryRecord(gclidParam);
        localStorage.setItem('gclid', JSON.stringify(gclidRecord));
    }

    var gclid = gclidRecord || JSON.parse(localStorage.getItem('gclid'));
    var isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;
    if (currGclidFormField && isGclidValid) {
        currGclidFormField.value = gclid.value;
        document.getElementById('expiry').value = gclid.expiryDate;
    }
}
window.addEventListener('load', addGclid);