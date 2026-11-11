# KIRJANE-DESIGN-DIRECTION-R1 — Baseline Audit & Creative Direction

## 1. Historical Baseline Audit (`a51f658` → `c2725cc`)

### Commit-by-Commit Comparison
| Commit SHA | Summary | What Worked | What Failed / Regressed |
| :--- | :--- | :--- | :--- |
| **`a51f658`** (`main` base) | Initial React Router v7 + Vite + TypeScript setup | Clean 6-route structure (`/`, `/services`, `/projects`, `/about`, `/process`, `/contact`), fast Vite SSR/SPA build, accessible skip link and semantic landmarks. | Early content placeholders; lacked real Kirjane brand marks, Salryn/Scoryn product depth, and motion choreography. |
| **`6ec6020`** (`8d47227`) | Clean corporate editorial foundation | **User-praised "past concept"**: Crisp warm alabaster paper (`#fcfdfb`), soft sage surface (`#f1f5ef`), deep forest ink (`#102b1e`), botanical green (`#23633f`), leaf lime (`#a0cc63`), `Space Grotesk` display type (`clamp(2.85rem, 6.2vw, 5.75rem)`), `Inter` body, `JetBrains Mono` functional indices, asymmetric hero split with left structural accent rule, and a scannable numbered capability list (`<ol className="home-capabilities">`) separated by crisp hairlines. | Lacked official Chameleon-K assets, Salryn interactive demo, 7-person team showcase, and progressive process storytelling. |
| **`42bfbbf`** | Enterprise telemetry & interactive expansion | Retained the clean `6ec6020` light corporate palette and typography while introducing the Salryn simulator and 7-person team roster. | Introduced artificial sci-fi/telemetry jargon (`01 // TELEMETRY`, `KRN-01`, `SYS-ARCH`), dashed `[PLACEHOLDER]` boxes, and negative-margin scroll waypoints (`margin-top: -55vh`) that caused layout overlap. |
| **`60a1504`** | Soft green SaaS card rewrite (**Rejected in user screenshots 1–4**) | Plain-English copy improvements. | Replaced the clean corporate editorial stylesheet with generic rounded SaaS cards (`border-radius: 26px`), a green-heavy header/hero, a text-heavy 2×2 services card grid (Screenshot 2), an isolated boxed dark card for the team section with massive empty margins (Screenshot 3), and 5 static vertical cards for "How We Work" (Screenshot 4). |
| **`c2725cc`** | Unverified architectural grid rewrite | Attempted a full-bleed 50/50 split for the team section and a 5-stage process track. | Blind whole-file CSS replacement without inspecting real browser renders first; introduced boxy wireframe borders, uppercase shouting headlines, unverified first-person staff quotes in `app/content/team.ts`, and unsupported operational guarantees (`24/7`, `Daily Encrypted Backups`, `100% Verified`) in `app/components/ProcessStoryScroll.tsx` and `app/routes/home.tsx`. |

### Process Reference: Valencia R2 (`d5e121522c557f63ec683cf9aee79309795005b8`)
From auditing `Kirch-Nairu/ValWebsite` (`design/valencia-r2-antigravity-one-shot`), the successful execution methodology is:
1. **Intentional Design Tokens & Editorial Restraint:** Define a cohesive, high-contrast token system with clear typographic hierarchy, generous whitespace, and disciplined structural hairlines before touching routes.
2. **Real Browser Visual Verification First:** Visually inspect rendered viewports (`1440×900`, `768×900`, `390×844`, `360×800`) on the homepage first viewport before scaling across subpages.
3. **Purposeful Motion with Clean Fallbacks:** Every interactive showcase has deterministic scroll/click/keyboard state transitions and honours `prefers-reduced-motion: reduce`.

---

## 2. Verified Brand Asset & Color Audit (`public/brand/*`)

Inspected directly from owned brand files in `public/brand/`:
- `public/brand/official-logo.jpg` (1048×717 — full vertical lockup on white paper `#FCFDFB` with faceted green Chameleon-K emblem, `KIRJANE` geometric display wordmark, and `KIRJANE IT SOLUTIONS` subtitle)
- `public/brand/logo-green.jpg` (960×960 — standalone faceted green Chameleon-K mark on white)
- `public/brand/logo-white.jpg` (960×960 — white Chameleon-K mark on deep forest green `#183D28` / `#132E1F`)
- `public/brand/chameleon-color.png`, `public/brand/chameleon-green.png`, `public/brand/chameleon-white.png`, `public/brand/kirjane-mark.png` (transparent PNG extractions for multi-layer background watermarks and header/footer emblems)

