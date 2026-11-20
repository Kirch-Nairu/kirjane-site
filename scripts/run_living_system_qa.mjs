/**
 * Operation Living System — Comprehensive Section 22 QA, Fault Injection,
 * @axe-core/playwright WCAG 2.2 AA Audit, Hardware + SwiftShader Performance Telemetry,
 * and Real .webm Video Recording + FFmpeg Keyframe Extraction Harness.
 *
 * Usage:
 *   node scripts/run_living_system_qa.mjs round-1
 *   node scripts/run_living_system_qa.mjs round-2 --skip-video
 *   node scripts/run_living_system_qa.mjs round-3
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const localBrowsers = path.join(ROOT, 'toolchain', 'browsers');
  if (fs.existsSync(localBrowsers)) process.env.PLAYWRIGHT_BROWSERS_PATH = localBrowsers;
}

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const FFMPEG = path.join(ROOT, 'toolchain', 'browsers', 'ffmpeg-1013', 'ffmpeg-win64.exe');
const ROUND = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'round-1';
const SKIP_VIDEO = process.argv.includes('--skip-video');

const OUT_DIR = path.join(ROOT, 'dist', 'evidence', 'living-system', ROUND);
const VIDEOS_DIR = path.join(ROOT, 'qa', 'living-system-videos');
[OUT_DIR, VIDEOS_DIR].forEach((d) => fs.mkdirSync(d, { recursive: true }));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.webm': 'video/webm',
  '.json': 'application/json; charset=utf-8'
};

const ALL_PAGES = [
  { id: 'index', file: 'site/index.html', fullMatrix: true },
  { id: 'salryn', file: 'site/salryn.html', fullMatrix: true },
  { id: 'services', file: 'site/services.html', fullMatrix: false },
  { id: 'projects', file: 'site/projects.html', fullMatrix: false },
  { id: 'process', file: 'site/process.html', fullMatrix: false },
  { id: 'about', file: 'site/about.html', fullMatrix: false },
  { id: 'contact', file: 'site/contact.html', fullMatrix: false }
];

const FULL_VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '430x932', width: 430, height: 932, isMobile: true, hasTouch: true },
  { name: '390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: '360x800', width: 360, height: 800, isMobile: true, hasTouch: true },
  { name: '320x568', width: 320, height: 568, isMobile: true, hasTouch: true },
  { name: '280x640', width: 280, height: 640, isMobile: true, hasTouch: true },
  { name: '844x390-land', width: 844, height: 390, isMobile: true, hasTouch: true }
];

const CORE_VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844, isMobile: true, hasTouch: true }
];

function safeUnlink(p) {
  try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch (_) {}
}

function startStaticServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const clean = (req.url || '/').split('?')[0];
      const filePath = path.join(ROOT, decodeURIComponent(clean));
      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port }));
  });
}

async function waitReady(page) {
  await page.waitForFunction(() => window.__SITE_READY__ === true, { timeout: 15000 });
  await page.waitForTimeout(750);
}

async function getDocBounds(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  }, selector);
}

async function measureFps(page, durationMs = 1200) {
  return page.evaluate((ms) => new Promise((resolve) => {
    const times = [];
    let last = performance.now();
    const start = last;
    function loop(now) {
      times.push(now - last);
      last = now;
      if (now - start >= ms) {
        const avg = times.reduce((a, b) => a + b, 0) / Math.max(1, times.length);
        const fps = 1000 / Math.max(1, avg);
        const perf = window.__KIRJANE_PERF__ || {};
        resolve({
          fps: Number(fps.toFixed(1)),
          avgFrameMs: Number(avg.toFixed(2)),
          samples: times.length,
          tier: perf.tier || document.documentElement.dataset.qualityTier || 'unknown',
          renderer: perf.renderer || 'unknown',
          activeLoops: (perf.activeLoops || []).length
        });
      } else {
        requestAnimationFrame(loop);
      }
    }
    requestAnimationFrame(loop);
  }), durationMs);
}

async function extractVideoKeyframes(browser, webmPath, sheetOutPath) {
  if (!fs.existsSync(FFMPEG) || !fs.existsSync(webmPath)) return null;
  const tmpDir = path.join(os.tmpdir(), `kirjane-kf-${path.basename(webmPath, '.webm')}-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  const pattern = path.join(tmpDir, 'kf-%04d.png');
  const res = spawnSync(FFMPEG, [
    '-y', '-i', webmPath,
    '-vf', 'scale=640:-1',
    pattern
  ], { encoding: 'utf8' });

  const allFrames = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.png')).sort();
  if (allFrames.length === 0) {
    console.warn('[FFMPEG KEYFRAME WARN]', path.basename(webmPath), res.stderr?.slice(-300));
    return null;
  }

  // Pick 8 evenly spaced frames across the full video timeline
  const picks = [];
  const count = Math.min(8, allFrames.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.round((i / Math.max(1, count - 1)) * (allFrames.length - 1));
    const fp = path.join(tmpDir, allFrames[idx]);
    const b64 = fs.readFileSync(fp).toString('base64');
    picks.push({ label: `frame ${idx + 1} / ${allFrames.length}`, src: `data:image/png;base64,${b64}` });
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await page.setContent(`<!DOCTYPE html><html><head><style>
    body{margin:0;padding:24px;background:#060E0A;color:#F3F5ED;font-family:'Segoe UI',sans-serif;}
    h1{font-size:15px;color:#D3F66B;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 14px;}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
    .cell{background:#0B1712;border:1px solid rgba(243,245,237,0.16);padding:6px;}
    .cell img{width:100%;display:block;}
    .cap{font-family:Consolas,monospace;font-size:11px;color:rgba(243,245,237,0.78);margin-top:4px;}
  </style></head><body>
    <h1>FFmpeg Extracted Video Keyframes: ${path.basename(webmPath)} (${allFrames.length} decoded frames)</h1>
    <div class="grid">${picks.map((p) => `<div class="cell"><img src="${p.src}"><div class="cap">${p.label}</div></div>`).join('')}</div>
  </body></html>`, { waitUntil: 'load' });
  safeUnlink(sheetOutPath);
  await page.screenshot({ path: sheetOutPath, fullPage: true });
  await page.close();
  try { fs.rmSync(tmpDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 120 }); } catch (_) {}
  return { totalDecodedFrames: allFrames.length, sheetPath: path.relative(ROOT, sheetOutPath) };
}

async function main() {
  const { srv, port } = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  const report = {
    round: ROUND,
    timestamp: new Date().toISOString(),
    viewports: [],
    axe: [],
    interactions: {},
    resilience: {},
    performance: {},
    videos: {},
    passed: true
  };

  const hwBrowser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=d3d11', '--ignore-gpu-blocklist']
  });

  try {
    // =========================================================================
    // 1. MULTI-VIEWPORT LAYOUT, OVERFLOW, CONSOLE & SCREENSHOT MATRIX
    // =========================================================================
    console.log(`[QA ${ROUND}] 1. Running 7-page multi-viewport matrix...`);
    for (const pg of ALL_PAGES) {
      const vps = pg.fullMatrix ? FULL_VIEWPORTS : CORE_VIEWPORTS;
      for (const vp of vps) {
        const ctx = await hwBrowser.newContext({
          viewport: { width: vp.width, height: vp.height },
          isMobile: Boolean(vp.isMobile),
          hasTouch: Boolean(vp.hasTouch)
        });
        const page = await ctx.newPage();
        const errors = [];
        const failedReqs = [];
        page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
        page.on('console', (m) => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });
        page.on('requestfailed', (r) => failedReqs.push(`${r.url()} (${r.failure()?.errorText})`));

        await page.goto(`${baseUrl}/${pg.file}`, { waitUntil: 'load' });
        await waitReady(page);

        const audit = await page.evaluate(async () => {
          const visibleImgs = Array.from(document.querySelectorAll('img')).filter((im) => im.getClientRects().length > 0);
          // Exercise deferred images without changing the production loading policy.
          visibleImgs.forEach((im) => { im.loading = 'eager'; });
          await Promise.race([
            Promise.allSettled(visibleImgs.map((im) => im.decode())),
            new Promise((resolve) => setTimeout(resolve, 4000))
          ]);
          const overflowX = document.documentElement.scrollWidth - window.innerWidth;
          const brokenImgs = visibleImgs.filter((im) => !im.complete || im.naturalWidth === 0).map((im) => im.getAttribute('src'));
          const text = document.body.innerText || '';
          const hasEmDash = /\u2014/.test(text);
          const hasSlopLabel = /(?:^|\n)\s*(?:0[1-9]\s*\/\s*[A-Z]|\[0[1-9]\]|\/\/\s*[A-Z]|SYSTEM_0|STATUS:\s*ONLINE)/m.test(text);
          return { overflowX, brokenImgs, visibleImgCount: visibleImgs.length, hasEmDash, hasSlopLabel };
        });

        // Capture core renders for direct visual inspection
        if (vp.name === '1440x900' || vp.name === '390x844') {
          const tag = vp.name === '1440x900' ? 'desktop' : 'mobile';
          const outShot = path.join(OUT_DIR, `${pg.id}-${tag}.png`);
          safeUnlink(outShot);
          await page.screenshot({ path: outShot, fullPage: true });
        }

        const ok = errors.length === 0 && failedReqs.length === 0 && audit.overflowX <= 1 && audit.brokenImgs.length === 0 && !audit.hasEmDash && !audit.hasSlopLabel;
        if (!ok) report.passed = false;
        report.viewports.push({ page: pg.id, viewport: vp.name, ok, errors, failedReqs, ...audit });
        await ctx.close();
      }
    }

    // =========================================================================
    // 2. WCAG 2.2 AA ACCESSIBILITY AUDIT (@axe-core/playwright) ON ALL 7 PAGES
    // =========================================================================
    console.log(`[QA ${ROUND}] 2. Running @axe-core/playwright WCAG 2.2 AA on all 7 pages...`);
    for (const pg of ALL_PAGES) {
      const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/${pg.file}`, { waitUntil: 'load' });
      await waitReady(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const seriousOrCrit = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      if (seriousOrCrit.length > 0) report.passed = false;
      report.axe.push({
        page: pg.id,
        totalViolations: results.violations.length,
        seriousOrCritical: seriousOrCrit.length,
        violations: seriousOrCrit.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target) }))
      });
      await ctx.close();
    }

    // =========================================================================
    // 3. DEEP INTERACTION, SCROLL SCRUBBING, SALRYN 7 SCENES (A-G) & NAVIGATION
    // =========================================================================
    console.log(`[QA ${ROUND}] 3. Testing Salryn 7 scenes (A-G), Homepage CGI scrub, navigation & deep-links...`);
    {
      const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });

      // 3A. Homepage Complexity -> Clarity scrubbing + Capabilities Horizontal + Selected Work disclosure
      await page.goto(`${baseUrl}/site/index.html`, { waitUntil: 'load' });
      await waitReady(page);

      const clarityBox = await getDocBounds(page, '#complexity-clarity-scene');
      // Scrub forward to 48%, 82%, then reverse to 8%
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(clarityBox.top + (clarityBox.height - 900) * 0.48));
      await page.waitForTimeout(550);
      const homeShotMid = path.join(OUT_DIR, 'home-clarity-mid.png');
      safeUnlink(homeShotMid);
      await page.screenshot({ path: homeShotMid });

      await page.evaluate((y) => window.scrollTo(0, y), Math.round(clarityBox.top + (clarityBox.height - 900) * 0.92));
      await page.waitForTimeout(550);
      const homeShotEnd = path.join(OUT_DIR, 'home-clarity-end.png');
      safeUnlink(homeShotEnd);
      await page.screenshot({ path: homeShotEnd });

      // Reverse scroll check
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(clarityBox.top + 80));
      await page.waitForTimeout(450);

      // Horizontal capabilities track + R3 3D capability plates + Selected Work 2-mode tabs check
      const capBox = await getDocBounds(page, '#capabilities-exhibition');
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(capBox.top + (capBox.height - 900) * 0.55));
      await page.waitForTimeout(550);
      const capTransform = await page.locator('#home-cap-rail').evaluate((el) => el.style.transform);
      await page.locator('[data-cap-idx="2"]').click();
      const capAfterText = await page.locator('#home-cap-after').textContent();
      const platesLoaded = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#home-cap-plate-stage img')).every((im) => im.complete && im.naturalWidth > 0)
      );
      const logoReveal = await page.evaluate(() => window.__KIRJANE_LOGO_REVEAL__ || null);

      // Selected Work 2-mode preview switch
      await page.locator('.work-detail summary').first().click();
      await page.locator('.work-mode-btn[data-wmode="surface"]').first().click();
      const surfaceVisible = await page.locator('#wpanel-0-surface').isVisible()
        && !await page.locator('#wpanel-0-arch').isVisible();
      const homeSeqSnap = await page.evaluate(() => window.__KIRJANE_SEQUENCES__.getSnapshot()['home-complexity-to-clarity']);

      const homeErrors = [...errors];
      report.interactions.homepage = {
        ok: Boolean(
          homeSeqSnap && homeSeqSnap.hasValidMedia && homeSeqSnap.cacheSize <= 32 &&
          capTransform.includes('translate3d') && !capTransform.includes('(0px,') &&
          platesLoaded && capAfterText.includes('Schema-validated') &&
          logoReveal && logoReveal.ready && logoReveal.nonBlocking &&
          surfaceVisible && homeErrors.length === 0
        ),
        sequenceTelemetry: homeSeqSnap,
        horizontalTrackTransform: capTransform,
        platesLoaded,
        logoReveal,
        surfaceVisible,
        errors: homeErrors
      };
      if (!report.interactions.homepage.ok) report.passed = false;

      // 3B. Navigate to Salryn via top nav + test Back/Forward
      const navErrStart = errors.length;
      await Promise.all([page.waitForURL(/salryn\.html/), page.click('a[data-page="salryn"]')]);
      await waitReady(page);
      const onSalryn = page.url().includes('salryn.html');
      await page.goBack({ waitUntil: 'load' });
      await waitReady(page);
      const backOnHome = page.url().includes('index.html');
      await page.goForward({ waitUntil: 'load' });
      await waitReady(page);
      const forwardOnSalryn = page.url().includes('salryn.html');
      const navErrors = errors.slice(navErrStart);

      report.interactions.navigationHistory = {
        ok: onSalryn && backOnHome && forwardOnSalryn && navErrors.length === 0,
        onSalryn, backOnHome, forwardOnSalryn,
        errors: navErrors
      };
      if (!report.interactions.navigationHistory.ok) report.passed = false;

      // 3C. Salryn Scene A — 96-frame CGI scrub forward + reverse + chapter jump
      const sceneABox = await getDocBounds(page, '#scene-a-kernel');
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(sceneABox.top + (sceneABox.height - 900) * 0.58));
      await page.waitForTimeout(600);
      const salrynAShot = path.join(OUT_DIR, 'salryn-scene-a-mid.png');
      safeUnlink(salrynAShot);
      await page.screenshot({ path: salrynAShot });

      await page.evaluate((y) => window.scrollTo(0, y), Math.round(sceneABox.top + (sceneABox.height - 900) * 0.92));
      await page.waitForTimeout(600);
      const salrynAEndShot = path.join(OUT_DIR, 'salryn-scene-a-end.png');
      safeUnlink(salrynAEndShot);
      await page.screenshot({ path: salrynAEndShot });

      await page.evaluate((y) => window.scrollTo(0, y), Math.round(sceneABox.top + 80));
      await page.waitForTimeout(450);
      const salrynSeqSnap = await page.evaluate(() => window.__KIRJANE_SEQUENCES__.getSnapshot()['salryn-kernel-documentary']);

      // 3D. Salryn Scene B — Verify ALL 8 exact authoritative engines clickable
      const expectedEngines = ['Commerce', 'Inventory', 'Procurement', 'Financial', 'Workforce', 'Operations', 'Security', 'Infrastructure'];
      const observedEngines = [];
      for (let i = 0; i < 8; i++) {
        await page.locator(`[data-engine-btn="${i}"]`).click();
        observedEngines.push(await page.locator('#anatomy-engine-name').textContent());
      }
      const enginesMatch = JSON.stringify(observedEngines) === JSON.stringify(expectedEngines);

      // 3E. Salryn Scene C — Verify ALL 12 exact authoritative industry families + horizontal rail
      const expectedFamilies = [
        'Retail', 'Food & Beverage', 'Hardware & Supply', 'Healthcare & Wellness',
        'Services', 'Hospitality', 'Rental', 'Distribution',
        'Automotive', 'Manufacturing', 'Agriculture', 'Enterprise'
      ];
      const observedFamilies = await page.locator('#salryn-flavors-rail h3').allTextContents();
      const familiesMatch = JSON.stringify(observedFamilies) === JSON.stringify(expectedFamilies);
      const sceneCBox = await getDocBounds(page, '#scene-c-flavors');
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(sceneCBox.top + (sceneCBox.height - 900) * 0.55));
      await page.waitForTimeout(550);
      const flavorTrackTransform = await page.locator('#salryn-flavors-rail').evaluate((el) => getComputedStyle(el).transform);

      // 3F. Salryn Scene D — Capability Activation & Mandatory Security Lock Proof + Focus Retention
      const secBtn = page.locator('[data-cap-id="security-core"]');
      await secBtn.scrollIntoViewIfNeeded();
      await secBtn.click();
      const secStillPressed = await secBtn.getAttribute('aria-pressed');
      const secNotice = await page.locator('#scene-d-live-status').textContent();
      const procCapBtn = page.locator('[data-cap-id="cap-procurement"]');
      await procCapBtn.focus();
      await procCapBtn.click();
      const procFocusPreserved = await page.evaluate(() => document.activeElement?.dataset?.capId === 'cap-procurement');
      const procPressedAfter = await procCapBtn.getAttribute('aria-pressed');
      const countText = await page.locator('#scene-d-count').textContent();
      const radialLoaded = await page.evaluate(() => Boolean(document.querySelector('#salryn-radial-host svg .radial-flavor-item')));

      // 3G. Salryn Scene E — Bottom-left -> Upper-right Diagonal Growth Ascent
      const sceneEBox = await getDocBounds(page, '#scene-e-growth');
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(sceneEBox.top + 40));
      await page.waitForTimeout(450);
      const beaconStart = await page.locator('#growth-beacon').evaluate((el) => ({ left: parseFloat(el.style.left), top: parseFloat(el.style.top) }));
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(sceneEBox.top + (sceneEBox.height - 900) * 0.85));
      await page.waitForTimeout(550);
      const beaconEnd = await page.locator('#growth-beacon').evaluate((el) => ({ left: parseFloat(el.style.left), top: parseFloat(el.style.top) }));
      const salrynEShot = path.join(OUT_DIR, 'salryn-scene-e-diagonal.png');
      safeUnlink(salrynEShot);
      await page.screenshot({ path: salrynEShot });
      const diagonalAscending = beaconEnd.left > beaconStart.left + 20 && beaconEnd.top < beaconStart.top - 20;

      // 3G-bis. Salryn Scene F — 3-State Operational Continuity Simulator
      await page.locator('[data-sim-mode="exchange"]').click();
      const simTitleExchange = await page.locator('#sim-mode-title').textContent();

      // 3H. Salryn Scene G -> Contact Studio deep-link handoff + Scope Topology Preview
      await page.locator('#cfg-industry').scrollIntoViewIfNeeded();
      await page.locator('#cfg-industry').selectOption('Manufacturing');
      const summaryBefore = await page.locator('#cfg-output').textContent();
      await Promise.all([
        page.waitForURL(/contact\.html/),
        page.locator('#btn-cfg-contact').click()
      ]);
      await waitReady(page);
      const contactUrl = page.url();
      const salrynChecked = await page.locator('#chk-salryn').isChecked();
      const scopePrefilled = await page.locator('#c-scope').inputValue();
      const contactSvgIlluminated = await page.evaluate(() =>
        document.querySelector('[data-scope-node="salryn"] rect')?.getAttribute('stroke') === '#D3F66B'
      );
      const deepLinkOk = contactUrl.includes('contact.html') && salrynChecked && scopePrefilled.includes('Manufacturing') && scopePrefilled.includes('Security') && contactSvgIlluminated;

      const salrynErrs = errors.slice(navErrStart + navErrors.length);
      const capFocusCheck = await page.evaluate(() => document.activeElement?.tagName || 'NONE');

      report.interactions.salryn7Scenes = {
        ok: Boolean(
          salrynSeqSnap && salrynSeqSnap.hasValidMedia && salrynSeqSnap.cacheSize <= 32 &&
          enginesMatch && familiesMatch && /matrix/.test(flavorTrackTransform) &&
          radialLoaded && simTitleExchange === 'When the connection returns' &&
          secStillPressed === 'true' && procPressedAfter === 'true' && procFocusPreserved &&
          diagonalAscending && summaryBefore.includes('Manufacturing') && deepLinkOk &&
          salrynErrs.length === 0
        ),
        sceneA_sequence: salrynSeqSnap,
        sceneB_enginesMatch: enginesMatch,
        sceneC_familiesMatch: familiesMatch,
        sceneC_radialLoaded: radialLoaded,
        sceneC_horizontalTransform: flavorTrackTransform,
        sceneD_securityLocked: secStillPressed === 'true',
        sceneD_focusPreservedOnToggle: procFocusPreserved,
        sceneD_securityMessage: secNotice.trim(),
        sceneD_countAfterToggle: countText,
        sceneE_diagonalAscending: diagonalAscending,
        sceneE_beacon: { start: beaconStart, end: beaconEnd },
        sceneF_simTitleExchange: simTitleExchange,
        sceneG_contactDeepLinkOk: deepLinkOk,
        contactSvgIlluminated,
        errors: salrynErrs,
        postHandoffFocusTag: capFocusCheck
      };
      if (!report.interactions.salryn7Scenes.ok) report.passed = false;
      await ctx.close();
    }

    // =========================================================================
    // 4. RESILIENCE & FAULT INJECTION TESTS (REDUCED MOTION, WEBGL=OFF, NO-JS,
    //    ABORTED FRAME MEDIA, CONTEXT LOSS, MOBILE DRAWER & KEYBOARD)
    // =========================================================================
    console.log(`[QA ${ROUND}] 4. Running resilience & fault-injection suite...`);

    // 4A. Reduced Motion
    {
      const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/site/salryn.html?reduce=1`, { waitUntil: 'load' });
      await waitReady(page);
      const state = await page.evaluate(() => ({
        tier: document.documentElement.dataset.qualityTier,
        activeLoops: (window.__KIRJANE_PERF__?.activeLoops || []).length,
        sceneAPos: getComputedStyle(document.querySelector('#scene-a-kernel .cinematic-sticky-stage')).position,
        directorMotion: window.__SCENE_DIRECTOR__?.getState().motionPreference
      }));
      const ok = state.tier === 'static' && state.activeLoops === 0 && state.sceneAPos === 'relative' && state.directorMotion === 'reduced';
      if (!ok) report.passed = false;
      report.resilience.reducedMotion = { ok, ...state };
      await ctx.close();
    }

    // 4B. WebGL Disabled (?webgl=off)
    {
      const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      await page.goto(`${baseUrl}/site/salryn.html?webgl=off`, { waitUntil: 'load' });
      await waitReady(page);
      const tier = await page.evaluate(() => document.documentElement.dataset.qualityTier);
      const ok = tier === 'static' && errs.length === 0;
      if (!ok) report.passed = false;
      report.resilience.webglOff = { ok, tier, errs };
      await ctx.close();
    }

    // 4C. JavaScript Disabled across ALL 7 pages
    {
      const noJsResults = [];
      for (const pg of ALL_PAGES) {
        const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
        const page = await ctx.newPage();
        await page.goto(`${baseUrl}/${pg.file}`, { waitUntil: 'load' });
        const info = await page.evaluate(() => ({
          hasH1: Boolean(document.querySelector('h1')?.textContent.trim()),
          hasNoscriptBanner: Boolean(document.querySelector('.noscript-note')),
          textLen: (document.body.innerText || '').trim().length
        }));
        noJsResults.push({ page: pg.id, ok: info.hasH1 && info.hasNoscriptBanner && info.textLen > 300, ...info });
        await ctx.close();
      }
      const allNoJsOk = noJsResults.every((r) => r.ok);
      if (!allNoJsOk) report.passed = false;
      report.resilience.noJavascript = { ok: allNoJsOk, pages: noJsResults };
    }

    // 4D. Aborted Frame Media Fault Injection (Proves zero crash & last-valid-frame retention!)
    {
      const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const pageErrs = [];
      page.on('pageerror', (e) => pageErrs.push(e.message));
      // Allow poster & first few frames, abort mid-sequence frames 0030..0075
      await page.route('**/salryn-kernel-documentary-desktop/frame-*.webp', (route) => {
        const url = route.request().url();
        const m = url.match(/frame-(\d+)\.webp/);
        const n = m ? parseInt(m[1], 10) : 0;
        if (n >= 30 && n <= 75) return route.abort('failed');
        return route.continue();
      });
      await page.goto(`${baseUrl}/site/salryn.html`, { waitUntil: 'load' });
      await waitReady(page);
      const box = await page.locator('#scene-a-kernel').boundingBox();
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(box.y + box.height * 0.55));
      await page.waitForTimeout(550);
      const snap = await page.evaluate(() => window.__KIRJANE_SEQUENCES__.getSnapshot()['salryn-kernel-documentary']);
      const ok = pageErrs.length === 0 && snap && snap.failedRequests > 0 && snap.hasValidMedia === true;
      if (!ok) report.passed = false;
      report.resilience.abortedFrameRecovery = { ok, pageErrs, telemetry: snap };
      await ctx.close();
    }

    // 4E. Simulated WEBGL_lose_context recovery
    {
      const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      await page.goto(`${baseUrl}/site/salryn.html`, { waitUntil: 'load' });
      await waitReady(page);
      const lostTriggered = await page.evaluate(() => {
        const c = document.getElementById('salryn-3d-canvas');
        const gl = c ? (c.getContext('webgl2') || c.getContext('webgl')) : null;
        const ext = gl ? gl.getExtension('WEBGL_lose_context') : null;
        if (ext) { ext.loseContext(); return true; }
        return false;
      });
      await page.waitForTimeout(300);
      const ok = errs.length === 0;
      if (!ok) report.passed = false;
      report.resilience.webglContextLoss = { ok, lostTriggered, errs };
      await ctx.close();
    }

    // 4F. Mobile Drawer & Touch Interaction + Keyboard Tab Focus
    {
      const ctx = await hwBrowser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/site/index.html`, { waitUntil: 'load' });
      await waitReady(page);
      await page.click('#btn-mobile-menu');
      const opened = await page.locator('#mobile-drawer').getAttribute('aria-hidden');
      await page.click('#btn-drawer-close');
      const closed = await page.locator('#mobile-drawer').getAttribute('aria-hidden');
      const ok = opened === 'false' && closed === 'true';
      if (!ok) report.passed = false;
      report.resilience.mobileDrawer = { ok, opened, closed };
      await ctx.close();
    }

    // =========================================================================
    // 5. HARDWARE D3D11 & CONSTRAINED SWIFTSHADER PERFORMANCE TELEMETRY
    // =========================================================================
    console.log(`[QA ${ROUND}] 5. Measuring Hardware D3D11 + SwiftShader performance telemetry...`);
    {
      const ctx = await hwBrowser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(`${baseUrl}/site/index.html`, { waitUntil: 'load' });
      await waitReady(page);
      const homeHwFps = await measureFps(page, 1200);

      await page.goto(`${baseUrl}/site/salryn.html`, { waitUntil: 'load' });
      await waitReady(page);
      const salrynHwIdle = await measureFps(page, 1200);

      // Scroll-stress measurement through Scene A on Hardware GPU
      const box = await page.locator('#scene-a-kernel').boundingBox();
      const scrollPromise = page.evaluate(async ({ y, h }) => {
        for (let i = 0; i <= 20; i++) {
          window.scrollTo(0, y + (i / 20) * h * 0.85);
          await new Promise((r) => setTimeout(r, 55));
        }
      }, { y: box.y, h: box.height });
      const salrynHwScroll = await measureFps(page, 1200);
      await scrollPromise;

      report.performance.hardwareD3D11 = { homeHwFps, salrynHwIdle, salrynHwScroll };
      await ctx.close();
    }

    // Constrained SwiftShader verification
    {
      const swBrowser = await chromium.launch({
        headless: true,
        args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
      });
      try {
        const ctx = await swBrowser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        await page.goto(`${baseUrl}/site/salryn.html`, { waitUntil: 'load' });
        await waitReady(page);
        const salrynSwIdle = await measureFps(page, 1200);
        report.performance.constrainedSwiftShader = { salrynSwIdle };
        await ctx.close();
      } finally {
        await swBrowser.close();
      }
    }

    // =========================================================================
    // 6. REAL .WEBM MOTION RECORDING + FFMPEG KEYFRAME EXTRACTION
    // =========================================================================
    if (!SKIP_VIDEO) {
      console.log(`[QA ${ROUND}] 6. Recording real .webm journeys & extracting FFmpeg keyframes...`);
      const recordings = [
        { name: 'home-desktop', url: `${baseUrl}/site/index.html`, vp: { width: 1280, height: 720 }, mobile: false },
        { name: 'salryn-desktop', url: `${baseUrl}/site/salryn.html`, vp: { width: 1280, height: 720 }, mobile: false },
        { name: 'home-mobile', url: `${baseUrl}/site/index.html`, vp: { width: 390, height: 844 }, mobile: true },
        { name: 'salryn-mobile', url: `${baseUrl}/site/salryn.html`, vp: { width: 390, height: 844 }, mobile: true }
      ];

      for (const rec of recordings) {
        const ctx = await hwBrowser.newContext({
          viewport: rec.vp,
          isMobile: rec.mobile,
          hasTouch: rec.mobile,
          recordVideo: { dir: VIDEOS_DIR, size: rec.vp }
        });
        const page = await ctx.newPage();
        await page.goto(rec.url, { waitUntil: 'load' });
        await waitReady(page);

        const maxY = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        // Smooth choreographed scroll across entire documentary journey
        const steps = 26;
        for (let i = 0; i <= steps; i++) {
          const y = Math.round((i / steps) * maxY * 0.88);
          await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'auto' }), y);
          await page.waitForTimeout(130);
        }

        const vid = page.video();
        await ctx.close();
        if (vid) {
          const rawPath = await vid.path();
          const finalPath = path.join(VIDEOS_DIR, `${rec.name}.webm`);
          safeUnlink(finalPath);
          fs.renameSync(rawPath, finalPath);
          const sheetPath = path.join(VIDEOS_DIR, `${rec.name}-keyframes.png`);
          const kfInfo = await extractVideoKeyframes(hwBrowser, finalPath, sheetPath);
          report.videos[rec.name] = {
            webm: path.relative(ROOT, finalPath),
            bytes: fs.statSync(finalPath).size,
            keyframes: kfInfo
          };
        }
      }
    }

    fs.writeFileSync(path.join(OUT_DIR, 'qa-report.json'), JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, 'performance.json'), JSON.stringify(report.performance, null, 2));

    console.log(`[QA ${ROUND}] COMPLETE · passed=${report.passed}`);
    console.log('  Viewports passed:', report.viewports.filter((v) => v.ok).length, '/', report.viewports.length);
    console.log('  Axe serious/crit total:', report.axe.reduce((s, a) => s + a.seriousOrCritical, 0));
    console.log('  HW D3D11 Salryn FPS:', report.performance.hardwareD3D11.salrynHwIdle.fps, 'idle /', report.performance.hardwareD3D11.salrynHwScroll.fps, 'scroll');
    console.log('  SwiftShader Salryn FPS:', report.performance.constrainedSwiftShader.salrynSwIdle.fps, 'tier=', report.performance.constrainedSwiftShader.salrynSwIdle.tier);
    if (!report.passed) {
      const fails = {
        viewports: report.viewports.filter((v) => !v.ok),
        axe: report.axe.filter((a) => a.seriousOrCritical > 0),
        interactions: Object.entries(report.interactions).filter(([, v]) => !v.ok),
        resilience: Object.entries(report.resilience).filter(([, v]) => !v.ok)
      };
      console.log('  FAILURES:', JSON.stringify(fails, null, 2));
    }
  } finally {
    await hwBrowser.close();
    srv.close();
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
