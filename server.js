const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const {
  reorderWithCursor,
  canRemoveQueueItemAt,
  removeQueueItemAt,
  mapQueueForNowPlaying,
  mapQueueOnQueueEnd,
  resolveEffectiveCurrentIndex,
  selectNowPlayingWithReorder,
  pruneQueueAfterLeavingTrack,
  mapQueueAfterPrune
} = require("./lib/reorderQueue");
const { isTestResetAllowed } = require("./lib/testReset");
const store = require("./lib/store");
const {
  ensureConnected: ensureConnectedCore,
  ensureCapability,
  randomFail,
  nowSec
} = require("./lib/playbackGuards");
const { mountOAuthRoutes } = require("./lib/oauthRoutes");
const providers = require("./lib/providerCatalog");
const {
  getSpotifyAccessToken,
  getSpotifyCurrentUserProfile,
  enrichSpotifyTracksWithImages,
  spotifySearchTracks,
  spotifySearchAlbums,
  spotifyListAlbumTracks,
  spotifyListCurrentUserPlaylists,
  spotifyListFollowedPlaylists,
  spotifyListPlaylistTracks,
  spotifyFetchLikedSongsSummary,
  buildSpotifyLikedSongsSummary,
  buildSpotifyLikedSongsSummaryWithoutCount,
  SPOTIFY_LIKED_SONGS_ID,
  isPlaylistOwnedByUser,
  spotifyStartTrack,
  spotifySetPauseState
} = require("./lib/spotifyWebApi");
const {
  getSoundCloudAccessToken,
  soundCloudSearchTracks,
  soundCloudSearchAlbums,
  soundCloudListLibrary,
  soundCloudListPlaylistTracksById,
  soundCloudEnrichPlaylistTrackCountsByRefs,
  SOUNDCLOUD_LIKES_ID
} = require("./lib/soundcloudWebApi");
const { resolveProviderHealth } = require("./lib/providerHealth");
const { isAppleMusicConfigured, appleMusicSetupHint } = require("./lib/appleMusicConfig");
const {
  requireBrowserSession,
  attachMetaSession,
  buildAllowedOrigins,
  createCorsMiddleware
} = require("./lib/browserSession");
const { sanitizeSessionsForPersist, applyLoadedSessions } = require("./lib/sessionPersist");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.use(express.json());
app.use(createCorsMiddleware(buildAllowedOrigins(PORT)));
app.use(requireBrowserSession);

const sessions = {
  spotify: { connected: false, expiresAt: null, refreshFailures: 0 },
  soundcloud: { connected: false, expiresAt: null, refreshFailures: 0 },
  applemusic: { connected: false, expiresAt: null, refreshFailures: 0 }
};

let queueState = {
  queue: [],
  currentIndex: -1,
  status: "idle",
  lastError: null,
  transitionReason: null
};

const persist = () =>
  store.save({ queueState, sessions: sanitizeSessionsForPersist(sessions) });

const boot = store.load();
if (boot && boot.queueState) {
  queueState = { ...queueState, ...boot.queueState };
}
if (boot && boot.sessions) {
  applyLoadedSessions(sessions, boot.sessions);
}

function getPublicBaseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) {
    return String(process.env.PUBLIC_BASE_URL).replace(/\/$/, "");
  }
  const host = req.get("host") || `127.0.0.1:${PORT}`;
  const proto = req.get("x-forwarded-proto") || (req.secure ? "https" : "http");
  return `${proto}://${host}`;
}

mountOAuthRoutes(app, { sessions, persist, getPublicBaseUrl });

const ensureConnected = (provider) => ensureConnectedCore(provider, sessions, { randomFail });

const ensureCapabilityFor = (provider, capability) =>
  ensureCapability(provider, capability, providers);

function truncateSpotifyDetails(text, maxLen = 480) {
  if (!text || typeof text !== "string") return undefined;
  const t = text.trim();
  if (!t) return undefined;
  return t.length > maxLen ? `${t.slice(0, maxLen)}…` : t;
}

function isValidSoundCloudPermalink(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return host === "soundcloud.com" || host.endsWith(".soundcloud.com");
  } catch {
    return false;
  }
}

function mockCatalogSearch(providerKey, query) {
  const results = providers[providerKey].tracks
    .filter((track) => {
      if (!query) return true;
      return track.title.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query);
    })
    .map((track) => ({ ...track, provider: providerKey }));
  return { provider: providerKey, results };
}

function appleMusicNotConfiguredBody() {
  return {
    error: `Apple Music is not configured on this server. ${appleMusicSetupHint()}`,
    code: "APPLE_MUSIC_NOT_CONFIGURED",
    hint: appleMusicSetupHint()
  };
}

function mockAppleMusicAlbumSummaries(query) {
  const sample = providers.applemusic.tracks[0];
  const album = {
    id: APPLE_DEMO_ALBUM_ID,
    name: "Demo album (Connect shows your real Apple Music library after setup)",
    artist: sample?.artist || "Demo artist",
    imageUrl: sample?.imageUrl,
    releaseYear: "",
    trackCount: providers.applemusic.tracks.length,
    provider: "applemusic",
    kind: "album"
  };
  if (!query) return [album];
  const q = query.toLowerCase();
  const haystack = `${album.name} ${album.artist}`.toLowerCase();
  return haystack.includes(q) ? [album] : [];
}

function mockAppleMusicPlaylistSummaries() {
  return [
    {
      id: APPLE_DEMO_PLAYLIST_ID,
      name: "Demo playlist (your library appears after Apple Music is configured)",
      ownerDisplayName: "Unify",
      trackCount: providers.applemusic.tracks.length,
      imageUrl: providers.applemusic.tracks[0]?.imageUrl,
      provider: "applemusic"
    }
  ];
}

function mockAppleMusicLikedSongsSummary() {
  return {
    id: APPLE_LIKED_SONGS_ID,
    name: "Liked Songs",
    ownerDisplayName: "You",
    trackCount: providers.applemusic.tracks.length,
    imageUrl: providers.applemusic.tracks[0]?.imageUrl,
    provider: "applemusic",
    kind: "liked_songs"
  };
}

function mockAppleMusicPlaylistTracks(playlistId) {
  const trackCount = providers.applemusic.tracks.length;
  const baseMs = Date.now();
  const tracks = providers.applemusic.tracks.map((t, index) => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    durationSec: t.durationSec,
    imageUrl: t.imageUrl,
    provider: "applemusic",
    addedAt: new Date(baseMs - (trackCount - 1 - index) * 86400000).toISOString()
  }));
  if (
    playlistId === APPLE_LIKED_SONGS_ID ||
    playlistId === APPLE_DEMO_PLAYLIST_ID ||
    playlistId === APPLE_DEMO_ALBUM_ID
  ) {
    return tracks;
  }
  return null;
}

function mockAppleMusicLibrary() {
  return {
    likedSongs: mockAppleMusicLikedSongsSummary(),
    owned: {
      items: mockAppleMusicPlaylistSummaries(),
      nextOffset: null
    }
  };
}

function appleMusicAllowsDemoCatalog() {
  return isAppleMusicConfigured() && sessions.applemusic?.authMode === "simulated";
}

/** Stable id for simulated Spotify (no OAuth token): browse mock catalog as a fake playlist. */
const SPOTIFY_DEMO_PLAYLIST_ID = "demo-playlist";
/** Stable id for simulated Spotify album search (no OAuth token). */
const SPOTIFY_DEMO_ALBUM_ID = "demo-album";
/** Stable ids for Apple Music demo browse (credentials + simulated connect). */
const APPLE_DEMO_PLAYLIST_ID = "demo-playlist";
const APPLE_DEMO_ALBUM_ID = "demo-album";
const APPLE_LIKED_SONGS_ID = "__liked_songs__";

