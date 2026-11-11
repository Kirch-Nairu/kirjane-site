# Kirjane IT Solutions · Kirjane Labs — Official Website

High-craft static pre-rendered corporate & product platform for **Kirjane IT Solutions**, showcasing our core strengths in **Enterprise Backend Engineering, Security Governance, Cloud Operations, Managed Web Hosting, and Tailored Systems**, alongside our flagship products (**Salryn BMS** and **Scoryn Automated Tabulation**) and institutional deployments (**Talibon Intra-Office System**).

---

## Core Products & Flagship Deployments

- **Salryn — *The Kernel for Every Business Need*:** Modular Business Management System built on a shared accounting, inventory, RBAC, and reporting kernel with industry-specific **Flavors** (*Cafe & F&B, General Merchandise & Retail, Hardware & Supply, Pharmacy & Wellness, Service & Booking, and Custom Enterprise*).
- **Scoryn — *Automated Tabulation System*:** Real-time multi-judge scoring and deterministic tabulation platform featured in **Miss Poblacion Occidental (Miss Pob Oc)**, **Mister Valencia**, and **Miss Lila**.
- **Talibon Intra-Office System:** Recognized institutional software deployment modernizing inter-departmental workflows, document routing, and operational accountability.

---

## Leadership & Team Composition

- **Kirch** — Founder, CTO & Head of Engineering · Kirjane Labs Tech Lead
- **Paul** — Co-Founder & Chief Executive Officer (CEO) · Accountant
- **James Karl** — Co-Founder & Business Lead · Accountant
- **Siris** — Co-Founder & Developer Operations Lead
- **Kurt** — CI/CD & DevOps Engineer
- **Jesse** — Social Media Manager
- **Ace** — Market Research Specialist

*(All team profiles, product media, and case-study metrics use structured placeholder slots in `app/data/content.ts` for seamless asset drop-in.)*

---

## Tech Stack & Architecture

- **Framework:** React 19 + React Router Framework Mode (Static Pre-Rendering across all 6 routes) + Vite 7 + TypeScript 5.9
- **Styling & Motion:** Unified CSS Token System (`app/styles/app.css`) + Tailwind CSS 4 + Hardware-Accelerated Viewport Reveal & Spotlight Motion Engine (`app/components/Motion.tsx`)
- **Content Layer:** Centralized, strongly-typed content registry in `app/data/content.ts`
- **Verification Gate:** Automated static route and safety verification via `scripts/verify-prerender.mjs`

## Commands

```bash
npm install
npm run dev
npm run check # Runs typecheck + lint + build + 6-route HTML verification
```
