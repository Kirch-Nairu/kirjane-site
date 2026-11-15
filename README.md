# Kirjane IT Solutions — Luminous Architecture R2

**Implementation candidate / integration review only.** This branch is not a production release. No deployment, merge, or publication is authorized by this work.

## What is here

A production-minded **zero-runtime-dependency, pre-rendered static editorial website candidate**, built on the locked Luminous Architecture R2 art direction. Six accessible content routes are present: `/`, `/services/`, `/projects/`, `/about/`, `/process/`, `/contact/`, plus `404.html`.

- All **12 visual-approved R2 assets** are bundled as optimized WebP under `assets/visuals/`, retaining the approval manifest and original PNG masters in Google Drive. Four original anchors and eight successor artworks are distinct by provenance.
- Desktop and mobile-specific hero and contact images use `<picture>` media selection.
- HTML-rendered headings, links, navigation, disclosure statements, and disabled contact form; no generated text embedded in image assets.
- Keyboard-operable mobile navigation and service-exploration tabs, skip link, focus indicators, and reduced-motion support.
- Local review with `python3 -m http.server 8000` from the repository root. All routes work as directory-index static pages.
- No client identities, measured benefits, real project screenshots, contact endpoints, trackers, or team portraits have been fabricated.

### Architectural gate

The earlier Kirjane planning blueprint specified **React + Vite + TypeScript + Tailwind CSS 4 / React Router**. This fresh repo contained only a README. To deliver a verifiable, deployable visual candidate without network-installed npm dependencies, this first integration intentionally uses semantic HTML, modular CSS, and dependency-free JavaScript, pre-rendered via `scripts/build.py`. **The intended React/TypeScript architecture is not yet implemented; migrate or explicitly approve this static implementation before declaring technical signoff.**

### Operating locally

```bash
python3 scripts/build.py
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A standard static host such as Netlify can serve the root with no build command. Publish remains HELD.

### Release holds

1. Owner must accept compiled desktop/tablet/mobile screenshots and the implementation architecture.
2. Independent accessibility/contrast review (axe/WCAG 2.2 AA), keyboard QA, cross-browser QA.
3. Final brand hex codes and official logo asset placement must be validated; the header is typography only, not a fabricated brand mark.
4. Rights/commercial-policy review of AI-origin and composited assets. See `docs/asset-manifest.json`.
5. Verify company contact channel, data handling/privacy statement and spam protection before enabling contact submissions.
6. Publish real client case studies only with explicit consent and verified project evidence.
7. Merge/deployment requires separate explicit authorization.

**Website repository:** `Kirch-Nairu/kirjane-site`. KIRCH identity only. Source and approved artwork preserved in Drive.
