"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  playlistSortNeedsBulkFetch,
  getDisplayedPlaylistTracks,
  isSpotifyFollowedPlaylistSelection,
  isPlaylistOrderOnlyPlaylist,
  shouldUsePlaylistOrderSort,
  computeTailPageOffset,
  computeTracksOlderOffset,
  resolveNewestFirstFetchParams,
  shouldRefetchNewestTailPage
} = require("../lib/playlistTrackDisplay.js");

const pageOne = [
  { id: "old1", addedAt: "2020-01-01T00:00:00.000Z" },
  { id: "old2", addedAt: "2020-06-01T00:00:00.000Z" },
  { id: "newest", addedAt: "2024-06-01T00:00:00.000Z" }
];

test("playlistSortNeedsBulkFetch returns false for newest when paginated owned playlist", () => {
  const browser = {
    selectedPlaylistKind: "owned",
    tracksNextOffset: 50,
    tracksLoadDirection: "newest"
  };
  assert.equal(playlistSortNeedsBulkFetch(browser, "newest"), false);
  assert.equal(playlistSortNeedsBulkFetch(browser, "oldest"), true);
});

test("playlistSortNeedsBulkFetch returns false when full playlist already loaded", () => {
  const browser = {
    selectedPlaylistKind: "owned",
    tracksNextOffset: null,
    tracksLoadDirection: "full"
  };
  assert.equal(playlistSortNeedsBulkFetch(browser, "newest"), false);
  assert.equal(playlistSortNeedsBulkFetch(browser, "oldest"), false);
});

test("playlistSortNeedsBulkFetch returns false for followed Spotify playlists", () => {
  const browser = {
    selectedPlaylistKind: "liked_playlist",
    tracksNextOffset: 50,
    tracksLoadDirection: "newest"
  };
  assert.equal(isSpotifyFollowedPlaylistSelection(browser), true);
  assert.equal(playlistSortNeedsBulkFetch(browser, "newest"), false);
  assert.equal(playlistSortNeedsBulkFetch(browser, "oldest"), false);
});

test("computeTailPageOffset returns last page offset", () => {
  assert.equal(computeTailPageOffset(400, 50), 350);
  assert.equal(computeTailPageOffset(50, 50), 0);
  assert.equal(computeTailPageOffset(60, 50), 50);
});

test("computeTracksOlderOffset steps backward by page size", () => {
  assert.equal(computeTracksOlderOffset(350, 50), 300);
  assert.equal(computeTracksOlderOffset(0, 50), null);
});

test("resolveNewestFirstFetchParams uses tail offset for owned playlists with track count", () => {
  assert.deepEqual(resolveNewestFirstFetchParams({ kind: "owned", trackCount: 400 }), {
    offset: 350,
    tracksOlderOffset: 300,
    useEdge: false
  });
});

test("resolveNewestFirstFetchParams uses offset 0 for liked songs", () => {
  assert.deepEqual(resolveNewestFirstFetchParams({ kind: "liked_songs", trackCount: 400 }), {
    offset: 0,
    tracksOlderOffset: null,
    useEdge: true
  });
});

test("resolveNewestFirstFetchParams uses offset 0 for SoundCloud likes", () => {
  assert.deepEqual(resolveNewestFirstFetchParams({ kind: "likes", trackCount: 400 }), {
    offset: 0,
    tracksOlderOffset: null,
    useEdge: false
  });
});

test("shouldRefetchNewestTailPage false for SoundCloud likes", () => {
  assert.equal(
    shouldRefetchNewestTailPage({
      kind: "likes",
      trackSortMode: "newest",
      initialOffset: 0,
      pageOffset: 0,
      collectionTotal: 120
    }),
    false
  );
});

test("shouldRefetchNewestTailPage false when server already returned tail page", () => {
  assert.equal(
    shouldRefetchNewestTailPage({
      kind: "likes",
      trackSortMode: "newest",
      initialOffset: 0,
      pageOffset: 100,
      collectionTotal: 120
    }),
    false
  );
});

test("shouldRefetchNewestTailPage false for owned playlists", () => {
  assert.equal(
    shouldRefetchNewestTailPage({
      kind: "owned",
      trackSortMode: "newest",
      initialOffset: 0,
      pageOffset: 0,
      collectionTotal: 120
    }),
    false
  );
});

test("getDisplayedPlaylistTracks sorts paginated first page by newest", () => {
  const browser = {
    tracks: pageOne,
    trackFilterQuery: "",
    trackSortMode: "newest",
    tracksNextOffset: 50
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["newest", "old2", "old1"]
  );
});

test("getDisplayedPlaylistTracks sorts paginated first page by oldest", () => {
  const browser = {
    tracks: pageOne,
    trackFilterQuery: "",
    trackSortMode: "oldest",
    tracksNextOffset: 50
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["old1", "old2", "newest"]
  );
});

