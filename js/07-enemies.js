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
g.traverse(o=>{if(o.isMesh&&o!==ice){o.userData.m0=o.material;meshes.push(o);}});b.traverse(n=>{if(n.name)rig[n.name]=n;});return{m:g,body:b,ice,bar,meshes,rig};}
const BR={norm:[.4,.22],fast:[.4,.3],tank:[.6,.3],boss:[1.0,.55]},HT={norm:.8,fast:1.05,tank:1.4,boss:2.3},UPV=new THREE.Vector3(0,1,0);
const ICEM=new THREE.MeshStandardMaterial({color:new THREE.Color(0x9fe8ff).convertSRGBToLinear(),transparent:true,opacity:.3,roughness:.08,metalness:.1,envMapIntensity:1.6,depthWrite:false}),
ICEM2=new THREE.MeshStandardMaterial({color:new THREE.Color(0xbfefff).convertSRGBToLinear(),transparent:true,opacity:.75,roughness:.1,envMapIntensity:1.6,emissive:new THREE.Color(0x2a9fe0).convertSRGBToLinear(),emissiveIntensity:.35}),
BUBM=new THREE.MeshBasicMaterial({color:new THREE.Color(0x7cff4a).convertSRGBToLinear(),transparent:true,opacity:.55,depthWrite:false}),
STARM=new THREE.MeshStandardMaterial({color:new THREE.Color(0xffd24a).convertSRGBToLinear(),emissive:new THREE.Color(0xffa000).convertSRGBToLinear(),emissiveIntensity:.8,metalness:.6,roughness:.3});
function bub(x,y,yy){const m=L1(new THREE.Mesh(geo('sph'),BUBM));m.position.set(wx(x)+rnd(-.12,.12),yy,wz(y)+rnd(-.12,.12));sc.add(m);pts.push({m,vx:rnd(-.1,.1),vz:rnd(-.1,.1),vy:rnd(.6,1.1),g:-.3,t:0,d:rnd(.7,1.1),s:rnd(.035,.07)});}
function stick(e,dx,dy,big){if(!e.stuck)e.stuck=[];const len=Math.hypot(dx,dy)||1,ux=dx/len,uz=dy/len,cv=Math.cos(e.vis),sv=Math.sin(e.vis),lx=ux*cv-uz*sv,lz=ux*sv+uz*cv,R0=BR[e.type][1]*.85,
yr={norm:[.22,.5],fast:[.28,.5],tank:[.3,.8],boss:[.75,1.1]}[e.type],yy=rnd(yr[0],yr[1]),k=big?2:1,L=big?.5:.22,a=new THREE.Group();
part(a,'box',P.wd2,.016*k,.016*k,L,0,0,-L/2);part(a,'box',P.rd,.05*k,.012,.06,0,0,-L*.9);part(a,'box',P.rd,.012,.05*k,.06,0,0,-L*.9);part(a,'cone',0xdfe6ee,.02*k,.04,.02*k,0,0,.01).rotation.x=PI/2;
a.position.set(-lx*R0+rnd(-.03,.03),yy,-lz*R0+rnd(-.03,.03));a.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(lx,rnd(-.15,.15),lz).normalize());
e.body.add(a);e.stuck.push({a,t:0,sc:e.type=='boss'?1.8:1});if(e.stuck.length>7){const o=e.stuck.shift();e.body.remove(o.a);}}
function hf(o,h,d,kind,dx,dy){snd('h_'+kind);o.hit=h;o.kb=kind=='ballista'?.3:.1;o.lk=kind;
if(d>0&&txts.length<40){popText(o.x+rnd(-8,8),o.y+rnd(-8,8),String(Math.round(d)),'#ff8a7a');const q=txts[txts.length-1];q.k=.6;q.s.position.y=o.type=='boss'?2.3:o.type=='tank'?1.4:o.type=='fast'?1.15:1;}
burst(o.x,o.y,{norm:0x8fd957,fast:0xb03a2e,tank:0xffd24a,boss:0xff8a3a}[o.type],o.type=='tank'?5:3,.8,.5);
if(kind=='arrow'||kind=='ballista')stick(o,dx||0,dy||1,kind=='ballista');else if(kind=='cannon')o.stn=1;else if(kind=='storm')o.shk=2.8;}
function tfx(t){snd('f_'+t.k);const c={arrow:0xdcc9a0,cannon:0xcfc2a0,frost:0x9ff7ff,ballista:0xe8e0c8,storm:0x7fd8ff,alch:0x7cff4a}[t.k];if(!c)return;burst(t.x,t.y,c,t.k=='cannon'?7:t.k=='arrow'?2:5,t.k=='storm'?1.2:.8,t.head.position.y+.1);if(t.k=='cannon')fx(t.x,t.y,0xcfc2a0,.2,.7,.35,.3);}
function killFx(e){snd('die_'+e.type);e.dt=0;e.dk=e.lk;e.fd=Math.random()<.5?-1:1;e.bx=e.m.position.x;e.bz=e.m.position.z;e.ice.visible=false;e.m.children.forEach(c=>{if(c.isSprite)c.visible=false;});
if(e.shG)e.shG.visible=false;if(e.stG)e.stG.visible=false;if(e.fzG&&e.dk!='frost')e.fzG.visible=false;g.dying.push(e);const dk=e.dk;
if(dk=='frost')burst(e.x,e.y,0x9ff7ff,22,1.8,.5);else if(dk=='storm')burst(e.x,e.y,0x7fd8ff,16,1.6,.5);else if(dk=='alch')burst(e.x,e.y,0x7cff4a,18,1.2,.4);else if(dk=='cannon')burst(e.x,e.y,0xcfc2a0,16,1.8,.3);
if(e.type=='boss'){burst(e.x,e.y,0xff8c3a,26,2,.6);fx(e.x,e.y,0xffc060,.3,2.2,.6,.4);}}
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
else{const f=tt*5.2+e.ph,a=Math.sin(f)*.65+.15,roar=Math.pow(Math.max(0,Math.sin(tt*1.1+e.ph)),10);
ro('W0',0,-Math.cos(f)*.15,a);ro('W1',0,Math.cos(f)*.15,-a);ro('WE0',0,0,Math.sin(f-.7)*.45);ro('WE1',0,0,-Math.sin(f-.7)*.45);ro('WH0',0,0,Math.sin(f-1.4)*.5);ro('WH1',0,0,-Math.sin(f-1.4)*.5);
ro('TO',Math.cos(f)*.04-q*.15);r.TO.position.y=.9-Math.sin(f)*.07;ro('T0',Math.cos(f)*.05,Math.sin(tt*1.8+e.ph)*.3);ro('T1',Math.cos(f-.6)*.06,Math.sin(tt*1.8+e.ph-.9)*.4);ro('T2',Math.cos(f-1.2)*.08,Math.sin(tt*1.8+e.ph-1.8)*.5);
ro('NK',-.1+Math.sin(f-.5)*.05-roar*.35);ro('HD',.1-roar*.3+Math.sin(tt*.9+e.ph)*.04,Math.sin(tt*.7+e.ph)*.15);ro('JW',.1+roar*.75+Math.sin(tt*3)*.02);
ro('H0',.35+Math.sin(f+1)*.1);ro('K0',.55);ro('H1',.35+Math.sin(f+1.3)*.1);ro('K1',.55);if(r.GL)r.GL.scale.setScalar(.35+roar*.85+Math.sin(tt*9)*.04);}
fxStatus(e,dt);
e.ice.visible=e.fz>0;const hr=Math.max(0,e.hp/e.max),hc=hr>.5?0x2ecc71:hr>.25?0xf1c40f:0xe74c3c;e.bar.scale.x=.52*Math.max(hr,.001);e.bar.center.set(.5/Math.max(hr,.001),.5);
if(hr<.5&&Math.random()<dt*(hr<.25?9:4))burst(e.x,e.y,hr<.25?{norm:0x8fd957,fast:0xb03a2e,tank:0x888888,boss:0xff6a1a}[e.type]:0x444444,1,.35,.4+(e.type=='boss'?1:0));
if(hr<.25)e.body.rotation.z+=Math.sin(tt*9+e.ph)*.07;if(e.bc!==hc){e.bc=hc;e.bar.material.color.setHex(hc);}}
function animDying(dt){for(let i=g.dying.length-1;i>=0;i--){const e=g.dying[i],boss=e.type=='boss',dk=e.dk,D=boss?1.2:dk=='frost'?.45:dk=='cannon'?.9:.7;e.dt+=dt;
const p=Math.min(1,e.dt/D),f=1-Math.pow(1-Math.min(1,p/.5),3),sink=Math.max(0,(p-.6)/.4);let rz=e.fd*f*(boss?.5:1.5),py=(boss?.3*(1-f):0)-sink*.25,ox=0,oz=0,sx=1,sy=1,s2=Math.max(.01,1-sink*sink*.95);
if(!boss){if(dk=='frost'){rz=0;py=0;s2=1;sx=sy=Math.max(.01,1-Math.max(0,p-.55)/.45);if(p>.55&&!e.sh){e.sh=1;burst(e.x,e.y,0xbfeaff,10,2,.5);}}
else if(dk=='storm'){ox=rnd(-.04,.04)*(1-p);oz=rnd(-.04,.04)*(1-p);if(Math.random()<.5)burst(e.x,e.y,0x7fd8ff,1,.6,.4);}
else if(dk=='alch'){rz=0;py=0;s2=1;sx=1+p*.5;sy=Math.max(.03,1-p*1.05);if(Math.random()<.5)bub(e.x,e.y,.2);}
else if(dk=='cannon'){py=Math.sin(p*PI)*1.1;rz=e.fd*p*9;}
else if(dk=='ballista'){ox=-Math.sin(e.vis)*p*1.3;oz=-Math.cos(e.vis)*p*1.3;}}
e.m.rotation.z=rz;e.m.position.set(e.bx+ox+(boss?(Math.random()-.5)*.04:0),py,e.bz+oz);
if(boss&&e.rig.W0){e.rig.W0.rotation.z=-1.1*f;e.rig.W1.rotation.z=1.1*f;}
e.m.scale.set(sx*s2,sy*s2,sx*s2);
if(p>=1){sc.remove(e.m);if(boss)burst(e.x,e.y,0xe8483c,20,1.8,.2);g.dying.splice(i,1);}}}
function volley(t,s){const ts=[];for(const e of g.en)if(e.hp>0&&Math.hypot(e.x-t.x,e.y-t.y)<=s.r)ts.push(e);const tm=tmode(t);ts.sort((a,b)=>tscore(t,b,tm)-tscore(t,a,tm));
ts.slice(0,t.l).forEach((e,i)=>g.bu.push({x:t.x,y:t.y,l:t.l,tg:e,k:'arrow',d:s.d,y0:t.head.position.y+.15,d0:Math.hypot(e.x-t.x,e.y-t.y)||1,m:mkBullet('arrow'),w:i*.07}));}
const bolts=[];
function bolt(x1,y1,h1,x2,y2,h2){const g2=new THREE.Group(),a=new THREE.Vector3(wx(x1),h1,wz(y1)),b=new THREE.Vector3(wx(x2),h2,wz(y2)),ps=[a],up=new THREE.Vector3(0,1,0);
for(let i=1;i<7;i++){const q=a.clone().lerp(b,i/7);q.x+=rnd(-.08,.08);q.y+=rnd(-.08,.08);q.z+=rnd(-.08,.08);ps.push(q);}ps.push(b);
for(let i=0;i<ps.length-1;i++){const d=ps[i+1].clone().sub(ps[i]),L=d.length(),m=new THREE.Mesh(geo('cyl'),bm(0x8fd6ff));m.layers.set(1);m.position.copy(ps[i]).add(ps[i+1]).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,d.normalize());m.scale.set(.022,L,.022);g2.add(m);}
glow(g2,b.x,b.y,b.z,.45,0x3f9aff);sc.add(g2);bolts.push({g:g2,t:0});}
function zap(t,best,s){const hit=[best],n=T.storm.ch+t.l-1;let cur=best;
for(let i=1;i<n;i++){let nx=null,nd=90;for(const o of g.en){if(o.hp<=0||hit.includes(o))continue;const dd=Math.hypot(o.x-cur.x,o.y-cur.y);if(dd<nd){nd=dd;nx=o;}}if(!nx)break;hit.push(nx);cur=nx;}
let f={x:t.x,y:t.y,h:t.head.position.y},dm=s.d;for(const o of hit){o.hp-=dm;hf(o,.2,dm,'storm');o.stun=.2;bolt(f.x,f.y,f.h,o.x,o.y,.45);f={x:o.x,y:o.y,h:.45};dm*=.92;}}
function buffs(){for(const t of g.tw)t.buff=1;for(const s of g.tw)if(T[s.k].sup){const r=stat(s).r;for(const t of g.tw)if(t!==s&&Math.hypot(t.x-s.x,t.y-s.y)<=r)t.buff+=.2+.1*(s.l-1);}}
function mkBullet(k){if(k=='ballista'){const a=new THREE.Group();part(a,'box',P.wd2,.04,.04,.55,0,0,0);part(a,'cone',0xdfe6ee,.055,.14,.055,0,0,.33).rotation.x=PI/2;part(a,'box',P.rd,.1,.012,.1,0,0,-.25);part(a,'box',P.rd,.012,.1,.1,0,0,-.25);sc.add(a);return a;}
if(k=='alch'){const q=new THREE.Group();part(q,'sph',0xbaff8a,.075,.09,.075,0,0,0,0x3fbf1f);part(q,'cyl',P.wd2,.025,.03,.025,0,.1,0);glow(q,0,0,0,.4,0x7cff4a);sc.add(q);return q;}if(k=='arrow'){const a=new THREE.Group();part(a,'box',P.wd2,.025,.025,.3,0,0,0);part(a,'cone',0xdfe6ee,.04,.09,.04,0,0,.18).rotation.x=PI/2;part(a,'box',P.rd,.05,.012,.07,0,0,-.13);part(a,'box',P.rd,.012,.05,.07,0,0,-.13);sc.add(a);return a;}
if(k=='cannon')return part(sc,'sph',0x9aa3b0,.12,.11,.12,0,0,0);const q=new THREE.Group();part(q,'sph',0xd8f4ff,.07,.07,.07,0,0,0,0x66ccff);glow(q,0,0,0,.45,0x66e0ff);sc.add(q);return q;}
