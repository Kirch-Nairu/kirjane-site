const SESSION_KEY = 'kirjane-cinematic-opening-r2';
const LETTERS = 'KIRJANE';
const DURATION = 6800;

export function initEditorialOpening({treatment = 'optical', study = false} = {}) {
  const identity = document.querySelector('[data-editorial-identity]');
  function clearEntry() { delete document.documentElement.dataset.brandEntry; clearTimeout(window.__brandEntryTimer); }
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!identity) { clearEntry(); return; }
  identity.dataset.stage = 'KIRJANE';
  let seen = false;
  try { seen = sessionStorage.getItem(SESSION_KEY) === 'seen'; } catch { /* Optional session persistence. */ }
  if (preference.matches || new URLSearchParams(location.search).get('reduce') === '1' ||
      (!study && (seen || window.__brandEntryExpired || location.hash || scrollY > 8))) { clearEntry(); return; }
  if (!study) {
    try { sessionStorage.setItem(SESSION_KEY, 'seen'); } catch { /* Run once on this document. */ }
  }

  const stage = document.createElement('div');
  stage.className = 'brand-opening';
  stage.dataset.treatment = treatment;
  stage.dataset.phase = 'atmosphere';
  stage.setAttribute('role', 'dialog');
  stage.setAttribute('aria-modal', 'true');
  stage.setAttribute('aria-label', 'Kirjane introduction');
  stage.tabIndex = -1;
  const contours = Array.from({length:30}, (_, i) => {
    const y = 190 + i * 18;
    return `<path d="M -180 ${y} C 160 ${y - 210}, 390 ${y + 225}, 660 ${y - 25} S 1110 ${y - 165}, 1620 ${y + 80}"/>`;
  }).join('');
  stage.innerHTML = `
    <div class="ignition-ground" aria-hidden="true"></div>
    <div class="ignition-art" aria-hidden="true">
      <picture><source media="(max-width:900px)" srcset="./assets/d02-hero-mobile.webp">
      <img src="./assets/d02-hero-desktop.webp" alt="" width="1440" height="900"></picture>
    </div>
    <svg class="ignition-contours" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${contours}</svg>
    <div class="ignition-light" aria-hidden="true"></div>
    <div class="ignition-glyph" aria-hidden="true"><span class="glyph-outline"></span><span class="glyph-solid"></span></div>
    <div class="ignition-resolution" aria-hidden="true">
      <div class="ignition-word"><img src="./assets/brand/kirjane-word-white.webp" alt="" width="1000" height="179"></div>
      <p class="ignition-philosophy">Adapt. Automate. Evolve.</p>
    </div>
    <div class="ignition-cue" aria-hidden="true"><span class="cue-desktop">Scroll to explore</span><span class="cue-mobile">Swipe up to explore</span><span>↓</span></div>
    <button class="ignition-skip" type="button">Skip intro <span aria-hidden="true">↗</span></button>`;
  const copy = document.createElement('img');
  copy.src = './assets/brand/kirjane-mark.webp';
  copy.className = 'ignition-emblem';
  copy.alt = '';
  stage.querySelector('.ignition-resolution').prepend(copy);

  const listeners = new AbortController();
  const animations = [];
  const previousFocus = document.activeElement;
  const inertStates = new Map();
  let raf = 0;
  let watchdog;
  let finished = false;
  let lastIndex = -1;
  let resolutionStarted = false;
  let exitStarted = false;
  let assemblyStarted = false;
  let filmTime = 0;
  let previousFrame;
  const glyph = stage.querySelector('.ignition-glyph');
  const solid = stage.querySelector('.glyph-solid');
  const word = stage.querySelector('.ignition-word');
  const skip = stage.querySelector('.ignition-skip');
  const telemetry = window.__KIRJANE_OPENING__ = {active:true, treatment, stages:[], completed:false};

  function finish(reason = 'complete') {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    clearTimeout(watchdog);
    listeners.abort();
    animations.forEach(({animation}) => animation.cancel());
    inertStates.forEach((wasInert, element) => { element.inert = wasInert; });
    const hadFocus = stage.contains(document.activeElement);
    stage.remove();
    clearEntry();
    identity.dataset.stage = 'KIRJANE';
    telemetry.active = false;
    telemetry.completed = reason === 'complete';
    telemetry.reason = reason;
    telemetry.wallDurationMs = Math.round(performance.now() - start);
    if (hadFocus && reason !== 'pagehide') {
      const target = previousFocus instanceof HTMLElement && previousFocus !== document.body ? previousFocus : document.querySelector('#main');
      target?.focus({preventScroll:true});
    }
  }

  function animate(element, frames, options, at = filmTime) {
    if (!element) return;
    const animation = element.animate(frames, options);
    animation.id = 'kirjane-opening';
    animation.pause();
    animation.currentTime = 0;
    animations.push({animation,at,duration:options.duration,element,settled:false});
    return animation;
  }

  function assemble(element, at, duration, frames) {
    animate(element,frames,{duration,easing:'cubic-bezier(.16,.75,.2,1)',fill:'both'},at);
  }

  function showLetter(index, elapsed) {
    lastIndex = index;
    // Previous letter effects target the same two elements. Cancel them
    // before authoring the next glyph, rather than retaining obsolete effects.
    for (let i = animations.length - 1; i >= 0; i--) {
      const item = animations[i];
      if (item.element === glyph || item.element === solid) {
        item.animation.cancel();
        animations.splice(i,1);
      }
    }
    const letter = LETTERS[index];
    stage.dataset.phase = 'letter';
    stage.dataset.letter = letter;
    stage.dataset.tone = ['dark','ivory','forest','dark','ivory','forest','dark'][index];
    identity.dataset.stage = letter;
    telemetry.stages.push({stage:letter, ms:Math.round(elapsed), wallMs:Math.round(performance.now() - start)});
    stage.querySelectorAll('.glyph-solid,.glyph-outline').forEach((element) => { element.textContent = letter; });
    const transforms = [
      ['translate(-16%, 10%) scale(1.18) skewX(-9deg)','translate(0,0) scale(1) skewX(0deg)'],
      ['scaleX(.17) scaleY(1.28)','scaleX(1) scaleY(1)'],
      ['translate(18%,0) rotateY(-36deg)','translate(0,0) rotateY(0deg)'],
      ['translate(0,-24%) rotate(-12deg)','translate(0,0) rotate(0deg)'],
      ['scale(1.55) translateY(8%)','scale(1) translateY(0)'],
      ['skewX(22deg) translateX(-14%)','skewX(0deg) translateX(0)'],
      ['translateX(20%) scaleX(1.2)','translateX(0) scaleX(1)']
    ][index];
    animate(glyph, [
      {transform:transforms[0],clipPath:index % 2 ? 'inset(0 0 0 100%)' : 'inset(100% 0 0 0)'},
      {transform:transforms[1],clipPath:'inset(0 0 0 0)'}
    ], {duration:180,easing:'cubic-bezier(.18,.75,.25,1)',fill:'both'});
    animate(solid, [
      {clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}
    ], {duration:155,easing:'cubic-bezier(.2,.6,.25,1)',fill:'both'});
  }

  function tick(now) {
    try {
      // Preserve readable letter beats when concurrent page initialization
      // stalls a frame. Advance a bounded visual clock instead of skipping
      // straight past a glyph on the next available frame.
      filmTime += Math.min(50, now - (previousFrame ?? now));
      previousFrame = now;
      let elapsed = filmTime;
      const lastLetter = telemetry.stages.at(-1);
      if (lastIndex >= 0 && lastLetter?.stage === LETTERS[lastIndex] &&
          performance.now() - start - lastLetter.wallMs < 400 &&
          elapsed >= 300 + (lastIndex + 1) * 420) {
        elapsed = filmTime = 299 + (lastIndex + 1) * 420;
      }
      if (elapsed >= DURATION) { finish(); return; }
      if (elapsed >= 300 && elapsed < 3240) {
        const index = Math.min(6,Math.floor((elapsed - 300) / 420));
        if (index !== lastIndex) showLetter(index, elapsed);
      }
      if (elapsed >= 3240 && !resolutionStarted) {
        resolutionStarted = true;
        stage.dataset.phase = 'resolution';
        stage.dataset.tone = 'dark';
        identity.dataset.stage = 'KIRJANE';
        telemetry.stages.push({stage:'KIRJANE',ms:Math.round(elapsed),wallMs:Math.round(now - start)});
        animate(word,[{transform:'scale(1.12)',clipPath:'inset(0 50% 0 0)'},{transform:'scale(1)',clipPath:'inset(0 0 0 0)'}],
          {duration:400,easing:'cubic-bezier(.16,.7,.2,1)',fill:'both'});
        animate(copy,[{transform:'translateY(26px) scale(.85)',clipPath:'inset(100% 0 0 0)'},{transform:'translateY(0) scale(1)',clipPath:'inset(0 0 0 0)'}],
          {duration:480,easing:'cubic-bezier(.16,.7,.2,1)',fill:'both'});
      }
      if (elapsed >= 4300 && !exitStarted) {
        exitStarted = true;
        stage.dataset.phase = 'outro';
        telemetry.stages.push({stage:'outro',ms:Math.round(elapsed),wallMs:Math.round(now-start)});
        for (const [element,selector] of [[copy,'.official-brand-mark'],[word,'.official-brand-word']]) {
          const target = document.querySelector('.site-header '+selector)?.getBoundingClientRect();
          if (!target) continue;
          const from = element.getBoundingClientRect();
          animate(element,[{transform:'translate(0,0) scale(1)'},{transform:`translate(${target.left-from.left}px,${target.top-from.top}px) scale(${target.width/from.width},${target.height/from.height})`}],
            {duration:800,easing:'cubic-bezier(.65,0,.18,1)',fill:'both'});
        }
      }
      if (elapsed >= 5100 && !assemblyStarted) {
        assemblyStarted = true;
        stage.dataset.phase = 'assembly';
        stage.removeAttribute('aria-modal');
        stage.setAttribute('role','region');
        telemetry.stages.push({stage:'assembly',ms:Math.round(elapsed),wallMs:Math.round(now-start)});
        inertStates.forEach((wasInert,element)=>{element.inert=wasInert;});
        // Interaction now belongs to the page (including an open mobile drawer).
        // Do not reapply stale entry states when the remaining film completes.
        inertStates.clear();
      }
      animations.forEach(item=>{
        if (item.settled || elapsed < item.at) return;
        const time=Math.min(item.duration,Math.max(0,elapsed-item.at));
        if(item.animation.currentTime!==time) item.animation.currentTime=time;
        // Keep the fill effect until normal cleanup, but never poll a settled
        // timeline again. All visual keyframes, phase times and dwell stay intact.
        if (time === item.duration) item.settled = true;
      });
      raf = requestAnimationFrame(tick);
    } catch { finish('animation-error'); }
  }

  let start = performance.now();
  try {
    document.body.append(stage);
    if (getComputedStyle(stage).position !== 'fixed') { finish('stylesheet-unavailable'); return; }
    stage.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>finish('media-error'),{signal:listeners.signal}));
    const reveal = [{opacity:0,transform:'translateY(28px)',clipPath:'inset(0 0 100% 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0 0)'}];
    assemble(document.querySelector('.home-hero .hero-sculpture-layer'),4750,1350,[
      {opacity:.16,transform:innerWidth<=700?'translateY(45px) scale(1.08)':'translateX(5%) scale(1.08)',clipPath:'inset(0 0 100% 0)'},
      {opacity:1,transform:'translate(0,0) scale(1)',clipPath:'inset(0 0 0 0)'}]);
    assemble(document.querySelector('.site-header .wordmark'),5050,150,[{opacity:0},{opacity:1}]);
    document.querySelectorAll('.primary-nav a,.site-header .mobile-menu-btn,.mobile-dock').forEach((el,i)=>assemble(el,5050+i*45,520,reveal));
    assemble(identity,5300,550,reveal);
    assemble(document.querySelector('.home-hero h1'),5400,780,reveal);
    assemble(document.querySelector('.home-hero h1 em'),5640,700,[{opacity:0,transform:'translateY(.3em) skewY(3deg)',clipPath:'inset(0 100% 0 0)'},{opacity:1,transform:'translateY(0) skewY(0deg)',clipPath:'inset(0 0 0 0)'}]);
    assemble(document.querySelector('.home-hero .lead'),5930,550,reveal);
    assemble(document.querySelector('.home-hero .explore-cue'),6200,580,reveal);
    assemble(stage.querySelector('.ignition-ground'),4300,850,[{opacity:1},{opacity:0}]);
    assemble(stage.querySelector('.ignition-art'),4600,1050,[{opacity:.4},{opacity:0}]);
    assemble(stage.querySelector('.ignition-contours'),4500,1200,[{opacity:.12},{opacity:0}]);
    assemble(stage.querySelector('.ignition-light'),4800,850,[{opacity:1},{opacity:0}]);
    assemble(stage.querySelector('.ignition-resolution'),5100,140,[{opacity:1},{opacity:0}]);
    for (const element of [...document.body.children]) {
      if (element !== stage && element instanceof HTMLElement && !['SCRIPT','STYLE'].includes(element.tagName)) {
        inertStates.set(element,element.inert);
        element.inert = true;
      }
    }
    stage.focus({preventScroll:true});
    skip.addEventListener('click',() => finish('skip'),{signal:listeners.signal});
    for (const event of ['wheel','touchmove']) {
      window.addEventListener(event,() => finish(event),{passive:true,signal:listeners.signal});
    }
    const entryScroll = scrollY;
    window.addEventListener('scroll',() => { if (Math.abs(scrollY - entryScroll) > 4) finish('scroll'); },
      {passive:true,signal:listeners.signal});
    window.addEventListener('keydown',(event) => {
      if (event.key === 'Escape') finish('escape');
      if (event.key === 'Tab' && !assemblyStarted) { event.preventDefault(); skip.focus({preventScroll:true}); }
    },{signal:listeners.signal});
    window.addEventListener('pagehide',() => finish('pagehide'),{signal:listeners.signal});
    const entryWidth = innerWidth;
    const entryHeight = innerHeight;
    window.addEventListener('resize',() => {
      if (innerWidth !== entryWidth || innerHeight !== entryHeight) finish('resize');
    },{signal:listeners.signal});
    preference.addEventListener('change',() => finish('reduced-motion'),{signal:listeners.signal});
    document.addEventListener('visibilitychange',() => { if (document.hidden) finish('hidden'); },{signal:listeners.signal});
    watchdog = setTimeout(() => finish('timeout'), 10000);
    animate(stage.querySelector('.ignition-contours'),[
      {transform:'translate(-3%,4%) scale(1.12)'},{transform:'translate(3%,-3%) scale(1.02)'}
    ],{duration:DURATION,easing:'linear',fill:'both'});
    animate(stage.querySelector('.ignition-light'),[
      {transform:'translateX(-45%)'},{transform:'translateX(35%)'}
    ],{duration:DURATION,easing:'cubic-bezier(.2,.4,.4,1)',fill:'both'});
    start = performance.now();
    clearEntry();
    raf = requestAnimationFrame(tick);
  } catch { finish('initialization-error'); }
  return {finish};
}
