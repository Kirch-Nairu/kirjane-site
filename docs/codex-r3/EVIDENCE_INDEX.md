
## New verified Codex combined-site baseline

- [Codex integrated baseline run #44915981078](https://github.com/Kirch-Nairu/kirjane-site/actions/runs/44915981078) at `c428cab6054ec2756f3916fdffffbd752a774f80`: **PASS**.
- Artifact `codex-r3-baseline-captures` ID `14711442379`: **20/20** source-rendered stills (10 numbered + 5 phone + 5 Salryn R5 film), no capture errors.
- Same run: 27/27 R5 math, 68/68 on-site film checks and 79/79 inherited R2/axe checks.
- No creative improvements by Codex are represented by this before-capture run. New candidate after-shots must be generated per milestone.

# CODEX R3 — Evidence Index

**No Codex R3 redesign is implemented at handoff.** New Codex combined-site baseline successfully captured 20 frames at exact SHA `c428cab6054ec2756f3916fdffffbd752a774f80`. These are before shots, NOT evidence of a finished redesign. Historical pre-R5 capture run #44894320712 had only 15 frames and must not be presented as the current baseline.

## Baseline screenshot generation

Build a noindex preview, then run:

```bash
python3 scripts/build_immersive_r2.py --output dist/codex-r3-baseline-001
CODEX_R3_DIST=dist/codex-r3-baseline-001 CODEX_R3_SHOTS=dist/codex-r3-evidence/baseline node scripts/codex_r3_capture.mjs
```

Open `dist/codex-r3-evidence/baseline/index.html` over a local HTTP server for the generated visual index. The script records 10 owner-shot approximations, 5 phone states and 5 integrated R5 cinema states, with viewport/phase metadata.

**Important:** these are source-generated Chromium screenshots, not the original user's Windows screenshot files. Compare with the owner descriptions in `SHOT_MAP.md` and capture additional manual browser shots when the scene is not aligned.

For candidate comparison:

```bash
python3 scripts/build_immersive_r2.py --output dist/codex-r3-candidate-001
CODEX_R3_DIST=dist/codex-r3-candidate-001 CODEX_R3_SHOTS=dist/codex-r3-evidence/candidate node scripts/codex_r3_capture.mjs
```

The preview build modifies generated JS/CSS files in the worktree; run `git status` and do not accidentally commit unrelated build outputs without reviewing them.

## Historical pre-R5 R2 captures — archival only

- **GitHub Actions run:** https://github.com/Kirch-Nairu/kirjane-site/actions/runs/44894320712
- **Historical workflow:** prior experiment's baseline, not the current Codex workflow
- **Run source commit:** `3cacb893ae3d9c35b416a3291e63bd983dbcf8ce`
- **Artifact:** `historical pre-R5 R2 baseline artifact` (GitHub artifact ID `14703327568`, 5.15 MB, retention 14 days)
- **Result:** PASS, 15/15 captures, 0 missing selectors, 0 reported page errors; includes `manifest.json` and `index.html`.
- **Codex CLI retrieval** (if `gh` is authenticated and installed):
  
  ```bash
  gh run download 44894320712 --repo Kirch-Nairu/kirjane-site --dir dist/codex-r3-evidence/baseline-ci
  ```
  
  Otherwise use the GitHub Actions run's **Artifacts** download in the connected account. No Codex chat upload is required.

**Visual limitation:** this is Playwright/headless Chromium. Ten numbered owner reference JPGs are embedded under `docs/01-*.jpg` through `docs/10-*.jpg` (byte-for-byte original provenance unverified); scroll phases are *approximations*, and screenshot 06's automatically selected beat may not exactly match the owner's "Different workspaces" moment. Headless R3F deliberately uses a software-GPU fallback. Codex must manually seek the precise beats and capture real hardware-GPU footage before owner approval.

## Artifact ledger

| Type | SHA | Scene or route | Viewport | State/phase | Browser/GPU | Link or exact path | Verified? |
|---|---|---|---|---|---|---|---|
| Baseline contact sheet | TBD | shots 01–10 | 1440×900 | specified in manifest | TBD | TBD | NO |
| Baseline mobile | TBD | 03/04/08/09/10 | 390×844 | specified in manifest | TBD | TBD | NO |
| Candidate before/after | TBD | shots 01–10 | matched | matched | TBD | TBD | NO |
| Desktop continuous scroll video | TBD | Home/Salryn/Process | matched | forward+reverse | TBD | TBD | NO |
| Mobile continuous scroll video | TBD | same | matched | touch native | TBD | TBD | NO |
| Accessibility report | TBD | all routes | matched | multiple states | TBD | TBD | NO |
| Performance/heap study | TBD | R2 vs R3 | matched | repeated | TBD | TBD | NO |
| Independent exact-SHA review | TBD | PR | n/a | n/a | n/a | TBD | NO |

Never turn a TBD or NO into a YES without reviewing that exact output.
