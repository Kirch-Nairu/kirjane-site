"""Acquire CC0 Poly Haven materials at authoring time; record exact content hashes.
No runtime requests. Source files verified against the provider's published MD5.
"""
import hashlib,io,json,math,urllib.request
from pathlib import Path
from PIL import Image
import cv2
import numpy as np

OUT=Path("site/assets/cinematic/s02-materials")
OUT.mkdir(parents=True,exist_ok=True)
receipt=[]
def get(url):
    assert url.startswith("https://")
    with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":"Kirjane-R8-Studio/1.0 (CC0 asset authoring)"}),timeout=90) as r:
        return r.read()
def source(id,key,fmt):
    meta=json.loads(get("https://api.polyhaven.com/files/"+id))
    spec=meta[key]["1k"][fmt]
    url=spec["url"]
    assert url.startswith("https://dl.polyhaven.org/") or url.startswith("https://cdn.polyhaven.com/")
    raw=get(url)
    assert len(raw)==spec["size"] and hashlib.md5(raw).hexdigest()==spec["md5"]
    receipt.append({"asset":id,"license":"CC0","credit":"Poly Haven","source":"https://polyhaven.com/a/"+id,"url":url,"md5":spec["md5"],"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw)})
    return raw
def texture(id,name):
    im=Image.open(io.BytesIO(source(id,"diff","jpg"))).convert("RGB")
    im.thumbnail((1024,1024),Image.Resampling.LANCZOS)
    im.save(OUT/name,quality=91,subsampling=0,optimize=True)
texture("european_walnut_veneer_04","walnut.jpg")
texture("white_plaster_02","plaster.jpg")
raw=source("green_point_park","hdri","hdr")
hdr=cv2.imdecode(np.frombuffer(raw,dtype=np.uint8),cv2.IMREAD_UNCHANGED)
assert hdr is not None and hdr.ndim==3 and hdr.dtype==np.float32
hdr=np.maximum(hdr[:,:,::-1],0)
def perspective(yaw,width,height):
    x=(np.arange(width)+.5-width/2)/(width/2)*math.tan(math.radians(47))
    y=-(np.arange(height)+.5-height/2)/(width/2)*math.tan(math.radians(47))-.04
    X,Y=np.meshgrid(x,y);Z=np.ones_like(X)
    angle=np.arctan2(X,Z)+yaw
    latitude=np.arctan2(Y,np.sqrt(X*X+Z*Z))
    u=((angle/(2*math.pi)+.5)%1)*hdr.shape[1]-.5
    v=(.5-latitude/math.pi)*hdr.shape[0]-.5
    frame=cv2.remap(hdr,u.astype(np.float32),v.astype(np.float32),cv2.INTER_LINEAR,borderMode=cv2.BORDER_WRAP)
    exposure=.68/max(.07,np.percentile(frame,72))
    linear=np.maximum(frame*exposure,0)
    tone=np.clip((linear*(2.51*linear+.03))/(linear*(2.43*linear+.59)+.14),0,1)
    rgb=np.where(tone<=.0031308,12.92*tone,1.055*tone**(1/2.4)-.055)
    return np.uint8(np.clip(rgb*255,0,255))
def score(im):
    a=im.astype(float)/255
    # Prefer a garden-facing window: foliage below the horizon, daylight above.
    lower=a[a.shape[0]//2:];upper=a[:a.shape[0]//2]
    green=np.mean((lower[:,:,1]>lower[:,:,0]*1.04)&(lower[:,:,1]>lower[:,:,2]*1.08))
    sky=np.mean((upper[:,:,2]>=upper[:,:,0]*.98)&(upper.mean(axis=2)>.50))
    return green+sky*.6
yaw=max((i*math.pi/6 for i in range(12)),key=lambda y:score(perspective(y,320,160)))
im=Image.fromarray(perspective(yaw,1536,768))
im.save(OUT/"garden-vista.jpg",quality=92,subsampling=0,optimize=True)
files=[{"path":p.name,"sha256":hashlib.sha256(p.read_bytes()).hexdigest(),"bytes":p.stat().st_size} for p in sorted(OUT.glob("*.jpg"))]
assert len(files)==3 and sum(x["bytes"] for x in files)<2*1024*1024
(OUT/"source-receipt.json").write_text(json.dumps({"sourceAssets":receipt,"generated":files,"windowYawRadians":yaw},indent=2)+"\n")
(OUT/"LICENSE.md").write_text("# CC0 material sources\nEuropean Walnut Veneer 04, White Plaster 02 and Green Point Park by Poly Haven, released under CC0. See source-receipt.json for source URLs and exact file digests. Window photograph is a perspective crop and tone map of the source HDRI.\n")
print(json.dumps(files,indent=2))
