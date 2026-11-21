# R3 MOTION + VISUAL SYSTEM ARCHITECTURE

This is a design/engineering contract, not a mandate to add every package. Existing source is static multi-page HTML with route-level scripts and optional React islands; retain that architecture unless an exact, reviewed functional reason demands otherwise.

## 1. One clear visual language

**Visual thesis: Living Topography / Engineered Clarity.** Not arbitrary floating emerald geometry. Build a repeatable material/interaction grammar:
- **Kernel**: recognizable central intelligence/ownership, with a consistent optical signature.
- **Streams**: work, events, decisions and record custody flowing on visible directed paths.
- **Gates**: consequential review/approval/security checkpoints, visually distinct from passive routing.
- **Nodes**: people, applications, workstations, modules and integrations with meaningfully differentiated geometry.
- **Contours**: conceptual complexity, layered state, spatial hierarchy; not mere decoration.
- **Materials**: bounded translucent emeralds, graphite, lime highlights, satin mist grounds and selective reflective surfaces.
- **Light**: a specific state cue (active route, selected node, pending, offline), not random bright bloom.
- **Camera**: establishes, reveals, inspects, leaves. Favor small physically credible transitions over perpetual orbital spin.

Dark scenes need mid-tone separation and enough luminance to show surfaces; light chapters need disciplined contrast and adequate object scale. Official company wordmark/emblem is never shader-deformed or replaced.

Create a shared design token module for key camera movement/contrast/edge/glow settings, instead of per-scene independent random constants.

## 2. Existing R2 source surfaces to inspect

