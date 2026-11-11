# KIRJANE CONTENT ARCHITECTURE R1 — VERIFIED SOURCE OF TRUTH

## 1. Site Objectives & Audience
An authoritative, accessible corporate presentation for business owners, institutional partners, LGU decision-makers, and prospective clients in **Bohol, Philippines** and beyond. Every page answers a clear business question without internal technical theater or unverified claims:

| Route | Primary Question Answered | Source Content Modules |
| :--- | :--- | :--- |
| `/` | What does Kirjane Labs build, who is behind it, and why should we partner with them? | `company.ts`, `services.ts`, `products.ts`, `projects.ts`, `team.ts` |
| `/services` | What engineering, security, cloud, and web hosting capabilities can Kirjane deliver? | `services.ts`, `company.ts` |
| `/projects` | What software platforms and institutional systems illustrate Kirjane's work? | `projects.ts`, `products.ts` |
| `/about` | Who are the founders, engineers, accountants, and specialists behind Kirjane Labs? | `company.ts`, `team.ts` |
| `/process` | How does an engagement progress from workflow discovery to launch and hosting? | `projects.ts` (`processSteps`), `company.ts` |
| `/contact` | How can we reach the Kirjane Labs team directly to start a conversation? | `company.ts` |

## 2. Gate G6 Source-of-Truth & Evidence Discipline Audit

| Audit Item | Previous Defect (`c2725cc`) | Verified Resolution |
| :--- | :--- | :--- |
| **Company Identity & Hero Copy (`app/content/company.ts`)** | `app/routes/home.tsx` had competing hardcoded hero copy, and `company.ts` included an unverified generic `facebookUrl: "https://facebook.com"`. | Consolidated all hero copy, spec ledger items, and contact metadata into `app/content/company.ts`. Removed `facebookUrl: "https://facebook.com"` so no broken/generic external link is rendered. |
| **7-Person Team Roster (`app/content/team.ts`)** | Contained 7 unverified first-person `quote` fields and a `24/7` claim in Kurt's summary. | Removed the `quote` field entirely from `TeamMember` and `TeamScrollShowcase.tsx`. Replaced with factual `focusHighlight` / `deliverables` describing each member's verified role: **01 Kirch** (Founder, CTO & Head of Engineering · Kirjane Labs Tech Lead), **02 Paul** (Co-Founder & CEO · Accountant), **03 James Karl** (Co-Founder & Business Lead · Accountant), **04 Siris** (Co-Founder & Developer Operations Lead), **05 Kurt** (CI/CD & DevOps Engineer), **06 Jesse** (Social Media Manager), and **07 Ace** (Market Research Specialist). |
| **Unsupported Operational Claims (`ProcessStoryScroll.tsx`, `home.tsx`, `process.tsx`)** | Claimed `"Live Deployment & 24/7 Care"`, `"Daily Encrypted Backups"`, `"100% Verified"`, `"100% Traceable"`, and `"24/7 server monitoring"`. | Removed all unsupported numeric/SLA/backup guarantees across `app/components/ProcessStoryScroll.tsx`, `app/routes/home.tsx`, `app/routes/process.tsx`, and `app/content/*`. Replaced with accurate engineering process deliverables (`Production Release & Managed Hosting`, `Scheduled Backup Workflows`, `Scenario & Balance Verification`). |
| **Salryn Interactive Simulator (`SalrynInteractiveSimulator.tsx`)** | Could be mistaken for a live connected backend checkout. | Explicitly badged as **`Interactive Product Demo · Client-Side Simulation`** with a clear explanatory note that quantities, receipts, and double-entry ledger entries run locally in the browser to demonstrate Salryn's workflow. |
| **Scoryn & Talibon Intra-Office (`products.ts`, `projects.ts`)** | Needed concise, verifiable descriptions of featured events and institutional scope. | Accurately presents **Scoryn** automated tabulation featured in **Miss Poblacion Occidental (Miss Pob Oc)**, **Mister Valencia**, and **Miss Lila**, and the **Talibon Intra-Office System** built for inter-departmental document routing and workflow tracking. |
| **Confidentiality** | Reference workflow repos (`KirionForge`, `KIRION-FORGE`, `Operation-FORGE.kirion`) must never appear on public pages. | Verified zero public occurrences across all rendered routes and content modules. |
