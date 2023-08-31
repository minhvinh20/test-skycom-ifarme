
let encodeName = "",
  encodePhone = "";
const timeFirstRenderPage = new Date();
const regexPhone =
  /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;

let parentUrl =
  window.location.href.indexOf("split=") > -1
    ? window.location.href.split("split=")[1]
    : document.location.href;

const bareURL =
  "https://backendsyncdata.skycom.vn/api/spam_check/form-spam-check";
const urlThankReal = "https://hoaianbeauty.com/pages/cam-on-quy-khach";
const urlThankFake = "https://hoaianbeauty.com/pages/camon-quy-khach";
const urlSyncGoogleSheetSpam = "https://script.google.com/macros/s/AKfycbzGbJQ83uGDjEGC5x8yqbIjKr0ATrzk6gNYcIxAI958cHpSfc-r6KHnylZNK7fxCpFgaQ/exec";

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
function encryptionIDFileds() {
  inputCache.forEach((element, index) => {
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

const syncToSheetServerFail = async ({ name, phone, link, ad_channel, ad_account, reasons }) => {
  await fetch(
    `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&utmSource=${ad_channel}&utmMedium=${ad_account}
        &link=${link.replaceAll(
        "&",
        "_SKYCOM_"
        )}&reason=${reasons}&SHEET_NAME=ErrorServer`,
    {
      method: "GET",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    }
  );
};
const syncToSheetDataSubmit = async ({ name, phone, link, ad_channel, ad_account, spam, reasons }) => {
    link = link.indexOf("&") > -1 ? link.replaceAll("&", "_SKYCOM_") : link;
    await fetch(
        `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&link=${link}&utmSource=${ad_channel || 'none'}&utmMedium=${ad_account || 'none'}
            &spam=${spam}&reasons=${reasons}&SHEET_NAME=TotalSDT`,
        { 
        method: "GET",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        }
    );
};
function validateForm() {
  const valuePhone = document.getElementById(`${encodePhone}`).value;
  let validate = true;

  if (!regexPhone.test(valuePhone)) {
    document.getElementById("errorMessage").innerText =
      "Vui lòng nhập đúng định dạng số điện thoại";
    validate = false;
  }
  return validate;
}
const handlePostData = async ({ Ten1, Ten2, name, phone, time }) => {
  const params = { Ten1, Ten2, name, phone, link: parentUrl, actionTime: time };
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
        link: parentUrl,
        spam: data.spam,
        reasons: data.reasons,
        ad_channel: data.ad_channel,
        ad_account: data.ad_account
      });
      if (data.spam) {
        window.parent.location.replace(urlThankFake);
      } else {
        window.parent.location.replace(urlThankReal);
      }
    })
    .catch((error) => {
      syncToSheetServerFail({
        name: Ten1,
        phone: Ten2,
        link: parentUrl,
        ad_channel: data.ad_channel,
        ad_account: data.ad_account,
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
      const buttonSubmit = document.getElementById("btn-submit");
      buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
      buttonSubmit.parentElement.classList.add("disable");
      grecaptcha.ready(function() {
          grecaptcha.execute(buttonSubmit.getAttribute('data-sitekey'), {
              action: 'submit'
          }).then(function(token) {
            // Add your logic to submit to your backend server here.
            handlePostData({ Ten1, Ten2, name, phone, time: timeClickBuy });
          });
      });
    }
  });
}
handleSubmit();

function randomPositionFields() {
  const wrapper = document.querySelectorAll(".form-control");
  const fieldName = document.getElementById(encodeName).parentElement.innerHTML;
  const fieldPhone =
    document.getElementById(encodePhone).parentElement.innerHTML;

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

function disableCopy() {
  document.getElementById(encodeName).onpaste = (e) => e.preventDefault();
  document.getElementById(encodePhone).onpaste = (e) => e.preventDefault();
}
disableCopy();

function disableEnterSubmit() {
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      return;
    }
  });
}
disableEnterSubmit();

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

