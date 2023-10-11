const urlVisitor = "https://dev.fingerprint.skycom.vn/api/v1/visits/";
const Params = {
    url: window.location.href,
    components: {},
    organization_id: "651e3ea7529673278d5ec848",
    browser_vid: null,
    is_bot: false,
};

// -----------------------------------------------------------------------

 const getComponentsFingerVisitorId = ()  => {
    let fingerPromise = FingerprintJS.load();
    fingerPromise.then( (fp) =>  fp.get())
    .then(function (result) {
        Params.components = result.components;
    })
    .then((response) => {
        detectBot();
    })
    .then((response) => {
        handlePostData();
    })
}
const detectBot = () => {
    let botDetectPromise = import( "https://testform.skycom.vn/util/fingerdetectbot.min.js").then( (Botd) =>  Botd.load());
    botDetectPromise.then((botd) =>  botd.detect())
    .then((result)  => {
        Params.is_bot = result.bot;
    });
}

const handlePostData = () =>{
    let result = fetch(urlVisitor, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Params),
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (response){
        let data = response.data;
        //document.cookie = `browser_vid=${data.visitor_id}`;
        localStorage.setItem("browser_vid", data.visitor_id);
        localforage.setItem('browser_vid', data.visitor_id);
        return data;
    })
    .then(function (data) {
        document.getElementById("visitor_id").innerHTML = `visitor_id: ${data.visitor_id}`;
        document.getElementById("visitor_confidence").innerHTML = `visitor_confidence: ${data.visitor_confidence * 100}%`;
        document.getElementById("is_bot").innerHTML = `is_bot: ${data.is_bot}`;
        document.getElementById("bot_confidence").innerHTML = `bot_confidence: ${data.bot_confidence * 100}%`;
    })
    .catch((value) => {
        console.log("Error");
    });
}

const browserVisitorid = () =>  {
    localforage.getItem('browser_vid').then((value) => {
        if (value) {
            //neu co trong indexDB 
            Params.browser_vid = value;
        }
        else if(localStorage.getItem("browser_vid")){
            //neu co trong localstorage
            Params.browser_vid = localStorage.getItem("browser_vid")
        }
        else{
            // //neu co trong cookie
            // const regex = new RegExp(`(^| )browser_vid=([^;]+)`)
            // const match = document.cookie.match(regex)
            // if (match) {
            //     Params.browser_vid =  match[2]
            // }
        }
    })
}

browserVisitorid();
getComponentsFingerVisitorId();