### Verified Color Tokens
| Token | HEX / Value | Source & Role |
| :--- | :--- | :--- |
| `--bg-paper` | `#FCFDFB` | Warm alabaster paper background (`official-logo.jpg` field & `6ec6020` base) |
| `--bg-surface` | `#F2F6F0` | Soft botanical mist for alternating editorial bands and interactive panels |
| `--bg-elevated` | `#FFFFFF` | Crisp elevated card/console surface |
| `--bg-forest-deep` | `#0F261A` | Deep forest canopy (`logo-white.jpg` dark ground & full-bleed dark stages) |
| `--bg-forest-panel` | `#163524` | Rich forest secondary surface (`logo-white.jpg` center tone) |
| `--bg-forest-card` | `#1D442E` | Elevated dark card / interactive terminal surface |
| `--ink-primary` | `#10281B` | Deep forest-charcoal primary typography (`KIRJANE` wordmark spine) |
| `--ink-secondary` | `#355040` | Balanced editorial body copy on light paper |
| `--ink-muted` | `#5C7466` | Captions, metadata, and secondary labels on light paper |
| `--ink-on-dark` | `#F6FAF5` | Primary crisp white headline copy on forest surfaces |
| `--ink-on-dark-muted` | `#B8CBBF` | Secondary body copy on forest surfaces |
| `--brand-emerald` | `#246844` | Mid-emerald Chameleon facet (`official-logo.jpg` primary facet) |
| `--brand-leaf` | `#92C056` | Bright leaf-lime Chameleon facet (`official-logo.jpg` highlight crest) |
| `--brand-leaf-bright` | `#A3D165` | Interactive hover / active indicator accent on dark surfaces |
| `--line-subtle` | `rgba(16, 40, 27, 0.10)` | Clean 1px editorial hairline on light paper |
| `--line-strong` | `rgba(16, 40, 27, 0.20)` | Emphasized structural divider on light paper |
| `--line-on-dark` | `rgba(163, 209, 101, 0.18)` | Subtle structural hairline on deep forest surfaces |

---

## 3. Creative Direction: "Sovereign Botanical Engineering"

1. **Clean Corporate Editorial Authority (Restoring `6ec6020`'s Best Qualities):**
   - Light, breathable `#FCFDFB` paper canvas for the header, hero, and primary reading flow—contrasted with deep `#0F261A` forest stages for the interactive Salryn console, the full-bleed 50/50 Team split screen, and the closing callout.
   - Sentence-case, high-craft `Space Grotesk` headlines (`font-weight: 700`, `letter-spacing: -0.035em`) rather than all-caps shouting blocks.
2. **Multi-Layer Official Chameleon-K Background Architecture:**
   - Every major section uses layered official Kirjane logos (`chameleon-color.png`, `chameleon-green.png`, `chameleon-white.png`, `kirjane-mark.png`) at calibrated opacities (`0.035` to `0.14`), scales, and GSAP parallax depths so the brand emblem feels woven into the architecture of the page.
3. **Fixing All Four User Screenshot Pain Points:**
   - **Screenshot 1 (Header & Default Screen):** Replace the heavy green/rounded SaaS header and boxy wireframe with a crisp, authoritative corporate header on `#FCFDFB` (`backdrop-filter: blur(16px)`), featuring the official Chameleon-K mark, clean typographic links, a subtle `Bohol, PH` status indicator, and a refined deep-forest CTA button. The first viewport pairs an asymmetric editorial headline & action bar on the left with a structured **Kirjane System & Product Ledger** on the right, backed by dual-layer Chameleon watermarks and a 4-pillar index strip anchored cleanly at the base of the viewport.
   - **Screenshot 2 (Capabilities Section — Too Much Text):** Replace verbose paragraphs and 4 boxy cards with a **concise, high-contrast 4-row Editorial Capability Index** (`01` to `04`) where each capability has a single crisp sentence, 3 scannable capability pills, and a clean horizontal structural layout.
   - **Screenshot 3 (Team Section — Full-Bleed Left Picture / Right Text):** True `100vw` full-bleed section (`min-height: calc(100vh - var(--header-h))`). The **Left 50% of the viewport** is a full-height visual portrait stage with multi-layered Chameleon-K watermarks, architectural portrait framing, monogram crest, and member index; the **Right 50% of the viewport** houses the member's verified role, leadership badge, concise bio, discipline tags, and interactive roster selector (`01 Kirch` through `07 Ace`).
   - **Screenshot 4 (How We Work — Progressive Storytelling Motion):** Interactive 5-stage progressive storytelling engine (`01 Understand` → `05 Launch & Support`) powered by GSAP (`useGSAP` + `ScrollTrigger` scrubbing on desktop + click/keyboard/touch-swipe controls) where scrolling or swiping smoothly transitions the active stage narrative, architectural deliverable schematic, and multi-layer background Chameleon watermarks.
