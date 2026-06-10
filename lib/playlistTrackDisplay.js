"use strict";

const { sortPlaylistTracks } = require("./sortPlaylistTracks.js");
const { filterPlaylistTracks } = require("./filterPlaylistTracks.js");

function normalizePlaylistTrackSortMode(mode) {
  return mode === "oldest" ? "oldest" : "newest";
}

function isSpotifyFollowedPlaylistSelection(browser) {
  return browser?.selectedPlaylistKind === "liked_playlist";
}

function isSpotifyLikedSongsSelection(browser) {
  return browser?.selectedPlaylistKind === "liked_songs";
}

function computeTailPageOffset(total, limit = 50) {
  const safeTotal = Math.max(Number(total) || 0, 0);
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  if (safeTotal <= safeLimit) return 0;
  return Math.floor((safeTotal - 1) / safeLimit) * safeLimit;
}

function computeTracksOlderOffset(pageOffset, limit = 50) {
  const safeOffset = Math.max(Number(pageOffset) || 0, 0);
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  if (safeOffset <= 0) return null;
  return Math.max(safeOffset - safeLimit, 0);
}

/**
 * True when likes opened without track count but tracks response exposes total_count.
 */
function shouldRefetchNewestTailPage({
  kind,
  trackSortMode,
  initialOffset,
  pageOffset,
  collectionTotal,
  limit = 50
}) {
  if (kind !== "likes" || normalizePlaylistTrackSortMode(trackSortMode) !== "newest") {
    return false;
  }
  if (initialOffset !== 0 || (typeof pageOffset === "number" && pageOffset > 0)) {
    return false;
  }
  const total = typeof collectionTotal === "number" ? collectionTotal : null;
  if (total === null || total <= limit) return false;
  return computeTailPageOffset(total, limit) > 0;
}

function resolveNewestFirstFetchParams({ kind, trackCount, limit = 50 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  if (kind === "liked_songs") {
    return { offset: 0, tracksOlderOffset: null, useEdge: true };
  }
  const total = typeof trackCount === "number" ? trackCount : null;
  if (total === null) {
    return { offset: 0, tracksOlderOffset: null, useEdge: true };
  }
  const offset = computeTailPageOffset(total, safeLimit);
  return {
    offset,
    tracksOlderOffset: computeTracksOlderOffset(offset, safeLimit),
    useEdge: false
  };
}

/**
 * True when switching to oldest requires loading the full playlist.
 * @param {object} browser
 * @param {"newest"|"oldest"|string} nextMode
 */
function playlistSortNeedsBulkFetch(browser, nextMode) {
  if (isSpotifyFollowedPlaylistSelection(browser)) return false;
  if (normalizePlaylistTrackSortMode(nextMode) !== "oldest") return false;
  return browser?.tracksLoadDirection !== "full";
}

function getDisplayedPlaylistTracks(browser) {
  const filtered = filterPlaylistTracks(browser?.tracks, browser?.trackFilterQuery);
  const mode = normalizePlaylistTrackSortMode(browser?.trackSortMode);
  return sortPlaylistTracks(filtered, mode);
}

module.exports = {
  normalizePlaylistTrackSortMode,
  isSpotifyFollowedPlaylistSelection,
  isSpotifyLikedSongsSelection,
  computeTailPageOffset,
  computeTracksOlderOffset,
  resolveNewestFirstFetchParams,
  shouldRefetchNewestTailPage,
  playlistSortNeedsBulkFetch,
  getDisplayedPlaylistTracks
};
