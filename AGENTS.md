# KIRION FORGE — Kirjane premium corporate website

> **Status:** Mission infrastructure staged. Frontend implementation and visual acceptance **NOT complete**.

## Identity & branch
- Repository: `Kirch-Nairu/kirjane-site`.
- Mission: `KIRJANE-PREMIUM-CORPORATE-WEBSITE-R1`.
- Official work item: [Issue #3](https://github.com/Kirch-Nairu/kirjane-site/issues/3).
- Writer: Antigravity, working on local workstation.
- Exclusive branch: `design/kirjane-premium-r1-antigravity`.
- Pinned starting SHA: `c2725cceed370d7664606a00c894de62198b7894`.
- Successful *process* reference: Valencia R2 branch `design/valencia-r2-antigravity-one-shot` at `d5e121522c557f63ec683cf9aee79309795005b8`.
- No direct writes to `main`, merge, public deployment, DNS, or production settings without owner authorization.

## Load these before any implementation
1. This file and Issue #3, especially G0–G8.
2. `.agents/skills/frontend-design/SKILL.md` (copied from Valencia R2 with its Apache 2.0 license).
3. `.agents/skills/kirjane-visual-acceptance/SKILL.md`.
4. `.forge/ACTIVE_WORK.md`, `.forge/DESIGN_SYSTEM.md`, `.forge/VALIDATION.md`.
5. `docs/KIRJANE-MOTION-STORYBOARD-R1.md` and `docs/KIRJANE-CONTENT-ARCHITECTURE-R1.md`.
6. Verify availability and read official GSAP React, ScrollTrigger, timeline, performance skills and Vercel web-design-guidelines + react-best-practices in the Antigravity workspace. These **are not bundled here**; their installation must be verified, not asserted.

## Operating laws
- **Real visual proof outranks implementation claims.** Compile/lint/build success is necessary but never sufficient for approval. Review real browser screenshots at 1440×900, 768×900, 390×844 and 360×800. Inspect animations in short recordings and real interactions.
- **Homepage gate first.** Audit historical designs; establish one distinct editorial design system, then perfect actual homepage first viewport before attempting blanket six-page polish. This is an internal quality gate, not a reason to stop the mission.
- **Evidence before invention.** No fabricated employee quotes, testimonials, operational guarantees, availability, transactions, metrics, customer counts or completion status. A simulated POS checkout must look and behave like an explicitly labelled demonstration.
- **Copy is a product feature.** Speak to business owners, institutional partners and decision-makers. Never show repo, agent, technical audit, placeholder or internal planning jargon on public pages.
- **Brand fidelity.** Use the real Kirjane chameleon and logo assets already in `public/brand/`; do not approximate them in fake drawings. Exact brand HEX must be verified from owned assets/approved brand guide rather than guessed.
- **Motion has a job.** Use GSAP where its interaction model is genuinely beneficial, with reduced-motion alternative, cleanup, keyboard/touch, no scroll hijack, no sticky traps, and no CLS/performance regression.
- **React continuity.** Keep the existing React Router + Vite + TypeScript architecture and all six routes. No framework rewrite and no Valencia copy-paste.
- **Single writer, inspectable history.** Small coherent commits, no blind whole-file rewrites. Document scope and failure evidence. Store screenshots/recordings as accessible PR artifacts or links, not merely inaccessible machine paths.
- **No false acceptance.** Update `.forge/VALIDATION.md` only with actually executed commands, captured screenshots/recordings and exact candidate SHA. If browser or runtime inaccessible, mark *BLOCKED*, not PASS.

## Completion contract
Finished source on the assigned branch, actual responsive renders, credible content, functional six routes, passing automated tests, verified smooth motion, visual QA artifacts and a **draft** PR to `main`. Owner approval is required to mark visual acceptance final. No merge or deploy.
