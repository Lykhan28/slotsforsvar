
const $=id=>document.getElementById(id),S=60,MAXW=20,PI=Math.PI,rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// ---------- levels ----------
// w×h board cells; p = one road per breach, as cell waypoints (first point outside the wall = breach, last = castle gate; all roads share the gate); bk = cells nobody can build on
// th = environment (THEMES below); hp = enemy health multiplier; gold = starting gold; mc = the level's own mechanic (MECH below), bg = Mirefen's bog road cells, ru = Ashfall's shortcut, gv = Barrow Moor's graves,
// hv = Harvest Vale's wheat fields (free cells), ld = Saltcliff Cove's landing (a road cell)
const LEVELS=[
{n:'Greenmeadow',d:'Peaceful fields on the edge of the kingdom',th:'meadow',w:12,h:8,hp:1,gold:120,p:[[[-1,1],[9,1],[9,3],[2,3],[2,6],[12,6]]],bk:[]},
{n:'Darkwood',d:'An old forest where little light gets through',th:'darkwood',w:10,h:7,hp:0.95,gold:130,mc:'fog',p:[[[2,-1],[2,4],[6,4],[6,1],[10,1]]],bk:[[4,2],[0,5],[8,3],[4,6]]},
{n:'Emberwood',d:'The forest is burning and the villages are gone',th:'burning',w:13,h:8,hp:0.9,gold:140,mc:'fire',p:[[[10,8],[10,5],[3,5],[3,2],[8,2],[8,-1]]],bk:[[5,4],[7,3],[1,6],[11,2],[0,1]]},
{n:'Mirefen',d:'Sunken bogs where nothing solid can be built',th:'marsh',w:14,h:9,hp:0.93,gold:150,mc:'bog',bg:[[2,2],[3,2],[5,4],[5,5],[8,6],[9,6]],p:[[[-1,2],[5,2],[5,6],[11,6],[11,9]]],bk:[[2,4],[3,4],[2,5],[8,3],[9,3],[8,4],[12,2],[13,3],[7,8],[1,7],[0,0]]},
{n:'Ashfall',d:'The ruins of a town, still smouldering',th:'ruins',w:11,h:7,hp:1.1,gold:160,mc:'ruin',ru:{w:7,t:8,c:[[4,3],[5,3],[6,3]],p:[[11,5],[7,5],[7,3],[3,3],[3,4],[-1,4]]},p:[[[11,5],[7,5],[7,1],[3,1],[3,4],[-1,4]]],bk:[[5,2],[9,3],[1,1],[9,0],[5,6],[0,6]]},
{n:'Barrow Moor',d:'Mist, graves and things that should stay buried',th:'moor',w:15,h:9,hp:0.8,gold:170,mc:'grave',gv:[[2,3],[5,6],[9,6]],p:[[[2,-1],[2,6],[12,6],[12,2],[15,2]]],bk:[[4,3],[5,3],[6,3],[8,4],[9,4],[10,3],[4,7],[7,8],[1,2],[14,5],[8,1],[0,8]]},
{n:'Scorched Badlands',d:'Cracked earth and rivers of fire. The enemy comes from two sides',th:'badlands',w:12,h:9,hp:0.9,gold:190,mc:'lava',p:[[[-1,2],[4,2],[4,6],[9,6],[9,9]],[[7,-1],[7,6],[9,6],[9,9]]],bk:[[1,5],[2,5],[5,4],[6,1],[10,1],[11,7],[2,8],[6,8],[10,4]]},
{n:'The Dread Wastes',d:'A dead land under a burning sky. Two armies, one castle',th:'hell',w:16,h:10,hp:0.88,gold:220,mc:'dark',p:[[[-1,7],[4,7],[4,2],[7,2],[7,-1]],[[16,8],[12,8],[12,4],[9,4],[9,2],[7,2],[7,-1]]],bk:[[1,3],[2,3],[1,4],[6,5],[7,5],[6,6],[14,2],[14,3],[10,7],[9,9],[2,9],[15,0],[0,0],[11,1],[5,0],[13,6]]},
{n:'Harvest Vale',d:'Golden fields and orchards – the harvest must not burn',th:'autumn',w:13,h:8,hp:1.45,gold:230,mc:'harvest',hv:[[5,5],[6,5],[5,6],[6,6],[10,1],[11,1],[10,2],[11,2]],p:[[[-1,6],[3,6],[3,1],[8,1],[8,5],[13,5]]],bk:[[5,3],[6,4],[1,2],[10,3],[11,7],[0,0]]},
{n:'Saltcliff Cove',d:'Sea cliffs where pirate ships wait in the bay',th:'coast',w:14,h:8,hp:1.45,gold:240,mc:'land',ld:[5,4],p:[[[-1,1],[5,1],[5,6],[10,6],[10,3],[14,3]]],bk:[[2,3],[3,4],[7,3],[8,2],[12,6],[13,0],[1,6]]},
{n:'Sunscorch Dunes',d:'Endless sand and old pillars. Two columns march out of the heat haze',th:'desert',w:13,h:9,hp:1.1,gold:250,mc:'mirage',p:[[[-1,7],[4,7],[4,4],[8,4],[8,6],[13,6]],[[2,-1],[2,2],[10,2],[10,6],[13,6]]],bk:[[6,3],[6,5],[1,4],[12,1],[0,0],[11,8],[2,5]]},
{n:'Frostpeak Hold',d:'A mountain fortress deep in the snow',th:'snow',w:14,h:9,hp:1.75,gold:260,mc:'cold',p:[[[-1,7],[3,7],[3,4],[11,4],[11,1],[6,1],[6,-1]]],bk:[[5,2],[8,2],[7,6],[1,5],[13,7],[12,0],[0,1],[9,8],[5,5]]},
{n:'Crystal Hollow',d:'A glade of singing crystals under a violet sky. Two roads meet at the gate',th:'crystal',w:15,h:9,hp:1.15,gold:270,mc:'crystal',p:[[[-1,1],[5,1],[5,6],[7,6],[7,9]],[[15,3],[10,3],[10,6],[7,6],[7,9]]],bk:[[2,3],[3,4],[8,2],[12,1],[13,6],[1,7],[7,3],[11,8],[4,8]]},
{n:'Wolfjaw Pass',d:'One narrow road winds between the rocks of the pass',th:'pass',w:16,h:9,hp:1.5,gold:280,mc:'rock',p:[[[-1,4],[2,4],[2,1],[6,1],[6,7],[10,7],[10,2],[13,2],[13,6],[16,6]]],bk:[[0,2],[1,6],[4,3],[4,5],[3,7],[8,0],[8,3],[8,5],[11,5],[12,8],[15,1],[14,4],[0,8],[5,8],[15,8]]},
{n:'Stormwatch Heights',d:'Wind, rain and lightning on the old standing stones. Two roads, one storm',th:'storm',w:15,h:10,hp:1.3,gold:300,mc:'bolt',p:[[[-1,8],[3,8],[3,5],[8,5],[8,8],[12,8],[12,4],[15,4]],[[5,-1],[5,2],[10,2],[10,4],[15,4]]],bk:[[1,3],[2,4],[6,7],[7,3],[10,6],[13,1],[14,7],[0,0],[11,9],[4,0]]},
{n:'The Sundered Realm',d:'The world breaks apart at the edge of the kingdom. The last stand',th:'void',w:16,h:10,hp:1,gold:320,mc:'rift',p:[[[-1,8],[3,8],[3,2],[6,2],[6,5],[8,5],[8,-1]],[[16,7],[12,7],[12,2],[10,2],[10,5],[8,5],[8,-1]]],bk:[[1,5],[5,4],[6,8],[9,7],[11,4],[14,3],[15,0],[0,1],[1,9],[13,9],[7,1],[9,2],[4,0],[14,9],[2,3],[15,5]]}];
// ---------- waves ----------
// WAVES[level] = its 20 waves, hand-designed (LEVELS[i].wv; read by waveQ() in js/09-game.js). A wave is "Name: group group ...", the name shows in the next-wave preview.
// A group is <count><letters>[/<gap>][@<road>]: count enemies, cycling through the letters (WC), gap seconds apart (default .8, also the wait after the
// previous group), @road sends the whole group down that road (levels with two breaches; otherwise they alternate). ~s waits s more seconds before the next group.
// E.g. "Wolf rush: 6n ~2 14f/.35" = 6 goblins, a 2 s lull, then 14 wolf riders in a tight pack; "12nnf/.6" = goblin, goblin, wolf rider, ... 0.6 s apart.
// Health per enemy is 30 × 1.2^wave × E[type].h × the level's hp, so the waves only set the mix and pacing. Check a table with npm run sim -- --waves N.
// Rhythm per five waves: an opener/new enemy, a swarm, a wolf rush or knight push, a heavier mixed wave, then a boss with an escort; the wave after a boss is a breather.
const WC={n:'norm',f:'fast',t:'tank',g:'guard',s:'shaman',v:'bat',p:'sapper',r:'troll',h:'ghost',i:'imp',z:'skel',c:'pirate',k:'king',m:'ram',x:'necro',b:'boss'};
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
 'Breather: 24n/.6 12i/.5 4v/.8','Shield wall: 10g/.8@1 16f/.3@0 6t/1.2 4s/1','Mixed swarm: 40nfighpnt/.4','Last stand: 18f/.3 ~2 8t/1.2 ~2 4r/1.3 16nnh/.45','Twin dragons: 12n 6t/1.3 4h/.9 ~8 1b@0 ~10 1b@1 ~4 3s/1 10nfi/.5'],
