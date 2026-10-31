// ---------- input ----------
const ray=new THREE.Raycaster(),pl=new THREE.Plane(new THREE.Vector3(0,1,0),0),pt=new THREE.Vector3(),nd=new THREE.Vector2();
function cellAt(ev){const r=C.getBoundingClientRect();nd.set((ev.clientX-r.left)/r.width*2-1,-((ev.clientY-r.top)/r.height)*2+1);ray.setFromCamera(nd,cam);
if(!ray.ray.intersectPlane(pl,pt))return null;return{c:Math.floor(pt.x+W/2),r:Math.floor(pt.z+H/2)};}
const free=(c,r)=>c>=0&&c<W&&r>=0&&r<H&&!road.has(c+','+r)&&!blk.has(c+','+r)&&!g.tw.some(t=>t.c==c&&t.r==r)&&!burnAt(c,r);
// put a tower on the board (also used to restore a saved run)
// br = level-3 upgrade branch (BRN), or null
function addTw(k,c,r,l,inv,br){const t={k,c,r,x:c*S+S/2,y:r*S+S/2,l,cd:0,inv,br:br==null?null:br};if(T[k].bar)barInit(t);buildTower(t);g.tw.push(t);return t;}
// game point under the pointer (after cellAt() has set pt)
const ptX=()=>pt.x*S+W*S/2,ptY=()=>pt.z*S+H*S/2;
function tap(ev){if(g.over)return;const k=cellAt(ev);if(!k)return;
// a spell waiting for its spot (g.aim): this click casts it there
if(g.aim!=null){if(heroCast(g.aim,ptX(),ptY())){g.aim=null;selRng();}else snd('click');ui();return;}const ex=g.tw.find(t=>t.c==k.c&&t.r==k.r);
if(ex){g.sel=g.sel===ex?null:ex;selRng();ui();return;}
// a Barracks is selected and a road cell in its range is clicked: move its rally point there
const bs=g.sel;if(bs&&bs.sol&&road.has(k.c+','+k.r)){const x=k.c*S+S/2,y=k.r*S+S/2;if(Math.hypot(x-bs.x,y-bs.y)<=stat(bs).r){setRally(bs,x,y);snd('click');burst(x,y,0xffe6a0,6,.8,.1);selRng();ui();return;}}
// any other click on the road sends the hero there
if(onB(k.c,k.r)&&heroGo(k.c*S+S/2,k.r*S+S/2)){g.sel=null;heroMark(k.c*S+S/2,k.r*S+S/2);snd('click');selRng();ui();return;}
// while a wave runs no towers can be built (upgrades still can)
g.sel=null;if(g.run){if(free(k.c,k.r)){offMsg=performance.now()+2500;offT=['Wave in progress','⚔️ Towers can only be built between waves – command your hero instead. You can still upgrade towers.'];}}
else if(burnAt(k.c,k.r)){offMsg=performance.now()+2500;offT=['Burning ground','🔥 This ground is on fire – nothing can be built here until it burns out.'];snd('click');}
else if(free(k.c,k.r)&&g.gold>=T[g.build].c&&(!T[g.build].bar||nearRoad(k.c,k.r))){g.gold-=T[g.build].c;const t=addTw(g.build,k.c,k.r,1,T[g.build].c);if(!g.run)t.bw=g.wave;snd('build');towerAnimStart(t,'build');}
selRng();ui();}
// f = show the placing preview for a touch too (a long-press on an empty cell, lpBoard())
function hover(ev,f){if(ev.pointerType!='mouse'&&!f)return;
// aiming a spell: its ring follows the pointer (red where it can't go)
if(g.aim!=null){const k=cellAt(ev),a=HAB[g.aim];if(!k){rng.visible=false;return;}if(a.road){const ok=onB(k.c,k.r);showRng(cx(k.c),cz(k.r),.5,ok?0xffd24a:RBAD);}
else{const ok=k.c>=0&&k.c<W&&k.r>=0&&k.r<H;showRng(pt.x,pt.z,a.r/60,ok?0xffd24a:RBAD);}return;}
if(g.sel)return;if(g.run){if(rng.visible||COV.pv){rng.visible=false;COV.pv=null;covUpd();}return;}const k=cellAt(ev);
const tp=T[g.build],ok=k&&(!tp.bar||nearRoad(k.c,k.r)),col=g.gold>=tp.c&&ok?0xffffff:RBAD;
// a Barracks must go next to the road: elsewhere its ring shows red
if(k&&free(k.c,k.r)){const r=tp.r*fogM(k.c,k.r);showRng(cx(k.c),cz(k.r),r/60,col);COV.pv=tp.sup||tp.inc?null:{x:k.c*S+S/2,y:k.r*S+S/2,r,col:g.gold>=tp.c&&ok?0xf0b840:OPT.cb?0xcc79a7:0xe04030};}else{rng.visible=false;COV.pv=null;}covUpd();}
C.addEventListener('pointerleave',()=>{if(COV.pv)selRng();});
function zoom(f){cine=null;dist=clamp(dist*f,5,Math.max(26,CAM0.dist*1.3));setCam();}
function pan(dx,dy){cine=null;const k=dist*.0022,s=Math.sin(az),c=Math.cos(az);tx=clamp(tx-(c*dx+s*dy)*k,CAM0.bb.x0-3,CAM0.bb.x1-1);tz=clamp(tz+(s*dx-c*dy)*k,CAM0.bb.z0-2,CAM0.bb.z1+2);setCam();}
const ptrs=new Map();let dn=null,drag=false,pin=null;
// touch long-press on the board (LPMS, js/10-ui.js): on a tower it selects it and opens its info sheet; on an empty cell between waves
// it previews the chosen tower's range there and shows its info instead of building; the release then does nothing
let lpT=0;function lpBoard(){lpT=0;if(!dn||drag||g.over||g.aim!=null)return;const p={clientX:dn.x,clientY:dn.y},k=cellAt(p);if(!k)return;const t=g.tw.find(o=>o.c==k.c&&o.r==k.r);
if(t){dn=null;g.sel=t;selRng();lpOpen({t});}else if(!g.run&&free(k.c,k.r)){dn=null;g.sel=null;selRng();hover(p,true);lpOpen({k:g.build,pv:1});}}
C.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.12:.89);},{passive:false});
// right-click anywhere (or the ✕ button on touch) clears everything picked at once: the selected tower and a spell being aimed; on the board it waits for pointerup so a right-drag pan keeps it
const selAny=()=>g.aim!=null||!!g.sel;
function unsel(){if(!selAny())return;g.aim=null;g.sel=null;if(LP.on)lpClose();selRng();ui();}
document.addEventListener('contextmenu',e=>{if(MENU.open)return;e.preventDefault();if(e.pointerType&&e.pointerType!='mouse')return;if(!C.contains(e.target))unsel();});
C.addEventListener('pointerdown',e=>{cine=null;C.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
clearTimeout(lpT);if(ptrs.size==1){dn={x:e.clientX,y:e.clientY,az,pol,btn:e.button,sh:e.shiftKey};drag=false;if(e.pointerType!='mouse')lpT=setTimeout(lpBoard,LPMS);}
else{drag=true;dn=null;const[a,b]=[...ptrs.values()];pin={d:Math.hypot(a.x-b.x,a.y-b.y)||1,mx:(a.x+b.x)/2,my:(a.y+b.y)/2};}});
C.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p){hover(e);return;}
const ox=p.x,oy=p.y;p.x=e.clientX;p.y=e.clientY;
if(ptrs.size>=2&&pin){const[a,b]=[...ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y)||1,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;zoom(pin.d/d);pan(mx-pin.mx,my-pin.my);pin={d,mx,my};return;}
if(!dn)return;const dx=e.clientX-dn.x,dy=e.clientY-dn.y;
if(drag||Math.hypot(dx,dy)>8){drag=true;clearTimeout(lpT);if(!OPT.rot||dn.btn==2||dn.sh)pan(e.clientX-ox,e.clientY-oy);else{az=dn.az-dx*.006;pol=clamp(dn.pol-dy*.006,.3,1.25);setCam();}}});
const up=e=>{clearTimeout(lpT);const had=ptrs.has(e.pointerId);ptrs.delete(e.pointerId);if(ptrs.size<2)pin=null;if(dn&&had&&!drag&&e.type=='pointerup'){if(dn.btn===0)tap(e);else if(dn.btn===2)unsel();}if(!ptrs.size)dn=null;};
C.addEventListener('pointerup',up);C.addEventListener('pointercancel',up);
$('zi').onclick=()=>zoom(.8);$('zo').onclick=()=>zoom(1.25);$('zr').onclick=()=>{({az,pol,dist,tx,tz}=CAM0);setCam();};
// Free cam (OPT.rot, saved with the gameplay settings, on by default): on = drag rotates and tilts, right-drag/Shift-drag moves, Q/E turn;
// off = the rotation is locked: dragging only moves the camera and it keeps the default angle. Switching it off swings the view back to the default angle where it is
function fcamSet(on){OPT.rot=on;try{localStorage.setItem('sfopt',JSON.stringify(OPT));}catch(e){}if(!on){cine=null;az=CAM0.az;pol=CAM0.pol;setCam();}$('fc').classList.toggle('on',on);$('fc').title=on?'Free cam on: drag rotates the camera – click to lock the rotation':'Free cam off: the rotation is locked and dragging moves the camera – click to rotate again';}
$('fc').onclick=()=>fcamSet(!OPT.rot);$('clr').onclick=unsel;
