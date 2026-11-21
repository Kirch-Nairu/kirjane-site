// Original shared R3 motion/material keys; no renderer or second clock.
export const CINEMATIC = Object.freeze({edge:'#d3f66b',ground:'#081b15',surface:'#237d5d',settle:1.05});
// Piecewise causal timing: disorder -> attraction -> lattice -> resolved core.
// Monotonic cubic interpolation, including exact endpoints for reverse seeking.
export function clarityPhase(value){
 const p=Math.max(0,Math.min(1,value));
 const keys=[[0,0],[.27,.17],[.55,.66],[.82,.94],[1,1]];
 let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;
 const [a,x]=keys[i],[b,y]=keys[i+1],t=(p-a)/(b-a),u=t*t*(3-2*t);
 return x+(y-x)*u;
}
