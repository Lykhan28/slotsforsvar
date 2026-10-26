// ---------- UI ----------
const DS={arrow:'Fires at 1, 2 or 3 enemies at once, depending on its level.',cannon:'Hurls boulders that hit everything in an area and slow enemies for 1 second.',frost:'Teleports the enemy closest to the castle back down the road. Bosses resist.',ballista:'Huge range. Always targets the toughest enemy and hits hard.',storm:'Chain lightning strikes 5, 6 or 7 enemies and stuns them for a moment.',alch:'Lobs poison flasks that deal damage over time in an area.',banner:'Nearby towers deal +20% damage.',vault:'Earns gold at the end of every wave.'};
const ROLE={arrow:'Multi-shot',cannon:'Area · Slow',frost:'Control',ballista:'Sniper',storm:'Chain',alch:'Poison · Area',banner:'Support',vault:'Economy'};
const FOE={norm:['👺','Goblins'],fast:['🐺','Wolf riders'],tank:['🛡️','Black knights'],boss:['🐉','Dragon']};
let offMsg=0,hov=null;const TK=Object.keys(T),TC2={arrow:'#5cd17a',cannon:'#d98a3c',frost:'#9a6bff',ballista:'#e8e8e8',storm:'#4fd0ff',alch:'#9cff4a',banner:'#ff5a5a',vault:'#ffd24a'};
const COIN='<svg><use href="#i-coin"/></svg>',setH=(el,h)=>{if(el._h!==h){el._h=h;el.innerHTML=h;}};
const fmt=v=>v<10?v.toFixed(1).replace(/\.0$/,''):''+Math.round(v),tiles=r=>(r/60).toFixed(1);
// numbers shown in the inspector: dps counts every target a shot can hit (arrows per level, the whole lightning chain); poison is damage per second on each enemy in the cloud
function tstat(k,l,bf){const tp=T[k],s=stat({k,l,buff:bf||1}),o={d:s.d,r:s.r,rate:1/s.f,n:1};
if(k=='arrow'){o.n=l;o.dps=s.d*l/s.f;}else if(k=='storm'){o.n=tp.ch+l-1;let a=0,m=s.d;for(let i=0;i<o.n;i++){a+=m;m*=.92;}o.dps=a/s.f;}
else o.dps=k=='alch'?s.d:tp.sup||tp.inc?0:s.d/s.f;return o;}
const AT=TK.filter(k=>!T[k].sup&&!T[k].inc),MX={dps:Math.max(...AT.map(k=>tstat(k,3).dps)),rate:Math.max(...AT.map(k=>tstat(k,1).rate)),r:Math.max(...TK.filter(k=>!T[k].inc).map(k=>tstat(k,3).r))};
const bar=(v,n,mx)=>'<span class="sb">'+(n!=null?'<i class="nx" style="width:'+Math.min(100,n/mx*100)+'%"></i>':'')+'<i style="width:'+Math.min(100,v/mx*100)+'%"></i></span>';
const row=(lb,val,nxt,b)=>'<div class="st'+(b?'':' nob')+'"><span class="sl">'+lb+'</span>'+(b||'')+'<span class="sv">'+val+(nxt!=null?'<em>→ '+nxt+'</em>':'')+'</span></div>';
function infoHTML(k,t){const tp=T[k],l=t?t.l:1,bf=t?t.buff||1:1,a=tstat(k,l,bf),nx=t&&l<3?tstat(k,l+1,bf):null,sm=s=>' <small>'+s+'</small>';
let h='<div class="ih"><div class="iic">'+tp.ic+'</div><div class="ihn"><b>'+tp.n+'</b><span class="tag">'+ROLE[k]+'</span></div>'+
(t?'<div class="lv" title="Level '+l+' of 3">'+[1,2,3].map(i=>'<i'+(i<=l?' class="on"':'')+'></i>').join('')+'</div>':'<div class="cost'+(g.gold<tp.c?' poor':'')+'">'+COIN+tp.c+'</div>')+'</div>';
if(!t)h+='<p class="ds">'+DS[k]+'</p>';
h+='<div class="sts">';
if(tp.sup){const p=l=>Math.round((.2+.1*(l-1))*100);h+=row('Boost','+'+p(l)+'%'+sm('damage'),nx&&'+'+p(l+1)+'%')+row('Range',tiles(a.r)+sm('tiles'),nx&&tiles(nx.r),bar(a.r,nx&&nx.r,MX.r));}
else if(tp.inc)h+=row('Income','+'+tp.inc*l+sm('gold / wave'),nx&&'+'+tp.inc*(l+1));
else{const ds=k=='arrow'&&a.n>1?'total':k=='storm'?'chain':k=='alch'||k=='cannon'?'per enemy':'';
h+=row('DPS',fmt(a.dps)+(ds?sm(ds):''),nx&&fmt(nx.dps),bar(a.dps,nx&&nx.dps,MX.dps))+
row('Damage',k=='arrow'?fmt(a.d)+sm('× '+a.n+' arrow'+(a.n>1?'s':'')):k=='alch'?fmt(a.d)+sm('/s for 3s'):k=='storm'?fmt(a.d)+sm('−8% per jump'):fmt(a.d),nx&&fmt(nx.d))+
row('Fire rate',(a.rate<1?a.rate.toFixed(2):a.rate.toFixed(1))+sm('/s · '+tp.f+'s reload'),null,bar(a.rate,null,MX.rate))+
row('Range',tiles(a.r)+sm('tiles'),nx&&tiles(nx.r),bar(a.r,nx&&nx.r,MX.r));}
h+='</div>';
const c={arrow:[a.n+(a.n>1?' targets':' target'),'Front-runners first'],cannon:['Splash '+tiles(tp.sp)+' tiles','Slows '+20*l+'% for 1s'],frost:['Banish '+(.5+.5*l)+' tiles','Bosses ⅓ as far','4s immunity'],
ballista:['Targets the toughest','Longest range'],storm:['Chains '+a.n+' enemies','Stuns 0.2s'],alch:['Poison 3s','Splash 0.75 tiles'],
banner:[t?'Boosting '+g.tw.filter(o=>o!==t&&!T[o.k].sup&&!T[o.k].inc&&Math.hypot(o.x-t.x,o.y-t.y)<=a.r).length+' towers':'Stacks with other banners'],vault:['Pays for itself in '+Math.ceil(tp.c/(tp.inc*l))+' waves']}[k].map(s=>'<span class="chip">'+s+'</span>');
if(bf>1)c.unshift('<span class="chip hi">🚩 +'+Math.round((bf-1)*100)+'% from banners</span>');
return h+'<div class="chips">'+c.join('')+'</div>';}
function ui(){const w=g.run?waveMix(g.wave).length:0,left=g.en.length+g.q.length;
$('gold').textContent=g.gold;$('lives').textContent=g.lives;$('lives').parentNode.classList.toggle('low',g.lives<=5&&!g.over);
setH($('wave'),'<small>Wave </small>'+g.wave+' / '+MAXW);$('wbar').style.width=((g.wave-(g.run?left/w:0))/MAXW*100)+'%';
$('start').disabled=g.run||g.over;setH($('start'),g.run?'<span class="t">Under attack</span><span class="s">'+left+' enemies left</span>':'<span class="t">Start wave '+(g.wave+1)+'</span><span class="s">'+(nm=>nm.filter(t=>t!='boss').length+' enemies'+(nm.includes('boss')?' and a dragon':''))(waveMix(g.wave+1))+'</span>');
if(g.wave<MAXW&&!g.run){const n={};for(const t of waveMix(g.wave+1))n[t]=(n[t]||0)+1;
setH($('nw'),'<span>Next wave</span><span class="mx">'+Object.keys(n).map(t=>'<span'+(t=='boss'?' class="boss"':'')+' title="'+FOE[t][1]+'">'+FOE[t][0]+n[t]+'</span>').join('')+'</span>');}
else setH($('nw'),'<span>'+(g.run?'Wave '+g.wave:'Final wave')+'</span><span class="mx">'+(g.run?left+' left':'')+'</span>');
document.querySelectorAll('#spd button').forEach(b=>b.classList.toggle('on',+b.dataset.s==g.spd));
for(const k of TK){const b=$('b_'+k);b.classList.toggle('on',g.build===k&&!g.sel);b.classList.toggle('poor',g.gold<T[k].c);}
const s=g.sel,k=s?s.k:hov||g.build;$('sel').style.display=s?'flex':'none';$('ip').style.setProperty('--ac',TC2[k]);
if(!s&&performance.now()<offMsg)setH($('info'),'<div class="ih"><div class="ihn"><b>Locked</b></div></div><p class="ds">🔒 Not available yet.</p>');else setH($('info'),infoHTML(k,s));
if(s){setH($('up'),s.l>=3?'Max level':'Upgrade '+COIN+upCost(s));$('up').disabled=s.l>=3||g.gold<upCost(s);setH($('sell'),'Sell '+COIN+Math.round(s.inv*.6));}
document.body.classList.toggle('over',!!g.over);
const sov=g.over&&performance.now()-(g.overT||0)>2200;$('ov').style.display=sov?'flex':'none';
const oh=g.won?'<span class="k" style="--ac:var(--ok)">Victory</span><h2>The castle is saved!</h2><p>All '+MAXW+' waves held back, with '+g.lives+' lives to spare.</p><button class="btn go" id="again"><span class="t">Play again</span></button>'
:'<span class="k" style="--ac:var(--bad)">Defeat</span><h2>The castle has fallen</h2><p>Overrun on wave '+g.wave+' of '+MAXW+'.</p><button class="btn go" id="again"><span class="t">Try again</span></button>';
if(sov&&g.ovh!==oh){g.ovh=oh;$('ov').innerHTML='<div class="ovbox">'+oh+'</div>';}}
const pick=k=>{if(T[k].off){offMsg=performance.now()+3000;ui();return;}g.build=k;g.sel=null;selRng();ui();};
TK.forEach((k,i)=>{const b=document.createElement('button');b.className='tile'+(T[k].off?' off':'');b.id='b_'+k;b.style.setProperty('--ac',TC2[k]);b.title=T[k].n+' ('+(i+1)+')';
b.innerHTML='<i class="hk">'+(i+1)+'</i><span class="ic">'+T[k].ic+'</span><span class="nm">'+T[k].n+'</span><b class="co">'+COIN+T[k].c+'</b>';b.onclick=()=>pick(k);
b.onpointerenter=e=>{if(e.pointerType=='mouse'){hov=k;ui();}};b.onpointerleave=()=>{hov=null;ui();};$('towers').appendChild(b);});
$('start').onclick=startWave;$('ov').onclick=e=>{if(e.target.closest&&e.target.closest('#again'))reset();};
document.querySelectorAll('#spd button').forEach(b=>b.onclick=()=>{g.spd=+b.dataset.s;ui();});
$('hp').onclick=()=>{$('hp').classList.toggle('on',$('help').classList.toggle('on'));};
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
if(k>='1'&&k<='8'&&TK[+k-1])pick(TK[+k-1]);else if(k==' '){e.preventDefault();startWave();}else if(k=='Escape'){g.sel=null;$('help').classList.remove('on');$('hp').classList.remove('on');selRng();ui();}
else if(k=='q'||k=='Q'){az-=.3;setCam();}else if(k=='e'||k=='E'){az+=.3;setCam();}});