// 9 Harvest Vale: Sappers after the barns, Trolls in the corn, bats over the fields
['Raiders at the edge: 10n/.9','Wolf riders: 8n 8f/.45','Barn burners: 8n 5p/.8 4nf/.6','Shield wall: 6n 6g/.9 6nf/.6','The Goblin King: 10n 4t/1.3 ~2 1k 8nf/.6',
 'Wolf rush: 8n ~2 20f/.3 3t/1.3','Trolls in the corn: 8n 4r/1.5 8nf/.6','Bats over the barns: 10n 10v/.5 4g/1 4t/1.2','Mixed swarm: 34nfgpt/.45','Siege Ram: 12n 6t/1.2 ~2 1m 10np/.6 4g/1',
 'Breather: 18n/.7 10f/.5','Knight push: 10n 8t/1.1 10ng/.6','Barn burners: 12n 12p/.6 6t/1.2 4s/1','Wolf rush: 10n ~1 20f/.3 ~3 20f/.3 4t/1.2','The King returns: 14n 6t/1.2 4g/1 4s/1 ~2 1k 12nf/.5 4v/.8',
 'Breather: 22n/.6 12f/.5 6v/.7','Troll march: 12n 7r/1.3 4s/1 10np/.5 6g/.9','Mixed swarm: 42nfgpvtn/.4','Last stand: 20f/.3 ~2 10t/1.1 4r/1.3 ~2 18nng/.45','The Dragon: 14n 7t/1.2 6v/.7 ~8 1b ~4 12nf/.5 3r/1.4'],
