const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

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

test("rejects out-of-range reorder requests", async () => {
  await connectProvider("spotify");
  await addTrack("spotify", "sp-1");

  await request(app)
    .post("/api/queue/reorder")
    .send({ fromIndex: 0, toIndex: 5 })
    .expect(400)
    .expect(({ body }) => {
      assert.equal(body.error, "invalid fromIndex or toIndex");
    });
});

test("supports no-op reorder with explicit response", async () => {
  await connectProvider("soundcloud");
  await addTrack("soundcloud", "sc-1");

  await request(app)
    .post("/api/queue/reorder")
    .send({ fromIndex: 0, toIndex: 0 })
    .expect(200)
    .expect(({ body }) => {
      assert.equal(body.reorderApplied, false);
    });
});

test("keeps now-playing continuity when currently playing item moves", async () => {
  await connectProvider("spotify");
  await connectProvider("soundcloud");

  const first = await addTrack("spotify", "sp-2");
  await addTrack("soundcloud", "sc-2");
  await addTrack("spotify", "sp-3");

  await request(app).post("/api/queue/now-playing").send({ index: 0 }).expect(200);

  const reorder = await request(app)
    .post("/api/queue/reorder")
    .send({ fromIndex: 0, toIndex: 2 })
    .expect(200);

  assert.equal(reorder.body.reorderApplied, true);
  assert.equal(reorder.body.currentIndex, 2);
  assert.equal(reorder.body.queue[2].id, first.id);
  assert.equal(reorder.body.queue[2].status, "playing");
});

test("auto-advance follows updated queue order after reorder", async () => {
  await connectProvider("spotify");
  await connectProvider("soundcloud");

  await addTrack("spotify", "sp-1");
  const second = await addTrack("soundcloud", "sc-3");
  await addTrack("spotify", "sp-2");

  await request(app).post("/api/queue/now-playing").send({ index: 0 }).expect(200);
  await request(app).post("/api/queue/reorder").send({ fromIndex: 2, toIndex: 1 }).expect(200);

  const advance = await request(app).post("/api/playback/advance").send({ reason: "test" }).expect(200);
  assert.equal(advance.body.currentIndex, 1);
  assert.equal(advance.body.queue[1].trackId, "sp-2");
  assert.notEqual(advance.body.queue[1].id, second.id);
});
