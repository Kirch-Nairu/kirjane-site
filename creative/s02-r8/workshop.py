"""Blender-only authored-asset workshop. No runtime fetch, no fake rig claim.
Preserve original weighted bones, select a single LOD, normalize to metres,
rebuild materials from verified source textures, export and inspect GLB.
This is an asset qualification stage, not an integration into S02's live rig.
"""
import bpy
import hashlib
import json
import math
from mathutils import Vector
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "dist" / "s02-r8-source"
OUT = ROOT / "dist" / "s02-r8-workshop"
MANIFEST = json.loads((Path(__file__).parent / "manifest.json").read_text())
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "LICENSE-Microsoft-Rocketbox.md").write_bytes((SOURCE / "LICENSE.md").read_bytes())
(OUT / "source-manifest.json").write_text(json.dumps(MANIFEST, indent=2))
receipts = []

def mesh_bounds(objects):
    points = [o.matrix_world @ Vector(c) for o in objects for c in o.bound_box]
    return Vector(tuple(min(p[i] for p in points) for i in range(3))), Vector(tuple(max(p[i] for p in points) for i in range(3)))

def texture_image(path, noncolor=False):
    image = bpy.data.images.load(str(path), check_existing=True)
    image.colorspace_settings.name = "Non-Color" if noncolor else "sRGB"
    w, h = image.size[:]
    limit = 768 if noncolor else 1024
    if max(w, h) > limit:
        ratio = limit / max(w, h)
        image.scale(max(1, round(w*ratio)), max(1, round(h*ratio)))
    image.pack()
    return image

def rematerialize(meshes, folder):
    info = []
    files = list(folder.glob("*.tga"))
    images = {}
    materials = {m for o in meshes for m in o.data.materials if m}
    for mat in sorted(materials, key=lambda m:m.name):
        # Prefer original imported diffuse image role, otherwise semantic name.
        original = [n.image.name.lower() for n in mat.node_tree.nodes if n.type=="TEX_IMAGE" and n.image] if mat.use_nodes else []
        tag = (mat.name.lower() + " " + " ".join(original))
        kind = "head" if any(k in tag for k in ("head", "face", "skin", "hair")) else "body"
        if any(k in tag for k in ("opacity", "hair", "lash", "glass")):
            opacity = [p for p in files if "opacity_color" in p.name and ("glass" in p.name)==("glass" in tag)]
        else:
            opacity = []
        exact=[p for p in files if p.stem.lower()==mat.name.lower().split(".")[0]+"_color"]
        color_candidates = exact or opacity or [p for p in files if p.name.endswith("_"+kind+"_color.tga")]
        normal_candidates = [p for p in files if p.name.endswith("_"+kind+"_normal.tga")]
        if not color_candidates:
            raise RuntimeError("Unresolved material: "+mat.name)
        color = color_candidates[0]
        opacity = [color] if "opacity" in color.name else []
        mat.use_nodes = True
        nt=mat.node_tree;nt.nodes.clear()
        shader=nt.nodes.new("ShaderNodeBsdfPrincipled");shader.inputs["Roughness"].default_value=.72
        output=nt.nodes.new("ShaderNodeOutputMaterial");nt.links.new(shader.outputs["BSDF"],output.inputs["Surface"])
        tex=nt.nodes.new("ShaderNodeTexImage")
        if str(color) not in images: images[str(color)]=texture_image(color)
        tex.image=images[str(color)];nt.links.new(tex.outputs["Color"],shader.inputs["Base Color"])
        if opacity:
            nt.links.new(tex.outputs["Alpha"],shader.inputs["Alpha"])
            if hasattr(mat,"surface_render_method"): mat.surface_render_method="DITHERED"
            elif hasattr(mat,"blend_method"): mat.blend_method="CLIP"
        if normal_candidates and not opacity:
            normal=normal_candidates[0];ntex=nt.nodes.new("ShaderNodeTexImage")
            if str(normal) not in images: images[str(normal)]=texture_image(normal,True)
            ntex.image=images[str(normal)];node=nt.nodes.new("ShaderNodeNormalMap");node.inputs["Strength"].default_value=.65
            nt.links.new(ntex.outputs["Color"],node.inputs["Color"]);nt.links.new(node.outputs["Normal"],shader.inputs["Normal"])
        info.append({"name":mat.name,"original":original,"color":color.name,"normal":normal_candidates[0].name if normal_candidates and not opacity else None})
    return info

def aim(o, point):
    o.rotation_euler=(Vector(point)-o.location).to_track_quat("-Z","Y").to_euler()

def render_card(role, meshes, lo, hi):
    scene=bpy.context.scene
    scene.render.engine="CYCLES";scene.cycles.device="CPU";scene.cycles.samples=16;scene.cycles.use_denoising=True
    scene.render.resolution_x=720;scene.render.resolution_y=900;scene.render.resolution_percentage=100
    world=bpy.data.worlds.new("Studio world");world.use_nodes=True;world.node_tree.nodes["Background"].inputs[0].default_value=(.18,.22,.24,1);world.node_tree.nodes["Background"].inputs[1].default_value=.55;scene.world=world
    center=(lo+hi)*.5;height=hi.z-lo.z
    # Use front assumption as explicit evidence, not hide a flipped rig.
    bpy.ops.object.camera_add(location=(center.x+height*.43,center.y-height*2.1,center.z+height*.16))
    cam=bpy.context.object;aim(cam,center);cam.data.type="ORTHO";cam.data.ortho_scale=height*1.22;scene.camera=cam
    for name,loc,energy,color,size in [
        ("warm key",(center.x-2,center.y-3,hi.z+1.4),700,(1,.83,.67),3),
        ("cool fill",(center.x+2,center.y-1,hi.z+.3),330,(.70,.85,1),2.5),
        ("rim",(center.x,center.y+2,hi.z+1),550,(.85,.95,1),2.0)]:
        bpy.ops.object.light_add(type="AREA",location=loc);light=bpy.context.object;light.name=name;light.data.energy=energy;light.data.color=color;light.data.shape="DISK";light.data.size=size;aim(light,center)
    bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,lo.z-.01))
    floor=bpy.context.object;floor.name="Evidence ground only"
    mat=bpy.data.materials.new("Evidence ground");mat.diffuse_color=(.12,.16,.17,1);mat.use_nodes=True;mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value=(.12,.16,.17,1);floor.data.materials.append(mat)
    scene.render.image_settings.file_format="PNG";scene.render.filepath=str(OUT/(role+"-asset.png"));bpy.ops.render.render(write_still=True)

