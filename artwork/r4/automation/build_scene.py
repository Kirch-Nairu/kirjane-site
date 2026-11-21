"""Original R4 reconstruction of the active R3 three-ring/four-conduit subject.
Run only through the verified local Blender MCP. Does not clear existing scenes.
"""
import bpy, math, os, json
from mathutils import Vector
ROOT = r'C:\Users\arane\KirionLabs\kirjane-creative-lab\r4-remaster'
OUT = os.path.join(ROOT, 'artwork', 'r4', 'automation')
os.makedirs(OUT, exist_ok=True)
original = bpy.context.scene
scene = bpy.data.scenes.new('R4_AUTOMATION_ROUTED_RINGS_v01')
scene.render.engine = original.render.engine
scene.render.resolution_x=1280; scene.render.resolution_y=800; scene.render.resolution_percentage=60
scene.render.image_settings.file_format='PNG'
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
world=bpy.data.worlds.new('R4 / controlled studio'); world.use_nodes=True; scene.world=world
world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.06,.09,.075,1)
world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.4
def mat(name,c,metal=.0,rough=.3,emit=0):
 m=bpy.data.materials.new(name);m.use_nodes=True
 p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
 p.inputs['Base Color'].default_value=(*c,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 p.inputs['Coat Weight'].default_value=.3;p.inputs['Coat Roughness'].default_value=.2
 if emit:p.inputs['Emission Color'].default_value=(*c,1);p.inputs['Emission Strength'].default_value=emit
 return m
emerald=mat('01 / deep emerald ceramic',(.018,.19,.105),.55,.23)
silver=mat('02 / satin machined silver',(.47,.57,.53),.82,.26)
cyan=mat('03 / cyan route enamel',(.035,.42,.4),.55,.26,.12)
lime=mat('04 / restrained lime decision',(.61,.81,.19),.35,.25,.14)
amber=mat('05 / amber route sleeve',(.65,.29,.055),.65,.26)
ground=mat('06 / obsidian cyclorama',(.007,.017,.011),.12,.5)
def obj(name,mesh,material):
 o=bpy.data.objects.new(name,mesh);scene.collection.objects.link(o);o.data.materials.append(material);return o
def tube(name,points,r,material,cyclic=False):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=24;c.bevel_depth=r;c.bevel_resolution=5
 s=c.splines.new('POLY');s.points.add(len(points)-1)
 for p,v in zip(s.points,points):p.co=(*v,1)
 s.use_cyclic_u=cyclic
 return obj(name,c,material)
def ringpoints(x,angle,r,yoff=0):
 a=math.radians(angle)
 return [(x+r*math.cos(t)*math.cos(a),yoff+r*math.cos(t)*math.sin(a),r*math.sin(t)) for t in [i*2*math.pi/256 for i in range(256)]]
for i,(x,a) in enumerate([(-3.05,12),(0,33),(3.05,63)]):
 tube(f'GATE {i+1} / continuous emerald body',ringpoints(x,a,1.38),.065,lime if i==1 else emerald,True)
 tube(f'GATE {i+1} / silver outer edge',ringpoints(x,a,1.424,-.015),.014,silver,True)
 tube(f'GATE {i+1} / recessed inner edge',ringpoints(x,a,1.335,.014),.019,lime if i==1 else cyan,True)
 # Visible depth is authored as a continuous rear lip, not a new silhouette.
 tube(f'GATE {i+1} / rear metal return',ringpoints(x,a,1.38,.085),.036,silver,True)
for lane,z in enumerate([.64,.20,-.27,-.72]):
 pts=[]
 for i in range(201):
  x=-6.7+13.4*i/200
  zz=z+.12*math.sin(x*.56+lane*.6)+(.025*(lane-1.5))*x
  pts.append((x,.14+lane*.10,zz))
 tube(f'ROUTE {lane+1} / continuous spline',pts,.025,lime if lane==2 else cyan)
 # Short metal couplings along the same conduit clarify direction without UI props.
 for x0 in [-2.35,1.15]:
  p=[v for v in pts if x0<=v[0]<=x0+.16]
  if len(p)>1:tube(f'ROUTE {lane+1} / silver ferrule {x0}',p,.038,amber if lane==2 else silver)
# Studio backdrop behind subject, outside silhouettes.
mesh=bpy.data.meshes.new('Cyclorama plane');mesh.from_pydata([(-200,4,-200),(200,4,-200),(200,4,200),(-200,4,200)],[],[(0,1,2,3)])
obj('STUDIO / seamless backdrop',mesh,ground)
# A constant studio sweep avoids distracting light pools behind the thin routes.
nt=ground.node_tree; nt.nodes.clear()
em=nt.nodes.new('ShaderNodeEmission');em.inputs['Color'].default_value=(.007,.018,.012,1)
output=nt.nodes.new('ShaderNodeOutputMaterial');nt.links.new(em.outputs[0],output.inputs['Surface'])
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
def light(name,pos,power,color,size):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.color=color;d.shape='DISK';d.size=size
 o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos;aim(o,(0,0,0));return o
light('KEY / long silver softbox',(-3,-5,5),1100,(.86,.95,1),6)
light('RIM / emerald separator',(4,1,3),950,(.42,1,.68),4)
light('EDGE / warm decision highlight',(-1,-1,-4),650,(1,.78,.45),3)
def camera(name,pos,scale):
 d=bpy.data.cameras.new(name);d.type='ORTHO';d.ortho_scale=scale
 o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos;aim(o,(0,0,0));return o
desktop=camera('CAMERA / desktop three gates',(0,-18,2.6),11.6)
mobile=camera('CAMERA / compact oblique three gates',(4,-18,3.8),10.6)
scene.camera=desktop
scene['source_sha']='b8ddf2b014d39d17b78aa5ff928ad2a2e79cc47e'
scene['source_subject']='Three standing rings and four routed conduits. No approval-machine assets used.'
scene['rights']='Original procedural reconstruction by Codex for Kirch; no external assets or textures.'
bpy.data.libraries.write(os.path.join(OUT,'automation-routed-rings-v01.blend'),{scene},fake_user=True)
scene.render.filepath=os.path.join(OUT,'pilot-dark.png')
bpy.ops.render.render(write_still=True,scene=scene.name)
print(json.dumps({'scene':scene.name,'pilot':scene.render.filepath,'objects':len(scene.objects),'original_scene_preserved':bpy.context.scene==original}))
