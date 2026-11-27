"""R9 studio furniture: authored Blender meshes in stage units; no third-party geometry.
All templates have local origins at their mounting points, named material slots,
applied bevels and UVs. Export only the dedicated collection, never the open project.
"""
import bpy, math, json, hashlib
from mathutils import Vector
from pathlib import Path

def build_studio():
    coll=bpy.data.collections.new("Kirjane R9 furniture atelier")
    bpy.context.scene.collection.children.link(coll)
    def move(o):
        for c in list(o.users_collection): c.objects.unlink(o)
        coll.objects.link(o)
        return o
    def material(name,color,roughness,metal=0):
        m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
        p=next(n for n in m.node_tree.nodes if n.type=="BSDF_PRINCIPLED")
        p.inputs["Base Color"].default_value=(*color,1);p.inputs["Roughness"].default_value=roughness;p.inputs["Metallic"].default_value=metal
        return m
    wood=material("R9 Walnut",(.39,.22,.12),.40)
    frame=material("R9 Graphite",(.043,.055,.055),.42,.48)
    fabric=material("R9 Textile",(.06,.20,.19),.94)
    seam=material("R9 Piping",(.035,.09,.085),.87)
    bronze=material("R9 Brass",(.48,.31,.12),.29,.72)
    lamp=material("R9 Lamp enamel",(.042,.16,.15),.32)
    white=material("R9 Diffuser",(.90,.83,.64),.48)
    p=next(n for n in white.node_tree.nodes if n.type=="BSDF_PRINCIPLED")
    p.inputs["Emission Color"].default_value=(1,.81,.53,1);p.inputs["Emission Strength"].default_value=.75
    ceramic=material("R9 Ceramic",(.30,.16,.095),.58)
    foliage=material("R9 Foliage",(.09,.27,.11),.70)
    vein=material("R9 Leaf veins",(.19,.37,.15),.76)
    soil=material("R9 Soil",(.045,.027,.018),.99)
    templates={}
    def begin(name):
        o=bpy.data.objects.new(name,None);coll.objects.link(o);templates[name]=o;return o
    def finish(o,parent,m,bevel=0):
        move(o);o.parent=parent;o.data.materials.append(m)
        if bevel:
            bpy.context.view_layer.objects.active=o;o.select_set(True)
            mod=o.modifiers.new("Manufactured edge radius","BEVEL");mod.width=bevel;mod.segments=3
            bpy.ops.object.modifier_apply(modifier=mod.name)
            mod=o.modifiers.new("Weighted surface normals","WEIGHTED_NORMAL")
            bpy.ops.object.modifier_apply(modifier=mod.name)
        return o
    def box(parent,name,loc,dim,m,bevel=.025):
        bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dim
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        return finish(o,parent,m,bevel)
    def cone(parent,name,loc,r1,r2,depth,m,bevel=.008,verts=32):
        bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r1,radius2=r2,depth=depth,location=loc)
        o=bpy.context.object;o.name=name
        for f in o.data.polygons:f.use_smooth=len(f.vertices)==4
        return finish(o,parent,m,bevel)
    def rod(parent,name,a,b,r,m):
        a,b=Vector(a),Vector(b);d=b-a
        o=cone(parent,name,(a+b)/2,r,r,d.length,m,.002,16)
        o.rotation_euler=d.to_track_quat("Z","Y").to_euler();return o
    # Z-up authoring, converted to Y-up by glTF: browser +Z corresponds to Blender -Y.
    d=begin("Desk")
    box(d,"Thin walnut worktop",(0,0,1.075),(2.50,1.30,.080),wood,.025)
    box(d,"Concealed underframe",(0,0,1.007),(2.34,1.14,.060),frame,.012)
    for x in (-1.07,1.07):
        for y in (-.49,.49):
            box(d,"Square steel leg",(x,y,.50),(.068,.068,1.0),frame,.008)
            box(d,"Leveling foot",(x,y,.024),(.088,.088,.048),seam,.009)
        box(d,"End stretcher",(x,0,.91),(.065,1.06,.085),frame,.010)
    box(d,"Rear cable trough",(0,.43,.94),(1.96,.15,.12),frame,.018)
    c=begin("Chair")
    box(c,"Molded shell seat",(0,0,.535),(.76,.65,.105),wood,.07)
    box(c,"Upholstered seat cushion",(0,-.018,.615),(.72,.59,.115),fabric,.08)
    # Curved back surface, built with an explicit grid and thickened.
    verts=[];faces=[];nx=12;nz=10
    for j in range(nz+1):
        v=j/nz
        for i in range(nx+1):
            u=i/nx*2-1
            verts.append((u*(.32+.045*math.sin(v*math.pi)),.27+.095*(1-u*u)+.045*v,.67+.59*v-.055*u*u))
    for j in range(nz):
        for i in range(nx):
            a=j*(nx+1)+i;faces.append((a,a+1,a+nx+2,a+nx+1))
    me=bpy.data.meshes.new("Ergonomic curved back");me.from_pydata(verts,[],faces);me.update()
    o=bpy.data.objects.new("Upholstered curved back",me);coll.objects.link(o);o.parent=c;me.materials.append(fabric)
    bpy.context.view_layer.objects.active=o;bpy.ops.object.select_all(action="DESELECT");o.select_set(True)
    mod=o.modifiers.new("Cushion thickness","SOLIDIFY");mod.thickness=.065;bpy.ops.object.modifier_apply(modifier=mod.name)
    mod=o.modifiers.new("Soft cushion perimeter","BEVEL");mod.width=.028;mod.segments=3;bpy.ops.object.modifier_apply(modifier=mod.name)
    for f in me.polygons:f.use_smooth=True
    for x in (-.26,.26):
        for y in (-.22,.23):
            rod(c,"Splayed steel leg",(x*1.16,y*1.13,.025),(x,y,.52),.028,frame)
        rod(c,"Curved back support",(x,.20,.50),(x,.32,.98),.024,frame)
    t=begin("MeetingTable")
    cone(t,"Beveled circular walnut top",(0,0,1.075),1.19,1.19,.080,wood,.024,64)
    cone(t,"Undertop structural ring",(0,0,1.007),1.05,1.05,.055,frame,.014,48)
    cone(t,"Tapered pedestal",(0,0,.52),.28,.23,.94,wood,.018,48)
    cone(t,"Recessed plinth",(0,0,.055),.55,.51,.11,frame,.018,48)
    l=begin("TaskLamp")
    cone(l,"Weighted lamp foot",(0,0,.035),.13,.12,.07,frame,.012)
    rod(l,"Lower arm",(0,0,.068),(0,0,.47),.018,bronze)
    rod(l,"Upper arm",(0,0,.47),(.26,-.10,.63),.017,bronze)
    for x,y,z in [(0,0,.47),(.26,-.10,.63)]:
        cone(l,"Pivot joint",(x,y,z),.044,.044,.055,bronze,.005)
    cone(l,"Spun metal shade",(.26,-.10,.57),.135,.065,.17,lamp,.008,40)
    cone(l,"Warm diffuser",(.26,-.10,.488),.119,.119,.012,white,.002,40)
    p=begin("Plant")
    cone(p,"Ceramic planter",(0,0,.205),.22,.30,.41,ceramic,.025,40)
    cone(p,"Inset soil",(0,0,.413),.253,.253,.022,soil,.004)
    # Curved leaf surfaces, with asymmetric lance-shaped silhouette and midrib.
    for i in range(12):
        angle=i*2.39996323;rad=.17+(i%4)*.067;h=.71+(i%5)*.12
        tip=Vector((math.sin(angle)*rad,math.cos(angle)*rad,h))
        base=Vector((math.sin(angle)*.04,math.cos(angle)*.04,.42))
        rod(p,"Leaf stem",base,tip,.009,vein)
        axis=Vector((math.sin(angle)*.56,math.cos(angle)*.56,.40)).normalized()
        cross=Vector((math.cos(angle),-math.sin(angle),0))
        vs=[];fs=[]
        for j in range(9):
            t0=j/8;center=tip+axis*(t0*.32)+Vector((0,0,math.sin(t0*math.pi)*.065))
            w=.105*math.sin(math.pi*t0)**.75+.003
            for k in range(5):
                u=k/2-1;vs.append(tuple(center+cross*(u*w)+Vector((0,0,-abs(u)*w*.35))))
        for j in range(8):
            for k in range(4):
                a=j*5+k;fs.append((a,a+1,a+6,a+5))
        me=bpy.data.meshes.new("Botanical blade");me.from_pydata(vs,[],fs);me.update()
        o=bpy.data.objects.new("Curved leaf",me);coll.objects.link(o);o.parent=p;me.materials.append(foliage)
        for f in me.polygons:f.use_smooth=True
    # Merge by material per template: bounded draw calls, not one mesh per leg.
    for name,root in templates.items():
        buckets={}
        for obj in list(root.children):
            if obj.type=="MESH":buckets.setdefault(obj.data.materials[0],[]).append(obj)
        for m,objs in buckets.items():
            bpy.ops.object.select_all(action="DESELECT")
            for obj in objs:obj.select_set(True)
            bpy.context.view_layer.objects.active=objs[0]
            if len(objs)>1:bpy.ops.object.join()
            obj=bpy.context.object;obj.name=name+" / "+m.name
            obj.parent=root
            # Apply mesh transforms but preserve the template-local origin.
            bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    bpy.context.view_layer.update()
    return coll,templates

def export_studio(path,coll,templates):
    bpy.ops.object.select_all(action="DESELECT")
    for o in coll.objects:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(path),export_format="GLB",use_selection=True,export_animations=False)
    raw=path.read_bytes();n=int.from_bytes(raw[12:16],"little");gltf=json.loads(raw[20:20+n])
    assert all(any(n.get("name")==k for n in gltf["nodes"]) for k in templates)
    counts={k:sum(len(o.data.polygons) for o in v.children if o.type=="MESH") for k,v in templates.items()}
    assert len(raw)<3*1024*1024
    receipt={"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw),"templates":list(templates),"polygons":counts,"source":"Original Kirjane R9 Blender workshop"}
    path.with_suffix(".json").write_text(json.dumps(receipt,indent=2)+"\n")
    print(receipt)

if __name__=="__main__":
    bpy.ops.wm.read_factory_settings(use_empty=True)
    c,t=build_studio()
    output=Path("site/assets/cinematic/s02-furniture/studio.glb");output.parent.mkdir(parents=True,exist_ok=True)
    export_studio(output,c,t)
