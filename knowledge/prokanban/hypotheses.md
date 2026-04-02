# ProKanban Hypotheses

Testing ground for the agentic Kanban experiment. Each needs 5+ independent confirmations before promotion to a rule.

## Active hypotheses

### H1: WIP age alone is a sufficient autonomous pull signal
Conjecture: An agent checking board age on session start will make better pull decisions than one relying on human direction.
Status: insufficient data
Evidence for: —
Evidence against: —
Test: Track pull decision quality against WIP age data across sessions. Compare outcomes when agent pulled autonomously vs. when PO directed.

### H2: No authoritative trigger is needed for autonomous pull
Conjecture: The combination of WIP age, initiative priority order, and WIP targets gives agents enough signal to pull correctly without human direction each session.
Status: partially supported
Evidence for: Sessions where agent pulls immediately tend to produce more throughput. Board-only operation worked on multiple occasions.
Evidence against: Agent waited for "go" in pre-feedback sessions. Possible confound: behaviour changed after explicit feedback, not purely board-driven.
Confirmations: ~2-3
Test: Track next 5 sessions — did agent pull correctly without prompting?

### H3: Agents can maintain Kanban discipline across sessions without human reminder
Conjecture: With the board as source of truth and a proper startup ritual, agents won't need the PO to remind them of WIP state or pull discipline.
Status: early
Evidence for: Recent sessions show improved autonomous behaviour
Evidence against: Historical pattern of waiting for "go"
Test: 5 consecutive sessions with no WIP-related correction from PO = H3 confirmed.

### H4: The knowledge/hypothesis/rule system will reduce repeated corrections
Conjecture: Classifying insights as knowledge/hypothesis/rule (rather than flat memory facts) will reduce the recurrence of the same correction appearing multiple times across sessions.
Status: brand new
Test: Track frequency of repeated corrections over next 10 sessions.

### H5: Rules without a last_updated timestamp become silently stale
Conjecture: Adding a last_updated date to each rule entry would let agents detect staleness ("this rule is 30+ days old and relates to infrastructure — verify before acting") without needing a full review cycle.
Status: 1 observation (board restructure — column renaming propagated to rules.md but agents running before the update operated on stale knowledge with no signal)
Evidence count: 1
Test: Track how often agents act on stale rule information over the next 10 sessions.

### H6: Agent-to-system feedback is missing from the operating model
Conjecture: Capturing agent difficulty signals ("this card was ambiguous", "I needed 6 file reads to reconstruct context that should have been inline") would improve card quality over time and surface operating model gaps the PO can't see from the outside.
Status: structural observation
Evidence count: 1
Test: Add an optional "agent friction note" field to card completion comments for 10 cards. Compare card quality on subsequent similar tasks.
