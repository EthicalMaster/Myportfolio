'use strict';
(() => {
 const skills = {
  frontend: {title:'An idea needs\na way in.',category:'INTERFACES',description:'I build interfaces that turn a project’s logic into something people can use—from AVEN’s learning tools to client websites.',tools:'REACT / TYPESCRIPT / TAILWIND / HTML / CSS',evidence:'AVEN’s frontend, FGB Tea’s original website and Sarra’s architecture portfolio.',href:'#aven',link:'Explore AVEN'},
  backend: {title:'The work behind\nthe screen.',category:'SYSTEMS',description:'In AVEN, the server owns the decisions that need to be reliable: authentication, quiz timing, scoring and learning progress.',tools:'NODE.JS / EXPRESS / POSTGRESQL / ARGON2ID',evidence:'Server-managed sessions, curriculum eligibility, the quiz engine and adaptive mastery calculations in AVEN.',href:'#aven',link:'Inside AVEN'},
  retrieval: {title:'From a document\nto useful context.',category:'RETRIEVAL',description:'AVEN turns uploaded materials into structured chunks and searchable vectors. That retrieval foundation is built; a production LLM provider is still the next step.',tools:'QDRANT / BGE EMBEDDINGS / DOCUMENT PROCESSING',evidence:'PDF, TXT and Markdown processing, 384-dimensional embeddings and student-isolated semantic retrieval.',href:'#aven',link:'See the learning system'},
  agents: {title:'One task.\nDifferent thinkers.',category:'AGENTS',description:'I’ve explored how specialist agents coordinate: working in sequence, splitting work in parallel and reviewing the combined result.',tools:'PYTHON / GOOGLE ADK / SEQUENTIAL · PARALLEL · LOOP',evidence:'SmartStudy, built for the “Beyond Chatbots” workshop assignment: topic, practice and scheduling specialists feeding a reviewed study plan.',href:'#smartstudy',link:'Explore the workflow'},
  automation: {title:'Connect the steps.\nSave the repetition.',category:'AUTOMATION',description:'I learn automation by connecting everyday tools into useful workflows, then checking what actually reaches the other end.',tools:'N8N / ZAPIER / GMAIL / SHEETS / SLACK',evidence:'Personal learning projects: labeled emails to Sheets, form responses to Slack, invoice attachments to Drive and personalized email workflows.',href:'#contact',link:'Talk automation'},
  shipping: {title:'Make it real.\nPut it on the web.',category:'SHIPPING',description:'I’ve taken projects beyond the local machine: using GitHub, deploying websites and handling a client’s domain purchase and setup.',tools:'GIT / GITHUB / VERCEL / DOMAIN CONFIGURATION',evidence:'FGB Tea’s original frontend and domain setup. Its current Shopdeck backend and payments were built separately and are not my work.',href:'#websites',link:'See the websites'}
 };
 const keys=Object.keys(skills),nodes=[...document.querySelectorAll('[data-skill]')];
 const detail=document.querySelector('#skill-detail');let active=0,detailAnimation=null;
 function selectSkill(key){
  if(!skills[key])return;
  active=keys.indexOf(key);const item=skills[key];
  nodes.forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.skill===key)));
  document.querySelectorAll('[data-wire]').forEach(w=>w.classList.toggle('selected',w.dataset.wire===key));
  for(const field of ['title','category','description','tools','evidence'])document.querySelector('#skill-'+field).textContent=item[field];
  document.querySelector('#skill-index').textContent=String(active+1).padStart(2,'0')+' / 06';
  const link=document.querySelector('#skill-link');link.textContent=item.link+' ↗';link.setAttribute('href',item.href);
  detailAnimation?.cancel();
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&detail.animate)detailAnimation=detail.animate([{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'});
 }
 nodes.forEach(node=>node.addEventListener('click',()=>selectSkill(node.dataset.skill)));
 document.querySelector('#skill-next').addEventListener('click',()=>selectSkill(keys[(active+1)%keys.length]));
 selectSkill('frontend');

 const destinations=[
  {title:'Skills & interests',meta:'Python, data, AI, physics and Artyvisions',keywords:'skills programming data science sketching art hobbies physics python interests artyvisions',href:'skills/'},
  {title:'AVEN',meta:'Flagship · adaptive learning platform',keywords:'ai learning react typescript backend postgres qdrant quizzes education',href:'#aven'},
  {title:'SmartStudy',meta:'Workshop · coordinated AI agents',keywords:'python google adk ai sequential parallel loop',href:'#smartstudy'},
  {title:'FGB Tea & Sarra’s portfolio',meta:'Websites · client frontend and architecture',keywords:'frontend websites domains vercel shipping design',href:'#websites'},
  {title:'The Builder’s Circuit',meta:'Explore the skills behind the projects',keywords:'skills stack tools automation n8n zapier systems retrieval',href:'#skills'},
  {title:'The person',meta:'About Taher · education and curiosity',keywords:'about education iit madras acropolis btech bs degree cgpa',href:'#about'},
  {title:'Start a conversation',meta:'Email · GitHub · LinkedIn',keywords:'contact hire email github linkedin social',href:'#contact'},
  {title:'Curiosity in motion',meta:'Play with the particle sculpture',keywords:'home hero motion art pulse',href:'#home'}
 ];
 const dialog=document.querySelector('#command-menu'),input=document.querySelector('#command-search'),results=document.querySelector('#command-results'),status=document.querySelector('#command-status');
 let previousFocus=null;
 function filtered(){const words=input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);return destinations.filter(d=>words.every(w=>(d.title+' '+d.meta+' '+d.keywords).toLocaleLowerCase().includes(w)));}
 function close(){dialog.close();document.body.classList.remove('explorer-open');previousFocus?.focus({preventScroll:true});}
 function navigate(href){close();if(!href.startsWith('#')){location.assign(href);return;}const target=document.querySelector(href);if(!target)return;target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});history.replaceState(null,'',href);}
 function render(){
  results.replaceChildren();const matches=filtered();
  matches.forEach(d=>{const a=document.createElement('a');a.href=d.href;a.className='command-result';const title=document.createElement('strong'),meta=document.createElement('span'),arrow=document.createElement('b');title.textContent=d.title;meta.textContent=d.meta;arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');a.append(title,meta,arrow);a.addEventListener('click',e=>{e.preventDefault();navigate(d.href);});results.append(a);});
  if(!matches.length){const p=document.createElement('p');p.className='command-empty';p.textContent='No matches. Try “AVEN”, “skills” or “contact”.';results.append(p);}
  status.textContent=matches.length+' destinations found.';
 }
 function open(){if(dialog.open||document.querySelector('#site-intro')?.open)return;previousFocus=document.activeElement;input.value='';render();dialog.showModal();document.body.classList.add('explorer-open');input.focus();}
 document.querySelectorAll('#command-open,#command-dock,#mobile-explore').forEach(b=>b.addEventListener('click',open));
 document.querySelector('#command-close').addEventListener('click',close);
 input.addEventListener('input',render);
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 dialog.addEventListener('keydown',e=>{const links=[...results.querySelectorAll('a')];if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!links.length)return;e.preventDefault();const i=links.indexOf(document.activeElement),next=e.key==='ArrowDown'?(i+1)%links.length:(i<=0?links.length-1:i-1);links[next].focus();}else if(e.key==='Enter'&&document.activeElement===input&&links.length){e.preventDefault();links[0].click();}});
 document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(dialog.open)close();else open();}});
 // Hide the floating shortcut around the contact area so it never obscures the email.
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{document.querySelector('#command-dock').classList.toggle('dock-hidden',entries[0].isIntersecting);},{threshold:0}).observe(document.querySelector('#contact'));
})();
