import * as T from '../vendor/three/three.module.js';
import {GLTFLoader} from '../vendor/three/addons/loaders/GLTFLoader.js';
import {loadHumanCast,bindHuman,poseHuman,disposeHuman} from './s02-authored-humans.js';

// S02 R9: THE COORDINATION STUDIO — FROM FRAGMENTS TO SYSTEMS — an authored architectural cutscene, directed in scroll time. All motion is a pure function of director phase.
// Locally vendored authored character assets. No external requests, extra RAF or simulated backend.
const clamp = x => Math.max(0, Math.min(1,x));
const ease = x => {x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
const span = (p,a,b) => ease((p-a)/(b-a));
const mix = (a,b,t) => a+(b-a)*t;
// A score in scroll-space, not wall-clock time. Each gesture has preparation,
// readable contact, and release. Semantic approvals are never inferred from animation.
export const S02_BEATS=Object.freeze({
  arrive:.04, source:.37, reviewStart:.53, reviewContact:.625,
  approved:.69, handoff:.76, receipt:.94, resolved:.97
});
const accent=(p,a,b,c)=>span(p,a,b)-span(p,b,c);
export function actingScore(p,role){
  p=clamp(p);
  const windows=[[.018,.075,.14,.23],[.245,.315,.405,.52],[.49,.55,.635,.745],[.73,.80,.925,1.0]];
  const [start,prepare,hit,end]=windows[role];
  const anticipate=accent(p,start,prepare,hit);
  const action=span(p,prepare,hit)-span(p,hit,end);
  const recover=accent(p,hit,hit+(end-hit)*.52,end);
  // Offset eye closure from the large body gesture, never from the current clock.
  const blinkCenters=[prepare+.009,Math.min(.985,end-.018)];
  const blink=Math.max(...blinkCenters.map(b=>accent(p,b-.009,b,b+.012)));
  const focus=span(p,start,prepare)-span(p,hit,end);
  return {anticipate:clamp(anticipate),action:clamp(action),recover:clamp(recover),blink:clamp(blink),focus:clamp(focus)};
}
export function paperFollowThrough(p,id){
  const end=.35+(id%9)*.019,local=clamp((p-end)/.042);
  // A finite, damped final wobble. Exactly zero before and after the landing.
  return Math.sin(local*Math.PI*2)*Math.sin(local*Math.PI)*(1-local)*.10;
}
export function deliveryArc(t,segment){
  const q=clamp(t),wave=Math.sin(Math.PI*q);
  return {lift:wave*1.5,side:wave*wave*(segment===1?-.30:.24),bank:wave*.24};
}

// Positive bone lengths; clamp against the reachable annulus without changing the target.
export function reachDistance(raw,L,M){return Math.max(Math.abs(L-M)+.001,Math.min(L+M-.001,raw));}
// Pixel ceilings are presentation policy, never narrative or QA policy.
// A software or low-power backend uses the same world and phase at a smaller raster.
export function rasterScale(w,h,constrained=false){
  const cap=constrained?420000:1050000;
  return Math.min(w<=900?.90:1,Math.sqrt(cap/(w*h)));
}
export function createHandoffChamber(stage, legacy, reduced=false) {
  if(reduced || matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(location.search).get('webgl')==='off') return null;
  let renderer;
  try {renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}
  catch {return null;}
  const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
  const backend=debug?String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)):'unknown';
  const constrained=/swiftshader|llvmpipe|software|basic render|softpipe/i.test(backend)||(navigator.hardwareConcurrency||8)<=4;
  const canvas=renderer.domElement;
  canvas.id='handoff-chamber-webgl';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'1',pointerEvents:'none',imageRendering:'auto'});
  renderer.setPixelRatio(1);
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=new URLSearchParams(location.search).get('s02shadow')!=='off';renderer.shadowMap.type=T.PCFSoftShadowMap;
  const qaEnabled=new URLSearchParams(location.search).get('s02qa')==='1';

  const scene=new T.Scene();scene.background=new T.Color(0x263b40);scene.fog=new T.Fog(0x435355,24,65);
  const camera=new T.PerspectiveCamera(40,1,.1,100);
  const ambient=new T.HemisphereLight(0xe1e9eb,0x9d7859,1.3);scene.add(ambient);
  const key=new T.DirectionalLight(0xffdfb9,2.7);key.position.set(-5,8,-4);scene.add(key);
  key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-9,right:9,top:8,bottom:-8,near:.5,far:27});key.shadow.bias=-.00035;key.shadow.normalBias=.018;key.shadow.radius=3;
  const rim=new T.DirectionalLight(0xb8d4ea,1.65);rim.position.set(4,5,6);scene.add(rim);
  const bounce=new T.DirectionalLight(0xf2ead9,.70);bounce.position.set(5,3,5);scene.add(bounce);
  // Two directional keys + hemisphere: no per-fragment point attenuation over the entire room.
  const root=new T.Group();scene.add(root);
  const mat=(color,roughness=.85,metalness=0)=>metalness>0?new T.MeshStandardMaterial({color,roughness,metalness}):new T.MeshLambertMaterial({color});
  const timber=new T.MeshStandardMaterial({color:0xad7551,roughness:.52}),oak=new T.MeshStandardMaterial({color:0xd7ad7b,roughness:.49}),cream=mat(0xf2e4d0),plaster=new T.MeshStandardMaterial({color:0xd3c6b2,roughness:.94}),ink=mat(0x253b43),teal=mat(0x366d6b),sage=mat(0x839881),clay=mat(0xc26c50),navy=mat(0x344b6a),brass=mat(0xb99758,.35,.55),paper=mat(0xfff0d7),black=mat(0x20272a),leaf=mat(0x4d754b),leaf2=mat(0x86a65a),rug=mat(0x748c90);
  const white=new T.MeshBasicMaterial({color:0xfff3d9});
  const boxGeo=new T.BoxGeometry(1,1,1),sphereGeo=new T.SphereGeometry(1,12,9),cylGeo=new T.CylinderGeometry(1,1,1,16),taperGeo=new T.CylinderGeometry(.8,1,1,12),planeGeo=new T.PlaneGeometry(1,1);
  const geometries=new Set([boxGeo,sphereGeo,cylGeo,taperGeo,planeGeo]),materials=new Set(),textures=[];
  function mesh(g,m,parent,x,y,z,sx,sy,sz){const o=new T.Mesh(g,m);o.receiveShadow=false;o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);geometries.add(g);materials.add(m);return o;}
  const b=(p,m,x,y,z,w,h,d)=>mesh(boxGeo,m,p,x,y,z,w,h,d);
  const ell=(p,m,x,y,z,w,h,d)=>mesh(sphereGeo,m,p,x,y,z,w,h,d);
  const cyl=(p,m,x,y,z,r,h,r2=r)=>mesh(cylGeo,m,p,x,y,z,r,h,r2);
  const group=(p,x=0,y=0,z=0)=>{const g=new T.Group();g.position.set(x,y,z);p.add(g);return g;};
  function beam(p,m,a,c,r=.05){const A=new T.Vector3(...a),B=new T.Vector3(...c),v=B.clone().sub(A);const o=cyl(p,m,0,0,0,r,v.length());o.position.copy(A).add(B).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
  function texture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;textures.push(t);return t;}
  function grain(base,accent,seed,wood=false){return texture(256,256,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);let n=seed;const r=()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);for(let i=0;i<3000;i++){x.globalAlpha=.025+r()*.12;x.fillStyle=accent;x.fillRect(r()*w,r()*h,wood?12+r()*90:1+r()*3,wood?.5+r()*2:1+r()*3);}x.globalAlpha=1;});}
  timber.map=grain('#a9714d','#563729',17,true);timber.color.setHex(0xffffff);
  oak.map=grain('#d7ae80','#795536',71,true);oak.color.setHex(0xffffff);
  plaster.map=grain('#d9cabb','#8e786d',42);plaster.color.setHex(0xf4dfc6);
  rug.map=grain('#718a8a','#d0d4be',31);rug.color.setHex(0xffffff);
  const shadowTex=texture(128,128,x=>{const g=x.createRadialGradient(64,64,5,64,64,64);g.addColorStop(0,'rgba(28,22,20,.55)');g.addColorStop(.5,'rgba(28,22,20,.25)');g.addColorStop(1,'rgba(28,22,20,0)');x.fillStyle=g;x.fillRect(0,0,128,128);});
  const shadowMat=new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
  function shadow(p,x,z,w,d,y=.054){const o=mesh(planeGeo,shadowMat,p,x,y,z,w,d,1);o.rotation.x=-Math.PI/2;return o;}
  function placard(p,title,sub,x,y,z,w,h,fg='#253b43',bg='#f3e8d7'){const t=texture(768,256,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.fillStyle=fg;c.fillRect(0,0,13,H);c.font='600 62px Georgia';c.fillText(title,45,105,W-80);c.font='500 33px Arial';c.fillText(sub,45,180,W-80);});return mesh(planeGeo,new T.MeshBasicMaterial({map:t,side:T.DoubleSide}),p,x,y,z,w,h,1);}
  function flatCard(p,title,sub,x,y,z,w=.68,h=.46){const o=placard(p,title,sub,x,y,z,w,h);o.rotation.x=-Math.PI/2;return o;}
  // ENVIRONMENT — interior volumes extend beyond the camera, not an exposed plinth.
  const room=group(root);
  // Blender-authored furniture templates: shared mesh geometry, per-material
  // variations only. All mounts retain the R8.3 physical contact coordinates.
  const furnitureMounts=[],furnitureReceipt=[];
  function mountFurniture(parent,name,x=0,y=0,z=0,sx=1,sy=1,sz=1,angle=0,color=null){
    const g=group(parent,x,y,z);g.scale.set(sx,sy,sz);g.rotation.y=angle;
    furnitureMounts.push({g,name,color});return g;
  }
  async function loadStudioFurniture(){
    const loader=new GLTFLoader();
    const asset=await loader.loadAsync(new URL('../assets/cinematic/s02-furniture/studio.glb',import.meta.url).href);
    if(disposed){disposeHuman(asset.scene);return;}
    const expected=['Desk','Chair','MeetingTable','TaskLamp','Plant'];
    const templates=new Map(expected.map(n=>[n,asset.scene.getObjectByName(n)]));
    if(expected.some(n=>!templates.get(n))){disposeHuman(asset.scene);throw Error('R9 furniture template absent');}
    const variants=new Map();
    for(const mount of furnitureMounts){
      const clone=templates.get(mount.name).clone(true);let meshCount=0;
      clone.traverse(o=>{
        if(!o.isMesh)return;
        meshCount++;o.castShadow=mount.name!=='TaskLamp';o.receiveShadow=true;
        const mapMaterial=m=>{
          if(/R9 Walnut/.test(m.name)){m.map=oak.map;m.color.set(0xd9c3a6);m.roughness=.48;m.needsUpdate=true;}
          if(/R9 Foliage/.test(m.name)){m.side=T.DoubleSide;m.needsUpdate=true;}
          if(/R9 Textile/.test(m.name)&&mount.color!==null){
            const key=m.uuid+mount.color;
            if(!variants.has(key)){const v=m.clone();v.color.setHex(mount.color);v.roughness=.94;variants.set(key,v);}
            return variants.get(key);
          }
          return m;
        };
        o.material=Array.isArray(o.material)?o.material.map(mapMaterial):mapMaterial(o.material);
      });
      if(!meshCount)throw Error('R9 empty furniture mount '+mount.name);
      mount.g.add(clone);furnitureReceipt.push({name:mount.name,meshes:meshCount});
    }
  }
  // One baked floor surface replaces hundreds of individually shaded plank boxes.
  const floorTexture=texture(2048,2048,(c,W,H)=>{
    let seed=417;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    c.fillStyle='#80664e';c.fillRect(0,0,W,H);
    const colors=['#b28a64','#c39a72','#c7a17b','#af8768','#b99270'];
    for(let row=0;row<46;row++){
      const y=row*H/46,hh=H/46;
      for(let col=-1;col<16;col++){
        const x=(col+(row%3)/3)*W/15,ww=W/15;
        c.fillStyle=colors[Math.floor(rnd()*colors.length)];c.fillRect(x+1,y+1,ww-2,hh-2);
        for(let k=0;k<12;k++){c.fillStyle='rgba(72,44,26,'+(.025+rnd()*.09)+')';c.fillRect(x+2+rnd()*ww*.45,y+2+rnd()*(hh-4),ww*(.18+rnd()*.35),.5+rnd()*1.2);}
        c.fillStyle='rgba(255,237,201,.19)';c.fillRect(x+2,y+1,ww-4,1);
      }
    }
  });
  const floorMat=mat(0xffffff);floorMat.map=floorTexture;
  b(room,floorMat,0,-.16,2,28,.32,23).receiveShadow=true;
  b(room,plaster,0,4.25,-5.35,23,8.5,.22);b(room,cream,0,.15,-5.18,23,.25,.08);b(room,timber,0,4.36,-5.10,23,.22,.42);
  for(const x of [-7.1,2.72,7.35]){b(room,timber,x,4.1,-5.04,.16,8.2,.30);b(room,cream,x,4.1,-4.85,.05,8.1,.05);}
  // Upper clerestory and continuous wall hide the stage edge in the master shot.
  for(const x of [-5.2,-1.92,1.36]){b(room,ink,x,5.22,-5.14,2.98,1.28,.10);b(room,cream,x,5.22,-5.075,2.82,1.12,.045);b(room,timber,x,5.22,-5.02,.055,1.12,.055);}
  b(room,timber,0,6.0,-5.03,23,.17,.34);
  b(room,plaster,7.78,4.25,-2.3,.22,8.5,6.1);b(room,teal,7.64,1.08,-2.3,.08,2.1,6.0);
  // The window uses a locally stored perspective crop of the verified CC0
  // Green Point Park HDRI, not cartoon hills or a network image.
  const windowMats=Array.from({length:3},()=>new T.MeshBasicMaterial({color:0xb9cdd0,toneMapped:false}));
  const studioMaterialReceipt=[];
  async function loadStudioMaterials(){
    const names=['walnut.jpg','plaster.jpg','garden-vista.jpg'],loader=new T.TextureLoader();
    const settled=await Promise.allSettled(names.map(n=>loader.loadAsync(new URL('../assets/cinematic/s02-materials/'+n,import.meta.url).href)));
    if(settled.some(x=>x.status!=='fulfilled')||disposed){
      for(const r of settled)if(r.status==='fulfilled')r.value.dispose();
      if(!disposed)throw Error('S02 local studio materials unavailable');
      return;
    }
    const maps=settled.map(x=>x.value);
    maps.forEach((t,i)=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;textures.push(t);studioMaterialReceipt.push({name:names[i],width:t.image.width,height:t.image.height});});
    const [wood,wall,photo]=maps;
    oak.map=wood;oak.color.set(0xf5e4cf);oak.needsUpdate=true;
    timber.map=wood;timber.color.set(0xc6ac93);timber.needsUpdate=true;
    wall.wrapS=wall.wrapT=T.RepeatWrapping;wall.repeat.set(5,2);wall.needsUpdate=true;
    plaster.map=wall;plaster.color.set(0xf1e8dc);plaster.needsUpdate=true;
    windowMats.forEach((m,i)=>{const t=photo.clone();t.repeat.set(1/3,1);t.offset.set(i/3,0);t.needsUpdate=true;textures.push(t);m.map=t;m.color.set(0xffffff);m.needsUpdate=true;});
  }
  for(let i=0;i<3;i++){const x=-5.2+i*3.28;b(room,ink,x,2.72,-5.15,2.98,2.48,.08);mesh(planeGeo,windowMats[i],room,x,2.72,-5.095,2.83,2.33,1);b(room,timber,x,1.47,-4.99,3.12,.16,.35);b(room,cream,x,2.72,-5.045,.09,2.36,.06).castShadow=true;b(room,cream,x,3.19,-5.045,2.85,.075,.06).castShadow=true;}
  b(room,teal,5.57,1.35,-5.08,3.38,2.65,.22);b(room,oak,5.57,.86,-4.71,3.43,.14,.72);
  for(let i=0;i<3;i++){b(room,ink,4.45+i*1.12,.45,-4.67,1.04,.7,.65);b(room,brass,4.45+i*1.12,.65,-4.31,.25,.045,.05);}
  for(let k=0;k<2;k++){b(room,oak,5.56,1.45+k*.78,-4.78,3.31,.09,.53);for(let i=0;i<12;i++){const h=.26+((i*7+k*3)%7)*.055;b(room,[clay,cream,navy,sage,timber][i%5],4.15+i*.235,1.51+k*.78+h/2,-4.72,.19,h,.32);}}
  placard(room,'KIRJANE','Adapt. Automate. Evolve.',5.54,3.45,-4.99,3.0,.73,'#e4d8bc','#345a59');
  // Authored glass dividers, framed workflow print and room-specific shelf objects.
  const workflowBoard=placard(room,'From fragments to systems','CAPTURE  /  CONNECT  /  DECIDE  /  ACT',5.54,4.16,-4.99,3.0,.50,'#435c57','#e3d3b5');
  b(room,timber,5.54,4.16,-5.04,3.09,.59,.07);
  b(room,brass,5.54,2.85,-4.71,3.36,.025,.025);
  for(const [x,z] of [[-7.03,-2.7],[7.03,-3.8]]){
    b(room,timber,x,1.45,z,.11,2.9,.12);
    b(room,cream,x,2.9,z,.12,.1,.12);
  }
  b(room,rug,.8,.027,1.0,7.7,.035,5.0).receiveShadow=true;for(const z of [-1.42,3.42])b(room,ink,.8,.052,z,7.62,.008,.035);for(let i=0;i<4;i++)b(room,cream,.8,.052,-1.35+i*.075,7.15,.007,.026);
  function plant(p,x,z,scale=1){const g=mountFurniture(p,'Plant',x,0,z,scale,scale,scale);shadow(p,x,z,1.3*scale,1.05*scale);return g;}
  plant(room,-7,-4.2,1.7);plant(room,7,-.6,1.5);plant(room,-6.9,3.8,1.1);
  const couch=group(room,5.65,0,3.8);shadow(couch,0,0,3.6,1.8);b(couch,timber,0,.23,0,3.25,.22,1.13);b(couch,sage,0,.56,0,3.15,.47,1.05);b(couch,sage,0,.96,-.42,3.15,.88,.26);
  for(let i=0;i<3;i++)ell(couch,i===1?clay:cream,-.95+i*.95,.93,-.25,.36,.33,.15).rotation.z=(i-1)*.17;
  const floorLamp=group(room,6.9,0,2.8);cyl(floorLamp,brass,0,.055,0,.28,.11);cyl(floorLamp,brass,0,1.1,0,.035,2.1);mesh(taperGeo,cream,floorLamp,0,2.12,0,.34,.47,.34);cyl(floorLamp,white,0,1.9,0,.28,.022);
  // Four different responsibilities: entry desk, research nook, conversation table, purchasing.
  // Warm pendant pools and asymmetric architectural ornament.
  for(const x of [-3.5,1.0,5.1]){
    beam(room,brass,[x,4.13,-1.4],[x,3.68,-1.4],.018);
    mesh(taperGeo,cream,room,x,3.47,-1.4,.39,.36,.39);
    cyl(room,white,x,3.28,-1.4,.32,.025);
  }
  const sunTexture=texture(128,128,c=>{const g=c.createRadialGradient(64,64,8,64,64,64);g.addColorStop(0,'rgba(255,225,166,.40)');g.addColorStop(.5,'rgba(255,225,166,.18)');g.addColorStop(1,'rgba(255,225,166,0)');c.fillStyle=g;c.fillRect(0,0,128,128);});
  const sunMat=new T.MeshBasicMaterial({map:sunTexture,transparent:true,depthWrite:false});
  for(const x of [-4.9,-1.6,1.6]){const patch=mesh(planeGeo,sunMat,room,x,.057,-1.8,2.9,4.5,1);patch.rotation.x=-Math.PI/2;patch.rotation.z=.28;}
  const stations=[],staffers=[],animated=new Set();
  const positions=[[-4.6,0,1.85],[-2.75,0,-2.65],[.7,0,0],[4.25,0,-1.7]];
  const baseAngles=[-.17,.08,-.08,.12];
  const destinations=[[-.65,1.125,.24],[-.55,1.125,.23],[-.87,1.125,.32],[-.58,1.125,.25]];
  function desk(g,w,d,m){shadow(g,0,0,w+1,d+1.2);return mountFurniture(g,'Desk',0,0,0,w/2.5,1,d/1.3);}
  function chair(g,x,z,color,angle=0){shadow(g,x,z,1.05,1.05);return mountFurniture(g,'Chair',x,0,z,1,1,1,angle,color.color.getHex());}
  const workDisplays=[];
  // Laptop's +Z is the USER side: keyboard in front, hinge away from user.
  // Orient against the actual operator in station coordinates, not the camera.
  // Preserve the two observable meshes for QA; the screen is one-sided.
  function laptop(g,x,z,operatorX,operatorZ,title,sub,doneTitle,doneSub,threshold){
    const l=group(g,x,1.13,z);
    l.scale.setScalar(.83);
    l.rotation.y=Math.atan2(operatorX-x,operatorZ-z);
    b(l,ink,0,.026,0,.77,.045,.51);
    const keyboard=b(l,black,0,.052,.025,.65,.012,.25);
    keyboard.userData.keepForQA=true;
    const keys=texture(512,256,(c,W,H)=>{
      c.fillStyle='#252a2c';c.fillRect(0,0,W,H);c.fillStyle='#626a6b';
      for(let row=0;row<5;row++)for(let col=0;col<15;col++){const x=14+col*32,y=12+row*42;c.fillRect(x,y,28,33);c.fillStyle='#929a98';c.fillRect(x+9,y+9,6,3);c.fillStyle='#626a6b';}
    });
    const keysSurface=mesh(planeGeo,new T.MeshBasicMaterial({map:keys}),l,0,.059,.025,.64,.245,1);
    keysSurface.rotation.x=-Math.PI/2;
    b(l,ink,0,.051,.195,.23,.008,.08);
    const lid=group(l,0,.04,-.23);lid.rotation.x=-.16;
    const lidMesh=b(lid,ink,0,.27,0,.77,.55,.042);lidMesh.userData.keepForQA=true;
    // Make the lid back read as a real aluminium shell without logos or UI text.
    b(lid,mat(0x677879),0,.27,-.025,.724,.505,.009);
    const pending=placard(lid,title,sub,0,.27,.026,.70,.46,'#d7e7dd','#2e5256');
    const done=placard(lid,doneTitle,doneSub,0,.27,.027,.70,.46,'#e8efdb','#355a55');
    pending.material.side=T.FrontSide;done.material.side=T.FrontSide;
    done.visible=false;
    const operatorAnchor=group(g,operatorX,1.43,operatorZ);
    workDisplays.push({pending,done,threshold,keyboard,lidMesh,operatorAnchor});
    return l;
  }
  function lamp(g,x,z){return mountFurniture(g,'TaskLamp',x,1.115,z);}
  function mug(g,x,z,color){const m=group(g,x,1.19,z);cyl(m,color,0,0,0,.095,.15);cyl(m,black,0,.078,0,.073,.012);mesh(new T.TorusGeometry(.055,.015,6,12),color,m,.102,0,0,1,1,1);}

  // CHARACTER WORKSHOP — ring meshes with deliberately shaped adult silhouettes.
  // Joint coordinates are local; all joint orientations are authored absolutely per phase.
  function profileGeometry(rings,segments=12){
    const vertices=[],indices=[];
    rings.forEach(([y,rx,rz,z=0])=>{for(let i=0;i<segments;i++){const a=2*Math.PI*i/segments;vertices.push(Math.sin(a)*rx,y,Math.cos(a)*rz+z);}});
    for(let j=0;j<rings.length-1;j++)for(let i=0;i<segments;i++){
      const a=j*segments+i,b=j*segments+(i+1)%segments,c=b+segments,d=a+segments;indices.push(a,b,d,b,c,d);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();geometries.add(g);return g;
  }
  // A single sculpted head surface: chin, jaw, cheeks, brows, eye sockets and
  // integrated nose are geometry, not detached balls. Shared topology; skin palettes differ.
  const faceGeo=profileGeometry([[-.175,.005,.008,.024],[-.155,.058,.064,.021],[-.129,.083,.081,.014],[-.102,.096,.088,.010],[-.075,.109,.095,.005],[-.052,.121,.102,.003],[-.026,.127,.105,.002],[0,.127,.104,.001],[.018,.126,.103,0],[.039,.124,.104,-.001],[.056,.122,.104,-.002],[.080,.121,.105,-.005],[.108,.116,.101,-.008],[.148,.085,.080,-.016],[.174,.005,.008,-.015]],36);
  function gauss(x,y,cx,cy,sx,sy){return Math.exp(-(((x-cx)/sx)**2+((y-cy)/sy)**2));}
  {
    const a=faceGeo.attributes.position,colors=[];
    for(let i=0;i<a.count;i++){
      const x=a.getX(i),y=a.getY(i),z=a.getZ(i),front=clamp((z-.025)/.065);
      const eye=gauss(Math.abs(x),y,.052,.024,.027,.025),brow=gauss(Math.abs(x),y,.052,.052,.037,.019);
      const cheek=gauss(Math.abs(x),y,.087,-.044,.035,.038);
      const bridge=gauss(x,y,0,.017,.020,.057),tip=gauss(x,y,0,-.031,.026,.023);
      const mouth=gauss(x,y,0,-.079,.039,.015);
      a.setZ(i,z+front*(.019*bridge+.032*tip+.010*brow+.008*cheek-.012*eye+.005*mouth));
      colors.push(1-.07*front*eye,1-.08*front*eye-.025*cheek,1-.085*front*eye-.055*cheek);
    }
    faceGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    faceGeo.computeVertexNormals();
  }
  const shirtGeo=profileGeometry([[-.30,.173,.109],[-.21,.183,.119],[-.12,.176,.115],[.015,.188,.123],[.13,.224,.139],[.22,.23,.12],[.28,.141,.088],[.30,.058,.056]],16);
  // Continuous asymmetric scalp meshes, with cut hairlines and swept strand tones.
  function scalpGeometry(style){
    const pos=[],cols=[],idx=[],segments=40,rings=10;
    for(let j=0;j<=rings;j++)for(let i=0;i<segments;i++){
      const a=2*Math.PI*i/segments,front=Math.cos(a),side=Math.sin(a),t=j/rings;
      const line=style===0?.035+.070*front+.016*side+.016*Math.max(0,front)*Math.sin(a*3+.7):style===1?.005+.090*front+.009*Math.sin(a*2): .027+.064*front+.008*Math.sin(a*3);
      const y=mix(.195,line,t);
      const radius=j===0?0:Math.sqrt(Math.max(.002,1-((y-.009)/.193)**2));
      const groove=1+.023*Math.sin(a*13+t*6)+.020*Math.sin(a*5-t*5);
      pos.push(Math.sin(a)*.145*radius*groove,y,Math.cos(a)*.127*radius*groove-.012);
      const strand=.80+.15*Math.sin(a*19+t*3)**2+.045*Math.sin(a*8-t*4);
      cols.push(strand,strand*.96,strand*.92);
    }
    for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){
      const a=j*segments+i,b=j*segments+(i+1)%segments,c=b+segments,d=a+segments;
      idx.push(a,d,b,b,d,c);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setIndex(idx);g.computeVertexNormals();geometries.add(g);return g;
  }
  const hairGeos=[0,1,2].map(scalpGeometry);
  const collarGeo=new T.BufferGeometry();
  collarGeo.setAttribute('position',new T.Float32BufferAttribute([-.097,.235,.120,-.023,.135,.146,0,.230,.131,0,.230,.131,.023,.135,.146,.097,.235,.120],3));collarGeo.computeVertexNormals();geometries.add(collarGeo);
  const upperGeo=profileGeometry([[-.29,.057,.061],[-.23,.074,.078],[-.09,.092,.087],[.015,.085,.081],[.043,.025,.025]],10);
  const foreGeo=profileGeometry([[-.29,.038,.036],[-.23,.044,.041],[-.09,.061,.058],[.01,.056,.055],[.025,.025,.025]],10);
  const handGeo=profileGeometry([[-.102,.023,.017],[-.079,.048,.025],[-.012,.052,.027],[.018,.037,.029],[.025,.005,.006]],10);
  function human(g,x,z,face,seated,palette){
    const o=group(g,x,0,z);o.rotation.y=face;animated.add(o);
    const skin=mat(palette.skin,.67),hair=mat(palette.hair,.83),shirt=palette.shirt,trouser=palette.pants,pelvis=seated?.81:1.00;
    const complexion=skin.clone();complexion.vertexColors=true;const scalp=hair.clone();scalp.vertexColors=true;
    const torso=group(o,0,pelvis+.28,0);animated.add(torso);
    mesh(shirtGeo,shirt,torso,0,0,0,1,1,1).castShadow=true;
    const trim=mat(palette.style===0?0x315956:palette.style===2?0x3c526a:0xb4a38d,.8);
    mesh(collarGeo,trim,torso,0,0,0,1,1,1);
    for(const s of [-1,1]){
      const hip=[s*.105,pelvis,0],knee=[s*.118,seated?.58:.56,seated?.37:.02],ankle=[s*.13,.115,seated?.42:.035];
      beam(o,trouser,hip,knee,.105);ell(o,trouser,...knee,.098,.105,.096);beam(o,trouser,knee,ankle,.073);
      ell(o,black,s*.13,.07,seated?.48:.12,.095,.065,.17);
    }
    for(let i=0;i<3;i++)ell(torso,trim,0,.12-i*.115,.133,.009,.009,.005);
    // Shirt placket and one pocket: scale cues without decorative clutter.
    b(torso,trim,0,-.03,.125,.014,.30,.009);
    b(torso,shirt,-.114,.079,.132,.095,.098,.015);
    cyl(torso,skin,0,.33,0,.058,.13);
    const head=group(torso,0,.487,0);animated.add(head);
    mesh(faceGeo,complexion,head,0,0,0,1,1,1).castShadow=true;
    mesh(hairGeos[palette.style],scalp,head,0,0,0,1,1,1);
    const lip=mat(0x79504b,.75),eye=mat(0x282727,.5),ivory=mat(0xe0d3bf,.65);
    // One eye rig per actor keeps the white and iris silhouettes together.
    // Scaling about the eye line closes them without squashing the face.
    const eyes=group(head,0,.025,0);animated.add(eyes);
    const pupils=group(eyes,0,0,0);animated.add(pupils);
    for(const s of [-1,1]){
      ell(head,skin,s*.126,-.027,-.008,.025,.045,.025);
      ell(eyes,ivory,s*.050,0,.096,.022,.007,.009);
      ell(pupils,eye,s*.050,0,.103,.0075,.0075,.006);
      const brow=ell(head,hair,s*.050,.052,.110,.030,.004,.006);brow.rotation.z=s*.10;
      const lid=ell(head,hair,s*.050,.033,.101,.022,.0024,.005);lid.rotation.z=s*.04;
    }
    // The nose is integrated into faceGeo; small lips and eyelids supply scale cues.
    const mouth=ell(head,lip,0,-.079,.103,.029,.004,.004);animated.add(mouth);
    if(palette.style===1){ell(head,hair,0,-.046,-.102,.105,.13,.065);ell(head,hair,0,-.143,-.112,.055,.072,.057);}
    const arms=[];
    for(const s of [-1,1]){
      const a=group(torso,s*.225,.205,0);animated.add(a);
      mesh(upperGeo,shirt,a,0,0,0,1,1,1);
      const elbow=group(a,0,-.29,0);animated.add(elbow);
      mesh(foreGeo,skin,elbow,0,0,0,1,1,1);
      const wrist=group(elbow,0,-.29,0);animated.add(wrist);
      mesh(handGeo,skin,wrist,0,0,0,1,1,1);
      const thumb=ell(wrist,skin,-s*.048,-.034,.008,.019,.044,.018);thumb.rotation.z=s*.34;
      for(let finger=0;finger<4;finger++){const f=ell(wrist,skin,(finger-1.5)*.021,-.086+(finger===0||finger===3?.008:0),.012,.011,.032,.012);f.rotation.x=-.27;}
      const grip=group(wrist,0,-.043,0);
      arms.push({a,elbow,wrist,grip,s});
    }
    return {o,torso,head,arms,eyes,pupils,mouth};
  }
  const palettes=[{skin:0xb97f56,hair:0x352823,shirt:clay,pants:navy,style:1},{skin:0x875b41,hair:0x242223,shirt:navy,pants:ink,style:2},{skin:0xd1a17b,hair:0x583d2b,shirt:teal,pants:ink,style:0},{skin:0xb57e59,hair:0x2b2524,shirt:cream,pants:navy,style:1}];
  let operator,stamp,reviewPending,reviewApproved,receivePending,receiveDone;
  for(let i=0;i<4;i++){
    const g=group(root,...positions[i]);stations.push(g);animated.add(g);
    if(i===0){desk(g,2.55,1.25,oak);chair(g,-.2,-.91,clay,0);laptop(g,-.1,-.35,-.2,-.91,'New work','Context incomplete','Context captured','Ready for verification',.37);lamp(g,-1.03,-.36);mug(g,.93,.3,teal);staffers.push({i,staff:human(g,-.2,-.91,0,true,palettes[i])});}
    else if(i===1){desk(g,2.50,1.4,timber);chair(g,.1,-.91,navy,0);for(let j=0;j<5;j++)b(g,[teal,clay,cream,navy,sage][j],-1.08+j*.16,1.37,-.41,.14,.45,.34);laptop(g,.22,-.35,.1,-.91,'Connected records','Verifying information','Context verified','Ready for decision',.39);mug(g,.95,.35,cream);staffers.push({i,staff:human(g,.1,-.91,0,true,palettes[i])});}
    else if(i===2){shadow(g,0,0,4.2,3.0,.052);mountFurniture(g,'MeetingTable');chair(g,.12,-1.20,teal,0);chair(g,-1.30,.18,clay,Math.PI/2);chair(g,1.30,.18,navy,-Math.PI/2);
      operator=human(g,.12,-1.20,0,true,palettes[i]);lamp(g,-1,-.35);flatCard(g,'Review checklist','Context • rules • owner',-.50,1.13,.25,.52,.34);
      stamp=group(g,.30,1.40,-.78);stamp.scale.setScalar(.75);animated.add(stamp);cyl(stamp,brass,0,0,0,.06,.13);ell(stamp,timber,0,.065,0,.065,.044,.065);b(stamp,ink,0,-.085,0,.17,.06,.13);
      reviewPending=placard(g,'Decision','Review required',-.64,1.121,.52,.40,.18,'#5b3526','#f6e8d4');reviewApproved=placard(g,'Decision','Authorization recorded',-.64,1.122,.52,.40,.18,'#244943','#e1e9dc');reviewPending.rotation.x=reviewApproved.rotation.x=-Math.PI/2;}
    else{desk(g,2.7,1.30,oak);b(g,teal,.96,.48,-.08,.55,.82,.75);for(let j=0;j<2;j++){b(g,oak,.96,.36+j*.36,.31,.43,.27,.055);b(g,brass,.96,.39+j*.36,.35,.17,.035,.05);}laptop(g,.12,-.36,.18,-.87,'Next responsibility','Awaiting decision','Work assigned','Context and owner linked',.94);lamp(g,.98,-.39);mug(g,.58,.36,clay);staffers.push({i,staff:human(g,.18,-.87,0,false,palettes[i])});
      receivePending=placard(g,'Next step','Awaiting decision',-.66,1.121,.40,.43,.20);receiveDone=placard(g,'Next step','Owner and context linked',-.66,1.122,.40,.43,.20,'#244943','#e1e9dc');receivePending.rotation.x=receiveDone.rotation.x=-Math.PI/2;}
  }
  // CUSTODY — one physical folder, 56 independently conserved sheets.
  const request=group(root);animated.add(request);b(request,clay,0,0,0,.96,.018,.69).castShadow=true;b(request,paper,.035,.017,0,.83,.018,.60);b(request,teal,-.39,.019,0,.15,.018,.63);// Canvas illustration: actual stationery, not a floating UI screenshot.
  const requestArt=texture(768,488,(c,W,H)=>{
    c.fillStyle='#f3e8d2';c.fillRect(0,0,W,H);
    c.fillStyle='#325d58';c.fillRect(0,0,W,28);
    c.fillStyle='#273f3c';c.font='700 70px Georgia';c.fillText('WORK REQUEST',48,111,W-96);
    c.font='600 29px Arial';c.fillText('SHARED WORKFLOW RECORD',48,156);
    c.strokeStyle='#a79c87';c.lineWidth=2;c.beginPath();c.moveTo(48,177);c.lineTo(W-48,177);c.stroke();
    c.font='500 20px Arial';c.fillStyle='#57645b';
    ['REQUEST DETAILS','SOURCE RECORD','REVIEW / AUTHORIZATION'].forEach((label,i)=>{
      const y=220+i*72;c.fillText(label,48,y);c.strokeStyle='#b9b09e';c.strokeRect(48,y+10,346,32);
      c.fillStyle='#57645b';
    });
    c.strokeStyle='#b9b09e';c.strokeRect(430,210,290,222);
    c.font='500 18px Arial';c.fillText('DECISION RECORD',448,414);
    // Restrained spot-color registration and deterministic printed paper grain.
    for(let i=0;i<2400;i++){const x=(i*197.37)%W,y=(i*117.61)%H;c.fillStyle=i%2?'rgba(95,71,48,.035)':'rgba(255,255,255,.09)';c.fillRect(x,y,1.4,1.4);}
  });
  const documentSurface=mesh(planeGeo,new T.MeshBasicMaterial({map:requestArt,side:T.DoubleSide}),request,.06,.027,0,.68,.43,1);
  documentSurface.rotation.x=-Math.PI/2;
  // Permanent visual custody mark travels with the original document, not a second folder.
  const sealTexture=texture(512,220,(c,W,H)=>{
    c.strokeStyle='#98452f';c.fillStyle='#98452f';c.lineWidth=10;c.strokeRect(15,15,W-30,H-30);c.lineWidth=2;c.strokeRect(27,27,W-54,H-54);
    c.font='700 69px Arial';c.textAlign='center';c.fillText('APPROVED',W/2,116,W-60);
    c.font='600 31px Arial';c.fillText('DECISION RECORDED',W/2,168,W-64);
  });
  const approvalMark=mesh(planeGeo,new T.MeshBasicMaterial({map:sealTexture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),request,.23,.029,-.105,.28,.13,1);
  approvalMark.rotation.set(-Math.PI/2,0,-.12);approvalMark.visible=false;
  const tag=placard(request,'Work request','Shared context',0,.58,0,1.1,.38,'#253b43','#f7e8cf');
  const fileFlag=new T.Sprite(new T.SpriteMaterial({map:tag.material.map,depthTest:false,depthWrite:false,toneMapped:false}));fileFlag.position.set(0,.53,0);fileFlag.scale.set(.88,.293,1);fileFlag.renderOrder=9;request.add(fileFlag);tag.removeFromParent();tag.material.dispose();
  const path=positions.map(([x,,z],i)=>new T.Vector3(x+(i===2?.14:0),1.13,z+(i===2?-.63:.12)));
  const arcs=[];for(let i=0;i<3;i++){const a=path[i],c=path[i+1],pts=[];for(let j=0;j<=64;j++){const t=j/64;pts.push(new T.Vector3(mix(a.x,c.x,t),1.13+Math.sin(t*Math.PI)*1.5,mix(a.z,c.z,t)));}const geo=new T.BufferGeometry().setFromPoints(pts),material=new T.LineBasicMaterial({color:0xf3d19a,transparent:true,opacity:0,depthWrite:false});const arc=new T.Line(geo,material);root.add(arc);arcs.push(arc);}
  const paperMap=texture(256,320,(x,W,H)=>{x.fillStyle='#f7eddb';x.fillRect(0,0,W,H);x.fillStyle='#3b6663';x.fillRect(20,23,130,12);x.fillStyle='#a7a09a';for(let j=0;j<10;j++)x.fillRect(20,55+j*17,195-(j%3)*24,3);x.strokeStyle='#b57450';x.strokeRect(169,242,60,36);});
  const sheetMaterial=mat(0xffffff,.92);sheetMaterial.map=paperMap;sheetMaterial.side=T.DoubleSide;
  // One subdivided double-sided sheet per instance; GPU curl is driven only by
  // native phase. The depth pass uses the same deformation, so shadows follow.
  const sheetGeo=new T.PlaneGeometry(1,1,5,7);sheetGeo.rotateX(-Math.PI/2);
  const curlAttr=new T.InstancedBufferAttribute(new Float32Array(56),1).setUsage(T.DynamicDrawUsage);
  sheetGeo.setAttribute('r9Curl',curlAttr);geometries.add(sheetGeo);
  const depthPaper=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,side:T.DoubleSide});
  function bendPaper(m){
    m.onBeforeCompile=shader=>{
      shader.vertexShader='attribute float r9Curl;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.y += r9Curl * (0.52 * position.x * position.x + 0.42 * sin(position.z * 3.14159265));');
      shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal.x -= r9Curl * 1.04 * position.x * objectNormal.y; objectNormal.z -= r9Curl * 1.31947 * cos(position.z * 3.14159265) * objectNormal.y;');
    };
    m.customProgramCacheKey=()=> 'r9-sheet-curl';
  }
  bendPaper(sheetMaterial);bendPaper(depthPaper);materials.add(sheetMaterial);materials.add(depthPaper);
  const sheets=new T.InstancedMesh(sheetGeo,sheetMaterial,56);sheets.customDepthMaterial=depthPaper;sheets.instanceMatrix.setUsage(T.DynamicDrawUsage);sheets.frustumCulled=false;sheets.castShadow=true;sheets.receiveShadow=false;root.add(sheets);
  const debris=Array.from({length:56},(_,id)=>({id,theta:id*2.39996323,r:1.5+(id%11)*.43,desk:id%4,layer:Math.floor(id/4),pose:new T.Object3D()}));
  const target=new T.Vector3(),matrix=new T.Matrix4();const pulse=(p,a,b,c)=>span(p,a,b)-span(p,b,c);
  // STATIC GEOMETRY CONSOLIDATION
  // Keep visibility-driven signs and individual animated joints separate.
  // Merge different primitive shapes with the same material/flags into one local geometry;
  // retain instancing for repeated identical shapes. No dynamic transform is baked.
  animated.add(root);
  root.updateMatrixWorld(true);
  const buckets=new Map(),primitives=new Set([boxGeo,sphereGeo,cylGeo,taperGeo]);
  root.traverse(o=>{
    if(!o.isMesh||o.isInstancedMesh||!primitives.has(o.geometry)||o.material.transparent||o.userData.keepForQA)return;
    let parent=o.parent;while(parent&&!animated.has(parent))parent=parent.parent;
    if(!parent)return;
    if(!buckets.has(parent))buckets.set(parent,new Map());
    const by=buckets.get(parent),key=o.material.uuid+Number(o.castShadow)+Number(o.receiveShadow);
    if(!by.has(key))by.set(key,[]);by.get(key).push(o);
  });
  function combine(items,inv){
    const pos=[],normal=[],uv=[],indices=[],local=new T.Matrix4(),nmat=new T.Matrix3(),point=new T.Vector3(),n=new T.Vector3();
    for(const o of items){
      local.multiplyMatrices(inv,o.matrixWorld);nmat.getNormalMatrix(local);
      const g=o.geometry,base=pos.length/3,p=g.attributes.position,norm=g.attributes.normal,tex=g.attributes.uv;
      for(let i=0;i<p.count;i++){
        point.fromBufferAttribute(p,i).applyMatrix4(local);n.fromBufferAttribute(norm,i).applyNormalMatrix(nmat);
        pos.push(point.x,point.y,point.z);normal.push(n.x,n.y,n.z);uv.push(tex.getX(i),tex.getY(i));
      }
      if(g.index)for(let i=0;i<g.index.count;i++)indices.push(base+g.index.getX(i));
      else for(let i=0;i<p.count;i++)indices.push(base+i);
    }
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(normal,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeBoundingSphere();geometries.add(g);return g;
  }
  for(const [parent,by] of buckets)for(const items of by.values()){
    if(items.length<2)continue;
    const first=items[0],inv=parent.matrixWorld.clone().invert();let m;
    if(items.every(o=>o.geometry===first.geometry)){
      m=new T.InstancedMesh(first.geometry,first.material,items.length);
      items.forEach((o,i)=>m.setMatrixAt(i,new T.Matrix4().multiplyMatrices(inv,o.matrixWorld)));
      m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();
    }else m=new T.Mesh(combine(items,inv),first.material);
    m.castShadow=first.castShadow;m.receiveShadow=first.receiveShadow;
    items.forEach(o=>o.removeFromParent());parent.add(m);
  }
  // RENDERER / LIFECYCLE — one director phase; expensive diagnostics only in opt-in QA.
  let phase=0,disposed=false,failed=false,visible=false,last=-1,w=1,h=1,lastCaption='',drawCount=0;
  const jointTarget=new T.Vector3(),jointGoal=new T.Vector3(),jointDir=new T.Vector3(),jointBend=new T.Vector3(),jointElbow=new T.Vector3(),jointLower=new T.Vector3(),jointUpper=new T.Vector3(),jointDown=new T.Vector3(0,-1,0),jointQ1=new T.Quaternion(),jointQ2=new T.Quaternion(),jointInv=new T.Quaternion();
  const actors=[operator,...staffers.map(s=>s.staff)];
  const roleActors=[staffers[0].staff,staffers[1].staff,operator,staffers[2].staff];
  const roleNames=['capture','connect','decide','act'];
  let authored=[],castState='idle';
  const laptopScreen=new T.Vector3(),laptopUser=new T.Vector3(),laptopNormal=new T.Vector3(),laptopKeys=new T.Vector3(),laptopQ=new T.Quaternion();
  const keyboardTarget=new T.Vector3(),keyboardHand=new T.Vector3();
  const sampleContact=new T.Vector3(),projected=new T.Vector3(),stampLocal=new T.Vector3(),supportTarget=new T.Vector3(),supportGrip=new T.Vector3();
  const status=document.createElement('div');
  status.className='handoff-scene-caption';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  Object.assign(status.style,{position:'absolute',zIndex:'3',right:'3%',top:'11%',font:'500 12px system-ui',letterSpacing:'.035em',color:'#fff3df',background:'rgba(22,37,40,.74)',padding:'7px 10px',borderLeft:'1px solid #e5b97e',textShadow:'none',textAlign:'right',pointerEvents:'none',whiteSpace:'pre-line'});
  legacy.after(canvas);
  stage.append(status);
  const shots=[[0,-.8,1.75,-.5,.05,15.4,6.9,12.4,5.8],[.15,-2.65,1.85,.0,.02,11.3,5.3,9.2,4.9],[.37,-2.25,1.70,-1.05,-.13,8.8,4.3,8.2,4.5],[.55,.83,1.65,-.71,.29,3.35,2.35,4.75,2.78],[.69,.83,1.65,-.71,.29,3.35,2.35,4.75,2.78],[.83,2.9,1.85,-1.05,.04,7.2,3.9,8.3,4.5],[.95,4.0,1.80,-1.45,.26,5.7,3.3,7.6,4.2],[1,.1,1.75,-.6,.06,14.5,6.2,13,6]];
  function draw(){
    if(disposed||failed||castState!=='ready'||!visible||document.hidden)return;

    const p=phase,trace=span(p,.09,.48),decision=span(p,.58,.69),release=span(p,.76,.94);
    stations.forEach((g,i)=>{const [x,y,z]=positions[i],q=span(p,.10+i*.024,.43+i*.018),s=1-q;g.position.set(x+s*Math.sin(i*4+1)*.78,y,z+s*Math.cos(i*4)*.64);g.rotation.y=baseAngles[i]+s*Math.sin(i*2.6+.7)*.40;});
    stations.forEach(g=>g.updateWorldMatrix(true,false));
    for(const d of debris){const i=d.id,q=span(p,.035+(i%9)*.018,.35+(i%9)*.019),u=1-q,theta=d.theta+p*15*(.52+(i%4)*.17)+q*3.7;const dest=destinations[d.desk];target.set(dest[0]+(d.layer%2)*.49,dest[1]+Math.floor(d.layer/2)*.003,dest[2]);stations[d.desk].localToWorld(target);const o=d.pose;
      o.position.set(mix(target.x,Math.sin(theta)*d.r-.35,u),mix(target.y,1.3+(i%8)*.42+Math.sin(theta*1.6)*.6,u)+Math.sin(q*Math.PI)*.7,mix(target.z,Math.cos(theta)*d.r*.78+.6,u));o.rotation.set(u*Math.sin(theta*1.4)*1.75,mix(stations[d.desk].rotation.y+(i%2)*.05,theta*1.6,u),u*Math.cos(theta*1.3)*1.3+paperFollowThrough(p,i));o.scale.set(.30+(i%3)*.024,.003,.42);d.air=u;curlAttr.setX(i,u*(8+7*Math.sin(theta*1.3+i*.37)));}
    let segment=0,t=span(p,.19,.37);if(p>=.37&&p<.55){segment=1;t=span(p,.39,.55);}else if(p>=.55){segment=2;t=release;}
    request.position.copy(path[segment]).lerp(path[segment+1],t);
    if(segment===0){target.set(0,1.13,.12);stations[0].localToWorld(target);target.y+=.55+(1-trace)*.9;target.x+=.35*Math.sin(p*13)*(1-trace);request.position.copy(target).lerp(path[1],t);}
    const arc=deliveryArc(t,segment),spin=Math.sin(t*Math.PI);request.position.y+=arc.lift;request.position.z+=arc.side;fileFlag.visible=p<.18&&spin>.15;fileFlag.position.set(0,.29+spin*.15,.23*(1-spin));approvalMark.visible=p>=.69;request.rotation.set(-.25*spin+(1-trace)*.19*Math.sin(p*19),.83*spin+(1-trace)*(.25+p*6),arc.bank+(1-trace)*.17*Math.cos(p*16));request.scale.setScalar(.76+.12*spin+.09*(1-trace));
    const press=span(p,.585,.635)-span(p,.66,.72);

    // ACTING / IK — all axes reset; no orientation from a preceding evaluation.
    function pose(staff,action,look,role){
      // Role-specific body language: intake receives, records checks, reviewer
      // stabilizes and stamps, purchasing reaches. Every axis is reset per phase.
      const score=actingScore(p,role);
      // For the reviewer keep the contact plateau unchanged; anticipation and
      // follow-through outside it are deliberately separate from both IK targets.
      const contactLock=role===2?span(p,.55,.60)-span(p,.70,.75):0;
      const free=1-contactLock;
      const lean=(role===3?.04+.11*action:.055+.10*action)+free*(.035*score.anticipate-.024*score.recover);
      staff.torso.rotation.set(lean,look*.19+free*.035*score.focus,(role===3?1:-1)*.035*action);
      staff.head.rotation.set(.055+action*(role===1?.12:.19)+.055*score.focus-.035*score.recover,look+.065*score.anticipate-.045*score.recover,(role===3?1:-1)*(.035+.021*score.focus));
      staff.eyes.scale.y=1-.88*score.blink;
      staff.pupils.position.x=.004*Math.sin(look*3)*score.focus;
      staff.mouth.scale.y=.004*(1+.35*score.recover);

      staff.arms.forEach(({a,elbow,wrist,s})=>{
        const reach=role===0?(s<0?.78:.35):role===1?(s<0?.28:.86):role===3?(s<0?.75:.56):(s<0?.50:.74);
        const side=role===1&&s>0?.20*action:0;
        a.rotation.set(-.43-action*reach+free*.10*score.anticipate,s*.04+side,s*(.12-action*.06)+free*s*.05*score.recover);
        elbow.rotation.set(-.86-action*(role===1&&s>0?.10:.36),0,s*.025);
        wrist.rotation.set(.10-action*.12+free*.13*score.recover,0,s*.04);
      });
    }
    pose(operator,press,.10-.18*press,2);
    staffers.forEach(({staff,i})=>{
      const a=i===0?pulse(p,.01,.12,.24):i===1?pulse(p,.28,.40,.53):pulse(p,.79,.94,1.01);
      const look=i===0?.23-.31*a:i===1?-.18+.34*a:-.18-.10*a;
      pose(staff,a,look,i);
    });
    // The stamp is lifted, pressed against the request, then released.
    const stampContact=span(p,.59,.625)-span(p,.66,.70);
    stamp.position.set(.30,1.342-.105*stampContact+.023*accent(p,.545,.574,.59),-.78);
    operator.torso.updateWorldMatrix(true,false);stamp.updateWorldMatrix(true,false);
    const arm=operator.arms[1],engage=span(p,.53,.58)-span(p,.69,.75);
    stamp.localToWorld(jointTarget.set(0,.065,0));
    // Both contact targets use the same deterministic local-space two-bone solver.
    // The left hand supports the document while the right hand makes the decision.
    const L=.29,M=.333;
    function solveGrip(staff,limb,worldTarget,weight,bendSide){
      staff.torso.worldToLocal(jointGoal.copy(worldTarget)).sub(limb.a.position);
      const raw=jointGoal.length(),d=reachDistance(raw,L,M);
      jointDir.copy(jointGoal);if(raw<1e-9)jointDir.set(0,-1,0);else jointDir.multiplyScalar(1/raw);
      jointBend.set(bendSide,0,0).addScaledVector(jointDir,-bendSide*jointDir.x).normalize();
      if(jointBend.lengthSq()<.001)jointBend.set(0,0,1).addScaledVector(jointDir,-jointDir.z).normalize();
      const along=(L*L-M*M+d*d)/(2*d);
      jointElbow.copy(jointDir).multiplyScalar(along).addScaledVector(jointBend,Math.sqrt(Math.max(0,L*L-along*along)));
      jointUpper.copy(jointElbow).normalize();jointLower.copy(jointDir).multiplyScalar(d).sub(jointElbow).normalize();
      jointQ1.setFromUnitVectors(jointDown,jointUpper);
      jointQ2.setFromUnitVectors(jointDown,jointLower.applyQuaternion(jointInv.copy(jointQ1).invert()));
      limb.a.quaternion.slerp(jointQ1,weight);limb.elbow.quaternion.slerp(jointQ2,weight);
      limb.wrist.quaternion.slerp(jointInv.identity(),weight);
      return raw;
    }
    const rawDistance=solveGrip(operator,arm,jointTarget,engage,1);
    const supporting=span(p,.55,.60)-span(p,.70,.75);
    request.localToWorld(supportTarget.set(-.30,.044,-.12));
    const supportDistance=solveGrip(operator,operator.arms[0],supportTarget,supporting,-1);
    // True keyboard interaction: solve to each key-deck contact point on the
    // actual laptop mesh, using the same phase-only shoulder/elbow solver.
    const keyboardWeights=[
      span(p,.012,.035)-span(p,.15,.23),
      span(p,.29,.39)-span(p,.46,.54),
      span(p,.86,.94)-span(p,.978,1)
    ];
    const keyboardDistances=[],keyContacts=[];
    workDisplays.forEach((d,i)=>{
      const staff=staffers[i].staff;
      staff.torso.updateWorldMatrix(true,false);
      const reach=[],contacts=[];
      for(const limb of staff.arms){
        d.keyboard.localToWorld(keyboardTarget.set(-limb.s*.23,.58,.04));
        const distance=solveGrip(staff,limb,keyboardTarget,keyboardWeights[i],limb.s);
        reach.push(distance);
        // Palm sits slightly above the real keyboard surface; this is a
        // different physical anchor from the old proxy grip point.
        const palm=keyboardTarget.clone();palm.y+=.022;
        contacts.push({side:limb.s,target:palm,weight:keyboardWeights[i]});
      }
      keyboardDistances.push(reach);keyContacts.push(contacts);
      d.pending.visible=p<d.threshold;d.done.visible=p>=d.threshold;
    });
    const actualContacts=[keyContacts[0],keyContacts[1],[{side:-1,target:supportTarget.clone(),weight:supporting},{side:1,target:jointTarget.clone(),weight:engage}],keyContacts[2]];
    const authoredState=authored.map((a,i)=>poseHuman(a,actualContacts[i],p));
    reviewPending.visible=p<.69;reviewApproved.visible=p>=.69;receivePending.visible=p<.94;receiveDone.visible=p>=.94;
    ambient.intensity=mix(.98,1.18,trace);key.intensity=mix(2.00,2.35,trace);rim.intensity=mix(1.0,1.3,decision)+.12*press;
    arcs.forEach((arc,i)=>{const from=[.18,.39,.75][i],to=[.37,.55,.94][i],q=span(p,from,to);arc.geometry.setDrawRange(0,Math.floor(q*64)+1);arc.material.opacity=.78*pulse(p,from,(from+to)/2,to+.065);});
    // CINEMATOGRAPHY — wide master, active record, intimate review, release, calm pullback.
    const portrait=w/h<1.05,compact=w<=900&&!portrait,wide=w/h>1.75&&!compact;
    let k=0;while(k<shots.length-2&&p>shots[k+1][0])k++;const l=shots[k],r=shots[k+1],v=span(p,l[0],r[0]),shot=n=>mix(l[n],r[n],v);
    // Portrait opening follows the intake folder; receipt holds the destination before the pullback.
    const intakeHold=1-span(p,.15,.37),receiptHold=span(p,.91,.97);
    const drift=accent(p,.18,.26,.37)*.09-accent(p,.76,.85,.94)*.08;
    const cx=shot(1)+drift+(portrait?(-3.65*intakeHold+1.65*receiptHold-.40*pulse(p,.30,.44,.53)):0),cy=shot(2),cz=shot(3)+(portrait?1.15*intakeHold:0),angle=shot(4),radius=shot(portrait?7:5);
    camera.fov=portrait?49:compact?49:wide?42:40;camera.position.set(cx+Math.sin(angle)*radius,shot(portrait?8:6),cz+Math.cos(angle)*radius);camera.lookAt(cx,cy,cz);camera.setViewOffset(w,h,portrait?0:-w*(compact?.15:wide?.10:.14),portrait?h*.145:0,w,h);camera.updateProjectionMatrix();camera.updateMatrixWorld();
    // Protect actual authored faces in the final camera's projected space.
    // Only airborne paper can be steered. Settled stationery and the review
    // document never move to satisfy the camera; their physical contacts win.
    const screenInfo=v=>{const d=-v.clone().applyMatrix4(camera.matrixWorldInverse).z;const n=v.clone().project(camera);return {x:n.x,y:n.y,depth:d};};
    const faces=authored.map(a=>{const v=a.nose.getWorldPosition(new T.Vector3());v.y+=.065;return screenInfo(v);}).filter(f=>f.depth>0&&Math.abs(f.x)<1.2&&Math.abs(f.y)<1.2);
    const right=new T.Vector3().setFromMatrixColumn(camera.matrixWorld,0),up=new T.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
    const fx=camera.projectionMatrix.elements[0],fy=camera.projectionMatrix.elements[5];
    function conflict(pos,radius,f){
      const v=screenInfo(pos);if(v.depth<.2||v.depth-radius>f.depth-.10)return null;
      const rx=fx*(.16/f.depth+radius/v.depth),ry=fy*(.22/f.depth+radius/v.depth);
      const dx=(v.x-f.x)/rx,dy=(v.y-f.y)/ry;
      return {v,rx,ry,dx,dy,gap:Math.hypot(dx,dy)};
    }
    let deflections=0;
    function steer(pos,radius,id){
      for(let pass=0;pass<5;pass++){
        let changed=false;
        for(const f of faces){
          const c=conflict(pos,radius,f);if(!c||c.gap>=1.012)continue;
          let dx=c.dx,dy=c.dy,gap=c.gap;
          if(gap<.00001){dx=id%2?1:-1;dy=.35;gap=Math.hypot(dx,dy);dx/=gap;dy/=gap;gap=0;}
          else{dx/=gap;dy/=gap;}
          const mag=1.025-gap;
          pos.addScaledVector(right,dx*c.rx*mag*c.v.depth/fx).addScaledVector(up,dy*c.ry*mag*c.v.depth/fy);
          changed=true;deflections++;
        }
        if(!changed)break;
      }
    }
    let violations=0,airborne=0;
    for(const d of debris){
      if(d.air>.006){
        airborne++;steer(d.pose.position,.277,d.id);
        for(const f of faces){const c=conflict(d.pose.position,.277,f);if(c&&c.gap<.995)violations++;}
      }
      d.pose.updateMatrix();sheets.setMatrixAt(d.id,d.pose.matrix);
    }
    const folderAir=p<.535||(p>.78&&p<.935);
    if(folderAir){
      const r=.56*request.scale.x;steer(request.position,r,57);request.updateWorldMatrix(true,true);
      for(const f of faces){const c=conflict(request.position,r,f);if(c&&c.gap<.995)violations++;}
    }
    sheets.instanceMatrix.needsUpdate=true;curlAttr.needsUpdate=true;
    const caption=p<.34?'01 / Fragmented operations\n'+(p<.18?'Information scattered':'Tracing disconnected records'):p<.68?'02 / Engineered coordination\n'+(p<.37?'Connecting the records':p<.55?'Context verified':'Human review'):'03 / Operational clarity\n'+(p<.69?'Decision pending':p<.75?'Decision recorded':p<.94?'Connecting the next step':'Work and responsibility connected');
    if(caption!==lastCaption){status.textContent=caption;lastCaption=caption;}
    const started=qaEnabled?performance.now():0;
    if(qaEnabled){
    root.updateMatrixWorld(true);
    const round=v=>+v.toFixed(3),vec=v=>v.toArray().map(round);
    const actualGrip=arm.grip.getWorldPosition(sampleContact),contactError=actualGrip.distanceTo(jointTarget);
    operator.arms[0].grip.getWorldPosition(supportGrip);
    request.worldToLocal(stamp.localToWorld(stampLocal.set(0,-.115,0)));
    const projection=o=>{o.getWorldPosition(projected).project(camera);return [round((projected.x+1)*.5),round((1-projected.y)*.5)];};
    const workstationOrientation=workDisplays.map((d,i)=>{
      d.pending.getWorldPosition(laptopScreen);d.operatorAnchor.getWorldPosition(laptopUser);d.keyboard.getWorldPosition(laptopKeys);
      const keyDistance=Math.hypot(laptopUser.x-laptopKeys.x,laptopUser.z-laptopKeys.z),screenDistance=Math.hypot(laptopUser.x-laptopScreen.x,laptopUser.z-laptopScreen.z);
      d.pending.getWorldQuaternion(laptopQ);laptopNormal.set(0,0,1).applyQuaternion(laptopQ).setY(0).normalize();laptopUser.sub(laptopScreen).setY(0).normalize();
      const hands=staffers[i].staff.arms.map((limb,j)=>{
        d.keyboard.localToWorld(keyboardTarget.set(-limb.s*.23,.58,.04));
        limb.grip.getWorldPosition(keyboardHand);
        return {distance:round(keyboardDistances[i][j]),error:round(keyboardHand.distanceTo(keyboardTarget))};
      });
      return {facing:round(laptopNormal.dot(laptopUser)),keyDistance:round(keyDistance),screenDistance:round(screenDistance),oneSided:d.pending.material.side===T.FrontSide&&d.done.material.side===T.FrontSide,engage:round(keyboardWeights[i]),hands};
    });
    stage.dataset.handoffState=JSON.stringify({id:'PR-017',position:vec(request.position),rotation:[request.rotation.x,request.rotation.y,request.rotation.z].map(round),decision:p>=.69,receipt:p>=.94,stamp:round(press),camera:vec(camera.position),stations:stations.map(g=>[...vec(g.position),round(g.rotation.y)]),papers:debris.map(d=>{sheets.getMatrixAt(d.id,matrix);return [d.id,...matrix.elements.map(round)];}),paperCount:sheets.count,mechanicalRoutes:0,owner:'native-scroll',world:'coordination-studio',actors:[operator,...staffers.map(s=>s.staff)].map(s=>[round(s.head.rotation.x),round(s.head.rotation.y),...s.arms.flatMap(a=>a.elbow.quaternion.toArray().map(round))]),jointMatrices:actors.map(s=>[s.torso,s.head,...s.arms.flatMap(a=>[a.a,a.elbow,a.wrist])].map(o=>o.matrixWorld.elements.map(round))),contact:{error:round(contactError),engage:round(engage),distance:round(rawDistance),clamped:rawDistance>L+M-.001||rawDistance<Math.abs(L-M)+.001,grip:vec(actualGrip),target:vec(jointTarget),stampFace:vec(stamp.localToWorld(projected.set(0,-.115,0))),stampOnDocument:vec(stampLocal),documentFace:vec(request.localToWorld(projected.set(0,.027,0)))},screen:{request:projection(request),reviewer:projection(authored[2].nose),receiver:projection(authored[3].nose)},displays:workDisplays.map(d=>d.done.visible),physicalApproval:approvalMark.visible,workstationOrientation,studioMaterials:studioMaterialReceipt,furniture:furnitureReceipt,sightline:{airborne,violations,deflections,folderAir,curl:Math.round(Math.max(...curlAttr.array)*1000)/1000},authored:authoredState.map(a=>({...a,face:Object.fromEntries(Object.entries(a.face).map(([k,v])=>[k,round(v)])),head:a.head.map(round),pelvis:a.pelvis.map(round),feet:a.feet.map(v=>v.map(round)),contacts:a.contacts.map(c=>({...c,engage:round(c.engage),error:round(c.error),contactError:c.contactError===null?null:round(c.contactError),distance:round(c.distance),reach:round(c.reach),palm:c.palm.map(round),target:c.target.map(round)}))})),acting:actors.map(s=>({eye:round(s.eyes.scale.y),gaze:round(s.pupils.position.x)})),supportContact:{error:round(supportGrip.distanceTo(supportTarget)),engage:round(supporting),distance:round(supportDistance),grip:vec(supportGrip),target:vec(supportTarget)}});
    }
    try {renderer.render(scene,camera);drawCount++;stage.dataset.handoffPhase=p.toFixed(4);if(qaEnabled)stage.dataset.handoffBudget=JSON.stringify({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,shadowMap:key.shadow.map?.width||0,raster:[canvas.width,canvas.height],tier:constrained?'constrained':'standard',renderMs:performance.now()-started,drawCount});}
    catch(error){console.warn("Handoff renderer failed",error);fallback();}
  }
  function resize(){
    if(disposed||failed)return;const r=stage.getBoundingClientRect();w=Math.max(1,Math.round(r.width));h=Math.max(1,Math.round(r.height));canvas.style.height='100%';
    const scale=rasterScale(w,h,constrained);const shadowSize=constrained||w<=900?512:1024;if(key.shadow.mapSize.x!==shadowSize){key.shadow.map?.dispose();key.shadow.map=null;key.shadow.mapSize.set(shadowSize,shadowSize);}renderer.setSize(Math.round(w*scale),Math.round(h*scale),false);
    camera.aspect=w/h;camera.updateProjectionMatrix();draw();
  }
  const fallback=()=>{failed=true;canvas.hidden=true;canvas.style.display='none';legacy.style.visibility='';status.hidden=true;stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-authored-cast');stage.removeAttribute('data-handoff-phase');stage.removeAttribute('data-handoff-state');stage.removeAttribute('data-handoff-budget');};
  const onLost=e=>{e.preventDefault();fallback();};
  const revealCast=()=>{if(disposed||failed||castState!=='ready')return;canvas.hidden=false;canvas.style.display='';legacy.style.visibility='hidden';status.hidden=false;stage.dataset.handoffChamber='live';stage.dataset.authoredCast='ready';resize();};
  const onRestored=()=>{if(disposed)return;failed=false;revealCast();};
  canvas.addEventListener('webglcontextlost',onLost);canvas.addEventListener('webglcontextrestored',onRestored);
  const ro=new ResizeObserver(resize);ro.observe(stage);
  async function startCast(){
    if(castState!=='idle'||disposed)return;castState='loading';
    let models=[];
    try{
      models=await loadHumanCast();
      if(disposed){models.forEach(disposeHuman);return;}
      await loadStudioMaterials();
      if(disposed){models.forEach(disposeHuman);return;}
      await loadStudioFurniture();
      if(disposed){models.forEach(disposeHuman);return;}
      authored=models.map((m,i)=>bindHuman(m,roleActors[i],roleNames[i]));
      roleActors.forEach(a=>a.o.visible=false);
      castState='ready';revealCast();
    }catch(error){models.forEach(disposeHuman);authored.forEach(a=>a.wrapper.removeFromParent());authored=[];castState='failed';console.warn('S02 authored cast could not be prepared',error);fallback();}
  }
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible){startCast();draw();}},{rootMargin:'180px 0px'});io.observe(stage);
  const visibility=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',visibility);
  // Keep the authored static poster visible until the whole cast is ready.
  canvas.hidden=true;canvas.style.display='none';status.hidden=true;stage.dataset.studioInteractive='true';
  resize();
  return {
    get active(){return !failed&&!disposed;},
    setPhase(p){phase=clamp(p);if(phase!==last){last=phase;draw();}},
    dispose(){if(disposed)return;disposed=true;ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);
      authored.forEach(a=>{disposeHuman(a.model);a.wrapper.removeFromParent();});authored=[];
      scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());key.shadow.dispose();canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestored);renderer.dispose();canvas.remove();status.remove();legacy.style.visibility='';stage.removeAttribute('data-studio-interactive');stage.removeAttribute('data-authored-cast');stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');stage.removeAttribute('data-handoff-state');stage.removeAttribute('data-handoff-budget');}
  };
}
