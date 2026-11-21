import {chromium} from 'playwright';
import http from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
const root=resolve(process.env.FORGE_DIST||'dist/r4-integrated-01'),out=resolve('docs/creative-forge-r4/evidence/qa');
await mkdir(out,{recursive:true});const checks=[];
const check=(ok,name,detail)=>{checks.push({ok:!!ok,name,detail});if(!ok)console.error(name,detail);};
const server=http.createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(p!==root&&!p.startsWith(root+'/')&&!p.startsWith(root+'\\'))throw Error();if((await stat(p)).isDirectory())p=join(p,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'})[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch();
try{
 for(const width of [1440,390,320])for(const mode of ['live','reduce','off']){
  const ctx=await browser.newContext({viewport:{width,height:width===1440?900:width===320?700:844},reducedMotion:mode==='reduce'?'reduce':'no-preference'});
  await ctx.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/?'+(mode==='off'?'webgl=off':''));
  await page.locator('#capabilities-exhibition').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
  for(const i of [0,1,2,3,2,1,0]){
   const b=page.locator(`[data-cap-idx="${i}"]`);await b.focus();await page.keyboard.press('Enter');await page.waitForTimeout(1200);
   check(await b.getAttribute('aria-current')==='step',`${width}/${mode} keyboard reverse state ${i}`);
   await page.evaluate(()=>dispatchEvent(new Event('resize')));
   check(await b.getAttribute('aria-current')==='step',`${width}/${mode} manual state survives resize ${i}`);
  }
  await page.locator('[data-cap-idx="1"]').click();await page.waitForTimeout(1200);
  const host=page.locator('#home-cap-plate-stage');
  check(await host.locator('canvas').count()===(mode==='live'?1:0),`${width}/${mode} single renderer or static fallback`);
  const src=await host.locator('[data-plate-idx="1"]').evaluate(i=>({src:i.currentSrc,complete:i.complete,w:i.naturalWidth}));
  check(src.complete&&src.w>0&&src.src.includes(width<=900?'editorial-mobile':'editorial-desktop'),`${width}/${mode} responsive export loaded`,src);
  if(mode==='live'){
   await page.evaluate(()=>{const c=document.querySelector('#home-cap-plate-stage canvas');c.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));});
   check(await host.getAttribute('data-render')==='poster',`${width} context loss exposes poster`);
   check(await host.locator('canvas').isHidden(),`${width} lost canvas hidden`);
  }
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}/${mode} no overflow`);
  check(errors.length===0,`${width}/${mode} no JS exceptions`,errors);
  await ctx.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(origin+'/services/');await page.locator('#process-automation').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 for(let i=0;i<6;i++){const b=page.locator('#btn-svc-step');await b.click();await page.waitForTimeout(120);check(await page.locator('.asc-workflow-exhibit').getAttribute('data-workflow')===String((i+1)%3),'Services three-step wrap '+i);}
 await page.close();
}finally{await browser.close();server.close();await writeFile(join(out,'r4-services.json'),JSON.stringify({root,checks},null,2));}
console.log(JSON.stringify({checks:checks.length,failures:checks.filter(c=>!c.ok)}));if(checks.some(c=>!c.ok))process.exitCode=1;
