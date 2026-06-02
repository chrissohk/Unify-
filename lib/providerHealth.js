const { getSpotifyAccessToken } = require("./spotifyWebApi");
const { getSoundCloudAccessToken } = require("./soundcloudWebApi");
const { rateLimitUserMessage } = require("./rateLimitBackoff");

const RECONNECT_CODES = new Set([
  "SPOTIFY_REFRESH_FAILED",
  "SOUNDCLOUD_REFRESH_FAILED",
  "SPOTIFY_TOKEN_UNAVAILABLE",
  "SOUNDCLOUD_TOKEN_UNAVAILABLE"
]);

const CONNECT_CODES = new Set([
  "SPOTIFY_REFRESH_MISSING",
  "SOUNDCLOUD_REFRESH_MISSING",
  "TOKEN_REFRESH_FAILED"
]);

function defaultMessage(code, provider) {
  const label = provider === "spotify" ? "Spotify" : provider === "soundcloud" ? "SoundCloud" : provider;
  if (code === "SPOTIFY_REFRESH_MISSING" || code === "SOUNDCLOUD_REFRESH_MISSING") {
    return `${label} is in demo mode. Use Connect (OAuth) for your real library.`;
  }
  if (code === "TOKEN_REFRESH_FAILED") {
    return `${label} session expired. Reconnect your account.`;
  }
  if (code === "SPOTIFY_OAUTH_CONFIG_MISSING" || code === "SOUNDCLOUD_OAUTH_CONFIG_MISSING") {
    return `${label} OAuth is not configured on this server. Check .env and restart.`;
  }
  if (code === "SPOTIFY_RATE_LIMIT" || code === "SOUNDCLOUD_RATE_LIMIT") {
    return rateLimitUserMessage(provider, 60);
  }
  if (code === "SPOTIFY_REFRESH_FAILED" || code === "SOUNDCLOUD_REFRESH_FAILED") {
    return `${label} session expired. Reconnect to continue.`;
  }
  return `${label} authorization is unavailable. Reconnect to continue.`;
}

function actionForCode(code) {
  if (!code) return null;
  if (CONNECT_CODES.has(code)) return "connect";
  if (code === "SPOTIFY_OAUTH_CONFIG_MISSING" || code === "SOUNDCLOUD_OAUTH_CONFIG_MISSING") {
    return null;
  }
  if (code === "SPOTIFY_RATE_LIMIT" || code === "SOUNDCLOUD_RATE_LIMIT") {
    return null;
  }
  if (
    code.includes("REFRESH_FAILED") ||
    code.includes("TOKEN_UNAVAILABLE") ||
    RECONNECT_CODES.has(code)
  ) {
    return "reconnect";
  }
  return "reconnect";
}

/**
 * @param {"spotify"|"soundcloud"} provider
 * @param {Record<string, object>} sessions
 * @param {{ persist: () => void }} ctx
 */
async function resolveProviderHealth(provider, sessions, ctx) {
  const session = sessions[provider];
  if (!session || !session.connected) {
    return { health: "disconnected", code: null, message: null, action: null };
  }

  if (!session.refreshToken) {
    return { health: "ok", code: null, message: null, action: null };
  }

  const tokenResult =
    provider === "spotify"
      ? await getSpotifyAccessToken({ sessions, persist: ctx.persist })
      : await getSoundCloudAccessToken({ sessions, persist: ctx.persist });

  if (tokenResult.ok) {
    return { health: "ok", code: null, message: null, action: null };
  }

  const code = tokenResult.code || `${provider.toUpperCase()}_TOKEN_UNAVAILABLE`;
  const retryAfterSec = tokenResult.retryAfterSec || null;
  const isRateLimit = code === "SPOTIFY_RATE_LIMIT" || code === "SOUNDCLOUD_RATE_LIMIT";
  return {
    health: isRateLimit ? "rate_limited" : "degraded",
    code,
    message:
      tokenResult.message ||
      (isRateLimit ? rateLimitUserMessage(provider, retryAfterSec || 60) : defaultMessage(code, provider)),
    action: actionForCode(code),
    retryAfterSec
  };
}

module.exports = {
  resolveProviderHealth,
  defaultMessage,
  actionForCode
};
