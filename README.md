# Unified Spotify + SoundCloud Queue MVP

This is a lightweight MVP that lets you queue tracks from Spotify and SoundCloud in one list and automatically advance to the next track.

## What works right now

- Connect Spotify and SoundCloud via **OAuth** (your own app credentials in `.env`); mock catalogs work without OAuth for local demos
- **SoundCloud**: with OAuth connected (`SOUNDCLOUD_*` in `.env`), search hits the live SoundCloud API (`/tracks`); otherwise search uses the built-in mock catalog (same as offline demos)
- **SoundCloud library**: on the SoundCloud tab, browse **Likes**, **your playlists**, and **liked playlists** (OAuth required for live data; simulated Connect shows a demo library)
- **Spotify**: with OAuth connected, search uses the Spotify Web API; otherwise mock catalog
- **SQLite persistence** for queue + session flags (see below); survives normal server restarts when not in test mode
- Reorder up-next tracks (`Up`/`Down`); the **Now Playing** panel shows the current track only (not duplicated in the list below)
- **Up next** list shows only tracks after the current one (heading only when the list is empty)
- **Remove** any visible up-next track. Completed tracks are dropped automatically when playback advances
- Start playback from any queue item, auto-advance across providers (timer-based in this MVP)
- Optional OAuth routes: `/api/oauth/spotify/login`, `/api/oauth/soundcloud/login` (requires credentials in `.env`)

## How auto-advance works

- **SoundCloud**: the embedded widget fires a `FINISH` event, which advances the queue; a fallback timer still runs if that event is missed.
- **Spotify** (Web Playback SDK): combines (1) near-end detection on `player_state_changed`, (2) **same-track restart** detection when playback jumps back near the start after the playhead had reached the last seconds (avoids Spotify looping the same URI while the queue already points at the next item), (3) a **wall-clock timer** anchored when the track starts so the fallback advance still fires on time even if SDK position resets to zero, and (4) a timer-only fallback using each queue row’s `durationSec`. User **Pause** clears the wall anchor so a long pause does not fire an advance based on wall time alone; **Resume** re-anchors from the current position.

