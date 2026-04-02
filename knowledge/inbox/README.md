# Knowledge Inbox

Sub-agents write here. The orchestrator reads, applies, and archives at session start.

**Never write directly to domain files.** Use this inbox instead.

---

## File naming

```
YYYYMMDD-HHMMSS-{card-id-or-session-ref}.md
```

Example: `20260401-153012-card-742.md`

Unique by construction — no conflicts possible.

---

## Format

```markdown
---
domain: prokanban
action: add
file: knowledge
source: card-742
agent: product-agent
---

Body text here. This is what gets written into the domain file.
For `add`: the full entry to append.
For `promote`/`demote`/`update`/`deprecate`: the rationale and any revised text.
```

---

## Actions

| Action | `file` required? | Effect | Auto-applied? |
|--------|-----------------|--------|---------------|
| `add` | Yes (knowledge \| hypotheses \| rules) | Appends new dated entry to the specified file | Yes |
| `promote` | No | Moves matching hypothesis to rules.md; sets `source: promoted` | Yes |
| `demote` | No | Flags to PO before applying; moves rule back to hypotheses.md | No — flag first |
| `update` | Yes | Appends a dated correction note to the matching entry | Yes |
| `deprecate` | No | Flags to PO before applying; marks entry `[DEPRECATED]` | No — flag first |

---

## `target` field

Required for `promote`, `demote`, `update`, `deprecate`. Quote the opening text of the entry you're acting on — enough to uniquely identify it.

```yaml
target: "H2: No authoritative trigger needed for autonomous pull"
```

---

## Examples

### Adding a knowledge observation

```markdown
---
domain: your-product
action: add
file: knowledge
source: card-742
agent: product-agent
---

### 2026-04-01 | card-742
Variant generation consistently takes 8-12 mins even with a complete base model.
Primary bottleneck is the AI synthesis step, not data retrieval.
```

### Promoting a hypothesis to a rule

```markdown
---
domain: prokanban
action: promote
target: "H2: No authoritative trigger needed for autonomous pull"
source: card-758
agent: orchestrator
---

5th independent confirmation: agent pulled correctly without any prompting on 2026-04-01.
All 5 confirmations were in distinct sessions with no carry-over context.
```

### Demoting a rule (flagged, not auto-applied)

```markdown
---
domain: brand
action: demote
target: "No em dashes in copy"
source: card-761
agent: website-agent
---

New data: client brief received 2026-04-01 explicitly requested em dashes for a specific
deliverable. Rule may be context-dependent (internal brand vs. client deliverables).
Suggested re-framing: apply to owned content only.
```

### Flagging content for a content strategy pipeline

```markdown
---
domain: content-strategy
action: add
file: knowledge
source: card-758
agent: orchestrator
---

### 2026-04-01 | card-758: Inbox pattern for multi-agent knowledge systems
Content angle: you can't push context to a running AI agent — here is how to design for it.
Talking points: inbox as command queue; action vocabulary (add/promote/demote/deprecate);
orchestrator as single writer to domain files; audit trail via processed/ directory.
Status: raw
```
