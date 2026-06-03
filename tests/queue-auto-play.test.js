"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { resolveAutoPlayIndexAfterQueue } = require("../lib/reorderQueue");

test("resolveAutoPlayIndexAfterQueue returns -1 when something is playing", () => {
  const queue = [{ id: "a" }, { id: "b" }];
  assert.equal(resolveAutoPlayIndexAfterQueue(queue, 0, "b"), -1);
});

test("resolveAutoPlayIndexAfterQueue returns matching index when idle", () => {
  const queue = [{ id: "a" }, { id: "b" }];
  assert.equal(resolveAutoPlayIndexAfterQueue(queue, -1, "b"), 1);
});

test("resolveAutoPlayIndexAfterQueue returns last index when id not found but idle", () => {
  const queue = [{ id: "a" }, { id: "b" }];
  assert.equal(resolveAutoPlayIndexAfterQueue(queue, -1, "missing"), 1);
});

test("resolveAutoPlayIndexAfterQueue returns -1 for empty queue", () => {
  assert.equal(resolveAutoPlayIndexAfterQueue([], -1, "x"), -1);
});

test("public queueAutoPlay helper matches lib", () => {
  const { resolveAutoPlayIndexAfterQueue: fromPublic } = require("../public/queueAutoPlay.js");
  const queue = [{ id: "old" }, { id: "new" }];
  assert.equal(fromPublic(queue, -1, "new"), 1);
  assert.equal(
    fromPublic(queue, -1, "new"),
    resolveAutoPlayIndexAfterQueue(queue, -1, "new")
  );
});

test("POST /api/queue while idle appends track without moving cursor", async (t) => {
  if (process.env.NODE_ENV !== "test") {
    t.skip("requires NODE_ENV=test");
    return;
  }
  const request = require("supertest");
  const app = require("../server");
  await request(app).post("/api/test/reset").expect(204);
  await request(app).post("/api/auth/spotify/connect").expect(200);

  let state = await request(app).get("/api/queue").expect(200);
  assert.equal(state.body.currentIndex, -1);

  const created = await request(app)
    .post("/api/queue")
    .send({ provider: "spotify", trackId: "sp-1" })
    .expect(201);

  state = await request(app).get("/api/queue").expect(200);
  const lastIndex = state.body.queue.length - 1;
  assert.equal(state.body.currentIndex, -1);
  assert.equal(state.body.status, "ready");
  assert.equal(state.body.queue[lastIndex].id, created.body.id);
  assert.equal(state.body.queue[lastIndex].status, "queued");
});

test("POST /api/queue while playing does not change currentIndex", async (t) => {
  if (process.env.NODE_ENV !== "test") {
    t.skip("requires NODE_ENV=test");
    return;
  }
  const request = require("supertest");
  const app = require("../server");
  await request(app).post("/api/test/reset").expect(204);
  await request(app).post("/api/auth/spotify/connect").expect(200);

  await request(app).post("/api/queue").send({ provider: "spotify", trackId: "sp-1" }).expect(201);
  await request(app).post("/api/queue/now-playing").send({ index: 0 }).expect(200);

  await request(app).post("/api/queue").send({ provider: "spotify", trackId: "sp-2" }).expect(201);

  const state = await request(app).get("/api/queue").expect(200);
  assert.equal(state.body.currentIndex, 0);
  assert.equal(state.body.queue[0].trackId, "sp-1");
});
