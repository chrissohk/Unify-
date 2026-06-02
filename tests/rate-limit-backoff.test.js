const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseRetryAfterSeconds, isProviderRateLimited, rateLimitUserMessage } = require("../lib/rateLimitBackoff");
const { nowSec } = require("../lib/playbackGuards");
const { getSpotifyAccessToken } = require("../lib/spotifyWebApi");

test("parseRetryAfterSeconds handles delay-seconds and dates", () => {
  assert.equal(parseRetryAfterSeconds("30"), 30);
  assert.equal(parseRetryAfterSeconds(null), 60);
  const future = new Date(Date.now() + 45_000).toUTCString();
  const parsed = parseRetryAfterSeconds(future);
  assert.ok(parsed >= 40 && parsed <= 50);
});

test("isProviderRateLimited respects rateLimitUntil", () => {
  assert.equal(isProviderRateLimited({ rateLimitUntil: nowSec() + 30 }), true);
  assert.equal(isProviderRateLimited({ rateLimitUntil: nowSec() - 1 }), false);
});

test("rateLimitUserMessage does not mention reconnect", () => {
  const msg = rateLimitUserMessage("spotify", 90);
  assert.match(msg, /Spotify/i);
  assert.match(msg, /do not need to reconnect/i);
});

test("getSpotifyAccessToken returns cached token when refresh hits 429", async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });
  global.fetch = async () => ({
    ok: false,
    status: 429,
    headers: { get: () => "120" },
    text: async () => "rate limited"
  });

  const prevId = process.env.SPOTIFY_CLIENT_ID;
  const prevSecret = process.env.SPOTIFY_CLIENT_SECRET;
  process.env.SPOTIFY_CLIENT_ID = "test-client";
  process.env.SPOTIFY_CLIENT_SECRET = "test-secret";
  t.after(() => {
    if (prevId === undefined) delete process.env.SPOTIFY_CLIENT_ID;
    else process.env.SPOTIFY_CLIENT_ID = prevId;
    if (prevSecret === undefined) delete process.env.SPOTIFY_CLIENT_SECRET;
    else process.env.SPOTIFY_CLIENT_SECRET = prevSecret;
  });

  const sessions = {
    spotify: {
      connected: true,
      refreshToken: "rt",
      expiresAt: 0,
      accessToken: "still-valid-for-playback"
    }
  };
  const result = await getSpotifyAccessToken({ sessions, persist: () => {} });
  assert.equal(result.ok, true);
  assert.equal(result.accessToken, "still-valid-for-playback");
  assert.ok(sessions.spotify.rateLimitUntil > nowSec());
});
