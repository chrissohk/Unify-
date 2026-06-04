"use strict";

/**
 * Global playback volume: persisted level, mute, header UI, Spotify + SoundCloud apply.
 */

const STORAGE_VOLUME = "unify-playback-volume";
const STORAGE_MUTED = "unify-playback-muted";
const DEFAULT_VOLUME = 0.8;
const POPOVER_MQ = "(max-width: 719px)";

let volumeLevel = DEFAULT_VOLUME;
let muted = false;
let preMuteVolume = DEFAULT_VOLUME;

/** @type {{ getSpotifyPlayer?: () => unknown; getSoundCloudWidget?: () => unknown; isConnected?: () => boolean } | null} */
let hooks = null;

/** @type {HTMLElement[]} */
let rootEls = [];
/** @type {HTMLButtonElement[]} */
let muteBtns = [];
/** @type {HTMLInputElement[]} */
let sliderEls = [];
/** @type {HTMLInputElement | null} */
let popoverSliderEl = null;
/** @type {HTMLElement | null} */
let popoverEl = null;
/** @type {SVGElement[]} */
let iconMuteXs = [];

let popoverOpen = false;
/** @type {MediaQueryList | null} */
let popoverMq = null;

const clampVolume = (v) => Math.max(0, Math.min(1, Number(v) || 0));

const readStoredVolume = () => {
  try {
    const raw = localStorage.getItem(STORAGE_VOLUME);
    if (raw == null) return DEFAULT_VOLUME;
    const n = Number(raw);
    if (!Number.isFinite(n)) return DEFAULT_VOLUME;
    return clampVolume(n);
  } catch (_) {
    return DEFAULT_VOLUME;
  }
};

const readStoredMuted = () => {
  try {
    return localStorage.getItem(STORAGE_MUTED) === "1";
  } catch (_) {
    return false;
  }
};

const persistVolumeState = () => {
  try {
    localStorage.setItem(STORAGE_VOLUME, String(volumeLevel));
    localStorage.setItem(STORAGE_MUTED, muted ? "1" : "0");
  } catch (_) {}
};

const getEffectiveVolume = () => (muted ? 0 : volumeLevel);

const percentFromLevel = (level) => Math.round(clampVolume(level) * 100);

const levelFromPercent = (pct) => clampVolume(Number(pct) / 100);

const paintSliderFill = (input) => {
  if (!input) return;
  input.style.setProperty("--volume-fill", `${input.value}%`);
};

const syncSliderInputs = () => {
  const pct = String(percentFromLevel(muted ? 0 : volumeLevel));
  for (const input of sliderEls) input.value = pct;
  if (popoverSliderEl) popoverSliderEl.value = pct;
  for (const input of sliderEls) paintSliderFill(input);
  paintSliderFill(popoverSliderEl);
};

const syncMuteUi = () => {
  const eff = getEffectiveVolume();
  const muteLabel = muted ? "Unmute" : eff < 0.35 ? "Mute (low volume)" : "Mute";
  for (const btn of muteBtns) {
    btn.setAttribute("aria-pressed", muted ? "true" : "false");
    btn.setAttribute("aria-label", muteLabel);
  }
  const primaryRoot = rootEls[0] ?? null;
  for (const root of rootEls) {
    root.classList.toggle("is-muted", muted);
    if (root === primaryRoot && popoverMq?.matches) {
      root.setAttribute("aria-haspopup", "dialog");
      root.setAttribute("aria-expanded", popoverOpen ? "true" : "false");
    } else {
      root.removeAttribute("aria-haspopup");
      root.removeAttribute("aria-expanded");
    }
  }
  for (const icon of iconMuteXs) icon.hidden = !muted;
};

const syncDisabledUi = () => {
  const connected = hooks?.isConnected?.() ?? true;
  for (const root of rootEls) root.classList.toggle("is-disabled", !connected);
  for (const input of sliderEls) input.disabled = !connected;
  if (popoverSliderEl) popoverSliderEl.disabled = !connected;
  for (const btn of muteBtns) btn.disabled = !connected;
};

