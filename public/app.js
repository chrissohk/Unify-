const providerControls = document.getElementById("providerControls");
const searchForm = document.getElementById("searchForm");
const searchProvider = document.getElementById("searchProvider");
const searchQuery = document.getElementById("searchQuery");
const searchResults = document.getElementById("searchResults");
const queueList = document.getElementById("queueList");
const queueStatusText = document.getElementById("queueStatusText");
const nextUpText = document.getElementById("nextUpText");
const nowPlayingText = document.getElementById("nowPlayingText");
const playerHost = document.getElementById("playerHost");

let providers = [];
let queueState = { queue: [], currentIndex: -1, status: "idle" };
let activeTimer = null;
let activeResults = [];
let reorderInFlight = false;

const clearActiveTimer = () => {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
};

const setNowPlayingIndex = async (index, reason = "manual-select") => {
  await fetch("/api/queue/now-playing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index, reason })
  });
};

const fetchProviders = async () => {
  const res = await fetch("/api/providers");
  providers = await res.json();
  renderProviders();
};

const fetchQueueState = async () => {
  const res = await fetch("/api/queue");
  queueState = await res.json();
  renderNowPlaying();
  renderNextUp();
  renderQueue();
};

const reorderItem = async (fromIndex, toIndex) => {
  if (reorderInFlight) return;
  reorderInFlight = true;
  renderQueue();
  try {
    const response = await fetch("/api/queue/reorder", {
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

const renderNextUp = () => {
  const q = queueState.queue;
  const cur = queueState.currentIndex;
  if (!nextUpText) return;
  if (q.length < 2) {
    nextUpText.textContent = "";
    return;
  }
  if (cur >= 0 && cur < q.length - 1) {
    const next = q[cur + 1];
    nextUpText.textContent = `Next up: ${next.title} - ${next.artist} [${next.provider}]`;
    return;
  }
  if (cur >= 0 && cur === q.length - 1) {
    nextUpText.textContent = "Next up: — (end of queue)";
    return;
  }
  nextUpText.textContent = `Starts with: ${q[0].title} - ${q[0].artist} [${q[0].provider}] — then ${q[1].title}`;
};

const trackEmbed = (item) => {
  if (item.provider === "spotify") {
    return `<iframe allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" src="https://open.spotify.com/embed/track/11dFghVXANMlKmJXsNCbNl?utm_source=generator"></iframe>`;
  }
  return `<iframe allow="autoplay" src="https://w.soundcloud.com/player/?url=${encodeURIComponent("https://soundcloud.com/forss/flickermood")}&auto_play=true"></iframe>`;
};

const advanceTrack = async (reason) => {
  const res = await fetch("/api/playback/advance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason })
  });
  const data = await res.json();
  queueState = data;
  renderNowPlaying();
  renderNextUp();
  renderQueue();
  scheduleAutoAdvance();
};

const scheduleAutoAdvance = () => {
  clearActiveTimer();
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) return;
  const item = queueState.queue[idx];
  activeTimer = setTimeout(() => {
    advanceTrack("timer-fallback");
  }, Number(item.durationSec || 180) * 1000);
};

const playIndex = async (index) => {
  clearActiveTimer();
  if (index < 0 || index >= queueState.queue.length) {
    await setNowPlayingIndex(-1, "manual-end");
    await fetchQueueState();
    return;
  }

  await setNowPlayingIndex(index);
  await fetchQueueState();
  scheduleAutoAdvance();
};

const renderQueue = () => {
  queueList.innerHTML = "";
  const queue = queueState.queue;
  const nowPlayingIndex = queueState.currentIndex;
  queueStatusText.textContent = `Status: ${queueState.status}`;

  queue.forEach((item, idx) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${idx + 1}. ${item.title} - ${item.artist} [${item.provider}]`;
    if (idx === nowPlayingIndex) {
      label.style.color = "#1db954";
      label.textContent += " (now playing)";
    }

    const actions = document.createElement("div");
    actions.className = "actions";

    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.onclick = () => playIndex(idx);

    const upButton = document.createElement("button");
    upButton.textContent = "Up";
    upButton.setAttribute("data-testid", `queue-up-${idx}`);
    upButton.disabled = reorderInFlight || idx === 0;
    upButton.onclick = () => reorderItem(idx, idx - 1);

    const downButton = document.createElement("button");
    downButton.textContent = "Down";
    downButton.setAttribute("data-testid", `queue-down-${idx}`);
    downButton.disabled = reorderInFlight || idx === queue.length - 1;
    downButton.onclick = () => reorderItem(idx, idx + 1);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = async () => {
      await fetch(`/api/queue/${item.id}`, { method: "DELETE" });
      if (idx === nowPlayingIndex) {
        playIndex(idx);
      } else {
        await fetchQueueState();
      }
    };

    actions.appendChild(playButton);
    actions.appendChild(upButton);
    actions.appendChild(downButton);
    actions.appendChild(removeButton);

    li.appendChild(label);
    li.appendChild(actions);
    queueList.appendChild(li);
  });
};

const renderNowPlaying = () => {
  const idx = queueState.currentIndex;
  if (idx < 0 || idx >= queueState.queue.length) {
    nowPlayingText.textContent = queueState.status === "finished" ? "Queue ended." : "Nothing playing.";
    playerHost.innerHTML = "";
    return;
  }
  const item = queueState.queue[idx];
  nowPlayingText.textContent = `Playing: ${item.title} (${item.provider})`;
  playerHost.innerHTML = trackEmbed(item);
};

const renderProviders = () => {
  providerControls.innerHTML = "";
  providers.forEach((providerState) => {
    const row = document.createElement("div");
    row.className = "provider-row";
    const text = document.createElement("span");
    text.textContent = `${providerState.provider}: ${providerState.connected ? "connected" : "disconnected"}`;
    const button = document.createElement("button");
    button.textContent = providerState.connected ? "Disconnect" : "Connect";
    button.setAttribute("data-testid", `connect-${providerState.provider}`);
    button.onclick = async () => {
      const action = providerState.connected ? "disconnect" : "connect";
      await fetch(`/api/auth/${providerState.provider}/${action}`, { method: "POST" });
      await fetchProviders();
    };
    row.appendChild(text);
    row.appendChild(button);
    providerControls.appendChild(row);
  });
};

const renderSearchResults = () => {
  searchResults.innerHTML = "";
  activeResults.forEach((track) => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${track.title} - ${track.artist} (${track.durationSec}s)`;
    const button = document.createElement("button");
    button.textContent = "Queue";
    button.setAttribute("data-testid", "search-queue");
    button.onclick = async () => {
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: track.provider, trackId: track.id })
      });
      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Unable to queue track");
        return;
      }
      await fetchQueueState();
      if (queueState.currentIndex === -1 && queueState.queue.length > 0) {
        playIndex(0);
      }
    };
    li.appendChild(text);
    li.appendChild(button);
    searchResults.appendChild(li);
  });
};

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const provider = searchProvider.value;
  const query = searchQuery.value.trim();
  const response = await fetch(`/api/provider/${provider}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const err = await response.json();
    alert(err.error || "Search failed");
    activeResults = [];
    renderSearchResults();
    return;
  }
  const data = await response.json();
  activeResults = data.results || [];
  renderSearchResults();
});

Promise.all([fetchProviders(), fetchQueueState()]);
