---
name: attribution-setup
description: Use this when a user wants to start tracking conversions in Decisa, set up or verify attribution — UTM links, the first-party pixel, pixel event mappings, conversion triggers, or checkout webhooks. Gives the setup order and the verification steps that prove data is actually flowing. Read decisa-orientation first.
---

# Attribution setup

Attribution is Decisa's revenue-truth layer: `UtmLink → Click → Session → Order →
AttributedConversion`. Setting it up means establishing each link in that chain and
then **verifying data actually arrives** — half-configured tracking is worse than
none because it silently undercounts.

Creating the first UTM link, installing the pixel, or registering the first checkout
webhook **self-activates** `attribution_enabled` — there is no manual toggle.

## Setup order

1. **Tag the traffic — UTM links.** `create_utm_link` builds trackable short links;
   `get_recommended_tracking_template` returns the right template so `gclid` /
   `fbclid` / `ttclid` get captured on click. Manage with `list`/`update`/
   `delete_utm_link`.
2. **Install the pixel.** `create_pixel` provisions the first-party tracker; embed
   it on the site. `set_pixel_focus` to make a pixel the active one for the session.
3. **Map pixel events.** `create_pixel_event_mapping` tells Decisa how site events
   (view, add-to-cart, purchase) map to canonical events. Inspect/adjust with
   `list`/`update`/`delete_pixel_event_mapping`.
4. **Define what counts as a conversion.** `create_conversion_trigger` (group them
   with `create_trigger_group`) sets the rules that turn raw events into conversions.
5. **Connect checkout webhooks** for server-side purchase truth (Shopify, Stripe,
   Kiwify, and the generic mapper). Secret rotation: `rotate_inbound_webhook_secret`.
6. **Set the model.** `get_attribution_config` / `set_attribution_config` controls
   the attribution model (e.g. last-click) and windows.

## Verify it's actually flowing (do not skip)

- `list_recent_pixel_events` / `list_test_events` — are clicks and events arriving?
- `list_unmapped_received_events` — events arriving but **not** mapped to a known
  type. A non-empty list means you're dropping signal; add a mapping.
- `get_webhook_coverage` — the delivered-but-dropped class for checkout webhooks.
- `get_signals_health` — overall pipe health.
- `get_attribution_match_rate` — how many conversions matched back to a click. Low
  match rate after setup = something upstream (UTM template, pixel, click capture)
  is misconfigured.

## Guardrails

- **Prove each step before moving on.** After installing the pixel, confirm events
  land before declaring tracking "done."
- **Treat a low match rate as a setup bug, not a fact of life** — chase it back up
  the chain.
- For deeper "tracking is broken" debugging, hand off to `signals-diagnostics`. For
  "the numbers look wrong," hand off to `roas-investigation`.
