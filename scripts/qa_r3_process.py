#!/usr/bin/env python3
"""R3 M03 Process progressive five-stage full-bleed QA using local actual assets.
Browser sandbox blocks localhost; inline HTML CSS JS WebP for browser.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re, base64, json, hashlib
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa'/'r3-process'
OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="preconnect"[^>]*>', '', html)
html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]*>', '', html)
html=re.sub(r'<link rel="preload"[^>]*>', '', html)
for rel in ('site.css','r3-home.css'):
    html=html.replace(f'<link rel="stylesheet" href="/assets/css/{rel}">','<style>'+(ROOT/'assets/css'/rel).read_text()+'</style>')
for rel in ('site.js','r3-home.js'):
    html=html.replace(f'<script src="/assets/js/{rel}" defer></script>','')
for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
    raw=(ROOT/'assets/visuals'/name).read_bytes()
    html=html.replace('/assets/visuals/'+name,'data:image/webp;base64,'+base64.b64encode(raw).decode())
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for w,h in [(320,760),(390,844),(768,1024),(960,740),(1280,720),(1440,900),(1920,1080),(1440,600)]:
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='no-preference')
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded')
        page.evaluate((ROOT/'assets/js/site.js').read_text())
        page.evaluate((ROOT/'assets/js/r3-home.js').read_text())
        page.wait_for_timeout(250)
        m=page.evaluate('''() => {let s=document.querySelector('.r3-process-stage'),t=document.querySelector('.r3-process-track'),pic=document.querySelector('.r3-process-art'),r=s.getBoundingClientRect(),ar=pic.getBoundingClientRect(),top=document.querySelector('.r3-process-overline').getBoundingClientRect(),steps=document.querySelector('.r3-process-steps').getBoundingClientRect(),hs=document.querySelector('.r3-process-heading-group').getBoundingClientRect(),focus=document.querySelector('.r3-process-detail').getBoundingClientRect();return {width:document.documentElement.scrollWidth,stage:{w:r.width,h:r.height},art:{x:ar.x,w:ar.width,h:ar.height},sticky:getComputedStyle(s).position,enabled:document.documentElement.classList.contains('r3-process-scroll-active'),processSteps:document.querySelectorAll('[data-r3-process-step]').length,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length,hasSvg:!!s.querySelector('svg'),hasCanvas:!!s.querySelector('canvas'),h1:document.querySelectorAll('h1').length,stepsTop:steps.top,focusBottom:focus.bottom,headingBottom:hs.bottom,overlineBottom:top.bottom,headingTop:hs.top};}''')
        assert m['width']<=w+1 and m['art']['x']>=-1 and abs(m['art']['w']-w)<2 and m['stage']['w']>=w-1,m
        assert m['processSteps']==5 and m['h1']==1 and not m['broken'] and not m['hasSvg'] and not m['hasCanvas'],m
        enabled=w>=960 and h>=650
        assert m['enabled']==enabled,(w,h,m)
        if enabled:
            assert m['sticky']=='sticky' and abs(m['stage']['h']-h)<3,m
            assert m['overlineBottom']<m['stepsTop'] and m['headingTop']>=m['overlineBottom']-2,m
            assert m['focusBottom']<m['stepsTop']+3,m
            geo=page.evaluate('''() => {let t=document.querySelector('[data-r3-process-track]'),s=document.querySelector('.r3-process-stage');return {start:t.getBoundingClientRect().top+scrollY,range:t.offsetHeight-s.offsetHeight}}''')
            indexes=[];focuses=[]
            for beat in range(5):
                y=geo['start']+((beat+.45)/5)*geo['range']
                page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
                page.wait_for_timeout(170)
                ix=page.locator('[data-r3-process-step].is-active').get_attribute('data-r3-process-step')
                title=page.locator('[data-r3-process-title]').inner_text()
                counter=page.locator('[data-r3-process-count]').inner_text()
                coords=page.evaluate('''() => {let t=document.querySelector('[data-r3-process-track]');return {x:t.style.getPropertyValue('--r3-process-x'),y:t.style.getPropertyValue('--r3-process-y')}}''')
                assert ix==str(beat) and counter.startswith(f'{beat+1:02d}') and title.strip(),(w,beat,ix,counter,title)
                indexes.append(int(ix));focuses.append(coords)
                if w==1440 or (w==960 and beat==2):
                    page.wait_for_timeout(450)
                    page.screenshot(path=str(OUT/f'process-beat-{beat+1}-{w}.png'))
            assert len(set(x['x'] for x in focuses))==5,(w,focuses)
            for beat in (3,2,1,0):
                page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',geo['start']+((beat+.45)/5)*geo['range'])
                page.wait_for_timeout(130)
                assert page.locator('[data-r3-process-step].is-active').get_attribute('data-r3-process-step')==str(beat),(w,'reverse',beat)
            page.locator('[data-r3-process-step="4"]').click()
            page.wait_for_timeout(900)
            assert page.locator('[data-r3-process-step="4"]').get_attribute('aria-current')=='step',(w,'manual')
            # Integrated regression: preceding Services chapter still advances
            # through four existing artwork beats after the Process feature loads.
            service_steps=None
            if w in (960,1440,1920):
                sgeo=page.evaluate('''() => {const t=document.querySelector('[data-r3-services-track]'),s=document.querySelector('.r3-services-stage');return {start:t.getBoundingClientRect().top+scrollY,range:t.offsetHeight-s.offsetHeight}}''')
                service_steps=[]
                for service_beat in range(4):
                    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',sgeo['start']+((service_beat+.45)/4)*sgeo['range'])
                    page.wait_for_timeout(180)
                    active=page.locator('[data-service-select][aria-selected="true"]').get_attribute('data-service-select')
                    assert active==str(service_beat),(w,'Services regression',service_beat,active)
                    service_steps.append(int(active))
            story={'active':True,'steps':indexes,'reverse':True,'focuses':focuses,'servicesRegression':service_steps}
        else:
            assert m['sticky']!='sticky',(w,'incorrect sticky')
            page.locator('[data-r3-process-step="4"]').click()
            assert page.locator('[data-r3-process-title]').inner_text()=='Deliver & Support',w
            if w==390:
                page.locator('.r3-process-stage').scroll_into_view_if_needed()
                page.screenshot(path=str(OUT/'process-mobile-390.png'))
            story={'active':False,'manual':True}
        assert not errors,(w,errors)
        results.append({'viewport':f'{w}x{h}','pass':True,'layout':m,'story':story})
        page.close()
    for w,h in ((390,844),(1440,900)):
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='reduce')
        page.set_content(html);page.evaluate((ROOT/'assets/js/site.js').read_text());page.evaluate((ROOT/'assets/js/r3-home.js').read_text())
        assert not page.evaluate('document.documentElement.classList.contains("r3-process-scroll-active")')
        page.locator('[data-r3-process-step="3"]').click()
        assert page.locator('[data-r3-process-title]').inner_text()=='Validate'
        results.append({'viewport':f'{w}x{h}','reducedMotion':True,'pass':True})
        page.close()
    page=browser.new_page(viewport={'width':1440,'height':900},java_script_enabled=False)
    page.set_content(html)
    assert page.locator('#r3-process-heading').is_visible()
    assert page.locator('[data-r3-process-step]').count()==5
    assert page.locator('[data-r3-process-title]').is_visible()
    results.append({'viewport':'1440x900','noJS':True,'pass':True})
    page.close()
    browser.close()
(OUT/'results.json').write_text(json.dumps(results,indent=2))
print('process QA',len(results),'PASS',sum(r['pass'] for r in results),'desktop',[x['viewport'] for x in results if x.get('story',{}).get('active')])
