const crypto = require("crypto");
const express = require("express");
const { nowSec } = require("./playbackGuards");
const { isAppleMusicConfigured, appleMusicSetupHint } = require("./appleMusicConfig");

const pendingOAuthState = { spotify: null, soundcloud: null };

const SOUNDCLOUD_AUTHORIZE_URL = "https://secure.soundcloud.com/authorize";
const SOUNDCLOUD_TOKEN_URL = "https://secure.soundcloud.com/oauth/token";

function generatePkcePair() {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
  return { codeVerifier, codeChallenge };
}

/**
 * Optional Spotify / SoundCloud OAuth2 routes when client credentials are set.
 * SoundCloud uses OAuth 2.1 + PKCE (secure.soundcloud.com authorize + token).
 * Simulated POST /api/auth/:provider/connect remains the default for local MVP.
 */
function mountOAuthRoutes(app, { sessions, persist, getPublicBaseUrl }) {
  const router = express.Router();

  router.get("/spotify/login", (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const base = getPublicBaseUrl(req);
    const redirectUri =
      process.env.SPOTIFY_REDIRECT_URI || `${base}/api/oauth/spotify/callback`;
    if (!clientId) {
      return res.status(503).json({
        error:
          "OAuth not configured: set SPOTIFY_CLIENT_ID (and SPOTIFY_CLIENT_SECRET for callback). Use Connect in the UI for simulated sessions.",
        code: "OAUTH_NOT_CONFIGURED"
      });
    }
    const scope =
      process.env.SPOTIFY_SCOPES ||
      "streaming user-modify-playback-state user-read-email user-read-private user-library-read playlist-read-private playlist-read-collaborative";
    const state = crypto.randomBytes(16).toString("hex");
    pendingOAuthState.spotify = state;
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state
    });
    if (req.query.reconnect === "1") {
      params.set("show_dialog", "true");
    }
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
  });

  router.get("/spotify/callback", async (req, res) => {
    const code = req.query.code;
    const err = req.query.error;
    const state = req.query.state;
    if (state && pendingOAuthState.spotify && state !== pendingOAuthState.spotify) {
      return res.status(403).send("Invalid OAuth state");
    }
    pendingOAuthState.spotify = null;
    if (err) {
      return res.status(400).send(`Spotify authorization denied: ${err}`);
    }
    if (!code) {
      return res.status(400).send("Missing authorization code");
    }
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const base = getPublicBaseUrl(req);
    const redirectUri =
      process.env.SPOTIFY_REDIRECT_URI || `${base}/api/oauth/spotify/callback`;
    if (!clientSecret) {
      return res.status(503).send("SPOTIFY_CLIENT_SECRET is not set");
    }
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: String(code),
        redirect_uri: redirectUri
      })
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return res.status(502).send(`Token exchange failed: ${t}`);
    }
    const tokens = await tokenRes.json();
    sessions.spotify.connected = true;
    sessions.spotify.expiresAt = nowSec() + (tokens.expires_in || 3600);
    sessions.spotify.refreshFailures = 0;
    sessions.spotify.accessToken = tokens.access_token;
    sessions.spotify.refreshToken = tokens.refresh_token || null;
    sessions.spotify.rateLimitUntil = 0;
    sessions.spotify.authMode = "oauth";
    persist();
    res.redirect("/?spotify=connected");
  });

  router.get("/soundcloud/login", (req, res) => {
    const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
    const base = getPublicBaseUrl(req);
    const redirectUri =
      process.env.SOUNDCLOUD_REDIRECT_URI || `${base}/api/oauth/soundcloud/callback`;
    if (!clientId) {
      return res.status(503).json({
        error:
          "OAuth not configured: set SOUNDCLOUD_CLIENT_ID. Use Connect in the UI for simulated sessions.",
        code: "OAUTH_NOT_CONFIGURED"
      });
    }
    const state = crypto.randomBytes(16).toString("hex");
    const { codeVerifier, codeChallenge } = generatePkcePair();
    pendingOAuthState.soundcloud = { state, codeVerifier };
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
      display: "popup"
    });
    res.redirect(`${SOUNDCLOUD_AUTHORIZE_URL}?${params.toString()}`);
  });

  router.get("/soundcloud/callback", async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const pending = pendingOAuthState.soundcloud;
    pendingOAuthState.soundcloud = null;
    if (!pending || !pending.codeVerifier) {
      return res.status(400).send("Missing PKCE session — start login again from /api/oauth/soundcloud/login");
    }
    if (String(state || "") !== pending.state) {
      return res.status(403).send("Invalid OAuth state");
    }
    if (!code) {
      return res.status(400).send("Missing authorization code");
    }
    const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
    const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;
    const base = getPublicBaseUrl(req);
    const redirectUri =
      process.env.SOUNDCLOUD_REDIRECT_URI || `${base}/api/oauth/soundcloud/callback`;
    if (!clientSecret) {
      return res.status(503).send("SOUNDCLOUD_CLIENT_SECRET is not set");
    }
    const tokenRes = await fetch(SOUNDCLOUD_TOKEN_URL, {
      method: "POST",
      headers: {
        accept: "application/json; charset=utf-8",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: String(code),
        code_verifier: pending.codeVerifier
      })
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return res.status(502).send(`Token exchange failed: ${t}`);
    }
    const tokens = await tokenRes.json();
    sessions.soundcloud.connected = true;
    sessions.soundcloud.expiresAt = nowSec() + (tokens.expires_in || 3600);
    sessions.soundcloud.refreshFailures = 0;
    sessions.soundcloud.accessToken = tokens.access_token;
    sessions.soundcloud.refreshToken = tokens.refresh_token || null;
    sessions.soundcloud.authMode = "oauth";
    persist();
    res.redirect("/?soundcloud=connected");
  });

  router.get("/applemusic/login", (_req, res) => {
    if (!isAppleMusicConfigured()) {
      return res.status(503).send(
        `Apple Music is not configured on this server. ${appleMusicSetupHint()}`
      );
    }
    return res.status(503).send(
      "Apple Music credentials are present, but MusicKit sign-in is not wired yet. The browse UI is ready — playback will activate after MusicKit authorize is implemented."
    );
  });

  router.post("/applemusic/session", (req, res) => {
    if (!isAppleMusicConfigured()) {
      return res.status(503).json({
        error: `Apple Music is not configured on this server. ${appleMusicSetupHint()}`,
        code: "APPLE_MUSIC_NOT_CONFIGURED"
      });
    }
    const musicUserToken =
      typeof req.body?.musicUserToken === "string" ? req.body.musicUserToken.trim() : "";
    if (!musicUserToken) {
      return res.status(400).json({ error: "musicUserToken is required", code: "INVALID_BODY" });
    }
    sessions.applemusic.connected = true;
    sessions.applemusic.expiresAt = nowSec() + 3600 * 24 * 150;
    sessions.applemusic.musicUserToken = musicUserToken;
    sessions.applemusic.authMode = "oauth";
    sessions.applemusic.refreshFailures = 0;
    persist();
    return res.json({ provider: "applemusic", connected: true, status: "connected" });
  });

  app.use("/api/oauth", router);
}

module.exports = { mountOAuthRoutes };
