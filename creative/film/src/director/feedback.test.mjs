import test from "node:test";
import assert from "node:assert/strict";
import {ACTS} from "../scenes/manifest.js";
import {ACTIONS} from "./precision.mjs";
import {CLICK_CUE_AT, tactileAt, isClickKind, shouldSoundClick} from "./feedback.mjs";

const frame=(id,local,visible=true)=>({
  shotId:id,local,kind:ACTIONS[id].kind,
  targetId:ACTIONS[id].target??null,visible
});

test("only two real scripted actions are clicks; no fake receipt or audit clicks",()=>{
  const clicks=ACTS.filter(s=>isClickKind(ACTIONS[s.id].kind)).map(s=>s.id);
  assert.deepEqual(clicks,["shift-gate","review"]);
  for(const s of ACTS.filter(s=>!clicks.includes(s.id))){
    assert.deepEqual(tactileAt(.84,ACTIONS[s.id].kind,true),
      {press:0,ripple:0,ringOpacity:0,glint:0});
  }
});

test("press reaches peak before release; ring expands and decays, without clock timers",()=>{
  const a=tactileAt(.7,"CLICK",true);
  const down=tactileAt(.81,"CLICK",true);
  const released=tactileAt(.91,"CLICK",true);
  assert.equal(a.press,0);assert.equal(a.ringOpacity,0);
  assert.ok(down.press>.9);assert.ok(down.glint>.1);
  assert.ok(released.press<.01);assert.ok(released.ripple>.99);
  for(let k=0;k<=100;k++){
    const r=tactileAt(k/100,"TYPE_CLICK",true);
    for(const value of Object.values(r))assert.ok(Number.isFinite(value)&&value>=0&&value<=1);
  }
  assert.deepEqual(tactileAt(.85,"CLICK",true),tactileAt(.85,"CLICK",true));
  assert.deepEqual(tactileAt(.85,"CLICK",false),{press:0,ripple:0,ringOpacity:0,glint:0});
});

test("sound is OFF without active opt-in and never retroactively fires when enabled",()=>{
  assert.equal(shouldSoundClick(frame("review",.79),frame("review",.81)),false);
  assert.equal(shouldSoundClick(null,frame("review",.81),{enabled:true}),false);
  assert.equal(shouldSoundClick(frame("review",.80),frame("review",.81),{enabled:true}),false);
});

test("sound plays only on small forward crossing of a measured click",()=>{
  assert.equal(shouldSoundClick(frame("review",.75),frame("review",.83),{enabled:true}),true);
  assert.equal(shouldSoundClick(frame("shift-gate",.75),frame("shift-gate",.84),{enabled:true}),true);
  assert.equal(shouldSoundClick(frame("review",.75),frame("review",.83,false),{enabled:true}),false);
  assert.equal(shouldSoundClick(frame("review",.75),frame("review",.83),{enabled:true,heard:true}),false);
  assert.equal(shouldSoundClick(frame("review",.75),frame("review",.83),{enabled:true,pageVisible:false}),false);
  assert.equal(shouldSoundClick(frame("review",.75),frame("review",.83),{enabled:true,reduced:true}),false);
});

test("reverse scroll, timeline jumps and scene boundaries NEVER trigger audio",()=>{
  const options={enabled:true};
  assert.equal(shouldSoundClick(frame("review",.87),frame("review",.71),options),false);
  assert.equal(shouldSoundClick(frame("review",.20),frame("review",.99),options),false);
  assert.equal(shouldSoundClick(frame("tender",.77),frame("review",.81),options),false);
  assert.equal(shouldSoundClick(frame("receipt",.70),frame("receipt",.90),options),false);
  assert.equal(shouldSoundClick(frame("scan",.75),frame("scan",.81),options),false);
  assert.equal(shouldSoundClick(frame("review",.77),frame("review",.81),{enabled:true,heard:true}),false);
});

test("each authored click has a valid threshold inside the exact pointer hold",()=>{
  assert.ok(CLICK_CUE_AT>.78 && CLICK_CUE_AT<.92);
  assert.equal(isClickKind("TYPE"),false);
  assert.equal(isClickKind("HOLD"),false);
});
