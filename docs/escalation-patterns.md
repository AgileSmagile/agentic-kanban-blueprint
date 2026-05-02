# Escalation Patterns

## Why agents need escalation paths

An agent without escalation paths has two modes: keep going or stop.  "Keep going" burns tokens on problems it cannot solve.  "Stop" wastes the session waiting for a human who may not be watching.  Neither is acceptable.

Good escalation is the middle ground: the agent recognises it is stuck or out of its depth, signals for help through the board, and pulls other work while waiting.  The system keeps flowing.

## The existing model

The [agent guidelines](../orchestrator/agent-guidelines.md) define two escalation mechanisms:

1. **Specialist dispatch** — mid-task tagging of the Quality Guardian or Orchestrator when specific signals are detected (auth touched, rework cycles > 2, architectural decisions, etc.)
2. **Age-based intervention** — the Flow Guardian monitors card age against service level expectations and nudges at the 50th, 70th, and 85th percentile thresholds.

Both are well-documented and work in production.  This document extends them with patterns for situations those mechanisms do not cover.

## Pattern 1: Stuck on a tool (mechanical)

**Trigger:** The same tool call fails consecutively.

**Current enforcement:** The `retry-loop-detector.sh` hook catches this mechanically.  Default thresholds:

| Consecutive failures | Action |
|---|---|
| 5 | Nudge: "You have failed the same operation 5 times.  Step back and consider an alternative approach." |
| 7 | Warning: "7 consecutive failures on the same operation.  If the next attempt fails, you will be stopped." |
| 9 | Hard stop: "9 consecutive failures.  Stop this approach.  Tag the PO on the card explaining what you tried and what failed.  Pull other work." |

The hook resets its counter on any successful tool call.  Thresholds are configurable via environment variables (`RETRY_NUDGE`, `RETRY_WARN`, `RETRY_STOP`).

**What is missing:** This only catches repeated identical failures.  It does not catch an agent trying five different approaches to the same problem, each failing once.  That pattern looks like normal work to the hook but is the same underlying problem.

**Recommendation:** Agents should self-monitor for this.  If three distinct approaches to the same problem have all failed, treat it as a dispatch threshold: tag the Orchestrator on the card with what was tried and what failed, then pull other work.

## Pattern 2: Missing information

**Trigger:** The agent needs information it cannot find in the codebase, board, or knowledge system.

**Examples:**
- Acceptance criteria on a card are ambiguous or missing
- A dependency on another card's output that has not shipped yet
- Domain knowledge that is not documented (business rules, user expectations, regulatory requirements)
- Credentials or access that the agent does not have

**Escalation path:**
1. Add a comment to the card: what information is needed, why, and what the agent has already checked.
2. Tag the PO.
3. If WIP capacity exists, pull other work.
4. If no WIP capacity, declare the card blocked (using the board's native block feature, not a blocked column).  Add the reason.
5. Poll the card every 10 minutes for up to 60 minutes.
6. After 60 minutes with no response, stop polling.  The card stays blocked.  The PO will see it on next board review.

**What the agent should NOT do:**
- Guess.  If the acceptance criteria are ambiguous, do not infer what "good" looks like.  Ask.
- Wait silently.  Always leave a visible trail on the card.
- Treat missing information as a reason to stop the session.  Pull other work.

## Pattern 3: About to do something irreversible

**Trigger:** The agent is about to take an action that cannot be easily undone.

**Examples:**
- Deleting data (database records, files, branches with unmerged work)
- Deploying to production (if merge-to-main triggers deployment)
- Sending external communications
- Making changes to shared infrastructure (DNS, CI/CD pipelines, cloud resources)
- Running database migrations on production

**Escalation path:**
1. Stop before acting.
2. Add a comment to the card declaring intent: "I am about to [action].  This is irreversible because [reason].  Proceeding unless you respond within [timeframe]."
3. Tag the PO.
4. Wait for confirmation.  Do not proceed on silence for genuinely irreversible actions.
5. Pull other work while waiting.

The autonomy boundaries already cover most of this under "SHOULD CONFIRM."  This pattern makes the mechanism explicit: the card comment is the confirmation request, the PO's response (or tag approval) is the confirmation.

## Pattern 4: Scope creep

**Trigger:** The agent discovers work that needs doing but is not on any card.

**Examples:**
- A bug found while working on a feature
- Technical debt that is blocking progress
- A dependency that needs updating before the current card can ship
- Documentation that is missing or wrong

**Escalation path:**
1. If the discovered work is small (under 30 minutes) and directly blocks the current card: do it, note it in the card comment, continue.
2. If the discovered work is significant: create a new card for it.  Add acceptance criteria.  Do not start it unless WIP capacity exists.
3. If the discovered work changes the current card's scope: add a comment to the card explaining the scope change.  Tag the PO if the change is material (doubles the effort, changes what "done" means, or affects other cards).
4. Never absorb significant work into an existing card without visibility.  That is how cards age and WIP limits lie.

## Pattern 5: Conflicting instructions

**Trigger:** Two sources of authority disagree.

**Examples:**
- The card says one thing, the codebase implies another
- The agent guidelines say X, the project's CLAUDE.md says Y
- A knowledge system rule contradicts what the agent observes in practice
- Two agents have made incompatible changes

**Escalation path:**
1. Do not pick a side silently.
2. Add a comment to the card describing the conflict: what says what, and which sources are involved.
3. Tag the Orchestrator (for technical/architectural conflicts) or the PO (for product/priority conflicts).
4. If the conflict is in the knowledge system: add an observation to the relevant domain's knowledge file noting the contradiction.  Do not demote a rule without PO review.
5. Pull other work while waiting for resolution.

## Pattern 6: Capacity and WIP

**Trigger:** The agent has finished its current card and is about to pull new work, but the system is at or above WIP limits.

**Escalation path:**
1. Check whether any in-progress cards are blocked or aging.  Unblocking existing work takes priority over starting new work.
2. If WIP is at limit and nothing is unblockable: do not pull new work.  Add a comment to the board or tag the PO noting that WIP is full and nothing can progress without intervention.
3. If WIP is below target: pull work.  Being under WIP is itself a flow problem.  Do not wait for permission.

## Summary: when to tag whom

| Situation | Who to tag | Where |
|---|---|---|
| Auth, security, crypto, performance regression | Quality Guardian + PO | Card comment |
| Rework cycles > 2 | Orchestrator | Card comment |
| Architectural decision affecting other workstreams | Orchestrator + PO | Card comment |
| Missing information or ambiguous acceptance criteria | PO | Card comment |
| About to do something irreversible | PO | Card comment |
| Three distinct approaches failed | Orchestrator | Card comment |
| Significant scope creep discovered | PO | Card comment (+ new card) |
| Conflicting instructions (technical) | Orchestrator | Card comment |
| Conflicting instructions (product/priority) | PO | Card comment |
| WIP full, nothing unblockable | PO | Card comment |

The common thread: **the card comment is the escalation mechanism.**  Every escalation is visible on the board, attached to the work it affects, and available to whoever picks up the conversation next.  No side channels, no hidden state, no messages that disappear when a session ends.

## What is NOT an escalation

- Routine status updates.  These go in card comments but do not need tags.
- Finishing a card.  Move it to the next column.  No approval needed for Tier 1 merges.
- Pulling new work when WIP capacity exists.  Just do it.
- Decisions within the agent's autonomy boundaries.  If the guidelines say you can, you can.

Escalation is for situations where the agent's authority or knowledge is insufficient.  If in doubt, escalate.  The cost of a false alarm (a card comment the PO reads and says "carry on") is far lower than the cost of a wrong decision the agent makes in silence.
