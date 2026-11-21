/**
 * KIRJANE Immersive R2 — coordinated static-document scrollytelling.
 * GSAP and ScrollTrigger reuse the accepted existing local vendor modules.
 * This module never touches the accepted scene director / frame player state.
 */
import gsap from '../vendor/gsap/index.js';
import { ScrollTrigger } from '../vendor/gsap/ScrollTrigger.js';
gsap.registerPlugin(ScrollTrigger);

const rm=matchMedia('(prefers-reduced-motion: reduce)');
const reduce=()=>rm.matches || new URLSearchParams(location.search).has('reduce');
let ctx=null, listeners=null, observer=null, live=false;
const qs=(s,root=document)=>root.querySelector(s);
const qsa=(s,root=document)=>Array.from(root.querySelectorAll(s));
function event(element,name,fn,opts){element?.addEventListener(name,fn,{...opts,signal:listeners.signal});}
function motion(el,vars={}){if(el&&!reduce())gsap.from(el,{...vars});}
function sceneIntro(el) {
 if(!el) return;
 const id=el.id||el.getAttribute('aria-label')||'chapter';
 const label=document.createElement('span');
 label.className='forge-scene-index';
 label.setAttribute('aria-hidden','true');
 label.innerHTML='<i></i><b> / '+id.replace(/[^a-z0-9 -]/gi,' ').slice(0,25).toUpperCase()+'</b>';
 el.prepend(label);
 if(!reduce())gsap.fromTo(label,{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.65,
  scrollTrigger:{trigger:el,start:'top 82%',once:true},clearProps:'transform,opacity,visibility'});
}
function instrumentProgress() {
 const progress=document.createElement('div');
 progress.className='forge-page-track';
 progress.setAttribute('aria-hidden','true');
 progress.innerHTML='<span class="forge-page-track-fill"></span>';
 document.body.appendChild(progress);
 const bar=progress.firstElementChild;
 if(!reduce())gsap.to(bar,{
  scaleY:1,ease:'none',
  scrollTrigger:{trigger:document.documentElement,start:'top top',end:'bottom bottom',scrub:.3}
 });
 else bar.style.transform='scaleY(0)';
 return ()=>progress.remove();
}
function injectIndex() {
 const page=document.body.dataset.page ||
   location.pathname.split('/').filter(Boolean).at(-1)?.replace('.html','') || 'home';
 document.documentElement.dataset.forgePage=page;
 const el=document.createElement('div');
 el.className='forge-page-chapter';
 el.setAttribute('aria-hidden','true');
 el.innerHTML='<span>0'+['home','salryn','services','projects','process','about','contact'].indexOf(page).toString()+'</span><strong>'+page.toUpperCase()+'</strong>';
 document.body.appendChild(el);
 return ()=>el.remove();
}
function interactiveMagnet() {
 if(reduce()||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 qsa('.link-editorial,.asc-action,.explore-cue,.forge-cta-chip').forEach(el=>{
  event(el,'pointermove',ev=>{
   const r=el.getBoundingClientRect();
   const dx=((ev.clientX-r.left)/r.width-.5)*12;
   const dy=((ev.clientY-r.top)/r.height-.5)*10;
   gsap.to(el,{x:dx,y:dy,duration:.28,ease:'power2.out',overwrite:'auto'});
  });
  event(el,'pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.45,ease:'power3.out',overwrite:'auto',clearProps:'transform'}));
 });
}
function drawCircuit() {
 const host=qs('.asc-workflow-scene');
 if(!host || qs('.forge-flow-circuit',host))return;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 920 500');
 svg.setAttribute('class','forge-flow-circuit');
 svg.setAttribute('role','presentation');
 svg.setAttribute('aria-hidden','true');
 svg.innerHTML='<defs><linearGradient id="forge-flow-light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d3f66b"/><stop offset="1" stop-color="#26c7b4"/></linearGradient></defs>'+
  '<path class="forge-signal-route" d="M80,285 C200,285 220,110 355,110 S575,420 735,282 L845,282" fill="none" stroke="url(#forge-flow-light)" stroke-width="3"/>'+
  '<path class="forge-signal-route" d="M80,285 C210,285 220,400 355,400 S650,110 750,205 L845,205" fill="none" stroke="#74b99e" stroke-width="2"/>'+
  ['80,285','355,110','355,400','745,282','845,205'].map((p,i)=>{
    const [x,y]=p.split(',');return '<circle class="forge-signal-dot" cx="'+x+'" cy="'+y+'" r="'+(i===0?11:8)+'" fill="'+(i===0?'#d3f66b':'#76f1ca')+'"/>';
  }).join('');
 host.appendChild(svg);
 if(!reduce())qsa('.forge-signal-route',svg).forEach(path=>{
  const len=path.getTotalLength();
  gsap.fromTo(path,{strokeDasharray:len,strokeDashoffset:len},{
    strokeDashoffset:0,duration:1.8,ease:'none',
    scrollTrigger:{trigger:host,start:'top 85%',end:'bottom 30%',scrub:1}
  });
 });
}
function home() {
 const hero=qs('.home-hero');
 if(!hero)return;
 hero.classList.add('forge-hero');
 const copy=qs('.hero-copy-col h1',hero);
 const subtitle=qs('.hero-copy-col .lead',hero);
 if(copy){
  const number=document.createElement('span');number.className='forge-hero-lettering';
  number.setAttribute('aria-hidden','true');number.textContent='K / 26';
  copy.insertAdjacentElement('beforebegin',number);
 }
 if(!reduce()) {
  const art=qs('.hero-sculpture-layer img',hero);
  const scrim=qs('.hero-scrim',hero);
  if(art)gsap.to(art,{scale:1.11,xPercent:3,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.15}});
  if(scrim)gsap.to(scrim,{opacity:.55,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
  const letters=qs('.forge-hero-lettering',hero);
  motion(letters,{opacity:0,x:-20,duration:.9,delay:.6});
  motion(subtitle,{opacity:.6,y:18,duration:.9,delay:.25,clearProps:'transform,opacity'});
 }
 sceneIntro(qs('#salryn-exhibition'));
 sceneIntro(qs('#capabilities-exhibition'));
 sceneIntro(qs('#home-process-section'));
}
function salryn(){
 sceneIntro(qs('#scene-b-anatomy'));
 sceneIntro(qs('#scene-d-activation'));
 sceneIntro(qs('#scene-f-independence'));
 const host=qs('#scene-d-activation');
 if(!host)return;
 // Preserve real capability toggles while giving their selection a dimensional response.
 qsa('.cap-toggle',host).forEach(btn=>{
  event(btn,'pointerenter',()=>{if(!reduce())gsap.to(btn,{y:-4,duration:.24,overwrite:'auto'});});
  event(btn,'pointerleave',()=>{if(!reduce())gsap.to(btn,{y:0,duration:.4,overwrite:'auto',clearProps:'transform'});});
 });
}
function services() {
 sceneIntro(qs('#custom-software'));
 sceneIntro(qs('#process-automation'));
 sceneIntro(qs('#systems-integration'));
 sceneIntro(qs('#infrastructure'));
 drawCircuit();
 if(!reduce())qsa('.asc-service-plate').forEach((plate,i)=>{
  gsap.fromTo(plate,{clipPath:'inset(9% 6% round 2px)',scale:.975},{
   clipPath:'inset(0% 0% round 2px)',scale:1,ease:'none',
   scrollTrigger:{trigger:plate,start:'top 92%',end:'center 55%',scrub:.9}
  });
 });
}
function projects(){
 const gallery=qs('.projects-gallery');
 if(!gallery)return;
 sceneIntro(gallery);
 if(!reduce()){
  qsa('.project-study, .project-fallback article',gallery).forEach((card,i)=>{
   gsap.fromTo(card,{y:24,opacity:.68},{y:0,opacity:1,ease:'none',
    scrollTrigger:{trigger:card,start:'top bottom',end:'top 55%',scrub:.8}
   });
  });
 }
}
function process(){
 const journey=qs('#process-journey');
 if(!journey)return;
 sceneIntro(journey);
 const line=qs('.asc-process-map',journey);
 if(line&&!reduce())gsap.fromTo(line,{clipPath:'inset(0 0 15% 0)'},{clipPath:'inset(0 0 0% 0)',ease:'none',
  scrollTrigger:{trigger:journey,start:'top 85%',end:'center 40%',scrub:1}});
}
function about() {
 sceneIntro(qs('.about-reading'));
 sceneIntro(qs('.about-ethos'));
 if(!reduce())qsa('.about-principles dt').forEach((heading,i)=>{
  gsap.fromTo(heading,{x:-22,opacity:.55},{x:0,opacity:1,duration:.85,ease:'power3.out',
   scrollTrigger:{trigger:heading,start:'top 86%',once:true},clearProps:'transform,opacity'}
  );
 });
}
function contact(){
 sceneIntro(qs('.contact-brief'));
 const title=qs('#contact-title');
 if(title&&!reduce())motion(title,{opacity:.6,y:20,duration:.9,clearProps:'transform,opacity'});
}
export function startKineticsR2(){
 if(live)return;
 live=true;
 listeners=new AbortController();
 document.documentElement.classList.add('forge-immersive-r2');
 const clean=[];
 clean.push(instrumentProgress(),injectIndex());
 const page=document.body.dataset.page||location.pathname.split('/').filter(Boolean).at(-1)?.replace('.html','')||'home';
 ctx=gsap.context(()=>{
  interactiveMagnet();
  ({home,salryn,services,projects,process,about,contact}[page]||(()=>{}))();
 },document);
 const resize=()=>ScrollTrigger.refresh();
 event(window,'load',resize,{once:true});
 const restore=()=>{document.documentElement.classList.remove('forge-immersive-r2');delete document.documentElement.dataset.forgePage;ctx?.revert();listeners.abort();clean.forEach(fn=>fn());live=false;ctx=null;};
 event(window,'pagehide',restore);
 window.__KIRJANE_KINETICS_R2__={stop:restore};
}
