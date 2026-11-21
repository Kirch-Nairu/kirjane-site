// Pure scroll-film director. No clock, network, DOM, browser, or mutable global state.
export const clamp01 = (value) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

export function smootherstep(t) {
  const u = clamp01(t);
  return u * u * u * (u * (u * 6 - 15) + 10);
}

export function locateBeat(progress, weights) {
  if (!Array.isArray(weights) || weights.length < 1 || weights.some((w) => !Number.isFinite(w) || w <= 0)) {
    throw new Error("At least one finite positive beat weight is required.");
  }
  const total = weights.reduce((acc, w) => acc + w, 0);
  const absolute = clamp01(progress) * total;
  let start = 0;
  for (let index = 0; index < weights.length; index++) {
    const end = start + weights[index];
    if (absolute < end || index === weights.length - 1) {
      const local = clamp01((absolute - start) / weights[index]);
      return Object.freeze({
        index, local, eased: smootherstep(local),
        startFraction: start / total, endFraction: end / total,
      });
    }
    start = end;
  }
  throw new Error("Unreachable director state.");
}

export function bezierPoint(points, value) {
  if (!Array.isArray(points) || points.length !== 4 || points.some((p) => !Array.isArray(p) || p.length !== 2)) {
    throw new Error("A cubic cursor curve needs four [x, y] points.");
  }
  const t = clamp01(value), q = 1 - t;
  const a = q * q * q, b = 3 * q * q * t, c = 3 * q * t * t, d = t * t * t;
  return [a * points[0][0] + b * points[1][0] + c * points[2][0] + d * points[3][0],
          a * points[0][1] + b * points[1][1] + c * points[2][1] + d * points[3][1]];
}

export function cursorAtArcFraction(points, fraction, segments = 80) {
  const count = Math.max(10, Math.min(512, Math.floor(segments)));
  const samples = [];
  let total = 0, previous = bezierPoint(points, 0);
  samples.push({ t: 0, distance: 0 });
  for (let i = 1; i <= count; i++) {
    const t = i / count, current = bezierPoint(points, t);
    total += Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    samples.push({ t, distance: total });
    previous = current;
  }
  const target = clamp01(fraction) * total;
  if (total === 0) return points[0].slice();
  let lo = 0, hi = count;
  while (hi - lo > 1) {
    const mid = Math.floor((hi + lo) / 2);
    if (samples[mid].distance < target) lo = mid;
    else hi = mid;
  }
  const a = samples[lo], b = samples[hi];
  const f = b.distance > a.distance ? (target - a.distance) / (b.distance - a.distance) : 0;
  return bezierPoint(points, a.t + (b.t - a.t) * f);
}

export function cursorBetween(start, end, progress) {
  const dx = end[0] - start[0], dy = end[1] - start[1];
  const curve = [start, [start[0] + dx * 0.31, start[1] + dy * 0.07 - 4],
    [start[0] + dx * 0.73, start[1] + dy * 0.84 - 2], end];
  return cursorAtArcFraction(curve, smootherstep(progress));
}

export function fictionalLedger() {
  // Integer units and cents. These are fictional values ONLY.
  const stockBefore = 30, sold = 2, received = 5, adjusted = -1;
  const priceCents = 8500, openingCents = 50000, tenderCents = 20000;
  const saleCents = sold * priceCents;
  return Object.freeze({
    stockBefore, sold, stockAfterSale: stockBefore - sold,
    stockAfterReceive: stockBefore - sold + received,
    stockFinal: stockBefore - sold + received + adjusted,
    saleCents, openingCents, tenderCents,
    changeCents: tenderCents - saleCents,
    expectedCashCents: openingCents + saleCents,
    countedCashCents: openingCents + saleCents,
    varianceCents: 0,
  });
}