// 10 Saltcliff Cove: a pirate landing – pirate crews (c) in most waves, Sappers with powder kegs, Shamans as sea witches, Trolls from the hold, a drowned captain (Necromancer)
['Landing party: 7n/.9 3c/1.1','Shore raiders: 6n 4c/.9 8f/.45','Powder kegs: 8n 5p/.8 6nf/.6','Sea witches: 8n 4s/1.1 6nf/.6','The Pirate King: 6n 6c/.8 4t/1.3 3s/1 ~2 1k 8cf/.6',
 'Bats from the caves: 8n 12v/.45 6nf/.6','Boarding party: 6n 8c/.7 6t/1.2 8cp/.6','Wolf rush: 8n ~2 20f/.3 4t/1.2','Mixed swarm: 34nfspgt/.45','The Drowned Captain: 12n 6t/1.2 4h/.9 ~2 1x 10nz/.5',
 'Breather: 18n/.7 10f/.5','Ogres from the hold: 10n 6r/1.4 4s/1 8nf/.6','Shield wall: 10g/.8 10n 6t/1.2 6v/.6','Powder kegs: 12n 14p/.5 8t/1.1 6f/.4','Siege Ram: 14n 7t/1.2 4s/1 ~2 1m 12np/.5 4v/.8',
 'Breather: 22n/.6 12f/.5 6v/.7','Boarding party: 6n 10c/.6 9t/1.1 12cg/.5 4r/1.3','Mixed swarm: 42nfspvgtn/.4','Last stand: 20f/.3 ~2 10t/1.1 4s/1 ~2 20ncp/.45','The Pirate King and the Dragon: 8n 8c/.6 7t/1.2 4s/1 ~6 1k ~8 1b ~4 12cf/.5'],
// 11 Sunscorch Dunes (two roads, @0 west, @1 north): Fire Imps out of the heat, desert riders, Sappers
['Out of the haze: 10n/.9','Desert riders: 8n 10f/.45','Sand imps: 8n 6i/.7 4nf/.6','Pincer: 12f/.35@0 8n/.8@1 3t/1.3@1','Siege Ram: 10n 5t/1.2 ~2 1m@0 8ni/.6',
 'Imp swarm: 8n 16i/.4 4p/.8','Sappers: 10n 8p/.6 4t/1.2 6nf/.5','Bats: 10n 12v/.45 4g/1 4i/.6','Mixed swarm: 34nfipgt/.45','The Dragon: 12n 6t/1.2 4i/.6 ~2 1b@1 10nf/.5 4s/1',
 'Breather: 20n/.7 10i/.5','Pincer: 20f/.3@0 ~1 8t/1.1@1 12ni/.5','Troll march: 12n 6r/1.3 4s/1 10np/.5','Wolf rush: 10n ~1 20f/.3 ~3 20f/.3 5t/1.2','The Goblin King: 14n 7t/1.2 6i/.6 ~2 1k@0 12nf/.5 4s/1',
 'Breather: 24n/.6 12i/.5 4v/.8','Sandstorm: 10n 20i/.35 8t/1.1 6v/.6','Mixed swarm: 44nfipgvtn/.4','Pincer: 22f/.3@0 10t/1.1@1 ~2 14ng/.5@0 6p/.7@1','Sun and fire: 14n 7t/1.2 6i/.6 ~6 1m@1 ~8 1b@0 ~4 12nf/.5'],
// 12 Frostpeak Hold: knights in the snow, frost Trolls, Ghosts in the blizzard, wolf packs
['Through the snow: 10n/.9','Wolf pack: 8n 10f/.45','Iron column: 8n 4t/1.3 4g/1','Frost trolls: 8n 3r/1.5 6nf/.6','The Goblin King: 10n 5t/1.2 3g/1 ~2 1k 8nf/.6',
 'Wolf rush: 8n ~2 22f/.3 3t/1.3','Ghosts in the blizzard: 10n 8h/.8 4t/1.2','Shield wall: 8g/.9 10n 6t/1.2 4s/1','Mixed swarm: 36nfghtr/.45','Siege Ram: 12n 6t/1.2 4g/1 ~2 1m 10nh/.6',
 'Breather: 20n/.7 10f/.5','Troll march: 10n 7r/1.3 4s/1 10nf/.5','Bats over the peaks: 12n 14v/.45 6t/1.2 4g/1','Wolf rush: 10n ~1 22f/.3 ~3 22f/.3 6t/1.1','The Necromancer: 14n 8t/1.1 6h/.8 ~2 1x 14nz/.45',
 'Breather: 24n/.6 14f/.45 6h/.8','Iron column: 12n 12t/1 10ng/.5 4s/1','Mixed swarm: 45nfghtsvn/.4','Last stand: 22f/.3 ~2 10t/1.1 5r/1.3 ~2 20nnh/.45','The Ice Dragon: 16n 8t/1.2 4r/1.3 ~8 1b ~4 1k 14nf/.5'],
// 13 Crystal Hollow (two roads, @0 west, @1 east): Ghosts, Shamans, bat clouds and skeletons drawn to the crystals
['Strange lights: 10n/.9','Wolf riders: 8n 10f/.45','Ghosts: 8n 6h/.9 4nf/.6','Pincer: 12f/.35@0 8n/.8@1 3t/1.3@1','The Necromancer: 10n 5t/1.2 4h/.9 ~2 1x@1 10nz/.5',
 'Bat cloud: 8n 14v/.45 6nf/.6','Shamans: 10n 6s/1 6t/1.2 6nf/.5','Bone horde: 30z/.35 6t/1.2 4h/.9','Mixed swarm: 36nfhsvgt/.45','The Goblin King: 14n 6t/1.2 4s/1 ~2 1k@0 12nf/.5 4h/.9',
 'Breather: 20n/.7 12f/.5','Pincer: 20f/.3@0 ~1 9t/1.1@1 12nh/.5','Troll march: 12n 7r/1.3 5s/.9 10nv/.5','Wolf rush: 10n ~1 22f/.3 ~3 22f/.3 6t/1.1','The Necromancer returns: 16n 8t/1.1 6h/.8 ~2 1x@0 16nz/.45 4s/1',
 'Breather: 24n/.6 14f/.45 8v/.6','Crystal ghosts: 14h/.7 12n 8t/1.1 6s/.9','Mixed swarm: 46nfhsvgtzn/.4','Pincer: 24f/.3@0 12t/1.1@1 ~2 16ng/.5@0 8h/.7@1','The Dragon and the Necromancer: 14n 8t/1.2 6h/.8 ~6 1x@1 ~8 1b@0 ~4 14nf/.5 4s/1'],
