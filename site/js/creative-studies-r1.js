/**
 * KIRJANE Creative Forge R1 — opt-in studies and deterministic motion lifecycle.
 * Zero third-party remote script execution. GSAP is already vendored by the source.
 * The commercial site remains static; this module is only loaded with ?creative=1
 * or within /motion-lab/. See docs/MOTION_ARSENAL_R1.md for release gates.
 */
import gsap from '../vendor/gsap/index.js';
import { ScrollTrigger } from '../vendor/gsap/ScrollTrigger.js';
gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(pointer: fine)');
const wide = matchMedia('(min-width: 960px)');
const forcedReduced = new URLSearchParams(location.search).get('reduce') === '1';
function motionReduced() { return reduce.matches || forcedReduced; }
const stopped = [];
const sceneRecords = [];
let context;
let active = false;

function register(fn) { stopped.push(fn); }
function listen(el, event, cb, options) {
  el?.addEventListener(event, cb, options);
  register(() => el?.removeEventListener(event, cb, options));
}
function animateFrom(el, options) {
  if (el && !motionReduced()) gsap.from(el, options);
}
function scrollTo(el, props) {
  if (!el || motionReduced()) return;
  gsap.to(el, { ...props, overwrite: 'auto' });
}
function record(name, scope) { sceneRecords.push({ name, scope }); }
function allowMotion() { return !motionReduced() && !document.hidden; }

