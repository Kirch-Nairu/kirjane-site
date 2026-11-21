import gsap from '../vendor/gsap/index.js';

const NAMES=['DISCOVERY','ARCHITECTURE','ENGINEERING','VERIFICATION','HANDOVER'];
// Original CPU contour surface: stage transforms the terrain and one trail.
// No idle RAF, random field, SVG plate swap or additional scroll director.
export function createProcessField(host,reduced=false){
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
 host.replaceChildren(canvas);host.dataset.status='ready';
 const ctx=canvas.getContext('2d'),state={stage:0,phase:1};let selected=0,tween,visible=true;
 function draw(){
  if(!visible||document.hidden||!ctx)return;
  const w=host.clientWidth,h=Math.max(220,host.clientHeight),dpr=Math.min(devicePixelRatio,1.5);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=w*dpr;canvas.height=h*dpr;}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#0b251c';ctx.fillRect(0,0,w,h);
  const point=(u,v)=>{
   const focus=state.stage/4;
   const ridge=Math.exp(-Math.pow((u-focus)*3.3,2))*Math.cos(v*3)*(.2+state.stage*.018);
   return [w*(.09+u*.82),h*(.6+v*.24-ridge)+Math.sin(u*10+state.stage*.5)*h*.06];
  };
  for(let row=-18;row<=18;row++){
   ctx.beginPath();for(let col=0;col<=120;col++){const p=point(col/120,row/18);col?ctx.lineTo(...p):ctx.moveTo(...p);}
   ctx.strokeStyle=row%3===0?'#56866c':'#2a523d';ctx.lineWidth=row%3===0?.9:.5;ctx.stroke();
  }
  const stops=Array.from({length:5},(_,i)=>point(i/4,0));
  ctx.beginPath();for(let col=0;col<=120;col++){const p=point(col/120,0);col?ctx.lineTo(...p):ctx.moveTo(...p);}
  ctx.strokeStyle='#abc877';ctx.lineWidth=2;ctx.stroke();
  stops.forEach(([x,y],i)=>{
   ctx.fillStyle=i<=selected?'#d3f66b':'#163c2b';ctx.strokeStyle='#d3f66b';ctx.lineWidth=1;
   ctx.beginPath();ctx.arc(x,y,i===selected?9:4,0,Math.PI*2);ctx.fill();ctx.stroke();
   ctx.font='600 '+(w<400?10:12)+'px system-ui';ctx.textAlign='center';ctx.fillStyle='#eff6e6';
   ctx.fillText(String(i+1).padStart(2,'0'),x,y-26);
  });
  const u=(selected+state.phase)/5,packet=point(Math.min(1,u),0);
  ctx.fillStyle='#fff9ce';ctx.beginPath();ctx.arc(...packet,3,0,Math.PI*2);ctx.fill();
  ctx.textAlign='left';ctx.fillStyle='#d3f66b';ctx.font='600 12px system-ui';ctx.fillText('0'+(selected+1)+' / '+NAMES[selected],w*.06,h*.13);
  ctx.fillStyle='#adc5b1';ctx.font='11px system-ui';ctx.fillText(['MAP THE SIGNALS','DEFINE OWNERSHIP','CONNECT THE PATHWAYS','EXERCISE THE EXCEPTIONS','TRANSFER THE KNOWLEDGE'][selected],w*.06,h*.2);
 }
 const ro=new ResizeObserver(draw);ro.observe(host);
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)draw();});io.observe(host);
 const wake=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',wake);
 function select(index){selected=Math.max(0,Math.min(4,index));host.dataset.stage=selected;tween?.kill();state.phase=0;
  tween=gsap.to(state,{stage:selected,phase:1,duration:reduced?0:1.1,ease:'power2.inOut',onUpdate:draw});draw();}
 select(0);
 return {select,dispose(){tween?.kill();ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',wake);}};
}
