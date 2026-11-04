# R2 editorial website candidate — review ledger

## Scope delivered
- Founder-first editorial About composition with balanced portrait/text grid; correct supplied leadership roles and compact career information.
- Existing photograph is **unchanged** and capped at its native 400-pixel width. It remains low quality. High-resolution image replacement is explicitly deferred, per user instruction.
- Progressive reveal motion introduced without extra library: default fully visible SSR/prerender HTML, only offscreen content transitions after hydration; reduced-motion preference disables effects.
- Homepage: responsive hero type, fourth service aligned with Services page, bespoke system-flow feature rather than fabricated case studies, staged reveals and improved section rhythm.
- Services: long-form numbered capability rows instead of generic cards.
- Projects: evidence-led editorial placeholder; no fabricated projects, customer claims or outcomes.
- Process: five visually numbered delivery stages and useful explanatory copy.
- Contact: explanatory intake guidance and honest “website inquiries coming soon” state. **No working contact backend or form.**
- Navigation: mobile menu closes on Escape and restores keyboard focus, route transitions close it automatically.
- No new runtime dependencies, production changes, DNS or VPS access.

## Acceptance
Automated checks: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run verify:build` on GitHub Actions; record final workflow link and SHA in PR.

Manual/browser gates still required:
- Desktop 1280/1440px, tablet 768px, phones 320/375/390px; check no horizontal overflow or clipped headings.
- Verify link focus visibility and nav Escape behavior with keyboard and screen reader.
- Inspect transitions after entering/exiting routes and with reduced motion enabled.
- Image sharpness **not accepted** until original 1122×1402 PNG is provided and responsive exports replace the existing 400×500 thumbnail.
- Official logo, exact brand HEX, company bio/service/case-study copy, contact data handling and VPS production release remain separately gated.
- No claim of Lighthouse, real-device usability or WCAG completion without measured evidence.

## Design governance
Kurt's previously approved design authorship remains unchanged. These are technical/design candidates for review, not unilateral final design approval or launch.
