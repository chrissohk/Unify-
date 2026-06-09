const spotifyProviderControls = document.getElementById("spotifyProviderControls");
const soundcloudProviderControls = document.getElementById("soundcloudProviderControls");
const appleMusicProviderControls = document.getElementById("appleMusicProviderControls");
const statusRailProviders = document.getElementById("statusRailProviders");
const authNoticeEl = document.getElementById("authNotice");
const spotifySearchForm = document.getElementById("spotifySearchForm");
const spotifySearchQuery = document.getElementById("spotifySearchQuery");
const spotifySearchResults = document.getElementById("spotifySearchResults");
const spotifySearchModeTracks = document.getElementById("spotifySearchModeTracks");
const spotifySearchModeAlbums = document.getElementById("spotifySearchModeAlbums");
const spotifySearchBrowse = document.getElementById("spotifySearchBrowse");
const spotifyAlbumTracksPanel = document.getElementById("spotifyAlbumTracksPanel");
const spotifyAlbumBack = document.getElementById("spotifyAlbumBack");
const spotifyAlbumHero = document.getElementById("spotifyAlbumHero");
const spotifyAlbumHeroCover = document.getElementById("spotifyAlbumHeroCover");
const spotifyAlbumHeroCoverFallback = document.getElementById("spotifyAlbumHeroCoverFallback");
const spotifyAlbumHeroTitle = document.getElementById("spotifyAlbumHeroTitle");
const spotifyAlbumHeroMeta = document.getElementById("spotifyAlbumHeroMeta");
const spotifyAlbumQueueAll = document.getElementById("spotifyAlbumQueueAll");
const spotifySelectedAlbumTitle = document.getElementById("spotifySelectedAlbumTitle");
const spotifyAlbumTracksLoading = document.getElementById("spotifyAlbumTracksLoading");
const spotifyAlbumTracksStatus = document.getElementById("spotifyAlbumTracksStatus");
const spotifyAlbumTracks = document.getElementById("spotifyAlbumTracks");
const spotifyAlbumTracksMore = document.getElementById("spotifyAlbumTracksMore");
const soundcloudSearchForm = document.getElementById("soundcloudSearchForm");
const soundcloudSearchQuery = document.getElementById("soundcloudSearchQuery");
const soundcloudSearchResults = document.getElementById("soundcloudSearchResults");
const soundcloudSearchModeTracks = document.getElementById("soundcloudSearchModeTracks");
const soundcloudSearchModeAlbums = document.getElementById("soundcloudSearchModeAlbums");
const soundcloudSearchBrowse = document.getElementById("soundcloudSearchBrowse");
const soundcloudAlbumTracksPanel = document.getElementById("soundcloudAlbumTracksPanel");
const soundcloudAlbumBack = document.getElementById("soundcloudAlbumBack");
const soundcloudAlbumHeroCover = document.getElementById("soundcloudAlbumHeroCover");
const soundcloudAlbumHeroCoverFallback = document.getElementById("soundcloudAlbumHeroCoverFallback");
const soundcloudAlbumHeroTitle = document.getElementById("soundcloudAlbumHeroTitle");
const soundcloudAlbumHeroMeta = document.getElementById("soundcloudAlbumHeroMeta");
const soundcloudAlbumQueueAll = document.getElementById("soundcloudAlbumQueueAll");
const soundcloudSelectedAlbumTitle = document.getElementById("soundcloudSelectedAlbumTitle");
const soundcloudAlbumTracksLoading = document.getElementById("soundcloudAlbumTracksLoading");
const soundcloudAlbumTracksStatus = document.getElementById("soundcloudAlbumTracksStatus");
const soundcloudAlbumTracks = document.getElementById("soundcloudAlbumTracks");
const soundcloudAlbumTracksMore = document.getElementById("soundcloudAlbumTracksMore");
const tabNowPlaying = document.getElementById("tab-now-playing");
const tabSpotifySearch = document.getElementById("tab-spotify-search");
const tabSoundcloudSearch = document.getElementById("tab-soundcloud-search");
const tabAppleMusicSearch = document.getElementById("tab-applemusic-search");
const panelNowPlaying = document.getElementById("panel-now-playing");
const panelSpotifySearch = document.getElementById("panel-spotify-search");
const panelAppleMusicSearch = document.getElementById("panel-applemusic-search");
const panelSoundcloudSearch = document.getElementById("panel-soundcloud-search");
const spotifyPlaylistLoading = document.getElementById("spotifyPlaylistLoading");
const spotifyPlaylistStatus = document.getElementById("spotifyPlaylistStatus");
const spotifyLibraryGroups = document.getElementById("spotifyLibraryGroups");
const spotifyLibraryFilter = document.getElementById("spotifyLibraryFilter");
const spotifyLibraryFilterEmpty = document.getElementById("spotifyLibraryFilterEmpty");
const spotifyLikedSongsList = document.getElementById("spotifyLikedSongsList");
const spotifyPlaylistList = document.getElementById("spotifyPlaylistList");
const spotifyPlaylistsMore = document.getElementById("spotifyPlaylistsMore");
const spotifyLikedPlaylistList = document.getElementById("spotifyLikedPlaylistList");
const spotifyLikedPlaylistsMore = document.getElementById("spotifyLikedPlaylistsMore");
const spotifyPlaylistTracksPanel = document.getElementById("spotifyPlaylistTracksPanel");
const spotifySelectedPlaylistTitle = document.getElementById("spotifySelectedPlaylistTitle");
const spotifyPlaylistTrackFilter = document.getElementById("spotifyPlaylistTrackFilter");
const spotifyPlaylistTrackSort = document.getElementById("spotifyPlaylistTrackSort");
const spotifyPlaylistTracksStatus = document.getElementById("spotifyPlaylistTracksStatus");
const spotifyPlaylistTracksLoading = document.getElementById("spotifyPlaylistTracksLoading");
const spotifyPlaylistTracks = document.getElementById("spotifyPlaylistTracks");
const spotifyTracksMore = document.getElementById("spotifyTracksMore");
const soundcloudPlaylistLoading = document.getElementById("soundcloudPlaylistLoading");
const soundcloudLibraryGroups = document.getElementById("soundcloudLibraryGroups");
const soundcloudLibraryFilter = document.getElementById("soundcloudLibraryFilter");
const soundcloudLibraryFilterEmpty = document.getElementById("soundcloudLibraryFilterEmpty");
const soundcloudLikesList = document.getElementById("soundcloudLikesList");
const soundcloudOwnedPlaylistList = document.getElementById("soundcloudOwnedPlaylistList");
const soundcloudOwnedPlaylistsMore = document.getElementById("soundcloudOwnedPlaylistsMore");
const soundcloudLikedPlaylistList = document.getElementById("soundcloudLikedPlaylistList");
const soundcloudLikedPlaylistsMore = document.getElementById("soundcloudLikedPlaylistsMore");
const soundcloudPlaylistTracksPanel = document.getElementById("soundcloudPlaylistTracksPanel");
const soundcloudSelectedPlaylistTitle = document.getElementById("soundcloudSelectedPlaylistTitle");
const soundcloudPlaylistTrackFilter = document.getElementById("soundcloudPlaylistTrackFilter");
const soundcloudPlaylistTrackSort = document.getElementById("soundcloudPlaylistTrackSort");
const soundcloudPlaylistTracksStatus = document.getElementById("soundcloudPlaylistTracksStatus");
const soundcloudPlaylistTracksLoading = document.getElementById("soundcloudPlaylistTracksLoading");
const soundcloudPlaylistTracks = document.getElementById("soundcloudPlaylistTracks");
const soundcloudTracksMore = document.getElementById("soundcloudTracksMore");
const spotifyLibrarySplit = document.querySelector(".spotify-library-split");
const soundcloudLibrarySplit = document.querySelector(".soundcloud-library-split");
const queueList = document.getElementById("queueList");
const nowPlayingText = document.getElementById("nowPlayingText");
const nowPlayingActions = document.getElementById("nowPlayingActions");
const nowPlayingRow = document.getElementById("nowPlayingRow");
const playerHost = document.getElementById("playerHost");
const recentPlayedList = document.getElementById("recentPlayedList");
const nowPlayingTheaterBtn = document.getElementById("nowPlayingTheaterBtn");
const nowPlayingTheaterNext = document.getElementById("nowPlayingTheaterNext");
const nowPlayingTheaterChrome =
  document.querySelector(".now-playing-theater-chrome") ??
  nowPlayingTheaterBtn?.closest?.(".now-playing-theater-chrome") ??
  null;

const tabNowPlayingTicker = tabNowPlaying?.querySelector?.(".tab-now-playing-ticker");
const tabNowPlayingTickerText = tabNowPlaying?.querySelector?.(".tab-now-playing-ticker__text");
const tabNowPlayingTickerTextDup = tabNowPlaying?.querySelector?.(
  ".tab-now-playing-ticker__text--dup"
);
const tabNowPlayingTickerViewport = tabNowPlaying?.querySelector?.(
  ".tab-now-playing-ticker__viewport"
);

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const formatNowPlayingLabel = (title, artist) => {
  const t = String(title || "").trim() || "Unknown title";
  const a = String(artist || "").trim() || "Unknown artist";
  return `${t} - ${a}`;
};

const formatNowPlayingTicker = (item) => formatNowPlayingLabel(item?.title, item?.artist);

const applyNowPlayingTicker = ({
  durationHost,
  durationVar,
  tickerEl,
  staticClass,
  textEl,
  textDupEl,
  viewportEl,
  label,
  forceScroll = false
}) => {
  if (!tickerEl || !textEl || !textDupEl) return;
  const trimmed = String(label || "").trim();
  textEl.textContent = trimmed;
  textDupEl.textContent = trimmed;
  if (durationHost && trimmed) {
    const seconds = clamp(Math.round(trimmed.length * 0.35), 8, 28);
    durationHost.style.setProperty(durationVar, `${seconds}s`);
  }
  tickerEl.classList.remove(staticClass);
  if (forceScroll || !viewportEl) return;
  requestAnimationFrame(() => {
    const overflows = textEl.scrollWidth > viewportEl.clientWidth;
    tickerEl.classList.toggle(staticClass, !overflows);
  });
};

/** Tab shows eq bars only when idle; track title scrolls only while something is playing. */
const renderNowPlayingTabTicker = (item) => {
  if (!tabNowPlaying || !tabNowPlayingTicker || !tabNowPlayingTickerText || !tabNowPlayingTickerTextDup) {
    return;
  }

  if (!item) {
    tabNowPlaying.classList.add("is-idle");
    tabNowPlaying.setAttribute("aria-label", "Now playing");
    tabNowPlayingTicker.hidden = true;
    tabNowPlayingTicker.removeAttribute("title");
    tabNowPlayingTicker.classList.remove("tab-now-playing-ticker--static");
    tabNowPlayingTickerText.textContent = "";
    tabNowPlayingTickerTextDup.textContent = "";
    tabNowPlaying.style.removeProperty("--tab-ticker-duration");
    return;
  }

  tabNowPlaying.classList.remove("is-idle");
  const label = formatNowPlayingTicker(item);
  tabNowPlaying.setAttribute("aria-label", `Now playing: ${label}`);
  tabNowPlayingTicker.hidden = false;
  tabNowPlayingTicker.setAttribute("title", label);
  applyNowPlayingTicker({
    durationHost: tabNowPlaying,
    durationVar: "--tab-ticker-duration",
    tickerEl: tabNowPlayingTicker,
    staticClass: "tab-now-playing-ticker--static",
    textEl: tabNowPlayingTickerText,
    textDupEl: tabNowPlayingTickerTextDup,
    viewportEl: tabNowPlayingTickerViewport,
    label
  });
};

const getNowPlayingPanel = () =>
  playerHost?.querySelector?.(".spotify-sdk-panel") ??
  playerHost?.querySelector?.(".soundcloud-sdk-panel") ??
  null;

const ensureMetaTickerMarkup = (ticker) => {
  if (!ticker || ticker.querySelector(".now-playing-meta-ticker__track")) return;
  ticker.innerHTML = `
    <span class="now-playing-meta-ticker__viewport">
      <span class="now-playing-meta-ticker__track">
        <span class="now-playing-meta-ticker__text"></span>
        <span class="now-playing-meta-ticker__text now-playing-meta-ticker__text--dup" aria-hidden="true"></span>
      </span>
    </span>`;
};

const refreshNowPlayingMetaTicker = (panel, { title, artist } = {}) => {
  const meta = panel?.querySelector?.(".now-playing-layout__meta");
  if (!meta) return;

  const ticker = meta.querySelector(".now-playing-meta-ticker");
  ensureMetaTickerMarkup(ticker);
  const textSpans = meta.querySelectorAll(".now-playing-meta-ticker__text");
  const textEl = textSpans[0] ?? null;
  const textDupEl = textSpans[1] ?? null;
  const viewportEl = meta.querySelector(".now-playing-meta-ticker__viewport");
  const titleEl = meta.querySelector(".now-playing-layout__title");
  const artistEl = meta.querySelector(".now-playing-layout__artist");
  const titleFromDom = titleEl?.textContent;
  const artistFromDom = artistEl?.textContent;

  if (!isNowPlayingTheaterOpen()) {
    if (ticker) {
      ticker.removeAttribute("title");
      ticker.classList.remove("now-playing-meta-ticker--static");
    }
    if (textEl) textEl.textContent = "";
    if (textDupEl) textDupEl.textContent = "";
    meta.removeAttribute("aria-label");
    meta.style.removeProperty("--meta-ticker-duration");
    return;
  }

  const resolvedTitle = title ?? titleFromDom;
  const resolvedArtist = artist ?? artistFromDom;
  const titleText = String(resolvedTitle || "").trim() || "Unknown title";
  const artistText = String(resolvedArtist || "").trim();
  const label = formatNowPlayingLabel(titleText, artistText);
  meta.setAttribute("aria-label", label);
  if (titleEl) titleEl.textContent = titleText;
  if (artistEl) artistEl.textContent = artistText;

  if (!ticker || !textEl || !textDupEl) return;
  ticker.setAttribute("title", titleText);
  applyNowPlayingTicker({
    durationHost: meta,
    durationVar: "--meta-ticker-duration",
    tickerEl: ticker,
    staticClass: "now-playing-meta-ticker--static",
    textEl,
    textDupEl,
    viewportEl,
    label: titleText,
    forceScroll: true
  });
};

const renderNowPlayingMetaTicker = (panel, opts = {}) => {
  refreshNowPlayingMetaTicker(panel, opts);
};

const scheduleNowPlayingMetaTickerRefresh = () => {
  if (!isNowPlayingTheaterOpen()) return;
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  const run = () => {
    const panel = getNowPlayingPanel();
    if (!panel || !item) return;
    const title =
      item.provider === "spotify"
        ? spotifyPlaybackState?.trackName || item.title
        : item.title;
    const artist =
      item.provider === "spotify"
        ? spotifyPlaybackState?.artist || item.artist
        : item.artist;
    refreshNowPlayingMetaTicker(panel, { title, artist });
  };
  requestAnimationFrame(() => requestAnimationFrame(run));
};

const resolveNowPlayingCoverUrl = (item) => {
  const direct = String(item?.imageUrl || "").trim();
  if (direct) return direct;
  try {
    if (item?.provider === "soundcloud" && typeof soundCloudResolveCoverUrl === "function") {
      const sc = String(soundCloudResolveCoverUrl(item) || "").trim();
      if (sc) return sc;
    }
  } catch (_) {
    /* ignore */
  }
  return "";
};

/** Hero-only: upgrade SoundCloud thumbnail URLs to ~500px for sharp sleeve art. */
const upgradeSoundCloudArtworkUrl = (url) => {
  const raw = typeof url === "string" ? url.trim() : "";
  if (!raw) return "";
  const to500 = (suffix) =>
    raw.replace(new RegExp(`${suffix}(?=\\.(jpg|jpeg|png|webp))`, "i"), "-t500x500");
  if (/-t67x67\.(jpg|jpeg|png|webp)/i.test(raw)) return to500("-t67x67");
  if (/-large\.(jpg|jpeg|png|webp)/i.test(raw)) return to500("-large");
  if (/-t300x300\.(jpg|jpeg|png|webp)/i.test(raw)) return to500("-t300x300");
  if (/-small\.(jpg|jpeg|png|webp)/i.test(raw)) return to500("-small");
  if (/-badge\.(jpg|jpeg|png|webp)/i.test(raw)) return to500("-badge");
  return raw;
};

const resolveNowPlayingHeroCoverUrl = (item) => {
  if (!item) return "";

  if (item.provider === "spotify") {
    const sdk = String(spotifyPlaybackState?.albumImage || "").trim();
    if (sdk) return sdk;
    return String(item.imageUrl || "").trim();
  }

  if (item.provider === "soundcloud") {
    const fromState = upgradeSoundCloudArtworkUrl(soundcloudPlaybackState?.coverUrl);
    if (fromState) return fromState;
    const fromItem = upgradeSoundCloudArtworkUrl(item.imageUrl);
    if (fromItem) return fromItem;
    try {
      if (typeof soundCloudResolveCoverUrl === "function") {
        const sc = upgradeSoundCloudArtworkUrl(soundCloudResolveCoverUrl(item));
        if (sc) return sc;
      }
    } catch (_) {
      /* ignore */
    }
    return "";
  }

  return String(item.imageUrl || "").trim();
};

const isNowPlayingActivelyPlaying = (item) => {
  if (!item) return false;
  if (item.provider === "spotify") return !Boolean(spotifyPlaybackState?.paused);
  if (item.provider === "soundcloud") return !Boolean(soundcloudPlaybackState?.paused);
  return false;
};

const getNowPlayingHeroElements = () => {
  const root = playerHost?.querySelector?.(".vinyl-hero");
  if (!root) return null;
  return {
    root,
    cover: root.querySelector("img.vinyl-hero__cover"),
    fallback: root.querySelector(".vinyl-hero__cover-fallback")
  };
};

const renderNowPlayingHero = (item) => {
  const heroEls = getNowPlayingHeroElements();
  if (!heroEls) return;
  const { root, cover, fallback } = heroEls;

  if (!item) {
    root.classList.remove("is-spinning");
    if (cover) {
      cover.removeAttribute("src");
      cover.hidden = true;
    }
    if (fallback) fallback.hidden = false;
    applyNowPlayingCoverBackground(null, null);
    return;
  }

  root.classList.toggle("is-spinning", isNowPlayingActivelyPlaying(item));

  const coverUrl = resolveNowPlayingHeroCoverUrl(item);
  if (fallback) fallback.hidden = Boolean(coverUrl);

  if (!cover) {
    applyNowPlayingCoverBackground(null, item);
    return;
  }
  if (!coverUrl) {
    cover.hidden = true;
    cover.removeAttribute("src");
    applyNowPlayingCoverBackground(null, item);
    return;
  }

  cover.hidden = false;
  cover.crossOrigin = "anonymous";
  cover.referrerPolicy = "no-referrer";
  cover.onerror = () => {
    applyNowPlayingCoverBackground(null, item);
  };
  if (cover.getAttribute("src") !== coverUrl) {
    cover.setAttribute("src", coverUrl);
  }
  applyNowPlayingCoverBackground(cover, item);
};

const NOW_PLAYING_COVER_DARKEN = 0.4;

const darkenCoverRgb = (r, g, b) =>
  `rgb(${Math.round(r * NOW_PLAYING_COVER_DARKEN)}, ${Math.round(g * NOW_PLAYING_COVER_DARKEN)}, ${Math.round(b * NOW_PLAYING_COVER_DARKEN)})`;

const averageCoverRegion = (data, width, height, yStart, yEnd) => {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const y0 = Math.max(0, yStart);
  const y1 = Math.min(height, yEnd);
  for (let y = y0; y < y1; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count += 1;
    }
  }
  if (!count) return null;
  return { r: r / count, g: g / count, b: b / count };
};

const sampleCoverNowPlayingGradient = (imgEl) => {
  if (!imgEl?.complete || !imgEl.naturalWidth) return null;
  try {
    const canvas = document.createElement("canvas");
    const size = 48;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(imgEl, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    const topEnd = Math.ceil(size * 0.35);
    const bottomStart = Math.floor(size * 0.65);
    const top = averageCoverRegion(data, size, size, 0, topEnd);
    const bottom = averageCoverRegion(data, size, size, bottomStart, size);
    const mid = averageCoverRegion(data, size, size, 0, size);
    if (!top || !bottom || !mid) return null;
    const topColor = darkenCoverRgb(top.r, top.g, top.b);
    const midColor = darkenCoverRgb(mid.r, mid.g, mid.b);
    const bottomColor = darkenCoverRgb(bottom.r, bottom.g, bottom.b);
    return `linear-gradient(180deg, ${topColor} 0%, ${midColor} 50%, ${bottomColor} 100%)`;
  } catch (_) {
    return null;
  }
};

const getNowPlayingCoverBackgroundFallback = (item) => {
  if (!item) return null;
  if (item.provider === "spotify") {
    return "var(--gradient-spotify-glow), linear-gradient(175deg, rgba(26, 36, 32, 0.95) 0%, #0b0b0c 100%)";
  }
  if (item.provider === "soundcloud") {
    return "var(--gradient-soundcloud-glow), linear-gradient(175deg, rgba(36, 24, 18, 0.95) 0%, #0b0b0c 100%)";
  }
  return "var(--gradient-unified-glow), linear-gradient(175deg, #141416 0%, #0b0b0c 100%)";
};

const applyNowPlayingCoverBackground = (coverEl, item) => {
  if (!nowPlayingRow) return;
  const applyBackground = (value) => {
    if (value) nowPlayingRow.style.setProperty("--now-playing-cover-bg", value);
    else nowPlayingRow.style.removeProperty("--now-playing-cover-bg");
  };
  if (!coverEl || coverEl.hidden || !coverEl.getAttribute("src")) {
    applyBackground(getNowPlayingCoverBackgroundFallback(item));
    return;
  }
  const sample = () => {
    applyBackground(
      sampleCoverNowPlayingGradient(coverEl) || getNowPlayingCoverBackgroundFallback(item)
    );
  };
  if (coverEl.complete && coverEl.naturalWidth) sample();
  else coverEl.addEventListener("load", sample, { once: true });
};

const isNowPlayingTheaterOpen = () =>
  document.body.classList.contains("now-playing-theater-open");

const nowPlayingTheaterSvgEnter = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"/></svg>`;

const nowPlayingTheaterSvgExit = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4"/></svg>`;

const mountNowPlayingTheaterChrome = () => {
  if (!nowPlayingTheaterChrome) return;
  const playing =
    queueState.currentIndex >= 0 && queueState.currentIndex < queueState.queue.length;
  const panel = getNowPlayingPanel();
  const controls = panel?.querySelector?.(".now-playing-layout__controls");

  if (playing && controls) {
    if (nowPlayingTheaterChrome.parentElement !== controls) {
      controls.appendChild(nowPlayingTheaterChrome);
    }
    nowPlayingTheaterChrome.hidden = false;
    return;
  }

  if (nowPlayingRow && nowPlayingTheaterChrome.parentElement !== nowPlayingRow) {
    nowPlayingRow.appendChild(nowPlayingTheaterChrome);
  }
  nowPlayingTheaterChrome.hidden = !playing;
};

const syncNowPlayingTheaterToggle = () => {
  const playing =
    queueState.currentIndex >= 0 && queueState.currentIndex < queueState.queue.length;
  if (!nowPlayingTheaterBtn) return;
  nowPlayingTheaterBtn.disabled = !playing;
  const open = isNowPlayingTheaterOpen();
  nowPlayingTheaterBtn.setAttribute(
    "aria-label",
    open ? "Exit theater mode" : "Enter theater mode"
  );
  nowPlayingTheaterBtn.innerHTML = open
    ? nowPlayingTheaterSvgExit()
    : nowPlayingTheaterSvgEnter();
  mountNowPlayingTheaterChrome();
  if (open) scheduleNowPlayingMetaTickerRefresh();
};

const renderNowPlayingTheaterNext = () => {
  if (!nowPlayingTheaterNext) return;
  if (!isNowPlayingTheaterOpen()) {
    nowPlayingTheaterNext.hidden = true;
    nowPlayingTheaterNext.replaceChildren();
    return;
  }
  const idx = queueState.currentIndex;
  const nextIdx = idx + 1;
  if (nextIdx < 0 || nextIdx >= queueState.queue.length) {
    nowPlayingTheaterNext.hidden = true;
    nowPlayingTheaterNext.replaceChildren();
    return;
  }
  const item = queueState.queue[nextIdx];
  nowPlayingTheaterNext.hidden = false;
  nowPlayingTheaterNext.replaceChildren();
  const label = document.createElement("p");
  label.className = "now-playing-theater-next__label";
  label.textContent = "Up next";
  const row = document.createElement("div");
  row.className = "now-playing-theater-next__row";
  row.appendChild(createQueueRowArt(item));
  const meta = document.createElement("div");
  meta.className = "now-playing-theater-next__meta";
  const title = document.createElement("p");
  title.className = "now-playing-theater-next__title";
  title.textContent = item.title || "Untitled";
  title.setAttribute("data-testid", "now-playing-theater-next-title");
  const artist = document.createElement("p");
  artist.className = "now-playing-theater-next__artist";
  artist.textContent = item.artist || "";
  meta.appendChild(title);
  meta.appendChild(artist);
  row.appendChild(meta);
  nowPlayingTheaterNext.appendChild(label);
  nowPlayingTheaterNext.appendChild(row);
};

const openNowPlayingTheater = async () => {
  if (isNowPlayingTheaterOpen()) return;
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  document.body.classList.add("now-playing-theater-open");
  syncNowPlayingTheaterToggle();
  renderNowPlayingTheaterNext();
  scheduleNowPlayingMetaTickerRefresh();
  try {
    if (nowPlayingRow?.requestFullscreen && document.fullscreenElement !== nowPlayingRow) {
      await nowPlayingRow.requestFullscreen();
    }
  } catch (_) {}
};

const closeNowPlayingTheater = async () => {
  if (!isNowPlayingTheaterOpen()) return;
  const panel = getNowPlayingPanel();
  document.body.classList.remove("now-playing-theater-open");
  if (nowPlayingTheaterNext) {
    nowPlayingTheaterNext.hidden = true;
    nowPlayingTheaterNext.replaceChildren();
  }
  if (panel) renderNowPlayingMetaTicker(panel);
  syncNowPlayingTheaterToggle();
  mountNowPlayingTheaterChrome();
  if (document.fullscreenElement === nowPlayingRow) {
    try {
      await document.exitFullscreen();
    } catch (_) {}
  }
};

const toggleNowPlayingTheater = () => {
  if (isNowPlayingTheaterOpen()) void closeNowPlayingTheater();
  else void openNowPlayingTheater();
};

const handleNowPlayingTheaterFullscreenChange = () => {
  const inFs = document.fullscreenElement === nowPlayingRow;
  if (!inFs && isNowPlayingTheaterOpen()) {
    const panel = getNowPlayingPanel();
    document.body.classList.remove("now-playing-theater-open");
    if (nowPlayingTheaterNext) {
      nowPlayingTheaterNext.hidden = true;
      nowPlayingTheaterNext.replaceChildren();
    }
    if (panel) renderNowPlayingMetaTicker(panel);
    syncNowPlayingTheaterToggle();
    return;
  }
  if (inFs && !isNowPlayingTheaterOpen()) {
    document.body.classList.add("now-playing-theater-open");
    renderNowPlayingTheaterNext();
    syncNowPlayingTheaterToggle();
  }
};

const handleNowPlayingTheaterKeydown = (event) => {
  if (event.key !== "Escape" || !isNowPlayingTheaterOpen()) return;
  event.preventDefault();
  void closeNowPlayingTheater();
};

const getNowPlayingEmbedKey = (item) => {
  if (!item) return null;
  const identity =
    item.trackId || item.permalinkUrl || item.id || item.uri || item.url || createHistoryKey(item);
  return `${item.provider}:${identity}`;
};

const isSpotifyPanelMounted = () => Boolean(playerHost?.querySelector?.(".spotify-sdk-panel"));

const patchSpotifyNowPlayingPanel = (item) => {
  const panel = playerHost?.querySelector?.(".spotify-sdk-panel");
  if (!panel || !item || item.provider !== "spotify") return false;
  const progressNow = Math.max(0, Number(spotifyPlaybackState?.positionMs || 0));
  const progressTotal = Math.max(
    1,
    Number(spotifyPlaybackState?.durationMs || Number(item.durationSec || 0) * 1000 || 0)
  );
  const progressPercent = Math.min(100, (progressNow / progressTotal) * 100);
  const title = spotifyPlaybackState?.trackName || item.title || "Unknown";
  const artist = spotifyPlaybackState?.artist || item.artist || "";
  const sdkConnected = Boolean(spotifySdkReady && spotifyDeviceId);
  const reconnecting = !sdkConnected && isSpotifyProviderConnected();
  const paused =
    spotifyPlaybackState == null || !sdkConnected
      ? true
      : Boolean(spotifyPlaybackState.paused) || spotifyReloadNeedsUserResume;
  const q = queueState.queue;
  const cur = queueState.currentIndex;
  const hasNext = cur >= 0 && cur < q.length - 1;
  const skipDisabled = advanceTrackInFlight || !hasNext;

  const titleEl = panel.querySelector(".now-playing-layout__title");
  const artistEl = panel.querySelector(".now-playing-layout__artist");
  const elapsedEl = panel.querySelector(".spotify-time-elapsed");
  const totalEl = panel.querySelector(".spotify-time-total");
  const fillEl = panel.querySelector(".spotify-progress-fill");
  const seekSlider = panel.querySelector("[data-testid='spotify-seek']");
  const playPauseBtn = panel.querySelector("[data-testid='spotify-play-pause']");
  const skipBtn = panel.querySelector("[data-testid='spotify-skip']");
  const reconnectHint = panel.querySelector("[data-testid='spotify-reconnect-hint']");

  if (titleEl) titleEl.textContent = title;
  if (artistEl) artistEl.textContent = artist;
  renderNowPlayingMetaTicker(panel, { title, artist });
  if (elapsedEl) elapsedEl.textContent = formatClock(progressNow);
  if (totalEl) totalEl.textContent = formatClock(progressTotal);
  if (fillEl) fillEl.style.width = `${progressPercent}%`;
  if (seekSlider && !spotifySeekDragging) {
    seekSlider.max = String(progressTotal);
    seekSlider.value = String(Math.min(progressNow, progressTotal));
  }
  if (playPauseBtn) {
    playPauseBtn.setAttribute("aria-label", paused ? "Resume" : "Pause");
    playPauseBtn.innerHTML = paused ? spotifySvgPlay() : spotifySvgPause();
  }
  if (skipBtn) {
    skipBtn.disabled = skipDisabled;
  }
  if (reconnecting && !reconnectHint) {
    const p = document.createElement("p");
    p.className = "spotify-reconnect-hint";
    p.setAttribute("data-testid", "spotify-reconnect-hint");
    p.textContent = "Reconnecting player… Press Play to resume.";
    panel.prepend(p);
  } else if (!reconnecting && reconnectHint) {
    reconnectHint.remove();
  }
  mountNowPlayingTheaterChrome();
  return true;
};

const wireSpotifyPanelControls = (item) => {
  if (!item || item.provider !== "spotify") return;
  const playPauseBtn = playerHost.querySelector("[data-testid='spotify-play-pause']");
  const restartBtn = playerHost.querySelector("[data-testid='spotify-restart']");
  const seekSlider = playerHost.querySelector("[data-testid='spotify-seek']");
  const progressFill = playerHost.querySelector(".spotify-progress-fill");
  const elapsedEl = playerHost.querySelector(".spotify-time-elapsed");
  if (playPauseBtn) {
    playPauseBtn.onclick = () => {
      if (spotifyPlaybackState?.paused) void spotifyResume();
      else void spotifyPause();
    };
  }
  if (restartBtn) {
    restartBtn.onclick = () => void spotifySeek(0);
  }
  const skipBtn = playerHost.querySelector("[data-testid='spotify-skip']");
  if (skipBtn && !skipBtn.disabled) {
    skipBtn.onclick = () => void advanceTrack("user-skip");
  }
  if (seekSlider) {
    const syncSeekVisual = (positionMs) => {
      const totalMs = Math.max(
        1,
        Number(spotifyPlaybackState?.durationMs || Number(item.durationSec || 0) * 1000 || 0)
      );
      const pct = totalMs > 0 ? Math.min(100, (positionMs / totalMs) * 100) : 0;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (elapsedEl) elapsedEl.textContent = formatClock(positionMs);
    };
    const endSeekDrag = () => {
      spotifySeekDragging = false;
    };
    seekSlider.addEventListener("pointerdown", () => {
      spotifySeekDragging = true;
    });
    seekSlider.addEventListener("pointerup", endSeekDrag);
    seekSlider.addEventListener("pointercancel", endSeekDrag);
    seekSlider.addEventListener("input", (event) => {
      const target = Number(event.target.value || 0);
      spotifyPlaybackState = {
        ...spotifyPlaybackState,
        positionMs: target
      };
      syncSeekVisual(target);
    });
    seekSlider.addEventListener("change", (event) => {
      const target = Number(event.target.value || 0);
      void spotifySeek(target);
    });
  }
  const progressWrap = playerHost.querySelector(".spotify-progress-wrap");
  wireSeekHoverPreview({
    wrap: progressWrap,
    getDurationMs: () =>
      Math.max(1, spotifyPlaybackState?.durationMs || Number(item.durationSec || 0) * 1000),
    getPositionMs: () => spotifyPlaybackState?.positionMs ?? 0
  });
};

/** When the UI is opened from another origin (e.g. Live Server), set once: `?apiBase=http://127.0.0.1:3000` (no trailing slash). Persists in sessionStorage. */
const QUEUE_API_BASE_STORAGE_KEY = "queueApiBase";

const resolveQueueApiBase = () => {
  try {
    const raw = new URLSearchParams(window.location.search).get("apiBase");
    if (raw && String(raw).trim()) {
      const trimmed = String(raw).trim().replace(/\/$/, "");
      const u = new URL(trimmed);
      if (u.protocol === "http:" || u.protocol === "https:") {
        sessionStorage.setItem(QUEUE_API_BASE_STORAGE_KEY, trimmed);
        try {
          const loc = new URL(window.location.href);
          loc.searchParams.delete("apiBase");
          const qs = loc.searchParams.toString();
          const tail = qs ? `?${qs}` : "";
          window.history.replaceState({}, "", `${loc.pathname}${tail}${loc.hash}`);
        } catch (_) {
          /* ignore */
        }
        return trimmed;
      }
    }
  } catch (_) {
    /* ignore */
  }
  try {
    const stored = sessionStorage.getItem(QUEUE_API_BASE_STORAGE_KEY);
    if (stored && String(stored).trim()) {
      const t = String(stored).trim().replace(/\/$/, "");
      const u = new URL(t);
      if (u.protocol === "http:" || u.protocol === "https:") return t;
    }
  } catch (_) {
    /* ignore */
  }
  return "";
};

const queueApiBase = resolveQueueApiBase();

const BROWSER_SESSION_STORAGE_KEY = "queueBrowserSession";
let browserSessionToken = null;
try {
  const storedSession = sessionStorage.getItem(BROWSER_SESSION_STORAGE_KEY);
  if (storedSession && String(storedSession).trim()) {
    browserSessionToken = String(storedSession).trim();
  }
} catch (_) {
  /* ignore */
}

const apiUrl = (path) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!queueApiBase) return p;
  return new URL(p, `${queueApiBase}/`).toString();
};

