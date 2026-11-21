import * as THREE from '../vendor/three/three.module.js';
import gsap from '../vendor/gsap/index.js';
import {CINEMATIC} from './forge-cinematic-tokens.js';

// Original four-pose engineering sculpture. One renderer; transitions own time.
export function createServiceScene(host, reduced) {
  if(reduced || new URLSearchParams(location.search).get('webgl')==='off'){host.dataset.render='poster';return {select(){},dispose(){}};}
  let renderer;
  try { renderer = new THREE.WebGLRenderer({alpha:true, antialias:false}); }
  catch { host.dataset.render='poster'; return {select(){},dispose(){}}; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setClearColor(0x081b15,1);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.setAttribute('role','img');
  host.append(renderer.domElement);
  host.dataset.render='webgl';
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(36,1,.1,60);
  camera.position.set(6,5,8); camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xf3f5ed,0x102b25,1.15));
  const key=new THREE.DirectionalLight(0xf3f5ed,2.4);key.position.set(-3,6,5);scene.add(key);
  for (const [x,y,z,c,p] of [[3,6,3,0xd3f66b,45],[-5,2,-3,0x70c7dc,65]]) {
    const light=new THREE.PointLight(c,p);light.position.set(x,y,z);scene.add(light);
  }
  const group=new THREE.Group();scene.add(group);
  // Shared authored edge profile; same sixteen nodes, dimensions and pose targets.
  const geometry=new THREE.BoxGeometry(.72,.72,.72,8,8,8);
  const positions=geometry.attributes.position,normals=geometry.attributes.normal;
  const core=new THREE.Vector3(),point=new THREE.Vector3(),normal=new THREE.Vector3();
  for(let i=0;i<positions.count;i++){
    point.fromBufferAttribute(positions,i);core.copy(point).clampScalar(-.29,.29);
    normal.copy(point).sub(core).normalize();point.copy(core).addScaledVector(normal,.07);
    positions.setXYZ(i,point.x,point.y,point.z);normals.setXYZ(i,normal.x,normal.y,normal.z);
  }
  const nodes=Array.from({length:16},(_,i)=>{
    const material=new THREE.MeshPhysicalMaterial({color:i%4===0?0xd3f66b:i%4===3?0x398e9a:0x237d5d,
      metalness:.5,roughness:.3,clearcoat:.75,emissive:0x176044,emissiveIntensity:.06});
    const mesh=new THREE.Mesh(geometry,material);group.add(mesh);return mesh;
  });
  const lineMaterial=new THREE.LineBasicMaterial({color:0x8ab6b9,transparent:true,opacity:.46});
  const lineGeometry=new THREE.BufferGeometry();
  const linePositions=new Float32Array(20*2*3);
  lineGeometry.setAttribute('position',new THREE.BufferAttribute(linePositions,3));
  lineGeometry.setDrawRange(0,0);
  const links=new THREE.LineSegments(lineGeometry,lineMaterial);group.add(links);
  const ringGeometry=new THREE.TorusGeometry(3.15,.022,8,100);
  const ring=new THREE.Mesh(ringGeometry,new THREE.MeshStandardMaterial({color:0x78968b,metalness:.65,roughness:.32}));
  ring.rotation.x=Math.PI/2;ring.position.y=-1.25;scene.add(ring);
  const labels=['MODULAR ASSEMBLY','DECISION ROUTING','SHARED CONTRACT','RESILIENT MESH'];
  let pose=0, tween, visible=false, dirty=true;
  function target(i,mode) {
    const row=Math.floor(i/4),col=i%4;
    if(mode===0)return [(col-1.5)*.88,(row-1.5)*.88,((row+col)%2)*.3];
    if(mode===1)return [(col-1.5)*1.45,Math.sin(col*1.2+row)*.52,(row-1.5)*.75];
    if(mode===2)return [(col<2?-1.8:1.8)+(col%2-.5)*.7,(row-1.5)*.85,(col%2)*.7];
    const angle=i*Math.PI*2/16;return [Math.cos(angle)*2.5,Math.sin(angle*2)*.7,Math.sin(angle)*2.5];
  }
  function draw(){
    if(!visible||document.hidden)return;
    let offset=0;
    function link(a,b){for(const p of [a.position,b.position]){linePositions[offset++]=p.x;linePositions[offset++]=p.y;linePositions[offset++]=p.z;}}
    for(let i=0;i<16;i++){
      const j=pose===3?(i+1)%16:pose===2?(i+8)%16:Math.min(15,i+1);
      link(nodes[i],nodes[j]);
      if(pose===3&&i%4===0)link(nodes[i],nodes[(i+8)%16]);
    }
    lineGeometry.setDrawRange(0,offset/3);lineGeometry.attributes.position.needsUpdate=true;
    links.frustumCulled=false;
    renderer.render(scene,camera);dirty=false;
  }
  function select(index){
    pose=index;host.dataset.mode=String(index);host.setAttribute('aria-label',labels[index]+' — illustrative engineering sculpture');
    tween?.kill();
    const timeline=gsap.timeline({onUpdate:()=>{dirty=true;draw();}});tween=timeline;
    nodes.forEach((node,i)=>{
      const [x,y,z]=target(i,index);
      timeline.to(node.position,{x,y,z,duration:reduced?0:CINEMATIC.settle,ease:'power3.inOut'},i*.012);
      timeline.to(node.rotation,{x:index===1?.15:0,y:index===2?Math.PI/4:0,z:index===3?i*.15:0,duration:reduced?0:.85},0);
    });
    timeline.to(group.rotation,{y:index===2?-.25:index===3?.2:0,duration:reduced?0:1},0);
  }
  function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;draw();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&dirty)draw();});observer.observe(host);
  const visibility=()=>{if(!document.hidden&&dirty)draw();};document.addEventListener('visibilitychange',visibility);
  const lost=e=>{e.preventDefault();host.dataset.render='poster';renderer.domElement.hidden=true;};
  renderer.domElement.addEventListener('webglcontextlost',lost);
  select(0);
  return {select,dispose(){tween?.kill();observer.disconnect();resizeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);
    geometry.dispose();lineGeometry.dispose();lineMaterial.dispose();ringGeometry.dispose();ring.material.dispose();nodes.forEach(n=>n.material.dispose());renderer.dispose();renderer.domElement.remove();}};
}
