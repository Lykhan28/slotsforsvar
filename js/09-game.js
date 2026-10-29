// ---------- game ----------
let g;
function reset(){endReset();if(g)for(const a of[...g.tw,...g.en,...g.bu,...g.dying])sc.remove(a.m);
g={gold:LV.gold,lives:20,wave:0,tw:[],en:[],bu:[],dying:[],q:[],wt:0,brk:0,sel:null,build:'arrow',spd:1,over:false,run:false};selRng();ui();}
// enemy types of wave w in spawn order (the UI previews the next wave with this too)
// from wave 6 bat swarms, from wave 8 Shieldbearers (guard), from wave 9 Sappers, from wave 10 Shamans, from wave 12 Trolls take some of the goblins' places
function waveMix(w){const n=5+w*2,q=[];for(let i=0;i<n;i++)q.push(w%5==0&&i==n-1?'boss':w>4&&i%5==4?'tank':w>11&&i%17==10?'troll':w>9&&i%11==6?'shaman':w>7&&i%7==3?'guard':w>8&&i%8==5?'sapper':w>5&&i%6==1?'bat':w>2&&i%3==2?'fast':'norm');return q;}
// the break between waves lasts BRK s of game time (g.brk counts up; it doesn't run before wave 1). Calling the next wave early pays
// earlyBonus() gold for the time left; with auto-start on (autoW, a menu setting) the wave starts by itself when the break is over
const BRK=25;let autoW=false;
const brkLeft=()=>g.wave>0&&!g.run&&!g.over&&g.wave<MAXW?Math.max(0,BRK-g.brk):0,earlyBonus=()=>Math.floor(brkLeft()*(.4+.04*g.wave));
function callEarly(){if(g.run||g.over)return;const b=earlyBonus();if(b>0){g.gold+=b;const p=WP[WP.length-1];popText(p[0],p[1],'+'+b,'#ffd24a');snd('coin');}startWave();}
function startWave(){if(g.run||g.over)return;g.wave++;g.brk=0;snd('horn');g.run=true;g.wt=0;g.q=waveMix(g.wave).map((type,i)=>({t:i*.8,type,p:i%PATHS.length}));ui();}
// each breach has its own road (PATHS); the wave alternates between them
function spawn(type,pi){if(type=='boss')snd('roar');const e=E[type],hp=30*Math.pow(1.2,g.wave)*e.h*LV.hp,o=buildEnemy(type),R=(e.fy?FPATHS:PATHS)[pi||0];o.m.scale.setScalar(.01);
g.en.push({R,x:R[0][0],y:R[0][1],px:R[0][0],py:R[0][1],seg:1,hp,max:hp,sl:0,stun:0,slf:1,type,dir:PI/2,vis:PI/2,ph:Math.random()*6,gp:Math.random()*6,k:{norm:2*PI/36,fast:2*PI/50,tank:2*PI/44,boss:0,guard:2*PI/40,shaman:2*PI/38,bat:0,sapper:2*PI/32,troll:2*PI/64}[type],hlr:1.5,age:0,hit:0,flash:0,...e,m:o.m,body:o.body,ice:o.ice,bar:o.bar,meshes:o.meshes,rig:o.rig});}
// higher = closer to the castle (minus the distance still to walk, so enemies on different roads compare fairly)
const prog=e=>-e.R.rem[e.seg]-Math.hypot(e.R[e.seg][0]-e.x,e.R[e.seg][1]-e.y);
// targeting modes: a tower shoots the enemy in range with the highest tscore(); t.tm is the player's choice, else the tower type's default (T[k].tm), else First
const TGM={first:['First','Closest to the castle'],last:['Last','Furthest from the castle'],strong:['Strongest','Most health left'],fast:['Fastest','Quickest enemy type'],close:['Closest','Nearest to the tower']},TGK=Object.keys(TGM);
const tmode=t=>t.tm||T[t.k].tm||'first';
// strong is plain health (ties keep the first found, as before); fast breaks ties by progress
const tscore=(t,e,m)=>m=='first'?prog(e):m=='last'?-prog(e):m=='strong'?e.hp:m=='fast'?e.s+prog(e)*1e-6:-Math.hypot(e.x-t.x,e.y-t.y);
const stat=t=>({d:T[t.k].d*(1+.6*(t.l-1))*(t.buff||1),r:T[t.k].r+10*(t.l-1),f:T[t.k].f});
// damage multiplier for tower type k hitting enemy e (its resistance to the tower's damage type; the Ballista pierces physical armour)
const dmul=(e,k)=>{const t=T[k].dt;return t=='phys'&&T[k].pr?1:1-(e.rs[t]||0);};
// Shieldbearer: an Archer arrow or Ballista bolt flying at its front (within ~70° of head-on; dx,dy = the shot's travel direction) loses e.shd of its damage
const shBlk=(e,k,dx,dy)=>{if(!e.shd||(k!='arrow'&&k!='ballista'))return 1;const L=Math.hypot(dx,dy);return L>0&&-(dx*Math.sin(e.dir)+dy*Math.cos(e.dir))/L>.34?1-e.shd:1;};
const upCost=t=>Math.round(T[t.k].c*.8*t.l);
function update(dt){if(g.over)return;
if(!g.run&&g.wave>0){g.brk+=dt;if(autoW&&g.wave<MAXW&&g.brk>=BRK)startWave();}
if(g.run){g.wt+=dt;while(g.q.length&&g.q[0].t<=g.wt){const q=g.q.shift();spawn(q.type,q.p);}}
for(const e of g.en){let m=e.s*(e.stun>0?0:e.sl>0?(e.slf||.5):1)*dt;e.sl-=dt;e.stun-=dt;e.bn-=dt;if(e.hl){e.hlr-=dt;if(e.hlr<=0){e.hlr=HEAL.cd;heal(e);}}if(e.pt>0){e.hp-=e.pd*dt;e.pt-=dt;if(Math.random()<dt*5)burst(e.x,e.y,0x7cff4a,1,.3,.5);}
if(!(e.sap&&sapMove(e,m)))while(m>0&&e.seg<e.R.length){const tx2=e.R[e.seg][0],ty=e.R[e.seg][1],d=Math.hypot(tx2-e.x,ty-e.y);if(d>.01)e.dir=Math.atan2(tx2-e.x,ty-e.y);
if(d<=m){e.x=tx2;e.y=ty;e.seg++;m-=d;}else{e.x+=(tx2-e.x)/d*m;e.y+=(ty-e.y)/d*m;m=0;}}
if(e.seg>=e.R.length){e.hp=-1;e.leak=1;snd('leak');g.lives-=e.type=='boss'?5:1;}}
buffs();for(const t of g.tw){if(t.stun>0){t.stun-=dt;continue;}if(T[t.k].sup||T[t.k].inc)continue;t.cd-=dt;t.rec=Math.max(0,(t.rec||0)-dt*2.5);const s=stat(t),tm=tmode(t);let best=null,bp=-Infinity;
for(const e of g.en){if(e.hp<=0||(t.k=='frost'&&e.bn>0)||(e.fy&&!T[t.k].air))continue;if(Math.hypot(e.x-t.x,e.y-t.y)<=s.r){const p=tscore(t,e,tm);if(p>bp){bp=p;best=e;}}}
if(best){t.aim=Math.atan2(best.x-t.x,best.y-t.y);if(t.cd<=0){t.cd=s.f;t.rec=1;tfx(t);(t.k=='storm'?zap(t,best,s):t.k=='arrow'?volley(t,s):g.bu.push({x:t.x,y:t.y,l:t.l,tg:best,k:t.k,d:s.d,y0:t.head.position.y+(t.k=='cannon'?.4:.15),d0:Math.hypot(best.x-t.x,best.y-t.y)||1,m:mkBullet(t.k)}));}}}
for(const b of g.bu){const e=b.tg;if(b.w>0){b.w-=dt;b.m.visible=false;continue;}b.m.visible=true;if(e.hp<=0){b.dead=1;continue;}
const d=Math.hypot(e.x-b.x,e.y-b.y),m=(T[b.k].bs||340)*dt;
if(d<=m+4){b.dead=1;if(b.k=='alch'){snd('splash');for(const o of g.en)if(!o.fy&&Math.hypot(o.x-e.x,o.y-e.y)<=45){o.pt=3;o.pd=Math.max(o.pd||0,b.d*dmul(o,'alch'));o.hit=.15;}fx(e.x,e.y,0x7cff4a,.1,.75,.5,.1,true);burst(e.x,e.y,0x7cff4a,10,1.2,.2);}else if(b.k=='cannon'){snd('boom');for(const o of g.en)if(!o.fy&&Math.hypot(o.x-e.x,o.y-e.y)<=T.cannon.sp){const dd=b.d*dmul(o,'cannon');o.hp-=dd;hf(o,.25,dd,'cannon',o.x-e.x,o.y-e.y);o.sl=1;o.slf=1-.2*(b.l||1);}fx(e.x,e.y,0xffffff,.15,.95,.35,.12,true);burst(e.x,e.y,0xe9c98a,10,1.4,.15);}
else{const dd=b.d*dmul(e,b.k)*shBlk(e,b.k,e.x-b.x,e.y-b.y);e.hp-=dd;hf(e,.2,dd,b.k,e.x-b.x,e.y-b.y);if(b.k=='frost')banish(e,b.l);else burst(e.x,e.y,0xffffff,2,.6,.3);}}
else{b.x+=(e.x-b.x)/d*m;b.y+=(e.y-b.y)/d*m;}}
const spl=[];for(const e of g.en)if(e.hp<=0){if(e.leak||e.gone)sc.remove(e.m);else{g.gold+=e.rw;snd('coin');popText(e.x,e.y,'+'+e.rw,'#ffd24a');burst(e.x,e.y,e.col,10,1.3,.3);killFx(e);if(e.spl)spl.push(e);}}
for(const b of g.bu)if(b.dead)sc.remove(b.m);
g.en=g.en.filter(e=>e.hp>0);g.bu=g.bu.filter(b=>!b.dead);for(const e of spl)trollSplit(e);
if(g.lives<=0){g.lives=0;if(!g.over){snd('lose');g.overT=performance.now();startEnd(false);}g.over=true;}
if(g.run&&!g.q.length&&!g.en.length){g.run=false;g.brk=0;snd('waveEnd');g.gold+=20+g.wave*2;for(const t of g.tw)if(T[t.k].inc){const v=T[t.k].inc*t.l;g.gold+=v;popText(t.x,t.y,'+'+v,'#ffd24a');}if(g.wave>=MAXW){snd('win');g.over=true;g.won=true;lvWon();g.overT=performance.now();startEnd(true);}ui();}}
// Sapper: once a tower stands within SAP.r it leaves the road, runs at it (40% faster) and blows up beside it, stunning it for SAP.st s (no gold for that);
// if the tower is sold first it walks back to where it left the road. Returns true while it is off the road (update() then skips the road walk)
const SAP={r:90,st:4};
function sapMove(e,m){if(!e.tw2){let best=null,bd=SAP.r;for(const t of g.tw){const d=Math.hypot(t.x-e.x,t.y-e.y);if(d<bd&&!(t.stun>0)&&!(t.sapd&&t.sapd.hp>0&&t.sapd!==e)){bd=d;best=t;}}
if(best){if(!e.back){e.rx=e.x;e.ry=e.y;}e.tw2=best;best.sapd=e;e.back=0;}}
if(e.tw2&&!g.tw.includes(e.tw2)){e.tw2=null;e.back=1;}if(!e.tw2&&!e.back)return false;
const t=e.tw2,tx=t?t.x:e.rx,ty=t?t.y:e.ry,d=Math.hypot(tx-e.x,ty-e.y);if(t)m*=1.4;if(d>.01)e.dir=Math.atan2(tx-e.x,ty-e.y);
if(t&&d<=22+m){t.stun=SAP.st;t.sapd=null;e.hp=-1;e.gone=1;sapFx(e,t);}else if(d<=m){e.x=tx;e.y=ty;e.back=0;}else{e.x+=(tx-e.x)/d*m;e.y+=(ty-e.y)/d*m;}return true;}
// Troll: when killed, e.spl goblins of this wave's strength jump out of its basket where it fell and carry on along its road
function trollSplit(e){trollFx(e);for(let i=0;i<e.spl;i++){spawn('norm');const o=g.en[g.en.length-1],k=(i%2?-1:1)*(9+i*3);
Object.assign(o,{R:e.R,seg:e.seg,x:e.x+k*Math.cos(e.dir),y:e.y-k*Math.sin(e.dir),dir:e.dir,vis:e.dir});o.px=o.x;o.py=o.y;o.hp=o.max=o.max*.5;}}
// Shaman: every HEAL.cd s a green pulse heals the other enemies within HEAL.r by e.hl of their max health (bosses a third of that)
const HEAL={r:75,cd:4};
function heal(e){if(e.hp<=0)return;healFx(e);
for(const o of g.en){if(o===e||o.hp<=0||o.hp>=o.max||Math.hypot(o.x-e.x,o.y-e.y)>HEAL.r)continue;const a=Math.min(o.max-o.hp,o.max*e.hl*(o.type=='boss'?.34:1));o.hp+=a;healFx(o,a);}}
// Wizard: teleport an enemy back along the road (bosses resist), then it is immune for 4 s
function banish(e,l){if(e.bn>0||e.hp<=0)return;let m=(30+30*l)*(e.type=='boss'?.34:1);snd('banish');fx(e.x,e.y,0xb58cff,.1,.9,.4,.1,true);burst(e.x,e.y,0xb58cff,14,1.3,.4);
while(m>0){const p=e.R[e.seg-1],d=Math.hypot(p[0]-e.x,p[1]-e.y);if(d<=m){e.x=p[0];e.y=p[1];m-=d;if(e.seg>1)e.seg--;else break;}else{e.x+=(p[0]-e.x)/d*m;e.y+=(p[1]-e.y)/d*m;m=0;}}
e.px=e.x;e.py=e.y;e.age=.08;e.bn=4;fx(e.x,e.y,0xb58cff,.9,.1,.4,.1,true);burst(e.x,e.y,0xd9c2ff,10,1,.4);}
const back=k=>1+2.70158*Math.pow(k-1,3)+1.70158*Math.pow(k-1,2);
function sync(dt,rdt){tt+=dt;armyAnim(dt);endAnim(dt);WT.value=tt;WN.offset.x+=dt*.03;WN.offset.y+=dt*.018;flies.forEach((f,i)=>{f.a+=dt*f.sp;const x=f.cx+Math.sin(f.a)*f.r,z=f.cz+Math.cos(f.a*1.3)*f.r*.7,y=f.y+Math.sin(f.a*3)*.15;f.g.rotation.y=Math.atan2(x-f.g.position.x,z-f.g.position.z);f.g.position.set(x,y,z);const fl3=Math.sin(tt*18+i)*.9;f.h1.rotation.z=fl3;f.h2.rotation.z=fl3;});
for(const e of g.en)animEnemy(e,dt);animDying(dt);
const fl=(a,o)=>a.forEach((f,i)=>{const b=f.userData.b;f.scale.set(b.x,b.y*(1+.3*Math.sin(tt*14+i*2+o)),b.z);});
for(const t of g.tw){const q=t.rec||0;if(t.age<.4){t.age+=rdt===undefined?dt:rdt;t.m.scale.setScalar(back(Math.min(1,t.age/.4)));}
if(t.aim!==undefined)t.aimG.rotation.y=t.aim;
if(t.k=='frost'){t.head.rotation.y+=dt*1.5;t.head.position.y=t.hy+Math.sin(tt*2+t.c)*.04;}
if(t.arm){t.arm.rotation.x=-.8+Math.sin(q*PI)*1.5;t.ball.visible=q<.05;}
if(t.stf)t.stf.rotation.x=-q*.7;if(t.rcl)t.rcl.position.z=-q*.1;if(t.ball&&!t.arm)t.ball.visible=q<.05;if(t.spin)t.spin.rotation.y+=dt*2;
t.head.scale.setScalar(t.k=='cannon'?1+.1*(t.l-1):1+q*.1);
if(t.flag)t.flag.rotation.y=Math.sin(tt*3+t.c)*.35;
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
