/**
 * Kirjane Living System — Signature Identity Reveal (R3 Maximum Refinement)
 *
 * Implements a non-blocking, zero-delay Kirjane identity awakening:
 *   1. Header Emblem Horizon Trace: draws the emerald orbital ring + morphs the
 *      refractive lens aperture open + ignites the central lime nucleus.
 *   2. Hero Signature Badge (subtle optical ignition on Home, Salryn & About):
 *      materializes an architectural optical crest and tracking reveal directly in flow
 *      without blocking scroll, navigation, or interaction for even 1ms.
 *   3. Hover / Focus Micro-Interaction: subtle harmonic lens pulse on wordmark hover.
 *   4. Strict prefers-reduced-motion (?reduce=1) compatibility: renders final settled emblem immediately.
 */

import gsap from '../vendor/gsap/index.js';
import { isReducedMotion } from './motion-system.js';

export function initKirjaneLogoReveal() {
  const reduced = isReducedMotion();
  const wordmark = document.querySelector('.site-header .wordmark');
  const markSvg = wordmark ? wordmark.querySelector('.wordmark-mark') : null;
  const wordText = wordmark ? wordmark.querySelector('span') : null;

  let status = 'static';

  if (markSvg && !markSvg.classList.contains('official-brand-mark') && !reduced) {
    status = 'animated';
    const circle = markSvg.querySelector('circle[r="12"]');
    const lens = markSvg.querySelector('path');
    const dot = markSvg.querySelector('circle[r="2.4"]');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (circle) {
      const len = 75.4;
      circle.style.strokeDasharray = `${len}`;
      circle.style.strokeDashoffset = `${len}`;
      tl.to(circle, {
        strokeDashoffset: 0,
        duration: 0.72,
        clearProps: 'strokeDasharray,strokeDashoffset'
      }, 0);
    }
    if (lens) {
      const lenL = typeof lens.getTotalLength === 'function' ? lens.getTotalLength() : 32;
      lens.style.strokeDasharray = `${lenL}`;
      lens.style.strokeDashoffset = `${lenL}`;
      tl.to(lens, {
        strokeDashoffset: 0,
        duration: 0.62,
        ease: 'expo.out',
        clearProps: 'strokeDasharray,strokeDashoffset'
      }, 0.14);
    }
    if (dot) {
      tl.fromTo(dot, { scale: 0.1, opacity: 0, transformOrigin: '14px 14px' }, {
        scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)', clearProps: 'transform,opacity'
      }, 0.28);
    }
    if (wordText) {
      tl.fromTo(wordText, { letterSpacing: '0.32em', opacity: 0.35 }, {
        letterSpacing: '0.18em', opacity: 1, duration: 0.72, ease: 'power2.out', clearProps: 'letterSpacing,opacity'
      }, 0.12);
    }

    // Restrained harmonic pulse on fine-pointer hover or keyboard focus
    const pulseMark = () => {
      if (isReducedMotion()) return;
      gsap.fromTo(dot || markSvg, { scale: 1 }, {
        scale: 1.32, duration: 0.24, yoyo: true, repeat: 1, transformOrigin: 'center center', ease: 'power2.out'
      });
    };
    wordmark.addEventListener('pointerenter', pulseMark, { passive: true });
    wordmark.addEventListener('focus', pulseMark, { passive: true });
  }

  // Hero Signature Crest Awakening (injects non-blocking subtle crest above main hero kicker/h1 when present)
  const heroCrest = document.querySelector('[data-kirjane-crest]');
  if (heroCrest) {
    const svgCrest = heroCrest.querySelector('svg');
    const paths = svgCrest ? Array.from(svgCrest.querySelectorAll('circle, path, line')) : [];
    if (!reduced && paths.length) {
      paths.forEach((p, idx) => {
        if (typeof p.getTotalLength === 'function') {
          const l = p.getTotalLength();
          if (l > 0 && isFinite(l)) {
            p.style.strokeDasharray = `${l}`;
            p.style.strokeDashoffset = `${l}`;
            gsap.to(p, {
              strokeDashoffset: 0,
              duration: 0.78,
              delay: 0.06 * idx,
              ease: 'power2.out',
              clearProps: 'strokeDasharray,strokeDashoffset'
            });
          }
        }
      });
    }
  }

  window.__KIRJANE_LOGO_REVEAL__ = {
    ready: true,
    mode: status,
    hasWordmark: Boolean(wordmark),
    hasCrest: Boolean(heroCrest),
    nonBlocking: true
  };
}
