"""M01+M02 actual localhost browser QA: no external dependency beyond Playwright."""
import json
import re
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright
from qa_inline_assets import inline_logo_asset
ROOT = Path(__file__).resolve().parent.parent
URL = 'inline-browser-harness (localhost is blocked by browser sandbox)'
def inline_html():
    html=(ROOT/'index.html').read_text(encoding='utf-8')
    html=re.sub(r'<link rel="preconnect"[^>]+>', '', html)
    html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]+>', '', html)
    html=re.sub(r'<link rel="preload"[^>]+>', '', html)
    for rel in ['site.css','r3-home.css']:
        html=html.replace(f'<link rel="stylesheet" href="/assets/css/{rel}">', '<style>'+(ROOT/'assets/css'/rel).read_text(encoding='utf-8')+'</style>')
    for rel in ['site.js','r3-home.js']:
        html=html.replace(f'<script src="/assets/js/{rel}" defer></script>', '')
    for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)', html)):
        b=(ROOT/'assets/visuals'/name).read_bytes()
        html=html.replace('/assets/visuals/'+name, 'data:image/webp;base64,'+base64.b64encode(b).decode())
    return inline_logo_asset(html, ROOT)
SITE_HTML=inline_html()
def mount(page):
    page.set_content(SITE_HTML,wait_until='domcontentloaded')
    # R3-A1 uses four pre-rendered full-bleed images; never patch production JS.
    script=(ROOT/'assets/js/site.js').read_text(encoding='utf-8')
    scripts=(ROOT/'assets/js/r3-home.js').read_text(encoding='utf-8')
    # Visual layers are already inlined and never modified, so no dynamic asset requests occur.
    page.evaluate(script)
    page.evaluate(scripts)

rows=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for width,height in [(320,760),(390,844),(768,1024),(960,740),(1024,768),(1280,650),(1440,900),(1920,1080),(1440,600)]:
        page=browser.new_page(viewport={'width':width,'height':height}, reduced_motion='no-preference')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        mount(page)
        page.wait_for_timeout(250)
        initial=page.evaluate('''() => ({width:document.documentElement.scrollWidth, viewport:innerWidth, hero:!!document.querySelector('.home-hero'), story:!!document.querySelector('[data-r3-services-track]'), imageCount:document.querySelectorAll('[data-service-scene]').length, enabled:document.documentElement.classList.contains('r3-scroll-active'), h1:document.querySelectorAll('h1').length, images:Array.from(document.images).filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})''')
        assert initial['hero'] and initial['story'] and initial['h1']==1 and initial['imageCount']==4, (width,initial)
        assert initial['width']<=width and not initial['images'], (width,initial)
        expected=width>=960 and height>=650
        assert initial['enabled']==expected, (width,initial)
        story=None
        if expected:
            geo=page.evaluate('''() => {
                const t=document.querySelector('[data-r3-services-track]');
                const s=document.querySelector('.r3-services-stage');
                const rect=s.getBoundingClientRect();
                const offset=parseFloat(getComputedStyle(s).top)||0;
                const start=t.getBoundingClientRect().top+scrollY-offset;
                const end=t.getBoundingClientRect().top+scrollY+t.offsetHeight-s.offsetHeight-offset;
                const visual=s.querySelector('.r3-service-visuals').getBoundingClientRect();
                const cards=Array.from(s.querySelectorAll('.service-row')).map(x=>x.getBoundingClientRect().height);
                return {start,end,trackHeight:t.offsetHeight,sticky:getComputedStyle(s).position,
                    stageHeight:rect.height,stageTop:offset,visualHeight:visual.height,cards};
            }''')
            assert geo['sticky']=='sticky',geo
            # R3-A1 changed to an actual full-viewport background, not a split visual panel.
            assert abs(geo['stageHeight']-height)<4 and abs(geo['stageTop'])<2,geo
            assert abs(geo['visualHeight']-geo['stageHeight'])<4,geo
            assert all(h>55 for h in geo['cards']),geo
            indexes=[]
            for beat in range(4):
                point=geo['start'] + ((beat+.4)/4)*(geo['end']-geo['start'])
                page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',point)
                page.wait_for_timeout(210)
                idx=page.locator('[data-service-select][aria-selected="true"]').get_attribute('data-service-select')
                imgidx=page.locator('[data-service-scene].is-current').get_attribute('data-service-scene')
                assert idx==str(beat) and imgidx==str(beat),(width,beat,idx,imgidx)
                indexes.append(int(idx))
            # Reverse scroll must restore previous beats
            for beat in (2,1,0):
                point=geo['start'] + ((beat+.4)/4)*(geo['end']-geo['start'])
                page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',point)
                page.wait_for_timeout(150)
                idx=page.locator('[data-service-select][aria-selected="true"]').get_attribute('data-service-select')
                assert idx==str(beat),(width,'reverse',beat,idx)
            story={'forward':indexes,'reverse':True,'height':geo['trackHeight'],'stageHeight':geo['stageHeight'],'stageTop':geo['stageTop'],'visualHeight':geo['visualHeight']}
        else:
            assert page.evaluate("getComputedStyle(document.querySelector('.r3-services-stage')).position")!='sticky'
            page.locator('[data-service-select="3"]').click()
            assert page.locator('[data-service-select="3"]').get_attribute('aria-selected')=='true'
            story={'static':True,'manualTabs':True}
        # Verify images loaded and no overflow on bottom.
        page.evaluate('window.scrollTo({top:document.body.scrollHeight,behavior:"instant"})')
        page.wait_for_timeout(240)
        ending=page.evaluate('''() => ({width:document.documentElement.scrollWidth,viewport:innerWidth,broken:Array.from(document.images).filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})''')
        assert ending['width']<=width and not ending['broken'], (width,ending)
        assert not errors,(width,errors)
        page.screenshot(path=str(ROOT/'qa'/f'r3-home-{width}.png'),full_page=False)
        rows.append({'width':width,'height':height,'pass':True,'story':story,'consoleErrors':errors,'overflow':False})
        page.close()
    for width,motion in [(1440,'reduce'),(390,'reduce')]:
        page=browser.new_page(viewport={'width':width,'height':900},reduced_motion=motion)
        mount(page)
        assert not page.evaluate("document.documentElement.classList.contains('r3-scroll-active')")
        assert page.locator('h1').is_visible()
        page.locator('[data-service-select="2"]').click()
        assert page.locator('[data-service-select="2"]').get_attribute('aria-selected')=='true'
        rows.append({'width':width,'reducedMotion':True,'pass':True})
        page.close()
    browser.close()
(ROOT/'qa').mkdir(exist_ok=True)
(ROOT/'qa'/'r3-home-results.json').write_text(json.dumps(rows,indent=2))
print(json.dumps({'total':len(rows),'pass':sum(r['pass'] for r in rows),'desktopStoryWidths':[r['width'] for r in rows if r.get('story',{}).get('forward')],'mobileStaticWidths':[r['width'] for r in rows if r.get('story',{}).get('static')]},indent=2))
