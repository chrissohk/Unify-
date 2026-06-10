const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");
const {
  SOUNDCLOUD_LIKES_ID,
  resolvePlaylistTrackCount,
  normalizePlaylistSummary,
  normalizeLikedTrackRow,
  normalizePlaylistTrackRow,
  soundCloudFetchLikesSummary,
  soundCloudListLibrary,
  soundCloudListPlaylistTracksById,
  soundCloudEnrichPlaylistTrackCountsByRefs,
  stripPlaylistSummaryInternals,
  summaryNeedsTrackCountEnrichment
} = require("../lib/soundcloudWebApi");

function mockLikedTrack(id) {
  return {
    track: {
      id,
      title: `Like ${id}`,
      duration: 60000,
      permalink_url: `https://soundcloud.com/u/like-${id}`,
      user: { username: "U" }
    }
  };
}

beforeEach(async () => {
  await request(app).post("/api/test/reset").expect(204);
});

test("normalizePlaylistSummary maps SoundCloud playlist fields", () => {
  const out = normalizePlaylistSummary(
    {
      id: 42,
      title: "My Set",
      track_count: 7,
      user: { username: "dj" },
      secret_token: "abc"
    },
    { kind: "owned" }
  );
  assert.equal(out.id, "42");
  assert.equal(out.name, "My Set");
  assert.equal(out.trackCount, 7);
  assert.equal(out._missingTrackCount, false);
  assert.equal(out.kind, "owned");
  assert.equal(out.ownerDisplayName, "dj");
  assert.equal(out.secretToken, "abc");
  assert.equal(out.provider, "soundcloud");
});

test("normalizeLikedTrackRow unwraps nested track", () => {
  const out = normalizeLikedTrackRow({
    created_at: "2023-11-20T08:30:00.000Z",
    track: {
      id: 99,
      title: "Like Me",
      duration: 120000,
      permalink_url: "https://soundcloud.com/a/b",
      user: { username: "Artist" }
    }
  });
  assert.equal(out.id, "99");
  assert.equal(out.title, "Like Me");
  assert.equal(out.permalinkUrl, "https://soundcloud.com/a/b");
  assert.equal(out.provider, "soundcloud");
  assert.equal(out.addedAt, "2023-11-20T08:30:00.000Z");
});

test("resolvePlaylistTrackCount parses numeric strings", () => {
  assert.equal(resolvePlaylistTrackCount({ track_count: "12" }), 12);
  assert.equal(resolvePlaylistTrackCount({ track_count: 7 }), 7);
});

test("resolvePlaylistTrackCount ignores partial tracks embed", () => {
  assert.equal(
    resolvePlaylistTrackCount({ track_count: undefined, tracks: [1, 2, 3, 4, 5] }),
    null
  );
});

test("normalizePlaylistSummary marks missing count when track_count absent", () => {
  const out = normalizePlaylistSummary(
    { id: 99, title: "No count", tracks: [1, 2, 3] },
    { kind: "owned" }
  );
  assert.equal(out.trackCount, 0);
  assert.equal(out._missingTrackCount, true);
});

test("stripPlaylistSummaryInternals defers pending counts when deferCounts is true", () => {
  const raw = normalizePlaylistSummary({ id: 99, title: "No count", tracks: [1, 2, 3] }, { kind: "owned" });
  const stripped = stripPlaylistSummaryInternals(raw, { deferCounts: true });
  assert.equal(stripped.trackCount, null);
  assert.equal(stripped.trackCountPending, true);
  assert.equal(stripped._missingTrackCount, undefined);
});

test("summaryNeedsTrackCountEnrichment matches enrich filter", () => {
  assert.equal(
    summaryNeedsTrackCountEnrichment({ id: "1", _missingTrackCount: true, trackCount: 0 }),
    true
  );
  assert.equal(summaryNeedsTrackCountEnrichment({ id: "1", trackCount: 5 }), false);
});

test("soundCloudFetchLikesSummary uses total_count when API provides it", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/me/likes/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [mockLikedTrack(1)],
          total_count: 128,
          next_href: null
        })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudFetchLikesSummary({ accessToken: "tok" });
    assert.equal(r.ok, true);
    assert.equal(r.likes.trackCount, 128);
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudFetchLikesSummary marks count pending when total_count is absent", async () => {
  const originalFetch = global.fetch;
  let likesFetches = 0;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/me/likes/tracks")) {
      likesFetches += 1;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [mockLikedTrack(1), mockLikedTrack(2)],
          next_href: "https://api.soundcloud.com/me/likes/tracks?cursor=2"
        })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudFetchLikesSummary({ accessToken: "tok" });
    assert.equal(r.ok, true);
    assert.equal(likesFetches, 1);
    assert.equal(r.likes.trackCountPending, true);
    assert.equal(r.likes.trackCount, undefined);
  } finally {
    global.fetch = originalFetch;
  }
});

