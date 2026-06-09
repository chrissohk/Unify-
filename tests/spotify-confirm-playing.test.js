"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  spotifySdkTrackId,
  isSpotifyStatePlayingTrack,
  needsSpotifyPlaybackRetry,
  shouldScheduleAutoAdvanceAfterTrackAdvance,
  computeConfirmPollDeadline,
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS
} = require("../public/spotifyConfirmPlaying.js");

const playingState = (trackId) => ({
  paused: false,
  track_window: { current_track: { id: trackId } }
});

const pausedState = (trackId) => ({
  paused: true,
  track_window: { current_track: { id: trackId } }
});

test("spotifySdkTrackId reads current track id", () => {
  assert.equal(spotifySdkTrackId(playingState("abc")), "abc");
  assert.equal(spotifySdkTrackId(null), null);
});

test("isSpotifyStatePlayingTrack requires matching unpaused track", () => {
  assert.equal(isSpotifyStatePlayingTrack(playingState("abc"), "abc"), true);
  assert.equal(isSpotifyStatePlayingTrack(pausedState("abc"), "abc"), false);
  assert.equal(isSpotifyStatePlayingTrack(playingState("abc"), "xyz"), false);
  assert.equal(isSpotifyStatePlayingTrack(null, "abc"), false);
});

test("needsSpotifyPlaybackRetry when paused or wrong track", () => {
  assert.equal(needsSpotifyPlaybackRetry(pausedState("abc"), "abc"), true);
  assert.equal(needsSpotifyPlaybackRetry(playingState("abc"), "xyz"), true);
  assert.equal(needsSpotifyPlaybackRetry(playingState("abc"), "abc"), false);
  assert.equal(needsSpotifyPlaybackRetry(null, "abc"), true);
});

test("shouldScheduleAutoAdvanceAfterTrackAdvance gates Spotify failures only", () => {
  assert.equal(
    shouldScheduleAutoAdvanceAfterTrackAdvance({ provider: "spotify", playbackStarted: true }),
    true
  );
  assert.equal(
    shouldScheduleAutoAdvanceAfterTrackAdvance({ provider: "spotify", playbackStarted: false }),
    false
  );
  assert.equal(
    shouldScheduleAutoAdvanceAfterTrackAdvance({ provider: "soundcloud", playbackStarted: false }),
    true
  );
});

test("computeConfirmPollDeadline adds timeout to now", () => {
  assert.equal(computeConfirmPollDeadline(2500, 1000), 3500);
  assert.equal(DEFAULT_CONFIRM_POLL_MS, 200);
  assert.equal(DEFAULT_CONFIRM_TIMEOUT_MS, 3000);
});