Provide accurate `durationSec` when queuing tracks so the wall-clock and timer paths stay aligned with real track length.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy [`.env.example`](.env.example) to `.env`. For live search, library, and playback, complete [OAuth setup](#oauth-setup-your-own-api-credentials) below (skip for mock-catalog-only demos).
3. Start server:
   ```bash
   npm start
   ```
4. Open the app **only** at the URL the server listens on (same host and port as the API), e.g. [http://localhost:3000](http://localhost:3000) (or your `PORT`). Do not open `public/index.html` via Live Server, file preview, or another origin unless you use step 5 — by default the UI calls `/api/...` on the **page’s** host, which causes HTTP 404 when that host is not Node. If something fails, DevTools → Network: confirm the request URL matches this server.
5. **Split-origin (optional):** If the HTML is served from another origin than the API, open it once with `?apiBase=http://127.0.0.1:3000` (use your real `npm start` URL; no trailing slash). The client saves this in `sessionStorage` (`queueApiBase`) and prefixes all API requests. Add that page origin to `CORS_ALLOWED_ORIGINS` in `.env` (comma-separated). The UI bootstraps a browser session via `GET /api/meta` before other API calls.

**Security (local MVP):** The server binds to `127.0.0.1` by default (`HOST` in `.env` to override). API routes require a browser session issued by `/api/meta` (cookie on same origin, or `X-Browser-Session` header for split-origin). OAuth access/refresh tokens are kept in memory only and are not written to SQLite; reconnect Spotify/SoundCloud after a server restart if you used real OAuth.

Data is stored under `data/app.db` by default (created automatically). Tests use an in-memory database.

## OAuth setup (your own API credentials)

This project does **not** ship with shared API keys. After you clone the repo, you use **your** Spotify and SoundCloud developer apps and a **local** `.env` file. Nothing in `.env` should ever be committed.

### SoundCloud

1. Register an application in the [SoundCloud developer portal](https://developers.soundcloud.com/).
2. Add a redirect URI that matches your server exactly, for example:
   `http://127.0.0.1:3000/api/oauth/soundcloud/callback`
3. In `.env`, set `SOUNDCLOUD_CLIENT_ID`, `SOUNDCLOUD_CLIENT_SECRET`, and `SOUNDCLOUD_REDIRECT_URI` to the same redirect URI.
4. Restart `npm start`, open the app, and use **Connect** on the SoundCloud tab (starts `/api/oauth/soundcloud/login`).

SoundCloud uses OAuth 2.1 with PKCE; see [Deployment notes](#deployment-notes) for endpoint details.

### Spotify

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add the same redirect URI in the dashboard settings, for example:
   `http://127.0.0.1:3000/api/oauth/spotify/callback`
3. In `.env`, set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REDIRECT_URI`.
4. Optional: override `SPOTIFY_SCOPES` (defaults are documented in `.env.example`).
5. Restart `npm start`, use **Connect** on the Spotify tab (`/api/oauth/spotify/login`).

**Web Playback** requires a **Spotify Premium** account for the user who authorizes the app. Client secrets stay on the server; the browser receives short-lived access tokens via `GET /api/spotify/token`.

### Redirect URI checklist

| Setting | Must match |
|--------|------------|
| `PORT` / URL you open in the browser | Same host and port as in redirect URIs |
| `PUBLIC_BASE_URL` (if set) | Base used for OAuth when behind a proxy |
| Spotify dashboard redirect URIs | `SPOTIFY_REDIRECT_URI` in `.env` |
| SoundCloud app redirect URIs | `SOUNDCLOUD_REDIRECT_URI` in `.env` |

Using `127.0.0.1` vs `localhost` matters: pick one and use it everywhere.

On startup, the server logs whether `SOUNDCLOUD_CLIENT_ID` / `SPOTIFY_CLIENT_ID` are configured.

## Testing

- Unit and API integration tests: `npm test` (sets `NODE_ENV=test` so `/api/test/reset` is allowed and persistence uses memory).
- End-to-end (Playwright): install browsers once with `npx playwright install chromium`, then `npm run test:e2e`.
- Full suite: `npm run test:all`.
- Orchestrator guard scenarios: included in `npm test` via [`tests/orchestrator-harness.test.js`](tests/orchestrator-harness.test.js).

Optional: allow test reset in non-test runs by setting `TEST_RESET_SECRET` and sending header `X-Test-Reset-Secret` with the same value (not needed for local `npm test`).

## Repository and CI

Set your name and email for commits in this repository (or globally):

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

Add a remote when you have a host, then push:

```bash
git remote add origin <your-repository-url>
git push -u origin master
```

On **GitHub**, CI runs on push/PR to `main` or `master`: `npm ci`, `npm test`, and Playwright E2E (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)). CI does not need provider credentials (tests use mock/simulated flows).

### Before you push (secrets)

- Do **not** commit `.env`, `data/app.db`, or any file containing client secrets.
- Confirm `.env` was never tracked: `git log --all --full-history -- .env` (empty output is what you want).
- If `.env` was ever pushed, rotate keys in the Spotify and SoundCloud dashboards and treat the old secrets as compromised.
- Only [`.env.example`](.env.example) belongs in the repo (empty placeholders).

## Deployment notes

- Set `PORT` and, behind a reverse proxy, `PUBLIC_BASE_URL` so OAuth redirect URIs match your app URL.
- Use the same `SPOTIFY_REDIRECT_URI` / `SOUNDCLOUD_REDIRECT_URI` values in the provider developer consoles.
- **SoundCloud OAuth** follows SoundCloud’s OAuth 2.1 guide: authorization at `https://secure.soundcloud.com/authorize` with PKCE (`S256`), token exchange at `https://secure.soundcloud.com/oauth/token`. API requests use `Authorization: OAuth <access_token>` against `https://api.soundcloud.com`.
- Queue state is file-backed; use a persistent volume for `data/` (or set `SQLITE_PATH` to a mounted path).

## Provider policy and OAuth

- See [`docs/COMPLIANCE_MATRIX.md`](docs/COMPLIANCE_MATRIX.md) for capability notes and policy references.
- **Connect** in the UI starts OAuth (`/api/oauth/*/login`) when a provider is disconnected. Simulated sessions (`POST /api/auth/:provider/connect`) exist for automated tests only, not the main Connect button.
- Each deployment must use its own developer apps and `.env`; end users of a public repo run their own server locally with their own credentials.

## v1 constraints

- Single-user queue (one server process)
- Mock search catalogs when OAuth is not configured or you use simulated Connect
- No social/shared queue yet
- No recommendation engine yet

## Next iteration ideas

- Richer provider adapters (error taxonomy, pagination on SoundCloud search only — library browse paginates owned/liked playlists separately)
- Explicit playback state machine and structured telemetry events
- Richer Spotify completion detection with SDK/event integration
- Deeper failure-replay harness around the full playback loop (extend [`lib/orchestratorHarness.js`](lib/orchestratorHarness.js))
