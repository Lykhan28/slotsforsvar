// ---------- achievements ----------
// ACH: id, icon, name, description and optionally pr() = [progress, goal] for the menu page. Unlocked ones live in localStorage sfach {id: time},
// lifetime counters in sfstat (AST: kills, bats, spells, boss = boss types defeated). The game logic calls ach(event, data) – kill, win, banish, cast,
// repair, endless, perk (stubbed in the sim) – and the render loop calls achTick() (gold, towers, hero level). achScan() unlocks whatever saved progress
// already earns (silently at load). A new achievement needs an ACH entry and a check in one of those.
const AST={kills:0,bats:0,spells:0,boss:[]},ACHD={};
try{Object.assign(ACHD,JSON.parse(localStorage.getItem('sfach'))||{});}catch(e){}
try{const d=JSON.parse(localStorage.getItem('sfstat'))||{};for(const k in AST)if(d[k]!=null)AST[k]=Array.isArray(AST[k])?(Array.isArray(d[k])?d[k].filter(t=>E[t]):[]):Math.max(0,+d[k]||0);}catch(e){}
const endBest=()=>Math.max(0,...DIFS.flatMap(d=>BEST[d.k].map(x=>x|0))),ACH=[
{id:'win',ic:'🏁',n:'First Victory',d:'Win any level.'},
{id:'flawless',ic:'🛡️',n:'Not a Scratch',d:'Win a level without losing a single life.'},
{id:'brink',ic:'😅',n:'By a Thread',d:'Win a level with just one life left.'},
{id:'hard',ic:'⚔️',n:'Iron Will',d:'Win a level on Hard.'},
{id:'untouch',ic:'👑',n:'Untouchable',d:'Win a level on Hard without losing a single life.'},
{id:'realm',ic:'🏰',n:'Defender of the Realm',d:'Win all eight levels.',pr:()=>[Math.max(...DIFS.map(d=>PROG[d.k].n)),LEVELS.length]},
{id:'legend',ic:'🐲',n:'Legend of the Realm',d:'Win all eight levels on Hard.',pr:()=>[PROG.hard.n,LEVELS.length]},
{id:'stars',ic:'⭐',n:'Star Collector',d:'Earn 30 stars.',pr:()=>[starsAll(),30]},
{id:'dragon',ic:'🔮',n:'Go Home, Dragon',d:'Banish the same Dragon three times.'},
{id:'rich',ic:'💰',n:'Royal Treasury',d:'Hold 1,000 gold at once.'},
{id:'kills',ic:'💀',n:'Goblin Bane',d:'Defeat 1,000 enemies.',pr:()=>[AST.kills,1000]},
{id:'bats',ic:'🦇',n:'Bat Swatter',d:'Shoot down 100 bat swarms.',pr:()=>[AST.bats,100]},
{id:'bosses',ic:'🗡️',n:'Monster Hunter',d:'Defeat the Dragon, the Goblin King, the Siege Ram and the Necromancer.',pr:()=>[AST.boss.length,4]},
{id:'end30',ic:'♾️',n:'Unbreakable',d:'Survive 30 waves in Endless mode.',pr:()=>[endBest(),30]},
{id:'end40',ic:'🌑',n:'The Long Night',d:'Survive 40 waves in Endless mode.',pr:()=>[endBest(),40]},
{id:'hero',ic:'🐴',n:'Knight Commander',d:'Raise Sir Roland to level 5.'},
{id:'spells',ic:'📜',n:'Battle Mage',d:'Cast 50 spells.',pr:()=>[AST.spells,50]},
{id:'arsenal',ic:'🏗️',n:'Full Arsenal',d:'Have all nine kinds of tower on the board at once.'},
{id:'mason',ic:'🧱',n:'Patch It Up',d:'Repair the gate five times in one level.'},
{id:'perk',ic:'🛒',n:'Royal Patron',d:'Buy a perk in the Royal Armoury.'}];
let stDirty=false,stT=0;
const stSave=()=>{stDirty=false;stT=performance.now();try{localStorage.setItem('sfstat',JSON.stringify(AST));}catch(e){}};
function unlock(id,quiet){if(ACHD[id]||!ACH.some(a=>a.id==id))return;ACHD[id]=Date.now();try{localStorage.setItem('sfach',JSON.stringify(ACHD));}catch(e){}if(stDirty)stSave();if(!quiet)toast(id);}
function achScan(q){for(const a of ACH)if(a.pr){const[v,n]=a.pr();if(v>=n)unlock(a.id,q);}if(DIFS.some(d=>PROG[d.k].n>0))unlock('win',q);if(PROG.hard.n>0)unlock('hard',q);if(starsSpent()>0)unlock('perk',q);}
function ach(ev,e){
if(ev=='kill'){AST.kills++;if(e.type=='bat')AST.bats++;if(E[e.type].bs&&!AST.boss.includes(e.type))AST.boss.push(e.type);stDirty=true;achScan();}
else if(ev=='win'){const fl=g.rep==0&&g.lives>=maxL();unlock('win');if(fl)unlock('flawless');if(g.lives==1)unlock('brink');if(DFN==DIFS.length-1){unlock('hard');if(fl)unlock('untouch');}achScan();}
// the Dragon only ('boss' is the Dragon's type); e.bnc counts the banishes of that one dragon
else if(ev=='banish'){if(e.type=='boss'&&(e.bnc=(e.bnc||0)+1)>=3)unlock('dragon');}
else if(ev=='cast'){AST.spells++;stDirty=true;achScan();}
else if(ev=='repair'){if(g.rep>=5)unlock('mason');}
else achScan();}// endless, perk
// every 200 ms from the render loop: things that are simplest to check by looking; counters are written at most every 3 s
function achTick(){if(MENU.open)return;if(g.gold>=1000)unlock('rich');if(new Set(g.tw.map(t=>t.k)).size>=Object.keys(T).length)unlock('arsenal');if(g.hero&&g.hero.lv>=HERO.mx)unlock('hero');
if(stDirty&&performance.now()-stT>3000)stSave();}
// toast: one at a time from a queue, ~4 s each (#toast sits outside #menu so it shows over everything)
const TSQ=[];let tsqT=0;
function toast(id){TSQ.push(id);if(TSQ.length==1)toastNext();}
function toastNext(){const el=$('toast'),id=TSQ[0];if(!id){el.classList.remove('on');return;}const a=ACH.find(x=>x.id==id);snd('ach');
el.innerHTML='<span class="ti">'+a.ic+'</span><span class="tt"><small>Achievement unlocked</small><b>'+a.n+'</b><em>'+a.d+'</em></span>';el.classList.add('on');
clearTimeout(tsqT);tsqT=setTimeout(()=>{el.classList.remove('on');tsqT=setTimeout(()=>{TSQ.shift();toastNext();},450);},3800);}
// menu page: every achievement, unlocked ones with their date, locked ones greyed out with their progress where there is a count
function mAch(){const n=ACH.filter(a=>ACHD[a.id]).length;$('m_an2').textContent=n+' of '+ACH.length+' unlocked'+(n==ACH.length?' – every last one. Well done!':'.');const el=$('m_al2');el.innerHTML='';
for(const a of ACH){const u=ACHD[a.id],p=!u&&a.pr?a.pr():null,d=document.createElement('div');d.className='ach'+(u?' on':'');
d.innerHTML='<span class="ai">'+a.ic+'</span><span class="at"><b>'+a.n+'</b><small>'+a.d+'</small>'+(u?'<em>Unlocked '+new Date(u).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+'</em>':p?'<span class="apb"><i style="width:'+Math.min(100,p[0]/p[1]*100).toFixed(1)+'%"></i></span><em>'+Math.min(p[0],p[1]).toLocaleString('en')+' / '+p[1].toLocaleString('en')+'</em>':'')+'</span>';el.appendChild(d);}}
$('m_ach').onclick=()=>mPage('achievements');
achScan(true);
