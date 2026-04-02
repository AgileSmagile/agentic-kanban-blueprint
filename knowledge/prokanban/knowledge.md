# ProKanban Knowledge

Observed patterns from running this system. Raw material for future hypothesis and rule development.

## System design observations

- The dual-workflow structure (initiatives + cards) creates a two-level planning horizon that works well for a solo operator with AI agents. Initiatives answer "what matters this week?" and cards answer "what am I doing right now?" The separation prevents tactical card noise from polluting strategic initiative decisions.
- Agentic AI works well with Kanban's explicit policies. Agents can follow encoded rules reliably. The challenge is encoding the right rules, not getting agents to follow them.
- Sessions where the agent checks WIP age on startup produce more autonomous throughput than sessions where the PO directs what to work on. The board contains enough signal for correct pull decisions.

## Agentic Kanban experiment learnings

- WIP visibility translates well to LLM context: a structured board state (columns, ages, blockers) is something agents can reason about accurately.
- The "no blocked column" policy requires agents to understand blocking semantics. This needs to be explicit in instructions — agents default to wanting to move blocked cards somewhere.
