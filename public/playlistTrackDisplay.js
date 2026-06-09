"use strict";

/**
 * Playlist track display helpers (sort mode, bulk-fetch gate, displayed list).
 * Keep in sync with lib/playlistTrackDisplay.js.
 */

function normalizePlaylistTrackSortMode(mode) {
  return mode === "oldest" ? "oldest" : "newest";
}

function isSpotifyFollowedPlaylistSelection(browser) {
  return browser?.selectedPlaylistKind === "liked_playlist";
}

function playlistSortNeedsBulkFetch(browser, nextMode) {
  if (isSpotifyFollowedPlaylistSelection(browser)) return false;
  if (browser?.tracksNextOffset === null || browser?.tracksNextOffset === undefined) return false;
  const mode = normalizePlaylistTrackSortMode(nextMode);
  return mode === "oldest" || mode === "newest";
}

function getDisplayedPlaylistTracks(browser) {
  const filterFn = window.FilterPlaylistTracks?.filterPlaylistTracks;
  const sortFn = window.SortPlaylistTracks?.sortPlaylistTracks;
  const tracks = Array.isArray(browser?.tracks) ? browser.tracks : [];
  const filtered = filterFn ? filterFn(tracks, browser?.trackFilterQuery) : tracks;
  const mode = normalizePlaylistTrackSortMode(browser?.trackSortMode);
  return sortFn ? sortFn(filtered, mode) : filtered;
}

const api = {
  normalizePlaylistTrackSortMode,
  isSpotifyFollowedPlaylistSelection,
  playlistSortNeedsBulkFetch,
  getDisplayedPlaylistTracks
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.PlaylistTrackDisplay = api;
}
