const { test } = require("node:test");
const assert = require("node:assert/strict");

test("normalizeTrack maps SoundCloud API fields", () => {
  const { normalizeTrack } = require("../lib/soundcloudWebApi");
  const out = normalizeTrack({
    id: 999,
    title: "Hello",
    duration: 120000,
    permalink_url: "https://soundcloud.com/artist/hello",
    user: { username: "artist" }
  });
  assert.equal(out.id, "999");
  assert.equal(out.title, "Hello");
  assert.equal(out.artist, "artist");
  assert.equal(out.durationSec, 120);
  assert.equal(out.permalinkUrl, "https://soundcloud.com/artist/hello");
  assert.equal(out.provider, "soundcloud");
  assert.equal(out.imageUrl, undefined);
});

test("normalizeTrack maps artwork_url to imageUrl", () => {
  const { normalizeTrack } = require("../lib/soundcloudWebApi");
  const out = normalizeTrack({
    id: 1,
    title: "T",
    duration: 1000,
    permalink_url: "https://soundcloud.com/u/t",
    artwork_url: "https://i1.sndcdn.com/artworks-abc.jpg",
    user: { username: "u" }
  });
  assert.equal(out.imageUrl, "https://i1.sndcdn.com/artworks-abc.jpg");
});

test("normalizeTrack uses thumbnail size for -large artwork_url", () => {
  const { normalizeTrack } = require("../lib/soundcloudWebApi");
  const out = normalizeTrack({
    id: 2,
    title: "T",
    duration: 1000,
    permalink_url: "https://soundcloud.com/u/t",
    artwork_url: "https://i1.sndcdn.com/artworks-large.jpg",
    user: { username: "u" }
  });
  assert.equal(out.imageUrl, "https://i1.sndcdn.com/artworks-t67x67.jpg");
});

test("soundCloudSearchTracks returns normalized playable tracks", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url, opts) => {
    assert.match(String(url), /\/tracks\?/);
    assert.ok(String(opts.headers.Authorization || "").startsWith("OAuth "));
    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({
        collection: [
          {
            id: 1,
            title: "T",
            duration: 30000,
            permalink_url: "https://soundcloud.com/u/t",
            user: { username: "u" }
          }
        ]
      }),
      text: async () => ""
    };
  };
  try {
    const { soundCloudSearchTracks } = require("../lib/soundcloudWebApi");
    const result = await soundCloudSearchTracks({
      accessToken: "tok",
      query: "q",
      limit: 5
    });
    assert.equal(result.ok, true);
    assert.equal(result.results.length, 1);
    assert.equal(result.results[0].permalinkUrl, "https://soundcloud.com/u/t");
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudSearchTracks drops tracks without permalink_url", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    headers: { get: () => null },
    json: async () => ({
      collection: [{ id: 1, title: "T", duration: 1000, user: {}, permalink_url: "" }]
    }),
    text: async () => ""
  });
  try {
    const { soundCloudSearchTracks } = require("../lib/soundcloudWebApi");
    const result = await soundCloudSearchTracks({ accessToken: "tok", query: "q", limit: 10 });
    assert.equal(result.ok, true);
    assert.equal(result.results.length, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test("normalizeAlbumSearchSummary maps SoundCloud album playlist fields", () => {
  const { normalizeAlbumSearchSummary } = require("../lib/soundcloudWebApi");
  const out = normalizeAlbumSearchSummary({
    id: 42,
    title: "My EP",
    set_type: "ep",
    release_date: "2024-03-01",
    track_count: 6,
    artwork_url: "https://i1.sndcdn.com/artworks-large.jpg",
    secret_token: "tok",
    user: { username: "artist" }
  });
  assert.equal(out.id, "42");
  assert.equal(out.name, "My EP");
  assert.equal(out.artist, "artist");
  assert.equal(out.releaseYear, "2024");
  assert.equal(out.trackCount, 6);
  assert.equal(out.secretToken, "tok");
  assert.equal(out.kind, "album");
  assert.equal(out.provider, "soundcloud");
  assert.equal(out.imageUrl, "https://i1.sndcdn.com/artworks-t67x67.jpg");
});

test("soundCloudSearchAlbums prefers album-like playlist sets", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    assert.match(String(url), /\/playlists\?/);
    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({
        collection: [
          {
            id: 1,
            title: "Regular mix",
            set_type: "playlist",
            track_count: 20,
            user: { username: "dj" }
          },
          {
            id: 2,
            title: "Real album",
            set_type: "album",
            track_count: 8,
            artwork_url: "https://i1.sndcdn.com/a-large.jpg",
            user: { username: "artist" }
          }
        ]
      }),
      text: async () => ""
    };
  };
  try {
    const { soundCloudSearchAlbums } = require("../lib/soundcloudWebApi");
    const result = await soundCloudSearchAlbums({ accessToken: "tok", query: "q", limit: 10 });
    assert.equal(result.ok, true);
    assert.equal(result.results.length, 1);
    assert.equal(result.results[0].id, "2");
    assert.equal(result.results[0].name, "Real album");
  } finally {
    global.fetch = originalFetch;
  }
});
