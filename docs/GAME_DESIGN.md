# Game design – Castle Defense (Slotsforsvar)

Up to date as of version 0.1.0 plus levels. The numbers live in `js/01-config.js` (levels `LEVELS`, towers `T`, enemies `E`) and `js/09-game.js` (waves, economy).

## Goal
Defend the castle through 20 waves on each of 8 levels. Enemies pour in through a breach in the wall and march along the road to the castle gate. Every enemy that gets through costs a life (a boss costs 5). You start with 20 lives and 120 gold.

## Levels
Each level is a walled board with the same castle outside one of its walls. Winning a level unlocks the next; any unlocked level can be replayed from Levels in the menu. A run is saved during every break between waves, so closing or refreshing the page and choosing Continue picks it up at the start of the next wave (a refresh mid-wave replays that wave from its start). Each level keeps its own saved run; winning, losing or Restart level (menu, end screen) ends it.

| # | Level | Land | Board | Breaches → castle | Blocked tiles | Start gold | Enemy health |
|---|---|---|---|---|---|---|---|
| 1 | Greenmeadow | Fields | 12×8 | west → east | 0 | 120 | ×1 |
| 2 | Darkwood | Dark forest | 10×7 | north → east | 4 | 130 | ×1 |
| 3 | Emberwood | Burning forest, burnt houses | 13×8 | south → north | 5 | 140 | ×1.05 |
| 4 | Mirefen | Marsh | 14×9 | west → south | 11 | 150 | ×1.1 |
| 5 | Ashfall | Ruined, smouldering town | 11×7 | east → west | 7 | 160 | ×1.1 |
| 6 | Barrow Moor | Graveyard moor | 15×9 | north → east | 12 | 170 | ×1.15 |
| 7 | Scorched Badlands | Cracked earth and lava | 12×9 | west + north → south | 9 | 190 | ×1.15 |
| 8 | The Dread Wastes | Black rock, lava, red sky | 16×10 | west + east → north | 16 | 220 | ×1.2 |

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
| Shieldbearer (guard) | 40 | 1.4 | 8 |
| Goblin Shaman (shaman) | 45 | 0.9 | 9 |
| Bat swarm (bat, flying) | 60 | 0.6 | 5 |

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

Damage numbers are red for a full hit, **grey** when the enemy resisted part of it, and **pale gold** when the Ballista pierced armour. The next-wave preview has a line listing the coming enemies' resistances (hover an enemy icon for the same). Knights were cut from 2.6× to 1.8× health when they got their armour: against physical damage they are as tough as a 3.6× enemy, against everything else weaker than before.

**Simulator check** (`--keep-going`, lives lost before → after): `level1-example` (mostly physical, one Ballista, two Storm Towers) 11 → 12, `level1-physical` (Archers and Catapults only) 7 → 12, `level1-mixed` 8 → 8, `level4-mixed` 72 → 68. A one-sided physical build is punished, a mixed one is unchanged or better.

**Shieldbearer:** its tower shield blocks `shd` = 75% of an Archer arrow's or Ballista bolt's damage when the shot comes at its front: the shot's direction of travel is within about 70° of head-on to the way it is walking (`shBlk()` in js/09-game.js). Shots from the side or behind, Catapult boulders (they come down from above) and all magic, poison and lightning damage go around it. A blocked hit gives sparks, a clang and a grey number. The Ballista pierces armour but not the shield.

**Flying enemies (Bat swarm):** an enemy with `fy` (its flying height) ignores the road and flies in a straight line from where its breach's road starts to where the road ends at the gate (`FPATHS` in js/01-config.js, one per breach, so on levels 7–8 they come from both breaches). On Greenmeadow the flight is 836 long against 1920 for the road (44%). Only towers with `air` can target it: **Archers, Ballista, Wizard and Storm Tower** (the Wizard banishes it back along its flight line, and Storm chains reach it). Catapult boulders and Alchemist flasks never target it, and their splash and poison skip it. Reaching the gate costs one life. The tower inspector shows "🦇 Hits flyers" or "Ground only" on every attacking tower.

