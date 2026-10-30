// ---------- main menu ----------
// open: the game is paused behind the menu. quit: render loop stopped and sound muted until "Back to the menu"
const MENU={open:true,quit:false,pg:'main',df:DFN};
const GFX={glow:true,shadows:true,sharp:true,ao:!LOWQ};
try{Object.assign(GFX,JSON.parse(localStorage.getItem('sfgfx')||'{}'));}catch(e){}
function gfxApply(){if(bloom)bloom.enabled=GFX.glow;if(AO)AO.pass.enabled=GFX.ao;sun.castShadow=GFX.shadows;R.setPixelRatio(GFX.sharp?Math.min(devicePixelRatio,PP?1.75:2):1);resize();}
// gameplay settings (localStorage sfopt): auto-start = the next wave starts by itself when the break countdown runs out
const OPT={auto:false};try{Object.assign(OPT,JSON.parse(localStorage.getItem('sfopt')||'{}'));}catch(e){}autoW=!!OPT.auto;
function optSet(k){OPT[k]=!OPT[k];try{localStorage.setItem('sfopt',JSON.stringify(OPT));}catch(e){}autoW=!!OPT.auto;ui();}
function gfxSet(k){GFX[k]=!GFX[k];try{localStorage.setItem('sfgfx',JSON.stringify(GFX));}catch(e){}gfxApply();}
// levels and stars, tracked per difficulty (DIFS in js/01-config.js): PROG[k] = {n: levels won (level i is unlocked when i <= n), st: best stars per level (0 = won before stars existed)}.
// Saved in localStorage sfprog as {easy:{n,st},normal:…,hard:…}; older saves ({n,st} or a bare number) were played like Easy. A win also counts on every easier difficulty (lvWon).
// Switching level or difficulty reloads the page, because the whole scene is built once at load (js/01-config.js picks LVN and DFN)
// stars for a win by lives left, relative to the difficulty's lives (STAR): 90%+ = 3, 50%+ = 2, any win = 1 – Easy 18/10, Normal 14/8, Hard 9/5. lvWon() puts this win's stars in g.stN and the earlier best in g.stB (end screen)
const STAR=d=>[Math.ceil(d.li*.9),Math.ceil(d.li*.5)],stars=l=>{const s=STAR(DF);return l>=s[0]?3:l>=s[1]?2:1;},starH=n=>'<span class="stars">'+[0,1,2].map(i=>'<i'+(i<n?' class="on"':'')+'>★</i>').join('')+'</span>',starT=d=>{const s=STAR(d);return'★★★ '+s[0]+'+ lives left · ★★ '+s[1]+'+ · ★ any win';};
const PROG={};for(const d of DIFS)PROG[d.k]={n:0,st:[]};
try{let d=JSON.parse(localStorage.getItem('sfprog'));if(typeof d=='number')d={easy:{n:d}};else if(d&&'n' in d)d={easy:d};if(d)for(const k in PROG)if(d[k]){PROG[k].n=d[k].n|0;if(Array.isArray(d[k].st))PROG[k].st=d[k].st.map(x=>Math.min(3,Math.max(0,x|0)));}}catch(e){}
function lvWon(){g.stB=PROG[DF.k].st[LVN]||0;g.stN=stars(g.lives);for(let i=0;i<=DFN;i++){const p=PROG[DIFS[i].k];p.n=Math.max(p.n,LVN+1);p.st[LVN]=Math.max(p.st[LVN]||0,g.stN);}try{localStorage.setItem('sfprog',JSON.stringify(PROG));}catch(e){}}
// Endless mode (INF in js/09-game.js) is picked at load like the level and difficulty (?endless=1, else localStorage sfmode), and only for a level already won on this difficulty.
// Its highscore BEST[difficulty key][level] = most waves survived, saved in localStorage sfbest by infRec() at the end of every endless wave (g.rec = this run set a new one)
try{INF=(new URLSearchParams(location.search).get('endless')=='1'||localStorage.getItem('sfmode')=='endless')&&PROG[DF.k].n>LVN;}catch(e){}
const BEST={};for(const d of DIFS)BEST[d.k]=[];try{const d=JSON.parse(localStorage.getItem('sfbest'));if(d)for(const k in BEST)if(Array.isArray(d[k]))BEST[k]=d[k].map(x=>Math.max(0,x|0));}catch(e){}
function infRec(){const b=BEST[DF.k];if(g.wave<=(b[LVN]||0))return;b[LVN]=g.wave;g.rec=true;try{localStorage.setItem('sfbest',JSON.stringify(BEST));}catch(e){}}
function goLevel(i,di=DFN,inf=false){if(i===LVN&&di===DFN&&inf===INF){if(g.over)reset();menuClose();return;}let ok=true;try{localStorage.setItem('sflv',i+1);localStorage.setItem('sfdif',DIFS[di].k);localStorage.setItem('sfmode',inf?'endless':'');sessionStorage.setItem('sfgo','1');}catch(e){ok=false;}location.href=location.pathname+(ok?'':'?level='+(i+1)+'&diff='+DIFS[di].k+(inf?'&endless=1':''));}
// level picker: difficulty tabs (MENU.df, applied when a level is clicked) above the list for that difficulty; a won level gets an Endless button (.lve) with its highscore
const dTxt=d=>d.li+' lives'+(d.hp>1?', enemies have '+Math.round((d.hp-1)*100)+'% more health':'')+(d.gold<1?', '+Math.round((1-d.gold)*100)+'% less starting gold':'')+(d.hp==1?' – the relaxed way to play':'')+'.';
function mLevels(){const di=MENU.df,D=DIFS[di],p=PROG[D.k],here=di===DFN,el=$('m_lvls');el.innerHTML='';
$('m_df').innerHTML=DIFS.map((d,j)=>'<button class="dfb'+(j==di?' on':'')+'" data-d="'+j+'">'+d.n+'</button>').join('');$('m_dd').textContent=dTxt(D);
LEVELS.forEach((L,i)=>{const rw=document.createElement('div'),b=document.createElement('button'),cur=here&&i==LVN&&!INF,lock=i>p.n&&!(here&&i==LVN),done=i<p.n,st=p.st[i]||0;rw.className='lvr';b.className='lvb'+(cur?' cur':'')+(lock?' lock':'');b.disabled=lock;
const sv=lock||cur?null:savedRun(i,di,false),sw=cur?(inGame()?g.wave:null):sv?sv.wave:null;
b.innerHTML='<span class="ln">'+(i+1)+'</span><span class="lt"><b>'+L.n+'</b><small>'+(lock?'Win '+LEVELS[i-1].n+' on '+D.n+' to unlock':sw!=null?'Run in progress · '+(sw?'wave '+sw+' of '+MAXW+' cleared':'not started'):L.d)+'</small></span><span class="lx">'+(done?(st?starH(st):'✓'):lock?'🔒':'')+'<small>'+L.w+'×'+L.h+'</small></span>';if(done)b.title=st?'Best on '+D.n+': '+st+' of 3 stars':'Won before stars were counted – win it again to earn them';b.onclick=()=>goLevel(i,di);rw.appendChild(b);
if(done){const e=document.createElement('button'),ec=here&&i==LVN&&INF,es=ec?(inGame()?g.wave:null):(()=>{const v=savedRun(i,di,true);return v?v.wave:null;})(),hb=BEST[D.k][i]||0;e.className='lve'+(ec?' cur':'');
e.innerHTML='<b>∞</b><small>'+(hb?'best '+hb:'Endless')+'</small>';e.title='Endless mode on '+D.n+': the waves never stop – how long can you hold?'+(hb?' Best: '+hb+' waves survived.':'')+(es!=null?' Run in progress, '+(es?'wave '+es+' cleared':'not started')+'.':'');e.onclick=()=>goLevel(i,di,true);rw.appendChild(e);}
el.appendChild(rw);});
$('m_st').textContent=starT(D);const c=el.querySelector('.cur');if(c)c.scrollIntoView({block:'nearest'});}
$('m_df').onclick=e=>{const b=e.target.closest&&e.target.closest('[data-d]');if(b&&+b.dataset.d!==MENU.df){MENU.df=+b.dataset.d;snd('click');mLevels();}};
// a level picked in the menu starts right after the reload
function menuStart(){let go=false;try{go=sessionStorage.getItem('sfgo')=='1';sessionStorage.removeItem('sfgo');}catch(e){}if(go){MENU.open=false;$('menu').style.display='none';}else menuOpen();}
$('lvl').textContent='Level '+(LVN+1)+' · '+LV.n+' · '+DF.n+(INF?' · Endless':'');
const inGame=()=>!g.over&&(g.wave>0||g.tw.length>0);
// saved run: during each break between waves (never mid-wave) the run is kept in localStorage sfrun<level index><difficulty letter: none for Easy, n, h><e for Endless> (runK), so a refresh or Quit resumes it
// from the start of the next wave. Win and defeat delete it; so does Restart level. Picking a level with a saved run (level list, Next level) resumes it.
const runK=(i,di,inf)=>'sfrun'+i+(di?DIFS[di].k[0]:'')+(inf?'e':''),RUNK=runK(LVN,DFN,INF);let runS='';
function savedRun(i,di=DFN,inf=INF){try{const d=JSON.parse(localStorage.getItem(runK(i,di,inf)));return d&&d.v===1&&d.wave>=0&&(inf||d.wave<MAXW)&&d.lives>0&&Array.isArray(d.tw)?d:null;}catch(e){return null;}}
function saveRun(){if(g.over){if(runS!==null){runS=null;try{localStorage.removeItem(RUNK);}catch(e){}}return;}
if(g.run||!(g.wave>0||g.tw.length))return;const s=JSON.stringify({v:1,gold:g.gold,lives:g.lives,rep:g.rep,wave:g.wave,spd:g.spd,tw:g.tw.map(t=>[t.k,t.c,t.r,t.l,t.inv,t.tm||null,t.bw===g.wave?1:0,t.br!=null?t.br:null,t.rp?[t.rp.x,t.rp.y]:null]),hero:g.hero?[g.hero.lv,g.hero.xp,g.hero.tx,g.hero.ty]:null});
if(s===runS)return;runS=s;try{localStorage.setItem(RUNK,s);}catch(e){}}
function loadRun(){const d=savedRun(LVN);if(!d||inGame())return;g.gold=Math.max(0,+d.gold||0);g.lives=Math.min(DF.li,d.lives);g.rep=Math.max(0,d.rep|0);g.wave=d.wave|0;g.spd=[1,2,3].includes(d.spd)?d.spd:1;
for(const[k,c,r,l,inv,tm,nu,br,rp]of d.tw)if(T[k]&&free(c,r)){const t=addTw(k,c,r,clamp(l|0,1,3),+inv||T[k].c,BRN[k]&&BRN[k][br]?br:null);if(TGM[tm])t.tm=tm;if(nu)t.bw=g.wave;if(t.rp&&Array.isArray(rp))setRally(t,+rp[0],+rp[1]);}
// the hero keeps his level, xp and post between waves
if(Array.isArray(d.hero)&&g.hero){const h=g.hero,[lv,xp,x,y]=d.hero;h.lv=clamp(lv|0,1,HERO.mx);h.xp=Math.max(0,+xp||0);if(onB(Math.floor(x/S),Math.floor(y/S))){h.x=h.tx=+x;h.y=h.ty=+y;}h.hp=h.max=hst(h).hp;}ui();}
function restartLevel(){try{localStorage.removeItem(RUNK);}catch(e){}runS='';reset();menuClose();}
function mPage(p){MENU.pg=p;for(const k of['main','levels','bestiary','settings','changelog','bye'])$('m_'+k).style.display=k==p?'flex':'none';if(p=='settings')mOpts();if(p=='changelog')mLog();if(p=='levels')mLevels();if(p=='bestiary')mBest();$('m_play').querySelector('.t').textContent=inGame()?'Continue':'Play';
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
const OPTS=[['Auto-start waves',()=>OPT.auto,()=>optSet('auto')],['Music',()=>AU.on.m,()=>$('mu').onclick()],['Sound effects',()=>AU.on.s,()=>$('sf').onclick()],...(PP?[['Glow effects',()=>GFX.glow,()=>gfxSet('glow')]]:[]),...(AO?[['Ambient occlusion',()=>GFX.ao,()=>gfxSet('ao')]]:[]),['Shadows',()=>GFX.shadows,()=>gfxSet('shadows')],['High resolution',()=>GFX.sharp,()=>gfxSet('sharp')]];
function mOpts(){const el=$('m_opts');el.innerHTML='';for(const[n,get,flip]of OPTS){const r=document.createElement('div'),b=document.createElement('button');r.className='mopt';r.textContent=n;b.className='wb';
const lbl=()=>{b.textContent=get()?'On':'Off';b.classList.toggle('off',!get());};b.onclick=()=>{flip();lbl();};lbl();r.appendChild(b);el.appendChild(r);}}
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
$('m_lv').onclick=()=>mPage('levels');$('m_bst').onclick=()=>mPage('bestiary');$('m_set').onclick=()=>mPage('settings');$('m_log').onclick=()=>mPage('changelog');$('m_quit').onclick=menuQuit;$('m_back').onclick=menuBack;
document.querySelectorAll('#menu [data-back]').forEach(b=>b.onclick=()=>mPage('main'));
$('mn').onclick=menuOpen;
// while the menu is open, game hotkeys are off; Esc goes back a page or resumes a game in progress
addEventListener('keydown',e=>{if(!MENU.open)return;e.stopImmediatePropagation();auInit();if(e.key!='Escape'||e.repeat)return;
if(MENU.pg=='settings'||MENU.pg=='changelog'||MENU.pg=='levels'||MENU.pg=='bestiary')mPage('main');else if(MENU.pg=='main'&&inGame())menuClose();},true);
gfxApply();
