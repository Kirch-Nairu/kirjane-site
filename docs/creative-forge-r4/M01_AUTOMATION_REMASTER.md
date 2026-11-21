# M01 — current Automation artwork remaster

Disposition: REVIEW_READY for owner/art-director review; self-reviewed by Codex. No independent creative review or owner acceptance. The complete R4 mission remains open.

Starting source: `b8ddf2b014d39d17b78aa5ff928ad2a2e79cc47e`. First implementation checkpoint: `efcf6ad9465c00ce68ba8654ea6ab75a084de324`. Phone-framing correction and reviewed runtime: `1c19aee220715c298b067f017b22a1ae4e3c296c`. Later evidence/test-only commits do not change runtime artwork.

## Blender verification

Actual local tools: `mcp__blender__get_addon_status`, `get_scene_info`, `look`, `execute_blender_code`. Successful native handshake: Blender 5.3.0, addon 2.0, protocol 16 matching expected 16. Initial live scene: unsaved `KJ_R4_AUTOMATION_A2_THE_APPROVAL_SWITCH`, 82 objects (70 meshes, 6 curves, 4 lights, 2 cameras), frame 28/96. A real solid viewport screenshot was returned in the Codex chat. This earlier approval-machine study was neither imported nor used as remaster artwork.

`artwork/r4/verification/local-mcp-smoke.blend` was saved from a separate disposable scene. The existing open scene was not cleared or overwritten. During exports the user's active scene changed to `KIRJANE R4 — ENGINEERED CORE`; export scripts did not switch the user's window scene. A later repeat `look` request stalled and was abandoned; this is not additional proof. No connector registration, addon install or global configuration was changed.

## What actually renders

| Surface | Starting source and usage | Motion owner |
|---|---|---|
| Home normal WebGL | `#home-cap-plate-stage canvas`: sixteen nodes and a ground ring; four poses. The ring still is loaded but hidden. | `site/js/forge-service-scene.js`, selected by `site/index.html` and the existing scene director |
| Home static/reduced/GPU-off | `#home-cap-plate-stage img[data-plate-idx="1"]`: pale `editorial-cap-02-process-automation.webp` | Existing four image classes and selection controls |
| Services | `#process-automation .asc-service-plate img`: dark `cap-02-process-automation.webp` | Three-step `ascension-services-process.js` control and `forge-kinetics-r2.js` SVG overlay |

All these usages were checked in real HTTP Chromium captures. Home's four discipline states and Services' three workflow steps are different controls. Both remain intact. No original editable `.blend` was found in the starting repository, so the three-ring/four-conduit still subject was reconstructed.

## Authored work and integration

- Editable master: [automation-routed-rings-v01.blend](../../artwork/r4/automation/automation-routed-rings-v01.blend). Thirty named objects, continuous ceramic rings, silver return lips, recessed colored edges, four spline conduits, original light rig and separate desktop/phone cameras. Open via Blender File → Append → Scene to inspect without replacing another project.
- Reproducible source: `artwork/r4/automation/build_scene.py`, `export_scene.py`, `optimize.py`. Blender files are written with `bpy.data.libraries.write`, preserving the open project. Optimization used a worktree-local Python venv and Pillow 12.0.0. No third-party assets/textures were imported.
- Four runtime WebPs: dark desktop 26,570 B, dark phone 25,760 B, editorial desktop 30,000 B, editorial phone 28,826 B. Desktop 1280×800; phone 1080×800. Hashes: `artwork/r4/automation/exports.json`.
- Original stills remain at their original paths for rollback; two `<picture>` integrations choose the authored phone view at ≤900px. No new renderer, dependency, scroll driver, page or film island.
- Existing live sculpture: rounded shared node geometry, emerald/cyan material separation, white key and restrained rim lights. Same sixteen nodes, four target formulas, camera, stage size, pose timing and GSAP selection owner. One reusable route buffer replaces per-draw geometry allocation. Shared box geometry grows from 24 to 486 vertices; node triangles from 192 to 12,288 across sixteen nodes. This is additional geometry, not a claimed GPU speedup.

## Matched evidence

Real browser widths/heights: 1440×900, 390×844, 320×700; DPR 1. Captures include unchanged live WebGL camera/selected Automation state, GPU-off Home still, and Services step 0. `before-final/report.json` and `after-final/report.json` record actual loaded sources, selected state and rendering tier. Inherited page effects continue running, so these are matched scene states rather than pixel-identical clocks for every decorative overlay.

| Surface | 1440 | 390 | 320 |
|---|---|---|---|
| Home live | [comparison](evidence/comparisons/home-live-1440-art.png) | [comparison](evidence/comparisons/home-live-390-art.png) | [comparison](evidence/comparisons/home-live-320-art.png) |
| Home fallback | [comparison](evidence/comparisons/home-poster-1440-art.png) | [comparison](evidence/comparisons/home-poster-390-art.png) | [comparison](evidence/comparisons/home-poster-320-art.png) |
| Services | [comparison](evidence/comparisons/services-live-1440.png) | [comparison](evidence/comparisons/services-live-390.png) | [comparison](evidence/comparisons/services-live-320.png) |

Continuous untrimmed Home motion: [before](evidence/before-final/home-live-1440-forward-reverse.webm), [after](evidence/after-final/home-live-1440-forward-reverse.webm). Four states selected forward/reverse, followed by native phase traversal forward/reverse. Recording contains navigation/setup as well as the actual scene. Separate static viewport and artwork captures are adjacent to the comparisons.

## Self-critique

Recognition: the three standing rings and four continuous routes remain; no new machine or subject. The center lime cue remains on the dark Services artwork, and the light Home plate keeps its darker emerald center ring. Silver edge returns and cyan routes read at website scale. The live node sculpture keeps its original footprint and topology while its bevels avoid the original flat cube edges.

Rejected/corrected: initial pilot had distracting studio hotspots; the first light export was too gray and the phone rings too small. Background, central-ring material and phone camera were corrected after inspecting the actual integrated page. Final light treatment remains quieter than the dark treatment; owner judgment may favor the original. The tiny ferrules are secondary detail, not relied on for meaning.

Limitations: these are headless Chromium captures on the Windows host, not physical phone/touch, Safari, screen-reader speech or certified GPU/performance evidence. No LCP/INP/FPS improvement claim. `evidence/qa/profile.json` measures CPU draw submission and idle draw count only. No visual acceptance is inferred from passing tests.

The profile used ANGLE SwiftShader at 1440×900/DPR 1, six pose transitions and a 1.5-second idle sample. Both versions submitted zero additional Services draws while idle. CPU draw submission totaled 8.7 ms before and 11.1 ms after; counts differ with the browser's available frame cadence, so this is not a normalized speed comparison. Geometry work increases for rounded surfaces. Do not infer a performance improvement from the buffer-allocation change or these synthetic observations.

## Remaining inventory

`evidence/inventory/active-assets.json` records 165 route/viewport observations and 109 distinct requested paths across fourteen seven-route desktop/phone runs. Twenty-nine scroll samples per route are an observed subset, not an exhaustive frame/interaction audit. Each record distinguishes rendered-in-view, loaded DOM and network-only assets. Other visuals remain UNAUDITED, not automatically KEEP or replaced.

Next production order remains the canonical handoff: Home assembly sequences; Process five-stage field; Salryn hero/kernel documentary; engine/industry/offline scenes; remaining Services/Projects/About/Contact; film polish only for demonstrated faults. No further subject changes are implemented here. All nine brand files are byte-identical to the starting SHA (`evidence/brand-immutability.json`).

NO MERGE / NO DEPLOY / NO OWNER_ACCEPTED CLAIM.
