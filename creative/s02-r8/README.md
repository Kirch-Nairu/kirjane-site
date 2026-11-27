# R8 asset-production workshop
The existing procedural R7 actors are provisional. This lane uses the original authored Microsoft Rocketbox Avatar Library source, MIT, pinned to 0943055db6ec570bcef9f2c8b41c9e5467c808f9. Source FBX and material textures are verified by Git blob SHA before import. No upstream source code is executed. The build converts a selected LOD of four differently modeled humans to locally packaged GLB, retains actual armatures/weights, generates a bone and material inventory, and renders isolated model evidence. This is an offline authoring lane; no asset is loaded from external servers at website runtime. No third-party code or asset is published to production.

Build locally from repository root using Python 3.12 and Blender 3.6+:
```sh
python creative/s02-r8/fetch_sources.py
blender -b -t 4 --python-exit-code 1 --python creative/s02-r8/workshop.py
```
Artifacts under dist/s02-r8-workshop/ include GLBs, source manifest, MIT license, actual asset PNGs and receipt with skin/mesh/bone/material inventory.

Integration gate: inspect actual render and materials; establish normalized axes and mapping from Rocketbox skeleton to native phase-driven IK; preserve physically measured hand contacts using the replacement mesh's real hand bones, verify sitting/feet/workstation alignment and visibility at all six viewport sizes. Do not simply attach an imported mesh to the old pose while leaving old contact anchors as proof. No artistic or integration acceptance until these gates are proven.

Hosted workshop uses the official Blender 4.5.16 LTS Linux distribution with its upstream SHA-256 checksum and bundled Python dependencies; the initial distribution package lacked NumPy. Source asset Git blob checks remain mandatory.
