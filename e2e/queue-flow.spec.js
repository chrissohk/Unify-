const { test, expect } = require("@playwright/test");

test.describe("unified queue", () => {
  test.beforeEach(async ({ request }) => {
    await request.post("/api/test/reset");
  });

  test("connect, queue two providers, reorder swaps order", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("connect-spotify").click();
    await page.getByTestId("connect-soundcloud").click();

    await page.locator("#searchProvider").selectOption("spotify");
    await page.getByRole("button", { name: "Search" }).click();
    await page.waitForSelector('[data-testid="search-queue"]');
    await page.getByTestId("search-queue").first().click();

    await page.locator("#searchProvider").selectOption("soundcloud");
    await page.getByRole("button", { name: "Search" }).click();
    await page.waitForSelector('[data-testid="search-queue"]');
    await page.getByTestId("search-queue").first().click();

    const items = page.locator("#queueList li");
    await expect(items).toHaveCount(2);

    await expect(items.nth(0)).toContainText("[spotify]");
    await expect(items.nth(1)).toContainText("[soundcloud]");

    await page.getByTestId("queue-up-1").click();

    await expect(items.nth(0)).toContainText("[soundcloud]");
    await expect(items.nth(1)).toContainText("[spotify]");
  });

  test("next up shows when two tracks queued", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("connect-spotify").click();
    await page.locator("#searchProvider").selectOption("spotify");
    await page.getByRole("button", { name: "Search" }).click();
    await page.waitForSelector('[data-testid="search-queue"]');
    await page.getByTestId("search-queue").first().click();
    await page.waitForSelector('[data-testid="search-queue"]');
    await page.getByTestId("search-queue").nth(1).click();

    const next = page.locator("#nextUpText");
    await expect(next).not.toHaveText("");
    await expect(next).toHaveText(/Next up:|Starts with:/);
  });
});
