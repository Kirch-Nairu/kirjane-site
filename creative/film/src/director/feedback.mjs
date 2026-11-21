// R5 tactile cues. A single scroll position deterministically owns each pixel.
// Sound admission is separate from visual animation: user gesture required.
import { clamp01, smootherstep } from "./math.mjs";

export const CLICK_CUE_AT = 0.80;
export const CLICK_VISUAL_FROM = 0.77;
const CLICK_KINDS = new Set(["CLICK", "TYPE_CLICK"]);

export function isClickKind(kind) {
  return CLICK_KINDS.has(kind);
}

/** Press/release and expanding impact ring are seekable (including reverse). */
export function tactileAt(local, kind, visible) {
  const invisible = { press: 0, ripple: 0, ringOpacity: 0, glint: 0 };
  if (!visible || !isClickKind(kind)) return Object.freeze(invisible);
  const p = clamp01(local);
  const press =
    smootherstep(clamp01((p - CLICK_VISUAL_FROM) / 0.031)) *
    (1 - smootherstep(clamp01((p - 0.825) / 0.052)));
  const ripple = smootherstep(clamp01((p - 0.792) / 0.102));
  const ringOpacity =
    smootherstep(clamp01((p - 0.792) / 0.014)) *
    (1 - smootherstep(clamp01((p - 0.853) / 0.09)));
  const glint =
    smootherstep(clamp01((p - 0.791) / 0.014)) *
    (1 - smootherstep(clamp01((p - 0.812) / 0.045)));
  return Object.freeze({press, ripple, ringOpacity, glint});
}

/**
 * Audio may fire only after an explicit sound-enable gesture, for an already
 * calibrated CLICK scene, on a SMALL, forward-only crossing of the authored
 * threshold. A set of played shot IDs suppresses rewind/seek replay storms.
 */
export function shouldSoundClick(previous, current, {
  enabled = false, pageVisible = true, reduced = false, heard = false,
  maxLocalDelta = 0.24
} = {}) {
  if (!enabled || !pageVisible || reduced || heard || !previous || !current) return false;
  if (previous.shotId !== current.shotId) return false;
  if (!isClickKind(current.kind) || !current.visible || !current.targetId) return false;
  if (!Number.isFinite(previous.local) || !Number.isFinite(current.local)) return false;
  const distance = current.local - previous.local;
  return distance > 0 && distance <= maxLocalDelta &&
    previous.local < CLICK_CUE_AT && current.local >= CLICK_CUE_AT;
}
