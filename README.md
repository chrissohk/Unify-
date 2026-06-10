# Unified Spotify + SoundCloud Queue

Queue tracks from Spotify and SoundCloud in one list. Runs on your computer only.

**Before you start:** Install **Node.js 22 LTS** from https://nodejs.org (green **LTS** button — not **Current**).

Open the app at **http://127.0.0.1:3000** (do not double-click `public/index.html`).

---

## First-time setup

### Windows (PowerShell)

Open **PowerShell**. Paste **one line at a time**. Press **Enter** after each.

Check Node is installed:

```powershell
node -v
```

You should see `v22.x.x`.

Go to Desktop:

```powershell
cd "$env:USERPROFILE\OneDrive\Desktop"
```

If Desktop is not in OneDrive:

```powershell
cd "$env:USERPROFILE\Desktop"
```

Download the project:

```powershell
git clone https://github.com/chrissohk/Unify-.git
```

```powershell
cd "Unify-"
```

Install dependencies:

```powershell
npm install
```

Create your settings file:

```powershell
Copy-Item .env.example .env
```

Open `.env` to edit it:

```powershell
notepad .env
```

In Notepad, paste your API keys **right after the `=`** on each line (no spaces). For demo mode, leave the ID/secret lines empty and save (**Scroll to bottom for API Keys setup)

Example (use your own values):

```env
SOUNDCLOUD_CLIENT_ID=pasteSoundCloudIdHere
SOUNDCLOUD_CLIENT_SECRET=pasteSoundCloudSecretHere
SOUNDCLOUD_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/soundcloud/callback

SPOTIFY_CLIENT_ID=pasteSpotifyIdHere
SPOTIFY_CLIENT_SECRET=pasteSpotifySecretHere
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/spotify/callback
```

Save in Notepad (**File → Save**), then close Notepad.

Start the app:

```powershell
npm start
```

Open in browser: **http://127.0.0.1:3000**

Stop the server: **Ctrl+C**

---

### Mac (Terminal)

Open **Terminal**. Paste **one line at a time**. Press **Enter** after each.

Check Node is installed:

```bash
node -v
```

You should see `v22.x.x`.

Go to Desktop:

```bash
cd ~/Desktop
```

Download the project:

```bash
git clone https://github.com/chrissohk/Unify-.git
```

```bash
cd Unify-
```

Install dependencies:

```bash
npm install
```

Create your settings file:

```bash
cp .env.example .env
```

Open `.env` to edit it:

```bash
open -e .env
```

In TextEdit, choose **Format → Make Plain Text**, then paste your API keys **right after the `=`** on each line (no spaces). For demo mode, leave the ID/secret lines empty and save (**Scroll to bottom for API Keys setup)

Example (use your own values):

```env
SOUNDCLOUD_CLIENT_ID=pasteSoundCloudIdHere
SOUNDCLOUD_CLIENT_SECRET=pasteSoundCloudSecretHere
SOUNDCLOUD_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/soundcloud/callback

SPOTIFY_CLIENT_ID=pasteSpotifyIdHere
SPOTIFY_CLIENT_SECRET=pasteSpotifySecretHere
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/spotify/callback
```

Save and close TextEdit.

Start the app:

```bash
npm start
```

Open in browser: **http://127.0.0.1:3000**

Stop the server: **Ctrl+C**

---

## Every time you use the app

You do **not** need to clone or run `npm install` again unless you deleted the folder or pulled updates that changed dependencies.

### Windows (PowerShell)

```powershell
cd "$env:USERPROFILE\OneDrive\Desktop\Unify-"
```

Get latest code (optional):

```powershell
git pull
```

Start the app:

```powershell
npm start
```

Open: **http://127.0.0.1:3000**

Click **Connect** for Spotify and SoundCloud after each server restart.

Stop the server: **Ctrl+C**

---

### Mac (Terminal)

```bash
cd ~/Desktop/Unify-
```

Get latest code (optional):

```bash
git pull
```

Start the app:

```bash
npm start
```

Open: **http://127.0.0.1:3000**

Click **Connect** for Spotify and SoundCloud after each server restart.

Stop the server: **Ctrl+C**

---

## Get API keys and edit `.env` (real Spotify / SoundCloud)

Skip this whole section if you left the ID/secret lines **empty** in `.env` — the app still opens in demo mode.

You need **two free developer apps** (one per service). Each app gives you:

| What it is | Where it goes in `.env` |
|------------|-------------------------|
| **Client ID** | Public app identifier — paste after `SOUNDCLOUD_CLIENT_ID=` or `SPOTIFY_CLIENT_ID=` |
| **Client Secret** | Private key — paste after `SOUNDCLOUD_CLIENT_SECRET=` or `SPOTIFY_CLIENT_SECRET=` |

**Never share your Client Secret** or commit `.env` to GitHub.

**Use the same address everywhere:** `127.0.0.1` and port `3000`. Do **not** mix `localhost` and `127.0.0.1` — Spotify and SoundCloud treat them as different sites.

**Redirect URLs must end in `/callback`**, not `/login`.

---

### SoundCloud — create app and get keys

1. Open https://developers.soundcloud.com/ and sign in with your **SoundCloud account** (the one you want to use in the app).

