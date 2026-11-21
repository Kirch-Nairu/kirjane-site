// Frame-exact camera and typography math for the standalone scroll documentary.
// All outputs are pure functions of progress, viewport and input coordinates.
import { clamp01, smootherstep } from "./math.mjs";


/** Art-directed centers of interest in source-artboard percentages.
 * Phones crop a full-size desktop UI, so following a sidebar cursor can hide
 * the receipt or stock ledger. Anchor to the actual document/action instead.
 */
export const SCREEN_SUBJECTS = Object.freeze({
  dashboard:[64,40],shift:[90,54],"shift-open":[90,54],
  "checkout-search":[46,40],"checkout-cart":[76,57],
  "checkout-tender":[77,64],"checkout-review":[77,65],
  "checkout-done":[77,58],receipt:[60,56],history:[63,48],
  inventory:[74,57],stockin:[76,57],adjust:[76,57],
  reports:[64,39],audit:[64,51],backup:[65,49],
});

export function storyFocus(screen, cursor, viewportWidth) {
  const subject = SCREEN_SUBJECTS[screen] || [64,50];
  const mobile = Number(viewportWidth)<720;
  const cursorWeight = mobile ? 0.15 : 0.42;
  const x = subject[0]*(1-cursorWeight)+(cursor[0]??50)*cursorWeight;
  const y = subject[1]*(1-cursorWeight)+(cursor[1]??50)*cursorWeight;
  return [x,y];
}

export const ARTBOARD = Object.freeze({ width: 920, height: 555 });

/**
 * Cover a viewport with the source-derived Salryn artboard and aim at a
 * normalized target point. Clamp camera pans so no background void can appear.
 * Mobile intentionally uses a close-up (rather than shrinking a desktop UI).
 * Returns source-space CSS transform: translate(px, px) scale(scale).
 */
export function cameraForViewport(viewportWidth, viewportHeight, focus = [64, 48], zoom = 1.04) {
  const width = Math.max(1, Number(viewportWidth) || 1);
  const height = Math.max(1, Number(viewportHeight) || 1);
  const mobile = width < 720;
  const base = Math.max(width / ARTBOARD.width, height / ARTBOARD.height);
  const scale = base * Math.min(1.48, Math.max(1.0, Number(zoom) || 1.0));
  const artWidth = ARTBOARD.width * scale;
  const artHeight = ARTBOARD.height * scale;
  const x = clamp01((focus[0] ?? 50) / 100) * ARTBOARD.width * scale;
  const y = clamp01((focus[1] ?? 50) / 100) * ARTBOARD.height * scale;

  // Editorial text owns the left of desktop; for phones it owns the upper band.
  const anchorX = width * (mobile ? 0.53 : 0.66);
  const anchorY = height * (mobile ? 0.66 : 0.45);
  const left = Math.min(0, Math.max(width - artWidth, anchorX - x));
  const top = Math.min(0, Math.max(height - artHeight, anchorY - y));
  return Object.freeze({ left, top, scale, artWidth, artHeight, mobile });
}

/** Fade-in only in first part of a semantic beat; never hide text for the rest. */
export function phraseVisibility(local) {
  return 0.88 + 0.12 * smootherstep(clamp01(local / 0.12));
}

/** Deterministic click ring around the cursor during each procedural step. */
/** Brief deterministic state blend before the next semantic scene. */
export function transitionMix(local) {
  return smootherstep(clamp01((local - 0.83) / 0.17));
}

export function beatClickPulse(local) {
  const x = clamp01((local - 0.47) / 0.22);
  return 4 * smootherstep(x) * (1 - smootherstep(x));
}

/** Source-correct typed value depends on scroll position, never timers. */
export function revealAt(text, progress) {
  if (typeof text !== "string") throw new TypeError("value must be a string");
  return text.slice(0, Math.floor(clamp01(progress) * text.length + 1e-9));
}
