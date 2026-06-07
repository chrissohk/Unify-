const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");
const {
  SPOTIFY_LIKED_SONGS_ID,
  normalizePlaylistSummary,
  normalizePlaylistTrackRow,
  resolvePlaylistTrackCount,
  spotifyListCurrentUserPlaylists,
  spotifyListFollowedPlaylists,
  spotifyListPlaylistTracks,
  spotifyFetchLikedSongsSummary
} = require("../lib/spotifyWebApi");
const { nowSec } = require("../lib/playbackGuards");

beforeEach(async () => {
  await request(app).post("/api/test/reset").expect(204);
});

test("normalizePlaylistSummary maps Spotify playlist fields from tracks.total", () => {
  const out = normalizePlaylistSummary({
    id: "pl1",
    name: "Road Trip",
    public: true,
    owner: { display_name: "Alex", id: "alex1" },
    tracks: { total: 42 }
  });
  assert.equal(out.id, "pl1");
  assert.equal(out.name, "Road Trip");
  assert.equal(out.ownerId, "alex1");
  assert.equal(out.ownerDisplayName, "Alex");
  assert.equal(out.trackCount, 42);
  assert.equal(out._missingTrackCount, false);
  assert.equal(out.public, true);
  assert.equal(out.provider, "spotify");
});

test("normalizePlaylistSummary prefers items.total over deprecated tracks.total", () => {
  const out = normalizePlaylistSummary({
    id: "pl2",
    name: "Mix",
    public: false,
    owner: { id: "u1" },
    items: { total: 12 },
    tracks: { total: 99 }
  });
  assert.equal(out.trackCount, 12);
  assert.equal(resolvePlaylistTrackCount({ items: { total: 12 }, tracks: { total: 99 } }), 12);
});

test("normalizePlaylistSummary marks missing count for enrichment", () => {
  const out = normalizePlaylistSummary({
    id: "pl3",
    name: "Empty meta",
    owner: { id: "u1" }
  });
  assert.equal(out.trackCount, 0);
  assert.equal(out._missingTrackCount, true);
  assert.equal(resolvePlaylistTrackCount({ id: "pl3" }), null);
});

test("normalizePlaylistSummary returns null without id", () => {
  assert.equal(normalizePlaylistSummary(null), null);
  assert.equal(normalizePlaylistSummary({ name: "x" }), null);
});

test("normalizePlaylistTrackRow maps track rows", () => {
  const out = normalizePlaylistTrackRow({
    added_at: "2024-02-15T10:00:00.000Z",
    track: {
      id: "tr1",
      type: "track",
      name: "Song",
      is_local: false,
      duration_ms: 180000,
      artists: [{ name: "Band" }],
      album: {
        images: [{ url: "https://i.scdn.co/image/cover.jpg", height: 64, width: 64 }]
      }
    }
  });
  assert.equal(out.id, "tr1");
  assert.equal(out.title, "Song");
  assert.equal(out.artist, "Band");
  assert.equal(out.durationSec, 180);
  assert.equal(out.imageUrl, "https://i.scdn.co/image/cover.jpg");
  assert.equal(out.provider, "spotify");
  assert.equal(out.addedAt, "2024-02-15T10:00:00.000Z");
});

test("normalizePlaylistTrackRow skips local, non-track, and missing id", () => {
  assert.equal(
    normalizePlaylistTrackRow({
      track: { id: "x", type: "track", is_local: true, name: "L", artists: [], duration_ms: 0 }
    }),
    null
  );
  assert.equal(
    normalizePlaylistTrackRow({
      track: { id: "ep1", type: "episode", name: "E", artists: [], duration_ms: 0 }
    }),
    null
  );
  assert.equal(
    normalizePlaylistTrackRow({
      track: { type: "track", name: "No id", artists: [], duration_ms: 0 }
    }),
    null
  );
  assert.equal(normalizePlaylistTrackRow(null), null);
});

