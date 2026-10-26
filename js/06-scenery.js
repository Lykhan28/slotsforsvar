// ---------- terrain & scenery ----------
// everything here follows the level (js/01-config.js): board size W×H, roads, blocked cells, breaches ENT, gate GATE and the theme TH
const sm=(a,b,x)=>{x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x);};
const nz=(x,z)=>Math.sin(x*.31+1.7)*Math.cos(z*.27+.4)+.5*Math.sin(x*.77+z*.53+2)+.25*Math.sin(x*1.9-z*1.3);
// castle zone in castle coordinates (see toC): the ground stays flat there
const inC=(x,z,x0,x1,z0,z1)=>{const q=toC(x,z);return q.x>x0&&q.x<x1&&q.z>z0&&q.z<z1;},cDist=(x,z)=>{const q=toC(x,z);return Math.max(6.4-q.x,q.x-14.6,-1.4-q.z,q.z-6.6,0);};
const gh=(x,z)=>-.15+sm(0,9,Math.max(Math.abs(x)-HX-1.63,Math.abs(z)-HZ-1.43,0))*sm(0,3,cDist(x,z))*(nz(x,z)*1.1+1.3)*TH.hl;
// the far side of the board (away from the default camera) gets most of the scenery; ZF flips z when the camera looks from the north
const ZF=CAM0.az?-1:1,rzf=(a,b)=>ZF*rnd(a,b);
const flames=[],flags=[],emit=[],smoke=[],trees=[],clouds=[],mists=[],keepOut=[],ripples=[],RIPG=new THREE.RingGeometry(.85,1,28).rotateX(-PI/2);let mill,KEEP,KEEP0;
const ST=new THREE.Group();sc.add(ST);
const RKM=TH.rc?PBR(TX.rock,TH.rc):M.rock;
// barren lands (theme gt:'dirt') use bare earth instead of grass for the ground and the board
if(TH.gt=='dirt')TX.dirt=genTex(256,(x,y)=>{const n1=fbm(x/256*8,y/256*8,8,8,4),n2=fbm(x/256*64,y/256*64,64,64,2),c=fbm(x/256*20,y/256*20,20,20,3),l=.5+.35*(n1-.5)+.22*(n2-.5)-(c>.68?.12:0);return[l,l*.96,l*.9,n2*.6+n1*.4];},2.5);
const GTX=TX[TH.gt||'grass'];
{const gg=new THREE.PlaneGeometry(120,90,150,112);gg.rotateX(-PI/2);const p=gg.attributes.position;
for(let i=0;i<p.count;i++)p.setY(i,gh(p.getX(i),p.getZ(i)));gg.computeVertexNormals();
const nm=gg.attributes.normal,cols=new Float32Array(p.count*3),c1=new THREE.Color(TH.gr[0]),c2=new THREE.Color(TH.gr[1]),c3=new THREE.Color(TH.gr[2]),cr=new THREE.Color(TH.gr[3]),dr=new THREE.Color(TH.gr[4]),c=new THREE.Color();
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=p.getY(i),n=nz(x*1.3,z*1.3)*.5+.5;c.copy(c2).lerp(n>.5?c1:c3,Math.abs(n-.5)*1.6).lerp(c1,clamp(h*.1,0,.4));c.lerp(cr,clamp((1-nm.getY(i)-.08)*5,0,.85));if(nz(x*.7+9,z*.7)>.9)c.lerp(dr,.4);c.convertSRGBToLinear();cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;}
gg.setAttribute('color',new THREE.BufferAttribute(cols,3));const tg=GTX.a.clone(),tn=GTX.n.clone();tg.needsUpdate=tn.needsUpdate=true;tg.repeat.set(40,30);tn.repeat.set(40,30);
const gm=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({map:tg,normalMap:tn,vertexColors:true,roughness:.95,envMapIntensity:.5}));gm.receiveShadow=true;L1(gm);sc.add(gm);}
for(let i=0;i<TH.rk;i++){const x=rnd(-HX-10.8,HX+10.8),z=rzf(-HZ-9.8,HZ+5.8);if(Math.abs(x)<HX+1.43&&Math.abs(z)<HZ+1.63)continue;if(inC(x,z,6.4,9,.8,4.2))continue;const s2=rnd(.4,1.3),m=part(ST,'oct',RKM,s2,s2*rnd(.5,.9),s2*rnd(.7,1.1),x,gh(x,z)+s2*.25,z);m.rotation.set(rnd(0,.5),rnd(0,6),rnd(0,.4));}
const flat=(c,w,h,d,x,y,z,par)=>{const o=part(par||sc,'box',c,w,h,d,x,y,z);o.castShadow=false;o.receiveShadow=true;return L1(o);};
function scatter(k,m,n,fn){const im=new THREE.InstancedMesh(typeof k=='string'?geo(k):k,m,n),d=new THREE.Object3D(),col=new THREE.Color();let c=0;
for(let i=0;i<n;i++){const o=fn(i);if(!o)continue;d.position.set(o.x,o.y,o.z);d.scale.set(o.sx,o.sy||o.sx,o.sz||o.sx);d.rotation.set(0,o.ry||0,0);d.updateMatrix();im.setMatrixAt(c,d.matrix);col.setHex(o.col).convertSRGBToLinear();im.setColorAt(c,col);c++;}
im.count=c;im.frustumCulled=false;im.receiveShadow=true;L1(im);sc.add(im);}
function flag(g,x,y,z,col,s){part(g,'cyl',P.wd2,.016,.5*s,.016,x,y+.25*s,z);part(g,'sph',P.gd,.03,.03,.03,x,y+.51*s,z);const p=new THREE.Group();p.position.set(x,y+.43*s,z);p.userData.keep=true;
part(p,'box',col,.28*s,.17*s,.02,.14*s,0,0);part(p,'box',P.gd,.28*s,.035*s,.025,.14*s,0,0);part(p,'cone',col,.08*s,.1*s,.02,.3*s,0,0).rotation.z=-PI/2;g.add(p);return p;}
// a flickering flame (two cones and a glow) with no logs; torch and fire build on it
function flame(g,x,y,z,s2,list,gs){const f=part(g,'cone',0xff8a1f,.07*s2,.18*s2,.07*s2,x,y+.09*s2,z,0xff6a00),f2=part(g,'cone',0xffe27a,.04*s2,.11*s2,.04*s2,x,y+.07*s2,z,0xffcc33);
for(const o of[f,f2]){o.castShadow=false;o.userData.keep=true;o.userData.b=o.scale.clone();(list||flames).push(o);}(list||flames).push(glow(g,x,y+.11*s2,z,(gs||.55)*s2,0xff9a40));}
function torch(g,x,y,z,list){part(g,'cyl',P.wd2,.025,.3,.025,x,y,z);part(g,'cyl',0x4a4a5a,.05,.05,.05,x,y+.15,z);
const f=part(g,'cone',0xff8a1f,.07,.18,.07,x,y+.26,z,0xff6a00),f2=part(g,'cone',0xffe27a,.04,.11,.04,x,y+.24,z,0xffcc33);
for(const o of[f,f2]){o.castShadow=false;o.userData.keep=true;o.userData.b=o.scale.clone();(list||flames).push(o);}(list||flames).push(glow(g,x,y+.28,z,.55,0xff9a40));}
// a campfire-sized fire with two charred logs; smoke rises from it (call after the group is placed in the scene)
function fire(g,x,y,z,s2){const f=part(g,'cone',0xff8a1f,.12*s2,.34*s2,.12*s2,x,y+.17*s2,z,0xff6a00),f2=part(g,'cone',0xffe27a,.07*s2,.22*s2,.07*s2,x,y+.12*s2,z,0xffcc33);for(const o of[f,f2]){o.castShadow=false;o.userData.keep=true;o.userData.b=o.scale.clone();flames.push(o);}
flames.push(glow(g,x,y+.25*s2,z,1.1*s2,0xff9a40));part(g,'cyl',0x2a1c12,.05,.4,.05,x-.1,y+.05,z).rotation.z=PI/2.2;part(g,'cyl',0x2a1c12,.05,.4,.05,x+.08,y+.05,z+.05).rotation.x=PI/2.3;
g.updateWorldMatrix(true,false);const v=new THREE.Vector3(x,y+.5*s2,z);g.localToWorld(v);emit.push([v.x,v.y,v.z]);}
function crown(g,y,r,n,m){for(let i=0;i<n;i++){const a=i/n*2*PI;part(g,'box',m,.1,.11,.1,r*Math.sin(a),y,r*Math.cos(a));}}
function win(g,x,y,z,w,h,ry,c,em){const k=new THREE.Group();k.position.set(x,y,z);k.rotation.y=ry;part(k,'box',c,w,h,.04,0,0,0,em).castShadow=false;part(k,'cyl',c,w/2,.04,w/2,0,h/2,0,em).rotation.x=PI/2;g.add(k);}
function turret(x,z,h,r,roof,par){const g=new THREE.Group();g.position.set(x,-.1,z);(par||ST).add(g);part(g,'tap',P.st,r,h,r,0,h/2,0);part(g,'cyl',P.st2,r*.95,.06,r*.95,0,h*.6,0);part(g,'cyl',P.st3,r*1.12,.07,r*1.12,0,h,0);
part(g,'cone',RF(roof),r*1.3,h*.5,r*1.3,0,h+h*.25,0);part(g,'sph',P.gd,.04,.04,.04,0,h*1.5+.02,0);win(g,0,h*.55,r*.88,.07,.15,0,0x2a2140);return g;}
function wall(x1,z1,x2,z2){const L=Math.hypot(x2-x1,z2-z1),a=Math.abs(x2-x1)>Math.abs(z2-z1),cx=(x1+x2)/2,cz=(z1+z2)/2,n2=Math.ceil(L),n=Math.floor(L/.5);
for(let i=0;i<n2;i++){const u=-L/2+(i+.5)*L/n2;part(ST,'box',[P.st,P.st3][i%2],a?L/n2*.99:.36,.42,a?.36:L/n2*.99,a?cx+u:cx,.06,a?cz:cz+u);}
for(let i=0;i<n;i++){const u=-L/2+(i+.5)*L/n;part(ST,'box',P.st3,a?.3:.36,.17,a?.36:.3,a?cx+u:cx,.36,a?cz:cz+u);}}
function chim(g,x,y,z){part(g,'box',P.st2,.13,.3,.13,x,y,z);g.updateWorldMatrix(true,false);const v=new THREE.Vector3(x,y+.2,z);g.localToWorld(v);emit.push([v.x,v.y,v.z]);}
function rod(g,x1,y1,z1,x2,y2,z2,r,c){const d=new THREE.Vector3(x2-x1,y2-y1,z2-z1),L=d.length(),m=part(g,'cyl',c,r,L,r,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
function house(x,z,ry,w,d,rf){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.rotation.y=ry;ST.add(g);part(g,'box',0xfff1d6,w,.5,d,0,.25,0);
for(const a of[-1,1]){for(const c of[-1,1])part(g,'box',P.wd2,.07,.52,.07,a*w/2,.26,c*d/2);part(g,'box',P.wd2,.04,.55,.03,a*w*.2,.25,d/2+.01).rotation.z=a*.6;}
part(g,'box',P.wd2,w+.02,.05,d+.02,0,.5,0);part(g,'pyr',RF(rf),w*.82,.5,d*.82,0,.74,0);
win(g,0,.13,d/2+.01,.14,.22,0,P.wd2);win(g,-w*.3,.32,d/2+.01,.1,.12,0,0xfff0a0,0xffd24a);win(g,w*.3,.32,d/2+.01,.1,.12,0,0xfff0a0,0xffd24a);chim(g,w*.25,.9,-d*.1);}
// a burnt-out house: broken stone walls with sooty tops, charred beams, a fallen roof and maybe a fire still going
function ruin(x,z,ry,w,d,burn){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.rotation.y=ry;ST.add(g);keepOut.push([x,z,Math.max(w,d)*.75]);part(g,'box',0x2a2420,w,.04,d,0,.02,0);
for(const[ax,len,ox,oz]of[[1,w,0,d/2],[1,w,0,-d/2],[0,d,w/2,0],[0,d,-w/2,0]])for(let i=0;i<3;i++){if(Math.random()<.22)continue;const h=rnd(.1,.55),u=-len/2+(i+.5)*len/3;
part(g,'box',[P.st2,P.st][i%2],ax?len/3*.98:.08,h,ax?.08:len/3*.98,ax?u:ox,h/2,ax?oz:u);part(g,'box',0x2a2522,ax?len/3*.99:.085,.05,ax?.085:len/3*.99,ax?u:ox,h-.02,ax?oz:u);}
for(let i=0;i<3;i++){const b=part(g,'box',0x1c1816,.05,.05,rnd(.5,.9)*w,rnd(-w/3,w/3),rnd(.05,.3),rnd(-d/3,d/3));b.rotation.set(rnd(-.5,.5),rnd(0,3),rnd(-.4,.4));}
if(Math.random()<.6){const r=part(g,'box',RF(0x5a3a2c),w*.6,.04,d*.55,rnd(-.1,.1),.16,rnd(-.1,.1));r.rotation.set(rnd(-.4,.4),rnd(0,1),rnd(-.4,.4));}
for(let i=0;i<10;i++){const s2=rnd(.04,.11),m=part(g,'oct',[P.st,P.st2,0x3a3430][i%3],s2,s2*.7,s2,rnd(-w*.7,w*.7),s2*.3,rnd(-d*.7,d*.7));m.rotation.set(rnd(0,3),rnd(0,6),0);}
part(g,'box',P.st2,.13,.7,.13,w*.25,.35,-d*.1);if(burn)fire(g,rnd(-w/5,w/5),.03,rnd(-d/5,d/5),rnd(.7,1.1));else if(Math.random()<.4){g.updateWorldMatrix(true,false);const v=new THREE.Vector3(w*.25,.75,-d*.1);g.localToWorld(v);emit.push([v.x,v.y,v.z]);}return g;}
// board
{const gt=GTX.a.clone(),gn=GTX.n.clone();gt.needsUpdate=gn.needsUpdate=true;gt.repeat.set(.35,.35);gn.repeat.set(.35,.35);
const top=new THREE.MeshStandardMaterial({map:gt,normalMap:gn,color:new THREE.Color(TH.bd).convertSRGBToLinear(),roughness:.95,envMapIntensity:.5}),side=mat(0x5a4632);
const pl=part(sc,'box',[side,side,top,side,side,side],W+.4,.3,H+.4,0,-.15,0);pl.castShadow=false;pl.receiveShadow=true;L1(pl);}
const RDM=PBR(TX.road,TH.rd);
for(const k of road){const[c,r]=k.split(',').map(Number);flat(RDM,1.01,.06,1.01,cx(c),0,cz(r));}
for(const o of[...ENT,GATE])flat(RDM,1.01,.2,1.01,cx(o.c),-.07,cz(o.r));
const PADG=new THREE.CircleGeometry(.07,16);PADG.rotateX(-PI/2);const PADM=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.28,depthWrite:false}),pads=[];
for(let c=0;c<W;c++)for(let r=0;r<H;r++){if(road.has(c+','+r)||blk.has(c+','+r))continue;const m=L1(new THREE.Mesh(PADG,PADM));m.position.set(cx(c),.02,cz(r));sc.add(m);pads.push({c,r,m});}
function updPads(){for(const p of pads)p.m.visible=!g.sel&&free(p.c,p.r);}
function spot(m){for(;;){const c=Math.floor(rnd(0,W)),r=Math.floor(rnd(0,H)),rd=road.has(c+','+r);if(m==0&&(rd||blk.has(c+','+r))||m==1&&!rd)continue;const dx=rnd(-.5,.5),dz=rnd(-.5,.5);if(!rd&&Math.hypot(dx,dz)<.4)continue;return{x:cx(c)+dx,z:cz(r)+dz,y:rd?.03:0};}}
const cb=[];for(const k of road){const[c,r]=k.split(',').map(Number);for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){if(road.has((c+dx)+','+(r+dz))||c+dx<0||c+dx>=W||r+dz<0||r+dz>=H)continue;for(const o of[-.25,.25])cb.push({x:cx(c)+dx*.47+(dz?o:0),z:cz(r)+dz*.47+(dx?o:0),dx,dz});}}
scatter('box',mat(0xffffff),cb.length,i=>{const q=cb[i];return{x:q.x,y:-.01,z:q.z,sx:q.dz?.46:.1,sy:.12,sz:q.dx?.46:.1,col:[0xf7f2e6,0xece5d6,0xd9d0bd][i%3]};});
scatter('sph',mat(0xffffff),150,i=>{const p=spot(1);return{x:p.x,y:p.y+.01,z:p.z,sx:rnd(.05,.1),sy:.02,sz:rnd(.05,.1),col:[0xfff4d0,0xd9c48e,0xc9b27a][i%3]};});
if(TH.peb)scatter('oct',mat(0xffffff),TH.peb,i=>{const p=spot(0),s2=rnd(.03,.08);return{x:p.x,y:s2*.3,z:p.z,sx:s2,sy:s2*.6,ry:rnd(0,6),col:[TH.gr[3],TH.gr[1],TH.gr[2]][i%3]};});
const WT={value:0},WN=TX.grain.n.clone();WN.needsUpdate=true;WN.repeat.set(10,10);
function windify(m){m.onBeforeCompile=sh=>{sh.uniforms.uT=WT;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uT;').replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*.7+instanceMatrix[3].z*.9;\n#else\nfloat ph=position.x*3.+position.z*3.;\n#endif\ntransformed.x+=sin(uT*2.2+ph)*.05*position.y;transformed.z+=cos(uT*1.7+ph)*.035*position.y;');};return m;}
const mkC=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;};
TX.leafy=genTex(256,(x,y)=>{const n=fbm(x/256*12,y/256*12,12,12,4),m=fbm(x/256*40,y/256*40,40,40,2),l=.45+.5*n+.25*(m-.5);return[l,l,l,.5*n+.5*m];},3);
const GS=TH.gs,GRASST=mkC(64,128,(x,w,h)=>{for(let i=0;i<9;i++){const bx=rnd(8,56),bh=rnd(60,120),bw=rnd(3,6),lean=rnd(-14,14),gr=x.createLinearGradient(0,h,0,h-bh);gr.addColorStop(0,GS[5]);gr.addColorStop(1,'hsl('+rnd(GS[0],GS[1])+','+GS[2]+'%,'+rnd(GS[3],GS[4])+'%)');x.fillStyle=gr;x.beginPath();x.moveTo(bx-bw,h);x.quadraticCurveTo(bx,h-bh*.6,bx+lean,h-bh);x.quadraticCurveTo(bx+bw*.2,h-bh*.6,bx+bw,h);x.fill();}});
const FLT=c=>mkC(64,128,(x,w,h)=>{x.strokeStyle='#3f7a2c';x.lineWidth=3;x.beginPath();x.moveTo(32,h);x.quadraticCurveTo(28,80,32,40);x.stroke();x.fillStyle='#4f9a36';x.beginPath();x.ellipse(24,88,10,4,-.5,0,7);x.fill();x.beginPath();x.ellipse(40,72,10,4,.5,0,7);x.fill();
for(let i=0;i<6;i++){const a=i/6*PI*2;x.fillStyle=c;x.beginPath();x.ellipse(32+Math.cos(a)*10,32+Math.sin(a)*10,9,6,a,0,7);x.fill();}x.fillStyle='#ffd24a';x.beginPath();x.arc(32,32,6,0,7);x.fill();});
const LEAF=mkC(256,256,(x,w,h)=>{for(let i=0;i<170;i++){const a=rnd(0,PI*2),r=Math.sqrt(Math.random())*105,rot=rnd(0,PI*2),l=rnd(16,26),wd=rnd(7,12),v=rnd(55,100);x.save();x.translate(128+Math.cos(a)*r,128+Math.sin(a)*r);x.rotate(rot);x.fillStyle='hsl(0,0%,'+v+'%)';x.beginPath();x.ellipse(0,0,wd,l,0,0,PI*2);x.fill();x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;x.stroke();x.strokeStyle='rgba(255,255,255,.4)';x.beginPath();x.moveTo(0,-l);x.lineTo(0,l);x.stroke();x.restore();}});
const NEEDLE=mkC(256,256,(x,w,h)=>{x.strokeStyle='#8a8a8a';x.lineWidth=4;x.beginPath();x.moveTo(128,252);x.lineTo(128,8);x.stroke();for(let i=0;i<110;i++){const y=250-i*2.2,sd=i%2?1:-1,len=rnd(30,70)*(1-i/160),v=rnd(60,100);x.strokeStyle='hsl(0,0%,'+v+'%)';x.lineWidth=rnd(2,3.5);x.beginPath();x.moveTo(128,y);x.lineTo(128+sd*len,y-rnd(8,24));x.stroke();}});
const CROSS=(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0,0,0,-.5,0,0,.5,0,1,.5,0,1,-.5]),3));g.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(24).map((v,i)=>i%3==1?1:0),3));g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),2));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);return g;})();
const PM2=t=>windify(new THREE.MeshStandardMaterial({map:t,alphaTest:.45,side:THREE.DoubleSide,roughness:1,envMapIntensity:.3}));
const outside=(x,z)=>(Math.abs(x)<HX+1.23&&Math.abs(z)<HZ+1.43)||inC(x,z,6.4,15,-1.6,7.2);
const GCL=TH.gc;
if(TH.gn[0])scatter(CROSS,PM2(GRASST),TH.gn[0],i=>{const p=spot(0);return{x:p.x,y:p.y,z:p.z,sx:rnd(.28,.5),sy:rnd(.22,.38),ry:rnd(0,PI),col:GCL[i%Math.min(3,GCL.length)]};});
if(TH.gn[1])scatter(CROSS,PM2(GRASST),TH.gn[1],i=>{const x=rnd(-HX-19.8,HX+19.8),z=rzf(-HZ-15.8,HZ+11.8);if(outside(x,z))return null;return{x,y:gh(x,z),z,sx:rnd(.35,.65),sy:rnd(.3,.5)*(LV.th=='marsh'?1.8:1),ry:rnd(0,PI),col:GCL[i%GCL.length]};});
TH.fl.forEach(c=>{const fm=PM2(FLT(c));scatter(CROSS,fm,60,i=>{let x,z,y=0;if(i<24){const q=spot(0);x=q.x;z=q.z;}else{x=rnd(-HX-17.8,HX+17.8);z=rzf(-HZ-13.8,HZ+9.8);if(outside(x,z))return null;y=gh(x,z);}return{x,y,z,sx:rnd(.16,.26),sy:rnd(.28,.42),ry:rnd(0,PI),col:0xffffff};});});
const flies=[];for(let i=0;i<TH.fly;i++){const g2=new THREE.Group(),wm=new THREE.MeshBasicMaterial({color:new THREE.Color([0xff9a3c,0xffe45a,0x7ab8ff,0xff7ab8,0xffffff][i%5]).convertSRGBToLinear(),side:THREE.DoubleSide}),wg=new THREE.PlaneGeometry(.14,.1);wg.translate(.07,0,0);
const h1=new THREE.Group(),h2=new THREE.Group();h2.rotation.y=PI;const w1=L1(new THREE.Mesh(wg,wm)),w2=L1(new THREE.Mesh(wg,wm));w1.rotation.x=w2.rotation.x=-PI/2;h1.add(w1);h2.add(w2);g2.add(h1,h2);sc.add(g2);flies.push({g:g2,h1,h2,a:rnd(0,6),cx:rnd(-HX+1.2,HX-1.2),cz:rnd(-HZ+1.2,HZ-1.2)+.3,r:rnd(.8,2),sp:rnd(.3,.7),y:rnd(.4,1)});}
// walls with a gap for every breach (2.6 wide) and for the gate (1.6 wide), banners on the far wall, a turret on each corner
{const gaps={N:[],S:[],E:[],W:[]},along=o=>o.sd=='N'||o.sd=='S'?o.x:o.z;for(const o of ENT)gaps[o.sd].push([along(o),1.3]);gaps[GATE.sd].push([along(GATE),.8]);
const run=(sd,a1,fn)=>{let a=-a1;for(const[c,h]of gaps[sd].slice().sort((p,q)=>p[0]-q[0])){if(c-h>a)fn(a,c-h);a=c+h;}if(a1>a)fn(a,a1);};
run('N',HX,(a,b)=>wall(a,-HZ,b,-HZ));run('S',HX,(a,b)=>wall(a,HZ,b,HZ));run('W',HZ,(a,b)=>wall(-HX,a,-HX,b));run('E',HZ,(a,b)=>wall(HX,a,HX,b));
const bs=ZF>0?'N':'S',bz=ZF*(.18-HZ),nb=Math.floor((HX-1.2)/2);
for(let i=-nb;i<=nb;i++){const x=i*2;if(gaps[bs].some(([c,h])=>Math.abs(x-c)<h+.3))continue;part(ST,'box',[P.rd,P.bl][(i+nb)%2],.3,.5,.02,x,.02,bz);part(ST,'box',P.gd,.3,.04,.025,x,.22,bz+ZF*.005);}}
for(const[x,z]of[[-HX,-HZ],[HX,-HZ],[-HX,HZ],[HX,HZ]])turret(x,z,.9,.3,P.rd);
// the breach scenery was modelled at the west wall (x=-6.17) around z=-2.5; each breach gets its own copy, turned to its wall
ENT.forEach((o,bi)=>{const BP=new THREE.Group();BP.position.set(o.x,0,o.z);BP.rotation.y=o.rot;ST.add(BP);const br=new THREE.Group();br.position.set(0,-.15,2.5);BP.add(br);ST.updateMatrixWorld(true);
for(const[z0,dir]of[[-3.8,1],[-1.2,-1]])for(let j=0;j<5;j++){const hh=[.42,.34,.26,.17,.1][j]+rnd(-.03,.03),b=part(br,'box',[P.st,P.st3][j%2],.36+rnd(-.04,.04),hh,.17,rnd(-.03,.03),hh/2,z0+dir*(.1+j*.17));b.rotation.set(rnd(-.05,.05),rnd(-.12,.12),rnd(-.05,.05));}
part(br,'tap',P.st,.38,.7,.38,0,.35,-.75);for(let i=0;i<7;i++){const an=i/7*2*PI,hh=rnd(.1,.35);part(br,'box',P.st3,.1,hh,.12,.34*Math.sin(an),.7+hh/2,-.75+.34*Math.cos(an)).rotation.y=an;}
for(let i=0;i<46;i++){const z=rnd(-3.95,-.9);if(Math.abs(z+2.5)<.55&&i%3)continue;const sz=i<8?rnd(.2,.38):rnd(.05,.17),m=part(br,'oct',[P.st,P.st2,P.st3,0xb9b4c4][i%4],sz,sz*rnd(.55,1),sz*rnd(.7,1.1),rnd(-1.6,.7),sz*.4,z);m.rotation.set(rnd(0,3),rnd(0,6),rnd(0,3));}
for(let i=0;i<9;i++){const m=part(br,'box',P.st3,.1,.17,.14,rnd(-1.1,.4),.06,rnd(-3.9,-1.0));m.rotation.set(rnd(-.6,.6),rnd(0,6),rnd(-.6,.6));}
for(let i=0;i<6;i++){const m=L1(new THREE.Mesh(BLG,BLM));m.scale.set(rnd(1,1.7),1,rnd(1,1.7));m.position.set(rnd(-1.3,.5),.04,rnd(-3.9,-1.1));br.add(m);}
fire(br,-.2,0,-3.55,1);fire(br,.05,0,-1.45,1.2);fire(br,-1.0,0,-.9,.8);flags.push(flag(br,-.4,0,-3.95,0x2a1a2a,1.3));flags.push(flag(br,-.5,0,-1.05,0x2a1a2a,1.3));
const rm=new THREE.Group();rm.position.set(-2.43,-.15,1);rm.rotation.y=-.15;BP.add(rm);part(rm,'cyl',P.wd2,.12,1.5,.12,0,.42,0).rotation.z=PI/2;part(rm,'cone',0x4a5568,.14,.28,.14,.88,.42,0).rotation.z=-PI/2;
for(const x of[-.45,.45])for(const z of[-.22,.22])part(rm,'box',P.wd,.06,.45,.06,x,.22,z);part(rm,'box',P.wd,1.1,.05,.5,0,.5,0);for(const x of[-.4,.4])for(const z of[-.3,.3])part(rm,'cyl',P.wd2,.14,.05,.14,x,.14,z).rotation.x=PI/2;});
// the castle was modelled for a gate on the east wall at z=2.5: CI holds those original coordinates and is turned to face the level's gate
{const CP=new THREE.Group();CP.position.set(GATE.x,0,GATE.z);CP.rotation.y=GATE.rot;ST.add(CP);const CI=new THREE.Group();CI.position.set(-6.17,0,-2.5);CP.add(CI);
turret(6.17,1.7,1.5,.34,P.rd,CI);turret(6.17,3.3,1.5,.34,P.rd,CI);part(CI,'box',P.st,.4,.26,1.4,6.17,1.22,2.5);part(CI,'box',P.st3,.5,.08,1.46,6.17,1.4,2.5);
const CG=new THREE.Group();CG.position.y=-.15;CI.add(CG);ST.updateMatrixWorld(true);const X0=8.2,X1=12.8,Z0=.2,Z1=4.8,WH=1.2;
// moat: a sunken channel around the castle (castle coordinates) with stone banks, a dark bed that shallows at the edges, double-scrolling ripples, lily pads and rings on the water
{const O={x0:6.95,x1:14.05,z0:-1.05,z1:6.05},I={x0:7.6,x1:13.4,z0:-.4,z1:5.4},ins=(r,d)=>({x0:r.x0+d,x1:r.x1-d,z0:r.z0+d,z1:r.z1-d});
const ring=(o,i,y,m)=>{const sh=new THREE.Shape(),rc=(p,r,cw)=>{const q=cw?[[r.x0,r.z0],[r.x0,r.z1],[r.x1,r.z1],[r.x1,r.z0]]:[[r.x0,r.z0],[r.x1,r.z0],[r.x1,r.z1],[r.x0,r.z1]];p.moveTo(q[0][0],-q[0][1]);for(const v of q.slice(1))p.lineTo(v[0],-v[1]);p.closePath();};
rc(sh,o);const h=new THREE.Path();rc(h,i,1);sh.holes.push(h);const g2=new THREE.ShapeGeometry(sh);g2.rotateX(-PI/2);g2.translate(0,y,0);const mm=L1(new THREE.Mesh(g2,m));mm.receiveShadow=true;CI.add(mm);return mm;};
const wc=new THREE.Color(TH.wc||0x1f4a58),bm2=c=>new THREE.MeshStandardMaterial({color:new THREE.Color(c).convertSRGBToLinear(),roughness:1});
ring(O,I,-.14,bm2(wc.clone().multiplyScalar(.22).getHex()));ring(O,ins(O,.15),-.13,bm2(0x5a5a42));ring(ins(I,-.15),I,-.13,bm2(0x5a5a42));ring(ins(O,.15),ins(O,.27),-.135,bm2(wc.clone().lerp(new THREE.Color(0x5a5a42),.5).multiplyScalar(.6).getHex()));ring(ins(I,-.27),ins(I,-.15),-.135,bm2(wc.clone().lerp(new THREE.Color(0x5a5a42),.5).multiplyScalar(.6).getHex()));
const WV=genTex(128,(x,y)=>[.5,.5,.5,fbm(x/128*4,y/128*4,4,4,4)*.7+fbm(x/128*16,y/128*16,16,16,2)*.3],5).n;
const WM=new THREE.MeshStandardMaterial({color:wc.clone().convertSRGBToLinear(),roughness:.12,metalness:.1,transparent:true,opacity:.72,normalMap:WV,normalScale:new THREE.Vector2(.7,.7),envMapIntensity:1.05,depthWrite:false});
WM.onBeforeCompile=sh=>{sh.uniforms.uT=WT;sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform float uT;').replace('vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;','vec3 mapN = normalize( texture2D( normalMap, vUv*.8 + vec2( uT*.03, uT*.017 ) ).xyz * 2.0 - 1.0 + texture2D( normalMap, vUv*1.3 + vec2( -uT*.021, uT*.027 ) ).xyz * 2.0 - 1.0 );');};
ring(O,I,-.1,WM).renderOrder=1;
const bridge=(x,z)=>x<7.8&&z>1.85&&z<3.15;
function kerb(x1,z1,x2,z2){const Lk=Math.hypot(x2-x1,z2-z1),a=Math.abs(x2-x1)>Math.abs(z2-z1),n=Math.ceil(Lk/.32);for(let k=0;k<n;k++){const u=(k+.5)/n,x=x1+(x2-x1)*u,z=z1+(z2-z1)*u;if(bridge(x,z))continue;
const b=part(CI,'box',[P.st2,P.st,P.st3][k%3],a?Lk/n*.95:.14,.1+rnd(-.015,.015),a?.14:Lk/n*.95,x,-.09,z);b.rotation.y=rnd(-.06,.06);}}
for(const[r,d]of[[O,-.04],[I,.04]]){const q=ins(r,d);kerb(q.x0,q.z0,q.x1,q.z0);kerb(q.x0,q.z1,q.x1,q.z1);kerb(q.x0,q.z0,q.x0,q.z1);kerb(q.x1,q.z0,q.x1,q.z1);}
const chs=[[O.x0,O.x1,O.z0,I.z0],[O.x0,O.x1,I.z1,O.z1],[O.x0,I.x0,I.z0,I.z1],[I.x1,O.x1,I.z0,I.z1]],mp=()=>{for(;;){const c=chs[Math.random()<.7?Math.random()*2|0:2+(Math.random()*2|0)],x=rnd(c[0]+.14,c[1]-.14),z=rnd(c[2]+.14,c[3]-.14);if(!bridge(x,z))return{x,z};}};
if(['meadow','darkwood','marsh'].includes(LV.th))for(let k=0;k<18;k++){const q=mp(),pd=part(CI,'cyl',k%3?0x4f7a34:0x5e8a3c,rnd(.06,.1),.012,rnd(.06,.1),q.x,-.094,q.z);pd.rotation.y=rnd(0,6);pd.castShadow=false;if(k%4==0)part(CI,'sph',k%8?0xf3b6cf:0xfff6e8,.03,.025,.03,q.x+.02,-.075,q.z);}
for(let k=0;k<7;k++){const m=L1(new THREE.Mesh(RIPG,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false})));CI.add(m);ripples.push({m,t:-rnd(0,3),d:rnd(1.5,2.5),mp});}}
function cwall(x1,z1,x2,z2,h){const L=Math.hypot(x2-x1,z2-z1),a=Math.abs(x2-x1)>Math.abs(z2-z1),cx=(x1+x2)/2,cz=(z1+z2)/2,n2=Math.ceil(L),n=Math.floor(L/.5);
for(let i=0;i<n2;i++){const u=-L/2+(i+.5)*L/n2;part(CG,'box',[P.st,P.st3][i%2],a?L/n2*.99:.44,h,a?.44:L/n2*.99,a?cx+u:cx,h/2,a?cz:cz+u);}
for(let i=0;i<n;i++){const u=-L/2+(i+.5)*L/n;part(CG,'box',P.st3,a?.3:.44,.24,a?.44:.3,a?cx+u:cx,h+.12,a?cz:cz+u);}part(CG,'box',P.st2,a?L:.54,.08,a?.54:L,cx,h-.06,cz);}
function twr(x,z,r,h,roof,rows){const g=new THREE.Group();g.position.set(x,0,z);CG.add(g);part(g,'cyl',P.st2,r*1.1,.12,r*1.1,0,.06,0);part(g,'tap',P.st,r,h,r,0,h/2,0);part(g,'cyl',P.st2,r*.97,.07,r*.97,0,h*.45,0);part(g,'cyl',P.st3,r*1.16,.14,r*1.16,0,h-.07,0);
for(let i=0;i<14;i++){const an=i/14*2*PI;part(g,'box',P.st2,.1,.1,.14,r*1.08*Math.sin(an),h-.19,r*1.08*Math.cos(an)).rotation.y=an;}
const H2=h*.6;part(g,'cyl',RF(roof),r*1.22,.07,r*1.22,0,h+.03,0);part(g,'cone',RF(roof),r*1.2,H2,r*1.2,0,h+H2/2,0);part(g,'sph',P.gd,.05,.05,.05,0,h+H2+.02,0);
for(const f of rows||[.35,.7])for(let q=0;q<4;q++){const an=q*PI/2+(f>.5?PI/4:0),rr=r*(1-.22*f)+.005,gw=f>.5||q==0;win(g,rr*Math.sin(an),h*f,rr*Math.cos(an),.07,.15,an,gw?0xfff0a0:0x2a2140,gw?0xffd24a:undefined);}
flags.push(flag(g,0,h+H2+.03,0,roof,Math.max(.9,r*1.8)));return g;}
twr(X0,Z0,.58,2.4,P.bl);twr(X1,Z0,.58,2.4,P.rd);twr(X0,Z1,.58,2.4,P.rd);twr(X1,Z1,.58,2.4,P.bl);twr(10.5,Z0,.42,1.9,P.rd,[.4]);twr(10.5,Z1,.42,1.9,P.bl,[.4]);twr(X1,2.5,.45,2.0,P.bl,[.4,.75]);twr(X0,1.55,.45,2.2,P.rd);twr(X0,3.45,.45,2.2,P.rd);
cwall(X0,Z0,X0,1.55,WH);cwall(X0,3.45,X0,Z1,WH);cwall(X0,Z0,X1,Z0,WH);cwall(X0,Z1,X1,Z1,WH);cwall(X1,Z0,X1,Z1,WH);
part(CG,'box',P.st,.56,.4,1.9,X0,1.45,2.5);part(CG,'box',P.st3,.64,.1,2.0,X0,1.7,2.5);part(CG,'box',P.st2,.6,.22,.3,X0,1.2,2.5);
for(let i=0;i<7;i++)part(CG,'box',0x4a4a5a,.04,.5,.04,X0-.14,.92,2.1+i*.133);for(let j=0;j<3;j++)part(CG,'box',0x4a4a5a,.04,.04,.9,X0-.14,.78+j*.16,2.5);
part(CG,'box',P.wd,.45,.9,.06,X0+.4,.45,2.12).rotation.y=-.9;part(CG,'box',P.wd,.45,.9,.06,X0+.4,.45,2.88).rotation.y=.9;
part(CG,'box',P.wd,1.3,.06,.9,7.55,.07,2.5);rod(CG,X0,1.6,2.0,7.0,.12,2.0,.02,0x5a5a68);rod(CG,X0,1.6,3.0,7.0,.12,3.0,.02,0x5a5a68);torch(CG,X0-.62,.8,1.9);torch(CG,X0-.62,.8,3.1);
part(CG,'box',P.st2,X1-X0-.5,.1,Z1-Z0-.5,(X0+X1)/2,0,(Z0+Z1)/2);
const K=twr(11.9,2.5,.82,3.8,P.rd,[.25,.45,.65,.85]);KEEP=K;K.userData.keep=true;part(K,'cyl',P.st3,.98,.08,.98,0,2.6,0);for(let i=0;i<16;i++){const an=i/16*2*PI;part(K,'cyl',P.wd,.015,.14,.015,.95*Math.sin(an),2.69,.95*Math.cos(an));}
for(const z of[-.42,.42]){part(K,'box',P.rd,.03,.9,.34,-.8,2.0,z);part(K,'box',P.gd,.035,.05,.34,-.8,2.42,z);}win(K,-.82,.45,0,.34,.55,-PI/2,P.wd2);
for(let i=0;i<3;i++)part(CG,'box',P.st3,.2,.06+.06*i,.8,10.55+i*.2,(.06+.06*i)/2,2.5);
const hl=new THREE.Group();hl.position.set(9.8,0,3.6);CG.add(hl);part(hl,'box',P.st,2.3,1.4,1.2,0,.7,0);part(hl,'box',P.wd2,2.36,.08,1.26,0,1.4,0);part(hl,'pyr',RF(P.bl),1.8,.9,.94,0,1.85,0);
for(let i=0;i<4;i++){win(hl,-.85+i*.57,.9,.61,.1,.3,0,0xfff0a0,0xffd24a);win(hl,-.85+i*.57,.9,-.61,.1,.3,PI,0xfff0a0,0xffd24a);}win(hl,0,.28,.61,.4,.5,0,P.wd2);chim(hl,.7,1.9,0);
const ch=new THREE.Group();ch.position.set(9.6,0,1.0);CG.add(ch);part(ch,'box',P.st,1.0,1.0,.8,0,.5,0);part(ch,'pyr',RF(P.rd),.78,.7,.62,0,1.25,0);part(ch,'tap',P.st,.18,1.4,.18,.45,.7,.35);part(ch,'cone',RF(P.bl),.24,.5,.24,.45,1.65,.35);part(ch,'sph',P.gd,.04,.04,.04,.45,1.92,.35);win(ch,0,.5,.41,.16,.4,0,0xaee6ff,0x6ac0ff);
const sb=new THREE.Group();sb.position.set(11.9,0,4.2);CG.add(sb);part(sb,'box',P.wd,1.3,.7,.6,0,.35,0);part(sb,'pyr',RF(0xd9b45a),1.0,.5,.46,0,.95,0);win(sb,-.3,.3,.31,.3,.4,0,0x3b2a1a);
part(CG,'cyl',P.st,.22,.28,.22,10.0,.19,1.9);part(CG,'cyl',P.wd,.02,.5,.02,9.82,.5,1.9);part(CG,'cyl',P.wd,.02,.5,.02,10.18,.5,1.9);part(CG,'pyr',RF(P.rd),.3,.18,.3,10.0,.82,1.9);
for(const[x,z]of[[8.7,4.45],[8.95,4.5],[8.8,4.25],[12.3,1.1],[12.5,1.4]]){part(CG,'cyl',P.wd,.11,.22,.11,x,.16,z);part(CG,'tor',0x4a5568,.11,.11,.11,x,.14,z).rotation.x=PI/2;}
for(const[x,z]of[[9.1,.7],[9.35,.7],[12.4,3.9]])part(CG,'box',P.wd,.22,.2,.22,x,.15,z);
const gd=new THREE.Group();gd.position.y=.05;CG.add(gd);for(const[x,z,c]of[[8.8,2.1,0x5d7094],[8.8,2.9,0x5d7094],[10.5,2.2,0x8e2a2a],[11.0,1.2,0x5d7094]])chibi(gd,x,z,c,0x9aa3b0,false);
for(const[x,z]of[[9.3,Z0+.3],[11.2,Z0+.3],[9.3,Z1-.3],[11.2,Z1-.3]])torch(CG,x,.7,z);
for(const x of[9.0,10.0,11.4,12.2]){part(CG,'box',[P.rd,P.bl][(x*10|0)%2],.34,.6,.02,x,.62,Z0+.24);part(CG,'box',P.gd,.34,.04,.025,x,.88,Z0+.24);part(CG,'box',[P.bl,P.rd][(x*10|0)%2],.34,.6,.02,x,.62,Z1-.24);}}
// trees, bushes, rocks
const LEAFM={},NEEDM={},FOLM={},QD=new THREE.PlaneGeometry(1,1);
const leafMat=c=>LEAFM[c]||(LEAFM[c]=windify(new THREE.MeshStandardMaterial({map:LEAF,alphaTest:.45,side:THREE.DoubleSide,color:new THREE.Color(c).convertSRGBToLinear(),roughness:.9,envMapIntensity:.5})));
const needMat=c=>NEEDM[c]||(NEEDM[c]=windify(new THREE.MeshStandardMaterial({map:NEEDLE,alphaTest:.45,side:THREE.DoubleSide,color:new THREE.Color(c).convertSRGBToLinear(),roughness:.9,envMapIntensity:.5})));
const folMat=c=>FOLM[c]||(FOLM[c]=windify(PBR(TX.leafy,c,{roughness:.85})));
function card(g,m,x,y,z,s,rx,ry,rz){const q=new THREE.Mesh(QD,m);q.rotation.order='YXZ';q.position.set(x,y,z);q.scale.set(s,s,s);q.rotation.set(rx,ry,rz);q.castShadow=true;g.add(q);return q;}
function pine(g,H,pc){pc=pc||[0x2f6b3a,0x4a9a52,0x358a46];part(g,'cone',P.wd2,.14,.22,.14,0,.1,0);part(g,'tap',P.wd2,.07,H*.9,.07,0,H*.45,0);const T6=6;
for(let i=0;i<T6;i++){const f=i/(T6-1),r=.55*(1-f*.8),y=.3+f*(H-.55);part(g,'cone',folMat(pc[0]),r*.85,.5-f*.12,r*.85,0,y+.2,0);
for(let j=0;j<8;j++){const a=j/8*PI*2+i*.6;card(g,needMat(i%2?pc[1]:pc[2]),Math.sin(a)*r*.6,y+.15,Math.cos(a)*r*.6,r*1.15,1.8,a,0);}}
part(g,'cone',folMat(pc[0]),.12,.35,.12,0,H+.05,0);}
function broad(g,k){const H=rnd(.85,1.15),tc=k==3?0xe9e5da:P.wd2,cols=k==2?[0xf2a63a,0xe0802a,0xffc15a]:k==3?[0xb8dc6a,0xa4cf58,0xd4ec8c]:TH.leaf&&(k==8||LV.th=='darkwood')?TH.leaf:[0x4aa84e,0x62bf5a,0x3a8f48];
part(g,'tap',tc,.11,H,.11,0,H/2,0);for(let i=0;i<5;i++){const a=i*1.26;part(g,'sph',tc,.07,.05,.07,Math.sin(a)*.1,.04,Math.cos(a)*.1);}
const tips=[];for(let i=0;i<4;i++){const a=i*PI/2+rnd(0,.6);tips.push([Math.sin(a)*.5,H+.35+rnd(0,.15),Math.cos(a)*.5]);const m=part(g,'tap',tc,.04,.6,.04,Math.sin(a)*.22,H+.26,Math.cos(a)*.22);m.rotation.set(Math.cos(a)*.75,0,-Math.sin(a)*.75);}
tips.push([0,H+.6,0]);tips.forEach((t,i)=>{const R2=.42+rnd(0,.08);part(g,'sph',folMat(cols[i%3]),R2,R2*.85,R2,t[0],t[1],t[2]);
for(let j=0;j<7;j++)card(g,leafMat(cols[(i+j)%3]),t[0]+rnd(-.42,.42),t[1]+rnd(-.2,.3),t[2]+rnd(-.42,.42),rnd(.6,.9),rnd(-.7,.7),rnd(0,PI),rnd(-.5,.5));});
if(k==8)for(let i=0;i<14;i++){const t=tips[i%tips.length],l=rnd(.3,.7);part(g,'box',0x5a6a3a,.025,l,.025,t[0]+rnd(-.35,.35),t[1]-.25-l/2,t[2]+rnd(-.35,.35));}}
// bare branches, grown recursively; charred trees are near-black and some still burn at the tips
WOOD.add(0x6a5c50);
function dead(g,c,burn){const H=rnd(1.1,1.7);part(g,'tap',c,.1,H,.1,0,H/2,0);for(let i=0;i<4;i++){const a=i*1.3;part(g,'sph',c,.07,.05,.07,Math.sin(a)*.1,.04,Math.cos(a)*.1);}
const br=(px,py,pz,len,r,a,el,d)=>{const ce=Math.cos(el),ex=px+Math.sin(a)*ce*len,ey=py+Math.sin(el)*len,ez=pz+Math.cos(a)*ce*len;rod(g,px,py,pz,ex,ey,ez,r,c);
if(d>0)for(let i=0;i<2;i++)br(ex,ey,ez,len*.68,r*.62,a+rnd(-.9,.9),clamp(el+rnd(-.3,.45),-.2,1.3),d-1);else if(burn&&Math.random()<burn)flame(g,ex,ey,ez,rnd(.6,1),null,.28);};
for(let i=0;i<4;i++)br(0,H*rnd(.55,.95),0,rnd(.35,.55),.045,i*1.6+rnd(0,.8),rnd(.3,.8),2);br(0,H*.95,0,.4,.05,rnd(0,6),1.2,1);}
function tree(x,z,k,s){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.scale.setScalar(s);g.rotation.y=rnd(0,6);g.userData.ph=rnd(0,6);
if(k==0)pine(g,rnd(1.5,2.1));else if(k==6)pine(g,rnd(2.1,3.1),TH.pine);else if(k==7)pine(g,rnd(1.5,2.2),[0x221c1a,0x2e2420,0x3a2a22]);else if(k==4)dead(g,LV.th=='burning'||LV.th=='hell'?0x1f1a17:0x6a5c50);else if(k==5)dead(g,0x1c1714,.12);else broad(g,k);
if(k==7&&Math.random()<.4)flame(g,0,rnd(1,1.6),0,rnd(1.2,1.8));bake(g);sc.add(g);trees.push(g);}
function bush(x,z,s,fl){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.scale.setScalar(s);const cols=TH.leaf||[0x4aa84e,0x62bf5a,0x3a8f48];
for(let i=0;i<5;i++){const a=i*1.3,r=i?.22:0;part(g,'sph',folMat(cols[i%3]),.25,.2,.25,Math.sin(a)*r,.16,Math.cos(a)*r);for(let j=0;j<4;j++)card(g,leafMat(cols[(i+j)%3]),Math.sin(a)*r+rnd(-.25,.25),.15+rnd(0,.2),Math.cos(a)*r+rnd(-.25,.25),rnd(.3,.45),rnd(-.5,.5),rnd(0,PI),0);}
if(fl)for(let i=0;i<8;i++)part(g,'sph',fl[i%fl.length],.035,.035,.035,rnd(-.3,.3),.2+rnd(0,.2),rnd(-.3,.3));bake(g);sc.add(g);}
// no scenery on the board, the castle, the ground in front of each breach (where the army gathers) or near ruins
const inBr=(x,z)=>ENT.some((o,i)=>{const q=toB(x,z,i);return q.x<-6&&q.x>-11&&q.z>-5.4&&q.z<.4;});
const okSpot=(x,z,m)=>!(Math.abs(x)<HX+1.03+m&&Math.abs(z)<HZ+1.23+m)&&!inC(x,z,6.4,15,-1.6,7.2)&&!inBr(x,z)&&!keepOut.some(k=>Math.hypot(x-k[0],z-k[1])<k[2]);
// a ground-hugging pool (water, bog or lava) with a wobbly outline; y fixed on the board, else it follows the terrain
function pool(x,z,r,m,y){const g2=new THREE.RingGeometry(.001,1,30,5),p=g2.attributes.position,s1=rnd(0,6),s2=rnd(0,6);
for(let i=0;i<p.count;i++){const px=p.getX(i),py=p.getY(i),a=Math.atan2(py,px),k=r*(1+.18*Math.sin(3*a+s1)+.1*Math.sin(5*a+s2));p.setXYZ(i,px*k,0,-py*k);}
for(let i=0;i<p.count;i++){const px=p.getX(i),pz=p.getZ(i);p.setY(i,y!==undefined?y:gh(x+px,z+pz)+.03);}g2.computeVertexNormals();const o=L1(new THREE.Mesh(g2,m));o.position.set(x,0,z);o.receiveShadow=true;sc.add(o);return o;}
const LAVAT=mkC(128,128,(x,w,h)=>{x.fillStyle='#ff6a10';x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.fillStyle='rgba(255,'+(170+rnd(0,80)|0)+',60,.7)';x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(3,10),0,7);x.fill();}
for(let i=0;i<26;i++){x.fillStyle='rgba(40,10,4,.88)';x.beginPath();const px=rnd(0,w),py=rnd(0,h),n=6;for(let j=0;j<n;j++){const a=j/n*PI*2,rr=rnd(6,15);x.lineTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr);}x.fill();}});
LAVAT.wrapS=LAVAT.wrapT=THREE.RepeatWrapping;
const LAVA=new THREE.MeshBasicMaterial({map:LAVAT,side:THREE.DoubleSide});LAVA.color.setRGB(1.6,1.15,1);
const BOG=new THREE.MeshStandardMaterial({color:new THREE.Color(0x3a4a2e).convertSRGBToLinear(),roughness:.12,metalness:.1,transparent:true,opacity:.92,normalMap:WN,normalScale:new THREE.Vector2(.4,.4),envMapIntensity:1.1});
const GRV=PBR(TX.stone,0x8e8c96,{roughness:.9}),SPIRE=PBR(TX.rock,0xb87650),OBS=new THREE.MeshStandardMaterial({color:0x121016,roughness:.25,metalness:.4,envMapIntensity:1.2});
// a glowing crack in the ground: a ribbon that wanders and follows the terrain
function crack(x,z,len,w){const n=Math.ceil(len*4),pos=[],idx=[];let a=rnd(0,6),px=x,pz=z;for(let i=0;i<=n;i++){a+=rnd(-.5,.5);const ww=w*(1-Math.abs(i/n-.5)*1.6),nx=Math.cos(a+PI/2)*ww,nz2=Math.sin(a+PI/2)*ww;
pos.push(px+nx,gh(px+nx,pz+nz2)+.025,pz+nz2,px-nx,gh(px-nx,pz-nz2)+.025,pz-nz2);if(i)idx.push(i*2-2,i*2-1,i*2,i*2-1,i*2+1,i*2);px+=Math.cos(a)*.25;pz+=Math.sin(a)*.25;if(!okSpot(px,pz,0))break;}
const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g2.setAttribute('uv',new THREE.Float32BufferAttribute(pos.map((v,i)=>i%3==0?v*.3:i%3==2?v*.3:0).filter((v,i)=>i%3!=1),2));g2.setIndex(idx);sc.add(L1(new THREE.Mesh(g2,LAVA)));}
function mushroom(g,x,z,s,c,em){part(g,'cyl',0xe8e0cc,.03*s,.14*s,.03*s,x,.07*s,z);part(g,'sph',c,.08*s,.05*s,.08*s,x,.15*s,z,em);if(em)glow(g,x,.18*s,z,.35*s,em);}
function grave(g,x,z,ry,s){const k=new THREE.Group();k.position.set(x,0,z);k.rotation.set(rnd(-.12,.12),ry,rnd(-.12,.12));g.add(k);const t=Math.random()*3|0;
if(t==0){part(k,'box',GRV,.3*s,.36*s,.08*s,0,.18*s,0);part(k,'cyl',GRV,.15*s,.08*s,.15*s,0,.36*s,0).rotation.x=PI/2;}
else if(t==1){part(k,'box',GRV,.07*s,.5*s,.07*s,0,.25*s,0);part(k,'box',GRV,.28*s,.07*s,.07*s,0,.36*s,0);}else{part(k,'tap',GRV,.09*s,.6*s,.09*s,0,.3*s,0);part(k,'pyr',GRV,.1*s,.12*s,.1*s,0,.66*s,0);}
part(k,'sph',0x3a3028,.22*s,.06*s,.32*s,0,0,.25*s);}
function skull(g,x,y,z,s){part(g,'sph',0xe8e0cc,.07*s,.065*s,.075*s,x,y+.06*s,z);part(g,'box',0xe8e0cc,.07*s,.04*s,.05*s,x,y+.02*s,z+.03*s);for(const d of[-.025,.025])part(g,'sph',0x14100c,.016*s,.018*s,.01*s,x+d*s,y+.07*s,z+.07*s);}
function bones(g,x,z,s){for(let i=0;i<4;i++){const b=part(g,'cyl',0xe0d8c4,.015*s,.22*s,.015*s,x+rnd(-.15,.15)*s,.02,z+rnd(-.15,.15)*s);b.rotation.set(PI/2,0,rnd(0,6));}skull(g,x,0,z,s);}
function spire(g,x,z,s,m){let y=0,r=.35*s;for(let i=0;i<4;i++){const h=rnd(.35,.6)*s;part(g,'tap',m,r,h,r*rnd(.8,1),rnd(-.04,.04),y+h/2,rnd(-.04,.04)).rotation.y=rnd(0,6);y+=h*.92;r*=rnd(.68,.82);}part(g,'cone',m,r,.3*s,r,0,y+.12*s,0);}
function spikes(g,x,z,s){for(let i=0;i<5;i++){const h=rnd(.5,1.3)*s,a=rnd(0,6),d=i?rnd(.1,.3)*s:0,m=part(g,'cone',OBS,.09*s*rnd(.8,1.3),h,.09*s,x+Math.sin(a)*d,h/2*.9,z+Math.cos(a)*d);m.rotation.set(rnd(-.25,.25),0,rnd(-.25,.25));}}
const groupAt=(x,z,y)=>{const g=new THREE.Group();g.position.set(x,y!==undefined?y:gh(x,z),z);ST.add(g);return g;};
// a free spot outside the wall (for props); far = mostly on the side away from the camera
function freeSpot(m,far){for(let i=0;i<60;i++){const x=rnd(-HX-11,HX+11),z=far?rzf(-HZ-9,HZ*.3):rzf(-HZ-9,HZ+6);if(okSpot(x,z,m))return{x,z};}return null;}
// biome scenery outside the wall
if(LV.th=='meadow'){house(7.8,-5.4,.3,1.2,.9,P.rd);house(-8.3,3.2,1.2,1,.9,0xf5a524);house(-7.6,-5.8,0,.9,.8,P.bl);house(4,-6.2,-.2,1,.9,0xf5a524);
{const g=new THREE.Group();g.position.set(10.5,gh(10.5,-4.4),-4.4);ST.add(g);part(g,'tap',P.st3,.4,1.2,.4,0,.6,0);part(g,'cone',RF(P.rd),.48,.45,.48,0,1.42,0);win(g,0,.3,.38,.12,.2,0,P.wd2);
mill=new THREE.Group();mill.position.set(0,1.05,.4);mill.userData.keep=true;part(mill,'box',P.wd,.09,1.5,.04,0,0,0);part(mill,'box',P.wd,1.5,.09,.04,0,0,0);part(mill,'sph',P.gd,.07,.07,.07,0,0,.03);
for(const[x,y,w,h]of[[.17,.5,.24,.5],[-.17,-.5,.24,.5],[.5,-.17,.5,.24],[-.5,.17,.5,.24]])part(mill,'box',0xfff6e0,w,h,.02,x,y,0);g.add(mill);}}
if(LV.th=='burning'||LV.th=='ruins'){const n=LV.th=='ruins'?14:9,KC0=CW(10.5,2.5);for(let i=0;i<n;i++){let p=null;for(let j=0;j<20&&!p;j++){const q=freeSpot(.6,i<n*.7);if(q&&Math.hypot(q.x-KC0.x,q.z-KC0.z)>6)p=q;}if(p)ruin(p.x,p.z,rnd(0,6),rnd(1,1.5),rnd(.85,1.15),LV.th=='burning'?i%3!=2:i%4==0);}}
if(LV.th=='darkwood'){for(let i=0;i<70;i++){const p=freeSpot(-.5);if(!p)continue;const g=groupAt(p.x,p.z),gl2=i%3==0;for(let j=0;j<3;j++)mushroom(g,rnd(-.2,.2),rnd(-.2,.2),rnd(.8,1.6),gl2?0x6ac8d8:[0xb8442e,0xc8a070][j%2],gl2?0x5ae0ff:undefined);}
for(let i=0;i<12;i++){const p=freeSpot(0);if(!p)continue;const g=groupAt(p.x,p.z,gh(p.x,p.z)+.1);g.rotation.y=rnd(0,6);part(g,'cyl',P.wd2,.11,rnd(1,1.8),.11,0,0,0).rotation.z=PI/2;}
for(let i=0;i<7;i++){const p=freeSpot(.5,true);if(!p)continue;const y=gh(p.x,p.z)+rnd(.4,.9);for(const d of[-.06,.06])glow(sc,p.x+d,y,p.z,.14,0xffd84a);}}
if(LV.th=='marsh'){for(let i=0;i<16;i++){const p=freeSpot(.4);if(p){pool(p.x,p.z,rnd(.6,1.8),BOG);keepOut.push([p.x,p.z,.9]);}}
for(let i=0;i<14;i++){const p=freeSpot(0);if(p){const g=groupAt(p.x,p.z);part(g,'tap',0x3a3024,.13,rnd(.2,.45),.13,0,.15,0);}}}
if(LV.th=='moor'){for(let i=0;i<60;i++){const p=freeSpot(-.4);if(!p)continue;const g=groupAt(p.x,p.z);grave(g,0,0,rnd(-.4,.4)+(ZF<0?PI:0),rnd(.9,1.3));}
for(let i=0;i<10;i++){const p=freeSpot(0);if(!p)continue;const g=groupAt(p.x,p.z),a=rnd(0,6);for(let j=0;j<4;j++){const ox=Math.cos(a)*j*.45,oz=Math.sin(a)*j*.45;part(g,'box',0x3a3028,.05,.4,.05,ox,.2,oz).rotation.z=rnd(-.2,.2);if(j)rod(g,ox,.3,oz,ox-Math.cos(a)*.45,.3+rnd(-.05,.05),oz-Math.sin(a)*.45,.02,0x3a3028);}}
for(let i=0;i<3;i++){const p=freeSpot(.8,true);if(p)ruin(p.x,p.z,rnd(0,6),rnd(1,1.3),rnd(.8,1),false);}
for(let i=0;i<10;i++){const p=freeSpot(0);if(p){const g=groupAt(p.x,p.z);bones(g,0,0,rnd(.8,1.2));}}}
if(LV.th=='badlands'||LV.th=='hell'){const hell=LV.th=='hell';for(let i=0;i<(hell?26:14);i++){const p=freeSpot(.3);if(p)crack(p.x,p.z,rnd(1.5,4),rnd(.06,.16));}
for(let i=0;i<(hell?10:5);i++){const p=freeSpot(.6);if(p){pool(p.x,p.z,rnd(.5,1.4),LAVA);keepOut.push([p.x,p.z,1]);}}
for(let i=0;i<(hell?30:22);i++){const p=freeSpot(.2,i%2==0);if(!p)continue;const g=groupAt(p.x,p.z,gh(p.x,p.z)-.05);if(hell)spikes(g,0,0,rnd(.8,1.8));else spire(g,0,0,rnd(.8,2),SPIRE);keepOut.push([p.x,p.z,.6]);}
for(let i=0;i<14;i++){const p=freeSpot(0);if(p){const g=groupAt(p.x,p.z);bones(g,0,0,rnd(.8,1.3));}}
if(hell)for(let i=0;i<8;i++){const p=freeSpot(.2);if(!p)continue;const g=groupAt(p.x,p.z);part(g,'cyl',0x1c1714,.03,1.1,.03,0,.55,0);skull(g,0,1.08,0,1.6);}}
if(LV.th=='marsh'||LV.th=='moor')for(let i=0;i<14;i++){const s2=new THREE.Sprite(new THREE.SpriteMaterial({map:GT,color:new THREE.Color(TH.fog).lerp(new THREE.Color(0xffffff),.35).convertSRGBToLinear(),transparent:true,opacity:.22,depthWrite:false}));
const x=rnd(-HX-6,HX+6),z=rnd(-HZ-6,HZ+6);s2.position.set(x,Math.max(gh(x,z),0)+.35,z);s2.scale.set(rnd(3,6),rnd(1,1.6),1);L1(s2);sc.add(s2);mists.push({s:s2,v:rnd(.1,.25),x0:x});}
// trees on the camera's side of the wall stay far enough back not to hide the board
for(let i=0;i<TH.tr;i++){const x=rnd(-HX-9.8,HX+9.8),z=rzf(-HZ-7.8,HZ+5.8),k=TH.tk[i%TH.tk.length],s2=rnd(.8,1.5);if(!okSpot(x,z,0))continue;if(ZF*z>HZ&&Math.abs(x)<HX+2&&ZF*z-HZ<s2*(k==6?3.2:2.2)*1.1)continue;tree(x,z,k,s2);}
for(let i=0;i<TH.bu;i++){const x=rnd(-HX-7.8,HX+7.8),z=rzf(-HZ-6.8,HZ+4.8);if(!okSpot(x,z,-.4))continue;bush(x,z,rnd(.7,1.3),i%3==0&&TH.fl.length>2?[0xffffff,0xffd93c,0xff6b6b]:null);}
for(let i=0;i<TH.rk;i++){const x=rnd(-HX-7.8,HX+7.8),z=rzf(-HZ-6.8,HZ+4.8);if(!okSpot(x,z,-.4))continue;const s2=rnd(.15,.4),m=part(ST,'oct',RKM,s2,s2*rnd(.5,.9),s2*rnd(.7,1.1),x,gh(x,z)+s2*.2,z);m.rotation.set(rnd(0,.5),rnd(0,6),rnd(0,.4));}
// blocked cells on the board: something nobody can build on, matching the land
for(const k of blk){const[c,r]=k.split(',').map(Number),x=cx(c),z=cz(r),g=groupAt(x,z,0),t=LV.th,alt=(c+r)%2;
if(t=='darkwood'){if(alt){part(g,'tap',0x5a3a1e,.32,.45,.32,0,.22,0);part(g,'cyl',0xb89a6a,.25,.02,.25,0,.455,0);for(let i=0;i<5;i++){const a=i*1.25;rod(g,Math.sin(a)*.2,.15,Math.cos(a)*.2,Math.sin(a)*.45,.0,Math.cos(a)*.45,.06,0x5a3a1e);}for(let i=0;i<4;i++)mushroom(g,rnd(-.35,.35),rnd(-.35,.35),rnd(1,1.6),0x6ac8d8,0x5ae0ff);}
else{for(let i=0;i<3;i++){const s2=[.38,.24,.18][i],m=part(g,'oct',RKM,s2,s2*.75,s2,rnd(-.2,.2),s2*.35,rnd(-.2,.2));m.rotation.set(rnd(0,.5),rnd(0,6),0);}part(g,'sph',folMat(0x3a6a30),.3,.08,.28,0,.33,0);mushroom(g,.3,.2,1.3,0xb8442e);}}
else if(t=='burning'){for(let i=0;i<5;i++){const b=part(g,'cyl',0x1c1714,.06,rnd(.6,.9),.06,rnd(-.15,.15),.08+i*.03,rnd(-.15,.15));b.rotation.set(PI/2,0,rnd(0,PI));}fire(g,0,.05,0,1.3);}
else if(t=='marsh'){pool(x,z,.42,BOG,.035);for(let i=0;i<8;i++){const a=rnd(0,6);part(g,'cyl',0x6a7040,.012,rnd(.3,.55),.012,Math.sin(a)*.42,.2,Math.cos(a)*.42).rotation.z=rnd(-.2,.2);}if(alt)part(g,'tap',0x3a3024,.08,.5,.08,.1,.25,-.1);}
else if(t=='ruins'){for(let i=0;i<16;i++){const s2=rnd(.06,.18),m=part(g,'oct',[P.st,P.st2,0x3a3430][i%3],s2,s2*.7,s2,rnd(-.38,.38),s2*.3,rnd(-.38,.38));m.rotation.set(rnd(0,3),rnd(0,6),0);}
const h=rnd(.45,.75),wl=part(g,'box',P.st2,.8,h,.12,0,h/2,alt?.2:-.2);wl.rotation.y=alt?.3:-.2;part(g,'box',0x2a2522,.81,.05,.13,0,h,alt?.2:-.2).rotation.y=wl.rotation.y;const b=part(g,'box',0x1c1816,.06,.06,.8,.1,.1,0);b.rotation.set(.3,.8,0);}
else if(t=='moor'){part(g,'sph',0x3a3028,.4,.12,.4,0,0,0);grave(g,0,-.15,ZF<0?PI:0,1.6);if(alt){grave(g,-.3,.2,.4,1.1);bones(g,.25,.25,1);}else{part(g,'cyl',0xf0e8d0,.025,.1,.025,.28,.12,.25);flame(g,.28,.17,.25,.5);}}
else if(t=='badlands'||t=='hell'&&alt){pool(x,z,.4,LAVA,.03);for(let i=0;i<10;i++){const a=i/10*PI*2,s2=rnd(.08,.15),m=part(g,'oct',t=='hell'?OBS:SPIRE,s2,s2*.7,s2,Math.sin(a)*.44,s2*.3,Math.cos(a)*.44);m.rotation.set(rnd(0,3),rnd(0,6),0);}glow(g,0,.2,0,1.1,0xff6a20);g.updateWorldMatrix(true,false);emit.push([x,.3,z]);}
else if(t=='hell'){spikes(g,0,0,1.1);skull(g,.25,0,.25,1.3);}
else{for(let i=0;i<3;i++){const s2=[.38,.26,.16][i],m=part(g,'oct',RKM,s2,s2*.75,s2,rnd(-.2,.2),s2*.35,rnd(-.2,.2));m.rotation.set(rnd(0,.5),rnd(0,6),0);}}}
for(let i=0;i<TH.cl[0];i++){const c=new THREE.Group();c.position.set(rnd(-30,30),rnd(7,10),ZF*rnd(-26,-12));c.userData.v=rnd(.15,.4);for(let j=0;j<4;j++)part(c,'sph',0xffffff,rnd(.9,1.6),rnd(.6,1),rnd(.8,1.3),j*1.1-1.6,rnd(0,.4),rnd(-.3,.3));c.traverse(o=>{if(o.isMesh){o.castShadow=false;L1(o);o.material=new THREE.MeshBasicMaterial({color:TH.cl[1]});}});sc.add(c);clouds.push(c);}
const SMKM=TH.smk||0xffffff;for(const e of emit)for(let i=0;i<5;i++){const m=new THREE.Mesh(geo('sph'),new THREE.MeshBasicMaterial({color:SMKM,transparent:true,opacity:.5,depthWrite:false}));L1(m);sc.add(m);smoke.push({m,e,ph:i/5});}
bake(ST);bake(KEEP);KEEP0={x:KEEP.position.x,y:KEEP.position.y,z:KEEP.position.z};
// ambient particles (theme mo): fireflies/wisps (ff) wander and blink, embers (emb) rise, ash falls, dust drifts with the wind
const motes=(TH.mo||[]).map(o=>{const n=o.n,ps=new Float32Array(n*3),cs=new Float32Array(n*3),v=[],gm=new THREE.BufferGeometry(),ex=HX+4,ez=HZ+4;
for(let i=0;i<n;i++){const q={x:rnd(-ex,ex),y:o.k=='ash'?rnd(0,5):o.k=='emb'?rnd(0,4):rnd(.2,1.6),z:rnd(-ez,ez),ph:rnd(0,6),sp:rnd(.4,1)};q.x0=q.x;q.z0=q.z;v.push(q);}
gm.setAttribute('position',new THREE.BufferAttribute(ps,3));gm.setAttribute('color',new THREE.BufferAttribute(cs,3));
const add=o.k=='ff'||o.k=='emb',pm=new THREE.PointsMaterial({map:GT,size:o.s*2.6,vertexColors:true,transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending,opacity:add?1:.7}),pt=L1(new THREE.Points(gm,pm));pt.frustumCulled=false;sc.add(pt);
return{k:o.k,c:new THREE.Color(o.c).convertSRGBToLinear(),ps,cs,v,gm,ex,ez};});
function moteAnim(dt){for(const M2 of motes){const{ps,cs,v,c,ex,ez}=M2;for(let i=0;i<v.length;i++){const q=v[i];let b=1;
if(M2.k=='ff'){q.ph+=dt*q.sp;q.x=q.x0+Math.sin(q.ph*.7)*1.2;q.z=q.z0+Math.cos(q.ph*.5)*1.2;q.y=.5+Math.sin(q.ph*1.3)*.4+q.sp*.6;b=Math.max(0,Math.sin(q.ph*2.3+i))**2;}
else if(M2.k=='emb'){q.y+=dt*q.sp*.9;q.x+=Math.sin(tt*2+q.ph)*dt*.3;if(q.y>4.5){q.y=0;q.x=rnd(-ex,ex);q.z=rnd(-ez,ez);}b=1-q.y/4.5;b*=.6+.4*Math.sin(tt*9+q.ph);}
else if(M2.k=='ash'){q.y-=dt*q.sp*.35;q.x+=Math.sin(tt*.7+q.ph)*dt*.25+dt*.15;if(q.y<0){q.y=5;q.x=rnd(-ex,ex);q.z=rnd(-ez,ez);}}
else{q.x+=dt*q.sp*.9;q.y=.2+Math.abs(Math.sin(tt*.5+q.ph))*.8*q.sp;if(q.x>ex){q.x=-ex;q.z=rnd(-ez,ez);}}
ps[i*3]=q.x;ps[i*3+1]=q.y;ps[i*3+2]=q.z;cs[i*3]=c.r*b;cs[i*3+1]=c.g*b;cs[i*3+2]=c.b*b;}M2.gm.attributes.position.needsUpdate=true;M2.gm.attributes.color.needsUpdate=true;}
for(const m of mists){m.s.position.x=m.x0+Math.sin(tt*m.v)*2;m.s.material.opacity=.16+.08*Math.sin(tt*m.v*3+m.x0);}for(const r of ripples){r.t+=dt;const p=r.t/r.d;if(r.t<0){r.m.visible=false;continue;}if(p>=1){const q=r.mp();r.m.position.set(q.x,-.092,q.z);r.t=-rnd(.2,2);r.d=rnd(1.5,2.5);continue;}r.m.visible=true;r.m.scale.setScalar(.03+.2*p);r.m.material.opacity=.3*(1-p);}LAVAT.offset.x=tt*.01;LAVAT.offset.y=Math.sin(tt*.2)*.02;}
// range indicator
const rng=new THREE.Group(),rd1=L1(new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshBasicMaterial({transparent:true,opacity:.22,depthWrite:false}))),rd2=L1(new THREE.Mesh(new THREE.RingGeometry(.96,1,64),new THREE.MeshBasicMaterial({transparent:true,opacity:.9,depthWrite:false})));
rd1.rotation.x=rd2.rotation.x=-PI/2;rng.add(rd1,rd2);rng.position.y=.04;rng.visible=false;sc.add(rng);
function showRng(x,z,r,col){rng.visible=true;rng.position.x=x;rng.position.z=z;rng.scale.set(r,1,r);rd1.material.color.setHex(col);rd2.material.color.setHex(col);}
function selRng(){updPads();if(g.sel){const t=g.sel;showRng(wx(t.x),wz(t.y),stat(t).r/60,0xffffff);}else rng.visible=false;}
