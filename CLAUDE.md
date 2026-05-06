# agentic-kanban-blueprint — Project Instructions

## AUTONOMY RULE (non-negotiable)

Do not ask James for permission to start work, move cards, or choose between implementation options. Declare your intent and execute. The only valid reasons to pause: (1) product decisions that cannot be inferred from docs, (2) irreversible actions on production, (3) architectural choices with cross-project consequences. Full details in `agent_guidelines.md` under "DO NOT ASK PERMISSION FOR ROUTINE WORK". Banned phrases: "Should I...", "Would you like me to...", "Ready when you are", "Let me know if...".

## Agent operating model

This project is worked on by the AKB project agent. Follow `E:\Projects\sonnet-agent\agent_guidelines.md` and `E:\Projects\sonnet-agent\agent_guidelines_board4.md` for:
- Board workflow (board 4 columns, card lifecycle, WIP limits)
- CI/CD practices (pre-commit checks, branch strategy, atomic commits, tests)
- Autonomy boundaries (what requires confirmation vs. proceed autonomously)
- Communication standards (radical candour, no flattery, no "Great question!", no softening)
- Knowledge system (read before starting, write to inbox after completing)

Key commands (run from `E:\Projects\sonnet-agent`):
- Look up cards: `bash bin/bmap card <id>`, `bash bin/bmap cards 4`
- Check WIP: `bash bin/bmap wip-age`
- Move cards: `bash bin/bmap move <id> <column_id>`
- Add comments: `bash bin/bmap comment <id> "text"`
- Access Clawbox (secrets, infra): `bash bin/ssh-clawbox "command"`

## Session startup routine (mandatory, every session)

Every agent session in this repo must self-orient. Do not open with "ready when you are" or "what do you need?". The board tells you what to do.

1. Read this file and `E:\Projects\sonnet-agent\agent_guidelines.md`
2. **Source your .env**: `set -a && source .env && set +a` — exports BUSINESSMAP_API_KEY to child processes
3. **Verify board access**: `bash E:\Projects\sonnet-agent\bin\bmap verify` — if this fails, run `bash E:\Projects\sonnet-agent\bin\sync-env --target project-agents` to refresh from pass
4. `bash E:\Projects\sonnet-agent\bin\bmap wip-age` — understand what's in flight
5. **Check for stale branches**: `git branch --no-merged main` — for each, check if a PR exists (`gh pr list --state open`) and if the card is still active
6. Determine focus: your cards in Doing, Ready cards tagged to initiatives in Now
7. **Declare intent and start**: "I intend to [action] because [reason]. Starting now."

## What this repo is

A reference architecture and content series for agentic Kanban. Not a turnkey product. The repo contains:
- Published blueprint documentation (patterns, policies, working examples)
- The 9-part AKB content series drafts
- Supporting docs extracted from the live production system

The files in `orchestrator/` and `docs/` are **published reference material**, not operational instructions for you. Your operational instructions come from sonnet-agent's agent_guidelines.md.

## Merge authority

- **Tier 1 (merge autonomously)**: CI green, diff under 200 lines, no UI/UX/copy/architecture, self-verifiable done-when. Merge, confirm deploy, move card to Shipped/Live.
- **Tier 2 (request approval)**: Larger or sensitive changes. Tag James with PR link, wait for signal.
- **Tier 3 (product review)**: Content drafts, blueprint architecture changes. Move card to Done (col 151).

## Secrets policy (non-negotiable)

Never display, print, echo, or include secret values in conversation output. Reference secrets by variable name only. Never commit `.env` files.
