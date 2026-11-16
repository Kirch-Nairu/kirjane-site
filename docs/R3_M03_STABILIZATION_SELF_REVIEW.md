# Kirjane R3 M03 — stabilization and two-pass self-review

**Repository:** `Kirch-Nairu/kirjane-site`  
**PR:** #8, existing R3 homepage feature branch  
**Starting defective SHA:** `5d620402f08aa3777fac16d7caf38feacaadd6eb`  
**State:** correction candidate / owner localhost acceptance and independent review still pending; **NO MERGE / NO DEPLOY**.

## Pass 1 — reproducible defects, root causes, corrections

| Finding | Root cause in previous implementation | Correction | Regression evidence |
| --- | --- | --- | --- |
| F1 P1 — spotlight/state mismatch | Active step used five equal bands (`progress*5`), highlight used four (`progress*4`) and ignored `object-fit:cover` cropping | Five center-aligned anchors in source coordinates, projected to viewport's actual cover crop | `scripts/qa_r3_m03_stabilization.py` tests both x/y at every stage midpoint in 1280×720, 1440×900, 1920×1080 |
| F2 P1 — click flicker | `goToProcess` wrote target immediately; old scroll location overwrote it during the smooth scroll | Only the scroll controller owns the active step when pinned. Click requests native smooth scroll; intermediate states advance sequentially | Mutation history for Stage 1 → 5 must be monotonic, end at Stage 5; keyboard End also tested |
| F3 P2 — redundant DOM changes | Every animation frame re-assigned stage headings/descriptions and all `aria-current` attributes | Early return when stage index unchanged; cancel older WAAPI title animations on real stage change | MutationObserver confirms zero stage-title/ARIA mutations across 30 small in-stage scroll movements |
| F4 P2 — narrow viewport crops entire ladder | 960×740 viewport's cover crop cannot show all five 16:9 pillars | Disable sticky for desktop ratio below 1.5; use contained full panorama and normal scrolling | 960×740 and 1024×768 non-pinned, image `object-fit:contain`, manual stage selection works |
| F5 QA gap — original process suite encoded prior incorrect expectation | Old QA assumed every `>=960px` viewport pins regardless of aspect | Update old QA mode assertion; introduce new adversarial suite | Legacy Process 11/11 PASS; new 12/12 PASS |

**Asset boundary:** The approved `p01-process.webp` retains SHA256 `4c7679e96039154b1ef1b3e9fffbf42972b5f5f32535016c67a9ef73b7d1b190`. Every approved image, shared site CSS/JS, all five other routes, and `404.html` are unchanged from the frozen candidate.

## Pass 2 — independent-of-implementation checks (self-review, not an independent person)

- Read the resulting JavaScript/CSS diff and checked script syntax (`node --check`).
- Ran generator `python scripts/build.py` and Python compilation.
- Re-ran the original Process browser suite with the new deliberate aspect-ratio fallback: **11/11 PASS**.
- Re-ran Hero/Services separator browser suite: **6/6 PASS**.
- Ran the adversarial suite separately after final CSS modification: **12/12 PASS** (320×760, 390×844, 768×1024, 960×740, 1024×768, 1280×720, 1440×900, 1920×1080, 1440×600, reduced motion at 390/1440, and JavaScript disabled at 1440).
- Adversarial suite additionally verifies Services' four scroll beats, Process forward/reverse, direct selection intermediate frames, keyboard End navigation, source-crop spotlight projection, and zero text/ARIA churn within one stage.
- Confirmed **20 unchanged files** against initial worktree: 12 WebP art files + 5 inner routes + shared CSS/JS + 404.

## Important limitations and remaining gates

1. The Chromium test browser cannot open `http://localhost` in this sandbox (`ERR_BLOCKED_BY_ADMINISTRATOR`). Tests use the **actual generated HTML, CSS, JS and WebP bytes inlined into a Chromium page**; they are not proof of network-host behavior.
2. User-reported Windows Chrome console errors have not been supplied; this correction targets reproduced code defects, not an unknown console stack trace.
3. Spotlight anchor values are composition-calibrated estimates. Mathematically correct crop alignment is tested, but final perceptual pillar alignment needs owner Windows browser inspection.
4. The duplicate full-screen raster + moving mask may still be costly on specific GPUs. Long-frame, paint, memory, zoom 200%, Firefox/WebKit and WCAG profiling remain open.
5. Owner must scroll and click the repaired Process scene on Windows, including keyboard, resize, and backscroll. Do not approve or merge until that review succeeds.

## Local instructions

```powershell
git switch feat/r3-homepage-cinematic-storytelling
git pull --ff-only
py -m http.server 8000
```

Open `http://localhost:8000/` and hard-refresh with Ctrl+Shift+R. Check Chapter 03 from Stage 1 to Stage 5; click Stage 5 while Stage 1 is active, scroll backward, and test at narrow window size.
