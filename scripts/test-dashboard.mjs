import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mergeDocument,fieldsForProject,originalProjects} from '../dist/admin/content-editors.js';
import {validateEvent} from '../backend/portfolio-analytics/core.mjs';
import {publicBody} from '../dist/cms-model.js';
const defaults=JSON.parse(fs.readFileSync(new URL('../dist/cms-defaults.json',import.meta.url))),fields=JSON.parse(fs.readFileSync(new URL('../dist/cms-fields.json',import.meta.url)));
const previous=structuredClone(defaults);delete previous.values.education_cgpa;delete previous.settings;delete previous.visibility.fgb;previous.values['index.html_30']='AVEN edited by owner';previous.collections.projects=[{id:'existing',title:'Owner project',visible:true}];
const merged=mergeDocument(defaults,previous);
assert.equal(merged.values['index.html_30'],'AVEN edited by owner');assert.equal(merged.collections.projects[0].id,'existing');assert.equal(merged.values.education_cgpa,'9');assert.equal(merged.visibility.fgb,true);
for(const project of originalProjects){const list=fieldsForProject(fields,project);assert(list.some(x=>x.type==='url'));assert(list.some(x=>x.key===project.title));assert.equal(new Set(list.map(x=>x.key)).size,list.length);}
merged.values.aven_cover='asset:11111111-1111-4111-8111-111111111111.png';assert(publicBody(merged).assets.includes('11111111-1111-4111-8111-111111111111.png'));
const event={id:'11111111-1111-4111-8111-111111111111',session:'22222222-2222-4222-8222-222222222222',event:'pageview',page:'/',target:'',referrer:'example.com',device:'mobile'};
assert.equal(validateEvent(event).page,'/');
for(const x of [{id:'invalid'},{page:'/admin/'},{page:'/?email=private'},{event:'chat'},{referrer:'https://example.com/private?q=secret'},{target:'<script>'},{device:'phone'}])assert.throws(()=>validateEvent({...event,...x}));
assert(!('email' in validateEvent({...event,email:'private@example.com'})));
console.log('Dashboard checks passed: legacy content preserved, original project mappings, CGPA defaults, cover publication and analytics input restrictions.');
