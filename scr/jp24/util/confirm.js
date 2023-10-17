import { apis } from "../../config/apis.js";


let element = {
    form: null,
    input: null,
}
let lead_id = window.location.href.split("=")[1] || null;

document.addEventListener("DOMContentLoaded", function () {
    //query element
    mountForm();
    //disable copy
    element.input?.onpaste = (e) => e.preventDefault();
    //submit
    element.form.addEventListener('submit', e => {
        e.preventDefault();
        let phone = element.input?.value;
        handleconfirmPhone({lead_id,phone})
    })
})
const mountForm = () => {
    element.form = document.querySelector("form");
    element.input = document.querySelector("form input");
};
const handleconfirmPhone = async ({lead_id, phone}) =>{
    if(!lead_id) return;
    const params = {lead_id,phone }
    await fetch(apis.confirm, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
    .then(function (response) {
        return response.json();
    })
    .then(async (data) => {
        await syncToSheetConfirm({
            name:  data.name,
            phone: data.phone,
            passed: data.passed,
        });

        if( data.passed) {
            window.parent.location.replace(`${apis.jp24.urlThankReal}?name=${data.name}&phone=${data.phone}`);
        }else{
            window.parent.location.replace(`${apis.jp24.urlThankFake}?name=${data.name}&phone=${phone}`);
        }
    })
    .catch(async (value) => {
       console.log('error', error)
    })
}
const syncToSheetConfirm = async ({ name, phone, passed }) => {    

    await fetch(`${apis.jp24.urlSyncGoogleSheetSpam}?time=${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}&name=${name}&phone=${phone}&passed=${passed}&SHEET_NAME=ConfirmPass`,
      {
        method: "GET",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      }
    );
}

