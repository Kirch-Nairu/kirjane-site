# R3 OWNER SCREENSHOT MAP — ACTUAL VISUAL ACCEPTANCE BRIEF

These ten observations come from the owner's numbered captures of the R2 website at 127.0.0.1:8080 on Windows. **Ten owner-reference JPEG images are present in this branch as `docs/01-*.jpg` through `docs/10-*.jpg` (byte-for-byte identity with the original user uploads is unverified).** The captures are described faithfully here so Codex can reproduce equivalent before shots using the checked-out source in Chromium and correlate them to page code. Do not pretend these notes are binary screenshots; treat the owner descriptions and live baseline as joint source evidence.

**Priority:** P0 = owner specifically called an eyesore or a failure. P1 = strong cinematic starting point that needs amplification.

| Shot | Visual location | Original owner classification | Priority |
|---|---|---|---|
| 01 | Home, "Complexity lives in the handoffs" stage | Improve moving fragments | P1 |
| 02 | Home, "Make the next step clear" resolved stage | Improve kinetic 3D/camera | P1 |
| 03 | Home, "What we build" | Fix unreadable black-on-black / giant empty white composition | **P0** |
| 04 | Home "From complexity to clarity" process graphic | Replace flat SVG-feeling asset | **P0** |
| 05 | Salryn opening, "One kernel. Many industries" | Improve object/material/camera, preserve visual DNA | P1 |
| 06 | Salryn, "Different workspaces, shared records" | Improve dark/low-contrast orbit and spatial scene | P1 |
| 07 | Salryn, "One foundation leaves room to specialize" | Improve clutter and depth while showing differentiation | P1 |
| 08 | Salryn, "Built around your industry" | Rebuild narrative structure, not just art | **P0** |
| 09 | Salryn, "What you need today. More when you need it" | Rebuild tiny boxed interactive 3D/capability controls | **P0** |
| 10 | Salryn, "Built for work beyond the internet" | Replace static diagram with meaningful simulated state transitions | **P0** |

## P0 / 03 — Home services visual theatre

