# R3 EXECUTION PLAYBOOK — START HERE

**Mission:** KIRJANE-CODEX-CINEMATIC-OVERHAUL-R3
**Engineer:** Codex implementation agent; real browser review and code modifications required
**Repository:** Kirch-Nairu/kirjane-site
**Working branch:** experiment/codex-cinematic-overhaul-r3
**Frozen integrated R2 + R5 baseline:** d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07
**Review base:** experiment/salryn-cinema-site-integration-r1
**Owner:** Kirch. No merge/deployment permission.

## Definition of done (the actual deliverable)

The work is complete ONLY when all of the following exist:
- A tested site with seven functioning canonical static HTML routes AND the inherited 23-scene Salryn R5 film.
- Original implemented cinematic experiences for all five priority fixes (owner shots 03, 04, 08, 09, 10).
- Visible visual/story continuity upgrades to the other five shots (01, 02, 05, 06, 07).
- Usable touch/mouse/keyboard controls, actual responsive and reduced-motion alternatives.
- Proof of **real interactive browser renders**, not code-only screenshots or diagrams passed off as deployed systems.
- A reproducible local preview build, precise new asset/license ledger and measured costs.
- Visual comparisons at comparable scenes and viewports, not unrelated screenshots.
- An item-by-item correction register showing what changed and what still fails.
- A separate Draft PR targeting experiment/salryn-cinema-site-integration-r1, with independent-review request/evidence when obtainable.
- An explicit statement that no merge or deployment occurred.

**No "completed" label** while any P0 shot remains a flat diagram just restyled, has unreadable content, or lacks a tested interaction.

## Stage 0 — branch and workspace verification (commands)

Run these and inspect results before installing or changing files:

