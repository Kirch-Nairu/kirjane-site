# KIRJANE CREATIVE FORGE R4 — CODEX CONTINUITY REMASTER HANDOFF

**MISSION:** `KIRJANE-R4-CONTINUITY-ASSET-REMASTER`
**EXECUTOR:** Codex (dedicated Blender / source / browser implementation worker)
**ART DIRECTOR + MAINTAINER:** ChatGPT, acting under Kirch's creative authority
**OWNER:** Kirch — approval and publication only by owner
**REPOSITORY:** `Kirch-Nairu/kirjane-site`
**R3 FROZEN BASE:** `7f3a3147c225aea8617820136b509306db3a143f`; Draft PR #15
**R4 MAINTAINER:** `experiment/kirjane-creative-forge-r4-asset-library`; Draft PR #17
**WRITER BRANCH:** `experiment/codex-r4-continuity-remaster`
**TRACKER:** Issue #16
**STATUS:** IMPLEMENTATION NOT STARTED / NO MERGE / NO DEPLOY

## Exact intent
Remaster the website's EXISTING visual language. Not a new design competition. Improve the actual images, current CGI pieces, materials, lighting, 252 cinematic image frames and four posters where warranted, animation choreography, SVG fallback aesthetics and other live illustrations. The already integrated R3 motion and 23-scene film are the creative and timing baseline.

**Baseline fidelity first.** For each asset, preserve what makes it recognizable: subject, silhouette, motif, scene narrative, section placement, selected service/industry/engine relationships, camera perspective when possible, semantic interaction states, scroll rhythm and chapter progression. Make existing beauty dramatically better through Blender editing, sophisticated materials, realistic studio lighting, quality texture/surface work, improved anti-aliasing, scene-depth separation and editorial color direction. Improvements that require substantive conceptual changes must be explained and proposed for maintainer approval before implementation.

**ABSOLUTE LOCK:** Original official 2D chameleon comes from Drive. No edits, redrawing, tracing, regenerating, recoloring, 3D models or substitutes. Existing Kirjane logo and wordmark unchanged. The rejected Blender chameleon and generic Engineered Core are excluded from the website.

## What DOES NOT count
- Two entirely new concept directions for the Services section.
- New approval machines, dioramas, robotic figures, randomly rotating engines or assets unrelated to current site graphics.
- Replacing the original Home fragmented→assembled motion arc with unrelated shapes.
- Replacing the Salryn kernel's visual identity with a new object.
- New scroll stages, page architecture or scene directors when the current rhythm already works.
- An endless green-on-green treatment, or recoloring the logo as part of a palette exercise.
- Beautiful standalone Blender screenshot without a clearly improved actual site frame.

## Required deliverables — source-based, not speculative
**D0: Active asset/animation manifest.** On the actual 7-route R3 candidate, capture browser network trace, all direct HTML media, CSS/JS-generated assets, which animation owner controls each surface and where fallback is used. Distinguish 342 repository raster/SVG paths from ACTUALLY ACTIVE media. Record file, route, selector, state, timing/phase and source. Record 252 numbered frames + 4 posters correctly.

**D1: Baseline visual/motion evidence.** Before editing, capture each targeted scene at matched desktop 1440x900, phone 390x844 and 320x700, normal and reduced motion, selected interaction states, scroll phase, forward/reverse recordings. Identify artistically weak aspects: lighting, surface finish, composition, green saturation, blurry edges, visual hierarchy, tiny subjects.

**D2: REMASTERED ORIGINAL ASSETS.** Revise the actual existing artwork in context. Prioritize existing source image / frame / model, matching visible shape and scene timing. When original .blend master is missing, rebuild a faithful, source-constrained editable Blender version; disclose fidelity limits. Do not invent new subject matter just because source master is unavailable.

**D3: Editable production masters.** Versioned .blend projects, meshes/materials/cameras/animation tracks where authored; texture sources, scene files, original-vs-remaster ledger and only appropriate GLB exports. Do NOT require a GLB for an asset best delivered as a composited WebP.

**D4: Website-ready replacements and animation refinements.** Desktop/mobile/retina-aware optimized WebP/PNG/posters, frame sequences retaining expected naming, frame count, phase order and player hooks, or well-supported runtime GLB. Preserve current GSAP/ScrollTrigger state, existing one-scroll-owner policy, control authority and scene selector contract.

**D5: Color/finish modernization.** Reduce heavy green dominance while respecting original graphic color continuity. Apply selective cobalt/cyan/amber/ivory/titanium/lilac and deliberate light/dark chapter variation where they improve separation. Material studies ARE NOT a new brand palette. Official chameleon and marks never change.

**D6: Real website integration proof.** One-for-one asset reference changes on the Codex R4 worker branch; side-by-side exact viewport, same scroll progress and controls, plus short motion recordings. All improvements evaluated at page scale, not isolated Blender studio scale. Revert an asset that fails visual review.

**D7: QA and attribution.** Export sizes, geometry/texture budget if used, license/source provenance, R3 61 production / 79 R2 / 68 integrated film / 30 math / 233 focused floors, route and fallback tests. Independent source review and Kirch creative approval remain pending until formally done. No merge/deploy.

## No unnecessary design options
A single faithful remaster direction is the default. The worker may internally try variants of light, camera, material, grading or level of detail on the SAME source asset. Do not deliver alternative unrelated concepts or spend the assignment on option boards.

## Work order and first target
0. Read existing R3 motion architecture, gallery and frame player. Reproduce existing website in local HTTP Chromium and capture phase-accurate before.
1. FIRST PILOT: `site/assets/cinematic/editorial-cap-02-process-automation.webp`, paired with the existing Home Services Automation state in `site/js/forge-service-scene.js`. Preserve the ring/route motif and four-state Services rhythm. Use Blender for improved depth, material, legibility, light hierarchy and selective accent colors. Recreate the old art faithfully when no Blender source exists. The page's active geometry may receive material/lighting/polish first; do not replace with another machine.
2. Home fragments → clarity, retaining current 72 desktop / 36 mobile frame counts and progressive phases if those sources are changed.
3. Salryn master kernel hero, documentary progression (96 desktop / 48 mobile frames), 8-engine configurator visuals, industry and offline supporting art; no silhouette/meaning rewrite without approval.
4. Process, Services page, Projects, About, Contact: inspect and remaster ACTUAL active stills and motions.
5. 23-scene film: only surface/framing polishing that is provably compatible with its fixed scene order, cursor position, scroll, sound opt-in and accessible UI.

Deliver the first REAL before/after and actual editable Blender asset, not an alternative concept pitch, before broadening scope.

## Explicit accept/reject rubric
**REVIEW_READY** only when the same existing visual can be recognized in before and after, quality meaningfully improves, motion feels familiar/better, color balance improves, mobile stays readable, assets are source-backed and HTML interaction is unchanged. If not, mark FIX_REQUIRED and leave original intact.

Authority: Codex writes; ChatGPT visually critiques and requests bounded revisions; independent Nox may verify source on exact SHA; Kirch decides brand/publication. All work occurs in active agent executions—not claimed asynchronous delivery.
