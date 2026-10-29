# Game design – Castle Defense (Slotsforsvar)

Up to date as of version 0.1.0 plus levels. The numbers live in `js/01-config.js` (levels `LEVELS`, towers `T`, enemies `E`) and `js/09-game.js` (waves, economy).

## Goal
Defend the castle through 20 waves on each of 8 levels. Enemies pour in through a breach in the wall and march along the road to the castle gate. Every enemy that gets through costs a life (a boss costs 5). You start with 20 lives and 120 gold.

## Levels
Each level is a walled board with the same castle outside one of its walls. Winning a level unlocks the next; any unlocked level can be replayed from Levels in the menu. A run is saved during every break between waves, so closing or refreshing the page and choosing Continue picks it up at the start of the next wave (a refresh mid-wave replays that wave from its start). Each level keeps its own saved run; winning, losing or Restart level (menu, end screen) ends it.

| # | Level | Land | Board | Breaches → castle | Blocked tiles | Start gold | Enemy health | Special enemies (from wave) | Bosses (waves 5 / 10 / 15 / 20) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Greenmeadow | Fields | 12×8 | west → east | 0 | 120 | ×1 | Shieldbearers 8, bats 12 | King / Ram / King / Dragon |
| 2 | Darkwood | Dark forest | 10×7 | north → east | 4 | 130 | ×0.95 | Ghosts 4, Shieldbearers 8, Sappers 9 | King / Necromancer / Ram / Dragon |
| 3 | Emberwood | Burning forest, burnt houses | 13×8 | south → north | 5 | 140 | ×0.9 | Trolls 6, Sappers 8, Shieldbearers 8, bats 13 | Ram / King / Dragon / Dragon |
| 4 | Mirefen | Marsh | 14×9 | west → south | 11 | 150 | ×0.93 | Shamans 4, bats 6, Trolls 7, Shieldbearers 12 | Necromancer / King / Ram / Dragon |
| 5 | Ashfall | Ruined, smouldering town | 11×7 | east → west | 7 | 160 | ×1.1 | Sappers 3, Shieldbearers 4, bats 8, Trolls and Shamans 13 | Ram / Necromancer / King / Dragon |
| 6 | Barrow Moor | Graveyard moor | 15×9 | north → east | 12 | 170 | ×0.8 | Skeletons 1, Ghosts 3, bats 8, Shieldbearers and Shamans 9, Trolls 17 | Necromancer / King / Necromancer / two Necromancers |
| 7 | Scorched Badlands | Cracked earth and lava | 12×9 | west + north → south | 9 | 190 | ×0.9 | Fire Imps 3, bats and Shieldbearers 8, Sappers 9, Shamans 10, Trolls 13 | Ram / Dragon / King / King + Dragon |
| 8 | The Dread Wastes | Black rock, lava, red sky | 16×10 | west + east → north | 16 | 220 | ×0.88 | Fire Imps and Ghosts 3, Sappers 6, bats, Shieldbearers and Shamans 8, Trolls 10, Skeletons 13 | Necromancer / Ram / Dragon / two Dragons |

The waves are hand-designed per level (see **Waves** under Enemies), so each land has its own enemies and introduces them at its own pace. The enemy health multiplier is not a difficulty ranking: it was tuned with the simulator to make up for each board's shape and wave table, so that a sensible build wins every level while losing more lives level by level.

Tower placement gets harder level by level: more blocked tiles (often right where two stretches of road would overlap), long straight roads, and on levels 7–8 two breaches that split each wave between two roads (enemies alternate between them unless a wave sends a whole group down one road, as in the **Pincer** waves; the roads merge before the gate).

## Economy
- Gold for every enemy killed (`rw`), plus a wave bonus of `20 + 2 × wave` at the end of each wave.
- **Towers are built and sold only between waves.** While a wave runs you command the hero instead; upgrading (including picking a level-3 path) still works mid-wave.
- Upgrading costs `price × 0.8 × level` (level 1→2, 2→3). Selling refunds 60% of everything spent on the tower. **Undo:** a tower placed during the break between waves can be taken back for a full refund (including upgrades bought on it) until the next wave starts – the Sell button turns into Undo, and Ctrl+Z/Z undoes the latest one. Towers placed mid-wave can only be sold.
- Each upgrade gives +60% damage and +10 range.
- **Upgrade branches:** the upgrade to level 3 of every tower is a choice between two paths (see below). The price is the normal level-3 upgrade.
- **Break and early call:** after each wave (not before wave 1) there is a 25 s break, counted in game time (it stops while paused and runs faster at ×2/×3). Starting the next wave during the break ("Call wave N early", Space) pays `floor(seconds left × (0.4 + 0.04 × wave))` gold – about 11 after wave 1, 20 after wave 10, 29 after wave 19 – shown on the button. With **Auto-start waves** on (menu → Settings, off by default) the next wave starts by itself when the break runs out; with it off the button just says "Start wave N" once the time is up. In the simulator, `--early` calls every wave at once for the full bonus (about +380 gold over a run on level 1).

