const { test, mock } = require("node:test");
const assert = require("node:assert/strict");

const spotifyWebApi = require("../lib/spotifyWebApi");

test("spotifyStartTrack sends position_ms when positionMs provided", async (t) => {
  const sessions = {
    spotify: {
      connected: true,
      accessToken: "tok",
      expiresAt: Math.floor(Date.now() / 1000) + 3600
    }
  };
  const persist = () => {};
  const bodies = [];

  const original = global.fetch;
  t.after(() => {
    global.fetch = original;
  });

  global.fetch = async (_url, init) => {
    if (init?.body) {
      try {
        bodies.push(JSON.parse(init.body));
      } catch (_) {}
    }
    return new Response(null, { status: 204 });
  };

  const result = await spotifyWebApi.spotifyStartTrack({
    sessions,
    persist,
    deviceId: "dev-1",
    trackId: "track-99",
    positionMs: 125000
  });

  assert.equal(result.ok, true);
  const playBody = bodies.find((b) => Array.isArray(b.uris));
  assert.ok(playBody, "expected play request body");
  assert.equal(playBody.position_ms, 125000);
  assert.deepEqual(playBody.uris, ["spotify:track:track-99"]);
});
