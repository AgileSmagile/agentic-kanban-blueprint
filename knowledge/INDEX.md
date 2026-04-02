# Knowledge Index

Load this before starting any card. Identify relevant domains, read their rules.md, scan hypotheses.md for anything testable with today's work.

## Domains

| Domain | What it covers | When to consult |
|--------|---------------|-----------------|
| [prokanban](prokanban/) | Flow principles, WIP theory, board operating model, Kanban methodology | Board decisions, WIP management, flow problems, agentic experiment |

<!-- Add your own domains as the system grows. Examples:
| [your-product](your-product/) | Product principles, design, domain logic | Any product feature work or UX decisions |
| [infrastructure](infrastructure/) | Deploy patterns, hosting, networking, CI/CD | Any deployment or infrastructure decision |
| [content-strategy](content-strategy/) | Content themes, audience, publishing pipeline | Any external content creation |
| [brand](brand/) | Naming, tone, visual identity | Any copy, UI text, or external-facing output |
-->

## Before starting a card

1. Open relevant domain(s) above
2. Read `rules.md` — apply by default, no justification needed
3. Scan `hypotheses.md` — note if today's work can test or refute any of them

## After completing a card — write to inbox, not domain files

**Sub-agents**: write to `knowledge/inbox/YYYYMMDD-HHMMSS-{card-id}.md`. Never write directly to domain files. See `inbox/README.md` for format and examples.

**Orchestrator**: is the single writer to domain files. Merges inbox at session start (see agent-guidelines.md).

### What to capture

- New observations → `action: add`, `file: knowledge`
- Untested patterns → `action: add`, `file: hypotheses` (include evidence count)
- Hypothesis confirmed 5+ times → `action: promote`
- Rule contradicted by new data → `action: demote` (flagged to PO before applying)
- Correction to an existing entry → `action: update`

## Source types for rules

- `seeded` — axiomatic (expert knowledge, legal constraints, foundational principles). No confirmation count needed.
- `derived` — built from repeated observation, earned status empirically
- `promoted` — started as a hypothesis, earned rule status through 5+ confirmations

## Adding a new domain

Create `knowledge/<domain>/rules.md`, `hypotheses.md`, and `knowledge.md`. Add a row to this table. Seed rules.md with anything you already know to be true before relying on the confirmation process.
