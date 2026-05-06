# Quality Engineering Hypotheses

## H1: Mechanical gates reduce agent-introduced regressions by >50%

Pre-commit typecheck and test hooks should catch the majority of regressions that previously reached CI or production.  Measurable via: count of CI failures caused by type errors or test failures before vs after hook rollout.

- evidence_for: 1 (type errors caught on first hook run in a project that had policy-only enforcement)
- evidence_against: 0
- status: testing

## H2: Coverage ratchet thresholds prevent silent test debt accumulation

Setting thresholds just below baseline means new untested code is caught mechanically.  Measurable via: coverage trend over time (should be non-decreasing).

- evidence_for: 0
- evidence_against: 0
- status: testing

## H3: Projects without test infrastructure accumulate more critical audit findings

Projects with zero tests and no hooks had 4 CRITICAL findings in first audit.  Projects with test infrastructure should show fewer.  Measurable via: audit findings per project correlated with test infrastructure maturity.

- evidence_for: 1 (first audit of an untested project)
- evidence_against: 0
- status: testing

## H4: Undocumented test infrastructure gets reverted by agents

If test infrastructure is installed without documenting it in the project's agent instructions file, a subsequent agent session will remove it.  Measurable via: count of revert incidents before and after documentation rollout.

- evidence_for: 1 (agent reverted test framework, hooks, and test files in a concurrent session because they were not documented)
- evidence_against: 0
- status: validated (countermeasure deployed: mandatory documentation in agent instructions)

## H5: Intent-based tests survive refactoring better than implementation tests

Tests describing business rules ("a readonly user cannot perform admin operations") should require fewer updates across refactoring cycles than tests asserting implementation details ("function X throws error Y").  Measurable via: test churn rate per refactoring commit.

- evidence_for: 0
- evidence_against: 0
- status: proposed

## H6: Adversarial tests catch security issues that behavioural tests miss

Level 4 (adversarial) tests catch timing attacks, privilege escalation, and cryptographic weaknesses that Level 2 (behavioural) tests pass.  Measurable via: security findings in code that has Level 2 but not Level 4 coverage.

- evidence_for: 1 (password verification passed all behavioural tests but timing analysis revealed potential for timing-based comparison)
- evidence_against: 0
- status: testing
