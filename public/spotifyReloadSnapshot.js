"use strict";

/** sessionStorage key for Spotify position across same-tab reload. */
const SPOTIFY_RELOAD_RESUME_KEY = "spotifyReloadResume";

/**
 * @param {Storage|null|undefined} storage
 * @param {{ index: number, trackId: string, positionMs: number, durationMs?: number, paused?: boolean }} snapshot
 */
function writeSpotifyReloadSnapshot(storage, snapshot) {
  if (!storage || !snapshot?.trackId) return;
  const positionMs = Math.max(0, Math.round(Number(snapshot.positionMs) || 0));
  const durationMs = Math.max(0, Math.round(Number(snapshot.durationMs) || 0));
  const payload = {
    index: Number(snapshot.index),
    trackId: String(snapshot.trackId),
    positionMs,
    durationMs,
    paused: Boolean(snapshot.paused),
    savedAt: Date.now()
  };
  try {
    storage.setItem(SPOTIFY_RELOAD_RESUME_KEY, JSON.stringify(payload));
  } catch (_) {
    /* quota / private mode */
  }
}

/**
 * @param {Storage|null|undefined} storage
 * @returns {{ index: number, trackId: string, positionMs: number, durationMs: number, paused: boolean, savedAt: number }|null}
 */
function readSpotifyReloadSnapshot(storage) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(SPOTIFY_RELOAD_RESUME_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.trackId !== "string") return null;
    return {
      index: Number(data.index),
      trackId: data.trackId,
      positionMs: Math.max(0, Math.round(Number(data.positionMs) || 0)),
      durationMs: Math.max(0, Math.round(Number(data.durationMs) || 0)),
      paused: Boolean(data.paused),
      savedAt: Number(data.savedAt) || 0
    };
  } catch (_) {
    return null;
  }
}

/** @param {Storage|null|undefined} storage */
function clearSpotifyReloadSnapshot(storage) {
  if (!storage) return;
  try {
    storage.removeItem(SPOTIFY_RELOAD_RESUME_KEY);
  } catch (_) {}
}

/**
 * Resolve start position for reload resume, clamped to duration when known.
 * @param {{ trackId: string, index?: number, durationSec?: number }} item
 * @param {{ trackId: string, positionMs: number, durationMs?: number, index?: number }|null} snapshot
 * @param {number|undefined} explicitMs
 */
function resolveSpotifyResumePositionMs(item, snapshot, explicitMs) {
  if (explicitMs != null && !Number.isNaN(Number(explicitMs))) {
    return clampPositionMs(Number(explicitMs), item, snapshot);
  }
  if (
    snapshot &&
    snapshot.trackId === item.trackId &&
    (snapshot.index == null || snapshot.index === item.index)
  ) {
    return clampPositionMs(snapshot.positionMs, item, snapshot);
  }
  return 0;
}

function clampPositionMs(positionMs, item, snapshot) {
  let ms = Math.max(0, Math.round(Number(positionMs) || 0));
  const durFromSnap = snapshot?.durationMs;
  const durFromItem = Math.max(0, Math.round(Number(item.durationSec) || 0) * 1000);
  const cap = durFromSnap > 0 ? durFromSnap : durFromItem;
  if (cap > 0) ms = Math.min(ms, Math.max(0, cap - 500));
  return ms;
}

const spotifyReloadSnapshot = {
  SPOTIFY_RELOAD_RESUME_KEY,
  writeSpotifyReloadSnapshot,
  readSpotifyReloadSnapshot,
  clearSpotifyReloadSnapshot,
  resolveSpotifyResumePositionMs
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = spotifyReloadSnapshot;
}
if (typeof window !== "undefined") {
  window.spotifyReloadSnapshot = spotifyReloadSnapshot;
}
