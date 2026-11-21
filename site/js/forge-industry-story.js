import gsap from '../vendor/gsap/index.js';
const FLOWS=[
 ['Capture basket','Reserve stock','Review return','Close shift','Trace settlement'],
 ['Capture order','Deduct ingredients','Flag replenishment','Approve handoff','Close ledger'],
 ['Quote by unit','Confirm quantity','Review conversion','Dispatch goods','Record payment'],
 ['Receive intake','Book appointment','Assign role','Record supplies','Review billing'],
 ['Receive brief','Assign job','Request client approval','Record completion','Prepare invoice'],
 ['Front-desk request','Assign housekeeping','Review supplies','Handover shift','Record charge'],
 ['Reserve equipment','Record custody','Inspect return','Review deposit','Close hire'],
 ['Receive purchase','Move warehouse stock','Allocate order','Dispatch shipment','Review settlement'],
 ['Open work order','Assign technician','Issue parts','Verify repair','Prepare billing'],
 ['Receive materials','Release work order','Record production','Check quality','Record output'],
 ['Receive inputs','Assign seasonal crew','Track harvest lot','Review movement','Record custody'],
 ['Receive request','Route department','Review authority','Coordinate site','Retain record']
];
const STEPS=['Shared core','Your industry','Engine configuration','Working sequence','Your next step'];
export function createIndustryStory(host,families,engines,onControl){
 host.classList.add('r3-industry-story');
 host.innerHTML='<div class="r3-story-head"><span>ONE KERNEL / TWELVE CONTEXTS</span><span data-story-counter>01 / 05</span></div>'+ 
  '<div class="r3-story-space"><div class="r3-story-core">SALRYN<small>SECURITY + INFRASTRUCTURE</small></div><div class="r3-story-nodes"></div></div>'+ 
  '<div class="r3-story-copy"><h3></h3><p></p></div><ol class="r3-workflow"></ol>'+ 
  '<div class="r3-story-steps" role="group" aria-label="Industry narrative stage">'+STEPS.map((x,i)=>'<button type="button" data-story-step="'+i+'" aria-label="'+(i+1)+' '+x+'" aria-pressed="false">'+(i+1)+'<span>'+x+'</span></button>').join('')+'</div>'+ 
  '<div class="r3-story-actions"><button type="button" data-story-prev>Previous</button><button type="button" data-story-next>Next</button><button type="button" data-story-play aria-pressed="false">Play sequence</button><button type="button" data-story-replay>Replay</button><a href="#scene-g-configuration" data-story-inquire>Prepare this brief ↗</a></div>'+ 
  '<p class="r3-story-note">Illustrative workflow. Capabilities and availability depend on agreed project scope.</p>';
 host.querySelector('[data-story-inquire]').href=location.pathname+location.search+'#scene-g-configuration';
 let family=0,step=0,playing=false,clock;
 const q=s=>host.querySelector(s),abort=new AbortController();
 function paint(){
  const f=families[family];host.dataset.storyStep=step;host.dataset.industry=family;
  q('[data-story-counter]').textContent=String(step+1).padStart(2,'0')+' / 05';
  const title=["Every operation starts with one foundation.",f.name+' changes the shape of the work.',"Activate the relevant engines.","Follow a record through the operation.","Bring this context to the conversation."][step];
  q('h3').textContent=title;
  q('.r3-story-copy p').textContent=["Security and Infrastructure remain included across every industry.","The same core supports a different set of operational responsibilities.",f.engines.map(i=>engines[i].name).join(' · '),"A source-inspired example, played as a sequence of responsibilities.","Your industry choice is carried into the inquiry. Your existing notes remain yours."][step];
  q('.r3-story-nodes').innerHTML=engines.map((e,i)=>{
   const angle=(i/8)*Math.PI*2-Math.PI/2,rx=step<2?26:38,ry=step===3?20:35;
   return '<span class="r3-story-node '+(f.engines.includes(i)||e.mandatory?'is-powered':'')+'" style="--x:'+Math.cos(angle)*rx+'%;--y:'+Math.sin(angle)*ry+'%">'+e.name+(e.mandatory?' <small>CORE</small>':'')+'</span>';
  }).join('');
  q('.r3-workflow').innerHTML=FLOWS[family].map((name,i)=>'<li class="'+(step===3?'is-traced':'')+'"><b>0'+(i+1)+'</b>'+name+'</li>').join('');
  host.querySelectorAll('[data-story-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===step)));
  q('[data-story-prev]').disabled=step===0;q('[data-story-next]').disabled=step===4;
  q('[data-story-play]').textContent=playing?'Pause sequence':'Play sequence';q('[data-story-play]').setAttribute('aria-pressed',String(playing));
 }
 function stop(){clock?.kill();playing=false;}
 function select(n){stop();step=Math.max(0,Math.min(4,n));onControl();paint();}
 function schedule(){clock?.kill();if(!playing)return;clock=gsap.delayedCall(4,()=>{if(step<4){step++;paint();schedule();}else{stop();paint();}});}
 host.addEventListener('click',e=>{
  const b=e.target.closest('button,a');if(!b)return;
  if(b.hasAttribute('data-story-step'))select(Number(b.dataset.storyStep));
  if(b.hasAttribute('data-story-prev'))select(step-1);
  if(b.hasAttribute('data-story-next'))select(step+1);
  if(b.hasAttribute('data-story-replay'))select(0);
  if(b.hasAttribute('data-story-play')){onControl();playing=!playing;if(playing&&step===4)step=0;schedule();paint();}
  if(b.hasAttribute('data-story-inquire')){
   const select=document.getElementById('cfg-industry');select.value=families[family].name;select.dispatchEvent(new Event('change',{bubbles:true}));stop();paint();
  }
 },{signal:abort.signal});
 const visibility=()=>{if(document.hidden){stop();paint();}};document.addEventListener('visibilitychange',visibility,{signal:abort.signal});
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){stop();paint();}});observer.observe(host);
 paint();return {selectFamily(i){stop();family=i;step=0;paint();},dispose(){stop();abort.abort();observer.disconnect();}};
}
