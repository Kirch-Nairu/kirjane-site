from pathlib import Path
from playwright.sync_api import sync_playwright
from qa_inline_assets import inline_logo_asset
import re,base64,json
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'qa'/'r3-separator'
OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="preconnect"[^>]*>', '',html)
html=re.sub(r'<link href="https://fonts.googleapis.com/[^>]*>', '',html)
html=re.sub(r'<link rel="preload"[^>]*>', '',html)
for css in ('site.css','r3-home.css'):
 html=html.replace(f'<link rel="stylesheet" href="/assets/css/{css}">','<style>'+ (ROOT/'assets/css'/css).read_text()+'</style>')
for js in ('site.js','r3-home.js'):
 html=html.replace(f'<script src="/assets/js/{js}" defer></script>','')
for name in set(re.findall(r'/assets/visuals/([a-z0-9-]+\.webp)',html)):
 uri='data:image/webp;base64,'+base64.b64encode((ROOT/'assets/visuals'/name).read_bytes()).decode()
 html=html.replace('/assets/visuals/'+name,uri)
html = inline_logo_asset(html, ROOT)
rows=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h,reduced in [(1440,900,False),(1920,1080,False),(960,740,False),(390,844,False),(320,760,False),(1440,900,True)]:
  page=b.new_page(viewport={'width':w,'height':h},reduced_motion='reduce' if reduced else 'no-preference')
  errs=[]
  page.on('pageerror',lambda ex:errs.append(str(ex)))
  page.set_content(html,wait_until='domcontentloaded')
  page.evaluate((ROOT/'assets/js/site.js').read_text())
  page.evaluate((ROOT/'assets/js/r3-home.js').read_text())
  page.wait_for_timeout(100)
  r=page.evaluate('''() => {
   const h=document.querySelector('.home-hero').getBoundingClientRect(), b=document.querySelector('.r3-hero-separator').getBoundingClientRect(), s=document.querySelector('.services-home').getBoundingClientRect();
   const st=getComputedStyle(document.querySelector('.r3-hero-separator'));
   return {heroEnd:h.bottom+scrollY, separatorStart:b.top+scrollY,separatorEnd:b.bottom+scrollY,servicesStart:s.top+scrollY,separatorHeight:b.height,separatorColor:st.backgroundColor,overflow:document.documentElement.scrollWidth>innerWidth+1,firstDiv:document.querySelector('.r3-hero-separator .manifest-line')?.textContent?.trim(),numberOfBands:document.querySelectorAll('.manifest-band').length,h1:document.querySelectorAll('h1').length,broken:Array.from(document.images).filter(i=>i.complete&&!i.naturalWidth).length};
  }''')
  assert abs(r['heroEnd']-r['separatorStart'])<1,r
  assert abs(r['separatorEnd']-r['servicesStart'])<1,r
  assert r['separatorHeight']>=130 and r['numberOfBands']==2 and r['h1']==1 and not r['overflow'] and not errs and not r['broken'],r
  assert 'UNDERSTAND THE WORK.' in r['firstDiv']
  y=max(0,r['separatorStart']-int(h*.48))
  page.evaluate('(y)=>scrollTo(0,y)',y)
  page.wait_for_timeout(170)
  if w in (1440,390):page.screenshot(path=str(OUT/f'separator-{w}.png'))
  # Ensure desktop service scroll activation still survives inserted height.
  if w>=960 and not reduced:
   geo=page.evaluate('''() => {const t=document.querySelector('[data-r3-services-track]'),s=document.querySelector('.r3-services-stage');return {start:t.getBoundingClientRect().top+scrollY,range:t.offsetHeight-s.offsetHeight}}''')
   indexes=[]
   for beat in range(4):
    page.evaluate('(y)=>window.scrollTo({top:y,behavior:"instant"})',geo['start']+(beat+.45)/4*geo['range'])
    page.wait_for_function("(n) => document.querySelector('[data-service-select][aria-selected=\"true\"]')?.getAttribute('data-service-select') === String(n)", arg=beat, timeout=2000)
    indexes.append(page.locator('[data-service-select][aria-selected="true"]').get_attribute('data-service-select'))
   assert indexes==['0','1','2','3'],indexes
   r['serviceBeats']=indexes
  rows.append({'viewport':f'{w}x{h}','reduced':reduced,'pass':True,**r})
  page.close()
 b.close()
(OUT/'results.json').write_text(json.dumps(rows,indent=2))
print('separator QA:',len(rows),'passed')
