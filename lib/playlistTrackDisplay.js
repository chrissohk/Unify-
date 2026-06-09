"use strict";

const { sortPlaylistTracks } = require("./sortPlaylistTracks.js");
const { filterPlaylistTracks } = require("./filterPlaylistTracks.js");

function normalizePlaylistTrackSortMode(mode) {
  return mode === "oldest" ? "oldest" : "newest";
}

function isSpotifyFollowedPlaylistSelection(browser) {
  return browser?.selectedPlaylistKind === "liked_playlist";
}

/**
 * True when date sort requires loading all paginated tracks before display is correct.
 * @param {object} browser
 * @param {"newest"|"oldest"|string} nextMode
 */
function playlistSortNeedsBulkFetch(browser, nextMode) {
  if (isSpotifyFollowedPlaylistSelection(browser)) return false;
  if (browser?.tracksNextOffset === null || browser?.tracksNextOffset === undefined) return false;
  const mode = normalizePlaylistTrackSortMode(nextMode);
  return mode === "oldest" || mode === "newest";
}

function getDisplayedPlaylistTracks(browser) {
  const filtered = filterPlaylistTracks(browser?.tracks, browser?.trackFilterQuery);
  const mode = normalizePlaylistTrackSortMode(browser?.trackSortMode);
  return sortPlaylistTracks(filtered, mode);
}

module.exports = {
  normalizePlaylistTrackSortMode,
  isSpotifyFollowedPlaylistSelection,
  playlistSortNeedsBulkFetch,
  getDisplayedPlaylistTracks
};
