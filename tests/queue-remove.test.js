const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const {
  canRemoveQueueItemAt,
  removeQueueItemAt,
  pruneQueueAfterLeavingTrack,
  mapQueueAfterPrune,
  mapQueueForNowPlaying,
  resolveEffectiveCurrentIndex,
  selectNowPlayingWithReorder,
  upcomingQueueEntries
} = require("../lib/reorderQueue");

const app = require("../server");

beforeEach(async () => {
  await request(app).post("/api/test/reset").expect(204);
});

const connectProvider = async (provider) => {
  await request(app).post(`/api/auth/${provider}/connect`).expect(200);
};

const addTrack = async (provider, trackId) => {
  const response = await request(app).post("/api/queue").send({ provider, trackId }).expect(201);
  return response.body;
};

test("upcomingQueueEntries excludes current index when playing", () => {
  const queue = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.equal(upcomingQueueEntries(queue, -1).length, 3);
  assert.deepEqual(
    upcomingQueueEntries(queue, 0).map((e) => e.idx),
    [1, 2]
  );
  assert.deepEqual(
    upcomingQueueEntries(queue, 2).map((e) => e.idx),
    [0, 1]
  );
});

test("canRemoveQueueItemAt allows any row", () => {
  assert.equal(canRemoveQueueItemAt({ status: "played" }, 0, { currentIndex: 2, status: "playing" }), true);
  assert.equal(canRemoveQueueItemAt({ status: "queued" }, 1, { currentIndex: 2, status: "playing" }), true);
  assert.equal(canRemoveQueueItemAt({ status: "playing" }, 2, { currentIndex: 2, status: "playing" }), true);
});

test("removeQueueItemAt drops upcoming row without moving cursor", () => {
  const queue = [
    { id: "a", status: "playing" },
    { id: "b", status: "queued" },
    { id: "c", status: "queued" }
  ];
  const result = removeQueueItemAt(queue, 2, 0);
  assert.equal(result.ok, true);
  assert.equal(result.nextQueue.length, 2);
  assert.equal(result.nextCurrentIndex, 0);
  assert.equal(result.nextQueue[0].status, "playing");
  assert.equal(result.nextQueue[1].id, "b");
});

test("removeQueueItemAt advances cursor when now playing row is removed", () => {
  const queue = [
    { id: "a", status: "playing" },
    { id: "b", status: "queued" }
  ];
  const result = removeQueueItemAt(queue, 0, 0);
  assert.equal(result.removedPlaying, true);
  assert.equal(result.nextCurrentIndex, 0);
  assert.equal(result.nextQueue[0].id, "b");
  assert.equal(result.nextQueue[0].status, "playing");
});

test("pruneQueueAfterLeavingTrack removes completed row and slides cursor", () => {
  const queue = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const mid = pruneQueueAfterLeavingTrack(queue, 0);
  assert.equal(mid.nextQueue.length, 2);
  assert.equal(mid.nextCurrentIndex, 0);
  assert.equal(mid.queueEnded, false);
  assert.equal(mid.nextQueue[0].id, "b");

  const end = pruneQueueAfterLeavingTrack([{ id: "a" }], 0);
  assert.equal(end.nextQueue.length, 0);
  assert.equal(end.nextCurrentIndex, -1);
  assert.equal(end.queueEnded, true);
});

test("mapQueueForNowPlaying preserves played status", () => {
  const queue = [
    { id: "a", status: "played" },
    { id: "b", status: "queued" },
    { id: "c", status: "queued" }
  ];
  const next = mapQueueForNowPlaying(queue, 2);
  assert.equal(next[0].status, "played");
  assert.equal(next[2].status, "playing");
});

test("selectNowPlayingWithReorder moves picked future row to active slot", () => {
  const queue = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" }];
  const result = selectNowPlayingWithReorder(queue, 0, 3);
  assert.deepEqual(
    result.nextQueue.map((x) => x.id),
    ["d", "b", "c", "e"]
  );
  assert.equal(result.nextCurrentIndex, 0);
});

test("resolveEffectiveCurrentIndex uses playing status when cursor is stale", () => {
  const queue = [
    { id: "a", status: "playing" },
    { id: "b", status: "queued" },
    { id: "c", status: "queued" }
  ];
  assert.equal(resolveEffectiveCurrentIndex(queue, -1, "playing"), 0);
});

