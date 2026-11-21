import {previewServer} from './preview-server.mjs';
import {chromium} from 'playwright';
import {mkdir,writeFile,stat} from 'node:fs/promises';
const out='dist/codex-r3-evidence/profile';await mkdir(out,{recursive:true});
const browser=await chromium.launch();const runs=[];
const percentile=(a,p)=>[...a].sort((x,y)=>x-y)[Math.min(a.length-1,Math.floor(a.length*p))];
try{
 for(const [label,dist] of [['baseline','dist/codex-r3-baseline-001'],['candidate',process.env.FORGE_DIST||'dist/codex-r3-candidate-010']]){
  const server=await previewServer(dist);
  try{
   const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
   await ctx.addInitScript(()=>{sessionStorage.setItem('kirjane-cinematic-opening-r2','1');window.__longTasks=[];new PerformanceObserver(list=>window.__longTasks.push(...list.getEntries().map(x=>x.duration))).observe({type:'longtask',buffered:true});});
   const page=await ctx.newPage();await page.goto(server.origin+'/?webgl=off',{waitUntil:'domcontentloaded'});
   await page.locator('#capabilities-exhibition').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
   for(let run=0;run<6;run++){
    const data=await page.evaluate(async()=>{
     const intervals=[];let last=performance.now();
     for(let i=0;i<90;i++){await new Promise(requestAnimationFrame);const now=performance.now();intervals.push(now-last);last=now;}
     return {intervals,heap:performance.memory?.usedJSHeapSize||null,longTasks:window.__longTasks,
      transferred:performance.getEntriesByType('resource').reduce((n,x)=>n+x.transferSize,0),quality:window.__KIRJANE_PERF__||null};
    });
    if(run>=3)runs.push({label,dist,run:run-2,...data,p50:percentile(data.intervals,.5),p95:percentile(data.intervals,.95),p99:percentile(data.intervals,.99)});
   }
   await ctx.close();
  }finally{server.close();}
 }
}finally{await browser.close();}
await writeFile(out+'/report.json',JSON.stringify({mode:'matched reduced motion, WebGL off; three warmups and three scored 90-frame samples; synthetic idle frame pacing, not scroll responsiveness or field INP',browser:'Playwright Chromium Windows headless',runs},null,2));
console.log(JSON.stringify(runs.map(({label,run,p50,p95,p99,heap,transferred})=>({label,run,p50,p95,p99,heap,transferred}))));
