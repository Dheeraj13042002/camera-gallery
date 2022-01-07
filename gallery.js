// DB Retrieval 

setTimeout(()=>{
    if(db){

        // video retrieval
        let videoDbTransaction = db.transaction("video", "readonly");
        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest =  videoStore.getAll();
    
        videoRequest.onsuccess = (e) =>{
            let gallery = document.querySelector(".gallery-cont");
            let videoResult = videoRequest.result;
            videoResult.forEach((videoObj) => {
                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id",videoObj.id);
    
                let url = URL.createObjectURL(videoObj.blobData);
    
                mediaEle.innerHTML = `
                <div class="media">
                    <video autoplay auto src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `
                gallery.appendChild(mediaEle);


                let deleteBtn = mediaEle.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);

                let downloadBtn = mediaEle.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);

            });
        }


        // image retrieval
        let imageDbTransaction = db.transaction("image", "readonly");
        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
    
        imageRequest.onsuccess = (e) =>{
            let gallery = document.querySelector(".gallery-cont");
            let imageResult = imageRequest.result;
            imageResult.forEach((imageObj) => {
                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id",imageObj.id);
    
                let url = imageObj.url;
    
                mediaEle.innerHTML = `
                <div class="media">
                    <img src="${url}"></img>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `
                gallery.appendChild(mediaEle);

                let deleteBtn = mediaEle.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);

                let downloadBtn = mediaEle.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);
            });
        }


    }
},100);



function deleteListener(e){
    // DB Removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "img"){
        let imageDbTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        imageStore.delete(id);
    }
    else{
        let videoDbTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        videoStore.delete(id);
    }

    // UI Removal
    e.target.parentElement.remove();
}



function downloadListener(e){
    
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    console.log(type);
    if(type === "img"){
        let imageDbTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);

        imageRequest.onsuccess = (e) =>{
            let imageResult = imageRequest.result;
            let imageURL = imageResult.url;
            let a = document.createElement("a");
            a.href = imageURL;
            a.download = "image.jpg";
            a.click();
        }
    }
    else{
        let videoDbTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);

        videoRequest.onsuccess = (e) =>{
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    } 
}