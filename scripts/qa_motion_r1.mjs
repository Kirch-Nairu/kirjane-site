/* Creative Forge R1 offline evidence runner.
   Local Chromium only: never deploys. Requires npm ci + playwright install chromium.
   Run after: python scripts/build.py --preview --output dist/motion-qa
*/
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, process.env.MOTION_DIST || 'dist/motion-qa');
const out = resolve(root, process.env.MOTION_EVIDENCE || 'dist/motion-evidence');
if (!existsSync(resolve(dist, 'motion-lab/index.html'))) throw Error('Build the preview site before running motion QA.');
mkdirSync(out, { recursive: true });
mkdirSync(resolve(out, 'video'), { recursive: true });
const port = Number(process.env.MOTION_PORT || 41877);
const origin = 'http://127.0.0.1:' + port;
const server = spawn(process.env.PYTHON || 'python', ['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dist], { stdio: 'ignore' });
const errors = [];
const assertions = [];
const performanceRecords = [];
let browser;
function pass(condition, label, context = '') {
  assertions.push({ label, pass: !!condition, context });
  if (!condition) errors.push(label + (context ? ': ' + context : ''));
}
async function ready() {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(origin + '/motion-lab/'); if (r.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw Error('Local test server unavailable');
}
function percent(sorted, percentile) {
  if (!sorted.length) return null;
  return Math.round(sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*percentile)-1)]*100)/100;
}
async function profile(page, route, variant) {
  await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const p = await page.evaluate(async () => {
    const frames = []; const longTasks = [];
    let obs;
    try { obs = new PerformanceObserver(l => l.getEntries().forEach(e => longTasks.push(e.duration))); obs.observe({ type:'longtask', buffered:true }); } catch {}
    const max = Math.max(0,document.documentElement.scrollHeight-innerHeight);
    await new Promise(resolve => {
      let n = 0, last;
      function tick(t) {
        if (last !== undefined) frames.push(t-last);
        last = t; n++;
        window.scrollTo(0,max*Math.min(1,n/180));
        if(n<180) requestAnimationFrame(tick); else resolve();
      }
      requestAnimationFrame(tick);
    });
    obs?.disconnect();
    const resources=performance.getEntriesByType('resource');
    return {
      frames,
      longTasks,
      resources:resources.length,
      transferredBytes:resources.reduce((n,e)=>n+(e.transferSize||0),0),
      decodedResourceBytes:resources.reduce((n,e)=>n+(e.decodedBodySize||0),0),
      jsHeapBytes:performance.memory?.usedJSHeapSize ?? null,
      webglContexts:document.querySelectorAll('canvas').length, // canvas count is an upper bound, not exact contexts
      scrollHeight:document.documentElement.scrollHeight,
      viewportWidth:innerWidth
    };
  });
  const sorted=p.frames.toSorted((a,b)=>a-b);
  performanceRecords.push({
    route,variant,viewportWidth:p.viewportWidth,
    frameSampleCount:sorted.length,frameMsP95:percent(sorted,.95),
    frameMsP99:percent(sorted,.99),
    longTasksCount:p.longTasks.length,longTaskMsMax:p.longTasks.length?Math.max(...p.longTasks):0,
    resourceCount:p.resources,transferBytes:p.transferredBytes,
    decodedResourceBytes:p.decodedResourceBytes,jsHeapBytes:p.jsHeapBytes,
    canvases:p.webglContexts,scrollHeight:p.scrollHeight
  });
}
async function openPage(context,url) {
  const page=await context.newPage();
  const exceptions=[];
  page.on('pageerror', e=>exceptions.push(String(e)));
  const response=await page.goto(origin+url,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(450);
  return {page,response,exceptions};
}
try {
  await ready();
  browser=await chromium.launch({headless:true});
  const desktop=await browser.newContext({
    viewport:{width:1440,height:900},deviceScaleFactor:1,
    recordVideo:{dir:resolve(out,'video'),size:{width:1200,height:750}}
  });
  await desktop.addInitScript(() => sessionStorage.setItem('kirjane-cinematic-opening-r2','1'));
  const {page:lab,response:labResponse,exceptions:labErrors}=await openPage(desktop,'/motion-lab/');
  pass(labResponse?.ok(),'Lab returns success');
  pass(await lab.locator('[data-study]').count()===10,'Ten distinct studies rendered');
  pass(await lab.locator('meta[name=robots]').getAttribute('content').then(x=>x?.includes('noindex')),'Lab noindex retained');
  pass(await lab.locator('img[src*="kirjane-word-white.webp"]').count()===1,'Official wordmark retained');
  pass(await lab.evaluate(() => !!window.__KIRJANE_MOTION_R1__),'GSAP creative module booted');
  await lab.locator('[data-arc-next]').click();
  pass((await lab.locator('[data-arc-status]').innerText()).includes('2 of'),'Arc next button works');
  await lab.locator('[data-focus-next]').click();
  pass((await lab.locator('[data-focus-status]').innerText()).includes('2 / 3'),'Focus next button works');
  await lab.locator('[data-demo-advance]').click();
  pass((await lab.locator('[data-demo-status]').innerText()).includes('Step 2'),'Workflow manual advance works');
  await lab.screenshot({path:resolve(out,'motion-desktop.png'),fullPage:true});
  const audit=await new AxeBuilder({page:lab}).analyze();
  writeFileSync(resolve(out,'accessibility.json'),JSON.stringify({violations:audit.violations.map(({id,impact,nodes,description})=>({id,impact,description,nodes:nodes.length}))},null,2));
  pass(!audit.violations.some(v=>['critical','serious'].includes(v.impact)),'No serious or critical axe violations',audit.violations.map(x=>x.id).join(','));
  pass(labErrors.length===0,'Lab has no uncaught runtime exceptions',labErrors.join(' | '));
  await lab.close();

  const mobile=await browser.newContext({
    viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true,
    recordVideo:{dir:resolve(out,'video'),size:{width:390,height:844}}
  });
  const mob=await openPage(mobile,'/motion-lab/');
  pass(await mob.page.locator('[data-study]').count()===10,'All studies present on mobile');
  await mob.page.screenshot({path:resolve(out,'motion-mobile.png'),fullPage:true});
  pass(await mob.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No mobile horizontal page overflow');
  pass(mob.exceptions.length===0,'Mobile lab has no uncaught runtime errors',mob.exceptions.join(' | '));
  await mob.page.close();

  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const r=await openPage(reduced,'/motion-lab/');
  pass((await r.page.locator('#lab-motion-toggle').innerText()).includes('reduced'),'Reduced-motion state reported');
  pass(await r.page.locator('[data-demo-advance]').isEnabled(),'Manual replay accessible with reduced motion');
  pass(await r.page.locator('[data-study]').count()===10,'Reduced-motion still has every study');
  await r.page.close(); await reduced.close();

  for (const pageName of ['index','salryn','services','projects','process','about','contact']) {
    const route=pageName==='index'?'/':'/'+pageName+'/';
    const before=await openPage(desktop,route+'?reduce=1');
    pass(await before.page.locator('main').count()===1,'Baseline semantics preserved: '+pageName);
    pass(!await before.page.evaluate(()=>!!window.__KIRJANE_MOTION_R1__),'Experiment inactive by default: '+pageName);
    await before.page.close();
    const after=await openPage(desktop,route+'?creative=1&reduce=1');
    pass(await after.page.locator('main').count()===1,'Experiment semantics preserved: '+pageName);
    pass(await after.page.evaluate(()=>!!window.__KIRJANE_MOTION_R1__),'Opt-in experiment module: '+pageName);
    pass(after.exceptions.length===0,'No opt-in runtime exception: '+pageName,after.exceptions.join(' | '));
    await after.page.close();
  }
  for (const route of ['/','/salryn/']) {
    await profile((await desktop.newPage()),route,'baseline-motion');
    await profile((await desktop.newPage()),route+'?creative=1','candidate-motion');
  }
  await desktop.close(); await mobile.close();
} catch(e) {
  errors.push('RUNNER_ERROR: '+String(e?.stack||e));
} finally {
  if(browser) await browser.close();
  server.kill();
  const result={mission:'KIRJANE-ADVANCED-MOTION-INTEGRATION-R1',
    runAt:new Date().toISOString(),
    note:'Headless Chromium observations, synthetic frame loop; NOT field CWV, real GPU-memory instrumentation, or independent QA.',
    assertions,performanceRecords,errors,pass:errors.length===0};
  writeFileSync(resolve(out,'motion-qa-results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({pass:result.pass,checks:assertions.length,failures:errors,profiles:performanceRecords.length},null,2));
}
if(errors.length) process.exitCode=1;