2. Go to **Your apps** (or **Register a new application**) and create an app.
   - **App name:** anything you like (e.g. `My Queue App`)
   - **Website:** you can use `http://127.0.0.1:3000` for local use

3. Open your new app's settings. Find **Redirect URI** (may be labeled **Callback URL**).

4. Add this redirect URI **exactly** (copy the whole line):

   ```
   http://127.0.0.1:3000/api/oauth/soundcloud/callback
   ```

5. Save the app settings in the SoundCloud portal.

6. On the same app page, find:
   - **Client ID** — a long string of letters and numbers
   - **Client Secret** — another long string (may be hidden; click **Show** or **Reveal** if needed)

7. Copy those two values. You will paste them into `.env` in the next section.

---

### Spotify — create app and get keys

1. Open https://developer.spotify.com/dashboard and log in with your **Spotify account**.

2. Click **Create app** (or **Create an app**).
   - **App name:** anything you like (e.g. `My Queue App`)
   - **App description:** optional
   - Accept the terms and create the app

3. Open the app you just created. Click **Settings**.

4. Under **Redirect URIs**, click **Add** and paste **exactly**:

   ```
   http://127.0.0.1:3000/api/oauth/spotify/callback
   ```

5. Click **Save** at the bottom of the Settings page.

6. Back on the app overview / Settings page, find:
   - **Client ID** — shown on the main app page
   - **Client Secret** — click **View client secret** (or **Show client secret**) to reveal it

7. Copy both values for `.env`.

**Spotify playback:** You need **Spotify Premium** on the account you connect. That is Spotify's rule for the Web Player, not something this app can bypass.

---

### Paste keys into `.env`

**Windows (PowerShell):**

```powershell
cd "$env:USERPROFILE\OneDrive\Desktop\Unify-"
```

```powershell
notepad .env
```

**Mac (Terminal):**

```bash
cd ~/Desktop/Unify-
```

```bash
open -e .env
```

In the editor:

1. Edit **`.env`** only — **not** `.env.example`.
2. Paste each value **immediately after the `=`** with **no spaces**.
3. Do **not** add quotes unless the portal gave you quotes (usually you do not need them).
4. Leave the redirect lines as they are unless you changed the port:

```env
SOUNDCLOUD_CLIENT_ID=pasteYourSoundCloudClientIdHere
SOUNDCLOUD_CLIENT_SECRET=pasteYourSoundCloudClientSecretHere
SOUNDCLOUD_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/soundcloud/callback

SPOTIFY_CLIENT_ID=pasteYourSpotifyClientIdHere
SPOTIFY_CLIENT_SECRET=pasteYourSpotifyClientSecretHere
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/oauth/spotify/callback
```

5. Save the file and close the editor.

**Mac (TextEdit):** **Format → Make Plain Text** before saving.

---

### Restart the server and connect

Stop the server if it is running (**Ctrl+C** in the terminal), then:

**Windows (PowerShell):**

```powershell
npm start
```

**Mac (Terminal):**

```bash
npm start
```

Right after startup, the terminal should show:

- `Spotify OAuth: configured (SPOTIFY_CLIENT_ID)`
- `SoundCloud OAuth: configured (SOUNDCLOUD_CLIENT_ID)`

If you see **"not configured"**:

- You are in the **wrong folder**
- You edited **`.env.example`** instead of **`.env`**
- The ID lines are still empty or have extra spaces

Open **http://127.0.0.1:3000**, click **Connect** for Spotify and SoundCloud, sign in, and approve access. You return to the app automatically.

---

### Common OAuth mistakes

| Mistake | Fix |
|---------|-----|
| Redirect URI mismatch after login | The URL in the Spotify/SoundCloud portal must **match** `.env` character for character, including `127.0.0.1` vs `localhost` |
| Used `/login` instead of `/callback` | Redirect URIs must end in **`/callback`** |
| Keys in `.env.example` | Copy to **`.env`** and edit **`.env`** only |
| Server not restarted | Stop with **Ctrl+C**, run `npm start` again after saving `.env` |
| Spotify plays nothing | Connect with a **Spotify Premium** account |

---

## If something breaks

| Problem | Fix |
|---------|-----|
| `npm install` fails | Run `node -v` — must be **v22.x.x**. Delete `node_modules`, run `npm install` again. |
| Blank page | Make sure `npm start` is running. Use **http://127.0.0.1:3000**. |
| `OAuth not configured` | Edit **`.env`** (not `.env.example`) in the same folder where you run `npm start`. Restart the server. |
| Redirect URI mismatch | Redirect URLs must end in **`/callback`**. Use `127.0.0.1` everywhere, not `localhost`. |

---

## For developers

### Run locally

```bash
npm install
cp .env.example .env   # Windows: Copy-Item .env.example .env
npm start
```

### Test

```bash
npm test
npm run test:e2e
npm run test:all
```

### Features

- Unified queue for Spotify and SoundCloud
- OAuth connect, search, library browse, playback
- SQLite persistence (`data/app.db`)
- Reorder and remove tracks in **Up next**
- Auto-advance when a track finishes

See [`.env.example`](.env.example) and [`docs/COMPLIANCE_MATRIX.md`](docs/COMPLIANCE_MATRIX.md) for OAuth and policy details.
