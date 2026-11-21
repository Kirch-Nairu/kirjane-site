import test from 'node:test';
import assert from 'node:assert/strict';
import {clarityPhase,cinematicGrade} from '../site/js/forge-cinematic-tokens.js';
test('frame phase never reverses during forward scroll and retains endpoints',()=>{
 assert.equal(clarityPhase(0),0);assert.equal(clarityPhase(1),1);
 let last=0;for(let i=0;i<=10000;i++){const value=clarityPhase(i/10000);assert.ok(value>=last&&value<=1);last=value;}
});
test('re-seeking a frame is history-independent and malformed input stays finite',()=>{
 for(const value of [NaN,Infinity,-Infinity,undefined,-1,2])assert.ok(Number.isFinite(clarityPhase(value)));
 const a=[.7,.2,.9,.2].map(clarityPhase);assert.equal(a[1],a[3]);
});

test('camera grades stay bounded and seek identically in either direction',()=>{
 for(const kind of ['home','kernel'])for(const mobile of [true,false]){
  for(let i=0;i<=1000;i++){
   const g=cinematicGrade(i/1000,kind,mobile);
   assert.ok(g.scale>=1&&g.scale<=1.07);assert.ok(Math.abs(g.x)<=1&&Math.abs(g.y)<=1);
   assert.ok(g.brightness>=1&&g.brightness<=1.25);
  }
  const a=cinematicGrade(.31,kind,mobile);cinematicGrade(.9,kind,mobile);
  assert.deepEqual(a,cinematicGrade(.31,kind,mobile));
 }
});