function mockSpotifyLikedSongsSummary() {
  return buildSpotifyLikedSongsSummaryWithoutCount();
}

function spotifyLikedSongsErrorHint(likedResult) {
  if (!likedResult || likedResult.ok) return null;
  if (likedResult.status === 403) {
    return "Reconnect Spotify (Disconnect, then Connect) to allow access to Liked Songs.";
  }
  if (likedResult.code === "SPOTIFY_RATE_LIMIT") {
    return "Spotify is rate-limited — Liked Songs will appear after the limit clears.";
  }
  return "Could not load Liked Songs from Spotify.";
}

function mockSpotifyPlaylistSummaries() {
  return [
    {
      id: SPOTIFY_DEMO_PLAYLIST_ID,
      name: "Demo playlist (OAuth Connect shows your real Spotify playlists)",
      ownerDisplayName: "MVP",
      public: false,
      provider: "spotify"
    }
  ];
}

function mockSpotifyPlaylistTrackResults() {
  const baseMs = Date.now();
  const trackCount = providers.spotify.tracks.length;
  return providers.spotify.tracks.map((t, index) => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    durationSec: t.durationSec,
    imageUrl: t.imageUrl,
    provider: "spotify",
    addedAt: new Date(baseMs - (trackCount - 1 - index) * 86400000).toISOString()
  }));
}

function mockSpotifyPlaylistTracks(playlistId) {
  const tracks = mockSpotifyPlaylistTrackResults();
  if (playlistId === SPOTIFY_LIKED_SONGS_ID || playlistId === SPOTIFY_DEMO_PLAYLIST_ID) {
    return tracks;
  }
  return null;
}

function mockSpotifyAlbumSummaries(query) {
  const album = {
    id: SPOTIFY_DEMO_ALBUM_ID,
    name: "Demo album (OAuth Connect shows real Spotify albums)",
    artist: "MVP",
    imageUrl: providers.spotify.tracks[0]?.imageUrl,
    releaseYear: "2024",
    trackCount: providers.spotify.tracks.length,
    provider: "spotify",
    kind: "album"
  };
  if (!query) {
    return [album];
  }
  const q = query.toLowerCase();
  const haystack = `${album.name} ${album.artist}`.toLowerCase();
  return haystack.includes(q) ? [album] : [];
}

function mockSpotifyAlbumTracks(albumId) {
  if (albumId === SPOTIFY_DEMO_ALBUM_ID) {
    return mockSpotifyPlaylistTrackResults();
  }
  return null;
}

function spotifyTokenAllowsMockCatalog(tokenResult) {
  return (
    tokenResult.code === "SPOTIFY_REFRESH_MISSING" || tokenResult.code === "SPOTIFY_OAUTH_CONFIG_MISSING"
  );
}

const SOUNDCLOUD_DEMO_PLAYLIST_ID = "demo-playlist-sc";
const SOUNDCLOUD_DEMO_ALBUM_ID = "demo-album-sc";

function soundCloudTokenAllowsMockCatalog(tokenResult) {
  return (
    tokenResult.code === "SOUNDCLOUD_REFRESH_MISSING" ||
    tokenResult.code === "SOUNDCLOUD_OAUTH_CONFIG_MISSING"
  );
}

function mockSoundCloudLibrary() {
  const tracks = providers.soundcloud.tracks;
  return {
    likes: {
      id: SOUNDCLOUD_LIKES_ID,
      name: "Likes",
      kind: "likes",
      provider: "soundcloud"
    },
    owned: {
      items: [
        {
          id: SOUNDCLOUD_DEMO_PLAYLIST_ID,
          name: "Demo playlist (OAuth Connect shows your real SoundCloud library)",
          kind: "owned",
          provider: "soundcloud"
        }
      ],
      nextOffset: null
    },
    likedPlaylists: {
      items: [],
      nextOffset: null
    }
  };
}

const SOUNDCLOUD_ENRICH_COUNTS_MAX = 60;

function mockSoundCloudEnrichCounts(playlistRefs) {
  const demoTrackCount = providers.soundcloud.tracks.length;
  return {
    playlists: (playlistRefs || []).slice(0, SOUNDCLOUD_ENRICH_COUNTS_MAX).map((ref) => ({
      id: String(ref.id),
      trackCount: demoTrackCount,
      trackCountPending: false
    }))
  };
}

function mockSoundCloudPlaylistTracks(playlistId) {
  const baseMs = Date.now();
  const trackCount = providers.soundcloud.tracks.length;
  const tracks = providers.soundcloud.tracks.map((t, index) => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    durationSec: t.durationSec,
    permalinkUrl: t.permalinkUrl,
    imageUrl: t.imageUrl,
    provider: "soundcloud",
    addedAt: new Date(baseMs - (trackCount - 1 - index) * 86400000).toISOString()
  }));
  if (
    playlistId === SOUNDCLOUD_LIKES_ID ||
    playlistId === SOUNDCLOUD_DEMO_PLAYLIST_ID ||
    playlistId === SOUNDCLOUD_DEMO_ALBUM_ID
  ) {
    return tracks;
  }
  return null;
}

function mockSoundCloudAlbumSummaries(query) {
  const sample = providers.soundcloud.tracks[0];
  const album = {
    id: SOUNDCLOUD_DEMO_ALBUM_ID,
    name: "Demo album (OAuth Connect shows real SoundCloud albums)",
    artist: sample?.artist || "Demo artist",
    imageUrl: sample?.imageUrl,
    releaseYear: "",
    trackCount: providers.soundcloud.tracks.length,
    provider: "soundcloud",
    kind: "album"
  };
  if (!query) {
    return [album];
  }
  const q = query.toLowerCase();
  const haystack = `${album.name} ${album.artist}`.toLowerCase();
  return haystack.includes(q) ? [album] : [];
}

function mapSoundCloudBrowseError(res, liveResult, fallbackCode) {
  const status = Number(liveResult?.status || 502);
  const code = liveResult?.code || fallbackCode;
  const details = truncateSpotifyDetails(liveResult?.details || liveResult?.message);
  const withDetails = (body) => (details ? { ...body, details } : body);
  if (status === 401) {
    return res.status(401).json(withDetails({ error: "soundcloud authorization expired", code }));
  }
  if (status === 403) {
    return res.status(403).json(
      withDetails({
        error: "soundcloud denied library access",
        code,
        hint: "Reconnect SoundCloud via OAuth in the header."
      })
    );
  }
  if (status === 429) {
    const retryAfterSec = liveResult.retryAfterSec || liveResult.retryAfter || 60;
    if (retryAfterSec) {
      res.set("Retry-After", String(retryAfterSec));
    }
    return res.status(429).json(
      withDetails({
        error: liveResult.message || "soundcloud rate limit",
        code: code === "SOUNDCLOUD_RATE_LIMIT" ? code : "SOUNDCLOUD_RATE_LIMIT",
        retryAfterSec: Number(retryAfterSec) || 60
      })
    );
  }
  return res.status(status >= 400 && status < 600 ? status : 502).json(
    withDetails({ error: "soundcloud library request failed", code })
  );
}

const SPOTIFY_DEFAULT_SCOPES =
  "streaming user-modify-playback-state user-read-email user-read-private user-library-read playlist-read-private playlist-read-collaborative";

