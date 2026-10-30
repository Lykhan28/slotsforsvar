// ---------- AUDIO (generated in code) ----------
const AU={ctx:null,on:{m:true,s:true},last:{},battle:0,step:0,next:0};
try{const sv=JSON.parse(localStorage.getItem('sfaud')||'{}');if(sv.m===false)AU.on.m=false;if(sv.s===false)AU.on.s=false;}catch(e){}
// ---------- theme music: every level theme (LV.th) plays its own variation of the one generator ----------
// A profile in MUS overrides MU0 (= Greenmeadow, the original tune): sc scale (semitones above the tonic, SCL), k key (semitones from D),
// bpm and bb (extra speed at full battle), pr chord progression (PRG: 4 triads as scale degrees, the lowest is the root; x.5 = the degree
// above lowered a semitone, the raised leading tone), ml melody (MELS, degrees: 7 = the tonic an octave up), ld lead instrument (LDI),
// lo lead transpose, pw/pl pad wave and filter, aw arp wave, ap arp pattern (APT), as calm arp step (2 eighths, 4 quarters),
// bw battle bass/stab wave, dr battle drums (DRM), dn low drone, sw swing (part of a step), rv reverb send scale.
const SCL={min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],phr:[0,1,3,5,7,8,10],maj:[0,2,4,5,7,9,11],hm:[0,2,3,5,7,8,11],pd:[0,1,4,5,7,8,10],lyd:[0,2,4,6,7,9,11],hun:[0,2,3,6,7,8,11]};
const PRG={a:[[0,2,4],[-1,1,3],[-2,0,2],[-3,-.5,1]],b:[[0,2,4],[-3,-1,1],[-2,0,2],[-4,-2,0]],c:[[0,2,4],[-4,-2,0],[0,2,4],[-1,1,3]],d:[[0,2,4],[-6,-4,-2],[0,2,4],[-1,1,3]],
e:[[0,2,4],[-2,0,2],[-4,-2,0],[-3,-.5,1]],f:[[0,2,4],[-4,-2,0],[-2,0,2],[-3,-1,1]],g:[[0,2,4],[-6,-4,-2],[-2,0,2],[-6,-4,-2]],h:[[0,2,4],[-2,0,2],[-4,-2,0],[-1,1,3]]};
const MELS=[
[[[0,7,6],[6,9,2],[8,8,4],[12,7,4]],[[0,6,6],[6,7,2],[8,8,6],[14,7,2]],[[0,5,4],[4,6,4],[8,7,6],[14,6,2]],[[0,6.5,8],[8,6,4],[12,4,4]],[[0,9,6],[6,8,2],[8,7,4],[12,6,4]],[[0,6,4],[4,7,4],[8,8,8]],[[0,7,6],[6,6,2],[8,5,4],[12,6,4]],[[0,6.5,4],[4,8,4],[8,7,8]]],
[[[0,4,8],[8,7,8]],[[0,6,12],[12,5,4]],[[0,4,8],[8,2,8]],[[0,1,16]],[[0,4,6],[6,5,2],[8,7,8]],[[0,8,12],[12,7,4]],[[0,5,8],[8,4,8]],[[0,4,16]]],
[[[0,7,2],[2,8,2],[4,9,4],[8,8,2],[10,7,2],[12,4,4]],[[0,6,2],[2,7,2],[4,8,4],[8,6,4],[12,4,4]],[[0,5,2],[2,6,2],[4,7,4],[8,9,4],[12,8,4]],[[0,7,4],[4,6,2],[6,5,2],[8,4,8]],
[[0,9,2],[2,8,2],[4,7,4],[8,8,2],[10,9,2],[12,11,4]],[[0,10,4],[4,9,4],[8,8,4],[12,7,4]],[[0,8,2],[2,7,2],[4,6,4],[8,5,4],[12,6,4]],[[0,7,8],[8,4,4],[12,7,4]]]];
const APT={up:[0,1,2,1,2,1,0,1],rock:[0,2,1,2,0,2,1,2],roll:[0,1,2,3,2,1,0,1],wide:[0,2,3,2,1,2,3,2]},AN=[0,0,12,12];
const MU0={sc:'min',k:0,bpm:92,bb:0,pr:'a',ml:0,ld:'flute',lo:0,pw:'sawtooth',pl:700,aw:'triangle',ap:'up',as:2,bw:'sawtooth',dr:'march',dn:0,sw:0,rv:1};
const MUS={meadow:{},
darkwood:{sc:'dor',k:-2,bpm:80,bb:.15,pr:'c',ml:1,ld:'horn',aw:'sine',ap:'rock',as:4,dr:'tribal',rv:1.4},
burning:{sc:'phr',k:2,bpm:100,bb:.1,pr:'d',ld:'reed',pl:900,ap:'roll',dr:'heavy',bw:'square'},
marsh:{sc:'min',k:-3,bpm:76,bb:.15,pr:'f',ml:1,ld:'pluck',aw:'sine',as:4,dn:1,dr:'tribal',rv:1.3},
ruins:{sc:'min',k:1,bpm:86,bb:.1,pr:'e',ld:'horn',pw:'triangle',ap:'wide',dr:'march'},
moor:{sc:'hm',k:-1,bpm:72,bb:.2,pr:'e',ml:1,ld:'choir',pw:'triangle',aw:'sine',as:4,dn:1,dr:'heavy',rv:1.5},
badlands:{sc:'pd',k:3,bpm:104,bb:.08,pr:'d',ld:'horn',ap:'rock',dr:'tribal',bw:'square'},
hell:{sc:'phr',k:-2,bpm:108,bb:.1,pr:'d',ml:1,ld:'choir',aw:'square',ap:'roll',dn:1,dr:'heavy',pl:500},
autumn:{sc:'maj',k:1,bpm:100,bb:.06,pr:'b',ml:2,ld:'pluck',pw:'triangle',ap:'roll',sw:.12,dr:'soft'},
coast:{sc:'dor',k:-2,bpm:104,bb:.06,pr:'c',ml:2,ld:'reed',ap:'rock',sw:.18,dr:'march'},
desert:{sc:'pd',k:2,bpm:96,bb:.1,pr:'d',ml:2,ld:'reed',ap:'wide',dr:'tribal'},
snow:{sc:'min',k:3,bpm:78,bb:.18,pr:'h',ml:1,ld:'bell',pw:'triangle',aw:'sine',as:4,dr:'march',rv:1.6},
crystal:{sc:'lyd',k:4,bpm:88,bb:.12,pr:'g',ml:1,ld:'bell',pw:'sine',pl:1200,aw:'sine',ap:'wide',dr:'soft',rv:1.8},
pass:{sc:'dor',k:1,bpm:112,bb:.06,pr:'c',ld:'horn',ap:'rock',dr:'gallop'},
storm:{sc:'hm',k:-1,bpm:116,bb:.08,pr:'e',ld:'reed',ap:'roll',dr:'gallop',bw:'square',rv:1.3},
void:{sc:'hun',k:0,bpm:84,bb:.15,pr:'a',ml:1,ld:'choir',pw:'triangle',aw:'sine',ap:'wide',as:4,dn:1,dr:'heavy',rv:1.8}};
const MP=Object.assign({},MU0,MUS[LV.th]);MP.sc=SCL[MP.sc];MP.ap=APT[MP.ap];
// scale degree → MIDI note (degree 0 = D4 + key)
const dg=n=>{if(n%1)return dg(Math.ceil(n))-1;const o=Math.floor(n/7);return 62+MP.k+12*o+MP.sc[n-o*7];};
// chords: triads lifted an octave when they start too low; root two octaves under the lowest note
const CHS=PRG[MP.pr].map(d=>{let t=d.map(dg);while(t[0]<54+MP.k)t=t.map(n=>n+12);return{r:t[0]-24,t};});
// music step length: the theme's bpm at ×1 (faster in battle by bb), a little quicker at ×2/×3 (not doubled – that sounds silly)
const msd=()=>60/(MP.bpm*(1+MP.bb*AU.battle)*(typeof g!='undefined'&&g&&!g.pause?[1,1,1.12,1.24][g.spd]||1:1))/4;
const mf=m=>440*Math.pow(2,(m-69)/12),rr=()=>1+rnd(-.07,.07),T0=()=>AU.ctx.currentTime,DS2=()=>AU.dst||AU.sfx,RV=()=>AU.rvd||AU.rv;
function voice(type,f,t,a,d,peak,lp,dest,send){const c=AU.ctx,o=c.createOscillator(),gn=c.createGain(),fl=c.createBiquadFilter();o.type=type;o.frequency.value=f;fl.type='lowpass';fl.frequency.value=lp;
gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(peak,t+a);gn.gain.exponentialRampToValueAtTime(.0008,t+a+d);o.connect(fl);fl.connect(gn);gn.connect(dest);if(send){const sg=c.createGain();sg.gain.value=send;gn.connect(sg);sg.connect(RV());}o.start(t);o.stop(t+a+d+.05);return o;}
function nzs(t,dur,type,f1,f2,peak,dest,send,q){const c=AU.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),gn=c.createGain();s.buffer=AU.nb;fl.type=type;fl.frequency.setValueAtTime(f1,t);if(f2!==f1)fl.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+dur);if(q)fl.Q.value=q;
gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(peak,t+Math.min(.01,dur/3));gn.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(fl);fl.connect(gn);gn.connect(dest);if(send){const sg=c.createGain();sg.gain.value=send;gn.connect(sg);sg.connect(RV());}s.start(t,Math.random()*1.5);s.stop(t+dur+.05);}
function flute(f,t,len,vol){const c=AU.ctx,o=c.createOscillator(),g2=c.createGain(),l=c.createOscillator(),lg=c.createGain();o.type='sine';o.frequency.value=f;l.frequency.value=5.2;lg.gain.value=f*.006;l.connect(lg);lg.connect(o.frequency);
g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol,t+.06);g2.gain.setValueAtTime(vol,t+len*.8);g2.gain.linearRampToValueAtTime(0,t+len);o.connect(g2);g2.connect(AU.mus);const sg=c.createGain();sg.gain.value=.5;g2.connect(sg);sg.connect(AU.rv);o.start(t);l.start(t);o.stop(t+len+.05);l.stop(t+len+.05);nzs(t,len,'bandpass',f*2,f*2,vol*.3,AU.mus,.2,2);}
// sustained lead with vibrato (reed, horn, choir)
function sus(type,f,t,len,vol,lp,at,vib,send){const c=AU.ctx,o=c.createOscillator(),fl=c.createBiquadFilter(),g2=c.createGain(),l=c.createOscillator(),lg=c.createGain();at=Math.min(at,len*.5);o.type=type;o.frequency.value=f;l.frequency.value=4.8;lg.gain.value=f*vib;l.connect(lg);lg.connect(o.frequency);fl.type='lowpass';fl.frequency.value=lp;
g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol,t+at);g2.gain.setValueAtTime(vol,t+len*.8);g2.gain.linearRampToValueAtTime(0,t+len+at*.5);o.connect(fl);fl.connect(g2);g2.connect(AU.mus);const sg=c.createGain();sg.gain.value=send;g2.connect(sg);sg.connect(AU.rv);const e=t+len+at*.5+.05;o.start(t);l.start(t);o.stop(e);l.stop(e);}
// kick; with f0/f1 a tom (pitch sweep from f0 to f1)
function kick(t,v,d,f0,f1){const c=AU.ctx,o=c.createOscillator(),gn=c.createGain();o.frequency.setValueAtTime(f0||130,t);o.frequency.exponentialRampToValueAtTime(f1||42,t+.18);gn.gain.setValueAtTime(v*.5,t);gn.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(gn);gn.connect(d||AU.mus);o.start(t);o.stop(t+.3);nzs(t,.06,'lowpass',500,200,v*.08,d||AU.mus,0);}
const snare=(t,v)=>{nzs(t,.18,'bandpass',1800,900,v*.25,AU.mus,.25,1.2);voice('triangle',190,t,.002,.08,v*.12,1200,AU.mus,0);},hat=(t,v)=>nzs(t,.04,'highpass',7000,7000,v*.1,AU.mus,0);
// lead instruments (f, start, length, volume)
const LDI={flute,
bell:(f,t,l,v)=>{voice('sine',f,t,.002,.4+l*1.2,v*1.1,6000,AU.mus,.6);voice('sine',f*2.76,t,.002,.35,v*.3,8000,AU.mus,.5);voice('sine',f*5.4,t,.001,.12,v*.12,9000,AU.mus,.4);},
pluck:(f,t,l,v)=>{voice('triangle',f,t,.003,.3+l*.4,v*1.4,2600,AU.mus,.25);voice('sawtooth',f,t,.002,.15,v*.4,2000,AU.mus,.15);},
reed:(f,t,l,v)=>sus('square',f,t,l,v*.42,1600,.04,.008,.35),
horn:(f,t,l,v)=>sus('sawtooth',f/2,t,l,v*.6,900,.12,.004,.45),
choir:(f,t,l,v)=>{sus('triangle',f*1.004,t,l,v*.6,1800,.3,.003,.8);sus('triangle',f*.996,t,l,v*.6,1800,.3,.003,.8);}};
// battle drum patterns (16 steps a bar)
const DRM={
march(p,b,t,B){if(p%4==0)kick(t,.6*B);if(p==4||p==12)snare(t,.35*B);if(p%2==0)hat(t,.12*B);if(b%4==3&&p>=12)kick(t,.5*B);},
tribal(p,b,t,B){if(p==0||p==6||p==10)kick(t,.65*B);if(p==4||p==12)kick(t,.45*B,0,220,110);if(b%4==3&&p>=12)kick(t,.4*B,0,260-(p-12)*30,120);if(p%2==0)nzs(t,.07,'bandpass',5000,4000,.07*B*(p%4?.6:1),AU.mus,0,1.5);},
heavy(p,b,t,B){if(p%2==0&&p!=4&&p!=12)kick(t,.55*B);if(p==4||p==12)snare(t,.45*B);if(p%4==2)hat(t,.14*B);if(p==0&&b%4==0)nzs(t,1.2,'highpass',5000,3000,.1*B,AU.mus,.3);},
soft(p,b,t,B){if(p==0||p==10)kick(t,.45*B);if(p==4||p==12)snare(t,.2*B);if(p%2==0)nzs(t,.05,'highpass',9000,9000,.06*B*(p%4?.6:1),AU.mus,.2);},
gallop(p,b,t,B){if(p%4==0||p%4==3)kick(t,.5*B);if(p==4||p==12)snare(t,.38*B);if(p%2==0)hat(t,.12*B);if(b%4==3&&p>=12)kick(t,.4*B,0,200,90);}};
function mstep(i,t){const bar=Math.floor(i/16)%8,pos=i%16,ch=CHS[bar%4],B=AU.battle,calm=1-B*.85,sd=msd(),M=MP;
if(pos==0){for(const n of ch.t)voice(M.pw,mf(n-12),t,1.2,sd*14,.018*calm+.012,M.pl,AU.mus,.3);voice('triangle',mf(ch.r),t,.05,sd*15,.16,300,AU.mus,.05);
if(M.dn&&bar%2==0){voice('sawtooth',mf(dg(0)-24),t,1.5,sd*34,.03,260,AU.mus,.4);voice('triangle',mf(dg(4)-24),t,1.5,sd*30,.04,400,AU.mus,.4);}}
if(pos==8||(B>.4&&(pos==6||pos==12)))voice('triangle',mf(ch.r),t,.01,sd*3,.12,350,AU.mus,.05);
const st2=B>.5?1:M.as;if(pos%st2==0){const idx=M.ap[(pos/st2)%8|0],nt=ch.t[idx%3]+AN[idx];voice(M.aw,mf(nt),t,.004,.5,.09*(.7+.3*(pos%4==0)),2200,AU.mus,.22*M.rv);voice('sine',mf(nt+12),t,.003,.2,.035,3000,AU.mus,.1*M.rv);}
if(calm>.2)for(const[p2,m,l]of MELS[M.ml][bar])if(p2==pos)LDI[M.ld](mf(dg(m)+M.lo),t,l*sd,.07*calm);
if(pos==0&&bar%2==0)kick(t,.5*(.35+B*.65));
if(B>.3){DRM[M.dr](pos,bar,t,B);
if(pos%4!=1)voice(M.bw,mf(ch.r+12+(pos%8==6?7:0)),t,.005,sd*1.6,.05*B,900,AU.mus,.1);if(pos==0&&bar%2==0)for(const n of ch.t)voice(M.bw,mf(n),t,.06,sd*5,.04*B,800,AU.mus,.25);}}
// odd steps are pushed late by the theme's swing
function sched(){const c=AU.ctx;if(!c||c.state!='running')return;AU.battle+=((typeof g!='undefined'&&g&&g.run&&!g.pause?1:0)-AU.battle)*.08;while(AU.next<c.currentTime+.35){const sd=msd();mstep(AU.step,AU.next+(AU.step%2?MP.sw*sd:0));AU.next+=sd;AU.step++;}}
// paused (AU.pz, kept by ui()): music drops to a quiet calm bed; also called before the audio has started
function auPause(p){if(AU.mus)AU.mus.gain.setTargetAtTime(AU.on.m?(p?.1:.32):0,AU.ctx.currentTime,.15);}
function auInit(){if(AU.ctx){if(AU.ctx.state=='suspended')AU.ctx.resume();return;}const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=AU.ctx=new A();
AU.m=c.createGain();AU.m.gain.value=.9;AU.m.connect(c.destination);AU.mus=c.createGain();AU.mus.gain.value=AU.on.m?(AU.pz?.1:.32):0;AU.mus.connect(AU.m);AU.sfx=c.createGain();AU.sfx.gain.value=AU.on.s?.8:0;AU.sfx.connect(AU.m);
const len=c.sampleRate*1.8|0,ib=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ib.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5);}
AU.rv=c.createConvolver();AU.rv.buffer=ib;const rg=c.createGain();rg.gain.value=.4;AU.rv.connect(rg);rg.connect(AU.m);
const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;AU.nb=nb;AU.next=c.currentTime+.1;AU.timer=setInterval(sched,60);}
// brass (horns, trumpets): two slightly detuned saws through a lowpass that opens on the attack, with a little pitch scoop
function brass(f,t,len,vol,br){const c=AU.ctx,d=DS2(),fl=c.createBiquadFilter(),gn=c.createGain(),e=t+len+.15;fl.type='lowpass';fl.Q.value=2;fl.frequency.setValueAtTime(f*1.2,t);fl.frequency.linearRampToValueAtTime(f*(br||5),t+.08);fl.frequency.setTargetAtTime(f*2.5,t+.1,.25);
gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(vol,t+.05);gn.gain.linearRampToValueAtTime(vol*.8,t+Math.max(.06,len-.05));gn.gain.linearRampToValueAtTime(0,t+len+.12);
for(const m of[1,1.006]){const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f*m*.97,t);o.frequency.linearRampToValueAtTime(f*m,t+.05);o.connect(fl);o.start(t);o.stop(e);}
fl.connect(gn);gn.connect(d);const sg=c.createGain();sg.gain.value=.35;gn.connect(sg);sg.connect(RV());}
// goblin-ish death cries (f scales the pitch, v the volume), one of three at random: a falling squeal, a grunt then a wail, a choked yelp
function cry(f,v){const t=T0(),k=Math.random()*3|0;if(k==0)voice('sawtooth',620*f*rr(),t,.005,.28,.09*v,1800,DS2(),.1).frequency.exponentialRampToValueAtTime(160*f,t+.28);
else if(k==1){voice('square',260*f*rr(),t,.004,.08,.06*v,1200,DS2(),.05).frequency.exponentialRampToValueAtTime(180*f,t+.08);voice('sawtooth',720*f*rr(),t+.09,.01,.32,.08*v,1900,DS2(),.15).frequency.exponentialRampToValueAtTime(220*f,t+.4);}
else{const o=voice('sawtooth',540*f*rr(),t,.004,.2,.09*v,1600,DS2(),.1);o.frequency.setValueAtTime(540*f,t);o.frequency.linearRampToValueAtTime(820*f,t+.06);o.frequency.exponentialRampToValueAtTime(130*f,t+.2);}
nzs(t+.18,.1,'lowpass',500,200,.2*v,DS2(),0);}
const SX={
click(){voice('triangle',680,T0(),.002,.06,.1,3000,DS2(),0);},
ach(){const t=T0();[523,659,784,1047].forEach((f,i)=>voice('triangle',f,t+i*.09,.004,i==3?.6:.18,.1,4200,DS2(),.35));},
f_arrow(){const t=T0();nzs(t,.2,'bandpass',2800,700,.22,DS2(),.05,1.5);voice('triangle',300*rr(),t,.002,.14,.1,1400,DS2(),0).frequency.exponentialRampToValueAtTime(180,t+.14);},
f_ballista(){const t=T0();voice('square',92*rr(),t,.002,.22,.22,450,DS2(),.1);nzs(t,.35,'bandpass',1600,260,.3,DS2(),.1,1);},
f_cannon(){const t=T0();voice('sine',150,t,.004,.3,.5,500,DS2(),.15).frequency.exponentialRampToValueAtTime(48,t+.3);nzs(t,.45,'bandpass',420,160,.25,DS2(),.2,.8);},
f_frost(){const t=T0();[1,1.5,2.01].forEach((m,i)=>voice('sine',880*m*rr(),t+i*.05,.004,.5,.07,6000,DS2(),.4));nzs(t,.3,'highpass',6000,9000,.05,DS2(),.3);},
f_storm(){const t=T0();nzs(t,.28,'highpass',2500,6000,.2,DS2(),.2);const o=voice('sawtooth',110*rr(),t,.002,.25,.12,1800,DS2(),.15);o.frequency.exponentialRampToValueAtTime(420,t+.08);o.frequency.exponentialRampToValueAtTime(90,t+.25);for(let i=0;i<5;i++)nzs(t+.02+i*.045,.02,'highpass',3000,3000,.2,DS2(),0);},
f_alch(){const t=T0();nzs(t,.2,'bandpass',900,1800,.12,DS2(),.1,2);for(let i=0;i<3;i++)voice('sine',400+i*170+rnd(0,100),t+i*.05,.002,.1,.07,3000,DS2(),.1);},
h_arrow(){const t=T0();nzs(t,.07,'lowpass',900,300,.22,DS2(),0);voice('sine',170*rr(),t,.002,.08,.18,600,DS2(),0).frequency.exponentialRampToValueAtTime(80,t+.08);},
h_ballista(){const t=T0();nzs(t,.12,'lowpass',700,150,.4,DS2(),.05);voice('sine',110,t,.003,.15,.35,500,DS2(),0).frequency.exponentialRampToValueAtTime(50,t+.15);},
banish(){const t=T0(),o=voice('sine',1200*rr(),t,.005,.45,.12,6000,DS2(),.5);o.frequency.exponentialRampToValueAtTime(180,t+.4);nzs(t,.4,'bandpass',2400,500,.1,DS2(),.4,2);voice('triangle',mf(81),t+.32,.005,.35,.07,5000,DS2(),.5);},
h_frost(){const t=T0();voice('sine',1400*rr(),t,.002,.18,.08,7000,DS2(),.4);voice('sine',2100*rr(),t+.02,.002,.12,.05,8000,DS2(),.4);},
// level mechanics: the Ashfall ruins collapsing, a lava vent rumbling and erupting, darkness falling, a blizzard rising (wind), a void rift opening (warp)
thunder(){const t=T0();nzs(t,2.6,'lowpass',260,45,.3,DS2(),.5);nzs(t,.35,'lowpass',1400,200,.18,DS2(),.4);voice('sine',38,t,.05,2.2,.18,150,DS2(),.3);},crumble(){const t=T0();for(let i=0;i<5;i++)nzs(t+i*.13,.5,'lowpass',900-i*120,90,.32,DS2(),.3);voice('sine',70,t,.01,1,.4,300,DS2(),.1).frequency.exponentialRampToValueAtTime(30,t+1);},
rumble(){const t=T0();nzs(t,1.8,'lowpass',220,90,.3,DS2(),.25);voice('sine',45,t,.4,1.6,.22,200,DS2(),.1);},
erupt(){const t=T0();nzs(t,.9,'lowpass',900,60,.55,DS2(),.35);nzs(t+.05,1.4,'highpass',1800,4200,.14,DS2(),.2);voice('sine',80,t,.004,.6,.5,300,DS2(),.1).frequency.exponentialRampToValueAtTime(28,t+.6);},
wind(){const t=T0();nzs(t,3.2,'bandpass',300,1400,.2,DS2(),.5,1.2);nzs(t+.6,2.4,'bandpass',1800,500,.1,DS2(),.6,2);nzs(t,3,'lowpass',240,120,.12,DS2(),.3);},
warp(){const t=T0(),o=voice('sine',90,t,.2,1.1,.16,900,DS2(),.6);o.frequency.exponentialRampToValueAtTime(420,t+1);nzs(t,1.1,'bandpass',300,2400,.1,DS2(),.6,3);voice('triangle',mf(57),t+.1,.3,.9,.06,2000,DS2(),.7);},
dark(){const t=T0(),o=voice('sine',220,t,.3,2.2,.16,600,DS2(),.6);o.frequency.exponentialRampToValueAtTime(70,t+2);nzs(t,2,'bandpass',400,120,.09,DS2(),.6,1.5);},
boom(){const t=T0();nzs(t,.6,'lowpass',600,80,.5,DS2(),.3);voice('sine',90,t,.004,.45,.5,300,DS2(),.1).frequency.exponentialRampToValueAtTime(30,t+.45);},
splash(){const t=T0();nzs(t,.3,'bandpass',1500,500,.15,DS2(),.2,1.5);for(let i=0;i<6;i++)voice('sine',350+i*90+rnd(0,120),t+i*.04,.002,.09,.07,2500,DS2(),.15);},
die_norm(){cry(1,1);},
die_fast(){const t=T0();cry(1.35,.85);voice('sine',1300*rr(),t+.03,.003,.16,.07,4000,DS2(),.1).frequency.exponentialRampToValueAtTime(520,t+.19);},
die_tank(){const t=T0();[820,1230,1900].forEach((f,i)=>voice('sine',f*rr(),t,.002,.5-i*.12,.1,6000,DS2(),.25));nzs(t,.2,'lowpass',900,200,.3,DS2(),.1);},
die_guard(){const t=T0();voice('sawtooth',560*rr(),t,.005,.3,.09,1600,DS2(),.1).frequency.exponentialRampToValueAtTime(150,t+.3);nzs(t+.1,.25,'bandpass',1800,600,.2,DS2(),.1);},
die_shaman(){const t=T0();voice('triangle',880*rr(),t,.01,.5,.08,3000,DS2(),.4).frequency.exponentialRampToValueAtTime(220,t+.5);nzs(t+.15,.1,'lowpass',500,200,.2,DS2(),0);},
die_bat(){const t=T0();for(let i=0;i<3;i++)voice('sine',2600*rr(),t+i*.05,.002,.06,.05,9000,DS2(),.2).frequency.exponentialRampToValueAtTime(1400,t+i*.05+.06);},
die_sapper(){const t=T0();cry(1.15,.9);nzs(t,.3,'highpass',3000,1500,.08,DS2(),.1);},
die_troll(){const t=T0();voice('sawtooth',90*rr(),t,.03,.8,.3,600,DS2(),.3).frequency.exponentialRampToValueAtTime(45,t+.8);nzs(t+.3,.4,'lowpass',400,100,.3,DS2(),.1);},
die_ghost(){const t=T0(),o=voice('sine',740*rr(),t,.05,.9,.07,3000,DS2(),.6);o.frequency.exponentialRampToValueAtTime(180,t+.9);},
die_imp(){const t=T0();voice('square',520*rr(),t,.005,.15,.05,2000,DS2(),.1).frequency.exponentialRampToValueAtTime(140,t+.15);nzs(t,.35,'highpass',2500,800,.12,DS2(),.15);},
phase(){const t=T0();nzs(t,.35,'bandpass',1400,600,.06,DS2(),.4,2);voice('sine',520*rr(),t,.08,.3,.03,2000,DS2(),.5).frequency.exponentialRampToValueAtTime(900,t+.3);},
die_king(){const t=T0();voice('sawtooth',300*rr(),t,.01,.7,.15,1500,DS2(),.3).frequency.exponentialRampToValueAtTime(70,t+.7);nzs(t+.2,.5,'lowpass',600,150,.3,DS2(),.2);},
die_ram(){const t=T0();nzs(t,.8,'lowpass',900,80,.55,DS2(),.3);for(let i=0;i<5;i++)nzs(t+i*.09+rnd(0,.04),.12,'bandpass',500+rnd(0,500),200,.25,DS2(),.1);voice('sine',70,t,.01,.6,.4,300,DS2(),.1);},
die_necro(){const t=T0(),o=voice('triangle',440*rr(),t,.02,1.1,.12,2500,DS2(),.6);o.frequency.exponentialRampToValueAtTime(90,t+1.1);nzs(t,.9,'bandpass',900,300,.12,DS2(),.5,2);},
die_pirate(){const t=T0();cry(.5,1.1);[2500,3350].forEach((f,i)=>voice('sine',f*rr(),t+.22+i*.03,.001,.25,.05,9000,DS2(),.3));nzs(t+.22,.15,'highpass',3500,2500,.12,DS2(),.15);},
rum(){const t=T0();for(let i=0;i<4;i++)voice('sine',520-i*70+rnd(0,40),t+i*.09,.005,.08,.08,2000,DS2(),.1);voice('sawtooth',210,t+.38,.01,.25,.07,900,DS2(),.15).frequency.exponentialRampToValueAtTime(330,t+.6);},
die_skel(){const t=T0();for(let i=0;i<6;i++)nzs(t+i*.045+rnd(0,.02),.04,'bandpass',2200+rnd(0,1500),800,.18,DS2(),.05,4);},
summon(){const t=T0();[392,523,659].forEach((f,i)=>voice('sawtooth',f,t+i*.1,.01,.28,.07,1800,DS2(),.4));},
raise(){const t=T0(),o=voice('sine',110,t,.1,.9,.2,800,DS2(),.6);o.frequency.exponentialRampToValueAtTime(220,t+.8);nzs(t,.6,'bandpass',600,300,.12,DS2(),.5,2);},
h_barracks(){const t=T0();nzs(t,.05,'highpass',3000,1800,.16,DS2(),.04);voice('triangle',900*rr(),t,.001,.09,.07,5000,DS2(),.1).frequency.exponentialRampToValueAtTime(600,t+.09);},
die_sol(){const t=T0();nzs(t,.18,'lowpass',700,250,.22,DS2(),.05);voice('square',240*rr(),t,.003,.2,.06,1200,DS2(),.05).frequency.exponentialRampToValueAtTime(90,t+.2);},
rain(){const t=T0();for(let i=0;i<7;i++)nzs(t+i*.045,.3,'bandpass',3400-i*180,700,.13,DS2(),.06,1.3);nzs(t+.25,.25,'lowpass',900,200,.2,DS2(),.05);},
oil(){const t=T0();nzs(t,1.6,'highpass',2400,5200,.22,DS2(),.15);nzs(t+.35,.7,'lowpass',700,110,.45,DS2(),.25);voice('sine',62,t+.35,.01,.7,.45,300,DS2(),.1).frequency.exponentialRampToValueAtTime(34,t+1);},
reinf(){const t=T0();[mf(55),mf(59),mf(62),mf(67)].forEach((f,i)=>voice('sawtooth',f,t+i*.11,.02,.55,.1,1900,DS2(),.3));kick(t,.8,DS2());nzs(t+.35,.3,'lowpass',800,150,.25,DS2(),.05);},
block(){const t=T0();[1250,1880].forEach((f,i)=>voice('sine',f*rr(),t,.001,.18-i*.05,.08,6000,DS2(),.15));nzs(t,.06,'highpass',2500,1500,.15,DS2(),.05);},
heal(){const t=T0();[523,659,784].forEach((f,i)=>voice('triangle',f*rr(),t+i*.06,.02,.35,.05,3000,DS2(),.5));},
die_boss(){const t=T0();voice('sawtooth',130,t,.04,1.4,.3,700,DS2(),.35).frequency.exponentialRampToValueAtTime(38,t+1.3);nzs(t,1.2,'lowpass',900,60,.45,DS2(),.4);voice('sine',60,t,.01,1,.5,200,DS2(),.1);},
roar_boss(){const t=T0(),o=voice('sawtooth',70,t,.15,1.2,.3,800,DS2(),.4);o.frequency.exponentialRampToValueAtTime(150,t+.4);o.frequency.exponentialRampToValueAtTime(55,t+1.2);nzs(t,1.2,'bandpass',500,200,.3,DS2(),.4,.8);nzs(t+.1,1,'bandpass',1400,500,.12,DS2(),.4,3);},
// the other bosses' entrances: the Goblin King's goblins cheer to his trumpets, the Siege Ram creaks and thunders, the Necromancer's cold chord and laugh
roar_king(){const t=T0();for(let i=0;i<6;i++){const a=t+rnd(0,.2);voice('sawtooth',rnd(450,750),a,.03,.45,.035,2200,DS2(),.3).frequency.exponentialRampToValueAtTime(rnd(900,1300),a+.4);}brass(mf(62),t+.35,.16,.1);brass(mf(66),t+.53,.16,.1);brass(mf(69),t+.71,.75,.11);brass(mf(50),t+.71,.75,.07,3);},
roar_ram(){const t=T0();for(let i=0;i<3;i++){nzs(t+i*.3,.28,'bandpass',300+i*120,900,.18,DS2(),.2,12);kick(t+i*.3+.12,.9,DS2(),95,34);}for(let i=0;i<6;i++)nzs(t+.15+i*.13,.05,'highpass',4000,3000,.06,DS2(),.1);},
roar_necro(){const t=T0();[50,53,56,59].forEach((n,i)=>voice('sine',mf(n),t+i*.05,.4,1.8,.05,2000,DS2(),.7).frequency.exponentialRampToValueAtTime(mf(n-3),t+1.8));nzs(t,1.6,'bandpass',800,2600,.07,DS2(),.6,4);for(let i=0;i<4;i++)voice('sawtooth',150-i*8,t+.9+i*.14,.01,.1,.07,900,DS2(),.4);},
// how the last hit killed it: ice shattering (Wizard), a melting sizzle (Alchemist), an electric fizzle (Storm)
k_frost(){const t=T0();for(let i=0;i<7;i++)voice('sine',rnd(2200,5200),t+rnd(0,.08),.001,rnd(.08,.2),.04,9000,DS2(),.3);nzs(t,.12,'highpass',4000,2500,.15,DS2(),.2);},
k_alch(){const t=T0();nzs(t,.7,'highpass',2500,6000,.08,DS2(),.15);for(let i=0;i<5;i++)voice('sine',rnd(180,380),t+.05+i*.1,.004,.07,.06,1500,DS2(),.1).frequency.exponentialRampToValueAtTime(rnd(500,700),t+.12+i*.1);},
k_storm(){const t=T0();voice('sawtooth',62,t,.003,.3,.07,2500,DS2(),.1);for(let i=0;i<5;i++)nzs(t+rnd(0,.25),.03,'highpass',5000,5000,.1,DS2(),.1);},
build(){const t=T0();for(let i=0;i<3;i++){nzs(t+i*.11,.07,'lowpass',700,300,.35,DS2(),.05);voice('sine',210*rr(),t+i*.11,.002,.07,.2,800,DS2(),0);}voice('sine',320,t+.36,.002,.2,.12,2000,DS2(),.2);},
upgrade(){const t=T0();[0,4,7,12].forEach((s2,i)=>voice('triangle',mf(69+s2),t+i*.07,.004,.35,.12,5000,DS2(),.3));},
sell(){const t=T0();for(let i=0;i<4;i++)voice('triangle',2200+rnd(0,800),t+i*.045,.002,.12,.08,8000,DS2(),.2);},
// gold: a kill's clink picks two or three notes, clink = a flying coin landing in the gold pill
coin(){const t=T0(),F=[1568,1760,2093,2349,2637,3136],n=Math.random()<.3?3:2;for(let i=0;i<n;i++)voice('triangle',F[Math.random()*F.length|0],t+i*.05,.002,.1+i*.04,.065,8000,DS2(),.18);},
clink(){voice('triangle',rnd(2600,3400),T0(),.002,.07,.03,9000,DS2(),.1);},
// wave start: a war horn call over drums; a boss wave gets a darker three-blast call
horn(){const t=T0();brass(mf(50),t,.42,.13,4);brass(mf(57),t+.48,1.1,.14,5);brass(mf(38),t,1.6,.07,3);kick(t+.05,.8,DS2());kick(t+.48,.7,DS2());kick(t+.62,.5,DS2());},
hornB(){const t=T0();brass(mf(45),t,.32,.13,3.5);brass(mf(45),t+.42,.32,.13,3.5);brass(mf(46),t+.84,1.5,.14,4);brass(mf(33),t+.84,1.6,.09,3);for(let i=0;i<8;i++)kick(t+.84+i*.07,.3+i*.06,DS2(),120,70);kick(t+1.42,1,DS2());},
leak(){const t=T0();[110,165,220,330].forEach((f,i)=>voice('sine',f,t,.005,1.2-i*.2,.2,900,DS2(),.4));nzs(t,.5,'lowpass',700,100,.3,DS2(),.2);},
waveEnd(){const t=T0();[0,4,7].forEach((s2,i)=>voice('triangle',mf(74+s2),t+i*.12,.01,.5,.1,4000,DS2(),.35));for(let i=0;i<9;i++)voice('triangle',rnd(1800,3200),t+.4+i*.055+rnd(0,.02),.002,.1,.045,9000,DS2(),.15);},
// victory fanfare: trumpets over timpani and a cymbal, then the old sparkle; the music steps back while it plays
win(){const t=T0();if(AU.mus&&AU.on.m){AU.mus.gain.setTargetAtTime(.05,t,.1);AU.mus.gain.setTargetAtTime(AU.pz?.1:.32,t+3.8,.8);}
[[62,0,.14],[62,.16,.14],[62,.32,.14],[67,.5,.5],[71,1.05,.3],[69,1.38,.16],[71,1.56,.16],[74,1.75,1.5]].forEach(([n,a,l])=>brass(mf(n),t+a,l,.09,6));[[59,.5,.5],[62,1.05,.3],[67,1.75,1.5],[71,1.75,1.5],[43,1.75,1.6]].forEach(([n,a,l])=>brass(mf(n),t+a,l,.06,4));
[0,.5,1.05].forEach(a=>kick(t+a,.8,DS2(),110,70));for(let i=0;i<6;i++)kick(t+1.45+i*.05,.3+i*.08,DS2(),110,70);kick(t+1.75,1.1,DS2(),100,45);nzs(t+1.75,2.2,'highpass',5000,3500,.12,DS2(),.4);
[0,4,7,12,16,19].forEach((s2,i)=>voice('triangle',mf(79+s2),t+2.3+i*.1,.01,.7,.05,6000,DS2(),.5));},
lose(){const t=T0();[0,-2,-5,-9].forEach((s2,i)=>voice('sawtooth',mf(57+s2),t+i*.4,.05,1,.1,900,DS2(),.4));kick(t,.9,DS2());}};
// snd(name) plays a sound as is (UI, alarms, the wave horn); snd(name,x,y[,mn]) with game coordinates places it on the board: it fades with
// the distance from the camera target (tx,tz – the reach grows as you zoom out), gets muffled, pans left/right and keeps more of its echo.
// mn = the quietest it may get. While SX[n] runs, DS2() and RV() point at that chain (AU.dst/AU.rvd); it is disconnected again after 6 s.
function snd(n,x,y,mn){if(!AU.ctx||AU.ctx.state!='running'||!AU.on.s||!SX[n])return;const c=AU.ctx,t=c.currentTime;if(t-(AU.last[n]||0)<(n.startsWith('die')?.04:.05))return;AU.last[n]=t;
if(x!==undefined&&typeof wx=='function'){const dx=wx(x)-tx,dz=wz(y)-tz,R=dist*.35+2,v=Math.max(mn||.07,1/(1+(dx*dx+dz*dz)/(R*R))),lp=c.createBiquadFilter(),gn=c.createGain(),rg=c.createGain(),pn=c.createStereoPanner&&c.createStereoPanner();
lp.type='lowpass';lp.frequency.value=1800+18000*v*v;gn.gain.value=v;rg.gain.value=Math.sqrt(v);lp.connect(gn);if(pn){pn.pan.value=Math.max(-.75,Math.min(.75,(dx*Math.cos(az)-dz*Math.sin(az))/R*.6));gn.connect(pn);pn.connect(AU.sfx);}else gn.connect(AU.sfx);rg.connect(AU.rv);
AU.dst=lp;AU.rvd=rg;setTimeout(()=>{lp.disconnect();gn.disconnect();rg.disconnect();if(pn)pn.disconnect();},6000);}
try{SX[n]();}catch(e){}AU.dst=AU.rvd=null;}
function auSave(){try{localStorage.setItem('sfaud',JSON.stringify(AU.on));}catch(e){}}
function auUI(){$('mu').classList.toggle('off',!AU.on.m);$('sf').classList.toggle('off',!AU.on.s);}
$('mu').onclick=()=>{auInit();AU.on.m=!AU.on.m;if(AU.mus)AU.mus.gain.setTargetAtTime(AU.on.m?(AU.pz?.1:.32):0,AU.ctx.currentTime,.1);auSave();auUI();};
$('sf').onclick=()=>{auInit();AU.on.s=!AU.on.s;if(AU.sfx)AU.sfx.gain.setTargetAtTime(AU.on.s?.8:0,AU.ctx.currentTime,.05);auSave();auUI();};
auUI();['pointerdown','keydown'].forEach(ev=>addEventListener(ev,auInit,{passive:true}));
document.addEventListener('visibilitychange',()=>{if(AU.ctx)document.hidden?AU.ctx.suspend():AU.ctx.resume();});
document.addEventListener('pointerdown',ev=>{if(ev.target.closest&&ev.target.closest('.tile,.wb,#zm button'))snd('click');},true);
