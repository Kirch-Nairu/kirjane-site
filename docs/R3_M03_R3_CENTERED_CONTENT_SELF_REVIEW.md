# Kirjane R3 M03 R3 — Centered Process content / self-review

**Scope:** Process chapter visual hierarchy only on `feat/r3-homepage-cinematic-storytelling` / PR #8.

**Starting GitHub candidate:** `77b6151f9617055bc29bdfce800984ff1e09a4f9` (draft, unmerged). No deployment.

**Owner feedback:** Preserve the existing five-pillar glass ladder as full-screen artwork; move the active stage heading, description and index from the lower right into the visible middle of the scene. Keep the five-step navigation rail at the bottom. No new assets, SVGs or motion libraries.

## Source changes

- `assets/css/r3-home.css`: establish a horizontally centered, sufficiently prominent active stage message below the editorial heading and above the navigation rail. Its layout is intentionally scene-relative on pinned desktop. Restore in-flow static positioning on mobile, short-height and narrow-aspect non-pinned viewports.
- `scripts/qa_r3_process_centered.py`: automated browser-rendered layout and five-stage collision/visibility checks with the exact HTML, styles, scripts and WebP bytes inlined (sandbox localhost browser traffic is blocked).
- `qa/r3-process-centered/results.json`: machine-readable evidence.

No JS logic, generator, HTML, approved imagery, inner routes or shared site files changed.

## Two-pass self-review

**Pass 1:** Inspected source and built centered stage. Browser geometry tests revealed an overlap between the main heading and active-stage content at large viewports. Corrected vertical placement (scene-relative top position) and checked four pinned desktop aspect ratios. Also identified that the initial desktop positioning would remain absolute on mobile and short-window layouts; explicitly reset positioning for those fallbacks.

**Pass 2:** Re-inspected final CSS and render captures. Verified all five stage labels including the longest “Deliver & Support”; active text stays outside main heading and progress rail; no horizontal overflow or broken approved image; JS-enabled, reduced-motion and JavaScript-disabled cases. Verified baseline assets, five inner pages, index and shared JS/CSS are unchanged.

## QA results

| Suite | Result |
| --- | --- |
| Centered content: responsive, stage-by-stage layout, reduced motion, no JavaScript | **12/12 PASS** (fresh isolated run) |
| R3 M03 adversarial stabilization: stage sync, click flicker, keyboard, reverse scroll, DOM churn | **12/12 PASS** |
| Legacy Process progressive chapter | **11/11 PASS** |
| Hero / Services separator regression | **6/6 PASS** |
| Source generator parity: output unchanged | **PASS** |
| JS syntax / Python compilation | **PASS** |

A single combined rerun timed out when starting the final centered-content suite after the previous two suites; the centered suite was subsequently rerun **separately** and passed 12/12. The timed-out combined run is not counted as a pass.

## Remaining acceptance boundary

- Owner must verify the new composition and all five stage transitions on **real Windows localhost Chrome**, including desktop, mobile, resizing and scrolling backward.
- The Chromium test suite uses inlined assets due to browser loopback restrictions. It is not actual real-host/browser-network validation.
- No independent reviewer, Firefox/WebKit, GPU profiling or full WCAG 2.2 AA gate was run in this bounded CSS change.

**Review verdict:** `SELF_REVIEW_PASS_OWNER_QA_PENDING`. **NO MERGE, NO VERCEL, NO HOSTINGER.**
