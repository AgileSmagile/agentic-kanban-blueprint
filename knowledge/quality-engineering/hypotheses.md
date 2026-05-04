# Quality Engineering Hypotheses

## H1: Mechanical gates reduce agent-introduced regressions by >50%

Pre-commit typecheck and pre-push test hooks should catch the majority of regressions that previously reached CI or production. Measurable via: count of CI failures caused by type errors or test failures before vs after Husky rollout.

- evidence_for: 1 (SW-v2 type errors caught on first hook run)
- evidence_against: 0
- status: testing

## H2: Coverage ratchet thresholds prevent silent test debt accumulation

Setting thresholds just below baseline means new untested code is caught mechanically. Measurable via: coverage trend over time (should be non-decreasing).

- evidence_for: 0
- evidence_against: 0
- status: testing

## H3: Projects without test infrastructure accumulate more critical audit findings

BuildFlowPro (no tests, no hooks) had 4 CRITICAL findings in first audit. Projects with test infrastructure should show fewer. Measurable via: audit findings per project correlated with test infrastructure maturity.

- evidence_for: 1 (BuildFlowPro audit)
- evidence_against: 0
- status: testing