// 14 Wolfjaw Pass: one long road – wolf packs above all, Trolls, Sappers who loosen the rocks, Siege Rams
['Into the pass: 10n/.9','Wolf pack: 8n 12f/.4','Rockfall crews: 8n 6p/.7 4nf/.6','Knight patrol: 10n 5t/1.2 6nf/.6','Siege Ram: 10n 5t/1.2 4g/1 ~2 1m 10nf/.5',
 'Wolf rush: 8n ~2 24f/.28 4t/1.2','Trolls: 10n 5r/1.4 4s/1 6nf/.6','Bats in the gorge: 10n 14v/.45 4g/1 4t/1.2','Mixed swarm: 38nfgptr/.45','The Goblin King: 14n 7t/1.2 4g/1 ~2 1k 12nf/.5 4p/.7',
 'Breather: 20n/.7 14f/.45','The great pack: 12n ~1 26f/.28 ~3 12f/.3 6t/1.1','Rockfall crews: 12n 14p/.5 8t/1.1 6g/.9','Troll march: 12n 8r/1.3 5s/.9 12nf/.5','Siege Ram: 16n 8t/1.1 6g/.9 ~2 1m 14np/.5 4v/.8',
 'Breather: 24n/.6 16f/.4 6p/.7','Knight push: 12n 13t/1 12ng/.5 5s/.9','Mixed swarm: 48nfgptrvn/.4','Last stand: 26f/.28 ~2 12t/1.1 5r/1.3 ~2 22nnp/.45','Jaws of the pass: 16n 8t/1.2 5r/1.3 ~6 1k ~8 1b ~4 16nf/.45'],
// 15 Stormwatch Heights (two roads, @0 west – the long one, @1 north): bats in the rain, Fire Imps, pincers
['The storm breaks: 10n/.9','Wolf riders: 8n 10f/.45','Bats in the rain: 8n 10v/.5 4nf/.6','Pincer: 14f/.35@0 8n/.8@1 4t/1.3@1','The Dragon: 12n 5t/1.2 4v/.7 ~2 1b@0 10nf/.5',
 'Imp swarm: 8n 16i/.4 4p/.8','Knight push: 10n 7t/1.2@1 10nf/.5@0','Ghosts in the storm: 10n 8h/.8 4g/1 4s/1','Mixed swarm: 38nfighpt/.45','Siege Ram: 14n 7t/1.2 4s/1 ~2 1m@1 12ni/.5 4r/1.3',
 'Breather: 22n/.7 12f/.5','Pincer: 22f/.3@0 ~1 10t/1.1@1 12ni/.5 4s/1','Bone horde: 40z/.3 8t/1.1 6h/.8','Troll march: 14n 8r/1.3 5s/.9 12np/.5 6v/.7','The King and the Necromancer: 16n 8t/1.1 6h/.8 ~4 1k@0 ~6 1x@1 14nf/.45',
 'Breather: 26n/.6 14i/.45 6v/.7','Shield wall: 12g/.8@1 20f/.3@0 8t/1.1 5s/.9','Mixed swarm: 50nfighpntv/.38','Last stand: 24f/.28 ~2 12t/1.1 5r/1.3 ~2 22nnh/.42','Thunder dragons: 16n 8t/1.2 6v/.7 ~8 1b@0 ~10 1b@1 ~4 4s/1 14nfi/.45'],
// 16 The Sundered Realm (two roads, @0 west, @1 east): the last stand – everything, and every boss at once to finish
['The edge of the world: 12n/.85','Wolf riders: 10n 10f/.42','Fire and shadow: 8n 6i/.7 6h/.8','Pincer: 14f/.33@0 10n/.75@1 4t/1.2@1','The Necromancer: 12n 6t/1.2 4h/.8 ~2 1x 12nz/.45',
 'Imp swarm: 10n 18i/.38 6p/.7','Knight push: 12n 9t/1.1@1 10nf/.45@0','Bats from the void: 12n 14v/.42 6g/.9 4s/1','Mixed swarm: 40nfighpzt/.42','The Dragon: 16n 8t/1.1 6h/.8 ~2 1b@1 14ni/.45 4r/1.3',
 'Breather: 24n/.65 14f/.45','Pincer: 24f/.28@0 ~1 11t/1.05@1 14ni/.45 5s/.9','Bone horde: 44z/.28 10t/1 8h/.75','Troll march: 14n 9r/1.2 6s/.9 14np/.45 8v/.6','The King and the Ram: 18n 9t/1.05 6g/.9 ~4 1k@0 ~6 1m@1 16nf/.42',
 'Breather: 28n/.55 16i/.42 8v/.6','Shield wall: 14g/.75@1 22f/.28@0 10t/1 6s/.9','Mixed swarm: 54nfighpntvz/.36','Last stand: 26f/.26 ~2 14t/1 6r/1.2 ~2 24nnh/.4','The Last Host: 16n 8t/1.2 6h/.8 ~4 1x@1 ~6 1k@0 ~6 1m@1 ~8 1b@0 ~4 16nfi/.42']];
