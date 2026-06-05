const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");
const { spotifySearchAlbums, spotifyListAlbumTracks } = require("../lib/spotifyWebApi");
const { nowSec } = require("../lib/playbackGuards");

beforeEach(async () => {
  await request(app).post("/api/test/reset").expect(204);
});

test("spotifySearchAlbums maps album search results", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/v1/search") && u.includes("type=album")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          albums: {
            items: [
              {
                id: "al1",
                name: "Jagged Little Pill",
                release_date: "1995-06-13",
                total_tracks: 12,
                artists: [{ name: "Alanis Morissette" }],
                images: [{ url: "https://i.scdn.co/image/al.jpg", height: 64, width: 64 }]
              }
            ]
          }
        }),
        text: async () => ""
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifySearchAlbums({
      accessToken: "token",
      query: "alanis",
      limit: 5
    });
    assert.equal(r.ok, true);
    assert.equal(r.results.length, 1);
    assert.equal(r.results[0].id, "al1");
    assert.equal(r.results[0].kind, "album");
    assert.equal(r.results[0].releaseYear, "1995");
  } finally {
    global.fetch = originalFetch;
  }
});

test("spotifyListAlbumTracks maps album track pages", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp } };
  const persist = () => {};
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/v1/albums/al1/tracks")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          items: [
            {
              id: "tr1",
              name: "You Oughta Know",
              duration_ms: 249000,
              artists: [{ name: "Alanis Morissette" }],
              album: {
                images: [{ url: "https://i.scdn.co/image/tr.jpg", height: 64, width: 64 }]
              }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyListAlbumTracks({
      sessions,
      persist,
      albumId: "al1",
      limit: 50,
      offset: 0
    });
    assert.equal(r.ok, true);
    assert.equal(r.results.length, 1);
    assert.equal(r.results[0].id, "tr1");
    assert.equal(r.results[0].title, "You Oughta Know");
    assert.equal(r.nextOffset, null);
  } finally {
    global.fetch = originalFetch;
  }
});

test("GET /api/provider/spotify/search?type=album returns demo albums when simulated connect", async () => {
  await request(app).post("/api/auth/spotify/connect").expect(200);
  const res = await request(app)
    .get("/api/provider/spotify/search?q=demo&type=album")
    .expect(200);
  assert.equal(res.body.provider, "spotify");
  assert.equal(res.body.kind, "album");
  assert.equal(res.body.demoMode, true);
  assert.ok(Array.isArray(res.body.results));
  assert.equal(res.body.results[0].id, "demo-album");
  assert.equal(res.body.results[0].kind, "album");
});

test("GET /api/provider/spotify/search defaults to track results", async () => {
  await request(app).post("/api/auth/spotify/connect").expect(200);
  const res = await request(app).get("/api/provider/spotify/search?q=neon").expect(200);
  assert.equal(res.body.provider, "spotify");
  assert.ok(Array.isArray(res.body.results));
  assert.equal(res.body.kind, undefined);
  assert.ok(res.body.results[0].title);
});

test("GET /api/spotify/albums/:id/tracks demo vs unknown id", async () => {
  await request(app).post("/api/auth/spotify/connect").expect(200);
  const ok = await request(app).get("/api/spotify/albums/demo-album/tracks").expect(200);
  assert.equal(ok.body.demoMode, true);
  assert.ok(Array.isArray(ok.body.results));
  assert.ok(ok.body.results.length >= 1);
  assert.ok(ok.body.results[0].imageUrl);

  await request(app)
    .get("/api/spotify/albums/other-album/tracks")
    .expect(404)
    .expect(({ body }) => {
      assert.equal(body.code, "SPOTIFY_ALBUM_NOT_FOUND");
    });
});
