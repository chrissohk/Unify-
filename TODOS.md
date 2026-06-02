# TODOs

## Provider compliance matrix + policy checks
- **What:** Maintain a living matrix of provider capabilities and policy constraints (search, library access, playback control, scopes, account-tier constraints).
- **Status:** Initial matrix in [`docs/COMPLIANCE_MATRIX.md`](docs/COMPLIANCE_MATRIX.md); keep in sync with API and policy changes. **Completed:** v1.1.0.0 (2026-06-02) — initial matrix shipped.
- **Why:** Native playback integration can silently drift into unsupported behavior without explicit policy checks.
- **Pros:** Reduces platform-compliance risk and clarifies feature boundaries for future iterations.
- **Cons:** Requires continuous maintenance as provider APIs/policies evolve.
- **Context:** P0 now includes direct account playback controls, so capability/policy mismatches are a primary risk.
- **Depends on / blocked by:** OAuth and adapter contract definitions.

## Replayable failure simulation harness for orchestrator
- **What:** Build a test harness that can replay token expiry, rate limit, timeout, and unavailable-track scenarios against orchestrator transitions.
- **Status:** Baseline scenarios in [`lib/orchestratorHarness.js`](lib/orchestratorHarness.js) + [`tests/orchestrator-harness.test.js`](tests/orchestrator-harness.test.js); extend for provider-level timeouts and unavailable tracks. **Completed:** v1.1.0.0 (2026-06-02) — baseline harness shipped.
- **Why:** Playback state regressions are expensive to debug manually and will recur as adapter logic evolves.
- **Pros:** Improves confidence in resilience paths and accelerates debugging.
- **Cons:** Additional setup complexity and test maintenance burden.
- **Context:** Full branch-mapped P0 test depth was chosen; this harness is a direct enabler.
- **Depends on / blocked by:** Playback orchestrator v2 state machine and normalized provider error contract.
