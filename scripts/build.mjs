import {readFile,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const f of ['index.html','style.css','motion.js','interactions.js','explore.js','intro.js','intro.css','interlude.js','skills/index.html','skills/skills.css','skills/skills.js','portrait.jpg'])await stat(new URL('../dist/'+f,import.meta.url));
for(const f of ['dist/motion.js','dist/interactions.js','dist/explore.js','dist/intro.js','dist/interlude.js','dist/skills/skills.js','scripts/dev.mjs']){const r=spawnSync(process.execPath,['--check',f],{cwd:root,stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
for(const page of ['index.html','skills/index.html']){
 const h=await readFile(new URL('../dist/'+page,import.meta.url),'utf8'),ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs in '+page);
 for(const m of h.matchAll(/href="#([^"]+)"/g))if(!ids.includes(m[1]))throw Error('Missing anchor '+m[1]);
 for(const m of h.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(?:https?:|mailto:|data:|#)/.test(m[1]))continue;const url=new URL(m[1].split('#')[0],new URL('../dist/'+page,import.meta.url));if(url.pathname.endsWith('/'))url.pathname+='index.html';await stat(url);}
}
console.log('Validated both pages, assets and internal links. Deploy dist/.');
