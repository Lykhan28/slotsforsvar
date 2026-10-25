// ---------- input ----------
const ray=new THREE.Raycaster(),pl=new THREE.Plane(new THREE.Vector3(0,1,0),0),pt=new THREE.Vector3(),nd=new THREE.Vector2();
function cellAt(ev){const r=C.getBoundingClientRect();nd.set((ev.clientX-r.left)/r.width*2-1,-((ev.clientY-r.top)/r.height)*2+1);ray.setFromCamera(nd,cam);
if(!ray.ray.intersectPlane(pl,pt))return null;return{c:Math.floor(pt.x+6),r:Math.floor(pt.z+4)};}
const free=(c,r)=>c>=0&&c<W&&r>=0&&r<H&&!road.has(c+','+r)&&!g.tw.some(t=>t.c==c&&t.r==r);
function tap(ev){if(g.over)return;const k=cellAt(ev);if(!k)return;const ex=g.tw.find(t=>t.c==k.c&&t.r==k.r);
if(ex){g.sel=g.sel===ex?null:ex;selRng();ui();return;}
g.sel=null;if(free(k.c,k.r)&&g.gold>=T[g.build].c){g.gold-=T[g.build].c;const t={k:g.build,c:k.c,r:k.r,x:k.c*S+S/2,y:k.r*S+S/2,l:1,cd:0,inv:T[g.build].c};buildTower(t);g.tw.push(t);snd('build');burst(t.x,t.y,0xf7f2e6,8,1,.1);}
selRng();ui();}
function hover(ev){if(ev.pointerType!='mouse'||g.sel)return;const k=cellAt(ev);
if(k&&free(k.c,k.r))showRng(k.c-5.5,k.r-3.5,T[g.build].r/60,g.gold>=T[g.build].c?0xffffff:0xff6666);else rng.visible=false;}
function zoom(f){cine=null;dist=clamp(dist*f,5,26);setCam();}
function pan(dx,dy){cine=null;const k=dist*.0022,s=Math.sin(az),c=Math.cos(az);tx=clamp(tx-(c*dx+s*dy)*k,-9,13);tz=clamp(tz+(s*dx-c*dy)*k,-6,6);setCam();}
const ptrs=new Map();let dn=null,drag=false,pin=null;
C.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.12:.89);},{passive:false});
C.addEventListener('contextmenu',e=>e.preventDefault());
C.addEventListener('pointerdown',e=>{cine=null;C.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
if(ptrs.size==1){dn={x:e.clientX,y:e.clientY,az,pol,btn:e.button,sh:e.shiftKey};drag=false;}
else{drag=true;dn=null;const[a,b]=[...ptrs.values()];pin={d:Math.hypot(a.x-b.x,a.y-b.y)||1,mx:(a.x+b.x)/2,my:(a.y+b.y)/2};}});
C.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p){hover(e);return;}
const ox=p.x,oy=p.y;p.x=e.clientX;p.y=e.clientY;
if(ptrs.size>=2&&pin){const[a,b]=[...ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y)||1,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;zoom(pin.d/d);pan(mx-pin.mx,my-pin.my);pin={d,mx,my};return;}
if(!dn)return;const dx=e.clientX-dn.x,dy=e.clientY-dn.y;
if(drag||Math.hypot(dx,dy)>8){drag=true;if(dn.btn==2||dn.sh)pan(e.clientX-ox,e.clientY-oy);else{az=dn.az-dx*.006;pol=clamp(dn.pol-dy*.006,.3,1.25);setCam();}}});
const up=e=>{const had=ptrs.has(e.pointerId);ptrs.delete(e.pointerId);if(ptrs.size<2)pin=null;if(dn&&had&&!drag&&dn.btn===0&&e.type=='pointerup')tap(e);if(!ptrs.size)dn=null;};
C.addEventListener('pointerup',up);C.addEventListener('pointercancel',up);
$('zi').onclick=()=>zoom(.8);$('zo').onclick=()=>zoom(1.25);$('zr').onclick=()=>{az=0;pol=.85;dist=20;tx=2;tz=.3;setCam();};
