# Visual R3 — mobile hero refinement

## Screenshot evidence
Owner-provided Firefox screenshots of local Visual R2:
- 1366px desktop homepage: spacious and on-direction. No desktop redesign required.
- 320 × 480 responsive viewport: headline appears over-compressed (notably COMES + FIRST), floating lime slash visually disconnected, intro consumes extra vertical space, primary CTA begins just below the viewport.

## Scope
R3 is a **CSS-only mobile refinement**. The homepage headline copy, HTML structure and desktop R2 design remain unchanged.

- Tune hero intro and type spacing below 760px.
- Increase the visual separation between “COMES” and “FIRST.”
- Hide the detached lime slash at 390px and below; retain the underlining accent on FIRST.
- Compress 320px header and hero spacing without reducing tap sizes below 40px.
- Stack full-width primary CTA and a separate text CTA on small phones.
- Preserve text readability and natural scrolling. A 320 × 480 screen is not expected to display the whole hero without scrolling.
- Add `app/styles/mobile-r3.css` as the final stylesheet for easy review/revert.

## Verification and review gates
1. GitHub Actions install, TypeScript, ESLint, six-route static build and contact submission safety checks.
2. Manual Firefox review at 320 × 480 and 390 × 844 (mobile).
3. At 320px: no horizontal scrolling; headline words visibly separated; CTA fully usable after scroll.
4. At 390px: balanced hero and no header collision.
5. Confirm desktop at 1366/1440px unchanged from R2.
6. Check keyboard menu, link focus and reduced-motion behavior.

**Candidate only.** No production release, merge, client-facing fake claims, or contact-form activation. Kurt remains the sole website full-stack developer.
