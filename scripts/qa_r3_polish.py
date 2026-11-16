#!/usr/bin/env python3
"""R3 M03 R4 — independent visual-hierarchy and motion-quality checks.

Loads the exact generated homepage and WebPs in an inline Chromium harness because
browser-to-localhost is denied in this sandbox. This is not a network-host test.
"""
import base64
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'qa' / 'r3-process-polish'
OUT.mkdir(parents=True, exist_ok=True)
html = (ROOT / 'index.html').read_text()
html = re.sub(r'<link rel="preconnect"[^>]*>', '', html)
html = re.sub(r'<link href="https://fonts.googleapis.com/[^>]*>', '', html)
html = re.sub(r'<link rel="preload"[^>]*>', '', html)
for css in ('site.css', 'r3-home.css'):
    html = html.replace(f'<link rel="stylesheet" href="/assets/css/{css}">', '<style>' + (ROOT / 'assets/css' / css).read_text() + '</style>')
for js in ('site.js', 'r3-home.js'):
    html = html.replace(f'<script src="/assets/js/{js}" defer></script>', '')
for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)', html)):
    raw = (ROOT / 'assets/visuals' / name).read_bytes()
    html = html.replace('/assets/visuals/' + name, 'data:image/webp;base64,' + base64.b64encode(raw).decode())
scripts = [(ROOT / 'assets/js' / f).read_text() for f in ('site.js', 'r3-home.js')]
rows = []

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
    for width, height in [(1280,720), (1440,900), (1920,1080), (390,844), (960,740), (1440,600)]:
        page = browser.new_page(viewport={'width':width,'height':height}, reduced_motion='no-preference')
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.set_content(html, wait_until='domcontentloaded')
        for script in scripts:
            page.evaluate(script)
        page.wait_for_timeout(100)
        geo = page.evaluate('''() => {
            const t=document.querySelector('[data-r3-process-track]'),s=t.querySelector('.r3-process-stage');
            return {start:t.getBoundingClientRect().top+scrollY,range:t.offsetHeight-s.offsetHeight,
                    active:document.documentElement.classList.contains('r3-process-scroll-active')};
        }''')
        assert geo['active'] == (width>=960 and height>=650 and width/height>=1.5), (width,height,geo)
        stages = []
        for i in range(5):
            if geo['active']:
                y=geo['start']+(i+.5)/5*geo['range']
                page.evaluate('(y) => scrollTo({top:y,behavior:"instant"})',y)
                page.wait_for_timeout(120)
            else:
                page.locator(f'[data-r3-process-step="{i}"]').evaluate('(el)=>el.click()')
                page.wait_for_timeout(55)
            data=page.evaluate('''() => {
                const rect=x=>{const r=document.querySelector(x).getBoundingClientRect();return {top:r.top,bottom:r.bottom}};
                return {active:Number(document.querySelector('.r3-process-step.is-active').dataset.r3ProcessStep),
                        title:document.querySelector('[data-r3-process-title]').textContent,
                        info:rect('.r3-process-detail'),heading:rect('.r3-process-heading-group'),
                        rail:rect('.r3-process-bottom'),
                        introOpacity:parseFloat(getComputedStyle(document.querySelector('.r3-process-heading-group')).opacity),
                        baseFilter:getComputedStyle(document.querySelector('.r3-process-art-base')).filter,
                        spotlightFilter:getComputedStyle(document.querySelector('.r3-process-art-focus')).filter,
                        inactiveColor:getComputedStyle(document.querySelector('.r3-process-step:not(.is-active)')).color,
                        overflow:document.documentElement.scrollWidth>innerWidth+1};
            }''')
            assert data['active'] == i and not data['overflow'] and not errors, (width,height,i,data,errors)
            assert data['heading']['bottom']+5 <= data['info']['top'], (width,height,i,'heading overlap',data)
            assert data['info']['bottom'] <= data['rail']['top']+3, (width,height,i,'rail overlap',data)
            assert 'brightness(0.82)' in data['baseFilter'], (width,height,'art filter',data)
            assert 'brightness(1.38)' in data['spotlightFilter'], (width,height,'spotlight filter',data)
            if geo['active']:
                assert .73 <= data['introOpacity'] <= 1.001, (width,height,i,'intro opacity',data)
            else:
                assert abs(data['introOpacity']-1)<.01, (width,height,i,'fallback heading opacity',data)
            stages.append({'title':data['title'],'introOpacity':round(data['introOpacity'],3)})
            if (width,height) == (1440,900) and i in (0,2,4):
                page.screenshot(path=str(OUT/f'process-stage-{i+1}-1440.png'))
        if geo['active']:
            assert stages[4]['introOpacity'] < stages[0]['introOpacity'] - .15, (width,height,'intro not de-emphasized',stages)
            for i in range(4,-1,-1):
                page.evaluate('(y) => scrollTo({top:y,behavior:"instant"})',geo['start']+(i+.5)/5*geo['range'])
                page.wait_for_timeout(65)
                assert page.locator('.r3-process-step.is-active').get_attribute('data-r3-process-step')==str(i)
        if (width,height)==(390,844):
            page.locator('#home-process').scroll_into_view_if_needed()
            page.screenshot(path=str(OUT/'process-mobile-390.png'))
        rows.append({'viewport':f'{width}x{height}','pass':True,'mode':'pinned' if geo['active'] else 'fallback','stages':stages})
        page.close()
    for mode,js in [('reduce',True),('no-preference',False)]:
        page=browser.new_page(viewport={'width':1440,'height':900},reduced_motion=mode,java_script_enabled=js)
        page.set_content(html, wait_until='domcontentloaded')
        if js:
            for script in scripts:page.evaluate(script)
        data=page.evaluate('''() => ({intro:parseFloat(getComputedStyle(document.querySelector('.r3-process-heading-group')).opacity),
                   visible:document.querySelector('[data-r3-process-title]').getBoundingClientRect().height>0,
                   sticky:document.documentElement.classList.contains('r3-process-scroll-active')})''')
        assert data['visible'] and abs(data['intro']-1)<.01 and not data['sticky'],(mode,js,data)
        if js:
            page.locator('[data-r3-process-step="4"]').click()
            assert page.locator('[data-r3-process-title]').inner_text()=='Deliver & Support'
        rows.append({'mode':mode,'javascript':js,'pass':True})
        page.close()
    browser.close()
(OUT / 'results.json').write_text(json.dumps(rows,indent=2))
print(f'R3 M03 R4 polish QA PASS {len(rows)}/{len(rows)}')
