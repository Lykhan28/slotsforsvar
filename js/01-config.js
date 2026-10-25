
const $=id=>document.getElementById(id),S=60,W=12,H=8,MAXW=20,PI=Math.PI,rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const WP=[[-1,1],[9,1],[9,3],[2,3],[2,6],[12,6]].map(p=>[p[0]*S+S/2,p[1]*S+S/2]);
const road=new Set();
for(let i=0;i<WP.length-1;i++){const a=WP[i],b=WP[i+1],f=v=>Math.round((v-S/2)/S);
for(let c=Math.min(f(a[0]),f(b[0]));c<=Math.max(f(a[0]),f(b[0]));c++)for(let r=Math.min(f(a[1]),f(b[1]));r<=Math.max(f(a[1]),f(b[1]));r++)road.add(c+','+r);}
const T={arrow:{n:'Archers',ic:'🏹',c:50,r:130,d:10,f:.5},cannon:{n:'Catapult',ic:'🪨',c:100,r:110,d:30,f:1.4,sp:55,bs:260,arc:1},frost:{n:'Wizard',ic:'🔮',c:75,r:100,d:3,f:.9,off:1},
ballista:{n:'Ballista',ic:'🎯',c:125,r:190,d:66,f:2.2,bs:520},storm:{n:'Storm Tower',ic:'⚡',c:150,r:105,d:16,f:1,ch:5},alch:{n:'Alchemist',ic:'🧪',c:90,r:115,d:7.8,f:1.1,bs:240,arc:1},
banner:{n:'Banner Tower',ic:'🚩',c:120,r:120,d:0,f:99,sup:1},vault:{n:'Treasury',ic:'💰',c:150,r:40,d:0,f:99,inc:15}};
const E={norm:{s:50,h:1,rw:5,r:11,col:0x7ed957},fast:{s:90,h:.6,rw:5,r:9,col:0x8b9bb8},tank:{s:35,h:2.6,rw:10,r:14,col:0x8fa6c8},boss:{s:30,h:12,rw:50,r:18,col:0xe8483c}};
const P={st:0xece5d6,st2:0xd2c8b4,st3:0xf7f2e6,wd:0xc98a4b,wd2:0x8a5a2e,rd:0xe8483c,bl:0x3f86e0,pu:0x9a5be0,gd:0xffc93c,gr:0x7ed957};
const wx=x=>(x-360)/60,wz=y=>(y-240)/60;
