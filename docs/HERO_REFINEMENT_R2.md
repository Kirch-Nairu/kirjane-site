# Hero refinement R2 — screenshot review

## Reference
Owner-provided Firefox desktop screenshot, 1366×768, homepage at `http://localhost:5175/` (10 November 2026).

## Observed
- Hero typography is legible and visually bold, but its split lacks the diagonal/editorial accent proposed in Blueprint V1.0.
- Header and dark-green CTA are already coherent; official logo remains pending.
- The CTA row sits visually below the primary paragraph; alignment can be tightened.
- The wide white canvas works; adding extensive graphics would undermine minimalism.

## Changes
- Separate second-line wordmark spans for more deliberate asymmetric layout.
- Restrained angled lime underline under "FIRST." and small decorative mark.
- Short rule before the eyebrow to add typographic hierarchy.
- Improved vertical rhythm between headline, body and CTA.
- Explicit responsive rules for 390px and 320px, reduced motion preserved.
- CTA and scroll-link focus behavior preserved, all copy unchanged.

## QA gates
CI must pass TypeScript, ESLint, React Router build and all six static HTML routes.
Still requires manual screenshots of 1366/1440px desktop and 390/320px mobile; especially ensure no overflow at 320px.
Review mobile menu behavior, accessibility and real company logo/palette before any approval.
No merge/deployment. Contact form still disabled.
