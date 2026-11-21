import test from 'node:test';
import assert from 'node:assert/strict';
import {clarityPhase} from '../site/js/forge-cinematic-tokens.js';
test('frame phase never reverses during forward scroll and retains endpoints',()=>{
 assert.equal(clarityPhase(0),0);assert.equal(clarityPhase(1),1);
 let last=0;for(let i=0;i<=10000;i++){const value=clarityPhase(i/10000);assert.ok(value>=last&&value<=1);last=value;}
});
test('re-seeking a frame is history-independent and malformed input stays finite',()=>{
 for(const value of [NaN,Infinity,-Infinity,undefined,-1,2])assert.ok(Number.isFinite(clarityPhase(value)));
 const a=[.7,.2,.9,.2].map(clarityPhase);assert.equal(a[1],a[3]);
});
