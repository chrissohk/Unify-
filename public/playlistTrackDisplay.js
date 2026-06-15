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

function isSpotifyLikedSongsSelection(browser) {
  return browser?.selectedPlaylistKind === "liked_songs";
}

function isPlaylistOrderOnlyPlaylist(browser) {
  const title = String(browser?.selectedTitle || "").trim();
  return /^electronics?$/i.test(title);
}

function isSoundCloudLikesSelection(browser) {
  return (
    browser?.playlistBrowseProvider === "soundcloud" && browser?.selectedPlaylistKind === "likes"
  );
}

function getSoundCloudCollectionOrder(kind) {
  return kind === "likes" ? "newest-first" : "oldest-first";
}

function shouldUsePlaylistOrderSort(browser) {
  if (browser?.playlistBrowseProvider === "soundcloud") return true;
  return isPlaylistOrderOnlyPlaylist(browser);
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

function shouldRefetchNewestTailPage() {
  return false;
}

function resolveNewestFirstFetchParams({ kind, trackCount, limit = 50 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  if (kind === "liked_songs") {
    return { offset: 0, tracksOlderOffset: null, useEdge: true };
  }
  if (kind === "likes") {
    return { offset: 0, tracksOlderOffset: null, useEdge: false };
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

function playlistSortNeedsBulkFetch(browser, nextMode) {
  if (isSpotifyFollowedPlaylistSelection(browser)) return false;
  if (normalizePlaylistTrackSortMode(nextMode) !== "oldest") return false;
  return browser?.tracksLoadDirection !== "full";
}

function getDisplayedPlaylistTracks(browser) {
  const filterFn = window.FilterPlaylistTracks?.filterPlaylistTracks;
  const sortApi = window.SortPlaylistTracks;
  const tracks = Array.isArray(browser?.tracks) ? browser.tracks : [];
  const filtered = filterFn ? filterFn(tracks, browser?.trackFilterQuery) : tracks;
  const mode = normalizePlaylistTrackSortMode(browser?.trackSortMode);
  if (shouldUsePlaylistOrderSort(browser)) {
    if (browser?.playlistBrowseProvider === "soundcloud") {
      const collectionOrder = getSoundCloudCollectionOrder(browser?.selectedPlaylistKind);
      return sortApi?.sortPlaylistTracksByCollectionOrder
        ? sortApi.sortPlaylistTracksByCollectionOrder(filtered, mode, collectionOrder)
        : filtered;
    }
    return sortApi?.sortPlaylistTracksByPlaylistOrder
      ? sortApi.sortPlaylistTracksByPlaylistOrder(filtered, mode)
      : filtered;
  }
  return sortApi?.sortPlaylistTracks ? sortApi.sortPlaylistTracks(filtered, mode) : filtered;
}

const api = {
  normalizePlaylistTrackSortMode,
  isSpotifyFollowedPlaylistSelection,
  isSpotifyLikedSongsSelection,
  isPlaylistOrderOnlyPlaylist,
  isSoundCloudLikesSelection,
  getSoundCloudCollectionOrder,
  shouldUsePlaylistOrderSort,
  computeTailPageOffset,
  computeTracksOlderOffset,
  resolveNewestFirstFetchParams,
  shouldRefetchNewestTailPage,
  playlistSortNeedsBulkFetch,
  getDisplayedPlaylistTracks
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.PlaylistTrackDisplay = api;
}