const apiFetch = (path, init = {}) => {
  const headers = new Headers(init.headers || {});
  if (browserSessionToken) {
    headers.set("X-Browser-Session", browserSessionToken);
  }
  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: queueApiBase ? "omit" : "include"
  });
};

const bootstrapBrowserSession = async () => {
  const res = await apiFetch("/api/meta");
  if (!res.ok) return;
  let meta = null;
  try {
    meta = await res.json();
  } catch {
    return;
  }
  if (meta?.browserSessionToken) {
    browserSessionToken = meta.browserSessionToken;
    try {
      sessionStorage.setItem(BROWSER_SESSION_STORAGE_KEY, browserSessionToken);
    } catch (_) {
      /* ignore */
    }
  }
};

const setNowPlayingRowProvider = (provider) => {
  if (!nowPlayingRow) return;
  nowPlayingRow.className = "now-playing-row";
  if (provider === "spotify" || provider === "soundcloud" || provider === "applemusic") {
    nowPlayingRow.classList.add(`now-playing-row--${provider}`);
  }
};

let providers = [];
let queueState = { queue: [], currentIndex: -1, status: "idle" };
const RECENTLY_PLAYED_LIMIT = 5;
let recentlyPlayedItems = [];
let lastNowPlayingHistoryKey = null;
let lastNowPlayingSnapshot = null;
let lastNowPlayingEmbedKey = null;
let activeTimer = null;
let activeSpotifyResults = [];
let activeSpotifyAlbumResults = [];
let spotifySearchMode = "track";
let activeSoundcloudResults = [];
let activeSoundcloudAlbumResults = [];
let soundcloudSearchMode = "track";
/** SoundCloud album search browser (albums are playlist sets on SoundCloud). */
let soundcloudAlbumBrowser = {
  selectedId: null,
  selectedTitle: "",
  selectedAlbum: null,
  selectedSecretToken: null,
  tracks: [],
  tracksNextOffset: null,
  queueAllInProgress: false
};
/** Spotify album search browser (GET /api/spotify/albums/:id/tracks). */
let spotifyAlbumBrowser = {
  selectedId: null,
  selectedTitle: "",
  selectedAlbum: null,
  tracks: [],
  tracksNextOffset: null,
  queueAllInProgress: false
};
/** Spotify playlist browser (GET /api/spotify/playlists + tracks). */
let spotifyPlaylistBrowser = {
  likedSongs: null,
  likedSongsUnavailable: false,
  likedSongsHint: "",
  items: [],
  nextOffset: null,
  likedItems: [],
  likedNextOffset: null,
  demoMode: false,
  selectedId: null,
  selectedTitle: "",
  selectedPlaylistKind: null,
  tracks: [],
  tracksNextOffset: null,
  libraryFilterQuery: "",
  trackFilterQuery: "",
  trackSortMode: "newest"
};
const SPOTIFY_LIKED_SONGS_PLAYLIST_ID = "__liked_songs__";
/** Virtual playlist id for liked tracks (matches server SOUNDCLOUD_LIKES_ID). */
const SOUNDCLOUD_LIKES_PLAYLIST_ID = "__likes__";

/** SoundCloud library browser (Likes + owned + liked playlists). */
let soundcloudPlaylistBrowser = {
  likes: null,
  ownedItems: [],
  ownedNextOffset: null,
  likedItems: [],
  likedNextOffset: null,
  demoMode: false,
  selectedId: null,
  selectedTitle: "",
  selectedSecretToken: null,
  tracks: [],
  tracksNextOffset: null,
  libraryFilterQuery: "",
  trackFilterQuery: "",
  trackSortMode: "newest"
};
let spotifyPlaylistTracksLoadGeneration = 0;
let soundcloudPlaylistTracksLoadGeneration = 0;
let reorderInFlight = false;
/** Queue index while dragging an up-next row (HTML5 DnD). */
let queueDragFromIndex = null;
let spotifyPlayer = null;
let spotifyDeviceId = null;
let spotifySdkReady = false;
let spotifySdkInitStarted = false;
let spotifyPlaybackState = null;
let spotifyControlBusy = false;
let spotifyCredentialBanner = "";
/** User clicked Resume while SDK was still connecting; auto-retry on ready. */
let spotifyPlaybackPendingUserResume = false;
/** After reload, show reconnect UI until user resumes or playback restores. */
let spotifyReloadNeedsUserResume = false;
/** Serializes overlapping ensureSpotifyNowPlaying calls (auto-advance vs manual play). */
let spotifyRestoreChain = Promise.resolve();
/** Per-provider auth issues from API health or failed requests (spotify | soundcloud). */
const providerAuthIssues = { spotify: null, soundcloud: null, applemusic: null };
let authSuccessToast = null;
let authNoticeShowTimer = null;
let authNoticeFadeFallbackTimer = null;

const AUTH_NOTICE_VISIBLE_MS = 5000;
const AUTH_NOTICE_FADE_MS = 400;

const clearAuthNoticeFadeTimers = () => {
  if (authNoticeShowTimer) {
    clearTimeout(authNoticeShowTimer);
    authNoticeShowTimer = null;
  }
  if (authNoticeFadeFallbackTimer) {
    clearTimeout(authNoticeFadeFallbackTimer);
    authNoticeFadeFallbackTimer = null;
  }
};

const finishAuthNoticeHide = () => {
  clearAuthNoticeFadeTimers();
  if (!authNoticeEl) return;
  authSuccessToast = null;
  authNoticeEl.innerHTML = "";
  authNoticeEl.hidden = true;
};

const startAuthNoticeFade = () => {
  const box = authNoticeEl?.querySelector(".auth-notice");
  if (!box || box.classList.contains("auth-notice--fading")) return;

  const onTransitionEnd = (ev) => {
    if (ev && ev.propertyName !== "opacity") return;
    box.removeEventListener("transitionend", onTransitionEnd);
    finishAuthNoticeHide();
  };

  box.classList.add("auth-notice--fading");
  box.addEventListener("transitionend", onTransitionEnd);
  authNoticeFadeFallbackTimer = setTimeout(() => {
    box.removeEventListener("transitionend", onTransitionEnd);
    finishAuthNoticeHide();
  }, AUTH_NOTICE_FADE_MS + 50);
};

const scheduleAuthNoticeFade = () => {
  clearAuthNoticeFadeTimers();
  authNoticeShowTimer = setTimeout(startAuthNoticeFade, AUTH_NOTICE_VISIBLE_MS);
};

let advanceTrackInFlight = false;

const AUTH_RECONNECT_CODES = new Set([
  "SPOTIFY_REFRESH_FAILED",
  "SOUNDCLOUD_REFRESH_FAILED",
  "SPOTIFY_TOKEN_UNAVAILABLE",
  "SOUNDCLOUD_TOKEN_UNAVAILABLE",
  "TOKEN_REFRESH_FAILED",
  "PROVIDER_NOT_CONNECTED"
]);

const RATE_LIMIT_CODES = new Set([
  "SPOTIFY_RATE_LIMIT",
  "SOUNDCLOUD_RATE_LIMIT",
  "PROVIDER_RATE_LIMIT"
]);

const isRateLimitCode = (code) => RATE_LIMIT_CODES.has(code);

/** After OAuth redirect, delay Spotify library API calls to avoid refresh/token bursts. */
let deferSpotifyLibraryLoadUntil = 0;

const AUTH_CONNECT_CODES = new Set([
  "SPOTIFY_REFRESH_MISSING",
  "SOUNDCLOUD_REFRESH_MISSING",
  "OAUTH_NOT_CONFIGURED"
]);

const isAuthErrorCode = (code) => {
  if (!code) return false;
  const c = String(code);
  if (AUTH_RECONNECT_CODES.has(c) || AUTH_CONNECT_CODES.has(c)) return true;
  if (c.includes("REFRESH") || c.includes("TOKEN_")) return true;
  if (c === "SPOTIFY_OAUTH_CONFIG_MISSING" || c === "SOUNDCLOUD_OAUTH_CONFIG_MISSING") return true;
  if (c === "APPLE_MUSIC_NOT_CONFIGURED" || c === "APPLE_MUSIC_API_PENDING") return true;
  return false;
};

const oauthLoginPath = (provider, code) => {
  const base = `/api/oauth/${provider}/login`;
  if (
    provider === "spotify" &&
    code &&
    (String(code).includes("SCOPE") ||
      String(code).includes("PLAYLIST") ||
      String(code).includes("403"))
  ) {
    return `${base}?reconnect=1`;
  }
  return base;
};

const resolveAuthIssue = (provider, code, serverMessage, serverHint, healthAction) => {
  const label = formatProviderLabel(provider);
  if (isRateLimitCode(code)) {
    return {
      title: `${label} busy`,
      body:
        serverMessage ||
        serverHint ||
        `${label} is rate-limited. Wait a minute and try again — you do not need to reconnect.`,
      primaryLabel: null,
      primaryHref: null,
      tone: "warning"
    };
  }
  const body =
    [serverMessage || serverHint, serverHint && serverMessage ? serverHint : null]
      .filter(Boolean)
      .join(" — ") ||
    (code === "SPOTIFY_REFRESH_MISSING" || code === "SOUNDCLOUD_REFRESH_MISSING"
      ? `${label} is in demo mode. Use Connect (OAuth) for your real library.`
      : code === "SPOTIFY_OAUTH_CONFIG_MISSING" || code === "SOUNDCLOUD_OAUTH_CONFIG_MISSING"
        ? `${label} OAuth is not configured on this server. Check .env and restart.`
        : `${label} session expired. Reconnect to continue.`);

  let primaryLabel = null;
  let primaryHref = null;
  if (
    healthAction === "reconnect" ||
    (code && isAuthErrorCode(code) && !AUTH_CONNECT_CODES.has(code) && !isRateLimitCode(code))
  ) {
    if (code !== "SPOTIFY_OAUTH_CONFIG_MISSING" && code !== "SOUNDCLOUD_OAUTH_CONFIG_MISSING") {
      primaryLabel = healthAction === "connect" ? `Connect ${label}` : `Reconnect ${label}`;
      primaryHref = apiUrl(oauthLoginPath(provider, code));
    }
  } else if (healthAction === "connect" || AUTH_CONNECT_CODES.has(code)) {
    primaryLabel = `Connect ${label}`;
    primaryHref = apiUrl(oauthLoginPath(provider, code));
  }

  return {
    title: label,
    body,
    primaryLabel,
    primaryHref,
    tone: code === "SPOTIFY_RATE_LIMIT" || code === "SOUNDCLOUD_RATE_LIMIT" ? "warning" : "warning"
  };
};

const syncProviderAuthFromHealth = () => {
  providers.forEach((p) => {
    if (p.health === "degraded" || p.health === "rate_limited") {
      providerAuthIssues[p.provider] = resolveAuthIssue(
        p.provider,
        p.healthCode,
        p.healthMessage,
        null,
        p.healthAction
      );
    } else if (p.health === "unconfigured") {
      providerAuthIssues[p.provider] = resolveAuthIssue(
        p.provider,
        p.healthCode,
        p.healthMessage,
        null,
        p.healthAction
      );
    } else if (p.health === "ok") {
      if (p.provider !== "spotify" || !spotifyCredentialBanner) {
        providerAuthIssues[p.provider] = null;
      }
    } else {
      providerAuthIssues[p.provider] = null;
    }
  });
};

const noteRateLimit = (provider, err) => {
  if (!err || !isRateLimitCode(err.code)) return false;
  providerAuthIssues[provider] = resolveAuthIssue(
    provider,
    err.code,
    err.error || err.message || err.hint,
    null,
    null
  );
  const idx = providers.findIndex((row) => row.provider === provider);
  if (idx >= 0) {
    providers[idx] = {
      ...providers[idx],
      health: "rate_limited",
      healthCode: err.code,
      healthMessage: providerAuthIssues[provider]?.body || providers[idx].healthMessage,
      healthAction: null,
      retryAfterSec: err.retryAfterSec ?? providers[idx].retryAfterSec
    };
  }
  renderAuthNotice();
  renderProviders();
  return true;
};

const noteAuthFailure = (provider, err) => {
  if (!err) return false;
  const code = err.code;
  if (isRateLimitCode(code)) {
    return noteRateLimit(provider, err);
  }
  if (!isAuthErrorCode(code) && !/authorization|expired|token/i.test(String(err.error || ""))) {
    return false;
  }
  providerAuthIssues[provider] = resolveAuthIssue(
    provider,
    code,
    err.error,
    err.hint,
    err.healthAction || (AUTH_CONNECT_CODES.has(code) ? "connect" : "reconnect")
  );
  const idx = providers.findIndex((row) => row.provider === provider);
  if (idx >= 0) {
    providers[idx] = {
      ...providers[idx],
      health: "degraded",
      healthCode: code || providers[idx].healthCode,
      healthMessage: err.error || providers[idx].healthMessage,
      healthAction: providerAuthIssues[provider]?.primaryHref ? "reconnect" : providers[idx].healthAction
    };
  }
  renderAuthNotice();
  renderProviders();
  return true;
};

const noteAuthFailureFromMessage = (provider, message) => {
  if (!message) return false;
  const lower = String(message).toLowerCase();
  if (
    !/authorization|expired|reconnect|token unavailable|oauth|denied library|session expired/.test(
      lower
    )
  ) {
    return false;
  }
  let code = null;
  if (lower.includes("expired")) {
    code = provider === "spotify" ? "SPOTIFY_TOKEN_UNAVAILABLE" : "SOUNDCLOUD_TOKEN_UNAVAILABLE";
  } else if (lower.includes("reconnect")) {
    code = provider === "spotify" ? "SPOTIFY_REFRESH_FAILED" : "SOUNDCLOUD_REFRESH_FAILED";
  }
  return noteAuthFailure(provider, { error: message, code });
};

const alertUnlessAuthNotice = (provider, message, fallback = "Something went wrong") => {
  if (!noteAuthFailureFromMessage(provider, message)) {
    alert(message || fallback);
  }
};

const showAuthSuccess = (message) => {
  authSuccessToast = { title: "Connected", body: message };
  renderAuthNotice();
};

const renderAuthNotice = () => {
  if (!authNoticeEl) return;

  clearAuthNoticeFadeTimers();

  let content = null;
  if (authSuccessToast) {
    content = { tone: "success", title: authSuccessToast.title, body: authSuccessToast.body };
  } else if (spotifyCredentialBanner) {
    content = {
      tone: "warning",
      title: "Spotify playback",
      body: spotifyCredentialBanner,
      primaryLabel: "Reconnect Spotify",
      primaryHref: apiUrl(oauthLoginPath("spotify"))
    };
  } else {
    for (const key of ["spotify", "soundcloud"]) {
      const issue = providerAuthIssues[key];
      if (issue?.body) {
        content = { tone: issue.tone || "warning", ...issue };
        break;
      }
    }
  }

  authNoticeEl.innerHTML = "";
  if (!content) {
    finishAuthNoticeHide();
    return;
  }

  authNoticeEl.hidden = false;
  const box = document.createElement("div");
  box.className = `auth-notice auth-notice--${content.tone || "warning"}`;

  const text = document.createElement("div");
  text.className = "auth-notice__text";
  const title = document.createElement("p");
  title.className = "auth-notice__title";
  title.textContent = content.title || "Account";
  const body = document.createElement("p");
  body.className = "auth-notice__body";
  body.textContent = content.body;
  text.appendChild(title);
  text.appendChild(body);
  box.appendChild(text);

  const actions = document.createElement("div");
  actions.className = "auth-notice__actions";

  if (content.primaryHref && content.primaryLabel) {
    const primary = document.createElement("button");
    primary.type = "button";
    primary.className = "auth-notice__btn";
    primary.textContent = content.primaryLabel;
    primary.onclick = () => {
      window.location.assign(content.primaryHref);
    };
    actions.appendChild(primary);
  }

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "auth-notice__btn auth-notice__btn--ghost";
  dismiss.textContent = "Dismiss";
  dismiss.onclick = () => {
    clearAuthNoticeFadeTimers();
    authSuccessToast = null;
    if (content.title === "Spotify playback") {
      spotifyCredentialBanner = "";
    } else {
      for (const key of ["spotify", "soundcloud"]) {
        if (providerAuthIssues[key]?.body === content.body) {
          providerAuthIssues[key] = null;
        }
      }
    }
    finishAuthNoticeHide();
  };
  actions.appendChild(dismiss);
  box.appendChild(actions);
  authNoticeEl.appendChild(box);
  scheduleAuthNoticeFade();
};

const handleOAuthReturnParams = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("spotify") === "connected") {
      deferSpotifyLibraryLoadUntil = Date.now() + 2500;
      showAuthSuccess("Spotify linked. You can search and play from your account.");
    } else if (params.get("soundcloud") === "connected") {
      showAuthSuccess("SoundCloud linked. Your likes and playlists are available.");
    }
    if (params.has("spotify") || params.has("soundcloud")) {
      const loc = new URL(window.location.href);
      loc.searchParams.delete("spotify");
      loc.searchParams.delete("soundcloud");
      const qs = loc.searchParams.toString();
      const tail = qs ? `?${qs}` : "";
      window.history.replaceState({}, "", `${loc.pathname}${tail}${loc.hash}`);
    }
  } catch (_) {
    /* ignore */
  }
};
let spotifySeekDragging = false;
/** True only after the user clicks Pause; do not trust SDK `paused` alone for auto-advance. */
let spotifyPausedByUser = false;

let soundCloudFinishHandler = null;
/** Bound SC Widget listeners for the hidden embed (unbind on teardown). */
let soundCloudWidgetHandlers = null;
let soundcloudPlaybackState = null;
let soundcloudSeekDragging = false;

/** Last raw Spotify Web Playback SDK state (used when `player_state_changed` emits null). */
let lastSpotifyPlayerStateSnapshot = null;

/** Prevents duplicate auto-advance from natural-end heuristics for the same queue index + track. */
let spotifyNaturalEndLatchKey = null;
/** Suppresses auto-advance while POST /api/queue/now-playing + manual play is in flight. */
let manualQueueSelectInFlight = false;

/** Max position seen for current queue Spotify row (detect same-track restart). */
let spotifyPeakPositionMs = 0;
let spotifyPeakKey = null;

/** Wall-clock anchor for Spotify timer fallback (`${index}:${trackId}`). */
let spotifyWallStartMs = null;
let spotifyWallAnchorKey = null;

const spotifyReloadSnap = () => {
  if (!window.spotifyReloadSnapshot) {
    console.warn("spotifyReloadSnapshot missing; load /spotifyReloadSnapshot.js before /app.js");
  }
  return (
    window.spotifyReloadSnapshot || {
      writeSpotifyReloadSnapshot: () => {},
      readSpotifyReloadSnapshot: () => null,
      clearSpotifyReloadSnapshot: () => {},
      writeSoundCloudReloadSnapshot: () => {},
      readSoundCloudReloadSnapshot: () => null,
      clearSoundCloudReloadSnapshot: () => {},
      resolveSpotifyResumePositionMs: () => 0,
      resolveResumePositionMs: () => 0,
      soundCloudSnapshotMatchesItem: () => false
    }
  );
};

const spotifyConfirmPlaying = () => {
  if (!window.SpotifyConfirmPlaying) {
    console.warn("SpotifyConfirmPlaying missing; load /spotifyConfirmPlaying.js before /app.js");
  }
  return (
    window.SpotifyConfirmPlaying || {
      spotifySdkTrackId: (state) => state?.track_window?.current_track?.id || null,
      isSpotifyStatePlayingTrack: (state, trackId) => {
        if (!trackId || !state) return false;
        const sdkId = state?.track_window?.current_track?.id;
        return sdkId === trackId && !state.paused;
      },
      needsSpotifyPlaybackRetry: (state, trackId) => {
        if (!trackId || !state) return true;
        const sdkId = state?.track_window?.current_track?.id;
        return sdkId !== trackId || Boolean(state.paused);
      },
      shouldScheduleAutoAdvanceAfterTrackAdvance: ({ provider, playbackStarted }) =>
        provider === "spotify" ? Boolean(playbackStarted) : true,
      DEFAULT_CONFIRM_POLL_MS: 200,
      DEFAULT_CONFIRM_TIMEOUT_MS: 3000,
      computeConfirmPollDeadline: (timeoutMs, nowMs = Date.now()) =>
        nowMs + Math.max(0, Number(timeoutMs) || 3000)
    }
  );
};

const spotifyAdvance = () => {
  if (!window.SpotifyAdvanceLogic) {
    console.warn("SpotifyAdvanceLogic missing; load /spotifyAdvanceLogic.js before /app.js");
  }
  return (
    window.SpotifyAdvanceLogic || {
      effectiveDurationMs: (sdk, sec) => {
        const a = Math.max(0, Number(sdk) || 0);
        const b = Math.max(0, Math.round(Number(sec) || 0) * 1000);
        if (a > 0 && b > 0) return Math.max(a, b);
        return a > 0 ? a : b;
      },
      detectSpotifyTrackRestart: () => ({ shouldAdvance: false }),
      computeSpotifyAutoAdvanceDelayMs: ({ durationSec }) =>
        Math.max(800, Math.round(Number(durationSec) || 180) * 1000 + 2000)
    }
  );
};

const SPOTIFY_QUEUE_BADGE_SRC = "/spotify-queue-badge.png";
const SOUNDCLOUD_QUEUE_BADGE_SRC = "/soundcloud-queue-badge.png";
const APPLE_MUSIC_QUEUE_BADGE_SRC = "/apple-music-queue-badge.svg";

const createSpotifyQueueBadge = ({ testId = "queue-provider-spotify" } = {}) => {
  const img = document.createElement("img");
  img.src = SPOTIFY_QUEUE_BADGE_SRC;
  img.alt = "Spotify";
  img.className = "provider-badge-spotify";
  if (testId) img.setAttribute("data-testid", testId);
  img.decoding = "async";
  img.loading = "lazy";
  return img;
};

/** Up-next list entries for the queue panel (server indices preserved). */
const upcomingQueueEntries = (queue, currentIndex) => {
  if (currentIndex < 0) {
    return queue.map((item, idx) => ({ item, idx }));
  }
  return queue.map((item, idx) => ({ item, idx })).filter(({ idx }) => idx !== currentIndex);
};

const createSoundcloudQueueBadge = ({ testId = "queue-provider-soundcloud" } = {}) => {
  const img = document.createElement("img");
  img.src = SOUNDCLOUD_QUEUE_BADGE_SRC;
  img.alt = "SoundCloud";
  img.className = "provider-badge-soundcloud";
  if (testId) img.setAttribute("data-testid", testId);
  img.decoding = "async";
  img.loading = "lazy";
  return img;
};

const createAppleMusicQueueBadge = ({ testId = "queue-provider-applemusic" } = {}) => {
  const img = document.createElement("img");
  img.src = APPLE_MUSIC_QUEUE_BADGE_SRC;
  img.alt = "Apple Music";
  img.className = "provider-badge-applemusic";
  if (testId) img.setAttribute("data-testid", testId);
  img.decoding = "async";
  img.loading = "lazy";
  return img;
};

/** Display name for provider keys (API remains lowercase). */
const formatProviderLabel = (provider) => {
  if (provider === "spotify") return "Spotify";
  if (provider === "soundcloud") return "SoundCloud";
  if (provider === "applemusic") return "Apple Music";
  if (!provider) return "";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
};

const appendProviderBadge = (parent, provider) => {
  if (provider === "spotify") {
    parent.appendChild(createSpotifyQueueBadge());
    return;
  }
  if (provider === "soundcloud") {
    parent.appendChild(createSoundcloudQueueBadge());
    return;
  }
  if (provider === "applemusic") {
    parent.appendChild(createAppleMusicQueueBadge());
    return;
  }
  parent.appendChild(document.createTextNode(`[${formatProviderLabel(provider)}]`));
};

const PLAYBACK_DEBUG_MAX_SDK = 12;

const playbackDebugEnabled = () =>
  new URLSearchParams(window.location.search).get("debug") === "1" ||
  window.localStorage.getItem("unifiedQueuePlaybackDebug") === "1";

const playbackDiagState = {
  lastToken: null,
  lastPlay: null,
  sdkEvents: []
};

const recordPlaybackDiagToken = (status, ok, rawSnippet) => {
  playbackDiagState.lastToken = {
    at: new Date().toISOString(),
    status,
    ok,
    snippet: (rawSnippet || "").slice(0, 600)
  };
  renderPlaybackDiag();
};

const recordPlaybackDiagPlay = (status, ok, rawSnippet) => {
  playbackDiagState.lastPlay = {
    at: new Date().toISOString(),
    status,
    ok,
    snippet: (rawSnippet || "").slice(0, 800)
  };
  renderPlaybackDiag();
};

const pushPlaybackSdkEvent = (tag, message) => {
  const line = `${new Date().toISOString()} [${tag}] ${message || ""}`;
  playbackDiagState.sdkEvents.push(line);
  if (playbackDiagState.sdkEvents.length > PLAYBACK_DEBUG_MAX_SDK) {
    playbackDiagState.sdkEvents.splice(0, playbackDiagState.sdkEvents.length - PLAYBACK_DEBUG_MAX_SDK);
  }
  renderPlaybackDiag();
};

const renderSpotifySdkBanner = () => {
  if (spotifyCredentialBanner) console.warn("[Spotify]", spotifyCredentialBanner);
  renderAuthNotice();
};

