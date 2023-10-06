//config
var Is_Scroll = false;
var Count_scroll = 0;
var diff = 0;
var Is_device_motion_change = null;
var Count_device_motion = 0;
var device_motion_compare = 0;
let frames = []; 



function appendIframeVertical () {
    const wrapperFormVerticals = document.querySelectorAll(".skycom-wrapper");
    if (wrapperFormVerticals.length > 0) {
        wrapperFormVerticals.forEach(function(wrapper) {
            if(!wrapper) {
                return;   
            }
            const iframe = document.createElement("iframe");
                iframe.src = "https://form.skycom.vn/v5keyboard";
                iframe.classList.add("skycom-iframe");
    
            wrapper.insertBefore( iframe, wrapper.children[0] );
        })
    }
}
function appendIframeHorizontal () {
    const wrapperFormHorizontals = document.querySelectorAll(".skycom-wrapper--horizontal");
    if (wrapperFormHorizontals.length > 0) {
        wrapperFormHorizontals.forEach(function(wrapper) {
            if(!wrapper) {
                return;   
            }
            const iframe = document.createElement("iframe");
                iframe.src = "https://form.skycom.vn/v5-horizontal"
                iframe.classList.add("skycom-iframe");
            wrapper.insertBefore( iframe, wrapper.children[0] );
        })
    }
}

// device motion
function checkDeviceEmotion() {
    // Kiểm tra xem trình duyệt hỗ trợ API DeviceMotion và API DeviceOrientation hay không
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function(event) {
            diff = event.acceleration.x || event.accelerationIncludingGravity.x;
            handleDeviceMotionStatus();
        }); 
            
        setInterval(()=>{
            if (diff != device_motion_compare) {
                Count_device_motion++;
                device_motion_compare = diff;
            }
        },1000);
    }
}
function handleDeviceMotionStatus() {
    if (Count_device_motion > 5) {
        Is_device_motion_change = true 
    }
    else{
        Is_device_motion_change = false
    }
}

//check user scroll 

function debounce (fn, delay) {
    return args => {
        clearTimeout(fn.id)
        fn.id = setTimeout(() => {
            fn.call(this, args)
        }, delay)
    }
}
function checkScroll(){
    Count_scroll++;
    if (!Is_Scroll &&  Count_scroll > 2) { 
        Is_Scroll = true;
    } 
    frames.forEach((frame) => {
        sendMessage(frame)
    })
}
window.addEventListener("scroll",debounce(checkScroll, 500));

//gui data vao iframe
function listenFirame() {
    const frameEles = document.querySelectorAll('.skycom-iframe');
    frameEles.forEach(function(frame) {
        frames.push(frame);
        frame.addEventListener("load", function(){
            sendMessage(frame);
        })
    })
}
function sendMessage (frame){
    const message = JSON.stringify({
        message: 'send data',
        src: window.location.href,
        Is_Scroll : Is_Scroll,
        Count_scroll: Count_scroll,
        Is_device_motion_change: Is_device_motion_change,
        Count_device_motion: Count_device_motion
    });
    frame.contentWindow.postMessage({
        call: "skylink_event",
        value: message
    }, 'https://form.skycom.vn/'); 

}

appendIframeVertical();
appendIframeHorizontal();
listenFirame();
checkDeviceEmotion();