test("isPlaylistOrderOnlyPlaylist matches Electronic and Electronics titles", () => {
  assert.equal(isPlaylistOrderOnlyPlaylist({ selectedTitle: "Electronic" }), true);
  assert.equal(isPlaylistOrderOnlyPlaylist({ selectedTitle: "electronics" }), true);
  assert.equal(isPlaylistOrderOnlyPlaylist({ selectedTitle: "Electronics" }), true);
  assert.equal(isPlaylistOrderOnlyPlaylist({ selectedTitle: "Electronic Mix" }), false);
  assert.equal(isPlaylistOrderOnlyPlaylist({ selectedTitle: "My Favorites" }), false);
});

const electronicFixture = [
  { id: "first", addedAt: "2024-06-03T00:00:00.000Z", playlistPosition: 0 },
  { id: "second", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 1 },
  { id: "third", addedAt: "2024-06-02T00:00:00.000Z", playlistPosition: 2 }
];

test("getDisplayedPlaylistTracks uses playlist order for Electronic playlist", () => {
  const browser = {
    selectedTitle: "Electronic",
    tracks: electronicFixture,
    trackFilterQuery: "",
    trackSortMode: "newest"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["third", "second", "first"]
  );
});

test("getDisplayedPlaylistTracks still sorts other playlists by addedAt", () => {
  const browser = {
    selectedTitle: "My Favorites",
    tracks: electronicFixture,
    trackFilterQuery: "",
    trackSortMode: "newest"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["first", "third", "second"]
  );
});

test("shouldUsePlaylistOrderSort is false for SoundCloud browser", () => {
  assert.equal(shouldUsePlaylistOrderSort({ playlistBrowseProvider: "soundcloud" }), false);
  assert.equal(shouldUsePlaylistOrderSort({ selectedTitle: "My Likes" }), false);
});

const soundcloudLikesNewestFirstFixture = [
  { id: "don1", addedAt: "2024-06-04T00:00:00.000Z", playlistPosition: 0 },
  { id: "don2", addedAt: "2024-06-03T00:00:00.000Z", playlistPosition: 1 },
  { id: "ralph", addedAt: "2024-06-02T00:00:00.000Z", playlistPosition: 2 },
  { id: "baby", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 3 }
];

test("getDisplayedPlaylistTracks preserves API order for SoundCloud likes in default mode", () => {
  const browser = {
    playlistBrowseProvider: "soundcloud",
    selectedPlaylistKind: "likes",
    tracks: soundcloudLikesNewestFirstFixture,
    trackFilterQuery: "",
    trackSortMode: "default"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["don1", "don2", "ralph", "baby"]
  );
});

test("getDisplayedPlaylistTracks sorts SoundCloud likes by addedAt newest", () => {
  const browser = {
    playlistBrowseProvider: "soundcloud",
    selectedPlaylistKind: "likes",
    tracks: soundcloudLikesNewestFirstFixture,
    trackFilterQuery: "",
    trackSortMode: "newest"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["don1", "don2", "ralph", "baby"]
  );
});

test("getDisplayedPlaylistTracks sorts SoundCloud likes by addedAt oldest", () => {
  const browser = {
    playlistBrowseProvider: "soundcloud",
    selectedPlaylistKind: "likes",
    tracks: soundcloudLikesNewestFirstFixture,
    trackFilterQuery: "",
    trackSortMode: "oldest"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["baby", "ralph", "don2", "don1"]
  );
});

const soundcloudOwnedFixture = [
  { id: "t100", addedAt: "2024-06-03T00:00:00.000Z", playlistPosition: 100 },
  { id: "t102", addedAt: "2024-06-02T00:00:00.000Z", playlistPosition: 102 },
  { id: "t101", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 101 }
];

test("getDisplayedPlaylistTracks preserves fetch order for SoundCloud owned playlists in default mode", () => {
  const browser = {
    playlistBrowseProvider: "soundcloud",
    selectedPlaylistKind: "owned",
    tracks: soundcloudOwnedFixture,
    trackFilterQuery: "",
    trackSortMode: "default"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["t100", "t102", "t101"]
  );
});

test("getDisplayedPlaylistTracks sorts SoundCloud owned playlists by addedAt oldest", () => {
  const browser = {
    playlistBrowseProvider: "soundcloud",
    selectedPlaylistKind: "owned",
    tracks: soundcloudOwnedFixture,
    trackFilterQuery: "",
    trackSortMode: "oldest"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["t101", "t102", "t100"]
  );
});

const soundcloudOrderVsDateFixture = [
  { id: "first", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 0 },
  { id: "second", addedAt: "2024-06-03T00:00:00.000Z", playlistPosition: 1 },
  { id: "third", addedAt: "2024-06-02T00:00:00.000Z", playlistPosition: 2 }
];

test("getDisplayedPlaylistTracks uses addedAt for SoundCloud newest not playlist order", () => {
  const browser = {
    playlistBrowseProvider: "soundcloud",
    selectedPlaylistKind: "owned",
    tracks: soundcloudOrderVsDateFixture,
    trackFilterQuery: "",
    trackSortMode: "newest"
  };
  assert.deepEqual(
    getDisplayedPlaylistTracks(browser).map((t) => t.id),
    ["second", "third", "first"]
  );
});
