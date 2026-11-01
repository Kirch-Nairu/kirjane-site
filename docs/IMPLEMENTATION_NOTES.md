# M01–M03 candidate — review notes

Source of truth: **Kirjane Labs Corporate Website Design & Development Blueprint V1.0**, pp. 4–23.

## Delivered in this branch

- React Router Framework Mode with six explicit pre-rendered routes.
- Responsive homepage with approved V1.5 headings and the exact six-section ordering.
- Shared site header, accessible mobile menu, footer and editorial links.
- Supporting route content using approved copy; unconfirmed services and public case studies marked as pending.
- Working temporary color roles and typographic hierarchy.
- Netlify static publish configuration plus form-detection blueprint **not yet activated**.
- Build-time six-route HTML artifact verification script.

## No false claims

- The logo is a temporary typographic brand treatment/monogram until the official vector source is supplied. Do not present it as the official company mark.
- Color values are visually estimated and **not official company HEX codes**.
- Case studies, testimonials and client results are not invented.
- Contact submissions are not enabled until the company provides inbox/privacy/handling approvals.

## Verification required

1. Run `npm install` with Node 22.22+ and commit `package-lock.json`.
2. Run `npm run check`, fix all errors, record command output.
3. Preview at 390px and 1440px; test menu, links, keyboard focus, headline wrapping and overflow.
4. Inspect all six generated HTML pages; verify missing-route 404 behavior on Netlify.
5. Confirm approved logo, color tokens, services, projects and contact details with company.
6. Configure Netlify Deploy Preview and protect controlled production publishing.

**Status:** implementation candidate, NOT verified or merged; no production release.
