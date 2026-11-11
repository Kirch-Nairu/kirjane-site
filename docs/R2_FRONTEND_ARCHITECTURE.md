# Kirjane Labs — R2 Frontend Engineering Architecture

**Status: Proposed, not implemented.** Owner-requested full rebuild. Architecture baseline: `c2725c...`. Issues: [R2 #5](https://github.com/Kirch-Nairu/kirjane-site/issues/5). Existing R1 `8279547` is review-only.

## 1. Technology and rendering decisions

**Keep:** React 19, React Router v8 Framework Mode, Vite, TypeScript, build-time static pre-rendering for six routes, existing Node 22+ tooling, GitHub Actions, Playwright. No need for Astro/Next migration.

**Motion:** GSAP 3 + `@gsap/react` and ScrollTrigger **only when necessary**; the actual site must remain understandable if scripting, motion or scroll effects are unavailable.

**Styling decision:** CSS custom properties + CSS Modules for sections/components, small typed layout primitives, **one** global foundation. The repo currently includes Tailwind 4 but the R1 visual implementation primarily authored a 3k-line `app/styles/app.css`. Audit whether Tailwind is used; if not, remove its dependency/plugin in R2. Do not mix inline CSS values, Tailwind utilities, global selectors and scoped module classes for the same design controls.

**Content:** Local typed TS objects during this iteration. No new CMS, backend form service or data-fetch layer without a demonstrated requirement.

**Deployment:** No change to existing host, public URLs or DNS. Continue prerendered HTML and client hydration; add a preview only if authorized and existing infrastructure supports it.

## 2. Proposed folders & dependency direction

```text
app/
  root.tsx                           # semantic document shell / metadata
  routes.ts                          # fixed public route manifest
  routes/
    home.tsx
    services.tsx
    projects.tsx
    about.tsx
    process.tsx
    contact.tsx
  layouts/
    SiteShell.tsx
  components/
    base/
      Container.tsx                 # spacing/container, not visual language
      BrandMark.tsx                 # verified brand asset variants
      SectionHeading.tsx
      ActionLink.tsx
      VisuallyHidden.tsx
    navigation/
      SiteHeader.tsx
      MobileMenu.tsx
      SiteFooter.tsx
    sections/
      home/
        HeroScene.tsx
        CapabilityChapters.tsx
        FeaturedWork.tsx
        ProcessPreview.tsx
        TeamPreview.tsx
        ContactClose.tsx
      work/
        ProjectFeature.tsx
        ProjectProof.tsx
        ReadinessNote.tsx
      about/
        TeamGallery.tsx
        TeamMemberPanel.tsx
      process/
        ProcessTimeline.tsx
        ProcessStage.tsx
      contact/
        ContactChannels.tsx
        MailtoComposer.tsx
    motion/
      HeroSequence.tsx
      ProjectReveal.tsx
      useScopedMotion.ts
      useMotionPreference.ts
  content/
    types.ts                         # project, readiness, source, asset contracts
    company.ts
    services.ts
    projects.ts
    team.ts
    process.ts
    assets.ts
    evidence.ts                      # source/proof inventory, review states
  styles/
    tokens.css
    global.css
    typography.css
    motion.css
  [sectionName]/*.module.css         # colocated scoped scene styles
public/
  brand/                              # authorized existing marks
  media/                              # authorized, redacted imagery only
tests/
  routes.spec.ts
  visual.spec.ts
  motion.spec.ts
  a11y.spec.ts
  content-claims.spec.ts
  contact.spec.ts
docs/
  R2_VISUAL_BLUEPRINT.md
  R2_FRONTEND_ARCHITECTURE.md
  R2_CONTENT_PROVENANCE.md
  R2_ACCEPTANCE_MATRIX.md
```

Each route composes a small number of sections; sections use base primitives; base primitives have **no knowledge of project content**. Content modules do not import React or browser APIs. Motion attaches to small scoped containers, never searches the entire document by global class name.

## 3. Typed content/provenance contract (example only)

```ts
type ApprovalState = "approved" | "needs-review" | "omit";
type DeliveryState = "demonstration" | "pilot" | "development" | "delivered";
interface Evidence {
  sourceLabel: string;       // exact issue, commit, official client permission, or document
  sourceUrl?: string;
  checkedAt?: string;
  approval: ApprovalState;
}
interface MediaAsset {
  src: string;
  alt: string;
  credit?: string;
  publishApproved: boolean;
  width: number;
  height: number;
}
interface Project {
  slug: "salryn" | "scoryn" | "talibon";
  title: string;
  problem: string;
  approach: string;
  outcome?: string;          // omit without evidence
  deliveryState?: DeliveryState; // must be source-backed
  evidence: Evidence[];
  media: MediaAsset[];
}
```

A build-time/publication validator should prevent unapproved project/media claims from appearing in pre-rendered HTML. A label such as **Piloted** is a fact that requires substantiation, not a styling choice. The website repository alone does not demonstrate Salryn's actual product acceptance.

A single public copy repository should source headings, teaser text and project status to avoid conflicting claims across Home and Projects.

## 4. Layout, design token and interaction contracts

- Tokens in `styles/tokens.css`: colors, typography scales, spacing, media breakpoints, border patterns, easing, z-index; map brand asset variants to actual background themes.
- Responsive grid: 12 columns desktop ≥1200, 8 columns tablet ~768, 4 columns mobile; no hardcoded one-size scroll-based stage heights.
- Component ownership: each visual section has one root scope and one CSS Module; route supplies content props but does not embed dozens of inline styles.
- No unknown mixed content state; explicit fallback for missing verified imagery.
- Buttons always advertise working actions; `mailto:` always labelled as opening user's email app, not `Message sent`.
- Forms have label, validation, clear feedback and default error handling; external navigation can be activated by keyboard.
- Tabs use proper `tablist / tab / tabpanel` IDs, roving focus/Arrow keys, content visibility, and accessibility names; scrolling alone never required to read all content.
- The first meaningful hero content is server/pre-rendered HTML; no animation starts from CSS `visibility:hidden` unless it is immediately and safely restored.
- Nav uses semantic `nav`, main landmark, skip link, active states, focus trap (if full-screen menu) and Escape close.
- Image dimension reservation prevents CLS; `loading=lazy` on below-fold assets, eager on hero relevant asset, avoid huge PNG backdrops and responsive image composition.

## 5. Motion service boundary

```text
Page section
  -> data & layout (works with no JS)
  -> scoped motion hook (optional)
      -> gsap.context()/useGSAP()
      -> gsap.matchMedia({
           desktop: "(min-width: 1024px)",
           mobile: "(max-width: 1023px)",
           reduce: "(prefers-reduced-motion: reduce)"
         })
      -> only local refs/selector scope
      -> cleanup on unmount/media-query transitions
```

No global scroll listeners to update React state on every frame unless justified. For pinned scenes, test both geometry and *visibility inside viewport* through the entire scroll range, direct selection, reverse progression, resize, and exit. The QA2 mistake of later `position: relative` overriding `position: sticky` must not recur.

No dependency on a global smooth-scroll hijacking library. Prefer native scroll with ScrollTrigger and explicit height/clamp limits.

## 6. Performance, SEO, quality

- Per-route pre-rendered HTML with route-specific title, description, social preview only from approved assets; canonical & sitemap once official public host is confirmed.
- Performance targets: lab LCP ≤2.5s on a defined mobile profile, CLS ≤0.1, INP ≤200ms when real field data available. Distinguish lab TBT and responsiveness proxies from measured field INP.
- Visual screenshot matrix: 6 routes × (1440x900, 768x900, 390x844, 360x800), plus menu and interaction states.
- Playwright assertions: zero console/page errors, no horizontal overflow, every nav works, real/empty content states, reduced motion, correct focus, no scroll trap, active stage **and its actual on-screen visibility**.
- Real touch input in browser context or device, not only synthetic JS event dispatch.
- Lighthouse/axe checks: record environment and actual findings; no claim of WCAG conformity from passing a small test set alone.
- GitHub Actions: install dependencies; typecheck, ESLint, static build, prerender verification, Playwright Chromium, artifact upload of screenshots/videos/metrics. No passing PR with unreviewed media.
- Content assertions: no misleading demo checkout, unverified client case, invented social link, promise of guaranteed backups/availability, fake team quote.

## 7. Risk controls & migration strategy

**Main-to-R2:** Keep prior `main` branch as history, but refactor route presentation and page styles cleanly. Preserve valuable known working route signatures, error boundary, semantics, official assets and build script. Copy only validated infrastructure and tests from R1, not layout CSS. Do not cherry-pick R1 wholesale.

**One writer:** Antigravity operates on `design/kirjane-full-rebuild-r2`. No commits to main. Draft R2 PR against main only after meaningful candidate. Treat R1 PR #4 as independent and unchanged.

**Content uncertainty:** If something cannot be supported from real Salryn/Scoryn/Talibon evidence or business owner approval, don't ship the claim. Preserve a private needs-review entry in `content/evidence.ts` or docs.

## 8. Implementation sequence and acceptance gates

1. **R2-M0 — audit/provenance:** identify actual logo/media content, verified project status, current routes, tooling. Produce exact source matrix.
2. **R2-M1 — foundation:** tokens, layout, typography, shell, navigation, mobile baseline.
3. **R2-M2 — hero visual acceptance:** implement proposed concept, make real desktop/tablet/mobile screenshots, visually critique against reference quality. Don't fill the whole site with a flawed direction.
4. **R2-M3 — all six routes:** unique editorial compositions, evidence-backed work and complete contact journey.
5. **R2-M4 — motion system:** hero, real-case reveal, accessible team and stage progression, reduced-motion support, no scroll traps.
6. **R2-M5 — independent QA:** Playwright, CI, accessibility, performance, screenshot inspection and motion recordings. Fix all P0/P1 before presenting.
7. **R2-M6 — draft PR + owner review:** evidence summary and design approval. Do not merge/deploy without authorization.

Deliverable is the **complete** working website, not a proposal-only completion report. These architecture documents are planning assets, not evidence of implementation.
