import {httpReady} from './http-ready.mjs';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const port=41941,origin='http://127.0.0.1:'+port,dir=process.env.FORGE_DIST||'dist/cinema-integration',evidence=resolve(process.env.FORGE_EVIDENCE||'dist/cinema-integration-evidence');
mkdirSync(evidence,{recursive:true});
const python=process.platform==='win32'?'python':'python3';
const server=spawn(python,['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:'ignore'});
let browser;const cases=[],failures=[];
function record(ok,label,detail=''){cases.push({ok:!!ok,label,detail});if(!ok)failures.push(label+' '+detail);}
const weights=[1.5,1.1,1.1,1.1,1.1,1.8,1.1,1.2,1.1,1.1,1.2,1.2,1.0,1.5,1.25,1.2,1.4,1.2,1.2,1.5,1.3,1.2,2.0];
async function seek(page,index,local){
 const total=weights.reduce((a,b)=>a+b,0);
 const pos=(weights.slice(0,index).reduce((a,b)=>a+b,0)+weights[index]*local)/total;
 await page.evaluate(pos=>{
   const c=document.getElementById('salryn-cinema-experience').shadowRoot.getElementById('cinema');
   const top=c.getBoundingClientRect().top+scrollY;
   scrollTo({top:top+(c.getBoundingClientRect().height-innerHeight)*pos,behavior:'instant'});
 },pos);
 await page.waitForTimeout(250);
}
async function mount(page){
 const res=await page.goto(origin+'/salryn/',{waitUntil:'domcontentloaded',timeout:30000});
 record(res.ok(),'Salryn canonical route served');
 await page.locator('#salryn-cinema-experience').scrollIntoViewIfNeeded({timeout:15000});
 await page.waitForFunction(()=>{
   const e=document.getElementById('salryn-cinema-experience');
   return e&&e.dataset.cinemaLoad==='ready'&&e.shadowRoot&&e.shadowRoot.querySelector('.film-scroll,.cinema-reduced');
 },null,{timeout:30000});
}
try{
 let ready=false;
 for(let i=0;i<90;i++){try{if(await httpReady(origin+'/salryn/')){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,150));}
 if(!ready)throw Error('Local static server failed');
 browser=await chromium.launch({headless:true,args:['--disable-gpu-sandbox']});
 const baseline=await browser.newContext({viewport:{width:1440,height:900}});
 for(const path of ['/','/services/','/projects/','/process/','/about/','/contact/']){
   const page=await baseline.newPage(),res=await page.goto(origin+path,{waitUntil:'domcontentloaded'});
   record(res.ok(),'Corporate route remains '+path);
   record(await page.locator('[data-forge-salryn-cinema]').count()===0,'Cinema remains Salryn-only '+path);
   await page.close();
 }
 await baseline.close();
 for(const [label,width,height] of [['desktop',1440,900],['phone',390,844],['small',320,700],['tall',1684,1798]]){
   const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
   const page=await ctx.newPage(),errors=[],apis=[];
   page.on('pageerror',x=>errors.push(String(x)));
   page.on('request',x=>{if(/\/api\/|\/license|\/activate|\/sales\/checkout/.test(x.url()))apis.push(x.url());});
   try{
     await mount(page);
     // The introductory shot deliberately has no operator window. Seek to a
     // real checkout action before asserting that the POS screen is present.
     await seek(page,7,.851);
     const state=await page.evaluate(()=>{
       const host=document.getElementById('salryn-cinema-experience'),shadow=host.shadowRoot;
       return {main:document.querySelectorAll('main').length,
       noIframe:!document.querySelector('iframe')&&!shadow.querySelector('iframe'),
       company:!!document.querySelector('.salryn-hero')&&!!document.querySelector('#scene-a-kernel')&&!!document.querySelector('#scene-g-configuration'),
       mounted:!!shadow.querySelector('.salryn-window'),
       bundle:window.__KIRJANE_SALRYN_FILM__?.source||null,
       overflow:document.documentElement.scrollWidth-innerWidth};
     });
     record(state.main===1,label+' unique document main');
     record(state.noIframe,label+' no nested iframe');
     record(state.company,label+' existing seven-scene Salryn page preserved');
     record(state.mounted,label+' source-inspired R5 POS screen');
     record(state.bundle==='d21dbfcf2a4f24f8eba2547791a0164a2ca63521',label+' pinned R5 source');
     record(state.overflow<=1,label+' no horizontal overflow',JSON.stringify(state));
     await seek(page,7,.851);
     const pointer=await page.evaluate(()=>{
       const s=document.getElementById('salryn-cinema-experience').shadowRoot;
       const p=s.querySelector('.film-fake-cursor');
       const t=s.querySelector('.cinema-ui-layer[data-cinema-current] [data-cinema-target="shift-open"]');
       const a=p?.getBoundingClientRect(),b=t?.getBoundingClientRect();
       return {ready:!!(a&&b),hit:!!(a&&b&&a.x+3>=b.x&&a.x+3<=b.right&&a.y+2>=b.y&&a.y+2<=b.bottom),
         ripple:Number(p?.querySelector('.cinema-click-ring')?.dataset.cinemaRipple||0),
         soundOff:s.querySelector('[data-cinema-sound-toggle]')?.getAttribute('aria-pressed')==='false'};
     });
     record(pointer.hit,label+' real measured Open Shift cursor hit',JSON.stringify(pointer));
     record(pointer.ripple>.05,label+' R5 scroll-governed impact ripple');
     record(pointer.soundOff,label+' sound is muted by default');
     await page.screenshot({path:resolve(evidence,label+'-shift-click.png'),animations:'disabled'});
     await seek(page,14,.6);
     record(await page.locator('#salryn-cinema-experience .film-fake-cursor').count()===0,label+' receipt has no phantom click');
     if(label==='desktop') await page.screenshot({path:resolve(evidence,'desktop-receipt.png'),animations:'disabled'});
     record(!errors.length,label+' no JavaScript exceptions',errors.join(';'));
     record(!apis.length,label+' no production backend calls',apis.join(';'));
   }catch(e){record(false,label+' integration error',String(e.stack||e).slice(0,1100));}
   await ctx.close();
 }
 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const pg=await reduced.newPage();
 try{await mount(pg);
  record(await pg.locator('#salryn-cinema-experience .cinema-reduced').count()===1,'Reduced motion static documentary');
  record(await pg.locator('#salryn-cinema-experience .film-scroll').count()===0,'Reduced motion has no long pinned film');
  record(await pg.locator('#scene-a-kernel').count()===1,'Reduced motion preserves original Salryn kernel');
 }catch(e){record(false,'Reduced motion',String(e.stack||e).slice(0,500));}
 await reduced.close();
}catch(e){record(false,'QA runner',String(e.stack||e).slice(0,1400));}
finally{
 if(browser)await browser.close();
 server.kill();
 const result={mission:'SALRYN-R5-IN-7PAGE-KIRJANE',checks:cases.length,passing:cases.filter(x=>x.ok).length,failures,cases,source:'d21dbfcf2a4f24f8eba2547791a0164a2ca63521',caveat:'Headless browser only; hardware audio, Safari and real UI fidelity remain pending'};
 writeFileSync(resolve(evidence,'result.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify({pass:failures.length===0,checks:result.checks,passing:result.passing,failures},null,2));
 if(failures.length)process.exitCode=1;
}
