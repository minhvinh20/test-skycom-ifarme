const urlVisitor = "https://dev.fingerprint.skycom.vn/api/v1/visits/";
const Params = {
    url: window.location.href,
    components: {},
    organization_id: "651e3ea7529673278d5ec848",
    browser_vid: null,
    is_bot: false,
};


let db = null;

const initIndexDB = (browser_vid) => {
    //open indexDB
    var openRequest = window.indexedDB.open('myDatabase', 1);
    //khởi tạo db ban đầu nếu chưa có DB 
    openRequest.onupgradeneeded = function (e) {
        db = e.target.result;
        const storeOS = db.createObjectStore('myDatabaseStore',  {keyPath: "name"});
                    
    };
    //khởi tạo thành công thì add giá trị vào db
    openRequest.onsuccess = function (e) {
        db = e.target.result;
        const transaction = db.transaction("myDatabaseStore", "readwrite");
        const store = transaction.objectStore('myDatabaseStore');

        //set value
        store.add({
            name: 'browser_vid',
            value: browser_vid
        })

    };
    //Error
    openRequest.onerror = function (e) {
        console.log('onerror! doesnt work');
    };
}

// -----------------------------------------------------------------------

 const getComponentsFingerVisitorId = ()  => {
    let fingerPromise = FingerprintJS.load();
    fingerPromise.then( (fp) =>  fp.get())
    .then(function (result) {
        console.log('result')
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
    botDetectPromise.then( (botd) =>  botd.detect())
    .then((result)  => {
        console.log('bot')
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
        document.cookie = `browser_vid=${data.visitor_id}`;
        localStorage.setItem("browser_vid", data.visitor_id);
        initIndexDB(data.visitor_id);
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
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    if (indexedDB){
        window.indexedDB.open('myDatabase', 1).onsuccess = function (e) {
            db = e.target.result;
            db.transaction("myDatabaseStore").objectStore('myDatabaseStore').get('browser_vid').onsuccess = function(event) {
              Params.browser_vid = event.target.result.value
              console.log("Your value is fds:" + event.target.result.value);
            };
        };
    }
    else if(localStorage.getItem("browser_vid")) {
        Params.browser_vid = localStorage.getItem("browser_vid");
    }else{
        
    }
}


browserVisitorid();
getComponentsFingerVisitorId();