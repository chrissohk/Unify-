const { test } = require("node:test");
const assert = require("node:assert/strict");
const { isTestResetAllowed } = require("../lib/testReset");

test("allows reset when NODE_ENV is test", () => {
  const req = { get: () => undefined };
  assert.equal(isTestResetAllowed(req, { NODE_ENV: "test" }), true);
});

test("denies reset in production without secret match", () => {
  const req = { get: () => undefined };
  assert.equal(isTestResetAllowed(req, { NODE_ENV: "production" }), false);
});

test("allows reset with matching X-Test-Reset-Secret", () => {
  const req = { get: (h) => (h === "x-test-reset-secret" ? "mysecret" : undefined) };
  assert.equal(
    isTestResetAllowed(req, { NODE_ENV: "production", TEST_RESET_SECRET: "mysecret" }),
    true
  );
});
