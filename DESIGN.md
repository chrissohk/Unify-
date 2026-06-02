# Design System — Unified Queue

## Product Context

- **What this is:** A web app that queues and plays tracks from Spotify and SoundCloud in one list, with shared Now Playing and auto-advance across providers.
- **Who it's for:** Builders and listeners who want one queue without switching apps or tabs.
- **Space/industry:** Multi-source music playback / unified queue (peers: Parachord, ElevenFM, Mixify, SynQ).
- **Project type:** Web app — queue-first dashboard, not a marketing site.

**Memorable thing:** One queue — Spotify and SoundCloud without tab-hopping.

## Aesthetic Direction

- **Direction:** Industrial utilitarian — function-first listening desk, calm and credible.
- **Decoration level:** Intentional — subtle surface depth; provider identity via edge accents, not full-panel brand floods.
- **Mood:** Dark, focused, dense where the queue lives; brand color appears when context is Spotify or SoundCloud.
- **Reference sites:** Category research (Parachord, ElevenFM, Mixify, SynQ) — dark queue UI, drag/reorder, provider badges, restrained accent use.

## Typography

- **Display/Hero:** Cabinet Grotesk — confident title hierarchy without default SaaS grotesks.
- **Body:** DM Sans — readable metadata, buttons, and search copy at small sizes.
- **UI/Labels:** DM Sans (same as body).
- **Data/Tables:** JetBrains Mono with `font-variant-numeric: tabular-nums` — queue index, durations, timestamps.
- **Code:** JetBrains Mono.
- **Loading:** Fontshare CDN for Cabinet Grotesk; Google Fonts for DM Sans and JetBrains Mono.
- **Scale:**
  - xs: 11px / 0.6875rem (labels, badges)
  - sm: 13px / 0.8125rem (controls, queue rows)
  - base: 15px / 0.9375rem (body)
  - lg: 18px / 1.125rem (section titles)
  - xl: 24px / 1.5rem (panel headings)
  - 2xl: clamp(1.35rem, 4vw, 1.75rem) (standalone app title — not used inside the nav pill)
  - nav brand: clamp(1.25rem, 2.8vw, 1.5rem) — **Unify** wordmark in `.app-header__brand` (`--nav-brand-font-size`, weight `--nav-brand-weight` 800)
  - nav controls: 0.8125rem — tab buttons (`--nav-control-font-size`); shared min-height `--nav-control-min-height` (36px)

**Do not use:** Arial, Inter, Roboto, system-ui as primary display/body fonts.

## Color

- **Approach:** Balanced — neutral dark base; Spotify and SoundCloud are semantic provider accents, not the default for every control.
- **Unified identity (Direction C — convergence):** Two-stop gradient from Spotify green through a sage midpoint to SoundCloud orange. Use on brand moments only (title mark, Now Playing tab rail, empty-state Now Playing card, loader, queue Play / auth primary). Do not flood every control.

| Token | Hex / value | Usage |
|-------|-----|--------|
| `--color-bg` | `#0B0B0C` | Page background |
| `--color-surface` | `#141416` | Cards, panels |
| `--color-surface-raised` | `#1A1A1E` | Hover rows, inputs |
| `--color-border` | `#2A2A2E` | Dividers, card borders |
| `--color-text` | `#F4F4F5` | Primary text |
| `--color-text-muted` | `#A1A1AA` | Secondary text |
| `--color-spotify` | `#1ED760` | Spotify tab, badges, row rail |
| `--color-soundcloud` | `#FF5500` | SoundCloud tab, badges, row rail |
| `--color-unified-mid` | `#7A9488` | Solid fallback (focus, drag highlight) |
| `--gradient-unified` | `90deg` green → mid → orange | Title mark, primary buttons, tab underline, loader stroke |
| `--gradient-unified-soft` | same stops at ~40% opacity | Section underlines, subtle rails |
| `--gradient-unified-glow` | diagonal green/orange wash | Idle Now Playing card background |
| `--gradient-unified-metallic` | conic green → highlight mid → orange | Full perimeter ring on selected Now Playing tab |
| `--gradient-spotify-metallic` | conic green highlights + sage sheen | Full perimeter ring on selected Spotify tab |
| `--gradient-soundcloud-metallic` | conic orange highlights + warm sheen | Full perimeter ring on selected SoundCloud tab |
| `--tab-metallic-ring-width` | `2px` | Metallic tab ring thickness (all selected tabs) |
| `--color-success` | `#22C55E` | Connected / success states |
| `--color-warning` | `#F59E0B` | Token expiry, caution |
| `--color-error` | `#EF4444` | Playback / API errors |

- **Dark mode:** Default. Surfaces stay neutral; reduce saturation ~10% on large brand fills if needed.
- **Light mode (optional later):** Background `#F6F6F7`, surface `#FFFFFF`, text `#18181B` — provider accents unchanged.

## Spacing

- **Base unit:** 4px
- **Density:** Comfortable — readable queue without wasting vertical space
- **Scale:** 2xs(2) · xs(4) · sm(8) · md(16) · lg(24) · xl(32) · 2xl(48)

