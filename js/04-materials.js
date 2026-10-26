// ---------- geometry & materials ----------
const GF={sph:()=>new THREE.SphereGeometry(1,24,16),box:()=>new THREE.BoxGeometry(1,1,1),cyl:()=>new THREE.CylinderGeometry(1,1,1,28),tap:()=>new THREE.CylinderGeometry(.78,1,1,28),cone:()=>new THREE.ConeGeometry(1,1,28),oct:()=>new THREE.OctahedronGeometry(1),tor:()=>new THREE.TorusGeometry(1,.14,10,32),arc:()=>new THREE.TorusGeometry(1,.1,8,16,PI),pyr:()=>{const g=new THREE.ConeGeometry(1,1,4);g.rotateY(PI/4);return g;}},GC={},GU={},MC={};
const geo=k=>GC[k]||(GC[k]=GF[k]());
function geoS(k,sx,sy,sz){const key=k+Math.round(sx*50)+','+Math.round(sy*50)+','+Math.round(sz*50);if(GU[key])return GU[key];const g=GF[k](),uv=g.attributes.uv,nm=g.attributes.normal;
for(let i=0;i<uv.count;i++){let u=uv.getX(i),v=uv.getY(i);const nx=Math.abs(nm.getX(i)),ny=Math.abs(nm.getY(i));
if(k=='box'){if(nx>.5){u*=sz;v*=sy;}else if(ny>.5){u*=sx;v*=sz;}else{u*=sx;v*=sy;}}
else if(k=='cyl'||k=='tap'||k=='cone'){if(ny>.9){const r=2*Math.max(sx,sz);u*=r;v*=r;}else{u*=PI*(sx+sz);v*=sy;}}
else if(k=='sph'){u*=PI*(sx+sz);v*=PI*sy;}else{u*=sx+sz;v*=sy*2;}
uv.setXY(i,u,v);}
return GU[key]=g;}
const STONE=new Set([P.st,P.st2,P.st3,0xcdbdf5,0xaebdd6,0x8fd8b8,0xf2d9a0,0xfff1d6,0xe9dfc4]),WOOD=new Set([P.wd,P.wd2,0x5a3a1e,0x6b4a2b,0x7a4a26,0x45301d]),
METAL=new Set([0x4a5568,0x2a2a35,0x5a5a68,0x9aa3b0,0x8fa6c8,0x6f7f96,0x4b586e,0x2b3342,0xdfe6ee,0xdde5f0,0xaeb4bd,0xb87333,P.gd,0x7d8590,0x4a4a5a,0xcfd4da,0xe8f0ff,0x777b83,0x5d7094,0x3d4a63]);
const tint=c=>new THREE.Color(c).lerp(new THREE.Color(0xffffff),.45).convertSRGBToLinear();
function mat(c,em){const k=c+'_'+em;if(MC[k])return MC[k];const o={color:new THREE.Color(c).convertSRGBToLinear(),envMapIntensity:.7};
if(em){o.emissive=new THREE.Color(em).convertSRGBToLinear();o.emissiveIntensity=1.4;}
if(STONE.has(c)){o.color=tint(c);o.map=TX.stone.a;o.normalMap=TX.stone.n;o.roughnessMap=TX.stone.r;o.roughness=.92;}
else if(WOOD.has(c)){o.color=tint(c);o.map=TX.wood.a;o.normalMap=TX.wood.n;o.roughnessMap=TX.wood.r;o.roughness=.85;}
else if(METAL.has(c)){o.color=tint(c);o.map=TX.plate.a;o.normalMap=TX.plate.n;o.roughness=.36;o.metalness=.9;}
else if(SKIN.has(c)){o.color=tint2(c);o.map=TX.skin.a;o.normalMap=TX.skin.n;o.roughness=.6;}
else if(LEATH.has(c)){o.color=tint2(c);o.map=TX.leather.a;o.normalMap=TX.leather.n;o.roughness=.66;}
else if(CLOTH.has(c)){o.color=tint2(c);o.map=TX.cloth.a;o.normalMap=TX.cloth.n;o.roughness=.9;}
else if(FURS.has(c)){o.color=tint2(c);o.map=TX.fur.a;o.normalMap=TX.fur.n;o.roughness=.95;}
else if(SCAL.has(c)){o.color=tint2(c);o.map=TX.scale.a;o.normalMap=TX.scale.n;o.roughness=.45;o.metalness=.15;}
else if(MEMB.has(c)){o.color=tint2(c);o.map=TX.leather.a;o.normalMap=TX.leather.n;o.roughness=.55;}
else{o.roughness=.78;o.normalMap=TX.grain.n;o.normalScale=new THREE.Vector2(.45,.45);}
return MC[k]=new THREE.MeshStandardMaterial(o);}
function part(g,k,c,sx,sy,sz,x,y,z,em){const m=new THREE.Mesh(geoS(k,sx,sy,sz),typeof c=='number'?mat(c,em):c);m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;}
const L1=o=>{o.layers.set(1);return o;};
function bake(root){root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(),by=new Map(),rm=[];
(function w(o){if(o!==root&&o.userData.keep)return;
if(o.isMesh&&!o.userData.keep&&o.layers.mask===1&&o.geometry.attributes.uv){const m=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(m);let a=by.get(o.material);if(!a){a=[];by.set(o.material,a);}a.push(g);rm.push(o);}
o.children.forEach(w);})(root);
rm.forEach(o=>o.parent.remove(o));
by.forEach((gs,mt)=>{let n=0;for(const g of gs)n+=g.attributes.position.count;const A=new Float32Array(n*3),B=new Float32Array(n*3),U=new Float32Array(n*2);let i=0;
for(const g of gs){A.set(g.attributes.position.array,i*3);B.set(g.attributes.normal.array,i*3);U.set(g.attributes.uv.array,i*2);i+=g.attributes.position.count;}
const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(A,3));bg.setAttribute('normal',new THREE.BufferAttribute(B,3));bg.setAttribute('uv',new THREE.BufferAttribute(U,2));
const m=new THREE.Mesh(bg,mt);m.castShadow=m.receiveShadow=true;root.add(m);});}
const GT=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const GM={};
function glow(g,x,y,z,s,col){const m=GM[col]||(GM[col]=new THREE.SpriteMaterial({map:GT,color:new THREE.Color(col).convertSRGBToLinear(),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false})),sp=new THREE.Sprite(m);
sp.position.set(x,y,z);sp.scale.set(s,s,1);sp.layers.set(1);sp.userData.keep=true;sp.userData.b=sp.scale.clone();g.add(sp);return sp;}
const BLM=new THREE.MeshBasicMaterial({map:GT,color:0x000000,transparent:true,opacity:.55,depthWrite:false,fog:false}),BLG=new THREE.PlaneGeometry(1,1);BLG.rotateX(-PI/2);
function blob(g,r){const m=new THREE.Mesh(BLG,BLM);m.scale.set(r*2,1,r*2);m.position.y=.025;m.userData.keep=true;L1(m);g.add(m);return m;}
// ---------- shape helpers for enemies, towers and their crews: smooth shapes, built once and cached in EGC ----------
// capG: a capsule hanging from its pivot down -y (bottom radius r1, top radius r2); lathG: [radius,y] profile from the bottom up, optionally open (phi start/length);
// rboxG: centred rounded box; shpG: a flat shape [[x,y]...] extruded along z; memG: a flat shape for wing membranes (double-sided material); domG: top part of a sphere
// ESG: default round segments (fewer on phones)
const ESG=LOWQ?7:10,EGC={},eg=(k,f)=>EGC[k]||(EGC[k]=f()),ek=a=>a.map(v=>typeof v=='number'?Math.round(v*1000):v).join(','),YUP=new THREE.Vector3(0,1,0);
function capG(r1,r2,len,n){return eg('c'+ek([r1,r2,len,n||ESG]),()=>{const p=[];for(let i=0;i<=4;i++){const a=-PI/2+i/4*PI/2;p.push(new THREE.Vector2(Math.max(1e-4,Math.cos(a)*r1),-len+Math.sin(a)*r1));}
for(let i=0;i<=4;i++){const a=i/4*PI/2;p.push(new THREE.Vector2(Math.max(1e-4,Math.cos(a)*r2),Math.sin(a)*r2));}return new THREE.LatheGeometry(p,n||ESG);});}
function lathG(pr,n,ps,pl){return eg('l'+ek(pr.flat())+'|'+ek([n||16,ps||0,pl||0]),()=>new THREE.LatheGeometry(pr.map(q=>new THREE.Vector2(Math.max(1e-4,q[0]),q[1])),n||16,ps||0,pl||2*PI));}
function rboxG(w,h,d,r){return eg('r'+ek([w,h,d,r]),()=>{r=Math.min(r,w*.45,h*.45,d*.45);const a=w/2-r,b=h/2-r,q=Math.min(a,b)*.6,s=new THREE.Shape();
s.moveTo(-a+q,-b);s.lineTo(a-q,-b);s.absarc(a-q,-b+q,q,-PI/2,0);s.lineTo(a,b-q);s.absarc(a-q,b-q,q,0,PI/2);s.lineTo(-a+q,b);s.absarc(-a+q,b-q,q,PI/2,PI);s.lineTo(-a,-b+q);s.absarc(-a+q,-b+q,q,PI,1.5*PI);
const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(1e-3,d-2*r),bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:1,curveSegments:1});g.translate(0,0,-Math.max(1e-3,d-2*r)/2);return g;});}
function shpG(k,pts,d,bv){return eg('s'+k,()=>{const g=new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(p=>new THREE.Vector2(p[0],p[1]))),{depth:d,bevelEnabled:!!bv,bevelSize:bv||0,bevelThickness:bv||0,bevelSegments:1});g.translate(0,0,-d/2);return g;});}
function memG(k,pts){return eg('m'+k,()=>new THREE.ShapeGeometry(new THREE.Shape(pts.map(p=>new THREE.Vector2(p[0],p[1])))));}
const domG=(r,f,n)=>eg('d'+ek([r,f,n||14]),()=>new THREE.SphereGeometry(r,n||14,8,0,2*PI,0,PI*f));
const MDS={},matDS=c=>MDS[c]||(MDS[c]=(()=>{const m=mat(c).clone();m.side=THREE.DoubleSide;return m;})());
const SPL=new THREE.SphereGeometry(1,LOWQ?8:12,LOWQ?6:8),CNL=new THREE.ConeGeometry(1,1,8),CYL=new THREE.CylinderGeometry(1,1,1,10),TORL=new THREE.TorusGeometry(1,.14,6,18);
function eM(p,gm,c,x,y,z,rx,ry,rz,e){const m=new THREE.Mesh(gm,typeof c=='number'?mat(c,e):c);m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=true;p.add(m);return m;}
// tiny spheres (eyes, studs, pebbles) get a low-poly sphere
const SPT=new THREE.SphereGeometry(1,7,5);
function eSp(p,c,sx,sy,sz,x,y,z,e){const m=eM(p,Math.max(sx,sy,sz)<.03?SPT:SPL,c,x,y,z,0,0,0,e);m.scale.set(sx,sy,sz);return m;}
function eTor(p,c,sx,sy,sz,x,y,z){const m=eM(p,TORL,c,x,y,z);m.scale.set(sx,sy,sz);return m;}
function eCy(p,c,r,h,x,y,z,rx,ry,rz){const m=eM(p,CYL,c,x,y,z,rx,ry,rz);m.scale.set(r,h,r);return m;}
// a cone (spike, tooth, claw, tuft) whose tip points along (dx,dy,dz)
function eCnD(p,c,r,h,x,y,z,dx,dy,dz){const m=eM(p,CNL,c,x,y,z);m.scale.set(r,h,r);m.quaternion.setFromUnitVectors(YUP,new THREE.Vector3(dx,dy,dz).normalize());return m;}
// a capsule from its pivot along (dx,dy,dz)
function eBone(p,c,r1,r2,len,x,y,z,dx,dy,dz,n){const m=eM(p,capG(r1,r2,len,n||8),c,x,y,z);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),new THREE.Vector3(dx,dy,dz).normalize());return m;}
// a curved horn of n tapering segments: starts pointing down -y turned by (rx,rz), and each segment turns a further (bx,bz)
function horn(p,c,x,y,z,r,len,n,rx,rz,bx,bz){let q=new THREE.Group();q.position.set(x,y,z);q.rotation.set(rx,0,rz);p.add(q);
for(let i=0;i<n;i++){eM(q,capG(r*(1-(i+1)/n)+.003,r*(1-i/n)+.003,len/n,8),c,0,0,0);const nq=new THREE.Group();nq.position.y=-len/n;nq.rotation.set(bx,0,bz);q.add(nq);q=nq;}}
// two-part limb (pivots a+n and b+n, as the animation expects) made of tapered capsules; end() adds hands, feet and armour
function limb(par,a,b,n,x,y,z,l1,l2,r1,r2,c,c2,end){const u=piv(par,a+n,x,y,z);eM(u,capG(r1*.88,r1,l1),c,0,0,0);const k=piv(u,b+n,0,-l1,0);eM(k,capG(r2*.82,r2,l2),c2,0,0,0);if(end)end(k,l2,r2,u,l1);return u;}
function hand(k,l,c,r){eSp(k,c,r*1.25,r*1.05,r*1.15,0,-l-r*.5,0);for(let i=0;i<3;i++)eBone(k,c,r*.3,r*.36,r*.8,(i-1)*r*.55,-l-r*1.1,r*.3,0,-1,.6);eBone(k,c,r*.3,r*.36,r*.65,r*.85,-l-r*.55,r*.35,.4,-.4,.8);}
function piv(par,name,x,y,z){const p=new THREE.Group();p.position.set(x,y,z);p.name=name;p.userData.keep=true;par.add(p);return p;}
// like bake(), but merges every part that shares a texture set and surface into one mesh, its colour moved into vertex colours:
// an enemy is ~12 animated pivots × a handful of materials, and with an army of 20 outside the wall the per-colour meshes cost ~900 draw calls
const BKM={};
function bakeE(root){root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(),by=new Map(),rm=[];
(function w(o){if(o!==root&&o.userData.keep)return;
if(o.isMesh&&!o.userData.keep&&o.layers.mask===1&&o.geometry.attributes.uv){const mt=o.material,key=[mt.map&&mt.map.uuid,mt.normalMap&&mt.normalMap.uuid,mt.roughness,mt.metalness,mt.emissive.getHex(),mt.emissiveIntensity,mt.side].join('|'),
m=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(m);let a=by.get(key);if(!a){a={mt,gs:[]};by.set(key,a);}a.gs.push([g,mt.color]);rm.push(o);}
o.children.forEach(w);})(root);
rm.forEach(o=>o.parent.remove(o));
by.forEach(({mt,gs},key)=>{let n=0;for(const[q]of gs)n+=q.attributes.position.count;const A=new Float32Array(n*3),B=new Float32Array(n*3),U=new Float32Array(n*2),K=new Float32Array(n*3);let i=0;
for(const[q,c]of gs){const k=q.attributes.position.count;A.set(q.attributes.position.array,i*3);B.set(q.attributes.normal.array,i*3);U.set(q.attributes.uv.array,i*2);for(let j=i;j<i+k;j++){K[j*3]=c.r;K[j*3+1]=c.g;K[j*3+2]=c.b;}i+=k;}
const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(A,3));bg.setAttribute('normal',new THREE.BufferAttribute(B,3));bg.setAttribute('uv',new THREE.BufferAttribute(U,2));bg.setAttribute('color',new THREE.BufferAttribute(K,3));
const cm=BKM[key]||(BKM[key]=(()=>{const q=mt.clone();q.color.setRGB(1,1,1);q.vertexColors=true;return q;})()),m=new THREE.Mesh(bg,cm);m.castShadow=m.receiveShadow=true;root.add(m);});}
