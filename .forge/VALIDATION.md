# VALIDATION — KIRJANE-PREMIUM-CORPORATE-WEBSITE-R1

**State: TECHNICAL & BROWSER QA EXECUTED — OWNER VISUAL ACCEPTANCE PENDING.**

## Candidate
- Starting SHA: `c2725cceed370d7664606a00c894de62198b7894` (mission staging `8994c22669f391ce87ae7bfb4b700d35c9c399b6`)
- Working branch: `design/kirjane-premium-r1-antigravity`
- Implementation candidate SHA: `ca2ad11af41803c47281abbd33bd6b97c9e3f17a`
- Active host: `http://localhost:5173` (Vite / React Router v7 dev & prerender verified)
- Visual QA & motion artifacts: Tracked in `qa-artifacts/screenshots/` (33 PNGs) and `qa-artifacts/videos/` (2 WEBM recordings) on branch `design/kirjane-premium-r1-antigravity`
- Visual design acceptance: **PENDING OWNER APPROVAL** (per `AGENTS.md`)

## Verification log (executed on workstation)
| Check | Status | Evidence / exact SHA (`ca2ad11af41803c47281abbd33bd6b97c9e3f17a`) |
| --- | --- | --- |
| `npm install` / dependencies | **PASS** | Installed `gsap@^3.15.1`, `@gsap/react@^2.1.2`, `@playwright/test@^1.65.0` on Node `>=22.22.0`. |
| `npm run check` | **PASS** | `react-router typegen && tsc --noEmit` (0 errors), `eslint .` (0 errors), `react-router build` (client + SSR + 6 prerendered routes), `node scripts/verify-prerender.mjs` (all 6 HTML route artifacts verified). |
| Playwright route/navigation coverage | **PASS** | `npx playwright test` (`tests/visual-qa.spec.ts`): 3/3 suites passed across `/`, `/services`, `/projects`, `/about`, `/process`, `/contact` with 0 console errors and 0 page errors. |
| Desktop 1440×900 full-page + hero screenshot | **PASS** | [`qa-artifacts/screenshots/g3-hero-1440x900.png`](../qa-artifacts/screenshots/g3-hero-1440x900.png), [`home-1440x900.png`](../qa-artifacts/screenshots/home-1440x900.png), [`services-1440x900.png`](../qa-artifacts/screenshots/services-1440x900.png), [`projects-1440x900.png`](../qa-artifacts/screenshots/projects-1440x900.png), [`about-1440x900.png`](../qa-artifacts/screenshots/about-1440x900.png), [`process-1440x900.png`](../qa-artifacts/screenshots/process-1440x900.png), [`contact-1440x900.png`](../qa-artifacts/screenshots/contact-1440x900.png) |
| Tablet 768×900 full-page screenshots | **PASS** | [`qa-artifacts/screenshots/g3-hero-768x900.png`](../qa-artifacts/screenshots/g3-hero-768x900.png), [`home-768x900.png`](../qa-artifacts/screenshots/home-768x900.png), [`services-768x900.png`](../qa-artifacts/screenshots/services-768x900.png), [`projects-768x900.png`](../qa-artifacts/screenshots/projects-768x900.png), [`about-768x900.png`](../qa-artifacts/screenshots/about-768x900.png), [`process-768x900.png`](../qa-artifacts/screenshots/process-768x900.png), [`contact-768x900.png`](../qa-artifacts/screenshots/contact-768x900.png) |
| Mobile 390×844 and 360×800 screenshots | **PASS** | [`g3-hero-390x844.png`](../qa-artifacts/screenshots/g3-hero-390x844.png), [`g3-hero-360x800.png`](../qa-artifacts/screenshots/g3-hero-360x800.png), [`home-390x844.png`](../qa-artifacts/screenshots/home-390x844.png), [`home-360x800.png`](../qa-artifacts/screenshots/home-360x800.png) + all 5 subpages at `390x844` and `360x800` in `qa-artifacts/screenshots/` |
| No horizontal overflow / focus / keyboard and touch | **PASS** | Automated assertion `document.documentElement.scrollWidth <= window.innerWidth` passed on all 24 route×viewport combinations (including fixing `/contact` form select width at `390×844`). Skip-link Tab focus, mobile drawer `Escape` close, and `ArrowLeft`/`ArrowRight` stage controls verified. |
| Hero entrance recording | **PASS** | Captured in [`qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm`](../qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm) |
| Team transition forward/back video | **PASS** | Captured in [`qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm`](../qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm) (`01 Kirch` → `02 Paul` → `03 James Karl` → `04 Siris` → `03 James Karl`) |
| Five-stage process scroll forward/back video | **PASS** | Captured in [`qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm`](../qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm) (`Stage 01` → `Stage 05` → `Stage 01`) |
| `prefers-reduced-motion` interaction | **PASS** | Captured in [`qa-artifacts/videos/kirjane-reduced-motion-390x844.webm`](../qa-artifacts/videos/kirjane-reduced-motion-390x844.webm) and [`qa-artifacts/screenshots/g5-reduced-motion-390x844.png`](../qa-artifacts/screenshots/g5-reduced-motion-390x844.png) |
| Copy claims and live-demo honesty review | **PASS** | Automated Playwright assertions verified 0 occurrences of `"24/7"`, `"Daily Encrypted Backups"`, `"100% Verified"`, or internal repo names across all 6 routes; `team.ts` quotes removed; `SalrynInteractiveSimulator` explicitly labelled `Interactive Product Demo · Client-Side Simulation`. |
| Performance and layout stability assessment | **PASS** | Transform/opacity-only GSAP tweens (`immediateRender: false` on below-the-fold reveals), zero sticky spacer traps, CSS bundle `47.53 kB` (`8.58 kB` gzip). |
| Owner first-viewport & final visual approval | **PENDING** | Awaiting owner review of Draft PR #4 artifacts. |

## Bugs Caught & Fixed During Real Browser Visual Inspection
1. **Watermark Asset Replacement (`g3-hero-768x900.png` & `g4-home-team-split-1440x900.png`):** Visual inspection revealed `/brand/kirjane-mark.png` was a full rectangular business card graphic containing `CONTACT` button text rather than an isolated emblem, and direct GSAP tweening of `.hero-bg-logo` to `autoAlpha: 1` overrode CSS watermark opacity. Fixed by using the transparent `/brand/chameleon-green.png`, `/brand/chameleon-color.png`, and `/brand/chameleon-white.png` emblems and tweening the `.arch-hero-logo-layers` container.
2. **Mobile Form Overflow on `/contact` (`390×844`):** Playwright overflow check caught `<select id="contact-type">` exceeding `390px`. Fixed with `min-width: 0; width: 100%; max-width: 100%; overflow-wrap: anywhere` on `.inquiry-card` and `.inquiry-field` controls.
3. **Below-the-Fold Visibility & Slide Overlap (`about-1440x900.png` & `services-1440x900.png`):** Visual inspection caught below-the-fold cards starting at `autoAlpha: 0` before scroll and GSAP inline `opacity: 1` persisting on inactive team slides. Fixed by removing pre-scroll `autoAlpha: 0` hiding in `Motion.tsx` (`M05`) and clearing inline props on `.team-copy-slide:not(.is-active)` and `.process-story-slide:not(.is-active)`.
