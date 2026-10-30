// ---------- effects ----------
const fxs=[],pts=[],txts=[],BMC={},TC={},RG=new THREE.RingGeometry(.8,1,32);const bm=c=>BMC[c]||(BMC[c]=new THREE.MeshBasicMaterial({color:new THREE.Color(c).convertSRGBToLinear()}));
function fx(x,y,col,s0,s1,dur,yy,ring){const m=L1(new THREE.Mesh(ring?RG:geo('sph'),new THREE.MeshBasicMaterial({color:new THREE.Color(col).convertSRGBToLinear(),transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false})));if(ring)m.rotation.x=-PI/2;m.position.set(wx(x),yy,wz(y));sc.add(m);fxs.push({m,t:0,d:dur,s0,s1});}
function burst(x,y,col,n,sp,yy){for(let i=0;i<n;i++){const m=L1(new THREE.Mesh(geo('sph'),bm(col))),a=rnd(0,2*PI);m.position.set(wx(x),yy,wz(y));sc.add(m);pts.push({m,vx:Math.cos(a)*rnd(.3,1)*sp,vz:Math.sin(a)*rnd(.3,1)*sp,vy:rnd(1.5,3)*sp,t:0,d:rnd(.4,.7),s:rnd(.04,.09)});}}
function popText(x,y,txt,col){const k=txt+col;let t=TC[k];if(!t){const c=document.createElement('canvas');c.width=128;c.height=64;const q=c.getContext('2d');q.font='bold 38px Cinzel,Georgia,serif';q.textAlign='center';q.textBaseline='middle';q.lineWidth=8;q.strokeStyle='#2a1a3a';q.lineJoin='round';q.strokeText(txt,64,34);q.fillStyle=col;q.fillText(txt,64,34);t=TC[k]=new THREE.CanvasTexture(c);}
const s=L1(new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,fog:false})));s.scale.set(.7,.35,1);s.position.set(wx(x),.9,wz(y));sc.add(s);txts.push({s,t:0});}
// ---------- juice: camera shake, hit-stop, coins flying to the gold pill ----------
// shake(a): trauma 0..1 (offset grows with a², fades in real time); not additive, so a row of catapults doesn't stack into an earthquake. Off with OPT.shake.
// hitStop(s): freezes the game for s real seconds (the loop in js/16-main.js skips update() and slows sync()); only visual timing, the game logic is untouched.
const JU={sh:0,hs:0,hc:0,co:0},JV=new THREE.Vector3(),JO=new THREE.Vector3();
function shake(a){if(OPT.shake===false)return;JU.sh=Math.max(JU.sh,Math.min(1,a));}
function hitStop(s){if(JU.hc>0&&s<.2)return;JU.hs=Math.max(JU.hs,s);JU.hc=s+.6;}
function juice(dt){JU.hc-=dt;if(JU.hs>0)JU.hs-=dt;JO.set(0,0,0);if(JU.sh<=0)return;const k=JU.sh*JU.sh*dist*.018,t=performance.now()/1000;
JO.set(Math.sin(t*61)+Math.sin(t*37)*.5,Math.sin(t*53+1)*.6,Math.sin(t*47+2)+Math.sin(t*29)*.5).multiplyScalar(k);JU.sh-=dt*1.4;}
function coins(e,n){const cv=R.domElement.getBoundingClientRect(),gp=$('gold').parentNode.querySelector('svg').getBoundingClientRect();if(!gp.width||!cv.width)return;
JV.set(e.m.position.x,.6,e.m.position.z).project(cam);if(Math.abs(JV.x)>1.1||Math.abs(JV.y)>1.1)return;
const x0=cv.left+(JV.x+1)/2*cv.width,y0=cv.top+(1-JV.y)/2*cv.height,x1=gp.left+gp.width/2,y1=gp.top+gp.height/2;
for(let i=0;i<n&&JU.co<30;i++){const c=document.createElement('div');c.className='coin';c.innerHTML='<svg><use href="#i-coin"/></svg>';document.body.appendChild(c);JU.co++;
const a=rnd(0,2*PI),r=rnd(14,34)+n*3,mx=x0+Math.cos(a)*r,my=y0+Math.sin(a)*r*.6-rnd(20,40),d=rnd(560,760)+i*35;
const an=c.animate([{transform:`translate(${x0}px,${y0}px) scale(.5)`,opacity:0},{transform:`translate(${mx}px,${my}px) scale(1.1)`,opacity:1,offset:.28},{transform:`translate(${x1}px,${y1}px) scale(.7)`,opacity:1}],{duration:d,easing:'cubic-bezier(.45,0,.75,.4)',fill:'forwards'});
// a hidden tab never fires onfinish, hence the timer as well
const done=()=>{if(!c.parentNode)return;c.remove();JU.co--;snd('clink');const p=$('gold').parentNode;p.classList.remove('gp');void p.offsetWidth;p.classList.add('gp');};an.onfinish=done;setTimeout(done,d+300);}}
