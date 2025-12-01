// Import the necessary Camera Kit modules.
import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from '@snap/camera-kit';

import { Settings } from './settings';
import { bootstrapCameraKitWithRemoteAPI } from './remoteAPI';

let cameraKit;
let isBackFacing = true; // マーカートラッキングのため背面カメラから開始
let currentLens;
let globalAudioContext = null;
let soundEffectAudioContext = null; // 効果音専用のAudioContext

// ===== 効果音専用AudioContextの初期化 =====
async function initSoundEffectAudioContext() {
  if (!soundEffectAudioContext) {
    soundEffectAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // suspended状態の場合はresume（Safariでは毎回必要）
  if (soundEffectAudioContext.state === 'suspended') {
    await soundEffectAudioContext.resume();
  }
  return soundEffectAudioContext;
}

// ===== 効果音生成関数 =====
// 写真撮影音（シャッター音）
window.playShutterSound = async function() {
  try {
    const ctx = await initSoundEffectAudioContext();
    const now = ctx.currentTime;
    
    // シャッター音：短いクリック音
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 1000; // 1kHz
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.05);
  } catch (err) {
    // マナーモード時など、音が鳴らない場合もあるが問題なし
  }
};

// 動画録画開始音
window.playRecordStartSound = async function() {
  try {
    const ctx = await initSoundEffectAudioContext();
    const now = ctx.currentTime;
    
    // 録画開始：上昇音
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.linearRampToValueAtTime(800, now + 0.1);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } catch (err) {
    // マナーモード時など、音が鳴らない場合もあるが問題なし
  }
};

// 動画録画停止音
window.playRecordStopSound = async function() {
  try {
    const ctx = await initSoundEffectAudioContext();
    const now = ctx.currentTime;
    
    // 録画停止：下降音
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.linearRampToValueAtTime(600, now + 0.1);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } catch (err) {
    // マナーモード時など、音が鳴らない場合もあるが問題なし
  }
};

// ===== Camera Kit初期化 =====
async function initCameraKit() {
  try {
    
    // AudioContextインターセプト（Camera Kitが作成するAudioContextを追跡）
    const originalAudioContext = window.AudioContext || window.webkitAudioContext;
    const createdContexts = [];
    
    const AudioContextProxy = function(...args) {
      const ctx = new originalAudioContext(...args);
      createdContexts.push(ctx);
      if (globalAudioContext && globalAudioContext.state === 'running') {
        ctx.resume();
      }
      return ctx;
    };
    AudioContextProxy.prototype = originalAudioContext.prototype;
    window.AudioContext = AudioContextProxy;
    window.webkitAudioContext = AudioContextProxy;
    
    window.getAllAudioContexts = () => {
      createdContexts.forEach(ctx => ctx.resume());
      return createdContexts;
    };
    
   window.enableVideoPlayIntercept = () => {
     const originalPlay = HTMLVideoElement.prototype.play;
     
     HTMLVideoElement.prototype.play = function() {
        this.muted = false;
        this.volume = 1.0;
        this.setAttribute('playsinline', '');
        
        Object.defineProperty(this, 'muted', {
          value: false,
          writable: true,
          configurable: true
        });
        
        if (globalAudioContext && globalAudioContext.state !== 'running') {
          globalAudioContext.resume().catch(() => {});
        }
        createdContexts.forEach(ctx => {
          if (ctx && ctx.state !== 'running') {
            ctx.resume().catch(() => {});
          }
        });
        
        this.muted = false;
        return originalPlay.call(this);
      };
    };
    
    // canvas初期化（画面の向きに応じて設定）
    window.liveRenderTarget = document.getElementById('canvas');
    const isLandscape = window.innerWidth > window.innerHeight;
    if (isLandscape) {
      // 横向き：16:9
      window.liveRenderTarget.width = 1280;
      window.liveRenderTarget.height = 720;
    } else {
      // 縦向き：9:16
      window.liveRenderTarget.width = 720;
      window.liveRenderTarget.height = 1280;
    }

    // Camera Kit初期化
    const cfg = (Settings && Settings.config) || {};
    
    if (cfg.apiToken && cfg.useRemoteAPI) {
      cameraKit = await bootstrapCameraKitWithRemoteAPI({ apiToken: cfg.apiToken, logger: 'console' });
    } else if (cfg.apiToken) {
      cameraKit = await bootstrapCameraKit({ apiToken: cfg.apiToken, logger: 'console' });
    } else {
      cameraKit = await bootstrapCameraKit({
        apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzU4MDA1OTYyLCJzdWIiOiJjZDllMWY0Yy04Njg3LTQ3MGMtYTA1NC0wMTU2YzEzMjVmY2V-U1RBR0lOR34yOGIwNjk4Yi0zYjk0LTQxZDgtOTgzZi1iOTFhMzE5ODU1YWQifQ.XsWDbWIHdPhsRA3Osy1kKlxYbqsTn4GTz8oFyCgcyLQ'
      });
    }

    // AudioContext作成（suspended状態）
    if (!globalAudioContext) {
      globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      window.globalAudioContext = globalAudioContext;
    }
    
    // セッション作成
    window.session = await cameraKit.createSession({
      liveRenderTarget: window.liveRenderTarget,
      audioContext: globalAudioContext
    });

    // canvas置換
    document.getElementById('canvas').replaceWith(window.session.output.live);
    window.session.output.live.style.touchAction = 'auto'; // ダブルタップ許可
    window.session.output.live.style.pointerEvents = 'auto';
    window.session.output.live.id = 'canvas';
    window.liveRenderTarget = window.session.output.live;

    // Lens読み込み
    if (cfg.lensID && cfg.groupID) {
      const lensById = await cameraKit.lensRepository.loadLens(cfg.lensID, cfg.groupID);
      if (lensById) {
        currentLens = lensById;
        await window.session.applyLens(currentLens);
      }
    } else {
      const { lenses } = await cameraKit.lensRepository.loadLensGroups(['999b50fd-ff0f-4f29-80d4-0433f59bbf27']);
      currentLens = lenses?.[0];
      if (currentLens) {
        await window.session.applyLens(currentLens);
      }
    }

    // カメラ許可を取得するために一度起動
    await updateCamera();
    setupCameraSwitcher();
    
    // カメラを停止（許可は取得済み）
    if (window.mediaStream) {
      window.session.pause();
      window.mediaStream.getVideoTracks().forEach(track => track.stop());
      window.mediaStream = null;
    }
    
    // ローディング画面を非表示にしてモーダル表示
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      // アニメーション完了後に要素を削除
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
    
    const modal = document.getElementById('audio-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
    
  } catch (error) {
    console.error('[initCameraKit] エラー:', error);
    throw error;
  }
}

// ===== モーダルのボタン処理 =====
function setupModalHandler() {
  const modal = document.getElementById('audio-modal');
  const startBtn = document.getElementById('start-experience-btn');

  if (startBtn && modal) {
    const handleClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      startBtn.disabled = true;
      
      // AudioContextをresume（ユーザーインタラクション内）
      if (!globalAudioContext) {
        globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        window.globalAudioContext = globalAudioContext;
      }
      await globalAudioContext.resume();
      
      // 全てのAudioContextをresume
      const allContexts = window.getAllAudioContexts();
      for (let ctx of allContexts) {
        if (ctx.state !== 'running') {
          await ctx.resume();
        }
      }
      
      // video.play()インターセプトを有効化
      window.enableVideoPlayIntercept();
      
      // 効果音用のAudioContextを初期化（ユーザーインタラクション内）
      initSoundEffectAudioContext();
      
      // カメラ起動
      await updateCamera();
      setupCameraSwitcher();
      
      // canvasを表示
      const canvas = document.getElementById('canvas');
      if (canvas) {
        canvas.classList.add('visible');
      }
      
      // モーダル非表示
      modal.classList.add('hidden');
      
      // カメラ切り替えボタンとキャプチャーボタンを表示
      const cameraSwitcher = document.querySelector('.camera-switcher-btn-wrapper');
      if (cameraSwitcher) {
        cameraSwitcher.classList.add('active');
      }
      
      const captureBtn = document.querySelector('.capture-btn-wrapper');
      if (captureBtn) {
        captureBtn.classList.add('active');
      }
    };
    
    // イベントリスナー登録（once: true で1回のみ実行）
    startBtn.addEventListener('click', handleClick, { once: true });
  }
}

