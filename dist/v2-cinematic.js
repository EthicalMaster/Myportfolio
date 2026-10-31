/* Portfolio V2 progressive visual enhancement; does not edit CMS data or routes. */
(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(reduced.matches)return;
const ambient=document.createElement('div');ambient.className='v2-ambient';ambient.setAttribute('aria-hidden','true');document.body.append(ambient);
const note=document.createElement('div');note.className='v2-scroll-note';note.textContent='SCROLL / EXPLORE';note.setAttribute('aria-hidden','true');document.body.append(note);
let frame=0;
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;document.documentElement.style.setProperty('--v2-x',e.clientX+'px');document.documentElement.style.setProperty('--v2-y',e.clientY+'px')})},{passive:true});
const items=[...document.querySelectorAll('.work-heading,.project-info,.creative-interlude .interlude-heading')];
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('v2-visible');observer.unobserve(entry.target)}}),{threshold:.06,rootMargin:'0px 0px 40px 0px'});items.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.95)return;el.classList.add('v2-reveal');observer.observe(el)})}
document.querySelectorAll('.project-feature').forEach((article,i)=>{const art=article.querySelector('.project-art');if(!art)return;const tag=document.createElement('span');tag.className='v2-project-label';tag.setAttribute('aria-hidden','true');tag.textContent='SELECTED / '+String(i+1).padStart(2,'0');art.append(tag)});
reduced.addEventListener('change',()=>{if(!reduced.matches)return;ambient.remove();note.remove();items.forEach(el=>el.classList.remove('v2-reveal'))},{once:true});
})();
