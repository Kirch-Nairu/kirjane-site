/**
 * Salryn Flagship Product — High-Velocity Instanced & Analytical Fresnel-Glass 3D Organism
 *
 * Visualizes:
 *   - 1 Unified Offline-First Salryn Kernel Nucleus (Draw Call 1)
 *   - 5 Merged Morphing Blown-Emerald Glass Harmonic Shells (Draw Call 2 — GPU Vertex Morphing)
 *   - 5 Merged Luminous Chartreuse Capillary Filaments (Draw Call 3 — GPU Signal Pulses)
 *   - 20 Instanced Orbital Nodes: 8 Architectural Engines + 12 Industry Families (Draw Call 4)
 *
 * Total Draw Calls per Frame: 4 (reduced from 11 in R1).
 * Zero PMREMGenerator cubemap convolution startup overhead.
 * Driven by the centralized Adaptive Quality & Unified Frame Scheduler (`adaptive-quality.js`).
 */
import * as THREE from '../vendor/three/three.module.js';
import {
  getQualityProfile,
  getDynamicResolutionMultiplier,
  registerRenderTask,
  wakeScheduler
} from './adaptive-quality.js';

function mergeGeometriesWithShellIndex(geometries) {
  let totalVerts = 0;
  let totalIndices = 0;
  geometries.forEach((g) => {
    totalVerts += g.attributes.position.count;
    totalIndices += g.index ? g.index.count : g.attributes.position.count;
  });

  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const shellIndices = new Float32Array(totalVerts);
  const indices = new Uint32Array(totalIndices);

  let vOffset = 0;
  let iOffset = 0;

  geometries.forEach((g, shellIdx) => {
    const pos = g.attributes.position;
    const norm = g.attributes.normal;
    const uv = g.attributes.uv;
    const count = pos.count;

    positions.set(pos.array, vOffset * 3);
    if (norm) normals.set(norm.array, vOffset * 3);
    if (uv) uvs.set(uv.array, vOffset * 2);
    shellIndices.fill(shellIdx, vOffset, vOffset + count);

    if (g.index) {
      const idxArr = g.index.array;
      for (let k = 0; k < idxArr.length; k++) {
        indices[iOffset + k] = idxArr[k] + vOffset;
      }
      iOffset += idxArr.length;
    } else {
      for (let k = 0; k < count; k++) {
        indices[iOffset + k] = vOffset + k;
      }
      iOffset += count;
    }
    vOffset += count;
    g.dispose();
  });

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  merged.setAttribute('a_shell', new THREE.BufferAttribute(shellIndices, 1));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  return merged;
}

const SHELL_VERTEX_GLSL = `
  attribute float a_shell;
  uniform float u_time;
  uniform float u_spread;
  uniform float u_twist;
  uniform float u_ringScale;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying float vShell;

  mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0,0.0,0.0, 0.0,c,-s, 0.0,s,c); }
  mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c,0.0,s, 0.0,1.0,0.0, -s,0.0,c); }
  mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c,-s,0.0, s,c,0.0, 0.0,0.0,1.0); }

  void main() {
    vUv = uv;
    vShell = a_shell;
    float idx = a_shell;
    float dir = mod(idx, 2.0) < 0.5 ? 1.0 : -1.0;

    float rx = 0.56 + idx * 0.36 + sin(u_time * 0.35 + idx) * 0.12 + u_spread * (idx - 2.0) * 0.25;
    float ry = -0.28 + idx * 0.52 + u_time * (0.09 + idx * 0.025) * dir;
    float rz = idx * 0.32 + u_twist * 0.18 * dir;
    float sc = min(1.18, u_ringScale * 0.93 + u_spread * (idx * 0.055));

    mat3 R = rotZ(rz) * rotY(ry) * rotX(rx);
    vec3 localPos = (R * position) * sc;
    vec3 localNorm = normalize(R * normal);

    vec4 mvPos = modelViewMatrix * vec4(localPos, 1.0);
    vNormal = normalize(normalMatrix * localNorm);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const GLASS_FRAGMENT_GLSL = `
  precision highp float;
  uniform float u_time;
  uniform float u_pulse;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying float vShell;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    float ndv = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndv, 2.35);

    vec3 L1 = normalize(vec3(0.55, 0.72, 0.42));
    vec3 L2 = normalize(vec3(-0.68, 0.25, -0.45));
    vec3 H1 = normalize(L1 + V);

    float diff1 = max(dot(N, L1), 0.0);
    float diff2 = max(dot(N, L2), 0.0);
    float spec = pow(max(dot(N, H1), 0.0), 42.0);

    vec3 cDeep  = vec3(0.025, 0.105, 0.072);
    vec3 cEmer  = vec3(0.075, 0.450, 0.305);
    vec3 cLime  = vec3(0.827, 0.965, 0.420);
    vec3 cWhite = vec3(0.955, 0.968, 0.935);

    float travel = 0.5 + 0.5 * sin(vUv.x * 6.28318 - u_time * 1.5 + vShell * 1.3);
    vec3 col = mix(cDeep, cEmer, 0.28 + 0.46 * diff1 + 0.22 * diff2);
    col = mix(col, cEmer * 1.24, fresnel * 0.85);
    col += cLime * (fresnel * travel * (0.22 + 0.18 * u_pulse));
    col += cWhite * (spec * 0.65);

    float alpha = clamp(0.78 + fresnel * 0.18 + spec * 0.20, 0.76, 0.96);
    gl_FragColor = vec4(col, alpha);
  }
