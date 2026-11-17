#!/usr/bin/env python3
"""R3 M04 R2 chameleon viewport and interaction audit.

Exercises the generated, committed HTML/CSS/JS and original JPG (inlined only because
sandbox Chromium blocks localhost). This is not a Windows real-host audit.
"""
from __future__ import annotations
import base64, hashlib, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa'/'r3-chameleon-viewports';OUT.mkdir(parents=True,exist_ok=True)
LOGO=ROOT/'assets/brand/kirjane-logo-green-original.jpg'
EXPECTED_SHA='66d782ac8fb372d61bc8f74abb76821254ea5adf4d2c6926f0424fcb04ac666a'
assert hashlib.sha256(LOGO.read_bytes()).hexdigest()==EXPECTED_SHA
html=(ROOT/'index.html').read_text(encoding='utf-8')
html=re.sub(r'<link rel="preconnect"[^>]*>','',html)
html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]*>','',html)
html=re.sub(r'<link rel="preload"[^>]*>','',html)
for f in ('site.css','r3-home.css'):
    html=html.replace(f'<link rel="stylesheet" href="/assets/css/{f}">','<style>'+(ROOT/'assets/css'/f).read_text(encoding='utf-8')+'</style>')
for f in ('site.js','r3-home.js'):
    html=html.replace(f'<script src="/assets/js/{f}" defer></script>','')
for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
    raw=(ROOT/'assets/visuals'/name).read_bytes()
    html=html.replace('/assets/visuals/'+name,'data:image/webp;base64,'+base64.b64encode(raw).decode())
