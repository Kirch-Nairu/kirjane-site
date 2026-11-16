# Kirjane R3 — M03 Progressive Engineering Ladder

**Scope:** Home page Process chapter only (`/#home-process`). Extends draft PR #8; no merge or hosting deployment.

## User-approved direction

Turn the existing **five ascending glass pillars** into a full-viewport storytelling chapter. Native scrolling progresses through:

1. Discover
2. Plan & Design
3. Develop
4. Validate
5. Deliver & Support

The image is still the **unchanged approved `p01-process.webp`**. No SVG, canvas, generated illustration, or separated 3D object is added. The original raster image is duplicated only as a **masked exposure layer** over a darker instance of the identical image, allowing a bright focus to travel gradually across the five original pillars. This is a visual focus transition, *not* independent animation of the underlying 3D pillars.

## Implementation

- **Desktop:** viewport-sized sticky stage with a long native scroll track containing five reversible beats. The image fills the entire scene; headline, stage explanation, progress bar, step controls, and chapter label are real HTML overlays.
- **Smooth movement:** scroll progress drives slight camera drift, a continuous soft focus moving across the five physical pillars, and a progress meter. Each discrete step updates active copy and uses a brief text reveal.
- **Input:** direct click on the five steps scrolls to the corresponding beat. Arrow keys, Home, End and normal Tab navigation remain supported. Reverse scrolling restores earlier states.
- **Fallbacks:** ≤959px width, coarse-pointer/touch and <650px viewport height do not pin. The same artwork and all five step controls are usable in normal flow. Reduced motion disables scroll pinning, spotlight, zoom, and text animation. Without JavaScript, the first stage and full five-stage labels remain visible, with the explicit link to the dedicated Process page.
- **Source of truth:** `scripts/build.py` generates `index.html`; `assets/css/r3-home.css` and `assets/js/r3-home.js` are homepage-scoped. No other page scripts, route HTML, or artwork bytes were changed.

## Verified evidence

- Python `scripts/build.py` generation, Python compile, and Node JavaScript syntax checks: PASS.
- New Chromium inline-asset suite: **11/11** configurations PASS (320×760, 390×844, 768×1024, 960×740, 1280×720, 1440×900, 1920×1080, 1440×600, reduced motion at 390 and 1440, JS disabled at 1440).
- All five steps progress correctly in order and reverse correctly. Bright focus moves through five distinct positions. Direct stage selection updates copy. No JS exception, page overflow, broken image or incorrect pinned state in checked cases.
- Integrated regression in the same suite confirms the previous **Services** section still executes all four scroll beats at 960, 1440 and 1920 widths.
- Existing separator suite was run, but a follow-up run had an intermittent Playwright wait timeout. A separate focused Services scroll progression test passed at 960, 1440, and 1920. The old longer full-bleed suite hit an environment timeout and is **not** counted as a fresh pass for this candidate.
- Diff against starting snapshot: all 12 WebP artwork bytes, five inner pages, 404, `site.css` and `site.js` unchanged. Original P01 SHA-256: `4c7679e96039154b1ef1b3e9fffbf42972b5f5f32535016c67a9ef73b7d1b190`.

**QA limitation:** The sandbox prevents navigation to localhost in Chromium. Automated browser tests inline the project's actual generated HTML/CSS/JS/WebP. They are not equivalent to a real served-host test in the owner's Windows Chrome, nor do they certify multi-browser, WCAG 2.2 AA, or production performance.

## Review / acceptance

- Owner opens the R3 feature branch on localhost and scrolls through all five phases, then backward.
- Inspect 960, 1440 and 1920 desktop, a narrow/mobile window, reduced motion and keyboard operation.
- Check text contrast over all five phases and whether the moving highlight follows the intended pillar.
- Confirm that cinematic pacing is comfortable. The next homepage chapter, Projects, remains untouched pending this review.

## Local preview

```powershell
git switch feat/r3-homepage-cinematic-storytelling
git pull --ff-only
py -m http.server 8000
```

Open `http://localhost:8000/` and scroll to **03 / HOW WE APPROACH THE WORK**.

**No Vercel preview, Hostinger release, or main merge.**
