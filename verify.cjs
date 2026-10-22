const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('./engines.js');
const jobs=[{name:'A',arrival:0,burst:5},{name:'B',arrival:1,burst:2},{name:'C',arrival:2,burst:1}];
for(const [algorithm,turn]of [['FCFS',[5,6,6]],['SJF',[5,7,4]],['RR',[8,3,3]],['SRTF',[8,2,2]]])assert.deepEqual(E.scheduling(jobs,algorithm,2).rows.map(x=>x.turn),turn,algorithm);
assert.equal(E.scheduling([{name:'A',arrival:4,burst:1}], 'RR').average,1);
assert.equal(E.scheduling([{name:'A',arrival:4,burst:1}], 'FCFS').segments[0].name,'空闲');
const requests=[98,183,37,122,14,124,65,67];
for(const [algo,total]of [['FCFS',640],['SSTF',236],['SCAN',331],['LOOK',299]])assert.equal(E.disk(53,requests,algo,'up').total,total,algo);
assert.equal(E.disk(53,[65,67],'SCAN','up').total,14,'最后请求后不多走到端点');
assert.equal(E.disk(53,[14,37],'SCAN','up').total,331,'初始方向无请求但另一侧有时仍走端点');
assert.equal(E.disk(53,[14,37],'SCAN','down').total,39);
assert.equal(E.banker([3,3,2],[[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]],[[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]).safe,true);
assert.equal(E.banker([0],[[1],[1]],[[2],[2]]).safe,false);
function refPage(refs,n,algo){let frames=[],load=new Map(),used=new Map(),fault=0;for(let t=0;t<refs.length;t++){const p=refs[t];if(!frames.includes(p)){fault++;if(frames.length===n){let best=frames[0];const score=v=>algo==='FIFO'?load.get(v):algo==='LRU'?used.get(v):(()=>{const j=refs.indexOf(v,t+1);return j<0?-Infinity:-j;})();for(const f of frames)if(score(f)<score(best))best=f;frames.splice(frames.indexOf(best),1);}frames.push(p);load.set(p,t);}used.set(p,t);}return fault;}
for(let i=0;i<350;i++){const refs=Array.from({length:20},()=>Math.floor(Math.random()*6));for(const algo of ['FIFO','LRU','OPT'])assert.equal(E.paging(refs,3,algo).faults,refPage(refs,3,algo));assert.ok(E.paging(refs,3,'OPT').faults<=E.paging(refs,3,'LRU').faults);}
const box={};vm.runInNewContext(fs.readFileSync(__dirname+'/data.js','utf8')+';this.q=QUESTIONS;this.c=CARDS;this.s=SHORTS;',box);
assert.equal(box.q.length,64);assert.equal(box.c.length,32);assert.equal(box.s.length,16);for(let ch=0;ch<8;ch++){assert.equal(box.q.filter(q=>q.ch===ch).length,8);assert.equal(box.c.filter(q=>q.ch===ch).length,4);}
for(const q of box.q){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explain.length>10);}
for(const kind of ['schedule','address','paging','banker','disk'])for(let i=0;i<100;i++){const l=E.makeLab(kind),ans=E.labAnswer(l);assert.ok(E.labCorrect(l,ans));assert.equal(E.labCorrect(l,''),false);if(kind==='banker'){const s=E.solveLab(l);const work=[...l.available];for(const p of s.sequence){assert.ok(s.need[p].every((n,j)=>n<=work[j]));l.allocation[p].forEach((n,j)=>work[j]+=n);}}}
console.log('PASS: known scheduling/disk/banker fixtures, 1050 independent page comparisons, 500 generated exercises, 64 questions/32 cards/16 shorts.');
