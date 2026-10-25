// ---------- towers ----------
const BH=.18;
function chibi(h,x,z,tun,hat,bow){const dk=0x2a1a10;
for(const k of[-1,1]){part(h,'box',0x45301d,.034,.04,.065,x+k*.026,.02,z+.012);part(h,'cyl',0x3a3a48,.018,.08,.018,x+k*.026,.075,z);}
part(h,'tap',tun,.052,.14,.045,x,.19,z);part(h,'cyl',0x45301d,.054,.016,.048,x,.135,z);part(h,'box',0xffc93c,.014,.014,.01,x,.135,z+.047);
part(h,'box',hat,.05,.1,.01,x,.18,z+.042);part(h,'box',hat,.09,.12,.01,x,.16,z-.046);
for(const k of[-1,1]){part(h,'sph',0x7d8590,.03,.022,.03,x+k*.062,.255,z);
part(h,'cyl',tun,.014,.07,.014,x+k*.066,bow?.225:.205,z+(bow?.045:.01)).rotation.x=bow?-1.1:0;
part(h,'cyl',0x45301d,.012,.05,.012,x+k*.06,bow?.2:.16,z+(bow?.095:.015)).rotation.x=bow?-1.4:0;
part(h,'sph',0xffd9b0,.016,.016,.016,x+k*.052,bow?.19:.13,z+(bow?.14:.02));}
part(h,'cyl',0xffd9b0,.016,.025,.016,x,.275,z);part(h,'sph',0xffd9b0,.046,.05,.046,x,.32,z);
for(const k of[-1,1]){part(h,'sph',0xffffff,.011,.008,.006,x+k*.02,.328,z+.04);part(h,'sph',0x1b1b2b,.006,.007,.004,x+k*.02,.328,z+.045);part(h,'box',dk,.02,.005,.006,x+k*.02,.345,z+.04).rotation.z=-k*.2;part(h,'sph',0xffd9b0,.01,.014,.006,x+k*.046,.32,z);}
part(h,'cone',0xe0b090,.008,.02,.008,x,.315,z+.048).rotation.x=PI/2;part(h,'box',0x7a3030,.014,.004,.005,x,.298,z+.043);
part(h,'sph',hat,.052,.04,.052,x,.34,z-.006);part(h,'cone',hat,.03,.07,.03,x,.385,z-.012).rotation.x=-.3;part(h,'box',0xb3202a,.006,.04,.02,x+.035,.37,z-.02).rotation.z=-.5;
if(bow){const bw=new THREE.Group();bw.rotation.y=-PI/2;bw.position.set(x,.19,z+.16);part(bw,'arc',P.wd2,.16,.16,.16,0,0,0).rotation.z=-PI/2;h.add(bw);
part(h,'box',0xffffff,.007,.32,.007,x,.19,z+.16);part(h,'box',P.wd2,.009,.009,.2,x,.19,z+.18);part(h,'cone',0xdfe6ee,.014,.04,.014,x,.19,z+.3).rotation.x=PI/2;
part(h,'cyl',0x6b4a2b,.022,.12,.022,x-.04,.22,z-.065).rotation.x=.25;for(let i=0;i<3;i++){part(h,'cyl',P.wd2,.004,.05,.004,x-.04+(i-1)*.01,.3,z-.075);part(h,'box',P.rd,.012,.02,.004,x-.04+(i-1)*.01,.33,z-.075);}}}
function buildTower(t){if(t.m)sc.remove(t.m);const g=new THREE.Group(),l=t.l,hs=1+.2*(l-1),h=new THREE.Group(),ac=[P.rd,P.bl,P.gd][l-1],grp=[];
t.arm=t.flag=t.stf=t.ball=null;t.aura=null;t.fl=[];t.aimG=h;h.userData.keep=true;g.position.set(wx(t.x),0,wz(t.y));blob(g,.62);
part(g,'cyl',P.st2,.47,.12,.47,0,.06,0);part(g,'cyl',P.st3,.4,.06,.4,0,.15,0);
if(t.k=='arrow'){const a=.8*hs,y=BH+a;part(g,'tap',P.st,.36,a,.36,0,BH+a/2,0);part(g,'cyl',ac,.325,.07,.325,0,BH+a*.55,0);
for(const an of[0,PI/2,-PI/2])win(g,.3*Math.sin(an),BH+a*.78,.3*Math.cos(an),.06,.14,an,0x2a2140);win(g,0,BH+.14,.355,.13,.22,0,P.wd2);
part(g,'cyl',P.st2,.41,.07,.41,0,y+.02,0);part(g,'cyl',P.wd,.37,.03,.37,0,y+.065,0);crown(g,y+.12,.35,10,P.st3);torch(g,-.36,BH+a*.35,.1,t.fl);
h.position.y=y+.08;chibi(h,0,0,0x3fae6b,P.rd,true);if(l>=2)chibi(h,-.16,-.1,0x3b86e0,P.bl,true);if(l>=3)chibi(h,.16,-.1,0xffb020,P.gd,true);t.flag=flag(g,0,y+.1,-.3,ac,.9);}
else if(t.k=='frost'){const a=.9*hs,y=BH+a;part(g,'tap',0xcdbdf5,.3,a,.3,0,BH+a/2,0);part(g,'cyl',P.pu,.275,.06,.275,0,BH+a*.35,0);part(g,'cyl',P.pu,.26,.06,.26,0,BH+a*.72,0);
for(const[f,an]of[[.5,0],[.5,PI],[.85,PI/2],[.85,-PI/2]]){const r=.3*(1-.22*f)+.005;win(g,r*Math.sin(an),BH+a*f,r*Math.cos(an),.06,.14,an,0xfff0a0,0xffd24a);}
win(g,0,BH+.12,.3*(1-.22*.12)+.005,.11,.2,0,0x4a3a7a);part(g,'cyl',P.st2,.36,.06,.36,0,y+.03,0);crown(g,y+.11,.32,10,P.pu);part(g,'cyl',0x5a3fa8,.31,.02,.31,0,y+.065,0);part(g,'tor',0x6af0ff,.2,.2,.2,0,y+.08,0,0x1aa8c8).rotation.x=PI/2;
part(g,'tap',0xcdbdf5,.12,a*.8,.12,-.25,BH+a*.4,-.16);part(g,'cone',RF(P.pu),.17,.34,.17,-.25,BH+a*.8+.17,-.16);part(g,'sph',P.gd,.03,.03,.03,-.25,BH+a*.8+.36,-.16,0x886600);
const wiz=new THREE.Group();wiz.position.set(0,y+.07,0);wiz.userData.keep=true;part(wiz,'cone',0x3b5bdb,.1,.24,.1,0,.12,0);part(wiz,'sph',0xffd9b0,.08,.08,.08,0,.28,0);part(wiz,'cone',0xffffff,.045,.12,.045,0,.2,.06).rotation.x=PI;for(let i=-2;i<=2;i++)part(wiz,'cone',0xf2f2f2,.012,.09,.012,i*.014,.2,.075).rotation.x=PI;for(const k of[-1,1]){part(wiz,'cone',0x3b5bdb,.04,.1,.04,k*.08,.17,.0).rotation.z=-k*.5;part(wiz,'cyl',0xffc93c,.075,.012,.075,0,.12,0);}
part(wiz,'cyl',0x2a3a9a,.12,.015,.12,0,.34,0);part(wiz,'cone',0x4a4ad0,.08,.26,.08,0,.47,-.01).rotation.x=-.25;part(wiz,'sph',P.gd,.03,.03,.03,0,.6,-.07,0x886600);
for(const k of[-1,1])part(wiz,'sph',0x1b1b2b,.014,.02,.014,k*.035,.29,.075);
const stf=new THREE.Group();stf.position.set(.1,.15,.04);stf.userData.keep=true;part(stf,'cyl',P.wd2,.014,.3,.014,0,.12,.05);part(stf,'oct',0x9ff7ff,.045,.06,.045,0,.3,.05,0x1aa8c8);part(stf,'sph',0xffd9b0,.025,.025,.025,0,0,.05);
wiz.add(stf);t.stf=stf;g.add(wiz);t.aimG=wiz;grp.push(wiz,stf);
h.position.y=y+.62;part(h,'oct',0x9ff7ff,.1,.14,.1,0,0,0,0x1aa8c8);glow(h,0,0,0,.8,0x66e0ff);part(h,'tor',0xaee6ff,.22,.22,.22,0,0,0,0x2277bb).rotation.x=PI/2.6;part(h,'tor',0xaee6ff,.2,.2,.2,0,0,0,0x2277bb).rotation.x=-PI/3;
const ns=2+2*l;for(let i=0;i<ns;i++){const an=i/ns*2*PI;part(h,'oct',0xaee6ff,.045,.065,.045,.28*Math.sin(an),.05*Math.sin(i*2),.28*Math.cos(an),0x2277bb);}
t.flag=flag(g,0,y+.1,-.3,0x4a62b8,.8);}
else if(t.k=='ballista'){const a=.55*hs,y=BH+a;part(g,'tap',P.st,.36,a,.36,0,BH+a/2,0);part(g,'cyl',0x4a5568,.33,.06,.33,0,BH+a*.6,0);win(g,0,BH+.12,.345,.12,.2,0,P.wd2);
part(g,'cyl',P.st2,.41,.07,.41,0,y+.02,0);part(g,'cyl',P.wd,.38,.04,.38,0,y+.07,0);crown(g,y+.12,.36,10,P.st3);
h.position.y=y+.1;part(h,'cyl',P.wd2,.07,.16,.07,0,.08,0);const rc=new THREE.Group();rc.userData.keep=true;rc.position.y=.1;h.add(rc);t.rcl=rc;grp.push(rc);
part(rc,'box',P.wd,.09,.07,.72,0,.1,.05);part(rc,'box',P.wd2,.05,.03,.5,0,.15,.12);
for(const k of[-1,1]){part(rc,'box',P.wd,.4,.045,.05,k*.2,.1,.34).rotation.y=k*.3;part(rc,'box',0xf0e6c8,.008,.008,.46,k*.19,.1,.12).rotation.y=Math.atan2(-k*.38,-.25);part(rc,'box',0x4a5568,.05,.06,.07,k*.37,.1,.31);}
const bt=new THREE.Group();bt.userData.keep=true;rc.add(bt);part(bt,'box',P.wd2,.035,.035,.6,0,.15,.22);part(bt,'cone',0xdfe6ee,.04,.1,.04,0,.15,.55).rotation.x=PI/2;part(bt,'box',P.rd,.07,.012,.08,0,.15,-.06);t.ball=bt;grp.push(bt);
chibi(h,0,-.2,0xd9534f,0x9aa3b0,false);if(l>=2)t.flag=flag(g,-.3,y+.1,-.2,P.rd,.8);}
else if(t.k=='storm'){const a=hs,y=BH+a;part(g,'tap',0xaebdd6,.3,a,.3,0,BH+a/2,0);for(const f of[.3,.62,.9])part(g,'cyl',0xb87333,.28-.015*f*3,.05,.28-.015*f*3,0,BH+a*f,0);
for(const[f,an]of[[.45,0],[.45,PI],[.78,PI/2],[.78,-PI/2]]){const r=.3*(1-.22*f)+.005;win(g,r*Math.sin(an),BH+a*f,r*Math.cos(an),.05,.13,an,0xbfe9ff,0x66ccff);}
win(g,0,BH+.12,.3*(1-.22*.12)+.005,.11,.2,0,0x3a4a6a);part(g,'cyl',P.st2,.34,.06,.34,0,y+.03,0);
for(let i=0;i<4;i++){const an=i*PI/2+PI/4;part(g,'cyl',0xb87333,.02,.3,.02,.26*Math.sin(an),y+.2,.26*Math.cos(an));}
part(g,'tor',0xb87333,.27,.27,.27,0,y+.34,0).rotation.x=PI/2;part(g,'cone',0xb87333,.03,.4,.03,0,y+.68,0);
h.position.y=y+.22;part(h,'sph',0x9fe8ff,.1,.1,.1,0,0,0,0x2aa8ff);glow(h,0,0,0,.9,0x66ccff);
const sp=new THREE.Group();sp.userData.keep=true;h.add(sp);t.spin=sp;grp.push(sp);part(sp,'tor',0xb87333,.2,.2,.2,0,0,0).rotation.x=PI/2.3;part(sp,'tor',0xb87333,.2,.2,.2,0,0,0).rotation.x=-PI/2.3;
t.aimG=new THREE.Group();if(l>=2)t.flag=flag(g,0,y+.1,-.3,0x4a62b8,.8);}
else if(t.k=='alch'){const a=.75*hs,y=BH+a;part(g,'tap',0x8fd8b8,.35,a,.35,0,BH+a/2,0);part(g,'cyl',0x3e8f6a,.32,.06,.32,0,BH+a*.5,0);
for(const an of[0,PI/2,-PI/2])win(g,.31*Math.sin(an),BH+a*.75,.31*Math.cos(an),.06,.14,an,0xc8ff9a,0x7cff4a);win(g,0,BH+.12,.355,.12,.2,0,P.wd2);
part(g,'cyl',P.st2,.4,.07,.4,0,y+.02,0);part(g,'cyl',P.wd,.37,.03,.37,0,y+.065,0);crown(g,y+.12,.35,10,0x3e8f6a);
part(g,'sph',0x2a2a35,.14,.11,.14,-.17,y+.17,-.1);part(g,'cyl',0x7cff4a,.115,.01,.115,-.17,y+.25,-.1,0x3fbf1f);glow(g,-.17,y+.3,-.1,.5,0x7cff4a);
for(const[x,z,c]of[[.2,.12,0xb48cf0],[.12,.22,0xffa94d]])part(g,'sph',c,.05,.06,.05,x,y+.13,z,0x222222);
h.position.y=y+.08;chibi(h,0,0,0x2f7d5a,0x4a2e7a,false);
const stf=new THREE.Group();stf.position.set(.1,.12,.06);stf.userData.keep=true;h.add(stf);part(stf,'sph',0xffd9b0,.025,.025,.025,0,0,0);const fl2=part(stf,'sph',0x7cff4a,.05,.06,.05,0,.04,.05,0x3fbf1f);fl2.userData.keep=true;t.ball=fl2;t.stf=stf;grp.push(stf);
if(l>=2)t.flag=flag(g,.3,y+.1,-.2,0x3e8f6a,.8);}
else if(t.k=='banner'){const a=.85*hs,y=BH+a;part(g,'tap',0xf2d9a0,.34,a,.34,0,BH+a/2,0);part(g,'cyl',P.rd,.31,.07,.31,0,BH+a*.5,0);
for(const an of[0,PI/2,-PI/2])win(g,.3*Math.sin(an),BH+a*.75,.3*Math.cos(an),.06,.14,an,0x2a2140);win(g,0,BH+.14,.355,.13,.22,0,P.wd2);
part(g,'cyl',P.st2,.4,.07,.4,0,y+.02,0);part(g,'cyl',P.wd,.37,.03,.37,0,y+.065,0);crown(g,y+.12,.35,10,P.gd);
for(let i=0;i<4;i++){const an=i*PI/2+PI/4;part(g,'cyl',P.wd2,.012,.3,.012,.3*Math.sin(an),y+.25,.3*Math.cos(an));part(g,'cone',[P.rd,P.bl][i%2],.06,.12,.012,.3*Math.sin(an)+.05,y+.34,.3*Math.cos(an));}
t.flag=flag(g,0,y+.1,0,P.rd,1.5);h.position.y=y+.08;chibi(h,.14,.12,0xb3202a,P.gd,false);part(h,'cone',P.gd,.05,.16,.05,.14,.22,.22).rotation.x=PI/2.4;
const sp=new THREE.Group();sp.userData.keep=true;g.add(sp);t.spin=sp;grp.push(sp);part(sp,'tor',P.gd,.28,.28,.28,0,y+.09,0,0x885500).rotation.x=PI/2;for(let i=0;i<6;i++){const an=i*PI/3;part(sp,'oct',P.gd,.03,.04,.03,.28*Math.sin(an),y+.09,.28*Math.cos(an),0x885500);}}
else if(t.k=='vault'){const a=.5*hs,y=BH+a;part(g,'tap',P.st,.38,a,.38,0,BH+a/2,0);part(g,'cyl',P.gd,.35,.06,.35,0,BH+a*.55,0,0x442200);win(g,0,BH+.14,.37,.16,.24,0,0x5a3a1e);part(g,'box',P.gd,.1,.04,.02,0,BH+.1,.385,0x442200);
part(g,'cyl',P.st2,.4,.06,.4,0,y+.02,0);part(g,'sph',P.gd,.38,.26,.38,0,y+.05,0,0x553300);
for(let i=0;i<6;i++){const an=i*1.05;for(let j=0;j<1+i%3;j++)part(g,'cyl',P.gd,.05,.03,.05,.43*Math.sin(an),BH+.015+j*.03,.43*Math.cos(an),0x442200);}
h.position.y=y+.4;const sp=new THREE.Group();sp.userData.keep=true;h.add(sp);t.spin=sp;grp.push(sp);part(sp,'cyl',P.gd,.12,.025,.12,0,0,0,0x885500).rotation.x=PI/2;part(sp,'cyl',0xffe27a,.08,.03,.08,0,0,0,0xaa7700).rotation.x=PI/2;glow(h,0,0,0,.8,0xffd24a);
if(l>=2)t.flag=flag(g,-.32,BH+.1,0,P.gd,.8);}
else{part(g,'box',P.wd,.64,.08,.58,0,BH+.04,0);for(const z of[-.24,.24])part(g,'box',P.wd2,.7,.05,.07,0,BH+.1,z);
for(const sx of[-1,1])for(const sz of[-1,1]){part(g,'cyl',0x5a3a1e,.14,.05,.14,sx*.37,BH+.13,sz*.22).rotation.z=PI/2;part(g,'sph',P.gd,.045,.045,.045,sx*.4,BH+.13,sz*.22);}
for(const[x,z]of[[.18,.2],[.25,.1],[.12,.27]])part(g,'sph',0x9aa3b0,.07,.07,.07,x,BH+.14,z);
const cg=new THREE.Group();cg.position.set(0,BH,-.38);g.add(cg);chibi(cg,0,0,0xd9534f,0x9aa3b0,false);
h.position.y=BH+.09;for(const x of[-.2,.2])for(const s of[-1,1])part(h,'box',P.wd,.06,.42,.06,x,.2,s*.08).rotation.x=-s*.28;part(h,'cyl',0x5a5a68,.03,.5,.03,0,.4,0).rotation.z=PI/2;
const arm=new THREE.Group();arm.position.y=.4;arm.userData.keep=true;part(arm,'box',P.wd,.08,.08,1.1,0,0,.1);part(arm,'box',0x5a5a68,.1,.1,.05,0,0,.1);
part(arm,'box',0x9aa3b0,.26,.24,.24,0,-.12,-.45);part(arm,'box',0x5a5a68,.28,.04,.26,0,-.12,-.45);part(arm,'sph',P.wd2,.1,.06,.1,0,-.08,.66);
const ball=part(arm,'sph',0x9aa3b0,.075,.075,.075,0,-.02,.66);ball.userData.keep=true;h.add(arm);t.arm=arm;t.ball=ball;grp.push(arm);
if(l>=2)t.flag=flag(g,-.32,BH+.1,.3,P.rd,.8);}
for(let i=0;i<l-1;i++)part(g,'tor',P.gd,.47,.47,.47,0,.09+i*.05,0,0x885500).rotation.x=PI/2;
if(l==3)part(h,'sph',P.gd,.06,.06,.06,0,t.k=='frost'?.3:.5,0,0x886600);
g.add(h);bake(g);bake(h);grp.forEach(bake);t.head=h;t.hy=h.position.y;t.m=g;t.age=0;g.scale.setScalar(.01);sc.add(g);}
