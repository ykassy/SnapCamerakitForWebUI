// src/remoteAPI.js
// Web側 Remote API 受付＆20秒後リダイレクト（markerFound→redirect）
// - Specは settings.js を既定に、?spec= で上書き可
// - endpoint表記ゆれ吸収（markerFound / marker_found / marker-found）

import { bootstrapCameraKit, remoteApiServicesFactory, Injectable } from "@snap/camera-kit";
import { Settings } from "./settings";

/* ===== helpers ===== */
const readQuery = () => {
  try {
    const qs = new URLSearchParams(location.search || "");
    const o = {}; qs.forEach((v, k) => (o[k] = v));
    return o;
  } catch { return {}; }
};
const nowIso = () => { try { return new Date().toISOString(); } catch { return String(Date.now()); } };
const toAB = (v) => {
  if (v instanceof ArrayBuffer) return v;
  if (v instanceof Uint8Array) return v.buffer;
  const s = typeof v === "string" ? v : JSON.stringify(v);
  if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(s).buffer;
  const u = unescape(encodeURIComponent(s)); const a = new Uint8Array(u.length);
  for (let i = 0; i < u.length; i++) a[i] = u.charCodeAt(i);
  return a.buffer;
};

/* ===== spec / redirect config ===== */
const q = readQuery();
const API_SPEC_ID = (q.spec && String(q.spec)) || Settings?.config?.remoteAPISpecId || "";
const REDIRECT_URL =
  q.redirect || q.url || Settings?.config?.redirectUrl || "https://hackitinc.jp/";
const REDIRECT_DELAY_MS = (() => {
  const v = Number(q.delay_ms || q.delay || 20000);
  return isFinite(v) && v > 0 ? v : 20000;
})();
let __redirectTimer = null;

function scheduleRedirect() {
  if (q.noredirect === "1" || q.noredirect === "true") {
    console.info("[RemoteAPI] noredirect=1 → skip navigation");
    return false;
  }
  if (__redirectTimer) return false;

  __redirectTimer = setTimeout(() => {
    try {
      console.info("[RemoteAPI] navigating to", REDIRECT_URL);
      if (typeof location !== "undefined" && location.assign) location.assign(REDIRECT_URL);
      else if (typeof window !== "undefined") window.location = REDIRECT_URL;
    } catch (e) {
      console.error("[RemoteAPI] redirect failed:", e);
    } finally {
      __redirectTimer = null;
    }
  }, REDIRECT_DELAY_MS);

  console.info(`[RemoteAPI] redirect scheduled in ${REDIRECT_DELAY_MS}ms → ${REDIRECT_URL}`);
  return true;
}

/* ===== service (handler) ===== */
export const lensRemoteAPIHandler = {
  apiSpecId: API_SPEC_ID,

  getRequestHandler(request) {
    const raw = request?.endpointId ? String(request.endpointId) : "";
    const norm = raw.toLowerCase().replace(/[-_\s]+/g, ""); // markerFound → markerfound
    console.info("[RemoteAPI] request arrived:", raw, request?.parameters);

    const supported = new Set(["markerfound", "buttonpressed"]);
    if (!supported.has(norm)) return undefined;

    return (reply) => {
      try {
        const parameters = request?.parameters ?? {};
        if (norm === "markerfound") scheduleRedirect();

        const body = {
          ok: true,
          endpoint: raw,
          receivedAt: nowIso(),
          parameters,
          redirect: { scheduled: !!__redirectTimer, delayMs: REDIRECT_DELAY_MS, url: REDIRECT_URL },
        };
        reply({ status: "success", metadata: { endpoint: raw }, body: toAB(body) });
      } catch (err) {
        reply({
          status: "error",
          metadata: { endpoint: raw },
          body: toAB({ ok: false, endpoint: raw, error: String(err?.message || err) }),
        });
      }
    };
  },
};

/* ===== bootstrap with DI ===== */
export async function bootstrapCameraKitWithRemoteAPI(options = {}) {
  const apiToken = options.apiToken ?? Settings?.config?.apiToken;
  const logger = options.logger ?? "console";

  const kit = await bootstrapCameraKit({ apiToken, logger }, (container) =>
    container.provides(
      Injectable(
        remoteApiServicesFactory.token,
        [remoteApiServicesFactory.token],
        (existing) => ([...(existing ?? []), lensRemoteAPIHandler])
      )
    )
  );
  console.info("[RemoteAPI] service ready. Spec:", lensRemoteAPIHandler.apiSpecId);
  return kit;
}

/* ===== tiny debug surface ===== */
if (typeof window !== "undefined") {
  const state = {
    get specId() { return lensRemoteAPIHandler.apiSpecId; },
    set specId(v) { lensRemoteAPIHandler.apiSpecId = String(v || ""); },
  };
  function fire(endpointId, parameters = {}) {
    const h = lensRemoteAPIHandler.getRequestHandler({ endpointId, parameters });
    if (!h) return console.warn("[RemoteAPI] Unsupported endpoint:", endpointId);
    h((payload) => {
      try {
        const text = (typeof TextDecoder !== "undefined" && payload?.body)
          ? new TextDecoder().decode(payload.body)
          : "";
        console.log("[RemoteAPI] reply:", payload.status, payload.metadata, text);
      } catch { console.log("[RemoteAPI] reply:", payload); }
    });
  }
  function cancel() {
    if (__redirectTimer) {
      clearTimeout(__redirectTimer);
      __redirectTimer = null;
      console.info("[RemoteAPI] redirect cancelled");
    }
  }
  function info() {
    return {
      specId: state.specId,
      redirectUrl: REDIRECT_URL,
      delayMs: REDIRECT_DELAY_MS,
      timerRunning: !!__redirectTimer,
    };
  }
  Object.defineProperty(window, "__remoteApi", {
    value: { state, fire, cancel, info },
    writable: false,
    configurable: false,
  });
}
