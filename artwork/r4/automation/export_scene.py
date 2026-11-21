"""Export the same ring subject for both existing routes and separate phone framing."""
import bpy,os,json
ROOT=r'C:\Users\arane\KirionLabs\kirjane-creative-lab\r4-remaster'
OUT=os.path.join(ROOT,'artwork','r4','automation')
scene=bpy.data.scenes['R4_AUTOMATION_ROUTED_RINGS_v01']
backdrop=scene.objects['STUDIO / seamless backdrop'].data.materials[0]
em=next(n for n in backdrop.node_tree.nodes if n.type=='EMISSION')
files=[]
for tone in ['dark','editorial']:
 em.inputs['Color'].default_value=(.007,.018,.012,1) if tone=='dark' else (.78,.83,.76,1)
 for device in ['desktop','mobile']:
  scene.camera=scene.objects['CAMERA / desktop three gates' if device=='desktop' else 'CAMERA / compact oblique three gates']
  scene.render.resolution_x=1280 if device=='desktop' else 960
  scene.render.resolution_y=800 if device=='desktop' else 800
  scene.render.resolution_percentage=100
  scene.render.filepath=os.path.join(OUT,f'{tone}-{device}.png')
  bpy.ops.render.render(write_still=True,scene=scene.name);files.append(scene.render.filepath)
em.inputs['Color'].default_value=(.007,.018,.012,1)
scene.camera=scene.objects['CAMERA / desktop three gates']
scene.render.resolution_x=1280;scene.render.resolution_y=800
bpy.data.libraries.write(os.path.join(OUT,'automation-routed-rings-v01.blend'),{scene},fake_user=True)
print(json.dumps({'exports':files,'open_scene_preserved':bpy.context.scene.name}))
