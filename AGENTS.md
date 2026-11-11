# KIRION FORGE — Kirjane full redesign R2

**Authoritative issue:** https://github.com/Kirch-Nairu/kirjane-site/issues/5  
**Branch:** `design/kirjane-full-rebuild-r2`  
**Status:** Blueprint staged. **No R2 frontend implementation or browser QA yet.**  
**Writer:** Antigravity, single writer on the workstation. Main and R1 Draft PR #4 must stay unchanged.

## Read first
- `docs/R2_VISUAL_BLUEPRINT.md`: original Kirjane design direction and specific page compositions.
- `docs/R2_FRONTEND_ARCHITECTURE.md`: routing, source structure, motion boundaries and QA plan.
- `docs/R2_CONTENT_PROVENANCE.md`: claims, product status, consent and assets.
- `docs/R2_ACCEPTANCE_MATRIX.md`: test matrix and owner sign-off.
- Valencia reference branch for execution discipline only; R1 branch for salvage of verified testing/functional infrastructure only.

## Non-negotiable execution
This mission is a **complete frontend redesign**, not another CSS adjustment. Build the visual system, then all six pages, then real motion. The hero must be visually inspected at 1440/768/390/360 before the rest of the site adopts the direction; this is an internal self-correction gate, not a user-delay checkpoint. Do not present an uninspected build as done.

Do not port Astro, replicate Valencia's look, reuse R1 layout wholesale, insert fake product interfaces or team portraits, fabricate business claims, or adopt unrelated UI kits. Keep genuine Kirjane branding, backend/enterprise engineering positioning and real projects. Full accessible mobile treatment is mandatory.

No merges, public deployment or DNS updates without explicit owner approval.
