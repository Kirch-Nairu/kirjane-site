import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {httpReady} from './http-ready.mjs';
const label=process.argv[2]||'before',dist=resolve(process.argv[3]||'dist/r4-baseline');
const out=resolve('docs/creative-forge-r4/evidence',label);mkdirSync(out,{recursive:true});
const server=spawn('python',['-m','http.server','41976','--bind','127.0.0.1','--directory',dist],{stdio:'ignore'});
let browser;const report={label,dist,captures:[],network:[],errors:[]};
try{
 for(let i=0;i<40;i++){try{if(await httpReady('http://127.0.0.1:41976/'))break;}catch{}await new Promise(r=>setTimeout(r,150));}
 browser=await chromium.launch({headless:true});
 for(const [width,height] of [[1440,900],[390,844],[320,700]]){
  for(const [route,selector,fallback] of [['/','#capabilities-exhibition',false],['/','#capabilities-exhibition',true],['/services/','#process-automation',false]]){
   const id=`${route==='/'?'home':'services'}-${fallback?'poster':'live'}-${width}`;
   const record=width===1440&&!fallback&&route==='/';
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,...(record?{recordVideo:{dir:out,size:{width,height}}}:{})});
   await context.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({id,error:String(e)}));
   const loads=[];page.on('response',async r=>{if(/\.(webp|png|jpg|svg)(\?|$)/.test(r.url()))loads.push({url:r.url(),status:r.status()});});
   await page.goto('http://127.0.0.1:41976'+route+(fallback?'?webgl=off':''));
   await page.locator(selector).scrollIntoViewIfNeeded();
   if(route==='/')await page.locator('[data-cap-idx="1"]').click();
   await page.waitForTimeout(1600);
   const state=await page.evaluate(({selector})=>{const el=document.querySelector(selector);return{mode:el.dataset.mode,render:document.querySelector('#home-cap-plate-stage')?.dataset.render,overflow:document.documentElement.scrollWidth>innerWidth,images:[...el.querySelectorAll('img')].map(i=>({src:i.currentSrc,visible:getComputedStyle(i).visibility,opacity:getComputedStyle(i).opacity,width:i.naturalWidth,height:i.naturalHeight}))};},{selector});
   await page.screenshot({path:out+'/'+id+'.png'});report.captures.push({id,width,height,state});
   if(route==='/'&&!fallback){
    for(const idx of [0,1,2,3,2,1,0]){await page.locator(`[data-cap-idx="${idx}"]`).click();await page.waitForTimeout(1200);const mode=await page.locator('#home-cap-plate-stage').getAttribute('data-mode');if(mode!==String(idx))throw Error('Mode mismatch '+id);}
    if(width===1440){const bounds=await page.locator(selector).evaluate(e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}));for(const dir of [1,-1])for(let i=0;i<=30;i++){const p=dir===1?i/30:1-i/30;await page.mouse.wheel(0,dir*2);await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),bounds.top+p*(bounds.height-height));await page.waitForTimeout(90);}}
   }
   report.network.push({id,loads});const video=page.video();await context.close();
   if(video){renameSync(await video.path(),out+'/'+id+'-forward-reverse.webm');report.captures.at(-1).video=id+'-forward-reverse.webm';}
  }
 }
 if(label.startsWith('before'))for(const route of ['/','/services/','/process/','/salryn/','/projects/','/about/','/contact/']){
  const page=await browser.newPage({viewport:{width:1440,height:900}});const loads=[];
  page.on('response',r=>{if(/\.(webp|png|jpg|svg)(\?|$)/.test(r.url()))loads.push({url:r.url(),status:r.status()});});
  await page.goto('http://127.0.0.1:41976'+route);await page.waitForTimeout(800);
  for(let n=0;n<16;n++){await page.evaluate(({n})=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*n/15),{n});await page.waitForTimeout(120);}
  report.network.push({route,loads});await page.close();
 }
 writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({label,captures:report.captures.length,errors:report.errors}));
}finally{await browser?.close();server.kill();}
