# KIRION Creative Forge — Motion Arsenal R1

Mission: KIRJANE-ADVANCED-MOTION-INTEGRATION-R1
State: EXPERIMENT / NOT APPROVED FOR INTEGRATION OR DEPLOYMENT
Repository: Kirch-Nairu/kirjane-site
Baseline: PR #9 feat/living-topography-production-r1 at 4c59ba9fd9e65354fa0820725589e594cba08d29
Branch: experiment/creative-forge-motion-arsenal-r1

## Source custody

The supplied ZIP contains MOTION-ARSENAL.md, MOTION-MANIFEST.json and three JPG storyboards. It does NOT contain the original two MP4 files, complete CGI/GFX/VFX master asset libraries, or executable vendor library implementations. The three storyboards were inspected as reference, not committed or treated as licensed website art. ZIP SHA-256: ce8e227ccf17bbd0a724316aa75ddec5e8c904f67459b7e3c4d62dd1e2d1ff3b.

The source is the accepted seven-page static Living Topography candidate. Existing graphics, logo assets, semantic HTML, URLs, page content and built-in scroll directors remain authoritative. No new React SPA, remote vendor script, WebGL context, or additional framework was introduced.

## Exact experiment access

- The seven pages receive only a small opt-in module loader. Normal visits do not activate the studies.
- Add ?creative=1 to the address of an existing page to test its scoped visual treatment.
- Open /motion-lab/ for all ten self-contained reference studies, with noindex metadata.
- Use ?reduce=1 to force reduced-motion behavior; OS motion preferences are also respected.
- The standalone review lab is never promoted as a replacement for the existing site.

## Ten effect prototypes

| ID | Reference | Lab treatment | Page experiment | Release condition |
| --- | --- | --- | --- | --- |
| 01 | Layered parallax | Existing hero art at different depths | Home | Verify cinema and hero do not fight |
| 02 | Pinned heading | Desktop-only editorial pin | Process uses map-depth instead | Page pin withheld pending stage director collision tests |
| 03 | 3D card zoom | Perspective guided cutaway | Salryn existing anatomy plate | No new renderer; existing art is a 2.5D proxy |
| 04 | Line reveal | Accessible semantic text line motion | About paragraphs | Screen-reader and clipping review |
| 05 | Sideways text | One decorative editorial interlude | Lab-only | Not for essential navigation or information |
| 06 | Card arc carousel | Bounded arc, previous/next, keyboard | Lab-only | Keep Project list as canonical alternative |
| 07 | Fixed 3D model | Existing CGI plate in spatial composition | Existing Salryn 3D sequence retained | R3F not yet adopted |
| 08 | Stacking cards | Four meaningful workflow responsibilities | Services image depth only | Prevent stacked-card repetition |
| 09 | Focus-frame slider | Image inspection with buttons, keys, touch | Project gallery spatial entry | Functional and a11y testing |
| 10 | Scroll-triggered demo | Guided conceptual workflow plus replay | Salryn original director retained | Manual override, state-restoration QA |

All ten referenced motion techniques have experiment studies. These do NOT imply completed production integration of all seven third-party libraries. The lab does not claim 2.5D imagery is a full R3F interactive 3D mesh, nor does it claim an illustrative workflow is a live Salryn transaction.

## Page treatments

Home uses approved sculptural planes and restrained spatial parallax. Salryn augments the approved layered architecture without another GPU context. Services presents controlled workflow depth. Projects preserves its original concept exhibition while the lab evaluates focus and arc inspection. Process keeps five-stage manual selection intact and avoids conflicting pins. About uses optical paragraph reveals without replacing real text. Contact uses brief entrance movement and leaves the form fully functional.

## Motion ownership and lifecycle

GSAP/ScrollTrigger are imported from the existing locally vendored website modules, not a CDN. GSAP owns timelines and triggers for this experiment. One GSAP context scopes the study work and is reverted on pagehide; experiment event listeners are removed. No second smooth-scroll controller is installed and no changes are made to the accepted global GSAP ticker. The existing cinematic opening and Salryn director remain authoritative.

Lenis is deliberately withheld pending a matched native-scroll A/B test and collision investigation. If approved later, use exactly one Lenis instance, connect its scroll callback to ScrollTrigger.update, drive Lenis RAF from the existing GSAP ticker, and disable Lenis autoRaf. Never combine Lenis with ScrollSmoother.

React Bits is MIT plus Commons Clause, not simple MIT. React islands are not justified for basic CSS/GSAP motion. R3F, ShaderGradient, Liquid Glass JS and Liquid Logo each remain separate optional material experiments; no asset or vendor implementation was imported without confirmed rights and measured budget. Any future 3D island must have explicit pause, context teardown and fallback behavior. Brand geometry cannot be displaced or replaced.

## Reproduce (Windows PowerShell)

    git fetch origin experiment/creative-forge-motion-arsenal-r1
    git switch --create creative-motion-r1 --track origin/experiment/creative-forge-motion-arsenal-r1
    npm ci
    npx playwright install chromium
    python scripts/build.py --preview --output dist/motion-qa
    node scripts/qa_motion_r1.mjs

Use a fresh output directory if dist/motion-qa already exists and set MOTION_DIST to match. This is an immutable noindex preview build; no hosting or production action is performed. Raw local evidence belongs under dist/motion-evidence, not in source control.

## Evidence and acceptance

The R1 Playwright runner is authored to capture desktop/mobile PNG, WebM video, keyboard/manual controls, seven baseline and opt-in routes, OS reduced motion, runtime exceptions, axe checks, frame-time p95/p99, JS heap sample and resource bytes. A branch-only GitHub Action runs the no-deploy harness and uploads artifacts for review.

These are *test definitions*, not passing results. No final R1 browser results, videos, exact GPU-context count, field Core Web Vitals, Windows D3D11 traces, physical Safari/iOS QA or independent review have been validated in this handoff. The test's canvas count is only an upper bound and must not be presented as actual WebGL-context measurements.

Before any promotion: run 280, 320, 390, 768, 1024, 1440, 1920 and landscape; repeat the accepted cinematic/interruption tests; check aria and screen reader reading order, reduced motion, keyboard and touch; inspect long tasks, active GPU contexts, JS heap growth and memory cleanup; compare matched baseline/candidate hardware video; check rights and attribution; require independent exact-SHA approval. No baseline-relative acceptance threshold can be claimed without new direct evidence.

## Correction register

| Finding | State | Action |
| --- | --- | --- |
| C-01 Study-owned trigger scope initially incomplete | Corrected in code; browser verification pending | GSAP context/revert now owns study tweens/triggers |
| C-02 Initial cleanup approach touched global ticker | Corrected in code; browser verification pending | Removed global ticker sleep/wake |
| C-03 Forced reduce query initially ignored by lab | Corrected in code; test pending | Unified OS and query preference |
| C-04 Process pin may interfere with manual stage director | HOLD | Lab-only; page retains approved interaction |
| C-05 R3F/shader GPU budget unmeasured | HOLD | Existing approved CGI proxy only |
| C-06 Liquid Logo and local asset provenance incomplete | HOLD | No imported vendor code or unknown asset |
| C-07 Footage and independent reviewer evidence not verified | HOLD | Obtain CI artifact and independent exact-SHA review |
| C-08 Headless profile is not hardware performance evidence | HOLD | Independent same-host baseline/candidate capture required |

## Change custody

PR #9 is canonical integration and remains untouched, draft, and unmerged. PR #8 remains separate. No forced updates, merges, live publishing, DNS, or canonical source rewriting are authorized by this experiment. A new draft PR is a review container only, not approval to release.
