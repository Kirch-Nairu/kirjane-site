import * as T from '../vendor/three/three.module.js';

// S02: THE HANDOFF CHAMBER. All motion is a pure function of director phase.
// No external assets, extra RAF, timers, or simulated backend.
const clamp = x => Math.max(0, Math.min(1,x));
const ease = x => {x=clamp(x);return x*x*(3-2*x);};
const span = (p,a,b) => ease((p-a)/(b-a));
const mix = (a,b,t) => a+(b-a)*t;
export function createHandoffChamber(stage, legacy, reduced=false) {
  if(reduced || matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(location.search).get('webgl')==='off') return null;
  let renderer;
  try {renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'low-power'});}
  catch {return null;}
  const canvas=renderer.domElement;
  canvas.id='handoff-chamber-webgl';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'1',pointerEvents:'none',imageRendering:'pixelated'});
  renderer.setPixelRatio(1);
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  const scene=new T.Scene();
  scene.background=new T.Color(0x101a17);
  scene.fog=new T.FogExp2(0x101a17,.028);
  const camera=new T.PerspectiveCamera(38,1,.1,120);
  scene.add(new T.HemisphereLight(0xcad5bd,0x403329,2.1));
  const key=new T.DirectionalLight(0xffe5b6,3.1);key.position.set(-6,13,8);scene.add(key);
  const rim=new T.DirectionalLight(0x6cc9ae,2.6);rim.position.set(9,5,-10);scene.add(rim);
  const amberLight=new T.PointLight(0xffa052,18,9);amberLight.position.set(1,2,1);scene.add(amberLight);
  const root=new T.Group();scene.add(root);
  const mat=(color,roughness=.82,metalness=.08)=>new T.MeshStandardMaterial({color,roughness,metalness,flatShading:true});
  const concrete=mat(0x777b68), dark=mat(0x222c28), iron=mat(0x414c43,.48,.5), rust=mat(0x805b3a);
  const ivory=mat(0xd6c9a3), paper=mat(0xf1e6c5), wood=mat(0x6c4f39), green=mat(0x427f60);
  const amber=new T.MeshBasicMaterial({color:0xffb66c}), live=new T.MeshBasicMaterial({color:0xa6f9a0});
  const red=new T.MeshBasicMaterial({color:0xe77851}), black=mat(0x101713);
  const boxGeo=new T.BoxGeometry(1,1,1);
  const b=(parent,m,x,y,z,w,h,d)=>{
    const o=new T.Mesh(boxGeo,m);o.position.set(x,y,z);o.scale.set(w,h,d);parent.add(o);return o;
  };
  const group=(parent,x=0,y=0,z=0)=>{const o=new T.Group();o.position.set(x,y,z);parent.add(o);return o;};
  const cylinder=(parent,m,x,y,z,r,h,r2=r,n=8)=>{
    const o=new T.Mesh(new T.CylinderGeometry(r2,r,h,n),m);o.position.set(x,y,z);parent.add(o);return o;
  };
  const textTextures=[];
  function sign(parent, words,x,y,z,w,h,fg='#e4ebce',bg='#202d27'){
    const c=document.createElement('canvas');c.width=512;c.height=128;
    const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);
    ctx.strokeStyle=fg;ctx.lineWidth=3;ctx.strokeRect(7,7,498,114);
    ctx.fillStyle=fg;ctx.font='bold 48px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(words,256,64,470);
    const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.magFilter=T.NearestFilter;textTextures.push(tex);
    const o=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));
    o.position.set(x,y,z);parent.add(o);return o;
  }
  function beam(parent,m,a,c,width=.07){
    const A=new T.Vector3(...a),B=new T.Vector3(...c),v=B.clone().sub(A);
    const o=new T.Mesh(boxGeo,m);o.position.copy(A).add(B).multiplyScalar(.5);
    o.scale.set(width,v.length(),width);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());parent.add(o);return o;
  }
  // Layered cast-concrete deck with service bays, edge markings, pipes and rivets.
  b(root,dark,0,-1.65,0,19,.38,13);
  b(root,iron,0,-1.42,0,17.8,.22,11.8);
  for(let x=-8;x<=8;x+=2)for(let z=-5;z<=5;z+=2){
    b(root,concrete,x,-1.25,z,1.94,.14,1.94);
    if((x+z)%4===1)b(root,iron,x,-1.16,z,.75,.025,.8);
  }
  for(let i=0;i<18;i++){
    b(root,i%2?rust:dark,-8.5+i,-1.08,5.8,.8,.045,.24);
    b(root,iron,-8.5+i,-1.4,-6.03,.25,.18,.15);
  }
  for(const side of [-1,1]){
    for(let j=0;j<6;j++){
      const z=-5+j*2;
      b(root,iron,side*8.8,-.4,z,.12,1.7,.12);
      b(root,concrete,side*8.8,-1.05,z,.55,.15,.55);
    }
    beam(root,iron,[side*8.8,.44,-5],[side*8.8,.44,5],.13);
    beam(root,iron,[side*8.8,-.08,-5],[side*8.8,-.08,5],.075);
  }
  const stations=[];
  const positions=[[-5.6,0,2.1],[-2.3,0,-2.6],[2,0,1.5],[6,0,-1.5]];
  const names=['01 / INTAKE','02 / RECORDS','03 / REVIEW','04 / RECEIVING'];
  function papers(parent,x,y,z,count=6){
    for(let j=0;j<count;j++){const o=b(parent,j%3===0?ivory:paper,x+Math.sin(j*2.7)*.075,y+j*.023,z+Math.cos(j*2)*.06,.55,.023,.72);o.rotation.y=Math.sin(j*1.8)*.09;}
  }
  function terminal(parent,x,y,z){
    const o=group(parent,x,y,z);
    b(o,iron,0,.07,0,.58,.14,.48);b(o,dark,0,.36,0,.25,.5,.26);
    b(o,iron,0,.8,0,.95,.73,.62);b(o,black,0,.8,.326,.83,.59,.035);
    sign(o,'READY',0,.8,.35,.74,.38,'#aff3a0','#16372e');
    b(o,iron,0,.16,.48,.88,.08,.39);
    for(let k=0;k<9;k++)b(o,ivory,-.35+k*.087,.211,.48,.055,.018,.25);
    return o;
  }
  function human(parent,x,z,face){
    const o=group(parent,x,.01,z);o.rotation.y=face;
    const cloth=mat(0x637a68),skin=mat(0xc59c75),pants=mat(0x3c4944);
    for(let s of [-1,1]){b(o,pants,s*.16,.47,0,.24,.8,.25);b(o,dark,s*.16,.07,.1,.27,.16,.48);}
    b(o,cloth,0,1.13,0,.68,.65,.38);
    cylinder(o,skin,0,1.62,0,.10,.19);
    const head=new T.Mesh(new T.IcosahedronGeometry(.245,1),skin);head.scale.set(.88,1.13,.9);head.position.set(0,1.86,0);o.add(head);
    b(o,dark,0,2.04,-.04,.38,.13,.36);
    const arms=[];
    for(let s of [-1,1]){const a=group(o,s*.4,1.37,0);b(a,cloth,0,-.21,0,.22,.46,.24);b(a,skin,0,-.53,0,.19,.26,.2);arms.push(a);}
    return {o,arms};
  }
  let operator,stamp,reviewPending,reviewApproved,receivePending,receiveDone;
  for(let i=0;i<4;i++){
    const g=group(root,...positions[i]);stations.push(g);
    b(g,dark,0,-.76,0,3.6,.7,2.9);b(g,concrete,0,-.34,0,3.45,.16,2.76);
    for(let j=0;j<5;j++)b(g,j%2?dark:rust,-1.3+j*.65,-.24,1.28,.48,.04,.14);
    for(let side of [-1,1]){b(g,iron,side*1.4,.38,-.75,.18,1.35,.18);b(g,iron,side*1.4,.38,.7,.18,1.35,.18);}
    b(g,wood,0,1,-.03,2.75,.17,1.48);
    b(g,iron,0,.43,-.45,2.4,.1,.12);
    sign(g,names[i],0,-.48,1.47,2.9,.54);
    // overhead task lamp, conduit and shade
    beam(g,iron,[1.36,.95,-.7],[1.36,2.9,-.7],.13);
    beam(g,iron,[1.36,2.9,-.7],[.2,2.9,-.35],.13);
    b(g,dark,.2,2.81,-.35,.85,.19,.55);
    b(g,ivory,.2,2.7,-.35,.7,.04,.42);
    for(let j=0;j<3;j++)papers(g,-1+j*.26,1.1,.3-j*.22,4+j);
    if(i===1){
      for(let j=0;j<3;j++){
        b(g,iron,-1+j*.75,1.58,-.55,.62,1.08,.55);
        for(let k=0;k<3;k++){b(g,green,-1+j*.75,1.21+k*.31,-.24,.57,.27,.04);b(g,ivory,-1+j*.75,1.21+k*.31,-.21,.19,.05,.04);}
      }
    }else terminal(g,.65,1.1,-.35);
    if(i===2){
      operator=human(g,-.84,.9,Math.PI);
      const arch=group(g,-.05,1.15,.16);
      for(const x of [-.48,.48])b(arch,iron,x,.42,0,.1,.84,.14);
      b(arch,iron,0,.84,0,1.12,.15,.25);
      stamp=group(arch,0,.7,0);cylinder(stamp,rust,0,0,0,.17,.38);b(stamp,iron,0,-.2,0,.47,.12,.35);
      reviewPending=sign(g,'HOLD',0,2.36,-.62,1.55,.44,'#ffc98a','#412b24');
      reviewApproved=sign(g,'APPROVED',0,2.36,-.62,1.55,.44,'#bdf5aa','#18382d');
      b(g,amber,-.48,1.1,.56,.24,.075,.22);
    }else{
      const staff=human(g,-.88,.85,Math.PI+.2);
      staff.arms[0].rotation.x=-.35;staff.arms[1].rotation.x=-.6;
    }
    if(i===3){receivePending=sign(g,'AWAITING',0,2.36,-.62,1.55,.44,'#e2c290','#2e3026');receiveDone=sign(g,'RECEIVED',0,2.36,-.62,1.55,.44,'#bcf3aa','#18382d');}
  }
  // A single durable file object, not generated frames. Paper and green spine.
  const request=group(root);
  b(request,wood,0,0,0,.96,.12,.7);b(request,paper,0,.079,0,.82,.06,.59);
  b(request,green,-.36,.13,0,.16,.035,.67);b(request,amber,.31,.13,-.24,.13,.025,.1);
  const fileLabel=sign(request,'PR-017',0,.12,0,.66,.27,'#243b30','#e9dfb9');fileLabel.rotation.x=-Math.PI/2;
  const fileFlag=sign(request,'PR-017',0,.6,0,1.23,.38,'#e6e8bf','#20372c');fileFlag.rotation.y=.25;
  // Fixed infrastructure rail, red dead-end and green valid route. Light bars track route state.
  const path=positions.map(([x,,z])=>new T.Vector3(x,1.19,z+.15));
  const conduits=[];
  for(let i=0;i<3;i++){
    const a=path[i],c=path[i+1];const lane=group(root);
    const d=c.clone().sub(a),len=Math.hypot(d.x,d.z),steps=Math.ceil(len/.46);
    for(let j=0;j<steps;j++){
      const t=(j+.5)/steps,x=mix(a.x,c.x,t),z=mix(a.z,c.z,t);
      b(lane,iron,x,-.99,z,.43,.19,.43);
      const mark=b(lane,live,x,-.86,z,.24,.045,.24);conduits.push({mark,i,t});
    }
    beam(lane,iron,[a.x,-.8,a.z],[c.x,-.8,c.z],.11);
  }
  const wrong=group(root);
  for(let j=0;j<11;j++)b(wrong,red,-5.5+j*.3,-.8,2.2+j*.27,.17,.045,.17);
  sign(wrong,'NO OWNER',-2.05,.55,5.1,1.8,.52,'#ffc0a4','#542e23');
  const signal=group(root);
  cylinder(signal,live,0,0,0,.17,.11);
  const debris=[];
  for(let i=0;i<27;i++){
    const o=b(root,i%4===0?ivory:paper,0,0,0,.36+(i%3)*.08,.025,.52);
    debris.push(o);
  }
  // Distant vertical service structures, not random floating neon.
  for(let i=0;i<7;i++){
    const x=-8+i*2.65,z=-5.65;
    b(root,dark,x,1.05,z,.54,4.1,.63);
    for(let j=0;j<5;j++)b(root,iron,x,0+j*.55,z+.35,.58,.18,.14);
    b(root,i%3===0?amber:green,x,3.18,z,.48,.11,.5);
  }
  let phase=0,disposed=false,failed=false,visible=false,last=-1,w=1,h=1;
  const status=document.createElement('div');
  status.className='handoff-scene-caption';status.setAttribute('aria-hidden','true');
  Object.assign(status.style,{position:'absolute',zIndex:'3',right:'4%',top:'12%',font:'600 11px monospace',letterSpacing:'.12em',color:'#c7e8b5',textAlign:'right',pointerEvents:'none',whiteSpace:'pre-line'});
  legacy.after(canvas);
  stage.append(status);
  function draw(){
    if(disposed||failed||!visible||document.hidden)return;
    const p=phase,align=span(p,.12,.38),review=span(p,.56,.68),delivery=span(p,.73,.94);
    stations.forEach((g,i)=>{
      const [x,y,z]=positions[i];
      g.position.set(x+(1-align)*Math.sin(i*4+1)*1.0,y+(1-align)*Math.cos(i*3)*.17,z+(1-align)*Math.cos(i*4)*.9);
      g.rotation.y=(1-align)*Math.sin(i*2.6+.7)*.29;
    });
    let a=path[0],c=path[1],t=span(p,.26,.41);
    if(p>=.41&&p<.55){a=path[1];c=path[2];t=span(p,.41,.55);}
    else if(p>=.55){a=path[2];c=path[3];t=delivery;}
    request.position.copy(a).lerp(c,t);
    request.position.y+=Math.sin(t*Math.PI)*.45+(1-align)*.55;
    request.rotation.set((1-align)*.22*Math.sin(p*20),mix(.35+Math.sin(p*12)*.8,0,align),0);
    fileFlag.visible=p<.54||p>.73;
    signal.position.copy(request.position);signal.position.y=-.76;
    operator.arms[1].rotation.x=-1.15*span(p,.56,.61)+.95*span(p,.68,.73);
    stamp.position.y=.7-.46*(span(p,.60,.64)-span(p,.66,.70));
    reviewPending.visible=p<.68;reviewApproved.visible=p>=.68;
    receivePending.visible=p<.94;receiveDone.visible=p>=.94;
    wrong.visible=p<.42;
    amberLight.intensity=mix(24,3,review);
    conduits.forEach(({mark,i,t})=>{mark.visible=p>.19+i*.14+t*.10;mark.material=p>.68?live:(i===2?amber:live);});
    debris.forEach((o,i)=>{
      const q=span(p,.06+(i%5)*.018,.34+(i%5)*.02),theta=i*2.399;
      const target=positions[i%4];
      o.position.set(mix(Math.sin(theta)*6.8,target[0]-.7+(i%3)*.14,q),
        mix(.5+(i%7)*.42+Math.sin(p*12+i)*.35,1.14+Math.floor(i/4)*.025,q),
        mix(Math.cos(theta)*4.8,target[2]+.18,q));
      o.rotation.set((1-q)*Math.sin(i+p*10),theta+(1-q)*p*8,(1-q)*Math.cos(i+p*8));
    });
    const focus=span(p,.43,.55)-span(p,.69,.82);
    const angle=mix(.45,-.29,span(p,0,.48))+span(p,.78,1)*.48;
    const portrait=w<901;
    const radius=(portrait?34:25)-focus*(portrait?12:8);
    const cx=mix(0,2,focus),cz=mix(0,1.5,focus);
    camera.position.set(cx+Math.sin(angle)*radius, mix(portrait?20:14,7,focus),cz+Math.cos(angle)*radius);
    camera.lookAt(cx, .15+focus*.75,cz);
    // Off-axis lens composition leaves the editorial copy area undisturbed.
    camera.setViewOffset(w,h,portrait?0:-w*.17,0,w,h);
    camera.updateProjectionMatrix();
    status.textContent=p<.25?'01 / DISORDER\nPR-017 · ROUTE UNRESOLVED':p<.55?'02 / TRACE\nPR-017 · CUSTODY FOUND':p<.73?'03 / HUMAN REVIEW\nPR-017 · '+(p<.68?'AWAITING DECISION':'APPROVED'):'04 / HANDOVER\nPR-017 · '+(p<.94?'IN TRANSIT':'RECEIVED');
    try {renderer.render(scene,camera);stage.dataset.handoffPhase=p.toFixed(4);}
    catch(error){console.warn("Handoff renderer failed",error);fallback();}
  }
  function resize(){
    if(disposed||failed)return;const r=stage.getBoundingClientRect();w=Math.max(1,Math.round(r.width));h=Math.max(1,Math.round(r.height*(w<901?.46:1)));canvas.style.height=w<901?"46%":"100%";
    const scale=w<901?.80:.75;renderer.setSize(Math.round(w*scale),Math.round(h*scale),false);
    camera.aspect=w/h;camera.updateProjectionMatrix();draw();
  }
  const fallback=()=>{failed=true;canvas.hidden=true;canvas.style.display='none';legacy.style.visibility='';status.hidden=true;stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');};
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});
  canvas.addEventListener('webglcontextrestored',()=>{if(disposed)return;failed=false;canvas.hidden=false;canvas.style.display='';legacy.style.visibility='hidden';status.hidden=false;stage.dataset.handoffChamber='live';resize();});
  const ro=new ResizeObserver(resize);ro.observe(stage);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)draw();});io.observe(stage);
  const visibility=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',visibility);
  legacy.style.visibility='hidden';stage.dataset.handoffChamber='live';
  resize();
  return {
    get active(){return !failed&&!disposed;},
    setPhase(p){phase=clamp(p);if(Math.abs(phase-last)>.0001){last=phase;draw();}},
    dispose(){if(disposed)return;disposed=true;ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);
      const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textTextures.forEach(t=>t.dispose());renderer.dispose();canvas.remove();status.remove();legacy.style.visibility='';stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');}
  };
}