function spotifyConfiguredScopeList() {
  const raw = process.env.SPOTIFY_SCOPES || SPOTIFY_DEFAULT_SCOPES;
  return String(raw)
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function spotifyEnvIncludesPlaylistReadScopes() {
  const scopes = spotifyConfiguredScopeList();
  return scopes.includes("playlist-read-private") || scopes.includes("playlist-read-collaborative");
}

function mapSpotifyBrowseError(res, liveResult, fallbackCode) {
  const status = Number(liveResult?.status || 502);
  const code = liveResult?.code || fallbackCode;
  const details = truncateSpotifyDetails(liveResult?.details || liveResult?.message);
  const withDetails = (body) => (details ? { ...body, details } : body);
  const isAlbumContext =
    fallbackCode === "SPOTIFY_ALBUM_TRACKS_FAILED" || code === "SPOTIFY_ALBUM_TRACKS_FAILED";
  if (status === 401) {
    return res.status(401).json(withDetails({ error: "spotify authorization expired", code }));
  }
  if (status === 403) {
    if (isAlbumContext) {
      return res.status(403).json(
        withDetails({
          error:
            "Spotify denied access to this album's tracks — try reconnecting Spotify, or search for the album again.",
          code
        })
      );
    }
    const envMissingPlaylistScopes = !spotifyEnvIncludesPlaylistReadScopes();
    const detailText = String(liveResult?.details || "").toLowerCase();
    const notOwnerOrCollaborator =
      detailText.includes("collaborator") ||
      detailText.includes("only accessible") ||
      detailText.includes("forbidden");
    let error;
    if (code === "SPOTIFY_LIKED_SONGS_FAILED") {
      error =
        spotifyLikedSongsErrorHint(liveResult) ||
        "Could not load Liked Songs from Spotify — disconnect and reconnect Spotify via OAuth.";
    } else if (envMissingPlaylistScopes) {
      error =
        "SPOTIFY_SCOPES in .env is missing playlist-read-private / playlist-read-collaborative. Update .env, restart npm start, then disconnect and reconnect Spotify (OAuth, not simulated Connect).";
    } else if (code === "SPOTIFY_PLAYLIST_TRACKS_FAILED" && notOwnerOrCollaborator) {
      error =
        "Spotify only allows loading tracks for playlists you own or collaborate on. Followed playlists appear in the list but cannot show tracks here — open one you created, or duplicate it in Spotify.";
    } else if (code === "SPOTIFY_PLAYLIST_TRACKS_FAILED") {
      error =
        "Spotify denied playlist access — disconnect and reconnect Spotify via OAuth so the token includes playlist-read scopes.";
    } else if (notOwnerOrCollaborator) {
      error =
        "Spotify denied access — disconnect and reconnect Spotify via OAuth, then try again.";
    } else {
      error =
        "Spotify denied playlist access — disconnect and reconnect Spotify via OAuth so the token includes playlist-read scopes.";
    }
    return res.status(403).json(withDetails({ error, code }));
  }
  if (status === 429) {
    const { rateLimitUserMessage, parseRetryAfterSeconds } = require("./lib/rateLimitBackoff");
    const retryAfterSec =
      liveResult.retryAfterSec || parseRetryAfterSeconds(liveResult.retryAfter) || 60;
    res.set("Retry-After", String(retryAfterSec));
    return res.status(429).json({
      error: liveResult.message || rateLimitUserMessage("spotify", retryAfterSec),
      code: "SPOTIFY_RATE_LIMIT",
      retryAfterSec: Number(retryAfterSec) || 60
    });
  }
  return res.status(502).json(
    withDetails({
      error: isAlbumContext ? "Could not load album tracks from Spotify." : "spotify request failed",
      code
    })
  );
}

const setQueueState = (next) => {
  queueState = { ...queueState, ...next };
  persist();
};

const resetState = () => {
  Object.keys(sessions).forEach((provider) => {
    sessions[provider] = { connected: false, expiresAt: null, refreshFailures: 0 };
  });
  queueState = {
    queue: [],
    currentIndex: -1,
    status: "idle",
    lastError: null,
    transitionReason: null
  };
  store.clear();
};

app.get("/api/providers", async (_req, res) => {
  const data = await Promise.all(
    Object.entries(providers).map(async ([provider, spec]) => {
      const h = await resolveProviderHealth(provider, sessions, { persist });
      return {
        provider,
        capabilities: spec.capabilities,
        connected: sessions[provider].connected,
        expiresAt: sessions[provider].expiresAt,
        health: h.health,
        healthCode: h.code,
        healthMessage: h.message,
        healthAction: h.action,
        retryAfterSec: h.retryAfterSec ?? null
      };
    })
  );
  return res.json(data);
});

/** Lets the UI detect an outdated Node process (missing playlist routes, etc.). */
app.get("/api/meta", (req, res) => {
  const browserSessionToken = attachMetaSession(req, res);
  return res.json({
    browserSessionToken,
    features: {
      spotifyPlaylists: true,
      spotifyPlaylistTracks: true,
      soundcloudPlaylists: true,
      soundcloudPlaylistTracks: true,
      appleMusicPlaylists: true,
      appleMusicPlaylistTracks: true,
      appleMusicConfigured: isAppleMusicConfigured()
    }
  });
});

app.post("/api/test/reset", (req, res) => {
  if (!isTestResetAllowed(req)) {
    return res.status(403).json({ error: "test reset is not allowed in this environment" });
  }
  resetState();
  return res.status(204).send();
});

app.post("/api/auth/:provider/connect", (req, res) => {
  const { provider } = req.params;
  if (!providers[provider]) {
    return res.status(404).json({ error: "provider not found" });
  }
  sessions[provider].connected = true;
  sessions[provider].expiresAt = nowSec() + 3600;
  sessions[provider].refreshFailures = 0;
  sessions[provider].authMode = "simulated";
  persist();
  return res.json({
    provider,
    connected: true,
    expiresAt: sessions[provider].expiresAt,
    status: "connected"
  });
});

app.post("/api/auth/:provider/disconnect", (req, res) => {
  const { provider } = req.params;
  if (!providers[provider]) {
    return res.status(404).json({ error: "provider not found" });
  }
  sessions[provider].connected = false;
  sessions[provider].expiresAt = null;
  delete sessions[provider].accessToken;
  delete sessions[provider].refreshToken;
  delete sessions[provider].musicUserToken;
  delete sessions[provider].userId;
  delete sessions[provider].displayName;
  delete sessions[provider].authMode;
  sessions[provider].rateLimitUntil = 0;
  persist();
  return res.json({ provider, connected: false, status: "disconnected" });
});

function mapSpotifyControlError(res, errorResult, fallbackCode) {
  const status = Number(errorResult?.status || 502);
  const code = errorResult?.code || fallbackCode;
  const details = truncateSpotifyDetails(errorResult?.details || errorResult?.message);
  const withDetails = (body) => (details ? { ...body, details } : body);
  if (status === 401) {
    return res.status(401).json(withDetails({ error: "spotify authorization expired", code }));
  }
  if (status === 403) {
    return res.status(403).json(
      withDetails({
        error:
          "Spotify refused playback (Premium required for Web Playback, or missing scopes — disconnect and reconnect Spotify after updating the app).",
        code
      })
    );
  }
  if (status === 404) {
    return res.status(404).json(withDetails({ error: "spotify playback device not found", code }));
  }
  if (status === 429) {
    const { rateLimitUserMessage, parseRetryAfterSeconds } = require("./lib/rateLimitBackoff");
    const retryAfterSec =
      errorResult.retryAfterSec || parseRetryAfterSeconds(errorResult.retryAfter) || 60;
    res.set("Retry-After", String(retryAfterSec));
    return res.status(429).json({
      error: errorResult.message || rateLimitUserMessage("spotify", retryAfterSec),
      code: "SPOTIFY_RATE_LIMIT",
      retryAfterSec: Number(retryAfterSec) || 60
    });
  }
  return res.status(502).json(withDetails({ error: "spotify playback request failed", code }));
}

app.get("/api/spotify/token", async (_req, res) => {
  const connectCheck = ensureConnected("spotify");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }
  const tokenResult = await getSpotifyAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    const body = {
      error: tokenResult.message || "spotify token is unavailable",
      code: tokenResult.code || "SPOTIFY_TOKEN_UNAVAILABLE"
    };
    if (tokenResult.message && tokenResult.code !== "SPOTIFY_RATE_LIMIT") {
      body.hint = tokenResult.message;
    }
    const d = truncateSpotifyDetails(tokenResult.details);
    if (d) body.details = d;
    if (tokenResult.code === "SPOTIFY_RATE_LIMIT") {
      const retryAfterSec = tokenResult.retryAfterSec || 60;
      body.retryAfterSec = retryAfterSec;
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json(body);
    }
    return res.status(401).json(body);
  }
  return res.json({ accessToken: tokenResult.accessToken });
});

