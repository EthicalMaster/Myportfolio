import {validateContact,validateChat,buildKnowledge,systemPrompt} from './core.mjs';
import fields from './fields.json' with {type:'json'};
const env=(name:string)=>Deno.env.get(name)||'';
const base=env('SUPABASE_URL'),service=env('SUPABASE_SERVICE_ROLE_KEY');
const publicKey='sb_publishable_I11QmBvBIYyrJBcpWxKgmA_i9PEMZvF';
const origins=(env('PORTFOLIO_ALLOWED_ORIGINS')||'https://tsportfolio-sandy.vercel.app,https://taher-motion-study.iamspectrehq.chatgpt.site,http://localhost:3000,http://127.0.0.1:3000').split(',').map(s=>s.trim());
async function db(path:string,options:RequestInit={}){const r=await fetch(base+'/rest/v1/'+path,{...options,headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json',...options.headers},signal:AbortSignal.timeout(7000)});if(!r.ok)throw Error('storage_unavailable');return r.status===204?null:await r.json();}
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(origins.includes(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS'};
 const respond=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(!origins.includes(origin))return respond({error:'This website origin is not configured.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return respond({error:'Method not allowed.'},405);
 // Public visitor endpoint: explicit publishable-key validation; no owner session is needed.
 if(![publicKey,env('SUPABASE_ANON_KEY')].filter(Boolean).includes(req.headers.get('apikey')||''))return respond({error:'Portfolio connection is not configured.'},401);
 if(Number(req.headers.get('content-length')||0)>16000)return respond({error:'Message too large.'},413);
 try{
  const reader=req.body?.getReader();if(!reader)return respond({error:'Missing request.'},400);let chunks:Uint8Array[]=[],size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16000){await reader.cancel();return respond({error:'Message too large.'},413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let position=0;for(const c of chunks){bytes.set(c,position);position+=c.length;}let input;try{input=JSON.parse(new TextDecoder().decode(bytes));}catch{return respond({error:'Invalid request.'},400);}
  if(!input||!['chat','request'].includes(input.action))return respond({error:'Invalid action.'},400);
  let validated;try{validated=input.action==='request'?validateContact(input):validateChat(input);}catch(e){return respond({error:e.message},400);}
  if(input.action==='chat'&&!env('GROQ_API_KEY'))return respond({error:'Live AI chat is not connected yet. You can still explore or leave a request.'},503);
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(service+':'+ip));const hash=[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
  const allowed=await db('rpc/admit_portfolio_request',{method:'POST',body:JSON.stringify({action_kind:input.action,visitor_hash:hash})});
  if(!allowed)return respond({error:input.action==='chat'?'I’m at my chat limit for now. The tour and contact links still work.':'Please wait before submitting another request. You can also use the direct email link.'},429);
  if(input.action==='request'){
   await db('portfolio_requests?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify(validated)});
   return respond({id:validated.id,message:'Your request is saved in Taher’s inbox. This is not a booking or a promise of availability.'});
  }
  const rows=await db('portfolio_documents?kind=eq.published&select=body');
  if(!rows?.[0])return respond({error:'My portfolio knowledge is not ready yet. You can browse the work or leave a request.'},503);
  const {facts,sources}=buildKnowledge(rows[0].body,fields,validated.message);
  const model=env('GROQ_MODEL')||'openai/gpt-oss-20b';
  const messages=[{role:'system',content:systemPrompt+'\nPUBLIC PORTFOLIO EXCERPTS:\n'+JSON.stringify(facts)},...validated.history,{role:'user',content:validated.message}];
  const upstream=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+env('GROQ_API_KEY'),'Content-Type':'application/json'},body:JSON.stringify({model,messages,temperature:.65,max_completion_tokens:700,...(model.startsWith('openai/gpt-oss')?{reasoning_effort:'low',include_reasoning:false}:{})}),signal:AbortSignal.timeout(18000)});
  if(!upstream.ok){console.error('Groq request failed',{status:upstream.status});return respond({error:upstream.status===429?'Live chat is busy or its free allowance is used up. You can still take the tour or leave a request.':'Live chat is temporarily unavailable. You can still browse or leave a request.'},503);}
  const result=await upstream.json();const answer=result?.choices?.[0]?.message?.content;
  if(typeof answer!=='string'||!answer.trim())return respond({error:'I couldn’t produce an answer just now. Please try again or use the contact options.'},503);
  return respond({answer:answer.trim().slice(0,1800),sources:sources.slice(0,3)});
 }catch(e){console.error('Portfolio assistant failure',{type:e?.name||'Error'});return respond({error:'The service is temporarily unavailable. No submission is confirmed without a receipt; please retry or use the direct contact links.'},503);}
});
