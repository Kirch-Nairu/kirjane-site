import * as T from '../vendor/three/three.module.js';

// S02 R3: THE HANDOFF CHAMBER — a living office diorama, directed in scroll time. All motion is a pure function of director phase.
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
  const ambient=new T.HemisphereLight(0xb5c8bc,0x594531,1.55);scene.add(ambient);
  const key=new T.DirectionalLight(0xffe5b6,3.6);key.position.set(-6,13,8);scene.add(key);
  const rim=new T.DirectionalLight(0x6cc9ae,1.8);rim.position.set(9,5,-10);scene.add(rim);
  const amberLight=new T.PointLight(0xffa052,18,9);amberLight.position.set(1,2,1);scene.add(amberLight);
  const root=new T.Group();scene.add(root);
  const heroLight=new T.PointLight(0xffd9a2,0,7);scene.add(heroLight);
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
  sign(room,'OPERATIONS / SHARED RECORDS',0,6.1,-7.8,7,.68,'#d9dfc3','#26352d');
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
  const stations=[],staffers=[];
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
      const staff=human(g,-.88,.85,Math.PI+.2);staffers.push({staff,i});
    }
    if(i===3){receivePending=sign(g,'AWAITING',0,2.36,-.62,1.55,.44,'#e2c290','#2e3026');receiveDone=sign(g,'RECEIVED',0,2.36,-.62,1.55,.44,'#bcf3aa','#18382d');}
  }
  // A single durable file object, not generated frames. Paper and green spine.
  const request=group(root);
  b(request,wood,0,0,0,1.15,.13,.84);b(request,paper,0,.083,0,1.04,.06,.73);
  b(request,green,-.46,.13,0,.19,.04,.8);b(request,amber,.42,.13,-.29,.14,.03,.11);
  const fileLabel=sign(request,'PR-017',0,.125,0,.86,.34,'#243b30','#f5e6bd');fileLabel.rotation.x=-Math.PI/2;
  // Camera-facing custody plate follows the one file, never a duplicate prop.
  const labelSource=sign(request,'PR-017',0,.62,0,1.36,.34,'#f4e8c5','#234437');
  const fileFlag=new T.Sprite(new T.SpriteMaterial({map:labelSource.material.map,depthTest:false,depthWrite:false,toneMapped:false}));
  fileFlag.position.set(0,.62,0);fileFlag.scale.set(1.52,.38,1);fileFlag.renderOrder=9;
  request.add(fileFlag);labelSource.removeFromParent();labelSource.geometry.dispose();labelSource.material.dispose();
  const path=positions.map(([x,,z])=>new T.Vector3(x,1.19,z+.15));
  // A fine graphic trace lives on the floor; suspended arcs are light, not machinery.
  const conduits=[],arcs=[];
  for(let i=0;i<3;i++){
    const a=path[i],c=path[i+1],len=a.distanceTo(c),steps=Math.ceil(len/.45);
    for(let j=0;j<steps;j++){
      const t=(j+.5)/steps,x=mix(a.x,c.x,t),z=mix(a.z,c.z,t);
      const mark=b(root,live,x,-1.145,z,.16,.025,.16);conduits.push({mark,i,t});
    }
    const pts=[];
    for(let j=0;j<=48;j++){const t=j/48;pts.push(new T.Vector3(mix(a.x,c.x,t),1.19+Math.sin(t*Math.PI)*1.85,mix(a.z,c.z,t)));}
    const geo=new T.BufferGeometry().setFromPoints(pts);
    const material=new T.LineBasicMaterial({color:0xc1e9aa,transparent:true,opacity:0,depthWrite:false});
    const arc=new T.Line(geo,material);root.add(arc);arcs.push(arc);
  }
  const wrong=group(root);
  for(let j=0;j<11;j++)b(wrong,red,-5.5+j*.3,-.8,2.2+j*.27,.17,.045,.17);
  sign(wrong,'NO OWNER',-2.05,.55,5.1,1.8,.52,'#ffc0a4','#542e23');
  const rejected=sign(wrong,'UNASSIGNED / CLOSED',-2.05,.56,5.12,1.8,.52,'#e7cc9d','#423a2e');
  const wrongSign=wrong.children.find(o=>o.material?.map&&o!==rejected);
  const signal=group(root);
  cylinder(signal,live,0,0,0,.17,.03);
  const paperMap=(()=>{
    const c=document.createElement('canvas');c.width=128;c.height=160;const x=c.getContext('2d');
    x.fillStyle='#e9dfbf';x.fillRect(0,0,128,160);x.fillStyle='#536755';x.fillRect(12,12,67,8);
    x.fillStyle='#a5a18c';for(let i=0;i<9;i++)x.fillRect(12,32+i*11,92-(i%3)*13,2);
    x.strokeStyle='#a48156';x.strokeRect(84,119,30,23);x.fillStyle='#a48156';x.fillRect(88,125,22,3);
    const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;textTextures.push(t);return t;
  })();
  const sheetMaterial=mat(0xffffff);sheetMaterial.map=paperMap;
  const debris=[],paperCount=56;
  const sheets=new T.InstancedMesh(boxGeo,sheetMaterial,paperCount);sheets.instanceMatrix.setUsage(T.DynamicDrawUsage);
  sheets.frustumCulled=false;root.add(sheets);
  const target=new T.Vector3();
  for(let i=0;i<paperCount;i++){
    // Stable IDs, seeded initial positions and four desk destinations.
    const theta=i*2.39996323,r=2.1+(i%11)*.57;
    debris.push({id:i,theta,r,desk:i%4,layer:Math.floor(i/4),
      pose:new T.Object3D()});
  }
  const pulse=(p,a,b,c)=>span(p,a,b)-span(p,b,c);
  const flares=[];
  for(let i=0;i<4;i++){
    const material=new T.MeshBasicMaterial({color:0xc5f3a4,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});
    const ring=new T.Mesh(new T.RingGeometry(.88,.94,48),material);ring.rotation.x=-Math.PI/2;root.add(ring);flares.push(ring);
  }
  // Distant vertical service structures, not random floating neon.
  for(let i=0;i<7;i++){
    const x=-8+i*2.65,z=-5.65;
    b(root,dark,x,1.05,z,.54,4.1,.63);
    for(let j=0;j<5;j++)b(root,iron,x,0+j*.55,z+.35,.58,.18,.14);
    b(root,i%3===0?amber:green,x,3.18,z,.48,.11,.5);
  }
  // Preserve room batching and batch each moving desk in its own local frame.
  // Animated papers use their own dynamic instance buffer; no paper is discarded.
  root.updateMatrixWorld(true);
  const moving=new Set([request,wrong,signal,stamp,...operator.arms,...staffers.flatMap(s=>s.staff.arms),...conduits.map(c=>c.mark),sheets]);
  const isMoving=o=>{for(let p=o;p;p=p.parent)if(moving.has(p))return true;return false;};
  const buckets=new Map();
  root.traverse(o=>{
    if(!o.isMesh||o.isInstancedMesh||o.geometry!==boxGeo||isMoving(o))return;
    let parent=root;for(let a=o.parent;a&&a!==root;a=a.parent)if(stations.includes(a)){parent=a;break;}
    if(!buckets.has(parent))buckets.set(parent,new Map());
    const byMat=buckets.get(parent);if(!byMat.has(o.material))byMat.set(o.material,[]);byMat.get(o.material).push(o);
  });
  for(const [parent,byMat] of buckets)for(const [material,items] of byMat){
    const mesh=new T.InstancedMesh(boxGeo,material,items.length),inv=parent.matrixWorld.clone().invert();
    items.forEach((o,i)=>{mesh.setMatrixAt(i,new T.Matrix4().multiplyMatrices(inv,o.matrixWorld));o.removeFromParent();});
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();parent.add(mesh);
  }
  let phase=0,disposed=false,failed=false,visible=false,last=-1,w=1,h=1;
  const status=document.createElement('div');
  status.className='handoff-scene-caption';status.setAttribute('aria-hidden','true');
  Object.assign(status.style,{position:'absolute',zIndex:'3',right:'4%',top:'12%',font:'600 12px monospace',letterSpacing:'.12em',color:'#e1edcc',textShadow:'0 2px 8px #0a1510',textAlign:'right',pointerEvents:'none',whiteSpace:'pre-line'});
  legacy.after(canvas);
  stage.append(status);
  function draw(){
    if(disposed||failed||!visible||document.hidden)return;
    const p=phase,trace=span(p,.12,.48),decision=span(p,.58,.69),release=span(p,.76,.94);
    // A choreographed, staggered alignment of the desks inside stationary architecture.
    stations.forEach((g,i)=>{
      const [x,y,z]=positions[i],q=span(p,.10+i*.026,.43+i*.018),s=1-q;
      g.position.set(x+s*Math.sin(i*4+1)*1.15,y+s*Math.cos(i*3)*.12,z+s*Math.cos(i*4)*1.1);
      g.rotation.y=s*Math.sin(i*2.6+.7)*.36;
    });
    root.updateMatrixWorld(true);
    // Spiral inward, tumble and settle into four visible, conserved record stacks.
    for(const d of debris){
      const i=d.id,q=span(p,.035+(i%9)*.018,.35+(i%9)*.019),u=1-q;
      const theta=d.theta+p*13*(.55+(i%4)*.17)+q*3.3;
      target.set(-.86+(d.layer%2)*.67,1.12+Math.floor(d.layer/2)*.034,.28);
      stations[d.desk].localToWorld(target);
      const o=d.pose;
      o.position.set(mix(target.x,Math.sin(theta)*d.r+1.1,u),
        mix(target.y,.95+(i%8)*.59+Math.sin(theta*1.6)*.73,u)+Math.sin(q*Math.PI)*.62,
        mix(target.z,Math.cos(theta)*d.r*.69+1.0,u));
      o.rotation.set(u*(Math.sin(theta*1.4)*1.7),mix(stations[d.desk].rotation.y+(i%2)*.05,theta*1.6,u),u*Math.cos(theta*1.3)*1.35);
      o.scale.set(.48+(i%3)*.055,.025,.68);o.updateMatrix();sheets.setMatrixAt(i,o.matrix);
    }
    sheets.instanceMatrix.needsUpdate=true;
    let segment=0,t=span(p,.19,.37);
    if(p>=.37&&p<.55){segment=1;t=span(p,.39,.55);}
    else if(p>=.55){segment=2;t=release;}
    const a=path[segment],c=path[segment+1];
    request.position.copy(a).lerp(c,t);
    if(segment===0){
      target.set(0,1.19,.15);stations[0].localToWorld(target);
      target.y+=.65+(1-trace)*.9;target.x+=.55*Math.sin(p*13)*(1-trace);
      request.position.copy(target).lerp(c,t);
    }
    request.position.y+=Math.sin(t*Math.PI)*1.85;
    const spin=Math.sin(t*Math.PI),chaos=1-trace;
    request.rotation.set(-.28*spin+chaos*.22*Math.sin(p*19),.9*spin+chaos*(.3+p*7),.25*spin+chaos*.17*Math.cos(p*16));
    request.scale.setScalar(1+.20*spin+.12*(1-trace));
    signal.position.copy(request.position);signal.position.y=-1.12;
    const press=span(p,.585,.635)-span(p,.66,.72);
    operator.arms[0].rotation.x=-.2-1.28*press;
    operator.arms[0].rotation.z=-.28*press;
    operator.arms[1].rotation.x=-.28-.38*press;
    stamp.position.y=.7-.36*press;
    staffers.forEach(({staff,i})=>{
      const action=i===0?pulse(p,.04,.14,.22):i===1?pulse(p,.30,.37,.47):pulse(p,.86,.94,1.01);
      staff.arms[0].rotation.x=-.27-.94*action;staff.arms[1].rotation.x=-.4-.57*action;
      staff.arms[1].rotation.z=.16*action;
    });
    reviewPending.visible=p<.69;reviewApproved.visible=p>=.69;
    receivePending.visible=p<.94;receiveDone.visible=p>=.94;
    wrongSign.visible=p<.42;rejected.visible=p>=.42;
    wrong.children.forEach(o=>{if(o.geometry===boxGeo){o.scale.y=mix(.045,.008,trace);o.visible=p<.47;}});
    amberLight.intensity=mix(24,2,decision);
    ambient.intensity=mix(.95,1.65,trace);key.intensity=mix(2.3,3.5,trace);
    rim.intensity=mix(2.5,1.35,decision);
    heroLight.position.copy(request.position).add(new T.Vector3(0,1.1,.8));heroLight.intensity=10+18*spin+12*press;
    conduits.forEach(({mark,i,t})=>{
      const start=[.13,.34,.69][i]+t*.13;
      mark.visible=p>=start;mark.material=i===2&&p<.76?amber:live;
    });
    arcs.forEach((arc,i)=>{
      const from=[.18,.39,.75][i],to=[.37,.55,.94][i],q=span(p,from,to);
      arc.geometry.setDrawRange(0,Math.floor(q*48)+1);
      arc.material.opacity=.65*pulse(p,from,(from+to)/2,to+.065);
    });
    flares.forEach((ring,i)=>{
      const at=[.19,.37,.69,.94][i],q=span(p,at,at+.065);
      ring.position.set(path[i].x,-1.105,path[i].z);
      ring.scale.setScalar(1+q*1.5);ring.material.opacity=(1-q)*span(p,at-.015,at)*.65;
    });
    // Editorial framing: storm overhead, diagonal sweep, close human review,
    // then a receiving-focused orbit and a calm wide lead-out.
    const portrait=w<=900;
    const shots=[
      [0,-1.6,1.25,1.7,.48,18.7,10.7,32,17.5],
      [.15,-1.3,1.55,1.5,.18,18.2,12.1,30,19],
      [.37,-1.8,1.15,-.7,-.32,16.8,10.2,26,16],
      [.55,2.25,1.45,1.55,-.58,8.7,5.2,12.5,7.4],
      [.69,2.25,1.45,1.55,-.43,8.2,4.8,12,7],
      [.83,4.65,1.65,.2,-.16,12.2,7.8,17,11],
      [.95,5.1,.95,-.8,.28,15.2,9.4,23,14],
      [1,1.1,.6,-.3,.44,19.6,12.3,31,19]
    ];
    let k=0;while(k<shots.length-2&&p>shots[k+1][0])k++;
    const l=shots[k],r=shots[k+1],v=span(p,l[0],r[0]),shot=n=>mix(l[n],r[n],v);
    const cx=shot(1),cy=shot(2),cz=shot(3),angle=shot(4),radius=shot(portrait?7:5);
    camera.fov=portrait?54:42;
    camera.position.set(cx+Math.sin(angle)*radius,shot(portrait?8:6),cz+Math.cos(angle)*radius);
    camera.lookAt(cx,cy,cz);
    camera.setViewOffset(w,h,portrait?0:-w*.17,portrait?h*.22:0,w,h);
    camera.updateProjectionMatrix();
    status.textContent=p<.18?'01 / DISORDER\nPR-017 · ROUTE UNRESOLVED':p<.55?'02 / TRACE\nPR-017 · '+(p<.37?'CUSTODY UNCONFIRMED':'CUSTODY FOUND'):p<.75?'03 / HUMAN REVIEW\nPR-017 · '+(p<.69?'AWAITING DECISION':'APPROVED'):'04 / HANDOVER\nPR-017 · '+(p<.94?'IN TRANSIT':'RECEIVED');
    const round=v=>+v.toFixed(3),vec=v=>v.toArray().map(round);
    stage.dataset.handoffState=JSON.stringify({id:'PR-017',position:vec(request.position),rotation:[request.rotation.x,request.rotation.y,request.rotation.z].map(round),decision:p>=.69,receipt:p>=.94,stamp:round(press),camera:vec(camera.position),
      stations:stations.map(g=>[...vec(g.position),round(g.rotation.y)]),
      papers:debris.map(d=>{const m=new T.Matrix4();sheets.getMatrixAt(d.id,m);return [d.id,...m.elements.map(round)];}),
      paperCount:sheets.count,mechanicalRoutes:0,owner:'native-scroll'});
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
