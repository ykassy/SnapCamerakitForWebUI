let pressTimer; // 長押し用タイマー
let recordingUITimer; // 録画UI表示用タイマー
let recordingFlg = false; // レコーディングフラグ
let recordingStartTime = 0; // 録画開始時刻
let mediaRecorder;

/**
 * キャプチャーボタンのアニメーションONOFF
 * @param {*} isPreview 
 */
function captureBtnWrapperEvent(isPreview) {
    const captureBtnWrapper = document.querySelector(".capture-btn-wrapper");
    if (isPreview) {
        captureBtnWrapper.classList.add("preview");
    } else {
        captureBtnWrapper.classList.remove("preview");
    }
}

/**
 * キャプチャーボタンのアニメーションONOFF
 * @param {*} isPreview 
 */
function captureBtnEvent(isPreview) {
    const captureBtn = document.getElementById("capture-btn");
    if (isPreview) {
        captureBtn.classList.add("now-recording");
    } else {
        captureBtn.classList.remove("now-recording");
    }
}

/**
 * キャプチャーボタンのアニメーション2ONOFF
 * @param {*} isPreview 
 */
function imgCaptureBtnEvent(isPreview) {
    const captureBtn = document.getElementById("capture-btn");
    const captureBtnInner = document.querySelector(".capture-btn-inner");
    if (isPreview) {
        captureBtn.classList.add("now-capture");
    } else {
        captureBtn.classList.remove("now-capture");
    }
}

/**
 * キャプチャーボタンのアニメーションONOFF
 * @param {*} isPreview 
 */
function captureBtnInnerEvent(isPreview) {
    const captureBtnInner = document.querySelector(".capture-btn-inner");
    if (isPreview) {
        captureBtnInner.classList.add("preview");
    } else {
        captureBtnInner.classList.remove("preview");
    }
}

/**
 * カメラ切り替えボタンの表示非表示
 * @param {} isPreview 
 */
function cameraSwitchBtnWrapperEvent(isPreview) {
    const cameraSwitchBtnWrapper = document.querySelector(".camera-switcher-btn-wrapper");
    if (isPreview) {
        cameraSwitchBtnWrapper.classList.add("preview");
    } else {
        cameraSwitchBtnWrapper.classList.remove("preview");
    }
}

/**
 * 静止画プレビューボタンの表示非表示
 * @param {*} isPreview 
 */
function previewBtnWrapperEvent(isPreview) {
    const previewBtnWrapper = document.querySelector(".pic-preview-btn-wrapper");
    if (isPreview) {
        previewBtnWrapper.classList.add("preview");
    } else {
        previewBtnWrapper.classList.remove("preview");
    }
}

/**
 * 動画プレビューボタンの表示非表示
 * @param {*} isPreview 
 */
function moviePreviewBtnWrapperEvent(isPreview) {
    const moviePreviewBtnWrapper = document.querySelector(".movie-preview-btn-wrapper");
    if (isPreview) {
        moviePreviewBtnWrapper.classList.add("preview");
    } else {
        moviePreviewBtnWrapper.classList.remove("preview");
    }
}

/**
 * プレビュー時の背景黒塗り
 * @param {*} isPreview 
 */
function backColorBlack(isPreview) {
    const body = document.querySelector("body");
    if (isPreview) {
        body.classList.add("now-review");
    } else {
        body.classList.remove("now-review");
    }
}

function getOSType () {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (/iphone|ipod/.test(userAgent)) {
    return "ios";
  } else if (
    /ipad/.test(userAgent) ||
    (platform === "macintel" && navigator.maxTouchPoints > 1)
  ) {
    // iPadOSの場合、platformが"macintel"であり、タッチポイントが存在する
    return "ipados";
  } else if (/android/.test(userAgent)) {
    return "android";
  } else if (/win/.test(userAgent)) {
    return "windows";
  } else if (/macintosh|mac os x/.test(userAgent)) {
    return "macos";
  } else {
    return "others";
  }
};

/**
 * レコーディングのストップ
 */
