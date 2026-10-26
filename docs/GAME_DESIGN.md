# Game design – Castle Defense (Slotsforsvar)

Up to date as of version 0.1.0. The numbers live in `js/01-config.js` (towers `T`, enemies `E`) and `js/09-game.js` (waves, economy).

## Goal
Defend the castle through 20 waves. Enemies pour in through the breach in the wall on the left and march along the road to the castle on the right. Every enemy that gets through costs a life (a boss costs 5). You start with 20 lives and 120 gold.

## Economy
- Gold for every enemy killed (`rw`), plus a wave bonus of `20 + 2 × wave` at the end of each wave.
- Upgrading costs `price × 0.8 × level` (level 1→2, 2→3). Selling refunds 60% of everything spent on the tower.
- Each upgrade gives +60% damage and +10 range.

## Towers (price / range / damage / reload)
| Tower | Price | Range | Damage | Reload | Special |
|---|---|---|---|---|---|
| Archers | 50 | 130 | 10 | 0.5 s | Shoots 1/2/3 targets at level 1/2/3 (the ones furthest ahead) |
| Catapult | 100 | 110 | 30 | 1.4 s | Area damage (radius 55). Slows enemies hit by 20/40/60% for 1 s |
| Wizard | 110 | 115 | 8 | 3.0 s | Banish: teleports the enemy closest to the castle 1/1.5/2 tiles back down the road (bosses only a third as far). A banished enemy is immune to banishing for 4 s, so several Wizards spread out |
| Ballista | 125 | 190 | 66 | 2.2 s | Always targets the enemy with the most health |
| Storm Tower | 150 | 105 | 16 | 1.0 s | Chain lightning hits 5/6/7 targets, stuns for 0.2 s, 8% less damage per jump |
| Alchemist | 90 | 115 | 7.8/s | 1.1 s | Poison flask, radius 45, poisons for 3 s |
| Banner Tower | 120 | 120 | – | – | +20% damage (+10% per level) to towers in range |
| Treasury | 150 | – | – | – | 15 gold × level at the end of each wave |

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
Mouse/touch: click an empty tile to build, click a tower to upgrade or sell it, right-click anywhere (or Esc) to deselect it. Drag to rotate the camera (360°), scroll/pinch to zoom, right-drag/two fingers to pan. Keys 1–8 pick a tower, Space starts the wave, Q/E rotate. Click the minimap to jump there. ♪ and 🔊 toggle music and sound effects; ? lists the controls. ☰ or Esc opens the main menu (pauses the game); Settings there has music, sound, glow, shadows and resolution. Hovering a tower in the dock shows its DPS, damage, fire rate and range.

## Open questions
- Is the Wizard too strong or too weak? (Tune distance, reload and the 4 s immunity in `banish()` / `T.frost`.)
- Are 20 waves the right length, and how should the difficulty ramp up?
- Should there be more maps? (The main menu exists now; a level picker could go under Play.)