app.post("/api/spotify/player/play", async (req, res) => {
  const connectCheck = ensureConnected("spotify");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const { deviceId, trackId, positionMs } = req.body || {};
  if (!deviceId || !trackId) {
    return res.status(400).json({ error: "deviceId and trackId are required" });
  }

  const startResult = await spotifyStartTrack({
    sessions,
    persist,
    deviceId,
    trackId,
    positionMs
  });
  if (!startResult.ok) {
    return mapSpotifyControlError(res, startResult, "SPOTIFY_PLAY_FAILED");
  }
  return res.status(204).send();
});

app.post("/api/spotify/player/pause", async (req, res) => {
  const connectCheck = ensureConnected("spotify");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const { deviceId } = req.body || {};
  if (!deviceId) {
    return res.status(400).json({ error: "deviceId is required" });
  }
  const pauseResult = await spotifySetPauseState({ sessions, persist, deviceId, paused: true });
  if (!pauseResult.ok) {
    return mapSpotifyControlError(res, pauseResult, "SPOTIFY_PAUSE_FAILED");
  }
  return res.status(204).send();
});

app.post("/api/spotify/player/resume", async (req, res) => {
  const connectCheck = ensureConnected("spotify");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const { deviceId } = req.body || {};
  if (!deviceId) {
    return res.status(400).json({ error: "deviceId is required" });
  }
  const resumeResult = await spotifySetPauseState({ sessions, persist, deviceId, paused: false });
  if (!resumeResult.ok) {
    return mapSpotifyControlError(res, resumeResult, "SPOTIFY_RESUME_FAILED");
  }
  return res.status(204).send();
});

app.get("/api/spotify/playlists", async (req, res) => {
  const connectCheck = ensureConnected("spotify");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const limit = Math.min(Number(req.query.limit || 50) || 50, 50);
  const offset = Math.max(Number(req.query.offset || 0) || 0, 0);
  const likedLimit = Math.min(Number(req.query.likedLimit || 30) || 30, 50);
  const likedOffset = Math.max(Number(req.query.likedOffset || 0) || 0, 0);
  const enrichTrackCounts =
    req.query.enrichCounts === "true" || req.query.enrichCounts === "1";
  const fetchSongCounts =
    req.query.fetchSongCounts === "true" || req.query.fetchSongCounts === "1";
  const listOpts = { enrichTrackCounts, omitSongCounts: !fetchSongCounts };

  const tokenResult = await getSpotifyAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    if (spotifyTokenAllowsMockCatalog(tokenResult)) {
      return res.json({
        likedSongs: mockSpotifyLikedSongsSummary(),
        items: mockSpotifyPlaylistSummaries(),
        nextOffset: null,
        likedPlaylists: { items: [], nextOffset: null },
        demoMode: true
      });
    }
    const body = {
      error: "spotify token is unavailable",
      code: tokenResult.code || "SPOTIFY_TOKEN_UNAVAILABLE"
    };
    if (tokenResult.message && tokenResult.code !== "SPOTIFY_RATE_LIMIT") {
      body.hint = tokenResult.message;
    }
    const d = truncateSpotifyDetails(tokenResult.details);
    if (d) body.details = d;
    if (tokenResult.code === "SPOTIFY_RATE_LIMIT") {
      const retryAfterSec = tokenResult.retryAfterSec || 60;
      body.retryAfterSec = retryAfterSec;
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        error: tokenResult.message || body.error,
        code: "SPOTIFY_RATE_LIMIT",
        retryAfterSec
      });
    }
    return res.status(401).json(body);
  }

  const profileResult = await getSpotifyCurrentUserProfile({ sessions, persist, forceRefresh: false });
  const profile = profileResult.ok
    ? { id: profileResult.userId, displayName: profileResult.displayName || "" }
    : undefined;

  const likedPromise = fetchSongCounts
    ? spotifyFetchLikedSongsSummary({ sessions, persist })
    : Promise.resolve({ ok: true, likedSongs: buildSpotifyLikedSongsSummaryWithoutCount() });

  let likedResult;
  let liveResult;
  let followedResult;
  try {
    [likedResult, liveResult, followedResult] = await Promise.all([
      likedPromise,
      spotifyListCurrentUserPlaylists({
        sessions,
        persist,
        limit,
        offset,
        profile,
        ...listOpts
      }),
      spotifyListFollowedPlaylists({
        sessions,
        persist,
        limit: likedLimit,
        offset: likedOffset,
        profile,
        ...listOpts
      })
    ]);
  } catch (err) {
    return res.status(500).json({
      error: "spotify playlists request failed",
      code: "SPOTIFY_PLAYLISTS_FAILED",
      details: err?.message
    });
  }

  if (
    (!likedResult.ok && likedResult.status === 401) ||
    (!liveResult.ok && liveResult.status === 401) ||
    (!followedResult.ok && followedResult.status === 401)
  ) {
    const refreshResult = await getSpotifyAccessToken({ sessions, persist, forceRefresh: true });
    if (!refreshResult.ok) {
      return res.status(401).json({
        error: "spotify token refresh failed",
        code: refreshResult.code || "SPOTIFY_REFRESH_FAILED"
      });
    }
    const retryLiked = fetchSongCounts
      ? spotifyFetchLikedSongsSummary({ sessions, persist })
      : Promise.resolve({ ok: true, likedSongs: buildSpotifyLikedSongsSummaryWithoutCount() });
    const retryTasks = [
      !likedResult.ok && likedResult.status === 401 ? retryLiked : Promise.resolve(likedResult),
      !liveResult.ok && liveResult.status === 401
        ? spotifyListCurrentUserPlaylists({
            sessions,
            persist,
            limit,
            offset,
            profile,
            ...listOpts
          })
        : Promise.resolve(liveResult),
      !followedResult.ok && followedResult.status === 401
        ? spotifyListFollowedPlaylists({
            sessions,
            persist,
            limit: likedLimit,
            offset: likedOffset,
            profile,
            ...listOpts
          })
        : Promise.resolve(followedResult)
    ];
    [likedResult, liveResult, followedResult] = await Promise.all(retryTasks);
  }

  if (!liveResult.ok) {
    return mapSpotifyBrowseError(res, liveResult, "SPOTIFY_PLAYLISTS_FAILED");
  }
  if (!followedResult.ok) {
    return mapSpotifyBrowseError(res, followedResult, "SPOTIFY_PLAYLISTS_FAILED");
  }

  const ownerProfile = profile || {
    id: sessions.spotify.userId || "",
    displayName: sessions.spotify.displayName || ""
  };
  const ownedItems = (liveResult.items || []).filter((item) =>
    isPlaylistOwnedByUser(item, ownerProfile)
  );

  const body = {
    items: ownedItems,
    nextOffset: liveResult.nextOffset,
    likedPlaylists: {
      items: followedResult.items || [],
      nextOffset: followedResult.nextOffset
    },
    demoMode: false,
    ownedOnly: true
  };
  if (likedResult.ok && likedResult.likedSongs) {
    body.likedSongs = likedResult.likedSongs;
  } else {
    body.likedSongs = fetchSongCounts
      ? buildSpotifyLikedSongsSummary(0)
      : buildSpotifyLikedSongsSummaryWithoutCount();
    body.likedSongsUnavailable = true;
    const hint = spotifyLikedSongsErrorHint(likedResult);
    body.likedSongsError = {
      code: likedResult.code || "SPOTIFY_LIKED_SONGS_FAILED",
      status: likedResult.status,
      hint
    };
  }

  return res.json(body);
});

