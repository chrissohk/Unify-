"use strict";

/**
 * System audio output: device list, label, persistence, best-effort setSinkId.
 */

const STORAGE_DEVICE_ID = "unify-audio-output-device-id";
const STORAGE_DEVICE_LABEL = "unify-audio-output-device-label";
const FALLBACK_LABEL = "System default";

/** @type {HTMLElement | null} */
let rootEl = null;
/** @type {HTMLElement | null} */
let labelEl = null;
/** @type {HTMLSelectElement | null} */
let selectEl = null;
/** @type {HTMLButtonElement | null} */
let chooseBtn = null;
/** @type {HTMLElement | null} */
let hintEl = null;

/** @type {HTMLAudioElement | null} */
let sinkAudioEl = null;

/** @type {string | null} */
let savedDeviceId = null;
/** @type {string | null} */
let savedDeviceLabel = null;

/** @type {MediaDeviceInfo[]} */
let outputDevices = [];

const hasMediaDevices = () =>
  typeof navigator !== "undefined" &&
  navigator.mediaDevices &&
  typeof navigator.mediaDevices.enumerateDevices === "function";

const supportsSetSinkId = () =>
  typeof HTMLMediaElement !== "undefined" &&
  typeof HTMLMediaElement.prototype.setSinkId === "function";

const supportsSelectAudioOutput = () =>
  hasMediaDevices() && typeof navigator.mediaDevices.selectAudioOutput === "function";

const readStorage = () => {
  try {
    savedDeviceId = localStorage.getItem(STORAGE_DEVICE_ID);
    savedDeviceLabel = localStorage.getItem(STORAGE_DEVICE_LABEL);
  } catch (_) {
    savedDeviceId = null;
    savedDeviceLabel = null;
  }
};

const persistSelection = (deviceId, label) => {
  savedDeviceId = deviceId || null;
  savedDeviceLabel = label || null;
  try {
    if (savedDeviceId) {
      localStorage.setItem(STORAGE_DEVICE_ID, savedDeviceId);
      localStorage.setItem(STORAGE_DEVICE_LABEL, savedDeviceLabel || "");
    } else {
      localStorage.removeItem(STORAGE_DEVICE_ID);
      localStorage.removeItem(STORAGE_DEVICE_LABEL);
    }
  } catch (_) {}
};

const deviceHasLabel = (device) => Boolean(device?.label?.trim());

const filterAudioOutputs = (devices) =>
  (devices || []).filter((d) => d && d.kind === "audiooutput");

/**
 * @param {MediaDeviceInfo[]} devices
 * @param {string | null} preferredId
 */
const pickDefaultDeviceId = (devices, preferredId = null) => {
  const outputs = filterAudioOutputs(devices);
  if (!outputs.length) return null;
  if (preferredId) {
    const match = outputs.find((d) => d.deviceId === preferredId);
    if (match) return match.deviceId;
  }
  const def = outputs.find((d) => d.deviceId === "default");
  if (def) return def.deviceId;
  const labeled = outputs.find(deviceHasLabel);
  if (labeled) return labeled.deviceId;
  return outputs[0].deviceId;
};

/**
 * @param {MediaDeviceInfo[]} devices
 * @param {string | null} activeId
 * @param {string | null} [storedLabel]
 */
const resolveOutputLabel = (devices, activeId, storedLabel = null) => {
  const outputs = filterAudioOutputs(devices);
  if (!outputs.length) {
    return storedLabel?.trim() || FALLBACK_LABEL;
  }
  const id = activeId || pickDefaultDeviceId(outputs, null);
  if (id) {
    const match = outputs.find((d) => d.deviceId === id);
    if (match?.label?.trim()) return match.label.trim();
  }
  if (storedLabel?.trim()) return storedLabel.trim();
  const def = outputs.find((d) => d.deviceId === "default");
  if (def?.label?.trim()) return def.label.trim();
  const firstLabeled = outputs.find(deviceHasLabel);
  if (firstLabeled?.label?.trim()) return firstLabeled.label.trim();
  return FALLBACK_LABEL;
};

const devicesHaveUsableLabels = (devices) =>
  filterAudioOutputs(devices).some(deviceHasLabel);

const getHintText = (mode) => {
  if (mode === "unsupported") {
    return "Output is managed by your browser or system settings.";
  }
  return "Spotify and SoundCloud play through this browser tab.";
};

const ensureSinkAudio = () => {
  if (sinkAudioEl || typeof document === "undefined") return sinkAudioEl;
  sinkAudioEl = document.createElement("audio");
  sinkAudioEl.setAttribute("aria-hidden", "true");
  sinkAudioEl.hidden = true;
  document.body.appendChild(sinkAudioEl);
  return sinkAudioEl;
};

