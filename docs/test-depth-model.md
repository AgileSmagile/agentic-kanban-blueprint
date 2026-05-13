# Test Depth Model for Agentic Teams

## Why Agents Need a Different Testing Model

Human developers build testing intuition over time.  They remember the production incident.  They develop a healthy caution around certain modules.  They ask a colleague before deleting an unfamiliar config file.

Agents have none of this.  Every session starts fresh.  There is no institutional memory.  There is no pain signal from a 3am page.  There is no peer who says "careful, that module is fragile."

This means the testing model for agentic development must account for failure modes that human teams rarely encounter:

- **Velocity without judgement.**  Agents optimise for "card done."  They will take the shortest path unless mechanically prevented from cutting corners.
- **No pain feedback loop.**  A human who ships a bug and gets called at 2am writes better tests next time.  An agent has no equivalent.
- **Session isolation.**  Agent A ships a change.  Agent B starts a new session and ships a conflicting change.  Neither knows about the other.
- **Infrastructure deletion.**  An agent that does not understand why a test framework is installed will remove it.  This has happened.

---

## The Five Levels

Not all tests are equal.  This model describes five levels of depth, each catching a different class of defect.

### Level 1: Structural

Does it run?  Does the function exist, accept the documented parameters, and return the expected type?

This is the floor.  Every exported function should have at least one structural test.

```typescript
it('renders a valid HTML document', () => {
  const html = renderCV(sampleContent)
  expect(html).toContain('<!DOCTYPE html>')
})
```

**Catches:** Broken imports, missing exports, type mismatches, syntax errors that bypass the compiler.

### Level 2: Behavioural

Does it do the right thing?  Given known inputs, are the outputs correct?

This is where most teams start and many stop.  It covers the happy path and common edge cases.

```typescript
it('skips weekends when adding working days', () => {
  const friday = new Date(2026, 0, 9)
  const result = addWorkingDays(friday, 1)
  expect(result.getDay()).toBe(1) // Monday
})
```

**Catches:** Logic errors, off-by-one bugs, incorrect calculations, broken edge cases.

### Level 3: Negative

Does it reject the wrong thing?  This tests what *should* fail, not what should work.

```typescript
it('escapes HTML in user-supplied names', () => {
  const result = renderEmail('welcome', '<script>alert("xss")</script>')
  expect(result.html).not.toContain('<script>')
  expect(result.html).toContain('&lt;script&gt;')
})
```

**Catches:** XSS, injection, invalid input acceptance, missing validation, security boundary violations.

### Level 4: Adversarial

Does it survive deliberate attack?  This goes beyond "does it reject bad input" to "is the rejection itself secure?"

```typescript
it('password verification is constant-time', async () => {
  const hash = await hashPassword('correct')
  const correctTimes = []
  const wrongTimes = []
  for (let i = 0; i < 5; i++) {
    const t1 = performance.now()
    await verifyPassword('correct', hash)
    correctTimes.push(performance.now() - t1)
    const t2 = performance.now()
    await verifyPassword('wrong', hash)
    wrongTimes.push(performance.now() - t2)
  }
  const ratio = Math.max(avg(correctTimes), avg(wrongTimes))
    / Math.min(avg(correctTimes), avg(wrongTimes))
  expect(ratio).toBeLessThan(10)
})
```

**Catches:** Timing attacks, privilege escalation, race conditions, resource exhaustion, cryptographic weaknesses.

### Level 5: Chaos

Does it recover from failure?  External dependencies go down.  Databases time out.  APIs return garbage.

```typescript
it('degrades gracefully when AI service returns 500', async () => {
  mockClaude.mockRejectedValue(new Error('Service unavailable'))
  const result = await decomposeCVText(sampleCV)
  expect(result.error).toContain('temporarily unavailable')
  expect(result.partial).toBeUndefined() // no corrupt partial state
})
```

**Catches:** Cascading failures, state corruption, unhandled promise rejections, partial writes, resource leaks.

---

## Minimum Depth by Project Risk

| Risk tier | Description | Minimum depth | Examples |
|-----------|-------------|---------------|---------|
| **Tier 1** | User-facing SaaS, handles personal/financial data | Levels 1-4 | Auth, payments, user data |
| **Tier 2** | Marketing, lead generation, external-facing | Levels 1-3 | Websites, email systems, CRMs |
| **Tier 3** | Internal tooling, agent infrastructure | Levels 1-2 | Orchestrators, board integrations |
| **Tier 4** | Documentation, reference material | None required | Knowledge repos, blueprints |

---

## Stress and Performance Testing

For performance-critical code paths, add timing assertions:

```typescript
it('handles 50-task cascade chain under 100ms', () => {
  const tasks = buildLongChain(50)
  const start = performance.now()
  calculateCascade('task-0', slippedDate, tasks)
  expect(performance.now() - start).toBeLessThan(100)
})
```

This creates a mechanical regression guard for performance.  If a refactor makes the algorithm slower, the test fails.  No human needs to notice; the gate catches it.

---

## Agentic-Specific Practices

### Infrastructure Durability

Test infrastructure (frameworks, hooks, CI steps, coverage thresholds) must be documented in the project's agent instructions file with an explicit instruction not to revert.  Without this, agents will remove infrastructure they do not understand.

This is not theoretical.  It has happened.

### Intent-Based Testing

Write tests that assert business rules, not implementation details:

- **Bad:** `expect(ROLE_RANK['readonly']).toBeLessThan(ROLE_RANK['full'])`
- **Good:** `expect(() => requireRole('readonly', 'full')).toThrow()`
- **Best:** *"A readonly user cannot perform full-access operations"*

Intent tests survive refactoring.  Implementation tests break.  Agents refactor aggressively.  If tests break on every refactor, agents learn to delete tests rather than fix them.

### The Coverage Ratchet

Set coverage thresholds at or just below the current baseline.  They only move in one direction: up.  Lowering a threshold requires explicit approval and documentation.

This prevents the slow erosion where new untested code dilutes coverage until the threshold becomes meaningless.

### Cross-Agent Regression Guards

Two agents modifying the same module in concurrent sessions will not catch each other's conflicts in local test runs.  CI on the main branch is the only integration point.  It is the single mechanism that prevents concurrent agents from undermining each other.

---

## Adapting This to Your Estate

This document describes the model.  Your estate's specific implementation details, project classifications, coverage thresholds, and observed patterns belong in your knowledge system, not here.

Recommended structure in your knowledge system:

```
knowledge/
  quality-engineering/
    rules.md          — Non-negotiable rules (enforcement, depth, durability)
    knowledge.md      — Observed patterns (what worked, what failed, why)
    hypotheses.md     — Testable assumptions (with evidence tracking)
```

When your Quality Guardian discovers a new pattern (e.g. "agents revert undocumented infrastructure"), capture it as a knowledge entry and, if it generalises, propose it back to this blueprint.

---

## References

- [quality-gates.md](quality-gates.md): CICD pipeline and Quality Guardian role
- [security.md](security.md): Security principles and compliance
- [knowledge/quality-engineering/](../knowledge/quality-engineering/): Observed patterns and rules
