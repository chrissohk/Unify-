const { nowSec } = require("./playbackGuards");
const {
  isProviderRateLimited,
  applyRateLimitToSession,
  rateLimitUserMessage,
  secondsUntilRateLimitClear,
  parseRetryAfterSeconds
} = require("./rateLimitBackoff");
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_SEARCH_URL = `${SPOTIFY_API_BASE}/search`;
const SPOTIFY_PLAYER_URL = `${SPOTIFY_API_BASE}/me/player`;
const EXPIRY_SAFETY_WINDOW_SEC = 30;
const MAX_SPOTIFY_PLAYLIST_PAGES = 20;
/** Virtual id for the user's Liked Songs collection (GET /v1/me/tracks). */
const SPOTIFY_LIKED_SONGS_ID = "__liked_songs__";

function isTokenFresh(expiresAt) {
  return Number(expiresAt || 0) > nowSec() + EXPIRY_SAFETY_WINDOW_SEC;
}

function spotifyRateLimitError({ sessions, persist, retryAfterHeader, details }) {
  const spotify = sessions.spotify || {};
  const retryAfterSec = applyRateLimitToSession(spotify, retryAfterHeader, persist);
  sessions.spotify = spotify;
  return {
    ok: false,
    status: 429,
    code: "SPOTIFY_RATE_LIMIT",
    message: rateLimitUserMessage("spotify", retryAfterSec),
    retryAfterSec,
    retryAfter: retryAfterHeader,
    details
  };
}

function spotifyHttpFailure({ sessions, persist, response, details, fallbackCode }) {
  if (response.status === 429) {
    return spotifyRateLimitError({
      sessions,
      persist,
      retryAfterHeader: response.headers.get("retry-after"),
      details
    });
  }
  return {
    ok: false,
    status: response.status,
    code: fallbackCode,
    details
  };
}

async function refreshSpotifyAccessToken({ sessions, persist }) {
  const spotify = sessions.spotify || {};
  const refreshToken = spotify.refreshToken;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!refreshToken) {
    return { ok: false, code: "SPOTIFY_REFRESH_MISSING", message: "spotify refresh token is missing" };
  }
  if (!clientId || !clientSecret) {
    return { ok: false, code: "SPOTIFY_OAUTH_CONFIG_MISSING", message: "spotify oauth client credentials are missing" };
  }

  if (isProviderRateLimited(spotify)) {
    const retryAfterSec = secondsUntilRateLimitClear(spotify) || 60;
    return {
      ok: false,
      code: "SPOTIFY_RATE_LIMIT",
      status: 429,
      message: rateLimitUserMessage("spotify", retryAfterSec),
      retryAfterSec
    };
  }

  const tokenRes = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  if (!tokenRes.ok) {
    const bodyText = await tokenRes.text();
    if (tokenRes.status === 429) {
      const retryAfterSec = applyRateLimitToSession(spotify, tokenRes.headers.get("retry-after"), persist);
      sessions.spotify = spotify;
      return {
        ok: false,
        code: "SPOTIFY_RATE_LIMIT",
        status: 429,
        message: rateLimitUserMessage("spotify", retryAfterSec),
        retryAfterSec,
        details: bodyText
      };
    }
    return {
      ok: false,
      code: "SPOTIFY_REFRESH_FAILED",
      status: tokenRes.status,
      message: "spotify token refresh failed",
      details: bodyText
    };
  }

  const tokens = await tokenRes.json();
  spotify.accessToken = tokens.access_token;
  spotify.expiresAt = nowSec() + (tokens.expires_in || 3600);
  if (tokens.refresh_token) {
    spotify.refreshToken = tokens.refresh_token;
  }
  spotify.refreshFailures = 0;
  spotify.rateLimitUntil = 0;
  sessions.spotify = spotify;
  persist();

  return { ok: true, accessToken: spotify.accessToken };
}

