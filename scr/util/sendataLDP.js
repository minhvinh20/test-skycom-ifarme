//config
var Is_Scroll = false;
var diff = 0;
var Is_device_motion_change = null;
var Count_device_motion = 0;
var device_motion_compare = 0;
let frames = []; 

function appendIframe () {
    const wappers = document.querySelectorAll(".skycom-wrapper");
    wappers.forEach(function(wrapper) {
        if(!wrapper) {
            return;   
        }
        const iframe = document.createElement("iframe");
            iframe.src = `https://testform.skycom.vn/test`
            iframe.classList.add("skycom-iframe");

        wrapper.insertBefore( iframe, wrapper.children[0] );
    })
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
    console.log('scroll')
    if (Is_Scroll) {
        return;    
    } 
    Is_Scroll = true;
    // frames.forEach((frame) => {
    //     sendMessage(frame)
    // })
}
window.addEventListener("scroll",debounce(checkScroll, 1000));

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
        Is_device_motion_change: Is_device_motion_change,
        Count_device_motion: Count_device_motion
    });
    frame.contentWindow.postMessage({
        call: "skylink_event",
        value: message
    }, 'https://testform.skycom.vn/'); 
}

appendIframe();
listenFirame();
checkDeviceEmotion();

