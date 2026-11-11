# KIRJANE DESIGN SYSTEM R1 — SOVEREIGN BOTANICAL ENGINEERING

**Status:** Tokens verified from `public/brand/*` assets and historical baseline audit (`docs/KIRJANE-DESIGN-DIRECTION-R1.md`). Final visual acceptance remains subject to real browser verification across `1440×900`, `768×900`, `390×844`, and `360×800` and owner sign-off.

## 1. Identity & Editorial Philosophy
Kirjane Labs (registered as **Kirjane IT Solutions**, based in **Bohol, Philippines**) is a systems engineering and accounting-led software company. The interface embodies **"Sovereign Botanical Engineering"**—combining the crisp, light architectural clarity of the user-praised `6ec6020` concept (`#FCFDFB` warm alabaster paper, `#10281B` deep forest ink, `Space Grotesk` + `Inter` + `JetBrains Mono`) with rich forest-canopy stages (`#0F261A` / `#163524`), multi-layered official Kirjane Chameleon-K watermarks, and purposeful GSAP choreography.

## 2. Verified Brand Assets (`public/brand/`)
All brand marks are rendered from the authentic owned assets in `public/brand/`:
- `/brand/chameleon-color.png` — Primary faceted emerald-and-leaf Chameleon-K emblem (header brand lockup, spec ledger seal, interactive stage crests).
- `/brand/chameleon-green.png` — Monotone botanical Chameleon-K emblem (subtle multi-layer watermarks on light `#FCFDFB` and `#F2F6F0` sections).
- `/brand/chameleon-white.png` — Crisp white Chameleon-K emblem (multi-layer background watermarks on deep forest `#0F261A` stages and footer).
- `/brand/kirjane-mark.png` — High-resolution transparent Chameleon-K mark for large architectural watermarks.
- `/brand/official-logo.jpg`, `/brand/logo-green.jpg`, `/brand/logo-white.jpg` — Official brand lockup cards.

## 3. Verified Color Tokens (Sampled from `public/brand/*`)
| CSS Custom Property | Value | Usage |
| :--- | :--- | :--- |
| `--bg-paper` | `#FCFDFB` | Primary light editorial background (header, hero, products, services) |
| `--bg-surface` | `#F2F6F0` | Secondary botanical mist band (capabilities, process, subpage bands) |
| `--bg-elevated` | `#FFFFFF` | Elevated cards, spec panels, and interactive controls on light backgrounds |
| `--bg-forest-deep` | `#0F261A` | Primary dark canopy stage (50/50 Team split left stage, Salryn console, footer) |
| `--bg-forest-panel` | `#163524` | Secondary dark forest panel (`logo-white.jpg` forest tone) |
| `--bg-forest-card` | `#1D442E` | Elevated card surface inside dark forest sections |
| `--ink-primary` | `#10281B` | Primary headline and body ink on light paper (`KIRJANE` wordmark spine) |
| `--ink-secondary` | `#355040` | Lead paragraphs and supporting copy on light paper |
| `--ink-muted` | `#5C7466` | Metadata, eyebrow labels, and secondary captions on light paper |
| `--ink-on-dark` | `#F6FAF5` | Crisp primary text on deep forest backgrounds |
| `--ink-on-dark-muted` | `#B8CBBF` | Supporting body text on deep forest backgrounds |
| `--brand-emerald` | `#246844` | Primary emerald Chameleon facet & structural accent |
| `--brand-leaf` | `#92C056` | Official leaf-green Chameleon facet |
| `--brand-leaf-bright` | `#A3D165` | High-contrast lime accent on dark forest surfaces |
| `--line-subtle` | `rgba(16, 40, 27, 0.10)` | 1px structural grid hairline on light backgrounds |
| `--line-strong` | `rgba(16, 40, 27, 0.20)` | Emphasized border and active card rule on light backgrounds |
| `--line-on-dark` | `rgba(163, 209, 101, 0.18)` | 1px structural hairline on dark forest backgrounds |

## 4. Typography System
- **Display & Section Headlines (`--font-display`):** `'Space Grotesk', sans-serif` (`600` / `700`), sentence-case for natural executive legibility, tight tracking (`-0.03em` to `-0.04em`), fluid sizing:
  - Hero Headline (`h1`): `clamp(2.5rem, 4.6vw, 4.25rem)`, `line-height: 1.04`, max `16ch` per line.
  - Section Headline (`h2`): `clamp(1.85rem, 3.2vw, 2.85rem)`, `line-height: 1.08`.
  - Card / Stage Title (`h3`): `clamp(1.25rem, 2vw, 1.65rem)`, `line-height: 1.18`.
- **Body & Interface Copy (`--font-sans`):** `'Inter', sans-serif` (`400` / `500` / `600`), `1rem` to `1.125rem`, `line-height: 1.62`, constrained to `58ch–66ch` for effortless scanning.
- **Indices, Coordinates & Financial Figures (`--font-mono`):** `'JetBrains Mono', monospace` (`500` / `600`), `font-variant-numeric: tabular-nums` for section indices (`01`–`07`), Salryn POS/ledger totals, and stage counters.

## 5. Section Architecture & Layout Rules
1. **Header (`SiteHeader.tsx`):** Clean `#FCFDFB` translucent bar (`height: 76px`) with crisp bottom hairline, official Chameleon-K emblem + `Kirjane Labs / Kirjane IT Solutions` lockup, 4 indexed navigation links, subtle `Bohol, PH` location pill, and deep-forest `Start a Project →` CTA.
2. **First Viewport Hero (`Home` Gate G3):** Fits cleanly within `1440×900` without clipping. Left column features the location eyebrow, sentence-case `Space Grotesk` headline, concise 2-sentence value proposition, and dual CTAs; Right column features the **Kirjane System & Product Overview** panel with the official Chameleon emblem and 4 structured capability/product cells; anchored at the bottom by the 4-pillar quick-index strip and backed by multi-layered Chameleon-K watermarks.
3. **Capabilities Section (`Home` & `/services`):** Scannable 4-row horizontal editorial index (`01` Backend & Database Architecture, `02` Application Security & Access Control, `03` Cloud Operations & Managed Web Hosting, `04` Tailored Systems & Custom Websites) with concise 1-sentence descriptions and 3 capability tags per row—eliminating text walls.
4. **People Behind Kirjane (`TeamScrollShowcase.tsx` on `Home` & `/about`):** Full-bleed `100vw` 50/50 split screen on desktop (`>= 960px`):
   - **Left 50% of screen:** Full-height dark forest visual portrait stage with multi-layered Chameleon-K watermarks, giant index watermark (`01`–`07`), architectural portrait frame with monogram crest, and member role footer.
   - **Right 50% of screen:** Executive editorial profile panel with leadership badge, verified role, concise responsibility summary, discipline tags, prev/next buttons, and interactive 7-member roster dock (`01 Kirch` → `07 Ace`).
   - **Mobile (`< 960px`):** Intentional stacked split card with touch-friendly member selector pills and Prev/Next controls, zero scroll trapping, and zero horizontal overflow.
5. **How We Work (`ProcessStoryScroll.tsx` on `Home` & `/process`):** Progressive 5-stage storytelling engine (`01 Understand` → `05 Launch & Support`) with GSAP `ScrollTrigger` scrubbing on desktop + direct click, keyboard (`ArrowLeft`/`ArrowRight`), and touch-swipe navigation, updating both the left narrative stage and the right deliverable schematic.