## Towers (price / range / damage / reload)
| Tower | Price | Range | Damage | Reload | Special |
|---|---|---|---|---|---|
| Archers | 50 | 130 | 10 | 0.5 s | Shoots 1/2/3 targets at level 1/2/3 (the best ones by its targeting mode) |
| Catapult | 100 | 110 | 30 | 1.4 s | Area damage (radius 55). Slows enemies hit by 20/40/60% for 1 s |
| Wizard | 110 | 115 | 8 | 3.0 s | Banish: teleports its target (default First) 1/1.5/2 tiles back down the road (bosses only a third as far). A banished enemy is immune to banishing for 4 s, so several Wizards spread out |
| Ballista | 125 | 190 | 66 | 2.2 s | Targets Strongest by default (the enemy with the most health left). Pierces armour |
| Storm Tower | 150 | 105 | 16 | 1.0 s | Chain lightning hits 5/6/7 targets, stuns for 0.2 s, 8% less damage per jump. Lightning ignores armour |
| Alchemist | 90 | 115 | 7.8/s | 1.1 s | Poison flask, radius 45, poisons for 3 s |
| Banner Tower | 120 | 120 | – | – | +20% damage (+10% per level) to towers in range |
| Treasury | 150 | – | – | – | 15 gold × level at the end of each wave |
| Barracks | 90 | 130 (rally) | 7 a swing | 1.0 s | Three soldiers block enemies on foot at a movable rally point (see below) |

## Upgrade branches (level 3)
No tower has a plain level 3: when a level-2 one is selected, the inspector shows two cards instead of the Upgrade button (click one, or press B for the first / N for the second). Both paths get the normal level-3 +60% damage and +10 range, plus their own change and a new look. Numbers live in `BRN` in js/01-config.js;