test("normalizePlaylistTrackRow drops tracks without permalink", () => {
  assert.equal(
    normalizePlaylistTrackRow({
      id: 1,
      title: "No link",
      duration: 1000,
      user: { username: "x" }
    }),
    null
  );
});

test("normalizePlaylistTrackRow omits addedAt for bare playlist tracks", () => {
  const out = normalizePlaylistTrackRow({
    id: 3,
    title: "In Set",
    duration: 120000,
    created_at: "2010-01-01T00:00:00.000Z",
    permalink_url: "https://soundcloud.com/a/in-set",
    user: { username: "A" }
  });
  assert.equal(out.id, "3");
  assert.equal(out.addedAt, undefined);
});

test("normalizePlaylistTrackRow keeps addedAt on wrapped rows", () => {
  const out = normalizePlaylistTrackRow({
    created_at: "2024-03-15T12:00:00.000Z",
    track: {
      id: 9,
      title: "Wrapped",
      duration: 90000,
      permalink_url: "https://soundcloud.com/a/wrapped",
      user: { username: "A" }
    }
  });
  assert.equal(out.id, "9");
  assert.equal(out.addedAt, "2024-03-15T12:00:00.000Z");
});

test("soundCloudListLibrary merges likes, owned, and liked playlists", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/me/likes/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [
            {
              track: {
                id: 1,
                title: "Liked",
                duration: 60000,
                permalink_url: "https://soundcloud.com/u/liked",
                user: { username: "U" }
              }
            }
          ],
          total_count: 1,
          next_href: null
        })
      };
    }
    if (u.includes("/me/playlists") && !u.includes("/me/likes/playlists")) {
      assert.ok(u.includes("show_tracks=false"), "owned playlists should omit embedded tracks");
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [
            {
              id: 10,
              title: "Owned",
              track_count: 2,
              user: { username: "me" }
            }
          ],
          next_href: null
        })
      };
    }
    if (u.includes("/me/likes/playlists")) {
      assert.ok(u.includes("show_tracks=false"), "liked playlists should omit embedded tracks");
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [
            {
              playlist: {
                id: 20,
                title: "Liked Set",
                track_count: 5,
                user: { username: "other" }
              }
            }
          ],
          next_href: null
        })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudListLibrary({
      accessToken: "tok",
      ownedLimit: 30,
      ownedOffset: 0,
      likedLimit: 30,
      likedOffset: 0,
      fetchSongCounts: true,
      enrichTrackCounts: false
    });
    assert.equal(r.ok, true);
    assert.equal(r.likes.id, SOUNDCLOUD_LIKES_ID);
    assert.equal(r.likes.trackCount, 1);
    assert.equal(r.owned.items.length, 1);
    assert.equal(r.owned.items[0].id, "10");
    assert.equal(r.owned.items[0]._missingTrackCount, undefined);
    assert.equal(r.likedPlaylists.items.length, 1);
    assert.equal(r.likedPlaylists.items[0].id, "20");
    assert.equal(r.likedPlaylists.items[0].kind, "liked_playlist");
    assert.equal(r.likedPlaylists.items[0]._missingTrackCount, undefined);
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudListLibrary enriches zero track_count from playlist metadata", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/me/likes/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ collection: [], next_href: null })
      };
    }
    if (u.includes("/me/playlists") && !u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [
            {
              id: 10,
              title: "Owned",
              track_count: 0,
              user: { username: "me" }
            }
          ],
          next_href: null
        })
      };
    }
    if (u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ collection: [], next_href: null })
      };
    }
    if (/\/playlists\/10(\?|$)/.test(u) && !u.includes("/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 10, title: "Owned", track_count: 14 })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudListLibrary({
      accessToken: "tok",
      ownedLimit: 30,
      ownedOffset: 0,
      likedLimit: 30,
      likedOffset: 0,
      enrichTrackCounts: true
    });
    assert.equal(r.ok, true);
    assert.equal(r.owned.items[0].trackCount, 14);
    assert.equal(r.owned.items[0]._missingTrackCount, undefined);
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudListLibrary with fetchSongCounts false skips likes track pagination", async () => {
  const originalFetch = global.fetch;
  const fetchUrls = [];
  global.fetch = async (url) => {
    fetchUrls.push(String(url));
    const u = String(url);
    if (u.includes("/me/playlists") && !u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [{ id: 10, title: "Owned", track_count: 2, user: { username: "me" } }],
          next_href: null
        })
      };
    }
    if (u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ collection: [], next_href: null })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudListLibrary({
      accessToken: "tok",
      ownedLimit: 30,
      ownedOffset: 0,
      likedLimit: 30,
      likedOffset: 0,
      enrichTrackCounts: false,
      fetchSongCounts: false
    });
    assert.equal(r.ok, true);
    assert.equal(fetchUrls.some((u) => u.includes("/me/likes/tracks")), false);
    assert.equal(r.likes.id, SOUNDCLOUD_LIKES_ID);
    assert.equal(r.likes.trackCount, undefined);
    assert.equal(r.owned.items[0].trackCount, undefined);
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudListLibrary with enrichTrackCounts false skips playlist metadata fetches", async () => {
  const originalFetch = global.fetch;
  const fetchUrls = [];
  global.fetch = async (url) => {
    fetchUrls.push(String(url));
    const u = String(url);
    if (u.includes("/me/likes/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [],
          total_count: 3,
          next_href: null
        })
      };
    }
    if (u.includes("/me/playlists") && !u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [
            {
              id: 10,
              title: "Owned",
              track_count: 0,
              user: { username: "me" }
            }
          ],
          next_href: null
        })
      };
    }
    if (u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ collection: [], next_href: null })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudListLibrary({
      accessToken: "tok",
      ownedLimit: 30,
      ownedOffset: 0,
      likedLimit: 30,
      likedOffset: 0,
      enrichTrackCounts: false,
      fetchSongCounts: true
    });
    assert.equal(r.ok, true);
    assert.equal(
      fetchUrls.some((u) => /\/playlists\/10(\?|$)/.test(u) && !u.includes("/tracks")),
      false
    );
    assert.equal(r.owned.items[0].trackCount, null);
    assert.equal(r.owned.items[0].trackCountPending, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudEnrichPlaylistTrackCountsByRefs fills counts from metadata", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (/\/playlists\/10(\?|$)/.test(u) && !u.includes("/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 10, title: "Owned", track_count: 9 })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudEnrichPlaylistTrackCountsByRefs({
      accessToken: "tok",
      playlists: [{ id: "10" }]
    });
    assert.equal(r.ok, true);
    assert.equal(r.playlists.length, 1);
    assert.equal(r.playlists[0].trackCount, 9);
    assert.equal(r.playlists[0].trackCountPending, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudListPlaylistTracksById routes __likes__ to liked tracks", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/me/likes/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [
            {
              track: {
                id: 7,
                title: "Heart",
                duration: 90000,
                permalink_url: "https://soundcloud.com/x/y",
                user: { username: "X" }
              }
            }
          ],
          next_href: null
        })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudListPlaylistTracksById({
      accessToken: "tok",
      playlistId: SOUNDCLOUD_LIKES_ID,
      limit: 50,
      offset: 0
    });
    assert.equal(r.ok, true);
    assert.equal(r.results.length, 1);
    assert.equal(r.results[0].id, "7");
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudListPlaylistTracksById fetches playlist tracks by id", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/playlists/55/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [
            {
              id: 3,
              title: "In Set",
              duration: 120000,
              permalink_url: "https://soundcloud.com/a/in-set",
              user: { username: "A" }
            }
          ],
          next_href: null
        })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudListPlaylistTracksById({
      accessToken: "tok",
      playlistId: "55",
      limit: 50,
      offset: 0
    });
    assert.equal(r.ok, true);
    assert.equal(r.results.length, 1);
    assert.equal(r.results[0].title, "In Set");
  } finally {
    global.fetch = originalFetch;
  }
});

