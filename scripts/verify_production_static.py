"""Static source, local-resource and HTTP byte verification; not browser QA."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, quote
from urllib.request import urlopen
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import argparse, re, json, subprocess, tempfile, threading, functools, hashlib
ROOT=Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.ids=set();self.metadata={};self.scripts=[];self.inline=False;self.chunks=[];self.h1=0
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if t=='h1':self.h1+=1
  for k in ('src','href','poster'):
   if a.get(k):self.refs.append(a[k])
  if a.get('srcset'):self.refs.extend(x.strip().split()[0] for x in a['srcset'].split(',') if x.strip())
  if t=='meta' and (a.get('name') or a.get('property')):self.metadata[a.get('name') or a.get('property')]=a.get('content')
  if t=='script' and not a.get('src') and a.get('type','text/javascript') in ('module','text/javascript'):self.inline=True;self.chunks=[]
 def handle_endtag(self,t):
  if t=='script' and self.inline:self.scripts.append(''.join(self.chunks));self.inline=False
 def handle_data(self,d):
  if self.inline:self.chunks.append(d)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def audit(root):
 site=root/'site';parsed={};missing=[];checked=0;syntax=[]
 def ref(path,src):
  nonlocal checked
  u=urlsplit(src)
  if u.scheme or u.netloc or src.startswith('//'):return
  target=(site/unquote(u.path.lstrip('/'))) if u.path.startswith('/') else (path.parent/unquote(u.path) if u.path else path)
  if not target.exists():missing.append({'file':str(path.relative_to(site)),'reference':src,'kind':'missing-file'});return
  checked+=1
  if u.fragment and target.suffix=='.html' and target.resolve() in parsed and unquote(u.fragment) not in parsed[target.resolve()].ids:missing.append({'file':str(path.relative_to(site)),'reference':src,'kind':'missing-static-anchor'})
 for f in sorted(site.glob('*.html')):
  p=Parser();p.feed(f.read_text(encoding='utf-8'));parsed[f.resolve()]=p
 for f,p in parsed.items():
  for u in p.refs:ref(f,u)
  for i,s in enumerate(p.scripts):
   for m in re.finditer(r'''(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"](\.{1,2}/[^'"\n]+)['"]''',s):ref(f,m.group(1))
   for m in re.finditer(r'''['"](\./assets/[^'"\n${}]+\.(?:svg|webp|jpg|png|json))['"]''',s):ref(f,m.group(1))
   with tempfile.NamedTemporaryFile('w',encoding='utf-8',suffix='.mjs') as tmp:
    tmp.write(s);tmp.flush();res=subprocess.run(['node','--check',tmp.name],capture_output=True,text=True);syntax.append({'file':f.name+':inline:'+str(i),'ok':res.returncode==0,'error':res.stderr if res.returncode else ''})
 for f in sorted((site/'css').glob('*.css')):
  for m in re.finditer(r'''url\(\s*['"]?([^'"\)]+)['"]?\s*\)''',f.read_text(encoding='utf-8')):ref(f,m.group(1).strip())
 for f in sorted((site/'js').glob('*.js')):
  s=f.read_text(encoding='utf-8');res=subprocess.run(['node','--check',str(f)],capture_output=True,text=True);syntax.append({'file':str(f.relative_to(site)),'ok':res.returncode==0,'error':res.stderr if res.returncode else ''})
  for m in re.finditer(r'''(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"](\.{1,2}/[^'"\n]+)['"]''',s):ref(f,m.group(1))
  # Literal browser media paths resolve from the HTML document, not JS file.
  for m in re.finditer(r'''['"](\./assets/[^'"\n${}]+\.(?:svg|webp|jpg|png|json))['"]''',s):ref(site/'index.html',m.group(1))
 return {'pages':{f.name:{'h1_count':p.h1,'description':p.metadata.get('description'),'og_title':p.metadata.get('og:title'),'og_description':p.metadata.get('og:description')} for f,p in parsed.items()},'resource_references_checked':checked,'static_findings':missing,'syntax':syntax}

def http_check(root):
 site=root/'site';s=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(site)));threading.Thread(target=s.serve_forever,daemon=True).start();fail=[];count=0
 try:
  for f in sorted(site.rglob('*')):
   if not f.is_file():continue
   try:
    with urlopen(f'http://127.0.0.1:{s.server_port}/'+quote(f.relative_to(site).as_posix()),timeout=5) as resp:
     assert resp.status==200 and hashlib.sha256(resp.read()).digest()==hashlib.sha256(f.read_bytes()).digest()
    count+=1
   except Exception as e:fail.append({'file':str(f.relative_to(site)),'error':str(e)})
 finally:s.shutdown();s.server_close()
 return {'http_files_byte_matched':count,'failures':fail}
if __name__=='__main__':
 a=argparse.ArgumentParser(description=__doc__);a.add_argument('--baseline',type=Path);a.add_argument('--report',type=Path,default=ROOT/'dist/evidence/static-verification.json');args=a.parse_args();result=audit(ROOT);result['http']=http_check(ROOT)
 if args.baseline:
  baseline=audit(args.baseline.resolve());result['baseline_static_findings']=baseline['static_findings'];result['new_static_findings']=[x for x in result['static_findings'] if x not in baseline['static_findings']]
 else:result['new_static_findings']=result['static_findings']
 args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(result,indent=2),encoding='utf-8')
 print(json.dumps({'pages':len(result['pages']),'references':result['resource_references_checked'],'syntax_checked':len(result['syntax']),'syntax_failures':[x for x in result['syntax'] if not x['ok']],'static_findings':result['static_findings'],'new_static_findings':result['new_static_findings'],'http':result['http']},indent=2));assert not result['new_static_findings'] and not result['http']['failures'] and all(x['ok'] for x in result['syntax'])