async function getSpotifyAccessToken({ sessions, persist, forceRefresh = false }) {
  const spotify = sessions.spotify || {};
  const tokenFresh = isTokenFresh(spotify.expiresAt);
  const rateLimited = isProviderRateLimited(spotify);
  if (!forceRefresh && spotify.accessToken && tokenFresh) {
    return { ok: true, accessToken: spotify.accessToken };
  }

  if (isProviderRateLimited(spotify)) {
    if (spotify.accessToken && !forceRefresh) {
      return { ok: true, accessToken: spotify.accessToken };
    }
    const retryAfterSec = secondsUntilRateLimitClear(spotify) || 60;
    return {
      ok: false,
      code: "SPOTIFY_RATE_LIMIT",
      status: 429,
      message: rateLimitUserMessage("spotify", retryAfterSec),
      retryAfterSec
    };
  }

  const refreshed = await refreshSpotifyAccessToken({ sessions, persist });
  if (!refreshed.ok) {
    if (refreshed.code === "SPOTIFY_RATE_LIMIT" && spotify.accessToken && !forceRefresh) {
      return { ok: true, accessToken: spotify.accessToken };
    }
    return refreshed;
  }

  return { ok: true, accessToken: refreshed.accessToken };
}

const TRACKS_BATCH_MAX = 50;

/** Spotify album images are widest-first; prefer smallest for list thumbnails. */
function pickAlbumImageUrl(images) {
  if (!Array.isArray(images) || images.length === 0) return undefined;
  const smallest = images[images.length - 1];
  const largest = images[0];
  if (typeof smallest?.url === "string") return smallest.url;
  if (typeof largest?.url === "string") return largest.url;
  return undefined;
}

function spotifyMarketQuery(sessions) {
  const country = sessions?.spotify?.country;
  if (typeof country === "string" && /^[A-Z]{2}$/i.test(country)) {
    return `&market=${encodeURIComponent(country.toUpperCase())}`;
  }
  return "";
}

function parseAddedAt(value) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const ms = Date.parse(value.trim());
  if (!Number.isFinite(ms)) return undefined;
  return value.trim();
}

function normalizeTrack(track) {
  const imageUrl = pickAlbumImageUrl(track.album?.images);
  return {
    id: track.id,
    title: track.name,
    artist: (track.artists || []).map((artist) => artist.name).join(", "),
    durationSec: Math.round((track.duration_ms || 0) / 1000),
    imageUrl,
    provider: "spotify"
  };
}

/**
 * Track count from SimplifiedPlaylistObject (items.total preferred; tracks.total deprecated).
 * Returns null when Spotify omits both (caller may enrich via GET /playlists/{id}).
 */
function resolvePlaylistTrackCount(playlist) {
  if (!playlist) return null;
  const itemsTotal = playlist.items?.total;
  if (typeof itemsTotal === "number") return itemsTotal;
  const tracksTotal = playlist.tracks?.total;
  if (typeof tracksTotal === "number") return tracksTotal;
  return null;
}

/**
 * Playlist row from GET /v1/me/playlists (simplified for the unified-queue UI).
 */
function normalizePlaylistSummary(playlist) {
  if (!playlist || !playlist.id) return null;
  const owner = playlist.owner || {};
  const ownerDisplayName = owner.display_name || owner.id || "";
  const resolvedCount = resolvePlaylistTrackCount(playlist);
  return {
    id: playlist.id,
    name: playlist.name || "Untitled",
    ownerId: owner.id || "",
    ownerDisplayName,
    trackCount: resolvedCount ?? 0,
    _missingTrackCount: resolvedCount === null,
    public: Boolean(playlist.public),
    provider: "spotify"
  };
}

function stripPlaylistSummaryInternals(summary) {
  if (!summary) return summary;
  const { _missingTrackCount, ...rest } = summary;
  return rest;
}

function stripPlaylistSummaryForClient(summary, { omitSongCounts = false } = {}) {
  const out = stripPlaylistSummaryInternals(summary);
  if (!out || !omitSongCounts) return out;
  const { trackCount, trackCountPending, trackCountHasMore, ...rest } = out;
  return rest;
}

async function countPlaylistTracksViaPages({ sessions, persist, playlistId }) {
  let total = 0;
  let offset = 0;
  const pageLimit = 50;
  for (let pages = 0; pages < MAX_SPOTIFY_PLAYLIST_PAGES; pages += 1) {
    const pageUrl = `${SPOTIFY_API_BASE}/playlists/${encodeURIComponent(
      playlistId
    )}/items?limit=${pageLimit}&offset=${offset}&additional_types=track`;
    const pageResult = await spotifyApiRequest({ sessions, persist, method: "GET", url: pageUrl });
    if (!pageResult.ok) {
      return null;
    }
    const { response } = pageResult;
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    const rows = payload?.items || [];
    for (const row of rows) {
      if (normalizePlaylistTrackRow(row)) {
        total += 1;
      }
    }
    if (!payload?.next || rows.length === 0) {
      break;
    }
    offset += rows.length;
  }
  return total;
}

