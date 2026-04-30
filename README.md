# Unified Spotify + SoundCloud Queue MVP

This is a lightweight MVP that lets you queue tracks from Spotify and SoundCloud in one list and automatically advance to the next track.

## What works right now

- Connect simulated Spotify and SoundCloud sessions, search tracks, queue into one list
- Reorder queue items (`Up`/`Down`), see **Next up** when two or more tracks are queued
- Remove items
- Start playback from any queue item
- Auto-advance across providers (timer-based in this MVP)

## How auto-advance works

- **SoundCloud**: uses widget finish events, plus fallback timer.
- **Spotify**: uses fallback timer only in this MVP (`durationHintSec`).

Because Spotify embed event coverage is limited in this simple setup, provide a close duration hint for reliable transition timing.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start server:
   ```bash
   npm start
   ```
3. Open:
   - [http://localhost:3000](http://localhost:3000)

## Testing

- Unit and API integration tests: `npm test` (sets `NODE_ENV=test` so `/api/test/reset` is allowed).
- End-to-end (Playwright): install browsers once with `npx playwright install chromium`, then `npm run test:e2e`.
- Full suite: `npm run test:all`.

Optional: allow test reset in non-test runs by setting `TEST_RESET_SECRET` and sending header `X-Test-Reset-Secret` with the same value (not needed for local `npm test`).

## v1 constraints

- Single-user queue state (in-memory)
- No persistence after server restart
- No social/shared queue yet
- No recommendation engine yet

## Next iteration ideas

- Persist queue in SQLite/Postgres
- Add provider adapters (`SpotifyProvider`, `SoundCloudProvider`)
- Add explicit playback state model and telemetry events
- Improve Spotify completion detection with richer SDK/event integration
