# System Architecture

## Overview

This is a hub-and-spoke model. One orchestrator coordinates multiple sub-agents, each working in their own project context. The Kanban board is the shared state layer that provides continuity across all sessions.

```
                    ┌─────────────────────┐
                    │    Kanban Board      │
                    │  (single source of   │
                    │       truth)         │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │    Orchestrator      │
                    │  (Opus / expensive   │
                    │    model, hub)       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────┴───────┐ ┌─────┴──────┐ ┌───────┴────────┐
     │  Product Agent  │ │ Website    │ │ Research Agent  │
     │  (Sonnet /      │ │ Agent      │ │ (no codebase)  │
     │   focused)      │ │            │ │                │
     └────────────────┘ └────────────┘ └────────────────┘
```

## Components

### The Orchestrator

- Runs in Claude Code (typically Opus for complex reasoning)
- Checks the board on startup: WIP state, blockers, age
- Pulls work from Ready when under WIP target
- Dispatches sub-agents to project-specific directories
- Merges knowledge inbox entries from sub-agents
- Flags decisions that need the PO's input

The orchestrator doesn't write code directly. It coordinates, plans, and manages flow.

### Sub-Agents

- Run in Claude Code (typically Sonnet for focused delivery)
- Each targets a specific project directory
- Work independently within their project scope
- Update board cards as they progress
- Write to the knowledge inbox after completing work
- Report back concisely: what was done, what's blocked, what needs a decision

Sub-agents are **task-based, not persistent**. They're spun up for a card, do the work, and finish. The board carries state between sessions, not the agent's memory.

### Satellite Workspaces

- Separate Claude Code instances for scratch work
- Not connected to the orchestrator
- Can create board cards when work becomes substantial
- Can contribute to the knowledge system via the inbox

### The Kanban Board

The board is the only shared state that persists reliably across all sessions. It holds:

- **What's in flight** (cards in Doing, Done, VR)
- **What's blocked and why** (blocked cards with reasons)
- **What's ready to pull** (cards in Ready, ordered by priority)
- **How long things have been in progress** (WIP age)
- **Strategic priorities** (initiatives workflow)

Agents interact with the board via a CLI wrapper around the board tool's REST API.

### The Knowledge System

A three-tier system that compounds learning across sessions:

```
knowledge/
├── INDEX.md                    # Domain registry
├── inbox/                      # Write-only queue for sub-agents
│   ├── README.md               # Format spec
│   └── processed/              # Archive of merged entries
├── prokanban/                  # Example domain
│   ├── rules.md                # Apply by default
│   ├── hypotheses.md           # Test with real work
│   └── knowledge.md            # Raw observations
└── <your-domain>/              # Add as needed
    ├── rules.md
    ├── hypotheses.md
    └── knowledge.md
```

See [knowledge-system.md](knowledge-system.md) for the full design.

## Communication Flow

```
PO ←→ Orchestrator ←→ Sub-agents
         │
         ├── Board (cards, comments, WIP)
         ├── Knowledge system (inbox → merge → domain files)
         └── Plans directory (research, analysis, specs)
```

- **PO ↔ Orchestrator**: Direct conversation. Radical candour. The orchestrator briefs the PO on board state and flags decisions.
- **Orchestrator → Sub-agents**: Dispatched with a card ID and project path. Sub-agents work independently.
- **Sub-agents → Orchestrator**: Report back via board comments and knowledge inbox entries. Don't flood the orchestration context with implementation detail.
- **Between agents**: Discord (or equivalent) for advisory agents that run outside Claude Code. Board comments for asynchronous coordination.

## Infrastructure (reference implementation)

The system this blueprint was extracted from runs on:

- **Local machine** (Windows): Claude Code sessions for orchestrator and sub-agents
- **Raspberry Pi 5**: Self-hosted services (Docker containers), advisory agent, n8n workflows
- **Cloudflare**: DNS, tunnels (exposing Pi services publicly), Workers (edge functions)
- **Supabase**: Hosted Postgres with RLS for SaaS products
- **GitHub**: Code hosting, CI/CD via Actions
- **Netlify / Vercel**: Static site hosting, preview deployments

This is one possible infrastructure shape. The patterns work with any combination of local, cloud, and self-hosted infrastructure.

## Security Model

### Secrets

- All secrets in a dedicated secrets manager (e.g. `pass`, Vault, 1Password CLI)
- Agents reference secrets by variable name, never by value
- `.env.example` files document expected variables
- The `.env` files themselves are gitignored

### Agent Autonomy

Autonomy boundaries are encoded in the operating model, not enforced through conversation prompting:

| Action | Permission |
|--------|-----------|
| Read, write, search, build, test | Autonomous |
| Commit to feature branches | Autonomous |
| Push feature branches | Autonomous |
| Open PRs | Autonomous |
| Merge to main | Confirm with PO |
| Deploy | Confirm with PO |
| Delete files/branches/data | Confirm with PO |
| Display secrets | Never |

### Pre-push Checks

Every push runs a security scan checking for:
- npm vulnerabilities (HIGH/CRITICAL)
- Hardcoded secret patterns
- `eval()` usage
- Accidentally committed `.env` files

FAIL = blocked. WARN = noted on the card.
