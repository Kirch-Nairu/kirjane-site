# Kirjane website — content and release gates

This implementation is a **review candidate**, not a production website.

## Confirm before publishing
- [ ] Original Kirjane Labs logo (vector/high-resolution), approved variations, and exact HEX values
- [ ] Company-approved service categories and organization profile
- [ ] Actual team roles, verified biography content, and approved photography
- [ ] Client consent to show any project names, screenshots, architecture or outcomes
- [ ] Official inquiry inbox, named handler, privacy notice, data-retention policy
- [ ] Contact API on Kirjane-owned VPS with server-side validation, spam protection, rate limiting, delivery and failure tests
- [ ] VPS deployment user and file permissions, DNS, TLS, security headers, monitoring and rollback
- [ ] Explicit production release authorization and recorded release commit SHA

## No-fabrication rules
The conceptual K. motif in the candidate is not the official Kirjane mark and must be replaced after asset approval.
There are no published case studies, customer testimonials, awards, metrics or team portraits without evidence.
Contact does not offer a fake form success state or imply an inbox is already receiving messages.

## QA
- [x] Generate and commit the dependency lockfile; CI configured for npm ci
- [x] Automated typecheck, lint, static build and six-route HTML inspection on the initial candidate (verify again on the final lockfile commit)
- [ ] Visual review at 320, 375, 768, 1280, 1440 widths
- [ ] Keyboard, screen reader, zoom and reduced-motion smoke checks
- [ ] Lighthouse and Core Web Vitals baselines
- [ ] Preview test and controlled VPS smoke test, including real 404
- [ ] Add approved canonical URL, robots rules, sitemap, OG artwork when deployment target is verified

## Ownership
Kurt retains the approved frontend design/implementation ownership; Kirch may provide technical review when assigned.
The candidate is not a claim of final creative approval or a production publication.
