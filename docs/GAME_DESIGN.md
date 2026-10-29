# Game design – Castle Defense (Slotsforsvar)

Up to date as of version 0.1.0 plus levels. The numbers live in `js/01-config.js` (levels `LEVELS`, towers `T`, enemies `E`) and `js/09-game.js` (waves, economy).

## Goal
Defend the castle through 20 waves on each of 8 levels. Enemies pour in through a breach in the wall and march along the road to the castle gate. Every enemy that gets through costs a life (a boss costs 5). You start with 20 lives and 120 gold.

## Levels
Each level is a walled board with the same castle outside one of its walls. Winning a level unlocks the next; any unlocked level can be replayed from Levels in the menu. A run is saved during every break between waves, so closing or refreshing the page and choosing Continue picks it up at the start of the next wave (a refresh mid-wave replays that wave from its start). Each level keeps its own saved run; winning, losing or Restart level (menu, end screen) ends it.

| # | Level | Land | Board | Breaches → castle | Blocked tiles | Start gold | Enemy health | Extra special enemies | Bosses (waves 5 / 10 / 15 / 20) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Greenmeadow | Fields | 12×8 | west → east | 0 | 120 | ×1 | – | King / Ram / King / Dragon |
| 2 | Darkwood | Dark forest | 10×7 | north → east | 4 | 130 | ×1 | Ghosts (rare) | King / Necromancer / Ram / Dragon |
| 3 | Emberwood | Burning forest, burnt houses | 13×8 | south → north | 5 | 140 | ×1.05 | – | Ram / King / Dragon / Dragon |
| 4 | Mirefen | Marsh | 14×9 | west → south | 11 | 150 | ×1.1 | – | Necromancer / King / Ram / Dragon |
| 5 | Ashfall | Ruined, smouldering town | 11×7 | east → west | 7 | 160 | ×1.1 | – | Ram / Necromancer / King / Dragon |
| 6 | Barrow Moor | Graveyard moor | 15×9 | north → east | 12 | 170 | ×1.15 | Ghosts (many) | Necromancer / King / Necromancer / Necromancer |
| 7 | Scorched Badlands | Cracked earth and lava | 12×9 | west + north → south | 9 | 190 | ×1.15 | Fire Imps | Ram / Dragon / King / Dragon |
| 8 | The Dread Wastes | Black rock, lava, red sky | 16×10 | west + east → north | 16 | 220 | ×1.2 | Fire Imps, Ghosts (rare) | Necromancer / Ram / Dragon / Dragon |

Every level has the standard special enemies (bat swarms, Shieldbearers, Sappers, Shamans, Trolls); the last column lists the extra ones. A level's `ex` in `LEVELS` (js/01-config.js) decides which special enemies it uses and how often – see Enemies.

Tower placement gets harder level by level: more blocked tiles (often right where two stretches of road would overlap), long straight roads, and on levels 7–8 two breaches that split each wave between two roads (enemies alternate between them; the roads merge before the gate).

## Economy
- Gold for every enemy killed (`rw`), plus a wave bonus of `20 + 2 × wave` at the end of each wave.
- Upgrading costs `price × 0.8 × level` (level 1→2, 2→3). Selling refunds 60% of everything spent on the tower. **Undo:** a tower placed during the break between waves can be taken back for a full refund (including upgrades bought on it) until the next wave starts – the Sell button turns into Undo, and Ctrl+Z/Z undoes the latest one. Towers placed mid-wave can only be sold.
- Each upgrade gives +60% damage and +10 range.
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

**Bosses:** waves 5, 10, 15 and 20 end with a boss, picked by the level's `bs` list in `LEVELS` (js/01-config.js; a level without one gets the Dragon every time). Bosses have `bs:1` and `lv` = lives lost if they reach the gate (Dragon, Goblin King and Necromancer 5, Siege Ram 10); the Wizard banishes them and the Shaman heals them only a third as much. While a boss is on the board a health bar across the top of the view shows its name, health and the lives it would cost.
- **Goblin King:** every `KING.cd` = 5 s (the first 3 s after he appears) he lifts his sceptre and `sum` = 2 goblins step out beside him with 60% of a normal goblin's health, worth 2 gold each (`KING`, `summon()`).
- **Siege Ram:** slow (22) and costs 10 lives at the gate; its timbers shrug off 25% of physical damage.
- **Necromancer:** every ground enemy that is killed (not bosses, flyers or skeletons) leaves a corpse for `NEC.ct` = 6 s (`g.cps`). Every `NEC.cd` = 4 s the Necromancer raises up to `rz` = 2 of the nearest corpses within `NEC.r` = 160 as **Skeletons**, which carry on along the dead enemy's road (`raise()`). Skeletons: 0.6× health, speed 42, 1 gold. It resists magic by 50%.

**Goblin Sapper:** carries a lit bomb overhead. As soon as a tower (any kind) is within 90 (`SAP.r`, 1.5 tiles) of it and isn't already stunned or targeted by another living Sapper, it leaves the road, runs at it 40% faster and blows up within 22 of it. That tower is **stunned for 4 s** (`SAP.st`): it doesn't shoot (its reload is frozen), a stunned Banner Tower gives no boost, and stars circle it. The Sapper is gone (no gold, no life lost). If the tower is sold first, the Sapper walks back to where it left the road and carries on. Killed on the way, it pays its gold and the bomb fizzles. Logic in `sapMove()` (js/09-game.js); tower stun is `t.stun` (not saved – it only happens mid-wave).

**Troll:** slow and tough, with a basket of two goblins on its back. When killed (not when it leaks) it pays 12 gold and `spl` = 2 goblins jump out where it fell, each with **half** the normal goblin health for that wave, and carry on along its road (`trollSplit()`). Killing it near the gate is risky.

