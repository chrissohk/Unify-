const express = require("express");
const path = require("path");
const { reorderWithCursor } = require("./lib/reorderQueue");
const { isTestResetAllowed } = require("./lib/testReset");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const providers = {
  spotify: {
    capabilities: {
      search: true,
      libraryAccess: true,
      playbackControl: true,
      trackEndEvents: false,
      pauseResume: true
    },
    tracks: [
      { id: "sp-1", title: "Neon Skyline", artist: "Astra", durationSec: 210 },
      { id: "sp-2", title: "Midnight Drive", artist: "Pulse Engine", durationSec: 195 },
      { id: "sp-3", title: "Echo Chamber", artist: "Nova Lines", durationSec: 240 }
    ]
  },
  soundcloud: {
    capabilities: {
      search: true,
      libraryAccess: true,
      playbackControl: true,
      trackEndEvents: true,
      pauseResume: true
    },
    tracks: [
      { id: "sc-1", title: "Ocean Tape", artist: "Kite Theory", durationSec: 205 },
      { id: "sc-2", title: "City Static", artist: "Wave Cartel", durationSec: 188 },
      { id: "sc-3", title: "Afterglow Mix", artist: "Low Orbit", durationSec: 222 }
    ]
  }
};

const sessions = {
  spotify: { connected: false, expiresAt: null, refreshFailures: 0 },
  soundcloud: { connected: false, expiresAt: null, refreshFailures: 0 }
};

let queueState = {
  queue: [],
  currentIndex: -1,
  status: "idle",
  lastError: null,
  transitionReason: null
};

const nowSec = () => Math.floor(Date.now() / 1000);

const randomFail = (chance = 0.05) => {
  if (process.env.NODE_ENV === "test") {
    return false;
  }
  return Math.random() < chance;
};

const setQueueState = (next) => {
  queueState = { ...queueState, ...next };
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
};

const ensureConnected = (provider) => {
  const session = sessions[provider];
  if (!session || !session.connected) {
    return { ok: false, code: "PROVIDER_NOT_CONNECTED", message: `${provider} is not connected` };
  }
  if (session.expiresAt && session.expiresAt <= nowSec()) {
    // Simulate silent refresh with bounded retries.
    for (let i = 0; i < 2; i += 1) {
      if (!randomFail(0.2)) {
        session.expiresAt = nowSec() + 3600;
        session.refreshFailures = 0;
        return { ok: true };
      }
      session.refreshFailures += 1;
    }
    return { ok: false, code: "TOKEN_REFRESH_FAILED", message: `Reconnect ${provider} account` };
  }
  return { ok: true };
};

const ensureCapability = (provider, capability) => {
  const spec = providers[provider];
  if (!spec) {
    return { ok: false, code: "PROVIDER_UNKNOWN", message: `${provider} provider is unknown` };
  }
  if (!spec.capabilities[capability]) {
    return {
      ok: false,
      code: "CAPABILITY_NOT_SUPPORTED",
      message: `${provider} does not support ${capability}`
    };
  }
  return { ok: true };
};

app.get("/api/providers", (_req, res) => {
  const data = Object.entries(providers).map(([provider, spec]) => ({
    provider,
    capabilities: spec.capabilities,
    connected: sessions[provider].connected,
    expiresAt: sessions[provider].expiresAt
  }));
  return res.json(data);
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
  return res.json({ provider, connected: false, status: "disconnected" });
});

app.get("/api/provider/:provider/search", (req, res) => {
  const { provider } = req.params;
  const query = (req.query.q || "").toString().trim().toLowerCase();

  const connectCheck = ensureConnected(provider);
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const capabilityCheck = ensureCapability(provider, "search");
  if (!capabilityCheck.ok) {
    return res.status(400).json({ error: capabilityCheck.message, code: capabilityCheck.code });
  }

  if (randomFail(0.08)) {
    return res.status(429).json({ error: `${provider} rate limit`, code: "PROVIDER_RATE_LIMIT" });
  }

  const results = providers[provider].tracks
    .filter((track) => {
      if (!query) return true;
      return track.title.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query);
    })
    .map((track) => ({ ...track, provider }));

  return res.json({ provider, results });
});

app.get("/api/queue", (_req, res) => {
  res.json(queueState);
});

app.post("/api/queue", (req, res) => {
  const { provider, trackId } = req.body || {};

  if (!provider || !trackId) {
    return res.status(400).json({ error: "provider and trackId are required" });
  }

  const connectCheck = ensureConnected(provider);
  if (!connectCheck.ok) {
    return res.status(401).json({ error: connectCheck.message, code: connectCheck.code });
  }

  const capabilityCheck = ensureCapability(provider, "libraryAccess");
  if (!capabilityCheck.ok) {
    return res.status(400).json({ error: capabilityCheck.message, code: capabilityCheck.code });
  }

  const found = providers[provider].tracks.find((t) => t.id === trackId);
  if (!found) {
    return res.status(404).json({ error: "track not found for provider" });
  }

  const queueItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    provider,
    trackId: found.id,
    title: found.title,
    artist: found.artist,
    durationSec: found.durationSec,
    status: "queued"
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

  const nextQueue = queueState.queue.filter((q) => q.id !== req.params.id);
  let nextIndex = queueState.currentIndex;
  if (queueState.currentIndex === idx) nextIndex = -1;
  if (idx < queueState.currentIndex) nextIndex -= 1;

  setQueueState({
    queue: nextQueue,
    currentIndex: Math.max(-1, nextIndex),
    status: nextQueue.length === 0 ? "idle" : queueState.status
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

  const nextQueue = queueState.queue.map((item, i) => ({
    ...item,
    status: i === idx ? "playing" : "queued"
  }));

  setQueueState({
    queue: nextQueue,
    currentIndex: idx,
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

  const nextIndex = queueState.currentIndex + 1;
  if (nextIndex >= queueState.queue.length) {
    setQueueState({
      currentIndex: -1,
      status: "finished",
      transitionReason: reason || "queue-end"
    });
    return res.json(queueState);
  }

  const nextItem = queueState.queue[nextIndex];
  const connectCheck = ensureConnected(nextItem.provider);
  if (!connectCheck.ok) {
    setQueueState({
      status: "recovering",
      lastError: { code: connectCheck.code, message: connectCheck.message },
      transitionReason: "recovering-connection"
    });
    return res.status(401).json(queueState);
  }

  const capabilityCheck = ensureCapability(nextItem.provider, "playbackControl");
  if (!capabilityCheck.ok) {
    setQueueState({
      status: "skipped",
      lastError: { code: capabilityCheck.code, message: capabilityCheck.message },
      transitionReason: "capability-skip",
      currentIndex: nextIndex
    });
    return res.status(400).json(queueState);
  }

  const nextQueue = queueState.queue.map((item, i) => ({
    ...item,
    status: i === nextIndex ? "playing" : "queued"
  }));
  setQueueState({
    queue: nextQueue,
    currentIndex: nextIndex,
    status: "playing",
    transitionReason: reason || "auto-advance",
    lastError: null
  });
  return res.json(queueState);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Unified queue MVP running at http://localhost:${PORT}`);
  });
}

module.exports = app;
