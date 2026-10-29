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
| Ballista | 125 | 190 | 66 | 2.2 s | Targets Strongest by default (the enemy with the most health left) |
| Storm Tower | 150 | 105 | 16 | 1.0 s | Chain lightning hits 5/6/7 targets, stuns for 0.2 s, 8% less damage per jump |
| Alchemist | 90 | 115 | 7.8/s | 1.1 s | Poison flask, radius 45, poisons for 3 s |
| Banner Tower | 120 | 120 | – | – | +20% damage (+10% per level) to towers in range |
| Treasury | 150 | – | – | – | 15 gold × level at the end of each wave |

**Targeting:** every attacking tower has a targeting mode, picked in the inspector or cycled with T on the selected tower: **First** (closest to the castle, by road length left), **Last**, **Strongest** (most health left), **Fastest** (fastest enemy type, ties go to First) and **Closest** (to the tower). Defaults: Ballista Strongest, everything else First. Storm Tower picks its first target this way, then chains to the nearest enemies; Archers pick their 1–3 targets in that order. The mode is kept through upgrades and saved with the run; Banner Tower and Treasury have none.

## Enemies
| Type | Speed | Health (× base) | Gold |
|---|---|---|---|
| Goblin (norm) | 50 | 1.0 | 5 |
| Wolf rider (fast) | 90 | 0.6 | 5 |
| Black knight (tank) | 35 | 2.6 | 10 |
| Dragon (boss) | 30 | 12 | 50 |

Base health = `30 × 1.2^wave`. Wave n has `5 + 2n` enemies, spawning 0.8 s apart. From wave 3 every 3rd enemy is a wolf rider, from wave 5 every 5th is a knight, and every 5th wave ends with a dragon.

## Ending scenes
- Victory: the camera sweeps over the castle and fireworks go off.
- Defeat: the castle burns, the keep collapses and the enemy army cheers.

## Controls
Mouse/touch: click an empty tile to build, click a tower to upgrade or sell it, right-click anywhere (or Esc) to deselect it. Drag to rotate the camera (360°), scroll/pinch to zoom, right-drag/two fingers to pan. Keys 1–8 pick a tower, Space starts the wave (and resumes if paused), P pauses/resumes, U upgrades and S sells (or undoes) the selected tower, Ctrl+Z (or Z) undoes the last tower placed this break, C (or the grid button) toggles the coverage map, T changes the selected tower's targeting, F cycles game speed ×1/×2/×3 (also buttons next to the wave button), Q/E rotate. While paused you can still build, upgrade, sell and move the camera; the music drops to a quiet bed. At ×2/×3 everything in the game runs faster, and the music picks up a little. Click the minimap to jump there. ♪ and 🔊 toggle music and sound effects; ? lists the controls. ☰ or Esc opens the main menu (pauses the game); Settings there has music, sound, glow, shadows and resolution. Hovering a tower in the dock shows its DPS, damage, fire rate and range. While placing a tower (mouse hover) or with one selected, the road cells whose centre lies in its range are tinted gold (red if you can't afford it). The coverage map colours every road cell on the board by how many attacking towers reach it (dark = none, then blue/green/yellow/orange/red for 1…5+), including the tower you are about to place; Banner Tower and Treasury don't count.

## Open questions
- Is the Wizard too strong or too weak? (Tune distance, reload and the 4 s immunity in `banish()` / `T.frost`.)
- Are 20 waves the right length, and how should the difficulty ramp up?
- Are the later levels too hard or too easy? Tune `gold`, `hp` and blocked tiles `bk` per level in `LEVELS`.
