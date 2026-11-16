/** R3 M01+M02: scroll-linked homepage motion; native scrolling, no dependencies.
 * Progressive enhancement. Without this file the R2 homepage remains fully usable.
 * Desktop has a sticky, reversible 4-beat chapter. Touch/mobile/reduced-motion do not pin.
 */
(() => {
  'use strict';
  if (document.body?.dataset.page !== 'Home') return;
  const doc = document.documentElement;
  const hero = document.querySelector('.home-hero');
  const track = document.querySelector('[data-r3-services-track]');
  const stage = document.querySelector('.r3-services-stage');
  const tabs = Array.from(document.querySelectorAll('[data-service-select]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wide = window.matchMedia('(min-width: 960px)');
  const touch = window.matchMedia('(pointer: coarse)');
  const tall = window.matchMedia('(min-height: 650px)');
  if (!hero || !track || !stage || tabs.length !== 4) return;

  let mode = false;
  let index = 0;
  let queued = false;
  let geometry = null;
  const clamp = x => Math.min(1, Math.max(0, x));
  const measure = () => {
    // Resolve the real CSS sticky offset so the scroll timeline matches the
    // viewport-fitted chapter at every viewport height and zoom level.
    const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0;
    const absoluteTop = track.getBoundingClientRect().top + window.scrollY;
    const start = absoluteTop - stickyTop;
    const end = absoluteTop + track.offsetHeight - stage.offsetHeight - stickyTop;
    geometry = { start, range: Math.max(1, end - start) };
  };
  const update = () => {
    queued = false;
    if (!reduce.matches && wide.matches) {
      const heroRange = Math.max(1, hero.offsetHeight * .88);
      hero.style.setProperty('--r3-hero-p', clamp(window.scrollY / heroRange).toFixed(4));
    } else {
      hero.style.setProperty('--r3-hero-p', '0');
    }
    if (!mode || !geometry) return;
    const progress = clamp((window.scrollY - geometry.start) / geometry.range);
    track.style.setProperty('--r3-service-p', progress.toFixed(4));
    const newIndex = Math.min(3, Math.floor(progress * 4));
    if (newIndex !== index) {
      index = newIndex;
      // The existing tab activation logic remains the only state authority.
      tabs[index].click();
    }
  };
  const request = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };
  const syncMode = () => {
    mode = wide.matches && tall.matches && !reduce.matches && !touch.matches;
    doc.classList.toggle('r3-scroll-active', mode);
    track.style.removeProperty('--r3-service-p');
    if (mode) {
      measure();
      index = Math.max(0, tabs.findIndex(x => x.getAttribute('aria-selected') === 'true'));
    } else {
      geometry = null;
    }
    request();
  };
  const scrollToBeat = i => {
    if (!mode || !geometry) return;
    const target = geometry.start + ((i + .12) / 4) * geometry.range;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };
  // Trusted direct interactions can navigate to their corresponding scroll beat.
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', e => {
      if (e.isTrusted) { index = i; scrollToBeat(i); }
    });
    tab.addEventListener('keydown', e => {
      if (mode && e.isTrusted && /^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) {
        window.requestAnimationFrame(() => {
          const selected = tabs.findIndex(x => x.getAttribute('aria-selected') === 'true');
          if (selected >= 0) { index = selected; scrollToBeat(selected); }
        });
      }
    });
  });
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { syncMode(); });
  [wide, tall, reduce, touch].forEach(q => q.addEventListener?.('change', syncMode));
  // Image size changes and font loads can move the sticky track.
  document.fonts?.ready?.then(() => { if (mode) measure(); request(); });
  window.addEventListener('load', () => { if (mode) measure(); request(); }, { once: true });
  syncMode();
  if (!reduce.matches) window.requestAnimationFrame(() => doc.classList.add('r3-entered'));
})();
