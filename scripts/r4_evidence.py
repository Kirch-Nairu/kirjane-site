"""Assemble comparisons and enrich observed inventory; never infer visibility from filenames."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,re,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1]
E=ROOT/'docs/creative-forge-r4/evidence';C=E/'comparisons';C.mkdir(exist_ok=True)
for width in [1440,390,320]:
 for kind in ['home-live','home-poster','services-live']:
  for suffix in ['', '-art']:
   name=f'{kind}-{width}{suffix}.png'
   a=Image.open(E/'before-final'/name).convert('RGB');b=Image.open(E/'after-final'/name).convert('RGB')
   panel=Image.new('RGB',(a.width+b.width,max(a.height,b.height)+32),'#08110d')
   panel.paste(a,(0,32));panel.paste(b,(a.width,32));d=ImageDraw.Draw(panel)
   d.text((12,8),'BEFORE / b8ddf2b',fill='white');d.text((a.width+12,8),'AFTER / source-faithful R4',fill='white')
   panel.save(C/name)
inventory=json.loads((E/'inventory/active-assets.json').read_text())
for r in inventory['records']:
 file=ROOT/'site'/r['path'].lstrip('/')
 if file.exists():
  r['sha256']=hashlib.sha256(file.read_bytes()).hexdigest()
  if file.suffix!='.svg':
   with Image.open(file) as im:r['dimensions']=im.size
 r['provenanceRegistry']='docs/codex-r3/ASSET_LICENSES.csv; docs/IMMERSIVE_R2_SOURCE_REGISTRY.csv'
 r['editableMaster']='artwork/r4/automation/automation-routed-rings-v01.blend' if '/r4/automation-' in r['path'] else 'NOT_ESTABLISHED'
 if 'home-complexity' in r['path'] or 'kernel-documentary' in r['path']:r['motionOwner']='site/js/frame-sequence-player.js; native scene-director phase'
 elif 'cap-0' in r['path'] or 'r4/automation-' in r['path']:r['motionOwner']='Home: site/index.html syncCapabilityVisual + scene-director.js; WebGL: forge-service-scene.js. Services: ascension-services-process.js + forge-kinetics-r2.js overlay'
 else:r['motionOwner']='NOT_YET_AUDITED'
inventory['remainingReview']='109 observed paths are not 109 independently reviewed artworks. Other assets remain UNAUDITED; no exhaustive frame coverage or full R4 acceptance claimed.'
(E/'inventory/active-assets.json').write_text(json.dumps(inventory,indent=2))
brand=[]
for p in (ROOT/'site/assets/brand').glob('*'):
 if p.is_file():
  rel=p.relative_to(ROOT).as_posix();before=subprocess.check_output(['git','show',f'b8ddf2b014d39d17b78aa5ff928ad2a2e79cc47e:{rel}'],cwd=ROOT)
  brand.append({'path':rel,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'identicalToStartingSHA':before==p.read_bytes()})
(E/'brand-immutability.json').write_text(json.dumps(brand,indent=2))
print(json.dumps({'comparisons':18,'brandFiles':len(brand),'brandUnchanged':all(r['identicalToStartingSHA'] for r in brand)}))
