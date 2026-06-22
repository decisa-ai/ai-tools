---
name: funnels
description: Use this when a user wants to build, inspect, or debug a conversion funnel in Decisa — "where do users drop off", "create a checkout funnel", funnel stats/flow/replay, or step-by-step conversion paths. Gives the read-first diagnostic path and the authoring path. Mostly read-only; funnel edits do not touch ad spend. Read decisa-orientation first.
keywords: [funnel, "drop off", conversion path, funil, "onde desistem", abandono, etapas, conversão, jornada, replay]
---

# Funnels — build and diagnose conversion paths

A funnel is a multi-step path (e.g. landing → add-to-cart → checkout → purchase)
with per-step counts, so you can see *where* visitors fall out. Funnels are an
attribution-plane read surface; authoring/editing a funnel does **not** spend money
or mutate ad-platform state, so no changeset is involved — but it does require the
`attribution_enabled` capability.

## Diagnose first (read-only)

1. **Find the funnel** — `list_funnels` (saved, authored funnels), `get_funnel_catalog`
   (what's available), `get_funnel_definition` (the steps of one).
2. **See the drop-off** — `get_funnel_stats` for per-step counts/conversion, and
   `get_funnel_flow` for the observed flow graph between pages. `get_campaign_funnel`
   ties a funnel view to a specific campaign.
3. **Watch a real journey** — `get_funnel_replay` to follow actual visitor paths
   through the steps when the numbers don't explain the *why*.

Read the result by stage: a cliff between step N and N+1 localizes the problem
(e.g. big drop at checkout → payment friction; drop at add-to-cart → offer/price).
If steps look empty or wrong, the issue may be tracking, not the funnel — hand off
to `signals-diagnostics`.

## Author / curate

- **Create & shape** — `create_funnel`, `set_funnel_definition` (define the steps),
  `duplicate_funnel` to iterate on a variant.
- **Seed / refresh data** — `seed_funnel`, `reseed_funnel`.
- **Config** — `get_funnel_config` / `set_funnel_config`, and
  `set_funnel_flow_config` for the flow-graph view.
- **Domain grouping** — `list_funnel_domain_groups` / `set_funnel_domain_group`
  curate how subdomains are merged/separated/excluded in the flow.
- **Lifecycle** — `archive_funnel` / `restore_funnel` (reversible; prefer over
  deletion).

## Guardrails

- **Lead with the drop-off, not the whole funnel.** The user wants "where am I
  losing people," so name the worst step and its rate first.
- **Separate a funnel problem from a tracking problem** — empty/implausible steps
  point at `signals-diagnostics`, not a funnel redesign.
- Funnel edits are reversible and spend-neutral, so they need far less ceremony than
  campaign changes — but still confirm before archiving something in use.
