#!/usr/bin/env python3
"""R3-M04 owner chameleon watermark acceptance: actual approved bytes, HTML/CSS/JS.

The test harness inlines image/font-independent page resources because container
Chromium cannot reliably navigate localhost; Windows real-host acceptance remains distinct.
"""
from __future__ import annotations
import base64
import hashlib
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa/r3-chameleon'
OUT.mkdir(parents=True,exist_ok=True)
LOGO=ROOT/'assets/brand/kirjane-logo-green-original.jpg'
SHA='66d782ac8fb372d61bc8f74abb76821254ea5adf4d2c6926f0424fcb04ac666a'
assert LOGO.exists() and hashlib.sha256(LOGO.read_bytes()).hexdigest()==SHA
html=(ROOT/'index.html').read_text(encoding='utf-8')
assert html.count('r3-gallery-chameleon-watermark')==1
html=re.sub(r'<link rel="preconnect"[^>]+>','',html)
html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]+>','',html)
html=re.sub(r'<link rel="preload"[^>]+>','',html)
for css in ('site.css','r3-home.css'):
    src=f'<link rel="stylesheet" href="/assets/css/{css}">'
    assert src in html
    html=html.replace(src,'<style>'+(ROOT/'assets/css'/css).read_text(encoding='utf-8')+'</style>')
for js in ('site.js','r3-home.js'):
    script=f'<script src="/assets/js/{js}" defer></script>'
    assert script in html
    html=html.replace(script,'')
for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
    binary=(ROOT/'assets/visuals'/name).read_bytes()
    html=html.replace('/assets/visuals/'+name,'data:image/webp;base64,'+base64.b64encode(binary).decode())
html=html.replace('/assets/brand/kirjane-logo-green-original.jpg','data:image/jpeg;base64,'+base64.b64encode(LOGO.read_bytes()).decode())
scripts=[(ROOT/'assets/js'/j).read_text(encoding='utf-8') for j in ('site.js','r3-home.js')]
cases=[(320,760,'motion'),(390,844,'motion'),(768,1024,'motion'),(1024,768,'motion'),(1440,900,'motion'),(1920,1080,'motion'),(390,844,'reduce'),(1440,900,'reduce'),(390,844,'nojs')]
results=[]
with sync_playwright() as tools:
    browser=tools.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for w,h,mode in cases:
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='reduce' if mode=='reduce' else 'no-preference')
        errors=[]
        page.on('pageerror', lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded')
        if mode!='nojs':
            for source in scripts:page.evaluate(source)
        page.locator('#home-projects').scroll_into_view_if_needed()
        page.wait_for_function('''() => {const i=document.querySelector(".r3-gallery-chameleon-watermark img");return i.complete&&i.naturalWidth===2048;}''',timeout=10000)
        info=page.evaluate('''() => {
          const sec=document.querySelector('#home-projects');
          const deco=sec.querySelector('.r3-gallery-chameleon-watermark');
          const img=deco.querySelector('img');
          const heading=sec.querySelector('h2');
          const shell=sec.querySelector(':scope > .shell');
          const cs=getComputedStyle(img);
          const rect=e=>{const b=e.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height};};
          return {scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
            imageOK:img.complete&&img.naturalWidth===2048&&img.naturalHeight===2062,
            aria:deco.getAttribute('aria-hidden'), alt:img.getAttribute('alt'),
            pictureCount:sec.querySelectorAll('[data-r3-gallery-piece] img').length,
            clip:cs.clipPath, opacity:parseFloat(cs.opacity),position:getComputedStyle(deco).position,
            pointerEvents:getComputedStyle(deco).pointerEvents,zDecor:getComputedStyle(deco).zIndex,zShell:getComputedStyle(shell).zIndex,logoInShell:deco.parentElement===shell,
            image:rect(img),heading:rect(heading),section:rect(sec),
            bodyOverflow:document.documentElement.scrollWidth>innerWidth+1,
            naturalFlow:getComputedStyle(sec).position!=='fixed',
            state:sec.querySelectorAll('details').length,
            styles:document.querySelectorAll('style').length};
        }''')
        assert not info['bodyOverflow'],(w,h,mode,'horizontal overflow',info)
        assert info['imageOK'] and info['aria']=='true' and info['alt']=='',(w,h,mode,'image',info)
        assert info['pictureCount']==2 and info['state']==2,(w,h,mode,'gallery structure',info)
        assert info['pointerEvents']=='none' and info['zDecor']=='-1' and info['zShell']=='1' and info['logoInShell'],(w,h,mode,'layering',info)
        assert info['position']=='absolute' and info['clip'].startswith('inset('),(w,h,mode,'crop',info)
        expected=.11 if w<=680 else (.14 if w<=850 else .18)
        assert abs(info['opacity']-expected)<.002,(w,h,mode,'opacity',info)
        assert info['naturalFlow'],(w,h,mode,'scroll flow')
        assert not errors,(w,h,mode,'exceptions',errors)
        # Decoration must not intercept actual keyboard/scroll user interactions.
        if mode=='motion':
            summary=page.locator('.r3-gallery-disclosure summary').first
            summary.scroll_into_view_if_needed()
            summary.focus()
            page.keyboard.press('Enter')
            assert page.locator('.r3-gallery-disclosure').first.evaluate('(e)=>e.open'),(w,h,'keyboard inaccessible')
            # return it to closed state for snapshot
            summary.click()
        if (w,mode) in [(1440,'motion'),(390,'motion')]:
            page.evaluate('document.activeElement?.blur()')
            page.locator('#home-projects').screenshot(path=str(OUT/f'chameleon-gallery-{w}.png'),animations='disabled',style='.skip-link,.scroll-progress{visibility:hidden!important}')
        results.append({'viewport':f'{w}x{h}','mode':mode,'pass':True,'image':info['imageOK'],'logoSHA256':SHA,'opacity':info['opacity'],'noHorizontalOverflow':True,'keyboardPass':True,'errors':errors})
        page.close()
    browser.close()
(OUT/'results.json').write_text(json.dumps({'total':len(cases),'passed':len(results),'cases':results},indent=2),encoding='utf-8')
print(f'R3 M04 chameleon QA PASS {len(results)}/{len(cases)}')
