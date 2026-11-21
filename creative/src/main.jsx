/**
 * KIRJANE Creative Forge / Immersive R2.
 * React islands only: React Bits BlurText + R3F living kernel.
 * Seven authoritative HTML pages, native forms and navigation remain intact.
 * Actual upstream React Bits source in ./vendor/BlurText.jsx.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, MathUtils } from 'three';
import Lenis from 'lenis';
import BlurText from './vendor/BlurText.jsx';
import './islands.css';

const ENGINE_NAMES = [
  'Commerce', 'Inventory', 'Procurement', 'Financial',
  'Workforce', 'Operations', 'Security', 'Infrastructure'
];
const ENGINE_CAP_IDS = [
  'cap-commerce','cap-inventory','cap-procurement','cap-financial',
  'cap-workforce','cap-operations','security-core','infra-core'
];
const CHAPTERS = [
  ['ORDER', 'A verified request enters the shared kernel.'],
  ['STOCK', 'Inventory custody updates once per movement.'],
  ['AUTHORITY', 'The right role signs the consequential change.'],
  ['LEDGER', 'The result becomes part of a traceable financial record.'],
  ['RESOLUTION', 'Every team sees the same settled state.']
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(location.search).has('reduce'));
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(q.matches || new URLSearchParams(location.search).has('reduce'));
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);
  return reduced;
}

function OpticalNode({ index, selected, active, reduced }) {
  const group = useRef();
  const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
  const r = 2.38;
  const y = (index % 2 ? -.20 : .20);
  useFrame((state, delta) => {
    if (!group.current || reduced) return;
    const target = selected === index ? 1.24 : 1;
    const scale = MathUtils.damp(group.current.scale.x, target, 5.5, Math.min(delta, .05));
    group.current.scale.setScalar(scale);
  });
  const base = index >= 6 ? '#d3f66b' : active ? '#63e6a6' : '#235842';
  return (
    <group ref={group} position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}>
      <mesh>
        <icosahedronGeometry args={[index >= 6 ? .38 : .31, 2]} />
        <meshPhysicalMaterial
          color={base} metalness={active ? .42 : .15} roughness={.18}
          transmission={active ? .55 : .15} thickness={1.8}
          clearcoat={1} clearcoatRoughness={.09}
          emissive={base} emissiveIntensity={active ? .30 : .08} />
      </mesh>
      <mesh rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[.47, .014, 8, 64]} />
        <meshBasicMaterial color={active ? '#d5efb7' : '#4a7462'} transparent opacity={active ? .70 : .2}/>
      </mesh>
    </group>
  );
}
function KernelObject({ active, selected, reduced, gsap }) {
  const core = useRef();
  const midRing = useRef();
  const motionRef = useRef({ x:0, y:0 });
  useFrame((state, delta) => {
    if (!core.current) return;
    if (reduced) {
      core.current.rotation.y = 0;
      core.current.rotation.x = -.08;
    } else {
      const time = state.clock.elapsedTime;
      const desired = time * .055 + motionRef.current.x * .10;
      core.current.rotation.y = MathUtils.damp(core.current.rotation.y, desired, .6, Math.min(delta,.05));
      core.current.rotation.x = MathUtils.damp(core.current.rotation.x, -.12 + motionRef.current.y * .07, 1.5, Math.min(delta,.05));
      if (midRing.current) midRing.current.rotation.z = time * -.065;
    }
  });
  useEffect(() => {
    const move = (e) => {
      motionRef.current.x = ((e.clientX / innerWidth) - .5) * 2;
      motionRef.current.y = ((e.clientY / innerHeight) - .5) * 2;
    };
    if (!reduced) window.addEventListener('pointermove', move, {passive:true});
    return () => window.removeEventListener('pointermove', move);
  }, [reduced]);
  return (
    <group ref={core} rotation={[-.12,-.22,0]}>
      <mesh>
        <icosahedronGeometry args={[1.17, 4]} />
        <meshPhysicalMaterial color="#136447" metalness={.45} roughness={.12}
          transmission={.56} thickness={2.3} ior={1.35}
          clearcoat={1} clearcoatRoughness={.04}
          emissive="#10533c" emissiveIntensity={.28} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[.64, 3]}/>
        <meshStandardMaterial color="#c3f56a" emissive="#74bb37" emissiveIntensity={.72} metalness={.64} roughness={.18}/>
      </mesh>
      <mesh ref={midRing} rotation={[1.1,0,0]}>
        <torusGeometry args={[1.61,.044,12,128]}/>
        <meshPhysicalMaterial color="#e3fac2" metalness={.74} roughness={.13} clearcoat={1}
          emissive="#c1f879" emissiveIntensity={.20}/>
      </mesh>
      <mesh rotation={[Math.PI/2.5,0,0]}>
        <torusGeometry args={[1.83,.018,8,128]}/>
        <meshBasicMaterial color="#7fc3b3" transparent opacity={.62}/>
      </mesh>
      {active.map((enabled,i)=>(
        <OpticalNode key={i} index={i} selected={selected} active={enabled} reduced={reduced}/>
      ))}
    </group>
  );
}
function Tick({ active, reduced, gsap }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!active || reduced || document.hidden) { invalidate(); return; }
    // Integrates R3F demand rendering with the one owner GSAP ticker. No new
    // explicitly-owned animation interval is installed.
    const render = () => invalidate();
    gsap.ticker.add(render);
    return () => gsap.ticker.remove(render);
  }, [active,reduced,gsap,invalidate]);
  return null;
}
function KernelScene({ active, selected, reduced, visible, gsap, onCreated }) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{position:[0,1.15,7.4],fov:39,near:.1,far:50}}
      dpr={[1, 1.45]}
      frameloop="demand"
      gl={{antialias:false,alpha:true,powerPreference:'high-performance'}}
      onCreated={onCreated}
      fallback={<div className="forge-r3f-fallback">A static architecture view is available.</div>}
    >
      <ambientLight intensity={1.3}/>
      <hemisphereLight args={['#d3f66b','#0b3e2b',1.3]}/>
      <pointLight position={[2,4,3]} intensity={45} color="#c4ffc2"/>
      <pointLight position={[-4,-2,-2]} intensity={38} color="#2ebc91"/>
      <KernelObject active={active} selected={selected} reduced={reduced} gsap={gsap}/>
      <Tick active={visible} reduced={reduced} gsap={gsap}/>
    </Canvas>
  );
}
function getSelectedCapabilities() {
  const active = ENGINE_CAP_IDS.map((id,i) => {
    if (i >= 6) return true;
    return document.querySelector('[data-cap-id="' + id + '"]')?.getAttribute('aria-pressed') === 'true';
  });
  // The lab has no external config controls, so show all active there.
  return document.querySelector('#scene-d-cap-grid') ? active : Array(8).fill(true);
}
function KernelIsland({ host, gsap, isLab }) {
  const reduced = useReducedMotion();
  const [active,setActive] = useState(getSelectedCapabilities);
  const [selected,setSelected] = useState(6);
  const [chapter,setChapter] = useState(0);
  const [visible,setVisible] = useState(true);
  const [ready,setReady] = useState(false);
  const [contextLost,setContextLost] = useState(false);
  useEffect(() => {
    const grid = document.getElementById('scene-d-cap-grid');
    if (!grid) return;
    const obs = new MutationObserver(() => setActive(getSelectedCapabilities()));
    obs.observe(grid,{attributes:true,attributeFilter:['aria-pressed'],subtree:true});
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries.some(e=>e.isIntersecting)),
      {rootMargin:'150px 0px'});
    observer.observe(host);
    const gone=()=>setVisible(!document.hidden);
    document.addEventListener('visibilitychange', gone);
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',gone);};
  },[host]);
  useEffect(() => {
    const contextLostHandler=(e)=>{e.preventDefault();setContextLost(true);setReady(false);};
    const canvas=host.querySelector('canvas');
    canvas?.addEventListener('webglcontextlost',contextLostHandler);
    return ()=>canvas?.removeEventListener('webglcontextlost',contextLostHandler);
  },[ready,host]);
  useEffect(() => { host.dataset.forgeReady = ready ? 'true' : 'false'; },[ready,host]);
  const count=active.filter(Boolean).length;
  const lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canRender = !contextLost && !lowPower;
  return (
    <div className="forge-kernel-shell">
      <div className="forge-kernel-top"><span>CORE / 001</span><span>INTERACTIVE ARCHITECTURE</span><span>{count.toString().padStart(2,'0')} / 08</span></div>
      <div className="forge-kernel-visual" role="img" aria-label="Interactive three-dimensional visualization of eight connected Salryn architectural engines and a central kernel.">
        <div className="forge-kernel-orbit forge-orbit-a" aria-hidden="true"></div>
        <div className="forge-kernel-orbit forge-orbit-b" aria-hidden="true"></div>
        {canRender ? (
          <KernelScene active={active} selected={selected} reduced={reduced} visible={visible}
            gsap={gsap} onCreated={()=>{setReady(true);setContextLost(false);}}/>
        ) : <div className="forge-kernel-static" aria-hidden="true">SALRYN <small>ONE FOUNDATION</small></div>}
        <span className="forge-kernel-glow" aria-hidden="true"></span>
      </div>
      <div className="forge-kernel-legend">
        <div><span className="forge-kernel-kicker">SELECTED ENGINE</span><strong>{ENGINE_NAMES[selected]}</strong><p>{selected >= 6 ? 'Mandatory foundation. Cannot be switched off.' : (active[selected] ? 'Enabled in this illustrative configuration.' : 'Optional engine not selected.')}</p></div>
        <div className="forge-kernel-controls" role="group" aria-label="Inspect eight Salryn engines">
          {ENGINE_NAMES.map((name,i)=>(
            <button key={name} type="button" className={selected===i?'is-current':''}
              onClick={()=>setSelected(i)} aria-pressed={selected===i}
              aria-label={'Inspect '+name+' engine'} title={name}>
              <span>{String(i+1).padStart(2,'0')}</span>
            </button>
          ))}
        </div>
      </div>
      {isLab && <div className="forge-narrative">
        <span className="forge-kernel-kicker">STEP / {String(chapter+1).padStart(2,'0')}</span>
        <BlurText key={chapter} text={CHAPTERS[chapter][0]} animateBy="letters" trigger="load" delay={35}
          effect="blur" className="forge-narrative-title"/>
        <p>{CHAPTERS[chapter][1]}</p>
        <div className="forge-narrative-actions">
          <button type="button" onClick={()=>setChapter((c)=>Math.max(0,c-1))} disabled={chapter===0}>Previous</button>
          <button type="button" onClick={()=>setChapter((c)=>(c+1)%CHAPTERS.length)}>Next stage</button>
        </div>
      </div>}
    </div>
  );
}

function BlurLine({ host }) {
  const text=host.getAttribute('data-forge-text') || host.textContent.trim() || 'Built beyond the ordinary.';
  const reduced=useReducedMotion();
  if(reduced) return <p className="forge-bits-plain">{text}</p>;
  return <BlurText text={text} animateBy="words" trigger="view" delay={85}
    effect="blur" blur={13} distance={38}
    className="forge-bits-line" />;
}
const roots = new Map();
let smooth=null;
let smoothTick=null;
let started=false;
let intersection=null;
let anchorHandler=null;
let pagehideHandler=null;

export function mountImmersive({gsap,ScrollTrigger}) {
  if(started) return;
  started=true;
  document.documentElement.dataset.forgeImmersive = 'r2';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canLoad3D=()=>{
    const capable=typeof window.WebGL2RenderingContext !== 'undefined';
    return capable && !(navigator.deviceMemory && navigator.deviceMemory <= 2);
  };
  const hosts=Array.from(document.querySelectorAll('[data-forge-react-island]'));
  intersection=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{
      if(!isIntersecting || roots.has(target))return;
      const type=target.dataset.forgeReactIsland;
      // Only one source of truth for GPU scenes. This page mounts exactly one
      // kernel scene, while ornamental text effects use DOM/WAAPI only.
      if(type==='kernel' && !canLoad3D())target.dataset.forgeStatic='true';
      const root=createRoot(target);
      roots.set(target,root);
      root.render(type==='kernel'
        ? <KernelIsland host={target} gsap={gsap} isLab={!!document.querySelector('[data-motion-lab]')}/>
        : <BlurLine host={target}/>);
    });
  },{rootMargin:'250px 0px'});
  hosts.forEach(h=>intersection.observe(h));
  const page=document.body.dataset.page;
  const controlledPages=['services','projects','about','contact'];
  // The Home, Salryn and Process directors own native pin/scrub choreography.
  // Lenis is intentionally restricted to unconstrained pages and desktop pointers.
  if(controlledPages.includes(page) &&
      matchMedia('(min-width: 1100px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches &&
      !new URLSearchParams(location.search).has('reduce') &&
      !window.__KIRJANE_LENIS_INSTANCE__) {
    try {
      smooth=new Lenis({autoRaf:false,smoothWheel:true,syncTouch:false,anchors:true,
        lerp:.085,wheelMultiplier:.86,touchMultiplier:1});
      window.__KIRJANE_LENIS_INSTANCE__=smooth;
      smooth.on('scroll',ScrollTrigger.update);
      smoothTick=time=>smooth?.raf(time*1000);
      gsap.ticker.add(smoothTick);
      ScrollTrigger.refresh();
    } catch(e){console.warn('[Forge R2] Lenis skipped:',e);smooth?.destroy();smooth=null;}
  }
  anchorHandler=(e)=>{
    const link=e.target.closest?.('a[href^="#"]');
    if(!link || !smooth)return;
    const id=decodeURIComponent(link.hash.slice(1));
    const destination=document.getElementById(id);
    if(destination){e.preventDefault();smooth.scrollTo(destination,{offset:-88});history.pushState(null,'','#'+id);}
  };
  document.addEventListener('click',anchorHandler);
  pagehideHandler=()=>disposeImmersive({gsap});
  window.addEventListener('pagehide',pagehideHandler,{once:true});
  window.__KIRJANE_R2__={version:'R2',reactBits:'upstream BlurText',r3f:true,lenis:!!smooth,dispose:pagehideHandler};
}
export function disposeImmersive({gsap}) {
  intersection?.disconnect();
  intersection=null;
  document.removeEventListener('click',anchorHandler);
  if(pagehideHandler)window.removeEventListener('pagehide',pagehideHandler);
  if(smoothTick){gsap.ticker.remove(smoothTick);smoothTick=null;}
  smooth?.destroy();smooth=null;
  delete window.__KIRJANE_LENIS_INSTANCE__;
  roots.forEach(root=>root.unmount());
  roots.clear();
  delete document.documentElement.dataset.forgeImmersive;
  delete window.__KIRJANE_R2__;
  started=false;
}