app.get("/api/spotify/playlists/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  const connectCheck = ensureConnected("spotify");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const limit = Math.min(Number(req.query.limit || 50) || 50, 50);
  const offset = Math.max(Number(req.query.offset || 0) || 0, 0);

  const tokenResult = await getSpotifyAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    if (spotifyTokenAllowsMockCatalog(tokenResult)) {
      const mockTracks = mockSpotifyPlaylistTracks(playlistId);
      if (mockTracks) {
        return res.json({
          results: mockTracks,
          nextOffset: null,
          demoMode: true
        });
      }
      return res.status(404).json({ error: "unknown demo playlist id", code: "SPOTIFY_PLAYLIST_NOT_FOUND" });
    }
    const body = {
      error: "spotify token is unavailable",
      code: tokenResult.code || "SPOTIFY_TOKEN_UNAVAILABLE"
    };
    if (tokenResult.message) body.hint = tokenResult.message;
    const d = truncateSpotifyDetails(tokenResult.details);
    if (d) body.details = d;
    return res.status(401).json(body);
  }

  let liveResult = await spotifyListPlaylistTracks({
    sessions,
    persist,
    playlistId,
    limit,
    offset
  });

  if (!liveResult.ok && liveResult.status === 401) {
    const refreshResult = await getSpotifyAccessToken({ sessions, persist, forceRefresh: true });
    if (!refreshResult.ok) {
      return res.status(401).json({
        error: "spotify token refresh failed",
        code: refreshResult.code || "SPOTIFY_REFRESH_FAILED"
      });
    }
    liveResult = await spotifyListPlaylistTracks({
      sessions,
      persist,
      playlistId,
      limit,
      offset
    });
  }

  if (!liveResult.ok) {
    return mapSpotifyBrowseError(res, liveResult, "SPOTIFY_PLAYLIST_TRACKS_FAILED");
  }

  const results = liveResult.results || [];
  return res.json({
    results,
    nextOffset: liveResult.nextOffset,
    demoMode: false
  });
});

app.get("/api/spotify/albums/:albumId/tracks", async (req, res) => {
  const { albumId } = req.params;
  const connectCheck = ensureConnected("spotify");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const limit = Math.min(Number(req.query.limit || 50) || 50, 50);
  const offset = Math.max(Number(req.query.offset || 0) || 0, 0);

  const tokenResult = await getSpotifyAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    if (spotifyTokenAllowsMockCatalog(tokenResult)) {
      const mockTracks = mockSpotifyAlbumTracks(albumId);
      if (mockTracks) {
        return res.json({
          results: mockTracks,
          nextOffset: null,
          demoMode: true
        });
      }
      return res.status(404).json({ error: "unknown demo album id", code: "SPOTIFY_ALBUM_NOT_FOUND" });
    }
    const body = {
      error: "spotify token is unavailable",
      code: tokenResult.code || "SPOTIFY_TOKEN_UNAVAILABLE"
    };
    if (tokenResult.message) body.hint = tokenResult.message;
    const d = truncateSpotifyDetails(tokenResult.details);
    if (d) body.details = d;
    return res.status(401).json(body);
  }

  let liveResult = await spotifyListAlbumTracks({
    sessions,
    persist,
    albumId,
    limit,
    offset
  });

  if (!liveResult.ok && liveResult.status === 401) {
    const refreshResult = await getSpotifyAccessToken({ sessions, persist, forceRefresh: true });
    if (!refreshResult.ok) {
      return res.status(401).json({
        error: "spotify token refresh failed",
        code: refreshResult.code || "SPOTIFY_REFRESH_FAILED"
      });
    }
    liveResult = await spotifyListAlbumTracks({
      sessions,
      persist,
      albumId,
      limit,
      offset
    });
  }

  if (!liveResult.ok) {
    return mapSpotifyBrowseError(res, liveResult, "SPOTIFY_ALBUM_TRACKS_FAILED");
  }

  const results = liveResult.results || [];
  return res.json({
    results,
    nextOffset: liveResult.nextOffset,
    demoMode: false
  });
});

app.get("/api/soundcloud/playlists", async (req, res) => {
  const connectCheck = ensureConnected("soundcloud");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const ownedLimit = Math.min(Number(req.query.ownedLimit || 30) || 30, 50);
  const ownedOffset = Math.max(Number(req.query.ownedOffset || 0) || 0, 0);
  const likedLimit = Math.min(Number(req.query.likedLimit || 30) || 30, 50);
  const likedOffset = Math.max(Number(req.query.likedOffset || 0) || 0, 0);
  const enrichTrackCounts =
    req.query.enrichCounts === "true" || req.query.enrichCounts === "1";
  const fetchSongCounts =
    req.query.fetchSongCounts === "true" || req.query.fetchSongCounts === "1";

  const tokenResult = await getSoundCloudAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    if (soundCloudTokenAllowsMockCatalog(tokenResult)) {
      return res.json({ ...mockSoundCloudLibrary(), demoMode: true });
    }
    const body = {
      error: "soundcloud token is unavailable",
      code: tokenResult.code || "SOUNDCLOUD_TOKEN_UNAVAILABLE"
    };
    if (tokenResult.message) body.hint = tokenResult.message;
    const d = truncateSpotifyDetails(tokenResult.details);
    if (d) body.details = d;
    return res.status(401).json(body);
  }

  let liveResult = await soundCloudListLibrary({
    accessToken: tokenResult.accessToken,
    ownedLimit,
    ownedOffset,
    likedLimit,
    likedOffset,
    enrichTrackCounts,
    fetchSongCounts
  });

  if (!liveResult.ok && liveResult.status === 401) {
    const refreshResult = await getSoundCloudAccessToken({ sessions, persist, forceRefresh: true });
    if (!refreshResult.ok) {
      return res.status(401).json({
        error: "soundcloud token refresh failed",
        code: refreshResult.code || "SOUNDCLOUD_REFRESH_FAILED"
      });
    }
    liveResult = await soundCloudListLibrary({
      accessToken: refreshResult.accessToken,
      ownedLimit,
      ownedOffset,
      likedLimit,
      likedOffset,
      enrichTrackCounts,
      fetchSongCounts
    });
  }

  if (!liveResult.ok) {
    return mapSoundCloudBrowseError(res, liveResult, "SOUNDCLOUD_PLAYLISTS_FAILED");
  }

  return res.json({
    likes: liveResult.likes,
    owned: liveResult.owned,
    likedPlaylists: liveResult.likedPlaylists,
    demoMode: false
  });
});