**Goblin Shaman:** every 4 s (`HEAL.cd`, the first pulse 1.5 s after it appears) it sends out a green pulse that heals every other living enemy within 75 (`HEAL.r`, 1.25 tiles) by `hl` = 3% of that enemy's max health (Dragons by a third of that). It doesn't heal itself, and healing never goes above max health. Healed enemies show a green +number.

Base health = `30 × 1.2^wave`. Wave n has `5 + 2n` enemies, spawning 0.8 s apart. From wave 3 every 3rd enemy is a wolf rider, from wave 5 every 5th is a knight, and every 5th wave ends with a dragon. From wave 6 every 6th enemy (positions 2, 8, 14, …) is a bat swarm. From wave 8 every 7th enemy (positions 4, 11, 18, …) is a Shieldbearer, and from wave 10 every 11th (positions 7, 18, 29, …) is a Shaman, both instead of a goblin or wolf rider (a knight keeps its slot; when two of them would take the same slot, the Shaman wins over the Shieldbearer and both win over a bat swarm).

**Simulator check for bat swarms** (`--keep-going`, lives lost before → after): `level1-example` 9 → 12, `level1-physical` 14 → 15, `level1-mixed` 13 → 7, `level4-mixed` 84 → 73 (defeat on wave 19 instead of 18). Bat health is very sensitive: at 0.5× the swarms were free gold, at 0.8× `level1-example` lost on wave 20, at 1.0× with speed 70 two of the Level 1 runs did. 0.6× keeps the overall difficulty about where it was. The reference layouts all have Archers and Storm Towers on the board centre, which the flight line crosses; a Catapult/Alchemist-heavy build would suffer more.

**Simulator check for the new enemies** (`--keep-going`, lives lost after the armour change → with Shieldbearers and Shamans): `level1-example` 12 → 9, `level1-physical` 12 → 14, `level1-mixed` 8 → 13, `level4-mixed` 68 → 84 (defeat on wave 18 instead of 19). All the Level 1 runs still win; the extra losses fall in waves 18–20, where the reference layouts stop building and sit on 1000+ unspent gold. A first try that healed 8% every 3 s lost the mixed run on wave 20, so the heal was cut to 3% every 4 s and the Shieldbearer's health from 1.6× to 1.4×.

## Ending scenes
- Victory: the camera sweeps over the castle and fireworks go off.
- Defeat: the castle burns, the keep collapses and the enemy army cheers.

## Controls
Mouse/touch: click an empty tile to build, click a tower to upgrade or sell it, right-click anywhere (or Esc) to deselect it. Drag to rotate the camera (360°), scroll/pinch to zoom, right-drag/two fingers to pan. Keys 1–8 pick a tower, Space starts the wave (and resumes if paused), P pauses/resumes, U upgrades and S sells (or undoes) the selected tower, Ctrl+Z (or Z) undoes the last tower placed this break, C (or the grid button) toggles the coverage map, T changes the selected tower's targeting, F cycles game speed ×1/×2/×3 (also buttons next to the wave button), Q/E rotate. While paused you can still build, upgrade, sell and move the camera; the music drops to a quiet bed. At ×2/×3 everything in the game runs faster, and the music picks up a little. Click the minimap to jump there. ♪ and 🔊 toggle music and sound effects; ? lists the controls. ☰ or Esc opens the main menu (pauses the game); Settings there has music, sound, glow, shadows and resolution. Hovering a tower in the dock shows its DPS, damage, fire rate and range. While placing a tower (mouse hover) or with one selected, the road cells whose centre lies in its range are tinted gold (red if you can't afford it). The coverage map colours every road cell on the board by how many attacking towers reach it (dark = none, then blue/green/yellow/orange/red for 1…5+), including the tower you are about to place; Banner Tower and Treasury don't count.

## Open questions
- Is the Wizard too strong or too weak? (Tune distance, reload and the 4 s immunity in `banish()` / `T.frost`.)
- Are 20 waves the right length, and how should the difficulty ramp up?
- Are the later levels too hard or too easy? Tune `gold`, `hp` and blocked tiles `bk` per level in `LEVELS`.
