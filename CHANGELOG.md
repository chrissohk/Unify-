# Changelog

All notable changes to this project are documented in this file.

## [1.1.0.0] - 2026-06-02

### Added
- OAuth connect flows for Spotify and SoundCloud with simulated-connect fallback for local demos
- Live Spotify and SoundCloud search, playlists, and library browsing via Web API adapters
- SQLite persistence for queue state and session flags across server restarts
- Browser session tokens, CORS support, and split-origin `apiBase` for optional static hosting
- Provider health checks, rate-limit backoff, and orchestrator failure harness for resilience testing
- Spotify Web Playback SDK integration with auto-advance, reload resume snapshot, and advance logic
- SoundCloud widget playback with finish-event and timer fallbacks
- Unified queue UI: reorder, remove, now-playing panel, volume control, and mobile layout
- Comprehensive unit test suite (115 tests) and Playwright e2e coverage
- CI workflow, design system (`DESIGN.md`), and provider compliance matrix

### Changed
- Expanded server API for queue operations, provider catalog, and OAuth callbacks
- Queue reorder and remove semantics preserve now-playing continuity across provider switches
- README documents OAuth setup, security model, and auto-advance behavior

### Fixed
- Queue cursor recovery when playing status diverges from stored index
- Spotify track restart detection to avoid false auto-advance on looped playback
