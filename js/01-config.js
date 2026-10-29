
const $=id=>document.getElementById(id),S=60,MAXW=20,PI=Math.PI,rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// ---------- levels ----------
// w×h board cells; p = one road per breach, as cell waypoints (first point outside the wall = breach, last = castle gate; all roads share the gate); bk = cells nobody can build on
// th = environment (THEMES below); hp = enemy health multiplier; gold = starting gold
const LEVELS=[
{n:'Greenmeadow',d:'Peaceful fields on the edge of the kingdom',th:'meadow',w:12,h:8,hp:1,gold:120,p:[[[-1,1],[9,1],[9,3],[2,3],[2,6],[12,6]]],bk:[]},
{n:'Darkwood',d:'An old forest where little light gets through',th:'darkwood',w:10,h:7,hp:0.95,gold:130,p:[[[2,-1],[2,4],[6,4],[6,1],[10,1]]],bk:[[4,2],[0,5],[8,3],[4,6]]},
{n:'Emberwood',d:'The forest is burning and the villages are gone',th:'burning',w:13,h:8,hp:0.9,gold:140,p:[[[10,8],[10,5],[3,5],[3,2],[8,2],[8,-1]]],bk:[[5,4],[7,3],[1,6],[11,2],[0,1]]},
{n:'Mirefen',d:'Sunken bogs where nothing solid can be built',th:'marsh',w:14,h:9,hp:0.93,gold:150,p:[[[-1,2],[5,2],[5,6],[11,6],[11,9]]],bk:[[2,4],[3,4],[2,5],[8,3],[9,3],[8,4],[12,2],[13,3],[7,8],[1,7],[0,0]]},
{n:'Ashfall',d:'The ruins of a town, still smouldering',th:'ruins',w:11,h:7,hp:1.1,gold:160,p:[[[11,5],[7,5],[7,1],[3,1],[3,4],[-1,4]]],bk:[[5,2],[5,3],[9,3],[1,1],[9,0],[5,6],[0,6]]},
{n:'Barrow Moor',d:'Mist, graves and things that should stay buried',th:'moor',w:15,h:9,hp:0.8,gold:170,p:[[[2,-1],[2,6],[12,6],[12,2],[15,2]]],bk:[[4,3],[5,3],[6,3],[8,4],[9,4],[10,3],[4,7],[7,8],[1,2],[14,5],[8,1],[0,8]]},
{n:'Scorched Badlands',d:'Cracked earth and rivers of fire. The enemy comes from two sides',th:'badlands',w:12,h:9,hp:0.9,gold:190,p:[[[-1,2],[4,2],[4,6],[9,6],[9,9]],[[7,-1],[7,6],[9,6],[9,9]]],bk:[[1,5],[2,5],[5,4],[6,1],[10,1],[11,7],[2,8],[6,8],[10,4]]},
{n:'The Dread Wastes',d:'A dead land under a burning sky. Two armies, one castle',th:'hell',w:16,h:10,hp:0.88,gold:220,p:[[[-1,7],[4,7],[4,2],[7,2],[7,-1]],[[16,8],[12,8],[12,4],[9,4],[9,2],[7,2],[7,-1]]],bk:[[1,3],[2,3],[1,4],[6,5],[7,5],[6,6],[14,2],[14,3],[10,7],[9,9],[2,9],[15,0],[0,0],[11,1],[5,0],[13,6]]}];
// ---------- waves ----------
// WAVES[level] = its 20 waves, hand-designed (LEVELS[i].wv; read by waveQ() in js/09-game.js). A wave is "Name: group group ...", the name shows in the next-wave preview.
// A group is <count><letters>[/<gap>][@<road>]: count enemies, cycling through the letters (WC), gap seconds apart (default .8, also the wait after the
// previous group), @road sends the whole group down that road (levels with two breaches; otherwise they alternate). ~s waits s more seconds before the next group.
// E.g. "Wolf rush: 6n ~2 14f/.35" = 6 goblins, a 2 s lull, then 14 wolf riders in a tight pack; "12nnf/.6" = goblin, goblin, wolf rider, ... 0.6 s apart.
// Health per enemy is 30 × 1.2^wave × E[type].h × the level's hp, so the waves only set the mix and pacing. Check a table with npm run sim -- --waves N.
// Rhythm per five waves: an opener/new enemy, a swarm, a wolf rush or knight push, a heavier mixed wave, then a boss with an escort; the wave after a boss is a breather.
const WC={n:'norm',f:'fast',t:'tank',g:'guard',s:'shaman',v:'bat',p:'sapper',r:'troll',h:'ghost',i:'imp',z:'skel',k:'king',m:'ram',x:'necro',b:'boss'};
const WAVES=[
// 1 Greenmeadow: goblins, wolf riders and knights; Shieldbearers from wave 8, bats from wave 12
['First raid: 6n/1.2','Goblin band: 9n','Wolf riders: 6n 6f/.6','Mixed swarm: 14nnf/.6','The Goblin King: 6n 3t/1.4 ~2 1k 4n',
 'Wolf rush: 6n ~2 14f/.35','Knight push: 6n 4t/1.4 6nf/.6','Shield wall: 6g/1 10n 4f/.5','Mixed swarm: 18nfgn/.55 3t/1.3','Siege Ram: 8n 4t/1.2 ~2 1m 6nf/.6',
 'Breather: 14n/.7 8f/.5','Bats!: 12n 8v/.6 12nf/.6 2t/1.3','Knight push: 10n 6t/1.3 10ng/.7','Wolf rush: 8n ~1 16f/.3 ~3 16f/.3 4t/1.3','The King returns: 10n 4g/1 4t/1.3 ~2 1k 8nf/.6 6v/.6',
 'Breather: 20n/.6 10f/.5 6v/.6','Shield wall: 8g/.9 12n/.6 6t/1.2 8v/.6','Mixed swarm: 40nfgnvt/.4','Last stand: 16f/.3 ~2 10t/1.1 ~2 20nng/.5','The Dragon: 14n 8t/1.2 8v/.6 ~6 1b 14nf/.5'],
// 2 Darkwood: wolf packs and Ghosts in the trees; Sappers from wave 9
['Into the woods: 7n/1','Wolf pack: 5n 8f/.5','Goblin band: 12nnf/.7','Shadows: 8n 4h/1.2 2f','The Goblin King: 8nf/.6 3t/1.4 ~2 1k 6n',
 'Wolf rush: 6n ~2 16f/.3','Knight push: 6n 5t/1.3 6nh/.8','Night raid: 10nh/.7 8f/.4 4g/1','Sappers: 8n 5p/.9 8nf/.6 3t/1.3','The Necromancer: 10n 4t/1.3 ~2 1x 8nh/.7',
 'Breather: 14n/.7 8f/.5','Wolf rush: 8n ~1 14f/.3 ~3 14f/.3 3t/1.3','Shield wall: 6n 8g/.9 8nh/.7 4t/1.3','Mixed swarm: 30nfhpgn/.45 4t/1.2','Siege Ram: 10n 5t/1.2 ~2 1m 8nf/.6 6h/.8',
 'Breather: 18n/.6 10f/.5 4h/.8','Knight push: 10n 8t/1.1 10nh/.6 6f/.4','Night raid: 12h/.7 ~2 20f/.3 6p/.8 6g/.9 4t/1.2','Last stand: 18f/.3 ~2 10t/1.1 ~2 18nnh/.5','The Dragon: 12n 6t/1.3 4h/.9 ~8 1b ~4 10nf/.6'],
// 3 Emberwood: Trolls from wave 6, Sappers, bats out of the smoke
['Out of the smoke: 7n/1','Goblin band: 10nnf/.7','Wolf riders: 6n 8f/.5','Knight patrol: 8n 3t/1.4 2f','Siege Ram: 8nf/.6 4t/1.3 ~2 1m 6n',
 'Trolls: 8n 3r/1.6 6nf/.6','Wolf rush: 6n ~2 18f/.3 2t/1.3','Sappers: 8n 6p/.8 4g/1 4t/1.3','Mixed swarm: 24nfgp/.5 2r/1.6','The Goblin King: 10n 5t/1.2 ~2 1k 8nf/.6 2r/1.6',
 'Breather: 16n/.7 8f/.5','Troll march: 10n 6r/1.5 8nf/.6 4p/.8','Bats: 10n 6v/.7 6t/1.2 10nf/.6','Wolf rush: 8n ~1 16f/.3 ~3 16f/.3 4t/1.2 2r/1.5','The Dragon: 12n 5t/1.2 ~2 1b 10nf/.6 4v/.8',
 'Breather: 20n/.6 10f/.5 6p/.8','Knight push: 10n 9t/1.1 10ng/.6 2r/1.5','Mixed swarm: 42nfgntpn/.4','Last stand: 18f/.3 ~2 6r/1.3 ~2 8t/1.1 16nnp/.5','The Dragon: 14n 6t/1.3 4v/.8 ~8 1b ~4 10nf/.6'],
// 4 Mirefen: Goblin Shamans from wave 4, bats from the reeds, Trolls
['Bog goblins: 8n/1','Wolf riders: 6n 6f/.5','Goblin band: 14nnf/.6','Shamans: 8n 3s/1.2 4nf/.6','The Necromancer: 10n 3t/1.3 ~2 1x 6nf/.6',
 'Swarm from the reeds: 8n 10v/.5 6nf/.6','Trolls: 8n 4r/1.5 2s/1.2 6n','Wolf rush: 8n ~2 20f/.3 3t/1.3','Knight push: 8n 6t/1.2 3s/1 6nf/.6','The Goblin King: 10n 4t/1.2 3s/1 ~2 1k 8nv/.6 2r/1.5',
 'Breather: 16n/.7 10f/.5','Shield wall: 8g/.9 4s/1 10nf/.6 4t/1.3','Troll march: 10n 6r/1.4 3s/1 8nv/.6 4f/.4','Mixed swarm: 36nfsgvt/.45','Siege Ram: 12n 6t/1.2 4s/1 ~2 1m 10nf/.6 6v/.6',
 'Breather: 20n/.6 12f/.5 6v/.6','Swarm from the reeds: 12n 16v/.4 8t/1.1 4s/1 6f/.4','Troll march: 12n 8r/1.3 5s/.9 10nf/.5 4g/1','Last stand: 20f/.3 ~2 8t/1.2 4s/1 ~2 20nnv/.5','The Dragon: 12n 6t/1.3 3s/1 ~8 1b ~4 10nf/.6 2r/1.4'],
// 5 Ashfall: Sappers in the ruins, Shieldbearers
['Scavengers: 8n/1','Wolf riders: 6n 7f/.5','Sappers: 8n 4p/.9 2f','Shield wall: 6n 4g/1 4nf/.6','Siege Ram: 8n 4t/1.3 ~2 1m 6np/.7',
 'Wolf rush: 6n ~2 18f/.3 3p/.8','Knight push: 8n 5t/1.3 6np/.7','Bats over the ruins: 8n 10v/.5 4g/1 3t/1.3','Mixed swarm: 28nfgp/.5','The Necromancer: 10n 5t/1.2 ~2 1x 10np/.6 3g/1',
 'Breather: 16n/.7 10f/.5','Sapper raid: 10n 10p/.6 6t/1.2 6f/.4','Trolls: 10n 5r/1.4 4s/1 6nf/.6 4g/1','Wolf rush: 8n ~1 18f/.3 ~3 18f/.3 4t/1.2','The Goblin King: 12n 6t/1.2 4g/1 ~2 1k 10np/.6',
 'Breather: 20n/.6 12f/.5 4p/.8','Shield wall: 12g/.8 10n 6t/1.2 4v/.8','Sapper raid: 14n 14p/.5 8t/1.1 4v/.8 3r/1.4','Last stand: 20f/.3 ~2 6r/1.3 ~2 10t/1.1 16nnp/.5','The Dragon: 14n 6t/1.3 4g/.9 ~8 1b ~4 10np/.6 3v/.8'],
// 6 Barrow Moor: skeleton hordes, Ghosts and Necromancers
['Restless dead: 6n 4z/.7','Goblin band: 12nnf/.7','Ghosts: 8n 5h/1','Wolf riders: 8n 10f/.45','The Necromancer: 8n 4t/1.3 ~2 1x 8nh/.7',
 'Bone horde: 24z/.35 6n','Knight push: 8n 6t/1.2 6nh/.7','Ghost lights: 10n 6h/.9 4v/.8 3t/1.3','Mixed swarm: 30nfhgs/.45','The Goblin King: 12n 5t/1.2 4h/.9 ~2 1k 10nz/.5',
 'Breather: 18n/.7 10z/.5','Wolf rush: 8n ~1 18f/.3 ~3 18f/.3 4h/.9','Bone horde: 36z/.3 6t/1.2 4s/1','Night of ghosts: 10h/.8 10n 6t/1.2 3v/.9','The Necromancer: 14n 6t/1.2 6h/.8 ~2 1x 12nz/.5',
 'Breather: 20n/.6 12f/.5 8z/.5','Troll march: 12n 6r/1.3 4s/1 8nh/.6 6g/.9','Mixed swarm: 36nfhgzts/.45','Last stand: 16f/.3 ~2 8t/1.2 ~2 8h/.7 18zzn/.4','The Last Necromancers: 12n 6t/1.3 4h/.9 ~6 1x 2s/1 ~8 1x ~4 10nz/.5'],
// 7 Scorched Badlands (two roads, @0 west, @1 north): Fire Imps from wave 3, pincer attacks
['Two fronts: 8n/1','Wolf riders: 6n 8f/.5','Fire imps: 8n 6i/.7','Pincer: 10f/.35@0 8n/.8@1 2t/1.3@1','Siege Ram: 10n 4t/1.3 ~2 1m@1 8ni/.6',
 'Imp swarm: 6n 16i/.4 4f/.4','Knight push: 10n 6t/1.2@1 8nf/.5@0','Bats: 10n 12v/.45 4g/1 4i/.6','Mixed swarm: 32nfigp/.45','The Dragon: 12n 6t/1.2 ~2 1b@0 10ni/.5 4s/1',
 'Breather: 18n/.7 10i/.5','Pincer: 18f/.3@0 ~1 8t/1.1@1 10ni/.5','Trolls: 10n 6r/1.3 4s/1 8ni/.6 4g/1','Wolf rush: 10n ~1 20f/.3 ~3 20f/.3 4t/1.2','The Goblin King: 14n 6t/1.2 6i/.6 ~2 1k@1 12nf/.5 4s/1',
 'Breather: 22n/.6 12i/.5','Imp swarm: 10n 18i/.35 8t/1.1','Pincer: 20f/.3@0 10t/1.1@1 ~2 12ng/.5@0 4v/.8','Last stand: 18f/.3 ~2 9t/1.2 3s/1 ~2 18nni/.45','The Dragon and the King: 12n 6t/1.3 4i/.6 ~6 1k@1 ~8 1b@0 ~4 10nf/.5'],
// 8 The Dread Wastes (two roads, @0 west, @1 east): everything at once
['Two armies: 10n/.9','Wolf riders: 8n 8f/.45','Fire and shadow: 8n 4i/.7 4h/.9','Pincer: 12f/.35@0 8n/.8@1 3t/1.3@1','The Necromancer: 10n 4t/1.3 ~2 1x 10nh/.6',
 'Imp swarm: 8n 16i/.4 4p/.8','Knight push: 10n 7t/1.2@1 8nf/.5@0','Bats: 12n 8v/.6 4g/1 4s/1','Mixed swarm: 35nfighp/.4','Siege Ram: 12n 6t/1.2 ~2 1m 10ni/.5 4r/1.3',
 'Breather: 20n/.7 12f/.5','Pincer: 20f/.3@0 ~1 8t/1.1@1 12ni/.5 4s/1','Bone horde: 36z/.3 8t/1.1 6h/.8','Troll march: 12n 7r/1.3 5s/.9 10np/.5 4v/.8','The Dragon: 16n 7t/1.2 6h/.8 ~2 1b@0 12ni/.5 3v/.9',
 'Breather: 24n/.6 12i/.5 4v/.8','Shield wall: 10g/.8@1 16f/.3@0 6t/1.2 4s/1','Mixed swarm: 40nfighpnt/.4','Last stand: 18f/.3 ~2 8t/1.2 ~2 4r/1.3 16nnh/.45','Twin dragons: 12n 6t/1.3 4h/.9 ~8 1b@0 ~10 1b@1 ~4 3s/1 10nfi/.5']];
