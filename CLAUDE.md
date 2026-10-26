# Castle Defense (Slotsforsvar) – project notes for Claude Code

Medieval 3D tower defense game for the browser (three.js r128). Built as a hobby project, the goal is fun.
**The user is Danish but prefers replies in English.** All in-game text is English – write it as natural, native English, never a literal translation from Danish. The on-screen title is "Castle Defense"; the repo/package name stays `slotsforsvar`.

## Workflow
The user works in one session per task. Commit when a task is done, and add anything a future session needs to know (new rules, gotchas) to this file or `docs/GAME_DESIGN.md` – a new session only knows what is written down here.
**Every change gets a `CHANGELOG.md` entry** in the same commit: add a bullet under today's date (create the date heading at the top if missing, newest first). Write it for a player, in plain English – what changed, not how the code works. Small tweaks still count; pure notes/docs edits can share one "Project housekeeping" bullet.

## Run
- `npm install` then `npm run dev` → http://localhost:5173 (static server, no bundler).
- `npm run check` → parses all js files in the order index.html loads them (no browser needed).
- **Live online:** https://lykhan28.github.io/slotsforsvar/ via GitHub Pages (repo `github.com/Lykhan28/slotsforsvar`, branch `main`, root folder). Friends play there. `git push` updates the site in about a minute, so only push when the game works; ask the user before pushing.
- three.js and its post-processing scripts load from CDNs (see index.html). Needs internet. Vendoring them into `vendor/` is on the roadmap.

## Architecture
Plain classic `<script>` files, **no modules**: they share one global scope, and **load order matters** (see index.html). All code was originally one 113 KB script; the split follows its section markers and is byte-identical to the original.

| File | Contents |
|---|---|
| `js/01-config.js` | **levels** `LEVELS` (size, roads, blocked cells, theme, gold, enemy health) and environment `THEMES`; picks the level `LVN`/`LV`/`TH` at load; grid `W×H` (60 units per cell), roads `PATHS` (one per breach, `WP`=first), `road`/`blk` sets, breach/gate frames `ENT`/`GATE` with `CW()`/`BW()`, default camera `CAM0`, tower table `T`, enemy table `E`, palette `P`, `wx/wz/cx/cz` coordinate helpers |
| `js/02-renderer.js` | renderer, camera, lights, sky/env map, bloom + grade post-processing (falls back if the CDN scripts are missing) |
| `js/03-textures.js` | procedural PBR textures (`genTex`: albedo + normal from noise), `TX.*` |
| `js/04-materials.js` | `part()` mesh helper, `mat()` picks texture by hex colour (STONE/WOOD/METAL/SKIN/… sets), `bake()` merges static meshes, glow sprites, blob shadows |
| `js/05-towers.js` | `buildTower()` models for all towers + the little men (`chibi`) – must load BEFORE scenery, which calls `chibi` at top level |
| `js/06-scenery.js` | terrain, walls with gaps, breach(es), castle (all placed from the level), biome props per theme (ruins, graves, lava, mushrooms, dead/burning trees, pools), blocked-cell obstacles, ambient particles (`motes`/`moteAnim`), vegetation (wind shader), butterflies |
| `js/07-enemies.js` | enemy rigs (`makeEnemy`), status effects (`fxStatus`: arrows stuck, ice, shock, poison bubbles, stars), animation (`animEnemy`, `animDying`) |
| `js/08-effects.js` | particles, floating damage text |
| `js/09-game.js` | game state `g`, waves, spawning, targeting, bullets, damage, win/lose checks (`update(dt)`) and visual sync (`sync(dt)`) |
| `js/10-ui.js` | HUD, tower dock, inspector with tower stats (`tstat`, `infoHTML`), next-wave preview, end screen, minimap |
| `js/11-audio.js` | all audio generated with WebAudio (no files): music (calm/battle) and `SX` sound effects, `snd(name)` |
| `js/12-input.js` | pointer/touch/mouse camera (orbit 360°, zoom, pan), placing/selecting towers |
| `js/13-ending.js` | enemy army outside the wall, victory fireworks, defeat (castle burns, keep collapses) |
| `js/14-menu.js` | main menu (Play/Levels/Settings/Changelog/Quit), level picker and progress (`PROG`, localStorage `sfprog`; chosen level `sflv`), `goLevel()`, `MENU` state, graphics settings `GFX` (glow/shadows/resolution, saved in localStorage `sfgfx`), in-game changelog (fetches and renders `CHANGELOG.md`) |
| `js/15-main.js` | render loop, start (opens the menu) |

