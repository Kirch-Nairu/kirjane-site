# Kirjane R3 M03 R4 — cinematic Process polish / two-pass self-review

**Target:** `Kirch-Nairu/kirjane-site` draft PR #8, `feat/r3-homepage-cinematic-storytelling`.
**Frozen input:** `a32a293a31dd0fec20fb27398434593bcdd37293`.
**Scope:** existing full-screen Process chapter only, plus repository-wide self-review automation and maintenance of an obsolete test.
**No merge / no Vercel preview / no Hostinger deployment.**

## Implementation — pass 1

Existing screenshot showed a good layout but subdued artwork and tiny navigation. All changes preserve the owner's approved hero, Services, five-pillar panorama, centered active stage, and five-step sequence.

1. **Pillar readability:** raised the existing raster's base brightness `.73 → .82`, focus brightness `1.23 → 1.38`, and focus opacity `.85 → .96`; reduced the global dark overlay slightly while retaining deep shadows behind copy. No SVG, particles, new image or model.
2. **Editorial hierarchy:** while pinned, initial heading opacity gradually descends from ~0.95 at the first stage to ~0.74 at the fifth; on mobile, narrow/short viewports, reduced motion, and no JS the original intro remains fully readable at opacity 1.
3. **Text transitions:** preserved stage state ownership and reversed-scroll correctness, but softened each WAAPI reveal from opacity `.35` to `.66` and adjusted duration `300ms → 360ms`. Animation cancellation on rapid stage changes remains in place.
4. **Progress rail:** clearer inactive text, active weight/contrast, stage numbers and slightly larger navigation hint. Original rail structure and keyboard actions remain unchanged.
5. **Permanent review gate:** added `CONTRIBUTING.md`, `.github/pull_request_template.md`, `scripts/check_review_gate.py`, and `.github/workflows/site-self-review.yml`. PR metadata validation is automatic, and Chromium tests plus syntax/generator-parity are configured to run for all future site PRs. **GitHub branch protection / required check configuration remains an administrative task**; do not claim it is enabled.

## Adversarial re-review — pass 2

- Captured real rendered Chromium inlined-source screenshots for stages 1, 3 and 5 at 1440×900; no header/active-text/progress overlap, and the final-stage title fits.
- Checked scroll forward/backward, direct selection and reduced-motion state via the prior stability suite; neither stage authority nor focus mapping was modified.
- Ran focused R4 checks for base/focus luminosity, intro de-emphasis, five stage titles/rail collisions and fallback opacity.
- Compared frozen worktree hashes: **22 protected sources unchanged** (12 approved WebPs, 5 inner routes, index and generator, shared CSS/JS, 404).
- Fresh rebuild of generated pages produced byte-identical output; checked Node scripts and Python compile.
- **Found pre-existing stale test:** `scripts/qa_r3_home.py` still expected the split Services illustration (`.r3-service-preview` and viewport margins), which were removed in R3-A1. Corrected the test expectations to assert the current edge-to-edge visual and actual 100svh stage. It now passes 11/11. This was a test-contract error, not a new R4 UI defect.

## Local test outcomes

| Suite | Result |
| --- | --- |
| R4 polish hierarchy and luminosity | **8/8 PASS** |
| M03 stabilization / adversarial scroll | **12/12 PASS** |
| R3 centered stage responsive layout | **12/12 PASS** |
| Previous M03 progressive Process | **11/11 PASS** |
| Hero / Services separator | **6/6 PASS** |
| R3-A1 full-bleed Services | **12/12 PASS** |
| Legacy M01/M02, corrected for full-bleed | **11/11 PASS** |
| **Total local checks** | **72/72 PASS** |

All browser tests used the actual rendered HTML/CSS/JS/WebP content in an inline Chromium harness, **not browser navigation to a localhost server**. These counts are distinct configured cases, not independent production release certifications.

## Open risks and honest release boundary

- **PENDING:** Real Windows localhost Chrome scroll, text legibility, visual acceptance; multiple display scales and touch devices.
- **PENDING:** Independent reviewer, Firefox and WebKit, WCAG 2.2 AA, GPU/paint and frame pacing on typical laptops; no measured field Core Web Vitals.
- **PENDING:** GitHub-hosted CI result and administrative ruleset requiring the status check; adding a workflow does not assert it has run or is required.

**Verdict:** `SELF_REVIEW_PASS_OWNER_QA_PENDING`. Keep PR draft and `main` unchanged.
