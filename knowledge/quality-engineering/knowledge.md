# Quality Engineering Knowledge

Observed patterns from enforcing quality across the agentic estate.

## Mechanical enforcement

- Policy alone does not prevent quality regressions. SW-v2 had clear CLAUDE.md instructions about running typecheck before commits, but pre-existing type errors persisted undetected until a mechanical gate (pre-commit hook running `tsc --noEmit`) was installed on 2026-05-04. The hook caught errors immediately on first use.
  - date: 2026-05-04
  - source: SW-v2 incident

- Git hooks in `.git/hooks/` do not survive clone or fresh agent sessions. This creates a gap exactly when enforcement matters most: when a new agent arrives with no context. Husky (npm package) solves this by committing hooks to `.husky/` and auto-installing via the `prepare` lifecycle script.
  - date: 2026-05-04
  - source: estate-wide rollout

- Coverage thresholds set just below current baseline act as a ratchet: they prevent silent degradation without requiring all legacy gaps to be fixed immediately. The threshold can be raised as tests improve.
  - date: 2026-05-04
  - source: SW-v2 vitest config

- Pre-push hooks running the test suite add ~1-2 seconds to the push cycle and catch regressions before they reach CI. The cost is negligible; the benefit is immediate feedback.
  - date: 2026-05-04
  - source: SW-v2 vitest run timing

## Agent communication

- The `bmap comment` command passes text through shell arguments into a JSON payload via a Node.js helper. Double-quoted strings containing parentheses, em dashes, or special characters cause JSON serialisation failures (HTTP 400, VE03). Single-quoted strings work reliably. Multi-line text also breaks the payload. Workaround: use single quotes and post multiple short comments for complex messages.
  - date: 2026-05-04
  - source: Test Specialist first use of inbox card creation
