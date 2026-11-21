/**
 * Kirjane Living Topography — Adaptive Graphical Quality & Unified Frame Scheduler
 *
 * Inspects WebGL renderer capabilities, device pixel ratio, viewport class,
 * hardware concurrency, and prefers-reduced-motion to classify the runtime into
 * an explicit quality tier:
 *   - 'high'        : Capable hardware GPU (Direct3D11 / Metal / Vulkan HW) -> 60 FPS full fidelity
 *   - 'balanced'    : Mobile / touch or mid-tier device -> 60 FPS touch-tuned resolution & 1-octave FBM
 *   - 'constrained' : Software WebGL fallback (SwiftShader / llvmpipe / Basic Render) -> 60 FPS low-fill LOD
 *   - 'static'      : prefers-reduced-motion or ?webgl=off -> 0 WebGL loops, immediate static artwork
 *
 * Owns ONE unified requestAnimationFrame scheduler across the entire page so
 * background shaders, 3D organisms, and scroll choreography never compete in
 * redundant RAF loops. Dynamically scales resolution if frame times rise.
 */

const TIER_CONFIGS = {
  high: {
    tier: 'high',
    targetFps: 60,
    bgScale: 0.45,
    bgMaxW: 620,
    bgMaxH: 390,
    shaderOctaves: 2,
    threeScale: 1.0,
    threeMaxW: 1440,
    threeMaxH: 900,
    torusRadial: 22,
    torusTubular: 84,
    satelliteSegments: 14
  },
  balanced: {
    tier: 'balanced',
    targetFps: 60,
    bgScale: 0.38,
    bgMaxW: 360,
    bgMaxH: 250,
    shaderOctaves: 1,
    threeScale: 1.0,
    threeMaxW: 540,
    threeMaxH: 960,
    torusRadial: 18,
    torusTubular: 68,
    satelliteSegments: 10
  },
  constrained: {
    tier: 'constrained',
    targetFps: 60,
    bgScale: 0.22,
    bgMaxW: 240,
    bgMaxH: 155,
    shaderOctaves: 1,
    threeScale: 0.34,
    threeMaxW: 340,
    threeMaxH: 220,
    torusRadial: 10,
    torusTubular: 32,
    satelliteSegments: 6
  },
  static: {
    tier: 'static',
    targetFps: 0,
    bgScale: 0,
    bgMaxW: 0,
    bgMaxH: 0,
    shaderOctaves: 0,
    threeScale: 0,
    threeMaxW: 0,
    threeMaxH: 0,
    torusRadial: 0,
    torusTubular: 0,
    satelliteSegments: 0
  }
};

let cachedProfile = null;
const tasks = new Map();
let rafId = null;
let lastNow = performance.now();
const frameHistory = [];
let dynamicResolutionMultiplier = 1.0;

export function detectQualityProfile(glContext = null) {
  const params = new URLSearchParams(location.search);
  const reduced = params.get('reduce') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const webglOff = params.get('webgl') === 'off';

  if (reduced || webglOff) {
    cachedProfile = { ...TIER_CONFIGS.static, rendererString: 'disabled-or-reduced-motion', isSoftware: false };
    applyRootAttributes(cachedProfile);
    return cachedProfile;
  }

  let rendererString = 'unknown';
  let isSoftware = false;

  try {
    const gl = glContext || document.createElement('canvas').getContext('webgl2');
    if (!gl) {
      cachedProfile = { ...TIER_CONFIGS.static, rendererString: 'no-webgl2', isSoftware: false };
      applyRootAttributes(cachedProfile);
      return cachedProfile;
    }
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    rendererString = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
    isSoftware = /swiftshader|llvmpipe|software|basic render|subzero|microsoft basic/i.test(rendererString);
  } catch (_) {}

  const forcedTier = params.get('tier');
  const isMobileOrTouch = window.innerWidth <= 900 || window.matchMedia('(pointer: coarse)').matches;
  const lowCores = (navigator.hardwareConcurrency || 8) <= 4;

  let chosen = 'high';
  if (forcedTier && TIER_CONFIGS[forcedTier]) {
    chosen = forcedTier;
  } else if (isSoftware) {
    chosen = 'constrained';
  } else if (isMobileOrTouch || lowCores) {
    chosen = 'balanced';
  }

  cachedProfile = {
    ...TIER_CONFIGS[chosen],
    rendererString,
    isSoftware,
    isMobileOrTouch,
    dpr: Math.min(window.devicePixelRatio || 1, isMobileOrTouch ? 1.25 : 1.35)
  };
  applyRootAttributes(cachedProfile);
  return cachedProfile;
}