**Ghost:** floats along the road and every `PHZ.cd` = 3 s fades out for `PHZ.d` = 1 s (`e.out`; the first fade comes 1–3 s after it appears, so ghosts don't blink together). While faded no tower targets it, bullets already flying at it vanish, Catapult splash, Alchemist clouds and lightning chains skip it, and running poison pauses. It's see-through all the time and almost invisible while faded (its own cloned materials, `gm` – never the shared ones).

**Fire Imp:** a resistance of 1 (`rs:{fire:1}`) makes it **immune** to fire & poison. Towers never target an enemy they can't hurt (`dmul(e,k)<=0`), so the Alchemist ignores imps, and its cloud doesn't poison them. The preview says "immune to fire & poison".

**Goblin Shaman:** every 4 s (`HEAL.cd`, the first pulse 1.5 s after it appears) it sends out a green pulse that heals every other living enemy within 75 (`HEAL.r`, 1.25 tiles) by `hl` = 3% of that enemy's max health (Dragons by a third of that). It doesn't heal itself, and healing never goes above max health. Healed enemies show a green +number.

Base health = `30 × 1.2^wave`. Wave n has `5 + 2n` enemies, spawning 0.8 s apart. From wave 3 every 3rd enemy is a wolf rider, from wave 5 every 5th is a knight, and every 5th wave ends with a boss (see Bosses). **Which special enemies, and how often, is per level:** `LEVELS[i].ex` maps a type to *every how many'th* enemy (the standard set `SPC` is bat 6, guard 7, sapper 8, shaman 11, troll 17; Barrow Moor adds ghost 4, Darkwood and the Dread Wastes ghost 13, the Badlands and the Dread Wastes imp 5). `SPX` in js/09-game.js gives each type its first wave and slot: enemy i of the wave is that type when `i % every == slot % every`. With the standard set: from wave 6 every 6th enemy (positions 2, 8, 14, …) is a bat swarm, from wave 9 every 8th (positions 6, 14, 22, …) a Sapper, from wave 12 every 17th (positions 11, 28, 45) a Troll. Ghosts start at wave 3 (slot 2: on Barrow Moor positions 3, 7, 11, …), Fire Imps at wave 4 (slot 0: positions 1, 6, 11, …). From wave 8 every 7th enemy (positions 4, 11, 18, …) is a Shieldbearer, and from wave 10 every 11th (positions 7, 18, 29, …) is a Shaman, both instead of a goblin or wolf rider (a knight keeps its slot; when two of them would take the same slot the order is Troll, Shaman, Shieldbearer, Sapper, Ghost, Fire Imp, bat swarm).

**Simulator check for Ghosts and Fire Imps:** Levels 1–5 don't use them, and moving the special enemies into `LEVELS` left `level1-example` and `level4-mixed` byte-identical. New rough reference layouts `level6-mixed` and `level7-mixed` (both lose – they're for comparing, not good builds): Barrow Moor with ghosts 126 lives lost, defeat on wave 13 (without ghosts: 116, defeat on wave 11); Scorched Badlands with imps 91, defeat on wave 18 (without: 95, wave 18). So neither changes the difficulty much on its own: ghosts are a little tougher than the goblins they replace but give 7 gold, and imps only hurt builds that lean on Alchemists.

**Simulator check for the new bosses** (`--keep-going`, lives lost with only Dragons → with each level's bosses): `level1-example` 19 → 19, `level1-physical` 16 → 16, `level1-mixed` 11 → 11, `level4-mixed` 79 → 72 (defeat on wave 19 instead of 18), `level6-mixed` 126 → 129 (defeat on wave 12 instead of 13), `level7-mixed` 91 → 88. None of the reference layouts lets a wave-5/10/15 boss reach the gate, so the Siege Ram's 10 lives never came into play; the losses are in waves 18–20 as before. A first version paid full goblin gold for the King's summons (+60 gold in his wave on Level 1), so they were cut to 2 gold.

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
Mouse/touch: click an empty tile to build, click a tower to upgrade or sell it, right-click anywhere (or Esc) to deselect it. Drag to rotate the camera (360°), scroll/pinch to zoom, right-drag/two fingers to pan. Keys 1–8 pick a tower, Space starts the wave (and resumes if paused), P pauses/resumes, U upgrades and S sells (or undoes) the selected tower, Ctrl+Z (or Z) undoes the last tower placed this break, C (or the grid button) toggles the coverage map, T changes the selected tower's targeting, F cycles game speed ×1/×2/×3 (also buttons next to the wave button), Q/E rotate. While paused you can still build, upgrade, sell and move the camera; the music drops to a quiet bed. At ×2/×3 everything in the game runs faster, and the music picks up a little. Click the minimap to jump there. ♪ and 🔊 toggle music and sound effects; ? lists the controls. ☰ or Esc opens the main menu (pauses the game); Bestiary there lists the enemies you've met, Settings has music, sound, glow, shadows and resolution. Hovering a tower in the dock shows its DPS, damage, fire rate and range. While placing a tower (mouse hover) or with one selected, the road cells whose centre lies in its range are tinted gold (red if you can't afford it). The coverage map colours every road cell on the board by how many attacking towers reach it (dark = none, then blue/green/yellow/orange/red for 1…5+), including the tower you are about to place; Banner Tower and Treasury don't count.

## Open questions
- Is the Wizard too strong or too weak? (Tune distance, reload and the 4 s immunity in `banish()` / `T.frost`.)
- Are 20 waves the right length, and how should the difficulty ramp up?
- Are the later levels too hard or too easy? Tune `gold`, `hp` and blocked tiles `bk` per level in `LEVELS`.