async function fetchPlaylistItemTotal({ sessions, persist, playlistId }) {
  const itemsUrl = `${SPOTIFY_API_BASE}/playlists/${encodeURIComponent(
    playlistId
  )}/items?limit=1&offset=0&additional_types=track`;
  const itemsResult = await spotifyApiRequest({ sessions, persist, method: "GET", url: itemsUrl });
  if (itemsResult.ok) {
    const { response } = itemsResult;
    if (response.ok) {
      const payload = await response.json();
      if (typeof payload?.total === "number" && payload.total > 0) {
        return payload.total;
      }
    }
  }

  const metaUrl = `${SPOTIFY_API_BASE}/playlists/${encodeURIComponent(playlistId)}?fields=items(total),tracks(total)`;
  const metaResult = await spotifyApiRequest({ sessions, persist, method: "GET", url: metaUrl });
  if (metaResult.ok) {
    const { response: metaResponse } = metaResult;
    if (metaResponse.ok) {
      const meta = await metaResponse.json();
      const metaCount = resolvePlaylistTrackCount(meta);
      if (typeof metaCount === "number" && metaCount > 0) {
        return metaCount;
      }
    }
  }

  return countPlaylistTracksViaPages({ sessions, persist, playlistId });
}

async function enrichPlaylistTrackCounts({ sessions, persist, summaries, concurrency = 5 }) {
  const pending = (summaries || []).filter((s) => s && s.id);
  for (let i = 0; i < pending.length; i += concurrency) {
    const batch = pending.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (summary) => {
        const total = await fetchPlaylistItemTotal({ sessions, persist, playlistId: summary.id });
        if (total !== null) {
          summary.trackCount = total;
        }
        summary._missingTrackCount = false;
      })
    );
  }
  return summaries;
}

/**
 * One element from GET /v1/playlists/{id}/tracks. Skips removed rows, episodes, locals.
 */
function normalizePlaylistTrackRow(playlistTrack) {
  if (!playlistTrack) return null;
  const t = playlistTrack.track || playlistTrack.item;
  if (!t) return null;
  if (t.is_local) return null;
  if (t.type && t.type !== "track") return null;
  if (!t.id) return null;
  const normalized = normalizeTrack(t);
  const addedAt = parseAddedAt(playlistTrack.added_at);
  if (addedAt) normalized.addedAt = addedAt;
  return normalized;
}

