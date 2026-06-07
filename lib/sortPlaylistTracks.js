"use strict";

function parseAddedAtEpoch(addedAt) {
  if (typeof addedAt !== "string" || !addedAt.trim()) return null;
  const ms = Date.parse(addedAt.trim());
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Client-side sort for playlist track rows by when they were added/liked.
 * @param {Array} tracks
 * @param {"default"|"newest"|"oldest"} mode
 */
function sortPlaylistTracks(tracks, mode) {
  const list = Array.isArray(tracks) ? tracks : [];
  if (mode !== "newest" && mode !== "oldest") return list;

  return list
    .map((track, index) => ({
      track,
      index,
      ts: parseAddedAtEpoch(track?.addedAt)
    }))
    .sort((a, b) => {
      const aHas = a.ts !== null;
      const bHas = b.ts !== null;
      if (!aHas && !bHas) return a.index - b.index;
      if (!aHas) return 1;
      if (!bHas) return -1;
      if (a.ts !== b.ts) {
        return mode === "newest" ? b.ts - a.ts : a.ts - b.ts;
      }
      return a.index - b.index;
    })
    .map(({ track }) => track);
}

module.exports = { sortPlaylistTracks, parseAddedAtEpoch };
