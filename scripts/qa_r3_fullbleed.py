#!/usr/bin/env python3
"""R3 Services full-bleed browser tests: real generated markup/CSS/JS/WebP via inlined resources.
Browser sandbox denies localhost, so these are not live HTTP browser tests."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from qa_inline_assets import inline_logo_asset
import re, json, base64, hashlib
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa'/'r3-fullbleed'
OUT.mkdir(parents=True,exist_ok=True)
ASSETS=ROOT/'assets'/'visuals'

def prepare():
    html=(ROOT/'index.html').read_text()
    html=re.sub(r'<link rel="preconnect"[^>]*>', '', html)
    html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]*>', '', html)
    html=re.sub(r'<link rel="preload"[^>]*>', '', html)
    for css in ('site.css','r3-home.css'):
        html=html.replace(f'<link rel="stylesheet" href="/assets/css/{css}">','<style>'+((ROOT/'assets/css'/css).read_text())+'</style>')
    for js in ('site.js','r3-home.js'):
        html=html.replace(f'<script src="/assets/js/{js}" defer></script>', '')
    for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
        uri='data:image/webp;base64,'+base64.b64encode((ASSETS/name).read_bytes()).decode()
        html=html.replace('/assets/visuals/'+name,uri)
    return inline_logo_asset(html, ROOT)

html=prepare()
rows=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    dims=[(320,760),(390,844),(768,1024),(960,740),(1280,720),(1366,768),(1440,900),(1920,1080),(1440,600)]
    for w,h in dims:
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='no-preference')
        errors=[]
        page.on('pageerror',lambda ex:errors.append(str(ex)))
        page.set_content(html,wait_until='domcontentloaded')
        page.evaluate((ROOT/'assets/js/site.js').read_text())
        page.evaluate((ROOT/'assets/js/r3-home.js').read_text())
        page.wait_for_timeout(400)
        metrics=page.evaluate('''() => {
            const sel=s=>document.querySelector(s), rect=s=>{const r=sel(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};
            const st=sel('.r3-services-stage');const t=sel('[data-r3-services-track]');
            return {width:document.documentElement.scrollWidth,viewport:innerWidth,stage:rect('.r3-services-stage'),image:rect('.r3-service-visuals'),left:rect('.r3-services-left'),detail:rect('.r3-service-detail'),head:rect('.r3-service-overline'),footer:rect('.r3-service-footer'),
            sticky:getComputedStyle(st).position, active:document.documentElement.classList.contains('r3-scroll-active'),imageFit:getComputedStyle(sel('[data-service-scene]')).objectFit,
            background:getComputedStyle(st).backgroundColor, trackHeight:t.offsetHeight, imageCount:document.querySelectorAll('[data-service-scene]').length,
            rows:Array.from(document.querySelectorAll('.service-row')).map(x=>{const r=x.getBoundingClientRect();return {y:r.y,bottom:r.bottom,height:r.height}}),
            hasSvg:!!st.querySelector('svg'),hasCanvas:!!st.querySelector('canvas'),title:sel('#r3-services-heading').textContent,
            broken:Array.from(document.images).filter(i=>i.complete&&!i.naturalWidth).length,
            h1:document.querySelectorAll('h1').length,
            stageBackgroundVisible:getComputedStyle(sel('[data-service-scene="0"]')).opacity};
        }''')
        assert metrics['imageCount']==4 and metrics['h1']==1 and not metrics['hasSvg'] and not metrics['hasCanvas'],(w,'assets',metrics)
        assert metrics['width']<=w+1 and metrics['broken']==0,(w,'overflow or broken image',metrics)
        assert abs(metrics['image']['x'])<1 and abs(metrics['image']['width']-w)<1,(w,'not full bleed',metrics)
        assert metrics['imageFit']=='cover',(w,'bad cover',metrics)
        assert metrics['stage']['width']>=w-1,(w,'not full width',metrics)
        assert metrics['left']['x']>=0 and metrics['left']['x']+metrics['left']['width']<=w+1,(w,'left overlay out of bounds')
        assert metrics['detail']['x']>=0 and metrics['detail']['x']+metrics['detail']['width']<=w+1,(w,'detail overlay out of bounds')
        active=w>=960 and h>=650
        assert metrics['active']==active,(w,h,'mode',metrics)
        if active:
            assert metrics['sticky']=='sticky' and abs(metrics['stage']['height']-h)<3,(w,h,'sticky geometry',metrics)
            assert metrics['head']['bottom']<metrics['left']['y']+7,(w,'head overlap',metrics)
            assert metrics['left']['bottom']<metrics['footer']['y']+3,(w,'nav overlaps footer',metrics)
            assert all(x['height']>=45 for x in metrics['rows']),(w,'rows too small',metrics)
            track=page.locator('[data-r3-services-track]')
            geo=page.evaluate('''() => {const t=document.querySelector('[data-r3-services-track]');const s=document.querySelector('.r3-services-stage');const start=t.getBoundingClientRect().top+scrollY;return {start,range:t.offsetHeight-s.offsetHeight};}''')
            states=[]
            for beat in range(4):
                page.evaluate('(y)=>window.scrollTo({top:y,behavior:"instant"})',geo['start'] + (beat+.45)/4*geo['range'])
                page.wait_for_timeout(140)
                idx=page.locator('[data-service-select][aria-selected="true"]').get_attribute('data-service-select')
                image=page.locator('[data-service-scene].is-current').get_attribute('data-service-scene')
                label=page.locator('[data-r3-count]').inner_text()
                focus=page.locator('[data-service-focus]').inner_text()
                assert idx==str(beat) and image==str(beat) and label.startswith(f'{beat+1:02d}'),(w,beat,idx,image,label)
                assert focus.strip(),(w,beat,'blank focus')
                states.append(int(idx))
                if w==1440:
                    page.wait_for_timeout(850)
                    page.screenshot(path=str(OUT/f'beat-{beat+1}-1440.png'))
            for beat in (2,1,0):
                page.evaluate('(y)=>window.scrollTo({top:y,behavior:"instant"})',geo['start'] + (beat+.45)/4*geo['range'])
                page.wait_for_timeout(140)
                assert page.locator('[data-service-select][aria-selected="true"]').get_attribute('data-service-select')==str(beat),(w,'reverse',beat)
            # User-selected service scrolls to corresponding beat.
            page.locator('[data-service-select="3"]').click()
            page.wait_for_timeout(900)
            assert page.locator('[data-service-select="3"]').get_attribute('aria-selected')=='true',(w,'manual click')
            if w in (960,1366,1920):
                page.screenshot(path=str(OUT/f'services-{w}.png'))
            story={'states':states,'reverse':True,'manual':True}
        else:
            assert metrics['sticky']!='sticky',(w,h,'should unpin')
            page.locator('[data-service-select="3"]').click()
            assert page.locator('[data-service-scene="3"]').get_attribute('class').find('is-current')>=0,(w,'manual mobile')
            if w in (320,390,768) or h==600:
                loc=page.locator('.r3-services-stage')
                loc.scroll_into_view_if_needed()
                page.screenshot(path=str(OUT/f'services-{w}x{h}.png'),full_page=False)
            story={'static':True,'manual':True}
        assert not errors,(w,'JS errors',errors)
        rows.append({'width':w,'height':h,'pass':True,'metrics':metrics,'story':story})
        page.close()
    for w,h in [(1440,900),(390,844)]:
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='reduce')
        page.set_content(html,wait_until='domcontentloaded')
        page.evaluate((ROOT/'assets/js/site.js').read_text())
        page.evaluate((ROOT/'assets/js/r3-home.js').read_text())
        assert not page.evaluate("document.documentElement.classList.contains('r3-scroll-active')")
        page.locator('[data-service-select="2"]').click()
        assert page.locator('[data-service-scene="2"]').get_attribute('class').find('is-current')>=0
        rows.append({'width':w,'height':h,'reducedMotion':True,'pass':True})
        page.close()
    page=browser.new_page(viewport={'width':1440,'height':900},java_script_enabled=False)
    page.set_content(html)
    assert page.locator('#r3-services-heading').is_visible()
    assert page.locator('[data-service-scene="0"]').is_visible()
    rows.append({'width':1440,'noJS':True,'pass':True})
    page.close()
    browser.close()
(OUT/'qa_results.json').write_text(json.dumps(rows,indent=2))
print('QA',len(rows),'PASS',sum(row['pass'] for row in rows),'active', [x['width'] for x in rows if x.get('story',{}).get('states')])
