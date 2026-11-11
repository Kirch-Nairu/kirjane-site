# KIRJANE MOTION STORYBOARD R1 — GSAP CHOREOGRAPHY & INTERACTION SPEC

## 1. Motion Architecture & GSAP Skill Integration
All motion is built with **`gsap`** and **`@gsap/react` (`useGSAP`)** following the installed official skills (`gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`):
- **Scoped Lifecycle Cleanup:** Every animated component uses `useGSAP(() => { ... }, { scope: containerRef, dependencies: [...] })` so all tweens and `ScrollTrigger` instances revert cleanly on route changes.
- **Responsive & Reduced-Motion Branching (`gsap.matchMedia()`):**
  - `(prefers-reduced-motion: no-preference)` enables entrance timelines, parallax brand depth, and smooth stage transitions.
  - `(prefers-reduced-motion: reduce)` immediately sets elements to `autoAlpha: 1, x: 0, y: 0` with zero forced scroll-scrubbing or motion delay.
- **60fps Compositor Discipline:** Animations animate `transform` (`x`, `y`, `scale`, `rotation`) and `opacity`/`autoAlpha` only—never layout properties (`top`, `left`, `width`, `height`).

---

## 2. Choreographed Sequences (`M01`–`M05`)

### M01 — First-Viewport Hero Sequence (`app/routes/home.tsx`)
- **Trigger:** Immediate on component mount inside `useGSAP()` (when `prefers-reduced-motion: no-preference`).
- **Sequence (`gsap.timeline({ defaults: { ease: "power3.out" } })`):**
  1. `0.00s`: Multi-layer background Chameleon-K watermarks (`.hero-bg-logo`) settle from `scale: 0.96, autoAlpha: 0` to calibrated watermark opacity (`duration: 0.85s`).
  2. `0.05s`: Hero eyebrow, headline (`h1`), subheadline, and primary/secondary CTAs stagger in (`y: 18 -> 0`, `autoAlpha: 0 -> 1`, `stagger: 0.07s`, `duration: 0.55s`).
  3. `0.15s`: Right-hand **Kirjane System & Product Overview** ledger panel and its 4 cells reveal (`y: 16 -> 0`, `autoAlpha: 0 -> 1`, `stagger: 0.05s`, `duration: 0.55s`).
  4. `0.25s`: Bottom 4-pillar quick-index strip cells stagger in (`y: 12 -> 0`, `autoAlpha: 0 -> 1`, `stagger: 0.04s`, `duration: 0.45s`).

### M02 — Multi-Layer Chameleon-K Brand Depth
- **Implementation:** Official Kirjane Chameleon logos (`/brand/chameleon-color.png`, `/brand/chameleon-green.png`, `/brand/chameleon-white.png`, `/brand/kirjane-mark.png`) are layered across the Hero, Capabilities, Team Left Visual Stage, Process Stage, and Closing Callout.
- **Behavior:** Subtle scroll-linked parallax via `ScrollTrigger` (`scrub: 0.6`, `yPercent: -8` to `8`) on desktop when reduced motion is off, and coordinated `x`/`y`/`scale` shifts when stepping through Team members or Process stages.

### M03 — Full-Bleed 50/50 Split-Screen Team Showcase (`app/components/TeamScrollShowcase.tsx`)
- **Layout:** Full-section (`100vw`) 50/50 split on desktop (`>= 960px`):
  - **Left 50% of screen:** Full-height dark forest portrait stage with layered Chameleon-K watermarks, large member index (`01`–`07`), architectural portrait frame, and role footer.
  - **Right 50% of screen:** Executive profile stage with verified role, founding/specialist badge, responsibility summary, key focus areas, Prev/Next buttons, and 7-member interactive roster selector (`01 Kirch` → `07 Ace`).
- **Motion & Interaction:**
  - **Desktop Scroll & Direct Selection:** As the user scrolls through the section track—or clicks any member in the 7-person roster dock, clicks Prev/Next, or presses `ArrowLeft`/`ArrowRight`—`useGSAP` smoothly crossfades and translates the active portrait slide on the left (`y: 18 -> 0`, `autoAlpha: 0 -> 1`, `duration: 0.42s`, `ease: "power3.out"`) in lockstep with the profile details on the right and shifts the background Chameleon watermark layers.
  - **Mobile (`< 960px`):** Intentional non-sticky responsive split card with touch swipe + direct member selector pills + Prev/Next controls so mobile users never experience scroll trapping.

### M04 — Progressive 5-Stage Storytelling Process (`app/components/ProcessStoryScroll.tsx`)
- **Layout:** 5 progressive stages (`01 Listen & Map the Real Workflow` → `05 Deploy, Host & Stand By Your Team`) with a live horizontal progress timeline bar, left narrative column, and right architectural deliverable schematic.
- **Motion & Interaction:**
  - **Reversible Scroll + Swipe/Click/Keyboard:** Driven by scroll position on desktop (with smooth forward and reverse scrubbing across the 5 stages) plus direct stage tab clicks, Prev/Next buttons, `ArrowLeft`/`ArrowRight` keyboard navigation, and horizontal touch swipe.
  - **Stage Transition (`useGSAP`):** Stepping to a new stage animates the progress bar fill (`scaleX`), transitions the active narrative & schematic pipeline nodes (`x`/`y` + `autoAlpha`), and shifts the dual background Chameleon-K watermarks.

### M05 — Salryn Interactive Demo & Section Reveals
- **Salryn Demo (`SalrynInteractiveSimulator.tsx`):** Switching between the 6 industry flavors (`Cafe`, `Gen Merch`, `Hardware`, `Pharmacy`, `Services`, `Enterprise`) or the 3 view modes (`1. Simulated Checkout & Stock`, `2. Automatic Accounting Ledger`, `3. Included Modules`) triggers a crisp GSAP stage transition on the active panel.
