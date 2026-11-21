# QWEN R3 — Evidence Index

**No R3 implementation evidence has been submitted yet.** The baseline capture workflow HAS completed successfully and produced 15 source-rendered PNGs (10 numbered desktop states + 5 phone snapshots) with a reproducible manifest. Baseline captures are not evidence of R3 creative changes.

## Baseline screenshot generation

Build a noindex preview, then run:

```bash
python3 scripts/build_immersive_r2.py --output dist/qwen-r3-baseline-001
QWEN_R3_DIST=dist/qwen-r3-baseline-001 QWEN_R3_SHOTS=dist/qwen-r3-evidence/baseline node scripts/qwen_r3_capture.mjs
```

Open `dist/qwen-r3-evidence/baseline/index.html` over a local HTTP server for the generated visual index. The script records 10 owner-shot approximations and 5 additional phone frames, with viewport/phase metadata.

**Important:** these are source-generated Chromium screenshots, not the original user's Windows screenshot files. Compare with the owner descriptions in `SHOT_MAP.md` and capture additional manual browser shots when the scene is not aligned.

For candidate comparison:

```bash
python3 scripts/build_immersive_r2.py --output dist/qwen-r3-candidate-001
QWEN_R3_DIST=dist/qwen-r3-candidate-001 QWEN_R3_SHOTS=dist/qwen-r3-evidence/candidate node scripts/qwen_r3_capture.mjs
```

The preview build modifies generated JS/CSS files in the worktree; run `git status` and do not accidentally commit unrelated build outputs without reviewing them.

## Verified generated R2-source baseline — no chat upload needed

- **GitHub Actions run:** https://github.com/Kirch-Nairu/kirjane-site/actions/runs/44894320712
- **Workflow:** `.github/workflows/qwen-r3-baseline.yml`
- **Run source commit:** `3cacb893ae3d9c35b416a3291e63bd983dbcf8ce`
- **Artifact:** `qwen-r3-baseline-captures` (GitHub artifact ID `14703327568`, 5.15 MB, retention 14 days)
- **Result:** PASS, 15/15 captures, 0 missing selectors, 0 reported page errors; includes `manifest.json` and `index.html`.
- **Qwen CLI retrieval** (if `gh` is authenticated and installed):
  
  ```bash
  gh run download 44894320712 --repo Kirch-Nairu/kirjane-site --name qwen-r3-baseline-captures --dir dist/qwen-r3-evidence/baseline-ci
  ```
  
  Otherwise use the GitHub Actions run's **Artifacts** download in the connected account. No Qwen chat upload is required.

**Visual limitation:** this is Playwright/headless Chromium. The original owner screenshot images are not embedded in the repo; scroll phases are *approximations*, and screenshot 06's automatically selected beat may not exactly match the owner's "Different workspaces" moment. Headless R3F deliberately uses a software-GPU fallback. Qwen must manually seek the precise beats and capture real hardware-GPU footage before owner approval.

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
