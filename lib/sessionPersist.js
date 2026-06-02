/**
 * Strip OAuth secrets before writing SQLite; reconcile OAuth sessions after load.
 */

function sanitizeSessionsForPersist(sessions) {
  const out = {};
  for (const [key, session] of Object.entries(sessions)) {
    if (!session || typeof session !== "object") continue;
    const { accessToken, refreshToken, ...rest } = session;
    out[key] = rest;
  }
  return out;
}

function applyLoadedSessions(target, loaded) {
  if (!loaded || typeof loaded !== "object") return;
  for (const key of Object.keys(target)) {
    if (!loaded[key] || typeof loaded[key] !== "object") continue;
    const { accessToken, refreshToken, ...rest } = loaded[key];
    target[key] = { ...target[key], ...rest };
    if (target[key].authMode === "oauth") {
      target[key].connected = false;
      target[key].expiresAt = null;
      delete target[key].userId;
      delete target[key].displayName;
    }
  }
}

module.exports = { sanitizeSessionsForPersist, applyLoadedSessions };
