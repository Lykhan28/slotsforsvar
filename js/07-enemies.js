// ---------- enemies ----------
const SB=new THREE.SpriteMaterial({color:0x1a1030,depthTest:false,fog:false}),SF=new THREE.SpriteMaterial({color:0x2ecc71,depthTest:false,fog:false});
const FL=new THREE.MeshStandardMaterial({color:new THREE.Color(0xffb8a8).convertSRGBToLinear(),emissive:new THREE.Color(0xff3b1a).convertSRGBToLinear(),emissiveIntensity:.45,roughness:.6});
const lerpA=(a,b,k)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*k;
function eye(p,x,y,z,s,col,glo){eSp(p,col,s,s*.75,s*.6,x,y,z,glo||0x332200);eSp(p,0x0a0805,s*.2,s*.62,s*.12,x,y,z+s*.52);}
// goblin head (also the wolf rider's): big ears on pivots R0/R1, beady eyes, a long nose, tusks; v=0 wears a dented iron cap, v=1 a mohawk
function gHead(H,v){const sk=0x71903c,sk2=0x5a7a2f,bn=0xe8e0c8,dk=0x2a1a10;
eSp(H,sk,.1,.092,.1,0,.055,.025);eSp(H,sk,.088,.085,.09,0,.078,-.02);eM(H,rboxG(.15,.032,.05,.012),sk2,0,.097,.074,.35);
eBone(H,sk2,.011,.026,.075,0,.07,.105,0,-.45,1);eSp(H,sk2,.016,.014,.014,0,.045,.17);eSp(H,sk2,.074,.042,.072,0,.012,.055);eM(H,rboxG(.085,.012,.012,.004),dk,0,.03,.112);
for(const k of[-1,1]){eye(H,k*.042,.072,.098,.024,0xe0c030);eCnD(H,bn,.009,.034,k*.032,.046,.106,k*.15,1,0);eSp(H,sk2,.016,.012,.012,k*.065,.04,.07);
const ear=piv(H,'R'+(k<0?0:1),k*.09,.07,-.01);eM(ear,capG(.004,.03,.14,8),sk,0,0,0,0,0,k*1.82).scale.z=.45;eM(ear,capG(.003,.02,.1,8),0xb86a5a,k*.004,.005,.008,0,0,k*1.82).scale.z=.3;}
eTor(H,0xb87333,.018,.018,.018,.205,.096,-.01).rotation.y=PI/2;
if(v==0){const m=eM(H,domG(.104,.5),0x777b83,0,.085,-.01);m.scale.y=.85;eTor(H,0x5d7094,.1,.1,.12,0,.088,-.01).rotation.x=PI/2;eCnD(H,0x5d7094,.016,.06,0,.19,-.01,0,1,-.15);eSp(H,0x5d7094,.012,.012,.012,-.06,.15,.05);}
else{for(let i=0;i<6;i++)eCnD(H,dk,.02,.08-Math.abs(i-2.5)*.008,0,.165-Math.abs(i-2.5)*.006,.07-i*.032,0,1,-.3-i*.12);eBone(H,dk,.01,.018,.12,0,.12,-.1,0,-.8,-.5);}}
function makeEnemy(type,v){const g=new THREE.Group(),b=new THREE.Group();b.name='body';g.add(b);let hy=.95,sh=.24;
const bn=0xe8e0c8,rg=0x6b4a2b,rg2=0x45301d,cl=0x8e2a2a,mt=0x777b83,gd=0xb87333;
if(type=='norm'){const sk=0x71903c,sk2=0x5a7a2f;
// goblin: pot belly in an open leather jerkin, belt with pouches, cloth flaps, bone necklace; v=0 iron shoulder plate, round shield and spiked club, v=1 fur mantle, sack and rusty cleaver
const TO=piv(b,'TO',0,.34,0);eSp(TO,sk,.12,.13,.105,0,.1,.025);
eM(TO,lathG([[0,-.02],[.11,0],[.13,.08],[.135,.16],[.115,.23],[.06,.27],[0,.275]],14,.75,2*PI-1.5),rg,0,0,-.012);
for(let i=0;i<3;i++)eCy(TO,rg2,.004,.075,0,.13+i*.04,.112,0,0,PI/2);
eTor(TO,rg2,.122,.122,.1,0,0,0).rotation.x=PI/2;eM(TO,rboxG(.036,.03,.012,.004),gd,0,0,.107);
eM(TO,rboxG(.045,.05,.03,.01),rg,.095,-.035,.065,0,.6);eM(TO,rboxG(.04,.045,.028,.01),rg2,-.1,-.03,.055,0,-.7);
eM(TO,rboxG(.09,.14,.01,.004),cl,0,-.075,.098,.12);eM(TO,rboxG(.1,.13,.01,.004),cl,0,-.07,-.105,-.12);
for(let i=0;i<7;i++){const a=(i-3)*.32;eSp(TO,bn,.013,.016,.012,Math.sin(a)*.085,.205,Math.cos(a)*.085+.012);}eCnD(TO,bn,.012,.04,0,.17,.1,0,-1,.2);
if(v==0){const m=eM(TO,domG(.075,.5),mt,-.135,.215,0,0,0,.65);m.scale.y=.8;eTor(TO,0x5d7094,.075,.075,.09,-.135,.215,0).rotation.set(PI/2,.65,0);for(let i=0;i<3;i++)eCnD(TO,0x5d7094,.01,.04,-.15-i*.012,.255-i*.02,-.03+i*.03,-.5,1,0);}
else{eTor(TO,0x6b6f78,.105,.105,.16,0,.235,.0).rotation.x=PI/2;for(let i=0;i<10;i++){const a=i/10*2*PI;eCnD(TO,0x6b6f78,.025,.07,Math.sin(a)*.11,.22,Math.cos(a)*.1,Math.sin(a),-.4,Math.cos(a));}eSp(TO,rg,.07,.085,.05,0,.12,-.12);eCy(TO,rg2,.03,.012,0,.21,-.12);}
const HD=piv(TO,'HD',0,.25,.05);gHead(HD,v);
limb(TO,'S','E',0,-.13,.2,0,.11,.1,.03,.024,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,rg2,r*1.25,.05,0,-l*.6,0);
if(v==0){const G=new THREE.Group();G.position.set(-.04,-l-.02,.02);k.add(G);eCy(G,P.wd2,.1,.018,0,0,0,0,0,PI/2);for(let i=-1;i<=1;i++)eM(G,rboxG(.004,.19-Math.abs(i)*.05,.006,.002),0x45301d,-.01,0,i*.045);
eTor(G,mt,.1,.1,.1,-.002,0,0).rotation.y=PI/2;eSp(G,mt,.012,.03,.03,-.012,0,0);}});
limb(TO,'S','E',1,.13,.2,0,.11,.1,.03,.024,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,rg2,r*1.25,.05,0,-l*.6,0);const G=new THREE.Group();G.position.set(0,-l-.025,.02);k.add(G);
if(v==0){eM(G,capG(.04,.013,.27,10),P.wd2,0,0,-.04,-PI/2);for(let i=0;i<8;i++){const a=i*2.4,z=.13+i*.017;eCnD(G,mt,.008,.035,Math.sin(a)*.03,Math.cos(a)*.03,z,Math.sin(a),Math.cos(a),.2);}}
else{eCy(G,rg2,.012,.11,0,0,.0,PI/2);eM(G,rboxG(.01,.09,.16,.004),0x7d8590,0,-.03,.13);eM(G,rboxG(.012,.012,.15,.003),0x4a4a5a,0,.015,.13);}});
for(const[n,x]of[[0,-.055],[1,.055]])limb(b,'H','K',n,x,.34,0,.16,.16,.036,.028,rg2,sk2,(k,l,r,u)=>{eM(k,rboxG(.06,.036,.1,.012),rg2,0,-l-.004,.025);for(let i=-1;i<=1;i++)eCnD(k,bn,.007,.025,i*.018,-l-.01,.08,0,0,1);
eTor(k,rg,r*1.15,r*1.15,r*1.6,0,-l*.45,0).rotation.x=PI/2;eTor(k,rg,r*1.1,r*1.1,r*1.6,0,-l*.7,0).rotation.x=PI/2;eSp(u,rg,.035,.035,.03,0,-.16,.02);});}
else if(type=='fast'){hy=1.1;sh=.32;const fur=0x6b6f78,fur2=0xa9aeb8,fd=0x4a4d56,sk=0x71903c;
// wolf rider: a shaggy wolf with ruff, mane and bushy tail, a blanket and saddle, spiked collar, snarling jaw (JW); a goblin rider in a leather coat with a pennant spear (SP)
const TO=piv(b,'TO',0,.38,0);eSp(TO,fur,.15,.15,.17,0,0,.14);eSp(TO,fur,.13,.125,.17,0,-.005,-.04);eSp(TO,fur,.125,.125,.13,0,.01,-.2);eSp(TO,fur2,.11,.07,.22,0,-.075,.02);
for(let i=0;i<14;i++){const a=i/14*2*PI;eCnD(TO,i%2?fd:fur,.04,.12,Math.sin(a)*.12,.02+Math.cos(a)*.11,.22,Math.sin(a)*.6,Math.cos(a)*.6,-1);}
for(let i=0;i<9;i++)eCnD(TO,fd,.03,.11,rnd(-.04,.04),.13+.015*Math.sin(i),.18-i*.05,0,.6,-1);
for(const k of[-1,1])for(let i=0;i<4;i++)eCnD(TO,fur,.03,.09,k*.13,-.03-i*.02,.08-i*.08,k*.5,-.6,-1);
eM(TO,rboxG(.27,.02,.25,.008),cl,0,.145,-.03);for(const k of[-1,1]){eM(TO,rboxG(.012,.13,.23,.004),cl,k*.14,.085,-.03,0,0,k*.18);eM(TO,rboxG(.014,.016,.235,.003),gd,k*.152,.022,-.03,0,0,k*.18);}
eM(TO,rboxG(.15,.05,.16,.02),0x7a4a26,0,.17,-.03);eM(TO,rboxG(.13,.065,.03,.012),0x7a4a26,0,.2,-.11);eM(TO,rboxG(.06,.05,.03,.01),0x7a4a26,0,.2,.06);
eTor(TO,rg2,.155,.16,.15,0,.0,-.03);eTor(TO,rg2,.13,.13,.13,0,.03,.24);for(let i=0;i<9;i++){const a=i/9*2*PI;eCnD(TO,mt,.012,.045,Math.sin(a)*.14,.03+Math.cos(a)*.14,.24,Math.sin(a),Math.cos(a),0);}
const HD=piv(TO,'HD',0,.06,.27);eSp(HD,fur,.105,.095,.115,0,.04,.04);eSp(HD,fur,.06,.052,.13,0,.005,.16);eSp(HD,fur2,.05,.028,.11,0,-.024,.15);eSp(HD,0x1a1a1a,.024,.02,.02,0,.022,.29);
for(const k of[-1,1]){eye(HD,k*.05,.068,.115,.021,0xe6b800);eM(HD,rboxG(.05,.014,.03,.005),fd,k*.05,.092,.11,0,0,-k*.3);eCnD(HD,fd,.036,.11,k*.06,.15,-.01,k*.25,1,-.15);eCnD(HD,fur2,.02,.07,k*.06,.145,.0,k*.25,1,-.15);
eCnD(HD,bn,.008,.034,k*.032,-.035,.22,0,-1,.15);for(let i=0;i<3;i++)eCnD(HD,fur,.025,.08,k*.09,.02-i*.03,.0-i*.02,k,-.2,-.8);}
const JW=piv(HD,'JW',0,-.03,.07);eSp(JW,fur2,.044,.022,.1,0,-.012,.075);eSp(JW,0xa23a3a,.026,.008,.06,0,-.002,.08);for(let i=0;i<4;i++)eCnD(JW,bn,.006,.022,(i-1.5)*.018,.008,.15-Math.abs(i-1.5)*.015,0,1,0);
const T0=piv(TO,'T0',0,.04,-.28);eM(T0,capG(.05,.065,.2,10),fur,0,0,0,1.75);const T1=piv(T0,'T1',0,.036,-.197);eM(T1,capG(.02,.055,.18,10),fur,0,0,0,1.75);eSp(T1,fur2,.035,.035,.05,0,.03,-.16);
for(let i=0;i<6;i++){const a=i*2.1;eCnD(T1,i%2?fur2:fur,.025,.08,Math.sin(a)*.04,.02+Math.cos(a)*.03,-.06-i*.02,Math.sin(a),Math.cos(a)*.5,-1);}
for(const[n,x,z]of[[0,-.07,.18],[1,.07,.18],[2,-.07,-.2],[3,.07,-.2]])limb(b,'H','K',n,x,.3,z,.14,.15,z>0?.036:.044,.027,fur,fd,(k,l,r,u)=>{if(z<0)eSp(u,fur,.06,.085,.075,0,-.03,-.01);
eSp(k,fd,.036,.024,.05,0,-l-.008,.02);for(let i=-1;i<=1;i++)eCnD(k,bn,.007,.025,i*.014,-l-.016,.07,0,-.2,1);});
const RD=piv(TO,'RD',0,.1,-.02);
for(const k of[-1,1]){eBone(RD,rg2,.022,.026,.11,k*.06,.08,.0,k*.7,-.5,.35);eBone(RD,rg2,.018,.022,.1,k*.135,.025,.06,k*.1,-1,-.1);eM(RD,rboxG(.04,.03,.06,.01),rg2,k*.145,-.08,.06);}
eM(RD,lathG([[0,.05],[.055,.06],[.062,.12],[.055,.19],[.03,.22],[0,.225]],12),0x7a4a26,0,0,0);eTor(RD,rg2,.058,.058,.07,0,.09,0).rotation.x=PI/2;eM(RD,rboxG(.1,.12,.012,.004),cl,0,.1,-.06,.25);
const HG=new THREE.Group();HG.position.set(0,.205,.01);HG.scale.setScalar(.62);RD.add(HG);gHead(HG,0);
eBone(RD,sk,.016,.02,.11,-.055,.18,.02,-.2,-.4,1);eBone(RD,sk,.016,.02,.11,.055,.18,.02,.3,-.4,.8);
rod(TO,-.07,.29,.12,0,.08,.4,.004,rg2);rod(TO,.03,.29,.12,0,.08,.4,.004,rg2);
const SP=piv(RD,'SP',.07,.12,.04);eM(SP,capG(.008,.008,.56,6),P.wd2,0,0,-.11,-PI/2);eM(SP,shpG('spear',[[-.022,0],[0,.1],[.022,0],[0,-.02]],.008,.002),0xdfe6ee,0,0,.47,PI/2);
eM(SP,memG('pen',[[0,0],[.1,-.015],[0,-.06]]),matDS(cl),.0,.0,.38,0,PI/2,0);eTor(SP,gd,.01,.01,.012,0,0,.44);}
else if(type=='tank'){hy=1.4;sh=.32;b.scale.setScalar(1.15);const st=0x4b586e,st2=0x6f7f96,dk=0x2b3342,rd=0x8e2a2a,rd2=0x5a1a1a,lt=0x45301d,bl=0xdde5f0;
// black knight: full plate with a ridged breastplate, layered spiked pauldrons, a horned great helm with plume (PL), a cape (CP), tabard and kite shield, and a greatsword
const TO=piv(b,'TO',0,.46,0);
eM(TO,lathG([[.17,-.15],[.16,-.08],[.14,0]],14),dk,0,0,0);for(let i=0;i<3;i++)eM(TO,lathG([[.15+i*.009,-.045*(i+1)],[.14+i*.009,-.045*i]],16),i%2?st2:st,0,0,0).scale.z=.85;
eM(TO,lathG([[.13,0],[.155,.05],[.17,.14],[.16,.22],[.12,.28],[.07,.31]],18),st,0,0,0).scale.z=.8;eM(TO,rboxG(.016,.22,.02,.006),st2,0,.15,.134);
eM(TO,rboxG(.012,.12,.012,.003),gd,0,.15,.142);eM(TO,rboxG(.08,.012,.012,.003),gd,0,.18,.14);
for(const s of[1,-1]){eM(TO,rboxG(.13,.24,.01,.003),rd,0,-.09,s*.152,s*.12);eM(TO,rboxG(.132,.014,.012,.003),gd,0,-.205,s*.166,s*.12);}
const bt=eTor(TO,lt,.142,.142,.12,0,.005,0);bt.rotation.x=PI/2;bt.scale.y=.115;eM(TO,rboxG(.04,.035,.014,.005),gd,0,.005,.118);
eM(TO,lathG([[.1,.27],[.11,.31],[.075,.35]],14),st2,0,0,0);
for(const k of[-1,1]){const G=new THREE.Group();G.position.set(k*.19,.27,0);G.rotation.z=-k*.35;TO.add(G);eM(G,domG(.1,.55),st,0,0,0).scale.y=.8;eM(G,lathG([[.1,-.08],[.105,-.03],[.1,0]],14),st2,0,0,0);eM(G,lathG([[.105,-.13],[.11,-.08],[.105,-.06]],14),st,0,0,0);
eTor(G,gd,.1,.1,.06,0,0,0).rotation.x=PI/2;for(let i=0;i<3;i++)eCnD(G,dk,.018,.09,(i-1)*.04,.07,0,k*.3,1,0);}
const CP=piv(TO,'CP',0,.28,-.1);eM(CP,eg('cape',()=>new THREE.CylinderGeometry(.19,.27,.56,12,1,true,PI-.95,1.9)),matDS(rd2),0,-.28,.1);eM(CP,rboxG(.26,.03,.04,.012),gd,0,0,-.08);
const HD=piv(TO,'HD',0,.34,0);eM(HD,lathG([[.085,-.01],[.092,.05],[.09,.13],[.072,.18],[.03,.2],[0,.205]],16),st,0,0,0);
eM(HD,rboxG(.12,.014,.03,.004),0x0a0a10,0,.11,.08);eM(HD,rboxG(.014,.07,.03,.004),0x0a0a10,0,.065,.084);eTor(HD,gd,.093,.093,.093,0,.13,0).rotation.x=PI/2;
eM(HD,rboxG(.012,.12,.012,.003),gd,0,.08,.094);for(let i=0;i<6;i++)eSp(HD,0x0a0a10,.006,.006,.006,.05+(i%2)*.014,.03+(i>>1)*.018,.072);
for(const k of[-1,1])horn(HD,0xd8ccb0,k*.085,.14,0,.028,.24,4,0,k*(PI/2+.2),0,k*.35);
const PL=piv(HD,'PL',0,.17,-.02);eSp(PL,gd,.02,.02,.02,0,.02,0);for(let i=0;i<5;i++)eM(PL,capG(.008,.024,.2,8),rd,0,.02,0,PI-.6-Math.abs(i-2)*.12,(i-2)*.25);
limb(TO,'S','E',0,.2,.26,0,.13,.12,.036,.032,dk,dk,(k,l,r,u)=>{eM(u,capG(.042,.046,.09,12),st,0,-.02,0);eSp(k,st2,.045,.045,.045,0,0,0);eM(k,capG(.04,.038,.08,12),st,0,-.02,0);
eM(k,rboxG(.06,.065,.07,.016),st,0,-l-.03,0);eM(k,lathG([[.032,-.06],[.045,-.03]],12),st2,0,-l+.02,0);
const G=new THREE.Group();G.position.set(0,-l-.035,0);k.add(G);eCy(G,lt,.012,.1,0,0,0,PI/2);eM(G,rboxG(.14,.022,.024,.006),gd,0,0,.055);eSp(G,gd,.02,.02,.02,0,0,-.06);
eM(G,shpG('sword',[[-.022,0],[.022,0],[.02,.42],[0,.48],[-.02,.42]],.008,.002),bl,0,0,.065,PI/2);eM(G,rboxG(.006,.004,.36,.002),0x4a4a5a,0,.006,.25);});
limb(TO,'S','E',1,-.2,.26,0,.13,.12,.036,.032,dk,dk,(k,l,r,u)=>{eM(u,capG(.042,.046,.09,12),st,0,-.02,0);eSp(k,st2,.045,.045,.045,0,0,0);eM(k,capG(.04,.038,.08,12),st,0,-.02,0);eM(k,rboxG(.06,.065,.07,.016),st,0,-l-.03,0);
const G=new THREE.Group();G.position.set(-.07,-l,.05);G.rotation.y=-PI/2;k.add(G);const kite=[[-.11,.12],[.11,.12],[.1,-.02],[0,-.22],[-.1,-.02]];
eM(G,shpG('kite',kite,.022,.006),rd,0,0,0);eM(G,shpG('kite2',kite.map(p=>[p[0]*1.1,p[1]*1.08-.004]),.014,.004),st,0,0,-.012);
eM(G,rboxG(.026,.24,.01,.004),gd,0,-.02,.017);eM(G,rboxG(.17,.026,.01,.004),gd,0,.05,.017);eSp(G,gd,.02,.02,.012,0,.05,.02);});
for(const[n,x]of[[0,-.07],[1,.07]])limb(b,'H','K',n,x,.44,0,.22,.22,.05,.04,dk,dk,(k,l,r,u)=>{eM(u,capG(.052,.06,.16,12),st,0,-.02,0);eM(k,domG(.05,.55),st2,0,0,.02,PI/2);eM(k,capG(.042,.05,.16,12),st,0,-.03,0);
eM(k,rboxG(.08,.045,.14,.015),st,0,-l,.03);eCnD(k,st2,.02,.05,0,-l,.11,0,-.1,1);});}
else if(type=='guard'){hy=1.1;sh=.27;b.scale.setScalar(1.12);const sk=0x6a8a3a,sk2=0x55752d,ml=0x6b6f78,ml2=0x50545c,rim=0x5d6168;
// shieldbearer: a stocky goblin in a mail shirt and iron cap, holding a riveted plank tower shield (SH) out in front, with a short spear in the other hand
const TO=piv(b,'TO',0,.34,0);eSp(TO,sk,.13,.13,.11,0,.1,.02);
eM(TO,lathG([[0,-.03],[.125,-.01],[.14,.08],[.142,.16],[.12,.23],[.065,.27],[0,.275]],14),ml,0,0,-.01);eTor(TO,rg2,.135,.135,.1,0,0,-.01).rotation.x=PI/2;eM(TO,rboxG(.036,.03,.012,.004),gd,0,0,.125);
eM(TO,rboxG(.1,.15,.01,.004),cl,0,-.075,.12,.12);eM(TO,rboxG(.045,.05,.03,.01),rg,.11,-.035,.07,0,.6);
const pd=eM(TO,domG(.075,.5),ml2,.14,.215,0,0,0,-.65);pd.scale.y=.8;eTor(TO,rim,.075,.075,.09,.14,.215,0).rotation.set(PI/2,-.65,0);
const HD=piv(TO,'HD',0,.25,.05);gHead(HD,0);
const SH=piv(TO,'SH',-.03,.04,.2);eM(SH,rboxG(.34,.5,.035,.012),0x6b4a2b,0,0,0);for(const i of[-1,1])eM(SH,rboxG(.006,.46,.006,.002),rg2,i*.085,0,.019);
for(const y of[-.24,.24])eM(SH,rboxG(.36,.03,.045,.008),rim,0,y,0);for(const x of[-.17,.17])eM(SH,rboxG(.03,.5,.045,.008),rim,x,0,0);
eM(SH,shpG('chev',[[-.12,.1],[0,0],[.12,.1],[.12,.04],[0,-.06],[-.12,.04]],.006,.002),cl,0,-.04,.018);eM(SH,domG(.055,.5),rim,0,.08,.018,PI/2);
for(const x of[-.14,.14])for(const y of[-.2,.2])eSp(SH,rim,.012,.012,.008,x,y,.024);for(const x of[-.1,.1])eCnD(SH,rim,.012,.05,x,-.27,0,0,-1,0);
limb(TO,'S','E',0,-.13,.2,0,.11,.1,.032,.026,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,rg2,r*1.25,.05,0,-l*.6,0);});
limb(TO,'S','E',1,.13,.2,0,.11,.1,.032,.026,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,rg2,r*1.25,.05,0,-l*.6,0);const G=new THREE.Group();G.position.set(0,-l-.025,.02);k.add(G);
eM(G,capG(.008,.008,.5,6),P.wd2,0,0,-.14,-PI/2);eM(G,shpG('spear',[[-.022,0],[0,.1],[.022,0],[0,-.02]],.008,.002),0xdfe6ee,0,0,.36,PI/2);eTor(G,gd,.01,.01,.012,0,0,.3);});
for(const[n,x]of[[0,-.06],[1,.06]])limb(b,'H','K',n,x,.34,0,.16,.16,.038,.03,rg2,sk2,(k,l,r,u)=>{eM(k,rboxG(.065,.04,.11,.012),rg2,0,-l-.004,.025);
eTor(k,ml2,r*1.15,r*1.15,r*1.6,0,-l*.45,0).rotation.x=PI/2;eSp(u,ml,.04,.04,.035,0,-.16,.02);});}
else if(type=='shaman'){hy=1.18;const sk=0x71903c,sk2=0x5a7a2f,rb=0x4a4636,rb2=0x3a3428,fe=0x8e2a2a;
// goblin shaman: a hunched goblin in a ragged robe with a feather mantle, bone charms and a feathered head-dress, leaning on a skull staff (ST) whose green orb (GL) flares when it heals
const TO=piv(b,'TO',0,.34,0);eSp(TO,sk,.1,.11,.09,0,.1,.02);
eM(TO,lathG([[0,-.02],[.105,0],[.12,.08],[.12,.16],[.1,.23],[.05,.265],[0,.27]],14),rb,0,0,-.01);eTor(TO,0xa08850,.115,.115,.08,0,.02,-.01).rotation.x=PI/2;
for(let i=0;i<12;i++){const a=i/12*2*PI;eCnD(TO,i%3?rb2:fe,.035,.1,Math.sin(a)*.11,.2,Math.cos(a)*.1,Math.sin(a)*.5,-1,Math.cos(a)*.5);}
for(let i=0;i<5;i++){const a=(i-2)*.4;eSp(TO,bn,.012,.016,.012,Math.sin(a)*.09,.215,Math.cos(a)*.09+.01);}
eSp(TO,bn,.025,.024,.022,0,.15,.115);for(const k of[-1,1])eSp(TO,0x1a1a1a,.007,.007,.005,k*.009,.155,.135);eM(TO,rboxG(.04,.05,.03,.01),rg,.1,-.03,.06,0,.6);
const HD=piv(TO,'HD',0,.25,.05);gHead(HD,1);for(let i=0;i<5;i++)eM(HD,capG(.007,.02,.16,8),i%2?bn:fe,(i-2)*.03,.13,-.07,PI-.6-Math.abs(i-2)*.1,(i-2)*.3);
eTor(HD,bn,.1,.1,.05,0,.1,-.01).rotation.x=PI/2;
limb(TO,'S','E',0,-.12,.2,0,.1,.1,.026,.021,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,rb,r*1.6,.06,0,-l*.25,0);});
limb(TO,'S','E',1,.12,.2,0,.1,.1,.026,.021,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,rb,r*1.6,.06,0,-l*.25,0);});
eM(b,lathG([[.1,.36],[.115,.27],[.14,.15],[.16,.05],[.165,.03]],14),rb,0,0,0);for(let i=0;i<10;i++){const a=i/10*2*PI;eCnD(b,i%2?rb:rb2,.03,.06,Math.sin(a)*.155,.04,Math.cos(a)*.155,Math.sin(a)*.3,-1,Math.cos(a)*.3);}
const ST=piv(b,'ST',.16,0,.17);eM(ST,capG(.011,.013,.95,6),P.wd2,0,.95,0);eTor(ST,rg2,.016,.016,.03,0,.62,0).rotation.x=PI/2;
eSp(ST,bn,.04,.042,.04,0,.99,0);eSp(ST,bn,.028,.015,.03,0,.955,.012);for(const k of[-1,1])eSp(ST,0x1a1a1a,.01,.01,.008,k*.015,.995,.033);
eSp(ST,0x9cff6a,.035,.035,.035,0,1.08,0,0x3fbf1f);for(let i=0;i<3;i++){const a=i/3*2*PI;eCnD(ST,bn,.008,.06,Math.sin(a)*.03,1.05,Math.cos(a)*.03,Math.sin(a)*.5,1,Math.cos(a)*.5);}
for(const k of[-1,1])eCnD(ST,fe,.012,.07,k*.03,.9,0,k*.3,-1,0);glow(ST,0,1.08,0,.3,0x7cff4a).name='GL';
for(const[n,x]of[[0,-.055],[1,.055]])limb(b,'H','K',n,x,.34,0,.16,.16,.03,.024,sk,sk2,(k,l)=>{eM(k,rboxG(.055,.03,.09,.01),rg2,0,-l-.004,.02);});}
else if(type=='bat'){hy=1.5;sh=.2;const fu=0x4a3a3a,fu2=0x2e2428,mb=0x5a3a40;
// bat swarm: five bats (B0-B4, the first one bigger) milling around a point in the air (TO); each flaps a pair of membrane wings (WL/WR + its number); big ears, fangs, glowing eyes
const TO=piv(b,'TO',0,1.05,0);
[[0,0,.1,1.3],[-.28,.1,-.05,.9],[.27,-.06,-.1,.85],[-.12,-.12,-.3,.8],[.12,.14,-.32,.75]].forEach(([x,y,z,k],i)=>{const B=piv(TO,'B'+i,x,y,z);B.scale.setScalar(k);B.userData.p=[x,y,z];
eSp(B,fu,.06,.055,.08,0,0,0);eSp(B,fu2,.045,.04,.05,0,-.01,-.07);eSp(B,fu,.045,.042,.045,0,.02,.075);eSp(B,0x6a4a4a,.016,.012,.012,0,.015,.118);
for(const k of[-1,1]){eCnD(B,fu2,.016,.06,k*.025,.06,.07,k*.4,1,-.1);eye(B,k*.019,.032,.108,.012,0xff7a3a,0xaa2200);eCnD(B,0xf2ead2,.004,.016,k*.008,-.006,.114,0,-1,0);eCnD(B,fu2,.006,.03,k*.02,-.04,-.1,0,-.3,-1);
const W=piv(B,(k<0?'WL':'WR')+i,k*.05,.01,0),m=eM(W,memG('bat',[[0,.04],[.12,.05],[.26,.02],[.3,-.06],[.22,-.04],[.17,-.1],[.1,-.06],[.03,-.09],[0,-.06]]),matDS(mb),0,0,0,PI/2);m.scale.x=k;
eBone(W,fu2,.005,.007,.28,0,0,.03,k,0,.08,5);eBone(W,fu2,.004,.005,.14,k*.17,0,.04,0,0,-1,5);}});}
else if(type=='sapper'){hy=1.12;const sk=0x71903c,sk2=0x5a7a2f,lb=0x5a3a22,bk=0x2a2a2e,ir=0x5d6168;
// sapper: a wiry goblin in a scorched leather jerkin, goggles and a bandolier, spare bombs on its belt, holding a big lit bomb (BM) over its head; the fuse spark (GL) flickers harder when it charges a tower
const TO=piv(b,'TO',0,.34,0);eSp(TO,sk,.1,.11,.09,0,.1,.02);eM(TO,lathG([[0,-.02],[.105,0],[.12,.08],[.12,.16],[.1,.23],[.05,.265],[0,.27]],14),lb,0,0,-.01);
eTor(TO,rg2,.115,.115,.08,0,0,-.01).rotation.x=PI/2;for(let i=0;i<3;i++){const a=(i-1)*.9+PI;eSp(TO,bk,.034,.034,.034,Math.sin(a)*.12,-.01,Math.cos(a)*.11-.01);}
eM(TO,rboxG(.06,.06,.035,.01),rg,.11,-.03,.05,0,.6);eM(TO,rboxG(.018,.3,.012,.004),rg2,0,.12,.112,0,0,.6);for(let i=0;i<3;i++)eSp(TO,gd,.008,.008,.006,-.03+i*.03,.08+i*.05,.118);
const HD=piv(TO,'HD',0,.25,.05);gHead(HD,1);for(const k of[-1,1]){eTor(HD,0x8a6a3a,.03,.03,.04,k*.042,.072,.1);eSp(HD,0xb8d8e0,.022,.022,.008,k*.042,.072,.112);}eTor(HD,rg2,.102,.102,.05,0,.075,-.01).rotation.x=PI/2;
for(const n of[0,1])limb(TO,'S','E',n,n?.13:-.13,.2,0,.11,.1,.026,.022,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,rg2,r*1.3,.05,0,-l*.6,0);});
const BM=piv(TO,'BM',0,.52,.06);eSp(BM,bk,.09,.09,.09,0,0,0);eTor(BM,ir,.091,.091,.05,0,0,0).rotation.y=PI/2;eCy(BM,ir,.032,.025,0,.088,0);
eBone(BM,0xc9b37a,.006,.006,.07,0,.1,0,.3,1,0,5);eSp(BM,0xffd27a,.014,.014,.014,.022,.168,0,0xff8a00);glow(BM,.022,.17,0,.22,0xffa040).name='GL';
for(const[n,x]of[[0,-.055],[1,.055]])limb(b,'H','K',n,x,.34,0,.16,.16,.034,.026,rg2,sk2,(k,l)=>{eM(k,rboxG(.055,.034,.095,.01),rg2,0,-l-.004,.022);});}
else if(type=='troll'){hy=1.9;sh=.42;const sk=0x7d8a6a,sk2=0x5f6b50,hr=0x3a3028,bk=0x8a6a3a,bk2=0x6b4f2a,rp=0xa08850;
// troll: a hulking, hunched brute with long arms, a club, a tusked underbite (JW) and a wicker basket on its back with two goblins in it (G0/G1) – they jump out when it dies
const TO=piv(b,'TO',0,.75,0);eSp(TO,sk,.3,.27,.26,0,.1,.05);eSp(TO,sk,.29,.22,.24,0,.3,-.02);for(const k of[-1,1])eSp(TO,sk,.15,.13,.16,k*.21,.37,-.03);
eTor(TO,rp,.29,.29,.12,0,-.05,.03).rotation.x=PI/2;eM(TO,rboxG(.22,.24,.02,.008),rg,0,-.18,.25,.15);eM(TO,rboxG(.24,.22,.02,.008),rg2,0,-.18,-.2,-.15);
for(let i=0;i<8;i++){const a=i*.8;eCnD(TO,hr,.04,.1,Math.sin(a)*.14,.47,-.05+Math.cos(a)*.08,Math.sin(a)*.3,1,-.3);}for(const k of[-1,1])eM(TO,rboxG(.035,.42,.02,.006),rg2,k*.13,.3,.215,-.25,0,k*.12);
const HD=piv(TO,'HD',0,.4,.2);eSp(HD,sk,.13,.12,.14,0,.04,.02);eM(HD,rboxG(.22,.05,.08,.02),sk2,0,.1,.09,.2);eSp(HD,sk2,.04,.05,.05,0,.04,.15);
for(const k of[-1,1]){eye(HD,k*.055,.072,.125,.02,0xd8c040);eCnD(HD,sk,.03,.08,k*.13,.08,0,k,.3,-.2);}for(let i=0;i<5;i++)eCnD(HD,hr,.03,.08,(i-2)*.04,.15,-.02,(i-2)*.2,1,-.4);
const JW=piv(HD,'JW',0,-.02,.04);eSp(JW,sk2,.12,.06,.12,0,-.03,.04);for(const k of[-1,1])eCnD(JW,bn,.016,.07,k*.07,.02,.12,k*.15,1,.1);
limb(TO,'S','E',0,-.3,.38,0,.3,.3,.075,.065,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eTor(k,rp,r*1.2,r*1.2,r*1.4,0,-l*.75,0).rotation.x=PI/2;});
limb(TO,'S','E',1,.3,.38,0,.3,.3,.075,.065,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);const G=new THREE.Group();G.position.set(0,-l-.06,.03);k.add(G);eM(G,capG(.035,.06,.62,8),0x5a3d22,0,0,-.08,-PI/2);
for(let i=0;i<4;i++){const a=i*1.7;eCnD(G,0x4a3018,.018,.06,Math.sin(a)*.05,Math.cos(a)*.05,.3+i*.07,Math.sin(a),Math.cos(a),.3);}eSp(G,0x5a3d22,.075,.075,.085,0,0,.5);});
for(const[n,x]of[[0,-.15],[1,.15]])limb(b,'H','K',n,x,.75,0,.38,.36,.1,.085,sk,sk2,(k,l)=>{eM(k,rboxG(.16,.07,.22,.03),sk2,0,-l-.01,.05);for(let i=-1;i<=1;i++)eCnD(k,bn,.014,.04,i*.045,-l-.02,.16,0,0,1);});
const BK=new THREE.Group();BK.position.set(0,.4,-.3);BK.rotation.x=-.25;TO.add(BK);eM(BK,lathG([[.15,-.15],[.19,0],[.2,.14]],12),matDS(bk),0,0,0);eSp(BK,bk2,.15,.03,.15,0,-.15,0);
for(const y of[-.08,.04,.14]){const r0=y<0?.17:y<.1?.195:.2;eTor(BK,bk2,r0,r0,.08,0,y,0).rotation.x=PI/2;}
for(const i of[0,1]){const x=i?.08:-.08,G=piv(BK,'G'+i,x,.13,i?-.03:.03);G.userData.p=[x,.13,i?-.03:.03];G.scale.setScalar(.8);eSp(G,0x71903c,.075,.06,.065,0,0,0);eSp(G,i?0x8e2a2a:0x6b4a2b,.08,.04,.07,0,-.03,0);
const H=new THREE.Group();H.position.set(0,.06,.02);G.add(H);gHead(H,i);eBone(G,0x71903c,.016,.02,.14,i?.07:-.07,.03,0,i?.6:-.6,1,.2);}}
else if(type=='ghost'){hy=1.2;const gc=0xa9bcc6,gc2=0x7f95a3,dk=0x141a1f,bo=0xd8d0bc,ch=0x5d6168;
// ghost: a hooded wraith in a tattered shroud floating above the ground (TO), a deep hood (HD) with a dark face and pale glowing eyes, bony hands reaching out (S/E),
// a broken shackle on one wrist and a fluttering hem (HM); faint glow (GL). It is see-through, and fades almost out while it is out of reach
const TO=piv(b,'TO',0,.38,0);eM(TO,lathG([[.06,.42],[.11,.4],[.15,.3],[.17,.15],[.2,0],[.24,-.15],[.26,-.2]],14),matDS(gc),0,0,0);
const HM=piv(TO,'HM',0,-.2,0);for(let i=0;i<12;i++){const a=i/12*2*PI;eCnD(HM,i%2?gc:gc2,.05,.12+(i%3)*.04,Math.sin(a)*.24,-.02,Math.cos(a)*.24,Math.sin(a)*.25,-1,Math.cos(a)*.25);}
const HD=piv(TO,'HD',0,.44,.02);eM(HD,domG(.14,.7),matDS(gc2),0,-.04,0);eSp(HD,dk,.085,.1,.03,0,.0,.115);eCnD(HD,gc2,.05,.12,0,.1,-.08,0,.5,-1);
for(const k of[-1,1])eye(HD,k*.032,.01,.13,.017,0xcff6ff,0x4ac0e0);
for(const n of[0,1])limb(TO,'S','E',n,n?.15:-.15,.3,.02,.14,.13,.035,.028,gc,gc,(k,l)=>{eCnD(k,gc2,.06,.09,0,-l*.75,0,0,-1,0);eSp(k,bo,.02,.025,.018,0,-l-.01,0);
for(let i=0;i<3;i++)eBone(k,bo,.004,.005,.06,(i-1)*.012,-l-.025,.005,(i-1)*.25,-1,.3,4);if(!n){eTor(k,ch,.034,.034,.03,0,-l*.85,0).rotation.x=PI/2;for(let i=0;i<3;i++)eTor(k,ch,.012,.018,.01,.02,-l*.85-.025-i*.024,0).rotation.y=i%2?PI/2:0;}});
glow(TO,0,.15,0,.8,0x4a90a8).name='GL';}
else if(type=='imp'){hy=.95;const sk=0x8a3424,sk2=0x6a2418,bl=0xb0603a,hn=0x2a1a14;
// fire imp: a small red devil with a pot belly, glowing ember cracks, curled horns, a flame crest (FL with glow GL), leathery wings (WI0/WI1), a spade-tipped tail (T0/T1) and a pitchfork
const TO=piv(b,'TO',0,.3,0);eSp(TO,sk,.1,.11,.09,0,.09,0);eSp(TO,bl,.075,.08,.05,0,.06,.05);for(let i=0;i<5;i++){const a=i*1.3;eSp(TO,0xff7a2a,.012,.03,.008,Math.sin(a)*.09,.05+i*.025,Math.cos(a)*.08,0xff5a00);}
const HD=piv(TO,'HD',0,.21,.03);eSp(HD,sk,.085,.08,.085,0,.04,0);eSp(HD,sk2,.05,.03,.05,0,0,.05);eM(HD,rboxG(.05,.008,.01,.002),0xf2ead2,0,.012,.098);
for(const k of[-1,1]){eye(HD,k*.035,.055,.072,.018,0xffd040,0xff8a00);eCnD(HD,hn,.018,.08,k*.05,.1,0,k*.5,1,-.2);eCnD(HD,hn,.01,.05,k*.085,.165,-.02,k*.2,.5,-.8);eCnD(HD,sk,.02,.06,k*.08,.05,-.01,k,.2,-.3);}
const FL=piv(HD,'FL',0,.1,-.03);for(let i=0;i<5;i++)eSp(FL,i%2?0xffd27a:0xffa040,.026,.06+(2-Math.abs(i-2))*.015,.026,(i-2)*.022,.03+(2-Math.abs(i-2))*.012,-Math.abs(i-2)*.01,0xff7a00);glow(FL,0,.05,0,.32,0xff8a30).name='GL';
for(const n of[0,1])limb(TO,'S','E',n,n?.1:-.1,.15,0,.08,.08,.022,.018,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);if(n){const G=new THREE.Group();G.position.set(0,-l-.02,.01);k.add(G);
eM(G,capG(.006,.006,.36,6),0x3a3a40,0,0,-.1,-PI/2);eM(G,rboxG(.06,.008,.008,.002),0x3a3a40,0,0,.26);for(let i=-1;i<=1;i++)eCnD(G,0x5d6168,.006,.04,i*.028,0,.28,0,0,1);}});
for(const[n,x]of[[0,-.045],[1,.045]])limb(b,'H','K',n,x,.3,0,.14,.14,.026,.02,sk,sk2,(k,l)=>{eCnD(k,hn,.02,.035,0,-l-.01,.01,0,-1,0);});
const T0=piv(TO,'T0',0,.02,-.08);eM(T0,capG(.012,.009,.16,6),sk,0,0,0,PI/2+.3);const T1=piv(T0,'T1',0,-.05,-.15);eM(T1,capG(.009,.006,.14,6),sk,0,0,0,PI/2+.6);
eM(T1,shpG('impsp',[[0,.035],[.03,0],[0,-.03],[-.03,0]],.006,.002),sk2,0,.08,-.12,-.6);
for(const k of[-1,1]){const W=piv(TO,k<0?'WI0':'WI1',k*.05,.17,-.07),m=eM(W,memG('impw',[[0,0],[.1,.07],[.17,.03],[.15,-.02],[.11,0],[.08,-.05],[.04,-.02]]),matDS(sk2),0,0,0);m.scale.x=k;
eBone(W,hn,.004,.006,.17,0,0,0,k*.95,.4,0,4);}}
else if(type=='king'){hy=1.45;sh=.32;b.scale.setScalar(1.6);const sk=0x71903c,sk2=0x5a7a2f,rb=0x7a2020,rb2=0x5a1414,er=0xe8e0d0,au=0xd9a93a;
// goblin king: a fat goblin in a red robe with an ermine collar and gold trim, a spiked, jewelled gold crown over his iron cap, a long cape (CP) and a gold sceptre with a ruby
const TO=piv(b,'TO',0,.34,0);eSp(TO,sk,.13,.14,.12,0,.1,.03);eM(TO,lathG([[0,-.02],[.12,0],[.145,.08],[.15,.16],[.125,.23],[.06,.27],[0,.275]],14),rb,0,0,-.01);
eTor(TO,gd,.135,.135,.1,0,0,-.01).rotation.x=PI/2;eM(TO,rboxG(.05,.04,.014,.006),gd,0,0,.14);eTor(TO,er,.11,.11,.16,0,.235,0).rotation.x=PI/2;
for(let i=0;i<8;i++){const a=i/8*2*PI;eSp(TO,0x1a1a1a,.008,.012,.006,Math.sin(a)*.12,.235,Math.cos(a)*.115);}for(let i=0;i<3;i++)eSp(TO,gd,.012,.012,.008,0,.06+i*.05,.14);
const CP=piv(TO,'CP',0,.25,-.08);eM(CP,eg('kcape',()=>new THREE.CylinderGeometry(.13,.22,.5,12,1,true,PI-.95,1.9)),matDS(rb2),0,-.25,.08);
const HD=piv(TO,'HD',0,.25,.05);gHead(HD,0);eTor(HD,au,.1,.1,.06,0,.14,-.01).rotation.x=PI/2;
for(let i=0;i<6;i++){const a=i/6*2*PI;eCnD(HD,au,.018,.07,Math.sin(a)*.1,.17,Math.cos(a)*.1-.01,Math.sin(a)*.2,1,Math.cos(a)*.2);eSp(HD,i%2?0xc03030:0x3060c0,.012,.012,.008,Math.sin(a)*.102,.14,Math.cos(a)*.102-.01);}
limb(TO,'S','E',0,-.14,.2,0,.11,.1,.034,.028,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,gd,r*1.3,.03,0,-l*.7,0);const G=new THREE.Group();G.position.set(0,-l-.02,.02);k.add(G);
eM(G,capG(.01,.01,.4,8),au,0,0,-.08,-PI/2);eSp(G,0xc03030,.035,.035,.035,0,0,.34,0x601010);for(let i=0;i<4;i++){const a=i/4*2*PI;eCnD(G,au,.008,.04,Math.sin(a)*.03,Math.cos(a)*.03,.33,Math.sin(a),Math.cos(a),.5);}});
limb(TO,'S','E',1,.14,.2,0,.11,.1,.034,.028,sk,sk,(k,l,r)=>{hand(k,l,sk2,r);eCy(k,gd,r*1.3,.03,0,-l*.7,0);});
eM(b,lathG([[.13,.36],[.15,.25],[.17,.12],[.19,.03]],14),matDS(rb),0,0,0);eTor(b,er,.19,.19,.08,0,.035,0).rotation.x=PI/2;
for(const[n,x]of[[0,-.055],[1,.055]])limb(b,'H','K',n,x,.34,0,.16,.16,.036,.028,rb2,sk2,(k,l)=>{eM(k,rboxG(.06,.036,.1,.012),0x3a2a1a,0,-l-.004,.025);});}
else if(type=='ram'){hy=1.35;sh=.55;const wd=0x7a5a34,wd3=0x5a3d22,hd=0x8a6a44,ir=0x4a4a52,sk=0x71903c;
// siege ram: a wheeled wooden shed (wheels WH0-3) with a hide-covered roof and a swinging, iron-banded log (RM) with a horned iron ram's head, pushed by two goblins at the back (legs H0-H3)
eM(b,rboxG(.5,.07,1.1,.02),wd3,0,.27,0);for(const x of[-.22,.22])for(const z of[-.45,.45])eCy(b,wd,.03,.42,x,.5,z);
for(const k of[-1,1]){eM(b,rboxG(.4,.025,1.12,.01),hd,k*.15,.78,0,0,0,-k*.72);for(let i=0;i<4;i++)eM(b,rboxG(.41,.012,.02,.004),wd3,k*.15+k*.01,.79,-.42+i*.28,0,0,-k*.72);}
eCy(b,wd3,.025,1.16,0,.92,0,PI/2);for(const z of[-.25,.35])eCy(b,ir,.008,.22,0,.64,z);
const RM=piv(b,'RM',0,.5,.05);eM(RM,capG(.07,.075,1.05,10),wd,0,0,-.45,-PI/2);for(let i=0;i<3;i++)eTor(RM,ir,.08,.08,.04,0,0,-.3+i*.35);
eSp(RM,ir,.1,.09,.12,0,0,.66);eSp(RM,ir,.06,.05,.07,0,-.02,.76);for(const k of[-1,1]){eTor(RM,0x6a6a72,.05,.05,.04,k*.08,.03,.64).rotation.y=PI/2;eye(RM,k*.05,.03,.73,.016,0xff6a3a,0x802010);}
for(const[i,x,z]of[[0,-.29,-.38],[1,.29,-.38],[2,-.29,.38],[3,.29,.38]]){const W=piv(b,'WH'+i,x,.18,z);eCy(W,wd3,.17,.05,0,0,0,0,0,PI/2);eTor(W,ir,.17,.17,.06,0,0,0).rotation.y=PI/2;eSp(W,ir,.04,.04,.04,x>0?.03:-.03,0,0);
for(let j=0;j<4;j++)eM(W,rboxG(.02,.3,.02,.005),wd,0,0,0,j*PI/4);}
for(const[i,x]of[[0,-.13],[1,.13]]){const P=new THREE.Group();P.position.set(x,0,-.68);P.rotation.x=.35;b.add(P);eSp(P,sk,.08,.09,.075,0,.42,.03);eM(P,lathG([[0,-.02],[.085,0],[.095,.08],[.08,.16],[0,.18]],12),rg,0,.36,.02);
const H=new THREE.Group();H.position.set(0,.6,.1);H.scale.setScalar(.85);P.add(H);gHead(H,i);for(const k of[-1,1])eBone(P,sk,.02,.022,.2,k*.08,.52,.06,k*.1,-.3,1);}
for(let n=0;n<4;n++)limb(b,'H','K',n,(n<2?-.13:.13)+(n%2?.04:-.04),.34,-.68,.16,.16,.03,.025,rg2,sk,(k,l)=>{eM(k,rboxG(.05,.03,.08,.01),rg2,0,-l,.02);});}
else if(type=='necro'){hy=1.95;sh=.34;const rb=0x2a1f30,rb2=0x3a2a44,bo=0xd8d0bc,gn=0x7dff6a;
// necromancer: a tall, gaunt figure in a dark ragged robe (TO, hem HM) with a hood over a bare skull and green eyes (HD), bony hands, a staff topped with a horned skull and a green flame (ST, glow GL), and green wisps circling it (OR)
const TO=piv(b,'TO',0,.5,0);eM(TO,lathG([[.05,.75],[.12,.7],[.17,.55],[.19,.3],[.22,0],[.27,-.3],[.3,-.45]],16),matDS(rb),0,0,0);eTor(TO,rb2,.15,.15,.1,0,.62,0).rotation.x=PI/2;
eTor(TO,0x5a4a3a,.2,.2,.08,0,.2,0).rotation.x=PI/2;for(let i=0;i<3;i++)eSp(TO,bo,.025,.026,.022,(i-1)*.08,.17,.2-Math.abs(i-1)*.02);
const HM=piv(TO,'HM',0,-.45,0);for(let i=0;i<14;i++){const a=i/14*2*PI;eCnD(HM,i%2?rb:rb2,.06,.1+(i%3)*.04,Math.sin(a)*.29,0,Math.cos(a)*.29,Math.sin(a)*.2,-1,Math.cos(a)*.2);}
const HD=piv(TO,'HD',0,.82,.03);eM(HD,domG(.15,.72),matDS(rb2),0,-.04,0);eCnD(HD,rb2,.06,.14,0,.12,-.09,0,.4,-1);eSp(HD,bo,.07,.08,.075,0,-.01,.06);eSp(HD,bo,.05,.03,.05,0,-.07,.08);
for(const k of[-1,1]){eSp(HD,0x0a0a0a,.02,.022,.012,k*.03,0,.125);eSp(HD,gn,.009,.009,.006,k*.03,0,.133,0x3fbf1f);}for(let i=0;i<4;i++)eM(HD,rboxG(.008,.014,.006,.002),bo,(i-1.5)*.014,-.075,.125);
for(const n of[0,1])limb(TO,'S','E',n,n?.17:-.17,.62,.02,.22,.2,.04,.032,rb,rb,(k,l)=>{eCnD(k,rb2,.07,.12,0,-l*.8,0,0,-1,0);eSp(k,bo,.025,.03,.022,0,-l-.01,0);for(let i=0;i<4;i++)eBone(k,bo,.004,.006,.08,(i-1.5)*.014,-l-.03,.005,(i-1.5)*.2,-1,.3,4);});
const ST=piv(b,'ST',.3,0,.18);eM(ST,capG(.014,.016,1.55,6),0x2a2018,0,1.55,0);eSp(ST,bo,.055,.06,.055,0,1.6,0);for(const k of[-1,1]){eCnD(ST,bo,.015,.08,k*.05,1.64,0,k,.6,0);eSp(ST,0x0a0a0a,.014,.016,.01,k*.02,1.61,.048);}
eSp(ST,gn,.04,.07,.04,0,1.72,0,0x3fbf1f);glow(ST,0,1.72,0,.45,0x5aff50).name='GL';
const OR=piv(TO,'OR',0,.35,0);for(let i=0;i<3;i++){const a=i/3*2*PI;eSp(OR,gn,.022,.022,.022,Math.sin(a)*.38,Math.sin(a*2)*.08,Math.cos(a)*.38,0x3fbf1f);}}
else if(type=='skel'){hy=.95;const bo=0xd8d0bc,bo2=0xb8ae96,cl=0x4a4636;
// skeleton: a raised goblin skeleton – skull with glowing green sockets and a clattering jaw (JW), ribcage, spine and pelvis, bony limbs, a torn loincloth and a rusty sword
const TO=piv(b,'TO',0,.36,0);eCy(TO,bo2,.012,.26,0,.13,-.02);for(let i=0;i<4;i++){const r0=.07-Math.abs(i-1.2)*.01;eTor(TO,bo,r0,r0*.8,.06,0,.1+i*.045,.01).rotation.x=PI/2;}
eTor(TO,bo2,.06,.05,.05,0,-.01,0).rotation.x=PI/2;eM(TO,rboxG(.1,.1,.01,.004),cl,0,-.06,.05,.1);for(const k of[-1,1])eSp(TO,bo,.035,.02,.03,k*.08,.24,0);
const HD=piv(TO,'HD',0,.28,.02);eSp(HD,bo,.07,.065,.075,0,.05,0);for(const k of[-1,1]){eSp(HD,0x101010,.018,.02,.012,k*.026,.055,.063);eSp(HD,0x7dff6a,.006,.006,.005,k*.026,.055,.07,0x3fbf1f);}
eSp(HD,0x101010,.008,.012,.006,0,.03,.072);for(let i=0;i<4;i++)eM(HD,rboxG(.008,.012,.006,.002),bo,(i-1.5)*.014,.012,.068);const JW=piv(HD,'JW',0,0,.02);eM(JW,rboxG(.07,.02,.06,.008),bo,0,-.01,.02);
for(const n of[0,1])limb(TO,'S','E',n,n?.09:-.09,.24,0,.12,.11,.012,.01,bo,bo,(k,l)=>{eSp(k,bo,.018,.014,.016,0,-l-.01,0);for(let i=0;i<3;i++)eBone(k,bo,.003,.004,.04,(i-1)*.008,-l-.02,0,(i-1)*.2,-1,.2,4);
if(n){const G=new THREE.Group();G.position.set(0,-l-.02,0);k.add(G);eCy(G,0x3a2a1a,.01,.06,0,0,0,PI/2);eM(G,rboxG(.08,.012,.014,.004),0x6a5a4a,0,0,.035);eM(G,shpG('ssword',[[-.014,0],[.014,0],[.012,.24],[0,.28],[-.012,.24]],.006,.002),0x8a6a4a,0,0,.04,PI/2);}});
for(const[n,x]of[[0,-.045],[1,.045]])limb(b,'H','K',n,x,.36,0,.17,.17,.014,.012,bo,bo,(k,l)=>{eM(k,rboxG(.035,.015,.07,.006),bo,0,-l-.005,.02);});}
else{hy=2.3;sh=.55;const rd=0x9e2f2a,dk=0x6e1d22,bl=0xd9b27c,bn=0xcfc2a0,me=0x7a2430,me2=0xa23a3a;
// dragon: scaled body with belly plates and a spiked back, a long neck (NK), horned head with brows, fangs and an opening jaw (JW), membrane wings with finger bones (W/WE/WH), clawed legs and a spiked tail (T0-T2)
const TO=piv(b,'TO',0,.9,0);eSp(TO,rd,.3,.28,.32,0,.02,.18);eSp(TO,rd,.3,.27,.34,0,0,-.08);eSp(TO,rd,.24,.22,.24,0,0,-.32);
for(let i=0;i<9;i++){const z=.4-i*.1,q=(z+.02)/.6,y=-.27*Math.sqrt(Math.max(0,1-q*q));eM(TO,rboxG(.25-Math.abs(i-3)*.018,.035,.09,.014),bl,0,y,z,-q*.8);}
for(let i=0;i<10;i++){const z=.44-i*.09,q=(z+.02)/.6,y=.27*Math.sqrt(Math.max(0,1-q*q));eCnD(TO,dk,.045-i*.002,.16-i*.006,0,y+.05,z,0,1,-.5);}
for(const k of[-1,1])eSp(TO,rd,.12,.14,.13,k*.17,-.08,.1);
const NK=piv(TO,'NK',0,.1,.4);eM(NK,capG(.11,.14,.32,12),rd,0,0,0,PI+.5);for(let i=0;i<4;i++){eCnD(NK,dk,.035,.11,0,.08+i*.07,-.07+i*.04+.06,0,1,-.4);eM(NK,rboxG(.12,.025,.07,.01),bl,0,.02+i*.07,.12+i*.035,-.4);}
const HD=piv(NK,'HD',0,.3,.2);eSp(HD,rd,.15,.12,.16,0,0,.03);eM(HD,rboxG(.16,.1,.22,.04),rd,0,-.02,.2);eM(HD,rboxG(.06,.03,.18,.012),dk,0,.035,.2);
for(const k of[-1,1]){eSp(HD,0x1b0f0f,.018,.014,.016,k*.04,.015,.31);eye(HD,k*.09,.05,.12,.032,0xffc830,0xff8a00);eM(HD,rboxG(.08,.03,.12,.012),dk,k*.085,.08,.1,.2,0,-k*.25);
horn(HD,bn,k*.07,.08,-.05,.04,.34,4,2.14,k*.4,.25,0);horn(HD,bn,k*.12,.02,0,.022,.14,3,0,k*(PI/2+.3),0,k*.2);
for(let i=0;i<3;i++)eCnD(HD,dk,.03,.14-i*.02,k*(.13+i*.01),.0-i*.04,-.06,k*.8,.1,-1);
for(let i=0;i<4;i++)eCnD(HD,0xf2ead2,.01,.04,k*.065,-.07,.14+i*.045,0,-1,0);}
const JW=piv(HD,'JW',0,-.075,.1);eM(JW,rboxG(.13,.04,.21,.015),dk,0,-.015,.1);eSp(JW,0xa23a3a,.04,.01,.1,0,.008,.08);for(let i=0;i<3;i++)for(const k of[-1,1])eCnD(JW,0xf2ead2,.01,.04,k*.045,.02,.05+i*.06,0,1,0);
for(let i=0;i<3;i++)eCnD(JW,dk,.015,.06,(i-1)*.04,-.04,.0,0,-1,-.6);
glow(HD,0,-.06,.24,.35,0xff6a00).name='GL';
const T0=piv(TO,'T0',0,-.05,-.4);eM(T0,capG(.11,.17,.44,12),rd,0,0,0,PI/2);const T1=piv(T0,'T1',0,0,-.42);eM(T1,capG(.07,.11,.4,12),rd,0,0,0,PI/2);
const T2=piv(T1,'T2',0,0,-.38);eM(T2,capG(.035,.07,.36,10),dk,0,0,0,PI/2);eM(T2,shpG('spade',[[0,0],[.12,-.1],[0,-.26],[-.12,-.1]],.02,.006),dk,0,0,-.36,-PI/2);
for(const[T,n,r0]of[[T0,4,.17],[T1,4,.11],[T2,3,.07]])for(let i=0;i<n;i++)eCnD(T,dk,.03*r0/.17+.01,.1*r0/.17+.03,0,r0*(1-i/(n+1))+.02,-.05-i*.1,0,1,-.6);
for(const k of[1,-1]){const i=k>0?0:1,S=piv(TO,'W'+i,k*.22,.2,.05),E=piv(S,'WE'+i,k*.4,0,0),Hh=piv(E,'WH'+i,k*.44,0,0),mm=c=>{const m=c;m.scale.x=k;return m;};
eBone(S,dk,.035,.05,.42,0,0,0,k,0,0,10);eBone(E,dk,.025,.035,.46,0,0,0,k,0,0,10);eCnD(E,bn,.02,.08,k*.02,.03,.02,k*.3,.4,1);eSp(Hh,dk,.04,.04,.04,0,0,0);
mm(eM(S,memG('w1',[[0,.02],[.42,0],[.4,-.3],[.28,-.27],[.16,-.36],[0,-.25]]),matDS(me),0,-.005,0,PI/2));
mm(eM(E,memG('w2',[[0,0],[.44,0],[.42,-.34],[.3,-.3],[.18,-.4],[0,-.3]]),matDS(me2),0,-.005,0,PI/2));
const F=[[.55,.45],[.5,.9],[.42,1.35]];F.forEach(([L,a])=>{eBone(Hh,dk,.012,.024,L,0,0,0,k*Math.cos(a),0,-Math.sin(a),8);eCnD(Hh,bn,.012,.05,k*Math.cos(a)*L,0,-Math.sin(a)*L,k*Math.cos(a),0,-Math.sin(a));});
const tp=F.map(([L,a])=>[Math.cos(a)*L,-Math.sin(a)*L]),mid=(p,q)=>[(p[0]+q[0])*.38,(p[1]+q[1])*.38];
mm(eM(Hh,memG('w3',[[0,.02],tp[0],mid(tp[0],tp[1]),tp[1],mid(tp[1],tp[2]),tp[2],[-.03,-.34]]),matDS(me),0,-.005,0,PI/2));
for(let j=0;j<4;j++){eBone(S,dk,.006,.008,.3,k*(.08+j*.1),-.008,-.02,0,0,-1,5);eBone(E,dk,.006,.008,.32,k*(.1+j*.11),-.008,-.02,0,0,-1,5);}}
for(const[n,x]of[[0,-.15],[1,.15]])limb(TO,'H','K',n,x,-.18,.12,.2,.2,.06,.045,rd,rd,(k,l,r,u)=>{eSp(u,rd,.09,.13,.11,0,-.05,0);eM(k,rboxG(.1,.04,.16,.015),dk,0,-l-.01,.05);
for(const c of[-1,0,1])eCnD(k,bn,.014,.07,c*.03,-l-.01,.14,c*.2,-.3,1);eCnD(k,bn,.012,.05,0,-l,-.04,0,-.3,-1);});}
const gs=[];b.traverse(o=>{if(o.isGroup&&o.userData.keep)gs.push(o);});bakeE(b);gs.forEach(bakeE);
blob(g,sh*1.8);const sz=type=='boss'?1.9:type=='tank'?1.5:1,ice=part(g,'tor',0x66e0ff,.3*sz,.3*sz,.3*sz,0,.05,0,0x1aa8c8);ice.name='ice';ice.userData.keep=true;ice.rotation.x=PI/2;ice.visible=false;ice.castShadow=false;
const bg=L1(new THREE.Sprite(SB)),fg=L1(new THREE.Sprite(SF));bg.scale.set(.56,.1,1);bg.position.y=hy;bg.renderOrder=10;fg.name='bar';fg.center.set(.5,.5);fg.position.set(0,hy,0);fg.scale.set(.52,.07,1);fg.renderOrder=11;g.add(bg,fg);return g;}
const tpl={};
// goblins come in two looks (v); each look's template is built once and cloned
function buildEnemy(type){const v=type=='norm'&&Math.random()<.5?1:0,key=type+v;if(!tpl[key])tpl[key]=makeEnemy(type,v);const g=tpl[key].clone(true),b=g.getObjectByName('body'),ice=g.getObjectByName('ice'),bar=g.getObjectByName('bar'),meshes=[],rig={};bar.material=SF.clone();sc.add(g);
g.traverse(o=>{if(o.isMesh&&o!==ice){o.userData.m0=o.material;meshes.push(o);}});b.traverse(n=>{if(n.name)rig[n.name]=n;});// a Ghost gets its own see-through copies of its materials (gm) so it can fade without touching the shared enemy materials
let gm=null;if(type=='ghost'){gm=[];b.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.72;o.material.depthWrite=false;o.castShadow=false;gm.push(o.material);}});}
return{m:g,body:b,ice,bar,meshes,rig,gm};}
// portrait of an enemy type for the new-enemy card and the bestiary: its template rendered by the main renderer into a small sRGB render target
// (own lights, transparent background, turned three-quarters), read back into a PNG data URL and cached in PORT
const PORT={};let PRT=null;
function portrait(type){if(PORT[type])return PORT[type];const S=192;
if(!PRT){PRT={rt:new THREE.WebGLRenderTarget(S,S,{encoding:THREE.sRGBEncoding}),sc:new THREE.Scene(),cam:new THREE.PerspectiveCamera(28,1,.05,60),cv:document.createElement('canvas'),px:new Uint8Array(S*S*4)};
PRT.sc.environment=sc.environment;PRT.sc.add(new THREE.HemisphereLight(0xfff2dd,0x4a3c28,1));const d=new THREE.DirectionalLight(0xfff0d8,2.4);d.position.set(2,4,3);PRT.sc.add(d);
PRT.cam.layers.enableAll();PRT.cv.width=PRT.cv.height=S;}
const key=type+'0';if(!tpl[key])tpl[key]=makeEnemy(type,0);const o=tpl[key].clone(true),b=o.getObjectByName('body');
o.traverse(c=>{if((c.isSprite&&!c.material.map)||c.name=='ice'||c.material===BLM)c.visible=false;});b.rotation.y=.55;PRT.sc.add(o);o.updateMatrixWorld(true);
const bb=new THREE.Box3();b.traverse(c=>{if(c.isMesh&&c.visible)bb.expandByObject(c);});const ct=bb.getCenter(new THREE.Vector3()),sz=bb.getSize(new THREE.Vector3()),h=Math.max(sz.y,sz.x,sz.z)*.52;
PRT.cam.position.copy(ct).add(new THREE.Vector3(0,.3,1).normalize().multiplyScalar(h/Math.tan(14*PI/180)));PRT.cam.lookAt(ct);
const cc=R.getClearColor(new THREE.Color()),ca=R.getClearAlpha(),tm=R.toneMappingExposure;R.setClearColor(0,0);R.toneMappingExposure=1;R.setRenderTarget(PRT.rt);R.clear();R.render(PRT.sc,PRT.cam);
R.readRenderTargetPixels(PRT.rt,0,0,S,S,PRT.px);R.setRenderTarget(null);R.setClearColor(cc,ca);R.toneMappingExposure=tm;PRT.sc.remove(o);
const q=PRT.cv.getContext('2d'),im=q.createImageData(S,S);for(let y=0;y<S;y++)im.data.set(PRT.px.subarray((S-1-y)*S*4,(S-y)*S*4),y*S*4);q.putImageData(im,0,0);return PORT[type]=PRT.cv.toDataURL();}
const BR={norm:[.4,.22],fast:[.4,.3],tank:[.6,.3],boss:[1.0,.55],guard:[.45,.26],shaman:[.4,.22],bat:[1.05,.28],sapper:[.4,.22],troll:[.9,.42],ghost:[.6,.26],imp:[.3,.18],king:[.65,.3],ram:[.6,.5],necro:[.9,.32],skel:[.4,.15]},HT={norm:.8,fast:1.05,tank:1.4,boss:2.3,guard:.95,shaman:.9,bat:1.3,sapper:1,troll:1.6,ghost:1,imp:.75,king:1.45,ram:1.1,necro:1.9,skel:.8},UPV=new THREE.Vector3(0,1,0);
const ICEM=new THREE.MeshStandardMaterial({color:new THREE.Color(0x9fe8ff).convertSRGBToLinear(),transparent:true,opacity:.3,roughness:.08,metalness:.1,envMapIntensity:1.6,depthWrite:false}),
ICEM2=new THREE.MeshStandardMaterial({color:new THREE.Color(0xbfefff).convertSRGBToLinear(),transparent:true,opacity:.75,roughness:.1,envMapIntensity:1.6,emissive:new THREE.Color(0x2a9fe0).convertSRGBToLinear(),emissiveIntensity:.35}),
BUBM=new THREE.MeshBasicMaterial({color:new THREE.Color(0x7cff4a).convertSRGBToLinear(),transparent:true,opacity:.55,depthWrite:false}),
STARM=new THREE.MeshStandardMaterial({color:new THREE.Color(0xffd24a).convertSRGBToLinear(),emissive:new THREE.Color(0xffa000).convertSRGBToLinear(),emissiveIntensity:.8,metalness:.6,roughness:.3});
function bub(x,y,yy){const m=L1(new THREE.Mesh(geo('sph'),BUBM));m.position.set(wx(x)+rnd(-.12,.12),yy,wz(y)+rnd(-.12,.12));sc.add(m);pts.push({m,vx:rnd(-.1,.1),vz:rnd(-.1,.1),vy:rnd(.6,1.1),g:-.3,t:0,d:rnd(.7,1.1),s:rnd(.035,.07)});}
function stick(e,dx,dy,big){if(!e.stuck)e.stuck=[];const len=Math.hypot(dx,dy)||1,ux=dx/len,uz=dy/len,cv=Math.cos(e.vis),sv=Math.sin(e.vis),lx=ux*cv-uz*sv,lz=ux*sv+uz*cv,R0=BR[e.type][1]*.85,
yr={norm:[.22,.5],fast:[.28,.5],tank:[.3,.8],boss:[.75,1.1],guard:[.25,.55],shaman:[.22,.45],bat:[.98,1.12],sapper:[.22,.45],troll:[.6,1.15],ghost:[.4,.75],imp:[.18,.38],king:[.35,.8],ram:[.4,.9],necro:[.5,1.2],skel:[.2,.5]}[e.type],yy=rnd(yr[0],yr[1]),k=big?2:1,L=big?.5:.22,a=new THREE.Group();
part(a,'box',P.wd2,.016*k,.016*k,L,0,0,-L/2);part(a,'box',P.rd,.05*k,.012,.06,0,0,-L*.9);part(a,'box',P.rd,.012,.05*k,.06,0,0,-L*.9);part(a,'cone',0xdfe6ee,.02*k,.04,.02*k,0,0,.01).rotation.x=PI/2;
a.position.set(-lx*R0+rnd(-.03,.03),yy,-lz*R0+rnd(-.03,.03));a.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(lx,rnd(-.15,.15),lz).normalize());
e.body.add(a);e.stuck.push({a,t:0,sc:e.type=='boss'?1.8:1});if(e.stuck.length>7){const o=e.stuck.shift();e.body.remove(o.a);}}
// hit feedback; damage numbers are grey when the enemy resisted part of the hit (or a Shieldbearer's shield blocked it: sparks and a clang), pale gold when the Ballista pierced its armour
function hf(o,h,d,kind,dx,dy,br){const bl=shBlk(o,kind,dx||0,dy||0)<1;snd(bl?'block':'h_'+kind);if(bl){o.sbk=1;burst(o.x,o.y,0xffe6a0,5,1,.45);}o.hit=h;o.kb=kind=='ballista'?.3:.1;o.lk=kind;
if(d>0&&txts.length<40){const rs=o.rs[T[kind].dt]||0;popText(o.x+rnd(-8,8),o.y+rnd(-8,8),String(Math.round(d)),dmul(o,kind,br)<1||bl?'#a9a9a9':rs>0?'#ffe08a':'#ff8a7a');const q=txts[txts.length-1];q.k=.6;q.s.position.y=TXY[o.type];}
burst(o.x,o.y,{norm:0x8fd957,fast:0xb03a2e,tank:0xffd24a,boss:0xff8a3a,guard:0x8fd957,shaman:0x8fd957,bat:0x8e2a2a,sapper:0x8fd957,troll:0x6b7a52,ghost:0xcfe6ee,imp:0xff7a2a,king:0x8fd957,ram:0x8a6a44,necro:0x3a2a44,skel:0xd8d0bc}[o.type],o.type=='tank'?5:3,.8,.5);
if((kind=='arrow'||kind=='ballista')&&!o.phz)stick(o,dx||0,dy||1,kind=='ballista');else if(kind=='cannon')o.stn=1;else if(kind=='storm')o.shk=2.8;}
const TXY={norm:1,fast:1.15,tank:1.4,boss:2.3,guard:1.1,shaman:1.15,bat:1.55,sapper:1.15,troll:1.9,ghost:1.25,imp:.95,king:1.6,ram:1.4,necro:2.1,skel:1};
// Shaman heal (heal() in js/09-game.js): without a it's the pulse – a green ring on the ground as wide as its reach, and the staff flares (e.cst); with a, enemy e was healed by a
function healFx(e,a){if(a===undefined){e.cst=1;snd('heal');fx(e.x,e.y,0xb8ff9a,.2,HEAL.r/60,.7,.22,true);fx(e.x,e.y,0x7dff6a,.15,HEAL.r/60*.9,.6,.3);burst(e.x,e.y,0x9cff6a,8,.9,.9);return;}
fx(e.x,e.y,0x9cff6a,.1,.45,.4,.05,true);burst(e.x,e.y,0x9cff6a,4,.6,.5);if(a>=1&&txts.length<40){popText(e.x+rnd(-8,8),e.y+rnd(-8,8),'+'+Math.round(a),'#8dff7a');const q=txts[txts.length-1];q.k=.6;q.s.position.y=TXY[e.type];}}
// Sapper: the bomb goes off beside tower t (the stars and smoke while it is stunned are drawn in sync())
function sapFx(e,t){snd('boom');const y=t.head.position.y*.6;fx(t.x,t.y,0xffb060,.2,1.1,.4,y);fx(e.x,e.y,0xffffff,.1,1.3,.45,.08,true);burst(t.x,t.y,0xff8a3a,18,1.8,y);burst(t.x,t.y,0x3a3a3a,12,1.2,y+.2);
for(let i=0;i<4;i++)fx(t.x+rnd(-15,15),t.y+rnd(-15,15),0x4a4a4a,.15,.6,1.1,y+rnd(0,.5));}
// Ghost: a puff of mist and a whoosh as it fades out of reach (e.out) or back in; the fading itself is in animEnemy()
function phzFx(e){snd('phase');burst(e.x,e.y,0xcfe6ee,e.out?10:6,.8,.6);fx(e.x,e.y,0xcfe6ee,.1,.7,.5,.6);}
// Goblin King summons (summon() in js/09-game.js): a fanfare, a gold flash and he lifts his sceptre (e.cst)
function kingFx(e){e.cst=1;snd('summon');fx(e.x,e.y,0xffd24a,.2,1.3,.5,.06,true);burst(e.x,e.y,0xffd24a,14,1.2,1.2);}
// Necromancer raises skeleton o (raise()): a green flash where it climbs out and a green spark trail back to the Necromancer, who lifts its arm (e.cst)
function raiseFx(e,o){e.cst=1;snd('raise');fx(o.x,o.y,0x7dff6a,.1,.8,.6,.05,true);burst(o.x,o.y,0x3a2a44,10,1,.2);burst(o.x,o.y,0x9cff6a,8,1.2,.4);
for(let i=1;i<6;i++){const k=i/6;burst(e.x+(o.x-e.x)*k,e.y+(o.y-e.y)*k,0x9cff6a,1,.3,1.2-.8*k);}}
// Troll: its basket breaks open as the goblins jump out
function trollFx(e){snd('h_cannon');burst(e.x,e.y,0x8a6a3a,12,1.3,1.1);burst(e.x,e.y,0x71903c,6,1.6,1.1);}
function tfx(t){snd('f_'+t.k);const c={arrow:0xdcc9a0,cannon:0xcfc2a0,frost:0x9ff7ff,ballista:0xe8e0c8,storm:0x7fd8ff,alch:0x7cff4a}[t.k];if(!c)return;burst(t.x,t.y,c,t.k=='cannon'?7:t.k=='arrow'?2:5,t.k=='storm'?1.2:.8,t.head.position.y+.1);if(t.k=='cannon')fx(t.x,t.y,0xcfc2a0,.2,.7,.35,.3);}
function killFx(e){snd('die_'+e.type);e.dt=0;e.dk=e.lk;e.fd=Math.random()<.5?-1:1;e.bx=e.m.position.x;e.bz=e.m.position.z;e.ice.visible=false;e.m.children.forEach(c=>{if(c.isSprite)c.visible=false;});
if(e.shG)e.shG.visible=false;if(e.stG)e.stG.visible=false;if(e.fzG&&e.dk!='frost')e.fzG.visible=false;g.dying.push(e);const dk=e.dk;
if(dk=='frost')burst(e.x,e.y,0x9ff7ff,22,1.8,.5);else if(dk=='storm')burst(e.x,e.y,0x7fd8ff,16,1.6,.5);else if(dk=='alch')burst(e.x,e.y,0x7cff4a,18,1.2,.4);else if(dk=='cannon')burst(e.x,e.y,0xcfc2a0,16,1.8,.3);
if(e.bs){burst(e.x,e.y,0xff8c3a,26,2,.6);fx(e.x,e.y,0xffc060,.3,2.2,.6,.4);}
// a killed Sapper's bomb just fizzles out; a Troll's goblins leave the basket (trollSplit() spawns them)
if(e.rig.BM){e.rig.BM.visible=false;burst(e.x,e.y,0xffa040,8,1.1,.9);fx(e.x,e.y,0x555555,.1,.5,.6,.9);}for(const n of['G0','G1'])if(e.rig[n])e.rig[n].visible=false;}
function fxStatus(e,dt){const by=BR[e.type][0],br=BR[e.type][1],ty=HT[e.type];
if(e.stuck)for(let i=e.stuck.length-1;i>=0;i--){const o=e.stuck[i];o.t+=dt;const k=o.t<.15?1+Math.sin(o.t*80)*.12*(1-o.t/.15):o.t>4.5?Math.max(.01,1-(o.t-4.5)*2):1;o.a.scale.setScalar(k*o.sc);if(o.t>5){e.body.remove(o.a);e.stuck.splice(i,1);}}
if(e.fz>0){e.fz-=dt;if(!e.fzG){const gq=new THREE.Group(),sh=new THREE.Mesh(geo('sph'),ICEM);sh.scale.set(br*1.15,e.type=='boss'?.7:br*1.3,br*1.15);gq.add(sh);
for(let i=0;i<7;i++){const a=i*2.4,sp=new THREE.Mesh(geo('oct'),ICEM2),rr=br*1.1;sp.scale.set(.04,rnd(.08,.16)*(e.type=='boss'?2:1),.04);sp.position.set(Math.sin(a)*rr,rnd(-.2,.25),Math.cos(a)*rr);sp.rotation.set(rnd(-.6,.6),0,rnd(-.6,.6));gq.add(sp);}
gq.position.y=by;e.m.add(gq);e.fzG=gq;}
e.fzG.visible=true;e.fzG.scale.setScalar(clamp(e.fz/.3,0,1)*clamp((2.3-e.fz)/.15,0,1));if(Math.random()<dt*8)burst(e.x,e.y,0xbfefff,1,.4,by+rnd(-.2,.4));}else if(e.fzG)e.fzG.visible=false;
if(e.shk>0){e.shk-=dt;if(!e.shG){const gq=new THREE.Group();gq.userData.segs=[];for(let i=0;i<9;i++){const m=L1(new THREE.Mesh(geo('cyl'),bm(0x8fd6ff)));gq.add(m);gq.userData.segs.push(m);}e.shG=gq;e.m.add(gq);e.sht=0;}
e.shG.visible=true;e.sht-=dt;if(e.sht<=0){e.sht=.07;const segs=e.shG.userData.segs;for(let a=0;a<3;a++){const ps=[];for(let i=0;i<4;i++){const an=rnd(0,PI*2),el=rnd(-1,1),sq=Math.sqrt(1-el*el);ps.push(new THREE.Vector3(Math.cos(an)*sq*br*1.1,by+el*br*1.3,Math.sin(an)*sq*br*1.1));}
for(let i=0;i<3;i++){const m=segs[a*3+i],d=ps[i+1].clone().sub(ps[i]),L=d.length();m.position.copy(ps[i]).add(ps[i+1]).multiplyScalar(.5);m.quaternion.setFromUnitVectors(UPV,d.normalize());m.scale.set(.012,L,.012);}}}
e.body.position.x=rnd(-.012,.012);e.body.position.z=rnd(-.012,.012);if(Math.random()<dt*10)burst(e.x,e.y,0x7fd8ff,1,.5,by+rnd(-.2,.3));}
else if(e.shG&&e.shG.visible){e.shG.visible=false;e.body.position.set(0,0,0);}
if(e.pt>0&&Math.random()<dt*9)bub(e.x,e.y,by+rnd(-.15,.35));
if(e.stn>0){e.stn-=dt;if(!e.stG){const gq=new THREE.Group();for(let i=0;i<3;i++){const m=new THREE.Mesh(geo('oct'),STARM);m.scale.set(.05,.07,.05);gq.add(m);}e.stG=gq;e.m.add(gq);}
e.stG.visible=true;e.stG.children.forEach((m,i)=>{const a=tt*6+i*2.1;m.position.set(Math.cos(a)*br*.9,ty+.1+Math.sin(a*2)*.03,Math.sin(a)*br*.9);m.rotation.y=a*2;});e.body.rotation.z+=Math.sin(tt*14)*.1*Math.min(1,e.stn);}
else if(e.stG)e.stG.visible=false;}
function animEnemy(e,dt){const r=e.rig,t=tt+e.ph,boss=e.type=='boss',mv=Math.hypot(e.x-e.px,e.y-e.py);e.px=e.x;e.py=e.y;e.gp+=mv*e.k;
e.vis=lerpA(e.vis,e.dir,1-Math.exp(-dt*9));const turn=clamp(Math.atan2(Math.sin(e.dir-e.vis),Math.cos(e.dir-e.vis)),-1,1);
e.age+=dt;const pop=e.age<.35?back(e.age/.35):1;e.hit=Math.max(0,e.hit-dt);const q=e.hit*4;
e.m.position.set(wx(e.x),boss?.3+Math.sin(tt*1.6+e.ph)*.07:0,wz(e.y));e.m.scale.set(pop*(1+q*.06),pop*(1-q*.08),pop*(1+q*.06));e.kb=(e.kb||0)*Math.exp(-dt*12);e.fcd=Math.max(0,(e.fcd||0)-dt);e.m.position.x-=Math.sin(e.vis)*e.kb;e.m.position.z-=Math.cos(e.vis)*e.kb;e.body.rotation.y=e.vis;e.body.rotation.z=-turn*(boss?.35:.2);
const s=Math.sin(e.gp),c=Math.cos(e.gp),ro=(n,x,y,z)=>{const o=r[n];if(o){if(x!==undefined)o.rotation.x=x;if(y!==undefined)o.rotation.y=y;if(z!==undefined)o.rotation.z=z;}};
if(e.type=='norm'){ro('H0',-s*.7);ro('K0',Math.max(0,c)*.9);ro('H1',s*.7);ro('K1',Math.max(0,-c)*.9);ro('S0',s*.55);ro('E0',-.5-Math.max(0,-c)*.3);ro('S1',-s*.45-.35+Math.sin(t*2.6)*.08);ro('E1',-.9);
ro('TO',.25+s*.03-q*.3,c*.12);r.TO.position.y=.34+Math.cos(2*e.gp)*.012;ro('HD',-.22-s*.03-q*.3,Math.sin(t*.9)*.15-c*.08);ro('R0',0,0,.15+Math.abs(s)*.25);ro('R1',0,0,-.15-Math.abs(s)*.25);}
else if(e.type=='fast'){const f=e.gp;ro('H0',-Math.sin(f)*.9);ro('K0',Math.max(0,Math.cos(f))*1.1);ro('H1',-Math.sin(f+.4)*.9);ro('K1',Math.max(0,Math.cos(f+.4))*1.1);ro('H2',-Math.sin(f+2.4)*.9);ro('K2',Math.max(0,Math.cos(f+2.4))*1.1);ro('H3',-Math.sin(f+2.8)*.9);ro('K3',Math.max(0,Math.cos(f+2.8))*1.1);
ro('TO',Math.sin(f+.6)*.07-q*.25);r.TO.position.y=.38+Math.abs(Math.cos(f+.3))*.045;ro('HD',-Math.sin(f+.6)*.07+Math.sin(f*2)*.03-q*.3,Math.sin(t*1.2)*.1);
ro('T0',.15,Math.sin(f+t*1.5)*.35);ro('T1',0,Math.sin(f+t*1.5-.9)*.4);ro('RD',-Math.sin(f+.6)*.05,0,Math.sin(f)*.07);ro('SP',.1+Math.sin(t*2)*.05);}
else if(e.type=='tank'){const sw=Math.pow(Math.max(0,Math.sin(tt*.8+e.ph)),8);ro('H0',-s*.45);ro('K0',Math.max(0,c)*.7);ro('H1',s*.45);ro('K1',Math.max(0,-c)*.7);
ro('S0',-s*.25-.3-sw*1.3);ro('E0',-.8+Math.sin(t*1.1)*.05-sw*.3);ro('S1',s*.15-.4);ro('E1',-1);ro('TO',-q*.25,c*.08,s*.05);r.TO.position.y=.46+Math.abs(s)*.02;
ro('HD',-.05-q*.25,Math.sin(t*.8)*.12-c*.05);ro('CP',.1+Math.abs(s)*.12+Math.sin(t*3)*.03);ro('PL',-.5+Math.sin(t*4)*.12);}
else if(e.type=='guard'){e.sbk=Math.max(0,(e.sbk||0)-dt*4);ro('H0',-s*.55);ro('K0',Math.max(0,c)*.8);ro('H1',s*.55);ro('K1',Math.max(0,-c)*.8);ro('S0',-1.15+s*.04);ro('E0',-.5);ro('S1',-.5-s*.2);ro('E1',-.7);
ro('TO',.1+s*.02-q*.25,c*.06);r.TO.position.y=.34+Math.cos(2*e.gp)*.01;ro('HD',-.05-q*.3,Math.sin(t*.9)*.15);ro('R0',0,0,.15+Math.abs(s)*.2);ro('R1',0,0,-.15-Math.abs(s)*.2);
r.SH.position.z=.2-e.sbk*.06;ro('SH',-e.sbk*.15,c*.04);}
else if(e.type=='shaman'){e.cst=Math.max(0,(e.cst||0)-dt*1.5);const cs=e.cst;ro('H0',-s*.6);ro('K0',Math.max(0,c)*.8);ro('H1',s*.6);ro('K1',Math.max(0,-c)*.8);
ro('S0',-.5-cs*1.4+Math.sin(t*2.2)*.15,0,-.2-cs*.3);ro('E0',-.6-cs*.4);ro('S1',-.75+s*.05,0,.25);ro('E1',-.45);ro('ST',.08+cs*.3,0,-.05);
ro('TO',.35+s*.03-q*.3-cs*.25,c*.1);r.TO.position.y=.34+Math.cos(2*e.gp)*.012;ro('HD',-.3-s*.03-q*.3+cs*.4,Math.sin(t*.9)*.2);ro('R0',0,0,.15+Math.abs(s)*.25);ro('R1',0,0,-.15-Math.abs(s)*.25);
if(r.GL)r.GL.scale.setScalar(.28+cs*.6+Math.sin(tt*5+e.ph)*.03);}
else if(e.type=='sapper'){const ch=e.tw2?1:0;ro('H0',-s*.8);ro('K0',Math.max(0,c));ro('H1',s*.8);ro('K1',Math.max(0,-c));ro('S0',-2.75+s*.06,0,.12);ro('E0',-.35);ro('S1',-2.75-s*.06,0,-.12);ro('E1',-.35);
ro('TO',.2+ch*.25+s*.03-q*.3,c*.1);r.TO.position.y=.34+Math.cos(2*e.gp)*.015;ro('HD',-.1-ch*.2-q*.3,Math.sin(t*1.3)*.15);ro('R0',0,0,.15+Math.abs(s)*.3);ro('R1',0,0,-.15-Math.abs(s)*.3);
ro('BM',Math.sin(e.gp*2)*.06,0,Math.sin(e.gp)*.08);if(r.GL&&dt>0)r.GL.scale.setScalar((ch?.34:.22)*(.75+Math.random()*.5));if(dt>0&&Math.random()<dt*(ch?16:5))burst(e.x,e.y,0xffc060,1,.35,1);}
else if(e.type=='troll'){ro('H0',-s*.4);ro('K0',Math.max(0,c)*.6);ro('H1',s*.4);ro('K1',Math.max(0,-c)*.6);ro('S0',s*.35-.1,0,-.15);ro('E0',-.35-Math.max(0,s)*.2);ro('S1',-s*.3-.35,0,.1);ro('E1',-.7);
ro('TO',.32-q*.2,c*.08,s*.05);r.TO.position.y=.75+Math.abs(s)*.03;ro('HD',-.25-q*.25,Math.sin(t*.7)*.2);ro('JW',.08+Math.sin(t*1.3)*.05);
for(let i=0;i<2;i++){const G=r['G'+i];if(G){G.position.y=G.userData.p[1]+Math.abs(Math.sin(e.gp+i*1.5))*.03;G.rotation.y=Math.sin(t*1.1+i*2)*.4;}}}
else if(e.type=='ghost'){r.TO.position.y=.38+Math.sin(tt*2+e.ph)*.06;ro('TO',.1+Math.sin(t*1.3)*.05-q*.3,0,Math.sin(t*.9)*.05);ro('HD',-.1+Math.sin(t*.8)*.08,Math.sin(t*.6)*.3);
ro('S0',-1.2+Math.sin(t*1.7)*.15,0,.1);ro('E0',-.3);ro('S1',-1.1+Math.sin(t*1.7+1)*.15,0,-.1);ro('E1',-.4);ro('HM',Math.sin(t*2.4)*.08,t*.6,Math.cos(t*2)*.08);
const op=e.out?.12:.72;e.gop=e.gop===undefined?op:e.gop+(op-e.gop)*Math.min(1,dt*12);if(e.gm)for(const m of e.gm)m.opacity=e.gop;if(r.GL)r.GL.scale.setScalar(.8*e.gop/.72);}
else if(e.type=='imp'){ro('H0',-s*.8);ro('K0',Math.max(0,c));ro('H1',s*.8);ro('K1',Math.max(0,-c));ro('S0',s*.6-.2);ro('E0',-.6);ro('S1',-s*.3-.5);ro('E1',-.9);
ro('TO',.15+s*.04-q*.3,c*.1);r.TO.position.y=.3+Math.abs(Math.cos(e.gp))*.03;ro('HD',-.1-q*.3,Math.sin(t*1.5)*.2);ro('T0',.2+Math.sin(t*3)*.2,Math.sin(t*2.2)*.5);ro('T1',Math.sin(t*3-.8)*.25,Math.sin(t*2.2-.8)*.5);
const fw=.3+Math.sin(tt*14+e.ph)*.45;ro('WI0',0,fw);ro('WI1',0,-fw);if(r.FL)r.FL.scale.set(1,1+Math.sin(tt*17+e.ph)*.15,1);if(r.GL&&dt>0)r.GL.scale.setScalar(.32*(.85+Math.random()*.3));if(dt>0&&Math.random()<dt*4)burst(e.x,e.y,0xffa040,1,.3,.55);}
else if(e.type=='king'){e.cst=Math.max(0,(e.cst||0)-dt*1.2);const cs=e.cst;ro('H0',-s*.5);ro('K0',Math.max(0,c)*.7);ro('H1',s*.5);ro('K1',Math.max(0,-c)*.7);ro('S0',-.6-cs*1.6+s*.1,0,-.15);ro('E0',-.5+cs*.3);ro('S1',-s*.3-.1);ro('E1',-.5);
ro('TO',.08+s*.02-q*.25,c*.1,s*.06);r.TO.position.y=.34+Math.abs(s)*.015;ro('HD',-.05-q*.3+cs*.2,Math.sin(t*.8)*.25);ro('R0',0,0,.15+Math.abs(s)*.2);ro('R1',0,0,-.15-Math.abs(s)*.2);ro('CP',.1+Math.abs(s)*.1+Math.sin(t*3)*.03);}
else if(e.type=='ram'){for(let i=0;i<4;i++){ro('WH'+i,e.gp);ro('H'+i,(i%2?s:-s)*.6-.3);ro('K'+i,Math.max(0,i%2?-c:c)*.8+.2);}r.RM.position.z=.05+Math.sin(t*1.3)*.04;ro('RM',Math.sin(t*1.3)*.03-q*.1);}
else if(e.type=='necro'){e.cst=Math.max(0,(e.cst||0)-dt*1.2);const cs=e.cst;r.TO.position.y=.5+Math.sin(tt*1.6+e.ph)*.03;ro('TO',.06-q*.2,0,Math.sin(t*.7)*.03);ro('HD',-.1+cs*.3,Math.sin(t*.6)*.3);
ro('S0',-.5-cs*1.7+Math.sin(t*1.4)*.1,0,-.25);ro('E0',-.4+cs*.3);ro('S1',-.7,0,.25);ro('E1',-.5);ro('ST',.05+cs*.15,0,-.04);ro('OR',0,tt*1.5);ro('HM',Math.sin(t*2)*.05,t*.4,Math.cos(t*1.7)*.05);
if(r.GL&&dt>0)r.GL.scale.setScalar((.45+cs*.6)*(.9+Math.random()*.2));}
else if(e.type=='skel'){ro('H0',-s*.6);ro('K0',Math.max(0,c)*.8);ro('H1',s*.6);ro('K1',Math.max(0,-c)*.8);ro('S0',-1.1+s*.15);ro('E0',-.2);ro('S1',-.6-s*.2);ro('E1',-.6);
ro('TO',.15+s*.04-q*.3,c*.15,s*.08);r.TO.position.y=.36+Math.cos(2*e.gp)*.012;ro('HD',-.1+Math.sin(t*1.7)*.15-q*.3,Math.sin(t*1.1)*.3);ro('JW',.1+Math.abs(Math.sin(tt*11+e.ph))*.25);}
else if(e.type=='bat'){r.TO.position.y=1.05+Math.sin(tt*2.1+e.ph)*.06;ro('TO',-q*.3);for(let i=0;i<5;i++){const B=r['B'+i],p=B.userData.p,f=tt*(i?17:13)+e.ph+i*1.9,a=Math.sin(f)*.85+.15;
B.position.set(p[0]+Math.sin(tt*1.7+i*2+e.ph)*.07,p[1]+Math.sin(f-1.2)*.025+Math.sin(tt*2.3+i)*.05,p[2]+Math.cos(tt*1.5+i*1.3+e.ph)*.07);B.rotation.z=Math.sin(tt*1.7+i*2+e.ph)*.3;ro('WL'+i,0,0,-a);ro('WR'+i,0,0,a);}}
else{const f=tt*5.2+e.ph,a=Math.sin(f)*.65+.15,roar=Math.pow(Math.max(0,Math.sin(tt*1.1+e.ph)),10);
ro('W0',0,-Math.cos(f)*.15,a);ro('W1',0,Math.cos(f)*.15,-a);ro('WE0',0,0,Math.sin(f-.7)*.45);ro('WE1',0,0,-Math.sin(f-.7)*.45);ro('WH0',0,0,Math.sin(f-1.4)*.5);ro('WH1',0,0,-Math.sin(f-1.4)*.5);
ro('TO',Math.cos(f)*.04-q*.15);r.TO.position.y=.9-Math.sin(f)*.07;ro('T0',Math.cos(f)*.05,Math.sin(tt*1.8+e.ph)*.3);ro('T1',Math.cos(f-.6)*.06,Math.sin(tt*1.8+e.ph-.9)*.4);ro('T2',Math.cos(f-1.2)*.08,Math.sin(tt*1.8+e.ph-1.8)*.5);
ro('NK',-.1+Math.sin(f-.5)*.05-roar*.35);ro('HD',.1-roar*.3+Math.sin(tt*.9+e.ph)*.04,Math.sin(tt*.7+e.ph)*.15);ro('JW',.1+roar*.75+Math.sin(tt*3)*.02);
ro('H0',.35+Math.sin(f+1)*.1);ro('K0',.55);ro('H1',.35+Math.sin(f+1.3)*.1);ro('K1',.55);if(r.GL)r.GL.scale.setScalar(.35+roar*.85+Math.sin(tt*9)*.04);}
fxStatus(e,dt);
e.ice.visible=e.fz>0;const hr=Math.max(0,e.hp/e.max),hc=hr>.5?0x2ecc71:hr>.25?0xf1c40f:0xe74c3c;e.bar.scale.x=.52*Math.max(hr,.001);e.bar.center.set(.5/Math.max(hr,.001),.5);
if(hr<.5&&Math.random()<dt*(hr<.25?9:4))burst(e.x,e.y,hr<.25?{norm:0x8fd957,fast:0xb03a2e,tank:0x888888,boss:0xff6a1a,guard:0x8fd957,shaman:0x8fd957,bat:0x8e2a2a,sapper:0x8fd957,troll:0x6b7a52,ghost:0xcfe6ee,imp:0xff7a2a,king:0x8fd957,ram:0x5a3d22,necro:0x3a2a44,skel:0xd8d0bc}[e.type]:0x444444,1,.35,.4+(e.type=='boss'?1:0));
if(hr<.25)e.body.rotation.z+=Math.sin(tt*9+e.ph)*.07;if(e.bc!==hc){e.bc=hc;e.bar.material.color.setHex(hc);}}
function animDying(dt){for(let i=g.dying.length-1;i>=0;i--){const e=g.dying[i],boss=e.type=='boss',dk=e.dk,D=boss?1.2:dk=='frost'?.45:dk=='cannon'?.9:.7;e.dt+=dt;
const p=Math.min(1,e.dt/D),f=1-Math.pow(1-Math.min(1,p/.5),3),sink=Math.max(0,(p-.6)/.4);let rz=e.fd*f*(boss?.5:1.5),py=(boss?.3*(1-f):0)-sink*.25,ox=0,oz=0,sx=1,sy=1,s2=Math.max(.01,1-sink*sink*.95);
if(!boss){if(dk=='frost'){rz=0;py=0;s2=1;sx=sy=Math.max(.01,1-Math.max(0,p-.55)/.45);if(p>.55&&!e.sh){e.sh=1;burst(e.x,e.y,0xbfeaff,10,2,.5);}}
else if(dk=='storm'){ox=rnd(-.04,.04)*(1-p);oz=rnd(-.04,.04)*(1-p);if(Math.random()<.5)burst(e.x,e.y,0x7fd8ff,1,.6,.4);}
else if(dk=='alch'){rz=0;py=0;s2=1;sx=1+p*.5;sy=Math.max(.03,1-p*1.05);if(Math.random()<.5)bub(e.x,e.y,.2);}
else if(dk=='cannon'){py=Math.sin(p*PI)*1.1;rz=e.fd*p*9;}
else if(dk=='ballista'){ox=-Math.sin(e.vis)*p*1.3;oz=-Math.cos(e.vis)*p*1.3;}}
if(e.fy){py=-e.fy*Math.pow(Math.min(1,p*1.5),2);rz=e.fd*p*2.5;}// flyers drop out of the air
e.m.rotation.z=rz;e.m.position.set(e.bx+ox+(boss?(Math.random()-.5)*.04:0),py,e.bz+oz);
if(boss&&e.rig.W0){e.rig.W0.rotation.z=-1.1*f;e.rig.W1.rotation.z=1.1*f;}
e.m.scale.set(sx*s2,sy*s2,sx*s2);
if(p>=1){sc.remove(e.m);if(e.gm)e.gm.forEach(m=>m.dispose());if(boss)burst(e.x,e.y,0xe8483c,20,1.8,.2);g.dying.splice(i,1);}}}
function volley(t,s){const ts=[],br=tbr(t);for(const e of g.en)if(e.hp>0&&!e.out&&(!e.fy||T[t.k].air)&&dmul(e,t.k,br)>0&&Math.hypot(e.x-t.x,e.y-t.y)<=s.r)ts.push(e);const tm=tmode(t);ts.sort((a,b)=>tscore(t,b,tm)-tscore(t,a,tm));
ts.slice(0,t.l).forEach((e,i)=>g.bu.push({x:t.x,y:t.y,l:t.l,tg:e,k:'arrow',br,d:s.d,y0:t.head.position.y+.15,d0:Math.hypot(e.x-t.x,e.y-t.y)||1,m:mkBullet('arrow',brn(t)),w:i*.07}));}
const bolts=[];
function bolt(x1,y1,h1,x2,y2,h2,hv){const g2=new THREE.Group(),a=new THREE.Vector3(wx(x1),h1,wz(y1)),b=new THREE.Vector3(wx(x2),h2,wz(y2)),ps=[a],up=new THREE.Vector3(0,1,0);
for(let i=1;i<7;i++){const q=a.clone().lerp(b,i/7);q.x+=rnd(-.08,.08);q.y+=rnd(-.08,.08);q.z+=rnd(-.08,.08);ps.push(q);}ps.push(b);
for(let i=0;i<ps.length-1;i++){const d=ps[i+1].clone().sub(ps[i]),L=d.length(),m=new THREE.Mesh(geo('cyl'),bm(0x8fd6ff));m.layers.set(1);m.position.copy(ps[i]).add(ps[i+1]).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,d.normalize());m.scale.set(hv?.036:.022,L,hv?.036:.022);g2.add(m);}
glow(g2,b.x,b.y,b.z,hv?.7:.45,hv?0x7a6aff:0x3f9aff);sc.add(g2);bolts.push({g:g2,t:0});}
// branches: Tempest (b.ch) chains to more enemies, Thunderlord stuns every enemy it hits for b.stn s (bosses a third)
function zap(t,best,s){const b=brn(t),hit=[best],n=T.storm.ch+t.l-1+(b&&b.ch||0);let cur=best;
for(let i=1;i<n;i++){let nx=null,nd=90;for(const o of g.en){if(o.hp<=0||o.out||hit.includes(o))continue;const dd=Math.hypot(o.x-cur.x,o.y-cur.y);if(dd<nd){nd=dd;nx=o;}}if(!nx)break;hit.push(nx);cur=nx;}
let f={x:t.x,y:t.y,h:t.head.position.y},dm=s.d;for(const o of hit){const dd=dm*dmul(o,'storm');o.hp-=dd;hf(o,.2,dd,'storm');o.stun=b&&b.stn?Math.max(o.stun,b.stn*(o.bs?.34:1)):.2;const h=o.fy||.45;bolt(f.x,f.y,f.h,o.x,o.y,h,b&&b.stn);f={x:o.x,y:o.y,h};dm*=.92;}}
// ground zones from addZone() in js/09-game.js: Fire Pots' burning ground (scorch, glow and flames) and the Time Warden's amber field (a dome and turning rune ring);
// zoneAnim() fades them out over their last second
function zoneFx(z){const G=new THREE.Group(),R=z.r/60;G.position.set(wx(z.x),.02,wz(z.y));sc.add(G);z.fl=[];
const disc=(c,r,o,y)=>{const m=L1(new THREE.Mesh(eg('zd',()=>new THREE.CircleGeometry(1,28)),new THREE.MeshBasicMaterial({color:new THREE.Color(c).convertSRGBToLinear(),transparent:true,opacity:o,depthWrite:false,blending:THREE.AdditiveBlending})));
m.rotation.x=-PI/2;m.position.y=y;m.scale.setScalar(r);m.userData.o=o;G.add(m);return m;};
if(z.k=='fire'){disc(0xff5a10,R,.45,.01);disc(0xffb040,R*.55,.35,.02);for(let i=0;i<5;i++){const a=i/5*2*PI+rnd(0,1),d=i?R*rnd(.35,.7):0;flame(G,d*Math.sin(a),0,d*Math.cos(a),rnd(.8,1.3),z.fl,.5);}}
else{disc(0xffb43a,R,.12,.01);const rg=L1(new THREE.Mesh(RG,new THREE.MeshBasicMaterial({color:new THREE.Color(0xffd27a).convertSRGBToLinear(),transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending})));
rg.rotation.x=-PI/2;rg.position.y=.03;rg.scale.setScalar(R);rg.userData.o=.6;G.add(rg);
const dm=L1(new THREE.Mesh(eg('zdm',()=>new THREE.SphereGeometry(1,24,10,0,2*PI,0,PI/2)),new THREE.MeshBasicMaterial({color:new THREE.Color(0xffc060).convertSRGBToLinear(),transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending})));
dm.scale.set(R,R*.45,R);dm.userData.o=.1;G.add(dm);const sp=new THREE.Group();G.add(sp);z.sp=sp;
for(let i=0;i<8;i++){const a=i/8*2*PI,m=L1(new THREE.Mesh(geo('oct'),bm(0xffd27a)));m.scale.set(.03,.05,.03);m.position.set(R*.9*Math.sin(a),.08,R*.9*Math.cos(a));sp.add(m);}
glow(G,0,.2,0,R*.6,0xffb43a);}
return G;}
// ---------- Barracks soldiers (logic: soldiers() in js/09-game.js) ----------
// one template per level: a chibi soldier (js/05-towers.js) scaled up to goblin size, tunic and shield in the level colour, iron kettle hat,
// the sword on its own pivot 'SW', and a small health bar; each soldier is a clone (t.sg holds a Barracks' soldiers)
const STPL={},SOLC=[[0x8a2a22,P.rd],[0x2f5a9a,P.bl],[0xd9a520,P.gd]];
function solTpl(l){if(STPL[l])return STPL[l];const G=new THREE.Group(),b=new THREE.Group();b.scale.setScalar(2.3);G.add(b);chibi(b,0,0,SOLC[l-1][0],0x9aa3b0,4,SOLC[l-1][1]);
const sw=b.getObjectByName('SW');bakeE(b);bakeE(sw);blob(G,.3);
const bg=L1(new THREE.Sprite(SB)),fg=L1(new THREE.Sprite(SF));bg.scale.set(.36,.07,1);bg.position.y=1.05;bg.renderOrder=10;bg.name='bb';fg.name='bar';fg.scale.set(.33,.045,1);fg.position.y=1.05;fg.renderOrder=11;G.add(bg,fg);
return STPL[l]=G;}
// the rally flag: shown on the rally point of the selected Barracks
let RFL=null;
function solSync(t,dt){if(!t.sg){t.sg=new THREE.Group();sc.add(t.sg);}
for(const d of t.sol){if(!d.m||d.ml!==t.l){if(d.m)t.sg.remove(d.m);d.m=solTpl(t.l).clone(true);d.ml=t.l;d.swp=d.m.getObjectByName('SW');d.bar=d.m.getObjectByName('bar');d.bb=d.m.getObjectByName('bb');d.bar.material=SF.clone();t.sg.add(d.m);}
const on=d.hp>0;d.m.visible=on;if(!on)continue;d.m.position.set(wx(d.x),d.mv&&dt>0?Math.abs(Math.sin(tt*13+d.i*2))*.06:0,wz(d.y));d.m.rotation.y=d.dir;
if(d.sw>0)d.sw=Math.max(0,d.sw-dt*4);d.swp.rotation.x=d.sw>0?Math.sin((1-d.sw)*PI)*1.7:-.15;d.m.children[0].rotation.x=d.hit>0?-.15:0;if(d.hit>0)d.hit-=dt;
const hr=Math.max(0,d.hp/d.max),full=hr>=.999;d.bar.visible=d.bb.visible=!full;if(!full){d.bar.scale.x=.33*Math.max(hr,.001);d.bar.center.set(.5/Math.max(hr,.001),.5);d.bar.material.color.setHex(hr>.5?0x4aa8ff:hr>.25?0xf1c40f:0xe74c3c);}}
if(g.sel===t){if(!RFL){RFL=new THREE.Group();flag(RFL,0,0,0,0xffe6a0,.9);ring(RFL,0xffe6a0,.3,.02,.15,0xaa8833);sc.add(RFL);}RFL.visible=true;RFL.position.set(wx(t.rp.x),0,wz(t.rp.y));}}
// hide the rally flag when no Barracks is selected (called once a frame from sync())
function rallyHide(){if(RFL&&!(g.sel&&g.sel.sol))RFL.visible=false;}
// a soldier falls: a puff of dust and a clank (it respawns at the tower)
function solDie(t,d){snd('die_sol');burst(d.x,d.y,0x9aa3b0,8,1,.4);burst(d.x,d.y,0xd8cbb0,6,.8,.2);}
// Plague spreading from a dying enemy: a purple ring as wide as its reach
function plagueFx(e,r){fx(e.x,e.y,0xa06ad0,.2,r/60,.6,.08,true);burst(e.x,e.y,0x8a4ab0,10,1,.3);}
function zoneEnd(z){sc.remove(z.m);z.m.children.forEach(m=>{if(m.material&&m.userData.o!=null)m.material.dispose();});}
function zoneAnim(dt){for(const z of g.zn){const k=clamp(z.t,0,1);z.m.children.forEach(m=>{if(m.material&&m.userData.o!=null)m.material.opacity=m.userData.o*k*(z.k=='fire'?.85+.15*Math.sin(tt*9+m.id):1);});
z.fl.forEach((f,i)=>{const b=f.userData.b;if(b)f.scale.set(b.x*k,b.y*k*(1+.3*Math.sin(tt*14+i*2)),b.z*k);});if(z.sp){z.sp.rotation.y-=dt*.8;z.sp.position.y=Math.sin(tt*2)*.03;}}}
// banners: +damage to towers in range; War Drums also add attack speed (t.hs), a Blessed Standard sets t.bls (tbr() in js/09-game.js)
function buffs(){for(const t of g.tw){t.buff=1;t.hs=1;t.bls=0;}for(const s of g.tw)if(T[s.k].sup&&!(s.stun>0)){const r=stat(s).r,b=brn(s);for(const t of g.tw)if(t!==s&&Math.hypot(t.x-s.x,t.y-s.y)<=r){t.buff+=.2+.1*(s.l-1);if(b&&b.hs)t.hs+=b.hs;if(b&&b.hr)t.bls=1;}}}
// br = the tower's upgrade branch: Crossbow Nest bolts, Fire Pots (a glowing clay pot), the Boulder (twice the size), Archmage/Time Warden orbs
function mkBullet(k,br){const bi=br?BRN[k].indexOf(br):-1;
if(k=='arrow'&&bi==1){const a=new THREE.Group();part(a,'box',0x5a3a1e,.035,.035,.24,0,0,0);part(a,'cone',0x9aa3b0,.05,.08,.05,0,0,.15).rotation.x=PI/2;part(a,'box',0x2b3342,.06,.012,.05,0,0,-.1);part(a,'box',0x2b3342,.012,.06,.05,0,0,-.1);sc.add(a);return a;}
if(k=='cannon'&&bi==0){const q=new THREE.Group();part(q,'sph',0xa0522d,.1,.11,.1,0,0,0);part(q,'cyl',0x6b3a1e,.04,.05,.04,0,.1,0);part(q,'cone',0xffb040,.05,.12,.05,0,.18,0,0xff6a00);glow(q,0,.1,0,.6,0xff8a2a);sc.add(q);return q;}
if(k=='cannon'&&bi==1)return part(sc,'sph',0x8a8a84,.22,.2,.22,0,0,0);
if(k=='ballista'&&bi>=0){const a=new THREE.Group(),c=bi?P.gd:0x5a5a68;part(a,'box',bi?0x6a2020:0x3a3a44,.05,.05,bi?.6:.75,0,0,0);part(a,'cone',c,.07,.18,.07,0,0,bi?.36:.44).rotation.x=PI/2;part(a,'box',bi?P.gd:0x2b3342,.11,.012,.1,0,0,bi?-.27:-.34);part(a,'box',bi?P.gd:0x2b3342,.012,.11,.1,0,0,bi?-.27:-.34);sc.add(a);return a;}
if(k=='alch'&&bi>=0){const q=new THREE.Group(),c=bi?0xc8a0ff:0xeaff6a,em=bi?0x6a2a9a:0x8aa010;part(q,'sph',c,.075,.09,.075,0,0,0,em);part(q,'cyl',P.wd2,.025,.03,.025,0,.1,0);glow(q,0,0,0,.4,bi?0xa06ad0:0xd8f03a);sc.add(q);return q;}
if(k=='frost'&&bi>=0){const q=new THREE.Group(),c=bi?0xffd27a:0xd9a8ff;part(q,'sph',c,.08,.08,.08,0,0,0,bi?0xcc8a1a:0x8a3aff);glow(q,0,0,0,.55,bi?0xffb43a:0xb36bff);sc.add(q);return q;}
if(k=='ballista'){const a=new THREE.Group();part(a,'box',P.wd2,.04,.04,.55,0,0,0);part(a,'cone',0xdfe6ee,.055,.14,.055,0,0,.33).rotation.x=PI/2;part(a,'box',P.rd,.1,.012,.1,0,0,-.25);part(a,'box',P.rd,.012,.1,.1,0,0,-.25);sc.add(a);return a;}
if(k=='alch'){const q=new THREE.Group();part(q,'sph',0xbaff8a,.075,.09,.075,0,0,0,0x3fbf1f);part(q,'cyl',P.wd2,.025,.03,.025,0,.1,0);glow(q,0,0,0,.4,0x7cff4a);sc.add(q);return q;}if(k=='arrow'){const a=new THREE.Group();part(a,'box',P.wd2,.025,.025,.3,0,0,0);part(a,'cone',0xdfe6ee,.04,.09,.04,0,0,.18).rotation.x=PI/2;part(a,'box',P.rd,.05,.012,.07,0,0,-.13);part(a,'box',P.rd,.012,.05,.07,0,0,-.13);sc.add(a);return a;}
if(k=='cannon')return part(sc,'sph',0x9aa3b0,.12,.11,.12,0,0,0);const q=new THREE.Group();part(q,'sph',0xd8f4ff,.07,.07,.07,0,0,0,0x66ccff);glow(q,0,0,0,.45,0x66e0ff);sc.add(q);return q;}
