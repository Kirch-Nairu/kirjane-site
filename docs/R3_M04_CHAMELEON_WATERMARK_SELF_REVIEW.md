# Kirjane R3 M04 — Original chameleon watermark / two-pass self-review

**Repository:** `Kirch-Nairu/kirjane-site` · draft PR #8
**Frozen predecessor:** `003394003353240e0f5ff7248d4adf9fdee6960d`
**Change:** gallery watermark only. This is **not** a merge or deployment authorization.

## Approved source and strict boundary

- User-provided Kirjane Google Drive folder: `https://drive.google.com/drive/folders/1MPk6gcfmlueUPvEs7tPHBmkLuPulYeaL`.
- Selected source: `Logo-green.JPG`; stored unchanged as `assets/brand/kirjane-logo-green-original.jpg`.
- **SHA-256:** `66d782ac8fb372d61bc8f74abb76821254ea5adf4d2c6926f0424fcb04ac666a`; **dimensions:** 2048 × 2062 pixels; **size:** 183,503 bytes.
- Wordmark beneath the emblem remains in the original source, but is hidden through a CSS clip. Do not modify the original logo's pixels or redraw the brand identity.
- Chameleon is purely decorative: `aria-hidden=true`, empty `alt`, non-focusable and `pointer-events:none`.
- Preserve both W01/W02 assets, the asymmetric layout, the gallery's disclosure controls, the Process/Services/hero code, the original 5 inner pages and the global CSS/JS.

## Pass 1 — visual, layout and behavior

- Added a static `<img>` inside an absolutely positioned clipping region below the project's `.shell` content layer.
- CSS `z-index:0` watermark vs `z-index:1` content, stable with no pinning or motion.
- Used the previously reviewed green JPG watermark treatment: `opacity:.16` desktop, `.105` tablet, `.052` mobile. No SVG overlays, particles, new illustrations or JS animation.
- Desktop and 390px mobile full-section screenshots show the brand shape appearing in off-white negative space without obscuring the gallery images and titles.
- **Self-review defect caught and corrected:** an initial `loading=lazy` image with zero initial height never decoded in the inline browser preview. Changed to `loading=eager` / `fetchpriority=low` for reliable loading. The JPG adds ~180 KB transfer; treat production performance as a separate gate.

## Pass 2 — adversarial source and browser checks

- Added `scripts/qa_r3_chameleon.py` with 9 checks at 320, 390, 768, 1024, 1440, 1920 desktop/mobile, reduced-motion and no-JS. **9/9 local PASS.** Validates original file checksum, image decode, crop, opacity, layer stacking, no overflow, no page errors and intact keyboard access.
- Existing gallery test: `scripts/qa_r3_gallery.py` **11/11 local PASS**.
- Corrected all existing inline-browser QA harnesses through `scripts/qa_inline_assets.py`: previously they inlined only WebP paths, incorrectly reporting this newly referenced JPG as a broken resource. This changes **test fixtures only**, not the website.
- Protected-source comparison: **21 artifacts unchanged** including the 12 original WebP files, five inner routes, 404, global CSS/JS and existing home motion JS.
- Build generation, Python compile and Node syntax pass; generated homepage updated in lockstep with `scripts/build.py`.
- **Local regression caveat:** an older Process stabilization test timed out attempting a click under reduced motion, with the Process detail box intercepting pointer events in this container Chromium. The Process implementation is unchanged in this candidate. Do not call this broader local run green; require exact-SHA hosted CI and real Windows Chrome inspection. Earlier predecessor GitHub CI had passed at 83/83.
- New dedicated test is included in `.github/workflows/site-self-review.yml`, along with existing regression suites and the browser evidence upload list.

## Release status

`LOCAL_BRAND_AND_GALLERY_PASS` / `HOSTED_CI_PENDING` / `OWNER_LOCALHOST_REVIEW_PENDING`.

Do not merge PR #8 or deploy to Vercel/Hostinger. Independent review, actual Windows Chrome, color contrast, network and performance are not established by the inline Chromium harness.