test("spotifyListCurrentUserPlaylists returns only playlists owned by the current user", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp } };
  const persist = () => {};
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/v1/me/playlists")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          items: [
            {
              id: "mine",
              name: "Mine",
              public: false,
              owner: { id: "u1", display_name: "Me" },
              items: { total: 3 }
            },
            {
              id: "followed",
              name: "Followed",
              public: true,
              owner: { id: "other", display_name: "Other" },
              tracks: { total: 10 }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    if (u.endsWith("/v1/me") || u.includes("/v1/me?")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ id: "u1", display_name: "Christopher So" }),
        text: async () => ""
      };
    }
    if (u.includes("/playlists/mine/items")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ total: 3, items: [], limit: 1, offset: 0, next: null }),
        text: async () => ""
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyListCurrentUserPlaylists({ sessions, persist, limit: 50, offset: 0 });
    assert.equal(r.ok, true);
    assert.equal(r.items.length, 1);
    assert.equal(r.items[0].id, "mine");
    assert.equal(r.items[0].ownerId, "u1");
    assert.equal(r.items[0].trackCount, 3);
    assert.equal(r.items[0]._missingTrackCount, undefined);
    assert.equal(r.nextOffset, null);
    assert.equal(sessions.spotify.userId, "u1");
    assert.equal(sessions.spotify.displayName, "Christopher So");
  } finally {
    global.fetch = originalFetch;
  }
});

test("spotifyListFollowedPlaylists returns only playlists not owned by the current user", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp } };
  const persist = () => {};
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/v1/me/playlists")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          items: [
            {
              id: "mine",
              name: "Mine",
              public: false,
              owner: { id: "u1", display_name: "Me" },
              items: { total: 3 }
            },
            {
              id: "followed",
              name: "Followed",
              public: true,
              owner: { id: "other", display_name: "Other" },
              tracks: { total: 10 }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    if (u.endsWith("/v1/me") || u.includes("/v1/me?")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ id: "u1", display_name: "Christopher So" }),
        text: async () => ""
      };
    }
    if (u.includes("/playlists/followed/items")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ total: 10, items: [], limit: 1, offset: 0, next: null }),
        text: async () => ""
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyListFollowedPlaylists({ sessions, persist, limit: 50, offset: 0 });
    assert.equal(r.ok, true);
    assert.equal(r.items.length, 1);
    assert.equal(r.items[0].id, "followed");
    assert.equal(r.items[0].kind, "liked_playlist");
    assert.equal(r.items[0].ownerId, "other");
    assert.equal(r.items[0].trackCount, 10);
    assert.equal(r.nextOffset, null);
  } finally {
    global.fetch = originalFetch;
  }
});

test("isPlaylistOwnedByUser rejects followed playlist when owner id differs", () => {
  const { isPlaylistOwnedByUser } = require("../lib/spotifyWebApi");
  const profile = { id: "u1", displayName: "Christopher So" };
  assert.equal(
    isPlaylistOwnedByUser(
      {
        id: "p2",
        ownerId: "other-user",
        ownerDisplayName: "nowayback collective"
      },
      profile
    ),
    false
  );
});

test("spotifyListCurrentUserPlaylists enriches zero totals from list endpoint", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp, userId: "u1", displayName: "Christopher So" } };
  const persist = () => {};
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/v1/me/playlists")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          items: [
            {
              id: "pl-owned",
              name: "Decks",
              public: true,
              owner: { id: "u1", display_name: "Christopher So" },
              items: { total: 0 },
              tracks: { total: 0 }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    if (u.includes("/playlists/pl-owned/items")) {
      const pageTracks = Array.from({ length: 14 }, (_, i) => ({
        track: {
          id: `track-${i}`,
          name: `Song ${i}`,
          type: "track",
          artists: [{ name: "Artist" }],
          duration_ms: 180000
        }
      }));
      if (u.includes("limit=1")) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => null },
          json: async () => ({ total: 0, items: [], limit: 1, offset: 0, next: null, previous: null }),
          text: async () => ""
        };
      }
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          total: 0,
          items: pageTracks,
          limit: 50,
          offset: 0,
          next: null,
          previous: null
        }),
        text: async () => ""
      };
    }
    if (u.includes("/playlists/pl-owned?")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ id: "pl-owned", items: { total: 0 }, tracks: { total: 0 } }),
        text: async () => ""
      };
    }
    if (u.endsWith("/v1/me") || u.includes("/v1/me?")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ id: "u1", display_name: "Christopher So" }),
        text: async () => ""
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyListCurrentUserPlaylists({ sessions, persist, limit: 50, offset: 0 });
    assert.equal(r.ok, true);
    assert.equal(r.items.length, 1);
    assert.equal(r.items[0].trackCount, 14);
  } finally {
    global.fetch = originalFetch;
  }
});

