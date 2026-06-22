---
name: signals-diagnostics
description: Use this when tracking looks broken in Decisa — conversions missing, events not showing, CAPI/destination pushes failing, or "why is my data wrong?" Gives the read-only triage sequence that isolates WHERE the pipe is broken (events not arriving vs arriving-but-unmapped vs matched-but-not-delivered). Read decisa-orientation first.
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
   class for checkout webhooks.
5. **Did conversions match? ** — `get_attribution_match_rate`; spot-check a specific
   one with `get_conversion_evidence`.
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
- This skill diagnoses the *pipe*. For "the ROAS number disagrees with the
  platform," use `roas-investigation` instead.
