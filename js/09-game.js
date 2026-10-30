// ---------- game ----------
let g;
function reset(){endReset();if(g)for(const a of[...g.tw,...g.en,...g.bu,...g.dying,...g.zn,...(g?g.rf:[])]){sc.remove(a.m);if(a.sg)sc.remove(a.sg);}if(g&&g.hero&&g.hero.m)for(const m of[g.hero.m,g.hero.rg,g.hero.tg])sc.remove(m);
g={gold:Math.round(LV.gold*DF.gold)+pkv('gold'),lives:maxL(),wave:0,tw:[],en:[],bu:[],dying:[],q:[],cps:[],zn:[],rf:[],sp:[],scd:[0,0,0],aim:null,rep:0,wt:0,brk:0,sel:null,build:'arrow',spd:1,over:false,run:false};g.hero=heroInit();selRng();ui();}
// Endless mode (INF, set by js/14-menu.js at load for a level already won on this difficulty; the sim's --endless): no victory after MAXW, the waves go on.
// Past MAXW endWave(w) makes each wave up in the table format, seeded by level and wave so it is the same every time (save/reload, sim): 3–6 groups
// drawn from the level's own enemies (every non-boss type from wave MAXW+EWV.all on), EWV.n0 + EWV.dn per wave enemies, a boss every 5th wave from the
// level's own bosses (one more every 10 waves). Health keeps the 1.2^wave curve up to MAXW and grows by EWV.hp per wave after it (wHP).
let INF=false;
const EWV={n0:30,dn:3,all:6,hp:1.12},EWN=['Endless horde','Iron tide','Wild charge','Shadow host','Mixed swarm','The long night','No rest'],
wHP=w=>30*Math.pow(1.2,Math.min(w,MAXW))*Math.pow(EWV.hp,Math.max(0,w-MAXW)),wvS=w=>w>MAXW?(INF?endWave(w):''):LV.wv[w-1]||'';
function endWave(w){let sd=((LVN+1)*7919+w*104729)%2147483647||1;const rn=()=>(sd=sd*16807%2147483647)/2147483647,pk=a=>a[Math.floor(rn()*a.length)];
const n=w-MAXW,lt=new Set();for(const x of LV.wv)for(const tk of x.slice(x.indexOf(':')+1).trim().split(/\s+/)){const m=tk.match(/^\d+([a-z]+)/);if(m)for(const ch of m[1])lt.add(ch);}
const bs=[...lt].filter(ch=>E[WC[ch]].bs),pool=n>=EWV.all?Object.keys(WC).filter(ch=>!E[WC[ch]].bs):[...lt].filter(ch=>!E[WC[ch]].bs);
const ng=3+Math.min(3,Math.floor(n/5)),N=EWV.n0+EWV.dn*n,out=[];let left=N;
for(let i=0;i<ng;i++){let k=i==ng-1?left:Math.max(2,Math.round(N/ng*(.6+rn()*.8)));left=Math.max(2,left-k);let ls='';const nl=1+Math.floor(rn()*3);for(let j=0;j<nl;j++){const ch=pk(pool);if(!ls.includes(ch))ls+=ch;}
if(/^[svpr]$/.test(ls)&&k>6+n/4){left+=k-Math.floor(6+n/4);k=Math.floor(6+n/4);}
const gap=/[trg]/.test(ls)?1.1:/^[fv]+$/.test(ls)?.35:.5;out.push(k+ls+'/'+gap+(PATHS.length>1&&rn()<.3?'@'+Math.floor(rn()*PATHS.length):''));if(i<ng-1&&rn()<.5)out.push('~'+(1+Math.floor(rn()*3)));
if(w%5==0&&bs.length&&i==1){out.push('~4');for(let b=0;b<=Math.floor(n/10);b++){if(b)out.push('~3');out.push('1'+pk(bs));}out.push('~2');}}
return(w%5==0?'Boss wave '+w:pk(EWN)+' '+w)+': '+out.join(' ');}
// wave w's spawn queue [{t: seconds after the wave starts, type, p: road}] from the level's wave table (LV.wv, format in js/01-config.js);
// throws on a typo so a bad table fails loudly (npm run sim -- --waves N checks every wave)
function waveQ(w){const s=wvS(w),c=s.indexOf(':'),q=[];let t=0,i=0,gap=0;
for(const tk of(c<0?s:s.slice(c+1)).trim().split(/\s+/)){if(!tk)continue;if(tk[0]=='~'){t+=+tk.slice(1);continue;}
const m=tk.match(/^(\d+)([a-z]+)(?:\/([\d.]+))?(?:@(\d))?$/);if(!m)throw Error(LV.n+' wave '+w+': bad group "'+tk+'"');
gap=m[3]?+m[3]:.8;if(q.length)t+=gap;for(let j=0;j<+m[1];j++){const k=WC[m[2][j%m[2].length]];if(!k)throw Error(LV.n+' wave '+w+': unknown enemy letter in "'+tk+'"');
if(j)t+=gap;q.push({t:+t.toFixed(2),type:k,p:(m[4]!=null?+m[4]:i)%PATHS.length});i++;}}return q;}
// enemy types of wave w in spawn order (the UI previews the next wave with this) and its name ('' if none)
const waveMix=w=>waveQ(w).map(q=>q.type),waveName=w=>{const s=wvS(w),c=s.indexOf(':');return c<0?'':s.slice(0,c).trim();};
// the break between waves lasts BRK s of game time (g.brk counts up; it doesn't run before wave 1). Calling the next wave early pays
// earlyBonus() gold for the time left; with auto-start on (autoW, a menu setting) the wave starts by itself when the break is over
const BRK=25;let autoW=false;
const brkLeft=()=>g.wave>0&&!g.run&&!g.over&&(INF||g.wave<MAXW)?Math.max(0,BRK-g.brk):0,earlyBonus=()=>Math.floor(brkLeft()*(.4+.04*g.wave));
function callEarly(){if(g.run||g.over)return;const b=earlyBonus();if(b>0){g.gold+=b;const p=WP[WP.length-1];popText(p[0],p[1],'+'+b,'#ffd24a');snd('coin');}startWave();}
function startWave(){if(g.run||g.over)return;g.wave++;g.brk=0;snd('horn');g.run=true;if(g.hero)g.hero.ult=1;g.wt=0;g.q=waveQ(g.wave);ui();}
// each breach has its own road (PATHS); the wave alternates between them
function spawn(type,pi){if(type=='boss')snd('roar');else if(E[type].bs)snd('horn');const e=E[type],hp=wHP(g.wave)*e.h*LV.hp*DF.hp,o=buildEnemy(type),R=(e.fy?FPATHS:PATHS)[pi||0];o.m.scale.setScalar(.01);
g.en.push({R,x:R[0][0],y:R[0][1],px:R[0][0],py:R[0][1],seg:1,hp,max:hp,sl:0,stun:0,slf:1,type,dir:PI/2,vis:PI/2,ph:Math.random()*6,gp:Math.random()*6,k:{norm:2*PI/36,fast:2*PI/50,tank:2*PI/44,boss:0,guard:2*PI/40,shaman:2*PI/38,bat:0,sapper:2*PI/32,troll:2*PI/64,ghost:0,imp:2*PI/30,king:2*PI/40,ram:1/10.8,necro:0,skel:2*PI/36}[type],hlr:1.5,tf:1,pzt:1+Math.random()*2,smt:3,rzt:2,age:0,hit:0,flash:0,...e,m:o.m,body:o.body,ice:o.ice,bar:o.bar,meshes:o.meshes,rig:o.rig,gm:o.gm});foeSeen(type);}
// higher = closer to the castle (minus the distance still to walk, so enemies on different roads compare fairly)
const prog=e=>-e.R.rem[e.seg]-Math.hypot(e.R[e.seg][0]-e.x,e.R[e.seg][1]-e.y);
// targeting modes: a tower shoots the enemy in range with the highest tscore(); t.tm is the player's choice, else the tower type's default (T[k].tm), else First
const TGM={first:['First','Closest to the castle'],last:['Last','Furthest from the castle'],strong:['Strongest','Most health left'],fast:['Fastest','Quickest enemy type'],close:['Closest','Nearest to the tower']},TGK=Object.keys(TGM);
const tmode=t=>t.tm||T[t.k].tm||'first';
// strong is plain health (ties keep the first found, as before); fast breaks ties by progress
const tscore=(t,e,m)=>m=='first'?prog(e):m=='last'?-prog(e):m=='strong'?e.hp:m=='fast'?e.s+prog(e)*1e-6:-Math.hypot(e.x-t.x,e.y-t.y);
// the upgrade branch a level-3 tower took (BRN in js/01-config.js), or null
const brn=t=>t.l>=3&&t.br!=null&&BRN[t.k]?BRN[t.k][t.br]:null;
// Royal Armoury perks (bought with stars in the menu, js/14-menu.js): PERKS = [id, icon, name, ranks, star cost per rank, what one rank does]; PK[id] = ranks owned
// (loaded by js/14-menu.js from localStorage sfperk; always empty in the sim unless --perks). pk(id) = ranks. Effects: tower damage in stat() (PKD = tower type → perk, v per rank),
// soldiers' health in solHp(), upgrade price in upCost(), starting gold and lives in reset()/maxL(), the hero in hst(), spell cooldowns in heroCast(). Keep them modest.
const PERKS=[
{id:'arch',ic:'🏹',n:"Fletchers' Guild",mx:3,c:[2,3,4],v:.05,d:'Archers deal +5% damage'},
{id:'siege',ic:'🪨',n:'Siege Workshop',mx:3,c:[2,3,4],v:.05,d:'Catapults and Ballistas deal +5% damage'},
{id:'arc',ic:'🔮',n:'Arcane Library',mx:3,c:[2,3,4],v:.05,d:'Wizards, Storm Towers and Alchemists deal +5% damage'},
{id:'drill',ic:'⚔️',n:'Drill Yard',mx:2,c:[2,3],v:.1,d:'Barracks soldiers get +10% health'},
{id:'smith',ic:'🔨',n:'Master Smiths',mx:2,c:[3,4],v:.05,d:'Tower upgrades cost 5% less'},
{id:'gold',ic:'💰',n:'War Chest',mx:3,c:[2,3,4],v:20,d:'Start every level with +20 gold'},
{id:'wall',ic:'🧱',n:'Stonemasons',mx:2,c:[3,5],v:1,d:'+1 life (and one more for the Repair gate)'},
{id:'hero',ic:'🐴',n:"Knight's Training",mx:2,c:[3,4],v:.1,d:'Sir Roland gets +10% health and damage'},
{id:'spell',ic:'📜',n:'Spellwrights',mx:2,c:[2,3],v:.06,d:'Spell cooldowns are 6% shorter'}];
const PK={},PKV=Object.fromEntries(PERKS.map(p=>[p.id,p.v])),pk=id=>PK[id]|0,pkv=id=>pk(id)*PKV[id],PKD={arrow:'arch',cannon:'siege',ballista:'siege',frost:'arc',storm:'arc',alch:'arc'};
const stat=t=>{const b=brn(t);return{d:T[t.k].d*(1+.6*(t.l-1))*(t.buff||1)*(b&&b.dm||1)*(PKD[t.k]?1+pkv(PKD[t.k]):1),r:T[t.k].r+10*(t.l-1)+(b&&b.rg||0),f:T[t.k].f*(b&&b.fm||1)/(t.hs||1)};};
// the branch a tower's shots carry: its own, plus hr when a Blessed Standard covers it (buffs() sets t.bls)
const tbr=t=>t.bls?{...brn(t),hr:1}:brn(t);
// damage multiplier for tower type k (with branch b) hitting enemy e (its resistance to the damage type; the Ballista and Crossbow Nest pierce physical armour);
// b.dt overrides the damage type (the Fire Pots' burning ground is fire)
// e.ac > 0 = Acid Brew ate its armour: physical damage ignores its resistance and does ACID extra; b.hr (Blessed Standard) ignores every resistance below 1
const dmul=(e,k,b)=>{const t=b&&b.dt||T[k].dt;if(t=='phys'&&e.ac>0)return 1+ACID;return t=='phys'&&(T[k].pr||b&&b.pr)?1:1-(e.rs[t]||0)*(b&&b.hr&&e.rs[t]<1?0:1);};
// Shieldbearer: an Archer arrow or Ballista bolt flying at its front (within ~70° of head-on; dx,dy = the shot's travel direction) loses e.shd of its damage
const shBlk=(e,k,dx,dy)=>{if(!e.shd||(k!='arrow'&&k!='ballista'))return 1;const L=Math.hypot(dx,dy);return L>0&&-(dx*Math.sin(e.dir)+dy*Math.cos(e.dir))/L>.34?1-e.shd:1;};
const upCost=t=>Math.round(T[t.k].c*.8*t.l*(1-pkv('smith')));
function update(dt){if(g.over)return;
if(!g.run&&g.wave>0){g.brk+=dt;if(autoW&&(INF||g.wave<MAXW)&&g.brk>=BRK)startWave();}
if(g.run){g.wt+=dt;while(g.q.length&&g.q[0].t<=g.wt){const q=g.q.shift();spawn(q.type,q.p);}}
zones(dt);spells(dt);soldiers(dt);heroUpd(dt);
for(const e of g.en){let m=e.s*(e.stun>0?0:e.sl>0?(e.slf||.5):1)*e.tf*dt;if(e.bk&&held(e))m=0;e.sl-=dt;e.stun-=dt;e.bn-=dt;e.ac-=dt;const et=dt*e.tf;if(e.sum){e.smt-=et;if(e.smt<=0){e.smt=KING.cd;summon(e);}}if(e.rz){e.rzt-=et;if(e.rzt<=0){e.rzt=NEC.cd;raise(e);}}if(e.hl){e.hlr-=et;if(e.hlr<=0){e.hlr=HEAL.cd;heal(e);}}if(e.phz){e.pzt-=dt;if(e.pzt<=0){e.out=!e.out;e.pzt=e.out?PHZ.d:PHZ.cd;phzFx(e);}}if(e.pt>0&&!e.out){e.hp-=e.pd*dt;e.pt-=dt;if(Math.random()<dt*5)burst(e.x,e.y,0x7cff4a,1,.3,.5);}
if(!(e.sap&&sapMove(e,m)))while(m>0&&e.seg<e.R.length){const tx2=e.R[e.seg][0],ty=e.R[e.seg][1],d=Math.hypot(tx2-e.x,ty-e.y);if(d>.01)e.dir=Math.atan2(tx2-e.x,ty-e.y);
if(d<=m){e.x=tx2;e.y=ty;e.seg++;m-=d;}else{e.x+=(tx2-e.x)/d*m;e.y+=(ty-e.y)/d*m;m=0;}}
if(e.seg>=e.R.length){e.hp=-1;e.leak=1;snd('leak');g.lives-=e.lv||1;}}
buffs();for(const t of g.tw){if(t.stun>0){t.stun-=dt;continue;}if(T[t.k].sup||T[t.k].inc||T[t.k].bar)continue;t.cd-=dt;t.rec=Math.max(0,(t.rec||0)-dt*2.5);const s=stat(t),tm=tmode(t),br=tbr(t);let best=null,bp=-Infinity;
// a Wizard skips enemies it can't banish yet; a Time Warden skips enemies already in a time field
for(const e of g.en){if(e.hp<=0||e.out||(t.k=='frost'&&(br&&br.tz?e.tf<1:e.bn>0))||(e.fy&&!T[t.k].air)||dmul(e,t.k,br)<=0)continue;if(Math.hypot(e.x-t.x,e.y-t.y)<=s.r){const p=tscore(t,e,tm);if(p>bp){bp=p;best=e;}}}
if(best){t.aim=Math.atan2(best.x-t.x,best.y-t.y);if(t.cd<=0){t.cd=s.f;t.rec=1;tfx(t);(t.k=='storm'?zap(t,best,s):t.k=='arrow'?volley(t,s):g.bu.push({x:t.x,y:t.y,l:t.l,tg:best,k:t.k,br,d:s.d,y0:t.head.position.y+(t.k=='cannon'?.4:.15),d0:Math.hypot(best.x-t.x,best.y-t.y)||1,m:mkBullet(t.k,brn(t))}));}}}
for(const b of g.bu){const e=b.tg;if(b.w>0){b.w-=dt;b.m.visible=false;continue;}b.m.visible=true;if(e.hp<=0||e.out){b.dead=1;continue;}
const d=Math.hypot(e.x-b.x,e.y-b.y),m=(T[b.k].bs||340)*dt;
if(d<=m+4){b.dead=1;if(b.k=='alch'){snd('splash');const br=b.br||{},c=br.ac?0xd8f03a:br.pl?0xa06ad0:0x7cff4a;for(const o of g.en)if(!o.fy&&!o.out&&dmul(o,'alch',br)>0&&Math.hypot(o.x-e.x,o.y-e.y)<=45){o.pt=3;o.pd=Math.max(o.pd||0,b.d*dmul(o,'alch',br));o.hit=.15;if(br.ac)o.ac=br.ac;if(br.pl)o.pg=br.pl;}fx(e.x,e.y,c,.1,.75,.5,.1,true);burst(e.x,e.y,c,10,1.2,.2);}else if(b.k=='cannon'){snd('boom');const br=b.br||{};for(const o of g.en)if(!o.fy&&!o.out&&Math.hypot(o.x-e.x,o.y-e.y)<=(br.sp||T.cannon.sp)){const dd=b.d*dmul(o,'cannon',br)*(o===e&&br.bd||1);o.hp-=dd;hf(o,.25,dd,'cannon',o.x-e.x,o.y-e.y);o.sl=1;o.slf=1-.2*(b.l||1);}fx(e.x,e.y,0xffffff,.15,.95,.35,.12,true);burst(e.x,e.y,0xe9c98a,10,1.4,.15);if(br.fz)addZone({k:'fire',x:e.x,y:e.y,r:br.fz[0],t:br.fz[1],d0:br.fz[1],d:b.d*br.fz[2]});}
else{const dd=b.d*dmul(e,b.k,b.br)*shBlk(e,b.k,e.x-b.x,e.y-b.y)*big(e,b.br);e.hp-=dd;if(b.br&&b.br.sk)skewer(e,b);hf(e,.2,dd,b.k,e.x-b.x,e.y-b.y,b.br);if(b.k=='frost')wizHit(e,b);else burst(e.x,e.y,0xffffff,2,.6,.3);}}
else{b.x+=(e.x-b.x)/d*m;b.y+=(e.y-b.y)/d*m;}}
const spl=[];for(const e of g.en)if(e.hp<=0){if(e.leak||e.gone)sc.remove(e.m);else{const rw=e.rw+bounty(e);g.gold+=rw;heroXp(e);snd('coin');popText(e.x,e.y,'+'+rw,'#ffd24a');if(e.pg&&e.pt>0)plague(e);burst(e.x,e.y,e.col,10,1.3,.3);killFx(e);if(e.spl)spl.push(e);if(!e.fy&&!e.bs&&e.type!='skel')g.cps.push({x:e.x,y:e.y,R:e.R,seg:e.seg,t:NEC.ct});}}
for(const c of g.cps)c.t-=dt;if(g.cps.length)g.cps=g.cps.filter(c=>c.t>0);
for(const b of g.bu)if(b.dead)sc.remove(b.m);
g.en=g.en.filter(e=>e.hp>0);g.bu=g.bu.filter(b=>!b.dead);for(const e of spl)trollSplit(e);
if(g.lives<=0){g.lives=0;if(!g.over){snd('lose');g.overT=performance.now();startEnd(false);}g.over=true;}
if(g.run&&!g.q.length&&!g.en.length){g.run=false;g.brk=0;g.aim=null;snd('waveEnd');g.gold+=20+g.wave*2;for(const t of g.tw)if(T[t.k].inc){const v=T[t.k].inc*t.l;g.gold+=v;popText(t.x,t.y,'+'+v,'#ffd24a');}
// Royal Bank: interest on the gold held after the wave's income
for(const t of g.tw){const b=brn(t);if(b&&b.it){const v=Math.min(b.it[1],Math.floor(g.gold*b.it[0]));if(v>0){g.gold+=v;popText(t.x,t.y,'+'+v,'#ffe9a0');}}}if(INF)infRec();else if(g.wave>=MAXW){snd('win');g.over=true;g.won=true;lvWon();g.overT=performance.now();startEnd(true);}ui();}}
// Sapper: once a tower stands within SAP.r it leaves the road, runs at it (40% faster) and blows up beside it, stunning it for SAP.st s (no gold for that);
// if the tower is sold first it walks back to where it left the road. Returns true while it is off the road (update() then skips the road walk)
const SAP={r:90,st:4};
function sapMove(e,m){if(!e.tw2){let best=null,bd=SAP.r;for(const t of g.tw){const d=Math.hypot(t.x-e.x,t.y-e.y);if(d<bd&&!(t.stun>0)&&!(t.sapd&&t.sapd.hp>0&&t.sapd!==e)){bd=d;best=t;}}
if(best){if(!e.back){e.rx=e.x;e.ry=e.y;}e.tw2=best;best.sapd=e;e.back=0;}}
if(e.tw2&&!g.tw.includes(e.tw2)){e.tw2=null;e.back=1;}if(!e.tw2&&!e.back)return false;
const t=e.tw2,tx=t?t.x:e.rx,ty=t?t.y:e.ry,d=Math.hypot(tx-e.x,ty-e.y);if(t)m*=1.4;if(d>.01)e.dir=Math.atan2(tx-e.x,ty-e.y);
if(t&&d<=22+m){t.stun=SAP.st;t.sapd=null;e.hp=-1;e.gone=1;sapFx(e,t);}else if(d<=m){e.x=tx;e.y=ty;e.back=0;}else{e.x+=(tx-e.x)/d*m;e.y+=(ty-e.y)/d*m;}return true;}
// Goblin King: every KING.cd s (the first 3 s after he appears) e.sum goblins with KING.hp of the normal health step out beside him (worth KING.rw gold)
const KING={cd:5,hp:.6,rw:2};
function summon(e){if(e.hp<=0)return;kingFx(e);for(let i=0;i<e.sum;i++){spawn('norm');const o=g.en[g.en.length-1],k=(i%2?-1:1)*(16+i*4);
Object.assign(o,{R:e.R,seg:e.seg,x:e.x+k*Math.cos(e.dir),y:e.y-k*Math.sin(e.dir),dir:e.dir,vis:e.dir});o.px=o.x;o.py=o.y;o.hp=o.max=o.max*KING.hp;o.rw=KING.rw;}}
// Necromancer: ground enemies that are killed leave a corpse (g.cps) for NEC.ct s; every NEC.cd s the Necromancer raises up to e.rz of those within NEC.r as skeletons
// (not bosses, flyers or skeletons, so it can't chain)
const NEC={cd:4,r:160,ct:6};
function raise(e){if(e.hp<=0)return;const cs=g.cps.filter(c=>Math.hypot(c.x-e.x,c.y-e.y)<=NEC.r).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y)).slice(0,e.rz);if(!cs.length)return;
for(const c of cs){g.cps.splice(g.cps.indexOf(c),1);spawn('skel');const o=g.en[g.en.length-1];Object.assign(o,{R:c.R,seg:c.seg,x:c.x,y:c.y,dir:e.dir,vis:e.dir});o.px=o.x;o.py=o.y;raiseFx(e,o);}}
// Troll: when killed, e.spl goblins of this wave's strength jump out of its basket where it fell and carry on along its road
function trollSplit(e){trollFx(e);for(let i=0;i<e.spl;i++){spawn('norm');const o=g.en[g.en.length-1],k=(i%2?-1:1)*(9+i*3);
Object.assign(o,{R:e.R,seg:e.seg,x:e.x+k*Math.cos(e.dir),y:e.y-k*Math.sin(e.dir),dir:e.dir,vis:e.dir});o.px=o.x;o.py=o.y;o.hp=o.max=o.max*.5;}}
// Ghost: e.out = faded out – no tower can target it, bullets already flying at it vanish, splash and poison pass through it
const PHZ={cd:3,d:1};
// Shaman: every HEAL.cd s a green pulse heals the other enemies within HEAL.r by e.hl of their max health (bosses a third of that)
const HEAL={r:75,cd:4};
function heal(e){if(e.hp<=0)return;healFx(e);
for(const o of g.en){if(o===e||o.hp<=0||o.hp>=o.max||Math.hypot(o.x-e.x,o.y-e.y)>HEAL.r)continue;const a=Math.min(o.max-o.hp,o.max*e.hl*(o.bs?.34:1));o.hp+=a;healFx(o,a);}}
// Wizard: teleport an enemy back along the road (bosses resist), then it is immune for 4 s
function banish(e,l){if(e.bn>0||e.hp<=0)return;let m=(30+30*l)*(e.bs?.34:1);snd('banish');fx(e.x,e.y,0xb58cff,.1,.9,.4,.1,true);burst(e.x,e.y,0xb58cff,14,1.3,.4);
pushBack(e,m);
e.px=e.x;e.py=e.y;e.age=.08;e.bn=4;fx(e.x,e.y,0xb58cff,.9,.1,.4,.1,true);burst(e.x,e.y,0xd9c2ff,10,1,.4);}
// Repair gate: buy back one life (up to maxL(), the difficulty's lives plus the Stonemasons perk); the price starts at REP.b and grows by REP.k for every repair this level (g.rep, saved with the run)
const maxL=()=>DF.li+pkv('wall'),REP={b:50,k:1.35},repCost=()=>Math.round(REP.b*Math.pow(REP.k,g.rep)/5)*5;
function repair(){if(g.over||g.lives>=maxL())return false;const c=repCost();if(g.gold<c)return false;g.gold-=c;g.lives++;g.rep++;repFx(c);return true;}
// move enemy e back along its road by m (the Wizard's banish, the hero's Lance Charge)
function pushBack(e,m){while(m>0){const p=e.R[e.seg-1],d=Math.hypot(p[0]-e.x,p[1]-e.y);if(d<=m){e.x=p[0];e.y=p[1];m-=d;if(e.seg>1)e.seg--;else break;}else{e.x+=(p[0]-e.x)/d*m;e.y+=(p[1]-e.y)/d*m;m=0;}}}
// ---------- Hero ----------
// Sir Roland, a knight on horseback (g.hero). He starts on the road cell nearest the gate; a click on the road sends him there (heroGo). He rides straight
// across the board, and once he has arrived he fights like a Barracks soldier: he runs at the nearest ground enemy within HERO.eng of his spot (unblocked ones
// first, then the one closest to the castle), blocks it (e.bk) and trades blows (he shrugs off HERO.arm of every hit). Flyers and faded Ghosts are ignored.
// He earns xp from every enemy that dies within HERO.xr of him (its gold value) and levels up to HERO.mx (+35% health, +30% damage a level). At 0 health he
// falls and rides back out from the gate after HERO.rsp s. Abilities: HAB (cooldowns in h.ab, Divine Smite once a wave in h.ult), heroCast(i).
// Looks: heroSync()/heroFx() in js/07-enemies.js (stubbed in the sim)
const HERO={sp:110,eng:75,rg:26,hp:300,d:20,f:.9,rsp:15,reg:.02,arm:.3,xr:200,xp:[0,80,220,450,800],mx:5};
// abilities: three spells on cooldowns (castable anywhere during a wave, hero or not; aim = click a spot on the board after picking it, road = a road cell)
// and Sir Roland's own Divine Smite (once a wave, centred on him)
const HAB=[{n:'Rain of Arrows',ic:'🏹',cd:20,r:90,aim:1,ds:'Click a spot: four volleys of arrows rain down there over two seconds, hitting everything below – flyers too.'},
{n:'Boiling Oil',ic:'🛢️',cd:30,r:40,ds:'Pours boiling oil on the three road tiles in front of the castle gate: a big burst of fire damage, then burning ground that slows and scalds for 4 s.'},
{n:'Reinforcements',ic:'⚔️',cd:35,aim:1,road:1,ds:'Click the road: two soldiers drop in and hold that spot for 15 s, blocking anything on foot except bosses.'},
{n:'Divine Smite',ic:'⚡',ult:1,r:160,ds:'Once a wave: holy light strikes every enemy around him, flyers too, for huge damage that ignores armour – and heals him fully.'}];
const hst=h=>({hp:HERO.hp*(1+.35*(h.lv-1))*(1+pkv('hero')),d:HERO.d*(1+.3*(h.lv-1))*(1+pkv('hero'))});
// where he starts and respawns: the road cell nearest the gate
function heroHome(){const gx=GATE.x*S+W*S/2,gy=GATE.z*S+H*S/2;let bd=Infinity,b=null;for(const k of road){const[c,r]=k.split(',').map(Number),x=c*S+S/2,y=r*S+S/2,d=Math.hypot(x-gx,y-gy);if(onB(c,r)&&d<bd){bd=d;b={x,y};}}return b;}
// the hero only goes to road cells on the board (not the breach or gate outside the wall)
const onB=(c,r)=>c>=0&&c<W&&r>=0&&r<H&&road.has(c+','+r);
function heroInit(){const p=heroHome();return{x:p.x,y:p.y,tx:p.x,ty:p.y,lv:1,xp:0,hp:HERO.hp,max:HERO.hp,cd:0,rs:0,e:null,dir:-PI/2,mv:0,sw:0,ult:1};}
const heroRel=h=>{if(h.e&&h.e.bk===h)h.e.bk=null;h.e=null;};
// send him to (x,y) (a road cell centre); he drops his fight
function heroGo(x,y){const h=g.hero;if(!h||h.hp<=0)return false;h.tx=x;h.ty=y;heroRel(h);return true;}
function heroXp(e){const h=g.hero;if(!h||h.hp<=0||h.lv>=HERO.mx||Math.hypot(e.x-h.x,e.y-h.y)>HERO.xr)return;h.xp+=e.rw;
while(h.lv<HERO.mx&&h.xp>=HERO.xp[h.lv]){h.lv++;const s=hst(h);h.hp=Math.min(s.hp,h.hp+(s.hp-h.max)+s.hp*.3);h.max=s.hp;heroLvl(h);}}
function heroUpd(dt){const h=g.hero;if(!h)return;
if(h.hp<=0){h.rs-=dt;if(h.rs<=0){const p=heroHome(),s=hst(h);Object.assign(h,{x:p.x,y:p.y,tx:p.x,ty:p.y,hp:s.hp,max:s.hp,e:null,cd:0});}return;}
const s=hst(h);if(h.max!==s.hp){h.hp+=s.hp-h.max;h.max=s.hp;}
const ride=Math.hypot(h.tx-h.x,h.ty-h.y)>2;if(ride&&h.e)heroRel(h);
let e=h.e;if(e&&(e.hp<=0||e.out||Math.hypot(e.x-h.tx,e.y-h.ty)>HERO.eng*1.6)){heroRel(h);e=null;}
if(!ride&&!e){let bp=-Infinity;for(const o of g.en){if(o.hp<=0||o.fy||o.out||Math.hypot(o.x-h.tx,o.y-h.ty)>HERO.eng)continue;const p=prog(o)-(o.bk&&o.bk.hp>0&&o.bk!==h?1e6:0);if(p>bp){bp=p;e=o;}}
if(e){h.e=e;if(!e.bk||e.bk.hp<=0||e.bk.e!==e)e.bk=h;}}
const gx=e?e.x:h.tx,gy=e?e.y:h.ty,dx=gx-h.x,dy=gy-h.y,L=Math.hypot(dx,dy),stop=e?HERO.rg:0;h.mv=0;
if(L>.01)h.dir=Math.atan2(dx,dy);if(L>stop){const k=Math.min(HERO.sp*dt,L-stop)/L;h.x+=dx*k;h.y+=dy*k;h.mv=1;}
if(e&&L<=HERO.rg+6){if(e.bk!==h&&(!e.bk||e.bk.hp<=0||e.bk.e!==e))e.bk=h;h.cd-=dt;if(h.cd<=0){h.cd=HERO.f;h.sw=1;const dd=s.d*dmul(e,'barracks');e.hp-=dd;hf(e,.15,dd,'barracks',dx,dy);heroHit(h,e);}
if(e.bk===h&&!(e.stun>0)){e.dir=Math.atan2(h.x-e.x,h.y-e.y);e.at=(e.at||0)-dt;if(e.at<=0){e.at=BAR.ecd;h.hp-=edmg(e)*(1-HERO.arm);h.hit=.2;if(h.hp<=0){h.rs=HERO.rsp;heroRel(h);heroFx(-1,h,[]);}}}}
else if(!e)h.hp=Math.min(h.max,h.hp+h.max*HERO.reg*dt);}
// ability i (0..3) at game point (x,y) for the aimed spells: returns false when it can't be cast now (no wave running, on cooldown, a bad spot,
// or for Divine Smite: hero dead or already used this wave)
function heroCast(i,x,y){const h=g.hero,a=HAB[i];if(!a||g.over||!g.run)return false;
if(a.ult){if(!h||h.hp<=0||!h.ult)return false;h.ult=0;const s=hst(h),near=g.en.filter(e=>e.hp>0&&!e.out&&Math.hypot(e.x-h.x,e.y-h.y)<=a.r);
for(const e of near){const dd=10*s.d*dmul(e,'storm');e.hp-=dd;hf(e,.3,dd,'storm');e.stun=Math.max(e.stun,1);}h.hp=h.max;heroFx(3,h,near);return true;}
if(g.scd[i]>0)return false;
if(a.aim&&!(x>=0&&x<W*S&&y>=0&&y<H*S))return false;
if(a.road){const c=Math.floor(x/S),r=Math.floor(y/S);if(!onB(c,r))return false;x=c*S+S/2;y=r*S+S/2;}
g.scd[i]=a.cd*(1-pkv('spell'));
if(i==0)g.sp.push({k:'rain',x,y,t:0,v:0});
if(i==1){const d=SPN.oil*gob();for(const q of gateTiles()){for(const e of g.en)if(e.hp>0&&!e.fy&&!e.out&&Math.hypot(e.x-q.x,e.y-q.y)<=a.r&&!e.oil){e.oil=1;const dd=d*dmul(e,'cannon',FIRE);e.hp-=dd;hf(e,.3,dd,'cannon');e.sl=3;e.slf=.5;}
addZone({k:'fire',x:q.x,y:q.y,r:a.r,t:4,d0:4,d:d*SPN.burn,sl:1});}for(const e of g.en)e.oil=0;spellFx(1,{tiles:gateTiles()});}
if(i==2){const l=1+(g.wave>=8)+(g.wave>=15),t={k:'barracks',l,br:null,x,y,rp:{x,y},n:SPN.rn,tmp:SPN.rt,sol:[]};
for(let j=0;j<SPN.rn;j++){const mx=solHp(t);t.sol.push({i:j,x:x+(j?14:-14),y,hp:mx,max:mx,cd:0,rs:0,e:null,dir:0});}g.rf.push(t);spellFx(2,t);}
return true;}
// spell numbers: damage as a share of a goblin's health this wave (gob()), so they stay useful all game: Rain of Arrows rn volleys of rain each,
// Boiling Oil oil at once then burn a second; Reinforcements: rn soldiers (Barracks level 1/2/3 from waves 1/8/15) for rt s
const SPN={rain:.22,vol:4,oil:.9,burn:.25,rn:2,rt:15};
const gob=()=>wHP(g.wave)*LV.hp*DF.hp;
// the three on-board road cells nearest the gate (Boiling Oil): the hero's home cell and the next two along the road
let GTL=null;
function gateTiles(){if(GTL)return GTL;const h=heroHome(),c0=Math.floor(h.x/S),r0=Math.floor(h.y/S),seen=new Set([c0+','+r0]),q=[[c0,r0]];GTL=[];
while(q.length&&GTL.length<3){const[c,r]=q.shift();GTL.push({x:c*S+S/2,y:r*S+S/2});for(const[dc,dr]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(c+dc)+','+(r+dr);if(!seen.has(k)&&onB(c+dc,r+dr)){seen.add(k);q.push([c+dc,r+dr]);}}}return GTL;}
// active spells and squads, run from update(): cooldowns tick, Rain of Arrows drops a volley every 0.4 s, squads count down and leave
function spells(dt){for(let i=0;i<3;i++)g.scd[i]=Math.max(0,g.scd[i]-dt);
for(const p of g.sp){p.t+=dt;if(p.k=='rain'&&p.t>=.3+p.v*.4&&p.v<SPN.vol){p.v++;const d=SPN.rain*gob();
for(const e of g.en)if(e.hp>0&&!e.out&&Math.hypot(e.x-p.x,e.y-p.y)<=HAB[0].r){const dd=d*dmul(e,'arrow');e.hp-=dd;hf(e,.15,dd,'arrow');}spellFx(0,p);}}
if(g.sp.length)g.sp=g.sp.filter(p=>p.v<SPN.vol);
for(const t of g.rf){t.tmp-=dt;if(t.tmp<=0||t.sol.every(d=>d.hp<=0)){barGone(t);squadEnd(t);}}if(g.rf.length)g.rf=g.rf.filter(t=>t.tmp>0&&t.sol.some(d=>d.hp>0));}
// ---------- Barracks ----------
// A Barracks stands next to the road (a road cell centre within BAR.near) and keeps BAR.n soldiers (t.sol) at its rally point t.rp, a road cell centre within its range.
// Each soldier guards a post round the rally point; when a ground enemy comes within BAR.eng of the rally point it runs at it (unblocked ones first, then the one
// closest to the castle) and fights. The first soldier to reach an enemy blocks it (e.bk): it stops walking and hits back at that soldier every BAR.ecd s for edmg().
// A soldier at 0 health falls and comes back from the tower after BAR.rsp s (not while the Barracks is stunned); out of a fight it heals BAR.reg of its health a second.
// Flyers, faded Ghosts and bosses are ignored – bosses can't be blocked by a Barracks (the hero can). Soldier damage comes from stat() (level, banners) and goes through dmul() like any physical hit. Models: solSync() in js/07-enemies.js
const BAR={n:3,hp:80,rsp:8,sp:75,eng:60,rg:22,reg:.08,ecd:1,near:90};
// soldier health and count, respawn time and the share of enemy damage taken – the level-3 branch (BRN.barracks) changes them
const solHp=t=>BAR.hp*(1+.5*(t.l-1))*((brn(t)||{}).shp||1)*(1+pkv('drill')),solN=t=>(brn(t)||{}).sn||BAR.n,solRs=t=>BAR.rsp*(t.l>=3?.75:1)*((brn(t)||{}).rsf||1),solArm=t=>1-((brn(t)||{}).arm||0);
// enemy melee damage per hit on a soldier: grows with the wave; big enemies hit harder, bosses much harder
const edmg=e=>4*Math.pow(1.12,g.wave)*(e.bs?3:Math.sqrt(e.h));
// can a Barracks go on cell c,r: a road cell next to it
const nearRoad=(c,r)=>[...road].some(k=>{const[a,b]=k.split(',');return Math.hypot(a-c,b-r)*S<=BAR.near;});
// a new Barracks: rally point on the nearest road cell, soldiers waiting to come out
function barInit(t){let bd=Infinity;for(const k of road){const[c,r]=k.split(',').map(Number),x=c*S+S/2,y=r*S+S/2,d=Math.hypot(x-t.x,y-t.y);if(d<bd){bd=d;t.rp={x,y};}}
t.sol=[];for(let i=0;i<BAR.n;i++)t.sol.push({i,x:t.x,y:t.y,hp:solHp(t),max:solHp(t),cd:0,rs:0,e:null,dir:0});}
// move the rally point (to a road cell centre within range); soldiers drop their fights and run there
function setRally(t,x,y){t.rp={x,y};for(const d of t.sol){if(d.e&&d.e.bk===d)d.e.bk=null;d.e=null;}}
// a Barracks is sold or undone: its soldiers let go of the enemies they hold
function barGone(t){if(t.sol)for(const d of t.sol){if(d.e&&d.e.bk===d)d.e.bk=null;d.e=null;d.hp=0;}}
const post=(t,d)=>{const a=d.i/t.sol.length*2*PI+.5;return{x:t.rp.x+Math.sin(a)*16,y:t.rp.y+Math.cos(a)*16};};
// is enemy e held by the soldier blocking it (alive and close enough)
const held=e=>{const d=e.bk;return d.hp>0&&d.e===e&&Math.hypot(d.x-e.x,d.y-e.y)<=BAR.rg+6;};
function soldiers(dt){for(const t of g.rf.length?g.tw.concat(g.rf):g.tw){if(!t.sol)continue;const s=stat(t),mx=solHp(t),br=tbr(t);
// a Warband's extra fighter marches out of the Barracks
while(t.sol.length<(t.n||solN(t)))t.sol.push({i:t.sol.length,x:t.x,y:t.y,hp:mx,max:mx,cd:0,rs:0,e:null,dir:0});
for(const d of t.sol){if(d.max!==mx){d.hp+=mx-d.max;d.max=mx;}
if(d.hp<=0){if(t.tmp)continue;if(!(t.stun>0))d.rs-=dt;if(d.rs<=0){d.hp=mx;d.x=t.x;d.y=t.y;d.cd=0;}continue;}
let e=d.e;if(e&&(e.hp<=0||e.out||e.bs||Math.hypot(e.x-t.rp.x,e.y-t.rp.y)>BAR.eng*1.6)){if(e.bk===d)e.bk=null;e=d.e=null;}
if(!e){let bp=-Infinity;for(const o of g.en){if(o.hp<=0||o.fy||o.out||o.bs||Math.hypot(o.x-t.rp.x,o.y-t.rp.y)>BAR.eng)continue;const p=prog(o)-(o.bk&&o.bk.hp>0&&o.bk!==d?1e6:0);if(p>bp){bp=p;e=o;}}
if(e){d.e=e;if(!e.bk||e.bk.hp<=0||e.bk.e!==e)e.bk=d;}}
const g2=e?{x:e.x,y:e.y}:post(t,d),dx=g2.x-d.x,dy=g2.y-d.y,L=Math.hypot(dx,dy),stop=e?BAR.rg:0,m=BAR.sp*dt;d.mv=0;
if(L>.01)d.dir=Math.atan2(dx,dy);if(L>stop){const k=Math.min(m,L-stop)/L;d.x+=dx*k;d.y+=dy*k;d.mv=1;}
if(e&&L<=BAR.rg+6){if(e.bk!==d&&(!e.bk||e.bk.hp<=0||e.bk.e!==e))e.bk=d;d.cd-=dt;if(d.cd<=0){d.cd=s.f;d.sw=1;const dd=s.d*dmul(e,t.k,br);e.hp-=dd;hf(e,.15,dd,t.k,dx,dy,br);}
if(e.bk===d&&!(e.stun>0)){e.dir=Math.atan2(d.x-e.x,d.y-e.y);e.at=(e.at||0)-dt;if(e.at<=0){e.at=BAR.ecd;d.hp-=edmg(e)*solArm(t);d.hit=.2;if(d.hp<=0){d.rs=solRs(t);e.bk=null;d.e=null;solDie(t,d);}}}}
else if(!e)d.hp=Math.min(mx,d.hp+mx*BAR.reg*dt);}}}
// Giant Slayer: damage multiplier on big enemies (bosses, and types with at least 1.8× a goblin's health)
const big=(e,b)=>b&&b.gs&&(e.bs||e.h>=1.8)?b.gs:1;
// Skewer: the bolt carries on through its target and hits up to b.sk more enemies within 18 of its line, up to 150 beyond the target
function skewer(e,b){const dx=e.x-b.x,dy=e.y-b.y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,hit=[];
for(const o of g.en){if(o===e||o.hp<=0||o.out||(o.fy&&!T[b.k].air))continue;const px=o.x-e.x,py=o.y-e.y,a=px*ux+py*uy;if(a<-10||a>150||Math.abs(px*uy-py*ux)>18)continue;hit.push([a,o]);}
hit.sort((p,q)=>p[0]-q[0]);for(const[,o]of hit.slice(0,b.br.sk)){const dd=b.d*dmul(o,b.k,b.br)*shBlk(o,b.k,ux,uy)*big(o,b.br);o.hp-=dd;hf(o,.2,dd,b.k,ux,uy,b.br);}}
// Bounty Office: extra gold for an enemy killed within its range (the best one counts, they don't stack)
function bounty(e){let v=0;for(const t of g.tw){const b=brn(t);if(b&&b.bty&&!(t.stun>0)&&Math.hypot(e.x-t.x,e.y-t.y)<=stat(t).r)v=Math.max(v,Math.ceil(e.rw*b.bty));}return v;}
// Plague: a poisoned enemy that dies passes its poison to every ground enemy within e.pg (who can spread it again)
function plague(e){plagueFx(e,e.pg);for(const o of g.en)if(o!==e&&o.hp>0&&!o.fy&&!o.out&&dmul(o,'alch')>0&&Math.hypot(o.x-e.x,o.y-e.y)<=e.pg){o.pt=3;o.pd=Math.max(o.pd||0,e.pd);o.pg=e.pg;o.hit=.15;}}
// Wizard hit: a plain or Archmage Wizard banishes (the Archmage also everyone within grp of the target); a Time Warden leaves a time field instead
function wizHit(e,b){const br=b.br||{};if(br.tz){addZone({k:'time',x:e.x,y:e.y,r:br.tz[0],t:br.tz[1],d0:br.tz[1],f:br.tz[2]});return;}banish(e,b.l);
if(br.grp)for(const o of g.en)if(o!==e&&o.hp>0&&!o.out&&!(o.bn>0)&&Math.hypot(o.x-e.x,o.y-e.y)<=br.grp){const dd=b.d*dmul(o,'frost',br);o.hp-=dd;hf(o,.2,dd,'frost');banish(o,b.l);}}
// ground zones (g.zn, drawn by zoneFx() in js/07-enemies.js): the Fire Pots' burning ground ('fire': z.d fire damage per second to ground enemies in it)
// and the Time Warden's field ('time': enemies in it move at z.f of their speed – bosses lose only a third as much – and their abilities tick slower too; e.tf, read by update())
const FIRE={dt:'fire'};
function addZone(z){z.m=zoneFx(z);g.zn.push(z);}
function zones(dt){for(const e of g.en)e.tf=1;if(!g.zn.length)return;
for(const z of g.zn){z.t-=dt;for(const e of g.en){if(e.hp<=0||e.out||(e.fy&&z.k=='fire')||Math.hypot(e.x-z.x,e.y-z.y)>z.r)continue;
if(z.k=='fire'){e.hp-=z.d*dmul(e,'cannon',FIRE)*dt;e.lk='cannon';if(z.sl){e.sl=Math.max(e.sl,.3);e.slf=.5;}if(Math.random()<dt*3)burst(e.x,e.y,0xff8a1f,1,.4,.4);}else e.tf=Math.min(e.tf,1-(1-z.f)*(e.bs?.34:1));}}
for(const z of g.zn)if(z.t<=0)zoneEnd(z);g.zn=g.zn.filter(z=>z.t>0);}
const back=k=>1+2.70158*Math.pow(k-1,3)+1.70158*Math.pow(k-1,2);
function sync(dt,rdt){tt+=dt;armyAnim(dt);endAnim(dt);WT.value=tt;WN.offset.x+=dt*.03;WN.offset.y+=dt*.018;flies.forEach((f,i)=>{f.a+=dt*f.sp;const x=f.cx+Math.sin(f.a)*f.r,z=f.cz+Math.cos(f.a*1.3)*f.r*.7,y=f.y+Math.sin(f.a*3)*.15;f.g.rotation.y=Math.atan2(x-f.g.position.x,z-f.g.position.z);f.g.position.set(x,y,z);const fl3=Math.sin(tt*18+i)*.9;f.h1.rotation.z=fl3;f.h2.rotation.z=fl3;});
for(const e of g.en)animEnemy(e,dt);animDying(dt);zoneAnim(dt);rallyHide();heroSync(dt);for(const t of g.rf)solSync(t,dt);spellAnim(dt);
const fl=(a,o)=>a.forEach((f,i)=>{const b=f.userData.b;f.scale.set(b.x,b.y*(1+.3*Math.sin(tt*14+i*2+o)),b.z);});
for(const t of g.tw){const q=t.rec||0;if(t.age<.4){t.age+=rdt===undefined?dt:rdt;t.m.scale.setScalar(back(Math.min(1,t.age/.4)));}
if(t.aim!==undefined)t.aimG.rotation.y=t.aim;
if(t.k=='frost'){t.head.rotation.y+=dt*1.5;t.head.position.y=t.hy+Math.sin(tt*2+t.c)*.04;}
if(t.arm){t.arm.rotation.x=-.8+Math.sin(q*PI)*1.5;t.ball.visible=q<.05;}
if(t.stf)t.stf.rotation.x=-q*.7;if(t.rcl)t.rcl.position.z=-q*.1;if(t.ball&&!t.arm)t.ball.visible=q<.05;if(t.spin)t.spin.rotation.y+=dt*2;
t.head.scale.setScalar(t.k=='cannon'?1+.1*(t.l-1):1+q*.1);
if(t.flag)t.flag.rotation.y=Math.sin(tt*3+t.c)*.35;if(t.sol)solSync(t,dt);
// stunned by a Sapper: stars circle the top of the tower and it smokes
if(t.stun>0){if(!t.stG){const gq=new THREE.Group();for(let i=0;i<4;i++){const m=new THREE.Mesh(geo('oct'),STARM);m.scale.set(.07,.1,.07);gq.add(m);}t.stG=gq;t.m.add(gq);}t.stG.visible=true;
t.stG.children.forEach((m,i)=>{const a=tt*5+i*PI/2;m.position.set(Math.cos(a)*.38,t.head.position.y+.55+Math.sin(a*2)*.05,Math.sin(a)*.38);m.rotation.y=a*2;});if(dt>0&&Math.random()<dt*5)fx(t.x,t.y,0x4a4a4a,.08,.35,.9,t.head.position.y+.3+Math.random()*.3);}
else if(t.stG)t.stG.visible=false;
if(t.buff>1){if(!t.aura)t.aura=glow(t.m,0,.2,0,1.3,0xc9902a);t.aura.visible=true;t.aura.scale.setScalar(1.3+Math.sin(tt*3+t.c)*.1);}else if(t.aura)t.aura.visible=false;fl(t.fl,t.c);}
for(const b of g.bu){const e=b.tg,ty=e.fy||.4,p=1-Math.hypot(e.x-b.x,e.y-b.y)/b.d0,y=b.y0+(ty-b.y0)*p+(T[b.k].arc?Math.sin(clamp(p,0,1)*PI)*.7:0);
b.m.position.set(wx(b.x),y,wz(b.y));if(b.k=='arrow'||b.k=='ballista')b.m.lookAt(wx(e.x),ty,wz(e.y));else b.m.rotation.x+=dt*8;if(b.k=='cannon'&&dt>0&&Math.random()<.4)fx(b.x,b.y,0xdddddd,.04,.14,.35,y);}
for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];f.t+=dt;const p=f.t/f.d;if(p>=1){sc.remove(f.m);f.m.material.dispose();fxs.splice(i,1);continue;}f.m.scale.setScalar(f.s0+(f.s1-f.s0)*p);f.m.material.opacity=.7*(1-p);}
for(let i=pts.length-1;i>=0;i--){const p=pts[i];p.t+=dt;if(p.t>=p.d){sc.remove(p.m);pts.splice(i,1);continue;}p.vy-=(p.g===undefined?9:p.g)*dt;p.m.position.x+=p.vx*dt;p.m.position.z+=p.vz*dt;p.m.position.y=Math.max(.03,p.m.position.y+p.vy*dt);p.m.scale.setScalar(p.s*(1-p.t/p.d));}
for(let i=txts.length-1;i>=0;i--){const q=txts[i];q.t+=dt;if(q.t>=1){sc.remove(q.s);q.s.material.dispose();txts.splice(i,1);continue;}q.s.position.y+=dt*.8;q.s.material.opacity=1-clamp((q.t-.5)/.5,0,1);const kk=q.k||1;q.s.scale.set(.7*kk*back(Math.min(1,q.t*4)),.35*kk*back(Math.min(1,q.t*4)),1);}
for(let i=bolts.length-1;i>=0;i--){const q=bolts[i];q.t+=dt;if(q.t>.18){sc.remove(q.g);bolts.splice(i,1);}else if(dt>0)q.g.visible=Math.random()>.15;}fl(flames,0);flags.forEach((f,i)=>f.rotation.y=Math.sin(tt*3*FS+i*1.7)*.35*(FS>1?1.5:1));
smoke.forEach(s=>{const p=(tt*.2+s.ph)%1;s.m.position.set(s.e[0]+p*.35+Math.sin(p*7+s.ph*9)*.04,s.e[1]+p*1.1,s.e[2]);s.m.scale.setScalar(.04+p*.17);s.m.material.opacity=.5*(1-p);});
trees.forEach(t=>t.rotation.z=Math.sin(tt*1.2+t.userData.ph)*.03);clouds.forEach(c=>{c.position.x+=c.userData.v*dt;if(c.position.x>34)c.position.x=-34;});
gls.forEach((l,i)=>l.intensity=.65+.2*Math.sin(tt*13+i*2));cl.intensity=.65+.2*Math.sin(tt*11+1);if(mill)mill.rotation.z+=dt*.7;moteAnim(dt);}
