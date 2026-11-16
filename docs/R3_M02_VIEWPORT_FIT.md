# Kirjane R3 — M02 viewport-fitted Services chapter

**Scope:** Follow-up to draft PR #8, owner-requested refinement based on a real localhost screenshot. Homepage `/` only. No inner-page changes or artwork regeneration.

## Problem observed

The existing sticky Services stage displayed all four service choices and its illustration in a short upper-half layout, leaving a large unused area below on desktop. The intended experience is a **single viewport-composed chapter** while the visitor scrolls through the four service beats.

## Changes

- The desktop sticky stage fills `100svh` minus a small responsive top and bottom breathing margin. The four selectors occupy four flexible rows; the artwork fills the stage height.
- The outer Services *track* retains its existing extended scroll distance for 4 reversible chapters. **This does not turn the entire 4-step story into one scroll step or intercept native scrolling.**
- Timeline geometry now reads the actual computed sticky top rather than maintaining a separate, potentially divergent offset calculation.
- Short desktop windows (<650px viewport height) opt out of sticky storytelling instead of clipping long service titles or controls. Existing mobile, coarse-pointer, and reduced-motion fallbacks remain intact.
- All 12 approved artwork files, semantic headings, and the five non-home pages are unchanged.

## QA performed

- `python scripts/build.py` regenerates the same `index.html`: PASS.
- `node --check assets/js/r3-home.js` and `node --check assets/js/site.js`: PASS.
- Browser DOM QA via Chromium with local HTML/CSS/JS/WebP inlined due to sandbox localhost restrictions: **11/11 configurations PASS**, including 960×740, 1024×768, 1280×650, 1440×900, 1920×1080, 320×760, 390×844, 768×1024, short 1440×600 fallback, and reduced-motion at 390 and 1440.
- Automated QA additionally asserts sticky stage height matches the available viewport height, right artwork matches the stage height, all four service rows remain >55px high, forward and reverse beats work, and no content horizontal overflow or JS exceptions occur.
- Sample 1440×900 capture: stage top **45px**, bottom **868.5px** (31.5px bottom breathing room); image height **823.5px**. Sample 960×740: stage top 37px, bottom 714.1px.
- Screenshot: `qa/r3-services-fullscreen-1440.png`; further 960 and 1920 captures included in review archive.

## Known limits

- Browser QA uses the actual DOM and project files, but **not a network-served localhost browser session**. Owner must inspect the updated CSS/JS in their real browser.
- Firefox/WebKit, WCAG 2.2 AA, performance profiling, zoom/text-enlargement, and unusual window dimensions require additional independent review.
- No Vercel preview, Hostinger release, or merge is authorized by this change.

## Run locally

```powershell
git fetch origin
git switch feat/r3-homepage-cinematic-storytelling
git pull --ff-only
py -m http.server 8000
```

Open `http://localhost:8000/` and scroll to **Chapter 02 / The Capabilities**. On a desktop browser with at least 960px viewport width and 650px viewport height, the stage fits the screen while its content changes with scroll progress.
