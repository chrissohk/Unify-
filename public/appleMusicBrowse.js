/**
 * Apple Music browse tab — library, search, albums. Playback wiring comes later.
 */
(function initAppleMusicBrowseModule() {
  const APPLE_BADGE = "/apple-music-queue-badge.png";

  let deps = null;
  let appleMusicServerConfig = { configured: false };
  let appleMusicSearchMode = "track";
  let activeAppleMusicResults = [];
  let activeAppleMusicAlbumResults = [];
  let appleMusicAlbumBrowser = {
    selectedId: null,
    selectedTitle: "",
    selectedAlbum: null,
    tracks: [],
    tracksNextOffset: null,
    queueAllInProgress: false
  };
  let appleMusicPlaylistBrowser = {
    likedSongs: null,
    ownedItems: [],
    ownedNextOffset: null,
    likedItems: [],
    likedNextOffset: null,
    libraryFilterQuery: "",
    selectedPlaylistId: null,
    selectedPlaylistTitle: "",
    tracks: [],
    tracksNextOffset: null,
    trackFilterQuery: "",
    trackSortMode: "newest",
    demoMode: false,
    loading: false,
    playInProgress: false
  };
  let appleMusicPlaylistPlayGeneration = 0;

  const el = (id) => document.getElementById(id);

  const fetchAppleMusicConfig = async () => {
    if (!deps?.apiFetch) return;
    try {
      const res = await deps.apiFetch("/api/applemusic/config");
      if (res.ok) {
        appleMusicServerConfig = await res.json();
      }
    } catch {
      appleMusicServerConfig = { configured: false };
    }
  };

  const isAppleMusicConfigured = () => Boolean(appleMusicServerConfig.configured);

  const appleMusicSetupMessage = () =>
    appleMusicServerConfig.hint ||
    "Add APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_PATH to .env, then restart the server.";

  const setAppleMusicPlaylistLoading = (on) => {
    appleMusicPlaylistBrowser.loading = on;
    const loading = el("appleMusicPlaylistLoading");
    if (loading) {
      loading.hidden = !on;
      loading.setAttribute("aria-hidden", on ? "false" : "true");
    }
  };

  const setAppleMusicPlaylistStatus = (message, { visible = true } = {}) => {
    const status = el("appleMusicPlaylistStatus");
    if (!status) return;
    status.textContent = message || "";
    status.hidden = !visible || !message;
  };

  const updateAppleMusicAlbumQueueAllButton = () => {
    const btn = el("appleMusicAlbumQueueAll");
    if (!btn) return;
    const panelOpen = Boolean(appleMusicAlbumBrowser.selectedId);
    const hasTracks = appleMusicAlbumBrowser.tracks.length > 0;
    const loadingEl = el("appleMusicAlbumTracksLoading");
    const tracksLoading = loadingEl && !loadingEl.hidden;
    const busy = appleMusicAlbumBrowser.queueAllInProgress;
    btn.hidden = !panelOpen || !hasTracks;
    btn.disabled = !hasTracks || Boolean(tracksLoading) || busy;
    if (!busy) btn.textContent = "Queue album";
  };

  const setAppleMusicAlbumQueueAllBusy = (busy) => {
    appleMusicAlbumBrowser.queueAllInProgress = busy;
    const btn = el("appleMusicAlbumQueueAll");
    if (btn && busy) {
      btn.disabled = true;
      btn.textContent = "Queuing album…";
    }
    updateAppleMusicAlbumQueueAllButton();
  };

  const queueAppleMusicAlbumTracks = async () => {
    const tracks = appleMusicAlbumBrowser.tracks;
    if (!tracks.length) return;
    setAppleMusicAlbumQueueAllBusy(true);
    try {
      for (const track of tracks) {
        await deps.queueTrackPayload({
          provider: "applemusic",
          trackId: track.id,
          title: track.title,
          artist: track.artist,
          durationSec: track.durationSec,
          imageUrl: track.imageUrl
        });
      }
    } finally {
      setAppleMusicAlbumQueueAllBusy(false);
    }
  };

  const hideAppleMusicAlbumTracksPane = () => {
    appleMusicAlbumBrowser.selectedId = null;
    appleMusicAlbumBrowser.selectedTitle = "";
    appleMusicAlbumBrowser.selectedAlbum = null;
    appleMusicAlbumBrowser.tracks = [];
    appleMusicAlbumBrowser.tracksNextOffset = null;
    const panel = el("appleMusicAlbumTracksPanel");
    if (panel) panel.hidden = true;
    const browse = el("appleMusicSearchBrowse");
    if (browse) browse.hidden = false;
    const lib = document.querySelector(".applemusic-library-split");
    if (lib) lib.hidden = false;
    updateAppleMusicAlbumQueueAllButton();
  };

  const hideAppleMusicPlaylistTracksPane = () => {
    appleMusicPlaylistPlayGeneration += 1;
    appleMusicPlaylistBrowser.playInProgress = false;
    appleMusicPlaylistBrowser.selectedPlaylistId = null;
    appleMusicPlaylistBrowser.selectedPlaylistTitle = "";
    appleMusicPlaylistBrowser.tracks = [];
    appleMusicPlaylistBrowser.tracksNextOffset = null;
    const panel = el("appleMusicPlaylistTracksPanel");
    if (panel) panel.hidden = true;
    const lib = document.querySelector(".applemusic-library-split");
    if (lib) lib.hidden = false;
    updateAppleMusicPlaylistPlayButtons();
  };

  const bumpAppleMusicPlaylistPlayGeneration = () => {
    appleMusicPlaylistPlayGeneration += 1;
    return appleMusicPlaylistPlayGeneration;
  };

  const updateAppleMusicPlaylistPlayButtons = () => {
    const panel = el("appleMusicPlaylistTracksPanel");
    const loading = el("appleMusicPlaylistTracksLoading");
    const panelOpen = panel && !panel.hidden;
    const hasTracks = appleMusicPlaylistBrowser.tracks.length > 0;
    const tracksLoading = loading && !loading.hidden;
    const busy = appleMusicPlaylistBrowser.playInProgress;
    const show = panelOpen && appleMusicPlaylistBrowser.selectedPlaylistId && hasTracks;
    for (const id of ["appleMusicPlaylistPlay", "appleMusicPlaylistShufflePlay"]) {
      const btn = el(id);
      if (!btn) continue;
      btn.hidden = !show;
      btn.disabled = !show || tracksLoading || busy;
    }
    const playBtn = el("appleMusicPlaylistPlay");
    const shuffleBtn = el("appleMusicPlaylistShufflePlay");
    if (playBtn && !busy) playBtn.textContent = "Play";
    if (shuffleBtn && !busy) shuffleBtn.textContent = "Shuffle play";
  };

  const setAppleMusicPlaylistPlayBusy = (busy, { shuffle = false } = {}) => {
    appleMusicPlaylistBrowser.playInProgress = busy;
    const playBtn = el("appleMusicPlaylistPlay");
    const shuffleBtn = el("appleMusicPlaylistShufflePlay");
    if (playBtn && busy && !shuffle) {
      playBtn.disabled = true;
      playBtn.textContent = "Playing…";
    }
    if (shuffleBtn && busy && shuffle) {
      shuffleBtn.disabled = true;
      shuffleBtn.textContent = "Loading…";
    }
    updateAppleMusicPlaylistPlayButtons();
  };

  const updateAppleMusicPlaylistPlayLoadProgress = (loaded) => {
    const status = el("appleMusicPlaylistTracksStatus");
    if (!status) return;
    status.textContent = `Loading playlist… (${loaded} loaded)`;
    status.hidden = false;
    delete status.dataset.filterMessage;
    delete status.dataset.sortMessage;
  };

  const ensureAllAppleMusicPlaylistTracksLoaded = async ({ onProgress } = {}) => {
    const playlistId = appleMusicPlaylistBrowser.selectedPlaylistId;
    if (!playlistId) return false;
    while (appleMusicPlaylistBrowser.tracksNextOffset !== null) {
      onProgress?.(appleMusicPlaylistBrowser.tracks.length);
      const data = await fetchAppleMusicPlaylistTracksPage(
        playlistId,
        appleMusicPlaylistBrowser.tracksNextOffset
      );
      appleMusicPlaylistBrowser.tracks.push(...(data.items || []));
      appleMusicPlaylistBrowser.tracksNextOffset = data.nextOffset ?? null;
    }
    const moreBtn = el("appleMusicTracksMore");
    if (moreBtn) moreBtn.hidden = appleMusicPlaylistBrowser.tracksNextOffset === null;
    return true;
  };

  const queueRemainingAppleMusicPlaylistTracks = async (playlistId, playGen, startQueuedFrom) => {
    let queuedFrom = startQueuedFrom;
    try {
      while (true) {
        if (playGen !== appleMusicPlaylistPlayGeneration) return;
        if (appleMusicPlaylistBrowser.selectedPlaylistId !== playlistId) return;
        const tracks = appleMusicPlaylistBrowser.tracks;
        while (queuedFrom < tracks.length) {
          if (playGen !== appleMusicPlaylistPlayGeneration) return;
          if (appleMusicPlaylistBrowser.selectedPlaylistId !== playlistId) return;
          const ok = await deps.queueTrackPayload({
            ...deps.playlistTrackToQueuePayload(tracks[queuedFrom], "applemusic"),
            skipAutoPlay: true
          });
          if (!ok) return;
          queuedFrom += 1;
        }
        if (appleMusicPlaylistBrowser.tracksNextOffset === null) break;
        const data = await fetchAppleMusicPlaylistTracksPage(
          playlistId,
          appleMusicPlaylistBrowser.tracksNextOffset
        );
        if (playGen !== appleMusicPlaylistPlayGeneration) return;
        appleMusicPlaylistBrowser.tracks.push(...(data.items || []));
        appleMusicPlaylistBrowser.tracksNextOffset = data.nextOffset ?? null;
        renderAppleMusicPlaylistTracks();
      }
    } finally {
      if (
        playGen === appleMusicPlaylistPlayGeneration &&
        appleMusicPlaylistBrowser.selectedPlaylistId === playlistId
      ) {
        appleMusicPlaylistBrowser.playInProgress = false;
        updateAppleMusicPlaylistPlayButtons();
      }
    }
  };

  const playAppleMusicPlaylist = async () => {
    if (!appleMusicPlaylistBrowser.selectedPlaylistId || appleMusicPlaylistBrowser.playInProgress) {
      return;
    }
    const loading = el("appleMusicPlaylistTracksLoading");
    if (loading && !loading.hidden) return;

    const playGen = bumpAppleMusicPlaylistPlayGeneration();
    const playlistId = appleMusicPlaylistBrowser.selectedPlaylistId;
    setAppleMusicPlaylistPlayBusy(true);
    const status = el("appleMusicPlaylistTracksStatus");
    if (status) {
      status.textContent = "";
      status.hidden = true;
    }
    try {
      await deps.clearUpcomingQueue();
      if (playGen !== appleMusicPlaylistPlayGeneration) return;

      const tracks = appleMusicPlaylistBrowser.tracks;
      if (!tracks.length) {
        alert("No tracks to play.");
        appleMusicPlaylistBrowser.playInProgress = false;
        updateAppleMusicPlaylistPlayButtons();
        return;
      }

      const wasPlaying = (deps.getQueueCurrentIndex?.() ?? -1) >= 0;
      const firstOk = await deps.playPlaylistFirstTrack(tracks[0], "applemusic", wasPlaying);
      if (!firstOk || playGen !== appleMusicPlaylistPlayGeneration) {
        appleMusicPlaylistBrowser.playInProgress = false;
        updateAppleMusicPlaylistPlayButtons();
        return;
      }

      void queueRemainingAppleMusicPlaylistTracks(playlistId, playGen, 1);
    } catch (e) {
      appleMusicPlaylistBrowser.playInProgress = false;
      updateAppleMusicPlaylistPlayButtons();
      deps.alertUnlessAuthNotice("applemusic", e.message, "Failed to play playlist");
    }
  };

  const shufflePlayAppleMusicPlaylist = async () => {
    if (!appleMusicPlaylistBrowser.selectedPlaylistId || appleMusicPlaylistBrowser.playInProgress) {
      return;
    }
    const loading = el("appleMusicPlaylistTracksLoading");
    if (loading && !loading.hidden) return;

    const playGen = bumpAppleMusicPlaylistPlayGeneration();
    setAppleMusicPlaylistPlayBusy(true, { shuffle: true });
    try {
      await deps.clearUpcomingQueue();
      if (playGen !== appleMusicPlaylistPlayGeneration) return;

      const loaded = await ensureAllAppleMusicPlaylistTracksLoaded({
        onProgress: (n) => updateAppleMusicPlaylistPlayLoadProgress(n)
      });
      if (!loaded || playGen !== appleMusicPlaylistPlayGeneration) return;

      const shuffled =
        globalThis.unifyShuffleTracks?.shuffleTracks?.(appleMusicPlaylistBrowser.tracks) ||
        [...appleMusicPlaylistBrowser.tracks];
      if (!shuffled.length) {
        alert("No tracks to play.");
        return;
      }

      let queued = 0;
      for (const track of shuffled) {
        const ok = await deps.queueTrackPayload({
          ...deps.playlistTrackToQueuePayload(track, "applemusic"),
          skipAutoPlay: true
        });
        if (!ok) {
          if (queued > 0) {
            alert(`Queued ${queued} of ${shuffled.length} tracks before an error occurred.`);
          }
          return;
        }
        queued += 1;
      }
      await deps.playQueueIndexAfterBulkQueue();
      renderAppleMusicPlaylistTracks();
    } catch (e) {
      deps.alertUnlessAuthNotice("applemusic", e.message, "Failed to shuffle play playlist");
    } finally {
      appleMusicPlaylistBrowser.playInProgress = false;
      updateAppleMusicPlaylistPlayButtons();
      if (el("appleMusicPlaylistTracksStatus") && !el("appleMusicPlaylistTracksStatus").dataset.filterMessage) {
        renderAppleMusicPlaylistTracks();
      }
    }
  };

  const renderAppleMusicSearchResults = () => {
    const ul = el("appleMusicSearchResults");
    if (!ul) return;
    if (appleMusicSearchMode === "album") {
      ul.innerHTML = "";
      if (!activeAppleMusicAlbumResults.length) return;
      activeAppleMusicAlbumResults.forEach((album) => deps.appendAppleMusicAlbumRow(ul, album));
      return;
    }
    deps.renderTrackList(ul, activeAppleMusicResults);
  };

  const setAppleMusicSearchMode = (mode) => {
    const nextMode = mode === "album" ? "album" : "track";
    if (appleMusicAlbumBrowser.selectedId) hideAppleMusicAlbumTracksPane();
    appleMusicSearchMode = nextMode;
    const tracksBtn = el("appleMusicSearchModeTracks");
    const albumsBtn = el("appleMusicSearchModeAlbums");
    if (tracksBtn) {
      const selected = nextMode === "track";
      tracksBtn.classList.toggle("is-selected", selected);
      tracksBtn.setAttribute("aria-selected", selected ? "true" : "false");
    }
    if (albumsBtn) {
      const selected = nextMode === "album";
      albumsBtn.classList.toggle("is-selected", selected);
      albumsBtn.setAttribute("aria-selected", selected ? "true" : "false");
    }
    if (nextMode === "track") activeAppleMusicAlbumResults = [];
    renderAppleMusicSearchResults();
  };

  const fetchAppleMusicLibraryPage = async (ownedOffset, likedOffset = 0) => {
    const path = `/api/applemusic/playlists?ownedLimit=30&ownedOffset=${ownedOffset}&likedLimit=30&likedOffset=${likedOffset}`;
    const res = await deps.apiFetch(path);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.hint || "Could not load Apple Music library");
    }
    return res.json();
  };

  const fetchAppleMusicPlaylistTracksPage = async (playlistId, offset) => {
    const path = `/api/applemusic/playlists/${encodeURIComponent(playlistId)}/tracks?limit=50&offset=${offset}`;
    const res = await deps.apiFetch(path);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Could not load playlist tracks");
    }
    return res.json();
  };

  const fetchAppleMusicAlbumTracksPage = async (albumId, offset) => {
    const path = `/api/applemusic/albums/${encodeURIComponent(albumId)}/tracks?limit=50&offset=${offset}`;
    const res = await deps.apiFetch(path);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Could not load album tracks");
    }
    return res.json();
  };

  const renderAppleMusicLibraryRows = () => {
    const likedSongsList = el("appleMusicLikedSongsList");
    const ownedList = el("appleMusicOwnedPlaylistList");
    const likedPlaylistList = el("appleMusicLikedPlaylistList");
    const filterEmpty = el("appleMusicLibraryFilterEmpty");
    const filterInput = el("appleMusicLibraryFilter");
    const q = (filterInput?.value || appleMusicPlaylistBrowser.libraryFilterQuery || "")
      .trim()
      .toLowerCase();
    appleMusicPlaylistBrowser.libraryFilterQuery = filterInput?.value || "";

    const matches = (name) => !q || String(name || "").toLowerCase().includes(q);

    if (likedSongsList) {
      likedSongsList.innerHTML = "";
      const liked = appleMusicPlaylistBrowser.likedSongs;
      if (liked && matches(liked.name)) {
        deps.appendPlaylistRow(likedSongsList, liked, () => openAppleMusicPlaylist(liked));
      }
    }

    if (ownedList) {
      ownedList.innerHTML = "";
      appleMusicPlaylistBrowser.ownedItems
        .filter((p) => matches(p.name))
        .forEach((p) => deps.appendPlaylistRow(ownedList, p, () => openAppleMusicPlaylist(p)));
    }

    if (likedPlaylistList) {
      likedPlaylistList.innerHTML = "";
      appleMusicPlaylistBrowser.likedItems
        .filter((p) => matches(p.name))
        .forEach((p) => deps.appendPlaylistRow(likedPlaylistList, p, () => openAppleMusicPlaylist(p)));
    }

    const anyVisible =
      (appleMusicPlaylistBrowser.likedSongs && matches(appleMusicPlaylistBrowser.likedSongs.name)) ||
      appleMusicPlaylistBrowser.ownedItems.some((p) => matches(p.name)) ||
      appleMusicPlaylistBrowser.likedItems.some((p) => matches(p.name));

    if (filterEmpty) {
      filterEmpty.hidden = !q || anyVisible;
    }

    const moreBtn = el("appleMusicPlaylistsMore");
    if (moreBtn) {
      moreBtn.hidden = Boolean(q) || appleMusicPlaylistBrowser.ownedNextOffset === null;
    }
    const likedMoreBtn = el("appleMusicLikedPlaylistsMore");
    if (likedMoreBtn) {
      likedMoreBtn.hidden = Boolean(q) || appleMusicPlaylistBrowser.likedNextOffset === null;
    }
  };

  const openAppleMusicPlaylist = async (playlist) => {
    if (!playlist?.id) return;
    hideAppleMusicAlbumTracksPane();
    bumpAppleMusicPlaylistPlayGeneration();
    appleMusicPlaylistBrowser.selectedPlaylistId = playlist.id;
    appleMusicPlaylistBrowser.selectedPlaylistTitle = playlist.name || "Playlist";
    appleMusicPlaylistBrowser.tracks = [];
    appleMusicPlaylistBrowser.tracksNextOffset = null;
    const titleEl = el("appleMusicSelectedPlaylistTitle");
    if (titleEl) titleEl.textContent = appleMusicPlaylistBrowser.selectedPlaylistTitle;
    const panel = el("appleMusicPlaylistTracksPanel");
    const lib = document.querySelector(".applemusic-library-split");
    if (panel) panel.hidden = false;
    if (lib) lib.hidden = true;
    const loading = el("appleMusicPlaylistTracksLoading");
    if (loading) {
      loading.hidden = false;
      loading.setAttribute("aria-hidden", "false");
    }
    try {
      const data = await fetchAppleMusicPlaylistTracksPage(playlist.id, 0);
      appleMusicPlaylistBrowser.tracks = data.items || [];
      appleMusicPlaylistBrowser.tracksNextOffset = data.nextOffset ?? null;
      renderAppleMusicPlaylistTracks();
    } catch (e) {
      deps.alertUnlessAuthNotice("applemusic", e.message, "Could not open playlist");
    } finally {
      if (loading) {
        loading.hidden = true;
        loading.setAttribute("aria-hidden", "true");
      }
    }
  };

  const renderAppleMusicPlaylistTracks = () => {
    const ul = el("appleMusicPlaylistTracks");
    if (!ul) return;
    const displayed = deps.getDisplayedPlaylistTracks(appleMusicPlaylistBrowser);
    deps.renderTrackList(ul, displayed);
    deps.syncPlaylistTracksPaneStatus(
      el("appleMusicPlaylistTracksStatus"),
      appleMusicPlaylistBrowser,
      displayed
    );
    updateAppleMusicPlaylistPlayButtons();
  };

  const bootstrapAppleMusicPlaylistBrowser = async () => {
    if (!el("appleMusicLikedSongsList")) return;
    await fetchAppleMusicConfig();

    if (!isAppleMusicConfigured()) {
      setAppleMusicPlaylistLoading(false);
      if (el("appleMusicLikedSongsList")) el("appleMusicLikedSongsList").innerHTML = "";
      if (el("appleMusicOwnedPlaylistList")) el("appleMusicOwnedPlaylistList").innerHTML = "";
      if (el("appleMusicLikedPlaylistList")) el("appleMusicLikedPlaylistList").innerHTML = "";
      hideAppleMusicPlaylistTracksPane();
      setAppleMusicPlaylistStatus(appleMusicSetupMessage(), { visible: true });
      return;
    }

    const am = deps.getProviders().find((p) => p.provider === "applemusic");
    if (!am?.connected) {
      setAppleMusicPlaylistLoading(false);
      if (el("appleMusicLikedSongsList")) el("appleMusicLikedSongsList").innerHTML = "";
      if (el("appleMusicOwnedPlaylistList")) el("appleMusicOwnedPlaylistList").innerHTML = "";
      if (el("appleMusicLikedPlaylistList")) el("appleMusicLikedPlaylistList").innerHTML = "";
      hideAppleMusicPlaylistTracksPane();
      setAppleMusicPlaylistStatus("Connect Apple Music to browse your library.", { visible: true });
      return;
    }

    hideAppleMusicPlaylistTracksPane();
    setAppleMusicPlaylistStatus("", { visible: false });
    setAppleMusicPlaylistLoading(true);
    try {
      const probe = await deps.probePlaylistMetaFeature("appleMusicPlaylists");
      if (!probe.ok) {
        hideAppleMusicPlaylistTracksPane();
        setAppleMusicPlaylistStatus(deps.playlistApiUnavailableMessage(probe.reason), { visible: true });
        return;
      }
      const data = await fetchAppleMusicLibraryPage(0, 0);
      appleMusicPlaylistBrowser.likedSongs = data.likedSongs || null;
      appleMusicPlaylistBrowser.ownedItems = data.owned?.items || [];
      appleMusicPlaylistBrowser.ownedNextOffset =
        data.owned?.nextOffset === null || data.owned?.nextOffset === undefined
          ? null
          : data.owned.nextOffset;
      appleMusicPlaylistBrowser.likedItems = data.likedPlaylists?.items || [];
      appleMusicPlaylistBrowser.likedNextOffset =
        data.likedPlaylists?.nextOffset === null || data.likedPlaylists?.nextOffset === undefined
          ? null
          : data.likedPlaylists.nextOffset;
      appleMusicPlaylistBrowser.demoMode = Boolean(data.demoMode);
      renderAppleMusicLibraryRows();
    } catch (e) {
      hideAppleMusicPlaylistTracksPane();
      if (!deps.noteAuthFailure("applemusic", { error: e.message, code: "APPLE_MUSIC_NOT_CONFIGURED" })) {
        deps.alertUnlessAuthNotice("applemusic", e.message, "Library load failed");
      }
      setAppleMusicPlaylistStatus(e.message, { visible: true });
    } finally {
      setAppleMusicPlaylistLoading(false);
    }
  };

  const bindEvents = () => {
    el("appleMusicSearchModeTracks")?.addEventListener("click", () => setAppleMusicSearchMode("track"));
    el("appleMusicSearchModeAlbums")?.addEventListener("click", () => setAppleMusicSearchMode("album"));

    const form = el("appleMusicSearchForm");
    const queryInput = el("appleMusicSearchQuery");
    if (form && queryInput) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await fetchAppleMusicConfig();
        if (!isAppleMusicConfigured()) {
          deps.showAppleMusicSetupNotice();
          return;
        }
        const query = queryInput.value.trim();
        if (appleMusicSearchMode === "album") {
          hideAppleMusicAlbumTracksPane();
          await deps.runProviderSearch(
            "applemusic",
            query,
            (results) => {
              activeAppleMusicAlbumResults = results;
              renderAppleMusicSearchResults();
            },
            { type: "album" }
          );
          return;
        }
        hideAppleMusicAlbumTracksPane();
        await deps.runProviderSearch("applemusic", query, (results) => {
          activeAppleMusicResults = results;
          renderAppleMusicSearchResults();
        });
      });
      queryInput.addEventListener("input", () => {
        if (queryInput.value.trim()) return;
        activeAppleMusicResults = [];
        activeAppleMusicAlbumResults = [];
        hideAppleMusicAlbumTracksPane();
        renderAppleMusicSearchResults();
      });
    }

    el("appleMusicAlbumBack")?.addEventListener("click", () => hideAppleMusicAlbumTracksPane());
    el("appleMusicAlbumQueueAll")?.addEventListener("click", () => void queueAppleMusicAlbumTracks());
    el("appleMusicLibraryFilter")?.addEventListener("input", () => renderAppleMusicLibraryRows());
    el("appleMusicPlaylistTrackFilter")?.addEventListener("input", () => {
      appleMusicPlaylistBrowser.trackFilterQuery = el("appleMusicPlaylistTrackFilter")?.value || "";
      renderAppleMusicPlaylistTracks();
    });
    el("appleMusicPlaylistPlay")?.addEventListener("click", () => void playAppleMusicPlaylist());
    el("appleMusicPlaylistShufflePlay")?.addEventListener("click", () => void shufflePlayAppleMusicPlaylist());
    const sortHost = el("appleMusicPlaylistTrackSort");
    if (sortHost) {
      sortHost.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-track-sort]");
        if (!btn || !sortHost.contains(btn)) return;
        const nextMode = btn.dataset.trackSort === "oldest" ? "oldest" : "newest";
        appleMusicPlaylistBrowser.trackSortMode = nextMode;
        sortHost.querySelectorAll("[data-track-sort]").forEach((node) => {
          const selected = node.dataset.trackSort === nextMode;
          node.classList.toggle("is-selected", selected);
          node.setAttribute("aria-selected", selected ? "true" : "false");
        });
        renderAppleMusicPlaylistTracks();
      });
    }
    el("appleMusicPlaylistsMore")?.addEventListener("click", async () => {
      const btn = el("appleMusicPlaylistsMore");
      if (!btn || appleMusicPlaylistBrowser.ownedNextOffset === null) return;
      btn.disabled = true;
      try {
        const data = await fetchAppleMusicLibraryPage(
          appleMusicPlaylistBrowser.ownedNextOffset,
          appleMusicPlaylistBrowser.likedNextOffset || 0
        );
        appleMusicPlaylistBrowser.ownedItems.push(...(data.owned?.items || []));
        appleMusicPlaylistBrowser.ownedNextOffset =
          data.owned?.nextOffset === null || data.owned?.nextOffset === undefined
            ? null
            : data.owned.nextOffset;
        renderAppleMusicLibraryRows();
      } catch (e) {
        deps.alertUnlessAuthNotice("applemusic", e.message, "Load more failed");
      } finally {
        btn.disabled = false;
      }
    });
    el("appleMusicLikedPlaylistsMore")?.addEventListener("click", async () => {
      const btn = el("appleMusicLikedPlaylistsMore");
      if (!btn || appleMusicPlaylistBrowser.likedNextOffset === null) return;
      btn.disabled = true;
      try {
        const data = await fetchAppleMusicLibraryPage(
          appleMusicPlaylistBrowser.ownedNextOffset || 0,
          appleMusicPlaylistBrowser.likedNextOffset
        );
        appleMusicPlaylistBrowser.likedItems.push(...(data.likedPlaylists?.items || []));
        appleMusicPlaylistBrowser.likedNextOffset =
          data.likedPlaylists?.nextOffset === null || data.likedPlaylists?.nextOffset === undefined
            ? null
            : data.likedPlaylists.nextOffset;
        renderAppleMusicLibraryRows();
      } catch (e) {
        deps.alertUnlessAuthNotice("applemusic", e.message, "Load more failed");
      } finally {
        btn.disabled = false;
      }
    });
    el("appleMusicTracksMore")?.addEventListener("click", async () => {
      const btn = el("appleMusicTracksMore");
      const pid = appleMusicPlaylistBrowser.selectedPlaylistId;
      if (!btn || !pid || appleMusicPlaylistBrowser.tracksNextOffset === null) return;
      btn.disabled = true;
      try {
        const data = await fetchAppleMusicPlaylistTracksPage(
          pid,
          appleMusicPlaylistBrowser.tracksNextOffset
        );
        appleMusicPlaylistBrowser.tracks.push(...(data.items || []));
        appleMusicPlaylistBrowser.tracksNextOffset = data.nextOffset ?? null;
        renderAppleMusicPlaylistTracks();
        btn.hidden = appleMusicPlaylistBrowser.tracksNextOffset === null;
      } catch (e) {
        deps.alertUnlessAuthNotice("applemusic", e.message, "Load more failed");
      } finally {
        btn.disabled = false;
      }
    });
    el("appleMusicAlbumTracksMore")?.addEventListener("click", async () => {
      const btn = el("appleMusicAlbumTracksMore");
      const aid = appleMusicAlbumBrowser.selectedId;
      if (!btn || !aid || appleMusicAlbumBrowser.tracksNextOffset === null) return;
      btn.disabled = true;
      try {
        const data = await fetchAppleMusicAlbumTracksPage(aid, appleMusicAlbumBrowser.tracksNextOffset);
        appleMusicAlbumBrowser.tracks.push(...(data.items || []));
        appleMusicAlbumBrowser.tracksNextOffset = data.nextOffset ?? null;
        deps.renderTrackList(el("appleMusicAlbumTracks"), appleMusicAlbumBrowser.tracks);
        btn.hidden = appleMusicAlbumBrowser.tracksNextOffset === null;
        updateAppleMusicAlbumQueueAllButton();
      } catch (e) {
        deps.alertUnlessAuthNotice("applemusic", e.message, "Load more failed");
      } finally {
        btn.disabled = false;
      }
    });
  };

  globalThis.unifyAppleMusicBrowse = {
    badgeSrc: APPLE_BADGE,
    init(injectedDeps) {
      deps = injectedDeps;
      bindEvents();
      void fetchAppleMusicConfig();
    },
    fetchConfig: fetchAppleMusicConfig,
    isConfigured: isAppleMusicConfigured,
    setupMessage: appleMusicSetupMessage,
    bootstrap: bootstrapAppleMusicPlaylistBrowser,
    hideAlbumPane: hideAppleMusicAlbumTracksPane,
    openAlbum: async (album) => {
      if (!album?.id) return;
      appleMusicAlbumBrowser.selectedId = album.id;
      appleMusicAlbumBrowser.selectedTitle = album.name || "Album";
      appleMusicAlbumBrowser.selectedAlbum = album;
      appleMusicAlbumBrowser.tracks = [];
      appleMusicAlbumBrowser.tracksNextOffset = null;
      const panel = el("appleMusicAlbumTracksPanel");
      const browse = el("appleMusicSearchBrowse");
      const lib = document.querySelector(".applemusic-library-split");
      if (panel) panel.hidden = false;
      if (browse) browse.hidden = true;
      if (lib) lib.hidden = true;
      const heroTitle = el("appleMusicAlbumHeroTitle");
      const heroMeta = el("appleMusicAlbumHeroMeta");
      if (heroTitle) heroTitle.textContent = album.name || "";
      if (heroMeta) heroMeta.textContent = deps.formatAlbumSearchSubtitle(album);
      const loading = el("appleMusicAlbumTracksLoading");
      if (loading) {
        loading.hidden = false;
        loading.setAttribute("aria-hidden", "false");
      }
      try {
        const data = await fetchAppleMusicAlbumTracksPage(album.id, 0);
        appleMusicAlbumBrowser.tracks = data.items || [];
        appleMusicAlbumBrowser.tracksNextOffset = data.nextOffset ?? null;
        deps.renderTrackList(el("appleMusicAlbumTracks"), appleMusicAlbumBrowser.tracks);
        const more = el("appleMusicAlbumTracksMore");
        if (more) more.hidden = appleMusicAlbumBrowser.tracksNextOffset === null;
        updateAppleMusicAlbumQueueAllButton();
      } catch (e) {
        deps.alertUnlessAuthNotice("applemusic", e.message, "Could not load album");
      } finally {
        if (loading) {
          loading.hidden = true;
          loading.setAttribute("aria-hidden", "true");
        }
        updateAppleMusicAlbumQueueAllButton();
      }
    },
    queueAlbum: queueAppleMusicAlbumTracks
  };
})();