const renderPlaybackDiag = () => {
  if (!playbackDebugEnabled()) return;
  const parts = [];
  parts.push("--- Last GET /api/spotify/token ---");
  parts.push(
    playbackDiagState.lastToken ? JSON.stringify(playbackDiagState.lastToken, null, 2) : "(none yet)"
  );
  parts.push("");
  parts.push("--- Last POST /api/spotify/player/play ---");
  parts.push(
    playbackDiagState.lastPlay ? JSON.stringify(playbackDiagState.lastPlay, null, 2) : "(none yet)"
  );
  parts.push("");
  parts.push("--- SDK log (oldest → newest) ---");
  parts.push(
    playbackDiagState.sdkEvents.length ? playbackDiagState.sdkEvents.join("\n") : "(no SDK events yet)"
  );
  console.info("[playback debug]\n" + parts.join("\n"));
};

const clearActiveTimer = () => {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
};

const getSoundCloudWidget = () => {
  const iframe = playerHost?.querySelector?.("iframe.sc-widget");
  if (!iframe || !window.SC?.Widget) return null;
  try {
    return window.SC.Widget(iframe);
  } catch (_) {
    return null;
  }
};

const soundCloudThumbUrl = (artworkUrl) => {
  const raw = typeof artworkUrl === "string" ? artworkUrl.trim() : "";
  if (!raw) return undefined;
  if (/-large\.(jpg|jpeg|png|webp)/i.test(raw)) {
    return raw.replace(/-large(?=\.(jpg|jpeg|png|webp))/i, "-t67x67");
  }
  if (/-t500x500\.(jpg|jpeg|png|webp)/i.test(raw)) {
    return raw.replace(/-t500x500(?=\.(jpg|jpeg|png|webp))/i, "-t67x67");
  }
  return raw;
};

const soundCloudResolveCoverUrl = (item) =>
  item?.imageUrl || soundcloudPlaybackState?.coverUrl || undefined;

const patchSoundCloudCover = (panel, coverUrl) => {
  if (!panel || !coverUrl) return;
  const cover = panel.querySelector("img.vinyl-hero__cover");
  const fallback = panel.querySelector(".vinyl-hero__cover-fallback");
  if (cover && cover.getAttribute("src") !== coverUrl) {
    cover.setAttribute("src", coverUrl);
    cover.hidden = false;
  }
  if (fallback) {
    fallback.hidden = true;
  }
};

const soundCloudPlayerIframeSrc = (permalink) => {
  const q = new URLSearchParams();
  q.set("url", permalink);
  q.set("color", "ff5500");
  q.set("auto_play", "true");
  q.set("hide_related", "true");
  q.set("show_comments", "false");
  q.set("show_user", "false");
  q.set("show_reposts", "false");
  q.set("visual", "false");
  q.set("buying", "false");
  q.set("sharing", "false");
  return `https://w.soundcloud.com/player/?${q.toString()}`;
};

const applySoundCloudPlaybackState = (partial) => {
  if (!partial || typeof partial !== "object") return;
  soundcloudPlaybackState = { ...(soundcloudPlaybackState || {}), ...partial };
  const idx = queueState.currentIndex;
  const cur = idx >= 0 && idx < queueState.queue.length ? queueState.queue[idx] : null;
  if (cur?.provider === "soundcloud" && !soundcloudSeekDragging) {
    const panel = playerHost?.querySelector?.(".soundcloud-sdk-panel");
    if ("paused" in partial) patchSoundCloudTransportDom(cur);
    if ("positionMs" in partial || "durationMs" in partial) patchSoundCloudProgressDom(cur);
    if ("coverUrl" in partial && panel) {
      patchSoundCloudCover(panel, soundCloudResolveCoverUrl(cur));
    }
    if ("coverUrl" in partial || "paused" in partial) {
      renderNowPlayingHero(cur);
    }
    if (!("paused" in partial) && !("positionMs" in partial) && !("durationMs" in partial) && !("coverUrl" in partial)) {
      patchSoundCloudPanelDom(cur);
    }
    flushSoundCloudReloadSnapshot();
  }
};

const soundCloudHasNext = () =>
  upcomingQueueEntries(queueState.queue, queueState.currentIndex).length > 0;

const patchSoundCloudProgressDom = (item) => {
  if (!playerHost || !item) return;
  const panel = playerHost.querySelector(".soundcloud-sdk-panel");
  if (!panel) return;
  const progressNow = soundcloudPlaybackState?.positionMs || 0;
  const progressTotal =
    soundcloudPlaybackState?.durationMs || Math.max(0, Number(item.durationSec || 0) * 1000);
  const progressPercent =
    progressTotal > 0 ? Math.min(100, (progressNow / progressTotal) * 100) : 0;
  const progressFill = panel.querySelector(".soundcloud-progress-fill");
  const elapsedEl = panel.querySelector(".soundcloud-time-elapsed");
  const totalEl = panel.querySelector(".soundcloud-time-total");
  const seekSlider = panel.querySelector("[data-testid='soundcloud-seek']");
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (elapsedEl) elapsedEl.textContent = formatClock(progressNow);
  if (totalEl) totalEl.textContent = formatClock(progressTotal);
  if (seekSlider && !soundcloudSeekDragging) {
    seekSlider.max = String(Math.max(1, progressTotal));
    seekSlider.value = String(Math.min(progressNow, Math.max(1, progressTotal)));
  }
};

const patchSoundCloudTransportDom = (item) => {
  if (!playerHost || !item) return;
  const panel = playerHost.querySelector(".soundcloud-sdk-panel");
  if (!panel) return;
  const paused = Boolean(soundcloudPlaybackState?.paused);
  const playPauseBtn = panel.querySelector("[data-testid='soundcloud-play-pause']");
  const skipBtn = panel.querySelector("[data-testid='soundcloud-skip']");
  const skipDisabled = advanceTrackInFlight || !soundCloudHasNext();
  if (playPauseBtn) {
    playPauseBtn.innerHTML = paused ? spotifySvgPlay() : spotifySvgPause();
    playPauseBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
  }
  if (skipBtn) {
    skipBtn.disabled = skipDisabled;
    skipBtn.setAttribute("aria-disabled", skipDisabled ? "true" : "false");
  }
};

const patchSoundCloudPanelDom = (item) => {
  if (!playerHost || !item) return;
  const panel = playerHost.querySelector(".soundcloud-sdk-panel");
  if (!panel) return;
  patchSoundCloudProgressDom(item);
  patchSoundCloudTransportDom(item);
  patchSoundCloudCover(panel, soundCloudResolveCoverUrl(item));
};

const patchSoundCloudTransportState = (item) => {
  if (!playerHost || !item) return;
  patchSoundCloudPanelDom(item);
  const playPauseBtn = playerHost.querySelector("[data-testid='soundcloud-play-pause']");
  const skipBtn = playerHost.querySelector("[data-testid='soundcloud-skip']");
  if (playPauseBtn) {
    playPauseBtn.onclick = () => soundCloudTogglePlayPause();
  }
  if (skipBtn) {
    skipBtn.onclick = () => {
      if (skipBtn.disabled || advanceTrackInFlight) return;
      void advanceTrack("user-skip");
    };
  }
};

const teardownSoundCloudWidget = () => {
  const iframe = playerHost?.querySelector?.("iframe.sc-widget");
  if (iframe && window.SC?.Widget && soundCloudWidgetHandlers) {
    try {
      const widget = window.SC.Widget(iframe);
      const E = window.SC.Widget.Events;
      const h = soundCloudWidgetHandlers;
      if (h.finish) widget.unbind(E.FINISH, h.finish);
      if (h.progress) widget.unbind(E.PLAY_PROGRESS, h.progress);
      if (h.ready) widget.unbind(E.READY, h.ready);
      if (h.play) widget.unbind(E.PLAY, h.play);
      if (h.pause) widget.unbind(E.PAUSE, h.pause);
    } catch (_) {}
  }
  soundCloudWidgetHandlers = null;
  soundCloudFinishHandler = null;
  soundcloudPlaybackState = null;
  soundcloudSeekDragging = false;
};

const applySoundCloudReloadResumeOnReady = (widget, item) => {
  const snap = readSoundCloudReloadSnapForItem(item);
  if (!snap) return;
  const resumeMs = spotifyReloadSnap().resolveResumePositionMs(
    { trackId: item.trackId, index: queueState.currentIndex, durationSec: item.durationSec },
    snap
  );
  if (resumeMs > 0) {
    try {
      widget.seekTo(resumeMs);
    } catch (_) {}
    applySoundCloudPlaybackState({ positionMs: resumeMs });
  }
  if (!snap.paused) {
    widget.isPaused((paused) => {
      if (paused) {
        try {
          widget.play();
        } catch (_) {}
      }
    });
  }
};

const attachSoundCloudWidget = (item) => {
  if (item.provider !== "soundcloud" || !item.permalinkUrl) return;
  const iframe = playerHost.querySelector("iframe.sc-widget");
  if (!iframe || !window.SC?.Widget) return;
  const widget = window.SC.Widget(iframe);
  const E = window.SC.Widget.Events;
  const reloadSnap = readSoundCloudReloadSnapForItem(item);

  const onFinish = () => {
    if (advanceTrackInFlight) return;
    void advanceTrack("soundcloud-widget-finished");
  };
  const onProgress = (data) => {
    const positionMs = Number(data?.currentPosition ?? data?.position ?? 0);
    applySoundCloudPlaybackState({ positionMs });
  };
  const onReady = () => {
    globalThis.unifyVolume?.applyVolumeToPlayers?.();
    widget.getDuration((durationMs) => {
      applySoundCloudPlaybackState({ durationMs: Number(durationMs) || 0 });
    });
    applySoundCloudReloadResumeOnReady(widget, item);
    widget.getPosition((positionMs) => {
      applySoundCloudPlaybackState({ positionMs: Number(positionMs) || 0 });
    });
    if (typeof widget.getSounds === "function") {
      widget.getSounds((sounds) => {
        const art = sounds?.[0]?.artwork_url || sounds?.[0]?.artworkUrl;
        const thumb = soundCloudThumbUrl(art);
        if (thumb) {
          applySoundCloudPlaybackState({ coverUrl: thumb });
        }
      });
    }
  };
  const onPlay = () => {
    applySoundCloudPlaybackState({ paused: false });
    scheduleAutoAdvance();
  };
  const onPause = () => {
    applySoundCloudPlaybackState({ paused: true });
    widget.getPosition((positionMs) => {
      applySoundCloudPlaybackState({ positionMs: Number(positionMs) || 0 });
    });
  };

  soundCloudFinishHandler = onFinish;
  soundCloudWidgetHandlers = {
    finish: onFinish,
    progress: onProgress,
    ready: onReady,
    play: onPlay,
    pause: onPause
  };

  widget.bind(E.FINISH, onFinish);
  widget.bind(E.PLAY_PROGRESS, onProgress);
  widget.bind(E.READY, onReady);
  widget.bind(E.PLAY, onPlay);
  widget.bind(E.PAUSE, onPause);

  const wantPermalink = soundCloudEmbedPermalink(item);
  const embedded = iframe.getAttribute("data-sc-permalink");
  if (embedded !== wantPermalink) {
    try {
      const autoPlay = reloadSnap ? !reloadSnap.paused : true;
      widget.load(item.permalinkUrl, { auto_play: autoPlay });
      iframe.setAttribute("data-sc-permalink", wantPermalink);
    } catch (_) {}
  } else {
    widget.isPaused((paused) => {
      if (reloadSnap) {
        applySoundCloudReloadResumeOnReady(widget, item);
        return;
      }
      if (paused) {
        try {
          widget.play();
        } catch (_) {}
      }
    });
    onReady();
  }
};

const soundCloudTogglePlayPause = () => {
  const widget = getSoundCloudWidget();
  if (!widget) return;
  const wasPaused = Boolean(soundcloudPlaybackState?.paused);
  applySoundCloudPlaybackState({ paused: !wasPaused });
  try {
    if (typeof widget.toggle === "function") widget.toggle();
    else if (wasPaused) widget.play();
    else widget.pause();
  } catch (_) {}
};

const soundCloudSeek = (ms) => {
  const widget = getSoundCloudWidget();
  if (!widget) return;
  const target = Math.max(0, Math.round(Number(ms) || 0));
  widget.seekTo(target);
  applySoundCloudPlaybackState({ positionMs: target });
  flushSoundCloudReloadSnapshot();
};

const wireSoundCloudPanelControls = (item) => {
  if (!playerHost || !item) return;
  const playPauseBtn = playerHost.querySelector("[data-testid='soundcloud-play-pause']");
  const restartBtn = playerHost.querySelector("[data-testid='soundcloud-restart']");
  const seekSlider = playerHost.querySelector("[data-testid='soundcloud-seek']");
  const progressFill = playerHost.querySelector(".soundcloud-progress-fill");
  const elapsedEl = playerHost.querySelector(".soundcloud-time-elapsed");
  const totalMs = Math.max(
    1,
    soundcloudPlaybackState?.durationMs || Number(item.durationSec || 0) * 1000
  );
  if (playPauseBtn) {
    playPauseBtn.onclick = () => soundCloudTogglePlayPause();
  }
  if (restartBtn) {
    restartBtn.onclick = () => {
      soundCloudSeek(0);
      const widget = getSoundCloudWidget();
      if (widget) {
        try {
          widget.play();
        } catch (_) {}
      }
      applySoundCloudPlaybackState({ positionMs: 0, paused: false });
    };
  }
  const skipBtn = playerHost.querySelector("[data-testid='soundcloud-skip']");
  if (skipBtn) {
    skipBtn.onclick = () => {
      if (skipBtn.disabled || advanceTrackInFlight) return;
      void advanceTrack("user-skip");
    };
  }
  if (seekSlider) {
    const syncSeekVisual = (positionMs) => {
      const pct = totalMs > 0 ? Math.min(100, (positionMs / totalMs) * 100) : 0;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (elapsedEl) elapsedEl.textContent = formatClock(positionMs);
    };
    const endSeekDrag = () => {
      soundcloudSeekDragging = false;
    };
    seekSlider.addEventListener("pointerdown", () => {
      soundcloudSeekDragging = true;
    });
    seekSlider.addEventListener("pointerup", endSeekDrag);
    seekSlider.addEventListener("pointercancel", endSeekDrag);
    seekSlider.addEventListener("input", (event) => {
      const target = Number(event.target.value || 0);
      applySoundCloudPlaybackState({ positionMs: target });
      syncSeekVisual(target);
    });
    seekSlider.addEventListener("change", (event) => {
      const target = Number(event.target.value || 0);
      soundCloudSeek(target);
    });
  }
  const progressWrap = playerHost.querySelector(".soundcloud-progress-wrap");
  wireSeekHoverPreview({
    wrap: progressWrap,
    getDurationMs: () =>
      Math.max(1, soundcloudPlaybackState?.durationMs || Number(item.durationSec || 0) * 1000),
    getPositionMs: () => soundcloudPlaybackState?.positionMs ?? 0
  });
};

const touchSpotifyPeakTracking = (idx, item) => {
  if (!item || item.provider !== "spotify" || idx < 0) {
    spotifyPeakKey = null;
    spotifyPeakPositionMs = 0;
    return;
  }
  const k = `${idx}:${item.trackId}`;
  if (k !== spotifyPeakKey) {
    spotifyPeakKey = k;
    spotifyPeakPositionMs = 0;
  }
};

const recordSpotifyWallAnchor = (idx, trackId) => {
  if (idx < 0 || !trackId) {
    clearSpotifyWallAnchor();
    return;
  }
  spotifyWallStartMs = Date.now();
  spotifyWallAnchorKey = `${idx}:${trackId}`;
};

const clearSpotifyWallAnchor = () => {
  spotifyWallStartMs = null;
  spotifyWallAnchorKey = null;
};

const flushSpotifyReloadSnapshot = () => {
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider !== "spotify" || !item.trackId) return;
  const pos =
    spotifyPlaybackState?.positionMs != null
      ? Number(spotifyPlaybackState.positionMs)
      : spotifyReloadSnap().readSpotifyReloadSnapshot(sessionStorage)?.positionMs ?? 0;
  spotifyReloadSnap().writeSpotifyReloadSnapshot(sessionStorage, {
    index: idx,
    trackId: item.trackId,
    positionMs: pos,
    durationMs:
      spotifyPlaybackState?.durationMs || Math.max(0, Math.round(Number(item.durationSec) || 0) * 1000),
    paused: spotifyPlaybackState?.paused ?? spotifyPausedByUser
  });
};

const clearSpotifyReloadSnapshotForQueueChange = () => {
  spotifyReloadSnap().clearSpotifyReloadSnapshot(sessionStorage);
  spotifyReloadSnap().clearSoundCloudReloadSnapshot(sessionStorage);
};

const flushSoundCloudReloadSnapshot = () => {
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider !== "soundcloud" || !item.trackId) return;
  const pos =
    soundcloudPlaybackState?.positionMs != null
      ? Number(soundcloudPlaybackState.positionMs)
      : spotifyReloadSnap().readSoundCloudReloadSnapshot(sessionStorage)?.positionMs ?? 0;
  spotifyReloadSnap().writeSoundCloudReloadSnapshot(sessionStorage, {
    index: idx,
    trackId: item.trackId,
    positionMs: pos,
    durationMs:
      soundcloudPlaybackState?.durationMs ||
      Math.max(0, Math.round(Number(item.durationSec) || 0) * 1000),
    paused: soundcloudPlaybackState?.paused ?? true,
    permalink: item.permalinkUrl || undefined
  });
};

const readSoundCloudReloadSnapForItem = (item) => {
  if (!item || item.provider !== "soundcloud") return null;
  const snap = spotifyReloadSnap().readSoundCloudReloadSnapshot(sessionStorage);
  return spotifyReloadSnap().soundCloudSnapshotMatchesItem(item, snap) ? snap : null;
};

const isSpotifyProviderConnected = () =>
  providers.some((p) => p.provider === "spotify" && p.connected);

const isAnyProviderConnected = () => providers.some((p) => p.connected);

const setSpotifyReconnectBanner = (message) => {
  if (message) {
    spotifyCredentialBanner = message;
  } else if (!providerAuthIssues.spotify) {
    spotifyCredentialBanner = "";
  }
  renderSpotifySdkBanner();
};

const maybeBootstrapSpotifyAfterQueueLoad = () => {
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider !== "spotify" || !isSpotifyProviderConnected()) return;
  const snap = spotifyReloadSnap().readSpotifyReloadSnapshot(sessionStorage);
  const matched = snap?.trackId === item.trackId;
  if (matched) {
    spotifyPlaybackState = {
      positionMs: snap.positionMs,
      durationMs: snap.durationMs || Math.max(0, Math.round(Number(item.durationSec) || 0) * 1000),
      paused: snap.paused,
      currentTrackId: item.trackId,
      trackName: item.title,
      artist: item.artist,
      albumImage: null
    };
    spotifyPausedByUser = snap.paused;
    if (!snap.paused) {
      spotifyPlaybackPendingUserResume = true;
    }
  }
  spotifyReloadNeedsUserResume = matched;
};

const maybeBootstrapSoundCloudAfterQueueLoad = () => {
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider !== "soundcloud") return;
  const snap = readSoundCloudReloadSnapForItem(item);
  if (!snap) return;
  soundcloudPlaybackState = {
    positionMs: snap.positionMs,
    durationMs: snap.durationMs || Math.max(0, Number(item.durationSec || 0) * 1000),
    paused: snap.paused,
    coverUrl: item.imageUrl || undefined
  };
  if (playerHost?.querySelector?.(".soundcloud-sdk-panel")) {
    patchSoundCloudPanelDom(item);
  }
};

/** Same-track restart / loop: position jumped back near start after we were in the last seconds. */
const considerSpotifyTrackRestartFromState = (idx, item, state) => {
  if (advanceTrackInFlight || spotifySeekDragging || manualQueueSelectInFlight) return;
  const sdkId = state.track_window?.current_track?.id;
  if (!sdkId || sdkId !== item.trackId) return;
  const pos = Number(state.position) || 0;
  const durEff = spotifyAdvance().effectiveDurationMs(state.duration, item.durationSec);
  if (durEff <= 0) return;
  const prevPeak = spotifyPeakPositionMs;
  const { shouldAdvance } = spotifyAdvance().detectSpotifyTrackRestart({
    prevPeakMs: prevPeak,
    posMs: pos,
    durEffMs: durEff,
    paused: Boolean(state.paused)
  });
  if (!shouldAdvance) return;
  const latchKey = `${idx}:${item.trackId}`;
  if (spotifyNaturalEndLatchKey === latchKey) return;
  spotifyNaturalEndLatchKey = latchKey;
  void advanceTrack("spotify-track-restart-detected").finally(() => {
    spotifyNaturalEndLatchKey = null;
  });
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const formatClock = (ms) => {
  const totalSec = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
};

const wireSeekHoverPreview = ({ wrap, getDurationMs, getPositionMs }) => {
  if (!wrap || typeof getDurationMs !== "function") return;
  const tooltip = wrap.querySelector(".seek-hover-tooltip");
  const hoverFill = wrap.querySelector(".seek-hover-fill");
  if (!tooltip) return;

  const resolvePositionMs =
    typeof getPositionMs === "function" ? getPositionMs : () => 0;

  const hide = () => {
    tooltip.hidden = true;
    if (hoverFill) hoverFill.hidden = true;
  };

  const update = (clientX) => {
    const rect = wrap.getBoundingClientRect();
    if (rect.width <= 0) {
      hide();
      return;
    }
    const durationMs = Number(getDurationMs()) || 0;
    if (durationMs <= 0) {
      hide();
      return;
    }
    const hoverRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const ms = Math.round(hoverRatio * durationMs);
    tooltip.textContent = formatClock(ms);
    tooltip.style.left = `${hoverRatio * 100}%`;
    tooltip.hidden = false;

    if (hoverFill) {
      const playedRatio = Math.max(
        0,
        Math.min(1, Number(resolvePositionMs()) / durationMs)
      );
      if (hoverRatio > playedRatio) {
        hoverFill.style.left = `${playedRatio * 100}%`;
        hoverFill.style.width = `${(hoverRatio - playedRatio) * 100}%`;
        hoverFill.hidden = false;
      } else {
        hoverFill.hidden = true;
      }
    }
  };

  wrap.addEventListener("pointermove", (event) => update(event.clientX));
  wrap.addEventListener("pointerleave", hide);
};

const formatDurationSec = (sec) => formatClock(Number(sec || 0) * 1000);

const renderTrackListHeader = (ul) => {
  const li = document.createElement("li");
  li.className = "track-list-header";
  li.setAttribute("aria-hidden", "true");
  const idx = document.createElement("span");
  idx.className = "track-list-header-index";
  idx.textContent = "#";
  const title = document.createElement("span");
  title.className = "track-list-header-title";
  title.textContent = "Title";
  const dur = document.createElement("span");
  dur.className = "track-list-header-duration";
  dur.setAttribute("aria-label", "Duration");
  dur.textContent = "\u23F1";
  li.appendChild(idx);
  li.appendChild(title);
  li.appendChild(dur);
  ul.appendChild(li);
};

const createQueueRowArt = (item) => {
  if (item?.imageUrl) {
    const img = document.createElement("img");
    img.className = "track-list-art queue-row-art";
    img.src = item.imageUrl;
    img.alt = "";
    img.decoding = "async";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.onerror = () => {
      img.replaceWith(
        (() => {
          const fallback = document.createElement("div");
          fallback.className = "track-list-art track-list-art-fallback queue-row-art";
          fallback.setAttribute("aria-hidden", "true");
          return fallback;
        })()
      );
    };
    return img;
  }
  const fallback = document.createElement("div");
  fallback.className = "track-list-art track-list-art-fallback queue-row-art";
  fallback.setAttribute("aria-hidden", "true");
  return fallback;
};

const createTrackListRow = ({ track, index, showIndex }) => {
  const row = document.createElement("div");
  row.className = "track-list-row";

  if (showIndex) {
    const idxEl = document.createElement("span");
    idxEl.className = "track-list-index";
    idxEl.textContent = String(index + 1);
    row.appendChild(idxEl);
  }

  const main = document.createElement("div");
  main.className = "track-list-main";

  if (track.imageUrl) {
    const img = document.createElement("img");
    img.className = "track-list-art";
    img.src = track.imageUrl;
    img.alt = "";
    img.decoding = "async";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.onerror = () => {
      img.replaceWith(
        (() => {
          const fallback = document.createElement("div");
          fallback.className = "track-list-art track-list-art-fallback";
          fallback.setAttribute("aria-hidden", "true");
          return fallback;
        })()
      );
    };
    main.appendChild(img);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "track-list-art track-list-art-fallback";
    fallback.setAttribute("aria-hidden", "true");
    main.appendChild(fallback);
  }

  const meta = document.createElement("div");
  meta.className = "track-list-meta";
  const titleEl = document.createElement("div");
  titleEl.className = "track-list-title";
  titleEl.textContent = track.title || "Untitled";
  const artistEl = document.createElement("div");
  artistEl.className = "track-list-artist";
  artistEl.textContent = track.artist || "";
  meta.appendChild(titleEl);
  meta.appendChild(artistEl);
  main.appendChild(meta);
  row.appendChild(main);

  const dur = document.createElement("span");
  dur.className = "track-list-duration";
  dur.setAttribute("data-testid", "track-duration");
  dur.textContent = formatDurationSec(track.durationSec);
  row.appendChild(dur);

  return row;
};

const fetchSpotifyAccessToken = async () => {
  const response = await apiFetch("/api/spotify/token");
  let rawSnippet = "";
  try {
    rawSnippet = await response.clone().text();
  } catch (_) {}
  recordPlaybackDiagToken(response.status, response.ok, rawSnippet);
  if (!response.ok) {
    let err = {};
    try {
      err = JSON.parse(rawSnippet);
    } catch {
      err = { error: rawSnippet.slice(0, 200) || "spotify token unavailable" };
    }
    const detail = err.details ? ` ${String(err.details).slice(0, 200)}` : "";
    const hint = err.hint ? ` (${err.hint})` : "";
    spotifyCredentialBanner = `${err.error || "spotify token unavailable"}${hint}${detail}`.trim();
    if (response.status === 429 || isRateLimitCode(err.code)) {
      noteRateLimit("spotify", err);
    } else {
      noteAuthFailure("spotify", err);
    }
    renderSpotifySdkBanner();
    pushPlaybackSdkEvent("token_http", `${response.status} ${spotifyCredentialBanner}`);
    throw new Error(err.error || "spotify token unavailable");
  }
  spotifyCredentialBanner = "";
  renderSpotifySdkBanner();
  const payload = await response.json();
  return payload.accessToken;
};

const waitForSpotifyDevice = (timeoutMs = 20000) =>
  new Promise((resolve) => {
    if (spotifySdkReady && spotifyDeviceId) {
      resolve(true);
      return;
    }
    const deadline = Date.now() + timeoutMs;
    const id = setInterval(() => {
      if (spotifySdkReady && spotifyDeviceId) {
        clearInterval(id);
        resolve(true);
      } else if (Date.now() >= deadline) {
        clearInterval(id);
        resolve(false);
      }
    }, 150);
  });

/** Must run synchronously inside a click/key handler (before any await) or the browser keeps this tab silent. */
const touchSpotifyUserActivation = () => {
  if (!spotifyPlayer || typeof spotifyPlayer.activateElement !== "function") return;
  try {
    const p = spotifyPlayer.activateElement();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch (_) {}
};

const ensureSpotifyActivationGesture = async () => {
  touchSpotifyUserActivation();
  if (spotifyPlayer && typeof spotifyPlayer.activateElement === "function") {
    try {
      await spotifyPlayer.activateElement();
    } catch (_) {}
  }
};

const applySpotifyPlaybackState = (state) => {
  if (!state) return;
  const idxGuard = queueState.currentIndex;
  const curGuard =
    idxGuard >= 0 && idxGuard < queueState.queue.length ? queueState.queue[idxGuard] : null;
  if (curGuard?.provider === "spotify" && spotifyReloadNeedsUserResume) {
    const snap = spotifyReloadSnap().readSpotifyReloadSnapshot(sessionStorage);
    if (snap?.trackId === curGuard.trackId) {
      const sdkId = state.track_window?.current_track?.id;
      const sdkPos = Number(state.position) || 0;
      if (!sdkId || sdkId === curGuard.trackId) {
        if (sdkPos < snap.positionMs - 1500) {
          state = {
            ...state,
            position: snap.positionMs,
            paused: snap.paused ? true : state.paused
          };
        }
      }
    }
  }
  lastSpotifyPlayerStateSnapshot = state;
  if (!state.paused) {
    spotifyPausedByUser = false;
  }
  spotifyPlaybackState = {
    positionMs: state.position,
    durationMs: state.duration,
    paused: state.paused,
    currentTrackId: state.track_window?.current_track?.id || null,
    trackName: state.track_window?.current_track?.name || null,
    artist:
      (state.track_window?.current_track?.artists || [])
        .map((a) => a.name)
        .join(", ") || null,
    albumImage: state.track_window?.current_track?.album?.images?.[0]?.url || null
  };

  const idx = queueState.currentIndex;
  const cur = idx >= 0 && idx < queueState.queue.length ? queueState.queue[idx] : null;
  if (cur?.provider === "spotify") {
    touchSpotifyPeakTracking(idx, cur);
    const sdkId = state.track_window?.current_track?.id;
    if (sdkId === cur.trackId) {
      considerSpotifyTrackRestartFromState(idx, cur, state);
      const pos = Number(state.position) || 0;
      spotifyPeakPositionMs = Math.max(spotifyPeakPositionMs, pos);
    }
  }

  if (!spotifySeekDragging) {
    const idxR = queueState.currentIndex;
    const curR = idxR >= 0 && idxR < queueState.queue.length ? queueState.queue[idxR] : null;
    if (curR?.provider === "spotify") {
      if (!patchSpotifyNowPlayingPanel(curR)) {
        renderNowPlaying();
      } else {
        renderNowPlayingHero(curR);
      }
    }
  }

  considerSpotifyNaturalTrackEnd(state);

  const idx2 = queueState.currentIndex;
  if (!spotifySeekDragging && idx2 >= 0 && idx2 < queueState.queue.length) {
    const qItem = queueState.queue[idx2];
    if (qItem.provider === "spotify") {
      flushSpotifyReloadSnapshot();
      if (spotifyPausedByUser) {
        clearActiveTimer();
      } else {
        scheduleAutoAdvance();
      }
    }
  }
};

const syncSpotifyPlaybackFromDevice = async () => {
  if (!spotifyPlayer || typeof spotifyPlayer.getCurrentState !== "function") return;
  try {
    const state = await spotifyPlayer.getCurrentState();
    if (state) applySpotifyPlaybackState(state);
  } catch (_) {}
};

const initSpotifySdk = () => {
  if (spotifySdkInitStarted) return;
  spotifySdkInitStarted = true;

  const bootPlayer = () => {
    if (!window.Spotify) return;
    spotifyPlayer = new window.Spotify.Player({
      name: "Unified Queue Player",
      getOAuthToken: async (cb) => {
        try {
          const token = await fetchSpotifyAccessToken();
          cb(token);
        } catch (e) {
          pushPlaybackSdkEvent("getOAuthToken", e?.message || String(e));
          cb("");
        }
      }
    });

    spotifyPlayer.addListener("ready", ({ device_id: deviceId }) => {
      spotifyDeviceId = deviceId;
      spotifySdkReady = true;
      pushPlaybackSdkEvent("ready", `device_id=${deviceId}`);
      globalThis.unifyVolume?.applyVolumeToPlayers?.();
      renderNowPlaying();
      if (spotifyPlaybackPendingUserResume) {
        void tryRestoreSpotifyAfterDeviceReady();
      }
    });

    spotifyPlayer.addListener("not_ready", ({ device_id: deviceId }) => {
      if (spotifyDeviceId === deviceId) {
        spotifyDeviceId = null;
      }
      spotifySdkReady = false;
      pushPlaybackSdkEvent("not_ready", String(deviceId || ""));
    });

    spotifyPlayer.addListener("authentication_error", ({ message } = {}) => {
      spotifySdkReady = false;
      const m = message || "";
      console.error("Spotify authentication_error", m);
      pushPlaybackSdkEvent("authentication_error", m);
      spotifyCredentialBanner = `Spotify SDK authentication failed.${m ? ` ${m}` : ""} Check token / reconnect.`;
      renderSpotifySdkBanner();
    });
    spotifyPlayer.addListener("account_error", ({ message } = {}) => {
      spotifySdkReady = false;
      const m = message || "";
      console.error("Spotify account_error", m);
      pushPlaybackSdkEvent("account_error", m);
      spotifyCredentialBanner = `Spotify account not eligible for Web Playback (Premium required).${m ? ` ${m}` : ""}`;
      renderSpotifySdkBanner();
    });
    spotifyPlayer.addListener("playback_error", ({ message } = {}) => {
      spotifySdkReady = false;
      const m = message || "";
      console.error("Spotify playback_error", m);
      pushPlaybackSdkEvent("playback_error", m);
    });

    spotifyPlayer.addListener("initialization_error", ({ message } = {}) => {
      const m = message || "";
      console.error("Spotify initialization_error", m);
      pushPlaybackSdkEvent("initialization_error", m);
      spotifyCredentialBanner = `Spotify player failed to initialize.${m ? ` ${m}` : ""}`;
      renderSpotifySdkBanner();
    });

    spotifyPlayer.addListener("autoplay_failed", () => {
      console.warn("Spotify Web Playback: autoplay_failed — use the play button in this page again.");
      pushPlaybackSdkEvent("autoplay_failed", "browser blocked autoplay");
      alert(
        "This browser blocked audio until you interact with this page. Click Play on the queue or the play button below once more — sound plays in this tab, not in open.spotify.com."
      );
    });

    spotifyPlayer.addListener("player_state_changed", (state) => {
      void handleSpotifyPlayerStateChanged(state);
    });

    spotifyPlayer.connect();
  };

  if (window.Spotify) {
    bootPlayer();
  } else {
    window.onSpotifyWebPlaybackSDKReady = bootPlayer;
  }
};

const tryRestoreSpotifyAfterDeviceReady = async () => {
  if (!spotifyPlaybackPendingUserResume && !spotifyReloadNeedsUserResume) return;
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider !== "spotify" || !item.trackId) return;

  const snap = spotifyReloadSnap().readSpotifyReloadSnapshot(sessionStorage);
  const wantAutoContinue =
    spotifyPlaybackPendingUserResume ||
    (spotifyReloadNeedsUserResume && snap?.trackId === item.trackId && !snap.paused);
  if (!wantAutoContinue) return;

  const positionMs = spotifyReloadSnap().resolveResumePositionMs(
    { trackId: item.trackId, index: idx, durationSec: item.durationSec },
    snap?.trackId === item.trackId ? snap : null,
    spotifyPlaybackState?.positionMs
  );

  await ensureSpotifyNowPlaying({
    trackId: item.trackId,
    positionMs,
    scheduleAdvance: true,
    userInitiated: false
  });
};

const withSpotifyRestoreLock = (fn) => {
  const run = spotifyRestoreChain.then(() => fn());
  spotifyRestoreChain = run.catch(() => {});
  return run;
};

const spotifyPlaybackDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getSpotifySdkState = async () => {
  if (!spotifyPlayer || typeof spotifyPlayer.getCurrentState !== "function") return null;
  try {
    return await spotifyPlayer.getCurrentState();
  } catch (e) {
    pushPlaybackSdkEvent("getCurrentState_failed", e?.message || String(e));
    return null;
  }
};

const spotifyPlayerResume = async () => {
  if (!spotifyPlayer || typeof spotifyPlayer.resume !== "function") return false;
  try {
    await spotifyPlayer.resume();
    return true;
  } catch (e) {
    pushPlaybackSdkEvent("resume_failed", e?.message || String(e));
    return false;
  }
};

const spotifyWebApiResume = async () => {
  if (!spotifyDeviceId) return false;
  try {
    const response = await apiFetch("/api/spotify/player/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: spotifyDeviceId })
    });
    if (!response.ok) {
      pushPlaybackSdkEvent("web_resume_failed", String(response.status));
      return false;
    }
    return true;
  } catch (e) {
    pushPlaybackSdkEvent("web_resume_failed", e?.message || String(e));
    return false;
  }
};

