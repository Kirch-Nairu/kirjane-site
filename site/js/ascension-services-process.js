import {createProcessField} from './forge-process-field.js';
import { initTopographyField } from './topography-canvas.js';
import { animateSvgConduits, initSiteShell, isReducedMotion } from './motion-system.js';

const currentPage = document.body.dataset.editorial;
initSiteShell(currentPage);

const field = initTopographyField({
  warp: 0.84, density: 11.4, energy: 0.39, focusX: 0.67, focusY: 0.48
});

// The field can only be seen through the forest and night compositions.
const visibleFieldSections = new Set();
field.setPaused(true);
const fieldObserver = new IntersectionObserver((entries) => {
  for (const { target, isIntersecting } of entries) {
    if (isIntersecting) visibleFieldSections.add(target);
    else visibleFieldSections.delete(target);
  }
  field.setPaused(visibleFieldSections.size === 0);
});
document.querySelectorAll('[data-asc-field]').forEach((section) => fieldObserver.observe(section));
window.addEventListener('pagehide', (event) => {
  if (event.persisted) return;
  fieldObserver.disconnect();
  field.dispose();
});

async function mountIllustration(mount, pathname) {
  try {
    const response = await fetch(pathname);
    if (!response.ok) return null;
    const source = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    const svg = source.documentElement;
    if (svg.localName !== 'svg' || svg.namespaceURI !== 'http://www.w3.org/2000/svg') return null;
    svg.setAttribute('aria-hidden', 'true');
    mount.replaceChildren(svg);
    mount.dataset.status = 'ready';
    return svg;
  } catch {
    // The static image and its surrounding explanation still cover the illustration.
    return null;
  }
}

function initServices() {
  const demo = document.querySelector('.asc-workflow-exhibit');
  const steps = [...demo.querySelectorAll('[data-as]')];
  const stepButton = document.getElementById('btn-svc-step');
  const status = document.getElementById('svc-auto-status');
  let step = 0;

  steps[0].setAttribute('aria-current', 'step');
  stepButton.hidden = false;
  stepButton.addEventListener('click', () => {
    steps[step].classList.remove('active');
    steps[step].removeAttribute('aria-current');
    step = (step + 1) % steps.length;
    steps[step].classList.add('active');
    steps[step].setAttribute('aria-current', 'step');
    demo.dataset.workflow = step;
    status.textContent = steps[step].textContent;
    field.setProfile({ warp: 0.84 + step * 0.12, energy: 0.39 + step * 0.11 });
  });

  const details = document.getElementById('svc-integration-detail');
  let fetching = false;
  details.addEventListener('toggle', async () => {
    const mount = document.getElementById('svc-membrane-svg');
    if (!details.open || fetching || mount.dataset.status === 'ready' || isReducedMotion()) return;
    fetching = true;
    const svg = await mountIllustration(mount, './assets/services-integration-membrane.svg');
    fetching = false;
    if (svg) animateSvgConduits(svg, '.svc-flow-path');
  });
}

function initProcess() {
  const mount = document.getElementById('proc-topo-mount');
  const caption = document.getElementById('proc-active-label');
  const chapters = [...document.querySelectorAll('.asc-process-chapters [data-step]')];
  const links = [...document.querySelectorAll('.asc-process-index [data-jump]')];
  const processField=createProcessField(mount,isReducedMotion());
  window.addEventListener('pagehide',e=>{if(!e.persisted)processField.dispose();});
  let active = -1;
  let manualHold = false;
  let pendingFrame = 0;
  function setChapter(index) {
    if (index === active) return;
    active = index;
    processField.select(index);
    links.forEach((link, i) => {
      if (i === active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    chapters.forEach((chapter, i) => chapter.classList.toggle('active', i === active));
    caption.textContent = links[active].textContent;
  }

  function applyLocation(event) {
    const index = chapters.findIndex((chapter) => `#${chapter.id}` === location.hash);
    if (index === -1) {
      manualHold=false;
      scheduleSync();
      return;
    }
    manualHold=true;
    setChapter(index);
    if (event?.type === 'hashchange') chapters[index].focus({preventScroll:true});
  }

  function syncChapter() {
    pendingFrame = 0;
    if(manualHold)return;
    // Resolve the visible chapter in either scroll direction without writing to history.
    const readingLine = Math.min(176, innerHeight * 0.38);
    let visible = 0;
    chapters.forEach((chapter, index) => {
      if (chapter.getBoundingClientRect().top <= readingLine) visible = index;
    });
    setChapter(visible);
  }

  function scheduleSync() {
    if (!pendingFrame) pendingFrame = requestAnimationFrame(syncChapter);
  }

  window.addEventListener('scroll', scheduleSync, { passive: true });
  window.addEventListener('resize', scheduleSync, { passive: true });
  const releaseHold=()=>{manualHold=false;scheduleSync();};
  window.addEventListener('wheel',event=>{if(Math.abs(event.deltaY)>2)releaseHold();},{passive:true});
  window.addEventListener('touchmove',releaseHold,{passive:true});
  window.addEventListener('keydown',event=>{
    if(event.target.closest('input,select,textarea,button,[contenteditable]'))return;
    if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))releaseHold();
  });
  window.addEventListener('hashchange', applyLocation);
  window.addEventListener('pageshow', applyLocation);
  setChapter(0);
  applyLocation();


}

if (currentPage === 'services') initServices();
else if (currentPage === 'process') initProcess();

window.__SITE_READY__ = true;
