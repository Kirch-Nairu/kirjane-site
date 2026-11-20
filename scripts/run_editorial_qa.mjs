import fs from 'node:fs/promises';
import path from 'node:path';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve('toolchain/browsers');
const { chromium } = await import('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173';
const out = process.env.KIRJANE_EDITORIAL_QA_DIR || 'dist/evidence/inherited-focused';
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=d3d11', '--ignore-gpu-blocklist']
});
const results = [];
const failures = [];
const check = (name, ok, evidence) => {
  results.push({name, ok: Boolean(ok), evidence});
  if (!ok) console.error('FAIL', name, evidence ?? '');
};
const waitFor = async (predicate) => {
  try {
    await predicate();
    return true;
  } catch {
    return false;
  }
};
const assets = (page) => {
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
};
const navigate = async (page, pageName, suffix = '') => {
  await page.goto(`${base}/site/${pageName}.html${suffix}`);
  await page.waitForFunction(() => window.__SITE_READY__);
  await page.evaluate(() => document.fonts.ready);
};
const position = (page, selector, progress = 0) => page.locator(selector).evaluate((el, fraction) => {
  const {top, height} = el.getBoundingClientRect();
  window.scrollTo({top: top + scrollY + Math.max(0, height - innerHeight) * fraction, behavior: 'instant'});
}, progress);
const pages = {
  index: ['.home-hero','#complexity-clarity-scene','#salryn-exhibition','#capabilities-exhibition','.work-band','#home-process-section'],
  salryn: ['.salryn-hero','.salryn-editorial-intro','#scene-a-kernel','#scene-b-anatomy','#scene-c-flavors','#scene-d-activation','#scene-e-growth','#scene-f-independence','#scene-g-configuration']
};
const engines = ['Commerce', 'Inventory', 'Procurement', 'Financial', 'Workforce', 'Operations', 'Security', 'Infrastructure'];
const families = ['Retail','Food & Beverage','Hardware & Supply','Healthcare & Wellness','Services','Hospitality','Rental','Distribution','Automotive','Manufacturing','Agriculture','Enterprise'];

