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

