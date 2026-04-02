# Getting Started

This guide walks you through adapting the blueprint for your own setup.

You don't need to implement everything at once. Start with the board integration, add the knowledge system when you have enough sessions to justify it, and write persona files when you have distinct agent roles.

## Before you start

### What you'll need

- **An AI coding assistant that can use tools.** This blueprint was built with [Claude Code](https://claude.ai/code), but the patterns work with any AI assistant that can read/write files, run terminal commands, and interact with APIs. Claude Code is available as a CLI, desktop app, web app, and IDE extension.
- **A Kanban board.** Any tool with columns and cards works. If you want agents to interact with the board automatically (creating cards, moving them, checking what's in progress), you'll need one with an API. [Businessmap](https://businessmap.io), [Trello](https://trello.com), [Linear](https://linear.app), and [GitHub Projects](https://github.com) all have APIs.
- **A project to work on.** Something you want an AI agent to help deliver.
- **30 minutes** for the basic setup.

### What these terms mean

If any of the terminology in this repo is unfamiliar, here's a quick reference:

| Term | What it means |
|------|--------------|
| **Agent** | An AI assistant that can take actions (read files, run commands, write code), not just answer questions |
| **Orchestrator** | An agent whose job is to coordinate other agents, check the board, and decide what to work on next |
| **Sub-agent** | An agent dispatched by an orchestrator to do focused work on a specific task |
| **CLAUDE.md** | A file that Claude Code reads automatically when it starts. It contains instructions that shape the agent's behaviour for a specific project. Other AI tools have similar concepts (custom instructions, system prompts, rules files). |
| **Soul file** | A document that defines an agent's identity, values, and communication style |
| **WIP** | Work in progress. The number of things being worked on at the same time. |
| **WIP limit** | A cap on how many items can be in a column at once. Prevents overload and makes bottlenecks visible. |
| **WIP age** | How long a card has been in progress. Older items signal potential problems. |
| **SLE** | Service Level Expectation. A target for how long work should take (e.g. "5 days or less, 80% of the time"). |
| **Board CLI** | A command-line script that lets agents interact with the Kanban board via its API |
| **Knowledge system** | The three-tier learning structure (knowledge, hypotheses, rules) that helps agents improve across sessions |
| **PO** | Product owner. The human who sets priorities and makes product decisions. |
| **PR** | Pull request. A way to propose code changes for review before merging them into the main codebase. |
| **CI/CD** | Continuous integration / continuous deployment. Automated checks that run when code is submitted (tests, linting, security scans). |

## Step 1: Set up the board

The board is the foundation. Everything else builds on it.

1. **Create a board** in your tool of choice. You need at minimum these columns:
   - Backlog (where new work goes)
   - Ready (work that's been defined well enough to start)
   - Doing (work in progress)
   - Done (work waiting for your review)
   - Shipped/Live (work that's been deployed or completed)

2. **Set WIP limits.** These cap how many cards can be in a column at once:
   - Doing: start with 3-4
   - Done: start with 2
   - You'll tune these after a few sessions

3. **Get API access** (if you want agents to interact with the board automatically). Most board tools offer API keys in their settings. Store the key securely (not in a file that might accidentally be shared).

4. **Adapt the board CLI** (optional, for automated board interaction). Copy `orchestrator/bin/board-cli` and `orchestrator/bin/board-cli-helpers.js`. Update:
   - The API base URL for your board tool
   - Column IDs to match your board's structure
   - Payload shapes if your board tool's API differs from Businessmap

5. **Test the CLI.** Run `board-cli cards` and confirm you see your board data.

```bash
# Example .env (environment variables file)
BOARD_API_KEY=your-api-key-here
BOARD_BASE_URL=https://yourorg.kanbanize.com/api/v2
BOARD_ID=4
```

## Step 2: Write your CLAUDE.md

CLAUDE.md is the file that tells Claude Code how to behave for your project. It's read automatically when Claude Code starts in a directory that contains it. (If you're using a different AI tool, adapt this to whatever custom instructions mechanism it supports.)

**You need one in every project directory, not just the orchestrator.** This is a common mistake. If a sub-agent is dispatched to a project directory that has no CLAUDE.md (or a thin one), it starts without knowing how to access the board, where secrets live, or how to communicate. It either wastes time asking or gets things wrong.

Copy `orchestrator/CLAUDE.md` to the root of your orchestrator workspace. For each project directory, use the template in the agent-guidelines.md (under "Project CLAUDE.md template") to create a project-specific version.

**Every project CLAUDE.md must include:**
- **Agent operating model** — pointer to agent-guidelines.md with specific areas listed
- **Key commands** — board CLI commands and infrastructure access. Agents can't use tools they don't know exist.
- **Communication** — standalone section: "Be direct, honest, specific. No flattery. Challenge questionable ideas, push back, and ask questions wherever they come up. Do not wait for a retrospective to surface continuous improvement ideas."
- **Secrets policy** — standalone section, not a pointer. How secrets are managed, what agents must never do with values.
- **Domain knowledge** — which knowledge domains are relevant to this project
- **Hosting and deployment** — where it runs, how it's deployed, environment separation

The communication and secrets sections are standalone (not just pointers to the guidelines) because they're too important to risk a sub-agent missing. A few lines of duplication is cheaper than leaked secrets or sycophantic output.

## Step 3: Write the agent guidelines

Copy `orchestrator/agent-guidelines.md`. This is the detailed operating model that tells agents how to work: card standards, workflow rules, autonomy boundaries, and quality practices.

Start by adapting:
- **Card lifecycle**: adjust column names to match your board
- **WIP limits**: start with the defaults, tune after 5-10 sessions
- **Autonomy boundaries**: decide what agents can do freely vs. what needs your confirmation
- **CI/CD practices**: match your existing development pipeline, or use these as a starting point

You can strip sections you don't need yet and add them later. The minimum viable version is: card lifecycle, WIP limits, and autonomy boundaries.

## Step 4: Create your first card

Before you start any real work, create a test card. If you've set up the CLI:

```bash
board-cli create "Set up agentic workflow for [your project]"
```

Then add a description:

```bash
board-cli update <card-id> description "What: configure AI agent with board integration. Why: enable autonomous delivery. Done when: agent can check board, pull work, and update cards."
```

If you haven't set up the CLI, create the card manually in your board tool. The important thing is that every piece of work starts as a card with a clear description: **What** needs doing, **Why** it matters, and **Done when** (what finished looks like).

Move this card through the workflow manually to confirm everything works.

## Step 5: Run your first orchestrated session

1. Open Claude Code (or your AI tool) in your project directory
2. The agent reads CLAUDE.md, checks the board, and briefs you on what's in progress
3. Point it at your test card
4. Let the agent pull the card to Doing and start working
5. Watch how it interacts with the board

The first session will be messy. That's expected. Note what works and what needs adjusting.

## Step 6: Add the knowledge system (after 3-5 sessions)

Once you've run enough sessions to have real observations worth capturing:

1. Create the `knowledge/` directory structure (copy from this repo)
2. Pick 1-2 domains to start (e.g. your product domain + infrastructure)
3. Seed `rules.md` with things you already know to be true about those domains
4. Add the before/after ritual to your CLAUDE.md: read rules before starting a task, write observations after finishing

See [knowledge-system.md](knowledge-system.md) for the full design and reasoning.

## Step 7: Write persona files (when you have distinct roles)

If you only have one agent, you don't need separate persona files; CLAUDE.md is enough. Personas become valuable when you have:

- Multiple agents with different responsibilities (one for delivery, one for research)
- An advisory agent on a different platform (e.g. a Discord bot)
- An autonomous agent with its own identity and mandate

Copy from `personas/` and adapt the role, responsibilities, and constraints.

**File naming matters for auto-loading.** Different AI platforms auto-load different files:
- **Claude Code** auto-loads `CLAUDE.md` (uppercase) from the project root
- **OpenClaw** auto-loads uppercase files like `SOUL.md` and `AGENTS.md` from the agent workspace; lowercase `soul.md` and `instructions.md` are not auto-loaded and must be referenced explicitly in config

This repo uses lowercase filenames for readability. If your platform requires uppercase for auto-loading, rename accordingly. See [cross-runtime.md](cross-runtime.md) for more detail.

## What to tune after your first 10 sessions

- **WIP limits.** Too high = too many things in flight, nothing finishing. Too low = agents idle waiting for capacity. Adjust based on what you observe.
- **Card description depth.** If agents keep asking clarifying questions, your cards need more context. If descriptions are overwhelming, simplify.
- **Autonomy boundaries.** If you're approving every action and it's always fine, expand autonomy. If agents make mistakes, tighten the boundary.
- **Knowledge domains.** Add domains when you notice the same correction recurring across sessions. That's the signal that something should be captured as a rule.
- **SLE.** Track how long items stay in progress. Set an SLE based on your actual throughput.

## Common mistakes

1. **Starting with too much.** You don't need the full operating model on day one. Board + CLAUDE.md + agent guidelines is enough to start.
2. **Not using the board.** If work happens off-board, the system breaks. The board is the source of truth, not conversation history.
3. **Empty-description cards.** Every card needs What, Why, and Done When. No exceptions. A card without a description is a card no future agent can act on.
4. **Waiting for the agent to ask.** If you're directing every action, you're not getting the benefit of autonomy. Let the agent pull from the board.
5. **Not writing to the knowledge inbox.** The system only compounds if agents contribute observations after finishing work. No inbox entries = no learning over time.
