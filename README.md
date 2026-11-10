# Kirjane IT Solutions — Corporate Website

Website implementation for the public-facing name **Kirjane IT Solutions**, originating from the approved Kirjane Labs Website Blueprint V1.0 (31 October 2026). The owner changed the **website display name** on 10 November 2026; this is not confirmation of a legal-entity name change.

**Status:** implementation candidate, not released. Do not enable production publishing without authorized company sign-off.

## Branding

The public site displays **Kirjane IT Solutions** in navigation, page titles, footer and copy. The uploaded logo artwork reads *Kirjane Information Technology Services* and must be supplied in an approved final export matching the new web display name before publication. Do not treat generated mockup artwork as an authorized final logo.

## Ownership

- **Kurt / @k3nchinxd:** sole website developer and designer, responsible for **frontend, backend/API work when needed, Netlify Forms, testing, deployment preparation, and maintenance**.
- **Kirch Ivan:** **not assigned** to this website's implementation; any future contributions require a separate explicit decision.
- **Company:** retains control of final published brand facts, domain, client inquiries, and release authorization.

This supersedes older role allocations in the approved blueprint; see `docs/OWNERSHIP_UPDATE_2026-11-09.md`.

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

GitHub Actions previously passed typecheck, lint, static build and six-route artifact checks on commit `a3bf3d4a7dc09f00101d4a5bb9da348b79b3cc9a`; subsequent changes require fresh verification. Commit a generated `package-lock.json` before making `npm ci` a required check.

## Public routes

`/` · `/services` · `/projects` · `/about` · `/process` · `/contact`

The approved homepage sections are Hero, Services, Projects, Process, About, Contact, Footer. The approved hero is **THE WORK. COMES FIRST.**

## Remaining publication dependencies

Original vector logo/official HEX tokens; confirmed services; permitted case-study visuals; approved team description; company inbox/privacy notice; domain and company-owned access; release authority. All are flagged as placeholders in code where appropriate.

**Contact:** The approved contact-field UI is implemented as a disabled preview. Netlify Forms registration is scaffolded, but submissions are **not live** until the company inbox, privacy notice and handling policy are approved and delivery is tested. No fabricated portfolio results.

## Release discipline

Feature branch → PR → preview + evidence → reviewed merge → company-authorized manual Netlify production publish. Never deploy or merge automatically on behalf of the company.

## Architecture

- `app/routes`: one module per approved public path.
- `app/components`: header, footer and reusable UI components.
- `app/styles/app.css`: Tailwind and centralized **working, not verified** palette tokens.
- `app/components/ContactInquiryForm.tsx`: accessible disabled inquiry-form UI with approved fields.
- `public/__forms.html`: static Netlify Forms registration blueprint (not activated).
- `scripts/verify-prerender.mjs`: checks six generated HTML routes.

See `docs/IMPLEMENTATION_NOTES.md` for the initial review packet.
