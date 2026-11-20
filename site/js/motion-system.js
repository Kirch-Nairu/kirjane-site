/**
 * Kirjane Living Topography — Five-Phase Cinematic Motion & Transition System (Stage 04 R2)
 *
 * Implements a structured five-phase motion vocabulary:
 *   1. Anticipation  — Hairline horizon rule expansion & subtle optical pre-illumination
 *   2. Emergence     — Masked typography choreography & counter-scaled sculptural aperture reveals
 *   3. Transformation— Scroll-coupled parallax, SVG cubic streamline draw-on & optical rim tracking
 *   4. Continuity    — Cross-page View Transition / optical curtain (preserving Back/Forward & anchors)
 *   5. Resolution    — Deterministic clearProps cleanup & zero-layout-shift settling
 *
 * Honors prefers-reduced-motion (?reduce=1) and coarse-pointer touch constraints.
 */
import gsap from '../vendor/gsap/index.js';
import { ScrollTrigger } from '../vendor/gsap/ScrollTrigger.js';
import { initKirjaneLogoReveal } from './kirjane-logo-reveal.js';

gsap.registerPlugin(ScrollTrigger);

export const MOTION_TOKENS = {
  easeAnticipate: 'power2.inOut',
  easeEmerge: 'power4.out',
  easeSculptural: 'expo.out',
  easeResolve: 'power3.out',
  durFast: 0.36,
  durMedium: 0.64,
  durSculptural: 0.96
};