| Tower | Path | Effect | Look |
|---|---|---|---|
| Archers | **Longbowmen** | +40 range (210 at level 3) | three green-hooded archers with tall longbows, a bundle of long arrows, a green banner |
| Archers | **Crossbow Nest** | Pierces armour (like the Ballista – but not the Shieldbearer's shield), +30% damage | a roofed wooden hoarding round the top, crossbowmen in iron hats, a winch and a crate of bolts; bolt-shaped shots |
| Catapult | **Fire Pots** | Each hit sets the ground on fire for 3 s (radius 50): ground enemies standing in it take 30% of the shot's damage per second as **fire** damage (the Dragon and Fire Imps resist it) | clay pots of pitch, a brazier, a burning pot in the sling; a burning pot flies |
| Catapult | **Boulder** | ×3 damage on the enemy it was aimed at, splash radius 48 instead of 55 | a bigger iron-bound counterweight, a huge boulder in the sling, a pile of rough rocks |
| Wizard | **Archmage** | Also banishes (and hits) every enemy within 60 of its target that isn't immune | violet robes, a bigger violet crystal with three gold rings and ten satellites |
| Wizard | **Time Warden** | Stops banishing. Each shot leaves a time field (radius 80, 4 s): enemies inside move at 40% speed and their abilities (summon, raise, heal) tick at 40% too; bosses lose only a third as much speed. It skips enemies already in a field, so several Time Wardens spread out | amber robes, an hourglass in a bronze frame; amber shots and a glowing dome on the road |
| Storm Tower | **Tempest** | Chains to 4 more enemies (11 at level 3) | eight rods and a small storm cloud circling over the orb |
| Storm Tower | **Thunderlord** | Chains to 6 instead of 7, double damage, 1.7× reload, and every enemy hit is stunned for 1.2 s (bosses 0.4 s) | a bigger violet orb in a crown of copper spikes; thicker violet bolts |
| Ballista | **Skewer** | Each bolt carries on through its target and hits up to 3 more enemies within 18 of its line, up to 150 beyond (full damage, still pierces armour; the Shieldbearer's shield still blocks from the front) | iron limbs, a long iron bolt and a rack of spare spears |
| Ballista | **Giant Slayer** | ×2 damage to bosses and big enemies (at least 1.8× a goblin's health: Black Knights, Trolls) | a red-painted bow with gold caps, a horned skull over the door, a dark red flag; red-and-gold bolts |
| Alchemist | **Acid Brew** | Enemies it splashes lose their physical armour for 4 s and take +15% physical damage (`ACID`) – sets up Archers, Catapults and Ballistas against Black Knights and the Siege Ram | a sickly yellow cauldron and flask, two acid barrels; yellow splashes |
| Alchemist | **Plague** | When a poisoned enemy dies, its poison jumps to every ground enemy within 65 (who can pass it on again) | a violet cauldron, a plague doctor with a beaked mask and black hat, skulls at the foot; violet splashes and a ring when it spreads |
| Banner Tower | **War Drums** | Towers in range also attack 20% faster (stacks with other drums) | two big red war drums and a drummer on top |
| Banner Tower | **Blessed Standard** | Towers in range ignore enemy resistances – but not immunities (Fire Imps stay immune to fire) | white and gold banners, a white herald, a glowing halo above the tower |
| Treasury | **Royal Bank** | At the end of each wave, also pays 5% of your gold (after the wave's income), up to 60 | stacks of gold bars round the foot, a royal-blue flag |
| Treasury | **Bounty Office** | Enemies killed within its range (2.2 tiles) give +30% gold, rounded up (the best office counts, they don't stack) | a notice board of wanted posters, a bounty hunter, crossed swords over the door, a dark red flag |
| Barracks | **Knights' Hall** | Three knights: ×2.2 health, +60% damage, and they take 50% less damage from every hit | a blue roof, a stand of armour with a lance and pennant; knights in silver plate with red plumes and blue kite shields |
| Barracks | **Warband** | Four fighters instead of three (the fourth marches out at once; they guard a square round the rally point), back in 3 s instead of 6 | a dark shingled roof, a horned skull over the door, crossed axes and a fire pit; fighters in fur with horned helmets and axes |

The chosen path is saved with the run. A level-3 tower from a save made before branches existed can pick its path for free.

**Simulator check** (`--keep-going`, lives lost on the reference layouts, plain level 3 → all first paths / all second paths): full builds level 1–8: 0→0/0, 8→0/0, 12→5/0, 12→0/0, 10→5/5, 13→8/3, 14→14/0, 15→10/5; `level1-example` 13→5/7, `level4-mixed` 54→16/14, `level7-mixed` 58→26/23. The two paths of each tower came out about even (the first Boulder and Thunderlord were clearly worse and were buffed; Crossbow Nest got +30% damage and no range penalty). Each path on its own is about as good as, or better than, the old plain level 3, so **the game got easier by roughly 5–10 lives per level** with branches. The reference layouts now pick Crossbow Nest, Fire Pots, Archmage and Tempest (`up c,r crossbow` etc.).

**Simulator check, part 2** (Ballista, Alchemist, Banner, Treasury; reference layouts with the first four paths already picked, plain → all first / all second): the full builds 0/0/5/0/5/3/8/10 → 0/0/1/0/5/3/0/0 and 0/0/2/0/0/3/5/0; War Drums beat Blessed Standard on these builds (they have few resistant enemies in banner range), Acid Brew and Plague were close, Skewer and Giant Slayer too. The Treasury paths were checked on `level1-example` with a Treasury added on 6,4 and upgraded early: plain level 3 → Royal Bank +326 gold by the end, Bounty Office +401 (a first version with +50% gold in 2.8 tiles gave +661 and was cut down); a Bounty Office in a corner far from the kills earns nothing, so placement matters. The reference layouts now also pick Giant Slayer, Acid Brew, War Drums and Royal Bank, and lose 0 / 0 / 5 / 0 / 0 / 3 / 0 / 0 lives on levels 1–8 – the game is easier again, on purpose (kept that way after part 1). A Wizard-heavy test on level 1 (three Wizards, two Archers, a Storm Tower): plain 197 lives lost, Archmage 114, Time Warden 134.

## Hero: Sir Roland
A knight on horseback who is on every level from the start (`g.hero`). He waits on the road cell nearest the gate; **click any road cell on the board to send him there** (also between waves) – he rides straight across at 110, ignoring enemies until he arrives, then fights from that spot.
- **Fighting:** like a Barracks soldier – he runs at the nearest ground enemy within 75 of his spot (enemies nobody holds first, then the one closest to the castle), **blocks** it and trades blows: 20 physical damage a swing every 0.9 s, 300 health, and he shrugs off 30% of every hit (enemy hits as for soldiers: `4 × 1.12^wave × √health multiple`, bosses ×3). Out of a fight he heals 2% a second. Flyers and faded Ghosts are ignored.
- **Levels (1–5, during a level):** he earns xp equal to the gold value of every enemy that dies within 200 of him, whoever kills it; 80 / 220 / 450 / 800 xp for levels 2–5. Each level: +35% health and +30% damage (and a 30% heal). Level, xp and his spot are saved with the run; a new level starts him at level 1.
- **Death:** at 0 health he falls and rides back out from the gate after 15 s (the hero card counts down).
- **Abilities** (all centred on him; keys 1–4 during a wave, or click the tiles):

| Ability | Use | Effect |
|---|---|---|
| Shield Bash 🛡️ | every 10 s | enemies on foot within 70: stunned 2 s (bosses 0.7 s), 2× his damage |
| Lance Charge 🐎 | every 15 s | enemies on foot within 100: hurled 45 back down their road (bosses 15), 3× his damage |
| Rallying Cry 📯 | every 20 s | towers within 150 attack 35% faster for 6 s (they glow gold) |
| Divine Smite ⚡ | **once a wave** | every enemy within 160, flyers too: 10× his damage as lightning (ignores armour), stunned 1 s; he is healed fully |

Stunned enemies don't hit back (soldiers and the hero both).

**Reading his fights:** during a wave a ring on the ground shows his reach round the spot he holds – faint white while he waits, gold while he's fighting – and a red ring marks the enemy he's fighting. Every sword stroke is a big overhead chop (his sword is drawn larger than the soldiers'): he raises it, leans into the blow while the horse rocks forward, a bright slash arc flashes in front of him and the enemy sparks as it's hit. **During a wave the tower dock is replaced by the hero bar**: his card (level, health, xp; click it to centre the camera on him) and the four ability tiles with their cooldowns; the inspector shows him when nothing is selected, or the hovered ability.

**Simulator check:** the sim plays the hero and casts his abilities the way a player would (`--no-cast` turns that off, `--no-hero` removes him; a `hero c,r` step sends him). Reference layouts, with him waiting by the gate and the new "build between waves only" rule (before → after): `level1-mixed` 5 → 0, `level3-full` 5 → 3, `level4-mixed` 9 → 5, `level7-mixed` 14 → 11, the rest unchanged; without the hero the new build rule alone only changed `level2-full` (0 → 5). Sent to a good road cell from the start: `level4-mixed` 9 → 0 (cell 5,5; 5 without abilities), `level7-mixed` 14 → 7 (8,6) – he reaches level 5 in most of those runs.

## Barracks
A guardhouse (90 gold) that must stand **next to the road** (a road cell within 90 of it, i.e. touching it, diagonals too); elsewhere the placement ring shows red and the click does nothing. It sends **3 soldiers** to a **rally point** on the road – at first the nearest road cell. With the Barracks selected, click a road cell within its range (130, +10 a level) to move the rally point there; the rally point shows as a flag and ring while it's selected, and is saved with the run.

- Each soldier guards a post round the rally point. When a ground enemy comes within 60 of the rally point it runs at it – enemies nobody holds yet first, then the one closest to the castle – and fights. The first soldier to reach an enemy **blocks** it: it stops walking, turns to the soldier and hits it every second. More soldiers can gang up on one enemy, but it only hits the one blocking it.
- Soldiers: 80 / 120 / 160 health at level 1/2/3, 7 / 11 / 15 physical damage a swing every second (Banners and War Drums boost them; the damage goes through resistances like any physical hit). Out of a fight they heal 8% of their health a second.
- Enemy hits on a soldier: `4 × 1.12^wave × √(goblin health multiple)`, ×3 for bosses (bosses ×3 – that only matters for the hero now, since soldiers don't fight bosses).
- A soldier at 0 health falls (dust, a clank) and comes back from the Barracks after 8 s (6 s at level 3); a stunned Barracks (Sapper) doesn't send new soldiers until the stun wears off.
- **Flyers ignore them** (soldiers never go for bats), a faded Ghost slips out of their grip, and **bosses can't be blocked by a Barracks** – soldiers leave them alone (only the hero can take a boss on). An enemy that's banished away is let go. Selling the Barracks releases everything it holds.
- It has no targeting mode and doesn't count on the coverage map (its range tint shows where the rally point can go).
- **Level-3 paths** (Knights' Hall / Warband, table above). Simulator check (`level4-mixed` / `level6-mixed` / `level7-mixed` with a Barracks built early and taken to level 3; plain → Knights → Warband lives lost): 6,4 on level 4: 6 → 2 → 3; 3,3 on level 6: 12 → 7 → 17; 10,8 on level 7: 12 → 18 → 8. A first Knights' Hall (×1.8 health, +40%, −40% damage taken) was weaker than the Warband everywhere and was buffed. **Hold enemies inside your towers' range:** with the rally point beside the breach (3,1 on level 4), knights held the Trolls of the "Troll march" there, out of reach of every tower, until late in the wave – their goblins then poured out at once and 8 leaked (5 → 13 lives). Strong blockers in the wrong place make things worse.

**Simulator check:** none of the reference layouts has a Barracks, and they are unchanged. Added to `level4-mixed` (built early, upgraded to level 3) on every cell next to the road: lives lost 9 → 0 in the best spot (12,6, beside a long straight in the kill zone), 5 on most cells, 9–14 on cells beside the breach where soldiers fight alone. On `level7-mixed` it helps little (14 → 13): those losses are bats and bosses.

**Targeting:** every attacking tower has a targeting mode, picked in the inspector or cycled with T on the selected tower: **First** (closest to the castle, by road length left), **Last**, **Strongest** (most health left), **Fastest** (fastest enemy type, ties go to First) and **Closest** (to the tower). Defaults: Ballista Strongest, everything else First. Storm Tower picks its first target this way, then chains to the nearest enemies; Archers pick their 1–3 targets in that order. The mode is kept through upgrades and saved with the run; Banner Tower and Treasury have none.

## Enemies
| Type | Speed | Health (× base) | Gold |
|---|---|---|---|
| Goblin (norm) | 50 | 1.0 | 5 |
| Wolf rider (fast) | 90 | 0.6 | 5 |
| Black knight (tank) | 35 | 1.8 | 10 |
| Dragon (boss) | 30 | 12 | 50 |
| Goblin King (king, boss) | 32 | 8 | 50 |
| Siege Ram (ram, boss) | 22 | 9 | 60 |
| Necromancer (necro, boss) | 30 | 7 | 50 |
| Skeleton (skel, raised by the Necromancer) | 42 | 0.6 | 1 |
| Shieldbearer (guard) | 40 | 1.4 | 8 |
| Goblin Shaman (shaman) | 45 | 0.9 | 9 |
| Bat swarm (bat, flying) | 60 | 0.6 | 5 |
| Goblin Sapper (sapper) | 65 | 0.7 | 6 (none if it blows up) |
| Troll (troll) | 30 | 2.0 | 12 |
| Ghost (ghost) | 48 | 1.1 | 7 |
| Fire Imp (imp) | 70 | 0.8 | 6 |

## Damage types and resistances
Every attacking tower deals one damage type (`T[k].dt`, names in `DTY`); each enemy type has resistances (`E[type].rs`, the share of that type's damage it shrugs off). `dmul(e,k)` in js/09-game.js applies them to every hit, including poison and each jump of the lightning chain.

| Tower | Damage type | Notes |
|---|---|---|
| Archers | Physical | |
| Catapult | Physical | |
| Ballista | Physical | **Pierces armour:** ignores physical resistance (`pr:1`) |
| Wizard | Magic | |
| Alchemist | Fire & poison | Resistance lowers the poison per second |
| Storm Tower | Lightning | **Ignores armour:** no enemy resists lightning |

| Enemy | Physical | Magic | Fire & poison | Lightning |
|---|---|---|---|---|
| Goblin | – | – | – | – |
| Wolf rider | – | – | – | – |
| Black knight | −50% | – | – | – |
| Dragon | – | – | −50% | – |
| Shieldbearer | −75% from Archers and the Ballista when hit from the front | – | – | – |
| Shaman | – | – | – | – |
| Bat swarm | flying: Catapult can't hit it | – | flying: Alchemist can't hit it | – |
| Sapper, Troll | – | – | – | – |
| Siege Ram | −25% | – | – | – |
| Necromancer | – | −50% | – | – |
| Goblin King, Skeleton | – | – | – | – |
| Ghost | while faded out it can't be targeted or hurt at all | | | |
| Fire Imp | – | – | **immune** | – |

Damage numbers are red for a full hit, **grey** when the enemy resisted part of it, and **pale gold** when the Ballista pierced armour. The next-wave preview has a line listing the coming enemies' resistances, plus what an enemy type does on the wave it first appears (not if it was in the previous wave); hovering an enemy icon shows all of it. Knights were cut from 2.6× to 1.8× health when they got their armour: against physical damage they are as tough as a 3.6× enemy, against everything else weaker than before.

**Simulator check** (`--keep-going`, lives lost before → after): `level1-example` (mostly physical, one Ballista, two Storm Towers) 11 → 12, `level1-physical` (Archers and Catapults only) 7 → 12, `level1-mixed` 8 → 8, `level4-mixed` 72 → 68. A one-sided physical build is punished, a mixed one is unchanged or better.

**Shieldbearer:** its tower shield blocks `shd` = 75% of an Archer arrow's or Ballista bolt's damage when the shot comes at its front: the shot's direction of travel is within about 70° of head-on to the way it is walking (`shBlk()` in js/09-game.js). Shots from the side or behind, Catapult boulders (they come down from above) and all magic, poison and lightning damage go around it. A blocked hit gives sparks, a clang and a grey number. The Ballista pierces armour but not the shield.

**Flying enemies (Bat swarm):** an enemy with `fy` (its flying height) ignores the road and flies in a straight line from where its breach's road starts to where the road ends at the gate (`FPATHS` in js/01-config.js, one per breach, so on levels 7–8 they come from both breaches). On Greenmeadow the flight is 836 long against 1920 for the road (44%). Only towers with `air` can target it: **Archers, Ballista, Wizard and Storm Tower** (the Wizard banishes it back along its flight line, and Storm chains reach it). Catapult boulders and Alchemist flasks never target it, and their splash and poison skip it. Reaching the gate costs one life. The tower inspector shows "🦇 Hits flyers" or "Ground only" on every attacking tower.

**Bosses:** waves 5, 10, 15 and 20 have a boss, written into the level's wave table (`WAVES` in js/01-config.js, letters k King, m Ram, x Necromancer, b Dragon); the last waves of Barrow Moor, the Badlands and the Dread Wastes have two. Bosses have `bs:1` and `lv` = lives lost if they reach the gate (Dragon, Goblin King and Necromancer 5, Siege Ram 10); the Wizard banishes them and the Shaman heals them only a third as much. While a boss is on the board a health bar across the top of the view shows its name, health and the lives it would cost.
- **Goblin King:** every `KING.cd` = 5 s (the first 3 s after he appears) he lifts his sceptre and `sum` = 2 goblins step out beside him with 60% of a normal goblin's health, worth 2 gold each (`KING`, `summon()`).
- **Siege Ram:** slow (22) and costs 10 lives at the gate; its timbers shrug off 25% of physical damage.
- **Necromancer:** every ground enemy that is killed (not bosses, flyers or skeletons) leaves a corpse for `NEC.ct` = 6 s (`g.cps`). Every `NEC.cd` = 4 s the Necromancer raises up to `rz` = 2 of the nearest corpses within `NEC.r` = 160 as **Skeletons**, which carry on along the dead enemy's road (`raise()`). Skeletons: 0.6× health, speed 42, 1 gold. It resists magic by 50%.

**Goblin Sapper:** carries a lit bomb overhead. As soon as a tower (any kind) is within 90 (`SAP.r`, 1.5 tiles) of it and isn't already stunned or targeted by another living Sapper, it leaves the road, runs at it 40% faster and blows up within 22 of it. That tower is **stunned for 4 s** (`SAP.st`): it doesn't shoot (its reload is frozen), a stunned Banner Tower gives no boost, and stars circle it. The Sapper is gone (no gold, no life lost). If the tower is sold first, the Sapper walks back to where it left the road and carries on. Killed on the way, it pays its gold and the bomb fizzles. Logic in `sapMove()` (js/09-game.js); tower stun is `t.stun` (not saved – it only happens mid-wave).

**Troll:** slow and tough, with a basket of two goblins on its back. When killed (not when it leaks) it pays 12 gold and `spl` = 2 goblins jump out where it fell, each with **half** the normal goblin health for that wave, and carry on along its road (`trollSplit()`). Killing it near the gate is risky.

**Ghost:** floats along the road and every `PHZ.cd` = 3 s fades out for `PHZ.d` = 1 s (`e.out`; the first fade comes 1–3 s after it appears, so ghosts don't blink together). While faded no tower targets it, bullets already flying at it vanish, Catapult splash, Alchemist clouds and lightning chains skip it, and running poison pauses. It's see-through all the time and almost invisible while faded (its own cloned materials, `gm` – never the shared ones).

**Fire Imp:** a resistance of 1 (`rs:{fire:1}`) makes it **immune** to fire & poison. Towers never target an enemy they can't hurt (`dmul(e,k)<=0`), so the Alchemist ignores imps, and its cloud doesn't poison them. The preview says "immune to fire & poison".

**Goblin Shaman:** every 4 s (`HEAL.cd`, the first pulse 1.5 s after it appears) it sends out a green pulse that heals every other living enemy within 75 (`HEAL.r`, 1.25 tiles) by `hl` = 3% of that enemy's max health (Dragons by a third of that). It doesn't heal itself, and healing never goes above max health. Healed enemies show a green +number.

**Waves** are hand-designed per level: `WAVES` in js/01-config.js holds 20 wave strings per level (format explained in the comment above it, e.g. `"Wolf rush: 6n ~2 14f/.35"`), read by `waveQ()` in js/09-game.js. Each wave has a name shown in the next-wave preview and while it runs. Every five waves follow a rhythm: an opener that often brings in a new enemy, a swarm, a wolf rush or knight push, a heavier mixed wave, then a boss with an escort. The wave after a boss is a **Breather** (fewer, weaker enemies). Wave shapes used: **wolf rush** (a tight pack of wolf riders 0.3 s apart), **knight push** (knights spaced out among goblins), **shield wall** (Shieldbearers in front), **mixed swarm** (one long column cycling through many types), **bone horde** (dozens of skeletons, Barrow Moor), **imp swarm** (Badlands), **pincer** (two-road levels: one group down each road at once), and a **last stand** before the final boss. In boss finales the escort comes first, then a lull, so the towers can turn on the boss. Enemy health is `30 × 1.2^wave × E[type].h × level hp`, so the tables only set the mix and pacing. Check a table with `npm run sim -- --waves N` (counts, health in goblin units, gold, spawn time).

**Simulator check for the hand-designed waves** (`scripts/layouts/levelN-full.json`, a sensible all-round build per level that keeps spending its gold): every level is won, losing 0 / 8 / 12 / 12 / 10 / 13 / 14 / 15 lives on levels 1–8. Most late losses are the final boss getting through with ~5–15% health left, so a slightly better build saves them. Bats were the big trap in the first draft: their straight flight line often misses the towers (on Barrow Moor it crosses the empty top of the board), so the tables keep bat groups small and spread out, and `level6-full` has two archers on the flight line. With the old formula waves the same full layouts lost on levels 2, 3, 4, 6, 7 and 8. The older partial layouts (`level4/6/7-mixed`) stop building mid-game and still lose, now while sitting on 1,200+ unspent gold.


**Simulator check for Sappers and Trolls** (`--keep-going`, lives lost after bats → with both): `level1-example` 12 → 19, `level1-physical` 15 → 16, `level1-mixed` 7 → 11, `level4-mixed` 73 → 79 (defeat on wave 18 instead of 19). All Level 1 runs still win, but `level1-example` only just; it ends with ~1900 unspent gold, and adding six steps with it (Archers and a Storm Tower at 6,4 / 8,4, both upgraded to 3) brings it down to 5 lives lost. Trolls were the hard part: at 3× health with full-strength goblins, three per wave from wave 12, two Level 1 runs lost on wave 20, and lowering only their health barely helped – fewer Trolls (every 17th) and half-health goblins did. The Sapper's stun barely moved the numbers (4 s vs 2.5 s ≈ the same).

**Simulator check for bat swarms** (`--keep-going`, lives lost before → after): `level1-example` 9 → 12, `level1-physical` 14 → 15, `level1-mixed` 13 → 7, `level4-mixed` 84 → 73 (defeat on wave 19 instead of 18). Bat health is very sensitive: at 0.5× the swarms were free gold, at 0.8× `level1-example` lost on wave 20, at 1.0× with speed 70 two of the Level 1 runs did. 0.6× keeps the overall difficulty about where it was. The reference layouts all have Archers and Storm Towers on the board centre, which the flight line crosses; a Catapult/Alchemist-heavy build would suffer more.

**Simulator check for the new enemies** (`--keep-going`, lives lost after the armour change → with Shieldbearers and Shamans): `level1-example` 12 → 9, `level1-physical` 12 → 14, `level1-mixed` 8 → 13, `level4-mixed` 68 → 84 (defeat on wave 18 instead of 19). All the Level 1 runs still win; the extra losses fall in waves 18–20, where the reference layouts stop building and sit on 1000+ unspent gold. A first try that healed 8% every 3 s lost the mixed run on wave 20, so the heal was cut to 3% every 4 s and the Shieldbearer's health from 1.6× to 1.4×.

## Meeting new enemies and the Bestiary
- The first time an enemy type ever spawns (on any level), the game pauses and a card shows its portrait, name, a short description and chips for health (× a goblin), speed, gold, flying and resistances. It closes by itself after 7 s (a bar runs down along the bottom), or with **Got it**, a click on the card, Space, Enter or Esc, and the game carries on (it stays paused if you had paused it yourself). Several new types in one wave each get their card in turn.
- Which types you've met, and where (level and wave of the first meeting), is kept in the browser (localStorage `sfseen`); it isn't tied to a level or a saved run.
- **Bestiary** (main menu): all 11 enemy types in a fixed order with the same portrait, description and chips plus "First met: <level>, wave N"; types not met yet show a dark silhouette and "???". The counter on top says how many you've met.
- Portraits aren't image files: each enemy's model is rendered once into a small picture when it's first needed.

## Ending scenes
- Victory: the camera sweeps over the castle and fireworks go off.
- Defeat: the castle burns, the keep collapses and the enemy army cheers.

## Controls
Mouse/touch: click an empty tile to build (between waves), click a tower to upgrade or sell it (selling only between waves), click the road to send the hero there, right-click anywhere (or Esc) to deselect it. Drag to rotate the camera (360°), scroll/pinch to zoom, right-drag/two fingers to pan. Keys 1–9 pick a tower (between waves) and 1–4 use the hero's abilities (during a wave), Space starts the wave (and resumes if paused), P pauses/resumes, U upgrades and S sells (or undoes) the selected tower, Ctrl+Z (or Z) undoes the last tower placed this break, C (or the grid button) toggles the coverage map, T changes the selected tower's targeting, B/N pick the first/second level-3 path of the selected tower, a click on the road moves the selected Barracks' rally point, F cycles game speed ×1/×2/×3 (also buttons next to the wave button), Q/E rotate. While paused you can still build, upgrade, sell and move the camera; the music drops to a quiet bed. At ×2/×3 everything in the game runs faster, and the music picks up a little. Click the minimap to jump there. ♪ and 🔊 toggle music and sound effects; ? lists the controls. ☰ or Esc opens the main menu (pauses the game); Bestiary there lists the enemies you've met, Settings has music, sound, glow, shadows and resolution. Hovering a tower in the dock shows its DPS, damage, fire rate and range. While placing a tower (mouse hover) or with one selected, the road cells whose centre lies in its range are tinted gold (red if you can't afford it). The coverage map colours every road cell on the board by how many attacking towers reach it (dark = none, then blue/green/yellow/orange/red for 1…5+), including the tower you are about to place; Banner Tower and Treasury don't count.

## Open questions
- Is the Wizard too strong or too weak? (Tune distance, reload and the 4 s immunity in `banish()` / `T.frost`.)
- Are 20 waves the right length, and how should the difficulty ramp up?
- Are the later levels too hard or too easy? Tune `gold`, `hp` and blocked tiles `bk` per level in `LEVELS`, or the waves in `WAVES`, and check with the `levelN-full` layouts. The simulator's builds are fixed; real players adapt (more air defence after the first bats), so playtest feedback should win over sim numbers.
