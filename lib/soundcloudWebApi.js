const { nowSec } = require("./playbackGuards");
const { sortTracksByCreatedAt } = require("./sortPlaylistTracks.js");
const {
  isProviderRateLimited,
  applyRateLimitToSession,
  rateLimitUserMessage,
  secondsUntilRateLimitClear
} = require("./rateLimitBackoff");

const SOUNDCLOUD_TOKEN_URL = "https://secure.soundcloud.com/oauth/token";
const SOUNDCLOUD_API_BASE = "https://api.soundcloud.com";
const SOUNDCLOUD_TRACKS_URL = `${SOUNDCLOUD_API_BASE}/tracks`;
const SOUNDCLOUD_PLAYLISTS_URL = `${SOUNDCLOUD_API_BASE}/playlists`;
const ALBUM_LIKE_SET_TYPES = new Set(["album", "ep", "single", "compilation"]);
const SOUNDCLOUD_LIKES_ID = "__likes__";
const EXPIRY_SAFETY_WINDOW_SEC = 30;
const MAX_SOUNDCLOUD_PAGES = 20;

function isTokenFresh(expiresAt) {
  return Number(expiresAt || 0) > nowSec() + EXPIRY_SAFETY_WINDOW_SEC;
}

async function refreshSoundCloudAccessToken({ sessions, persist }) {
  const sc = sessions.soundcloud || {};
  const refreshToken = sc.refreshToken;
  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

  if (!refreshToken) {
    return { ok: false, code: "SOUNDCLOUD_REFRESH_MISSING", message: "soundcloud refresh token is missing" };
  }
  if (!clientId || !clientSecret) {
    return {
      ok: false,
      code: "SOUNDCLOUD_OAUTH_CONFIG_MISSING",
      message: "soundcloud oauth client credentials are missing"
    };
  }

  if (isProviderRateLimited(sc)) {
    const retryAfterSec = secondsUntilRateLimitClear(sc) || 60;
    return {
      ok: false,
      code: "SOUNDCLOUD_RATE_LIMIT",
      status: 429,
      message: rateLimitUserMessage("soundcloud", retryAfterSec),
      retryAfterSec
    };
  }

  const tokenRes = await fetch(SOUNDCLOUD_TOKEN_URL, {
    method: "POST",
    headers: {
      accept: "application/json; charset=utf-8",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
  });

  if (!tokenRes.ok) {
    const bodyText = await tokenRes.text();
    if (tokenRes.status === 429) {
      const retryAfterSec = applyRateLimitToSession(sc, tokenRes.headers.get("retry-after"), persist);
      sessions.soundcloud = sc;
      return {
        ok: false,
        code: "SOUNDCLOUD_RATE_LIMIT",
        status: 429,
        message: rateLimitUserMessage("soundcloud", retryAfterSec),
        retryAfterSec,
        details: bodyText
      };
    }
    return {
      ok: false,
      code: "SOUNDCLOUD_REFRESH_FAILED",
      status: tokenRes.status,
      message: "soundcloud token refresh failed",
      details: bodyText
    };
  }

  const tokens = await tokenRes.json();
  sc.accessToken = tokens.access_token;
  sc.expiresAt = nowSec() + (tokens.expires_in || 3600);
  if (tokens.refresh_token) {
    sc.refreshToken = tokens.refresh_token;
  }
  sc.refreshFailures = 0;
  sc.rateLimitUntil = 0;
  sessions.soundcloud = sc;
  persist();

  return { ok: true, accessToken: sc.accessToken };
}

async function getSoundCloudAccessToken({ sessions, persist, forceRefresh = false }) {
  const sc = sessions.soundcloud || {};
  if (!forceRefresh && sc.accessToken && isTokenFresh(sc.expiresAt)) {
    return { ok: true, accessToken: sc.accessToken };
  }

  if (isProviderRateLimited(sc)) {
    if (sc.accessToken && !forceRefresh) {
      return { ok: true, accessToken: sc.accessToken };
    }
    const retryAfterSec = secondsUntilRateLimitClear(sc) || 60;
    return {
      ok: false,
      code: "SOUNDCLOUD_RATE_LIMIT",
      status: 429,
      message: rateLimitUserMessage("soundcloud", retryAfterSec),
      retryAfterSec
    };
  }

  const refreshed = await refreshSoundCloudAccessToken({ sessions, persist });
  if (!refreshed.ok) {
    if (refreshed.code === "SOUNDCLOUD_RATE_LIMIT" && sc.accessToken && !forceRefresh) {
      return { ok: true, accessToken: sc.accessToken };
    }
    return refreshed;
  }

  return { ok: true, accessToken: refreshed.accessToken };
}

function soundCloudThumbUrl(artworkUrl) {
  const raw = typeof artworkUrl === "string" ? artworkUrl.trim() : "";
  if (!raw) return undefined;
  if (/-large\.(jpg|jpeg|png|webp)/i.test(raw)) {
    return raw.replace(/-large(?=\.(jpg|jpeg|png|webp))/i, "-t67x67");
  }
  if (/-t500x500\.(jpg|jpeg|png|webp)/i.test(raw)) {
    return raw.replace(/-t500x500(?=\.(jpg|jpeg|png|webp))/i, "-t67x67");
  }
  return raw;
}

function parseAddedAt(value) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const ms = Date.parse(value.trim());
  if (!Number.isFinite(ms)) return undefined;
  return value.trim();
}