LEVELS.forEach((l,i)=>l.wv=WAVES[i]);
// environments: sky gradient, fog, lights, ground colours [light, mid, dark, rock, dirt], vegetation and ambient particles (mo)
const THEMES={
meadow:{sky:['#4b6a8a','#9fb2c2','#d8c8a6'],fog:0xa8b3bc,fn:9,ff:42,hemi:[0xc4d2e2,0x8a7a5a,.9],sun:[0xf6dcb6,1.55],ex:1.05,orb:0xfff2cc,gr:[0x86a052,0x5e7d3c,0x405c33,0x8a8578,0x7a6244],bd:0xdadfc8,rd:0xffffff,
 gs:[70,95,60,50,62,'#2c5e1e'],gn:[650,1100],gc:[0xffffff,0xe3f5c0,0xc9ec9a,0xb7e08a],fl:['#ffffff','#ffd93c','#ff5a5a','#c08bff','#ff8ec0','#7ab8ff'],tr:70,tk:[0,1,0,2,1,3],bu:44,rk:26,fly:9,cl:[7,0xffffff],hl:1,sat:1,tint:[1,1,1]},
darkwood:{wc:0x1e3c3c,rc:0x7e8474,sky:['#16211f','#34463e','#56604a'],fog:0x2e3c34,fn:3,ff:28,hemi:[0x7a948c,0x2a3020,.75],sun:[0xc4d4b4,.95],ex:1.05,orb:0x9ab8a0,gr:[0x52683a,0x3a4c2c,0x24321e,0x5e6058,0x4a3a28],bd:0x8a9a78,rd:0xc4bcaa,
 gs:[85,110,45,38,50,'#1e4020'],gn:[550,1000],gc:[0xd0dcc8,0xb4c8a8,0x9cb490],fl:['#cfe0ff','#ffffff'],tr:240,tk:[6,6,1,6,4,6,6,1],pine:[0x1f4a2c,0x2f6a3c,0x255c34],leaf:[0x2f6a36,0x3c7a40,0x285a30],bu:70,rk:30,fly:0,cl:[0],hl:1.2,sat:.92,tint:[.96,1,.98],
 mo:[{k:'ff',n:70,c:0xc8ff6a,s:.09}]},
burning:{wc:0x34383a,gt:'dirt',rc:0x5e5650,sky:['#24140f','#6e3420','#c8683a'],fog:0x5e3626,fn:5,ff:32,hemi:[0xd09070,0x3a2418,.75],sun:[0xffa060,1.3],ex:1.05,orb:0xff9a50,gr:[0x6b5a34,0x4a3c26,0x2a2018,0x5a524a,0x1e1814],bd:0xbca88a,rd:0xb0a090,
 gs:[32,48,50,48,60,'#5a4420'],gn:[380,550],gc:[0xffffff,0xe8d8b0,0xc8b088],fl:[],tr:120,tk:[5,4,5,7,4,5,7],bu:0,rk:30,fly:0,cl:[9,0x2e2422],smk:0x4a4442,hl:1,sat:.95,tint:[1.05,.97,.9],
 mo:[{k:'emb',n:130,c:0xff9a3a,s:.07},{k:'ash',n:70,c:0x8a8078,s:.06}]},
marsh:{wc:0x34442c,rc:0x86867a,sky:['#323c38','#66725f','#949a80'],fog:0x6a7464,fn:2,ff:28,hemi:[0xa0ae9c,0x3e4030,.85],sun:[0xdcdcbc,1.1],ex:1.05,orb:0xd8dcc0,gr:[0x6a7040,0x4c5430,0x343a24,0x6a6a5e,0x3e3a26],bd:0xb6ba9c,rd:0xb8b098,
 gs:[55,80,40,52,64,'#5a6a30'],gn:[480,1500],gc:[0xffffff,0xe0e0b8,0xc0c498,0xa8ac80],fl:['#ffffff'],tr:60,tk:[4,4,8,4,1,8],leaf:[0x56683a,0x6a7a44,0x4a5a30],bu:40,rk:16,fly:0,cl:[6,0x8e938a],hl:.35,sat:.86,tint:[.97,1.02,.95],
 mo:[{k:'ff',n:36,c:0x9affc8,s:.11}]},
ruins:{wc:0x3a4246,gt:'dirt',rc:0x6e6a64,sky:['#353130','#6e6862','#a0948a'],fog:0x7e7874,fn:5,ff:34,hemi:[0xb0aaa4,0x4a4038,.85],sun:[0xe8d8c0,1.25],ex:1.05,orb:0xe0d0c0,gr:[0x6e6a60,0x57544c,0x3c3a36,0x7a766e,0x2a2622],bd:0xb4b0a4,rd:0xc4bcac,
 gs:[40,55,22,48,58,'#56523e'],gn:[260,380],gc:[0xffffff,0xd8d4c8,0xb8b4a8],fl:[],tr:40,tk:[4,4,5,4],bu:0,rk:40,fly:0,cl:[8,0x5e5854],smk:0x6a6662,peb:160,hl:1,sat:.72,tint:[1,.98,.95],
 mo:[{k:'ash',n:180,c:0xc4c0ba,s:.06}]},
moor:{wc:0x26303c,rc:0x76727e,sky:['#17142a','#463858','#86687a'],fog:0x463c54,fn:3,ff:30,hemi:[0x948ab8,0x2a2430,.85],sun:[0xc4b8e8,1.1],ex:1.08,orb:0xd8d0ff,gr:[0x58603e,0x40482e,0x2c3022,0x625e66,0x3a3028],bd:0xaaa89a,rd:0xaca4a4,
 gs:[70,95,28,40,52,'#2e3a24'],gn:[500,900],gc:[0xffffff,0xd8d8d0,0xc0c0b8],fl:[],tr:60,tk:[4,4,4,8],leaf:[0x3e4a38,0x4a5640,0x343e30],bu:20,rk:30,fly:0,cl:[6,0x3a3448],hl:.8,sat:.86,tint:[.97,.97,1.05],
 mo:[{k:'ff',n:40,c:0x8adcff,s:.12}]},
badlands:{wc:0x4a3c2c,gt:'dirt',rc:0xa06a4c,sky:['#341a12','#924424','#dc9c5c'],fog:0x8e5236,fn:5,ff:34,hemi:[0xe0a080,0x4a2418,.8],sun:[0xffb070,1.5],ex:1.0,orb:0xffc080,gr:[0xa0603a,0x7a4428,0x4a2818,0x8a6a58,0x3a1e14],bd:0xc8aa8c,rd:0xbc9c7c,
 gs:[30,42,45,50,60,'#6a4a28'],gn:[120,200],gc:[0xffffff,0xe0c8a0],fl:[],tr:30,tk:[4,4,5],bu:0,rk:50,fly:0,cl:[5,0x5e3424],smk:0x8a7a70,peb:200,hl:1.5,sat:.92,tint:[1.05,.96,.9],
 mo:[{k:'emb',n:70,c:0xff8a3a,s:.06},{k:'dust',n:90,c:0xd09a70,s:.07}]},
hell:{wc:0x2a1a18,gt:'dirt',rc:0x342e2e,sky:['#080303','#300a07','#7e1e0e'],fog:0x260b07,fn:4,ff:30,hemi:[0x9a5a52,0x200808,.8],sun:[0xff7050,1.2],ex:1.1,orb:0xff6040,gr:[0x3e3434,0x2c2424,0x181414,0x4a4040,0x0e0a0a],bd:0x948480,rd:0x928888,
 gs:[0,10,20,22,30,'#1a1010'],gn:[0,0],gc:[0xffffff],fl:[],tr:26,tk:[5,4,4],bu:0,rk:40,fly:0,cl:[8,0x160806],smk:0x3a3030,peb:220,hl:1.7,sat:.95,tint:[1.06,.94,.92],
 mo:[{k:'emb',n:160,c:0xff6a2a,s:.07},{k:'ash',n:90,c:0x4a4040,s:.06}]}};
