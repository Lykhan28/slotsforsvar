// ---------- render loop ----------
function draw(){if(comp)comp.render();else R.render(sc,cam);}
let last=performance.now(),lu=0,lm=0;
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;
for(let i=0;i<g.spd;i++)update(dt);sync(dt);if(now-lu>200){lu=now;ui();}if(now-lm>120){lm=now;drawMM();}
draw();requestAnimationFrame(loop);}
buildArmy();reset();requestAnimationFrame(loop);
