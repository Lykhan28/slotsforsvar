// ---------- procedural PBR textures ----------
function mkNoise(seed){const h=(i,j,px,py)=>{i=((i%px)+px)%px;j=((j%py)+py)%py;let n=(Math.imul(i,374761393)+Math.imul(j,668265263)+Math.imul(seed,1442695041))|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;};
return(x,y,px,py)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return h(xi,yi,px,py)*(1-u)*(1-v)+h(xi+1,yi,px,py)*u*(1-v)+h(xi,yi+1,px,py)*(1-u)*v+h(xi+1,yi+1,px,py)*u*v;};}
const NZ=mkNoise(11);
function fbm(x,y,px,py,o){let a=0,w=.5,f=1;for(let i=0;i<o;i++){a+=w*NZ(x*f,y*f,px*f,py*f);w*=.5;f*=2;}return a/(1-Math.pow(.5,o));}
const hash=(a,b)=>{let n=Math.imul(a,73856093)^Math.imul(b,19349663);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;};
function genTex(S0,fn,ns){const A=new Uint8ClampedArray(S0*S0*4),Hh=new Float32Array(S0*S0);
for(let y=0;y<S0;y++)for(let x=0;x<S0;x++){const o=fn(x,y),i=y*S0+x;A[i*4]=o[0]*255;A[i*4+1]=o[1]*255;A[i*4+2]=o[2]*255;A[i*4+3]=255;Hh[i]=o[3];}
const N=new Uint8ClampedArray(S0*S0*4);
for(let y=0;y<S0;y++)for(let x=0;x<S0;x++){const i=y*S0+x,l=Hh[y*S0+(x+S0-1)%S0],r=Hh[y*S0+(x+1)%S0],u=Hh[((y+S0-1)%S0)*S0+x],d=Hh[((y+1)%S0)*S0+x],nx=(l-r)*ns,ny=(d-u)*ns,ln=Math.hypot(nx,ny,1);N[i*4]=(nx/ln*.5+.5)*255;N[i*4+1]=(ny/ln*.5+.5)*255;N[i*4+2]=(1/ln*.5+.5)*255;N[i*4+3]=255;}
const mk=(D,srgb)=>{const c=document.createElement('canvas');c.width=c.height=S0;c.getContext('2d').putImageData(new ImageData(D,S0,S0),0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(srgb)t.encoding=THREE.sRGBEncoding;return t;};
return{a:mk(A,true),n:mk(N,false)};}
const TX={
stone:genTex(256,(x,y)=>{const row=Math.floor(y/32),off=(row%2)*32,xx=(x+off)%256,bid=Math.floor(xx/64),lx=xx%64,ly=y%32,d=Math.min(lx,63-lx,ly,31-ly),hh=hash(row,bid),n1=fbm(x/256*6,y/256*6,6,6,4),n2=fbm(x/256*24,y/256*24,24,24,2),bev=Math.min(1,d/4.5),l=(.5+.32*(hh-.5)+.22*(n1-.5))*(.72+.28*bev)*(d<1.5?.55:1)*(.93+.14*n2);return[l*1.04,l,l*.93,d<1.5?0:bev*(.75+.25*n2)];},3),
wood:genTex(256,(x,y)=>{const pid=Math.floor(x/64),lx=x%64,hh=hash(pid,7),w=fbm(x/256*3,y/256,3,1,3),gr=fbm(x/256*48+w*4,y/256*3,48,3,3),d=Math.min(lx,63-lx),gap=d<2,l=(.42+.14*hh)*(.8+.4*gr)*(gap?.35:1);return[l*1.15,l*.78,l*.5,gap?0:.55+.45*gr];},2),
grass:genTex(256,(x,y)=>{const n1=fbm(x/256*8,y/256*8,8,8,4),n2=fbm(x/256*64,y/256*64,64,64,2),l=.5+.7*(n1-.5);return[(.24+.3*l)*(.9+.2*n2),(.37+.32*l)*(.85+.3*n2),.13+.1*l,n2*.7+n1*.3];},2.5),
road:genTex(256,(x,y)=>{const G=8,cs=32,cx=Math.floor(x/cs),cy=Math.floor(y/cs);let f1=1e9,f2=1e9,id=0;
for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const ci=cx+i,cj=cy+j,wi=((ci%G)+G)%G,wj=((cj%G)+G)%G,px=(ci+.5+(hash(wi,wj)-.5)*.7)*cs,py=(cj+.5+(hash(wj,wi+9)-.5)*.7)*cs,d=Math.hypot(x-px,y-py);if(d<f1){f2=f1;f1=d;id=hash(wi*7,wj*13);}else if(d<f2)f2=d;}
const e=(f2-f1)/cs,st=Math.min(1,e*7),n=fbm(x/256*16,y/256*16,16,16,3),l=(.46+.4*(id-.5)+.15*(n-.5))*(.55+.45*st);return[l*1.02,l*.97,l*.88,st*(.7+.3*n)];},3.5),
roof:genTex(256,(x,y)=>{const row=Math.floor(y/16),off=(row%2)*16,xx=(x+off)%256,lx=xx%32,ly=y%16,hh=hash(row,Math.floor(xx/32)),sh=.55+.45*(ly/16),e=Math.min(lx,31-lx),l=(.62+.3*hh)*sh*(e<1.5?.6:1)*(.9+.2*fbm(x/256*20,y/256*20,20,20,2));return[l,l,l,sh*(e<1.5?.3:1)];},3),
rock:genTex(256,(x,y)=>{const n=fbm(x/256*5,y/256*5,5,5,5),r=1-Math.abs(2*n-1),l=.35+.4*r*(.8+.4*fbm(x/256*20,y/256*20,20,20,2));return[l,l*.95,l*.9,r];},4),
grain:genTex(256,(x,y)=>[.5,.5,.5,fbm(x/256*48,y/256*48,48,48,3)],1.5)};
TX.skin=genTex(256,(x,y)=>{const n=fbm(x/256*24,y/256*24,24,24,4),p=fbm(x/256*90,y/256*90,90,90,2),l=.88+.14*(n-.5)-.1*(p>.62?(p-.62)*3:0);return[l,l*.97,l*.95,.5*n+.5*(1-p)];},1.4);
TX.leather=genTex(256,(x,y)=>{const n=fbm(x/256*14,y/256*14,14,14,4),r=1-Math.abs(2*n-1),c2=fbm(x/256*60,y/256*60,60,60,2),l=.62+.28*n-.22*(r>.88?(r-.88)*6:0)+.08*(c2-.5);return[l,l,l,r*.8+c2*.2];},2.2);
TX.cloth=genTex(256,(x,y)=>{const u=x/256*48,v=y/256*48,a=(Math.floor(u)+Math.floor(v))%2,wa=Math.sin((u%1)*PI),wb=Math.sin((v%1)*PI),h=a?wa:wb,n=fbm(x/256*10,y/256*10,10,10,3),l=.7+.2*h+.1*(n-.5);return[l,l,l,h*.8+.2*n];},1.8);
TX.fur=genTex(256,(x,y)=>{const n=fbm(x/256*100,y/256*12,100,12,3),m=fbm(x/256*8,y/256*8,8,8,3),l=.55+.45*n*(.8+.4*m);return[l,l,l,n];},2);
TX.scale=genTex(256,(x,y)=>{const row=Math.floor(y/16),off=(row%2)*8,xx=(x+off)%256,lx=xx%16,ly=y%16,hh=hash(row,Math.floor(xx/16)),e=Math.min(lx,15-lx),sh=.55+.45*(ly/16),l=(.65+.3*hh)*sh*(e<1?.55:1);return[l,l,l,sh*(e<1?.3:1)];},3.5);
TX.plate=genTex(256,(x,y)=>{const n=fbm(x/256*2,y/256*90,2,90,3),d=fbm(x/256*6,y/256*6,6,6,4),l=.6+.25*(n-.5)+.18*(d-.5);return[l,l,l*1.03,.25*n+.5*d];},1.2);
for(const k of['skin','leather','cloth','fur','scale','plate']){TX[k].a.repeat.set(5,5);TX[k].n.repeat.set(5,5);}
const SKIN=new Set([0x71903c,0x5a7a2f,0xffd9b0,0x5cb83f,0x7ed957]),LEATH=new Set([0x6b4a2b,0x45301d,0x7a4a26,0x5a3a2a,0x9a6a3a,0x7a5a2e,0xb8a070,0x7a3030]),
CLOTH=new Set([0x8e2a2a,0x8a2020,0x5a1a1a,0xb3202a,0xd9534f,0x3fae6b,0x3b86e0,0x2f7d5a,0xffb020,0x2a4f8a,0x3b5bdb,0x2a3a9a,0x4a4ad0,0xe8483c,0x4a62b8,0x2d6a4f,0x3e8f6a,0x1f3a63,0x5a1f1f,0x2d5f2b]),
FURS=new Set([0x6b6f78,0xa9aeb8,0x4a4d56]),SCAL=new Set([0x9e2f2a,0x6e1d22,0xd9b27c]),MEMB=new Set([0x7a2430,0xa23a3a]);
const tint2=c=>new THREE.Color(c).lerp(new THREE.Color(0xffffff),.25).convertSRGBToLinear();
const PBR=(t,c,o)=>new THREE.MeshStandardMaterial(Object.assign({map:t.a,normalMap:t.n,color:new THREE.Color(c).convertSRGBToLinear(),roughness:.88,metalness:0,envMapIntensity:.6},o||{}));
const M={grassA:PBR(TX.grass,0xf2fbe6,{roughness:.95}),grassB:PBR(TX.grass,0xdcebc8,{roughness:.95}),roadA:PBR(TX.road,0xffffff),roadB:PBR(TX.road,0xe6dcc8),rock:PBR(TX.rock,0xffffff)};
const RFC={};const RF=c=>RFC[c]||(RFC[c]=PBR(TX.roof,c,{roughness:.8}));