// the level is picked before anything is built (the whole scene is built once at load): ?level=N in the URL, else the last level chosen in the menu
const LVN=(()=>{let n=0;try{n=+new URLSearchParams(location.search).get('level')||+localStorage.getItem('sflv')||1;}catch(e){n=1;}return clamp(Math.round(n)||1,1,LEVELS.length)-1;})();
const LV=LEVELS[LVN],TH=THEMES[LV.th],W=LV.w,H=LV.h;
const PATHS=LV.p.map(q=>q.map(p=>[p[0]*S+S/2,p[1]*S+S/2])),WP=PATHS[0];
// rem[i] = road length from waypoint i to the gate
for(const R of PATHS){R.rem=[0];for(let i=R.length-2;i>=0;i--)R.rem.unshift(R.rem[0]+Math.hypot(R[i+1][0]-R[i][0],R[i+1][1]-R[i][1]));}
// flyers' routes: one straight line per breach, from where its road enters to the gate, with the same rem (road length left) as PATHS
const FPATHS=PATHS.map(R=>{const F=[R[0],R[R.length-1]];F.rem=[Math.hypot(F[1][0]-F[0][0],F[1][1]-F[0][1]),0];return F;});
const road=new Set(),blk=new Set(LV.bk.map(b=>b[0]+','+b[1]));
for(const WPp of PATHS)for(let i=0;i<WPp.length-1;i++){const a=WPp[i],b=WPp[i+1],f=v=>Math.round((v-S/2)/S);
for(let c=Math.min(f(a[0]),f(b[0]));c<=Math.max(f(a[0]),f(b[0]));c++)for(let r=Math.min(f(a[1]),f(b[1]));r<=Math.max(f(a[1]),f(b[1]));r++)road.add(c+','+r);}
const T={arrow:{n:'Archers',ic:'🏹',c:50,r:130,d:10,f:.5,dt:'phys',air:1},cannon:{n:'Catapult',ic:'🪨',c:100,r:110,d:30,f:1.4,dt:'phys',sp:55,bs:260,arc:1},frost:{n:'Wizard',ic:'🔮',c:110,r:115,d:8,f:3,dt:'magic',air:1},
ballista:{n:'Ballista',ic:'🎯',c:125,r:190,d:66,f:2.2,dt:'phys',pr:1,air:1,bs:520,tm:'strong'},storm:{n:'Storm Tower',ic:'⚡',c:150,r:105,d:16,f:1,dt:'light',air:1,ch:5},alch:{n:'Alchemist',ic:'🧪',c:90,r:115,d:7.8,f:1.1,dt:'fire',bs:240,arc:1},
banner:{n:'Banner Tower',ic:'🚩',c:120,r:120,d:0,f:99,sup:1},vault:{n:'Treasury',ic:'💰',c:150,r:40,d:0,f:99,inc:15},
// bar = Barracks: built next to the road, sends BAR.n soldiers to a rally point on the road within r; d/f = each soldier's sword hit and swing time (BAR and soldiers() in js/09-game.js)
barracks:{n:'Barracks',ic:'⚔️',c:90,r:130,d:7,f:1,dt:'phys',bar:1}};
// upgrade branches: the level-3 upgrade of these towers is a choice of two (t.br = 0/1; brn(t) in js/09-game.js gives the picked one). Numbers on top of the normal level 3:
// dm/fm = damage/reload multiplier, rg = extra range, pr = pierces armour, ch = extra chain jumps, stn = stun per lightning hit (bosses a third),
// bd = Catapult damage on the target it was aimed at (splash sp around it), fz = Catapult burning ground [radius, seconds, share of the shot's damage per second, fire],
// grp = Wizard banishes everyone within that distance of its target, tz = Wizard time field [radius, seconds, speed left] instead of banishing,
// sk = Ballista bolt also hits up to that many enemies in a line behind its target, gs = damage multiplier on big enemies (bosses and E.h >= 1.8),
// ac = Alchemist acid: seconds an enemy it hits has no physical armour (and takes ACID extra physical damage, dmul()), pl = poison spreads this far when a poisoned enemy dies,
// hs = Banner: extra attack speed for towers in range, hr = Banner: towers in range ignore every resistance below 1 (immunities stay),
// shp = Barracks soldier health multiplier, arm = share of enemy damage a soldier shrugs off, sn = number of soldiers, rsf = respawn time multiplier,
// it = Treasury interest at the end of a wave [share of your gold, most per wave], bty = Treasury: extra share of gold for enemies killed in its range
const BRN={arrow:[{n:'Longbowmen',ic:'🎯',ds:'Longbows reach much further.',rg:40},{n:'Crossbow Nest',ic:'🔩',ds:'Heavy bolts pierce armour and hit harder.',pr:1,dm:1.3}],
cannon:[{n:'Fire Pots',ic:'🔥',ds:'Clay pots of burning pitch set the ground on fire for a few seconds.',fz:[50,3,.3]},{n:'Boulder',ic:'🪨',ds:'A huge boulder crushes the enemy it lands on; the splash is a little smaller.',bd:3,sp:48}],
frost:[{n:'Archmage',ic:'✨',ds:'Banishes its target and every enemy close to it.',grp:60},{n:'Time Warden',ic:'⏳',ds:'Stops banishing. Each shot leaves a field of slowed time that holds enemies back.',tz:[80,4,.4]}],
storm:[{n:'Tempest',ic:'🌪️',ds:'Lightning jumps between many more enemies.',ch:4},{n:'Thunderlord',ic:'🔨',ds:'Slower, heavier strikes that stun every enemy in the chain.',ch:-1,dm:2,fm:1.7,stn:1.2}],
ballista:[{n:'Skewer',ic:'🗡️',ds:'Bolts punch straight through, hitting every enemy in a line behind the target.',sk:3},{n:'Giant Slayer',ic:'💀',ds:'Double damage to bosses, Black Knights, Trolls and other big enemies.',gs:2}],
alch:[{n:'Acid Brew',ic:'⚗️',ds:'Acid eats armour: enemies it hits lose their physical resistance and take extra physical damage for a while.',ac:4},{n:'Plague',ic:'☠️',ds:'When a poisoned enemy dies, the poison spreads to the enemies around it.',pl:65}],
banner:[{n:'War Drums',ic:'🥁',ds:'Towers in range also attack faster.',hs:.2},{n:'Blessed Standard',ic:'🌟',ds:'Towers in range ignore enemy resistances (but not immunities).',hr:1}],
barracks:[{n:'Knights\' Hall',ic:'🐎',ds:'Three armoured knights: much tougher, harder-hitting, and they shrug off part of every blow – even a boss\'s.',shp:2.2,dm:1.6,arm:.5},{n:'Warband',ic:'🪓',ds:'Four axe fighters instead of three, and a fallen one is back twice as fast.',sn:4,rsf:.5}],
vault:[{n:'Royal Bank',ic:'🏦',ds:'Also pays interest on your unspent gold at the end of each wave.',it:[.05,60]},{n:'Bounty Office',ic:'📜',ds:'Enemies killed within its range give extra gold.',bty:.3,rg:70}]};
// Acid Brew: extra physical damage while an enemy's armour is eaten away (e.ac > 0)
const ACID=.15;
// air = can hit flying enemies (E[type].fy); Catapult and Alchemist can't
// damage types: every attacking tower deals one (T[k].dt); pr = pierces armour (ignores physical resistance). An enemy's rs = the share of a type's damage it shrugs off
// (negative would mean it takes extra). Nothing resists lightning, so the Storm Tower ignores armour. dmul() in js/09-game.js applies it
const DTY={phys:['Physical','⚔️'],magic:['Magic','🔮'],fire:['Fire & poison','🔥'],light:['Lightning','⚡']};
const E={norm:{s:50,h:1,rw:5,r:11,col:0x7ed957,rs:{}},fast:{s:90,h:.6,rw:5,r:9,col:0x8b9bb8,rs:{}},tank:{s:35,h:1.8,rw:10,r:14,col:0x8fa6c8,rs:{phys:.5}},boss:{s:30,h:12,rw:50,r:18,col:0xe8483c,rs:{fire:.5},bs:1,lv:5},
// shd = share of Archer/Ballista damage the Shieldbearer's tower shield blocks from the front (shBlk() in js/09-game.js); hl = the Shaman's heal per pulse (heal())
guard:{s:40,h:1.4,rw:8,r:12,col:0x9a7a4a,rs:{},shd:.75},
// fy = flies at that height, straight from its breach to the gate (FPATHS), and only towers with air can hit it
bat:{s:60,h:.6,rw:5,r:10,col:0x5a3a40,rs:{},fy:1.05},
// sap = Sapper: runs at a tower near the road and blows up, stunning it (sapMove() in js/09-game.js); spl = Troll: splits into that many goblins when killed (trollSplit())
sapper:{s:65,h:.7,rw:6,r:10,col:0x71903c,rs:{},sap:1},troll:{s:30,h:2,rw:12,r:16,col:0x7d8a6a,rs:{},spl:2},
// phz = Ghost: fades out of reach for PHZ.d s every PHZ.cd s (js/09-game.js); the Fire Imp's rs of 1 makes it immune to fire & poison (towers skip enemies they can't hurt)
// bosses (bs; lv = lives lost if it reaches the gate): sum = Goblin King, goblins per summon (summon()); rz = Necromancer, skeletons per raise (raise()); skel = what it raises
king:{s:32,h:8,rw:50,r:18,col:0x71903c,rs:{},bs:1,lv:5,sum:2},ram:{s:22,h:9,rw:60,r:18,col:0x8a6a44,rs:{phys:.25},bs:1,lv:10},necro:{s:30,h:7,rw:50,r:16,col:0x3a2a44,rs:{magic:.5},bs:1,lv:5,rz:2},
skel:{s:42,h:.6,rw:1,r:10,col:0xd8d0bc,rs:{}},
ghost:{s:48,h:1.1,rw:7,r:11,col:0xcfe6ee,rs:{},phz:1},imp:{s:70,h:.8,rw:6,r:9,col:0xff7a2a,rs:{fire:1}},shaman:{s:45,h:.9,rw:9,r:11,col:0x7cff4a,rs:{},hl:.03}};
const P={st:0xece5d6,st2:0xd2c8b4,st3:0xf7f2e6,wd:0xc98a4b,wd2:0x8a5a2e,rd:0xe8483c,bl:0x3f86e0,pu:0x9a5be0,gd:0xffc93c,gr:0x7ed957};
// game coords (pixels, origin at the board's top-left) → world; cell → world centre; HX/HZ = wall lines
const wx=x=>(x-W*S/2)/S,wz=y=>(y-H*S/2)/S,cx=c=>c-(W-1)/2,cz=r=>r-(H-1)/2,HX=W/2+.17,HZ=H/2+.17;
// breaches and the gate: where a road crosses the wall. The castle and the breach scenery were modelled for a gate on the east wall at z=2.5 and a breach on the west wall at z=-2.5,
// so each gets a frame: rot turns those original coordinates to face the right way, CW()/BW() map original coordinates into the world
function edge(p,gate){const[c,r]=p,sd=c<0?'W':c>=W?'E':r<0?'N':'S',x=sd=='W'?-HX:sd=='E'?HX:cx(c),z=sd=='N'?-HZ:sd=='S'?HZ:cz(r);
return{sd,c,r,x,z,rot:gate?{E:0,N:PI/2,S:-PI/2,W:PI}[sd]:{W:0,N:-PI/2,S:PI/2,E:PI}[sd]};}
const ENT=LV.p.map(q=>edge(q[0])),GATE=edge(LV.p[0][LV.p[0].length-1],1);
const frame=(o,lx,lz)=>{const c=Math.cos(o.rot),s=Math.sin(o.rot);return{x:o.x+lx*c+lz*s,z:o.z-lx*s+lz*c};};
const CW=(x,z)=>frame(GATE,x-6.17,z-2.5),BW=(x,z,i)=>frame(ENT[i||0],x+6.17,z+2.5);
const toC=(x,z)=>{const dx=x-GATE.x,dz=z-GATE.z,c=Math.cos(GATE.rot),s=Math.sin(GATE.rot);return{x:dx*c-dz*s+6.17,z:dx*s+dz*c+2.5};};
const toB=(x,z,i)=>{const o=ENT[i||0],dx=x-o.x,dz=z-o.z,c=Math.cos(o.rot),s=Math.sin(o.rot);return{x:dx*c-dz*s-6.17,z:dx*s+dz*c-2.5};};
// default camera: looks from the south, or from the north when the castle sits on the south side so it doesn't block the view
const CAM0=(()=>{const a=GATE.sd=='S'?PI:0,cs=[CW(7.1,-.9),CW(13.9,5.9)],x0=Math.min(-HX,cs[0].x,cs[1].x),x1=Math.max(HX,cs[0].x,cs[1].x),z0=Math.min(-HZ,cs[0].z,cs[1].z),z1=Math.max(HZ,cs[0].z,cs[1].z);
const sx=GATE.sd=='E'||GATE.sd=='W'?x1-x0:2*HX,sz=2*HZ+(GATE.sd=='N'||GATE.sd=='S'?3:0);
const ew=GATE.sd=='E'||GATE.sd=='W';
return{az:a,pol:.85,tx:ew?(x0+x1)/4:0,tz:(ew?0:(z0+z1)/4)+(a?-.3:.3),dist:Math.max(20*sx/20.1,20*sz/9.5,15),bb:{x0,x1,z0,z1}};})();
