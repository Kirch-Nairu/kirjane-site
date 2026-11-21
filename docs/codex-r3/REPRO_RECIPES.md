# R3 Screenshot Reproduction Recipes

The owner's original ten screenshot images are NOT part of this Git clone. Codex should generate reproducible approximate snapshots from the R2 source and compare them with the owner-authored observations.

The provided source capture harness `scripts/codex_r3_capture.mjs` names every state and saves:
- `01-home-fragments`, `02-home-clarity`
- `03-home-engineering`, `04-home-process`
- `05-salryn-hero`, `06-salryn-workspaces`, `07-salryn-specialization`
- `08-salryn-industry`, `09-salryn-configurator`, `10-salryn-offline`
- `m03`, `m04`, `m08`, `m09`, `m10` at 390px
- `manifest.json` listing exact viewport, selector, requested phase, scroll geometry, runtime availability and page errors.

**Owner screenshot 01 / 02:** `/#complexity-clarity-scene` from Home, phases 0.14 and 0.87. Repeat with explicit manually selected beat if these differ from the original attached captured points.

**03:** `/#capabilities-exhibition`, first custom software stage; also select each `[data-cap-idx]` control. Capture before any typography/card transition ends.

**04:** `/#home-process-section`, select `#process-tab-0` and later tabs; also record full `/process/#process-journey`.

**05:** `/salryn/`, `.salryn-hero` entry.

**06/07:** `/salryn/#scene-a-kernel`, middle/final beats; inspect `#salryn-kernel-beats` and existing director script to locate the exact narrative state.

**08:** `/salryn/#scene-c-flavors`, select `#industry-profile` only if visible (currently hidden, R3 should expose accessible selection), then inspect `#salryn-flavors-rail`.

**09:** `/salryn/#scene-d-activation`; inspect `#scene-d-cap-grid`, `.forge-live-kernel`, `#scene-d-count`, and scene ready flags. Software-GPU fallback is not proof of actual hardware 3D.

**10:** `/salryn/#scene-f-independence`; select `[data-sim-mode]` options and confirm `#sim-mode-title` and `#sim-mode-desc` match.

A strong R3 correction must show the same camera/scene role at matched viewports—not only cherry-picked unrelated impressive screenshots. Record manual adjustments and stage parameters in the capture manifest.
