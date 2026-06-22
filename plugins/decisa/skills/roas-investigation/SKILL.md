---
name: roas-investigation
description: Use this when a user asks why a campaign is winning or losing money, why Decisa's ROAS disagrees with the ad platform's numbers, or whether a conversion is real. Gives the read-only diagnostic sequence — ROAS → discrepancy → match rate → evidence → visitor timeline — and how to tell a real performance problem from a tracking gap. Read decisa-orientation first. No changesets involved (reads only).
keywords: [roas, discrepancy, conversion, performance, retorno, atribuição, conversão, campanha, desempenho, "perdendo dinheiro", discrepância]
---

# ROAS investigation

Decisa computes ROAS from **first-party attributed conversions**, not from what the
ad platform claims. So two numbers can disagree, and your job is to find out which
is closer to the truth — and whether a "bad" campaign is genuinely unprofitable or
just under-tracked. This is all read-only; no changeset needed.

## The diagnostic ladder (stop as soon as you have the answer)

1. **Establish the number** — `get_campaign_roas` (one campaign) or `roas_report`
   (the workspace picture). Identify the campaign(s) in question.
2. **Compare to the platform** — `get_roas_discrepancy`. A gap means Decisa and the
   platform are counting conversions differently. Big gap → keep digging before you
   conclude the campaign is bad.
3. **Check tracking health before blaming performance** — `get_attribution_match_rate`.
   Low match rate = many conversions never matched to a click → the campaign may look
   worse than it is. Pair with `get_signals_health` and `get_webhook_coverage` to see
   if data is simply not arriving.
4. **Verify specific conversions** — `get_conversion_evidence` to see the trail
   behind a conversion (click → session → order), and `list_conversions` /
   `list_clicks` to inspect the raw stream.
5. **Trace a journey end-to-end** — `get_visitor_timeline` to follow one visitor
   across touchpoints when attribution looks wrong for a specific case.
6. **Where in the path do they drop?** — `get_campaign_funnel` / funnel stats to see
   whether the loss is upstream (no clicks), midstream (no add-to-cart), or at
   purchase.

## Reading the result

- **Low ROAS + healthy match rate + clean signals** → real performance problem.
  This is when a campaign change may be warranted → hand off to `changeset-safety`
  (e.g. draft a budget cut or pause). Never apply directly.
- **Low ROAS + low match rate / signal gaps / poor webhook coverage** → likely a
  *tracking* problem, not a campaign problem. Recommend fixing attribution
  (pixel, conversion triggers, webhook coverage) before touching spend. Cutting a
  campaign that's actually working but mis-tracked burns real money.
- **Discrepancy with platform but evidence checks out** → trust the first-party
  number and explain *why* it differs (platform counts view-through / different
  windows; Decisa counts matched first-party conversions).

## Always

Explain which source a number came from and how confident you are. Surface
uncertainty rather than presenting one ROAS as absolute truth — that judgment is
the whole point of the tool.
