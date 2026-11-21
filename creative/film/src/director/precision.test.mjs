import test from "node:test";
import assert from "node:assert/strict";
import {ACTS} from "../scenes/manifest.js";
import {ACTIONS,pointerAt,PRIMARY_CLICK_PHASE,cameraPoseAt,captionOpacity,directorAt,normalizeDomTarget,pointOnScreen} from "./precision.mjs";

const screens={};
for (const scene of ACTS) {
  screens[scene.screen]??={};
  const action=ACTIONS[scene.id];
  if(action?.target) screens[scene.screen][action.target]={x:60,y:50};
  if(action?.entry) screens[scene.screen][action.entry]={x:42,y:42};
}

test("all 23 shots have explicit semantic action contracts",()=>{
  assert.equal(ACTS.length,23);
  for(const shot of ACTS) {
    assert.ok(ACTIONS[shot.id],"action absent: "+shot.id);
    assert.ok(["HOLD","FOCUS","TYPE","CLICK","TYPE_CLICK"].includes(ACTIONS[shot.id].kind));
    if(["CLICK","TYPE_CLICK"].includes(ACTIONS[shot.id].kind)) assert.ok(ACTIONS[shot.id].target);
  }
});

test("passive scenes never show cursors or phantom clicks",()=>{
  for(const shot of ACTS.filter(x=>ACTIONS[x.id].kind==="HOLD")){
    for(const local of [.1,.45,.55,.86,.97]){
      const p=pointerAt(shot,local,screens);
      assert.equal(p.visible,false,shot.id);
      assert.equal(p.pulse,0,shot.id);
    }
  }
});

test("cursor destination is the measured UI target at click phase",()=>{
  for(const shot of ACTS.filter(x=>["CLICK","TYPE_CLICK"].includes(ACTIONS[x.id].kind))){
    const p=pointerAt(shot,PRIMARY_CLICK_PHASE,screens);
    assert.equal(p.visible,true);
    assert.ok(Math.abs(p.x-60)<1e-5,shot.id+" x");
    assert.ok(Math.abs(p.y-50)<1e-5,shot.id+" y");
    assert.equal(p.targetId,ACTIONS[shot.id].target);
  }
});

test("missing calibration hides cursor instead of clicking an invented coordinate",()=>{
  for(const shot of ACTS){
    const p=pointerAt(shot,.82,{});
    assert.equal(p.visible,false);
    assert.equal(p.pulse,0);
  }
});

test("all 22 joined camera paths preserve exactly the same boundary transform",()=>{
  const dimensions=[[1440,900],[390,844],[320,700],[1684,1798],[2880,1800]];
  for(const [w,h] of dimensions)
    for(let index=0;index<ACTS.length-1;index++){
      const end=cameraPoseAt(index,1,ACTS,{w,h});
      const start=cameraPoseAt(index+1,0,ACTS,{w,h});
      for(const field of ["left","top","scale","zoom"])
        assert.ok(Math.abs(end[field]-start[field])<1e-8,
          "boundary "+index+" / "+field+" ("+w+"x"+h+")");
    }
});

test("complete film can be sought in random order without history-dependent changes",()=>{
  const v={w:1684,h:1798};
  const seq=[.83,.24,.91,.001,.83,1,.24,0];
  const states=seq.map(p=>directorAt(p,v,ACTS,screens));
  assert.deepEqual(states[0],states[4]);
  assert.deepEqual(states[1],states[6]);
});

test("reduced motion hides pointer and removes camera choreography",()=>{
  const s=directorAt(.5,{w:390,h:844},ACTS,screens,true);
  assert.equal(s.pointer.visible,false);
  assert.equal(s.blend,0);
  assert.equal(s.caption,1);
});

test("caption fade is continuous and legible at a scene midpoint",()=>{
  assert.equal(captionOpacity(0),0);
  assert.equal(captionOpacity(1),0);
  assert.equal(captionOpacity(.5),1);
});

test("DOM calibration maps exact measured button center through camera transform",()=>{
  const r=normalizeDomTarget({left:40,top:30,width:920,height:555},
    {left:500,top:307.5,width:100,height:50});
  assert.ok(r);
  assert.equal(r.x,100*510/920 + 100*0/920-100*0/920); // (550-40)/920
  assert.equal(r.y,100*302.5/555);
  const pose=cameraPoseAt(9,.5,ACTS,{w:1440,h:900});
  const q=pointOnScreen([r.x,r.y],pose);
  assert.ok(Number.isFinite(q.x) && Number.isFinite(q.y));
});
