const crypto = require("crypto");

const COOKIE_NAME = "queue_browser_session";
const HEADER_NAME = "x-browser-session";
const SESSION_MAX_AGE_SEC = 24 * 60 * 60;

/** In-memory browser session tokens (issued via GET /api/meta). */
const activeSessions = new Set();

function issueToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  activeSessions.add(token);
  return token;
}

function isValidToken(token) {
  return typeof token === "string" && token.length >= 32 && activeSessions.has(token);
}

function parseCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const segment of raw.split(";")) {
    const idx = segment.indexOf("=");
    if (idx === -1) continue;
    const key = segment.slice(0, idx).trim();
    if (key !== name) continue;
    return decodeURIComponent(segment.slice(idx + 1).trim());
  }
  return null;
}

function getTokenFromRequest(req) {
  const header = req.get(HEADER_NAME);
  if (header && String(header).trim()) return String(header).trim();
  return parseCookie(req, COOKIE_NAME);
}

function isExemptApiPath(path) {
  if (path.startsWith("/api/oauth/")) return true;
  if (path === "/api/meta") return true;
  if (path === "/api/test/reset") return true;
  return false;
}

function requireBrowserSession(req, res, next) {
  if (process.env.NODE_ENV === "test") return next();
  if (!req.path.startsWith("/api")) return next();
  if (req.method === "OPTIONS") return next();
  if (isExemptApiPath(req.path)) return next();

  const token = getTokenFromRequest(req);
  if (isValidToken(token)) return next();

  return res.status(403).json({
    error: "browser session required; open the app from the server URL first",
    code: "BROWSER_SESSION_REQUIRED"
  });
}

function attachMetaSession(req, res) {
  const token = issueToken();
  const secure =
    Boolean(req.secure) ||
    (process.env.PUBLIC_BASE_URL && String(process.env.PUBLIC_BASE_URL).startsWith("https://"));
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${SESSION_MAX_AGE_SEC}`
  ];
  if (secure) parts.push("Secure");
  res.append("Set-Cookie", parts.join("; "));
  return token;
}

function buildAllowedOrigins(port) {
  const set = new Set([
    `http://127.0.0.1:${port}`,
    `http://localhost:${port}`
  ]);
  if (process.env.PUBLIC_BASE_URL) {
    try {
      set.add(new URL(process.env.PUBLIC_BASE_URL).origin);
    } catch {
      /* ignore */
    }
  }
  const extra = process.env.CORS_ALLOWED_ORIGINS || "";
  for (const piece of extra.split(",")) {
    const trimmed = piece.trim();
    if (!trimmed) continue;
    try {
      set.add(new URL(trimmed).origin);
    } catch {
      /* ignore */
    }
  }
  return set;
}

function createCorsMiddleware(allowedOrigins) {
  return (req, res, next) => {
    if (!req.path.startsWith("/api")) return next();

    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Vary", "Origin");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, X-Test-Reset-Secret, X-Browser-Session"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  };
}

module.exports = {
  COOKIE_NAME,
  HEADER_NAME,
  issueToken,
  isValidToken,
  getTokenFromRequest,
  requireBrowserSession,
  attachMetaSession,
  buildAllowedOrigins,
  createCorsMiddleware
};
