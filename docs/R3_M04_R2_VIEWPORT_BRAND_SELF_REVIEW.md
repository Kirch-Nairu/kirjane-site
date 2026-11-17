# KIRJANE R3 M04 R2 — Responsive Chameleon Brand Treatment / Two-Pass Self-Review

**Repository:** `Kirch-Nairu/kirjane-site`, existing draft PR #8
**Predecessor:** `a9ef8744a985adf51a0115f70d4be73edaa4a4d6`
**Change scope:** Chapter 04 decorative chameleon placement and its QA. No merge, installer, preview deployment, or production deployment.

## Visual brief

Preserve the previously approved asymmetric editorial gallery, W01/W02 images, natural scrolling, and native disclosures. Preserve official `Logo-green.JPG` verbatim: SHA-256 `66d782ac8fb372d61bc8f74abb76821254ea5adf4d2c6926f0424fcb04ac666a`, 2048×2062, 183,503 bytes. No new SVGs, logo redraws, particles, or JS motion.

## Pass 1 — composition and viewport corrections

**F1: Broken identity crop.** Previous CSS clipped at 47% from the bottom, cutting part of the tail/mascot. Cropping now preserves more of the emblem while hiding the wordmark, with restrained CSS edge feathering.

**F2: Viewport anchoring.** Original watermark position relied on viewport width, drifting relative to the max-width gallery on ultrawide displays. It is now anchored inside the gallery shell, behind content. The chameleon is a non-interactive decorative image (`aria-hidden`, empty `alt`, `pointer-events:none`).

**F3: Ultrawide clipping.** The shell-sized decorative wrapper cropped the identity when the layout gained large side gutters. At ≥2200px a smaller, complete mascot moves into the unused left margin and is no longer cropped by that wrapper. The overall Projects section still clips at its outer boundary to avoid horizontal overflow.

**F4: Responsive hierarchy.** Carefully restrained image scale/opacity for phone, tablet, desktop, and ultrawide classes; no logo over the editorial heading or inside either artwork, and no overlapping the selected concept text.

**F5: Ultra-compact overflow.** At 280px, an unrelated homepage footer wordmark overflowed by 25px. A narrowly scoped R3-home-only font override fixes it without editing shared site CSS or inner pages. Normal widths are unchanged.

### Responsive art direction

- 280–680px: 82% of the gallery shell, 11% opacity, placement tied to width to track the end of W01 and the gallery gap.
- 681–850px: up to 630px, 14% opacity, gallery-anchored.
- 851–2199px: up to 780px, 18% opacity, positioned within gallery negative space.
- ≥2200px: 450px signature in the spare left margin, 16% opacity, with full emblem visibility.
- All modes: no new SVG, layout pinning, artificial texture, animation dependency, or changes to gallery JS.

## Pass 2 — adversarial browser/QA

- **26/26 responsive matrix PASS**, with phone widths 280, 320, 360, 390, 430, 600, 680; tablet breakpoints 681, 768, 820, 850, 851; laptop/desktop 960, 1024, 1280, 1366, 1440, 1536, 1920; ultrawide 2560, 3440; short 1440×600; reduced motion at 390/1440; JavaScript disabled at 390/1440.
- Verifies original source SHA, decode dimensions, decorative accessibility, one original image, no SVG, proper shell/layer placement, no document or section overflow, responsive opacity/crop, two unchanged concept images, disclosure target size, native keyboard Enter behavior, no page exceptions, and no pinned/scroll-trapped gallery.
- Previous dedicated watermark suite updated for the new shell stacking and opacity: **9/9 PASS**.
- Existing gallery interaction suite: **11/11 PASS**.
- Static site generator and generated HTML in sync. Python compile and JS syntax checks PASS.
- **21 protected source files unchanged:** 12 approved WebPs, five inner pages, 404, shared CSS and JS. Hash manifest in `qa/r3-chameleon-viewports/protected-shas.json`.
- Browser screenshot matrix includes actual rendered captures at 320/390/680/768/1024/1440/1920/2560, with 26-case JSON report.
- Inlined-source Chromium harness is necessary because the sandbox does not allow headless Chromium to access localhost. Do not misrepresent the result as actual served Windows Chrome.

## Explicit remaining gates

- **GitHub exact-SHA CI after this commit:** must be green, including inherited 92 checks plus the 26 new viewport cases (118 total).
- **Owner Windows localhost visual approval:** pending for the revised placement at phone, tablet, desktop, ultrawide.
- **Independent review, Firefox/WebKit, browser GPU frame timing, and real network conditions:** not verified.
- **No merge to `main`, no Vercel or Hostinger deployment.**

`SELF_REVIEW_PASS_LOCAL` / `HOSTED_CI_PENDING` / `OWNER_QA_PENDING`.
