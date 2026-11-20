"""Build the reviewed static site. No upload, DNS, or deployment action."""
import argparse,html,json,hashlib,os,re,shutil
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]
PAGES=('index','salryn','services','projects','process','about','contact')
def build(output,preview=False):
 output=output.resolve()
 if output==ROOT or not output.is_relative_to(ROOT/'dist') or output.exists():
  raise ValueError('Use a fresh directory inside dist/. Existing outputs are preserved.')
 output.mkdir(parents=True)
 shutil.copytree(ROOT/'site',output,dirs_exist_ok=True,ignore=shutil.ignore_patterns('LOCAL-RUN.md','*.webm','qa-renders'))
 origin='https://kirjane.tech'
 for page in PAGES:
  file=output/(page+'.html');text=file.read_text(encoding='utf-8')
  url=origin+('/' if page=='index' else '/'+page+'/')
  text=re.sub(r'<meta\s+name=[\"\']twitter:card[\"\'][^>]*>', '', text)
  tags=f'<link rel="canonical" href="{url}" />\n<meta property="og:url" content="{url}" />\n<meta property="og:image" content="{origin}/assets/d02-hero-desktop.jpg" />\n<meta property="og:image:alt" content="Kirjane Living Topography optical sculpture" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:image" content="{origin}/assets/d02-hero-desktop.jpg" />\n'
  if preview:tags+='<meta name="robots" content="noindex, nofollow, noarchive" />\n'
  text=text.replace('</head>',tags+'</head>',1)
  for route in PAGES[1:]:text=text.replace('./'+route+'.html','./'+route+'/')
  text=text.replace('./index.html','./')
  if page!='index':
   folder=output/page;folder.mkdir();directory_text=re.sub(r'href="#([^"]*)"',lambda m:f'data-local-fragment="#{m.group(1)}" href="./{page}/#{m.group(1)}"',text).replace('<head>','<head>\n<base href="../" />',1)
   (folder/'index.html').write_text(directory_text,encoding='utf-8')
   # Existing direct .html links retain content while declaring directory canonicals.
  file.write_text(text,encoding='utf-8')
 (output/'404.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Page not found | Kirjane</title><body><main><h1>Page not found.</h1><p><a href="/">Return to Kirjane</a></p></main></body></html>',encoding='utf-8')
 (output/'robots.txt').write_text('User-agent: *\n'+('Disallow: /\n' if preview else 'Allow: /\nSitemap: '+origin+'/sitemap.xml\n'),encoding='utf-8')
 urls=[origin+('/' if p=='index' else '/'+p+'/') for p in PAGES]
 (output/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+u+'</loc></url>' for u in urls)+'</urlset>',encoding='utf-8')
 (output/'.htaccess').write_text('Options -Indexes\nDirectoryIndex index.html\nErrorDocument 404 /404.html\n<IfModule mod_headers.c>\nHeader always set X-Content-Type-Options "nosniff"\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"\n<FilesMatch "\\.(html|js|css|json)$">\nHeader set Cache-Control "no-cache"\n</FilesMatch>\n</IfModule>\n',encoding='utf-8')
 manifest={p.relative_to(output).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(output.rglob('*')) if p.is_file()}
 output.with_name(output.name+'-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
 print('Built',len(manifest),'public files; preview noindex:',preview)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--output',type=Path,default=ROOT/'dist/public');p.add_argument('--preview',action='store_true');args=p.parse_args();build(args.output,args.preview or os.environ.get('VERCEL_ENV')=='preview')