test("GET /api/soundcloud/playlists returns demo library when simulated connect", async () => {
  await request(app).post("/api/auth/soundcloud/connect").expect(200);
  const res = await request(app).get("/api/soundcloud/playlists").expect(200);
  assert.equal(res.body.demoMode, true);
  assert.equal(res.body.likes.id, SOUNDCLOUD_LIKES_ID);
  assert.ok(Array.isArray(res.body.owned.items));
  assert.equal(res.body.owned.items[0].id, "demo-playlist-sc");
});

test("POST /api/soundcloud/playlists/enrich-counts returns demo counts when simulated connect", async () => {
  await request(app).post("/api/auth/soundcloud/connect").expect(200);
  const res = await request(app)
    .post("/api/soundcloud/playlists/enrich-counts")
    .send({ playlists: [{ id: "demo-playlist-sc" }] })
    .expect(200);
  assert.equal(res.body.demoMode, true);
  assert.equal(res.body.playlists.length, 1);
  assert.equal(res.body.playlists[0].id, "demo-playlist-sc");
  assert.equal(res.body.playlists[0].trackCountPending, false);
  assert.equal(res.body.playlists[0].trackCountPending, false);
  assert.ok(res.body.playlists[0].trackCount >= 1);
});

test("GET /api/soundcloud/playlists does not fetch likes track pages by default", async () => {
  await request(app).post("/api/auth/soundcloud/connect").expect(200);
  const res = await request(app).get("/api/soundcloud/playlists").expect(200);
  assert.equal(res.body.demoMode, true);
  assert.equal(res.body.likes.trackCount, undefined);
});

