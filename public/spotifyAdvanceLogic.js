"use strict";

/**
 * Pure helpers for Spotify auto-advance (Web Playback SDK quirks: missed near-end
 * updates, same-track restart at position 0, wall-clock fallback).
 */

function effectiveDurationMs(sdkDurationMs, durationSec) {
  const sdk = Math.max(0, Number(sdkDurationMs) || 0);
  const fromQueue = Math.max(0, Math.round(Number(durationSec) || 0) * 1000);
  if (sdk > 0 && fromQueue > 0) return Math.max(sdk, fromQueue);
  return sdk > 0 ? sdk : fromQueue;
}

/**
 * Detect Spotify repeating the same track (position jumped back near start after we
 * had reached the last seconds). Conservative to avoid most mid-track seeks.
 */
function detectSpotifyTrackRestart({ prevPeakMs, posMs, durEffMs, paused }) {
  if (paused || durEffMs <= 0) return { shouldAdvance: false };
  const peak = Math.max(0, Number(prevPeakMs) || 0);
  const pos = Math.max(0, Number(posMs) || 0);
  if (peak < durEffMs - 6000) return { shouldAdvance: false };
  if (pos >= 2500) return { shouldAdvance: false };
  const jump = peak - pos;
  const minJump = Math.min(15000, durEffMs * 0.25);
  if (jump <= minJump) return { shouldAdvance: false };
  return { shouldAdvance: true };
}

/**
 * Delay until timer-based advance. Uses the earlier of SDK-derived remaining time
 * (when reliable) and wall-clock anchor from track start, so SDK position reset to 0
 * does not schedule a full extra track length.
 */
function computeSpotifyAutoAdvanceDelayMs({
  durationSec,
  sdkDurationMs,
  positionMs,
  currentTrackId,
  queueTrackId,
  wallStartMs,
  wallAnchorKey,
  queueIndex,
  nowMs = Date.now()
}) {
  const queueDurMs = Math.max(1000, Math.round(Number(durationSec) || 0) * 1000);
  const durEff = effectiveDurationMs(sdkDurationMs, durationSec);
  const pos = Math.max(0, Number(positionMs) || 0);
  const idOk = Boolean(currentTrackId && queueTrackId && currentTrackId === queueTrackId);
  const expectedKey = `${queueIndex}:${queueTrackId}`;
  const wallOk = wallStartMs > 0 && wallAnchorKey === expectedKey && idOk && queueIndex >= 0;

  let wallDelay = null;
  if (wallOk) {
    const elapsed = Math.max(0, nowMs - wallStartMs);
    wallDelay = Math.max(800, queueDurMs + 2000 - elapsed);
  }

  let sdkDelay = null;
  if (durEff > 0 && idOk) {
    const remaining = Math.max(0, durEff - pos);
    sdkDelay = Math.max(800, remaining + 2000);
  }

  if (wallDelay != null && sdkDelay != null) return Math.min(wallDelay, sdkDelay);
  if (wallDelay != null) return wallDelay;
  if (sdkDelay != null) return sdkDelay;
  return Math.max(800, queueDurMs + 2000);
}

const api = {
  effectiveDurationMs,
  detectSpotifyTrackRestart,
  computeSpotifyAutoAdvanceDelayMs
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.SpotifyAdvanceLogic = api;
}