test("selectNowPlayingWithReorder skips when effective current recovered from status", () => {
  const queue = [
    { id: "a", status: "playing" },
    { id: "b", status: "queued" },
    { id: "c", status: "queued" }
  ];
  const effective = resolveEffectiveCurrentIndex(queue, -1, "playing");
  const result = selectNowPlayingWithReorder(queue, effective, 2);
  assert.deepEqual(
    result.nextQueue.map((x) => x.id),
    ["c", "b"]
  );
  assert.equal(result.nextCurrentIndex, 0);
});

test("selectNowPlayingWithReorder skips current row when playing behind", () => {
  const queue = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const result = selectNowPlayingWithReorder(queue, 2, 0);
  assert.deepEqual(
    result.nextQueue.map((x) => x.id),
    ["a", "b"]
  );
  assert.equal(result.nextCurrentIndex, 0);
});

test("DELETE removes upcoming and current tracks", async () => {
  await connectProvider("spotify");
  const first = await addTrack("spotify", "sp-1");
  const second = await addTrack("spotify", "sp-2");
  const third = await addTrack("spotify", "sp-3");

  await request(app).post("/api/queue/now-playing").send({ index: 1 }).expect(200);

  await request(app).delete(`/api/queue/${third.id}`).expect(204);

  let state = await request(app).get("/api/queue").expect(200);
  assert.equal(state.body.queue.length, 2);
  assert.equal(state.body.currentIndex, 0);
  assert.equal(state.body.queue[0].trackId, "sp-2");

  await request(app).delete(`/api/queue/${second.id}`).expect(204);

  state = await request(app).get("/api/queue").expect(200);
  assert.equal(state.body.queue.length, 1);
  assert.equal(state.body.currentIndex, 0);
  assert.equal(state.body.queue[0].trackId, "sp-1");
  assert.equal(state.body.status, "ready");

  await request(app).delete(`/api/queue/${first.id}`).expect(204);

  state = await request(app).get("/api/queue").expect(200);
  assert.equal(state.body.queue.length, 0);
  assert.equal(state.body.currentIndex, -1);
  assert.equal(state.body.status, "idle");
});

test("advance removes completed track from queue", async () => {
  await connectProvider("spotify");
  const first = await addTrack("spotify", "sp-1");
  await addTrack("spotify", "sp-2");

  await request(app).post("/api/queue/now-playing").send({ index: 0 }).expect(200);
  const advance = await request(app).post("/api/playback/advance").send({ reason: "test" }).expect(200);

  assert.equal(advance.body.queue.length, 1);
  assert.equal(advance.body.currentIndex, 0);
  assert.equal(advance.body.queue[0].trackId, "sp-2");
  assert.notEqual(advance.body.queue[0].id, first.id);

  await request(app).delete(`/api/queue/${first.id}`).expect(404);
});

test("manual select from future skips current track and keeps later queued tracks", async () => {
  await connectProvider("spotify");
  await addTrack("spotify", "sp-1");
  await addTrack("spotify", "sp-2");
  await addTrack("spotify", "sp-3");

  await request(app).post("/api/queue/now-playing").send({ index: 0 }).expect(200);
  await request(app).post("/api/queue/now-playing").send({ index: 2 }).expect(200);

  const state = await request(app).get("/api/queue").expect(200);
  assert.equal(state.body.currentIndex, 0);
  assert.deepEqual(
    state.body.queue.map((q) => q.trackId),
    ["sp-3", "sp-2"]
  );
  assert.equal(state.body.queue[0].status, "playing");
});

test("advance on last track empties queue", async () => {
  await connectProvider("spotify");
  await addTrack("spotify", "sp-1");

  await request(app).post("/api/queue/now-playing").send({ index: 0 }).expect(200);
  await request(app).post("/api/playback/advance").send({ reason: "test" }).expect(200);

  const state = await request(app).get("/api/queue").expect(200);
  assert.equal(state.body.queue.length, 0);
  assert.equal(state.body.currentIndex, -1);
  assert.equal(state.body.status, "idle");
});