`;

const FILAMENT_FRAGMENT_GLSL = `
  precision highp float;
  uniform float u_time;
  uniform float u_pulse;
  varying vec2 vUv;
  varying float vShell;

  void main() {
    float wave = 0.65 + 0.35 * sin(vUv.x * 6.28318 - u_time * 2.0 + vShell * 1.57);
    vec3 cEmer = vec3(0.11, 0.56, 0.38);
    vec3 cLime = vec3(0.83, 0.97, 0.42);
    vec3 col = mix(cEmer, cLime, 0.52 + 0.48 * wave * u_pulse);
    gl_FragColor = vec4(col, 0.86);
  }
`;

export function mountSalryn3DHero({ canvas, sectionEl, fallbackEl, initialProfile }) {
  const profile = getQualityProfile();
  if (!canvas || profile.tier === 'static') {
    if (canvas) canvas.style.display = 'none';
    if (fallbackEl) fallbackEl.style.opacity = '1';
    return { setMorphTarget() {}, dispose() {} };
  }

  let target3d = { ...(initialProfile || { spread: 0.0, twist: 0.0, ringScale: 1.0, pulse: 0.65, activeFlavor: -1 }) };
  let cur3d = { ...target3d };
  let ptrX = 0;
  let ptrY = 0;
  let targetPtrX = 0;
  let targetPtrY = 0;
  let visible = true;
  let contextLost = false;
  let disposed = false;
  const contextListeners = new AbortController();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: profile.tier !== 'constrained',
      alpha: true,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance'
    });
  } catch (_) {
    canvas.style.display = 'none';
    if (fallbackEl) fallbackEl.style.opacity = '1';
    return { setMorphTarget() {}, dispose() {} };
  }

  canvas.dataset.qualityTier = profile.tier;
  canvas.dataset.animationActive = 'true';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 16 / 10, 0.1, 100);

  const rig = new THREE.Group();
  scene.add(rig);

  // 1. Central Obsidian Kernel Core (Draw Call 1)
  const coreGeo = new THREE.IcosahedronGeometry(0.84, profile.tier === 'constrained' ? 2 : 3);
  const coreMat = new THREE.ShaderMaterial({
    uniforms: { u_pulse: { value: 0.65 } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float u_pulse;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        float ndv = clamp(abs(dot(N, V)), 0.0, 1.0);
        float rim = pow(1.0 - ndv, 2.8);
        vec3 L = normalize(vec3(0.4, 0.5, 0.78));
        float spec = pow(max(dot(N, normalize(L + V)), 0.0), 28.0);
        vec3 base = vec3(0.032, 0.070, 0.052);
        vec3 glow = vec3(0.827, 0.965, 0.420) * (spec * (0.45 + 0.35 * u_pulse) + rim * 0.28);
        vec3 emer = vec3(0.086, 0.482, 0.333) * (rim * 0.55);
        gl_FragColor = vec4(base + emer + glow, 1.0);
      }
    `
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  rig.add(coreMesh);

  // 2. Merged 5 Concentric Harmonic Blown-Emerald Glass Shells (Draw Call 2)
  const shellGeos = [];
  const filGeos = [];
  const radSegs = profile.torusRadial;
  const tubSegs = profile.torusTubular;

  for (let i = 0; i < 5; i++) {
    const tGeo = new THREE.TorusGeometry(1.18 + i * 0.31, 0.115 - i * 0.008, radSegs, tubSegs);
    const pos = tGeo.attributes.position;
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k);
      const a = Math.atan2(y, x);
      const w = 1.0 + 0.042 * Math.sin(a * (3 + (i % 2)) + i * 1.15);
      pos.setXYZ(k, x * w, y * w, z + 0.11 * Math.cos(a * (2 + (i % 3))));
    }
    tGeo.computeVertexNormals();
    shellGeos.push(tGeo);

    const fGeo = new THREE.TorusGeometry(1.18 + i * 0.31, 0.012, Math.max(6, Math.floor(radSegs * 0.5)), tubSegs);
    const fPos = fGeo.attributes.position;
    for (let k = 0; k < fPos.count; k++) {
      const x = fPos.getX(k), y = fPos.getY(k), z = fPos.getZ(k);
      const a = Math.atan2(y, x);
      const w = 1.0 + 0.042 * Math.sin(a * (3 + (i % 2)) + i * 1.15);
      fPos.setXYZ(k, x * w, y * w, z + 0.145 * Math.cos(a * (2 + (i % 3))));
    }
    filGeos.push(fGeo);
  }

  const sharedUniforms = {
    u_time: { value: 0 },
    u_spread: { value: cur3d.spread },
    u_twist: { value: cur3d.twist },
    u_ringScale: { value: cur3d.ringScale },
    u_pulse: { value: cur3d.pulse }
  };

  const mergedShellGeo = mergeGeometriesWithShellIndex(shellGeos);
  const glassMat = new THREE.ShaderMaterial({
    uniforms: sharedUniforms,
    vertexShader: SHELL_VERTEX_GLSL,
    fragmentShader: GLASS_FRAGMENT_GLSL,
    transparent: true,
    depthWrite: true
  });
  const shellsMesh = new THREE.Mesh(mergedShellGeo, glassMat);
  rig.add(shellsMesh);

  // 3. Merged 5 Chartreuse Filaments (Draw Call 3)
  const mergedFilGeo = mergeGeometriesWithShellIndex(filGeos);
  const filMat = new THREE.ShaderMaterial({
    uniforms: sharedUniforms,
    vertexShader: SHELL_VERTEX_GLSL,
    fragmentShader: FILAMENT_FRAGMENT_GLSL,
    transparent: true,
    depthWrite: false
  });
  const filamentsMesh = new THREE.Mesh(mergedFilGeo, filMat);
  rig.add(filamentsMesh);

  // 4. Instanced 20 Orbital Satellites: 8 Architectural Engines + 12 Industry Families (Draw Call 4)
  const NODE_COUNT = 20;
  const nodeGeo = new THREE.SphereGeometry(0.046, profile.tier === 'constrained' ? 8 : 14, profile.tier === 'constrained' ? 6 : 10);
  const nodeMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vColor;
      void main() {
        vColor = instanceColor;
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vColor;
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        float ndv = clamp(abs(dot(N, V)), 0.0, 1.0);
        float rim = pow(1.0 - ndv, 1.8);
        float core = pow(ndv, 3.0);
        vec3 col = mix(vec3(0.03, 0.08, 0.06), vColor, 0.35 + 0.65 * rim) + vColor * (core * 0.55);
        gl_FragColor = vec4(col, 0.94);
      }
    `,
    transparent: true
  });
  const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
  const dummy = new THREE.Object3D();
  const cLime = new THREE.Color(0xD3F66B);
  const cEmer = new THREE.Color(0x1D9B6B);
  for (let i = 0; i < NODE_COUNT; i++) {
    instancedNodes.setColorAt(i, i < 8 ? cLime : cEmer);
  }
  rig.add(instancedNodes);

  function updateSatellites(t) {
    const activeFlv = cur3d.activeFlavor ?? -1;
    for (let i = 0; i < NODE_COUNT; i++) {
      const isEngine = i < 8;
      const idx = isEngine ? i : i - 8;
      const count = isEngine ? 8 : 12;
      const baseAngle = (idx / count) * Math.PI * 2 + t * (isEngine ? 0.22 : -0.14);
      const radius = isEngine
        ? (1.35 + cur3d.spread * 0.25)
        : (2.42 + cur3d.spread * 0.48);
      const elev = Math.sin(baseAngle * (isEngine ? 2 : 3) + t * 0.6 + cur3d.twist) * (isEngine ? 0.42 : 0.78);
      dummy.position.set(
        Math.cos(baseAngle) * radius,
        elev,
        Math.sin(baseAngle) * radius * 0.65
      );
      const highlighted = activeFlv === -1 || (idx % 4 === activeFlv);
      const sc = isEngine
        ? (highlighted ? 1.18 : 0.72)
        : (highlighted ? 0.92 : 0.52);
      dummy.scale.setScalar(sc);
      dummy.rotation.set(t * 0.8 + i, t * 0.6, 0);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
  }
  updateSatellites(0);

  function resize3d() {
    const mult = getDynamicResolutionMultiplier();
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(1, rect.width);
    const cssH = Math.max(1, rect.height);
    const maxW = Math.max(220, Math.floor(profile.threeMaxW * mult));
    const maxH = Math.max(160, Math.floor(profile.threeMaxH * mult));
    const scale = Math.min(profile.threeScale * mult, maxW / cssW, maxH / cssH);
    const w = Math.max(1, Math.floor(cssW * scale));
    const h = Math.max(1, Math.floor(cssH * scale));
    const isMob = window.innerWidth <= 900;

    renderer.setPixelRatio(1);
    renderer.setSize(w, h, false);
    camera.aspect = cssW / cssH;
    camera.position.set(isMob ? 0 : 0.35, 0.9, isMob ? 10.25 : 10.7);
    camera.lookAt(isMob ? 0 : -0.75, isMob ? 0.1 : 0, 0);
    rig.position.set(isMob ? 0 : 1.48, isMob ? 0.2 : 0, 0);
    camera.updateProjectionMatrix();
  }
  resize3d();
  window.addEventListener('resize', resize3d, { passive: true });

  // Scroll-linked subtle camera depth traversal as user scrolls down toward Scene A
  let scrollDepth = 0;
  const syncScrollDepth = () => {
    const vh = Math.max(1, window.innerHeight || 900);
    scrollDepth = Math.min(1, Math.max(0, window.scrollY / (vh * 0.95)));
    wakeScheduler();
  };
  window.addEventListener('scroll', syncScrollDepth, { passive: true });

  const onPointerMove = (e) => {
    targetPtrX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 0.24;
    targetPtrY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 0.18;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  if (fallbackEl) fallbackEl.style.opacity = '0';

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    canvas.dataset.animationActive = String(visible && !contextLost);
    if (visible) wakeScheduler();
  }, { threshold: 0.03 });
  if (sectionEl) io.observe(sectionEl);

  let elapsed = 0;
  const unregister = registerRenderTask('salryn-3d-hero', {
    exclusive: true,
    yieldToExclusive: false,
    isVisible: () => visible && !contextLost,
    onScaleChange: () => resize3d(),
    render: (_now, dt) => {
      elapsed += dt;
      const k = 1 - Math.exp(-4.2 * dt);
      cur3d.spread += (target3d.spread - cur3d.spread) * k;
      cur3d.twist += (target3d.twist - cur3d.twist) * k;
      cur3d.ringScale += (target3d.ringScale - cur3d.ringScale) * k;
      cur3d.pulse += (target3d.pulse - cur3d.pulse) * k;
      ptrX += (targetPtrX - ptrX) * k;
      ptrY += (targetPtrY - ptrY) * k;

      rig.rotation.y = elapsed * 0.16 + cur3d.twist * 0.42 + ptrX + scrollDepth * 0.38;
      rig.rotation.x = ptrY + scrollDepth * 0.12;
      rig.position.z = scrollDepth * 2.1;

      sharedUniforms.u_time.value = elapsed;
      sharedUniforms.u_spread.value = cur3d.spread;
      sharedUniforms.u_twist.value = cur3d.twist;
      sharedUniforms.u_ringScale.value = cur3d.ringScale;
      sharedUniforms.u_pulse.value = cur3d.pulse;
      coreMat.uniforms.u_pulse.value = cur3d.pulse;

      updateSatellites(elapsed);
      renderer.render(scene, camera);
    }
  });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    contextLost = true;
    canvas.dataset.animationActive = 'false';
    if (fallbackEl) fallbackEl.style.opacity = '1';
  }, {signal:contextListeners.signal});

  canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    canvas.dataset.animationActive = String(visible);
    if (fallbackEl) fallbackEl.style.opacity = '0';
    resize3d();
    wakeScheduler();
  }, {signal:contextListeners.signal});

  function dispose() {
    if (disposed) return;
    disposed = true;
    contextListeners.abort();
    unregister();
    io.disconnect();
    window.removeEventListener('resize', resize3d);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', syncScrollDepth);
    coreGeo.dispose();
    coreMat.dispose();
    mergedShellGeo.dispose();
    glassMat.dispose();
    mergedFilGeo.dispose();
    filMat.dispose();
    nodeGeo.dispose();
    nodeMat.dispose();
    if (typeof instancedNodes.dispose === 'function') instancedNodes.dispose();
    renderer.dispose();
  }

  return {
    setMorphTarget(nextProfile, activeFlavorIdx = -1) {
      target3d = { ...nextProfile, activeFlavor: activeFlavorIdx };
      wakeScheduler();
    },
    getRenderStats() {
      const {render,memory} = renderer.info;
      return {calls:render.calls,triangles:render.triangles,geometries:memory.geometries,textures:memory.textures};
    },
    dispose
  };
}
