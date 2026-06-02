const { nowSec } = require("./playbackGuards");

const DEFAULT_BACKOFF_SEC = 60;

function parseRetryAfterSeconds(headerValue) {
  if (headerValue == null || headerValue === "") {
    return DEFAULT_BACKOFF_SEC;
  }
  const raw = String(headerValue).trim();
  const asNum = Number(raw);
  if (Number.isFinite(asNum) && asNum >= 0) {
    return Math.min(Math.ceil(asNum), 3600);
  }
  const date = Date.parse(raw);
  if (Number.isFinite(date)) {
    return Math.min(Math.max(1, Math.ceil((date - Date.now()) / 1000)), 3600);
  }
  return DEFAULT_BACKOFF_SEC;
}

function isProviderRateLimited(session) {
  return Number(session?.rateLimitUntil || 0) > nowSec();
}

function secondsUntilRateLimitClear(session) {
  return Math.max(0, Number(session?.rateLimitUntil || 0) - nowSec());
}

/**
 * @param {object} session - provider session object (mutated)
 * @param {string|null|undefined} retryAfterHeader - Retry-After header value
 * @param {() => void} [persist]
 */
function applyRateLimitToSession(session, retryAfterHeader, persist) {
  const sec = parseRetryAfterSeconds(retryAfterHeader);
  session.rateLimitUntil = nowSec() + sec;
  if (typeof persist === "function") {
    persist();
  }
  return sec;
}

function rateLimitUserMessage(provider, retryAfterSec) {
  const label = provider === "spotify" ? "Spotify" : provider === "soundcloud" ? "SoundCloud" : provider;
  const sec = Math.max(1, Number(retryAfterSec) || DEFAULT_BACKOFF_SEC);
  const wait =
    sec >= 120 ? `${Math.ceil(sec / 60)} minutes` : sec === 1 ? "a moment" : `${sec} seconds`;
  return `${label} is rate-limited. Wait ${wait}, then try again — you do not need to reconnect.`;
}

module.exports = {
  DEFAULT_BACKOFF_SEC,
  parseRetryAfterSeconds,
  isProviderRateLimited,
  secondsUntilRateLimitClear,
  applyRateLimitToSession,
  rateLimitUserMessage
};