## Layout

- **Approach:** Listening desk — wide shell with persistent queue rail; main tab content center; connection status rail on desktop.
- **Grid:** At `min-width: 1100px`: three columns (`--rail-queue` 380px · main flex · `--rail-status` 172px). Below that: stacked main → queue rail; status rail hidden (connect controls stay in search headers).
- **Queue rail:** Up-next rows show 40×40 cover art, title, artist, and provider badge; grid layout handle · art · meta · actions.
- **Connections rail:** Provider badge icons (Spotify / SoundCloud) beside status dot and label.
- **Search tabs:** Vertical stack — search field (full main width) → results → Your library; playlists | tracks split still at 720px inside library.
- **Max shell width:** `--shell-max` 1280px (was 960px center column only).
- **Top bar:** `.app-header` is a horizontal row with gap `--nav-header-gap` (14px). **Brand island** (`.app-header__brand`) holds the Unify wordmark outside navigation. **Tab pill** (`.app-nav-pill`) is `width: fit-content` and contains only tabs — it must not stretch across empty space. Below 480px: brand stacks above full-width tab pill (horizontal scroll on tabs).
- **Border radius:** sm 6px · md 10px · lg 14px · full 9999px (pills only)
- **Provider rails:** 3px left border on queue rows; Now Playing card uses a full perimeter metallic ring by `provider` (`spotify` | `soundcloud`).

## Motion

- **Approach:** Minimal-functional — motion aids state change, never decorates.
- **Easing:** enter `ease-out` · exit `ease-in` · move `ease-in-out`
- **Duration:** micro 100ms · short 150ms · medium 250ms · long 400ms
- **Use cases:** Tab/panel crossfade (150ms), queue row hover (120ms), button press (80ms), seek bar hover preview (mono timestamp tooltip and skip-ahead preview band follow pointer; no transition on position); opening loader reveals metallic U fill, then a single highlight sweep across the U gradient before exit; loader→app handoff uses a loader-only camera dolly (overlay scales from measured U focal point, ease-in-out, ~2200ms) while app and video stay at 1×; landing page reveals when the U overlay dissolve completes (crossfade), hidden for the full dolly + exit; loader overlay dissolves (opacity ease-in ~900ms, slight blur) during the final dolly segment and DOM is removed when invisible — no scale snap; background video begins buffering during loader intro (hidden) and is visible when the landing page reveals

## Component Rules

1. **Header brand:** Metallic gradient `U` (`.app-nav-brand__mark`, same 5-stop composition as loader `#loaderConvergenceU` at rest) + solid `nify` (`.app-nav-brand__word`). Brand lives in `.app-header__brand` with lighter glass chrome than the tab pill. Do not place the wordmark inside `.app-nav-pill`.
2. **Tabs:** Each selected tab uses a full metallic conic ring (`--tab-metallic-ring-width`, 2px): Now Playing (`--gradient-unified-metallic`), Spotify (`--gradient-spotify-metallic`), SoundCloud (`--gradient-soundcloud-metallic`), plus a matching tinted interior and soft glow.
3. **Buttons:** Default chrome is neutral (raised surface + border). Cross-provider primaries use `--gradient-unified` (`.btn--unified`, auth primary). Provider search/queue CTAs use provider color. Connect/Disconnect in the header stay ghost/neutral.
4. **Queue rows:** Provider badge + left rail; never full-width green/orange backgrounds.
5. **Cards:** `--color-surface` + `--color-border` by default; **Now Playing** uses a full metallic provider ring (green Spotify, orange SoundCloud, convergence when idle).
6. **Seek bar:** Hovering the progress scrubber shows a mono timestamp tooltip (`seek-hover-tooltip`) at the pointer and, when seeking ahead, a lighter preview band (`seek-hover-fill`) from the playhead to the pointer for Spotify and SoundCloud players.

## Anti-patterns (do not ship)

- Single-hue purple/violet accents (e.g. `#8B9CFF`) as the default product color
- Purple/violet gradient heroes
- Arial / Inter / system-ui as primary fonts
- Spotify green as the default for all buttons and focus rings
- 3-column marketing feature grids
- Centered-everything marketing layout inside the app shell

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-22 | Initial design system | Created by /design-consultation; industrial utilitarian, dual-brand rails |
| 2026-05-25 | Direction C convergence palette | Replaced lavender unified accent with green→sage→orange gradient on brand moments; neutral default buttons |
| 2026-05-22 | Static HTML preview | [`docs/design-consultation-preview.html`](docs/design-consultation-preview.html) — open in browser, not Cursor Simple Browser on `%TEMP%` paths |
| 2026-05-26 | Listening desk layout | Persistent queue rail + status rail at 1100px+; shell max 1280px |
| 2026-05-26 | Listening desk refinements | Wider queue rail with cover art; provider logos in status rail; library below search |
| 2026-05-22 | Top bar brand island | Unify wordmark in `.app-header__brand`; tab pill fit-content; larger nav brand type scale |
