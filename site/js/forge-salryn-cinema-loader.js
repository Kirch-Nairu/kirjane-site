/* Native document scroll remains authoritative. The film is an on-page
 * isolated React island, not an iframe/SPA and not a second scroll director.
 * Loading is deferred until the visitor approaches the Salryn chapter.
 */
const host=document.querySelector('[data-forge-salryn-cinema]');
let started=false;
async function mount(){
  if(!host || started)return;
  started=true;
  try{
    const film=await import('./forge-salryn-cinema-r1.js');
    film.mountSalrynCinema(host);
    host.dataset.cinemaLoad='ready';
    // Existing kernel/GSAP scroll measurements may have been acquired before
    // the lazy module; explicitly invalidate their document geometry once.
    requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
  }catch(e){
    host.dataset.cinemaLoad='error';
    window.__KIRJANE_CINEMA_ERROR__=String(e?.stack||e);
    console.error('[Salryn Cinema] isolated film mount failed; source site is intact.',e);
    window.dispatchEvent(new Event('resize'));
  }
}
function init(){
  if(!host)return;
  if(!('IntersectionObserver' in window)){void mount();return;}
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
      observer.disconnect();void mount();
    }
  },{rootMargin:'1200px 0px'});
  observer.observe(host);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
