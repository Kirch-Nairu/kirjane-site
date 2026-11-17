#!/usr/bin/env python3
"""Actual HTTP mobile touch-browser gate; no inlined HTML or simulated results."""
import json
import functools
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'qa/mobile-native'
OUT.mkdir(parents=True, exist_ok=True)
ROUTES = ['/', '/services/', '/projects/', '/about/', '/process/', '/contact/', '/404.html']
SIZES = [(280, 700), (320, 568), (390, 844), (430, 932), (680, 900)]
server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
origin = f'http://127.0.0.1:{server.server_port}'
results = []

def record(page, route, width, height, reduced):
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    response = page.goto(origin + route, wait_until='domcontentloaded', timeout=20000)
    assert response and response.ok, f'HTTP {route}'
    page.evaluate("Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,2500))])")
    page.wait_for_timeout(1200 if not reduced else 70)
    geometry = page.evaluate("""() => ({
      viewport: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth,
      body: document.body.scrollWidth - innerWidth,
      h1: document.querySelectorAll('h1').length,
      tooWide: [...document.querySelectorAll('main h1,main h2,main h3,main p,main button,main summary')].filter(e=>{
        const r=e.getBoundingClientRect(); if(!r.width||!r.height||e.closest('[aria-hidden=true]'))return false;
        const range=document.createRange();range.selectNodeContents(e);const t=range.getBoundingClientRect();
        return r.right>innerWidth+2||r.left< -2||t.right>innerWidth+2||t.left< -2;
      }).map(e=>e.textContent.trim().slice(0,80))
    })""")
    assert geometry['viewport'] == width and geometry['overflow'] <= 1 and geometry['body'] <= 1 and geometry['h1'] == 1 and not geometry['tooWide'], geometry
    toggle = page.locator('.menu-toggle')
    toggle.tap(timeout=5000)
    nav = page.locator('#site-navigation')
    assert toggle.get_attribute('aria-expanded') == 'true'
    assert nav.evaluate("e=>e.getBoundingClientRect().bottom<=innerHeight+2")
    assert nav.locator('a').evaluate_all("a=>a.every(e=>e.getBoundingClientRect().height>=44)")
    toggle.tap(timeout=5000)
    assert toggle.get_attribute('aria-expanded') == 'false'
    assert page.locator('footer nav a').evaluate_all("a=>a.every(e=>e.getBoundingClientRect().height>=44)")
    if route == '/':
        assert page.locator('.hero-links .button').evaluate("e=>e.getBoundingClientRect().height>=48")
        tabs = page.locator('[data-service-select]')
        for index in range(4):
            tabs.nth(index).tap(timeout=5000)
            assert tabs.nth(index).get_attribute('aria-selected') == 'true'
            assert 'is-current' in (page.locator(f'[data-service-scene="{index}"]').get_attribute('class') or '')
        stage_data = page.evaluate("""() => {
          const r=s=>document.querySelector(s).getBoundingClientRect();
          let a=r('.r3-service-visuals'), d=r('.r3-service-detail'), p=r('.r3-process-art');
          return {serviceWidth:a.width, serviceHeight:a.height, detailHeight:d.height, processWidth:p.width, processHeight:p.height, processFit:getComputedStyle(document.querySelector('.r3-process-art-base')).objectFit};
        }""")
        assert abs(stage_data['serviceWidth']-width)<2 and stage_data['serviceHeight']>=280 and abs(stage_data['detailHeight']-stage_data['serviceHeight'])<2, stage_data
        assert abs(stage_data['processWidth']-width)<2 and abs(stage_data['processHeight']-width*9/16)<2 and stage_data['processFit']=='contain', stage_data
        steps = page.locator('[data-r3-process-step]')
        for index in range(5):
            steps.nth(index).tap(timeout=5000)
            assert steps.nth(index).get_attribute('aria-current') == 'step'
        assert steps.evaluate_all("a=>a.every(e=>e.getBoundingClientRect().height>=48)")
        summaries = page.locator('.r3-gallery-disclosure summary')
        for index in range(summaries.count()):
            summaries.nth(index).tap(timeout=5000)
            assert summaries.nth(index).evaluate("e=>e.parentElement.open")
        if width == 390 and not reduced:
            for name, selector in [('hero','.home-hero'),('services','.r3-services-stage'),('process','.r3-process-stage'),('projects','.r3-gallery-home'),('about','.about-home'),('contact','.closing-cta')]:
                page.locator(selector).screenshot(path=str(OUT/f'{name}-390.png'),animations='disabled',timeout=12000)
    if width == 390 and not reduced and route != '/':
        page.screenshot(path=str(OUT/f"{route.strip('/').replace('.html','')}-390.png"),animations='disabled')
    assert not errors, errors
    return geometry

try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        for route in ROUTES:
            for width, height in SIZES:
                for reduced in ([False, True] if width == 390 and route == '/' else [False]):
                    context = browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=True,has_touch=True,reduced_motion='reduce' if reduced else 'no-preference')
                    page = context.new_page()
                    item = {'route':route,'viewport':f'{width}x{height}','reduced_motion':reduced}
                    try:
                        item['geometry'] = record(page,route,width,height,reduced)
                        item['pass'] = True
                    except Exception as exc:
                        item['pass'] = False
                        item['error'] = str(exc)
                        print('FAIL', item, flush=True)
                    finally:
                        results.append(item)
                        context.close()
                        (OUT/'results.json').write_text(json.dumps(results,indent=2)+'\n')
            print(route, 'complete', flush=True)
        browser.close()
finally:
    server.shutdown()
print(f"Mobile native HTTP QA: {sum(x['pass'] for x in results)}/{len(results)} PASS")
assert len(results)==36 and all(x['pass'] for x in results)
