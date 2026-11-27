import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.S02_URL || 'http://127.0.0.1:8723/';
const qaUrl=new URL(base);qaUrl.searchParams.set('s02qa','1');
const out=process.env.S02_EVIDENCE || 'dist/s02-chamber-evidence';
const comparison=process.env.S02_COMPARE==='1';
const stills=process.env.S02_STILLS==='1';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[],failures=[];
const allViewports=[[1440,900],[1024,768],[768,1024],[844,390],[390,844],[320,700]];
const viewportFilter=process.env.S02_VIEWPORT?Number(process.env.S02_VIEWPORT):0;
const viewports=viewportFilter?allViewports.filter(([w])=>w===viewportFilter):allViewports;
assert.ok(viewports.length,'valid viewport filter');
const shots=[['opening',.04],['trace',.44],['review',.625],['approved',.72],['flight',.85],['receipt',.97]];
try {
  for(const [width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,recordVideo:comparison||stills?undefined:{dir:out+'/motion',size:{width,height}}});
    const page=await context.newPage();
    try {
      const errors=[];page.on('pageerror',e=>errors.push(String(e)));
      await page.goto(qaUrl.href,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.__SITE_READY__===true);
      const stage=page.locator('#complexity-clarity-scene .cinematic-sticky-stage');
      await stage.scrollIntoViewIfNeeded();
      if(comparison&&process.env.S02_BASELINE==='r4'&&height<610&&width<=900){await page.screenshot({path:out+'/'+width+'-r4-short-fallback.png'});results.push({width,height,baseline:'R4 short landscape fallback'});continue;}
      await stage.locator('#handoff-chamber-webgl').waitFor({state:'visible',timeout:20000});
      const status=stage.locator('.handoff-scene-caption');
      async function seek(p){
        // Use the native director to remeasure responsive geometry. Never inject
        // a visual phase or bypass the real scroll listener.
        await page.evaluate(p=>window.__SCENE_DIRECTOR__.jumpTo('home-clarity',p),p);
        try {
          await page.waitForFunction(({p,comparison})=>{const e=document.querySelector('[data-handoff-chamber]'),s=window.__SCENE_DIRECTOR__.getScenes()['home-clarity'];return e&&s&&Math.abs(s.exact-p)<.004&&Math.abs(s.exact-s.smooth)<.0001&&Math.abs(Number(e.dataset.handoffPhase)-s.exact)<(comparison ? .001 : .0002);},{p,comparison},{timeout:30000});
        } catch(error){
          const diagnostics=await page.evaluate(()=>{const e=document.querySelector('[data-handoff-chamber]');return {scene:window.__SCENE_DIRECTOR__.getScenes()['home-clarity'],phase:e?.dataset.handoffPhase,scroll:scrollY,viewport:[innerWidth,innerHeight],stage:e?.getBoundingClientRect().toJSON()};});
          results.push({width,height,target:p,diagnostics,error:String(error)});
          await page.screenshot({path:out+'/'+width+'-seek-failure-'+p+'.png'});
          throw error;
        }
      }
      const states=new Map();
      for(const [name,p] of shots){
        await seek(p);
        await page.screenshot({path:out+'/'+width+'-'+name+'.png'});
        if(!comparison&&height<610&&width<=900){
          const rail=await stage.locator('.chapter-rail').boundingBox();
          assert.ok(rail&&rail.y>=60&&rail.y+rail.height<=height-50,'short landscape controls must fit above fixed navigation: '+JSON.stringify(rail));
        }
        const state=JSON.parse(await stage.getAttribute('data-handoff-state')||'null');
        const budget=JSON.parse(await stage.getAttribute('data-handoff-budget')||'null');
        results.push({width,height,name,phase:await stage.getAttribute('data-handoff-phase'),status:await status.textContent(),state,budget});
        if(!comparison){
          assert.equal(state.id,'PR-017');assert.equal(state.world,'coordination-studio');assert.equal(state.actors.length,4);assert.ok(state.actors.every(a=>a.length===10&&a.every(Number.isFinite)));assert.equal(state.owner,'native-scroll');assert.equal(state.mechanicalRoutes,0);
          assert.equal(state.decision,p>=.69);assert.equal(state.receipt,p>=.94);assert.equal(state.physicalApproval,p>=.69);
          const safe=([x,y])=>x>.06&&x<.94&&y>.10&&y<.78;
          assert.ok(safe(state.screen.request),'request out of frame '+name+' '+JSON.stringify(state.screen.request));
          if(name==='review'||name==='approved')assert.ok(safe(state.screen.reviewer),'reviewer out of frame');
          if(name==='flight'||name==='receipt')assert.ok(safe(state.screen.receiver),'receiver out of frame');assert.deepEqual(state.displays,[p>=.37,p>=.39,p>=.94]);
          assert.equal(state.paperCount,56);assert.deepEqual(state.papers.map(x=>x[0]),Array.from({length:56},(_,i)=>i));
          assert.ok(budget.calls>0&&budget.calls<240&&budget.triangles>0);assert.ok(state.jointMatrices.every(actor=>actor.length===8&&actor.every(m=>m.length===16&&m.every(Number.isFinite))));if(name==='review'){assert.ok(state.contact.engage>.99);assert.equal(state.contact.clamped,false);assert.ok(state.contact.error<.015,'actual grip residual '+state.contact.error);assert.ok(Math.abs(state.contact.stampFace[1]-state.contact.documentFace[1])<.035,'stamp must reach document surface');const [sx,sy,sz]=state.contact.stampOnDocument;assert.ok(sx>.06-.34&&sx<.06+.34&&Math.abs(sz)<.215&&Math.abs(sy-.092)<.035,'stamp surface lies on document, not merely at same height');assert.equal(state.displays[2],false);}
          states.set(name,state);
        }
      }
      if(comparison||stills)continue;
      const opening=states.get('opening'),trace=states.get('trace'),receipt=states.get('receipt');
      const changed=opening.papers.filter((m,i)=>Math.hypot(...[13,14,15].map(j=>m[j]-receipt.papers[i][j]))>1).length;
      const rotated=opening.papers.filter((m,i)=>Math.hypot(...[1,2,3,5,6,7,9,10,11].map(j=>m[j]-receipt.papers[i][j]))>.2).length;
      assert.ok(changed>=40&&rotated>=40,'paper storm must move and rotate');
      assert.ok(opening.stations.some((x,i)=>Math.abs(x[3]-receipt.stations[i][3])>.2),'desk alignment must move');
      assert.ok(states.get('flight').position[1]>2,'file must fly');
      assert.ok(states.get('review').stamp>.5,'human stamp action');
      assert.ok(trace.papers.some((x,i)=>JSON.stringify(x)!==JSON.stringify(opening.papers[i])));
      // Continuous actual scroll with measured native progress and visible scene states.
      await seek(0);
      for(const direction of [1,-1]){
        const samples=await page.evaluate(async direction=>{
          const el=document.getElementById('complexity-clarity-scene'),r=el.getBoundingClientRect(),top=scrollY+r.top,travel=r.height-innerHeight,log=[];
          const start=performance.now();
          await new Promise(resolve=>{function frame(now){const t=Math.min(1,(now-start)/7000),p=direction===1?t:1-t;window.scrollTo({top:Math.round(top+p*travel),behavior:'instant'});const s=document.querySelector('[data-handoff-chamber]');log.push({phase:Number(s?.dataset.handoffPhase),scroll:scrollY});if(t<1)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
          return log;
        },direction);
        results.push({width,height,direction,samples});
        assert.ok(samples.length>=12&&new Set(samples.map(x=>x.phase)).size>=10,'continuous samples '+direction+' total='+samples.length+' distinct='+new Set(samples.map(x=>x.phase)).size);
        assert.ok(direction===1?samples.at(-1).phase>samples[0].phase:samples.at(-1).phase<samples[0].phase);
        await seek(direction===1?1:0);
      }
      for(const [name,p] of [...shots].reverse()){
        await seek(p);
        assert.deepEqual(JSON.parse(await stage.getAttribute('data-handoff-state')),states.get(name),'reversible '+name);
      }
      // Repeated and nonmonotonic seeks exercise both blended and fully engaged IK.
      for(const [name,p] of [shots[2],shots[5],shots[0],shots[2],shots[2],shots[3],shots[1],shots[5]]){await seek(p);assert.deepEqual(JSON.parse(await stage.getAttribute('data-handoff-state')),states.get(name),'history-independent '+name);}
      // Existing chapter controls: verify the settled target, not an intermediate phase.
      for(const index of [0,1,2,0]){
        const button=stage.locator('.chapter-rail button').nth(index),p=Number(await button.getAttribute('data-clarity-jump'));
        await button.click();
        await page.waitForFunction(p=>{const s=window.__SCENE_DIRECTOR__.getScenes()['home-clarity'];return s&&Math.abs(s.exact-p)<.004&&Math.abs(s.exact-s.smooth)<.0001;},p,{timeout:20000});
        assert.match(await status.textContent(),/PR-017/);
        assert.equal(await button.getAttribute('aria-current'),'step');
      }
      const dimensions=await stage.evaluate(el=>({stage:el.getBoundingClientRect().height,canvas:el.querySelector('#handoff-chamber-webgl').getBoundingClientRect().height}));
      assert.ok(Math.abs(dimensions.stage-dimensions.canvas)<2);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      const lost=await stage.locator('#handoff-chamber-webgl').evaluate(c=>{const gl=c.getContext('webgl2')||c.getContext('webgl');const ext=gl?.getExtension('WEBGL_lose_context');if(!ext)return false;window.__s02ContextExtension=ext;ext.loseContext();return true;});
      if(lost){await page.waitForFunction(()=>!document.querySelector('[data-handoff-chamber]'));assert.equal(await stage.locator('#home-clarity-canvas').evaluate(c=>getComputedStyle(c).visibility),'visible');await page.screenshot({path:out+'/'+width+'-context-lost.png'});assert.match(await stage.locator('.cinematic-poster-fallback').getAttribute('src'),/coordination-studio-r5/);await page.evaluate(()=>window.__SCENE_DIRECTOR__.jumpTo('home-clarity',.625));await page.waitForFunction(()=>{const s=window.__SCENE_DIRECTOR__.getScenes()['home-clarity'];return s&&Math.abs(s.exact-.625)<.004&&Math.abs(s.exact-s.smooth)<.0001;});await page.evaluate(()=>{window.__s02ContextExtension.restoreContext();delete window.__s02ContextExtension;});await stage.locator('#handoff-chamber-webgl').waitFor({state:'visible',timeout:20000});await seek(.625);assert.deepEqual(JSON.parse(await stage.getAttribute('data-handoff-state')),states.get('review'),'context restore rig');}
      results.push({width,height,changed,rotated,contextLoss:lost?'fallback verified':'extension unavailable'});
      assert.deepEqual(errors,[]);
    } catch(error){failures.push({width,height,error:String(error)});console.error(width,height,error);}
    finally {await context.close();if(!comparison&&!stills){const video=page.video();if(video)await video.saveAs(out+'/motion/'+width+'-native-forward-reverse.webm');}}
  }
  if(!comparison&&!stills&&(!viewportFilter||viewportFilter===390))for(const mode of ['reduced','gpu-off','no-js','normal','shadow-off']){
    const page=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
    await page.goto(base+(mode==='gpu-off'?'?webgl=off':mode==='shadow-off'?'?s02shadow=off&s02qa=1':''),{waitUntil:'domcontentloaded'});
    if(mode!=='no-js')await page.waitForFunction(()=>window.__SITE_READY__===true);
    await page.locator('#complexity-clarity-scene').scrollIntoViewIfNeeded();
    if(mode==='shadow-off'){await page.locator('#handoff-chamber-webgl').waitFor({state:'visible',timeout:20000});await page.evaluate(()=>window.__SCENE_DIRECTOR__.jumpTo('home-clarity',.625));await page.waitForFunction(()=>Math.abs(Number(document.querySelector('[data-handoff-chamber]')?.dataset.handoffPhase)-.625)<.003);await page.screenshot({path:out+'/shadow-off-review.png'});results.push({mode,budget:JSON.parse(await page.locator('[data-handoff-chamber]').getAttribute('data-handoff-budget'))});await page.close();continue;}
    if(mode==='normal'){await page.locator('#handoff-chamber-webgl').waitFor({state:'visible',timeout:20000});assert.equal(await page.locator('[data-handoff-state]').count(),0);assert.equal(await page.locator('[data-handoff-budget]').count(),0);const frames=await page.evaluate(async()=>{const log=[];await new Promise(resolve=>{let last=performance.now(),start=last;function tick(now){log.push(now-last);last=now;window.__SCENE_DIRECTOR__.jumpTo('home-clarity',Math.min(.97,(now-start)/3500));if(now-start<3500)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});return log;});results.push({mode,frames});await page.close();continue;}
    assert.equal(await page.locator('#handoff-chamber-webgl').count(),0);
    assert.equal(await page.locator('#complexity-clarity-scene .cinematic-poster-fallback').count(),1);
    assert.match(await page.locator('#complexity-clarity-scene .cinematic-poster-fallback').getAttribute('src'),/coordination-studio-r5/);await page.screenshot({path:out+'/'+mode+'-fallback.png'});results.push({mode,result:'studio fallback present'});await page.close();
  }
} finally {await writeFile(out+'/results.json',JSON.stringify({results,failures},null,2));await browser.close();}
console.log('S02 browser evidence:',results.length);assert.deepEqual(failures,[],'viewport failures');