async function spotifySearchTracks({ accessToken, query, limit = 10, market }) {
  const params = new URLSearchParams({
    q: query || "",
    type: "track",
    limit: String(limit)
  });
  if (typeof market === "string" && /^[A-Z]{2}$/i.test(market)) {
    params.set("market", market.toUpperCase());
  }
  const searchRes = await fetch(`${SPOTIFY_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!searchRes.ok) {
    const details = await searchRes.text();
    if (searchRes.status === 429) {
      const retryAfterSec = parseRetryAfterSeconds(searchRes.headers.get("retry-after"));
      return {
        ok: false,
        status: 429,
        code: "SPOTIFY_RATE_LIMIT",
        message: rateLimitUserMessage("spotify", retryAfterSec),
        retryAfterSec,
        retryAfter: searchRes.headers.get("retry-after"),
        details
      };
    }
    return {
      ok: false,
      status: searchRes.status,
      code: "SPOTIFY_SEARCH_FAILED",
      details
    };
  }

  const payload = await searchRes.json();
  const items = payload?.tracks?.items || [];
  return {
    ok: true,
    results: items.map(normalizeTrack)
  };
}

function normalizeAlbumSummary(album) {
  if (!album || !album.id) return null;
  const releaseDate = typeof album.release_date === "string" ? album.release_date : "";
  const releaseYear = releaseDate.length >= 4 ? releaseDate.slice(0, 4) : "";
  return {
    id: album.id,
    name: album.name || "Untitled",
    artist: (album.artists || []).map((artist) => artist.name).join(", "),
    imageUrl: pickAlbumImageUrl(album.images),
    releaseYear,
    trackCount: typeof album.total_tracks === "number" ? album.total_tracks : 0,
    provider: "spotify",
    kind: "album"
  };
}

async function spotifySearchAlbums({ accessToken, query, limit = 10, market }) {
  const params = new URLSearchParams({
    q: query || "",
    type: "album",
    limit: String(limit)
  });
  if (typeof market === "string" && /^[A-Z]{2}$/i.test(market)) {
    params.set("market", market.toUpperCase());
  }
  const searchRes = await fetch(`${SPOTIFY_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!searchRes.ok) {
    const details = await searchRes.text();
    if (searchRes.status === 429) {
      const retryAfterSec = parseRetryAfterSeconds(searchRes.headers.get("retry-after"));
      return {
        ok: false,
        status: 429,
        code: "SPOTIFY_RATE_LIMIT",
        message: rateLimitUserMessage("spotify", retryAfterSec),
        retryAfterSec,
        retryAfter: searchRes.headers.get("retry-after"),
        details
      };
    }
    return {
      ok: false,
      status: searchRes.status,
      code: "SPOTIFY_SEARCH_FAILED",
      details
    };
  }

  const payload = await searchRes.json();
  const items = payload?.albums?.items || [];
  return {
    ok: true,
    results: items.map(normalizeAlbumSummary).filter(Boolean)
  };
}

/**
 * Album cover for stamping on simplified album track rows (non-fatal on failure).
 */
async function spotifyFetchAlbumImageUrl({ sessions, persist, albumId }) {
  const marketQ = spotifyMarketQuery(sessions);
  const albumUrl = `${SPOTIFY_API_BASE}/albums/${encodeURIComponent(albumId)}${
    marketQ ? `?${marketQ.slice(1)}` : ""
  }`;
  const requestResult = await spotifyApiRequest({ sessions, persist, method: "GET", url: albumUrl });
  if (!requestResult.ok) {
    return undefined;
  }
  const { response } = requestResult;
  if (!response.ok) {
    return undefined;
  }
  const payload = await response.json();
  return pickAlbumImageUrl(payload?.images);
}

/**
 * Tracks on an album (offset pagination).
 */
async function spotifyListAlbumTracks({ sessions, persist, albumId, limit = 50, offset = 0 }) {
  if (!albumId || typeof albumId !== "string") {
    return { ok: false, code: "SPOTIFY_ALBUM_ID_INVALID", status: 400, details: "missing album id" };
  }
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const marketQ = spotifyMarketQuery(sessions);
  const albumImageUrl = await spotifyFetchAlbumImageUrl({ sessions, persist, albumId });
  const url = `${SPOTIFY_API_BASE}/albums/${encodeURIComponent(albumId)}/tracks?limit=${safeLimit}&offset=${safeOffset}${marketQ}`;
  const requestResult = await spotifyApiRequest({ sessions, persist, method: "GET", url });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok) {
    const details = await response.text();
    return spotifyHttpFailure({
      sessions,
      persist,
      response,
      details,
      fallbackCode: "SPOTIFY_ALBUM_TRACKS_FAILED"
    });
  }
  const payload = await response.json();
  const rawItems = payload?.items || [];
  let results = rawItems.map(normalizeTrack).filter((t) => t?.id);
  if (albumImageUrl) {
    results = results.map((t) => (t.imageUrl ? t : { ...t, imageUrl: albumImageUrl }));
  }
  const nextOffset =
    payload?.next && typeof payload.next === "string" ? safeOffset + rawItems.length : null;
  return { ok: true, results, nextOffset };
}

async function spotifyApiRequest({ sessions, persist, method = "GET", url, headers = {}, body, retryOn401 = true }) {
  const spotify = sessions.spotify || {};
  if (isProviderRateLimited(spotify)) {
    const retryAfterSec = secondsUntilRateLimitClear(spotify) || 60;
    return {
      ok: false,
      status: 429,
      code: "SPOTIFY_RATE_LIMIT",
      message: rateLimitUserMessage("spotify", retryAfterSec),
      retryAfterSec
    };
  }

  const tokenResult = await getSpotifyAccessToken({ sessions, persist });
  if (!tokenResult.ok) {
    return tokenResult;
  }

  const makeRequest = async (accessToken) =>
    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers
      },
      body
    });

  let response = await makeRequest(tokenResult.accessToken);
  if (response.status === 401 && retryOn401) {
    const refreshResult = await getSpotifyAccessToken({ sessions, persist, forceRefresh: true });
    if (!refreshResult.ok) {
      return refreshResult;
    }
    response = await makeRequest(refreshResult.accessToken);
  }

  return { ok: true, response };
}

