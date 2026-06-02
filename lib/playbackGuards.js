const nowSec = () => Math.floor(Date.now() / 1000);

const defaultRandomFail = (chance = 0.05) => {
  if (process.env.NODE_ENV === "test") {
    return false;
  }
  return Math.random() < chance;
};

/**
 * @param {string} provider
 * @param {Record<string, object>} sessions
 * @param {{ providers: object, randomFail?: (n: number) => boolean }} ctx
 */
function ensureConnected(provider, sessions, ctx) {
  const randomFail = ctx.randomFail || defaultRandomFail;
  const session = sessions[provider];
  if (!session || !session.connected) {
    return { ok: false, code: "PROVIDER_NOT_CONNECTED", message: `${provider} is not connected` };
  }
  if (session.refreshToken) {
    return { ok: true };
  }
  if (session.expiresAt && session.expiresAt <= nowSec()) {
    for (let i = 0; i < 2; i += 1) {
      if (!randomFail(0.2)) {
        session.expiresAt = nowSec() + 3600;
        session.refreshFailures = 0;
        return { ok: true };
      }
      session.refreshFailures += 1;
    }
    return { ok: false, code: "TOKEN_REFRESH_FAILED", message: `Reconnect ${provider} account` };
  }
  return { ok: true };
}

function ensureCapability(provider, capability, providers) {
  const spec = providers[provider];
  if (!spec) {
    return { ok: false, code: "PROVIDER_UNKNOWN", message: `${provider} provider is unknown` };
  }
  if (!spec.capabilities[capability]) {
    return {
      ok: false,
      code: "CAPABILITY_NOT_SUPPORTED",
      message: `${provider} does not support ${capability}`
    };
  }
  return { ok: true };
}

module.exports = {
  nowSec,
  randomFail: defaultRandomFail,
  ensureConnected,
  ensureCapability
};
