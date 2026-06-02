/**
 * Deterministic replay helpers for orchestrator-related guard logic (token refresh,
 * capability checks). Used by tests; wire into broader simulation tooling later.
 */
const { ensureConnected, ensureCapability, nowSec } = require("./playbackGuards");

function scenarioTokenRefreshExhausted() {
  const sessions = {
    spotify: { connected: true, expiresAt: nowSec() - 1, refreshFailures: 0 }
  };
  const alwaysFailRandom = () => true;
  return ensureConnected("spotify", sessions, { randomFail: alwaysFailRandom });
}

function scenarioTokenRefreshRecovers() {
  const sessions = {
    spotify: { connected: true, expiresAt: nowSec() - 1, refreshFailures: 0 }
  };
  const neverFailRandom = () => false;
  const result = ensureConnected("spotify", sessions, { randomFail: neverFailRandom });
  return { result, sessions };
}

function scenarioNotConnected() {
  const sessions = {
    spotify: { connected: false, expiresAt: null, refreshFailures: 0 }
  };
  return ensureConnected("spotify", sessions, {});
}

function scenarioCapabilityDenied() {
  const stub = {
    spotify: {
      capabilities: { search: false, libraryAccess: false, playbackControl: false }
    }
  };
  return ensureCapability("spotify", "search", stub);
}

module.exports = {
  scenarioTokenRefreshExhausted,
  scenarioTokenRefreshRecovers,
  scenarioNotConnected,
  scenarioCapabilityDenied
};
