import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeStops,skillsStops,clip,nextIndex} from '../dist/guide-model.js';
for(const [page,stops] of [['index.html',homeStops],['skills/index.html',skillsStops]]){
 const html=await readFile(new URL('../dist/'+page,import.meta.url),'utf8');
 for(const s of stops)assert(html.includes('id="'+s.id+'"'),'Missing tour destination: '+s.id);
 assert.equal(new Set(stops.map(s=>s.id)).size,stops.length);
}
assert.equal(clip('  Current\n education  '),'Current education');
assert.equal(clip(undefined),'');
const long='A real project description. '.repeat(100);assert(clip(long).length<=331);assert(clip(long).endsWith('…'));
assert.equal(nextIndex(6,7),6);assert.equal(nextIndex(0,0),0);assert.equal(nextIndex(0,7),1);
console.log('Guide checks passed: tour targets exist on both pages, excerpts stay bounded, and tour progression stops at the final destination.');
