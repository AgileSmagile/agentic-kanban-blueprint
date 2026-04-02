# The Knowledge System

## The Problem

AI agents don't remember between sessions. Each conversation starts fresh. Without a persistence mechanism, every session repeats the same mistakes, re-discovers the same patterns, and ignores hard-won lessons.

Memory files (flat facts) are the obvious solution, but they degrade. The same correction appears three times. Stale facts persist alongside current ones. There's no way to distinguish "we think this might be true" from "we've confirmed this 10 times." Everything has equal weight, which means nothing has reliable weight.

## The Design

Three tiers, each with a different epistemic status:

### Knowledge (observations)

Raw observations from real work. No status claim. Just "we saw this happen."

```markdown
## 2026-04-01 | card-742
Variant generation consistently takes 8-12 mins even with a complete base model.
Primary bottleneck is the AI synthesis step, not data retrieval.
```

Knowledge entries are cheap to create and never expire. They're the raw material that hypotheses and rules are built from.

### Hypotheses (things we think might be true)

Testable conjectures with explicit evidence tracking. Each needs 5+ independent confirmations before promotion to a rule.

```markdown
### H2: No authoritative trigger is needed for autonomous pull
Conjecture: WIP age + initiative priority + WIP targets give agents enough signal to pull correctly.
Status: partially supported
Confirmations: ~2-3
Test: Track next 5 sessions — did agent pull correctly without prompting?
```

Hypotheses are the learning edge. They're where the system develops new understanding. The explicit evidence count prevents premature generalisation.

### Rules (things we're confident enough to act on by default)

Confirmed patterns that agents apply without justification. These are the system's institutional knowledge.

```markdown
- **Limit WIP.** WIP limits are targets, not just ceilings. Being under WIP is as problematic as being over.
  - source: seeded
```

Rules have three source types:
- **Seeded**: axiomatic. Expert knowledge, legal constraints, foundational principles. No confirmation count needed.
- **Derived**: built from repeated observation. Earned empirically.
- **Promoted**: started as a hypothesis, earned rule status through 5+ independent confirmations.

## The Promotion Cycle

```
Observation → Knowledge entry → Hypothesis (if pattern detected)
                                     ↓
                              5+ confirmations
                                     ↓
                                   Rule
                                     ↓
                          (contradiction detected)
                                     ↓
                              Demote back to hypothesis
                              (requires PO approval)
```

This is deliberate. Rules earn their status. They can also lose it. The system self-corrects.

## The Inbox Pattern

Sub-agents can't write directly to domain files. Only the orchestrator merges knowledge. This prevents concurrent write conflicts and ensures quality control.

Instead, sub-agents write to an inbox:

```
knowledge/inbox/20260401-153012-card-742.md
```

Each inbox entry has YAML frontmatter specifying the action:

```yaml
---
domain: prokanban
action: add          # add | promote | demote | update | deprecate
file: knowledge      # knowledge | hypotheses | rules
source: card-742
agent: product-agent
---
```

The orchestrator processes the inbox at session start:
1. List all `.md` files in `inbox/` (excluding `processed/` and `README.md`)
2. Sort by filename (chronological)
3. Parse frontmatter, apply each action to the target domain file
4. Move processed files to `inbox/processed/`
5. Report what was merged

`demote` and `deprecate` actions are flagged to the PO before applying. You don't downgrade institutional knowledge without human review.

## Domains

Knowledge is organised by domain, not chronologically. Each domain gets its own directory with the three files:

```
knowledge/
├── prokanban/
│   ├── rules.md
│   ├── hypotheses.md
│   └── knowledge.md
├── your-product/
│   ├── rules.md
│   ├── hypotheses.md
│   └── knowledge.md
└── infrastructure/
    ├── rules.md
    ├── hypotheses.md
    └── knowledge.md
```

The `INDEX.md` file maps domains to their scope and tells agents when to consult each one.

## The Before/After Ritual

### Before starting a card

1. Read `knowledge/INDEX.md` — identify which domains apply
2. Read `rules.md` for each relevant domain — apply by default
3. Scan `hypotheses.md` — note if today's work can test or refute any hypothesis

This takes an agent 30 seconds and prevents it from repeating known mistakes or ignoring confirmed patterns.

### After completing a card

1. Write an inbox entry for any new observation, pattern, or correction
2. If a hypothesis was confirmed or contradicted, write an inbox entry to promote/demote it

This takes 60 seconds and makes the next agent on a similar task measurably better.

## Why This Works for AI Agents

1. **Explicit epistemic status.** Agents don't guess whether something is a fact or a guess. The tier tells them.
2. **Promotion threshold.** 5 confirmations prevents a single lucky observation from becoming policy.
3. **Demotion with human review.** Rules don't disappear silently. The PO approves downgrades.
4. **Domain separation.** Agents only load knowledge relevant to their current card, not the entire system's memory.
5. **Inbox pattern.** No concurrent write conflicts. The orchestrator is the single merge agent.
6. **Chronological inbox, semantic domains.** Easy to process (sorted by time), easy to query (organised by topic).

## Common Failure Modes

- **Agents skip the before-ritual.** Fix: make it explicit in the startup instructions, not optional.
- **Rules go stale.** Hypothesis H5 in the prokanban domain addresses this. Consider adding `last_updated` timestamps.
- **Too many domains.** Start with 2-3. Add when you genuinely have enough observations to seed rules.
- **Hypotheses never get tested.** The before-ritual is the mechanism. If agents aren't scanning hypotheses before work, they're not testing them.
- **Knowledge entries are too vague.** "Things went wrong" is not knowledge. "Deploy failed because cloudflared resolves localhost to IPv6 and the container only bound IPv4" is knowledge.
