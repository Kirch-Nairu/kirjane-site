"""Optimize the verified R8 GLB artifact without altering topology, skin or rig.
Only repack embedded image buffer views. Preserve original binary accessor bytes.
"""
import argparse, hashlib, io, json, struct
from pathlib import Path
from PIL import Image

def sha(data): return hashlib.sha256(data).hexdigest()
def pack(data): return data+b"\x00"*((-len(data))%4)
def optimize(src,dst):
    data=src.read_bytes()
    magic,ver,size=struct.unpack_from("<4sII",data)
    assert magic==b"glTF" and ver==2 and size==len(data)
    n,tag=struct.unpack_from("<I4s",data,12);assert tag==b"JSON"
    obj=json.loads(data[20:20+n])
    m,tag=struct.unpack_from("<I4s",data,20+n);assert tag==b"BIN\x00"
    binary=data[28+n:28+n+m]
    views=obj["bufferViews"]
    sources=[binary[v.get("byteOffset",0):v.get("byteOffset",0)+v["byteLength"]] for v in views]
    changed=set()
    for img in obj["images"]:
        idx=img["bufferView"]
        assert idx not in changed
        image=Image.open(io.BytesIO(sources[idx]))
        image.thumbnail((640,640),Image.Resampling.LANCZOS)
        b=io.BytesIO()
        if "A" in image.getbands() and image.getchannel("A").getextrema()[0]<255:
            image.convert("RGBA").save(b,format="PNG",optimize=True)
            img["mimeType"]="image/png"
        else:
            image.convert("RGB").save(b,format="JPEG",quality=89,subsampling=0,optimize=True)
            img["mimeType"]="image/jpeg"
        sources[idx]=b.getvalue();changed.add(idx)
    newbin=bytearray()
    for i,(view,chunk) in enumerate(zip(views,sources)):
        view["byteOffset"]=len(newbin);view["byteLength"]=len(chunk)
        newbin.extend(pack(chunk))
    obj["buffers"][0]["byteLength"]=len(newbin)
    j=json.dumps(obj,separators=(",",":"),ensure_ascii=False).encode()
    j+=b" "*((-len(j))%4)
    result=struct.pack("<4sII",b"glTF",2,28+len(j)+len(newbin))+struct.pack("<I4s",len(j),b"JSON")+j+struct.pack("<I4s",len(newbin),b"BIN\x00")+newbin
    dst.write_bytes(result)
    # Assert skin, bones, all vertex and index accessor data unchanged.
    for a in obj["accessors"]:
        idx=a.get("bufferView")
        if idx is not None:
            assert idx not in changed
            v=views[idx];assert bytes(newbin[v["byteOffset"]:v["byteOffset"]+v["byteLength"]])==sources[idx]
    assert len(obj["skins"])==1 and len(obj["skins"][0]["joints"])==80
    return {"role":src.stem,"sourceSha256":sha(data),"sha256":sha(result),"sourceBytes":len(data),"bytes":len(result),"bones":len(obj["skins"][0]["joints"]),"primitives":sum(len(m["primitives"]) for m in obj["meshes"])}

if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("source",type=Path);p.add_argument("destination",type=Path);a=p.parse_args()
    a.destination.mkdir(parents=True,exist_ok=True)
    receipt=json.loads((a.source/"asset-receipt.json").read_text())
    rows=[]
    for item in receipt:
        src=a.source/(item["role"]+".glb")
        assert sha(src.read_bytes())==item["sha256"],"source digest mismatch"
        rows.append(optimize(src,a.destination/src.name))
    assert len(rows)==4 and sum(r["bytes"] for r in rows)<6*1024*1024
    for name in ["LICENSE-Microsoft-Rocketbox.md","source-manifest.json"]:
        (a.destination/name).write_bytes((a.source/name).read_bytes())
    (a.destination/"runtime-receipt.json").write_text(json.dumps(rows,indent=2)+"\n")
    print(json.dumps(rows,indent=2))
