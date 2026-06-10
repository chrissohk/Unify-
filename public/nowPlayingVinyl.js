"use strict";

/**
 * Whether the now-playing vinyl hero should spin for the current queue item.
 */

function isNowPlayingActivelyPlaying(item, ctx = {}) {
  if (!item) return false;
  if (item.provider === "spotify") {
    if (ctx.spotifyPausedByUser || ctx.spotifyReloadNeedsUserResume) return false;
    return !Boolean(ctx.spotifyPlaybackState?.paused);
  }
  if (item.provider === "soundcloud") {
    return !Boolean(ctx.soundcloudPlaybackState?.paused);
  }
  return false;
}

const api = { isNowPlayingActivelyPlaying };

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.NowPlayingVinyl = api;
}
