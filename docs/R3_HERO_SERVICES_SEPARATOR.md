# R3 — Hero → Services editorial separator

**Scope:** Homepage (`/`) only. Added to existing feature branch and draft PR #8. No changes to artwork, Hero animation, Services scroll behavior, or other routes.

## Design

Added a lime/chartreuse inter-chapter editorial band **between** the cinematic Hero and the full-bleed Services chapter, visually matching the existing editorial manifesto band between Services and Process in the owner's reference screenshot.

- Eyebrow: **FROM AN IDEA TO A SYSTEM THAT WORKS.**
- Oversized message: **UNDERSTAND THE WORK. ✳ ENGINEER THE ANSWER. ✳ BUILD WHAT MATTERS.**
- Reuses existing `manifest-band`, `manifest-inner`, `manifest-line` components and the existing lime/ink palette; no decorative asset, SVG, particle, or new animation.
- Desktop retains the intentional horizontal typography overflow/crop of the original manifesto visual pattern.
- Mobile (≤680px) wraps all three phrases into readable stacked lines rather than cropping their text. No horizontal page overflow.
- Content is real HTML, not baked into any image.

## Source of truth

- `scripts/build.py` adds `home_hero_separator` into `home=home_hero+home_hero_separator+home_services+...`.
- `index.html` regenerated and verified; the five inner-page outputs and `404.html` remain byte-for-byte unchanged.
- `assets/css/r3-home.css` adds only the separator-specific mobile wrapping rule. Existing `site.css`, artwork and animations are unchanged.

## Tests

- `python scripts/build.py`: PASS.
- `python -m py_compile scripts/build.py scripts/qa_r3_separator.py`: PASS.
- `node --check assets/js/r3-home.js` and `node --check assets/js/site.js`: PASS.
- New Chromium inlined-browser separator checks `python scripts/qa_r3_separator.py`: **6/6 PASS** (1440×900, 1920×1080, 960×740, 390×844, 320×760, and reduced motion at 1440×900).
- Existing `python scripts/qa_r3_fullbleed.py`: **12/12 PASS**, including all four service scroll beats and reverse scrolling.
- Checks cover DOM adjacency, two editorial bands, no overflow, images load, no JS errors, mobile readable text layout, and unchanged Services interactions.
- Browser sandbox cannot navigate loopback URLs; Chromium checks inline actual HTML, CSS, JS and WebP bytes. Owner's localhost Chrome visual review remains the acceptance gate.

## Release gate

PR remains draft and unmerged. `main` stays on the approved R2 baseline. No Vercel or Hostinger deployment. Owner visual acceptance needed before further M03 work or merge.
