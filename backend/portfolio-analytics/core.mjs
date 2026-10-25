export function validateEvent(d){
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 if(!d||!uuid.test(d.id)||!uuid.test(d.session)||!['pageview','project_click','contact_click','resume_click'].includes(d.event)||!['/','/skills/'].includes(d.page)||!['mobile','tablet','desktop'].includes(d.device))throw Error('Invalid event');
 const target=typeof d.target==='string'?d.target:'';
 if(target.length>80||!/^[a-z0-9 _:/.-]*$/i.test(target)||typeof d.referrer!=='string'||d.referrer.length>120||!/^([a-z0-9.-]+)?$/i.test(d.referrer))throw Error('Invalid metadata');
 return {id:d.id,session:d.session,event:d.event,page:d.page,target,referrer:d.referrer,device:d.device};
}
