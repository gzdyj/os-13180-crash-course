const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rand(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
function scheduling(jobs,algo='FCFS',quantum=2){
 const list=jobs.map((p,i)=>({...p,i,left:p.burst,first:null,finish:null})),segments=[];let t=0,done=0,queue=[];
 const segment=(p,len)=>{if(p.first===null)p.first=t;segments.push({name:p.name,start:t,end:t+len});p.left-=len;t+=len;if(!p.left){p.finish=t;done++;}};
 if(algo==='RR'){
  const pending=[...list].sort((a,b)=>a.arrival-b.arrival||a.i-b.i);
  while(done<list.length){if(!queue.length&&pending.length&&t<pending[0].arrival){segments.push({name:'空闲',start:t,end:pending[0].arrival});t=pending[0].arrival;}
   while(pending.length&&pending[0].arrival<=t)queue.push(pending.shift());
   const p=queue.shift();if(!p)throw Error('invalid RR input');segment(p,Math.min(quantum,p.left));
   while(pending.length&&pending[0].arrival<=t)queue.push(pending.shift());if(p.left)queue.push(p);
  }
 }else{
  while(done<list.length){const ready=list.filter(p=>p.left>0&&p.arrival<=t);if(!ready.length){const nt=Math.min(...list.filter(p=>p.left>0).map(p=>p.arrival));segments.push({name:'空闲',start:t,end:nt});t=nt;continue;}
   ready.sort((a,b)=>((algo==='SJF'?a.burst-b.burst:algo==='SRTF'?a.left-b.left:0)||a.arrival-b.arrival||a.i-b.i));const p=ready[0];segment(p,algo==='SRTF'?1:p.left);
  }
 }
 const rows=list.map(p=>({...p,turn:p.finish-p.arrival,weight:(p.finish-p.arrival)/p.burst,wait:p.finish-p.arrival-p.burst,response:p.first-p.arrival}));
 const merged=[];for(const s of segments){const last=merged.at(-1);if(last&&last.name===s.name&&last.end===s.start)last.end=s.end;else merged.push({...s});}
 return{rows,segments:merged,average:rows.reduce((n,p)=>n+p.turn,0)/rows.length,weighted:rows.reduce((n,p)=>n+p.weight,0)/rows.length};
}
function paging(refs,capacity,algo){let frames=[],queue=[],last=new Map(),faults=0;const steps=[];
 refs.forEach((p,i)=>{let fault=!frames.includes(p),out=null;if(fault){faults++;if(frames.length<capacity){frames.push(p);queue.push(p);}else{let victim;
 if(algo==='FIFO')victim=queue.shift();else if(algo==='LRU')victim=[...frames].sort((a,b)=>last.get(a)-last.get(b))[0];else victim=[...frames].sort((a,b)=>{let x=refs.indexOf(a,i+1),y=refs.indexOf(b,i+1);return(y<0?Infinity:y)-(x<0?Infinity:x);})[0];
 out=victim;frames[frames.indexOf(victim)]=p;if(algo==='FIFO')queue.push(p);}}
 last.set(p,i);steps.push({p,frames:[...frames],fault,out});});return{faults,steps};
}
function banker(available,allocation,max){const need=max.map((r,i)=>r.map((v,j)=>v-allocation[i][j])),work=[...available],finished=new Set(),steps=[],sequence=[];
 while(finished.size<allocation.length){const i=need.findIndex((r,i)=>!finished.has(i)&&r.every((v,j)=>v<=work[j]));if(i<0)break;const before=[...work];allocation[i].forEach((v,j)=>work[j]+=v);finished.add(i);sequence.push(i);steps.push({i,before,after:[...work]});}
 return{safe:finished.size===allocation.length,need,steps,sequence,work,unfinished:allocation.map((_,i)=>i).filter(i=>!finished.has(i))};
}
function disk(head,requests,algo,direction='up',maxTrack=199){let order=[];if(algo==='FCFS')order=[...requests];else if(algo==='SSTF'){let p=head,left=[...requests];while(left.length){left.sort((a,b)=>Math.abs(a-p)-Math.abs(b-p)||a-b);p=left.shift();order.push(p);}}else{
 const high=requests.filter(p=>p>=head).sort((a,b)=>a-b),low=requests.filter(p=>p<head).sort((a,b)=>b-a);
 if(direction==='up'){order=[...high];if(low.length){if(algo==='SCAN'&&order.at(-1)!==maxTrack&&head!==maxTrack)order.push(maxTrack);order.push(...low);}}
 else{order=[...low];if(high.length){if(algo==='SCAN'&&order.at(-1)!==0&&head!==0)order.push(0);order.push(...high);}}
 }let prev=head,total=0;const steps=order.map(p=>{const distance=Math.abs(p-prev),from=prev;total+=distance;prev=p;return{from,to:p,distance,total};});return{order,total,steps};
}
function makeLab(kind,choice){
 if(kind==='schedule'){const algo=choice||shuffle(['FCFS','SJF','SRTF','RR'])[0],jobs=['A','B','C','D'].map((name,i)=>({name,arrival:i?rand(0,5):0,burst:rand(1,7)}));return{kind,algo,jobs,quantum:2};}
 if(kind==='address'){const size=2**rand(9,12),page=rand(1,7),offset=rand(0,size-1),frame=rand(8,24);return{kind,size,page,offset,frame,address:page*size+offset};}
 if(kind==='paging')return{kind,algo:choice||shuffle(['FIFO','LRU','OPT'])[0],refs:Array.from({length:12},()=>rand(0,5)),capacity:3};
 if(kind==='banker'){const allocation=Array.from({length:3},()=>[rand(0,3),rand(0,3)]),max=allocation.map(r=>r.map(v=>v+rand(0,4)));return{kind,available:[rand(0,3),rand(0,3)],allocation,max};}
 return{kind:'disk',algo:choice||shuffle(['FCFS','SSTF','SCAN','LOOK'])[0],head:rand(35,165),requests:shuffle(Array.from({length:20},(_,i)=>i*10+rand(0,9))).slice(0,6),direction:rand(0,1)?'up':'down',maxTrack:199};
}
function solveLab(l){if(l.kind==='schedule')return scheduling(l.jobs,l.algo,l.quantum);if(l.kind==='paging')return paging(l.refs,l.capacity,l.algo);if(l.kind==='banker')return banker(l.available,l.allocation,l.max);if(l.kind==='disk')return disk(l.head,l.requests,l.algo,l.direction,l.maxTrack);return{page:Math.floor(l.address/l.size),offset:l.address%l.size,physical:l.frame*l.size+l.offset};}
function labAnswer(l){const s=solveLab(l);return l.kind==='schedule'?s.average:l.kind==='address'?s.physical:l.kind==='paging'?s.faults:l.kind==='banker'?(s.safe?'安全':'不安全'):s.total;}
function labCorrect(l,value){if(l.kind==='banker')return value===labAnswer(l);return String(value).trim()!==''&&Number.isFinite(Number(value))&&Math.abs(Number(value)-labAnswer(l))<0.011;}
if(typeof module!=='undefined')module.exports={scheduling,paging,banker,disk,makeLab,solveLab,labAnswer,labCorrect};