/**
 * Fills missing imageUrl via GET /v1/tracks?ids= when playlist/search payloads omit album art.
 */
async function enrichSpotifyTracksWithImages({ sessions, persist, tracks }) {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return { ok: true, tracks: tracks || [] };
  }
  const missingIds = [...new Set(tracks.filter((t) => t?.id && !t.imageUrl).map((t) => t.id))];
  if (missingIds.length === 0) {
    return { ok: true, tracks };
  }

  const imageById = new Map();
  const marketQ = spotifyMarketQuery(sessions);

  for (let i = 0; i < missingIds.length; i += TRACKS_BATCH_MAX) {
    const chunk = missingIds.slice(i, i + TRACKS_BATCH_MAX);
    const url = `${SPOTIFY_API_BASE}/tracks?ids=${encodeURIComponent(chunk.join(","))}${marketQ}`;
    const requestResult = await spotifyApiRequest({ sessions, persist, method: "GET", url });
    if (!requestResult.ok) {
      if (requestResult.status === 429 || requestResult.code === "SPOTIFY_RATE_LIMIT") {
        return requestResult;
      }
      continue;
    }
    const { response } = requestResult;
    if (!response.ok) {
      const details = await response.text();
      if (response.status === 429) {
        return spotifyRateLimitError({
          sessions,
          persist,
          retryAfterHeader: response.headers.get("retry-after"),
          details
        });
      }
      continue;
    }
    const payload = await response.json();
    for (const raw of payload?.tracks || []) {
      if (!raw?.id) continue;
      const imageUrl = pickAlbumImageUrl(raw.album?.images);
      if (imageUrl) {
        imageById.set(raw.id, imageUrl);
      }
    }
  }

  const enriched = tracks.map((t) => {
    if (!t?.id || t.imageUrl) return t;
    const imageUrl = imageById.get(t.id);
    return imageUrl ? { ...t, imageUrl } : t;
  });
  return { ok: true, tracks: enriched };
}

function isPlaylistOwnedByUser(summary, profile) {
  if (!summary || !profile?.id) return false;
  if (summary.ownerId) {
    return summary.ownerId === profile.id;
  }
  if (profile.displayName && summary.ownerDisplayName) {
    return summary.ownerDisplayName === profile.displayName;
  }
  return false;
}

async function getSpotifyCurrentUserProfile({ sessions, persist, forceRefresh = false }) {
  const spotify = sessions.spotify || {};
  if (!forceRefresh && spotify.userId) {
    return {
      ok: true,
      userId: spotify.userId,
      displayName: spotify.displayName || "",
      country: spotify.country || ""
    };
  }

  const requestResult = await spotifyApiRequest({
    sessions,
    persist,
    method: "GET",
    url: `${SPOTIFY_API_BASE}/me`
  });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok) {
    const details = await response.text();
    return spotifyHttpFailure({
      sessions,
      persist,
      response,
      details,
      fallbackCode: "SPOTIFY_PROFILE_FAILED"
    });
  }
  const profile = await response.json();
  if (!profile?.id) {
    return { ok: false, code: "SPOTIFY_PROFILE_FAILED", status: 502, details: "missing user id" };
  }
  spotify.userId = profile.id;
  spotify.displayName = profile.display_name || "";
  spotify.country = typeof profile.country === "string" ? profile.country.toUpperCase() : "";
  sessions.spotify = spotify;
  persist();
  return {
    ok: true,
    userId: profile.id,
    displayName: spotify.displayName,
    country: spotify.country
  };
}

async function getSpotifyCurrentUserId({ sessions, persist, forceRefresh = false }) {
  const profileResult = await getSpotifyCurrentUserProfile({ sessions, persist, forceRefresh });
  if (!profileResult.ok) {
    return profileResult;
  }
  return { ok: true, userId: profileResult.userId };
}

async function fetchSpotifyPlaylistPage({ sessions, persist, spotifyOffset, pageLimit }) {
  const url = `${SPOTIFY_API_BASE}/me/playlists?limit=${pageLimit}&offset=${spotifyOffset}&fields=items(id,name,public,owner,items(total),tracks(total)),next,limit,offset,total`;
  const requestResult = await spotifyApiRequest({ sessions, persist, method: "GET", url });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok) {
    const details = await response.text();
    return spotifyHttpFailure({
      sessions,
      persist,
      response,
      details,
      fallbackCode: "SPOTIFY_PLAYLISTS_FAILED"
    });
  }
  const payload = await response.json();
  const rawItems = payload?.items || [];
  return {
    ok: true,
    rawItems,
    hasMore: Boolean(payload?.next && typeof payload.next === "string")
  };
}

