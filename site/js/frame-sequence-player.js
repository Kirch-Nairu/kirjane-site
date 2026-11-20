/**
 * Kirjane Living System — Bounded LRU Frame-Sequence Canvas Player
 *
 * Designed for deterministic, bidirectional, frame-accurate scroll scrubbing:
 *   - Instant static poster backing (zero blank canvas on first paint or slow network)
 *   - Proximity lazy loading via IntersectionObserver (no early bandwidth bloat)
 *   - Bounded decoded-frame cache (32/18 frames, 80/32 MiB pixel budgets) with explicit disposal
 *   - Direction-aware asymmetric prefetch (+8 ahead, -3 behind)
 *   - Concurrency-capped background fetches with stale-request cancellation
 *   - Fault resilience: retains last valid decoded frame (or poster) if a request aborts/fails
 *   - Full prefers-reduced-motion support (renders authoritative static poster, zero scrubbing)
 */

const REGISTRY = new Map();
const MiB = 1024 * 1024;
const DEFAULT_DECODED_BUDGET = {desktop:80 * MiB,mobile:32 * MiB};
const mediaBytes = (media) => Math.max(0, (media.naturalWidth || media.width || 0) * (media.naturalHeight || media.height || 0) * 4);


function getRegistrySnapshot() {
  const out = {};
  for (const [id, player] of REGISTRY.entries()) {
    out[id] = player.getTelemetry();
  }
  return out;
}

if (typeof window !== 'undefined') {
  window.__KIRJANE_SEQUENCES__ = {
    getSnapshot: getRegistrySnapshot,
    getPlayer: (id) => REGISTRY.get(id) || null
  };
}

