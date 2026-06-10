"use strict";

/**
 * Theater tab-audio visualizer — capture lifecycle and UI toggle.
 */

(function () {
  const HINT_ID = "theaterVisualizerHint";

  const state = {
    theaterOpen: false,
    enabled: false,
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
    return Boolean(navigator.mediaDevices?.getDisplayMedia);
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
    const on = state.enabled;
    toggleEl.setAttribute("aria-checked", on ? "true" : "false");
    toggleEl.classList.toggle("is-on", on);
    toggleEl.disabled = !state.theaterOpen || !isCaptureSupported();
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
    stopCapture();
    syncToggleUi();
    showHint("Tab audio capture ended. Turn visuals on again to re-share this tab.");
  }

  async function startCapture() {
    const constraints = {
      video: true,
      audio: true
    };
    if (typeof window !== "undefined") {
      constraints.preferCurrentTab = true;
      constraints.selfBrowserSurface = "include";
      constraints.systemAudio = "exclude";
    }

    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

    stream.getVideoTracks().forEach((track) => {
      track.stop();
      stream.removeTrack(track);
    });

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) {
      stream.getTracks().forEach((track) => track.stop());
      throw new Error("No tab audio shared. Choose this tab and enable Share tab audio.");
    }

    state.captureEndedHandler = onCaptureEnded;
    audioTracks[0].addEventListener("ended", state.captureEndedHandler);
    return stream;
  }

  async function setEnabled(enabled) {
    if (!enabled) {
      state.enabled = false;
      stopCapture();
      syncToggleUi();
      showHint("");
      return;
    }

    if (!state.theaterOpen) return;

    stopCapture();

    try {
      await ensureVisualizerScripts();
      await window.TheaterVisualizerSketch?.warmupAudio?.();
      const stream = await startCapture();
      state.stream = stream;
      state.enabled = true;
      const host = ensureSketchHost();
      state.p5Instance = window.TheaterVisualizerSketch.create(host, stream, {
        getPlaybackFrozen: () => !isActivelyPlaying()
      });
      syncToggleUi();
      showHint("");
    } catch (err) {
      state.enabled = false;
      stopCapture();
      syncToggleUi();
      const denied =
        err?.name === "NotAllowedError" ||
        err?.name === "PermissionDeniedError" ||
        /denied|dismiss/i.test(String(err?.message || ""));
      showHint(
        denied
          ? "Tab audio not shared. Visuals stay off until you allow sharing."
          : err?.message || "Could not start audio visuals."
      );
    }
  }

  function onToggleClick() {
    void setEnabled(!state.enabled);
  }

  function onTheaterOpen() {
    state.theaterOpen = true;
    state.enabled = false;
    stopCapture();
    syncToggleVisibility();
    showHint("");
  }

  function onTheaterClose() {
    state.theaterOpen = false;
    state.enabled = false;
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
    isCaptureSupported
  };

  if (typeof window !== "undefined") {
    window.unifyTheaterVisualizer = api;
  }
})();
