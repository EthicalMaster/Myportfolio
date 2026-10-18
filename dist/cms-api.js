export const config = window.PORTFOLIO_CONFIG || {};
export const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url || '') && !!config.key;
let session = null;
try { session = JSON.parse(sessionStorage.getItem('portfolio-owner-session') || 'null'); } catch {}
function keep(value) { session=value; if(value)sessionStorage.setItem('portfolio-owner-session',JSON.stringify(value));else sessionStorage.removeItem('portfolio-owner-session'); }
export async function request(path, options={}, owner=false) {
  if(!configured) throw Error('Database connection has not been configured.');
  if(owner && !session) throw Error('Sign in to continue.');
  if(owner && session.expires_at * 1000 < Date.now()+60000) {
    const r=await fetch(config.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:config.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});
    if(!r.ok){keep(null);throw Error('Session expired. Sign in again.');}keep(await r.json());
  }
  const headers={apikey:config.key,...(owner?{Authorization:'Bearer '+session.access_token}:{}),...options.headers};
  const r=await fetch(config.url+path,{...options,headers,cache:'no-store'});
  if(!r.ok){let data;try{data=await r.json();}catch{}throw Error(data?.msg||data?.message||data?.error_description||'Request failed ('+r.status+').');}
  if(r.status===204)return null;const text=await r.text();return text?JSON.parse(text):null;
}
export async function login(email,password){keep(await request('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}));await verifyOwner();}
export async function verifyOwner(){await request('/auth/v1/user',{},true);const rows=await request('/rest/v1/portfolio_owners?select=user_id',{},true);if(!rows.length){keep(null);throw Error('This account is not the portfolio owner.');}}
export async function logout(){try{await request('/auth/v1/logout',{method:'POST'},true);}finally{keep(null);}}
export async function readDocument(kind='published',owner=false){const rows=await request('/rest/v1/portfolio_documents?kind=eq.'+kind+'&select=body,revision',{},owner);return rows[0]||null;}
export async function saveDocument(body,revision){return request('/rest/v1/rpc/save_portfolio_draft',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({new_body:body,expected_revision:revision})},true);}
export async function publishDocument(revision){return request('/rest/v1/rpc/publish_portfolio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expected_revision:revision})},true);}
export async function assetURL(path,owner=false){if(!/^[a-f0-9-]+\.(pdf|png|jpg|webp)$/.test(path))throw Error('Invalid file reference.');const r=await request('/storage/v1/object/sign/portfolio-files/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expiresIn:300})},owner);return config.url+'/storage/v1'+r.signedURL;}
export async function upload(file){
  const types={'application/pdf':'pdf','image/png':'png','image/jpeg':'jpg','image/webp':'webp'};
  if(!types[file.type]||file.size>10*1024*1024)throw Error('Choose a PDF, JPG, PNG or WebP up to 10 MB.');
  const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());
  const magic={pdf:bytes[0]===37&&bytes[1]===80&&bytes[2]===68&&bytes[3]===70,png:bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71,jpg:bytes[0]===255&&bytes[1]===216,webp:String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'};
  if(!magic[types[file.type]])throw Error('The file contents do not match its type.');
  const path=crypto.randomUUID()+'.'+types[file.type];
  await request('/storage/v1/object/portfolio-files/'+path,{method:'POST',headers:{'Content-Type':file.type},body:file},true);return 'asset:'+path;
}
