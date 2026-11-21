# R3 reproduction recipes

Use Node 22+, Python 3.12+, a clean checkout and the pinned lockfiles. No production service or secrets are required. Build to a new directory each time.

```powershell
npm ci --ignore-scripts --no-audit --no-fund
python scripts/build_immersive_r2.py --output dist/review-001
$env:FORGE_DIST='dist/review-001'
$env:FORGE_EVIDENCE='dist/review-evidence'
node scripts/qa_codex_r3.mjs
$env:R3_ROUTES_ONLY='1'
node scripts/qa_codex_r3.mjs
Remove-Item Env:R3_ROUTES_ONLY
node scripts/codex_r3_adversarial.mjs
node --test creative/film/src/director/*.test.mjs scripts/codex_r3_motion.test.mjs
$env:CODEX_R3_DIST='dist/review-001'
$env:CODEX_R3_SHOTS='dist/review-captures'
node scripts/codex_r3_capture.mjs
python -m http.server 42730 --bind 127.0.0.1 --directory dist/review-001
```

The preview is noindex. The seven canonical directory routes remain native HTML. The R5 integration and R2 suites also accept FORGE_DIST and FORGE_EVIDENCE. Production verification supports PRODUCTION_DIST and PREVIEW_DIST for fresh outputs.

| Capture | Route / selector | Deterministic state |
|---|---|---|
| 01 / 02 | /, #complexity-clarity-scene | Native scroll phases .14 / .87; Home phase map and optical grade follow director phase |
| 03 | /, #capabilities-exhibition | Four data-cap-idx buttons; manual selection survives resize and incidental scroll updates |
| 04 | /, #home-process-section | Five process-tab-* buttons; ArrowLeft/Right and Home/End; dedicated /process/#stage-3 must keep Verification until scroll intent |
| 05 | /salryn/, .salryn-hero | Phase .12; software LOD is recorded separately from actual hardware |
| 06 / 07 | /salryn/, #scene-a-kernel | .31 for Workspaces, .90 for specialization; .52 is Security and is not mislabeled as Workspaces |
| 08 | /salryn/, #scene-c-flavors | Native industry-profile value 1 (Food & Beverage), narrative button data-story-step=3, workflow event 0 initially; inspect all five events and compare Retail (0) / Manufacturing (9) |
| 09 | /salryn/, #scene-d-activation | Initial Commerce + Inventory and two mandatory foundations; inspect named engine buttons; toggle each optional engine and restore it |
| 10 | /salryn/, #scene-f-independence | data-sim-mode=local means outage; normal and exchange are normal/recovery. Advance two recovery review steps; external work must stay pending during outage |
| f01–f05 | /salryn/, #salryn-cinema-experience | Film phases .04/.31/.60/.74/.92; wait for Shadow Root film-scroll and cinemaLoad=ready |

Capture harness waits for fonts and visible image decode. The manifest records source SHA, harness SHA, viewport, phase, actual geometry, industry/event/network state and page errors. Matching controls take precedence over incidental scroll-selected defaults. Comparison sheets are browser-produced composites of these PNGs; raw videos stay under dist and in the CI artifact.

Headless R3F intentionally uses an optical fallback. A canvas element is not hardware proof. Respect the inherited quality profile, prefers-reduced-motion and webgl=off. Never infer physical GPU qualification from the CI screenshots.
