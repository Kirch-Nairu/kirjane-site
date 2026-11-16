# Kirjane R3 — mandatory self-review gate for future homepage changes

**Policy:** Before describing a new homepage change as ready, the implementing agent performs **two explicit passes** on an exact commit: (1) implementation + reproduction, then (2) a fresh, adversarial review of the resulting diff and behavior. **Self-review does not replace an independent reviewer or owner approval.**

## Required evidence per change

1. **Frozen input**: repository, target branch, base and exact candidate SHA, changed-file inventory and feature boundary.
2. **Repro first**: for reported defects capture the original behavior, timing, affected viewport/input, root cause, and a failing test where possible.
3. **Source parity and safety**: run the generator, compare generated HTML, syntax/compile checks, `git diff --check`, verify untouched inner routes and immutable artwork hashes.
4. **Adversarial behavior**: forward and reverse scroll, stage selection *during intermediate frames*, repeated clicks, keyboard input, no-JS, reduced motion, responsive/short-height/aspect ratio, font-load and resize behavior.
5. **Rendering**: capture desktop and mobile screenshots from the actual rendered site. Never substitute illustrations for browser evidence.
6. **Performance**: look for unnecessary DOM/style mutations, duplicate paints, long frames, and animation churn. Report GPU/multi-browser profiling as pending if not measured.
7. **Full regression**: rerun relevant old and new tests, note any timeouts/flakes explicitly; a timed-out test is **not** a pass.
8. **Final independent read-through**: re-inspect all changed source against the issue list, add a second-pass findings ledger, and classify each issue as fixed/remaining/unverified.
9. **No automatic promotion**: retain a draft PR and do not merge or publish to Vercel/Hostinger without the owner's separate acceptance.

## Honest verdicts

- `FIX_REQUIRED` — any reproducible blocking defect remains.
- `SELF_REVIEW_PASS_OWNER_QA_PENDING` — implemented and local checks pass; real Windows/owner checks or independent review pending.
- `OWNER_ACCEPTED` — owner specifically accepts exact candidate after visual review; separate from merge/deployment.

**Use separate proof from local inlined Chromium vs. real localhost/browser. Never conflate them.**
