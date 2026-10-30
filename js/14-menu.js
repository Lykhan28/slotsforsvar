// ---------- main menu ----------
// open: the game is paused behind the menu. quit: render loop stopped and sound muted until "Back to the menu"
const MENU={open:true,quit:false,pg:'main',df:DFN};
const GFX={glow:true,shadows:true,sharp:true,ao:!LOWQ,auto:true};
try{Object.assign(GFX,JSON.parse(localStorage.getItem('sfgfx')||'{}'));}catch(e){}
// auto quality (GFX.auto): when frames average slower than AQF ms (~36 fps) over 3 s of play, aqTick() (from the render loop) switches off the next effect in AQS
// (AO, then glow, high resolution, shadows, and last 'low' = 75% resolution) and waits a window before judging again. Only for this visit: AQ.off is never saved,
// and switching an effect on by hand takes it back off the list. gq(k) = the effect is on now.
const AQ={off:new Set(),t:0,n:0,w:1},AQS=['ao','glow','sharp','shadows','low'],AQF=28,AQN={ao:'ambient occlusion',glow:'glow',sharp:'high resolution',shadows:'shadows',low:'resolution'};
const gq=k=>!AQ.off.has(k)&&(k=='low'||GFX[k]);
function gfxApply(){if(bloom)bloom.enabled=gq('glow');if(AO)AO.pass.enabled=gq('ao');sun.castShadow=gq('shadows');R.setPixelRatio((gq('sharp')?Math.min(devicePixelRatio,PP?1.75:2):1)*(AQ.off.has('low')?.75:1));resize();}
function aqTick(ms){if(!GFX.auto||MENU.open||document.hidden||ms>250)return;AQ.t+=ms;AQ.n++;if(AQ.t<3000)return;const avg=AQ.t/AQ.n;AQ.t=AQ.n=0;if(AQ.w>0){AQ.w--;return;}if(avg<AQF)return;
const k=AQS.find(s=>gq(s)&&(s!='ao'||AO)&&(s!='glow'||bloom));if(!k)return;AQ.off.add(k);AQ.w=1;gfxApply();}
// gameplay settings (localStorage sfopt): auto-start = the next wave starts by itself when the break countdown runs out
const OPT={auto:false,shake:true,cb:false,fcam:false};try{Object.assign(OPT,JSON.parse(localStorage.getItem('sfopt')||'{}'));}catch(e){}autoW=!!OPT.auto;$('fc').classList.toggle('on',!!OPT.fcam);
function optSet(k){OPT[k]=!OPT[k];try{localStorage.setItem('sfopt',JSON.stringify(OPT));}catch(e){}autoW=!!OPT.auto;if(k=='cb')cbApply();ui();}
// colourblind mode (OPT.cb): health bar colours (hpC) and status icons (stIco) in js/07-enemies.js are read every frame; the coverage colours, its legend and the range ring are refreshed here
function cbApply(){covPal();covLeg();if(g)selRng();}
function gfxSet(k){const lw=k=='sharp'&&AQ.off.delete('low');if(AQ.off.delete(k)||lw){gfxApply();return;}GFX[k]=!GFX[k];if(k=='auto'&&!GFX.auto)AQ.off.clear();try{localStorage.setItem('sfgfx',JSON.stringify(GFX));}catch(e){}gfxApply();}
// levels and stars, tracked per difficulty (DIFS in js/01-config.js): PROG[k] = {n: levels won (level i is unlocked when i <= n), st: best stars per level (0 = won before stars existed)}.
// Saved in localStorage sfprog as {easy:{n,st},normal:…,hard:…}; older saves ({n,st} or a bare number) were played like Easy. A win also counts on every easier difficulty (lvWon).
// Switching level or difficulty reloads the page, because the whole scene is built once at load (js/01-config.js picks LVN and DFN)
// stars for a win by lives left, relative to the difficulty's lives plus the Stonemasons perk (STAR): 90%+ = 3, 50%+ = 2, any win = 1 – Easy 18/10, Normal 14/8, Hard 9/5. lvWon() puts this win's stars in g.stN and the earlier best in g.stB (end screen)
const STAR=d=>{const l=d.li+pkv('wall');return[Math.ceil(l*.9),Math.ceil(l*.5)];},stars=l=>{const s=STAR(DF);return l>=s[0]?3:l>=s[1]?2:1;},starH=n=>'<span class="stars">'+[0,1,2].map(i=>'<i'+(i<n?' class="on"':'')+'>★</i>').join('')+'</span>',starT=d=>{const s=STAR(d);return'★★★ '+s[0]+'+ lives left · ★★ '+s[1]+'+ · ★ any win';};
const PROG={};for(const d of DIFS)PROG[d.k]={n:0,st:[]};
try{let d=JSON.parse(localStorage.getItem('sfprog'));if(typeof d=='number')d={easy:{n:d}};else if(d&&'n' in d)d={easy:d};if(d)for(const k in PROG)if(d[k]){PROG[k].n=d[k].n|0;if(Array.isArray(d[k].st))PROG[k].st=d[k].st.map(x=>Math.min(3,Math.max(0,x|0)));}}catch(e){}
function lvWon(){g.stB=PROG[DF.k].st[LVN]||0;g.stN=stars(g.lives);for(let i=0;i<=DFN;i++){const p=PROG[DIFS[i].k];p.n=Math.max(p.n,LVN+1);p.st[LVN]=Math.max(p.st[LVN]||0,g.stN);}try{localStorage.setItem('sfprog',JSON.stringify(PROG));}catch(e){}ach('win');}
// Endless mode (INF in js/09-game.js) is picked at load like the level and difficulty (?endless=1, else localStorage sfmode), and only for a level already won on this difficulty.
// Its highscore BEST[difficulty key][level] = most waves survived, saved in localStorage sfbest by infRec() at the end of every endless wave (g.rec = this run set a new one)
try{INF=(new URLSearchParams(location.search).get('endless')=='1'||localStorage.getItem('sfmode')=='endless')&&PROG[DF.k].n>LVN;}catch(e){}
const BEST={};for(const d of DIFS)BEST[d.k]=[];try{const d=JSON.parse(localStorage.getItem('sfbest'));if(d)for(const k in BEST)if(Array.isArray(d[k]))BEST[k]=d[k].map(x=>Math.max(0,x|0));}catch(e){}
function infRec(){const b=BEST[DF.k];if(g.wave<=(b[LVN]||0))return;b[LVN]=g.wave;g.rec=true;try{localStorage.setItem('sfbest',JSON.stringify(BEST));}catch(e){}ach('endless');}
function goLevel(i,di=DFN,inf=false){if(i===LVN&&di===DFN&&inf===INF){if(g.over)reset();menuClose();return;}let ok=true;try{localStorage.setItem('sflv',i+1);localStorage.setItem('sfdif',DIFS[di].k);localStorage.setItem('sfmode',inf?'endless':'');sessionStorage.setItem('sfgo','1');}catch(e){ok=false;}location.href=location.pathname+(ok?'':'?level='+(i+1)+'&diff='+DIFS[di].k+(inf?'&endless=1':''));}
// level picker = a world map: difficulty tabs (MENU.df, applied when a level is played) above an SVG map where every level is a node along one winding road.
// WMP = node positions in the 1000×620 viewBox (index = level), WMT = per theme the land colour and the icons drawn around it, WIC = the icons (drawn at 0,0, foot at y=0).
// The land and icons are built once (wMap, cached in WMS); the road progress and nodes (wDyn) and the card of the selected level (MENU.ls, lvCard) are redrawn.
// A won level's card has the Endless button (.lve) with its highscore. More levels than WMP would need more positions there.
const dTxt=d=>d.li+' lives'+(d.hp>1?', enemies have '+Math.round((d.hp-1)*100)+'% more health'+(d.bh?' (bosses '+Math.round((d.hp*d.bh-1)*100)+'%)':''):'')+(d.gold<1?', '+Math.round((1-d.gold)*100)+'% less starting gold':'')+(d.hp==1?' – the relaxed way to play':'')+'.';
const WMP=[[95,545],[215,478],[340,540],[465,468],[590,530],[715,462],[840,525],[893,408],[815,328],[668,292],[520,350],[370,285],[222,338],[100,212],[255,118],[440,82]],
WSH=[[560,0],[560,98],[598,168],[650,192],[722,208],[800,226],[880,222],[940,246],[1000,250],[1000,0]],
wSea=(x,y)=>{if(x<560)return false;for(let i=1;i<9;i++){const[a,b]=WSH[i],[c,d]=WSH[i+1];if(x>=a&&x<=c)return y<b+(d-b)*(x-a)/(c-a||1)+14;}return false;},
WIC={tree:c=>'<path d="M0 0V-8" stroke="#3a2a18" stroke-width="2.4"/><circle cy="-14" r="9" fill="'+c+'"/><circle cx="-3" cy="-17" r="4" fill="#fff" opacity=".13"/>',
bush:c=>'<ellipse cy="-4" rx="9" ry="6" fill="'+c+'"/><ellipse cx="-3" cy="-6" rx="4" ry="2.5" fill="#fff" opacity=".12"/>',
pine:c=>'<path d="M0 0V-5" stroke="#2a1e12" stroke-width="2"/><path d="M-8-4L0-26L8-4Z" fill="'+c+'"/><path d="M0-26L8-4H3Z" fill="#000" opacity=".2"/>',
spine:c=>WIC.pine(c)+'<path d="M-3.5-18L0-26L3.5-18L0-20Z" fill="#eef4f8"/>',
dead:c=>'<path d="M0 0V-18M0-10L-6-16M0-13L5-20M0-6L5-9" stroke="'+c+'" stroke-width="2" fill="none" stroke-linecap="round"/>',
flame:c=>'<path d="M0 0C-7 0-8-8-3-13C-3-9 0-9 0-9C-1-15 2-19 5-22C4-16 8-12 7-6C7-2 4 0 0 0Z" fill="'+c+'"/><path d="M0-1C-3-1-3-5 0-8C1-5 3-4 2-2Z" fill="#ffd36a"/>',
reed:c=>'<ellipse cx="2" cy="1" rx="11" ry="4" fill="#33524c" opacity=".8"/><path d="M-2 0V-14M1 0V-18M4 0V-12" stroke="'+c+'" stroke-width="1.6"/><path d="M1-18v-5" stroke="#5a3e22" stroke-width="3" stroke-linecap="round"/>',
ruin:c=>'<path d="M-10 0V-14H-6V-11H-2V-17H2V-8H6V-12H10V0Z" fill="'+c+'"/><path d="M-6-6H-2V0H-6Z" fill="#000" opacity=".3"/>',
grave:c=>'<path d="M-4 0V-10A4 4 0 0 1 4-10V0Z" fill="'+c+'"/><path d="M10 0V-12M7-9H13" stroke="'+c+'" stroke-width="2"/>',
mesa:c=>'<path d="M-13 0L-8-12H7L12 0Z" fill="'+c+'"/><path d="M-8-12H7L5-9H-7Z" fill="#fff" opacity=".15"/>',
lava:c=>'<path d="M-12 0L-5-3L0 1L6-2L12 1" stroke="'+c+'" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="0" cy="0" r="9" fill="'+c+'" opacity=".12"/>',
spike:c=>'<path d="M-6 0L-2-20L2 0ZM3 0L6-11L9 0Z" fill="'+c+'"/>',
hay:c=>'<path d="M-9 0A9 10 0 0 1 9 0Z" fill="'+c+'"/><path d="M-5-3H5M-3-7H3" stroke="#8a6020" opacity=".6"/>',
palm:c=>'<path d="M0 0C1-8 3-14 1-20" stroke="#7a5a32" stroke-width="2.2" fill="none"/><path d="M1-20C-5-23-9-20-11-16M1-20C6-24 10-21 12-16M1-20C-2-26 2-28 6-27M1-20C-6-19-8-15-8-12" stroke="'+c+'" stroke-width="3" fill="none" stroke-linecap="round"/>',
rock:c=>'<path d="M-9 0L-6-7L1-9L8-4L9 0Z" fill="'+c+'"/><path d="M-6-7L1-9L2-5Z" fill="#fff" opacity=".18"/>',
dune:c=>'<path d="M-16 0Q-4-9 10-1M-4 4Q6-3 16 3" stroke="'+c+'" stroke-width="2" fill="none" stroke-linecap="round"/>',
pillar:c=>'<path d="M-4 0V-16L-2-19L1-17L4-20V0ZM-6 0H6V2H-6Z" fill="'+c+'"/><path d="M1-17L4-20V0H1Z" fill="#000" opacity=".15"/>',
peak:c=>'<path d="M-20 0L-3-28L16 0Z" fill="'+c+'"/><path d="M-3-28L16 0H7Z" fill="#000" opacity=".18"/><path d="M-9-18L-3-28L4-18L0-20Z" fill="#f4f7fa"/>',
crystal:c=>'<path d="M-6 0L-8-12L-4-20L-1-10ZM-1 0L1-24L6-14L4 0ZM4 0L9-10L11-2Z" fill="'+c+'"/><path d="M1-24L2 0" stroke="#fff" opacity=".4"/><circle cy="-8" r="13" fill="'+c+'" opacity=".12"/>',
stone:c=>'<path d="M-9 0V-14L-5-16V0ZM2 0V-17L7-15V0Z" fill="'+c+'"/>',
cloud:c=>'<path d="M-12-30A6 6 0 0 1-4-36A7 7 0 0 1 9-34A5 5 0 0 1 11-26H-12A4 4 0 0 1-12-30Z" fill="'+c+'"/><path d="M0-26L-3-17H1L-2-8" stroke="#ffe88a" stroke-width="1.8" fill="none"/>',
isle:c=>'<circle cy="-10" r="17" fill="#a070ff" opacity=".1"/><path d="M-12-12H12L0 2Z" fill="'+c+'"/><ellipse cy="-12" rx="12" ry="3" fill="#6a5a7e"/>',
spark:c=>'<path d="M0-6L1.4-1.4L6 0L1.4 1.4L0 6L-1.4 1.4L-6 0L-1.4-1.4Z" fill="'+c+'"/>'},
WMT={meadow:['#62803e',[['tree','#3e6a2a'],['tree','#4c7a30'],['bush','#557f36']]],darkwood:['#2b4230',[['pine','#1b3a24'],['pine','#24482c'],['dead','#4a4436']]],
burning:['#503424',[['flame','#e8642a'],['dead','#1c1410'],['dead','#2a1e16']]],marsh:['#59633e',[['reed','#8a9a52'],['dead','#4c4a36'],['tree','#4a5a34']]],
ruins:['#67615a',[['ruin','#8e877c'],['rock','#77716a'],['dead','#3a3630']]],moor:['#46445a',[['grave','#8c889c'],['dead','#2c2a36'],['grave','#a09cae']]],
badlands:['#8a563a',[['mesa','#a86a48'],['lava','#ff7a2a'],['rock','#7a4a32']]],hell:['#3a201c',[['spike','#160e0c'],['lava','#ff5a1e'],['rock','#2a1a18']]],
autumn:['#8a7238',[['tree','#c2702a'],['tree','#a8442a'],['hay','#d4a84a']]],coast:['#6a7e4e',[['palm','#4a7a3a'],['rock','#8a8270'],['tree','#4c7432']]],
desert:['#b49660',[['dune','#9e7e48'],['pillar','#dccca0'],['palm','#5a7a3a']]],snow:['#a4b0b8',[['peak','#7e8a98'],['spine','#2e4a3a'],['spine','#3a5646']]],
crystal:['#40365c',[['crystal','#a98ae8'],['crystal','#6ad0e0'],['rock','#2e2840']]],pass:['#69655b',[['peak','#8a857a'],['rock','#5a564e'],['pine','#2e4630']]],
storm:['#4a5856',[['stone','#8e9494'],['cloud','#5a6266'],['stone','#7a8080']]],void:['#24193a',[['isle','#3a2c4a'],['spark','#c8a8ff'],['spark','#8ad0ff']]]},
wmt=i=>WMT[LEVELS[i].th]||WMT.meadow,
// road segment i→i+1 as a cubic Bézier (Catmull-Rom through the nodes); wSeg(i,t) samples it
wCtl=i=>{const P=WMP,a=P[i-1]||P[i],b=P[i],c=P[i+1],d=P[i+2]||c;return[b,[b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6],[c[0]-(d[0]-b[0])/6,c[1]-(d[1]-b[1])/6],c];},
wSeg=(i,t)=>{const[p,q,r,s]=wCtl(i),u=1-t,f=k=>u*u*u*p[k]+3*u*u*t*q[k]+3*u*t*t*r[k]+t*t*t*s[k];return[f(0),f(1)];},
wD=i=>{const[p,q,r,s]=wCtl(i),f=v=>v.map(n=>n.toFixed(1)).join(' ');return'M'+f(p)+'C'+f(q)+' '+f(r)+' '+f(s);};
let WMS=null;
function wMap(){if(WMS)return WMS;const N=Math.min(LEVELS.length,WMP.length);let sd=7;const rr=()=>(sd=sd*16807%2147483647)/2147483647;
const near=(x,y)=>{let b=0,bd=1e9;for(let i=0;i<N;i++){const d=Math.hypot(WMP[i][0]-x,WMP[i][1]-y);if(d<bd){bd=d;b=i;}}return b;};
const RP=[];for(let i=0;i<N-1;i++)for(let t=0;t<1;t+=.05)RP.push(wSeg(i,t));
let land='',ic=[];
for(let y=-20;y<=660;y+=34)for(let x=-20;x<=1030;x+=34){const jx=x+(rr()-.5)*14,jy=y+(rr()-.5)*14;if(wSea(jx,jy-20))continue;land+='<circle cx="'+jx.toFixed(0)+'" cy="'+jy.toFixed(0)+'" r="30" fill="'+wmt(near(jx,jy))[0]+'"/>';}
for(let y=22;y<=616;y+=30)for(let x=12;x<=990;x+=34){const px=x+(rr()-.5)*24,py=y+(rr()-.5)*20,k=rr();if(k<.12||wSea(px,py)||px<8||px>992)continue;
if(RP.some(([a,b])=>Math.hypot(a-px,b-py)<28))continue;if(WMP.slice(0,N).some(([a,b])=>Math.abs(a-px)<66&&py-b>-38&&py-b<66))continue;
const T=wmt(near(px,py))[1],[n,c]=T[Math.floor(rr()*T.length)];ic.push([py,'<g transform="translate('+px.toFixed(0)+' '+py.toFixed(0)+') scale('+(.8+rr()*.4).toFixed(2)+')">'+WIC[n](c)+'</g>']);}
ic.sort((a,b)=>a[0]-b[0]);
const sh='M'+WSH.map(p=>p.join(' ')).join('L')+'Z';let wv='';for(let i=0;i<14;i++){const x=600+rr()*380,y=14+rr()*170;if(wSea(x,y-8))wv+='<path d="M'+x.toFixed(0)+' '+y.toFixed(0)+'q5-4 10 0t10 0"/>';}
let rd='';for(let i=0;i<N-1;i++)rd+='<path d="'+wD(i)+'"/>';
return WMS='<defs><filter id="wmb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="16"/></filter><radialGradient id="wmv" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#0a0603" stop-opacity="0"/><stop offset="100%" stop-color="#0a0603" stop-opacity=".7"/></radialGradient></defs>'+
'<rect width="1000" height="620" fill="#3a3226"/><g filter="url(#wmb)">'+land+'</g>'+
'<path d="'+sh+'" fill="#2b4a5a"/><path d="'+sh+'" fill="none" stroke="#e6d6a8" stroke-opacity=".45" stroke-width="3"/><g fill="none" stroke="#9ec0cc" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round">'+wv+'</g>'+
'<g fill="none" stroke-linecap="round"><g stroke="#140d06" stroke-opacity=".5" stroke-width="10">'+rd+'</g><g stroke="#e3cf9f" stroke-opacity=".5" stroke-width="4" stroke-dasharray="1 10">'+rd+'</g></g>'+
ic.map(a=>a[1]).join('')+'<rect width="1000" height="620" fill="url(#wmv)" pointer-events="none"/><g id="wm_dyn"></g>';}
// the road walked so far (a segment is lit once the level before it is won) and the level nodes, for the difficulty shown
function wDyn(){const di=MENU.df,p=PROG[DIFS[di].k],here=di===DFN,N=Math.min(LEVELS.length,WMP.length);let s='<g fill="none" stroke="#f0c770" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="11 7">';
for(let i=0;i<N-1;i++)if(i<p.n)s+='<path d="'+wD(i)+'"/>';s+='</g>';
for(let i=0;i<N;i++){const[x,y]=WMP[i],L=LEVELS[i],cur=here&&i==LVN&&!INF,lock=i>p.n&&!(here&&i==LVN),done=i<p.n,st=p.st[i]||0;
s+='<g class="wnd'+(lock?' lock':'')+(done?' won':'')+(cur?' cur':'')+(i===MENU.ls?' sel':'')+'" data-i="'+i+'" tabindex="0" role="button" aria-label="'+(i+1)+'. '+L.n+(lock?', locked':done?', won, '+st+' of 3 stars':'')+'" transform="translate('+x+' '+y+')">'+
'<circle class="wh" r="34"/><circle class="wg" r="29"/><circle class="wc" r="21"/>'+(lock?'<text class="wl" y="6">🔒</text>':'<text class="wi" y="6">'+(i+1)+'</text>')+
(done?'<text class="ws" y="31">'+[0,1,2].map(j=>'<tspan'+(j<st?' class="on"':'')+'>★</tspan>').join('')+'</text>':'')+'<text class="wt" y="'+(done?50:42)+'">'+L.n+'</text></g>';}
$('wm_dyn').innerHTML=s;}
// the card under the map for the selected level: description, mechanic, stars or progress, Play/Continue and (once won) Endless
function lvCard(){const di=MENU.df,D=DIFS[di],p=PROG[D.k],here=di===DFN,i=MENU.ls,L=LEVELS[i],cur=here&&i==LVN&&!INF,lock=i>p.n&&!(here&&i==LVN),done=i<p.n,st=p.st[i]||0,M=MECH[L.mc];
const sv=lock||cur?null:savedRun(i,di,false),sw=cur?(inGame()?g.wave:null):sv?sv.wave:null;
let h='<span class="ln">'+(i+1)+'</span><div class="lt"><b>'+L.n+(done?' '+(st?starH(st):'✓'):'')+'</b><small>'+(lock?'🔒 Win '+LEVELS[i-1].n+' on '+D.n+' to unlock':L.d)+'</small>'+(M?'<span class="lm">'+M.ic+' <em>'+M.n+':</em> '+M.d+'</span>':'')+
'<small class="lsz">'+L.w+'×'+L.h+' board'+(sw!=null?' · run in progress, '+(sw?'wave '+sw+' of '+MAXW+' cleared':'not started'):'')+(done&&!st?' · won before stars were counted':'')+'</small></div><div class="lca">'+
'<button class="btn go" id="lc_go"'+(lock?' disabled':'')+'><span class="t">'+(lock?'Locked':sw!=null?'Continue':'Play')+'</span></button>';
let es=null,hb=0,ec=false;if(done){ec=here&&i==LVN&&INF;es=ec?(inGame()?g.wave:null):(()=>{const v=savedRun(i,di,true);return v?v.wave:null;})();hb=BEST[D.k][i]||0;
h+='<button class="lve'+(ec?' cur':'')+'" id="lc_inf" title="Endless mode on '+D.n+': the waves never stop – how long can you hold?'+(hb?' Best: '+hb+' waves survived.':'')+(es!=null?' Run in progress, '+(es?'wave '+es+' cleared':'not started')+'.':'')+'"><b>∞</b><small>'+(hb?'best '+hb:'Endless')+'</small></button>';}
const c=$('m_card');c.innerHTML=h+'</div>';if(!lock)$('lc_go').onclick=()=>goLevel(i,di);if(done)$('lc_inf').onclick=()=>goLevel(i,di,true);}
function lvPick(i,go){const p=PROG[DIFS[MENU.df].k],lock=i>p.n&&!(MENU.df===DFN&&i==LVN);if(go&&i===MENU.ls&&!lock){goLevel(i,MENU.df);return;}if(i===MENU.ls)return;MENU.ls=i;snd('click');for(const e of document.querySelectorAll('#wm_dyn .wnd'))e.classList.toggle('sel',+e.dataset.i===i);lvCard();wCenter(true);}
function mLevels(){const di=MENU.df,D=DIFS[di],p=PROG[D.k],here=di===DFN,N=Math.min(LEVELS.length,WMP.length),el=$('m_lvls');
$('m_df').innerHTML=DIFS.map((d,j)=>'<button class="dfb'+(j==di?' on':'')+'" data-d="'+j+'">'+d.n+'</button>').join('');$('m_dd').textContent=dTxt(D);
if(!el.firstChild)el.innerHTML='<div class="wmap"><svg class="wm" viewBox="0 0 1000 620">'+wMap()+'</svg></div><div class="lvb lvc" id="m_card"></div>';
const un=i=>i<=p.n||here&&i==LVN;if(MENU.ls==null||MENU.ls>=N||!un(MENU.ls))MENU.ls=here?LVN:Math.min(p.n,N-1);
wDyn();lvCard();$('m_st').textContent=starT(D);
requestAnimationFrame(()=>wCenter(false));}
// on a phone the map scrolls sideways: keep the selected node in the middle
function wCenter(sm){const w=document.querySelector('.wmap');if(w&&w.scrollWidth>w.clientWidth)w.scrollTo({left:WMP[MENU.ls][0]/1000*w.scrollWidth-w.clientWidth/2,behavior:sm?'smooth':'auto'});}
$('m_lvls').onclick=e=>{const n=e.target.closest&&e.target.closest('[data-i]');if(n)lvPick(+n.dataset.i);};
$('m_lvls').ondblclick=e=>{const n=e.target.closest&&e.target.closest('[data-i]');if(n)lvPick(+n.dataset.i,true);};
$('m_lvls').onkeydown=e=>{const n=e.target.closest&&e.target.closest('[data-i]');if(n&&(e.key=='Enter'||e.key==' ')){e.preventDefault();lvPick(+n.dataset.i,true);}};
$('m_df').onclick=e=>{const b=e.target.closest&&e.target.closest('[data-d]');if(b&&+b.dataset.d!==MENU.df){MENU.df=+b.dataset.d;snd('click');mLevels();}};
// Royal Armoury: stars buy perk ranks (PERKS/PK in js/09-game.js), saved in localStorage sfperk as {id: ranks}. Stars = every star in PROG on every difficulty
// (a win on a harder difficulty is also counted on the easier ones, so it pays more); spent = the cost of every rank owned. Reset refunds them all.
try{const d=JSON.parse(localStorage.getItem('sfperk'));if(d)for(const p of PERKS)if(d[p.id])PK[p.id]=clamp(d[p.id]|0,0,p.mx);}catch(e){}
const pkSave=()=>{try{localStorage.setItem('sfperk',JSON.stringify(PK));}catch(e){}},starsAll=()=>DIFS.reduce((a,d)=>a+PROG[d.k].st.reduce((x,y)=>x+(y|0),0),0),
starsSpent=()=>PERKS.reduce((a,p)=>a+p.c.slice(0,pk(p.id)).reduce((x,y)=>x+y,0),0),pkTxt=(p,r)=>{const v=r*p.v;return p.id=='gold'?'+'+v+' gold':p.id=='wall'?'+'+v+' '+(v==1?'life':'lives'):(p.id=='smith'?'−':'+')+Math.round(v*100)+'%';};
function mArm(){const tot=starsAll(),av=tot-starsSpent(),sp=tot-av;
setH($('m_an'),'<span class="ast">★ '+av+'</span> to spend · '+tot+' earned ('+DIFS.map(d=>d.n+' '+PROG[d.k].st.reduce((x,y)=>x+(y|0),0)).join(' · ')+'). Stars won on a harder difficulty count on the easier ones too. Gold and lives perks apply from the next level you start.');
const el=$('m_al');el.innerHTML='';for(const p of PERKS){const r=pk(p.id),mx=r>=p.mx,c=p.c[r],d=document.createElement('div');d.className='prk'+(r?' own':'');
d.innerHTML='<span class="pic">'+p.ic+'</span><span class="pt"><b>'+p.n+'</b><small>'+p.d+(p.mx>1?' per rank':'')+'.</small><span class="pip">'+Array.from({length:p.mx},(_,i)=>'<i'+(i<r?' class="on"':'')+'></i>').join('')+(r?'<em>'+pkTxt(p,r)+'</em>':'')+'</span></span>'+
'<button class="btn pby"'+(mx||av<c?' disabled':'')+'>'+(mx?'Max':'★ '+c)+'</button>';
d.lastChild.onclick=()=>{if(mx||starsAll()-starsSpent()<c)return;PK[p.id]=r+1;pkSave();ach('perk');snd('coin');mArm();ui();};el.appendChild(d);}
const rb=$('m_ar');rb.disabled=!sp;rb.classList.remove('warn');rb.textContent=sp?'Reset perks (refund ★ '+sp+')':'Reset perks';}
$('m_ar').onclick=()=>{const b=$('m_ar');if(b.classList.contains('warn')){for(const k in PK)delete PK[k];pkSave();snd('click');mArm();ui();}else{b.classList.add('warn');b.textContent='Refund every perk? Click again';}};
// a level picked in the menu starts right after the reload
function menuStart(){let go=false;try{go=sessionStorage.getItem('sfgo')=='1';sessionStorage.removeItem('sfgo');}catch(e){}if(go){MENU.open=false;$('menu').style.display='none';}else menuOpen();}
$('lvl').textContent='Level '+(LVN+1)+' · '+LV.n+' · '+DF.n+(INF?' · Endless':'');
const inGame=()=>!g.over&&(g.wave>0||g.tw.length>0);
// saved run: during each break between waves (never mid-wave) the run is kept in localStorage sfrun<level index><difficulty letter: none for Easy, n, h><e for Endless> (runK), so a refresh or Quit resumes it
// from the start of the next wave. Win and defeat delete it; so does Restart level. Picking a level with a saved run (level list, Next level) resumes it.
const runK=(i,di,inf)=>'sfrun'+i+(di?DIFS[di].k[0]:'')+(inf?'e':''),RUNK=runK(LVN,DFN,INF);let runS='';
function savedRun(i,di=DFN,inf=INF){try{const d=JSON.parse(localStorage.getItem(runK(i,di,inf)));return d&&d.v===1&&d.wave>=0&&(inf||d.wave<MAXW)&&d.lives>0&&Array.isArray(d.tw)?d:null;}catch(e){return null;}}
function saveRun(){if(g.over){if(runS!==null){runS=null;try{localStorage.removeItem(RUNK);}catch(e){}}return;}
if(g.run||!(g.wave>0||g.tw.length))return;const s=JSON.stringify({v:1,gold:g.gold,lives:g.lives,rep:g.rep,wave:g.wave,spd:g.spd,tw:g.tw.map(t=>[t.k,t.c,t.r,t.l,t.inv,t.tm||null,t.bw===g.wave?1:0,t.br!=null?t.br:null,t.rp?[t.rp.x,t.rp.y]:null]),hero:g.hero?[g.hero.lv,g.hero.xp,g.hero.tx,g.hero.ty]:null,sp:[...g.scd],...(g.fire.length?{fire:g.fire.map(f=>[f.c,f.r,Math.ceil(f.t)])}:{})});
if(s===runS)return;runS=s;try{localStorage.setItem(RUNK,s);}catch(e){}}
function loadRun(){const d=savedRun(LVN);if(!d||inGame())return;g.gold=Math.max(0,+d.gold||0);g.lives=Math.min(maxL(),d.lives);g.rep=Math.max(0,d.rep|0);g.wave=d.wave|0;g.spd=[1,2,3].includes(d.spd)?d.spd:1;
for(const[k,c,r,l,inv,tm,nu,br,rp]of d.tw)if(T[k]&&free(c,r)){const t=addTw(k,c,r,clamp(l|0,1,3),+inv||T[k].c,BRN[k]&&BRN[k][br]?br:null);if(TGM[tm])t.tm=tm;if(nu)t.bw=g.wave;if(t.rp&&Array.isArray(rp))setRally(t,+rp[0],+rp[1]);}
// the hero keeps his level, xp and post between waves
if(Array.isArray(d.hero)&&g.hero){const h=g.hero,[lv,xp,x,y]=d.hero;h.lv=clamp(lv|0,1,HERO.mx);h.xp=Math.max(0,+xp||0);if(onB(Math.floor(x/S),Math.floor(y/S))){h.x=h.tx=+x;h.y=h.ty=+y;}h.hp=h.max=hst(h).hp;}
// spell cooldowns in waves (optional field: older saves have every spell ready)
if(Array.isArray(d.sp))for(let i=0;i<3;i++)g.scd[i]=Math.max(0,d.sp[i]|0);
// Emberwood: cells still burning in the break (whole seconds left; they no longer spread)
if(LV.mc=='fire'&&Array.isArray(d.fire))for(const[c,r,t]of d.fire)if(free(c,r)&&+t>0)ignite(c,r,Math.min(+t,MECH.fire.bt),0);
// Ashfall: a run past the collapse wave has the shortcut open
if(LV.ru&&g.wave>=LV.ru.w)ruinOpen(true,true);ui();}
function restartLevel(){try{localStorage.removeItem(RUNK);}catch(e){}runS='';reset();menuClose();}
function mPage(p){MENU.pg=p;document.querySelector('.mbox').classList.toggle('wide',p=='levels');for(const k of['main','levels','armoury','achievements','bestiary','settings','changelog','bye'])$('m_'+k).style.display=k==p?'flex':'none';if(p=='settings')mOpts();if(p=='changelog')mLog();if(p=='levels')mLevels();if(p=='armoury')mArm();if(p=='achievements')mAch();if(p=='bestiary')mBest();$('m_play').querySelector('.t').textContent=inGame()?'Continue':'Play';
$('m_sub').textContent=p=='bye'?'':'Level '+(LVN+1)+' · '+LV.n+' · '+DF.n+(INF?' · Endless':'')+(inGame()?' · '+(g.run?'paused on wave '+g.wave+(INF?'':' of '+MAXW):g.wave?'wave '+g.wave+(INF?'':' of '+MAXW)+' cleared':'getting ready'):'');
const rs=$('m_rs');rs.style.display=inGame()?'':'none';rs.textContent='Restart level';rs.classList.remove('warn');}
function menuOpen(){MENU.open=true;g.sel=null;selRng();ui();$('menu').style.display='flex';mPage('main');$('m_play').focus();}
function menuClose(){MENU.open=false;$('menu').style.display='none';}
// bestiary: every enemy type in BST order; ones met so far (SEEN) with portrait, description and facts, the rest as a dark silhouette. Portraits are rendered one per tick so the page opens at once
function mBest(){const el=$('m_bl'),n=BSK.filter(t=>SEEN[t]).length;$('m_bn').textContent=n+' of '+BSK.length+' enemies met'+(n<BSK.length?' – the rest are still out there.':'. You’ve seen them all!');el.innerHTML='';
const q=[];for(const t of BSK){const s=SEEN[t],d=document.createElement('div');d.className='bst'+(s?'':' no');
d.innerHTML='<img alt="">'+'<div class="bt"><b>'+(s?BST[t][0]:'???')+'</b><p>'+(s?BST[t][1]:'Not met yet.')+'</p>'+(s?'<div class="chips">'+foeChips(t)+'</div><small>First met: '+(LEVELS[s[0]-1]?LEVELS[s[0]-1].n:'?')+', wave '+s[1]+'</small>':'')+'</div>';el.appendChild(d);q.push([d.firstChild,t]);}
const step=()=>{const j=q.shift();if(!j||MENU.pg!='bestiary')return;j[0].src=portrait(j[1]);setTimeout(step,0);};setTimeout(step,0);}
// settings: [label, current value, toggle]; music/sound reuse the HUD buttons so both stay in sync
const OPTS=[['Auto-start waves',()=>OPT.auto,()=>optSet('auto')],['Screen shake',()=>OPT.shake,()=>optSet('shake')],['Colourblind mode',()=>OPT.cb,()=>optSet('cb')],['Music',()=>AU.on.m,()=>$('mu').onclick()],['Sound effects',()=>AU.on.s,()=>$('sf').onclick()],...(PP?[['Glow effects',()=>gq('glow'),()=>gfxSet('glow')]]:[]),...(AO?[['Ambient occlusion',()=>gq('ao'),()=>gfxSet('ao')]]:[]),['Shadows',()=>gq('shadows'),()=>gfxSet('shadows')],['High resolution',()=>gq('sharp'),()=>gfxSet('sharp')],['Auto quality',()=>GFX.auto,()=>gfxSet('auto')]];
function mOpts(){const el=$('m_opts');el.innerHTML='';for(const[n,get,flip]of OPTS){const r=document.createElement('div'),b=document.createElement('button');r.className='mopt';r.textContent=n;b.className='wb';
const lbl=()=>{b.textContent=get()?'On':'Off';b.classList.toggle('off',!get());};b.onclick=()=>{flip();mOpts();};lbl();r.appendChild(b);el.appendChild(r);}
if(AQ.off.size){const p=document.createElement('p');p.className='mnote';p.textContent='Auto quality has lowered: '+[...AQ.off].map(k=>AQN[k]).join(', ')+'. Turn one back on above to keep it.';el.appendChild(p);}}
// changelog: CHANGELOG.md fetched and turned into a list (only "## date" headings and "- " bullets are shown)
let logHTML=null;
function mdLite(t){const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(https?:\/\/[^\s)<]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
let h='',ul=false;for(const ln of t.split('\n')){const li=/^- (.*)/.exec(ln);if(li){if(!ul){h+='<ul>';ul=true;}h+='<li>'+inl(li[1])+'</li>';continue;}if(ul){h+='</ul>';ul=false;}
const hd=/^## (.*)/.exec(ln);if(hd){const d=/^\d{4}-\d\d-\d\d$/.test(hd[1].trim())?new Date(hd[1].trim()+'T12:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):hd[1];h+='<h3>'+inl(d)+'</h3>';}}
return h+(ul?'</ul>':'');}
function mLog(){const el=$('m_logtxt');if(logHTML){el.innerHTML=logHTML;return;}el.textContent='Loading…';
fetch('CHANGELOG.md',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.text();}).then(t=>{logHTML=mdLite(t);el.innerHTML=logHTML;el.scrollTop=0;})
.catch(()=>{el.innerHTML='Couldn’t load the changelog. You can read it on <a href="https://github.com/Lykhan28/slotsforsvar/blob/main/CHANGELOG.md" target="_blank" rel="noopener">GitHub</a>.';});}
// Quit: leave the game (a run saved between waves is kept and comes back with Back to the menu or the next visit), try to close the tab (browsers only allow that for tabs a script opened), otherwise stop and say goodbye
function menuQuit(){reset();MENU.quit=true;if(AU.m)AU.m.gain.setTargetAtTime(0,AU.ctx.currentTime,.05);mPage('bye');window.close();}
function menuBack(){MENU.quit=false;loadRun();if(AU.m)AU.m.gain.setTargetAtTime(.9,AU.ctx.currentTime,.05);mPage('main');last=performance.now();requestAnimationFrame(loop);}
$('m_play').onclick=()=>{if(g.over)reset();menuClose();};
// Restart level asks for a second click, so a misclick doesn't throw the run away
$('m_rs').onclick=()=>{const b=$('m_rs');if(b.classList.contains('warn'))restartLevel();else{b.classList.add('warn');b.textContent='Lose this run? Click again';}};
$('m_lv').onclick=()=>mPage('levels');$('m_arm').onclick=()=>mPage('armoury');$('m_bst').onclick=()=>mPage('bestiary');$('m_set').onclick=()=>mPage('settings');$('m_log').onclick=()=>mPage('changelog');$('m_quit').onclick=menuQuit;$('m_back').onclick=menuBack;
document.querySelectorAll('#menu [data-back]').forEach(b=>b.onclick=()=>mPage('main'));
$('mn').onclick=menuOpen;
// while the menu is open, game hotkeys are off; Esc goes back a page or resumes a game in progress
addEventListener('keydown',e=>{if(!MENU.open)return;e.stopImmediatePropagation();auInit();if(e.key!='Escape'||e.repeat)return;
if(MENU.pg=='settings'||MENU.pg=='changelog'||MENU.pg=='levels'||MENU.pg=='bestiary')mPage('main');else if(MENU.pg=='main'&&inGame())menuClose();},true);

gfxApply();cbApply();