app.post("/api/soundcloud/playlists/enrich-counts", async (req, res) => {
  const connectCheck = ensureConnected("soundcloud");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const rawPlaylists = Array.isArray(req.body?.playlists) ? req.body.playlists : [];
  const playlists = rawPlaylists.slice(0, SOUNDCLOUD_ENRICH_COUNTS_MAX).map((ref) => ({
    id: ref?.id,
    secretToken:
      typeof ref?.secretToken === "string" && ref.secretToken.trim() ? ref.secretToken.trim() : undefined
  }));

  const tokenResult = await getSoundCloudAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    if (soundCloudTokenAllowsMockCatalog(tokenResult)) {
      return res.json({ ...mockSoundCloudEnrichCounts(playlists), demoMode: true });
    }
    const body = {
      error: "soundcloud token is unavailable",
      code: tokenResult.code || "SOUNDCLOUD_TOKEN_UNAVAILABLE"
    };
    if (tokenResult.message) body.hint = tokenResult.message;
    const d = truncateSpotifyDetails(tokenResult.details);
    if (d) body.details = d;
    return res.status(401).json(body);
  }

  let liveResult = await soundCloudEnrichPlaylistTrackCountsByRefs({
    accessToken: tokenResult.accessToken,
    playlists
  });

  if (!liveResult.ok && liveResult.status === 401) {
    const refreshResult = await getSoundCloudAccessToken({ sessions, persist, forceRefresh: true });
    if (!refreshResult.ok) {
      return res.status(401).json({
        error: "soundcloud token refresh failed",
        code: refreshResult.code || "SOUNDCLOUD_REFRESH_FAILED"
      });
    }
    liveResult = await soundCloudEnrichPlaylistTrackCountsByRefs({
      accessToken: refreshResult.accessToken,
      playlists
    });
  }

  if (!liveResult.ok) {
    return mapSoundCloudBrowseError(res, liveResult, "SOUNDCLOUD_PLAYLIST_COUNTS_FAILED");
  }

  return res.json({
    playlists: liveResult.playlists,
    demoMode: false
  });
});

app.get("/api/soundcloud/playlists/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  const connectCheck = ensureConnected("soundcloud");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const limit = Math.min(Number(req.query.limit || 50) || 50, 50);
  const offset = Math.max(Number(req.query.offset || 0) || 0, 0);
  const secretToken = (req.query.secretToken || "").toString().trim() || undefined;

  const tokenResult = await getSoundCloudAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    const mockTracks = mockSoundCloudPlaylistTracks(playlistId);
    if (soundCloudTokenAllowsMockCatalog(tokenResult) && mockTracks) {
      return res.json({
        results: mockTracks,
        nextOffset: null,
        demoMode: true
      });
    }
    if (soundCloudTokenAllowsMockCatalog(tokenResult)) {
      return res.status(404).json({ error: "unknown demo playlist id", code: "SOUNDCLOUD_PLAYLIST_NOT_FOUND" });
    }
    const body = {
      error: "soundcloud token is unavailable",
      code: tokenResult.code || "SOUNDCLOUD_TOKEN_UNAVAILABLE"
    };
    if (tokenResult.message) body.hint = tokenResult.message;
    const d = truncateSpotifyDetails(tokenResult.details);
    if (d) body.details = d;
    return res.status(401).json(body);
  }

  let liveResult = await soundCloudListPlaylistTracksById({
    accessToken: tokenResult.accessToken,
    playlistId,
    secretToken,
    limit,
    offset
  });

  if (!liveResult.ok && liveResult.status === 401) {
    const refreshResult = await getSoundCloudAccessToken({ sessions, persist, forceRefresh: true });
    if (!refreshResult.ok) {
      return res.status(401).json({
        error: "soundcloud token refresh failed",
        code: refreshResult.code || "SOUNDCLOUD_REFRESH_FAILED"
      });
    }
    liveResult = await soundCloudListPlaylistTracksById({
      accessToken: refreshResult.accessToken,
      playlistId,
      secretToken,
      limit,
      offset
    });
  }

  if (!liveResult.ok) {
    return mapSoundCloudBrowseError(res, liveResult, "SOUNDCLOUD_PLAYLIST_TRACKS_FAILED");
  }

  return res.json({
    results: liveResult.results || [],
    nextOffset: liveResult.nextOffset,
    demoMode: false
  });
});

app.get("/api/provider/:provider/search", async (req, res) => {
  const { provider } = req.params;
  const query = (req.query.q || "").toString().trim().toLowerCase();

  const connectCheck = ensureConnected(provider);
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const capabilityCheck = ensureCapabilityFor(provider, "search");
  if (!capabilityCheck.ok) {
    return res.status(400).json({ error: capabilityCheck.message, code: capabilityCheck.code });
  }

  if (provider === "spotify") {
    const searchType = (req.query.type || "track").toString().toLowerCase() === "album" ? "album" : "track";
    const tokenResult = await getSpotifyAccessToken({ sessions, persist });
    if (!tokenResult.ok) {
      const useMock = spotifyTokenAllowsMockCatalog(tokenResult);
      if (useMock) {
        if (randomFail(0.08)) {
          return res.status(429).json({ error: `${provider} rate limit`, code: "PROVIDER_RATE_LIMIT" });
        }
        if (searchType === "album") {
          return res.json({ provider, kind: "album", results: mockSpotifyAlbumSummaries(query), demoMode: true });
        }
        return res.json(mockCatalogSearch("spotify", query));
      }
      return res.status(401).json({
        error: "spotify token is unavailable",
        code: tokenResult.code || "SPOTIFY_TOKEN_UNAVAILABLE"
      });
    }

    if (!sessions.spotify?.country) {
      await getSpotifyCurrentUserProfile({ sessions, persist });
    }
    const market = sessions.spotify?.country || undefined;
    const searchLimit = Number(req.query.limit || 10);

    const searchFn = searchType === "album" ? spotifySearchAlbums : spotifySearchTracks;
    let liveResult = await searchFn({
      accessToken: tokenResult.accessToken,
      query,
      limit: searchLimit,
      market
    });

    if (!liveResult.ok && liveResult.status === 401) {
      const refreshResult = await getSpotifyAccessToken({ sessions, persist, forceRefresh: true });
      if (!refreshResult.ok) {
        return res.status(401).json({
          error: "spotify token refresh failed",
          code: refreshResult.code || "SPOTIFY_REFRESH_FAILED"
        });
      }
      liveResult = await searchFn({
        accessToken: refreshResult.accessToken,
        query,
        limit: searchLimit,
        market
      });
    }

    if (!liveResult.ok) {
      if (liveResult.status === 429) {
        const { rateLimitUserMessage, parseRetryAfterSeconds } = require("./lib/rateLimitBackoff");
        const retryAfterSec =
          liveResult.retryAfterSec || parseRetryAfterSeconds(liveResult.retryAfter) || 60;
        res.set("Retry-After", String(retryAfterSec));
        return res.status(429).json({
          error: liveResult.message || rateLimitUserMessage("spotify", retryAfterSec),
          code: "SPOTIFY_RATE_LIMIT",
          retryAfterSec: Number(retryAfterSec) || 60
        });
      }
      return res.status(502).json({ error: "spotify search failed", code: "SPOTIFY_SEARCH_FAILED" });
    }

    let results = liveResult.results;
    if (searchType === "track") {
      const enrichResult = await enrichSpotifyTracksWithImages({ sessions, persist, tracks: results });
      if (enrichResult.ok) {
        results = enrichResult.tracks;
      }
      return res.json({ provider, results });
    }

    return res.json({ provider, kind: "album", results });
  }

  if (provider === "soundcloud") {
    const searchType = (req.query.type || "track").toString().toLowerCase() === "album" ? "album" : "track";
    const tokenResult = await getSoundCloudAccessToken({ sessions, persist });
    if (!tokenResult.ok) {
      const useMock =
        tokenResult.code === "SOUNDCLOUD_REFRESH_MISSING" ||
        tokenResult.code === "SOUNDCLOUD_OAUTH_CONFIG_MISSING";
      if (useMock) {
        if (randomFail(0.08)) {
          return res.status(429).json({ error: `${provider} rate limit`, code: "PROVIDER_RATE_LIMIT" });
        }
        if (searchType === "album") {
          return res.json({
            provider,
            kind: "album",
            results: mockSoundCloudAlbumSummaries(query),
            demoMode: true
          });
        }
        return res.json(mockCatalogSearch("soundcloud", query));
      }
      return res.status(401).json({
        error: "soundcloud token is unavailable",
        code: tokenResult.code || "SOUNDCLOUD_TOKEN_UNAVAILABLE"
      });
    }

    const searchLimit = Number(req.query.limit || 10);
    const searchFn = searchType === "album" ? soundCloudSearchAlbums : soundCloudSearchTracks;
    let liveResult = await searchFn({
      accessToken: tokenResult.accessToken,
      query,
      limit: searchLimit
    });

    if (!liveResult.ok && liveResult.status === 401) {
      const refreshResult = await getSoundCloudAccessToken({ sessions, persist, forceRefresh: true });
      if (!refreshResult.ok) {
        return res.status(401).json({
          error: "soundcloud token refresh failed",
          code: refreshResult.code || "SOUNDCLOUD_REFRESH_FAILED"
        });
      }
      liveResult = await searchFn({
        accessToken: refreshResult.accessToken,
        query,
        limit: searchLimit
      });
    }

    if (!liveResult.ok) {
      if (liveResult.status === 429) {
        if (liveResult.retryAfter) {
          res.set("Retry-After", String(liveResult.retryAfter));
        }
        return res.status(429).json({ error: "soundcloud rate limit", code: "SOUNDCLOUD_RATE_LIMIT" });
      }
      return res.status(502).json({ error: "soundcloud search failed", code: "SOUNDCLOUD_SEARCH_FAILED" });
    }

    if (searchType === "album") {
      return res.json({ provider, kind: "album", results: liveResult.results });
    }

    return res.json({ provider, results: liveResult.results });
  }

  if (provider === "applemusic") {
    if (!isAppleMusicConfigured()) {
      return res.status(503).json(appleMusicNotConfiguredBody());
    }
    const connectCheck = ensureConnected("applemusic");
    if (!connectCheck.ok) {
      return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
    }
    const searchType =
      (req.query.type || "track").toString().toLowerCase() === "album" ? "album" : "track";
    if (appleMusicAllowsDemoCatalog()) {
      if (searchType === "album") {
        return res.json({
          provider,
          kind: "album",
          results: mockAppleMusicAlbumSummaries(query),
          demoMode: true
        });
      }
      return res.json({ ...mockCatalogSearch("applemusic", query), demoMode: true });
    }
    return res.status(503).json({
      error: "Live Apple Music search is not enabled yet. Server credentials are present.",
      code: "APPLE_MUSIC_API_PENDING"
    });
  }

  if (randomFail(0.08)) {
    return res.status(429).json({ error: `${provider} rate limit`, code: "PROVIDER_RATE_LIMIT" });
  }

  return res.json(mockCatalogSearch(provider, query));
});

