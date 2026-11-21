# KIRJANE R4 — FINAL CANONICAL CODEX HANDOFF
## Existing Visuals. Elevated Craft. Same Kirjane.

**Mission:** `KIRJANE-R4-EXISTING-ASSET-AND-MOTION-REMASTER`
**Codex role:** Blender 5.3 asset-production engineer, technical motion artist, integrator, browser QA operator.
**ChatGPT role:** Senior art director and creative maintainer; design feedback and acceptance recommendations, **not** an automatic final approval or Codex's code writer.
**Owner:** Kirch: final design identity, publish and merge authority.
**Repository:** `Kirch-Nairu/kirjane-site`
**Frozen R3 source:** `7f3a3147c225aea8617820136b509306db3a143f`; Draft PR #15.
**R4 direction:** `experiment/kirjane-creative-forge-r4-asset-library`, Draft PR #17.
**Codex exclusive implementation:** `experiment/codex-r4-continuity-remaster`.
**Tracker:** Issue #16.
**Disposition:** CANONICAL MISSION BRIEF / ART PRODUCTION NOT VERIFIED / NO MERGE / NO DEPLOY.

> **Precedence:** This file supersedes older R4 prompts and any instruction requiring "two unrelated concepts", "new hero approval machines", "new mascot", or "ChatGPT-only execution". Other R4 audit/quality files are supporting evidence and may not expand the scope. If a conflict remains, stop and reference this document. R3 functional integration contract controls scroll, scene timing and accessibility.

## 1. The actual commission
Remaster the **CURRENT LIVE KIRJANE WEBSITE** rather than invent a new art collection.

Improve the actual stills, WebP cinematic sequences, 3D/cgi representations, visual backgrounds, SVG diagram presentation, interactions and motion effects being used on Home, Services, Process, Projects, About, Contact and Salryn. Use Blender where it adds material depth, authored geometry, animation or cinematography; use code, CSS and compositing where that is better. Preserve the existing creative narrative and website architecture.

The current visual rhythm is **not a draft to throw away**. It is a valuable production asset. The visitor should recognize the same scenes and scroll-driven progressions after R4, but see more deliberate professional art direction, richer surfaces, meaningful color separation, a stronger sense of depth and refined motion.

**Never announce success based solely on a Blender file existing, a high polygon count or a clean test run.**

## 2. Design authority and freedom
Codex has **FULL freedom within the original scene** to decide: lighting rigs, material stacks, texture treatment, geometry details, edge treatment, optical corrections, ambient depth, scene-specific accent colors, secondary motion, subtle camera/easing corrections, compositing, export format, asset budgets and Blender implementation.

Codex has **CONDITIONAL freedom** to change framing, minor silhouette detail, density and spatial hierarchy when the current composition is weak; it must compare the proposed change to a real browser baseline and preserve the recognizable scene.

Codex may **PROPOSE** major silhouette/story/narrative changes, an entirely different physical subject, new sections or removal of a meaningful visual. **Do not implement those as a surprise.** Obtain explicit owner design approval if they are needed.

Codex has **NO freedom** to modify the official 2D chameleon or Kirjane logo/wordmark, invent client achievements, rewrite 23-scene film semantics, break the existing scroll controller, or merge/deploy.

**Art-director thesis:** R3 "Living Topography / Engineered Clarity" survives. R4 deepens it through MATERIAL, LIGHT, COMPOSITION, CAMERA, REFINED MOVEMENT, COLOR and CAREFULLY AUTHORED DETAIL. It does not replace it with unrelated sci-fi objects.

## 3. What was wrong with the earlier brief
Do **NOT** make two competing new concepts for one existing Services image. Do **NOT** invent an approval machine because a route/ring graphic can be interpreted as a workflow. Do **NOT** force 4 unrelated sculptures, 3 retail dioramas, or a new Green Technology Universe. Such outputs are outside scope and are not deliverables even if beautiful.

A worker should still think like an artist: produce and compare material/lighting/composition *polish passes of the SAME current art*, internally discarding bad studies. External handoff should show one source-faithful best candidate and before/after evidence.

## 4. First, prove Blender access on Kirch's Windows machine
Blender 5.3 installed; the open-source `mcp-for-blender` addon was installed in the Blender 5.3 user add-on folder. Codex local MCP server named `blender` is configured: `uvx mcp-for-blender`.

**Host checks already supplied by the owner:** `codex mcp list` reports `blender enabled` and `Test-NetConnection 127.0.0.1 -Port 9876` reports `True`. These prove registration and socket reachability, **not yet a Codex MCP scene handshake**.

