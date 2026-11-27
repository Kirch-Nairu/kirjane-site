// Authored human assets: original weighted Rocketbox meshes, no proxy render.
// The native scroll director remains the only animation clock. Bone poses are
// rebuilt from source rest transforms on every seek, including reverse seeks.
import * as T from '../vendor/three/three.module.js';
import {GLTFLoader} from '../vendor/three/addons/loaders/GLTFLoader.js';
export const HUMAN_ROLES=Object.freeze(['capture','connect','decide','act']);
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const Q=()=>new T.Quaternion();
const key=n=>n.toLowerCase().replace(/[^a-z0-9]/g,'');
const assetUrl=role=>new URL('../assets/cinematic/s02-people/'+role+'.glb',import.meta.url).href;
export async function loadHumanCast(){
  const loader=new GLTFLoader();
  // If one asset fails, dispose the other completed loads. The caller stays on
  // its accessible static fallback, never silently substitutes toy figures.
  const settled=await Promise.allSettled(HUMAN_ROLES.map(role=>loader.loadAsync(assetUrl(role))));
  if(settled.some(x=>x.status!=='fulfilled')){
    for(const r of settled)if(r.status==='fulfilled')disposeHuman(r.value.scene);
    throw new Error('S02 authored cast unavailable');
  }
  return settled.map(r=>r.value.scene);
}
export function disposeHuman(root){
  const geometries=new Set(),materials=new Set(),textures=new Set(),skeletons=new Set();
  root.traverse(o=>{
    if(o.geometry)geometries.add(o.geometry);
    if(o.skeleton)skeletons.add(o.skeleton);
    for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){
      materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);
    }
  });
  skeletons.forEach(s=>s.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
  textures.forEach(t=>{t.dispose();if(typeof ImageBitmap!=='undefined'&&t.image instanceof ImageBitmap)t.image.close();});
  root.removeFromParent();
}
function basis(forward,across){
  const x=across.clone().normalize();
  const y=forward.clone().addScaledVector(x,-forward.dot(x)).normalize();
  return Q().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,V().crossVectors(x,y).normalize()));
}
const point=b=>b.getWorldPosition(V());
function setWorldQ(b,q){
  b.quaternion.copy(b.parent.getWorldQuaternion(Q()).invert().multiply(q)).normalize();
  b.updateWorldMatrix(false,true);
}
function aimBone(b,child,dir){
  const before=point(child).sub(point(b)).normalize();
  if(before.lengthSq()<.5||dir.lengthSq()<1e-12)return;
  setWorldQ(b,Q().setFromUnitVectors(before,dir.clone().normalize()).multiply(b.getWorldQuaternion(Q())));
}
// Law of cosines in world space, using the *actual* imported chain lengths.
// Both joints preserve the authored axial orientation as far as possible.
function solveChain(a,b,c,target,pole){
  const origin=point(a),mid=point(b),end=point(c),L=origin.distanceTo(mid),M=mid.distanceTo(end);
  const delta=target.clone().sub(origin),raw=delta.length(),d=Math.min(L+M-.0001,Math.max(Math.abs(L-M)+.0001,raw));
  const dir=raw>1e-7?delta.multiplyScalar(1/raw):V(0,-1,0);
  let bend=pole.clone().addScaledVector(dir,-pole.dot(dir));
  if(bend.lengthSq()<1e-7){bend=V(0,0,1).addScaledVector(dir,-dir.z);if(bend.lengthSq()<1e-7)bend=V(1,0,0).addScaledVector(dir,-dir.x);}
  bend.normalize();
  const along=(L*L-M*M+d*d)/(2*d);
  const elbow=origin.clone().addScaledVector(dir,along).addScaledVector(bend,Math.sqrt(Math.max(0,L*L-along*along)));
  aimBone(a,b,elbow.clone().sub(origin));
  const goal=origin.clone().addScaledVector(dir,d);
  aimBone(b,c,goal.sub(point(b)));
  return {raw,reach:L+M,clamped:Math.abs(raw-d)>.0002};
}
export function bindHuman(model,control,role){
  const wrapper=new T.Group();wrapper.name='Authored human / '+role;
  wrapper.position.copy(control.o.position);wrapper.quaternion.copy(control.o.quaternion);
  control.o.parent.add(wrapper);wrapper.add(model);
  wrapper.updateWorldMatrix(true,true);
  const bones=new Map(),meshes=[];
  model.traverse(o=>{
    if(o.isBone)bones.set(key(o.name),o);
    if(o.isSkinnedMesh){
      meshes.push(o);o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;
      for(const m of Array.isArray(o.material)?o.material:[o.material]){
        // Hair/eyelashes use cutout rather than sorting entire translucent
        // triangles in front of the face. Glasses retain their original blend.
        if(m.transparent&&!/glass/i.test(m.name)){m.alphaTest=.40;m.transparent=false;m.depthWrite=true;}
        if(!m.transparent&&!m.alphaTest)m.side=T.FrontSide;
        m.needsUpdate=true;
      }
    }
  });
  const bone=name=>{const b=bones.get(key('Bip01 '+name));if(!b)throw Error(role+' missing bone '+name);return b;};
  const pelvis=bone('Pelvis'),spine=bone('Spine'),chest=bone('Spine2'),head=bone('Head'),nose=bone('MNose');
  if(meshes.length<1||bones.size!==80)throw Error(role+' invalid authored rig '+bones.size);
  const localPoint=b=>wrapper.worldToLocal(point(b));
  const restPelvis=localPoint(pelvis),restHead=localPoint(head);
  if(localPoint(nose).z<restHead.z)throw Error(role+' model faces wrong axis');
  const wrapperQ=wrapper.getWorldQuaternion(Q()),restQ=b=>wrapperQ.clone().invert().multiply(b.getWorldQuaternion(Q()));
  const legs=[],arms=[];
  for(const [side,name] of [[-1,'R'],[1,'L']]){
    const thigh=bone(name+' Thigh'),calf=bone(name+' Calf'),foot=bone(name+' Foot');
    legs.push({side,thigh,calf,foot,ankle:localPoint(foot),footQ:restQ(foot)});
    const upper=bone(name+' UpperArm'),fore=bone(name+' Forearm'),hand=bone(name+' Hand');
    const index=bone(name+' Finger1'),middle=bone(name+' Finger2'),pinky=bone(name+' Finger4');
    const palmLocal=hand.worldToLocal(point(middle)).multiplyScalar(.55);
    const across=hand.worldToLocal(point(index)).sub(hand.worldToLocal(point(pinky)));
    const localBasis=basis(palmLocal,across);
    const fingers=[1,2,3,4].map(i=>{
      const base=bone(name+' Finger'+i),mid=bone(name+' Finger'+i+'1'),tip=bone(name+' Finger'+i+'2');
      return {base,mid,tip};
    });
    arms.push({side,upper,fore,hand,palmLocal,localBasis,fingers});
  }
  const controlled=[pelvis,spine,chest,head,...legs.flatMap(x=>[x.thigh,x.calf,x.foot]),...arms.flatMap(x=>[x.upper,x.fore,x.hand,...x.fingers.flatMap(f=>[f.base,f.mid,f.tip])])];
  const rest=controlled.map(b=>({b,q:b.quaternion.clone(),p:b.position.clone()}));
  const seated=role!=='act';
  const seatHeight=restPelvis.y>.9?.77:.73;
  return {role,wrapper,model,control,bones,meshes,pelvis,spine,chest,head,nose,legs,arms,rest,restPelvis,seated,seatHeight,receipt:null};
}
export function poseHuman(a,contacts){
  for(const r of a.rest){r.b.quaternion.copy(r.q);r.b.position.copy(r.p);}
  const {wrapper,pelvis,spine,chest,head,control}=a;
  wrapper.position.copy(control.o.position);wrapper.quaternion.copy(control.o.quaternion);
  // Move the real hips to the forward part of the existing seat; the shorter
  // authored arms then reach the work, rather than extending their bones.
  wrapper.position.add(V(0,0,a.seated?.09:.05).applyQuaternion(wrapper.quaternion));
  wrapper.updateWorldMatrix(true,true);
  const wq=wrapper.getWorldQuaternion(Q());
  const worldDirection=v=>v.applyQuaternion(wq);
  const worldPoint=v=>wrapper.localToWorld(v);
  if(a.seated){
    // The hip centre is above the actual .65 seat surface, and the ankle
    // anchors keep the original shoe height above the floor.
    const p=worldPoint(V(a.restPelvis.x,a.seatHeight,a.restPelvis.z));
    pelvis.position.copy(pelvis.parent.worldToLocal(p));
    pelvis.updateWorldMatrix(false,true);
    for(const leg of a.legs){
      const target=worldPoint(V(leg.ankle.x,leg.ankle.y,.25));
      solveChain(leg.thigh,leg.calf,leg.foot,target,worldDirection(V(0,.08,1)));
      setWorldQ(leg.foot,wq.clone().multiply(leg.footQ));
    }
  }
  // Spread the subtle authored upper-body lean across two vertebrae rather
  // than rotating an entire rigid torso. Head has its own look direction.
  for(const [b,ratio] of [[spine,.50],[chest,.50]]){
    const r=control.torso.rotation;
    const delta=Q().setFromEuler(new T.Euler(r.x*ratio,r.y*ratio,r.z*ratio));
    const worldDelta=wq.clone().multiply(delta).multiply(wq.clone().invert());
    setWorldQ(b,worldDelta.multiply(b.getWorldQuaternion(Q())));
  }
  const hr=control.head.rotation;
  const hd=Q().setFromEuler(new T.Euler(hr.x*.75,hr.y,hr.z*.45));
  setWorldQ(head,wq.clone().multiply(hd).multiply(wq.clone().invert()).multiply(head.getWorldQuaternion(Q())));
  const evidence=[];
  for(const limb of a.arms){
    const c=contacts.find(c=>c.side===limb.side);
    const weight=c?.weight??0;
    const idle=worldPoint(V(limb.side*.19,a.seated?.86:1.00,.24));
    const target=idle.clone().lerp(c?.target??idle,weight);
    const forward=worldDirection(V(0,-.12-.15*(1-weight),1)).normalize();
    const across=worldDirection(V(-limb.side,0,0));
    const handQ=basis(forward,across).multiply(limb.localBasis.clone().invert());
    const palmOffset=limb.palmLocal.clone().multiply(limb.hand.getWorldScale(V())).applyQuaternion(handQ);
    const wristTarget=target.clone().sub(palmOffset);
    const result=solveChain(limb.upper,limb.fore,limb.hand,wristTarget,worldDirection(V(limb.side*.72,-.65,-.10)));
    setWorldQ(limb.hand,handQ);
    const palm=limb.hand.localToWorld(limb.palmLocal.clone());
    evidence.push({side:limb.side,engage:weight,error:palm.distanceTo(target),contactError:c?palm.distanceTo(c.target):null,distance:result.raw,reach:result.reach,clamped:result.clamped,palm:palm.toArray(),target:target.toArray()});
  }
  a.receipt={role:a.role,bones:a.bones.size,meshes:a.meshes.length,visible:a.wrapper.visible,seated:a.seated,contacts:evidence,head:point(a.nose).toArray(),pelvis:localVector(wrapper,pelvis),feet:a.legs.map(x=>localVector(wrapper,x.foot))};
  return a.receipt;
}
const localVector=(wrapper,b)=>wrapper.worldToLocal(point(b)).toArray();