function normalizeTrack(track) {
  const user = track.user || {};
  const artist = user.username || user.permalink || "";
  const durationMs = Number(track.duration ?? track.full_duration ?? 0);
  const permalinkUrl = typeof track.permalink_url === "string" ? track.permalink_url : "";
  const imageUrl = soundCloudThumbUrl(track.artwork_url);
  return {
    id: String(track.id),
    title: track.title || "Untitled",
    artist,
    durationSec: Math.max(0, Math.round(durationMs / 1000)),
    permalinkUrl,
    imageUrl,
    provider: "soundcloud"
  };
}

function extractCollection(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.collection)) return payload.collection;
  return [];
}

function extractCollectionTotalCount(payload) {
  if (!payload || typeof payload !== "object") return null;
  for (const key of ["total_count", "total"]) {
    const n = Number(payload[key]);
    if (Number.isFinite(n) && n >= 0) return Math.floor(n);
  }
  return null;
}

function extractNextHref(payload) {
  if (!payload) return null;
  const next = payload.next_href;
  return typeof next === "string" && next.trim() ? next.trim() : null;
}

function resolvePlaylistTrackCount(playlist) {
  if (!playlist) return null;
  const n = Number(playlist.track_count);
  if (Number.isFinite(n) && n >= 0) return Math.floor(n);
  return null;
}

function summaryNeedsTrackCountEnrichment(summary) {
  return Boolean(summary && summary.id && (summary._missingTrackCount || summary.trackCount === 0));
}

function stripPlaylistSummaryInternals(summary, { deferCounts = false } = {}) {
  if (!summary) return summary;
  const { _missingTrackCount, ...rest } = summary;
  if (deferCounts && summaryNeedsTrackCountEnrichment(summary)) {
    return {
      ...rest,
      trackCount: null,
      trackCountPending: true
    };
  }
  return rest;
}

function stripPlaylistSummaryForClient(summary, { deferCounts = false, omitSongCounts = false } = {}) {
  let out = stripPlaylistSummaryInternals(summary, {
    deferCounts: omitSongCounts ? false : deferCounts
  });
  if (!out || !omitSongCounts) return out;
  const { trackCount, trackCountPending, trackCountHasMore, ...rest } = out;
  return rest;
}

function soundCloudLikesEntryWithoutCount() {
  return {
    id: SOUNDCLOUD_LIKES_ID,
    name: "Likes",
    kind: "likes",
    provider: "soundcloud"
  };
}

function normalizePlaylistSummary(playlist, { kind }) {
  if (!playlist) return null;
  const id = playlist.id != null ? String(playlist.id) : "";
  if (!id && kind !== "likes") return null;
  const user = playlist.user || {};
  const ownerDisplayName = user.username || user.permalink || "";
  const resolvedCount = resolvePlaylistTrackCount(playlist);
  const secretToken =
    typeof playlist.secret_token === "string" && playlist.secret_token.trim()
      ? playlist.secret_token.trim()
      : undefined;
  return {
    id,
    name: playlist.title || playlist.name || "Untitled",
    trackCount: resolvedCount ?? 0,
    _missingTrackCount: resolvedCount === null,
    kind,
    ownerDisplayName: ownerDisplayName || undefined,
    secretToken,
    provider: "soundcloud"
  };
}

