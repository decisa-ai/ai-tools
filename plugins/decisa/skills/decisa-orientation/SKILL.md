---
name: decisa-orientation
description: Read this FIRST whenever working with the Decisa MCP server. Explains how Decisa is structured, the mandatory workspace-discovery step, capability gating, read vs write scopes, and the four core domain models (changesets, attribution, capabilities, funnels) every other Decisa skill builds on. Use before calling any other Decisa tool, or whenever a Decisa call returns "tool unavailable" or a workspace error.
---

# Decisa orientation

Decisa is an **advertising operating system** exposed over MCP. It combines two
modules in one workspace:

- **Campaign Management** — connect Google / Meta / TikTok ad accounts, edit
  campaigns through a safe draft flow, audit, and act on AI advice.
- **Attribution** — UTM links, a first-party click tracker, checkout webhooks,
  a canonical order schema, real ROAS by campaign, and conversion pushback (CAPI).

A workspace may use either module or both. The server exposes ~250 tools. Do not
scan them blindly — work from the job you are doing and follow the recipes in the
companion skills (`changeset-safety`, `roas-investigation`, …).

## The two rules you must never skip

**1. Discover the workspace before anything else.** Decisa runs in *account mode*:
one connection spans every workspace you belong to. So:

1. Call `list_workspaces` first.
2. Pass the chosen `workspace_id` on **every** subsequent tool call.
3. Optionally call `set_workspace_focus` once so the active workspace is implied
   for later calls in the session.

Never guess a `workspace_id`. If the user has more than one workspace and hasn't
said which, ask.

**2. Treat money- and platform-changing actions as drafts, not direct writes.**
Anything that spends money or mutates live ad-platform state routes through the
**changeset** flow (propose → review → approve → apply → audit). Never assume a
mutation applied instantly. See the `changeset-safety` skill before mutating.

## Capability gating — why a tool may be "unavailable"

Capabilities are **workspace-scoped** and **self-activating from user actions** —
they are never a manual toggle:

| Capability | Activates when | Gates |
|---|---|---|
| `attribution_enabled` | first UTM link / pixel install / checkout webhook | attribution tools |
| `campaign_management_enabled` | first ad-platform OAuth + first campaign sync | campaign tools |

If a Decisa tool reports it is unavailable for a workspace, that workspace has not
activated the required capability — that is expected, not an error. Tell the user
what action would activate it (e.g. "create a UTM link or install the pixel to turn
on Attribution"), don't try to force it.

## Read vs write scopes

The connection token carries scopes: `mcp:read` (read-only tools), `mcp:write`
(mutating tools, includes reads), or the legacy `mcp:use` (both). If a write tool
is refused on scope grounds, the connection was authorized read-only — the user
must re-authorize with write access. Never treat this as a bug to code around.

## The four domain models to keep in your head

1. **Changesets** — the lifecycle for spend/platform mutations:
   `DRAFT → APPROVED → APPLYING → APPLIED / FAILED → ROLLED_BACK`. Applied
   asynchronously with per-item failure isolation. Reversible and audited.
2. **Attribution chain** — `UtmLink → Click → Session → Order → AttributedConversion`.
   ROAS and discrepancy numbers are computed from attributed conversions
   (first-party truth), which can differ from what the ad platform reports.
3. **Capabilities** — see the table above; they shape which tools exist per workspace.
4. **Funnels** — multi-step conversion paths with per-step stats, replay, and
   flow config; used to diagnose where users drop off.

## Decisa is an advisor, not an autopilot

When proposing changes: explain the reasoning, surface uncertainty, prefer
suggestions over silent actions, and keep everything reversible and auditable.
Never apply an irreversible or money-spending change without showing the user the
draft first and getting a clear go-ahead.

## Where to get more

- `get_decisa_docs` — in-product guides (tracking templates, attribution, changesets).
- Full documentation: https://docs.decisa.ai
