/* Source checkout fallback. The isolated creative Vite build replaces this file
 * at preview-build time with the bundled React Bits + React Three Fiber + Lenis code.
 */
export function mountImmersive() {
  document.documentElement.dataset.forgeIslands = 'not-built';
  return {active:false,reason:'Run python scripts/build_immersive_r2.py to compile creative islands'};
}
