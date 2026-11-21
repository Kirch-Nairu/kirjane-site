# CODEX R3 â€” Execution Log

**Status:** NOT STARTED BY CODEX. Agent handoff bootstrapped; no R3 implementation claims.

Baseline ancestry: `d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07`
Working branch: `experiment/codex-cinematic-overhaul-r3`

Every actual Codex work session must append:

| Session UTC | Starting SHA | Milestone | Files changed | New SHA | Render evidence | Tests (actual outputs) | Decision / next action |
|---|---|---|---|---|---|---|---|
| TBD | TBD | M00 audit | TBD | TBD | TBD | TBD | NOT_RUN |

Never overwrite past gate results or claim a screenshot that was not saved.

## 2026-11-21 M00 — observed local activation
- Source: 4c1f58f8183501621f90d66256b72e020940d9e3; exact requested branch, clean clone inside creative lab at cinematic-r3; frozen R5 ancestry verified.
- Capabilities observed: Git HTTPS read, authenticated gh issue/PR read, local Git identity, Node 24.22.1, Python 3.13.5, npm, Playwright Chromium 159. GitHub connector returned Unknown tool; gh fallback works. No credentials read.
- Baseline immutable build: dist/codex-r3-baseline-001, 380 public files. Capture: dist/codex-r3-evidence/baseline/manifest.json: 20/20 states, no missing captures. These are current-source local renders.
- Actual tests: film mathematics 27/27; integrated film 68/68. R2 runner stopped after 10/10 checks with navigation timeout; NOT 79/79. Production runner encountered an intercepted click; NOT PASS. Candidate reruns required.
- Node24 Undici health-probe assertion reproduced twice. Harness now consumes an HTTP/1 response using node:http; no assertion after repair. Existing assertions preserved. Parameterized film/smoke output paths to support immutable builds.
- Self-review: services baseline confirms black-on-black card. All creative acceptance remains OPEN; no independent review or physical device claim.

## M01/M02 — services + process source checkpoint
- Implemented service sculpture in local Three.js: 16 physical-material modules, four finite GSAP transitions, paired route geometry, one renderer, resize/context-loss/disposal handling. Manual selection holds through resize and incidental director updates until actual wheel/touch/keyboard scroll intent.
- Replaced primary Process SVG on Home and Process with original parametric contour terrain and continuous trail; focus ridge/geometry follows five semantic stages. Existing tabs, keyboard arrows, anchors, descriptions and fallback HTML retained.
- Immutable tested build dist/codex-r3-services-process-003. Focused Chromium QA: 66/66 assertions across 1440/390/320, four service modes, five Home process stages, keyboard, resize, axe, overflow and exceptions. Reports/videos/stills under dist/codex-r3-evidence/process-3; first services pass at services-3. Visual self-review: services readability materially improved, terrain readable; sculpture still visually simple and requires owner review. No creative acceptance.
- Earlier services iterations: 28/33 due to inherited specificity and aspect-ratio-induced 416px width; corrected with scoped cascade/explicit width. No assertions removed.
- Process dedicated-route deep links and adversarial motion footage not yet qualified. Next M03 industry narrative, then M04/M05.

## M03–M05 implementation and browser correction
- Twelve-industry/five-stage narrative, native select, manual steps, bounded play/pause/replay, capability highlighting and twelve authored workflow sequences. Inquiry preserves industry and existing notes; a browser-found base-URL fragment error was repaired.
- Eight-engine R3F camera inspection and physical connecting spokes. Optical fallback shares active/selected state and named controls. Mandatory engines remain derived from canonical state; fixed document/intersection visibility ownership. Self-review found fallback node clipping after functional pass; corrected in source for the next full build.
- Resilience scene now exposes Normal / Outage / Recovery with local/external paths and explicit waiting state. Recovery requires two operator-review steps; does not claim actual export or synchronization.
- Immutable candidate-006 focused QA: 99/99 across 1440/390/320 for dedicated Process deep links, twelve options, 3 industries × 5 steps, replay, inquiry handoff, resilience including negative outage check, inspection, mandatory core, axe and overflow.
- Evidence dist/codex-r3-evidence/scenes-6. Self-review only: controls and record semantics clear; visual treatment remains diagrammatic and has not met owner creative acceptance. No physical GPU or independent review claim.

## M06/M07 — continuity, integrated film, site clearance
- Home frame timing now follows an original monotonic four-key causal phase map with exact endpoints. Inherited CGI retained, not rebuilt from the failed attempt. Salryn hero no longer spins independently of scroll: shell/node orientation derives from scroll depth and profile; emerald rim shader separates dark surfaces.
- Film: removed duplicated cursor easing before arc-length interpolation; click phase and DOM calibration unchanged. Added shot-specific readable camera lenses with continuous joins. Audio noise is softer and synthesized graph nodes disconnect on completion; remains off by default. Wide/tall caption measure refined. Math 27/27 after changes.
- Global native anchor/focus clearance and responsive text measures applied to all seven pages. Service renderer now loads only near its chapter.
- All changes are self-authored within existing licensed dependencies. No additional packages, artwork downloads, API access or logo changes.
- Creative status: FIX_REQUIRED until full matched captures, physical GPU checks and owner review. Frame retiming and contrast are incremental; no claim of remastering the baked CGI geometry.

## M08 regression correction
- Forced SwiftShader R2 runner on Windows stalled repeatedly. Default Chromium launch (same mode as the working capture harness) completed 79 assertions: 76 passed, 3 axe label-content-name mismatches in newly expanded engine controls. Fixed accessible names to begin with the full visible number/name. All assertions preserved; Windows launch mode now platform-specific.
- Explicit optical fallback on automated/software hosts avoids unsupported GPU claims. `force3d=1` is diagnostic only; actual hardware qualification remains pending.
- Service WebGL honors reduced motion and `webgl=off`; original decoded plates remain the deliberate alternative. No animation loops added to fallback.
- New math checks cover monotonicity, endpoints, reverse re-seeking and malformed input for the causal frame phase map.
