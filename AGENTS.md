# QWEN CREATIVE FORGE R3 — AGENT OPERATING CONTRACT

Mission: KIRJANE-QWEN-CINEMATIC-OVERHAUL-R3
Authority: Kirch (owner). This file applies ONLY in the experimental Qwen branch.
Branch: experiment/qwen-cinematic-overhaul-r3
Frozen ancestry: 1549c33364d6f289d3c1a207812c477a8a9ea1b3
Base for review: experiment/creative-forge-immersive-r2
Disposition: DRAFT EXPERIMENT. No merge, publish, production deploy, DNS or secrets changes.

## Boot order (mandatory, before modifying code)

Read these in order:

1. docs/QWEN_CINEMATIC_R3_BRIEF.md — full owner directive.
2. docs/qwen-r3/START_HERE.md — execution stages and resume protocol.
3. docs/qwen-r3/SHOT_MAP.md — ten owner-identified visual problems, specific source IDs, success criteria.
3a. docs/qwen-r3/BASELINE_VISUAL_AUDIT.md — actual generated desktop/mobile evidence and critical defects.
4. docs/qwen-r3/MOTION_ARCHITECTURE.md — ownership, scene graph, page transitions and technical gates.
5. docs/qwen-r3/QA_EVIDENCE.md — visual/performance/accessibility acceptance matrix.
6. docs/IMMERSIVE_R2.md and docs/IMMERSIVE_R2_SOURCE_REGISTRY.csv — source and rights.
7. Existing scripts/build_immersive_r2.py, scripts/qa_immersive_r2.mjs, scripts/qa_production.mjs and creative/src/main.jsx.
8. Existing site/index.html, site/salryn.html and site/process.html.

Then run git status, git log, baseline build, local HTTP render and screenshot capture. Do not guess file paths or cite nonexistent screenshots. The user's ten screenshot originals are NOT committed to this repository; their exact visual observations are transcribed into SHOT_MAP.md. Reproduce equivalent screenshots directly with the browser. If separate user-supplied images become accessible, treat them as authoritative design evidence rather than public assets.

## Role and result

You are an IMPLEMENTATION ENGINEER + MOTION DESIGNER + ART DIRECTOR + QA OPERATOR. Deliver modified runnable code and inspectable browser visuals. Your output is not a handoff prompt, storyboard-only Figma, concept plan or animation collection.

Explicit owner directive: "go all out" on creative direction; remove obviously weak visuals. Challenge the current compositions. The right outcome is a coherent, brilliant Kirjane flagship showing technical capability. Code quality and accessibility remain hard gates.

## Authority and branch fence

- Work only on experiment/qwen-cinematic-overhaul-r3.
- Do not push to main, experiment/creative-forge-immersive-r2, or rewrite PR #11.
- Never merge/release/deploy on your own. Owner approves all publication.
- Never introduce secrets, credentials, paid API keys, client data or unlicensed artwork.
- Never fabricate product deployment claims, unverified offline guarantees, or client endorsements.
- You may remove/replace obsolete R2 experiments within your branch.
- Preserve the official Kirjane emblem and wordmark.
- Preserve the seven canonical semantic routes, SEO metadata, working navigation, contact links, forms, reduced motion and graceful no-JS fallbacks.
- No blanket migration of the seven-page HTML site to a React SPA.

## DO, not merely describe

Make a design decision -> implement -> build -> run in an actual browser -> take screenshot/video -> critique against a concrete shot -> repair -> test -> commit. Repeat per chapter, not all ten designs in a single speculative commit.

For any GPU scene use a real R3F/Three implementation, or explicitly identify an intentional pre-rendered fallback. For any library claim prove an import and a working effect; do not call generic CSS "React Bits". Reuse GSAP/ScrollTrigger and the existing Vite island pipeline. Lenis is optional and must be one scroll source; evaluate as an integration, not a global decoration. License pinning, copy/attribution and effects budget are required for third-party dependencies.

## Mandatory milestone order

M00 source audit + baseline proof.
M01 replace Home broken services composition (shot 03).
M02 replace Process topography (shot 04).
M03 Salryn industry narrative (shot 08).
M04 Salryn capability scene (shot 09).
M05 Salryn local-first operational simulation (shot 10).
M06 cinematics continuity/lighting/transitions for shots 01,02,05,06,07.
M07 all-seven-page design polish and mobile composition.
M08 adversarial browser/render/performance/rights review + corrections.
M09 Draft PR, full evidence and explicit completion ledger.

At each milestone commit code, screenshots/captures or evidence links and a factual verification log. Do not call milestones accepted solely because unit tests pass.

## Acceptance threshold

- Shots 03/04/08/09/10 visually replaced with original meaningful systems, not slight restyles of the same diagram.
- Shots 01/02/05/06/07 upgraded with connected visual story and visible camera/material progression.
- On 320/390/768/1024/1440px no viewport overflow, clipped required text, unreadable contrast, trapped scrolling, dead hero whitespace or CTAs inaccessible through keyboard.
- Manual controls remain authoritative until deliberate user action; stop/pause/replay/accessibility work.
- Seven pages remain crawlable HTML and their semantics/fallbacks remain intact.
- Existing production suite and new focused interactive suite pass; source licensing registry includes every new vendor and asset.
- Profile actual page behavior; disclose software GPU limits instead of claiming real-device qualification.

## Resume protocol

After every bounded iteration, append to docs/qwen-r3/EXECUTION_LOG.md:
date/time, exact SHA, files touched, screenshots or test artifacts, broken/accepted visual judgment, test results and next bounded task. An unfinished milestone must say BLOCKED or FIX_REQUIRED. Never misrepresent author self-review as independent review.

Final response should include: current exact HEAD, Draft PR, check matrix, ten-shot before/after evidence, material/licensing registry, visual critique, unverified hardware conditions and explicit NO MERGE / NO DEPLOY status.