for item in MANIFEST["assets"]:
    role=item["role"];folder=SOURCE/role
    bpy.ops.wm.read_factory_settings(use_empty=True)
    fbx=folder/(item["name"]+".fbx")
    # Blender 5 replaced the legacy FBX importer; query actual operator RNA.
    importer=bpy.ops.import_scene.fbx
    props={p.identifier for p in importer.get_rna_type().properties}
    options={"filepath":str(fbx)}
    for key,value in {"use_image_search":True,"automatic_bone_orientation":False}.items():
        if key in props: options[key]=value
    importer(**options)
    print("IMPORT",role,bpy.app.version_string,[(o.name,o.type) for o in bpy.context.scene.objects],flush=True)
    bpy.context.view_layer.update()
    all_meshes=[o for o in bpy.context.scene.objects if o.type=="MESH"]
    rig=[o for o in bpy.context.scene.objects if o.type=="ARMATURE"]
    if not rig or not all_meshes:
        raise RuntimeError("Expected actual weighted mesh and armature: "+role)
    # Rocketbox carries several LODs. Prefer midpoly, then lowpoly, then hipoly.
    named=[o for o in all_meshes if "midpoly" in o.name.lower()]
    if not named: named=[o for o in all_meshes if "lowpoly" in o.name.lower() and "ultra" not in o.name.lower()]
    if not named: named=[o for o in all_meshes if "hipoly" in o.name.lower()]
    if named:
        # Keep unnamed accessories only if they are not alternate LODs.
        meshes=named+[o for o in all_meshes if not any(k in o.name.lower() for k in ("midpoly","lowpoly","hipoly","ultrapoly"))]
        for o in all_meshes:
            if o not in meshes: bpy.data.objects.remove(o,do_unlink=True)
    else: meshes=all_meshes
    weighted=[o for o in meshes if o.vertex_groups and any(m.type=="ARMATURE" for m in o.modifiers)]
    if not weighted: raise RuntimeError("No weighted meshes after LOD selection")
    # Clear animation so the source rest pose is explicit.
    for o in bpy.context.scene.objects:
        if o.animation_data: o.animation_data_clear()
        if o.type=="ARMATURE":
            for bone in o.pose.bones: bone.matrix_basis.identity()
    bpy.context.view_layer.update()
    lo,hi=mesh_bounds(meshes);height=hi.z-lo.z
    if not math.isfinite(height) or height<.001: raise RuntimeError("invalid imported dimensions")
    # Entire hierarchy normalized uniformly; do not bake bone rotations or weights away.
    scale=1.72/height
    roots=[o for o in bpy.context.scene.objects if o.parent is None]
    parent=bpy.data.objects.new("S02_asset_root",None);bpy.context.collection.objects.link(parent)
    for o in roots:
        original=o.matrix_world.copy();o.parent=parent;o.matrix_world=original
    parent.scale=(scale,scale,scale)
    parent.location=(-((lo.x+hi.x)*.5)*scale,-((lo.y+hi.y)*.5)*scale,-lo.z*scale)
    bpy.context.view_layer.update()
    lo,hi=mesh_bounds(meshes)
    materials=rematerialize(meshes,folder)
    # Use smooth authored surfaces; normals remain from source.
    for o in meshes:
        for poly in o.data.polygons: poly.use_smooth=True
        o.data.calc_loop_triangles()
    output=OUT/(role+".glb")
    exporter=bpy.ops.export_scene.gltf
    export_props={p.identifier for p in exporter.get_rna_type().properties}
    options={"filepath":str(output),"export_format":"GLB"}
    for key,value in {"export_animations":False,"export_skins":True,"export_apply":False}.items():
        if key in export_props: options[key]=value
    exporter(**options)
    raw=output.read_bytes()
    if raw[:4]!=b"glTF": raise RuntimeError("invalid GLB")
    jslen=int.from_bytes(raw[12:16],"little")
    gltf=json.loads(raw[20:20+jslen].decode("utf-8"))
    if not gltf.get("skins") or not gltf.get("meshes"): raise RuntimeError("GLB lost rig or mesh")
    row={"role":role,"source":item["name"],"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw),"bounds":[list(lo),list(hi)],"triangles":sum(len(o.data.loop_triangles) for o in meshes),"meshes":[o.name for o in meshes],"weightedMeshes":[o.name for o in weighted],"materials":materials,"bones":[{"name":b.name,"parent":b.parent.name if b.parent else None,"head":list(a.matrix_world @ b.head_local),"tail":list(a.matrix_world @ b.tail_local)} for a in rig for b in a.data.bones],"skins":len(gltf["skins"]),"textures":len(gltf.get("textures",[]))}
    receipts.append(row)
    (OUT/"asset-receipt.json").write_text(json.dumps(receipts,indent=2))
    print("ASSET",role,"weighted",len(weighted),"triangles",row["triangles"],"bytes",len(raw),"bones",len(row["bones"]),flush=True)
    render_card(role,meshes,lo,hi)
