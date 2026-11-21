# R3 implementation evidence

Product-source freeze: `2b7e146d699d15709495b68a9680a2664497939f`. Branch: `experiment/codex-cinematic-overhaul-r3`. Starting source: `4c1f58f8183501621f90d66256b72e020940d9e3`; integrated R5 ancestry retained. Evidence-only successors may add reports or test coverage without changing site/creative source.

[Draft PR #15](https://github.com/Kirch-Nairu/kirjane-site/pull/15) remains against `experiment/salryn-cinema-site-integration-r1`. Disposition: DRAFT / OWNER CREATIVE REVIEW / NO MERGE / NO DEPLOY.

## Actual visual comparisons

- [Services before/after](evidence/services-comparison.png)
- [Ten desktop shot pairs](evidence/shots-comparison.png)
- [Five phone shot pairs](evidence/mobile-comparison.png)
- [Five integrated R5 film pairs](evidence/film-comparison.png)
- [Committed owner references inspected](evidence/owner-references.png) — exact original-upload byte identity is unverified.

Each pair comes from actual HTTP Chromium captures at the same viewport, selector and requested phase. Industry captures explicitly select Food & Beverage and the workflow chapter; outage captures explicitly select the local/outage state. Workspaces uses phase .31, not the old approximate .52 Security beat. Camera retiming intentionally changes the visual frame at a matching document phase.

[Before manifest](evidence/baseline-manifest.json) and [candidate manifest](evidence/candidate-manifest.json) record source/harness SHA, actual geometry, control state, errors and PNG hashes. Both sets contain 20/20 captures and zero recorded page exceptions. Raw local PNGs are under `dist/codex-r3-evidence/baseline-controlled/` and `final-controlled-22/`.

## Qualification

| Gate | Observed result | Evidence |
|---|---|---|
| Production browser + source whitespace gate | 61/61 and diff check passed | [Production CI](https://github.com/Kirch-Nairu/kirjane-site/actions/runs/44924109216) |
| Inherited R2 / axe | 79/79 | [R3 CI](https://github.com/Kirch-Nairu/kirjane-site/actions/runs/44924104883) |
| Integrated 23-scene film | 68/68 | same exact-source R3 CI |
| Film math + phase/camera safety | 30/30 (original 27 retained) | same exact-source R3 CI |
| R3 controls, workflows, note preservation, deep links, inspection, outage/recovery | 233/233 | [Structured local report](evidence/focused-browser.json), same CI |
| Seven routes at 320/390/768/1024/1440/1920 + no JS / GPU denied | 44/44 CI; 51/51 local including seven new full-page image-decode checks | [Structured route report](evidence/routes-browser.json) |
| Four film viewports, Home forward/reverse, actual WebGL context loss | 6/6 | [Structured report](evidence/adversarial.json) |
| Owner / phone / film still capture | 20/20 | [Manifest](evidence/candidate-manifest.json) |
| React Bits/compiled-island smoke | passed | local `dist/final-smoke-22.log` |

[Machine-readable provenance](evidence/qualification.json). Source CI artifact `codex-r3-candidate-captures`, ID **14715515621**, includes raw captures, full-page routes, videos, axe/test reports and integrated-film evidence. [Download through its run](https://github.com/Kirch-Nairu/kirjane-site/actions/runs/44924104883); expiry reported as 2026-12-05 16:25:54 UTC. The committed sheets/manifests remain durable after artifact expiry. Latest evidence-only HEAD checks appear on the PR separately.

## Preview and reproduction

Local noindex preview: `http://127.0.0.1:42730/`. Portable package: `dist/codex-r3-candidate-022.zip` (12,226,242 bytes); digest in [payload.json](evidence/payload.json). Serve its extracted root over HTTP. [Reproduction commands and exact scene recipes](REPRO_RECIPES.md).

## Measured costs and limits

[Raw profile](evidence/frame-profile.json): same Windows host and Chromium; 1440×900; reduced motion plus webgl=off; three warmups and three scored 90-frame samples. Median p50/p95/p99 intervals: baseline **16.7/17.9/18.2 ms**, candidate **16.7/18/18.4 ms**. This is synthetic idle pacing, not a full-motion scroll/GPU benchmark or field INP.

ResourceTiming resource-transfer-size sums were 3,079,203 and 2,954,766 bytes; navigation bytes are excluded. Reported heap is rounded to 10,000,000 bytes for both and does not prove leak freedom. No hardware performance conclusion is drawn.

Compiled JS deltas are +2,008 bytes for islands and +809 bytes for film; compiled island CSS delta +1,944 bytes. Original native scene/token/CSS source totals 38,121 bytes. Home additionally lazy-loads the existing Three vendor near its service chapter in normal motion; this GPU path is excluded from the reduced-motion profile. No npm dependencies or external raster/video assets were added.

[New-source hashes and rights ledger](ASSET_LICENSES.csv); inherited package versions/licenses remain in [the R2 registry](../IMMERSIVE_R2_SOURCE_REGISTRY.csv). Official brand assets are unchanged.

## Review boundary

All screenshots and critique are author self-review. [Per-shot implementation and creative limits](CORRECTIONS.md). R3F uses its intentional optical alternative in headless/software conditions; those images cannot qualify real GPU materials. Physical Safari/iOS/Android, spoken screen-reader behavior, hardware thermal/heap studies and a complete normal-motion performance comparison are not run. Independent exact-SHA review is REVIEW_BLOCKED pending a separate authenticated reviewer. Owner creative acceptance remains pending.