test("spotifyListPlaylistTracks parses results and null next", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp } };
  const persist = () => {};
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/playlists/pl99/items")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          items: [
            {
              added_at: "2024-04-01T12:00:00.000Z",
              item: {
                id: "t1",
                type: "track",
                is_local: false,
                name: "A",
                duration_ms: 60000,
                artists: [{ name: "Art" }]
              }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    if (u.includes("/tracks?ids=t1")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          tracks: [
            {
              id: "t1",
              name: "A",
              album: {
                images: [{ url: "https://i.scdn.co/image/enriched.jpg", height: 64, width: 64 }]
              }
            }
          ]
        }),
        text: async () => ""
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyListPlaylistTracks({
      sessions,
      persist,
      playlistId: "pl99",
      limit: 50,
      offset: 0
    });
    assert.equal(r.ok, true);
    assert.equal(r.results.length, 1);
    assert.equal(r.results[0].id, "t1");
    assert.equal(r.results[0].imageUrl, "https://i.scdn.co/image/enriched.jpg");
    assert.equal(r.results[0].addedAt, "2024-04-01T12:00:00.000Z");
    assert.equal(r.nextOffset, null);
  } finally {
    global.fetch = originalFetch;
  }
});

test("normalizePlaylistTrackRow accepts item field from Get Playlist Items", () => {
  const { normalizePlaylistTrackRow } = require("../lib/spotifyWebApi");
  const out = normalizePlaylistTrackRow({
    item: {
      id: "t2",
      type: "track",
      name: "B",
      duration_ms: 120000,
      artists: [{ name: "Band" }]
    }
  });
  assert.equal(out.id, "t2");
  assert.equal(out.title, "B");
});

test("GET /api/spotify/playlists returns demo catalog when simulated connect", async () => {
  await request(app).post("/api/auth/spotify/connect").expect(200);
  const res = await request(app).get("/api/spotify/playlists").expect(200);
  assert.equal(res.body.demoMode, true);
  assert.equal(res.body.likedSongs.id, SPOTIFY_LIKED_SONGS_ID);
  assert.equal(res.body.likedSongs.name, "Liked Songs");
  assert.equal(res.body.likedSongs.trackCount, undefined);
  assert.ok(Array.isArray(res.body.items));
  assert.equal(res.body.items[0].id, "demo-playlist");
  assert.equal(res.body.items[0].trackCount, undefined);
  assert.equal(res.body.nextOffset, null);
  assert.ok(Array.isArray(res.body.likedPlaylists.items));
  assert.equal(res.body.likedPlaylists.nextOffset, null);
});

