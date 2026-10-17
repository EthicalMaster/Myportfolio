import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
class E{constructor(id=''){this.id=id;this.handlers={};this.attrs={};this.dataset={};this.value='';this.hidden=false;}addEventListener(k,f){(this.handlers[k]??=[]).push(f)}fire(k,e={}){for(const f of this.handlers[k]||[])f({preventDefault(){},...e})}setAttribute(k,v){this.attrs[k]=v}focus(){this.focused=true}getBoundingClientRect(){return {left:0,top:0,width:400,height:300}}getContext(){return new Proxy({},{get:()=>()=>{},set:()=>true})}setPointerCapture(){}}
const html=fs.readFileSync('dist/skills/index.html','utf8'),els=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>['#'+m[1],new E(m[1])]));
els['#amplitude'].value='60';els['#frequency'].value='2';
const tabs=['build','explore','sketch'].map(id=>{const t=els['#tab-'+id];t.dataset.lens=id;return t}),panels=['build','explore','sketch'].map(id=>els['#'+id]);
const doc=new E();doc.querySelector=q=>els[q]||new E();doc.querySelectorAll=q=>q==='[data-lens]'?tabs:panels;doc.getElementById=id=>els['#'+id];doc.hidden=false;
const media=new E();media.matches=false;let tasks=new Map(),id=0;
vm.runInNewContext(fs.readFileSync('dist/skills/skills.js','utf8'),{document:doc,window:{},matchMedia:()=>media,location:{hash:''},history:{replaceState(){}},addEventListener(){},devicePixelRatio:1,ResizeObserver:class{observe(){}},requestAnimationFrame:f=>{tasks.set(++id,f);return id},cancelAnimationFrame:i=>tasks.delete(i)});
assert.equal(panels.filter(p=>!p.hidden).length,1);tabs[0].fire('keydown',{key:'ArrowRight'});assert.equal(tabs[1].attrs['aria-selected'],'true');assert.equal(panels[1].hidden,false);
els['#amplitude'].value='95';els['#frequency'].value='6';els['#amplitude'].fire('input');assert.ok(els['#wave-path'].attrs.d.startsWith('M'));assert.ok(!/NaN|Infinity/.test(els['#wave-path'].attrs.d));els['#wave-play'].fire('click');assert.equal(tasks.size,1);
tabs[2].fire('click');assert.equal(tasks.size,0);els['#line-study'].fire('click');assert.equal(els['#drawing-hint'].hidden,true);assert.equal(els['#undo-drawing'].disabled,false);els['#undo-drawing'].fire('click');assert.equal(els['#undo-drawing'].disabled,true);els['#line-study'].fire('click');els['#clear-drawing'].fire('click');assert.equal(els['#drawing-hint'].hidden,false);
tabs[2].fire('keydown',{key:'Home'});assert.equal(tabs[0].attrs['aria-selected'],'true');
console.log('PASS: keyboard tabs, one visible panel, bounded wave path, animation stops on tab switch, keyboard drawing, Undo and Clear.');
