# ACTIVE WORK — KIRJANE-PREMIUM-CORPORATE-WEBSITE-R1

**Status:** OPEN — mission staged; no implementation or visual QA approved.

**Issue:** https://github.com/Kirch-Nairu/kirjane-site/issues/3
**Branch:** `design/kirjane-premium-r1-antigravity`
**Anchor:** `c2725cceed370d7664606a00c894de62198b7894`
**Executor:** Antigravity (local workstation) — no local Antigravity session launched by this GitHub-only preparation.
**Reference:** Valencia R2 `d5e121522c557f63ec683cf9aee79309795005b8`.

## Work order
G0 skills + baseline confirmation -> G1 prior-commit visual audit -> G2 single design system -> G3 **first-viewport quality gate** -> G4 full site -> G5 motion polish -> G6 claim/content integrity -> G7 real-browser evidence -> G8 draft PR and inspection handoff. Gates and exact requirements are in Issue #3.

## Current source blockers observed at anchor
- `app/content/team.ts`: `quote` strings for seven people not evidenced as actual quotations.
- `app/components/ProcessStoryScroll.tsx`: unsupported 24/7, Daily Encrypted Backups and 100% Verified claims.
- `app/content/company.ts`: generic `facebookUrl` and alternate hero text; `app/routes/home.tsx` hardcodes different headline.
- `app/components/SalrynInteractiveSimulator.tsx`: demonstration UI may imply transaction persistence. Verify visual labels and clarify truthfully.

Do not treat the above source scan as a completed functional/visual audit. Real browser review is pending.

## Next executor action
On the local working copy verify `gh api user`, `git status`, branch tracking and baseline. Install/inspect remaining third-party skills and review project-local skill files. Produce an evidence-based design plan. Implement against the correct remote branch. Capture real screenshots and video.
