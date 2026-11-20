/**
 * Kirjane Living System — Master Scene Director
 *
 * Single deterministic state coordinator for scroll-driven cinematography across
 * every Living Topography page. Hooks directly into `adaptive-quality.js`'s single
 * unified requestAnimationFrame scheduler so zero competing animation loops exist.
 *
 * Managed State:
 *   - activeScene, sceneProgress, globalProgress, activeChapter, scrollDirection
 *   - currentFrame, selectedInfoState, interactionOwner ('scroll' | 'user')
 *   - qualityTier, motionPreference, visibilityState
 *
 * Dual-Track Scroll Truth:
 *   - `exact`  : Immediate native window.scrollY normalized progress -> drives ARIA,
 *                chapter switches, prefetching, and click-vs-scroll arbitrage.
 *   - `smooth` : Frame-rate-independent exponentially damped value -> drives canvas
 *                scrubbing, horizontal tracks, diagonal ascent, and subtle parallax.
 *                Snaps instantaneously to `exact` under prefers-reduced-motion.
 */

import { getQualityProfile, registerRenderTask, wakeScheduler } from './adaptive-quality.js';

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export class MasterSceneDirector {
  constructor(options = {}) {
    this.pageId = options.pageId || document.body.dataset.page || 'site';
    this.profile = getQualityProfile();
    this.reducedMotion = this.profile.tier === 'static' ||
      new URLSearchParams(location.search).get('reduce') === '1' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.scenes = new Map();
    this.listeners = new Set();
    this.destroyed = false;

    this.lastScrollY = window.scrollY || 0;
    this.lastWindowWidth = window.innerWidth;

    this.state = {
      pageId: this.pageId,
      activeScene: null,
      sceneProgress: 0,
      globalProgress: 0,
      activeChapter: null,
      scrollDirection: 1,
      currentFrame: 0,
      selectedInfoState: null,
      interactionOwner: 'scroll',
      qualityTier: this.profile.tier,
      motionPreference: this.reducedMotion ? 'reduced' : 'full',
      visibilityState: document.visibilityState || 'visible'
    };

    this._onScroll = this._handleScroll.bind(this);
    this._onResize = this._handleResize.bind(this);
    this._onVisibility = this._handleVisibility.bind(this);
    this._resizeTimer = null;

    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onResize, { passive: true });
    document.addEventListener('visibilitychange', this._onVisibility);

    // Expose live read-only inspector on window for engineering QA & debugging
    window.__SCENE_DIRECTOR__ = {
      getState: () => ({ ...this.state }),
      getScenes: () => {
        const out = {};
        for (const [id, sc] of this.scenes.entries()) {
          out[id] = {
            id,
            exact: Number(sc.exact.toFixed(4)),
            smooth: Number(sc.smooth.toFixed(4)),
            activeChapter: sc.activeChapter,
            inView: sc.inView
          };
        }
        return out;
      },
      jumpTo: (sceneId, progress) => this.jumpToSceneProgress(sceneId, progress)
    };

    // Hook into single unified RAF scheduler only when motion is active; wakes on scroll & sleeps when settled
    this._unregisterTask = null;
    if (!this.reducedMotion) {
      this._unregisterTask = registerRenderTask(`scene-director-${this.pageId}`, {
        exclusive: false,
        yieldToExclusive: false,
        isVisible: () => this._hasDirtyScenes(),
        render: (_now, dt) => this._tick(dt)
      });
    }
  }

  _hasDirtyScenes() {
    for (const sc of this.scenes.values()) {
      if (sc.dirty || Math.abs(sc.exact - sc.smooth) >= 0.0004) return true;
    }
    return false;
  }

  /**
   * Register a scroll-driven scene section.
   * @param {Object} cfg
   *   id: string
   *   el: HTMLElement (the tall sticky wrapper / section)
   *   chapters?: Array<{ id: string, start: number, end: number }>
   *   damping?: number (default 10.5)
   *   onUpdate?: ({ exact, smooth, direction, activeChapter, inView, isReduced }) => void
   *   onResize?: () => void
   */
  registerScene(cfg) {
    if (!cfg || !cfg.id || !cfg.el) return;
    const entry = {
      id: cfg.id,
      el: cfg.el,
      chapters: cfg.chapters || [],
      damping: cfg.damping || 11.0,
      onUpdate: cfg.onUpdate || (() => {}),
      onResize: cfg.onResize || null,
      top: 0,
      travel: 1,
      exact: 0,
      smooth: 0,
      inView: false,
      activeChapter: cfg.chapters && cfg.chapters[0] ? cfg.chapters[0].id : null,
      dirty: true
    };
    this.scenes.set(cfg.id, entry);
    this._measureScene(entry);
    this._syncSceneExact(entry, window.scrollY || 0, true);
    entry.onUpdate({
      exact: entry.exact,
      smooth: entry.smooth,
      direction: this.state.scrollDirection,
      activeChapter: entry.activeChapter,
      inView: entry.inView,
      isReduced: this.reducedMotion
    });
    return entry;
  }

  setSelectedInfoState(key, owner = 'user') {
    this.state.selectedInfoState = key;
    this.state.interactionOwner = owner;
    this._emit();
  }

  setCurrentFrame(frameIdx) {
    this.state.currentFrame = frameIdx;
  }

  jumpToSceneProgress(sceneId, targetProgress = 0) {
    const sc = this.scenes.get(sceneId);
    if (!sc) return;
    this._measureScene(sc);
    const clamped = clamp01(targetProgress);
    const targetY = Math.round(sc.top + clamped * sc.travel);
    this.state.interactionOwner = 'user';
    window.scrollTo({
      top: targetY,
      behavior: this.reducedMotion ? 'auto' : 'smooth'
    });
    if (this.reducedMotion) {
      this._handleScroll();
    }
  }

  measureAll() {
    for (const sc of this.scenes.values()) {
      this._measureScene(sc);
      if (sc.onResize) sc.onResize();
    }
    this._handleScroll();
  }

  _measureScene(sc) {
    const rect = sc.el.getBoundingClientRect();
    const scrollY = window.scrollY || 0;
    const vh = window.innerHeight || 900;
    sc.top = rect.top + scrollY;
    sc.height = rect.height;
    // Travel distance while sticky stage stays pinned inside section
    sc.travel = Math.max(1, rect.height - vh);
  }

  _syncSceneExact(sc, scrollY, snapSmooth = false) {
    const vh = window.innerHeight || 900;
    const raw = (scrollY - sc.top) / sc.travel;
    sc.exact = clamp01(raw);
    sc.inView = scrollY + vh * 1.15 >= sc.top && scrollY <= sc.top + sc.height + vh * 0.25;

    if (snapSmooth || this.reducedMotion) {
      sc.smooth = sc.exact;
    }

    if (sc.chapters.length > 0) {
      let chosen = sc.chapters[0].id;
      for (const ch of sc.chapters) {
        if (sc.exact >= ch.start) chosen = ch.id;
      }
      sc.activeChapter = chosen;
    }
  }

  _handleScroll() {
    if (this.destroyed) return;
    const scrollY = window.scrollY || 0;
    const delta = scrollY - this.lastScrollY;
    if (Math.abs(delta) > 0.5) {
      this.state.scrollDirection = delta >= 0 ? 1 : -1;
      this.state.interactionOwner = 'scroll';
      this.lastScrollY = scrollY;
    }

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.state.globalProgress = clamp01(scrollY / maxScroll);

    let dominant = null;
    for (const sc of this.scenes.values()) {
      this._syncSceneExact(sc, scrollY, this.reducedMotion);
      sc.dirty = true;
      if (sc.inView && (!dominant || (sc.exact > 0 && sc.exact < 1))) {
        dominant = sc;
      }
      if (this.reducedMotion) {
        sc.onUpdate({
          exact: sc.exact,
          smooth: sc.exact,
          direction: this.state.scrollDirection,
          activeChapter: sc.activeChapter,
          inView: sc.inView,
          isReduced: true
        });
        sc.dirty = false;
      }
    }

    if (dominant) {
      this.state.activeScene = dominant.id;
      this.state.sceneProgress = Number(dominant.exact.toFixed(4));
      this.state.activeChapter = dominant.activeChapter;
    }

    if (!this.reducedMotion) wakeScheduler();
    this._emit();
  }

  _tick(dt) {
    if (this.destroyed || document.hidden) return;
    const clampedDt = Math.min(dt, 0.05);

    for (const sc of this.scenes.values()) {
      const diff = sc.exact - sc.smooth;
      if (!sc.dirty && Math.abs(diff) < 0.0004) continue;

      const alpha = 1 - Math.exp(-sc.damping * clampedDt);
      sc.smooth = Math.abs(diff) < 0.0004 ? sc.exact : sc.smooth + diff * alpha;

      sc.onUpdate({
        exact: sc.exact,
        smooth: sc.smooth,
        direction: this.state.scrollDirection,
        activeChapter: sc.activeChapter,
        inView: sc.inView,
        isReduced: false
      });

      if (Math.abs(sc.exact - sc.smooth) < 0.0004) {
        sc.smooth = sc.exact;
        sc.dirty = false;
      }
    }
  }

  _handleResize() {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    // Ignore mobile browser URL-bar height churn when width has not changed
    if (isCoarse && Math.abs(window.innerWidth - this.lastWindowWidth) < 2) {
      return;
    }
    this.lastWindowWidth = window.innerWidth;
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      if (!this.destroyed) this.measureAll();
    }, 120);
  }

  _handleVisibility() {
    this.state.visibilityState = document.visibilityState || 'visible';
    this._emit();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  _emit() {
    for (const fn of this.listeners) {
      try { fn(this.state); } catch (_) {}
    }
  }

  destroy() {
    this.destroyed = true;
    if (this._unregisterTask) {
      this._unregisterTask();
      this._unregisterTask = null;
    }
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibility);
    clearTimeout(this._resizeTimer);
    this.scenes.clear();
    this.listeners.clear();
  }
}
