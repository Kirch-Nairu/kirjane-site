# KIRJANE VISUAL QA R1 — EXECUTED BROWSER & MOTION EVIDENCE

**Candidate Commit SHA:** `ca2ad11af41803c47281abbd33bd6b97c9e3f17a`  
**Branch:** `design/kirjane-premium-r1-antigravity`  
**Browser / Runtime:** Headless Chromium via `@playwright/test` (`tests/visual-qa.spec.ts`) on Windows 11 (`Node >=22.22.0`)

---

## 1. Gate Summary & Evidence Table

| Gate | Candidate SHA | Route / Viewport | Result | Artifact Path (Tracked on Branch) | Notes / Fixes Verified |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **G3 · Hero First Viewport** | `ca2ad11` | `/` @ `1440×900`, `768×900`, `390×844`, `360×800` | **PASS** | [`qa-artifacts/screenshots/g3-hero-1440x900.png`](../qa-artifacts/screenshots/g3-hero-1440x900.png), [`g3-hero-768x900.png`](../qa-artifacts/screenshots/g3-hero-768x900.png), [`g3-hero-390x844.png`](../qa-artifacts/screenshots/g3-hero-390x844.png), [`g3-hero-360x800.png`](../qa-artifacts/screenshots/g3-hero-360x800.png) | Clean light-paper corporate header, sentence-case `Space Grotesk` headline, Kirjane System & Product Overview ledger, 4-pillar quick index, and subtle multi-layer Chameleon-K watermarks. |
| **G4 · Homepage Section Captures** | `ca2ad11` | `/` sections @ `1440×900` | **PASS** | [`g4-home-capabilities-1440x900.png`](../qa-artifacts/screenshots/g4-home-capabilities-1440x900.png), [`g4-home-salryn-1440x900.png`](../qa-artifacts/screenshots/g4-home-salryn-1440x900.png), [`g4-home-team-split-1440x900.png`](../qa-artifacts/screenshots/g4-home-team-split-1440x900.png), [`g4-home-process-story-1440x900.png`](../qa-artifacts/screenshots/g4-home-process-story-1440x900.png) | Verified concise 4-row capability ledger, Salryn demo simulation badge, full-bleed 50/50 split-screen Team showcase, and 5-stage Process storytelling layout. |
| **G7 · 24-Capture Full-Page Matrix** | `ca2ad11` | 6 routes × 4 viewports (24 PNGs) | **PASS** | `qa-artifacts/screenshots/{home,services,projects,about,process,contact}-{1440x900,768x900,390x844,360x800}.png` | 0 console errors, 0 page errors, 0 horizontal overflow across all 24 combinations. |
| **G5 · Motion Recording & Reverse Scroll** | `ca2ad11` | `/`, `/about`, `/process` @ `1440×900` | **PASS** | [`qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm`](../qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm) | Demonstrates Hero entrance + parallax, Salryn flavor/ledger switching, Team 50/50 split forward/back + keyboard `ArrowRight`/`ArrowLeft`, and Process stages `01` → `05` → `01`. |
| **G5 · Keyboard, Touch & Reduced Motion** | `ca2ad11` | `/` @ `390×844` (`prefers-reduced-motion: reduce`) | **PASS** | [`qa-artifacts/videos/kirjane-reduced-motion-390x844.webm`](../qa-artifacts/videos/kirjane-reduced-motion-390x844.webm), [`qa-artifacts/screenshots/g5-reduced-motion-390x844.png`](../qa-artifacts/screenshots/g5-reduced-motion-390x844.png) | Verifies immediate static visibility under reduced motion and mobile navigation drawer open + `Escape` close. |
| **G6 & G7 · Build + Playwright Checks** | `ca2ad11` | All 6 routes | **PASS** | `npm run check` (exit 0) & `npx playwright test` (3 passed) | Verified truthful content assertions (no fabricated quotes, no `24/7`, no `Daily Encrypted Backups`, no `100% Verified`). |
| **G8 · Owner Visual Acceptance** | `ca2ad11` | Final candidate on Draft PR #4 | **PENDING** | https://github.com/Kirch-Nairu/kirjane-site/pull/4 | Awaiting owner review and sign-off. |

---

## 2. Full 24-Capture Matrix Inventory (`qa-artifacts/screenshots/`)

| Route | `1440×900` | `768×900` | `390×844` | `360×800` |
| :--- | :--- | :--- | :--- | :--- |
| **`/` (`home`)** | [`home-1440x900.png`](../qa-artifacts/screenshots/home-1440x900.png) | [`home-768x900.png`](../qa-artifacts/screenshots/home-768x900.png) | [`home-390x844.png`](../qa-artifacts/screenshots/home-390x844.png) | [`home-360x800.png`](../qa-artifacts/screenshots/home-360x800.png) |
| **`/services`** | [`services-1440x900.png`](../qa-artifacts/screenshots/services-1440x900.png) | [`services-768x900.png`](../qa-artifacts/screenshots/services-768x900.png) | [`services-390x844.png`](../qa-artifacts/screenshots/services-390x844.png) | [`services-360x800.png`](../qa-artifacts/screenshots/services-360x800.png) |
| **`/projects`** | [`projects-1440x900.png`](../qa-artifacts/screenshots/projects-1440x900.png) | [`projects-768x900.png`](../qa-artifacts/screenshots/projects-768x900.png) | [`projects-390x844.png`](../qa-artifacts/screenshots/projects-390x844.png) | [`projects-360x800.png`](../qa-artifacts/screenshots/projects-360x800.png) |
| **`/about`** | [`about-1440x900.png`](../qa-artifacts/screenshots/about-1440x900.png) | [`about-768x900.png`](../qa-artifacts/screenshots/about-768x900.png) | [`about-390x844.png`](../qa-artifacts/screenshots/about-390x844.png) | [`about-360x800.png`](../qa-artifacts/screenshots/about-360x800.png) |
| **`/process`** | [`process-1440x900.png`](../qa-artifacts/screenshots/process-1440x900.png) | [`process-768x900.png`](../qa-artifacts/screenshots/process-768x900.png) | [`process-390x844.png`](../qa-artifacts/screenshots/process-390x844.png) | [`process-360x800.png`](../qa-artifacts/screenshots/process-360x800.png) |
| **`/contact`** | [`contact-1440x900.png`](../qa-artifacts/screenshots/contact-1440x900.png) | [`contact-768x900.png`](../qa-artifacts/screenshots/contact-768x900.png) | [`contact-390x844.png`](../qa-artifacts/screenshots/contact-390x844.png) | [`contact-360x800.png`](../qa-artifacts/screenshots/contact-360x800.png) |
