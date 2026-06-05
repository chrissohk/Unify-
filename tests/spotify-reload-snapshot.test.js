const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  writeSpotifyReloadSnapshot,
  readSpotifyReloadSnapshot,
  clearSpotifyReloadSnapshot,
  writeSoundCloudReloadSnapshot,
  readSoundCloudReloadSnapshot,
  clearSoundCloudReloadSnapshot,
  resolveSpotifyResumePositionMs,
  resolveResumePositionMs,
  soundCloudSnapshotMatchesItem,
  SPOTIFY_RELOAD_RESUME_KEY,
  SOUNDCLOUD_RELOAD_RESUME_KEY
} = require("../public/spotifyReloadSnapshot.js");

function mockStorage() {
  const map = new Map();
  return {
    setItem(k, v) {
      map.set(k, v);
    },
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    removeItem(k) {
      map.delete(k);
    }
  };
}

test("write and read round-trip snapshot", () => {
  const storage = mockStorage();
  writeSpotifyReloadSnapshot(storage, {
    index: 2,
    trackId: "abc123",
    positionMs: 90500,
    durationMs: 240000,
    paused: true
  });
  const snap = readSpotifyReloadSnapshot(storage);
  assert.equal(snap.trackId, "abc123");
  assert.equal(snap.index, 2);
  assert.equal(snap.positionMs, 90500);
  assert.equal(snap.durationMs, 240000);
  assert.equal(snap.paused, true);
  assert.ok(snap.savedAt > 0);
});

test("clear removes snapshot", () => {
  const storage = mockStorage();
  writeSpotifyReloadSnapshot(storage, {
    index: 0,
    trackId: "t1",
    positionMs: 1000
  });
  clearSpotifyReloadSnapshot(storage);
  assert.equal(readSpotifyReloadSnapshot(storage), null);
});

test("resolveSpotifyResumePositionMs uses snapshot when track matches", () => {
  const item = { trackId: "t1", index: 1, durationSec: 200 };
  const snap = { trackId: "t1", index: 1, positionMs: 75000, durationMs: 200000 };
  assert.equal(resolveSpotifyResumePositionMs(item, snap), 75000);
});

test("resolveResumePositionMs uses snapshot when index differs but trackId matches", () => {
  const item = { trackId: "t1", index: 3, durationSec: 200 };
  const snap = { trackId: "t1", index: 0, positionMs: 61000, durationMs: 200000 };
  assert.equal(resolveResumePositionMs(item, snap), 61000);
});

test("resolveSpotifyResumePositionMs prefers explicit position", () => {
  const item = { trackId: "t1", durationSec: 180 };
  const snap = { trackId: "t1", positionMs: 5000 };
  assert.equal(resolveSpotifyResumePositionMs(item, snap, 42000), 42000);
});

test("resolveSpotifyResumePositionMs clamps to duration", () => {
  const item = { trackId: "t1", durationSec: 100 };
  const snap = { trackId: "t1", positionMs: 999000, durationMs: 100000 };
  assert.equal(resolveSpotifyResumePositionMs(item, snap), 99500);
});

test("SPOTIFY_RELOAD_RESUME_KEY is stable", () => {
  assert.equal(SPOTIFY_RELOAD_RESUME_KEY, "spotifyReloadResume");
});

test("SoundCloud write and read round-trip with permalink", () => {
  const storage = mockStorage();
  writeSoundCloudReloadSnapshot(storage, {
    index: 1,
    trackId: "sc-99",
    positionMs: 45000,
    durationMs: 180000,
    paused: false,
    permalink: "https://soundcloud.com/artist/track"
  });
  const snap = readSoundCloudReloadSnapshot(storage);
  assert.equal(snap.trackId, "sc-99");
  assert.equal(snap.positionMs, 45000);
  assert.equal(snap.paused, false);
  assert.equal(snap.permalink, "https://soundcloud.com/artist/track");
});

test("clearSoundCloudReloadSnapshot removes snapshot", () => {
  const storage = mockStorage();
  writeSoundCloudReloadSnapshot(storage, {
    index: 0,
    trackId: "sc-1",
    positionMs: 2000
  });
  clearSoundCloudReloadSnapshot(storage);
  assert.equal(readSoundCloudReloadSnapshot(storage), null);
});

test("soundCloudSnapshotMatchesItem requires trackId and optional permalink", () => {
  const item = { trackId: "sc-1", permalinkUrl: "https://soundcloud.com/a/b" };
  const snap = {
    trackId: "sc-1",
    permalink: "https://soundcloud.com/a/b",
    positionMs: 1000
  };
  assert.equal(soundCloudSnapshotMatchesItem(item, snap), true);
  assert.equal(
    soundCloudSnapshotMatchesItem(item, { ...snap, permalink: "https://soundcloud.com/other" }),
    false
  );
});

test("SOUNDCLOUD_RELOAD_RESUME_KEY is stable", () => {
  assert.equal(SOUNDCLOUD_RELOAD_RESUME_KEY, "soundcloudReloadResume");
});