// ===== ページ読み込み時の処理 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await initCameraKit(); // Camera Kit初期化
    setupModalHandler(); // モーダルボタン設定
  });
} else {
  initCameraKit().then(() => {
    setupModalHandler();
  });
}

// ===== カメラ更新 =====
async function updateCamera(switchCamera = false) {
  try {
    // カメラ切り替え時のみ反転
    if (switchCamera) {
      isBackFacing = !isBackFacing;
    }

    if (window.mediaStream) {
      window.session.pause();
      window.mediaStream.getTracks().forEach(track => track.stop());
    }

    // カメラ許可のみ取得（マイクは不要）
    window.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: isBackFacing ? 'environment' : 'user',
      },
    });

    const source = createMediaStreamSource(window.mediaStream, {
      cameraType: isBackFacing ? 'back' : 'front',
    });

    await window.session.setSource(source);

    if (!isBackFacing) {
      source.setTransform(Transform2D.MirrorX);
    }

    // 画面の向きに応じてレンダーサイズを設定
    const isLandscape = window.innerWidth > window.innerHeight;
    if (isLandscape) {
      window.session.source.setRenderSize(1280, 720);
    } else {
      window.session.source.setRenderSize(720, 1280);
    }

    if (currentLens) {
      await new Promise(r => requestAnimationFrame(r));
      await window.session.applyLens(currentLens);
    }

    await window.session.play();
    
  } catch (error) {
    console.error('⚠️ [Camera] エラー:', error);
    throw error;
  }
}

// ===== カメラ切り替えボタン =====
function setupCameraSwitcher() {
  const cameraSwitchBtn = document.getElementById("camera-switcher");
  if (cameraSwitchBtn) {
    cameraSwitchBtn.addEventListener("click", () => updateCamera(true)); // カメラ切り替え
  }
}

// ===== 画面回転時の処理 =====
let lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

function handleOrientationChange() {
  if (!window.session || !window.session.source) return;
  
  const isLandscape = window.innerWidth > window.innerHeight;
  const currentOrientation = isLandscape ? 'landscape' : 'portrait';
  
  // 向きが変わった場合のみ処理
  if (currentOrientation !== lastOrientation) {
    lastOrientation = currentOrientation;
    
    // レンダーサイズを更新
    if (isLandscape) {
      window.session.source.setRenderSize(1280, 720);
    } else {
      window.session.source.setRenderSize(720, 1280);
    }
  }
}

window.addEventListener('orientationchange', () => {
  setTimeout(handleOrientationChange, 100);
});

window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(handleOrientationChange, 100);
});


