# KIRION ATELIER — CODEX BLENDER ASSET WORKER R4

Mission ID: KIRJANE-ATELIER-BLENDER-ASSET-REMASTER-R4
Worker: Codex running on the Kirjane creative-lab Windows machine, with the already registered local mcp-for-blender server or Blender Python as fallback.
Role: single writer / 3D motion and texture production specialist.
Maintainer and art direction: ChatGPT in KIRCH authority, review at exact SHA.
Owner veto and publication authority: Kirch.
Target working branch (created from maintainer R4 docs, not R3): experiment/codex-r4-blender-asset-worker.
Initial visual vertical slice: Home Services AUTOMATION mode plus its active supporting WebP source.
Do NOT work on the mascot. Existing official 2D chameleon is LOCKED, from Drive.

## Read before working
1. docs/creative-forge-r4/DESIGN_DIRECTION.md
2. docs/creative-forge-r4/REPLACEMENT_MATRIX.csv
3. docs/creative-forge-r4/SOURCE_AUDIT.md and ASSET_INVENTORY_R3.csv
4. docs/creative-forge-r4/COLOR_MATERIAL_STUDY.json
5. docs/creative-forge-r4/QUALITY_GATES.md
6. Existing R3 source: docs/codex-r3/INTEGRATION_CONTRACT.md; docs/codex-r3/SHOT_MAP.md; docs/codex-r3/FINAL_REVIEW.md; site/js/forge-service-scene.js; site/index.html; site/services.html; frame-sequence-player.js; creative/src/main.jsx.
7. Confirm current branch is the worker branch and direct parent is the R4 maintainer documentation commit; record exact SHA, status and no unexpected uncommitted changes.

## Absolute boundaries
- Never overwrite PR #15 or its code writer branch. Never modify main, R2, R5 parent or merge.
- Never modify canonical logo, mark, wordmark or 2D chameleon. Don't design a new mascot.
- Do not replace scene controls or edit the 23-scene film while doing first Services vertical slice.
- Preserve all semantic text, focus controls, full keyboard behavior, seven static HTML routes, JS-off fallback, reduced motion, SEO, forms and local-first honest qualifiers.
- No new dependencies without necessity, pinned rights audit and maintainer review.
- Generated assets are Kirjane-specific and licensed/attributed in own ledger; do not use unlicensed external art.
- No production deployment, secrets, account credentials, malware or model-generating paid API calls.
- User workstation Iris Xe integrated GPU: Eevee preview, budget renders; no physical performance claim without measured data.
- At least two visual treatment alternatives for the SAME existing subject, not an invented new subject. Discuss visual decisions and why discarded alternative is weaker.

## M00 — audited current usage and evidence
- Trace all HTML references, scripts and CSS network requests at 1440x900, 390x844 and 320x700, plus reduced-motion GPU-off. Produce one machine-readable live_used_manifest.json (url, owner, initiator, route, size, color bias, load state, license, intentional fallback). Distinguish loaded media, dormant assets and per-scene dynamic assets.
- Render current four Services modes and continuous interactions in a real browser. Record frame phase and exact SHA. Screenshot actual elements, not a beauty render alone.
- Inspect existing geometry and mesh animation phases, identify essential behavior and room for substitution.
- Capture baseline for one flagship vertical slice and match composition camera/scale so visual comparison isn't misleading.

## M01 — Blender material and form development (single scene)
- Author two distinct AUTOMATION artwork directions; both must show request -> conditional gate -> human approval fork -> recorded outcome.
- Concept A: ceramic-and-titanium governance machine, warm cream environment, amber review highlights, cobalt approved route; tiny green brand bridge.
- Concept B: documentary industrial tabletop assembly with side-lit mechanical aperture, copper exception and blue output routing.
- NOT green rings; NOT generic robotic animal or unrelated engine; NO logo mutation.
- Model real reusable geometry in .blend with named material slots, organized collections, cameras and action phases. Use Blender Bridge or mcp-for-blender for inspect/iterate; produce proof-of-execution render.
- Export GLB only if live 3D adds real value. Use animation baked/scrubbed WebP frames for heavy visual effects where browser runtime is lighter. Create 390 viewport art-direction crop, not just downscale desktop.

## M02 — integration experiment
- Make a surgical change to the existing Services asset reference/scene only on worker branch, preserve original poster as rollback candidate.
- Use the SAME GSAP progress / manual controls already deployed. No extra scroll root or ticker; scene lifecycle must dispose GPU resources and handlers.
- Responsive layout and accessible reduced-motion/GPU-denied fallback; no offscreen WebGL waste; lazy asset loading.
- Compare baseline and candidate at same scene phase and fixed viewport with screenshots and 15-30s recorded transitions.
- Scope creep outside the current slice needs maintainer issue sign-off.

## M03 — adversarial self-review
- Critique the actual browser captures, not the script or mesh count. Score composition, semantic story, finish, color restraint, motion, accessibility, frame cost; record FIX_REQUIRED and repair what looks weak.
- Capture source manifest, triangle/material/texture count, file byte sizes, GLB import parity, disposal checks, first-load timings, on-device GPU evidence if available.
- Run unchanged R3 regression floors 61 production, 79 R2, 68 film, 30 math plus 233 focused and route/fallback suites where practical. State which checks passed/blocked, never invent them.
- Open Draft worker PR targeting experiment/kirjane-creative-forge-r4-asset-library with exact SHA, image links, motion clips, tests and review request.
- Do NOT declare your own art accepted. Independent source review is separate from maintainer creative judgment and owner acceptance.

## Expected handoff to maintainer
Exact SHA; .blend source; any .glb; desktop and mobile WebP/posters; two alternative contact sheets; direct before/after site captures; interaction video; color/material breakdown; runtime budget; provenance; meaningful failures and repairs. One precise active-asset improvement before broad site redesign.

## STOP condition
If neither treatment is visibly better than current Services AUTOMATION when viewed in real site context, stop and report FIX_REQUIRED. Do not quietly swap it into the site.
