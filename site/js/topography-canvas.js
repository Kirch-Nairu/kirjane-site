/**
 * Persistent Scroll-Coupled WebGL2 Living Topography Environment (Stage 04 R2)
 *
 * Driven by the centralized Adaptive Quality & Unified Frame Scheduler
 * (`adaptive-quality.js`). Renders an organic domain-warped GLSL ES 3.00
 * iso-contour fluid terrain at a full 60 FPS across hardware GPUs and
 * constrained software renderers via adaptive resolution and octave scaling.
 *
 * Includes chapter-driven environmental progression, pointer-velocity wake,
 * and full GPU context loss / restoration recovery.
 */
import {
  detectQualityProfile,
  getDynamicResolutionMultiplier,
  registerRenderTask,
  wakeScheduler
} from './adaptive-quality.js';

export function initTopographyField(config = {}) {
  const canvas = document.getElementById('living-topography-bg');
  const gl = canvas
    ? canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' })
    : null;
  const profile = detectQualityProfile(gl);

  const state = {
    warp: config.warp ?? 0.84,
    targetWarp: config.warp ?? 0.84,
    density: config.density ?? 10.5,
    targetDensity: config.density ?? 10.5,
    energy: config.energy ?? 0.40,
    targetEnergy: config.energy ?? 0.40,
    focusX: config.focusX ?? 0.64,
    focusY: config.focusY ?? 0.50,
    targetFocusX: config.focusX ?? 0.64,
    targetFocusY: config.focusY ?? 0.50,
    scroll: 0,
    ptrX: 0.62,
    ptrY: 0.50,
    targetPtrX: 0.62,
    targetPtrY: 0.50,
    active: false,
    paused: false
  };

  const controller = {
    setProfile(p) {
      if (!p) return;
      if (p.warp !== undefined) state.targetWarp = p.warp;
      if (p.density !== undefined) state.targetDensity = p.density;
      if (p.energy !== undefined) state.targetEnergy = p.energy;
      if (p.focusX !== undefined) state.targetFocusX = p.focusX;
      if (p.focusY !== undefined) state.targetFocusY = p.focusY;
      wakeScheduler();
    },
    setPaused(paused) {
      state.paused = Boolean(paused);
      if (!state.paused) wakeScheduler();
    },
    getQualityTier: () => profile.tier,
    isWebGLActive: () => state.active,
    dispose() {}
  };

  if (!canvas || !gl || profile.tier === 'static') {
    if (canvas) canvas.style.display = 'none';
    return controller;
  }

  canvas.dataset.qualityTier = profile.tier;
  canvas.dataset.animationActive = 'true';
  const inputListeners = new AbortController();
  const listenerOptions = {passive:true, signal:inputListeners.signal};

  const VS = `#version 300 es
  in vec2 a_p;
  void main() { gl_Position = vec4(a_p, 0.0, 1.0); }`;

  const FS = `#version 300 es
  precision highp float;
  out vec4 fragColor;
  uniform vec2 u_res;
  uniform float u_time;
  uniform float u_scroll;
  uniform vec2 u_ptr;
  uniform vec2 u_focus;
  uniform float u_warp;
  uniform float u_dens;
  uniform float u_energy;
  uniform int u_octaves;

  float hash(vec2 p){
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 34.5);
    return fract(p.x * p.y);
  }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p, int octs){
    float v = 0.0, a = 0.58;
    mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 2; i++) {
      if (i >= octs) break;
      v += a * noise(p);
      p = m * p * 2.04 + vec2(2.3, 6.9);
      a *= 0.45;
    }
    return v;
  }

  void main() {
    vec2 res = max(u_res, vec2(1.0));
    vec2 uv = gl_FragCoord.xy / res;
    float asp = res.x / res.y;
    vec2 p = (uv - u_focus) * vec2(asp, 1.0) * 1.92;
    vec2 mp = (u_ptr - u_focus) * vec2(asp, 1.0) * 1.92;

    float t = u_time * 0.17;
    float scShift = u_scroll * 1.65;
    vec2 q = vec2(
      fbm(p * 1.04 + vec2(t * 0.46, -t * 0.30 + scShift * 0.38), u_octaves),
      fbm(p * 1.04 + vec2(4.1 - scShift * 0.28, t * 0.38), u_octaves)
    );
    float pull = exp(-length(p - mp) * 2.3) * 0.36;
    vec2 w = p + (u_warp + pull) * (q - 0.5) * 1.28;

    float d = length(w) - 0.46 + 0.18 * sin(w.x * 2.7 + t + scShift) * cos(w.y * 2.4 - t * 0.6);
    float sc = d * u_dens;
    float cell = abs(fract(sc - 0.5) - 0.5);
    float fw = max(fwidth(sc), 0.009);

    float fine = 1.0 - smoothstep(0.0, fw * 1.5, cell - 0.02);
    float majCell = abs(fract(sc * 0.25 - 0.5) - 0.5);
    float major = 1.0 - smoothstep(0.0, fw * 0.55, majCell - 0.019);

    float wave = abs(d - mod(t * 0.34 + scShift * 0.24, 1.8) + 0.4);
    float limePulse = (1.0 - smoothstep(0.0, 0.032, wave)) * major * u_energy;

    vec3 cObs  = vec3(0.0314, 0.0667, 0.0510);
    vec3 cPine = vec3(0.0627, 0.2392, 0.1686);
    vec3 cEmer = vec3(0.0863, 0.4824, 0.3333);
    vec3 cLime = vec3(0.8275, 0.9647, 0.4196);

    vec3 col = mix(cObs, cPine * 0.38, smoothstep(1.4, -0.25, d) * 0.56);
    col = mix(col, cPine * 0.92, fine * 0.35);
    col = mix(col, cEmer * 0.82, major * 0.54);
    col = mix(col, cLime, limePulse * 0.76);

    float edgeFade = smoothstep(0.04, 0.64, uv.x * 0.74 + uv.y * 0.36);
    col = mix(cObs, col, 0.18 + 0.56 * edgeFade);
    fragColor = vec4(col, 1.0);
  }`;

  let prog = null;
  let vao = null;
  let buf = null;
  let U = {};

  function compilePipeline() {
    const mkShader = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    prog = gl.createProgram();
    const vertex = mkShader(gl.VERTEX_SHADER, VS);
    const fragment = mkShader(gl.FRAGMENT_SHADER, FS);
    gl.attachShader(prog, vertex);
    gl.attachShader(prog, fragment);
    gl.linkProgram(prog);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const locP = gl.getAttribLocation(prog, 'a_p');
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    U = {
      res: gl.getUniformLocation(prog, 'u_res'),
      time: gl.getUniformLocation(prog, 'u_time'),
      scroll: gl.getUniformLocation(prog, 'u_scroll'),
      ptr: gl.getUniformLocation(prog, 'u_ptr'),
      focus: gl.getUniformLocation(prog, 'u_focus'),
      warp: gl.getUniformLocation(prog, 'u_warp'),
      dens: gl.getUniformLocation(prog, 'u_dens'),
      energy: gl.getUniformLocation(prog, 'u_energy'),
      octaves: gl.getUniformLocation(prog, 'u_octaves')
    };
  }

  compilePipeline();

  function resize() {
    const mult = getDynamicResolutionMultiplier();
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, Math.min(window.innerHeight, 1200));
    const maxW = Math.max(160, Math.floor(profile.bgMaxW * mult));
    const maxH = Math.max(110, Math.floor(profile.bgMaxH * mult));
    const scale = Math.min(profile.bgScale * mult, maxW / w, maxH / h);
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, listenerOptions);

  window.addEventListener('pointermove', (e) => {
    state.targetPtrX = e.clientX / Math.max(1, window.innerWidth);
    state.targetPtrY = 1.0 - e.clientY / Math.max(1, window.innerHeight);
  }, listenerOptions);

  window.addEventListener('scroll', () => {
    const maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    state.scroll = window.scrollY / maxS;
  }, listenerOptions);

  // Automatic Chapter Environmental Progression
  const chapters = document.querySelectorAll('[data-field-warp], [data-field-density], [data-field-energy]');
  let profileObserver;
  if (chapters.length) {
    profileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        controller.setProfile({
          warp: el.dataset.fieldWarp ? parseFloat(el.dataset.fieldWarp) : undefined,
          density: el.dataset.fieldDensity ? parseFloat(el.dataset.fieldDensity) : undefined,
          energy: el.dataset.fieldEnergy ? parseFloat(el.dataset.fieldEnergy) : undefined,
          focusX: el.dataset.fieldFocusX ? parseFloat(el.dataset.fieldFocusX) : undefined,
          focusY: el.dataset.fieldFocusY ? parseFloat(el.dataset.fieldFocusY) : undefined
        });
      });
    }, { threshold: 0.25 });
    chapters.forEach((ch) => profileObserver.observe(ch));
  }

  let displayObserver;
  const fieldScene = config.visibleAt ? document.querySelector(config.visibleAt) : null;
  if (fieldScene && typeof IntersectionObserver !== 'undefined') {
    controller.setPaused(true);
    displayObserver = new IntersectionObserver(([entry]) => {
      controller.setPaused(!entry.isIntersecting);
    }, {rootMargin:'80px 0px'});
    displayObserver.observe(fieldScene);
  }
  let elapsed = 0;
  state.active = true;

  const unregister = registerRenderTask('topography-bg', {
    exclusive: false,
    yieldToExclusive: true,
    isVisible: () => state.active && !state.paused,
    onScaleChange: () => resize(),
    render: (_now, dt) => {
      elapsed += dt;
      const k = 1 - Math.exp(-4.2 * dt);
      state.warp += (state.targetWarp - state.warp) * k;
      state.density += (state.targetDensity - state.density) * k;
      state.energy += (state.targetEnergy - state.energy) * k;
      state.focusX += (state.targetFocusX - state.focusX) * k;
      state.focusY += (state.targetFocusY - state.focusY) * k;
      state.ptrX += (state.targetPtrX - state.ptrX) * k;
      state.ptrY += (state.targetPtrY - state.ptrY) * k;

      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, elapsed);
      gl.uniform1f(U.scroll, state.scroll);
      gl.uniform2f(U.ptr, state.ptrX, state.ptrY);
      gl.uniform2f(U.focus, state.focusX, state.focusY);
      gl.uniform1f(U.warp, state.warp);
      gl.uniform1f(U.dens, state.density);
      gl.uniform1f(U.energy, state.energy);
      gl.uniform1i(U.octaves, profile.shaderOctaves);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  });

  // GPU Context Loss & Restoration Recovery
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    state.active = false;
    canvas.dataset.animationActive = 'false';
  }, {signal:inputListeners.signal});

  canvas.addEventListener('webglcontextrestored', () => {
    compilePipeline();
    resize();
    state.active = true;
    canvas.dataset.animationActive = 'true';
    wakeScheduler();
  }, {signal:inputListeners.signal});

  controller.dispose = () => {
    state.active = false;
    unregister();
    inputListeners.abort();
    displayObserver?.disconnect();
    profileObserver?.disconnect();
    gl.deleteProgram(prog);
    gl.deleteVertexArray(vao);
    gl.deleteBuffer(buf);
  };

  return controller;
}
