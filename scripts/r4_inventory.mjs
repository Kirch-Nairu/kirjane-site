import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {httpReady} from './http-ready.mjs';
const root=resolve('dist/r4-integrated-02'),out=resolve('docs/creative-forge-r4/evidence/inventory');mkdirSync(out,{recursive:true});
const origin='http://127.0.0.1:41978',server=spawn('python',['-m','http.server','41978','--bind','127.0.0.1','--directory',root],{stdio:'ignore'});
const sourceSHA=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();let browser;
const records=[],scenes=[];
try{
 for(let i=0;i<40;i++){if(await httpReady(origin+'/'))break;await new Promise(r=>setTimeout(r,150));}
 browser=await chromium.launch();
 for(const width of [1440,390])for(const route of ['/','/services/','/process/','/salryn/','/projects/','/about/','/contact/']){
  const page=await browser.newPage({viewport:{width,height:width===1440?900:844}}),loaded=new Map(),images=new Map();
  await page.addInitScript(()=>sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
  page.on('response',r=>{if(/\.(webp|png|jpg|svg)(\?|$)/i.test(r.url()))loaded.set(new URL(r.url()).pathname,r.status());});
  await page.goto(origin+route);await page.waitForTimeout(900);
  for(let i=0;i<=28;i++){
   await page.evaluate(i=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*i/28,behavior:'instant'}),i);await page.waitForTimeout(120);
   const observations=await page.evaluate(()=>[...document.images].filter(im=>im.complete&&im.naturalWidth).map(im=>{
    const p=im.closest('[id]'),r=im.getBoundingClientRect(),css=getComputedStyle(im);
    return{path:new URL(im.currentSrc).pathname,selector:p?'#'+p.id+' img':'img[src="'+im.getAttribute('src')+'"]',dimensions:[im.naturalWidth,im.naturalHeight],visible:r.bottom>0&&r.top<innerHeight&&css.visibility!=='hidden'&&Number(css.opacity)>0};
   }));
   for(const ob of observations){const key=ob.path+'|'+ob.selector;const old=images.get(key);images.set(key,{...ob,visible:ob.visible||old?.visible||false});}
  }
  scenes.push({route,width,canvases:await page.locator('canvas').count(),observedImages:images.size});
  for(const [path,status]of loaded){
   const usages=[...images.values()].filter(i=>i.path===path),file=resolve(root,'.'+path);
   records.push({route,width,path,status,bytes:statSync(file).size,usages,usageState:usages.some(i=>i.visible)?'RENDERED_IN_VIEW':usages.length?'LOADED_DOM':'LOADED_NETWORK',disposition:path.includes('/r4/automation-')?'REVIEW_READY':'UNAUDITED',sourceSHA,rights:path.includes('/r4/')?'Original authored Blender reconstruction; no third-party inputs':'Inherited provenance; not requalified by network trace'});
  }
  await page.screenshot({path:out+`/${route.replaceAll('/','')||'home'}-${width}-end.png`});await page.close();
 }
 writeFileSync(out+'/active-assets.json',JSON.stringify({sourceSHA,scope:'Two viewport network traces with 29 scroll samples per route. Loaded does not imply visible. This is an observed subset, not proof of exhaustive scene/frame coverage.',scenes,records},null,2));
 console.log(JSON.stringify({observations:records.length,uniquePaths:new Set(records.map(r=>r.path)).size,scenes:scenes.length}));
}finally{await browser?.close();server.kill();}