const confirmSpotifyPlaying = async ({ trackId, positionMs = 0, timeoutMs } = {}) => {
  const confirm = spotifyConfirmPlaying();
  const pollMs = confirm.DEFAULT_CONFIRM_POLL_MS;
  const deadline = confirm.computeConfirmPollDeadline(
    timeoutMs ?? confirm.DEFAULT_CONFIRM_TIMEOUT_MS
  );

  while (Date.now() < deadline) {
    const state = await getSpotifySdkState();
    if (confirm.isSpotifyStatePlayingTrack(state, trackId)) {
      return true;
    }
    await spotifyPlaybackDelay(pollMs);
  }

  await spotifyPlayerResume();
  await spotifyPlaybackDelay(300);
  let state = await getSpotifySdkState();
  if (confirm.isSpotifyStatePlayingTrack(state, trackId)) return true;

  await spotifyWebApiResume();
  await spotifyPlaybackDelay(300);
  state = await getSpotifySdkState();
  if (confirm.isSpotifyStatePlayingTrack(state, trackId)) return true;

  const response = await apiFetch("/api/spotify/player/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceId: spotifyDeviceId,
      trackId,
      positionMs: Math.max(0, Math.round(Number(positionMs) || 0))
    })
  });
  if (!response.ok) {
    pushPlaybackSdkEvent("confirm_replay_failed", String(response.status));
    return false;
  }
  await spotifyPlayerResume();
  await spotifyPlaybackDelay(300);
  state = await getSpotifySdkState();
  return confirm.isSpotifyStatePlayingTrack(state, trackId);
};

const ensureSpotifyNowPlaying = async ({
  trackId,
  positionMs,
  scheduleAdvance = true,
  userInitiated = false
} = {}) => {
  const idx = queueState.currentIndex;
  const item = idx >= 0 && idx < queueState.queue.length ? queueState.queue[idx] : null;
  const resolvedTrackId = trackId || item?.trackId;
  if (!resolvedTrackId || item?.provider !== "spotify") return false;

  if (!spotifySdkInitStarted) {
    initSpotifySdk();
  }

  return withSpotifyRestoreLock(async () => {
    if (userInitiated) {
      spotifyPlaybackPendingUserResume = true;
      await ensureSpotifyActivationGesture();
    }

    const ready = await waitForSpotifyDevice(20000);
    if (!ready) {
      spotifyPlaybackPendingUserResume = true;
      setSpotifyReconnectBanner(
        "Spotify Web Player is still connecting. Press Play again in a few seconds, or check the browser console if this persists."
      );
      return false;
    }

    setSpotifyReconnectBanner("");
    const snap = spotifyReloadSnap().readSpotifyReloadSnapshot(sessionStorage);
    const startMs = spotifyReloadSnap().resolveSpotifyResumePositionMs(
      { trackId: resolvedTrackId, index: idx, durationSec: item.durationSec },
      snap,
      positionMs
    );
    const response = await apiFetch("/api/spotify/player/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: spotifyDeviceId,
        trackId: resolvedTrackId,
        positionMs: startMs
      })
    });
    let rawPlay = "";
    try {
      rawPlay = await response.clone().text();
    } catch (_) {}
    recordPlaybackDiagPlay(response.status, response.ok, rawPlay);
    if (!response.ok) {
      const err = await safeJson(response);
      const extra = err.details ? `\n\n${String(err.details).slice(0, 600)}` : "";
      const playMsg = `${err.error || "Unable to start Spotify playback"}${extra}`;
      if (!noteAuthFailure("spotify", err)) {
        setSpotifyReconnectBanner(playMsg);
      }
      pushPlaybackSdkEvent("play_http_error", `${response.status} ${err.error || ""}`);
      return false;
    }
    spotifyPausedByUser = false;
    spotifyPlaybackPendingUserResume = false;
    spotifyReloadNeedsUserResume = false;
    await spotifyPlayerResume();
    await syncSpotifyPlaybackFromDevice();

    if (!userInitiated) {
      const confirmed = await confirmSpotifyPlaying({
        trackId: resolvedTrackId,
        positionMs: startMs
      });
      if (!confirmed) {
        spotifyPlaybackPendingUserResume = true;
        setSpotifyReconnectBanner(
          "Next track loaded but didn't start. Press Play to resume."
        );
        pushPlaybackSdkEvent("confirm_playing_failed", resolvedTrackId);
        return false;
      }
    }

    recordSpotifyWallAnchor(idx, resolvedTrackId);
    flushSpotifyReloadSnapshot();
    if (scheduleAdvance) scheduleAutoAdvance();
    return true;
  });
};

const playSpotifyTrack = async (trackId, options = {}) => {
  if (!trackId) return false;
  return ensureSpotifyNowPlaying({
    trackId,
    positionMs: options.positionMs,
    scheduleAdvance: options.scheduleAdvance !== false,
    userInitiated: Boolean(options.userInitiated)
  });
};

const pauseSpotifyPlayback = async () => {
  if (!spotifySdkReady || !spotifyDeviceId) return;
  await apiFetch("/api/spotify/player/pause", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId: spotifyDeviceId })
  });
};

const spotifyPause = async () => {
  if (!spotifyPlayer || spotifyControlBusy) return;
  spotifyControlBusy = true;
  try {
    clearActiveTimer();
    clearSpotifyWallAnchor();
    await spotifyPlayer.pause();
    spotifyPausedByUser = true;
  } finally {
    spotifyControlBusy = false;
  }
};

const spotifyResume = async () => {
  if (spotifyControlBusy) return;
  spotifyControlBusy = true;
  try {
    spotifyPlaybackPendingUserResume = true;
    await ensureSpotifyActivationGesture();
    const idx = queueState.currentIndex;
    const item = idx >= 0 && idx < queueState.queue.length ? queueState.queue[idx] : null;
    if (!item || item.provider !== "spotify" || !item.trackId) return;

    const ready = await waitForSpotifyDevice(20000);
    if (!ready) {
      setSpotifyReconnectBanner(
        "Spotify Web Player is still connecting. Press Play again in a few seconds."
      );
      return;
    }

    let sdkState = null;
    if (spotifyPlayer && typeof spotifyPlayer.getCurrentState === "function") {
      try {
        sdkState = await spotifyPlayer.getCurrentState();
      } catch (_) {}
    }
    const sdkTrackId = sdkState?.track_window?.current_track?.id;
    const needsFullPlay =
      !sdkState || sdkTrackId !== item.trackId || spotifyReloadNeedsUserResume;

    if (needsFullPlay) {
      const snap = spotifyReloadSnap().readSpotifyReloadSnapshot(sessionStorage);
      const positionMs = spotifyReloadSnap().resolveSpotifyResumePositionMs(
        { trackId: item.trackId, index: idx, durationSec: item.durationSec },
        snap,
        spotifyPlaybackState?.positionMs
      );
      const ok = await ensureSpotifyNowPlaying({
        trackId: item.trackId,
        positionMs,
        scheduleAdvance: true,
        userInitiated: true
      });
      if (!ok) return;
      return;
    }

    setSpotifyReconnectBanner("");
    await spotifyPlayerResume();
    spotifyPausedByUser = false;
    spotifyReloadNeedsUserResume = false;
    spotifyPlaybackPendingUserResume = false;
    const pos = Number(spotifyPlaybackState?.positionMs) || 0;
    spotifyWallStartMs = Date.now() - pos;
    spotifyWallAnchorKey = `${idx}:${item.trackId}`;
    scheduleAutoAdvance();
  } finally {
    spotifyControlBusy = false;
  }
};

const spotifySeek = async (nextPositionMs) => {
  if (!spotifyPlayer || spotifyControlBusy) return;
  spotifyControlBusy = true;
  try {
    await spotifyPlayer.seek(nextPositionMs);
    spotifyPeakPositionMs = Math.max(0, Number(nextPositionMs) || 0);
    spotifyPlaybackState = {
      ...spotifyPlaybackState,
      positionMs: nextPositionMs
    };
    const idx = queueState.currentIndex;
    const item = idx >= 0 && idx < queueState.queue.length ? queueState.queue[idx] : null;
    if (item?.provider === "spotify" && item.trackId) {
      spotifyWallStartMs = Date.now() - nextPositionMs;
      spotifyWallAnchorKey = `${idx}:${item.trackId}`;
    }
    renderNowPlaying();
  } finally {
    spotifyControlBusy = false;
  }
};

const setNowPlayingIndex = async (index, reason = "manual-select") => {
  const res = await apiFetch("/api/queue/now-playing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index, reason })
  });
  if (res.ok) {
    queueState = await res.json();
  }
  return res;
};

const isSpotifyApiRateLimited = () => {
  const sp = providers.find((p) => p.provider === "spotify");
  return sp?.health === "rate_limited" || isRateLimitCode(sp?.healthCode);
};

const fetchProviders = async () => {
  const res = await apiFetch("/api/providers");
  providers = await res.json();
  syncProviderAuthFromHealth();
  renderAuthNotice();
  renderProviders();
  if (
    tabSpotifySearch?.classList.contains("is-selected") &&
    Date.now() >= deferSpotifyLibraryLoadUntil &&
    !isSpotifyApiRateLimited()
  ) {
    void bootstrapSpotifyPlaylistBrowser();
  }
  if (tabSoundcloudSearch?.classList.contains("is-selected")) {
    void bootstrapSoundCloudPlaylistBrowser();
  }
  if (tabAppleMusicSearch?.classList.contains("is-selected")) {
    globalThis.unifyAppleMusicBrowse?.bootstrap?.();
  }
};

const fetchQueueState = async () => {
  const res = await apiFetch("/api/queue");
  queueState = await res.json();
  maybeBootstrapSpotifyAfterQueueLoad();
  maybeBootstrapSoundCloudAfterQueueLoad();
  renderNowPlaying();
  renderQueue();
};

const removeQueueItemById = async (itemId, { wasNowPlaying = false } = {}) => {
  if (reorderInFlight) return;
  clearActiveTimer();
  clearSpotifyWallAnchor();
  if (wasNowPlaying) {
    await pauseSpotifyPlayback();
    teardownSoundCloudWidget();
    if (spotifyPlayer && typeof spotifyPlayer.pause === "function") {
      try {
        await spotifyPlayer.pause();
      } catch (_) {}
    }
  }
  const res = await apiFetch(`/api/queue/${itemId}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.error || "Unable to remove track");
    return;
  }
  await fetchQueueState();
  if (!wasNowPlaying) return;
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider === "spotify") {
    clearSpotifyReloadSnapshotForQueueChange();
    await playSpotifyTrack(item.trackId, { userInitiated: true });
  }
  scheduleAutoAdvance();
};

const renderNowPlayingActions = (item) => {
  if (!nowPlayingActions) return;
  nowPlayingActions.innerHTML = "";
  if (!item) {
    nowPlayingActions.hidden = true;
    return;
  }
  nowPlayingActions.hidden = false;
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.className = "queue-remove-btn now-playing-remove-btn";
  removeButton.setAttribute("data-testid", "now-playing-remove");
  removeButton.disabled = reorderInFlight;
  removeButton.setAttribute(
    "aria-label",
    `Remove ${item.title} from queue and play next`
  );
  removeButton.onclick = () => removeQueueItemById(item.id, { wasNowPlaying: true });
  nowPlayingActions.appendChild(removeButton);
};

const reorderItem = async (fromIndex, toIndex) => {
  if (reorderInFlight) return;
  reorderInFlight = true;
  renderQueue();
  try {
    const response = await apiFetch("/api/queue/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex, toIndex })
    });
    if (!response.ok) {
      const err = await response.json();
      alert(err.error || "Unable to reorder queue");
      return;
    }
    await fetchQueueState();
    if (queueState.currentIndex >= 0) {
      scheduleAutoAdvance();
    }
  } finally {
    reorderInFlight = false;
    renderQueue();
  }
};

/** Smallest queue index an up-next row may move to while something is playing. */
const minQueueReorderIndex = (nowPlayingIndex) =>
  nowPlayingIndex < 0 ? 0 : nowPlayingIndex + 1;

const clearQueueDragHighlight = () => {
  queueList?.querySelectorAll(".queue-row--drag-over").forEach((el) => {
    el.classList.remove("queue-row--drag-over");
  });
};

const createQueueDragHandle = (idx, rowEl, nowPlayingIndex) => {
  const handle = document.createElement("span");
  handle.className = "queue-drag-handle";
  handle.setAttribute("role", "button");
  handle.setAttribute("tabindex", "0");
  handle.setAttribute("aria-label", "Drag to reorder");
  handle.setAttribute("data-testid", `queue-drag-handle-${idx}`);
  handle.draggable = !reorderInFlight;
  handle.textContent = "⋮⋮";

  handle.addEventListener("dragstart", (e) => {
    if (reorderInFlight) {
      e.preventDefault();
      return;
    }
    queueDragFromIndex = idx;
    rowEl.classList.add("queue-row--dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(rowEl, 24, 20);
    }
  });

  handle.addEventListener("dragend", () => {
    queueDragFromIndex = null;
    rowEl.classList.remove("queue-row--dragging");
    clearQueueDragHighlight();
  });

  return handle;
};

const bindQueueRowDragDrop = (rowEl, idx, nowPlayingIndex) => {
  const minIdx = minQueueReorderIndex(nowPlayingIndex);
  rowEl.dataset.queueIndex = String(idx);
  rowEl.setAttribute("data-testid", `queue-row-${idx}`);
  if (reorderInFlight) {
    rowEl.classList.add("queue-row--reorder-busy");
  }

  rowEl.addEventListener("dragover", (e) => {
    if (reorderInFlight || queueDragFromIndex === null) return;
    if (idx < minIdx || queueDragFromIndex < minIdx) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    clearQueueDragHighlight();
    rowEl.classList.add("queue-row--drag-over");
  });

  rowEl.addEventListener("dragleave", () => {
    rowEl.classList.remove("queue-row--drag-over");
  });

  rowEl.addEventListener("drop", (e) => {
    e.preventDefault();
    rowEl.classList.remove("queue-row--drag-over");
    const from =
      queueDragFromIndex ?? parseInt(e.dataTransfer.getData("text/plain"), 10);
    let to = idx;
    if (Number.isNaN(from) || from === to) return;
    if (from < minIdx) return;
    if (to < minIdx) to = minIdx;
    if (from === to) return;
    void reorderItem(from, to);
  });
};

const soundCloudEmbedPermalink = (item) => item?.permalinkUrl || "https://soundcloud.com/forss/flickermood";

const SPOTIFY_ICON_VIEW = "0 0 24 24";

const spotifySvgRestart = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SPOTIFY_ICON_VIEW}" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M6 6v12H4V6h2zM18 6l-8.5 6L18 18V6h-2z"/></svg>`;

const spotifySvgSkipPrevious = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SPOTIFY_ICON_VIEW}" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M6 6v12h2V6H6zm3.5 6L18 6v12L9.5 12z"/></svg>`;

const spotifySvgPlay = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SPOTIFY_ICON_VIEW}" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7L8 5z"/></svg>`;

const spotifySvgPause = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SPOTIFY_ICON_VIEW}" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/></svg>`;

const spotifySvgSkipNext = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SPOTIFY_ICON_VIEW}" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M16 6v12h2V6h-2zM6 6l8.5 6L6 18V6h2z"/></svg>`;

const escapeHtmlAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");

const escapeHtmlText = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildNowPlayingLayout = ({
  providerClass,
  title,
  artist,
  progressNow,
  progressTotal,
  progressPercent,
  progressClass,
  progressWrapClass,
  progressTrackClass,
  progressFillClass,
  rangeClass,
  elapsedClass,
  totalClass,
  controlsHtml
}) => `
  <div class="${providerClass}">
    <div class="now-playing-layout">
      <div class="now-playing-layout__left">
        <div class="now-playing-layout__vinyl">
          <div class="vinyl-hero" aria-hidden="true">
            <div class="vinyl-hero__sleeve">
              <img class="vinyl-hero__cover" alt="" hidden />
              <div class="vinyl-hero__cover-fallback" aria-hidden="true"></div>
            </div>
            <div class="vinyl-hero__disc" aria-hidden="true">
              <div class="vinyl-hero__disc-inner"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="now-playing-layout__right">
        <div class="now-playing-layout__meta">
          <div class="now-playing-meta-ticker" data-testid="now-playing-meta-ticker">
            <span class="now-playing-meta-ticker__viewport">
              <span class="now-playing-meta-ticker__track">
                <span class="now-playing-meta-ticker__text"></span>
                <span
                  class="now-playing-meta-ticker__text now-playing-meta-ticker__text--dup"
                  aria-hidden="true"
                ></span>
              </span>
            </span>
          </div>
          <strong class="now-playing-layout__title">${escapeHtmlText(title)}</strong>
          <span class="now-playing-layout__artist">${escapeHtmlText(artist)}</span>
        </div>
        <div class="now-playing-layout__progress">
          <div class="${progressClass}">
            <span class="${elapsedClass}">${formatClock(progressNow)}</span>
            <div class="${progressWrapClass}">
              <span class="seek-hover-tooltip" hidden aria-hidden="true">0:00</span>
              <div class="${progressTrackClass}">
                <div class="${progressFillClass}" style="width: ${progressPercent}%;"></div>
                <div class="seek-hover-fill" hidden aria-hidden="true"></div>
              </div>
              <input
                type="range"
                class="${rangeClass}"
                min="0"
                max="${Math.max(1, progressTotal)}"
                value="${Math.min(progressNow, Math.max(1, progressTotal))}"
                step="250"
                aria-label="Seek"
                data-testid="${providerClass.includes("spotify") ? "spotify-seek" : "soundcloud-seek"}"
              />
            </div>
            <span class="${totalClass}">${formatClock(progressTotal)}</span>
          </div>
        </div>
        <div class="now-playing-layout__controls">
          ${controlsHtml}
        </div>
      </div>
    </div>
  </div>
