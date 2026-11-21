"""Build the isolated R2 cinematic site. No production publication or DNS changes."""
from pathlib import Path
import argparse, subprocess, os, sys, json, hashlib
ROOT=Path(__file__).resolve().parents[1]
CREATIVE=ROOT/'creative'
def run(cmd,cwd=ROOT):
    print('+',' '.join(map(str,cmd)),flush=True)
    subprocess.run([str(x) for x in cmd],cwd=cwd,check=True)
def build(output):
    output=output.resolve()
    if not output.is_relative_to(ROOT/'dist') or output.exists():
        raise SystemExit('Use a new output directory strictly inside dist/')
    # No untrusted install hooks. Root production dependencies remain independent.
    npm='npm.cmd' if os.name=='nt' else 'npm'
    if (CREATIVE/'package-lock.json').exists():
        run([npm,'ci','--ignore-scripts','--no-audit','--no-fund'],CREATIVE)
    else:
        run([npm,'install','--ignore-scripts','--no-audit','--no-fund'],CREATIVE)
    run([npm,'run','build'],CREATIVE)
    run([npm,'run','build:film'],CREATIVE)
    binary=ROOT/'site/js/forge-immersive-r2.js'
    film_binary=ROOT/'site/js/forge-salryn-cinema-r1.js'
    if not film_binary.is_file() or film_binary.stat().st_size<50000:
        raise SystemExit('Refusing placeholder: standalone Salryn Cinema R5 bundle was not built')
    if binary.stat().st_size<70000:
        raise SystemExit('Refusing fallback stub: R2 React bundle is missing or suspiciously small')
    run([sys.executable,'scripts/build.py','--preview','--output',str(output)])
    manifest=json.loads(output.with_name(output.name+'-manifest.json').read_text('utf-8'))
    for name in ['js/forge-immersive-r2.js','js/forge-immersive-r2.css',
                 'js/forge-salryn-cinema-r1.js','js/forge-salryn-cinema-loader.js',
                 'css/salryn-cinema-integration.css','motion-lab/index.html']:
        if name not in manifest:raise SystemExit('Missing R2 output asset: '+name)
    print('IMMERSIVE_R2_PREVIEW_BUILT files=',len(manifest),'bundleBytes=',binary.stat().st_size)
if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--output',type=Path,default=ROOT/'dist/immersive-r2')
    args=p.parse_args()
    build(args.output)