/**
 * Paginates GET /v1/me/playlists until enough owned or followed rows are collected.
 */
async function collectPlaylistsFromMeLibrary({
  sessions,
  persist,
  profile,
  limit,
  offset,
  includeOwned,
  enrichTrackCounts = true,
  omitSongCounts = false
}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const collected = [];
  let spotifyOffset = 0;
  let spotifyHasMore = true;
  let pagesFetched = 0;
  const targetCount = safeOffset + safeLimit;

  while (collected.length < targetCount && spotifyHasMore && pagesFetched < MAX_SPOTIFY_PLAYLIST_PAGES) {
    const page = await fetchSpotifyPlaylistPage({
      sessions,
      persist,
      spotifyOffset,
      pageLimit: 50
    });
    if (!page.ok) {
      return page;
    }
    pagesFetched += 1;
    for (const raw of page.rawItems) {
      const summary = normalizePlaylistSummary(raw);
      if (!summary) continue;
      const owned = isPlaylistOwnedByUser(summary, profile);
      if (includeOwned ? owned : !owned) {
        collected.push(
          includeOwned ? summary : { ...summary, kind: "liked_playlist" }
        );
      }
    }
    spotifyOffset += page.rawItems.length;
    spotifyHasMore = page.hasMore && page.rawItems.length > 0;
  }

  const items = collected.slice(safeOffset, safeOffset + safeLimit);
  if (enrichTrackCounts) {
    await enrichPlaylistTrackCounts({ sessions, persist, summaries: items });
  }
  const hasMoreCollected = collected.length > safeOffset + safeLimit;
  const nextOffset = hasMoreCollected || spotifyHasMore ? safeOffset + items.length : null;
  const strip = (summary) => stripPlaylistSummaryForClient(summary, { omitSongCounts });
  return { ok: true, items: items.map(strip), nextOffset };
}

/**
 * Playlists created by the current user (excludes followed playlists).
 */
async function spotifyResolveLibraryProfile({ sessions, persist, profile: profileIn }) {
  if (profileIn && profileIn.id) {
    return { ok: true, profile: profileIn };
  }
  const profileResult = await getSpotifyCurrentUserProfile({ sessions, persist, forceRefresh: false });
  if (!profileResult.ok) {
    return profileResult;
  }
  return {
    ok: true,
    profile: {
      id: profileResult.userId,
      displayName: profileResult.displayName || ""
    }
  };
}

async function spotifyListCurrentUserPlaylists({
  sessions,
  persist,
  limit = 50,
  offset = 0,
  profile: profileIn,
  enrichTrackCounts = true,
  omitSongCounts = false
}) {
  const profileResult = await spotifyResolveLibraryProfile({ sessions, persist, profile: profileIn });
  if (!profileResult.ok) {
    return profileResult;
  }
  return collectPlaylistsFromMeLibrary({
    sessions,
    persist,
    profile: profileResult.profile,
    limit,
    offset,
    includeOwned: true,
    enrichTrackCounts,
    omitSongCounts
  });
}

/**
 * Playlists the user follows but does not own (Spotify library "liked" playlists).
 */
async function spotifyListFollowedPlaylists({
  sessions,
  persist,
  limit = 50,
  offset = 0,
  profile: profileIn,
  enrichTrackCounts = true,
  omitSongCounts = false
}) {
  const profileResult = await spotifyResolveLibraryProfile({ sessions, persist, profile: profileIn });
  if (!profileResult.ok) {
    return profileResult;
  }
  return collectPlaylistsFromMeLibrary({
    sessions,
    persist,
    profile: profileResult.profile,
    limit,
    offset,
    includeOwned: false,
    enrichTrackCounts,
    omitSongCounts
  });
}

/**
 * Saved tracks (Liked Songs) — GET /v1/me/tracks.
 */
