#!/usr/bin/env python3
"""R3 Process active-stage hierarchy: real source HTML/CSS/JS/art in inlined Chromium.

Browser network policy denies localhost access; this is rendered-source QA, not hosted-site QA.
"""
from pathlib import Path
import re, base64, json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa'/'r3-process-centered'
OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="preconnect"[^>]*>', '', html)
html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]*>', '', html)
html=re.sub(r'<link rel="preload"[^>]*>', '', html)
for css in ('site.css','r3-home.css'):
    html=html.replace(f'<link rel="stylesheet" href="/assets/css/{css}">', '<style>'+(ROOT/'assets/css'/css).read_text()+'</style>')
for js in ('site.js','r3-home.js'):
    html=html.replace(f'<script src="/assets/js/{js}" defer></script>', '')
for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
    raw=(ROOT/'assets/visuals'/name).read_bytes()
    html=html.replace('/assets/visuals/'+name, 'data:image/webp;base64,'+base64.b64encode(raw).decode())
JS=[(ROOT/'assets/js'/name).read_text() for name in ('site.js','r3-home.js')]

sizes=[(320,760),(390,844),(768,1024),(960,740),(1024,768),(1280,720),(1440,900),(1536,864),(1920,1080),(1440,600)]
rows=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for w,h in sizes:
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='no-preference')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded')
        for js in JS:page.evaluate(js)
        page.wait_for_timeout(90)
        # Position the sticky stage in the actual viewport for visible screenshot
        geo=page.evaluate('''() => {
          const t=document.querySelector('[data-r3-process-track]'),s=t.querySelector('.r3-process-stage');
          return {start:t.getBoundingClientRect().top+scrollY,range:t.offsetHeight-s.offsetHeight};
        }''')
        page.evaluate('(top)=>scrollTo({top,behavior:"instant"})',geo['start']+max(0,geo['range'])*.1)
        page.wait_for_timeout(85)
        m=page.evaluate('''() => {
          const b=q=>{const r=document.querySelector(q).getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom,r:r.right}};
          const st=getComputedStyle(document.querySelector('.r3-process-detail'));
          const info=b('.r3-process-detail'),title=b('.r3-process-heading-group'),rail=b('.r3-process-bottom'),stage=b('.r3-process-stage');
          const desc=b('[data-r3-process-description]'),heading=b('[data-r3-process-title]');
          return {info,title,rail,stage,desc,heading,
            overflow:document.documentElement.scrollWidth>innerWidth+1,
            display:st.position,center:info.x+info.w/2,
            isPinned:document.documentElement.classList.contains('r3-process-scroll-active'),
            img:document.querySelector('.r3-process-art-base').naturalWidth};
        }''')
        assert not errors,(w,h,'JS errors',errors)
        assert not m['overflow'],(w,h,'document overflow')
        assert m['img']>0,(w,h,'broken image')
        assert abs(m['center']-w/2)<max(20,w*.08),(w,h,'content not horizontally centered',m)
        # For pinned desktop check foreground text remains below heading and above nav.
        if m['isPinned']:
            assert m['info']['y']>=m['title']['b']+8,(w,h,'intro/active text overlap',m)
            assert m['info']['b']<m['rail']['y']-8,(w,h,'active text/rail overlap',m)
            assert m['info']['y']>0 and m['info']['b']<h,(w,h,'viewport clipping',m)
            assert m['heading']['w']>100 and m['desc']['w']>200,(w,h,'text too narrow',m)
        else:
            assert m['display']=='static',(w,h,'fallback not in flow',m)
            assert m['info']['y']>=m['title']['b']-5,(w,h,'fallback heading overlap',m)
            assert m['info']['b']<m['rail']['y']+5,(w,h,'fallback rail overlap',m)
        if (w,h) in [(390,844),(960,740),(1280,720),(1440,900),(1536,864),(1920,1080)]:
            page.screenshot(path=str(OUT/f'process-centered-{w}x{h}.png'))
        # Expanded self-review: longest stage label must remain visible without
        # touching the heading or rail; repeat at every pinned scroll beat.
        if m['isPinned'] or (w,h) in [(390,844),(960,740)]:
            for i in range(5):
                if m['isPinned']:
                    page.evaluate('(top)=>scrollTo({top,behavior:"instant"})',geo['start']+((i+.5)/5)*geo['range'])
                    page.wait_for_timeout(130)
                else:
                    page.locator(f'[data-r3-process-step="{i}"]').evaluate('(e)=>e.click()')
                    page.wait_for_timeout(25)
                d=page.evaluate('''() => {
                  const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {y:r.y,b:r.bottom}};
                  return {detail:box('.r3-process-detail'),heading:box('.r3-process-heading-group'),rail:box('.r3-process-bottom'),
                    active:document.querySelector('.r3-process-step.is-active')?.dataset.r3ProcessStep};
                }''')
                assert d['active']==str(i),(w,h,'bad stage',i,d)
                assert d['detail']['y']>=d['heading']['b']+5,(w,h,'stage/heading collision',i,d)
                assert d['detail']['b']<d['rail']['y']+3,(w,h,'stage/rail collision',i,d)
                if (w,h)==(1440,900) and i==4:
                    page.screenshot(path=str(OUT/'process-centered-1440x900-stage5.png'))
        rows.append({'viewport':f'{w}x{h}','pass':True,'layout':m})
        page.close()
    # reduced motion + JS off still show primary information
    for js_on,reduced in [(True,True),(False,False)]:
        page=browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce' if reduced else 'no-preference',java_script_enabled=js_on)
        page.set_content(html)
        if js_on:
            for js in JS: page.evaluate(js)
        assert page.locator('.r3-process-detail').is_visible()
        assert page.locator('.r3-process-step').count()==5
        rows.append({'viewport':'1440x900','reduced_motion':reduced,'javascript':js_on,'pass':True})
        page.close()
    browser.close()
(OUT/'results.json').write_text(json.dumps(rows,indent=2))
print('R3 M03 R3 centered-content QA PASS',len(rows),'/',len(rows))
