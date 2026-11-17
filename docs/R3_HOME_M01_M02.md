# Kirjane R3 — Homepage motion proof (M01 + M02)

**Scope:** Homepage only (`/`). Inner pages are unchanged. **State:** Prototype branch; owner review required before merge. No preview or production deployment.

## Locked authority

- Base design: visually approved **Luminous Architecture R2**; all 12 WebP assets and their provenance retained.
- Project repo: `Kirch-Nairu/kirjane-site`.
- Localhost development first; Vercel preview later; Hostinger remains the intended production host.
- No new factual business claims, client identities, real client screenshots, forms, or logos.

## M01 — Hero

- Sequential masked-style title entrance and supporting-copy reveal, only after JavaScript starts.
- Scroll-linked hero image perspective/depth (single flattened image; **not** a true 3D scene) and mild foreground content displacement.
- Low-opacity luminous orbit overlays and 01/07 chapter marker.
- Native scrolling retained; no scroll interception, artificial momentum, or external animation dependency.

## M02 — Services

- Sticky stage on **desktop >=960px with fine pointer and no reduced-motion preference**; four scroll-controlled beats.
- All four approved Services visuals present as overlaid, independently rendered image layers. Changing beats crossfades layers and updates text, tab state, counter, and progress line.
- Scroll progression is reversible; selecting a service directly advances to the appropriate beat.
- Mobile/coarse pointer/reduced motion: no pin, original manual service selection remains usable.
- Motion JS is page-scoped (`r3-home.js`), and motion CSS is page-scoped (`r3-home.css`). The Python generator emits them only on the Home route.

## Verification performed

- `python3 scripts/build.py` — PASS.
- `node --check assets/js/site.js` and `node --check assets/js/r3-home.js` — PASS.
- Local HTTP server serves a valid `200` response for the homepage. Chromium in this sandbox blocks localhost navigation, so browser QA uses generated HTML with actual CSS/JS/WebP bytes **inlined**. This is *not* a deployed real-host test.
- Chromium inline QA: **9/9 configurations PASS**: widths 320, 390, 768, 960, 1024, 1440, 1920 and reduced-motion modes at 390 and 1440.
- Scroll beats 0→1→2→3, reverse 3→2→1→0, responsive fallback, intact H1, no JS exceptions, image presence, and no horizontal overflow.
- Evidence: `qa/r3-home-results.json`; view captures in the local review archive. (Automated screenshots are evidence, not claims of real-host performance.)

## Known open gates

1. User acceptance of exact motion timing, visual depth, section spacing, and desktop/mobile pacing.
2. Independent QA in actual localhost environment (not sandbox browser inline) and then, if authorized, Vercel preview.
3. Real-browser Lighthouse/Core Web Vitals and WCAG 2.2 AA / axe audits.
4. Check touchpad/trackpad/keyboard and browsers beyond Chromium. Browsers can vary in smooth scroll and sticky behavior.
5. Existing logo/palette/contact/rights verification gates from R2 remain outstanding for production publication.
6. Homepage M03–M05 and the remaining five pages are explicitly out of scope.

## Local preview

```powershell
git switch feat/r3-homepage-cinematic-storytelling
py -m http.server 8000
```

Visit `http://localhost:8000/`. No npm install, Netlify, Vercel, Hostinger, or React migration required.