async function spotifyListSavedTracks({ sessions, persist, limit = 50, offset = 0 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const marketQ = spotifyMarketQuery(sessions);
  const url = `${SPOTIFY_API_BASE}/me/tracks?limit=${safeLimit}&offset=${safeOffset}${marketQ}`;
  const requestResult = await spotifyApiRequest({ sessions, persist, method: "GET", url });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok) {
    const details = await response.text();
    return spotifyHttpFailure({
      sessions,
      persist,
      response,
      details,
      fallbackCode: "SPOTIFY_LIKED_SONGS_FAILED"
    });
  }
  const payload = await response.json();
  const rawItems = payload?.items || [];
  let results = rawItems.map(normalizePlaylistTrackRow).filter(Boolean);
  const enrichResult = await enrichSpotifyTracksWithImages({ sessions, persist, tracks: results });
  if (!enrichResult.ok) {
    return enrichResult;
  }
  results = enrichResult.tracks;
  const nextOffset =
    payload?.next && typeof payload.next === "string" ? safeOffset + rawItems.length : null;
  return {
    ok: true,
    results,
    nextOffset,
    collectionTotal: typeof payload?.total === "number" ? payload.total : undefined
  };
}

function buildSpotifyLikedSongsSummary(trackCount) {
  const count =
    typeof trackCount === "number" && Number.isFinite(trackCount) ? Math.max(0, trackCount) : 0;
  return {
    id: SPOTIFY_LIKED_SONGS_ID,
    name: "Liked Songs",
    trackCount: count,
    kind: "liked_songs",
    provider: "spotify"
  };
}

function buildSpotifyLikedSongsSummaryWithoutCount() {
  return {
    id: SPOTIFY_LIKED_SONGS_ID,
    name: "Liked Songs",
    kind: "liked_songs",
    provider: "spotify"
  };
}

/**
 * Liked Songs row for the library sidebar (track count from GET /v1/me/tracks total).
 * Skips image enrichment — sidebar only needs total, not album art.
 */
async function spotifyFetchLikedSongsSummary({ sessions, persist }) {
  const marketQ = spotifyMarketQuery(sessions);
  const url = `${SPOTIFY_API_BASE}/me/tracks?limit=1&offset=0${marketQ}`;
  const requestResult = await spotifyApiRequest({ sessions, persist, method: "GET", url });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok) {
    const details = await response.text();
    return spotifyHttpFailure({
      sessions,
      persist,
      response,
      details,
      fallbackCode: "SPOTIFY_LIKED_SONGS_FAILED"
    });
  }
  const payload = await response.json();
  const trackCount =
    typeof payload?.total === "number" ? payload.total : (payload?.items || []).length;
  return { ok: true, likedSongs: buildSpotifyLikedSongsSummary(trackCount) };
}

/**
 * Tracks inside a playlist (offset pagination).
 */
async function spotifyListPlaylistTracks({ sessions, persist, playlistId, limit = 50, offset = 0 }) {
  if (!playlistId || typeof playlistId !== "string") {
    return { ok: false, code: "SPOTIFY_PLAYLIST_ID_INVALID", status: 400, details: "missing playlist id" };
  }
  if (playlistId === SPOTIFY_LIKED_SONGS_ID) {
    return spotifyListSavedTracks({ sessions, persist, limit, offset });
  }
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const marketQ = spotifyMarketQuery(sessions);
  const playlistPath = `${SPOTIFY_API_BASE}/playlists/${encodeURIComponent(playlistId)}`;
  const itemsUrl = `${playlistPath}/items?limit=${safeLimit}&offset=${safeOffset}&additional_types=track${marketQ}`;
  const requestResult = await spotifyApiRequest({ sessions, persist, method: "GET", url: itemsUrl });
  if (!requestResult.ok) {
    return requestResult;
  }
  let { response } = requestResult;
  if (!response.ok && response.status === 404) {
    const legacyUrl = `${playlistPath}/tracks?limit=${safeLimit}&offset=${safeOffset}${marketQ}`;
    const legacyResult = await spotifyApiRequest({ sessions, persist, method: "GET", url: legacyUrl });
    if (!legacyResult.ok) {
      return legacyResult;
    }
    response = legacyResult.response;
  }
  if (!response.ok) {
    const details = await response.text();
    return spotifyHttpFailure({
      sessions,
      persist,
      response,
      details,
      fallbackCode: "SPOTIFY_PLAYLIST_TRACKS_FAILED"
    });
  }
  const payload = await response.json();
  const rawItems = payload?.items || [];
  let results = rawItems.map(normalizePlaylistTrackRow).filter(Boolean);
  const enrichResult = await enrichSpotifyTracksWithImages({ sessions, persist, tracks: results });
  if (!enrichResult.ok) {
    return enrichResult;
  }
  results = enrichResult.tracks;
  const nextOffset =
    payload?.next && typeof payload.next === "string" ? safeOffset + rawItems.length : null;
  return { ok: true, results, nextOffset };
}