**Location:** site/index.html, section \`#capabilities-exhibition\`, selectors \`.exhibition-sticky\`, \`.cap-theatre-body\`, \`#home-cap-plate-stage\`, \`#home-cap-rail\`, \`[data-cap-jump]\`, \`[data-cap-card]\`.

**Visible failure:** enormous uninhabited pale/white space above content, tiny translucent tower CGI stranded on the left, black/right rectangular panel displaying virtually black text on a near-black backdrop (failed reading contrast), awkward right-column spacing. It looks like two different websites pasted together.

**Required new form:** a single premium, authored **four-state engineering exhibition** with a coherent identity across modes:
- Custom Software: illuminated modular blocks physically settle into an ordered information architecture, with permission/custody hints.
- Automation: a request travels through conditional gates with human review forks; avoid false "AI does everything" claims.
- Integration: initially separate islands negotiate a shared schema with visible paths and reconciled state.
- Infrastructure: nodes survive a controlled disruption and preserve local activity.
The headline, supporting copy and CTA must remain useful even if JS/GPU fails. Use an editorial text rail, one high-value visual stage occupying the correct proportion, visible mode tabs/buttons, soundless effects. No decorative endless preloader.

**Behavior tests:** click each of four modes and verify a distinct visual state, semantic text, focus and back/forward restoration. Scrubbing to mode boundaries must not steal a manual selection instantly. First view must be legible at 1440×900 and 390×844, with no dead blank viewport occupying more than half the height without purposeful scene content. Verify contrast of overlay/text **on the rendered frame**, not only static palette.

**Acceptance proof:** four corresponding desktop stills + one continuous mode transition video + mobile stills.

## P0 / 04 — Process topography / flow field

**Owner image:** Home closing "From complexity to clarity" overview. The current line-art SVG in a pale/white segmented panel feels visually disconnected from the dark text/scene language.

**Locations:**
- Home site/index.html \`#home-process-section\`, \`#home-topo-svg\`, \`#home-stage-panel\`, \`#process-tab-0\` through \`#process-tab-4\`.
- Dedicated site/process.html \`#process-journey\`, \`#proc-topo-mount\`, \`#proc-active-label\`, \`#stage-0\` through \`#stage-4\`.
- The existing source \`site/assets/organism-topology.svg\` is an illustration / fallback, **not** an approved primary animation.

**Required new form:** one living topographic path with five connected milestones. Distinct physical geometry per stage:
1. Discovery: diffuse signals trace the current workflow.
2. Architecture: signals align into defined ownership paths and permission boundaries.
3. Engineering: working pathways light up as components become operable.
4. Verification: controlled interruption branches reveal passes/failures/retry/resolution.
5. Handover: the flow converges and leaves a durable operational trail.

Use the same conceptual "flow" geometry on Home and Process without reusing identical timing, framing or card layout. The full Process page deserves more guided depth and time; Home is a succinct conversion story.

**Behavior tests:** keyboard arrows, tab selection, clicking stage anchors, direct deep link to any stage, manual selection priority, backwards scroll state restoration. Pointer/scroll transition never unmounts required live region or hides primary text. Reduced motion renders the five stable stages with a selected-state cue.

**Acceptance proof:** five stage captures each Home/Process + 320px reading mode + slow scrub recording.

## P0 / 08 — Industry/Flavor storytelling (12 options)

**Location:** site/salryn.html \`#scene-c-flavors\`, \`#industry-profile\` (currently inside \`[hidden]\` picker), \`#salryn-flavors-rail\`, \`#salryn-radial-host\`, \`.flavors-radial-frame\`; current \`site/assets/salryn-flavors-radial.svg\` sits inside an uninspired white/cream square. The selector does not yet drive a complete narrative.

**Required new form — five interconnected scenes:**
A. One universal core.
B. Choose a known industry (the site already lists twelve; preserve the canonical data and labels).
C. Relevant configurable engines materially rearrange or brighten; Security/Infrastructure always remain included.
D. One worked illustrative workflow traverses that industry's operating path.
E. Outcome & inquiry transition: selected industry/capability context passes to \`#scene-g-configuration\` and no data is quietly discarded.

**Example flow:** Food & Beverage: order accepted -> ingredient stock movement -> low-stock procurement action -> staff/approval checkpoint -> settlement trace. The example is a visual **simulation**, not live backend proof. Retail and one other industry must have genuinely different architecture/flows, not the same animation with renamed labels.

**Interaction:** prominent stepper, previous/next, replay/pause, native on-screen select, keyboard control. Changing industry must restart/retarget state deterministically without residual animations. Hover is supplementary; touch is first-class. No large white blank card as final visual.

**Acceptance proof:** screenshots for Food & Beverage, Retail and another industry at stage C/D, short mobile interaction video, evidence of passing choice to inquiry.

## P0 / 09 — Capabilities / eight-engine configurator

**Location:** site/salryn.html \`#scene-d-activation\`, \`#scene-d-cap-grid\`, \`#scene-d-compare-summary\`, \`.forge-live-kernel\`, \`#salryn-activation-svg\`; main R3F source \`creative/src/main.jsx\` (\`KernelIsland\`, \`KernelScene\`, \`OpticalNode\`, \`getSelectedCapabilities\`). Existing controls are functional but very small, dense, timid; 3D cluster appears as a tiny centerpiece lost in a dark box.

**Required new form:** large legible interactive crystalline architecture, eight spatially differentiated engines with visible state:
- mandatory 07 Security, 08 Infrastructure: cannot be turned off.
- six optional: Commerce, Inventory, Procurement, Financial, Workforce, Operations. Preserve the existing vocabulary/entitlement semantics.
- a selected engine **reframes the camera and makes an explanation readable**, not only changes a miniature button.
- active nodes show a visible powered state; dependencies illuminate only where actually meaningful.
- a mobile device uses a coherent alternate layout (not a 3D desktop scene squeezed into a 300px card).

**Source integrity warning:** current R2 \`KernelIsland\` intentionally shows a static 3D-looking fallback on HeadlessChrome/software renderers. Therefore a green Playwright run does **not** prove hardware WebGL frame quality. Do not remove a working fallback just to force screenshot tests. For a real hardware validation, profile a GPU-capable browser or mark unverified. The old SVG is an accessible static fallback only, not the new premium centerpiece.

**Behavior tests:** change 6 optional toggles, verify mandatory engines, count, side text and visual scene all agree, selected index and labels agree, direct script rehydrate restores selections, WebGL context loss shows premium fallback, keyboard selected engine and mobile scroll are usable. No invisible hit targets.

**Acceptance proof:** side-by-side before/after 1440 and 390, four representative engine states, 30-second interaction footage.

## P0 / 10 — Offline-first resilient network simulation

**Location:** site/salryn.html \`#scene-f-independence\`, \`[data-sim-mode]\`, \`#offline-sim-frame\`, \`#sim-mode-title\`, \`#sim-mode-desc\`. Current \`site/assets/salryn-offline-first.svg\` is the flat eye sore.

**Required new form:** one state machine over a live operational mesh:
- NORMAL / local site operating with external connection available (the currently exposed initial UI says "During an outage"; add Normal as a genuinely distinct precondition if useful).
- OUTAGE / external route fails but the local station/kernel scene continues visibly; external dependencies are queued with a clear pending mark.
- RECOVERY / connection returns; queued events travel through checks, then settle. No claim of automatic reconciliation for unimplemented features.

**Model constraint:** do not silently claim every Salryn deployment can operate fully offline. The current page explicitly qualifies: "Local availability depends on the equipment, network, and workflows in your deployment." Preserve or improve that disclosure. Show plausible engineering semantics, not fictitious proven infrastructure.

**Interaction:** step sequence with Restart/Previous/Next or independently selectable states, pause, consistent visible status, keyboard/touch and reduced motion. Offline scene must work even without 3D via a high-contrast static/dynamic DOM state table.

**Acceptance proof:** three state snapshots, state transition recording, a negative test that external state is not shown "completed" during outage, and proof of accessible labels.

## P1 / 01 + 02 — Home visual arc

**Location:** \`#complexity-clarity-scene\`, canvas \`#home-clarity-canvas\`, \`#home-clarity-beats\`; accepted opening and scroll director modules must be inspected before editing.

**01 original:** "Complexity lives in the handoffs" over floating dark emerald polyhedral shards, with lots of shadow/negative space. Current fragments feel like an impressive but arbitrary VFX reel.
**02 original:** "Make the next step clear" around a tall, angular green crystalline form with rings and orbiting fragments. Stronger, but visual continuity, scale, glow and camera trajectories can be improved.

**Required:** one transformation, NOT unrelated animations: shards have cause and direction; paths converge into ordered architecture and then a readable core. Time textual beats with motion and maintain continuity from 01 to 02 across reverse scrolling. Natural camera inertia with a clear target; no nausea-inducing high-frequency zoom. All text stays above dark backgrounds with adequate contrast.

**Acceptance proof:** paired stills + forward/reverse scroll film + reduced motion still.

## P1 / 05 + 06 + 07 — Salryn kernel evolution

**Location:** site/salryn.html \`.salryn-hero\`, \`#salryn-3d-canvas\`, \`#scene-a-kernel\`, \`#salryn-kernel-canvas\`, \`#scene-b-anatomy\`, \`#scene-c-flavors\`; existing accepted object and scene controls. Real 3D already exists in R2 but may be represented by separate renders and plate art.

**05 original:** "One kernel. Many industries" with large dark green core sphere and luminous entangled rings. Strong emblematic look but subject becomes crowded with text/camera.
**06 original:** "Different workspaces, shared records" with an almost-black sphere and dim rings. The subject is hard to distinguish; ring light is insufficient and composition is swallowed by green-black.
**07 original:** "One foundation leaves room to specialize" with numerous fine orbitals and tiny nodes. More detail, but the cluster becomes scattered and loses hierarchy.

**Required:** keep a consistent signature material and recognizable central object. Develop progression in space, light and system topology: 05 identity -> 06 shared workspace state -> 07 specialization. The identity should be traceable even on a paused frame. Introduce specific camera keys, reflective-material response, controlled contrast and a visual "handoff" between each beat. Reduce clutter instead of arbitrarily increasing particle count.

**Acceptance proof:** equal-scale paired before/after captures at the three beats, one continuous transition video including reverse scroll, mobile reduced-motion alternative.

## Global composition quality gates

- Intro pages, process diagrams and product scenes must feel like one authored visual brand, not seven competing green effects demos.
- Dark and light chapters should be purposeful; use contrast to separate ideas, not repeat green gradients without content change.
- Don't solve every problem by adding another boxed card, blurry glow or tiny caption.
- Native content should be immediately readable while the scene is loading; no lengthy invisible text on first paint.
- All live controls remain focusable/operable when GPU is missing.
- Every claimed third-party library must be present in code and its real license recorded.
- Resolve 03/04/08/09/10 before spending time on ornamental refinements.

## Current integration: Salryn Cinema R5 (additional 5 capture states)

The old ten-shot review predates the in-page 23-scene Salryn film. Capture and improve: `f01` film opening, `f02` checkout/shift, `f03` receipt, `f04` inventory, `f05` close/audit. Full film is at `#salryn-cinema-experience` after the Salryn hero. The film must retain deterministic native scroll, Shadow DOM containment, DOM-measured cursor and press/ripple math, audio muted until user opt-in, and accessible reduced-motion alternative. Treat its fictional UI as illustrative, not a live transactional POS. See `docs/codex-r3/INTEGRATION_CONTRACT.md`.
