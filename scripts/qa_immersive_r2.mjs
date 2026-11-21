/* R2 immersive browser evidence. This script never uploads or publishes a site.
 * npm ci at repository root, then python scripts/build_immersive_r2.py.
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const dist=resolve(root,process.env.FORGE_DIST||'dist/immersive-r2');
const evidence=resolve(root,process.env.FORGE_EVIDENCE||'dist/immersive-r2-evidence');
const port=Number(process.env.FORGE_PORT||41889);
const origin='http://127.0.0.1:'+port;
const problems=[],cases=[],timing=[];
const add=(ok,name,details='')=>{
 cases.push({pass:!!ok,name,details});
 if(!ok)problems.push(name+' '+details);
};
if(!existsSync(resolve(dist,'js/forge-immersive-r2.js')))throw Error('Run immersive preview build before QA');
mkdirSync(evidence,{recursive:true});
mkdirSync(resolve(evidence,'video'),{recursive:true});
const server=spawn(process.env.PYTHON||'python',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dist],{stdio:'ignore'});
let browser;
async function waitServer(){
 for(let i=0;i<80;i++){try{if((await fetch(origin+'/motion-lab/')).ok)return;}catch{}
  await new Promise(r=>setTimeout(r,150));}
 throw Error('Isolated preview server is not responsive');
}
function guard(page,name){
 const exceptions=[];
 page.on('pageerror',e=>exceptions.push(String(e)));
 page.on('console',m=>{
    if(m.type()==='error'||(m.type()==='warning'&&m.text().includes('[Forge Immersive R2]')))
      exceptions.push(m.type()+': '+m.text());
  });
 return ()=>add(exceptions.length===0,'No runtime errors '+name,exceptions.slice(0,5).join(' | '));
}
async function decode(page){
 return page.evaluate(async()=>{
  const elements=Array.from(document.images);
  elements.forEach(el=>el.loading='eager');
  await Promise.all(elements.map(el=>el.decode().catch(()=>null)));
  return elements.filter(el=>!el.complete||el.naturalWidth===0).map(el=>el.getAttribute('src')).slice(0,8);
 });
}
async function go(page,path){
 const response=await page.goto(origin+path,{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(350);
 return response;
}
async function requestReady(page,selector,timeout=18000){
 await page.locator(selector).scrollIntoViewIfNeeded();
 try{await page.waitForFunction(sel=>{
  const h=document.querySelector(sel);
  return h?.dataset.forgeReady==='true' || h?.dataset.forgeStatic==='true';
 },selector,{timeout});return true;}catch{return false;}
}
async function audit(page,name){
 const a=await new AxeBuilder({page}).analyze();
 const serious=a.violations.filter(v=>['critical','serious'].includes(v.impact));
 add(serious.length===0,'Axe serious/critical '+name,
  serious.map(v=>v.id+': '+v.nodes.map(n=>n.target.join(' ')).slice(0,3).join(',')).join(';'));
 writeFileSync(resolve(evidence,'axe-'+name+'.json'),JSON.stringify(
  a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),null,2));
}
try{
 await waitServer();
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const desktop=await browser.newContext({viewport:{width:1440,height:900},
  deviceScaleFactor:1,recordVideo:{dir:resolve(evidence,'video'),size:{width:960,height:600}}});
 await desktop.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
 const pages=['','salryn','services','projects','process','about','contact'];
 for(const name of pages){
  const page=await desktop.newPage();
  const check=guard(page,name||'home');
  const route=name?'/'+name+'/':'/';
  const response=await go(page,route);
  add(!!response?.ok(),'Route serves '+route);
  add(await page.locator('main').count()===1,'Semantic main retained '+route);
  add(await page.locator('h1').count()>=1,'Hero h1 retained '+route);
  add(await page.locator('img.official-brand-word').count()>=1,'Official brand retained '+route);
  await page.waitForFunction(()=>!!window.__KIRJANE_R2__,null,{timeout:8000}).catch(()=>{});
  add(await page.evaluate(()=>!!window.__KIRJANE_R2__),'React Bits/R3F bundle loaded '+route,
    await page.evaluate(()=>JSON.stringify({loader:window.__KIRJANE_R2_LOADER__,
      stub:document.documentElement.dataset.forgeIslands,
      fault:window.__KIRJANE_R2_ERROR__?.slice(0,500) || null})));
  if(!name || name==='salryn'||name==='contact'){
    const errors=await decode(page);
    add(errors.length===0,'Visual assets decode '+route,errors.join(','));
    await page.screenshot({path:resolve(evidence,'desktop-'+(name||'home')+'.png'),fullPage:false});
  }
  const widths=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth}));
  add(widths.scrollWidth<=widths.innerWidth+1,'Desktop no horizontal overflow '+route,JSON.stringify(widths));
  if(name==='salryn'){
    const mounted=await requestReady(page,'.forge-live-kernel',14000);
    add(mounted,'R3F kernel island initialized with either hardware render or intentional software-GPU fallback');
    if(mounted){
      const buttons=page.locator('.forge-live-kernel .forge-kernel-controls button');
      add(await buttons.count()===8,'Eight inspectable 3D engines');
      await buttons.nth(2).click();
      add((await page.locator('.forge-live-kernel .forge-kernel-legend strong').innerText()).includes('Procurement'),
        'Engine inspection changes live 3D scene label');
      const gridButtons=page.locator('#scene-d-cap-grid .cap-toggle:not(.is-locked)');
      if(await gridButtons.count()){
       await gridButtons.first().click();
       add(await page.locator('.forge-live-kernel .forge-kernel-top').count()===1,'Core state remains mounted after capability selection');
      }
      await page.screenshot({path:resolve(evidence,'salryn-r3f-interaction.png')});
    }
    await audit(page,'salryn');
  }
  if(name==='contact')await audit(page,'contact');
  if(!name){
    const bits=page.locator('.forge-r2-tagline .forge-bits-line');
    add(await bits.count()===1,'Genuine React Bits BlurText rendered on Home');
    const scanned=await page.evaluate(()=>document.documentElement.dataset.forgeImmersive==='r2');
    add(scanned,'Immersive source mode active');
  }
  check();
  await page.close();
 }
 const lab=await desktop.newPage();
 const checkLab=guard(lab,'motion-lab');
 const labResponse=await go(lab,'/motion-lab/');
 add(labResponse?.ok(),'Standalone lab available');
 add(await lab.locator('[data-study]').count()===10,'All ten original techniques retained');
 const lab3d=await requestReady(lab,'#study-10 .forge-lab-kernel',26000);
 add(lab3d,'Lab Study 10 loads true R3F island or deliberate software-WebGL fallback');
 if(lab3d)await lab.screenshot({path:resolve(evidence,'lab-live-kernel.png')});
 await audit(lab,'motion-lab');
 checkLab();
 await lab.close();
 await desktop.close();
 for(const width of [320,390,768]){
  const mobile=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,
   deviceScaleFactor:1});
  const page=await mobile.newPage();
  const check=guard(page,'mobile '+width);
  await go(page,'/salryn/');
  const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
  add(overflow.scroll<=overflow.width+1,'Salryn mobile width '+width,JSON.stringify(overflow));
  const ready=await requestReady(page,'.forge-live-kernel',14000);
  add(ready,'Mobile R3F or reduced-GPU stage at '+width);
  if(width===390) {
   await page.screenshot({path:resolve(evidence,'salryn-mobile-390.png'),fullPage:false});
   await audit(page,'mobile-390');
  }
  check();
  await mobile.close();
 }
 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await reduced.newPage();
 const chk=guard(page,'reduced');
 await go(page,'/salryn/?reduce=1');
 add(await page.locator('main').count()===1,'Reduced motion retains main');
 const query=await page.evaluate(()=>document.documentElement.dataset.forgeImmersive);
 add(query==='r2','Reduced motion keeps semantic R2 styling');
 const element=page.locator('.forge-live-kernel');
 await element.scrollIntoViewIfNeeded();
 add(await element.count()===1,'Reduced motion offers static kernel fallback');
 chk();await reduced.close();
} catch(e){problems.push('RUNNER_ERROR: '+String(e?.stack||e));}
finally{
 if(browser)await browser.close();
 server.kill();
 const result={mission:'KIRJANE-IMMERSIVE-WEBSITE-R2',runAt:new Date().toISOString(),
  caveat:'Playwright SwiftShader synthetic observations are not Windows D3D11 field performance, Safari, screen-reader speech or device GPU-memory verification.',
  totalChecks:cases.length,passedChecks:cases.filter(x=>x.pass).length,problems,cases,timing,passed:problems.length===0};
 writeFileSync(resolve(evidence,'r2-results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify({passed:result.passed,checks:result.totalChecks,passedChecks:result.passedChecks,problems},null,2));
 if(problems.length)process.exitCode=1;
}
