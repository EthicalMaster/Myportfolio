import {attachChat} from './guide-chat.js';
import {homeStops,skillsStops,extraLabels,clip,nextIndex} from './guide-model.js';
// Chat goes through the protected backend; requests require visitor confirmation.
if(!new URLSearchParams(location.search).has('preview'))initialize();
function initialize(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),isSkills=!!document.querySelector('.skills-page');
 const read=key=>{try{return sessionStorage.getItem('portfolio-guide-'+key);}catch{return null;}};
 const write=(key,value)=>{try{sessionStorage.setItem('portfolio-guide-'+key,value);}catch{}};
 const avatar=id=>`<svg class="g-avatar" data-mood="hello" viewBox="0 0 160 160" aria-hidden="true">
 <defs>
  <linearGradient id="${id}-shell" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#5d645e"/><stop offset=".42" stop-color="#303932"/><stop offset="1" stop-color="#151d19"/></linearGradient>
  <linearGradient id="${id}-rim" x2=".2" y2="1"><stop stop-color="#fff9e9"/><stop offset=".55" stop-color="#c8c8b6"/><stop offset="1" stop-color="#777f71"/></linearGradient>
  <linearGradient id="${id}-glass" x2=".5" y2="1"><stop stop-color="#263c36"/><stop offset="1" stop-color="#081511"/></linearGradient>
  <radialGradient id="${id}-light"><stop stop-color="#b8e49b" stop-opacity=".22"/><stop offset="1" stop-color="#b8e49b" stop-opacity="0"/></radialGradient>
 </defs>
 <ellipse class="g-aura" cx="80" cy="88" rx="73" ry="68" fill="url(#${id}-light)"/>
 <ellipse class="g-shadow" cx="80" cy="142" rx="35" ry="5"/>
 <ellipse class="g-orbit" cx="80" cy="140" rx="26" ry="7" fill="none" stroke="#bbd4a7" stroke-opacity=".35" stroke-width=".8"/>
 <g class="g-body">
  <g class="g-head-tilt">
   <path d="M81 38L87 22" stroke="#778574" stroke-width="3" stroke-linecap="round"/>
   <circle class="g-beacon-halo" cx="88" cy="19" r="9" fill="#ffad66" opacity=".12"/><circle class="g-antenna" cx="88" cy="19" r="4"/><circle cx="87" cy="18" r="1.3" fill="#fff1d9"/>
   <rect x="27" y="65" width="12" height="29" rx="6" fill="#38483d" stroke="#95a58b" stroke-width="1"/>
   <rect x="121" y="65" width="12" height="29" rx="6" fill="#38483d" stroke="#95a58b" stroke-width="1"/>
   <path d="M54 38Q80 30 109 42Q125 48 126 71L124 91Q121 111 102 115L58 113Q37 109 35 90L34 66Q35 45 54 38Z" fill="url(#${id}-shell)" stroke="#778674" stroke-width="1.2"/>
   <path d="M51 43Q79 34 108 47" fill="none" stroke="#d8e7cf" stroke-opacity=".45" stroke-width="1.2" stroke-linecap="round"/>
   <rect x="41" y="48" width="78" height="56" rx="23" fill="url(#${id}-rim)"/>
   <rect x="45" y="52" width="70" height="48" rx="20" fill="url(#${id}-glass)" stroke="#15291e" stroke-width="1.5"/>
   <path d="M51 65Q55 56 68 56H97" fill="none" stroke="#d8f1d7" stroke-opacity=".15" stroke-width="2" stroke-linecap="round"/>
   <g class="g-eyes">
    <g class="g-eye g-eye-left"><rect class="g-eye-open" x="59" y="65" width="10" height="17" rx="5"/><path class="g-eye-smile" d="M58 76Q64 65 70 76"/></g>
    <g class="g-eye g-eye-right"><rect class="g-eye-open" x="91" y="65" width="10" height="17" rx="5"/><path class="g-eye-smile" d="M90 76Q96 65 102 76"/></g>
    <path class="g-mouth" d="M75 87Q80 91 85 87"/>
    <ellipse class="g-mouth-speaking" cx="80" cy="88" rx="4" ry="3"/>
    <path class="g-cheek" d="M55 85H61M99 85H105"/>
   </g>
   <path d="M66 108H94" stroke="#111e16" stroke-width="3" stroke-linecap="round"/>
   <path class="g-charge" d="M72 108H88" stroke="#ffad66" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="g-left-hand"><path d="M22 99Q28 94 33 100L38 109Q40 116 32 119Q25 122 22 115L18 108Q16 103 22 99Z" fill="url(#${id}-rim)" stroke="#778674" stroke-width="1"/><path d="M23 106L28 113" stroke="#465646" stroke-width="1.5" stroke-linecap="round"/></g>
  <g class="g-hand"><path d="M130 94Q136 90 140 97L145 107Q148 114 141 118Q133 122 129 115L124 105Q121 98 130 94Z" fill="url(#${id}-rim)" stroke="#778674" stroke-width="1"/><path d="M132 101L138 111" stroke="#465646" stroke-width="1.5" stroke-linecap="round"/></g>
 </g></svg>`;
 const root=document.createElement('aside');root.id='portfolio-guide';root.setAttribute('aria-label','Portfolio guide');
 root.innerHTML=`<div id="g-greeting" hidden><p>Hey, welcome to Taher’s corner of the web. Want a quick tour?</p><div class="g-greet-actions"><button type="button" id="g-greet-start">Show me around ↗</button><button type="button" id="g-greet-no">Just exploring</button></div></div><section id="g-panel" role="dialog" aria-modal="false" aria-labelledby="g-title" hidden><div class="g-head">${avatar('g-panel-robot')}<div><p class="g-kicker">A LITTLE COMPANY</p><h2 id="g-title">Portfolio guide</h2></div><button type="button" id="g-minimize" aria-label="Minimize guide">−</button></div><p class="g-copy" id="g-copy"></p><blockquote class="g-source" id="g-source" hidden></blockquote><div class="g-actions"><button type="button" id="g-start" class="g-primary">Take a quick tour ↗</button><button type="button" id="g-next" class="g-primary" hidden>Next stop →</button><button type="button" id="g-back" hidden>Previous</button><button type="button" id="g-context">About this section</button><button type="button" id="g-stop" hidden>End tour</button></div><p id="g-status" role="status"></p><div class="g-foot"><button type="button" id="g-speak">Read aloud ▷</button><button type="button" id="g-motion" aria-pressed="false">Pause character</button><button type="button" id="g-dismiss">Dismiss</button></div><p class="g-disclosure">Tours are authored. Chat uses AI when connected.<br>Voice is off while a better voice is being prepared.</p></section><button type="button" id="g-launch" aria-expanded="false" aria-controls="g-panel" aria-label="Open portfolio guide">${avatar('g-launch-robot')}<span class="g-launch-label">Say hello <b aria-hidden="true">↗</b></span></button>`;
 document.body.append(root);document.body.classList.add('guide-ready');
 const $=id=>root.querySelector('#'+id),panel=$('g-panel'),launch=$('g-launch'),greeting=$('g-greeting');
 const restore=document.createElement('button');restore.type='button';restore.className='guide-restore';restore.textContent='Open portfolio guide ↗';document.querySelector('footer')?.append(restore);
 let open=false,touring=false,index=0,stops=[],current=null,highlight=null,observer=null,speaking=false,utterance=null,paused=read('paused')==='1',pointerFrame=0,pointerX=0,pointerY=0,lookBounds=null;
 root.classList.toggle('g-static',paused);$('g-motion').setAttribute('aria-pressed',String(paused));$('g-motion').textContent=paused?'Resume character':'Pause character';
 function mood(value){root.querySelectorAll('.g-avatar').forEach(a=>a.dataset.mood=value);}
 function stopSpeech(){if(speaking&&'speechSynthesis' in window)speechSynthesis.cancel();speaking=false;utterance=null;$('g-speak').textContent='Read aloud ▷';mood(open?'curious':'idle');}
 function clearHighlight(){highlight?.classList.remove('g-highlight');highlight=null;}
 function controls(){ $('g-start').hidden=touring;$('g-next').hidden=!touring;$('g-back').hidden=!touring;$('g-back').disabled=index===0;$('g-stop').hidden=!touring;$('g-context').hidden=touring;$('g-next').textContent=index===stops.length-1?'Finish tour ✓':'Next stop →'; }
 function show(stop,scroll=false){
  if(!stop)return;stopSpeech();current=stop;
  if(isSkills){document.querySelector('[data-lens="'+stop.id+'"]')?.click();}
  $('g-title').textContent=stop.label;$('g-copy').textContent=stop.intro;
  const source=stop.node?.querySelector(stop.source)?.textContent||'';$('g-source').textContent=clip(source);$('g-source').hidden=!source.trim();
  $('g-status').textContent=touring?'Stop '+(index+1)+' of '+stops.length:'Explore at your own pace.';
  if(scroll){clearHighlight();highlight=stop.node;highlight.classList.add('g-highlight');highlight.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});}
  mood(touring?'pointing':'curious');controls();
 }
 function welcome(){stopSpeech();$('g-title').textContent='A curious little guide';$('g-copy').textContent='Want the short version of this page? I can show you the work, the thinking, and the person behind it. You choose the pace.';$('g-source').hidden=true;$('g-status').textContent='Voice is off. Explore at your own pace.';controls();}
 function setOpen(value,focus=true){
  open=value;panel.hidden=!value;launch.setAttribute('aria-expanded',String(value));greeting.hidden=true;stopSpeech();
  if(value){mood('hello');write('greeted','1');if(!touring)welcome();if(focus)$('g-minimize').focus({preventScroll:true});}
  else{touring=false;clearHighlight();controls();if(focus)launch.focus({preventScroll:true});}
  lookBounds=null;
 }
 function rebuild(){
  const base=isSkills?skillsStops:homeStops;
  stops=base.map(s=>({...s,node:document.getElementById(s.id)})).filter(s=>s.node&&(isSkills||!s.node.closest('[hidden]')));
  for(const node of document.querySelectorAll('.cms-collection')){const kind=node.id.replace('collection-','');const stop={id:node.id,node,label:extraLabels[kind]||'A new chapter',intro:'Here are the latest published entries. Open a card’s links to explore the supporting work.',source:'.cms-card p:not(.cms-meta)'};const contact=stops.findIndex(s=>s.id==='contact');stops.splice(contact<0?stops.length:contact,0,stop);}
  index=Math.min(index,Math.max(0,stops.length-1));if(current)current=stops.find(s=>s.id===current.id)||stops[0];
  observer?.disconnect();if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{if(touring||!open||speaking)return;for(const e of entries)if(e.isIntersecting){const s=stops.find(s=>s.node===e.target);if(s){current=s;$('g-context').textContent='About: '+s.label;}}},{rootMargin:'-15% 0px -40% 0px',threshold:0});stops.forEach(s=>observer.observe(s.node));}
  if(touring&&stops.length)show(stops[index]);controls();
 }
 function start(){setOpen(true,false);rebuild();if(!stops.length){$('g-status').textContent='There are no visible tour stops on this page.';return;}touring=true;index=0;show(stops[0],true);$('g-next').focus({preventScroll:true});}
 launch.addEventListener('click',()=>setOpen(!open));$('g-minimize').addEventListener('click',()=>setOpen(false));
 $('g-start').addEventListener('click',start);$('g-greet-start').addEventListener('click',start);
 $('g-greet-no').addEventListener('click',()=>{greeting.hidden=true;write('greeted','1');mood('curious');});
 $('g-next').addEventListener('click',()=>{if(index===stops.length-1){touring=false;clearHighlight();stopSpeech();$('g-title').textContent='That’s this chapter.';$('g-copy').textContent=isSkills?'Code, questions and a sketchbook. Follow any project link to see where those interests lead.':'That’s a quick look around. Take your time with the projects, or open Skills & interests to meet the creative side.';$('g-source').hidden=true;$('g-status').textContent='Thanks for exploring. I’ll be here if you need the tour again.';controls();$('g-start').focus({preventScroll:true});return;}index=nextIndex(index,stops.length);show(stops[index],true);});
 $('g-back').addEventListener('click',()=>{index=Math.max(0,index-1);show(stops[index],true);});
 $('g-stop').addEventListener('click',()=>{touring=false;clearHighlight();welcome();$('g-start').focus({preventScroll:true});});
 $('g-context').addEventListener('click',()=>{const visible=stops.filter(s=>!s.node.hidden);const closest=visible.reduce((best,s)=>Math.abs(s.node.getBoundingClientRect().top-innerHeight*.25)<Math.abs(best.node.getBoundingClientRect().top-innerHeight*.25)?s:best,visible[0]);show(closest||current||stops[0]);});
 $('g-dismiss').addEventListener('click',()=>{setOpen(false,false);root.hidden=true;write('dismissed','1');restore.focus({preventScroll:true});});
 restore.addEventListener('click',()=>{write('dismissed','0');root.hidden=false;setOpen(true);});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){e.preventDefault();setOpen(false);}});
 $('g-motion').addEventListener('click',()=>{paused=!paused;root.classList.toggle('g-static',paused);write('paused',paused?'1':'0');$('g-motion').setAttribute('aria-pressed',String(paused));$('g-motion').textContent=paused?'Resume character':'Pause character';root.style.removeProperty('--look-x');root.style.removeProperty('--look-y');root.style.removeProperty('--head-turn');});
 if(!('speechSynthesis' in window)){$('g-speak').hidden=true;}else $('g-speak').addEventListener('click',()=>{
  if(speaking){stopSpeech();return;}
  utterance=new SpeechSynthesisUtterance($('g-copy').textContent+($('g-source').hidden?'':' From the page: '+$('g-source').textContent));utterance.lang='en-IN';utterance.rate=.98;
  const thisUtterance=utterance;utterance.onend=()=>{if(utterance===thisUtterance){speaking=false;utterance=null;$('g-speak').textContent='Read aloud ▷';mood('curious');}};
  utterance.onerror=()=>{if(utterance===thisUtterance){stopSpeech();$('g-status').textContent='Read-aloud is unavailable. The full text is above.';}};
  speaking=true;$('g-speak').textContent='Stop reading ■';mood('speaking');speechSynthesis.speak(utterance);
 });
 function suspend(){const suspended=document.hidden||!!document.querySelector('dialog[open]');root.classList.toggle('g-suspended',suspended);if(suspended)stopSpeech();}
 document.addEventListener('visibilitychange',suspend);window.addEventListener('pagehide',()=>{stopSpeech();cancelAnimationFrame(pointerFrame);});
 launch.addEventListener('pointerenter',()=>{if(!open&&!speaking)mood('happy');});
 launch.addEventListener('pointerleave',()=>{if(!open&&!speaking)mood('idle');});
 launch.addEventListener('focus',()=>{if(!open)mood('happy');});
 launch.addEventListener('blur',()=>{if(!open)mood('idle');});
 const modalObserver=new MutationObserver(suspend);document.querySelectorAll('dialog').forEach(d=>modalObserver.observe(d,{attributes:true,attributeFilter:['open']}));
 document.addEventListener('pointermove',e=>{if(paused||reduced.matches||root.hidden||document.hidden||e.pointerType==='touch'||root.classList.contains('g-suspended'))return;pointerX=e.clientX;pointerY=e.clientY;if(pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;lookBounds=lookBounds||launch.getBoundingClientRect();root.style.setProperty('--look-x',Math.max(-2.5,Math.min(2.5,(pointerX-lookBounds.x)/180))+'px');root.style.setProperty('--head-turn',Math.max(-5,Math.min(5,(pointerX-lookBounds.x)/150))+'deg');root.style.setProperty('--look-y',Math.max(-1.5,Math.min(1.5,(pointerY-lookBounds.y)/200))+'px');});},{passive:true});
 window.addEventListener('resize',()=>{lookBounds=null;});window.addEventListener('portfolio:content',rebuild);
 attachChat(root,{mood,stopSpeech,endTour:()=>{touring=false;clearHighlight();welcome();}});
 $('g-speak').hidden=true;
 rebuild();suspend();if(read('dismissed')==='1')root.hidden=true;
 // A quiet, once-per-tab-session greeting. Never steal focus or autoplay audio.
 let greetingTimer=setTimeout(()=>{greetingTimer=null;if(!read('greeted')&&!root.hidden&&!open&&!document.hidden&&!document.querySelector('dialog[open]')){greeting.hidden=false;mood('hello');write('greeted','1');}},6500);
 window.addEventListener('pagehide',()=>clearTimeout(greetingTimer));
}