app.get("/api/applemusic/config", (_req, res) => {
  return res.json({
    configured: isAppleMusicConfigured(),
    hint: isAppleMusicConfigured() ? null : appleMusicSetupHint()
  });
});

app.get("/api/applemusic/playlists", async (req, res) => {
  if (!isAppleMusicConfigured()) {
    return res.status(503).json(appleMusicNotConfiguredBody());
  }
  const connectCheck = ensureConnected("applemusic");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }
  if (appleMusicAllowsDemoCatalog()) {
    return res.json({ ...mockAppleMusicLibrary(), demoMode: true });
  }
  return res.status(503).json({
    error: "Live Apple Music library is not enabled yet. Server credentials are present.",
    code: "APPLE_MUSIC_API_PENDING"
  });
});

app.get("/api/applemusic/playlists/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  if (!isAppleMusicConfigured()) {
    return res.status(503).json(appleMusicNotConfiguredBody());
  }
  const connectCheck = ensureConnected("applemusic");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }
  const limit = Math.min(Number(req.query.limit || 50) || 50, 100);
  const offset = Math.max(Number(req.query.offset || 0) || 0, 0);
  if (appleMusicAllowsDemoCatalog()) {
    const all = mockAppleMusicPlaylistTracks(playlistId);
    if (!all) {
      return res.status(404).json({ error: "playlist not found", code: "APPLE_MUSIC_PLAYLIST_NOT_FOUND" });
    }
    const items = all.slice(offset, offset + limit);
    const nextOffset = offset + items.length < all.length ? offset + items.length : null;
    return res.json({ items, nextOffset, demoMode: true });
  }
  return res.status(503).json({
    error: "Live Apple Music playlist tracks are not enabled yet.",
    code: "APPLE_MUSIC_API_PENDING"
  });
});

app.get("/api/applemusic/albums/:albumId/tracks", async (req, res) => {
  const { albumId } = req.params;
  if (!isAppleMusicConfigured()) {
    return res.status(503).json(appleMusicNotConfiguredBody());
  }
  const connectCheck = ensureConnected("applemusic");
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }
  const limit = Math.min(Number(req.query.limit || 50) || 50, 100);
  const offset = Math.max(Number(req.query.offset || 0) || 0, 0);
  if (appleMusicAllowsDemoCatalog()) {
    const all = mockAppleMusicPlaylistTracks(albumId);
    if (!all) {
      return res.status(404).json({ error: "album not found", code: "APPLE_MUSIC_ALBUM_NOT_FOUND" });
    }
    const items = all.slice(offset, offset + limit);
    const nextOffset = offset + items.length < all.length ? offset + items.length : null;
    return res.json({ items, nextOffset, demoMode: true });
  }
  return res.status(503).json({
    error: "Live Apple Music album tracks are not enabled yet.",
    code: "APPLE_MUSIC_API_PENDING"
  });
});

app.get("/api/queue", (_req, res) => {
  res.json(queueState);
});

