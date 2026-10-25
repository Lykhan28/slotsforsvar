// ---------- UI ----------
const DS={arrow:'Skyder ét mål pr. niveau: 1, 2 og 3 fjender på én gang.',cannon:'Slynger sten, der rammer et område og sinker fjenderne i 1 sekund.',frost:'Ikke tilgængelig endnu.',ballista:'Enorm rækkevidde. Rammer den stærkeste fjende hårdt.',storm:'Kædelyn rammer 5, 6 eller 7 fjender og lammer dem et øjeblik.',alch:'Giftflasker giver skade over tid i et område.',banner:'Giver tårne i nærheden +20 % skade.',vault:'Giver guld efter hver bølge.'};
let offMsg=0;const TK=Object.keys(T),TC2={arrow:'#5cd17a',cannon:'#d98a3c',frost:'#9a6bff',ballista:'#e8e8e8',storm:'#4fd0ff',alch:'#9cff4a',banner:'#ff5a5a',vault:'#ffd24a'};
function ui(){$('gold').textContent=g.gold;$('wave').textContent=g.wave+' / '+MAXW;$('lives').textContent=g.lives;
$('start').disabled=g.run||g.over;$('start').textContent=g.run?'Fjenden angriber':'Start bølge '+(g.wave+1);$('spd').textContent='Fart ×'+g.spd;
for(const k of TK){const b=$('b_'+k);b.classList.toggle('on',g.build===k&&!g.sel);b.classList.toggle('poor',g.gold<T[k].c);}
const s=g.sel;$('sel').style.display=s?'flex':'none';
if(s){const st=stat(s),tp=T[s.k];
$('info').innerHTML='<b>'+tp.n+' · niveau '+s.l+'</b><br><small>'+(s.k=='arrow'?'🏹 '+s.l+(s.l>1?' mål':' mål')+' · ⚔️ '+Math.round(st.d)+' skade · 🎯 '+(st.r/60).toFixed(1):s.k=='cannon'?'🐌 −'+20*s.l+'% fart i 1 sek · ⚔️ '+Math.round(st.d)+' skade · 🎯 '+(st.r/60).toFixed(1):tp.sup?'🚩 +'+Math.round((.2+.1*(s.l-1))*100)+'% skade til tårne i nærheden':tp.inc?'💰 +'+tp.inc*s.l+' guld efter hver bølge':tp.ch?'⚡ '+Math.round(st.d)+' skade · '+(T.storm.ch+s.l-1)+' mål · 🎯 '+(st.r/60).toFixed(1):s.k=='alch'?'☠️ '+Math.round(st.d)+' skade/sek · 🎯 '+(st.r/60).toFixed(1):'⚔️ '+Math.round(st.d)+' skade · 🎯 '+(st.r/60).toFixed(1)+' felter')+(s.buff>1?' · 🚩 +'+Math.round((s.buff-1)*100)+'%':'')+'</small>';
$('up').textContent=s.l>=3?'Maks niveau':'Opgradér 🪙'+upCost(s);$('up').disabled=s.l>=3||g.gold<upCost(s);$('sell').textContent='Sælg 🪙'+Math.round(s.inv*.6);}
else if(performance.now()<offMsg){$('info').innerHTML='<b>Magiker</b><br><small>🔒 Ikke tilgængelig endnu. Han bliver lavet om senere.</small>';}else{const tp=T[g.build];$('info').innerHTML='<b>'+tp.n+'</b><span class="cs">🪙 '+tp.c+'</span><br><small>'+DS[g.build]+'</small>';}
const sov=g.over&&performance.now()-(g.overT||0)>2200;$('ov').style.display=sov?'flex':'none';const oh=(g.won?'Slottet er reddet':'Slottet er faldet')+'<br><button class="wb go" id="again" style="margin-top:10px;font-size:16px;padding:8px 22px">Forsvar igen</button>';if(sov&&g.ovh!==oh){g.ovh=oh;$('ov').innerHTML='<div class="ovbox">'+oh+'</div>';}}
TK.forEach((k,i)=>{const b=document.createElement('button');b.className='tile'+(T[k].off?' off':'');b.id='b_'+k;b.title=T[k].n+(T[k].off?' – utilgængelig':' – '+DS[k]);b.innerHTML='<i class="hk">'+(i+1)+'</i><span class="ic">'+T[k].ic+'</span><b class="co">'+T[k].c+'</b>';b.onclick=()=>{if(T[k].off){offMsg=performance.now()+3000;ui();return;}g.build=k;g.sel=null;selRng();ui();};$('towers').appendChild(b);});
$('start').onclick=startWave;$('ov').onclick=e=>{if(e.target.closest&&e.target.closest('#again'))reset();};
$('spd').onclick=()=>{g.spd=g.spd==1?2:g.spd==2?3:1;ui();};
$('up').onclick=()=>{const t=g.sel;if(t&&t.l<3&&g.gold>=upCost(t)){g.gold-=upCost(t);t.inv+=upCost(t);t.l++;buildTower(t);snd('upgrade');burst(t.x,t.y,P.gd,14,1.4,.4);selRng();ui();}};
$('sell').onclick=()=>{const t=g.sel;if(!t)return;g.gold+=Math.round(t.inv*.6);sc.remove(t.m);snd('sell');burst(t.x,t.y,0xffffff,8,1,.3);g.tw=g.tw.filter(x=>x!==t);g.sel=null;selRng();ui();};
// minimap
const MM=$('mm'),mq=MM.getContext('2d');
function drawMM(){const w=MM.width,h=MM.height,X=lx=>(lx+100)/1400*w,Y=ly=>ly/600*h;mq.fillStyle='#1c2a14';mq.fillRect(0,0,w,h);mq.fillStyle='#4f7a34';mq.fillRect(X(0),Y(0),X(720)-X(0),Y(480)-Y(0));
mq.fillStyle='#c9b27a';for(const k of road){const[c,r]=k.split(',').map(Number);mq.fillRect(X(c*60),Y(r*60),X(60)-X(0)+.5,Y(60)+.5);}mq.fillRect(X(-60),Y(60),X(60)-X(0),Y(60));mq.fillRect(X(720),Y(360),X(60)-X(0),Y(60));
mq.fillStyle='#a53a3a';mq.fillRect(X(-95),Y(60),X(25)-X(0),Y(60));mq.fillStyle='#8a8272';mq.fillRect(X(780),Y(186),X(414)-X(0),Y(408));mq.fillStyle='#ffd24a';mq.fillRect(X(1020),Y(300),X(120)-X(0),Y(100));
for(const t of g.tw){mq.fillStyle=TC2[t.k];mq.fillRect(X(t.x)-3,Y(t.y)-3,6,6);}
for(const e of g.en){mq.fillStyle=e.type=='boss'?'#ff3b3b':'#ff9a3b';mq.beginPath();mq.arc(X(e.x),Y(e.y),e.type=='boss'?4:2.4,0,7);mq.fill();}
mq.strokeStyle='#fff';mq.lineWidth=1.5;mq.strokeRect(X(tx*60+360-130),Y(tz*60+240-90),X(260)-X(0),Y(180));}
function mmGo(e){const r=MM.getBoundingClientRect(),lx=(e.clientX-r.left)/r.width*1400-100,ly=(e.clientY-r.top)/r.height*600;tx=clamp((lx-360)/60,-9,13);tz=clamp((ly-240)/60,-6,6);setCam();}
MM.addEventListener('pointerdown',e=>{MM.setPointerCapture(e.pointerId);mmGo(e);});MM.addEventListener('pointermove',e=>{if(e.buttons)mmGo(e);});
addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey)return;const k=e.key;
if(k>='1'&&k<='8'&&TK[+k-1]&&!T[TK[+k-1]].off){g.build=TK[+k-1];g.sel=null;selRng();ui();}else if(k==' '){e.preventDefault();startWave();}else if(k=='Escape'){g.sel=null;selRng();ui();}
else if(k=='q'||k=='Q'){az-=.3;setCam();}else if(k=='e'||k=='E'){az+=.3;setCam();}});
