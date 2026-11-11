# Kirjane Labs — R2 Complete Visual & Experience Blueprint

**Mission:** KIRJANE-FULL-REBUILD-R2  
**Issue:** https://github.com/Kirch-Nairu/kirjane-site/issues/5  
**Status:** Owner-requested complete redesign. **Blueprint only — not implemented, visually tested, or owner-approved.**  
**Starting code:** main @ `c2725cceed370d7664606a00c894de62198b7894`  
**Counterexample:** R1 QA2 @ `8279547d0e18efc91f8f7b0d1bff6a4f60ef0f4d`; retain it as read-only engineering reference, not design parent.  
**Positive process reference:** Valencia Antigravity R2 @ `d5e121522c557f63ec683cf9aee79309795005b8`.

## A. Thesis: Adaptive Precision

The brand is *Kirjane Labs*; legal name in the current content model is *Kirjane IT Solutions*. It should communicate a technically serious engineering firm whose design is as carefully constructed as its backend systems. The chameleon represents adapting engineered systems to real operational environments.

**The three qualities:** precision (typography/layout), adaptability (purposeful variety of composition/motion), and proof (real product evidence, real people and truthful claims).

**Proposed hero statement:**  
`COMPLEX WORK. / CLEAR SYSTEMS.`

**Plain-language supporting line:**  
`We engineer custom business software, institutional platforms, backend systems, and infrastructure designed around how organizations actually operate.`

**CTA 1:** `Explore Our Work` (to /projects). **CTA 2:** `Start a Project` (to /contact).

Headline is a working creative hypothesis, not a verified brand slogan. Preserve `Adapt. Automate. Evolve.` as the authentic corporate motto elsewhere in site.

### What R2 explicitly rejects
- No centered generic hero + floating dashboard product screenshot + four identical statistic cards.
- No hard-coded fake telemetry, terminal metaphors, fabricated certifications, generic numerical counters, repeated ornamental `01 / 02 / 03` on every section.
- No 61 KB monolithic stylesheet or every route sharing the identical opening `PageIntro`.
- No repeated giant Chameleon watermarks as filler in every section.
- No seven-person sticky scroll marathon, fake illustrated busts, invented quotations or operating guarantees.
- No AI placeholder language or SEO keyword flooding; no fabricated product status and no unverified production readiness.

## B. Brand materials and proposed design tokens

The official logos currently reside in `public/brand`: `chameleon-color.png`, `chameleon-green.png`, `chameleon-white.png`, `official-logo.jpg`, `logo-green.jpg`, `logo-white.jpg`. Verify each file and use only suitable transparent variants for layered artwork.

**Exploration values, not an assertion of official HEX:** primary forest `#10291D`, extended forest `#0A1B14`, institutional green `#246844`, active leaf `#A8CE64`, near-white `#F5F7F1`, white `#FFFFFF`, muted ink `#56665A`. Confirm colors against brand assets and contrast before locking. Contrast never depends on lime over white or small translucent text on dark.

### Typographic language
- **Display:** custom art-directed typography using a licensed geometric grotesk (test `Space Grotesk` and one alternative in browser; choose ONE). Large and purposeful, not all caps everywhere.
- **Body/UI:** `Inter` or equally readable licensed sans, 16–20px as context needs. Paragraph measure approximately 52–64 characters.
- **Monospace:** only for genuine data or identifiers; not a decorating device for generic headlines.
- Desktop hero max type around 112–144px at 1440 width, adaptive with `clamp()`; compact mobile word-wrap explicitly composed at 360px.
- 12-column desktop grid, 4-column mobile grid; consistent spacing 8/12/16/24/32/48/64/96 and container gutters `clamp(20px,5vw,84px)`.
- Crisp borders/hairlines; selectively layered image masks; restrained square-corner controls and no universal pill-shaped box language.

### Ratio and rhythm
Proposed light/dark page rhythm: dark memorable first act; warm nearly-white explanation chapters; dramatic dark selected-work interlude; warm process/team; dark closing invitation. Dark areas emphasize proof and contrast, not atmosphere-only blank space.

