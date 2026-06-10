"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  playlistSortNeedsBulkFetch,
  getDisplayedPlaylistTracks,
  isSpotifyFollowedPlaylistSelection,
  computeTailPageOffset,
  computeTracksOlderOffset,
  resolveNewestFirstFetchParams
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
