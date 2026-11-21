import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const port=41912, origin='http://127.0.0.1:'+port;
const server=spawn('python',['-m','http.server',String(port),'--bind','127.0.0.1','--directory','dist/immersive-preview'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch(origin+'/')).ok)break;}catch{} await new Promise(r=>setTimeout(r,150));}
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>console.log('PAGEERROR',String(e)));
 page.on('console',m=>{if(m.type()==='warning'||m.type()==='error')console.log('BROWSER',m.type(),m.text().slice(0,1500));});
 const response=await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(2500);
 const result=await page.evaluate(async()=>{
  const bundle=await fetch('/js/forge-immersive-r2.js');
  const text=await bundle.text();
  return {
   href:location.href,loader:window.__KIRJANE_R2_LOADER__||false,
   live:!!window.__KIRJANE_R2__,error:window.__KIRJANE_R2_ERROR__||null,
   kinetics:!!window.__KIRJANE_KINETICS_R2__,
   stub:document.documentElement.dataset.forgeIslands||null,
   bundleHttp:bundle.status,bundleSize:text.length,bundleHead:text.slice(0,160),
   reactBitsDOM:document.querySelectorAll('.forge-bits-line').length
  };
 });
 console.log('CREATIVE_R2_SMOKE',JSON.stringify(result,null,2));
 if(!response.ok()||!result.live||!result.reactBitsDOM)process.exitCode=1;
 await page.close();
}catch(e){console.error('SMOKE ERROR',String(e?.stack||e));process.exitCode=1;}
finally{if(browser)await browser.close();server.kill();}
