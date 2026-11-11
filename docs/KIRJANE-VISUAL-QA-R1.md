# KIRJANE VISUAL & PERFORMANCE QA LEDGER — R1 & R1-QA2

**Candidate Working Branch:** `design/kirjane-premium-r1-antigravity`  
**Automated Suites:** `npm run check` (PASS) + `npx playwright test` (8/8 PASS)  
**Measured Performance Metrics:** Recorded in `qa-artifacts/performance-metrics.json`  
**Visual Approval Status:** **PENDING OWNER REVIEW** (per `AGENTS.md`)

---

## 1. Measured Performance & Layout Stability Evidence

Extracted via Playwright browser execution (`tests/visual-qa.spec.ts`):

| Route | Cumulative Layout Shift (CLS) | DOM Content Loaded (DCL) | Total Page Load | TTFB | Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `/` (Home) | **0.007** (threshold `< 0.100`) | 324 ms | 578 ms | 37 ms | **PASS** |
| `/services` | **0.000** | 68 ms | 118 ms | 26 ms | **PASS** |
| `/projects` | **0.000** | 47 ms | 90 ms | 23 ms | **PASS** |
| `/about` | **0.000** | 42 ms | 71 ms | 19 ms | **PASS** |
| `/process` | **0.000** | 42 ms | 69 ms | 17 ms | **PASS** |
| `/contact` | **0.000** | 93 ms | 122 ms | 19 ms | **PASS** |

*All 6 routes achieve near-zero Cumulative Layout Shift (`0.000` to `0.007`), easily exceeding Google Core Web Vitals thresholds (`< 0.100`). Total CSS bundle is `48.11 kB` (`8.70 kB` gzip).*

---

## 2. Salryn Capability & Readiness Audit

| Flavor / Core | Readiness Classification | Tested & Verified Functionality | Status In Staging |
| :--- | :--- | :--- | :--- |
| **Accounting Core** | **Implemented Core** | Double-entry journal entries (Cash, Sales Revenue, Output VAT, COGS, Inventory Asset) generated from checkout events. | Fully Implemented |
| **Inventory Engine** | **Implemented Core** | Multi-unit stock tracking, supplier purchase order logging, and cost-of-goods calculations. | Fully Implemented |
| **Cafe & F&B** | **Piloted Configuration** | Front-counter POS ordering, drink modifier options, and shift cash drawer counts tested in local food & beverage settings. | Piloted |
| **General Merchandise** | **Piloted Configuration** | Barcode lookup, piece/pack retail & wholesale price tiers, and supplier purchase order logging in retail settings. | Piloted |
| **Hardware & Supply** | **In-Development** | Quotation-to-invoice data schema and fractional unit conversion models staged in dev; yard delivery dispatch in design review. | In-Development |
| **Pharmacy & Wellness** | **In-Development** | FEFO earliest-expiry batch tracking tables and statutory Senior/PWD discount calculations in active development. | In-Development |
| **Services & Job Orders** | **Proposed Configuration** | Architecture designed for repair shops and service centers (job order intake, labor + parts billing, commission splits). | Proposed |
| **Custom Enterprise** | **Custom Deployment** | Bespoke configuration built on the validated Salryn core ledger directly with Kirjane Labs engineering and accounting leads. | Custom Deployment |

---

## 3. Contact Experience Verification

- **Elimination of Disabled Mock:** Removed `<fieldset disabled>` and `<button disabled>` completely. No dummy, unavailable form elements are presented to visitors.
- **Active Project Inquiry Composer:** Functional inputs (Name, Email, Organization, Inquiry Type, Project Details) with:
  - **Launch Email Client:** Launches mail client via `mailto:kirjanelabs@gmail.com` with pre-filled subject and structured inquiry body.
  - **Copy Formatted Draft:** One-click copy to clipboard with instant confirmation ("✓ Inquiry text copied to clipboard!").
  - **Direct Email Channel:** Active `mailto:kirjanelabs@gmail.com` link.
  - **Official Social Channel:** Direct `<a>` link to `https://www.facebook.com/kirjanelabs` with `target="_blank"` and `rel="noopener noreferrer"`.

---

## 4. Full 24-Capture Matrix Inventory (`qa-artifacts/screenshots/`)

| Route | `1440×900` | `768×900` | `390×844` | `360×800` |
| :--- | :--- | :--- | :--- | :--- |
| **`/` (`home`)** | [`home-1440x900.png`](../qa-artifacts/screenshots/home-1440x900.png) | [`home-768x900.png`](../qa-artifacts/screenshots/home-768x900.png) | [`home-390x844.png`](../qa-artifacts/screenshots/home-390x844.png) | [`home-360x800.png`](../qa-artifacts/screenshots/home-360x800.png) |
| **`/services`** | [`services-1440x900.png`](../qa-artifacts/screenshots/services-1440x900.png) | [`services-768x900.png`](../qa-artifacts/screenshots/services-768x900.png) | [`services-390x844.png`](../qa-artifacts/screenshots/services-390x844.png) | [`services-360x800.png`](../qa-artifacts/screenshots/services-360x800.png) |
| **`/projects`** | [`projects-1440x900.png`](../qa-artifacts/screenshots/projects-1440x900.png) | [`projects-768x900.png`](../qa-artifacts/screenshots/projects-768x900.png) | [`projects-390x844.png`](../qa-artifacts/screenshots/projects-390x844.png) | [`projects-360x800.png`](../qa-artifacts/screenshots/projects-360x800.png) |
| **`/about`** | [`about-1440x900.png`](../qa-artifacts/screenshots/about-1440x900.png) | [`about-768x900.png`](../qa-artifacts/screenshots/about-768x900.png) | [`about-390x844.png`](../qa-artifacts/screenshots/about-390x844.png) | [`about-360x800.png`](../qa-artifacts/screenshots/about-360x800.png) |
| **`/process`** | [`process-1440x900.png`](../qa-artifacts/screenshots/process-1440x900.png) | [`process-768x900.png`](../qa-artifacts/screenshots/process-768x900.png) | [`process-390x844.png`](../qa-artifacts/screenshots/process-390x844.png) | [`process-360x800.png`](../qa-artifacts/screenshots/process-360x800.png) |
| **`/contact`** | [`contact-1440x900.png`](../qa-artifacts/screenshots/contact-1440x900.png) | [`contact-768x900.png`](../qa-artifacts/screenshots/contact-768x900.png) | [`contact-390x844.png`](../qa-artifacts/screenshots/contact-390x844.png) | [`contact-360x800.png`](../qa-artifacts/screenshots/contact-360x800.png) |

---

## 5. Motion Recordings (`qa-artifacts/videos/`)

- **Desktop Motion Walkthrough (`1440×900`):** [`kirjane-desktop-motion-1440x900.webm`](../qa-artifacts/videos/kirjane-desktop-motion-1440x900.webm)
- **Reduced-Motion & Mobile Walkthrough (`390×844`):** [`kirjane-reduced-motion-390x844.webm`](../qa-artifacts/videos/kirjane-reduced-motion-390x844.webm)
