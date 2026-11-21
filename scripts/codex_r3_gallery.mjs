import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const before='dist/codex-r3-evidence/baseline-controlled',after='dist/codex-r3-evidence/final-controlled-17';
const out='docs/codex-r3/evidence';await mkdir(out,{recursive:true});
const htmlOut='dist/codex-r3-evidence/comparison-html';await mkdir(htmlOut,{recursive:true});
const a=JSON.parse(await readFile(before+'/manifest.json','utf8'));
const b=JSON.parse(await readFile(after+'/manifest.json','utf8'));
const browser=await chromium.launch();
const embed=async(path)=>'data:image/png;base64,'+(await readFile(path)).toString('base64');
try{
 for(const [label,ids] of [['services',['03']],['shots',['01','02','03','04','05','06','07','08','09','10']],['mobile',['m03','m04','m08','m09','m10']],['film',['f01','f02','f03','f04','f05']]]){
  const rows=[];
  for(const id of ids){
   const left=a.captures.find(x=>x.id===id),right=b.captures.find(x=>x.id===id);
   if(!left||!right)throw Error('Missing pair '+id);
   rows.push('<section><h2>'+id+' / '+right.label+'</h2><div><figure><img src="'+await embed(before+'/'+left.file)+'"><figcaption>BEFORE · 4c1f58f</figcaption></figure><figure><img src="'+await embed(after+'/'+right.file)+'"><figcaption>AFTER · '+b.sourceSha.slice(0,12)+'</figcaption></figure></div></section>');
  }
  const html='<!doctype html><html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#0c1d15;color:#f1f6e9;font:14px system-ui;padding:24px}h1{font-size:26px}h2{font-size:15px;font-weight:500}section{margin:0 0 24px}section>div{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img{width:100%;display:block}figcaption{font-size:10px;letter-spacing:.1em;margin:7px 0;color:#c5dba9}</style><h1>R3 / '+label+' comparison</h1><p>Matched viewport and requested scene phase. Self-review; fallback rendering differs from physical hardware. Not creative acceptance.</p>'+rows.join('')+'</html>';
  await writeFile(htmlOut+'/'+label+'-comparison.html',html);
  const page=await browser.newPage({viewport:{width:1200,height:900}});await page.setContent(html);await page.evaluate(()=>Promise.all([...document.images].map(x=>x.decode())));
  await page.screenshot({path:out+'/'+label+'-comparison.png',fullPage:true});await page.close();
 }
 const originals=(await readdir('docs')).filter(x=>/^\d\d-.*\.jpg$/.test(x)).sort();
 const html='<style>body{background:#0c1d15;color:white;font:14px system-ui}main{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}img{width:100%}figure{margin:0}</style><h1>Owner references (committed JPEGs; byte provenance unverified)</h1><main>'+(await Promise.all(originals.map(async name=>'<figure><p>'+name+'</p><img src="data:image/jpeg;base64,'+(await readFile('docs/'+name)).toString('base64')+'"></figure>'))).join('')+'</main>';
 const page=await browser.newPage({viewport:{width:1500,height:1000}});await page.setContent(html);await page.evaluate(()=>Promise.all([...document.images].map(x=>x.decode())));await page.screenshot({path:out+'/owner-references.png',fullPage:true});await page.close();
}finally{await browser.close();}
