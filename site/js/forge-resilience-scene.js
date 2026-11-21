const STATES={
 normal:['CONNECTED','External connection available','Available to authorized workflows'],
 local:['EXTERNAL LINK UNAVAILABLE','Local work continues','Waiting for connection'],
 exchange:['CONNECTION RETURNED','Review before exchange','Awaiting authorized review']
};
export function createResilienceScene(host){
 host.innerHTML='<div class="r3-network-head"><span>LOCAL OPERATION / EXTERNAL DEPENDENCIES</span><strong data-network-state></strong></div>'+ 
 '<div class="r3-network"><div class="r3-workstations"><div class="r3-station"><small>01 / COUNTER</small><b>Sale record</b><span>Local station</span></div><div class="r3-station"><small>02 / BACK OFFICE</small><b>Stock movement</b><span>Role-based access</span></div></div>'+ 
 '<div class="r3-local-link" aria-hidden="true"><i></i><i></i></div><div class="r3-local-core"><small>SHARED LOCAL HOST</small><strong>SALRYN</strong><span>Security · Infrastructure</span><b>LOCAL NETWORK</b></div>'+ 
 '<div class="r3-external-link" aria-hidden="true"><i></i></div><div class="r3-external"><small>OPTIONAL EXTERNAL SERVICE</small><b data-external-status></b><span data-external-detail></span></div></div>'+ 
 '<div class="r3-network-ledger"><div><small>LOCAL PATH</small><strong data-local-status></strong><p>Local availability depends on the equipment, network, and workflows in your deployment.</p></div><div><small>EXTERNAL PATH</small><strong data-queue-status></strong><p data-recovery-note></p><button type="button" data-recovery-next hidden>Review next exchange step</button></div></div>'+ 
 '<p class="r3-story-note">Illustrative resilience model. No live transactions, synchronization or recovery service is running.</p>';
 let mode='normal',phase=0;
 const q=s=>host.querySelector(s),abort=new AbortController();
 function paint(){
  const state=STATES[mode];host.dataset.networkMode=mode;host.dataset.recoveryPhase=phase;
  q('[data-network-state]').textContent=state[0];q('[data-local-status]').textContent=state[1];
  q('[data-external-status]').textContent=mode==='local'?'Disconnected':mode==='exchange'?'Link restored':'Connected';
  q('[data-external-detail]').textContent=mode==='local'?'Local network remains independent':'Optional services depend on this connection';
  q('[data-queue-status]').textContent=mode==='exchange'?['Pending review','Records reviewed','Ready for authorized export'][phase]:state[2];
  q('[data-recovery-note]').textContent=mode==='exchange'?['Confirm connectivity and identify waiting actions.','An authorized operator checks the records and destination.','Export is a separate authorized operation. This model does not perform it.'][phase]:mode==='local'?'External-dependent actions stay waiting. No external completion is claimed.':'Local records and external-service work have separate availability boundaries.';
  q('[data-recovery-next]').hidden=mode!=='exchange'||phase===2;
 }
 q('[data-recovery-next]').addEventListener('click',()=>{phase=Math.min(2,phase+1);paint();},{signal:abort.signal});
 paint();return {select(next){mode=next==='multi'?'normal':next in STATES?next:'normal';phase=0;paint();},dispose(){abort.abort();}};
}
