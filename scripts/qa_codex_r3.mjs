import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import http from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,join} from 'node:path';
const dist=resolve(process.env.FORGE_DIST||'dist/codex-r3-services-001');
const out=resolve(process.env.FORGE_EVIDENCE||'dist/codex-r3-evidence/services');
await mkdir(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{try{
 let file=resolve(dist,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(dist+'\\')&&!file.startsWith(dist+'/')&&file!==dist)throw Error();
 if((await stat(file)).isDirectory())file=join(file,'index.html');
 res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch{res.writeHead(404).end();}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch();const results=[];
const check=(ok,name,detail)=>{results.push({ok,name,detail});if(!ok)console.error(name,detail);};
try{
 for(const width of (process.env.R3_SCENES_ONLY?[]:[1440,390,320])){
  const context=await browser.newContext({viewport:{width,height:width===1440?900:844},recordVideo:{dir:join(out,'video')},reducedMotion:process.env.R3_REDUCE?'reduce':'no-preference'});
  await context.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/');await page.waitForFunction(()=>window.__SITE_READY__);
  await page.locator('#capabilities-exhibition').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  for(let i=0;i<4;i++){
   const button=page.locator('[data-cap-idx="'+i+'"]');await button.click();
   await page.waitForTimeout(1400);
   check(await page.locator('#capabilities-exhibition').getAttribute('data-mode')===String(i),width+' service '+i+' selected');
   await page.evaluate(()=>dispatchEvent(new Event('resize')));await page.waitForTimeout(250);
   check(await button.getAttribute('aria-current')==='step',width+' manual selection survives resize '+i);
   await page.locator('#capabilities-exhibition').screenshot({path:join(out,width+'-services-'+i+'.png')});
  }
  for(let i=0;i<5;i++){
   const button=page.locator('#process-tab-'+i);await button.click();await page.waitForTimeout(1150);
   check(await page.locator('#home-topo-svg').getAttribute('data-stage')===String(i),width+' process stage '+i);
   check(await button.getAttribute('aria-selected')==='true',width+' process semantic stage '+i);
   await page.locator('#home-topo-svg').screenshot({path:join(out,width+'-process-'+i+'.png')});
  }
  await page.locator('#process-tab-4').focus();await page.keyboard.press('ArrowLeft');
  check(await page.locator('#process-tab-3').getAttribute('aria-selected')==='true',width+' process keyboard');
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,render:document.getElementById('home-cap-plate-stage').dataset.render,wide:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2 && getComputedStyle(e).position!=='fixed').slice(0,18).map(e=>[e.tagName,e.id,e.className,e.getBoundingClientRect().width])}));
  check(state.overflow<=1,width+' overflow',state);check(!errors.length,width+' no exceptions',errors);
  const axe=await new AxeBuilder({page}).include('#capabilities-exhibition').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  check(!axe.violations.length,width+' services axe',axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
  await context.close();
 }
 for(const width of [1440,390,320]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await ctx.newPage();page.setDefaultTimeout(12000);console.log('Scene checks',width);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/process/#stage-3',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__SITE_READY__);
  await page.waitForTimeout(400);
  check(await page.locator('#proc-topo-mount').getAttribute('data-stage')==='3',width+' process direct deep link');
  await page.goto(origin+'/salryn/',{waitUntil:'domcontentloaded'});console.log('Salryn loaded',width);await page.waitForFunction(()=>window.__SITE_READY__);
  check(await page.locator('#industry-profile option').count()===12,width+' twelve canonical industries');
  for(const industry of [0,1,9]){
   await page.locator('#industry-profile').selectOption(String(industry));
   for(let step=0;step<5;step++){
    await page.locator('button[data-story-step="'+step+'"]').click();
    check(await page.locator('.r3-industry-story').getAttribute('data-story-step')===String(step),width+' industry '+industry+' step '+step);
   }
   await page.locator('.r3-industry-story').screenshot({path:join(out,width+'-industry-'+industry+'.png')});
  }
  await page.locator('[data-story-inquire]').click();
  check(await page.locator('#cfg-industry').inputValue()==='Manufacturing',width+' selected industry reaches inquiry');
  await page.locator('[data-story-replay]').click();
  check(await page.locator('.r3-industry-story').getAttribute('data-story-step')==='0',width+' industry replay');
  for(const mode of ['normal','local','exchange']){
   await page.locator('[data-sim-mode="'+mode+'"]').click();
   check(await page.locator('#offline-sim-frame').getAttribute('data-network-mode')===mode,width+' resilience '+mode);
   if(mode==='local')check((await page.locator('[data-queue-status]').innerText()).includes('Waiting'),width+' external action stays waiting in outage');
   await page.locator('#offline-sim-frame').screenshot({path:join(out,width+'-network-'+mode+'.png')});
  }
  await page.locator('[data-recovery-next]').click();await page.locator('[data-recovery-next]').click();
  check((await page.locator('[data-queue-status]').innerText()).includes('authorized export'),width+' recovery requires authorized exchange');
  const host=page.locator('.forge-live-kernel');await host.scrollIntoViewIfNeeded();await page.waitForTimeout(800);
  check(await host.locator('.forge-kernel-controls button').count()===8,width+' eight inspectable engines');
  for(const i of [0,2,6,7]){
   await host.locator('.forge-kernel-controls button').nth(i).click();await page.waitForTimeout(250);
   check(await host.getAttribute('data-selected-engine')===String(i),width+' selected engine '+i);
  }
  check((await host.getAttribute('data-enabled-engines')).includes('6,7'),width+' mandatory foundations active');
  await host.screenshot({path:join(out,width+'-kernel.png')});
  const a=await new AxeBuilder({page}).include('#scene-c-flavors').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  check(!a.violations.length,width+' industry axe',a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+' Salryn overflow');
  check(!errors.length,width+' process and Salryn exceptions',errors);
  await ctx.close();
 }
}finally{await browser.close();server.close();await writeFile(join(out,'report.json'),JSON.stringify({dist,results},null,2));}
console.log(JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,out}));
if(results.some(x=>!x.ok))process.exitCode=1;
