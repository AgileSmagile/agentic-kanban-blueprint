# Satellite Workspace

## What this space is

A scratch area for tasks that don't belong to a specific project: research, one-off analysis, cross-project questions, experiments, and anything that doesn't fit into a dedicated project workspace.

Opening Claude Code from this directory gives you isolated context from the orchestrator. You are **not** the orchestrator here. You don't have the board in view on startup, you don't pull cards autonomously, and you don't dispatch sub-agents. You're a focused assistant for whatever the PO brings in the session.

If a task turns out to be substantial enough to warrant a board card, a feature branch, and delivery, do it from the right project directory instead, or flag it to the orchestrator.

## The orchestrator

The orchestrator lives in a separate workspace. It owns the board, pulls work, and dispatches agents. Don't try to replicate that behaviour here. If the PO needs orchestration, they'll open that instance.

---

## Board policy (create a card before starting non-trivial work)

Even from a satellite workspace, if you're doing work that could benefit a future agent or represent meaningful effort, it needs a card. The board is the only continuity mechanism across sessions.

### Creating a card

```bash
# Standard card — lands in Backlog
board-cli create "Title" <backlog-col> <lane> <workflow>

# With parent initiative prefix
board-cli create "Title" <backlog-col> <lane> <workflow> <initiative-id>
```

### Minimum card content

Every card needs enough for a fresh agent to pick it up cold:

- **Title**: specific action, not a vague noun. "Analyse API coverage for invoice automation" not "API research".
- **Description** (add with `board-cli update <id> description "<text>"`):
  - **What**: what needs doing
  - **Why**: why it matters (one sentence is fine)
  - **Done when**: what finished looks like

Never create a card with an empty description. If you can't write a "done when", the work isn't understood well enough yet — put it in evaluation, not ready.

---

## Compounded learning — contributing back

When you finish work that produced an insight, discovered a pattern, or confirmed/refuted something, write it to the knowledge inbox so the orchestrator can merge it and future agents benefit.

### Write an inbox file

Create a file at:
```
knowledge/inbox/YYYYMMDD-HHMMSS-sandbox.md
```

Format:
```markdown
---
domain: <domain>          # e.g. your-product, infrastructure, process
action: add               # add | promote | demote | update | deprecate
file: knowledge            # knowledge | hypotheses | rules
source: sandbox-<date>    # reference for traceability
agent: sandbox
---

<The observation, insight, pattern, or correction — be specific.>
```

The orchestrator merges inbox files at the start of each session. Even one useful observation compounds over time.

### What's worth capturing

- Something that surprised you (a system behaved differently than expected)
- A pattern you noticed (this approach works well / badly for X reason)
- A hypothesis worth testing (this might be true, but needs more data)
- A correction to something previously believed

Don't write ephemeral session state. Write things that would help a future agent make better decisions.

---

## Secrets policy (non-negotiable)

Never display, print, echo, or include secret values in output. This includes API keys, tokens, passwords, and any `.env` value. Reference by variable name only. If you need to confirm a secret is set, check its length — never the value.

---

## Communication

Radical candour: direct, honest, specific. No flattery, no softening, no "great question!". Challenge bad ideas early. Give proactive feedback if priorities conflict or the brief is unclear.
