#!/usr/bin/env python3
"""Adversarial Chromium checks for R3 M03, including transition frames and source/crop fidelity.

Sandbox browser cannot open loopback HTTP, so HTML/CSS/JS/WebP from this exact
source tree are inlined. A Windows real-host acceptance check remains mandatory.
"""
from pathlib import Path
import base64, hashlib, json, re
from playwright.sync_api import sync_playwright
from qa_inline_assets import inline_logo_asset

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa'/'r3-m03-stabilization'
OUT.mkdir(parents=True, exist_ok=True)
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="preconnect"[^>]*>', '', html)
html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]*>', '', html)
html=re.sub(r'<link rel="preload"[^>]*>', '', html)
for f in ('site.css','r3-home.css'):
    html=html.replace(f'<link rel="stylesheet" href="/assets/css/{f}">','<style>'+(ROOT/'assets/css'/f).read_text()+'</style>')
for f in ('site.js','r3-home.js'):
    html=html.replace(f'<script src="/assets/js/{f}" defer></script>', '')
for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
    raw=(ROOT/'assets/visuals'/name).read_bytes()
    html=html.replace('/assets/visuals/'+name, 'data:image/webp;base64,'+base64.b64encode(raw).decode())

html = inline_logo_asset(html, ROOT)
JS=[(ROOT/'assets/js'/x).read_text() for x in ('site.js','r3-home.js')]
rows=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    sizes=[(320,760),(390,844),(768,1024),(960,740),(1024,768),(1280,720),(1440,900),(1920,1080),(1440,600)]
    for w,h in sizes:
        page=browser.new_page(viewport={'width':w,'height':h})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded')
        for script in JS:page.evaluate(script)
        page.wait_for_timeout(150)
        metrics=page.evaluate('''() => {
          const st=document.querySelector('.r3-process-stage'),r=st.getBoundingClientRect();
          const img=st.querySelector('.r3-process-art-base');
          return {overflow:document.documentElement.scrollWidth>innerWidth+1,sticky:getComputedStyle(st).position,
                  height:r.height,steps:document.querySelectorAll('[data-r3-process-step]').length,
                  active:document.documentElement.classList.contains('r3-process-scroll-active'),
                  imageFit:getComputedStyle(img).objectFit,
                  broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length};
        }''')
        active=w>=960 and h>=650 and w/h>=1.5
        assert not errors and not metrics['overflow'] and metrics['broken']==0,(w,h,'basic failures',errors,metrics)
        assert metrics['active']==active,(w,h,'mode',metrics)
        assert metrics['steps']==5,(w,h,'step count')
        if active:
            assert metrics['sticky']=='sticky' and abs(metrics['height']-h)<3,(w,h,'sticky geometry',metrics)
            geo=page.evaluate('''() => {const t=document.querySelector('[data-r3-process-track]'),s=document.querySelector('.r3-process-stage');return{start:t.getBoundingClientRect().top+scrollY,range:t.offsetHeight-s.offsetHeight}}''')
            pillars=[(11.5,69),(30.9,59),(49.7,49),(69.3,38),(90.3,26)]
            states=[];focus=[]
            for i,expected in enumerate(pillars):
                page.evaluate('(y)=>window.scrollTo({top:y,behavior:"instant"})',geo['start']+(i+.5)/5*geo['range'])
                page.wait_for_timeout(100)
                data=page.evaluate('''() => {const t=document.querySelector('[data-r3-process-track]'),im=t.querySelector('.r3-process-art-base'),s=t.querySelector('.r3-process-stage');return {index:Number(t.querySelector('[data-r3-process-step].is-active').dataset.r3ProcessStep),x:parseFloat(t.style.getPropertyValue('--r3-process-x')),y:parseFloat(t.style.getPropertyValue('--r3-process-y')),nw:im.naturalWidth,nh:im.naturalHeight,w:s.clientWidth,h:s.clientHeight}}''')
                assert data['index']==i,(w,h,'stage',i,data)
                scale=max(data['w']/data['nw'],data['h']/data['nh'])
                expected_x=(expected[0]/100*data['nw']*scale+(data['w']-data['nw']*scale)/2)/data['w']*100
                expected_y=(expected[1]/100*data['nh']*scale+(data['h']-data['nh']*scale)/2)/data['h']*100
                assert abs(data['x']-expected_x)<.15 and abs(data['y']-expected_y)<.15,(w,h,'misaligned spotlight',i,data,(expected_x,expected_y))
                states.append(data['index']);focus.append((round(data['x'],2),round(data['y'],2)))
                if w==1440:page.screenshot(path=str(OUT/f'process-stage-{i+1}-1440.png'))
            for i in reversed(range(5)):
                page.evaluate('(y)=>window.scrollTo({top:y,behavior:"instant"})',geo['start']+(i+.5)/5*geo['range'])
                page.wait_for_timeout(80)
                assert page.locator('[data-r3-process-step].is-active').get_attribute('data-r3-process-step')==str(i),(w,h,'reverse failed',i)
            story={'states':states,'reverse':True,'focus':focus}
            if w==1440:
                # Direct final-stage click must progress monotonically, no 5->1->5.
                page.evaluate('(y)=>window.scrollTo({top:y,behavior:"instant"})',geo['start']+.5/5*geo['range']);page.wait_for_timeout(150)
                page.evaluate('''() => {window.__history=[];const t=document.querySelector('[data-r3-process-title]');new MutationObserver(()=>window.__history.push(t.textContent)).observe(t,{childList:true});}''')
                page.locator('[data-r3-process-step="4"]').click()
                page.wait_for_function("() => document.querySelector('[data-r3-process-step].is-active')?.dataset.r3ProcessStep==='4'",timeout=4500)
                page.wait_for_timeout(250)
                history=page.evaluate('window.__history')
                expected_labels=['Discover','Plan & Design','Develop','Validate','Deliver & Support']
                indexes=[expected_labels.index(label) for label in history]
                assert indexes and indexes[-1]==4 and all(a<=b for a,b in zip(indexes,indexes[1:])),('transient state flash',history)
                story['click_history']=history
                # 30 micro-scrolls inside one stage must not touch stage text/ARIA.
                page.evaluate('(y)=>window.scrollTo({top:y,behavior:"instant"})',geo['start']+(.5/5)*geo['range']);page.wait_for_timeout(150)
                page.evaluate('''() => {window.__mutations=[];const t=document.querySelector('[data-r3-process-track]');new MutationObserver(records=>window.__mutations.push(...records.map(r=>r.target.nodeName+':'+r.type))).observe(t,{subtree:true,attributes:true,characterData:true,childList:true,attributeFilter:['aria-current']});}''')
                for i in range(30):page.evaluate('window.scrollBy({top:1,behavior:"instant"})');page.wait_for_timeout(18)
                muts=page.evaluate('window.__mutations')
                assert not muts,('unnecessary stage rewrites',len(muts),muts[:8])
                story['same_stage_mutations']=len(muts)
                # Keyboard activation on the step rail is functional.
                page.locator('[data-r3-process-step="0"]').focus()
                page.keyboard.press('End')
                page.wait_for_function("() => document.querySelector('[data-r3-process-step].is-active')?.dataset.r3ProcessStep==='4'",timeout=4500)
                story['keyboard_end']=True
                # Services must still reverse/advance all 4 visual states.
                st=page.evaluate('''() => {const t=document.querySelector('[data-r3-services-track]'),s=t.querySelector('.r3-services-stage');return {start:t.getBoundingClientRect().top+scrollY,range:t.offsetHeight-s.offsetHeight}}''')
                services=[]
                for i in range(4):
                    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',st['start']+(i+.45)/4*st['range']);page.wait_for_timeout(120)
                    services.append(page.locator('[data-service-select][aria-selected="true"]').get_attribute('data-service-select'))
                assert services==list(map(str,range(4))),('services regression',services)
                story['services']=services
        else:
            assert metrics['sticky']!='sticky',(w,h,'unexpected pin',metrics)
            if w>=960 and w/h<1.5:
                assert metrics['imageFit']=='contain',(w,h,'cropped five-pillar fallback',metrics)
            page.locator('[data-r3-process-step="4"]').click()
            assert page.locator('[data-r3-process-title]').inner_text()=='Deliver & Support',(w,h,'manual fallback')
            if w==390:
                page.locator('.r3-process-stage').scroll_into_view_if_needed()
                page.screenshot(path=str(OUT/'process-mobile-390.png'))
            story={'manual':True,'nonPinned':True}
        assert not errors,(w,h,'page errors',errors)
        rows.append({'viewport':f'{w}x{h}','pass':True,'layout':metrics,'story':story})
        page.close()
    # Independent reduced-motion and no-JS guards.
    for w,h in ((1440,900),(390,844)):
        page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='reduce')
        page.set_content(html,wait_until='domcontentloaded')
        for script in JS:page.evaluate(script)
        assert not page.evaluate('document.documentElement.classList.contains("r3-process-scroll-active")')
        page.locator('[data-r3-process-step="2"]').click()
        assert page.locator('[data-r3-process-title]').inner_text()=='Develop'
        rows.append({'viewport':f'{w}x{h}','reducedMotion':True,'pass':True})
        page.close()
    page=browser.new_page(viewport={'width':1440,'height':900},java_script_enabled=False)
    page.set_content(html)
    assert page.locator('#r3-process-heading').is_visible() and page.locator('[data-r3-process-step]').count()==5
    rows.append({'viewport':'1440x900','noJS':True,'pass':True})
    page.close()
    browser.close()
(OUT/'results.json').write_text(json.dumps(rows,indent=2))
print('R3 M03 stabilization QA: PASS',len(rows),'/',len(rows))
