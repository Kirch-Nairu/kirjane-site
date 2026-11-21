# CODEX R3 — integrated seven-page website + Salryn Cinema R5 contract

**Owner:** Kirch / Kirjane Labs  
**Mission:** KIRJANE-CODEX-CINEMATIC-OVERHAUL-R3  
**Working branch:** experiment/codex-cinematic-overhaul-r3  
**Frozen qualified parent:** d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07  
**Review base:** experiment/salryn-cinema-site-integration-r1 (Draft PR #13)  
**Disposition:** EXPERIMENT / NO MERGE / NO DEPLOY / NO PROD SECRETS.

## Actual baseline, not an assumed plan

This branch descends from the **complete** Kirjane seven-page Creative Forge R2 website and the integrated **23-shot Salryn Cinema R5**. Do not reimplement, detach, iframe or delete the film merely to apply the older ten-photo art-direction brief. Do not merge the abandoned predecessor branch; only the owner's design instructions, reference files, and evidence discipline were migrated.

The real in-page Salryn film is mounted at `site/salryn.html#salryn-cinema-experience`, after the Salryn hero and before existing kernel / engines / industries / activation / growth / offline / configuration chapters. The cinematic source is located at:

- `creative/film/src/App.tsx`, `creative/film/src/cinema-fullscreen.css`, `creative/film/src/styles.css`
- `creative/film/src/scenes/manifest.js` — 23 authored scenes, fictional data
- `creative/film/src/director/` — camera, time/phase, cursor geometry, click and ripple math
- `creative/film/src/audio/click.ts` — locally synthesized Web Audio
- `creative/film/entry.tsx` — React Shadow DOM mount
- `site/js/forge-salryn-cinema-loader.js` — Salryn-only lazy loader
- `site/js/forge-salryn-cinema-r1.js` — checked-in executable compiled bundle
- `site/css/salryn-cinema-integration.css` — corporate bridge / fallback styles

The rest of the website retains all seven static pages, React Bits, R3F, Three.js, GSAP/ScrollTrigger, Lenis on eligible routes, the official Kirjane logo, real semantic HTML, SEO, contact links and R3F Salryn engine configurator. No wholesale SPA conversion.

## Interaction rules

- **One scroll owner:** browser/native document scroll position. Do not nest a second scrollable viewport, add competing ScrollTriggers to the film, or initialize Lenis over the Salryn pinned director without an exact compatibility proof.
- **Deterministic math:** the 23 scenes, camera position, cursor position, press/ripple values and overlays are functions of normalized scroll phase. Reversing or scrubbing must replay visuals deterministically. No CSS-timekeyframed fake cursor independent of the film clock.
- **Cursor accuracy:** use measured DOM targets and actual camera geometry, with tolerances backed by browser assertions. No unrelated cursor clicks in passive receipt, inventory or audit scenes.
- **Sound:** original locally synthesized micro-clicks are **OFF BY DEFAULT**; user must actively enable them. No autoplay, no replay storm when seeking backward or quickly across a scene. Sound toggle must remain keyboard-accessible with visible accessible name and `aria-pressed`.
- **Storytelling:** preserve shift-opening → sale → receipt → inventory → finance → audit → shift close, with a coherent CTA to the real Contact route. All data are fictional, source-inspired; the film is NOT a live Salryn POS, billing, accounting, or working booking backend.
- **Accessibility:** one corporate Salryn `h1`, film chapters as `h2`; reduced-motion documentary fallback; no hidden focusables; no tap trap; no horizontal overflow at 320, 390, desktop 1440 and 2880-wide plus tall 1684×1798/2880×1800 display.
- **Isolation:** the Salryn R5 film remains one React island in a Shadow Root. CSS from the in-app mock must not leak to official corporate site. No real Salryn API / database / license / checkout / printer calls.

## Creative implementation agenda

The ten previous owner shots remain direct tasks: P0 **03 Services**, **04 Process**, **08 Flavors**, **09 Configurator**, **10 Offline-first** need original world-class redesigns, not flat SVG recolors. P1 **01/02 Home fragments/core**, **05/06/07 Salryn CGI evolution** need meaningful causality, materials, camera cohesion, contrast and motion polish. Extend the creative audit to the **new 23-scene film** including accessible typography overlays, cursor/press feedback, camera holds, cross-scene transitions and the film-to-kernel bridge.

The ten JPG visual reference files are included as `docs/01-home-fragments.jpg` through `docs/10-salryn-offline.jpg`. Their byte-for-byte identity with prior ChatGPT attachment originals has not been independently verified; inspect the committed stills and render the current site rather than treating notes as actual screenshots. Prior baseline run #44894320712 is **historical pre-R5 evidence**, not current baseline. Current Codex capture harness adds five live film frames, producing 20 source captures.

## Required reproducible gates

Starting from fresh workspace on the current branch:

```bash
npm ci --ignore-scripts --no-audit --no-fund
(cd creative && npm ci --ignore-scripts --no-audit --no-fund)
python3 scripts/build_immersive_r2.py --output dist/cinema-integration
node --test creative/film/src/director/*.test.mjs
node scripts/qa_salryn_site_integration.mjs
FORGE_DIST=dist/cinema-integration FORGE_EVIDENCE=dist/codex-r3-evidence/r2 node scripts/qa_immersive_r2.mjs
CODEX_R3_DIST=dist/cinema-integration CODEX_R3_SHOTS=dist/codex-r3-evidence/baseline node scripts/codex_r3_capture.mjs
python3 scripts/build.py --output dist/codex-production-verify
npm test
```

If a build output exists already, create a new clean worktree or choose a fresh `dist/` path and explicitly point each QA script to it. Never compare screenshots of a stale source build. Keep each commit bounded; evidence must record exact SHA and viewport.

**Source qualification at the frozen parent:** 61/61 production, 79/79 inherited R2 Chromium/axe, 68/68 integrated site, 27/27 math. These are regression floors, not art-direction approval. Never claim hardware-GPU or Safari proof from headless Chrome. Record separate device checks and third-party source/license registry.

## Review / release boundary

All Codex changes land only on `experiment/codex-cinematic-overhaul-r3`. Existing stacked PRs #9/#10/#11/#13 and the Salryn standalone source PR #7 must not be modified or merged by the agent. Open one Draft Codex PR targeting `experiment/salryn-cinema-site-integration-r1` and append every milestone's exact SHA, before/after stills, real browser recordings, assets and licenses, performance numbers, outstanding failures, and independent review requests. Owner approves publication.

**Final gate:** each of the ten original owner shots plus the integrated film has documented PASS/FIX_REQUIRED/BLOCKED and inspectable evidence. No generic design recommendation counts as implementation.
