# R4 execution ledger

2026-11-22, Asia/Manila. Mission: KIRJANE-R4-EXISTING-ASSET-AND-MOTION-REMASTER.

## Connectivity and source

- Read the complete canonical handoff at exact starting SHA `b8ddf2b014d39d17b78aa5ff928ad2a2e79cc47e`.
- Local Blender tools discovered and invoked successfully: addon status, scene info, actual viewport screenshot, then separate-scene smoke write. Native Blender 5.3.0 / addon 2.0 / protocol 16. `BLENDER_MCP_CONNECTED` posted to Issue #16, comment `7067955657`.
- Isolated worktree `r4-remaster`, exact authorized implementation branch. Earlier R3 worktree untouched. Existing Blender project never cleared or saved over.
- `efcf6ad9465c00ce68ba8654ea6ab75a084de324`: integrated first modeled still and live sculpture material/edge remaster.
- `1c19aee220715c298b067f017b22a1ae4e3c296c`: corrected pale backdrop, center-ring contrast and separate phone framing after actual website review.

## Checks and honest scope

| Check | Observed result | Source checkpoint / evidence |
|---|---|---|
| Integrated preview build | Passed; 390 public files | `python scripts/build_immersive_r2.py --output dist/r4-integrated-01`; second static build `dist/r4-integrated-02`; bundled film/island sources have no semantic Git diff |
| Current Services keyboard/reverse/resize/reduced/GPU-off/context-loss | 174/174 passed | runtime `1c19aee…`; `evidence/qa/r4-services.json` |
| Focused seven-page R3 checks | 233/233 passed | runtime `efcf6ad…`; `evidence/qa/r3-focused.json` |
| Film integration | 68/68 passed | runtime `efcf6ad…`; `evidence/qa/film.json` |
| Film director math | 27/27 passed | `node --test creative/film/src/director/*.test.mjs`, runtime `efcf6ad…`. The handoff mentions 30 historical checks; this repository's glob discovers 27. No claim of 30. |
| Production | 61/61 passed | runtime `efcf6ad…`; `evidence/qa/production-first.json` |
| Frame cache | 9/9 passed | `node scripts/test_production_cache.mjs`, runtime `efcf6ad…` |
| Inherited R2 | First 78/79; second 75/79; fresh isolated port 79/79 | first two logs retained; final source `1c19aee…`. Connection-refused errors appeared in failed runs; root cause not established. Port-isolated run at 41979 passed. Diagnostic request-failure URLs were added to the QA harness. |
| Matched website captures | 9 before + 9 after viewport captures and corresponding artwork captures; no page exceptions | `before-final`, `after-final`, 18 comparison panels; baseline `b8ddf2b…`, candidate runtime `1c19aee…` |
| Four-state continuous motion | Captured before/after | named WebMs in before-final / after-final; forward/reverse manual poses and native phase traversal |
| Active inventory | 165 observations / 109 distinct paths; not exhaustive | `evidence/inventory/active-assets.json`; two viewport traces over all seven routes |
| Official brand custody | 9/9 byte-identical | `evidence/brand-immutability.json` |
| Profile | Both versions 0 extra idle draws; no FPS claim | `evidence/qa/profile.json`; SwiftShader, not hardware qualification |
| Independent creative review / physical phone / Safari / owner acceptance | NOT RUN / NOT GRANTED | Self-review only |

A final exact-HEAD rerun is reported separately in Issue #16/PR; do not relabel earlier results as tests of a later documentation commit.

Runner corrections: the first new Services harness rejected the root URL and timed out; fixed before its 174-check pass. Initial Node fetch readiness probe hit the known Node 24/Python HTTP parser assertion; reused the existing `httpReady` helper. Capture harness now checks the authoritative section mode and separately records actual rendering tier. Failed/intermediate capture directories were not selected as final evidence.

## Remaining asset dispositions

| Asset group | Disposition |
|---|---|
| R4-A01 current routed-ring Automation stills | REVIEW_READY; owner/art-director review pending |
| R4-A02 current four-pose Home sculpture | REVIEW_READY; owner/art-director review pending |
| R4-A03 Home assembly sequences | UNAUDITED beyond network/DOM observations |
| R4-A04 Salryn hero | UNAUDITED beyond network/DOM observations |
| R4-A05 Salryn kernel documentary | UNAUDITED beyond sampled frames |
| R4-A06 Process topology | UNAUDITED artistically; inherited behavior checks pass |
| R4-A07 engine inspector | UNAUDITED artistically; inherited behavior checks pass |
| R4-A08 industry scenes | UNAUDITED artistically |
| R4-A09 offline scenes | UNAUDITED artistically |
| R4-A10 remaining Services art | UNAUDITED artistically |
| R4-A11 Projects / About | UNAUDITED artistically |
| R4-A12 Contact / global topology | UNAUDITED artistically |
| R4-A13 Salryn 23-scene film | PRESERVED; no artistic replacement decision; inherited checks pass |
| R4-A14 official brand / 2D chameleon | IMMUTABLE; hash verification passed |

M01 is submitted for review, not owner-accepted. Full R4 remains incomplete; next bounded production task follows the canonical Home assembly-sequence order after review of this first improvement. No merge or deployment performed.