Before touching assets:
1. Open Blender 5.3; enable **Interface: MCP for Blender** if not enabled. In viewport `N` sidebar → `MCP for Blender` → `Start MCP Server` if not already running. Keep Blender open.
2. In a newly launched Codex process/session **on that same Windows host**, discover the Blender MCP tools. This is the local open-source MCP, **not ChatGPT's separate Blender Bridge plugin**.
3. Through the **actual Codex MCP tools**, call read-only `get_addon_status`, `get_scene_info`, `look` (or discovered equivalents). Report real Blender version, scene, existing objects and screenshot. Do not invent a response.
4. If these succeed: record `BLENDER_MCP_CONNECTED`, then save a small disposable test in a **separate scene/file**, never clearing the user's open project.
5. If missing tools, failed handshake or remote Codex session cannot access localhost: record `BLENDER_MCP_BLOCKED` with the exact error. Fix the connection; **do not substitute image generation or unrelated 3D**.

More detail: `docs/creative-forge-r4/BLENDER_MCP_BOOTSTRAP.md`.

## 5. Ground truth asset inventory and motion owners
The source repository has 342 PNG/JPG/WebP/SVG paths, **not** 342 proven active assets. It includes 252 numbered cinematic frames across four Home/Salryn sequences plus 4 posters, 9 locked brand assets, 12 legacy R2 images and documentation/evidence images. Only remaster assets **shown to load or render in the current website**.

Conduct actual seven-route HTTP browser network tracing and scene source references. For each active item record: route; DOM selector/scene; original path; source SHA; file dimensions/bytes; usage state; fallback; motion controller; any licensing constraints; whether an editable original exists; what is artistically weak. No speculative bulk renaming or wholesale replacement.

Existing motion owners include `site/js/frame-sequence-player.js`, `site/js/forge-service-scene.js`, `site/js/forge-process-field.js`, `site/js/scene-director.js`, `site/js/motion-system.js`, `site/js/forge-kinetics-r2.js`, `site/js/salryn-3d-organism.js`, `creative/src/main.jsx`, and the 23-scene film source. Identify which one actually controls a current visual before editing.

## 6. Concrete remaster approach and production order
**FIRST VERTICAL SLICE:** The existing Home/Services **Automation** art (do not assume same image appears on both routes):
- Home image: `site/assets/cinematic/editorial-cap-02-process-automation.webp`.
- Services route may use `site/assets/cinematic/cap-02-process-automation.webp` depending on element/state; verify actual browser use.
- Interactive Home CGI owner: `site/js/forge-service-scene.js`.
- Capture before still and current animation clip with active state and phase marked.
- Keep existing routed-path and ring motif, existing four service modes, layout rhythm and navigation.
- In Blender, faithfully reconstruct the existing subject **if an editable master is absent**; improve material, highlights, ring depth, routing clarity, surface quality and depth. Add selective cobalt/cyan/amber/silver to separate elements, keeping green as a brand anchor.
- Deliver optimized same-subject desktop/mobile stills and/or runtime geometry where justified. Preserve compatibility with existing selectors and GSAP director; no additional scroll driver or WebGL context without evidence.
- Capture matched **actual website** before/after and continuous forward/reverse motion. If it looks like a different subject or visually worse at page size, reject and retry; preserve original.

**THEN continue** in order of actual current deficiencies:
A. Home 01/02 existing fragments → clarity image sequences; preserve assembly rhythm and 72 desktop / 36 mobile numbered frames when changed.
B. Process original five-stage living topology; preserve stage selection, visual theme and progress.
C. Salryn hero kernel; keep recognizable central core and orbiter identity; improve contrast, geometry, materials and framing.
D. Salryn kernel documentary; preserve progression, 96 desktop / 48 mobile frames when changed, frame-phase synchronization.
E. Salryn engine configurator; preserve eight engine semantics, mandatory Security/Infrastructure and mobile fallback.
F. Salryn industry/offline visuals; preserve current selected states and honest simulation semantics.
G. Services, Projects, About, Contact active stills and effects.
H. Optional visual polish of 23-scene film only when specific real screenshot faults justify it; DO NOT rewrite film director or story.

Do not render hundreds of replacement frames before verifying one faithful keyframe treatment and matching browser scale. Reuse source renders, grading and material passes intelligently. Not every asset should be rebuilt in Blender or converted to GLB.

