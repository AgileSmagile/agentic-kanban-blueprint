# Getting Started

This guide walks you through adapting the blueprint for your own setup. You don't need to implement everything at once. Start with the board integration, add the knowledge system when you have enough sessions to justify it, and write persona files when you have distinct agent roles.

## Prerequisites

- [Claude Code](https://claude.ai/code) installed (CLI, desktop app, or IDE extension)
- A Kanban board tool with a REST API
- A project you want agents to work on
- 30 minutes to set up

## Step 1: Set up the board

The board is the foundation. Everything else builds on it.

1. **Create a board** in your tool of choice. You need at minimum:
   - Backlog → Ready → Doing → Done → Shipped/Live
   - WIP limits on Doing (start with 3-4) and Done (start with 2)

2. **Get API access.** Most board tools offer API keys or OAuth tokens. Store the key in an `.env` file (gitignored).

3. **Adapt the board CLI.** Copy `orchestrator/bin/board-cli` and `orchestrator/bin/board-cli-helpers.js`. Update:
   - The API base URL for your board tool
   - Column IDs to match your board's structure
   - Payload shapes if your board tool's API differs from Businessmap

4. **Test the CLI.** Run `board-cli cards` and confirm you see your board data.

```bash
# Example .env
BOARD_API_KEY=your-api-key-here
BOARD_BASE_URL=https://yourorg.kanbanize.com/api/v2
BOARD_ID=4
```

## Step 2: Write your CLAUDE.md

Copy `orchestrator/CLAUDE.md` to the root of your orchestrator workspace. This is the system prompt that Claude Code reads on startup.

Adapt it:
- Replace project paths with yours
- Set your own brand rules (or remove them)
- Point to your board CLI location
- Set your secrets policy

The key sections to keep:
- **On startup** (board check, WIP review, brief the PO)
- **Secrets policy** (never display secrets — this is non-negotiable)
- **Communication standards** (radical candour, challenge bad ideas)

## Step 3: Write the agent guidelines

Copy `orchestrator/agent-guidelines.md`. This is the detailed operating model.

Start by adapting:
- **Card lifecycle**: adjust column names and IDs to your board
- **WIP limits**: start with the defaults, tune after 5-10 sessions
- **Autonomy boundaries**: decide what agents can do freely vs. what needs confirmation
- **CI/CD practices**: match your existing pipeline, or use these as a starting point

You can strip sections you don't need yet (code health dashboard, vulnerability management) and add them later.

## Step 4: Create your first card

Before you start any real work, create a card:

```bash
board-cli create "Set up agentic workflow for [your project]"
```

Then add a description:

```bash
board-cli update <card-id> description "What: configure Claude Code with board integration. Why: enable autonomous agent delivery. Done when: agent can check board, pull work, and update cards."
```

This card is your test. Move it through the workflow manually to confirm the CLI works end-to-end.

## Step 5: Run your first orchestrated session

1. Open Claude Code in your orchestrator workspace
2. The agent reads CLAUDE.md, checks the board, and briefs you
3. Set a priority (point it at your test card)
4. Let the agent pull the card to Doing and start work
5. Observe how it interacts with the board

The first session will be messy. That's normal. Note what works and what doesn't.

## Step 6: Add the knowledge system (after 3-5 sessions)

Once you've run enough sessions to have real observations:

1. Create the `knowledge/` directory structure (copy from this repo)
2. Pick 1-2 domains to start (e.g. your product domain + infrastructure)
3. Seed `rules.md` with things you already know to be true
4. Add the before/after ritual to your CLAUDE.md

See [knowledge-system.md](knowledge-system.md) for the full design.

## Step 7: Write persona files (when you have distinct roles)

If you only have one agent, you don't need separate persona files; CLAUDE.md is enough. Personas become valuable when you have:

- An orchestrator + sub-agents (different responsibilities)
- An advisory agent on a different platform (e.g. Discord bot)
- An autonomous agent with its own identity and mandate

Copy from `personas/` and adapt the role, responsibilities, and constraints.

## What to tune after your first 10 sessions

- **WIP limits.** Too high = too many things in flight, nothing finishing. Too low = agents idle waiting for capacity. Adjust based on observed throughput.
- **Card description depth.** If agents keep asking clarifying questions, your cards need more context. If they're overloaded, simplify.
- **Autonomy boundaries.** If you're approving every push and it's always fine, expand autonomy. If agents make mistakes on deploys, tighten the boundary.
- **Knowledge domains.** Add domains when you notice the same correction recurring across sessions. That's the signal.
- **SLE.** Track how long initiatives stay in Now. Set an SLE based on your 85th percentile.

## Common mistakes

1. **Starting with too much.** You don't need the full operating model on day one. Board + CLAUDE.md + agent guidelines is enough.
2. **Not using the board.** If work happens off-board, the system breaks. The board is the source of truth, not conversation history.
3. **Empty-description cards.** Every card needs What, Why, and Done When. No exceptions.
4. **Waiting for the agent to ask.** If you're directing every action, you're not getting the benefit. Let the agent pull from the board.
5. **Not writing to the knowledge inbox.** The system only compounds if agents contribute observations. No inbox entries = no learning.
