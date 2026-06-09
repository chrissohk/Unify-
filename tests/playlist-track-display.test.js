"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  playlistSortNeedsBulkFetch,
  getDisplayedPlaylistTracks,
  isSpotifyFollowedPlaylistSelection
} = require("../lib/playlistTrackDisplay.js");

const pageOne = [
  { id: "old1", addedAt: "2020-01-01T00:00:00.000Z" },
  { id: "old2", addedAt: "2020-06-01T00:00:00.000Z" },
  { id: "newest", addedAt: "2024-06-01T00:00:00.000Z" }
];

test("playlistSortNeedsBulkFetch returns true for newest when paginated owned playlist", () => {
  const browser = {
    selectedPlaylistKind: "owned",
    tracksNextOffset: 50
  };
  assert.equal(playlistSortNeedsBulkFetch(browser, "newest"), true);
  assert.equal(playlistSortNeedsBulkFetch(browser, "oldest"), true);
});

test("playlistSortNeedsBulkFetch returns false when all tracks loaded", () => {
  const browser = {
    selectedPlaylistKind: "owned",
    tracksNextOffset: null
  };
  assert.equal(playlistSortNeedsBulkFetch(browser, "newest"), false);
});

test("playlistSortNeedsBulkFetch returns false for followed Spotify playlists", () => {
  const browser = {
    selectedPlaylistKind: "liked_playlist",
    tracksNextOffset: 50
  };
  assert.equal(isSpotifyFollowedPlaylistSelection(browser), true);
  assert.equal(playlistSortNeedsBulkFetch(browser, "newest"), false);
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
