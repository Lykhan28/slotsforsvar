// ---------- achievements ----------
// ACH: id, icon, name, description, p = achievement points (they buy talents, js/14-menu.js) and optionally pr() = [progress, goal] for the menu page.
// Unlocked ones live in localStorage sfach {id: time}, lifetime counters in sfstat (AST: kills, bats, spells, boss = boss types defeated, hk = Sir Kirkevang's killing blows,
// early = waves called early, wins = levels won, waves = waves cleared, oil = Boiling Oil cast, br = level-3 paths built as 'type:branch').
// The game logic calls ach(event, data) – kill, win, banish, cast, repair, endless, perk, hk, smite, wave, early (stubbed in the sim) – and the render loop calls achTick()
// (gold, towers, hero level). achScan() unlocks whatever saved progress already earns (silently at load). A new achievement needs an ACH entry and a check in one of those.
// Points: 10 easy, 20–30 a real goal, 50+ a long one; together about 1,300, and both talent trees cost 720 – one tree's last talent needs 310.
const AST={kills:0,bats:0,spells:0,boss:[],hk:0,early:0,wins:0,waves:0,oil:0,br:[]},ACHD={};
try{Object.assign(ACHD,JSON.parse(localStorage.getItem('sfach'))||{});}catch(e){}
try{const d=JSON.parse(localStorage.getItem('sfstat'))||{};for(const k in AST)if(d[k]!=null)AST[k]=Array.isArray(AST[k])?(Array.isArray(d[k])?d[k].filter(t=>k!='boss'||E[t]):[]):Math.max(0,+d[k]||0);}catch(e){}
const endBest=()=>Math.max(0,...DIFS.flatMap(d=>BEST[d.k].map(x=>x|0))),
// levels with three stars on any difficulty
star3=()=>LEVELS.filter((_,i)=>DIFS.some(d=>(PROG[d.k].st[i]|0)>=3)).length,NPATH=Object.keys(BRN).length*2,ACH=[
{id:'win',ic:'🏁',n:'First Victory',d:'Win any level.',p:10},
{id:'normal',ic:'🗡️',n:'Steady Hand',d:'Win a level on Normal.',p:10},
{id:'hard',ic:'⚔️',n:'Iron Will',d:'Win a level on Hard.',p:20},
{id:'flawless',ic:'🛡️',n:'Not a Scratch',d:'Win a level without losing a single life.',p:20},
{id:'brink',ic:'😅',n:'By a Thread',d:'Win a level with just one life left.',p:10},
{id:'untouch',ic:'👑',n:'Untouchable',d:'Win a level on Hard without losing a single life.',p:50},
{id:'nofall',ic:'🐎',n:'Unbowed',d:'Win a level without Sir Kirkevang ever falling.',p:20},
{id:'few',ic:'🪶',n:'Penny Pincher',d:'Win a level with six towers or fewer on the board.',p:30},
{id:'mono',ic:'🎯',n:'Specialist',d:'Win a level with only one kind of tower on the board.',p:30},
{id:'noup',ic:'🧺',n:'Plain and Simple',d:'Win a level without a single tower above level 1.',p:30},
{id:'realm',ic:'🏰',n:'Defender of the Realm',d:'Win every level.',p:50,pr:()=>[Math.max(...DIFS.map(d=>PROG[d.k].n)),LEVELS.length]},
{id:'realmN',ic:'🛡️',n:'Champion of the Realm',d:'Win every level on Normal.',p:50,pr:()=>[PROG.normal.n,LEVELS.length]},
{id:'legend',ic:'🐲',n:'Legend of the Realm',d:'Win every level on Hard.',p:100,pr:()=>[PROG.hard.n,LEVELS.length]},
{id:'wins',ic:'🎖️',n:'Veteran',d:'Win 25 levels – replays count.',p:20,pr:()=>[AST.wins,25]},
{id:'wins100',ic:'🏅',n:'Old Soldier',d:'Win 100 levels – replays count.',p:50,pr:()=>[AST.wins,100]},
{id:'stars',ic:'⭐',n:'Star Collector',d:'Earn 30 stars.',p:20,pr:()=>[starsAll(),30]},
{id:'stars2',ic:'🌟',n:'Star Hoarder',d:'Earn 60 stars.',p:30,pr:()=>[starsAll(),60]},
{id:'star3',ic:'✨',n:'Perfectionist',d:'Earn three stars on every level, on any difficulty.',p:30,pr:()=>[star3(),LEVELS.length]},
{id:'starsAll',ic:'🌌',n:'All That Glitters',d:'Earn every star on every difficulty.',p:100,pr:()=>[starsAll(),LEVELS.length*3*DIFS.length]},
{id:'waves',ic:'🌊',n:'Wave Breaker',d:'Clear 500 waves.',p:20,pr:()=>[AST.waves,500]},
{id:'waves2',ic:'🗿',n:'The Breakwater',d:'Clear 2,000 waves.',p:40,pr:()=>[AST.waves,2000]},
{id:'early',ic:'📯',n:'Bring It On',d:'Call 50 waves early.',p:20,pr:()=>[AST.early,50]},
{id:'end30',ic:'♾️',n:'Unbreakable',d:'Survive 30 waves in Endless mode.',p:30,pr:()=>[endBest(),30]},
{id:'end40',ic:'🌑',n:'The Long Night',d:'Survive 40 waves in Endless mode.',p:50,pr:()=>[endBest(),40]},
{id:'end50',ic:'🕯️',n:'The Eternal Watch',d:'Survive 50 waves in Endless mode.',p:75,pr:()=>[endBest(),50]},
{id:'kills',ic:'💀',n:'Goblin Bane',d:'Defeat 1,000 enemies.',p:20,pr:()=>[AST.kills,1000]},
{id:'kills2',ic:'☠️',n:'Goblin Scourge',d:'Defeat 5,000 enemies.',p:30,pr:()=>[AST.kills,5000]},
{id:'kills3',ic:'⚰️',n:'Doom of the Horde',d:'Defeat 20,000 enemies.',p:50,pr:()=>[AST.kills,20000]},
{id:'bats',ic:'🦇',n:'Bat Swatter',d:'Shoot down 100 bat swarms.',p:10,pr:()=>[AST.bats,100]},
{id:'bosses',ic:'🐉',n:'Monster Hunter',d:'Defeat the Dragon, the Goblin King, the Siege Ram and the Necromancer.',p:30,pr:()=>[AST.boss.length,4]},
{id:'dragon',ic:'🔮',n:'Go Home, Dragon',d:'Banish the same Dragon three times.',p:20},
{id:'seen',ic:'📚',n:'Naturalist',d:'Meet every kind of enemy.',p:20,pr:()=>[BSK.filter(t=>SEEN[t]).length,BSK.length]},
{id:'hero',ic:'🐴',n:'Knight Commander',d:'Raise Sir Kirkevang to level 5.',p:10},
{id:'hk',ic:'⚜️',n:"Knight's Tally",d:'Let Sir Kirkevang land 500 killing blows.',p:20,pr:()=>[AST.hk,500]},
{id:'hboss',ic:'🏆',n:'Giant Killer',d:'Let Sir Kirkevang land the killing blow on a boss.',p:20},
{id:'smite',ic:'⚡',n:'Wrath of the Heavens',d:'Hit ten enemies with one Divine Smite.',p:20},
{id:'spells',ic:'📜',n:'Battle Mage',d:'Cast 50 spells.',p:10,pr:()=>[AST.spells,50]},
{id:'oil',ic:'🛢️',n:'Hot Reception',d:'Pour Boiling Oil 25 times.',p:10,pr:()=>[AST.oil,25]},
{id:'rich',ic:'💰',n:'Royal Treasury',d:'Hold 1,000 gold at once.',p:10},
{id:'rich2',ic:'👑',n:"Dragon's Hoard",d:'Hold 3,000 gold at once.',p:20},
{id:'bank',ic:'🏦',n:'Moneybags',d:'Earn 1,000 gold from Treasuries in one level.',p:20},
{id:'arsenal',ic:'🏗️',n:'Full Arsenal',d:'Have all nine kinds of tower on the board at once.',p:10},
{id:'lv3',ic:'🔨',n:'Master Builder',d:'Have ten level-3 towers on the board at once.',p:10},
{id:'paths',ic:'🧭',n:'Know Your Options',d:'Build every level-3 path at least once.',p:20,pr:()=>[AST.br.length,NPATH]},
{id:'mason',ic:'🧱',n:'Patch It Up',d:'Repair the gate five times in one level.',p:10},
{id:'perk',ic:'📘',n:'Studious',d:'Learn your first talent.',p:10}];
// achievement points: earned (every unlocked achievement) and spent (talent ranks × TCOST)
const apAll=()=>ACH.reduce((a,x)=>a+(ACHD[x.id]?x.p:0),0),apMax=ACH.reduce((a,x)=>a+x.p,0),apSpent=()=>TAL.reduce((a,t)=>a+pk(t.id)*TCOST,0);
let stDirty=false,stT=0;
const stSave=()=>{stDirty=false;stT=performance.now();try{localStorage.setItem('sfstat',JSON.stringify(AST));}catch(e){}};
function unlock(id,quiet){if(ACHD[id]||!ACH.some(a=>a.id==id))return;ACHD[id]=Date.now();try{localStorage.setItem('sfach',JSON.stringify(ACHD));}catch(e){}if(stDirty)stSave();if(!quiet)toast(id);}
function achScan(q){for(const a of ACH)if(a.pr){const[v,n]=a.pr();if(v>=n)unlock(a.id,q);}if(DIFS.some(d=>PROG[d.k].n>0))unlock('win',q);if(PROG.normal.n>0)unlock('normal',q);if(PROG.hard.n>0)unlock('hard',q);if(apSpent()>0)unlock('perk',q);}
// a killing blow by Sir Kirkevang (his sword or his Smite)
const hkill=e=>{AST.hk++;stDirty=true;if(E[e.type].bs)unlock('hboss');};
function ach(ev,e){
if(ev=='kill'){AST.kills++;if(e.type=='bat')AST.bats++;if(E[e.type].bs&&!AST.boss.includes(e.type))AST.boss.push(e.type);stDirty=true;achScan();}
else if(ev=='win'){const fl=g.rep==0&&g.lives>=maxL(),tw=g.tw.filter(t=>!t.tmp);AST.wins++;stDirty=true;unlock('win');if(fl)unlock('flawless');if(g.lives==1)unlock('brink');if(DFN>=1)unlock('normal');
if(DFN==DIFS.length-1){unlock('hard');if(fl)unlock('untouch');}if(!g.hf)unlock('nofall');if(tw.length<=6)unlock('few');if(tw.length&&new Set(tw.map(t=>t.k)).size==1)unlock('mono');if(tw.length&&tw.every(t=>t.l==1))unlock('noup');achScan();}
// the Dragon only ('boss' is the Dragon's type); e.bnc counts the banishes of that one dragon
else if(ev=='banish'){if(e.type=='boss'&&(e.bnc=(e.bnc||0)+1)>=3)unlock('dragon');}
else if(ev=='cast'){AST.spells++;if(e==1)AST.oil++;stDirty=true;achScan();}
else if(ev=='repair'){if(g.rep>=5)unlock('mason');}
else if(ev=='hk'){hkill(e);achScan();}
// Divine Smite: e = the enemies it struck; the ones it killed count as his killing blows
else if(ev=='smite'){if(e.length>=10)unlock('smite');for(const o of e)if(o.hp<=0)hkill(o);achScan();}
// the end of a wave (g.vinc = Treasury gold this level)
else if(ev=='wave'){AST.waves++;stDirty=true;if((g.vinc|0)>=1000)unlock('bank');achScan();}
else if(ev=='early'){AST.early++;stDirty=true;achScan();}
else achScan();}// endless, perk
// every 200 ms from the render loop: things that are simplest to check by looking; counters are written at most every 3 s
function achTick(){if(MENU.open)return;if(g.gold>=1000)unlock('rich');if(g.gold>=3000)unlock('rich2');if(new Set(g.tw.map(t=>t.k)).size>=Object.keys(T).length)unlock('arsenal');if(g.hero&&g.hero.lv>=HERO.mx)unlock('hero');
let n3=0;for(const t of g.tw){if(t.l>=3)n3++;const b=brn(t);if(b){const k=t.k+':'+t.br;if(!AST.br.includes(k)){AST.br.push(k);stDirty=true;achScan();}}}if(n3>=10)unlock('lv3');
if(stDirty&&performance.now()-stT>3000)stSave();}
// toast: one at a time from a queue, ~4 s each (#toast sits outside #menu so it shows over everything)
const TSQ=[];let tsqT=0;
function toast(id){TSQ.push(id);if(TSQ.length==1)toastNext();}
function toastNext(){const el=$('toast'),id=TSQ[0];if(!id){el.classList.remove('on');return;}const a=ACH.find(x=>x.id==id);snd('ach');
el.innerHTML='<span class="ti">'+a.ic+'</span><span class="tt"><small>Achievement unlocked · +'+a.p+' points</small><b>'+a.n+'</b><em>'+a.d+'</em></span>';el.classList.add('on');
clearTimeout(tsqT);tsqT=setTimeout(()=>{el.classList.remove('on');tsqT=setTimeout(()=>{TSQ.shift();toastNext();},450);},3800);}
// menu page: every achievement with its points, unlocked ones with their date, locked ones greyed out with their progress where there is a count
function mAch(){const n=ACH.filter(a=>ACHD[a.id]).length;$('m_an2').innerHTML='<span class="ast">'+apAll()+'</span> of '+apMax+' achievement points · '+n+' of '+ACH.length+' unlocked'+(n==ACH.length?' – every last one. Well done!':'.')+' Spend the points on talents.';const el=$('m_al2');el.innerHTML='';
for(const a of ACH){const u=ACHD[a.id],p=!u&&a.pr?a.pr():null,d=document.createElement('div');d.className='ach'+(u?' on':'');
d.innerHTML='<span class="ai">'+a.ic+'</span><span class="at"><b>'+a.n+'</b><small>'+a.d+'</small>'+(u?'<em>Unlocked '+new Date(u).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+'</em>':p?'<span class="apb"><i style="width:'+Math.min(100,p[0]/p[1]*100).toFixed(1)+'%"></i></span><em>'+Math.min(p[0],p[1]).toLocaleString('en')+' / '+p[1].toLocaleString('en')+'</em>':'')+'</span><span class="apt">'+a.p+'</span>';el.appendChild(d);}}
$('m_ach').onclick=()=>mPage('achievements');
achScan(true);