- \`site/index.html\`: \`#complexity-clarity-scene\`, \`#home-clarity-canvas\`, \`#home-clarity-beats\`, \`#capabilities-exhibition\`, \`#home-cap-plate-stage\`, \`#home-cap-rail\`, \`#home-process-section\`, \`#home-topo-svg\`, \`#home-stage-panel\`.
- \`site/salryn.html\`: \`.salryn-hero\`, \`#salryn-3d-canvas\`, \`#scene-a-kernel\`, \`#salryn-kernel-canvas\`, \`#scene-b-anatomy\`, \`#scene-c-flavors\`, \`#salryn-flavors-rail\`, \`#salryn-radial-host\`, \`#scene-d-activation\`, \`#scene-d-cap-grid\`, \`.forge-live-kernel\`, \`#scene-f-independence\`, \`#offline-sim-frame\`, \`#scene-g-configuration\`.
- \`site/process.html\`: \`#process-journey\`, \`#proc-topo-mount\`, \`[data-step]\`, \`#stage-0\` ... \`#stage-4\`.
- \`creative/src/main.jsx\`: real React Bits imports, R3F \`KernelScene\`, \`KernelIsland\`, \`OpticalNode\`, \`getSelectedCapabilities\`, Lenis hook.
- \`site/js/forge-kinetics-r2.js\`, \`site/js/creative-studies-r1.js\`: existing GSAP page and lab choreography; preserve only what continues to serve R3.
- \`scripts/build_immersive_r2.py\` + \`creative/vite.config.mjs\`: separate modern React bundling with seven static HTML routes.
- \`site/assets/cinematic/\`: existing artwork, not automatically licensed new art; retain source evidence.

**Before refactoring:** discover the current class/file selector dependencies via actual grep/ripgrep. Avoid parallel directors attached to the same element.

## 3. Ownership rules for scene time

**Clock hierarchy:**
1. Browser native scroll position is truth.
2. GSAP ticker drives GSAP time and, if enabled, *one* Lenis \`raf\`; \`autoRaf:false\`.
3. ScrollTrigger translates scroll into scene progress.
4. R3F receives normalized scene phase or render invalidation; do not create a competing independent \`requestAnimationFrame\` loop for camera choreography.
5. Interaction state (manual choice, industry, module enablement) is owned by a single source of truth; never let both DOM mutation observers and React local state race to update.

Recommend a small \`SceneDirector\` abstraction per major chapter, with explicit \`init()\`, \`setPhase(progress)\`, \`select(index,{source})\`, \`pause()\`, \`resume()\`, \`dispose()\`, and a policy for reduced motion. Animation should be interruptible and scrub-reversible.

**Manual input authority:** Do not let ScrollTrigger's \`onUpdate\` immediately erase a button selection. Model explicit states:
- \`SCROLL_FOLLOW\` — stage is derived from scene progress.
- \`MANUAL_HOLD\` — user-selected stage remains active through incidental layout shifts and zero-distance scroll events.
- \`RESUME_SCROLL\` — only actual wheel/touch/keyboard scroll intent beyond a documented threshold releases hold.
- \`DISPOSED\` — no further DOM writes or render tick.

If programmatic scroll to a selected stage is desired, use one controlled scene progress path and suspend conflicting updates until the programmatic scroll completes. Avoid magic timeouts used as state ownership.

**Accessibility:** do not stream dozens of scroll-progress aria-live announcements. Announce manual stage changes only, or after a stable settled selection; selected button/state must use correct \`aria-pressed\` / \`aria-selected\` semantics.

## 4. Camera, depth and lighting choreography

Construct a small sequence data model, e.g. conceptual keys \`chaos\`, \`alignment\`, \`kernel\`, \`workspaces\`, \`specialization\` with measured camera position, look target, FOV and object transforms. For each:
- start silhouette and hero text remain legible;
- main subject occupies a purposeful share of the frame (not tiny in a giant box);
- avoid camera hitting geometry, ring clipping over text, bloom swallowing surfaces;
- transition should not hard-cut unless intentionally editorial;
- include directional flow to teach what changed;
- keep a still poster that expresses the same idea in reduced mode.

On mobile, don't just crop the desktop composition. Author separate camera framing and rail placement, reduce particle density and screen-space glow. Use a physically credible lower-cost variant if needed.

## 5. Material/asset engineering

Prefer authored geometry/shaders, approved CGI derivatives, or legally cleared source assets over pulling generic external imagery. A new shader library must satisfy:
- upstream repo and exact commit/version recorded;
- license allows use in the intended commercial corporate site;
- source file/notice or attribution preserved;
- actual integrated use with clear visual intent;
- minimal render/context footprint and measured artifact bytes;
- graceful static/reduced/GPU-loss fallback.

React Bits is already incorporated at \`creative/src/vendor/\`; preserve MIT + Commons Clause text, don't distribute component packages separately. ShaderGradient and Liquid Glass JS can enrich material studies only if bounded. Liquid Logo's PolyForm Shield license requires explicit legal suitability verification before use; never reshape the Kirjane wordmark/emblem.

Use **at most one active authored 3D scene per page viewport** when feasible; avoid invisible WebGL canvases continuing to consume GPU behind section transitions. If persistent fullscreen WebGL hosts multiple chapters, isolate its geometry/camera states from DOM hit testing and ensure it does not block native scroll/links. Existing \`#salryn-3d-canvas\` and \`.forge-live-kernel\` currently represent different surfaces; consolidate only with verified regression tests.

If using video: provide optimized encodes or image sequences in project assets, no autoplay with sound, use \`playsInline\`, \`muted\`, lazy playback and \`prefers-reduced-motion\` fallback, do not render entire huge sequences at phone DPR.

## 6. WebGL disposal and recovery contract

- Every buffer geometry, texture, render target, material, shader/uniform subscription, animation ticker listener, \`ResizeObserver\`, \`IntersectionObserver\`, \`MutationObserver\`, \`pointermove\` listener and external scroll instance must be disposed or explicitly owned by a parent that disposes it.
- Handle \`webglcontextlost\` and \`webglcontextrestored\` without repeated unrecoverable state loops.
- Remove scene when pagehide/navigating or after explicit unmount; preserve predictable BFCache pageshow restoration.
- Offscreen and hidden documents should not run 60fps GPU animation.
- DOM content must be semantically complete even if React/R3F fails to mount.
- On fallback, make the optical image/diagram attractive: it is part of the site, not an error placeholder with a blank square.

Maintain a small optional debug surface in development only (not public logging of user data) showing current scene state, active contexts, visible refs and frame requests. Do not use the presence of a \`canvas\` element as proof that its context rendered.

## 7. Scene-level interaction specifications

### Home four-mode services
One \`activeService\` state; GSAP transition gracefully reposes shapes instead of loading unrelated uncoordinated canvases. Controls are semantically a tablist or equivalent. Visual transition should show architecture building, automation routing, integration handshakes and infrastructure resilience; use different state topology, color emphasis, physical behavior and explanatory copy.

### Process five stages
Same \`activeStage\` concept on Home and Process. Real \`[data-step]\` / \`#stage-x\` correspond to five authored path states. Keep anchor hashes and focus; don't break \`#process-journey\` or nested navigation. Pin only when beneficial on desktop and no double-pin exists.

### Industry configuration
One authoritative \`selectedIndustry\`, one \`narrativeStep\`, one derived \`relevantCapabilities\`, one \`simulationStatus\`. All twelve canonical industry choices remain and selected choice flows into \`#scene-g-configuration\` without replacing user-entered notes. Trace both with and without JS if possible.

### Engine activation
One \`enabledCapabilities\` with mandatory Security + Infrastructure. Existing business selector buttons must drive the 3D representation. E.g. a unique node object per engine, visible connecting ribbon and documented focus/camera keys. No "optional" state for mandatory modules; update labels, count and scene in sync.

### Offline demo
Deterministic \`normal\`, \`outage\`, \`recovery\` states with visible transit/custody semantics. Queued external action must remain pending during outage. Provide a textual event ledger accessible without GPU and never imply all external transactions automatically reconcile.

## 8. Screenshot discipline

Scroll-driven scenes are not stable at arbitrary capture time. Before screenshot:
- wait for fonts, assets and image decode; scroll to named scene or select named stage;
- settle GSAP motion or explicitly pause it at the target phase;
- record the phase/state and viewport in evidence metadata;
- ensure sticky scenes are visible without unrelated navigation overlays;
- take comparable baseline/candidate images at the same viewport, selected state and capture phase;
- capture a continuous film to prove real choreography and reverse scroll, not just a Photoshop-looking static mock.

No claim of "cinematic" acceptance without an art-director critique of the actual browser capture.
