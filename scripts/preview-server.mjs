import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
export async function previewServer(root){
 const base=resolve(root),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
 const server=http.createServer(async(req,res)=>{try{
  let file=resolve(base,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(file!==base&&!file.startsWith(base+sep))throw Error();
  if((await stat(file)).isDirectory())file=join(file,'index.html');
  res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch{res.writeHead(404).end();}});
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 return {origin:'http://127.0.0.1:'+server.address().port,close:()=>server.close()};
}
