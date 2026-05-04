# Quality Engineering Rules

## Mechanical enforcement (non-negotiable)

- All TypeScript projects must use Husky to commit git hooks to the repository. Hooks in `.git/hooks/` are not acceptable as a permanent solution.
  - source: promoted (from 2026-05-04 estate rollout)

- Required hooks for TypeScript projects: pre-commit (`npm run typecheck`), pre-push (`npm run test:run` or equivalent).
  - source: promoted

- Coverage thresholds must be configured in the test framework config. Set just below current baseline. Ratchet upward as tests improve.
  - source: promoted

- CI (GitHub Actions or equivalent) must run the same checks as hooks. Hooks are fast local feedback; CI is the authoritative gate that cannot be bypassed.
  - source: promoted

- Never bypass hooks with `--no-verify`. If a hook blocks your commit due to pre-existing errors, fix those errors or create a card; do not skip the gate.
  - source: seeded (from agent_guidelines.md)

- If a project lacks Husky and coverage thresholds, that is itself a card to create before feature work proceeds.
  - source: promoted
