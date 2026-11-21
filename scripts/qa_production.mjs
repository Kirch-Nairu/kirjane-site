import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let chromium,AxeBuilder;
try{({chromium}=await import('playwright'));({default:AxeBuilder}=await import('@axe-core/playwright'));}catch{const local=createRequire(path.resolve('../../package.json'));({chromium}=local('playwright'));AxeBuilder=local('@axe-core/playwright').default;}
const root=path.resolve(process.env.PRODUCTION_DIST||'dist/public');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{try{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==root&&!file.startsWith(root+path.sep))throw Error();if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({args:process.platform==='win32'?['--use-gl=angle','--use-angle=d3d11','--ignore-gpu-blocklist']:[]});const results=[];
const check=(name,ok,evidence)=>{results.push({name,ok:!!ok,evidence});if(!ok)console.error('FAIL',name,evidence);};
try{
 for(const [width,height]of [[1440,900],[390,844],[280,640]]){
  const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await ctx.newPage();
  for(const route of ['','salryn','services','projects','process','about','contact']){
   const errors=[];const onError=e=>errors.push(e.message);page.on('pageerror',onError);await page.goto(origin+'/'+(route?route+'/':''));await page.waitForFunction(()=>window.__SITE_READY__);await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,canonical:document.querySelector('link[rel=canonical]')?.href,og:document.querySelector('meta[property="og:image"]')?.content,logo:document.querySelector('.official-brand-mark')?.naturalWidth}));
   check(`${route||'home'} ${width}`,!errors.length&&state.overflow<=1&&state.h1===1&&state.logo>0&&state.canonical==='https://kirjane.tech/'+(route?route+'/':'')&&state.og==='https://kirjane.tech/assets/d02-hero-desktop.jpg',{state,errors});
   if(width===1440){
    const fragments=await page.evaluate(()=>[...document.querySelectorAll('a[href*="#"]')].filter(a=>{const raw=a.getAttribute('href');return a.hasAttribute('data-local-fragment')||raw.startsWith('#')||raw.startsWith('./'+location.pathname.split('/')[1]+'/#');}).map(a=>({href:a.href,path:new URL(a.href).pathname,expected:location.pathname})));
    check(`${route||'home'} local fragments`,fragments.length>0&&fragments.every(a=>a.path===a.expected),fragments);
    await page.locator('a.skip-link').focus();await page.keyboard.press('Enter');
    // A real keyboard activation may cross a microtask/scroll restoration boundary.
    // Wait for the observed URL mutation; do not accept a mere click as success.
    await page.waitForURL(url=>url.hash==='#main'&&url.pathname==='/'+(route?route+'/':''),{timeout:2500}).catch(()=>{});
    check(`${route||'home'} real Skip link`,new URL(page.url()).pathname==='/'+(route?route+'/':'')&&new URL(page.url()).hash==='#main');
    check(`${route||'home'} one Twitter card`,await page.locator('meta[name="twitter:card"]').count()===1&&await page.locator('meta[name="twitter:card"]').getAttribute('content')==='summary_large_image');
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();check(`${route||'home'} axe`,axe.violations.length===0,axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.slice(0,8).map(n=>({target:n.target,summary:n.failureSummary}))})));}page.off('pageerror',onError);
  }await ctx.close();
 }
 for(const phase of ['complete','outro','assembly']){
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});const page=await ctx.newPage();await page.goto(origin+'/');
  if(phase!=='complete'){await page.waitForFunction(p=>document.querySelector('.brand-opening')?.dataset.phase===p,phase);await page.keyboard.press('Escape');}
  await page.waitForFunction(()=>window.__KIRJANE_OPENING__&&!window.__KIRJANE_OPENING__.active);
  const state=await page.evaluate(()=>({opening:window.__KIRJANE_OPENING__,overlay:!!document.querySelector('.brand-opening'),opacity:getComputedStyle(document.querySelector('h1')).opacity,inert:!!document.querySelector('#main').closest('[inert]'),animations:document.getAnimations().filter(a=>a.id==='kirjane-opening').length}));
  check(phase+' teardown',!state.overlay&&!state.inert&&!state.animations&&state.opacity==='1'&&(phase!=='complete'||state.opening.completed),state);
  await page.locator('header a[data-page=salryn]').click();await page.waitForURL('**/salryn/');await page.waitForFunction(()=>window.__SITE_READY__);check(phase+' navigation',await page.locator('h1').isVisible());await ctx.close();
 }
 {
  const drawerContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const drawerPage=await drawerContext.newPage();await drawerPage.goto(origin+'/');
  await drawerPage.waitForFunction(()=>document.querySelector('.brand-opening')?.dataset.phase==='assembly');await drawerPage.locator('#btn-mobile-menu').click();
  await drawerPage.waitForFunction(()=>!window.__KIRJANE_OPENING__.active);
  const drawer=await drawerPage.locator('#mobile-drawer').evaluate(el=>({inert:el.inert,hidden:el.getAttribute('aria-hidden')}));
  check('drawer opened during assembly remains interactive',!drawer.inert&&drawer.hidden==='false',drawer);
  await drawerPage.locator('#btn-drawer-close').click();check('assembly drawer Close works',await drawerPage.locator('#mobile-drawer').getAttribute('aria-hidden')==='true');
  await drawerContext.close();
 }
 const ctx=await browser.newContext({reducedMotion:'reduce'});const page=await ctx.newPage();await page.goto(origin+'/salryn/');await page.waitForFunction(()=>window.__SITE_READY__);await page.locator('#cfg-industry').selectOption('Manufacturing');await page.locator('#btn-cfg-contact').click();await page.waitForURL(url=>url.pathname==='/contact/'&&url.search.length>0);await page.waitForFunction(()=>window.__SITE_READY__);check('Contact handoff',(await page.locator('#c-scope').inputValue()).includes('Manufacturing'));
 const query=new URL(page.url()).search;await page.locator('#c-name').fill('Verification visitor');await page.locator('a.skip-link').focus();await page.keyboard.press('Enter');
 check('Contact Skip retains query and form state',new URL(page.url()).search===query&&await page.locator('#c-name').inputValue()==='Verification visitor');await ctx.close();
 const robots=await fs.readFile(root+'/robots.txt','utf8'),sitemap=await fs.readFile(root+'/sitemap.xml','utf8'),preview=await fs.readFile(path.join(process.env.PREVIEW_DIST||'dist/preview','robots.txt'),'utf8'),html=await fs.readFile(path.join(process.env.PREVIEW_DIST||'dist/preview','index.html'),'utf8');
 check('production sitemap',robots.includes('https://kirjane.tech/sitemap.xml')&&(sitemap.match(/<loc>/g)||[]).length===7);check('preview noindex',preview.includes('Disallow: /')&&html.includes('noindex, nofollow, noarchive')&&JSON.parse(await fs.readFile('vercel.json','utf8')).headers[0].headers.some(h=>h.key==='X-Robots-Tag'&&h.value.includes('noindex')));
}finally{await browser.close();server.close();await fs.mkdir('dist/evidence',{recursive:true});await fs.writeFile('dist/evidence/browser.json',JSON.stringify({node:process.version,results},null,2));}
console.log(`${results.filter(r=>r.ok).length}/${results.length} production checks passed`);if(results.some(r=>!r.ok))process.exitCode=1;
