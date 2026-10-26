// ---------- ENEMY ARMY + ENDING SCENES ----------
let FS=1,AM=1,cine=null,endS=null;
const army=[],fws=[],rockets=[],smk=[],chunks=[],dynF=[],SPM={};
const fireL=new THREE.PointLight(0xff5a1a,0,16);fireL.position.set(11.4,3,2.5);sc.add(fireL);
const FW_COL=[0xff5a5a,0xffd24a,0x6af0ff,0xc08bff,0x7cff4a,0xff8ec0,0xffffff];
function buildArmy(){const types=['norm','norm','fast','norm','tank','norm','fast','norm','tank','norm'];
for(let row=0;row<4;row++)for(let col=0;col<7;col++){const x=-7.7-row*1.0+rnd(-.18,.18),z=-2.5+(col-3)*.8*(1+row*.1)+rnd(-.18,.18);
if(Math.abs(z+2.5)<.7&&x>-9.5)continue;if(Math.hypot(x+8.6,z+1.5)<1.2)continue;if(Math.random()<.15)continue;
const type=types[(row*7+col)%types.length],o=buildEnemy(type);o.m.children.forEach(c=>{if(c.isSprite)c.visible=false;});
o.m.position.set(x,gh(x,z),z);o.m.scale.setScalar(rnd(.92,1.1));o.body.rotation.y=Math.atan2(-6.3-x,-2.5-z)+rnd(-.15,.15);if(row>=2)o.m.traverse(c=>{if(c.isMesh)c.castShadow=false;});
army.push({o,type,ph:rnd(0,6),y0:gh(x,z)});}
for(const[x,z]of[[-10.2,-4.4],[-10.8,-.7]]){const o=buildEnemy('boss');o.m.children.forEach(c=>{if(c.isSprite)c.visible=false;});o.m.position.set(x,gh(x,z),z);o.m.scale.setScalar(1.05);o.body.rotation.y=Math.atan2(-6.3-x,-2.5-z);army.push({o,type:'boss',ph:rnd(0,6),y0:gh(x,z)});}}
function armyAnim(dt){for(const a of army){const r=a.o.rig,t=tt+a.ph,m=a.o.m,ro=(n,x,y,z)=>{const q=r[n];if(q){if(x!==undefined)q.rotation.x=x;if(y!==undefined)q.rotation.y=y;if(z!==undefined)q.rotation.z=z;}};
const hop=AM==2?Math.max(0,Math.sin(t*5))*.12:AM==1?Math.max(0,Math.sin(t*3.2))*.03:0;m.position.y=a.y0+hop+(a.type=='boss'?1.5+Math.sin(t*1.6)*.1:0);
const lift=AM==0?-.2:AM==2?-2.8:-1.0,w=Math.sin(t*3.5)*(AM==2?.35:.2);
if(a.type=='norm'){ro('S1',lift+w);ro('E1',AM==0?-.2:-.5);ro('S0',-.25+Math.sin(t*1.3)*.05);ro('TO',.18+Math.sin(t*2)*.02);ro('HD',-.15+Math.sin(t*.9)*.08,Math.sin(t*.6)*.3);ro('R0',0,0,.2+Math.sin(t*3)*.1);ro('R1',0,0,-.2-Math.sin(t*3)*.1);}
else if(a.type=='fast'){ro('SP',AM==0?.2:-.6+Math.sin(t*3.5)*.25);ro('TO',Math.sin(t*2)*.02);ro('HD',Math.sin(t*1.2)*.1,Math.sin(t*.7)*.3);ro('T0',.1,Math.sin(t*4)*.4);ro('T1',0,Math.sin(t*4-.9)*.4);ro('RD',0,0,Math.sin(t*1.8)*.05);}
else if(a.type=='tank'){ro('S0',lift+w);ro('E0',-.3);ro('S1',-.45);ro('E1',-1);ro('HD',-.05,Math.sin(t*.7)*.2);ro('CP',.1+Math.sin(t*2)*.05);ro('PL',-.5+Math.sin(t*3)*.1);r.TO.position.y=.46+Math.sin(t*1.6)*.006;}
else{const f=t*3.5,roar=Math.pow(Math.max(0,Math.sin(t*.8)),8);ro('W0',0,0,Math.sin(f)*.6+.1);ro('W1',0,0,-(Math.sin(f)*.6+.1));ro('WE0',0,0,Math.sin(f-.7)*.4);ro('WE1',0,0,-Math.sin(f-.7)*.4);ro('WH0',0,0,Math.sin(f-1.4)*.5);ro('WH1',0,0,-Math.sin(f-1.4)*.5);r.TO.position.y=.9-Math.sin(f)*.06;ro('JW',.1+roar*.7);ro('HD',.1-roar*.3,0);ro('T0',0,Math.sin(t*1.8)*.3);ro('T1',0,Math.sin(t*1.8-.9)*.4);ro('T2',0,Math.sin(t*1.8-1.8)*.5);}}}
const spm=c=>SPM[c]||(SPM[c]=new THREE.SpriteMaterial({map:GT,color:new THREE.Color(c).convertSRGBToLinear(),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));
function spark(x,y,z,col,s0,vx,vy,vz,d,gv){const sp=L1(new THREE.Sprite(spm(col)));sp.position.set(x,y,z);sp.scale.set(s0,s0,1);sc.add(sp);fws.push({sp,vx,vy,vz,t:0,d,s:s0,gv});}
function rocket(x,z,col){const sp=L1(new THREE.Sprite(spm(0xffe6a0)));sp.scale.set(.25,.25,1);sp.position.set(x,.3,z);sc.add(sp);rockets.push({sp,x,z,col,t:0,ty:rnd(3.6,5.6),vx:rnd(-.3,.3),vz:rnd(-.3,.3),d:rnd(.9,1.2)});snd('fw_up');}
function fwBurst(x,y,z,col){snd('fw_boom');const k=Math.floor(rnd(0,3));spark(x,y,z,0xffffff,1.8,0,0,0,.18,0);
for(let i=0;i<46;i++){const a=rnd(0,PI*2);let el=rnd(-1,1),sp0=rnd(1.4,2.2);if(k==1){el=rnd(-.08,.08);sp0=2.1;}const sq=Math.sqrt(1-el*el);spark(x,y,z,i%6==0?0xffffff:col,.14,Math.cos(a)*sq*sp0,el*sp0,Math.sin(a)*sq*sp0,rnd(1.1,1.7),k==2?3.2:2.2);}}
function puff(x,y,z,s0,col){if(smk.length>140)return;const m=L1(new THREE.Mesh(geo('sph'),new THREE.MeshBasicMaterial({color:col||0x3a3a3a,transparent:true,opacity:.55,depthWrite:false})));m.position.set(x,y,z);sc.add(m);smk.push({m,t:0,d:rnd(1.6,2.6),s:s0,vx:rnd(.1,.3),vy:rnd(.5,.9),vz:rnd(-.1,.1)});}
function ember(x,y,z){const m=L1(new THREE.Mesh(geo('sph'),bm(0xffa040)));m.position.set(x,y,z);sc.add(m);pts.push({m,vx:rnd(-.3,.3),vz:rnd(-.3,.3),vy:rnd(.8,1.6),g:-.3,t:0,d:rnd(.8,1.5),s:rnd(.02,.045)});}
function chunk(x,y,z,s0,vx,vy,vz){if(chunks.length>150){const o=chunks.shift();sc.remove(o.m);}const m=part(sc,'oct',[P.st,P.st2,P.st3][chunks.length%3],s0,s0*rnd(.6,1),s0*rnd(.7,1.1),x,y,z);m.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));chunks.push({m,vx,vy,vz,sx:rnd(-5,5),sy:rnd(-5,5),r:s0,rest:false});}
function dynFire(x,y,z,s0){const f=part(sc,'cone',0xff8a1f,.14*s0,.42*s0,.14*s0,x,y+.2*s0,z,0xff6a00),f2=part(sc,'cone',0xffe27a,.08*s0,.28*s0,.08*s0,x,y+.14*s0,z,0xffcc33);f.castShadow=f2.castShadow=false;dynF.push({f,f2,g3:glow(sc,x,y+.3*s0,z,1.5*s0,0xff8a30),s:s0,t:0,x,y,z,pt:0});}
const FSPOTS=[[8.2,2.9,.2],[12.8,2.9,.2],[8.2,2.9,4.8],[12.8,2.9,4.8],[10.5,2.4,.2],[10.5,2.4,4.8],[12.8,2.6,2.5],[8.2,2.5,1.55],[8.2,2.5,3.45],[9.8,1.9,3.6],[9.2,1.6,3.6],[10.4,1.6,3.6],[9.6,1.5,1],[11.9,.9,4.2],[9.2,1.35,.2],[11.6,1.35,.2],[9.2,1.35,4.8],[11.6,1.35,4.8],[11.9,3.4,2.5],[11.9,4.4,2.5],[11.9,5.2,2.5],[11.5,4.8,2.3],[12.3,4.8,2.7]];
function startEnd(win){FS=win?3:1;AM=win?0:2;cine={tx:10.4,tz:2.5,dist:win?15:14,az:win?-.3:-.45,pol:.78};endS={win,t:0,nx:.2,fi:0,sp:FSPOTS};}
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
if(E.win){E.nx-=dt;if(E.nx<=0){E.nx=rnd(.25,.7);rocket(rnd(8.6,12.4),rnd(.8,4.2),FW_COL[Math.random()*6|0]);}return;}
while(E.fi<E.sp.length&&E.t>E.fi*.28+.3){const q=E.sp[E.fi++];dynFire(q[0],q[1]-.15,q[2],q[1]>4?1.5:1.1);snd('crackle');}
const k4=Math.min(1,E.t/4);fireL.intensity=Math.min(2.4,E.t*.7)*(1+.15*Math.sin(tt*11));R.toneMappingExposure=EXPO-.3*k4;sun.intensity=SUN0-.7*k4;if(Math.random()<dt*6)snd('crackle');
const ct=E.t-2.6;if(ct>0&&KEEP){if(!E.cs){E.cs=1;snd('collapse');}
if(ct<.9){const j=.03*ct;KEEP.position.x=KEEP0.x+rnd(-j,j);KEEP.position.z=KEEP0.z+rnd(-j,j);KEEP.rotation.z=rnd(-.012,.012);
if(Math.random()<dt*14){chunk(11.9+rnd(-.5,.5),rnd(3.2,5.2),2.5+rnd(-.5,.5),rnd(.06,.14),rnd(-.5,.5),0,rnd(-.5,.5));puff(11.9+rnd(-.6,.6),rnd(.2,1),2.5+rnd(-.6,.6),.25);}}
else if(ct<3.9){const p=(ct-.9)/3,e2=p*p;KEEP.position.set(KEEP0.x,KEEP0.y-e2*4.4,KEEP0.z);KEEP.rotation.z=e2*.55;KEEP.scale.y=1-e2*.25;
if(Math.random()<dt*30){const a=rnd(0,PI*2);puff(11.9+Math.cos(a)*.9,0,2.5+Math.sin(a)*.9,.45);}
if(Math.random()<dt*14)chunk(11.9+rnd(-.9,.9),rnd(.5,3)*(1-e2),2.5+rnd(-.9,.9),rnd(.08,.22),rnd(-1.4,1.4),rnd(0,1.5),rnd(-1.4,1.4));}
else if(KEEP.visible){KEEP.visible=false;for(let i=0;i<34;i++){const a=rnd(0,PI*2);puff(11.9+Math.cos(a)*rnd(0,1.2),rnd(0,.5),2.5+Math.sin(a)*rnd(0,1.2),rnd(.5,.9));}
for(let i=0;i<26;i++)chunk(11.9+rnd(-.6,.6),rnd(.3,1),2.5+rnd(-.6,.6),rnd(.06,.2),rnd(-2,2),rnd(1,3),rnd(-2,2));snd('boom');}}}
Object.assign(SX,{fw_up(){nzs(T0(),.9,'bandpass',500,3000,.1,DS2(),.1,2);},fw_boom(){const t=T0();nzs(t,.5,'lowpass',2500,200,.3,DS2(),.3);voice('sine',90,t,.004,.35,.35,300,DS2(),.1).frequency.exponentialRampToValueAtTime(40,t+.35);for(let i=0;i<6;i++)nzs(t+.1+i*.05,.02,'highpass',3500,3500,.12,DS2(),0);},
collapse(){const t=T0();nzs(t,3.8,'lowpass',320,40,.5,DS2(),.4);for(let i=0;i<9;i++)nzs(t+.4+i*.33,.25,'lowpass',900,100,.4,DS2(),.2);},crackle(){nzs(T0(),.05,'highpass',2500,2500,.12,DS2(),0);}});
