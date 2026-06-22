---
name: changeset-safety
description: Use this whenever a Decisa task would change money or live ad-platform state — budgets, bids, pausing/enabling campaigns or ads, keywords, creatives, bulk edits. Explains the changeset lifecycle (propose → review → approve → apply → audit), single vs bulk changesets, and the rule that every spend-affecting change is previewed and approved before it touches the platform. Read decisa-orientation first.
---

# Changeset safety — never mutate spend blind

In Decisa, changes that **spend money or mutate live ad-platform state** are not
applied instantly. They go through a **changeset**: a previewable, approvable,
auditable, reversible draft. This is the single most important safety property of
the product — honor it.

## The lifecycle

```
DRAFT → APPROVED → APPLYING → APPLIED / FAILED → ROLLED_BACK
```

- **DRAFT** — proposed but inert. Nothing has changed on the platform.
- **APPROVED** — a human (or explicitly authorized actor) has signed off.
- **APPLYING → APPLIED/FAILED** — applied asynchronously, with **per-item failure
  isolation**: one bad item fails on its own without poisoning the rest.
- **ROLLED_BACK** — reverted.

Applying is idempotent (keyed), so a retry never double-charges or double-writes.

## The tools and the order to call them

1. **Create the draft**
   - `create_changeset` — a single change.
   - `create_bulk_changeset` — many changes in one reviewable unit.
   - `create_bulk_meta_changeset` — bulk Meta changes (applied per item).
2. **Review before doing anything else**
   - `get_changeset` — read back the full draft and show the user *exactly* what
     will change (entity, field, old → new, estimated spend impact). `list_changesets`
     to find existing ones.
   - `update_changeset` — amend a draft if the user wants changes.
3. **Move it forward only with explicit user intent**
   - `submit_changeset` → `approve_changeset` (or `reject_changeset` to kill it).
4. **Apply**
   - `apply_changeset` — kicks off async application. Then re-read with
     `get_changeset` to confirm `APPLIED` and inspect any per-item `FAILED` results.

## Rules for an agent operating this flow

- **Always preview before approving or applying.** Call `get_changeset` and present
  the diff to the user. Never approve+apply in one silent step.
- **Get explicit go-ahead for anything that spends money.** "Pause this $400/day
  campaign" → draft it, show it, wait for a clear yes.
- **Report failures honestly.** After apply, surface any items that came back
  `FAILED` with their reason — don't claim success because the changeset "applied"
  when items inside it failed.
- **Prefer bulk for related edits** so the user reviews and approves one coherent
  unit instead of many scattered changes.
- **It's reversible — say so.** Reassure the user that an applied changeset can be
  rolled back, but treat that as a safety net, not a license to skip review.

## What this is NOT for

Pure reads (ROAS, insights, lists, evidence) never need a changeset — see the
`roas-investigation` skill. Account/workspace config and attribution reads also
sit outside this flow. Changesets are specifically for spend- and platform-state
mutations.
