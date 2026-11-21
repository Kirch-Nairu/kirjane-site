/**
 * R3 owner-shot capture harness. Recreates the approximate CURRENT R2 states
 * from local rendered source. It does NOT claim to reproduce the user's exact
 * original Windows screenshots, and it is not a functional test suite.
 *
 * Examples:
 * QWEN_R3_DIST=dist/qwen-r3-baseline-001 QWEN_R3_SHOTS=dist/qwen-r3-evidence/baseline node scripts/qwen_r3_capture.mjs
 * QWEN_R3_DIST=dist/qwen-r3-candidate-001 QWEN_R3_SHOTS=dist/qwen-r3-evidence/candidate node scripts/qwen_r3_capture.mjs
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { resolve, join, relative } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const dist = resolve(process.env.QWEN_R3_DIST || 'dist/qwen-r3-baseline-001');
const output = resolve(process.env.QWEN_R3_SHOTS || 'dist/qwen-r3-evidence/baseline');
const port = Number(process.env.QWEN_R3_PORT || 41948);
const origin = 'http://127.0.0.1:' + port;
const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
if (!existsSync(join(dist, 'index.html'))) throw Error('Build the source preview first. Missing ' + join(dist, 'index.html'));
mkdirSync(output, { recursive: true });
const scenes = [
  { id:'01', label:'Home — fragments / complexity', path:'/', selector:'#complexity-clarity-scene', phase:.14, width:1440,height:900 },
  { id:'02', label:'Home — clarity / resolved core', path:'/', selector:'#complexity-clarity-scene', phase:.87, width:1440,height:900 },
  { id:'03', label:'Home — engineering capability exhibition', path:'/', selector:'#capabilities-exhibition', phase:.24, width:1440,height:900 },
  { id:'04', label:'Home — process from complexity to clarity', path:'/', selector:'#home-process-section', phase:.32, width:1440,height:900 },
  { id:'05', label:'Salryn — hero core introduction', path:'/salryn/', selector:'.salryn-hero', phase:.12, width:1440,height:900 },
  { id:'06', label:'Salryn — different workspaces shared records', path:'/salryn/', selector:'#scene-a-kernel', phase:.52, width:1440,height:900 },
  { id:'07', label:'Salryn — specialization evolution', path:'/salryn/', selector:'#scene-a-kernel', phase:.9, width:1440,height:900 },
  { id:'08', label:'Salryn — industry/flavor selection', path:'/salryn/', selector:'#scene-c-flavors', phase:.18, width:1440,height:900 },
  { id:'09', label:'Salryn — eight-engine capability activation', path:'/salryn/', selector:'#scene-d-activation', phase:.24, width:1440,height:900 },
  { id:'10', label:'Salryn — offline-first simulation', path:'/salryn/', selector:'#scene-f-independence', phase:.18, width:1440,height:900 }
];
const extra = [
  {id:'m03',label:'Home services at phone width',path:'/',selector:'#capabilities-exhibition',phase:.24,width:390,height:844},
  {id:'m04',label:'Home process at phone width',path:'/',selector:'#home-process-section',phase:.32,width:390,height:844},
  {id:'m08',label:'Salryn industry at phone width',path:'/salryn/',selector:'#scene-c-flavors',phase:.18,width:390,height:844},
  {id:'m09',label:'Salryn configurator at phone width',path:'/salryn/',selector:'#scene-d-activation',phase:.24,width:390,height:844},
  {id:'m10',label:'Salryn offline at phone width',path:'/salryn/',selector:'#scene-f-independence',phase:.18,width:390,height:844}
];
const all = [...scenes, ...extra];
const captures=[], failures=[];
const server = spawn(python,['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dist],{stdio:'ignore'});
let browser;
async function waitServer(){
 for(let i=0;i<65;i++){
   try{if((await fetch(origin+'/')).ok)return;}catch{}
   await new Promise(r=>setTimeout(r,200));
 }
 throw Error('Local preview server did not start: ' + origin);
}
function safeName(s){return s.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase().slice(0,65)}
async function settle(page) {
 await page.evaluate(async()=>{
   await document.fonts.ready;
   const visible = [...document.images].filter(im=>{
     const r=im.getBoundingClientRect();
     return r.bottom >= -innerHeight && r.top <= 2*innerHeight;
   });
   visible.forEach(im=>{ im.loading='eager' });
   await Promise.all(visible.map(im=>im.decode().catch(()=>null)));
   await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));
 });
 await page.waitForTimeout(700);
}
async function seek(page, selector, phase){
 const geometry=await page.evaluate(({selector,phase})=>{
  const el=document.querySelector(selector);
  if(!el)return null;
  const top=el.getBoundingClientRect().top+window.scrollY;
  const height=el.getBoundingClientRect().height;
  const range=Math.max(0,height-window.innerHeight);
  const target=Math.min(Math.max(0,top+range*phase),Math.max(0,document.documentElement.scrollHeight-window.innerHeight));
  window.scrollTo({top:target,behavior:'instant'});
  return {top,height,range,target,phase};
 },{selector,phase});
 if(!geometry)throw Error('Missing source selector: '+selector);
 await page.waitForTimeout(450);
 return geometry;
}
async function record(scene){
 const context=await browser.newContext({
  viewport:{width:scene.width,height:scene.height},deviceScaleFactor:1,
  reducedMotion:process.env.QWEN_R3_REDUCE==='1'?'reduce':'no-preference'
 });
 await context.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e).slice(0,240)));
 const path=scene.path;
 try{
  const response=await page.goto(origin+path,{waitUntil:'domcontentloaded',timeout:25000});
  if(!response?.ok())throw Error('HTTP '+response?.status()+' for '+path);
  const skip=page.locator('.ignition-skip');
  if(path==='/' && await skip.isVisible().catch(()=>false)) {
    await skip.click({timeout:1000}).catch(()=>{});
  }
  const g=await seek(page,scene.selector,scene.phase);
  await settle(page);
  const state=await page.evaluate(({selector})=>{
    const el=document.querySelector(selector);
    const r=el?.getBoundingClientRect();
    return {
      sceneRect:r?{x:r.x,y:r.y,w:r.width,h:r.height}:null,
      scrollY:scrollY,scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth,
      reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
      forgeRuntime:!!window.__KIRJANE_R2__,loadingError:window.__KIRJANE_R2_ERROR__?.slice(0,180)||null
    };
  },{selector:scene.selector});
  const filename=scene.id+'-'+safeName(scene.label)+'.png';
  await page.screenshot({path:join(output,filename),fullPage:false,animations:'disabled'});
  captures.push({id:scene.id,label:scene.label,file:filename,path,selector:scene.selector,
    requestedPhase:scene.phase,viewport:[scene.width,scene.height],geometry:g,state,
    errors,warning:'Approximation of owner screenshot from local browser source; not original uploaded image.'});
 }catch(error){failures.push({id:scene.id,label:scene.label,error:String(error?.stack||error)});}
 finally{await context.close();}
}
function makeHTML(){
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cards=captures.map(c=>'<figure><a href="'+esc(c.file)+'"><img src="'+esc(c.file)+'" loading="lazy" alt="'+esc(c.label)+'"></a>'+
  '<figcaption><strong>'+esc(c.id)+': '+esc(c.label)+'</strong><small>'+esc(c.path)+' · '+esc(c.selector)+' · phase '+c.requestedPhase+'</small></figcaption></figure>').join('\n');
 return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'+
 '<meta name="robots" content="noindex"><title>Kirjane R3 — evidence contact sheet</title>'+
 '<style>body{background:#07140c;color:#e6f2e7;font:16px system-ui;margin:0;padding:2rem}h1{font-size:clamp(2rem,5vw,5rem);letter-spacing:-.05em}'+
 '.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,450px),1fr));gap:2rem}figure{margin:0;border:1px solid #345c40;padding:1rem}img{width:100%;height:auto;display:block}small{display:block;color:#aaccac;margin-top:.65rem}'+
 'a:focus-visible{outline:3px solid #d3f66b}p{max-width:70ch;line-height:1.6}</style>'+
 '<h1>R3 / Evidence contact sheet</h1><p>Locally rendered approximations of the owner-identified R2 states. A screenshot is NOT proof of interactive motion or hardware GPU quality. Compare matching viewports/scenes and review videos separately.</p>'+
 '<div class="grid">'+cards+'</div></html>';
}
try{
 await waitServer();
 browser=await chromium.launch({headless:true});
 for(const scene of all)await record(scene);
} finally{
 await browser?.close();
 server.kill();
 const report={
   mission:'KIRJANE-QWEN-CINEMATIC-OVERHAUL-R3',
   generatedAt:new Date().toISOString(),dist,origin,
   disclaimer:'Captured on this Playwright environment. Not the original owner image files. Software GPU may differ from Windows hardware. See SHOT_MAP.md.',
   captures,failures,pass:failures.length===0 && captures.length===all.length
 };
 writeFileSync(join(output,'manifest.json'),JSON.stringify(report,null,2));
 writeFileSync(join(output,'index.html'),makeHTML());
 console.log(JSON.stringify({captured:captures.length,expected:all.length,failures:failures.map(x=>x.id+': '+x.error.slice(0,125)),out:output},null,2));
 if(!report.pass)process.exitCode=1;
}