export class FrameSequencePlayer {
  constructor(options) {
    this.id = options.id || `seq-${Math.random().toString(36).slice(2, 8)}`;
    this.canvas = options.canvas;
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false, desynchronized: true }) : null;
    this.basePath = options.basePath.replace(/\/+$/, '');
    this.mobileBasePath = (options.mobileBasePath || options.basePath).replace(/\/+$/, '');
    this.desktopFrames = options.desktopFrames || 72;
    this.mobileFrames = options.mobileFrames || Math.ceil(this.desktopFrames / 2);
    this.pad = options.pad || 4;
    this.fit = options.fit || 'cover';
    this.reducedMotion = Boolean(options.reducedMotion);
    this.isMobile = Boolean(options.isMobile);
    this.cacheLimit = options.maxCache;
    this.maxCache = this.cacheLimit || (this.isMobile ? 18 : 32);
    this.byteLimit = options.maxDecodedBytes;
    this.maxDecodedBytes = this.byteLimit || DEFAULT_DECODED_BUDGET[this.isMobile ? 'mobile' : 'desktop'];
    this.cacheBytes = 0;
    this.frameBytesEstimate = 0;
    this.prefetchSet = new Set();
    this.maxInflight = options.maxInflight || 4;
    this.onFrameDrawn = options.onFrameDrawn || null;

    // Select active variant cleanly
    this.activeBasePath = this.isMobile ? this.mobileBasePath : this.basePath;
    this.frameCount = this.isMobile ? this.mobileFrames : this.desktopFrames;

    // Bounded LRU Map: key = frameIndex -> { bitmapOrImg, isBitmap }
    this.cache = new Map();
    this.inflight = new Map(); // frameIndex -> AbortController
    this.failedSet = new Set();

    this.posterImg = null;
    this.posterReady = false;
    this.activated = false;
    this.destroyed = false;

    this.targetIndex = 0;
    this.lastDrawnIndex = -1;
    this.lastValidMedia = null;
    this.lastDirection = 1;

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      failedRequests: 0,
      abortedRequests: 0,
      drawnFrames: 0
    };

    this._observer = null;
    this._resizeCanvas();
    this._loadPoster();

    if (!this.reducedMotion && this.canvas) {
      this._setupProximityObserver();
    }

    REGISTRY.set(this.id, this);
  }

  _frameUrl(idx) {
    const clamped = Math.max(0, Math.min(this.frameCount - 1, idx));
    const num = String(clamped).padStart(this.pad, '0');
    return `${this.activeBasePath}/frame-${num}.webp`;
  }

  _posterUrl() {
    return `${this.activeBasePath}/poster.webp`;
  }

  _resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.25 : 1.5);
    const w = Math.max(2, Math.round((rect.width || this.canvas.clientWidth || 1280) * dpr));
    const h = Math.max(2, Math.round((rect.height || this.canvas.clientHeight || 720) * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  resize(isMobile = this.isMobile) {
    if (this.destroyed) return;
    if (isMobile !== this.isMobile) {
      const progress = this.targetIndex / Math.max(1, this.frameCount - 1);
      this._clearFrames();
      this.isMobile = isMobile;
      this.activeBasePath = isMobile ? this.mobileBasePath : this.basePath;
      this.frameCount = isMobile ? this.mobileFrames : this.desktopFrames;
      this.maxCache = this.cacheLimit || (isMobile ? 18 : 32);
      this.maxDecodedBytes = this.byteLimit || DEFAULT_DECODED_BUDGET[isMobile ? 'mobile' : 'desktop'];
      this.targetIndex = Math.round(progress * (this.frameCount - 1));
      this.lastDrawnIndex = -1;
      this.lastValidMedia = this.posterImg = null;
      this.posterReady = false;
      if (this.canvas) this.canvas.style.visibility = 'hidden';
      this._resizeCanvas();
      this._loadPoster();
      if (this.activated) {
        this._prefetchWindow(this.targetIndex, this.lastDirection);
      }
      return;
    }
    this._resizeCanvas();
    if (this.lastValidMedia) {
      this._drawMedia(this.lastValidMedia);
    } else if (this.posterReady && this.posterImg) {
      this._drawMedia(this.posterImg);
    }
  }

  _loadPoster() {
    const img = new Image();
    this.posterRequest = img;
    img.decoding = 'async';
    img.onload = () => {
      if (this.destroyed || this.posterRequest !== img) return;
      this.posterImg = img;
      this.posterReady = true;
      if (!this.lastValidMedia) {
        this.lastValidMedia = img;
        this._drawMedia(img);
      }
    };
    img.onerror = () => {
      if (this.destroyed || this.posterRequest !== img) return;
      this.stats.failedRequests += 1;
    };
    img.src = this._posterUrl();
  }

  _setupProximityObserver() {
    if (typeof IntersectionObserver === 'undefined') {
      this.activate();
      return;
    }
    this._observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activate();
          }
        }
      },
      { threshold: 0.05 }
    );
    this._observer.observe(this.canvas);
  }

  activate() {
    if (this.activated || this.destroyed || this.reducedMotion) return;
    this.activated = true;
    this._observer?.disconnect();
    this._observer = null;
    // Immediately queue initial keyframe and short lookahead window
    this._prefetchWindow(this.targetIndex, 1);
  }

  setProgress(u, direction = 1) {
    if (this.destroyed) return;
    if (this.reducedMotion) {
      if (this.posterReady && this.posterImg) this._drawMedia(this.posterImg);
      return;
    }

    const clamped = Math.max(0, Math.min(1, u));
    const idx = Math.round(clamped * (this.frameCount - 1));
    const nextDirection = direction >= 0 ? 1 : -1;
    if (this.activated && idx === this.targetIndex && nextDirection === this.lastDirection) return;
    this.lastDirection = nextDirection;
    this.targetIndex = idx;

    if (!this.activated) {
      this.activate();
    }

    // Immediate draw on cache hit
    const cached = this._getFromCache(idx);
    if (cached) {
      this.stats.hits += 1;
      this._showFrame(idx, cached.media);
    } else {
      this.stats.misses += 1;
      // Draw nearest cached neighbor so fast scrubbing stays fluid and never flashes black
      const nearest = this._findNearestCached(idx);
      if (nearest) {
        this._showFrame(nearest.index, nearest.media);
      } else if (this.lastValidMedia) {
        this._drawMedia(this.lastValidMedia);
      } else if (this.posterReady && this.posterImg) {
        this._drawMedia(this.posterImg);
      }
    }

    this._prefetchWindow(idx, this.lastDirection);
  }

  _getFromCache(idx) {
    const entry = this.cache.get(idx);
    if (!entry) return null;
    // Refresh LRU order (delete + re-insert at tail)
    this.cache.delete(idx);
    this.cache.set(idx, entry);
    return entry;
  }

  _putInCache(idx, media, isBitmap) {
    const bytes = mediaBytes(media);
    const existing = this.cache.get(idx);
    if (existing) {
      this.cacheBytes -= existing.bytes;
      this.cache.delete(idx);
      if (existing.media !== media) this._releaseCached(existing);
    }
    this.cache.set(idx, { media, isBitmap, bytes });
    this.cacheBytes += bytes;
    this.frameBytesEstimate = Math.max(this.frameBytesEstimate, bytes);

    // Bound estimated decoded pixels and frame count. Keep the current frame
    // when possible; the canvas itself retains its already painted pixels.
    // A single unusually large frame is retained rather than blanking playback.
    while (this.cache.size > 1 && (this.cache.size > this.maxCache || this.cacheBytes > this.maxDecodedBytes)) {
      const candidates = [...this.cache.keys()].filter(k => k !== idx);
      const outside = candidates.filter(k => !this.prefetchSet.has(k));
      const victimKey = outside.find(k => this.cache.get(k).media !== this.lastValidMedia)
        ?? outside[0] ?? candidates.find(k => this.cache.get(k).media !== this.lastValidMedia) ?? candidates[0];
      const evicted = this.cache.get(victimKey);
      this.cache.delete(victimKey);
      this.cacheBytes -= evicted.bytes;
      this._releaseCached(evicted);
      this.stats.evictions += 1;
    }
  }

  _releaseCached(entry) {
    if (entry.media === this.lastValidMedia) this.lastValidMedia = this.posterImg || null;
    if (entry.isBitmap && typeof entry.media.close === 'function') {
      try { entry.media.close(); } catch (_) {}
    }
  }

  _findNearestCached(targetIdx) {
    let best = null;
    let bestDist = Infinity;
    for (const [k, entry] of this.cache.entries()) {
      const d = Math.abs(k - targetIdx);
      if (d < bestDist) {
        bestDist = d;
        best = {index:k, media:entry.media};
      }
    }
    return best;
  }

  _prefetchWindow(centerIdx, dir) {
    if (this.destroyed || this.reducedMotion) return;
    const desired = new Set([centerIdx]);

    // Prioritize forward travel direction first
    for (let step = 1; step <= 8; step++) {
      const f = centerIdx + step * dir;
      if (f >= 0 && f < this.frameCount) desired.add(f);
    }
    for (let step = 1; step <= 3; step++) {
      const f = centerIdx - step * dir;
      if (f >= 0 && f < this.frameCount) desired.add(f);
    }
    // Avoid an unfillable prefetch window when the byte limit is tighter
    // than the original 12-frame lookahead (or a custom limit is supplied).
    const capacity = Math.max(1, Math.min(this.maxCache, this.frameBytesEstimate ? Math.floor(this.maxDecodedBytes / this.frameBytesEstimate) : this.maxCache));
    const requested = [...desired].slice(0, capacity);
    this.prefetchSet = new Set(requested);
    // Abort stale inflight requests far from the current scrub position
    for (const [inflightIdx, controller] of this.inflight.entries()) {
      if (!desired.has(inflightIdx) && Math.abs(inflightIdx - centerIdx) > 10) {
        controller.abort();
        this.inflight.delete(inflightIdx);
      }
    }

    for (const idx of requested) {
      if (this.inflight.size >= this.maxInflight) break;
      if (!this.cache.has(idx) && !this.inflight.has(idx) && !this.failedSet.has(idx)) {
        this._requestFrame(idx);
      }
    }
  }

  async _requestFrame(idx) {
    if (this.destroyed || this.cache.has(idx) || this.inflight.has(idx) || this.failedSet.has(idx)) return;
    if (this.inflight.size >= this.maxInflight) return;

    const controller = new AbortController();
    this.inflight.set(idx, controller);

    try {
      const resp = await fetch(this._frameUrl(idx), {
        signal: controller.signal,
        cache: 'force-cache'
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      if (this.destroyed || controller.signal.aborted) return;

      let media;
      let isBitmap = false;
      if (typeof createImageBitmap === 'function') {
        media = await createImageBitmap(blob);
        isBitmap = true;
      } else {
        media = await this._blobToImage(blob);
      }

      if (this.destroyed || controller.signal.aborted) {
        if (isBitmap && typeof media.close === 'function') media.close();
        return;
      }

      this._putInCache(idx, media, isBitmap);

      // Paint immediately if this frame is still the current target (or closer than what was drawn)
      if (idx === this.targetIndex || Math.abs(idx - this.targetIndex) < Math.abs(this.lastDrawnIndex - this.targetIndex)) {
        this._showFrame(idx, media);
      }
    } catch (err) {
      if (this.destroyed) return;
      if (controller.signal.aborted || err?.name === 'AbortError') {
        this.stats.abortedRequests += 1;
      } else {
        this.stats.failedRequests += 1;
        this.failedSet.add(idx);
        // Retain last valid media or poster gracefully; never clear canvas to blank black
      }
    } finally {
      if (this.inflight.get(idx) === controller) {
        this.inflight.delete(idx);
        this._prefetchWindow(this.targetIndex, this.lastDirection);
      }
    }
  }

  _showFrame(index, media) {
    if (this.lastDrawnIndex === index && this.lastValidMedia === media) return;
    this.lastValidMedia = media;
    this._drawMedia(media);
    this.lastDrawnIndex = index;
    this.onFrameDrawn?.(index, index / Math.max(1, this.frameCount - 1));
  }

  _blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    });
  }

  _drawMedia(media) {
    if (!this.ctx || !this.canvas || !media) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    // Reject closed ImageBitmaps (whose width/height become 0) safely without fallback masking
    const mw = typeof media.naturalWidth === 'number' ? media.naturalWidth : media.width;
    const mh = typeof media.naturalHeight === 'number' ? media.naturalHeight : media.height;
    if (!cw || !ch || !mw || !mh) {
      if (this.posterReady && this.posterImg && media !== this.posterImg) {
        this._drawMedia(this.posterImg);
      }
      return;
    }

    if (this.fit === 'contain') {
      this.ctx.fillStyle = '#060E0A';
      this.ctx.fillRect(0, 0, cw, ch);
    }

    const scale = this.fit === 'contain'
      ? Math.min(cw / mw, ch / mh)
      : Math.max(cw / mw, ch / mh);

    const dw = mw * scale;
    const dh = mh * scale;
    const dx = (cw - dw) * 0.5;
    const dy = (ch - dh) * 0.5;

    try {
      this.ctx.drawImage(media, dx, dy, dw, dh);
      this.stats.drawnFrames += 1;
    } catch (_) {
      if (this.posterReady && this.posterImg && media !== this.posterImg) {
        try {
          this.ctx.drawImage(this.posterImg, 0, 0, cw, ch);
        } catch (__) {}
      }
    }
    this.canvas.style.visibility = '';
  }

  getTelemetry() {
    const decodedPixelBytes = this.cacheBytes;
    return {
      id: this.id,
      frameCount: this.frameCount,
      variant: this.isMobile ? 'mobile' : 'desktop',
      cacheSize: this.cache.size,
      maxCache: this.maxCache,
      maxInflight: this.maxInflight,
      decodedPixelBytes,
      maxDecodedBytes: this.maxDecodedBytes,
      singleFrameOverBudget: this.cache.size === 1 && decodedPixelBytes > this.maxDecodedBytes,
      inflightCount: this.inflight.size,
      targetIndex: this.targetIndex,
      lastDrawnIndex: this.lastDrawnIndex,
      posterReady: this.posterReady,
      hasValidMedia: Boolean(this.lastValidMedia || this.posterImg),
      reducedMotion: this.reducedMotion,
      ...this.stats
    };
  }

  destroy() {
    this.destroyed = true;
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._clearFrames();
    this.lastValidMedia = this.posterImg = this.posterRequest = null;
    REGISTRY.delete(this.id);
  }

  _clearFrames() {
    for (const controller of this.inflight.values()) {
      controller.abort();
    }
    this.inflight.clear();
    for (const entry of this.cache.values()) {
      if (entry.isBitmap && typeof entry.media.close === 'function') {
        try { entry.media.close(); } catch (_) {}
      }
    }
    this.cache.clear();
    this.cacheBytes = 0;
    this.frameBytesEstimate = 0;
    this.prefetchSet.clear();
    this.failedSet.clear();
  }
}
