# R3 mobile-native recovery — pending verification

Starting SHA: `2cb487014e2108d88a0a188b3c39a21f8326a52e`.

The previous conversation reported 43 completed local checks but its unpublished source and screenshots were not recoverable in the successor runtime. This patch reconstructs the mobile intent independently from the frozen GitHub source. The earlier test counts do not apply to this candidate.

- Phone-only CSS at widths up to 680px: shared navigation, hero, manifesto, About, Contact, all inner route compositions, footer and 404.
- Original Services imagery remains full width; active scene receives its own cinematic visual area and caption; original JS and buttons are unchanged.
- The full original P01 ladder is shown at its native aspect ratio, followed by current stage narrative and five vertical touch controls.
- Projects retain the existing gallery, art and disclosure behavior. No new imagery, SVG overlays, dependencies, markup or runtime motion controller changes.
- Independent hosted HTTP Chromium job exercises 35 route/viewport combinations and one reduced-motion phone case with touch input, all four service scenes, five process stages and gallery controls. Captures chapter screenshots at 390px.

Status: SOURCE RECONSTRUCTION / QA NOT YET RUN. Require exact-candidate hosted results and visual review before acceptance. Desktop above 680px is not directly edited by these CSS rules; inherited regression suite must still pass. No merge or deployment.
