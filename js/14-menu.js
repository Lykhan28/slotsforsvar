// ---------- main menu ----------
// open: the game is paused behind the menu. quit: render loop stopped and sound muted until "Back to the menu"
const MENU={open:true,quit:false,pg:'main'};
const GFX={glow:true,shadows:true,sharp:true};
try{Object.assign(GFX,JSON.parse(localStorage.getItem('sfgfx')||'{}'));}catch(e){}
function gfxApply(){if(bloom)bloom.enabled=GFX.glow;sun.castShadow=GFX.shadows;R.setPixelRatio(GFX.sharp?Math.min(devicePixelRatio,PP?1.75:2):1);resize();}
function gfxSet(k){GFX[k]=!GFX[k];try{localStorage.setItem('sfgfx',JSON.stringify(GFX));}catch(e){}gfxApply();}
// levels: PROG = how many levels have been won (level i is unlocked when i <= PROG). Switching level reloads the page, because the whole scene is built once at load (js/01-config.js picks LVN)
let PROG=0;try{PROG=+localStorage.getItem('sfprog')||0;}catch(e){}
function lvWon(){if(LVN+1>PROG){PROG=LVN+1;try{localStorage.setItem('sfprog',PROG);}catch(e){}}}
function goLevel(i){if(i===LVN){reset();menuClose();return;}let ok=true;try{localStorage.setItem('sflv',i+1);sessionStorage.setItem('sfgo','1');}catch(e){ok=false;}location.href=location.pathname+(ok?'':'?level='+(i+1));}
function mLevels(){const el=$('m_lvls');el.innerHTML='';LEVELS.forEach((L,i)=>{const b=document.createElement('button'),lock=i>PROG&&i!=LVN,done=i<PROG;b.className='lvb'+(i==LVN?' cur':'')+(lock?' lock':'');b.disabled=lock;
b.innerHTML='<span class="ln">'+(i+1)+'</span><span class="lt"><b>'+L.n+'</b><small>'+(lock?'Win '+LEVELS[i-1].n+' to unlock':L.d)+'</small></span><span class="lx">'+(done?'✓':lock?'🔒':'')+'<small>'+L.w+'×'+L.h+'</small></span>';b.onclick=()=>goLevel(i);el.appendChild(b);});
const c=el.querySelector('.cur');if(c)c.scrollIntoView({block:'nearest'});}
// a level picked in the menu starts right after the reload
function menuStart(){let go=false;try{go=sessionStorage.getItem('sfgo')=='1';sessionStorage.removeItem('sfgo');}catch(e){}if(go){MENU.open=false;$('menu').style.display='none';}else menuOpen();}
$('lvl').textContent='Level '+(LVN+1)+' · '+LV.n;
const inGame=()=>!g.over&&(g.wave>0||g.tw.length>0);
function mPage(p){MENU.pg=p;for(const k of['main','levels','settings','changelog','bye'])$('m_'+k).style.display=k==p?'flex':'none';if(p=='settings')mOpts();if(p=='changelog')mLog();if(p=='levels')mLevels();$('m_play').querySelector('.t').textContent=inGame()?'Continue':'Play';
$('m_sub').textContent=p=='bye'?'':'Level '+(LVN+1)+' · '+LV.n+(inGame()?' · paused on wave '+g.wave+' of '+MAXW:'');}
function menuOpen(){MENU.open=true;g.sel=null;selRng();ui();$('menu').style.display='flex';mPage('main');$('m_play').focus();}
function menuClose(){MENU.open=false;$('menu').style.display='none';}
// settings: [label, current value, toggle]; music/sound reuse the HUD buttons so both stay in sync
const OPTS=[['Music',()=>AU.on.m,()=>$('mu').onclick()],['Sound effects',()=>AU.on.s,()=>$('sf').onclick()],...(PP?[['Glow effects',()=>GFX.glow,()=>gfxSet('glow')]]:[]),['Shadows',()=>GFX.shadows,()=>gfxSet('shadows')],['High resolution',()=>GFX.sharp,()=>gfxSet('sharp')]];
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
// Quit: abandon the game, try to close the tab (browsers only allow that for tabs a script opened), otherwise stop and say goodbye
function menuQuit(){reset();MENU.quit=true;if(AU.m)AU.m.gain.setTargetAtTime(0,AU.ctx.currentTime,.05);mPage('bye');window.close();}
function menuBack(){MENU.quit=false;if(AU.m)AU.m.gain.setTargetAtTime(.9,AU.ctx.currentTime,.05);mPage('main');last=performance.now();requestAnimationFrame(loop);}
$('m_play').onclick=()=>{if(g.over)reset();menuClose();};
$('m_lv').onclick=()=>mPage('levels');$('m_set').onclick=()=>mPage('settings');$('m_log').onclick=()=>mPage('changelog');$('m_quit').onclick=menuQuit;$('m_back').onclick=menuBack;
document.querySelectorAll('#menu [data-back]').forEach(b=>b.onclick=()=>mPage('main'));
$('mn').onclick=menuOpen;
// while the menu is open, game hotkeys are off; Esc goes back a page or resumes a game in progress
addEventListener('keydown',e=>{if(!MENU.open)return;e.stopImmediatePropagation();auInit();if(e.key!='Escape'||e.repeat)return;
if(MENU.pg=='settings'||MENU.pg=='changelog'||MENU.pg=='levels')mPage('main');else if(MENU.pg=='main'&&inGame())menuClose();},true);
gfxApply();
