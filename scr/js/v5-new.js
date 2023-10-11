let general = {
  nameEle: null,
  phoneEle: null,
  formEle: null,
  overlay: null,
  butonSubmit: null,
  parentUrl:
    window.location.href.indexOf("split=") > -1
      ? window.location.href.split("split=")[1]
      : window.location.href,
  isKeyboardOpen: 0,
  Ads_click_id: false,
};

let params = {
  Ten1: "",
  Ten2: "",
  name: "",
  phone: "",
  link: general.parentUrl,

  Count_na_keyboard: 0,
  Count_na_delete_keyboard: 0,
  Count_po_keyboard: 0,
  Count_po_delete_keyboard: 0,

  Is_open_na_keyboard: null,
  Is_open_po_keyboard: null,

  Action_time: 0,
  Action_na_time: 0,
  Action_po_time: 0,
  Action_po_to_submit: 0,
  Action_form_time: 0,

  Sceensize: "",
  Touch_pixel: [] || null,
  Is_device_motion_change: null,
  Count_device_motion: 0,
  Is_Scroll: null,
  Count_scroll: 0,

  Count_3rd_id: 1,
  Change_3rd_id: false,
  Skl_vistorID: null,

  Fe_check: false,
  Fe_note: "",
};

document.addEventListener("DOMContentLoaded", function () {
  //query element
  mountForm();

  //disable copy
  disableCopy();

  //disable enter submit
  disableEnterSubmit();

  //thêm id từ random string(5 ký tự bất kì)
  randomStringID();

  //get Touch_pixel
  window.addEventListener("touchstart", function (event) {
    getTouchPixel(event);
  });

  //count viewpage
  countViewPageByAdsClickID();
});
// ===================================================================
const mountForm = () => {
  general.nameEle = document.querySelector(".human");
  general.phoneEle = document.querySelector(".numeric");
  general.formEle = document.querySelector(".form-submit--skycom form");
  general.overlay = document.getElementById("overlay");
  general.butonSubmit = document.getElementById("btn-submit");
};
// ===================================================================
const disableCopy = () => {
  general.nameEle.onpaste = (e) => e.preventDefault();
  general.phoneEle.onpaste = (e) => e.preventDefault();
};
// ===================================================================
const disableEnterSubmit = () => {
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 || e.keyCode == 9) {
      e.preventDefault();
      return;
    }
  });
};
// ===================================================================
const randomStringID = () => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function textEnpty(e) {
    let _str = " ";
    return _str.repeat(e);
  }

  document.querySelectorAll(".input-cache input").forEach((element, index) => {
    const randomString = (Math.random() + 1).toString(36).slice(2, 7);
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
};
// ===================================================================
const getTouchPixel = (event) => {
  for (let i = 0; i < event.touches.length; i++) {
    const positionX = event.touches[i].screenX.toFixed(2);
    const positionY = event.touches[i].screenY.toFixed(2);
    params.Touch_pixel.push(`${positionX}_${positionY}`);
  }
};
// ===================================================================
const getID = (id) => {
  const urlParams = general.parentUrl.split("&");
  return (
    urlParams.find((param) => param.indexOf(id) > -1)?.split("=")[1] || false
  );
};
const countViewPageByAdsClickID = () => {
  //lấy giá trị ads click id
  general.Ads_click_id = getID("fbclid") || getID("gclid") || getID("ttclid");

  let count3rdID = localStorage.getItem("Count_3rd_id");
  let third_id_local = localStorage.getItem("3rd_id");

  if (!general.Ads_click_id) {
    return;
  }
  //gán giá trị ads click id vào localstorage
  if (!third_id_local) {
    localStorage.setItem("3rd_id", general.Ads_click_id);
  }
  if (!count3rdID) {
    localStorage.setItem("Count_3rd_id", params.Count_3rd_id);
  }
  //check ads click id thay đổi
  if (third_id_local != general.Ads_click_id) {
    params.Change_3rd_id = true;
  } else {
    //đếm số lượng load page
    localStorage.setItem("Count_3rd_id", Number(count3rdID) + 1);
  }
};
// ===================================================================
const CountDelete = (prev, cur, countDelete) => {
  countDelete++;
  Count_na_delete_keyboard.push(`${countDeleteName}-${countSelectionName}`);
  countSelectionName = 1;
};

const calcSecondBetweenTwoTimes = (pastTime, currentTime) => {
  if (pastTime === null || currentTime === null) {
    return null;
  }
  var timeDiffSeconds = Math.ceil(
    (currentTime.getTime() - pastTime.getTime()) / 1000
  );
  return timeDiffSeconds;
};
