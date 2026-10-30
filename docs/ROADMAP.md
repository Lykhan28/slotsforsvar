# Roadmap – Castle Defense (Slotsforsvar)

A plan for growing the game, written as ready-to-use prompts. Each prompt is meant to start **one fresh session**, so it states what it wants on its own (a new session only knows `CLAUDE.md`). They're roughly in order, because later ones build on earlier ones (e.g. upgrade branches assume the armour system exists).

**For sessions working from this list:** when a prompt's task is done and committed, tick its box (`- [x]`) in the same commit. If the task changed shape along the way, add a short note under the prompt. If a prompt was skipped or split, say so here too.

**Tips for the player/developer**
- Use one prompt per session. If a prompt feels too big, the session can split it.
- Each session tests in the browser, adds a CHANGELOG entry, updates `CLAUDE.md`/`docs/GAME_DESIGN.md` and commits. It doesn't push until asked.
- After a few prompts, play a round before moving on. Playtest feedback beats any plan.

---

## Phase 0 – Foundations

- [x] **1. Vendor three.js**
```text
Vendor three.js r128 and the post-processing scripts into a vendor/ folder so the game no longer depends on CDNs. Update index.html, check that everything (bloom, AO, grade) still works, and remove the CDN note from CLAUDE.md.
```

- [x] **2. Balance simulator**
```text
Build a headless balance simulator (Node script, e.g. npm run sim) that runs the game logic from js/09-game.js without rendering. Given a level and a tower layout, it should play all 20 waves and report lives lost, gold over time and which wave the run failed on. Document how to use it in CLAUDE.md, because future balance changes should be checked with it.
```

- [x] **3. Save and restart**
```text
Save the game state to localStorage between waves so a page refresh can resume the run (offer "Continue" in the main menu). Also add a "Restart level" button to the end screen and the in-game menu.
```

## Phase 1 – Quality of life

- [x] **4. Pause and speed**
```text
Add pause (P key and a HUD button) and game speed 1×/2×/3× (a HUD toggle and the F key). Animations, spawning, cooldowns and audio pacing should all respect the speed. Show a clear "Paused" overlay.
```

- [x] **5. Targeting modes**
```text
Add per-tower targeting modes: First, Last, Strongest, Fastest, Closest. Make them selectable in the tower inspector and cycle them with the T key. Keep the Ballista's default as Strongest and the Wizard's as First. Update tstat()/infoHTML() if needed.
```

- [x] **6. Hotkeys and undo**
```text
Add hotkeys U (upgrade) and S (sell) for the selected tower, and let the player undo a tower placed during the build phase for a full refund until the next wave starts. Update the ? help popover.
```

- [x] **7. Coverage overlay**
```text
While placing a tower, show its range circle and tint the road tiles it would cover. Add a toggle (C key) that shows a heat-map of how many towers cover each road tile.
```

- [x] **8. Wave flow**
```text
Add an optional auto-start for waves (setting in the menu) with a countdown, and a "Call wave early" button that gives bonus gold based on the time left. Show the bonus on the button.
```

## Phase 2 – Enemies

- [x] **9. Armour system**
```text
Introduce damage types (physical, magic, fire/poison, lightning) for towers and armour/resistances for enemies. The Black Knight should resist physical damage, the Ballista should pierce armour, and Storm should ignore armour. Show resistances in the next-wave preview and the damage numbers (e.g. grey for resisted). Update GAME_DESIGN.md with a damage-type table and check the balance with the simulator.
```

- [x] **10. Shieldbearer and Shaman**
```text
Add two new enemies in the existing code-built style (see the enemy notes in CLAUDE.md – bakeE, rig names, no material swaps): a Shieldbearer whose tower shield blocks most frontal arrow/ballista damage, and a goblin Shaman who heals nearby enemies with a visible green pulse. Add them to waveMix from mid-game waves.
```

- [x] **11. Flying enemy**
```text
Add a flying enemy (bat swarm or small wyvern) that flies straight from the breach to the gate, ignoring the road. Only Archers, Ballista, Storm and Wizard can hit flyers (not Catapult or Alchemist). Show this in the tower inspector and the next-wave preview.
```

- [x] **12. Sapper and Troll**
```text
Add two enemies: a goblin Sapper that runs to the nearest tower near the road and blows up, stunning it for a few seconds, and a Troll that splits into two goblins when it dies. Make both readable at a glance (Sapper carries a lit bomb).
```

- [x] **13. Theme enemies**
```text
Add a Ghost that phases out (untargetable, translucent) for 1 s every few seconds, appearing mainly in Barrow Moor, and a Fire Imp that is immune to poison and fire, appearing on the lava levels. Let LEVELS control which special enemies each level uses.
```

