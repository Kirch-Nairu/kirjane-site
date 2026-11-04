# Kirjane Labs — Corporate Website

**THE WORK. COMES FIRST.**

Review-stage corporate website implementation for **kirjane.tech**.

## Status
- Branch candidate for M02 frontend foundation and M03 homepage. Not merged or deployed.
- Visual direction follows the approved 31 October 2026 Kirjane Labs Corporate Website Blueprint V1.0.
- VPS ownership and kirjane.tech domain supersede the blueprint's Netlify hosting assumptions.
- Official assets, portfolio evidence, company information, and contact API remain release-gated.

## Stack
React 19 · React Router Framework Mode · Vite · TypeScript · Tailwind CSS 4.
All six URLs are static pre-rendered in `build/client` for the Kirjane-owned VPS.

## Local development

```bash
npm install
npm run dev
npm run check
```

**Dependency lock pending:** the initial source candidate does not yet contain a verified `package-lock.json`. Commit the generated lockfile and replace CI's `npm install` with `npm ci` before accepting the PR. Until then, dependency resolution is not reproducible.

## Architecture
- `app/routes/`: Home, Services, Projects, About, Process, Contact
- `app/components/`: accessible layout and reusable editorial elements
- `app/app.css`: responsive visual system and temporary palette tokens
- `scripts/verify-build.mjs`: confirms six pre-rendered HTML pages
- `infra/nginx/`: illustrative static-host configuration (not applied to VPS)

Build serves static HTML, not a runtime React server. Do not configure a blanket SPA fallback: missing paths must return 404.

## Hosting and safety
The Kirjane-owned VPS and `kirjane.tech` are the intended environment. This repository does not contain credentials, DNS changes, production deployment secrets, a working contact backend, or automatic release-to-production. Production deployment requires explicit company approval.

See [content and release gates](docs/CONTENT-RELEASE-GATES.md).
