import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=await readFile(new URL('../dist/intro.js',import.meta.url),'utf8');
async function harness({hash='',type='navigate',reduced=false}={}){
 let now=0,id=0;const timers=new Map();
 class El{
  constructor(){this.events={};this.open=false;this.textContent='';this.classes=new Set();this.classList={add:k=>this.classes.add(k),remove:k=>this.classes.delete(k)};}
  addEventListener(k,fn){(this.events[k]??=[]).push(fn)}
  fire(k,e={}){for(const fn of this.events[k]||[])fn({preventDefault(){},...e})}
  showModal(){this.open=true}close(){this.open=false}focus(){this.focused=true}setAttribute(){}
  replaceChildren(...children){this.textContent=children.map(c=>c.textContent).join('')}
 }
 const els=Object.fromEntries(['#site-intro','#intro-skip','#intro-status','#intro-count','#main',...['structure','type','interaction'].map(x=>'[data-ready="'+x+'"]')].map(k=>[k,new El()]));
 const doc=new El(),global=new El(),media=new El(),scripts=[new El(),new El(),new El()];media.matches=reduced;
 doc.readyState='loading';doc.documentElement=new El();doc.fonts={ready:Promise.resolve()};doc.querySelector=q=>els[q];doc.querySelectorAll=()=>scripts;doc.createTextNode=t=>({textContent:t});doc.createElement=()=>new El();
 vm.runInNewContext(source,{document:doc,performance:{now:()=>now,getEntriesByType:()=>[{type}]},location:{hash},matchMedia:()=>media,addEventListener:global.addEventListener.bind(global),setTimeout:(fn,ms)=>{timers.set(++id,{fn,at:now+ms});return id},clearTimeout:k=>timers.delete(k)});
 await Promise.resolve();await Promise.resolve();
 function tick(ms){const target=now+ms;while(true){const jobs=[...timers.entries()].filter(([,v])=>v.at<=target).sort((a,b)=>a[1].at-b[1].at);if(!jobs.length)break;const [key,job]=jobs[0];timers.delete(key);now=job.at;job.fn();}now=target;}
 function ready(){scripts.forEach(s=>s.fire('load'));doc.fire('DOMContentLoaded');}
 return {els,doc,global,media,scripts,tick,ready};
}
let h=await harness();assert.equal(h.els['#site-intro'].open,true);h.ready();assert.equal(h.els['#intro-count'].textContent,'3/3');h.tick(1449);assert.equal(h.els['#site-intro'].open,true);h.tick(551);assert.equal(h.els['#site-intro'].open,false);assert.equal(h.doc.documentElement.classes.has('intro-active'),false);
h=await harness();h.els['#intro-skip'].fire('click');assert.equal(h.els['#site-intro'].open,false);h.ready();h.tick(5000);assert.equal(h.els['#site-intro'].open,false);
h=await harness();h.tick(4500);assert.equal(h.els['#site-intro'].open,false);assert.notEqual(h.els['#intro-count'].textContent,'3/3');
h=await harness();h.scripts[1].fire('error');assert.equal(h.els['#site-intro'].open,false);assert.notEqual(h.els['#intro-count'].textContent,'3/3');
h=await harness({reduced:true});h.ready();h.tick(0);assert.equal(h.els['#site-intro'].open,false);
for(const options of [{hash:'#aven'},{type:'back_forward'}]){h=await harness(options);assert.equal(h.els['#site-intro'].open,false);}
h=await harness();h.els['#site-intro'].fire('cancel');assert.equal(h.els['#site-intro'].open,false);
h=await harness();h.global.fire('pageshow',{persisted:true});assert.equal(h.els['#site-intro'].open,false);
console.log('PASS: real readiness, timed reveal, skip, timeout, failed script, reduced motion, deep links, history restoration and Escape.');