async function spotifyTransferPlayback({ sessions, persist, deviceId, play = false }) {
  const requestResult = await spotifyApiRequest({
    sessions,
    persist,
    method: "PUT",
    url: SPOTIFY_PLAYER_URL,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: Boolean(play)
    })
  });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok && response.status !== 204) {
    return {
      ok: false,
      code: "SPOTIFY_TRANSFER_FAILED",
      status: response.status,
      details: await response.text()
    };
  }
  return { ok: true };
}

/**
 * Sets repeat mode on the active Web Playback device so single-track playback does not loop
 * when the user previously enabled repeat in Spotify.
 * API: PUT /v1/me/player/repeat?state=off
 */
async function spotifySetRepeatMode({ sessions, persist, deviceId, state }) {
  const allowed = ["track", "context", "off"];
  const repeatState = allowed.includes(state) ? state : "off";
  const requestResult = await spotifyApiRequest({
    sessions,
    persist,
    method: "PUT",
    url: `${SPOTIFY_PLAYER_URL}/repeat?device_id=${encodeURIComponent(deviceId)}&state=${encodeURIComponent(repeatState)}`
  });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok && response.status !== 204) {
    return {
      ok: false,
      code: "SPOTIFY_REPEAT_FAILED",
      status: response.status,
      details: await response.text()
    };
  }
  return { ok: true };
}

async function spotifyStartTrack({ sessions, persist, deviceId, trackId, positionMs = 0 }) {
  const transferResult = await spotifyTransferPlayback({ sessions, persist, deviceId, play: false });
  if (!transferResult.ok) {
    return transferResult;
  }
  const repeatOffBefore = await spotifySetRepeatMode({ sessions, persist, deviceId, state: "off" });
  if (!repeatOffBefore.ok) {
    return repeatOffBefore;
  }
  const startMs = Math.max(0, Math.round(Number(positionMs) || 0));
  const requestResult = await spotifyApiRequest({
    sessions,
    persist,
    method: "PUT",
    url: `${SPOTIFY_PLAYER_URL}/play?device_id=${encodeURIComponent(deviceId)}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uris: [`spotify:track:${trackId}`],
      position_ms: startMs
    })
  });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok && response.status !== 204) {
    return {
      ok: false,
      code: "SPOTIFY_PLAY_FAILED",
      status: response.status,
      details: await response.text()
    };
  }
  return { ok: true };
}

async function spotifySetPauseState({ sessions, persist, deviceId, paused }) {
  const action = paused ? "pause" : "play";
  const requestResult = await spotifyApiRequest({
    sessions,
    persist,
    method: "PUT",
    url: `${SPOTIFY_PLAYER_URL}/${action}?device_id=${encodeURIComponent(deviceId)}`
  });
  if (!requestResult.ok) {
    return requestResult;
  }
  const { response } = requestResult;
  if (!response.ok && response.status !== 204) {
    return {
      ok: false,
      code: paused ? "SPOTIFY_PAUSE_FAILED" : "SPOTIFY_RESUME_FAILED",
      status: response.status,
      details: await response.text()
    };
  }
  return { ok: true };
}

module.exports = {
  SPOTIFY_LIKED_SONGS_ID,
  buildSpotifyLikedSongsSummary,
  buildSpotifyLikedSongsSummaryWithoutCount,
  getSpotifyAccessToken,
  getSpotifyCurrentUserId,
  getSpotifyCurrentUserProfile,
  isPlaylistOwnedByUser,
  resolvePlaylistTrackCount,
  pickAlbumImageUrl,
  normalizeTrack,
  normalizeAlbumSummary,
  normalizePlaylistSummary,
  normalizePlaylistTrackRow,
  enrichSpotifyTracksWithImages,
  spotifySearchTracks,
  spotifySearchAlbums,
  spotifyListAlbumTracks,
  spotifyListCurrentUserPlaylists,
  spotifyListFollowedPlaylists,
  spotifyListSavedTracks,
  spotifyFetchLikedSongsSummary,
  spotifyListPlaylistTracks,
  spotifyStartTrack,
  spotifySetPauseState,
  spotifySetRepeatMode
};
