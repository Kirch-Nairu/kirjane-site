/* Kirjane Creative Forge R1: side-effect-free unless explicitly enabled. */
const current = new URL(location.href);
const lab = /\/motion-lab\/?(?:index\.html)?$/.test(current.pathname);
const optIn = current.searchParams.get('creative') === '1';
if (lab || optIn) {
  import('./creative-studies-r1.js').then(({ startCreativeStudies }) => {
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) startCreativeStudies();
    });
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startCreativeStudies, { once: true });
    } else {
      startCreativeStudies();
    }
  }).catch((error) => {
    console.error('[Creative Forge R1] Noncritical study failed; baseline remains available.', error);
    document.documentElement.classList.remove('creative-experiment');
  });
}
