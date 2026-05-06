# Quality Engineering Rules

## Mechanical enforcement (non-negotiable)

- All TypeScript projects must use Husky to commit git hooks to the repository.  Hooks in `.git/hooks/` are not acceptable as a permanent solution.

- Required hooks for TypeScript projects: pre-commit runs typecheck and test suite.  Both must pass before code leaves the machine.

- Coverage thresholds must be configured in the test framework config.  Set just below current baseline.  Ratchet upward as tests improve.  Never lower a threshold without Quality Guardian approval.

- CI (GitHub Actions or equivalent) must run the same checks as hooks.  Hooks are fast local feedback; CI is the authoritative gate that cannot be bypassed.

- Never bypass hooks with `--no-verify`.  If a hook blocks your commit due to pre-existing errors, fix those errors or create a card; do not skip the gate.

- If a project lacks Husky and coverage thresholds, that is itself a card to create before feature work proceeds.

## Test depth

- Tests must cover at least Levels 1-2 (structural + behavioural) for all business logic.  Tier 1 projects (user-facing SaaS handling personal data) must also cover Level 3 (negative) and Level 4 (adversarial) for auth, access control, and input validation.  See [test-depth-model.md](../../docs/test-depth-model.md) for level definitions.

- Tests must assert specific properties, not just truthiness.  `expect(result.status).toBe(403)` not `expect(result).toBeTruthy()`.  Weak assertions pass for garbage output and provide false confidence.

- Tests should describe business intent, not implementation.  "A readonly user cannot perform admin operations" not "requireRole throws when rank < 3."  Intent tests survive refactoring; implementation tests break on every change.

## Infrastructure durability

- All test infrastructure (frameworks, hooks, CI steps, coverage thresholds) must be documented in the project's agent instructions file with: what is installed, who installed it, why, and who to contact before changing it.

- Agents must not remove, disable, or weaken test infrastructure without coordinating with the Quality Guardian.  This includes: deleting test files, replacing test scripts with stubs, removing coverage thresholds, or lowering them.
