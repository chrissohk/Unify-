"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  effectiveDurationMs,
  detectSpotifyTrackRestart,
  computeSpotifyAutoAdvanceDelayMs
} = require("../public/spotifyAdvanceLogic.js");

test("effectiveDurationMs prefers max when both SDK and queue present", () => {
  assert.equal(effectiveDurationMs(190000, 180), 190000);
  assert.equal(effectiveDurationMs(170000, 180), 180000);
});

test("effectiveDurationMs falls back to queue when SDK is zero", () => {
  assert.equal(effectiveDurationMs(0, 200), 200000);
});

test("effectiveDurationMs uses SDK when queue is zero", () => {
  assert.equal(effectiveDurationMs(195000, 0), 195000);
});

test("detectSpotifyTrackRestart is false when paused", () => {
  assert.equal(
    detectSpotifyTrackRestart({
      prevPeakMs: 180000,
      posMs: 0,
      durEffMs: 180000,
      paused: true
    }).shouldAdvance,
    false
  );
});

test("detectSpotifyTrackRestart when same track loops from end to start", () => {
  assert.equal(
    detectSpotifyTrackRestart({
      prevPeakMs: 178000,
      posMs: 0,
      durEffMs: 180000,
      paused: false
    }).shouldAdvance,
    true
  );
});

test("detectSpotifyTrackRestart false when still in first half", () => {
  assert.equal(
    detectSpotifyTrackRestart({
      prevPeakMs: 60000,
      posMs: 0,
      durEffMs: 180000,
      paused: false
    }).shouldAdvance,
    false
  );
});

test("detectSpotifyTrackRestart false for small rewind near start", () => {
  assert.equal(
    detectSpotifyTrackRestart({
      prevPeakMs: 179000,
      posMs: 5000,
      durEffMs: 180000,
      paused: false
    }).shouldAdvance,
    false
  );
});

test("computeSpotifyAutoAdvanceDelayMs uses min of wall and SDK when both valid", () => {
  const t0 = 1_000_000;
  const delay = computeSpotifyAutoAdvanceDelayMs({
    durationSec: 180,
    sdkDurationMs: 180000,
    positionMs: 170000,
    currentTrackId: "abc",
    queueTrackId: "abc",
    wallStartMs: t0 - 170000,
    wallAnchorKey: "0:abc",
    queueIndex: 0,
    nowMs: t0
  });
  assert.ok(delay >= 800);
  assert.ok(delay <= 15000);
});

test("computeSpotifyAutoAdvanceDelayMs wall path when SDK position reset to zero", () => {
  const t0 = 2_000_000;
  const wallStart = t0 - 175000;
  const delay = computeSpotifyAutoAdvanceDelayMs({
    durationSec: 180,
    sdkDurationMs: 180000,
    positionMs: 0,
    currentTrackId: "abc",
    queueTrackId: "abc",
    wallStartMs: wallStart,
    wallAnchorKey: "0:abc",
    queueIndex: 0,
    nowMs: t0
  });
  const naiveSdkOnly = Math.max(800, 180000 + 2000);
  assert.ok(delay < naiveSdkOnly);
  assert.ok(delay >= 800);
});

test("computeSpotifyAutoAdvanceDelayMs ignores wall when anchor mismatches", () => {
  const delay = computeSpotifyAutoAdvanceDelayMs({
    durationSec: 60,
    sdkDurationMs: 60000,
    positionMs: 0,
    currentTrackId: "x",
    queueTrackId: "x",
    wallStartMs: 1_000_000,
    wallAnchorKey: "0:other",
    queueIndex: 0,
    nowMs: 1_100_000
  });
  assert.equal(delay, 62000);
});
