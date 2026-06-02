const test = require("node:test");
const assert = require("node:assert");
const {
  scenarioTokenRefreshExhausted,
  scenarioTokenRefreshRecovers,
  scenarioNotConnected,
  scenarioCapabilityDenied
} = require("../lib/orchestratorHarness");

test("harness: token refresh exhausted yields TOKEN_REFRESH_FAILED", () => {
  const r = scenarioTokenRefreshExhausted();
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.code, "TOKEN_REFRESH_FAILED");
});

test("harness: token refresh succeeds when simulated refresh does not random-fail", () => {
  const { result, sessions } = scenarioTokenRefreshRecovers();
  assert.strictEqual(result.ok, true);
  assert.ok(sessions.spotify.expiresAt > Math.floor(Date.now() / 1000));
});

test("harness: not connected yields PROVIDER_NOT_CONNECTED", () => {
  const r = scenarioNotConnected();
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.code, "PROVIDER_NOT_CONNECTED");
});

test("harness: missing capability yields CAPABILITY_NOT_SUPPORTED", () => {
  const r = scenarioCapabilityDenied();
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.code, "CAPABILITY_NOT_SUPPORTED");
});
