# QWEN R3 — Evidence Index

**No R3 implementation evidence has been submitted yet.** This file is a ledger, not proof.

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