Use **one carefully composed primary Chameleon-K expression** in hero, with restrained signature secondary appearances at section transitions. Maintain official logo geometry and recognition.

## C. Homepage — seven deliberate acts

### Act 01: Opening stage (0–100svh, adapted to available screen height)
**Layout:** site navigation overlays a deep forest opening field with a subtle 1px rule; logo / wordmark at left, Work / Services / Process / About at right and `Start a Project` action. Huge two-line editorial title occupies the left 7–8 grid columns. A physically large real chameleon mark occupies the right 4–5 columns, masked within a faceted architectural field. A line of explanatory copy and CTAs anchor the lower portion.

**Motion:** headline lines reveal swiftly, mark shifts at most a few pixels with parallax or sequential facet masks; no delayed legibility and no meaningless floating logos. Optional `scroll to explore` cue if it serves a real transition.

**Acceptance:** In the first three seconds, a business owner understands Kirjane builds software and systems. No decorative "system dossiers" or fake KPI tiles compete with the headline. Full content fits 1440x900 and 360x800.

### Act 02: Statement of practice
A sharply edited, horizontally ruled editorial sentence: `From sales counters to municipal offices, we turn complicated daily work into clearer software workflows.` This is a design-only illustrative line—do not imply actual project deployment without substantiation. Secondary subline ties backend engineering, security, cloud operations and websites to the work.

### Act 03: Capabilities in three chapters
Three **distinct rows/chapters**, not six identical boxes: 
- Business software & workflows — POS/inventory/reporting; tailored tools.
- Institutional & custom platforms — internal processes, records, permissions, automation.
- Backend, security, web & infrastructure — APIs, server operations, deployment, company websites.

Each chapter: readable outcome-led headline, one-sentence description, real service examples, and route link. Use numeric labels only where information benefits from ordered sequencing.

### Act 04: Selected work (the strongest visual scene)
Three different art-directed project case sequences:
1. **Salryn** — authentic interface screenshot(s), with explicit pilot/implemented status tied to product evidence; present the actual problem: daily operations / stock / counter workflows. Visual can show real POS UI only with permission and redacted data.
2. **Scoryn** — event setting or approved scoring interface, technical narrative of scoring and tabulation; event names only after verification.
3. **Talibon Intra-Office** — authentic institutional workflow proof, suitably redacted; label as development/work-in-progress where appropriate.

Every project needs: **What problem**, **what we built**, **current status**, **one verified demonstration** and a meaningful CTA. If media unavailable, choose beautiful editorial type and authentic diagrams of process—not fabricated product mockups. Do NOT duplicate long catalog variations on homepage.

### Act 05: Five-stage approach preview
Compact visual stages `Discover / Define / Build / Verify / Support` (working labels, to reconcile with actual owner-approved process). Provide tangible outcomes per stage. On desktop: short, fully visible progression using native section scroll or modest pinned scene only after browser proof. On mobile: vertical numbered steps or swipe-select with direct selection. Full process link.

### Act 06: The people
Preview a small number of verified disciplines and link to `/about`. The full seven-person interactive showcase belongs **on About**, not duplicated at full length on Home. Use real photos only when supplied. Otherwise use large editorial name/role typography with thoughtful official brand shapes; **never substitute faceless generic silhouettes**.

### Act 07: Contact close
Large editorial CTA on deep green: `Tell us what you need to build.` One direct email path plus the /contact route. No fake availability, meeting counts or promise of response time.

## D. Six-route information architecture