function setupLayeredParallax(root) {
  const scene = root.querySelector('[data-study="01"]');
  if (!scene) return;
  scene.querySelectorAll('[data-depth]').forEach((layer) => {
    const depth = Math.min(.6, Math.max(-.6, Number(layer.dataset.depth) || .1));
    scrollTo(layer, {
      yPercent: depth * -58, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: .65 }
    });
  });
  record('01 Layered parallax', 'Lab');
}
function setupPinnedHeading(root) {
  const scene = root.querySelector('[data-study="02"]');
  const heading = scene?.querySelector('.study-pin-heading');
  if (!scene || !heading || !allowMotion()) return;
  // Revert pin immediately when crossing tablet/touch/reduced-motion boundaries.
  const media = gsap.matchMedia();
  media.add('(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    if (motionReduced()) return;
    ScrollTrigger.create({
      trigger: scene, start: 'top top+=100', end: 'bottom bottom-=100',
      pin: heading, pinSpacing: false, anticipatePin: 1, invalidateOnRefresh: true
    });
  });
  register(() => media.revert());
  record('02 Pinned heading', 'Lab, desktop only');
}
function setupCutaway(root) {
  const scene = root.querySelector('[data-study="03"]');
  const slab = scene?.querySelector('.study-cutaway-plane');
  if (!scene || !slab || !allowMotion()) return;
  gsap.fromTo(slab, { rotateY: -11, rotateX: 9, scale: .84 },
    { rotateY: 0, rotateX: 0, scale: 1.07, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top 88%', end: 'bottom 35%', scrub: .8 } });
  record('03 Guided cutaway zoom', 'Lab');
}
function setupLineReveal(root) {
  root.querySelectorAll('[data-study="04"] .study-line').forEach((line) => {
    if (!allowMotion()) return;
    gsap.fromTo(line, { y: 26, opacity: .36 }, {
      y: 0, opacity: 1, duration: .6, ease: 'power3.out', clearProps: 'opacity,transform',
      scrollTrigger: { trigger: line, start: 'top 90%', once: true }
    });
  });
  record('04 Accessible line reveals', 'Lab');
}
function setupSideways(root) {
  const scene = root.querySelector('[data-study="05"]');
  const passage = scene?.querySelector('.study-sideways-text');
  if (!scene || !passage || !allowMotion()) return;
  gsap.fromTo(passage, { xPercent: 10 }, { xPercent: -12, ease: 'none',
    scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  record('05 Sideways editorial interlude', 'Lab');
}
function setupArc(root) {
  const scene = root.querySelector('[data-study="06"]');
  if (!scene) return;
  const cards = Array.from(scene.querySelectorAll('.study-arc-card'));
  const prev = scene.querySelector('[data-arc-prev]');
  const next = scene.querySelector('[data-arc-next]');
  const status = scene.querySelector('[data-arc-status]');
  let selected = 0;
  function paint() {
    cards.forEach((card, i) => {
      const d = i - selected;
      card.style.setProperty('--arc-x', String(d * 76) + '%');
      card.style.setProperty('--arc-y', String(Math.min(3, Math.abs(d)) * 20) + 'px');
      card.style.setProperty('--arc-r', String(d * 10) + 'deg');
      card.style.setProperty('--arc-scale', String(Math.max(.72, 1 - Math.abs(d) * .1)));
      card.style.zIndex = String(10 - Math.abs(d));
      card.setAttribute('aria-hidden', String(i !== selected));
      card.inert = i !== selected;
    });
    if (status) status.textContent = 'Study ' + (selected + 1) + ' of ' + cards.length;
    prev.disabled = selected === 0;
    next.disabled = selected === cards.length - 1;
  }
  const move = (by) => { selected = Math.max(0, Math.min(cards.length - 1, selected + by)); paint(); };
  listen(prev, 'click', () => move(-1));
  listen(next, 'click', () => move(1));
  listen(scene, 'keydown', (e) => {
    if (e.target.closest('button')) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(e.key === 'ArrowLeft' ? -1 : 1); }
  });
  paint();
  register(() => cards.forEach(c => { c.inert = false; c.removeAttribute('aria-hidden'); }));
  record('06 Accessible arc exhibition', 'Lab');
}
function setupKernel(root) {
  const scene = root.querySelector('[data-study="07"]');
  const kernel = scene?.querySelector('.study-kernel-model');
  if (!scene || !kernel || !allowMotion()) return;
  gsap.fromTo(kernel, { rotateY: -12, rotateX: 7, yPercent: -5 },
    { rotateY: 12, rotateX: -7, yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: .8 } });
  record('07 Fixed model proxy using existing art (R3F gated)', 'Lab');
}
function setupStack(root) {
  const scene = root.querySelector('[data-study="08"]');
  if (!scene || !allowMotion() || !fine.matches || !wide.matches) return;
  scene.querySelectorAll('.study-stack-step').forEach((el, i) => {
    gsap.fromTo(el, { y: 48 + 10 * i, rotate: i % 2 ? -1.4 : 1.4 },
      { y: 0, rotate: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 30%', scrub: .65 } });
  });
  record('08 Workflow stack', 'Lab');
}
function setupFocus(root) {
  const scene = root.querySelector('[data-study="09"]');
  if (!scene) return;
  const images = Array.from(scene.querySelectorAll('.study-focus-item'));
  const previous = scene.querySelector('[data-focus-prev]');
  const following = scene.querySelector('[data-focus-next]');
  const label = scene.querySelector('[data-focus-status]');
  let i = 0;
  let touchX = null;
  const paint = () => {
    images.forEach((el, index) => {
      el.hidden = index !== i;
      el.setAttribute('aria-hidden', String(index !== i));
    });
    if (label) label.textContent = (i + 1) + ' / ' + images.length + ' — ' + (images[i]?.dataset.caption || '');
    previous.disabled = i === 0;
    following.disabled = i === images.length - 1;
  };
  const move = (by) => { i = Math.max(0, Math.min(images.length - 1, i + by)); paint(); };
  listen(previous, 'click', () => move(-1));
  listen(following, 'click', () => move(1));
  listen(scene, 'keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(e.key === 'ArrowLeft' ? -1 : 1); }
  });
  const region = scene.querySelector('.study-focus-window');
  listen(region, 'touchstart', (e) => { touchX = e.changedTouches[0]?.screenX ?? null; }, { passive: true });
  listen(region, 'touchend', (e) => {
    if (touchX === null) return;
    const dx = (e.changedTouches[0]?.screenX ?? touchX) - touchX;
    touchX = null;
    if (Math.abs(dx) > 45) move(dx < 0 ? 1 : -1);
  }, { passive: true });
  paint();
  record('09 Focus-frame viewer with keyboard and touch', 'Lab');
}
function setupProductDemo(root) {
  const scene = root.querySelector('[data-study="10"]');
  if (!scene) return;
  const steps = Array.from(scene.querySelectorAll('.study-demo-step'));
  const announce = scene.querySelector('[data-demo-status]');
  const replay = scene.querySelector('[data-demo-replay]');
  const advance = scene.querySelector('[data-demo-advance]');
  let index = 0;
  const paint = (next, manual) => {
    index = Math.max(0, Math.min(steps.length - 1, next));
    steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
    if (announce && manual) announce.textContent = 'Step ' + (index + 1) + ' of ' + steps.length + ': ' + steps[index].textContent.trim();
  };
  listen(replay, 'click', () => paint(0, true));
  listen(advance, 'click', () => paint((index + 1) % steps.length, true));
  paint(0, false);
  if (allowMotion()) {
    ScrollTrigger.create({
      trigger: scene, start: 'top 75%', end: 'bottom 25%',
      onUpdate: self => paint(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)), false)
    });
  }
  record('10 Scroll narrative + manual replay', 'Lab');
}
function initLab() {
  const root = document.querySelector('[data-motion-lab]');
  if (!root) return;
  const boot = [setupLayeredParallax,setupPinnedHeading,setupCutaway,setupLineReveal,
    setupSideways,setupArc,setupKernel,setupStack,setupFocus,setupProductDemo];
  boot.forEach(fn => fn(root));
  const toggle = document.getElementById('lab-motion-toggle');
  const setState = () => {
    document.documentElement.classList.toggle('study-reduced', motionReduced());
    if (toggle) toggle.textContent = motionReduced() ? 'System requests reduced motion' : 'Motion enabled';
  };
  setState();
  listen(reduce, 'change', setState);
}
function initSiteStudies() {
  // All site treatments are opt-in. No new pages, hidden text, focus trap, or canvas.
  const page = document.body.dataset.page || location.pathname.split('/').filter(Boolean).at(-1)?.replace('.html', '') || 'home';
  document.documentElement.classList.add('creative-experiment');
  register(() => document.documentElement.classList.remove('creative-experiment'));
  if (!allowMotion()) return;
  if (page === 'home') {
    const hero = document.querySelector('.home-hero');
    const scrim = hero?.querySelector('.hero-scrim');
    const caption = hero?.querySelector('.hero-ethos');
    if (scrim) scrollTo(scrim, { opacity: .72, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } });
    if (caption) scrollTo(caption, { y: -22, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } });
    record('01 Home spatial parallax (existing artwork)', 'Home');
  } else if (page === 'about') {
    document.querySelectorAll('.about-reading p').forEach(p => {
      gsap.fromTo(p, { clipPath: 'inset(0 0 15% 0)', opacity: .65 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: .7, clearProps: 'clipPath,opacity',
          scrollTrigger: { trigger: p, start: 'top 92%', once: true } });
    });
    record('04 About editorial reading reveals', 'About');
  } else if (page === 'salryn') {
    const scene = document.querySelector('#scene-b-anatomy');
    const art = scene?.querySelector('.anatomy-bg-plate');
    if (art) scrollTo(art, { scale: 1.07, rotate: 1, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top 85%', end: 'bottom 15%', scrub: 1 } });
    record('03 Salryn cutaway plate (existing scene)', 'Salryn');
  } else if (page === 'services') {
    const scene = document.querySelector('#process-automation');
    const art = scene?.querySelector('.asc-workflow-scene img');
    if (art) scrollTo(art, { scale: 1.04, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    record('08 Services workflow-depth study', 'Services');
  } else if (page === 'projects') {
    const gallery = document.querySelector('.projects-gallery');
    const panels = gallery?.querySelectorAll('article') || [];
    panels.forEach((p, i) => {
      gsap.fromTo(p, { y: 20 + i * 4 }, { y: 0, ease: 'none',
        scrollTrigger: { trigger: p, start: 'top bottom', end: 'top 45%', scrub: .6 } });
    });
    record('09 Projects gallery spatial entries', 'Projects');
  } else if (page === 'process') {
    const map = document.querySelector('.asc-process-map img');
    if (map) scrollTo(map, { scale: 1.035, ease: 'none',
      scrollTrigger: { trigger: '#process-journey', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    record('02 Process editorial anchor depth', 'Process');
  } else if (page === 'contact') {
    const form = document.querySelector('.contact-brief');
    if (form) animateFrom(form, { opacity: .65, y: 16, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity' });
    record('Contact restrained form emergence', 'Contact');
  }
}
export function startCreativeStudies() {
  if (active) return;
  active = true;
  // GSAP Context scopes every tween and ScrollTrigger created by the studies.
  // context.revert() restores original inline styles without touching existing site timelines.
  context = gsap.context(() => {
    if (document.querySelector('[data-motion-lab]')) initLab();
    else initSiteStudies();
  }, document);
  window.__KIRJANE_MOTION_R1__ = { version: 'R1', scenes: sceneRecords, stop };
  listen(window, 'pagehide', stop);
  listen(reduce, 'change', () => {
    // Restore original styles and rebuild only the opt-in study when OS preference changes.
    stop();
    startCreativeStudies();
  });
  // Do not stop the global GSAP ticker: the accepted site also uses it.
  // Browser visibility suspension is handled natively by the animation platform.
}
export function stop() {
  if (!active) return;
  active = false;
  for (const fn of stopped.splice(0)) { try { fn(); } catch {} }
  context?.revert();
  context = null;
  sceneRecords.splice(0);
  delete window.__KIRJANE_MOTION_R1__;
}
