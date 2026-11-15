from pathlib import Path
import json
import re,base64
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
URL='local-inline'
def inline_html(route):
    f=ROOT / route.strip('/') / 'index.html' if route!='/' else ROOT / 'index.html'
    s=f.read_text(encoding='utf-8')
    s=re.sub(r'<link rel="preconnect"[^>]+>', '',s)
    s=re.sub(r'<link href="https://fonts.googleapis.com/[^>]+>', '',s)
    s=re.sub(r'<link rel="preload"[^>]+>', '',s)
    s=s.replace('<link rel="stylesheet" href="/assets/css/site.css">', '<style>'+ (ROOT/'assets/css/site.css').read_text() + '</style>')
    s=s.replace('<script src="/assets/js/site.js" defer></script>', '')
    refs=set(re.findall(r'/assets/visuals/([a-z0-9-]+)\.webp',s))
    for ref in refs:
        b=(ROOT/'assets/visuals'/f'{ref}.webp').read_bytes()
        s=s.replace('/assets/visuals/'+ref+'.webp','data:image/webp;base64,'+base64.b64encode(b).decode())
    return s
paths=['/','/services/','/projects/','/about/','/process/','/contact/']
rows=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(1440,900),(390,844),(320,760),(768,1024),(1920,1080)]:
        context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,reduced_motion='reduce')
        for route in paths:
            page=context.new_page()
            console=[]
            page.on('pageerror',lambda e:console.append(str(e)))
            page.set_content(inline_html(route),wait_until='domcontentloaded')
            image_refs={n+'.webp':'data:image/webp;base64,'+base64.b64encode((ROOT/'assets/visuals'/(n+'.webp')).read_bytes()).decode() for n in ['s01-development','s02-automation','s03-integration','s04-infrastructure']}
            page.evaluate('(images) => { window.__qaImages = images; }',image_refs)
            test_js=(ROOT/'assets/js/site.js').read_text().replace("art.src='/assets/visuals/'+item[0];", "art.src=window.__qaImages[item[0]]||'/assets/visuals/'+item[0];")
            page.evaluate(test_js);res=type('R',(),{'status':200})()
            page.wait_for_timeout(100)
            img=page.locator('main img')
            # Scroll through content to load lazy images, then top.
            page.evaluate('window.scrollTo(0,document.body.scrollHeight)')
            page.wait_for_timeout(100)
            page.evaluate('window.scrollTo(0,0)')
            page.wait_for_timeout(100)
            ev=page.evaluate('''() => ({title:document.title, width:document.documentElement.scrollWidth,innerWidth:innerWidth,
                h1:document.querySelectorAll('h1').length,main:!!document.querySelector('main'),
                brokenImages:Array.from(document.images).filter(x=>x.complete&&x.naturalWidth===0).map(x=>x.src),
                buttons:Array.from(document.querySelectorAll('button')).filter(x=>x.disabled).length})''')
            name=route.strip('/') or 'home'
            if width in [1440,390] and route in ['/', '/services/','/contact/']:
                page.screenshot(path=str(ROOT/'qa'/f'{name}-{width}.png'),full_page=True,animations='disabled')
            if route=='/' and width in [1440,390,320]:
                rows_before=[b.get_attribute('aria-selected') for b in page.locator('[data-service-select]').all()]
                page.locator('[data-service-select="2"]').click()
                rows_after=[b.get_attribute('aria-selected') for b in page.locator('[data-service-select]').all()]
                ev['serviceTabWorks']=rows_before==['true','false','false','false'] and rows_after==['false','false','true','false']
                if width<=390:
                    page.locator('.menu-toggle').click();ev['navOpens']=page.locator('.navigation').evaluate('(e)=>e.classList.contains("is-open")')
                    page.keyboard.press('Escape');ev['navClosesEscape']=not page.locator('.navigation').evaluate('(e)=>e.classList.contains("is-open")')
            ev.update({'route':route,'viewport':width,'status':res.status,'consoleErrors':console,'overflow':ev['width']>width})
            rows.append(ev)
            page.close()
        context.close()
    browser.close()
(ROOT/'qa'/'browser-results.json').write_text(json.dumps(rows,indent=2))
failed=[x for x in rows if x['status']!=200 or x['overflow'] or x['brokenImages'] or x['consoleErrors'] or x['h1']!=1 or x.get('serviceTabWorks')==False or x.get('navOpens')==False or x.get('navClosesEscape')==False]
print('Checked',len(rows),'route×viewport combinations; issues',len(failed))
for x in failed: print(x)
