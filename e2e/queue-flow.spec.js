const { test, expect } = require("@playwright/test");

test.describe("unified queue", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/test/reset");
  });

  test("queue two providers via API, reorder swaps up-next order", async ({ page, request }) => {
    await request.post("/api/auth/spotify/connect");
    await request.post("/api/auth/soundcloud/connect");
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-1" } });
    await request.post("/api/queue", { data: { provider: "soundcloud", trackId: "sc-1" } });

    await page.goto("/");
    await page.getByTestId("tab-now-playing").click();

    const items = page.locator("#queueList li.queue-row");
    await expect(items).toHaveCount(2);

    await expect(items.nth(0).getByTestId("queue-provider-spotify")).toBeVisible();
    await expect(items.nth(1).getByTestId("queue-provider-soundcloud")).toBeVisible();

    await page.getByTestId("queue-drag-handle-1").dragTo(page.getByTestId("queue-row-0"));

    await expect(items.nth(0).getByTestId("queue-provider-soundcloud")).toBeVisible();
    await expect(items.nth(1).getByTestId("queue-provider-spotify")).toBeVisible();
  });

  test("remove now playing skips to next track", async ({ page, request }) => {
    await request.post("/api/auth/spotify/connect");
    await request.post("/api/auth/soundcloud/connect");
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-1" } });
    await request.post("/api/queue", { data: { provider: "soundcloud", trackId: "sc-1" } });
    await request.post("/api/queue/now-playing", { data: { index: 0 } });

    await page.goto("/");
    await page.getByTestId("tab-now-playing").click();

    await expect(page.getByTestId("now-playing-remove")).toBeVisible();
    await page.getByTestId("now-playing-remove").click();

    await expect(page.getByTestId("queue-provider-soundcloud")).toBeVisible();
    await expect(page.locator("#queueList li.queue-row")).toHaveCount(0);
  });

  test("while playing, up-next hides the current track", async ({ page, request }) => {
    await request.post("/api/auth/spotify/connect");
    await request.post("/api/auth/soundcloud/connect");
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-1" } });
    await request.post("/api/queue", { data: { provider: "soundcloud", trackId: "sc-1" } });
    await request.post("/api/queue/now-playing", { data: { index: 0 } });

    await page.goto("/");
    await page.getByTestId("tab-now-playing").click();

    const ticker = page.getByTestId("tab-now-playing-ticker");
    await expect(ticker).toBeVisible();
    await expect(ticker).toContainText(" - ");

    const rows = page.locator("#queueList li.queue-row");
    await expect(rows).toHaveCount(1);
    await expect(rows.nth(0).getByTestId("queue-provider-soundcloud")).toBeVisible();
  });

  test("play later up-next row keeps other tracks visible", async ({ page, request }) => {
    await request.post("/api/auth/spotify/connect");
    await request.post("/api/auth/soundcloud/connect");
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-1" } });
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-2" } });
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-3" } });
    await request.post("/api/queue", { data: { provider: "soundcloud", trackId: "sc-1" } });
    await request.post("/api/queue/now-playing", { data: { index: 0 } });

    await page.goto("/");
    await page.getByTestId("tab-now-playing").click();

    const rows = page.locator("#queueList li.queue-row");
    await expect(rows).toHaveCount(3);

    await rows.nth(2).getByRole("button", { name: "Play" }).click();

    await expect(page.locator("#queueList li.queue-row")).toHaveCount(2);

    const stateRes = await request.get("/api/queue");
    expect(stateRes.ok()).toBeTruthy();
    const state = await stateRes.json();
    expect(state.queue).toHaveLength(3);
    expect(state.currentIndex).toBe(0);
    expect(state.queue[0].trackId).toBe("sc-1");
  });

  test("shows up-next rows when nothing is playing", async ({ page, request }) => {
    await request.post("/api/auth/spotify/connect");
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-1" } });
    await request.post("/api/queue", { data: { provider: "spotify", trackId: "sp-2" } });

    await page.goto("/");
    await page.getByTestId("tab-now-playing").click();

    await expect(page.getByRole("heading", { name: "Up next" })).toBeVisible();
    await expect(page.locator("#queueStatusText")).toHaveCount(0);
    await expect(page.locator("#nextUpText")).toHaveCount(0);
    await expect(page.locator("#queueList li.queue-row")).toHaveCount(2);
  });
});
