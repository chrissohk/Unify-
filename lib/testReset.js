/**
 * Whether POST /api/test/reset is allowed. Locked down outside automated test runs.
 */

function isTestResetAllowed(req, env = process.env) {
  if (env.NODE_ENV === "test") {
    return true;
  }
  const secret = env.TEST_RESET_SECRET;
  if (secret && req.get && req.get("x-test-reset-secret") === secret) {
    return true;
  }
  return false;
}

module.exports = { isTestResetAllowed };
