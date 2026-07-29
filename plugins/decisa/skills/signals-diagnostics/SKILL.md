---
name: signals-diagnostics
description: Use this when tracking looks broken in Decisa — conversions missing, events not showing, CAPI/destination pushes failing, or "why is my data wrong?" Gives the read-only triage sequence that isolates WHERE the pipe is broken (events not arriving vs arriving-but-unmapped vs matched-but-not-delivered). Read decisa-orientation first.
keywords: [signals, tracking, events, delivery, capi, sinais, rastreamento, evento, entrega, "não rastreia", diagnóstico]
---

# Signals diagnostics

When tracking "looks broken," the goal is to localize the failure to one stage of
the pipe rather than guessing. Decisa's signal pipe has three failure classes, and
each has a different fix:

1. **Nothing arriving** — pixel/webhook not firing or not configured.
2. **Arriving but unmapped** — data lands but isn't recognized as a known event/
   conversion.
3. **Matched but not delivered** — conversions exist but pushback to ad platforms
   (CAPI / Enhanced Conversions / Events API) is failing.

This is all read-only triage (plus a delivery retry). No changeset needed.

## Triage sequence

1. **Overall health** — `get_signals_health`. Orients you to which stage is red.
2. **Are events arriving? (class 1)** — `list_recent_pixel_events`,
   `list_pixel_events`, `list_test_events`. Empty during known traffic → the pixel
   isn't firing or isn't installed → back to `attribution-setup`.
3. **Arriving but unmapped? (class 2)** — `list_unmapped_received_events`. Non-empty
   means signal is landing but falling on the floor for lack of a mapping → add a
   `create_pixel_event_mapping` / conversion trigger.
4. **Checkout side** — `get_webhook_coverage` surfaces the delivered-but-dropped
   class for checkout webhooks (Shopify/Stripe and Brazilian gateways like Kiwify,
   Hotmart, Cakto, Eduzz).
5. **Did conversions match? ** — `get_attribution_match_rate`; spot-check a specific
   one with `get_conversion_evidence`. **If Google traffic is involved and the match
   rate is low, run `get_google_tracking_blockers` before blaming the pixel.** With
   account auto-tagging OFF, Google never appends the `gclid` — every paid click
   arrives fully UTM-tagged and permanently unmatchable, so steps 2–4 all read green
   while the match rate quietly collapses into `direct`. Fix with
   `update_google_auto_tagging` (DRAFT changeset; `submit_changeset` →
   `approve_changeset` → `apply_changeset`).
6. **Delivery / pushback (class 3)** — `list_conversion_destinations` to see
   configured destinations and their status; `retry_conversion_delivery` to re-push
   a failed one. For Meta specifically, `get_meta_signal_diagnostics` reports event
   match quality (EMQ) and what's dragging it down.

## Reading the result

- **Red at step 2** → installation/firing problem. Fix the pixel.
- **Red at step 3** → mapping gap. Map the unmapped events; nothing else matters
  until signal stops hitting the floor.
- **Healthy through step 5 but red at step 6** → the data is fine; *delivery* is
  failing. Retry, check destination config/credentials, look at EMQ.

## Guardrails

- **Name the failure class explicitly** when you report back — "events are arriving
  but 40% are unmapped" is actionable; "tracking seems off" is not.
- **Don't conflate a delivery failure with a tracking failure** — a CAPI push that
  fails doesn't mean the conversion wasn't recorded; it means it didn't reach the
  platform.
- **A green pipe does not mean a measurable account.** Every check above can pass
  while an account-level setting makes matching impossible. `get_google_tracking_blockers`
  is the only thing that sees those; a failed read there reports `unknown`, never
  "healthy" — treat unknown as unresolved, not as a pass.
- This skill diagnoses the *pipe*. For "the ROAS number disagrees with the
  platform," use `roas-investigation` instead.