- [x] **14. Enemy codex**
```text
When an enemy type appears for the first time, pause briefly and show a small card with its picture/name and what makes it special. Add a "Bestiary" page in the main menu listing every enemy seen so far (saved in localStorage).
```

- [x] **15. Boss variety**
```text
Add three new bosses alongside the Dragon: a Goblin King who summons goblins, a Siege Ram that takes 10 lives if it reaches the gate, and a Necromancer who raises skeletons from dead enemies. Let each level choose its bosses, and give each a boss health bar at the top of the screen.
```

- [x] **16. Designed waves**
```text
Replace the formula waves with hand-designed waves per level (a data table in js/01-config.js): wolf rushes, knight pushes, mixed swarms, breathers. Keep waveMix() working for the preview. Use the simulator so every level is winnable but gets harder.
```

## Phase 3 – Towers

- [x] **17. Upgrade branches, part 1**
```text
Add a branch choice at the level-3 upgrade for Archers (Longbowmen: range / Crossbow nest: armour piercing), Catapult (Fire pots: burning ground / Boulder: big single hit), Wizard (Archmage: banishes a group / Time Warden: slows time in an area) and Storm (Tempest: more jumps / Thunderlord: long stun). Each branch gets a visible model change. Update tstat(), infoHTML() and GAME_DESIGN.md.
```

- [x] **18. Upgrade branches, part 2**
```text
Add level-3 branch choices for Ballista, Alchemist, Banner Tower and Treasury, in the same style as the existing branches. Propose two interesting options for each and pick ones that fit the damage-type system.
```

- [x] **19. Barracks**
```text
Add a Barracks tower placed next to the road that sends 3 soldiers to block enemies at a rally point (movable). Soldiers fight, can die and respawn. Flyers ignore them. Build the soldiers from the chibi style.
```

- [ ] **20. Traps**
```text
Let the player place traps on road tiles: Spikes (damage), Tar pit (slow), Explosive barrel (one-time area blast). Traps are cheap, have limited uses and show their remaining charges.
```

- [x] **21. Hero** (built with 4 abilities – 3 on cooldowns and a once-a-wave Divine Smite – and with building/selling locked during waves)
```text
Add a hero (a knight on horseback) the player can move by clicking the road. The hero fights, levels up during a level and has one active ability on a cooldown (e.g. a shield bash that stuns). Respawns after a delay if killed.
```

## Phase 4 – Player abilities

- [x] **22. Spells** (on the hero bar, keys 1–3; Rain of Arrows and Reinforcements are aimed with a click, Boiling Oil always hits the three tiles at the gate)
```text
Add three spells with cooldowns and HUD buttons (keys Z/X/V): Rain of Arrows (area damage), Boiling Oil (damages everything near the gate) and Reinforcements (two temporary soldiers). Make them feel impactful with effects and sounds.
```

- [ ] **23. Gate and clicks**
```text
Let the player click enemies to throw a rock for small damage (with a short cooldown and a satisfying hit), and add a "Repair gate" button that buys back a life for a rising gold price.
```

## Phase 5 – Progression

- [x] **24. Stars**
```text
Award 1–3 stars per level based on lives left (show the thresholds), show them in the level picker and on the end screen, and save them in PROG.
```

- [x] **25. Difficulty**
```text
Add Easy/Normal/Hard difficulty chosen before starting a level (enemy health, gold and lives). Stars and progress are tracked per difficulty.
```

- [x] **26. Endless mode**
```text
Add an Endless mode for any won level: waves keep coming past 20 with rising difficulty and new mixes. Track a local highscore (waves survived) per level and show it in the level picker.
```

- [x] **27. Royal Armoury**
```text
Add a "Royal Armoury" menu page where stars buy permanent perks (e.g. +5% archer damage, +20 start gold, +1 life, cheaper upgrades). Perks can be reset for a refund. Keep the bonuses modest so the game stays challenging.
```

- [ ] **28. Challenge modifiers**
```text
Add optional challenge modifiers when starting a level (Archers only, No selling, Fast enemies, Fog of war, Double bosses) that give extra stars or a badge when won.
```

- [x] **29. Achievements**
```text
Add about 20 achievements (e.g. win without losing a life, banish a dragon 3 times, hold 1000 gold), with a small toast when one is unlocked and an Achievements page in the menu.
```

- [ ] **30. Daily challenge**
```text
Add a Daily Challenge: a level and set of modifiers seeded from today's date, so all friends get the same one. Show the best result on this device and a share text ("Castle Defense daily 2026-10-29: wave 17, 2 lives lost").
```

## Phase 6 – World

