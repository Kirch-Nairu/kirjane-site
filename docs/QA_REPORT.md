# Luminous Architecture R2 — Integration QA (Candidate)

**Date:** 2026-11-16 (Asia/Manila)  
**Target:** `Kirch-Nairu/kirjane-site`  
**Source:** approved R2 12-artwork manifest preserved in Drive  
**Release decision:** HOLD — pending owner technical review, independent QA, brand/rights verification, contact activation, and explicit deploy authority.

## Local tests

- Source generator: `python3 scripts/build.py` — PASS. Six directory-index routes and 404 generated.
- JavaScript syntax: `node --check assets/js/site.js` — PASS.
- `scripts/qa_browser.py`: Chromium through Python Playwright with local HTML/CSS/JS and WebP assets *inlined for sandbox browser policy* — **30/30 PASS** after responsive CSS fixes. Tested home, services, projects, about, process, contact at 320×760, 390×844, 768×1024, 1440×900, and 1920×1080.
- Checked: single H1 per route, no DOM layout overflow, all art assets present (including dynamically selected service images), no uncaught page exceptions, working service tabs at 320/390/1440, mobile menu opening and Escape close at 320/390.
- Local Python HTTP static server returned `200 OK` for the homepage. The sandbox browser blocks HTTP loopback navigation, so **no end-to-end network/browser HTTP test** is claimed. The inlined QA harness tests actual DOM and JS in Chromium but not real served-resource request headers.
- PNG masters remain outside repository in the original Drive library. Repository only includes optimized WebP variants.

## Open gates

1. React/Vite/TypeScript/Tailwind architecture decision. Candidate currently uses pre-rendered semantic HTML and modular CSS/JS; earlier blueprint specified React Router framework mode, so this is an implementation deviation requiring explicit acceptance or migration.
2. Full WCAG 2.2 AA axe audit, keyboard/focus on multiple browsers, Firefox/WebKit and real-host route behavior.
3. Actual browser capture verification on Netlify PR preview, no production deploy.
4. Official original logo supply/approved placement; header is text-only placeholder (not a replacement trademark).
5. Working palette (`#08110D`, `#103D2B`, `#167B55`, `#D3F66B`, `#F3F5ED`) not verified against official logo.
6. Final commercial/rights review of source inputs and generated/derived assets.
7. Verified company email, privacy/data retention controls, form spam defense and end-to-end testing before enabling contact; currently genuinely disabled.
8. Case studies and actual team profiles pending approval and verification; conceptual examples disclosed.

No merge/deployment in this phase.
