import * as T from '../vendor/three/three.module.js';

// S02 R4: THE COORDINATION STUDIO — an authored architectural cutscene, directed in scroll time. All motion is a pure function of director phase.
// No external assets, extra RAF, timers, or simulated backend.
const clamp = x => Math.max(0, Math.min(1,x));
const ease = x => {x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
const span = (p,a,b) => ease((p-a)/(b-a));
const mix = (a,b,t) => a+(b-a)*t;
export function createHandoffChamber(stage, legacy, reduced=false) {
  if(reduced || matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(location.search).get('webgl')==='off') return null;
  let renderer;
  try {renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});}
  catch {return null;}
  const canvas=renderer.domElement;
  canvas.id='handoff-chamber-webgl';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'1',pointerEvents:'none',imageRendering:'auto'});
  renderer.setPixelRatio(1);
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;

  const scene=new T.Scene();scene.background=new T.Color(0x52666d);scene.fog=new T.Fog(0x64777a,30,75);
  const camera=new T.PerspectiveCamera(40,1,.1,100);
  const ambient=new T.HemisphereLight(0xe5efff,0xa98971,1.65);scene.add(ambient);
  const key=new T.DirectionalLight(0xffdab0,2.7);key.position.set(-5,8,4);scene.add(key);
  const rim=new T.DirectionalLight(0x9fcdf8,1.65);rim.position.set(7,5,-7);scene.add(rim);
  const heroLight=new T.PointLight(0xffc587,0,6);scene.add(heroLight);
  const root=new T.Group();scene.add(root);
  const mat=(color,roughness=.85,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
  const timber=mat(0xad7551),oak=mat(0xd7ad7b),cream=mat(0xf2e4d0),plaster=mat(0xd3c6b2),ink=mat(0x253b43),teal=mat(0x366d6b),sage=mat(0x839881),clay=mat(0xc26c50),navy=mat(0x344b6a),brass=mat(0xb99758,.35,.55),paper=mat(0xfff0d7),black=mat(0x20272a),leaf=mat(0x4d754b),leaf2=mat(0x86a65a),rug=mat(0x748c90);
  const white=new T.MeshBasicMaterial({color:0xfff3d9});
  const boxGeo=new T.BoxGeometry(1,1,1),sphereGeo=new T.SphereGeometry(1,12,9),cylGeo=new T.CylinderGeometry(1,1,1,16),taperGeo=new T.CylinderGeometry(.8,1,1,12),planeGeo=new T.PlaneGeometry(1,1);
  const geometries=new Set([boxGeo,sphereGeo,cylGeo,taperGeo,planeGeo]),materials=new Set(),textures=[];
  function mesh(g,m,parent,x,y,z,sx,sy,sz){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);geometries.add(g);materials.add(m);return o;}
  const b=(p,m,x,y,z,w,h,d)=>mesh(boxGeo,m,p,x,y,z,w,h,d);
  const ell=(p,m,x,y,z,w,h,d)=>mesh(sphereGeo,m,p,x,y,z,w,h,d);
  const cyl=(p,m,x,y,z,r,h,r2=r)=>mesh(cylGeo,m,p,x,y,z,r,h,r2);
  const group=(p,x=0,y=0,z=0)=>{const g=new T.Group();g.position.set(x,y,z);p.add(g);return g;};
  function beam(p,m,a,c,r=.05){const A=new T.Vector3(...a),B=new T.Vector3(...c),v=B.clone().sub(A);const o=cyl(p,m,0,0,0,r,v.length());o.position.copy(A).add(B).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
  function texture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;textures.push(t);return t;}
  function grain(base,accent,seed,wood=false){return texture(256,256,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);let n=seed;const r=()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);for(let i=0;i<3000;i++){x.globalAlpha=.025+r()*.12;x.fillStyle=accent;x.fillRect(r()*w,r()*h,wood?12+r()*90:1+r()*3,wood?.5+r()*2:1+r()*3);}x.globalAlpha=1;});}
  timber.map=grain('#a9714d','#563729',17,true);timber.color.setHex(0xffffff);
  oak.map=grain('#d7ae80','#795536',71,true);oak.color.setHex(0xffffff);
  plaster.map=grain('#d9cabb','#8e786d',42);plaster.color.setHex(0xffffff);
  rug.map=grain('#718a8a','#d0d4be',31);rug.color.setHex(0xffffff);
  const shadowTex=texture(128,128,x=>{const g=x.createRadialGradient(64,64,5,64,64,64);g.addColorStop(0,'rgba(28,22,20,.55)');g.addColorStop(.5,'rgba(28,22,20,.25)');g.addColorStop(1,'rgba(28,22,20,0)');x.fillStyle=g;x.fillRect(0,0,128,128);});
  const shadowMat=new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
  function shadow(p,x,z,w,d,y=.022){const o=mesh(planeGeo,shadowMat,p,x,y,z,w,d,1);o.rotation.x=-Math.PI/2;return o;}
  function placard(p,title,sub,x,y,z,w,h,fg='#253b43',bg='#f3e8d7'){const t=texture(768,256,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.fillStyle=fg;c.fillRect(0,0,13,H);c.font='600 62px Georgia';c.fillText(title,45,105,W-80);c.font='500 33px Arial';c.fillText(sub,45,180,W-80);});return mesh(planeGeo,new T.MeshBasicMaterial({map:t,side:T.DoubleSide}),p,x,y,z,w,h,1);}
  function flatCard(p,title,sub,x,y,z,w=.68,h=.46){const o=placard(p,title,sub,x,y,z,w,h);o.rotation.x=-Math.PI/2;return o;}
  // Open-sided daylight atelier, residential scale, built as a new world.
  const room=group(root);
  b(room,oak,0,-.16,0,15.8,.32,11.2);
  const plankMats=[mat(0xb98c65),mat(0xc69b72),mat(0xd1a77d),mat(0xb78b67)];
  for(let row=0;row<22;row++)for(let j=0;j<8;j++){const z=-5.25+row*.49,x=-6.88+j*1.96;b(room,plankMats[(row*5+j*3)%4],x,.003,z,1.94,.012,.476);}
  b(room,plaster,0,2.1,-5.35,15.8,4.2,.22);b(room,cream,0,.15,-5.18,15.6,.25,.08);
  b(room,plaster,7.78,2.1,-2.3,.22,4.2,6.1);
  const vista=texture(1024,512,(c,W,H)=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#91becf');g.addColorStop(.62,'#e9e4c4');g.addColorStop(1,'#f5d7a4');c.fillStyle=g;c.fillRect(0,0,W,H);c.fillStyle='#f8e8b9';c.beginPath();c.arc(748,100,57,0,Math.PI*2);c.fill();for(let k=0;k<3;k++){c.fillStyle=['#8aa8a2','#6e978c','#567a6d'][k];c.beginPath();c.moveTo(0,H);for(let i=0;i<=64;i++)c.lineTo(i*16,270+k*53+Math.sin(i*.21+k)*43+Math.cos(i*.41+k)*21);c.lineTo(W,H);c.fill();}});
  const windowMat=new T.MeshBasicMaterial({map:vista});
  for(let i=0;i<3;i++){const x=-5.2+i*3.28;b(room,ink,x,2.72,-5.15,2.98,2.48,.08);mesh(planeGeo,windowMat,room,x,2.72,-5.095,2.83,2.33,1);b(room,timber,x,1.47,-4.99,3.12,.16,.35);b(room,cream,x,2.72,-5.045,.09,2.36,.06);b(room,cream,x,3.19,-5.045,2.85,.075,.06);}
  b(room,teal,5.57,1.35,-5.08,3.38,2.65,.22);b(room,oak,5.57,.86,-4.71,3.43,.14,.72);
  for(let i=0;i<3;i++){b(room,ink,4.45+i*1.12,.45,-4.67,1.04,.7,.65);b(room,brass,4.45+i*1.12,.65,-4.31,.25,.045,.05);}
  for(let k=0;k<2;k++){b(room,oak,5.56,1.45+k*.78,-4.78,3.31,.09,.53);for(let i=0;i<12;i++){const h=.26+((i*7+k*3)%7)*.055;b(room,[clay,cream,navy,sage,timber][i%5],4.15+i*.235,1.51+k*.78+h/2,-4.72,.19,h,.32);}}
  placard(room,'Coordination studio','People • records • decisions',5.54,3.45,-4.99,3.0,.73,'#f0e6d2','#345a59');
  b(room,rug,.8,.027,1.0,7.7,.035,5.0);for(let i=0;i<4;i++)b(room,cream,.8,.052,-1.35+i*.075,7.15,.007,.026);
  function plant(p,x,z,scale=1){const g=group(p,x,0,z);g.scale.setScalar(scale);cyl(g,clay,0,.22,0,.31,.44);cyl(g,black,0,.45,0,.27,.035);for(let i=0;i<9;i++){const a=i*2.39996,r=.22+(i%3)*.1,h=.72+(i%4)*.15;beam(g,leaf,[0,.43,0],[Math.sin(a)*r,h,Math.cos(a)*r],.023);const l=ell(g,i%2?leaf:leaf2,Math.sin(a)*r,h,Math.cos(a)*r,.15,.33,.075);l.rotation.set(.42*Math.cos(a),a,.55*Math.sin(a));}shadow(g,0,0,1.5,1.2);return g;}
  plant(room,-7,-4.2,1.7);plant(room,7,-.6,1.5);plant(room,-6.9,3.8,1.1);
  const couch=group(room,5.65,0,3.8);shadow(couch,0,0,3.6,1.8);b(couch,timber,0,.23,0,3.25,.22,1.13);b(couch,sage,0,.56,0,3.15,.47,1.05);b(couch,sage,0,.96,-.42,3.15,.88,.26);
  for(let i=0;i<3;i++)ell(couch,i===1?clay:cream,-.95+i*.95,.93,-.25,.36,.33,.15).rotation.z=(i-1)*.17;
  const floorLamp=group(room,6.9,0,2.8);cyl(floorLamp,brass,0,.055,0,.28,.11);cyl(floorLamp,brass,0,1.1,0,.035,2.1);mesh(taperGeo,cream,floorLamp,0,2.12,0,.34,.47,.34);cyl(floorLamp,white,0,1.9,0,.28,.022);
  // Four different responsibilities: entry desk, research nook, conversation table, purchasing.
  const stations=[],staffers=[],animated=new Set();
  const positions=[[-4.6,0,1.85],[-2.75,0,-2.65],[.7,0,0],[4.25,0,-1.7]];
  const baseAngles=[-.17,.08,-.08,.12];
  const destinations=[[-.65,1.16,.24],[-.55,1.16,.23],[-.95,1.16,.32],[-.58,1.16,.25]];
  function desk(g,w,d,m){shadow(g,0,0,w+1,d+1.2);b(g,m,0,1.04,0,w,.15,d);for(const x of [-w/2+.19,w/2-.19])for(const z of [-d/2+.16,d/2-.16])beam(g,timber,[x,.04,z],[x*.94,.98,z*.86],.065);}
  function chair(g,x,z,color,angle=0){const c=group(g,x,0,z);c.rotation.y=angle;shadow(c,0,0,1.2,1.2);for(const a of [-1,1])for(const d of [-1,1])beam(c,timber,[a*.27,0,d*.26],[a*.23,.47,d*.21],.045);ell(c,color,0,.49,0,.39,.09,.35);ell(c,color,0,.87,-.29,.39,.39,.105);return c;}
  function laptop(g,x,z,title,sub){const l=group(g,x,1.13,z);b(l,ink,0,.026,0,.77,.055,.51);b(l,black,0,.06,.04,.65,.014,.32);const s=group(l,0,.04,-.23);s.rotation.x=-.16;b(s,ink,0,.27,0,.77,.55,.05);placard(s,title,sub,0,.27,.032,.70,.46,'#d7e7dd','#2e5256');return l;}
  function lamp(g,x,z){const l=group(g,x,1.13,z);cyl(l,brass,0,.035,0,.17,.07);beam(l,brass,[0,.05,0],[0,.73,0],.022);beam(l,brass,[0,.73,0],[.30,.81,.13],.022);mesh(taperGeo,teal,l,.3,.74,.13,.20,.25,.20);cyl(l,white,.3,.62,.13,.17,.018);}
  function mug(g,x,z,color){const m=group(g,x,1.19,z);cyl(m,color,0,0,0,.095,.15);cyl(m,black,0,.078,0,.073,.012);mesh(new T.TorusGeometry(.055,.015,6,12),color,m,.102,0,0,1,1,1);}
  function human(g,x,z,face,seated,palette){
    const o=group(g,x,0,z);o.rotation.y=face;animated.add(o);
    const skin=mat(palette.skin),hair=mat(palette.hair),shirt=palette.shirt,trouser=palette.pants,pelvis=seated?.67:.94;
    const torso=group(o,0,pelvis+.24,0);animated.add(torso);
    ell(torso,shirt,0,.015,0,.29,.39,.18);ell(torso,shirt,0,-.23,0,.24,.16,.17);ell(torso,cream,0,.28,.12,.10,.12,.055);
    for(const s of [-1,1]){const knee=[s*.15,seated?.49:.52,seated?.38:.035],hip=[s*.13,pelvis,0],ankle=[s*.16,.13,seated?.44:.03];beam(o,trouser,hip,knee,.115);ell(o,trouser,...knee,.115,.13,.115);beam(o,trouser,knee,ankle,.09);ell(o,black,s*.16,.09,seated?.54:.13,.115,.08,.21);}
    cyl(torso,skin,0,.39,0,.077,.16);
    const head=group(torso,0,.57,0);animated.add(head);
    ell(head,skin,0,0,0,.175,.23,.159);ell(head,skin,0,-.075,.065,.144,.13,.123);ell(head,hair,0,.09,-.044,.185,.181,.162);
    for(const s of [-1,1]){ell(head,skin,s*.17,-.012,0,.036,.065,.037);ell(head,cream,s*.063,.023,.141,.045,.025,.022);ell(head,black,s*.063,.023,.162,.017,.018,.009);ell(head,hair,s*.065,.073,.145,.055,.012,.014);}
    ell(head,skin,0,-.033,.162,.033,.045,.048);ell(head,clay,0,-.105,.139,.051,.012,.018);
    if(palette.style===1){ell(head,hair,0,-.035,-.095,.18,.25,.10);ell(head,hair,.085,.105,.088,.11,.13,.06);}
    else if(palette.style===2){ell(head,hair,0,.17,-.035,.15,.11,.15);ell(head,hair,-.13,.09,.02,.071,.13,.08);}
    else {for(let j=0;j<4;j++)ell(head,hair,-.12+j*.075,.15,.067,.07,.105,.075);}
    const arms=[];
    for(const s of [-1,1]){const a=group(torso,s*.27,.17,0);animated.add(a);ell(a,shirt,0,-.09,0,.108,.20,.112);ell(a,skin,0,-.245,0,.072,.085,.072);const elbow=group(a,0,-.25,0);animated.add(elbow);ell(elbow,skin,0,-.12,0,.071,.15,.074);ell(elbow,skin,0,-.255,.015,.078,.087,.053);arms.push({a,elbow,s});}
    return {o,torso,head,arms};
  }
  const palettes=[{skin:0xb97f56,hair:0x352823,shirt:clay,pants:navy,style:1},{skin:0x875b41,hair:0x242223,shirt:navy,pants:ink,style:2},{skin:0xd1a17b,hair:0x583d2b,shirt:teal,pants:ink,style:0},{skin:0xb57e59,hair:0x2b2524,shirt:cream,pants:navy,style:1}];
  let operator,stamp,reviewPending,reviewApproved,receivePending,receiveDone;
  for(let i=0;i<4;i++){
    const g=group(root,...positions[i]);stations.push(g);animated.add(g);
    if(i===0){desk(g,2.55,1.25,oak);chair(g,-.2,-.94,clay,0);laptop(g,.62,-.28,'New request','Details missing');lamp(g,-1.03,-.36);mug(g,.93,.3,teal);placard(g,'Intake','Receive the request',0,.78,.64,1.65,.38);staffers.push({i,staff:human(g,-.2,-.94,0,true,palettes[i])});}
    else if(i===1){desk(g,2.50,1.4,timber);chair(g,.1,-1.02,navy,0);for(let j=0;j<5;j++)b(g,[teal,clay,cream,navy,sage][j],-.83+j*.20,1.37,-.41,.16,.45,.46);laptop(g,.65,-.25,'Records check','Source located');mug(g,.95,.35,cream);placard(g,'Records','Confirm the details',0,.8,.72,1.65,.38);staffers.push({i,staff:human(g,.1,-1.02,0,true,palettes[i])});}
    else if(i===2){shadow(g,0,0,4.2,3.0,.052);cyl(g,oak,0,1.04,0,1.6,.15,1.08);cyl(g,timber,0,.52,0,.29,1.0);cyl(g,ink,0,.075,0,.73,.15);chair(g,0,-1.39,teal,0);chair(g,-1.55,.04,clay,Math.PI/2);chair(g,1.55,.04,navy,-Math.PI/2);
      operator=human(g,.12,-1.42,0,true,palettes[i]);lamp(g,-1,-.35);flatCard(g,'PR-017','Review notes',-.56,1.13,.30,.73,.45);
      stamp=group(g,.27,1.53,.13);animated.add(stamp);cyl(stamp,brass,0,0,0,.07,.18);ell(stamp,timber,0,.12,0,.13,.075,.13);b(stamp,ink,0,-.12,0,.25,.08,.19);
      reviewPending=placard(g,'Review pending','Human decision required',0,2.48,-.92,1.95,.59,'#5b3526','#f6d6a2');reviewApproved=placard(g,'Approved','Decision recorded',0,2.48,-.92,1.95,.59,'#244943','#cae5cf');}
    else{desk(g,2.7,1.30,oak);b(g,teal,.96,.48,-.08,.55,.82,.75);for(let j=0;j<2;j++){b(g,oak,.96,.36+j*.36,.31,.43,.27,.055);b(g,brass,.96,.39+j*.36,.35,.17,.035,.05);}laptop(g,-.8,-.27,'Purchasing','Assignment queue');lamp(g,.98,-.39);mug(g,.58,.36,clay);staffers.push({i,staff:human(g,.18,-.98,0,false,palettes[i])});
      receivePending=placard(g,'Purchasing','Awaiting approved record',0,2.58,-.77,2.1,.59);receiveDone=placard(g,'Assigned to purchasing','Receipt confirmed',0,2.58,-.77,2.1,.59,'#244943','#cae5cf');}
  }
  const request=group(root);animated.add(request);b(request,clay,0,0,0,.96,.08,.69);b(request,paper,.035,.057,0,.83,.055,.60);b(request,teal,-.39,.083,0,.15,.03,.63);flatCard(request,'PR-017','Purchase request',.06,.092,0,.68,.43);
  const tag=placard(request,'PR-017','Purchase request',0,.58,0,1.1,.38,'#253b43','#f7e8cf');
  const fileFlag=new T.Sprite(new T.SpriteMaterial({map:tag.material.map,depthTest:false,depthWrite:false,toneMapped:false}));fileFlag.position.set(0,.53,0);fileFlag.scale.set(1.40,.47,1);fileFlag.renderOrder=9;request.add(fileFlag);tag.removeFromParent();tag.material.dispose();
  const path=positions.map(([x,,z])=>new T.Vector3(x,1.18,z+.12));
  const arcs=[];for(let i=0;i<3;i++){const a=path[i],c=path[i+1],pts=[];for(let j=0;j<=64;j++){const t=j/64;pts.push(new T.Vector3(mix(a.x,c.x,t),1.18+Math.sin(t*Math.PI)*1.5,mix(a.z,c.z,t)));}const geo=new T.BufferGeometry().setFromPoints(pts),material=new T.LineBasicMaterial({color:0xf3d19a,transparent:true,opacity:0,depthWrite:false});const arc=new T.Line(geo,material);root.add(arc);arcs.push(arc);}
  const paperMap=texture(256,320,(x,W,H)=>{x.fillStyle='#f7eddb';x.fillRect(0,0,W,H);x.fillStyle='#3b6663';x.fillRect(20,23,130,12);x.fillStyle='#a7a09a';for(let j=0;j<10;j++)x.fillRect(20,55+j*17,195-(j%3)*24,3);x.strokeStyle='#b57450';x.strokeRect(169,242,60,36);});
  const sheetMaterial=mat(0xffffff);sheetMaterial.map=paperMap;
  const sheets=new T.InstancedMesh(boxGeo,sheetMaterial,56);sheets.instanceMatrix.setUsage(T.DynamicDrawUsage);sheets.frustumCulled=false;root.add(sheets);
  const debris=Array.from({length:56},(_,id)=>({id,theta:id*2.39996323,r:1.5+(id%11)*.43,desk:id%4,layer:Math.floor(id/4),pose:new T.Object3D()}));
  const target=new T.Vector3(),matrix=new T.Matrix4();const pulse=(p,a,b,c)=>span(p,a,b)-span(p,b,c);
  // Preserve local animation by batching under each nearest animated ancestor.
  animated.add(root);root.updateMatrixWorld(true);const buckets=new Map();
  root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||![boxGeo,sphereGeo,cylGeo,taperGeo].includes(o.geometry))return;let parent=o.parent;while(parent&&!animated.has(parent))parent=parent.parent;if(!parent)return;if(!buckets.has(parent))buckets.set(parent,new Map());const by=buckets.get(parent),k=o.geometry.uuid+o.material.uuid;if(!by.has(k))by.set(k,[]);by.get(k).push(o);});
  for(const [parent,by] of buckets)for(const items of by.values()){if(items.length<2)continue;const m=new T.InstancedMesh(items[0].geometry,items[0].material,items.length),inv=parent.matrixWorld.clone().invert();items.forEach((o,i)=>{m.setMatrixAt(i,new T.Matrix4().multiplyMatrices(inv,o.matrixWorld));o.removeFromParent();});m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();parent.add(m);}
  let phase=0,disposed=false,failed=false,visible=false,last=-1,w=1,h=1;
  const status=document.createElement('div');
  status.className='handoff-scene-caption';status.setAttribute('aria-hidden','true');
  Object.assign(status.style,{position:'absolute',zIndex:'3',right:'4%',top:'12%',font:'600 13px system-ui',letterSpacing:'.035em',color:'#fff3df',background:'rgba(28,44,47,.88)',padding:'12px 16px',borderLeft:'2px solid #e5b97e',textShadow:'none',textAlign:'right',pointerEvents:'none',whiteSpace:'pre-line'});
  legacy.after(canvas);
  stage.append(status);
  function draw(){
    if(disposed||failed||!visible||document.hidden)return;

    const p=phase,trace=span(p,.09,.48),decision=span(p,.58,.69),release=span(p,.76,.94);
    stations.forEach((g,i)=>{const [x,y,z]=positions[i],q=span(p,.10+i*.024,.43+i*.018),s=1-q;g.position.set(x+s*Math.sin(i*4+1)*.78,y,z+s*Math.cos(i*4)*.64);g.rotation.y=baseAngles[i]+s*Math.sin(i*2.6+.7)*.40;});
    root.updateMatrixWorld(true);
    for(const d of debris){const i=d.id,q=span(p,.035+(i%9)*.018,.35+(i%9)*.019),u=1-q,theta=d.theta+p*15*(.52+(i%4)*.17)+q*3.7;const dest=destinations[d.desk];target.set(dest[0]+(d.layer%2)*.49,dest[1]+Math.floor(d.layer/2)*.018,dest[2]);stations[d.desk].localToWorld(target);const o=d.pose;
      o.position.set(mix(target.x,Math.sin(theta)*d.r-.35,u),mix(target.y,1.3+(i%8)*.42+Math.sin(theta*1.6)*.6,u)+Math.sin(q*Math.PI)*.7,mix(target.z,Math.cos(theta)*d.r*.65+.6,u));o.rotation.set(u*Math.sin(theta*1.4)*1.75,mix(stations[d.desk].rotation.y+(i%2)*.05,theta*1.6,u),u*Math.cos(theta*1.3)*1.3);o.scale.set(.42+(i%3)*.045,.018,.58);o.updateMatrix();sheets.setMatrixAt(i,o.matrix);}
    sheets.instanceMatrix.needsUpdate=true;
    let segment=0,t=span(p,.19,.37);if(p>=.37&&p<.55){segment=1;t=span(p,.39,.55);}else if(p>=.55){segment=2;t=release;}
    request.position.copy(path[segment]).lerp(path[segment+1],t);
    if(segment===0){target.set(0,1.18,.12);stations[0].localToWorld(target);target.y+=.55+(1-trace)*.9;target.x+=.35*Math.sin(p*13)*(1-trace);request.position.copy(target).lerp(path[1],t);}
    const spin=Math.sin(t*Math.PI);request.position.y+=spin*1.5;request.rotation.set(-.25*spin+(1-trace)*.19*Math.sin(p*19),.83*spin+(1-trace)*(.25+p*6),.24*spin+(1-trace)*.17*Math.cos(p*16));request.scale.setScalar(1+.16*spin+.12*(1-trace));
    const press=span(p,.585,.635)-span(p,.66,.72);
    function pose(staff,action,look){staff.torso.rotation.x=.045+action*.12;staff.head.rotation.x=.09+action*.22;staff.head.rotation.y=look;staff.arms.forEach(({a,elbow,s})=>{a.rotation.x=-.36-action*(s<0?.75:.43);a.rotation.z=s*(.19-action*.09);elbow.rotation.x=-.72-action*.55;});}
    pose(operator,press,.12-.24*press);stamp.position.y=1.53-.25*press;staffers.forEach(({staff,i})=>{const a=i===0?pulse(p,.01,.12,.24):i===1?pulse(p,.28,.40,.53):pulse(p,.79,.94,1.01);pose(staff,a,(i===0?.24:-.15)*(1-a));});
    reviewPending.visible=p<.69;reviewApproved.visible=p>=.69;receivePending.visible=p<.94;receiveDone.visible=p>=.94;
    ambient.intensity=mix(1.32,1.82,trace);key.intensity=mix(2.0,3.05,trace);rim.intensity=mix(1.95,1.22,decision);heroLight.position.copy(request.position).add(new T.Vector3(0,.8,1));heroLight.intensity=5+9*spin+5*press;
    arcs.forEach((arc,i)=>{const from=[.18,.39,.75][i],to=[.37,.55,.94][i],q=span(p,from,to);arc.geometry.setDrawRange(0,Math.floor(q*64)+1);arc.material.opacity=.78*pulse(p,from,(from+to)/2,to+.065);});
    const portrait=w<=900;
    const shots=[[0,-2.8,1.65,.7,.37,13.5,7,18,9.2],[.15,-2.5,1.7,.3,.16,13,7.5,17.2,9],[.37,-2,1.55,-.9,-.19,11.8,6.7,14,7.5],[.55,.7,1.55,0,-.30,6.3,3.5,8.5,4.5],[.69,.7,1.55,0,-.20,6.1,3.3,8.1,4.4],[.83,3.1,1.75,-.8,.08,8.3,4.7,10.7,6],[.95,4.1,1.6,-1.3,.30,7.8,4.7,10.2,5.8],[1,.5,1.15,-.7,.35,14,8.2,18.5,10.2]];
    let k=0;while(k<shots.length-2&&p>shots[k+1][0])k++;const l=shots[k],r=shots[k+1],v=span(p,l[0],r[0]),shot=n=>mix(l[n],r[n],v);
    const cx=shot(1),cy=shot(2),cz=shot(3),angle=shot(4),radius=shot(portrait?7:5);
    camera.fov=portrait?52:40;camera.position.set(cx+Math.sin(angle)*radius,shot(portrait?8:6),cz+Math.cos(angle)*radius);camera.lookAt(cx,cy,cz);camera.setViewOffset(w,h,portrait?0:-w*.20,portrait?h*.23:0,w,h);camera.updateProjectionMatrix();
    status.textContent=p<.18?'01 / A request arrives\nPR-017 · Ownership unclear':p<.55?'02 / Find the right record\nPR-017 · '+(p<.37?'Checking details':'Source confirmed'):p<.75?'03 / A human decision\nPR-017 · '+(p<.69?'Review pending':'Approved'):'04 / The next responsibility\nPR-017 · '+(p<.94?'Handover in progress':'Assigned to purchasing');
    const round=v=>+v.toFixed(3),vec=v=>v.toArray().map(round);
    stage.dataset.handoffState=JSON.stringify({id:'PR-017',position:vec(request.position),rotation:[request.rotation.x,request.rotation.y,request.rotation.z].map(round),decision:p>=.69,receipt:p>=.94,stamp:round(press),camera:vec(camera.position),stations:stations.map(g=>[...vec(g.position),round(g.rotation.y)]),papers:debris.map(d=>{sheets.getMatrixAt(d.id,matrix);return [d.id,...matrix.elements.map(round)];}),paperCount:sheets.count,mechanicalRoutes:0,owner:'native-scroll',world:'coordination-studio',actors:[operator,...staffers.map(s=>s.staff)].map(s=>[round(s.head.rotation.x),round(s.head.rotation.y),...s.arms.map(a=>round(a.elbow.rotation.x))])});
    try {renderer.render(scene,camera);stage.dataset.handoffPhase=p.toFixed(4);stage.dataset.handoffBudget=JSON.stringify({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures});}
    catch(error){console.warn("Handoff renderer failed",error);fallback();}
  }
  function resize(){
    if(disposed||failed)return;const r=stage.getBoundingClientRect();w=Math.max(1,Math.round(r.width));h=Math.max(1,Math.round(r.height));canvas.style.height='100%';
    const scale=w<=900?.9:.93;renderer.setSize(Math.round(w*scale),Math.round(h*scale),false);
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
      scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();canvas.remove();status.remove();legacy.style.visibility='';stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');stage.removeAttribute('data-handoff-state');stage.removeAttribute('data-handoff-budget');}
  };
}
