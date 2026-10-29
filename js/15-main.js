// ---------- render loop ----------
function draw(){if(comp){if(AO&&AO.pass.enabled)aoDraw();comp.render();}else R.render(sc,cam);}
let last=performance.now(),lu=0,lm=0;
function loop(now){if(MENU.quit)return;// Quit stops the loop; menuBack() restarts it
const dt=Math.min(.05,(now-last)/1000);last=now;
// game speed runs update() g.spd times a frame and scales the animation clock with it; paused freezes both (the end sequence always plays at normal speed)
const pz=g.pause&&!g.over,gd=MENU.open||g.over?dt:pz?0:dt*g.spd;
if(MENU.open){if(!g.wave&&!g.tw.length){az+=dt*.04;setCam();}}else if(!pz)for(let i=0;i<g.spd;i++)update(dt);sync(gd,dt);if(now-lu>200){lu=now;ui();}if(now-lm>120){lm=now;drawMM();}
draw();requestAnimationFrame(loop);}
buildArmy();reset();loadRun();menuStart();requestAnimationFrame(loop);