LEVELS.forEach((l,i)=>l.wv=WAVES[i]);
// the narrator's lines, one pair per level: [before the level, after winning it] – the tale of Sir Kirkevang and the Goblin King's war,
// shown on the parchment card (#sty, storyShow() in js/10-ui.js). A new level needs a pair here.
const STORY=[
["Sir Kirkevang had hung up his sword for a quiet life in Greenmeadow. Then goblin drums sounded in the hills, and the old knight saddled his horse once more.","The fields were safe – for now. Among the broken goblin shields, Sir Kirkevang found a banner he knew: the crown of the Goblin King. This was no raid. It was a war."],
["The trail led into Darkwood, where the trees grow so thick that noon looks like dusk. Sir Kirkevang lit the watchfires and waited for the eyes in the dark.","By dawn the forest was quiet again. A dying wolf rider laughed up at the knight: “Burn the woods, he said. The King wants them all burning.”"],
["The wolf rider had told the truth. Emberwood was ablaze, its villages were ash, and the horde marched through the smoke towards the last castle standing.","Sir Kirkevang led the villagers out of the flames. Behind them the fire burned itself out; ahead lay the marshes, and the King's army waiting in them."],
["In Mirefen every step sinks and every stone tilts. “Good,” said Sir Kirkevang. “Let the goblins wade. We will hold the dry ground.”","The bog swallowed the last of the raiders. Far to the east, smoke rose over Ashfall – the town Sir Kirkevang had once called home."],
["Ashfall was still smouldering when Sir Kirkevang rode through its gate. The goblins had come back for what was left, and he would not give them a single brick.","Ashfall was rubble, but it was rubble that belonged to its people. In the ruined temple, a priest whispered of graves that would not stay shut on Barrow Moor."],
["Mist crept over Barrow Moor, and something beneath the graves began to scratch. The Goblin King had found himself a necromancer.","The dead were laid back to rest, though the necromancer slipped away into the mist. Sir Kirkevang followed his scorched trail south, into the Badlands."],
["Rivers of fire cut the Badlands in two, and the horde came down both banks at once. Sir Kirkevang split his garrison and prayed that the walls would hold.","Both armies broke against the castle. In the cooling lava the knight found the tracks of something enormous – a dragon, flying for the Dread Wastes."],
["Nothing grows in the Dread Wastes, and the sky burns red at midday. Here the Goblin King had gathered two armies, and a dragon to lead them.","The dragon fell, and the King's armies scattered like ash on the wind. But the King himself was gone, and the harvest lands lay open."],
["In Harvest Vale the wheat stood tall and the orchards hung heavy. “Not one field burns,” Sir Kirkevang told the farmers. “Not while I can still lift a sword.”","The harvest was saved, and the barns were full for winter. Then a fisherman galloped in from the coast with news of black sails in Saltcliff Cove."],
["Pirates had joined the horde, and their ships rode at anchor below the cliffs. Sir Kirkevang watched the first boats row ashore and drew his sword.","The last pirate ship limped out to sea with an empty hold. A captured chart showed where it had come from: the burning dunes to the south."],
["The desert shimmers in the heat, and not every soldier on the horizon is real. Sir Kirkevang told his archers to trust their arrows, not their eyes.","The mirages faded in the evening wind. Among the old pillars, the knight found the King's orders: take the mountain fortress before the snow closes the pass."],
["Frostpeak Hold guards the only road over the mountains. If it falls, the kingdom falls with it. Sir Kirkevang lit every brazier and waited for the blizzard.","The blizzard passed and the Hold still stood. From the battlements the knight saw a violet glow in the valley below, where the crystals sing."],
["The crystals of the Hollow hum with old magic, and the Goblin King wants it for himself. Two roads lead to the gate, and both were already full of goblins.","The crystals sang on, untouched. The hermit of the glade pressed a glowing shard into Sir Kirkevang's hand – it pointed east, towards a narrow mountain pass."],
["Wolfjaw Pass is one road between walls of stone. Whatever comes through it must come through Sir Kirkevang first.","The pass was held, and the King's crown lay dented in the dust. With nothing left to lose, he fled for Stormwatch, where the old stones call down the lightning."],
["On Stormwatch Heights the storm never ends. The horde climbed two roads in the rain, and the lightning struck friend and foe alike.","When the storm finally broke, the sky beyond the heights was torn open. Something was pouring through from the other side."],
["At the edge of the kingdom the world itself is coming apart, and everything the Goblin King has left is marching out of the rifts. This is the last stand, and Sir Kirkevang stands at the gate.","The rifts closed, the last of the horde was gone, and the kingdom was whole again. Sir Kirkevang hung up his sword in Greenmeadow – and this time he left it there."]];
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
 mo:[{k:'emb',n:160,c:0xff6a2a,s:.07},{k:'ash',n:90,c:0x4a4040,s:.06}]},
// levels 9–16. New keys: gt 'snow'/'sand' (ground textures made in js/06-scenery.js), sea = the far side drops into the sea (coast), storm = rain and lightning;
// leaves and snowflakes reuse the falling 'ash' particles
autumn:{wc:0x2e5a5a,rc:0x8a8070,sky:['#5a6a8a','#c8b49a','#f0c890'],fog:0xc8b8a0,fn:8,ff:40,hemi:[0xe0d0c0,0x8a6a4a,.9],sun:[0xffd8a0,1.55],ex:1.05,orb:0xffe0b0,gr:[0xa8a050,0x7a7a3a,0x55562c,0x8a8070,0x7a5a3a],bd:0xe8dcb0,rd:0xf4ece0,
 gs:[35,55,55,45,58,'#5a5a24'],gn:[600,1000],gc:[0xffffff,0xf0e0b0,0xe0c890],fl:['#ffffff','#ffb347','#d8443a'],tr:80,tk:[2,10,2,3,1,10,0],bu:40,rk:22,fly:6,cl:[6,0xffffff],hl:.9,sat:.98,tint:[1.03,1,.94],
 mo:[{k:'ash',n:70,c:0xd8782a,s:.08},{k:'ash',n:40,c:0xb84a26,s:.08}]},
coast:{wc:0x2a6a8a,rc:0x9a9488,sea:1,sky:['#3a6a9a','#9cc4dc','#e8e4d0'],fog:0xa8c0cc,fn:9,ff:44,hemi:[0xc8dcec,0x6a7a5a,.95],sun:[0xfff0d8,1.6],ex:1.05,orb:0xfff4dc,gr:[0x8aa458,0x6a8a44,0x4a6638,0x9a9488,0x8a7a5a],bd:0xd8e0c0,rd:0xf0ece0,
 gs:[60,90,50,48,62,'#3a5a24'],gn:[500,900],gc:[0xffffff,0xe8f0c8,0xd0e0a8],fl:['#ffffff','#f4d0e8'],tr:30,tk:[1,0,1,4],bu:30,rk:40,fly:0,cl:[7,0xffffff],hl:1.1,sat:1,tint:[.98,1,1.03]},
