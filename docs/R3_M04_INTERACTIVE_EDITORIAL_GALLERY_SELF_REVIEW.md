# Kirjane R3 M04 — Interactive Editorial Reveal Gallery / two-pass self-review

**Repository:** `Kirch-Nairu/kirjane-site` · existing draft PR #8
**Frozen starting candidate:** `861d8bb11709be01d3412ba8a60ce637ff1d159c`
**Scope:** Homepage Chapter 04 / Projects only; existing W01/W02 assets
**Release gate:** No merge or Vercel/Hostinger deployment; owner localhost visual review pending.

## Pass 1 — implementation and focused checks

- Replaced two equally sized Projects cards with two **asymmetric, alternating, oversized editorial artworks**. Preserved the existing off-white Kirjane palette, headline, two approved conceptual WebP illustrations, and the link to `/projects/`.
- Added semantic native `<details>/<summary>` explanations: Connected Operations (intake, handoff, status) and Decisions Made Visible (review, ownership, next step). No fictitious customer accounts, screenshots or measured outcomes.
- Added an IntersectionObserver one-time rectangular image-mask reveal, only when supported and motion is allowed. No scroll pinning, custom scroll engine, new artwork, SVG overlay, external library or dependency.
- Opening a perspective keeps its composition subtly magnified and visually recedes the other; opening the other closes the first. The disclosure remains fully functional without JavaScript, using the browser's native `details` behavior.
- Mobile is a stacked gallery without clipping, with visible titles and accessible controls. Reduced-motion users see the full illustrations with no entrance animation.
- Added `scripts/qa_r3_gallery.py`, JSON results, and CI invocation/artifact upload to the existing `site-self-review.yml` workflow.

## Pass 2 — adversarial self-review (final sources)

- The first test iteration incorrectly required below-the-fold `loading=lazy` images to be loaded before scrolling. Corrected the test to wait for image decoding after entering view. This was a QA assumption, not a production defect.
- The first tablet test assumed equal widths at 768px, contradicting the deliberately slight 94%/90% stagger. Updated the width tolerance; no layout overflow occurred.
- Reviewed all two source treatments: W01 is left aligned and wider than W02; image titles and number indicators remain inside image bounds at 320, 390, 768, 1024, 1440 and 1920 pixels.
- Validated native Enter and Space activation, single-expanded-panel behavior with JS, both independently expandable without JS, closing the active selection, and image asset loading at the actual scrolled position.
- Verified no new uncaught Chromium page exceptions or horizontal overflow. No JavaScript / reduced-motion test cases preserve all meaningful explanatory text and visible imagery.
- Compared **21 protected artifacts** byte-for-byte against the frozen source folder: 12 approved WebPs, five inner route pages, 404 page, global CSS/JS, and `CONTRIBUTING.md` are identical.
- Regenerated all pages; verified Python compile and Node syntax pass. JS changes are appended after the existing Process controller without modifying its stage-state functions.

## QA evidence

- **M04 gallery**: 11 / 11 focused Chromium inlined-source configurations PASS, including mobile, large desktop, reduced-motion, and no-JS.
- **Existing Process/Services suites**: prior green baseline 72/72 on predecessor SHA; full hosted rerun for this new exact candidate is mandatory. A combined local re-run hit an execution time limit after the new gallery suite passed; it is not represented as a complete regression pass.
- Screenshots: `qa/r3-gallery/gallery-1440-full.png`, `gallery-390-full.png`, individual W01 and W02 screenshots.
- Test harness uses real generated HTML/CSS/JS/WebP **inlined into Chromium**. It cannot verify a remote or actual Windows localhost host. Real-host browser, Firefox/WebKit, color contrast audits, image performance, and human visual acceptance remain separate gates.

## Final self-review verdict

`SELF_REVIEW_PASS_OWNER_QA_PENDING` for the bounded M04 local prototype; **do not integrate** until exact-SHA hosted CI, owner localhost visual acceptance, and independent review succeed.
