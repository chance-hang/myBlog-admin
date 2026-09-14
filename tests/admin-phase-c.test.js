'use strict';
const assert=require('node:assert/strict');
const c=require('../phase-c.js');
const id='article_01J7T4QFK0Y2V9N7Q8P6R3S5D1';
const source={schemaVersion:1,articles:[{id,date:'2026-09-11',type:'article',category:'ai',reading:'1 min',title:'Selected',summary:'s',body:'text'}],notes:[],topics:[]};
const prod={schemaVersion:1,articles:[{id:'article_01J7T4QFK0Y2V9N7Q8P6R3S5D2',date:'x',type:'article',category:'ai',reading:'1',title:'Untouched',summary:'u',body:'exact'}],notes:[],topics:[]};
const args={source,prod,sourceSha:'a'.repeat(40),prodSha:'b'.repeat(40),prodBlobSha:'c'.repeat(40),selected:[id],operator:'reviewer',testAcceptance:{url:'https://example.test',commitSha:'a'.repeat(40),confirmedAtUtc:'2026-09-11T00:00:00.000Z'},now:Date.UTC(2026,8,11),ulid:'01J7T4QFK0Y2V9N7Q8P6R3S5D1'};
(async()=>{const p=await c.buildPlan(args);assert.doesNotThrow(()=>c.assertPlan(p));assert.equal(p.selectedEntries.length,1);assert.equal(prod.articles[0].body,'exact');assert.equal(p.images.length,0);assert.equal((await c.buildPlan(args)).releaseId,p.releaseId);await assert.rejects(()=>c.buildPlan({...args,selected:['missing']}),/不在 Prod review/);assert.throws(()=>c.assertPlan({...p,repo:'other/repo'}),/非法/);assert.deepEqual(c.refs({body:'![x](assets/uploads/'+ 'a'.repeat(64)+'.png)'}),['assets/uploads/'+ 'a'.repeat(64)+'.png']);
console.log('Phase C plan safety tests passed');})().catch(e=>{throw e});
