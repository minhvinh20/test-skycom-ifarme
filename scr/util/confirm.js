import { apis } from "../config/apis.js";

let element = {
    form: null,
    input: null,
}
let lead_id = window.location.href.split("=")[1] || null;

document.addEventListener("DOMContentLoaded", function () {
    //query element
    mountForm();
    //submit
    element.form.addEventListener('submit', e => {
        let phone = element.input?.value;
        handleconfirmPhone(lead_id,phone)
    })
})
const mountForm = () => {
    element.form = document.querySelector("form");
    element.input = document.querySelector("form input");
};
const handleconfirmPhone = async () =>{
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
    .then((data) => {
        if(data.passed) {
            window.parent.location.replace(`${apis.habt.urlThankReal}?name=${data.name}&phone=${data.phone}`);
        }else{
            window.parent.location.replace(`${apis.habt.urlThankFake}?name=${data.name}&phone=${data.phone}`);
        }
       console.log('data', data)
    })
}