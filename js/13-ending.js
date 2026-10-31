// ---------- ENEMY ARMY + ENDING SCENES ----------
let FS=1,AM=1,cine=null,endS=null;
const fws=[],rockets=[],smk=[],chunks=[],dynF=[],SPM={};
// castle spots below are in the castle's original coordinates (gate on the east wall), mapped into the level with CW(); the crowd with BW() per breach
const fireL=new THREE.PointLight(0xff5a1a,0,16);{const q=CW(11.4,2.5);fireL.position.set(q.x,3,q.z);}sc.add(fireL);
const FW_COL=[0xff5a5a,0xffd24a,0x6af0ff,0xc08bff,0x7cff4a,0xff8ec0,0xffffff];
// ---------- the wave waiting outside the wall ----------
// The next wave stands in a column outside its breach: CRD[i] = breach i's queue in spawn order (road p of the wave queue = breach p; flyers share their road's breach).
// In the break it is waveQ(g.wave+1), during a wave what is left of g.q; it is rebuilt when the wave number or the game object (reset()) changes (crW/crG).
// Only CRN members per breach have models (mem, front first); the rest (pend) wait out of sight and step up as the column moves on.
// spawn() calls crowdTake(type, road): the front member of that type is handed over as the real enemy's model, and e.vo eases it from where it stood
// to the start of the road (animEnemy). Members are buildEnemy() models with an enemy-like object (crMake) run by animEnemy(), so every type walks and idles
// like the real thing; they cast no real shadows (a full column would double the shadow map's cost) and hide their health bars (sprites without a map) until they walk in.
// Defeat makes them cheer (AM 2, set by startEnd). The sim stubs crowdTake (it never builds models), so the game logic doesn't change.
const CRD=ENT.map(()=>({mem:[],pend:[]})),CRN=(LOWQ?8:16)>>(ENT.length>1?1:0),CRC=[0,.55,-.55];let crW=-1,crG=null;
// slot k of a breach's column in breach coordinates: three abreast, the front row just outside the breach, a little off the middle so it misses the battering ram
// and the campfires of the breach scenery (js/06-scenery.js) and stays inside the clear ground (inBr)
const crSlot=(k,bi,back)=>{const r=Math.floor(k/3),q=BW(-7.25-r*.75-(back||0),-2.72+CRC[k%3]+(r%2?.1:-.1),bi);return{x:q.x*S+W*S/2,y:q.z*S+H*S/2};};
function crMake(type,bi,k,back){const o=buildEnemy(type),p=crSlot(k,bi,back),f=crSlot(0,bi,-1),dir=Math.atan2(f.x-p.x,f.y-p.y),sh=[];
const hb=[];o.m.traverse(c=>{if(c.isMesh&&c.castShadow){c.castShadow=false;sh.push(c);}if(c.isSprite&&!c.material.map&&c.visible){c.visible=false;hb.push(c);}});
return{...E[type],type,m:o.m,body:o.body,ice:o.ice,bar:o.bar,meshes:o.meshes,rig:o.rig,gm:o.gm,sh,hb,bi,x:p.x,y:p.y,px:p.x,py:p.y,dir,vis:dir,ph:rnd(0,6),gp:0,k:GAIT[type],hp:1,max:1,sl:0,stun:0,slf:1,age:back?0:rnd(0,.3),hit:0,tf:1,id:rnd(2,7)};}
function crDrop(m){sc.remove(m.m);m.bar.material.dispose();if(m.gm)for(const x of m.gm)x.dispose();}
function crowdBuild(q){for(const C of CRD){C.mem.forEach(crDrop);C.mem=[];C.pend=[];}
for(const e of q){const C=CRD[(e.p|0)%CRD.length];if(C.mem.length<CRN)C.mem.push(crMake(e.type,CRD.indexOf(C),C.mem.length,4+C.mem.length*.15));else C.pend.push(e.type);}}
function crowdTake(type,pi){const C=CRD[(pi|0)%CRD.length];if(!C)return null;const i=C.mem.findIndex((m,j)=>j<4&&m.type==type);
if(i<0){const j=C.pend.indexOf(type);if(j>=0)C.pend.splice(j,1);return null;}
const m=C.mem.splice(i,1)[0];if(C.pend.length)C.mem.push(crMake(C.pend.shift(),m.bi,C.mem.length,3));for(const c of m.hb)c.visible=true;for(const c of m.sh)c.castShadow=true;
return{m:m.m,body:m.body,ice:m.ice,bar:m.bar,meshes:m.meshes,rig:m.rig,gm:m.gm,vo:{x:m.x,y:m.y}};}
function crowdAnim(dt){
if(crG!==g){crG=g;crW=-1;}
const nx=g.run?g.wave:(INF||g.wave<MAXW)&&!g.won?g.wave+1:0;if(!g.over&&nx!==crW){crW=nx;crowdBuild(!nx?[]:g.run?g.q:waveQ(nx));}
for(const C of CRD)C.mem.forEach((m,k)=>{const p=crSlot(k,m.bi),dx=p.x-m.x,dy=p.y-m.y,L=Math.hypot(dx,dy),st=60*1.1*dt;
if(L>2){const s=Math.min(st,L)/L;m.x+=dx*s;m.y+=dy*s;m.dir=Math.atan2(dx,dy);}
else{m.gp+=(Math.round(m.gp/PI)*PI-m.gp)*Math.min(1,dt*6);m.id-=dt;if(m.id<=0){m.id=rnd(3,8);const f=crSlot(0,m.bi,-1);m.dir=Math.atan2(f.x-m.x,f.y-m.y)+rnd(-.5,.5);}}
animEnemy(m,dt);const w=m.m.position;w.y+=gh(w.x,w.z)+(AM==2?Math.max(0,Math.sin(tt*6+m.ph))*.14:0);});}
// ---------- castle life ----------
// Townsfolk (CIT) wander the courtyard between spots in two open areas (CYD, castle coordinates: x0,x1,z0,z1); going from one to the other they pass CYV, clear of the keep.
// They stop and look about, run in panic when the castle falls (AM 2) and jump for joy when it is saved (end sequence, AM 0).
// Two guards (OILG) stand on the arch over the gate with cauldrons of boiling oil: gateOil(tiles) (from spellFx, Boiling Oil) tips the cauldrons and throws arcs of
// drops (OIL.d) onto the gate tiles; each tile bursts into flame when its first drop lands. All in CLG, a group turned like the castle; looks only, never in the sim.
const CLG=new THREE.Group();CLG.position.set(GATE.x,0,GATE.z);CLG.rotation.y=GATE.rot;sc.add(CLG);
const CYD=[[8.75,10.4,.7,2.85],[11.05,12.35,.7,1.45]],CYV=[10.75,1.1],CIT=[],OIL={t:-1,d:[],n:0,a:0},OILM=new THREE.MeshBasicMaterial({color:new THREE.Color(0xe07a1c).convertSRGBToLinear()});
{const TU=[0x8a5a3a,0x55678a,0x6f7f44,0x9a4a36,0x6a4a7a,0xa88446,0x4a7474,0x7a6a5a],AP=[0xd8cbb0,0x5a3a2a,0xc8b890,0x3a4a2a,0xe0d4b8,0x7a2a2a];
for(let i=0;i<(LOWQ?4:8);i++){const G=new THREE.Group(),B=new THREE.Group();G.add(B);CLG.add(G);chibi(B,0,0,TU[i%TU.length],AP[i%AP.length],false);bakeE(B);G.scale.setScalar(i==3||i==6?.72:rnd(.95,1.05));
const a=CYD[i%2];CIT.push({G,B,x:rnd(a[0],a[1]),z:rnd(a[2],a[3]),a:i%2,path:[],w:rnd(0,4),ph:rnd(0,6),dir:rnd(0,6),sp:rnd(.28,.4)});}}
const OILG=[2.12,2.88].map(z=>{const S=new THREE.Group();S.position.set(0,1.44,z-2.5);S.rotation.y=-PI/2;CLG.add(S);
const M=new THREE.Group();M.position.z=-.06;S.add(M);chibi(M,0,0,P.rd,0x8a9098,false);bakeE(M);
const K=new THREE.Group();K.position.set(0,0,.19);S.add(K);const pot=new THREE.Group();pot.position.z=-.085;K.add(pot);
part(pot,'sph',0x2b2b30,.085,.065,.085,0,.065,0);part(pot,'cyl',0x3a3a42,.075,.016,.075,0,.11,0);part(pot,'cyl',0xff7a1a,.066,.006,.066,0,.116,0,0xff6a00).castShadow=false;glow(pot,0,.15,0,.3,0xff8a30);
return{M,K};});
function gateOil(tiles){OIL.t=0;OIL.tl=tiles;OIL.hit=tiles.map(()=>0);OIL.n=0;OIL.a=0;OIL.bm=0;}
const OV=new THREE.Vector3();
function castleAnim(dt){const pan=AM==2&&endS,joy=AM==0&&endS;
for(const c of CIT){if(c.path.length){const[x,z]=c.path[0],dx=x-c.x,dz=z-c.z,L=Math.hypot(dx,dz),s=c.sp*(pan?2.8:1)*dt;
if(L<=s){c.x=x;c.z=z;c.path.shift();if(!c.path.length)c.w=pan?rnd(0,.2):rnd(2,7);}else{c.x+=dx/L*s;c.z+=dz/L*s;}if(L>.001)c.dir=Math.atan2(dx,dz);c.ph+=dt*(pan?20:11);}
else{c.w-=dt;if(c.w<=0){const b=Math.random()<.3?1-c.a:c.a,r=CYD[b],t=[rnd(r[0],r[1]),rnd(r[2],r[3])];c.path=b!=c.a?[CYV,t]:[t];c.a=b;}}
const wk=c.path.length>0;c.G.position.set(c.x-6.17,-.1,c.z-2.5);c.G.rotation.y=c.dir;
c.B.position.y=joy?Math.max(0,Math.sin(tt*7+c.ph))*.12:wk?Math.abs(Math.sin(c.ph))*.025:0;c.B.rotation.z=wk?Math.sin(c.ph)*.07:0;c.B.rotation.y=wk||joy?0:Math.sin(tt*.45+c.ph)*.5;}
if(OIL.t<0)return;OIL.t+=dt;const t=OIL.t,tip=t<.25?sm(0,.25,t):t<.8?1:1-sm(.8,1.25,t);
for(const o of OILG){o.K.rotation.x=tip*1.75;o.M.rotation.x=tip*.3;}
if(t>.18&&t<.75&&dt>0){OIL.a+=dt*70;while(OIL.a>=1){OIL.a--;const j=OIL.n%OIL.tl.length,q=OIL.tl[j],o=OILG[OIL.n++%2];o.K.getWorldPosition(OV);
const x1=wx(q.x)+rnd(-.28,.28),z1=wz(q.y)+rnd(-.28,.28),L=Math.hypot(x1-OV.x,z1-OV.z),m=new THREE.Mesh(geo('sph'),OILM);m.scale.setScalar(rnd(.02,.038));sc.add(m);
OIL.d.push({m,x0:OV.x,y0:OV.y+.08,z0:OV.z,x1,z1,u:0,d:.28+L*.05,h:.3+L*.12,j});}}
for(let i=OIL.d.length-1;i>=0;i--){const d=OIL.d[i];d.u+=dt/d.d;const u=Math.min(1,d.u);d.m.position.set(d.x0+(d.x1-d.x0)*u,d.y0*(1-u)+d.h*4*u*(1-u),d.z0+(d.z1-d.z0)*u);
if(u>=1){sc.remove(d.m);OIL.d.splice(i,1);if(!OIL.hit[d.j]){OIL.hit[d.j]=1;const q=OIL.tl[d.j];if(!OIL.bm){OIL.bm=1;snd('boom',q.x,q.y);}
burst(q.x,q.y,0xc86414,16,1.8,.1);burst(q.x,q.y,0xffb040,10,1.4,.1);fx(q.x,q.y,0x8a4a14,.3,1.1,.8,.03,true);for(let k=0;k<3;k++)fx(q.x+rnd(-20,20),q.y+rnd(-20,20),0xd8d0c8,.1,.6,1.2,.4+k*.25);}
else if(Math.random()<.3)burst(d.x1*S+W*S/2,d.z1*S+H*S/2,0xffa040,1,.6,.05);}}
if(t>1.3&&!OIL.d.length)OIL.t=-1;}
const spm=c=>SPM[c]||(SPM[c]=new THREE.SpriteMaterial({map:GT,color:new THREE.Color(c).convertSRGBToLinear(),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));
function spark(x,y,z,col,s0,vx,vy,vz,d,gv){const sp=L1(new THREE.Sprite(spm(col)));sp.position.set(x,y,z);sp.scale.set(s0,s0,1);sc.add(sp);fws.push({sp,vx,vy,vz,t:0,d,s:s0,gv});}
function rocket(x,z,col){const sp=L1(new THREE.Sprite(spm(0xffe6a0)));sp.scale.set(.25,.25,1);sp.position.set(x,.3,z);sc.add(sp);rockets.push({sp,x,z,col,t:0,ty:rnd(3.6,5.6),vx:rnd(-.3,.3),vz:rnd(-.3,.3),d:rnd(.9,1.2)});snd('fw_up');}
function fwBurst(x,y,z,col){snd('fw_boom');const k=Math.floor(rnd(0,3));spark(x,y,z,0xffffff,1.8,0,0,0,.18,0);
for(let i=0;i<46;i++){const a=rnd(0,PI*2);let el=rnd(-1,1),sp0=rnd(1.4,2.2);if(k==1){el=rnd(-.08,.08);sp0=2.1;}const sq=Math.sqrt(1-el*el);spark(x,y,z,i%6==0?0xffffff:col,.14,Math.cos(a)*sq*sp0,el*sp0,Math.sin(a)*sq*sp0,rnd(1.1,1.7),k==2?3.2:2.2);}}
function puff(x,y,z,s0,col){if(smk.length>140)return;const m=L1(new THREE.Mesh(geo('sph'),new THREE.MeshBasicMaterial({color:col||0x3a3a3a,transparent:true,opacity:.55,depthWrite:false})));m.position.set(x,y,z);sc.add(m);smk.push({m,t:0,d:rnd(1.6,2.6),s:s0,vx:rnd(.1,.3),vy:rnd(.5,.9),vz:rnd(-.1,.1)});}
function ember(x,y,z){const m=L1(new THREE.Mesh(geo('sph'),bm(0xffa040)));m.position.set(x,y,z);sc.add(m);pts.push({m,vx:rnd(-.3,.3),vz:rnd(-.3,.3),vy:rnd(.8,1.6),g:-.3,t:0,d:rnd(.8,1.5),s:rnd(.02,.045)});}
function chunk(x,y,z,s0,vx,vy,vz){if(chunks.length>150){const o=chunks.shift();sc.remove(o.m);}const m=part(sc,'oct',[P.st,P.st2,P.st3][chunks.length%3],s0,s0*rnd(.6,1),s0*rnd(.7,1.1),x,y,z);m.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));chunks.push({m,vx,vy,vz,sx:rnd(-5,5),sy:rnd(-5,5),r:s0,rest:false});}
function dynFire(x,y,z,s0){const f=part(sc,'cone',0xff8a1f,.14*s0,.42*s0,.14*s0,x,y+.2*s0,z,0xff6a00),f2=part(sc,'cone',0xffe27a,.08*s0,.28*s0,.08*s0,x,y+.14*s0,z,0xffcc33);f.castShadow=f2.castShadow=false;dynF.push({f,f2,g3:glow(sc,x,y+.3*s0,z,1.5*s0,0xff8a30),s:s0,t:0,x,y,z,pt:0});}
const KC=CW(11.9,2.5);// keep centre in the world
const FSPOTS=[[8.2,2.9,.2],[12.8,2.9,.2],[8.2,2.9,4.8],[12.8,2.9,4.8],[10.5,2.4,.2],[10.5,2.4,4.8],[12.8,2.6,2.5],[8.2,2.5,1.55],[8.2,2.5,3.45],[9.8,1.9,3.6],[9.2,1.6,3.6],[10.4,1.6,3.6],[9.6,1.5,1],[11.9,.9,4.2],[9.2,1.35,.2],[11.6,1.35,.2],[9.2,1.35,4.8],[11.6,1.35,4.8],[11.9,3.4,2.5],[11.9,4.4,2.5],[11.9,5.2,2.5],[11.5,4.8,2.3],[12.3,4.8,2.7]];
function startEnd(win){FS=win?3:1;AM=win?0:2;const c=CW(10.4,2.5);cine={tx:c.x,tz:c.z,dist:win?15:14,az:(win?-.3:-.45)+GATE.rot,pol:.78};endS={win,t:0,nx:.2,fi:0,sp:FSPOTS.map(q=>{const w=CW(q[0],q[2]);return[w.x,q[1],w.z];})};}
function endReset(){FS=1;AM=1;cine=null;endS=null;for(const a of rockets)sc.remove(a.sp);rockets.length=0;for(const a of fws)sc.remove(a.sp);fws.length=0;for(const a of smk){sc.remove(a.m);a.m.material.dispose();}smk.length=0;
for(const a of chunks)sc.remove(a.m);chunks.length=0;for(const d of dynF){sc.remove(d.f);sc.remove(d.f2);sc.remove(d.g3);}dynF.length=0;
if(KEEP&&KEEP0){KEEP.visible=true;KEEP.position.set(KEEP0.x,KEEP0.y,KEEP0.z);KEEP.rotation.set(0,0,0);KEEP.scale.set(1,1,1);}fireL.intensity=0;R.toneMappingExposure=EXPO;sun.intensity=SUN0;}
function endAnim(dt){
if(cine){const k=1-Math.exp(-dt*1.6);tx+=(cine.tx-tx)*k;tz+=(cine.tz-tz)*k;dist+=(cine.dist-dist)*k;az+=(cine.az-az)*k;pol+=(cine.pol-pol)*k;setCam();}
for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.t+=dt;const p=Math.min(1,r.t/r.d),py=.3+(r.ty-.3)*(1-Math.pow(1-p,2)),px=r.x+r.vx*r.t,pz=r.z+r.vz*r.t;r.sp.position.set(px,py,pz);
if(fws.length<500&&Math.random()<.8)spark(px,py,pz,0xffc860,.12,rnd(-.1,.1),rnd(-.2,0),rnd(-.1,.1),.35,.5);if(p>=1){fwBurst(px,py,pz,r.col);sc.remove(r.sp);rockets.splice(i,1);}}
for(let i=fws.length-1;i>=0;i--){const f=fws[i];f.t+=dt;if(f.t>=f.d){sc.remove(f.sp);fws.splice(i,1);continue;}const dr=Math.exp(-dt*1.4);f.vx*=dr;f.vz*=dr;f.vy=f.vy*dr-f.gv*dt;f.sp.position.x+=f.vx*dt;f.sp.position.y+=f.vy*dt;f.sp.position.z+=f.vz*dt;const k=1-f.t/f.d;f.sp.scale.set(f.s*k,f.s*k,1);}
for(let i=smk.length-1;i>=0;i--){const q=smk[i];q.t+=dt;const p=q.t/q.d;if(p>=1){sc.remove(q.m);q.m.material.dispose();smk.splice(i,1);continue;}q.m.position.x+=q.vx*dt;q.m.position.y+=q.vy*dt;q.m.position.z+=q.vz*dt;q.m.scale.setScalar(q.s*(.4+p*1.8));q.m.material.opacity=.55*(1-p);}
for(const c of chunks){if(c.rest)continue;c.vy-=9*dt;c.m.position.x+=c.vx*dt;c.m.position.y+=c.vy*dt;c.m.position.z+=c.vz*dt;c.m.rotation.x+=c.sx*dt;c.m.rotation.y+=c.sy*dt;const fl2=-.1+c.r*.3;if(c.m.position.y<fl2){c.m.position.y=fl2;c.vy*=-.25;c.vx*=.6;c.vz*=.6;c.sx*=.5;c.sy*=.5;if(Math.abs(c.vy)<.3)c.rest=true;}}
for(const d of dynF){d.t+=dt;const k=Math.min(1,d.t/.8),fl3=1+.3*Math.sin(tt*14+d.x*3);d.f.scale.set(.14*d.s*k,.42*d.s*k*fl3,.14*d.s*k);d.f2.scale.set(.08*d.s*k,.28*d.s*k*(2-fl3),.08*d.s*k);d.g3.scale.setScalar(1.5*d.s*k*(1+.1*Math.sin(tt*9+d.z)));
d.pt-=dt;if(d.pt<=0){d.pt=rnd(.18,.3);puff(d.x+rnd(-.1,.1),d.y+.3,d.z+rnd(-.1,.1),.3*d.s);if(Math.random()<.5)ember(d.x,d.y+.3,d.z);}}
if(!endS)return;const E=endS;E.t+=dt;
if(E.win){E.nx-=dt;if(E.nx<=0){E.nx=rnd(.25,.7);{const q=CW(rnd(8.6,12.4),rnd(.8,4.2));rocket(q.x,q.z,FW_COL[Math.random()*6|0]);}}return;}
while(E.fi<E.sp.length&&E.t>E.fi*.28+.3){const q=E.sp[E.fi++];dynFire(q[0],q[1]-.15,q[2],q[1]>4?1.5:1.1);snd('crackle');}
const k4=Math.min(1,E.t/4);fireL.intensity=Math.min(2.4,E.t*.7)*(1+.15*Math.sin(tt*11));R.toneMappingExposure=EXPO-.3*k4;sun.intensity=SUN0-.7*k4;if(Math.random()<dt*6)snd('crackle');
const ct=E.t-2.6;if(ct>0&&KEEP){if(!E.cs){E.cs=1;snd('collapse');}
if(ct<.9){const j=.03*ct;KEEP.position.x=KEEP0.x+rnd(-j,j);KEEP.position.z=KEEP0.z+rnd(-j,j);KEEP.rotation.z=rnd(-.012,.012);
if(Math.random()<dt*14){chunk(KC.x+rnd(-.5,.5),rnd(3.2,5.2),KC.z+rnd(-.5,.5),rnd(.06,.14),rnd(-.5,.5),0,rnd(-.5,.5));puff(KC.x+rnd(-.6,.6),rnd(.2,1),KC.z+rnd(-.6,.6),.25);}}
else if(ct<3.9){const p=(ct-.9)/3,e2=p*p;KEEP.position.set(KEEP0.x,KEEP0.y-e2*4.4,KEEP0.z);KEEP.rotation.z=e2*.55;KEEP.scale.y=1-e2*.25;
if(Math.random()<dt*30){const a=rnd(0,PI*2);puff(KC.x+Math.cos(a)*.9,0,KC.z+Math.sin(a)*.9,.45);}
if(Math.random()<dt*14)chunk(KC.x+rnd(-.9,.9),rnd(.5,3)*(1-e2),KC.z+rnd(-.9,.9),rnd(.08,.22),rnd(-1.4,1.4),rnd(0,1.5),rnd(-1.4,1.4));}
else if(KEEP.visible){KEEP.visible=false;for(let i=0;i<34;i++){const a=rnd(0,PI*2);puff(KC.x+Math.cos(a)*rnd(0,1.2),rnd(0,.5),KC.z+Math.sin(a)*rnd(0,1.2),rnd(.5,.9));}
for(let i=0;i<26;i++)chunk(KC.x+rnd(-.6,.6),rnd(.3,1),KC.z+rnd(-.6,.6),rnd(.06,.2),rnd(-2,2),rnd(1,3),rnd(-2,2));snd('boom');}}}
Object.assign(SX,{fw_up(){nzs(T0(),.9,'bandpass',500,3000,.1,DS2(),.1,2);},fw_boom(){const t=T0();nzs(t,.5,'lowpass',2500,200,.3,DS2(),.3);voice('sine',90,t,.004,.35,.35,300,DS2(),.1).frequency.exponentialRampToValueAtTime(40,t+.35);for(let i=0;i<6;i++)nzs(t+.1+i*.05,.02,'highpass',3500,3500,.12,DS2(),0);},
collapse(){const t=T0();nzs(t,3.8,'lowpass',320,40,.5,DS2(),.4);for(let i=0;i<9;i++)nzs(t+.4+i*.33,.25,'lowpass',900,100,.4,DS2(),.2);},crackle(){nzs(T0(),.05,'highpass',2500,2500,.12,DS2(),0);}});
