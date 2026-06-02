const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  sanitizeSessionsForPersist,
  applyLoadedSessions
} = require("../lib/sessionPersist");

test("sanitizeSessionsForPersist strips OAuth secrets", () => {
  const sessions = {
    spotify: {
      connected: true,
      accessToken: "at",
      refreshToken: "rt",
      authMode: "oauth"
    }
  };
  const out = sanitizeSessionsForPersist(sessions);
  assert.equal(out.spotify.connected, true);
  assert.equal(out.spotify.authMode, "oauth");
  assert.equal(out.spotify.accessToken, undefined);
  assert.equal(out.spotify.refreshToken, undefined);
});

test("applyLoadedSessions clears stale OAuth connected state without tokens", () => {
  const target = {
    spotify: { connected: false, expiresAt: null, refreshFailures: 0 },
    soundcloud: { connected: false, expiresAt: null, refreshFailures: 0 }
  };
  applyLoadedSessions(target, {
    spotify: { connected: true, expiresAt: 9999999999, authMode: "oauth" },
    soundcloud: { connected: true, expiresAt: 9999999999, authMode: "simulated" }
  });
  assert.equal(target.spotify.connected, false);
  assert.equal(target.soundcloud.connected, true);
});