desert:{wc:0x3a8aa0,gt:'sand',rc:0xc8a070,sky:['#4a7ab0','#b8d0e0','#f4e0b0'],fog:0xe0d0a8,fn:7,ff:40,hemi:[0xf0e4d0,0xa08060,.9],sun:[0xfff0c8,1.5],ex:.92,orb:0xfff8e0,gr:[0xd4b880,0xbc9c64,0x9c7a50,0xc89a6a,0x9a7a52],bd:0xe8d0a0,rd:0xd8c8a8,
 gs:[40,52,45,55,68,'#8a7444'],gn:[80,160],gc:[0xffffff,0xf0e0b0],fl:[],tr:24,tk:[9,9,9,4],bu:0,rk:30,fly:0,cl:[3,0xffffff],peb:120,hl:1.3,sat:.95,tint:[1.04,1,.94],
 mo:[{k:'dust',n:90,c:0xe8c890,s:.06}]},
snow:{wc:0x9ac8e0,gt:'snow',rc:0x8a8e96,sky:['#4a6a90','#a8bcd0','#e8ecf0'],fog:0xc8d4e0,fn:6,ff:36,hemi:[0xdce8f4,0x8a94a0,1],sun:[0xfff4e8,1.35],ex:1,orb:0xffffff,gr:[0xf4f6f8,0xdce2ea,0xb4bcc8,0x8a8e96,0x9a9690],bd:0xf2f4f6,rd:0xc8c4c0,
 gs:[40,60,20,60,75,'#6a6a5a'],gn:[100,250],gc:[0xffffff,0xe8e4d0],fl:[],tr:90,tk:[6,6,6,4,6],pine:[0x24402e,0xeef2f6,0x34583e],bu:0,rk:34,fly:0,cl:[8,0xe8eef4],hl:2.4,sat:.9,tint:[.97,1,1.05],
 mo:[{k:'ash',n:240,c:0xffffff,s:.07}]},
crystal:{wc:0x3a5a8a,rc:0x7a7890,sky:['#140f2a','#3a2a5a','#7a5a8a'],fog:0x3a3050,fn:4,ff:30,hemi:[0x9a8ac8,0x2a2438,.85],sun:[0xc8b8ff,1],ex:1.1,orb:0xd8c8ff,gr:[0x4a6a5a,0x34503e,0x22362c,0x6a6880,0x3a3244],bd:0x9ab8a8,rd:0xb8b0c8,
 gs:[150,175,30,45,60,'#2a4a44'],gn:[500,900],gc:[0xd0e8ff,0xb8d8f0,0xa0c8e0],fl:['#9adcff','#e0a8ff'],tr:60,tk:[11,11,3,11,6],leaf:[0x4ac0b0,0x6ad8c8,0x8a7ad8],pine:[0x1e3a3a,0x2a5a5a,0x245050],bu:30,rk:30,fly:0,cl:[0],hl:1.1,sat:1,tint:[.98,.98,1.06],
 mo:[{k:'ff',n:90,c:0x9ae8ff,s:.1},{k:'ff',n:40,c:0xe0a0ff,s:.09}]},
pass:{wc:0x3a6a7a,rc:0x8a8680,sky:['#4a5a70','#98a8b8','#d8d4c8'],fog:0x9aa4b0,fn:6,ff:34,hemi:[0xc8d0dc,0x6a6458,.9],sun:[0xf8ecd8,1.45],ex:1.05,orb:0xfff4e0,gr:[0x7a8a5a,0x5a6a44,0x3e4a34,0x8a8680,0x6a5e4e],bd:0xc0c8a8,rd:0xd0c8b8,
 gs:[55,85,35,42,55,'#3a4a28'],gn:[300,500],gc:[0xffffff,0xd8e0c0,0xb8c4a0],fl:['#ffffff','#9ab8ff'],tr:60,tk:[0,6,0,4,6],pine:[0x1e3a2a,0x2a5a3a,0x244a32],bu:20,rk:60,fly:0,cl:[6,0xe0e4e8],peb:140,hl:3.2,sat:.9,tint:[.98,1,1.02],
 mo:[{k:'dust',n:50,c:0xd8d8d0,s:.05}]},
storm:{wc:0x22323e,rc:0x6a6a6a,storm:1,sky:['#0e1218','#2a3440','#4a5460'],fog:0x2e3640,fn:3,ff:28,hemi:[0x8a98a8,0x2a2c2a,.75],sun:[0xb8c4d0,.85],ex:1.15,orb:0x9aa8b8,gr:[0x5a6a4a,0x42503a,0x2c3628,0x6a6a6a,0x3a3428],bd:0x8a9a80,rd:0xa4a29c,
 gs:[70,95,25,40,52,'#34402a'],gn:[500,900],gc:[0xc8d0c0,0xb0b8a8],fl:['#b48aff'],tr:40,tk:[4,4,8,4],leaf:[0x3a4a30,0x4a5a3a,0x34402a],bu:30,rk:40,fly:0,cl:[10,0x1e2228],hl:1.6,sat:.8,tint:[.96,.98,1.04]},
void:{wc:0x1a0e2e,gt:'dirt',rc:0x3a3448,sky:['#05030c','#1c0e34','#4a1e6a'],fog:0x140a24,fn:4,ff:30,hemi:[0x8a6ab8,0x140a1c,.8],sun:[0xb890ff,1.1],ex:1.1,orb:0xc8a0ff,gr:[0x3a3444,0x2a2432,0x18141e,0x4a4058,0x0e0a12],bd:0x8a8098,rd:0x908aa0,
 gs:[0,10,20,22,30,'#1a1020'],gn:[0,0],gc:[0xffffff],fl:[],tr:24,tk:[4,4,5],bu:0,rk:40,fly:0,cl:[6,0x0e0818],smk:0x3a3048,peb:200,hl:1.6,sat:.95,tint:[1.02,.94,1.08],
 mo:[{k:'emb',n:140,c:0xb06aff,s:.07},{k:'ff',n:50,c:0x5ae0ff,s:.09}]}};
