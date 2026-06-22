---
name: campaign-launch
description: Use this when a user wants to create or build out an ad campaign in Decisa on Google, Meta, or TikTok — campaigns, ad groups/ad sets, ads, creatives, keywords, or extensions. Explains the per-platform hierarchy, the order to build it, and the hard rule that anything turning on spend goes through the changeset flow. Read decisa-orientation and changeset-safety first.
keywords: [campaign, ad, adset, "criar campanha", anúncio, "conjunto de anúncios", orçamento, "google ads", "meta ads", tiktok, lançar]
---

# Campaign launch

Building a campaign in Decisa means assembling a platform-specific hierarchy, then
turning on spend **only** through the reviewed changeset flow. Decisa's job is to
translate each platform faithfully with strong defaults — not to flatten them.

## Preconditions

- Workspace has `campaign_management_enabled` (activates after the first ad-platform
  OAuth + first sync). If campaign tools are unavailable, the account isn't connected
  yet — guide the user to connect it (`link_ad_account`, `generate_connection_link`).
- Confirm which **ad account** and which **platform**. Use `list_campaigns` /
  `list_campaign_structure` to see what already exists and avoid duplicates.

## The hierarchy (build top-down)

**Google**
- `create_google_campaign` (Search) or `create_google_pmax_campaign` (Performance Max)
- → `create_google_ad_group`
- → `create_google_responsive_search_ad` and/or keywords (`add_google_keywords`,
  `add_keyword`)
- PMax instead uses asset groups (`get_google_pmax_asset_groups`,
  `update_google_pmax_asset_group`); Shopping uses
  `create_google_shopping_listing_group_tree`
- Extensions: `create_google_sitelink`, `create_google_callout`,
  `create_google_structured_snippet`
- Targeting: `set_google_geo_targeting`, `set_google_language_targeting`

**Meta**
- `create_meta_campaign` → `create_meta_adset` → `create_meta_ad`
- Creative: `create_meta_creative` (upload assets via
  `create_meta_creative_upload_intent` / `upload_meta_ad_image` / `upload_meta_video`)
- Audiences: `create_meta_custom_audience`, `create_meta_lookalike_audience`;
  validate interests with `validate_meta_interests` / `get_meta_interest_suggestions`

**TikTok**
- `create_tiktok_campaign` (TikTok campaign tooling is thinner than Google/Meta —
  set expectations accordingly)

## Order of operations

1. **Clarify intent** — objective, daily/lifetime budget, audience, geo, and the
   landing URL. Don't invent a budget; ask.
2. **Build the structure** with sensible defaults, narrating each step.
3. **Wire tracking** — make sure the destination URL carries the right UTM /
   tracking template so conversions attribute back (see `attribution-setup` and
   `get_recommended_tracking_template`).
4. **Turn on spend through a changeset** — budgets, bids, and enabling
   (`update_campaign_budget`, `update_ad_group_budget`, `update_meta_bid_controls`,
   `enable_campaign`, `enable_ad`, …) are spend-affecting. Draft → preview →
   approve → apply per the `changeset-safety` skill. Never enable a campaign or set
   a budget silently.

## Guardrails

- **Default to paused / draft.** Assemble everything, then get explicit approval
  before anything can spend.
- **Show the full plan before approval** — structure, budget, targeting, and the
  estimated daily spend — so the user is deciding with eyes open.
- **Strong defaults, stated assumptions.** When you pick a bid strategy, match type,
  or audience default, say so and why, so the user can correct it.
- **Duplicate to iterate** — `duplicate_meta_campaign` / `duplicate_meta_adset` /
  `duplicate_meta_ad` are safer than rebuilding from scratch when testing variants.