## Gotchas learned the hard way
- **Function declarations are NOT hoisted across script files.** Top-level code in a file may only call functions defined in earlier files (or itself). This caused a black screen (`chibi is not defined`, then follow-up `rng` errors) when scenery loaded before towers. Functions called later at runtime (from `update`/`sync`/event handlers) are fine.
- **Layers:** most scenery/effects are on three.js layer 1 (`L1()`), the camera must have `cam.layers.enableAll()` or the ground vanishes.
- **`bake(root)`** merges non-animated meshes per material. Anything animated must have `userData.keep = true` and be baked separately. Towers/enemies are baked after construction.
- **Enemy templates** are built once (`tpl[type]`) and cloned with `clone(true)`; animated joints are found by name (`rig[name]`, e.g. `H0/K0` hip/knee, `S/E` shoulder/elbow, `TO` torso, `HD` head, `W0/W1` wings).
- **Never swap enemy materials for hit feedback.** An earlier white-flash did that, also hit the blob shadow (square artefacts) and bloomed. Use `hf()` / `fxStatus()` instead.
- **Name clashes:** terrain noise is `nz`, audio noise is `nzs`. Top-level `const` names are global across files – check for duplicates (`npm run check` catches syntax, not all clashes).
- **Health bar sprites** must be centred at the same point (don't offset in world x), or they drift when the camera rotates.
- Audio only starts after the first user gesture (`auInit`).
- **Layout / HUD (css/style.css):** body is `100dvh` with no page scroll. On wide screens `#wrap` (the 3D view) fills the whole window and the HUD floats over it as frosted-glass panels: `#top` (title + gold/lives/wave pills), `#side` (minimap, camera/sound buttons, `#help` popover), and `#panel` at the bottom (`#ip` inspector, `#dock`/`#towers` tower dock, `#act` wave controls). At ≤700 px wide (phones upright) `#panel` becomes a normal block *below* `#wrap` instead. The dock switches to 4 columns via a **container query** on `#dock` – don't put `container-type` on the element that should shrink-wrap its content (inline-size containment makes it collapse to zero width). Keep new HUD elements from pushing the page taller than the window.
- **Camera framing:** `resize()` in js/02-renderer.js reads `#wrap`'s size (window resize + ResizeObserver). Narrower than 4:3 widens `cam.fov` so the board stays visible. When `#panel` is `position:absolute` (overlaying the view) it uses `cam.setViewOffset` to render the lower part of a taller frustum, which lifts the board above the bottom HUD; `cam.aspect` is then the *full* frustum's aspect (`w/(h+d)`). Raycasting in js/12-input.js works unchanged because it uses the camera's projection.
- **Colour grade:** the overall look (saturation, warm highlights/cool shadows, vignette) lives in the `GRADE` shader in js/02-renderer.js, plus exposure, sky gradient, fog and lights there. Base exposure and sun strength are `EXPO`/`SUN0` – js/13-ending.js dims the scene from them and resets to them, so never hard-code those numbers. Do contrast in the grade *after* the gamma `pow` – contrast around 0.5 in linear space crushes the shadows to black. The game was toned down from a very saturated look on purpose – keep new colours earthy and let emissives (fire, magic) be the bright accents. Without the CDN post-processing scripts the grade pass is skipped.
- **Inspector numbers** come from `tstat()` in js/10-ui.js (built on `stat()` from js/09-game.js): DPS counts every target a shot hits (arrows × level, whole lightning chain with −8% per jump); Alchemist DPS is poison per second on each enemy. If you change tower mechanics, update `tstat()` and the chips in `infoHTML()` too. The next-wave preview uses `waveMix(w)` in js/09-game.js, which `startWave()` also uses.
- **Main menu pauses the game:** while `MENU.open`, the loop skips `update()` (only `sync()` runs) and a capture-phase keydown listener in js/14-menu.js swallows game hotkeys. Quit sets `MENU.quit`, which stops the render loop entirely; `menuBack()` restarts it. Browsers only let `window.close()` close tabs a script opened, so Quit normally ends on the "Thanks for playing" page.
- **The in-game changelog reads `CHANGELOG.md` over HTTP,** so keep its format (`## YYYY-MM-DD` headings, `- ` bullets, `**bold**`). `.nojekyll` in the repo root makes GitHub Pages serve the .md file as-is – don't delete it.
- **Verify in a browser before claiming something works.** Start the dev server via `.claude/launch.json` (config `dev`, port 5173; if the port is taken by another session's server, use config `dev-alt` on port 5174), read console errors and take a screenshot. Everything is global, so you can inspect or drive the game from the page's JS console (`g`, `T`, `ui()`, `startWave()`), e.g. set `g.sel`/`g.over` to check panels and end screens without playing.

## Levels
- 8 levels in `LEVELS` (js/01-config.js), each with its own theme in `THEMES`: Greenmeadow (field) → Darkwood → Emberwood (burning forest, burnt houses) → Mirefen (marsh) → Ashfall (ruined town) → Barrow Moor (graveyard) → Scorched Badlands (lava) → The Dread Wastes. Later levels get more blocked cells, roads with fewer overlaps, and levels 7–8 have two breaches. Winning a level unlocks the next.
- **The level is chosen once at page load** (`?level=N` in the URL wins, else localStorage `sflv`) and the whole scene is built for it. Switching level reloads the page (`goLevel()`; sessionStorage `sfgo` makes the new page skip the menu). Don't try to swap levels at runtime – everything is top-level `const`s and baked meshes. `?level=N` is handy for testing any level without unlocking it.
- **Breach and castle frames:** the castle and breach scenery are still modelled in their original coordinates (gate on the east wall at z=2.5, breach on the west wall at z=-2.5). They're wrapped in groups turned to face the level's gate/breach; for world positions of those original coordinates use `CW(x,z)` (castle, e.g. ending fires, fireworks, keep) and `BW(x,z,i)` (breach i, e.g. the enemy army), and `toC`/`toB` for the inverse.
- A road is a list of cell waypoints from just outside the wall (the breach side is worked out from it) to just outside the gate; all roads must end at the same gate. Enemies carry their road in `e.R`; `prog()` compares remaining road length so towers pick the right target across roads (it's negative – never start a "best so far" at -1).
- The default camera looks from the south, or from the north when the castle is on the south side (`CAM0`). Scenery is denser on the far side (`ZF`), and trees near the camera's wall are kept back so they don't hide the board.
- Theme colours go through `TH` (sky, fog, lights, ground, grass, rocks, smoke, grade saturation/tint). Barren themes set `gt:'dirt'` to swap the grass texture for bare earth. Rock colour `rc` matters – the default light rock glows against dark ground.

## Current rules (details in docs/GAME_DESIGN.md)
8 tower types (the Wizard has key `frost` for historical reasons; it now banishes enemies back along the road via `banish()` in js/09-game.js, enemy field `bn` = immunity timer), 4 enemy types, 20 waves, boss every 5th wave.

## Ideas / roadmap
- Difficulty modes, highscores, pause. More levels: add an entry to `LEVELS` (and a theme if needed).
- Barracks tower (soldiers that block enemies), more enemy types (flying, healers, armoured).
- Vendor three.js locally; optionally migrate to ES modules + Vite once the split has settled.
- Performance options for phones (quality toggle: bloom, shadows, vegetation count).
- Real 3D models/audio files (glTF) instead of everything generated in code.