## 7. Visual critique and quality requirements
A candidate must pass ALL of these:
- **Recognition:** An observer recognizes the SAME Kirjane asset/scene, not a newly invented subject.
- **Composition:** Main subject reads at real webpage scale, not tiny or lost in a huge dark/empty panel.
- **Artistic craft:** Better surface definition, realistic or intentionally stylized lighting, purposeful shape, clean contours and optical finish. No primitive-looking junk, incoherent glow or decorative particle clutter.
- **Color:** Less green-on-green without becoming randomly rainbow; accent colors assigned to specific object/material roles; official brand unchanged.
- **Motion:** Identical story, chapter/phase ordering, four Services states, deterministic scrub/reverse and interaction controls; fewer stutters and smoother transitions where measurably improved.
- **Responsive:** Real 1440×900, 390×844 and 320×700 browser checks; purposeful phone framing, not desktop crop alone.
- **Accessibility/performance:** Keep original text, focus, responsive DOM, reduced-motion, GPU-off fallback; avoid extra network/GPU cost without quantified benefit.
- **Documentation:** File maps, editable masters when authored, materials, export sizes, provenance, license, exact SHA and truthful QA results.

Review art by the **real site capture**. A studio beauty render and passing unit tests do not qualify creative acceptance. Codex's own review is not independent. ChatGPT supplies critical visual direction; Kirch ultimately judges acceptable quality.

## 8. Required tangible delivery package, per remastered asset
1. **Source ID and original**: original file/path, selector, SHA, recognized subject, role, usage evidence.
2. **Before**: phase-aligned 1440/390/320 source captures; current motion clip and current defects.
3. **After**: the same scene improved, same behavior, matched captures and continuous motion; no new concept boards.
4. **Production masters**: versioned `.blend` for Blender-authored remasters; textures, named material/light/camera components and scene settings. If a pure shader/CSS correction, source code is the master. Do not fake a `.blend` deliverable for assets not rebuilt in Blender.
5. **Runtime exports**: optimized WebP/PNG/posters, frame sequences or GLBs as justified; dimensions, bytes, render cost and responsive variants. Keep original as rollback.
6. **Integration**: working website candidate on isolated worker branch with all existing controls and fallback behavior.
7. **Evidence**: baseline/candidate comparison, QA logs, rights ledger, runtime budget measurements, exact git SHA, Draft PR and limitations.
8. **Disposition**: `FIX_REQUIRED` (not better / not source-faithful), `REVIEW_READY` (evidence complete) or `OWNER_ACCEPTED` (only after Kirch approval).

## 9. What "finished" means
Milestone 1 is **ONE complete visible current-asset remaster**, integrated and captured, before expanding to the other active assets. Progress is tracked in the asset manifest as `UNAUDITED / ACTIVE / NOT_NEEDED / IN_PROGRESS / FIX_REQUIRED / REVIEW_READY / OWNER_ACCEPTED`.

The full R4 mission is not finished by delivering a single GLB, a handful of concept renders, a new material library, a technical setup report or even a polished Services example. It is complete only after the **active-asset inventory** has a review disposition for each relevant visual, approved replacements are integrated in their original scene locations, QA is run and Kirch accepts the proposed result.

Do not claim that every asset must be replaced: a strong asset can be `KEEP / NO CHANGE` with a reason. Do not silently leave weak active assets unreviewed.

## 10. Technical gates and release boundary
Maintain seven semantic static routes and Salryn's integrated 23-scene film, native-scroll phase, measured synthetic cursor/ripple, sound off until opt-in and no duplicate ScrollTrigger/Lenis/R3F loops. Preserve honest fictional/business semantics. R3 historical qualification floors include 61 production, 79 R2, 68 film, 30 math and 233 focused tests; only label a gate PASS if **rerun at candidate exact SHA**. Real physical GPU/mobile testing is separate from headless tests.

Use a Draft worker PR against the R4 maintainer branch. Every milestone must record exact SHA, actual output paths and evidence links. No merge/deploy/production changes without owner authorization.

## 11. First message to issue #16
Post an authenticated START receipt with exact working SHA; discovered Blender MCP tools, live scene inspection and actual screenshot, or explicit `BLENDER_MCP_BLOCKED`; then identify the exact first Services asset, its controlling scene and planned **source-faithful** material/lighting improvements. Start actual work after passing connectivity. No general design handoff, no new concept pitch, no unrelated asset.

**Final instruction:** Be creative about HOW to make the current Kirjane work look superb. Do not change WHAT Kirjane already is. Make the finished website—not an isolated Blender gallery—the source of truth.
