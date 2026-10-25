// ---------- terrain & scenery ----------
const sm=(a,b,x)=>{x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x);};
const nz=(x,z)=>Math.sin(x*.31+1.7)*Math.cos(z*.27+.4)+.5*Math.sin(x*.77+z*.53+2)+.25*Math.sin(x*1.9-z*1.3);
const gh=(x,z)=>-.15+sm(0,9,Math.max(Math.abs(x)-7.8,Math.abs(z)-5.6,0))*sm(0,3,Math.max(6.4-x,x-14.6,-1.4-z,z-6.6,0))*(nz(x,z)*1.1+1.3);
const flames=[],flags=[],emit=[],smoke=[],trees=[],clouds=[];let mill,KEEP,KEEP0;
const ST=new THREE.Group();sc.add(ST);
{const gg=new THREE.PlaneGeometry(120,90,150,112);gg.rotateX(-PI/2);const p=gg.attributes.position;
for(let i=0;i<p.count;i++)p.setY(i,gh(p.getX(i),p.getZ(i)));gg.computeVertexNormals();
const nm=gg.attributes.normal,cols=new Float32Array(p.count*3),c1=new THREE.Color(0x8fc94f),c2=new THREE.Color(0x5f9f3c),c3=new THREE.Color(0x3f7f38),cr=new THREE.Color(0x8a8578),dr=new THREE.Color(0x7a6244),c=new THREE.Color();
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=p.getY(i),n=nz(x*1.3,z*1.3)*.5+.5;c.copy(c2).lerp(n>.5?c1:c3,Math.abs(n-.5)*1.6).lerp(c1,clamp(h*.1,0,.4));c.lerp(cr,clamp((1-nm.getY(i)-.08)*5,0,.85));if(nz(x*.7+9,z*.7)>.9)c.lerp(dr,.4);c.convertSRGBToLinear();cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;}
gg.setAttribute('color',new THREE.BufferAttribute(cols,3));const tg=TX.grass.a.clone(),tn=TX.grass.n.clone();tg.needsUpdate=tn.needsUpdate=true;tg.repeat.set(40,30);tn.repeat.set(40,30);
const gm=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({map:tg,normalMap:tn,vertexColors:true,roughness:.95,envMapIntensity:.5}));gm.receiveShadow=true;L1(gm);sc.add(gm);}
for(let i=0;i<26;i++){const x=rnd(-17,17),z=rnd(-14,10);if(Math.abs(x)<7.6&&Math.abs(z)<5.8)continue;if(x>6.4&&x<9&&z>.8&&z<4.2)continue;const s2=rnd(.4,1.3),m=part(ST,'oct',M.rock,s2,s2*rnd(.5,.9),s2*rnd(.7,1.1),x,gh(x,z)+s2*.25,z);m.rotation.set(rnd(0,.5),rnd(0,6),rnd(0,.4));}
const flat=(c,w,h,d,x,y,z)=>{const o=part(sc,'box',c,w,h,d,x,y,z);o.castShadow=false;o.receiveShadow=true;return L1(o);};
function scatter(k,m,n,fn){const im=new THREE.InstancedMesh(typeof k=='string'?geo(k):k,m,n),d=new THREE.Object3D(),col=new THREE.Color();let c=0;
for(let i=0;i<n;i++){const o=fn(i);if(!o)continue;d.position.set(o.x,o.y,o.z);d.scale.set(o.sx,o.sy||o.sx,o.sz||o.sx);d.rotation.set(0,o.ry||0,0);d.updateMatrix();im.setMatrixAt(c,d.matrix);col.setHex(o.col).convertSRGBToLinear();im.setColorAt(c,col);c++;}
im.count=c;im.frustumCulled=false;im.receiveShadow=true;L1(im);sc.add(im);}
function flag(g,x,y,z,col,s){part(g,'cyl',P.wd2,.016,.5*s,.016,x,y+.25*s,z);part(g,'sph',P.gd,.03,.03,.03,x,y+.51*s,z);const p=new THREE.Group();p.position.set(x,y+.43*s,z);p.userData.keep=true;
part(p,'box',col,.28*s,.17*s,.02,.14*s,0,0);part(p,'box',P.gd,.28*s,.035*s,.025,.14*s,0,0);part(p,'cone',col,.08*s,.1*s,.02,.3*s,0,0).rotation.z=-PI/2;g.add(p);return p;}
function torch(g,x,y,z,list){part(g,'cyl',P.wd2,.025,.3,.025,x,y,z);part(g,'cyl',0x4a4a5a,.05,.05,.05,x,y+.15,z);
const f=part(g,'cone',0xff8a1f,.07,.18,.07,x,y+.26,z,0xff6a00),f2=part(g,'cone',0xffe27a,.04,.11,.04,x,y+.24,z,0xffcc33);
for(const o of[f,f2]){o.castShadow=false;o.userData.keep=true;o.userData.b=o.scale.clone();(list||flames).push(o);}(list||flames).push(glow(g,x,y+.28,z,.55,0xff9a40));}
function crown(g,y,r,n,m){for(let i=0;i<n;i++){const a=i/n*2*PI;part(g,'box',m,.1,.11,.1,r*Math.sin(a),y,r*Math.cos(a));}}
function win(g,x,y,z,w,h,ry,c,em){const k=new THREE.Group();k.position.set(x,y,z);k.rotation.y=ry;part(k,'box',c,w,h,.04,0,0,0,em).castShadow=false;part(k,'cyl',c,w/2,.04,w/2,0,h/2,0,em).rotation.x=PI/2;g.add(k);}
function turret(x,z,h,r,roof){const g=new THREE.Group();g.position.set(x,-.1,z);ST.add(g);part(g,'tap',P.st,r,h,r,0,h/2,0);part(g,'cyl',P.st2,r*.95,.06,r*.95,0,h*.6,0);part(g,'cyl',P.st3,r*1.12,.07,r*1.12,0,h,0);
part(g,'cone',RF(roof),r*1.3,h*.5,r*1.3,0,h+h*.25,0);part(g,'sph',P.gd,.04,.04,.04,0,h*1.5+.02,0);win(g,0,h*.55,r*.88,.07,.15,0,0x2a2140);return g;}
function wall(x1,z1,x2,z2){const L=Math.hypot(x2-x1,z2-z1),a=Math.abs(x2-x1)>Math.abs(z2-z1),cx=(x1+x2)/2,cz=(z1+z2)/2,n2=Math.ceil(L),n=Math.floor(L/.5);
for(let i=0;i<n2;i++){const u=-L/2+(i+.5)*L/n2;part(ST,'box',[P.st,P.st3][i%2],a?L/n2*.99:.36,.42,a?.36:L/n2*.99,a?cx+u:cx,.06,a?cz:cz+u);}
for(let i=0;i<n;i++){const u=-L/2+(i+.5)*L/n;part(ST,'box',P.st3,a?.3:.36,.17,a?.36:.3,a?cx+u:cx,.36,a?cz:cz+u);}}
function chim(g,x,y,z){part(g,'box',P.st2,.13,.3,.13,x,y,z);g.updateMatrixWorld(true);const v=new THREE.Vector3(x,y+.2,z);g.localToWorld(v);emit.push([v.x,v.y,v.z]);}
function house(x,z,ry,w,d,rf){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.rotation.y=ry;ST.add(g);part(g,'box',0xfff1d6,w,.5,d,0,.25,0);
for(const a of[-1,1]){for(const c of[-1,1])part(g,'box',P.wd2,.07,.52,.07,a*w/2,.26,c*d/2);part(g,'box',P.wd2,.04,.55,.03,a*w*.2,.25,d/2+.01).rotation.z=a*.6;}
part(g,'box',P.wd2,w+.02,.05,d+.02,0,.5,0);part(g,'pyr',RF(rf),w*.82,.5,d*.82,0,.74,0);
win(g,0,.13,d/2+.01,.14,.22,0,P.wd2);win(g,-w*.3,.32,d/2+.01,.1,.12,0,0xfff0a0,0xffd24a);win(g,w*.3,.32,d/2+.01,.1,.12,0,0xfff0a0,0xffd24a);chim(g,w*.25,.9,-d*.1);}
// board
{const gt=TX.grass.a.clone(),gn=TX.grass.n.clone();gt.needsUpdate=gn.needsUpdate=true;gt.repeat.set(.35,.35);gn.repeat.set(.35,.35);
const top=new THREE.MeshStandardMaterial({map:gt,normalMap:gn,color:new THREE.Color(0xe8f6d8).convertSRGBToLinear(),roughness:.95,envMapIntensity:.5}),side=mat(0x5a4632);
const pl=part(sc,'box',[side,side,top,side,side,side],12.4,.3,8.4,0,-.15,0);pl.castShadow=false;pl.receiveShadow=true;L1(pl);}
for(const k of road){const[c,r]=k.split(',').map(Number);flat(M.roadA,1.01,.06,1.01,c-5.5,0,r-3.5);}
flat(M.roadA,1.01,.2,1.01,-6.5,-.07,-2.5);flat(M.roadA,1.01,.2,1.01,6.5,-.07,2.5);
const PADG=new THREE.CircleGeometry(.07,16);PADG.rotateX(-PI/2);const PADM=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.28,depthWrite:false}),pads=[];
for(let c=0;c<W;c++)for(let r=0;r<H;r++){if(road.has(c+','+r))continue;const m=L1(new THREE.Mesh(PADG,PADM));m.position.set(c-5.5,.02,r-3.5);sc.add(m);pads.push({c,r,m});}
function updPads(){for(const p of pads)p.m.visible=!g.sel&&free(p.c,p.r);}
function spot(m){for(;;){const c=Math.floor(rnd(0,W)),r=Math.floor(rnd(0,H)),rd=road.has(c+','+r);if(m==0&&rd||m==1&&!rd)continue;const dx=rnd(-.5,.5),dz=rnd(-.5,.5);if(!rd&&Math.hypot(dx,dz)<.4)continue;return{x:c-5.5+dx,z:r-3.5+dz,y:rd?.03:0};}}
const cb=[];for(const k of road){const[c,r]=k.split(',').map(Number);for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){if(road.has((c+dx)+','+(r+dz))||c+dx<0||c+dx>=W||r+dz<0||r+dz>=H)continue;for(const o of[-.25,.25])cb.push({x:c-5.5+dx*.47+(dz?o:0),z:r-3.5+dz*.47+(dx?o:0),dx,dz});}}
scatter('box',mat(0xffffff),cb.length,i=>{const q=cb[i];return{x:q.x,y:-.01,z:q.z,sx:q.dz?.46:.1,sy:.12,sz:q.dx?.46:.1,col:[0xf7f2e6,0xece5d6,0xd9d0bd][i%3]};});
scatter('sph',mat(0xffffff),150,i=>{const p=spot(1);return{x:p.x,y:p.y+.01,z:p.z,sx:rnd(.05,.1),sy:.02,sz:rnd(.05,.1),col:[0xfff4d0,0xd9c48e,0xc9b27a][i%3]};});
const WT={value:0},WN=TX.grain.n.clone();WN.needsUpdate=true;WN.repeat.set(10,10);
function windify(m){m.onBeforeCompile=sh=>{sh.uniforms.uT=WT;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uT;').replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*.7+instanceMatrix[3].z*.9;\n#else\nfloat ph=position.x*3.+position.z*3.;\n#endif\ntransformed.x+=sin(uT*2.2+ph)*.05*position.y;transformed.z+=cos(uT*1.7+ph)*.035*position.y;');};return m;}
const mkC=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;};
TX.leafy=genTex(256,(x,y)=>{const n=fbm(x/256*12,y/256*12,12,12,4),m=fbm(x/256*40,y/256*40,40,40,2),l=.45+.5*n+.25*(m-.5);return[l,l,l,.5*n+.5*m];},3);
const GRASST=mkC(64,128,(x,w,h)=>{for(let i=0;i<9;i++){const bx=rnd(8,56),bh=rnd(60,120),bw=rnd(3,6),lean=rnd(-14,14),gr=x.createLinearGradient(0,h,0,h-bh);gr.addColorStop(0,'#2c5e1e');gr.addColorStop(1,'hsl('+rnd(70,95)+',60%,'+rnd(50,62)+'%)');x.fillStyle=gr;x.beginPath();x.moveTo(bx-bw,h);x.quadraticCurveTo(bx,h-bh*.6,bx+lean,h-bh);x.quadraticCurveTo(bx+bw*.2,h-bh*.6,bx+bw,h);x.fill();}});
const FLT=c=>mkC(64,128,(x,w,h)=>{x.strokeStyle='#3f7a2c';x.lineWidth=3;x.beginPath();x.moveTo(32,h);x.quadraticCurveTo(28,80,32,40);x.stroke();x.fillStyle='#4f9a36';x.beginPath();x.ellipse(24,88,10,4,-.5,0,7);x.fill();x.beginPath();x.ellipse(40,72,10,4,.5,0,7);x.fill();
for(let i=0;i<6;i++){const a=i/6*PI*2;x.fillStyle=c;x.beginPath();x.ellipse(32+Math.cos(a)*10,32+Math.sin(a)*10,9,6,a,0,7);x.fill();}x.fillStyle='#ffd24a';x.beginPath();x.arc(32,32,6,0,7);x.fill();});
const LEAF=mkC(256,256,(x,w,h)=>{for(let i=0;i<170;i++){const a=rnd(0,PI*2),r=Math.sqrt(Math.random())*105,rot=rnd(0,PI*2),l=rnd(16,26),wd=rnd(7,12),v=rnd(55,100);x.save();x.translate(128+Math.cos(a)*r,128+Math.sin(a)*r);x.rotate(rot);x.fillStyle='hsl(0,0%,'+v+'%)';x.beginPath();x.ellipse(0,0,wd,l,0,0,PI*2);x.fill();x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;x.stroke();x.strokeStyle='rgba(255,255,255,.4)';x.beginPath();x.moveTo(0,-l);x.lineTo(0,l);x.stroke();x.restore();}});
const NEEDLE=mkC(256,256,(x,w,h)=>{x.strokeStyle='#8a8a8a';x.lineWidth=4;x.beginPath();x.moveTo(128,252);x.lineTo(128,8);x.stroke();for(let i=0;i<110;i++){const y=250-i*2.2,sd=i%2?1:-1,len=rnd(30,70)*(1-i/160),v=rnd(60,100);x.strokeStyle='hsl(0,0%,'+v+'%)';x.lineWidth=rnd(2,3.5);x.beginPath();x.moveTo(128,y);x.lineTo(128+sd*len,y-rnd(8,24));x.stroke();}});
const CROSS=(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0,0,0,-.5,0,0,.5,0,1,.5,0,1,-.5]),3));g.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(24).map((v,i)=>i%3==1?1:0),3));g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),2));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);return g;})();
const PM2=t=>windify(new THREE.MeshStandardMaterial({map:t,alphaTest:.45,side:THREE.DoubleSide,roughness:1,envMapIntensity:.3}));
const outside=(x,z)=>(Math.abs(x)<7.4&&Math.abs(z)<5.6)||(x>6.4&&x<15&&z>-1.6&&z<7.2);
scatter(CROSS,PM2(GRASST),650,i=>{const p=spot(0);return{x:p.x,y:p.y,z:p.z,sx:rnd(.28,.5),sy:rnd(.22,.38),ry:rnd(0,PI),col:[0xffffff,0xe3f5c0,0xc9ec9a][i%3]};});
scatter(CROSS,PM2(GRASST),1100,i=>{const x=rnd(-26,26),z=rnd(-20,16);if(outside(x,z))return null;return{x,y:gh(x,z),z,sx:rnd(.35,.65),sy:rnd(.3,.5),ry:rnd(0,PI),col:[0xffffff,0xe3f5c0,0xc9ec9a,0xb7e08a][i%4]};});
['#ffffff','#ffd93c','#ff5a5a','#c08bff','#ff8ec0','#7ab8ff'].forEach(c=>{const fm=PM2(FLT(c));scatter(CROSS,fm,60,i=>{let x,z,y=0;if(i<24){const q=spot(0);x=q.x;z=q.z;}else{x=rnd(-24,24);z=rnd(-18,14);if(outside(x,z))return null;y=gh(x,z);}return{x,y,z,sx:rnd(.16,.26),sy:rnd(.28,.42),ry:rnd(0,PI),col:0xffffff};});});
const flies=[];for(let i=0;i<9;i++){const g2=new THREE.Group(),wm=new THREE.MeshBasicMaterial({color:new THREE.Color([0xff9a3c,0xffe45a,0x7ab8ff,0xff7ab8,0xffffff][i%5]).convertSRGBToLinear(),side:THREE.DoubleSide}),wg=new THREE.PlaneGeometry(.14,.1);wg.translate(.07,0,0);
const h1=new THREE.Group(),h2=new THREE.Group();h2.rotation.y=PI;const w1=L1(new THREE.Mesh(wg,wm)),w2=L1(new THREE.Mesh(wg,wm));w1.rotation.x=w2.rotation.x=-PI/2;h1.add(w1);h2.add(w2);g2.add(h1,h2);sc.add(g2);flies.push({g:g2,h1,h2,a:rnd(0,6),cx:rnd(-5,5),cz:rnd(-3,3)+.3,r:rnd(.8,2),sp:rnd(.3,.7),y:rnd(.4,1)});}
// walls, gate, castle
wall(-6.17,-4.17,6.17,-4.17);wall(-6.17,4.17,6.17,4.17);wall(-6.17,-4.17,-6.17,-3.8);wall(-6.17,-1.2,-6.17,4.17);wall(6.17,-4.17,6.17,1.7);wall(6.17,3.3,6.17,4.17);
for(let i=0;i<5;i++){part(ST,'box',[P.rd,P.bl][i%2],.3,.5,.02,-4+i*2,.02,-3.99);part(ST,'box',P.gd,.3,.04,.025,-4+i*2,.22,-3.985);}
for(const[x,z]of[[-6.17,-4.17],[6.17,-4.17],[-6.17,4.17],[6.17,4.17]])turret(x,z,.9,.3,P.rd);
{const br=new THREE.Group();br.position.set(-6.17,-.15,0);ST.add(br);
function fire(g,x,y,z,s2){const f=part(g,'cone',0xff8a1f,.12*s2,.34*s2,.12*s2,x,y+.17*s2,z,0xff6a00),f2=part(g,'cone',0xffe27a,.07*s2,.22*s2,.07*s2,x,y+.12*s2,z,0xffcc33);for(const o of[f,f2]){o.castShadow=false;o.userData.keep=true;o.userData.b=o.scale.clone();flames.push(o);}
flames.push(glow(g,x,y+.25*s2,z,1.1*s2,0xff9a40));part(g,'cyl',0x2a1c12,.05,.4,.05,x-.1,.05,z).rotation.z=PI/2.2;part(g,'cyl',0x2a1c12,.05,.4,.05,x+.08,.05,z+.05).rotation.x=PI/2.3;emit.push([g.position.x+x,g.position.y+y+.5*s2,g.position.z+z]);}
for(const[z0,dir]of[[-3.8,1],[-1.2,-1]])for(let j=0;j<5;j++){const hh=[.42,.34,.26,.17,.1][j]+rnd(-.03,.03),b=part(br,'box',[P.st,P.st3][j%2],.36+rnd(-.04,.04),hh,.17,rnd(-.03,.03),hh/2,z0+dir*(.1+j*.17));b.rotation.set(rnd(-.05,.05),rnd(-.12,.12),rnd(-.05,.05));}
part(br,'tap',P.st,.38,.7,.38,0,.35,-.75);for(let i=0;i<7;i++){const an=i/7*2*PI,hh=rnd(.1,.35);part(br,'box',P.st3,.1,hh,.12,.34*Math.sin(an),.7+hh/2,-.75+.34*Math.cos(an)).rotation.y=an;}
for(let i=0;i<46;i++){const z=rnd(-3.95,-.9);if(Math.abs(z+2.5)<.55&&i%3)continue;const sz=i<8?rnd(.2,.38):rnd(.05,.17),m=part(br,'oct',[P.st,P.st2,P.st3,0xb9b4c4][i%4],sz,sz*rnd(.55,1),sz*rnd(.7,1.1),rnd(-1.6,.7),sz*.4,z);m.rotation.set(rnd(0,3),rnd(0,6),rnd(0,3));}
for(let i=0;i<9;i++){const m=part(br,'box',P.st3,.1,.17,.14,rnd(-1.1,.4),.06,rnd(-3.9,-1.0));m.rotation.set(rnd(-.6,.6),rnd(0,6),rnd(-.6,.6));}
for(let i=0;i<6;i++){const m=L1(new THREE.Mesh(BLG,BLM));m.scale.set(rnd(1,1.7),1,rnd(1,1.7));m.position.set(rnd(-1.3,.5),.04,rnd(-3.9,-1.1));br.add(m);}
fire(br,-.2,0,-3.55,1);fire(br,.05,0,-1.45,1.2);fire(br,-1.0,0,-.9,.8);flags.push(flag(br,-.4,0,-3.95,0x2a1a2a,1.3));flags.push(flag(br,-.5,0,-1.05,0x2a1a2a,1.3));
const rm=new THREE.Group();rm.position.set(-8.6,-.15,-1.5);rm.rotation.y=-.15;ST.add(rm);part(rm,'cyl',P.wd2,.12,1.5,.12,0,.42,0).rotation.z=PI/2;part(rm,'cone',0x4a5568,.14,.28,.14,.88,.42,0).rotation.z=-PI/2;
for(const x of[-.45,.45])for(const z of[-.22,.22])part(rm,'box',P.wd,.06,.45,.06,x,.22,z);part(rm,'box',P.wd,1.1,.05,.5,0,.5,0);for(const x of[-.4,.4])for(const z of[-.3,.3])part(rm,'cyl',P.wd2,.14,.05,.14,x,.14,z).rotation.x=PI/2;}
turret(6.17,1.7,1.5,.34,P.rd);turret(6.17,3.3,1.5,.34,P.rd);part(ST,'box',P.st,.4,.26,1.4,6.17,1.22,2.5);part(ST,'box',P.st3,.5,.08,1.46,6.17,1.4,2.5);
{const CG=new THREE.Group();CG.position.y=-.15;ST.add(CG);const X0=8.2,X1=12.8,Z0=.2,Z1=4.8,WH=1.2;
const WATER=new THREE.MeshStandardMaterial({color:new THREE.Color(0x2c7db0).convertSRGBToLinear(),roughness:.08,metalness:.15,transparent:true,opacity:.88,normalMap:WN,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:1.4});
flat(WATER,.5,.06,6.74,7.35,-.12,2.5);flat(WATER,6.8,.06,.5,10.5,-.12,-.62);flat(WATER,6.8,.06,.5,10.5,-.12,5.62);flat(WATER,.5,.06,6.74,13.65,-.12,2.5);
function rod(g,x1,y1,z1,x2,y2,z2,r,c){const d=new THREE.Vector3(x2-x1,y2-y1,z2-z1),L=d.length(),m=part(g,'cyl',c,r,L,r,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
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
function pine(g,H){part(g,'cone',P.wd2,.14,.22,.14,0,.1,0);part(g,'tap',P.wd2,.07,H*.9,.07,0,H*.45,0);const T6=6;
for(let i=0;i<T6;i++){const f=i/(T6-1),r=.55*(1-f*.8),y=.3+f*(H-.55);part(g,'cone',folMat(0x2f6b3a),r*.85,.5-f*.12,r*.85,0,y+.2,0);
for(let j=0;j<8;j++){const a=j/8*PI*2+i*.6;card(g,needMat(i%2?0x4a9a52:0x358a46),Math.sin(a)*r*.6,y+.15,Math.cos(a)*r*.6,r*1.15,1.8,a,0);}}
part(g,'cone',folMat(0x2f6b3a),.12,.35,.12,0,H+.05,0);}
function broad(g,k){const H=rnd(.85,1.15),tc=k==3?0xe9e5da:P.wd2,cols=k==2?[0xf2a63a,0xe0802a,0xffc15a]:k==3?[0xb8dc6a,0xa4cf58,0xd4ec8c]:[0x4aa84e,0x62bf5a,0x3a8f48];
part(g,'tap',tc,.11,H,.11,0,H/2,0);for(let i=0;i<5;i++){const a=i*1.26;part(g,'sph',tc,.07,.05,.07,Math.sin(a)*.1,.04,Math.cos(a)*.1);}
const tips=[];for(let i=0;i<4;i++){const a=i*PI/2+rnd(0,.6);tips.push([Math.sin(a)*.5,H+.35+rnd(0,.15),Math.cos(a)*.5]);const m=part(g,'tap',tc,.04,.6,.04,Math.sin(a)*.22,H+.26,Math.cos(a)*.22);m.rotation.set(Math.cos(a)*.75,0,-Math.sin(a)*.75);}
tips.push([0,H+.6,0]);tips.forEach((t,i)=>{const R2=.42+rnd(0,.08);part(g,'sph',folMat(cols[i%3]),R2,R2*.85,R2,t[0],t[1],t[2]);
for(let j=0;j<7;j++)card(g,leafMat(cols[(i+j)%3]),t[0]+rnd(-.42,.42),t[1]+rnd(-.2,.3),t[2]+rnd(-.42,.42),rnd(.6,.9),rnd(-.7,.7),rnd(0,PI),rnd(-.5,.5));});}
function tree(x,z,k,s){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.scale.setScalar(s);g.rotation.y=rnd(0,6);g.userData.ph=rnd(0,6);if(k==0)pine(g,rnd(1.5,2.1));else broad(g,k);bake(g);sc.add(g);trees.push(g);}
function bush(x,z,s,fl){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.scale.setScalar(s);const cols=[0x4aa84e,0x62bf5a,0x3a8f48];
for(let i=0;i<5;i++){const a=i*1.3,r=i?.22:0;part(g,'sph',folMat(cols[i%3]),.25,.2,.25,Math.sin(a)*r,.16,Math.cos(a)*r);for(let j=0;j<4;j++)card(g,leafMat(cols[(i+j)%3]),Math.sin(a)*r+rnd(-.25,.25),.15+rnd(0,.2),Math.cos(a)*r+rnd(-.25,.25),rnd(.3,.45),rnd(-.5,.5),rnd(0,PI),0);}
if(fl)for(let i=0;i<8;i++)part(g,'sph',fl[i%fl.length],.035,.035,.035,rnd(-.3,.3),.2+rnd(0,.2),rnd(-.3,.3));bake(g);sc.add(g);}
const okSpot=(x,z,m)=>!(Math.abs(x)<7.2+m&&Math.abs(z)<5.4+m)&&!(x>6.4&&x<15&&z>-1.6&&z<7.2)&&!(x<-6&&x>-10&&z>-4.2&&z<-.6);
for(let i=0;i<70;i++){const x=rnd(-16,16),z=rnd(-12,10);if(!okSpot(x,z,0))continue;tree(x,z,[0,1,0,2,1,3][i%6],rnd(.8,1.5));}
for(let i=0;i<44;i++){const x=rnd(-14,14),z=rnd(-11,9);if(!okSpot(x,z,-.4))continue;bush(x,z,rnd(.7,1.3),i%3==0?[0xffffff,0xffd93c,0xff6b6b]:null);}
for(let i=0;i<26;i++){const x=rnd(-14,14),z=rnd(-11,9);if(!okSpot(x,z,-.4))continue;const s2=rnd(.15,.4),m=part(ST,'oct',M.rock,s2,s2*rnd(.5,.9),s2*rnd(.7,1.1),x,gh(x,z)+s2*.2,z);m.rotation.set(rnd(0,.5),rnd(0,6),rnd(0,.4));}
house(7.8,-5.4,.3,1.2,.9,P.rd);house(-8.3,3.2,1.2,1,.9,0xf5a524);house(-7.6,-5.8,0,.9,.8,P.bl);house(4,-6.2,-.2,1,.9,0xf5a524);
{const g=new THREE.Group();g.position.set(10.5,gh(10.5,-4.4),-4.4);ST.add(g);part(g,'tap',P.st3,.4,1.2,.4,0,.6,0);part(g,'cone',RF(P.rd),.48,.45,.48,0,1.42,0);win(g,0,.3,.38,.12,.2,0,P.wd2);
mill=new THREE.Group();mill.position.set(0,1.05,.4);mill.userData.keep=true;part(mill,'box',P.wd,.09,1.5,.04,0,0,0);part(mill,'box',P.wd,1.5,.09,.04,0,0,0);part(mill,'sph',P.gd,.07,.07,.07,0,0,.03);
for(const[x,y,w,h]of[[.17,.5,.24,.5],[-.17,-.5,.24,.5],[.5,-.17,.5,.24],[-.5,.17,.5,.24]])part(mill,'box',0xfff6e0,w,h,.02,x,y,0);g.add(mill);}
for(let i=0;i<7;i++){const c=new THREE.Group();c.position.set(rnd(-30,30),rnd(7,10),rnd(-26,-12));c.userData.v=rnd(.15,.4);for(let j=0;j<4;j++)part(c,'sph',0xffffff,rnd(.9,1.6),rnd(.6,1),rnd(.8,1.3),j*1.1-1.6,rnd(0,.4),rnd(-.3,.3));c.traverse(o=>{if(o.isMesh){o.castShadow=false;L1(o);o.material=new THREE.MeshBasicMaterial({color:0xffffff});}});sc.add(c);clouds.push(c);}
for(const e of emit)for(let i=0;i<5;i++){const m=new THREE.Mesh(geo('sph'),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false}));L1(m);sc.add(m);smoke.push({m,e,ph:i/5});}
bake(ST);bake(KEEP);KEEP0={x:KEEP.position.x,y:KEEP.position.y,z:KEEP.position.z};
// range indicator
const rng=new THREE.Group(),rd1=L1(new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshBasicMaterial({transparent:true,opacity:.22,depthWrite:false}))),rd2=L1(new THREE.Mesh(new THREE.RingGeometry(.96,1,64),new THREE.MeshBasicMaterial({transparent:true,opacity:.9,depthWrite:false})));
rd1.rotation.x=rd2.rotation.x=-PI/2;rng.add(rd1,rd2);rng.position.y=.04;rng.visible=false;sc.add(rng);
function showRng(x,z,r,col){rng.visible=true;rng.position.x=x;rng.position.z=z;rng.scale.set(r,1,r);rd1.material.color.setHex(col);rd2.material.color.setHex(col);}
function selRng(){updPads();if(g.sel){const t=g.sel;showRng(wx(t.x),wz(t.y),stat(t).r/60,0xffffff);}else rng.visible=false;}
