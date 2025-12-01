let startTime;
let timerStringDOM;
let countInterval;

// ミリ秒を経過時間の文字列に直す関数
function msecToSecString(time) {
    // 単位をミリ秒から秒へ変換
    time = Math.floor(time / 1000);

    // 秒数
    const seconds = time % 60;
    // 分数
    const minutes = Math.floor(time / 60);

    // 取得した数値をも2桁の文字列になるように、必要に応じて0を補う
    const secondStr = (seconds < 10 ? '0' : '') + String(seconds);
    const minutesStr = (minutes < 10 ? '0' : '') + String(minutes);

    return minutesStr + ":" + secondStr;
}

// タイマーの時刻を更新する処理
function UpdateTimer() {
    // 現在の時刻を取得
    const nowTime = new Date().getTime();

    // タイマーの表示を更新
    timerStringDOM.innerHTML = msecToSecString(nowTime - startTime);
}

// スタートボタンが押されたときの処理
function countUp() {
    timerStringDOM = document.querySelector(".movie-record-cnt");
    // 開始する前は00:00と表示
    timerStringDOM.innerHTML = '00:00'
    // 変数startTimeに開始時間を所持しておく
    // 現在の時間は、基準時からの経過時間(単位：ミリ秒)
    startTime = new Date().getTime();

    countInterval = setInterval(UpdateTimer, 1000);
}

function countStop() {
    clearInterval(countInterval);
}

function countReset() {
    clearInterval(countInterval);
    if (timerStringDOM) {
        timerStringDOM.innerHTML = '00:00';
    }
}