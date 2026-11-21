// Original shared R3 motion/material keys; no renderer or second clock.
export const CINEMATIC = Object.freeze({edge:'#d3f66b',ground:'#081b15',surface:'#237d5d',settle:1.05});
// Piecewise causal timing: disorder -> attraction -> lattice -> resolved core.
// Monotonic cubic interpolation, including exact endpoints for reverse seeking.
export function clarityPhase(value){
 const p=Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
 const keys=[[0,0],[.27,.17],[.55,.66],[.82,.94],[1,1]];
 let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;
 const [a,x]=keys[i],[b,y]=keys[i+1],t=(p-a)/(b-a),u=t*t*(3-2*t);
 return x+(y-x)*u;
}

// Optical camera keys grade the inherited CGI consistently. They do not
// regenerate its meshes or claim to be a new real-time 3D renderer.
const CAMERA_KEYS={
 home:[[0,1.01,0,0,1.04],[.34,1.045,-.5,0,1.10],[.68,1.065,-.8,0,1.18],[1,1.035,0,0,1.14]],
 kernel:[[0,1.01,0,0,1.10],[.31,1.055,-.6,0,1.24],[.52,1.025,0,0,1.18],[.72,1.035,.4,0,1.18],[1,1,0,0,1.16]]
};
export function cinematicGrade(value,kind='home',mobile=false){
 const p=Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
 const keys=CAMERA_KEYS[kind]||CAMERA_KEYS.home;
 let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;
 const a=keys[i],b=keys[i+1],t=(p-a[0])/(b[0]-a[0]),u=t*t*t*(t*(t*6-15)+10);
 const values=a.slice(1).map((v,j)=>v+(b[j+1]-v)*u);
 if(mobile){values[0]=1+(values[0]-1)*.45;values[1]=0;values[2]=-(values[0]-1)*14;}
 return {scale:values[0],x:values[1],y:values[2],brightness:values[3],saturation:.94};
}
const previousGrade=new WeakMap();
export function gradeSceneCanvas(canvas,value,{kind='home',mobile=false,reduced=false}={}){
 if(!canvas)return;
 const phase=reduced?1:value,key=kind+':'+mobile+':'+reduced+':'+Math.round(phase*10000);
 if(previousGrade.get(canvas)===key)return;previousGrade.set(canvas,key);
 const grade=cinematicGrade(phase,kind,mobile);
 canvas.style.transform=reduced?'none':`translate3d(${grade.x}%,${grade.y}%,0) scale(${grade.scale})`;
 canvas.style.filter=`brightness(${grade.brightness}) saturate(${grade.saturation})`;
 canvas.dataset.cinematicPhase=Number(phase).toFixed(4);
}
