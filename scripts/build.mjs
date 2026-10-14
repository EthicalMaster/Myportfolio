import {readFile,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const f of ['index.html','style.css','motion.js','interactions.js','explore.js','intro.js','intro.css','portrait.jpg'])await stat(new URL('../dist/'+f,import.meta.url));
for(const f of ['dist/motion.js','dist/interactions.js','dist/explore.js','dist/intro.js','scripts/dev.mjs']){const r=spawnSync(process.execPath,['--check',f],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
const h=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs');
for(const m of h.matchAll(/href="#([^"]+)"/g))if(!ids.includes(m[1]))throw Error('Missing anchor '+m[1]);
if(h.includes('href="https://github.com"')||h.includes('href="https://example.com"'))throw Error('Placeholder link');
console.log('Validated. Deploy dist/.');