`;

const trackEmbed = (item) => {
  if (item.provider === "spotify") {
    const progressNow = spotifyPlaybackState?.positionMs || 0;
    const progressTotal = spotifyPlaybackState?.durationMs || Number(item.durationSec || 0) * 1000;
    const progressPercent = progressTotal > 0 ? Math.min(100, (progressNow / progressTotal) * 100) : 0;
    const title = spotifyPlaybackState?.trackName || item.title;
    const artist = spotifyPlaybackState?.artist || item.artist;
    const sdkConnected = Boolean(spotifySdkReady && spotifyDeviceId);
    const reconnecting = !sdkConnected && isSpotifyProviderConnected();
    const paused =
      spotifyPlaybackState == null || !sdkConnected
        ? true
        : Boolean(spotifyPlaybackState.paused) || spotifyReloadNeedsUserResume;
    const q = queueState.queue;
    const cur = queueState.currentIndex;
    const hasNext = cur >= 0 && cur < q.length - 1;
    const skipDisabled = advanceTrackInFlight || !hasNext;
    return `
      <div class="spotify-sdk-panel">
        ${
          reconnecting
            ? '<p class="spotify-reconnect-hint" data-testid="spotify-reconnect-hint">Reconnecting player… Press Play to resume.</p>'
            : ""
        }
        ${buildNowPlayingLayout({
          providerClass: "spotify-layout-shell",
          title,
          artist,
          progressNow,
          progressTotal,
          progressPercent,
          progressClass: "spotify-progress-row",
          progressWrapClass: "spotify-progress-wrap",
          progressTrackClass: "spotify-progress-track",
          progressFillClass: "spotify-progress-fill",
          rangeClass: "spotify-progress-range",
          elapsedClass: "spotify-time-elapsed",
          totalClass: "spotify-time-total",
          controlsHtml: `<div class="spotify-transport">
            <button type="button" class="spotify-transport-btn spotify-transport-btn--secondary" data-testid="spotify-restart" aria-label="Restart track">${spotifySvgSkipPrevious()}</button>
            <button type="button" class="spotify-transport-btn spotify-transport-btn--primary" data-testid="spotify-play-pause" aria-label="${paused ? "Resume" : "Pause"}">${paused ? spotifySvgPlay() : spotifySvgPause()}</button>
            <button type="button" class="spotify-transport-btn spotify-transport-btn--secondary" data-testid="spotify-skip" aria-label="Skip to next track in queue" ${skipDisabled ? "disabled" : ""}>${spotifySvgSkipNext()}</button>
          </div>`
        })}
      </div>
    `;
  }
  if (item.provider === "applemusic") {
    const progressTotal = Math.max(0, Number(item.durationSec || 0) * 1000);
    const title = item.title || "Apple Music track";
    const artist = item.artist || "";
    const configured = globalThis.unifyAppleMusicBrowse?.isConfigured?.() ?? false;
    const hint = configured
      ? "Apple Music playback will start here after MusicKit sign-in is wired up."
      : globalThis.unifyAppleMusicBrowse?.setupMessage?.() ||
        "Add Apple Music server credentials in .env to enable playback.";
    return `
      <div class="applemusic-sdk-panel">
        <p class="applemusic-playback-hint" data-testid="applemusic-playback-hint">${escapeHtmlText(hint)}</p>
        ${buildNowPlayingLayout({
          providerClass: "applemusic-layout-shell",
          title,
          artist,
          progressNow: 0,
          progressTotal,
          progressPercent: 0,
          progressClass: "applemusic-progress-row",
          progressWrapClass: "applemusic-progress-wrap",
          progressTrackClass: "applemusic-progress-track",
          progressFillClass: "applemusic-progress-fill",
          rangeClass: "applemusic-progress-range",
          elapsedClass: "applemusic-time-elapsed",
          totalClass: "applemusic-time-total",
          controlsHtml: `<div class="applemusic-transport">
            <button type="button" class="applemusic-transport-btn applemusic-transport-btn--primary" data-testid="applemusic-play-pause" disabled aria-label="Play">Play</button>
          </div>`
        })}
      </div>
    `;
  }
  const scUrl = soundCloudEmbedPermalink(item);
  const dataPerm = escapeHtmlAttr(scUrl);
  const progressNow = soundcloudPlaybackState?.positionMs || 0;
  const progressTotal =
    soundcloudPlaybackState?.durationMs || Math.max(0, Number(item.durationSec || 0) * 1000);
  const progressPercent =
    progressTotal > 0 ? Math.min(100, (progressNow / progressTotal) * 100) : 0;
  const title = item.title || "SoundCloud track";
  const artist = item.artist || "";
  const paused = Boolean(soundcloudPlaybackState?.paused);
  const skipDisabled = advanceTrackInFlight || !soundCloudHasNext();
  return `
    <div class="soundcloud-sdk-panel">
      ${buildNowPlayingLayout({
        providerClass: "soundcloud-layout-shell",
        title,
        artist,
        progressNow,
        progressTotal,
        progressPercent,
        progressClass: "soundcloud-progress-row",
        progressWrapClass: "soundcloud-progress-wrap",
        progressTrackClass: "soundcloud-progress-track",
        progressFillClass: "soundcloud-progress-fill",
        rangeClass: "soundcloud-progress-range",
        elapsedClass: "soundcloud-time-elapsed",
        totalClass: "soundcloud-time-total",
        controlsHtml: `<div class="soundcloud-transport">
          <button type="button" class="soundcloud-transport-btn soundcloud-transport-btn--secondary" data-testid="soundcloud-restart" aria-label="Restart track">${spotifySvgSkipPrevious()}</button>
          <button type="button" class="soundcloud-transport-btn soundcloud-transport-btn--primary" data-testid="soundcloud-play-pause" aria-label="${paused ? "Play" : "Pause"}">${paused ? spotifySvgPlay() : spotifySvgPause()}</button>
          <button type="button" class="soundcloud-transport-btn soundcloud-transport-btn--secondary" data-testid="soundcloud-skip" aria-label="Skip to next track in queue" ${skipDisabled ? "disabled" : ""}>${spotifySvgSkipNext()}</button>
        </div>`
      })}
      <div class="sc-widget-host" aria-hidden="true">
        <iframe class="sc-widget" allow="autoplay" tabindex="-1" data-sc-permalink="${dataPerm}" src="${escapeHtmlAttr(soundCloudPlayerIframeSrc(scUrl))}"></iframe>
      </div>
    </div>
  `;
};

const advanceTrack = async (reason) => {
  if (advanceTrackInFlight) return;
  advanceTrackInFlight = true;
  clearActiveTimer();
  try {
    const res = await apiFetch("/api/playback/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (!res.ok) {
      queueState = data;
      await fetchQueueState();
      const hint = queueState.lastError?.message || data.error || "Could not advance queue.";
      if (reason !== "timer-fallback") {
        const provider = queueState.queue[queueState.currentIndex]?.provider;
        if (!noteAuthFailure(provider || "spotify", { error: hint, code: data.code })) {
          spotifyCredentialBanner = hint;
          renderSpotifySdkBanner();
        }
      }
      return;
    }
    queueState = data;
    const idx = queueState.currentIndex;
    if (idx < 0 || idx >= queueState.queue.length) {
      clearSpotifyWallAnchor();
    }
    if (idx >= 0 && idx < queueState.queue.length) {
      const item = queueState.queue[idx];
      if (item.provider !== "spotify") {
        clearSpotifyWallAnchor();
        await pauseSpotifyPlayback();
        if (spotifyPlayer && typeof spotifyPlayer.pause === "function") {
          try {
            await spotifyPlayer.pause();
          } catch (_) {}
        }
      }
    }
    renderNowPlaying();
    renderQueue();
    let playbackStarted = true;
    if (idx >= 0 && idx < queueState.queue.length) {
      const item = queueState.queue[idx];
      clearSpotifyReloadSnapshotForQueueChange();
      if (item.provider === "spotify") {
        playbackStarted = await playSpotifyTrack(item.trackId, { scheduleAdvance: false });
        if (!playbackStarted) {
          spotifyPlaybackPendingUserResume = true;
          pushPlaybackSdkEvent("advance_play_failed", item.trackId || "");
        }
      }
    }
    const advanceItem =
      idx >= 0 && idx < queueState.queue.length ? queueState.queue[idx] : null;
    if (
      spotifyConfirmPlaying().shouldScheduleAutoAdvanceAfterTrackAdvance({
        provider: advanceItem?.provider,
        playbackStarted
      })
    ) {
      scheduleAutoAdvance();
    }
  } finally {
    advanceTrackInFlight = false;
  }
};

const considerSpotifyNaturalTrackEnd = (state) => {
  if (advanceTrackInFlight || spotifySeekDragging || manualQueueSelectInFlight) return;
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider !== "spotify") return;
  const sdkId = state.track_window?.current_track?.id;
  if (!sdkId || sdkId !== item.trackId) return;
  const durEff = spotifyAdvance().effectiveDurationMs(state.duration, item.durationSec);
  if (durEff <= 0) return;
  const pos = Number(state.position) || 0;
  const pausedAtEnd = state.paused && pos >= durEff - 5000;
  const playingTail = !state.paused && pos >= durEff - 6000;
  if (!pausedAtEnd && !playingTail) return;
  const latchKey = `${idx}:${item.trackId}`;
  if (spotifyNaturalEndLatchKey === latchKey) return;
  spotifyNaturalEndLatchKey = latchKey;
  void advanceTrack("spotify-track-ended").finally(() => {
    spotifyNaturalEndLatchKey = null;
  });
};

const considerSpotifyEndAfterNullSnapshot = () => {
  if (advanceTrackInFlight || spotifySeekDragging || manualQueueSelectInFlight) return;
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  if (item.provider !== "spotify") return;
  const snap = lastSpotifyPlayerStateSnapshot;
  if (!snap?.track_window?.current_track?.id) return;
  if (snap.track_window.current_track.id !== item.trackId) return;
  const durEff = spotifyAdvance().effectiveDurationMs(snap.duration, item.durationSec);
  if (durEff <= 0) return;
  const pos = Number(snap.position) || 0;
  const nearEnd = pos >= durEff - 5000;
  const pausedAtEnd = snap.paused && pos >= durEff - 8000;
  if (!nearEnd && !pausedAtEnd) return;
  const latchKey = `${idx}:${item.trackId}`;
  if (spotifyNaturalEndLatchKey === latchKey) return;
  spotifyNaturalEndLatchKey = latchKey;
  void advanceTrack("spotify-track-ended-null-state").finally(() => {
    spotifyNaturalEndLatchKey = null;
  });
};

const handleSpotifyPlayerStateChanged = async (state) => {
  if (state) {
    applySpotifyPlaybackState(state);
    return;
  }
  pushPlaybackSdkEvent("player_state_changed", "null state");
  let resolved = null;
  try {
    if (spotifyPlayer && typeof spotifyPlayer.getCurrentState === "function") {
      resolved = await spotifyPlayer.getCurrentState();
    }
  } catch (_) {}
  if (resolved) {
    applySpotifyPlaybackState(resolved);
    return;
  }
  considerSpotifyEndAfterNullSnapshot();
};

const scheduleAutoAdvance = () => {
  clearActiveTimer();
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];

  let delayMs;
  if (item.provider === "spotify") {
    delayMs = spotifyAdvance().computeSpotifyAutoAdvanceDelayMs({
      durationSec: item.durationSec,
      sdkDurationMs: spotifyPlaybackState?.durationMs,
      positionMs: spotifyPlaybackState?.positionMs,
      currentTrackId: spotifyPlaybackState?.currentTrackId,
      queueTrackId: item.trackId,
      wallStartMs: spotifyWallStartMs,
      wallAnchorKey: spotifyWallAnchorKey,
      queueIndex: idx
    });
  } else {
    delayMs = Number(item.durationSec || 180) * 1000;
  }

  activeTimer = setTimeout(() => {
    advanceTrack("timer-fallback");
  }, delayMs);
};

const removeLeavingQueueItemIfStillPresent = async (leavingItemId, targetItemId) => {
  if (!leavingItemId || leavingItemId === targetItemId) return;
  if (!queueState.queue.some((q) => q.id === leavingItemId)) return;
  const res = await apiFetch(`/api/queue/${leavingItemId}`, { method: "DELETE" });
  if (res.ok) {
    await fetchQueueState();
  }
};

const playIndex = async (index) => {
  manualQueueSelectInFlight = true;
  try {
    await ensureSpotifyActivationGesture();
    clearActiveTimer();
    clearSpotifyWallAnchor();
    clearSpotifyReloadSnapshotForQueueChange();
    spotifyNaturalEndLatchKey = null;
    if (index < 0 || index >= queueState.queue.length) {
      await setNowPlayingIndex(-1, "manual-end");
      await fetchQueueState();
      return;
    }

    const fromIndex = queueState.currentIndex;
    const leavingItemId =
      fromIndex >= 0 && fromIndex < queueState.queue.length
        ? queueState.queue[fromIndex].id
        : null;
    const targetItemId = queueState.queue[index]?.id ?? null;

    const res = await setNowPlayingIndex(index);
    if (!res.ok) {
      await fetchQueueState();
      return;
    }

    await removeLeavingQueueItemIfStillPresent(leavingItemId, targetItemId);

    const item =
      targetItemId != null
        ? queueState.queue.find((q) => q.id === targetItemId) ||
          (queueState.currentIndex >= 0 ? queueState.queue[queueState.currentIndex] : null)
        : queueState.currentIndex >= 0 && queueState.currentIndex < queueState.queue.length
          ? queueState.queue[queueState.currentIndex]
          : null;
    if (item?.provider !== "spotify") {
      await pauseSpotifyPlayback();
      if (spotifyPlayer && typeof spotifyPlayer.pause === "function") {
        try {
          await spotifyPlayer.pause();
        } catch (_) {}
      }
    }
    renderNowPlaying();
    renderQueue();
    if (item?.provider === "spotify") {
      await playSpotifyTrack(item.trackId, { userInitiated: true });
    }
    scheduleAutoAdvance();
  } finally {
    manualQueueSelectInFlight = false;
  }
};

const renderQueue = () => {
  queueList.innerHTML = "";
  const queue = queueState.queue;
  const nowPlayingIndex = queueState.currentIndex;
  const upcoming = upcomingQueueEntries(queue, nowPlayingIndex);

  upcoming.forEach(({ item, idx }, displayIndex) => {
    const li = document.createElement("li");
    const prov =
      item.provider === "spotify" ||
      item.provider === "soundcloud" ||
      item.provider === "applemusic"
        ? item.provider
        : "neutral";
    li.className = `queue-row queue-row--${prov}`;

    const indexEl = document.createElement("span");
    indexEl.className = "queue-row-index";
    indexEl.textContent = String(displayIndex + 1);
    indexEl.setAttribute("aria-hidden", "true");
    indexEl.setAttribute("data-testid", `queue-index-${idx}`);

    const dragHandle = createQueueDragHandle(idx, li, nowPlayingIndex);
    bindQueueRowDragDrop(li, idx, nowPlayingIndex);

    const art = createQueueRowArt(item);

    const meta = document.createElement("div");
    meta.className = "queue-row-meta";
    const titleLine = document.createElement("div");
    titleLine.className = "queue-row-title";
    titleLine.appendChild(document.createTextNode(item.title || "Untitled"));
    const artistLine = document.createElement("div");
    artistLine.className = "queue-row-artist";
    artistLine.appendChild(document.createTextNode(item.artist || ""));
    appendProviderBadge(artistLine, item.provider);
    meta.appendChild(titleLine);
    meta.appendChild(artistLine);

    const actions = document.createElement("div");
    actions.className = "actions queue-row-actions";

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "queue-remove-btn";
    removeButton.setAttribute("data-testid", `queue-remove-${idx}`);
    removeButton.disabled = reorderInFlight;
    removeButton.onclick = () => removeQueueItemById(item.id);

    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.className = "btn--unified";
    playButton.onclick = () => {
      const liveIndex = queueState.queue.findIndex((q) => q.id === item.id);
      if (liveIndex >= 0) void playIndex(liveIndex);
    };

    actions.appendChild(removeButton);
    actions.appendChild(playButton);

    li.appendChild(indexEl);
    li.appendChild(dragHandle);
    li.appendChild(art);
    li.appendChild(meta);
    li.appendChild(actions);
    queueList.appendChild(li);
  });
};

const createHistoryKey = (item) => {
  if (!item) return "";
  const provider = String(item.provider || "");
  const trackId = String(item.trackId || "");
  if (provider && trackId) return `${provider}|${trackId}`;
  const permalinkUrl = String(item.permalinkUrl || "");
  const title = String(item.title || "");
  const artist = String(item.artist || "");
  return [provider, permalinkUrl, title, artist].join("|");
};

const snapshotQueueItemForHistory = (item) => {
  if (!item) return null;
  return {
    provider: item.provider || null,
    trackId: item.trackId || null,
    title: item.title || "Untitled",
    artist: item.artist || "",
    imageUrl: item.imageUrl || "",
    durationSec: Number(item.durationSec || 0),
    ...(item.permalinkUrl ? { permalinkUrl: String(item.permalinkUrl) } : {})
  };
};

const queueTrackPayload = async ({
  provider,
  trackId,
  title,
  artist,
  durationSec,
  permalinkUrl,
  imageUrl
}) => {
  await ensureSpotifyActivationGesture();
  const response = await apiFetch("/api/queue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider,
      trackId,
      track: {
        id: trackId,
        title,
        artist,
        durationSec,
        ...(permalinkUrl ? { permalinkUrl } : {}),
        ...(imageUrl ? { imageUrl } : {})
      }
    })
  });
  if (!response.ok) {
    const err = await response.json();
    if (!noteAuthFailure(provider, err)) {
      alert(err.error || "Unable to queue track");
    }
    return false;
  }
  const created = await response.json();
  await fetchQueueState();
  const autoPlayIndex = globalThis.unifyQueueAutoPlay?.resolveAutoPlayIndexAfterQueue?.(
    queueState.queue,
    queueState.currentIndex,
    created?.id
  );
  if (typeof autoPlayIndex === "number" && autoPlayIndex >= 0) {
    await playIndex(autoPlayIndex);
  }
  return true;
};

const queueHistoryItem = async (item) => {
  const provider = item?.provider;
  const trackId = item?.trackId ? String(item.trackId) : "";
  if (provider !== "spotify" && provider !== "soundcloud") return;
  if (!trackId) {
    alert("Unable to queue this track (missing track id).");
    return;
  }
  await queueTrackPayload({
    provider,
    trackId,
    title: item.title,
    artist: item.artist,
    durationSec: item.durationSec,
    permalinkUrl: item.permalinkUrl,
    imageUrl: item.imageUrl
  });
};

const rememberRecentlyPlayedItem = (item) => {
  const snap = snapshotQueueItemForHistory(item);
  if (!snap) return;
  const key = createHistoryKey(snap);
  const firstKey = recentlyPlayedItems.length > 0 ? createHistoryKey(recentlyPlayedItems[0]) : "";
  if (key && key === firstKey) return;
  recentlyPlayedItems = [snap, ...recentlyPlayedItems.filter((entry) => createHistoryKey(entry) !== key)];
  if (recentlyPlayedItems.length > RECENTLY_PLAYED_LIMIT) {
    recentlyPlayedItems.length = RECENTLY_PLAYED_LIMIT;
  }
};

const renderRecentlyPlayed = (currentItem) => {
  if (!recentPlayedList) return;
  recentPlayedList.innerHTML = "";

  if (recentlyPlayedItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "recent-played__empty";
    empty.textContent = currentItem
      ? "Tracks you finish will show up here."
      : "Start playback to build your listening history.";
    recentPlayedList.appendChild(empty);
    return;
  }

  recentlyPlayedItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "recent-played__item";

    const art = createQueueRowArt(item);
    art.classList.add("recent-played__art");

    const meta = document.createElement("div");
    meta.className = "recent-played__meta";

    const title = document.createElement("p");
    title.className = "recent-played__track";
    title.textContent = item.title || "Untitled";

    const artist = document.createElement("p");
    artist.className = "recent-played__artist";
    artist.appendChild(document.createTextNode(item.artist || ""));
    appendProviderBadge(artist, item.provider);

    meta.appendChild(title);
    meta.appendChild(artist);

    const actions = document.createElement("div");
    actions.className = "recent-played__actions";

    const duration = document.createElement("span");
    duration.className = "recent-played__duration";
    duration.textContent = formatDurationSec(item.durationSec);

    const queueButton = document.createElement("button");
    queueButton.type = "button";
    queueButton.textContent = "Queue";
    queueButton.className = "recent-played__queue-btn btn--unified";
    queueButton.setAttribute("data-testid", `recent-played-queue-${index}`);
    queueButton.setAttribute(
      "aria-label",
      `Queue ${item.title || "track"} again`
    );
    queueButton.disabled = reorderInFlight;
    queueButton.onclick = () => void queueHistoryItem(item);

    actions.appendChild(duration);
    actions.appendChild(queueButton);

    li.appendChild(art);
    li.appendChild(meta);
    li.appendChild(actions);
    recentPlayedList.appendChild(li);
  });
};

const renderNowPlaying = () => {
  const idx = queueState.currentIndex;
  const currentItem =
    idx >= 0 && idx < queueState.queue.length ? queueState.queue[idx] : null;
  const currentKey = currentItem ? createHistoryKey(currentItem) : null;
  if (currentKey !== lastNowPlayingHistoryKey) {
    if (lastNowPlayingSnapshot) {
      rememberRecentlyPlayedItem(lastNowPlayingSnapshot);
    }
    lastNowPlayingHistoryKey = currentKey;
    lastNowPlayingSnapshot = snapshotQueueItemForHistory(currentItem);
  }
  renderRecentlyPlayed(currentItem);

  if (idx < 0 || idx >= queueState.queue.length) {
    renderNowPlayingTabTicker(null);
    renderNowPlayingHero(null);
    teardownSoundCloudWidget();
    setNowPlayingRowProvider(null);
    renderNowPlayingActions(null);
    if (isNowPlayingTheaterOpen()) void closeNowPlayingTheater();
    syncNowPlayingTheaterToggle();
    if (queueState.status === "finished") {
      nowPlayingText.textContent = "Queue ended.";
    } else {
      nowPlayingText.textContent = "Nothing playing.";
    }
    playerHost.innerHTML = "";
    lastNowPlayingEmbedKey = null;
    mountNowPlayingTheaterChrome();
    return;
  }
  const item = queueState.queue[idx];
  const embedKey = getNowPlayingEmbedKey(item);
  renderNowPlayingTabTicker(item);
  setNowPlayingRowProvider(item.provider);
  renderNowPlayingActions(item);
  if (
    item.provider === "spotify" &&
    embedKey === lastNowPlayingEmbedKey &&
    isSpotifyPanelMounted() &&
    patchSpotifyNowPlayingPanel(item)
  ) {
    nowPlayingText.textContent = "";
    nowPlayingText.appendChild(document.createTextNode("Playing "));
    appendProviderBadge(nowPlayingText, item.provider);
    renderNowPlayingHero(item);
    renderNowPlayingMetaTicker(getNowPlayingPanel(), {
      title: spotifyPlaybackState?.trackName || item.title,
      artist: spotifyPlaybackState?.artist || item.artist
    });
    mountNowPlayingTheaterChrome();
    return;
  }
  if (item.provider === "soundcloud") {
    const wantPermalink = soundCloudEmbedPermalink(item);
    const iframe = playerHost?.querySelector?.("iframe.sc-widget");
    const embedded = iframe?.getAttribute?.("data-sc-permalink");
    if (
      iframe &&
      embedded === wantPermalink &&
      playerHost.querySelector(".soundcloud-sdk-panel")
    ) {
      nowPlayingText.textContent = "";
      nowPlayingText.appendChild(document.createTextNode("Playing "));
      appendProviderBadge(nowPlayingText, item.provider);
      patchSoundCloudTransportState(item);
      lastNowPlayingEmbedKey = embedKey;
      renderNowPlayingMetaTicker(getNowPlayingPanel(), {
        title: item.title,
        artist: item.artist
      });
      mountNowPlayingTheaterChrome();
      return;
    }
  }
  teardownSoundCloudWidget();
  if (item.provider === "soundcloud") {
    const scSnap = readSoundCloudReloadSnapForItem(item);
    soundcloudPlaybackState = {
      positionMs: scSnap ? scSnap.positionMs : 0,
      durationMs:
        (scSnap?.durationMs && scSnap.durationMs > 0
          ? scSnap.durationMs
          : Math.max(0, Number(item.durationSec || 0) * 1000)) ||
        Math.max(0, Number(item.durationSec || 0) * 1000),
      paused: scSnap ? scSnap.paused : true,
      coverUrl: item.imageUrl || undefined
    };
  }
  nowPlayingText.textContent = "";
  nowPlayingText.appendChild(document.createTextNode("Playing "));
  appendProviderBadge(nowPlayingText, item.provider);
  playerHost.innerHTML = trackEmbed(item);
  lastNowPlayingEmbedKey = embedKey;
  renderNowPlayingHero(item);
  if (item.provider === "spotify") {
    wireSpotifyPanelControls(item);
    patchSpotifyNowPlayingPanel(item);
  } else if (item.provider === "soundcloud") {
    wireSoundCloudPanelControls(item);
    attachSoundCloudWidget(item);
  }
  syncNowPlayingTheaterToggle();
  renderNowPlayingTheaterNext();
  mountNowPlayingTheaterChrome();
  const panel = getNowPlayingPanel();
  if (panel) {
    const metaTitle =
      item.provider === "spotify"
        ? spotifyPlaybackState?.trackName || item.title
        : item.title;
    const metaArtist =
      item.provider === "spotify"
        ? spotifyPlaybackState?.artist || item.artist
        : item.artist;
    renderNowPlayingMetaTicker(panel, { title: metaTitle, artist: metaArtist });
  }
};

const showAppleMusicSetupNotice = () => {
  const hint =
    globalThis.unifyAppleMusicBrowse?.setupMessage?.() ||
    "Add APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_PATH to .env, then restart the server.";
  noteAuthFailure("applemusic", {
    error: "Apple Music is not configured on this server.",
    code: "APPLE_MUSIC_NOT_CONFIGURED",
    hint
  });
};

const bindProviderConnectButton = (button, providerState) => {
  button.textContent = providerState.connected ? "Disconnect" : "Connect";
  button.setAttribute(
    "aria-label",
    providerState.connected
      ? `Disconnect ${formatProviderLabel(providerState.provider)}`
      : `Connect ${formatProviderLabel(providerState.provider)}`
  );
  button.setAttribute("data-testid", `connect-${providerState.provider}`);
  button.onclick = async () => {
    if (!providerState.connected && providerState.provider === "applemusic") {
      await globalThis.unifyAppleMusicBrowse?.fetchConfig?.();
      if (!globalThis.unifyAppleMusicBrowse?.isConfigured?.()) {
        showAppleMusicSetupNotice();
        return;
      }
      window.location.assign(apiUrl("/api/oauth/applemusic/login"));
      return;
    }
    if (
      !providerState.connected &&
      (providerState.provider === "spotify" || providerState.provider === "soundcloud")
    ) {
      window.location.assign(apiUrl(`/api/oauth/${providerState.provider}/login`));
      return;
    }
    await apiFetch(`/api/auth/${providerState.provider}/disconnect`, { method: "POST" });
    if (providerState.provider === "spotify") {
      clearSpotifyReloadSnapshotForQueueChange();
      spotifyReloadNeedsUserResume = false;
      spotifyPlaybackPendingUserResume = false;
    }
    await fetchProviders();
  };
};

const providerBadgeSrc = (provider) => {
  if (provider === "spotify") return "/spotify-queue-badge.png";
  if (provider === "applemusic") return "/apple-music-queue-badge.svg";
  return "/soundcloud-queue-badge.png";
};

const renderProviderRow = (providerState, host, variant = "compact") => {
  if (!host) return;
  const row = document.createElement("div");
  row.className =
    variant === "rail" ? "provider-row provider-row--rail" : "provider-row provider-row--compact";
  const text = document.createElement("span");
  text.className = "provider-status";
  if (variant === "rail") {
    if (
      providerState.provider === "spotify" ||
      providerState.provider === "soundcloud" ||
      providerState.provider === "applemusic"
    ) {
      const icon = document.createElement("img");
      icon.src = providerBadgeSrc(providerState.provider);
      icon.alt = "";
      icon.className = "provider-rail-icon";
      icon.width = 20;
      icon.height = 20;
      icon.decoding = "async";
      icon.setAttribute("aria-hidden", "true");
      text.appendChild(icon);
    }

    const label = document.createElement("span");
    label.className = "provider-status__label";
    label.textContent = formatProviderLabel(providerState.provider);
    text.appendChild(label);
  }
  const dot = document.createElement("span");
  let dotClass = "offline";
  if (providerState.connected) {
    dotClass = providerState.health === "degraded" ? "degraded" : "live";
  }
  dot.className = `status-dot ${dotClass}`;
  dot.setAttribute("aria-hidden", "true");
  text.appendChild(dot);
  const button = document.createElement("button");
  bindProviderConnectButton(button, providerState);
  row.appendChild(text);
  row.appendChild(button);
  host.appendChild(row);
};

const renderProviders = () => {
  if (spotifyProviderControls) spotifyProviderControls.innerHTML = "";
  if (soundcloudProviderControls) soundcloudProviderControls.innerHTML = "";
  if (appleMusicProviderControls) appleMusicProviderControls.innerHTML = "";
  if (statusRailProviders) statusRailProviders.innerHTML = "";
  providers.forEach((providerState) => {
    if (providerState.provider === "spotify") {
      renderProviderRow(providerState, spotifyProviderControls, "compact");
      renderProviderRow(providerState, statusRailProviders, "rail");
      return;
    }
    if (providerState.provider === "soundcloud") {
      renderProviderRow(providerState, soundcloudProviderControls, "compact");
      renderProviderRow(providerState, statusRailProviders, "rail");
      return;
    }
    if (providerState.provider === "applemusic") {
      renderProviderRow(providerState, appleMusicProviderControls, "compact");
      renderProviderRow(providerState, statusRailProviders, "rail");
    }
  });
  globalThis.unifyVolume?.updateVolumeConnectedState?.();
};

const appendSearchResultRow = (ul, track, index) => {
  const li = document.createElement("li");
  li.className = "track-list-item";
  li.appendChild(createTrackListRow({ track, index, showIndex: true }));
  const button = document.createElement("button");
  button.textContent = "Queue";
  button.className = "track-list-queue-btn";
  button.setAttribute("data-testid", "search-queue");
  button.onclick = () =>
    void queueTrackPayload({
      provider: track.provider,
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      durationSec: track.durationSec,
      permalinkUrl: track.permalinkUrl,
      imageUrl: track.imageUrl
    });
  li.appendChild(button);
  ul.appendChild(li);
};

const renderTrackList = (ul, tracks) => {
  if (!ul) return;
  ul.innerHTML = "";
  if (!tracks.length) return;
  renderTrackListHeader(ul);
  tracks.forEach((track, index) => appendSearchResultRow(ul, track, index));
};

const renderSpotifySearchResults = () => {
  if (!spotifySearchResults) return;
  if (spotifySearchMode === "album") {
    renderSpotifyAlbumSearchResults();
    return;
  }
  renderTrackList(spotifySearchResults, activeSpotifyResults);
};

const formatAlbumSearchSubtitle = (album) => {
  const meta = [];
  if (album?.artist) meta.push(album.artist);
  if (album?.releaseYear) meta.push(album.releaseYear);
  if (typeof album?.trackCount === "number" && album.trackCount > 0) {
    meta.push(`${album.trackCount} tracks`);
  }
  return meta.join(" · ");
};

const createAlbumSearchArt = (imageUrl) => {
  const url = typeof imageUrl === "string" ? imageUrl.trim() : "";
  if (url) {
    const img = document.createElement("img");
    img.className = "track-list-art";
    img.src = url;
    img.alt = "";
    img.decoding = "async";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.onerror = () => {
      img.replaceWith(
        (() => {
          const fallback = document.createElement("div");
          fallback.className = "track-list-art track-list-art-fallback";
          fallback.setAttribute("aria-hidden", "true");
          return fallback;
        })()
      );
    };
    return img;
  }
  const fallback = document.createElement("div");
  fallback.className = "track-list-art track-list-art-fallback";
  fallback.setAttribute("aria-hidden", "true");
  return fallback;
};

const appendAlbumSearchRow = (ul, album, { testId, onSelect, resolveImageUrl }) => {
  if (!ul || !album) return;
  const li = document.createElement("li");
  li.className = "track-list-item album-search-item";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "album-search-row-btn";
  btn.setAttribute("data-testid", testId);
  btn.onclick = () => void onSelect(album);

  const main = document.createElement("div");
  main.className = "track-list-main album-search-main";

  const rawUrl = String(album?.imageUrl || "").trim();
  const resolvedUrl = typeof resolveImageUrl === "function" ? resolveImageUrl(rawUrl) : rawUrl;
  main.appendChild(createAlbumSearchArt(resolvedUrl));

  const meta = document.createElement("div");
  meta.className = "track-list-meta";
  const titleEl = document.createElement("div");
  titleEl.className = "track-list-title";
  titleEl.textContent = album.name || "Untitled";
  const subtitleEl = document.createElement("div");
  subtitleEl.className = "track-list-artist";
  subtitleEl.textContent = formatAlbumSearchSubtitle(album);
  meta.appendChild(titleEl);
  meta.appendChild(subtitleEl);
  main.appendChild(meta);

  btn.appendChild(main);
  li.appendChild(btn);
  ul.appendChild(li);
};

const appendSpotifyAlbumRow = (ul, album) => {
  appendAlbumSearchRow(ul, album, {
    testId: "spotify-album-row",
    onSelect: selectSpotifyAlbum
  });
};

const renderSpotifyAlbumSearchResults = () => {
  if (!spotifySearchResults) return;
  spotifySearchResults.innerHTML = "";
  if (!activeSpotifyAlbumResults.length) return;
  activeSpotifyAlbumResults.forEach((album) => appendSpotifyAlbumRow(spotifySearchResults, album));
};

const renderSoundcloudSearchResults = () => {
  if (!soundcloudSearchResults) return;
  if (soundcloudSearchMode === "album") {
    renderSoundcloudAlbumSearchResults();
    return;
  }
  renderTrackList(soundcloudSearchResults, activeSoundcloudResults);
};

const appendSoundcloudAlbumRow = (ul, album) => {
  appendAlbumSearchRow(ul, album, {
    testId: "soundcloud-album-row",
    onSelect: selectSoundcloudAlbum,
    resolveImageUrl: upgradeSoundCloudArtworkUrl
  });
};

const appendAppleMusicAlbumRow = (ul, album) => {
  appendAlbumSearchRow(ul, album, {
    testId: "applemusic-album-row",
    onSelect: (selected) => globalThis.unifyAppleMusicBrowse?.openAlbum?.(selected),
    resolveImageUrl: (url) => url
  });
};

const renderSoundcloudAlbumSearchResults = () => {
  if (!soundcloudSearchResults) return;
  soundcloudSearchResults.innerHTML = "";
  if (!activeSoundcloudAlbumResults.length) return;
  activeSoundcloudAlbumResults.forEach((album) => appendSoundcloudAlbumRow(soundcloudSearchResults, album));
};

const setSoundcloudSearchMode = (mode) => {
  const nextMode = mode === "album" ? "album" : "track";
  if (soundcloudAlbumBrowser.selectedId) {
    hideSoundcloudAlbumTracksPane();
  }
  soundcloudSearchMode = nextMode;
  if (soundcloudSearchModeTracks) {
    const selected = nextMode === "track";
    soundcloudSearchModeTracks.classList.toggle("is-selected", selected);
    soundcloudSearchModeTracks.setAttribute("aria-selected", selected ? "true" : "false");
  }
  if (soundcloudSearchModeAlbums) {
    const selected = nextMode === "album";
    soundcloudSearchModeAlbums.classList.toggle("is-selected", selected);
    soundcloudSearchModeAlbums.setAttribute("aria-selected", selected ? "true" : "false");
  }
  if (nextMode === "track") {
    activeSoundcloudAlbumResults = [];
  } else {
    activeSoundcloudResults = [];
  }
  renderSoundcloudSearchResults();
};

const showSoundcloudSearchBrowse = () => {
  if (soundcloudSearchBrowse) soundcloudSearchBrowse.hidden = false;
  panelSoundcloudSearch?.classList.remove("is-album-detail-open");
};

const renderSoundcloudAlbumHero = (album) => {
  const name = album?.name || "Untitled";
  const artist = album?.artist || "";
  const releaseYear = album?.releaseYear || "";
  const trackCount =
    typeof album?.trackCount === "number" && album.trackCount > 0 ? album.trackCount : null;
  const imageUrl = upgradeSoundCloudArtworkUrl(String(album?.imageUrl || "").trim());

  if (soundcloudAlbumHeroTitle) {
    soundcloudAlbumHeroTitle.textContent = name;
  }
  if (soundcloudSelectedAlbumTitle) {
    soundcloudSelectedAlbumTitle.textContent = name;
  }
  if (soundcloudAlbumHeroMeta) {
    const meta = [];
    if (artist) meta.push(artist);
    if (releaseYear) meta.push(releaseYear);
    if (trackCount) meta.push(`${trackCount} tracks`);
    soundcloudAlbumHeroMeta.textContent = meta.join(" · ");
  }
  if (soundcloudAlbumHeroCover) {
    if (imageUrl) {
      soundcloudAlbumHeroCover.src = imageUrl;
      soundcloudAlbumHeroCover.alt = `${name} cover art`;
      soundcloudAlbumHeroCover.hidden = false;
    } else {
      soundcloudAlbumHeroCover.removeAttribute("src");
      soundcloudAlbumHeroCover.alt = "";
      soundcloudAlbumHeroCover.hidden = true;
    }
  }
  if (soundcloudAlbumHeroCoverFallback) {
    soundcloudAlbumHeroCoverFallback.hidden = Boolean(imageUrl);
  }
};

const clearSoundcloudAlbumHero = () => {
  if (soundcloudAlbumHeroTitle) soundcloudAlbumHeroTitle.textContent = "";
  if (soundcloudAlbumHeroMeta) soundcloudAlbumHeroMeta.textContent = "";
  if (soundcloudSelectedAlbumTitle) soundcloudSelectedAlbumTitle.textContent = "Album tracks";
  if (soundcloudAlbumHeroCover) {
    soundcloudAlbumHeroCover.removeAttribute("src");
    soundcloudAlbumHeroCover.alt = "";
    soundcloudAlbumHeroCover.hidden = true;
  }
  if (soundcloudAlbumHeroCoverFallback) soundcloudAlbumHeroCoverFallback.hidden = false;
};

const showSoundcloudAlbumDetail = (album) => {
  if (soundcloudSearchBrowse) soundcloudSearchBrowse.hidden = true;
  if (soundcloudAlbumTracksPanel) soundcloudAlbumTracksPanel.hidden = false;
  panelSoundcloudSearch?.classList.add("is-album-detail-open");
  renderSoundcloudAlbumHero(album);
  updateSoundcloudAlbumQueueAllButton();
};

const updateSoundcloudAlbumQueueAllButton = () => {
  if (!soundcloudAlbumQueueAll) return;
  const hasTracks = soundcloudAlbumBrowser.tracks.length > 0;
  const panelOpen = Boolean(soundcloudAlbumBrowser.selectedId);
  const tracksLoading = soundcloudAlbumTracksPanel?.classList.contains("is-tracks-loading");
  const busy = soundcloudAlbumBrowser.queueAllInProgress;
  soundcloudAlbumQueueAll.hidden = !panelOpen;
  soundcloudAlbumQueueAll.disabled = !hasTracks || Boolean(tracksLoading) || busy;
  if (!busy) {
    soundcloudAlbumQueueAll.textContent = "Queue album";
  }
};

const setSoundcloudAlbumQueueAllBusy = (busy) => {
  soundcloudAlbumBrowser.queueAllInProgress = Boolean(busy);
  if (soundcloudAlbumQueueAll) {
    if (busy) {
      soundcloudAlbumQueueAll.disabled = true;
      soundcloudAlbumQueueAll.textContent = "Queuing album…";
    }
  }
  updateSoundcloudAlbumQueueAllButton();
};

const setSoundcloudAlbumTracksLoading = (loading) => {
  if (soundcloudAlbumTracksPanel) {
    soundcloudAlbumTracksPanel.classList.toggle("is-tracks-loading", Boolean(loading));
  }
  if (soundcloudAlbumTracksLoading) {
    soundcloudAlbumTracksLoading.hidden = !loading;
    soundcloudAlbumTracksLoading.setAttribute("aria-hidden", loading ? "false" : "true");
  }
  if (soundcloudAlbumTracks) {
    soundcloudAlbumTracks.hidden = loading;
    soundcloudAlbumTracks.setAttribute("aria-hidden", loading ? "true" : "false");
  }
  if (soundcloudAlbumTracksMore && loading) {
    soundcloudAlbumTracksMore.hidden = true;
  }
  if (soundcloudAlbumTracksStatus) {
    if (loading) {
      soundcloudAlbumTracksStatus.textContent = "";
      soundcloudAlbumTracksStatus.hidden = true;
    } else if (!soundcloudAlbumTracksStatus.textContent) {
      soundcloudAlbumTracksStatus.hidden = true;
    }
  }
  updateSoundcloudAlbumQueueAllButton();
};

const hideSoundcloudAlbumTracksPane = () => {
  setSoundcloudAlbumTracksLoading(false);
  if (soundcloudAlbumTracksPanel) soundcloudAlbumTracksPanel.hidden = true;
  showSoundcloudSearchBrowse();
  clearSoundcloudAlbumHero();
  soundcloudAlbumBrowser.selectedId = null;
  soundcloudAlbumBrowser.selectedTitle = "";
  soundcloudAlbumBrowser.selectedAlbum = null;
  soundcloudAlbumBrowser.selectedSecretToken = null;
  soundcloudAlbumBrowser.tracks = [];
  soundcloudAlbumBrowser.tracksNextOffset = null;
  soundcloudAlbumBrowser.queueAllInProgress = false;
  updateSoundcloudAlbumQueueAllButton();
};

const fetchSoundcloudAlbumTracksPage = async (albumId, offset, secretToken) =>
  fetchSoundCloudPlaylistTracksPage(albumId, offset, secretToken);

const renderSoundcloudAlbumTracks = () => {
  if (!soundcloudAlbumTracks) return;
  renderTrackList(soundcloudAlbumTracks, soundcloudAlbumBrowser.tracks);
  updateSoundcloudAlbumQueueAllButton();
};

const ensureAllSoundcloudAlbumTracksLoaded = async () => {
  if (!soundcloudAlbumBrowser.selectedId) return;
  while (soundcloudAlbumBrowser.tracksNextOffset !== null) {
    const data = await fetchSoundcloudAlbumTracksPage(
      soundcloudAlbumBrowser.selectedId,
      soundcloudAlbumBrowser.tracksNextOffset,
      soundcloudAlbumBrowser.selectedSecretToken
    );
    const more = data.results || [];
    soundcloudAlbumBrowser.tracks = soundcloudAlbumBrowser.tracks.concat(more);
    soundcloudAlbumBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSoundcloudAlbumTracks();
    if (soundcloudAlbumTracksMore) {
      soundcloudAlbumTracksMore.hidden = soundcloudAlbumBrowser.tracksNextOffset === null;
    }
  }
};

const queueSoundcloudAlbum = async () => {
  if (
    !soundcloudAlbumBrowser.selectedId ||
    soundcloudAlbumBrowser.queueAllInProgress ||
    soundcloudAlbumTracksPanel?.classList.contains("is-tracks-loading")
  ) {
    return;
  }
  setSoundcloudAlbumQueueAllBusy(true);
  if (soundcloudAlbumTracksStatus) {
    soundcloudAlbumTracksStatus.textContent = "";
    soundcloudAlbumTracksStatus.hidden = true;
  }
  try {
    await ensureAllSoundcloudAlbumTracksLoaded();
    const tracks = soundcloudAlbumBrowser.tracks;
    if (!tracks.length) {
      alert("No tracks to queue.");
      return;
    }
    let queued = 0;
    for (const track of tracks) {
      const ok = await queueTrackPayload({
        provider: track.provider || "soundcloud",
        trackId: track.id,
        title: track.title,
        artist: track.artist,
        durationSec: track.durationSec,
        permalinkUrl: track.permalinkUrl,
        imageUrl: track.imageUrl
      });
      if (!ok) {
        if (queued > 0) {
          alert(`Queued ${queued} of ${tracks.length} tracks before an error occurred.`);
        }
        return;
      }
      queued += 1;
    }
    if (soundcloudAlbumTracksStatus) {
      const label = queued === 1 ? "1 track" : `${queued} tracks`;
      soundcloudAlbumTracksStatus.textContent = `Queued ${label} from this album.`;
      soundcloudAlbumTracksStatus.hidden = false;
    }
  } catch (e) {
    alertUnlessAuthNotice("soundcloud", e.message, "Failed to queue album");
  } finally {
    setSoundcloudAlbumQueueAllBusy(false);
  }
};

const selectSoundcloudAlbum = async (album) => {
  if (!soundcloudAlbumTracksPanel || !soundcloudAlbumTracks || !album?.id) return;
  const albumId = album.id;
  const albumName = album.name || "";
  soundcloudAlbumBrowser.selectedId = albumId;
  soundcloudAlbumBrowser.selectedTitle = albumName;
  soundcloudAlbumBrowser.selectedAlbum = album;
  soundcloudAlbumBrowser.selectedSecretToken = album.secretToken || null;
  soundcloudAlbumBrowser.tracks = [];
  soundcloudAlbumBrowser.tracksNextOffset = null;
  showSoundcloudAlbumDetail(album);
  soundcloudAlbumTracks.innerHTML = "";
  setSoundcloudAlbumTracksLoading(true);
  if (soundcloudAlbumTracksMore) soundcloudAlbumTracksMore.hidden = true;
  soundcloudAlbumTracksPanel?.scrollIntoView({ block: "start", behavior: "smooth" });
  try {
    const data = await fetchSoundcloudAlbumTracksPage(
      albumId,
      0,
      soundcloudAlbumBrowser.selectedSecretToken
    );
    soundcloudAlbumBrowser.tracks = data.results || [];
    soundcloudAlbumBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSoundcloudAlbumTracks();
    setSoundcloudAlbumTracksLoading(false);
    if (soundcloudAlbumTracksStatus) {
      soundcloudAlbumTracksStatus.textContent = "";
    }
    if (soundcloudAlbumTracksMore) {
      soundcloudAlbumTracksMore.hidden = soundcloudAlbumBrowser.tracksNextOffset === null;
    }
  } catch (e) {
    setSoundcloudAlbumTracksLoading(false);
    if (soundcloudAlbumTracksStatus) {
      soundcloudAlbumTracksStatus.textContent = "";
    }
    alertUnlessAuthNotice("soundcloud", e.message, "Failed to load album tracks");
  }
};

const loadMoreSoundcloudAlbumTracks = async () => {
  if (
    !soundcloudAlbumTracksMore ||
    !soundcloudAlbumBrowser.selectedId ||
    soundcloudAlbumBrowser.tracksNextOffset === null
  ) {
    return;
  }
  soundcloudAlbumTracksMore.disabled = true;
  try {
    const data = await fetchSoundcloudAlbumTracksPage(
      soundcloudAlbumBrowser.selectedId,
      soundcloudAlbumBrowser.tracksNextOffset,
      soundcloudAlbumBrowser.selectedSecretToken
    );
    const more = data.results || [];
    soundcloudAlbumBrowser.tracks = soundcloudAlbumBrowser.tracks.concat(more);
    soundcloudAlbumBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSoundcloudAlbumTracks();
    if (soundcloudAlbumTracksStatus) {
      soundcloudAlbumTracksStatus.textContent = "";
    }
    soundcloudAlbumTracksMore.hidden = soundcloudAlbumBrowser.tracksNextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("soundcloud", e.message, "Load more failed");
  } finally {
    soundcloudAlbumTracksMore.disabled = false;
  }
};

const runProviderSearch = async (provider, query, onResults, options = {}) => {
  let path = `/api/provider/${provider}/search?q=${encodeURIComponent(query)}`;
  if (options.type === "album") {
    path += "&type=album";
  }
  const response = await apiFetch(path);
  if (!response.ok) {
    const err = await response.json();
    if (!noteAuthFailure(provider, err)) {
      alert(err.error || "Search failed");
    }
    onResults([]);
    return;
  }
  const data = await response.json();
  onResults(data.results || []);
};

const setSpotifySearchMode = (mode) => {
  const nextMode = mode === "album" ? "album" : "track";
  if (spotifyAlbumBrowser.selectedId) {
    hideSpotifyAlbumTracksPane();
  }
  spotifySearchMode = nextMode;
  if (spotifySearchModeTracks) {
    const selected = nextMode === "track";
    spotifySearchModeTracks.classList.toggle("is-selected", selected);
    spotifySearchModeTracks.setAttribute("aria-selected", selected ? "true" : "false");
  }
  if (spotifySearchModeAlbums) {
    const selected = nextMode === "album";
    spotifySearchModeAlbums.classList.toggle("is-selected", selected);
    spotifySearchModeAlbums.setAttribute("aria-selected", selected ? "true" : "false");
  }
  if (nextMode === "track") {
    activeSpotifyAlbumResults = [];
  } else {
    activeSpotifyResults = [];
  }
  renderSpotifySearchResults();
};

const showSpotifySearchBrowse = () => {
  if (spotifySearchBrowse) spotifySearchBrowse.hidden = false;
  panelSpotifySearch?.classList.remove("is-album-detail-open");
};

const renderSpotifyAlbumHero = (album) => {
  const name = album?.name || "Untitled";
  const artist = album?.artist || "";
  const releaseYear = album?.releaseYear || "";
  const trackCount =
    typeof album?.trackCount === "number" && album.trackCount > 0 ? album.trackCount : null;
  const imageUrl = String(album?.imageUrl || "").trim();

  if (spotifyAlbumHeroTitle) {
    spotifyAlbumHeroTitle.textContent = name;
  }
  if (spotifySelectedAlbumTitle) {
    spotifySelectedAlbumTitle.textContent = name;
  }
  if (spotifyAlbumHeroMeta) {
    const meta = [];
    if (artist) meta.push(artist);
    if (releaseYear) meta.push(releaseYear);
    if (trackCount) meta.push(`${trackCount} tracks`);
    spotifyAlbumHeroMeta.textContent = meta.join(" · ");
  }
  if (spotifyAlbumHeroCover) {
    if (imageUrl) {
      spotifyAlbumHeroCover.src = imageUrl;
      spotifyAlbumHeroCover.alt = `${name} cover art`;
      spotifyAlbumHeroCover.hidden = false;
    } else {
      spotifyAlbumHeroCover.removeAttribute("src");
      spotifyAlbumHeroCover.alt = "";
      spotifyAlbumHeroCover.hidden = true;
    }
  }
  if (spotifyAlbumHeroCoverFallback) {
    spotifyAlbumHeroCoverFallback.hidden = Boolean(imageUrl);
  }
};

const clearSpotifyAlbumHero = () => {
  if (spotifyAlbumHeroTitle) spotifyAlbumHeroTitle.textContent = "";
  if (spotifyAlbumHeroMeta) spotifyAlbumHeroMeta.textContent = "";
  if (spotifySelectedAlbumTitle) spotifySelectedAlbumTitle.textContent = "Album tracks";
  if (spotifyAlbumHeroCover) {
    spotifyAlbumHeroCover.removeAttribute("src");
    spotifyAlbumHeroCover.alt = "";
    spotifyAlbumHeroCover.hidden = true;
  }
  if (spotifyAlbumHeroCoverFallback) spotifyAlbumHeroCoverFallback.hidden = false;
};

const showSpotifyAlbumDetail = (album) => {
  if (spotifySearchBrowse) spotifySearchBrowse.hidden = true;
  if (spotifyAlbumTracksPanel) spotifyAlbumTracksPanel.hidden = false;
  panelSpotifySearch?.classList.add("is-album-detail-open");
  renderSpotifyAlbumHero(album);
  updateSpotifyAlbumQueueAllButton();
};

const updateSpotifyAlbumQueueAllButton = () => {
  if (!spotifyAlbumQueueAll) return;
  const hasTracks = spotifyAlbumBrowser.tracks.length > 0;
  const panelOpen = Boolean(spotifyAlbumBrowser.selectedId);
  const tracksLoading = spotifyAlbumTracksPanel?.classList.contains("is-tracks-loading");
  const busy = spotifyAlbumBrowser.queueAllInProgress;
  spotifyAlbumQueueAll.hidden = !panelOpen;
  spotifyAlbumQueueAll.disabled = !hasTracks || Boolean(tracksLoading) || busy;
  if (!busy) {
    spotifyAlbumQueueAll.textContent = "Queue album";
  }
};

const setSpotifyAlbumQueueAllBusy = (busy) => {
  spotifyAlbumBrowser.queueAllInProgress = Boolean(busy);
  if (spotifyAlbumQueueAll) {
    if (busy) {
      spotifyAlbumQueueAll.disabled = true;
      spotifyAlbumQueueAll.textContent = "Queuing album…";
    }
  }
  updateSpotifyAlbumQueueAllButton();
};

const setSpotifyAlbumTracksLoading = (loading) => {
  if (spotifyAlbumTracksPanel) {
    spotifyAlbumTracksPanel.classList.toggle("is-tracks-loading", Boolean(loading));
  }
  if (spotifyAlbumTracksLoading) {
    spotifyAlbumTracksLoading.hidden = !loading;
    spotifyAlbumTracksLoading.setAttribute("aria-hidden", loading ? "false" : "true");
  }
  if (spotifyAlbumTracks) {
    spotifyAlbumTracks.hidden = loading;
    spotifyAlbumTracks.setAttribute("aria-hidden", loading ? "true" : "false");
  }
  if (spotifyAlbumTracksMore && loading) {
    spotifyAlbumTracksMore.hidden = true;
  }
  if (spotifyAlbumTracksStatus) {
    if (loading) {
      spotifyAlbumTracksStatus.textContent = "";
      spotifyAlbumTracksStatus.hidden = true;
    } else if (!spotifyAlbumTracksStatus.textContent) {
      spotifyAlbumTracksStatus.hidden = true;
    }
  }
  updateSpotifyAlbumQueueAllButton();
};

const hideSpotifyAlbumTracksPane = () => {
  setSpotifyAlbumTracksLoading(false);
  if (spotifyAlbumTracksPanel) spotifyAlbumTracksPanel.hidden = true;
  showSpotifySearchBrowse();
  clearSpotifyAlbumHero();
  spotifyAlbumBrowser.selectedId = null;
  spotifyAlbumBrowser.selectedTitle = "";
  spotifyAlbumBrowser.selectedAlbum = null;
  spotifyAlbumBrowser.tracks = [];
  spotifyAlbumBrowser.tracksNextOffset = null;
  spotifyAlbumBrowser.queueAllInProgress = false;
  updateSpotifyAlbumQueueAllButton();
};

const fetchSpotifyAlbumTracksPage = async (albumId, offset) => {
  const res = await apiFetch(
    `/api/spotify/albums/${encodeURIComponent(albumId)}/tracks?limit=50&offset=${offset}`
  );
  if (!res.ok) {
    throw new Error(await formatSpotifyPlaylistHttpError(res, "Could not load album tracks"));
  }
  return res.json();
};

const renderSpotifyAlbumTracks = () => {
  if (!spotifyAlbumTracks) return;
  renderTrackList(spotifyAlbumTracks, spotifyAlbumBrowser.tracks);
  updateSpotifyAlbumQueueAllButton();
};

const ensureAllSpotifyAlbumTracksLoaded = async () => {
  if (!spotifyAlbumBrowser.selectedId) return;
  while (spotifyAlbumBrowser.tracksNextOffset !== null) {
    const data = await fetchSpotifyAlbumTracksPage(
      spotifyAlbumBrowser.selectedId,
      spotifyAlbumBrowser.tracksNextOffset
    );
    const more = data.results || [];
    spotifyAlbumBrowser.tracks = spotifyAlbumBrowser.tracks.concat(more);
    spotifyAlbumBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSpotifyAlbumTracks();
    if (spotifyAlbumTracksMore) {
      spotifyAlbumTracksMore.hidden = spotifyAlbumBrowser.tracksNextOffset === null;
    }
  }
};

const queueSpotifyAlbum = async () => {
  if (
    !spotifyAlbumBrowser.selectedId ||
    spotifyAlbumBrowser.queueAllInProgress ||
    spotifyAlbumTracksPanel?.classList.contains("is-tracks-loading")
  ) {
    return;
  }
  setSpotifyAlbumQueueAllBusy(true);
  if (spotifyAlbumTracksStatus) {
    spotifyAlbumTracksStatus.textContent = "";
    spotifyAlbumTracksStatus.hidden = true;
  }
  try {
    await ensureAllSpotifyAlbumTracksLoaded();
    const tracks = spotifyAlbumBrowser.tracks;
    if (!tracks.length) {
      alert("No tracks to queue.");
      return;
    }
    let queued = 0;
    for (const track of tracks) {
      const ok = await queueTrackPayload({
        provider: track.provider || "spotify",
        trackId: track.id,
        title: track.title,
        artist: track.artist,
        durationSec: track.durationSec,
        imageUrl: track.imageUrl
      });
      if (!ok) {
        if (queued > 0) {
          alert(`Queued ${queued} of ${tracks.length} tracks before an error occurred.`);
        }
        return;
      }
      queued += 1;
    }
    if (spotifyAlbumTracksStatus) {
      const label = queued === 1 ? "1 track" : `${queued} tracks`;
      spotifyAlbumTracksStatus.textContent = `Queued ${label} from this album.`;
      spotifyAlbumTracksStatus.hidden = false;
    }
  } catch (e) {
    alertUnlessAuthNotice("spotify", e.message, "Failed to queue album");
  } finally {
    setSpotifyAlbumQueueAllBusy(false);
  }
};

const selectSpotifyAlbum = async (album) => {
  if (!spotifyAlbumTracksPanel || !spotifyAlbumTracks || !album?.id) return;
  const albumId = album.id;
  const albumName = album.name || "";
  spotifyAlbumBrowser.selectedId = albumId;
  spotifyAlbumBrowser.selectedTitle = albumName;
  spotifyAlbumBrowser.selectedAlbum = album;
  spotifyAlbumBrowser.tracks = [];
  spotifyAlbumBrowser.tracksNextOffset = null;
  showSpotifyAlbumDetail(album);
  spotifyAlbumTracks.innerHTML = "";
  setSpotifyAlbumTracksLoading(true);
  if (spotifyAlbumTracksMore) spotifyAlbumTracksMore.hidden = true;
  spotifyAlbumTracksPanel?.scrollIntoView({ block: "start", behavior: "smooth" });
  try {
    const data = await fetchSpotifyAlbumTracksPage(albumId, 0);
    spotifyAlbumBrowser.tracks = data.results || [];
    spotifyAlbumBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSpotifyAlbumTracks();
    setSpotifyAlbumTracksLoading(false);
    if (spotifyAlbumTracksStatus) {
      spotifyAlbumTracksStatus.textContent = "";
    }
    if (spotifyAlbumTracksMore) {
      spotifyAlbumTracksMore.hidden = spotifyAlbumBrowser.tracksNextOffset === null;
    }
  } catch (e) {
    setSpotifyAlbumTracksLoading(false);
    if (spotifyAlbumTracksStatus) {
      spotifyAlbumTracksStatus.textContent = "";
    }
    alertUnlessAuthNotice("spotify", e.message, "Failed to load album tracks");
  }
};

const loadMoreSpotifyAlbumTracks = async () => {
  if (
    !spotifyAlbumTracksMore ||
    !spotifyAlbumBrowser.selectedId ||
    spotifyAlbumBrowser.tracksNextOffset === null
  ) {
    return;
  }
  spotifyAlbumTracksMore.disabled = true;
  try {
    const data = await fetchSpotifyAlbumTracksPage(
      spotifyAlbumBrowser.selectedId,
      spotifyAlbumBrowser.tracksNextOffset
    );
    const more = data.results || [];
    spotifyAlbumBrowser.tracks = spotifyAlbumBrowser.tracks.concat(more);
    spotifyAlbumBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSpotifyAlbumTracks();
    if (spotifyAlbumTracksStatus) {
      spotifyAlbumTracksStatus.textContent = "";
    }
    spotifyAlbumTracksMore.hidden = spotifyAlbumBrowser.tracksNextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("spotify", e.message, "Load more failed");
  } finally {
    spotifyAlbumTracksMore.disabled = false;
  }
};

const setSpotifyPlaylistLoading = (loading) => {
  if (!spotifyPlaylistLoading) return;
  const scrollEl = spotifyPlaylistLoading.closest(".spotify-library-scroll");
  spotifyPlaylistLoading.hidden = !loading;
  spotifyPlaylistLoading.setAttribute("aria-hidden", loading ? "false" : "true");
  scrollEl?.classList.toggle("is-library-loading", loading);
  if (spotifyLibraryFilter) spotifyLibraryFilter.disabled = Boolean(loading);
  if (spotifyLibraryGroups) {
    const hasStatus = Boolean(spotifyPlaylistStatus && !spotifyPlaylistStatus.hidden);
    const hideGroups = loading || hasStatus;
    spotifyLibraryGroups.hidden = hideGroups;
    spotifyLibraryGroups.setAttribute("aria-hidden", hideGroups ? "true" : "false");
  }
  if (loading && spotifyPlaylistStatus) {
    spotifyPlaylistStatus.hidden = true;
    spotifyPlaylistStatus.textContent = "";
  }
  if (loading && spotifyLibraryFilterEmpty) {
    spotifyLibraryFilterEmpty.hidden = true;
  }
  if (spotifyPlaylistList) {
    const hasStatus = Boolean(spotifyPlaylistStatus && !spotifyPlaylistStatus.hidden);
    spotifyPlaylistList.hidden = loading || hasStatus;
    spotifyPlaylistList.setAttribute("aria-hidden", loading || hasStatus ? "true" : "false");
  }
  if (loading) {
    if (spotifyPlaylistsMore) spotifyPlaylistsMore.hidden = true;
    if (spotifyLikedPlaylistsMore) spotifyLikedPlaylistsMore.hidden = true;
  }
};

const setSpotifyPlaylistTracksLoading = (loading) => {
  if (spotifyPlaylistTracksPanel) {
    spotifyPlaylistTracksPanel.classList.toggle("is-tracks-loading", Boolean(loading));
  }
  if (spotifyPlaylistTracksLoading) {
    spotifyPlaylistTracksLoading.hidden = !loading;
    spotifyPlaylistTracksLoading.setAttribute("aria-hidden", loading ? "false" : "true");
  }
  if (spotifyPlaylistTracks) {
    spotifyPlaylistTracks.hidden = loading;
    spotifyPlaylistTracks.setAttribute("aria-hidden", loading ? "true" : "false");
  }
  if (spotifyTracksMore && loading) {
    spotifyTracksMore.hidden = true;
  }
  if (spotifyPlaylistTracksStatus) {
    if (loading) {
      spotifyPlaylistTracksStatus.textContent = "";
      spotifyPlaylistTracksStatus.hidden = true;
    } else if (!spotifyPlaylistTracksStatus.textContent) {
      spotifyPlaylistTracksStatus.hidden = true;
    }
  }
};

const setSpotifyPlaylistStatus = (message = "") => {
  if (!spotifyPlaylistStatus) return;
  const hasMessage = Boolean(message);
  spotifyPlaylistStatus.textContent = message;
  spotifyPlaylistStatus.hidden = !hasMessage;
  if (spotifyLibraryFilterEmpty && hasMessage) {
    spotifyLibraryFilterEmpty.hidden = true;
  }
  if (spotifyLibraryGroups) {
    spotifyLibraryGroups.hidden = hasMessage;
    spotifyLibraryGroups.setAttribute("aria-hidden", hasMessage ? "true" : "false");
  }
  if (spotifyPlaylistsMore && hasMessage) {
    spotifyPlaylistsMore.hidden = true;
  }
  if (spotifyLikedPlaylistsMore && hasMessage) {
    spotifyLikedPlaylistsMore.hidden = true;
  }
};

const LIBRARY_GROUP_STORAGE_KEY = "unifyLibraryGroupExpanded";

const readLibraryGroupExpandedState = () => {
  try {
    const raw = sessionStorage.getItem(LIBRARY_GROUP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeLibraryGroupExpandedState = (groupId, expanded) => {
  const state = readLibraryGroupExpandedState();
  state[groupId] = expanded;
  try {
    sessionStorage.setItem(LIBRARY_GROUP_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* sessionStorage unavailable */
  }
};

const formatLibraryGroupCountLabel = (count) => {
  const n = Math.max(0, Number(count) || 0);
  return n === 1 ? "1 playlist" : `${n} playlists`;
};

const setLibraryGroupExpanded = (groupEl, expanded) => {
  if (!groupEl) return;
  const toggle = groupEl.querySelector(".library-group-toggle");
  const body = groupEl.querySelector(".library-group-body");
  const isExpanded = Boolean(expanded);
  groupEl.classList.toggle("library-group--collapsed", !isExpanded);
  if (toggle) toggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  if (body) {
    body.hidden = !isExpanded;
    body.setAttribute("aria-hidden", isExpanded ? "false" : "true");
  }
};

const updateLibraryGroupMeta = (groupId, count) => {
  const groupEl = document.querySelector(`[data-library-group="${groupId}"]`);
  if (!groupEl) return;
  const meta = groupEl.querySelector(".library-group-toggle__meta");
  if (!meta) return;
  const n = Math.max(0, Number(count) || 0);
  if (n === 0) {
    meta.textContent = "";
    return;
  }
  meta.textContent = formatLibraryGroupCountLabel(n);
};

const getLibraryFilterQuery = (query) => String(query || "").trim().toLowerCase();

const playlistMatchesLibraryFilter = (playlist, query) => {
  const q = getLibraryFilterQuery(query);
  if (!q) return Boolean(playlist);
  if (!playlist) return false;
  const name = String(playlist.name || "").toLowerCase();
  const owner = String(playlist.ownerDisplayName || "").toLowerCase();
  return name.includes(q) || owner.includes(q);
};

const filterLibraryPlaylists = (playlists, query) => {
  const list = Array.isArray(playlists) ? playlists : [];
  const q = getLibraryFilterQuery(query);
  if (!q) return list;
  return list.filter((pl) => playlistMatchesLibraryFilter(pl, q));
};

const setLibraryGroupFilteredVisibility = (groupId, visibleCount, isFiltering) => {
  const groupEl = document.querySelector(`[data-library-group="${groupId}"]`);
  if (!groupEl) return;
  const hide = Boolean(isFiltering) && visibleCount === 0;
  groupEl.hidden = hide;
  groupEl.setAttribute("aria-hidden", hide ? "true" : "false");
};

const syncLibraryFilterEmptyState = (emptyEl, groupsEl, visibleCount, isFiltering) => {
  if (!emptyEl) return;
  const show = Boolean(isFiltering) && visibleCount === 0;
  emptyEl.hidden = !show;
  if (groupsEl) {
    const hideGroups = show;
    groupsEl.hidden = hideGroups;
    groupsEl.setAttribute("aria-hidden", hideGroups ? "true" : "false");
  }
};

const initLibraryGroupToggles = (rootEl) => {
  if (!rootEl) return;
  const saved = readLibraryGroupExpandedState();
  rootEl.querySelectorAll(".library-group[data-library-group]").forEach((groupEl) => {
    const groupId = groupEl.getAttribute("data-library-group");
    if (!groupId) return;
    const toggle = groupEl.querySelector(".library-group-toggle");
    if (!toggle || toggle.dataset.bound === "1") return;
    toggle.dataset.bound = "1";
    const expanded = Object.prototype.hasOwnProperty.call(saved, groupId) ? Boolean(saved[groupId]) : true;
    setLibraryGroupExpanded(groupEl, expanded);
    toggle.addEventListener("click", () => {
      const next = groupEl.classList.contains("library-group--collapsed");
      setLibraryGroupExpanded(groupEl, next);
      writeLibraryGroupExpandedState(groupId, next);
    });
  });
};

const renderSpotifyLibraryRows = () => {
  const libraryQuery = spotifyPlaylistBrowser.libraryFilterQuery;
  const isFiltering = Boolean(getLibraryFilterQuery(libraryQuery));
  const likedSongsVisible =
    spotifyPlaylistBrowser.likedSongs &&
    playlistMatchesLibraryFilter(spotifyPlaylistBrowser.likedSongs, libraryQuery);
  const ownedVisible = filterLibraryPlaylists(spotifyPlaylistBrowser.items, libraryQuery);
  const likedVisible = filterLibraryPlaylists(spotifyPlaylistBrowser.likedItems, libraryQuery);
  const totalVisible =
    (likedSongsVisible ? 1 : 0) + ownedVisible.length + likedVisible.length;

  if (spotifyLikedSongsList) {
    spotifyLikedSongsList.innerHTML = "";
    if (likedSongsVisible) {
      appendSoundCloudPlaylistRow(
        spotifyLikedSongsList,
        spotifyPlaylistBrowser.likedSongs,
        "spotify-liked-songs-row",
        (pl) => void selectSpotifyPlaylist(pl.id, pl.name, { kind: pl.kind || "liked_songs" })
      );
      const likedBtn = spotifyLikedSongsList.querySelector('[data-testid="spotify-liked-songs-row"]');
      if (likedBtn) {
        const hint = spotifyPlaylistBrowser.likedSongsHint || "";
        if (spotifyPlaylistBrowser.likedSongsUnavailable && hint) {
          likedBtn.title = hint;
          likedBtn.setAttribute("aria-description", hint);
        } else {
          likedBtn.removeAttribute("title");
          likedBtn.removeAttribute("aria-description");
        }
      }
    }
  }
  if (spotifyPlaylistList) {
    spotifyPlaylistList.innerHTML = "";
    ownedVisible.forEach((pl) => {
      appendSoundCloudPlaylistRow(
        spotifyPlaylistList,
        pl,
        "spotify-playlist-row",
        (p) => void selectSpotifyPlaylist(p.id, p.name, { kind: p.kind || "owned" })
      );
    });
  }
  if (spotifyLikedPlaylistList) {
    spotifyLikedPlaylistList.innerHTML = "";
    likedVisible.forEach((pl) => {
      appendSoundCloudPlaylistRow(
        spotifyLikedPlaylistList,
        pl,
        "spotify-liked-playlist-row",
        (p) => void selectSpotifyPlaylist(p.id, p.name, { kind: p.kind || "liked_playlist" })
      );
    });
  }
  updateLibraryGroupMeta("spotify-liked-songs", likedSongsVisible ? 1 : 0);
  updateLibraryGroupMeta("spotify-owned", ownedVisible.length);
  updateLibraryGroupMeta("spotify-liked", likedVisible.length);
  setLibraryGroupFilteredVisibility("spotify-liked-songs", likedSongsVisible ? 1 : 0, isFiltering);
  setLibraryGroupFilteredVisibility("spotify-owned", ownedVisible.length, isFiltering);
  setLibraryGroupFilteredVisibility("spotify-liked", likedVisible.length, isFiltering);
  syncLibraryFilterEmptyState(
    spotifyLibraryFilterEmpty,
    spotifyLibraryGroups,
    totalVisible,
    isFiltering
  );
  if (spotifyPlaylistsMore) {
    spotifyPlaylistsMore.hidden =
      isFiltering || spotifyPlaylistBrowser.nextOffset === null;
  }
  if (spotifyLikedPlaylistsMore) {
    spotifyLikedPlaylistsMore.hidden =
      isFiltering || spotifyPlaylistBrowser.likedNextOffset === null;
  }
};

const filterPlaylistTracksFn =
  typeof window !== "undefined" && window.FilterPlaylistTracks?.filterPlaylistTracks
    ? window.FilterPlaylistTracks.filterPlaylistTracks
    : (tracks, query) => {
        const list = Array.isArray(tracks) ? tracks : [];
        const q = String(query || "").trim().toLowerCase();
        if (!q) return list;
        return list.filter((t) => {
          const title = String(t?.title || t?.name || "").toLowerCase();
          const artist = String(t?.artist || "").toLowerCase();
          return title.includes(q) || artist.includes(q);
        });
      };

const inlineSortPlaylistTracks = (tracks, mode) => {
  const list = Array.isArray(tracks) ? tracks : [];
  if (mode !== "newest" && mode !== "oldest") return list;
  return list
    .map((track, index) => {
      const ms = Date.parse(String(track?.addedAt || "").trim());
      return {
        track,
        index,
        ts: Number.isFinite(ms) ? ms : null
      };
    })
    .sort((a, b) => {
      const aHas = a.ts !== null;
      const bHas = b.ts !== null;
      if (!aHas && !bHas) return a.index - b.index;
      if (!aHas) return 1;
      if (!bHas) return -1;
      if (a.ts !== b.ts) {
        return mode === "newest" ? b.ts - a.ts : a.ts - b.ts;
      }
      return a.index - b.index;
    })
    .map(({ track }) => track);
};

const sortPlaylistTracksFn =
  typeof window !== "undefined" && window.SortPlaylistTracks?.sortPlaylistTracks
    ? window.SortPlaylistTracks.sortPlaylistTracks
    : inlineSortPlaylistTracks;

const getDisplayedPlaylistTracks = (browser) => {
  const filtered = filterPlaylistTracksFn(browser.tracks, browser.trackFilterQuery);
  const mode = browser.trackSortMode === "oldest" ? "oldest" : "newest";
  if (mode === "newest" && browser.tracksNextOffset !== null) {
    return filtered;
  }
  return sortPlaylistTracksFn(filtered, mode);
};

const normalizePlaylistTrackSortMode = (mode) => (mode === "oldest" ? "oldest" : "newest");

const isSpotifyFollowedPlaylistSelection = (browser) =>
  browser.selectedPlaylistKind === "liked_playlist";

const playlistSortNeedsBulkFetch = (browser, nextMode) => {
  if (isSpotifyFollowedPlaylistSelection(browser)) return false;
  if (browser.tracksNextOffset === null) return false;
  if (nextMode === "oldest") return true;
  if (nextMode === "newest" && browser.trackSortMode === "oldest") return true;
  return false;
};

const bumpSpotifyPlaylistTracksLoadGeneration = () => {
  spotifyPlaylistTracksLoadGeneration += 1;
  return spotifyPlaylistTracksLoadGeneration;
};

const bumpSoundCloudPlaylistTracksLoadGeneration = () => {
  soundcloudPlaylistTracksLoadGeneration += 1;
  return soundcloudPlaylistTracksLoadGeneration;
};

const setSpotifyPlaylistTrackSortBusy = (busy) => {
  if (!spotifyPlaylistTrackSort) return;
  spotifyPlaylistTrackSort.querySelectorAll("[data-track-sort]").forEach((btn) => {
    btn.disabled = Boolean(busy);
  });
};

const setSoundCloudPlaylistTrackSortBusy = (busy) => {
  if (!soundcloudPlaylistTrackSort) return;
  soundcloudPlaylistTrackSort.querySelectorAll("[data-track-sort]").forEach((btn) => {
    btn.disabled = Boolean(busy);
  });
};

const syncPlaylistTrackSortUi = (sortEl, mode) => {
  if (!sortEl) return;
  const nextMode = normalizePlaylistTrackSortMode(mode);
  sortEl.querySelectorAll("[data-track-sort]").forEach((btn) => {
    const selected = btn.dataset.trackSort === nextMode;
    btn.classList.toggle("is-selected", selected);
    btn.setAttribute("aria-selected", selected ? "true" : "false");
  });
};

const resetSpotifyPlaylistTrackSort = () => {
  spotifyPlaylistBrowser.trackSortMode = "newest";
  syncPlaylistTrackSortUi(spotifyPlaylistTrackSort, "newest");
};

const resetSoundCloudPlaylistTrackSort = () => {
  soundcloudPlaylistBrowser.trackSortMode = "newest";
  syncPlaylistTrackSortUi(soundcloudPlaylistTrackSort, "newest");
};

const ensureAllSpotifyPlaylistTracksLoaded = async ({ loadGeneration, onProgress } = {}) => {
  if (!spotifyPlaylistBrowser.selectedId) return false;
  const gen = loadGeneration ?? spotifyPlaylistTracksLoadGeneration;
  while (spotifyPlaylistBrowser.tracksNextOffset !== null) {
    if (gen !== spotifyPlaylistTracksLoadGeneration) return false;
    onProgress?.(spotifyPlaylistBrowser.tracks.length);
    const data = await fetchSpotifyPlaylistTracksPage(
      spotifyPlaylistBrowser.selectedId,
      spotifyPlaylistBrowser.tracksNextOffset
    );
    if (gen !== spotifyPlaylistTracksLoadGeneration) return false;
    spotifyPlaylistBrowser.tracks = spotifyPlaylistBrowser.tracks.concat(data.results || []);
    spotifyPlaylistBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
  }
  if (spotifyTracksMore) {
    spotifyTracksMore.hidden = spotifyPlaylistBrowser.tracksNextOffset === null;
  }
  return true;
};

const ensureAllSoundCloudPlaylistTracksLoaded = async ({ loadGeneration, onProgress } = {}) => {
  if (!soundcloudPlaylistBrowser.selectedId) return false;
  const gen = loadGeneration ?? soundcloudPlaylistTracksLoadGeneration;
  while (soundcloudPlaylistBrowser.tracksNextOffset !== null) {
    if (gen !== soundcloudPlaylistTracksLoadGeneration) return false;
    onProgress?.(soundcloudPlaylistBrowser.tracks.length);
    const data = await fetchSoundCloudPlaylistTracksPage(
      soundcloudPlaylistBrowser.selectedId,
      soundcloudPlaylistBrowser.tracksNextOffset,
      soundcloudPlaylistBrowser.selectedSecretToken
    );
    if (gen !== soundcloudPlaylistTracksLoadGeneration) return false;
    soundcloudPlaylistBrowser.tracks = soundcloudPlaylistBrowser.tracks.concat(data.results || []);
    soundcloudPlaylistBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
  }
  if (soundcloudTracksMore) {
    soundcloudTracksMore.hidden = soundcloudPlaylistBrowser.tracksNextOffset === null;
  }
  return true;
};

const setSpotifyPlaylistTrackSort = async (mode) => {
  const nextMode = normalizePlaylistTrackSortMode(mode);
  if (
    nextMode === spotifyPlaylistBrowser.trackSortMode &&
    !playlistSortNeedsBulkFetch(spotifyPlaylistBrowser, nextMode)
  ) {
    return;
  }
  const prevMode = spotifyPlaylistBrowser.trackSortMode;
  spotifyPlaylistBrowser.trackSortMode = nextMode;
  syncPlaylistTrackSortUi(spotifyPlaylistTrackSort, nextMode);

  if (!playlistSortNeedsBulkFetch(spotifyPlaylistBrowser, nextMode)) {
    renderSpotifyPlaylistTracks();
    return;
  }

  const loadGeneration = spotifyPlaylistTracksLoadGeneration;
  setSpotifyPlaylistTrackSortBusy(true);
  if (spotifyTracksMore) spotifyTracksMore.hidden = true;
  const updateProgress = (loaded) => {
    if (!spotifyPlaylistTracksStatus) return;
    spotifyPlaylistTracksStatus.textContent = `Loading tracks for sort… (${loaded} loaded)`;
    spotifyPlaylistTracksStatus.hidden = false;
    delete spotifyPlaylistTracksStatus.dataset.filterMessage;
    delete spotifyPlaylistTracksStatus.dataset.sortMessage;
  };
  try {
    await ensureAllSpotifyPlaylistTracksLoaded({ loadGeneration, onProgress: updateProgress });
    if (loadGeneration !== spotifyPlaylistTracksLoadGeneration) return;
    renderSpotifyPlaylistTracks();
  } catch (e) {
    if (loadGeneration !== spotifyPlaylistTracksLoadGeneration) return;
    spotifyPlaylistBrowser.trackSortMode = prevMode;
    syncPlaylistTrackSortUi(spotifyPlaylistTrackSort, prevMode);
    alertUnlessAuthNotice("spotify", e.message, "Failed to load tracks for sort");
    renderSpotifyPlaylistTracks();
  } finally {
    if (loadGeneration === spotifyPlaylistTracksLoadGeneration) {
      setSpotifyPlaylistTrackSortBusy(false);
    }
  }
};

const setSoundCloudPlaylistTrackSort = async (mode) => {
  const nextMode = normalizePlaylistTrackSortMode(mode);
  if (
    nextMode === soundcloudPlaylistBrowser.trackSortMode &&
    !playlistSortNeedsBulkFetch(soundcloudPlaylistBrowser, nextMode)
  ) {
    return;
  }
  const prevMode = soundcloudPlaylistBrowser.trackSortMode;
  soundcloudPlaylistBrowser.trackSortMode = nextMode;
  syncPlaylistTrackSortUi(soundcloudPlaylistTrackSort, nextMode);

  if (!playlistSortNeedsBulkFetch(soundcloudPlaylistBrowser, nextMode)) {
    renderSoundCloudPlaylistTracks();
    return;
  }

  const loadGeneration = soundcloudPlaylistTracksLoadGeneration;
  setSoundCloudPlaylistTrackSortBusy(true);
  if (soundcloudTracksMore) soundcloudTracksMore.hidden = true;
  const updateProgress = (loaded) => {
    if (!soundcloudPlaylistTracksStatus) return;
    soundcloudPlaylistTracksStatus.textContent = `Loading tracks for sort… (${loaded} loaded)`;
    soundcloudPlaylistTracksStatus.hidden = false;
    delete soundcloudPlaylistTracksStatus.dataset.filterMessage;
    delete soundcloudPlaylistTracksStatus.dataset.sortMessage;
  };
  try {
    await ensureAllSoundCloudPlaylistTracksLoaded({ loadGeneration, onProgress: updateProgress });
    if (loadGeneration !== soundcloudPlaylistTracksLoadGeneration) return;
    renderSoundCloudPlaylistTracks();
  } catch (e) {
    if (loadGeneration !== soundcloudPlaylistTracksLoadGeneration) return;
    soundcloudPlaylistBrowser.trackSortMode = prevMode;
    syncPlaylistTrackSortUi(soundcloudPlaylistTrackSort, prevMode);
    alertUnlessAuthNotice("soundcloud", e.message, "Failed to load tracks for sort");
    renderSoundCloudPlaylistTracks();
  } finally {
    if (loadGeneration === soundcloudPlaylistTracksLoadGeneration) {
      setSoundCloudPlaylistTrackSortBusy(false);
    }
  }
};

const trackHasAddedAt = (track) => {
  const ms = Date.parse(String(track?.addedAt || "").trim());
  return Number.isFinite(ms);
};

const syncPlaylistTracksPaneStatus = (statusEl, browser, displayedTracks) => {
  if (!statusEl) return;
  const q = String(browser.trackFilterQuery || "").trim();
  const displayed = Array.isArray(displayedTracks) ? displayedTracks : [];
  if (q && displayed.length === 0) {
    statusEl.textContent = `No tracks match “${q}”.`;
    statusEl.dataset.filterMessage = "1";
    delete statusEl.dataset.sortMessage;
    statusEl.hidden = false;
    return;
  }
  delete statusEl.dataset.filterMessage;
  const sortMode = browser.trackSortMode;
  if (
    browser === spotifyPlaylistBrowser &&
    isSpotifyFollowedPlaylistSelection(browser) &&
    browser.tracksNextOffset !== null &&
    (sortMode === "newest" || sortMode === "oldest")
  ) {
    statusEl.textContent =
      "Sort uses only the tracks loaded here — Spotify won't load full lists for followed playlists. Use More tracks, or open a playlist you own.";
    statusEl.dataset.sortMessage = "1";
    statusEl.hidden = false;
    return;
  }
  if ((sortMode === "newest" || sortMode === "oldest") && displayed.length > 0) {
    if (!displayed.some(trackHasAddedAt)) {
      statusEl.textContent =
        "Can't sort by date — added timestamps aren't available for these tracks.";
      statusEl.dataset.sortMessage = "1";
      statusEl.hidden = false;
      return;
    }
  }
  delete statusEl.dataset.sortMessage;
  statusEl.textContent = "";
  statusEl.hidden = true;
};

const clearSpotifyPlaylistTrackFilter = () => {
  spotifyPlaylistBrowser.trackFilterQuery = "";
  if (spotifyPlaylistTrackFilter) spotifyPlaylistTrackFilter.value = "";
  resetSpotifyPlaylistTrackSort();
};

const clearSoundCloudPlaylistTrackFilter = () => {
  soundcloudPlaylistBrowser.trackFilterQuery = "";
  if (soundcloudPlaylistTrackFilter) soundcloudPlaylistTrackFilter.value = "";
  resetSoundCloudPlaylistTrackSort();
};

const renderSpotifyPlaylistTracks = () => {
  if (!spotifyPlaylistTracks) return;
  const displayed = getDisplayedPlaylistTracks(spotifyPlaylistBrowser);
  renderTrackList(spotifyPlaylistTracks, displayed);
  syncPlaylistTracksPaneStatus(spotifyPlaylistTracksStatus, spotifyPlaylistBrowser, displayed);
};

const SPOTIFY_PLAYLIST_ERR_SNIPPET_LEN = 160;

/**
 * Builds a user-visible message for failed GET /api/spotify/playlists* responses.
 * Handles HTML/non-JSON (e.g. 404 from an old server) and JSON bodies with error/hint/code.
 */
const formatSpotifyPlaylistHttpError = async (res, defaultMsg) => {
  const status = res.status;
  let raw = "";
  try {
    raw = await res.text();
  } catch {
    return `HTTP ${status}: ${defaultMsg}`;
  }
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const err = JSON.parse(trimmed);
      if (status === 429 || isRateLimitCode(err.code)) {
        const raw = err.error || err.message || err.hint || "";
        if (raw && !/^spotify rate limit$/i.test(String(raw).trim())) {
          return raw;
        }
        return "Spotify is rate-limited. Wait before loading playlists again — you do not need to reconnect.";
      }
      const parts = [err.error, err.hint].filter(Boolean);
      if (parts.length) {
        return err.code && !isRateLimitCode(err.code) ? `${parts.join(" — ")} — ${err.code}` : parts.join(" — ");
      }
    } catch {
      /* fall through */
    }
  }
  const flat = trimmed.replace(/\s+/g, " ");
  const snippet = flat.slice(0, SPOTIFY_PLAYLIST_ERR_SNIPPET_LEN);
  const looksHtml = flat.startsWith("<!") || flat.toLowerCase().includes("<html");
  if (status === 404 && (looksHtml || !trimmed)) {
    const sameOriginApi =
      !queueApiBase &&
      (() => {
        try {
          const page = new URL(window.location.href);
          const target = new URL(res.url || "", window.location.href);
          return page.origin === target.origin;
        } catch {
          return false;
        }
      })();
    if (sameOriginApi) {
      return "Playlist API is missing on this server — stop the Node process on this port, then run npm start from the project folder.";
    }
    return "HTTP 404: playlist route not found (restart the Node server or open the app from the same host/port as the API).";
  }
  if (snippet && !looksHtml) {
    const ell = flat.length > SPOTIFY_PLAYLIST_ERR_SNIPPET_LEN ? "…" : "";
    return `HTTP ${status}: ${snippet}${ell}`;
  }
  if (looksHtml) {
    return `HTTP ${status}: non-JSON error page (${defaultMsg}; check DevTools Network for the request URL).`;
  }
  return `HTTP ${status}: ${defaultMsg}`;
};

const probePlaylistRouteExists = async (featureKey) => {
  const paths = {
    soundcloudPlaylists: "/api/soundcloud/playlists?ownedLimit=1&likedLimit=0",
    spotifyPlaylists: "/api/spotify/playlists?limit=1&offset=0",
    appleMusicPlaylists: "/api/applemusic/playlists?ownedLimit=1"
  };
  const path = paths[featureKey];
  if (!path) return false;
  try {
    const routeRes = await apiFetch(path);
    if (routeRes.status === 404) {
      const body = await routeRes.clone().text();
      if (body.includes("Cannot GET") || body.includes("Not Found")) return false;
    }
    return routeRes.status !== 404;
  } catch {
    return false;
  }
};

const probePlaylistMetaFeature = async (featureKey) => {
  const metaUrl = apiUrl("/api/meta");
  const metaRes = await apiFetch("/api/meta");
  let meta = null;
  if (metaRes.ok) {
    try {
      meta = await metaRes.json();
    } catch {
      meta = null;
    }
  }
  const features = meta?.features || null;
  let hasFlag = Boolean(features?.[featureKey]);
  let reason = null;
  if (hasFlag) {
    reason = "ok";
  } else if (metaRes.ok && features) {
    if (featureKey === "soundcloudPlaylists" && features.spotifyPlaylists) {
      reason = "stale_server";
    } else {
      reason = "feature_missing";
    }
  } else if (metaRes.status === 404) {
    reason = !queueApiBase ? "routes_missing" : "wrong_host";
  } else {
    reason = "meta_unavailable";
  }
  if (!hasFlag) {
    const routeOk = await probePlaylistRouteExists(featureKey);
    if (routeOk) {
      hasFlag = true;
      reason = "route_probe";
    }
  }
  return { ok: hasFlag, reason };
};

const playlistApiUnavailableMessage = (reason) => {
  if (reason === "stale_server") {
    return "The Node server on this port is still running old code (before SoundCloud library support). Stop that process, then run npm start from the project folder.";
  }
  if (reason === "wrong_host") {
    return "Playlist API not reached — open http://localhost:3000 or set ?apiBase=http://127.0.0.1:3000 on this page URL.";
  }
  return "Playlist API is missing on this server — stop the Node process on this port, then run npm start from the project folder.";
};

const ensureSpotifyPlaylistApiAvailable = async () => {
  const probe = await probePlaylistMetaFeature("spotifyPlaylists");
  return probe.ok;
};

const fetchSpotifyPlaylistsPage = async (ownedOffset, likedOffset) => {
  const playlistPath = `/api/spotify/playlists?limit=30&offset=${ownedOffset}&likedLimit=30&likedOffset=${likedOffset}`;
  const res = await apiFetch(playlistPath);
  if (!res.ok) {
    throw new Error(await formatSpotifyPlaylistHttpError(res, "Could not load playlists"));
  }
  return res.json();
};

const fetchSpotifyPlaylistTracksPage = async (playlistId, offset) => {
  const res = await apiFetch(
    `/api/spotify/playlists/${encodeURIComponent(playlistId)}/tracks?limit=50&offset=${offset}`
  );
  if (!res.ok) {
    throw new Error(await formatSpotifyPlaylistHttpError(res, "Could not load playlist tracks"));
  }
  return res.json();
};

const bootstrapSpotifyPlaylistBrowser = async () => {
  if (!spotifyLikedSongsList && !spotifyPlaylistList && !spotifyLikedPlaylistList) return;
  const sp = providers.find((p) => p.provider === "spotify");
  if (!sp?.connected) {
    setSpotifyPlaylistLoading(false);
    setSpotifyPlaylistStatus("");
    if (spotifyLikedSongsList) spotifyLikedSongsList.innerHTML = "";
    if (spotifyPlaylistList) spotifyPlaylistList.innerHTML = "";
    if (spotifyLikedPlaylistList) spotifyLikedPlaylistList.innerHTML = "";
    if (spotifyPlaylistsMore) spotifyPlaylistsMore.hidden = true;
    if (spotifyLikedPlaylistsMore) spotifyLikedPlaylistsMore.hidden = true;
    hideSpotifyPlaylistTracksPane();
    return;
  }

  hideSpotifyPlaylistTracksPane();
  setSpotifyPlaylistLoading(true);
  try {
    const probe = await probePlaylistMetaFeature("spotifyPlaylists");
    if (!probe.ok) {
      hideSpotifyPlaylistTracksPane();
      return;
    }
    const data = await fetchSpotifyPlaylistsPage(0, 0);
    setSpotifyPlaylistStatus("");
    spotifyPlaylistBrowser.likedSongs = data.likedSongs || null;
    spotifyPlaylistBrowser.likedSongsUnavailable = Boolean(data.likedSongsUnavailable);
    spotifyPlaylistBrowser.likedSongsHint = data.likedSongsError?.hint || "";
    spotifyPlaylistBrowser.items = data.items || [];
    spotifyPlaylistBrowser.nextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    spotifyPlaylistBrowser.likedItems = data.likedPlaylists?.items || [];
    spotifyPlaylistBrowser.likedNextOffset =
      data.likedPlaylists?.nextOffset === null || data.likedPlaylists?.nextOffset === undefined
        ? null
        : data.likedPlaylists.nextOffset;
    spotifyPlaylistBrowser.demoMode = Boolean(data.demoMode);
    renderSpotifyLibraryRows();
    if (spotifyPlaylistsMore) {
      spotifyPlaylistsMore.hidden = spotifyPlaylistBrowser.nextOffset === null;
    }
    if (spotifyLikedPlaylistsMore) {
      spotifyLikedPlaylistsMore.hidden = spotifyPlaylistBrowser.likedNextOffset === null;
    }
    if (!spotifyPlaylistBrowser.selectedId) {
      hideSpotifyPlaylistTracksPane();
    }
  } catch (e) {
    const msg = e.message || "Failed to load playlists.";
    if (/rate.?limit/i.test(msg)) {
      noteRateLimit("spotify", { code: "SPOTIFY_RATE_LIMIT", error: msg });
      setSpotifyPlaylistStatus("Spotify playlists are rate-limited right now. You can still search for songs above.");
    } else {
      noteAuthFailureFromMessage("spotify", msg);
      setSpotifyPlaylistStatus("");
    }
    if (spotifyLikedSongsList) spotifyLikedSongsList.innerHTML = "";
    if (spotifyPlaylistList) spotifyPlaylistList.innerHTML = "";
    if (spotifyLikedPlaylistList) spotifyLikedPlaylistList.innerHTML = "";
    if (spotifyPlaylistsMore) spotifyPlaylistsMore.hidden = true;
    if (spotifyLikedPlaylistsMore) spotifyLikedPlaylistsMore.hidden = true;
    hideSpotifyPlaylistTracksPane();
  } finally {
    setSpotifyPlaylistLoading(false);
  }
};

const loadMoreSpotifyPlaylists = async () => {
  if (!spotifyPlaylistsMore || spotifyPlaylistBrowser.nextOffset === null) return;
  spotifyPlaylistsMore.disabled = true;
  try {
    const data = await fetchSpotifyPlaylistsPage(spotifyPlaylistBrowser.nextOffset, 0);
    const more = data.items || [];
    spotifyPlaylistBrowser.items = spotifyPlaylistBrowser.items.concat(more);
    spotifyPlaylistBrowser.nextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    if (data.likedSongs && !spotifyPlaylistBrowser.likedSongs) {
      spotifyPlaylistBrowser.likedSongs = data.likedSongs;
    }
    renderSpotifyLibraryRows();
    spotifyPlaylistsMore.hidden = spotifyPlaylistBrowser.nextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("spotify", e.message, "Load more failed");
  } finally {
    spotifyPlaylistsMore.disabled = false;
  }
};

const loadMoreSpotifyLikedPlaylists = async () => {
  if (!spotifyLikedPlaylistsMore || spotifyPlaylistBrowser.likedNextOffset === null) return;
  spotifyLikedPlaylistsMore.disabled = true;
  try {
    const data = await fetchSpotifyPlaylistsPage(0, spotifyPlaylistBrowser.likedNextOffset);
    const more = data.likedPlaylists?.items || [];
    spotifyPlaylistBrowser.likedItems = spotifyPlaylistBrowser.likedItems.concat(more);
    spotifyPlaylistBrowser.likedNextOffset =
      data.likedPlaylists?.nextOffset === null || data.likedPlaylists?.nextOffset === undefined
        ? null
        : data.likedPlaylists.nextOffset;
    if (data.likedSongs && !spotifyPlaylistBrowser.likedSongs) {
      spotifyPlaylistBrowser.likedSongs = data.likedSongs;
    }
    renderSpotifyLibraryRows();
    spotifyLikedPlaylistsMore.hidden = spotifyPlaylistBrowser.likedNextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("spotify", e.message, "Load more failed");
  } finally {
    spotifyLikedPlaylistsMore.disabled = false;
  }
};

const selectSpotifyPlaylist = async (playlistId, playlistName, options = {}) => {
  if (!spotifyPlaylistTracksPanel || !spotifySelectedPlaylistTitle || !spotifyPlaylistTracks) return;
  bumpSpotifyPlaylistTracksLoadGeneration();
  clearSpotifyPlaylistTrackFilter();
  spotifyPlaylistBrowser.selectedId = playlistId;
  spotifyPlaylistBrowser.selectedTitle = playlistName || "";
  spotifyPlaylistBrowser.selectedPlaylistKind = options.kind || null;
  spotifyPlaylistBrowser.tracks = [];
  spotifyPlaylistBrowser.tracksNextOffset = null;
  spotifySelectedPlaylistTitle.textContent = formatSoundCloudPlaylistTitle(playlistName);
  spotifyPlaylistTracksPanel.hidden = false;
  setSpotifyTracksPaneOpen(true);
  spotifyPlaylistTracks.innerHTML = "";
  setSpotifyPlaylistTracksLoading(true);
  if (spotifyTracksMore) spotifyTracksMore.hidden = true;
  try {
    const data = await fetchSpotifyPlaylistTracksPage(playlistId, 0);
    spotifyPlaylistBrowser.tracks = data.results || [];
    spotifyPlaylistBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSpotifyPlaylistTracks();
    spotifySelectedPlaylistTitle.textContent = formatSoundCloudPlaylistTitle(playlistName);
    setSpotifyPlaylistTracksLoading(false);
    if (spotifyPlaylistTracksStatus) {
      spotifyPlaylistTracksStatus.textContent = "";
    }
    if (spotifyTracksMore) {
      spotifyTracksMore.hidden = spotifyPlaylistBrowser.tracksNextOffset === null;
    }
  } catch (e) {
    setSpotifyPlaylistTracksLoading(false);
    if (spotifyPlaylistTracksStatus) {
      spotifyPlaylistTracksStatus.textContent = "";
    }
    alertUnlessAuthNotice("spotify", e.message, "Failed to load tracks");
  }
};

const loadMoreSpotifyPlaylistTracks = async () => {
  if (
    !spotifyTracksMore ||
    !spotifyPlaylistBrowser.selectedId ||
    spotifyPlaylistBrowser.tracksNextOffset === null
  ) {
    return;
  }
  spotifyTracksMore.disabled = true;
  try {
    const data = await fetchSpotifyPlaylistTracksPage(
      spotifyPlaylistBrowser.selectedId,
      spotifyPlaylistBrowser.tracksNextOffset
    );
    const more = data.results || [];
    spotifyPlaylistBrowser.tracks = spotifyPlaylistBrowser.tracks.concat(more);
    spotifyPlaylistBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSpotifyPlaylistTracks();
    spotifySelectedPlaylistTitle.textContent = formatSoundCloudPlaylistTitle(
      spotifyPlaylistBrowser.selectedTitle
    );
    if (spotifyPlaylistTracksStatus) {
      spotifyPlaylistTracksStatus.textContent = "";
    }
    spotifyTracksMore.hidden = spotifyPlaylistBrowser.tracksNextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("spotify", e.message, "Load more failed");
  } finally {
    spotifyTracksMore.disabled = false;
  }
};

const formatSoundCloudPlaylistHttpError = formatSpotifyPlaylistHttpError;

const formatSoundCloudPlaylistTitle = (playlistName) =>
  String(playlistName || "Tracks").trim() || "Tracks";

const setSpotifyTracksPaneOpen = (open) => {
  if (spotifyLibrarySplit) {
    spotifyLibrarySplit.classList.toggle("library-split--tracks-open", Boolean(open));
  }
};

const setSoundCloudTracksPaneOpen = (open) => {
  if (soundcloudLibrarySplit) {
    soundcloudLibrarySplit.classList.toggle("library-split--tracks-open", Boolean(open));
  }
};

const hideSpotifyPlaylistTracksPane = () => {
  setSpotifyPlaylistTracksLoading(false);
  if (spotifyPlaylistTracksPanel) spotifyPlaylistTracksPanel.hidden = true;
  setSpotifyTracksPaneOpen(false);
};

const hideSoundCloudPlaylistTracksPane = () => {
  setSoundCloudPlaylistTracksLoading(false);
  if (soundcloudPlaylistTracksPanel) soundcloudPlaylistTracksPanel.hidden = true;
  setSoundCloudTracksPaneOpen(false);
};

const ensureSoundCloudPlaylistApiAvailable = async () => {
  const probe = await probePlaylistMetaFeature("soundcloudPlaylists");
  return probe.ok;
};

const fetchSoundCloudLibraryPage = async (ownedOffset, likedOffset) => {
  const path = `/api/soundcloud/playlists?ownedLimit=30&ownedOffset=${ownedOffset}&likedLimit=30&likedOffset=${likedOffset}`;
  const res = await apiFetch(path);
  if (!res.ok) {
    throw new Error(await formatSoundCloudPlaylistHttpError(res, "Could not load SoundCloud library"));
  }
  return res.json();
};

const fetchSoundCloudPlaylistTracksPage = async (playlistId, offset, secretToken) => {
  let path = `/api/soundcloud/playlists/${encodeURIComponent(playlistId)}/tracks?limit=50&offset=${offset}`;
  if (secretToken) {
    path += `&secretToken=${encodeURIComponent(secretToken)}`;
  }
  const res = await apiFetch(path);
  if (!res.ok) {
    throw new Error(await formatSoundCloudPlaylistHttpError(res, "Could not load playlist tracks"));
  }
  return res.json();
};

const appendSoundCloudPlaylistRow = (listEl, pl, testId, onSelect) => {
  if (!listEl || !pl) return;
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "playlist-row-btn";
  const owner = pl.ownerDisplayName ? ` · ${pl.ownerDisplayName}` : "";
  btn.textContent = `${pl.name}${owner}`;
  btn.setAttribute("data-testid", testId);
  btn.onclick = () => void onSelect(pl);
  li.appendChild(btn);
  listEl.appendChild(li);
};

const setSoundCloudPlaylistLoading = (loading) => {
  if (!soundcloudPlaylistLoading) return;
  const scrollEl = soundcloudPlaylistLoading.closest(".soundcloud-library-scroll");
  soundcloudPlaylistLoading.hidden = !loading;
  soundcloudPlaylistLoading.setAttribute("aria-hidden", loading ? "false" : "true");
  scrollEl?.classList.toggle("is-library-loading", loading);
  if (soundcloudLibraryFilter) soundcloudLibraryFilter.disabled = Boolean(loading);
  if (soundcloudLibraryGroups) {
    soundcloudLibraryGroups.hidden = loading;
    soundcloudLibraryGroups.setAttribute("aria-hidden", loading ? "true" : "false");
  }
  if (loading) {
    if (soundcloudOwnedPlaylistsMore) soundcloudOwnedPlaylistsMore.hidden = true;
    if (soundcloudLikedPlaylistsMore) soundcloudLikedPlaylistsMore.hidden = true;
  }
  if (loading && soundcloudLibraryFilterEmpty) {
    soundcloudLibraryFilterEmpty.hidden = true;
  }
};

const setSoundCloudPlaylistTracksLoading = (loading) => {
  if (soundcloudPlaylistTracksPanel) {
    soundcloudPlaylistTracksPanel.classList.toggle("is-tracks-loading", Boolean(loading));
  }
  if (soundcloudPlaylistTracksLoading) {
    soundcloudPlaylistTracksLoading.hidden = !loading;
    soundcloudPlaylistTracksLoading.setAttribute("aria-hidden", loading ? "false" : "true");
  }
  if (soundcloudPlaylistTracks) {
    soundcloudPlaylistTracks.hidden = loading;
    soundcloudPlaylistTracks.setAttribute("aria-hidden", loading ? "true" : "false");
  }
  if (soundcloudTracksMore && loading) {
    soundcloudTracksMore.hidden = true;
  }
  if (soundcloudPlaylistTracksStatus) {
    if (loading) {
      soundcloudPlaylistTracksStatus.textContent = "";
      soundcloudPlaylistTracksStatus.hidden = true;
    } else if (!soundcloudPlaylistTracksStatus.textContent) {
      soundcloudPlaylistTracksStatus.hidden = true;
    }
  }
};

const renderSoundCloudLibraryRows = () => {
  const libraryQuery = soundcloudPlaylistBrowser.libraryFilterQuery;
  const isFiltering = Boolean(getLibraryFilterQuery(libraryQuery));
  const likesVisible =
    soundcloudPlaylistBrowser.likes &&
    playlistMatchesLibraryFilter(soundcloudPlaylistBrowser.likes, libraryQuery);
  const ownedVisible = filterLibraryPlaylists(soundcloudPlaylistBrowser.ownedItems, libraryQuery);
  const likedVisible = filterLibraryPlaylists(soundcloudPlaylistBrowser.likedItems, libraryQuery);
  const totalVisible = (likesVisible ? 1 : 0) + ownedVisible.length + likedVisible.length;

  if (soundcloudLikesList) {
    soundcloudLikesList.innerHTML = "";
    if (likesVisible) {
      appendSoundCloudPlaylistRow(
        soundcloudLikesList,
        soundcloudPlaylistBrowser.likes,
        "soundcloud-likes-row",
        (pl) => void selectSoundCloudPlaylist(pl.id, pl.name, { secretToken: pl.secretToken })
      );
    }
  }
  if (soundcloudOwnedPlaylistList) {
    soundcloudOwnedPlaylistList.innerHTML = "";
    ownedVisible.forEach((pl) => {
      appendSoundCloudPlaylistRow(
        soundcloudOwnedPlaylistList,
        pl,
        "soundcloud-owned-playlist-row",
        (p) => void selectSoundCloudPlaylist(p.id, p.name, { secretToken: p.secretToken })
      );
    });
  }
  if (soundcloudLikedPlaylistList) {
    soundcloudLikedPlaylistList.innerHTML = "";
    likedVisible.forEach((pl) => {
      appendSoundCloudPlaylistRow(
        soundcloudLikedPlaylistList,
        pl,
        "soundcloud-liked-playlist-row",
        (p) => void selectSoundCloudPlaylist(p.id, p.name, { secretToken: p.secretToken })
      );
    });
  }
  updateLibraryGroupMeta("soundcloud-likes", likesVisible ? 1 : 0);
  updateLibraryGroupMeta("soundcloud-owned", ownedVisible.length);
  updateLibraryGroupMeta("soundcloud-liked", likedVisible.length);
  setLibraryGroupFilteredVisibility("soundcloud-likes", likesVisible ? 1 : 0, isFiltering);
  setLibraryGroupFilteredVisibility("soundcloud-owned", ownedVisible.length, isFiltering);
  setLibraryGroupFilteredVisibility("soundcloud-liked", likedVisible.length, isFiltering);
  syncLibraryFilterEmptyState(
    soundcloudLibraryFilterEmpty,
    soundcloudLibraryGroups,
    totalVisible,
    isFiltering
  );
  if (soundcloudOwnedPlaylistsMore) {
    soundcloudOwnedPlaylistsMore.hidden =
      isFiltering || soundcloudPlaylistBrowser.ownedNextOffset === null;
  }
  if (soundcloudLikedPlaylistsMore) {
    soundcloudLikedPlaylistsMore.hidden =
      isFiltering || soundcloudPlaylistBrowser.likedNextOffset === null;
  }
};

const renderSoundCloudPlaylistTracks = () => {
  if (!soundcloudPlaylistTracks) return;
  const displayed = getDisplayedPlaylistTracks(soundcloudPlaylistBrowser);
  renderTrackList(soundcloudPlaylistTracks, displayed);
  syncPlaylistTracksPaneStatus(soundcloudPlaylistTracksStatus, soundcloudPlaylistBrowser, displayed);
};

const bootstrapSoundCloudPlaylistBrowser = async () => {
  if (!soundcloudLikesList) return;
  const sc = providers.find((p) => p.provider === "soundcloud");
  if (!sc?.connected) {
    setSoundCloudPlaylistLoading(false);
    if (soundcloudLikesList) soundcloudLikesList.innerHTML = "";
    if (soundcloudOwnedPlaylistList) soundcloudOwnedPlaylistList.innerHTML = "";
    if (soundcloudLikedPlaylistList) soundcloudLikedPlaylistList.innerHTML = "";
    if (soundcloudOwnedPlaylistsMore) soundcloudOwnedPlaylistsMore.hidden = true;
    if (soundcloudLikedPlaylistsMore) soundcloudLikedPlaylistsMore.hidden = true;
    hideSoundCloudPlaylistTracksPane();
    return;
  }

  hideSoundCloudPlaylistTracksPane();
  setSoundCloudPlaylistLoading(true);
  try {
    const probe = await probePlaylistMetaFeature("soundcloudPlaylists");
    if (!probe.ok) {
      hideSoundCloudPlaylistTracksPane();
      return;
    }
    const data = await fetchSoundCloudLibraryPage(0, 0);
    soundcloudPlaylistBrowser.likes = data.likes || null;
    soundcloudPlaylistBrowser.ownedItems = data.owned?.items || [];
    soundcloudPlaylistBrowser.ownedNextOffset =
      data.owned?.nextOffset === null || data.owned?.nextOffset === undefined
        ? null
        : data.owned.nextOffset;
    soundcloudPlaylistBrowser.likedItems = data.likedPlaylists?.items || [];
    soundcloudPlaylistBrowser.likedNextOffset =
      data.likedPlaylists?.nextOffset === null || data.likedPlaylists?.nextOffset === undefined
        ? null
        : data.likedPlaylists.nextOffset;
    soundcloudPlaylistBrowser.demoMode = Boolean(data.demoMode);
    renderSoundCloudLibraryRows();
    if (soundcloudOwnedPlaylistsMore) {
      soundcloudOwnedPlaylistsMore.hidden = soundcloudPlaylistBrowser.ownedNextOffset === null;
    }
    if (soundcloudLikedPlaylistsMore) {
      soundcloudLikedPlaylistsMore.hidden = soundcloudPlaylistBrowser.likedNextOffset === null;
    }
    if (!soundcloudPlaylistBrowser.selectedId) {
      hideSoundCloudPlaylistTracksPane();
    }
  } catch (e) {
    const msg = e.message || "Failed to load library.";
    noteAuthFailureFromMessage("soundcloud", msg);
    if (soundcloudLikesList) soundcloudLikesList.innerHTML = "";
    if (soundcloudOwnedPlaylistList) soundcloudOwnedPlaylistList.innerHTML = "";
    if (soundcloudLikedPlaylistList) soundcloudLikedPlaylistList.innerHTML = "";
    if (soundcloudOwnedPlaylistsMore) soundcloudOwnedPlaylistsMore.hidden = true;
    if (soundcloudLikedPlaylistsMore) soundcloudLikedPlaylistsMore.hidden = true;
    hideSoundCloudPlaylistTracksPane();
  } finally {
    setSoundCloudPlaylistLoading(false);
  }
};

const loadMoreSoundCloudOwnedPlaylists = async () => {
  if (!soundcloudOwnedPlaylistsMore || soundcloudPlaylistBrowser.ownedNextOffset === null) return;
  soundcloudOwnedPlaylistsMore.disabled = true;
  try {
    const data = await fetchSoundCloudLibraryPage(
      soundcloudPlaylistBrowser.ownedNextOffset,
      0
    );
    const more = data.owned?.items || [];
    soundcloudPlaylistBrowser.ownedItems = soundcloudPlaylistBrowser.ownedItems.concat(more);
    soundcloudPlaylistBrowser.ownedNextOffset =
      data.owned?.nextOffset === null || data.owned?.nextOffset === undefined
        ? null
        : data.owned.nextOffset;
    if (data.likes && !soundcloudPlaylistBrowser.likes) {
      soundcloudPlaylistBrowser.likes = data.likes;
    }
    renderSoundCloudLibraryRows();
    soundcloudOwnedPlaylistsMore.hidden = soundcloudPlaylistBrowser.ownedNextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("soundcloud", e.message, "Load more failed");
  } finally {
    soundcloudOwnedPlaylistsMore.disabled = false;
  }
};

const loadMoreSoundCloudLikedPlaylists = async () => {
  if (!soundcloudLikedPlaylistsMore || soundcloudPlaylistBrowser.likedNextOffset === null) return;
  soundcloudLikedPlaylistsMore.disabled = true;
  try {
    const data = await fetchSoundCloudLibraryPage(
      0,
      soundcloudPlaylistBrowser.likedNextOffset
    );
    const more = data.likedPlaylists?.items || [];
    soundcloudPlaylistBrowser.likedItems = soundcloudPlaylistBrowser.likedItems.concat(more);
    soundcloudPlaylistBrowser.likedNextOffset =
      data.likedPlaylists?.nextOffset === null || data.likedPlaylists?.nextOffset === undefined
        ? null
        : data.likedPlaylists.nextOffset;
    if (data.likes && !soundcloudPlaylistBrowser.likes) {
      soundcloudPlaylistBrowser.likes = data.likes;
    }
    renderSoundCloudLibraryRows();
    soundcloudLikedPlaylistsMore.hidden = soundcloudPlaylistBrowser.likedNextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("soundcloud", e.message, "Load more failed");
  } finally {
    soundcloudLikedPlaylistsMore.disabled = false;
  }
};

const selectSoundCloudPlaylist = async (playlistId, playlistName, { secretToken } = {}) => {
  if (!soundcloudPlaylistTracksPanel || !soundcloudSelectedPlaylistTitle || !soundcloudPlaylistTracks) {
    return;
  }
  bumpSoundCloudPlaylistTracksLoadGeneration();
  clearSoundCloudPlaylistTrackFilter();
  soundcloudPlaylistBrowser.selectedId = playlistId;
  soundcloudPlaylistBrowser.selectedTitle = playlistName || "";
  soundcloudPlaylistBrowser.selectedSecretToken = secretToken || null;
  soundcloudPlaylistBrowser.tracks = [];
  soundcloudPlaylistBrowser.tracksNextOffset = null;
  soundcloudSelectedPlaylistTitle.textContent = formatSoundCloudPlaylistTitle(playlistName);
  soundcloudPlaylistTracksPanel.hidden = false;
  setSoundCloudTracksPaneOpen(true);
  soundcloudPlaylistTracks.innerHTML = "";
  setSoundCloudPlaylistTracksLoading(true);
  if (soundcloudTracksMore) soundcloudTracksMore.hidden = true;
  try {
    const data = await fetchSoundCloudPlaylistTracksPage(
      playlistId,
      0,
      soundcloudPlaylistBrowser.selectedSecretToken
    );
    soundcloudPlaylistBrowser.tracks = data.results || [];
    soundcloudPlaylistBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSoundCloudPlaylistTracks();
    soundcloudSelectedPlaylistTitle.textContent = formatSoundCloudPlaylistTitle(playlistName);
    setSoundCloudPlaylistTracksLoading(false);
    if (soundcloudPlaylistTracksStatus) {
      soundcloudPlaylistTracksStatus.textContent = "";
    }
    if (soundcloudTracksMore) {
      soundcloudTracksMore.hidden = soundcloudPlaylistBrowser.tracksNextOffset === null;
    }
  } catch (e) {
    setSoundCloudPlaylistTracksLoading(false);
    if (soundcloudPlaylistTracksStatus) {
      soundcloudPlaylistTracksStatus.textContent = "";
    }
    alertUnlessAuthNotice("soundcloud", e.message, "Failed to load tracks");
  }
};

const loadMoreSoundCloudPlaylistTracks = async () => {
  if (
    !soundcloudTracksMore ||
    !soundcloudPlaylistBrowser.selectedId ||
    soundcloudPlaylistBrowser.tracksNextOffset === null
  ) {
    return;
  }
  soundcloudTracksMore.disabled = true;
  try {
    const data = await fetchSoundCloudPlaylistTracksPage(
      soundcloudPlaylistBrowser.selectedId,
      soundcloudPlaylistBrowser.tracksNextOffset,
      soundcloudPlaylistBrowser.selectedSecretToken
    );
    const more = data.results || [];
    soundcloudPlaylistBrowser.tracks = soundcloudPlaylistBrowser.tracks.concat(more);
    soundcloudPlaylistBrowser.tracksNextOffset =
      data.nextOffset === null || data.nextOffset === undefined ? null : data.nextOffset;
    renderSoundCloudPlaylistTracks();
    soundcloudSelectedPlaylistTitle.textContent = formatSoundCloudPlaylistTitle(
      soundcloudPlaylistBrowser.selectedTitle
    );
    if (soundcloudPlaylistTracksStatus) {
      soundcloudPlaylistTracksStatus.textContent = "";
    }
    soundcloudTracksMore.hidden = soundcloudPlaylistBrowser.tracksNextOffset === null;
  } catch (e) {
    alertUnlessAuthNotice("soundcloud", e.message, "Load more failed");
  } finally {
    soundcloudTracksMore.disabled = false;
  }
};

const tabBindings = [
  { tab: tabNowPlaying, panel: panelNowPlaying },
  { tab: tabSpotifySearch, panel: panelSpotifySearch },
  { tab: tabSoundcloudSearch, panel: panelSoundcloudSearch },
  { tab: tabAppleMusicSearch, panel: panelAppleMusicSearch }
].filter((b) => b.tab && b.panel);

let mainTabIndex = 0;

const isArrowTabSwitchBlocked = (target) => {
  if (!target || !(target instanceof Element)) return false;
  if (spotifySeekDragging) return true;
  const blocked = target.closest(
    "input, textarea, select, [contenteditable='true'], [contenteditable=''], iframe, .sc-widget"
  );
  if (!blocked) return false;
  if (blocked.tagName === "INPUT") {
    const type = (blocked.getAttribute("type") || "text").toLowerCase();
    return type !== "button" && type !== "checkbox" && type !== "radio";
  }
  return true;
};

const handleMainTabArrowKeys = (event) => {
  if (!tabBindings.length) return;
  let delta = 0;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") delta = 1;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") delta = -1;
  else return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (isArrowTabSwitchBlocked(event.target)) return;

  event.preventDefault();
  const next = (mainTabIndex + delta + tabBindings.length) % tabBindings.length;
  selectMainTab(next);
  tabBindings[next].tab.focus({ preventScroll: true });
};

const selectMainTab = (index) => {
  if (index !== 0 && isNowPlayingTheaterOpen()) void closeNowPlayingTheater();
  mainTabIndex = index;
  tabBindings.forEach((b, i) => {
    const selected = i === index;
    b.tab.classList.toggle("is-selected", selected);
    b.tab.setAttribute("aria-selected", selected ? "true" : "false");
    b.tab.tabIndex = selected ? 0 : -1;
    b.panel.hidden = !selected;
  });
  if (index === 1) {
    void bootstrapSpotifyPlaylistBrowser();
  }
  if (index === 2) {
    void bootstrapSoundCloudPlaylistBrowser();
  }
  if (index === 3) {
    globalThis.unifyAppleMusicBrowse?.bootstrap?.();
  }
};

tabBindings.forEach((b, i) => {
  b.tab.addEventListener("click", () => selectMainTab(i));
});

if (tabBindings.length) {
  selectMainTab(0);
  document.addEventListener("keydown", handleMainTabArrowKeys);
}

if (nowPlayingTheaterBtn) {
  nowPlayingTheaterBtn.addEventListener("click", () => toggleNowPlayingTheater());
}
document.addEventListener("keydown", handleNowPlayingTheaterKeydown);
document.addEventListener("fullscreenchange", handleNowPlayingTheaterFullscreenChange);

if (spotifySearchModeTracks) {
  spotifySearchModeTracks.addEventListener("click", () => setSpotifySearchMode("track"));
}
if (spotifySearchModeAlbums) {
  spotifySearchModeAlbums.addEventListener("click", () => setSpotifySearchMode("album"));
}

if (spotifySearchForm && spotifySearchQuery) {
  spotifySearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = spotifySearchQuery.value.trim();
    if (spotifySearchMode === "album") {
      hideSpotifyAlbumTracksPane();
      await runProviderSearch(
        "spotify",
        query,
        (results) => {
          activeSpotifyAlbumResults = results;
          renderSpotifySearchResults();
        },
        { type: "album" }
      );
      return;
    }
    hideSpotifyAlbumTracksPane();
    await runProviderSearch("spotify", query, (results) => {
      activeSpotifyResults = results;
      renderSpotifySearchResults();
    });
  });
  spotifySearchQuery.addEventListener("input", () => {
    if (spotifySearchQuery.value.trim()) return;
    activeSpotifyResults = [];
    activeSpotifyAlbumResults = [];
    hideSpotifyAlbumTracksPane();
    renderSpotifySearchResults();
  });
}

if (spotifyAlbumTracksMore) {
  spotifyAlbumTracksMore.addEventListener("click", () => void loadMoreSpotifyAlbumTracks());
}

if (spotifyAlbumBack) {
  spotifyAlbumBack.addEventListener("click", () => hideSpotifyAlbumTracksPane());
}

if (spotifyAlbumQueueAll) {
  spotifyAlbumQueueAll.addEventListener("click", () => void queueSpotifyAlbum());
}

if (soundcloudSearchModeTracks) {
  soundcloudSearchModeTracks.addEventListener("click", () => setSoundcloudSearchMode("track"));
}
if (soundcloudSearchModeAlbums) {
  soundcloudSearchModeAlbums.addEventListener("click", () => setSoundcloudSearchMode("album"));
}

if (soundcloudSearchForm && soundcloudSearchQuery) {
  soundcloudSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = soundcloudSearchQuery.value.trim();
    if (soundcloudSearchMode === "album") {
      hideSoundcloudAlbumTracksPane();
      await runProviderSearch(
        "soundcloud",
        query,
        (results) => {
          activeSoundcloudAlbumResults = results;
          renderSoundcloudSearchResults();
        },
        { type: "album" }
      );
      return;
    }
    hideSoundcloudAlbumTracksPane();
    await runProviderSearch("soundcloud", query, (results) => {
      activeSoundcloudResults = results;
      renderSoundcloudSearchResults();
    });
  });
  soundcloudSearchQuery.addEventListener("input", () => {
    if (soundcloudSearchQuery.value.trim()) return;
    activeSoundcloudResults = [];
    activeSoundcloudAlbumResults = [];
    hideSoundcloudAlbumTracksPane();
    renderSoundcloudSearchResults();
  });
}

if (soundcloudAlbumTracksMore) {
  soundcloudAlbumTracksMore.addEventListener("click", () => void loadMoreSoundcloudAlbumTracks());
}

if (soundcloudAlbumBack) {
  soundcloudAlbumBack.addEventListener("click", () => hideSoundcloudAlbumTracksPane());
}

if (soundcloudAlbumQueueAll) {
  soundcloudAlbumQueueAll.addEventListener("click", () => void queueSoundcloudAlbum());
}

if (spotifyPlaylistsMore) {
  spotifyPlaylistsMore.addEventListener("click", () => void loadMoreSpotifyPlaylists());
}
if (spotifyLikedPlaylistsMore) {
  spotifyLikedPlaylistsMore.addEventListener("click", () => void loadMoreSpotifyLikedPlaylists());
}
if (spotifyTracksMore) {
  spotifyTracksMore.addEventListener("click", () => void loadMoreSpotifyPlaylistTracks());
}
if (spotifyLibraryFilter) {
  spotifyLibraryFilter.addEventListener("input", () => {
    spotifyPlaylistBrowser.libraryFilterQuery = spotifyLibraryFilter.value;
    renderSpotifyLibraryRows();
  });
}

if (soundcloudLibraryFilter) {
  soundcloudLibraryFilter.addEventListener("input", () => {
    soundcloudPlaylistBrowser.libraryFilterQuery = soundcloudLibraryFilter.value;
    renderSoundCloudLibraryRows();
  });
}

if (spotifyPlaylistTrackFilter) {
  spotifyPlaylistTrackFilter.addEventListener("input", () => {
    spotifyPlaylistBrowser.trackFilterQuery = spotifyPlaylistTrackFilter.value;
    renderSpotifyPlaylistTracks();
  });
}
if (spotifyPlaylistTrackSort) {
  spotifyPlaylistTrackSort.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-track-sort]");
    if (!btn || !spotifyPlaylistTrackSort.contains(btn)) return;
    void setSpotifyPlaylistTrackSort(btn.dataset.trackSort);
  });
}
if (soundcloudPlaylistTrackFilter) {
  soundcloudPlaylistTrackFilter.addEventListener("input", () => {
    soundcloudPlaylistBrowser.trackFilterQuery = soundcloudPlaylistTrackFilter.value;
    renderSoundCloudPlaylistTracks();
  });
}
if (soundcloudPlaylistTrackSort) {
  soundcloudPlaylistTrackSort.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-track-sort]");
    if (!btn || !soundcloudPlaylistTrackSort.contains(btn)) return;
    void setSoundCloudPlaylistTrackSort(btn.dataset.trackSort);
  });
}
if (soundcloudOwnedPlaylistsMore) {
  soundcloudOwnedPlaylistsMore.addEventListener("click", () => void loadMoreSoundCloudOwnedPlaylists());
}
if (soundcloudLikedPlaylistsMore) {
  soundcloudLikedPlaylistsMore.addEventListener("click", () => void loadMoreSoundCloudLikedPlaylists());
}
if (soundcloudTracksMore) {
  soundcloudTracksMore.addEventListener("click", () => void loadMoreSoundCloudPlaylistTracks());
}

initLibraryGroupToggles(spotifyLibraryGroups);
initLibraryGroupToggles(soundcloudLibraryGroups);
initLibraryGroupToggles(document.getElementById("appleMusicLibraryGroups"));

globalThis.unifyAppleMusicBrowse?.init?.({
  apiFetch,
  runProviderSearch,
  renderTrackList,
  formatAlbumSearchSubtitle,
  appendAppleMusicAlbumRow,
  appendPlaylistRow: (listEl, pl, _testId, onSelect) =>
    appendSoundCloudPlaylistRow(listEl, pl, "applemusic-playlist-row", onSelect),
  getDisplayedPlaylistTracks,
  syncPlaylistTracksPaneStatus,
  noteAuthFailure,
  alertUnlessAuthNotice,
  showAppleMusicSetupNotice,
  getProviders: () => providers,
  probePlaylistMetaFeature,
  playlistApiUnavailableMessage,
  queueTrackPayload
});

handleOAuthReturnParams();
renderPlaybackDiag();
renderSpotifySdkBanner();

globalThis.unifyVolume?.initVolumeControl?.({
  getSpotifyPlayer: () => spotifyPlayer,
  getSoundCloudWidget: () => getSoundCloudWidget(),
  isConnected: () => isAnyProviderConnected(),
  theaterRoot: document.querySelector(".now-playing-theater-volume")
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "m" && event.key !== "M") return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const tag = event.target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (event.target?.isContentEditable) return;
  globalThis.unifyVolume?.toggleMute?.();
});

bootstrapBrowserSession()
  .then(() => globalThis.unifyAppleMusicBrowse?.fetchConfig?.())
  .then(() => Promise.all([fetchProviders(), fetchQueueState()]))
  .then(() => {
  if (providers.some((p) => p.provider === "spotify" && p.connected)) {
    initSpotifySdk();
  }
  const delay = Math.max(0, deferSpotifyLibraryLoadUntil - Date.now());
  if (delay > 0 && tabSpotifySearch?.classList.contains("is-selected") && !isSpotifyApiRateLimited()) {
    setTimeout(() => {
      if (!isSpotifyApiRateLimited()) {
        void bootstrapSpotifyPlaylistBrowser();
      }
    }, delay);
  }
});

const flushReloadSnapshotsOnExit = () => {
  flushSpotifyReloadSnapshot();
  flushSoundCloudReloadSnapshot();
};

window.addEventListener("pagehide", flushReloadSnapshotsOnExit);
window.addEventListener("beforeunload", flushReloadSnapshotsOnExit);

setInterval(() => {
  if (spotifySeekDragging) return;
  if (!spotifySdkReady || !spotifyDeviceId) return;
  if (!spotifyPlaybackState || spotifyPlaybackState.paused) return;
  spotifyPlaybackState = {
    ...spotifyPlaybackState,
    positionMs: Math.min(
      spotifyPlaybackState.durationMs || spotifyPlaybackState.positionMs || 0,
      (spotifyPlaybackState.positionMs || 0) + 1000
    )
  };
  const idx = queueState.currentIndex;
  if (idx >= 0 && queueState.queue[idx]?.provider === "spotify") {
    const cur = queueState.queue[idx];
    flushSpotifyReloadSnapshot();
    if (!patchSpotifyNowPlayingPanel(cur)) {
      renderNowPlaying();
    } else {
      renderNowPlayingHero(cur);
    }
  }
}, 1000);
