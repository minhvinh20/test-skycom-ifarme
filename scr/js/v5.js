
const bareURL = "https://backendsyncdata.skycom.vn/api/spam_check/form-spam-check";
const urlThankReal = "https://hoaianbeauty.com/pages/cam-on-quy-khach";
const urlThankFake = "https://hoaianbeauty.com/pages/camon-quy-khach";
const urlSyncGoogleSheetSpam = "https://script.google.com/macros/s/AKfycbzGbJQ83uGDjEGC5x8yqbIjKr0ATrzk6gNYcIxAI958cHpSfc-r6KHnylZNK7fxCpFgaQ/exec";

// =================================================================== 
const phonePlaceholder = "Nhập số điện thoại(*)"

let encodeName = "", encodePhone = "", fe_check = false, note = '', isShowKeyboard = false, timeNaIn = 0, timeNaOut = 0, timePoIn = 0, timePoOut = 0, inputPhoneCount = 0;

const timeFirstRenderPage = new Date();
const regexPhone = /^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/;
let parentUrl = window.location.href.indexOf("split=") > -1 ? window.location.href.split("split=")[1] : window.top.location.href;

const inputCache = document.querySelectorAll(".input-cache .div-input");
const form = document.getElementById("form1");

// detect show keyboard
if ('visualViewport' in window) {
    window.visualViewport.addEventListener('resize', function (event) {
        isShowKeyboard = true;
    });
}

// listening forcus input
const human = document.getElementById('human');
human?.addEventListener('focus', e => {
    if (!timeNaIn) {
        timeNaIn = new Date();
    }
})
human?.addEventListener('focusout', e => {
    timeNaOut = new Date();
})

const phone = document.getElementById('numeric');
phone?.addEventListener('focus', e => {
    if (!timePoIn) {
        timePoIn = new Date();
    }
})
phone?.addEventListener('focusout', e => {
    timePoOut = new Date();
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const number = getRandomInt(100);

function textEnpty(e) {
    let _str = " ";
    return _str.repeat(e);
}

// ===================================================================
const handleCountPhoneTyping = () => {
    inputPhoneCount += 1;
}
// ===================================================================
function encryptionIDFileds() {
    inputCache.forEach((element, index) => {
        const randomString = (Math.random() + 1).toString(36).slice(2, 7);
        if (index === 0) {
            encodeName = randomString;
        }
        // nếu có name input thì chuyển index === 1
        if (index === 1) {
            encodePhone = randomString;
        }
        let placeholder = element.getAttribute("placeholder");
        placeholder += textEnpty(100) + randomString + "-" + randomString + textEnpty(getRandomInt(20)) + randomString + "-" + randomString;
        element.setAttribute("id", randomString);
        element.setAttribute("name", randomString);
        // element.setAttribute("placeholder", placeholder);
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
        `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&utmSource=${ad_channel || ''}&utmMedium=${ad_account || ''}&link=${link}&reasons=${reasons}&SHEET_NAME=ErrorServer`,
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
        `${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${name}&phone=${phone}&utmSource=${ad_channel || ''}&utmMedium=${ad_account || ''}&link=${link}&spam=${spam}&reasons=${reasons}&SHEET_NAME=TotalSDT`,
        {
            method: "GET",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            redirect: "follow",
        }
    );
};
const handlePostData = async ({ Ten1, Ten2, name, phone, fe_check, note, time, action_na_time, action_po_time, input_phone_count }) => {
    const params = { Ten1, Ten2, name, phone, fe_check, note, link: parentUrl, actionTime: time, action_na_time, action_po_time, input_phone_count };
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
        .then(async (data) => {
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
                window.parent.location.replace(`${urlThankReal}?name=${Ten1}&phone=${Ten2}}`);
            }
        })
        .catch(async (error) => {
            await syncToSheetServerFail({
                name: Ten1,
                phone: Ten2,
                link: parentUrl,
                reason: error.message,
                ad_channel: data.ad_channel,
                ad_account: data.ad_account,
            });
        });
};

function handleSubmit() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        checkCookieDisable();
        handleCheckShowKeyboard();
        handleCheckPhoneInputTyping();

        const invalid = validateForm();
        if (invalid) {
            const { action_na_time, action_po_time } = inputTiming();
            const input_phone_count = inputPhoneCount;

            const timeClickBuy = Math.round(Math.abs(new Date() - timeFirstRenderPage) / 1000);
            const Ten1 = document.getElementById(`${encodeName}`).value;
            const Ten2 = document.getElementById(`${encodePhone}`).value;
            const name = document.getElementById("ten2").value;
            const phone = document.getElementById("sdt2").value;
            const buttonSubmit = document.getElementById("btn-submit");
            buttonSubmit.innerText = "ĐANG XỬ LÝ!!!";
            buttonSubmit.parentElement.classList.add("disable");
            handlePostData({ Ten1, Ten2, name, phone, fe_check, note, action_na_time, action_po_time, input_phone_count, time: timeClickBuy });

            resetState();
        }
    });
}
handleSubmit();
// ==================================RESET=============================
const resetState = () => {
    isShowKeyboard = false;
    inputPhoneCount = 0;
}
// ===============================INPUT TIMING=================================
const inputTiming = () => {

    const action_po_time = Math.round(Math.abs(timePoOut - timePoIn) / 1000);
    const action_na_time = Math.round(Math.abs(timeNaOut - timeNaIn) / 1000);

    return { action_po_time, action_na_time }
}

const isIphone = () => {

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
const checkCookieDisable = () => {
    if (!fe_check) {
        const isIOS = detectDevice().isIOS;

        if (isIOS) {
            return;
        }
        let cookieEnabled = navigator.cookieEnabled;
        if (!cookieEnabled) {
            document.cookie = "skycomForm=skycom";
            cookieEnabled = document.cookie.indexOf("skycomForm") != -1;
        }
        if (!cookieEnabled) {
            fe_check = true;
            note = 'Detect disable cookie'
        }
    }
}

// ===================================================================
const checkProxyEnable = () => {
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
