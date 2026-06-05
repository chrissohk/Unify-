"use strict";

/** sessionStorage key for Spotify position across same-tab reload. */
const SPOTIFY_RELOAD_RESUME_KEY = "spotifyReloadResume";

/** sessionStorage key for SoundCloud position across same-tab reload. */
const SOUNDCLOUD_RELOAD_RESUME_KEY = "soundcloudReloadResume";

function normalizeSnapshotPayload(snapshot, provider) {
  const positionMs = Math.max(0, Math.round(Number(snapshot.positionMs) || 0));
  const durationMs = Math.max(0, Math.round(Number(snapshot.durationMs) || 0));
  const payload = {
    provider,
    index: Number(snapshot.index),
    trackId: String(snapshot.trackId),
    positionMs,
    durationMs,
    paused: Boolean(snapshot.paused),
    savedAt: Date.now()
  };
  if (snapshot.permalink != null && String(snapshot.permalink).trim()) {
    payload.permalink = String(snapshot.permalink).trim();
  }
  return payload;
}

function parseStoredSnapshot(raw) {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data.trackId !== "string") return null;
    const out = {
      provider: data.provider || null,
      index: Number(data.index),
      trackId: data.trackId,
      positionMs: Math.max(0, Math.round(Number(data.positionMs) || 0)),
      durationMs: Math.max(0, Math.round(Number(data.durationMs) || 0)),
      paused: Boolean(data.paused),
      savedAt: Number(data.savedAt) || 0
    };
    if (data.permalink != null && String(data.permalink).trim()) {
      out.permalink = String(data.permalink).trim();
    }
    return out;
  } catch (_) {
    return null;
  }
}

/**
 * @param {Storage|null|undefined} storage
 * @param {{ index: number, trackId: string, positionMs: number, durationMs?: number, paused?: boolean }} snapshot
 */
function writeSpotifyReloadSnapshot(storage, snapshot) {
  if (!storage || !snapshot?.trackId) return;
  try {
    storage.setItem(
      SPOTIFY_RELOAD_RESUME_KEY,
      JSON.stringify(normalizeSnapshotPayload(snapshot, "spotify"))
    );
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
  return parseStoredSnapshot(storage.getItem(SPOTIFY_RELOAD_RESUME_KEY));
}

/** @param {Storage|null|undefined} storage */
function clearSpotifyReloadSnapshot(storage) {
  if (!storage) return;
  try {
    storage.removeItem(SPOTIFY_RELOAD_RESUME_KEY);
  } catch (_) {}
}

/**
 * @param {Storage|null|undefined} storage
 * @param {{ index: number, trackId: string, positionMs: number, durationMs?: number, paused?: boolean, permalink?: string }} snapshot
 */
function writeSoundCloudReloadSnapshot(storage, snapshot) {
  if (!storage || !snapshot?.trackId) return;
  try {
    storage.setItem(
      SOUNDCLOUD_RELOAD_RESUME_KEY,
      JSON.stringify(normalizeSnapshotPayload(snapshot, "soundcloud"))
    );
  } catch (_) {}
}

/**
 * @param {Storage|null|undefined} storage
 * @returns {{ index: number, trackId: string, positionMs: number, durationMs: number, paused: boolean, savedAt: number, permalink?: string }|null}
 */
function readSoundCloudReloadSnapshot(storage) {
  if (!storage) return null;
  return parseStoredSnapshot(storage.getItem(SOUNDCLOUD_RELOAD_RESUME_KEY));
}

/** @param {Storage|null|undefined} storage */
function clearSoundCloudReloadSnapshot(storage) {
  if (!storage) return;
  try {
    storage.removeItem(SOUNDCLOUD_RELOAD_RESUME_KEY);
  } catch (_) {}
}

function clampPositionMs(positionMs, item, snapshot) {
  let ms = Math.max(0, Math.round(Number(positionMs) || 0));
  const durFromSnap = snapshot?.durationMs;
  const durFromItem = Math.max(0, Math.round(Number(item.durationSec) || 0) * 1000);
  const cap = durFromSnap > 0 ? durFromSnap : durFromItem;
  if (cap > 0) ms = Math.min(ms, Math.max(0, cap - 500));
  return ms;
}

/**
 * Resolve start position for reload resume, clamped to duration when known.
 * Matches on trackId only (queue index may change before reload).
 * @param {{ trackId: string, index?: number, durationSec?: number }} item
 * @param {{ trackId: string, positionMs: number, durationMs?: number, index?: number }|null} snapshot
 * @param {number|undefined} explicitMs
 */
function resolveResumePositionMs(item, snapshot, explicitMs) {
  if (explicitMs != null && !Number.isNaN(Number(explicitMs))) {
    return clampPositionMs(Number(explicitMs), item, snapshot);
  }
  if (snapshot && snapshot.trackId === item.trackId) {
    return clampPositionMs(snapshot.positionMs, item, snapshot);
  }
  return 0;
}

/** @deprecated Use resolveResumePositionMs */
function resolveSpotifyResumePositionMs(item, snapshot, explicitMs) {
  return resolveResumePositionMs(item, snapshot, explicitMs);
}

/**
 * Whether a SoundCloud snapshot applies to the current queue row.
 * @param {{ trackId: string, permalinkUrl?: string }} item
 * @param {{ trackId: string, permalink?: string }|null} snapshot
 */
function soundCloudSnapshotMatchesItem(item, snapshot) {
  if (!snapshot || snapshot.trackId !== item.trackId) return false;
  const snapPerm = snapshot.permalink ? String(snapshot.permalink).trim() : "";
  const itemPerm = item.permalinkUrl ? String(item.permalinkUrl).trim() : "";
  if (snapPerm && itemPerm && snapPerm !== itemPerm) return false;
  return true;
}

const spotifyReloadSnapshot = {
  SPOTIFY_RELOAD_RESUME_KEY,
  SOUNDCLOUD_RELOAD_RESUME_KEY,
  writeSpotifyReloadSnapshot,
  readSpotifyReloadSnapshot,
  clearSpotifyReloadSnapshot,
  writeSoundCloudReloadSnapshot,
  readSoundCloudReloadSnapshot,
  clearSoundCloudReloadSnapshot,
  resolveResumePositionMs,
  resolveSpotifyResumePositionMs,
  soundCloudSnapshotMatchesItem
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = spotifyReloadSnapshot;
}
if (typeof window !== "undefined") {
  window.spotifyReloadSnapshot = spotifyReloadSnapshot;
}