app.post("/api/queue", (req, res) => {
  const { provider, trackId, track } = req.body || {};

  if (!provider || !trackId) {
    return res.status(400).json({ error: "provider and trackId are required" });
  }

  const connectCheck = ensureConnected(provider);
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const capabilityCheck = ensureCapabilityFor(provider, "libraryAccess");
  if (!capabilityCheck.ok) {
    return res.status(400).json({ error: capabilityCheck.message, code: capabilityCheck.code });
  }

  const found = providers[provider].tracks.find((t) => t.id === trackId);
  const liveTrack =
    !found &&
    track &&
    track.id === trackId &&
    typeof track.title === "string" &&
    typeof track.artist === "string"
      ? {
          id: track.id,
          title: track.title,
          artist: track.artist,
          durationSec: Number.isFinite(Number(track.durationSec)) ? Number(track.durationSec) : 180,
          permalinkUrl:
            typeof track.permalinkUrl === "string" && track.permalinkUrl.trim()
              ? track.permalinkUrl.trim()
              : undefined,
          imageUrl:
            typeof track.imageUrl === "string" && track.imageUrl.trim()
              ? track.imageUrl.trim()
              : undefined
        }
      : null;
  let resolvedTrack = found || liveTrack;
  if (
    found &&
    track &&
    track.id === trackId &&
    typeof track.imageUrl === "string" &&
    track.imageUrl.trim()
  ) {
    resolvedTrack = { ...found, imageUrl: track.imageUrl.trim() };
  }

  if (!resolvedTrack) {
    return res.status(404).json({ error: "track not found for provider" });
  }

  if (provider === "soundcloud") {
    const permalink =
      (resolvedTrack.permalinkUrl && String(resolvedTrack.permalinkUrl).trim()) || "";
    if (!isValidSoundCloudPermalink(permalink)) {
      return res.status(400).json({
        error: "soundcloud track requires a valid https://soundcloud.com/... permalinkUrl",
        code: "SOUNDCLOUD_PERMALINK_REQUIRED"
      });
    }
  }

  const queueItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    provider,
    trackId: resolvedTrack.id,
    title: resolvedTrack.title,
    artist: resolvedTrack.artist,
    durationSec: resolvedTrack.durationSec,
    status: "queued",
    ...(provider === "soundcloud" && {
      permalinkUrl: String(resolvedTrack.permalinkUrl).trim()
    }),
    ...(resolvedTrack.imageUrl && {
      imageUrl: String(resolvedTrack.imageUrl).trim()
    })
  };

  const nextQueue = [...queueState.queue, queueItem];
  setQueueState({
    queue: nextQueue,
    status: queueState.currentIndex === -1 ? "ready" : queueState.status,
    lastError: null
  });
  return res.status(201).json(queueItem);
});

app.delete("/api/queue/:id", (req, res) => {
  const idx = queueState.queue.findIndex((q) => q.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "item not found" });
  }

  const item = queueState.queue[idx];
  if (!canRemoveQueueItemAt(item, idx, queueState)) {
    return res.status(400).json({ error: "cannot remove this track" });
  }

  const result = removeQueueItemAt(queueState.queue, idx, queueState.currentIndex);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  let nextStatus = queueState.status;
  if (result.queueEmpty) {
    nextStatus = "idle";
  } else if (result.removedPlaying) {
    nextStatus = result.nextCurrentIndex >= 0 ? "ready" : "idle";
  }

  setQueueState({
    queue: result.nextQueue,
    currentIndex: result.nextCurrentIndex,
    status: nextStatus,
    lastError: result.queueEmpty ? null : queueState.lastError
  });

  return res.status(204).send();
});

app.post("/api/queue/reorder", (req, res) => {
  const { fromIndex, toIndex } = req.body || {};
  const from = Number(fromIndex);
  const to = Number(toIndex);

  const result = reorderWithCursor(queueState.queue, from, to, queueState.currentIndex);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  if (!result.reorderApplied) {
    return res.json({ ...queueState, reorderApplied: false });
  }

  setQueueState({ queue: result.nextQueue, currentIndex: result.nextCurrentIndex });
  return res.json({ ...queueState, reorderApplied: true });
});

app.post("/api/queue/now-playing", (req, res) => {
  const { index } = req.body || {};
  const idx = Number(index);

  if (Number.isNaN(idx) || idx < -1 || idx >= queueState.queue.length) {
    return res.status(400).json({ error: "invalid index" });
  }

  const effectiveCurrentIndex =
    idx === -1
      ? queueState.currentIndex
      : resolveEffectiveCurrentIndex(
          queueState.queue,
          queueState.currentIndex,
          queueState.status
        );

  const selected =
    idx === -1
      ? { nextQueue: mapQueueOnQueueEnd(queueState.queue), nextCurrentIndex: -1 }
      : selectNowPlayingWithReorder(queueState.queue, effectiveCurrentIndex, idx);
  const nextQueue =
    idx === -1
      ? selected.nextQueue
      : mapQueueForNowPlaying(selected.nextQueue, selected.nextCurrentIndex);

  setQueueState({
    queue: nextQueue,
    currentIndex: idx === -1 ? -1 : selected.nextCurrentIndex,
    status: idx === -1 ? "finished" : "playing",
    transitionReason: "manual-select",
    lastError: null
  });
  return res.json(queueState);
});

app.post("/api/playback/advance", (req, res) => {
  const { reason } = req.body || {};

  if (queueState.currentIndex === -1) {
    return res.status(400).json({ error: "no active track" });
  }

  const leavingIndex = queueState.currentIndex;
  const { nextQueue: prunedQueue, nextCurrentIndex, queueEnded } = pruneQueueAfterLeavingTrack(
    queueState.queue,
    leavingIndex
  );

  if (queueEnded) {
    setQueueState({
      queue: prunedQueue,
      currentIndex: -1,
      status: prunedQueue.length === 0 ? "idle" : "finished",
      transitionReason: reason || "queue-end",
      lastError: null
    });
    return res.json(queueState);
  }

  const nextItem = prunedQueue[nextCurrentIndex];
  const connectCheck = ensureConnected(nextItem.provider);
  if (!connectCheck.ok) {
    setQueueState({
      queue: mapQueueAfterPrune(prunedQueue, nextCurrentIndex),
      currentIndex: nextCurrentIndex,
      status: "recovering",
      lastError: { code: connectCheck.code, message: connectCheck.message },
      transitionReason: "recovering-connection"
    });
    return res.status(401).json(queueState);
  }

  const capabilityCheck = ensureCapabilityFor(nextItem.provider, "playbackControl");
  if (!capabilityCheck.ok) {
    setQueueState({
      queue: mapQueueAfterPrune(prunedQueue, nextCurrentIndex),
      currentIndex: nextCurrentIndex,
      status: "skipped",
      lastError: { code: capabilityCheck.code, message: capabilityCheck.message },
      transitionReason: "capability-skip"
    });
    return res.status(400).json(queueState);
  }

  const nextQueue = mapQueueAfterPrune(prunedQueue, nextCurrentIndex);
  setQueueState({
    queue: nextQueue,
    currentIndex: nextCurrentIndex,
    status: "playing",
    transitionReason: reason || "auto-advance",
    lastError: null
  });
  return res.json(queueState);
});

app.use((req, res, next) => {
  if (/\.(js|html)$/i.test(req.path)) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});
app.use(express.static(path.join(__dirname, "public")));

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    const hostLabel = HOST === "0.0.0.0" ? "all interfaces" : HOST;
    console.log(`Unified queue MVP running at http://${HOST === "0.0.0.0" ? "127.0.0.1" : HOST}:${PORT} (bind: ${hostLabel})`);
    console.log(
      "API meta: spotify + soundcloud playlist library routes enabled (restart required after pulling library changes)"
    );
    const scOk = Boolean(process.env.SOUNDCLOUD_CLIENT_ID && String(process.env.SOUNDCLOUD_CLIENT_ID).trim());
    const spOk = Boolean(process.env.SPOTIFY_CLIENT_ID && String(process.env.SPOTIFY_CLIENT_ID).trim());
    console.log(
      scOk
        ? "SoundCloud OAuth: configured (SOUNDCLOUD_CLIENT_ID)"
        : "SoundCloud OAuth: not configured — set SOUNDCLOUD_CLIENT_ID in .env and restart"
    );
    console.log(
      spOk
        ? "Spotify OAuth: configured (SPOTIFY_CLIENT_ID)"
        : "Spotify OAuth: not configured (optional for simulated Connect)"
    );
    if (spOk && !spotifyEnvIncludesPlaylistReadScopes()) {
      console.warn(
        "Spotify playlists: SPOTIFY_SCOPES is missing playlist-read-private / playlist-read-collaborative — playlist browser will fail until .env is updated and you reconnect."
      );
    }
  });
}

module.exports = app;
if (process.env.NODE_ENV === "test") {
  module.exports.mapSpotifyBrowseError = mapSpotifyBrowseError;
}