function stopRecording() {
    // 動画録画停止音を再生
    if (window.playRecordStopSound) {
        window.playRecordStopSound();
    }
    
    mediaRecorder.stop();
    countStop();
    movieBlob = new Blob(window.recordingChunks, { type: 'video/mp4' });
    const downloadUrl = window.URL.createObjectURL(movieBlob);
    const videoTarget = document.getElementById('video');
    videoTarget.src = downloadUrl;
    videoTarget.style.display = 'block';
    videoTarget.autoplay = true;
    videoTarget.loop = true;
    videoTarget.muted = false;
    videoTarget.play().catch((error) => {
        console.error("Video autoplay failed:", error);
    });
    // キャプチャーボタンを非表示
    captureBtnWrapperEvent(true);
    // シェアボタンを表示
    moviePreviewBtnWrapperEvent(true);
    backColorBlack(true);
}

/**
 * レコーディングのスタート
 */
function recordingVideo() {
    // 動画録画開始音を再生
    if (window.playRecordStartSound) {
        window.playRecordStartSound();
    }
    
    recordingFlg = true;
    recordingStartTime = Date.now(); // 録画開始時刻を記録
    cameraSwitchBtnWrapperEvent(true);
    const captureBtnInner = document.querySelector(".capture-btn-inner");
    captureBtnInner.classList.add("rec-start");
    
    // 録画開始時にボタン押下アニメーションを追加
    const captureBtn = document.getElementById("capture-btn");
    captureBtn.classList.add("btn-pressed");
    setTimeout(() => {
        captureBtn.classList.remove("btn-pressed");
    }, 300);

    recordingUITimer = setTimeout(() => {
        captureBtnInner.classList.add("now-recording");
        // const captureBtn = document.getElementById("capture-btn");
        // captureBtn.classList.add("now-recording");
        const movieRecordCntWrapper = document.querySelector(".movie-record-cnt-wrapper");
        movieRecordCntWrapper.classList.add("now-recording");
        countUp(); // count.jsに記載
    }, 500)

    const os = getOSType();
    const mimeType = os === "ios" || os === "ipados" ? "video/mp4" : "video/webm";

    const videoStream = liveRenderTarget.captureStream(30);
    mediaRecorder = new MediaRecorder(videoStream, { mimeType });
    window.recordingChunks = [];
    mediaRecorder.addEventListener('dataavailable', (event) => {
        window.recordingChunks.push(event.data)
    });
    mediaRecorder.addEventListener('error', (event) => {
        console.error('Recorder error:', event.error);
    });
    mediaRecorder.start(100);

    const recordingStopBtn = document.querySelector("#stop-btn");
    recordingStopBtn.classList.add("now-recording");
}

function captureImg() {
    // 写真撮影音を再生
    if (window.playShutterSound) {
        window.playShutterSound();
    }
    
    captureBtnEvent(false); // ボタンアニメーションをリセット
    captureBtnInnerEvent(true);
    imgCaptureBtnEvent(true);
    // session.pause();
    setTimeout(() => {
        captureBtnWrapperEvent(true);
        cameraSwitchBtnWrapperEvent(true);

        // `canvas` 要素を取得
        const canvas = document.getElementById('canvas');
        // canvas の内容を画像として取得 (base64 データURL形式)
        const imageDataURL = canvas.toDataURL('image/png'); // MIME タイプ 'image/png'
        // プレビューエリアに画像を表示
        const capturedImage = document.getElementById('captured-image');
        capturedImage.src = imageDataURL; // 取得したデータURLを設定
        capturedImage.classList.add("preview");
        // シェアボタンを表示
        previewBtnWrapperEvent(true);
        backColorBlack(true);
    }, 500)
}

/**
 * キャプチャーボタン押下
 */
function btnDown() {
    captureBtnEvent(true);

    if (recordingFlg) {
        // 録画中の場合は停止処理
        stopRecording();
    } else {
        // 録画中でない場合は長押し判定（0.3秒）
        pressTimer = setTimeout(() => {
            recordingVideo();
        }, 300);
    }
}

/**
 * キャプチャーボタン離す
 */
