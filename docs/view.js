function adjustCanvasSize() {
    const canvas = document.getElementById('canvas');
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const cameraSwitBtnWrapper = document.querySelector(".camera-switcher-btn-wrapper");
    const captureBtn = document.getElementById("capture-btn");
    const stopBtn = document.getElementById("stop-btn");
    const picPreviewShareBtn = document.getElementById("pic-preview-share-btn");
    const moviePreviewShareBtn = document.getElementById("movie-preview-share-btn");
    const movieRecordCnt = document.querySelector(".movie-record-cnt");

    if (isLandscape) {
        // canvas.style.width = "100%";
        // canvas.style.height = "auto";
        canvas.style.aspectRatio = "initial";
        cameraSwitBtnWrapper.style.transform="scale(0.6)";
        captureBtn.style.width = "80px";
        captureBtn.style.height = "80px";
        stopBtn.style.width = "80px";
        stopBtn.style.height = "80px";
        picPreviewShareBtn.style.fontSize = "20px";
        picPreviewShareBtn.style.padding = "18px 40px";
        moviePreviewShareBtn.style.fontSize = "20px";
        moviePreviewShareBtn.style.padding = "18px 40px";
        movieRecordCnt.style.fontSize = "14px";
    } else {
        canvas.style.width = "auto";
        canvas.style.height = "95vh";
        cameraSwitBtnWrapper.style.transform="scale(1.25)";
        captureBtn.style.width = "150px";
        captureBtn.style.height = "150px";
        stopBtn.style.width = "150px";
        stopBtn.style.height = "150px";
        picPreviewShareBtn.style.fontSize = "40px";
        picPreviewShareBtn.style.padding = "32px 75px";
        moviePreviewShareBtn.style.fontSize = "40px";
        moviePreviewShareBtn.style.padding = "32px 75px";
        movieRecordCnt.style.fontSize = "36px";
        // canvas.style.aspectRatio = "9 / 16";
    }
}

// 初回適用
adjustCanvasSize();

// 向きが変わるたびに調整
window.addEventListener("resize", adjustCanvasSize);
window.addEventListener("orientationchange", adjustCanvasSize);