test("soundCloudListLibrary with fetchSongCounts reads likes trackCount from total_count", async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes("/me/likes/tracks")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: [mockLikedTrack(1)],
          total_count: 215,
          next_href: null
        })
      };
    }
    if (u.includes("/me/playlists") && !u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ collection: [], next_href: null })
      };
    }
    if (u.includes("/me/likes/playlists")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ collection: [], next_href: null })
      };
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  try {
    const r = await soundCloudListLibrary({
      accessToken: "tok",
      ownedLimit: 30,
      ownedOffset: 0,
      likedLimit: 30,
      likedOffset: 0,
      fetchSongCounts: true,
      enrichTrackCounts: false
    });
    assert.equal(r.ok, true);
    assert.equal(r.likes.trackCount, 215);
  } finally {
    global.fetch = originalFetch;
  }
});

test("soundCloudListPlaylistTracksById fetches likes tail page when offset is at collection end", async () => {
  const originalFetch = global.fetch;
  let likesPage = 0;
  global.fetch = async (url) => {
    const u = String(url);
    if (!u.includes("/me/likes/tracks")) {
      throw new Error(`unexpected fetch: ${u}`);
    }
    likesPage += 1;
    if (likesPage === 1) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: Array.from({ length: 50 }, (_, i) => mockLikedTrack(1000 + i)),
          total_count: 120,
          next_href: "https://api.soundcloud.com/me/likes/tracks?page=2"
        })
      };
    }
    if (likesPage === 2) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          collection: Array.from({ length: 50 }, (_, i) => mockLikedTrack(2000 + i)),
          total_count: 120,
          next_href: "https://api.soundcloud.com/me/likes/tracks?page=3"
        })
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({
        collection: Array.from({ length: 20 }, (_, i) => mockLikedTrack(3000 + i)),
        total_count: 120,
        next_href: null
      })
    };
  };
  try {
    const r = await soundCloudListPlaylistTracksById({
      accessToken: "tok",
      playlistId: SOUNDCLOUD_LIKES_ID,
      limit: 50,
      offset: 100
    });
    assert.equal(r.ok, true);
    assert.equal(r.collectionTotal, 120);
    assert.equal(r.results.length, 20);
    assert.equal(r.results[0].id, "3000");
  } finally {
    global.fetch = originalFetch;
  }
});

test("GET /api/soundcloud/playlists/:id/tracks edge=newest uses tail offset in demo mode", async () => {
  await request(app).post("/api/auth/soundcloud/connect").expect(200);
  const res = await request(app)
    .get(
      `/api/soundcloud/playlists/${encodeURIComponent(SOUNDCLOUD_LIKES_ID)}/tracks?limit=50&offset=0&edge=newest`
    )
    .expect(200);
  assert.equal(res.body.demoMode, true);
  assert.ok(Array.isArray(res.body.results));
  assert.equal(typeof res.body.pageOffset, "number");
  assert.equal(typeof res.body.collectionTotal, "number");
});

test("GET /api/soundcloud/playlists/:id/tracks demo vs unknown id", async () => {
  await request(app).post("/api/auth/soundcloud/connect").expect(200);
  const likes = await request(app)
    .get(`/api/soundcloud/playlists/${encodeURIComponent(SOUNDCLOUD_LIKES_ID)}/tracks`)
    .expect(200);
  assert.equal(likes.body.demoMode, true);
  assert.ok(Array.isArray(likes.body.results));
  assert.ok(likes.body.results[0].permalinkUrl);

  const owned = await request(app).get("/api/soundcloud/playlists/demo-playlist-sc/tracks").expect(200);
  assert.equal(owned.body.demoMode, true);
  assert.ok(owned.body.results.length >= 1);

  await request(app)
    .get("/api/soundcloud/playlists/unknown-playlist/tracks")
    .expect(404)
    .expect(({ body }) => {
      assert.equal(body.code, "SOUNDCLOUD_PLAYLIST_NOT_FOUND");
    });
});

test("GET /api/meta exposes soundcloud playlist features", async () => {
  const res = await request(app).get("/api/meta").expect(200);
  assert.equal(res.body.features.soundcloudPlaylists, true);
  assert.equal(res.body.features.soundcloudPlaylistTracks, true);
});
