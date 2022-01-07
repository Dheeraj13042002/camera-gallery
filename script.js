const video = document.querySelector("video");
const recordBtnCont = document.querySelector(".record-btn-cont");
const recordBtn = document.querySelector(".record-btn");
const captureBtnCont = document.querySelector(".capture-btn-cont");
const captureBtn = document.querySelector(".capture-btn");

const filterCont = document.querySelector(".filter-cont");


let recorder;
let recordFlag = false;

let transparentColor = "transparent";

let chunks = [];

let constraints = {
    video : true,
    audio : true
}

// navigator -> provides browser info
// mediaDevices -> interface that gives the access to hardware devices., ex. camera
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream; //streams comes out in small chunks.

    recorder = new MediaRecorder(stream);
    image = stream.getVideoTracks()[0];

    recorder.addEventListener("start",(e)=>{
        chunks = [];
    });
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    });
    recorder.addEventListener("stop",(e)=>{
        let blob = new Blob(chunks, { type: "video/mp4" });
        // let  videoURL = URL.createObjectURL(blob);

        if(db){
            let videoId = shortid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoId}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }


        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "stream.mp4";
        // a.click();
    });
});


recordBtnCont.addEventListener("click",(e)=>{
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag){
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
});



captureBtnCont.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    let tool = canvas.getContext('2d');
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    // filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL = canvas.toDataURL();

    if(db){
        let imageId = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }


    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500);

    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();
});




let timerId;
let counter = 0; // Represents the total second.
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function calcTime(){
        let timeInSeconds = counter;
        
        let hours = Number.parseInt(timeInSeconds/3600);
        timeInSeconds = timeInSeconds%3600;
        let minutes = Number.parseInt(timeInSeconds/60);
        timeInSeconds = timeInSeconds%60;
        let seconds = timeInSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`

        counter++;
    }
    timerId = setInterval(calcTime,1000);
}


function stopTimer(){
    timer.style.display = "none";
    clearInterval(timerId);
    timer.innerText = "00:00:00";
}


const filterColor = document.querySelectorAll(".filter");
const filterLayer = document.querySelector(".filter-layer");
filterColor.forEach( (ithColor) => {
    ithColor.addEventListener("click",(e)=>{
        transparentColor = window.getComputedStyle(ithColor , null).getPropertyValue("background-color");
        filterLayer.style.background = transparentColor;
    });
});