'use strict';
(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:700px)');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
function closeMenu(focus=false){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');if(focus)menu.focus();}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu(true);});
for(const event of ['click','focusin'])document.addEventListener(event,e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))closeMenu();});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{closeMenu();if(mobile.matches&&a.getAttribute('href').startsWith('#')){const s=document.querySelector(a.getAttribute('href'));if(s){s.setAttribute('tabindex','-1');s.focus({preventScroll:true});}}}));mobile.addEventListener('change',()=>closeMenu());
const stages=['Start with the subject, topics, time available and exam date.','Three specialists analyze topics, practice and scheduling in parallel.','A writer combines the three outputs into one complete study plan.','Review and revise for up to two iterations before final presentation.'];let stage=0;
const next=document.querySelector('#workflow-next');function show(){document.querySelectorAll('[data-stage]').forEach(n=>n.classList.toggle('active',Number(n.dataset.stage)===stage));document.querySelector('#stage-count').textContent=String(stage+1).padStart(2,'0')+' / 04';document.querySelector('#stage-description').textContent=stages[stage];next.textContent=stage===3?'Start again ↺':'Next step →';}next.addEventListener('click',()=>{stage=(stage+1)%4;show();});show();
document.querySelector('#copy-email').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('saifeetaher5@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='Select the address above to copy it, or click it to write a message.';}});
if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('arrived');obs.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.project-feature,.portrait-intro').forEach(e=>obs.observe(e));}
const hero=document.querySelector('.hero'),visual=document.querySelector('.visual'),track=document.querySelector('.statement-track');
const sections=['home','work','skills','about','contact'].map(id=>document.getElementById(id)),rail=[...document.querySelectorAll('.mobile-rail [data-section]')];
const arts=[...document.querySelectorAll('.project-art')].map(el=>({el,x:0,y:0,tx:0,ty:0,rect:null}));
let scheduled=0,dirty=true,lastTime=0,turn=0,shift=0,targetTurn=0,targetShift=0,currentSection='';
function schedule(){if(!scheduled&&!document.hidden)scheduled=requestAnimationFrame(render);}
function render(now){
 scheduled=0;const dt=Math.min((now-(lastTime||now))/1000,.05);lastTime=now;
 if(dirty){
  dirty=false;let current='home';
  for(const section of sections)if(section.getBoundingClientRect().top<=innerHeight*.4)current=section.id;
  targetTurn=reduced.matches||mobile.matches?0:Math.min(1,Math.max(0,scrollY/hero.offsetHeight))*12;
  targetShift=reduced.matches?0:Math.max(-220,Math.min(0,(track.parentElement.getBoundingClientRect().top-innerHeight)*.12));
  if(current!==currentSection){currentSection=current;rail.forEach(a=>{if(a.dataset.section===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 }
 const blend=reduced.matches?1:1-Math.exp(-11*dt);
 turn+=(targetTurn-turn)*blend;shift+=(targetShift-shift)*blend;
 let unsettled=Math.abs(targetTurn-turn)>.01||Math.abs(targetShift-shift)>.05;
 visual.style.setProperty('--scroll-turn',turn+'deg');track.style.transform=`translate3d(${shift}px,0,0)`;
 for(const art of arts){art.x+=(art.tx-art.x)*blend;art.y+=(art.ty-art.y)*blend;art.el.style.setProperty('--tilt-x',art.x+'deg');art.el.style.setProperty('--tilt-y',art.y+'deg');unsettled=unsettled||Math.abs(art.tx-art.x)>.01||Math.abs(art.ty-art.y)>.01;}
 if(unsettled)schedule();else lastTime=0;
}
function refresh(){dirty=true;schedule();}
addEventListener('scroll',refresh,{passive:true});addEventListener('resize',refresh,{passive:true});
document.addEventListener('toggle',refresh,true);document.addEventListener('load',refresh,true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(scheduled);scheduled=0;lastTime=0;}else refresh();});
reduced.addEventListener('change',()=>{arts.forEach(a=>a.tx=a.ty=0);refresh();});
arts.forEach(art=>{
 art.el.addEventListener('pointerenter',()=>{art.rect=art.el.getBoundingClientRect();});
 art.el.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduced.matches)return;const r=art.rect;if(!r)return;art.tx=((e.clientY-r.top)/r.height-.5)*-5;art.ty=((e.clientX-r.left)/r.width-.5)*5;schedule();});
 art.el.addEventListener('pointerleave',()=>{art.tx=art.ty=0;schedule();});
});refresh();
})();
