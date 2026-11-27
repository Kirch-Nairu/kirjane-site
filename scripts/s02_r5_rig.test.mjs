import test from 'node:test';
import assert from 'node:assert/strict';
import {reachDistance,rasterScale} from '../site/js/forge-handoff-chamber.js';
test('two-bone reach annulus',()=>{const L=.29,M=.333;assert.equal(reachDistance(.4,L,M),.4);assert.ok(Math.abs(reachDistance(10,L,M)-.622)<1e-12);assert.ok(Math.abs(reachDistance(0,L,M)-.044)<1e-12);assert.ok(Math.abs(reachDistance(.01,L,M)-.044)<1e-12);});

test('raster policy bounds pixel costs without phase or QA dependencies',()=>{for(const [w,h] of [[1440,900],[3840,2160],[390,844],[844,390]]){assert.ok(w*h*rasterScale(w,h,true)**2<=420000+.001);assert.ok(w*h*rasterScale(w,h,false)**2<=1050000+.001);assert.ok(rasterScale(w,h,true)<=rasterScale(w,h,false));}});
