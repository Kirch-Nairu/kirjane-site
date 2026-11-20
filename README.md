# Kirjane — Living Topography

Canonical source custody for the accepted seven-page website and verified production hardening. Official origin: https://kirjane.tech. This branch is review preparation, not deployment authority.

## Build and local verification

Runtime source is `site/`. Run `python scripts/build.py`, then `python -m http.server 4173 --directory dist/public --bind 127.0.0.1` and open http://127.0.0.1:4173/. Requires Python 3.9+; no frontend runtime package installation is needed. Each build requires a fresh output directory; use `--output dist/new-name` for repeat builds. Browser tests require Node 22+, `npm ci`, and `npx playwright install chromium`; run `npm test`.

Routes: `/`, `/salryn/`, `/services/`, `/projects/`, `/process/`, `/about/`, `/contact/`. Previous directory routes remain usable. Direct `.html` routes remain compatible but canonicalize to directory URLs. The complete runtime is copied locally; there are no CDN dependencies. Contact briefs remain local copy/download interactions and do not submit data to a server.

## Custody and hosting safeguards

Work on a branch, use a Draft PR, publish exact-SHA evidence, and obtain independent review. Never push directly to main, force-push, merge or deploy as part of testing. Localhost is for development; Vercel is staging/preview only; Hostinger is production only after separate authorization. Vercel configuration always applies noindex response headers, noindex HTML and disallow-all robots. `python scripts/build.py --preview` reproduces this locally. Production canonical/social URLs point to the confirmed official origin, including during preview.

The earlier R2 root files and generator are preserved under `legacy/r2/` and `scripts/build_luminous_r2.py`; they are excluded from public build output. The generator is isolated to that legacy directory. Existing historical docs/QA remain historical. Draft PR #8 is the separate earlier R3 proposal and is not merged or closed by this integration.

See `docs/PRODUCTION_INTEGRATION.md`, `docs/THIRD_PARTY_NOTICES.md`, and `CONTRIBUTING.md`. No DNS, hosting or production deployment is performed by this build or CI.
