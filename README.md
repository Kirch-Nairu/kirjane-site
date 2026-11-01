# Kirjane Labs — Corporate Website

Kirjane Labs' first official corporate website, implementing the planning-approved **Website Blueprint V1.0 (31 October 2026)**.

**Status:** implementation candidate, not released. Do not enable production publishing without authorized company sign-off.

## Ownership

- **Kurt / @k3nchinxd:** sole frontend designer and implementer; UI/UX, accessible responsive React components, tests, frontend integration.
- **Kirch Ivan:** separate backend/API contributions when business requirements require them.
- **Company:** owns final published brand facts, domain, client inquiries, and release approval.

## Approved stack

React 19 + Vite + TypeScript + Tailwind CSS 4 + React Router Framework Mode. All six approved routes are pre-rendered at build time and served as static files by Netlify.

## Development

Requires Node.js **22.22+**.

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run verify:routes
```

Commit the generated `package-lock.json` before making CI a protected required check. No GitHub Actions or local build results are claimed until actually run.

## Public routes

`/` · `/services` · `/projects` · `/about` · `/process` · `/contact`

The approved homepage sections are Hero, Services, Projects, Process, About, Contact, Footer. The approved hero is **THE WORK. COMES FIRST.**

## Remaining publication dependencies

Original vector logo/official HEX tokens; confirmed services; permitted case-study visuals; approved team description; company inbox/privacy notice; domain and company-owned access; release authority. All are flagged as placeholders in code where appropriate.

**Contact:** Netlify Forms integration is scaffolded but visibly disabled until an approved company inbox and privacy notice exist. The form is not claimed functional. No fabricated portfolio results.

## Release discipline

Feature branch → PR → preview + evidence → reviewed merge → company-authorized manual Netlify production publish. Never deploy or merge automatically on behalf of the company.

## Architecture

- `app/routes`: one module per approved public path.
- `app/components`: header, footer and reusable UI components.
- `app/styles/app.css`: Tailwind and centralized **working, not verified** palette tokens.
- `public/__forms.html`: static Netlify Forms registration blueprint (not activated).
- `scripts/verify-prerender.mjs`: checks six generated HTML routes.

See `docs/IMPLEMENTATION_NOTES.md` for the initial review packet.
