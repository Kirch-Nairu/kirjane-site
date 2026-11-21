import test from "node:test";
import assert from "node:assert/strict";
import { ARTBOARD, cameraForViewport, phraseVisibility, beatClickPulse, revealAt } from "./camera.mjs";

test("cover camera fills viewport without black void at target resolutions", () => {
  for (const [width, height] of [[1920,1080],[1536,864],[1440,900],[1024,768],[768,1024],[390,844],[320,700]]) {
    for (const focus of [[5,10],[50,50],[95,95],[70,29]]) {
      const c = cameraForViewport(width,height,focus,1.12);
      assert.ok(c.scale>0 && c.artWidth >= width - 1e-7 && c.artHeight>=height - 1e-7);
      assert.ok(c.left<=1e-7 && c.top<=1e-7);
      assert.ok(c.left+c.artWidth>=width-1e-7 && c.top+c.artHeight>=height-1e-7);
      assert.deepEqual(c,cameraForViewport(width,height,focus,1.12));
    }
  }
});

test("camera source dimensions and multi-resolution crop are intentionally stable",()=>{
  assert.deepEqual(ARTBOARD,{width:920,height:555});
  assert.equal(cameraForViewport(390,844,[60,50]).mobile,true);
  assert.equal(cameraForViewport(1536,864,[60,50]).mobile,false);
});

test("text is readable at every scroll phase and pulse is reversible",()=>{
  for(let i=0;i<=100;i++)assert.ok(phraseVisibility(i/100)>=.88);
  assert.equal(beatClickPulse(0),0);
  assert.equal(beatClickPulse(1),0);
  assert.ok(beatClickPulse(.58)>.9);
  assert.equal(beatClickPulse(.58),beatClickPulse(.58));
});

test("typed UI state is a pure function of scroll",()=>{
  assert.equal(revealAt("NGM-1024",0),"");
  assert.equal(revealAt("NGM-1024",1),"NGM-1024");
  const first=revealAt("200.00",.54);
  assert.equal(first,revealAt("200.00",.54));
  assert.equal(revealAt("200.00",.4).length<=revealAt("200.00",.5).length,true);
});

import { SCREEN_SUBJECTS, storyFocus } from "./camera.mjs";

test("phone cinematic camera keeps critical receipts and stock operations centered", () => {
  assert.ok(SCREEN_SUBJECTS.receipt[0] > 50);
  for (const screen of ["receipt","inventory","stockin","reports","audit","checkout-tender"]) {
    const focus=storyFocus(screen,[5,5],390);
    const c=cameraForViewport(390,844,focus,1.10);
    const focusPx=focus[0]/100*ARTBOARD.width*c.scale+c.left;
    assert.ok(focusPx>=0 && focusPx<=390,screen+" focus is off the phone frame");
    const center=cameraForViewport(390,844,SCREEN_SUBJECTS[screen],1.10);
    assert.ok(center.artWidth>390);
  }
});

test("story focus is deterministic and weights user action more on desktop",()=>{
  const target=[80,72];
  const mobile=storyFocus("receipt",target,390);
  const desktop=storyFocus("receipt",target,1536);
  assert.deepEqual(mobile,storyFocus("receipt",target,390));
  assert.ok(Math.abs(desktop[0]-target[0])<Math.abs(mobile[0]-target[0]));
});

import { transitionMix } from "./camera.mjs";

test("semantic transitions blend only near boundary and reverse identically",()=>{
  assert.equal(transitionMix(0),0);
  assert.equal(transitionMix(.5),0);
  assert.equal(transitionMix(.83),0);
  assert.equal(transitionMix(1),1);
  assert.ok(transitionMix(.92)>0 && transitionMix(.92)<1);
  assert.equal(transitionMix(.92),transitionMix(.92));
});
