'use strict';
(()=>{
 const section=document.querySelector('#creative-interlude'),line=document.querySelector('#interlude-line'),shadow=document.querySelector('#interlude-shadow'),branches=document.querySelector('#interlude-branches'),signal=document.querySelector('#interlude-signal'),pause=document.querySelector('#interlude-pause'),buttons=[...document.querySelectorAll('[data-form]')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const N=141,names=['Sketch','Wave','Circuit'],colors=[[227,213,186],[186,221,192],[182,208,162]],clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
 const vertices=[[60,140],[180,140],[220,105],[340,105],[380,140],[440,140],[480,175],[580,175],[620,105],[700,105],[740,140],[900,140]];
 function circuit(x){for(let i=1;i<vertices.length;i++){const [x1,y1]=vertices[i-1],[x2,y2]=vertices[i];if(x<=x2)return y1+(y2-y1)*(x-x1)/(x2-x1);}return 140;}
 const shapes=[0,1,2].map(type=>Array.from({length:N},(_,i)=>{const x=60+i*6;return type===0?140+Math.sin(i*.042)*7+Math.sin(i*.9)*.65:type===1?140+Math.sin(i/(N-1)*Math.PI*6)*48*Math.sin(i/(N-1)*Math.PI):circuit(x);}));
 let ys=[...shapes[0]],color=[...colors[0]],branchOpacity=0,frame=0,last=0,time=0,manual=null,paused=reduce.matches,visible=!('IntersectionObserver' in window),active=-1;
 function sync(){pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';}
 function indicate(index){if(active===index)return;active=index;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
 function paint(){let d='';for(let i=0;i<N;i++)d+=(i?'L':'M')+(60+i*6)+' '+ys[i].toFixed(2);line.setAttribute('d',d);shadow.setAttribute('d',d);line.setAttribute('stroke','rgb('+color.map(Math.round).join(',')+')');shadow.setAttribute('opacity',String(.3*(1-branchOpacity)));branches.setAttribute('opacity',branchOpacity.toFixed(3));const position=(time/8%1)*(N-1),idx=Math.floor(position),mix=position-idx;signal.setAttribute('cx',String(60+position*6));signal.setAttribute('cy',String(ys[idx]*(1-mix)+ys[Math.min(idx+1,N-1)]*mix));signal.setAttribute('opacity',reduce.matches||manual?'0':'1');}
 function render(now){frame=0;if(!visible||document.hidden)return;const dt=Math.min((now-(last||now))/1000,.05);last=now;
  if(manual){manual.elapsed+=dt;const m=ease(manual.elapsed/.85);ys=manual.from.map((y,i)=>y+(shapes[manual.index][i]-y)*m);color=manual.color.map((c,i)=>c+(colors[manual.index][i]-c)*m);branchOpacity=manual.branch+((manual.index===2?1:0)-manual.branch)*m;if(m===1)manual=null;}
  else if(!paused){time=(time+dt)%12;const stage=Math.floor(time/4),next=(stage+1)%3,m=ease((time%4-1.3)/2.7);ys=shapes[stage].map((y,i)=>y+(shapes[next][i]-y)*m);color=colors[stage].map((c,i)=>c+(colors[next][i]-c)*m);branchOpacity=(stage===2?1-m:0)+(next===2?m:0);indicate(m<.5?stage:next);}
  paint();if(manual||!paused)start();else last=0;
 }
 function start(){if(!frame&&visible&&!document.hidden&&(manual||!paused))frame=requestAnimationFrame(render);}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 buttons.forEach((button,index)=>button.addEventListener('click',()=>{paused=true;time=index*4;manual={index,from:[...ys],color:[...color],branch:branchOpacity,elapsed:0};indicate(index);sync();if(reduce.matches){ys=[...shapes[index]];color=[...colors[index]];branchOpacity=index===2?1:0;manual=null;paint();}else start();document.querySelector('#interlude-status').textContent=names[index]+' selected. Automatic motion paused.';}));
 pause.addEventListener('click',()=>{if(paused){if(reduce.matches){document.querySelector('#interlude-status').textContent='Reduced motion is enabled. Choose Sketch, Wave or Circuit to explore still forms.';return;}paused=false;sync();start();}else{paused=true;sync();stop();}});
 reduce.addEventListener('change',()=>{if(reduce.matches){paused=true;manual=null;stop();sync();paint();}});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:.05}).observe(section);
 indicate(0);sync();paint();start();
})();
