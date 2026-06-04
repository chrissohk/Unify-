# Unified Spotify + SoundCloud Queue MVP

This is a lightweight MVP that lets you queue tracks from Spotify and SoundCloud in one list and automatically advance to the next track.

**New here?** Start with [Quick start (step by step)](#quick-start-step-by-step) below. Technical details for developers are in [For developers](#for-developers).

**Already set up?** Jump to [Next time (already set up)](#next-time-already-set-up) — no need to clone or reinstall.

---

## Next time (already set up)

If you have already completed the Quick start once, you do **not** need to clone the repo again, reinstall Node.js, or recreate **`.env`** — unless you moved to a new computer or deleted the project folder.

### Start the app

1. Open **PowerShell** (Windows) or **Terminal** (Mac).
2. Go to the **same folder** where you ran setup before (it should contain `package.json`, `.env`, and usually `node_modules`).

   **Windows (PowerShell)** — use the path that matches your machine:
   ```

   If you cloned via Git:

   ```powershell
   cd "$env:USERPROFILE\OneDrive\Desktop\Unify-"
   ```

   **Mac (Terminal):**

   ```bash
   cd ~/Desktop/Unify-
   ```

3. Run "Git pull" if there is an update on the codebase. 

4. Start the server:

   ```bash
   npm start
   ```

   Leave this window **open** while you use the app.

4. Open your browser to **http://127.0.0.1:3000** (do **not** double-click `public/index.html`).

5. Click **Connect** for Spotify and SoundCloud. This is required after each server restart (your queue may still be there, but provider logins must be reconnected).

### You can skip these (one-time setup only)

- Do **not** run `git clone` again
- Do **not** reinstall Node.js
- Do **not** recreate **`.env`** (unless you deleted it or moved the folder)
- Do **not** run `npm install` unless you are updating the project or `node_modules` is missing

### Stop the app

Click the terminal window and press **Ctrl+C**.

### Get updates from GitHub (optional)

Only if you originally used **Git clone** (Step 2 Option A) and want the latest code:

```powershell
git pull
npm install
npm start
```

### If something broke

See [Common problems (plain language)](#common-problems-plain-language) — especially if it **worked yesterday but not today**, or Connect says **OAuth not configured** (usually the wrong folder or editing `.env.example` instead of `.env`).

---

## Quick start (step by step)

This guide assumes you are **not** a programmer. You will install a small program on your computer, open the app in your browser, and (optionally) link your own Spotify and SoundCloud accounts. The app runs **only on your computer** — it is not hosted for you on the internet unless you set that up yourself later.

### What you need

- A Windows, Mac, or Linux computer
- An internet connection
- A web browser (Chrome, Edge, or Firefox recommended)
- About 30–60 minutes the first time (mostly for creating free developer accounts)
- For **real Spotify playback**: a **Spotify Premium** subscription on the account you connect. For **real Soundcloud playback**: a **Soundcloud Artist Pro** subscription on the account you connect
- Your own **Spotify** and **SoundCloud** logins (for the full experience)

This project does **not** include the author’s passwords or API keys. You will create your own free “developer app” on Spotify and SoundCloud and paste those codes into a file on your machine.

### Step 1 — Install Node.js

Node.js lets your computer run this app.

1. Go to [https://nodejs.org](https://nodejs.org) and download **LTS** (the green button — currently **22.x**). Do **not** download **Current** (Node 24+); this project’s database dependency does not install cleanly on Node 24 without extra Windows build tools.
2. Run the installer and accept the defaults.
3. If you already have a **newer** Node installed, Windows may refuse to install LTS on top of it. Uninstall **Node.js** first (**Settings** → **Apps** → **Installed apps** → **Node.js** → **Uninstall**), then install **LTS** from step 1.
4. **Close** PowerShell (and Cursor’s terminal if open), then open a **new** PowerShell window.
5. Check that it worked:

   **Windows (PowerShell):**

   ```powershell
   node -v
   ```

   You should see **`v22.x.x`**. If you see **`v24.x.x`**, repeat step 3.

   **Mac (Terminal):**

   ```bash
   node -v
   ```

### Step 2 — Get the project files

Repository: [https://github.com/chrissohk/Unify-](https://github.com/chrissohk/Unify-)

**You do not type your username anywhere.** Commands that use `$env:USERPROFILE` are filled in automatically by Windows (for example `C:\Users\YourName`).

**Option A — Git (if you use GitHub)**

Open **PowerShell** and paste these lines **one at a time** (press Enter after each):

```powershell
cd "$env:USERPROFILE\OneDrive\Desktop"
```

```powershell
git clone https://github.com/chrissohk/Unify-.git
```

```powershell
cd "Unify-"
```

If your Desktop is **not** under OneDrive, use this first line instead of the one above:

```powershell
cd "$env:USERPROFILE\Desktop"
```

**Mac (Terminal):**

```bash
cd ~/Desktop
git clone https://github.com/chrissohk/Unify-.git
cd Unify-
```

**Option B — Download ZIP (no Git)**

1. Open [https://github.com/chrissohk/Unify-](https://github.com/chrissohk/Unify-) → green **Code** → **Download ZIP**.
2. Open your **Downloads** folder → right‑click the ZIP → **Extract All** → choose **Desktop** (or extract there and move the folder to Desktop).
3. Open **PowerShell** and paste **one line at a time**:

   Go to Desktop (pick the line that matches your PC):

   ```powershell
   cd "$env:USERPROFILE\OneDrive\Desktop"
   ```

   or, if Desktop is not in OneDrive:

   ```powershell
   cd "$env:USERPROFILE\Desktop"
   ```

   List folders whose names start with `Unify`:

   ```powershell
   Get-ChildItem -Directory | Where-Object { $_.Name -like "Unify*" }
   ```

   You will usually see **`Unify--main`**. Go into that folder (change the name if yours is different):

   ```powershell
   cd "$env:USERPROFILE\OneDrive\Desktop\Unify--main"
   ```

   If the ZIP was extracted to **Downloads** instead, use:

   ```powershell
   cd "$env:USERPROFILE\Downloads\Unify--main"
   ```

   **Mac (Terminal)** — after unzipping to Desktop:

   ```bash
   cd ~/Desktop/Unify--main
   ```

You are in the right place when this folder contains `package.json` and `README.md`. Remember this folder path — your **`.env`** file (Step 4) and every command (`npm install`, `npm start`) must use this **same** folder.

### Step 3 — Install the app’s dependencies

In the **same** PowerShell or Terminal window (still inside the project folder), run:

```powershell
npm install
```

Wait until it finishes **without** red `npm error` lines. This only needs to be done once (or again after updating the project).

**If `npm install` fails** (for example `better-sqlite3` or “Visual Studio”):

1. Confirm `node -v` shows **v22.x.x** (see Step 1).
2. Delete the broken install and try again:

   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   npm install
   ```

3. If you see **EPERM** or “operation not permitted”, OneDrive may be locking files. Move the project folder to something like `C:\Projects\Unify-`, then:

   ```powershell
   cd C:\Projects\Unify-
   npm install
   ```

### Step 4 — Find and create your settings file (`.env`)

The app reads your Spotify and SoundCloud **Client ID** and **Client Secret** from a file named **`.env`**. That file lives **on your computer only** — it is **not** on GitHub, and you must never upload it or email it to anyone.

#### Which file do I edit?

| File | Do you put secrets here? |
|------|---------------------------|
| **`.env`** | **Yes.** This is the only file you edit. |
| **`.env.example`** | **No.** This is a blank template. Leave it empty. |

If you only see **`.env.example`** and no **`.env`**, create `.env` once (see below).

#### Where is the `.env` file? (depends how you got the project)

The `.env` file must sit in the **same folder** as `README.md` and `package.json` — your **project folder**. That folder is different depending on whether you cloned or downloaded a ZIP:

| How you got the project | Usual folder name on Desktop | Full path example (Windows, OneDrive Desktop) |
|-------------------------|------------------------------|-----------------------------------------------|
| **Git clone** (Option A in Step 2) | **`Unify-`** | `C:\Users\YourName\OneDrive\Desktop\Unify-\` |
| **ZIP download** (Option B in Step 2) | **`Unify--main`** (name can vary) | `C:\Users\YourName\OneDrive\Desktop\Unify--main\` |

**Important:** If you have **two** folders (for example `Unify-` and `Soundcloud and Spotify Multiplayer`), you must use **one** folder for everything: `cd` there, run `npm install` and `npm start` there, and put **`.env`** in **that same** folder. Editing `.env` in a different folder is the most common reason Connect says **“OAuth not configured”**.

**Find the folder in File Explorer (Windows):**

1. Open **File Explorer**.
2. Go to **Desktop** (or **OneDrive → Desktop** if you use OneDrive).
3. Open the project folder (`Unify-` or `Unify--main`).
4. You should see files such as `README.md`, `package.json`, and `.env.example`.
5. After you create it, you will also see **`.env`** in this same folder.

**Show hidden files if you do not see `.env`:** In File Explorer, click **View** → turn on **Hidden items**. Files whose names start with a dot (like `.env`) are sometimes hidden.

#### Create `.env` from the template (one time)

Open **PowerShell**, go to your project folder (same `cd` commands as Step 2), then run **one** of these:

**Windows:**

```powershell
Copy-Item .env.example .env
```

**Mac or Linux:**

```bash
cp .env.example .env
```

#### How to open and edit `.env` (Windows, plain steps)

1. In **File Explorer**, open your project folder (`Unify-` or `Unify--main`).
2. Right‑click the file **`.env`** → **Open with** → **Notepad**.  
   (If Notepad is not listed, choose **Choose another app** → **Notepad**.)
3. You will see lines like `SPOTIFY_CLIENT_ID=` with nothing (or something) after the `=`.
4. In [Step 6](#step-6--connect-your-real-spotify-and-soundcloud-path-b), you will paste your codes **immediately after the `=`** on each line.
5. When finished: **File** → **Save** in Notepad. Close Notepad.

**Mac:** open `.env` in **TextEdit** → **Format** → **Make Plain Text** before saving.

#### Rules when typing in `.env`

- Paste the **Client ID** or **Client Secret** **right after the `=`** with **no spaces** around `=`.
- **Do not** put quotes around the values unless the developer site explicitly gave you quotes (usually you do **not** need quotes).
- **Do not** change the redirect lines to end in **`/login`**. They must end in **`/callback`** (Step 6 shows the exact text).
- Save **`.env`**, not `.env.example`.

**Example** (use your real values, not these):

```env
SOUNDCLOUD_CLIENT_ID=pasteSoundCloudIdHere
SOUNDCLOUD_CLIENT_SECRET=pasteSoundCloudSecretHere
SOUNDCLOUD_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/soundcloud/callback

SPOTIFY_CLIENT_ID=pasteSpotifyIdHere
SPOTIFY_CLIENT_SECRET=pasteSpotifySecretHere
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/spotify/callback
```

You can leave all ID/secret lines **empty** for Path A (demo mode). For Path B (real accounts), fill them in Step 6.

---

### Two ways to run the app

| Path | API keys needed? | What you get |
|------|------------------|--------------|
| **A — Try it quickly** | No (leave `.env` IDs empty) | App opens; demo/sample search results; good to see the interface |
| **B — Full experience** | Yes (Step 6) | Real search, your playlists/likes, real playback with your accounts |

You can do Path A first, then Path B when you are ready.

---

### Step 5 — Start the app

In the project folder, run:

```bash
npm start
```

Leave this window **open** while you use the app. You should see a message that the server is running on port **3000**.

Open your browser and go to **exactly**:

**http://127.0.0.1:3000**

(You can also try `http://localhost:3000`, but for Step 6 you must use the **same** address everywhere — see below.)

**Do not** open the file `public/index.html` by double-clicking it. The app must be loaded through the address above while `npm start` is running.

To stop the app later: click the terminal window and press **Ctrl+C**.

---

### Step 6 — Connect your real Spotify and SoundCloud (Path B)

Skip this if you only want Path A (demo mode).

You need to register two free developer applications — one on Spotify, one on SoundCloud — and copy four secret codes into **`.env`** in your project folder (see [Step 4](#step-4--find-and-create-your-settings-file-env) for where that file lives).

**Important:** Use the same website address everywhere. This guide uses `127.0.0.1` and port `3000`. Do not mix `localhost` and `127.0.0.1` — they are treated as different sites.

**Common mistake:** The redirect lines in `.env` must end with **`/callback`**, not **`/login`**. The word “login” is only for your browser when you click Connect; Spotify and SoundCloud must redirect back to **`/callback`**.

#### SoundCloud

1. Sign in at the [SoundCloud developer portal](https://developers.soundcloud.com/) and create an application.
2. Find **Redirect URI** (or callback URL) in the app settings and add **exactly** (copy this whole line):
   ```
   http://127.0.0.1:3000/api/oauth/soundcloud/callback
   ```
3. Copy your app’s **Client ID** and **Client Secret** from the portal.
4. Open **`.env`** in Notepad (in the same folder as `package.json` — see Step 4). On each line, paste **only the code** after the `=`:
   - Find `SOUNDCLOUD_CLIENT_ID=` → paste Client ID immediately after `=`
   - Find `SOUNDCLOUD_CLIENT_SECRET=` → paste Client Secret immediately after `=`
   - Find `SOUNDCLOUD_REDIRECT_URI=` → the whole line should be exactly:  
     `SOUNDCLOUD_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/soundcloud/callback`
5. **File → Save** in Notepad. Close Notepad.

#### Spotify

1. Sign in at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an app.
2. Open the app → **Settings** → **Redirect URIs** → add **exactly** (copy this whole line):
   ```
   http://127.0.0.1:3000/api/oauth/spotify/callback
   ```
3. Copy **Client ID** and **Client Secret** from the dashboard.
4. Open the same **`.env`** file in Notepad. On each line, paste **only the code** after the `=`:
   - Find `SPOTIFY_CLIENT_ID=` → paste Client ID immediately after `=`
   - Find `SPOTIFY_CLIENT_SECRET=` → paste Client Secret immediately after `=`
   - Find `SPOTIFY_REDIRECT_URI=` → the whole line should be exactly:  
     `SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/spotify/callback`
5. **File → Save** in Notepad. Close Notepad.

**Spotify Premium** is required for playback inside this app (Spotify’s rule for the Web Player).

#### Apply your changes

1. Open **PowerShell** and `cd` into the **same** project folder where **`.env`** lives (Step 2).
2. If `npm start` is still running, stop it (**Ctrl+C**).
3. Run `npm start` again.
4. Look at the text in PowerShell right after the server starts. You want to see:
   - `Spotify OAuth: configured (SPOTIFY_CLIENT_ID)`
   - `SoundCloud OAuth: configured (SOUNDCLOUD_CLIENT_ID)`  
   If you see **“not configured”**, the server is not reading your `.env` — you are in the wrong folder, editing `.env.example` instead of `.env`, or the ID lines are still empty. Fix that before clicking Connect in the browser.
5. Open **http://127.0.0.1:3000** in the browser and click **Connect** for each service.

More detail (redirect URI checklist, optional scopes): [OAuth setup (your own API credentials)](#oauth-setup-your-own-api-credentials).

---

### Step 7 — Use the app in your browser

1. **Connect your accounts**  
   In the **Connections** area (or next to each service), click **Connect** for Spotify and SoundCloud.  
   Your browser will open Spotify or SoundCloud’s login page. Sign in and approve access. You will return to the app automatically.

2. **Search for music**  
   - Open the **Spotify** section, type in the search box, click **Search**, and add tracks you like.  
   - Open the **SoundCloud** section and do the same.  
   You can mix both services in one queue.

3. **Build your queue**  
   Add songs from search results (or from playlists/likes on SoundCloud when connected). Tracks appear under **Up next**.

4. **Play**  
   Start playback from the queue. **Now playing** shows the current song. When a song ends, the app tries to play the next one in the list.

5. **Manage the queue**  
   Use **Up** / **Down** to reorder upcoming tracks, or remove tracks you do not want.

6. **Disconnect**  
   Click **Disconnect** if you want to sign out of a service on this computer.

**After you close the terminal or restart the computer:** see [Next time (already set up)](#next-time-already-set-up).

---

### Common problems (plain language)

| What you see | What to try |
|--------------|-------------|
| `npm install` fails on `better-sqlite3` or asks for Visual Studio | Install **Node 22 LTS** (not Current 24). Uninstall Node 24 first if needed. Then delete `node_modules` and run `npm install` again (see Step 3). |
| `cd` says path does not exist | Run the `Get-ChildItem` command in Step 2 Option B and `cd` into the **exact** folder name shown. |
| Blank page or “can’t connect” | Is `npm start` still running? Use **http://127.0.0.1:3000**, not a file from the folder. |
| `OAuth not configured` or `OAUTH_NOT_CONFIGURED` when you click Connect | Your **`.env`** must be in the **same folder** where you run `npm start` (see Step 4). Edit **`.env`**, not `.env.example`. Fill `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`, save, restart `npm start`, and check the console says **Spotify OAuth: configured**. |
| “Redirect URI mismatch” after login | Redirect URLs must end with **`/callback`**, not `/login`. The URL in Spotify/SoundCloud developer settings must **match** `.env` character for character (including `127.0.0.1` vs `localhost`). |
| Spotify will not play audio | You need **Spotify Premium** on the account you connected. |
| Search shows odd demo tracks only | API keys missing or Connect not done — complete Step 6 and Connect again. |
| Worked yesterday, not today | Run `npm start` again and **Connect** both services again. |

If you are comfortable with technical tools, open the browser’s developer console (F12) → **Network** tab to see failed requests; see also [Run locally](#run-locally) for developers.

---

## For developers

The sections below describe features, architecture, testing, and deployment in more technical terms.

## What works right now

- Connect Spotify and SoundCloud via **OAuth** (your own app credentials in `.env`); mock catalogs work without OAuth for local demos
- **SoundCloud**: with OAuth connected (`SOUNDCLOUD_*` in `.env`), search hits the live SoundCloud API (`/tracks`); otherwise search uses the built-in mock catalog (same as offline demos)
- **SoundCloud library**: on the SoundCloud tab, browse **Likes**, **your playlists**, and **liked playlists** (OAuth required for live data; simulated Connect shows a demo library)
- **Spotify**: with OAuth connected, search uses the Spotify Web API; otherwise mock catalog
- **Spotify library**: on the Spotify tab, browse **Liked Songs**, **your playlists**, and **liked playlists** (followed playlists you do not own; OAuth required for live data)
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

Returning after initial setup: see [Next time (already set up)](#next-time-already-set-up).

Requires **Node.js 22 LTS** (see [Step 1](#step-1--install-nodejs) in Quick start).

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
