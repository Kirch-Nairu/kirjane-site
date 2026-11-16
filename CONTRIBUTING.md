# Kirjane site — engineering and review rules

This policy applies to **all changes**, not only homepage motion. Engineering authority: KIRCH. The currently accepted visual baseline remains unchanged unless a request explicitly authorizes redesign.

## Permanent two-pass self-review gate

Every implementation PR must include **two documented reviews by the implementer**:

1. **Pass 1 — implementation and targeted tests:** freeze the starting base/head, identify the requested behavioral change, inspect every changed source file, reproduce reported defects before the fix when possible, and run targeted browser tests. Verify generated HTML agrees with its source generator; preserve unrelated pages and approved assets.
2. **Pass 2 — adversarial review of the final diff:** independently reread the resulting change. Test forward/reverse scroll, intermediate animation frames, direct selection, keyboard, mobile, short-height, reduced-motion and JavaScript-disabled cases when relevant. Check screenshots, console errors, DOM churn, contrast/overlap, and file/hash integrity. Re-run existing regressions. Publish what passed, failed, timed out, or was unavailable.

The PR must contain these machine-checked, literal fields, in addition to a narrative and the linked evidence:

```text
SELF-REVIEW: PASS
QA EVIDENCE: <test output / artifact links / exact commit>
OPEN ISSUES: <remaining issues and explicitly unverified checks, or None>
OWNER ACCEPTANCE: PENDING
```

A PR with `SELF-REVIEW: FIX_REQUIRED` must not be merged. **A self-review is never independent review or owner acceptance.** Review evidence should name the exact SHA.

## CI gate

`.github/workflows/site-self-review.yml` automatically checks the PR evidence fields, generated-page parity, syntax, and current Chromium regression suites. CI failures are blocking engineering findings. Configure repository rules to **require the `self-review-and-qa` status check** before merge; without a branch protection rule CI does not itself prevent a privileged person from merging.

The local command sequence is:

```bash
python scripts/build.py
node --check assets/js/site.js
node --check assets/js/r3-home.js
python -m compileall -q scripts
python scripts/qa_r3_polish.py
python scripts/qa_r3_m03_stabilization.py
python scripts/qa_r3_process_centered.py
python scripts/qa_r3_process.py
python scripts/qa_r3_separator.py
```

The existing browser test harness inlines actual HTML/CSS/JS/WebP because its sandbox blocks browser access to localhost. This **does not replace real-host Windows Chrome testing**. Test Firefox/WebKit, actual host, GPU performance, WCAG and accessibility separately where required; do not silently call unavailable tests PASS.

## Promotion and hosting

Branch from `main`, work on a focused PR, and keep owner-approved versions reversible. Do not merge without explicit owner acceptance and appropriate independent review. **localhost is the development preview, Vercel the preview host, Hostinger the planned production host. No Netlify deployment.** Production release is separately authorized.