| Route | Visitor question | Distinct page composition |
| --- | --- | --- |
| `/` | What does Kirjane do, and can I trust its work? | Immersive dark first act, selected work, capabilities, human CTA |
| `/services` | Which operational problem can Kirjane solve for us? | Outcome-led service chapters with proof links, not identical cards |
| `/projects` | What real work supports these capabilities? | Three editorial case narratives with real authorized screenshots/status |
| `/about` | Who are the people behind the company? | Human story and distinctive 7-member team gallery; full-width desktop split and independent mobile stack |
| `/process` | How will work progress if we engage the team? | Accessible five-stage timeline, deliverable/outcome-focused, no forced scroll trap |
| `/contact` | How can I begin a conversation? | Crisp direct channels; validated email + verified social; a mailto composer labelled as draft only |

Optionally add `/projects/:slug` **only when** a detailed case has at least one authentic, approved visual, a confirmed deployment/status statement and enough non-confidential content to stand alone. Do not create empty SEO pages.

## E. Page-specific visual briefs

### Services
Unique asymmetric opening with short outcome statement and sharp typographic navigation to each service family. Each chapter gets one demonstrative interaction/real case crosslink; alternate content and visual alignment, not floating icon cards. The page ends with genuine engagement route.

### Projects
Lead with actual product/institutional imagery, not a wordy executive memo. Different narrative treatment for each project: Salryn a product interface spread, Scoryn an event/counting story, Talibon a municipal records flow. Constrain claims to evidence; list statuses quietly and clearly.

### About
Open with Kirjane positioning and small company location, then an intentional 7-person gallery. Desktop gallery may use 50/50 stage: left verified photo/typographic visual, right short role/responsibility and selector. No 700vh scroll; state changes accessible by keyboard/click, with optional brief scroll activation if it does not obstruct navigation. On mobile, vertical accessible profile cards without pinned interaction or horizontal page overflow. Full names/positions verified.

### Process
Five real stages with **why, what happens, and deliverable**. Desktop interactive stage behaves as a concise tutorial; mobile vertical narrative is always available. Ensure motion demonstrates progression and reversal, and that leaving section is effortless.

### Contact
Priority order: email, verified social, direct inquiry composer if mailto (explicitly says `Open email draft`). No fake "send" success or browser-only confirmation pretending to reach a backend. Make fallback address directly copyable. Avoid storing personal data in local storage or unapproved third-party forms.

## F. Motion storyboard

| Sequence | Desktop | Mobile and reduced motion |
| --- | --- | --- |
| Hero entry | Brief segmented type reveal (0.4–0.8 sec), single layered emblem move; no content delay | Static readable hero, restrained optional fade |
| Section transitions | Simple optical reveals for major editorial acts only, not each card | No hiding important content; passive CSS where suitable |
| Project reveal | Large actual image moves within masked frame; captions transition with it | Static media with meaningful alt, standard vertical reading |
| Team selection | Portrait and copy change together, active control clearly indicated | Click/tap member selection or cards; no pinned viewport |
| Process progression | Controlled scroll/tabs with visible progress if tested; easy exit | Direct tabs/vertical narrative; reduced motion disables sticky scrub |
| Hover/focus | Distinct interactive responses with keyboard parity | Touch targets at least 44px with clear focus ring |

Use `@gsap/react` and `gsap.matchMedia()` cleanup only for genuine choreography; CSS handles generic hover/focus; no Lenis or smooth-scroll hijacker dependency unless independently justified by a concrete need. Do not use GSAP to conceal initially rendered text.

## G. R2 design quality gate

Create screenshots of first viewport on desktop `1440x900`, tablet `768x900`, phone `390x844`, compact phone `360x800` **before** completing all pages. Inspect images visually. Compare against R1 for legibility and personality, not merely color. If the first viewport still looks like a generic SaaS banner, stop and redesign *that composition*—not the entire site. After visual direction is internally established, continue full implementation without waiting for micro-approvals.

**Owner visual sign-off is the last gate; an automated build cannot approve taste.**

## H. Delivery expectations
Committed original implementation, source-approved assets, exact branch/commit, reviewed screenshots (6 routes × 4 widths minimum), short desktop/mobile motion recordings, desktop keyboard and real touch walkthroughs, performance/accessibility report with honest limitations, draft PR. No merge, production deploy or DNS changes.
