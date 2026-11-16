#!/usr/bin/env python3
"""M04 gallery visual, interaction, fallback QA, using approved inlined site sources.

This does not replace real-host Windows browser verification.
"""
from __future__ import annotations
import base64, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa/r3-gallery'
OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index.html').read_text(encoding='utf-8')
html=re.sub(r'<link rel="preconnect"[^>]+>', '', html)
html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]+>', '', html)
html=re.sub(r'<link rel="preload"[^>]+>', '', html)
for css in ('site.css','r3-home.css'):
    html=html.replace(f'<link rel="stylesheet" href="/assets/css/{css}">',f'<style>{(ROOT/'assets/css'/css).read_text(encoding="utf-8")}</style>')
for js in ('site.js','r3-home.js'):
    html=html.replace(f'<script src="/assets/js/{js}" defer></script>','')
for filename in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
    raw=(ROOT/'assets/visuals'/filename).read_bytes()
    html=html.replace('/assets/visuals/'+filename,'data:image/webp;base64,'+base64.b64encode(raw).decode())

js_scripts=[(ROOT/'assets/js'/s).read_text(encoding='utf-8') for s in ('site.js','r3-home.js')]
results=[]

with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    combos=[(320,760,'motion'),(390,844,'motion'),(768,1024,'motion'),(1024,768,'motion'),(1440,900,'motion'),(1920,1080,'motion'),(1440,600,'motion'),(390,844,'reduce'),(1440,900,'reduce'),(390,844,'nojs'),(1440,900,'nojs')]
    for w,h,kind in combos:
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='reduce' if kind=='reduce' else 'no-preference')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded')
        if kind != 'nojs':
            for script in js_scripts:page.evaluate(script)
        page.wait_for_timeout(100)
        metrics=page.evaluate('''() => {
          const root=document.querySelector('#home-projects');
          const pieces=[...root.querySelectorAll('[data-r3-gallery-piece]')];
          const disclosures=pieces.map(x=>x.querySelector('details'));
          const rects=pieces.map(x=>x.getBoundingClientRect());
          const imageRects=pieces.map(x=>x.querySelector('.r3-gallery-image').getBoundingClientRect());
          const headings=pieces.map(x=>x.querySelector('h3').getBoundingClientRect());
          const imgs=pieces.map(x=>x.querySelector('img'));
          const sl=(r)=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height});
          return {section:!!root,bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,
           h1:document.querySelectorAll('h1').length,pieces:pieces.length,
           imgNames:imgs.map(x=>x.src.slice(0,25)),imagesLoaded:imgs.every(x=>x.complete&&x.naturalWidth>0),
           rects:rects.map(sl),images:imageRects.map(sl),headings:headings.map(sl),
           detailsVisible:disclosures.every(x=>!x.hasAttribute('hidden')),summary:disclosures.every(x=>!!x.querySelector('summary')),
           nonPinned:getComputedStyle(root).position!=='sticky' && getComputedStyle(root).position!=='fixed',
           enhanced:document.documentElement.classList.contains('r3-gallery-motion-enabled')
          };
        }''')
        assert metrics['section'] and metrics['pieces']==2 and metrics['h1']==1,(w,h,metrics)
        # Lazy WebP artwork is intentionally not loaded before its chapter is near the viewport.
        assert metrics['bodyWidth'] <= w+1,(w,h,'overflow',metrics['bodyWidth'])
        assert metrics['nonPinned'] and metrics['detailsVisible'] and metrics['summary'],(w,h,metrics)
        assert metrics['rects'][1]['top']>metrics['rects'][0]['bottom'],(w,h,'overlap',metrics['rects'])
        if w>850:
            assert metrics['rects'][0]['width']>metrics['rects'][1]['width'],(w,h,'not asymmetric',metrics['rects'])
            assert metrics['rects'][0]['left']<metrics['rects'][1]['left'],(w,h,'left/right',metrics['rects'])
        else:
            assert abs(metrics['rects'][0]['width']-metrics['rects'][1]['width'])<=max(20,w*.05),(w,h,metrics)
        for img,head in zip(metrics['images'],metrics['headings']):
            assert head['left']>=img['left']-2 and head['right']<=img['right']+3,(w,h,'heading x',img,head)
            assert head['top']>=img['top']-2 and head['bottom']<=img['bottom']+3,(w,h,'heading y',img,head)
        assert metrics['enhanced']==(kind=='motion'),(w,h,'enhancement state',metrics['enhanced'])
        for i in range(2):
            node=page.locator('[data-r3-gallery-piece]').nth(i)
            node.scroll_into_view_if_needed()
            page.wait_for_function('(index) => {const img=document.querySelectorAll("[data-r3-gallery-piece] img")[index]; return img.complete && img.naturalWidth > 0}',arg=i,timeout=10000)
            page.wait_for_timeout(110)
            if kind=='motion':
                assert node.evaluate('(x)=>x.classList.contains("is-revealed")'),(w,h,'not revealed',i)
            # The disclosure must always respond to native keyboard interaction.
        summaries=page.locator('.r3-gallery-disclosure summary')
        summaries.nth(0).focus()
        page.keyboard.press('Enter')
        page.wait_for_timeout(90)
        assert page.locator('.r3-gallery-disclosure').nth(0).evaluate('(e)=>e.open'),(w,h,'first not open')
        summaries.nth(1).focus()
        page.keyboard.press('Space')
        page.wait_for_timeout(100)
        state=page.locator('.r3-gallery-disclosure').evaluate_all('(els)=>els.map(x=>x.open)')
        assert state[1],(w,h,'second not open',state)
        if kind!='nojs':
            assert state==[False,True],(w,h,'not exclusive',state)
            selected=page.locator('[data-r3-gallery]').get_attribute('data-r3-gallery-selected')
            assert selected=='1',(w,h,'selected',selected)
            assert page.locator('.r3-gallery-piece-second').evaluate('(e)=>e.classList.contains("is-selected")'),(w,h,'selection class')
        else:
            assert state==[True,True],(w,h,'native details independence',state)
        # Closing the selected item should clear the emphasis.
        if kind != 'nojs':
            summaries.nth(1).click()
            page.wait_for_timeout(90)
            assert page.locator('[data-r3-gallery]').get_attribute('data-r3-gallery-selected') is None,(w,h,'selection stuck')
        if w==1440 and kind=='motion':
            page.evaluate('document.activeElement?.blur()')
            page.locator('#home-projects').scroll_into_view_if_needed()
            page.wait_for_timeout(1000)
            page.locator('#home-projects').screenshot(path=str(OUT/'gallery-1440-full.png'),animations='disabled',style='.skip-link,.scroll-progress{visibility:hidden!important}')
            page.locator('.r3-gallery-piece-first .r3-gallery-image').screenshot(path=str(OUT/'gallery-1440-w01.png'),animations='disabled')
            page.locator('.r3-gallery-piece-second .r3-gallery-image').screenshot(path=str(OUT/'gallery-1440-w02.png'),animations='disabled')
        if w==390 and kind=='motion':
            page.evaluate('document.activeElement?.blur()')
            page.locator('#home-projects').scroll_into_view_if_needed()
            page.wait_for_timeout(1000)
            page.locator('#home-projects').screenshot(path=str(OUT/'gallery-390-full.png'),animations='disabled',style='.skip-link,.scroll-progress{visibility:hidden!important}')
        assert not errors,(w,h,errors)
        results.append({'viewport':f'{w}x{h}','mode':kind,'pass':True,'nonPinned':metrics['nonPinned'],'asymmetric': w>850,'imgLoaded':True,'controlsKeyboard':True,'consoleErrors':errors})
        page.close()
    browser.close()

(OUT/'results.json').write_text(json.dumps({'total':len(combos),'passed':len(results),'tests':results},indent=2),encoding='utf-8')
print('R3 M04 gallery QA PASS',len(results),'/',len(combos))
