export function safeURL(value,allowEmail=false){
  if(typeof value!=='string'||!value)return '';
  if(/^asset:[a-f0-9-]+\.(pdf|png|jpg|webp)$/.test(value))return value;
  if(value.startsWith('#')||/^(\.\.\/)?(skills\/|portrait\.jpg)(#.*)?$/.test(value))return value;
  try{const u=new URL(value);if(['https:','http:'].includes(u.protocol)||(allowEmail&&u.protocol==='mailto:'))return value;}catch{}
  return '';
}
export function publicBody(draft){
  const d=structuredClone(draft);d.assets=[];
  for(const key of Object.keys(d.collections))d.collections[key]=d.collections[key].filter(x=>x.visible);
  if(!d.resume.enabled)d.resume.file='';
  const walk=x=>{if(typeof x==='string'&&/^asset:[a-f0-9-]+\.(pdf|png|jpg|webp)$/.test(x))d.assets.push(x.slice(6));else if(Array.isArray(x))x.forEach(walk);else if(x&&typeof x==='object')Object.values(x).forEach(walk);};
  walk(d);d.assets=[...new Set(d.assets)];return d;
}
export function validateDocument(d){
  if(!d||d.version!==1||!d.values||!d.socials||!d.collections||!d.resume||!d.circuit||!d.visibility)throw Error('This is not a compatible portfolio backup.');
  if(JSON.stringify(d).length>750000)throw Error('Content is too large. Upload images as files.');
  for(const list of Object.values(d.collections)){if(!Array.isArray(list)||list.length>100)throw Error('Each collection supports up to 100 entries.');for(const item of list)if(typeof item.title!=='string'||!item.title.trim())throw Error('Give every entry a title before saving.');}
  return d;
}
