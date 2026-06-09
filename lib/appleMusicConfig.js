const fs = require("fs");

function readPrivateKey() {
  if (process.env.APPLE_PRIVATE_KEY) {
    return String(process.env.APPLE_PRIVATE_KEY).replace(/\\n/g, "\n");
  }
  const keyPath = process.env.APPLE_PRIVATE_KEY_PATH;
  if (!keyPath) return null;
  try {
    return fs.readFileSync(keyPath, "utf8");
  } catch {
    return null;
  }
}

function isAppleMusicConfigured() {
  return Boolean(
    process.env.APPLE_TEAM_ID &&
      process.env.APPLE_KEY_ID &&
      readPrivateKey()
  );
}

function appleMusicSetupHint() {
  return "Add APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_PATH (or APPLE_PRIVATE_KEY) to .env, then restart the server.";
}

module.exports = {
  isAppleMusicConfigured,
  appleMusicSetupHint,
  readPrivateKey
};
