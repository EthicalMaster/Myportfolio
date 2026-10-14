'use strict';
(() => {
 const intro=document.querySelector('#site-intro');
 // Fragment arrivals and browser-history restoration should go straight to the work.
 const navigation=performance.getEntriesByType?.('navigation')[0];
 if(location.hash||navigation?.type==='back_forward'||typeof intro.showModal!=='function')return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const start=performance.now(),checks={structure:false,type:false,interaction:false};
 const skip=document.querySelector('#intro-skip'),status=document.querySelector('#intro-status'),count=document.querySelector('#intro-count');
 let finished=false,closing=false,releaseTimer=0,exitTimer=0,failed=false;
 function reveal(){
  if(finished)return;finished=true;clearTimeout(releaseTimer);clearTimeout(exitTimer);clearTimeout(deadline);
  intro.close();document.documentElement.classList.remove('intro-active');
  const main=document.querySelector('#main');
  if(main){main.setAttribute('tabindex','-1');main.focus({preventScroll:true});}
 }
 function finish(immediate=false){
  if(finished)return;
  if(immediate||reduced.matches){reveal();return;}
  if(closing)return;closing=true;
  status.textContent=failed?'Opening available content':'Ready. Welcome inside.';
  intro.classList.add('intro-release');
  exitTimer=setTimeout(reveal,550);
 }
 function mark(key,ok=true){
  if(finished)return;
  checks[key]=ok;failed=failed||!ok;
  document.querySelector('[data-ready="'+key+'"]').classList.add(ok?'is-ready':'is-unavailable');
  const total=Object.values(checks).filter(Boolean).length;
  count.replaceChildren(document.createTextNode(String(total)),Object.assign(document.createElement('span'),{textContent:'/3'}));
  if(total===3){status.textContent='Page ready';releaseTimer=setTimeout(()=>finish(),reduced.matches?0:Math.max(0,1450-(performance.now()-start)));}
 }
 const deadline=setTimeout(()=>finish(true),4500);
 skip.addEventListener('click',()=>finish(true));
 intro.addEventListener('cancel',e=>{e.preventDefault();finish(true);});
 addEventListener('pageshow',e=>{if(e.persisted)finish(true);});
 reduced.addEventListener('change',()=>{if(reduced.matches)finish(true);});
 // Fail open on script errors. The readable portfolio remains available.
 addEventListener('error',()=>{failed=true;finish(true);},{once:true});
 try{
  intro.showModal();document.documentElement.classList.add('intro-active');skip.focus({preventScroll:true});
  const modules=[...document.querySelectorAll('script[defer][src]')];let settled=0;
  if(!modules.length)mark('interaction');
  modules.forEach(script=>{
   script.addEventListener('load',()=>{settled++;if(settled===modules.length)mark('interaction',!failed);},{once:true});
   script.addEventListener('error',()=>{failed=true;mark('interaction',false);finish(true);},{once:true});
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mark('structure'),{once:true});else mark('structure');
  Promise.resolve(document.fonts?.ready).then(()=>mark('type')).catch(()=>{mark('type',false);finish(true);});
 }catch{finish(true);}
})();
