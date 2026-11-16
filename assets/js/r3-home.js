/** R3 M01+M02: scroll-linked homepage motion; native scrolling, no dependencies.
 * Progressive enhancement. Without this file the R2 homepage remains fully usable.
 * Desktop has a sticky, reversible 4-beat chapter. Touch/mobile/reduced-motion do not pin.
 */
(() => {
  'use strict';
  if (document.body?.dataset.page !== 'Home') return;
  const doc = document.documentElement;
  const hero = document.querySelector('.home-hero');
  const track = document.querySelector('[data-r3-services-track]');
  const stage = document.querySelector('.r3-services-stage');
  const tabs = Array.from(document.querySelectorAll('[data-service-select]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wide = window.matchMedia('(min-width: 960px)');
  const touch = window.matchMedia('(pointer: coarse)');
  const tall = window.matchMedia('(min-height: 650px)');
  if (!hero || !track || !stage || tabs.length !== 4) return;

  let mode = false;
  let index = 0;
  let queued = false;
  let geometry = null;
  const clamp = x => Math.min(1, Math.max(0, x));
  const measure = () => {
    // Resolve the real CSS sticky offset so the scroll timeline matches the
    // viewport-fitted chapter at every viewport height and zoom level.
    const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0;
    const absoluteTop = track.getBoundingClientRect().top + window.scrollY;
    const start = absoluteTop - stickyTop;
    const end = absoluteTop + track.offsetHeight - stage.offsetHeight - stickyTop;
    geometry = { start, range: Math.max(1, end - start) };
  };
  const update = () => {
    queued = false;
    if (!reduce.matches && wide.matches) {
      const heroRange = Math.max(1, hero.offsetHeight * .88);
      hero.style.setProperty('--r3-hero-p', clamp(window.scrollY / heroRange).toFixed(4));
    } else {
      hero.style.setProperty('--r3-hero-p', '0');
    }
    if (!mode || !geometry) return;
    const progress = clamp((window.scrollY - geometry.start) / geometry.range);
    track.style.setProperty('--r3-service-p', progress.toFixed(4));
    const newIndex = Math.min(3, Math.floor(progress * 4));
    if (newIndex !== index) {
      index = newIndex;
      // The existing tab activation logic remains the only state authority.
      tabs[index].click();
    }
  };
  const request = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };
  const syncMode = () => {
    mode = wide.matches && tall.matches && !reduce.matches && !touch.matches;
    doc.classList.toggle('r3-scroll-active', mode);
    track.style.removeProperty('--r3-service-p');
    if (mode) {
      measure();
      index = Math.max(0, tabs.findIndex(x => x.getAttribute('aria-selected') === 'true'));
    } else {
      geometry = null;
    }
    request();
  };
  const scrollToBeat = i => {
    if (!mode || !geometry) return;
    const target = geometry.start + ((i + .12) / 4) * geometry.range;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };
  // Trusted direct interactions can navigate to their corresponding scroll beat.
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', e => {
      if (e.isTrusted) { index = i; scrollToBeat(i); }
    });
    tab.addEventListener('keydown', e => {
      if (mode && e.isTrusted && /^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) {
        window.requestAnimationFrame(() => {
          const selected = tabs.findIndex(x => x.getAttribute('aria-selected') === 'true');
          if (selected >= 0) { index = selected; scrollToBeat(selected); }
        });
      }
    });
  });
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { syncMode(); });
  [wide, tall, reduce, touch].forEach(q => q.addEventListener?.('change', syncMode));
  // Image size changes and font loads can move the sticky track.
  document.fonts?.ready?.then(() => { if (mode) measure(); request(); });
  window.addEventListener('load', () => { if (mode) measure(); request(); }, { once: true });
  syncMode();
  if (!reduce.matches) window.requestAnimationFrame(() => doc.classList.add('r3-entered'));
  // R3-M03 / Process: five glass pillars are one approved flattened image.
  // Progress follows the ladder using a soft exposure mask from that same image.
  // No new artwork, SVG, canvas, synthetic particles or scroll interception.
  const processTrack = document.querySelector('[data-r3-process-track]');
  const processStage = processTrack?.querySelector('.r3-process-stage');
  const processSteps = Array.from(processTrack?.querySelectorAll('[data-r3-process-step]') || []);
  if (processTrack && processStage && processSteps.length === 5) {
    const scenes = [
      ['Discover','Understand the real work, the people and the constraints.'],
      ['Plan & Design','Define the experience, boundaries and system architecture.'],
      ['Develop','Build the solution against clear, agreed requirements.'],
      ['Validate','Test the behavior, usability and operating assumptions.'],
      ['Deliver & Support','Prepare deployment, handover and continuous improvement.']
    ];
    const counter = processTrack.querySelector('[data-r3-process-count]');
    const number = processTrack.querySelector('[data-r3-process-number]');
    const title = processTrack.querySelector('[data-r3-process-title]');
    const detail = processTrack.querySelector('[data-r3-process-description]');
    let processEnabled = false;
    let processGeometry = null;
    let processIndex = 0;
    let processQueued = false;
    const focusPoints = [[13,69],[32,59],[51,49],[70,38],[89,26]];
    const setProcessStep = (i) => {
      const next = Math.max(0, Math.min(4, i));
      const changed = next !== processIndex;
      processIndex = next;
      processSteps.forEach((button,j) => {
        button.classList.toggle('is-active',j === next);
        button.setAttribute('aria-current',j === next ? 'step' : 'false');
      });
      const current = String(next+1).padStart(2,'0');
      counter.textContent = current + ' / 05';
      number.textContent = current;
      title.textContent = scenes[next][0];
      detail.textContent = scenes[next][1];
      // Briefly bring the new copy into focus; do not animate under reduced motion.
      if (changed && !reduce.matches && title.animate) {
        [title,detail].forEach((node) => node.animate([
          {opacity:.28,transform:'translate3d(0,10px,0)'},
          {opacity:1,transform:'translate3d(0,0,0)'}
        ],{duration:460,easing:'cubic-bezier(.19,1,.22,1)'}));
      }
    };
    const measureProcess = () => {
      const absoluteTop = processTrack.getBoundingClientRect().top + window.scrollY;
      const stickyTop = Number.parseFloat(window.getComputedStyle(processStage).top) || 0;
      processGeometry = {
        start: absoluteTop - stickyTop,
        range: Math.max(1,processTrack.offsetHeight-processStage.offsetHeight)
      };
    };
    const updateProcess = () => {
      processQueued = false;
      if (!processEnabled || !processGeometry) return;
      const progress = clamp((window.scrollY - processGeometry.start)/processGeometry.range);
      processTrack.style.setProperty('--r3-process-p', progress.toFixed(4));
      // Follow the five existing glass pillars continuously across the image.
      const interval = Math.min(3,Math.floor(progress*4));
      const fractional = Math.min(1,progress*4-interval);
      const a=focusPoints[interval],b=focusPoints[interval+1];
      const x=a[0]+(b[0]-a[0])*fractional;
      const y=a[1]+(b[1]-a[1])*fractional;
      processTrack.style.setProperty('--r3-process-x',x.toFixed(2)+'%');
      processTrack.style.setProperty('--r3-process-y',y.toFixed(2)+'%');
      setProcessStep(Math.min(4,Math.floor(progress*5)));
    };
    const requestProcess = () => {
      if (processQueued) return;
      processQueued=true;
      window.requestAnimationFrame(updateProcess);
    };
    const syncProcess = () => {
      processEnabled = wide.matches && tall.matches && !touch.matches && !reduce.matches;
      doc.classList.toggle('r3-process-scroll-active',processEnabled);
      if (processEnabled) measureProcess();
      else {
        processGeometry=null;
        processTrack.style.removeProperty('--r3-process-p');
      }
      requestProcess();
    };
    const goToProcess = i => {
      setProcessStep(i);
      if (!processEnabled || !processGeometry) return;
      window.scrollTo({top:processGeometry.start+((i+.32)/5)*processGeometry.range,behavior:'smooth'});
    };
    processSteps.forEach((button,i)=>{
      button.addEventListener('click',()=>goToProcess(i));
      button.addEventListener('keydown',e=>{
        let next=i;
        if (e.key==='ArrowRight'||e.key==='ArrowDown') next=(i+1)%5;
        else if (e.key==='ArrowLeft'||e.key==='ArrowUp') next=(i+4)%5;
        else if (e.key==='Home') next=0;
        else if (e.key==='End') next=4;
        else return;
        e.preventDefault();
        processSteps[next].focus();
        goToProcess(next);
      });
    });
    window.addEventListener('scroll',requestProcess,{passive:true});
    window.addEventListener('resize',syncProcess);
    [wide,tall,touch,reduce].forEach(query=>query.addEventListener?.('change',syncProcess));
    document.fonts?.ready?.then(()=>{if(processEnabled)measureProcess();requestProcess();});
    window.addEventListener('load',()=>{if(processEnabled)measureProcess();requestProcess();},{once:true});
    syncProcess();
  }
})();
