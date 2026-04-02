# ProKanban Rules

These are seeded from expert knowledge (licensed ProKanban.org trainer). Axiomatic, not empirically derived in this system. Challenge them explicitly if data contradicts them.

## Core practices (ProKanban.org)

- **Visualise the work.** Everything on the board. No off-board work. No implicit queues.
  - source: seeded
- **Limit WIP.** WIP limits are targets, not just ceilings. Being under WIP is as problematic as being over. Under-WIP signals a pull problem or upstream blockage.
  - source: seeded
- **Manage flow.** Optimise for work finishing, not starting. Flow efficiency over resource efficiency.
  - source: seeded
- **Make policies explicit.** Decisions encoded in board structure, card standards, operating model — not in people's heads.
  - source: seeded
- **Implement feedback loops.** Board review, WIP age signal, SLE tracking are the feedback mechanisms.
  - source: seeded
- **Improve collaboratively, evolve experimentally.** Changes to the operating model are hypotheses. Test them, don't mandate them.
  - source: seeded

## WIP and blocking

- Blocked items stay in their current column, consuming WIP, making the blockage visible.
  - source: seeded
  - There is no blocked column. Ever.
- Normal completion path is Doing → Shipped/Live directly. Done (review) is the exception, not the default.
  - source: promoted
- Done (review) is only for cards that genuinely require the PO's product, UX, or architecture judgement before shipping. Technical work, bug fixes, backend changes, migrations, and pattern-following work ship directly.
  - source: promoted
- Validation/Rework is the PO's pull exclusively. Agents never move cards to VR. The PO decides whether to pull from Done to VR or straight to Shipped.
  - source: promoted
- When Done (review) is full, block the card in Doing with reason "Done at capacity".
  - source: promoted
- Block individual cards when downstream is full. Don't halt pulling entirely.
  - source: promoted
- Blocked cards stay in Doing — they do not advance to Done or anywhere else until the block is resolved.
  - source: promoted

## Flow signals

- WIP age is the primary flow signal. Older unblocked items get priority.
  - source: seeded
- SLE for initiatives: 5 days in Now, 80% of the time. Approaching SLE triggers escalation and investigation.
  - source: seeded
- High age on a card signals a system-level flow problem. Investigate before pulling new work.
  - source: seeded

## Housekeeping

- Cards in Closed are auto-archived after 14 days. The board reflects active and recent work, not a historical record. Git history and card comments preserve the audit trail; the board doesn't need to.
  - source: derived

## Board as source of truth

- The Kanban board is the single source of truth for all work. Not conversation history, not plans directory, not memory.
  - source: seeded
- Every piece of work gets a card before starting. An empty-description card is the same as a failing build: fix before moving on.
  - source: seeded
- WIP limits are targets in both directions. Being under WIP is a flow problem, not a safe state.
  - source: promoted
