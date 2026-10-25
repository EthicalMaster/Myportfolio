import {configured,readDocument,assetURL} from './cms-api.js';
import {safeURL} from './cms-model.js';
const base=new URL('./',import.meta.url),page=location.pathname.endsWith('/skills/')||location.pathname.endsWith('/skills')?'skills/index.html':'index.html';
const fields=await fetch(new URL('cms-fields.json',base)).then(r=>r.json());
let renderID=0;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
async function resolve(value,owner){const url=safeURL(value,true);return url.startsWith('asset:')?assetURL(url.slice(6),owner):url;}
async function fileLink(value,label,owner){const a=el('a',label,'cms-link');a.target='_blank';a.rel='noopener noreferrer';a.href='#';a.addEventListener('click',async e=>{e.preventDefault();const win=window.open('about:blank','_blank');if(win)win.opener=null;try{const url=await resolve(value,owner);if(!url)throw Error('Invalid link');if(win)win.location=url;else location.assign(url);}catch{win?.close();a.textContent='File unavailable. Try again.';}});return a;}
export async function renderContent(d,owner=false){
 const ticket=++renderID;
 for(const f of fields.filter(x=>x.page===page)){
  const node=document.querySelector(f.selector),value=d.values[f.key];if(!node||typeof value!=='string')continue;
  if(f.type==='text'){const t=[...node.childNodes].filter(n=>n.nodeType===3)[f.index];if(t)t.nodeValue=value;}
  else {try{const url=await resolve(value,owner);if(ticket!==renderID)return;if(url){node.setAttribute(f.attr,url);node.hidden=false;}else {node.removeAttribute(f.attr);if(f.type==='image')node.hidden=true;}}catch{if(f.type==='image')node.hidden=true;}}
 }
 for(const [key,visible] of Object.entries(d.visibility||{})){const section=document.getElementById(key);if(section)section.hidden=!visible;document.querySelectorAll('a[href="#'+key+'"]').forEach(a=>a.hidden=!visible);}
 for(const art of document.querySelectorAll('.project-art'))art.classList.toggle('has-cover',!!art.querySelector('.cms-project-cover:not([hidden])'));
 const s=d.socials;document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+s.email;if(a.classList.contains('email-link'))a.textContent=s.email+' ↗';});
 const socialRow=document.querySelector('.social-row');if(socialRow){socialRow.replaceChildren();for(const [key,label] of [['github','GitHub'],['linkedin','LinkedIn'],['instagram','Instagram']])if(safeURL(s[key])){const a=el('a',label+' ↗');a.href=s[key];a.target='_blank';a.rel='noopener noreferrer';socialRow.append(a);}}
 document.querySelectorAll('.about-text .text-link').forEach(a=>{a.hidden=!safeURL(s.linkedin);if(safeURL(s.linkedin))a.href=s.linkedin;});
 document.querySelectorAll('[data-cms-generated]').forEach(n=>n.remove());
 const artist=document.querySelector('.artist-note');if(artist&&safeURL(s.artyvisions)){const a=el('a','Visit Artyvisions ↗','cms-link');a.dataset.cmsGenerated='';a.href=s.artyvisions;a.target='_blank';a.rel='noopener noreferrer';artist.append(a);}
 if(d.resume.enabled&&safeURL(d.resume.file)){const a=await fileLink(d.resume.file,'View résumé ↗',owner);a.dataset.cmsGenerated='';(document.querySelector('.social-row')||document.querySelector('.mind-outro')).append(a);}
 const titles={certificates:'Learning, with evidence.',projects:'More things I’ve built.',education:'The learning continues.',skills:'Tools in my practice.',interests:'Following my curiosity.',experience:'Experience in practice.',achievements:'Milestones along the way.',artwork:'From my sketchbook.'};
 const main=document.querySelector('main');
 for(const [kind,list] of Object.entries(d.collections||{})){
  if(page==='skills/index.html'&&!['skills','interests','artwork'].includes(kind))continue;
  if(page==='index.html'&&['skills','interests','artwork'].includes(kind))continue;
  const visible=list.filter(x=>x.visible);if(!visible.length)continue;
  const section=el('section',null,'cms-collection');section.id='collection-'+kind;section.dataset.cmsGenerated='';section.append(el('p',kind.toUpperCase(),'mono kicker'),el('h2',titles[kind]));
  const grid=el('div',null,'cms-grid');section.append(grid);
  for(const [i,item] of visible.entries()){
   const card=el('article',null,'cms-card');card.append(el('span',String(i+1).padStart(2,'0'),'mono cms-number'));
   if(item.image&&safeURL(item.image)){try{const img=el('img');img.src=await resolve(item.image,owner);img.alt=item.title;img.loading='lazy';card.append(img);}catch{card.append(el('p','Image unavailable.'));}}
   card.append(el('h3',item.title),el('p',[item.organization,item.date].filter(Boolean).join(' · '),'cms-meta'),el('p',item.description));
   if(item.tags)card.append(el('p',item.tags,'mono cms-meta'));
   if(item.file&&safeURL(item.file))card.append(await fileLink(item.file,kind==='certificates'?'View certificate ↗':'Open file ↗',owner));
   if(safeURL(item.url)){const a=el('a',kind==='certificates'?'Verify credential ↗':'Explore ↗','cms-link');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';card.append(a);}
   grid.append(card);
  }
  if(ticket!==renderID)return;
  const target=page==='index.html'?document.querySelector('#contact'):document.querySelector('.mind-outro');main.insertBefore(section,target);
 }
 for(const item of Object.values(d.circuit||{}))item.href=safeURL(item.href)||'#skills';
 window.portfolioContent=d;window.dispatchEvent(new CustomEvent('portfolio:content',{detail:d}));window.dispatchEvent(new Event('resize'));
}
const preview=new URLSearchParams(location.search).get('preview')==='owner'&&window.parent!==window;
if(preview){window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===window.parent&&e.data?.type==='portfolio-preview')renderContent(e.data.body,true);});window.parent.postMessage({type:'portfolio-preview-ready'},location.origin);}
else if(configured){try{const row=await readDocument();if(row)await renderContent(row.body);}catch(e){console.warn('Published content unavailable; displaying the bundled portfolio.',e.message);}}

import {startAnalytics} from './analytics.js';
startAnalytics(window.portfolioContent?.settings?.analytics!==false);