function btnUp() {
    clearTimeout(pressTimer); // 長押し用のタイマーを解除
    const captureBtnInner = document.querySelector(".capture-btn-inner");
    captureBtnInner.classList.remove("rec-start");
    
    // 録画開始直後（1秒以内）に離した場合は、録画をキャンセルして静止画撮影
    if (recordingFlg && (Date.now() - recordingStartTime) < 1000) {
        // UI表示タイマーをキャンセル
        clearTimeout(recordingUITimer);
        
        // 録画をキャンセル
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        
        countStop();
        countReset(); // カウンターを00:00にリセット
        
        // UI状態を完全にリセット
        recordingFlg = false;
        recordingStartTime = 0;
        const captureBtn = document.getElementById("capture-btn");
        captureBtn.classList.remove("now-recording");
        captureBtnInner.classList.remove("now-recording");
        captureBtnInner.classList.remove("rec-start");
        const movieRecordCntWrapper = document.querySelector(".movie-record-cnt-wrapper");
        movieRecordCntWrapper.classList.remove("now-recording");
        const recordingStopBtn = document.querySelector("#stop-btn");
        recordingStopBtn.classList.remove("now-recording");
        cameraSwitchBtnWrapperEvent(false);
        captureBtnEvent(false);
        
        // 静止画撮影に切り替え
        captureImg();
        return;
    }
    
    // 録画中の場合は何もしない（停止はbtnDownで処理済み）
    if (recordingFlg) {
        captureBtnEvent(false);
        return;
    }
    
    // 通常時のみ静止画撮影
    captureImg();
}

document.addEventListener("DOMContentLoaded", () => {
    // キャプチャーボタンアクション
    const captureBtn = document.getElementById("capture-btn");
    // captureBtn.style.top = `${window.innerHeight - captureBtn.offsetHeight - 100}px`; // ボタンの位置調整

    // マウスダウン
    captureBtn.addEventListener("mousedown", () => {
        btnDown();
    });

    // タッチダウン
    captureBtn.addEventListener("touchstart", (event) => {
        event.stopPropagation()
        btnDown();
    })

    // マウスアップ
    captureBtn.addEventListener("mouseup", () => {
        btnUp();
    });

    // タッチアップ
    captureBtn.addEventListener("touchend", () => {
        btnUp();
    });

    // スマホタッチ長押し時にメニューが表示されるのを防ぐ
    document.querySelector(".capture-btn-wrapper").removeEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    // 静止画キャプチャー戻る
    const picPreviewBackBtn = document.getElementById("pic-preview-back-btn");
    picPreviewBackBtn.addEventListener("click", () => {
        captureBtnWrapperEvent(false);
        captureBtnInnerEvent(false);
        cameraSwitchBtnWrapperEvent(false);
        previewBtnWrapperEvent(false);

        // プレビューエリアの画像を削除
        const capturedImage = document.getElementById('captured-image');
        capturedImage.src = ""; // 取得したデータURLを設定
        capturedImage.classList.remove("preview");
        backColorBlack(false);
        imgCaptureBtnEvent(false);
        captureBtnEvent(false);

        // セッションの再開
        // session.play();
    })

    // 動画キャプチャー戻る
    const moviePreviewBackBtn = document.getElementById("movie-preview-back-btn");
    moviePreviewBackBtn.addEventListener("click", () => {
        captureBtnWrapperEvent(false);
        captureBtnInnerEvent(false);
        cameraSwitchBtnWrapperEvent(false);
        moviePreviewBtnWrapperEvent(false);
        const captureBtnInner = document.querySelector(".capture-btn-inner");
        captureBtnInner.classList.remove("rec-start");
        captureBtnInner.classList.remove("now-recording");
        // const captureBtn = document.getElementById("capture-btn");
        // captureBtn.classList.remove("now-recording");
        captureBtnEvent(false);

        const recordingStopBtn = document.querySelector("#stop-btn");
        recordingStopBtn.classList.remove("now-recording");
        const movieRecordCntWrapper = document.querySelector(".movie-record-cnt-wrapper");
        movieRecordCntWrapper.classList.remove("now-recording");

        const videoTarget = document.getElementById('video');
        videoTarget.src = "";
        videoTarget.style.display = 'none';

        recordingFlg = false;
        backColorBlack(false);
        captureBtnEvent(false);

    })

    // 静止画の共有
    const picPreviewShareBtn = document.getElementById("pic-preview-share-btn");
    picPreviewShareBtn.addEventListener("click", () => {
        pictureShare(); // share.jsに記載
    })

    // 動画の共有
    const moviePicPreviewShareBtn = document.getElementById("movie-preview-share-btn");
    moviePicPreviewShareBtn.addEventListener("click", () => {
        movieShare(); // share.jsに記載
    })
})