/** Kirjane static editorial interactions. No analytics, no network calls. */
(() => {
  'use strict';
  const nav=document.querySelector('#site-navigation');
  const toggle=document.querySelector('.menu-toggle');
  const closeNav=()=>{if(!nav||!toggle)return;nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');};
  toggle?.addEventListener('click',()=>{
    const open=!nav.classList.contains('is-open');
    nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('is-open')){closeNav();toggle?.focus();}});
  window.addEventListener('resize',()=>{if(window.innerWidth>850)closeNav();});
  const services=[
    ['s01-development.webp','Architecture, interfaces, operational tooling'],
    ['s02-automation.webp','Rules, approvals, repeatable workflows'],
    ['s03-integration.webp','APIs, data movement, connected operations'],
    ['s04-infrastructure.webp','Deployment, security, maintainability']
  ];
  const tabs=Array.from(document.querySelectorAll('[data-service-select]'));
  const panel=document.querySelector('#service-preview');
  const art=document.querySelector('[data-service-image]');
  const focus=document.querySelector('[data-service-focus]');
  const activate=i=>{
    if(!panel||!art||!focus)return;
    const item=services[i];if(!item)return;
    tabs.forEach((b,index)=>{b.classList.toggle('active',index===i);b.setAttribute('aria-selected',String(index===i));b.tabIndex=index===i?0:-1;});
    art.src='/assets/visuals/'+item[0];focus.textContent=item[1];
    panel.setAttribute('aria-labelledby','service-tab-'+(i+1));
    const label=panel.querySelector('.service-preview-caption .mono');if(label)label.textContent='FOCUS / 00'+(i+1);
  };
  tabs.forEach((btn,i)=>{
    btn.addEventListener('click',()=>activate(i));
    btn.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowDown'||e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();activate(n);tabs[n].focus();});
  });
  if(tabs.length)activate(0);
  const progress=document.querySelector('.scroll-progress');
  if(progress){let scheduled=false;const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform='scaleX('+(max>0?Math.min(1,window.scrollY/max):0)+')';scheduled=false;};window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});update();}
})();