function normalizeLikedTrackRow(row) {
  if (!row) return null;
  const track = row.track && row.track.id != null ? row.track : row;
  if (!track || track.id == null) return null;
  const normalized = normalizeTrack(track);
  if (!normalized.permalinkUrl) return null;
  const addedAt = parseAddedAt(row.created_at);
  if (addedAt) normalized.addedAt = addedAt;
  return normalized;
}

function normalizePlaylistTrackRow(row) {
  if (!row) return null;
  const isWrapped = row.track && row.track.id != null;
  const track = isWrapped ? row.track : row;
  if (!track || track.id == null) return null;
  const normalized = normalizeTrack(track);
  if (!normalized.permalinkUrl) return null;
  const addedAt = isWrapped
    ? parseAddedAt(row.created_at)
    : parseAddedAt(row.created_at) ?? parseAddedAt(track.created_at);
  if (addedAt) normalized.addedAt = addedAt;
  return normalized;
}

async function soundCloudApiGet({ accessToken, path, query = {} }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  const url = qs ? `${SOUNDCLOUD_API_BASE}${path}?${qs}` : `${SOUNDCLOUD_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`
    }
  });
  if (!res.ok) {
    const details = await res.text();
    return {
      ok: false,
      status: res.status,
      code: res.status === 429 ? "SOUNDCLOUD_RATE_LIMIT" : "SOUNDCLOUD_API_FAILED",
      retryAfter: res.headers.get("retry-after"),
      details
    };
  }
  const payload = await res.json();
  return { ok: true, payload };
}

