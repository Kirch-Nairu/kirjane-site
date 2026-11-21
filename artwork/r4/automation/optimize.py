from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[3]
source=Path(__file__).resolve().parent
dest=root/'site/assets/cinematic/r4';dest.mkdir(exist_ok=True)
manifest=[]
for tone in ['dark','editorial']:
 for device in ['desktop','mobile']:
  im=Image.open(source/f'{tone}-{device}.png').convert('RGB')
  path=dest/f'automation-{tone}-{device}.webp'
  im.save(path,'WEBP',quality=86,method=6)
  manifest.append({'path':path.relative_to(root).as_posix(),'dimensions':im.size,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(source/'exports.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest,indent=2))
