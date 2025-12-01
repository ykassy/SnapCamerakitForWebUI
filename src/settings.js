// src/settings.js
export const Settings = {
  config: {
    // ★ あなたの Camera Kit API トークン
    apiToken:
      "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQyOTA5OTI5LCJzdWIiOiI5OWM5ZDhmMy1iMDExLTRhZTEtODA1Yy0xOTI5NzNmMGFhMjd-UFJPRFVDVElPTn40ZWM1ODZhMi1hYTM2LTQzYmEtODgyMy04ZTM1Y2E4OTdmM2YifQ.20a-2HUoBlO-9P34TAXy-ZDU8LpGcV2_A3itb6EXQZE",

    // ★ レンズ指定（固定）
    lensID:  "205d7d5c-e0ba-4a3a-b39e-727bed44880d",
    groupID: "7d12e244-25e7-4cdf-bd2d-5f6a47a19a6e",

    // ★ Remote API の Spec（Snapの管理画面のID）
    remoteAPISpecId: "770201df-924a-4bf3-8099-146a93d9f07f",

    // 既定のリダイレクト先（URLパラメータ ?redirect= で上書き可）
    redirectUrl: "https://hackitinc.jp/",

    // Remote API を有効化
    useRemoteAPI: true,
  },
  camera: {
    fps: 30,
  },
  recording: {
    recordCaptureRenderTarget: false,
    recordMicAudio: false,
    recordLensAudio: true,  // MP4音声を有効化
  },
};