- [x] **31. Level mechanics, part 1**
```text
Give levels 2–4 their own gameplay mechanic: Darkwood (fog that shrinks tower range near the trees), Emberwood (burning tiles that spread and temporarily block building), Mirefen (swamp tiles that slow enemies). Show the mechanic in the level picker description.
```

- [x] **32. Level mechanics, part 2**
```text
Give levels 5–8 their own mechanic: Ashfall (collapsing ruins that open shortcuts), Barrow Moor (graves that spawn skeletons mid-road), Scorched Badlands (lava eruptions damaging an area), Dread Wastes (darkness phases that reduce range unless towers are lit).
```

- [ ] **33. Weather**
```text
Add weather events that can happen during a wave: rain (Storm stronger, Alchemist weaker, rain particles) and wind (arrows drift, visible in vegetation). Keep them readable, with a small HUD icon explaining the effect.
```

- [ ] **34. Day and night**
```text
Add a day/night cycle across waves: lighting, sky and fog shift towards dusk and night (respect EXPO/SUN0 and the GRADE shader), and torches on towers and walls light up at night. Keep the board readable.
```

- [x] **35. New levels** (done as eight: levels 9–16)
```text
Add three new levels with new themes: a snowy mountain fortress, a coastal cliff with pirates, and a mountain pass with a narrow road. Follow the level and theme notes in CLAUDE.md.
```

- [x] **36. World map**
```text
Replace the level list with an illustrated world map (2D, drawn in code or SVG) where each level is a location along a path, showing stars and locks. Clicking a location opens the level card.
```

- [ ] **37. Level editor**
```text
Add a level editor: paint roads, blocked cells, breach/gate positions and pick a theme, then test-play it. Levels export/import as a short share code so friends can swap levels.
```

## Phase 7 – Juice

- [x] **38. Impact feedback**
```text
Do a juice pass on combat: camera shake on catapult hits and boss deaths (with a setting to turn it off), a brief hit-stop on big kills, gold coins flying to the gold pill, and a big "Wave 10" / "Boss incoming" banner.
```

- [x] **39. Death variety**
```text
Give each enemy type more varied deaths: knights drop their shield and topple, wolves throw their rider who keeps running, goblins tumble, the dragon crashes down. Follow the rig name rules in CLAUDE.md.
```

- [x] **40. Build animations and crew**
```text
Add a build animation (scaffolding and dust as the tower rises, then crew pop in) and an upgrade animation. Make the crewmen react: cheer on kills, flinch when the gate is hit.
```

- [x] **41. Gate damage and story**
```text
Show gate damage as lives drop (cracks, then a splintered gate, then fires). Add a short narrator line before each level and after winning, written in natural English, shown as a parchment card.
```

## Phase 8 – Audio

- [x] **42. Theme music**
```text
Give each level theme its own music variation using the existing WebAudio generator (different scale, tempo, instruments) for both calm and battle music.
```

- [x] **43. Sound design**
```text
Add positional audio (sounds fade with distance from the camera target) and more sound variety: enemy-specific death sounds, a boss roar, gold clinks, a wave-start horn and a victory fanfare.
```

## Phase 9 – Mobile and accessibility

- [x] **44. Touch UI**
```text
Improve the phone experience: bigger touch targets, long-press a tower or dock item to see its info, and make sure every new HUD element fits at ≤700 px. Test with the mobile viewport.
```

- [x] **45. Accessibility and auto-quality**
```text
Add a colourblind-friendly option (patterns/icons on status effects and range circles, adjusted health bar colours) and an auto-quality setting that lowers glow/AO/shadows/resolution when the frame rate stays low.
```

- [ ] **46. PWA**
```text
Make the game an installable PWA: manifest, icons, and a service worker that caches all files so it works offline. Make sure updates still arrive after a git push.
```

## Phase 10 – Technical health

- [ ] **47. Full balance pass**
```text
Use the balance simulator to do a full balance pass over all levels, towers and difficulties. Look for dominant strategies and useless towers, and report findings before changing numbers.
```

- [ ] **48. Smoke tests**
```text
Add automated smoke tests (Playwright) that load each level, place towers, play a few waves at 3× speed and check for console errors. Add an npm script and document it in CLAUDE.md.
```

- [ ] **49. Modules and Vite (optional, late)**
```text
Migrate the code from global scripts to ES modules with Vite, keeping GitHub Pages deployment working. Do it in small steps and verify every level still loads.
```

---

## Prompts to reuse

**Playtest feedback**
```text
I played level N and noticed: [what felt off]. Investigate and fix it.
```

**Publish to friends**
```text
Everything looks good – push to GitHub so the live site updates.
```

**Check the state**
```text
Summarise what's changed since the last push and whether anything is half-finished.
```
