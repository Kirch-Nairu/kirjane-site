# Kirjane IT Solutions — Luminous Architecture R2

**Status: OWNER-APPROVED DEVELOPMENT BASELINE on `main` (2026-11-16).**  
**This is not a production deployment or certification of release readiness.**

Promoted from [PR #7](https://github.com/Kirch-Nairu/kirjane-site/pull/7) at candidate SHA `75122edbf01dbef710ea931bf91960d704fddbdf`. The approved visual system and current implementation are the starting point for all subsequent website changes. Preserve the six-page structure and 12 approved artworks unless KIRCH authorizes changes.

## Pages and assets

Six pre-rendered routes: `/`, `/services/`, `/projects/`, `/about/`, `/process/`, `/contact/`, plus `404.html`.

- 12 owner-approved Luminous Architecture R2 cinematic WebP assets in `assets/visuals/`; high-resolution PNG masters and provenance remain in the Kirjane Drive asset library.
- Separate desktop/mobile artwork for the homepage and contact page.
- Semantic HTML content, mobile navigation, interactive service selection, keyboard focus styles, reduced-motion accommodation.
- Projects artwork is illustrative; no fictitious client testimonials, team biographies, performance numbers, or real-client screenshots.
- The contact form is intentionally disabled until a verified communication channel, privacy/data-handling measures, and spam protection are tested.

## Local development — primary workflow

Requires Python 3, no package manager or frontend build server.

```powershell
git clone https://github.com/Kirch-Nairu/kirjane-site.git
cd kirjane-site
git switch main
py -m http.server 8000
```

Open **http://localhost:8000/**.

On Linux/macOS use `python3 -m http.server 8000`. If editing the content generator, run `python3 scripts/build.py` before previewing, then inspect its changes.

## Hosting policy

| Environment | Destination | Status |
| --- | --- | --- |
| Local inspection | localhost | Available immediately |
| Preview / staging | **Vercel** | Not deployed by this baseline promotion |
| Public production | **Hostinger** | Not deployed; requires separate go-live authorization |

**Do not use Netlify** for this project. No production deployment is implied by merging into `main`.

## QA evidence and outstanding release gates

- Historical local QA: Python generator PASS, JavaScript syntax PASS, Chromium inline DOM tests **30/30 PASS** across 6 routes × 5 widths. See `docs/QA_REPORT.md`. These were *not* Vercel/Hostinger real-host tests, full accessibility certification, or multi-browser production checks.
- The original architectural specification proposed React + Vite + TypeScript + Tailwind/React Router. The owner-approved visual baseline is currently dependency-free static HTML/CSS/JavaScript. Treat framework migration as a separate explicit technical decision; it is **not required for localhost visual review**.
- Before public release: verify official Kirjane logo/colors; audit WCAG 2.2 AA, browsers, SEO, performance, and security; complete rights/provenance review; configure a real contact method and privacy/data retention; verify live host routes and HTTPS; publish real case studies/team details only with authorization.
- Work on branches from `main`, submit focused PRs, and keep the approved cinematic design intact.

## Source of authority

- Repository: https://github.com/Kirch-Nairu/kirjane-site
- Initial baseline PR: https://github.com/Kirch-Nairu/kirjane-site/pull/7
- Visual system: Kirjane Luminous Architecture R2, **12/12 artworks visually approved** by KIRCH
- Hosting: **localhost → Vercel previews → Hostinger production**. Vercel and Hostinger remain separate from this repository promotion.