function applyRootAttributes(profile) {
  document.documentElement.dataset.qualityTier = profile.tier;
  window.__KIRJANE_PERF__ = {
    tier: profile.tier,
    renderer: profile.rendererString,
    isSoftware: profile.isSoftware,
    dynamicResolutionMultiplier,
    activeLoops: [],
    rollingAvgFrameMs: 16.6,
    rollingFps: 60
  };
}

export function getQualityProfile() {
  return cachedProfile || detectQualityProfile();
}

export function getDynamicResolutionMultiplier() {
  return dynamicResolutionMultiplier;
}

function stepScheduler(now) {
  if (document.hidden || tasks.size === 0) {
    rafId = null;
    return;
  }

  const rawDt = now - lastNow;
  lastNow = now;
  const dt = Math.min(0.05, Math.max(0.001, rawDt * 0.001));

  // Rolling 24-frame governor
  if (rawDt > 2 && rawDt < 250) {
    frameHistory.push(rawDt);
    if (frameHistory.length > 24) frameHistory.shift();
    if (frameHistory.length === 24) {
      const avg = frameHistory.reduce((a, b) => a + b, 0) / 24;
      if (window.__KIRJANE_PERF__) {
        window.__KIRJANE_PERF__.rollingAvgFrameMs = +avg.toFixed(2);
        window.__KIRJANE_PERF__.rollingFps = +(1000 / avg).toFixed(1);
      }
      // Dynamic resolution governor if device struggles
      if (avg > 24 && dynamicResolutionMultiplier > 0.65) {
        dynamicResolutionMultiplier = Math.max(0.62, +(dynamicResolutionMultiplier * 0.86).toFixed(2));
        if (window.__KIRJANE_PERF__) window.__KIRJANE_PERF__.dynamicResolutionMultiplier = dynamicResolutionMultiplier;
        tasks.forEach((t) => { if (typeof t.onScaleChange === 'function') t.onScaleChange(dynamicResolutionMultiplier); });
      }
    }
  }

  // Determine highest priority visible exclusive task (e.g. Salryn 3D hero pauses background shader while onscreen)
  let exclusiveActive = false;
  for (const t of tasks.values()) {
    if (t.exclusive && t.isVisible()) {
      exclusiveActive = true;
      break;
    }
  }

  const activeNames = [];
  for (const [id, t] of tasks.entries()) {
    if (!t.isVisible()) continue;
    if (exclusiveActive && !t.exclusive && t.yieldToExclusive) continue;
    activeNames.push(id);
    t.render(now, dt);
  }

  if (window.__KIRJANE_PERF__) {
    window.__KIRJANE_PERF__.activeLoops = activeNames;
  }

  if (activeNames.length > 0) {
    rafId = requestAnimationFrame(stepScheduler);
  } else {
    rafId = null;
  }
}

export function wakeScheduler() {
  if (!rafId && !document.hidden && tasks.size > 0) {
    lastNow = performance.now();
    rafId = requestAnimationFrame(stepScheduler);
  }
}

export function registerRenderTask(id, taskConfig) {
  tasks.set(id, {
    id,
    exclusive: Boolean(taskConfig.exclusive),
    yieldToExclusive: Boolean(taskConfig.yieldToExclusive),
    isVisible: taskConfig.isVisible || (() => true),
    render: taskConfig.render,
    onScaleChange: taskConfig.onScaleChange || null
  });
  wakeScheduler();
  return () => {
    tasks.delete(id);
    if (tasks.size === 0 && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) wakeScheduler();
});
