'use strict';
(() => {
 const canvas = document.querySelector('#field');
 const ctx = canvas.getContext('2d', {alpha:true});
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const narrow = matchMedia('(max-width: 700px)');
 const pauseButton = document.querySelector('#pause');
 const label = document.querySelector('#pause-label');
 const buttons = [...document.querySelectorAll('[data-mode]')];
 const captions = ['ORDER, WITH ROOM TO WANDER.','AN IDEA FINDS ITS FREQUENCY.','POSSIBILITY HAS NO FIXED FORM.'];
 const names = ['Orbit','Signal','Expand'];
 let paused = reduce.matches, visible = true, hidden = document.hidden, mode = 0, frame = 0, last = 0, t = .6, w = 500, h = 400, mx = 0, my = 0, sx = 0, sy = 0;
 let pulse = 0, pulseTarget = 0;
 const COUNT = narrow.matches ? 860 : 1500;
 const particles = Array.from({length:COUNT}, (_,i) => {
  const u = i / COUNT * Math.PI * 2;
  const v = i * 2.3999632297;
  return {u,v,x:0,y:0,z:0};
 });
 function target(p,index,shape) {
  const {u,v}=p;
  if(shape===0){const r=.69+.24*Math.cos(v);return [r*Math.cos(u),r*Math.sin(u),.24*Math.sin(v)+.2*Math.sin(u*3)];}
  if(shape===1){const y=index/COUNT*1.9-.95;const a=index/COUNT*7*Math.PI;const r=.36+.12*Math.sin(v);return [r*Math.cos(a),y,r*Math.sin(a)];}
  const z=1-2*(index+.5)/COUNT;const r=Math.sqrt(1-z*z);return [r*Math.cos(v),r*Math.sin(v),z];
 }
 const goals=[0,1,2].map(shape=>particles.map((p,i)=>target(p,i,shape)));
 particles.forEach((p,i)=>[p.x,p.y,p.z]=goals[0][i]);
 const buckets=Array.from({length:24},()=>[]);
 const projected=particles.map((p,i)=>({x:0,y:0,r:0,i}));
 const colors=Array.from({length:24},(_,i)=>{const a=.18+(i%12+.5)/12*.7;return i>=12?`rgba(239,238,213,${a})`:`rgba(255,166,94,${a})`;});
 const intro=document.querySelector('#site-intro');
 const canAnimate=()=>!paused&&visible&&!hidden&&!intro?.open;
 intro?.addEventListener('close',()=>start());
 function syncPause(){pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Play sculpture motion':'Pause sculpture motion');label.textContent=paused?'PLAY':'PAUSE';document.querySelector('.pause-icon').textContent=paused?'▷':'Ⅱ';}
 function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx?.setTransform(d,0,0,d,0,0);draw(0);}
 function vSafe(i){return i*.035;}
 function sendPulse(){if(!ctx)return;if(paused||reduce.matches){pulse=pulse?0:1;draw(0);}else{pulseTarget=1;start();}}
 document.querySelector('#pulse').addEventListener('click',sendPulse);
 canvas.addEventListener('click',sendPulse);
 function draw(dt,snap=false){
  if(!ctx)return;
  if(!paused){t+=dt;pulse+=(pulseTarget-pulse)*(1-Math.exp(-12*dt));pulseTarget*=Math.exp(-4*dt);}
  const f=snap?1:1-Math.exp(-7*dt);
  sx+=(mx-sx)*f;sy+=(my-sy)*f;
  ctx.clearRect(0,0,w,h);
  const radius=Math.min(w*.39,h*.45), ax=.55+sy*.28, ay=t*.14+sx*.42, az=-.38;
  const ca=Math.cos(ax),sa=Math.sin(ax),cb=Math.cos(ay),sb=Math.sin(ay),cc=Math.cos(az),sc=Math.sin(az);
  buckets.forEach(b=>b.length=0);
  const morph=snap?1:1-Math.exp(-3.5*dt);
  for(let i=0;i<COUNT;i++){
   const p=particles[i],goal=goals[mode][i],m=morph;
   p.x+=(goal[0]-p.x)*m;p.y+=(goal[1]-p.y)*m;p.z+=(goal[2]-p.z)*m;
   const y=p.y*ca-p.z*sa,z=p.y*sa+p.z*ca,x=p.x*cb+z*sb,z2=-p.x*sb+z*cb;
   const kick=1+pulse*.25*Math.sin(vSafe(i)+t*9);
   const x2=(x*cc-y*sc)*kick,y2=(x*sc+y*cc)*kick,depth=3.3/(3.3-z2*.6);
   const point=projected[i];point.x=w*.5+x2*radius*depth;point.y=h*.5+y2*radius*depth;point.r=(i%13===0?1.4:.7)+Math.max(0,z2)*.7;
   const bucket=Math.max(0,Math.min(11,Math.floor((z2+1)*6)))+(i%13===0?12:0);buckets[bucket].push(point);
  }

  // Fine elliptical reference rings ground the object without competing with it.
  ctx.strokeStyle='#70776522';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(w*.5,h*.51,radius*1.22,radius*.35,-.35,0,Math.PI*2);ctx.stroke();
  // Batch dots by depth and color: 24 fills instead of one draw call per particle.
  buckets.forEach((bucket,j)=>{if(!bucket.length)return;ctx.fillStyle=colors[j];ctx.beginPath();for(const p of bucket){ctx.moveTo(p.x+p.r,p.y);ctx.arc(p.x,p.y,p.r,0,Math.PI*2);}ctx.fill();});
  // Traveling highlights are decorative; no fabricated live metrics.
  for(let j=0;j<5;j++){const a=t*.19+j*Math.PI*.4;const x=w*.5+Math.cos(a)*radius*1.22,y=h*.51+Math.sin(a)*radius*.35;ctx.fillStyle='#ffbd83';ctx.fillRect(x-1.2,y-1.2,2.4,2.4);}
 }
 function loop(now){frame=0;const dt=Math.min((now-(last||now))/1000,.04);last=now;draw(dt);if(canAnimate())frame=requestAnimationFrame(loop);}
 function start(){if(!frame&&canAnimate()){last=0;frame=requestAnimationFrame(loop);}}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 buttons.forEach(b=>b.addEventListener('click',()=>{mode=Number(b.dataset.mode);buttons.forEach(v=>v.setAttribute('aria-pressed',String(v===b)));document.querySelector('#mode-caption').textContent=captions[mode];document.querySelector('#scene-announcement').textContent=names[mode]+' sculpture selected';if(paused||reduce.matches)draw(0,true);else start();}));
 pauseButton.addEventListener('click',()=>{paused=!paused;syncPause();if(paused){stop();draw(0);}else start();});
 reduce.addEventListener('change',()=>{paused=reduce.matches;mx=my=0;syncPause();if(paused){stop();draw(0);}else start();});
 canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduce.matches||paused)return;const r=canvas.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*2-1;my=(e.clientY-r.top)/r.height*2-1;});
 canvas.addEventListener('pointerleave',()=>{mx=my=0;});
 document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden)stop();else start();});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:0}).observe(canvas);
 if(ctx){document.body.classList.add('canvas-ready');new ResizeObserver(resize).observe(canvas);resize();syncPause();start();}else{document.querySelector('#pulse').hidden=true;pauseButton.hidden=true;buttons.forEach(b=>b.disabled=true);document.querySelector('.scene-hint').textContent='Static sculpture';}
 if(matchMedia('(pointer: coarse)').matches)document.querySelector('.scene-hint').textContent='Choose a shape below to explore';
 let scrollFrame=0;
 function updateProgress(){scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.transform='scaleX('+(max>0?Math.max(0,Math.min(1,scrollY/max)):0)+')';}
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);},{passive:true});updateProgress();
})();
