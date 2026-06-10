"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { isNowPlayingActivelyPlaying } = require("../public/nowPlayingVinyl.js");

const spotifyItem = { provider: "spotify", trackId: "sp-1" };
const soundcloudItem = { provider: "soundcloud", trackId: "sc-1" };

test("isNowPlayingActivelyPlaying returns false when item is missing", () => {
  assert.equal(isNowPlayingActivelyPlaying(null, {}), false);
});

test("Spotify vinyl spins only when unpaused and not user-paused", () => {
  const playing = {
    spotifyPlaybackState: { paused: false },
    spotifyPausedByUser: false,
    spotifyReloadNeedsUserResume: false
  };
  const sdkPaused = {
    spotifyPlaybackState: { paused: true },
    spotifyPausedByUser: false,
    spotifyReloadNeedsUserResume: false
  };
  const userPaused = {
    spotifyPlaybackState: { paused: false },
    spotifyPausedByUser: true,
    spotifyReloadNeedsUserResume: false
  };
  const reloadResume = {
    spotifyPlaybackState: { paused: false },
    spotifyPausedByUser: false,
    spotifyReloadNeedsUserResume: true
  };

  assert.equal(isNowPlayingActivelyPlaying(spotifyItem, playing), true);
  assert.equal(isNowPlayingActivelyPlaying(spotifyItem, sdkPaused), false);
  assert.equal(isNowPlayingActivelyPlaying(spotifyItem, userPaused), false);
  assert.equal(isNowPlayingActivelyPlaying(spotifyItem, reloadResume), false);
});

test("SoundCloud vinyl follows soundcloudPlaybackState.paused", () => {
  assert.equal(
    isNowPlayingActivelyPlaying(soundcloudItem, { soundcloudPlaybackState: { paused: false } }),
    true
  );
  assert.equal(
    isNowPlayingActivelyPlaying(soundcloudItem, { soundcloudPlaybackState: { paused: true } }),
    false
  );
});
