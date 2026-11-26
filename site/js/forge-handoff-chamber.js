import * as T from '../vendor/three/three.module.js';

// S02 R2: THE HANDOFF CHAMBER — a full architectural transfer room. All motion is a pure function of director phase.
// No external assets, extra RAF, timers, or simulated backend.
const clamp = x => Math.max(0, Math.min(1,x));
const ease = x => {x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
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
  renderer.toneMappingExposure=1.08;
  const scene=new T.Scene();
  scene.background=new T.Color(0x101a17);
  scene.fog=new T.FogExp2(0x101a17,.014);
  const camera=new T.PerspectiveCamera(43,1,.1,120);
  scene.add(new T.HemisphereLight(0xb5c8bc,0x594531,1.55));
  const key=new T.DirectionalLight(0xffe5b6,3.6);key.position.set(-6,13,8);scene.add(key);
  const rim=new T.DirectionalLight(0x6cc9ae,1.8);rim.position.set(9,5,-10);scene.add(rim);
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
  // Original, deterministic low-resolution material grain. No external imagery.
  function grain(base,accent,seed){
    const c=document.createElement('canvas');c.width=c.height=128;
    const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,128,128);
    let n=seed;const rng=()=>((n=(Math.imul(1664525,n)+1013904223)>>>0)/4294967296);
    for(let i=0;i<2200;i++){x.globalAlpha=.05+rng()*.15;x.fillStyle=accent;x.fillRect(rng()*128,rng()*128,1+rng()*5,1+rng()*2);}
    x.globalAlpha=.36;x.strokeStyle=accent;x.strokeRect(1,1,126,126);
    const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestMipmapLinearFilter;textTextures.push(t);return t;
  }
  concrete.map=grain('#b6b6a3','#555f54',17);concrete.color.setHex(0xffffff);
  wood.map=grain('#8b6850','#30271d',71);wood.color.setHex(0xffffff);
  iron.map=grain('#69736a','#252d28',42);iron.color.setHex(0xffffff);
  const floor=mat(0x343d35),wall=mat(0x48564b),recess=mat(0x1d2824);
  const glass=new T.MeshBasicMaterial({color:0x729b8d});
  const pale=new T.MeshBasicMaterial({color:0xe3cfa4});
  const room=group(root);
  // A built environment beyond the old isolated plinth: service floor,
  // high clerestory, steel columns, overhead cable trays and recesses.
  b(room,floor,0,-1.88,0,52,.45,45);
  for(let x=-24;x<=24;x+=3)for(let z=-18;z<=18;z+=3){
    if(Math.abs(x)<9&&Math.abs(z)<6)continue;
    b(room,(x+z)%6===0?floor:dark,x,-1.63,z,2.97,.035,2.97);
  }
  b(room,wall,0,2.4,-8.5,34,8.0,.55);
  b(room,recess,0,6.5,-8.15,33,.4,.3);
  for(let i=0;i<8;i++){
    const x=-14+i*4;
    b(room,iron,x,2.4,-8.05,.36,8.0,.8);
    b(room,recess,x+1.9,4.4,-8.16,3.35,2.3,.18);
    for(let j=0;j<3;j++)b(room,glass,x+.8+j*1.05,4.4,-8.04,.92,1.9,.04);
    b(room,iron,x+1.9,3.19,-7.98,3.5,.16,.25);
    b(room,pale,x+1.9,5.83,-7.88,2.5,.06,.12);
    b(room,dark,x+1.9,.18,-7.98,3.1,1.9,.18);
    for(let j=0;j<4;j++)b(room,iron,x+1.9,-.5+j*.42,-7.86,2.8,.06,.12);
  }
  for(const side of [-1,1]){
    for(let z=-5;z<=8;z+=4){
      b(room,iron,side*12,2.2,z,.55,7.6,.55);
      b(room,dark,side*12,-1.1,z,1.15,.65,1.15);
    }
    beam(room,iron,[side*12,5.9,-8],[side*12,5.9,10],.24);
    beam(room,dark,[side*11.5,-1.3,-8],[side*11.5,-1.3,10],.19);
  }
  // Foreground equipment and painted access lines establish parallax and scale.
  for(const side of [-1,1])for(let i=0;i<5;i++){
    b(room,rust,side*(10.1+i*.9),-1.59,7.3,.6,.025,.14);
    b(room,iron,side*10.6,-.75,-5.5+i*2.3,1.15,1.65,.85);
    b(room,recess,side*10.6,-.65,-5.04+i*2.3,.88,.9,.05);
  }
  sign(room,'OPERATIONS / TRANSFER HALL',0,6.1,-7.8,7,.68,'#d9dfc3','#26352d');
  // Soft baked contact shadows: no expensive real-time shadow maps.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;
  const sx=shadowCanvas.getContext('2d'),sg=sx.createRadialGradient(32,32,6,32,32,31);
  sg.addColorStop(0,'rgba(0,0,0,.72)');sg.addColorStop(.55,'rgba(0,0,0,.38)');sg.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=sg;sx.fillRect(0,0,64,64);
  const shadowTex=new T.CanvasTexture(shadowCanvas);textTextures.push(shadowTex);
  const shadowMat=new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
  function shadow(parent,x,y,z,w,d){
    const o=new T.Mesh(new T.PlaneGeometry(w,d),shadowMat);o.rotation.x=-Math.PI/2;o.position.set(x,y,z);parent.add(o);return o;
  }
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
  const positions=[[-5.9,0,2.3],[-2.6,0,-2.7],[2.25,0,1.55],[6.5,0,-1.7]];
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
    shadow(g,0,-1.12,0,5.2,4.1);
    b(g,dark,0,-.76,0,3.6,.7,2.9);b(g,concrete,0,-.34,0,3.45,.16,2.76);
    for(let j=0;j<5;j++)b(g,j%2?dark:rust,-1.3+j*.65,-.24,1.28,.48,.04,.14);
    for(let side of [-1,1]){b(g,iron,side*1.4,.38,-.75,.18,1.35,.18);b(g,iron,side*1.4,.38,.7,.18,1.35,.18);}
    b(g,wood,0,1,-.03,2.75,.17,1.48);
    b(g,iron,0,.89,.72,2.78,.09,.08);
    for(const side of [-1,1]){
      b(g,dark,side*1.02,.35,-.3,.56,1.02,.67);
      for(let k=0;k<3;k++){
        b(g,iron,side*1.02,.05+k*.32,.05,.49,.25,.055);
        b(g,ivory,side*1.02,.08+k*.32,.085,.2,.035,.035);
      }
    }
    shadow(g,-.85,-.245,.83,1.15,.8);
    // Real-world bay identifiers, conduit and dedicated task lights.
    b(g,iron,-1.63,.42,-.95,.13,1.62,.13);
    b(g,iron,-1.63,1.22,-.2,.12,.1,1.5);
    b(g,pale,.2,2.68,-.35,.6,.025,.31);
    if(i===0){for(let k=0;k<3;k++)b(g,green,-1.1+k*.25,1.24,-.4,.19,.27,.55);}
    if(i===3){b(g,green,.98,1.16,.42,.55,.12,.5);b(g,iron,.98,1.29,.65,.55,.26,.065);}
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
  // A low wheeled carrier remains under the sole request on the physical track.
  b(request,iron,0,-.09,0,1.12,.10,.82);
  for(const x of [-.37,.37])for(const z of [-.33,.33]){const wheel=cylinder(request,black,x,-.15,z,.095,.09,.095,10);wheel.rotation.x=Math.PI/2;}
  b(request,wood,0,0,0,.96,.12,.7);b(request,paper,0,.079,0,.82,.06,.59);
  b(request,green,-.36,.13,0,.16,.035,.67);b(request,amber,.31,.13,-.24,.13,.025,.1);
  const fileLabel=sign(request,'PR-017',0,.12,0,.66,.27,'#243b30','#e9dfb9');fileLabel.rotation.x=-Math.PI/2;
  const fileFlag=sign(request,'PR-017',0,.04,.39,.88,.21,'#e6e8bf','#20372c');
  // Fixed infrastructure rail, red dead-end and green valid route. Light bars track route state.
  const path=positions.map(([x,,z])=>new T.Vector3(x,1.19,z+.15));
  const conduits=[];
  for(let i=0;i<3;i++){
    const a=path[i],c=path[i+1];const lane=group(root);
    const d=c.clone().sub(a),len=Math.hypot(d.x,d.z),steps=Math.ceil(len/.46);
    const unit=d.clone().normalize(),normal=new T.Vector3(-unit.z,0,unit.x);
    // Between desk edges: continuous twin rails and a dark roller bed.
    const start=a.clone().addScaledVector(unit,1.12),end=c.clone().addScaledVector(unit,-1.12);
    for(const offset of [-.39,.39]){
      const aa=start.clone().addScaledVector(normal,offset),bb=end.clone().addScaledVector(normal,offset);
      beam(lane,iron,[aa.x,1.04,aa.z],[bb.x,1.04,bb.z],.10);
    }
    for(let j=0;j<Math.ceil((len-2.24)/.28);j++){
      const t=(j+.5)/Math.ceil((len-2.24)/.28),v=start.clone().lerp(end,t);
      const aa=v.clone().addScaledVector(normal,-.36),bb=v.clone().addScaledVector(normal,.36);
      beam(lane,j%3===0?iron:dark,[aa.x,.98,aa.z],[bb.x,.98,bb.z],.13);
      if(j%7===0){b(lane,iron,v.x,-.05,v.z,.16,1.9,.16);shadow(lane,v.x,-1.12,v.z,.65,.65);}
    }
    for(let j=0;j<steps;j++){
      const t=(j+.5)/steps,x=mix(a.x,c.x,t),z=mix(a.z,c.z,t);
      b(lane,iron,x,-.99,z,.43,.19,.43);
      const mark=b(lane,live,x,-.86,z,.24,.045,.24);conduits.push({mark,i,t});
    }
    beam(lane,iron,[a.x,-.8,a.z],[c.x,-.8,c.z],.11);
  }
  // Physical interlock at the review exit, clear only after decision.
  const outbound=path[3].clone().sub(path[2]).normalize();
  const gateAt=path[2].clone().addScaledVector(outbound,1.28);
  const gate=group(root,gateAt.x,1.04,gateAt.z);
  gate.rotation.y=Math.atan2(outbound.x,outbound.z);
  for(const x of [-.55,.55]){
    b(gate,iron,x,.16,0,.14,.45,.22);
    b(gate,dark,x,-.08,0,.28,.13,.30);
  }
  const gatePivot=group(gate,-.53,.32,0);
  const gateArm=b(gatePivot,amber,.51,0,0,1.02,.10,.12);
  for(let i=0;i<4;i++)b(gatePivot,dark,.14+i*.22,0,.065,.08,.105,.018);
  const gateLamp=b(gate,amber,.55,.48,0,.13,.10,.13);
  const headings=path.slice(1).map((point,i)=>Math.atan2(point.x-path[i].x,point.z-path[i].z));
  const rotateBetween=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;
  const wrong=group(root);
  for(let j=0;j<11;j++)b(wrong,red,-5.5+j*.3,-.8,2.2+j*.27,.17,.045,.17);
  sign(wrong,'NO OWNER',-2.05,.55,5.1,1.8,.52,'#ffc0a4','#542e23');
  const rejected=sign(wrong,'UNASSIGNED / CLOSED',-2.05,.56,5.12,1.8,.52,'#e7cc9d','#423a2e');
  const wrongSign=wrong.children.find(o=>o.material?.map&&o!==rejected);
  const signal=group(root);
  cylinder(signal,live,0,0,0,.17,.11);
  const debris=[];
  for(let i=0;i<27;i++){
    const o=b(root,i%4===0?ivory:paper,0,0,0,.36+(i%3)*.08,.025,.52);
    debris.push(o);
    const [x,,z]=positions[i%4];o.position.set(x-1.05+(i%3)*.16,1.115+Math.floor(i/4)*.023,z-.43+(i%2)*.14);o.rotation.y=Math.sin(i*2.7)*.23;
  }
  // Distant vertical service structures, not random floating neon.
  for(let i=0;i<7;i++){
    const x=-8+i*2.65,z=-5.65;
    b(root,dark,x,1.05,z,.54,4.1,.63);
    for(let j=0;j<5;j++)b(root,iron,x,0+j*.55,z+.35,.58,.18,.14);
    b(root,i%3===0?amber:green,x,3.18,z,.48,.11,.5);
  }
  // Batch fixed box primitives by shared material across the entire hall.
  // Only moving objects and changing indicators retain individual transforms.
  root.updateMatrixWorld(true);
  const buckets=new Map();
  const moving=new Set([request,wrong,signal,stamp,gatePivot,gateLamp,...operator.arms,...conduits.map(c=>c.mark)]);
  const isMoving=o=>{for(let p=o;p;p=p.parent)if(moving.has(p))return true;return false;};
  root.traverse(o=>{if(o.isMesh&&o.geometry===boxGeo&&!isMoving(o)){if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(o);}});
  for(const [material,items] of buckets){
    const mesh=new T.InstancedMesh(boxGeo,material,items.length);
    items.forEach((o,i)=>{mesh.setMatrixAt(i,o.matrixWorld);o.removeFromParent();});
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();root.add(mesh);
  }
  let phase=0,disposed=false,failed=false,visible=false,last=-1,w=1,h=1;
  const status=document.createElement('div');
  status.className='handoff-scene-caption';status.setAttribute('aria-hidden','true');
  Object.assign(status.style,{position:'absolute',zIndex:'3',right:'4%',top:'12%',font:'600 12px monospace',letterSpacing:'.12em',color:'#e1edcc',textShadow:'0 2px 8px #0a1510',textAlign:'right',pointerEvents:'none',whiteSpace:'pre-line'});
  legacy.after(canvas);
  stage.append(status);
  function draw(){
    if(disposed||failed||!visible||document.hidden)return;
    const p=phase,trace=span(p,.16,.40),decision=span(p,.58,.69);
    let a=path[0],c=path[1],t=span(p,.18,.36);
    if(p>=.36&&p<.55){a=path[1];c=path[2];t=span(p,.39,.55);}
    else if(p>=.55){a=path[2];c=path[3];t=span(p,.75,.94);}
    request.position.copy(a).lerp(c,t);
    // No airborne handoff: the trolley follows the desk-height rail.
    // Rotate at custody/approval holds rather than snapping at segment boundaries.
    const heading=p<.55?rotateBetween(headings[0],headings[1],span(p,.36,.39)):rotateBetween(headings[1],headings[2],span(p,.69,.75));
    request.rotation.set(0,heading,0);
    const gateOpen=span(p,.69,.75);
    gatePivot.rotation.z=gateOpen*Math.PI/2;
    gateArm.material=p>=.69?live:amber;
    gateLamp.material=p>=.69?live:amber;
    fileFlag.visible=true;
    signal.position.copy(request.position);signal.position.y=-.76;
    const press=span(p,.59,.64)-span(p,.66,.72);
    operator.arms[0].rotation.x=-.22-1.02*press;
    operator.arms[0].rotation.z=-.16*press;
    stamp.position.y=.7-.28*press;
    reviewPending.visible=p<.69;reviewApproved.visible=p>=.69;
    receivePending.visible=p<.94;receiveDone.visible=p>=.94;
    wrongSign.visible=p<.42;rejected.visible=p>=.42;
    wrong.children.forEach(o=>{if(o.geometry===boxGeo)o.scale.y=mix(.045,.012,trace);});
    amberLight.intensity=mix(20,3,decision);
    conduits.forEach(({mark,i,t})=>{
      mark.visible=true;
      const traced=p>=.16+i*.08+t*.08;
      mark.material=!traced?black:(i===2&&p<.69?amber:live);
    });
    // Three distinct cinematic framings, driven exclusively by scroll.
    // Wider architecture at entry and receipt, close human decision in between.
    const focus=span(p,.36,.55)-span(p,.73,.92);
    const angle=mix(.36,-.42,span(p,0,.54))+span(p,.77,1)*.60;
    const portrait=w<=900;
    const radius=(portrait?36:20.5)-focus*(portrait?18:7.5);
    const cx=mix(.15,2.25,focus),cz=mix(-.7,1.5,focus);
    camera.fov=portrait?57:43;
    camera.position.set(cx+Math.sin(angle)*radius,mix(portrait?25:12.6,portrait?12:7.3,focus),cz+Math.cos(angle)*radius);
    camera.lookAt(cx,.1+focus*.9,cz);
    camera.setViewOffset(w,h,portrait?0:-w*.105,portrait?h*.18:0,w,h);
    camera.updateProjectionMatrix();
    status.textContent=p<.18?'01 / DISORDER\nPR-017 · ROUTE UNRESOLVED':p<.55?'02 / TRACE\nPR-017 · '+(p<.36?'CUSTODY UNCONFIRMED':'CUSTODY FOUND'):p<.75?'03 / HUMAN REVIEW\nPR-017 · '+(p<.69?'AWAITING DECISION':'APPROVED'):'04 / HANDOVER\nPR-017 · '+(p<.94?'IN TRANSIT':'RECEIVED');
    stage.dataset.handoffState=JSON.stringify({id:'PR-017',position:request.position.toArray().map(v=>+v.toFixed(3)),decision:p>=.69,receipt:p>=.94,stamp:+press.toFixed(3),gate:+gateOpen.toFixed(3),heading:+heading.toFixed(3),camera:camera.position.toArray().map(v=>+v.toFixed(3))});
    try {renderer.render(scene,camera);stage.dataset.handoffPhase=p.toFixed(4);stage.dataset.handoffBudget=JSON.stringify({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures});}
    catch(error){console.warn("Handoff renderer failed",error);fallback();}
  }
  function resize(){
    if(disposed||failed)return;const r=stage.getBoundingClientRect();w=Math.max(1,Math.round(r.width));h=Math.max(1,Math.round(r.height));canvas.style.height='100%';
    const scale=w<=900?.85:.86;renderer.setSize(Math.round(w*scale),Math.round(h*scale),false);
    camera.aspect=w/h;camera.updateProjectionMatrix();draw();
  }
  const fallback=()=>{failed=true;canvas.hidden=true;canvas.style.display='none';legacy.style.visibility='';status.hidden=true;stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');stage.removeAttribute('data-handoff-state');stage.removeAttribute('data-handoff-budget');};
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});
  canvas.addEventListener('webglcontextrestored',()=>{if(disposed)return;failed=false;canvas.hidden=false;canvas.style.display='';legacy.style.visibility='hidden';status.hidden=false;stage.dataset.handoffChamber='live';resize();});
  const ro=new ResizeObserver(resize);ro.observe(stage);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)draw();});io.observe(stage);
  const visibility=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',visibility);
  legacy.style.visibility='hidden';stage.dataset.handoffChamber='live';
  resize();
  return {
    get active(){return !failed&&!disposed;},
    setPhase(p){phase=clamp(p);if(phase!==last){last=phase;draw();}},
    dispose(){if(disposed)return;disposed=true;ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);
      const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textTextures.forEach(t=>t.dispose());renderer.dispose();canvas.remove();status.remove();legacy.style.visibility='';stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');stage.removeAttribute('data-handoff-state');stage.removeAttribute('data-handoff-budget');}
  };
}
