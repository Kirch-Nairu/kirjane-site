import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {httpReady} from './http-ready.mjs';
const results=[];
for(const [label,dir]of [['before','dist/r4-baseline'],['after','dist/r4-integrated-02']]){
 const server=spawn('python',['-m','http.server','41980','--bind','127.0.0.1','--directory',dir],{stdio:'ignore'});let browser;
 try{
  for(let n=0;n<40;n++){if(await httpReady('http://127.0.0.1:41980/'))break;await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  await page.addInitScript(()=>{
   sessionStorage.setItem('kirjane-cinematic-opening-r2','1');window.__r4Draw={calls:0,cpuMs:0,primitives:0};
   for(const Klass of [WebGLRenderingContext,WebGL2RenderingContext])for(const name of ['drawElements','drawArrays']){
    const original=Klass.prototype[name];Klass.prototype[name]=function(...args){const start=performance.now();const value=original.apply(this,args);if(this.canvas.closest('#home-cap-plate-stage')){const p=window.__r4Draw;p.calls++;p.cpuMs+=performance.now()-start;p.primitives+=args[name==='drawElements'?1:2];}return value;};
   }
  });
  await page.goto('http://127.0.0.1:41980/');await page.locator('#capabilities-exhibition').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);
  await page.evaluate(()=>{window.__r4Draw={calls:0,cpuMs:0,primitives:0};});
  const initial=await page.evaluate(()=>performance.memory?.usedJSHeapSize??null);
  for(const i of [1,2,3,2,1,0]){await page.locator(`[data-cap-idx="${i}"]`).click();await page.waitForTimeout(1400);}
  const transition=await page.evaluate(()=>({...window.__r4Draw,heap:performance.memory?.usedJSHeapSize??null}));
  await page.waitForTimeout(1500);const idle=await page.evaluate(()=>({...window.__r4Draw}));
  const renderer=await page.locator('#home-cap-plate-stage canvas').evaluate(c=>{const gl=c.getContext('webgl2')||c.getContext('webgl');const e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
  results.push({label,renderer,viewport:[1440,900],dpr:1,initialHeap:initial,transition,idleExtraDrawCalls:idle.calls-transition.calls,caveat:'CPU submission time and synthetic browser heap only. Not GPU timing, field FPS, INP or hardware/mobile qualification.'});
 }finally{await browser?.close();server.kill();await new Promise(r=>server.once('exit',r));}
}
writeFileSync('docs/creative-forge-r4/evidence/qa/profile.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
