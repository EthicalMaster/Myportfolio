// The first release is an authored tour. It does not pretend to be an LLM.
export const homeStops=[
 {id:'home',label:'A curious mind',intro:'Welcome to Taher’s corner of the web. The sculpture is interactive—try Orbit, Signal or Expand.',source:'.intro-copy'},
 {id:'aven',label:'Meet AVEN',intro:'This is the flagship learning-platform project. Open its details to see what is built and what is still planned.',source:'.project-info > p:not(.project-id):not(.project-link-note)'},
 {id:'smartstudy',label:'Follow the agents',intro:'Try “Next step” in the workflow illustration to follow how the agents coordinate.',source:'.project-info > p:not(.project-id)'},
 {id:'websites',label:'Work for real people',intro:'These links open the original websites. The FGB note explains exactly which parts Taher built.',source:'.project-scope-note'},
 {id:'skills',label:'Trace a connection',intro:'Choose a circuit node to connect a skill with the project where it was used.',source:'.lab-heading > p'},
 {id:'about',label:'Behind the projects',intro:'Here’s the person and the current academic chapter. Expand the education rows for more detail.',source:'.about-text > p'},
 {id:'contact',label:'Start a conversation',intro:'Have a project or a question? The contact links are right here.',source:'.contact-layout > div > p'}
];
export const skillsStops=[
 {id:'build',label:'Code & practical skills',intro:'Python and project experience live here. Expand the rows to read the context behind each skill.',source:'.python-feature > div > p'},
 {id:'explore',label:'Questions worth exploring',intro:'This side is about interests. Try changing the height and spacing of the wave.',source:'.lens-intro > p'},
 {id:'sketch',label:'A little graphite',intro:'Meet the sketching side of Taher. The drawing pad is yours to try; it is not a gallery of his artwork.',source:'.lens-intro > p'}
];
export const extraLabels={certificates:'Learning, with evidence',projects:'More projects',education:'The learning continues',experience:'Experience',achievements:'Milestones',skills:'More practical skills',interests:'More interests',artwork:'The sketchbook'};
export function clip(text,max=330){const clean=String(text||'').replace(/\s+/g,' ').trim();if(clean.length<=max)return clean;const cut=clean.slice(0,max);return cut.slice(0,Math.max(cut.lastIndexOf(' '),max-25))+'…';}
export function nextIndex(current,total){return total?Math.min(current+1,total-1):0;}
