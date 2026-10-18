import {configured,login,logout,verifyOwner,readDocument,saveDocument,publishDocument,upload,request} from '../cms-api.js';
import {validateDocument,publicBody,safeURL} from '../cms-model.js';
const $=s=>document.querySelector(s),node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const defaults=await fetch('../cms-defaults.json').then(r=>r.json()),fields=await fetch('../cms-fields.json').then(r=>r.json());
let doc=structuredClone(defaults),revision=0,dirty=false,busy=false,online=false,active='Overview';
const groups=[...new Set(fields.map(f=>f.group))],collections=['certificates','projects','education','skills','interests','experience','achievements','artwork'];
const names=['Overview','Links & contact','Résumé',...collections.map(k=>k[0].toUpperCase()+k.slice(1)),'Existing page copy','Builder’s Circuit','Section visibility','Backup & history'];
const tell=message=>{$('#notice').textContent=message;};
function state(){ $('#draft-state').textContent=dirty?'Unsaved changes':online?'Saved draft · revision '+revision:'Setup preview · not saved';$('#save').disabled=!online||busy||!dirty;$('#publish').disabled=!online||busy||dirty||revision===0; }
function changed(){dirty=true;state();}
function input(parent,label,value,set,type='text'){
 const wrap=node('label',label);const n=node(type==='textarea'?'textarea':'input');if(type!=='textarea')n.type=type;n.value=value??'';if(type==='checkbox'){n.checked=!!value;wrap.prepend(n);}else wrap.append(n);n.addEventListener('input',()=>{set(type==='checkbox'?n.checked:n.value);changed();});parent.append(wrap);return n;
}
function button(parent,text,fn,cls){const b=node('button',text,cls);b.type='button';b.addEventListener('click',fn);parent.append(b);return b;}
function panel(title,description){const p=node('section',null,'panel');p.append(node('h2',title));if(description)p.append(node('p',description,'hint'));$('#editor').append(p);return p;}
function fileControl(parent,label,get,set,pdf=false){
 const box=node('div',null,'file-row');parent.append(box);box.append(node('p',label));const current=node('p',get()||'No file attached.','field-meta');box.append(current);
 const file=node('input');file.type='file';file.accept=pdf?'application/pdf':'.pdf,.png,.jpg,.jpeg,.webp';file.setAttribute('aria-label',label);file.disabled=!online;box.append(file);
 file.addEventListener('change',async()=>{const f=file.files[0];if(!f)return;if(label.includes('image')&&!['image/png','image/jpeg','image/webp'].includes(f.type)){tell('Choose a JPG, PNG or WebP image.');file.value='';return;}if(pdf&&f.type!=='application/pdf'){tell('Choose a PDF for your résumé.');file.value='';return;}file.disabled=true;try{const path=await upload(f);set(path);current.textContent=f.name+' · uploaded privately';changed();tell('File uploaded privately. Save and publish to make it visible.');}catch(e){tell(e.message);}finally{file.disabled=!online;file.value='';}});
 button(box,'Remove attachment',()=>{set('');current.textContent='No file attached.';changed();});
}
function render(){
 $('#section-title').textContent=active;$('#editor').replaceChildren();document.querySelectorAll('#sections button').forEach(b=>{if(b.textContent===active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 const kind=active.toLowerCase();
 if(active==='Overview'){
  const p=panel('Your next chapter starts here.','Edit your content, save a private draft, preview both pages, and publish deliberately. Existing motion and page layouts are preserved.');
  const grid=node('div',null,'grid');p.append(grid);for(const [label,count] of [['New entries',Object.values(doc.collections).flat().length],['Certificates',doc.collections.certificates.length],['Résumé',doc.resume.file?'Attached':'Not yet']]){const cell=node('div',label,'stat');cell.append(node('strong',String(count)));grid.append(cell);}
  panel('Nothing to invent.','Certificates and résumé links stay absent until you add real content and turn on visibility. Upcoming learning is not presented as an earned skill.');
  if(!online)panel('Connection required','This is an editor preview. Cloud saving, uploads and publishing are disabled until a separate database and your owner login are configured. You can still explore fields, preview changes and export a backup.');
 }else if(active==='Links & contact'){
  const p=panel('Each account has its own place.','Personal Instagram appears in contact. Artyvisions appears beside your sketching hobby. Leave a social URL empty to hide it.');
  for(const [key,label] of [['email','Contact email'],['github','GitHub URL'],['linkedin','LinkedIn URL'],['instagram','Personal Instagram URL'],['artyvisions','Artyvisions Instagram URL']])input(p,label,doc.socials[key],v=>doc.socials[key]=v,key==='email'?'email':'url');
 }else if(active==='Résumé'){
  const p=panel('Ready when you are.','Upload your résumé as a PDF, up to 10 MB. Visitors will see “View résumé” only when the file is attached, visibility is enabled and the saved draft is published.');
  fileControl(p,'Résumé PDF',()=>doc.resume.file,v=>doc.resume.file=v,true);input(p,'Show résumé publicly',doc.resume.enabled,v=>doc.resume.enabled=v,'checkbox');
 }else if(collections.includes(kind)){
  const p=panel('Add to your '+kind+'.','These entries extend the existing portfolio. To change content already on the site, use Existing page copy. Hidden entries stay in your private draft. Order entries with Move up and Move down.');
  button(p,'+ Add '+(kind==='artwork'?'artwork':kind.slice(0,-1)),()=>{doc.collections[kind].push({id:crypto.randomUUID(),title:'',description:'',organization:'',date:'',tags:'',url:'',file:'',image:'',visible:false});changed();render();$('#editor .entry:last-child input')?.focus();},'primary');
  const list=doc.collections[kind];if(!list.length)p.append(node('p','No entries yet. Add one when you have something real to share.','hint'));
  list.forEach((item,i)=>{
   const card=node('details',null,'entry');card.open=!item.title;card.append(node('summary',(i+1)+'. '+(item.title||'Untitled entry')+(item.visible?'':' · hidden')));$('#editor').append(card);
   input(card,'Title',item.title,v=>item.title=v);input(card,kind==='certificates'?'Issuer':'Organization / context',item.organization,v=>item.organization=v);input(card,'Date or period (your wording)',item.date,v=>item.date=v);input(card,'Description / what you did',item.description,v=>item.description=v,'textarea');input(card,'Skills / tags',item.tags,v=>item.tags=v);input(card,kind==='certificates'?'Verification URL':'Project / reference URL',item.url,v=>item.url=v,'url');
   fileControl(card,'Cover image (JPG, PNG or WebP)',()=>item.image,v=>item.image=v);fileControl(card,'Certificate / supporting file',()=>item.file,v=>item.file=v);
   input(card,'Include in the next publication',item.visible,v=>item.visible=v,'checkbox');
   const actions=node('div',null,'entry-actions');card.append(actions);
   button(actions,'Move up',()=>{[list[i-1],list[i]]=[list[i],list[i-1]];changed();render();}).disabled=i===0;
   button(actions,'Move down',()=>{[list[i+1],list[i]]=[list[i],list[i+1]];changed();render();}).disabled=i===list.length-1;
   button(actions,'Delete entry',()=>{if(confirm('Delete this entry from the draft? It remains in the published version until you publish again.')){list.splice(i,1);changed();render();}},'danger');
  });
 }else if(active==='Existing page copy'){
  const p=panel('Edit what’s already there.','All fields keep the existing layout. This includes your academic stage, grades, project descriptions and current skills. Social links are managed in Links & contact.');
  const select=node('select');select.setAttribute('aria-label','Page section');groups.forEach(g=>{const o=node('option',g);o.value=g;select.append(o);});p.append(select);const filter=node('input');filter.type='search';filter.placeholder='Find a phrase…';filter.setAttribute('aria-label','Search current content');p.append(filter);const list=node('div');p.append(list);
  function show(){list.replaceChildren();const query=filter.value.toLowerCase();for(const f of fields.filter(f=>f.group===select.value&&(!query||(f.label+' '+doc.values[f.key]).toLowerCase().includes(query)))){
   if(Object.values(defaults.socials).includes(f.label)||f.label.startsWith('mailto:'))continue;
   input(list,f.label,doc.values[f.key],v=>doc.values[f.key]=v,f.type==='text'?'textarea':'text');
   if(f.type==='image')fileControl(list,'Replace image',()=>doc.values[f.key],v=>doc.values[f.key]=v);
  }}select.addEventListener('change',show);filter.addEventListener('input',show);show();
 }else if(active==='Builder’s Circuit'){
  for(const [key,item] of Object.entries(doc.circuit)){const p=panel(key.toUpperCase(),'Keep each claim tied to work you have actually done.');for(const field of ['title','category','description','tools','evidence','href','link'])input(p,field,item[field],v=>item[field]=v,['description','evidence'].includes(field)?'textarea':'text');}
 }else if(active==='Section visibility'){
  const p=panel('Choose what visitors see.','The original content stays editable when a section is hidden.');for(const key of Object.keys(doc.visibility))input(p,'Show '+key.replaceAll('-',' '),doc.visibility[key],v=>doc.visibility[key]=v,'checkbox');
 }else if(active==='Backup & history'){
  const p=panel('Keep a copy.','Backups contain content and file references, not the uploaded files themselves. They contain no login credentials.');
  button(p,'Export content JSON',()=>{const blob=new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='taher-portfolio-content.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  const load=node('input');load.type='file';load.accept='.json';load.setAttribute('aria-label','Import content backup');p.append(load);load.addEventListener('change',async()=>{try{const file=load.files[0];if(!file)return;if(file.size>750000)throw Error('Backup is too large.');const next=validateDocument(JSON.parse(await file.text()));if(!confirm('Replace the current draft in this editor with this backup?'))return;doc=next;changed();tell('Backup loaded into editor. Review, then save.');}catch(e){tell(e.message);}});
  button(p,'Load publication history',async()=>{try{const history=await request('/rest/v1/portfolio_history?select=id,created_at,body&order=id.desc&limit=20',{},true);const list=node('div');p.append(list);if(!history.length)list.append(node('p','No publications yet.'));for(const row of history)button(list,'Restore '+new Date(row.created_at).toLocaleString()+' as draft',()=>{if(confirm('Replace editor content with this publication?')){doc=validateDocument(row.body);changed();tell('Historical version loaded. Save and preview before publishing.');}});}catch(e){tell(e.message);}}).disabled=!online;
 }
 state();
}
async function enter(authenticated){online=authenticated;if(online){const saved=await readDocument('draft',true);if(saved){doc={...structuredClone(defaults),...saved.body};revision=saved.revision;}}
 $('#gate').hidden=true;$('#studio').hidden=false;$('#signout').hidden=!online;$('#connection').textContent=online?'OWNER SESSION':'SETUP PREVIEW';render();
}
for(const name of names)button($('#sections'),name,()=>{active=name;render();});
$('#login').addEventListener('submit',async e=>{e.preventDefault();const data=new FormData(e.target);const b=e.target.querySelector('button');b.disabled=true;try{await login(data.get('email'),data.get('password'));e.target.reset();await enter(true);}catch(err){$('#gate-message').textContent=err.message;}finally{b.disabled=false;}});
$('#signout').addEventListener('click',async()=>{if(dirty&&!confirm('Sign out and discard unsaved editor changes?'))return;try{await logout();}finally{location.reload();}});
$('#setup-preview').addEventListener('click',()=>enter(false));
function validate(){validateDocument(doc);for(const [key,value] of Object.entries(doc.socials))if(key!=='email'&&value&&!safeURL(value))throw Error('Enter a full http(s) URL for '+key+'.');if(doc.resume.enabled&&!doc.resume.file)throw Error('Attach a résumé PDF before showing it publicly.');for(const f of fields)if(f.type!=='text'&&doc.values[f.key]&&!safeURL(doc.values[f.key],true))throw Error('Invalid URL: '+f.label);for(const item of Object.values(doc.circuit))if(!safeURL(item.href))throw Error('Invalid circuit destination.');}
$('#save').addEventListener('click',async()=>{busy=true;state();try{validate();revision=await saveDocument(doc,revision);dirty=false;tell('Draft saved privately. Preview it before publishing.');}catch(e){tell(e.message);}finally{busy=false;state();}});
$('#publish').addEventListener('click',async()=>{if(!confirm('Publish this saved draft? Its visible text, links and attached files will become public.'))return;busy=true;state();try{await publishDocument(revision);tell('Published. Your public portfolio now reads this version.');}catch(e){tell(e.message);}finally{busy=false;state();}});
const dialog=$('#preview-dialog'),frame=$('#preview-frame');function previewPage(){frame.src=$('#preview-page').value+'?preview=owner#main';}
$('#preview').addEventListener('click',()=>{try{validate();dialog.showModal();previewPage();}catch(e){tell(e.message);}});$('#preview-page').addEventListener('change',previewPage);$('#preview-close').addEventListener('click',()=>dialog.close());$('#preview-width').addEventListener('click',e=>{const mobile=frame.classList.toggle('mobile');e.target.textContent=mobile?'Full width':'Mobile width';});
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===frame.contentWindow&&e.data?.type==='portfolio-preview-ready')frame.contentWindow.postMessage({type:'portfolio-preview',body:publicBody(doc)},location.origin);});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
if(!configured){$('#connection').textContent='SETUP REQUIRED';$('#login').hidden=true;$('#gate-message').textContent='The editor is installed. Database and owner login setup are still required before cloud saves, uploads or publishing can work.';$('#setup-preview').hidden=false;}
else{try{await verifyOwner();await enter(true);}catch{$('#connection').textContent='SIGN IN REQUIRED';}}
