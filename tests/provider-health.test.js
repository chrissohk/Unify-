const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");
const {
  resolveProviderHealth,
  defaultMessage,
  actionForCode
} = require("../lib/providerHealth");

beforeEach(async () => {
  await request(app).post("/api/test/reset").expect(204);
});

test("defaultMessage and actionForCode for refresh failures", () => {
  assert.match(defaultMessage("SPOTIFY_REFRESH_FAILED", "spotify"), /Spotify/i);
  assert.equal(actionForCode("SPOTIFY_REFRESH_FAILED"), "reconnect");
  assert.equal(actionForCode("SPOTIFY_REFRESH_MISSING"), "connect");
  assert.equal(actionForCode("SPOTIFY_RATE_LIMIT"), null);
});

test("resolveProviderHealth: disconnected when not connected", async () => {
  const r = await resolveProviderHealth(
    "spotify",
    { spotify: { connected: false, expiresAt: null } },
    { persist: () => {} }
  );
  assert.equal(r.health, "disconnected");
  assert.equal(r.code, null);
});

test("resolveProviderHealth: ok for simulated connect without refresh token", async () => {
  const r = await resolveProviderHealth(
    "spotify",
    { spotify: { connected: true, expiresAt: 9999999999 } },
    { persist: () => {} }
  );
  assert.equal(r.health, "ok");
});

test("resolveProviderHealth: degraded when refresh fails", async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });
  global.fetch = async () => ({
    ok: false,
    status: 400,
    text: async () => "invalid_grant"
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
      refreshToken: "bad-refresh",
      expiresAt: 0,
      accessToken: "stale"
    }
  };
  const r = await resolveProviderHealth("spotify", sessions, { persist: () => {} });
  assert.equal(r.health, "degraded");
  assert.equal(r.code, "SPOTIFY_REFRESH_FAILED");
  assert.equal(r.action, "reconnect");
});

test("resolveProviderHealth: ok when rate-limited refresh but access token remains", async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });
  global.fetch = async () => ({
    ok: false,
    status: 429,
    headers: { get: () => "60" },
    text: async () => "too many requests"
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
      accessToken: "cached-access"
    }
  };
  const r = await resolveProviderHealth("spotify", sessions, { persist: () => {} });
  assert.equal(r.health, "ok");
  assert.equal(r.action, null);
});

test("resolveProviderHealth: rate_limited without access token", async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });
  global.fetch = async () => ({
    ok: false,
    status: 429,
    headers: { get: () => "45" },
    text: async () => "too many requests"
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
      accessToken: null
    }
  };
  const r = await resolveProviderHealth("spotify", sessions, { persist: () => {} });
  assert.equal(r.health, "rate_limited");
  assert.equal(r.code, "SPOTIFY_RATE_LIMIT");
  assert.equal(r.action, null);
  assert.match(r.message, /rate-limited/i);
});

test("GET /api/providers includes health fields after simulated connect", async () => {
  await request(app).post("/api/auth/spotify/connect").expect(200);
  await request(app).post("/api/auth/soundcloud/connect").expect(200);
  const res = await request(app).get("/api/providers").expect(200);
  assert.ok(Array.isArray(res.body));
  const spotify = res.body.find((p) => p.provider === "spotify");
  assert.equal(spotify.connected, true);
  assert.equal(spotify.health, "ok");
  assert.equal(spotify.healthCode, null);
});
