// ---------- towers ----------
// Every tower stands on the same stone plinth (top at BH). Bodies use part('tap') so the bricks stay in scale; the details come from the shape helpers in js/04-materials.js.
// Parts the game animates keep their handles: t.head/t.hy (h), t.aimG (turns to the target), t.arm/t.ball (catapult), t.stf (wizard/alchemist arm), t.rcl (ballista recoil),
// t.spin (spinning tops), t.flag, t.fl (flames). Everything else is merged with bakeE.
const BH=.18,TSC=[P.st,P.st2,P.st3];// TSC: textured stone; the loose stones on the walls use plain colours, as the brick texture on such small blocks reads as badges
// a capsule from point a to point b
function seg(p,c,a,b,r){const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];return eBone(p,c,r*.9,r,Math.hypot(...d),a[0],a[1],a[2],d[0],d[1],d[2]);}
// a ring lying flat (torus), optionally glowing
function ring(p,c,r,y,th,e,x,z){const m=eM(p,TORL,c,x||0,y,z||0,PI/2,0,0,e);m.scale.set(r,r,th||r);return m;}
// a little crewman: tunic colour tun, hood colour hat (0x9aa3b0 = an iron kettle hat instead); bow=true draws a bow with an arrow nocked and a quiver on the back
function chibi(h,x,z,tun,hat,bow){const sk=0xffd9b0,lt=0x45301d,dk=0x2a1a10,G=new THREE.Group();G.position.set(x,0,z);h.add(G);
for(const k of[-1,1]){eM(G,capG(.016,.019,.075,8),0x3a3a48,k*.026,.115,0);eM(G,rboxG(.036,.032,.064,.012),lt,k*.026,.017,.008);}
eM(G,lathG([[0,.095],[.058,.1],[.054,.15],[.047,.2],[.038,.245],[0,.256]],12),tun,0,0,0);eM(G,rboxG(.05,.1,.008,.003),hat,0,.18,.046,-.1);
ring(G,lt,.053,.14,.06);eM(G,rboxG(.018,.016,.008,.003),0xffc93c,0,.14,.055);
for(const k of[-1,1]){eSp(G,0x7d8590,.028,.02,.028,k*.05,.245,0);const s=[k*.056,.24,0],e=bow?[k*.066,.2,.07]:[k*.068,.18,.012],w=bow?[k*.03,.19,.14]:[k*.062,.128,.022];
seg(G,tun,s,e,.015);seg(G,tun,e,w,.013);eSp(G,sk,.017,.017,.017,...w);}
eCy(G,sk,.016,.03,0,.27,0);eSp(G,sk,.048,.052,.048,0,.318,0);eSp(G,0x6b4a2b,.05,.046,.046,0,.333,-.012);
for(const k of[-1,1]){eSp(G,0xffffff,.011,.009,.006,k*.02,.326,.041);eSp(G,0x1b1b2b,.006,.007,.004,k*.02,.326,.046);eM(G,rboxG(.022,.006,.006,.002),dk,k*.02,.344,.042,0,0,-k*.2);eSp(G,sk,.01,.014,.007,k*.047,.318,0);eSp(G,0xe8a090,.01,.006,.004,k*.03,.307,.04);}
eSp(G,0xf0c090,.009,.01,.01,0,.314,.05);eM(G,rboxG(.014,.004,.005,.0015),0x7a3030,0,.296,.044);
if(hat==0x9aa3b0){eM(G,domG(.054,.5),hat,0,.33,-.004);eM(G,lathG([[.082,.326],[.08,.334],[.052,.338]],14),hat,0,0,0);}
else{eSp(G,hat,.054,.045,.054,0,.34,-.006);horn(G,hat,0,.37,-.02,.032,.1,3,PI-.35,0,-.35,0);eM(G,rboxG(.006,.045,.02,.002),0xb3202a,.035,.37,-.02,0,0,-.5);}
if(bow){const bw=new THREE.Group();bw.rotation.y=-PI/2;bw.position.set(0,.19,.16);part(bw,'arc',P.wd2,.16,.16,.16,0,0,0).rotation.z=-PI/2;G.add(bw);
eCy(G,0xf0e6c8,.003,.32,0,.19,.16);eCy(G,P.wd2,.005,.2,0,.19,.18,PI/2);eCnD(G,0xdfe6ee,.012,.04,0,.19,.3,0,0,1);
const q=eCy(G,0x6b4a2b,.022,.12,-.04,.22,-.065);q.rotation.x=.25;for(let i=0;i<3;i++){eCy(G,P.wd2,.004,.05,-.04+(i-1)*.01,.3,-.075);eM(G,rboxG(.004,.02,.012,.0015),P.rd,-.04+(i-1)*.01,.33,-.075);}}}
// the stone plinth every tower stands on: a ring of rough blocks round a flagstone top, with rubble at the foot
function plinth(g){part(g,'cyl',P.st2,.43,.1,.43,0,.05,0);for(let i=0;i<12;i++){const a=i/12*2*PI+.13;eM(g,rboxG(.21,.13+rnd(-.012,.012),.1,.025),TSC[i%3],.4*Math.sin(a),.065,.4*Math.cos(a),0,a,0);}
part(g,'cyl',P.st3,.39,.05,.39,0,.155,0);for(let i=0;i<5;i++){const a=rnd(0,2*PI),s=rnd(.022,.04);eSp(g,TSC[i%3],s,s*.7,s,.46*Math.sin(a),s*.4,.46*Math.cos(a));}}
// a round tower body of radius r and height h: a sloped foot, stones sticking out of the wall and optionally ivy; returns R(f), the wall radius at fraction f of the height
function shaft(g,r,h,col,ivy){part(g,'tap',col,r,h,r,0,BH+h/2,0);eM(g,lathG([[r*1.14,BH],[r*1.07,BH+.05],[r*1.0,BH+.1]],20),P.st2,0,0,0);const R=f=>r*(1-.22*f)+.004;
for(let i=0;i<12;i++){const f=rnd(.15,.92),a=rnd(0,2*PI);eM(g,rboxG(rnd(.06,.11),rnd(.035,.05),.03,.008),[0xd8cfbd,0xc4bba8,0xb3aa98][i%3],R(f)*Math.sin(a),BH+h*f,R(f)*Math.cos(a),0,a,0);}
if(ivy){const a0=PI*.72;for(let j=0;j<22;j++){const f=j/22*.85+.02,a=a0+Math.sin(j*.9)*.18+(j%2?.06:-.06),s=rnd(.028,.045);eSp(g,j%3?0x2d5f2b:0x3e8f6a,s,s*.8,s*.5,(R(f)+.01)*Math.sin(a),BH+h*f,(R(f)+.01)*Math.cos(a));}}
return R;}
// a wooden door with a round top, iron bands and a stone arch, facing the camera (+z), with a step
function door(g,r,c){const D=new THREE.Group();D.position.set(0,BH,r*1.04);g.add(D);eM(D,rboxG(.13,.14,.03,.006),c||P.wd2,0,.07,0);eM(D,eg('dtop',()=>new THREE.CylinderGeometry(.065,.065,.03,12,1,false,-PI/2,PI)),c||P.wd2,0,.14,0,PI/2);
for(const y of[.04,.11])eM(D,rboxG(.135,.012,.034,.003),0x2b3342,0,y,.002);eM(D,rboxG(.004,.19,.032,.001),0x2a1a10,0,.1,.003);eTor(D,0x7d8590,.012,.012,.012,.03,.08,.02);
part(D,'arc',P.st3,.08,.08,.06,0,.14,.005);for(const k of[-1,1])eM(D,rboxG(.03,.15,.04,.006),P.st3,k*.08,.075,0);eM(g,rboxG(.2,.03,.08,.01),P.st2,0,BH-.012,r*1.04+.05);}
// an arrow slit with a stone surround at height fraction f and angle a
function slit(g,R,h,f,a,c){const r=R(f)+.006;eM(g,rboxG(.06,.15,.02,.006),P.st3,r*Math.sin(a),BH+h*f,r*Math.cos(a),0,a,0);eM(g,rboxG(.02,.1,.02,.004),c||0x14101e,(r+.008)*Math.sin(a),BH+h*f,(r+.008)*Math.cos(a),0,a,0);}
// the top: corbels under an overhanging ledge, a plank floor and n merlons with caps
function parapet(g,r,y,n,mc,fc){for(let i=0;i<n*2;i++){const a=i/(n*2)*2*PI;eM(g,rboxG(.05,.07,.07,.01),P.st2,(r-.03)*Math.sin(a),y-.05,(r-.03)*Math.cos(a),0,a,0);}
part(g,'cyl',P.st2,r+.05,.07,r+.05,0,y+.02,0);part(g,'cyl',fc||P.wd,r-.02,.03,r-.02,0,y+.065,0);eM(g,lathG([[r+.05,y+.05],[r+.05,y+.1],[r-.02,y+.1]],20),mc||P.st3,0,0,0);
for(let i=0;i<n;i++){const a=i/n*2*PI,x=(r+.015)*Math.sin(a),z=(r+.015)*Math.cos(a);eM(g,rboxG(.12,.1,.07,.012),mc||P.st3,x,y+.14,z,0,a,0);eM(g,rboxG(.14,.025,.09,.008),P.st2,x,y+.2,z,0,a,0);}}
// a wooden barrel with iron hoops
function barrel(g,x,y,z,s){eM(g,lathG([[.0,0],[.05,0],[.06,.05],[.05,.1],[0,.1]].map(p=>[p[0]*s,p[1]*s]),12),P.wd,x,y,z);for(const f of[.02,.08])ring(g,0x2b3342,.056*s,y+f*s,.06*s,0,x,z);}
// a swallow-tailed banner hanging from a rod, facing out at angle a
function hbanner(g,x,y,z,a,c,w,h){const B=new THREE.Group();B.position.set(x,y,z);B.rotation.y=a;g.add(B);eCy(B,P.wd2,.008,w+.06,0,0,0,0,0,PI/2);
eM(B,memG('bn'+ek([w,h]),[[-w/2,0],[w/2,0],[w/2,-h],[0,-h*.8],[-w/2,-h]]),matDS(c),0,0,.006);eM(B,memG('bb'+ek([w,h]),[[-w/2-.008,0],[w/2+.008,0],[w/2+.008,-h-.01],[0,-h*.8-.01],[-w/2-.008,-h-.01]]),matDS(P.gd),0,0,.003);
eM(B,shpG('crest',[[0,.05],[.035,.02],[.03,-.04],[0,-.06],[-.03,-.04],[-.035,.02]],.006,.002),P.gd,0,-h*.42,.012);}
function buildTower(t){if(t.m)sc.remove(t.m);const g=new THREE.Group(),l=t.l,hs=1+.2*(l-1),h=new THREE.Group(),ac=[P.rd,P.bl,P.gd][l-1],grp=[];
t.arm=t.flag=t.stf=t.ball=t.rcl=t.spin=null;t.aura=null;t.fl=[];t.aimG=h;h.userData.keep=true;g.position.set(wx(t.x),0,wz(t.y));blob(g,.62);plinth(g);
if(t.k=='arrow'){// archers: a stone tower with a level-coloured band, slits, ivy, a barrel of spare arrows and shields hung on the merlons
const a=.8*hs,y=BH+a,R=shaft(g,.36,a,P.st,1);part(g,'cyl',ac,.33,.06,.33,0,BH+a*.55,0);for(const an of[PI/2,-PI/2,PI,PI*.25])slit(g,R,a,an==PI*.25?.32:.78,an);door(g,.36);
parapet(g,.34,y,8);torch(g,-.37,BH+a*.35,.1,t.fl);barrel(g,.2,y+.08,-.16,1);for(let i=0;i<6;i++){const x=.2+rnd(-.025,.025),z=-.16+rnd(-.025,.025);eCy(g,P.wd2,.005,.16,x,y+.22,z);eM(g,rboxG(.004,.03,.014,.0015),i%2?P.rd:0xf2f2f2,x,y+.28,z);}
if(l>=2)for(const an of[PI/4,-PI/4,PI*.75,-PI*.75]){const x=.38*Math.sin(an),z=.38*Math.cos(an);eM(g,eg('shld',()=>new THREE.CylinderGeometry(.055,.055,.014,14)),ac,x,y+.13,z).quaternion.setFromUnitVectors(YUP,new THREE.Vector3(Math.sin(an),0,Math.cos(an)));eSp(g,P.gd,.014,.014,.01,x*1.04,y+.13,z*1.04);}
h.position.y=y+.08;chibi(h,0,0,0x3fae6b,P.rd,true);if(l>=2)chibi(h,-.16,-.1,0x3b86e0,P.bl,true);if(l>=3)chibi(h,.16,-.1,0xffb020,P.gd,true);t.flag=flag(g,0,y+.1,-.3,ac,.9);}
else if(t.k=='frost'){// wizard: a lilac tower ringed with glowing runes, lit windows, a side turret with a balcony, a magic circle on top and the wizard himself
const a=.9*hs,y=BH+a,R=shaft(g,.3,a,0xcdbdf5,0);part(g,'cyl',P.pu,.275,.06,.275,0,BH+a*.35,0);part(g,'cyl',P.pu,.26,.06,.26,0,BH+a*.72,0);
for(const f of[.5,.86])ring(g,0x6af0ff,R(f),BH+a*f,.035,0x1aa8c8);
for(const[f,an]of[[.5,0],[.5,PI],[.85,PI/2],[.85,-PI/2]])win(g,R(f)*Math.sin(an),BH+a*f,R(f)*Math.cos(an),.06,.14,an,0xfff0a0,0xffd24a);door(g,.3,0x4a3a7a);
parapet(g,.3,y,8,P.pu,0x5a3fa8);ring(g,0x6af0ff,.2,y+.085,.06,0x1aa8c8);for(let i=0;i<5;i++){const an=i/5*2*PI;eM(g,rboxG(.23,.008,.012,.002),0x9ff7ff,.08*Math.sin(an+.6),y+.087,.08*Math.cos(an+.6),0,an+PI/2,0,0x1aa8c8);}
const tx=-.25,tz=-.16;part(g,'tap',0xcdbdf5,.12,a*.8,.12,tx,BH+a*.4,tz);part(g,'cyl',P.pu,.13,.04,.13,tx,BH+a*.8,tz);part(g,'cone',RF(P.pu),.17,.34,.17,tx,BH+a*.8+.17,tz);
for(let i=0;i<10;i++){const an=i/10*2*PI;eM(g,rboxG(.04,.03,.012,.004),P.pu,tx+.165*Math.sin(an),BH+a*.8+.015,tz+.165*Math.cos(an),0,an,0);}
eSp(g,P.gd,.03,.03,.03,tx,BH+a*.8+.36,tz,0x886600);eCnD(g,P.gd,.012,.08,tx,BH+a*.8+.42,tz,0,1,0);win(g,tx,BH+a*.55,tz+.1,.05,.1,0,0xfff0a0,0xffd24a);
part(g,'cyl',P.st2,.16,.03,.16,.2,BH+a*.62,-.05);for(let i=0;i<5;i++){const an=-.4+i*.45;eCy(g,P.wd2,.008,.08,.2+.15*Math.sin(an+.9),BH+a*.62+.05,-.05+.15*Math.cos(an+.9));}
const wiz=new THREE.Group();wiz.position.set(0,y+.07,0);wiz.userData.keep=true;const sk=0xffd9b0;
eM(wiz,lathG([[0,0],[.11,0],[.1,.06],[.075,.16],[.05,.22],[0,.24]],14),0x3b5bdb,0,0,0);ring(wiz,0xffc93c,.08,.13,.1);for(let i=0;i<6;i++){const an=i*1.1,r=.1-.004*i;eSp(wiz,P.gd,.012,.012,.005,r*Math.sin(an),.03+i*.02,r*Math.cos(an),0x886600);}
for(const k of[-1,1]){seg(wiz,0x3b5bdb,[k*.06,.2,0],[k*.085,.13,.05],.025);}eSp(wiz,sk,.018,.018,.018,-.085,.12,.06);
eSp(wiz,sk,.065,.068,.065,0,.28,0);eCnD(wiz,0xf2f2f2,.05,.13,0,.205,.055,0,-1,.25);for(const k of[-1,1]){eCnD(wiz,0xf2f2f2,.03,.09,k*.035,.22,.05,k*.3,-1,.2);eSp(wiz,0x1b1b2b,.012,.016,.01,k*.025,.29,.058);eM(wiz,rboxG(.035,.012,.012,.004),0xf2f2f2,k*.026,.312,.055,0,0,-k*.2);eCnD(wiz,0xf2f2f2,.012,.05,k*.03,.262,.06,k,-.4,.3);}
eSp(wiz,0xf0c090,.014,.016,.016,0,.275,.065);eM(wiz,lathG([[.0,.325],[.14,.325],[.13,.34],[0,.345]],16),0x2a3a9a,0,0,0);horn(wiz,0x4a4ad0,0,.33,0,.08,.32,4,PI,0,-.25,0);ring(wiz,0xffc93c,.075,.355,.08);
const stf=new THREE.Group();stf.position.set(.1,.15,.04);stf.userData.keep=true;eCy(stf,P.wd2,.012,.34,0,.1,.05);eM(stf,eg('oct',()=>new THREE.OctahedronGeometry(1)),0x9ff7ff,0,.3,.05,0,0,0,0x1aa8c8).scale.set(.045,.065,.045);
for(let i=0;i<3;i++)eCnD(stf,P.wd2,.01,.06,.025*Math.sin(i*2.1),.26,.05+.025*Math.cos(i*2.1),Math.sin(i*2.1),1.4,Math.cos(i*2.1));eSp(stf,sk,.02,.02,.02,0,0,.05);
wiz.add(stf);t.stf=stf;g.add(wiz);t.aimG=wiz;grp.push(wiz,stf);
h.position.y=y+.62;part(h,'oct',0x9ff7ff,.1,.14,.1,0,0,0,0x1aa8c8);glow(h,0,0,0,.8,0x66e0ff);part(h,'tor',0xaee6ff,.22,.22,.22,0,0,0,0x2277bb).rotation.x=PI/2.6;part(h,'tor',0xaee6ff,.2,.2,.2,0,0,0,0x2277bb).rotation.x=-PI/3;
const ns=2+2*l;for(let i=0;i<ns;i++){const an=i/ns*2*PI;part(h,'oct',0xaee6ff,.045,.065,.045,.28*Math.sin(an),.05*Math.sin(i*2),.28*Math.cos(an),0x2277bb);}
t.flag=flag(g,0,y+.1,-.3,0x4a62b8,.8);}
else if(t.k=='ballista'){// ballista: a squat buttressed tower; on top a turntable with a heavy crossbow – curved limbs, a taut string, a winch and the bolt (t.ball) – that recoils (t.rcl)
const a=.55*hs,y=BH+a,R=shaft(g,.36,a,P.st,0);part(g,'cyl',0x4a5568,.33,.06,.33,0,BH+a*.6,0);door(g,.36);for(const an of[PI/2,-PI/2,PI])slit(g,R,a,.6,an);
for(const an of[PI/4,-PI/4,PI*.75,-PI*.75]){const r=.38;eM(g,shpG('butt',[[0,0],[.1,0],[0,.4]],.08,.01),P.st2,r*Math.sin(an),BH,r*Math.cos(an),0,an-PI/2,0).scale.y=a/.5;}
parapet(g,.35,y,8);
h.position.y=y+.1;eCy(h,P.wd2,.07,.16,0,.08,0);eCy(h,P.wd,.13,.03,0,.015,0);for(let i=0;i<8;i++){const an=i/8*2*PI;eSp(h,0x2b3342,.01,.01,.01,.12*Math.sin(an),.032,.12*Math.cos(an));}
const rc=new THREE.Group();rc.userData.keep=true;rc.position.y=.1;h.add(rc);t.rcl=rc;grp.push(rc);
eM(rc,rboxG(.09,.07,.72,.015),P.wd,0,.1,.05);eM(rc,rboxG(.05,.02,.5,.006),P.wd2,0,.14,.12);for(const z of[-.2,.1,.36])eM(rc,rboxG(.1,.08,.02,.004),0x2b3342,0,.1,z);
eM(rc,rboxG(.12,.1,.08,.015),P.wd2,0,.1,.38);for(const k of[-1,1]){seg(rc,P.wd,[k*.05,.1,.38],[k*.22,.1,.34],.03);seg(rc,P.wd,[k*.22,.1,.34],[k*.38,.1,.24],.024);eSp(rc,0x2b3342,.03,.03,.03,k*.38,.1,.24);
seg(rc,0xf0e6c8,[k*.38,.1,.24],[0,.13,-.04],.004);}
eCy(rc,0x5a5a68,.035,.22,0,.1,-.28,0,0,PI/2);for(const k of[-1,1])for(let i=0;i<4;i++){const an=i*PI/2;eCy(rc,P.wd2,.008,.09,k*.11,.1+.045*Math.cos(an),-.28+.045*Math.sin(an),an,0,0);}
const bt=new THREE.Group();bt.userData.keep=true;rc.add(bt);eCy(bt,P.wd2,.016,.6,0,.155,.22,PI/2);eCnD(bt,0xdfe6ee,.035,.11,0,.155,.56,0,0,1);for(let i=0;i<3;i++)eM(bt,rboxG(.004,.05,.08,.002),P.rd,0,.155,-.05,i*PI/3*2);t.ball=bt;grp.push(bt);
chibi(h,0,-.22,0xd9534f,0x9aa3b0,false);if(l>=2)t.flag=flag(g,-.3,y+.1,-.2,P.rd,.8);if(l>=3)chibi(h,.2,-.12,0xd9534f,0x9aa3b0,false);}
else if(t.k=='storm'){// storm tower: copper-banded walls with pipes and blue windows; on top insulated copper rods, a coiled spire and the crackling orb with its spinning rings (t.spin)
const a=hs,y=BH+a,R=shaft(g,.3,a,0xaebdd6,0);for(const f of[.3,.62,.9])part(g,'cyl',0xb87333,R(f)-.002,.05,R(f)-.002,0,BH+a*f,0);
for(const an of[2.3,-2.3])eCy(g,0xb87333,.018,a*.95,(R(.5)+.02)*Math.sin(an),BH+a*.5,(R(.5)+.02)*Math.cos(an),-.12*Math.cos(an),0,.12*Math.sin(an));
for(const[f,an]of[[.45,0],[.45,PI],[.78,PI/2],[.78,-PI/2]])win(g,R(f)*Math.sin(an),BH+a*f,R(f)*Math.cos(an),.05,.13,an,0xbfe9ff,0x66ccff);door(g,.3,0x3a4a6a);
parapet(g,.3,y,8,0xaebdd6);for(let i=0;i<4;i++){const an=i*PI/2+PI/4,x=.26*Math.sin(an),z=.26*Math.cos(an);eCy(g,0xb87333,.02,.3,x,y+.2,z);for(let j=0;j<3;j++)eCy(g,0xe9dfc4,.034,.02,x,y+.12+j*.04,z);eSp(g,0xb87333,.03,.03,.03,x,y+.36,z);}
ring(g,0xb87333,.27,y+.34,.27);eCy(g,0x5a5a68,.03,.12,0,y+.42,0);for(let i=0;i<6;i++)ring(g,0xb87333,.05-i*.005,y+.46+i*.035,.12);eCnD(g,0xb87333,.03,.36,0,y+.72,0,0,1,0);
h.position.y=y+.22;part(h,'sph',0x9fe8ff,.1,.1,.1,0,0,0,0x2aa8ff);glow(h,0,0,0,.9,0x66ccff);
const sp=new THREE.Group();sp.userData.keep=true;h.add(sp);t.spin=sp;grp.push(sp);eM(sp,TORL,0xb87333,0,0,0,PI/2.3).scale.setScalar(.2);eM(sp,TORL,0xb87333,0,0,0,-PI/2.3).scale.setScalar(.2);
for(let i=0;i<4;i++){const an=i*PI/2;eSp(sp,0x9fe8ff,.02,.02,.02,.2*Math.sin(an),0,.2*Math.cos(an),0x2aa8ff);}
t.aimG=new THREE.Group();if(l>=2)t.flag=flag(g,0,y+.1,-.3,0x4a62b8,.8);}
else if(t.k=='alch'){// alchemist: a green tower overgrown with ivy; on top a bubbling cauldron over a fire, a copper still, a shelf of glowing potions and the alchemist with a flask (t.ball)
const a=.75*hs,y=BH+a,R=shaft(g,.35,a,0x8fd8b8,1);part(g,'cyl',0x3e8f6a,.32,.06,.32,0,BH+a*.5,0);
for(const an of[0,PI/2,-PI/2])win(g,R(.75)*Math.sin(an),BH+a*.75,R(.75)*Math.cos(an),.06,.14,an,0xc8ff9a,0x7cff4a);door(g,.35);parapet(g,.35,y,8,0x3e8f6a);
const cx=-.17,cz=-.1;eM(g,lathG([[0,.0],[.1,.02],[.15,.1],[.14,.2],[.12,.22],[.13,.23]],14),0x2a2a35,cx,y+.06,cz);ring(g,0x4a4a5a,.13,y+.29,.08,0,cx,cz);
for(let i=0;i<3;i++){const an=i/3*2*PI;eCy(g,0x2a2a35,.012,.08,cx+.1*Math.sin(an),y+.1,cz+.1*Math.cos(an));}
eCy(g,0x7cff4a,.12,.01,cx,y+.27,cz).material=mat(0x7cff4a,0x3fbf1f);for(let i=0;i<5;i++)eSp(g,0x9aff6a,.02,.02,.02,cx+rnd(-.07,.07),y+.28,cz+rnd(-.07,.07),0x3fbf1f);glow(g,cx,y+.33,cz,.5,0x7cff4a);flame(g,cx,y+.07,cz,.7,t.fl);
seg(g,0xb87333,[cx+.08,y+.3,cz],[.02,y+.38,-.2],.012);seg(g,0xb87333,[.02,y+.38,-.2],[.12,y+.2,-.22],.01);eM(g,lathG([[0,0],[.04,.01],[.05,.05],[.02,.09],[.012,.12]],12),0xc8ff9a,.12,y+.08,-.22,0,0,0,0x2a8a1a);
eM(g,rboxG(.22,.012,.07,.004),P.wd2,.2,y+.2,.12,0,.6,0);eM(g,rboxG(.22,.012,.07,.004),P.wd2,.2,y+.12,.12,0,.6,0);
[[0xb48cf0,-.07],[0xffa94d,0],[0x66ccff,.07]].forEach(([c,o],i)=>{for(const yy of[.13,.21])eM(g,lathG([[0,0],[.022,.005],[.026,.025],[.01,.05],[.008,.065]],10),c,.2+o*Math.cos(.6),y+yy,.12-o*Math.sin(.6),0,0,0,c==0x66ccff?0x1a5a8a:0x222222);});
h.position.y=y+.08;chibi(h,0,0,0x2f7d5a,0x4a2e7a,false);
const stf=new THREE.Group();stf.position.set(.1,.12,.06);stf.userData.keep=true;h.add(stf);eSp(stf,0xffd9b0,.025,.025,.025,0,0,0);const fl2=part(stf,'sph',0x7cff4a,.05,.06,.05,0,.04,.05,0x3fbf1f);fl2.userData.keep=true;t.ball=fl2;t.stf=stf;grp.push(stf);
if(l>=2)t.flag=flag(g,.3,y+.1,-.2,0x3e8f6a,.8);}
else if(t.k=='banner'){// banner tower: sandstone with long swallow-tailed banners down three sides, pennant poles, a great flag and a herald with a horn; a golden ring spins on top (t.spin)
const a=.85*hs,y=BH+a,R=shaft(g,.34,a,0xf2d9a0,0);part(g,'cyl',P.rd,.31,.07,.31,0,BH+a*.5,0);door(g,.34);
for(const an of[0,PI*.67,-PI*.67])hbanner(g,(R(.9)+.025)*Math.sin(an),BH+a*.9,(R(.9)+.025)*Math.cos(an),an,ac,.14,a*.55);
parapet(g,.34,y,8,P.st3);for(let i=0;i<4;i++){const an=i*PI/2+PI/4,x=.32*Math.sin(an),z=.32*Math.cos(an);eCy(g,P.wd2,.012,.34,x,y+.27,z);eSp(g,P.gd,.02,.02,.02,x,y+.45,z);
eM(g,memG('pn',[[0,0],[.14,-.03],[0,-.07]]),matDS([P.rd,P.bl][i%2]),x,y+.42,z,0,an+PI/2,0);}
t.flag=flag(g,0,y+.1,0,ac,1.5);h.position.y=y+.08;chibi(h,.14,.12,0xb3202a,P.gd,false);eM(h,lathG([[.0,0],[.012,0],[.016,.1],[.045,.16],[.05,.17]],12),P.gd,.14,.22,.18,PI/2.4);
const sp=new THREE.Group();sp.userData.keep=true;g.add(sp);t.spin=sp;grp.push(sp);part(sp,'tor',P.gd,.28,.28,.28,0,y+.09,0,0x885500).rotation.x=PI/2;for(let i=0;i<6;i++){const an=i*PI/3;part(sp,'oct',[P.gd,0xb3202a,0x3b86e0][i%3],.03,.04,.03,.28*Math.sin(an),y+.09,.28*Math.cos(an),0x885500);}}
else if(t.k=='vault'){// treasury: a squat strongroom with an iron-studded door and big lock, a ribbed golden dome with a lantern, chests, sacks and stacks of coins round the foot; a coin spins on top (t.spin)
const a=.5*hs,y=BH+a,R=shaft(g,.38,a,P.st,0);part(g,'cyl',P.gd,.35,.06,.35,0,BH+a*.55,0,0x442200);
const D=new THREE.Group();D.position.set(0,BH,R(.1)+.01);g.add(D);eM(D,rboxG(.18,.24,.03,.008),0x2b3342,0,.12,0);for(let i=0;i<3;i++)for(let j=0;j<4;j++)eSp(D,0x7d8590,.008,.008,.006,(i-1)*.055,.04+j*.055,.016);
eM(D,rboxG(.05,.06,.02,.006),P.gd,0,.12,.022,0,0,0,0x442200);part(D,'arc',P.st3,.11,.11,.06,0,.21,0);
eM(g,lathG([[.38,0],[.36,.1],[.3,.2],[.2,.27],[.08,.3],[0,.305]].map(p=>[p[0],p[1]+y+.04]),20),P.gd,0,0,0,0,0,0,0x553300);part(g,'cyl',P.st2,.4,.06,.4,0,y+.02,0);
for(let i=0;i<4;i++){const m=eM(g,eg('rib',()=>new THREE.TorusGeometry(1,.035,6,24,PI)),0xb87333,0,y+.04,0,0,i*PI/4,0);m.scale.set(.375,.3,.375);}
eCy(g,0xb87333,.05,.06,0,y+.37,0);eCnD(g,P.gd,.06,.08,0,y+.44,0,0,1,0);
for(let i=0;i<6;i++){const an=i*1.05+.5;for(let j=0;j<1+i%3;j++)eCy(g,P.gd,.045,.028,.44*Math.sin(an),BH-.03+j*.03,.44*Math.cos(an)).material=mat(P.gd,0x442200);}
for(const[x,z,ry]of[[-.28,.3,.4],[.33,-.26,-.6]]){const C=new THREE.Group();C.position.set(x,BH,z);C.rotation.y=ry;g.add(C);eM(C,rboxG(.16,.08,.1,.01),P.wd,0,.04,0);eM(C,eg('lid',()=>new THREE.CylinderGeometry(.05,.05,.16,10,1,false,0,PI)),P.wd,0,.08,0,0,0,PI/2);
for(const k of[-1,1])eM(C,rboxG(.016,.12,.106,.004),0x2b3342,k*.05,.06,0);for(let i=0;i<5;i++)eSp(C,P.gd,.02,.006,.02,rnd(-.06,.06),.13,rnd(-.03,.03));}
eSp(g,0x9a6a3a,.06,.07,.06,.3,BH+.06,.22);eCy(g,0x45301d,.02,.02,.3,BH+.13,.22);
h.position.y=y+.4;const sp=new THREE.Group();sp.userData.keep=true;h.add(sp);t.spin=sp;grp.push(sp);part(sp,'cyl',P.gd,.12,.025,.12,0,0,0,0x885500).rotation.x=PI/2;part(sp,'cyl',0xffe27a,.08,.03,.08,0,0,0,0xaa7700).rotation.x=PI/2;
eM(sp,shpG('crown',[[-.04,-.02],[.04,-.02],[.05,.03],[.025,.01],[0,.04],[-.025,.01],[-.05,.03]],.04,.004),P.gd,0,0,0,0,0,0,0x885500);glow(h,0,0,0,.8,0xffd24a);
if(l>=2)t.flag=flag(g,-.32,BH+.1,0,P.gd,.8);}
else{// catapult: a planked deck with spoked wheels, an A-frame and axle, the throwing arm (t.arm) with a banded counterweight crate and a sling cup holding the stone (t.ball), a winch, ammunition and a crewman
for(let i=0;i<7;i++)eM(g,rboxG(.088,.05,.62,.008),[P.wd,0x7a4a26,P.wd][i%3],(i-3)*.092,BH+.025,0);for(const z of[-.24,.24])eM(g,rboxG(.72,.05,.07,.01),P.wd2,0,BH+.075,z);
for(const sx of[-1,1])for(const sz of[-1,1]){const W=new THREE.Group();W.position.set(sx*.38,BH+.13,sz*.22);W.rotation.y=PI/2;g.add(W);eM(W,TORL,0x5a3a1e,0,0,0).scale.setScalar(.13);eM(W,TORL,0x2b3342,0,0,0).scale.set(.14,.14,.08);
for(let i=0;i<6;i++){const an=i*PI/3;eCy(W,P.wd2,.012,.12,.06*Math.sin(an),.06*Math.cos(an),0,0,0,-an);}eCy(W,0x5a3a1e,.035,.06,0,0,0,PI/2);eSp(g,P.gd,.035,.035,.035,sx*.42,BH+.13,sz*.22);}
for(let i=0;i<6;i++){const p=[[0,0],[.1,0],[.05,0],[-.05,.0],[0,.08],[.05,.08]][i];eSp(g,0x9aa3b0,.055,.055,.055,.2+p[0],BH+.1+p[1]*.85,.3-p[0]*.2);}
eCy(g,0x5a5a68,.035,.16,0,BH+.14,-.3,0,0,PI/2);for(let i=0;i<4;i++){const an=i*PI/2;eCy(g,P.wd2,.008,.1,.1,BH+.14+.05*Math.cos(an),-.3+.05*Math.sin(an),an,0,0);}
const cg=new THREE.Group();cg.position.set(-.15,BH,-.38);g.add(cg);chibi(cg,0,0,0xd9534f,0x9aa3b0,false);
h.position.y=BH+.09;for(const x of[-.2,.2]){for(const s of[-1,1])eM(h,rboxG(.06,.44,.06,.012),P.wd,x,.2,s*.08,-s*.28);eM(h,rboxG(.05,.04,.22,.01),P.wd2,x,.16,0);eM(h,rboxG(.08,.06,.08,.01),0x2b3342,x,.4,0);}
eCy(h,0x5a5a68,.03,.5,0,.4,0,0,0,PI/2);
const arm=new THREE.Group();arm.position.y=.4;arm.userData.keep=true;eM(arm,rboxG(.08,.08,1.1,.02),P.wd,0,0,.1);for(const z of[-.05,.25,.45])ring(arm,0x6b4a2b,.055,0,.05,0,0,z).rotation.set(0,0,0);eM(arm,rboxG(.1,.1,.05,.01),0x5a5a68,0,0,.1);
eM(arm,rboxG(.26,.24,.24,.03),P.wd2,0,-.12,-.45);for(const o of[-.08,.08])eM(arm,rboxG(.27,.025,.25,.006),0x2b3342,0,-.12+o,-.45);for(let i=0;i<4;i++)eSp(arm,0x8a8578,.05,.04,.05,(i%2-.5)*.1,.02,-.45+(i>>1)*.1-.05);
eM(arm,lathG([[0,-.06],[.08,-.05],[.11,0],[.1,.01]],12),P.wd2,0,-.08,.66);const ball=part(arm,'sph',0x9aa3b0,.075,.075,.075,0,-.02,.66);ball.userData.keep=true;h.add(arm);t.arm=arm;t.ball=ball;grp.push(arm);
if(l>=2)t.flag=flag(g,-.32,BH+.1,.3,P.rd,.8);}
for(let i=0;i<l-1;i++)ring(g,P.gd,.46,.07+i*.05,.25,0x885500);
if(l==3)part(h,'sph',P.gd,.06,.06,.06,0,t.k=='frost'?.3:.5,0,0x886600);
if(t.flag)grp.push(t.flag);g.add(h);bakeE(g);bakeE(h);grp.forEach(bakeE);t.head=h;t.hy=h.position.y;t.m=g;t.age=0;g.scale.setScalar(.01);sc.add(g);}
