export const originalProjects=[
 {id:'aven',name:'AVEN',title:'index.html_30',summary:'index.html_32',range:[26,48],main:[30,31,29,32,46,47,48,33,34,35,36,37,38],cover:'aven_cover'},
 {id:'smartstudy',name:'SmartStudy',title:'index.html_59',summary:'index.html_61',range:[49,68],main:[59,60,58,61,67,68,62,63,64],cover:'smartstudy_cover'},
 {id:'fgb',name:'FGB Tea',title:'index.html_71',summary:'index.html_72',range:[70,73],main:[71,72,70,73]},
 {id:'sarra',name:'Sarra’s portfolio',title:'index.html_75',summary:'index.html_76',range:[74,76],main:[75,76,74]}
];
const labels={29:'Project status / eyebrow',30:'Project name',31:'Subtitle',32:'Project description',33:'Technology 1',34:'Technology 2',35:'Technology 3',36:'Technology 4',37:'Progress heading',38:'What works today',39:'Details heading',40:'Learning features',41:'Documents and retrieval',42:'Technical implementation',43:'Next steps heading',44:'AI integration status',45:'Next steps description',46:'Live app URL',47:'Open-project button text',48:'Link / hosting note',58:'Project status / eyebrow',59:'Heading, line 1',60:'Heading, line 2',61:'Project description',62:'Technology 1',63:'Technology 2',64:'Technology 3',65:'Details heading',66:'How the project works',67:'Repository or live URL',68:'Open-project button text',70:'Original website URL',71:'Project name',72:'Short description',73:'Your contribution / client context',74:'Website URL',75:'Project name',76:'Short description',109:'Degree',110:'Institute',111:'Specialization',112:'Year',113:'Semester',114:'Degree',115:'Institute',116:'Level and term',117:'Current courses',118:'Result label',119:'Previous results',120:'Academic snapshot date'};
export function fieldLabel(f){return f.page==='index.html'?(labels[Number(f.key.split('_')[1])]||f.label):f.label;}
export function fieldsForProject(fields,project){return fields.filter(f=>f.page==='index.html'&&((Number(f.key.split('_')[1])>=project.range[0]&&Number(f.key.split('_')[1])<=project.range[1])||f.key===project.cover));}
export function mergeDocument(defaults,saved={}){const d=structuredClone(defaults);return {...d,...saved,values:{...d.values,...saved.values},socials:{...d.socials,...saved.socials},visibility:{...d.visibility,...saved.visibility},settings:{...d.settings,...saved.settings},collections:{...d.collections,...saved.collections},resume:{...d.resume,...saved.resume},circuit:{...d.circuit,...saved.circuit}};}
export function originalEditor({container,doc,fields,input,button,fileControl,changed,node},type='projects'){
 const projects=type==='projects'?originalProjects:[
  {id:'education-btech',name:'B.Tech · Acropolis',range:[109,113],main:[109,110,111,112,113]},
  {id:'education-iitm',name:'BS · IIT Madras',range:[114,119],main:[114,115,116,117,118,119]}
 ];
 const intro=node('div',null,'section-intro');intro.append(node('h2',type==='projects'?'Already on your portfolio':'Your current education'),node('p','Edit the originals here. These fields update the existing design when you publish.','hint'));container.append(intro);
 const grid=node('div',null,'original-list');container.append(grid);
 for(const project of projects){
  const card=node('details',null,'entry original-entry');const summary=node('summary');const text=node('span');text.append(node('span',project.name,'entry-name'),node('span',doc.visibility[project.id]===false?'Hidden from portfolio':'Original · on portfolio','entry-meta'));summary.append(text,node('span','Edit ↗','entry-edit'));card.append(summary);grid.append(card);
  const form=node('div',null,'entry-body');card.append(form);
  input(form,'Show on portfolio',doc.visibility[project.id]!==false,v=>{doc.visibility[project.id]=v;if(project.id==='fgb')doc.visibility['fgb-note']=v;summary.querySelector('.entry-meta').textContent=v?'Original · on portfolio':'Hidden from portfolio';},'checkbox');
  const selected=fieldsForProject(fields,project),basic=node('div',null,'form-grid');form.append(basic);
  const add=(target,f)=>{const control=input(target,fieldLabel(f),doc.values[f.key],v=>doc.values[f.key]=v,f.type==='url'?'url':f.type==='image'?'text':(doc.values[f.key]?.length>100?'textarea':'text'));if(f.type==='image')fileControl(target,'Replace cover image',()=>doc.values[f.key],v=>doc.values[f.key]=v);return control;};
  for(const n of project.main){const f=selected.find(f=>f.key==='index.html_'+n);if(f)add(basic,f);}
  if(project.id==='education-iitm'){const f=fields.find(f=>f.key==='education_cgpa');add(basic,f);}
  if(project.cover){const f=selected.find(f=>f.key===project.cover);const media=node('div',null,'media-editor');form.append(media);media.append(node('h3','Project visual'),node('p','Upload a screenshot to replace the illustration. Remove the attachment to restore the original motion artwork.','hint'));fileControl(media,'Project cover image',()=>doc.values[f.key],v=>doc.values[f.key]=v);}
  const rest=selected.filter(f=>!project.main.includes(Number(f.key.split('_')[1]))&&f.key!==project.cover);
  if(rest.length){const more=node('details',null,'advanced-fields');more.append(node('summary','Details & illustration labels'));form.append(more);for(const f of rest)add(more,f);}
 }
 if(type==='education'){const p=node('div',null,'panel');container.append(p);const f=fields.find(f=>f.key==='index.html_120');input(p,'Academic snapshot date',doc.values[f.key],v=>doc.values[f.key]=v);}
}
