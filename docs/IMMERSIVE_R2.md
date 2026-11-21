# KIRION Creative Forge — Immersive Website R2

Mission: KIRJANE-IMMERSIVE-WEBSITE-R2
Status: EXPERIMENTAL / OWNER CREATIVE REVIEW HOLD
Source: Kirch-Nairu/kirjane-site / branch experiment/creative-forge-immersive-r2
Parent: experiment/creative-forge-motion-arsenal-r1 / SHA e6f3c84702aded3e2e6ea2dc96797b8fb24520d8
Draft PR: #11

## Changed creative direction

The site itself must demonstrate Kirjane's creative and frontend engineering capabilities. The weak flat Salryn SVG presentation was rejected as a hero treatment. The R2 site provides a genuine R3F procedural kernel, activated optional modules, a visual physical-material hierarchy, and cinematic typography supported by three distinct genuine React Bits components.

This is a redesign/experimentation branch, not a claim that the old R1 motion gallery was a completed cinematic redesign.

## Actual libraries, not placeholders

- **React Bits BlurText:** upstream source (with the copyright/licensing notice) in creative/src/vendor/BlurText.jsx. Editorial message reveals.
- **React Bits DecryptedText:** authentic upstream source in creative/src/vendor/DecryptedText.jsx; Projects/Process typographic treatments.
- **React Bits GlareHover:** authentic upstream source + original stylesheet; Contact project-brief CTA.
- **React 19.3.1 + React DOM:** bounded, lazy-mounted islands. The seven-page website is still buildable as native HTML.
- **React Three Fiber 9.8.2 + Three 0.187.0:** one real GPU-based Salryn kernel with physical glass, inner luminous core, animated nested rings and eight engine nodes. The real existing capability toggle state drives engine illumination. Eight accessible buttons enable keyboard/click inspection.
- **Lenis 1.3.27:** imported by the real island bundle. Opt-in on capable desktop Services, Projects, About and Contact. The accepted Home/Salryn/Process native scroll directors are not overridden.
- **GSAP + ScrollTrigger:** same locally vendored modules already used on the site, controlling scene timing, editorial enters, route conduit, parallax and state cleanup.

The source does not claim Liquid Glass JS, ShaderGradient or Liquid Logo are already integrated. They remain separate review candidates. Repeating their look in CSS is not the same as including those libraries, and no false attribution should be made.

## Reproduce

Run from repo root on an authorized development machine with Node 22, Python 3.12 and npm:

    npm ci --ignore-scripts
    npx playwright install chromium
    python scripts/build_immersive_r2.py --output dist/immersive-r2
    node scripts/qa_immersive_r2.mjs

A build generates creative/package-lock.json if not already committed. For canonical stability, commit the generated verified lock only after a dependency audit. The full R2 Vite build replaces the safe checked-in JS/CSS stub under site/js in the ephemeral working copy. A conventional static build continues to serve fallback content without importing third-party CDN scripts.

Do not publish to Hostinger or Vercel; the generated preview is marked noindex and the branch is not merged. A shell in ChatGPT cannot directly modify C:\\Users\\arane\\KirionLabs\\kirjane-creative-lab; the repository branch is the deliverable.

## Rendering and interaction guarantees

1. The R3F Canvas is lazy-mounted when the actual host approaches the viewport, and uses GSAP's ticker to request demand-based frames. There is no additional site-wide smooth scroll RAF.
2. The WebGL scene reuses actual capability toggle states. Security and Infrastructure always remain mandatory.
3. The official Kirjane emblem/wordmark are source assets; they are not transformed by React Bits or shader effects.
4. Progressive enhancement: real H1, body text, links, forms and existing SVG fallback are native HTML. If the React bundle is unavailable, the site still has navigable content.
5. Reduced motion disables expressive effects and uses a static optical material fallback where appropriate.
6. GPU scene unmount is tied to pagehide and React root disposal. Pointer-motion and visibility observers are cleaned up.
7. Content authenticity: Salryn claims refer to an illustrative architectural configuration, not a proven live enterprise deployment.

## Production release holds

- No independent aesthetic review of all seven pages has been submitted.
- GitHub Actions and Chromium screenshots/recordings must be reviewed for composition, contrast and artwork quality after build.
- Physical Safari/iOS, screen-reader spoken feedback and real D3D11/GPU measurements are outstanding.
- Verify touch interactions, mobile drawer, BFCache, page transitions and Salryn manual scroll overrides.
- Validate bundled JS transfer size versus source R1 and profile same-device p95/p99 and memory stability.
- Vendor rights need explicit inclusion in NOTICE; React Bits has MIT plus Commons Clause and must not be sold as a standalone component pack.
- No merge, no live publish and no production DNS change without owner's affirmative approval.

## Visual critique targets

Home must make an instantly distinctive first impression without swallowing the readable hero. Salryn must show a living three-dimensional object, not a pale raster diagram in a rectangle. Services should visualize work pathways. Projects should be a curated art exhibition, not random template cards. Process should make its five-stage structure obvious. About should feel typographic and authored. Contact should feel polished and actionable, never a form demo detached from commercial purpose.

R2 is designed to be criticized and revised against captured desktop/mobile screenshots. The mere presence of many animated libraries is not proof of design quality.
