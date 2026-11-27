import * as T from '../vendor/three/three.module.js';

// S02 R6: THE COORDINATION STUDIO — THE HUMAN DECISION — an authored architectural cutscene, directed in scroll time. All motion is a pure function of director phase.
// No external assets, extra RAF, timers, or simulated backend.
const clamp = x => Math.max(0, Math.min(1,x));
const ease = x => {x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
const span = (p,a,b) => ease((p-a)/(b-a));
const mix = (a,b,t) => a+(b-a)*t;
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
  try {renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});}
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
  renderer.toneMappingExposure=.96;
  renderer.shadowMap.enabled=new URLSearchParams(location.search).get('s02shadow')!=='off';renderer.shadowMap.type=T.PCFSoftShadowMap;
  const qaEnabled=new URLSearchParams(location.search).get('s02qa')==='1';

  const scene=new T.Scene();scene.background=new T.Color(0x263b40);scene.fog=new T.Fog(0x435355,24,65);
  const camera=new T.PerspectiveCamera(40,1,.1,100);
  const ambient=new T.HemisphereLight(0xe5efff,0xa98971,1.65);scene.add(ambient);
  const key=new T.DirectionalLight(0xffdab0,2.7);key.position.set(-6,9,-3);scene.add(key);
  key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-9,right:9,top:8,bottom:-8,near:.5,far:27});key.shadow.bias=-.00035;key.shadow.normalBias=.025;key.shadow.radius=2;
  const rim=new T.DirectionalLight(0xc5e0ed,1.65);rim.position.set(4,5,8);scene.add(rim);
  // Two directional keys + hemisphere: no per-fragment point attenuation over the entire room.
  const root=new T.Group();scene.add(root);
  const mat=(color,roughness=.85,metalness=0)=>metalness>0?new T.MeshStandardMaterial({color,roughness,metalness}):new T.MeshLambertMaterial({color});
  const timber=mat(0xad7551),oak=mat(0xd7ad7b),cream=mat(0xf2e4d0),plaster=mat(0xd3c6b2),ink=mat(0x253b43),teal=mat(0x366d6b),sage=mat(0x839881),clay=mat(0xc26c50),navy=mat(0x344b6a),brass=mat(0xb99758,.35,.55),paper=mat(0xfff0d7),black=mat(0x20272a),leaf=mat(0x4d754b),leaf2=mat(0x86a65a),rug=mat(0x748c90);
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
  const vista=texture(1536,768,(c,W,H)=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#91becf');g.addColorStop(.62,'#e9e4c4');g.addColorStop(1,'#f5d7a4');c.fillStyle=g;c.fillRect(0,0,W,H);c.fillStyle='#f8e8b9';c.beginPath();c.arc(1120,150,74,0,Math.PI*2);c.fill();for(let k=0;k<3;k++){c.fillStyle=['#8aa8a2','#6e978c','#567a6d'][k];c.beginPath();c.moveTo(0,H);for(let i=0;i<=96;i++)c.lineTo(i*16,390+k*84+Math.sin(i*.17+k)*59+Math.cos(i*.31+k)*32);c.lineTo(W,H);c.fill();}for(let i=0;i<90;i++){const x=(i*173.7)%W,y=H-22-(i%7)*9;c.fillStyle=i%3===0?'#4b7365':'#678d79';c.beginPath();c.ellipse(x,y,8+(i%5)*3,19+(i%7)*4,0,0,Math.PI*2);c.fill();}});
  const windowMats=Array.from({length:3},(_,i)=>{const t=vista.clone();t.repeat.set(1/3,1);t.offset.set(i/3,0);t.needsUpdate=true;textures.push(t);return new T.MeshBasicMaterial({map:t});});
  for(let i=0;i<3;i++){const x=-5.2+i*3.28;b(room,ink,x,2.72,-5.15,2.98,2.48,.08);mesh(planeGeo,windowMats[i],room,x,2.72,-5.095,2.83,2.33,1);b(room,timber,x,1.47,-4.99,3.12,.16,.35);b(room,cream,x,2.72,-5.045,.09,2.36,.06).castShadow=true;b(room,cream,x,3.19,-5.045,2.85,.075,.06).castShadow=true;}
  b(room,teal,5.57,1.35,-5.08,3.38,2.65,.22);b(room,oak,5.57,.86,-4.71,3.43,.14,.72);
  for(let i=0;i<3;i++){b(room,ink,4.45+i*1.12,.45,-4.67,1.04,.7,.65);b(room,brass,4.45+i*1.12,.65,-4.31,.25,.045,.05);}
  for(let k=0;k<2;k++){b(room,oak,5.56,1.45+k*.78,-4.78,3.31,.09,.53);for(let i=0;i<12;i++){const h=.26+((i*7+k*3)%7)*.055;b(room,[clay,cream,navy,sage,timber][i%5],4.15+i*.235,1.51+k*.78+h/2,-4.72,.19,h,.32);}}
  placard(room,'Coordination studio','People • records • decisions',5.54,3.45,-4.99,3.0,.73,'#f0e6d2','#345a59');
  // Authored glass dividers, framed workflow print and room-specific shelf objects.
  const workflowBoard=placard(room,'Every request has an owner','INTAKE  /  RECORDS  /  REVIEW  /  RECEIPT',5.54,4.16,-4.99,3.0,.50,'#435c57','#e3d3b5');
  b(room,timber,5.54,4.16,-5.04,3.09,.59,.07);
  b(room,brass,5.54,2.85,-4.71,3.36,.025,.025);
  for(const [x,z] of [[-7.03,-2.7],[7.03,-3.8]]){
    b(room,timber,x,1.45,z,.11,2.9,.12);
    b(room,cream,x,2.9,z,.12,.1,.12);
  }
  b(room,rug,.8,.027,1.0,7.7,.035,5.0).receiveShadow=true;for(const z of [-1.42,3.42])b(room,ink,.8,.052,z,7.62,.008,.035);for(let i=0;i<4;i++)b(room,cream,.8,.052,-1.35+i*.075,7.15,.007,.026);
  function plant(p,x,z,scale=1){const g=group(p,x,0,z);g.scale.setScalar(scale);cyl(g,clay,0,.22,0,.31,.44);cyl(g,black,0,.45,0,.27,.035);for(let i=0;i<9;i++){const a=i*2.39996,r=.22+(i%3)*.1,h=.72+(i%4)*.15;beam(g,leaf,[0,.43,0],[Math.sin(a)*r,h,Math.cos(a)*r],.023);const l=ell(g,i%2?leaf:leaf2,Math.sin(a)*r,h,Math.cos(a)*r,.15,.33,.075);l.rotation.set(.42*Math.cos(a),a,.55*Math.sin(a));}shadow(g,0,0,1.5,1.2);return g;}
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
  const destinations=[[-.65,1.16,.24],[-.55,1.16,.23],[-.95,1.16,.32],[-.58,1.16,.25]];
  function desk(g,w,d,m){shadow(g,0,0,w+1,d+1.2);const top=b(g,m,0,1.04,0,w,.15,d);top.castShadow=true;top.receiveShadow=true;b(g,timber,0,.945,0,w-.18,.05,d-.14);for(const x of [-w/2+.22,w/2-.22])b(g,brass,x,.88,0,.035,.035,d-.25);for(const x of [-w/2+.19,w/2-.19])for(const z of [-d/2+.16,d/2-.16])beam(g,timber,[x,.04,z],[x*.94,.98,z*.86],.065);}
  function chair(g,x,z,color,angle=0){const c=group(g,x,0,z);c.rotation.y=angle;shadow(c,0,0,1.2,1.2);for(const a of [-1,1])for(const d of [-1,1])beam(c,timber,[a*.27,0,d*.26],[a*.23,.54,d*.21],.045);ell(c,color,0,.56,0,.39,.09,.35).castShadow=true;ell(c,color,0,.94,-.29,.39,.39,.105);for(const x of [-.25,.25])beam(c,timber,[x,.52,-.22],[x,.90,-.29],.045);return c;}
  const workDisplays=[];
  function laptop(g,x,z,title,sub,doneTitle,doneSub,threshold){const l=group(g,x,1.13,z);b(l,ink,0,.026,0,.77,.055,.51);b(l,black,0,.06,.04,.65,.014,.32);const s=group(l,0,.04,-.23);s.rotation.x=-.16;b(s,ink,0,.27,0,.77,.55,.05);const pending=placard(s,title,sub,0,.27,.032,.70,.46,'#d7e7dd','#2e5256');const done=placard(s,doneTitle,doneSub,0,.27,.033,.70,.46,'#e8efdb','#355a55');done.visible=false;workDisplays.push({pending,done,threshold});return l;}
  function lamp(g,x,z){const l=group(g,x,1.13,z);cyl(l,brass,0,.035,0,.17,.07);beam(l,brass,[0,.05,0],[0,.73,0],.022);beam(l,brass,[0,.73,0],[.30,.81,.13],.022);mesh(taperGeo,teal,l,.3,.74,.13,.20,.25,.20);cyl(l,white,.3,.62,.13,.17,.018);}
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
  const faceGeo=profileGeometry([[-.175,.005,.008,.024],[-.155,.058,.064,.021],[-.123,.087,.081,.013],[-.075,.109,.095,.005],[-.026,.127,.105,.002],[.018,.126,.103,0],[.056,.122,.104,-.002],[.102,.118,.104,-.008],[.148,.085,.080,-.016],[.174,.005,.008,-.015]],20);
  const shirtGeo=profileGeometry([[-.30,.173,.109],[-.21,.183,.119],[-.12,.176,.115],[.015,.188,.123],[.13,.224,.139],[.22,.23,.12],[.28,.141,.088],[.30,.058,.056]],16);
  const hairGeo=profileGeometry([[.055,.130,.108,-.026],[.10,.135,.113,-.023],[.15,.107,.094,-.018],[.185,.055,.055,-.011],[.19,.004,.004]],20);
  const upperGeo=profileGeometry([[-.29,.057,.061],[-.23,.074,.078],[-.09,.092,.087],[.015,.085,.081],[.043,.025,.025]],10);
  const foreGeo=profileGeometry([[-.29,.038,.036],[-.23,.044,.041],[-.09,.061,.058],[.01,.056,.055],[.025,.025,.025]],10);
  const handGeo=profileGeometry([[-.102,.023,.017],[-.079,.048,.025],[-.012,.052,.027],[.018,.037,.029],[.025,.005,.006]],10);
  function human(g,x,z,face,seated,palette){
    const o=group(g,x,0,z);o.rotation.y=face;animated.add(o);
    const skin=mat(palette.skin,.67),hair=mat(palette.hair,.83),shirt=palette.shirt,trouser=palette.pants,pelvis=seated?.81:1.00;
    const torso=group(o,0,pelvis+.28,0);animated.add(torso);
    mesh(shirtGeo,shirt,torso,0,0,0,1,1,1).castShadow=true;
    const trim=mat(palette.style===0?0x203c3a:0x40494a,.8);
    for(const s of [-1,1]){
      const lapel=b(torso,palette.style===0?trim:shirt,s*.073,.20,.108,.077,.14,.024);lapel.rotation.z=s*.27;
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
    mesh(faceGeo,skin,head,0,0,0,1,1,1).castShadow=true;
    mesh(hairGeo,hair,head,0,0,0,1,1,1);
    const lip=mat(0x79504b,.75),eye=mat(0x282727,.5),ivory=mat(0xe0d3bf,.65);
    for(const s of [-1,1]){
      ell(head,skin,s*.126,-.027,-.008,.025,.045,.025);
      ell(head,ivory,s*.050,.025,.100,.023,.0075,.010);
      ell(head,eye,s*.050,.025,.109,.008,.008,.006);
      const brow=ell(head,hair,s*.050,.052,.105,.035,.008,.008);brow.rotation.z=s*.09;
    }
    // Angular bridge and tip, not a spherical nose.
    const nose=profileGeometry([[-.048,.018,.023,.105],[-.025,.023,.032,.111],[.029,.012,.018,.110],[.05,.004,.004,.105]],8);
    mesh(nose,skin,head,0,0,0,1,1,1);
    ell(head,lip,0,-.079,.099,.032,.0045,.005);
    if(palette.style===1){ell(head,hair,0,-.025,-.082,.134,.19,.07);ell(head,hair,.078,.085,.064,.065,.10,.055);ell(head,hair,0,-.15,-.103,.069,.12,.067);}
    else if(palette.style===2){ell(head,hair,0,.14,-.025,.125,.07,.09);ell(head,hair,-.093,.07,-.01,.046,.083,.06);}
    else {for(let j=0;j<3;j++){const lock=ell(head,hair,-.071+j*.071,.136-j*.008,.047,.050,.050,.061);lock.rotation.z=-.42;}}
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
    return {o,torso,head,arms};
  }
  const palettes=[{skin:0xb97f56,hair:0x352823,shirt:clay,pants:navy,style:1},{skin:0x875b41,hair:0x242223,shirt:navy,pants:ink,style:2},{skin:0xd1a17b,hair:0x583d2b,shirt:teal,pants:ink,style:0},{skin:0xb57e59,hair:0x2b2524,shirt:cream,pants:navy,style:1}];
  let operator,stamp,reviewPending,reviewApproved,receivePending,receiveDone;
  for(let i=0;i<4;i++){
    const g=group(root,...positions[i]);stations.push(g);animated.add(g);
    if(i===0){desk(g,2.55,1.25,oak);chair(g,-.2,-.94,clay,0);laptop(g,.62,-.28,'Intake','PR-017 · Details missing','Intake complete','PR-017 · Sent to records',.37);lamp(g,-1.03,-.36);mug(g,.93,.3,teal);placard(g,'Intake','Receive the request',0,.78,.64,1.65,.38);staffers.push({i,staff:human(g,-.2,-.94,0,true,palettes[i])});}
    else if(i===1){desk(g,2.50,1.4,timber);chair(g,.1,-1.02,navy,0);for(let j=0;j<5;j++)b(g,[teal,clay,cream,navy,sage][j],-.83+j*.20,1.37,-.41,.16,.45,.46);laptop(g,.65,-.25,'Records check','PR-017 · Checking source','Source confirmed','PR-017 · Review required',.39);mug(g,.95,.35,cream);placard(g,'Records','Confirm the details',0,.8,.72,1.65,.38);staffers.push({i,staff:human(g,.1,-1.02,0,true,palettes[i])});}
    else if(i===2){shadow(g,0,0,4.2,3.0,.052);const top=cyl(g,oak,0,1.04,0,1.42,.15,.91);top.castShadow=true;top.receiveShadow=true;cyl(g,timber,0,.95,0,1.32,.035,.85);cyl(g,timber,0,.52,0,.29,1.0);cyl(g,ink,0,.075,0,.73,.15);chair(g,.12,-1.20,teal,0);chair(g,-1.48,.18,clay,Math.PI/2);chair(g,1.48,.18,navy,-Math.PI/2);
      operator=human(g,.12,-1.20,0,true,palettes[i]);lamp(g,-1,-.35);flatCard(g,'Review checklist','Scope • amount • owner',-.56,1.13,.30,.73,.45);
      stamp=group(g,.34,1.40,-.78);animated.add(stamp);cyl(stamp,brass,0,0,0,.06,.13);ell(stamp,timber,0,.065,0,.10,.055,.10);b(stamp,ink,0,-.085,0,.19,.06,.15);
      reviewPending=placard(g,'Review pending','Human decision required',-.87,1.33,.43,.94,.31,'#5b3526','#f6d6a2');reviewApproved=placard(g,'Approved','Decision recorded',-.87,1.33,.43,.94,.31,'#244943','#cae5cf');b(g,timber,-.87,1.14,.43,1.0,.05,.19);}
    else{desk(g,2.7,1.30,oak);b(g,teal,.96,.48,-.08,.55,.82,.75);for(let j=0;j<2;j++){b(g,oak,.96,.36+j*.36,.31,.43,.27,.055);b(g,brass,.96,.39+j*.36,.35,.17,.035,.05);}laptop(g,-.8,-.27,'Purchasing','Awaiting approval','Receipt confirmed','PR-017 · Assigned',.94);lamp(g,.98,-.39);mug(g,.58,.36,clay);staffers.push({i,staff:human(g,.18,-.98,0,false,palettes[i])});
      receivePending=placard(g,'Purchasing','Awaiting approved record',0,.83,.661,1.76,.35);receiveDone=placard(g,'Assigned to purchasing','Receipt confirmed',0,.83,.662,1.76,.35,'#244943','#cae5cf');}
  }
  // CUSTODY — one physical folder, 56 independently conserved sheets.
  const request=group(root);animated.add(request);b(request,clay,0,0,0,.96,.08,.69).castShadow=true;b(request,paper,.035,.057,0,.83,.055,.60);b(request,teal,-.39,.083,0,.15,.03,.63);flatCard(request,'PR-017','Purchase request',.06,.092,0,.68,.43);
  // Permanent visual custody mark travels with the original document, not a second folder.
  const approvalMark=flatCard(request,'APPROVED','Review complete',.23,.098,-.105,.28,.13);approvalMark.rotation.z=-.12;approvalMark.visible=false;
  const tag=placard(request,'PR-017','Purchase request',0,.58,0,1.1,.38,'#253b43','#f7e8cf');
  const fileFlag=new T.Sprite(new T.SpriteMaterial({map:tag.material.map,depthTest:false,depthWrite:false,toneMapped:false}));fileFlag.position.set(0,.53,0);fileFlag.scale.set(.88,.293,1);fileFlag.renderOrder=9;request.add(fileFlag);tag.removeFromParent();tag.material.dispose();
  const path=positions.map(([x,,z],i)=>new T.Vector3(x+(i===2?.14:0),1.18,z+(i===2?-.63:.12)));
  const arcs=[];for(let i=0;i<3;i++){const a=path[i],c=path[i+1],pts=[];for(let j=0;j<=64;j++){const t=j/64;pts.push(new T.Vector3(mix(a.x,c.x,t),1.18+Math.sin(t*Math.PI)*1.5,mix(a.z,c.z,t)));}const geo=new T.BufferGeometry().setFromPoints(pts),material=new T.LineBasicMaterial({color:0xf3d19a,transparent:true,opacity:0,depthWrite:false});const arc=new T.Line(geo,material);root.add(arc);arcs.push(arc);}
  const paperMap=texture(256,320,(x,W,H)=>{x.fillStyle='#f7eddb';x.fillRect(0,0,W,H);x.fillStyle='#3b6663';x.fillRect(20,23,130,12);x.fillStyle='#a7a09a';for(let j=0;j<10;j++)x.fillRect(20,55+j*17,195-(j%3)*24,3);x.strokeStyle='#b57450';x.strokeRect(169,242,60,36);});
  const sheetMaterial=mat(0xffffff,.92);sheetMaterial.map=paperMap;
  const sheets=new T.InstancedMesh(boxGeo,sheetMaterial,56);sheets.instanceMatrix.setUsage(T.DynamicDrawUsage);sheets.frustumCulled=false;sheets.castShadow=true;sheets.receiveShadow=false;root.add(sheets);
  const debris=Array.from({length:56},(_,id)=>({id,theta:id*2.39996323,r:1.5+(id%11)*.43,desk:id%4,layer:Math.floor(id/4),pose:new T.Object3D()}));
  const target=new T.Vector3(),matrix=new T.Matrix4();const pulse=(p,a,b,c)=>span(p,a,b)-span(p,b,c);
  // Preserve local animation by batching under each nearest animated ancestor.
  animated.add(root);root.updateMatrixWorld(true);const buckets=new Map();
  root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||![boxGeo,sphereGeo,cylGeo,taperGeo].includes(o.geometry))return;let parent=o.parent;while(parent&&!animated.has(parent))parent=parent.parent;if(!parent)return;if(!buckets.has(parent))buckets.set(parent,new Map());const by=buckets.get(parent),k=o.geometry.uuid+o.material.uuid+Number(o.castShadow)+Number(o.receiveShadow);if(!by.has(k))by.set(k,[]);by.get(k).push(o);});
  for(const [parent,by] of buckets)for(const items of by.values()){if(items.length<2)continue;const m=new T.InstancedMesh(items[0].geometry,items[0].material,items.length),inv=parent.matrixWorld.clone().invert();items.forEach((o,i)=>{m.setMatrixAt(i,new T.Matrix4().multiplyMatrices(inv,o.matrixWorld));o.removeFromParent();});m.castShadow=items[0].castShadow;m.receiveShadow=items[0].receiveShadow;m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();parent.add(m);}
  // RENDERER / LIFECYCLE — one director phase; expensive diagnostics only in opt-in QA.
  let phase=0,disposed=false,failed=false,visible=false,last=-1,w=1,h=1,lastCaption='',drawCount=0;
  const jointTarget=new T.Vector3(),jointGoal=new T.Vector3(),jointDir=new T.Vector3(),jointBend=new T.Vector3(),jointElbow=new T.Vector3(),jointLower=new T.Vector3(),jointUpper=new T.Vector3(),jointDown=new T.Vector3(0,-1,0),jointQ1=new T.Quaternion(),jointQ2=new T.Quaternion(),jointInv=new T.Quaternion();
  const actors=[operator,...staffers.map(s=>s.staff)];
  const sampleContact=new T.Vector3(),projected=new T.Vector3();
  const status=document.createElement('div');
  status.className='handoff-scene-caption';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  Object.assign(status.style,{position:'absolute',zIndex:'3',right:'3%',top:'11%',font:'500 12px system-ui',letterSpacing:'.035em',color:'#fff3df',background:'rgba(22,37,40,.74)',padding:'7px 10px',borderLeft:'1px solid #e5b97e',textShadow:'none',textAlign:'right',pointerEvents:'none',whiteSpace:'pre-line'});
  legacy.after(canvas);
  stage.append(status);
  const shots=[[0,-.4,1.65,-.5,.05,16.8,7.5,12.4,5.8],[.15,-2.65,1.85,.0,.02,11.8,5.5,9.2,4.9],[.37,-2.25,1.65,-1.05,-.13,9.2,4.6,8.2,4.5],[.55,.86,1.64,-.57,-.15,3.95,2.30,5.1,2.80],[.69,.86,1.64,-.57,-.10,3.95,2.30,5.1,2.80],[.83,2.9,1.8,-1.05,.04,7.7,4.1,8.3,4.5],[.95,4.1,1.55,-1.45,.14,6.5,3.5,7.6,4.2],[1,.1,1.6,-.6,.06,15.8,6.7,13,6]];
  function draw(){
    if(disposed||failed||!visible||document.hidden)return;

    const p=phase,trace=span(p,.09,.48),decision=span(p,.58,.69),release=span(p,.76,.94);
    stations.forEach((g,i)=>{const [x,y,z]=positions[i],q=span(p,.10+i*.024,.43+i*.018),s=1-q;g.position.set(x+s*Math.sin(i*4+1)*.78,y,z+s*Math.cos(i*4)*.64);g.rotation.y=baseAngles[i]+s*Math.sin(i*2.6+.7)*.40;});
    stations.forEach(g=>g.updateWorldMatrix(true,false));
    for(const d of debris){const i=d.id,q=span(p,.035+(i%9)*.018,.35+(i%9)*.019),u=1-q,theta=d.theta+p*15*(.52+(i%4)*.17)+q*3.7;const dest=destinations[d.desk];target.set(dest[0]+(d.layer%2)*.49,dest[1]+Math.floor(d.layer/2)*.018,dest[2]);stations[d.desk].localToWorld(target);const o=d.pose;
      o.position.set(mix(target.x,Math.sin(theta)*d.r-.35,u),mix(target.y,1.3+(i%8)*.42+Math.sin(theta*1.6)*.6,u)+Math.sin(q*Math.PI)*.7,mix(target.z,Math.cos(theta)*d.r*.78+.6,u));o.rotation.set(u*Math.sin(theta*1.4)*1.75,mix(stations[d.desk].rotation.y+(i%2)*.05,theta*1.6,u),u*Math.cos(theta*1.3)*1.3);o.scale.set(.42+(i%3)*.045,.018,.58);o.updateMatrix();sheets.setMatrixAt(i,o.matrix);}
    sheets.instanceMatrix.needsUpdate=true;
    let segment=0,t=span(p,.19,.37);if(p>=.37&&p<.55){segment=1;t=span(p,.39,.55);}else if(p>=.55){segment=2;t=release;}
    request.position.copy(path[segment]).lerp(path[segment+1],t);
    if(segment===0){target.set(0,1.18,.12);stations[0].localToWorld(target);target.y+=.55+(1-trace)*.9;target.x+=.35*Math.sin(p*13)*(1-trace);request.position.copy(target).lerp(path[1],t);}
    const spin=Math.sin(t*Math.PI);request.position.y+=spin*1.5;fileFlag.visible=p<.55||spin>.15;fileFlag.position.set(0,.29+spin*.15,.23*(1-spin));approvalMark.visible=p>=.69;request.rotation.set(-.25*spin+(1-trace)*.19*Math.sin(p*19),.83*spin+(1-trace)*(.25+p*6),.24*spin+(1-trace)*.17*Math.cos(p*16));request.scale.setScalar(.94+.16*spin+.12*(1-trace));
    const press=span(p,.585,.635)-span(p,.66,.72);

    // ACTING / IK — all axes reset; no orientation from a preceding evaluation.
    function pose(staff,action,look,variant){
      staff.torso.rotation.set(.055+action*.10,look*.17,variant*.035*action);
      staff.head.rotation.set(.07+action*.19,look,variant*.035);
      staff.arms.forEach(({a,elbow,wrist,s})=>{
        a.rotation.set(-.43-action*(s<0?.50:.74),s*.04,s*(.12-action*.06));
        elbow.rotation.set(-.86-action*.36,0,s*.025);
        wrist.rotation.set(.10-action*.12,0,s*.04);
      });
    }
    pose(operator,press,.10-.18*press,-1);
    staffers.forEach(({staff,i})=>{
      const a=i===0?pulse(p,.01,.12,.24):i===1?pulse(p,.28,.40,.53):pulse(p,.79,.94,1.01);
      pose(staff,a,(i===0?.23:-.18)*(1-a),i===3?1:-1);
    });
    // The stamp is lifted, pressed against the request, then released.
    const stampContact=span(p,.59,.625)-span(p,.66,.70);
    stamp.position.set(.34,1.48-.105*stampContact,-.78);
    operator.torso.updateWorldMatrix(true,false);stamp.updateWorldMatrix(true,false);
    const arm=operator.arms[1],engage=span(p,.53,.58)-span(p,.69,.75);
    stamp.localToWorld(jointTarget.set(0,.065,0));
    operator.torso.worldToLocal(jointGoal.copy(jointTarget)).sub(arm.a.position);
    // Grip is .043 beyond the wrist along the lower arm. Solve to that actual anchor.
    const L=.29,M=.333,rawDistance=jointGoal.length(),d=reachDistance(rawDistance,L,M);
    jointDir.copy(jointGoal);if(rawDistance<1e-9)jointDir.set(0,-1,0);else jointDir.multiplyScalar(1/rawDistance);
    jointBend.set(1,0,0).addScaledVector(jointDir,-jointDir.x).normalize();
    if(jointBend.lengthSq()<.001)jointBend.set(0,0,1).addScaledVector(jointDir,-jointDir.z).normalize();
    const along=(L*L-M*M+d*d)/(2*d);
    jointElbow.copy(jointDir).multiplyScalar(along).addScaledVector(jointBend,Math.sqrt(Math.max(0,L*L-along*along)));
    jointUpper.copy(jointElbow).normalize();jointLower.copy(jointDir).multiplyScalar(d).sub(jointElbow).normalize();
    jointQ1.setFromUnitVectors(jointDown,jointUpper);
    jointQ2.setFromUnitVectors(jointDown,jointLower.applyQuaternion(jointInv.copy(jointQ1).invert()));
    arm.a.quaternion.slerp(jointQ1,engage);arm.elbow.quaternion.slerp(jointQ2,engage);
    arm.wrist.quaternion.slerp(jointInv.identity(),engage);
    workDisplays.forEach(d=>{d.pending.visible=p<d.threshold;d.done.visible=p>=d.threshold;});
    reviewPending.visible=p<.69;reviewApproved.visible=p>=.69;receivePending.visible=p<.94;receiveDone.visible=p>=.94;
    ambient.intensity=mix(.70,.94,trace);key.intensity=mix(2.00,2.55,trace);rim.intensity=mix(.75,1.12,decision)+.22*press;
    arcs.forEach((arc,i)=>{const from=[.18,.39,.75][i],to=[.37,.55,.94][i],q=span(p,from,to);arc.geometry.setDrawRange(0,Math.floor(q*64)+1);arc.material.opacity=.78*pulse(p,from,(from+to)/2,to+.065);});
    // CINEMATOGRAPHY — wide master, active record, intimate review, release, calm pullback.
    const portrait=w/h<1.05,compact=w<=900&&!portrait;
    let k=0;while(k<shots.length-2&&p>shots[k+1][0])k++;const l=shots[k],r=shots[k+1],v=span(p,l[0],r[0]),shot=n=>mix(l[n],r[n],v);
    // Portrait opening follows the intake folder; receipt holds the destination before the pullback.
    const intakeHold=1-span(p,.15,.37),receiptHold=span(p,.91,.97);
    const cx=shot(1)+(portrait?(-3.65*intakeHold+1.65*receiptHold-.40*pulse(p,.30,.44,.53)):0),cy=shot(2),cz=shot(3)+(portrait?1.15*intakeHold:0),angle=shot(4),radius=shot(portrait?7:5);
    camera.fov=portrait?49:compact?49:40;camera.position.set(cx+Math.sin(angle)*radius,shot(portrait?8:6),cz+Math.cos(angle)*radius);camera.lookAt(cx,cy,cz);camera.setViewOffset(w,h,portrait?0:-w*(compact?.15:.14),portrait?h*.17:0,w,h);camera.updateProjectionMatrix();camera.updateMatrixWorld();
    const caption=p<.18?'01 / A request arrives\nPR-017 · Ownership unclear':p<.55?'02 / Find the right record\nPR-017 · '+(p<.37?'Checking details':'Source confirmed'):p<.75?'03 / A human decision\nPR-017 · '+(p<.69?'Review pending':'Approved'):'04 / The next responsibility\nPR-017 · '+(p<.94?'Handover in progress':'Assigned to purchasing');
    if(caption!==lastCaption){status.textContent=caption;lastCaption=caption;}
    const started=qaEnabled?performance.now():0;
    if(qaEnabled){
    root.updateMatrixWorld(true);
    const round=v=>+v.toFixed(3),vec=v=>v.toArray().map(round);
    const actualGrip=arm.grip.getWorldPosition(sampleContact),contactError=actualGrip.distanceTo(jointTarget);
    const projection=o=>{o.getWorldPosition(projected).project(camera);return [round((projected.x+1)*.5),round((1-projected.y)*.5)];};
    stage.dataset.handoffState=JSON.stringify({id:'PR-017',position:vec(request.position),rotation:[request.rotation.x,request.rotation.y,request.rotation.z].map(round),decision:p>=.69,receipt:p>=.94,stamp:round(press),camera:vec(camera.position),stations:stations.map(g=>[...vec(g.position),round(g.rotation.y)]),papers:debris.map(d=>{sheets.getMatrixAt(d.id,matrix);return [d.id,...matrix.elements.map(round)];}),paperCount:sheets.count,mechanicalRoutes:0,owner:'native-scroll',world:'coordination-studio',actors:[operator,...staffers.map(s=>s.staff)].map(s=>[round(s.head.rotation.x),round(s.head.rotation.y),...s.arms.flatMap(a=>a.elbow.quaternion.toArray().map(round))]),jointMatrices:actors.map(s=>[s.torso,s.head,...s.arms.flatMap(a=>[a.a,a.elbow,a.wrist])].map(o=>o.matrixWorld.elements.map(round))),contact:{error:round(contactError),engage:round(engage),distance:round(rawDistance),clamped:rawDistance>L+M-.001||rawDistance<Math.abs(L-M)+.001,grip:vec(actualGrip),target:vec(jointTarget),stampFace:vec(stamp.localToWorld(projected.set(0,-.115,0))),documentFace:vec(request.localToWorld(projected.set(0,.092,0)))},screen:{request:projection(request),reviewer:projection(operator.head),receiver:projection(staffers[2].staff.head)},displays:workDisplays.map(d=>d.done.visible),physicalApproval:approvalMark.visible});
    }
    try {renderer.render(scene,camera);drawCount++;stage.dataset.handoffPhase=p.toFixed(4);if(qaEnabled)stage.dataset.handoffBudget=JSON.stringify({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,shadowMap:key.shadow.map?.width||0,raster:[canvas.width,canvas.height],tier:constrained?'constrained':'standard',renderMs:performance.now()-started,drawCount});}
    catch(error){console.warn("Handoff renderer failed",error);fallback();}
  }
  function resize(){
    if(disposed||failed)return;const r=stage.getBoundingClientRect();w=Math.max(1,Math.round(r.width));h=Math.max(1,Math.round(r.height));canvas.style.height='100%';
    const scale=rasterScale(w,h,constrained);const shadowSize=constrained||w<=900?512:1024;if(key.shadow.mapSize.x!==shadowSize){key.shadow.map?.dispose();key.shadow.map=null;key.shadow.mapSize.set(shadowSize,shadowSize);}renderer.setSize(Math.round(w*scale),Math.round(h*scale),false);
    camera.aspect=w/h;camera.updateProjectionMatrix();draw();
  }
  const fallback=()=>{failed=true;canvas.hidden=true;canvas.style.display='none';legacy.style.visibility='';status.hidden=true;stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');stage.removeAttribute('data-handoff-state');stage.removeAttribute('data-handoff-budget');};
  const onLost=e=>{e.preventDefault();fallback();};
  const onRestored=()=>{if(disposed)return;failed=false;canvas.hidden=false;canvas.style.display='';legacy.style.visibility='hidden';status.hidden=false;stage.dataset.handoffChamber='live';resize();};
  canvas.addEventListener('webglcontextlost',onLost);canvas.addEventListener('webglcontextrestored',onRestored);
  const ro=new ResizeObserver(resize);ro.observe(stage);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)draw();});io.observe(stage);
  const visibility=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',visibility);
  legacy.style.visibility='hidden';stage.dataset.studioInteractive='true';stage.dataset.handoffChamber='live';
  resize();
  return {
    get active(){return !failed&&!disposed;},
    setPhase(p){phase=clamp(p);if(phase!==last){last=phase;draw();}},
    dispose(){if(disposed)return;disposed=true;ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);
      scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());key.shadow.dispose();canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestored);renderer.dispose();canvas.remove();status.remove();legacy.style.visibility='';stage.removeAttribute('data-studio-interactive');stage.removeAttribute('data-handoff-chamber');stage.removeAttribute('data-handoff-phase');stage.removeAttribute('data-handoff-state');stage.removeAttribute('data-handoff-budget');}
  };
}
