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
