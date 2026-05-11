# Tools and Stack

## Before you read: what you actually need vs. what's optional

| Component | Required? | Cost | Notes |
|-----------|-----------|------|-------|
| AI agent (Claude Code or similar) | **Yes** | ~£16-75/month | The engine that does the work.  Pro (~£16) for lighter use; Max (~£75) for heavy agentic workloads |
| Kanban board with an API | **Yes** | £0-38/month | Free options work (Trello, GitHub Projects).  Paid tools have better Kanban features |
| Workflow automation (n8n) | No, add later | £0 | Self-hosted, free.  Needed once you want push-based agent communication |
| Cloudflare Workers | No, add later | £0 | Needed for the push-based agent communication pattern specifically |
| Everything else below | No | £0 | Nice-to-haves with free tiers |

**Minimum to start: ~£16/month** (AI subscription + free board tool).  Everything else is optional and can be added as your system grows.

---

Every tool below was chosen because it solved a real problem in the system.  This isn't a recommendation list; it's what we actually use and why.

---

## AI Agents

### Claude Code
<!-- affiliate: anthropic -->

**Role in the system:** The engine.  Every agent (orchestrator, project agents, quality guardian, sandbox workspaces) runs as a Claude Code session, started by the PO.  The orchestrator typically uses Opus for complex reasoning; project agents typically use Sonnet for focused delivery work.

**Why this and not alternatives:** Claude Code's tool-use model (bash, file read/write, search) maps directly to software engineering workflows.  The agent can read code, run tests, make commits, and interact with APIs without custom integration.  The conversation context carries the full operating model.

**Pricing:** Claude Code is available with a Claude Pro subscription (~£16/month) or Max (~£75/month) for heavier usage.  No free tier.  Pro includes substantial usage; Max gives significantly higher daily limits, which matters for sustained agentic work.  Also available via API usage (pay-per-token).

**Get started:** [claude.ai/code](https://claude.ai/code)

**Free week of Claude Pro:** Max plan subscribers can share guest passes that give 7 days of full Claude Pro access, including Claude Code and the latest models.  If you know someone on the Max plan, ask them — each subscriber gets up to three passes, and once they are gone they do not replenish.  Watch for people sharing them on LinkedIn, Reddit (r/ClaudeAI), and Discord communities.  To activate, you will need a card on file; cancel before the 7-day window closes if you do not want to continue.

---

## Kanban Board

### Businessmap (formerly Kanbanize)
<!-- affiliate: businessmap -->

**Role in the system:** The single source of truth for all work.  Every card, column transition, WIP limit, and blocked status lives here.  Agents interact with it via the REST API through a custom CLI wrapper (see `orchestrator/bin/`).  The board provides continuity across sessions: when an agent session ends, the board state persists for the next one.

**Why this and not alternatives:** Businessmap has a proper API, supports WIP limits natively, handles blocked-in-place semantics, and has a two-level workflow (initiatives + cards) that maps well to strategic and tactical planning.  Most Kanban tools treat WIP limits as decorative.

**Pricing:** One plan, all features.  Starts at 5 users for ~£38/month (annual) or ~£46/month (monthly), scaling up in tiers.  Additional single seats can be added after the initial purchase.  Not the cheapest board option, but the API access and native Kanban semantics are what make autonomous agent interaction possible.  Evaluate whether your board tool of choice has an API before committing.

**Educational use:** Businessmap offers a full individual licence at no cost for non-commercial educational purposes.  This is not a published programme — you need to reach out to the Businessmap team directly, explain your use case and situation, and request it.  [Contact Businessmap](https://businessmap.io/contact-sales?test-header) to ask.  If you hit any friction getting this set up, raise an issue in this repo and we will try to help.

**Alternatives:** Any Kanban board with a REST API works.  The patterns in this repo are tool-agnostic; the CLI is Businessmap-specific but the structure is adaptable.  Trello, Jira, Linear, and GitHub Projects all have APIs, though their Kanban semantics vary.

**Get started:** [30-day free trial](https://businessmap.io/sign-up?referral_code=smagile30) (referral link, extended from the standard 14-day trial).  [Request a 90-day trial](https://n8n.smagile.co/form/akb-trial) if you want more runway.

---

## Workflow Automation

### n8n
<!-- affiliate: n8n -->

**Role in the system:** The handler for push-based agent communication.  When a Businessmap business rule fires on a comment event, a Cloudflare Worker forwards the payload to an n8n workflow.  n8n extracts the routing prefix, resolves the target agent, and creates an inbox card.  Also used for scheduled health checks and event-driven automation between services.

**Why this and not alternatives:** Self-hostable, so no per-execution pricing.  Visual workflow builder means automations are inspectable without reading code.  Webhook support makes it straightforward to wire into any API.  The agent can import and export workflow JSON programmatically.

**Free tier:** Self-hosted is free (open source, fair-code licence — allows free use and self-hosting but restricts redistribution).  Cloud-hosted starts at ~£19/month.

**Get started:** [n8n.io](https://n8n.io)

---

## Networking and Edge

### Cloudflare Workers

**Role in the system:** The webhook bridge in the push-based agent communication loop.  When a comment lands on a Businessmap card, a business rule fires and calls a Cloudflare Worker endpoint.  The Worker validates the request and forwards the payload to the n8n handler.  This is the glue between the board event and the automation layer.

**Why this and not alternatives:** Workers run at the edge with no cold start, handle the inbound webhook from Businessmap reliably, and add a validation layer before the payload reaches n8n.  The free tier (100,000 requests/day) is more than sufficient for any realistic agentic workload.

**Free tier:** Yes.  100,000 requests/day free.

**Get started:** [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/)

---

## Version Control and CI

### GitHub

**Role in the system:** Code hosting, pull requests, CI/CD via GitHub Actions.  Agents create branches, open PRs, and monitor CI status.  The branch-based workflow (no direct pushes to main) is enforced through the operating model.

**Free tier:** Yes.  Unlimited public repos, 2,000 Actions minutes/month on free tier.  Enough for most small teams.

**Get started:** [github.com](https://github.com)

---

## Cost summary

For a solo operator getting started:

| Component | Monthly cost |
|-----------|-------------|
| Claude Code (Pro or Max) | £16-75 |
| Kanban board | £0-38 |
| n8n (self-hosted) | £0 |
| Cloudflare Workers | £0 |
| GitHub (free tier) | £0 |
| **Total** | **£16-113/month** |

The Kanban board is the main variable.  You can start with a free tool (Trello, GitHub Projects) and the patterns still apply.  The board CLI would need adapting, but the operating model doesn't change.

The n8n and Cloudflare Workers components are only needed if you're implementing the push-based agent communication pattern.  Everything else in the blueprint works without them.