// the level is picked before anything is built (the whole scene is built once at load): ?level=N in the URL, else the last level chosen in the menu
const LVN=(()=>{let n=0;try{n=+new URLSearchParams(location.search).get('level')||+localStorage.getItem('sflv')||1;}catch(e){n=1;}return clamp(Math.round(n)||1,1,LEVELS.length)-1;})();
const LV=LEVELS[LVN],TH=THEMES[LV.th],W=LV.w,H=LV.h;
// difficulty, picked at load like the level (chosen in the level picker): ?diff=easy|normal|hard, else localStorage sfdif. A new player starts on Normal,
// one who already has progress or a saved run (made before difficulties existed, which played like Easy) on Easy.
// hp = enemy health ×, gold = starting gold ×, li = lives (also the Repair gate's cap, maxL() in js/09-game.js). Easy is the original game – keep it at 1/1/20 so the sim reference runs stay valid
const DIFS=[{k:'easy',n:'Easy',hp:1,gold:1,li:20},{k:'normal',n:'Normal',hp:1.3,gold:.9,li:15},{k:'hard',n:'Hard',hp:1.75,gold:.8,li:10}];
const DFN=(()=>{let k=null;try{k=new URLSearchParams(location.search).get('diff')||localStorage.getItem('sfdif');if(!k)k=localStorage.getItem('sfprog')!=null||Object.keys(localStorage).some(k=>/^sfrun\d+$/.test(k))?'easy':'normal';}catch(e){}const i=DIFS.findIndex(d=>d.k==k);return i<0?1:i;})();
const DF=DIFS[DFN];
const PATHS=LV.p.map(q=>q.map(p=>[p[0]*S+S/2,p[1]*S+S/2])),WP=PATHS[0];
// rem[i] = road length from waypoint i to the gate
for(const R of PATHS){R.rem=[0];for(let i=R.length-2;i>=0;i--)R.rem.unshift(R.rem[0]+Math.hypot(R[i+1][0]-R[i][0],R[i+1][1]-R[i][1]));}
// flyers' routes: one straight line per breach, from where its road enters to the gate, with the same rem (road length left) as PATHS
const FPATHS=PATHS.map(R=>{const F=[R[0],R[R.length-1]];F.rem=[Math.hypot(F[1][0]-F[0][0],F[1][1]-F[0][1]),0];return F;});
const road=new Set(),blk=new Set(LV.bk.map(b=>b[0]+','+b[1]));
for(const WPp of PATHS)for(let i=0;i<WPp.length-1;i++){const a=WPp[i],b=WPp[i+1],f=v=>Math.round((v-S/2)/S);
for(let c=Math.min(f(a[0]),f(b[0]));c<=Math.max(f(a[0]),f(b[0]));c++)for(let r=Math.min(f(a[1]),f(b[1]));r<=Math.max(f(a[1]),f(b[1]));r++)road.add(c+','+r);}
// level mechanics (LV.mc; name, icon and line d show in the level picker; the logic is under "Level mechanics" in js/09-game.js):
// fog = towers on a FOG cell (the ring of cells along the wall, where the forest crowds in) get rg of their range;
// fire = during a wave an ember lands on a free cell by the wall or a burning stump every ig s (the first ig0 s in), at most mx fires at once; each burns bt s of game time
//   (the break too – nothing can be built there meanwhile) and after sp s of wave time spreads once to a free neighbouring cell (never across the road);
// bog = enemies on foot move at sl of their speed on a bog road cell (LV.bg);
// ruin = LV.ru: at wave w, t s in, the ruins on cells c collapse into road and the shortcut road p opens (it shares the main road's start); every other enemy on foot takes it from then on;
// grave = while a wave is still marching in, every cd s (the first t0 s in) one of the graves by the road (LV.gv, road cells) glows for wt s, then 1 skeleton + 1 per dn waves climb out there;
// lava = every cd s of a wave (the first t0 s in) a lava vent (every blocked cell) rumbles for wt s, then erupts: dm × a goblin's health (gob()) as fire damage to enemies within r (flyers too),
//   and towers within r are stunned st s;
// dark = t0 s into a wave and every cd s after it, darkness falls for du s: towers get rg of their range unless lit – within lr of a lava pool (LAMP) or in a Banner Tower's range (banners carry torches)
// harvest = at the end of each wave every field cell (LV.hv) without a tower on it pays g gold;
// land = every ev-th enemy on foot (not bosses) taken off the wave queue starts at the landing cell LV.ld instead of the breach;
// mirage = every ev-th enemy of a plain type (MIRT) is followed dl s later by a mirage of itself: 1 health, no gold, no life lost when it gets through;
// cold = like dark (t0/cd/du): in a blizzard towers reload f times slower unless warm – within wr of a brazier (BRZ) or in an Alchemist's range (Alchemists never freeze);
// crystal = towers on a cell next to a crystal (any blocked cell, diagonals too) deal dm × damage;
// rock = every cd s of a wave (the first t0 s in) a boulder rumbles over a random road cell for wt s, then lands: dm × gob() physical damage within r, and for bt s
//   no enemy on foot can walk past it (held within r of it while heading towards it); a boss walking into it smashes it;
// bolt = every cd s of a wave (the first t0 s in) lightning strikes a random attacking tower: it reloads f times faster for oc s;
// rift = every cd s of a wave (the first t0 s in) a rift opens on each of the two roads (on a cell only that road uses) for du s; an enemy on foot (not a boss) within r
//   of one comes out of the other and carries on along that road
const MECH={fog:{n:'Forest fog',ic:'☁️',d:'Mist creeps in from the trees: towers on the foggy cells along the wall lose a quarter of their range.',rg:.75},
fire:{n:'Wildfire',ic:'🔥',d:'Embers land on the board during waves and the fire spreads. Nothing can be built on burning ground until it dies down.',ig0:6,ig:9,mx:6,bt:20,sp:5},
bog:{n:'Sucking bog',ic:'🐸',d:'Stretches of the road are flooded bog: enemies on foot wade through at 60% speed.',sl:.6},
ruin:{n:'Crumbling ruins',ic:'🏚️',d:'In wave 7 the ruined houses in the middle of town collapse and open a shortcut. From then on every other enemy on foot takes it.'},
grave:{n:'Restless graves',ic:'💀',d:'While a wave marches in, the open graves beside the road glow – and skeletons climb out onto the road.',t0:8,cd:11,wt:1.5,dn:7},
lava:{n:'Lava vents',ic:'🌋',d:'The lava pools erupt during waves, burning nearby enemies – and stunning towers built right next to them for a few seconds.',t0:6,cd:9,wt:2,r:95,dm:.5,st:3},
dark:{n:'Falling darkness',ic:'🌑',d:'Darkness falls again and again during waves. Towers lose 40% range in the dark unless they stand by a lava pool or in reach of a Banner Tower.',t0:15,cd:30,du:10,rg:.6,lr:95},
harvest:{n:'Harvest fields',ic:'🌾',d:'Wheat grows on the fields inside the walls. Every field cell you leave unbuilt brings in 3 gold at the end of each wave.',g:3},
land:{n:'Pirate landings',ic:'⚓',d:'Pirates row up the creek: every third enemy on foot comes ashore halfway along the road instead of at the breach.',ev:3},
mirage:{n:'Heat mirages',ic:'☀️',d:'The heat haze conjures shimmering copies of the enemy. They vanish at the first hit and cost no lives, but your towers waste shots on them.',ev:2,dl:.45},
cold:{n:'Blizzards',ic:'❄️',d:'Blizzards sweep over the hold during waves. Frozen towers attack 35% slower unless a brazier or an Alchemist keeps them warm.',t0:12,cd:30,du:10,f:1.35,wr:100},
crystal:{n:'Singing crystals',ic:'💎',d:'The crystals hum with power: towers built right next to one deal 25% more damage.',dm:1.25},
rock:{n:'Rockfalls',ic:'⛰️',d:'Boulders crash onto the road during waves, crushing the enemies below and blocking the pass for a few seconds. Bosses smash straight through.',t0:8,cd:13,wt:1.6,r:40,dm:.6,bt:5},
bolt:{n:'Lightning strikes',ic:'🌩️',d:'Lightning strikes your towers during waves. A struck tower is overcharged and fires 50% faster for 8 seconds.',t0:6,cd:9,oc:8,f:1.5},
rift:{n:'Void rifts',ic:'🌀',d:'Twin rifts tear open on the two roads. An enemy on foot that steps into one comes out of the other – maybe closer to the castle, maybe farther away.',t0:8,cd:16,du:7,r:22}};
const FOG=new Set(),BOGC=new Set((LV.bg||[]).map(b=>b[0]+','+b[1]));
// Ashfall: the shortcut's ruin cells (blocked until they collapse, then road) and its road SC (with rem like PATHS); Dread Wastes: the lava pools that light towers (the blocked cells drawn as lava, js/06-scenery.js)
const RUC=new Set((LV.ru?LV.ru.c:[]).map(b=>b[0]+','+b[1]));for(const k of RUC)blk.add(k);
const SC=LV.ru?LV.ru.p.map(p=>[p[0]*S+S/2,p[1]*S+S/2]):null;if(SC){SC.rem=[0];for(let i=SC.length-2;i>=0;i--)SC.rem.unshift(SC.rem[0]+Math.hypot(SC[i+1][0]-SC[i][0],SC[i+1][1]-SC[i][1]));}
const LAMP=LV.mc=='dark'?LV.bk.filter(([c,r])=>(c+r)%2):[];
// Harvest Vale's fields, Frostpeak Hold's braziers (the blocked cells drawn as rocks, js/06-scenery.js), Crystal Hollow's crystals (every blocked cell)
const FLD=LV.hv||[],BRZ=LV.mc=='cold'?LV.bk.filter(([c,r])=>!((c+r)%2)):[],CRY=new Set(LV.mc=='crystal'?LV.bk.map(b=>b[0]+','+b[1]):[]);
if(LV.mc=='fog')for(let c=0;c<W;c++)for(let r=0;r<H;r++)if((c==0||r==0||c==W-1||r==H-1)&&!road.has(c+','+r)&&!blk.has(c+','+r))FOG.add(c+','+r);
const T={arrow:{n:'Archers',ic:'🏹',c:60,r:130,d:10,f:.5,dt:'phys',air:1},cannon:{n:'Catapult',ic:'🪨',c:100,r:110,d:30,f:1.4,dt:'phys',sp:55,bs:260,arc:1},frost:{n:'Wizard',ic:'🔮',c:110,r:115,d:8,f:3,dt:'magic',air:1},
ballista:{n:'Ballista',ic:'🎯',c:125,r:190,d:66,f:2.2,dt:'phys',pr:1,air:1,bs:520,tm:'strong'},storm:{n:'Storm Tower',ic:'⚡',c:120,r:105,d:16,f:1,dt:'light',air:1,ch:5},alch:{n:'Alchemist',ic:'🧪',c:90,r:115,d:15,f:1.1,dt:'fire',bs:240,arc:1},
banner:{n:'Banner Tower',ic:'🚩',c:120,r:120,d:0,f:99,sup:1},vault:{n:'Treasury',ic:'💰',c:150,r:40,d:0,f:99,inc:20},
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
barracks:[{n:'Knights\' Hall',ic:'🐎',ds:'Three armoured knights: much tougher, harder-hitting, and they shrug off half of every blow.',shp:2.2,dm:1.6,arm:.5},{n:'Warband',ic:'🪓',ds:'Four axe fighters instead of three, and a fallen one is back twice as fast.',sn:4,rsf:.5}],
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
// Pirate: plu = gold it steals if it reaches the gate (on top of the life); rum = speed multiplier once it is below half health (it swigs its rum and charges)
pirate:{s:52,h:1.2,rw:8,r:11,col:0x2c3a58,rs:{},plu:25,rum:1.5},
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
