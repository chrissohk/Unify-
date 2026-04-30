// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3456",
    trace: "on-first-retry"
  },
  webServer: {
    command: "cross-env NODE_ENV=test PORT=3456 node server.js",
    url: "http://127.0.0.1:3456",
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
