/* KIRJANE R2 immersive runtime. A missing optional bundle never breaks the seven
 * semantic documents; special preview builds replace the committed stub with Vite.
 */
import gsap from '../vendor/gsap/index.js';
import { ScrollTrigger } from '../vendor/gsap/ScrollTrigger.js';
import { startKineticsR2 } from './forge-kinetics-r2.js';

gsap.registerPlugin(ScrollTrigger);
const run=async()=>{
  if(window.__KIRJANE_R2_LOADER__)return;
  window.__KIRJANE_R2_LOADER__=true;
  try{startKineticsR2();}catch(error){console.warn('[Forge Immersive R2] GSAP treatments isolated:',error);}
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href=new URL('./forge-immersive-r2.css',import.meta.url).href;
  document.head.appendChild(style);
  try{
    const island=await import('./forge-immersive-r2.js');
    island.mountImmersive({gsap,ScrollTrigger});
  }catch(error){
    window.__KIRJANE_R2_ERROR__=String(error?.stack||error);
    console.warn('[Forge Immersive R2] React-island bundle unavailable; source HTML and fallback art remain usable.',error);
  }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
else run();
window.addEventListener('pageshow',(e)=>{if(e.persisted){window.__KIRJANE_R2_LOADER__=false;run();}});
