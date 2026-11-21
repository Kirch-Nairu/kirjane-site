# KIRION ATELIER — R4 EXISTING-ASSET CONTINUITY REMASTER

**CONNECTION GATE G-1 (MUST PASS BEFORE M00):** Read [BLENDER_MCP_BOOTSTRAP.md](BLENDER_MCP_BOOTSTRAP.md). Connect Codex to the existing local `uvx mcp-for-blender` server, prove `get_scene_info`/`look` from the actual Blender viewport, and record `BLENDER_MCP_CONNECTED` or `BLENDER_MCP_BLOCKED`. Do not author assets without proof.


Mission: `KIRJANE-R4-CONTINUITY-ASSET-REMASTER`
Executor: Codex (Blender automation + code + browser operator)
Maintainer/art direction: ChatGPT under Kirch
Frozen R3: `7f3a3147c225aea8617820136b509306db3a143f`
R4 direction PR: #17
Work branch: `experiment/codex-r4-continuity-remaster`
Issue: #16
Disposition: SOURCE-LED REMASTER / NOT A CONCEPT CONTEST / NO MERGE / NO DEPLOY

**START by reading** `CONTINUITY_REMASTER_HANDOFF.md`, `SOURCE_AUDIT.md`, `ASSET_INVENTORY_R3.csv`, `REPLACEMENT_MATRIX.csv`, `DESIGN_DIRECTION.md`, `QUALITY_GATES.md`, `docs/codex-r3/MOTION_ARCHITECTURE.md`, `docs/codex-r3/INTEGRATION_CONTRACT.md`, `docs/codex-r3/SHOT_MAP.md`, and actual scene source.

## Worker responsibility
Study the EXACT existing art and animation first. Preserve the R3 Living Topography / Engineered Clarity rhythm, chapter names, scene order, motion phase progression, interactions, existing central object identity and current page layout unless a documented defect requires a bounded fix.
Use Blender to IMPROVE source-equivalent artwork, not create an independent universe. A new .blend source may be necessary because some current visuals are prerendered; reconstruct the recognizable existing subject, not a different interpretation.

## Work stages and tangible outputs
M00: `live_asset_map.json` (real seven-route browser network events, route, selector, active animation controller, phase, actual active/dormant status, rights). `baseline/...` screenshots and phase-annotated video.
M01: `source_artwork_remaster.blend` and `before_after/...` for one currently live Services Automation visual. Preserve green route/ring subject, enhance shape fidelity, composition and material/lighting finish. Preserve the 4-mode scene progression.
M02: Optimized `site/assets/...webp`, source textures/materials and optional .glb; preserve original under provenance/rollback and keep expected selectors and import paths.
M03: Browser capture of same page + section/phase at 1440, 390, 320; normal/reduced/GPU denied and video forward/reverse. Apply repair until visual gain evident or keep original.
M04+: Repeat for existing Home, Process, Salryn, About, Projects, Contact, and targeted film-support art. Do not change narrative chronology.
MFinal: full asset mapping (path to replacement), master paths, exports bytes/dimensions, actual integration SHA, licensing, performance and regression reports, Draft PR. Independent review/owner approval separate.

## Fidelity rules
- Green is the brand accent, not the entire light rig; add neutrals and targeted blue/cyan/amber/silver where visual hierarchy demands.
- Preserve each asset's existing subject, compositional center, recognizability and story; improve surfaces, grade, lights, shadows, environment, edge quality, dimensionality and fine animation.
- No "two distinct concepts" requirement. Allowed variations are faithful polish studies of the same source.
- Do not convert a ring into an unrelated approval machine, a core into a generic engine sculpture or a chameleon into a 3D mascot.
- The official 2D chameleon and Kirjane wordmark/mark are IMMUTABLE from Drive/approved branding.
- Do not treat every static illustration as a candidate for live WebGL; if a well-graded still or framed sequence performs better, deliver that.
- For 252 numbered frame files and four posters, preserve frame naming, frame phase and number when modified, or explicitly prove backwards-compatible player adjustment before changing them.
- No new autonomous animation clock competing with native scroll/GSAP/ScrollTrigger; no new hover traps; avoid GPU load in hidden scenes.
- Preserve 7 static pages, 23-scene Salryn film, UI cursor calibration, sound opt-in and real business-content accuracy.
- No overwrites of PR #15 or R3/main/release branches, no merge, no deployment.

## Performance and testing
Blender 5.3 on Intel Iris Xe / i5-1345U / 15.7GB RAM; use Eevee previews. Provide actual measured browser performance, not guessed GPU qualification. R3 baseline floors: 61 production, 79 R2 axe, 68 integrated film, 30 math, 233 focused, route/fallback checks. For each asset show same-phase real-site before/after; provide editable master and accurate source/license provenance.

## First acceptance
Services Automation same visible artwork, same section and state, **materially better art direction**, optimized source-equivalent output and a clean transition with existing button/scroll behavior. One successful current-asset remaster gates all subsequent scope.

Only ChatGPT as maintainer may decide REVIEW_READY; this is not independent source approval. Kirch remains final visual authority.
