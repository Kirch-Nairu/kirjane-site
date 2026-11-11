---
name: kirjane-visual-acceptance
description: Project-specific skill for Kirjane visual, motion, content and responsive acceptance. Read during design planning, after every major homepage change and before reporting completion.
---

# Kirjane visual acceptance

## Why this exists
Prior iterations passed builds without delivering the expected visual result. **A green build is not proof of a premium corporate website.**

## Compare, don't assume
1. Inspect current `home.tsx`, header, motion components and content modules, and compare relevant previous commits.
2. Create visual snapshots of candidate and reference implementations, or explicitly note where browser preview is unavailable.
3. Judge headline clarity in the first three seconds, information hierarchy, graphic restraint, brand authenticity, precise alignment, readability and professional credibility. A screenshot must communicate the company offer without code-themed ornaments.
4. Test at 1440×900, 768×900, 390×844, 360×800. Include full-page and first-viewport captures. Look for clipped typography, nav collisions, overlays on content, excess blank space and section inconsistency.
5. Test the *motion*: screen-capture hero loading, team next/previous, process forward/reverse scroll, mobile touch and reduced-motion. Record actual outcome, not an unplayed storyboard.
6. Test all actions: links, forms, keyboard focus, Escape, touch, page navigation, alternate motion setting, no console exceptions, no horizontal scrolling.
7. Flag unsupported claims and fabricated personal quotations as acceptance blockers even when layout is impressive.
8. Iterate by **removing** weak decoration before adding new effects. Avoid repeat fade-up choreography and monotonous cards.

## Evidence protocol
For each screenshot/video note exact branch SHA, viewport, route, browser, capture location and observed defects. Run `npm run check` plus Playwright with failures and limitations recorded. Never write PASS for an unrun check. Provide a before/after comparison for the first viewport.

## Rejection conditions
- Non-functional, fake-live or misleading demonstration interactions
- Unsupported 24/7, daily encrypted backup or 100% guarantees
- Unverified attributed staff quotes or invented portraits
- Desktop-only motion, inaccessible focus, mobile scroll trapping, CLS
- Incomplete evidence, generic/templated aesthetic or uninspected screenshot files

## Authority
Issue #3 and AGENTS.md override this skill if a requirement conflicts. This skill guides quality review; it does not authorize publication.
