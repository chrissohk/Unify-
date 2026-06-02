const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  issueToken,
  isValidToken,
  getTokenFromRequest,
  buildAllowedOrigins,
  createCorsMiddleware
} = require("../lib/browserSession");

test("browser session token issue and validate", () => {
  const token = issueToken();
  assert.ok(isValidToken(token));
  assert.equal(isValidToken("not-a-real-token"), false);
});

test("getTokenFromRequest reads header and cookie", () => {
  const token = issueToken();
  const fromHeader = getTokenFromRequest({
    get(name) {
      if (name === "x-browser-session") return token;
      return undefined;
    },
    headers: {}
  });
  assert.equal(fromHeader, token);

  const fromCookie = getTokenFromRequest({
    get() {
      return undefined;
    },
    headers: { cookie: `queue_browser_session=${encodeURIComponent(token)}` }
  });
  assert.equal(fromCookie, token);
});

test("CORS middleware allowlists origin", () => {
  const allowed = buildAllowedOrigins(3000);
  const middleware = createCorsMiddleware(allowed);
  const headers = {};
  const res = {
    setHeader(k, v) {
      headers[k] = v;
    },
    append() {},
    sendStatus() {}
  };
  middleware(
    {
      path: "/api/queue",
      method: "GET",
      headers: { origin: "http://127.0.0.1:3000" }
    },
    res,
    () => {}
  );
  assert.equal(headers["Access-Control-Allow-Origin"], "http://127.0.0.1:3000");
});