html=html.replace('/assets/brand/kirjane-logo-green-original.jpg','data:image/jpeg;base64,'+base64.b64encode(LOGO.read_bytes()).decode())
scripts=[(ROOT/'assets/js'/f).read_text(encoding='utf-8') for f in ('site.js','r3-home.js')]
CASES=[
(280,700,'motion'),(320,760,'motion'),(360,780,'motion'),(390,844,'motion'),
(430,932,'motion'),(600,900,'motion'),(680,900,'motion'),(681,950,'motion'),
(768,1024,'motion'),(820,1180,'motion'),(850,900,'motion'),(851,900,'motion'),
(960,740,'motion'),(1024,768,'motion'),(1280,720,'motion'),(1366,768,'motion'),
(1440,900,'motion'),(1536,864,'motion'),(1920,1080,'motion'),
(2560,1080,'motion'),(3440,1440,'motion'),(1440,600,'motion'),
(390,844,'reduce'),(1440,900,'reduce'),(390,844,'nojs'),(1440,900,'nojs')]
CAPTURES={(320,'motion'),(390,'motion'),(680,'motion'),(768,'motion'),(1024,'motion'),(1440,'motion'),(1920,'motion'),(2560,'motion')}
rows=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for w,h,mode in CASES:
        page=browser.new_page(viewport={'width':w,'height':h}, reduced_motion='reduce' if mode=='reduce' else 'no-preference')
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded')
        if mode!='nojs':
            for script in scripts:page.evaluate(script)
        page.wait_for_function('''() => {const i=document.querySelector(".r3-gallery-chameleon-watermark img");return i.complete && i.naturalWidth===2048 && i.naturalHeight===2062}''',timeout=10000)
        page.locator('#home-projects').scroll_into_view_if_needed()
        # Both approved art images are lazy: bring them into view before measuring
        # decode, so offscreen lazy-loading is never misreported as a broken file.
        for art in page.locator('#home-projects [data-r3-gallery-piece] img').all():
            art.scroll_into_view_if_needed()
        page.wait_for_function("() => [...document.querySelectorAll('#home-projects [data-r3-gallery-piece] img')].every(i=>i.complete && i.naturalWidth>0)", timeout=10000)
        # The brand is intentionally behind content; do not focus a hidden element.
        data=page.evaluate('''() => {
          const sec=document.querySelector('#home-projects');
          const shell=sec.querySelector(':scope > .shell');
          const deco=sec.querySelector('.r3-gallery-chameleon-watermark');
          const img=deco.querySelector('img');
          const cards=[...sec.querySelectorAll('[data-r3-gallery-piece]')];
          const summaries=[...sec.querySelectorAll('.r3-gallery-disclosure summary')];
          const rect=(el)=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
          const style=getComputedStyle(img);const shellStyle=getComputedStyle(shell);
          return {
            viewport:{width:innerWidth,height:innerHeight},section:rect(sec),shell:rect(shell),logo:rect(img),
            logoOwnsOriginalBytes:img.naturalWidth===2048 && img.naturalHeight===2062,
            logoInShell:deco.parentElement===shell,
            docOverflow:document.documentElement.scrollWidth-innerWidth,
            sectionOverflow:sec.scrollWidth-sec.clientWidth,
            chapterHeading:rect(sec.querySelector('h2')),
            cards:cards.map(rect),summaries:summaries.map(rect),
            intrinsic:cards.map(x=>({src:x.querySelector('img').currentSrc.split('/').pop()?.slice(0,30),loaded:x.querySelector('img').naturalWidth>0})),
            opacity:Number(style.opacity),crop:style.clipPath,mask:style.maskImage||style.webkitMaskImage,
            pointer:getComputedStyle(deco).pointerEvents,aria:deco.getAttribute('aria-hidden'),alt:img.getAttribute('alt'),
            decorativeSVG:deco.querySelectorAll('svg').length,decorativeImages:deco.querySelectorAll('img').length,
            zDecor:getComputedStyle(deco).zIndex,zShell:shellStyle.zIndex,
            display:getComputedStyle(img).display,logoLoaded:img.complete,focusables:deco.querySelectorAll('a,button,input,summary,[tabindex]').length,
            background:getComputedStyle(sec).backgroundColor,
            noPin:getComputedStyle(sec).position!=='sticky'&&getComputedStyle(sec).position!=='fixed',
            disclosureCount:sec.querySelectorAll('details').length
          };
        }''')
        id=f'{w}x{h}-{mode}'
        assert data['logoInShell'] and data['logoOwnsOriginalBytes'] and data['logoLoaded'],(id,'source/anchor',data)
        assert data['aria']=='true' and data['alt']=='' and data['focusables']==0 and data['decorativeSVG']==0 and data['decorativeImages']==1,(id,'decorative accessibility',data)
        assert data['pointer']=='none' and data['zDecor']=='-1' and data['zShell']=='1',(id,'stacking',data)
        assert data['docOverflow']<=1 and data['sectionOverflow']<=1,(id,'overflow',data)
        assert data['disclosureCount']==2 and len(data['cards'])==2 and len(data['summaries'])==2 and all(x['loaded'] for x in data['intrinsic']), (id,'gallery integrity',data)
        assert all(x['height']>=44 and x['left']>=-1 and x['right']<=w+1 for x in data['summaries']), (id,'tap targets',data)
        if w>=2200:
            assert data['logo']['right']>80 and data['logo']['left']<data['shell']['left']+80,(id,'ultrawide margin signature',data)
        else:
            assert data['logo']['left']>=data['shell']['left']-data['shell']['width']*.23-3,(id,'anchored',data)
        assert data['logo']['width']<=780.01,(id,'logo cap',data)
        assert data['crop'].startswith('inset(') and 'linear-gradient' in data['mask'],(id,'emblem crop + fade',data)
        assert data['noPin'] and not errors,(id,'scroll/js',errors,data)
        expected=.16 if w>=2200 else (.11 if w<=680 else (.14 if w<=850 else .18))
        assert abs(data['opacity']-expected)<.002,(id,'art direction',data['opacity'])
        # Confirm the decoration cannot take pointer focus, and each native disclosure works.
        if mode in ('motion','reduce') and w in (320,390,680,768,1024,1440,1920,2560):
            first=page.locator('.r3-gallery-disclosure summary').first
            first.scroll_into_view_if_needed()
            first.focus();page.keyboard.press('Enter')
            assert page.locator('.r3-gallery-disclosure').first.evaluate('(e)=>e.open'),(id,'keyboard disclosure')
            first.press('Enter')
            assert not page.locator('.r3-gallery-disclosure').first.evaluate('(e)=>e.open'),(id,'close')
            # Controlled JS gallery accordion still permits second disclosure.
            second=page.locator('.r3-gallery-disclosure summary').nth(1)
            second.evaluate('(e)=>e.click()')
            assert page.locator('.r3-gallery-disclosure').nth(1).evaluate('(e)=>e.open'),(id,'second disclosure')
            second.evaluate('(e)=>e.click()')
        if (w,mode) in CAPTURES:
            page.evaluate('document.activeElement?.blur?.()')
            page.evaluate('''() => document.querySelectorAll('[data-r3-gallery-piece]').forEach(el=>el.classList.add('is-revealed'))''')
            page.locator('#home-projects').screenshot(path=str(OUT/f'gallery-{w}x{h}.png'),animations='disabled',style='.skip-link,.scroll-progress{visibility:hidden!important}')
        rows.append({'viewport':f'{w}x{h}','mode':mode,'pass':True,'logoWidth':round(data['logo']['width'],1),'logoOpacity':data['opacity'],'horizontalOverflow':data['docOverflow'],'shellLeft':round(data['shell']['left'],1),'logoLeft':round(data['logo']['left'],1),'galleryCount':len(data['cards']),'errors':errors})
        page.close()
    browser.close()
(OUT/'results.json').write_text(json.dumps({'commit_review':'R3 M04 R2 viewport audit','total':len(CASES),'passed':len(rows),'cases':rows},indent=2),encoding='utf-8')
print(f'R3 M04 chameleon viewport QA PASS {len(rows)}/{len(CASES)}')