async function soundCloudApiGetUrl({ accessToken, url }) {
  const res = await fetch(url, {
    headers: {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`
    }
  });
  if (!res.ok) {
    const details = await res.text();
    return {
      ok: false,
      status: res.status,
      code: res.status === 429 ? "SOUNDCLOUD_RATE_LIMIT" : "SOUNDCLOUD_API_FAILED",
      retryAfter: res.headers.get("retry-after"),
      details
    };
  }
  const payload = await res.json();
  return { ok: true, payload };
}

/**
 * Walk linked_partitioning pages and collect normalized rows until offset+limit satisfied.
 */
async function collectPaginatedRows({
  accessToken,
  startPath,
  startQuery,
  normalizeRow,
  limit,
  offset
}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 50);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const targetCount = safeOffset + safeLimit;
  const collected = [];
  let nextUrl = null;
  let pagesFetched = 0;
  let collectionTotal = null;

  let pageResult = await soundCloudApiGet({ accessToken, path: startPath, query: startQuery });
  if (!pageResult.ok) {
    return pageResult;
  }

  while (pagesFetched < MAX_SOUNDCLOUD_PAGES) {
    pagesFetched += 1;
    const payload = pageResult.payload;
    if (pagesFetched === 1) {
      collectionTotal = extractCollectionTotalCount(payload);
    }
    const rows = extractCollection(payload);
    for (const raw of rows) {
      const normalized = normalizeRow(raw);
      if (normalized) {
        normalized.playlistPosition = collected.length;
        collected.push(normalized);
      }
    }
    if (collected.length >= targetCount) {
      break;
    }
    nextUrl = extractNextHref(payload);
    if (!nextUrl) {
      break;
    }
    pageResult = await soundCloudApiGetUrl({ accessToken, url: nextUrl });
    if (!pageResult.ok) {
      return pageResult;
    }
  }

  const slice = collected.slice(safeOffset, safeOffset + safeLimit);
  const hasMore = collected.length > safeOffset + safeLimit || Boolean(nextUrl);
  return {
    ok: true,
    items: slice,
    nextOffset: hasMore ? safeOffset + slice.length : null,
    collectionTotal
  };
}

/**
 * Walk linked_partitioning pages until the collection is exhausted.
 */
async function collectAllPaginatedRows({ accessToken, startPath, startQuery, normalizeRow }) {
  const collected = [];
  let pagesFetched = 0;
  let collectionTotal = null;

  let pageResult = await soundCloudApiGet({ accessToken, path: startPath, query: startQuery });
  if (!pageResult.ok) {
    return pageResult;
  }

  while (pagesFetched < MAX_SOUNDCLOUD_PAGES) {
    pagesFetched += 1;
    const payload = pageResult.payload;
    if (pagesFetched === 1) {
      collectionTotal = extractCollectionTotalCount(payload);
    }
    const rows = extractCollection(payload);
    for (const raw of rows) {
      const normalized = normalizeRow(raw);
      if (normalized) {
        normalized.playlistPosition = collected.length;
        collected.push(normalized);
      }
    }
    const nextUrl = extractNextHref(payload);
    if (!nextUrl) {
      break;
    }
    pageResult = await soundCloudApiGetUrl({ accessToken, url: nextUrl });
    if (!pageResult.ok) {
      return pageResult;
    }
  }

  return {
    ok: true,
    items: collected,
    collectionTotal: collectionTotal ?? collected.length
  };
}

async function fetchAllSoundCloudTracksSorted({ accessToken, startPath, startQuery, normalizeRow }) {
  const result = await collectAllPaginatedRows({
    accessToken,
    startPath,
    startQuery,
    normalizeRow
  });
  if (!result.ok) {
    return result;
  }
  const sorted = sortTracksByCreatedAt(result.items, "newest");
  return {
    ok: true,
    results: sorted,
    nextOffset: null,
    collectionTotal: result.collectionTotal
  };
}

async function countSoundCloudPlaylistTracksViaPages({ accessToken, playlistId, secretToken }) {
  const query = {
    limit: 50,
    linked_partitioning: "true",
    access: "playable"
  };
  if (secretToken) {
    query.secret_token = secretToken;
  }
  const result = await collectAllPaginatedRows({
    accessToken,
    startPath: `/playlists/${encodeURIComponent(playlistId)}/tracks`,
    startQuery: query,
    normalizeRow: normalizePlaylistTrackRow
  });
  if (!result.ok) {
    return null;
  }
  return result.items.length;
}

async function fetchSoundCloudPlaylistTrackCount({ accessToken, playlistId, secretToken }) {
  const query = { show_tracks: false };
  if (secretToken) {
    query.secret_token = secretToken;
  }
  const metaResult = await soundCloudApiGet({
    accessToken,
    path: `/playlists/${encodeURIComponent(playlistId)}`,
    query
  });
  if (metaResult.ok) {
    const metaCount = resolvePlaylistTrackCount(metaResult.payload);
    if (typeof metaCount === "number" && metaCount > 0) {
      return metaCount;
    }
  }
  return countSoundCloudPlaylistTracksViaPages({ accessToken, playlistId, secretToken });
}

async function enrichSoundCloudPlaylistTrackCounts({ accessToken, summaries, concurrency = 5 }) {
  const pending = (summaries || []).filter(
    (s) => s && s.id && (s._missingTrackCount || s.trackCount === 0)
  );
  for (let i = 0; i < pending.length; i += concurrency) {
    const batch = pending.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (summary) => {
        const total = await fetchSoundCloudPlaylistTrackCount({
          accessToken,
          playlistId: summary.id,
          secretToken: summary.secretToken
        });
        if (total !== null) {
          summary.trackCount = total;
        }
        summary._missingTrackCount = false;
      })
    );
  }
  return summaries;
}

async function soundCloudListUserPlaylists({ accessToken, limit = 30, offset = 0 }) {
  return collectPaginatedRows({
    accessToken,
    startPath: "/me/playlists",
    startQuery: {
      limit: Math.min(Number(limit) || 30, 50),
      linked_partitioning: "true",
      show_tracks: false
    },
    normalizeRow: (raw) => normalizePlaylistSummary(raw, { kind: "owned" }),
    limit,
    offset
  });
}

async function soundCloudListLikedPlaylists({ accessToken, limit = 30, offset = 0 }) {
  return collectPaginatedRows({
    accessToken,
    startPath: "/me/likes/playlists",
    startQuery: {
      limit: Math.min(Number(limit) || 30, 50),
      linked_partitioning: "true",
      show_tracks: false
    },
    normalizeRow: (raw) => {
      const pl = raw.playlist && raw.playlist.id != null ? raw.playlist : raw;
      return normalizePlaylistSummary(pl, { kind: "liked_playlist" });
    },
    limit,
    offset
  });
}

async function soundCloudListLibrary({
  accessToken,
  ownedLimit = 30,
  ownedOffset = 0,
  likedLimit = 30,
  likedOffset = 0,
  enrichTrackCounts = true,
  fetchSongCounts = true
}) {
  const likesPromise = fetchSongCounts
    ? soundCloudFetchLikesSummary({ accessToken })
    : Promise.resolve({ ok: true, likes: soundCloudLikesEntryWithoutCount() });
  const [likesResult, ownedResult, likedResult] = await Promise.all([
    likesPromise,
    soundCloudListUserPlaylists({
      accessToken,
      limit: ownedLimit,
      offset: ownedOffset
    }),
    soundCloudListLikedPlaylists({
      accessToken,
      limit: likedLimit,
      offset: likedOffset
    })
  ]);
  if (!likesResult.ok) {
    return likesResult;
  }
  if (!ownedResult.ok) {
    return ownedResult;
  }
  if (!likedResult.ok) {
    return likedResult;
  }
  if (enrichTrackCounts) {
    await enrichSoundCloudPlaylistTrackCounts({
      accessToken,
      summaries: [...ownedResult.items, ...likedResult.items]
    });
  }
  const omitSongCounts = !fetchSongCounts;
  const deferCounts = !enrichTrackCounts && !omitSongCounts;
  const strip = (summary) =>
    stripPlaylistSummaryForClient(summary, { deferCounts, omitSongCounts });
  const likes = omitSongCounts
    ? soundCloudLikesEntryWithoutCount()
    : likesResult.likes;
  return {
    ok: true,
    likes,
    owned: {
      items: ownedResult.items.map(strip),
      nextOffset: ownedResult.nextOffset
    },
    likedPlaylists: {
      items: likedResult.items.map(strip),
      nextOffset: likedResult.nextOffset
    }
  };
}

function summaryFromEnrichRef(ref) {
  if (!ref || ref.id == null || ref.id === "") return null;
  const secretToken =
    typeof ref.secretToken === "string" && ref.secretToken.trim() ? ref.secretToken.trim() : undefined;
  return {
    id: String(ref.id),
    secretToken,
    trackCount: 0,
    _missingTrackCount: true
  };
}

async function soundCloudEnrichPlaylistTrackCountsByRefs({ accessToken, playlists }) {
  const summaries = (playlists || []).map(summaryFromEnrichRef).filter(Boolean);
  if (summaries.length === 0) {
    return { ok: true, playlists: [] };
  }
  await enrichSoundCloudPlaylistTrackCounts({ accessToken, summaries });
  return {
    ok: true,
    playlists: summaries.map((s) => ({
      id: s.id,
      trackCount: s.trackCount ?? 0,
      trackCountPending: false
    }))
  };
}

async function soundCloudListLikedTracks({ accessToken, limit = 50, offset = 0 }) {
  void limit;
  void offset;
  return fetchAllSoundCloudTracksSorted({
    accessToken,
    startPath: "/me/likes/tracks",
    startQuery: {
      limit: 50,
      linked_partitioning: "true"
    },
    normalizeRow: normalizeLikedTrackRow
  });
}

/**
 * Liked-track total — one lightweight API call reading total_count when present.
 * Does not paginate the full library (that blocked playlist browsing for large libraries).
 */
async function soundCloudFetchLikesSummary({ accessToken }) {
  const pageResult = await soundCloudApiGet({
    accessToken,
    path: "/me/likes/tracks",
    query: {
      limit: 1,
      linked_partitioning: "true"
    }
  });
  if (!pageResult.ok) {
    return pageResult;
  }
  const total = extractCollectionTotalCount(pageResult.payload);
  if (typeof total === "number") {
    return {
      ok: true,
      likes: {
        id: SOUNDCLOUD_LIKES_ID,
        name: "Likes",
        trackCount: total,
        kind: "likes",
        provider: "soundcloud"
      }
    };
  }
  return {
    ok: true,
    likes: {
      ...soundCloudLikesEntryWithoutCount(),
      trackCountPending: true
    }
  };
}

async function soundCloudListPlaylistTracks({
  accessToken,
  playlistId,
  secretToken,
  limit = 50,
  offset = 0
}) {
  void limit;
  void offset;
  const query = {
    limit: 50,
    linked_partitioning: "true",
    access: "playable"
  };
  if (secretToken) {
    query.secret_token = secretToken;
  }
  return fetchAllSoundCloudTracksSorted({
    accessToken,
    startPath: `/playlists/${encodeURIComponent(playlistId)}/tracks`,
    startQuery: query,
    normalizeRow: normalizePlaylistTrackRow
  });
}

async function soundCloudListPlaylistTracksById({
  accessToken,
  playlistId,
  secretToken,
  limit = 50,
  offset = 0
}) {
  if (playlistId === SOUNDCLOUD_LIKES_ID) {
    return soundCloudListLikedTracks({ accessToken, limit, offset });
  }
  return soundCloudListPlaylistTracks({ accessToken, playlistId, secretToken, limit, offset });
}

function isAlbumLikePlaylist(playlist) {
  const setType = typeof playlist?.set_type === "string" ? playlist.set_type.trim().toLowerCase() : "";
  if (!setType) return false;
  if (setType === "playlist" || setType === "mixed") return false;
  return ALBUM_LIKE_SET_TYPES.has(setType);
}

function normalizeAlbumSearchSummary(playlist) {
  if (!playlist) return null;
  const id = playlist.id != null ? String(playlist.id) : "";
  if (!id) return null;
  const user = playlist.user || {};
  const releaseDate = typeof playlist.release_date === "string" ? playlist.release_date : "";
  const releaseYear = releaseDate.length >= 4 ? releaseDate.slice(0, 4) : "";
  const secretToken =
    typeof playlist.secret_token === "string" && playlist.secret_token.trim()
      ? playlist.secret_token.trim()
      : undefined;
  const resolvedCount = resolvePlaylistTrackCount(playlist);
  return {
    id,
    name: playlist.title || "Untitled",
    artist: user.username || user.permalink || "",
    imageUrl: soundCloudThumbUrl(playlist.artwork_url),
    releaseYear,
    trackCount: resolvedCount ?? 0,
    secretToken,
    setType: typeof playlist.set_type === "string" ? playlist.set_type : undefined,
    provider: "soundcloud",
    kind: "album"
  };
}

async function soundCloudSearchAlbums({ accessToken, query, limit = 10 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const params = new URLSearchParams({
    q: query || "",
    limit: String(Math.min(safeLimit * 3, 50)),
    access: "playable",
    linked_partitioning: "true"
  });
  const searchRes = await fetch(`${SOUNDCLOUD_PLAYLISTS_URL}?${params.toString()}`, {
    headers: {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`
    }
  });

  if (!searchRes.ok) {
    const details = await searchRes.text();
    return {
      ok: false,
      status: searchRes.status,
      code: searchRes.status === 429 ? "SOUNDCLOUD_RATE_LIMIT" : "SOUNDCLOUD_SEARCH_FAILED",
      retryAfter: searchRes.headers.get("retry-after"),
      details
    };
  }

  const payload = await searchRes.json();
  const items = extractCollection(payload);
  const albumLike = items.filter(isAlbumLikePlaylist);
  const source = albumLike.length ? albumLike : items;
  const results = source
    .map(normalizeAlbumSearchSummary)
    .filter(Boolean)
    .slice(0, safeLimit);
  return {
    ok: true,
    results
  };
}