const applyVolumeToPlayers = () => {
  const eff = getEffectiveVolume();
  const player = hooks?.getSpotifyPlayer?.();
  if (player && typeof player.setVolume === "function") {
    try {
      const p = player.setVolume(eff);
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (_) {}
  }
  const widget = hooks?.getSoundCloudWidget?.();
  if (widget && typeof widget.setVolume === "function") {
    try {
      widget.setVolume(Math.round(eff * 100));
    } catch (_) {}
  }
};

const setVolumeLevel = (level, { fromUser = false } = {}) => {
  volumeLevel = clampVolume(level);
  if (fromUser && muted && volumeLevel > 0) {
    muted = false;
  }
  if (fromUser) persistVolumeState();
  syncSliderInputs();
  syncMuteUi();
  applyVolumeToPlayers();
};

const toggleMute = () => {
  if (muted) {
    muted = false;
    volumeLevel = clampVolume(preMuteVolume > 0 ? preMuteVolume : DEFAULT_VOLUME);
  } else {
    preMuteVolume = volumeLevel > 0 ? volumeLevel : DEFAULT_VOLUME;
    muted = true;
  }
  persistVolumeState();
  syncSliderInputs();
  syncMuteUi();
  applyVolumeToPlayers();
};

const closePopover = () => {
  if (!popoverEl || !popoverOpen) return;
  popoverOpen = false;
  popoverEl.hidden = true;
  syncMuteUi();
};

const openPopover = () => {
  if (!popoverEl || !popoverMq?.matches) return;
  popoverOpen = true;
  popoverEl.hidden = false;
  syncMuteUi();
  popoverSliderEl?.focus({ preventScroll: true });
};

const togglePopover = () => {
  if (popoverOpen) closePopover();
  else openPopover();
};

const onSliderInput = (input) => {
  const level = levelFromPercent(input?.value ?? 0);
  if (muted && level > 0) muted = false;
  setVolumeLevel(level, { fromUser: true });
};

const focusPrimaryMute = () => {
  muteBtns[0]?.focus({ preventScroll: true });
};

const wireSlider = (input) => {
  if (!input) return;
  input.addEventListener("input", () => {
    onSliderInput(input);
    syncSliderInputs();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePopover();
      focusPrimaryMute();
    }
  });
};

const onDocumentPointerDown = (event) => {
  if (!popoverOpen) return;
  const primaryRoot = rootEls[0] ?? null;
  if (!primaryRoot) return;
  const target = event.target;
  if (target instanceof Node && primaryRoot.contains(target)) return;
  closePopover();
};

const onDocumentKeyDown = (event) => {
  if (event.key === "Escape") closePopover();
};

const loadVolumeState = () => {
  volumeLevel = readStoredVolume();
  muted = readStoredMuted();
  preMuteVolume = volumeLevel > 0 ? volumeLevel : DEFAULT_VOLUME;
};

const registerVolumeRoot = (root, { primary = false } = {}) => {
  if (!root || rootEls.includes(root)) return;
  rootEls.push(root);

  const muteBtn = root.querySelector(".volume-control__mute");
  if (muteBtn) {
    muteBtns.push(muteBtn);
    muteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMute();
    });
  }

  const slider =
    root.querySelector("#volumeSlider") ??
    root.querySelector("#theaterVolumeSlider") ??
    root.querySelector(".volume-control__slider:not(.volume-control__slider--popover)");
  if (slider) {
    sliderEls.push(slider);
    wireSlider(slider);
  }

  const iconMuteX = root.querySelector(".volume-control__icon--mute-x");
  if (iconMuteX) iconMuteXs.push(iconMuteX);

  if (primary) {
    popoverSliderEl = root.querySelector("#volumeSliderPopover");
    popoverEl = root.querySelector(".volume-control__popover");
    wireSlider(popoverSliderEl);
    root.addEventListener("click", (event) => {
      if (!popoverMq?.matches) return;
      if (muteBtn?.contains(event.target)) return;
      if (popoverEl && !popoverEl.hidden && popoverEl.contains(event.target)) return;
      togglePopover();
    });
  }
};

const initVolumeControl = (options = {}) => {
  hooks = {
    getSpotifyPlayer: options.getSpotifyPlayer,
    getSoundCloudWidget: options.getSoundCloudWidget,
    isConnected: options.isConnected
  };

  const primaryRoot = options.root ?? document.querySelector(".app-header__volume");
  const theaterRoot =
    options.theaterRoot ?? document.querySelector(".now-playing-theater-volume");
  if (!primaryRoot && !theaterRoot) return;

  if (primaryRoot) registerVolumeRoot(primaryRoot, { primary: true });
  if (theaterRoot) registerVolumeRoot(theaterRoot);

  loadVolumeState();
  syncSliderInputs();
  syncMuteUi();
  syncDisabledUi();

  popoverMq = window.matchMedia(POPOVER_MQ);
  const onMqChange = () => {
    if (!popoverMq?.matches) closePopover();
    syncMuteUi();
  };
  popoverMq.addEventListener?.("change", onMqChange) ?? popoverMq.addListener(onMqChange);

  document.addEventListener("pointerdown", onDocumentPointerDown);
  document.addEventListener("keydown", onDocumentKeyDown);

  applyVolumeToPlayers();
};

/** Re-apply level after SDK / widget becomes ready. */
const refreshVolumeOnPlayers = () => {
  applyVolumeToPlayers();
};

const updateVolumeConnectedState = () => {
  syncDisabledUi();
};

const unifyVolumeApi = {
  initVolumeControl,
  applyVolumeToPlayers: refreshVolumeOnPlayers,
  updateVolumeConnectedState,
  toggleMute,
  getVolumeLevel: () => volumeLevel,
  isMuted: () => muted
};

globalThis.unifyVolume = unifyVolumeApi;

const volumeControlTestApi = { clampVolume, levelFromPercent, percentFromLevel };

if (typeof module !== "undefined" && module.exports) {
  module.exports = volumeControlTestApi;
}
