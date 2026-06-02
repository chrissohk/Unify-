"use strict";

/**
 * Client-side filter for playlist track rows (title or artist substring match).
 * Keep in sync with lib/filterPlaylistTracks.js.
 */
function filterPlaylistTracks(tracks, query) {
  const list = Array.isArray(tracks) ? tracks : [];
  const q = String(query || "").trim().toLowerCase();
  if (!q) return list;
  return list.filter((t) => {
    const title = String(t?.title || t?.name || "").toLowerCase();
    const artist = String(t?.artist || "").toLowerCase();
    return title.includes(q) || artist.includes(q);
  });
}

const api = { filterPlaylistTracks };

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.FilterPlaylistTracks = api;
}
