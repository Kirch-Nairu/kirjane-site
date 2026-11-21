import test from "node:test";
import assert from "node:assert/strict";
import { clamp01, smootherstep, locateBeat, cursorAtArcFraction, cursorBetween, fictionalLedger } from "./math.mjs";

test("clip and C2 endpoint properties of smootherstep", () => {
  assert.equal(clamp01(-3), 0); assert.equal(clamp01(8), 1);
  assert.equal(smootherstep(0), 0); assert.equal(smootherstep(1), 1);
  const h = 1e-4;
  assert.ok(smootherstep(h) < 1e-9);
  assert.ok(1 - smootherstep(1 - h) < 1e-9);
  for (let i = 1; i <= 100; i++) assert.ok(smootherstep(i / 100) >= smootherstep((i - 1) / 100));
});
test("beat boundaries use deterministic half-open intervals", () => {
  assert.deepEqual([locateBeat(0, [1, 2]).index, locateBeat(1/3, [1, 2]).index, locateBeat(1, [1, 2]).index], [0, 1, 1]);
  assert.equal(locateBeat(1, [1, 2]).local, 1);
  assert.throws(() => locateBeat(0.5, [1, 0]));
});
test("random seeks are independent of history and reversing restores state", () => {
  const ws = [1, 1.5, 2, 0.7, 1.8];
  const sequence = [0, 0.12, 0.76, 0.48, 0.96, 0.12, 0];
  const results = sequence.map((p) => locateBeat(p, ws));
  assert.deepEqual(results[1], results[5]);
  assert.deepEqual(results[0], results[6]);
  for (const p of sequence) assert.deepEqual(locateBeat(p, ws), locateBeat(p, ws));
});
test("curve arc fraction endpoints and normalized cursor are reversible", () => {
  const curve = [[10, 12], [13, 0], [36, 43], [80, 78]];
  assert.deepEqual(cursorAtArcFraction(curve, 0), curve[0]);
  assert.deepEqual(cursorAtArcFraction(curve, 1), curve[3]);
  const a = cursorBetween([2, 8], [72, 68], 0.42);
  const b = cursorBetween([2, 8], [72, 68], 0.42);
  assert.deepEqual(a, b);
});
test("fictional Salryn figures obey exact integer accounting and inventory arithmetic", () => {
  const s = fictionalLedger();
  assert.equal(s.stockAfterSale, 28);
  assert.equal(s.stockAfterReceive, 33);
  assert.equal(s.stockFinal, 32);
  assert.equal(s.saleCents, 17000);
  assert.equal(s.changeCents, 3000);
  assert.equal(s.expectedCashCents, 67000);
  assert.equal(s.countedCashCents - s.expectedCashCents, s.varianceCents);
});
