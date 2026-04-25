# Release Notes

## v1.2.0 — Agent-optimized navigation & session boundary forcing

**Release date:** 2026-04-25

### What changed

**1. Agent-optimized navigation** *(new)*
- Added `AGENT.md` at root level for AI agents exploring the repository
- Two working modes: "working right now" (5 min quick-start) and "surfacing to your user" (30 min research)
- Full inventory of all docs organized by theme with "when to dig deeper" user-scenario guidance
- README updated with redirect: agents now skip to AGENT.md instead of reading human-facing framing

**2. Session wrap-up forcing function** *(amplified)*
- `/lets-wrap` skill now documented in three places: README (typical day), agent-guidelines (mandatory routine), session-boundaries (implementation)
- Added explicit "Agent Wrap-up Routine" section to agent-guidelines.md making session end reflection non-negotiable
- Updated session-boundaries.md with `/lets-wrap` implementation details and checklist steps
- Why: without a forcing function, agents skip knowledge system and memory updates. Now it's part of the session boundary.

**3. Post-output blocking hook** *(documented)*
- Added comprehensive section to security.md on post-output blocking hooks (the mechanical safeguard against accidental secret disclosure)
- Includes: what it does, why it's necessary, implementation example (Claude Code settings.json config), limitations, best practices
- Added security.md to README's "Implement it" section with post-output hooks highlighted
- Mentions in typical day flow showing it's part of normal operation, not a separate concern

**4. Enhanced session startup/wrap-up in agent-guidelines.md**
- Made startup routine (5-7 steps) explicit and scannable
- Made wrap-up routine (5 steps) explicit and scannable
- Connected both to session-boundaries.md for detail

### Why this matters

- **Agents explore faster:** AGENT.md removes narrative framing; agents get scannable paths (work now vs research vs deep dive)
- **Agents don't forget:** `/lets-wrap` is now a forcing function, not a suggestion; knowledge and memory actually compound
- **Security is visible:** Post-output blocking hooks are no longer a buried "mistake we fixed"; they're documented as a core control
- **Sessions have explicit boundaries:** Start and end are now both documented procedures, not handwavy
- **New agent paradigm:** Agents know they're not just "working" — they're also reflecting, learning, and building institutional knowledge

### Action for teams using this blueprint

- **Agents:** Point your agents to AGENT.md instead of README. It's faster and more relevant.
- **Session discipline:** Ensure agents run `/lets-wrap` at session end. It's not optional. Consider blocking session close until it completes.
- **Secrets safety:** Review your Claude Code settings for the post-output blocker config. If not present, add it from the security.md section.
- **Optional:** Share AGENT.md with your agents in your dispatch instructions. Agents discovering it on their own is good; telling them saves 10 minutes.

### No breaking changes

All existing implementations continue to work. These are additions and documentation improvements.

### Commits

- `[pending]` — Agentic Kanban Blueprint v1.2.0: agent navigation, session wrap-up forcing, post-output blocking hooks

## v1.1.0 — Workflow clarity & branch lifecycle tracking

**Release date:** 2026-04-08

### What changed

**1. Workflow visualisations**
- Added ASCII diagrams of Initiative and Card workflows with aligned column groupings
- Shows the strategic continuity between epics (initiatives) and execution (cards)
- Clarifies stage names, WIP limits, and progression at a glance

**2. Terminology clarity**
- Renamed "Done" → "Needs PO Review" (removes ambiguity: this is staging, not finished)
- Renamed initiative stages: "Next" → "Refinement", "Later" → "Planning Horizon"
- All policy references updated throughout orchestrator/agent-guidelines.md

**3. Branch lifecycle & code-to-board traceability** *(new section)*
- Documents a pattern for tracking branches and PRs via board custom fields
- Makes deployment status mechanically verifiable (no orphaned branches, no false "live" claims)
- Optional pattern, but mandatory if your team adopts it
- Reduces startup tax by being codified once in the blueprint

**4. Archive automation**
- Documented the 7-day Ready to Archive → 7-day Archive → auto-delete flow
- Keeps the board clean without manual housekeeping

### Why this matters

- **Clearer for new teams:** ASCII workflows make the pattern immediately visible
- **Less ambiguity:** "Needs PO Review" is explicit; "Done" was confusing
- **Auditable code flow:** Branch tracking creates mechanical verification of deployment status
- **Lower startup tax:** One canonical source for patterns; teams reference rather than duplicate

### Action for teams using this blueprint

- **Terminology:** Update your agent guidelines to use "Needs PO Review" instead of "Done" (check your local agent-guidelines.md)
- **Optional:** Adopt the branch lifecycle tracking pattern if you want mechanical verification of deployment status
- **No breaking changes:** Existing deployments continue to work; this is clarification + a new optional pattern

### Commits

- `898174a` — Update agentic-kanban-blueprint: workflow clarity, terminology, branch lifecycle tracking
