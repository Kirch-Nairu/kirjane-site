# Living Topography canonical integration

## Inputs and authority

Accepted Brand Ignition R2: `964582e7e745970eb2f73a1dde2aa77d75fe31a6`. Production Hardening R1 input archive SHA-256: `651421e356d9cebab63c70697d6e5a27390eb5f6c1f5c3bf82bb01f0abca368c`. The change manifest's 29 entries and baseline hashes reconciled; no unlisted baseline changes. All 252 cinematic sequence frames were compared byte-for-byte and preserved. The hardening archive's historical static evidence was not counted as fresh browser verification.

Branch starts from canonical main `68afa0406871eecd7e26094fe81e204db0a91ab6`. Earlier R3 [Draft PR #8](https://github.com/Kirch-Nairu/kirjane-site/pull/8) is a separate proposal and remains untouched. The accepted seven-page Living Topography implementation and authorized hardening supersede the R2 visual source on this branch; no unrelated PR #8 commits are merged.

## Architecture and safeguards

Authoritative static runtime: `site/`. New `scripts/build.py` prepares `dist/public/` and supports existing directory routes plus direct .html compatibility. The old generator is isolated to `legacy/r2/` to prevent source regeneration collisions. Previous README facts and QA remain available through Git history; old runtime sources are explicitly archived, not silently mixed into the current build. No runtime framework or backend was added. Directory aliases qualify local fragment links before applying their base URL so Skip-to-content and chapter links remain on the correct page. Social card tags are deduplicated. The existing inline R2 browser harness is explicitly marked historical and retargeted to legacy source.

Official production origin: https://kirjane.tech. Build emits all seven directory canonical URLs, Open Graph URLs/images, Twitter image cards, sitemap and production robots. Vercel is preview-only; its build always generates HTML noindex and disallow-all robots, and its response headers also enforce X-Robots-Tag noindex. Preview URLs are never canonical. Hostinger production is a separate authorized operation. The checked-in .htaccess output disables directory listings, sets 404 and safe revalidation headers. Live host MIME, HTTPS, compression and CSP require real deployment validation later. No DNS or deployment is performed by CI.

## Public custody inspection

New files include distributable runtime assets, source, portable tests, licenses, sanitized aggregate evidence and documentation. Excluded: raw archive, workstation paths, account/server inventory, SSH keys, private context including Salryn planning notes, internal research, agent instructions, source masters, review recordings and raw traces. Existing historical public files are preserved as history/legacy. License notices remain intact.

## Verification and limitations

See `docs/verification/results.json` for fresh Windows source and production-build results. Paired profiling used the same Chromium, GPU options, viewport, native scrolling itinerary and local HTTP server. It measures a 24-second Home pass and 48-second Salryn pass per variant; frame gaps, long tasks, transfers, decoded pixel estimates, heap/DOM observations, repeated navigation and explicit bitmap disposal were collected. Decoded estimates do not measure total GPU/browser allocation. One paired local run does not establish field Core Web Vitals or guarantee speed on every device.

The exact candidate SHA and final executed commands are published in the Draft PR and CI artifact. Browser screenshots and full private traces are retained in the local lab; sanitized aggregate metrics are public. Physical Safari/iOS, screen-reader speech and live host behavior remain unverified. Contact remains local copy/download, and Salryn families remain potential configurations rather than a verified release catalog.

No merge, force push, direct main push, production deployment or PR #8 closure is authorized by this integration.

## Correction register

Independent read-only review found and corrected two integration defects: directory-base fragment links targeting Home, and duplicate Twitter card declarations. New served-browser assertions exercise Skip links on every route, fragment resolution and one authoritative social card. A folder of unreferenced QA screenshot renders was also removed from the public source set. One initial build-test attempt overlapped a second browser suite and reached the normal ten-second fail-safe; serial execution is used for final results. The paired profile was repeated alone after identifying that contention. A software-rendered production-test run also reached the fail-safe; the final Windows browser run explicitly selects the same D3D11 backend as paired profiling. That constrained-renderer timeout still restored all page content and is not counted as complete cinematic playback. Upstream vendor formatting is preserved byte-for-byte with a scoped Git whitespace attribute; project-authored changes still pass whitespace checks.

## GitHub independent review correction

The remote independent reviewer found that opening the mobile drawer during assembly was followed by a second restoration of the entry inert state at film completion. Actual Windows browser reproduction observed drawer inert=false while open, then inert=true while still aria-hidden=false. The assembly handoff now clears the saved inert-state map after restoring it, so subsequent interaction remains authoritative. A served-build regression opens the drawer during assembly, waits for completion, checks it remains interactive, and activates Close. No visual timing or asset change was made.
