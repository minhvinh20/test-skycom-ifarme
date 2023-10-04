//config
var diff = 0;
var Is_device_motion_change = "test";
var Count_device_motion = 0;
let device_motion_compare = 0;

function appendIframe () {
    const wappers = document.querySelector(".skycom-wrapper");
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
            document.getElementById("demo").innerHTML = Is_device_motion_change;
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
checkDeviceEmotion();

function sendMessage (){
    const frameEles = document.querySelectorAll('.skycom-iframe');
    frameEles.forEach(function(frame) {
        frame.addEventListener("load", function(){
            const message = JSON.stringify({
                message: 'Hello from window',
                src: window.location.href,
                Is_device_motion_change: Is_device_motion_change,
                Count_device_motion: Count_device_motion
            });
            frame.contentWindow.postMessage({
                call: "skylink_event",
                value: message
            }, 'https://testform.skycom.vn/'); 
            console.log(frame.contentWindow.document);
        })
    })
}
sendMessage();
