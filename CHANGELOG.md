# Changelog

All changes to Castle Defense, newest first. Each entry says what changed for the player (or the project), not how the code works.

## 2026-10-29
- **New enemy: Shieldbearer** (from wave 8). A stocky goblin behind a big tower shield that blocks three quarters of the damage from arrows and Ballista bolts that hit it from the front. You'll hear a clang and see grey numbers when it blocks. Shoot it from the side or behind, or use catapults, magic, poison or lightning, which go around the shield.
- **New enemy: Goblin Shaman** (from wave 10). It leans on a skull staff, and every few seconds it sends out a green pulse that heals the enemies around it (green numbers show how much). Dragons only get a little of it. Take the Shaman down first!
- The next-wave preview lists what the new enemies do, along with the other enemies' resistances.
- **Damage types and armour:** every tower now deals physical, magic, fire & poison or lightning damage (shown on the tower card). **Black Knights** wear heavy armour and shrug off half of all physical damage from Archers and Catapults, but they now have less health, so magic, poison and lightning cut through them. The **Ballista** pierces armour, and the **Storm Tower**'s lightning ignores it. **Dragons** shrug off half of the Alchemist's fire & poison. Resisted hits show grey damage numbers and armour-piercing hits show pale gold. The next-wave preview lists what the coming enemies resist.
- **Call waves early for bonus gold:** after each wave you get a 25-second break. Start the next wave before the time is up and you earn bonus gold – the more time left, the bigger the bonus, and it grows in later waves. The wave button shows the bonus and the seconds left.
- **Auto-start waves:** a new option in Settings starts the next wave by itself when the break runs out, so the battle keeps flowing. It's off by default.
- **See what a tower will reach:** while you choose where to place a tower, the road tiles inside its range light up in gold (red if you can't afford it yet). Selecting a tower shows the same.
- **Coverage map:** press **C** (or the new grid button by the minimap) to colour the whole road by how many towers reach each tile. Dark tiles are gaps nobody covers; blue, green, yellow, orange and red mean 1 to 5+ towers. While it's on, the tower you're placing is counted too, so you can see the gaps it would fill.
- **Upgrade and sell hotkeys:** with a tower selected, press **U** to upgrade it or **S** to sell it.
- **Undo:** changed your mind? A tower you place between waves can be taken back for a full refund, upgrades included, until you start the next wave. The Sell button turns into **Undo**, and **Ctrl+Z** takes back the last tower you placed. The help popover lists all the new keys.
- **Targeting modes:** select a tower to choose who it shoots at: **First**, **Last**, **Strongest**, **Fastest** or **Closest**. Press **T** to cycle through them. The Ballista still goes for the strongest enemy and everything else for the one in front, until you change it. Your choices are kept when you upgrade and are saved with your run.
- **Pause:** press **P** or the new pause button next to the speed buttons to freeze the battle. A "Paused" sign shows until you carry on, the music turns down, and you can still build, upgrade and sell towers while you think.
- **Game speed hotkey:** press **F** to switch between ×1, ×2 and ×3. At higher speeds all the animations, effects and even the music keep pace with the action.
- **Your progress is saved:** the game now remembers your run between waves. If you refresh the page, close the tab or quit, choose **Continue** in the menu to pick up where you left off, at the start of the next wave. The level list shows which levels have a run in progress.
- **Restart level:** the menu has a new **Restart level** button (click it twice, so you can't lose a run by accident), and the victory and defeat screens now offer **Restart level** too.
- **Project housekeeping:** added a balance simulator that plays through a level with a given set of towers in a few seconds, so future changes to difficulty can be tested properly before they reach you.
- **Works offline:** the game no longer needs to fetch its 3D engine from the internet when it starts, so it loads faster and keeps working on a shaky connection or with no connection at all (when run locally).
- **Project housekeeping:** added a roadmap of planned features (new enemies, upgrade paths, pause and game speed, spells, stars and more) to guide future updates.

## 2026-10-26
- **New-look towers:** every tower has been rebuilt with far more detail. They all stand on a rough stone plinth and have sloped stone feet, loose stones in the walls, studded doors with stone arches, arrow slits, corbelled battlements and plank floors. Each has its own touches: ivy and a barrel of spare arrows on the Archers (with shields on the walls once upgraded); spoked wheels, a banded counterweight crate, a winch and a pile of stones on the Catapult; glowing rune rings, a balcony, a turret and a magic circle on the Wizard tower, whose wizard now has a long beard and a crooked hat; buttresses and a proper crossbow with curved arms and a winch on the Ballista; copper pipes, insulators and a coiled spire on the Storm Tower; a bubbling cauldron over a fire, a copper still and a shelf of glowing potions on the Alchemist; long swallow-tailed banners and pennants on the Banner Tower; and an iron-studded vault door, a ribbed golden dome, treasure chests and a coin sack on the Treasury. The little crewmen have rounded bodies, faces and pointed hoods or iron hats.
- **New-look enemies:** every enemy has been rebuilt with far more detail. Goblins have long ears, tusks, beady eyes, open leather jerkins, belts with pouches and bone necklaces, and come in two kinds: helmeted ones with a round shield and spiked club, and mohawked ones in fur with a rusty cleaver. Wolf riders sit on shaggy wolves with a mane, bushy tail, spiked collar, snarling jaws and a red saddle blanket, carrying a pennant spear. Black knights wear full plate with spiked shoulder guards, a horned helmet with a plume, a red cape and tabard, a kite shield and a greatsword. The dragon has horns, glowing eyes, fangs, belly plates, a spiked back and tail, and proper bat-like wings with fingers and torn edges.
- **Better-looking ground:** the roads are no longer neat square tiles. They're now cobbled tracks that blend into the grass, with worn dirt edges, scattered edge stones and rough, uneven borders. Grass and earth no longer show an obvious repeating pattern, and the ground darkens where it meets the walls.
- **Soft shading where things meet:** towers, walls, trees, houses and the castle now have soft shadows at their bases and in their nooks, so everything sits firmly on the ground instead of floating. You can turn this off under Settings → Ambient occlusion if the game runs slowly.
- **Sharper surfaces:** stone, wood, roofs, rock and earth have twice as much detail on computers, and their shine varies (rougher in cracks and gaps). Shadows are crisper too. Phones and tablets keep the lighter settings so the game stays smooth.
- **A real moat:** the water around the castle is now a sunken channel with stone banks, deep water that gets shallower at the edges, gently moving ripples and lily pads. Its colour suits each land – clear blue in the fields, murky green in the marsh, dark and gloomy in the Dread Wastes.
- **8 levels:** the castle now has to be defended through eight lands, each worse than the last – the peaceful fields, a dark forest full of fireflies, a burning forest with burnt-out villages, a misty marsh, a smouldering ruined town, a haunted graveyard moor, scorched badlands with rivers of lava and finally the Dread Wastes under a blood-red sky. Every level has its own road, its own breach in the wall and its own spot for the castle, and some are bigger or smaller than others.
- **Harder to build:** later levels have tiles you can't build on (stumps, bog pools, rubble, graves, lava pits), roads that are harder to cover, and the last two levels have two breaches, so the enemy comes from two sides at once.
- **Levels menu:** win a level to unlock the next. Pick any unlocked level from Levels in the main menu, or go straight to the next one from the victory screen. The current level is shown under the title.
- **Moodier colours:** the world has a darker, more natural look – earthier grass, a softer sky, deeper water and toned-down colours everywhere – while torches, magic and fireworks still glow.
- The new colours were a little too grey and dark, so they're now a bit brighter and livelier while staying natural.
- **Brighter shadows:** the whole game is lighter, and shadows are soft and see-through instead of almost black.
- Right-click anywhere to deselect the tower you have selected.
- **New look:** the whole interface has been redesigned. The battlefield now fills the screen, with the controls floating on top as sleek glass panels in gold and dark wood tones. On phones the controls sit neatly below the battlefield.
- **Tower stats:** the info panel now shows each defender's DPS, damage, fire rate and range, with bars so you can compare towers at a glance. Selected towers also show what the next upgrade gives you, in green.
- **Next wave preview:** see how many goblins, wolf riders, knights and dragons are coming before you start a wave, and how many are left during it.
- Hover over a tower in the dock to see its stats before you buy it. A new ? button lists all the controls, and the speed buttons (×1, ×2, ×3) can be picked directly.
- Redesigned victory and defeat screens.
- **Main menu:** the game now opens on a main menu with Play, Settings, Changelog and Quit. Open it any time with the ☰ button or Esc – the game pauses while it's open, and Play picks up where you left off.
- **Settings:** turn music, sound effects, glow, shadows and high resolution on or off. Your choices are remembered; turning off the graphics options helps on slower phones and laptops.
- **Changelog in the game:** read what's new straight from the menu.
- **Live online:** the game is now hosted on GitHub Pages at https://lykhan28.github.io/slotsforsvar/ so friends can play it.
- **Fits any window:** the 3D view now fills the browser window at any size, with no page scrolling. On phones held upright, the camera widens so the whole board stays visible.
- **New Wizard role:** the Wizard now banishes enemies back along the road instead of freezing them.
- **English:** all in-game text translated from Danish to English; the title is now "Castle Defense".
- Fixed a black screen on start caused by the scenery loading before the towers.
- Project housekeeping: removed old duplicate files, added notes for working on the project.

## 2026-10-25
- **First version:** the game split from one big script into separate files (no gameplay changes).
