import {validateEvent} from './core.mjs';
const env=(k:string)=>Deno.env.get(k)||'';
const origins=(env('PORTFOLIO_ALLOWED_ORIGINS')||'https://tsportfolio-sandy.vercel.app,https://taher-motion-study.iamspectrehq.chatgpt.site').split(',').map(x=>x.trim());
const publicKey='sb_publishable_I11QmBvBIYyrJBcpWxKgmA_i9PEMZvF';
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')||'',headers={'Access-Control-Allow-Origin':origins.includes(origin)?origin:'null','Access-Control-Allow-Headers':'apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'no-store','Vary':'Origin'};
 const reply=(status:number)=>new Response(null,{status,headers});
 if(!origins.includes(origin))return reply(403);if(req.method==='OPTIONS')return reply(204);if(req.method!=='POST')return reply(405);
 // Public collection endpoint validates the configured public key itself.
 if(![publicKey,env('SUPABASE_ANON_KEY')].filter(Boolean).includes(req.headers.get('apikey')||''))return reply(401);
 try{
  const reader=req.body?.getReader();if(!reader)return reply(400);const chunks=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2000){await reader.cancel();return reply(413);}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let data;try{data=validateEvent(JSON.parse(new TextDecoder().decode(bytes)));}catch{return reply(400);}
  const service=env('SUPABASE_SERVICE_ROLE_KEY'),base=env('SUPABASE_URL');
  const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(service+':'+s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
  const day=new Date().toISOString().slice(0,10),session=await hash(day+':'+data.session),visitor=await hash(day+':'+(req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown'));
  const r=await fetch(base+'/rest/v1/rpc/record_portfolio_event',{method:'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},body:JSON.stringify({event_id:data.id,session_hash:session,event_name:data.event,page_path:data.page,target_name:data.target,referrer_host:data.referrer,device_class:data.device,visitor_hash:visitor}),signal:AbortSignal.timeout(6000)});
  if(!r.ok)return reply(503);return reply(await r.json()?204:429);
 }catch{return reply(503);}
});
