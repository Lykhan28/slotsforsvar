// ---------- terrain & scenery ----------
// everything here follows the level (js/01-config.js): board size W×H, roads, blocked cells, breaches ENT, gate GATE and the theme TH
const sm=(a,b,x)=>{x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x);};
const nz=(x,z)=>Math.sin(x*.31+1.7)*Math.cos(z*.27+.4)+.5*Math.sin(x*.77+z*.53+2)+.25*Math.sin(x*1.9-z*1.3);
// castle zone in castle coordinates (see toC): the ground stays flat there
const inC=(x,z,x0,x1,z0,z1)=>{const q=toC(x,z);return q.x>x0&&q.x<x1&&q.z>z0&&q.z<z1;},cDist=(x,z)=>{const q=toC(x,z);return Math.max(6.4-q.x,q.x-14.6,-1.4-q.z,q.z-6.6,0);};
// sea (theme sea): beyond 1.6 units past the far wall the land falls away into the sea (not round the castle)
const seaK=(x,z)=>TH.sea?sm(1.6,3.2,-ZF*z-HZ)*sm(0,3,cDist(x,z)):0;
const gh=(x,z)=>{const k=seaK(x,z);return -.15+sm(0,9,Math.max(Math.abs(x)-HX-1.63,Math.abs(z)-HZ-1.43,0))*sm(0,3,cDist(x,z))*(nz(x,z)*1.1+1.3)*TH.hl*(1-k)-4*k;};
// the far side of the board (away from the default camera) gets most of the scenery; ZF flips z when the camera looks from the north
const ZF=CAM0.az?-1:1,rzf=(a,b)=>ZF*rnd(a,b);
const flames=[],flags=[],emit=[],smoke=[],trees=[],clouds=[],mists=[],keepOut=[],ripples=[],RIPG=new THREE.RingGeometry(.85,1,28).rotateX(-PI/2);let mill,KEEP,KEEP0,GOKG,GD1,GD2,GD3,GDS=0,GDI=false;const GFL=[],GSM=[];
const ST=new THREE.Group();sc.add(ST);
const RKM=TH.rc?PBR(TX.rock,TH.rc):M.rock;
// barren lands (theme gt:'dirt') use bare earth instead of grass for the ground and the board
TX.dirt=genTex(TQ,(x,y)=>{const n1=fbm(x/256*8,y/256*8,8,8,4),n2=fbm(x/256*64,y/256*64,64,64,2),c=fbm(x/256*20,y/256*20,20,20,3),l=.5+.35*(n1-.5)+.22*(n2-.5)-(c>.68?.12:0);return[l,l*.96,l*.9,n2*.6+n1*.4];},2.5,256);
// snow and sand (theme gt 'snow'/'sand'): soft drifts, wind ripples
TX.snow=genTex(TQ,(x,y)=>{const n1=fbm(x/256*6,y/256*6,6,6,4),n2=fbm(x/256*48,y/256*48,48,48,2),l=.9+.07*(n1-.5)+.05*(n2-.5);return[l,l,l,n1*.7+n2*.3];},1.2,256);
TX.sand=genTex(TQ,(x,y)=>{const w=fbm(x/256*3,y/256*3,3,3,3),rp=Math.sin((y/256*24+w*5)*PI*2),n2=fbm(x/256*40,y/256*40,40,40,2),l=.8+.05*rp+.08*(n2-.5);return[l,l*.95,l*.86,.5+.25*rp+.25*n2];},1.6,256);
// tiling value noise for the ground shaders: r = broad patches, g = medium, b = fine
const NZT=(()=>{const n=256,D=new Uint8Array(n*n*4);for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=(y*n+x)*4;D[i]=fbm(x/n*4,y/n*4,4,4,4)*255;D[i+1]=fbm(x/n*12,y/n*12,12,12,3)*255;D[i+2]=fbm(x/n*40,y/n*40,40,40,2)*255;D[i+3]=255;}
const t=new THREE.DataTexture(D,n,n,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;})();
// breaks up visible texture repeats on a material with a map: mixes in a second, rotated sample and broad brightness patches
function antiTile(m,f){m.onBeforeCompile=sh=>{sh.uniforms.uNz={value:NZT};sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D uNz;').replace('#include <map_fragment>',
'vec3 nq=texture2D(uNz,vUv*'+f+').rgb;vec4 texelColor=mix(texture2D(map,vUv),texture2D(map,vec2(vUv.y,-vUv.x)*.71+.37),smoothstep(.35,.65,nq.r));texelColor=mapTexelToLinear(texelColor);diffuseColor*=texelColor;diffuseColor.rgb*=mix(.84,1.1,nq.g);');};return m;}
const GTX=TX[TH.gt||'grass'];
{const gg=new THREE.PlaneGeometry(120,90,150,112);gg.rotateX(-PI/2);const p=gg.attributes.position;
for(let i=0;i<p.count;i++)p.setY(i,gh(p.getX(i),p.getZ(i)));gg.computeVertexNormals();
const nm=gg.attributes.normal,cols=new Float32Array(p.count*3),c1=new THREE.Color(TH.gr[0]),c2=new THREE.Color(TH.gr[1]),c3=new THREE.Color(TH.gr[2]),cr=new THREE.Color(TH.gr[3]),dr=new THREE.Color(TH.gr[4]),c=new THREE.Color();
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=p.getY(i),n=nz(x*1.3,z*1.3)*.5+.5;c.copy(c2).lerp(n>.5?c1:c3,Math.abs(n-.5)*1.6).lerp(c1,clamp(h*.1,0,.4));c.lerp(cr,clamp((1-nm.getY(i)-.08)*5,0,.85));if(nz(x*.7+9,z*.7)>.9)c.lerp(dr,.4);c.convertSRGBToLinear();cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;}
gg.setAttribute('color',new THREE.BufferAttribute(cols,3));const tg=GTX.a.clone(),tn=GTX.n.clone();tg.needsUpdate=tn.needsUpdate=true;tg.repeat.set(40,30);tn.repeat.set(40,30);
const gm=new THREE.Mesh(gg,antiTile(new THREE.MeshStandardMaterial({map:tg,normalMap:tn,vertexColors:true,roughness:.95,envMapIntensity:.5}),'.031'));gm.receiveShadow=true;L1(gm);sc.add(gm);}
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
// board: one surface whose shader blends grass, a dirt shoulder and the cobbled road from a blurred mask of the road cells (r = road, g = wider shoulder), with ragged edges from noise and the cobbles' own shape
const BMK=(()=>{const PX=24,mw=(W+2)*PX,mh=(H+2)*PX,A=new Float32Array(mw*mh);for(const k of road){const[c,r]=k.split(',').map(Number);if(c<-1||r<-1||c>W||r>H)continue;for(let y=(r+1)*PX;y<(r+2)*PX;y++)for(let x=(c+1)*PX;x<(c+2)*PX;x++)A[y*mw+x]=1;}
// separable box blur, run twice, edges clamped
const blur=(src,rad)=>{let a=src.slice(),t=new Float32Array(a.length);for(let p=0;p<2;p++){for(let y=0;y<mh;y++){let acc=0;for(let x=-rad;x<=rad;x++)acc+=a[y*mw+clamp(x,0,mw-1)];for(let x=0;x<mw;x++){t[y*mw+x]=acc/(2*rad+1);acc+=a[y*mw+Math.min(x+rad+1,mw-1)]-a[y*mw+Math.max(x-rad,0)];}}
for(let x=0;x<mw;x++){let acc=0;for(let y=-rad;y<=rad;y++)acc+=t[clamp(y,0,mh-1)*mw+x];for(let y=0;y<mh;y++){a[y*mw+x]=acc/(2*rad+1);acc+=t[Math.min(y+rad+1,mh-1)*mw+x]-t[Math.max(y-rad,0)*mw+x];}}}return a;};
const R1=blur(A,3),R2=blur(A,9),D=new Uint8Array(mw*mh*4);for(let i=0;i<mw*mh;i++){D[i*4]=R1[i]*255;D[i*4+1]=R2[i]*255;D[i*4+3]=255;}
const t=new THREE.DataTexture(D,mw,mh,THREE.RGBAFormat);t.magFilter=t.minFilter=THREE.LinearFilter;t.needsUpdate=true;return t;})();
{const gt=GTX.a.clone(),gn=GTX.n.clone();gt.needsUpdate=gn.needsUpdate=true;
const lc=c=>new THREE.Color(c).convertSRGBToLinear(),U={uMask:{value:BMK},uNz:{value:NZT},uRA:{value:TX.road.a},uRN:{value:TX.road.n},uDA:{value:TX.dirt.a},uDN:{value:TX.dirt.n},
uGC:{value:lc(TH.bd)},uRC:{value:lc(TH.rd).multiply(TH.gt=='dirt'?new THREE.Color(1.2,1.16,1.1):new THREE.Color(.86,.82,.76))},uDC:{value:lc(TH.gr[4]).lerp(lc(TH.gr[1]),.35).multiplyScalar(1.5)},uMR:{value:new THREE.Vector4(W/2+1,H/2+1,W+2,H+2)},uEd:{value:new THREE.Vector2(W/2+.2,H/2+.2)}};
const top=new THREE.MeshStandardMaterial({map:gt,normalMap:gn,roughness:.95,envMapIntensity:.5});
top.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vWP;').replace('#include <begin_vertex>','#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.)).xz;');
sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vWP;uniform sampler2D uMask,uNz,uRA,uRN,uDA,uDN;uniform vec3 uGC,uRC,uDC;uniform vec4 uMR;uniform vec2 uEd;\nvec3 lin(vec3 c){return pow(c,vec3(2.2));}')
.replace('#include <map_fragment>',`vec2 P=vWP;vec3 nb=texture2D(uNz,P*.07).rgb,nf=texture2D(uNz,P*.31).rgb;vec2 mk=texture2D(uMask,(P+uMR.xy)/uMR.zw).rg;
vec3 grass=lin(mix(texture2D(map,P*.35).rgb,texture2D(map,vec2(P.y,-P.x)*.23+.37).rgb,smoothstep(.35,.65,nb.r)))*uGC*mix(.8,1.12,nb.g);
vec3 rs=texture2D(uRA,P).rgb,ra=lin(rs);float rh=dot(rs,vec3(.33));vec3 da=lin(texture2D(uDA,P*.45).rgb)*uDC;
float wr=smoothstep(.44,.56,mk.r+(nf.b-.5)*.2+(nf.g-.5)*.16+(rh-.42)*.4);
float wd=max(smoothstep(.04,.42,mk.g+(nf.g-.5)*.3)*.9,smoothstep(.7,.82,nb.b+(nf.b-.5)*.2)*.5)*(1.-wr);
vec3 rc=mix(ra*uRC*mix(.82,1.1,nb.g)*mix(.9,1.1,nf.r),da*.7,smoothstep(.36,.22,rh))*mix(1.,.8,smoothstep(.75,.6,mk.r));
vec3 col=mix(grass,da,wd);col=mix(col,rc,wr);
float ed=min(uEd.x-abs(P.x),uEd.y-abs(P.y));col*=mix(.6,1.,smoothstep(0.,.45,ed));diffuseColor.rgb*=col;`)
.replace('#include <roughnessmap_fragment>','float roughnessFactor=roughness*mix(1.,.86,wr);')
.replace('texture2D( normalMap, vUv ).xyz * 2.0 - 1.0','normalize(mix(mix(texture2D(normalMap,P*.35).xyz*2.-1.,texture2D(uDN,P*.45).xyz*2.-1.,wd),(texture2D(uRN,P).xyz*2.-1.)*vec3(1.3,1.3,1.),wr))');};
const side=mat(0x5a4632);
const pl=part(sc,'box',[side,side,top,side,side,side],W+.4,.3,H+.4,0,-.15,0);pl.castShadow=false;pl.receiveShadow=true;L1(pl);}
// the breach and gate cells lie outside the board, so they keep a cobbled slab of their own
const RDM=PBR(TX.road,TH.rd);
for(const o of[...ENT,GATE])flat(RDM,1.01,.2,1.01,cx(o.c),-.07,cz(o.r));
const PADG=new THREE.CircleGeometry(.07,16);PADG.rotateX(-PI/2);const PADM=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.28,depthWrite:false}),pads=[];
for(let c=0;c<W;c++)for(let r=0;r<H;r++){if(road.has(c+','+r)||blk.has(c+','+r))continue;const m=L1(new THREE.Mesh(PADG,PADM));m.position.set(cx(c),.02,cz(r));sc.add(m);pads.push({c,r,m});}
function updPads(){for(const p of pads)p.m.visible=!g.sel&&free(p.c,p.r);}
function spot(m){for(;;){const c=Math.floor(rnd(0,W)),r=Math.floor(rnd(0,H)),rd=road.has(c+','+r);if(m==0&&(rd||blk.has(c+','+r))||m==1&&!rd)continue;const dx=rnd(-.5,.5),dz=rnd(-.5,.5);if(!rd&&Math.hypot(dx,dz)<.4)continue;return{x:cx(c)+dx,z:cz(r)+dz,y:rd?.03:0};}}
const cb=[];for(const k of road){const[c,r]=k.split(',').map(Number);for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){if(road.has((c+dx)+','+(r+dz))||c+dx<0||c+dx>=W||r+dz<0||r+dz>=H)continue;for(const o of[-.34,-.12,.1,.32])if(Math.random()<.7)cb.push({x:cx(c)+dx*rnd(.44,.5)+(dz?o:0),z:cz(r)+dz*rnd(.44,.5)+(dx?o:0),dx,dz});}}
scatter('box',mat(P.st2),cb.length,i=>{const q=cb[i],l=rnd(.1,.2);return{x:q.x,y:-.01,z:q.z,sx:q.dz?l:rnd(.07,.11),sy:rnd(.07,.11),sz:q.dx?l:rnd(.07,.11),ry:rnd(-.3,.3),col:[0xc8c0b0,0xa8a090,0x8e887c,0xb4aa96][i%4]};});
scatter('oct',mat(0xffffff),70,i=>{const p=spot(1),s2=rnd(.03,.06);return{x:p.x,y:.005,z:p.z,sx:s2,sy:s2*.5,ry:rnd(0,6),col:[0xb8ac94,0x9a8e78,0x857a68][i%3]};});
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
const outside=(x,z)=>(Math.abs(x)<HX+1.23&&Math.abs(z)<HZ+1.43)||inC(x,z,6.4,15,-1.6,7.2)||TH.sea&&gh(x,z)<-.4;
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
// the portcullis and the doors are their own group (GOK), swapped for broken ones by gate damage (gateDmg() below)
const GOK=new THREE.Group();GOK.userData.keep=true;CG.add(GOK);for(let i=0;i<7;i++)part(GOK,'box',0x4a4a5a,.04,.5,.04,X0-.14,.92,2.1+i*.133);for(let j=0;j<3;j++)part(GOK,'box',0x4a4a5a,.04,.04,.9,X0-.14,.78+j*.16,2.5);
part(GOK,'box',P.wd,.45,.9,.06,X0+.4,.45,2.12).rotation.y=-.9;part(GOK,'box',P.wd,.45,.9,.06,X0+.4,.45,2.88).rotation.y=.9;bake(GOK);
// gate damage as lives drop (castle coordinates; shown by gateDmg()): GD1 cracks in the gatehouse and its towers plus fallen stones, GD2 the splintered gate –
// a broken portcullis, one door hanging, one flat on the bridge, splinters everywhere – and GD3 fires, scorch marks and smoke (flames in GFL, smoke puffs in GSM)
{const gc=(G,x,y,z,n)=>{let p=[z,y],a=-PI/2+rnd(-.5,.5);for(let i=0;i<n;i++){const L=rnd(.05,.11);a+=rnd(-.8,.8);a=clamp(a,-PI+.35,-.35);const q=[p[0]+Math.cos(a)*L,p[1]+Math.sin(a)*L];
part(G,'box',0x1c1612,.014,L,.016,x,(p[1]+q[1])/2,(p[0]+q[0])/2).rotation.x=PI/2-a;if(i==2&&n>4)gc(G,x,q[1],q[0],3);p=q;}};
GD1=new THREE.Group();GD2=new THREE.Group();GD3=new THREE.Group();for(const G of[GD1,GD2,GD3]){G.userData.keep=true;G.visible=false;CG.add(G);}
for(const[y,z,n]of[[1.62,2.0,6],[1.6,2.85,7],[1.55,2.45,4],[1.3,2.3,3]])gc(GD1,X0-.29,y,z,n);
for(const[z,f]of[[1.55,.5],[3.45,.35],[1.55,.8]]){const r=.45*(1-.22*f);gc(GD1,X0-r-.012,2.2*f,z,5);}
for(let i=0;i<7;i++){const s=rnd(.06,.12);part(GD1,'box',[P.st2,P.st3,P.st][i%3],s,s*.8,s,rnd(7.45,7.95),.15+s*.4,rnd(1.75,3.25)).rotation.set(rnd(0,1),rnd(0,3),rnd(0,1));}
for(let i=0;i<7;i++){if(i==1||i==4)continue;const b=part(GD2,'box',0x4a4a5a,.04,.5,.04,X0-.14,.92-(i%3==2?.22:0),2.1+i*.133);b.rotation.x=rnd(-.3,.3);}
part(GD2,'box',0x4a4a5a,.04,.04,.9,X0-.14,1.1,2.5).rotation.x=.2;for(const z of[2.3,2.75])part(GD2,'box',0x4a4a5a,.04,.04,.5,7.7,.18,z).rotation.y=rnd(-.8,.8);
const dh=part(GD2,'box',P.wd,.45,.9,.06,X0+.28,.5,2.16);dh.rotation.set(0,-.45,.38);const df=part(GD2,'box',P.wd,.45,.06,.9,7.72,.2,2.72);df.rotation.set(0,.35,.06);
for(let i=0;i<16;i++)part(GD2,'box',i%2?P.wd:P.wd2,.022,.022,rnd(.07,.2),rnd(7.25,8.45),.17,rnd(1.95,3.05)).rotation.set(rnd(-.2,.2),rnd(0,PI),0);
for(const[y,z,w,h]of[[1.45,2.25,.5,.32],[1.5,2.85,.4,.28],[.6,2.2,.3,.5]])part(GD3,'box',0x17120e,.012,h,w,X0-.292,y,z);
for(const[x,y,z,s]of[[X0,1.72,2.05,1.7],[X0,1.72,2.95,1.5],[X0+.28,.55,2.2,1.2],[7.72,.24,2.72,1.5],[X0-.05,2.32,1.55,1.2]])flame(GD3,x,y,z,s,GFL,.8);
for(let i=0;i<7;i++){const m=new THREE.Mesh(geo('sph'),new THREE.MeshBasicMaterial({color:0x2e2a28,transparent:true,opacity:0,depthWrite:false}));m.userData.keep=true;m.castShadow=false;GD3.add(m);GSM.push({m,ph:i/7,z:rnd(2.05,2.95)});}
for(const G of[GD1,GD2])bake(G);bake(GD3);GOKG=GOK;}
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
function broad(g,k){const H=rnd(.85,1.15),tc=k==3?0xe9e5da:P.wd2,cols=k==2?[0xf2a63a,0xe0802a,0xffc15a]:k==3?[0xb8dc6a,0xa4cf58,0xd4ec8c]:k==10?[0xc8442e,0xd8602e,0xa83a26]:TH.leaf&&(k==8||k==11||LV.th=='darkwood')?TH.leaf:[0x4aa84e,0x62bf5a,0x3a8f48];
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
// a palm: a curved trunk of short segments, a crown of drooping fronds (needle cards) and a few coconuts
function palm(g){const H=rnd(1.6,2.3),lean=rnd(.1,.3);let px=0,py=0;for(let i=0;i<6;i++){const nx=px+lean*.12*i,ny=py+H/6;rod(g,px,py,0,nx,ny,0,.07-i*.006,i%2?0x8a6a44:0x7a5a3a);px=nx;py=ny;}
for(let j=0;j<8;j++){const a=j/8*PI*2;card(g,needMat(j%2?0x4a8a3a:0x5a9a40),px+Math.sin(a)*.32,py,Math.cos(a)*.32,.75,1.2,a,0);}for(let j=0;j<3;j++)part(g,'sph',0x5a4024,.06,.06,.06,px+Math.sin(j*2)*.08,py-.08,Math.cos(j*2)*.08);}
function tree(x,z,k,s){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.scale.setScalar(s);g.rotation.y=rnd(0,6);g.userData.ph=rnd(0,6);
if(k==0)pine(g,rnd(1.5,2.1));else if(k==9)palm(g);else if(k==6)pine(g,rnd(2.1,3.1),TH.pine);else if(k==7)pine(g,rnd(1.5,2.2),[0x221c1a,0x2e2420,0x3a2a22]);else if(k==4)dead(g,LV.th=='burning'||LV.th=='hell'||LV.th=='void'?0x1f1a17:0x6a5c50);else if(k==5)dead(g,0x1c1714,.12);else broad(g,k);
if(k==7&&Math.random()<.4)flame(g,0,rnd(1,1.6),0,rnd(1.2,1.8));bake(g);sc.add(g);trees.push(g);}
function bush(x,z,s,fl){const g=new THREE.Group();g.position.set(x,gh(x,z),z);g.scale.setScalar(s);const cols=TH.leaf||[0x4aa84e,0x62bf5a,0x3a8f48];
for(let i=0;i<5;i++){const a=i*1.3,r=i?.22:0;part(g,'sph',folMat(cols[i%3]),.25,.2,.25,Math.sin(a)*r,.16,Math.cos(a)*r);for(let j=0;j<4;j++)card(g,leafMat(cols[(i+j)%3]),Math.sin(a)*r+rnd(-.25,.25),.15+rnd(0,.2),Math.cos(a)*r+rnd(-.25,.25),rnd(.3,.45),rnd(-.5,.5),rnd(0,PI),0);}
if(fl)for(let i=0;i<8;i++)part(g,'sph',fl[i%fl.length],.035,.035,.035,rnd(-.3,.3),.2+rnd(0,.2),rnd(-.3,.3));bake(g);sc.add(g);}
// no scenery on the board, the castle, the ground in front of each breach (where the army gathers) or near ruins
const inBr=(x,z)=>ENT.some((o,i)=>{const q=toB(x,z,i);return q.x<-6&&q.x>-11&&q.z>-5.4&&q.z<.4;});
const okSpot=(x,z,m)=>!(Math.abs(x)<HX+1.03+m&&Math.abs(z)<HZ+1.23+m)&&!inC(x,z,6.4,15,-1.6,7.2)&&!inBr(x,z)&&!keepOut.some(k=>Math.hypot(x-k[0],z-k[1])<k[2])&&!(TH.sea&&gh(x,z)<-.4);
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
function crack(x,z,len,w,m){const n=Math.ceil(len*4),pos=[],idx=[];let a=rnd(0,6),px=x,pz=z;for(let i=0;i<=n;i++){a+=rnd(-.5,.5);const ww=w*(1-Math.abs(i/n-.5)*1.6),nx=Math.cos(a+PI/2)*ww,nz2=Math.sin(a+PI/2)*ww;
pos.push(px+nx,gh(px+nx,pz+nz2)+.025,pz+nz2,px-nx,gh(px-nx,pz-nz2)+.025,pz-nz2);if(i)idx.push(i*2-2,i*2-1,i*2,i*2-1,i*2+1,i*2);px+=Math.cos(a)*.25;pz+=Math.sin(a)*.25;if(!okSpot(px,pz,0))break;}
const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g2.setAttribute('uv',new THREE.Float32BufferAttribute(pos.map((v,i)=>i%3==0?v*.3:i%3==2?v*.3:0).filter((v,i)=>i%3!=1),2));g2.setIndex(idx);sc.add(L1(new THREE.Mesh(g2,m||LAVA)));}
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
windmill(10.5,-4.4);}
// a stone windmill whose sails turn (mill, animated in sync())
function windmill(x,z){const g=new THREE.Group();g.position.set(x,gh(x,z),z);ST.add(g);part(g,'tap',P.st3,.4,1.2,.4,0,.6,0);part(g,'cone',RF(P.rd),.48,.45,.48,0,1.42,0);win(g,0,.3,.38,.12,.2,0,P.wd2);
mill=new THREE.Group();mill.position.set(0,1.05,.4);mill.userData.keep=true;part(mill,'box',P.wd,.09,1.5,.04,0,0,0);part(mill,'box',P.wd,1.5,.09,.04,0,0,0);part(mill,'sph',P.gd,.07,.07,.07,0,0,.03);
for(const[x,y,w,h]of[[.17,.5,.24,.5],[-.17,-.5,.24,.5],[.5,-.17,.5,.24],[-.5,.17,.5,.24]])part(mill,'box',0xfff6e0,w,h,.02,x,y,0);g.add(mill);}
if(LV.th=='burning'||LV.th=='ruins'){const n=LV.th=='ruins'?14:9,KC0=CW(10.5,2.5);for(let i=0;i<n;i++){let p=null;for(let j=0;j<20&&!p;j++){const q=freeSpot(.6,i<n*.7);if(q&&Math.hypot(q.x-KC0.x,q.z-KC0.z)>6)p=q;}if(p)ruin(p.x,p.z,rnd(0,6),rnd(1,1.5),rnd(.85,1.15),LV.th=='burning'?i%3!=2:i%4==0);}}
if(LV.th=='darkwood'){for(let i=0;i<70;i++){const p=freeSpot(-.5);if(!p)continue;const g=groupAt(p.x,p.z),gl2=i%3==0;for(let j=0;j<3;j++)mushroom(g,rnd(-.2,.2),rnd(-.2,.2),rnd(.8,1.6),gl2?0x6ac8d8:[0xb8442e,0xc8a070][j%2],gl2?0x5ae0ff:undefined);}
for(let i=0;i<12;i++){const p=freeSpot(0);if(!p)continue;const g=groupAt(p.x,p.z,gh(p.x,p.z)+.1);g.rotation.y=rnd(0,6);part(g,'cyl',P.wd2,.11,rnd(1,1.8),.11,0,0,0).rotation.z=PI/2;}
for(let i=0;i<7;i++){const p=freeSpot(.5,true);if(!p)continue;const y=gh(p.x,p.z)+rnd(.4,.9);for(const d of[-.06,.06])glow(sc,p.x+d,y,p.z,.14,0xffd84a);}}
if(LV.th=='marsh'){for(let i=0;i<16;i++){const p=freeSpot(.4);if(p){pool(p.x,p.z,rnd(.6,1.8),BOG);keepOut.push([p.x,p.z,.9]);}}
for(let i=0;i<14;i++){const p=freeSpot(0);if(p){const g=groupAt(p.x,p.z);part(g,'tap',0x3a3024,.13,rnd(.2,.45),.13,0,.15,0);}}}
// ---------- the lands of levels 9–16 ----------
// shared: water (oasis, the sea), ice, sandstone, a void texture like the lava's; bobs = things that float (ships, the void's islands), moved in moteAnim()
const WATR=new THREE.MeshStandardMaterial({color:new THREE.Color(TH.wc||0x2a6a8a).convertSRGBToLinear(),roughness:.1,metalness:.15,normalMap:WN,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:1.2}),
ICE=new THREE.MeshStandardMaterial({color:new THREE.Color(0xd4eaf4).convertSRGBToLinear(),roughness:.18,metalness:.05,envMapIntensity:1.3}),SANDM=PBR(TX.rock,0xd8b480,{roughness:.95}),bobs=[];
const VOIDT=mkC(128,128,(x,w,h)=>{x.fillStyle='#8a3aff';x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.fillStyle='rgba('+(160+rnd(0,90)|0)+',120,255,.7)';x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(3,10),0,7);x.fill();}
for(let i=0;i<26;i++){x.fillStyle='rgba(10,4,20,.9)';x.beginPath();const px=rnd(0,w),py=rnd(0,h);for(let j=0;j<6;j++){const a=j/6*PI*2,rr=rnd(6,15);x.lineTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr);}x.fill();}});
VOIDT.wrapS=VOIDT.wrapT=THREE.RepeatWrapping;const VOIDM=new THREE.MeshBasicMaterial({map:VOIDT,side:THREE.DoubleSide});VOIDM.color.setRGB(1,.9,1.15);
// a crystal cluster: tilted glowing points round a big one, with a glow (crystal lands, blocked cells, floating islands)
function crys(g,x,z,s,c,em){for(let i=0;i<6;i++){const a=i*1.1,d=i?.12*s:0,h=(i?rnd(.25,.45):.7)*s,m=part(g,'cone',c,.07*s,h,.07*s,x+Math.sin(a)*d,h/2,z+Math.cos(a)*d,em);m.rotation.set(i?Math.cos(a)*.5:0,0,i?-Math.sin(a)*.5:0);m.castShadow=false;}glow(g,x,.35*s,z,.9*s,em);}
// a sailing ship (pirates: black sails with a skull, a black flag); wreck = listing, half sunk, a broken mast and no sails
function ship(x,z,ry,s,wreck){const g=new THREE.Group();g.position.set(x,wreck?-1.45:-1.28,z);g.rotation.set(0,ry,wreck?.38:0);g.scale.setScalar(s);sc.add(g);const hc=0x4a3020,dk=0x6a4a2e;
part(g,'box',hc,.72,.42,2.2,0,.15,0);part(g,'cone',hc,.36,.6,.21,0,.15,1.38).rotation.x=PI/2;part(g,'box',dk,.66,.04,2.1,0,.37,0);part(g,'box',hc,.76,.34,.55,0,.48,-.9);part(g,'box',P.gd,.78,.03,.57,0,.66,-.9);
for(const d of[-1,1]){part(g,'box',dk,.04,.12,2.1,d*.36,.44,.05);for(let i=0;i<4;i++)part(g,'box',0x1a1410,.02,.07,.1,d*.365,.22,-.6+i*.42);}
const ms=wreck?[[.25,.9]]:[[.35,1.9],[-.35,1.6]];for(const[mz,mh]of ms){part(g,'cyl',P.wd2,.035,mh,.035,0,.37+mh/2,mz);if(wreck)continue;
for(const[y,w]of[[mh*.55,.95],[mh*.85,.7]]){const sl=part(g,'box',0x24201e,w,.42*w,.02,0,.37+y,mz+.04);sl.castShadow=false;}part(g,'sph',0xe8e0cc,.09,.08,.02,0,.37+mh*.55,mz+.06);
part(g,'box',P.wd2,1.05,.03,.03,0,.37+mh*.75,mz);}if(!wreck)flags.push(flag(g,0,.37+1.9,.35,0x141414,.9));
bake(g);g.traverse(o=>{if(o.isMesh)L1(o);});if(!wreck)bobs.push({g,y0:g.position.y,ph:rnd(0,6),r:rnd(.02,.04)});return g;}
// a sandstone pillar, whole or broken (a fallen drum beside it)
function pillar(g,x,z,s,broken){let y=0;const n=broken?2:4;for(let i=0;i<n;i++){const h=rnd(.25,.35)*s,w=(.42-i*.04)*s;part(g,'box',SANDM,w,h,w,x+rnd(-.02,.02),y+h/2,z+rnd(-.02,.02)).rotation.y=rnd(-.15,.15);y+=h;}
if(!broken)part(g,'box',SANDM,.5*s,.08*s,.5*s,x,y+.04*s,z);else{const c=part(g,'cyl',SANDM,.16*s,.6*s,.16*s,x+.35*s,.14*s,z+.1*s);c.rotation.set(PI/2,0,rnd(0,3));}}
function haystack(g,x,z,s,round){if(round){const b=part(g,'cyl',0xd8b860,.26*s,.36*s,.26*s,x,.26*s,z);b.rotation.z=PI/2;}else{part(g,'cyl',0xd4b058,.3*s,.35*s,.3*s,x,.175*s,z);part(g,'cone',0xe0bc64,.34*s,.35*s,.34*s,x,.52*s,z);}}
function pumpkin(g,x,z,s){part(g,'sph',0xe0782a,.14*s,.1*s,.14*s,x,.08*s,z);part(g,'cyl',0x4a6a2a,.015*s,.06*s,.015*s,x,.19*s,z);}
let STM=null,RAIN=null;
// Harvest Vale: a windmill, farmhouses and a red barn, haystacks, pumpkin patches, wheat fields, fences and scarecrows
if(LV.th=='autumn'){const f=freeSpot(1.2,true);if(f)windmill(f.x,f.z);for(let i=0;i<3;i++){const q=freeSpot(1,true);if(q)house(q.x,q.z,rnd(0,6),rnd(.9,1.2),rnd(.8,.95),[P.rd,0xc86a2a,0x8a5a3a][i]);}
{const q=freeSpot(1.4,true);if(q){const g=groupAt(q.x,q.z);g.rotation.y=rnd(0,6);part(g,'box',0x8a2a22,1.4,.8,1,0,.4,0);part(g,'pyr',RF(0x4a3a30),1.5,.6,1.1,0,1.1,0);part(g,'box',0xf0e8d8,.5,.55,.02,0,.28,.51);keepOut.push([q.x,q.z,1.2]);}}
for(let i=0;i<16;i++){const q=freeSpot(.3);if(q){const g=groupAt(q.x,q.z);haystack(g,0,0,rnd(.9,1.3),i%2);}}
for(let i=0;i<8;i++){const q=freeSpot(.3);if(q){const g=groupAt(q.x,q.z);for(let j=0;j<5;j++)pumpkin(g,rnd(-.4,.4),rnd(-.4,.4),rnd(.8,1.3));}}
for(let i=0;i<3;i++){const q=freeSpot(2,true);if(!q)continue;const w=rnd(2.5,4),d=rnd(1.5,2.5);keepOut.push([q.x,q.z,1.6]);
scatter(CROSS,PM2(GRASST),260,()=>{const x=q.x+rnd(-w/2,w/2),z=q.z+rnd(-d/2,d/2);if(!okSpot(x,z,-.6))return null;return{x,y:gh(x,z),z,sx:rnd(.3,.45),sy:rnd(.45,.6),ry:rnd(0,PI),col:0xffe08a};});}
for(let i=0;i<6;i++){const q=freeSpot(.2);if(!q)continue;const g=groupAt(q.x,q.z),a=rnd(0,6),n=5;for(let j=0;j<n;j++){const ox=Math.cos(a)*j*.4,oz=Math.sin(a)*j*.4;part(g,'box',P.wd2,.05,.38,.05,ox,.19,oz);if(j)for(const y of[.14,.3])rod(g,ox,y,oz,ox-Math.cos(a)*.4,y,oz-Math.sin(a)*.4,.015,P.wd);}}
for(let i=0;i<2;i++){const q=freeSpot(.4);if(!q)continue;const g=groupAt(q.x,q.z);part(g,'cyl',P.wd2,.03,1,.03,0,.5,0);part(g,'box',P.wd2,.6,.04,.04,0,.75,0);part(g,'box',0x8a3a2a,.3,.32,.14,0,.7,0);part(g,'sph',0xd8b860,.1,.1,.1,0,.95,0);part(g,'cone',0x6a5030,.2,.12,.2,0,1.05,0);}}
// Saltcliff Cove: the sea, pirate ships in the bay, a wreck below the cliffs, a smugglers' camp and a beacon on the cliff top
if(LV.th=='coast'){{const sg=new THREE.PlaneGeometry(140,100);sg.rotateX(-PI/2);const uv=sg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*6,uv.getY(i)*6);const SEA=WATR.clone();SEA.color.multiplyScalar(.6);const sm2=L1(new THREE.Mesh(sg,SEA));sm2.position.y=-1.25;sm2.receiveShadow=true;sc.add(sm2);}
const sea=()=>{for(let i=0;i<80;i++){const x=rnd(-HX-14,HX+14),z=-ZF*rnd(HZ+8,HZ+18);if(gh(x,z)<-2.2)return{x,z};}return null;};
for(let i=0;i<3;i++){const q=sea();if(q)ship(q.x,q.z,rnd(0,6),rnd(1,1.4));}
for(let i=0;i<80;i++){const x=rnd(-HX,HX),z=-ZF*rnd(HZ+3.6,HZ+6),h=gh(x,z);if(h<-1.2&&h>-2.6){ship(x,z,rnd(0,6),1,true);for(let j=0;j<5;j++){const m=part(ST,'oct',RKM,rnd(.3,.6),rnd(.3,.5),rnd(.3,.6),x+rnd(-1,1),-1.3,z+rnd(-1,1));m.rotation.y=rnd(0,6);}break;}}
for(let i=0;i<14;i++){const x=rnd(-HX-14,HX+14),z=-ZF*rnd(HZ+3.4,HZ+6);if(gh(x,z)>-1.6)continue;const s2=rnd(.4,1.1),m=part(ST,'oct',RKM,s2,s2*rnd(.8,1.6),s2,x,-1.25+s2*.3,z);m.rotation.set(rnd(0,.4),rnd(0,6),0);}
{const q=freeSpot(1.5,true);if(q){const g=groupAt(q.x,q.z);keepOut.push([q.x,q.z,1.6]);for(const[x,z,c]of[[-.5,-.3,0x7a2a22],[.6,-.4,0xd8c8a0]])part(g,'pyr',c,.8,.6,.7,x,.3,z).rotation.y=rnd(0,1);
for(let j=0;j<6;j++)part(g,'cyl',P.wd,.12,.28,.12,rnd(-.9,.9),.14,rnd(.2,.8));for(let j=0;j<4;j++)part(g,'box',P.wd2,.24,.2,.24,rnd(-.9,.9),.1,rnd(-.2,.9)).rotation.y=rnd(0,3);fire(g,0,0,.4,.9);flags.push(flag(g,.9,0,-.6,0x141414,1.6));}}
{const q=freeSpot(.8,true);if(q){const g=groupAt(q.x,q.z);part(g,'tap',P.st2,.35,1.6,.35,0,.8,0);part(g,'cyl',P.st3,.42,.1,.42,0,1.62,0);part(g,'cyl',0x2a2420,.3,.12,.3,0,1.72,0);fire(g,0,1.72,0,1.1);}}
for(let i=0;i<10;i++){const q=freeSpot(0,true);if(q){const g=groupAt(q.x,q.z);part(g,'cyl',P.wd,.11,.26,.11,0,.13,0);}}}
// Sunscorch Dunes: an oasis ringed by palms, sandstone pillars and arches, two tents, bleached bones
if(LV.th=='desert'){const q=freeSpot(1.8,true);if(q){pool(q.x,q.z,rnd(1.1,1.4),WATR);keepOut.push([q.x,q.z,1.5]);for(let i=0;i<6;i++){const a=i/6*PI*2+rnd(0,.5),d=rnd(1.5,2.1);tree(q.x+Math.cos(a)*d,q.z+Math.sin(a)*d,9,rnd(.9,1.3));}
for(let i=0;i<14;i++){const a=rnd(0,6),d=rnd(1,1.4),g=groupAt(q.x+Math.cos(a)*d,q.z+Math.sin(a)*d);part(g,'cyl',0x6a7a40,.012,rnd(.3,.5),.012,0,.2,0);}}
for(let i=0;i<14;i++){const p=freeSpot(.4,i<10);if(!p)continue;const g=groupAt(p.x,p.z);pillar(g,0,0,rnd(1.2,2),i%3==0);keepOut.push([p.x,p.z,.6]);}
for(let i=0;i<2;i++){const p=freeSpot(1,true);if(!p)continue;const g=groupAt(p.x,p.z);g.rotation.y=rnd(0,6);pillar(g,-.6,0,2.2);pillar(g,.6,0,2.2);part(g,'box',SANDM,1.8,.25,.5,0,1.42,0);keepOut.push([p.x,p.z,1]);}
for(let i=0;i<2;i++){const p=freeSpot(.8,true);if(!p)continue;const g=groupAt(p.x,p.z);part(g,'pyr',i?0x8a3a2a:0xd8c8a0,.9,.7,.9,0,.35,0).rotation.y=PI/4;part(g,'pyr',i?0xd8c8a0:0x8a3a2a,.92,.18,.92,0,.6,0).rotation.y=PI/4;}
for(let i=0;i<10;i++){const p=freeSpot(0);if(p){const g=groupAt(p.x,p.z);bones(g,0,0,rnd(.8,1.3));}}}
// Frostpeak Hold: mountains with snowy peaks behind the fortress, frozen ponds, snowdrifts
if(LV.th=='snow'){for(let i=0;i<8;i++){const x=rnd(-HX-16,HX+16),z=-ZF*rnd(HZ+13,HZ+22),r=rnd(4,7),h=rnd(6,10),g=groupAt(x,z,gh(x,z)-.5);part(g,'cone',RKM,r,h,r,0,h/2,0).rotation.y=rnd(0,6);part(g,'cone',0xf4f6f8,r*.42,h*.42,r*.42,0,h*.79+.02,0);}
for(let i=0;i<3;i++){const q=freeSpot(1.2);if(q){pool(q.x,q.z,rnd(.9,1.5),ICE);keepOut.push([q.x,q.z,1.3]);}}
for(let i=0;i<12;i++){const q=freeSpot(0);if(q){const g=groupAt(q.x,q.z);part(g,'sph',0xf4f6f8,rnd(.3,.6),rnd(.1,.18),rnd(.3,.6),0,0,0);}}}
// Crystal Hollow: glowing crystal clusters (a few huge ones) and glowing mushrooms
if(LV.th=='crystal'){for(let i=0;i<46;i++){const p=freeSpot(0);if(!p)continue;const g=groupAt(p.x,p.z),v=i%3==0;crys(g,0,0,i<6?rnd(2,3):rnd(.7,1.4),v?0xc8a0ff:0x7af0e0,v?0x6a3ab0:0x1a8a80);if(i<6)keepOut.push([p.x,p.z,.8]);}
for(let i=0;i<30;i++){const p=freeSpot(-.4);if(!p)continue;const g=groupAt(p.x,p.z);for(let j=0;j<3;j++)mushroom(g,rnd(-.2,.2),rnd(-.2,.2),rnd(.8,1.5),j%2?0x6ac8d8:0xb88ae8,j%2?0x5ae0ff:0xa070ff);}}
// Wolfjaw Pass: rock spires crowding the road, cairns and a ruined watchtower on the ridge (the steep hills are TH.hl)
if(LV.th=='pass'){for(let i=0;i<26;i++){const p=freeSpot(.2,i%3!=0);if(!p)continue;const g=groupAt(p.x,p.z,gh(p.x,p.z)-.1);spire(g,0,0,rnd(1.4,3),RKM);keepOut.push([p.x,p.z,.7]);}
for(let i=0;i<8;i++){const p=freeSpot(0);if(!p)continue;const g=groupAt(p.x,p.z);let y=0;for(let j=0;j<4;j++){const s2=.2-j*.035;part(g,'oct',RKM,s2,s2*.6,s2,rnd(-.03,.03),y+s2*.3,rnd(-.03,.03));y+=s2*.6;}}
{const p=freeSpot(1,true);if(p){const g=groupAt(p.x,p.z);part(g,'tap',P.st2,.5,1.5,.5,0,.75,0);for(let i=0;i<8;i++){const a=i/8*PI*2,h=rnd(.1,.4);part(g,'box',P.st,.18,h,.14,Math.sin(a)*.45,1.5+h/2,Math.cos(a)*.45).rotation.y=a;}flags.push(flag(g,.2,1.5,0,P.rd,1.4));keepOut.push([p.x,p.z,1]);}}}
// Stormwatch Heights: two stone circles and lone standing stones; rain (RAIN) and lightning with thunder (STM), both run in moteAnim()
if(LV.th=='storm'){for(let k=0;k<2;k++){const q=freeSpot(1.8,true);if(!q)continue;keepOut.push([q.x,q.z,2]);for(let i=0;i<8;i++){const a=i/8*PI*2,g=groupAt(q.x+Math.cos(a)*1.3,q.z+Math.sin(a)*1.3),h=rnd(.8,1.3);part(g,'box',GRV,.36,h,.18,0,h/2-.05,0).rotation.set(rnd(-.1,.1),-a,rnd(-.1,.1));}}
for(let i=0;i<10;i++){const q=freeSpot(0);if(!q)continue;const g=groupAt(q.x,q.z),h=rnd(.6,1.1);part(g,'box',GRV,.3,h,.16,0,h/2-.05,0).rotation.set(rnd(-.15,.15),rnd(0,3),rnd(-.15,.15));}
const n=700,ps=new Float32Array(n*6),dr=[];for(let i=0;i<n;i++)dr.push({x:rnd(-HX-6,HX+6),y:rnd(0,9),z:rnd(-HZ-6,HZ+6),v:rnd(9,13)});
const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(ps,3));RAIN={dr,ps,g:rg,m:L1(new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:new THREE.Color(0xa8b8c8).convertSRGBToLinear(),transparent:true,opacity:.35,depthWrite:false})))};RAIN.m.frustumCulled=false;sc.add(RAIN.m);
const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(30*3),3));
STM={t:rnd(3,6),f:0,l:new THREE.HemisphereLight(0xcfe0ff,0x404858,0),b:L1(new THREE.Line(bg,new THREE.LineBasicMaterial({color:new THREE.Color(0xe8f0ff),toneMapped:false})))};sc.add(STM.l,STM.b);STM.b.visible=false;STM.b.frustumCulled=false;}
// The Sundered Realm: floating islands (bobs), void cracks and pools, black shards with a violet glow
if(LV.th=='void'){for(let i=0;i<10;i++){const p=freeSpot(1,i<7);if(!p)continue;const g=new THREE.Group(),r=rnd(.7,1.5),h=rnd(1.3,2.4);g.position.set(p.x,gh(p.x,p.z)+rnd(1.8,4.2),p.z);sc.add(g);
part(g,'cone',RKM,r,h,r,0,-h/2,0).rotation.x=PI;part(g,'cyl',0x2a2432,r*1.02,.12,r*1.02,0,.02,0);if(i%2)spikes(g,rnd(-.3,.3),rnd(-.3,.3),rnd(.5,.9));else crys(g,0,0,rnd(.7,1.1),0xc8a0ff,0x7a3ad0);
bake(g);g.traverse(o=>{if(o.isMesh)L1(o);});bobs.push({g,y0:g.position.y,ph:rnd(0,6),r:.03,a:.25});}
for(let i=0;i<24;i++){const p=freeSpot(.3);if(p)crack(p.x,p.z,rnd(1.5,4),rnd(.06,.16),VOIDM);}
for(let i=0;i<5;i++){const p=freeSpot(.6);if(p){pool(p.x,p.z,rnd(.5,1.2),VOIDM);keepOut.push([p.x,p.z,1]);}}
for(let i=0;i<22;i++){const p=freeSpot(.2,i%2==0);if(!p)continue;const g=groupAt(p.x,p.z,gh(p.x,p.z)-.05);spikes(g,0,0,rnd(.8,1.8));if(i%4==0)glow(g,0,.5,0,1.2,0x9a4aff);keepOut.push([p.x,p.z,.6]);}}
// level mechanics on the board (MECH in js/01-config.js): Darkwood's fog lies on the FOG cells as a ground haze plus slow wisps (fogs, drifted in moteAnim);
// Mirefen's bog road cells (BOGC) are flooded, with reeds in the corners and lily pads the enemies wade through
const fogs=[];if(FOG.size){const hz=new THREE.MeshBasicMaterial({map:GT,color:new THREE.Color(0xc4d2c8).convertSRGBToLinear(),transparent:true,opacity:.42,depthWrite:false}),HZG=new THREE.PlaneGeometry(1,1).rotateX(-PI/2),
wm=new THREE.SpriteMaterial({map:GT,color:new THREE.Color(0xb8c8bc).convertSRGBToLinear(),transparent:true,opacity:.2,depthWrite:false});
for(const k of FOG){const[c,r]=k.split(',').map(Number),x=cx(c),z=cz(r),h=L1(new THREE.Mesh(HZG,hz));h.position.set(x,.05,z);h.scale.set(1.7,1,1.7);h.rotation.y=rnd(0,6);sc.add(h);
for(let i=0;i<2;i++){const s2=L1(new THREE.Sprite(wm)),y=rnd(.25,.6);s2.position.set(x,y,z);s2.scale.set(rnd(1.1,1.6),rnd(.45,.7),1);sc.add(s2);fogs.push({s:s2,x,z,y,v:rnd(.15,.35),ph:rnd(0,6)});}}}
const MUD=BOGC.size?new THREE.MeshStandardMaterial({color:new THREE.Color(0x454a28).convertSRGBToLinear(),roughness:.12,metalness:.1,normalMap:WN,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:1.3}):null;
for(const k of BOGC){const[c,r]=k.split(',').map(Number),x=cx(c),z=cz(r),g=groupAt(x,z,0);pool(x,z,.64,MUD,.025);
for(let q=0;q<4;q++)for(let i=0;i<4;i++){const a=PI/4+q*PI/2+rnd(-.3,.3),d=rnd(.4,.52);part(g,'cyl',[0x6a7040,0x7a7c48,0x58603a][i%3],.012,rnd(.25,.5),.012,Math.sin(a)*d,.15,Math.cos(a)*d).rotation.set(rnd(-.2,.2),0,rnd(-.2,.2));}
for(let i=0;i<3;i++){const a=rnd(0,6),d=rnd(.15,.38);part(g,'cyl',0x4f7a34,rnd(.05,.08),.008,rnd(.05,.08),Math.sin(a)*d,.04,Math.cos(a)*d).castShadow=false;}}
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
for(let i=0;i<TH.rk;i++){const x=rnd(-HX-7.8,HX+7.8),z=rzf(-HZ-6.8,HZ+4.8);if(!okSpot(x,z,-.4))continue;const s2=rnd(.15,.4)*(LV.th=='pass'?1.8:1),m=part(ST,'oct',RKM,s2,s2*rnd(.5,.9),s2*rnd(.7,1.1),x,gh(x,z)+s2*.2,z);if(TH.gt=='snow')part(ST,'sph',0xf4f6f8,s2*.8,s2*.25,s2*.8,x,gh(x,z)+s2*.62,z);m.rotation.set(rnd(0,.5),rnd(0,6),rnd(0,.4));}
// blocked cells on the board: something nobody can build on, matching the land
for(const k of blk){if(RUC.has(k))continue;const[c,r]=k.split(',').map(Number),x=cx(c),z=cz(r),g=groupAt(x,z,0),t=LV.th,alt=(c+r)%2;
if(t=='darkwood'){if(alt){part(g,'tap',0x5a3a1e,.32,.45,.32,0,.22,0);part(g,'cyl',0xb89a6a,.25,.02,.25,0,.455,0);for(let i=0;i<5;i++){const a=i*1.25;rod(g,Math.sin(a)*.2,.15,Math.cos(a)*.2,Math.sin(a)*.45,.0,Math.cos(a)*.45,.06,0x5a3a1e);}for(let i=0;i<4;i++)mushroom(g,rnd(-.35,.35),rnd(-.35,.35),rnd(1,1.6),0x6ac8d8,0x5ae0ff);}
else{for(let i=0;i<3;i++){const s2=[.38,.24,.18][i],m=part(g,'oct',RKM,s2,s2*.75,s2,rnd(-.2,.2),s2*.35,rnd(-.2,.2));m.rotation.set(rnd(0,.5),rnd(0,6),0);}part(g,'sph',folMat(0x3a6a30),.3,.08,.28,0,.33,0);mushroom(g,.3,.2,1.3,0xb8442e);}}
else if(t=='burning'){for(let i=0;i<5;i++){const b=part(g,'cyl',0x1c1714,.06,rnd(.6,.9),.06,rnd(-.15,.15),.08+i*.03,rnd(-.15,.15));b.rotation.set(PI/2,0,rnd(0,PI));}fire(g,0,.05,0,1.3);}
else if(t=='marsh'){pool(x,z,.42,BOG,.035);for(let i=0;i<8;i++){const a=rnd(0,6);part(g,'cyl',0x6a7040,.012,rnd(.3,.55),.012,Math.sin(a)*.42,.2,Math.cos(a)*.42).rotation.z=rnd(-.2,.2);}if(alt)part(g,'tap',0x3a3024,.08,.5,.08,.1,.25,-.1);}
else if(t=='ruins'){for(let i=0;i<16;i++){const s2=rnd(.06,.18),m=part(g,'oct',[P.st,P.st2,0x3a3430][i%3],s2,s2*.7,s2,rnd(-.38,.38),s2*.3,rnd(-.38,.38));m.rotation.set(rnd(0,3),rnd(0,6),0);}
const h=rnd(.45,.75),wl=part(g,'box',P.st2,.8,h,.12,0,h/2,alt?.2:-.2);wl.rotation.y=alt?.3:-.2;part(g,'box',0x2a2522,.81,.05,.13,0,h,alt?.2:-.2).rotation.y=wl.rotation.y;const b=part(g,'box',0x1c1816,.06,.06,.8,.1,.1,0);b.rotation.set(.3,.8,0);}
else if(t=='moor'){part(g,'sph',0x3a3028,.4,.12,.4,0,0,0);grave(g,0,-.15,ZF<0?PI:0,1.6);if(alt){grave(g,-.3,.2,.4,1.1);bones(g,.25,.25,1);}else{part(g,'cyl',0xf0e8d0,.025,.1,.025,.28,.12,.25);flame(g,.28,.17,.25,.5);}}
else if(t=='badlands'||t=='hell'&&alt){pool(x,z,.4,LAVA,.03);for(let i=0;i<10;i++){const a=i/10*PI*2,s2=rnd(.08,.15),m=part(g,'oct',t=='hell'?OBS:SPIRE,s2,s2*.7,s2,Math.sin(a)*.44,s2*.3,Math.cos(a)*.44);m.rotation.set(rnd(0,3),rnd(0,6),0);}glow(g,0,.2,0,1.1,0xff6a20);g.updateWorldMatrix(true,false);emit.push([x,.3,z]);}
else if(t=='hell'){spikes(g,0,0,1.1);skull(g,.25,0,.25,1.3);}
else if(t=='autumn'){if(alt){haystack(g,-.12,0,1.2,1);haystack(g,.2,.22,.8,1);}else{for(let i=0;i<6;i++)pumpkin(g,rnd(-.32,.32),rnd(-.32,.32),rnd(1,1.6));part(g,'sph',0x5a7a32,.38,.04,.38,0,.01,0);}}
else if(t=='coast'&&alt){for(let i=0;i<3;i++)part(g,'cyl',P.wd,.13,.32,.13,-.2+i*.17,.16,-.15);part(g,'box',P.wd2,.26,.22,.26,.15,.11,.2).rotation.y=.4;part(g,'box',P.wd2,.2,.18,.2,-.18,.09,.22);flags.push(flag(g,.3,0,-.3,0x141414,1));}
else if(t=='desert'){if(alt)pillar(g,0,0,1.6);else{pillar(g,-.1,-.05,1.4,true);for(let i=0;i<6;i++){const s2=rnd(.06,.14);part(g,'oct',SANDM,s2,s2*.6,s2,rnd(-.35,.35),s2*.2,rnd(-.35,.35));}}}
else if(t=='snow'&&alt){for(let i=0;i<5;i++){const h=rnd(.35,.75),m=part(g,'cone',0xbfe0f0,.09,h,.09,rnd(-.25,.25),h/2,rnd(-.25,.25),0x1a3a4a);m.rotation.set(rnd(-.3,.3),0,rnd(-.3,.3));}part(g,'sph',0xf4f6f8,.42,.07,.42,0,0,0);}
else if(t=='crystal')crys(g,0,0,1.5,alt?0xc8a0ff:0x7af0e0,alt?0x6a3ab0:0x1a8a80);
else if(t=='snow'){for(let i=0;i<3;i++){const s2=[.22,.16,.13][i],m=part(g,'oct',RKM,s2,s2*.7,s2,[.25,-.28,.2][i],s2*.3,[-.22,.1,.28][i]);m.rotation.set(rnd(0,.5),rnd(0,6),0);part(g,'sph',0xf4f6f8,s2*.8,s2*.25,s2*.8,[.25,-.28,.2][i],s2*.62,[-.22,.1,.28][i]);}
part(g,'cyl',P.st2,.16,.12,.16,0,.06,0);part(g,'cyl',P.st,.08,.42,.08,0,.3,0);part(g,'cyl',0x2a2522,.24,.12,.24,0,.56,0);part(g,'cyl',0x1a1412,.2,.02,.2,0,.62,0);fire(g,0,.6,0,1.2);glow(g,0,.8,0,1.4,0xff8a2a);}
else if(t=='pass'){if(alt)spire(g,0,0,1.15,RKM);else for(let i=0;i<3;i++){const s2=[.48,.36,.26][i],m=part(g,'oct',RKM,s2,s2*.8,s2,rnd(-.18,.18),s2*.38,rnd(-.18,.18));m.rotation.set(rnd(0,.5),rnd(0,6),0);}}
else if(t=='storm'){if(alt){part(g,'box',GRV,.36,1.1,.2,0,.5,0).rotation.set(.08,.3,-.06);part(g,'box',GRV,.22,.4,.16,.28,.18,.2).rotation.y=1;}else{for(const d of[-.24,.24])part(g,'box',GRV,.2,.8,.2,d,.38,0);part(g,'box',GRV,.72,.16,.24,0,.84,0);}}
else if(t=='void'){if(alt){part(g,'oct',OBS,.24,.5,.24,0,.75,0).rotation.y=.6;glow(g,0,.75,0,1.1,0x9a4aff);for(let i=0;i<4;i++){const s2=rnd(.06,.12);part(g,'oct',OBS,s2,s2,s2,rnd(-.3,.3),s2*.4,rnd(-.3,.3));}}else{pool(x,z,.42,VOIDM,.03);spikes(g,.15,.15,.8);glow(g,0,.2,0,1,0x9a4aff);}}
else{for(let i=0;i<3;i++){const s2=[.38,.26,.16][i],m=part(g,'oct',RKM,s2,s2*.75,s2,rnd(-.2,.2),s2*.35,rnd(-.2,.2));m.rotation.set(rnd(0,.5),rnd(0,6),0);}if(t=='snow')part(g,'sph',0xf4f6f8,.34,.1,.34,0,.3,0);}}
// level mechanics' props (logic in js/09-game.js, looks in js/07-enemies.js). Ashfall's shortcut (RUC): its ruined houses are pivots in an unbaked group RUW that ruinFx() topples,
// over a rubble lane RUB (baked, hidden until they fall). Barrow Moor: an open grave beside the road at each LV.gv cell, with a green glow (GVG) that shows while it's about to open.
// Dread Wastes: a faint warm circle round each lava pool (LAMP) marks the ground it lights; darkAnim() brightens them (LMPM) in the dark
const RUW=new THREE.Group(),RUB=new THREE.Group(),GVG=[],LMPM=new THREE.MeshBasicMaterial({color:new THREE.Color(0xff9a40).convertSRGBToLinear(),transparent:true,opacity:.05,depthWrite:false,blending:THREE.AdditiveBlending});
if(RUC.size){sc.add(RUW,RUB);for(const k of RUC){const[c,r]=k.split(',').map(Number),x=cx(c),z=cz(r);
for(let i=0;i<3;i++){const p=new THREE.Group(),h=rnd(.45,.8),w=rnd(.35,.6),a=rnd(0,6);p.position.set(x+rnd(-.2,.2),0,z+rnd(-.2,.2));p.rotation.order='YXZ';p.rotation.y=a;p.userData.fx=i%2?1:-1;
part(p,'box',[P.st2,P.st,0x8a847a][i],w,h,.12,0,h/2,0);part(p,'box',0x2a2522,w*1.01,.05,.125,0,h-.02,0);if(i==1){const b=part(p,'box',0x1c1816,.06,.06,.8,.1,h*.6,0);b.rotation.set(.3,.8,0);}RUW.add(p);}
part(RUB,'cyl',0x3a3430,.5,.01,.5,x,.005,z).castShadow=false;for(let i=0;i<12;i++){const s2=rnd(.06,.16),m=part(RUB,'oct',[P.st,P.st2,0x3a3430][i%3],s2,s2*.4,s2,x+rnd(-.42,.42),s2*.15,z+rnd(-.42,.42));m.rotation.set(rnd(0,.4),rnd(0,6),0);}}
RUW.traverse(o=>{if(o.isMesh)L1(o);});bake(RUB);RUB.visible=false;}
for(const[c,r]of LV.gv||[]){const x=cx(c),z=cz(r),h=road.has((c-1)+','+r)||road.has((c+1)+','+r),s=h?(road.has(c+','+(r+1))?-1:1):(road.has((c+1)+','+r)?-1:1),ox=h?0:s*.54,oz=h?s*.54:0;
const q=groupAt(x+ox,z+oz,0);grave(q,0,0,Math.atan2(-ox,-oz),1.25);part(q,'sph',0x2a2018,.32,.07,.2,-ox*.3,0,-oz*.3).castShadow=false;
const sl=part(ST,'box',0x1e1814,h?.34:.5,.015,h?.5:.34,x+ox*.2,.008,z+oz*.2);sl.castShadow=false;const gl=glow(sc,x,.35,z,1.3,0x7dff6a);gl.visible=false;GVG.push(gl);}
for(const[c,r]of LAMP){const m=L1(new THREE.Mesh(eg('lmp',()=>new THREE.CircleGeometry(1,40).rotateX(-PI/2)),LMPM));m.position.set(cx(c),.03,cz(r));m.scale.setScalar(MECH.dark.lr/S+.3);sc.add(m);}
// Harvest Vale: a patch of wheat on each field cell (FLDG, its own baked group – mechAnim hides it while a tower stands there). Frostpeak Hold: a brazier on each BRZ cell
// (drawn in the blocked-cell loop above) with a warm circle (WRMM, brighter in a blizzard). Saltcliff Cove: a beached rowboat beside the landing cell
const FLDG=FLD.map(([c,r])=>{const q=new THREE.Group(),x=cx(c),z=cz(r);q.position.set(x,0,z);sc.add(q);part(q,'box',0x8a6a2a,.96,.02,.96,0,.01,0).castShadow=false;
for(let i=0;i<34;i++){const a=rnd(-.42,.42),b=rnd(-.42,.42),h=rnd(.22,.34),m=part(q,'cyl',[0xd8b04a,0xc89a3a,0xe4c060][i%3],.012,h,.012,a,h/2,b);m.rotation.set(rnd(-.15,.15),0,rnd(-.15,.15));part(q,'sph',0xe8c45a,.035,.07,.035,a+m.rotation.z*-h*.5,h,b+m.rotation.x*h*.5);}
bake(q);return{c,r,g:q};});
const WRMM=new THREE.MeshBasicMaterial({color:new THREE.Color(0xe87a30).convertSRGBToLinear(),transparent:true,opacity:.06,depthWrite:false});
for(const[c,r]of BRZ){const m=L1(new THREE.Mesh(eg('lmp',()=>new THREE.CircleGeometry(1,40).rotateX(-PI/2)),WRMM));m.position.set(cx(c),.03,cz(r));m.scale.setScalar(MECH.cold.wr/S+.3);sc.add(m);}
if(LV.ld){const[c,r]=LV.ld,v=road.has(c+','+(r-1))||road.has(c+','+(r+1)),q=groupAt(cx(c)+(v?-.56:0),cz(r)+(v?0:.56),0);q.rotation.y=v?0:PI/2;
part(q,'box',P.wd,.24,.1,.6,0,.07,0);for(const d of[-.13,.13])part(q,'box',P.wd2,.03,.14,.62,d,.12,0);part(q,'cone',P.wd,.12,.16,.06,0,.09,.36).rotation.x=PI/2;
part(q,'box',P.wd2,.24,.03,.07,0,.15,-.12);part(q,'box',P.wd2,.24,.03,.07,0,.15,.12);const o=part(q,'cyl',P.wd2,.015,.6,.015,.18,.12,.05);o.rotation.set(PI/2,0,.3);}
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
for(const f of fogs)f.s.position.set(f.x+Math.sin(tt*f.v+f.ph)*.3,f.y+Math.sin(tt*f.v*1.7+f.ph)*.06,f.z+Math.cos(tt*f.v*.8+f.ph)*.2);
for(const m of mists){m.s.position.x=m.x0+Math.sin(tt*m.v)*2;m.s.material.opacity=.16+.08*Math.sin(tt*m.v*3+m.x0);}for(const r of ripples){r.t+=dt;const p=r.t/r.d;if(r.t<0){r.m.visible=false;continue;}if(p>=1){const q=r.mp();r.m.position.set(q.x,-.092,q.z);r.t=-rnd(.2,2);r.d=rnd(1.5,2.5);continue;}r.m.visible=true;r.m.scale.setScalar(.03+.2*p);r.m.material.opacity=.3*(1-p);}LAVAT.offset.x=tt*.01;LAVAT.offset.y=Math.sin(tt*.2)*.02;VOIDT.offset.x=-tt*.012;VOIDT.offset.y=Math.cos(tt*.17)*.03;
for(const b of bobs){b.g.position.y=b.y0+Math.sin(tt*.8+b.ph)*(b.a||.05);b.g.rotation.z=Math.sin(tt*.6+b.ph)*b.r;}
if(RAIN&&dt>0){const{dr,ps}=RAIN;for(let i=0;i<dr.length;i++){const q=dr[i];q.y-=q.v*dt;q.x+=dt*1.5;if(q.y<0){q.y=rnd(7,9);q.x=rnd(-HX-6,HX+6);q.z=rnd(-HZ-6,HZ+6);}ps.set([q.x,q.y,q.z,q.x-.06,q.y+.32,q.z],i*6);}RAIN.g.attributes.position.needsUpdate=true;}
// lightning: every 5–12 s a flash lights the scene and a bolt cracks down far off; the thunder follows a moment later
if(STM&&dt>0){STM.t-=dt;if(STM.t<=0){STM.t=rnd(5,12);STM.f=1;const a=STM.b.geometry.attributes.position;let x=rnd(-HX-14,HX+14),z=-ZF*rnd(HZ+10,HZ+18);for(let i=0;i<30;i++){a.setXYZ(i,x,14-i*.5,z);x+=rnd(-.5,.5);z+=rnd(-.3,.3);}a.needsUpdate=true;setTimeout(()=>snd('thunder'),rnd(300,1400));}
STM.f=Math.max(0,STM.f-dt*2.8);STM.l.intensity=STM.f*1.8*(.7+.3*Math.random());STM.b.visible=STM.f>.45;}}
// range indicator
const rng=new THREE.Group(),rd1=L1(new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshBasicMaterial({transparent:true,opacity:.22,depthWrite:false}))),rd2=L1(new THREE.Mesh(new THREE.RingGeometry(.96,1,64),new THREE.MeshBasicMaterial({transparent:true,opacity:.9,depthWrite:false})));
rd1.rotation.x=rd2.rotation.x=-PI/2;rng.add(rd1,rd2);rng.position.y=.04;rng.visible=false;sc.add(rng);
function showRng(x,z,r,col){rng.visible=true;rng.position.x=x;rng.position.z=z;rng.scale.set(r,1,r);rd1.material.color.setHex(col);rd2.material.color.setHex(col);}
function selRng(){updPads();COV.pv=null;if(g.sel){const t=g.sel;showRng(wx(t.x),wz(t.y),stat(t).r/60,0xffffff);}else rng.visible=false;covUpd();}
// road coverage overlay: one tinted square per road cell on the board (a cell counts as reached when its centre is in range).
// Placing (COV.pv, set by hover) or selecting a tower tints the cells it reaches; the coverage map (COV.on, C key) colours every
// road cell by how many attacking towers reach it, counting the tower being placed. Black-ish = nothing reaches it.
const RC=[...road,...RUC].map(k=>k.split(',').map(Number)).filter(([c,r])=>c>=0&&c<W&&r>=0&&r<H),COV={on:false,pv:null,key:''},
COVC=[0x0a0a0c,0x3f7fd0,0x3fb36a,0xe2c040,0xe57d30,0xd83c30],_cm=new THREE.Matrix4(),_cc=new THREE.Color();
const covM=L1(new THREE.InstancedMesh(new THREE.PlaneGeometry(.9,.9).rotateX(-PI/2),new THREE.MeshBasicMaterial({map:(()=>{const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');
q.fillStyle='#fff';q.beginPath();q.moveTo(16,4);q.arcTo(60,4,60,60,12);q.arcTo(60,60,4,60,12);q.arcTo(4,60,4,4,12);q.arcTo(4,4,60,4,12);q.fill();const t=new THREE.CanvasTexture(c);return t;})(),transparent:true,opacity:.6,depthWrite:false,toneMapped:false}),RC.length));
covM.position.y=.035;covM.frustumCulled=false;covM.visible=false;rng.renderOrder=2;for(let i=0;i<RC.length;i++){covM.setMatrixAt(i,_cm.makeScale(0,1,0));covM.setColorAt(i,_cc.set(0xffffff));}sc.add(covM);
// the coverage map counts attacking towers; a Barracks only tints its rally range while placed or selected
function covUpd(){const a=t=>!T[t.k].sup&&!T[t.k].inc&&!T[t.k].bar,s=g.sel,sh=g.over?null:COV.pv||(s&&(a(s)||T[s.k].bar)?{x:s.x,y:s.y,r:stat(s).r,col:0xf0b840}:null),on=COV.on&&!g.over;
const tw=on?g.tw.filter(a).map(t=>({x:t.x,y:t.y,r:stat(t).r})):[];if(on&&COV.pv)tw.push(COV.pv);
const key=on+'|'+g.ru+'|'+(sh?[sh.x,sh.y,sh.r,sh.col]:'')+'|'+tw.map(t=>t.x+','+t.y+','+t.r).join(';');if(key===COV.key)return;COV.key=key;
covM.visible=on||!!sh;if(!covM.visible)return;
RC.forEach(([c,r],i)=>{const x=c*S+S/2,y=r*S+S/2,inR=t=>Math.hypot(t.x-x,t.y-y)<=t.r,n=on?tw.filter(inR).length:0,show=road.has(c+','+r)&&(on||inR(sh));
_cm.makeScale(show?1:0,1,show?1:0).setPosition(cx(c),0,cz(r));covM.setMatrixAt(i,_cm);covM.setColorAt(i,_cc.setHex(on?COVC[Math.min(n,5)]:sh.col));});
covM.instanceMatrix.needsUpdate=true;covM.instanceColor.needsUpdate=true;}
// gate damage: the stage follows the lives left (above 75% none, then cracks, the splintered gate, fires); called from ui(), so a repair heals it too.
// Getting worse throws dust and splinters (not when a saved run loads already damaged); gateAnim() (from sync()) flickers the fires and lifts the smoke.
function gateDmg(){const f=g.lives/maxL(),st=f>.75?0:f>.5?1:f>.25?2:3;if(st===GDS&&GDI)return;
if(GDI&&st>GDS){const q=CW(7.85,2.5),x=q.x*S+W*S/2,y=q.z*S+H*S/2;burst(x,y,0x8a8070,16,1.6,.6);if(st>=2)burst(x,y,P.wd,12,1.6,.5);fx(x,y,0xc8b48a,.2,1.6,.6,.1,true);snd('h_cannon');shake(.3);}
GDS=st;GDI=true;GD1.visible=st>=1;GOKG.visible=st<2;GD2.visible=st>=2;GD3.visible=st>=3;}
function gateAnim(dt){if(GDS<3)return;GFL.forEach((f,i)=>{const b=f.userData.b;f.scale.set(b.x,b.y*(1+.35*Math.sin(tt*15+i*2)),b.z);});
for(const o of GSM){const p=(tt*.22+o.ph)%1;o.m.position.set(7.95-p*.5+Math.sin(p*6+o.ph*9)*.08,1.8+p*1.7,o.z);o.m.scale.setScalar(.08+p*.3);o.m.material.opacity=.45*(1-p)*Math.min(1,p*5);}}
