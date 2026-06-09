"use strict";

/**
 * Pure helpers for confirming Spotify Web Playback SDK actually started a track
 * after auto-advance (HTTP play can succeed while SDK stays paused).
 */

function spotifySdkTrackId(state) {
  return state?.track_window?.current_track?.id || null;
}

function isSpotifyStatePlayingTrack(state, trackId) {
  if (!trackId || !state) return false;
  if (spotifySdkTrackId(state) !== trackId) return false;
  return !state.paused;
}

function needsSpotifyPlaybackRetry(state, trackId) {
  return !isSpotifyStatePlayingTrack(state, trackId);
}

function shouldScheduleAutoAdvanceAfterTrackAdvance({ provider, playbackStarted }) {
  if (provider === "spotify") return Boolean(playbackStarted);
  return true;
}

const DEFAULT_CONFIRM_POLL_MS = 200;
const DEFAULT_CONFIRM_TIMEOUT_MS = 3000;

function computeConfirmPollDeadline(timeoutMs, nowMs = Date.now()) {
  return nowMs + Math.max(0, Number(timeoutMs) || DEFAULT_CONFIRM_TIMEOUT_MS);
}

const api = {
  spotifySdkTrackId,
  isSpotifyStatePlayingTrack,
  needsSpotifyPlaybackRetry,
  shouldScheduleAutoAdvanceAfterTrackAdvance,
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  computeConfirmPollDeadline
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.SpotifyConfirmPlaying = api;
}
