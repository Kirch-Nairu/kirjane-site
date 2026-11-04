# Kirjane Labs — Corporate Website

**THE WORK. COMES FIRST.**

Review-stage corporate website implementation for **kirjane.tech**.

## Status
- Candidate for M02 frontend foundation and M03 homepage. Not merged or deployed.
- Visual direction follows the approved 31 October 2026 Kirjane Labs Corporate Website Blueprint V1.0.
- Company-owned VPS and kirjane.tech supersede the blueprint's Netlify hosting assumptions.
- Official assets, portfolio evidence, company information and contact API remain release-gated.

## Stack
React 19 · React Router Framework Mode · Vite · TypeScript · Tailwind CSS 4.
All six URLs are static pre-rendered in `build/client` for the Kirjane-owned VPS.

## Local development

```bash
npm ci
npm run dev
npm run check
```

Dependency versions are recorded in `package-lock.json` and CI uses `npm ci`. The preview loads the selected Inter and Space Grotesk typefaces from Google Fonts; self-hosting can be reviewed for production privacy and latency.

## Architecture
- `app/routes/`: Home, Services, Projects, About, Process, Contact
- `app/components/`: shared navigation and editorial primitives
- `app/app.css`: responsive styles and temporary brand tokens
- `scripts/verify-build.mjs`: six pre-rendered HTML route checks
- `infra/nginx/`: illustrative static-host configuration, not applied to VPS

Build serves static HTML, not a runtime React server. Do not configure a blanket SPA fallback: missing paths must return 404.

## Hosting and safety
The Kirjane-owned VPS and `kirjane.tech` are the intended deployment environment. This repository does not contain credentials, DNS changes, production deployment secrets, a contact backend, or an automatic release-to-production workflow. Production deployment requires explicit company approval.

See [content and release gates](docs/CONTENT-RELEASE-GATES.md).