async function soundCloudSearchTracks({ accessToken, query, limit = 10 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 200);
  const params = new URLSearchParams({
    q: query || "",
    limit: String(safeLimit),
    access: "playable",
    linked_partitioning: "true"
  });
  const searchRes = await fetch(`${SOUNDCLOUD_TRACKS_URL}?${params.toString()}`, {
    headers: {
      accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`
    }
  });

  if (!searchRes.ok) {
    const details = await searchRes.text();
    return {
      ok: false,
      status: searchRes.status,
      code: searchRes.status === 429 ? "SOUNDCLOUD_RATE_LIMIT" : "SOUNDCLOUD_SEARCH_FAILED",
      retryAfter: searchRes.headers.get("retry-after"),
      details
    };
  }

  const payload = await searchRes.json();
  const items = extractCollection(payload);
  const results = items.map(normalizeTrack).filter((t) => t.permalinkUrl);
  return {
    ok: true,
    results
  };
}

module.exports = {
  SOUNDCLOUD_LIKES_ID,
  getSoundCloudAccessToken,
  soundCloudSearchTracks,
  soundCloudSearchAlbums,
  isAlbumLikePlaylist,
  normalizeAlbumSearchSummary,
  normalizeTrack,
  resolvePlaylistTrackCount,
  normalizePlaylistSummary,
  summaryNeedsTrackCountEnrichment,
  stripPlaylistSummaryInternals,
  stripPlaylistSummaryForClient,
  soundCloudLikesEntryWithoutCount,
  normalizeLikedTrackRow,
  normalizePlaylistTrackRow,
  soundCloudFetchLikesSummary,
  fetchSoundCloudPlaylistTrackCount,
  enrichSoundCloudPlaylistTrackCounts,
  soundCloudEnrichPlaylistTrackCountsByRefs,
  soundCloudListUserPlaylists,
  soundCloudListLikedPlaylists,
  soundCloudListLibrary,
  soundCloudListLikedTracks,
  soundCloudListPlaylistTracks,
  soundCloudListPlaylistTracksById
};
