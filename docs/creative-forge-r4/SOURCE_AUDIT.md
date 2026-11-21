# KIRJANE R4 — SOURCE AUDIT / USAGE BOUNDARIES

Baseline source: 7f3a3147c225aea8617820136b509306db3a143f, R3 Draft PR #15. Audit by GitHub tree and static inspection of all seven HTML pages plus live scene source modules. No live browser network trace, raster-wide pixel histogram or physical GPU validation performed.

## Exact file-count interpretation
- 511 total tracked blobs in the recursively resolved R3 tree.
- 342 raster + SVG assets in current repo (all including documentation and old/QA files).
- 303 WebP, 14 PNG, 14 JPG and 11 SVG (from tree).
- site/assets/cinematic/ contains 289 tracked files of different types. 256 files in four high-impact directories, comprising exactly 252 numbered frames plus 4 posters: Home desktop 72 frames + 1 poster, Home mobile 36 frames + 1 poster, Salryn documentary desktop 96 frames + 1 poster, Salryn documentary mobile 48 frames + 1 poster.
- Site/brand: 9 images (canonical brand variants, LOCKED). Legacy R2: 12 WebP artworks, source archive.
- Docs ten owner-reference JPGs and five R3 evidence PNGs are NOT website artwork.
- R3 asset licenses in docs/codex-r3/ASSET_LICENSES.csv; earlier vendor registry docs/IMMERSIVE_R2_SOURCE_REGISTRY.csv.

## Actual direct page source links (not a claim every image loaded on every client)
Home: d02-hero-desktop/mobile.webp; brand logo; home-complexity-to-clarity poster; ascension-kernel-landscape.webp; salryn-ecosystem-architecture.svg; editorial-cap-01..04.webp; organism-topology.svg. Canvas at #home-cap-plate-stage is run by forge-service-scene.js. Home process canvas at #home-topo-svg is run by forge-process-field.js.
Services: ascension-request-routing-1440.webp; custom software/automation/integration/infrastructure cap art and services-integration-membrane.svg.
Process: organism-topology.svg fallback and #proc-topo-mount.
Projects: no dedicated image element direct path in HTML beyond branding; project graphics may come from CSS/JS; require runtime network tracing.
About: ascension-public-records, ascension-branch-purchasing, ascension-kernel-landscape.
Contact: contact-scope-diagram plus sources may generate/shape it dynamically; inspect ascension-contact.js and SVG fallback usage.
Salryn: salryn-hero-master-desktop.webp; kernel-documentary poster; ascension-kernel-stack; salryn-anatomy-exploded.svg; editorial-salryn-flavors-constellation.webp; salryn-flavors-radial.svg; salryn-ecosystem-architecture.svg; editorial-salryn-growth-topography.webp; salryn-offline-first.svg.
Site-wide topographic background is script-driven with topography.css and topography-canvas.js.
Frame-sequence-player.js constructs dynamic /frame-NNNN.webp URLs; therefore frame files are LIVE-RUNTIME-SEQUENCE even if not individually present as HTML src strings.
Film: creative/film/src/scenes/manifest.js 23 scene source and creative/film/src/App.tsx, rendered through site/js/forge-salryn-cinema-loader.js and a Shadow DOM React island.

## Exact technical risks
- Static source references do not prove every media asset is loaded at runtime. Dynamic sources require a controlled HTTP browser network trace on all viewports.
- No safe automated 'delete unused assets' until reference graph and source/rights history are reconciled.
- Existing site has scene-director.js, motion-system.js, frame-sequence-player.js, forge-kinetics-r2.js, R3 native scene modules, and creative/src/main.jsx. Worker must discover actual owners before changing any animation; no duplicate tickers, scroll drivers or simultaneous heavy WebGL scenes.
- Salryn film still relies on deterministic native scroll, measured DOM cursor and opt-in sound; don't disturb it.
- R3 tests cover behavior, not hardware material fidelity; Internet screenshots do not qualify physical GPU.
- Prior manually modeled Blender chameleon is a rejected sandbox experiment and MUST NOT be published, imported or extended.
- Previous R4 Engineered Core is also not an accepted replacement until page-level artistic evidence exists.

## Source vs. proposal
ASSET_INVENTORY_R3.csv is the actual committed path inventory with live HTML reference flags, dynamic sequences and provenance categories. COLOR_MATERIAL_STUDY.json and REPLACEMENT_MATRIX.csv are proposed R4 direction, not owner-approved design.
