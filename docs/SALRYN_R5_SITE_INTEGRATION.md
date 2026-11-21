# Salryn Cinema R5 / Kirjane Website Creative Forge R2 integration

**Integration branch:** experiment/salryn-cinema-site-integration-r1
**Parent website candidate SHA:** 1549c33364d6f289d3c1a207812c477a8a9ea1b3
**Original standalone Salryn Cinema R5 SHA:** d21dbfcf2a4f24f8eba2547791a0164a2ca63521
**Status:** DRAFT / NO MERGE / NO DEPLOY.
**Integrated film/visual review:** [Draft PR #13](https://github.com/Kirch-Nairu/kirjane-site/pull/13).
**Source correction:** The embedded film uses h2 chapter headings, retaining the corporate Salryn hero as the sole h1.
**Reproducible benchmark:** The original R2 browser/axe suite now runs against the full integrated site through FORGE_DIST=dist/cinema-integration.


R5 source is pinned under creative/film/src and built to a separate static Vite bundle.
It loads on the existing site/salryn.html page after the hero and before the seven
original Salryn documentary scenes. A Shadow DOM protects editorial styling.
The film uses the main document scrollbar, not an iframe or a new SPA/router.
Real audio is optional, locally synthesized and off by default.

Build: python scripts/build_immersive_r2.py --output dist/cinema-integration
Tests: node --test creative/film/src/director/*.test.mjs
Browser QA: node scripts/qa_salryn_site_integration.mjs

Production boundaries: No Salryn API requests, sales or inventory writes, licensing,
database access, installer or publication changes. All source-inspired screens
use fictional data and remain subject to owner fidelity review.
Current booking CTA links to the existing Kirjane Contact page.
Hardware sound QA, Safari and independent exact-SHA review remain pending.
