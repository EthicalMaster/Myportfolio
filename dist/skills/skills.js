'use strict';
(()=>{
 const tabs=[...document.querySelectorAll('[data-lens]')],panels=[...document.querySelectorAll('.lens-panel')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let selected='build',entrance=null,waveFrame=0,playing=false,visible=true,phase=0,last=0,painted=0;
 const play=document.querySelector('#wave-play'),amplitude=document.querySelector('#amplitude'),frequency=document.querySelector('#frequency'),wave=document.querySelector('#wave-path');
 function drawWave(){const a=Number(amplitude.value),f=Number(frequency.value);let d='';for(let i=0;i<=160;i++){const x=i*5,y=130-a*Math.sin(i/160*Math.PI*2*f-phase);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);}wave.setAttribute('d',d);document.querySelector('#amplitude-value').value=String(a);document.querySelector('#frequency-value').value=String(f);}
 function stopFrame(){cancelAnimationFrame(waveFrame);waveFrame=0;last=0;painted=0;}
 function canRun(){return playing&&selected==='explore'&&!document.hidden&&visible&&!reduce.matches;}
 function loop(now){waveFrame=0;if(!canRun())return;phase+=Math.min((now-(last||now))/1000,.05)*1.6;last=now;if(now-painted>30){drawWave();painted=now;}waveFrame=requestAnimationFrame(loop);}
 function resume(){if(canRun()&&!waveFrame)waveFrame=requestAnimationFrame(loop);}
 function syncPlay(){play.setAttribute('aria-pressed',String(playing));play.textContent=playing?'Pause wave Ⅱ':'Animate wave ▷';}
 play.addEventListener('click',()=>{if(reduce.matches){phase+=Math.PI/4;drawWave();play.textContent='Step wave →';return;}playing=!playing;syncPlay();if(playing)resume();else stopFrame();});
 for(const input of [amplitude,frequency])input.addEventListener('input',drawWave);
 function select(id,update=true){if(!panels.some(p=>p.id===id))id='build';selected=id;tabs.forEach(t=>{const active=t.dataset.lens===id;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});panels.forEach(p=>p.hidden=p.id!==id);entrance?.cancel();const panel=document.getElementById(id);if(!reduce.matches&&panel.animate)entrance=panel.animate([{opacity:.5,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});if(update)history.replaceState(null,'','#'+id);if(id==='explore')resume();else stopFrame();if(id==='sketch')resizePad();}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab.dataset.lens));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();select(tabs[next].dataset.lens);}});});
 addEventListener('hashchange',()=>{const hash=location.hash.slice(1);if(panels.some(p=>p.id===hash))select(hash,false);});
 document.addEventListener('visibilitychange',()=>document.hidden?stopFrame():resume());
 reduce.addEventListener('change',()=>{if(reduce.matches){playing=false;stopFrame();entrance?.cancel();}syncPlay();});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else stopFrame();}).observe(document.querySelector('#wave-study'));
 const canvas=document.querySelector('#drawing-pad'),ctx=canvas.getContext('2d'),undo=document.querySelector('#undo-drawing'),clear=document.querySelector('#clear-drawing'),hint=document.querySelector('#drawing-hint'),status=document.querySelector('#drawing-status');
 let strokes=[],pointer=null,stroke=null,width=0,height=0,sketchFrame=0,study=0;
 function redraw(){sketchFrame=0;if(!ctx||!width||!height)return;ctx.clearRect(0,0,width,height);ctx.strokeStyle='#414536';ctx.fillStyle='#414536';ctx.lineWidth=1.6;ctx.lineCap='round';ctx.lineJoin='round';for(const points of strokes){if(points.length===1){ctx.beginPath();ctx.arc(points[0][0]*width,points[0][1]*height,.9,0,Math.PI*2);ctx.fill();continue;}ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x*width,y*height):ctx.moveTo(x*width,y*height));ctx.stroke();}hint.hidden=strokes.length>0;undo.disabled=clear.disabled=!strokes.length;}
 function scheduleDraw(){if(!sketchFrame)sketchFrame=requestAnimationFrame(redraw);}
 function resizePad(){const r=canvas.getBoundingClientRect();if(!ctx||!r.width||!r.height)return;width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);redraw();}
 function point(e){const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];}
 canvas.addEventListener('pointerdown',e=>{if(!ctx||pointer!==null||e.button!==0)return;e.preventDefault();if(strokes.length>=100){status.textContent='The pad is full. Undo or clear to keep drawing.';return;}pointer=e.pointerId;stroke=[point(e)];strokes.push(stroke);canvas.setPointerCapture(pointer);scheduleDraw();});
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==pointer||!stroke)return;for(const sample of e.getCoalescedEvents?.()||[e]){if(stroke.length>=2500)break;stroke.push(point(sample));}scheduleDraw();});
 function end(e){if(e.pointerId!==pointer)return;pointer=null;stroke=null;scheduleDraw();}
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
 undo.addEventListener('click',()=>{if(pointer!==null)return;strokes.pop();redraw();status.textContent='Last line removed.';});
 clear.addEventListener('click',()=>{if(pointer!==null)return;strokes=[];redraw();status.textContent='Drawing pad cleared.';});
 document.querySelector('#line-study').addEventListener('click',()=>{if(!ctx||pointer!==null)return;if(strokes.length>=100){status.textContent='The pad is full. Undo or clear to keep drawing.';return;}const line=[];const angle=study++*.42;for(let i=0;i<=200;i++){const t=i/200*Math.PI*2,x=Math.cos(t)*.29,y=Math.sin(t)*.14;line.push([.5+x*Math.cos(angle)-y*Math.sin(angle),.5+x*Math.sin(angle)+y*Math.cos(angle)]);}strokes.push(line);redraw();status.textContent='A line study added. Add another, undo, or draw your own.';});
 if(ctx)new ResizeObserver(resizePad).observe(canvas);else{document.querySelector('.drawing-tools').hidden=true;hint.textContent='The drawing pad is unavailable in this browser.';}
 drawWave();select(location.hash.slice(1),false);
})();
