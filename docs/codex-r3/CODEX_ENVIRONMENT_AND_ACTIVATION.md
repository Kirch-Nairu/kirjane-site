# CODEX R3 — Environment and Direct Activation

**Repository:** Kirch-Nairu/kirjane-site
**Branch:** `experiment/codex-cinematic-overhaul-r3`
**Parent:** `experiment/salryn-cinema-site-integration-r1` @ `d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07`
**Mission:** `KIRJANE-CODEX-CINEMATIC-OVERHAUL-R3`
**Owner:** Kirch. No merge, deployment, DNS change, or secrets.

## Codex workspace setup

Requires Node.js 22+, Python 3.12+, npm, Playwright Chromium and a clean Git checkout. No environment variables or paid service keys are required.

```bash
git fetch origin experiment/codex-cinematic-overhaul-r3
git status --short
git switch experiment/codex-cinematic-overhaul-r3 || git switch -c experiment/codex-cinematic-overhaul-r3 --track origin/experiment/codex-cinematic-overhaul-r3
git merge-base --is-ancestor d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07 HEAD
npm ci --ignore-scripts --no-audit --no-fund
(cd creative && npm ci --ignore-scripts --no-audit --no-fund)
python3 scripts/build_immersive_r2.py --output dist/cinema-integration
npx playwright install chromium
node --test creative/film/src/director/*.test.mjs
node scripts/qa_salryn_site_integration.mjs
FORGE_DIST=dist/cinema-integration FORGE_EVIDENCE=dist/codex-r3-evidence/r2 node scripts/qa_immersive_r2.mjs
CODEX_R3_DIST=dist/cinema-integration CODEX_R3_SHOTS=dist/codex-r3-evidence/baseline node scripts/codex_r3_capture.mjs
```

Do not reset a dirty worktree. If a generated dist directory already exists, use a fresh worktree or rework the build paths and test harness deliberately; do not falsely claim fresh evidence from stale artifacts.

## First task message for Codex

> Activate `KIRJANE-CODEX-CINEMATIC-OVERHAUL-R3` in `Kirch-Nairu/kirjane-site` on `experiment/codex-cinematic-overhaul-r3`. Inherit the existing seven-page Creative Forge R2 site PLUS the complete 23-scene Salryn Cinema R5 already integrated on the main Salryn page. The R5 film includes deterministic camera/cursor, press-ripple animation, opt-in Web Audio, Shadow DOM and actual native page scroll. Do not import the failed predecessor branch's site implementation. Read `AGENTS.md`, `docs/CODEX_CINEMATIC_R3_BRIEF.md`, `docs/codex-r3/START_HERE.md`, `SHOT_MAP.md`, `INTEGRATION_CONTRACT.md`, `MOTION_ARCHITECTURE.md` and `QA_EVIDENCE.md`. Inspect the ten numbered `docs/*.jpg` owner-reference images and use `scripts/codex_r3_capture.mjs` to generate 20 integrated current-source screenshot states, including five R5 cinema scenes. Implement P0 rebuilds 03/04/08/09/10, P1 motion upgrades 01/02/05/06/07, and excellent film-wide timing, full-screen text overlays, motion/camera, click accuracy, audio mixing, and 2880×1800/tall/mobile responsiveness. Favor meaningful CGI and licensed real libraries; no superficial SVG recoloring. Run real browser QA, compare and inspect actual screenshots, write bounded commits, update evidence and licenses. Require 61/79/68/27 regression floors, plus visual and device QA. Work only on the Codex branch, keep Draft PR against integrated R5 branch; no merge or deployment. Begin implementation rather than a planning-only response.

## Baseline evidence now available

- The new Codex branch baseline workflow [#44915981078](https://github.com/Kirch-Nairu/kirjane-site/actions/runs/44915981078) passed at `c428cab6054ec2756f3916fdffffbd752a774f80`: 27/27 math, 68/68 integrated film browser, 79/79 inherited R2/axe, and 20/20 screenshot captures.
- New combined-site artifact: `codex-r3-baseline-captures`, ID `14711442379` (20 screenshots + index/manifest). Earlier run #44894320712 is pre-R5 historical evidence only.
- `docs/01-home-fragments.jpg` through `docs/10-salryn-offline.jpg` are committed owner-reference images, not proof of current runtime. Exact original upload identity is unverified.

Codex should produce actual candidate modifications and a Draft PR. Starting CI qualification does not mean any requested R3 redesign is already complete.
