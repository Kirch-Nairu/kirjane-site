# Kirjane R3-A1 — Services Full-Bleed Chapter

**Status:** Implementation candidate for owner visual review. **Scope:** Home (`/`) Services chapter only. Existing PR #8, no merge or deployment.

## Design change

- Replaced the white two-column Services composition (left controls + framed right image) with an **edge-to-edge cinematic image scene**. The same four R2 approved WebP images cover the entire viewport as native `<img>` layers with `object-fit:cover`.
- Overlay content is real, keyboard-selectable HTML: section heading, brief context, four service tabs, current focus copy, chapter counter, progress meter, disclosure, and link to Services.
- Existing dark left-hand artwork area and a **minimal neutral CSS contrast gradient** maintain readability. No SVG, particles, canvas, decorative line art, glass-layer additions, or regenerated artwork. The original approved image files were not modified.
- The scroll track maintains four reversible beats while the pinned viewport-sized stage remains in place. Direct selection can navigate to its scroll beat. No wheel interception, forced snapping, or scroll library.
- The headline formerly outside the stage is moved inside the full-bleed scene, so **Services is now a cinematic environment rather than a white introduction followed by a panel**.
- Mobile, touch, short-height and reduced-motion modes avoid sticky trapping; the full-bleed art is retained with accessible manual service selection. JavaScript-off shows the first artwork and all text and tabs (without progressive interaction).

## Files changed

- `scripts/build.py` — source of truth for homepage HTML, regenerates `index.html`.
- `index.html` — generated HTML matching new source.
- `assets/css/r3-home.css` — scene-only styles; Hero M01 visual behavior preserved.
- `scripts/qa_r3_fullbleed.py` — new automated Chromium QA harness.
- `qa/r3-fullbleed/qa_results.json` — machine-readable results (generated).
- `qa/r3-fullbleed/asset-integrity.json` — hashes and unchanged-scope checks (generated).

**Not changed:** `assets/js/r3-home.js`, `assets/js/site.js`, all 12 WebP artworks, original home Hero motion, or any of the five inner page routes.

## Verification performed

- Python generator and syntax checks: PASS.
- `node --check assets/js/r3-home.js` and `assets/js/site.js`: PASS.
- Local Python HTTP server returned `200` for `/`, `/services/`, and R3 stylesheet.
- Chromium browser harness against actual generated HTML/CSS/JS and approved image bytes **inlined** (browser sandbox blocks navigating to loopback). Tests include 320×760, 390×844, 768×1024, 960×740, 1280×720, 1366×768, 1440×900, 1920×1080, 1440×600, reduced motion at 1440/390, and JS-disabled at 1440.
- All four Services states activate during forward and reverse scrolling, and manual selection remains functional. Full-bleed geometry, image cropping, source integrity, keyboard focusability, counters, console errors, overflow, and responsive/static fallbacks verified.
- Four source WebP byte hashes identical to prior PR #8; other five routes, shared JS/CSS, and hero JS unchanged.

## Review evidence

- `qa/r3-fullbleed/beat-1-1440.png` through `beat-4-1440.png` — actual Chromium render captures of all four full-bleed beats.
- `qa/r3-fullbleed/services-960.png` and `services-1920.png` — responsive desktop captures.
- `qa/r3-fullbleed/services-390x844.png` and `services-320x760.png` — mobile fallback captures.
- `qa/r3-fullbleed/four-beats-contact-sheet.jpg` — comparison sheet using screenshots, not generated mockups.

## Outstanding gates

1. **Owner visual inspection in actual Windows localhost Chrome**, particularly copy hierarchy and overlay contrast across all four backgrounds.
2. Firefox/WebKit, zoom/text enlargement, independent WCAG contrast and keyboard navigation audit, production-like performance.
3. The service images are 1672×941 WebP and sufficient for prototype. Higher resolution is an optional later asset revision based on real display testing; none generated.
4. No Vercel preview, Hostinger production deployment, or merge until explicitly authorized. R2 `main` baseline remains untouched.

## Local instructions

```powershell
git fetch origin
git switch feat/r3-homepage-cinematic-storytelling
git pull --ff-only
py -m http.server 8000
```

Open `http://localhost:8000/`, hard-refresh, and scroll to Services. The image now occupies the *entire chapter background*, and four service controls/copy float on top.
