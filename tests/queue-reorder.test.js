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
  assert.equal(advance.body.queue.length, 2);
  assert.equal(advance.body.currentIndex, 0);
  assert.equal(advance.body.queue[0].trackId, "sp-2");
  assert.notEqual(advance.body.queue[0].id, second.id);
});

test("queues non-catalog track when metadata is provided", async () => {
  await connectProvider("spotify");

  const response = await request(app)
    .post("/api/queue")
    .send({
      provider: "spotify",
      trackId: "live-spotify-track-id",
      track: {
        id: "live-spotify-track-id",
        title: "Live Track",
        artist: "Live Artist",
        durationSec: 222
      }
    })
    .expect(201);

  assert.equal(response.body.trackId, "live-spotify-track-id");
  assert.equal(response.body.title, "Live Track");
  assert.equal(response.body.artist, "Live Artist");
});

test("rejects non-catalog track when metadata is missing", async () => {
  await connectProvider("spotify");

  await request(app)
    .post("/api/queue")
    .send({ provider: "spotify", trackId: "live-spotify-track-id" })
    .expect(404)
    .expect(({ body }) => {
      assert.equal(body.error, "track not found for provider");
    });
});

test("persists soundcloud permalinkUrl on live queue items", async () => {
  await connectProvider("soundcloud");

  const response = await request(app)
    .post("/api/queue")
    .send({
      provider: "soundcloud",
      trackId: "live-sc",
      track: {
        id: "live-sc",
        title: "T",
        artist: "A",
        durationSec: 60,
        permalinkUrl: "https://soundcloud.com/foo/bar"
      }
    })
    .expect(201);

  assert.equal(response.body.permalinkUrl, "https://soundcloud.com/foo/bar");
});

test("merges imageUrl from request track onto catalog soundcloud match", async () => {
  await connectProvider("soundcloud");

  const response = await request(app)
    .post("/api/queue")
    .send({
      provider: "soundcloud",
      trackId: "sc-2",
      track: {
        id: "sc-2",
        title: "City Static",
        artist: "Wave Cartel",
        durationSec: 188,
        permalinkUrl: "https://soundcloud.com/forss/flickermood",
        imageUrl: "https://i1.sndcdn.com/artworks-merged-t67x67.jpg"
      }
    })
    .expect(201);

  assert.equal(response.body.imageUrl, "https://i1.sndcdn.com/artworks-merged-t67x67.jpg");
});

test("persists soundcloud imageUrl on live queue items", async () => {
  await connectProvider("soundcloud");

  const response = await request(app)
    .post("/api/queue")
    .send({
      provider: "soundcloud",
      trackId: "live-sc-art",
      track: {
        id: "live-sc-art",
        title: "T",
        artist: "A",
        durationSec: 60,
        permalinkUrl: "https://soundcloud.com/foo/bar",
        imageUrl: "https://i1.sndcdn.com/artworks-abc-t67x67.jpg"
      }
    })
    .expect(201);

  assert.equal(response.body.imageUrl, "https://i1.sndcdn.com/artworks-abc-t67x67.jpg");
});

test("rejects soundcloud live track without permalinkUrl", async () => {
  await connectProvider("soundcloud");

  await request(app)
    .post("/api/queue")
    .send({
      provider: "soundcloud",
      trackId: "x",
      track: { id: "x", title: "t", artist: "a", durationSec: 1 }
    })
    .expect(400)
    .expect(({ body }) => {
      assert.equal(body.code, "SOUNDCLOUD_PERMALINK_REQUIRED");
    });
});

test("rejects soundcloud permalinkUrl that is not https soundcloud host", async () => {
  await connectProvider("soundcloud");

  await request(app)
    .post("/api/queue")
    .send({
      provider: "soundcloud",
      trackId: "x",
      track: {
        id: "x",
        title: "t",
        artist: "a",
        durationSec: 1,
        permalinkUrl: "http://evil.example/phish"
      }
    })
    .expect(400);
});
