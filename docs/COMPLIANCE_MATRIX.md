# Provider compliance matrix

Living summary of capabilities and policy constraints for Spotify and SoundCloud integrations. Update when scopes, tiers, or APIs change.

## Spotify Web API

| Area | MVP status | Notes |
|------|------------|--------|
| Search | Mock catalog only | Live search requires OAuth + `Web API` search endpoints |
| Playlist library | `GET /v1/me/playlists` + `GET /v1/playlists/{id}/tracks` | Requires OAuth; default scopes add `playlist-read-private` and `playlist-read-collaborative`. Simulated Connect serves a fixed demo playlist at `/api/spotify/playlists` |
| Playback / streaming | Embed + timer fallback | Full playback APIs differ from embed; respect Spotify Developer Policy |
| OAuth scopes | Configurable via `SPOTIFY_SCOPES` | Default includes streaming, user profile, and playlist-read scopes; trim to least privilege for production |
| Token lifetime | `expires_in` from token response | Refresh via refresh token when implementing refresh worker |

## SoundCloud

| Area | MVP status | Notes |
|------|------------|--------|
| Search | Live `GET https://api.soundcloud.com/tracks?q=...&access=playable` | Requires valid access token; results normalized with `permalinkUrl` for the widget |
| Library / playlists | `GET /me/likes/tracks`, `GET /me/playlists`, `GET /me/likes/playlists`, `GET /playlists/{id}/tracks` | App routes: `/api/soundcloud/playlists` and `/api/soundcloud/playlists/:id/tracks`. Virtual id `__likes__` maps to the Likes folder. Simulated Connect serves demo library from mock catalog |
| Playback | Embed widget + Widget API `FINISH` | Queue items store `permalinkUrl`; iframe uses `w.soundcloud.com/player/?url=` |
| OAuth | OAuth 2.1 authorization code + **PKCE** (`S256`) | Authorize: `https://secure.soundcloud.com/authorize`; token + refresh: `https://secure.soundcloud.com/oauth/token`. Use header `Authorization: OAuth ACCESS_TOKEN` on API calls |
| Redirect URIs | Must match developer app settings | Same path as env `SOUNDCLOUD_REDIRECT_URI` or default `/api/oauth/soundcloud/callback` |

## Unified app rules

- **Simulated Connect** (`POST /api/auth/:provider/connect`) is for local/demo without OAuth.
- **OAuth** routes (`/api/oauth/*/login`) require env vars from your local `.env` (see `.env.example`). Access and refresh tokens stay in server memory only; SQLite stores connection flags, not secrets ([`lib/sessionPersist.js`](../lib/sessionPersist.js)).
- Rate limits and token refresh failures are modeled in [`lib/playbackGuards.js`](../lib/playbackGuards.js); extend before exposing production traffic.

## References

- [Spotify Developer Policy](https://developer.spotify.com/policy)
- [SoundCloud API terms](https://developers.soundcloud.com/docs/api/terms-of-use)