\`\`\`bash
pwd
git remote -v
git status --short
git branch --show-current
git rev-parse HEAD
git merge-base --is-ancestor d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07 HEAD
find docs/codex-r3 -maxdepth 2 -type f | sort
node --version
python3 --version
\`\`\`

The current branch MUST be \`experiment/codex-cinematic-overhaul-r3\`. If Codex's clone defaults to another branch, use:

\`\`\`bash
git fetch origin experiment/codex-cinematic-overhaul-r3
git switch experiment/codex-cinematic-overhaul-r3 || git switch -c experiment/codex-cinematic-overhaul-r3 --track origin/experiment/codex-cinematic-overhaul-r3
\`\`\`

**Do not** execute a destructive checkout/reset when there are uncommitted changes; reconcile with \`git status\`. Never work on \`main\` or the existing R2 PR branch. Check that the frozen commit is an ancestor; if not, STOP with SOURCE_MISMATCH rather than inventing a merge history.

Read \`AGENTS.md\`, \`docs/CODEX_CINEMATIC_R3_BRIEF.md\`, \`docs/codex-r3/SHOT_MAP.md\`, this file, \`docs/codex-r3/MOTION_ARCHITECTURE.md\` and \`docs/codex-r3/QA_EVIDENCE.md\` completely.

## Stage 1 — dependencies and actual baseline

Use the existing source pipeline. First run:

\`\`\`bash
npm ci --ignore-scripts --no-audit --no-fund
(cd creative && npm ci --ignore-scripts --no-audit --no-fund)
npx playwright install chromium
python3 scripts/build_immersive_r2.py --output dist/cinema-integration
node --test creative/film/src/director/*.test.mjs
node scripts/qa_salryn_site_integration.mjs
FORGE_DIST=dist/cinema-integration FORGE_EVIDENCE=dist/codex-r3-evidence/r2 node scripts/qa_immersive_r2.mjs
CODEX_R3_DIST=dist/cinema-integration CODEX_R3_SHOTS=dist/codex-r3-evidence/baseline node scripts/codex_r3_capture.mjs
python3 scripts/build.py --output dist/codex-production-verify
npm test
\`\`\`

If test script names or CLI flags differ, inspect the actual repo scripts and use their supported flags instead. Never silently skip a required check. Preview builds are immutable: use a **new** path under \`dist/\` for each rerun, e.g. \`dist/codex-r3-candidate-001\`, \`...-002\`; never overwrite the same path.

For a true before/after comparison at later milestones, make a separate detached R2 worktree at the exact frozen SHA (if capacity permits), build it once and keep it read-only:

\`\`\`bash
git worktree add --detach ../kirjane-r2-frozen d9bdf2324b861e3f4f6f71a0438afa65b2eb1c07
\`\`\`

Run \`npm ci\` and the preview build in that worktree separately. Its screenshots are the baseline; do not compare R3 to old screenshots captured at different dimensions or animation times.

Serve each built directory over HTTP (not \`file://\`):

\`\`\`bash
python3 -m http.server 8081 --bind 127.0.0.1 --directory dist/codex-r3-baseline-001
\`\`\`

A browser-capable Codex environment should visit the local server and capture the requested scene states. If browser support is absent, report **VISUAL_QA_BLOCKED** and still implement/test source and generate a portable preview artifact; never claim screenshots exist when absent.

## Stage 2 — create objective visual inventory

Build \`docs/codex-r3/EXECUTION_LOG.md\` and \`docs/codex-r3/CORRECTIONS.md\` if missing. Before edits, log:
- Exact commit, route and selected scene stage.
- Owner shot number from \`SHOT_MAP.md\`.
- Screenshot size and capture sequence (opening dismissed, scroll position, tab selection, reduced motion).
- User-visible failure: contrast, layout, unexplained empty region, flat SVG, visually confusing story, input override, clipping, performance.
- Risk and proposed creative intervention.

For each owner shot create a deterministic reproduction recipe (URL, viewport, selector to scroll into view, button/tab state, pause/wait condition) in \`docs/codex-r3/REPRO_RECIPES.md\`. Do not rely on fixed pixel scroll offsets alone. Use stable scene selectors and event-driven readiness.

Full visual coverage:
- desktop 1440×900 and 1920×1080;
- tablet 768×1024, 1024×768;
- mobile 390×844, 320×700;
- at least one touch profile and OS prefers-reduced-motion profile;
- native navigation with/back state and deep-link anchors.

Use a **real browser screenshot with the scene visible**, preferably matched full-viewport frames, not only a giant stitched full-page PNG with lazy assets missing.

## Stage 3 — implement five P0 creative rebuilds in order

Every milestone has a DESIGN REVIEW at commit. Finish one before the next, and test on desktop + mobile.

### M01 — Home services exhibition [Owner shot 03]

\`site/index.html#capabilities-exhibition\`; redesign the section layout, four real visual states, manual/scroll choreography and complete contrast. Replace the awkward tiny transparent block and black unreadable overlay. Four modes are distinct both materially and semantically. **Gate:** four states selectable, text legible in every state, no giant dead whitespace, responsive and interrupted state restoration. Submit 4 desktop + 4 mobile frames and a transition clip.

### M02 — Process topographic narrative [Shot 04]

\`site/index.html#home-process-section\` and \`site/process.html#process-journey\`. Use a unified path language, five authored stage transitions, clear visual focus and useful stage copy. Keep both Home tabs and Process anchors. **Gate:** five states, pointer/keyboard/deep-link, reverse scroll and stable manual selection. No static \`organism-topology.svg\` as the primary showpiece.

### M03 — Salryn industry narrative [Shot 08]

\`site/salryn.html#scene-c-flavors\`, \`#scene-g-configuration\`. Build the five-step narrative with twelve authentic industry options, at least three distinctly demonstrated flows, and stateful selection. **Gate:** changing industry changes a visual pipeline and visible engine state, replays deterministically, and passes selected context into inquiry while preserving truthful disclaimers. No generic radial SVG as central visual.

### M04 — Salryn engine configurator [Shot 09]

\`site/salryn.html#scene-d-activation\`, \`creative/src/main.jsx\`. Grow the real 3D center and make eight engine controls readable. Selection/capability state must be synchronized with actual configurator. **Gate:** 6 optional toggles, 2 mandatory engines never disabled; 3D node focus/relationships and DOM labels/counts reflect the same state; GPU-missing fallback looks intentional; no software GPU passed off as qualified hardware.

### M05 — Offline/local-first simulation [Shot 10]

\`site/salryn.html#scene-f-independence\`. Create clear normal/outage/recovery operational states, with waiting external actions and local continuity. **Gate:** three state snapshots, replay/previous/next, keyboard and touch, no false completed external action during outage. Preserve architectural dependency qualifiers. Never claim all installations guarantee offline availability.

**Milestone close:** commit bounded code, run focused tests, save real visual evidence (or explicit blocker), update corrections, then move on. Avoid gigantic single commits.

### Additional milestone — integrated Salryn Cinema R5 polish

The embedded 23-scene film already ships in the experimental baseline. Preserve and improve its full-screen narrative, cursor precision, deterministic click/ripple/audio, mobile/tall 2880×1800 framing, reduced motion, Shadow DOM boundary and single scroll owner. Add five dedicated source-rendered film captures in addition to the ten owner shots. Read `docs/codex-r3/INTEGRATION_CONTRACT.md`; tests must stay green. Do not convert the film to a looping video or iframe. No real POS API calls or fabricated client evidence.

## Stage 4 — amplify the good CGI [Shots 01,02,05,06,07]

Build one coherent system:
- Home transforms disorder to structured clarity, with text beats and scroll camera synchronized.
- Salryn is recognizably one material identity through kernel, workspaces and specialized industries, without three unrelated CGI styles.
- Establish spatial continuity: matching motion axis, lighting highlights, common tessellation/material family, topology semantics and camera easing.
- Improve dynamic contrast of dark stages; make spheres visible without overexposed blooming.
- Use motion to explain shared records, custody, entitlement and resilience rather than aimless floating parts.
- Pausing in reverse/forward scroll must restore an interpretable state.

Keep official brand geometry unchanged. Choose still art, pre-rendered video or real WebGL based on actual loading, GPU and accessibility evidence—not aesthetic buzzwords.

## Stage 5 — page-wide art direction and composition

Review all seven pages including Services, Projects, About and Contact, not only the user's ten screenshot targets:
- Services: controlled spatial workflow construction and clear readable explanations.
- Projects: genuine portfolio/art inspection, no misleading client outcomes or invented case studies.
- Process: five-step path remains legible without effects.
- About: authoritative editorial text with clean line-based reveals.
- Contact: restrained premium CTA/form interactions, no visual effects intercepting input.
- Home and Salryn: sectional continuity.
- Navigation: mobile drawer, skip link, links and footer all work.

Aesthetics should use negative space **deliberately**, never empty for hundreds of pixels while a scene stays undersized. Material choices vary across dark and mist chapters. Avoid generic cards, oversaturation and noisy particle fields.

## Stage 6 — creative engineering reality check

Prioritize libraries with actual purpose:
- GSAP + ScrollTrigger for the central scroll director and stage handoffs.
- R3F/Three for actual 3D experiences, one renderer/context budget where technically possible.
- React Bits for strategically useful text/hover islands; vendor license/attribution.
- Lenis only when evidence shows it improves control without competing scroll owners; one RAF source.
- Liquid Glass JS / ShaderGradient / Liquid Logo or other repositories only if they pass license checks and improve an actual shot. They are not compulsory.
- Consider procedural shaders or pre-rendered cinematic footage when they produce better, more stable results than shader-framework accumulation.

Never execute unreviewed install scripts. Prefer pinned versions and \`npm ci --ignore-scripts\`; audit lockfile changes. Do not import new libraries via unpinned browser CDN tags.

## Stage 7 — comprehensive qualification

Run \`npm test\`, \`node scripts/qa_immersive_r2.mjs\` (configured for the latest built dist), \`node scripts/qa_immersive_smoke.mjs\`, and new R3-specific tests. Note: the existing smoke script may target a fixed dist path; inspect and adapt, documenting each change, rather than saying it ran when it didn't.

Create \`scripts/qa_codex_r3.mjs\` with cases for:
- each of five P0 scenes at key states;
- all seven routes, proper links, HTML semantics, no overflow at 320/390;
- active keyboard/tab input, touch, manual scroll override and user interruptions;
- focus order, screen readers where possible, axe and WCAG 2.2 AA contrast checks;
- reduced motion (OS and forced) + no JS fallback;
- single scroll source, no retained GPU context/observer after navigation/unmount;
- lazy assets actually decoded before screenshots;
- matched R2/R3 synthetic profile and hardware observations explicitly distinguished.

Record transfer sizes, long tasks, JS heap, median and p95/p99 frame pacing (with device/browser/environment) and CPU/GPU limits. Reject clearly worse behavior or mark an explicit performance hold; don't invent numbers.

## Stage 8 — handoff and independent review

Update \`docs/codex-r3/EXECUTION_LOG.md\`, \`docs/codex-r3/CORRECTIONS.md\`, \`docs/codex-r3/ASSET_LICENSES.csv\` and \`docs/codex-r3/EVIDENCE_INDEX.md\`.
Publish a separate **Draft PR** from \`experiment/codex-cinematic-overhaul-r3\` into \`experiment/salryn-cinema-site-integration-r1\`. Post the exact SHA, screenshots/recordings links, test failures and risks.

Independent reviewer: request a separate authenticated reviewer/session with GitHub access. If unavailable, say REVIEW_BLOCKED rather than self-issuing an independent approval.

**DO NOT MERGE, DEPLOY, OR PUBLISH.** The owner sees comparative captures and makes the final aesthetic call.

## Rework protocol

If a shot is still materially worse than the existing cinematic direction, mark \`FIX_REQUIRED\` and iterate; do not declare success on a passed lint/build. If time/tokens run out: commit partial tested progress, record precise next implementation command and unsatisfied acceptance criteria, then report partial delivery. The agent must be restartable from this repository alone without the ChatGPT conversation.

## Mandatory last response

Give a compact factual ledger:
- Current branch, exact SHA, Draft PR.
- Per-shot 01–10 outcome: PASS / FIX_REQUIRED / BLOCKED with direct visual artifact evidence.
- Seven-page functionality checks and any acknowledged failure.
- Imported libraries, versions, measured new payload and licensing decisions.
- What GPU/browser/devices actually rendered (versus fallback).
- Independent reviewer status.
- Final disposition: DRAFT, NO MERGE, NO DEPLOY.
