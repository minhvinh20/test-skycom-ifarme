var bareURL="https://backendsyncdata.skycom.vn/api/spam_check/form-spam-check",urlThankReal="https://hoaianbeauty.com/pages/cam-on-quy-khach",urlThankFake="https://hoaianbeauty.com/pages/camon-quy-khach",urlSyncGoogleSheetSpam="https://script.google.com/macros/s/AKfycbzGbJQ83uGDjEGC5x8yqbIjKr0ATrzk6gNYcIxAI958cHpSfc-r6KHnylZNK7fxCpFgaQ/exec",URLFingerID="https://fpjscdn.net/v3/7aRN8UmVm1n7Qsda0mOm",timeFirstRenderPage=new Date,regexPhone=/^(0|\+84)(9[0-9]|3[2-9]|7[06-9]|5[6-9]|8[1-9]|2[0-9])\d{7}$/,parentUrl=window.location.href.indexOf("split=")>-1?window.location.href.split("split=")[1]:window.location.href,forms=document.querySelectorAll(".form-submit--skycom form"),overlay=document.getElementById("overlay"),encodeName="",encodePhone="",Count_na_keyboard=0,Count_na_delete_keyboard=[],Is_open_na_keyboard=null,Action_na_time=0,Count_po_keyboard=0,Action_po_time=0,Action_po_to_submit=0,Is_open_po_keyboard=null,Count_po_delete_keyboard=[],Action_time=0,Action_form_time=0,Skl_Visitor=0,visitorId=0,adsClickId="",third_id=0,Count_3rd_id=1,change_3rd_id=!1,Typing_count_keyboard=0;function detectDevice(){var e=!1,t=!1,n=!1;return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&(t=!0,/iPhone|iPad|iPod/i.test(navigator.userAgent)?e=!0:n=!0),{isIOS:e,isMobile:t,isAndroid:n}}function listenerKeyboardOpen(){return window.innerWidth<768&&window.screen.height-280>window.visualViewport.height}function getRandomInt(e){return Math.floor(Math.random()*e)}function textEnpty(e){return" ".repeat(e)}function encryptionIDFileds(){forms.forEach((function(e,t){e.querySelectorAll(".input-cache input").forEach(((e,t)=>{const n=`i${(Math.random()+1).toString(36).slice(2,7)}`;0===t&&(encodeName=n),1===t&&(encodePhone=n);var o=e.getAttribute("placeholder");o+=textEnpty(100)+n+"-"+n+textEnpty(getRandomInt(20))+n+"-"+n,e.setAttribute("id",n),e.setAttribute("name",n),e.setAttribute("placeholder",o)}))}))}function disableEnterSubmit(){document.addEventListener("keydown",(e=>{13!==e.keyCode&&9!=e.keyCode||e.preventDefault()}))}function disableCopy(){forms.forEach((function(e){var t=e.querySelector(".human"),n=e.querySelector(".numeric");t.onpaste=function(e){e.preventDefault()},n.onpaste=function(e){e.preventDefault()}}))}function checkTouchSupport(){forms.forEach((function(e){var t=e.querySelector(".human"),n=e.querySelector(".numeric"),o=e.querySelector(".form-submit button");window.addEventListener("touchstart",(function(e){if(t.parentElement.contains(e.target)||n.parentElement.contains(e.target)||o.contains(e.target))for(let t=0;t<e.touches.length;t++){const n=e.touches[t].screenX.toFixed(2),o=e.touches[t].screenY.toFixed(2);Touch_pixel.push(`${n}_${o}`)}}))}))}function detectAdsId(){var e=parentUrl.split("&");if(e){var t=e.find((function(e){e.indexOf("utm_source")}));t&&(t.indexOf("facebook")>-1&&(adsClickId=e.find((function(e){e.indexOf("fbclid")}))),(t.indexOf("youtube")>-1||t.indexOf("google")>-1)&&(adsClickId=e.find((function(e){e.indexOf("gclid")}))),t.indexOf("tiktok")>-1&&(adsClickId=e.find((function(e){e.indexOf("ttclid")}))),third_id=adsClickId.split("=")[1])}}function countViewPage(){var e="3rd_id",t="Count_3rd_id";third_id&&!localStorage.getItem(e)&&localStorage.setItem(e,third_id),third_id&&(localStorage.getItem(e)!=third_id?change_3rd_id=!0:localStorage.getItem(t)?localStorage.setItem(t,Number(localStorage.getItem(t))+1):localStorage.setItem(t,Count_3rd_id))}function listenPhoneValidate(){forms.forEach((function(e){e.querySelector(".numeric").addEventListener("input",(function(e){regexPhone.test(e.target.value)&&syncToSheetValidate({phone:e.target.value,link:parentUrl})}))}))}function handleCountNameTyping(){forms.forEach((function(e){var t=0,n=0,o=e.querySelector(".human");o.addEventListener("input",(function(e){Count_na_keyboard++})),o.addEventListener("keydown",(function(e){8===e.keyCode&&(t++,Count_na_delete_keyboard.push(`${t}-${n}`),n=1)})),o.addEventListener("mouseup",(function(e){0==(n=e.target.selectionEnd-e.target.selectionStart)&&(n=1)}))}))}function handleCountPhoneTyping(){forms.forEach((function(e){var t=0,n=0,o=e.querySelector(".numeric");o.addEventListener("input",(function(e){Count_po_keyboard+=1})),o.addEventListener("keydown",(function(e){8===e.keyCode&&(t++,Count_po_delete_keyboard.push(`${t}-${n}`),n=1)})),o.addEventListener("mouseup",(function(e){0==(n=e.target.selectionEnd-e.target.selectionStart)&&(n=1)}))}))}Sceensize="",Touch_pixel=[],Is_device_motion_change=null,encryptionIDFileds(),disableEnterSubmit(),disableCopy(),checkTouchSupport(),detectAdsId(),countViewPage(),listenPhoneValidate(),handleCountNameTyping(),handleCountPhoneTyping();var timeNaIn=0,timePoIn=0,timeNaOut=0,timePoOut=0,timeAdIn=0,timeAdOut=0;function setTimer(){forms.forEach((function(e){var t=e.querySelector(".human"),n=e.querySelector(".numeric");t.addEventListener("click",(function(e){timeNaIn||(timeNaIn=new Date),window.visualViewport.addEventListener("resize",(function(){Is_open_na_keyboard=listenerKeyboardOpen()}))})),t.addEventListener("focusout",(function(e){timeNaOut=new Date})),n.addEventListener("click",(function(e){timePoIn||(timePoIn=new Date),window.visualViewport.addEventListener("resize",(function(){Is_open_po_keyboard=listenerKeyboardOpen()}))})),n.addEventListener("focusout",(function(e){timePoOut=new Date}))}))}function inputTiming(){var e=Math.abs(timeNaOut-timeNaIn)/1e3;return{Action_po_time:Math.abs(timePoOut-timePoIn)/1e3,Action_na_time:e,Action_po_to_submit:Math.abs((+new Date-+timePoOut)/1e3),Action_time:Math.abs(new Date-timeFirstRenderPage)/1e3,Action_form_time:timeNaIn<timePoIn?Math.abs(new Date-timeNaIn)/1e3:Math.abs(new Date-timePoIn)/1e3}}async function syncToSheetValidate({phone:e,link:t}){t=t.indexOf("&")>-1?t.replaceAll("&","_SKYCOM_"):t,await fetch(`${urlSyncGoogleSheetSpam}?phone=${e}&link=${t}&SHEET_NAME=SDTValidate`,{method:"GET",mode:"no-cors",headers:{"Content-Type":"application/json"},redirect:"follow"})}async function syncToSheetServerFail({name:e,phone:t,ad_channel:n,ad_account:o,link:i,reasons:a}){i=i.indexOf("&")>-1?i.replaceAll("&","_SKYCOM_"):i,await fetch(`${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${e}&phone=${t}&utmSource=${n||""}&utmMedium=${o||""}&link=${i}&reasons=${a}&SHEET_NAME=ErrorServer`,{method:"GET",mode:"no-cors",headers:{"Content-Type":"application/json"},redirect:"follow"})}async function syncToSheetDataSubmit({name:e,phone:t,ad_channel:n,ad_account:o,link:i,spam:a,reasons:r}){i=i.indexOf("&")>-1?i.replaceAll("&","_SKYCOM_"):i,await fetch(`${urlSyncGoogleSheetSpam}?time=${timeFirstRenderPage.toLocaleDateString()}-${timeFirstRenderPage.toLocaleTimeString()}&name=${e}&phone=${t}&utmSource=${n||""}&utmMedium=${o||""}&link=${i}&spam=${a}&reasons=${r}&SHEET_NAME=TotalSDT`,{method:"GET",mode:"no-cors",headers:{"Content-Type":"application/json"},redirect:"follow"})}async function handlePostData({Ten1:e,Ten2:t,name:n,phone:o,Count_na_keyboard:i,Action_na_time:a,Is_open_na_keyboard:r,Count_na_delete_keyboard:c,Count_po_keyboard:d,Action_po_time:u,Action_po_to_submit:s,Is_open_po_keyboard:l,Count_po_delete_keyboard:_,Action_time:m,Action_form_time:p,Sceensize:h,Touch_pixel:f,Is_device_motion_change:y,Count_3rd_id:g,Skl_Visitor:b,visitorId:S,Typing_count_keyboard:k,Is_mobile:v}){var I={Ten1:e,Ten2:t,name:n,phone:o,link:parentUrl,Count_na_keyboard:i,Action_na_time:a,Is_open_na_keyboard:r,Count_na_delete_keyboard:c,Count_po_keyboard:d,Action_po_time:u,Action_po_to_submit:s,Is_open_po_keyboard:l,Count_po_delete_keyboard:_,Action_time:m,Action_form_time:p,Sceensize:h,Touch_pixel:f,Is_device_motion_change:y,Count_3rd_id:g,Skl_Visitor:b,visitorId:S,Typing_count_keyboard:k,Is_mobile:v};await fetch(bareURL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(I)}).then((function(e){return e.json()})).then((async function(n){await syncToSheetDataSubmit({name:e,phone:t,link:parentUrl,spam:n.spam,reasons:n.reasons,ad_channel:n.ad_channel,ad_account:n.ad_account}),n.spam?window.parent.location.replace(urlThankFake):window.parent.location.replace(`${urlThankReal}?name=${e}&phone=${t}`)})).catch((async function(n){await syncToSheetServerFail({name:e,phone:t,link:parentUrl,reason:n.message,ad_channel:data.ad_channel,ad_account:data.ad_account})}))}function validateForm(e,t){var n=t.value,o=!0;return regexPhone.test(n)||(e.querySelector(".errorMessage").innerText="Vui lòng nhập đúng định dạng số điện thoại",o=!1),o}function handleSubmit(){forms.forEach((function(e){e.addEventListener("submit",(function(t){t.preventDefault();var n=e.querySelector(".human"),o=e.querySelector(".numeric");if(validateForm(e,o)){var{Action_na_time:i,Action_po_time:a,Action_po_to_submit:r,Action_time:c,Action_form_time:d}=inputTiming(),u=n.value,s=o.value,l=document.getElementById("ten2").value,_=document.getElementById("sdt2").value,m=detectDevice().isMobile;Sceensize=`${window.screen.width} x ${window.screen.height}`,Count_3rd_id=localStorage.getItem("Count_3rd_id");var p=e.querySelector(".form-submit button");p.innerText="ĐANG XỬ LÝ!!!",p.parentElement.classList.add("disable"),overlay.classList.add("active"),handlePostData({Ten1:u,Ten2:s,name:l,phone:_,Count_na_keyboard:Count_na_keyboard,Action_na_time:i,Is_open_na_keyboard:Is_open_na_keyboard,Count_na_delete_keyboard:Count_na_delete_keyboard,Count_po_keyboard:Count_po_keyboard,Action_po_time:a,Action_po_to_submit:r,Is_open_po_keyboard:Is_open_po_keyboard,Count_po_delete_keyboard:Count_po_delete_keyboard,Action_time:c,Action_form_time:d,Sceensize:Sceensize,Touch_pixel:Touch_pixel,Is_device_motion_change:Is_device_motion_change,Count_3rd_id:Count_3rd_id,Skl_Visitor:Skl_Visitor,visitorId:visitorId,Typing_count_keyboard:Typing_count_keyboard,Is_mobile:m})}}))}))}function vitualKeyboard(){var e,t,n=document.querySelector("#skycomkeyboard"),{isMobile:o,isAndroid:i}=detectDevice();if(o){i&&n.classList.add("keyboard-android");var a=new(0,window.SimpleKeyboard.default)({onChange:e=>function(e){t.value=e,e.length>12?t.closest("form").querySelector(".errorMessage").innerText="Số điện thoại quá dài":t.closest("form").querySelector(".errorMessage").innerText=""}(e),onKeyPress:e=>{Typing_count_keyboard++},layout:{default:["1 2 3","4 5 6","7 8 9"," 0 {bksp}"]},display:{"":"+&#8727;#","{bksp}":"⌫",2:"2<figure>A B C</figure>",3:"3<figure>D E F</figure>",4:"4<figure>G H I</figure>",5:"5<figure>J K L</figure>",6:"6<figure>M N O</figure>",7:"7<figure>P Q R S</figure>",8:"8<figure>T U V</figure>",9:"9<figure>W X Y Z</figure>"},theme:"hg-theme-default hg-layout-numeric numeric-theme",disableButtonHold:!1,maxLength:13}),r=document.querySelector(".keyboard-bar #button-done");forms.forEach((function(e){var t=e.querySelector(".numeric");t.addEventListener("focus",c),t.addEventListener("input",d),t.setAttribute("readonly","readonly"),t.blur()})),window.addEventListener("click",(function(e){t&&(r.contains(e.target)?(n.classList.remove("active"),document.querySelectorAll(".human").forEach((function(e){e.style.opacity="1"}))):t.contains(e.target)||n.contains(e.target)?(n.classList.add("active"),document.querySelectorAll(".human").forEach((function(e){e.style.opacity="1"})),t.closest("form").querySelector(".human").style.opacity="0.3",document.querySelector("body .ladi-wraper")&&(n.style.width=`${document.querySelector("body .ladi-wraper").offsetWidth}px`)):(n.classList.remove("active"),document.querySelectorAll(".human").forEach((function(e){e.style.opacity="1"}))))}))}function c(n){e=`#${n.target.id}`,t=document.querySelector(e),a.setOptions({inputName:n.target.id})}function d(e){a.setInput(e.target.value,e.target.id)}}setTimer(),handleSubmit(),vitualKeyboard();