export function isReducedMotion() {
  const params = new URLSearchParams(location.search);
  return params.get('reduce') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initSiteShell(activePage) {
  // Directory build aliases use a root asset base. Keep local fragment links
  // on the exact current URL, including inquiry query state, without a reload.
  document.querySelectorAll('a[data-local-fragment]').forEach((link) => {
    const target = new URL(location.href);
    target.hash = link.dataset.localFragment;
    link.href = target.href;
  });
  const header = document.getElementById('site-header');
  if (header) {
    const syncHeader = () => header.classList.toggle('scrolled', window.scrollY > 28);
    window.addEventListener('scroll', syncHeader, { passive: true });
    syncHeader();
  }

  // Highlight active page links across desktop nav, mobile dock, and mobile drawer
  document.querySelectorAll(`[data-page="${activePage}"]`).forEach((el) => {
    el.setAttribute('aria-current', 'page');
  });

  // Accessible full-screen mobile navigation sheet with choreographed staggered links
  const openBtn = document.getElementById('btn-mobile-menu');
  const closeBtn = document.getElementById('btn-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  let closeDrawer = () => {};
  if (openBtn && drawer) {
    const links = drawer.querySelectorAll('.drawer-links a');
    const reduced = isReducedMotion();
    drawer.inert = true;
    const setOpen = (open) => {
      drawer.classList.toggle('open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      drawer.inert = !open;
      openBtn.setAttribute('aria-expanded', String(open));
      if (open && !reduced && links.length) {
        gsap.fromTo(
          links,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.42, stagger: 0.045, ease: MOTION_TOKENS.easeEmerge, clearProps: 'transform,opacity' }
        );
      }
      if (open && closeBtn) closeBtn.focus();
      else if (!open) openBtn.focus();
    };
    closeDrawer = () => {
      if (drawer.classList.contains('open')) setOpen(false);
    };
    openBtn.addEventListener('click', () => setOpen(true));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    window.addEventListener('keydown', (e) => {
      if (!drawer.classList.contains('open')) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key !== 'Tab' || !document.body.hasAttribute('data-editorial')) return;
      const controls = Array.from(drawer.querySelectorAll('a[href],button:not([disabled])'));
      const first = controls[0];
      const last = controls.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  initElevationSpine();
  initPageTransitions(closeDrawer);
  initOpticalSurfaceTracking();
  initKirjaneLogoReveal();
}

function initElevationSpine() {
  if (document.querySelector('.topo-elevation-spine')) return;
  const spine = document.createElement('div');
  spine.className = 'topo-elevation-spine';
  spine.setAttribute('aria-hidden', 'true');
  spine.innerHTML = '<div class="topo-elevation-fill" id="topo-elevation-fill"></div>';
  document.body.appendChild(spine);

  const fill = spine.querySelector('#topo-elevation-fill');
  const update = () => {
    const maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(1, Math.max(0, window.scrollY / maxS));
    fill.style.transform = `scaleY(${pct.toFixed(4)})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initPageTransitions(closeDrawer) {
  // Always ensure page shell is visible on bfcache restore (Back/Forward navigation)
  window.addEventListener('pageshow', () => {
    document.documentElement.classList.remove('is-transitioning-out');
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const rawHref = link.getAttribute('href') || '';
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return;

    let targetUrl;
    try {
      targetUrl = new URL(link.href, location.href);
    } catch (_) {
      return;
    }
    if (targetUrl.origin !== location.origin) return;
    if (targetUrl.pathname === location.pathname && targetUrl.search === location.search && targetUrl.hash) return;

    closeDrawer();
    if (isReducedMotion()) return;
    e.preventDefault();
    document.documentElement.classList.add('is-transitioning-out');
    setTimeout(() => {
      location.assign(targetUrl.href);
    }, 150);
  });
}

function initOpticalSurfaceTracking() {
  if (isReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
  const surfaces = document.querySelectorAll('.interface-glass, .studio-composer, .sculpture-frame');
  surfaces.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
      const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
      el.style.setProperty('--opt-x', `${x.toFixed(1)}%`);
      el.style.setProperty('--opt-y', `${y.toFixed(1)}%`);
    }, { passive: true });
  });
}

export function initLivingMotion() {
  const reduced = isReducedMotion();
  if (reduced) return;

  // Phase I & II: Sculptural Hero Entrance + Masked Display Typography + Supporting Lead
  const heroArt = document.querySelector('.hero-sculpture-layer img, .salryn-fallback-art img');
  const heroLines = document.querySelectorAll('.hero-line-anim');
  const heroFades = document.querySelectorAll('.hero-fade-anim');
  if (document.body.dataset.page !== 'home' && (heroArt || heroLines.length || heroFades.length)) {
    const tl = gsap.timeline({ defaults: { ease: MOTION_TOKENS.easeEmerge } });
    if (heroArt) {
      tl.fromTo(
        heroArt,
        { scale: 1.06 },
        { scale: 1, duration: 1.25, ease: MOTION_TOKENS.easeSculptural, clearProps: 'transform' },
        0
      );
    }
    if (heroLines.length) {
      tl.from(
        heroLines,
        { yPercent: 106, opacity: 0, duration: 0.92, stagger: 0.095, clearProps: 'transform,opacity' },
        0.05
      );
    }
    if (heroFades.length) {
      tl.from(
        heroFades,
        { y: 18, opacity: 0, duration: 0.76, stagger: 0.08, clearProps: 'transform,opacity' },
        0.24
      );
    }
  }

  // Phase II & V: Sculptural Media Aperture Reveals (Counter-Scaled Clip Opening)
  const frames = Array.from(document.querySelectorAll('.sculpture-frame'));
  if (frames.length) {
    const frameIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fig = entry.target;
        frameIo.unobserve(fig);
        const img = fig.querySelector('img');
        gsap.fromTo(
          fig,
          { clipPath: 'inset(8% 4% 8% 4% round 6px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 0.85, ease: MOTION_TOKENS.easeSculptural, clearProps: 'clipPath' }
        );
        if (img && !img.style.transform) {
          gsap.fromTo(
            img,
            { scale: 1.07 },
            { scale: 1.0, duration: 0.98, ease: MOTION_TOKENS.easeSculptural, clearProps: 'transform' }
          );
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 85px 0px' });
    frames.forEach((f) => frameIo.observe(f));
  }

  // Phase II & V: Safe IntersectionObserver Chapter Choreography (never traps sections at opacity: 0)
  const revealEls = Array.from(document.querySelectorAll('[data-reveal], [data-reveal-group]'));
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const mode = el.dataset.reveal || 'editorial';
        if (el.hasAttribute('data-reveal-group')) {
          const items = el.querySelectorAll('[data-reveal-item]');
          gsap.fromTo(items, { y: 16, opacity: 0.28 }, {
            y: 0, opacity: 1, duration: 0.54, stagger: 0.055, ease: MOTION_TOKENS.easeResolve, clearProps: 'transform,opacity'
          });
        } else if (mode === 'slide') {
          gsap.fromTo(el, { x: -18, opacity: 0.28 }, {
            x: 0, opacity: 1, duration: 0.58, ease: MOTION_TOKENS.easeResolve, clearProps: 'transform,opacity'
          });
        } else {
          gsap.fromTo(el, { y: 16, opacity: 0.28 }, {
            y: 0, opacity: 1, duration: 0.56, ease: MOTION_TOKENS.easeResolve, clearProps: 'transform,opacity'
          });
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px 95px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  // Phase III: Subtle desktop scroll-linked sculptural depth parallax (fine pointer desktop only)
  if (window.matchMedia('(min-width: 901px) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.10');
      gsap.to(el, {
        y: () => -window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.05
        }
      });
    });
  }
}

export function animateSvgConduits(svgRoot, selector = 'path') {
  if (!svgRoot || isReducedMotion()) return;
  const paths = Array.from(svgRoot.querySelectorAll(selector)).filter((p) => {
    if (typeof p.getTotalLength !== 'function') return false;
    const len = p.getTotalLength();
    return len > 0 && isFinite(len);
  });
  if (!paths.length) return;

  const runDraw = () => {
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len * 0.42}`;
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 0.88,
      stagger: 0.025,
      ease: 'power2.out',
      clearProps: 'strokeDashoffset,strokeDasharray'
    });
  };

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    runDraw();
  }, { threshold: 0.05, rootMargin: '0px 0px 100px 0px' });
  io.observe(svgRoot);
}

/**
 * Real-Time Morph-Compatible Cubic Bezier SVG Path Interpolator.
 * Smoothly interpolates numeric control points between two path `d` strings
 * that share identical command topology.
 */
export function morphSvgPath(pathEl, fromD, toD, duration = 0.72) {
  if (!pathEl || !toD) return;
  if (!fromD || isReducedMotion()) {
    pathEl.setAttribute('d', toD);
    return;
  }
  const numRx = /-?\d+(?:\.\d+)?/g;
  const fromNums = (fromD.match(numRx) || []).map(Number);
  const toNums = (toD.match(numRx) || []).map(Number);
  if (fromNums.length !== toNums.length || fromNums.length === 0) {
    pathEl.setAttribute('d', toD);
    return;
  }
  const templateParts = toD.split(numRx);
  const proxy = { t: 0 };
  gsap.killTweensOf(proxy);
  gsap.to(proxy, {
    t: 1,
    duration,
    ease: 'expo.out',
    onUpdate: () => {
      const p = proxy.t;
      let out = templateParts[0];
      for (let i = 0; i < toNums.length; i++) {
        const val = fromNums[i] + (toNums[i] - fromNums[i]) * p;
        out += val.toFixed(1) + templateParts[i + 1];
      }
      pathEl.setAttribute('d', out);
    }
  });
}

export { gsap, ScrollTrigger };
