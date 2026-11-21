import {previewServer} from './preview-server.mjs';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const out='dist/codex-r3-evidence/adversarial';await mkdir(out,{recursive:true});
const server=await previewServer(process.env.FORGE_DIST||'dist/codex-r3-candidate-011');
const browser=await chromium.launch();const results=[];
try{
 for(const [width,height] of [[1440,900],[390,844],[2880,1800],[1684,1798]]){
  const ctx=await browser.newContext({viewport:{width,height},recordVideo:{dir:out+'/video',size:{width:Math.min(width,1440),height:Math.min(height,900)}}});
  await ctx.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(server.origin+'/salryn/',{waitUntil:'domcontentloaded'});
  await page.locator('#salryn-cinema-experience').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.getElementById('salryn-cinema-experience')?.shadowRoot?.querySelector('.film-scroll'));
  for(const progress of [0,.12,.31,.60,.74,.92,1,.74,.31,0]){
   await page.evaluate(async progress=>{
    const host=document.getElementById('salryn-cinema-experience');const film=host.shadowRoot.querySelector('.film-scroll');
    const rect=film.getBoundingClientRect(),start=scrollY,target=rect.top+scrollY+(rect.height-innerHeight)*progress;
    for(let i=1;i<=12;i++){scrollTo({top:start+(target-start)*i/12,behavior:'instant'});await new Promise(requestAnimationFrame);}
   },progress);await page.waitForTimeout(130);
  }
  await page.screenshot({path:out+'/'+width+'x'+height+'-film.png'});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  results.push({name:width+'x'+height+' native forward/reverse film',ok:!errors.length&&overflow<=1,errors,overflow});
  await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});const page=await ctx.newPage();
 await ctx.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
 await page.goto(server.origin+'/',{waitUntil:'domcontentloaded'});
 await page.locator('#home-cap-plate-stage').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
 const loss=await page.evaluate(()=>{
  const host=document.getElementById('home-cap-plate-stage'),canvas=host.querySelector('canvas');
  const gl=canvas?.getContext('webgl2'),extension=gl?.getExtension('WEBGL_lose_context');
  if(!extension)return {available:false,render:host.dataset.render};extension.loseContext();return {available:true};
 });
 await page.waitForTimeout(350);
 const fallback=await page.locator('#home-cap-plate-stage').getAttribute('data-render');
 results.push({name:'service context loss',ok:loss.available?fallback==='poster':null,loss,fallback});
 await page.screenshot({path:out+'/service-context-loss.png'});await ctx.close();
}finally{await browser.close();server.close();await writeFile(out+'/report.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results));if(results.some(r=>r.ok===false))process.exitCode=1;
