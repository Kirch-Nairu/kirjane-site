import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.S02_URL || 'http://127.0.0.1:8723/';
const out='dist/s02-chamber-evidence';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
try {
  for(const [width,height] of [[1440,900],[390,844],[320,700]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__SITE_READY__===true);
    const stage=page.locator('#complexity-clarity-scene .cinematic-sticky-stage');
    await stage.scrollIntoViewIfNeeded();
    await stage.locator('#handoff-chamber-webgl').waitFor({state:'visible',timeout:15000});
    const status=stage.locator('.handoff-scene-caption');
    for(const [name,index,lo,hi] of [['disorder',0,0,.18],['trace',1,.40,.55],['handover',2,.94,1],['reverse',0,0,.25]]){
      await stage.locator('.chapter-rail button').nth(index).click();
      await page.waitForFunction(([a,b])=>{
        const x=Number(document.querySelector('[data-handoff-chamber]')?.dataset.handoffPhase);
        return Number.isFinite(x)&&x>=a&&x<=b;
      },[lo,hi],{timeout:10000});
      const text=await status.textContent();
      assert.match(text,/PR-017/);
      if(name==='handover')assert.match(text,/RECEIVED/);
      if(name==='reverse')assert.match(text,/UNRESOLVED/);
      await page.screenshot({path:out+'/'+width+'-'+name+'.png'});
      results.push({width,height,name,phase:await stage.getAttribute('data-handoff-phase'),status:text});
    }
    // Scroll directly via the existing native director; capture review before
    // decision, approved hold, transfer and receipt, then matched reverse.
    const states=new Map();
    for(const [name,p] of [['pending',.61],['approved',.72],['transfer',.84],['receipt',.97],['transfer-reverse',.84],['approved-reverse',.72],['pending-reverse',.61]]){
      await page.evaluate(p=>window.__SCENE_DIRECTOR__.jumpTo('home-clarity',p),p);
      await page.waitForFunction(p=>{const el=document.querySelector('[data-handoff-chamber]');const s=window.__SCENE_DIRECTOR__.getScenes()['home-clarity'];return el&&Math.abs(s.exact-p)<.003&&Math.abs(s.exact-s.smooth)<.0001&&Math.abs(Number(el.dataset.handoffPhase)-s.exact)<.0002;},p,{timeout:15000});
      const state=JSON.parse(await stage.getAttribute('data-handoff-state'));
      const budget=JSON.parse(await stage.getAttribute('data-handoff-budget'));
      assert.equal(state.id,'PR-017');
      assert.equal(state.decision,p>=.69);assert.equal(state.receipt,p>=.94);
      assert.equal(state.position[1],1.19);
      if(p<.69)assert.equal(state.gate,0);
      if(p>.75)assert.equal(state.gate,1);
      if(p===.72)assert.ok(state.gate>0&&state.gate<1);
      assert.ok(budget.calls>0&&budget.triangles>0);
      assert.ok(budget.calls<240,`unexpected draw-call count ${budget.calls}`);
      if(name.endsWith('-reverse'))assert.deepEqual(state,states.get(name.replace('-reverse','')));
      else states.set(name,state);
      await page.screenshot({path:out+'/'+width+'-'+name+'.png'});
      results.push({width,height,name,phase:await stage.getAttribute('data-handoff-phase'),state,budget});
    }
    const dimensions=await stage.evaluate(el=>({stage:el.getBoundingClientRect().height,canvas:el.querySelector('#handoff-chamber-webgl').getBoundingClientRect().height}));
    assert.ok(Math.abs(dimensions.stage-dimensions.canvas)<2);
    // Force loss on the actual existing context, verify inherited fallback.
    const lost=await stage.locator('#handoff-chamber-webgl').evaluate(c=>{const gl=c.getContext('webgl2')||c.getContext('webgl');const ext=gl?.getExtension('WEBGL_lose_context');if(!ext)return false;ext.loseContext();return true;});
    if(lost){await page.waitForFunction(()=>!document.querySelector('[data-handoff-chamber]'));assert.equal(await stage.locator('#home-clarity-canvas').evaluate(c=>getComputedStyle(c).visibility),'visible');await page.screenshot({path:out+'/'+width+'-context-lost.png'});}
    results.push({width,height,contextLoss:lost?'fallback verified':'extension unavailable'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);
    await page.close();
  }
  for(const mode of ['reduced','gpu-off']){
    const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
    await page.goto(base+(mode==='gpu-off'?'?webgl=off':''),{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__SITE_READY__===true);
    await page.locator('#complexity-clarity-scene').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('#handoff-chamber-webgl').count(),0);
    assert.equal(await page.locator('#complexity-clarity-scene .cinematic-poster-fallback').count(),1);
    results.push({mode,result:'fallback present'});
    await page.close();
  }
} finally{
  await writeFile(out+'/results.json',JSON.stringify(results,null,2));
  await browser.close();
}
console.log('S02 focused browser checks passed:',results.length);