test("spotifyListCurrentUserPlaylists with enrichTrackCounts false omits track counts", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp } };
  const persist = () => {};
  const fetchUrls = [];
  global.fetch = async (url) => {
    fetchUrls.push(String(url));
    const u = String(url);
    if (u.includes("/v1/me/playlists")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          items: [
            {
              id: "mine",
              name: "Mine",
              public: false,
              owner: { id: "u1", display_name: "Me" },
              items: { total: 3 }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    if (u.endsWith("/v1/me") || u.includes("/v1/me?")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ id: "u1", display_name: "Christopher So" }),
        text: async () => ""
      };
    }
    if (u.includes("/playlists/mine/items")) {
      throw new Error("must not enrich playlist track counts when enrichTrackCounts is false");
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyListCurrentUserPlaylists({
      sessions,
      persist,
      limit: 50,
      offset: 0,
      enrichTrackCounts: false,
      omitSongCounts: true
    });
    assert.equal(r.ok, true);
    assert.equal(r.items.length, 1);
    assert.equal(r.items[0].trackCount, undefined);
    assert.equal(fetchUrls.some((u) => u.includes("/playlists/mine/items")), false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("GET /api/spotify/playlists/:id/tracks demo vs unknown id", async () => {
  await request(app).post("/api/auth/spotify/connect").expect(200);
  const ok = await request(app).get("/api/spotify/playlists/demo-playlist/tracks").expect(200);
  assert.equal(ok.body.demoMode, true);
  assert.ok(Array.isArray(ok.body.results));
  assert.ok(ok.body.results.length >= 1);
  assert.ok(ok.body.results[0].imageUrl);

  const liked = await request(app)
    .get(`/api/spotify/playlists/${encodeURIComponent(SPOTIFY_LIKED_SONGS_ID)}/tracks`)
    .expect(200);
  assert.equal(liked.body.demoMode, true);
  assert.ok(liked.body.results.length >= 1);
  assert.ok(liked.body.results.every((t) => typeof t.addedAt === "string" && t.addedAt.length > 0));
  if (liked.body.results.length >= 2) {
    const firstMs = Date.parse(liked.body.results[0].addedAt);
    const lastMs = Date.parse(liked.body.results[liked.body.results.length - 1].addedAt);
    assert.ok(firstMs < lastMs, "demo catalog order should not match newest-first dates");
  }

  await request(app)
    .get("/api/spotify/playlists/other-playlist/tracks")
    .expect(404)
    .expect(({ body }) => {
      assert.equal(body.code, "SPOTIFY_PLAYLIST_NOT_FOUND");
    });
});

test("spotifyFetchLikedSongsSummary uses saved-tracks total without image enrichment", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp } };
  const persist = () => {};
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/v1/me/tracks")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          total: 99,
          items: [
            {
              track: {
                id: "s1",
                type: "track",
                name: "Heart",
                duration_ms: 200000,
                artists: [{ name: "Artist" }]
              }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    if (u.includes("/v1/tracks?")) {
      throw new Error("liked songs summary must not batch-fetch track images");
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyFetchLikedSongsSummary({ sessions, persist });
    assert.equal(r.ok, true);
    assert.equal(r.likedSongs.id, SPOTIFY_LIKED_SONGS_ID);
    assert.equal(r.likedSongs.trackCount, 99);
  } finally {
    global.fetch = originalFetch;
  }
});

test("spotifyListPlaylistTracks routes liked songs id to saved tracks", async () => {
  const originalFetch = global.fetch;
  const exp = nowSec() + 7200;
  const sessions = { spotify: { accessToken: "access", expiresAt: exp } };
  const persist = () => {};
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/v1/me/tracks")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          total: 2,
          items: [
            {
              added_at: "2023-08-10T16:20:00.000Z",
              track: {
                id: "s1",
                type: "track",
                name: "Heart",
                duration_ms: 200000,
                artists: [{ name: "Artist" }]
              }
            }
          ],
          next: null
        }),
        text: async () => ""
      };
    }
    if (u.includes("/tracks?ids=s1")) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          tracks: [
            {
              id: "s1",
              name: "Heart",
              album: {
                images: [{ url: "https://i.scdn.co/image/liked.jpg", height: 64, width: 64 }]
              }
            }
          ]
        }),
        text: async () => ""
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await spotifyListPlaylistTracks({
      sessions,
      persist,
      playlistId: SPOTIFY_LIKED_SONGS_ID,
      limit: 50,
      offset: 0
    });
    assert.equal(r.ok, true);
    assert.equal(r.results.length, 1);
    assert.equal(r.results[0].id, "s1");
    assert.equal(r.results[0].addedAt, "2023-08-10T16:20:00.000Z");
    assert.equal(r.nextOffset, null);
  } finally {
    global.fetch = originalFetch;
  }
});

test("mapSpotifyBrowseError uses Liked Songs hint for liked-songs 403, not followed-playlist copy", () => {
  const { mapSpotifyBrowseError } = require("../server");
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    set() {
      return this;
    }
  };
  mapSpotifyBrowseError(
    res,
    { status: 403, code: "SPOTIFY_LIKED_SONGS_FAILED", details: "forbidden" },
    "SPOTIFY_PLAYLIST_TRACKS_FAILED"
  );
  assert.equal(res.statusCode, 403);
  assert.match(res.body.error, /Liked Songs/i);
  assert.doesNotMatch(res.body.error, /playlist you own/i);
});
