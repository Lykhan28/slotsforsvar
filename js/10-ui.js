// ---------- UI ----------
const DS={arrow:'Fires at 1, 2 or 3 enemies at once, depending on its level.',cannon:'Hurls boulders that hit everything in an area and slow enemies for 1 second.',frost:'Teleports enemies back down the road, starting with the one closest to the castle. Bosses resist.',ballista:'Huge range and hits hard, piercing armour. Goes for the toughest enemy unless you tell it otherwise.',storm:'Chain lightning strikes 5, 6 or 7 enemies and stuns them for a moment. Lightning ignores armour.',alch:'Lobs poison flasks that deal damage over time in an area.',banner:'Nearby towers deal +20% damage.',vault:'Earns gold at the end of every wave.'};
const ROLE={arrow:'Multi-shot',cannon:'Area · Slow',frost:'Control',ballista:'Sniper',storm:'Chain',alch:'Poison · Area',banner:'Support',vault:'Economy'};
const FOE={norm:['👺','Goblins'],fast:['🐺','Wolf riders'],tank:['🛡️','Black knights'],boss:['🐉','Dragon'],king:['👑','Goblin King','summons goblins'],ram:['🐏','Siege Ram','costs 10 lives at the gate'],necro:['💀','Necromancer','raises skeletons from the fallen'],skel:['🦴','Skeletons'],guard:['🧱','Shieldbearers','shields stop arrows from the front'],shaman:['🧙','Shamans','heal nearby enemies'],bat:['🦇','Bat swarms','fly straight to the gate; Catapults and Alchemists can’t hit them'],sapper:['💣','Sappers','blow up a tower beside the road, stunning it for 4s'],troll:['🧌','Trolls','two goblins jump out when one dies'],ghost:['👻','Ghosts','fade out of reach for 1s every few seconds'],imp:['😈','Fire imps']};
// an enemy type's resistances (E[type].rs, see DTY in js/01-config.js) and special ability (FOE[type][2], left out when ab===false) as text, e.g. "−50% physical"
const resL=t=>Object.keys(E[t].rs).map(d=>E[t].rs[d]>=1?'immune to '+DTY[d][0].toLowerCase():(E[t].rs[d]>0?'−':'+')+Math.round(Math.abs(E[t].rs[d])*100)+'% '+DTY[d][0].toLowerCase()),resTxt=(t,ab)=>resL(t).concat(ab===false?[]:FOE[t][2]||[]).join(', ');
// bestiary entries in the order the bestiary lists them: singular name and what to know about it (shown on the new-enemy card and in the menu's Bestiary)
const BST={norm:['Goblin','The backbone of every horde. Weak on its own, dangerous in numbers – some carry spiked clubs, others rusty cleavers.'],
fast:['Wolf Rider','A goblin on a snarling wolf. Fragile, but almost twice as fast as a goblin on foot, so don’t let them slip past.'],
tank:['Black Knight','Full plate and a greatsword. Its armour shrugs off half of all physical damage – answer it with magic, poison, lightning or the Ballista.'],
boss:['Dragon','A boss. Huge health, shrugs off half of all fire and poison, and costs five lives if it reaches the gate.'],
king:['Goblin King','A boss. Every few seconds he lifts his sceptre and two more goblins rush out beside him. Kill him fast or the goblins never stop coming.'],
ram:['Siege Ram','A boss. A slow, heavy battering ram pushed by goblins, its timbers shrug off some physical damage – and if it reaches the gate it smashes it for 10 lives.'],
necro:['Necromancer','A boss. Every few seconds it raises the enemies that just fell near it as skeletons. Half resists magic. Kill it before the dead start walking again.'],
skel:['Skeleton','A fallen enemy raised by the Necromancer. Weak and worth almost no gold, but there can be a lot of them.'],
bat:['Bat Swarm','Flies straight from the breach to the gate, ignoring the road. Catapults and Alchemists can’t reach it; Archers, the Ballista, Wizards and Storm Towers can.'],
guard:['Shieldbearer','Its tower shield blocks most of the damage from arrows and Ballista bolts that hit it from the front. Hit it from the side or behind, or with anything that isn’t an arrow.'],
sapper:['Goblin Sapper','Carries a lit bomb. When it passes a tower next to the road it charges and blows up, knocking the tower out for 4 seconds. Stop it before it gets there.'],
shaman:['Goblin Shaman','Every few seconds a green pulse from its staff heals the enemies around it. Take it down first.'],
troll:['Troll','Big, slow and tough, with two goblins in a basket on its back. When it falls they jump out and keep running – so kill it early, not at the gate.'],
ghost:['Ghost','Every few seconds it fades out for a moment. While faded nothing can target or hurt it, and arrows already in the air pass straight through.'],
imp:['Fire Imp','A little devil from the lava fields. Immune to fire and poison, so the Alchemist can’t touch it.']},BSK=Object.keys(BST);
// facts about an enemy type as chips: health compared with a goblin, speed, gold, flying, resistances
const foeChips=t=>{const e=E[t];return['❤️ ×'+e.h+' health','👣 '+(e.s<=35?'Slow':e.s<=50?'Steady':e.s<=65?'Quick':'Fast'),COIN+e.rw+' gold',...(e.fy?['🦇 Flies']:[]),...(e.lv>1?['💔 Costs '+e.lv+' lives']:[]),...resL(t)].map(x=>'<span class="chip">'+x+'</span>').join('');};
// first sighting: the first time an enemy type ever spawns (remembered in localStorage sfseen: type → [level, wave]) the game pauses and a card introduces it;
// it carries on by itself after FC.t s, or with the button, a click on the card, Space, Enter or Esc. Several new types in one wave queue up
let SEEN={};try{SEEN=JSON.parse(localStorage.getItem('sfseen')||'{}')||{};}catch(e){}
const FC={open:false,q:[],t:7,tm:0,wp:false};
function foeSeen(t){if(SEEN[t]||!BST[t])return;SEEN[t]=[LVN+1,g.wave];try{localStorage.setItem('sfseen',JSON.stringify(SEEN));}catch(e){}FC.q.push(t);if(!FC.open)foeNext();}
function foeNext(){const t=FC.q.shift();if(!t)return;FC.open=true;FC.wp=!!g.pause;setPause(true);const el=$('foe');
setH(el,'<div class="ovbox"><span class="k">New enemy</span><img alt="" src="'+portrait(t)+'"><h2>'+BST[t][0]+'</h2><p>'+BST[t][1]+'</p><div class="chips">'+foeChips(t)+'</div><button class="btn" id="f_ok">Got it</button><i class="fbar" style="animation-duration:'+FC.t+'s"></i></div>');
el.classList.add('on');clearTimeout(FC.tm);FC.tm=setTimeout(foeDone,FC.t*1000);ui();}
function foeDone(){if(!FC.open)return;clearTimeout(FC.tm);FC.open=false;$('foe').classList.remove('on');if(!FC.wp)setPause(false);ui();if(FC.q.length)setTimeout(foeNext,250);}
$('foe').onclick=e=>{if(e.target.closest('.ovbox'))foeDone();};
addEventListener('keydown',e=>{if(!FC.open||MENU.open||![' ','Enter','Escape'].includes(e.key))return;e.preventDefault();e.stopImmediatePropagation();foeDone();},true);
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
// targeting picker for a built attacking tower (T cycles it); before building, the default shows as a chip
const atk=!tp.sup&&!tp.inc,tm=atk&&tmode(t||{k});if(t&&atk)h+='<div class="tgm"><span class="sl">Target</span><div class="seg" title="Targeting (T)">'+TGK.map(m=>'<button data-tm="'+m+'"'+(m==tm?' class="on"':'')+' title="'+TGM[m][1]+'">'+TGM[m][0]+'</button>').join('')+'</div></div>';
const c={arrow:[a.n+(a.n>1?' targets':' target')],cannon:['Splash '+tiles(tp.sp)+' tiles','Slows '+20*l+'% for 1s'],frost:['Banish '+(.5+.5*l)+' tiles','Bosses ⅓ as far','4s immunity'],
ballista:['Longest range'],storm:['Chains '+a.n+' enemies','Stuns 0.2s'],alch:['Poison 3s','Splash 0.75 tiles'],
banner:[t?'Boosting '+g.tw.filter(o=>o!==t&&!T[o.k].sup&&!T[o.k].inc&&Math.hypot(o.x-t.x,o.y-t.y)<=a.r).length+' towers':'Stacks with other banners'],vault:['Pays for itself in '+Math.ceil(tp.c/(tp.inc*l))+' waves']}[k].map(s=>'<span class="chip">'+s+'</span>');
if(atk&&!t)c.unshift('<span class="chip">Targets: '+TGM[tm][0]+'</span>');
if(atk)c.push(tp.air?'<span class="chip" title="Can shoot flying enemies">🦇 Hits flyers</span>':'<span class="chip lo" title="Can’t hit flying enemies">Ground only</span>');
if(atk)c.unshift('<span class="chip dty" title="Damage type">'+DTY[tp.dt][1]+' '+DTY[tp.dt][0]+(tp.pr?' · pierces armour':tp.dt=='light'?' · ignores armour':'')+'</span>');
if(t&&t.stun>0)c.unshift('<span class="chip lo">💥 Stunned · '+Math.ceil(t.stun)+'s</span>');
if(bf>1)c.unshift('<span class="chip hi">🚩 +'+Math.round((bf-1)*100)+'% from banners</span>');
return h+'<div class="chips">'+c.join('')+'</div>';}
// boss health bar across the top of the view while a boss is on the board
function bossBar(){const e=g.en.find(o=>o.bs&&o.hp>0),el=$('bb');el.classList.toggle('on',!!e&&!g.over);if(!e)return;
setH(el.firstChild,'<span class="bbn">'+FOE[e.type][0]+' '+BST[e.type][0]+'</span><span class="bbv">'+(e.lv>1?'💔 '+e.lv+' lives at the gate':'')+'</span>');el.lastChild.firstChild.style.width=(100*Math.max(0,e.hp)/e.max).toFixed(1)+'%';}
function ui(){bossBar();const w=g.run?waveMix(g.wave).length:0,left=g.en.length+g.q.length;
$('gold').textContent=g.gold;$('lives').textContent=g.lives;$('lives').parentNode.classList.toggle('low',g.lives<=5&&!g.over);
setH($('wave'),'<small>Wave </small>'+g.wave+' / '+MAXW);$('wbar').style.width=((g.wave-(g.run?left/w:0))/MAXW*100)+'%';
// in the break: "Call wave N early" with the bonus for the time left (and the auto-start countdown), then plain "Start wave N" once the time is up
const bl=brkLeft(),eb=earlyBonus(),foes=nm=>{const b=nm.find(t=>E[t].bs);return nm.filter(t=>!E[t].bs).length+' enemies'+(b?' and '+(b=='boss'?'a dragon':'the '+BST[b][0]):'');};
$('start').disabled=g.run||g.over;$('start').classList.toggle('early',eb>0);setH($('start'),g.run?'<span class="t">Under attack</span><span class="s">'+left+' enemies left</span>':
eb>0?'<span class="t">Call wave '+(g.wave+1)+' early</span><span class="s"><b class="eb">'+COIN+'+'+eb+' bonus</b> · '+(autoW?'starts in ':'')+Math.ceil(bl)+'s'+(autoW?'':' left')+'</span><i class="cdb" style="width:'+(bl/BRK*100).toFixed(1)+'%"></i>':
'<span class="t">Start wave '+(g.wave+1)+'</span><span class="s">'+foes(waveMix(g.wave+1))+'</span>');
if(g.wave<MAXW&&!g.run){const n={};for(const t of waveMix(g.wave+1))n[t]=(n[t]||0)+1;
// the line under the icons always lists resistances, and an ability only for enemy types that weren't in the previous wave (every icon's tooltip has it all)
const pv=g.wave?waveMix(g.wave):[],rt=t=>resTxt(t,!pv.includes(t)),rz=Object.keys(n).filter(rt);
setH($('nw'),'<span>Next wave</span><span class="mx">'+Object.keys(n).map(t=>'<span'+(E[t].bs?' class="boss"':'')+' title="'+FOE[t][1]+(resTxt(t)?' · '+resTxt(t):'')+'">'+FOE[t][0]+n[t]+'</span>').join('')+'</span>'+
(rz.length?'<span class="rz">'+rz.map(t=>'<span title="'+FOE[t][1]+'">'+FOE[t][0]+' '+rt(t)+'</span>').join('')+'</span>':''));}
else setH($('nw'),'<span>'+(g.run?'Wave '+g.wave:'Final wave')+'</span><span class="mx">'+(g.run?left+' left':'')+'</span>');
document.querySelectorAll('#spd button[data-s]').forEach(b=>b.classList.toggle('on',+b.dataset.s==g.spd));
const pz=!!g.pause&&!g.over;$('pz').classList.toggle('on',pz);setH($('pz'),'<svg><use href="#i-'+(pz?'play':'pause')+'"/></svg>');$('pz').title=pz?'Resume (P)':'Pause (P)';$('pov').classList.toggle('on',pz&&!MENU.open&&!FC.open);if(AU.pz!==pz){AU.pz=pz;auPause(pz);}
for(const k of TK){const b=$('b_'+k);b.classList.toggle('on',g.build===k&&!g.sel);b.classList.toggle('poor',g.gold<T[k].c);}
const s=g.sel,k=s?s.k:hov||g.build;$('sel').style.display=s?'flex':'none';$('ip').style.setProperty('--ac',TC2[k]);
if(!s&&performance.now()<offMsg)setH($('info'),'<div class="ih"><div class="ihn"><b>Locked</b></div></div><p class="ds">🔒 Not available yet.</p>');else setH($('info'),infoHTML(k,s));
if(s){setH($('up'),s.l>=3?'Max level':'Upgrade '+COIN+upCost(s));$('up').disabled=s.l>=3||g.gold<upCost(s);const u=canUndo(s);setH($('sell'),(u?'Undo ':'Sell ')+COIN+sellVal(s));$('sell').title=u?'Undo (S or Ctrl+Z) – full refund until the wave starts':'Sell (S) – 60% back';}
document.body.classList.toggle('over',!!g.over);
const sov=g.over&&performance.now()-(g.overT||0)>2200;$('ov').style.display=sov?'flex':'none';
const last=LVN>=LEVELS.length-1,oh=g.won?'<span class="k" style="--ac:var(--ok)">'+(last?'Victory · the final level':'Victory · level '+(LVN+1)+' of '+LEVELS.length)+'</span><h2>'+(last?'The kingdom is saved!':'The castle is saved!')+'</h2><p>'+(last?'Even the Dread Wastes couldn’t break you. All '+MAXW+' waves held back, with '+g.lives+' lives to spare.':'All '+MAXW+' waves held back, with '+g.lives+' lives to spare.')+'</p>'+
(last?'<button class="btn go" id="again"><span class="t">Restart level</span></button>':'<button class="btn go" id="next"><span class="t">Next level: '+LEVELS[LVN+1].n+'</span></button><button class="btn" id="again">Restart level</button>')
:'<span class="k" style="--ac:var(--bad)">Defeat</span><h2>The castle has fallen</h2><p>Overrun on wave '+g.wave+' of '+MAXW+'.</p><button class="btn go" id="again"><span class="t">Restart level</span></button>';
if(sov&&g.ovh!==oh){g.ovh=oh;$('ov').innerHTML='<div class="ovbox">'+oh+'</div>';}covUpd();saveRun();}
const pick=k=>{if(T[k].off){offMsg=performance.now()+3000;ui();return;}g.build=k;g.sel=null;selRng();ui();};
TK.forEach((k,i)=>{const b=document.createElement('button');b.className='tile'+(T[k].off?' off':'');b.id='b_'+k;b.style.setProperty('--ac',TC2[k]);b.title=T[k].n+' ('+(i+1)+')';
b.innerHTML='<i class="hk">'+(i+1)+'</i><span class="ic">'+T[k].ic+'</span><span class="nm">'+T[k].n+'</span><b class="co">'+COIN+T[k].c+'</b>';b.onclick=()=>pick(k);
b.onpointerenter=e=>{if(e.pointerType=='mouse'){hov=k;ui();}};b.onpointerleave=()=>{hov=null;ui();};$('towers').appendChild(b);});
// pause and speed: the HUD buttons, P and F; starting a wave also resumes
function setPause(v){v=!!v&&!g.over;if(!!g.pause==v)return;g.pause=v;ui();}
const setSpd=s=>{g.spd=s;ui();},go=()=>{setPause(false);callEarly();};
// targeting: inspector buttons or T on the selected tower (kept through upgrades and saved with the run)
function setTm(t,m){if(!t||T[t.k].sup||T[t.k].inc||!TGM[m])return;t.tm=m;snd('click');ui();}
$('info').onclick=e=>{const b=e.target.closest&&e.target.closest('[data-tm]');if(b)setTm(g.sel,b.dataset.tm);};
// coverage map: C or the grid button; the legend matches COVC in js/06-scenery.js
function covTog(){COV.on=!COV.on;$('cv').classList.toggle('on',COV.on);$('covl').classList.toggle('on',COV.on);covUpd();}
$('covl').querySelector('.sw').innerHTML=COVC.map((c,i)=>'<i style="background:#'+new THREE.Color(c).getHexString()+'">'+(i<5?i:'5+')+'</i>').join('');$('cv').onclick=covTog;
$('start').onclick=go;$('pz').onclick=()=>setPause(!g.pause);$('pov').firstChild.onclick=()=>setPause(false);$('ov').onclick=e=>{if(!e.target.closest)return;if(e.target.closest('#again'))restartLevel();else if(e.target.closest('#next'))goLevel(LVN+1);};
document.querySelectorAll('#spd button[data-s]').forEach(b=>b.onclick=()=>setSpd(+b.dataset.s));
$('hp').onclick=()=>{$('hp').classList.toggle('on',$('help').classList.toggle('on'));};
// a tower placed in this break (t.bw) can be undone for everything spent on it, upgrades too, until the wave starts; otherwise selling gives 60% back
const canUndo=t=>!!t&&!g.run&&!g.over&&t.bw===g.wave,sellVal=t=>canUndo(t)?t.inv:Math.round(t.inv*.6);
function sellTw(t){if(!t||g.over)return;g.gold+=sellVal(t);sc.remove(t.m);snd('sell');burst(t.x,t.y,0xffffff,8,1,.3);g.tw=g.tw.filter(x=>x!==t);if(g.sel===t)g.sel=null;selRng();ui();}
// Ctrl+Z / Z: take back the most recent placement of this break
const undo=()=>sellTw(g.tw.filter(canUndo).pop());
$('up').onclick=()=>{const t=g.sel;if(t&&t.l<3&&g.gold>=upCost(t)){g.gold-=upCost(t);t.inv+=upCost(t);t.l++;buildTower(t);snd('upgrade');burst(t.x,t.y,P.gd,14,1.4,.4);selRng();ui();}};
$('sell').onclick=()=>sellTw(g.sel);
// minimap
const MM=$('mm'),mq=MM.getContext('2d');
// fitted to this level's board and castle (CAM0.bb, world units); the canvas height follows the level's shape
const MB=(()=>{const b=CAM0.bb,x0=b.x0-1.5,x1=b.x1+1.5,z0=b.z0-1,z1=b.z1+1;MM.height=Math.round(clamp(MM.width*(z1-z0)/(x1-x0),70,150));const k=Math.min(MM.width/(x1-x0),MM.height/(z1-z0));
const hx=c=>'#'+new THREE.Color(c).getHexString();return{k,ox:(MM.width-(x1-x0)*k)/2-x0*k,oz:(MM.height-(z1-z0)*k)/2-z0*k,bg:hx(new THREE.Color(TH.gr[2]).multiplyScalar(.55)),bd:hx(TH.gr[1])};})();
const mX=x=>x*MB.k+MB.ox,mZ=z=>z*MB.k+MB.oz,mRect=(a,b)=>mq.fillRect(mX(Math.min(a.x,b.x)),mZ(Math.min(a.z,b.z)),Math.abs(b.x-a.x)*MB.k+.5,Math.abs(b.z-a.z)*MB.k+.5),cell=(c,r)=>mRect({x:cx(c)-.5,z:cz(r)-.5},{x:cx(c)+.5,z:cz(r)+.5});
function drawMM(){mq.fillStyle=MB.bg;mq.fillRect(0,0,MM.width,MM.height);mq.fillStyle=MB.bd;mRect({x:-W/2,z:-H/2},{x:W/2,z:H/2});
mq.fillStyle='#c9b27a';for(const k of road)cell(...k.split(',').map(Number));for(const o of[...ENT,GATE])cell(o.c,o.r);mq.fillStyle='rgba(0,0,0,.45)';for(const k of blk)cell(...k.split(',').map(Number));
mq.fillStyle='#a53a3a';ENT.forEach((o,i)=>mRect(BW(-7.58,-3,i),BW(-7.17,-2,i)));mq.fillStyle='#8a8272';mRect(CW(7,-.9),CW(13.9,5.9));mq.fillStyle='#ffd24a';mRect(CW(11,1),CW(13,2.67));
for(const t of g.tw){mq.fillStyle=TC2[t.k];mq.fillRect(mX(wx(t.x))-3,mZ(wz(t.y))-3,6,6);}
for(const e of g.en){mq.fillStyle=e.bs?'#ff3b3b':'#ff9a3b';mq.beginPath();mq.arc(mX(wx(e.x)),mZ(wz(e.y)),e.bs?4:2.4,0,7);mq.fill();}
const vw=2.17*dist/20,vh=1.5*dist/20;mq.strokeStyle='#fff';mq.lineWidth=1.5;mq.strokeRect(mX(tx-vw),mZ(tz-vh),vw*2*MB.k,vh*2*MB.k);}
function mmGo(e){const r=MM.getBoundingClientRect(),x=((e.clientX-r.left)/r.width*MM.width-MB.ox)/MB.k,z=((e.clientY-r.top)/r.height*MM.height-MB.oz)/MB.k;tx=clamp(x,CAM0.bb.x0-3,CAM0.bb.x1-1);tz=clamp(z,CAM0.bb.z0-2,CAM0.bb.z1+2);setCam();}
MM.addEventListener('pointerdown',e=>{MM.setPointerCapture(e.pointerId);mmGo(e);});MM.addEventListener('pointermove',e=>{if(e.buttons)mmGo(e);});
addEventListener('keydown',e=>{const k=e.key;if(e.repeat)return;if((e.ctrlKey||e.metaKey)&&(k=='z'||k=='Z')){e.preventDefault();undo();return;}if(e.ctrlKey||e.metaKey||e.altKey)return;
if(k>='1'&&k<='8'&&TK[+k-1])pick(TK[+k-1]);else if(k==' '){e.preventDefault();go();}else if(k=='p'||k=='P')setPause(!g.pause);else if(k=='f'||k=='F')setSpd(g.spd%3+1);else if((k=='u'||k=='U')&&g.sel)$('up').onclick();else if((k=='s'||k=='S')&&g.sel)sellTw(g.sel);else if(k=='z'||k=='Z')undo();else if(k=='c'||k=='C')covTog();else if((k=='t'||k=='T')&&g.sel)setTm(g.sel,TGK[(TGK.indexOf(tmode(g.sel))+1)%TGK.length]);else if(k=='Escape'){if($('help').classList.contains('on')){$('help').classList.remove('on');$('hp').classList.remove('on');}else if(g.sel){g.sel=null;selRng();ui();}else menuOpen();}
else if(k=='q'||k=='Q'){az-=.3;setCam();}else if(k=='e'||k=='E'){az+=.3;setCam();}});
