# Quality Engineering Knowledge

Observed patterns from enforcing quality across an agentic estate.

## Mechanical enforcement

- Policy alone does not prevent quality regressions.  One project had clear agent instructions about running typecheck before commits, but pre-existing type errors persisted undetected until a mechanical gate (pre-commit hook running `tsc --noEmit`) was installed.  The hook caught errors immediately on first use.

- Git hooks in `.git/hooks/` do not survive clone or fresh agent sessions.  This creates a gap exactly when enforcement matters most: when a new agent arrives with no context.  Husky (npm package) solves this by committing hooks to `.husky/` and auto-installing via the `prepare` lifecycle script.

- Coverage thresholds set just below current baseline act as a ratchet: they prevent silent degradation without requiring all legacy gaps to be fixed immediately.  The threshold can be raised as tests improve.

- Pre-push hooks running the test suite add ~1-2 seconds to the push cycle and catch regressions before they reach CI.  The cost is negligible; the benefit is immediate feedback.

## Infrastructure durability

- An agent in a concurrent session reverted test infrastructure (test framework, git hooks, CI test steps, test files) because it did not understand why they were installed.  The agent replaced the test script with `echo "No tests configured"` and removed the test framework from devDependencies.  The countermeasure: document all test infrastructure in the project's agent instructions file with an explicit "do not revert" instruction and a pointer to the quality guardian for coordination.

- When documenting test infrastructure, include: what is installed (framework, hooks, CI steps), who installed it (which initiative or card), why it exists (regression prevention, compliance), and who to contact before changing it.  "Do not revert" alone is insufficient; agents need the reasoning to make informed decisions.

## Test depth

- Happy-path tests (Level 1-2) are necessary but not sufficient for security-critical code.  Adversarial tests (Level 4) catch timing attacks, privilege escalation paths, and cryptographic weaknesses that behavioural tests miss.  Example: a password verification function passed all behavioural tests but required a timing analysis test to verify constant-time comparison.

- Stress tests with timing assertions act as mechanical performance regression guards.  A 50-task dependency chain cascade test with a 100ms bound catches algorithmic regressions without requiring a human to notice slowdowns.  Set bounds generously (2-5x expected) to avoid flaky tests from CPU scheduling variance.

- Intent-based tests ("a readonly user cannot delete a trade") survive refactoring better than implementation tests ("requireRole throws when rank < 3").  For agentic teams this matters because agents refactor aggressively and will delete tests that break on every change rather than update them.

## Cross-agent coordination

- Live AI integration tests (tests that call external APIs) must gracefully skip when API keys are missing or invalid.  A stale API key loaded from a .env file caused 12 cascading test failures in a suite that had a skip guard for missing keys but not for invalid keys.  The fix: catch auth errors in the API-calling test and call `ctx.skip()` instead of failing.

- Pre-commit hooks should run tests, not just typecheck.  The original pattern (pre-commit: typecheck, pre-push: test) allowed agents to commit test-breaking code as long as types were correct.  The tests only ran on push, by which time multiple broken commits might have accumulated.  Updated pattern: pre-commit runs both typecheck and tests.

## Agent communication

- Board management CLI tools that pass text through shell arguments into JSON payloads are vulnerable to serialisation failures from special characters (parentheses, em dashes, curly quotes).  Single-quoted strings are more reliable than double-quoted.  Multi-line text can also break the payload.  Workaround: use single quotes and post multiple short comments for complex messages.
