import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url)),port=Number(process.argv.includes('--port')?process.argv[process.argv.indexOf('--port')+1]:process.env.PORT||3000),host=process.argv.includes('--host')?process.argv[process.argv.indexOf('--host')+1]:'127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg'};
createServer(async(req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}let p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==resolve(root)&&!p.startsWith(resolve(root)+sep)){res.writeHead(403);res.end();return;}if((await stat(p)).isDirectory())p=resolve(p,'index.html');const bytes=await readFile(p);res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:bytes);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,host,()=>console.log(`Portfolio: http://localhost:${port}`));
