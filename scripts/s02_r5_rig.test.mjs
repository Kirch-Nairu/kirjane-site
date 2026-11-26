import test from 'node:test';
import assert from 'node:assert/strict';
import {reachDistance} from '../site/js/forge-handoff-chamber.js';
test('two-bone reach annulus',()=>{const L=.29,M=.333;assert.equal(reachDistance(.4,L,M),.4);assert.ok(Math.abs(reachDistance(10,L,M)-.622)<1e-12);assert.ok(Math.abs(reachDistance(0,L,M)-.044)<1e-12);assert.ok(Math.abs(reachDistance(.01,L,M)-.044)<1e-12);});
