"use strict";

/**
 * Theater mic-audio visualizer — capture lifecycle and UI toggle.
 */

(function () {
  const HINT_ID = "theaterVisualizerHint";
  const CAPTURE_HINT =
    "Allow microphone access to drive audio visuals. Headphones recommended.";

  const state = {
    theaterOpen: false,
    visualsRequested: false,
    enabled: false,
    awaitingCapturePermission: false,
    stream: null,
    p5Instance: null,
    captureEndedHandler: null,
    playbackCtx: {
      queueItem: null,
      spotifyPlaybackState: null,
      soundcloudPlaybackState: null,
      spotifyPausedByUser: false,
      spotifyReloadNeedsUserResume: false
    },
    lastTrackKey: null
  };

  let toggleEl = null;
  let hintEl = null;
  let scriptsLoaded = false;

  function isCaptureSupported() {
    return Boolean(navigator.mediaDevices?.getUserMedia);
  }

  function shouldSuppressTheaterFullscreenExit() {
    return state.awaitingCapturePermission;
  }

  function getMicErrorMessage(err) {
    const name = err?.name || "";
    const msg = String(err?.message || "");
    if (name === "NotAllowedError" || name === "PermissionDeniedError" || /denied|dismiss/i.test(msg)) {
      return "Microphone access denied. Visuals stay off until you allow the mic.";
    }
    if (name === "NotFoundError" || /device not found|requested device/i.test(msg)) {
      return "No microphone found. Connect a mic or enable it in system and browser privacy settings, then try again.";
    }
    if (name === "NotReadableError" || name === "TrackStartError") {
      return "Microphone is in use by another app. Close it and try again.";
    }
    return msg || "Could not start audio visuals.";
  }

  async function requestMicStream() {
    const attempts = [
      { audio: true },
      {
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true }
        }
      }
    ];

    let lastError = null;
    for (const constraints of attempts) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        lastError = err;
        if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
          throw err;
        }
      }
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter((device) => device.kind === "audioinput");
    for (const device of inputs) {
      if (!device.deviceId) continue;
      try {
        return await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { ideal: device.deviceId } }
        });
      } catch (err) {
        lastError = err;
        if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
          throw err;
        }
      }
    }

    throw lastError || new Error("No microphone found.");
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "1") resolve();
        else existing.addEventListener("load", () => resolve(), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = "1";
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  async function ensureVisualizerScripts() {
    if (scriptsLoaded && window.p5 && window.p5.FFT) return;
    await loadScript("/theaterVisualizerColors.js");
    await loadScript("/vendor/p5.min.js");
    await loadScript("/vendor/p5.sound.min.js");
    await loadScript("/theaterVisualizerSketch.js");
    scriptsLoaded = true;
  }

  function getNowPlayingRow() {
    return document.getElementById("nowPlayingRow");
  }

  async function restoreTheaterFullscreen() {
    const row = getNowPlayingRow();
    if (!row?.requestFullscreen || !state.theaterOpen) return;
    if (document.fullscreenElement === row) return;
    try {
      await row.requestFullscreen();
    } catch (_) {}
  }

  function ensureSketchHost() {
    const row = getNowPlayingRow();
    if (!row) return null;
    let host = row.querySelector(".theater-visualizer-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "theater-visualizer-host";
      host.setAttribute("aria-hidden", "true");
      row.insertBefore(host, row.firstChild);
    }
    return host;
  }

  function removeSketchHost() {
    getNowPlayingRow()?.querySelector(".theater-visualizer-host")?.remove();
  }

  function isActivelyPlaying() {
    const item = state.playbackCtx.queueItem;
    if (!item) return false;
    return Boolean(
      window.NowPlayingVinyl?.isNowPlayingActivelyPlaying?.(item, {
        spotifyPlaybackState: state.playbackCtx.spotifyPlaybackState,
        soundcloudPlaybackState: state.playbackCtx.soundcloudPlaybackState,
        spotifyPausedByUser: state.playbackCtx.spotifyPausedByUser,
        spotifyReloadNeedsUserResume: state.playbackCtx.spotifyReloadNeedsUserResume
      })
    );
  }

  function showHint(message) {
    if (!hintEl) return;
    if (!message) {
      hintEl.hidden = true;
      hintEl.textContent = "";
      return;
    }
    hintEl.hidden = false;
    hintEl.textContent = message;
  }

  function syncToggleUi() {
    if (!toggleEl) return;
    const on = state.visualsRequested;
    toggleEl.setAttribute("aria-checked", on ? "true" : "false");
    toggleEl.classList.toggle("is-on", on);
    toggleEl.disabled =
      !state.theaterOpen || !isCaptureSupported() || state.awaitingCapturePermission;
  }

  function syncToggleVisibility() {
    const wrap = document.querySelector(".now-playing-theater-visuals");
    if (!wrap) return;
    if (state.theaterOpen) {
      wrap.removeAttribute("hidden");
    } else {
      wrap.hidden = true;
    }
    if (!isCaptureSupported()) {
      wrap.setAttribute("title", "Audio visuals are not supported in this browser.");
    } else {
      wrap.removeAttribute("title");
    }
    syncToggleUi();
  }

  function destroySketch() {
    if (state.p5Instance) {
      try {
        state.p5Instance.remove();
      } catch (_) {}
      state.p5Instance = null;
    }
  }

  function stopCapture() {
    if (state.stream) {
      const audioTrack = state.stream.getAudioTracks()[0];
      if (audioTrack && state.captureEndedHandler) {
        audioTrack.removeEventListener("ended", state.captureEndedHandler);
      }
      state.stream.getTracks().forEach((track) => track.stop());
      state.stream = null;
      state.captureEndedHandler = null;
    }
    destroySketch();
    removeSketchHost();
  }

  function onCaptureEnded() {
    state.enabled = false;
    state.visualsRequested = false;
    stopCapture();
    syncToggleUi();
    showHint("Mic access ended. Turn visuals on again to re-enable.");
  }

  async function startCapture() {
    state.awaitingCapturePermission = true;
    showHint(CAPTURE_HINT);
    try {
      const stream = await requestMicStream();

      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("No microphone audio available.");
      }

      state.captureEndedHandler = onCaptureEnded;
      audioTracks[0].addEventListener("ended", state.captureEndedHandler);
      return stream;
    } finally {
      state.awaitingCapturePermission = false;
    }
  }

  async function setEnabled(enabled) {
    if (!enabled) {
      state.visualsRequested = false;
      state.enabled = false;
      stopCapture();
      syncToggleUi();
      showHint("");
      return;
    }

    if (!state.theaterOpen) return;

    stopCapture();
    state.enabled = false;

    try {
      await ensureVisualizerScripts();
      await window.TheaterVisualizerSketch?.warmupAudio?.();
      const stream = await startCapture();
      if (!state.visualsRequested || !state.theaterOpen) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      state.stream = stream;
      state.enabled = true;
      const host = ensureSketchHost();
      state.p5Instance = window.TheaterVisualizerSketch.create(host, stream, {
        getPlaybackFrozen: () => !isActivelyPlaying()
      });
      syncToggleUi();
      showHint("");
      await restoreTheaterFullscreen();
    } catch (err) {
      state.enabled = false;
      state.visualsRequested = false;
      stopCapture();
      syncToggleUi();
      showHint(getMicErrorMessage(err));
    }
  }

  function onToggleClick() {
    if (state.awaitingCapturePermission) return;
    const next = !state.visualsRequested;
    state.visualsRequested = next;
    syncToggleUi();
    void setEnabled(next);
  }

  function onTheaterOpen() {
    state.theaterOpen = true;
    syncToggleVisibility();
    if (!state.visualsRequested) {
      showHint("");
    }
    if (state.visualsRequested && !state.stream) {
      void setEnabled(true);
    }
  }

  function onTheaterClose() {
    state.theaterOpen = false;
    state.visualsRequested = false;
    state.enabled = false;
    state.awaitingCapturePermission = false;
    stopCapture();
    syncToggleVisibility();
    showHint("");
  }

  function updatePlaybackContext(ctx = {}) {
    const next = { ...state.playbackCtx, ...ctx };
    const trackKey = ctx.trackKey ?? state.lastTrackKey;
    if (trackKey && trackKey !== state.lastTrackKey) {
      window.TheaterVisualizerSketch?.resetState?.(state.p5Instance);
      state.lastTrackKey = trackKey;
    }
    state.playbackCtx = next;
  }

  function init() {
    toggleEl = document.getElementById("theaterVisualsToggle");
    hintEl = document.getElementById(HINT_ID);
    toggleEl?.addEventListener("click", onToggleClick);
    syncToggleVisibility();
  }

  const api = {
    init,
    setEnabled,
    onTheaterOpen,
    onTheaterClose,
    updatePlaybackContext,
    isCaptureSupported,
    shouldSuppressTheaterFullscreenExit
  };

  if (typeof window !== "undefined") {
    window.unifyTheaterVisualizer = api;
  }
})();
