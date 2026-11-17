# R3 global viewport resilience — two-pass self-review

Repository: Kirch-Nairu/kirjane-site, draft PR #8.
Frozen predecessor: b53a502989bd44310b2dfdf80461d3e064766dad.

## Scope

All six static pages and the 404 page, shared layout and navigation. Preserve approved design, copy, 12 WebPs, original logo, HTML generator and generated HTML, and both JavaScript files. This is a responsive correction, not a redesign or merge/deploy authorization.

## Pass 1: baseline and bounded repairs

126 route/viewport configurations (seven routes × 18 dimensions, 280–3440 CSS pixels, including landscape and short viewports) were inspected with reduced motion. 19 configurations flagged text outside the viewport or an overflow-clipped ancestor. The 280px footer overflow affected all six non-home routes; the Home title slightly exceeded the viewport at 280px; hero baseline/inner hero foot content clipped at some desktop and short viewport heights, especially the standalone Our Process page.

- Promote the narrow-phone footer wordmark rule from home-only CSS into shared CSS, and permit footer grid children to shrink.
- Use content-driven minimum hero heights (with existing cinematic height targets) and nonshrinking foreground content, instead of fixed heights that conceal copy. Adjust vertical spacing on shorter desktop/landscape viewports. The hero may extend beyond the fold when content needs room; do not force full-viewport fit.
- Make the open mobile navigation vertically scrollable within short screen heights; retain Escape/focus behavior and existing navigation routes.
- Correct the 280px Home headline size without changing normal-width typography.

## Pass 2: adversarial verification

The same 126-case resize sweep found zero flags under the measured overflow/clipping/error checks after correction. Source generator rerun preserved all seven HTML outputs byte-for-byte; JavaScript syntax and Python compile passed. The expanded 175-case global QA script adds 49 fresh-load cases across normal motion, reduced motion and JS-disabled rendering, plus actual mobile menu opening, last-link focus/visibility and Escape close checks. The local full invocation timed out after completing Home and Services: 50/50 cases recorded, not a full 175-case pass. Initial harness invocation also failed due to an incorrect Playwright keyword, which was fixed before the partial run. The complete suite is added to the existing CI workflow, which must run on the exact candidate. No production HTML, artwork or runtime JavaScript was changed.

Evidence: baseline-resize.json, corrected-resize.json and local-partial-fresh.json in the accompanying local review package (qa/global-viewports). Captures of completed fresh cases are retained separately. The local Chromium sandbox blocks URL navigation; the harness inlines real source HTML/CSS/JS/image files and uses fallback fonts. This is not a real HTTP, Windows Chrome, cross-browser, WCAG or performance audit. The no-JS test checks footer navigation presence, not functional mobile menu behavior. Intentionally clipped decorative elements/manifest marquee are excluded from text geometry checks.

## Open gates

Exact-SHA hosted CI (existing 118 cases plus 175 global cases) and owner review remain pending. No merge or deployment.
