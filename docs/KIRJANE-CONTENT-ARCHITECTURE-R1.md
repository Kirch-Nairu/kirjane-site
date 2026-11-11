# KIRJANE CONTENT ARCHITECTURE R1 — AUDIT START

## Site objectives
An authoritative company presentation for business owners, corporate partners, LGUs/institutional decision-makers and prospective clients. Provide (1) clear offering, (2) credible products/projects, (3) concise company/team information, (4) clear contact path.

## Existing routes (preserve)
| Route | Primary question answered |
| --- | --- |
| `/` | What does Kirjane build, and why should I engage them? |
| `/services` | What can Kirjane deliver for my business or institution? |
| `/projects` | What actual systems and work illustrate capability? |
| `/about` | Who is Kirjane and who does the work? |
| `/process` | How does a client engagement proceed? |
| `/contact` | How can I begin a genuine inquiry? |

## Products and evidence discipline
- **Salryn:** business management software with variations for different operating environments. Show real product screenshots where permitted. Simulations must say they are demos.
- **Scoryn:** event/pageant scoring and tabulation system; verify event references and exact use claims before publication.
- **Talibon Intra-Office:** municipal/institutional workflow development; do not claim public production status unless evidenced.
- **Engineering services:** bespoke backend, databases, security, DevOps/cloud, websites, hosting. Do not imply audited security certifications, backups or SLAs not supported.

## Source-of-truth cleanup
- `app/content/company.ts` holds branded content including `hero`, `logos`, `pillars`, and generic Facebook URL. `app/routes/home.tsx` has competing hardcoded hero copy. Consolidate editable copy in content module and render from it.
- `app/content/team.ts` currently assigns seven first-person quotes. Remove unless directly authorized with actual source. Roles should reflect verified identities, not guessed professional qualifications.
- `app/components/ProcessStoryScroll.tsx` includes numeric and operations claims without evidence. Remove/reword, verify no equivalent claims remain in pages.
- `app/components/SalrynInteractiveSimulator.tsx` is a client-side interactive demo, not connected to production transaction persistence; its headings/CTAs must not claim otherwise.
- Replace `https://facebook.com` with confirmed Kirjane account URL, or omit the channel until confirmed. Never invent.
- Ensure contact form implementation, delivery endpoint, validation and privacy copy are actually tested; do not imply receiving email unless verified.

## Voice
Short, human, precise, helpful. Prefer names a buyer recognizes (sales, inventory, reporting, workflow) over deep architecture jargon. No boilerplate claims or agent-facing terminology. Keep unapproved facts documented internally rather than showing them as polished marketing truth.

## Ownership
Antigravity finalizes actual copy, status descriptors, asset mapping and source crosswalk with source references; owner reviews any claims requiring business authorization.
