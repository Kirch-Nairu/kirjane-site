#!/usr/bin/env python3
"""Site-wide responsive geometry and navigation QA on exact static sources.

The local browser policy blocks HTTP navigation. Mount the actual HTML, styles,
images and scripts inline; remote fonts, network and production hosting are
not exercised. Resize sweeps and fresh-load interaction checks are distinct.
"""
from __future__ import annotations
import base64
import json
import mimetypes
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'qa/global-viewports'
OUT.mkdir(parents=True, exist_ok=True)
ROUTES = ['/', '/services/', '/projects/', '/about/', '/process/', '/contact/', '/404.html']
SIZES = [(280,700),(320,568),(390,844),(680,900),(681,900),(768,1024),
         (850,900),(851,900),(844,390),(960,650),(1024,768),(1280,720),
         (1366,768),(1440,900),(1440,600),(1920,1080),(2560,1080),(3440,1440)]
FRESH = [(280,700,'reduce'),(390,844,'normal'),(844,390,'normal'),
         (1366,768,'normal'),(1440,600,'normal'),(1920,1080,'normal'),
         (390,844,'nojs')]
CAPTURE = {(390,844),(1440,600),(1920,1080)}


def prepare(path):
    f = ROOT / path.lstrip('/')
    if f.is_dir():
        f = f / 'index.html'
    html = f.read_text()
    html = re.sub(r'<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]*>', '', html)
    html = re.sub(r'<link[^>]+rel="preload"[^>]*>', '', html)
    for css in ('site.css','r3-home.css'):
        html = html.replace(f'<link rel="stylesheet" href="/assets/css/{css}">',
                            '<style>' + (ROOT/'assets/css'/css).read_text() + '</style>')
    for name in set(re.findall(r'/assets/(?:visuals|brand)/[a-zA-Z0-9_.-]+', html)):
        asset = ROOT / name.lstrip('/')
        html = html.replace(name, 'data:' + mimetypes.guess_type(asset.name)[0] +
                            ';base64,' + base64.b64encode(asset.read_bytes()).decode())
    scripts = re.findall(r'<script src="(/assets/js/[^"]+)" defer></script>', html)
    html = re.sub(r'<script src="/assets/js/[^"]+" defer></script>', '', html)
    return html, [(ROOT/s.lstrip('/')).read_text() for s in scripts]


MEASURE = '''() => {
  const visible = e => {
    const r=e.getBoundingClientRect(),s=getComputedStyle(e);
    return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&
      !e.closest('[aria-hidden=true],.skip-link,.manifest-line');
  };
  const out=[], clipping=[];
  for(const e of document.querySelectorAll('h1,h2,h3,p,a,button,summary,li,label,.hero-baseline,.inner-foot,.section-kicker,.r3-process-detail,.r3-service-detail')){
    if(!visible(e)) continue;
    const r=e.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(e);
    const t=range.getBoundingClientRect();
    if(r.right>innerWidth+2||r.left< -2||t.right>innerWidth+2||t.left< -2)
      out.push({class:e.className?.toString(),text:e.textContent.trim().slice(0,80),left:Math.min(r.left,t.left),right:Math.max(r.right,t.right)});
  }
  for(const e of document.querySelectorAll('h1,h2,h3,p,.hero-baseline,.inner-foot,.r3-service-footer,.r3-process-bottom')){
    if(!visible(e))continue;
    const r=e.getBoundingClientRect();
    for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){
      if(/hidden|clip/.test(getComputedStyle(p).overflowY)){
        const b=p.getBoundingClientRect();
        if(r.bottom>b.bottom+3||r.top<b.top-3) clipping.push({class:e.className?.toString(),text:e.textContent.trim().slice(0,80),parent:p.className?.toString(),delta:Math.max(r.bottom-b.bottom,b.top-r.top)});
        break;
      }
    }
  }
  const badImages=[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src').slice(0,90));
  return {overflow:document.documentElement.scrollWidth-innerWidth,bodyOverflow:document.body.scrollWidth-innerWidth,
          out,clipping,badImages,headings:document.querySelectorAll('h1').length,
          main:!!document.querySelector('main'),footer:!!document.querySelector('footer')};
}'''


def check(page, path, width, height, mode, errors, cases, check_nav=False):
    data = page.evaluate(MEASURE)
    data.update(route=path, viewport=f'{width}x{height}', mode=mode, errors=list(errors))
    # Test human-operable links on the short viewport, not merely class changes.
    if check_nav and mode != 'nojs' and width <= 850:
        try:
            toggle = page.locator('.menu-toggle')
            toggle.click(timeout=3000)
            nav = page.locator('#site-navigation')
            assert toggle.get_attribute('aria-expanded') == 'true'
            assert nav.evaluate('(e)=>e.getBoundingClientRect().bottom<=innerHeight+2')
            final_link = nav.locator('a').last
            final_link.focus(timeout=3000)
            final_link.scroll_into_view_if_needed(timeout=3000)
            assert final_link.evaluate('''e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+2}''')
            page.keyboard.press('Escape')
            assert toggle.get_attribute('aria-expanded') == 'false'
            assert toggle.evaluate('e=>document.activeElement===e')
            data['navigation'] = 'PASS'
        except Exception as e:
            data['navigation'] = str(e)
    if mode == 'nojs':
        data['footerNavigation'] = page.locator('footer nav a').count() >= 4
    data['pass'] = (data['overflow']<=1 and data['bodyOverflow']<=1 and not data['out']
                    and not data['clipping'] and not data['badImages'] and not data['errors']
                    and data['headings']==1 and data['main'] and data['footer']
                    and data.get('navigation','PASS')=='PASS' and data.get('footerNavigation',True))
    cases.append(data)
    if not data['pass']:
        print('FAIL',path,width,height,mode,json.dumps(data)[:2000],flush=True)


def mount(page, html, scripts, mode):
    page.set_content(html, wait_until='domcontentloaded')
    if mode != 'nojs':
        for script in scripts:
            page.evaluate(script)
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(1250 if mode=='normal' else 80)


with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    cases=[]
    for path in ROUTES:
        html,scripts=prepare(path)
        page=b.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        mount(page,html,scripts,'reduce')
        for w,h in SIZES:
            page.set_viewport_size({'width':w,'height':h})
            page.wait_for_timeout(45)
            check(page,path,w,h,'resize-reduced',errors,cases)
        page.close()
        for w,h,mode in FRESH:
            page=b.new_page(viewport={'width':w,'height':h},reduced_motion='reduce' if mode=='reduce' else 'no-preference',java_script_enabled=mode!='nojs')
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            mount(page,html,scripts,mode)
            check(page,path,w,h,mode,errors,cases,check_nav=True)
            if (w,h) in CAPTURE and mode=='normal':
                name=path.strip('/').replace('.html','') or 'home'
                page.screenshot(path=str(OUT/f'{name}-{w}x{h}.png'),animations='disabled')
            page.close()
        print(path,'complete',flush=True)
        (OUT/'results.json').write_text(json.dumps({'total':len(cases),'passed':sum(x['pass'] for x in cases),'cases':cases},indent=2)+'\n')
    b.close()
    print(f'Global viewport QA: {sum(x["pass"] for x in cases)}/{len(cases)} PASS')
    assert all(x['pass'] for x in cases), 'Global viewport QA failures; inspect results.json'
