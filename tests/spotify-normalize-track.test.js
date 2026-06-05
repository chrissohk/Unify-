const { test } = require("node:test");
const assert = require("node:assert/strict");

test("pickAlbumImageUrl prefers smallest image in array", () => {
  const { pickAlbumImageUrl } = require("../lib/spotifyWebApi");
  const url = pickAlbumImageUrl([
    { url: "https://i.scdn.co/image/large.jpg", height: 640, width: 640 },
    { url: "https://i.scdn.co/image/small.jpg", height: 64, width: 64 }
  ]);
  assert.equal(url, "https://i.scdn.co/image/small.jpg");
});

test("normalizeTrack maps album image to imageUrl", () => {
  const { normalizeTrack } = require("../lib/spotifyWebApi");
  const out = normalizeTrack({
    id: "abc",
    name: "Sunday",
    duration_ms: 211000,
    artists: [{ name: "The Cranberries" }],
    album: {
      images: [
        { url: "https://i.scdn.co/image/large.jpg", height: 640, width: 640 },
        { url: "https://i.scdn.co/image/small.jpg", height: 64, width: 64 }
      ]
    }
  });
  assert.equal(out.title, "Sunday");
  assert.equal(out.artist, "The Cranberries");
  assert.equal(out.durationSec, 211);
  assert.equal(out.imageUrl, "https://i.scdn.co/image/small.jpg");
  assert.equal(out.provider, "spotify");
});

test("normalizeTrack omits imageUrl when album has no images", () => {
  const { normalizeTrack } = require("../lib/spotifyWebApi");
  const out = normalizeTrack({
    id: "x",
    name: "T",
    duration_ms: 60000,
    artists: [{ name: "A" }]
  });
  assert.equal(out.imageUrl, undefined);
});

test("normalizeAlbumSummary maps Spotify album fields", () => {
  const { normalizeAlbumSummary } = require("../lib/spotifyWebApi");
  const out = normalizeAlbumSummary({
    id: "al1",
    name: "No Need To Argue",
    release_date: "1994-10-03",
    total_tracks: 12,
    artists: [{ name: "The Cranberries" }],
    images: [{ url: "https://i.scdn.co/image/cover.jpg", height: 64, width: 64 }]
  });
  assert.equal(out.id, "al1");
  assert.equal(out.name, "No Need To Argue");
  assert.equal(out.artist, "The Cranberries");
  assert.equal(out.releaseYear, "1994");
  assert.equal(out.trackCount, 12);
  assert.equal(out.imageUrl, "https://i.scdn.co/image/cover.jpg");
  assert.equal(out.provider, "spotify");
  assert.equal(out.kind, "album");
});

test("normalizeAlbumSummary returns null without id", () => {
  const { normalizeAlbumSummary } = require("../lib/spotifyWebApi");
  assert.equal(normalizeAlbumSummary(null), null);
  assert.equal(normalizeAlbumSummary({ name: "x" }), null);
});
