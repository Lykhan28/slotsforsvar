// ---------- AUDIO (generated in code) ----------
const AU={ctx:null,on:{m:true,s:true},last:{},battle:0,step:0,next:0};
try{const sv=JSON.parse(localStorage.getItem('sfaud')||'{}');if(sv.m===false)AU.on.m=false;if(sv.s===false)AU.on.s=false;}catch(e){}
// music step length: 92 bpm at ×1, a little quicker at ×2/×3 (not doubled – that sounds silly)
const msd=()=>60/(92*(typeof g!='undefined'&&g&&!g.pause?[1,1,1.12,1.24][g.spd]||1:1))/4;
const mf=m=>440*Math.pow(2,(m-69)/12),rr=()=>1+rnd(-.07,.07),T0=()=>AU.ctx.currentTime,DS2=()=>AU.sfx;
function voice(type,f,t,a,d,peak,lp,dest,send){const c=AU.ctx,o=c.createOscillator(),gn=c.createGain(),fl=c.createBiquadFilter();o.type=type;o.frequency.value=f;fl.type='lowpass';fl.frequency.value=lp;
gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(peak,t+a);gn.gain.exponentialRampToValueAtTime(.0008,t+a+d);o.connect(fl);fl.connect(gn);gn.connect(dest);if(send){const sg=c.createGain();sg.gain.value=send;gn.connect(sg);sg.connect(AU.rv);}o.start(t);o.stop(t+a+d+.05);return o;}
function nzs(t,dur,type,f1,f2,peak,dest,send,q){const c=AU.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),gn=c.createGain();s.buffer=AU.nb;fl.type=type;fl.frequency.setValueAtTime(f1,t);if(f2!==f1)fl.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+dur);if(q)fl.Q.value=q;
gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(peak,t+Math.min(.01,dur/3));gn.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(fl);fl.connect(gn);gn.connect(dest);if(send){const sg=c.createGain();sg.gain.value=send;gn.connect(sg);sg.connect(AU.rv);}s.start(t,Math.random()*1.5);s.stop(t+dur+.05);}
function flute(f,t,len,vol){const c=AU.ctx,o=c.createOscillator(),g2=c.createGain(),l=c.createOscillator(),lg=c.createGain();o.type='sine';o.frequency.value=f;l.frequency.value=5.2;lg.gain.value=f*.006;l.connect(lg);lg.connect(o.frequency);
g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol,t+.06);g2.gain.setValueAtTime(vol,t+len*.8);g2.gain.linearRampToValueAtTime(0,t+len);o.connect(g2);g2.connect(AU.mus);const sg=c.createGain();sg.gain.value=.5;g2.connect(sg);sg.connect(AU.rv);o.start(t);l.start(t);o.stop(t+len+.05);l.stop(t+len+.05);nzs(t,len,'bandpass',f*2,f*2,vol*.3,AU.mus,.2,2);}
function kick(t,v,d){const c=AU.ctx,o=c.createOscillator(),gn=c.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);gn.gain.setValueAtTime(v*.5,t);gn.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(gn);gn.connect(d||AU.mus);o.start(t);o.stop(t+.3);nzs(t,.06,'lowpass',500,200,v*.08,d||AU.mus,0);}
const snare=(t,v)=>{nzs(t,.18,'bandpass',1800,900,v*.25,AU.mus,.25,1.2);voice('triangle',190,t,.002,.08,v*.12,1200,AU.mus,0);},hat=(t,v)=>nzs(t,.04,'highpass',7000,7000,v*.1,AU.mus,0);
const CH=[{r:38,t:[62,65,69]},{r:36,t:[60,64,67]},{r:34,t:[58,62,65]},{r:33,t:[57,61,64]}];
const MEL=[[[0,74,6],[6,77,2],[8,76,4],[12,74,4]],[[0,72,6],[6,74,2],[8,76,6],[14,74,2]],[[0,70,4],[4,72,4],[8,74,6],[14,72,2]],[[0,73,8],[8,72,4],[12,69,4]],[[0,77,6],[6,76,2],[8,74,4],[12,72,4]],[[0,72,4],[4,74,4],[8,76,8]],[[0,74,6],[6,72,2],[8,70,4],[12,72,4]],[[0,73,4],[4,76,4],[8,74,8]]];
function mstep(i,t){const bar=Math.floor(i/16)%8,pos=i%16,ch=CH[bar%4],B=AU.battle,calm=1-B*.85,sd=msd();
if(pos==0){for(const n of ch.t)voice('sawtooth',mf(n-12),t,1.2,sd*14,.018*calm+.012,700,AU.mus,.3);voice('triangle',mf(ch.r),t,.05,sd*15,.16,300,AU.mus,.05);}
if(pos==8||(B>.4&&(pos==6||pos==12)))voice('triangle',mf(ch.r),t,.01,sd*3,.12,350,AU.mus,.05);
const st2=B>.5?1:2;if(pos%st2==0){const pat=[0,1,2,1,2,1,0,1],idx=pat[(pos/st2)%8|0],nt=ch.t[idx%3]+(idx==2?12:0);voice('triangle',mf(nt),t,.004,.5,.09*(.7+.3*(pos%4==0)),2200,AU.mus,.22);voice('sine',mf(nt+12),t,.003,.2,.035,3000,AU.mus,.1);}
if(calm>.2)for(const[p2,m,l]of MEL[bar])if(p2==pos)flute(mf(m),t,l*sd,.07*calm);
if(pos==0&&bar%2==0)kick(t,.5*(.35+B*.65));
if(B>.3){if(pos%4==0)kick(t,.6*B);if(pos==4||pos==12)snare(t,.35*B);if(pos%2==0)hat(t,.12*B);if(bar%4==3&&pos>=12)kick(t,.5*B);
if(pos%4!=1)voice('sawtooth',mf(ch.r+12+(pos%8==6?7:0)),t,.005,sd*1.6,.05*B,900,AU.mus,.1);if(pos==0&&bar%2==0)for(const n of ch.t)voice('sawtooth',mf(n),t,.06,sd*5,.04*B,800,AU.mus,.25);}}
function sched(){const c=AU.ctx;if(!c||c.state!='running')return;AU.battle+=((typeof g!='undefined'&&g&&g.run&&!g.pause?1:0)-AU.battle)*.08;while(AU.next<c.currentTime+.35){mstep(AU.step,AU.next);AU.next+=msd();AU.step++;}}
// paused (AU.pz, kept by ui()): music drops to a quiet calm bed; also called before the audio has started
function auPause(p){if(AU.mus)AU.mus.gain.setTargetAtTime(AU.on.m?(p?.1:.32):0,AU.ctx.currentTime,.15);}
function auInit(){if(AU.ctx){if(AU.ctx.state=='suspended')AU.ctx.resume();return;}const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=AU.ctx=new A();
AU.m=c.createGain();AU.m.gain.value=.9;AU.m.connect(c.destination);AU.mus=c.createGain();AU.mus.gain.value=AU.on.m?(AU.pz?.1:.32):0;AU.mus.connect(AU.m);AU.sfx=c.createGain();AU.sfx.gain.value=AU.on.s?.8:0;AU.sfx.connect(AU.m);
const len=c.sampleRate*1.8|0,ib=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ib.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5);}
AU.rv=c.createConvolver();AU.rv.buffer=ib;const rg=c.createGain();rg.gain.value=.4;AU.rv.connect(rg);rg.connect(AU.m);
const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;AU.nb=nb;AU.next=c.currentTime+.1;AU.timer=setInterval(sched,60);}
const SX={
click(){voice('triangle',680,T0(),.002,.06,.1,3000,DS2(),0);},
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
boom(){const t=T0();nzs(t,.6,'lowpass',600,80,.5,DS2(),.3);voice('sine',90,t,.004,.45,.5,300,DS2(),.1).frequency.exponentialRampToValueAtTime(30,t+.45);},
splash(){const t=T0();nzs(t,.3,'bandpass',1500,500,.15,DS2(),.2,1.5);for(let i=0;i<6;i++)voice('sine',350+i*90+rnd(0,120),t+i*.04,.002,.09,.07,2500,DS2(),.15);},
die_norm(){const t=T0();voice('sawtooth',620*rr(),t,.005,.28,.09,1800,DS2(),.1).frequency.exponentialRampToValueAtTime(160,t+.28);nzs(t+.18,.1,'lowpass',500,200,.2,DS2(),0);},
die_fast(){const t=T0();voice('sawtooth',900*rr(),t,.005,.18,.08,2200,DS2(),.1).frequency.exponentialRampToValueAtTime(300,t+.18);nzs(t+.12,.08,'lowpass',500,200,.18,DS2(),0);},
die_tank(){const t=T0();[820,1230,1900].forEach((f,i)=>voice('sine',f*rr(),t,.002,.5-i*.12,.1,6000,DS2(),.25));nzs(t,.2,'lowpass',900,200,.3,DS2(),.1);},
die_guard(){const t=T0();voice('sawtooth',560*rr(),t,.005,.3,.09,1600,DS2(),.1).frequency.exponentialRampToValueAtTime(150,t+.3);nzs(t+.1,.25,'bandpass',1800,600,.2,DS2(),.1);},
die_shaman(){const t=T0();voice('triangle',880*rr(),t,.01,.5,.08,3000,DS2(),.4).frequency.exponentialRampToValueAtTime(220,t+.5);nzs(t+.15,.1,'lowpass',500,200,.2,DS2(),0);},
die_bat(){const t=T0();for(let i=0;i<3;i++)voice('sine',2600*rr(),t+i*.05,.002,.06,.05,9000,DS2(),.2).frequency.exponentialRampToValueAtTime(1400,t+i*.05+.06);},
block(){const t=T0();[1250,1880].forEach((f,i)=>voice('sine',f*rr(),t,.001,.18-i*.05,.08,6000,DS2(),.15));nzs(t,.06,'highpass',2500,1500,.15,DS2(),.05);},
heal(){const t=T0();[523,659,784].forEach((f,i)=>voice('triangle',f*rr(),t+i*.06,.02,.35,.05,3000,DS2(),.5));},
die_boss(){const t=T0();voice('sawtooth',130,t,.04,1.4,.3,700,DS2(),.35).frequency.exponentialRampToValueAtTime(38,t+1.3);nzs(t,1.2,'lowpass',900,60,.45,DS2(),.4);voice('sine',60,t,.01,1,.5,200,DS2(),.1);},
roar(){const t=T0(),o=voice('sawtooth',70,t,.15,1.2,.3,800,DS2(),.4);o.frequency.exponentialRampToValueAtTime(150,t+.4);o.frequency.exponentialRampToValueAtTime(55,t+1.2);nzs(t,1.2,'bandpass',500,200,.3,DS2(),.4,.8);},
build(){const t=T0();for(let i=0;i<3;i++){nzs(t+i*.11,.07,'lowpass',700,300,.35,DS2(),.05);voice('sine',210*rr(),t+i*.11,.002,.07,.2,800,DS2(),0);}voice('sine',320,t+.36,.002,.2,.12,2000,DS2(),.2);},
upgrade(){const t=T0();[0,4,7,12].forEach((s2,i)=>voice('triangle',mf(69+s2),t+i*.07,.004,.35,.12,5000,DS2(),.3));},
sell(){const t=T0();for(let i=0;i<4;i++)voice('triangle',2200+rnd(0,800),t+i*.045,.002,.12,.08,8000,DS2(),.2);},
coin(){const t=T0();voice('triangle',1500,t,.002,.1,.07,7000,DS2(),.15);voice('triangle',2000,t+.05,.002,.15,.06,8000,DS2(),.2);},
horn(){const t=T0();[mf(38),mf(45),mf(50)].forEach(f=>voice('sawtooth',f,t,.25,1.3,.12,600,DS2(),.35));kick(t+.05,.8,DS2());kick(t+.5,.7,DS2());},
leak(){const t=T0();[110,165,220,330].forEach((f,i)=>voice('sine',f,t,.005,1.2-i*.2,.2,900,DS2(),.4));nzs(t,.5,'lowpass',700,100,.3,DS2(),.2);},
waveEnd(){const t=T0();[0,4,7].forEach((s2,i)=>voice('triangle',mf(74+s2),t+i*.12,.01,.5,.1,4000,DS2(),.35));},
win(){const t=T0();[0,4,7,12,16,19].forEach((s2,i)=>{voice('sawtooth',mf(62+s2),t+i*.14,.02,.6,.09,2200,DS2(),.4);voice('triangle',mf(74+s2),t+i*.14,.02,.8,.08,3000,DS2(),.4);});},
lose(){const t=T0();[0,-2,-5,-9].forEach((s2,i)=>voice('sawtooth',mf(57+s2),t+i*.4,.05,1,.1,900,DS2(),.4));kick(t,.9,DS2());}};
function snd(n){if(!AU.ctx||AU.ctx.state!='running'||!AU.on.s||!SX[n])return;const t=AU.ctx.currentTime;if(t-(AU.last[n]||0)<(n.startsWith('die')?.04:.05))return;AU.last[n]=t;try{SX[n]();}catch(e){}}
function auSave(){try{localStorage.setItem('sfaud',JSON.stringify(AU.on));}catch(e){}}
function auUI(){$('mu').classList.toggle('off',!AU.on.m);$('sf').classList.toggle('off',!AU.on.s);}
$('mu').onclick=()=>{auInit();AU.on.m=!AU.on.m;if(AU.mus)AU.mus.gain.setTargetAtTime(AU.on.m?(AU.pz?.1:.32):0,AU.ctx.currentTime,.1);auSave();auUI();};
$('sf').onclick=()=>{auInit();AU.on.s=!AU.on.s;if(AU.sfx)AU.sfx.gain.setTargetAtTime(AU.on.s?.8:0,AU.ctx.currentTime,.05);auSave();auUI();};
auUI();['pointerdown','keydown'].forEach(ev=>addEventListener(ev,auInit,{passive:true}));
document.addEventListener('visibilitychange',()=>{if(AU.ctx)document.hidden?AU.ctx.suspend():AU.ctx.resume();});
document.addEventListener('pointerdown',ev=>{if(ev.target.closest&&ev.target.closest('.tile,.wb,#zm button'))snd('click');},true);
