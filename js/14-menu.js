// ---------- main menu ----------
// open: the game is paused behind the menu. quit: render loop stopped and sound muted until "Back to the menu"
const MENU={open:true,quit:false,pg:'main'};
const GFX={glow:true,shadows:true,sharp:true,ao:!LOWQ};
try{Object.assign(GFX,JSON.parse(localStorage.getItem('sfgfx')||'{}'));}catch(e){}
function gfxApply(){if(bloom)bloom.enabled=GFX.glow;if(AO)AO.pass.enabled=GFX.ao;sun.castShadow=GFX.shadows;R.setPixelRatio(GFX.sharp?Math.min(devicePixelRatio,PP?1.75:2):1);resize();}
// gameplay settings (localStorage sfopt): auto-start = the next wave starts by itself when the break countdown runs out
const OPT={auto:false};try{Object.assign(OPT,JSON.parse(localStorage.getItem('sfopt')||'{}'));}catch(e){}autoW=!!OPT.auto;
function optSet(k){OPT[k]=!OPT[k];try{localStorage.setItem('sfopt',JSON.stringify(OPT));}catch(e){}autoW=!!OPT.auto;ui();}
function gfxSet(k){GFX[k]=!GFX[k];try{localStorage.setItem('sfgfx',JSON.stringify(GFX));}catch(e){}gfxApply();}
// levels: PROG = how many levels have been won (level i is unlocked when i <= PROG). Switching level reloads the page, because the whole scene is built once at load (js/01-config.js picks LVN)
let PROG=0;try{PROG=+localStorage.getItem('sfprog')||0;}catch(e){}
function lvWon(){if(LVN+1>PROG){PROG=LVN+1;try{localStorage.setItem('sfprog',PROG);}catch(e){}}}
function goLevel(i){if(i===LVN){if(g.over)reset();menuClose();return;}let ok=true;try{localStorage.setItem('sflv',i+1);sessionStorage.setItem('sfgo','1');}catch(e){ok=false;}location.href=location.pathname+(ok?'':'?level='+(i+1));}
function mLevels(){const el=$('m_lvls');el.innerHTML='';LEVELS.forEach((L,i)=>{const b=document.createElement('button'),lock=i>PROG&&i!=LVN,done=i<PROG;b.className='lvb'+(i==LVN?' cur':'')+(lock?' lock':'');b.disabled=lock;
const sv=lock||i==LVN?null:savedRun(i),sw=i==LVN?(inGame()?g.wave:null):sv?sv.wave:null;
b.innerHTML='<span class="ln">'+(i+1)+'</span><span class="lt"><b>'+L.n+'</b><small>'+(lock?'Win '+LEVELS[i-1].n+' to unlock':sw!=null?'Run in progress · '+(sw?'wave '+sw+' of '+MAXW+' cleared':'not started'):L.d)+'</small></span><span class="lx">'+(done?'✓':lock?'🔒':'')+'<small>'+L.w+'×'+L.h+'</small></span>';b.onclick=()=>goLevel(i);el.appendChild(b);});
const c=el.querySelector('.cur');if(c)c.scrollIntoView({block:'nearest'});}
// a level picked in the menu starts right after the reload
function menuStart(){let go=false;try{go=sessionStorage.getItem('sfgo')=='1';sessionStorage.removeItem('sfgo');}catch(e){}if(go){MENU.open=false;$('menu').style.display='none';}else menuOpen();}
$('lvl').textContent='Level '+(LVN+1)+' · '+LV.n;
const inGame=()=>!g.over&&(g.wave>0||g.tw.length>0);
// saved run: during each break between waves (never mid-wave) the run is kept in localStorage sfrun<level index>, so a refresh or Quit resumes it
// from the start of the next wave. Win and defeat delete it; so does Restart level. Picking a level with a saved run (level list, Next level) resumes it.
const RUNK='sfrun'+LVN;let runS='';
function savedRun(i){try{const d=JSON.parse(localStorage.getItem('sfrun'+i));return d&&d.v===1&&d.wave>=0&&d.wave<MAXW&&d.lives>0&&Array.isArray(d.tw)?d:null;}catch(e){return null;}}
function saveRun(){if(g.over){if(runS!==null){runS=null;try{localStorage.removeItem(RUNK);}catch(e){}}return;}
if(g.run||!(g.wave>0||g.tw.length))return;const s=JSON.stringify({v:1,gold:g.gold,lives:g.lives,rep:g.rep,wave:g.wave,spd:g.spd,tw:g.tw.map(t=>[t.k,t.c,t.r,t.l,t.inv,t.tm||null,t.bw===g.wave?1:0,t.br!=null?t.br:null,t.rp?[t.rp.x,t.rp.y]:null]),hero:g.hero?[g.hero.lv,g.hero.xp,g.hero.tx,g.hero.ty]:null});
if(s===runS)return;runS=s;try{localStorage.setItem(RUNK,s);}catch(e){}}
function loadRun(){const d=savedRun(LVN);if(!d||inGame())return;g.gold=Math.max(0,+d.gold||0);g.lives=Math.min(20,d.lives);g.rep=Math.max(0,d.rep|0);g.wave=d.wave|0;g.spd=[1,2,3].includes(d.spd)?d.spd:1;
for(const[k,c,r,l,inv,tm,nu,br,rp]of d.tw)if(T[k]&&free(c,r)){const t=addTw(k,c,r,clamp(l|0,1,3),+inv||T[k].c,BRN[k]&&BRN[k][br]?br:null);if(TGM[tm])t.tm=tm;if(nu)t.bw=g.wave;if(t.rp&&Array.isArray(rp))setRally(t,+rp[0],+rp[1]);}
// the hero keeps his level, xp and post between waves
if(Array.isArray(d.hero)&&g.hero){const h=g.hero,[lv,xp,x,y]=d.hero;h.lv=clamp(lv|0,1,HERO.mx);h.xp=Math.max(0,+xp||0);if(onB(Math.floor(x/S),Math.floor(y/S))){h.x=h.tx=+x;h.y=h.ty=+y;}h.hp=h.max=hst(h).hp;}ui();}
function restartLevel(){try{localStorage.removeItem(RUNK);}catch(e){}runS='';reset();menuClose();}
function mPage(p){MENU.pg=p;for(const k of['main','levels','bestiary','settings','changelog','bye'])$('m_'+k).style.display=k==p?'flex':'none';if(p=='settings')mOpts();if(p=='changelog')mLog();if(p=='levels')mLevels();if(p=='bestiary')mBest();$('m_play').querySelector('.t').textContent=inGame()?'Continue':'Play';
$('m_sub').textContent=p=='bye'?'':'Level '+(LVN+1)+' · '+LV.n+(inGame()?' · '+(g.run?'paused on wave '+g.wave+' of '+MAXW:g.wave?'wave '+g.wave+' of '+MAXW+' cleared':'getting ready'):'');
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
