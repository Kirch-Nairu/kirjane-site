// R4 source-aligned deterministic action director.
// Coordinates come from rendered [data-cinema-target] DOM bounds in the
// 920 x 555 Salryn artboard. No guessed cursor click percentages.
import { clamp01, smootherstep, cursorBetween, locateBeat } from "./math.mjs";
import { tactileAt } from "./feedback.mjs";
import { cameraForViewport, SCREEN_SUBJECTS, ARTBOARD } from "./camera.mjs";

export const ACTIONS = Object.freeze({
  "opening":       {kind:"HOLD"},
  "q-pos":         {kind:"FOCUS", target:"nav-pos"},
  "q-stock":       {kind:"FOCUS", target:"nav-stock"},
  "q-finance":     {kind:"FOCUS", target:"nav-reports"},
  "q-audit":       {kind:"FOCUS", target:"nav-audit"},
  "promise":       {kind:"HOLD"},
  "overview":      {kind:"FOCUS", target:"dashboard-sales"},
  "shift-gate":    {kind:"TYPE_CLICK", target:"shift-open", entry:"shift-cash"},
  "shift-open":    {kind:"HOLD"},
  "scan":          {kind:"TYPE", target:"checkout-barcode"},
  "cart":          {kind:"FOCUS", target:"checkout-cart"},
  "tender":        {kind:"TYPE", target:"checkout-cash"},
  "review":        {kind:"CLICK", target:"checkout-confirm"},
  "complete":      {kind:"HOLD"},
  "receipt":       {kind:"HOLD"},
  "history":       {kind:"FOCUS", target:"history-row"},
  "stock":         {kind:"FOCUS", target:"inventory-movement"},
  // The current prototype does not render functional stock-in / adjust forms.
  // Suppress phantom clicks rather than invent controls.
  "receiving":     {kind:"HOLD"},
  "adjustment":    {kind:"HOLD"},
  "shift-close":   {kind:"FOCUS", target:"reports-expected"},
  "audit":         {kind:"FOCUS", target:"audit-sale"},
  "offline":       {kind:"HOLD"},
  "end":           {kind:"HOLD"},
});

export const PRIMARY_CLICK_PHASE = 0.78;

export function targetCenter(target) {
  if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.y)) return null;
  return [target.x, target.y];
}

export function pointerAt(shot, local, measured, reduced = false) {
  const action = ACTIONS[shot.id] || {kind:"HOLD"};
  const hidden = Object.freeze({kind:action.kind, visible:false, x:50, y:50, pulse:0, targetId:null, ...tactileAt(0,action.kind,false)});
  if (reduced || action.kind==="HOLD") return hidden;
  const targets = measured?.[shot.screen] ?? {};
  const destination = targetCenter(targets[action.target]);
  if (!destination) return hidden; // Missing calibration must NEVER synthesize a false click.
  const entry = action.entry ? targetCenter(targets[action.entry]) : null;
  if (action.entry && !entry) return hidden;
  const p = clamp01(local);
  const visible = p > .08 && p < .93;
  let xy;
  if (entry) {
    if (p < .36) {
      const from=[Math.max(0,entry[0]-11),Math.min(100,entry[1]+14)];
      xy=cursorBetween(from,entry,clamp01((p-.08)/.28));
    } else if (p < .66) xy=entry;
    else xy=cursorBetween(entry,destination,clamp01((p-.66)/.11));
  } else {
    const from=[Math.max(0,destination[0]-12), Math.min(100,destination[1]+14)];
    xy=cursorBetween(from,destination,clamp01((p-.12)/.35));
  }
  // Deliberate click only on explicit CLICK or TYPE_CLICK actions.
  const canClick=action.kind==="CLICK" || action.kind==="TYPE_CLICK";
  const x = clamp01((p-PRIMARY_CLICK_PHASE)/.14);
  const pulse = visible && canClick ? 4*smootherstep(x)*(1-smootherstep(x)) : 0;
  return Object.freeze({kind:action.kind, visible, x:xy[0],y:xy[1],
    pulse, targetId:action.target, ...tactileAt(p,action.kind,visible)});
}

export function cameraPoseAt(index, local, film, viewport, reduced = false) {
  const shot=film[index];
  if (!shot) throw Error("Invalid shot index");
  const next=film[Math.min(film.length-1,index+1)];
  const currentFocus=SCREEN_SUBJECTS[shot.screen] || [58,48];
  const nextFocus=SCREEN_SUBJECTS[next.screen] || currentFocus;
  // All joins share an identical next-shot pose and zero endpoint slope.
  const u=reduced?0:smootherstep(clamp01((local-.82)/.18));
  const focus=[currentFocus[0]*(1-u)+nextFocus[0]*u,
               currentFocus[1]*(1-u)+nextFocus[1]*u];
  const isPhone = viewport.w < 720;
  const baseZoom=isPhone?1.11:1.055;
  // Shot-specific target zoom is optional but must resolve continuously.
  // Reading shots breathe out; action shots move closer. Endpoint equality
  // preserves reverse-scroll joins, and the click stays DOM-calibrated.
  const lens={receipt:-.025,inventory:-.015,stockin:-.015,adjust:-.015,audit:-.025,reports:-.02,'shift-gate':.015,'checkout-review':.02};
  const from=lens[shot.screen]||0,to=lens[next.screen]||0;
  const zoom=baseZoom+(isPhone?.5:1)*(from*(1-u)+to*u);
  const camera=cameraForViewport(viewport.w,viewport.h,focus,zoom);
  return Object.freeze({ ...camera,focus,zoom,blend:u});
}

export function captionOpacity(local, reduced = false) {
  if (reduced) return 1;
  const p=clamp01(local);
  const incoming=smootherstep(clamp01(p/.085));
  const outgoing=1-smootherstep(clamp01((p-.87)/.13));
  return incoming*outgoing;
}

export function directorAt(progress, viewport, film, measured = {}, reduced = false) {
  const beat=locateBeat(progress,film.map(s=>s.weight));
  const shot=film[beat.index];
  const next=film[beat.index+1]||null;
  const pointer=pointerAt(shot,beat.local,measured,reduced);
  const camera=cameraPoseAt(beat.index,beat.local,film,viewport,reduced);
  return Object.freeze({
    beat,shot,next,pointer,camera,
    blend:reduced?0:camera.blend,
    caption:captionOpacity(beat.local,reduced),
  });
}

/** Reproject DOM-calibrated source point into the full-screen camera. */
export function pointOnScreen(point, camera) {
  return {x:camera.left+(point[0]/100)*ARTBOARD.width*camera.scale,
          y:camera.top+(point[1]/100)*ARTBOARD.height*camera.scale};
}

/** The measured registry is grounded in actual DOM node bounds, not copied
 * screenshot guesses. The rectangle must be measured inside the same artboard
 * coordinate system as the window. */
export function normalizeDomTarget(windowRect, nodeRect) {
  if (!windowRect || windowRect.width<=0 || windowRect.height<=0 || !nodeRect) return null;
  return Object.freeze({
    x:100*((nodeRect.left+nodeRect.width/2)-windowRect.left)/windowRect.width,
    y:100*((nodeRect.top+nodeRect.height/2)-windowRect.top)/windowRect.height,
    rect:{
      x:100*(nodeRect.left-windowRect.left)/windowRect.width,
      y:100*(nodeRect.top-windowRect.top)/windowRect.height,
      w:100*nodeRect.width/windowRect.width,
      h:100*nodeRect.height/windowRect.height,
    }
  });
}