const applySinkId = async (deviceId) => {
  if (!supportsSetSinkId() || !deviceId) return;
  const audio = ensureSinkAudio();
  if (!audio) return;
  try {
    await audio.setSinkId(deviceId);
  } catch (_) {}
};

const paintLabel = () => {
  if (!labelEl) return;
  const activeId = pickDefaultDeviceId(outputDevices, savedDeviceId);
  labelEl.textContent = resolveOutputLabel(outputDevices, activeId, savedDeviceLabel);
};

const paintHint = (mode) => {
  if (!hintEl) return;
  hintEl.textContent = getHintText(mode);
};

const syncSelectOptions = () => {
  if (!selectEl) return;
  const prev = selectEl.value;
  selectEl.innerHTML = "";
  const outputs = filterAudioOutputs(outputDevices).filter(deviceHasLabel);
  for (const device of outputs) {
    const opt = document.createElement("option");
    opt.value = device.deviceId;
    opt.textContent = device.label.trim();
    selectEl.appendChild(opt);
  }
  const activeId = pickDefaultDeviceId(outputDevices, savedDeviceId);
  if (activeId && outputs.some((d) => d.deviceId === activeId)) {
    selectEl.value = activeId;
  } else if (prev && outputs.some((d) => d.deviceId === prev)) {
    selectEl.value = prev;
  }
};

const syncControlsVisibility = () => {
  const canEnumerate = hasMediaDevices();
  const labeled = devicesHaveUsableLabels(outputDevices);
  const showSelect = Boolean(canEnumerate && supportsSetSinkId() && labeled && selectEl);
  const showChoose = Boolean(
    canEnumerate && supportsSelectAudioOutput() && chooseBtn && !showSelect
  );

  if (selectEl) {
    selectEl.hidden = !showSelect;
  }
  if (chooseBtn) {
    chooseBtn.hidden = !showChoose;
  }

  if (!canEnumerate) {
    paintHint("unsupported");
  } else {
    paintHint("supported");
  }
};

const onDeviceSelected = async (deviceId, label) => {
  persistSelection(deviceId, label);
  await applySinkId(deviceId);
  paintLabel();
  syncSelectOptions();
};

const refreshDevices = async () => {
  if (!hasMediaDevices()) {
    outputDevices = [];
    paintLabel();
    syncControlsVisibility();
    return;
  }
  try {
    const all = await navigator.mediaDevices.enumerateDevices();
    outputDevices = filterAudioOutputs(all);
  } catch (_) {
    outputDevices = [];
  }
  paintLabel();
  syncSelectOptions();
  syncControlsVisibility();
};

const onSelectChange = () => {
  if (!selectEl) return;
  const deviceId = selectEl.value;
  const device = outputDevices.find((d) => d.deviceId === deviceId);
  const label = device?.label?.trim() || savedDeviceLabel || FALLBACK_LABEL;
  void onDeviceSelected(deviceId, label);
};

const onChooseClick = async () => {
  if (!supportsSelectAudioOutput()) return;
  try {
    const device = await navigator.mediaDevices.selectAudioOutput();
    if (!device) return;
    await refreshDevices();
    await onDeviceSelected(device.deviceId, device.label?.trim() || FALLBACK_LABEL);
    if (selectEl && !selectEl.hidden) {
      selectEl.value = device.deviceId;
    }
  } catch (_) {}
};

const initAudioOutputControl = (options = {}) => {
  rootEl =
    options.root ?? document.querySelector("[data-testid='audio-output-section']");
  if (!rootEl) return;

  labelEl = rootEl.querySelector("#audioOutputLabel");
  selectEl = rootEl.querySelector("#audioOutputSelect");
  chooseBtn = rootEl.querySelector("#audioOutputChooseBtn");
  hintEl = rootEl.querySelector("#audioOutputHint");

  readStorage();
  paintHint(hasMediaDevices() ? "supported" : "unsupported");
  paintLabel();

  selectEl?.addEventListener("change", onSelectChange);
  chooseBtn?.addEventListener("click", () => void onChooseClick());

  if (hasMediaDevices()) {
    navigator.mediaDevices.addEventListener("devicechange", () => {
      void refreshDevices();
    });
  }

  void refreshDevices().then(() => {
    const activeId = pickDefaultDeviceId(outputDevices, savedDeviceId);
    if (activeId && supportsSetSinkId()) {
      void applySinkId(activeId);
    }
  });
};

const unifyAudioOutputApi = {
  initAudioOutputControl,
  refreshDevices
};

globalThis.unifyAudioOutput = unifyAudioOutputApi;

const audioOutputTestApi = {
  filterAudioOutputs,
  pickDefaultDeviceId,
  resolveOutputLabel,
  devicesHaveUsableLabels,
  supportsSetSinkId,
  supportsSelectAudioOutput,
  getHintText,
  FALLBACK_LABEL
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = audioOutputTestApi;
}
