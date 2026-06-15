"use strict";

/**
 * Client-side sort for playlist track rows by when they were added/liked.
 * Keep in sync with lib/sortPlaylistTracks.js.
 */
function parseAddedAtEpoch(addedAt) {
  if (typeof addedAt !== "string" || !addedAt.trim()) return null;
  const ms = Date.parse(addedAt.trim());
  return Number.isFinite(ms) ? ms : null;
}

function playlistPositionOrIndex(track, fallbackIndex) {
  const pos = track?.playlistPosition;
  return typeof pos === "number" && Number.isFinite(pos) ? pos : fallbackIndex;
}

function compareByPlaylistPosition(a, b, mode) {
  const aPos = playlistPositionOrIndex(a.track, a.index);
  const bPos = playlistPositionOrIndex(b.track, b.index);
  return mode === "newest" ? bPos - aPos : aPos - bPos;
}

function compareByPlaylistPositionForCollectionOrder(a, b, mode, collectionOrder) {
  const aPos = playlistPositionOrIndex(a.track, a.index);
  const bPos = playlistPositionOrIndex(b.track, b.index);
  const newestFirst = collectionOrder === "newest-first";
  if (mode === "newest") {
    return newestFirst ? aPos - bPos : bPos - aPos;
  }
  return newestFirst ? bPos - aPos : aPos - bPos;
}

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
      if (!aHas && !bHas) return compareByPlaylistPosition(a, b, mode);
      if (!aHas) return 1;
      if (!bHas) return -1;
      if (a.ts !== b.ts) {
        return mode === "newest" ? b.ts - a.ts : a.ts - b.ts;
      }
      return compareByPlaylistPosition(a, b, mode);
    })
    .map(({ track }) => track);
}

function sortPlaylistTracksByPlaylistOrder(tracks, mode) {
  const list = Array.isArray(tracks) ? tracks : [];
  if (mode !== "newest" && mode !== "oldest") return list;

  return list
    .map((track, index) => ({ track, index }))
    .sort((a, b) => compareByPlaylistPosition(a, b, mode))
    .map(({ track }) => track);
}

function sortPlaylistTracksByCollectionOrder(tracks, mode, collectionOrder) {
  const list = Array.isArray(tracks) ? tracks : [];
  if (mode !== "newest" && mode !== "oldest") return list;
  const order = collectionOrder === "newest-first" ? "newest-first" : "oldest-first";

  return list
    .map((track, index) => ({ track, index }))
    .sort((a, b) => compareByPlaylistPositionForCollectionOrder(a, b, mode, order))
    .map(({ track }) => track);
}

function sortTracksByCreatedAt(tracks, mode) {
  const list = Array.isArray(tracks) ? tracks.slice() : [];
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
      if (!aHas && !bHas) return compareByPlaylistPosition(a, b, mode);
      if (!aHas) return 1;
      if (!bHas) return -1;
      if (a.ts !== b.ts) {
        return mode === "newest" ? b.ts - a.ts : a.ts - b.ts;
      }
      return compareByPlaylistPosition(a, b, mode);
    })
    .map(({ track }) => track);
}

const api = {
  sortPlaylistTracks,
  sortPlaylistTracksByPlaylistOrder,
  sortPlaylistTracksByCollectionOrder,
  sortTracksByCreatedAt,
  parseAddedAtEpoch,
  playlistPositionOrIndex
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.SortPlaylistTracks = api;
}
