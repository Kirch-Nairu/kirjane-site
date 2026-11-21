# KIRION CREATIVE FORGE × CODEX — CINEMATIC WEBSITE R3

> **R3 self-contained agent entrypoint:** Read `AGENTS.md` and `docs/codex-r3/START_HERE.md` first, followed by `docs/codex-r3/SHOT_MAP.md`, `MOTION_ARCHITECTURE.md` and `QA_EVIDENCE.md`. The original owner's ten screenshot files are **not committed to this repository** and cannot be dragged into Codex's chat. Generate equivalent baseline screenshots using `scripts/codex_r3_capture.mjs` and inspect them, rather than pretending the upload is available. This mission document is the creative scope; the R3 playbook governs actual implementation and proof. The source branch is `experiment/codex-cinematic-overhaul-r3` only.

**Mission:** `KIRJANE-CODEX-CINEMATIC-OVERHAUL-R3`  
**Repository:** `Kirch-Nairu/kirjane-site`  
**Authorized working branch:** `experiment/codex-cinematic-overhaul-r3`  
**Frozen integrated source:** `d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07` (the qualified Creative Forge R2 + Salryn Cinema R5 Draft PR #13 candidate)  
**Execution location:** Codex agent workspace  
**Role:** autonomous creative frontend engineer, motion designer, 3D art director, QA reviewer  
**Owner creative authority:** Kirch  
**Status:** EXPERIMENT ONLY. Do not merge, deploy, publish, alter DNS, change production branches, or edit PR #11.

## North star

This is a high-end flagship for a software engineering company. A visitor should **experience Kirjane's engineering competence** through visual storytelling, material realism, coherent CGI, meaningful interaction and exceptionally fluid transitions. Think an authored cinematic software film, not a component-library demo or default agency template. Act on the site itself: implement code, render real browsers, inspect, criticize, refine, and submit a Draft PR for owner review. A proposal without changed code and captured screenshots is not delivery.

**Creative latitude is HIGH.** Remove bad art, discard weak compositions, redesign layouts, move sections and replace SVG exposition where it diminishes quality. Do NOT be protective of mediocre R2 visuals. Preserve only what's important: official emblem/wordmark geometry, accurate business claims and licensing, accessibility and functional navigation/form semantics, seven discoverable pages and stable SEO. Keep the site largely static HTML; use React islands for interactive scenes, not a complete SPA rewrite by default.

## Source and reconnaissance (mandatory first phase)

1. Read `docs/IMMERSIVE_R2.md`, `docs/IMMERSIVE_R2_SOURCE_REGISTRY.csv`, `docs/MOTION_ARSENAL_R1.md`, `creative/package.json`, `scripts/build_immersive_r2.py`, existing `site/` and `creative/src/` code. Read the existing root `AGENTS.md` and the complete `docs/codex-r3/` operating documents BEFORE coding.
2. Verify HEAD descends from the frozen R2 source and that working branch is `experiment/codex-cinematic-overhaul-r3`. Do not check out main or rewrite R2 PR #11.
3. Run baseline build and smoke tests. Serve over HTTP. Capture screenshots/videos of the seven pages and key scroll stages at 1440×900, 768×1024, 390×844 and 320×700. Compare the screenshots with the explicit defects below.
4. Audit available locally committed CGI/GFX/VFX, CSS, raster/video, SVG, procedural meshes and third-party code before importing more assets. The original user's Windows creative-lab asset archive is NOT automatically part of this repository: never claim it was reviewed if absent. Verify upstream license and source for every new vendor component or downloaded artifact; do not execute unknown scripts.
5. Establish visual diagnosis with evidence before redesign. Do not let the existing test suite's pass status substitute for a creative quality verdict.

## Visual correction targets — owner's ten screenshots

### Photos 1 and 2 — Home cinematic object sequences

The Home opening has dramatic floating fragments but insufficient scene progression. Re-choreograph as one intentional kinetic transformation: initial disorder -> system attracts fragments -> fragments align into an architectural lattice -> core resolves -> orbital guides settle -> textual idea lands. Make the object movement meaningful, directionally continuous and temporally synchronized with typography. Improve lighting, materials, reflections, occlusion, camera easing, depth budget and a consistent composition at small viewports. No purposeless random tumble loops. The final hero should be unmistakably Kirjane, not generically "futuristic."

### Photo 3 — Home "What we build" section: CRITICAL DESIGN FAILURE

Current screenshot shows huge blank white void, an underscaled CGI object, an almost black-on-black unreadable text card and a layout apparently disconnected from the previous immersive scenes. Replace that **entire section** with a flagship four-mode interactive service experience.

Modes: Custom Software, Process Automation, Systems Integration, Infrastructure. Each should have distinct and meaningful material/form behavior: modular assemblies; guided routed particles; nodes synchronizing across clusters; resilient distributed mesh. Keep an editorial control rail, a readable dynamic headline and concise outcome. On mode selection, choreograph a single scene transition with GSAP/ScrollTrigger, not four unrelated stock animations. Use carefully contrasting light and dark chapters; no unbounded negative space or hidden type.

### Photo 4 — Process "From complexity to clarity"

Replace the flat, dated line-diagram appearance with a living topographic process field. It must correspond to the actual five stages (Discovery -> Architecture -> Engineering -> Verification -> Handover). Each stage's trigger changes its path geometry, focus node, pulse direction, stage copy and visual consequence. A selected stage must remain manually controllable by mouse, touch and keyboard even during a scroll scrub. On a desktop, a pinned stage is acceptable if not competing with the existing scroll director; mobile must remain native, readable and fluid. One continuous path rather than disjointed cards.

### Photos 5, 6 and 7 — Salryn cinematic evolution

Strongest existing visual direction. Enhance instead of flattening. Use one shared visual language for the Salryn kernel across "One kernel", "Different workspaces / shared records" and "One foundation leaves room to specialize". Camera positioning, glow, reflective surfaces, lens restraint, motion easing and orbital path language must connect. Scene transformations should narrate what changes: kernel -> workspaces -> industry-specific capabilities. Avoid repeating the same orbital sweep for every chapter. Existing approved CGI can be remastered, not just enlarged. If new real-time WebGL is used, prefer one scene/context with reusable geometry and camera states.

### Photo 8 — Salryn industry/flavor selector: STORYTELLING REBUILD

Current art panel is generic and weak; selection drives a mostly static paragraph. Rebuild as a guided five-chapter experience:

(1) Universal core, (2) choose industry, (3) capability constellation reconfigures, (4) relevant real-world workflow is demonstrated, (5) inquiry/configuration handoff.

A sample Food & Beverage sequence: order captured -> inventory deduction -> procurement threshold -> approval or staff handoff -> ledger closure. Industry selection must change choreography and explanation, not only text. The user must be able to pause, replay and manually choose. Do not claim a fictional simulated demo is a live deployed product. Respect actual 12 industry options, enabled capabilities and licensing terminology in the canonical content.

### Photo 9 — Salryn capability activation

The left side has tiny cramped capability descriptions and thin control density while the right side shows a tiny 3D cluster lost inside a box. Make this section a flagship interactive system configurator. Large primary 3D kernel with eight clear spatial nodes and visible connections. Selection should physically reframe the focused engine; module toggles should animate power, dependency lines, and reveal related capabilities. Mandatory Security and Infrastructure must stay locked and visibly distinguished. The title, descriptions and actual buttons must remain legible on desktop and mobile. Do not draw static fake SVGs to disguise a missing real 3D implementation. The shader/3D scene must degrade to a high-quality intentional static art direction when GPU support is insufficient.

### Photo 10 — Salryn offline-first architecture

Replace the stock-looking flat SVG/diagram panel with a compelling **three-state operational resilience simulator**:

NORMAL: workstations, local kernel and optional external services have clear semantic connections.
OUTAGE: external link disconnects gracefully, but POS/local workstations continue to operate; queued external-dependent actions are shown as waiting.
RECOVERY: external connectivity returns; pending actions reconcile in stages with visual confirmation and clear qualifiers about actual product capabilities.

Animate links, packets and node states only to explain behavior. Use a concise timeline/manual three-step controller, no auto-run that prevents comprehension. Keep accurate safeguards; do not promise all operations or all deployments function fully offline.

## 3D, materials, motion and library program

Use REAL libraries and real composed assets, not a hand-written CSS imitation while claiming integration. Existing runtime: GSAP + ScrollTrigger, React 19 islands, @react-three/fiber 9, Three, Motion, Lenis, React Bits BlurText/DecryptedText/GlareHover. Research additional React Bits modules, shader/material techniques, Liquid Glass JS, ShaderGradient and Liquid Logo where a visual task justifies them. **The objective is exquisite, cohesive execution, not importing every package for a checkbox.** A new package must have verified license, pinned version, measured footprint, at least one meaningful implementation and a clean fallback. Liquid Logo must not deform the official Kirjane logo.

Candidate original effects: linked object morph, distance-based parallax, path drawing, spatial stage pinning, masked text unveil, kinetic type, contour/flowfield, shader displacement, real physical glass, targeted bloom, perspective camera dolly, material-state crossfade, staggered kinetic grids, interactive orbital selection, interactive topology, optical mouse-follow, scroll-guided cutaways, contrast/lighting transitions, controlled cinematic snap, and interruption-safe transitions. Select them based on information hierarchy.

Do not allocate needless multiple WebGL contexts, start competing smooth-scroll RAFs, or perpetually animate offscreen elements. One authoritative ScrollTrigger/Lenis integration, deterministic state restoration, visibility-based demand rendering, context disposal, sensible mobile GPU budgets and motion-reduction fallbacks.

## Full-page art direction

Keep the recognizably Kirjane dark green / light mist / vivid yellow-green identity, but deliberately vary chapter lighting and composition. Reconsider typographic scale, grid proportions, anchors, foreground/background relationship and sectional color transitions across all seven pages. Avoid repetitive rectangular cards, unreadable low-contrast text and deep empty white sections. Maintain the official emblem and wordmark. Include Services, Projects, About and Contact polish where the old illustrations or CTAs are weak. Use the Home/Salryn/Process chapters as connected highlight experiences, not identical clones.

## Engineering workflow

Work in a single isolated Codex branch. Implement in bounded commits. Prefer focused source modules and avoid enormous inline HTML scripts. Follow actual files, not guessed selectors. Reuse the existing static build and React island pipeline. Run:

    npm ci --ignore-scripts --no-audit --no-fund
    (cd creative && npm ci --ignore-scripts --no-audit --no-fund)
    npm run build
    python3 scripts/build_immersive_r2.py --output dist/codex-r3-preview-001
    node scripts/qa_immersive_smoke.mjs
    node scripts/qa_immersive_r2.mjs
    npm test

Note: generate a *new* `dist/` output path for each immutable preview build; adjust test environment variables `FORGE_DIST` and `FORGE_EVIDENCE` to the new path. Inspect generated artifacts in a local HTTP server. Run image/asset checks, real browser console checks, accessibility audit, keyboard, touch, 320/390px overflow, and reduced motion. Preserve canonical URLs, main headings, sitemap and Contact functionality. Existing R2 tests may require carefully justified updates for genuinely changed scenes; do not delete or relax failing assertions just to reach green.

## Proof of visual superiority

Capture before/after screenshots for all ten target screenshots, plus at least one full page per canonical route. Record desktop and mobile scroll footage (or GIF preview if video capture unsupported). Produce an R3 correction register with explicit problems and before/after decisions. Show actual code/runtime effects (not mock graphics). Gather p95/p99 frame timing, memory/JS heap and transferred bytes; disclose limitations of headless software GPU. Provide an asset and dependency licensing registry. On the last run, deliver a comparison table: old problem -> new scene -> tested interaction -> QA outcome -> file/commit. Ask an independent review lane for an exact-SHA adversarial critique if an authenticated reviewer is available; never self-approve as independent.

## Completion and custody

Commit and push to `experiment/codex-cinematic-overhaul-r3`. Open a **Draft PR** against `experiment/salryn-cinema-site-integration-r1` only. Title: `[Creative Forge R3][Codex] Cinematic visual systems, storytelling and material overhaul`.

Do not change `main`, canonical PR #11, deployed site, hosting configuration, production secrets or other agents' work. No merge or deployment. A passing browser test is necessary but does not mean aesthetic approval. If GPU/render/browser access is limited, still deliver verified code and describe precisely what could not be tested. Do not invent footage or benchmark numbers.

**START:** Inspect source, run baseline, map the ten targets and then begin implementing. Do not stop at a design proposal or ask generic creative questions. The owner has authorized broad creative experimentation in this branch.
