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
 for(const width of [1440,390,320]){
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
}finally{await browser.close();server.close();await writeFile(join(out,'report.json'),JSON.stringify({dist,results},null,2));}
console.log(JSON.stringify({passed:results.filter(x=>x.ok).length,total:results.length,out}));
if(results.some(x=>!x.ok))process.exitCode=1;