try {
  await fs.mkdir(out, {recursive: true});
  for (const [label, width, height] of [['desktop',1440,900],['mobile',390,844]]) {
    const context = await browser.newContext({
      viewport: {width, height},
      isMobile: label === 'mobile',
      hasTouch: label === 'mobile',
      permissions: ['clipboard-read','clipboard-write']
    });
    const page = await context.newPage();
    assets(page);
    for (const [name, sections] of Object.entries(pages)) {
      await navigate(page, name);
      await page.waitForTimeout(1750);
      const info = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth, viewport: innerWidth,
        fonts: Array.from(document.fonts).map(({family,status}) => ({family,status}))
      }));
      check(`${name} ${label} width and local font loads`,
        info.width === width && info.viewport === width && info.fonts.length === 2 &&
          info.fonts.every(({status}) => status === 'loaded'), info);
      for (const [index, section] of sections.entries()) {
        await position(page, section);
        if (label === 'mobile' && index > 0 && !['#complexity-clarity-scene','#scene-a-kernel'].includes(section)) {
          await page.evaluate(() => scrollBy({top:-62,behavior:'instant'}));
        }
        await page.waitForTimeout(360);
        await page.screenshot({path: `${out}/${name}-${label}-${index}.png`});
      }
      if (name === 'index') {
        await position(page, '#complexity-clarity-scene', .86);
        const end = await waitFor(() => page.waitForFunction(() => document.querySelector('.beat-card.is-active')?.dataset.beat === 'clarity', null, {timeout: 2000}));
        await position(page, '#complexity-clarity-scene', .06);
        const start = await waitFor(() => page.waitForFunction(() => document.querySelector('.beat-card.is-active')?.dataset.beat === 'complexity', null, {timeout: 2000}));
        check(`Home ${label} forward and reverse chapters`, end && start);
        const surface = page.locator('#wpanel-0-surface');
        const initiallyHidden = !await surface.isVisible();
        await page.locator('.work-detail summary').first().click();
        await page.locator('[data-wmode="surface"]').first().click();
        check(`Home ${label} workflow disclosure`, initiallyHidden && await surface.isVisible() &&
          !await page.locator('#wpanel-0-arch').isVisible());
      } else {
        await position(page, '#scene-a-kernel', .96);
        const final = await waitFor(() => page.waitForFunction(() => document.querySelector('#salryn-kernel-beats .is-active')?.dataset.beat === 'modular', null, {timeout:2000}));
        await position(page, '#scene-a-kernel', .05);
        const first = await waitFor(() => page.waitForFunction(() => document.querySelector('#salryn-kernel-beats .is-active')?.dataset.beat === 'approach', null, {timeout:2000}));
        check(`Salryn ${label} forward and reverse chapters`, final && first);
      }
    }
    const observed = [];
    for (let index = 0; index < engines.length; index++) {
      const button = page.locator(`[data-engine-btn="${index}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      observed.push(await page.locator('#anatomy-engine-name').innerText());
    }
    check(`Salryn ${label} all eight engines by keyboard`, JSON.stringify(observed) === JSON.stringify(engines), observed);

    const industry = page.locator('#industry-profile');
    const selectedProfiles = [];
    for (let index = 0; index < families.length; index++) {
      await industry.selectOption(String(index));
      const profile = page.locator(`[data-flavor-card="${index}"]`);
      await page.waitForTimeout(75);
      const state = await profile.evaluate((el) => ({
        name: el.querySelector('h3').textContent,
        visible: !el.inert && Math.abs(el.getBoundingClientRect().left -
          el.closest('.exhibition-viewport').getBoundingClientRect().left) < 2
      }));
      selectedProfiles.push(state);
    }
    check(`Salryn ${label} all twelve profiles visible on selection`,
      selectedProfiles.every(({name,visible}, index) => visible && name === families[index]), selectedProfiles);

    for (const foundation of ['security-core','infra-core']) {
      const toggle = page.locator(`[data-cap-id="${foundation}"]`);
      await toggle.click();
      check(`Salryn ${label} ${foundation} remains included`, await toggle.getAttribute('aria-pressed') === 'true');
    }
    for (const mode of ['local','exchange','multi']) {
      const toggle = page.locator(`[data-sim-mode="${mode}"]`);
      await toggle.click();
      check(`Salryn ${label} scenario ${mode}`, await toggle.getAttribute('aria-current') === 'step' &&
        await page.locator('#sim-mode-title').textContent() === await toggle.textContent());
    }
    await page.locator('[data-cap-id="cap-procurement"]').click();
    check(`Salryn ${label} shared configuration state`,
      await page.locator('[data-cfg-cap="cap-procurement"]').getAttribute('aria-pressed') === 'true');
    await page.locator('#cfg-industry').selectOption('Manufacturing');
    await page.locator('#cfg-note').fill('Track receipts across two workshops.');
    await page.locator('#btn-cfg-copy').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    const expected = 'Track receipts across two workshops.';
    check(`Salryn ${label} copy`, clipboard.includes(expected) && clipboard.includes('Manufacturing'));
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#btn-cfg-download').click()]);
    const exported = await fs.readFile(await download.path(), 'utf8');
    check(`Salryn ${label} download`, exported === clipboard.replaceAll('\r\n','\n'),
      {filename: download.suggestedFilename(), bytes: Buffer.byteLength(exported)});
    await Promise.all([page.waitForURL(/contact\.html/), page.locator('#btn-cfg-contact').click()]);
    await page.waitForFunction(() => window.__SITE_READY__);
    check(`Salryn ${label} local Contact handoff`, (await page.locator('#c-scope').inputValue()).includes('Manufacturing'));
    await context.close();
  }

  const reduced = await browser.newContext({viewport:{width:390,height:844}, reducedMotion:'reduce'});
  const page = await reduced.newPage();
  await navigate(page, 'index');
  check('Static opening under actual reduced-motion preference', await page.locator('[data-editorial-identity]').getAttribute('data-stage') === 'KIRJANE');
  check('All reduced-motion philosophy passages visible', await page.locator('#home-clarity-beats .beat-card:visible').count() === 3);
  await page.locator('#btn-mobile-menu').focus();
  await page.keyboard.press('Enter');
  check('Mobile drawer keyboard entry', await page.locator('#btn-drawer-close').evaluate((el) => el === document.activeElement));
  await page.keyboard.press('Shift+Tab');
  const wrappedBack = await page.locator('#mobile-drawer').evaluate((el) => document.activeElement === Array.from(el.querySelectorAll('a[href],button')).at(-1));
  await page.keyboard.press('Tab');
  check('Mobile drawer tab wraps', wrappedBack && await page.locator('#btn-drawer-close').evaluate((el) => el === document.activeElement));
  await page.keyboard.press('Escape');
  check('Mobile drawer Escape restores focus', await page.locator('#btn-mobile-menu').evaluate((el) => el === document.activeElement));
  for (const chapter of pages.salryn.slice(2)) {
    await navigate(page, 'salryn', chapter);
    const y = await page.locator(chapter).evaluate((el) => el.getBoundingClientRect().top);
    check(`Direct chapter ${chapter}`, y >= 60 && y < 170, y);
  }
  await reduced.close();

  const staticContext = await browser.newContext({javaScriptEnabled:false});
  const staticPage = await staticContext.newPage();
  await staticPage.goto(`${base}/site/salryn.html`);
  const body = await staticPage.locator('main').innerText();
  check('Salryn semantic HTML without JavaScript', [...engines,...families].every((word) => body.includes(word)) &&
    body.includes('A shop can record a sale') && body.includes('Different operations. One foundation.'));
  await staticContext.close();

  const recording = await browser.newContext({
    viewport: {width:1440,height:900},
    recordVideo: {dir: path.join(out, 'recording'), size:{width:1152,height:720}}
  });
  await recording.addInitScript(() => {
    window.identityFrames = [];
    new MutationObserver((records) => {
      for (const record of records) {
        if (!record.target.matches('[data-editorial-identity]')) continue;
        const stage = record.target.dataset.stage;
        if (window.identityFrames.at(-1)?.stage !== stage) {
          window.identityFrames.push({stage, ms: Math.round(performance.now())});
        }
      }
    }).observe(document, {subtree:true,attributes:true,attributeFilter:['data-stage']});
  });
  const hero = await recording.newPage();
  await navigate(hero, 'index');
  await hero.waitForFunction(() => window.__KIRJANE_OPENING__?.completed);
  const identity = await hero.evaluate(() => window.identityFrames);
  check('Recorded K → I → R → J → A → N → E → KIRJANE', identity.filter(({stage}) => stage !== 'KIRJANE').map(({stage}) => stage).join('') === 'KIRJANE' &&
    identity.at(-1)?.stage === 'KIRJANE', identity);
  const video = hero.video();
  await recording.close();
  await video.saveAs(path.join(out, 'kirjane-opening.webm'));
  await video.delete();

  const interrupt = await browser.newContext();
  const opening = await interrupt.newPage();
  await opening.goto(`${base}/site/index.html`, {waitUntil:'domcontentloaded'});
  const playing = opening.locator('.brand-opening');
  await playing.waitFor({timeout:2000});
  const h1Visible = await opening.locator('h1').isVisible();
  await opening.keyboard.press('Escape');
  check('Opening interrupts on Escape while headline remains in HTML',
    h1Visible && await opening.locator('[data-editorial-identity]').getAttribute('data-stage') === 'KIRJANE');
  await navigate(opening, 'salryn');
  await opening.goBack();
  await opening.waitForFunction(() => window.__SITE_READY__);
  check('Opening stays settled after internal return', await playing.count() === 0);
  await interrupt.close();
} catch (error) {
  check('Mission workflow completed', false, String(error.stack || error));
} finally {
  await browser.close();
}
check('No unexpected HTTP errors or uncaught page errors', failures.length === 0, failures);
await fs.writeFile(path.join(out, 'mission-tests.json'), JSON.stringify(results, null, 2));
console.log(`${results.filter(({ok}) => ok).length}/${results.length} mission checks passed`);
if (results.some(({ok}) => !ok)) process.exitCode = 1;
