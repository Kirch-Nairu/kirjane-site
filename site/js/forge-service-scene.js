import * as THREE from '../vendor/three/three.module.js';
import gsap from '../vendor/gsap/index.js';

// Original four-pose engineering sculpture. One renderer; transitions own time.
export function createServiceScene(host, reduced) {
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
  scene.add(new THREE.HemisphereLight(0xe8ffd8,0x102b25,3));
  for (const [x,y,z,c,p] of [[3,6,3,0xd3f66b,85],[-5,2,-3,0x4ccead,100]]) {
    const light=new THREE.PointLight(c,p);light.position.set(x,y,z);scene.add(light);
  }
  const group=new THREE.Group();scene.add(group);
  const geometry=new THREE.BoxGeometry(.72,.72,.72);
  const nodes=Array.from({length:16},(_,i)=>{
    const material=new THREE.MeshPhysicalMaterial({color:i%4===0?0xd3f66b:0x237d5d,
      metalness:.45,roughness:.22,clearcoat:1,emissive:0x176044,emissiveIntensity:.24});
    const mesh=new THREE.Mesh(geometry,material);group.add(mesh);return mesh;
  });
  const lineMaterial=new THREE.LineBasicMaterial({color:0x81b79f,transparent:true,opacity:.52});
  let lineGeometry=new THREE.BufferGeometry();
  const links=new THREE.LineSegments(lineGeometry,lineMaterial);group.add(links);
  const ringGeometry=new THREE.TorusGeometry(3.15,.014,6,100);
  const ring=new THREE.Mesh(ringGeometry,new THREE.MeshBasicMaterial({color:0x41725b}));
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
    const points=[];
    for(let i=0;i<16;i++){
      const j=pose===3?(i+1)%16:pose===2?(i+8)%16:Math.min(15,i+1);
      points.push(nodes[i].position.clone(),nodes[j].position.clone());
      if(pose===3&&i%4===0)points.push(nodes[i].position.clone(),nodes[(i+8)%16].position.clone());
    }
    lineGeometry.dispose();lineGeometry=new THREE.BufferGeometry().setFromPoints(points);links.geometry=lineGeometry;
    renderer.render(scene,camera);dirty=false;
  }
  function select(index){
    pose=index;host.dataset.mode=String(index);host.setAttribute('aria-label',labels[index]+' — illustrative engineering sculpture');
    tween?.kill();
    const timeline=gsap.timeline({onUpdate:()=>{dirty=true;draw();}});tween=timeline;
    nodes.forEach((node,i)=>{
      const [x,y,z]=target(i,index);
      timeline.to(node.position,{x,y,z,duration:reduced?0:1.05,ease:'power3.inOut'},i*.012);
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
